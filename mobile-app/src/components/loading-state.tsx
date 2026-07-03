import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <View accessibilityRole="progressbar" style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,
  },
  message: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
  },
});
