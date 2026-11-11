# K33 – Daten, Spielstand und `regeln.js`

Status: **Entwurf**, umgesetzt in U1.
Hängt ab von: – · Wird gebraucht von: allen Konzepten, besonders K02 (Kalibrierung) und K32 (Datenpflege).

## 1. Ziel und Spielgefühl

- **Alle Stellschrauben an einer Stelle,** kommentiert und lesbar, ohne den Code zu kennen.
- **Stammdaten in eigenen Dateien:** Vereine, Spieler und Termine lassen sich mit jedem Texteditor pflegen. Im Spiel wird nichts bearbeitet (dein Wunsch).
- **Spielstand mit Version und Seed:** Ein Verlauf lässt sich wiederholen. Fehler kann man so nachstellen, und Tests sind verlässlich.

## 2. Vorbilder und Abgrenzung

- BMH und Anstoss hatten einen Editor als eigenes Programm, FM hat Editor und Datenbank.
- Wir nehmen einfache Dateien statt eines Editors und verzichten auf einen Build-Schritt: `index.html` läuft per Doppelklick und als Artefakt.

## 3. Begriffe und Daten

**Dateien:**

```
index.html          Gerüst, lädt Stile und Skripte in fester Reihenfolge
css/spiel.css       Aussehen des Spiels
css/regler.css      Regler-Bausteine (aus muster/regler.html übernommen)
daten/regeln.js     alle Stellschrauben (REGELN)
daten/vereine.js    56 Vereine der 1. bis 3. Liga, Regionalliga-Pool, Amateurklubs, Sponsoren
daten/spieler.js    Kader 2026/27 nach Wikipedia, eine Zeile pro Spieler (seit U9b mit Nationalität)
daten/namen.js      Vor- und Nachnamen für erfundene Spieler, Herkunft der Nachnamen, Namenslisten je Sprachraum für den Auslandspool
daten/nationen.js   Nationen mit Kürzel, Name, Rang der Weltrangliste und Sprache (K32 §3.2, seit U9b)
daten/ausland.js    208 echte Auslandsvereine mit Land, Stufe, Ansehen und Finanzkraft (K32 §3.1, seit U9b)
daten/termine.js    Rahmentermine 2026/27 (K01)
daten/spielplan-2026.js  offizieller Spielplan 2026/27, 1. bis 3. Liga (K01)
daten/texte.js      Ticker-Texte und feste Beschreibungen
js/zufall.js        Zufall mit Seed
js/hilfen.js        Formatierung und kleine Helfer
js/welt.js          Welt bauen, Spieler erzeugen, Ziele, Sponsoren
js/spieler.js       Spielermodell (K03): Zustand, Frische, Kondition, Form, Selbstvertrauen, Spielpraxis, Entwicklung
js/kalender.js      Datum, Spielplan der Saison, „Tag beenden“, Erinnerungen
js/scouting.js      Scouting und Informationsnebel (K18)
js/ausland.js       Nationen, Auslandsvereine, Auslandspool: Aufbau, Woche, Saisonwechsel, Wechsel zwischen Pool und Ligen (K32)
js/engine.js        Spiel-Engine
js/ablauf.js        Tagesverarbeitung: Spiele, Finanzen, Training, Markt, Vorstand, Bau
js/saison.js        Tabelle, Saisonende, neue Saison, Jobangebote
js/aktionen.js      Aktionen des Spielers
js/regler.js        Regler-Bausteine
js/ansichten.js     Bildschirme
js/fenster.js       Fenster: Spielerkarte, Vorbericht, Konferenz, Menü
js/start.js         Startbildschirm, Laden, Speichern, Start
tests/              Testskripte, darunter sim.js (Simulator ohne Browser)
```

**Drei Arten von Daten:**

| | Was | Wer ändert | Wirkung |
|---|---|---|---|
| Regeln | Zahlen, Wahrscheinlichkeiten, Preise | du, in `regeln.js` | nach Neuladen sofort, auch in laufenden Karrieren |
| Stammdaten | Vereine, Spieler, Termine | du, in der jeweiligen Datei | nur in neuen Karrieren, denn der Spielstand hat seine eigene Kopie |
| Spielstand | alles, was im Spiel passiert | das Spiel | – |

