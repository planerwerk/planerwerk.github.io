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
| K23a | Monatsbericht, Liquiditätsprognose, Lizenzprüfung im März mit Auflagen, Insolvenz mit Punktabzug (zuerst nur für deinen Verein) | fertig, ungetestet (siehe Changelog) |
| K23b | gleiche Einnahmen und Ausgaben für Computer-Vereine statt Pauschale, Säulenmodell der Medien, Pauschale für die Europapokal-Plätze | **wartet auf Messwerte:** bitte `node tests/finanzmodell.js` laufen lassen und die Ausgabe ins Testprotokoll (BZ7) |
| K23c | echte Größenordnungen für alle Geldwerte (Einnahmen, Gehälter, Ablösen), danach die Sponsorenhöhen aus K24 §5.1 | nach K23b |
| K23d | Budgets vom Vorstand (Gehaltsrahmen, Transferbudget), Bezug zum Zielgespräch (K28) | nach K23c |
| K23e | Raten bei Ablösen, Kredit mit Laufzeit, Gehaltsverzicht, Karten (Mäzen, Steuerprüfung) | fertig, ungetestet (siehe Changelog) |

Solange K23b auf die Messwerte wartet, baue ich weiter:
- **K25 Marketing** (Zweig `mitarbeit/popolupo-k25-marketing`, auf dem K23-Zweig): K25a fertig, ungetestet.
- **K26 Stadion** (Zweig `mitarbeit/popolupo-k26-stadion`, auf K25): K26a fertig, ungetestet.
- **Jetzt:** K37 als Konzept, danach U19 Europapokal (Zweig `mitarbeit/popolupo-u19-europapokal`, auf K26).

**Die neueste Spitze ist immer der zuletzt genannte Zweig, er enthält alles davor.** Rest von K24 bleibt bei Claude.

---

## Antworten zu offenen Funden

- **T1.3 Rest** (Stärke der 2. Liga knapp über der Grenze) und **T3.2** (Kondition nach der Vorbereitung): Ohne Testlauf kann ich nicht messen, darum fasse ich beides vorerst nicht an. K23b ändert die Konten der Computer-Vereine und damit ihre Käufe, das kann T1.3 in beide Richtungen verschieben. Bitte nach K23b noch einmal ansehen.
- **T2.2** (Stimmung wirkt beim Abwerben doppelt): Die Entscheidung im Testprotokoll passt (so steht es in K20 §11).

---

## Changelog

### 21.11.2026: K26a Stadion, Anlagen, Bauprozess (Zweig `mitarbeit/popolupo-k26-stadion`, auf K25)

- **Neu:** `js/stadion.js`, in `REGELN.stadion` neu `prozess`, `instandhaltung` und `anlagen`.
  - Jeder Bau (auch Tribüne, Logen, Fanshop) braucht erst eine Genehmigung (2 bis 8 Wochen, 20 % mit Auflagen +5 bis +15 %). Danach kommt die Bauzeit, 30 % werden 1 bis 6 Wochen später fertig, 15 % kosten 5 bis 20 % mehr. Alles wird beim Start im eigenen Strom `bau` gewürfelt und gemeldet, wenn es eintritt.
  - Tribüne: Während des Baus fehlen 3.000 Plätze (CB4).
  - Fünf Anlagen in Stufen: Trainingsgelände (Entwicklung und Verletzungsrisiko), Nachwuchsleistungszentrum (Deckel des Jugendniveaus), Reha-Zentrum (Ausfallzeit), Catering und Anzeigetafel (Zuschauereinnahmen). Neue Karte „Anlagen“ im Stadion.
  - Instandhaltung 1 % der Bausumme im Jahr, monatlich gebucht.
  - Zuerst nur dein Verein, Computer-Vereine bauen nicht.
- **Geld und Welt:** ohne Ausbau unverändert (CB1). Alte Spielstände mit laufender Baustelle werden wie bisher fertig.
- **Tests zuerst:**
  - `tests/stadion.js` (neu, sechs Prüfungen)
  - `tests/code.js`
  - `tests/training.js`, `tests/medizin.js`, `tests/jugend.js` (neue Faktoren, zum Start neutral)
  - `tests/lizenz.js` (CB3)
  - `tests/seed.js` (Speichern und Laden mit neuer Baustelle)
- **Doku:** K26 §5.1, §12 Nr. 1 bis 7, K33, K36 Nr. 54, Konsistenzprüfung CB, offene Entscheidungen, Test-README.

### 21.11.2026: K25a Marketing (Zweig `mitarbeit/popolupo-k25-marketing`, auf dem K23-Zweig)

- **Neu:** `js/marketing.js`, Regeln `marketing` (`RMK`), Lizenz-Bereich `marketing` (B-Lizenz, mit Automatik).
  - Trikot je Saison (klassisch, modern, mutig) mit Reaktion der Fans aus eigenem Strom `trikot`. Ohne Wahl am Tag vor dem ersten Pflichtspiel das klassische, mit und ohne Automatik am selben Tag.
  - Vier Kampagnen (Trikot-Kampagne, Fanwerbung, Jugend-Camps, Fanarbeit) mit Kosten je Liga und abnehmendem Ertrag.
  - Werbewert, vorerst ohne Wirkung. **Für K24 (Claude):** `S.mk.ww` (0–100) steht bereit, falls Sponsorangebote davon abhängen sollen.
  - Karte „Marketing“ im Stadion, Punkt „Trikotvorstellung“ in der Liste vor dem Saisonstart.
