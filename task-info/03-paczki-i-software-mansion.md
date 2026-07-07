# Paczki i Software Mansion stack

## Zasady instalacji

Projekt jest na Expo SDK 57, a domyslnym package managerem jest Bun. Paczki zarzadzane przez Expo instalujemy przez:

```bash
bunx expo install <package-name>
```

Paczki spoza Expo SDK instalujemy przez:

```bash
bun add <package-name>
```

Dev dependencies instalujemy przez:

```bash
bun add -d <package-name>
```

Nie nalezy recznie zgadywac wersji paczek Expo, jesli `expo install` moze dobrac wersje kompatybilna z SDK 57.

## Nawigacja i UI

### `expo-router`

Po co:

- file-based routing,
- tab navigator,
- stacki wewnatrz tabow,
- route params dla `pokemon/[name]`.

Gdzie:

- `app/_layout.tsx`,
- `app/(tabs)/_layout.tsx`,
- wszystkie route files.

### `react-native-screens` - Software Mansion

Po co:

- natywne prymitywy ekranow,
- wydajniejsze stack navigation,
- fundament Expo Router / React Navigation.

Gdzie:

- posrednio przez Expo Router,
- bezposrednio tylko wtedy, gdy trzeba uzyc eksperymentalnych SafeArea primitives.

Uwagi:

- To paczka Software Mansion.
- Jest kluczowa dla natywnego feelu nawigacji.

### `react-native-safe-area-context`

Po co:

- poprawna obsluga safe area,
- przyciski kamery i mapa nie powinny wchodzic pod notch/home indicator.

W repo juz jest zainstalowana.

### `expo-image`

Po co:

- lepsze cache i loading obrazkow niz standardowy `Image`,
- lazy loading zdjec Pokemonow na liscie,
- stabilniejsze renderowanie obrazkow z PokeAPI.

Gdzie:

- `PokemonListRow`,
- `PokemonCard`,
- `PokemonDetail`,
- overlay kamery.

## Dane i stan

### `@tanstack/react-query`

Po co:

- cache danych PokeAPI,
- infinite queries,
- retry,
- refetch,
- separation of server state from local UI state.

Gdzie:

- `app/_layout.tsx` jako `QueryClientProvider`,
- `src/hooks/use-pokemon-list.ts`,
- `src/hooks/use-pokemon-details.ts`.

### Native `fetch`

Po co:

- proste requesty do PokeAPI,
- brak dodatkowej warstwy `axios`,
- zgodnosc z preferencja Expo data-fetching guidance.

Gdzie:

- `src/api/pokeapi.ts`.

### `expo-sqlite`

Po co:

- dostarcza `expo-sqlite/kv-store`, ktory jest jedynym zrodlem prawdy dla async key-value storage,
- lokalny zapis ulubionego Pokemona i pinezek.

Gdzie:

- `src/storage/storage.ts`.

Decyzja:

- Uzywamy wylacznie `expo-sqlite/kv-store` jako aplikacyjnej abstrakcji storage.
- Nie instalujemy `@react-native-async-storage/async-storage`, mimo ze PDF wymienia AsyncStorage.
- Nie uzywamy `expo-sqlite/localStorage/install`.
- Nie tworzymy recznych tabel SQLite dla favorite/map pins; dane ida przez key-value API z `kv-store`.

## Software Mansion stack

`swm` w tej dokumentacji oznacza paczki firmy Software Mansion.

### `react-native-reanimated`

Po co:

- plynne animacje UI,
- animacje wejscia i wyjscia,
- animacje bottom sheet,
- mikrointerakcje przy favorite, refresh, empty states,
- praca na UI thread przez worklety.

Gdzie:

- `PokemonCard` i `PokemonListRow` dla wejsc/press feedback,
- map pin modal/bottom sheet,
- camera overlay,
- przyszly custom bottom sheet.

Uwagi:

- Wymaga poprawnego Babel pluginu.
- Nie nalezy mieszac Reanimated z przypadkowymi raw `Animated` API bez powodu.

### `react-native-gesture-handler`

