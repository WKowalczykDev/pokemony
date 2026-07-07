# Plan implementacji krok po kroku

Kazdy krok ma lokalna bramke `QA po kroku`. Nie czekamy z jakoscia do finalu: po kazdej malej porcji pracy sprawdzamy, czy fundament nadal jest stabilny.

Domyslny package manager: Bun. Paczki zgodne z Expo SDK 57 instalujemy przez `bunx expo install`, a paczki spoza Expo SDK przez `bun add` albo `bun add -d`.

Zasada UI na wszystkie kroki: najpierw funkcjonalnosc, potem wyglad. Style dodajemy tylko wtedy, gdy sa potrzebne do dzialania, safe area, czytelnosci, braku nachodzenia tekstu albo stabilnych wymiarow. Dekoracyjne style, animacje, rozbudowane palety i dopracowany polish zostaja na krok 13 albo pozniej. Jezeli komponent potrzebuje wiecej niz kilku niezbednych styli, style wydzielamy do `*.styles.ts` obok komponentu, a route files w `app` zostaja mozliwie cienkie.

## Krok 0 - przygotowanie

Cel:

- Potwierdzic stan srodowiska i repo przed implementacja.

Akcje:

- Wejsc do `mobile-app`.
- Sprawdzic `package.json`, `app.json`, `tsconfig.json`, `AGENTS.md`.
- Potwierdzic Bun jako domyslny package manager.
- Uruchomic baseline TypeScript:

```bash
bun --version
bunx tsc --noEmit
```

Done:

- Wiadomo, jaka wersja Bun jest uzywana.
- Wiadomo, czy baseline TypeScript przechodzi przed zmianami.
- Wiadomo, ze `bun.lock` jest utrzymywanym lockfilem projektu.

QA po kroku:

- `bun --version` zwraca wersje.
- `bunx tsc --noEmit` przechodzi albo baseline problem jest zapisany przed zmianami.
- `git status --short` pokazuje tylko oczekiwane pliki.

## Krok 1 - Expo Router i tooling

Cel:

- Zamienic starter `App.tsx` na architekture Expo Router.

Paczki:

```bash
bunx expo install expo-router react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
bun add -d eslint eslint-config-expo prettier
```

Akcje:

- Ustawic entrypoint zgodnie z Expo Router.
- Dodac katalog `app`.
- Dodac `app/_layout.tsx`.
- Dodac `app/+not-found.tsx`.
- Dodac konfiguracje ESLint i Prettier.
- Dodac aliasy TypeScript, np. `@/*` do `src/*`, jezeli sa kompatybilne z bundlerem.
- Zweryfikowac konfiguracje Babel wymagana przez Reanimated.

Done:

- Aplikacja startuje przez Expo Router.
- Istnieje route `/`.
- Tooling jest skonfigurowany.

QA po kroku:

- `bunx tsc --noEmit` nie pokazuje bledow z nowej struktury.
- `bunx expo lint` przechodzi albo pokazuje tylko znane, zapisane problemy.
- Router renderuje pierwszy ekran bez pustej bialej strony.

## Krok 2 - taby i puste ekrany

Cel:

- Dodac cztery taby bez logiki biznesowej.

Akcje:

- Dodac `app/(tabs)/_layout.tsx`.
- Dodac taby:
  - Favorites,
  - Pokedex,
  - Camera,
  - Map.
- Kazdy tab ma wlasny `_layout.tsx` ze stackiem.
- Kazdy tab ma `index.tsx` z prostym placeholderem i poprawnym title.
- Placeholdery maja byc minimalne: tekst identyfikujacy ekran, bez dekoracyjnych styli.

Done:

- Widac cztery taby.
- Kazdy tab ma header i stabilna safe area.
- Nawigacja miedzy tabami dziala.

QA po kroku:

- Ręcznie otworzyc kazdy tab i potwierdzic, ze pokazuje wlasny placeholder.
- Kazdy tab ma poprawny header title.
- `bunx tsc --noEmit` przechodzi po dodaniu route files.

## Krok 3 - theme i komponenty bazowe

Cel:

- Przygotowac wspolne komponenty stanu i minimalne stale UI.

Paczki:

```bash
bunx expo install expo-image expo-haptics
```

Akcje:

