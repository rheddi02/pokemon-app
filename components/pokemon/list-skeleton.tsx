import { PokemonCardSkeleton } from "./card-skeleton";

export function PokemonListSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <PokemonCardSkeleton key={i} />
      ))}
    </div>
  );
}
