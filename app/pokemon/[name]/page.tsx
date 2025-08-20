"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPokemonDetail } from "@/utils/api";
import { PokemonCardSkeleton } from "@/components/pokemon/pokemon-card-skeleton";
import { ErrorState } from "@/components/pokemon/error-state";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";

export default function PokemonDetailPage() {
  const { name } = useParams<{ name: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const detail = useQuery({
    queryKey: ["pokemon-detail", name],
    queryFn: ({ signal }) => getPokemonDetail(name, signal),
    staleTime: 1000 * 60 * 5,
  });

  if (detail.isLoading) {
    return (
      <main className="container mx-auto px-4 py-6">
        <PokemonCardSkeleton />
      </main>
    );
  }
  if (detail.isError || !detail.data) {
    return (
      <main className="container mx-auto px-4 py-6">
        <ErrorState msg="Unable to load details." onRetry={() => detail.refetch()} />
      </main>
    );
  }

  const d = detail.data;
  const img =
    d.sprites.other?.["official-artwork"]?.front_default ??
    d.sprites.other?.home?.front_default ??
    d.sprites.front_default ??
    "";

  const fav = isFavorite(d.name);

  return (
    <main className="container mx-auto px-4 py-6">
      <article className="rounded-xl border p-4 shadow-sm">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold capitalize">
            {d.name} <span className="text-sm text-muted-foreground">#{d.id}</span>
          </h1>
          <Button variant={fav ? "default" : "outline"} onClick={() => toggleFavorite(d.name)}>
            {fav ? "★ Favorite" : "☆ Favorite"}
          </Button>
        </header>
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {img ? <img src={img} alt={d.name} className="h-40 w-40 object-contain" /> : null}

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <div>
              <h2 className="font-medium mb-2">Types</h2>
              <ul className="list-disc list-inside">
                {d.types.map((t) => (
                  <li key={t.type.name} className="capitalize">{t.type.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-medium mb-2">Stats</h2>
              <ul className="list-disc list-inside">
                {d.stats.map((s) => (
                  <li key={s.stat.name} className="capitalize">{s.stat.name}: {s.base_stat}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-medium mb-2">Abilities</h2>
              <ul className="list-disc list-inside">
                {d.abilities.map((a) => (
                  <li key={a.ability.name} className="capitalize">
                    {a.ability.name}{a.is_hidden ? " (hidden)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
