import { PokemonType } from "@/lib/constants";

export type Named = { name: string; url: string };

export type PokemonPageResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Named[];
};

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      ["official-artwork"]?: { front_default: string | null };
      home?: { front_default: string | null };
    };
  };
  types: Array<{ slot: number; type: Named }>;
  stats: Array<{ base_stat: number; stat: Named }>;
  abilities: Array<{ is_hidden: boolean; ability: Named }>;
};

export type PokemonTypeList = { results: Named[] };
export type PokemonTypeDetail = {
  id: number;
  name: string;
  pokemon: Array<{ pokemon: Named; slot: number }>;
};

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  is_default: boolean;
  location_area_encounters: string;
  sprites: {
    front_default: string;
    front_shiny: string;
    front_female?: string;
    front_shiny_female?: string;
    back_default: string;
    back_shiny: string;
    back_female?: string;
    back_shiny_female?: string;
    other: {
      dream_world: {
        front_default: string;
        front_female?: string;
      };
      home: {
        front_default: string;
        front_female?: string;
        front_shiny: string;
        front_shiny_female?: string;
      };
      "official-artwork": {
        front_default: string;
        front_shiny: string;
      };
      showdown: {
        front_default: string;
        front_female?: string;
        front_shiny: string;
        front_shiny_female?: string;
        back_default: string;
        back_female?: string;
        back_shiny: string;
        back_shiny_female?: string;
      };
    };
  };
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  forms: Array<{
    name: string;
    url: string;
  }>;
  game_indices: Array<{
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }>;
  held_items: Array<{
    item: {
      name: string;
      url: string;
    };
    version_details: Array<{
      rarity: number;
      version: {
        name: string;
        url: string;
      };
    }>;
  }>;
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }>;
  }>;
  species: {
    name: string;
    url: string;
  };
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: PokemonStatName;
      url: string;
    };
  }>;
  types: Array<{
    slot: number;
    type: {
      name: PokemonType;
      url: string;
    };
  }>;
  past_types: Array<{
    generation: {
      name: string;
      url: string;
    };
    types: Array<{
      slot: number;
      type: {
        name: PokemonType;
        url: string;
      };
    }>;
  }>;
}

export type PokemonStatName = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonTypeResponse {
  id: number;
  name: PokemonType;
  pokemon: Array<{
    pokemon: PokemonListItem;
    slot: number;
  }>;
}

export interface APIError extends Error {
  status?: number;
  statusText?: string;
}