Po co:

- natywne gesty,
- bottom sheet,
- press/long press/pan gestures,
- plynna integracja z Reanimated.

Gdzie:

- root entrypoint,
- custom bottom sheet,
- ewentualne swipe actions na listach,
- gesty w kamerze, np. pinch zoom.

Uwagi:

- Long press na mapie zapewnia `react-native-maps`, ale Gesture Handler przyda sie przy wlasnych interakcjach poza mapa.

### `react-native-screens`

Po co:

- natywna nawigacja,
- lepsza pamiec i performance,
- poprawne stack transitions.

Gdzie:

- przez Expo Router i stack layouts.

### `react-native-worklets`

Po co:

- runtime workletow,
- praca poza glownym JS thread,
- wymagane przy zaawansowanym frame processing i czesci integracji VisionCamera.

Gdzie:

- etap Camera,
- VisionCamera frame output,
- face detection pipeline.

Uwagi:

- To czesc najwiekszego ryzyka technicznego.
- Dodac dopiero przy etapie kamery, z osobnym commitem i testem native build.

## Mapy i lokalizacja

### `react-native-maps`

Po co:

- mapa,
- pin markers,
- long press add pin,
- click marker -> modal/sheet.

Gdzie:

- `app/(tabs)/(map)/index.tsx`,
- komponent `MapPinSheet`.

Uwagi:

- Na iOS mozna startowac od Apple Maps.
- Google Maps provider i produkcyjny build wymagaja konfiguracji API key.

### `expo-location`

Po co:

- opcjonalny zapis lokalizacji zdjecia,
- opcjonalne centrowanie mapy na obecnej pozycji.

Gdzie:

- camera flow,
- map tab.

## Kamera i media

### `react-native-vision-camera`

Po co:

- wymaganie zadania,
- kamera natywna,
- capture photo,
- frame processing.

Gdzie:

- `app/(tabs)/(camera)/index.tsx`,
- `src/components/camera/*` jesli etap kamery urosnie.

Uwagi:

- Wymaga development builda.
- Nie zakladac, ze zadziala w Expo Go.

### `react-native-nitro-modules` i `react-native-nitro-image`

Po co:

- zaleznosci VisionCamera w nowszych wersjach,
- natywne typy i obsluga obrazow.

Gdzie:

- dependency layer, niekoniecznie bezposrednio w kodzie aplikacji.

### `react-native-vision-camera-worklets`

Po co:

- frame output / frame processing w VisionCamera.

Gdzie:

- camera overlay i face detection.

### `react-native-vision-camera-face-detector`

Po co:

- wykrywanie twarzy przez MLKit,
- potrzebne do nalozenia Pokemona na czolo.

Gdzie:

- camera screen.

Uwagi:

- Moze wymagac testu na fizycznym iOS device, jesli symulator ma problemy z MLKit.

### `expo-media-library`

Po co:

- zapis wygenerowanych zdjec do galerii.

Gdzie:

- camera capture flow.

## Tooling

### ESLint

Po co:

- wymaganie zadania,
- kontrola importow i typowych bledow.

Preferencja:

- `eslint-config-expo`.

### Prettier

Po co:

- wymaganie zadania,
- stabilny format kodu i Markdown.

### TypeScript

Po co:

- projekt ma `strict: true`,
- kontrakty miedzy agentami powinny byc wyrazone typami.

Komenda QA:

```bash
bunx tsc --noEmit
```

## Zrodla

- Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/
- Expo Router: https://docs.expo.dev/router/introduction/
- React Native Maps w Expo: https://docs.expo.dev/versions/v57.0.0/sdk/map-view/
- Reanimated: https://docs.swmansion.com/react-native-reanimated/
- Gesture Handler: https://docs.swmansion.com/react-native-gesture-handler/
- Screens: https://docs.swmansion.com/react-native-screens/
- Worklets: https://docs.swmansion.com/react-native-worklets/
- VisionCamera: https://visioncamera.margelo.com/docs
- VisionCamera face detector: https://github.com/luicfrr/react-native-vision-camera-face-detector
