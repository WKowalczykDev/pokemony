# Pokemony - dokumentacja zadania

Ten katalog opisuje zadanie startowe dla aplikacji mobilnej Pokemony. Dokumentacja jest przygotowana tak, zeby mozna bylo pracowac z nia w stylu agentic engineering: kazdy agent lub kolejna sesja Codex moze szybko zrozumiec zakres, architekture, paczki i kolejnosc implementacji.

Podstawowym zrodlem wymagan jest plik `introductory task 2.0 final.txt`. PDF w tym katalogu traktujemy jako material pomocniczy, uzywany tylko wtedy, gdy tekst z `pdftotext` jest niejasny.

## Kolejnosc czytania

1. [01-problematyka.md](01-problematyka.md) - co trzeba zbudowac, jakie sa wymagania, bonusy i ryzyka.
2. [02-architektura-aplikacji.md](02-architektura-aplikacji.md) - docelowa struktura Expo Router, przeplyw danych, storage i typy.
3. [03-paczki-i-software-mansion.md](03-paczki-i-software-mansion.md) - paczki Expo/React Native oraz stos Software Mansion.
4. [04-agentic-engineering-plan.md](04-agentic-engineering-plan.md) - podzial pracy na agentow, kontrakty i zasady wspolpracy.
5. [05-plan-implementacji-krok-po-kroku.md](05-plan-implementacji-krok-po-kroku.md) - konkretna roadmapa implementacyjna.
6. [06-qa-i-akceptacja.md](06-qa-i-akceptacja.md) - testy, scenariusze akceptacji i kontrola jakosci.
7. [07-checklista-wymagan.md](07-checklista-wymagan.md) - osobna checklista wymagan przygotowana na bazie `pdftotext`.

## Najwazniejsze decyzje

- Target implementacyjny: iOS-first, bo projekt ma juz katalog `mobile-app/ios`.
- Nawigacja: Expo Router z czterema tabami i stackami wewnatrz tabow.
- Dane: PokeAPI przez natywny `fetch`, zarzadzanie stanem serwerowym przez TanStack Query.
- Lokalny storage: jedynym zrodlem prawdy dla key-value danych aplikacji jest `react-native-mmkv`. Nie uzywamy `@react-native-async-storage/async-storage`, `expo-sqlite/kv-store`, `expo-sqlite/localStorage/install` ani recznych tabel SQLite dla favorite/map pins. Favorites zapisujemy wylacznie jako tablice ID Pokemonow.
- Package manager: Bun jest domyslnym managerem dla projektu; komendy Expo uruchamiamy przez `bunx`.
- Software Mansion: korzystamy z paczek SWM jako fundamentu gestow, animacji, ekranow i workletow.
- Kamera: VisionCamera jest osobnym etapem wysokiego ryzyka, wymagajacym development builda.

## Lokalizacja projektu

Kod aplikacji znajduje sie w `mobile-app`. Obecny stan to starter Expo z plikami `App.tsx`, `index.ts`, `app.json`, `tsconfig.json`, `bun.lock`, katalogiem `ios` i zainstalowanymi `node_modules`.
