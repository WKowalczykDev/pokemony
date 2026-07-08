import { useCameraDevice, useCameraPermission } from "react-native-vision-camera";

export function useCamera() {
  const cameraPermission = useCameraPermission();
  const device = useCameraDevice("front");

  return {
    cameraPermission,
    device,
    requestCameraPermission: cameraPermission.requestPermission,
  };
}
