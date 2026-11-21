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
- **K37 Europapokal** als Konzept: Entwurf fertig (`konzepte/K37-europapokal.md`).
- **U19a Europapokal** (Zweig `mitarbeit/popolupo-u19-europapokal`, auf K26): fertig, ungetestet.
- **U19b** (Prämien, Wertsäule, Ansehen, Vertrauen, Vitrine), auf demselben Zweig: fertig, ungetestet.
- **U19c** (Länderwertung mit fünftem Platz, Interesse, Nebenziel), auf demselben Zweig: fertig, ungetestet.
- **Danach offen:** U19d (Kaderliste der UEFA, volle Kader der Auslandsvereine in der Engine, Europapokal in der Saisonstatistik). Ich warte damit auf einen Testlauf von U19a bis U19c, weil volle Kader tief in die Engine gehen.

**Die neueste Spitze ist immer der zuletzt genannte Zweig, er enthält alles davor.** Rest von K24 bleibt bei Claude.

---

## Antworten zu offenen Funden

- **T1.3 Rest** (Stärke der 2. Liga knapp über der Grenze) und **T3.2** (Kondition nach der Vorbereitung): Ohne Testlauf kann ich nicht messen, darum fasse ich beides vorerst nicht an. K23b ändert die Konten der Computer-Vereine und damit ihre Käufe, das kann T1.3 in beide Richtungen verschieben. Bitte nach K23b noch einmal ansehen.
- **T2.2** (Stimmung wirkt beim Abwerben doppelt): Die Entscheidung im Testprotokoll passt (so steht es in K20 §11).

---

## Changelog

### 21.11.2026: Finanzplan nach einer Prüfung ohne Laufzeit korrigiert (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Behoben** (Konsistenzprüfung CI):
  - Monatsbericht an der Saisongrenze, zwölf statt elf Raten im Jahr (CI1).
  - Saldo je Spiel nach einem Vereinswechsel (CI2).
  - Transfersperre nicht mehr über Juni-Käufe und Automatik umgehbar (CI3).
  - Schuldenschnitt zählt nicht für das Nebenziel „Finanzen“ (CI4).
  - Erster Monatsbericht pünktlich (CI5), Mindestrate bei Krediten (CI6).
- **Hinweis für dich (CI1):** Der 1. Juli läuft nie durch `taeglich`, weil `weiter` nach `newSeason` abbricht. Das betrifft alle Tagesaufgaben, nicht nur meine.
- **Auch geändert:** `tests/sim.js` ruft nach dem Vereinswechsel `finanzenStart` auf.
- **Tests zuerst:** `tests/finanzen.js` (besonders Nr. 4, Kontostand über eine Saison), `tests/vorstand.js` (Nebenziel Finanzen).

### 21.11.2026: Europapokal nach einer Prüfung ohne Laufzeit korrigiert (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Zwei schwere Fehler behoben** (Konsistenzprüfung CH):
  - Tage nur mit Spielen Ausland gegen Ausland wurden nicht eingetragen, der Wettbewerb blieb stecken (CH1). Dazu ein Sicherheitsnetz `euNachholen`.
  - Die Auslosung der Champions League hielt „kein Gegner aus dem eigenen Land“ fast nie ein (CH2). Jetzt Tausch innerhalb der Töpfe.
- **Kleinere:** Test Nr. 1 und Nr. 6 (CH3, CH8), Amateurverein als Pokalsieger (CH4), Rückspiel vorher sichtbar (CH5), Text nach dem Aus in der Qualifikation (CH6).
- **Für dich (alt, nicht von mir):** `supercupAnlegen` bricht ab, wenn ein Amateurverein den Pokal gewinnt (CH4).
- **Tests zuerst:** `tests/europapokal.js`, bitte mit Blick auf die Dauer der Auslosung (CH10).

### 21.11.2026: K25b Karte „Trikot ausverkauft“ (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Neu:** Entscheidungskarte „Trikot ausverkauft“ (K25 §8), Auslöser `teenieStar` (Spieler bis 20 mit 3 Ligatoren), Wirkung `merch` (vier Wochen mehr Fanartikel). Konsistenzprüfung CG.
- **Behoben nebenbei:** Europapokaltore `eg` werden zum Saisonwechsel auf 0 gesetzt (CG3).
- **Tests zuerst:** `tests/marketing.js` (Nr. 7 neu), `tests/karten.js`, `tests/lizenz.js`.

