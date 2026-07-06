import type {
  PokemonAbility,
  PokemonDetails,
  PokemonListItem,
  PokemonStat,
  PokemonType,
  PokemonTypeName,
} from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";
const DEFAULT_LIMIT = 20;
const SPRITE_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export class PokeApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "PokeApiError";
  }
}

export type FetchPokemonPageParams = {
  offset?: number;
  limit?: number;
};

export type PokemonPage = {
  count: number;
  nextOffset?: number;
  previousOffset?: number;
  items: PokemonListItem[];
};

type NamedApiResource = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
};

type PokemonDetailsResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
  types: {
    slot: number;
    type: NamedApiResource;
  }[];
  abilities: {
    ability: NamedApiResource;
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    stat: NamedApiResource;
  }[];
};

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new PokeApiError(`PokeAPI request failed with status ${response.status}.`, response.status);
  }

  return (await response.json()) as T;
}

function getPokemonIdFromUrl(url: string): number {
  const id = Number(url.split("/").filter(Boolean).at(-1));

  if (!Number.isFinite(id)) {
    throw new Error(`Could not parse Pokemon id from URL: ${url}`);
  }

  return id;
}

function getPokemonImageUrl(id: number): string {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

function getOffsetFromUrl(url: string | null): number | undefined {
  if (!url) {
    return undefined;
  }

  const offset = Number(new URL(url).searchParams.get("offset"));
  return Number.isFinite(offset) ? offset : undefined;
}

function mapPokemonListItem(resource: NamedApiResource): PokemonListItem {
  const id = getPokemonIdFromUrl(resource.url);

  return {
    id,
    imageUrl: getPokemonImageUrl(id),
    name: resource.name,
  };
}

function mapPokemonType(typeEntry: PokemonDetailsResponse["types"][number]): PokemonType {
  return {
    name: typeEntry.type.name as PokemonTypeName,
    slot: typeEntry.slot,
  };
}

function mapPokemonAbility(abilityEntry: PokemonDetailsResponse["abilities"][number]): PokemonAbility {
  return {
    isHidden: abilityEntry.is_hidden,
    name: abilityEntry.ability.name,
    slot: abilityEntry.slot,
  };
}

function mapPokemonStat(statEntry: PokemonDetailsResponse["stats"][number]): PokemonStat {
  return {
    name: statEntry.stat.name,
    value: statEntry.base_stat,
  };
}

function mapPokemonDetails(response: PokemonDetailsResponse): PokemonDetails {
  return {
    abilities: response.abilities.map(mapPokemonAbility),
    height: response.height,
    id: response.id,
    imageUrl:
      response.sprites.other?.["official-artwork"]?.front_default ??
      response.sprites.front_default ??
      getPokemonImageUrl(response.id),
    name: response.name,
    stats: response.stats.map(mapPokemonStat),
    types: response.types.map(mapPokemonType),
    weight: response.weight,
  };
}

export async function fetchPokemonPage({
  limit = DEFAULT_LIMIT,
  offset = 0,
}: FetchPokemonPageParams = {}): Promise<PokemonPage> {
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  const response = await getJson<PokemonListResponse>(url);

  return {
    count: response.count,
    items: response.results.map(mapPokemonListItem),
    nextOffset: getOffsetFromUrl(response.next),
    previousOffset: getOffsetFromUrl(response.previous),
  };
}

export async function fetchPokemonDetails(nameOrId: string | number): Promise<PokemonDetails> {
  const normalizedNameOrId =
    typeof nameOrId === "string" ? nameOrId.trim().toLowerCase() : String(nameOrId);

  if (!normalizedNameOrId) {
    throw new Error("Pokemon name or id is required.");
  }

  const response = await getJson<PokemonDetailsResponse>(`${BASE_URL}/pokemon/${normalizedNameOrId}`);

  return mapPokemonDetails(response);
}