**Spielstand:**
- Felder: `v` (Version), `seed` (Startwert), `zufall` (Zustand des Generators), `saison`, `tag`, `plan`, Vereine, Spieler, Ergebnisse, Nachrichten, Einstellungen (`einst`, darin `live` für Tempo und Halte).
- Seit U3/U4: `stufe` (Schwierigkeit), `live` (laufendes Live-Spiel: Tag, Eingriffe mit Minute, gespeicherte Minute und Zahl der Elfmeter; nach dem Abpfiff leer), am Verein `ansp` (die letzten Halbzeitansprachen), `stil`, `vt` (Vertrautheit mit Stilen und Ordnungen), `rollen`, `einstellung`, `schuetzen`, `kater` (K06), im Spielstand `stilVerlauf`, am Verein `vorlage`, `vbTag`, `stdTag` und am Spieler `la`, `lc`, `wk`, `we`, `wt`, `wl`, `trf`, `eig`, `um`, `ltag`, `lmin`, `tinj` (K07), am Spieler `sb`, `koVor` und am Verein `urlaub`, `urlaubGesamt`, `urlaubAb`, `urlaubFertig`, im Spielstand `sommer` (K12a), im Spielstand `stab`, `stabId`, `stabVersion` (K16), `schiri` (Schiedsrichter je Liga), `verfahren`, `verfahrenId`, `sgArchiv` (Sportgericht, K09), `vstat` (Verletzungen je Verein in der Saison, K10), `supercup` (Paarung, Tag, Ergebnis, K13), `testspiele`, `testId` (Testspiele der Saison mit Tag, Gegner, Stand, Ergebnis, K11), `lager` (Trainingslager mit Ort, Zeitraum, Kosten, Lagerkoller), in `cup` neu `los` (Auslosung der Runde: Runde, Tag, Paarungen), in `relSp` neu `pen`, am Verein `krankBis` (Ansteckung), am Spieler `vl` (aktuelle Verletzung: Art, Ursache, Beginn, wahre Dauer, Tag der Diagnose, Spannen), `vh` (Verlauf zwei Jahre), `rf` (Rückfallfenster), `spritze` (Tag, an dem er fit gespritzt ist), am Spieler `sperre` (je Wettbewerb `rot` und `gelb`, ersetzt `sus`), `kt` (Gelbe Karten je Wettbewerb, ersetzt `yc`), `vg` (Tage der Roten Karten der letzten zwölf Monate), am Spieler `lf` (Lernfortschritt aus Spielen), `fk` (Fehlerkonto gelernter Stärken). Seit U8 (K14, K15): am Spieler `st` (Stimmung), `ea` (gleitender Einsatzanteil), `krA` (Rolle nach dem Co-Trainer), `krS` (eigene Einschätzung), `kr` (von dir vergebene Kaderrolle), `ww`, `wws`, `wu`, `wv` (Wechselwunsch, Wochen auf der Stufe und unter den Schwellen), `ww3s` (Saison des letzten offiziellen Wechselwunschs), `tb` (Baustein „Trainer“ aus Gesprächen), `ub`, `ubW` (Urlaubswirkung und Restwochen), `zhNeu` (Neuzugang, der noch nicht in der Startelf stand), `gs` (Gespräche der letzten vier Wochen), `streit`; am Verein `zh` (Zusammenhalt), `glaub`, `glaubKrise`, `kap`, `kapAuto`, `kapB`, `erf` (Baustein Erfolg), `xiW`, `xiV`, `siegeW` (Startelf und Siege der Woche), `kst` (Zähler der Saison), `tev` (Teamevents), `mans` (Mannschaftsansprachen), `weck`, `endspiel`; im Spielstand `bz` (Beziehungen), `gw` (offene Gesprächswünsche), `gz` (Gespräche der Woche), `vs`, `vsId` (Versprechen), `grMeldung`, `kapFrei`. Alle Felder entstehen beim ersten Gebrauch, die Version bleibt 4. Seit U9a (K18): im Spielstand `kenntnis` (je Spieler-Nummer `{k, s}`: Kenntnis und Scouts, die ihn gesehen haben, nur über der Grundkenntnis), `auftraege` (Beobachtung mit Spieler und Restwochen, Suchauftrag mit Kriterien, gesehenen Namen und Kandidaten), im Stab die Rolle `scout`.
- Seit U9b (K32, K03): am Spieler `nat` (Nationalität, FIFA-Kürzel). Im Spielstand `ausland` mit `v` (Auslandsvereine: `id` ab 2000, `name`, `land`, `stufe`, `rep`, `fin`), `pl` (Poolspieler) und `pid` (nächste Nummer, ab 1.000.000). Poolspieler haben dieselben Felder wie Ligaspieler, aber ohne `sperre`, `kt` und `eig` (kommen beim Wechsel nach Deutschland dazu), ihr Feld `team` ist die Kennung des Auslandsvereins. Im Suchauftrag (`auftraege`) neu `krit.region`. Angebote (`offers`) können von einem Auslandsverein kommen (`tid` ab 2000). Version bleibt 4, alte Spielstände haben keinen Pool.
- **Größe** (seit U9b geprüft in `tests/ausland.js`): etwa 1,7 MB zum Start, davon 0,74 MB Pool, über sechs Saisons unter 3 MB.
- Gespeichert im Browser (Schlüssel `flutlicht-manager-v4`), dazu Export und Import als Code im Menü.
- **Version 4** seit 8.11. (Spielermodell K03, U2). Version 3 seit 6.11. (3. Liga, Anstoßzeiten, Sommer). Spielstände älterer Testversionen sind laut deiner Entscheidung Müll: Das Spiel löscht sie beim Start.

