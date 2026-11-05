# Flutlicht Manager – Ausbauplan

Stand: 5. November 2026. Jede Stufe ist ein eigener Arbeitsschritt, am besten jeweils in einer neuen Session. Diese Datei dient als Übergabe zwischen den Sessions.

## Ausgangslage

- Das ganze Spiel steckt in einer Datei, `index.html` (rund 112 KB: 31 KB Daten, 81 KB Code und CSS). Wer daran etwas ändert, muss die ganze Datei lesen. Das kostet jedes Mal viele Token.
- Die Kader 2026/27 aller 36 Vereine stammen aus der deutschen Wikipedia. Die Stärkewerte sind geschätzt.
- Im Spiel lassen sich Spielerdaten noch bearbeiten. Das soll wegfallen.

## So funktioniert die Spiellogik heute

- **Stärke eines Spielers im Spiel:** Grundstärke × Fitness (72–100 %) × Form (95–105 %). Auf fremder Position verliert er 18 %, ein Torwart im Feld oder ein Feldspieler im Tor 55 %.
- **Mannschaftswerte:**
  - Angriff = 55 % Sturm + 33 % Mittelfeld + 12 % Abwehr
  - Abwehr = 45 % Abwehr + 25 % Mittelfeld + 30 % Torwart
  - Mehr Spieler in einem Mannschaftsteil machen diesen Teil stärker.
- **Taktik:** Feste Zu- und Abschläge, unabhängig vom Gegner. Offensiv gibt +6 % Angriff und −5 % Abwehr, Defensiv umgekehrt, Konter −2/+3 %. Einsatz „Hart“ gibt +2 %, aber mehr Karten und Verletzungen. Der Heimvorteil bringt etwa +4 %.
- **Tore:** Erwartete Tore = 1,3 × (eigener Angriff / gegnerische Abwehr)^4. Danach wird Minute für Minute zufällig entschieden.
- **Das Spiel ist vor dem Anpfiff schon fertig berechnet.** Die Konferenz spielt es nur ab. Deshalb gibt es bisher weder Halbzeit noch Wechsel.
- **Kein Schere-Stein-Papier:** Bisher kontert keine Taktik eine andere.

## Ziele (Wünsche aus dem Chat)

1. **Live-Spiel:** auswechseln, Halbzeit, Taktik während des Spiels ändern.
2. **Tieferes Training:** mit sichtbarer Wirkung auf die Spieler.
3. **Mehr Spielerwerte:** Stimmung, Kondition und mehr.
4. **Transfers der Computer-Vereine nur mit Grund:** Ein Spieler ist unzufrieden oder spielt lange schlecht, und es ist gleichwertiger Ersatz da. Ein Verein mit 3 Torhütern verkauft also erst einen, wenn er einen neuen hat.
5. **Spielerdaten nur in Datendateien:** Im Spiel lassen sie sich nicht mehr bearbeiten, wer will, kann in einer Datei daran schrauben.
6. **Look im Stil der frühen 90er.** Das wird ein eigenes Design. Das Bildschirm-Layout und die Grafiken von BMH baue ich nicht nach.

## Stufen

### Stufe 0 – Umbau in mehrere Dateien (Grundlage) · Aufwand: mittel

- Aufteilung:
  - `index.html` als kleiner Rahmen
  - `css/spiel.css`
  - `js/engine.js` (Spieltag, Simulation)
  - `js/welt.js` (Saison, Transfers, Finanzen)
  - `js/ui.js` (Ansichten)
  - `daten/vereine.js` und `daten/spieler.js` für die Daten
  - `daten/regeln.js` als „Properties-Datei“ mit allen Stellschrauben: Torformel, Taktikwerte, Trainingseffekte, Preise und so weiter
- Die Daten werden als `.js`-Dateien geladen, nicht als `.json`. So läuft das Spiel auch per Doppelklick lokal, denn `fetch` auf `file://` blockiert der Browser.
- Der Bearbeiten-Dialog im Spiel fällt weg.
- Der Spielstand bekommt eine Versionsnummer. Alte Spielstände passen danach nicht mehr, man startet ein neues Spiel.
- Nutzen: Spätere Stufen müssen nur noch die betroffene Datei lesen. Das spart pro Stufe grob die Hälfte der Lesekosten.

### Stufe 1 – Spielermodell erweitern · Aufwand: mittel

Neue Werte pro Spieler (Vorschlag):

