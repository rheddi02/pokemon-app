"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { idFromUrl, artUrl, spriteUrl } from "@/utils/poke-assets";
import { useFavorites } from "@/components/providers/favorites-provider";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import { TypeBadge } from "@/components/pokemon/type-badge";
import { useQuery } from "@tanstack/react-query";
import { getPokemonDetail } from "@/utils/api";
import { POKEMON_CONFIG } from "@/lib/constants";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";

interface PokemonCardProps {
  name: string;
  url: string;
  types?: Array<{ type: { name: string } }>;
  stats?: Array<{ stat: { name: string }; base_stat: number }>;
  index?: number;
}

export function PokemonCard({ name, url, types = [], stats = [], index = 0 }: PokemonCardProps) {
  const id = idFromUrl(url);
  const img = id ? artUrl(id) : spriteUrl(1); // Fallback to sprite of Pokemon #1
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(name);
  const searchParams = useSearchParams();
  
  // Preserve current URL params when navigating to Pokemon detail
  const pokemonUrl = `/pokemon/${name}?${searchParams.toString()}`;

  const { ref, inView } = useInView({
    triggerOnce: true, // load only once
    threshold: 0.2, // 20% visible
  });

  const { data: pokemon, isLoading, isError } = useQuery({
    queryKey: ["pokemon-detail", name],
    queryFn: ({ signal }) => getPokemonDetail(name, signal),
    enabled: inView,
    staleTime: POKEMON_CONFIG.CACHE_TIME.POKEMON_DETAIL,
    retry: (failureCount, error) => {
      return failureCount < 3 && (error as any)?.status !== 404;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });


  return (
    <article 
      className="pokemon-card group animate-fade-in-up" 
      ref={ref}
      role="article"
      aria-labelledby={`pokemon-${name}`}
    >
      <div className="relative">
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 z-10 h-8 w-8 transition-opacity ${
            fav ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(name);
          }}
          aria-label={fav ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
          title={fav ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        >
          <Heart
            className={`h-4 w-4 ${
              fav 
                ? "fill-destructive text-destructive" 
                : "text-muted-foreground hover:text-destructive"
            }`}
          />
        </Button>

        {/* Pokemon Link */}
        <Link 
          href={pokemonUrl} 
          className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          aria-describedby={`pokemon-${name}-stats`}
        >
          {/* Pokemon Image */}
          <div className="aspect-square flex items-center justify-center p-4 mb-4 bg-gradient-hero rounded-lg">
            <Image
              src={img}
              alt={`${name} pokemon artwork`}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              loading={index < 6 ? "eager" : "lazy"}
              priority={index < 6}
              height={200}
              width={200}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
            />
          </div>

          {/* Pokemon Info */}
          <div className="space-y-3">
            {/* Name and ID */}
            <div className="text-center">
              <h3 
                id={`pokemon-${name}`}
                className="font-semibold text-base capitalize truncate" 
                title={pokemon?.name || name}
              >
                {pokemon?.name || name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {pokemon?.id ? `#${pokemon.id.toString().padStart(3, '0')}` : '#000'}
              </p>
            </div>

            {/* Types */}
            <div className="flex flex-wrap gap-1 justify-center">
              {pokemon?.types.map((type) => (
                <TypeBadge 
                  key={type.type.name} 
                  type={type.type.name}
                  className="text-xs px-2 py-1"
                />
              ))}
            </div>

            {/* Stats Preview */}
            <div 
              id={`pokemon-${name}-stats`}
              className="grid grid-cols-3 gap-2 text-center text-xs"
            >
              <div>
                <p className="text-muted-foreground">HP</p>
                <p className="font-semibold">
                  {pokemon?.stats.find(s => s.stat.name === 'hp')?.base_stat || 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">ATK</p>
                <p className="font-semibold">
                  {pokemon?.stats.find(s => s.stat.name === 'attack')?.base_stat || 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">DEF</p>
                <p className="font-semibold">
                  {pokemon?.stats.find(s => s.stat.name === 'defense')?.base_stat || 0}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
}