## 4. Abläufe

- **An Werten schrauben:** `daten/regeln.js` öffnen, Wert ändern, speichern, Spiel neu laden, Tests laufen lassen.
- **Spielerdaten korrigieren:** In `daten/spieler.js` steht eine Zeile pro Spieler: Name, Position, Alter, Stärke, Nationalität (Kürzel aus `daten/nationen.js`). Die Änderung wirkt ab der nächsten neuen Karriere.
- **Auslandsvereine pflegen** (seit U9b): In `daten/ausland.js` steht eine Zeile pro Verein: Name, Land, Stufe, Ansehen, Finanzkraft. Gepflegt werden nur Name und Land, der Rest ist eine grobe Schätzung. Die Spieler erzeugt das Spiel.
- **Neue Saison als Daten** (später, K32): eigene Dateien mit Jahreszahl, etwa `spieler-2027.js` und `termine-2027.js`.
- **Spielstand-Version erhöhen:** Ab Version 2 bekommt jede Änderung am Aufbau eine Umwandlung vom alten Stand, wo das sinnvoll geht. Wo nicht, gibt es einen Hinweis wie jetzt.

## 5. Regeln und Formeln

- **Generator:** xoshiro128\*\*, 128 Bit Zustand. Ein Startwert von 32 Bit wird mit splitmix32 auf den Zustand verteilt.
- **Jede Zufallszahl der Spiellogik** kommt aus diesem Generator. Die Oberfläche würfelt nie.
- **Wiederholbar:** Gleicher Seed, gleiche Eingaben und gleiche Version von Code und Regeln ergeben den gleichen Verlauf.
- **Laden:** Der Zustand des Generators liegt im Spielstand. Speichern, Laden und Weiterspielen ergibt denselben Verlauf wie ohne Unterbrechung.
- **Schreibschutz:** `REGELN` ist zur Laufzeit eingefroren, damit kein Code versehentlich eine Regel ändert.

## 6. Hebel des Spielers

- Den Seed kann man beim neuen Spiel unter „Erweitert“ eingeben, etwa für Fehlermeldungen. Im Menü wird er angezeigt.
- Stammdaten und Regeln ändert man nur in den Dateien.

## 7. Verhalten der Computer-Vereine

Keine eigenen Daten. Sie lesen dieselben Regeln.

## 8. Ereignisse

Später bekommen die Ereigniskarten (K30) eine eigene Datei `daten/karten.js` mit Texten, Bedingungen und Häufigkeiten.

## 9. Wechselwirkungen

| Konzept | Wechselwirkung |
|---|---|
| K02 | Kalibrierung läuft über viele Seeds |
| K32 | Daten-Update für neue Saisons |
| alle | lesen ihre Zahlen aus `regeln.js` |

## 10. Zielwerte und Tests

- `tests/seed.js`: zwei Läufe mit gleichem Seed sind identisch, ein anderer Seed ergibt einen anderen Verlauf, und Speichern und Laden mitten in der Saison ändert nichts.
- Die Aufteilung in Dateien wurde gegen das alte `index.html` geprüft: gleicher Zufall ergab Zahl für Zahl dieselbe Saison.

## 11. Stellschrauben

Aufbau von `regeln.js`, ein Abschnitt pro Bereich: `spielstand`, `kalender`, `welt`, `spieler`, `finanzen`, `markt`, `training`, `engine`, `taktik`, `training`, `sommer`, `stab`, `disziplin`, `medizin`, `wettbewerbe`, `testspiele`, `lager`, `live`, `schwierigkeit`, `vorstand`, `saison`, `stadion`, `ui`. Jeder Eintrag hat einen Kommentar mit Einheit und Bedeutung.

## 12. Offene Fragen

1. ~~Alte Spielstände~~: entschieden am 6.11., sie werden gelöscht.
2. **Eigene Datensätze:** Soll man später eine eigene `spieler.js` ins Spiel laden können, ohne die Datei im Projekt zu tauschen?
3. **Pflege der Stärkewerte:** Die Wikipedia-Kader haben geschätzte Stärken. U2 leitet daraus das neue Spielermodell ab. Willst du die Schätzungen vorher selbst durchsehen?
