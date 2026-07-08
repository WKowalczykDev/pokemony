# Workflow uruchamiania aplikacji

> Wszystkie komendy uruchamiaj z katalogu `mobile-app`.
> Nie dopisuj zmiany katalogu do komend w tym dokumencie.

Ten plik jest praktyczna sciaga do wyboru trybu uruchomienia aplikacji Pokemony.
Najwazniejsza zasada: zmiany JS/TS zwykle wymagaja tylko Metro, a zmiany native
wymagaja przebudowania dev builda.

## Szybka decyzja

| Sytuacja | Komenda |
| --- | --- |
| Zmiany JS/TS/UI/API/hooki/storage | `bunx expo start --dev-client` |
| Metro pokazuje stary kod, route albo assety | `bunx expo start --dev-client --clear` |
| Pierwsza instalacja dev builda na iOS | `bunx expo run:ios` |
| Nowa paczka native, `app.json`, permissions, pluginy, mapy, kamera | `bunx expo run:ios --no-build-cache` |
| Native config dalej jest stary | `bunx expo prebuild --clean -p ios`, potem `bunx expo run:ios --no-build-cache` |
| Pusty storage albo ponowny prompt permissions na iOS Simulator | `xcrun simctl uninstall booted com.wkowdev.pokemony`, potem `bunx expo run:ios` |
| Szybki web smoke test | `bunx expo start --web` |
| Static QA | `bunx tsc --noEmit`, `bunx expo lint`, `bunx prettier . --check` |

## Spis tresci

