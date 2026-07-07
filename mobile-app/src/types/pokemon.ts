export type PokemonTypeName =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy"
  | "stellar"
  | "unknown"
  | "shadow";

export type PokemonType = {
  name: PokemonTypeName;
  slot: number;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonAbility = {
  name: string;
  isHidden: boolean;
  slot: number;
};

export type PokemonListItem = {
  id: number;
  name: string;
  imageUrl: string;
};

export type PokemonDetails = {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
};

export type FavoritePokemonIds = number[];

export type FavoritePokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  selectedAt: string;
};
