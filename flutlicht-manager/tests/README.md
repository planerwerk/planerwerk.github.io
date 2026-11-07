# Tests

Alle Skripte brauchen Node.js und Playwright mit Chromium. Aufruf aus dem Ordner `flutlicht-manager/`.

| Skript | Was es macht | Dauer |
|---|---|---|
| `node tests/ui-zwei-saisons.js` | Spielt zwei Saisons samt Sommer über die echte Oberfläche mit „Tag beenden“: Erinnerungen, Konferenz, Transfers, Verträge, Menü-Schalter, Kalender, 3. Liga, Speichern und Laden, Löschen alter Spielstände, Entlassung, Handy-Breite. Prüft nach jedem Halt die Spieldaten und zählt die Halte pro Woche. | etwa 110 s |
| `node tests/fuzz-karrieren.js` | 13 Karrieren mit verschiedenen Vereinen (zwei davon in der 3. Liga), je zwei Saisons samt Sommer, mit zufälligen Aktionen. Spiel und Aktionen laufen mit festem Seed je Verein, ein Fehler lässt sich also nachstellen. Prüft jeden Spieltag auf gesperrte oder verletzte Spieler. | etwa 40 s |
| `node tests/seed.js` | Wiederholbarkeit: gleicher Seed ergibt den gleichen Verlauf, ein anderer Seed einen anderen, und Speichern, Laden und Weiterspielen ändert nichts. | etwa 10 s |

`tests/pruefungen.js` enthält die gemeinsamen Datenprüfungen, unter anderem: Jeder Verein hat so viele Spiele, wie der Spielplan bis heute vorsieht, Ligagrößen 18/18/20, Regionalligisten ohne Spieler, keine Zweitmannschaft im Pokal, Pokalrunden passen zum Datum, keine abgelaufenen Angebote, Zufallszustand intakt.

Ausgabe: am Ende „PROBLEME (0)“ bzw. „keine Fehler“, sonst eine Liste der Befunde. Bei Befunden endet das Skript mit Exit-Code 1.
