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
