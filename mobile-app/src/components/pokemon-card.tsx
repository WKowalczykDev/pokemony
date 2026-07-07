import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

type PokemonCardProps = {
  name: string;
  imageUrl?: string;
  subtitle?: string;
};

export function PokemonCard({ name, imageUrl, subtitle }: PokemonCardProps) {
  return (
    <View style={styles.container}>
      <Image
        accessibilityLabel={`${name} image`}
        contentFit="contain"
        recyclingKey={imageUrl ?? name}
        source={imageUrl ? { uri: imageUrl } : undefined}
        style={styles.image}
        cachePolicy="memory-disk"
      />
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        {subtitle ? (
          <Text numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 12,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  image: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    height: 72,
    width: 72,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    textTransform: "capitalize",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 4,
  },
});
