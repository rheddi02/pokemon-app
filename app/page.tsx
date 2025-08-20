import { Header } from "@/components/layout/header";
import { Filters } from "@/components/pokemon/filters";
import { PokemonListSkeleton } from "@/components/pokemon/list-skeleton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-6">
        <Filters />
        <PokemonListSkeleton />
      </main>
    </div>
  );
}
