import * as Location from "expo-location";
import { useCallback, useState } from "react";
import { Platform } from "react-native";
import type { Region } from "react-native-maps";

const locationDelta = {
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
} as const;

const lastKnownMaxAgeMs = 1000 * 60 * 10;
const lastKnownRequiredAccuracyMeters = 1000;

export type IosMapLocationStatus = "idle" | "requesting" | "granted" | "denied" | "error";

function getRegionFromLocation(location: Location.LocationObject): Region {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    ...locationDelta,
  };
}

export function useIosMapLocation() {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [region, setRegion] = useState<Region>();
  const [status, setStatus] = useState<IosMapLocationStatus>("idle");

  const centerOnUser = useCallback(async () => {
    if (Platform.OS !== "ios") {
      return;
    }

    setErrorMessage(undefined);
    setStatus("requesting");

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setHasLocationPermission(false);
        setStatus("denied");
        return;
      }

      setHasLocationPermission(true);
      setStatus("granted");

      const lastKnownLocation = await Location.getLastKnownPositionAsync({
        maxAge: lastKnownMaxAgeMs,
        requiredAccuracy: lastKnownRequiredAccuracyMeters,
      });

      if (lastKnownLocation) {
        setRegion(getRegionFromLocation(lastKnownLocation));
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setRegion(getRegionFromLocation(currentLocation));
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Could not read current location.");
    }
  }, []);

  return {
    centerOnUser,
    errorMessage,
    hasLocationPermission,
    region,
    status,
  };
}
