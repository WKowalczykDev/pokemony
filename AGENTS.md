# Pokemony agent guide

Ten plik jest glowna instrukcja dla agentow pracujacych nad repo. Ma pomagac w pracy krok po kroku: uzytkownik bedzie prosil o kolejne etapy, a agent ma realizowac je zgodnie z planem z `task-info`.

## Najwazniejsza zasada

Przed kazda zmiana kodu:

1. Przeczytaj ten plik.
2. Przeczytaj `mobile-app/AGENTS.md`.
3. Przeczytaj odpowiedni krok z `task-info/05-plan-implementacji-krok-po-kroku.md`.
4. Jezeli krok dotyka architektury, paczek, storage, kamery albo QA, doczytaj powiazany plik z `task-info`.
5. Dopiero potem edytuj kod.

Nie implementuj kilku duzych krokow naraz, chyba ze uzytkownik wyraznie o to poprosi. Domyslnie robimy jeden krok planu na jeden prompt.

## Gdzie jest kod

- Kod aplikacji: `mobile-app`.
- Dokumentacja zadania i plan: `task-info`.
- Glowny plan implementacji: `task-info/05-plan-implementacji-krok-po-kroku.md`.
- Kryteria QA: `task-info/06-qa-i-akceptacja.md`.
- Checklista wymagan: `task-info/07-checklista-wymagan.md`.

## Kolejnosc czytania dokumentow

Przy starcie nowej sesji czytaj:

1. `task-info/README.md` - mapa dokumentacji.
2. `task-info/01-problematyka.md` - wymagania i ryzyka.
3. `task-info/02-architektura-aplikacji.md` - docelowa struktura aplikacji.
4. `task-info/03-paczki-i-software-mansion.md` - paczki i zasady instalacji.
5. `task-info/04-agentic-engineering-plan.md` - granice pracy agentow.
6. `task-info/05-plan-implementacji-krok-po-kroku.md` - roadmapa implementacji.
7. `task-info/06-qa-i-akceptacja.md` - testy i akceptacja.
8. `task-info/07-checklista-wymagan.md` - kompletna checklista wymagan.

Nie trzeba czytac PDF, jezeli `introductory task 2.0 final.txt` i pliki `.md` wystarczaja. PDF jest materialem pomocniczym.

## Zasady techniczne

- Projekt aplikacji jest w `mobile-app`.
- Target: Expo SDK 57, iOS-first.
- Package manager: Bun.
- Komendy uruchamiaj z `mobile-app`, chyba ze prompt mowi inaczej.
- Paczki zgodne z Expo instaluj przez `bunx expo install`.
- Paczki spoza Expo SDK instaluj przez `bun add`.
- Dev dependencies instaluj przez `bun add -d`.
- Nie instaluj paczek na zapas.
- Nie uzywaj `axios`; PokeAPI obsluguj przez natywny `fetch`.
- Jedynym zrodlem prawdy dla lokalnego key-value storage jest `expo-sqlite/kv-store`.
- Nie instaluj `@react-native-async-storage/async-storage`, nie uzywaj `expo-sqlite/localStorage/install` i nie pisz recznych tabel SQLite dla favorite/map pins.
- Nie umieszczaj komponentow, hookow, storage, API ani typow domenowych w `app`.
- `app` ma zawierac route files i layouty, a logika ma byc w `src`.
- Funkcjonalnosc jest wazniejsza niz wyglad: nie dodawaj dekoracyjnych styli, palet, cieni, animacji ani rozbudowanych placeholderow przed etapem polish.
- Style dodawaj tylko wtedy, gdy sa potrzebne do dzialania, safe area, czytelnosci, braku nachodzenia tekstu albo stabilnych wymiarow list/map/kamery.
- VisionCamera rob w osobnym etapie, bo wymaga native/development builda i ma wysoki koszt debugowania.

## Docelowa struktura

Docelowo aplikacja powinna isc w tym kierunku:

```text
mobile-app/
  app/
    _layout.tsx
    +not-found.tsx
    (tabs)/
      _layout.tsx
      (favorites)/
      (pokedex)/
      (camera)/
      (map)/
    pokemon/
      [name].tsx
  src/
    api/
    components/
    hooks/
    storage/
    theme/
    types/
```

Szczegoly struktury sa w `task-info/02-architektura-aplikacji.md`.

## Tryb pracy krok po kroku

Gdy uzytkownik napisze prompt typu "zrob krok 3", "lecimy z mapa" albo "teraz favorite", agent ma:

1. Zidentyfikowac odpowiadajacy krok z planu.
2. Przeczytac ten krok w `task-info/05-plan-implementacji-krok-po-kroku.md`.
3. Sprawdzic aktualny stan repo i nie zakladac, ze poprzednie kroki sa kompletne.
4. Wykonac tylko zakres danego kroku oraz niezbedne male poprawki integracyjne.
5. Uruchomic QA opisane w sekcji `QA po kroku`.
6. Na koniec podac:
   - co zmieniono,
   - jakie komendy/testy uruchomiono,
   - co zostalo jako ryzyko albo nastepny krok.

