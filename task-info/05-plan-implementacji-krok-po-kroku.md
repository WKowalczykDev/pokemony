# Opcjonalne etapy implementacji

Ten plik jest menu mozliwych etapow. Nie jest obowiazkowa roadmapa.

Agent wykonuje etap tylko wtedy, gdy uzytkownik wyraznie go wskaze, np.
"zrob Pokedex", "teraz favorite", "lecimy z mapa" albo "zrob krok 3".

Jezeli uzytkownik wskaze etap, agent robi tylko ten etap oraz najmniejsze
niezbedne poprawki integracyjne.

## Zasady dla kazdego etapu

- Najpierw sprawdz aktualny stan repo.
- Nie zakladaj, ze poprzednie etapy sa kompletne.
- Nie instaluj paczek na zapas.
- Nie dodawaj bonusow.
- Style ogranicz do minimum potrzebnego do dzialania, safe area, czytelnosci i
  stabilnego layoutu.
- Po pracy uruchom QA adekwatne do zmiany.

## Etap 0 - baseline

Cel:

- potwierdzic stan repo i srodowiska.

Mozliwe akcje:

- wejsc do `mobile-app`,
- sprawdzic `package.json`, `app.json`, `tsconfig.json`, `AGENTS.md`,
- uruchomic:

```bash
bun --version
bunx tsc --noEmit
```

QA:

- zapisac, czy baseline przechodzi przed zmianami,
- sprawdzic `git status --short`.

## Etap 1 - routing

Cel:

- dodac albo poprawic Expo Router tylko w zakresie potrzebnym aktualnej pracy.

Mozliwe akcje:

- ustawic entrypoint Expo Router,
- dodac minimalne `app/_layout.tsx`,
- dodac potrzebne route files,
- dodac `+not-found.tsx`, jezeli ma sens.

Nie robic:

- wszystkich tabow, jezeli nie sa potrzebne,
- dekoracyjnych ekranow startowych,
- dodatkowego polishu.

QA:

- `bunx tsc --noEmit`,
- sprawdzenie, czy pierwszy potrzebny ekran renderuje sie bez bialej strony.

## Etap 2 - taby i puste ekrany

Cel:

- dodac tylko te taby, o ktore uzytkownik poprosi.

Mozliwe taby:

- Favorites,
- Pokedex,
- Camera,
- Map.

Minimalny placeholder:

- prosty tekst identyfikujacy ekran,
- safe area, jezeli potrzebna,
- bez dekoracyjnych styli.

QA:

- recznie otworzyc dotkniete taby,
- `bunx tsc --noEmit`.

## Etap 3 - minimalne komponenty UI

Cel:

- uniknac powielania prostych stanow UI, jezeli zaczynaja sie powtarzac.

Mozliwe komponenty:

- `EmptyState`,
- `ErrorState`,
- `LoadingState`,
- prosty row/list item dla Pokemona.

Nie dodawac:

- rozbudowanej palety,
- cieni,
- animacji,
- ozdobnych kart.

QA:

- komponenty renderuja sie bez crasha,
- tekst nie nachodzi na inne elementy,
- `bunx tsc --noEmit`.

## Etap 4 - typy domenowe

Cel:

- dodac typy dopiero wtedy, gdy sa potrzebne przez kilka miejsc albo stabilizuja
  kontrakt.

Mozliwe typy:

- `PokemonListItem`,
- `PokemonDetails`,
- `FavoritePokemonIds`,
- `MapPin`.

QA:

- brak duplikacji tych samych shape danych,
- `bunx tsc --noEmit`.

## Etap 5 - PokeAPI

Cel:

- pobrac dane z PokeAPI dla aktualnego ekranu.

Minimalna zasada:

- uzyc natywnego `fetch`,
- nie uzywac `axios`,
- dodac React Query tylko wtedy, gdy zakres wymaga cache, retry, paginacji albo
  odswiezania.

Mozliwe akcje:

- `fetchPokemonPage`,
- `fetchPokemonDetails`,
- hook listy albo detail, jezeli jest potrzebny.

QA:

- success path,
- non-OK response,
- `bunx tsc --noEmit`,
- brak importow z `axios`.

## Etap 6 - Pokedex

Cel:

- minimalna lista Pokemonow.

Mozliwe akcje:

- `FlatList`,
- loading,
- error,
- empty,
- paginacja albo infinite scroll, jezeli poproszono,
- pull-to-refresh, jezeli poproszono,
- przejscie do detail, jezeli detail istnieje lub jest aktualnie robiony.

