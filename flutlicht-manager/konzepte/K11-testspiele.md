# K11 – Freundschaftsspiele und Trainingslager

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K01 (Kalender), K04 (Engine), K07 (Training), K12a (Sommer) · Wird gebraucht von: K12b, K14, K17, K23, K25.

**Umsetzungshinweise (U7d, 9. November 2026):** Gebaut sind Anfragen für Testspiele mit Antwort nach 1–3 Tagen, Testspiele ohne Halt mit eigenen Regeln (Wechsel, keine Sperren, weniger Belastung und Wirkung) und Einnahmen sowie das Trainingslager mit sieben Orten, Kosten, stärkerem Training, Zusammenhalt, Lagerkoller, Ablenkung und Wetter. Alles steht in der Trainingsansicht. Code in `js/testspiele.js`, Werte in `REGELN.testspiele` und `REGELN.lager`. Test: `tests/testspiele.js`. Abweichungen in §12 unter U7d.

## 1. Ziel und Spielgefühl

- **Der Sommer und die Pausen bekommen Inhalt:** Testspiele, ein Trainingslager, ein kleines Turnier.
- **Testspiele sind Werkzeug, nicht Pflicht:** Spielpraxis für Reservisten, neue Taktik ausprobieren, Neuzugänge einbauen, etwas Geld verdienen.
- **Das Trainingslager ist ein Block mit Wirkung:** mehr Vertrautheit, Kondition, Zusammenhalt. Aber auch Kosten und das Risiko „Lagerkoller“.
- **Kleine Geschichten:** das Testspiel beim Dorfverein vor 3.000 Fans, der Neuzugang mit dem Traumtor, die Zimmerbelegung, die zu einer Freundschaft führt.

## 2. Vorbilder und Abgrenzung

- **Anstoss 3:** Testspielgegner erst ab der 3. Vorbereitungswoche verfügbar, das Zuschauerinteresse an Testspielen lässt nach, Trainingslager mit Zimmerbelegung (PLAN §4).
- **Bundesliga Manager Hattrick:** Trainingslager als Teil der Planung (Recherche 2.1).
- **Bewusst anders:** Gegner hängen in Welle 2 nur an Niveau, Kalender und Region, ohne Beziehungen (Konsistenzprüfung C2). Mit K17 kommen Beziehungen dazu.

## 3. Begriffe und Daten

### 3.1 Testspiele

| Gegner | Wer | Sinn | Geld |
|---|---|---|---|
| Amateurverein | erfundener Dorf- oder Kreisligaverein aus der Region | leichter Aufgalopp, Fannähe | kleine Gage für dich, großer Tag für den Gastgeber |
| Profiverein gleiches Niveau | Vereine aus 1. bis 3. Liga | echter Test | Einnahmen teilen |
| Profiverein höheres Niveau | stärkerer Verein | Härtetest, Prestige | der Gastgeber zahlt dir nichts, du verdienst an den Zuschauern, wenn du Gastgeber bist |
| Auslandsverein | erfundene Vereine im Trainingslager | Test unter Bedingungen | wenig |
| Turnier | vier Vereine, zwei Tage, Halbfinale und Finale oder Spiel um Platz 3 | Pokal für die Vitrine, Geld | Antrittsgeld nach Ansehen |

### 3.2 Regeln für Testspiele

- **Wechsel:** bis zu 11, auch komplett zur Halbzeit. Kein Limit für Gelegenheiten.
- **Keine Sperren** aus Karten, keine Wirkung auf die Gelbe-Karten-Zählung (K09).
- **Weniger Intensität:** Frischeverlust ×0,7, Verletzungsrisiko ×0,6.
- **Spielpraxis** 60 % eines Pflichtspiels (K03 §5.4), **Vertrautheit** +2 statt +3 (K06), **Form** nur zu 30 % (K03 §5.2), **Lernen im Spiel** zur Hälfte (K03 §5.6).
- **Ansehen und Vorstand:** keine Wirkung, außer bei sehr deutlichen Niederlagen gegen Amateure (Presse, K29).

### 3.3 Trainingslager

