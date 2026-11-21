# Testprotokoll

Asynchroner Kanal zwischen der Entwicklung auf den Zweigen `mitarbeit/popolupo-*` und den Testläufen von Claude (Zweige `claude/*`). Seit dem 20.11.

**So funktioniert es**
- Claude testet die Spitzen der Zweige `mitarbeit/popolupo-*` in einer Kopie und ändert an diesen Zweigen nichts. Die Ergebnisse stehen hier, der neueste Lauf oben.
- Jeder Fund hat eine Nummer (T1.1, T1.2 …). Wer einen Fund behebt oder entscheidet, nennt die Nummer in der Commit-Nachricht oder in der Konsistenzprüfung (zum Beispiel „behebt T1.2“). Claude liest das beim nächsten Lauf und trägt hier „erledigt in …“ ein.
- Diese Datei schreibt nur Claude. So gibt es beim Zusammenführen keine Konflikte. Antworten gehören in Commit-Nachrichten oder in die Konsistenzprüfung.
- Zur Einordnung, was schon vorher rot war (Stand e8ea42d, U10d): `tests/kalibrierung.js` (Favoritensieg Top 3 gegen Letzte 3, Spanne Ballbesitz), `tests/medizin.js` (Rückfall nach Zerrung 15 %, Kreuzbandrisse 10,0), `tests/akzeptanz.js` (Abwehr +0,8, Verhältnis der Bereiche, Tempo über 4 ms). Diese Werte schwanken mit jeder Änderung der Welt, sie zählen nur, wenn sie deutlich schlechter werden.

**Wie Claude testet**
Node.js 22, Playwright mit Chromium, für `tests/ui-zugang.js` axe-core 4.10.2 (per npm in der Testkopie). Die Node-Tests laufen parallel (vier gleichzeitig), die Browser-Tests einzeln nacheinander, `tests/akzeptanz.js` allein am Schluss (wegen der Tempomessung). Dazu `tests/code.js` (Kommentar am Zeilenende verschluckt keinen Code).

---

## Lauf 4, 21.11.2026: Claude-Zweig mit K24a Werbeflächen (887b0e2, danach 5910b26)

**Neu von Claude: K24a Werbeflächen** (726a439, Doku 887b0e2): Ausrüster und Ärmel neben der Trikotbrust, je Fläche drei Angebote und höchstens ein Vertrag, Automatik je Fläche, ohne Wahl das erste Angebot vor dem ersten Pflichtspiel. Vorläufig geldneutral (die drei teilen sich den bisherigen Brustbetrag 60 / 29 / 11 %), die Höhen aus K24 §5.1 erst mit K23. Neue Datei `js/werbung.js`, Test `tests/werbung.js`, `tests/vorbereitung.js` angepasst (Werbeverträge sind erst erledigt, wenn alle Flächen vergeben sind). **Für popolupo:** K24 ist damit angefangen, bitte nicht parallel daran bauen. Frei sind K23, K25, K26 und U19.

| Test | Ergebnis |
|---|---|
| alle Node-Tests außer den unten genannten (33), dazu werbung (neu) und statistik | grün |
| ui-zwei-saisons, ui-lernstufen, live-neuladen, seed, ui-zugang | grün |
| fuzz-karrieren | rot in Lauf 4 (T4.1), nach der Korrektur grün |
| spielermodell, sommer, kalibrierung, medizin, disziplin, akzeptanz | wie in Lauf 3 (T1.3 Rest, T3.2, Werte am Rand). Gleiche Zahlen wie in Lauf 3: K24a ist wirklich geldneutral |

**T4.1 (erledigt in 5910b26):** Die Abwanderung brachte Auslandsvereinen bis zum Saisonende zu viele Kernspieler (Manchester City und Inter Mailand je 15, erlaubt 6–10). Jetzt kauft ein Auslandsverein nur, wenn der Spieler bei ihm einen Kernplatz bekäme, höchstens einmal je Sommer, und sein Kern wird gleich auf Plan gekürzt. Danach geprüft: spielermodell (2. Liga Spanne jetzt 2,0), sommer, welt, ausland, statistik, lizenz, transfers, werbung, fuzz-karrieren.

