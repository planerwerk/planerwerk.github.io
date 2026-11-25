# K13 – Wettbewerbe und Spielplan

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K01 (Kalender), K32a (Unterbau), K04/K05 (Verlängerung, Elfmeterschießen) · Wird gebraucht von: K07, K09, K10, K11, K12a, K23, K28.

**Umsetzungshinweise (U7c, 9. November 2026):** Gebaut sind die Pokal-Auslosung mit Töpfen und Heimrecht als Halt zwei Wochen vor der Runde, Spielverlegungen nach der Auslosung und ein Reparaturdurchlauf im Spielplan für 72 Stunden, die Relegation mit Verlängerung und Elfmeterschießen, der Supercup und die Regel für Zweitmannschaften. Code in `js/wettbewerbe.js` und `js/kalender.js` (planReparieren), Werte in `REGELN.wettbewerbe`. Test: `tests/wettbewerbe.js`. Abweichungen in §12 unter U7c.

## 1. Ziel und Spielgefühl

- **Echte Strukturen:** drei Profiligen, DFB-Pokal, Relegation, Regionalliga-Aufstieg, Supercup, Länderspiele mit Abstellungen.
- **Kleine große Momente:** die Pokal-Auslosung, das Heimspiel des Drittligisten gegen den Bundesligisten, das Elfmeterschießen im Relegations-Rückspiel, der Anruf des Bundestrainers.
- **Der Kalender lebt:** englische Wochen, Länderspielpausen mit abgestellten Spielern, die müde zurückkommen, verlegte Spiele.
- **Europapokal später** (PLAN §2). Bis dahin stehen die Plätze nur in der Tabelle und in den Saisonzielen.

## 2. Vorbilder und Abgrenzung

- **Echte Regeln** als Grundlage, soweit belegt (Abschnitt 3).
- **Community-Wünsche:** Pokal-Auslosungen als Moment, Spielverlegung beantragen, wenn viele Nationalspieler fehlen, mindestens 72 Stunden zwischen zwei Spielen (Recherche 4, 4b).
- **Bewusst anders:** keine Lizenzrechte an Wettbewerbsnamen und Logos. Die Wettbewerbe heißen schlicht „1. Liga“, „DFB-Pokal“ und so weiter, wie heute im Spiel.

## 3. Begriffe und Daten

### 3.1 Wettbewerbe

| Wettbewerb | Teilnehmer | Modus | Stand |
|---|---|---|---|
| 1., 2., 3. Liga | 18, 18, 20 | Hin- und Rückrunde | ✅ seit U1 |
| Regionalliga | Pool, Meister gelost | Aufstieg direkt oder über Aufstiegsspiele | ✅ K32a |
| Relegation 1./2. Liga | 16. der 1. gegen 3. der 2. Liga | Hin- und Rückspiel, Hinspiel beim Zweitligisten | ✅, Ablauf ändert sich (3.3) |
| Relegation 2./3. Liga | 16. der 2. gegen 3. der 3. Liga | wie oben | ✅, Ablauf ändert sich |
| DFB-Pokal | 64 Teams | K.-o., eine Partie, Verlängerung, Elfmeterschießen, Finale neutral | ✅, Heimrecht und Auslosung neu (3.2) |
| **Supercup** | Meister gegen Pokalsieger | ein Spiel vor dem 1. Spieltag beim Meister | neu |
| **Länderspiele** | Nationalspieler aller Vereine | Abstellung in den Länderspielpausen, Turniere im Sommer | neu (3.4) |
| Europapokal | – | später, fest eingeplant als K37 (Champions League, Europa League, Conference League, 10.11.) | – |

### 3.2 DFB-Pokal

- **Heimrecht:** Vereine aus der 3. Liga und darunter haben automatisch Heimrecht gegen höherklassige. Das Heimrecht kann nicht getauscht werden (Quellen). Für spätere Runden ist das nicht geprüft. Vorläufig gilt: unterklassig spielt zu Hause bis einschließlich Halbfinale, sonst entscheidet das Los (Frage 2).
- **Auslosung:** Runde 1 mit zwei Töpfen (Amateure und Drittligisten gegen Erst- und Zweitligisten), ab Runde 2 ein Topf. Die Auslosung ist ein **Halt mit Moment**: Kugeln werden gezogen, dein Los wird hervorgehoben.
- **Zweitmannschaften** spielen nicht im Pokal (gibt es so).
- **Prämien** wie heute je Runde (Werte in K23 prüfen).

