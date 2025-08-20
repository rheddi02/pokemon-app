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
import { useInView } from "react-intersection-observer";

interface PokemonCardProps {
  name: string;
  url: string;
  types?: Array<{ type: { name: string } }>;
  stats?: Array<{ stat: { name: string }; base_stat: number }>;
}

export function PokemonCard({ name, url, types = [], stats = [] }: PokemonCardProps) {
  const id = idFromUrl(url);
  const img = id ? artUrl(id) : spriteUrl(1); // Fallback to sprite of Pokemon #1
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(name);

  const { ref, inView } = useInView({
    triggerOnce: true, // load only once
    threshold: 0.2, // 20% visible
  });

  const { data: pokemon, isLoading, isError } = useQuery({
    queryKey: ["pokemon-detail", name],
    queryFn: ({ signal }) => getPokemonDetail(name, signal),
    enabled: inView,
    staleTime: 1000 * 60 * 10, // cache 10 min
  });

  return (
    <div className="pokemon-card group animate-fade-in-up" ref={ref}>
      <div className="relative">
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(name);
          }}
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
        <Link href={`/pokemon/${pokemon?.name}`} className="block">
          {/* Pokemon Image */}
          <div className="aspect-square flex items-center justify-center p-4 mb-4 bg-gradient-hero rounded-lg">
            <Image
              src={img}
              alt={name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              height={200}
              width={200}
            />
          </div>

          {/* Pokemon Info */}
          <div className="space-y-3">
            {/* Name and ID */}
            <div className="text-center">
              <h3 className="font-semibold text-lg capitalize truncate" title={pokemon?.name}>
                {pokemon?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                #{pokemon?.id.toString().padStart(3, '0')}
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
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
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
    </div>
  );
}
