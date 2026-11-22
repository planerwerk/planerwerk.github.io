# K34 – Statistik und Historie

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12. **Umgesetzt mit U13 (20. November 2026, §5.3 bis §5.9), noch ohne Testlauf.**
Hängt ab von: K04 (Spieldaten), K29 (Sprüche) · Wird gebraucht von: K28, K35a.

## 1. Ziel und Spielgefühl

- **Die eigene Geschichte nachlesen:** Meisterschaften, Rekorde, Lieblingsspieler, der Spruch aus der Pressekonferenz von vor drei Jahren.
- **Ehrungen als kleine Höhepunkte:** Elf des Jahres, Torschützenkönig, Spieler der Saison (Community-Wunsch, Recherche 4b).
- **Verläufe:** Stärke, Form, Marktwert als Grafik (Community-Wunsch).

## 2. Vorbilder und Abgrenzung

- **Community-Wünsche:** historische Daten, „Elf des Jahres“, Marktwert-Verlauf (Recherche 4b).
- **Heute im Spiel:** Tore, Pokaltore, Einsätze, Gelbe Karten je Saison, Saisonhistorie `S.hist`. Bleibt die Grundlage.
- **Bewusst anders:** Der Speicher im Browser ist begrenzt. Volle Details für die letzten Saisons, ältere verdichtet.

## 3. Begriffe und Daten

| Bereich | Inhalt | Aufbewahrung |
|---|---|---|
| Spieler je Saison | Spiele, Minuten, Tore, Vorlagen, Notenschnitt, Karten, Paraden und Spiele zu null (Torhüter), Verein | alle Saisons, kompakt |
| Spieler-Verläufe | Stärke, Form, Marktwert je Monat (K03 `hist`) | 3 Saisons, danach je Saison ein Wert |
| Vereine je Saison | Platz, Punkte, Tore, Zuschauerschnitt, Umsatz, Ergebnis, Trainer | alle Saisons |
| Rekorde | höchster Sieg, längste Serie, meiste Tore einer Saison, Zuschauerrekord, Rekordtransfer | laufend |
| Ehrungen | Meister, Pokalsieger, Supercup, Aufsteiger, Torschützenkönig, Elf des Jahres, Spieler, Talent und Trainer der Saison | alle Saisons |
| Karriere des Trainers | Vereine, Titel, Ruf, Schwierigkeitsstufe je Saison (K02), Gehalt (K28) | alle Saisons |
| Sprüche-Chronik | Aussagen und Schlagzeilen aus K29 (D6: K34 speichert, K29 liefert) | höchstens 100 Einträge |
| Vitrine | Pokale, auch Testspiel-Turniere (K11) | alle |

## 4. Abläufe

1. **Nach jedem Spiel:** Spielerwerte fortschreiben, Rekorde prüfen (Meldung bei neuem Rekord, K04 §8).
2. **Saisonende:** Ehrungen vergeben (5.1), Saisonarchiv anlegen, Verläufe verdichten.
3. **Ansicht:** Statistikseite mit Tabellen, Verläufen als Linie (K35a), Vergleich zweier Spieler.

## 5. Regeln und Formeln

### 5.1 Ehrungen

- **Torschützenkönig:** meiste Ligatore (Relegation zählt nicht, wie heute).
- **Elf des Jahres:** je Position die besten Notenschnitte mit mindestens 20 Einsätzen, Grundordnung 4-3-3 (K06).
- **Spieler der Saison:** Notenschnitt, Tore und Vorlagen, Mannschaftserfolg gewichtet.
- **Talent der Saison:** bis 21 Jahre, Fortschritt der Stärke plus Notenschnitt.
- **Trainer der Saison:** Punkte über der Erwartung (K04 §5.8).
- Wirkung: Ehrungen heben den Marktwert (+5 %) und den Ruf (K28: Trainer der Saison +5).

### 5.2 Speicher

- Ziel: Statistik nach 20 Saisons höchstens 1 MB im Spielstand.
- Spieler ohne Einsatz in den letzten 5 Saisons werden zu einer Zeile Karrieresumme verdichtet.