---

## Lauf 3, 21.11.2026: Claude-Zweig mit den Korrekturen (b53a0c2, danach b4c97a4)

Am 20.11. abends kam nichts Neues dazu, getestet und korrigiert wurde der Stand von Lauf 2. Claude hat dafür `popolupo-u18b-spielwelt-karten` (cb3649b) in den Claude-Zweig geholt (2ee1122). **Für popolupo:** Bitte vor dem Weiterbauen den Zweig `claude/compassionate-galileo-bsbua4` holen, die Korrekturen stecken in Code und Tests von U11 bis U18b.

**Erledigt** (Fund, Commit, was geändert ist):

| Fund | Commit | Änderung |
|---|---|---|
| T2.1 | 551f97e | `presse.js`, `abwerben.js`, `fans.js`: Sponsorwahl nur, wenn Angebote da sind |
| T2.2 | 551f97e | `abwerben.js` prüft den Stimmungsfaktor bei festem Interesse (Code unverändert, die doppelte Wirkung steht so in K20 §11) |
| T2.6 | 551f97e | `ausland.js`: Verkauf außerhalb des Fensters wird erst vorgemerkt, dann zum Fensterbeginn geprüft |
| T2.7 | 551f97e | `schwierigkeit.js` vergleicht Leicht und Schwer Tag für Tag |
| T2.8 | 551f97e | `__scan` nimmt „zu null“ aus, `ui-zwei-saisons.js` liest die Zahl der Erinnerungs-Schalter aus den Regeln |
| T1.5 | 551f97e | `transfers.js` bietet nach der Pause die aktuelle Forderung |
| T1.2 | 551f97e | `welt.js`: Aufbau füllt die Gruppe auf, Stammspieler gut genug (der Code von `planBedarf` blieb) |
| T2.3 | 6cb54e2 | Gerüchte: Fehlt ein Anlass, erfinden die Medien etwas (vorläufig) |
| T2.4 | 6cb54e2 | Trainerpool wird nach der Besetzung wieder auf 12 freie aufgefüllt (eigener Strom) |
| T1.1 | 1bcbd3c | Leihen haben eine Automatik (vorläufig, K36 Grundsatz 1): Dein Verein leiht in der Automatik nach den Regeln der Computer-Vereine und meldet es. Der Gleichschritt-Test nimmt die Gerüchteküche aus (sie trifft gezielt deinen Verein), wie schon die Testspiele |
| T2.5 | 76e52de, f885c60 | Statistik nach 20 Saisons gemessen: 662 KB (Kurve 101, 176, 244, 303 … ab Saison 13 etwa 650 KB), die Prüfung für kurze Läufe erlaubt das 2,5-Fache des Schnitts. Verletzungsakte wird zu jedem Saisonwechsel gekürzt. `save()` meldet einmal, wenn der Browser nicht speichert (bisher still). Grenze des Spielstands: 3 MB Welt plus 1 MB Statistik (K33, K34) |
| T1.3 | 76e52de | Ursache gemessen: Seit U11a verpflichteten Vereine starke Vereinslose ohne Grenze (in der 3. Liga bis 16 über ihrer Grundstärke), und seit U11c hielten sie rund 99 % der Wichtigen (früh und beim Saisonwechsel), der frühere Abfluss starker Spieler fehlte. Geändert (alles vorläufig): Vereinslose höchstens Grundstärke + 2, Wichtige ab 30 nicht früh und nur zu 60 %, Abwanderung ins Ausland in der letzten Woche des Sommerfensters (K32 §8: 1. Liga 6–12, 2. Liga 3–6, 3. Liga 2–5). Ergebnis: 1. und 3. Liga im Rahmen, **2. Liga noch knapp darüber** (siehe unten) |
| T1.4 | b53a0c2 | Namen für sieben Auswahlfelder und das Exportfeld, Rolle `img` für den Regler, Kabinen-Tabelle per Tastatur scrollbar, Nebenschrift `--mist` etwas heller (Kontrast 4,5:1). Im Test: Tab-Startpunkt an den Seitenanfang (nach `blur()` machte Chrome an der letzten Stelle weiter) und Vergleich ohne Großschreibung (der Knopf steht per CSS in Großbuchstaben) |
| T3.1 | b4c97a4 | Neu in Lauf 3 gefunden: Beim Wechsel ins Ausland gingen laufende Statistikzeile, Karriere und Ehrung verloren (Spielertore ≠ Tabellentore). Jetzt wird die Zeile vorher abgeschlossen, `kar`, `kas`, `ehj` bleiben |

