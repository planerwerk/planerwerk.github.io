# K01 – Kalender und Tagesablauf

Status: **Entwurf**, umgesetzt in U1 und im Nachtrag vom 6.11. (Sommer, Anstoßzeiten, offizieller Spielplan). Deine Entscheidungen vom 6.11. sind eingearbeitet.
Hängt ab von: K33 (Daten), K35a (Bedienung) · Wird gebraucht von: K05, K07, K09–K13, K19–K21, K23, K29, K30.

## 1. Ziel und Spielgefühl

- Ein Tag im Büro: oben das Datum, darunter, was heute ansteht, und ein Knopf **„Tag beenden“**.
- **Schnell:** In einer normalen Woche gibt es einen Halt pro Spiel. Das Spiel hält nur an, wenn du etwas entscheiden kannst oder musst. Alles andere landet im Posteingang (Nachrichten).
- **Spielfreie Zeiten** wie Länderspielpause und Winterpause sind sichtbar. Später sind sie die Zeit für Testspiele und Training.

## 2. Vorbilder und Abgrenzung

- **Genre-Konvention:** Terminkalender, ein Weiter-Knopf, Posteingang (Anstoss, FM).
- **Lehre aus CM 01/02 und FM26:** Tempo ist eine Qualität. Deshalb höchstens 7 Tage pro Klick und kein Halt ohne Anlass.
- **Eigene Regel:** Die Erinnerung „Sicher? Du kannst noch …“ kommt nur, wenn wirklich etwas offen ist. Jede Art lässt sich abschalten.

## 3. Begriffe und Daten

| Begriff | Bedeutung | Ort |
|---|---|---|
| Tag | Zahl ab dem 1. Juli der Saison (Tag 0) | Spielstand `S.tag` |
| Datum | aus Saison und Tag berechnet, mit Wochentag | berechnet |
| Rahmentermine | Spieltage beider Ligen, Pokalrunden, Relegation, Pausen, Start und Ende | `daten/termine.js` |
| Spielplan der Saison | Tag je Spieltag und Wettbewerb | Spielstand `S.plan` |
| Halt | Tag, an dem „Tag beenden“ anhält | berechnet |
| Info | Meldung ohne Halt | Posteingang `S.news`, mit Datum |
| Frist | Ablauftag an einem Objekt, zum Beispiel „Angebot gilt bis“ | Feld `bis` |
| Erinnerung | Prüfung vor „Tag beenden“ | `js/kalender.js`, abgeschaltete Arten in `S.einst.aus` |

**Ereignisarten** (✓ in U1, ○ später):

- ✓ Ligaspiel in 1., 2. und 3. Liga, jedes Spiel mit eigenem Tag und Anstoßzeit
- ✓ Pokalrunde, ✓ Relegation 1./2. und 2./3. Liga mit Hin- und Rückspiel, ✓ Saisonende
- ✓ Saisonwechsel am 1. Juli, ✓ Trainingsauftakt nach dem Sommerurlaub
- ✓ Frist: Angebot für einen deiner Spieler läuft ab
- ✓ Bau fertig (nur Info)
- ○ Transferfenster (K19), Sportgericht (K09), Gespräch angefragt (K15), Ereigniskarte (K30), Trainingslager (K11, K12), Monatsabrechnung (K23), Abstellung zu Länderspielen (K13)

## 4. Abläufe

**„Tag beenden“:**
1. Erinnerungen prüfen. Trifft eine zu, erscheint „Sicher? Du kannst noch …“ mit „Hingehen“, „Trotzdem Tag beenden“ und „Nicht mehr erinnern“.
2. Spielst du heute: Vorbericht → Anpfiff → Konferenz → Weiter.
3. Danach laufen die übrigen Spiele des Tages und die Tagesverarbeitung.
4. Sprung: Tag für Tag weiter, jeder übersprungene Tag wird voll verarbeitet. Halt am ersten Tag mit Halt-Grund, spätestens nach 7 Tagen.

