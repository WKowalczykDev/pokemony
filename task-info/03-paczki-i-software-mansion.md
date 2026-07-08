# Paczki i Software Mansion stack

Ten plik jest lista referencyjna. Paczki instalujemy tylko wtedy, gdy aktualnie
wdrazana funkcja ich wymaga. Nie instalujemy paczek na zapas.

## Zasady instalacji

Projekt jest na Expo SDK 57, a domyslnym package managerem jest Bun.

Paczki zarzadzane przez Expo:

```bash
bunx expo install <package-name>
```

Paczki spoza Expo SDK:

```bash
bun add <package-name>
```

Dev dependencies:

```bash
bun add -d <package-name>
```

Nie zgaduj recznie wersji paczek Expo, jezeli `expo install` moze dobrac wersje
kompatybilna z SDK 57.

## Zasada minimalizmu

- Najpierw sprawdz, czy dana funkcja da sie zrobic bez nowej paczki.
- Instaluj tylko paczki, ktore sa uzywane w aktualnym zakresie.
- Jezeli paczka wymaga native rebuilda, traktuj ja jako osobny koszt i nie
  dodawaj jej bez jasnej potrzeby.
- Animacje, haptics, bottom sheet, kamera i mapa sa tylko na wyrazna prosbe.

## Nawigacja

### `expo-router`

Uzyc, gdy aktualny zakres wymaga routingu, tabow albo ekranow szczegolow.

Typowe miejsce:

- `app/_layout.tsx`,
- `app/(tabs)/_layout.tsx`,
- route files.

### `react-native-screens`

Zwykle przychodzi z nawigacja i Expo Router. Nie dodawac osobnych zastosowan bez
potrzeby.

### `react-native-safe-area-context`

Uzyc, gdy ekran wymaga poprawnego safe area albo elementy wchodza pod notch,
header, tab bar lub home indicator.

## Dane

### Native `fetch`

Domyslny wybor dla PokeAPI. Nie uzywamy `axios`.

### `@tanstack/react-query`

Dodac tylko wtedy, gdy aktualny zakres realnie korzysta z cache, retry,
odswiezania, paginacji albo wspoldzielenia danych miedzy ekranami.

Dla bardzo prostego jednorazowego pobrania danych mozna zaczac prosciej, o ile
nie komplikuje to kolejnego kroku.

## Obrazki

### `expo-image`

Uzyc, gdy ekran faktycznie pokazuje obrazki Pokemonow i potrzebne jest lepsze
ladowanie/cache niz standardowy `Image`.

Nie dodawac tylko dlatego, ze moze przydac sie pozniej.

## Storage

### `react-native-mmkv`

Preferowany local key-value storage, jezeli funkcja wymaga trwalego zapisu.

Mozliwe uzycia:

- favorite Pokemon IDs,
- map pins.

Nie dodawac storage, jezeli aktualny zakres nie zapisuje danych lokalnie.

Nie uzywac:

- `@react-native-async-storage/async-storage`,
- `expo-sqlite/kv-store`,
- `expo-sqlite/localStorage/install`,
- recznych tabel SQLite dla prostych key-value danych favorite/map pins.

## Software Mansion stack

`swm` oznacza paczki Software Mansion. Sa przydatne, ale nie sa obowiazkowe w
kazdym etapie.

### `react-native-reanimated`

Tylko na wyrazna prosbe albo gdy funkcja bez animacji nie spelni wymagania.

Nie dodawac dla dekoracyjnych wejsc listy, mikrointerakcji albo polishu, jezeli
uzytkownik o to nie prosi.

### `react-native-gesture-handler`

Uzyc, gdy potrzebne sa zaawansowane gesty, bottom sheet albo integracja wymagana
przez nawigacje.

Nie dodawac osobnych gestow bez potrzeby.

### `react-native-worklets`

Traktowac jako paczke dla zaawansowanej kamery/frame processing. Nie dodawac
przed etapem kamery.

## Mapy i lokalizacja

### `react-native-maps`

Dodac tylko wtedy, gdy uzytkownik poprosi o Map tab albo konkretna funkcje mapy.

### `expo-location`

Dodac tylko wtedy, gdy aktualny zakres wymaga lokalizacji.

Nie dodawac lokalizacji jako bonusu do mapy lub kamery bez prosby.

## Kamera i media

### `react-native-vision-camera`

Dodac tylko wtedy, gdy uzytkownik wyraznie poprosi o kamere.

Uwagi:

- moze wymagac development builda,
- moze nie dzialac w Expo Go,
- powinna byc robiona jako osobny, maly etap.

### Face detection i frame processing

Paczki typu `react-native-worklets`,
`react-native-vision-camera-worklets` albo face detector dodawac dopiero, gdy
uzytkownik poprosi o overlay/face detection.

### `expo-media-library`

Dodac tylko wtedy, gdy aktualny zakres zapisuje zdjecia do galerii.

## Tooling

### ESLint

Dodac lub uruchamiac, gdy projekt ma lint jako czesc aktualnego zakresu.

### Prettier

Uzywac do kontroli formatowania, ale nie uruchamiac formattera zapisujacego pliki
przy okazji niezaleznej zmiany bez potrzeby.

### TypeScript

Podstawowa komenda QA dla zmian w kodzie:

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