- Dodac male `src/theme/colors.ts` tylko z wartosciami potrzebnymi komponentom.
- Dodac komponenty:
  - `EmptyState`,
  - `ErrorState`,
  - `LoadingState`,
  - `PokemonCard`,
  - `PokemonListRow`.
- Uzyc `expo-image` dla obrazkow Pokemonow.
- Komponenty bazowe maja miec minimalny layout; bez cieni, ozdobnych kart, animacji i rozbudowanej palety.

Done:

- Ekrany nie powielaja empty/error/loading UI.
- Obrazki Pokemonow maja jedno miejsce konfiguracji.
- Komponenty bazowe nie pobieraja danych samodzielnie.

QA po kroku:

- Placeholdery ekranow moga uzyc `EmptyState`, `LoadingState` albo `ErrorState` bez crasha.
- Komponenty bazowe renderuja sie bez nachodzacego tekstu.
- Nie ma duplikacji lokalnych styli dla tych samych stanow.
- Jezeli style komponentu rosna ponad kilka niezbednych wlasciwosci, sa wydzielone do `*.styles.ts`.

## Krok 4 - typy domenowe

Cel:

- Zablokowac kontrakt danych przed implementacja API i UI.

Akcje:

- Dodac `src/types/pokemon.ts`.
- Dodac `src/types/map.ts`.
- Zdefiniowac:
  - `PokemonListItem`,
  - `PokemonDetails`,
  - `FavoritePokemonIds`,
  - `MapPin`.

Done:

- Data, storage i UI importuja te same typy.
- Nie ma duplikatow shape danych w wielu plikach.

QA po kroku:

- `rg "type PokemonDetails|interface PokemonDetails|type MapPin|interface MapPin" src` pokazuje jedno zrodlo prawdy dla kazdego typu.
- `bunx tsc --noEmit` przechodzi.
- Typy zawieraja pola potrzebne dla listy, detail, favorite, mapy i kamery.

## Krok 5 - PokeAPI i React Query

Cel:

- Pobierac dane z PokeAPI w sposob cache'owalny i testowalny.

Paczki:

```bash
bun add @tanstack/react-query
```

Akcje:

- Dodac `QueryClientProvider` w `app/_layout.tsx`.
- Dodac `src/api/pokeapi.ts`.
- Zaimplementowac:
  - `fetchPokemonPage({ offset, limit })`,
  - `fetchPokemonDetails(nameOrId)`.
- Dodac hooki:
  - `usePokemonList`,
  - `usePokemonDetails`.
- Mapowac PokeAPI payload na typy domenowe.
- Nie dodawac `axios`.

Done:

- Hook listy zwraca strony danych.
- Hook detail zwraca szczegoly po nazwie.
- Error i retry sa dostepne dla UI.

QA po kroku:

- PokeAPI helper obsluguje success i non-OK HTTP response.
- React Query provider obejmuje route tree.
- `bunx tsc --noEmit` przechodzi.
- Nie ma importow z `axios`.

## Krok 6 - Pokedex tab

Cel:

- Zbudowac liste Pokemonow z paginacja.

Akcje:

- W `app/(tabs)/(pokedex)/index.tsx` dodac `FlatList`.
- Uzyc `useInfiniteQuery` przez `usePokemonList`.
- Dodac:
  - initial loading,
  - pull-to-refresh,
  - footer loading,
  - error state,
  - empty state.
- Klikniecie row otwiera `/pokemon/[name]`.
- Lista ma uzywac tylko styli potrzebnych dla czytelnosci, separatorow lub stabilnego layoutu.

Done:

- Lista pobiera pierwsza strone.
- Scroll do dolu pobiera kolejna strone.
- Pull-to-refresh odswieza dane.
- Klikniecie Pokemona prowadzi do detail.

QA po kroku:

- Pierwsze ladowanie pokazuje loading state.
- Scroll do dolu odpala pobranie kolejnej strony.
- Pull-to-refresh nie duplikuje elementow.
- Klikniecie row buduje poprawny route dla `name`.

## Krok 7 - Pokemon detail

Cel:

- Jeden wspoldzielony ekran szczegolow Pokemona.

Akcje:

- Dodac `app/pokemon/[name].tsx`.
- Dodac `PokemonDetail` component.
- Pokazac:
  - nazwe,
  - zdjecie,
  - typy,
  - height,
  - weight,
  - abilities,
  - stats.
- Dodac akcje "Set favorite".
- Detail ma byc funkcjonalny i czytelny; dopracowany wyglad zostaje na krok 13.

