# Checklista wymagan z pdftotext

Ten plik jest osobna, robocza checklista wymagan przygotowana na bazie `introductory task 2.0 final.txt`. Nie zmienia ona oryginalnego `pdftotext`; sluzy tylko do planowania, implementacji i QA.

## Decyzje interpretacyjne

- [ ] Traktujemy zadanie jako aplikacje z czterema tabami, mimo ze tekst wspomina o "3 tabs".
- [ ] Nawigacja ma byc oparta o Expo Router.
- [ ] Kazdy tab moze miec wlasny stack navigator.
- [ ] Target implementacyjny jest iOS-first.
- [ ] Lokalny zapis favorite robimy wylacznie przez async API `expo-sqlite/kv-store`, bez instalowania `@react-native-async-storage/async-storage`, bez `expo-sqlite/localStorage/install` i bez recznych tabel SQLite.
- [ ] Bun jest domyslnym package managerem.

## Favorite Pokemon tab

- [ ] Ekran pokazuje ulubionego Pokemona, jesli istnieje.
- [ ] Ulubiony Pokemon jest zapisany lokalnie.
- [ ] Ekran pokazuje podstawowe informacje o Pokemonie.
- [ ] Ekran pokazuje zdjecie Pokemona.
- [ ] Brak ulubionego Pokemona pokazuje empty state.
- [ ] Przy istniejacym favorite header pokazuje przycisk unfavorite.
- [ ] Unfavorite usuwa Pokemona ze storage.
- [ ] Favorite pozostaje po restarcie aplikacji.

## List of Pokemon tab

- [ ] Lista pobiera dane z PokeAPI.
- [ ] Lista obsluguje infinite scrolling.
- [ ] Lista pobiera kolejne strony danych.
- [ ] Lista obsluguje pull-to-refresh.
- [ ] Lista ma loading state.
- [ ] Lista ma error state i retry.
- [ ] Lista pokazuje zdjecia Pokemonow, jesli dane sa dostepne.
- [ ] Zdjecia laduja sie lazy/cache-friendly przez `expo-image`.
- [ ] Klikniecie Pokemona otwiera ekran szczegolow.
- [ ] Ekran szczegolow jest podobny do Favorite Pokemon.
- [ ] Ekran szczegolow pozwala ustawic Pokemona jako favorite.

## Bonus dla listy/detail

- [ ] Detail moze zostac pokazany jako bottom sheet.
- [ ] MVP uzywa stack navigation jako pierwszej, stabilnej implementacji.
- [ ] Bottom sheet mozna dodac pozniej przez Gesture Handler/Reanimated.

## Crazy Vision Camera screen

- [ ] Ekran korzysta z `react-native-vision-camera`.
- [ ] Ekran ma permission flow dla kamery.
- [ ] Brak permission nie powoduje crasha.
- [ ] Brak favorite ma jasny fallback.
- [ ] Kamera wykrywa twarz przez face detector.
- [ ] Obrazek favorite Pokemona jest nakladany w okolicy czola.
- [ ] Brak wykrytej twarzy nie powoduje bledu.
- [ ] Opcjonalnie aplikacja zapisuje utworzone zdjecie do galerii.
- [ ] Opcjonalnie aplikacja zapisuje lokalizacje wykonania zdjecia.
- [ ] Opcjonalnie lokalizacja zdjecia pojawia sie pozniej na mapie.

## Map tab

- [ ] Ekran pokazuje mape.
- [ ] Long press na mapie dodaje nowa pinezke.
- [ ] Klikniecie pinezki pokazuje bottom sheet, modal albo podobny widok.
- [ ] Widok pinezki zawiera krotki opis powiazanego Pokemona.
- [ ] Widok pinezki moze reuse'owac komponent detail Pokemona.
- [ ] Pinezki sa zapisywane lokalnie.
- [ ] Pinezki pozostaja po restarcie aplikacji.

## Additional notes

- [ ] Projekt ma skonfigurowany ESLint.
- [ ] Projekt ma skonfigurowany Prettier.
- [ ] Implementacja pokazuje sensowne "tricks", np. animacje, haptics, bottom sheet albo dobra obsluge native capabilities.
- [ ] Kod wygenerowany przez AI jest sprawdzany i zrozumiany przed przyjeciem.

## Software Mansion stack

- [ ] `react-native-screens` wspiera natywna nawigacje Expo Router.
- [ ] `react-native-gesture-handler` jest gotowy pod bottom sheet i gesty.
- [ ] `react-native-reanimated` jest gotowy pod animacje i mikrointerakcje.
- [ ] `react-native-worklets` jest zaplanowany dla VisionCamera/frame processing.

## QA acceptance

- [ ] Kazdy krok implementacji z `05-plan-implementacji-krok-po-kroku.md` ma wlasne `QA po kroku`.
- [ ] Finalne QA obejmuje static checks przez Bun.
- [ ] Finalne QA obejmuje manualne testy czterech tabow.
- [ ] Finalne QA obejmuje Argent/UI QA, jesli aplikacja jest uruchamialna.