### 5.3 Umsetzung U13 (20.11.2026): Erfassung

- **Je Spieler und Saison** zählt das Spiel in `p.sst`: Ligaspiele, Minuten, Tore, Vorlagen, Notensumme und Zahl der Noten, Gelb, Rot, für Torhüter Spiele zu null und Paraden, dazu Pokalspiele, Pokaltore und Pokalvorlagen. Relegation und Supercup zählen nicht mit (wie die Torjägerliste heute).
- **Eine Zeile je Saison und Verein:** Wechselt ein Spieler in der Saison den Verein, schließt seine Zeile und eine neue beginnt. Zum Saisonende wandern alle Zeilen in die Karriere `p.kar` als Liste von Zahlen: Saison, Verein, Liga, Spiele, Minuten, Tore, Vorlagen, Notenschnitt × 100, Gelb, Rot, Pokalspiele, Pokaltore, Pokalvorlagen, Stärke und Marktwert in Tausend zum Saisonende, Spiele zu null, Paraden. Nullen am Ende fallen weg, Feldspieler sparen so die beiden Torhüterwerte.
- **Verdichten (§5.2):** Wer fünf Saisons ohne Einsatz ist, behält nur eine Summenzeile `p.kas`.
- **Ehemalige:** Hört ein Spieler auf (oder fällt aus dem Spielstand), bleibt eine kurze Summe in `S.stat.ehem`, wenn er mindestens 150 Ligaspiele hatte, eine Ehrung bekam oder mindestens 30 Pflichtspiele für einen Verein bestritt, den du trainiert hast. Höchstens 400 Einträge, die ältesten gehen zuerst.
- **Verläufe:** Für Spieler deines Kaders am ersten Montag des Monats Stärke, Form und Marktwert in `p.mvl`, höchstens 36 Werte (3 Saisons). Danach bleibt je Saison der Wert aus der Karrierezeile. Für alle anderen gibt es nur die Werte zum Saisonende.
- **Ab Spielbeginn:** Alle Zahlen beginnen mit deinem Spielstand. Wer schon vorher gespielt hat, startet bei null. Die Ansicht sagt das.

### 5.4 Vorlagen

- Das Spiel kannte bisher keine Vorlagen. Sie werden **nach dem Spiel** verteilt, mit eigenem Zufallsstrom `vorlagen` je Spiel. Die Ergebnisse, Noten und Tore bleiben dadurch genau wie vorher.
- **Keine Vorlage** bei Elfmeter, direktem Freistoß und Eigentor (Definition von Opta, Quelle unten).
- **Anteil mit Vorlage je Art des Tores (vorläufig, eigene Schätzung, keine Ligazahl gefunden):** Ecke und Freistoßflanke 95 %, Kopfball 90 %, Großchance und Konter 85 %, Halbchance 75 %, Fernschuss 40 %, nach Torwartpatzer 10 %.
- **Wer die Vorlage gibt:** Bei Ecke und Freistoßflanke der eingeteilte Schütze, wenn er auf dem Platz stand. Sonst einer der Mitspieler, die in dieser Minute auf dem Platz standen (Startelf und Einwechslungen, ohne Ausgewechselte und Platzverweise), gewichtet nach Position (Außen, Zehner und Spielmacher am meisten, Torwart fast nie), Stärke und dem Merkmal Flankengeber (bei Kopfbällen ×2,5).

### 5.5 Ehrungen zum Saisonende (alle drei Ligen)

- **Torschützenkönig:** meiste Ligatore in dieser Liga, bei Gleichstand mehrere.
- **Elf des Jahres:** 4-3-3 nach Grobposition (1 Torwart, 4 Abwehr, 3 Mittelfeld, 3 Sturm), bester Notenschnitt mit mindestens 20 benoteten Ligaspielen. Fehlen Kandidaten, gilt die halbe Grenze.
- **Spieler der Saison:** 10 × (4 − Notenschnitt) + Tore + 0,7 × Vorlagen + 0,5 × Plätze vor dem Letzten (mindestens 20 Noten).
- **Talent der Saison:** bis 21 Jahre, mindestens 10 Noten, 2 × Stärkegewinn in der Saison + 5 × (4 − Notenschnitt).
- **Trainer der Saison:** größter Abstand zwischen Ligapunkten und erwarteten Punkten aus den Torchancen (K04 §5.8). Bei Computer-Vereinen heißt er „Trainer von …“, weil sie keine Trainernamen haben.
- **Wirkung:** Geehrte Spieler sind bis zum Ende der folgenden Saison 5 % mehr wert. Trainer der Saison gibt dir Ruf +5 (K28 §5.4).

