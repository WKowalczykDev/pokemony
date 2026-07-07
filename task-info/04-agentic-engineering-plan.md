# Agentic engineering plan

## Cel tego dokumentu

Ten plik opisuje, jak prowadzic implementacje z uzyciem agentow lub kolejnych sesji Codex tak, zeby kazdy etap mial jasny kontrakt, wejscia, wyjscia i kryteria zakonczenia.

Najwazniejsza zasada: agenci moga pracowac rownolegle tylko wtedy, gdy ich granice sa jasne. W przeciwnym razie lepiej isc sekwencyjnie i czesto integrowac.

## Globalne zasady pracy

- Zawsze czytac `mobile-app/AGENTS.md` przed pisaniem kodu.
- Trzymac sie Expo SDK 57.
- Nie umieszczac komponentow, hookow ani utils w katalogu `app`.
- Najpierw dowozic dzialajace MVP, potem bonusy.
- Kazdy agent powinien zostawic krotka notatke: co zmienil, co przetestowal, jakie ryzyka zostaly.
- Nie instalowac paczek "na zapas"; kazda paczka musi miec konkretne miejsce uzycia.
- Camera/VisionCamera robic w osobnym etapie, bo zmienia native build i ma wysoki koszt debugowania.

## Proponowany podzial agentow

### 1. Requirements agent

Misja:

- Zamienic `introductory task 2.0 final.txt` na checklisty wymagan.
- Wylapac niespojnosci, np. "3 tabs" kontra cztery wymienione widoki.
- Oznaczyc MVP, bonusy i ryzyka.

Wejscia:

- `task-info/introductory task 2.0 final.txt`.
- `task-info/01-problematyka.md`.

Wyjscia:

- checklisty acceptance criteria,
- lista decyzji produktowych,
- lista otwartych pytan, jesli beda.

Done:

- Kazde wymaganie z pdftotext jest odwzorowane albo jawnie odrzucone z powodem.

### 2. Architecture agent

Misja:

- Utworzyc strukture Expo Router.
- Ustalic granice `app` kontra `src`.
- Zdefiniowac typy domenowe.

Wejscia:

- `02-architektura-aplikacji.md`.
- `03-paczki-i-software-mansion.md`.

Wyjscia:

- route structure,
- typy `PokemonListItem`, `PokemonDetails`, `FavoritePokemon`, `MapPin`,
- podstawowe providers.

Done:

- App ma route `/` i cztery taby.
- TypeScript przechodzi dla szkieletu.
- Nie ma logiki domenowej w katalogu `app`.

### 3. Data agent

Misja:

- Zaimplementowac PokeAPI.
- Dodac React Query.
- Obsluzyc infinite scroll i detail fetch.

Wejscia:

- typy domenowe,
- `src/api` skeleton,
- PokeAPI docs.

Wyjscia:

- `fetchPokemonPage`,
- `fetchPokemonDetails`,
- hook `usePokemonList`,
- hook `usePokemonDetails`.

Done:

- Lista pobiera pierwsza strone.
- `fetchNextPage` pobiera kolejne strony.
- Error i retry sa wystawione do UI.
- Nie ma `axios`.

### 4. Storage agent

Misja:

- Zaimplementowac lokalny storage dla favorite i map pins.
- Uzyc wylacznie async API `expo-sqlite/kv-store`.
- Traktowac `expo-sqlite/kv-store` jako jedyne zrodlo prawdy dla lokalnych danych key-value; bez osobnego AsyncStorage, `expo-sqlite/localStorage/install` i recznych tabel SQLite dla favorite/map pins.

Wejscia:

- typy domenowe,
- decyzja storage z dokumentacji.

Wyjscia:

- `storage.ts`,
- `favorite-storage.ts`,
- `map-pin-storage.ts`,
- `useFavoritePokemon`,
- `useMapPins`.

Done:

- Favorite utrzymuje sie po restarcie aplikacji.
- Map pins utrzymuja sie po restarcie aplikacji.
- JSON parse ma fallback i nie crashuje UI przy uszkodzonych danych.

### 5. UI agent

Misja:

