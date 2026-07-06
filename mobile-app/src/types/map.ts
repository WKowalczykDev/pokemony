export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  pokemonName: string;
  pokemonId?: number;
  imageUrl?: string;
  createdAt: string;
  source: "manual" | "camera";
};
