import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

type EmptyStateProps = {
  title: string;
  message?: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  message: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 26,
    textAlign: "center",
  },
});
