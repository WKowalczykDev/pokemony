# Pokemony - notatki do zadania

Ten katalog zawiera notatki uzytkownika i material referencyjny dla agentow.
Nie jest to automatyczna roadmapa do wykonania od poczatku do konca.

Agent ma korzystac z tych plikow tylko wtedy, gdy uzytkownik wskaze konkretna
czesc do developmentu albo gdy potrzebny jest kontekst decyzji technicznych.

## Jak czytac te pliki

1. [01-problematyka.md](01-problematyka.md) - oryginalny zakres zadania oraz
   aktualne preferencje: minimalizm, tylko wskazany zakres, brak bonusow bez
   prosby.
2. [02-architektura-aplikacji.md](02-architektura-aplikacji.md) - kierunek
   struktury aplikacji i granice `app` kontra `src`.
3. [03-paczki-i-software-mansion.md](03-paczki-i-software-mansion.md) - lista
   paczek, ale z zasada instalowania tylko wtedy, gdy dana funkcja jest
   aktualnie implementowana.
4. [04-agentic-engineering-plan.md](04-agentic-engineering-plan.md) - prosty
   protokol pracy agenta.
5. [05-plan-implementacji-krok-po-kroku.md](05-plan-implementacji-krok-po-kroku.md)
   - opcjonalne menu etapow, nie obowiazkowa sekwencja.
6. [06-qa-i-akceptacja.md](06-qa-i-akceptacja.md) - QA proporcjonalne do
   zmienionego zakresu.
7. [07-checklista-wymagan.md](07-checklista-wymagan.md) - robocza lista
   mozliwych wymagan, nie lista rzeczy obowiazkowych.

## Aktualne preferencje

- Implementujemy tylko to, o co uzytkownik wyraznie poprosi.
- Rozwiazanie ma byc minimalne i czytelne.
- Style maja byc ograniczone do minimum potrzebnego do dzialania i czytelnosci.
- Nie dodajemy funkcji, paczek ani polishu na zapas.
- Kamera, mapa, animacje, haptics, bottom sheet i inne dodatki sa tylko na
  wyrazna prosbe.

## Zrodla

Podstawowym zrodlem pierwotnego zadania jest `introductory task 2.0 final.txt`.
PDF jest materialem pomocniczym i nie trzeba go czytac, jezeli plik tekstowy i
notatki Markdown wystarczaja.

## Lokalizacja projektu

Kod aplikacji znajduje sie w `mobile-app`.
