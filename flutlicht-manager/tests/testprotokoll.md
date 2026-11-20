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
