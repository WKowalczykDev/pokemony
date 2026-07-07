import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "pokemony",
});

export function getString(key: string) {
  return storage.getString(key);
}

export function setString(key: string, value: string) {
  storage.set(key, value);
}

export function remove(key: string) {
  storage.remove(key);
}

export function subscribe(key: string, onChange: () => void) {
  const listener = storage.addOnValueChangedListener((changedKey) => {
    if (changedKey === key) {
      onChange();
    }
  });

  return () => {
    listener.remove();
  };
}