Done:

- Detail dziala dla Pokemona otwartego z listy.
- Detail ma loading/error/retry.
- Detail moze ustawic favorite po podlaczeniu storage w kolejnym kroku.

QA po kroku:

- Route `/pokemon/[name]` dziala dla nazwy z listy.
- Back navigation wraca do Pokedex.
- Detail pokazuje error state przy niepoprawnej nazwie.
- `bunx tsc --noEmit` przechodzi.

## Krok 8 - favorites storage i Favorites tab

Cel:

- Lokalnie zapisywac i wyswietlac ulubione Pokemony jako tablice ID.

Paczki:

```bash
bunx expo install react-native-mmkv react-native-nitro-modules
bunx expo prebuild
```

Storage:

- Jedynym zrodlem prawdy dla lokalnego key-value storage jest MMKV.
- Nie dodajemy AsyncStorage, `expo-sqlite/kv-store`, `localStorage` ani alternatywnego mechanizmu storage dla favorite.
- Key dla favorites to `favoritePokemonIds:v1`.
- Wartosc to JSON string z `number[]`; nie zapisujemy nazw, obrazkow, `PokemonDetails` ani payloadow PokeAPI.
- JSON parse ma fallback do `[]`.
- Dodawanie favorite nie moze tworzyc duplikatow ID.

Akcje:

- Dodac `src/storage/storage.ts` z wrapperem nad jedna instancja MMKV: `getString`, `setString`, `remove` i opcjonalnie listener/subscription.
- Dodac `favorite-storage.ts`.
- Dodac `useFavoritePokemon`.
- Podlaczyc "Set favorite" w detail.
- Zbudowac Favorites tab:
  - empty state bez favorites,
  - liste/card/detail dla zapisanych ID,
  - akcje usuniecia pojedynczego Pokemona z favorites.
- Empty/card/detail maja byc proste i funkcjonalne, bez ozdobnego polishu.

Done:

- Favorites zapisuja sie lokalnie jako tablica ID.
- Favorites widac po restarcie aplikacji.
- Usuniecie pojedynczego Pokemona usuwa jego ID ze storage.

QA po kroku:

- Brak favorites pokazuje empty state.
- Set favorite z detail aktualizuje Favorites tab.
- Dodanie kilku Pokemonow nie tworzy duplikatow ID.
- Unfavorite usuwa pojedynczego Pokemona i wraca do empty state, jezeli lista jest pusta.
- Restart aplikacji zachowuje aktualny stan storage.
- Uszkodzony JSON w MMKV nie crashuje UI i daje fallback `[]`.

## Krok 9 - Map tab

Cel:

- Dodac mape, pinezki i opis Pokemona.

Paczki:

```bash
bunx expo install react-native-maps expo-location
```

Akcje:

- Dodac `map-pin-storage.ts`.
- Dodac `useMapPins`.
- W `app/(tabs)/(map)/index.tsx` dodac `MapView`.
- Long press dodaje pinezke z aktualnie wybranym/ostatnim favorite Pokemonem, a przy braku kontekstu favorite uzywa fallbacku.
- Marker press pokazuje modal/formSheet.
- Modal pokazuje krotki opis Pokemona i jego obrazek, jezeli jest dostepny.
- Mapa i modal maja uzywac tylko styli potrzebnych do poprawnych wymiarow, safe area i czytelnosci.

Done:

- Long press dodaje pin.
- Pin zostaje po restarcie aplikacji.
- Klik pin pokazuje opis.
- Brak favorite ma sensowny fallback, np. pin z opisem "No favorite selected".

QA po kroku:

- Map tab renderuje mape bez zakrywania tab bara.
- Long press dodaje marker w kliknietym miejscu.
- Marker press pokazuje opis Pokemona.
- Piny pozostaja po restarcie aplikacji.

## Krok 10 - Camera tab baseline

Cel:

- Przygotowac kamere bez jeszcze pelnego face overlay.

Paczki:

```bash
bun add react-native-vision-camera react-native-nitro-modules react-native-nitro-image
bunx expo install expo-media-library
```

Akcje:

- Dodac permissions w `app.json`.
- Zbudowac development build.
- Dodac Camera tab z:
  - request permission,
  - no permission state,
  - no favorite state,
  - camera preview,
  - capture button.

Done:

