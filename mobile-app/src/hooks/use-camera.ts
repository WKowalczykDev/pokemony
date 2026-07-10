import { Image as ExpoImage } from "expo-image";
import { Asset, usePermissions as useMediaLibraryPermissions } from "expo-media-library";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Linking } from "react-native";
import { Images, loadImage, type Image as NitroImage } from "react-native-nitro-image";
import { useCameraDevice, useCameraPermission, usePhotoOutput } from "react-native-vision-camera";

import { getPokemonImageCacheKey, getPokemonOfficialArtworkImageUrl } from "@/api/pokemon-images";
import { useFavoritePokemon } from "@/hooks/use-favorite-pokemon";
import { useFavoritePokemonDetails } from "@/hooks/use-favorite-pokemon-details";
import { addMapPin } from "@/storage/map-pin-storage";

import type { FaceOverlay } from "./use-face-overlay";

export type CapturePhotoOptions = {
  faceOverlay?: FaceOverlay;
  fallbackImageUrl?: string;
  imageUrl?: string;
  previewMirrored: boolean;
  previewSize: { width: number; height: number };
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

async function loadPokemonImage(urls: (string | undefined)[]) {
  for (const imageUrl of urls) {
    const cachePath = imageUrl
      ? await ExpoImage.getCachePathAsync(getPokemonImageCacheKey(imageUrl)).catch(() => null)
      : null;

    if (cachePath) {
      try {
        return await loadImage({ filePath: cachePath });
      } catch {}
    }
  }

  for (const imageUrl of urls) {
    if (!imageUrl) {
      continue;
    }

    try {
      const response = await fetch(imageUrl);

      if (response.ok) {
        return await Images.loadFromEncodedImageDataAsync({
          buffer: await response.arrayBuffer(),
          height: 0,
          imageFormat: "png",
          width: 0,
        });
      }
    } catch {}
  }

  return null;
}

async function renderPokemon(
  photoImage: NitroImage,
  photoMirrored: boolean,
  options?: CapturePhotoOptions,
) {
  const faceOverlay = options?.faceOverlay;
  const urls = [options?.imageUrl, options?.fallbackImageUrl];

  if (!faceOverlay || !urls.some(Boolean)) {
    return null;
  }

  const scale = Math.max(
    options.previewSize.width / photoImage.width,
    options.previewSize.height / photoImage.height,
  );
  const rawX =
    (faceOverlay.left -
      faceOverlay.size / 2 -
      (options.previewSize.width - photoImage.width * scale) / 2) /
    scale;
  const rawY =
    (faceOverlay.top -
      faceOverlay.size * 0.8 -
      (options.previewSize.height - photoImage.height * scale) / 2) /
    scale;
  const rawSize = faceOverlay.size / scale;
  const imageX =
    options.previewMirrored !== photoMirrored ? photoImage.width - rawX - rawSize : rawX;
  const x = clamp(imageX, 0, photoImage.width);
  const y = clamp(rawY, 0, photoImage.height);
  const width = clamp(imageX + rawSize, 0, photoImage.width) - x;
  const height = clamp(rawY + rawSize, 0, photoImage.height) - y;
  const pokemonImage = width >= 1 && height >= 1 ? await loadPokemonImage(urls) : null;

  if (!pokemonImage) {
    return null;
  }

  try {
    return await photoImage.renderIntoAsync(
      pokemonImage,
      Math.round(x),
      Math.round(y),
      Math.round(width),
      Math.round(height),
    );
  } catch {
    return null;
  } finally {
    pokemonImage.dispose();
  }
}

function toFileUri(filePath: string) {
  return filePath.startsWith("file://") ? filePath : `file://${filePath}`;
}

async function getCurrentPhotoLocation() {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      return undefined;
    }

    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch {
    return undefined;
  }
}

export function useCamera() {
  const cameraPermission = useCameraPermission();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = useMediaLibraryPermissions({
    granularPermissions: ["photo"],
    writeOnly: false,
  });
  const device = useCameraDevice("front");
  const photoOutput = usePhotoOutput();
  const { favoriteIds } = useFavoritePokemon();
  const currentFavoriteId = favoriteIds.at(-1);
  const currentFavoriteIds = useMemo(
    () => (currentFavoriteId ? [currentFavoriteId] : []),
    [currentFavoriteId],
  );
  const { pokemon: currentFavoritePokemon } = useFavoritePokemonDetails(currentFavoriteIds);
  const currentFavorite = currentFavoritePokemon[0];
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMessage, setCaptureMessage] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);

  const requestOrOpenCameraPermission = useCallback(() => {
    if (cameraPermission.canRequestPermission) {
      void cameraPermission.requestPermission();
      return;
    }

    void Linking.openSettings();
  }, [cameraPermission]);

  useEffect(() => {
    if (!captureMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setCaptureMessage(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [captureMessage]);

  const capturePhoto = useCallback(
    async (options?: CapturePhotoOptions) => {
      if (isCapturing) {
        return;
      }

      setIsCapturing(true);
      setCaptureMessage(null);
      setCaptureError(null);

      try {
        let permission = mediaLibraryPermission;

        if (!permission?.granted) {
          if (permission && !permission.canAskAgain) {
            setCaptureError("Photo library permission is blocked. Enable it in system settings.");
            void Linking.openSettings();
            return;
          }

          permission = await requestMediaLibraryPermission();
        }

        if (!permission.granted) {
          setCaptureError("Photo library permission is required to save photos.");
          return;
        }

        const photo = await photoOutput.capturePhoto({ flashMode: "off" }, {});
        let photoImage: NitroImage | null = null;
        let finalImage: NitroImage | null = null;

        try {
          photoImage = await photo.toImageAsync();
          finalImage = (await renderPokemon(photoImage, photo.isMirrored, options)) ?? photoImage;

          const finalPhotoPath = await finalImage.saveToTemporaryFileAsync("jpg", 90);

          const asset = await Asset.create(toFileUri(finalPhotoPath));

          if (!currentFavoriteId) {
            setCaptureMessage("Zdjecie zapisane w galerii. Brak favorite, pin nie zostal dodany.");
            return;
          }

          const location = await getCurrentPhotoLocation();

          if (!location) {
            setCaptureMessage(
              "Zdjecie zapisane w galerii. Brak lokalizacji, pin nie zostal dodany.",
            );
            return;
          }

          addMapPin({
            imageUrl:
              currentFavorite?.imageUrl ?? getPokemonOfficialArtworkImageUrl(currentFavoriteId),
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            photoAssetId: asset.id,
            pokemonId: currentFavorite?.id ?? currentFavoriteId,
            pokemonName: currentFavorite?.name ?? `Pokemon #${currentFavoriteId}`,
            source: "camera",
          });

          setCaptureMessage("Zdjecie zapisane w galerii i dodane do mapy.");
        } finally {
          photo.dispose();

          if (finalImage && finalImage !== photoImage) {
            finalImage.dispose();
          }

          photoImage?.dispose();
        }
      } catch {
        setCaptureError("Nie udalo sie zrobic albo zapisac zdjecia.");
      } finally {
        setIsCapturing(false);
      }
    },
    [
      currentFavorite,
      currentFavoriteId,
      isCapturing,
      mediaLibraryPermission,
      photoOutput,
      requestMediaLibraryPermission,
    ],
  );

  return {
    cameraPermission,
    captureError,
    captureMessage,
    capturePhoto,
    device,
    isCapturing,
    photoOutput,
    requestOrOpenCameraPermission,
  };
}
