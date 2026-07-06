# QA i kryteria akceptacji

## Cel QA

QA ma potwierdzic, ze aplikacja spelnia wymagania z zadania, nie crashuje w podstawowych przeplywach i ma zrozumiale fallbacki dla bledow API, pustych danych oraz braku uprawnien.

## Kontrola dokumentacji

Dokumentacja w `task-info` jest gotowa, gdy:

- kazdy plik ma jasna odpowiedzialnosc,
- wymagania z `introductory task 2.0 final.txt` sa odwzorowane,
- decyzja AsyncStorage jest opisana: uzywamy async API `expo-sqlite/kv-store` zamiast osobnej paczki `@react-native-async-storage/async-storage`,
- Software Mansion stack jest nazwany i uzasadniony,
- roadmapa implementacji jest sekwencyjna i mozliwa do przekazania agentowi,
- QA zawiera scenariusze dla wszystkich czterech tabow.

## Static checks

Uruchomic z katalogu `mobile-app`:

```bash
bunx tsc --noEmit
bunx expo lint
bunx prettier . --check
```

Akceptacja:

- TypeScript przechodzi bez bledow.
- Lint przechodzi bez bledow krytycznych.
- Prettier nie wykrywa nieformatowanych plikow.

Jesli ktoras komenda nie przechodzi, raport QA musi zawierac:

- dokladna komende,
- najwazniejsze bledy,
- decyzje: fix teraz czy znane ograniczenie.

## Manual QA - Favorites

### Brak ulubionego Pokemona

Kroki:

1. Uruchom aplikacje z pustym storage.
2. Wejdz w tab Favorites.

Oczekiwane:

- Widac empty state.
- Nie ma przycisku unfavorite w headerze.
- UI nie crashuje.

### Ustawienie ulubionego

Kroki:

1. Wejdz w Pokedex.
2. Otworz dowolnego Pokemona.
3. Kliknij "Set favorite".
4. Wroc do Favorites.

Oczekiwane:

- Favorites pokazuje wybranego Pokemona.
- Widac zdjecie i podstawowe informacje.
- Header pokazuje akcje unfavorite.

### Trwalosc favorite

Kroki:

1. Ustaw favorite.
2. Zamknij i uruchom aplikacje ponownie.
3. Wejdz w Favorites.

Oczekiwane:

- Favorite nadal jest widoczny.

### Usuniecie favorite

Kroki:

1. Majac ustawionego favorite, wejdz w Favorites.
2. Kliknij header action unfavorite.

Oczekiwane:

- Favorite znika.
- Pojawia sie empty state.
- Po restarcie aplikacji nadal nie ma favorite.

## Manual QA - Pokedex

### Pierwsze ladowanie

Kroki:

1. Wejdz w Pokedex.

Oczekiwane:

- Widac loading state.
- Po chwili widac liste Pokemonow.
- Row zawiera nazwe i najlepiej obrazek.

### Infinite scroll

Kroki:

1. Scrolluj do dolu listy.

Oczekiwane:

- Pobiera sie kolejna strona.
- Lista nie skacze.
- Nie ma duplikatow wynikajacych z blednego merge stron.

### Pull-to-refresh

Kroki:

1. Pociagnij liste w dol.

Oczekiwane:

- Widac refresh indicator.
- Dane odswiezaja sie bez crasha.

### Detail

Kroki:

1. Kliknij dowolnego Pokemona.

Oczekiwane:

- Otwiera sie ekran detail.
- Widac nazwe, obrazek, typy i podstawowe dane.
- Jest akcja ustawienia favorite.
- Back navigation dziala.

### Error state

Kroki:

1. Zasymuluj brak internetu albo blad API, jesli jest to mozliwe.

Oczekiwane:

- Ekran pokazuje zrozumialy error state.
- Jest retry.
- UI nie pokazuje pustej bialej strony.

## Manual QA - Map

### Wyswietlenie mapy

Kroki:

1. Wejdz w Map tab.

Oczekiwane:

- Mapa renderuje sie na calym dostepnym obszarze.
- UI respektuje safe area i tab bar.

