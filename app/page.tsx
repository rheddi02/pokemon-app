"use client";

import { Header } from "@/components/layout/header";
import { Filters } from "@/components/pokemon/filters";
import { PokemonListSkeleton } from "@/components/pokemon/pokemon-list-skeleton";
import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { EmptyState } from "@/components/pokemon/empty-state";
import { ErrorState } from "@/components/pokemon/error-state";
import { Pagination } from "@/components/pokemon/pagination";

import { useQuery } from "@tanstack/react-query";
import { getPokemonList, getPokemonByType } from "@/utils/api";
import { useQueryParams } from "@/hooks/use-query-params";
import { useFavorites } from "@/hooks/use-favorites";
import { idFromUrl } from "@/utils/poke-assets";
import { useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";

const PAGE_SIZE = 24;

export default function HomePage() {
  const { get } = useQueryParams();
  const q = (get("q") || "").toLowerCase().trim();
  const type = get("type") || "";
  const sort = get("sort") || "id";
  const dir = get("dir") || "asc";
  const page = Math.max(1, parseInt(get("page") || "1", 10));
  const favOnly = get("fav") === "1";

  const { favorites } = useFavorites();

  // Base Pokémon list (get all for client-side filtering)
  const listQ = useQuery({
    queryKey: ["pokemon-list"],
    queryFn: ({ signal }) =>
      getPokemonList({ limit: 1000, offset: 0 }, signal), // Get more items for filtering
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  // Optional type restriction
  const typeQ = useQuery({
    queryKey: ["type", type],
    queryFn: ({ signal }) => getPokemonByType(type, signal),
    enabled: Boolean(type),
    staleTime: 1000 * 60 * 30,
  });

  const loading = listQ.isLoading || (type && typeQ.isLoading);
  const error = listQ.isError || (type && typeQ.isError);

  const filteredSorted = useMemo(() => {
    let arr = listQ.data?.results ?? [];

    // Filter by type
    if (type && typeQ.data) {
      const allowed = new Set((typeQ.data.pokemon ?? []).map((p) => p.pokemon.name));
      arr = arr.filter((r) => allowed.has(r.name));
    }

    // Filter by favorites
    if (favOnly) {
      const set = new Set(favorites);
      arr = arr.filter((r) => set.has(r.name));
    }

    // Filter by search query
    if (q) arr = arr.filter((r) => r.name.includes(q));

    // Sorting
    arr = [...arr].sort((a, b) => {
      if (sort === "name") {
        const cmp = a.name.localeCompare(b.name);
        return dir === "asc" ? cmp : -cmp;
      }
      const aid = idFromUrl(a.url) ?? 0;
      const bid = idFromUrl(b.url) ?? 0;
      return dir === "asc" ? aid - bid : bid - aid;
    });

    return arr;
  }, [listQ.data, type, typeQ.data, favOnly, favorites, q, sort, dir]);

  // Pagination should be based on filtered results
  const total = filteredSorted.length;
  const start = (page - 1) * PAGE_SIZE;
  const items = filteredSorted.slice(start, start + PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-6">
        <Filters />

        {loading ? (
          <PokemonListSkeleton />
        ) : error ? (
          <ErrorState
            msg="Failed to load Pokémon."
            onRetry={() => {
              listQ.refetch();
              typeQ.refetch();
            }}
          />
        ) : items.length === 0 ? (
          <EmptyState msg="No Pokémon match your filters." />
        ) : (
          <>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              role="list"
              aria-label="Pokémon results"
            >
              {items.map((r) => (
                <div key={r.name} role="listitem">
                  <PokemonCard name={r.name} url={r.url} />
                </div>
              ))}
            </div>
            <Pagination total={total} pageSize={PAGE_SIZE} />
          </>
        )}
      </main>
    </div>
  );
}