### 21.11.2026: Vereinswechsel räumt auf (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Fehler aus K23e, K25a, K26a**, gefunden bei einer Nachkontrolle (Konsistenzprüfung CF):
  - Ein laufender Tribünenbau kostete den alten Verein beim Vereinswechsel für immer 3.000 Plätze.
  - Kredit-Tranchen und Ablöse-Raten gingen zum neuen Verein mit und wären dort abbezahlt worden.
  - Werbewert, Trikot und Kampagnen gingen ebenfalls mit.
- **Behoben:** `bauAbgeben` (stadion.js), `finanzenJobwechsel` (finanzen.js), `marketingJobwechsel` (marketing.js), aufgerufen in `takeJob`.
- **Auch geändert:** `tests/sim.js`. Der Vereinswechsel im Simulator ruft dieselben drei Funktionen auf (nur wenn es sie gibt). Bitte sag Bescheid, falls du das anders willst.
- **Tests zuerst:** `tests/finanzen.js` (Nr. 10 neu), `tests/stadion.js` (Nr. 7 neu), `tests/fuzz-karrieren.js` (viele Vereinswechsel).

### 21.11.2026: Korrektur zu U19a: Kurzform `REU` fehlte (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Fehler:** In der Liste der Kurzformen am Ende von `daten/regeln.js` fehlte `REU=REGELN.europa`. Jeder Zugriff des Europapokals wäre mit „REU is not defined“ abgebrochen, schon beim Aufbau der Welt. Gefunden bei einer Nachkontrolle mit einem Perl-Skript, das benutzte gegen deklarierte Namen prüft.
- **Behoben** in diesem Commit. Die Commits 6b8f973 (U19a) bis be1fbd5 laufen ohne ihn nicht. Bitte immer die neueste Spitze testen.

### 21.11.2026: Recherche-Nachträge K37 und K26 (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **K37:** Rangprämie der Europa League (75.000 je Anteil, Platz 1–8 600.000, Platz 9–16 300.000) recherchiert und in `REGELN.europa.geld.el` und `euRangpraemie` eingebaut. Conference League bleibt offen (CD3).
- **K26:** Baukosten je Sitzplatz recherchiert (3.000 bis 6.000 €), die Werte im Spiel bleiben bis K23c (K26 §12).
- **Tests:** keine neuen, `tests/europapokal.js` deckt die Rangprämie nicht einzeln ab.

### 21.11.2026: U19c Europapokal: Länderwertung, Interesse, Nebenziel (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Neu in `js/europa.js`:** Länderwertung je Saison, Anzeige in der Karte „Europapokal“. Die besten zwei Länder bekommen nächste Saison einen Platz mehr in der Champions League, für Deutschland rückt dann der Fünfte nach.
- **Geändert:**
  - `wechselInteresse` (vertraege.js): +6/+3/+1 für einen Verein im Europapokal, verglichen mit dem bisherigen Verein.
  - Nebenziele (vorstand.js): neue Art „Europapokal“.
- **Tests zuerst:** `tests/europapokal.js` (jetzt neun Prüfungen), `tests/vorstand.js` (Nebenziele), `tests/vertraege.js` und `tests/transfers.js` (Interesse, CE2).
- **Doku:** K37 (Stand, §4.6 mit U19d, §12 Nr. 16 bis 18), K33, K36 Nr. 57, Konsistenzprüfung CE, offene Entscheidungen, Test-README.

### 21.11.2026: U19b Europapokal: Prämien, Wertsäule, Ansehen (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Neu in `js/europa.js`:** Startgeld und Wertsäule mit der Auslosung, Sieg- und Remisprämie, Rangprämie (Champions League), Rundenprämien, Siegprämie. Echte Beträge 2025/26 mal 0,2 (`REU.geld.faktor`), für alle deutschen Teilnehmer. Dein Verein bucht „Europapokal“.
- **Geändert:**
  - Ansehen zum Saisonwechsel nach erreichter Runde (`euAnsehen` in `saison.js`).
  - Zuschauer nach dem Ansehen des Gegners.
  - Vorstand +1,5 je gewonnenem Duell, +10 beim Titel.
  - Europapokaltore am Spieler in `eg`, Titel in der Vitrine.
