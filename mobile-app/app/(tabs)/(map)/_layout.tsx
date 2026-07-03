import { Stack } from "expo-router/stack";

export default function MapLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Map" }} />
    </Stack>
  );
}