### 3.3 Relegation

- Hin- und Rückspiel, **keine Auswärtstorregel** mehr. Bei Gleichstand nach dem Rückspiel Verlängerung (2 × 15 Minuten), dann Elfmeterschießen (Quellen).
- Heute entscheidet bei Gleichstand ein Los, angezeigt als Elfmeterschießen (Konsistenzprüfung H5). K13 ersetzt das durch echte Verlängerung und echtes Elfmeterschießen aus der Engine (K04, K05).

### 3.4 Länderspiele

- **Fenster:** die Länderspielpausen aus `daten/termine.js` (September, Oktober, November, März), dazu im Sommer alle zwei Jahre ein Turnier.
- **Nationen-Tabelle** (neu, `daten/nationen.js`): je Nation eine Stärke (grob nach Weltrangliste) und daraus eine **Schwelle**, ab der ein Spieler nominiert wird. Starke Nationen hoch, kleine niedrig.
- **Nominierung:** Spieler mit passender Nationalität (K03), deren Stärke über der Schwelle liegt, bis zu 26 je Nation. Für Deutschland die besten deutschen Spieler im Spiel. Spieler ausländischer Ligen kommen mit K32 (Auslandspool) dazu.
- **Abwesenheit:** vom ersten Tag des Fensters bis zum Tag danach. Kein Vereinstraining (K07).
- **Rückkehr:** Wer gespielt hat, kommt mit −10 bis −20 Frische zurück, Saisonbelastung +2 je Spiel (K12a), Verletzung mit kleinem Risiko (3 % je Fenster und eingesetztem Spieler), Selbstvertrauen ±0,3 nach Ausgang. Dazu Stimmung + (Stolz, K14) und Marktwert + (K19).

### 3.5 Spielplan

- **2026/27:** offizieller Spielplan mit Anstoßzeiten (`daten/spielplan-2026.js`, seit dem 6.11.).
- **Folgesaisons:** erzeugt nach festen Regeln (gibt es seit U1): Termine um volle Wochen verschoben, Anstoßzeiten nach Raster und Attraktivität (`kalender.anstoss`), letzter Spieltag zeitgleich.
- **Ergänzte Regeln:**
  - mindestens 72 Stunden zwischen zwei Pflichtspielen eines Vereins (Community-Wunsch)
  - kein Verein mehr als zwei Heimspiele in Folge (außer zum Saisonwechsel)
  - englische Wochen der Liga nicht direkt vor einer Pokalrunde

### 3.6 Spielverlegung

- **Antrag möglich:** wenn ein Verein in einem Pflichtspiel mindestens 3 Spieler wegen Länderspielen abstellt (betrifft vor allem die 3. Liga, die in Länderspielpausen spielt) oder wenn mindestens 5 Spieler krank sind (K10).
- **Echte Grundlage:** In der 3. Liga hat der DFB Spiele in Länderspielpausen auf Antrag nach § 34 der Spielordnung verlegt. Eine feste Schwelle habe ich nicht gefunden. 3 Spieler ist ein Spielwert (Frage 3).
- **Entscheidung** nach 2–4 Tagen: genehmigt mit 60 %, neuer Termin in der nächsten freien Woche.

### 3.7 Zweitmannschaften

- Spielen in der 3. Liga oder darunter, nicht im Pokal, steigen nicht in die 2. Liga auf (gibt es so).
- **Neu:** Steigt die erste Mannschaft in die Liga ihrer Zweitmannschaft ab, muss die Zweitmannschaft eine Liga tiefer (Konsistenzprüfung I5). Seit U9d geprüft: Die Zweite eines Drittligisten darf nicht einmal in der Regionalliga spielen (§12, Nachtrag U9d).

## 4. Abläufe

| Wann | Was |
|---|---|
| 1. Juli | neuer Spielplan |
| Anfang Juli | Pokalauslosung Runde 1 (Halt mit Moment) |
| Samstag vor dem 1. Spieltag der 1. Liga | Supercup |
| je Pokalrunde | Auslosung etwa zwei Wochen vorher (Halt mit Moment) |
| Länderspielpause | Nominierungen eine Woche vorher (Info), Abreise, Ergebnisse der Nationalteams (Info), Rückkehr mit Folgen |
| Saisonende | Relegationen, Aufstiegsspiele der Regionalliga, Abschlusstabellen |
| alle zwei Jahre im Sommer | Turnier: Nominierte fehlen bis zu ihrem Ausscheiden, Urlaub danach (K12a) |

