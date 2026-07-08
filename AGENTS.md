# Pokemony agent guide

Ten plik opisuje, jak agent ma pracowac w tym repo. Dokumentacja w `task-info`
jest przede wszystkim notatka uzytkownika i materialem referencyjnym. Nie jest
automatyczna lista rzeczy do zaimplementowania.

## Najwazniejsza zasada

Agent robi tylko ten zakres, o ktory uzytkownik wyraznie poprosi.

Jezeli prompt wskazuje jedna czesc, ekran, paczke albo etap, agent ma wykonac
tylko ten zakres oraz najmniejsze niezbedne poprawki integracyjne. Nie wolno
dodawac kolejnych funkcji "przy okazji", nawet jezeli sa opisane w `task-info`.

Jezeli zakres jest niejasny:

1. Sprawdz aktualny stan repo.
2. Sprawdz powiazane notatki w `task-info`.
3. Wybierz najmniejszy sensowny zakres albo zadaj krotkie pytanie, jesli bez
   tego latwo zrobic zla rzecz.

## Jak traktowac `task-info`

- `task-info` to kontekst, inspiracja i lista mozliwych kierunkow.
- Pliki w `task-info` nie sa nakazem wykonania calej roadmapy.
- Jezeli uzytkownik poda konkretna czesc do developmentu, agent moze wzorowac
  sie na odpowiednim pliku albo etapie.
- Jezeli uzytkownik nie poda czesci, agent nie powinien sam zaczynac duzego
  etapu z roadmapy.

## Gdzie jest kod

- Kod aplikacji: `mobile-app`.
- Notatki i material referencyjny: `task-info`.
- Ogolne QA: `task-info/06-qa-i-akceptacja.md`.
- Lista mozliwych wymagan: `task-info/07-checklista-wymagan.md`.

## Zasady pracy przed zmianami

Przed zmiana kodu:

1. Przeczytaj ten plik.
2. Przeczytaj `mobile-app/AGENTS.md`.
3. Przeczytaj tylko te pliki z `task-info`, ktore dotycza wskazanego zakresu.
4. Sprawdz aktualny stan repo i nie zakladaj, ze poprzednie etapy sa kompletne.
5. Zmien tylko minimalny potrzebny zakres.

Przed zmiana samej dokumentacji wystarczy przeczytac pliki, ktore sa zmieniane
albo ktore nadaja kontekst zmianie.

## Preferencje implementacyjne

- Rozwiazanie ma byc jak najbardziej minimalne.
- Funkcjonalnosc jest wazniejsza niz wyglad.
- Style dodawaj tylko wtedy, gdy sa potrzebne do dzialania, safe area,
  czytelnosci, braku nachodzenia tekstu albo stabilnych wymiarow.
- Nie dodawaj dekoracyjnych styli, rozbudowanych palet, cieni, animacji,
  haptics, bottom sheetow ani placeholderow bez wyraznej prosby.
- Nie instaluj paczek na zapas.
- Nie dodawaj funkcji tylko dlatego, ze sa opisane w notatkach.
- Jezeli da sie zrobic prostsza wersje bez nowej paczki, wybierz prostsza
  wersje.

## Zasady techniczne

- Projekt aplikacji jest w `mobile-app`.
- Target: Expo SDK 57, iOS-first, chyba ze uzytkownik poprosi inaczej.
- Package manager: Bun.
- Komendy uruchamiaj z `mobile-app`, chyba ze prompt mowi inaczej.
- Paczki zgodne z Expo instaluj przez `bunx expo install`.
- Paczki spoza Expo SDK instaluj przez `bun add`.
- Dev dependencies instaluj przez `bun add -d`.
- Nie uzywaj `axios`; PokeAPI obsluguj przez natywny `fetch`.
- Lokalny key-value storage, jezeli bedzie potrzebny, ma uzywac
  `react-native-mmkv`, chyba ze uzytkownik wyraznie zmieni decyzje.
- Nie umieszczaj komponentow wielokrotnego uzycia, hookow, storage, API ani
  typow domenowych w `app`.
- `app` ma zawierac route files i layouty, a logika ma byc w `src`.

## Opcjonalny kierunek struktury

Ta struktura jest kierunkiem, nie obowiazkiem tworzenia wszystkiego od razu:

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

Tworz tylko katalogi i pliki potrzebne dla aktualnie wskazanego zakresu.

## Praca krok po kroku

Gdy uzytkownik napisze np. "zrob Pokedex", "teraz favorite" albo "lecimy z
mapa":

1. Zidentyfikuj najmniejszy zakres tej prosby.
2. Przeczytaj powiazane notatki z `task-info`.
3. Sprawdz aktualny kod.
4. Zaimplementuj tylko potrzebna czesc.
5. Uruchom adekwatne QA dla zmienionego zakresu.
6. Na koniec krotko podaj:
   - co zmieniono,
   - jakie komendy/testy uruchomiono,
   - czego nie sprawdzono,
   - jaki jest logiczny nastepny krok, jesli istnieje.

## Funkcje tylko na wyrazna prosbe

Te elementy moga byc opisane w notatkach, ale nie powinny byc dodawane bez
jasnego polecenia:

- kamera i VisionCamera,
- mapa i lokalizacja,
- animacje Reanimated,
- haptics,
- bottom sheet,
- zaawansowany polish UI,
- zapisywanie zdjec,
- dodatkowe pakiety natywne.

## QA

Po kazdej zmianie uruchom QA proporcjonalne do zakresu:

- dla zmian TypeScript: zwykle `bunx tsc --noEmit`,
- dla zmian lintowanych: `bunx expo lint`, jesli projekt ma lint,
- dla zmian formatowania: `bunx prettier . --check`, jesli jest istotne,
- dla UI: reczny test tylko zmienionego ekranu lub przeplywu.

Nie uruchamiaj kosztownych ani natywnych testow, jezeli zmiana ich nie dotyczy
albo uzytkownik o nie nie poprosil.

## Raport koncowy agenta

Odpowiedz krotko:

- jaki zakres zostal zrobiony,
- jakie pliki zmieniono,
- jakie komendy uruchomiono i z jakim wynikiem,
- czego nie udalo sie sprawdzic,
- co jest najrozsadniejszym nastepnym krokiem.
