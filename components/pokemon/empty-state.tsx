export function EmptyState({ msg = "No Pokémon found." }: { msg?: string }) {
  return <div role="status" className="rounded border p-6 text-center opacity-80">{msg}</div>;
}