QA:

- pierwsze ladowanie,
- scroll/refresh tylko jezeli sa zaimplementowane,
- route do detail tylko jezeli jest w zakresie,
- `bunx tsc --noEmit`.

## Etap 7 - Pokemon detail

Cel:

- prosty ekran szczegolow Pokemona.

Mozliwe pola:

- nazwa,
- obrazek,
- typy,
- height,
- weight,
- abilities albo stats, jezeli sa potrzebne.

Nie robic:

- bottom sheet bez prosby,
- rozbudowanego layoutu,
- akcji favorite, jezeli storage favorite nie jest w zakresie.

QA:

- route dziala dla nazwy z listy,
- back navigation dziala,
- error state dla blednej nazwy,
- `bunx tsc --noEmit`.

## Etap 8 - favorites

Cel:

- zapisac i pokazac ulubione Pokemony, jezeli uzytkownik poprosi o favorite.

Preferencja storage:

- `react-native-mmkv`,
- key-value,
- ID Pokemonow jako `number[]`,
- fallback przy blednym JSON,
- brak duplikatow.

Mozliwe akcje:

- `favorite-storage.ts`,
- `useFavoritePokemon`,
- akcja set/unset favorite,
- Favorites tab z empty state i lista.

QA:

- brak favorites pokazuje empty,
- dodanie nie robi duplikatow,
- usuniecie usuwa tylko jeden ID,
- restart zachowuje stan,
- `bunx tsc --noEmit`.

## Etap 9 - mapa

Cel:

- mapa i piny tylko na wyrazna prosbe.

Mozliwe akcje:

- instalacja `react-native-maps`,
- opcjonalnie `expo-location`, jezeli potrzebna lokalizacja,
- `MapView`,
- long press dodajacy pin,
- marker press pokazujacy prosty opis,
- storage pinow, jezeli wymagana trwalosc.

Nie robic:

- lokalizacji jako bonusu bez prosby,
- rozbudowanego bottom sheetu,
- integracji z kamera bez prosby.

QA:

- mapa renderuje sie,
- long press dodaje pin, jezeli jest w zakresie,
- marker pokazuje opis, jezeli jest w zakresie,
- piny zostaja po restarcie, jezeli storage jest w zakresie.

## Etap 10 - kamera baseline

Cel:

- kamera tylko na wyrazna prosbe.

Mozliwe akcje:

- VisionCamera dependencies,
- permissions w `app.json`,
- permission flow,
- preview,
- prosty capture button.

Nie robic:

- face detection,
- overlay,
- zapis do galerii,
- lokalizacji,
- map pinow.

QA:

- brak permission nie crashuje,
- preview dziala w development buildzie,
- elementy sterujace nie wchodza pod safe area.

## Etap 11 - camera overlay

Cel:

- overlay/face detection tylko na wyrazna prosbe.

Mozliwe akcje:

- worklets,
- face detector,
- obliczenie pozycji overlay,
- fallback dla braku twarzy.

QA:

- kamera dziala bez twarzy,
- overlay pojawia sie po wykryciu twarzy,
- ograniczenia symulatora sa opisane.

## Etap 12 - zapis zdjec i lokalizacja

Cel:

- bonusy kamery tylko na wyrazna prosbe.

Mozliwe akcje:

- `expo-media-library`,
- zapis zdjecia,
- opcjonalna lokalizacja,
- opcjonalny pin na mapie.

QA:

- odmowa galerii nie crashuje,
- zgoda zapisuje zdjecie,
- odmowa lokalizacji nie blokuje zdjecia.

## Etap 13 - polish

Cel:

- polish tylko wtedy, gdy uzytkownik o to poprosi.

Mozliwe akcje:

- haptics,
- animacje,
- bottom sheet,
- accessibility labels,
- lepsze komunikaty bledow.

Nie robic polishu jako czesci MVP bez prosby.

QA:

- animacje nie pogarszaja wydajnosci,
- gesty nie konfliktuja z nawigacja,
- tekst nie nachodzi na elementy.

## Etap 14 - final QA

Cel:

- sprawdzic aktualnie zaimplementowany zakres, nie wymyslony pelny produkt.

Mozliwe komendy:

```bash
bunx tsc --noEmit
bunx expo lint
bunx prettier . --check
```

Manual QA:

- tylko ekrany i przeplywy, ktore faktycznie istnieja,
- camera/map/native QA tylko jezeli te funkcje sa zaimplementowane.

Raport:

- co sprawdzono,
- czego nie sprawdzono,
- znane ograniczenia.