| Ort | Jahreszeit | Kosten pro Tag (1. Liga) | Besonderheit |
|---|---|---|---|
| Alpen | Sommer | 25.000 € | Höhenlage: Kondition +15 % Wirkung, kühle Nächte |
| Schwarzwald | Sommer | 15.000 € | günstig, ruhig |
| Algarve | Winter | 30.000 € | mildes Wetter, Testspielgegner vor Ort |
| Andalusien | Winter | 35.000 € | warm, gute Plätze, Gegner vor Ort |
| Türkische Riviera | Winter | 20.000 € | günstig, viele Gegner vor Ort, Ablenkung höher |
| Golfregion | Winter | 60.000 € | sehr warm, Marketingwirkung (K25), lange Reise |
| Heimat | beide | 0 € | kein Ortswechsel, im Winter Wetterrisiko |

- Kosten skalieren mit der Liga (2. Liga ×0,6, 3. Liga ×0,35).
- **Dauer:** 5–10 Tage. Im Sommer in der Vorbereitung, im Winter in der Winterpause.
- **Zimmerbelegung:** du teilst die Doppelzimmer ein oder lässt den Co-Trainer machen. Wirkung auf Beziehungen und Deutsch (K14, K03).

### 3.4 Im Spielstand

- `S.testspiele`: geplante und gespielte Testspiele mit Datum, Gegner, Ort, Ergebnis.
- `S.lager`: Ort, Von, Bis, Zimmer.
- Erfundene Amateur- und Auslandsvereine kommen aus einer Namensliste in `daten/vereine.js` (gibt es schon für Amateure im Pokal).

## 4. Abläufe

### 4.1 Testspiel anfragen

1. Termin wählen: ein freier Tag ohne Pflichtspiel, mindestens zwei Tage Abstand zum nächsten Pflichtspiel.
2. Gegner wählen oder vorschlagen lassen (passend nach Niveau, Region, Kalender).
3. Antwort nach 1–3 Tagen (Frist im Kalender). Zusage hängt ab von 5.1.
4. Bei Zusage: Eintrag im Kalender. Am Spieltag ein Halt nur, wenn du live zusehen willst. Standard ist „sofort berechnen“, damit der Sommer nicht voller Halte steckt.

### 4.2 Trainingslager

1. Ort und Zeitraum wählen, Kosten sehen.
2. Testspiele vor Ort optional (Gegner vom Lager vorgeschlagen).
3. Während des Lagers: Training mit Lager-Bonus (5.3), Zimmerbelegung wirkt täglich, kleine Lager-Ereignisse (Abschnitt 8).
4. Abreise: Bericht des Co-Trainers mit Wirkung auf Kondition, Vertrautheit, Zusammenhalt.

### 4.3 Wann es geht

- **Sommer:** Testspiele ab der 3. Vorbereitungswoche (Anstoss-Idee). Davor nur gegen Amateure.
- **Länderspielpausen und Winter:** jederzeit, mit Spielern, die nicht abgestellt sind (K13).
- **In der Saison:** in spielfreien Wochen. Die Erinnerung „spielfreie Woche ohne Testspiel“ aus K01 (H9) wird aktiv.

## 5. Regeln und Formeln

### 5.1 Zusage

```
Zusage = Grundwert × Niveau × Kalender × Region × Phase   (begrenzt auf 0,05–0,95)
```

- **Niveau:** Anfrage an einen klar stärkeren Verein ×0,4, an einen gleich starken ×1, an einen schwächeren ×1,3. Amateurvereine sagen fast immer zu (×2).
- **Kalender:** hat der Gegner in den zwei Tagen davor oder danach ein Pflichtspiel ×0,2.
- **Region:** gleiche Region ×1,2, weit weg ×0,8.
- **Phase:** Vorbereitung ×1,2, mitten in der Saison ×0,7.
- **Ab K17:** Beziehung zum Verein als weiterer Faktor (0,5–1,5).

### 5.2 Zuschauer und Geld

