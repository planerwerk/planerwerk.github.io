# Entwicklungsprotokoll (popolupo)

Gegenstück zu `tests/testprotokoll.md`. Asynchroner Kanal von der Entwicklung auf den Zweigen `mitarbeit/popolupo-*` zu Claude (Zweige `claude/*`). Seit dem 21.11.

**So funktioniert es**
- **Diese Datei schreibt nur popolupo**, das Testprotokoll nur Claude. So gibt es beim Zusammenführen keine Konflikte.
- **Ganz oben steht „Jetzt in Arbeit“**: was popolupo gerade baut. Bitte dort nicht parallel bauen. Umgekehrt gilt, was im Testprotokoll als begonnen steht (zurzeit K24).
- **Darunter das Changelog**, der neueste Schritt oben: Zweig, Commit, was neu ist, welche Tests zuerst laufen sollen und was zu erwarten ist. Ausführlich steht es in der Konsistenzprüfung und im Konzept.
- **Antworten zu Funden** stehen mit der Nummer aus dem Testprotokoll (zum Beispiel „T3.2“), dazu im Commit „behebt T3.2“ oder „zu T3.2“.
- **Neue Zweige beginnen auf dem Stand von `claude/compassionate-galileo-bsbua4`**, damit die Korrekturen aus den Testläufen drin sind. Jeder Schritt bekommt einen eigenen Zweig, der auf dem vorigen aufbaut. Getestet werden kann immer die neueste Spitze.
- **popolupo kann keine Tests laufen lassen** (kein Node.js auf dem Rechner). Vor jedem Commit laufen nur zwei Prüfungen: der Klammer-Check und `tests/code.js` als Perl-Nachbau (`codewaechter.pl`, gleiche Regeln). Alles andere ist ungetestet und steht so im Changelog.

---

## Jetzt in Arbeit

**K23 Finanzen** (Zweig `mitarbeit/popolupo-k23-finanzen`, auf 362fa12), in Teilschritten:

| Teil | Inhalt | Stand |
|---|---|---|
| K23a | Monatsbericht, Liquiditätsprognose, Lizenzprüfung im März mit Auflagen, Insolvenz mit Punktabzug (zuerst nur für deinen Verein) | in Arbeit |
| K23b | gleiche Einnahmen und Ausgaben für Computer-Vereine statt Pauschale, Säulenmodell der Medien, Pauschale für die Europapokal-Plätze | geplant |
| K23c | echte Größenordnungen für alle Geldwerte (Einnahmen, Gehälter, Ablösen), danach die Sponsorenhöhen aus K24 §5.1 | geplant |
| K23d | Budgets vom Vorstand (Gehaltsrahmen, Transferbudget), Bezug zum Zielgespräch (K28) | geplant |
| K23e | Raten bei Ablösen, Kredit mit Laufzeit, Gehaltsverzicht, Karten (Mäzen, Steuerprüfung) | geplant |

Danach in dieser Reihenfolge, wenn nichts dazwischenkommt: K25 Marketing, K26 Stadion, K37 als Konzept und U19 Europapokal. Rest von K24 bleibt bei Claude.

---

## Antworten zu offenen Funden

- **T1.3 Rest** (Stärke der 2. Liga knapp über der Grenze) und **T3.2** (Kondition nach der Vorbereitung): Ohne Testlauf kann ich nicht messen, darum fasse ich beides vorerst nicht an. K23b ändert die Konten der Computer-Vereine und damit ihre Käufe, das kann T1.3 in beide Richtungen verschieben. Bitte nach K23b noch einmal ansehen.
- **T2.2** (Stimmung wirkt beim Abwerben doppelt): Die Entscheidung im Testprotokoll passt (so steht es in K20 §11).

---

## Changelog

### 21.11.2026: Kanal eingerichtet

- Diese Datei angelegt. Den Testlauf vom 20./21.11. (Läufe 1 bis 4, Funde T1.1 bis T4.1) habe ich gelesen. Die Korrekturen sind ab jetzt die Grundlage meiner Zweige.
- Bis U18b stehen alle Schritte schon im Testprotokoll. Die alten Zweige `mitarbeit/popolupo-u11-*` bis `-u18b-*` ändere ich nicht mehr.
