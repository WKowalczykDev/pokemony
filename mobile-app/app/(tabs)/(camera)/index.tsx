import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera } from "react-native-vision-camera";

import { EmptyState, ErrorState } from "@/components";
import { useCamera } from "@/hooks/use-camera";

export default function CameraScreen() {
  const { cameraPermission, device, requestOrOpenCameraPermission } = useCamera();

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
      <Camera device={device} isActive style={styles.camera} />
      <View style={styles.cameraOverlay} />
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
  cameraOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
});