### 5.6 Rekorde

- **Je Liga:** höchster Sieg, meiste Ligatore eines Spielers in einer Saison, längste Serie ohne Niederlage (nur Spiele dieser Liga, nach einem Ligawechsel beginnt die Serie neu).
- **Die 1. Liga startet mit den echten Bundesliga-Rekorden** (geprüft am 20.11.2026): 12:0 Mönchengladbach gegen Dortmund (29.4.1978), 41 Tore von Lewandowski (2020/21), 53 Spiele ohne Niederlage von Bayern (November 2012 bis März 2014). Wer sie bricht, bekommt die Meldung „Bundesliga-Rekord“. Seit K34b (22.11.2026, popolupo, Quellen bundesliga.com und dfb.de) starten auch die 2. und 3. Liga mit echten Rekorden. 2. Liga, seit 1974 und damit auch aus der zweigleisigen Zeit: 11:0 Arminia Bielefeld gegen Arminia Hannover (23.5.1980), 41 Tore von Horst Hrubesch für Rot-Weiss Essen (1977/78, eine Quelle nennt 1978/79), 28 Spiele ohne Niederlage (FC St. Pauli 1976 bis 1979, Arminia Bielefeld 1979/80). In der eingleisigen 2. Liga gab es bis 2021 nie einen zweistelligen Sieg, höchster war das 9:0 von Hansa Rostock gegen Koblenz (19.10.2008). 3. Liga seit 2008: 7:0 viermal, zuerst 1. FC Saarbrücken in Jena (11.8.2010), dann Wehen Wiesbaden in Köln (2018), Mannheim gegen Havelse und Zwickau gegen Würzburg (beide 14.5.2022). Dazu 28 Tore von Lars Gindorf für Alemannia Aachen (2025/26, vorher 27 von Dominik Stroh-Engel 2013/14) und 21 Spiele ohne Niederlage vom Karlsruher SC (2017/18, ebenso Saarbrücken 2011 über zwei Saisons). Beide Ligen melden Rekorde der eigenen Liga jetzt sofort. Alte Spielstände bekommen die Startwerte nachträglich, ein besserer Rekord aus dem Spiel bleibt.
- **Vereinsrekorde** für Vereine, die du trainierst: Zuschauer, höchster Sieg, teuerster Zugang, teuerster Abgang. Gemeldet wird nur, wenn ein alter Wert übertroffen wird.
- **Rekordtransfer der Spielwelt:** teuerster Zugang eines deutschen Vereins. Kein echter Startwert, weil die Geldbeträge im Spiel erst mit K23 an die echten angepasst werden.

### 5.7 Vitrine und Karriere

- **Vitrine:** Meisterschaft, Pokal, Supercup und Aufstieg deines Vereins und deine Ehrungen, mit Saison und Verein. Turnierpokale aus Testspielen (K11) gibt es im Spiel noch nicht.
- **Karriere:** Stationen mit Beginn, Ende und Grund (entlassen, zurückgetreten, gewechselt), je Saison Verein, Liga, Platz, Punkte, Tore, Zuschauerschnitt, Umsatz, Ergebnis, Ruf und Schwierigkeit. Das Gehalt des Trainers steht seit U12g (K28 §5.10, 22.11., ohne Testlauf) je Station und je Saison, dazu der Verdienst mit Abfindungen.
- **Saisonarchiv:** Abschlusstabellen aller drei Ligen (Verein, Punkte, Tore), Meister, Pokalsieger, Supercup, Aufsteiger und die Ehrungen.

### 5.8 Meldungen

