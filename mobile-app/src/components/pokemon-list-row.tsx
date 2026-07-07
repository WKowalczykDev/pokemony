import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

type PokemonListRowProps = {
  name: string;
  imageUrl?: string;
  onPress?: () => void;
};

export function PokemonListRow({ name, imageUrl, onPress }: PokemonListRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={styles.container}
    >
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
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    minHeight: 64,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  image: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    height: 48,
    width: 48,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "500",
    lineHeight: 22,
    textTransform: "capitalize",
  },
});