## 5. Regeln und Formeln

### 5.1 Nominierung

```
Schwelle(Nation) = 88 − 0,5 × (Rang der Nation − 1), mindestens 62
nominiert, wenn Stärke ≥ Schwelle, höchstens die 26 Stärksten je Nation
```

- Bei Spielern um die Schwelle entscheiden Form und Spielpraxis mit: Form unter 7 oder Spielpraxis unter 40 % → nicht nominiert.
- **Einsatz im Länderspiel:** Die Stärksten spielen öfter. Je Spiel 90 Minuten für die besten elf, 0–30 Minuten für die anderen, gewürfelt.

### 5.2 Supercup

- Meister gegen Pokalsieger. Gewinnt ein Verein beides, spielt der Vizemeister (prüfen).
- Ein Spiel, bei Gleichstand direkt Elfmeterschießen (prüfen). Zählt für Statistik und Vitrine (K34), kleine Prämie.
- **72 Stunden (ergänzt am 13.11.):** Der Termin hält drei Tage Abstand zur ersten Pokalrunde und zu den Ligaspielen beider Teilnehmer. Steht ein Zweitligist als Pokalsieger im Supercup, hat seine Liga schon begonnen, dann rückt der Supercup wochenweise vor.

### 5.3 Elfmeterschießen

- Fünf Schützen je Team in der Reihenfolge aus K06, danach abwechselnd bis zur Entscheidung.
- Torwahrscheinlichkeit wie in K04 (0,76 mit Schütze, Torwart, Merkmalen, Selbstvertrauen, Nervenstärke). Im Elfmeterschießen zählt Druckresistenz doppelt.

## 6. Hebel des Spielers

| Hebel | Wirkung | Preis |
|---|---|---|
| Spielverlegung beantragen | ein Spiel ohne die Abgestellten vermeiden | späterer Termin, eventuell englische Woche |
| Pokal ernst nehmen oder rotieren | Prämien, Ansehen, Vorstand (K28) | Frische für die Liga |
| Nationalspieler im Kader | Ansehen, Marktwert | Ausfälle in den Pausen, müde Rückkehrer |
| Elfmeterschützen festlegen | Pokal und Relegation entscheiden | – |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln. Computer-Vereine beantragen Verlegungen nach denselben Schwellen.
- Pokal: Favoriten rotieren in Runde 1 und 2 gegen Amateure etwas (Frische-Schwelle aus K03 §7 gilt dann schon ab 85 %).

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Pokal-Los des Jahres | Amateur oder Drittligist zieht einen Spitzenverein | Presse (K29), ausverkauft (K27) |
| Anruf des Bundestrainers | erste Nominierung eines deiner Spieler | Info, Stimmung + (K14), Marktwert + |
| Länderspiel-Verletzung | Verletzung während der Abstellung | Info, Ärger mit dem Verband (K17 später) |

**Gebaut als K13g (24.11.2026, popolupo, ohne Testlauf, vorläufig), nur mit Länderspielen (K13f):** „Anruf des Nationaltrainers“ (Info, Anlasskarte) bei der ersten Nominierung eines deiner Spieler bis 23 Jahre, solange er bei der Nationalmannschaft ist, Stimmung +3 (`p.lspN` zählt die Nominierungen im Spiel; bei Älteren aus den Startkadern wäre es kaum die erste). „Verletzt von der Nationalmannschaft zurück“ (Info) bis 7 Tage nach einer Rückkehr mit Verletzung (`p.lspV`), solange er verletzt ist, Fans −1. Marktwert + und Ärger mit dem Verband (K17) fehlen noch.
| Überraschungs-Aus | Bundesligist scheidet gegen Amateure aus | Presse, Vorstand (K28) |
| Pokal-Rotation rächt sich | Favorit rotiert und verliert | Spielbericht erwähnt es |

