import { Icon } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(favorites)">
        <Icon md="favorite" sf="heart" />
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(pokedex)">
        <Icon md="format_list_bulleted" sf="list.bullet" />
        <NativeTabs.Trigger.Label>Pokedex</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(camera)">
        <Icon md="photo_camera" sf="camera" />
        <NativeTabs.Trigger.Label>Camera</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(map)">
        <Icon md="map" sf="map" />
        <NativeTabs.Trigger.Label>Map</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