- Camera tab nie crashuje.
- Permission flow dziala.
- Development build uruchamia preview.

QA po kroku:

- Brak permission pokazuje kontrolowany ekran, nie crash.
- Brak favorite pokazuje jasny fallback.
- Preview dziala w development buildzie.
- Elementy sterujace nie wchodza pod safe area.

## Krok 11 - Camera face overlay

Cel:

- Nalozyc obrazek ulubionego Pokemona na wykryta twarz.

Paczki:

```bash
bun add react-native-worklets react-native-vision-camera-worklets react-native-vision-camera-face-detector
```

Akcje:

- Dodac wymagane Babel/native config dla workletow.
- Podlaczyc face detector.
- Wybrac prosty model overlay:
  - wykryj twarz,
  - wez bounding box lub landmarki,
  - oblicz pozycje czola,
  - narysuj obrazek favorite Pokemona jako overlay.
- Dodac fallback, gdy nie wykryto twarzy.

Done:

- Overlay pojawia sie na twarzy.
- Brak face detection nie crashuje preview.
- Jesli symulator iOS nie wspiera MLKit, test na fizycznym urzadzeniu jest wymagany albo ryzyko jest opisane.

QA po kroku:

- Kamera dziala bez wykrytej twarzy.
- Po wykryciu twarzy overlay pojawia sie w przewidywalnym miejscu.
- Brak favorite nadal nie crashuje overlay pipeline.
- Ograniczenia symulatora lub wymog fizycznego urzadzenia sa zapisane w notatce QA.

## Krok 12 - Camera save photo i lokalizacja

Cel:

- Dodac bonusy z zadania.

Akcje:

- Zapisac zdjecie do galerii przez `expo-media-library`.
- Opcjonalnie pobrac lokalizacje przez `expo-location`.
- Po zapisaniu zdjecia dodac `MapPin` ze `source: "camera"`.

Done:

- Zdjecie trafia do galerii po zgodzie uzytkownika.
- Jesli lokalizacja jest dostepna, pin pojawia sie na mapie.
- Odmowa lokalizacji nie blokuje wykonania zdjecia.

QA po kroku:

- Odmowa dostepu do galerii pokazuje blad bez crasha.
- Zgoda na galerie zapisuje zdjecie.
- Odmowa lokalizacji nie blokuje zapisu zdjecia.
- Zgoda na lokalizacje dodaje pin widoczny na Map tab.

## Krok 13 - polish

Cel:

- Dodac jakosc wizualna i "tricks" z notatek zadania dopiero po stabilnym MVP.

Akcje:

- Haptics:
  - set favorite,
  - unfavorite,
  - long press map,
  - capture photo.
- Reanimated:
  - entering rows,
  - empty state transitions,
  - modal/sheet polish.
- Gesture Handler:
  - bottom sheet,
  - ewentualny swipe action.
- Accessibility:
  - labels dla przyciskow,
  - czytelne komunikaty bledow.

Done:

- UI wyglada stabilnie.
- Tekst nie nachodzi na elementy.
- Stany bledow sa zrozumiale.

QA po kroku:

- Animacje nie pogarszaja wydajnosci listy.
- Gesty nie konfliktuja z natywna nawigacja.
- Przyciski maja labels lub zrozumialy tekst.
- Screenshoty glownych ekranow nie pokazuja nachodzenia tekstu.

## Krok 14 - QA i finalizacja

Cel:

- Udowodnic, ze appka dziala end-to-end.

Komendy:

```bash
bunx tsc --noEmit
bunx expo lint
bunx prettier . --check
```

Manual QA:

- Favorites empty state.
- Set favorite z detail.
- Unfavorite z headera.
- Infinite scroll.
- Pull-to-refresh.
- Map long press.
- Marker modal/sheet.
- Camera permission denied.
- Camera no favorite.
- Camera capture.

Done:

- Wszystkie krytyczne scenariusze sa sprawdzone.
- Znane ograniczenia sa zapisane.
- README lub notatka developerska mowi, jak uruchomic appke.

QA po kroku:

- Static checks przechodza przez Bun.
- Manual QA obejmuje wszystkie cztery taby.
- Argent/UI QA obejmuje screenshoty i glowne przeplywy, jesli aplikacja jest uruchamialna.
- Raport koncowy zapisuje nieprzetestowane obszary, zwlaszcza VisionCamera i fizyczne urzadzenie.
