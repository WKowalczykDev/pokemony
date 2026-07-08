# Architektura aplikacji

Ten plik opisuje preferowany kierunek struktury. To nie jest nakaz tworzenia
wszystkich katalogow, ekranow i typow od razu.

## Aktualne zasady

- `app` ma zawierac route files i layouty.
- Logika domenowa, komponenty wielokrotnego uzycia, hooki, API, storage i typy
  powinny byc w `src`.
- Tworz tylko pliki potrzebne dla aktualnie wskazanego zakresu.
- Jezeli prosty ekran moze dzialac bez nowej abstrakcji, nie dodawaj jej na
  zapas.
- Style ogranicz do minimum potrzebnego do czytelnosci, safe area i stabilnego
  layoutu.

## Stan repo

Projekt aplikacji znajduje sie w `mobile-app`.

Wazne zalozenia:

- Expo SDK 57.
- iOS-first, chyba ze uzytkownik poprosi inaczej.
- Bun jako package manager.
- `mobile-app/AGENTS.md` przypomina, zeby przed pisaniem kodu sprawdzac
  wersjonowana dokumentacje Expo 57.

## Kierunek struktury

Struktura ponizej jest kierunkiem dla sytuacji, gdy kolejne czesci beda
faktycznie implementowane:

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

Nie tworz pustych katalogow i plikow tylko dlatego, ze sa na tej liscie.

## Nawigacja

Preferowany kierunek to Expo Router.

Minimalna zasada:

- dodaj tylko route potrzebny dla aktualnego ekranu,
- nie tworz wszystkich tabow, jezeli uzytkownik poprosil tylko o jeden zakres,
- stack/detail dodawaj dopiero, gdy faktycznie jest przejscie do szczegolow.

## Data flow

### API

PokeAPI, jezeli jest potrzebne, obsluguj przez natywny `fetch`.

Preferowany podzial:

1. UI uzywa hooka albo prostej funkcji integracyjnej.
2. Kod API mieszka w `src/api`.
3. Mapowanie payloadu na prosty model aplikacji nie powinno byc w route file.

Nie dodawaj React Query, jezeli aktualny zakres jest prosty i uzytkownik nie
prosi o cache, infinite query albo wiekszy przeplyw danych. Jezeli jednak lista
ma miec paginacje i odswiezanie, React Query moze byc sensowny.

### Storage

Lokalny key-value storage, jezeli jest potrzebny, powinien uzywac
`react-native-mmkv`, chyba ze uzytkownik wyraznie zmieni decyzje.

Nie dodawaj storage, jezeli aktualna funkcja go nie wymaga.

Preferencja dla favorites:

- zapisywac ID Pokemonow,
- nie zapisywac calego payloadu PokeAPI,
- miec fallback przy blednym JSON,
- unikac duplikatow.

## Typy domenowe

Typy dodawaj wtedy, gdy sa uzywane przez wiecej niz jeden plik albo gdy
pomagaja utrzymac kontrakt miedzy API, storage i UI.

Mozliwe typy:

```ts
export type PokemonListItem = {
  id: number;
  name: string;
  imageUrl?: string;
};

export type PokemonDetails = {
  id: number;
  name: string;
  imageUrl?: string;
  types?: string[];
  height?: number;
  weight?: number;
};

export type FavoritePokemonIds = number[];

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  pokemonName?: string;
  pokemonId?: number;
  createdAt: string;
};
```

To sa przyklady. Nie trzeba ich dodawac, dopoki nie sa potrzebne.

## Granice odpowiedzialnosci

- `app/*`: route files, layouty, minimalne skladanie UI.
- `src/api`: komunikacja z PokeAPI i mapowanie danych.
- `src/storage`: zapis i odczyt lokalny.
- `src/hooks`: integracja API/storage z React.
- `src/components`: prezentacja bez bezposredniego storage/API.
- `src/theme`: male stale UI, tylko jezeli sa faktycznie potrzebne.
- `src/types`: wspoldzielone typy.

## Error handling

Dla ekranow z danymi preferuj proste stany:

- loading,
- error z mozliwoscia ponowienia, jezeli ma sens,
- empty state, jezeli dane moga byc puste.

Nie buduj rozbudowanego systemu stanu, jezeli jeden prosty ekran tego nie
wymaga.
