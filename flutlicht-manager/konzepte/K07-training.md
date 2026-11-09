# K07 – Training

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K03 (Spielermodell), K06 (Taktik), K01 (Kalender) · Wird gebraucht von: K08, K10, K11, K12a, K16, K31.

**Umsetzungshinweise (U6a, 8. November 2026):** Training nach Abstand zum Spiel mit fünf Vorlagen (`js/training.js`, Werte in `REGELN.training`), Belastung und Belastungssprung, Kondition und Entwicklung aus dem Wochenreiz, Vertrautheit aus Taktik-Einheiten, Spielvorbereitung und Standards wirken im nächsten Spiel, Trainingsverletzungen für alle Vereine, Trainingsspiel für Reservisten, Umschulung. Die Trainingsstufe (locker, normal, hart) ist entfallen. Tests: `tests/training.js` und die Einzelrechnungen in `tests/spielermodell.js`. Abweichungen in §12 unter U6a.

## 1. Ziel und Spielgefühl

- **Training wirkt spürbar, aber kalibriert.** Die Lehre aus dem frühen Anstoss 2022: Training und Werte waren schlecht ausbalanciert, Tester ließen den Co-Trainer machen und ignorierten Fitness und Frische, weil es nichts bewirkte (Recherche 4). Bei uns muss man den Unterschied sehen: in Frische, Kondition, Lernfortschritt, Vertrautheit und Verletzungen.
- **Einfach zu bedienen:** Ein Wochenplan aus Vorlagen, der sich selbst an den Spielplan anpasst. Wer nicht will, lässt den Co-Trainer planen.
- **Echte Abwägung:** Mehr Belastung bringt Kondition und Entwicklung, kostet Frische und erhöht das Verletzungsrisiko, besonders bei plötzlichen Belastungssprüngen.
- **Einzelne fördern:** Lernziele (Merkmale) und Umschulungen auf neue Positionen.

## 2. Vorbilder und Abgrenzung

- **Football Manager:** Wochenpläne aus Einheiten, Intensität als Kompromiss zwischen Entwicklung und Verletzungen, typischer Rhythmus „Tag nach dem Spiel Regeneration, Mitte der Woche Vorbereitung, Tag vor dem Spiel locker“ (Recherche 3.1).
- **Profi-Praxis:** Die Tagesbelastung sinkt, je näher der Spieltag rückt, unabhängig davon, ob zwischen zwei Spielen drei, vier oder fünf Tage liegen. Am Tag nach dem Spiel (MD+1) regenerieren die Startspieler, während Nicht-Eingesetzte oft einen Ausgleichsreiz bekommen (Quellen).
- **Bundesliga Manager Hattrick:** Übungsarten, individuelle Pläne, Trainingslager (Recherche 2.1).
- **Anstoss 3:** Konditionstraining kurz vor dem Spiel macht die Mannschaft früher müde. Lernen wird gebremst durch Verletzung, Urlaub, fehlendes Training und gleichzeitiges Lernen (PLAN §4).
- **Bewusst anders:** Der Plan hängt am **Abstand zum Spiel**, nicht am Wochentag. Unsere Spieltage liegen über das Wochenende verteilt (PLAN §2), dazu englische Wochen. Ein Plan nach Wochentagen würde ständig falsch liegen.

## 3. Begriffe und Daten

### 3.1 Einheiten

| Einheit | wirkt auf | Frische (normal) |
|---|---|---|
| Regeneration | Frische +4 statt Verlust, Verletzungsrisiko am Folgetag kleiner | +4 |
| Kondition | Kondition (doppelt), Entwicklung wenig | −4 |
| Technik und Spielformen | Entwicklung, Lernziele | −2 |
| Taktik | Vertrautheit mit Stil und Ordnung (K06) | −2 |
| Standards | Standardgefahr im nächsten Spiel, Lernziele für Standard-Merkmale | −1 |
| Spielvorbereitung | Vertrautheit mit dem aktuellen Stil, kleiner Bonus gegen den nächsten Gegner | −1 |
| Trainingsspiel | Spielpraxis für alle, die mitspielen (Community-Wunsch) | −5 |
| frei | nichts | 0, Erholung wie Ruhetag |