**Gebaut als K13c (22.11.2026, popolupo, ohne Testlauf), als Meldungen ohne Würfel:** „Pokalsensation“ (ein Erstligist, nicht dein Verein, scheidet gegen einen Amateurverein oder einen Verein ab der 3. Liga aus) und „Pokal-Los des Jahres“ (bei der Auslosung ein Erstligist mit Ansehen ab 80 gegen einen Amateurverein; seit Prüfung EE4 nicht in der 1. Runde, wo alle Profis Amateure ziehen, und höchstens einmal je Saison). Die übrigen Meldungen brauchen Länderspiele und fehlen noch. Die Rotation gibt es seit K13e (unten).

**Gebaut als K13e** (23.11.2026, popolupo, ohne Testlauf, Werte vorläufig): „Pokal-Rotation rächt sich“ als Meldung nach deinem Pokal-Aus.
- **Wann:** Du scheidest als Favorit aus. Favorit heißt: Der Gegner ist ein Amateurverein, oder sein Niveau liegt mindestens 5 unter deinem (`RWB.pokal.rotation.favorit`).
- **Rotation:** Mindestens 4 Spieler der Startelf (`rotation.wechsel`) standen im letzten Ligaspiel dieser Saison nicht in der Startelf. Dafür merkt sich das Spiel die Startelf jedes deiner Ligaspiele (`S.ligaXI`).
  - Gab es bei deinem Verein in dieser Saison noch kein Ligaspiel, zählt die beste Elf (`bestXI`, ohne Zufall). Das betrifft vor allem die 1. Liga: Die 1. Pokalrunde liegt vor dem Ligastart, und gerade dort spielt man gegen Amateure (Prüfung FC6). Ebenso nach einem Jobwechsel.
- **Folge:** nur die Meldung, so wie die Tabelle in §8 es vorsieht. Gegen Amateure und Vereine tieferer Ligen bestraft der Vorstand das Aus schon (K28). Gegen einen schwächeren Verein derselben Liga bleibt es bei der Meldung (Prüfung FC7).
- Nur dein Verein, ohne Zufall. Der Gleichschritt vergleicht keine Meldungen.

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K01 Kalender | Termine, Halte für Auslosungen, Spielverlegung als Frist |
| K03 Spieler | Nationalität, Frische, Saisonbelastung, Selbstvertrauen nach Länderspielen |
| K04, K05 | Verlängerung, Elfmeterschießen, Heimrecht |
| K07 Training | kein Training während der Abstellung |
| K09 Sportgericht | Sperren je Wettbewerb, Relegation |
| K10 Medizin | Länderspielverletzungen, Spielverlegung bei Krankheitswelle |
| K11 Testspiele | in Länderspielpausen ohne Abgestellte |
| K12a Sommer | Turnierteilnehmer, späterer Urlaub |
| K23 Finanzen | Pokalprämien, Supercup-Prämie |
| K28 Vorstand | Pokalziele |
| K32 Welt | Auslandspool für Nominierungen, Nationen-Tabelle |
| K34 Statistik | Pokalsieger, Supercup, Länderspiele |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Pokal-Heimrecht | in jedem Spiel unterklassig gegen höherklassig (bis Halbfinale) hat der Unterklassige Heimrecht |
| Bundesligisten raus in Runde 1 | im Schnitt 2–5 pro Saison (prüfen) |
| Relegation | Erstligist setzt sich in 55–75 % durch (prüfen) |
| Elfmeterschießen | kommt in der Relegation über viele Saisons gelegentlich vor, kein Los mehr |
| Abstellungen | ein Bundesligist im oberen Drittel stellt je Pause 6–12 Spieler ab (prüfen) |
| 72 Stunden | kein Verein spielt zweimal innerhalb von 72 Stunden |
| Zweitmannschaften | nie in derselben Liga wie die erste |

## 11. Stellschrauben