- Neuer Rekord (siehe §5.6), Ehrungen für eigene Spieler und für dich, Torschützenkönig und Spieler der Saison der 1. Liga.
- **Jubiläum:** 100., 200., 300. … Pflichtspiel eines eigenen Spielers für deinen Verein (gezählt ab Spielbeginn) und 10 Jahre im Verein.

### 5.9 Ansicht

- Neuer Bereich **Statistik** mit Saison (Torjäger, Vorlagen, Scorer, Noten, Torhüter, dein Kader), Ehrungen, Rekorde, Archiv und Karriere mit Vitrine und Ehemaligen.
- **Spielerkarte:** Saison und Karriere als Tabelle, bei eigenen Spielern der Verlauf der Stärke als Linie am Regler.
- **Vergleich:** Auf der Spielerkarte „Vergleichen“ merkt sich den Spieler. Die Statistik zeigt die letzten zwei nebeneinander.
- **Lizenz:** Bereich `statistik` ab der ersten Lizenz (K36 §5.2). Statistik steuert nichts, darum keine Automatik.

## 6. Hebel des Spielers

Keine. Statistik beschreibt, sie steuert nicht.

## 7. Verhalten der Computer-Vereine

Ihre Spieler und Vereine werden gleich erfasst. Ehrungen gelten für alle.

## 8. Ereignisse

| Meldung | Auslöser |
|---|---|
| Neuer Rekord | Rekord gebrochen |
| Elf des Jahres | Saisonende, eigener Spieler dabei |
| Jubiläum | 100. Spiel eines Spielers, 10 Jahre im Verein |

## 9. Wechselwirkungen

K03 (Verläufe), K04 (Spieldaten), K11 (Turnierpokale), K13 (Titel), K28 (Ruf, Karriere), K29 (Sprüche-Chronik), K35a (Ansichten).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Speicher | nach 20 simulierten Saisons Statistik unter 1 MB |
| Konsistenz | Summe der Spielertore = Summe der Vereinstore je Saison (ohne Eigentore) |
| Ehrungen | jede Saison genau ein Torschützenkönig je Liga (bei Gleichstand mehrere) |

## 11. Stellschrauben

```js
statistik:{verlaufSaisons:3,chronikMax:100,verdichtenNachSaisons:5,elfMinEinsaetze:20,elfOrdnung:'4-3-3',ehrungMarktwert:0.05,trainerRuf:5,speicherMax:1e6}
```

Seit U13 stehen die Werte in `daten/regeln.js` unter `statistik` (Vorlagen, Ehrungen, Rekorde mit echten Startwerten, Ehemalige, Jubiläen, Speicher).

## 12. Offene Fragen

**Vorläufig entschieden:** Elf des Jahres in 4-3-3, volle Details drei Saisons lang, Sprüche-Chronik bis 100 Einträge.

**Vorläufig entschieden mit U13 (20.11.2026, von mir, weil „entscheide du“):**

1. Statistik ab Spielbeginn, frühere Spiele zählen nicht (§5.3).
2. Eine Karrierezeile je Saison und Verein, als Zahlenliste mit gekürzten Nullen am Ende (§5.3).
3. Verläufe je Monat nur für den eigenen Kader, sonst ein Wert je Saison (§5.3). Grund: Speicher. Ein Monatsverlauf für alle 1700 Spieler der drei Ligen bräuchte allein rund 700 KB.
4. Vorlagen nach dem Spiel mit eigenem Strom, damit die Kalibrierung der Engine unverändert bleibt (§5.4). Anteile je Torart sind geschätzt.
5. Ehrungen für alle drei Ligen, Meldungen nur für die 1. Liga und für eigene Leute (§5.5, §5.8).
6. Spieler der Saison und Talent der Saison mit festen Gewichten (§5.5).
7. Trainer der Saison nach Punkten über der Erwartung. Bei Computer-Vereinen ohne Namen (§5.5).
8. Marktwert +5 % bis zum Ende der folgenden Saison (§5.5).
9. 1. Liga mit echten Rekorden als Startwert, 2. und 3. Liga leer (§5.6). Seit K34b (22.11.) alle drei Ligen mit echten Startwerten.
10. Kein echter Startwert für den Rekordtransfer, bis K23 die Geldbeträge anpasst (§5.6).
11. Ehemalige mit Grenzen 150 Ligaspiele, Ehrung oder 30 Spiele für deinen Verein, höchstens 400 (§5.3).
12. Jubiläen ab Spielbeginn gezählt, nur für eigene Spieler (§5.8).
13. Torschützenkönig je Liga aus den Zeilen dieser Liga. Wer in der Winterpause die Liga wechselt, hat zwei Zeilen und zählt in jeder Liga nur mit seinen Toren dort.
14. Spiele zu null: Torwart mit mindestens 60 Minuten und kein Gegentor im ganzen Spiel. Paraden: jeder gehaltene Schuss aufs Tor und jeder gehaltene Elfmeter.
15. Vergleich zweier Spieler über „Vergleichen“ auf der Spielerkarte statt einer eigenen Suche (§5.9).
16. Lizenz `statistik` ab der ersten Stufe, ohne Automatik (§5.9).

