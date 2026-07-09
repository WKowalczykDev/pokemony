import { Asset, usePermissions as useMediaLibraryPermissions } from "expo-media-library";
import { useCallback, useState, useEffect } from "react";
import { Linking } from "react-native";
import { useCameraDevice, useCameraPermission, usePhotoOutput } from "react-native-vision-camera";

function toFileUri(filePath: string) {
  return filePath.startsWith("file://") ? filePath : `file://${filePath}`;
}

export function useCamera() {
  const cameraPermission = useCameraPermission();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = useMediaLibraryPermissions({
    granularPermissions: ["photo"],
    writeOnly: true,
  });
  const device = useCameraDevice("front");
  const photoOutput = usePhotoOutput();
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

  const capturePhoto = useCallback(async () => {
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

      const photoFile = await photoOutput.capturePhotoToFile({ flashMode: "off" }, {});

      await Asset.create(toFileUri(photoFile.filePath));
      setCaptureMessage("Zdjecie zapisane w galerii.");
    } catch {
      setCaptureError("Nie udalo sie zrobic albo zapisac zdjecia.");
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, mediaLibraryPermission, photoOutput, requestMediaLibraryPermission]);

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