- **Nachfrage** als Gastgeber: 25 % der Ligaspiel-Nachfrage in der 3. Vorbereitungswoche, danach je Woche −3 Prozentpunkte. Das Interesse lässt nach, wie bei Anstoss. Gegen einen großen Namen bis ×2.
- **Bei Amateuren als Gast:** fester Betrag nach deinem Ansehen (10.000–80.000 €), der Gastgeber füllt sein Stadion.
- **Turnier:** Antrittsgeld nach Ansehen, Siegprämie.
- Alle Beträge sind Spielwerte (nicht recherchiert) und stehen in `regeln.js`.

### 5.3 Trainingslager

- **Training im Lager:** alle Einheiten ×1,15 Wirkung (Fokus ohne Alltag), Vertrautheit ×1,25.
- **Zusammenhalt** (K14): +1 pro Tag bis zum 7. Tag. Bis K14 umgesetzt ist, wirkt das als +0,1 Selbstvertrauen pro Tag für alle.
- **Lagerkoller:** ab dem 8. Tag pro Tag 10 % Chance auf eine Lager-Ereigniskarte mit schlechter Stimmung.
- **Höhenlage:** Konditionswirkung ×1,15 (Sommer, Alpen).
- **Ablenkung:** Partylöwen mit Ort-Ablenkung „hoch“: 15 % Chance auf eine Ereigniskarte.
- **Wetterrisiko** in der Heimat im Winter: 20 % pro Tag, dass eine Einheit ausfällt.

### 5.4 Zimmerbelegung

- Doppelzimmer: Zwei Spieler, die sich ein Zimmer teilen, bauen eine Beziehung auf (Freundschaft, K14), mit Landsleuten schneller, aber dann lernen beide langsamer Deutsch (K03 §5.5, Anstoss-Idee).
- Rivalen in einem Zimmer: Risiko eines Streits.
- Bis K14 umgesetzt ist, wirkt nur der Deutsch-Teil.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Testspiel ansetzen | Spielpraxis, Vertrautheit, Geld, Neuzugänge einbauen | Frische, kleines Verletzungsrisiko, Kalender |
| starker Gegner | echter Test, Prestige | Absagen, Niederlagen drücken das Selbstvertrauen |
| Trainingslager | Training wirkt mehr, Zusammenhalt | Kosten, Lagerkoller bei zu langer Dauer |
| Ort wählen | Wetter, Gegner, Kondition | Kosten, Ablenkung |
| Zimmer einteilen | Freundschaften, Integration | falsch kombiniert gibt es Streit |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln. Sie planen zwei bis fünf Testspiele in der Vorbereitung, ein Trainingslager je Sommer und Winter nach Budget.
- Sie fragen auch bei dir an. Eine Anfrage an dich ist eine Info mit Frist, keine Pflicht.
- Große Vereine wählen teure Orte, kleine bleiben eher in der Heimat oder im Schwarzwald.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Dorfverein im Ausnahmezustand | Testspiel beim Amateurverein | Info, Fans und Ansehen in der Region leicht + (K27) |
| Blamage gegen Amateure | Niederlage gegen Amateurverein | Presse (K29), Vorstand verstimmt, Selbstvertrauen − |
| Traumtor des Neuzugangs | Neuzugang trifft im Testspiel | Integration +5 (K03), Fans (K27) |
| Lagerkoller (Entscheidung) | ab Tag 8 | freier Abend (Stimmung +, Disziplin −), durchziehen, früher abreisen |
| Ausflug ins Nachtleben | Partylöwe, Ort mit Ablenkung | Strafe, Gespräch oder ignorieren |
| Zimmerkollegen werden Freunde | Zimmerbelegung, Zufall | Freundschaft (K14) |
| Turniersieg | Turnier gewonnen | Pokal in der Vitrine (K34), kleines Selbstvertrauen + |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K01 Kalender | Termine, Fristen für Anfragen, Erinnerung „spielfreie Woche ohne Testspiel“ |
| K03 Spieler | Spielpraxis, Form zu 30 %, Lernen zur Hälfte, Deutsch durch Zimmer |
| K04 Engine | Testspiel-Modus mit vielen Wechseln, ohne Sperren |
| K06 Taktik | Vertrautheit, neue Taktik ausprobieren |
| K07 Training | Lager-Bonus auf Einheiten |
| K10 Medizin | weniger Risiko im Testspiel |
| K12a Sommer | Testspiele ab Woche 3, Lager in der Vorbereitung |
| K13 Länderspiele | abgestellte Spieler fehlen |
| K14 Kabine | Zusammenhalt, Zimmer, Lagerkoller |
| K17 Beziehungen | Zusage nach Beziehung |
| K23 Finanzen | Einnahmen, Lagerkosten |
| K25 Marketing | teure Orte mit Marketingwirkung |
| K34 Statistik | Testspiele getrennt, Turnierpokale |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Halte im Sommer | mit zwei bis vier Testspielen und einem Lager höchstens zwei zusätzliche Halte pro Woche, Testspiele standardmäßig ohne Halt |
| Zusage | gleich starker Gegner in der Vorbereitung: 60–80 %, klar stärkerer: 15–35 % |
| Lager lohnt | sieben Tage Lager im Sommer bringen in der Vertrautheit etwa eine Woche Vorsprung gegenüber zu Hause |
| Lagerkoller | bei zehn Tagen in mindestens einem Drittel der Fälle eine Lager-Karte |
| Geld | ein Testspielsommer bringt einem Zweitligisten etwa die Kosten seines Trainingslagers wieder ein (Spielwert) |

