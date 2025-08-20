"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPokemonDetail } from "@/utils/api";
import { PokemonCardSkeleton } from "@/components/pokemon/pokemon-card-skeleton";
import { ErrorState } from "@/components/pokemon/error-state";
import { useFavorites } from "@/components/providers/favorites-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypeBadge } from "@/components/pokemon/type-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";

export default function PokemonDetailPage() {
  const { name } = useParams<{ name: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const searchParams = useSearchParams();
  
  // Construct back URL with preserved parameters
  const backUrl = searchParams.toString() ? `/?${searchParams.toString()}` : '/';

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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link href={backUrl}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explorer
            </Button>
          </Link>

          <Button
            variant={fav ? "default" : "outline"}
            onClick={() => toggleFavorite(name)}
            className={fav ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            <Heart className={`h-4 w-4 mr-2 ${fav ? "fill-current" : ""}`} />
            {fav ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pokemon Image */}
          <Card className="pokemon-card">
            <CardContent className="p-8 text-center">
              <img
                src={img}
                alt={d.name}
                className="w-full max-w-sm mx-auto mb-4 animate-pokemon-bounce"
              />
              <h1 className="text-4xl font-bold capitalize mb-2">{d.name}</h1>
              <p className="text-muted-foreground">#{d.id.toString().padStart(3, '0')}</p>
            </CardContent>
          </Card>

          {/* Pokemon Details */}
          <div className="space-y-6">
            {/* Types */}
            <Card>
              <CardHeader>
                <CardTitle>Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {d.types.map((type) => (
                    <TypeBadge key={type.type.name} type={type.type.name} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Base Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {d.stats.map((stat) => (
                    <div key={stat.stat.name} className="flex items-center justify-between">
                      <span className="capitalize text-sm font-medium">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold min-w-[3rem] text-right">
                          {stat.base_stat}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Physical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Physical Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="text-base font-semibold">{(d.height / 10).toFixed(1)} m</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-base font-semibold">{(d.weight / 10).toFixed(1)} kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Abilities */}
            <Card>
              <CardHeader>
                <CardTitle>Abilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {d.abilities.map((ability) => (
                    <Badge
                      key={ability.ability.name}
                      variant={ability.is_hidden ? "secondary" : "outline"}
                      className="capitalize"
                    >
                      {ability.ability.name.replace('-', ' ')}
                      {ability.is_hidden && " (Hidden)"}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