- **Intensität** je Einheit: leicht (×0,5 Wirkung, ×0,5 Frischeverlust, ×0,5 Risiko), normal (×1), hoch (×1,3 Wirkung, ×1,5 Frischeverlust, ×2 Risiko).
- Die Frischewerte ersetzen die Trainingsstufen-Kosten aus K03 §5.3 (1, 2 oder 3 pro Tag). Erholung pro Tag bleibt wie in K03.
- **Torhüter** trainieren parallel mit dem Torwarttrainer (K16). Sie folgen dem Plan nur bei Kondition, Regeneration und Trainingsspiel.

### 3.2 Wochenplan nach Abstand zum Spiel

Der Plan ist eine Tabelle **„Tage bis zum nächsten Spiel / Tage seit dem letzten Spiel“ → Einheit und Intensität**. Das Spiel legt jeden Tag automatisch fest, welche Zeile gilt.

**Vorlagen** (Start):

| Vorlage | MD+1 | MD+2 | mittlere Tage | MD-2 | MD-1 |
|---|---|---|---|---|---|
| Standardwoche | Regeneration (Startspieler), Trainingsspiel leicht (Rest) | frei | Kondition normal, Technik normal, Taktik normal | Taktik normal | Spielvorbereitung leicht |
| Englische Woche | Regeneration | Taktik leicht | – | – | Spielvorbereitung leicht |
| Aufbau (Länderspielpause, Winter) | frei | Kondition normal | Kondition hoch, Technik normal, Trainingsspiel normal | Taktik normal | Spielvorbereitung leicht |
| Vorbereitung (K12a) | – | – | Woche 1 Kondition normal, Woche 2–3 hoch mit Doppeleinheiten, Woche 4–5 Taktik und Testspiele | – | – |
| Schonen | Regeneration | frei | Technik leicht, Taktik leicht | Taktik leicht | Spielvorbereitung leicht |

- Liegen zwischen zwei Spielen nur zwei Tage, entfallen die „mittleren Tage“ und MD-2. Bei drei Tagen entfallen die mittleren Tage.
- **Doppeleinheiten** nur in der Vorbereitung und in Pausen ohne Pflichtspiel.
- Du kannst jede Vorlage ändern und eigene speichern.

### 3.3 Einzeltraining

- **Lernziele** (K03 §5.6): Ein Spieler lernt ein Merkmal, zwei gleichzeitig nur halb so schnell.
- **Umschulung:** Ein Spieler lernt eine neue Position. Die Eignung steigt pro Woche um 4 Punkte bei verwandten Positionen (Startwert mindestens 75 %) und um 2 Punkte bei fremden, bis höchstens 90 % (mit „vielseitig“ 95 %). Einsätze auf der neuen Position zählen wie eine Trainingswoche zusätzlich.
- **Plätze:** Wie viele Spieler gleichzeitig Einzeltraining haben, hängt vom Stab ab (K16). Bis dahin 5 Plätze im Kader.
- Gespeichert am Spieler: Lernziele `ls` (K03), trainierte Eignungen `eig = {Position: Wert}`.

### 3.4 Belastung

- **Last eines Tages** = Frischeverlust aus Training und Spiel.
- **Akute Last** = Summe der letzten 7 Tage. **Chronische Last** = Wochenschnitt der letzten 28 Tage.
- **Belastungssprung** = akute Last / chronische Last. Gespeichert wird nur die Tageslast der letzten 28 Tage je Spieler (`last`), das Verhältnis wird berechnet.

## 4. Abläufe

1. **Jeden Tag** (in „Tag beenden“, auch an übersprungenen Tagen): Für jeden Spieler die Einheit des Tages nach Plan, Abstand zum Spiel und Status (verletzt, Urlaub, Länderspiel → kein Training). Frische, Last, Kondition, Lernen und Vertrautheit fortschreiben. Verletzungsrisiko würfeln (Tag-Strom „training“, K02).
2. **Startspieler und Rest:** Am Tag nach dem Spiel bekommen Spieler mit mindestens 60 Minuten Regeneration, die übrigen die Rest-Einheit der Vorlage.
3. **Wochenbericht** (Montag, mit K03 zusammen): Belastung der Woche, Verletzungen, Lernfortschritte, Vertrautheit. Warnung bei Belastungssprüngen.
4. **Erinnerung vor „Tag beenden“** (K01, H9): nicht mehr „kein Trainingsplan“, denn es gibt immer eine Vorlage. Stattdessen **„Plan passt nicht“**: harte Einheit am Tag vor einem Spiel, englische Woche mit der Standardwoche, viele Spieler mit Belastungssprung über 1,5. Abschaltbar.

