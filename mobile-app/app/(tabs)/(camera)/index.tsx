import { useState } from "react";
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera } from "react-native-vision-camera";

import { EmptyState, ErrorState, FaceLabelOverlay } from "@/components";
import { useCamera } from "@/hooks/use-camera";
import { useFaceOverlay } from "@/hooks/use-face-overlay";
import { colors } from "@/theme/colors";

import { useIsFocused } from "expo-router";

export default function CameraScreen() {
  const {
    cameraPermission,
    captureError,
    captureMessage,
    capturePhoto,
    device,
    isCapturing,
    photoOutput,
    requestOrOpenCameraPermission,
  } = useCamera();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [previewSize, setPreviewSize] = useState({ width: 1, height: 1 });
  const { faceOverlay, frameOutput } = useFaceOverlay({ device, previewSize });
  const captureButtonDisabled = isCapturing || !isFocused;
  const controlsBottom = Math.max(insets.bottom, 16) + 24;

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
        outputs={[frameOutput, photoOutput]}
        style={styles.camera}
      />
      <FaceLabelOverlay faceOverlay={faceOverlay} />
      <View style={[styles.controls, { bottom: controlsBottom }]}>
        {captureError ? <Text style={styles.errorText}>{captureError}</Text> : null}
        {captureMessage ? <Text style={styles.messageText}>{captureMessage}</Text> : null}
        <Pressable
          accessibilityLabel="Zrob zdjecie"
          accessibilityRole="button"
          disabled={captureButtonDisabled}
          onPress={capturePhoto}
          style={({ pressed }) => [
            styles.captureButton,
            captureButtonDisabled ? styles.captureButtonDisabled : null,
            pressed && !captureButtonDisabled ? styles.captureButtonPressed : null,
          ]}
        >
          <View style={styles.captureButtonInner} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  captureButton: {
    alignItems: "center",
    alignSelf: "center",
    borderColor: colors.background,
    borderRadius: 38,
    borderWidth: 4,
    height: 76,
    justifyContent: "center",
    width: 76,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonPressed: {
    opacity: 0.8,
  },
  captureButtonInner: {
    backgroundColor: colors.background,
    borderRadius: 29,
    height: 58,
    width: 58,
  },
  controls: {
    alignItems: "center",
    gap: 8,
    left: 0,
    position: "absolute",
    right: 0,
  },
  errorText: {
    backgroundColor: colors.background,
    borderRadius: 6,
    color: "#B42318",
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: "center",
  },
  messageText: {
    backgroundColor: colors.background,
    borderRadius: 6,
    color: colors.primary,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: "center",
  },
  stateContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
