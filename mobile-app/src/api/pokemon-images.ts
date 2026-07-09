const SPRITE_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const OFFICIAL_ARTWORK_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export function getPokemonSpriteImageUrl(id: number): string {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

export function getPokemonOfficialArtworkImageUrl(id: number): string {
  return `${OFFICIAL_ARTWORK_BASE_URL}/${id}.png`;
}

export function getPokemonImageCacheKey(imageUrl: string): string {
  return imageUrl;
}