- **Geld:** fast neutral. Fanartikel bleiben je Zuschauer, dazu Faktoren für Trikot, Lieblinge (+5 % je Liebling, höchstens +15 %) und die Trikot-Kampagne (CA1).
- **Tests zuerst:**
  - `tests/marketing.js` (neu)
  - `tests/vorbereitung.js` (erwartet jetzt 8 Punkte)
  - `tests/fans.js` (Pfiffe mit Fanarbeit)
  - `tests/lizenz.js` (CA3)
  - `tests/code.js`
- **Doku:** K25 §5.4, §12 Nr. 1 bis 6, K33, K36 Nr. 53, Konsistenzprüfung CA, offene Entscheidungen, Test-README.

### 21.11.2026: K23e Kredit, Raten, Gehaltsverzicht, Karten, dazu das Messskript für K23b (Zweig `mitarbeit/popolupo-k23-finanzen`)

- **Neu in `js/finanzen.js`:**
  - Kredit in Tranchen mit 1 bis 5 Jahren Laufzeit (Auswahl auf der Finanzseite), monatliche Tilgung, Sondertilgung, Kreditflüsse getrennt von `S.fin` (Spalte „Kredit“ im Monatsbericht).
  - Ablöse in Raten beim Kauf (Häkchen im Angebot): Hälfte sofort, Rest mit 5 % in 12 Monatsraten.
  - Gehaltsverzicht in der Not (15 %, 3 Monate, Stimmung −10).
  - Karten „Mäzen“ (Geld gegen Einfluss des Präsidenten) und „Steuerprüfung“.
- **Geändert:** `loan` (aktionen.js) und `kreditAuto` (lizenz.js) laufen über die Tranchen. `offer` prüft das Konto mit der Anzahlung. Die Gehaltsbuchung in `finanzenLiga` hat den Faktor des Verzichts. `praesidentSerie` kommt mit Mäzen auch ohne Ehrgeiz.
- **Tests zuerst:**
  - `tests/finanzen.js` (neun Prüfungen)
  - `tests/karten.js` (Katalog mit zwei Karten mehr)
  - `tests/code.js`
  - `tests/transfers.js` und `tests/vertraege.js` (Kauf mit neuer Kontoprüfung)
  - `tests/lizenz.js`
- **Bitte messen (BZ7):** `node tests/finanzmodell.js` und die Ausgabe ins Testprotokoll, gern mit 2 Saisons. Damit stelle ich K23b ein (gleiche Einnahmen für Computer-Vereine), ohne die Welt aus dem Gleichgewicht zu bringen.
- **Doku:** K23 §5.5d, §12 Nr. 10 bis 14, K30 §3.2, K33, K36 Nr. 52, Konsistenzprüfung BZ, offene Entscheidungen, Test-README.

### 21.11.2026: K23a Finanzplan (Zweig `mitarbeit/popolupo-k23-finanzen`)

- **Neu:** `js/finanzen.js`, Regeln `finanzplan` (`RFP`).
  - Monatsbericht am Monatsersten und Monatstabelle auf der Finanzseite.
  - Prognose bis Saisonende aus dem laufenden Saldo je Ligaspiel.
  - Lizenzprüfung am 1. März mit Auflagen (Vertrauen −5) und Nachweis bis 31. Mai, sonst Transfersperre für die nächste Saison (Kauf, Leihe, Altstar, Automatik der Transfers).
  - Insolvenz nach zwei Monatsersten unter dem negativen Kreditrahmen: 9 Punkte Abzug in `table`, Vertrauen −30, Schuldenschnitt.
  - Zuerst nur für deinen Verein.
- **Geld:** unverändert. Die Buchungen bleiben je Spieltag (BY1). Für einen gesunden Verein ändern sich nur Meldungen und die Finanzseite.
- **Tests zuerst:**
  - `tests/finanzen.js` (neu)
  - `tests/code.js`
  - `tests/lizenz.js` (Gleichschritt, BY4)
  - `tests/transfers.js`, `tests/leihe.js` (Kauf und Leihe haben eine neue Sperre am Anfang)
  - danach alles. Ergebnisse sollten sonst gleich bleiben.
- **Zu prüfen:** BY6. Fällt „Kontostand nachvollziehbar aus den Buchungen“ durch, bucht irgendwo Code an `money()` vorbei. Bitte die Abweichung ins Testprotokoll.
- **Doku:** K23 §5.5b, §5.5c, §12 Nr. 5 bis 9 mit Recherche, K33, K36 Nr. 51, Konsistenzprüfung BY, offene Entscheidungen, Test-README. Den veralteten Absatz „Offen seit dem 19.11.“ im Test-README habe ich durch einen Verweis auf die beiden Protokolle ersetzt.

### 21.11.2026: Kanal eingerichtet

- Diese Datei angelegt. Den Testlauf vom 20./21.11. (Läufe 1 bis 4, Funde T1.1 bis T4.1) habe ich gelesen. Die Korrekturen sind ab jetzt die Grundlage meiner Zweige.
- Bis U18b stehen alle Schritte schon im Testprotokoll. Die alten Zweige `mitarbeit/popolupo-u11-*` bis `-u18b-*` ändere ich nicht mehr.
