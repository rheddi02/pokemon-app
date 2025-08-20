import { PokemonCardSkeleton } from "./pokemon-card-skeleton";
export function PokemonListSkeleton({ count = 24 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => <PokemonCardSkeleton key={i} />)}
    </div>
  );
}
