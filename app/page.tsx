"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPokemonList, getPokemonByType } from "@/utils/api";
import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { Filters } from "@/components/pokemon/filters";
import { PokemonListSkeleton } from "@/components/pokemon/pokemon-list-skeleton";
import { ErrorState } from "@/components/pokemon/error-state";
import { EmptyState } from "@/components/pokemon/empty-state";
import { Pagination } from "@/components/pokemon/pagination";
import { Header } from "@/components/layout/header";
import { useQueryParams } from "@/hooks/use-query-params";
import { useFavorites } from "@/components/providers/favorites-provider";
import { idFromUrl } from "@/utils/poke-assets";
import { POKEMON_CONFIG } from "@/lib/constants";

const PAGE_SIZE = POKEMON_CONFIG.PAGE_SIZE;

function HomePageContent() {
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
      getPokemonList({ limit: POKEMON_CONFIG.MAX_POKEMON_FETCH, offset: 0 }, signal),
    staleTime: POKEMON_CONFIG.CACHE_TIME.POKEMON_LIST,
    retry: (failureCount, error) => {
      return failureCount < 3 && (error as any)?.status !== 404;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Optional type restriction
  const typeQ = useQuery({
    queryKey: ["type", type],
    queryFn: ({ signal }) => getPokemonByType(type, signal),
    enabled: Boolean(type),
    staleTime: POKEMON_CONFIG.CACHE_TIME.TYPES,
    retry: (failureCount, error) => {
      return failureCount < 3 && (error as any)?.status !== 404;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
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
              {items.map((r, index) => (
                <div key={r.name} role="listitem">
                  <PokemonCard name={r.name} url={r.url} index={index} />
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

export default function HomePage() {
  return (
    <Suspense fallback={<PokemonListSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}
