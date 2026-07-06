export type PokemonListItem = {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonDetails = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: PokemonStat[];
};

export type FavoritePokemon = {
  id: number;
  name: string;
  imageUrl: string;
  selectedAt: string;
};
