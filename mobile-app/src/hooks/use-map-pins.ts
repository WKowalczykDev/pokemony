import { useCallback, useEffect, useState } from "react";

import {
  addMapPin,
  type AddMapPinInput,
  readMapPins,
  removeMapPin,
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

  const removePin = useCallback((id: string) => {
    setPins(removeMapPin(id));
  }, []);

  return {
    addPin,
    pins,
    removePin,
  };
}
