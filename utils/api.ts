import type {
  PokemonPageResponse,
  PokemonDetail,
  PokemonTypeList,
  PokemonTypeDetail,
  Named,
} from "./types";

const BASE = "https://pokeapi.co/api/v2";

export async function getJSON<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText} - ${url}`);
  return (await res.json()) as T;
}

export async function getPokemonList(
  params: { limit: number; offset: number },
  signal?: AbortSignal
): Promise<PokemonPageResponse> {
  const q = new URLSearchParams({ limit: String(params.limit), offset: String(params.offset) });
  return getJSON<PokemonPageResponse>(`/pokemon?${q.toString()}`, signal);
}

export async function getPokemonDetail(nameOrId: string, signal?: AbortSignal) {
  return getJSON<PokemonDetail>(`/pokemon/${nameOrId}`, signal);
}

export async function getPokemonTypes(signal?: AbortSignal) {
  return getJSON<PokemonTypeList>("/type", signal);
}

export async function getPokemonByType(type: string, signal?: AbortSignal) {
  return getJSON<PokemonTypeDetail>(`/type/${type}`, signal);
}

/** One-time index of all pokemon (names/urls) used for search+client pagination */
export async function getPokemonIndex(signal?: AbortSignal): Promise<Named[]> {
  const limit = 2000; // comfortably above current count
  const data = await getJSON<PokemonPageResponse>(`/pokemon?limit=${limit}&offset=0`, signal);
  return data.results;
}
