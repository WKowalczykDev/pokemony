export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  pokemonName: string;
  pokemonId?: number;
  imageUrl?: string;
  photoAssetId?: string;
  createdAt: string;
  source: "manual" | "camera";
};
