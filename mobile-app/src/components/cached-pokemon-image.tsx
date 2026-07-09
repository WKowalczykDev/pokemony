import { Image, type ImageProps } from "expo-image";
import { useCallback, useState } from "react";

import { getPokemonImageCacheKey } from "@/api/pokemon-images";

type CachedPokemonImageProps = Omit<ImageProps, "cachePolicy" | "recyclingKey" | "source"> & {
  fallbackImageUrl?: string;
  fallbackKey?: string;
  imageUrl?: string;
};

function normalizeImageUrl(imageUrl: string | undefined) {
  const trimmedImageUrl = imageUrl?.trim();
  return trimmedImageUrl ? trimmedImageUrl : undefined;
}

export function CachedPokemonImage({
  fallbackImageUrl,
  fallbackKey,
  imageUrl,
  onError,
  ...imageProps
}: CachedPokemonImageProps) {
  const primaryImageUrl = normalizeImageUrl(imageUrl);
  const normalizedFallbackImageUrl = normalizeImageUrl(fallbackImageUrl);
  const initialImageUrl = primaryImageUrl ?? normalizedFallbackImageUrl;
  const imageStateKey = `${primaryImageUrl ?? ""}:${normalizedFallbackImageUrl ?? ""}`;
  const [imageState, setImageState] = useState<{
    imageUrl: string | undefined;
    stateKey: string;
  }>({
    imageUrl: initialImageUrl,
    stateKey: imageStateKey,
  });
  const activeImageUrl =
    imageState.stateKey === imageStateKey ? imageState.imageUrl : initialImageUrl;
  const cacheKey = activeImageUrl ? getPokemonImageCacheKey(activeImageUrl) : undefined;
  const handleError = useCallback<NonNullable<ImageProps["onError"]>>(
    (event) => {
      onError?.(event);

      setImageState({
        imageUrl:
          activeImageUrl &&
          normalizedFallbackImageUrl &&
          activeImageUrl !== normalizedFallbackImageUrl
            ? normalizedFallbackImageUrl
            : undefined,
        stateKey: imageStateKey,
      });
    },
    [activeImageUrl, imageStateKey, normalizedFallbackImageUrl, onError],
  );

  return (
    <Image
      {...imageProps}
      cachePolicy="memory-disk"
      onError={handleError}
      recyclingKey={cacheKey ?? fallbackKey ?? null}
      source={activeImageUrl ? { cacheKey, uri: activeImageUrl } : undefined}
    />
  );
}
