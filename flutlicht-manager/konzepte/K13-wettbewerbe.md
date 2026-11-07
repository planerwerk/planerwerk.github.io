# K13 – Wettbewerbe und Spielplan

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K01 (Kalender), K32a (Unterbau), K04/K05 (Verlängerung, Elfmeterschießen) · Wird gebraucht von: K07, K09, K10, K11, K12a, K23, K28.

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
| Europapokal | – | später | – |

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
- **Neu:** Steigt die erste Mannschaft in die Liga ihrer Zweitmannschaft ab, muss die Zweitmannschaft eine Liga tiefer (Konsistenzprüfung I5). Die echte Regel ist noch zu prüfen (Frage 4).

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
| Überraschungs-Aus | Bundesligist scheidet gegen Amateure aus | Presse, Vorstand (K28) |
| Pokal-Rotation rächt sich | Favorit rotiert und verliert | Spielbericht erwähnt es |

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

**Noch zu recherchieren:** Heimrecht in späteren Pokalrunden, Supercup-Regeln, Regel für Zweitmannschaften, Schwelle für Spielverlegungen, echte Pokalprämien 2026/27.

## Quellen

- Pokal-Heimrecht für die 3. Liga und darunter, kein Tausch: [DFB: Modus DFB-Pokal](https://www.dfb.de/dfb-pokal/modus/?m=1%2F), [DFB: Drittligisten im Pokal](https://www.dfb.de/news/drittligisten-im-pokalviertelfinale-acht-kamen-durch), [90min.de: Heimrechttausch](https://www.90min.de/posts/bremer-sv-fc-bayern-dfb-pokal-heimrechttausch-allianz-arena)
- Relegation ohne Auswärtstorregel, Verlängerung und Elfmeterschießen: [90min.de: Auf- und Abstieg, Relegation](https://www.90min.de/posts/wie-funktioniert-auf-und-abstieg-bundesliga-kompletter-guide-relegation), [goal.com](https://www.goal.com/de/meldungen/auswaertstorregel-relegation-bundesliga/blt953aebc755051094)
- Spielverlegungen in der 3. Liga nach § 34 der Spielordnung: [DFB: Zwei Spiele in der 3. Liga verlegt](https://www.dfb.de/news/detail/zwei-spiele-in-der-3-liga-verlegt-255515/)
- Pokal-Auslosung, 72 Stunden, Spielverlegung bei Abstellungen: `konzepte/_recherche-genre.md`, Abschnitte 4 und 4b