- Zbudowac Favorites, Pokedex i Pokemon Detail.
- Dodac loading, empty i error states.
- Dodac podstawowy polish przez Reanimated/Haptics tam, gdzie ma sens.

Wejscia:

- route structure,
- hooki data/storage.

Wyjscia:

- cztery podstawowe route views z dzialajacym UI,
- komponenty prezentacyjne,
- header action do unfavorite.

Done:

- Uzytkownik moze przejsc z listy do szczegolow.
- Uzytkownik moze ustawic i usunac favorite.
- Empty state favorite jest widoczny, gdy nie ma favorite.

### 6. Map agent

Misja:

- Zbudowac Map tab.
- Dodac long press -> pin.
- Dodac marker press -> modal/formSheet.

Wejscia:

- `useMapPins`,
- favorite Pokemon,
- map package setup.

Wyjscia:

- mapa,
- dodawanie pinezek,
- opis pinezki z Pokemonem.

Done:

- Long press dodaje pinezke.
- Klik marker pokazuje opis.
- Piny zostaja po restarcie.

### 7. Native camera agent

Misja:

- Zaimplementowac VisionCamera flow.
- Dodac permissions.
- Dodac face detection i overlay ulubionego Pokemona.
- Dodac zapis zdjecia i opcjonalnie lokalizacje.

Wejscia:

- favorite Pokemon,
- paczki VisionCamera,
- iOS development build.

Wyjscia:

- Camera tab,
- fallback states,
- overlay,
- zapis zdjecia do galerii.

Done:

- Brak permission nie crashuje.
- Brak favorite pokazuje jasny empty state.
- Kamera dziala w development buildzie.
- Overlay jest przetestowany na realnym urzadzeniu albo ryzyko symulatora jest zapisane.

### 8. QA agent

Misja:

- Zweryfikowac appke i dokumentacje.
- Uruchomic statyczne testy.
- Przejsc manualne scenariusze.
- Uzyc Argent do UI QA, jezeli aplikacja jest uruchamialna.

Wejscia:

- cala implementacja,
- `06-qa-i-akceptacja.md`.

Wyjscia:

- raport testow,
- lista bledow,
- informacja, czego nie udalo sie przetestowac.

Done:

- `bunx tsc --noEmit` przechodzi albo ma udokumentowane znane bledy.
- `bunx expo lint` przechodzi albo ma udokumentowane znane bledy.
- Manual QA obejmuje cztery taby.

## Kontrakty miedzy agentami

### Typy sa kontraktem

Zamiast przekazywac luzne obiekty, agenci powinni uzgadniac typy:

- `PokemonDetails` dla szczegolow i favorite.
- `MapPin` dla mapy i kamery.
- `ApiError` albo prosty error model dla UI.

### Hooki sa granica integracji

UI nie powinno wiedziec, jak dziala storage lub API. UI korzysta z hookow:

- `usePokemonList`.
- `usePokemonDetails(name)`.
- `useFavoritePokemon`.
- `useMapPins`.

### Ekrany nie sa miejscem na logike infrastruktury

Route files w `app` powinny skladac UI z hookow i komponentow. Fetch, storage, parsowanie i mapowanie danych musza byc poza `app`.

## Kolejnosc rownoleglenia

Bezpiecznie rownolegle:

- Requirements agent i Architecture agent moga pracowac po ustaleniu MVP.
- UI agent moze tworzyc komponenty placeholder, gdy Data agent konczy hooki.
- QA agent moze przygotowac scenariusze zanim implementacja bedzie gotowa.

Niebezpiecznie rownolegle:

- Storage agent i UI agent bez ustalonego kontraktu `FavoritePokemon`.
- Camera agent rownolegle z dependency setupem, bo native build moze zmienic konfiguracje.
- Kilku agentow jednoczesnie zmieniajacych `app/_layout.tsx` albo `package.json`.

## Zasady commitowania

Najlepszy podzial commitow:

1. Docs i plan.
2. Tooling + Router setup.
3. API + React Query.
4. Favorite storage + UI.
5. Pokedex + detail.
6. Map.
7. Camera dependencies + native config.
8. Camera implementation.
9. QA fixes.

Kazdy commit powinien byc budowalny albo miec jasny opis, dlaczego jest etapem przejsciowym.
