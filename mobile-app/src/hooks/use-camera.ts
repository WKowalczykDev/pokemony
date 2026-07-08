import { useCallback } from "react";
import { Linking } from "react-native";
import { useCameraDevice, useCameraPermission } from "react-native-vision-camera";

export function useCamera() {
  const cameraPermission = useCameraPermission();
  const device = useCameraDevice("front");
  const requestOrOpenCameraPermission = useCallback(() => {
    if (cameraPermission.canRequestPermission) {
      void cameraPermission.requestPermission();
      return;
    }

    void Linking.openSettings();
  }, [cameraPermission]);

  return {
    cameraPermission,
    device,
    requestOrOpenCameraPermission,
  };
}
