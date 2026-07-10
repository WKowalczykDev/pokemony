import type { MapPin } from "@/types/map";

import { getString, setString, subscribe } from "./storage";

export const MAP_PINS_KEY = "mapPins:v1";

export type AddMapPinInput = {
  latitude: number;
  longitude: number;
  pokemonName?: string;
  pokemonId?: number;
  imageUrl?: string;
  source?: MapPin["source"];
};

const fallbackPokemonName = "No favorite selected";

function isFiniteLatitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -90 && value <= 90;
}

function isFiniteLongitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -180 && value <= 180;
}

function normalizeOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : undefined;
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function normalizeSource(value: unknown): MapPin["source"] | undefined {
  return value === "manual" || value === "camera" ? value : undefined;
}

function isValidIsoDate(value: string) {
  return Number.isFinite(Date.parse(value));
}

function normalizeStoredMapPin(value: unknown): MapPin | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as Partial<MapPin>;
  const id = normalizeOptionalString(candidate.id);
  const pokemonName = normalizeOptionalString(candidate.pokemonName);
  const createdAt = normalizeOptionalString(candidate.createdAt);
  const source = normalizeSource(candidate.source);

  if (
    !id ||
    !isFiniteLatitude(candidate.latitude) ||
    !isFiniteLongitude(candidate.longitude) ||
    !pokemonName ||
    !createdAt ||
    !isValidIsoDate(createdAt) ||
    !source
  ) {
    return undefined;
  }

  return {
    createdAt,
    id,
    imageUrl: normalizeOptionalString(candidate.imageUrl),
    latitude: candidate.latitude,
    longitude: candidate.longitude,
    pokemonId: normalizeOptionalNumber(candidate.pokemonId),
    pokemonName,
    source,
  };
}

function normalizeMapPins(value: unknown): MapPin[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seenIds = new Set<string>();
  const pins: MapPin[] = [];

  for (const item of value) {
    const pin = normalizeStoredMapPin(item);

    if (!pin || seenIds.has(pin.id)) {
      continue;
    }

    seenIds.add(pin.id);
    pins.push(pin);
  }

  return pins;
}

function createMapPinId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createMapPin(input: AddMapPinInput): MapPin {
  const pokemonName = normalizeOptionalString(input.pokemonName) ?? fallbackPokemonName;

  return {
    createdAt: new Date().toISOString(),
    id: createMapPinId(),
    imageUrl: normalizeOptionalString(input.imageUrl),
    latitude: input.latitude,
    longitude: input.longitude,
    pokemonId: normalizeOptionalNumber(input.pokemonId),
    pokemonName,
    source: input.source ?? "manual",
  };
}

export function parseMapPins(value: string | undefined): MapPin[] {
  if (!value) {
    return [];
  }

  try {
    return normalizeMapPins(JSON.parse(value));
  } catch {
    return [];
  }
}

export function readMapPins(): MapPin[] {
  return parseMapPins(getString(MAP_PINS_KEY));
}

export function writeMapPins(pins: MapPin[]): MapPin[] {
  const normalizedPins = normalizeMapPins(pins);
  setString(MAP_PINS_KEY, JSON.stringify(normalizedPins));

  return normalizedPins;
}

export function addMapPin(input: AddMapPinInput): MapPin[] {
  if (!isFiniteLatitude(input.latitude) || !isFiniteLongitude(input.longitude)) {
    return readMapPins();
  }

  return writeMapPins([...readMapPins(), createMapPin(input)]);
}

export function removeMapPin(id: string): MapPin[] {
  const normalizedId = normalizeOptionalString(id);

  if (!normalizedId) {
    return readMapPins();
  }

  return writeMapPins(readMapPins().filter((pin) => pin.id !== normalizedId));
}

export function subscribeToMapPins(onChange: () => void) {
  return subscribe(MAP_PINS_KEY, onChange);
}
