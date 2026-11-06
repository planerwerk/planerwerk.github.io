# K01 – Kalender und Tagesablauf

Status: **Entwurf**, Grundgerüst umgesetzt in U1.
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

- ✓ Ligaspiel, 1. und 2. Liga mit getrennten Terminen
- ✓ Pokalrunde, ✓ Relegation mit Hin- und Rückspiel, ✓ Saisonende
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

**Saison:**
- Spielbeginn 2026/27 ist Montag, 3. August 2026, die Woche vor dem 1. Spieltag der 2. Liga.
- Saisonende ist der Tag nach dem Relegations-Rückspiel (1. Juni 2027). Dann folgen Saisonbilanz und neue Saison.
- Juni und Juli werden übersprungen, bis K12 (Saisonvorbereitung) sie mit Inhalt füllt.

## 5. Regeln und Formeln

**Termine 2026/27.** Gesicherte Eckdaten aus dem Rahmenterminkalender von DFB und DFL, wie ihn die Quellen unten wiedergeben. ⚠ = von mir passend zu den Eckdaten geschätzt.

| Was | Termin |
|---|---|
| 1. Liga | 1. Spieltag 28.–30.8.2026, 14 Spieltage bis 18.–20.12., Rückrunde ab 8.–10.1.2027, 27. Spieltag 19.–21.3., 34. Spieltag 22.5.2027 |
| 1. Liga, englische Wochen | ⚠ 13.1. und 20.1.2027 (nötig, weil nur 14 Spieltage vor der Winterpause liegen) |
| 2. Liga | 1. Spieltag 7.–9.8.2026, 17. Spieltag 15.–17.1.2027, 34. Spieltag 23.5.2027. ⚠ alle Termine dazwischen |
| DFB-Pokal | 1. Runde 21.–24.8., 2. Runde 27./28.10., Achtelfinale 1./2.12.2026, Viertelfinale 2./3.2.2027, Halbfinale 20./21.4., Finale 29.5.2027 in Berlin |
| Relegation | 27./28.5. und 31.5./1.6.2027 |
| Länderspielpausen | 21.9.–6.10.2026 (zwei Fenster zusammengelegt), 9.–17.11.2026, 22.–30.3.2027 |
| Sonst | 1.5.2027 (Samstag) spielfrei |

- **Im Spiel liegt ein Spieltag an einem Tag:** 1. Liga samstags, 2. Liga sonntags, englische Wochen mittwochs, Pokal dienstags (1. Runde und Finale samstags), Relegation donnerstags und montags.
- **Folgejahre:** Die Termine von 2026/27 werden um volle Wochen verschoben, damit die Wochentage gleich bleiben. Echte Daten kommen später als eigene Datei dazu (K33).
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

## 12. Offene Fragen

1. **Sommer:** bis K12 überspringen (so umgesetzt) oder Tag für Tag?
2. **Spieltag an einem Tag** (so umgesetzt) oder verteilt auf Freitag bis Montag wie in echt?
3. **Geschätzte Termine** (2. Liga, englische Wochen der 1. Liga): den offiziellen Spielplan nachtragen, wenn du ihn möchtest.
4. **Erinnerungen ab Werk:** alle an (so umgesetzt)?

## Quellen

- Bundesliga-Eckdaten: [flashscore.de](https://www.flashscore.de/news/fu-ball-bundesliga-bundesliga-start-2026-wegen-wm-erst-am-28-august-nur-14-spiele-vor-winterpause/fwAdiTuJ/), [fcbayern.com](https://fcbayern.com/de/news/2025/11/bundesliga-pokal-supercup-rahmenterminkalender-der-saison-2026-27-vorgestellt), [stuttgarter-zeitung.de](https://www.stuttgarter-zeitung.de/sport/sport-mix/wann-geht-die-bundesliga-weiter-alle-termine-nach-der-laenderspielpause-79532225.html)
- 2. Liga: [stuttgarter-zeitung.de](https://www.stuttgarter-zeitung.de/sport/sport-mix/2-bundesliga-start-202627-saisonstart-spielplan-termine-tv-uebertragung-das-muessen-fans-wissen-79320599.html), [sport.sky.de](https://sport.sky.de/fussball/artikel/2-bundesliga-spieltag-1-und-2-2026-27-veroeffentlicht-alle-spiele-termine-und-uhrzeiten/13561240/34150), [anstosszeiten.de](https://anstosszeiten.de/2-bundesliga/)
- DFB-Pokal: [dfb.de, Rahmentermine](https://www.dfb.de/maenner/wettbewerbe/dfb-pokal/rahmentermine), [stuttgarter-zeitung.de](https://www.stuttgarter-zeitung.de/sport/sport-mix/dfb-pokal-2026-27-wann-geht-die-1-runde-los-termine-spielplan-tv-uebertragung-stream-79335705.html)
- Länderspielpausen und 1. Mai: [verbandsbuero.de](https://www.verbandsbuero.de/dfb-rahmenterminkalender-2026-2027-alle-termine/), [Wikipedia: FIFA International Match Calendar](https://en.wikipedia.org/wiki/FIFA_International_Match_Calendar)
- Transferfenster (für K19): Sommer bis 1.9.2026, Winter 1.1.–1.2.2027, laut [ran.de](https://ran.joyn.de/sports/fussball/bundesliga/deadline-day2026-welche-transferfenster-sind-noch-geoeffnet-86342)