**Ergebnisse Lauf 3** (Node-Tests auf b53a0c2, `statistik.js` danach auf b4c97a4 wieder grün):

| Test | Ergebnis |
|---|---|
| alle übrigen Node-Tests (31) | grün, darunter welt, lizenz (Gleichschritt 150 Tage), transfers, ausland, schwierigkeit, presse, abwerben, fans, geruechte, trainerpool |
| ui-zwei-saisons | grün |
| spielermodell | rot (1): 2. Liga 69,8 → 72,4 (Spanne 2,6, höchstens 2). 1. Liga 77,1 → 78,1 und 3. Liga 65,4 → 67,1 im Rahmen |
| sommer | rot (1): T3.2 |
| kalibrierung | rot (5, davon 4 gelb am Rand): Favoritensieg Top 3 gegen Letzte 3 60 % (Ziel 65–75 %, n=73, war schon vor U11 rot) |
| medizin | rot (1): Kreuzbandrisse 9,0 (wie vorher) |
| disziplin | rot (1): Hitzköpfe 1,72-mal so viele Karten (Ziel 1,3–1,7), am Rand |

**T3.2 `tests/sommer.js` „Kondition zum ersten Ligaspiel nach der Vorbereitung 80–88“: 78,1** (Lauf 2: 80,3, vor U11: 84,8). Gemessen: derselbe Kader (24 Spieler, keine Neuzugänge), die Kondition entwickelt sich anders. Ohne die Abwanderung ins Ausland wären es 82,0, ohne die Grenze für Vereinslose 78,4, ohne die Regel ab 30 79,6. Dein Verein ist von der Abwanderung nicht betroffen, der Weg führt über die Welt (Gegner, Belastung der Vorsaison). Nicht weiter untersucht. **Offen.**

**T1.3 Rest:** Die 2. Liga liegt je nach Lauf zwischen 1,9 und 2,7 Spanne (Grenze 2,0). Weitere Stellschrauben (Anspruch gedeckelt, Verlängerung je Liga) brachten nichts Messbares und sind wieder raus. **Offen.**

---

## Lauf 2, 20.11.2026: `popolupo-u18b-spielwelt-karten` (cb3649b)

Die Spitze enthält alle Zweige von U11 bis U18b (Stand 17:27) und den Merge mit e8ea42d. Getestet als Ganzes. Für die neuen Funde ist der auslösende Commit angegeben, wo er gemessen ist.

| Test | Ergebnis | Fund |
|---|---|---|
| code, berater, beziehungen, karten, vorstand, spielwelt-karten (neu), vorbereitung (neu), disziplin, jugend, kabine, leihe, live, scouting, sommer, stab, taktik, testspiele, training, vertraege, wettbewerbe, zufall, zweite | grün | jugend wieder grün (T1.7 erledigt) |
| ui-lernstufen, live-neuladen, seed (Browser) | grün | |
| presse, abwerben, fans (neu) | Abbruch beim Aufbau | T2.1, mit Testkorrektur: presse grün, fans grün, abwerben T2.2 |
| geruechte (neu) | rot (1) | T2.3 |
| trainerpool (neu) | rot (1) | T2.4 |
| statistik (neu) | rot (1) | T2.5 |
| welt | rot (1) | T1.2 offen |
| lizenz | rot (1) | nur noch T1.1, Halte wieder grün (T1.6 erledigt) |
| spielermodell | rot (3) | T1.3 offen, Werte wie in Lauf 1 |
| transfers | rot (1) | T1.5 offen |
| ausland | rot (2) | **neu**, T2.5 und T2.6 |
| schwierigkeit | rot (1) | **neu**, T2.7 |
| kalibrierung | rot (3, alle gelb am Rand) | Remis 23 %, Pokal gegen Amateure 95 % (Ziel bis 94 %), Ballbesitz wie vorher |
| medizin | rot (1) | Kreuzbandrisse 9,5 (vorher 10,0), wie vorher |
| ui-zwei-saisons | rot (63) | **neu**, T2.8 |
| fuzz-karrieren | rot (104) | **neu**, T2.8 |
| ui-zugang | rot (6) | T1.4 offen, genau dieselben Verstöße wie in Lauf 1 |
| akzeptanz | rot (3) | wie vorher: Abwehr +0,8, Verhältnis der Bereiche, Tempo 4,71 ms |