## 11. Stellschrauben

```js
testspiele:{
  abWoche:3,wechsel:11,frische:0.7,risiko:0.6,praxis:0.6,vertrautheit:2,form:0.3,lernen:0.5,
  zusage:{grund:0.6,staerker:0.4,schwaecher:1.3,amateur:2,kalender:0.2,region:1.2,weit:0.8,vorbereitung:1.2,saison:0.7,min:0.05,max:0.95},
  antwortTage:[1,3],abstandPflichtspiel:2,
  nachfrage:{start:0.25,jeWoche:-0.03,grosserName:2},gageAmateur:[10000,80000],
  turnier:{teams:4,tage:2}
},
lager:{
  orte:{alpen:{saison:'sommer',kosten:25000,kondition:1.15},schwarzwald:{saison:'sommer',kosten:15000},
    algarve:{saison:'winter',kosten:30000},andalusien:{saison:'winter',kosten:35000},
    riviera:{saison:'winter',kosten:20000,ablenkung:'hoch'},golf:{saison:'winter',kosten:60000,marketing:true},
    heimat:{saison:'beide',kosten:0,wetter:0.2}},
  ligaFaktor:{1:1,2:0.6,3:0.35},tage:[5,10],training:1.15,vertrautheit:1.25,
  zusammenhaltBis:7,kollerAb:8,koller:0.10,ablenkung:0.15
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Testspiele ohne Halt** als Standard, live nur auf Wunsch.
2. **Erfundene Gegner** für Amateure, Auslandsvereine und Turniere. Echte Profivereine aus 1. bis 3. Liga als Testspielgegner, weil sie ohnehin im Spiel sind.
3. **Reale Regionen** als Lager-Orte (Alpen, Algarve und so weiter), aber keine echten Hotels oder Marken.
4. **Alle Geldbeträge sind Spielwerte,** nicht recherchiert. Kalibrierung mit K23.

**Vorläufig entschieden bei der Umsetzung (U7d, 9. November 2026):**
5. **Testspiele anfragen** in der Trainingsansicht: Tag (frühestens in vier Tagen, bis sechs Wochen voraus, zwei Tage Abstand zu eigenen Pflichtspielen, höchstens zwei pro Woche) und Gegner. Vorgeschlagen werden zwei Amateurvereine und die acht Profivereine aus der 1. bis 3. Liga, die im Niveau am nächsten sind (gleiche Region zuerst). Gegen Amateure spielst du auswärts, gegen Profis zu Hause. Die Antwort kommt nach 1–3 Tagen als Nachricht.
6. **Zusage:** Grundwert 0,6 × Niveau (stärker ab 4 Punkten Kaderstärke ×0,4, schwächer ×1,3) × Kalender (Pflichtspiel des Gegners in zwei Tagen ×0,2) × Region (gleiche ×1,2) × Phase (Vorbereitung ×1,2, Saison ×0,7), begrenzt auf 5–95 %. Amateure sagen zu 95 % zu. „Weit weg ×0,8“ ist noch nicht gebaut, weil die Regionen grob sind. Profis sagen in der Vorbereitung vor der 3. Woche nie zu.
7. **Im Testspiel:** bis zu 11 Wechsel ohne Grenze der Gelegenheiten, keine Sperren und keine Karten in der Zählung (auch gesperrte Spieler dürfen spielen), Ermüdung, Belastung und Saisonbelastung ×0,7, Verletzungsrisiko ×0,6, Spielpraxis 60 %, Form zu 30 %, Vertrautheit +2, Lernen im Spiel zur Hälfte (jede zweite Szene). Testspiele zählen nicht als Einsatz, ihre Tore nicht zur Torjägerliste. Sie laufen immer ohne Halt und ohne Live-Ansicht.
8. **Geld:** Als Gastgeber kommen in der 3. Vorbereitungswoche 12 % der Ligaspiel-Nachfrage (Entwurf: 25 %), danach je Woche 1,5 Prozentpunkte weniger, mindestens 4 %, gegen einen großen Namen (Ansehen ab 80) doppelt so viele. Beim Amateurverein gibt es eine Gage von 10.000 bis 80.000 € nach Ansehen. Auswärts bei Profis gibt es nichts. Die Lagerkosten sind um 60 % höher als im Entwurf (Alpen 40.000 €, Schwarzwald 25.000 € pro Tag in der 1. Liga). Mit den Entwurfswerten brachten drei Heim-Testspiele einem Zweitligisten das Siebenfache der Lagerkosten, jetzt etwa das Doppelte. Alles Spielwerte.
9. **Trainingslager** in der Trainingsansicht: Ort, Beginn (in der Vorbereitung oder bis eine Woche vor und während der Winterpause der eigenen Liga), 5–10 Tage, Kosten sofort. Im Lager wirkt das Training ×1,15 (Alpen: Kondition ×1,15 mehr), die Vertrautheit ×1,25. Bis zum 7. Tag bekommen alle +0,1 Selbstvertrauen pro Tag (bis K14 statt Zusammenhalt). Ab dem 8. Tag gibt es mit 13 % pro Tag Lagerkoller (−0,5 Selbstvertrauen für 3–5 Spieler), damit es bei zehn Tagen in etwa einem Drittel der Fälle passiert (mit 10 % wären es nur 27 %). Riviera: Partylöwen fallen nachts auf. Heimat im Winter: 20 % pro Tag fällt das Training aus. Ein Lager pro Pause.
10. **Widerspruch in §10:** „Sieben Tage Lager bringen etwa eine Woche Vorsprung in der Vertrautheit“ passt nicht zu ×1,25 aus 5.3. Gebaut ist ×1,25, der Test prüft 15–35 % mehr Vertrautheitsgewinn. Soll das Lager stärker wirken, muss der Wert hoch.
11. **Noch nicht gebaut:** Testspiele der Computer-Vereine und deren Anfragen an dich, Turniere, Auslandsvereine als Gegner im Lager (kommen mit K32 und den echten Vereinsnamen), Zimmerbelegung (K14), Lager-Ereignisse mit Entscheidung, Marketing der Golfregion (K25), Erinnerung „spielfreie Woche ohne Testspiel“ (K01 H9), Testspiel live ansehen.
12. **Lernstufen (K36):** Testspiele ab Stufe 3 (davor plant der Co-Trainer zwei Testspiele gegen Amateure), Trainingslager ab Stufe 3 (davor fährt der Verein nicht ins Lager). Die Automatik dafür kommt mit UL.

## Quellen

- Testspielgegner ab der 3. Woche, nachlassendes Interesse, Zimmerbelegung und Sprache: PLAN §4 (GameStar 4/2000, Anstoss 3)
- Trainingslager bei BMH: `konzepte/_recherche-genre.md`, Abschnitt 2.1
- Testspiele ohne Beziehungen in Welle 2: `konzepte/_konsistenzpruefung.md`, C2