**Seit K34c (22.11., popolupo, ohne Testlauf):** In der Saisonstatistik steht unter den Ligalisten eine Karte mit den deutschen Torjägern im Europapokal (bis zu 10, nach Europapokaltoren dieser Saison).

**Noch offen:** nichts aus diesem Konzept. Turnierpokale gibt es seit K11b (Sommerturnier, 22.11.).

## Quellen

- Wünsche zu Statistik und Historie: `konzepte/_recherche-genre.md`, Abschnitt 4b
- Zuständigkeit Sprüche-Chronik: `konzepte/_konsistenzpruefung.md`, D6
- Vorlage nach Opta (keine Vorlage bei Elfmeter, direktem Freistoß und Eigentor): https://www.squawka.com/en/?p=1316430 (Suche vom 20.11.2026, Wiedergabe der Opta-Definition)
- 12:0 Mönchengladbach gegen Dortmund 1978: https://www.bundesliga.com/de/bundesliga/news/rekorde-tore-meisterschaft-historie-bestmarken-spieler-meiste-3235
- 41 Tore Lewandowski 2020/21 (vorher Gerd Müller 40, 1971/72): https://www.bundesliga.com/de/bundesliga/news/robert-lewandowski-41-saisontore-2020-2021-gerd-muller-rekord-24079
- Kane 2025/26 mit 36 Toren Torschützenkönig, der Rekord steht weiter: https://www.bundesliga.com/en/bundesliga/news/harry-kane-top-scorer-2025-26-third-time-bayern-munich-37407
- 53 Bundesligaspiele ohne Niederlage, Bayern, 3.11.2012 bis 29.3.2014: https://guinnessworldrecords.com/world-records/114310-longest-unbeaten-streak-in-bundesliga und https://www.bundesliga.com/en/news/Bundesliga/0000290529.jsp
- Kriterien der kicker-Elf der Saison habe ich nicht gefunden. Die Grenze von 20 Noten ist meine Wahl.
- Rekorde der 2. Liga (K34b, gelesen am 22.11.2026): https://www.bundesliga.com/de/2bundesliga/news/rekorde-tore-aufstieg-abstieg-historie-bestmarken-spieler-5557 (11:0, Hrubesch 1977/78, 28 Spiele) und https://www.bundesliga.com/de/2bundesliga/news/rekorde-bestmarken-tore-siege-serien-saison-terodde-16477 (Stand 2021: Hrubesch 1978/79, 9:0 Rostock als Rekord der eingleisigen Liga). Hrubesch spielte ab 1978 in Hamburg, darum 1977/78.
- Rekorde der 3. Liga (K34b): https://www.dfb.de/news/rekordsiege-svww-erzielt-zum-zweiten-mal-sieben-tore (Liste der höchsten Siege, Stand 26.10.2026), https://dfb.de/news/28-treffer-torschuetzenkoenig-gindorf-knackt-bestmarke (28 Tore Gindorf), https://www.dfb.de/news/detail/zehn-siege-am-stueck-ksc-und-regensburg-unuebertroffen-263286 (21 Spiele ohne Niederlage Karlsruhe 2017/18, zehn Siege in Folge).