## 5. Regeln und Formeln

### 5.1 Kondition

Ersetzt das feste Ziel je Trainingsstufe aus K03 §5.3:

```
Wochenreiz  = Summe der Einheiten der letzten 7 Tage × Intensität (Kondition zählt doppelt, Regeneration und frei 0)
Konditionsziel = 58 + 4 × Wochenreiz, höchstens 95, ab 30 Jahren je Jahr 1 weniger, „Partylöwe“ 8 weniger
```

- Die Kondition wandert wie in K03 pro Woche um 20 % zum Ziel.
- Standardwoche mit einem Spiel: Wochenreiz etwa 5–6 → Ziel 78–82. Aufbauwoche mit Konditionsschwerpunkt etwa 8 → Ziel 90. Schonwoche etwa 2,5 → Ziel 68.

### 5.2 Entwicklung

- Der **Trainingsfaktor** in K03 §5.1 (bisher 0,8 / 1 / 1,2) wird aus dem Entwicklungsreiz der Woche berechnet: Einheiten Technik und Spielformen, Taktik und Standards, mit Intensität, auf einer Skala von 0,8 (fast kein Training) bis 1,25 (viel und intensiv).
- Liegt die Frische eines Spielers unter 70 %, zählt sein Reiz nur zu 80 % (wer platt ist, lernt schlechter).
- **Folge:** In englischen Wochen ruht die Entwicklung fast. Das ist gewollt und entspricht der Erfahrung aus dem FM (Recherche 3.1).

### 5.3 Lernen und Taktik

- **Lernziele** wachsen nur in Wochen mit mindestens drei Trainingstagen. Sonst gilt die Woche als „ohne Training“ (K03 §5.6). Einheiten Technik und Standards erhöhen das Lerntempo ihrer passenden Merkmale um 20 %.
- **Vertrautheit** (K06 §5.4): Taktik-Einheit normal +2, hoch +3, Spielvorbereitung +1. Das ersetzt die pauschalen +5 pro Woche aus K06. Mit zwei Taktik-Einheiten und einem Spiel pro Woche dauert der Weg von 30 auf 80 etwa sieben Wochen.
- **Spielvorbereitung** am Tag MD-1 oder MD-2: Teamwerte +1 % im nächsten Spiel, +2 %, wenn die Gegneranalyse (K18) vorliegt.
- **Standards:** mindestens eine Standard-Einheit in den letzten 7 Tagen → Torwahrscheinlichkeit nach eigenen Ecken und Freistoßflanken ×1,05 im nächsten Spiel.

### 5.4 Verletzungen im Training

```
Risiko je Spieler und Einheit = 0,0015 × Intensität (0,5 / 1 / 2) × Sprungfaktor × Frischefaktor × Robustheit (K03)
Sprungfaktor   = 1 bis 1,3, dann +1,5 je 0,1 über 1,3 (bei 1,5 also 4)
Frischefaktor  = 1 über 80 %, darunter +5 % je Punkt
```

- **Warum der Sprung und nicht ein „optimaler Bereich“?** Die verbreitete Idee eines sicheren Bereichs von 0,8–1,3 hat sich in der einzigen direkten Prüfung im Fußball nicht bestätigt. Ein erhöhtes Risiko bei Werten über etwa 1,5 ist besser gestützt (Quellen). Wir bestrafen also Sprünge, belohnen aber keinen bestimmten Bereich.
- **Folge für die Vorbereitung:** Wer nach dem Urlaub sofort hart trainiert, macht einen großen Sprung, weil die chronische Last im Urlaub gegen null gefallen ist. Das erklärt die Klage „Verletzungskrise schon in der Vorbereitung“ (Recherche 4b) und macht langsames Steigern zur klugen Entscheidung.
- Verletzungsart und Dauer kommen aus K10. Bis dahin gelten die heutigen Werte (1–3 Wochen).

