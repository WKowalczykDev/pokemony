import { useCallback, useEffect, useState } from "react";

import {
  addMapPin,
  type AddMapPinInput,
  readMapPins,
  subscribeToMapPins,
} from "@/storage/map-pin-storage";

export function useMapPins() {
  const [pins, setPins] = useState(readMapPins);

  useEffect(() => {
    return subscribeToMapPins(() => {
      setPins(readMapPins());
    });
  }, []);

  const addPin = useCallback((input: AddMapPinInput) => {
    setPins(addMapPin(input));
  }, []);

  return {
    addPin,
    pins,
  };
}
