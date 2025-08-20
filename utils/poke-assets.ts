export function idFromUrl(url: string): number | null {
  const m = url.match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
}
export function artUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
export function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
