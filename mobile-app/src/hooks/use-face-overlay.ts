import { useCallback, useMemo, useState } from "react";
import { type CameraDevice } from "react-native-vision-camera";
import {
  createFaceDetectorOutput,
  type Face,
  type FaceDetectorOptions,
} from "react-native-vision-camera-face-detector";

export type FaceOverlay = {
  left: number;
  top: number;
  size: number;
} | null;

type PreviewSize = {
  width: number;
  height: number;
};

type UseFaceOverlayParams = {
  device?: CameraDevice;
  previewSize: PreviewSize;
};

function getFirstFaceOverlay(faces: Face[]): FaceOverlay {
  const face = faces[0];
  if (!face) {
    return null;
  }

  const { bounds } = face;
  const size = Math.max(50, Math.min(bounds.width * 0.8, 140));

  return {
    left: bounds.x + bounds.width / 2,
    top: Math.max(bounds.y + bounds.height * 0.18, 0),
    size:size,
  };
}

export function useFaceOverlay({ device, previewSize }: UseFaceOverlayParams) {
  const [faceOverlay, setFaceOverlay] = useState<FaceOverlay>(null);
  const cameraFacing =
    device?.position === "front" || device?.position === "back" ? device.position : undefined;

  const faceDetectorOptions = useMemo<FaceDetectorOptions>(
    () => ({
      ...(cameraFacing ? { cameraFacing } : {}),
      autoMode: true,
      performanceMode: "fast",
      windowHeight: Math.max(previewSize.height, 1),
      windowWidth: Math.max(previewSize.width, 1),
    }),
    [cameraFacing, previewSize.height, previewSize.width],
  );

  const handleFacesDetected = useCallback((faces: Face[]) => {
    setFaceOverlay(getFirstFaceOverlay(faces));
  }, []);

  const handleDetectionError = useCallback(() => {
    setFaceOverlay(null);
  }, []);

  const frameOutput = useMemo(
    () =>
      createFaceDetectorOutput({
        ...faceDetectorOptions,
        outputResolution: "preview",
        onFacesDetected: handleFacesDetected,
        onError: handleDetectionError,
      }),
    [faceDetectorOptions, handleDetectionError, handleFacesDetected],
  );

  return {
    faceOverlay,
    frameOutput,
  };
}
