import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-xl font-bold">Pokémon Explorer</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