**Halt-Gründe:** eigenes Pflichtspiel, eine Frist läuft heute ab, Saisonende, Entlassung. Dazu die 7-Tage-Grenze.

**Erinnerungen in U1** (in dieser Reihenfolge, jede im Menü abschaltbar):
1. Frist: Ein Angebot für einen deiner Spieler gilt nur noch heute.
2. Aufstellung: Am Spieltag stehen in deiner gespeicherten Startelf Gesperrte oder Verletzte, und du hast die Aufstellung seitdem nicht angesehen.
3. Sponsor: Am Spieltag ist noch kein Trikotsponsor gewählt.
4. Verträge: In der letzten Woche vor Saisonende laufen Verträge von Stammspielern aus.

Die Erinnerungen „kein Trainingsplan“ und „spielfreie Woche ohne Testspiel“ kommen mit K07 und K11.

**Tagesverarbeitung**, in dieser Reihenfolge:
1. Tagesbeginn: Ausfalltage zählen herunter, die Frische erholt sich um ein Siebtel der Wochenrate, abgelaufene Angebote fallen weg, ein fertiger Bau wird gemeldet.
2. Montags die Wochenwerte: Training und Entwicklung, Formausgleich, Transfermarkt, Vorstand bei Minus auf dem Konto.
3. Spiele des Tages in allen Wettbewerben, danach Finanzen und Vorstand je Spiel.

**Saison und Sommer** (Entscheidung 6.11.: der Sommer wird nicht übersprungen):
1. Die Karriere beginnt am 1. Juli 2026. Die Mannschaft ist bis zum Trainingsauftakt am Montag, 6. Juli, im Urlaub.
2. Saisonende ist der Tag nach dem letzten Relegationsspiel (2. Juni 2027). Dann kommt die Saisonbilanz.
3. Danach Sommerpause: Die Mannschaft ist im Urlaub, das Training ruht, die Fitness sinkt langsam. Der Transfermarkt läuft weiter.
4. Am 1. Juli wechselt die Saison: Auf- und Abstieg, Alter, Verträge, Nachwuchs, neuer Spielplan, Sponsorangebote. Das ist ein Halt.
5. Trainingsauftakt (Halt), danach Vorbereitung bis zum ersten Pflichtspiel.
6. Im Sommer gehören dazu: Urlaub von 2 bis 4 Wochen (wählbar), Testspiele, Trainingslager und neue Sponsorverträge. In diesem Stand gibt es nur den festen Urlaub und die Sponsorangebote. Wahl der Urlaubslänge, Testspiele und Trainingslager kommen mit K11 und K12.

## 5. Regeln und Formeln

**Spielplan 2026/27:** offizieller Spielplan aller drei Ligen aus OpenLigaDB (`daten/spielplan-2026.js`, Stand 7.11.2026): Paarungen, Tage und Anstoßzeiten. Die Spieltage 1–18 (1. und 2. Liga) und 1–15 (3. Liga) sind zeitgenau angesetzt. Für die späteren steht nur das Wochenende fest.