| Wert | Bedeutung | wie er sich ändert |
|---|---|---|
| Technik, Tempo, Zweikampf, Abschluss (Feldspieler) bzw. Reflexe, Strafraum (Torwart) | Fähigkeiten, 1–99 | Training, Alter |
| Stärke | gewichteter Schnitt der Fähigkeiten je Position | ergibt sich daraus |
| Kondition | Ausdauer, wie schnell er im Spiel müde wird | Konditionstraining, Alter |
| Frische | aktueller Kraftzustand, 0–100 % | Spiele, Training, Regeneration |
| Form | Leistungskurve, aus den letzten Noten | Spiele |
| Stimmung | Zufriedenheit, 0–100 | Einsatzzeit gegenüber seiner Erwartung, Erfolge, Vertrag, Training, Ansprachen |
| Rolle/Erwartung | Stammspieler, Rotation, Ergänzung, Talent | Stärke im Vergleich zum Kader |
| Charakter | ein bis zwei Eigenschaften: Führungsspieler, Kämpfer, Diva, trainingsfleißig, verletzungsanfällig, ruhig/hitzig | fest |
| Talent | Obergrenze der Entwicklung (verdeckt, Sterne als Schätzung) | fest |
| Erfahrung | wirkt in engen Spielen und bei Druck | Einsätze |
| Positionen | Hauptposition (laut Wikipedia), dazu geschätzte Nebenpositionen | fest |
| Statistik | Einsätze, Minuten, Tore, Vorlagen, Notenschnitt, Karten | Spiele |

- Startwerte: Die Fähigkeiten werden aus der heutigen Stärke und der Position abgeleitet, mit Streuung, die durch den Namen festgelegt ist. Charakter und Kondition werden geschätzt.
- Ansicht: Spielerkarte mit allen Werten, Kader-Tabelle mit umschaltbaren Spalten.

### Stufe 2 – Neue Spiellogik mit Taktik-Kreislauf · Aufwand: groß

- **Spielstile** als Schere-Stein-Papier-Kreislauf, dessen Stärke von den Fähigkeiten abhängt:
  - Pressing schlägt Ballbesitz, braucht viel Kondition und Frische.
  - Ballbesitz schlägt Mauern, braucht Technik.
  - Mauern schlägt Konter, braucht Zweikampf.
  - Konter schlägt Pressing, braucht Tempo.
  - Dazu Flügelspiel/lange Bälle als neutrale Variante.
  - Der Vorteil wirkt nur, wenn die Mannschaft den Stil auch spielen kann. Pressing mit müder Mannschaft geht nach hinten los.
- **Weitere Einflüsse:** Einsatz, Heimvorteil, Stimmung (±), Frische, die im Spiel abnimmt (je nach Kondition), und Erfahrung in der Schlussphase.
- **Taktik-Vertrautheit:** Ein neu gewählter Stil braucht ein paar Wochen Taktiktraining, bis er voll wirkt.
- **Engine:** Das Spiel wird jetzt Minute für Minute live gerechnet statt vorab. Die anderen Spiele der Konferenz bleiben vorab berechnet.
- Alle Zahlen stehen in `daten/regeln.js`.

### Stufe 3 – Live-Spiel: Halbzeit und Auswechseln · Aufwand: mittel bis groß

- Pause-Knopf jederzeit, dazu ein eigener Halbzeit-Bildschirm.
- Wechsel nach aktueller Regel: 5 Wechsel in 3 Unterbrechungen, die Halbzeit zählt nicht als Unterbrechung. Die Bankgröße für die Bundesliga prüfe ich bei der Umsetzung nach, sie liegt vermutlich bei 9 Spielern.
- Taktik, Spielstil und Einsatz lassen sich im Spiel ändern.
- **Halbzeitansprache:** loben, motivieren, Druck machen oder beruhigen. Die Wirkung hängt von Spielstand und Charakter ab und wirkt auf Stimmung und Form.
- Anzeige im Spiel: Frische der Spieler, Noten-Tendenz, Gelbe Karten (Gefahr Gelb-Rot).
- Der Computer-Trainer wechselt auch: müde Spieler um die 60. bis 75. Minute, offensiv bei Rückstand.
- Verletzte Spieler müssen raus, sonst spielt die Mannschaft mit einem Mann weniger.

### Stufe 4 – Training · Aufwand: mittel

