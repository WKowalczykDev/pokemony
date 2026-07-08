# Agentic engineering plan

Ten dokument opisuje prosty sposob pracy agenta w tym repo. Celem jest
minimalny, kontrolowany development wedlug tego, co uzytkownik aktualnie daje do
zrobienia.

## Zasada pracy

Agent nie realizuje calego planu z `task-info` automatycznie. Agent robi tylko
wskazany zakres.

## Protokol agenta

1. Przeczytaj root `AGENTS.md`.
2. Przeczytaj `mobile-app/AGENTS.md`, jezeli bedziesz zmieniac kod aplikacji.
3. Ustal, jaka konkretna czesc jest wskazana w prompcie.
4. Przeczytaj tylko powiazane notatki z `task-info`.
5. Sprawdz aktualny stan repo.
6. Zaimplementuj najmniejszy dzialajacy zakres.
7. Uruchom QA adekwatne do zmiany.
8. Raportuj krotko wynik, testy i ryzyka.

## Minimalny zakres

Minimalny zakres oznacza:

- bez bonusow,
- bez funkcji z przyszlych etapow,
- bez instalowania paczek na zapas,
- bez dekoracyjnych styli,
- bez rozbudowanych abstrakcji, jezeli prosty kod jest wystarczajacy,
- bez refaktorow niezwiazanych z prosba.

## Kiedy pytac uzytkownika

Pytaj tylko wtedy, gdy:

- prompt nie wskazuje, ktora czesc ma byc robiona,
- sa dwa realne warianty o istotnie innym koszcie,
- wykonanie najmniejszego zakresu mogloby byc sprzeczne z intencja uzytkownika,
- potrzebna jest decyzja o paczce natywnej, rebuildzie albo funkcji wysokiego
  ryzyka.

Nie pytaj o rzeczy, ktore da sie ustalic przez przeczytanie repo.

## Granice rownoleglenia

Domyslnie nie ma potrzeby dzielic pracy na wielu agentow. Jezeli praca jest
wieksza, lepiej podzielic ja na male, kolejne promptowane czesci.

Bez wyraznej prosby nie uruchamiaj rownolegle osobnych watkow dla:

- kamery,
- mapy,
- storage,
- UI polish,
- QA end-to-end.

## Kontrakty w kodzie

Jezeli zakres wymaga wspoldzielenia danych, uzyj prostych typow i hookow jako
kontraktu. Nie tworz rozbudowanego systemu tylko dlatego, ze moze przydac sie
pozniej.

Preferencje:

- API w `src/api`,
- storage w `src/storage`,
- hooki w `src/hooks`,
- komponenty prezentacyjne w `src/components`,
- route files i layouty w `app`.

## QA po pracy

QA ma byc proporcjonalne do zmiany:

- zmiany TypeScript: `bunx tsc --noEmit`,
- zmiany lintowane: `bunx expo lint`, jezeli jest skonfigurowany,
- zmiany Markdown: zwykle wystarczy diff i `git status --short`,
- zmiany UI: reczne sprawdzenie dotknietego ekranu,
- zmiany natywne: opisac, czy wymagaja rebuilda i czego nie sprawdzono.

## Raport koncowy

Raport ma byc krotki:

- zrobiony zakres,
- zmienione pliki,
- uruchomione komendy i wynik,
- rzeczy niesprawdzone,
- nastepny logiczny krok, jezeli istnieje.