### 5.5 Trainingsspiel

- Alle, die mitspielen, bekommen Spielpraxis wie ein Drittel eines Pflichtspiels (K03 §5.4) und Frischeverlust wie ein Drittel.
- Kein Lernen im Spiel (K03 §5.6), keine Noten, aber ein kleines Verletzungsrisiko wie bei hoher Intensität.

### 5.6 Trainer

- Bis K16 arbeitet ein Standard-Co-Trainer (Faktor 1). Mit K16 multipliziert seine Qualität Lerntempo, Umschulung und Vertrautheit (0,85–1,15) und bestimmt die Zahl der Einzeltrainingsplätze.
- Der **Athletiktrainer** (K16) senkt das Verletzungsrisiko im Training um bis zu 20 %, der **Torwarttrainer** steuert das Lernen der Torhüter.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Vorlage wählen oder anpassen | Kondition, Entwicklung, Vertrautheit | Frische, Verletzungsrisiko |
| Intensität | schnellerer Fortschritt | doppeltes Risiko, Belastungssprünge |
| Regeneration einplanen | Frische, weniger Verletzungen | weniger Fortschritt |
| Trainingsspiel | Spielpraxis für Reservisten | Frische, kleines Risiko |
| Lernziele | Merkmale | Einzeltrainingsplätze |
| Umschulung | neue Position | Wochen, ein Platz belegt |
| Vorbereitung langsam steigern | weniger Verletzungen | etwas weniger Kondition zum Start |
| Automatik | spart Zeit | so gut wie der Co-Trainer (K16) |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln. Sie nutzen die Vorlagen passend zum Spielplan: Standardwoche, englische Woche, Aufbau, Vorbereitung.
- **Vereinsprofil** (K31) verschiebt die Intensität: ein „Malocher-Verein“ trainiert härter, ein Ausbildungsverein mehr Technik.
- **Lernziele** nach Position und Spielstil (K03 §7). **Umschulung** nur bei Mangel auf einer Position.
- Die **Klugheitsstufe** (K02) bestimmt, wie gut sie Belastungssprünge vermeiden.

## 8. Ereignisse

| Karte oder Meldung | Auslöser | Folge |
|---|---|---|
| Spieler bittet um Pause (Entscheidung) | Frische unter 65 % über eine Woche, Professionalität hoch | Pause: Frische, aber weniger Spielpraxis. Weiter: Risiko. |
| Rangelei im Training | Hitzkopf, Rivalität (K14), hohe Intensität | kleine Verletzung möglich, Stimmung (K14) |
| Trainingsweltmeister übertreibt | aus K03 §8 | kleine Verletzung oder Lob |
| Verletzungsserie | drei oder mehr Trainingsverletzungen in zwei Wochen | Hinweis des Arztes auf Belastungssprünge (K10, K16) |
| Lernziel erreicht | aus K03 | Info, Erinnerung „Lernplatz frei“ |
| Umschulung abgeschlossen | Eignung 90 % | Info |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | Frische, Kondition, Entwicklung, Lernen, Spielpraxis. K07 ersetzt dort die Trainingsstufe. |
| K06 Taktik | Vertrautheit aus Taktik-Einheiten und Spielvorbereitung |
| K08 Jugend | Jugendliche entwickeln sich vor allem im Training (Faustregel „erst Training, dann Spiele“) |
| K10 Medizin | Verletzungsarten und Dauer, Rückkehr mit Belastungsaufbau |
| K11 Testspiele, Trainingslager | Trainingslager als Block mit besonderen Einheiten |
| K12a Sommer | Vorlage „Vorbereitung“, Leistungstests, Urlaubslänge |
| K13 Spielplan | Abstand zwischen Spielen bestimmt die Vorlage |
| K16 Stab | Qualität, Einzeltrainingsplätze, Automatik, Athletik- und Torwarttrainer |
| K31 Computer-Vereine | Vorlagen und Intensität nach Profil |
| K35a Oberfläche | Wochenplan als Leiste nach Abstand zum Spiel, Belastungsanzeige je Spieler (Regler mit Zonen) |

## 10. Zielwerte und Tests