- **Wochenplan** mit 5 Einheiten. Je Einheit wählt man einen Schwerpunkt: Kondition, Technik, Zweikampf, Abschluss/Tempo, Taktik (bringt Vertrautheit mit dem Spielstil), Standards, Torwarttraining, Regeneration oder Testspiel.
- **Intensität** pro Einheit. Sie wirkt auf Entwicklung, Frische, Verletzungsrisiko und Stimmung: dauerhaft hart drückt die Stimmung.
- **Einzeltraining** für bis zu 3 Spieler, zum Beispiel Positionsumschulung oder ein gezielter Schwerpunkt.
- **Trainingslager** im Sommer und Winter: kostet Geld, gibt Kondition, Stimmung und Taktik-Vertrautheit.
- **Entwicklung** abhängig von Alter, Talent, Charakter (trainingsfleißig) und Einsatzzeit.
- Optional später: Trainerstab (Co-Trainer, Torwarttrainer) mit Qualität und Gehalt.

### Stufe 5 – Stimmung und Transfers der Computer-Vereine · Aufwand: mittel

- **Stimmung:**
  - Sie hängt ab von Einsatzzeit gegenüber Erwartung, Mannschaftserfolg, Vertrag und Gehalt, Konkurrenz auf der Position, Training und Ansprachen.
  - Unzufriedene Spieler bringen schlechtere Leistung, äußern einen Wechselwunsch und lehnen eine Vertragsverlängerung ab.
  - Gespräch unter vier Augen: Einsatz versprechen (das Versprechen wird überwacht), mehr Gehalt anbieten oder den Wechsel erlauben.
- **Transfers der Computer-Vereine:**
  - Jeder Verein hat einen Kaderplan mit Sollbesetzung je Position (zum Beispiel TW 3, AB 8, MF 8, ST 5).
  - Verkauf nur, wenn der Spieler unzufrieden ist oder über viele Spiele schwach war (Notenschnitt), und wenn die Position danach noch voll besetzt ist. Sonst wird erst gekauft, dann verkauft.
  - Kauf nur bei Bedarf: eine Lücke im Kaderplan, eine schwache Position im Vergleich zum Vereinsniveau oder eine lange Verletzung. Das Budget muss reichen.
  - Transferfenster: Sommer und Winter. Außerhalb davon wechseln nur Vereinslose.
- **Dein eigener Verein:** Du darfst kaufen und verkaufen, aber Spieler und Vereine können ablehnen. Eigene unzufriedene Spieler bitten von sich aus um einen Wechsel.

### Stufe 6 – Retro-Oberfläche · Aufwand: mittel

- Eigener Look im Stil der frühen 90er:
  - Büro als Zentrale mit Symbol-Schaltflächen
  - Kalenderblatt, Kontostand, Nachrichtenband
  - Pixel- oder Terminal-Schrift für Anzeigen und kräftige Farbflächen
- Eigene Gestaltung, keine Nachbildung von Layout oder Grafiken eines bestimmten Spiels.
- Die Handy-Tauglichkeit bleibt erhalten.

## Reihenfolge und Abhängigkeiten

0 → 1 → 2 → 3 → 4 → 5 → 6

- Stufe 2 und 3 hängen eng zusammen: Live-Engine und Wechsel. Training (4) braucht das Spielermodell (1). Die Stimmung (5) nutzt Daten aus 1 bis 4.
- Den Look (6) kann man auch vorziehen. Er hängt nur von Stufe 0 ab.

## Aufwand und Token

- Eine Stufe ist etwa eine Session. Grobe Größen: Stufe 0 mittel, 1 mittel, 2 groß, 3 mittel bis groß, 4 mittel, 5 mittel, 6 mittel.
- Eine verlässliche Tokenzahl pro Stufe kann ich vorab nicht nennen. Nach Stufe 0 sieht man in der Nutzungsanzeige, was eine mittlere Stufe kostet, und kann hochrechnen.
- Sparen lässt sich so:
  - jede Stufe in einer neuen Session starten, mit Verweis auf diese Datei
  - nur die betroffenen Dateien lesen lassen
  - Tests als Skript im Repo ablegen statt jedes Mal neu zu schreiben

## Offene Entscheidungen

- Fähigkeiten: 4 Feldspieler-Werte (Technik, Tempo, Zweikampf, Abschluss) oder weniger?
- Taktik-Kreislauf wie oben, oder andere Stile?
- Sollen Transferfenster auch für dich gelten?
