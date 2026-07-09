import { StyleSheet, Text } from "react-native";

import type { FaceOverlay } from "@/hooks/use-face-overlay";

type FaceLabelOverlayProps = {
  faceOverlay: FaceOverlay;
};

export function FaceLabelOverlay({ faceOverlay }: FaceLabelOverlayProps) {
  if (!faceOverlay) {
    return null;
  }

  return (
    <Text style={[styles.label, { left: faceOverlay.left, top: faceOverlay.top }]}>Debil</Text>
  );
}

const styles = StyleSheet.create({
  label: {
    position: "absolute",
    color: "red",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    transform: [{ translateX: -30 }],
    width: 60,
  },
});