**T2.1 Testhilfe `welt(true)` in `tests/presse.js`, `tests/abwerben.js`, `tests/fans.js` bricht ab** (`TypeError: Cannot read properties of null (reading '0')` in `sponsorWaehlen`). Mit Lernstufen wählt der Verein den Sponsor sofort (`sponsorAuto` in `sponsOffers`), danach ist `S.sponsOffers` leer. Korrektur wie in den älteren Tests: `if(S.sponsOffers)F.sponsorWaehlen(0)`. In einer Testkopie mit dieser einen Zeile: presse grün, fans grün, abwerben siehe T2.2. Kein Fehler im Spiel.

**T2.2 `tests/abwerben.js` „schlechte Stimmung ×1,3“: gemessen ×1,40** (11,80 → 16,51). Ursache: `abwPlus` nimmt die Stimmung zweimal, einmal über `wechselInteresse(p)` (hängt selbst an der Stimmung) und einmal über den Faktor `stimmung.unter`. Hotel gegen Restaurant (×2,0) und zwei Treffen (×1,4) stimmen. **Offen:** Soll die Stimmung doppelt wirken (dann Test anpassen), oder nur über einen der beiden Wege?

**T2.3 `tests/geruechte.js` „1 bis 3 Gerüchte je Woche“: Wochen ohne Gerücht** (0 1 0 1 2 2 1 1 1 0 1 1). Gemessen in einer frischen Welt: `gerKandidaten()` liefert 12 Wochen lang 0 eigene und 0 fremde Anlässe. Ein Platz bekommt dann nur ein Gerücht, wenn der Wurf „erfunden“ trifft, sonst bleibt er leer. Ohne die Vorbereitung des Tests waren es höchstens 1 je Woche, in 6 von 12 Wochen keins. Vorschlag: Fehlt ein Anlass, wird erfunden. Oder der Test baut vorher Anlässe.

**T2.4 `tests/trainerpool.js` „nach dem Saisonwechsel mindestens 12 frei“: 11.** Knapp unter der Grenze, am Anfang sind es genau 12. Der Pool wächst beim Saisonwechsel nicht nach.

**T2.5 Speicherbedarf (U13 Statistik):** `tests/statistik.js` 176 KB nach 2 Saisons (Grenze 100 KB, also anteilig 1 MB nach 20 Saisons). Passend dazu `tests/ausland.js` „Spielstand unter 3 MB“: 1757, 2665, 2898, 3010, 3072, 3164 KB nach 1 bis 6 Saisons (vor U11: höchstens 2629 KB, in U12: 2821 KB).

**T2.6 `tests/ausland.js` „Verkauf ins Ausland“ rot, ein Fehler im Test.** Die 40 Aufrufe von `weiter()` davor enden in U18b am 28.12. (Tag 180), also außerhalb des Fensters. Das Spiel merkt den Wechsel dann richtig nur vor (`p.wech` ab Tag 184, Geld gebucht, Angebot erledigt). In U12 endete die Schleife noch im Fenster. Vorschlag: Der Test stellt das Datum ins Fenster oder ruft danach `wechselTag` auf.