Testskript: Teil von `tests/spielermodell.js` und `tests/akzeptanz.js`.

| Prüfung | Ziel |
|---|---|
| Training wirkt | Ein Team mit gut gewähltem Plan holt über eine Saison 2–5 Punkte mehr als eines mit „Schonen“ das ganze Jahr |
| Automatik | Ein Standard-Co-Trainer erreicht mindestens 85 % der Punkte-Wirkung des besten Plans. Wer selbst plant, gewinnt etwas, wer es lässt, verliert nicht viel. |
| Dauerhaft hart | Gesamtbilanz über eine Saison höchstens leicht positiv (K03 §10) |
| Englische Wochen | Entwicklung in Wochen mit zwei Spielen mindestens 30 % langsamer als in normalen Wochen |
| Vorbereitung | Sofort hart nach dem Urlaub: mindestens 1,5-mal so viele Trainingsverletzungen in den ersten drei Wochen wie bei langsamem Steigern |
| Kondition | Standardwoche hält sie bei 78–82, Aufbauwoche hebt sie Richtung 90 (K03 §10) |
| Vertrautheit | 30 → 80 in 6–8 Wochen mit zwei Taktik-Einheiten pro Woche |
| Umschulung | verwandte Position von 75 auf 90 % in etwa vier Wochen, fremde von 60 auf 90 % in etwa 15 Wochen |
| Verletzungen im Training | Anteil an allen Verletzungen 40–55 % (abgeleitet in K10 §10, prüfen) |

## 11. Stellschrauben

```js
training:{
  einheiten:{regeneration:{frische:4},kondition:{frische:-4,kondition:2,entwicklung:0.3},technik:{frische:-2,entwicklung:1,lernen:0.2},
    taktik:{frische:-2,vertrautheit:2,entwicklung:0.6},standards:{frische:-1,standards:1.05,lernen:0.2},
    vorbereitung:{frische:-1,vertrautheit:1,bonus:0.01,bonusAnalyse:0.02},spiel:{frische:-5,praxis:1/3},frei:{}},
  intensitaet:{leicht:{wirkung:0.5,frische:0.5,risiko:0.5},normal:{wirkung:1,frische:1,risiko:1},hoch:{wirkung:1.3,frische:1.5,risiko:2}},
  vorlagen:{ /* Standardwoche, Englische Woche, Aufbau, Vorbereitung, Schonen nach 3.2 */ },
  startVorlage:'standard',
  kondition:{basis:58,jeReiz:4,max:95},
  entwicklung:{min:0.8,max:1.25,frischeUnter:70,frischeFaktor:0.8},
  lernen:{mindestTage:3},
  umschulung:{verwandt:4,fremd:2,verwandtAb:75,max:90,maxVielseitig:95,einsatzWoche:1},
  einzelPlaetze:5,
  verletzung:{basis:0.0015,sprungAb:1.3,sprungJe01:1.5,frischeAb:80,frischeJePunkt:0.05},
  last:{akutTage:7,chronischTage:28},
  computerVorlagen:true
}
```

`training.entwicklung` (Stufenfaktoren), `fitnessGrenze`, `erholung`, `abbau`, `computerStufe` und `verletzung` aus der heutigen `regeln.js` fallen weg. Die Trainingsstufe (locker, normal, hart) verschwindet aus dem Menü, sobald die Wochenpläne gebaut sind.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache, bitte bei Gelegenheit bestätigen oder ändern):

1. **Plan nach Abstand zum Spiel** statt nach Wochentagen. Grund: Spieltage über das Wochenende verteilt und englische Wochen.
2. **Eine Einheit pro Tag,** Doppeleinheiten nur in Vorbereitung und Pausen.
3. **Belastungssprung** als Verletzungsursache, kein „optimaler Bereich“ (Studienlage, siehe 5.4).
4. **Fünf Einzeltrainingsplätze** bis zum Trainerstab (K16).
5. **Trainingsspiel** als eigene Einheit, weil es Reservisten Spielpraxis gibt und in der Community gewünscht wird.

