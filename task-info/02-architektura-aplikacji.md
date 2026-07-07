# Architektura aplikacji

## Aktualny stan repo

Projekt aplikacji znajduje sie w `mobile-app`.

Stan poczatkowy:

- Expo SDK 57.
- React Native 0.86.
- React 19.2.3.
- TypeScript strict.
- `App.tsx` jest jeszcze starterowym ekranem Expo.
- Jest katalog `ios`, wiec plan jest iOS-first.
- `AGENTS.md` wymaga korzystania z dokumentacji Expo dla wersji 57 przed pisaniem kodu.

## Docelowy model nawigacji

Nawigacje budujemy przez Expo Router. `app` zawiera tylko route files i `_layout.tsx`; komponenty, hooki, typy i helpery trzymamy poza `app`.

Proponowana struktura:

```text
mobile-app/
  app/
    _layout.tsx
    +not-found.tsx
    (tabs)/
      _layout.tsx
      (favorites)/
        _layout.tsx
        index.tsx
      (pokedex)/
        _layout.tsx
        index.tsx
      (camera)/
        _layout.tsx
        index.tsx
      (map)/
        _layout.tsx
        index.tsx
    pokemon/
      [name].tsx
  src/
    api/
      pokeapi.ts
    components/
      empty-state.tsx
      error-state.tsx
      pokemon-card.tsx
      pokemon-detail.tsx
      pokemon-list-row.tsx
    hooks/
      use-favorite-pokemon.ts
      use-map-pins.ts
      use-pokemon-details.ts
      use-pokemon-list.ts
    storage/
      storage.ts
      favorite-storage.ts
      map-pin-storage.ts
    theme/
      colors.ts
    types/
      pokemon.ts
      map.ts
```

## Root layout

`app/_layout.tsx` odpowiada za:

- `QueryClientProvider` dla TanStack Query.
- Theme provider Expo Router / React Navigation.
- Importy wymagane przez native libraries, na przyklad gesture handler.
- Root stack bez customowego headera dla tabow.

Wazne: jezeli uzywamy Reanimated i Gesture Handler, trzeba poprawnie ustawic entrypoint i Babel pluginy zgodnie z wersjami Expo SDK 57 oraz bibliotek.

## Tabs layout

`app/(tabs)/_layout.tsx` definiuje cztery taby:

- Favorites - rola `favorites`, ikona serca.
- Pokedex - lista Pokemonow, ikona listy lub gridu.
- Camera - kamera, ikona aparatu.
- Map - mapa, ikona mapy.

Preferowany wariant to `NativeTabs` z Expo Router, bo daje bardziej natywne zachowanie na iOS i Material navigation na Androidzie.

Kazdy tab ma wlasny stack, zeby:

- zachowac oddzielna historie nawigacji,
- ustawic title/header per tab,
- latwo dodac header actions, np. unfavorite.

## Ekran szczegolow Pokemona

`app/pokemon/[name].tsx` jest wspoldzielonym route dla szczegolow.

Wejscia:

- `name` z route params.
- Opcjonalnie query param `mode`, jezeli w przyszlosci potrzebujemy odroznic kontekst listy, favorite, mapy lub sheetu.

Zachowanie:

- Pobiera szczegoly Pokemona po `name` albo `id`.
- Pokazuje zdjecie, nazwe, typy, podstawowe statystyki, wzrost, wage i abilities.
- Jesli Pokemon nie jest favorite, pokazuje akcje "Set favorite".
- Jesli Pokemon jest favorite, pokazuje stan aktywny i mozliwosc usuniecia lub zmiany.

## Data flow

### Dane z API

PokeAPI jest zrodlem prawdy dla danych serwerowych.

Przeplyw:

1. UI wywoluje hook React Query.
2. Hook korzysta z funkcji w `src/api/pokeapi.ts`.
3. API helper uzywa natywnego `fetch`.
4. React Query cache'uje odpowiedz i obsluguje loading/error/retry.
5. Komponent dostaje juz ustandaryzowany model domenowy.

Nie uzywamy `axios`; Expo data-fetching guidance preferuje natywny `fetch`.

### Dane lokalne

Dane lokalne:

- `favoritePokemon:v1`.
- `mapPins:v1`.

Storage implementujemy wylacznie przez async API `expo-sqlite/kv-store`. To jest jedyne zrodlo prawdy dla lokalnych danych key-value w aplikacji. `expo-sqlite` jest tylko paczka dostarczajaca ten modul; nie uzywamy osobnego AsyncStorage, `expo-sqlite/localStorage/install` ani recznych tabel SQLite dla favorite/map pins.

Przeplyw:

1. `src/storage/storage.ts` importuje `Storage` z `expo-sqlite/kv-store` i daje maly async wrapper `get`, `set`, `remove`, `subscribe`.
2. `favorite-storage.ts` mapuje JSON na `FavoritePokemon`.
3. `map-pin-storage.ts` mapuje JSON na tablice `MapPin`.
4. Hooki `useFavoritePokemon` i `useMapPins` wystawiaja reaktywny stan do UI.

## Typy domenowe

Minimalne typy:

```ts
export type PokemonListItem = {
  name: string;
  url: string;
  id: number;
  imageUrl: string;
};

export type PokemonDetails = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: Array<{ name: string; value: number }>;
};

export type FavoritePokemon = {
  id: number;
  name: string;
  imageUrl: string;
  selectedAt: string;
};

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  pokemonName: string;
  pokemonId?: number;
  imageUrl?: string;
  createdAt: string;
  source: "manual" | "camera";
};
```

## Error handling

Kazdy ekran z danymi z sieci powinien miec:

- loading state,
- error state,
- retry action,
- empty state tam, gdzie dane moga byc puste,
- sensowny fallback dla braku uprawnien kamery/lokalizacji.

## Granice odpowiedzialnosci

- `app/*`: route files, layouty, minimalne laczenie hookow z UI.
- `src/api`: tylko komunikacja z PokeAPI i mapowanie payloadow.
- `src/storage`: tylko zapis/odczyt lokalny.
- `src/hooks`: integracja API/storage z React.
- `src/components`: prezentacja, bez bezposredniego dostepu do storage lub globalnej nawigacji.
- `src/theme`: kolory i stale UI.
- `src/types`: wspoldzielone typy.