**T2.7 `tests/schwierigkeit.js` „Gleiche Ergebnisse auf Leicht und Schwer“ rot seit U15 (bc11332; U14 e445032 ist noch grün).** Ein Fehler im Test, kein Unterschied im Spiel. Der neue Halt „Deadline Day“ (Erinnerung `deadline`) hält nur auf Leicht (Tag 62 und 215). Der Test schaltet beide Welten Halt für Halt weiter und vergleicht danach verschiedene Tage. Tag für Tag verglichen sind die Ergebnisse bis zur Entlassung auf Schwer (Tag 290) gleich. Vorschlag: im Test beide Welten bis zum selben `S.tag` laufen lassen. Ohne den Markttag am Deadline Day (`deadlineTag`) bleibt der Test rot, daran liegt es also nicht.

**T2.8 `tests/ui-zwei-saisons.js` und `tests/fuzz-karrieren.js`: Fehlalarm „null“ (U13).** Die Textprüfung `__scan` in `tests/pruefungen.js` sucht `\bnull\b` gegen kaputte Anzeigen und schlägt bei der neuen Zeile „Torhüter: Spiele zu null“ in der Statistik an (62 von 63 und alle 104 Meldungen). Vorschlag: „zu null“ in `__scan` ausnehmen oder die Zeile umbenennen. Die einzige weitere Meldung in `ui-zwei-saisons`: „Menü: 7 statt 5 Erinnerungs-Schalter“. Seit U14 (`vorbereitung`) und U15 (`deadline`) sind es 7, der Test erwartet noch 5.

**Stand der Funde aus Lauf 1:** T1.1, T1.2, T1.3, T1.4, T1.5 offen. T1.6 und T1.7 auf U18b grün.

---

## Lauf 1, 20.11.2026: `popolupo-u11-computer-vereine` (c309f56) und `popolupo-u12-vorstand` (70e10e2)

Beide Zweige lagen auf fba0ec9 (U10d). Ergebnisse von U11 und U12 sind bis auf die genannten Ausnahmen gleich.

| Test | U11 | U12 | gegen den Stand davor |
|---|---|---|---|
| code, berater, leihe, vertraege, zweite, ausland, kabine, live, sommer, stab, taktik, training, wettbewerbe, schwierigkeit, scouting, testspiele, zufall | grün | grün | unverändert grün |
| vorstand, beziehungen, karten (neu) | – | grün | erster Lauf, fehlerfrei |
| welt (neu) | 39 von 40 | 39 von 40 | erster Lauf, siehe T1.2 |
| lizenz | rot (2) | rot (2) | **neu rot**, T1.1 und T1.6 |
| spielermodell | rot (3) | rot (3) | **neu rot**, T1.3 |
| transfers | grün | rot (1) | **neu rot in U12**, T1.5 |
| jugend | rot (1) | rot (1) | neu rot, knapp, T1.7 |
| kalibrierung | rot (1) | rot (3) | wie vorher, Werte schwanken |
| medizin | rot (1) | rot (1) | wie vorher, andere Werte am Rand |
| disziplin | rot (1) | grün | Gelb-Rot 0,06 genau am Rand, Rauschen |
| ui-zwei-saisons, fuzz-karrieren, ui-lernstufen, live-neuladen, seed (Browser) | grün | grün | unverändert grün |
| ui-zugang (neu) | – | rot (6) | erster Lauf, T1.4 |
| akzeptanz | rot (3) | rot (3) | wie vorher (Abwehr +0,8, Verhältnis, Tempo 4,9 ms statt 5,4 ms) |

**T1.1 Gleichschritt in `tests/lizenz.js` bricht nach 4 Tagen (vorher 150).** Ursache gemessen: Am Mo 6.7. (erster Montag im Fenster) leiht sich Arminia Bielefeld (Verein 30, im Lauf mit dem Stab ein Computer-Verein) Zento Uno von Gladbach aus. Im Vergleichslauf ist Bielefeld der eigene Verein, und der eigene Verein leiht nie von selbst (Bereich `leihe` ohne Automatik, U10d). Dort bleibt Uno frei, und Freiburg kauft ihn (5,93 Mio €). Budget, Bedarf und Profil von Freiburg sind in beiden Läufen gleich. Der Bruch kommt also aus U11d1 (Leihen unter Computer-Vereinen) zusammen mit der Entscheidung aus U10d, nicht aus der Automatik des Kaufs. **Offen, Entscheidung nötig:** Automatik für `leihe`, oder der Test wählt als Vergleichsverein einen, der im Fenster nicht leiht, oder der Gleichschritt gilt nur bis zum ersten Fenster.