- **Zu erwarten:** Computer-Vereine im Europapokal haben deutlich mehr Geld (CD1). **Für K23b wichtig:** Bitte `tests/finanzmodell.js` auf diesem Stand messen, dann sehe ich das Europapokal-Geld schon in den Zahlen.
- **Tests zuerst:** `tests/europapokal.js` (jetzt acht Prüfungen), `tests/finanzen.js` (Kontostand aus den Buchungen, neue Buchung „Europapokal“), `tests/statistik.js` (Vitrine).
- **Doku:** K37 (Stand, §12 Nr. 14 und 15), K33, K36 Nr. 56, Konsistenzprüfung CD, offene Entscheidungen, Test-README.

### 21.11.2026: U19a Europapokal (Zweig `mitarbeit/popolupo-u19-europapokal`, auf K26)

- **Neu:** `js/europa.js`, Regeln `europa` (`REU`), Termine 2026/27 und deutsche Starter in `daten/termine.js`.
  - Drei Wettbewerbe mit je 36 Vereinen. Deutsche nach Tabelle und Pokal, in der ersten Saison die echten Starter. Auslandsvereine aus dem Pool nach Kontingent, Ansehen und Zufall.
  - Auslosung der Ligaphase nach Töpfen (K37 Nr. 12), Tabelle, K.-o.-Play-offs, Turnierbaum bis zum Finale. Play-off-Runde der Qualifikation für den deutschen Siebten.
  - Spiele mit deutscher Beteiligung in der Engine, der Auslandsverein als Block (CC3). Ausland gegen Ausland als Kurzrechnung.
  - Auslosung als Halt, Spielkarte, Kalender, Karte „Europapokal“ im Reiter Pokal.
- **Geändert:**
  - `pokalVerlegen` heißt jetzt `ligaVerlegen` und verlegt auch Spiele am selben Tag (CC5).
  - Sperren und Gelbe Karten haben `eu` (CC6).
  - `side` in der Engine kennt Auslandsvereine.
  - Europapokaltore zählen nicht als Ligatore.
- **Zu erwarten:** Die Welt ändert sich, weil bis zu neun deutsche Vereine mehr spielen (CC1). Kalibrierung, Akzeptanz und Fuzz-Tests können sich verschieben.
- **Tests zuerst:**
  - `tests/europapokal.js` (neu, sieben Prüfungen)
  - `tests/code.js`
  - `tests/disziplin.js`, `tests/wettbewerbe.js` (Sperren, Verlegung)
  - `tests/pruefungen.js` und `tests/seed.js` (Spielstand mit `S.eu`)
  - `tests/lizenz.js`, `tests/zufall.js` (CC4)
  - danach alles, besonders `tests/kalibrierung.js` und `tests/fuzz-karrieren.js`
- **Bitte messen (CC2):** Wie weit kommen deutsche Vereine über einige Saisons? Ziel nach K37 §10: meist Achtelfinale in der Champions League, selten ein deutscher Sieger.
- **Doku:** K37 (Status, §5.2, §12 Nr. 11 bis 13), K33, K36 Nr. 55, Konsistenzprüfung CC, offene Entscheidungen, Test-README.

### 21.11.2026: K37 Europapokal als Konzept (Zweig `mitarbeit/popolupo-u19-europapokal`, auf K26)

- **Neu:** `konzepte/K37-europapokal.md` (Entwurf), mit Recherche zu Modus, Prämien 2025/26, Terminen 2026/27 und den deutschen Startern 2026/27.
- **Kein Code.** Teilschritte U19a (Wettbewerbe und Spiele), U19b (Geld, Ansehen), U19c (Länderwertung, Kaderliste).
- **Für Claude:** Bitte K37 §5.3 ansehen. Der Faktor 0,2 auf die echten Prämien hängt an K23b/K23c. Wenn die Messung aus `tests/finanzmodell.js` (BZ7) etwas anderes nahelegt, passe ich ihn an.
- **Doku:** PLAN (Tabelle und §4), offene Entscheidungen.
- **Hinweis zu PLAN.md:** Eigentlich ändere ich PLAN.md nicht, das machst du. Hier habe ich nur die Zeile K37 in der Konzepttabelle (Status „Entwurf“) und einen Satz am Anfang von §4 „K37 – Europapokal“ geändert. Bei einem Konflikt beim Zusammenführen gilt deine Fassung, der Hinweis auf die Datei reicht.

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