**Spieltage über das Wochenende verteilt** (Entscheidung 6.11., von dir an mich delegiert):
- Football Manager setzt die echten Termine und Anstoßzeiten an (eigene Kenntnis, nicht eigens nachgeprüft). Die Klassiker BMH und Anstoss spielten den Spieltag, soweit ich weiß, an einem Tag mit großer Konferenz. Dafür habe ich keinen Beleg gefunden.
- Wir folgen der Wirklichkeit. Gründe: Der offizielle Spielplan ist so, der Tageskalender macht Ruhetage spürbar (Freitag- oder Sonntagsspiel vor einem Pokalspiel am Dienstag), und die Konferenz bleibt erhalten: Samstag 15:30 laufen in der 1. Liga fünf Spiele gleichzeitig.
- Dein Spiel ist ein Halt, die übrigen Spiele laufen im Hintergrund. In der Konferenz stehen alle Spiele des Tages, mit Anstoßzeit, wenn sie abweicht.
- **Raster** für Spieltage ohne feste Anstoßzeit und für alle späteren Saisons (in `regeln.js`): 1. Liga Fr 20:30, Sa 15:30 (5×), Sa 18:30, So 15:30, So 17:30. 2. Liga Fr 18:30 (2×), Sa 13:00 (3×), Sa 20:30, So 13:30 (3×). 3. Liga Fr 19:00, Sa 14:00 (5×), Sa 16:30, So 13:30, 16:30, 19:30. Unter der Woche Di und Mi. Attraktive Paarungen bekommen die besten Plätze, mit etwas Zufall.
- **Der letzte Spieltag** wird zeitgleich angepfiffen, wie im offiziellen Plan.
- Pokal: weiter eine Runde an einem Tag (1. Runde Sa 22.8., Finale Sa 29.5.). Relegationen: 27. und 31.5. (1./2. Liga), 28.5. und 1.6. (2./3. Liga).
- **Folgejahre:** Paarungen neu ausgelost, die Spieltage um volle Wochen verschoben, Anstoßzeiten im Raster.

- **Ausfälle in Tagen:** Eine Verletzung von w Wochen bedeutet 7·w Ausfalltage nach dem Spieltag. Wer am Samstag eine Woche Pause bekommt, fehlt also auch am nächsten Samstag, wie bisher. In englischen Wochen verpasst er dadurch mehr Spiele. Sperren zählen weiter Spiele der eigenen Mannschaft.
- **Was bisher pro Woche galt** (Training, Markt, Formausgleich), läuft montags. **Was pro Spieltag galt** (Finanzen, Vorstand), läuft beim Spiel. Eine Saison hat dadurch etwa 43 statt 40 Wochenschritte. Das gleicht U3 bei der Kalibrierung mit aus.

## 6. Hebel des Spielers

- „Tag beenden“, Erinnerungen an und aus (Menü).
- Später: Testspiele an freien Tagen (K11), Trainingswoche (K07), Regler für die Meldungsdichte (K30).

## 7. Verhalten der Computer-Vereine

Gleicher Kalender, gleiche Verarbeitung. Ihre Spiele laufen im Hintergrund.

## 8. Ereignisse

Ereigniskarten (K30) werden später Halt-Gründe. Insgesamt gilt das Budget von 2–4 Halten pro Woche (PLAN §2). In U1 gibt es noch keine Karten, deshalb meist nur einen Halt pro Woche.

## 9. Wechselwirkungen

| Konzept | Wechselwirkung |
|---|---|
| K13 | baut den Spielplan aus: Verlegungen, Abstellungen, echte Anstoßzeiten |
| K07, K11 | füllen Trainingswoche und freie Tage |
| K09, K10 | Verfahren und Reha laufen über Tage |
| K19, K21 | Transferfenster und Vertragsfristen als Fristen |
| K23 | Monatsabrechnung statt Buchung je Spieltag |
| K30, K35 | Dosierung der Halte, Büro und Kalenderansicht |

## 10. Zielwerte und Tests

- Halte pro Woche: in U1 meist 1, später 2–4. Das Testskript zählt mit.
- Kein Spieltag geht verloren. In jeder Liga haben alle gleich viele Spiele. Jede Saison endet mit Bilanz.
- Gleicher Seed und gleiche Eingaben ergeben den gleichen Verlauf, auch nach Speichern und Laden (`tests/seed.js`).

## 11. Stellschrauben

In `daten/regeln.js`, Abschnitt `kalender`:

| Eintrag | Start | Bedeutung |
|---|---|---|
| `maxSprung` | 7 | höchstens so viele Tage pro „Tag beenden“ |
| `wochenTag` | 1 | Wochentag der Wochenwerte (1 = Montag) |
| `angebotTage` | 14 | so lange gilt ein Angebot für deine Spieler |
| `vertragsWarnungNachSpieltag` | 25 | danach warnt eine Nachricht vor auslaufenden Verträgen |
| `hinweisVertraegeAbSpieltag` | 18 | ab dann zeigt das Büro auslaufende Verträge |
| `erinnerungVertragTage` | 7 | so viele Tage vor Saisonende erinnert „Tag beenden“ an auslaufende Verträge |
| `vorstand.schonfristSpieltage` | 6 | entlassen erst nach mehr als so vielen eigenen Ligaspieltagen |
| `erinnerungen` | alle an | Arten der Erinnerungen, abschaltbar im Menü |
| `anstoss`, `attraktivZufall` | siehe oben | Raster der Anstoßzeiten je Liga |
| `training.urlaubAbbau`, `urlaubMin` | 0,6 / 70 | Fitnessverlust pro Urlaubstag und Untergrenze |

## 12. Offene Fragen

Entschieden am 6.11.: Der Sommer wird gespielt, Spieltage sind über das Wochenende verteilt, der offizielle Spielplan wird genutzt, alte Spielstände werden gelöscht.

1. **Erinnerungen ab Werk:** alle an (so umgesetzt)?
2. **Urlaubslänge 2–4 Wochen:** Sie wird erst eine echte Wahl, wenn Frische und Stimmung (K03, K14) wirken. Bis dahin gilt ein fester Urlaub bis zum Trainingsauftakt. Einverstanden?
3. **Sommer füllen:** Testspiele und Trainingslager (K11) sowie Urlaub und Vorbereitung (K12) früher bauen? Vorschlag: beide in Welle 2.

## Quellen

- Offizieller Spielplan 2026/27: [OpenLigaDB](https://api.openligadb.de/getmatchdata/bl1/2026), ebenso `bl2` und `bl3`

- Bundesliga-Eckdaten: [flashscore.de](https://www.flashscore.de/news/fu-ball-bundesliga-bundesliga-start-2026-wegen-wm-erst-am-28-august-nur-14-spiele-vor-winterpause/fwAdiTuJ/), [fcbayern.com](https://fcbayern.com/de/news/2025/11/bundesliga-pokal-supercup-rahmenterminkalender-der-saison-2026-27-vorgestellt), [stuttgarter-zeitung.de](https://www.stuttgarter-zeitung.de/sport/sport-mix/wann-geht-die-bundesliga-weiter-alle-termine-nach-der-laenderspielpause-79532225.html)
- 2. Liga: [stuttgarter-zeitung.de](https://www.stuttgarter-zeitung.de/sport/sport-mix/2-bundesliga-start-202627-saisonstart-spielplan-termine-tv-uebertragung-das-muessen-fans-wissen-79320599.html), [sport.sky.de](https://sport.sky.de/fussball/artikel/2-bundesliga-spieltag-1-und-2-2026-27-veroeffentlicht-alle-spiele-termine-und-uhrzeiten/13561240/34150), [anstosszeiten.de](https://anstosszeiten.de/2-bundesliga/)
- DFB-Pokal: [dfb.de, Rahmentermine](https://www.dfb.de/maenner/wettbewerbe/dfb-pokal/rahmentermine), [stuttgarter-zeitung.de](https://www.stuttgarter-zeitung.de/sport/sport-mix/dfb-pokal-2026-27-wann-geht-die-1-runde-los-termine-spielplan-tv-uebertragung-stream-79335705.html)
- Länderspielpausen und 1. Mai: [verbandsbuero.de](https://www.verbandsbuero.de/dfb-rahmenterminkalender-2026-2027-alle-termine/), [Wikipedia: FIFA International Match Calendar](https://en.wikipedia.org/wiki/FIFA_International_Match_Calendar)
- Transferfenster (für K19): Sommer bis 1.9.2026, Winter 1.1.–1.2.2027, laut [ran.de](https://ran.joyn.de/sports/fussball/bundesliga/deadline-day2026-welche-transferfenster-sind-noch-geoeffnet-86342)