**T1.2 `tests/welt.js` Nr. 6d „Leihe: der Bedarf ist weg“ rot.** Zwei Ursachen:
- Im Code (`planBedarf` in `js/computer.js`): Ist der Geliehene stärker als der verletzte Stammspieler, steht er selbst auf einem Stammplatz. Der Verletzte bleibt Stammspieler (die ersten `G.stamm` nach Stärke), als Ersatz zählt nur der Dritte. Der Bedarf „verletzt“ bleibt. Gemessen: IV mit Soll 4, Stammplätze 2, nach der Leihe 74/gesund, 70/verletzt 70 Tage, 60, 56.
- Im Test: Der Aufbau „Gruppe genau besetzen“ lässt die Gruppe bei 3 statt 4, wenn sie vorher unter dem Soll war (`slice(G0.soll)` entfernt nichts, aufgefüllt wird nicht).

**T1.3 `tests/spielermodell.js`: Die Ligen werden über die Saisons stärker.** Schnitt der besten 14 über 6 Saisons, 1. Liga 77,6 → 79,4 (vorher 77,3 → 77,0), 2. Liga 69,9 → 73,2 (vorher 69,5 → 71,3), 3. Liga 65,5 → 68,9 (vorher 64,9 → 65,9). Ursache nicht untersucht. Vermutung: Das Auffüllen am Ende des Sommerfensters und die Käufe nach Kaderplan holen mehr Stärke aus dem Pool der Vereinslosen und dem Ausland in die Ligen, als durch Abgänge verloren geht.

**T1.4 `tests/ui-zugang.js` (erster Lauf, Verstöße waren angekündigt):** schwere Verstöße nach axe: Kabine `scrollable-region-focusable` (1×), Spielplan `select-name` (1×), Finanzen `aria-prohibited-attr` (1×), Training & Jugend `color-contrast` (3×) und `select-name` (5×), Menü `label` (1×). Tastatur: „Tag beenden“ ist mit Tab nach 80 Schritten nicht erreicht. Grün: Fokus im Fenster beim Öffnen, Escape schließt Spielerkarte und Menü, jeder Fokus sichtbar.

**T1.5 `tests/transfers.js` „Nach der Pause wird wieder verhandelt“ rot (nur U12).** Kein Fehler im Spiel, der Test passt nicht mehr: Zwei Spottangebote kosten seit U12c je −3 Beziehung, dadurch steigt die Forderung (`forderungDu` mit `bezAbloese`) um knapp 1 %. Der Test bietet nach der Pause noch die alte Forderung `F0`. Vorschlag: nach der Pause `forderung(p)` neu holen.

**T1.6 `tests/lizenz.js` „Mit Lernstufen nicht mehr Halte als ohne“:** 47 gegen 44 (vorher 39 gegen 53). Nicht untersucht.

**T1.7 `tests/jugend.js` „Prägungen je Verein 2 bis 5“:** 1,95 (vorher 2,37). Knapp unter der Grenze, vermutlich eine Folge der anderen Welt.

**Nur zur Ansicht aus `tests/welt.js` (nicht gewertet):** Zugänge über den Markt je Verein im Sommer 1,1 und 0,8 (K31 §10 nennt 3 bis 8 für alle Zugänge zusammen). Trainerwechsel in der 1. Liga 2026: 4, 2027: 0 (Ziel 4 bis 10). Budget im letzten Fenster zu 6 % genutzt. Der Langzeitlauf `node tests/welt.js 10` ist noch nicht gelaufen.

**Hinweis Zusammenführen:** Der Fix der Trainerstab-Gehälter steht doppelt (a789c0a und e8ea42d). Seit dem Merge um 17:17 ist das erledigt.