Jezeli poprzedni krok nie jest gotowy, zatrzymaj sie na minimalnym brakujacym fundamencie potrzebnym do aktualnego kroku i jasno to opisz.

## Roadmapa implementacji

### Krok 0 - przygotowanie

Cel: potwierdzic baseline repo.

- Wejdz do `mobile-app`.
- Sprawdz `package.json`, `app.json`, `tsconfig.json`, `AGENTS.md`.
- Potwierdz Bun.
- Uruchom `bun --version`.
- Uruchom `bunx tsc --noEmit`.
- Zapisz, czy baseline przechodzi przed zmianami.

### Krok 1 - Expo Router i tooling

Cel: zamienic starter na Expo Router.

- Dodaj Expo Router i wymagane paczki nawigacji.
- Ustaw entrypoint Expo Router.
- Dodaj `app/_layout.tsx` i `app/+not-found.tsx`.
- Dodaj ESLint i Prettier.
- Sprawdz konfiguracje Reanimated/Babel.
- QA: TypeScript, lint, pierwszy ekran routera.

### Krok 2 - taby i puste ekrany

Cel: cztery taby bez logiki biznesowej.

- Dodaj tabs layout.
- Dodaj taby: Favorites, Pokedex, Camera, Map.
- Kazdy tab ma wlasny stack i placeholder.
- QA: kazdy tab renderuje placeholder, header i safe area.

### Krok 3 - theme i komponenty bazowe

Cel: wspolne UI state i wyglad.

- Dodaj `src/theme/colors.ts`.
- Dodaj `EmptyState`, `ErrorState`, `LoadingState`.
- Dodaj `PokemonCard` i `PokemonListRow`.
- Uzyj `expo-image` dla obrazkow.
- QA: komponenty renderuja sie bez crasha i bez nachodzenia tekstu.

### Krok 4 - typy domenowe

Cel: jedno zrodlo prawdy dla danych.

- Dodaj `src/types/pokemon.ts`.
- Dodaj `src/types/map.ts`.
- Zdefiniuj `PokemonListItem`, `PokemonDetails`, `FavoritePokemon`, `MapPin`.
- QA: typy sa w jednym miejscu i TypeScript przechodzi.

### Krok 5 - PokeAPI i React Query

Cel: cache'owalne pobieranie danych.

- Dodaj `@tanstack/react-query`.
- Dodaj `QueryClientProvider`.
- Dodaj `src/api/pokeapi.ts`.
- Dodaj `fetchPokemonPage` i `fetchPokemonDetails`.
- Dodaj hooki `usePokemonList` i `usePokemonDetails`.
- Mapuj PokeAPI payload na typy domenowe.
- QA: success, non-OK response, TypeScript, brak `axios`.

### Krok 6 - Pokedex tab

Cel: lista Pokemonow z paginacja.

- W Pokedex dodaj `FlatList`.
- Obsluz initial loading, pull-to-refresh, footer loading, error i empty state.
- Infinite scroll ma pobierac kolejne strony.
- Klikniecie row otwiera `/pokemon/[name]`.
- QA: loading, scroll, refresh bez duplikatow, poprawny route.

### Krok 7 - Pokemon detail

Cel: wspoldzielony ekran szczegolow.

- Dodaj `app/pokemon/[name].tsx`.
- Dodaj komponent `PokemonDetail`.
- Pokaz nazwe, obrazek, typy, height, weight, abilities i stats.
- Dodaj akcje `Set favorite`, nawet jesli storage bedzie podpiety w kolejnym kroku.
- QA: route dziala, back wraca do Pokedex, error state dziala.

### Krok 8 - favorite storage i Favorites tab

Cel: lokalny favorite Pokemon.

- Dodaj `expo-sqlite` tylko jako paczke dostarczajaca `expo-sqlite/kv-store`.
- Dodaj storage przez async API `expo-sqlite/kv-store`, ktore jest jedynym zrodlem prawdy dla lokalnych danych key-value.
- Dodaj `favorite-storage.ts`.
- Dodaj `useFavoritePokemon`.
- Podepnij `Set favorite`.
- Zbuduj Favorites tab z empty state, card/detail i header action `Unfavorite`.
- QA: set favorite, unfavorite, restart aplikacji zachowuje stan.

### Krok 9 - Map tab

Cel: mapa, pinezki i opis Pokemona.

- Dodaj `react-native-maps` i `expo-location`.
- Dodaj `map-pin-storage.ts`.
- Dodaj `useMapPins`.
- Dodaj `MapView`.
- Long press dodaje pinezke z aktualnym favorite albo fallbackiem.
- Marker press pokazuje modal/formSheet/bottom sheet z opisem.
- QA: mapa renderuje sie poprawnie, piny zostaja po restarcie.

### Krok 10 - Camera tab baseline

