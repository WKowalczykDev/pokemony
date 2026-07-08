# Problematyka zadania

Ten plik rozdziela pierwotny zakres zadania od aktualnych preferencji
uzytkownika. Pierwotne wymagania sa kontekstem. Nie oznaczaja, ze agent ma sam
wdrozyc wszystkie funkcje.

## Aktualna zasada nadrzedna

Agent implementuje tylko czesc wskazana przez uzytkownika. Jezeli uzytkownik
daje do developmentu tylko jeden ekran albo jedna funkcje, agent nie dodaje
reszty aplikacji przy okazji.

Rozwiazanie ma byc mozliwie minimalne:

- minimum kodu potrzebnego do dzialania,
- minimum styli potrzebnych do czytelnosci i stabilnego layoutu,
- brak dekoracyjnego polishu bez prosby,
- brak niepotrzebnych paczek,
- brak bonusow bez jasnego polecenia.

## Pierwotny cel zadania

Zadanie dotyczy aplikacji mobilnej Pokemony, ktora moze:

- pobierac dane z PokeAPI,
- pokazywac liste Pokemonow,
- pozwalac wybrac ulubionego Pokemona,
- korzystac z kamery,
- pokazywac pinezki na mapie.

Tekst zadania wspomina "3 tabs", ale wymienia cztery widoki:

1. Favorite Pokemon tab.
2. List of Pokemon tab.
3. Camera screen.
4. Map tab.

To jest notatka interpretacyjna. Cztery taby nie musza powstac naraz.

## Mozliwe czesci funkcjonalne

### Favorite Pokemon

Mozliwy zakres:

- pokazanie ulubionych Pokemonow,
- lokalny zapis ulubionych jako tablica ID,
- empty state przy braku ulubionych,
- usuniecie pojedynczego ulubionego Pokemona.

Preferencja minimalna:

- bez rozbudowanych kart,
- bez animacji,
- bez dodatkowych danych, jezeli nie sa potrzebne,
- storage tylko wtedy, gdy etap favorite jest faktycznie robiony.

### List of Pokemon

Mozliwy zakres:

- pobieranie listy z PokeAPI,
- paginacja albo infinite scroll,
- pull-to-refresh,
- przejscie do szczegolow Pokemona.

Preferencja minimalna:

- zwykla lista,
- proste loading/error/empty,
- natywny `fetch`,
- bez `axios`,
- obrazki tylko jezeli sa juz potrzebne dla danego ekranu.

### Pokemon detail

Mozliwy zakres:

- nazwa,
- obrazek,
- typy,
- podstawowe informacje,
- akcja ustawienia favorite, jezeli favorite storage juz istnieje albo jest
  aktualnie wdrazany.

Preferencja minimalna:

- stack route zamiast bottom sheet,
- proste teksty i spacing,
- brak dodatkowych sekcji, jezeli nie sa wymagane.

### Camera

Kamera jest funkcja wysokiego kosztu i ryzyka. Wymaga natywnych paczek,
permission flow i czesto development builda.

Nie implementowac kamery bez wyraznej prosby.

Mozliwy zakres dopiero na prosbe:

- permission flow,
- preview,
- capture,
- overlay ulubionego Pokemona,
- zapis zdjecia.

### Map

Mapa wymaga natywnej paczki i osobnego testu UI.

Nie implementowac mapy bez wyraznej prosby.

Mozliwy zakres dopiero na prosbe:

- render mapy,
- long press dodajacy pin,
- klik marker pokazujacy prosty opis,
- lokalny zapis pinow.

## Bonusy

Ponizsze rzeczy sa opcjonalne i tylko na wyrazna prosbe:

- bottom sheet,
- animacje,
- haptics,
- zaawansowany polish,
- zapis zdjec do galerii,
- lokalizacja zdjec,
- face detection,
- automatyczne piny z kamery.

## Glowne ryzyka

- VisionCamera moze wymagac development builda lub fizycznego urzadzenia.
- Mapy i lokalizacja moga wymagac dodatkowych uprawnien i konfiguracji.
- PokeAPI moze byc wolne albo niedostepne.
- Instalowanie paczek natywnych moze wymagac rebuilda.

Te ryzyka maja znaczenie tylko wtedy, gdy dana funkcja jest aktualnie robiona.
