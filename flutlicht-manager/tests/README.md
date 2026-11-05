# Tests

Beide Skripte brauchen Node.js und Playwright mit Chromium.

| Skript | Was es macht | Dauer |
|---|---|---|
| `node tests/ui-zwei-saisons.js` | Spielt zwei Saisons über die echte Oberfläche: Klicks, Konferenz, Transfers, Verträge, Speichern und Laden, Entlassung, Prüfung der Handy-Breite. Prüft nach jeder Woche die Spieldaten. | etwa 70 s |
| `node tests/fuzz-karrieren.js` | 11 Karrieren mit verschiedenen Vereinen, je zwei Saisons, mit zufälligen Aktionen und denselben Datenprüfungen | etwa 60 s |

Ausgabe: am Ende „PROBLEME (0)“ bzw. „keine Fehler“, sonst eine Liste der Befunde.
Die Skripte prüfen das Spiel `../index.html`. Bei U1 werden sie auf die neue Dateistruktur angepasst.