Cel: kamera bez pelnego face overlay.

- Dodaj VisionCamera dependencies i `expo-media-library`.
- Dodaj permissions w `app.json`.
- Zbuduj development build, jezeli wymagane.
- Dodaj permission flow, no permission state, no favorite state, preview i capture button.
- QA: brak permission nie crashuje, preview dziala w development buildzie.

### Krok 11 - Camera face overlay

Cel: overlay ulubionego Pokemona na wykrytej twarzy.

- Dodaj worklets i face detector.
- Dodaj wymagany Babel/native config.
- Podlacz face detector.
- Oblicz pozycje overlay na podstawie twarzy.
- Dodaj fallback dla braku twarzy.
- QA: kamera dziala bez twarzy, overlay pojawia sie po wykryciu twarzy, ograniczenia symulatora sa opisane.

### Krok 12 - Camera save photo i lokalizacja

Cel: bonusy.

- Zapisz zdjecie do galerii przez `expo-media-library`.
- Opcjonalnie pobierz lokalizacje przez `expo-location`.
- Po zapisie zdjecia dodaj `MapPin` ze `source: "camera"`.
- QA: odmowa galerii/lokalizacji nie crashuje, zgody daja oczekiwany efekt.

### Krok 13 - polish

Cel: dopracowanie UX.

- Dodaj haptics dla favorite, unfavorite, map long press i capture.
- Dodaj Reanimated dla wejsc listy, empty transitions, modal/sheet polish.
- Dodaj accessibility labels i czytelne komunikaty bledow.
- QA: animacje nie psuja wydajnosci, gesty nie konfliktuja z nawigacja, tekst nie nachodzi.

### Krok 14 - QA i finalizacja

Cel: potwierdzic end-to-end.

- Uruchom `bunx tsc --noEmit`.
- Uruchom `bunx expo lint`.
- Uruchom `bunx prettier . --check`.
- Przejdz manual QA z `task-info/06-qa-i-akceptacja.md`.
- Jezeli aplikacja jest uruchamialna, uzyj Argent/UI QA do screenshotow i glownych przeplywow.
- Zapisz znane ograniczenia, zwlaszcza VisionCamera i test fizycznego urzadzenia.

## Granice implementacji

### `app`

Tylko:

- route files,
- layouty,
- minimalne skladanie hookow i komponentow.
- minimalne style potrzebne do poprawnego renderu route.

Nie dodawaj tam:

- fetchowania API,
- storage,
- parsowania PokeAPI,
- komponentow wielokrotnego uzycia,
- typow domenowych.
- dekoracyjnych styli i polishu.

### `src/api`

Tylko komunikacja z PokeAPI i mapowanie payloadow na typy domenowe.

### `src/storage`

Tylko local storage dla favorite i map pins. JSON parse musi miec fallback i nie moze crashowac UI.

### `src/hooks`

Granica integracji dla UI:

- `usePokemonList`.
- `usePokemonDetails(name)`.
- `useFavoritePokemon`.
- `useMapPins`.

### `src/components`

Komponenty prezentacyjne bez bezposredniego dostepu do storage/API.
Komponenty maja miec minimalny layout. Jezeli komponent potrzebuje wiecej niz kilku niezbednych styli, wydziel je do pliku `*.styles.ts` obok komponentu.

### `src/theme`

Tylko male, wspolne stale UI potrzebne do funkcjonalnych komponentow. Nie buduj rozbudowanej palety ani design systemu przed etapem polish.

## QA po kazdym kroku

Po kazdym kroku minimum:

1. Uruchom QA opisane w danym kroku planu.
2. Uruchom `bunx tsc --noEmit`, chyba ze krok jest czysto dokumentacyjny albo znany baseline juz nie przechodzi.
3. Sprawdz `git status --short`.
4. Nie zostawiaj niewyjasnionych crashy, pustych bialych ekranow ani niedokonczonych integracji.

Finalne QA jest w `task-info/06-qa-i-akceptacja.md`.

## Raport koncowy agenta

Na koniec pracy odpowiedz krotko:

- jaki krok zostal zrobiony,
- jakie pliki zmieniono,
- jakie komendy uruchomiono i z jakim wynikiem,
- czego nie udalo sie sprawdzic,
- jaki jest logiczny nastepny krok z roadmapy.

## Ryzyka stale

- Tekst zadania wspomina "3 tabs", ale plan przyjmuje cztery widoki: Favorites, Pokedex, Camera, Map.
- Camera/VisionCamera moze wymagac fizycznego urzadzenia albo development builda.
- Face detection moze nie dzialac w pelni na symulatorze.
- Storage ma uzywac wylacznie `expo-sqlite/kv-store` jako async key-value storage. Nie instaluj `@react-native-async-storage/async-storage`, nie uzywaj `expo-sqlite/localStorage/install` i nie tworz alternatywnego storage.
- Niektore paczki native moga wymagac rebuilda aplikacji.
