# Problematyka zadania

## Cel

Trzeba zbudowac starterowa aplikacje mobilna Pokemony, ktora pobiera dane z [PokeAPI](https://pokeapi.co/), pozwala wybrac ulubionego Pokemona, wyswietla liste Pokemonow, korzysta z kamery oraz pokazuje pinezki na mapie.

Zadanie z tekstu mowi o "3 tabs", ale wymienia cztery widoki:

1. Favorite Pokemon tab.
2. List of Pokemon tab.
3. Camera screen.
4. Map tab.

Przyjmujemy wiec cztery taby jako zakres implementacji.

## Wymagania funkcjonalne

### 1. Favorite Pokemon

- Ekran pokazuje ulubionego Pokemona.
- Ulubiony Pokemon ma byc zapisany lokalnie.
- Ekran pokazuje podstawowe informacje i zdjecie Pokemona.
- Jesli nie ma ulubionego Pokemona, ekran pokazuje empty state.
- Jesli ulubiony Pokemon istnieje, header ekranu pokazuje przycisk do usuniecia z ulubionych.

Decyzja techniczna: tekst zadania mowi o AsyncStorage. W tym repo realizujemy te intencje przez async API `expo-sqlite/kv-store`, ktore wedlug Expo SDK 57 jest drop-in replacement dla `@react-native-async-storage/async-storage` i zapisuje dane w SQLite. Nie instalujemy osobnej paczki `@react-native-async-storage/async-storage`.

### 2. List of Pokemon

- Ekran pokazuje liste Pokemonow pobierana z PokeAPI.
- Lista ma obslugiwac infinite scrolling, czyli pobieranie kolejnych stron danych.
- Lista ma obslugiwac pull-to-refresh.
- Zdjecia Pokemonow w liscie sa "nice to have", ale warto je dodac, bo mocno poprawiaja UX.
- Klikniecie Pokemona otwiera ekran szczegolow podobny do widoku favorite.
- Na ekranie szczegolow uzytkownik moze ustawic danego Pokemona jako ulubionego.

Bonus: szczegoly Pokemona mozna pokazac jako bottom sheet nad lista. Dla MVP najpierw uzywamy stack navigation, a bottom sheet zostawiamy jako etap polish/bonus.

### 3. Crazy Vision Camera

- Ekran korzysta z `react-native-vision-camera`.
- Wariant bazowy: wykrywanie twarzy i nalozenie obrazka ulubionego Pokemona na czolo.
- Alternatywa z zadania: wykrycie obiektu, na przyklad banana, i zastapienie go obrazkiem Pokemona.
- Dodatkowo mozna zapisac wygenerowane zdjecie do pamieci telefonu.
- Dodatkowo mozna zapisac lokalizacje wykonania zdjecia i pokazac ja pozniej na mapie.

Ten etap jest najbardziej ryzykowny, bo VisionCamera i frame processing wymagaja development builda, konfiguracji natywnej i testow na realnym urzadzeniu lub symulatorze z kompatybilnymi bibliotekami.

### 4. Map

- Ekran pokazuje mape.
- Long press na mapie dodaje nowa pinezke.
- Klikniecie pinezki pokazuje bottom sheet albo modal-like view.
- Widok pinezki zawiera krotki opis, ktorego Pokemona dotyczy pinezka.
- Komponent szczegolow Pokemona powinien byc wspoldzielony z ekranem detail/list, zeby nie duplikowac logiki.

## Wymagania niefunkcjonalne

- Nawigacja powinna byc zrobiona przez Expo Router.
- Tab navigator powinien miec zagniezdzone stack navigators tam, gdzie jest to potrzebne.
- Projekt powinien miec ESLint i Prettier.
- Kod wygenerowany przez AI ma byc zrozumiany i zweryfikowany, a nie przyjety bez kontroli.
- Aplikacja powinna miec czytelne empty states, loading states i error states.
- UI powinno byc stabilne na iOS, z zachowaniem safe area i natywnych wzorcow nawigacji.

## Zakres MVP

MVP jest gotowe, gdy:

- Sa cztery taby: Favorites, Pokedex, Camera, Map.
- Lista Pokemonow pobiera dane z PokeAPI i ma paginacje.
- Detail Pokemona pokazuje zdjecie i podstawowe informacje.
- Uzytkownik moze ustawic i usunac ulubionego Pokemona.
- Favorite przetrwa restart aplikacji.
- Map pozwala dodawac i ogladac pinezki.
- Camera ma ekran uprawnien i stabilny fallback, nawet jesli zaawansowany overlay nie jest jeszcze skonczony.

## Bonusy

- Bottom sheet dla szczegolow Pokemona.
- Animowane przejscia i mikrointerakcje przez Reanimated.
- Haptics dla wyboru favorite, long press na mapie i wykonania zdjecia.
- Zapis zdjecia z kamery do galerii.
- Zapis lokalizacji zdjecia i automatyczne dodanie pinezki na mapie.
- Lepsze cache obrazkow przez `expo-image`.

## Glowne ryzyka

- VisionCamera wymaga development builda, wiec nie wszystko zadziala w Expo Go.
- Face detector moze miec ograniczenia na niektorych symulatorach iOS.
- PokeAPI moze byc chwilowo niedostepne albo wolne, wiec UI musi miec retry/error states.
- Mapa na iOS powinna dzialac na apple mapsach, powinno istniec pozniejsze ewentualne przygotowanie pod rozszerzenie o androida i implementacje z google mapsa