- [Codzienny start](#codzienny-start)
- [Pierwsze uruchomienie dev builda](#pierwsze-uruchomienie-dev-builda)
- [Zmiany native](#zmiany-native)
- [Clean prebuild](#clean-prebuild)
- [Expo Go vs dev client](#expo-go-vs-dev-client)
- [Web](#web)
- [Cache Metro](#cache-metro)
- [Dane aplikacji i permissions](#dane-aplikacji-i-permissions)
- [PokeAPI](#pokeapi)
- [Storage](#storage)
- [Mapy i lokalizacja](#mapy-i-lokalizacja)
- [Kamera i VisionCamera](#kamera-i-visioncamera)
- [Port Metro i polaczenie z dev serverem](#port-metro-i-polaczenie-z-dev-serverem)
- [QA przed oddaniem kroku](#qa-przed-oddaniem-kroku)

## Codzienny start

Uzywaj, gdy zmieniasz:

- route files,
- komponenty,
- hooki,
- API,
- storage,
- typy,
- style,
- zwykly kod JS/TS.

```bash
bunx expo start --dev-client
```

Po starcie Metro:

- **iOS Simulator**: nacisnij `i` w terminalu Metro albo otworz zainstalowana aplikacje
  Pokemony na symulatorze.
- **Fizyczny iPhone**: zeskanuj QR w dev buildzie / Expo Dev Client.
- **Android Emulator**: nacisnij `a`, jesli Android jest potrzebny do regresji.

Jesli aplikacja widzi stary kod, uzyj wariantu z czyszczeniem cache:

```bash
bunx expo start --dev-client --clear
```

## Pierwsze uruchomienie dev builda

Uzyj, gdy aplikacja nie jest jeszcze zainstalowana na iOS Simulator albo po swiezym
setupie repo.

```bash
bunx expo run:ios
```

Gdy build przejdzie, przy kolejnych zmianach JS/TS wracaj do:

```bash
bunx expo start --dev-client
```

## Zmiany native

Uzyj po zmianach, ktore dotykaja natywnej aplikacji:

- `bunx expo install ...`,
- `bun add ...` dla paczek native,
- `app.json`,
- Expo plugins,
- permissions,
- bundle identifier / package name,
- Reanimated / Worklets,
- SQLite,
- mapy,
- VisionCamera,
- media library,
- lokalizacja.

```bash
bunx expo run:ios --no-build-cache
```

Po udanym rebuildzie wracaj do zwyklego startu:

```bash
bunx expo start --dev-client
```

## Clean prebuild

Uzyj, gdy po zmianach native nadal widzisz:

- stare permissions,
- stare pluginy,
- brak nowej paczki,
- bledy linkowania,
- zachowanie niezgodne z `app.json`,
- natywny build, ktory wyglada jakby pamietal poprzednia konfiguracje.

```bash
bunx expo prebuild --clean -p ios
bunx expo run:ios --no-build-cache
```

Przed clean prebuild sprawdz status repo:

```bash
git status --short
```

Clean prebuild regeneruje katalogi native. Jesli w przyszlosci beda dodane do repo,
moze zmienic wiecej plikow niz zwykly rebuild.

## Expo Go vs dev client

Ten projekt ma `expo-dev-client` i paczki native, wiec domyslnie uzywaj:

```bash
bunx expo start --dev-client
```

Expo Go moze zadzialac tylko na bardzo wczesnym etapie bez custom native dependencies.
Nie traktuj Expo Go jako zrodla prawdy dla:

- map,
- `expo-sqlite/kv-store`,
- VisionCamera,
- Reanimated / Worklets,
- permissions,
- dev-client-only zachowan.

## Web

Web jest tylko szybkim smoke testem prostego UI.
Nie jest pelnym QA aplikacji mobilnej.

```bash
bunx expo start --web
```

Na webie inaczej moga dzialac:

- mapy,
- kamera,
- native permissions,
- czesc paczek Expo / React Native,
- storage natywny.

## Cache Metro

Uzyj, gdy:

- Expo Router nie widzi dodanego albo usunietego pliku route,
- asset albo obrazek wyglada na stary,
- TypeScript juz przechodzi, ale bundler pokazuje poprzedni blad,
- po zmianach dependency graph Metro zachowuje sie niespojnie.

```bash
bunx expo start --dev-client --clear
```

## Dane aplikacji i permissions

### Czyszczenie danych na iOS Simulator

Uzyj do sprawdzania empty state, pierwszego uruchomienia, storage od zera albo ponownego
promptu permissions.

```bash
xcrun simctl uninstall booted com.wkowdev.pokemony
bunx expo run:ios
```

### Zmiany permission copy albo `app.json`

```bash
bunx expo run:ios --no-build-cache
```

### Corner case'y permissions

Sprawdz recznie:

- odmowa kamery,
- odmowa galerii,
- odmowa lokalizacji,
- ponowne wejscie w tab po odmowie,
- restart aplikacji po odmowie,
- ekran fallbacku bez crasha.

## PokeAPI

Normalny start do pracy z PokeAPI:

```bash
bunx expo start --dev-client
```

Corner case'y QA:

- brak internetu,
- wolne polaczenie,
- non-OK response z API,
- retry po bledzie,
- pull-to-refresh po bledzie,
- wejscie w detail z niepoprawna nazwa,
- szybkie wejscie i wyjscie z detail podczas ladowania.

Zasada projektu:

```text
Nie dodawaj axios. PokeAPI obsluguj przez natywny fetch.
```

## Storage

Po zwyklych zmianach w storage:

```bash
bunx expo start --dev-client --clear
```

Test persistencji:

1. Ustaw favorite albo dodaj pin.
2. Zamknij aplikacje.
3. Uruchom aplikacje ponownie bez uninstall.
4. Sprawdz, czy dane zostaly.

Test empty state:

```bash
xcrun simctl uninstall booted com.wkowdev.pokemony
bunx expo run:ios
```

Zasady projektu:

```text
Storage lokalny ma uzywac tylko expo-sqlite/kv-store.
Nie instaluj @react-native-async-storage/async-storage.
Nie uzywaj expo-sqlite/localStorage/install.
Nie tworz recznych tabel SQLite dla favorite/map pins.
```

## Mapy i lokalizacja

Po dodaniu albo zmianie `react-native-maps`, `expo-location`, permissions albo pluginow:

```bash
bunx expo run:ios --no-build-cache
```

Do zwyklych zmian UI mapy:

```bash
bunx expo start --dev-client
```

Corner case'y QA:

- mapa bez zgody na lokalizacje,
- mapa z wolnym internetem,
- long press bez favorite,
- long press z favorite,
- marker press po restarcie aplikacji,
- pin zapisany przed zmiana shape danych storage,
- uszkodzony JSON / nieoczekiwany payload storage,
- brak internetu przy pierwszym renderze mapy.

## Kamera i VisionCamera

Kamera wymaga dev builda i jest osobnym, kosztownym etapem.

Po instalacji albo zmianie VisionCamera, worklets, face detectora, media library,
permissions albo Babel/native config:

```bash
bunx expo run:ios --no-build-cache
```

Jesli build dalej widzi stary native config:

```bash
bunx expo prebuild --clean -p ios
bunx expo run:ios --no-build-cache
```

Corner case'y QA:

- brak zgody na kamere,
- brak favorite,
- kamera niedostepna na symulatorze,
- brak twarzy w kadrze,
- wykryta twarz,
- odmowa galerii,
- odmowa lokalizacji po zapisie zdjecia,
- powrot z Camera tab do innych tabow,
- restart aplikacji po odmowie permission.

Wazne ograniczenie:

```text
Face detection i realny aparat moga wymagac fizycznego urzadzenia.
Symulator nie wystarcza jako dowod, ze caly camera flow dziala.
```

## Port Metro i polaczenie z dev serverem

Expo zwykle zaproponuje inny port, gdy domyslny jest zajety.
Jesli trzeba ustawic port jawnie:

```bash
bunx expo start --dev-client --port 8082
```

Gdy telefon nie laczy sie z Metro:

- upewnij sie, ze telefon i komputer sa w tej samej sieci,
- sprobuj trybu tunnel z Expo UI/terminala, jesli LAN nie dziala,
- zrestartuj Metro z `--clear`,
- sprawdz, czy aplikacja nie otwiera starego bundle.

Gdy aplikacja otwiera stary bundle albo nie laczy sie z dev serverem:

```bash
bunx expo start --dev-client --clear
```

Jesli nadal jest zle:

```bash
xcrun simctl uninstall booted com.wkowdev.pokemony
bunx expo run:ios --no-build-cache
```

## QA przed oddaniem kroku

Minimum po kazdym kroku:

```bash
bunx tsc --noEmit
git status --short
```

Gdy tooling jest skonfigurowany albo krok dotyka formatowania/lintu:

```bash
bunx expo lint
bunx prettier . --check
```

Manualne minimum:

- aplikacja nie pokazuje pustego bialego ekranu,
- aktualny tab albo route renderuje sie bez crasha,
- loading / error / empty state dziala,
- tekst nie nachodzi na siebie,
- back navigation dziala tam, gdzie powinna,
- persistencja dziala po restarcie aplikacji, jesli krok dotyka storage,
- odmowa permission nie crashuje UI, jesli krok dotyka permissions.

Nie rob pelnego polishu przed etapem polish. Sprawdz zakres aktualnego kroku i male
integracje, ktore mogly sie zepsuc.