### Dodanie pinezki

Kroki:

1. Wykonaj long press na mapie.

Oczekiwane:

- Pojawia sie pin w miejscu klikniecia.
- Jesli istnieje favorite, pin jest powiazany z tym Pokemonem.
- Jesli nie ma favorite, aplikacja pokazuje jasny fallback.

### Opis pinezki

Kroki:

1. Kliknij marker.

Oczekiwane:

- Pojawia sie modal, formSheet albo bottom sheet.
- Widac opis, ktorego Pokemona dotyczy pin.
- Widok da sie zamknac.

### Trwalosc pinezek

Kroki:

1. Dodaj pin.
2. Zrestartuj aplikacje.
3. Wroc do Map tab.

Oczekiwane:

- Pin nadal istnieje.

## Manual QA - Camera

### Brak uprawnien

Kroki:

1. Odrzuc uprawnienia kamery.
2. Wejdz w Camera tab.

Oczekiwane:

- Widac ekran proszacy o permission.
- Aplikacja nie crashuje.
- Jest jasna akcja ponowienia prosby albo instrukcja systemowa.

### Brak favorite

Kroki:

1. Usun favorite.
2. Daj permission kamery.
3. Wejdz w Camera tab.

Oczekiwane:

- Kamera moze pokazac preview albo empty overlay.
- UI jasno mowi, ze overlay wymaga wybrania favorite.
- Nie ma crasha.

### Preview kamery

Kroki:

1. Ustaw favorite.
2. Daj permission kamery.
3. Wejdz w Camera tab.

Oczekiwane:

- Preview kamery dziala w development buildzie.
- Elementy sterujace nie wchodza pod safe area.

### Face overlay

Kroki:

1. Skieruj kamere na twarz.

Oczekiwane:

- Obrazek favorite Pokemona pojawia sie w okolicy czola.
- Overlay nie migocze nadmiernie.
- Brak twarzy nie powoduje bledu.

### Zapis zdjecia

Kroki:

1. Kliknij capture.
2. Daj permission galerii, jesli system poprosi.

Oczekiwane:

- Zdjecie zapisuje sie do galerii.
- Aplikacja pokazuje sukces albo blad.
- Odmowa galerii nie crashuje aplikacji.

### Lokalizacja zdjecia

Kroki:

1. Wykonaj zdjecie z wlaczona lokalizacja.
2. Wejdz w Map tab.

Oczekiwane:

- Jesli permission location jest przyznane, pojawia sie pin ze `source: "camera"`.
- Jesli permission location jest odrzucone, zdjecie nadal moze byc wykonane.

## Argent/UI QA

Jezeli aplikacja jest uruchomiona na symulatorze lub urzadzeniu, uzyc Argent do:

- screenshotu kazdego taba,
- sprawdzenia, czy tekst nie nachodzi na elementy,
- przejscia Pokedex -> Detail -> Set favorite -> Favorites,
- przejscia Map -> long press -> marker -> modal,
- sprawdzenia Camera permission state.

Akceptacja:

- Kazdy glowny ekran ma screenshot bez oczywistych bledow layoutu.
- Najwazniejszy przeplyw favorite dziala end-to-end.

## Release readiness checklist

- [ ] Cztery taby sa dostepne.
- [ ] Pokedex laduje dane z PokeAPI.
- [ ] Infinite scroll dziala.
- [ ] Pull-to-refresh dziala.
- [ ] Detail pokazuje podstawowe informacje.
- [ ] Favorite mozna ustawic.
- [ ] Favorite mozna usunac.
- [ ] Favorite przetrwa restart.
- [ ] Map renderuje sie.
- [ ] Long press dodaje pin.
- [ ] Marker pokazuje opis.
- [ ] Piny przetrwaja restart.
- [ ] Camera ma permission flow.
- [ ] Camera ma fallback dla braku favorite.
- [ ] VisionCamera dziala w development buildzie albo ograniczenie jest jawnie opisane.
- [ ] ESLint jest skonfigurowany.
- [ ] Prettier jest skonfigurowany.
- [ ] TypeScript przechodzi.
