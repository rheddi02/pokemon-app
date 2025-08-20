"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getPokemonTypes } from "@/utils/api";
import { useQueryParams } from "@/hooks/use-query-params";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { POKEMON_CONFIG } from "@/lib/constants";
import { StarIcon } from "lucide-react";

export function Filters() {
  const { get, setMany } = useQueryParams();

  // search
  const [search, setSearch] = useState(get("q"));
  const debounced = useDebouncedValue(search, POKEMON_CONFIG.DEBOUNCE_DELAY);
  useEffect(() => { setMany({ q: debounced || null }, { replace: true }); }, [debounced, setMany]);
  useEffect(() => { setSearch(get("q")); }, [get]);

  // type
  const type = get("type");
  const { data: types } = useQuery({
    queryKey: ["types"],
    queryFn: ({ signal }) => getPokemonTypes(signal),
    staleTime: POKEMON_CONFIG.CACHE_TIME.TYPES,
    retry: (failureCount, error) => {
      return failureCount < 3 && (error as any)?.status !== 404;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // sort
  const sort = get("sort") || "id";
  const dir = get("dir") || "asc";

  const fav = get("fav") === "1";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search Pokémon…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search Pokémon"
        />
      </div>

      <Select value={type || "all"} onValueChange={(v) => setMany({ type: v === "all" ? null : v }, { replace: true })}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {types?.results?.map((t) => (
            <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={`${sort}:${dir}`} onValueChange={(v) => {
        const [s, d] = v.split(":");
        setMany({ sort: s, dir: d }, { replace: true });
      }}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name:asc">Name ↑</SelectItem>
          <SelectItem value="name:desc">Name ↓</SelectItem>
          <SelectItem value="id:asc">ID ↑</SelectItem>
          <SelectItem value="id:desc">ID ↓</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant={fav ? "default" : "outline"}
        onClick={() => setMany({ fav: fav ? null : "1" }, { replace: true })}
        aria-pressed={fav}
        aria-label="Toggle favorites only"
      >
        <StarIcon className="w-4 h-4 mr-2" /> Favorites
      </Button>
    </div>
  );
}
