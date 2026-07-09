import { useState } from "react";
import { StyleSheet, type LayoutChangeEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera } from "react-native-vision-camera";

import { EmptyState, ErrorState, FaceLabelOverlay } from "@/components";
import { useCamera } from "@/hooks/use-camera";
import { useFaceOverlay } from "@/hooks/use-face-overlay";

import { useIsFocused } from "expo-router";

export default function CameraScreen() {
  const { cameraPermission, device, requestOrOpenCameraPermission } = useCamera();
  const isFocused = useIsFocused();
  const [previewSize, setPreviewSize] = useState({ width: 1, height: 1 });
  const { faceOverlay, frameOutput } = useFaceOverlay({ device, previewSize });

  const handleCameraLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setPreviewSize({ height, width });
  };

  if (!cameraPermission.hasPermission) {
    return (
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.stateContainer}>
        <ErrorState
          message={
            cameraPermission.canRequestPermission
              ? "Camera permission is required to show the preview."
              : "Camera permission is blocked. Enable it in system settings."
          }
          onRetry={requestOrOpenCameraPermission}
          retryLabel="Dodaj uprawnienia"
          title="Camera permission"
        />
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.stateContainer}>
        <EmptyState title="Camera unavailable" message="No front camera is available." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.cameraContainer}>
      <Camera
        device={device}
        isActive={isFocused}
        onLayout={handleCameraLayout}
        orientationSource="device"
        outputs={[frameOutput]}
        style={styles.camera}
      />
      <FaceLabelOverlay faceOverlay={faceOverlay} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  stateContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    alignItems: "center",
  },
});