**Vorläufig entschieden bei der Umsetzung (U6a, 8. November 2026):**
6. **Belastung als gleitendes Mittel** über 7 und 28 Tage (zwei Zahlen je Spieler) statt 28 einzelner Tageswerte. Gewohnte Last mindestens 2 pro Tag, sonst wäre nach dem Urlaub jeder erste Trainingstag ein riesiger Sprung (Risiko ×35).
7. **Regeneration** bringt netto +1 Frische. „+4 statt Verlust“ ist als Unterschied zu einer normalen Einheit gelesen. Dazu Grunderholung 2,1 statt 3 pro Tag: Sonst waren Spieler nach drei Spielen in acht Tagen wieder bei 86 % statt 72–82 %. Die Standardwoche endet dadurch bei etwa 97 % Frische vor dem Spiel (statt 100 %), das kostet unter 1 % Stärke für alle gleich.
8. **Standardwoche** mit den mittleren Tagen Taktik, Kondition, Technik (in dieser Reihenfolge). Bei sieben Tagen Abstand bleiben zwei mittlere Tage, so gibt es zwei Taktik-Einheiten wie in 5.3 vorgesehen. Der Entwicklungsreiz dieser Woche (1,5) ist der Normalwert (Faktor 1), die Spanne 0,5 bis 1,25.
9. **Kondition wirkt stärker auf die Ermüdung** (im Spiel und nach dem Spiel): Kondition 68 ermüdet etwa 25 % schneller als 84. Vorher brachte Training gegenüber „Schonen“ kaum etwas.
10. **Trainingsverletzungen:** Grundrate 0,00029 je Einheit, damit 40–55 % aller Verletzungen im Training passieren. Das passt zur UEFA-Studie (Spiel 27,5, Training 4,1 Verletzungen je 1000 Stunden) bei üblichen Trainings- und Spielstunden.
11. **„Training wirkt“ wird über die Wirkung geprüft** (Startelf stärker, Kondition höher, nicht mehr Ausfälle), nicht über Punkte: Punkte schwanken über wenige Saisons um ±7 je Saison. Gemessen: Startelf +0,4 bis +0,5 stärker als mit „Schonen“, also etwa +1 Punkt im ersten Jahr und mehr danach.
12. **Vorbereitung** als Vorlage mit vier Wochen (normal, hart, hart, Taktik). Der Co-Trainer nutzt sie bis zum ersten Pflichtspiel. Doppeleinheiten, Leistungstests und Testspiele kommen mit K11 und K12a.
13. **Umschulung** belegt einen der fünf Einzeltrainingsplätze. Verwandt heißt: Eignung ohne Fußabzug mindestens 75 %. Der Fuß bleibt nach der Umschulung ein Nachteil (außer bei beidfüßigen).
14. **Noch nicht gebaut:** eigene Vorlagen speichern, Erinnerung „Plan passt nicht“, Ereignisse aus §8, eigenes Torwarttraining (K16), Bonus +2 % mit Gegneranalyse (K18).

**Recherchiert:** Anteil der Trainingsverletzungen siehe Nr. 10.

## Quellen

- Belastung im Mikrozyklus, MD+1 und MD-1: [IAT-Datenbank: Three-, four- and five-day microcycles in professional football](https://lida.sport-iat.de/ta/Record/4093698?lng=de), [VBG: Periodisierung des Athletiktrainings im Wochenverlauf (PDF)](https://cdn.vbg.de/media/28868574914f4a79b028fe7c27afad8b/dld:attachment/Periodisierung%20des%20Athletiktrainings%20im%20Wochenverlauf%2005.04.2025_VBG%20Handout.pdf)
- Belastungsverhältnis und Verletzungen: [Frontiers in Physiology, Editorial: Acute:Chronic Workload Ratio – Is There Scientific Evidence? (2021)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8138569/), [Frontiers in Physiology, Sedeaud et al. (2020)](https://www.frontiersin.org/article/10.3389/fphys.2020.01034/full)
- Training in FM und Anstoss, Verletzungskrise in der Vorbereitung: `konzepte/_recherche-genre.md`, Abschnitte 3.1, 4, 4b
- Lernbremsen, Konditionstraining vor dem Spiel: PLAN §4 (GameStar 4/2000)
- Verletzungsraten in Spiel und Training: [Ekstrand u. a., UEFA Elite Club Injury Study (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8458074)
