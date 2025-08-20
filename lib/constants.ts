export const POKEMON_CONFIG = {
  PAGE_SIZE: 24,
  CACHE_TIME: {
    POKEMON_LIST: 1000 * 60 * 5, // 5 minutes
    POKEMON_DETAIL: 1000 * 60 * 10, // 10 minutes
    TYPES: 1000 * 60 * 60, // 1 hour
  },
  DEBOUNCE_DELAY: 500,
  MAX_POKEMON_FETCH: 1000,
} as const;

export const STORAGE_KEYS = {
  FAVORITES: 'pokemon-favorites',
} as const;

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];