```js
wettbewerbe:{
  pokal:{heimrechtUnterklassig:true,heimrechtBisRunde:5,auslosungTageVorher:14,rotationFrische:85},
  relegation:{auswaertstor:false,verlaengerung:30,elfmeter:true},
  supercup:{aktiv:true,doubleGegen:'vize',elfmeterDirekt:true,praemie:500000},
  laenderspiele:{schwelle:{oben:88,jeRang:0.5,min:62},kader:26,formMin:7,praxisMin:40,frische:[10,20],belastung:2,verletzung:0.03,sv:0.3},
  turnierJahre:[2028,2030],
  verlegung:{abgestellteAb:3,krankeAb:5,genehmigt:0.6,entscheidungTage:[2,4]},
  spielplan:{mindestStunden:72,maxHeimInFolge:2},
  zweite:{mindestensEineLigaTiefer:true}
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Supercup** kommt dazu, weil er klein ist und den Saisonstart belebt.
2. **Pokal-Heimrecht** für Unterklassige bis einschließlich Halbfinale (für Runde 1 belegt, spätere Runden prüfen).
3. **Spielverlegung ab 3 Abgestellten** als Spielwert (echte Schwelle nicht gefunden).
4. **Zweitmannschaft muss absteigen,** wenn die erste in ihre Liga fällt (echte Regel prüfen).
5. **Nationen-Tabelle** als neue Datei, grob nach Weltrangliste, gepflegt wie die anderen Stammdaten.

**Vorläufig entschieden bei der Umsetzung (U7c, 9. November 2026):**
6. **Pokal-Auslosung nach den echten Töpfen:** In Runde 1 kommen die 18 Erstligisten und die 14 besten Zweitligisten der Vorsaison in den Profitopf, alle anderen in den Amateurtopf mit Heimrecht. Ab Runde 2 bis zum Halbfinale werden zuerst Amateure (3. Liga und darunter) gegen Profis gelost, die Amateure spielen zu Hause, die übrigen Paarungen kommen aus einem Topf. Für Runde 1 und 2 ist das belegt (diefalsche9.de), für Achtelfinale bis Halbfinale nicht: Die Quellen sagen „ein Topf, der Erstgezogene hat Heimrecht“. Das Heimrecht der Amateure bis zum Halbfinale bleibt also eine Annahme (Nr. 2).
7. **Auslosung als Halt:** 14 Tage vor der Runde, frühestens am Tag nach der Vorrunde. Im Büro steht eine Karte mit allen Paarungen, deine hervorgehoben, dazu eine Nachricht. Gezogene Kugeln als Animation gibt es noch nicht.
8. **72 Stunden:** Nach der Auslosung verlegt die Liga Spiele der Pokalteilnehmer, die weniger als drei Tage vor oder nach der Runde liegen (Sonntag → Samstag davor), mit Nachricht an dich. Der Pokal spielt vorläufig an einem Tag je Runde, nicht an Dienstag und Mittwoch. **Seit 22.11. (popolupo, T8.2):** Wer in den fünf Tagen vor einer Runde im Europapokal spielt, spielt mit seinem Gegner einen Tag später (Mittwoch, in Runde 1 Sonntag), wie beim DFB. Seit 22.11. verlegt die Liga außerdem mit Blick auf alle Spiele beider Vereine und nie auf einen Montag (`ligaVerlegen`). In den erzeugten Folgesaisons repariert der Spielplan-Generator englische Wochen (Dienstag → Mittwoch, Freitag → Samstag, sonst das Spiel davor nach vorn). Ergebnis: kein Verein spielt zweimal innerhalb von drei Tagen.
9. **Relegation:** Das Rückspiel hat bei Gleichstand in der Summe Verlängerung und Elfmeterschießen aus der Engine, auch live. Das Los bleibt nur für alte Spielstände. Echt setzt sich der Bundesligist seit 2009 in etwa 80 % durch (13 von 16 bis 2024, Sky), im Spiel sind es etwa 50 %, weil der 16. der 1. Liga und der 3. der 2. Liga in unserer Welt fast gleich stark sind (Konsistenzprüfung AI5).
10. **Supercup** ab der zweiten Saison (für die erste fehlt die Vorsaison im Spiel): Meister gegen Pokalsieger am Samstag vor dem 1. Spieltag beim Meister, sonst gegen den Vizemeister, wie 2024 Leverkusen gegen Stuttgart. Bei Gleichstand direkt Elfmeterschießen, seit 2010 gibt es keine Verlängerung. Karten und Sperren zählen wie im Pokal, Tore nicht zur Torjägerliste. Noch ohne Prämie (K23).
11. **Zweitmannschaften:** Spielt die erste Mannschaft in derselben Liga, muss die Zweite eine Liga tiefer, und der beste Absteiger dieser Liga bleibt drin. Die echte Regel ist weiter nicht geprüft (Nr. 4).

**Nachtrag U9d (15. November 2026), Nr. 4 und 11 geprüft:** Laut Websuche (DFB-Portal und diefalsche9.de, Wortlaut der Spielordnung nicht gelesen) gilt: Zweite Mannschaften von Drittligisten dürfen nicht in der Regionalliga spielen, zwei Mannschaften eines Vereins nie in derselben Liga, die Zweite eines Erst- oder Zweitligisten darf in die 3. Liga. Beispiel: Düsseldorf II musste im Sommer 2026 nach dem Abstieg der ersten Mannschaft trotz Klassenerhalts in die Oberliga. Umgesetzt: Die Zweite deines Vereins (K08 §5.6) muss in die Oberliga, sobald die erste in der 3. Liga spielt. Hoffenheim II und Stuttgart II nehmen an der Aufstiegslosung der Regionalliga nur teil, wenn ihre erste Mannschaft in der 1. oder 2. Liga spielt. Im Regionalliga-Pool selbst bleiben sie, weil es im Spiel keine Oberliga gibt (vorläufig).
12. **Länderspiele:** Seit U9b (11.11.) haben alle Spieler eine Nationalität, und die Nationen-Tabelle mit dem Rang der Weltrangliste vom 7. Oktober 2026 liegt in `daten/nationen.js` (K32 §12 Nr. 17). **Nominierung, Abstellung und Rückkehr seit K13f** (24.11.2026, popolupo, ohne Testlauf, vorläufig, **Schalter aus**: `REGELN.wettbewerbe.laenderspiele.an = false`, weil Abwesenheit, Müdigkeit und Verletzungen alle Vereine treffen; erst messen): Am ersten Tag jeder Länderspielpause nominiert jede Nation ihre bis zu 26 Stärksten ab der Schwelle aus §5.1 (88 − 0,5 × (Rang − 1), mindestens 62), gezählt über die deutschen Vereine und den Auslandspool; wer höchstens 3 über der Schwelle liegt, braucht Form ab 7 und Spielpraxis ab 40. Markiert werden die Spieler deutscher Vereine (`p.lsp`), sie fehlen bis zum letzten Tag der Pause und sind am Tag danach zurück (`avail`, kein Vereinstraining, in der 3. Liga auch in deren Spielen; seit Prüfung FM1, vorher fehlten sie am Freitag nach der Pause, wenn die 1. und 2. Liga schon wieder spielen). Seit FM2 zählt der Auslandspool (`S.ausland.pl`) bei der Rangfolge wirklich mit. Seit FM10 zählt ein Länderspiel erst ab 10 Minuten, die Frische sinkt nach den Minuten, die Saisonbelastung höchstens bis 100. Je Pause zwei Länderspiele, in der langen Pause im September und Oktober vier. Rückkehr mit eigenem Strom: die elf Stärksten je Nation spielen 90 Minuten, die anderen 0 bis 30; wer gespielt hat, verliert 10 bis 20 Frische, trägt 2 Saisonbelastung je Spiel, verletzt sich mit 3 % und hat Selbstvertrauen ± 0,3; alle Stimmung +2. Bei dir Meldungen zur Abreise und Rückkehr, die Spielerkarte zeigt „bei der Nationalmannschaft“. Spielverlegung auf Antrag (K13d) auch, wenn mindestens 3 deiner Spieler abgestellt sind. Gilt für deinen Verein wie für Computer-Vereine (Gleichschritt). Seit K02a im Menü je Spielstand einschaltbar, die Karten „Anruf des Nationaltrainers“ und „Verletzt zurück“ seit K13g (§8). Marktwert + seit K13h (25.11.2026, popolupo, ohne Testlauf, vorläufig): bis 365 Tage nach der letzten Nominierung ist ein Nationalspieler 5 % mehr wert (`p.lspZ`, `REGELN.wettbewerbe.laenderspiele.marktwert`), nur mit Länderspielen. Noch nicht: Turniere im Sommer, Bankzeit vor Turnieren (K14). Ebenfalls offen: Rotation der Favoriten in Runde 1 und 2, Pokal an Dienstag und Mittwoch (die Spielverlegung auf Antrag gibt es seit K13d; berichtigt am 24.11.2026). Prämien für den Supercup seit K13b (22.11.2026, ohne Testlauf): 3 Mio. € für den Sieger, 2 Mio. € für den Verlierer (Franz-Beckenbauer-Supercup 2025, Websuche 22.11. nach Medienberichten, z. B. [Stuttgarter Zeitung](https://www.stuttgarter-zeitung.de/sport/vfb-stuttgart/vfb-stuttgart-nach-pokalsieg-so-laeuft-der-supercup-gegen-den-fc-bayern-79005957.html), [ZDF](https://www.zdfheute.de/sport/fussball-franz-beckenbauer-supercup-faq-100.html)), für alle Teilnehmer.
13. **Lernstufen (K36):** Pokal, Relegation und Supercup laufen ab Stufe 1 (nur Termine und Ergebnisse). Die Auslosung ist ab Stufe 1 ein Moment. Spielverlegung beantragen gibt es seit K13d (23.11.2026, popolupo, ohne Testlauf) auf Stufe 4 (Bereich `verlegung`, ohne Automatik): für dein nächstes Ligaspiel in höchstens 7 Tagen, wenn weniger als 16 Spieler einsatzfähig sind oder kein Torwart (wie die Regel der DFL aus der Corona-Zeit, vorläufig), einmal je Saison. Den neuen Termin sucht die Liga wie bei den übrigen Verlegungen: drei Tage Abstand zu allen Spielen beider Vereine, kein Montag, vor dem letzten Spieltag. Seit Prüfung EI auch vor dem nächsten Ligaspiel beider Vereine und mit drei Tagen Abstand zu deinen Testspielen; die Lage sucht das nächste Ligaspiel in 7 Tagen, auch wenn vorher ein Pokal- oder Europapokalspiel kommt.

**Noch zu recherchieren:** Heimrecht in späteren Pokalrunden, Supercup-Regeln, Schwelle für Spielverlegungen, echte Pokalprämien 2026/27.

## Quellen

- Pokal-Heimrecht für die 3. Liga und darunter, kein Tausch: [DFB: Modus DFB-Pokal](https://www.dfb.de/dfb-pokal/modus/?m=1%2F), [DFB: Drittligisten im Pokal](https://www.dfb.de/news/drittligisten-im-pokalviertelfinale-acht-kamen-durch), [90min.de: Heimrechttausch](https://www.90min.de/posts/bremer-sv-fc-bayern-dfb-pokal-heimrechttausch-allianz-arena)
- Relegation ohne Auswärtstorregel, Verlängerung und Elfmeterschießen: [90min.de: Auf- und Abstieg, Relegation](https://www.90min.de/posts/wie-funktioniert-auf-und-abstieg-bundesliga-kompletter-guide-relegation), [goal.com](https://www.goal.com/de/meldungen/auswaertstorregel-relegation-bundesliga/blt953aebc755051094)
- Spielverlegungen in der 3. Liga nach § 34 der Spielordnung: [DFB: Zwei Spiele in der 3. Liga verlegt](https://www.dfb.de/news/detail/zwei-spiele-in-der-3-liga-verlegt-255515/)
- Töpfe und Heimrecht in Runde 1 und 2: [diefalsche9.de: Die Töpfe für die DFB-Pokal-Auslosung](https://www.diefalsche9.de/das-sind-die-toepfe-fuer-die-dfb-pokal-auslosung/), ab dem Achtelfinale ein Topf: [90min.de: Auslosung ab dem Achtelfinale](https://www.90min.de/dfb-pokal-auslosung-termine-und-was-sich-ab-dem-achtelfinale-andert) (U7c)
- Supercup ohne Verlängerung seit 2010, 2024 Double-Sieger gegen Vizemeister: [bundesliga.com: Supercup-Historie](https://www.bundesliga.com/de/bundesliga/news/supercup-historie-rekorde-alle-spiele-tore-meister-pokalsieger-5786), [zdfheute: Leverkusen gegen Stuttgart](https://www.zdfheute.de/sport/fussball-dfl-supercup-bayer-leverkusen-vfb-stuttgart-100.html)
- Relegation, Bundesligist 13 von 16 seit 2009: [Sky](https://sport.sky.de/fussball/artikel/relegation-zur-bundesliga-statistik-spricht-gegen-die-sv-elversberg/13370848/33895)
- Pokal-Auslosung, 72 Stunden, Spielverlegung bei Abstellungen: `konzepte/_recherche-genre.md`, Abschnitte 4 und 4b
