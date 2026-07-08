# Robocza checklista mozliwych wymagan

Ten plik jest lista mozliwych wymagan z pierwotnego zadania. Nie jest lista
rzeczy, ktore agent ma sam wdrozyc.

Pozycje z tej listy staja sie zakresem dopiero wtedy, gdy uzytkownik wyraznie
da je do developmentu.

## Decyzje interpretacyjne

- [ ] Zadanie wspomina "3 tabs", ale wymienia cztery widoki.
- [ ] Expo Router jest preferowanym kierunkiem nawigacji.
- [ ] Kazdy tab moze miec wlasny stack, jezeli bedzie potrzebny.
- [ ] Target jest iOS-first, chyba ze uzytkownik poprosi inaczej.
- [ ] Bun jest domyslnym package managerem.
- [ ] Local key-value storage, jezeli bedzie potrzebny, preferuje
      `react-native-mmkv`.
- [ ] Favorites, jezeli beda robione, powinny byc zapisane jako ID Pokemonow,
      nie jako pelny payload PokeAPI.

## Preferencje uzytkownika

- [ ] Implementowac tylko wskazany zakres.
- [ ] Wybierac minimalne dzialajace rozwiazanie.
- [ ] Nie dodawac funkcji przy okazji.
- [ ] Nie instalowac paczek na zapas.
- [ ] Style ograniczac do minimum.
- [ ] Nie dodawac dekoracyjnego polishu bez prosby.
- [ ] Kamera, mapa, animacje, haptics i bottom sheet sa tylko na wyrazna
      prosbe.

## Favorites Pokemon tab

Mozliwe wymagania, jezeli uzytkownik poprosi o favorite:

- [ ] Ekran pokazuje ulubione Pokemony, jesli istnieja.
- [ ] Ulubione Pokemony sa zapisane lokalnie jako tablica ID.
- [ ] Brak ulubionych Pokemonow pokazuje empty state.
- [ ] UI pozwala usunac pojedynczego Pokemona z favorites.
- [ ] Favorites pozostaja po restarcie aplikacji, jezeli storage jest w
      zakresie.

## List of Pokemon tab

Mozliwe wymagania, jezeli uzytkownik poprosi o liste:

- [ ] Lista pobiera dane z PokeAPI.
- [ ] Lista ma loading state.
- [ ] Lista ma error state.
- [ ] Lista obsluguje paginacje albo infinite scrolling, jezeli jest to w
      zakresie.
- [ ] Lista obsluguje pull-to-refresh, jezeli jest to w zakresie.
- [ ] Klikniecie Pokemona otwiera detail, jezeli detail jest w zakresie.
- [ ] Obrazki Pokemonow sa opcjonalne i powinny byc dodane tylko wtedy, gdy
      potrzebne dla aktualnego ekranu.

## Pokemon detail

Mozliwe wymagania, jezeli uzytkownik poprosi o detail:

- [ ] Detail pokazuje nazwe Pokemona.
- [ ] Detail pokazuje obrazek, jezeli obrazki sa w zakresie.
- [ ] Detail pokazuje podstawowe dane, np. typy, height, weight.
- [ ] Detail pozwala ustawic favorite, jezeli favorite storage jest w zakresie.
- [ ] Detail ma prosty loading/error state.

## Camera

Mozliwe wymagania tylko na wyrazna prosbe:

- [ ] Ekran korzysta z `react-native-vision-camera`.
- [ ] Ekran ma permission flow dla kamery.
- [ ] Brak permission nie powoduje crasha.
- [ ] Kamera pokazuje preview.
- [ ] Capture robi zdjecie.
- [ ] Face detection naklada obrazek Pokemona.
- [ ] Zapis zdjecia do galerii.
- [ ] Lokalizacja zdjecia.

## Map

Mozliwe wymagania tylko na wyrazna prosbe:

- [ ] Ekran pokazuje mape.
- [ ] Long press dodaje pinezke.
- [ ] Klikniecie pinezki pokazuje prosty opis.
- [ ] Pinezki sa zapisywane lokalnie, jezeli trwalosc jest w zakresie.
- [ ] Lokalizacja uzytkownika jest opcjonalna i tylko na prosbe.

## Polish i dodatki

Tylko na wyrazna prosbe:

- [ ] Bottom sheet.
- [ ] Animacje Reanimated.
- [ ] Haptics.
- [ ] Zaawansowane accessibility labels.
- [ ] Zapis zdjec i powiazanie z mapa.
- [ ] Argent/UI screenshot QA.

## QA

QA dobierac do faktycznej zmiany:

- [ ] Markdown: `git diff -- AGENTS.md task-info` i `git status --short`.
- [ ] TypeScript: `bunx tsc --noEmit`.
- [ ] Lint: `bunx expo lint`, jezeli ma sens.
- [ ] Prettier: `bunx prettier . --check`, jezeli ma sens.
- [ ] Manual QA tylko dla dotknietego ekranu lub przeplywu.
