# QA i kryteria akceptacji

QA ma byc proporcjonalne do faktycznej zmiany. Nie trzeba wykonywac pelnego QA
aplikacji, jezeli zmiana dotyczy tylko jednego pliku, jednego ekranu albo samej
dokumentacji.

## Zasada ogolna

Sprawdzamy tylko to, co zostalo zmienione, oraz najblizsze ryzyko integracyjne.

Nie uruchamiaj kosztownych testow, natywnych buildow ani Argent/UI QA bez
potrzeby lub wyraznej prosby.

## Dokumentacja

Dla zmian w Markdown:

```bash
git diff -- AGENTS.md task-info
git status --short
```

Akceptacja:

- diff dotyczy tylko planowanych plikow,
- dokumenty nie sugeruja automatycznej implementacji calej roadmapy,
- funkcje opcjonalne sa opisane jako tylko na wyrazna prosbe,
- preferencja minimalnych styli i minimalnego zakresu jest jasna.

Nie trzeba uruchamiac TypeScript ani lint, jezeli zmiana dotyczy tylko Markdown.

## Static checks dla kodu

Uruchamiac z katalogu `mobile-app`, gdy zmiana dotyczy kodu TypeScript albo
konfiguracji aplikacji:

```bash
bunx tsc --noEmit
```

Jezeli projekt ma skonfigurowany lint albo zmiana dotyczy lintowanych plikow:

```bash
bunx expo lint
```

Jezeli zmiana dotyczy formatowania wielu plikow:

```bash
bunx prettier . --check
```

Raport QA powinien podac dokladna komende i wynik.

## Manual QA - zasada

Manual QA rob tylko dla ekranu lub przeplywu, ktory byl zmieniany.

Przyklad:

- zmiana Pokedex -> testuj Pokedex,
- zmiana Favorites -> testuj Favorites,
- zmiana Map -> testuj Map,
- zmiana Camera -> testuj Camera,
- zmiana dokumentacji -> nie testuj UI.

## Pokedex QA

Stosowac tylko, gdy Pokedex jest dotkniety.

Mozliwe scenariusze:

- pierwsze ladowanie pokazuje dane albo loading,
- error state nie daje bialej strony,
- paginacja dziala, jezeli zostala zaimplementowana,
- pull-to-refresh dziala, jezeli zostal zaimplementowany,
- przejscie do detail dziala, jezeli jest w zakresie.

## Detail QA

Stosowac tylko, gdy Pokemon detail jest dotkniety.

Mozliwe scenariusze:

- route otwiera sie dla poprawnej nazwy,
- back navigation dziala,
- error state dziala dla niepoprawnej nazwy,
- akcja favorite dziala tylko jezeli favorite jest w zakresie.

## Favorites QA

Stosowac tylko, gdy Favorites albo storage favorite sa dotkniete.

Mozliwe scenariusze:

- brak favorites pokazuje empty state,
- dodanie favorite zapisuje ID,
- ponowne dodanie nie robi duplikatu,
- usuniecie usuwa pojedynczy ID,
- restart zachowuje stan, jezeli storage jest zaimplementowany.

## Map QA

Stosowac tylko, gdy Map tab jest dotkniety.

Mozliwe scenariusze:

- mapa renderuje sie w dostepnym obszarze,
- long press dodaje pin, jezeli jest w zakresie,
- marker pokazuje opis, jezeli jest w zakresie,
- piny zostaja po restarcie, jezeli storage jest w zakresie.

## Camera QA

Stosowac tylko, gdy Camera tab jest dotkniety.

Mozliwe scenariusze:

- brak permission nie crashuje,
- permission flow jest zrozumialy,
- preview dziala w development buildzie, jezeli kamera jest w zakresie,
- overlay dziala tylko jezeli face detection jest w zakresie,
- ograniczenia symulatora lub fizycznego urzadzenia sa opisane.

## Argent/UI QA

Argent/UI QA jest opcjonalne. Uzywac tylko wtedy, gdy:

- uzytkownik wyraznie poprosi,
- zmiana UI jest ryzykowna,
- aplikacja jest juz uruchamialna i warto potwierdzic layout screenshotami.

Nie jest wymagane dla zmian dokumentacji ani malych zmian logicznych.

## Release readiness

Release readiness dotyczy tylko faktycznie zaimplementowanego zakresu.

Nie oznaczaj jako brakow funkcji, ktore sa tylko opcjonalnymi notatkami albo
ktorych uzytkownik jeszcze nie dal do developmentu.

Minimalny raport finalny:

- static checks,
- manual QA dla istniejacych przeplywow,
- znane ograniczenia,
- czego nie sprawdzono.
