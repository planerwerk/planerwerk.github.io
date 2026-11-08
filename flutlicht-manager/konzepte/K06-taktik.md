# K06 – Taktik

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K03 (Positionen, Merkmale, Fuß), K04 (Engine) · Wird gebraucht von: K05, K07, K14, K16, K18, K31, K35a.

**Umsetzungshinweise (U5a, 8. November 2026):** Spielstile mit Umsetzung und Kreislauf, Vertrautheit, Einstellung zum Spiel mit Kater, Rollen, Standardschützen und die Computer-Trainer aus §7 sind in der Engine (`js/taktik.js`, Werte in `REGELN.taktik`). Alle Prüfungen aus §10 laufen in `tests/taktik.js` und sind grün. Abweichungen in §12 unter U5a.

**Umsetzungshinweise (U5b):** Aufstellung mit Spielstil, Einstellung zum nächsten Spiel, Rollen am Platz, Standardschützen (Elfmeter 1–5, Freistöße, Ecken), Umsetzung und Vertrautheit als Anzeige, dazu wen der Stil schlägt und gegen wen er verliert. Im Vorbericht stehen die zuletzt gespielten Stile des Gegners, im Live-Spiel lässt sich der Stil ändern, mit Hinweis auf den Kreislauf. **U5 ist damit fertig.** Noch nicht gebaut: Ziehen und Ablegen auf dem Spielfeld (K35a), Kapitän (ohne Wirkung), Ereignisse aus §8.

## 1. Ziel und Spielgefühl

- **Taktik ist eine Entscheidung gegen diesen Gegner,** keine Einstellung, die man einmal richtig setzt und nie wieder anfasst.
- **Wenige, verständliche Hebel:** Grundordnung, Spielstil, Ausrichtung, Einsatz, Einstellung zum Spiel, Standardschützen. Tiefe entsteht aus dem Zusammenspiel mit dem Kader, nicht aus 40 Reglern („Tiefe bei hohem Tempo“, Recherche 5).
- **Der Kader muss zum Plan passen:** Pressing ohne Kondition und schnelle Spieler ist halbherzig. Ballbesitz ohne Spielmacher bleibt harmlos.
- **Kein Stil dominiert:** Die Community klagt über übermächtige Taktiken, mit denen man nach ein paar Saisons alles gewinnt (Recherche 4b). Bei uns schlägt jeder Stil einen anderen und verliert gegen einen dritten, und die Computer-Trainer reagieren auf das, was du immer spielst.

## 2. Vorbilder und Abgrenzung

- **Spielstil als Kreislauf** aus dem Rohmaterial (Kapitel 11): Pressing schlägt Ballbesitz, Ballbesitz schlägt Mauern, Mauern schlägt Konter, Konter schlägt Pressing.
- **Hattrick:** Einstellung „Spiel der Saison“ und „locker angehen“ mit Nachwirkung (Recherche 3.3). Übernommen, mit eigener Folge.
- **Football Manager 26:** eigene Ordnung mit und ohne Ball, viele Rollen. **Bewusst nicht übernommen,** weil es die Bedienung stark aufbläht. Wir bilden den Unterschied über Spielstil und Ausrichtung ab.
- **Anstoss:** Aufstellung per Ziehen und Ablegen, einfache Taktikwahl. Übernehmen wir für die Oberfläche (K35a).

## 3. Begriffe und Daten

### 3.1 Grundordnungen

Zehn Grundordnungen mit festen Plätzen. Plätze in eckigen Klammern haben eine **wählbare Rolle**: Mittelfeld-Mitte als DM, ZM, SM oder OM (höchstens ein Spielmacher), Sturm-Mitte als MS oder HS.

| Ordnung | Abwehr | Mittelfeld | Sturm |
|---|---|---|---|
| 4-4-2 | LV IV IV RV | LM [ZM] [ZM] RM | [MS] [MS] |
| 4-4-2 Raute | LV IV IV RV | [DM] [ZM] [ZM] [OM] | [MS] [MS] |
| 4-2-3-1 | LV IV IV RV | [DM] [DM] LA [OM] RA | MS |
| 4-3-3 | LV IV IV RV | [DM] [ZM] [ZM] | LA MS RA |
| 4-1-4-1 | LV IV IV RV | DM LM [ZM] [ZM] RM | MS |
| 4-2-2-2 | LV IV IV RV | [DM] [DM] [OM] [OM] | [MS] [MS] |
| 3-5-2 | IV IV IV | LS [DM] [ZM] [ZM] RS | [MS] [MS] |
| 3-4-3 | IV IV IV | LS [ZM] [ZM] RS | LA MS RA |
| 3-4-2-1 | IV IV IV | LS [ZM] [ZM] RS [OM] [OM] | MS |
| 5-3-2 | LV IV IV IV RV | [DM] [ZM] [ZM] | [MS] [MS] |

- **LS und RS** sind Schienenspieler (K03 §3.1a): Eignung ist die bessere aus Außenverteidiger und Flügel im Mittelfeld, Anteile an den Teamwerten der Mittelwert aus LV und LM.
- Die Liste deckt die heute üblichen Systeme ab. In der Premier League war 2024/25 das 4-2-3-1 die häufigste Grundordnung, das 3-4-2-1 legte zu (Quellen). Für die Bundesliga habe ich keine vollständige Auswertung gefunden.

### 3.2 Spielstile

| Stil | Idee | schlägt | verliert gegen |
|---|---|---|---|
| Pressing | früh angreifen, Ball hoch gewinnen | Ballbesitz | Konter |
| Ballbesitz | Ball laufen lassen, geduldig aufbauen | Mauern | Pressing |
| Mauern | tief stehen, Räume eng machen | Konter | Ballbesitz |
| Konter | Ball holen, schnell umschalten | Pressing | Mauern |
| Flügelspiel | über außen und Flanken | – (neutral) | – |
| ausgewogen | kein Schwerpunkt | – (neutral) | – |

### 3.3 Weitere Hebel

| Hebel | Stufen | Wirkt auf |
|---|---|---|
| **Ausrichtung** | sehr defensiv, defensiv, ausgewogen, offensiv, sehr offensiv | Angriff gegen Abwehr |
| **Einsatz** | fair, normal, hart (gibt es) | Zweikämpfe, Fouls, Karten, Verletzungen |
| **Einstellung zum Spiel** | locker angehen, normal, Spiel der Saison | Kraft heute gegen Kraft danach |
| **Standardschützen** | Elfmeter (Reihenfolge 1–5), direkte Freistöße, Ecken links, Ecken rechts | Standards in K04, Lernen im Spiel in K03 |
| **Kapitän** | ein Spieler | Kabine (K14), vorerst ohne Wirkung im Spiel |

### 3.4 Vertrautheit

- Je Mannschaft ein Wert **0–100 für jeden Spielstil** und **für jede Grundordnung**.
- Gespeichert am Verein: `t.vt = {stil:{…}, ordnung:{…}}`.
- **Start:** der bisherige Stil und die bisherige Ordnung 70, alles andere 30.

### 3.5 Taktik im Spielstand

```js
t.taktik = {ordnung:'4-2-3-1', rollen:{3:'DM',4:'SM',9:'MS'}, stil:'konter', ausrichtung:0, einsatz:'N',
            einstellung:'normal', schuetzen:{elfmeter:[id,id,id,id,id], freistoss:id, eckeL:id, eckeR:id}, kapitaen:id}
```

Die heutigen Felder `form`, `tac` und `ein` gehen darin auf.

## 4. Abläufe

1. **Vor dem Spiel:** Du siehst den Gegner unscharf: zuletzt gespielte Ordnungen und Stile, Stärke als Tauziehen (K35a). Mit Co-Trainer und Scout wird das genauer (K16, K18).
2. **Aufstellung:** Spieler auf Plätze ziehen, Rollen wählen, Eignung farbig sehen. Ohne Eingriff stellt die Automatik auf (Co-Trainer, K16).
3. **Anpfiff:** Die Engine liest Ordnung, Rollen und Stil und rechnet die Teamwerte mit Vertrautheit und Umsetzung (5.2).
4. **Im Spiel:** Stil, Ausrichtung, Einsatz und Ordnung lassen sich ändern (K05). Eine Umstellung wirkt über 5 Minuten zunehmend.
5. **Nach dem Spiel:** Vertrautheit steigt für den gespielten Stil und die gespielte Ordnung. „Spiel der Saison“ hinterlässt eine Woche Nachwirkung.
6. **Wöchentlich:** Vertrautheit durch Training steigt, ungenutzte Stile und Ordnungen verlieren etwas.

## 5. Regeln und Formeln

### 5.1 Was ein Stil an der Engine ändert

Multiplikatoren auf die Werte aus K04 §5 (Startwerte):

| Stil | Kontrolle | Angriffe/Min | Weg außen | eigene Konter | Konter gegen uns | Frische im Spiel | Fouls | Sonstiges |
|---|---|---|---|---|---|---|---|---|
| Pressing | ×1,05 | ×1,10 | – | ×1,30 | ×1,25 | ×1,30 | ×1,20 | etwas mehr Großchancen |
| Ballbesitz | ×1,12 | ×0,95 | – | ×0,70 | ×1,10 | ×0,95 | ×0,90 | mehr Halbchancen, weniger Fernschüsse |
| Mauern | ×0,85 | ×0,75 | – | ×0,90 | ×0,60 | ×0,90 | ×1,10 | Abwehr ×1,08 |
| Konter | ×0,90 | ×0,85 | – | ×1,60 | ×0,90 | ×1,05 | – | Konter öfter Großchance |
| Flügelspiel | – | – | +25 Prozentpunkte | – | – | – | – | mehr Kopfballchancen |
| ausgewogen | – | – | – | – | – | – | – | – |

**Umsetzung schwächt nur die Vorteile:** Die vorteilhaften Teile eines Stils wirken mit dem Anteil seiner Umsetzung (5.2), die Nachteile immer voll. Wer ohne passende Spieler presst, wird müde und konteranfällig, ohne viel zu gewinnen.

### 5.2 Umsetzung eines Stils

```
Umsetzung = 0,5 × Voraussetzungen + 0,5 × Vertrautheit/100      (0 bis 1)
```

**Voraussetzungen** (0 bis 1), aus K03 §9:

| Stil | Grundwert (Hälfte) | Merkmale (Hälfte), Bedarf |
|---|---|---|
| Pressing | Ø Kondition und Frische der Feldspieler (60 → 0, 90 → 1) | 3 aus „schnell“, „ausdauernd“, „zweikampfstark“ in Mittelfeld und Sturm |
| Ballbesitz | Kontrolle im Vergleich zum Ligaschnitt | ein starker Spielmacher (SM mindestens Teamschnitt) und 2 „ballsicher“ |
| Mauern | Abwehr Mitte im Vergleich zum Ligaschnitt | 3 aus „zweikampfstark“, „stellungssicher“, „kopfballstark“ in Abwehr und DM |
| Konter | Ø Frische der Offensiven | 2 „schnell“ im Sturm oder auf den Flügeln, 1 „Torjäger“ |
| Flügelspiel | Angriff außen im Vergleich zum Ligaschnitt | 2 „Flankengeber“ außen, 1 „kopfballstark“ im Sturm |

Merkmale zählen mit abnehmendem Ertrag (100 %, 60 %, 30 %). Fehlende Merkmale lassen sich durch einen hohen Grundwert teilweise ausgleichen. Kein Stil hängt an einem einzelnen Merkmal.

### 5.3 Der Kreislauf

- Trifft ein Stil auf den Stil, den er schlägt: Die **Chance-Entstehung** (K04 §5.2) des Siegers steigt um `6 % × Umsetzung des Siegers`. Höchstens also +6 %, wie im Rohmaterial vorgesehen.
- Neutral (Flügelspiel, ausgewogen, gleicher Stil): kein Kreislauf-Vorteil.
- Der Kreislauf-Vorteil kommt **zusätzlich** zu den festen Wirkungen aus 5.1. Gegen den „richtigen“ Gegner lohnt sich ein Stil also doppelt.

### 5.4 Vertrautheit

- **Bis K07:** Der gewählte Stil und die gewählte Ordnung bekommen +5 pro Woche aus dem normalen Training. Mit K07 kommt das aus Taktik-Einheiten (+2 je normaler, +3 je harter Einheit, +1 aus der Spielvorbereitung, K07 §5.3).
- **Spiele:** +3 je Pflichtspiel für den gespielten Stil und die gespielte Ordnung (anteilig nach Minuten).
- **Vergessen:** −2 pro Woche für alles, was nicht genutzt wird, nicht unter 30.
- **Neuzugänge:** Jeder neue Stammspieler senkt alle Werte um 4. Das passt zur Integration (K03 §5.5).
- **Wirkung der Ordnung:** unter 60 Vertrautheit Teamwerte ×(0,97 + 0,03 × Vertrautheit/60). Eine neue Ordnung kostet anfangs bis zu 3 %.
- **Zeitbedarf:** Von 30 auf 80 dauert es mit Training und Spielen sechs bis acht Wochen. Das liegt etwas über dem Rohmaterial („3–6 Wochen“), weil dort nur vom vollen Wirken die Rede ist, hier vom Weg von ganz unten.

### 5.5 Ausrichtung

| Stufe | Angriff | Abwehr |
|---|---|---|
| sehr defensiv | ×0,90 | ×1,08 |
| defensiv | ×0,95 | ×1,04 |
| ausgewogen | ×1 | ×1 |
| offensiv | ×1,05 | ×0,96 |
| sehr offensiv | ×1,10 | ×0,92 |

Dazu kommen die Spielverlauf-Effekte aus K04 §5.6. „Sehr offensiv“ in der Schlussphase ist das klassische „Alles nach vorn“.

### 5.6 Einstellung zum Spiel

| Einstellung | heute | danach |
|---|---|---|
| locker angehen | Wirkung ×0,96, Frischeverlust im Spiel ×0,7 | – |
| normal | – | – |
| Spiel der Saison | Wirkung ×1,04 | 7 Tage lang Teamwerte ×0,97 (Kater), alle Startspieler −5 Frische zusätzlich |

Es gibt keine Höchstzahl. Wer „Spiel der Saison“ ständig nutzt, spielt in den Wochen dazwischen schwächer. Der Akzeptanztest in Abschnitt 10 prüft, dass sich das im Dauerbetrieb nicht lohnt.

### 5.7 Seiten getrennt (ändert K04 §12, Punkt 1)

- Der Bereich „außen“ aus K04 wird in **links und rechts** geteilt. Jede Seite hat ihren eigenen Angriff außen und ihre eigene Abwehr außen.
- Bei einem Außenangriff wählt die Engine die Seite nach `Angriff links / Abwehr rechts des Gegners` gegen `Angriff rechts / Abwehr links des Gegners`. Ein schwacher Rechtsverteidiger zieht also die Angriffe auf seine Seite.
- Es gibt **keine zusätzlichen Regler.** Die Seiten ergeben sich aus der Aufstellung.
- Der Fuß zählt dort, wo K03 §3.1a es vorsieht: −8 % für Außenverteidiger und Flügel im Mittelfeld auf der Seite ihres schwachen Fußes.
- Im Spielbericht: „Fast alle Gefahr kam über unsere rechte Seite.“

### 5.8 Standards

- **Schützen** wählst du je Art. Ohne Wahl nimmt die Engine den Besten nach Merkmal und Stärke.
- **Elfmeterschießen:** Reihenfolge 1–5, danach nach Stärke.
- **Ecken:** Ein Rechtsfuß von links dreht den Ball zum Tor hin, ein Linksfuß von links vom Tor weg. Vorläufig ohne Unterschied in der Engine, nur im Ticker. K04 kann das bei der Kalibrierung nachrüsten.
- Fällt der eingeteilte Schütze aus oder wird ausgewechselt, übernimmt der nächstbeste auf dem Platz.

## 6. Hebel des Spielers

| Hebel | Preis und Risiko |
|---|---|
| Grundordnung und Rollen | Eignung der Spieler, Vertrautheit einer neuen Ordnung |
| Spielstil | passt er nicht zum Kader, bleiben nur die Nachteile. Gegen den falschen Gegner verliert man den Kreislauf. |
| Ausrichtung | mehr Tore vorn, mehr Gefahr hinten |
| Einsatz | Karten, Verletzungen, Sperren (K09, K10) |
| Einstellung zum Spiel | Kater in der Woche danach |
| Standardschützen | wer schießt, sammelt Erfahrung (K03 §5.6) |
| Gegneranalyse lesen | Zeit, später Kosten für Scout und Co-Trainer (K16, K18) |
| Automatik | Co-Trainer stellt auf und wählt den Stil, Qualität nach K16 |

## 7. Verhalten der Computer-Vereine

- **Grundordnung:** die Ordnung, die mit ihrem Kader die höchsten Teamwerte ergibt, mit Vorliebe für die vertraute.
- **Stil nach Lage:**
  - klarer Außenseiter, besonders auswärts: Mauern oder Konter
  - Favorit: Ballbesitz oder Pressing
  - sonst nach Vereinsprofil (K31), mit Zufall
- **Sie reagieren auf dich:** Ein Computer-Trainer wählt mit einer Wahrscheinlichkeit nach Klugheitsstufe (K02: gemütlich 10 %, normal 25 %, clever 50 %) den Stil, der deinen meistgespielten Stil der letzten fünf Spiele schlägt. So kann man mit einem Stil nicht dauerhaft durchmarschieren.
- **Spiel der Saison:** im Derby, im Pokal ab dem Viertelfinale, in der Relegation und in Endspielen um den Klassenerhalt.
- **Standardschützen:** die Besten nach Merkmal und Stärke.

## 8. Ereignisse

| Karte oder Meldung | Auslöser | Folge |
|---|---|---|
| Taktik-Coup | Außenseiter gewinnt mit dem Stil, der den Stil des Favoriten schlägt | Presse lobt (K29), Ansehen des Trainers (K28) |
| Spieler hadert mit seiner Position (Entscheidung) | Spieler dreimal in Folge auf einer Position mit Eignung unter 80 % | Gespräch (K15): erklären, Umschulung anbieten (K07) oder zurück auf seine Position. Ein Wunsch aus der Community (Recherche 4b). |
| Der Gegner hat dich durchschaut | ein Computer-Trainer kontert deinen Lieblingsstil und gewinnt | Info, Hinweis im Spielbericht |
| Standard-Spezialisten | auffällig viele Standardtore in einer Halbserie | Presse, Gegner stellen sich darauf ein (Ecken gegen dich ×0,95 für einen Monat) |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | Positionen, Eignung, Fuß, Merkmale als Voraussetzungen, Lernen im Spiel über Standardschützen |
| K04 Engine | Multiplikatoren aus 5.1, Kreislauf aus 5.3, Seiten aus 5.7, Standards aus 5.8 |
| K05 Live-Spiel | Änderungen im Spiel, Umstellungszeit, Zurufe |
| K07 Training | Taktik-Einheiten heben die Vertrautheit, Umschulung auf neue Positionen |
| K14 Kabine | Kapitän, Stimmung bei Spielen auf fremder Position |
| K15 Gespräche | „Spieler hadert mit Position“ |
| K16 Stab | Automatik für Aufstellung und Stil, Genauigkeit der Gegneranalyse |
| K18 Scouting | Gegnerbeobachtung |
| K31 Computer-Vereine | Vereinsprofil mit Lieblingsstil, Reaktion auf dich |
| K35a Oberfläche | Spielfeld mit Plätzen, Eignung als Farbe, Kreislauf mit Vertrautheit, Tauziehen gegen den Gegner |

## 10. Zielwerte und Tests

Testskript: `tests/taktik.js`, mit gemeinsamen Zufallszahlen.

| Prüfung | Ziel |
|---|---|
| Kreislauf wirkt | Bei gleich starken Teams mit voller Umsetzung gewinnt der Stil, der den anderen schlägt, 3–8 Prozentpunkte öfter als bei gleichem Stil |
| Kein Stil dominiert | Ein Team, das eine Saison lang immer denselben Stil spielt (mit passendem Kader), holt höchstens 3 Punkte mehr als mit „ausgewogen“. Auf „clever“ höchstens 2. |
| Halbherzig lohnt nicht | Pressing ohne passende Spieler (Voraussetzungen unter 0,3) bringt weniger Punkte als „ausgewogen“ |
| Keine Wunder-Ordnung | Keine Grundordnung bringt bei passendem Kader mehr als 3 Punkte gegenüber dem Schnitt der anderen. Das 4-2-2-2 wird ausdrücklich geprüft (Community-Kritik). |
| Falsche Positionen kosten | Eine Elf mit lauter Spielern auf fremder Position verliert spürbar (mindestens 8 Punkte pro Saison) |
| Spiel der Saison | Dauernd genutzt: über eine Saison weniger Punkte als nie genutzt. Gezielt drei- bis viermal genutzt: im Schnitt leicht positiv in diesen Spielen. |
| Vertrautheit | Von 30 auf 80 in 6–8 Wochen bei normalem Training und wöchentlichen Spielen (K07 §10) |
| Seiten | Ein deutlich schwächerer Rechtsverteidiger zieht mindestens 55 % der gegnerischen Außenangriffe auf seine Seite |
| Ballbesitz | Ballbesitz-Teams kommen über die Saison auf 55–65 %, Mauer-Teams auf 35–45 % |

## 11. Stellschrauben

```js
taktik:{
  ordnungen:{'4-4-2':['TW','LV','IV','IV','RV','LM','ZM*','ZM*','RM','MS+','MS+'], /* … alle zehn aus 3.1; * = Rolle DM/ZM/SM/OM, + = Rolle MS/HS */},
  spielmacherMax:1,
  stile:{pressing:{kontrolle:1.05,angriffe:1.10,konterEigen:1.30,konterGegen:1.25,frische:1.30,fouls:1.20},
         ballbesitz:{kontrolle:1.12,angriffe:0.95,konterEigen:0.70,konterGegen:1.10,frische:0.95,fouls:0.90},
         mauern:{kontrolle:0.85,angriffe:0.75,konterEigen:0.90,konterGegen:0.60,frische:0.90,fouls:1.10,abwehr:1.08},
         konter:{kontrolle:0.90,angriffe:0.85,konterEigen:1.60,konterGegen:0.90,frische:1.05},
         fluegel:{aussen:0.25},ausgewogen:{}},
  kreislauf:{pressing:'ballbesitz',ballbesitz:'mauern',mauern:'konter',konter:'pressing',vorteil:0.06},
  umsetzung:{voraussetzungen:0.5,vertrautheit:0.5,merkmalErtrag:[1,0.6,0.3]},
  vertrautheit:{start:[70,30],trainingWoche:5,jeSpiel:3,vergessen:2,min:30,neuzugang:4,ordnungUnter:60,ordnungMalus:0.03},
  ausrichtung:[[0.90,1.08],[0.95,1.04],[1,1],[1.05,0.96],[1.10,0.92]],
  einstellung:{locker:{wirkung:0.96,frische:0.7},saison:{wirkung:1.04,katerTage:7,kater:0.97,frische:5}},
  umstellungMinuten:5,
  ki:{reaktion:{gemuetlich:0.10,normal:0.25,clever:0.50},rueckblick:5}
}
```

`engine.formationen` und `engine.ausrichtung` aus der heutigen `regeln.js` gehen darin auf.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache, bitte bei Gelegenheit bestätigen oder ändern):

1. **Seiten getrennt** (5.7). Das ändert die vorläufige Entscheidung in K04 §12, Punkt 1. Grund: Der Fuß und die Positionen links und rechts aus K03 bekommen erst so eine echte Bedeutung, und es kostet keine zusätzlichen Regler.
2. **Keine getrennte Ordnung mit und ohne Ball** wie in FM26. Zu viel Bedienung für den Nutzen.
3. **Vertrautheit je Mannschaft,** nicht je Spieler. Neuzugänge senken sie pauschal. Je Spieler wäre genauer, aber schwer lesbar.
4. **Fünf Stufen der Ausrichtung** statt drei. „Konter“ wandert von der Ausrichtung zum Spielstil.
5. **„Spiel der Saison“ ohne Höchstzahl,** gebremst durch den Kater.
6. **Weggelassen:** Raum- oder Manndeckung, Abseitsfalle, Standardvarianten. Kann später kommen, wenn es sich den Platz verdient.

**Vorläufig entschieden bei der Umsetzung (U5a, 8. November 2026):**
7. **Felder im Spielstand:** `form`, `tac`, `ein` bleiben, dazu am Verein `stil`, `vt` (Vertrautheit), `rollen` (je Grundordnung), `einstellung`, `schuetzen`, `kater`, im Spielstand `stilVerlauf`. Ein gemeinsames Objekt `t.taktik` wie in 3.5 hätte nur umbenannt.
8. **Stile ausbalanciert** mit einer Stil-Matrix (gleich starke Teams, volle Umsetzung): Ballbesitz Kontrolle 1,13 und Angriffe 0,90, Pressing Angriffe 1,07 und Konter gegen sich 1,35, Mauern Kontrolle 0,88, Angriffe 0,85, eigene Konter 1,0, Abwehr 1,10, Konter mit eigenen Kontern 2,1 und Angriffen 0,88, Flügelspiel +15 statt +25 Prozentpunkte außen. Mit den Startwerten war Ballbesitz klar am stärksten, Konter schlug Pressing nicht.
9. **Kreislauf mit Dämpfung:** Wer im Kreislauf verliert, verliert zusätzlich 80 % seiner Stil-Vorteile (× Umsetzung des Siegers). Mit nur +6 % Chancen für den Sieger gewann Pressing gegen Ballbesitz nicht öfter als gegen Pressing.
10. **Kreislauf-Test** als Mittel über die vier Paare (Ziel 3–8 Prozentpunkte, jedes Paar positiv), weil die Stile verschieden stark sind und ein einzelnes Paar die Grundstärke mitmisst. Ergebnis etwa +7.
11. **Kater:** 10 Tage und ×0,955, damit er das nächste Wochenendspiel trifft. Mit 7 Tagen und ×0,97 hätte „Spiel der Saison“ jede Woche nichts gekostet.
12. **Computer-Trainer** wählen zwischen den Stilen ihrer Lage nach Umsetzung und Kreislauf gegen den Stil des Gegners (Gewicht 0,3). Ohne das mauerten Außenseiter gegen Ballbesitz und verloren den Kreislauf, die Favoriten gewannen 80 % gegen die Letzten. Ihre Grundordnung prüfen sie alle vier Wochen, nicht jede Woche (Rechenzeit). „Spiel der Saison“ im Pokal ab dem Viertelfinale und in der Relegation, Derbys folgen mit K31.
13. **Lieblingsstil** jedes Vereins per Zufall (ausgewogen dreifach gewichtet), bis K31 Vereinsprofile bringt. Dein Verein startet mit seinem Lieblingsstil (Vertrautheit 70).
14. **Neuzugang** senkt die Vertrautheit nur, wenn er mindestens Teamniveau − 2 hat (also wahrscheinlich Stammspieler wird).
15. **Einstellung zum Spiel** gilt nur für das nächste Spiel und springt danach auf „normal“ zurück.
16. **Wunder-Ordnung-Test** mit Kunst-Elf: je Grundordnung elf gleich starke Spieler auf ihren Stammpositionen mit passendem Fuß. Mit dem echten Kader gewinnt sonst die Ordnung, die zu den vorhandenen Positionen passt.


## Quellen

- Häufigste Grundordnungen 2024/25 (Premier League): [premierleague.com, Season trends 2024/25](https://www.premierleague.com/news/4323030)
- Bundesliga früher (4-4-2 in 28 % der Aufstellungen 2018/19): [bundesliga.com, Tactical review 2018/19](https://www.bundesliga.com/en/bundesliga/news/2018-19-tactical-review-bayern-munich-kovac-dortmund-favre-rb-leipzig-nagelsmann-4906)
- Kreislauf, Vertrautheit, Einsatz: `konzepte/_rohmaterial-logik-v1.md`, Kapitel 11
- Übermächtige Taktiken, Spieler hadern mit Position, Einstellung „Spiel der Saison“: `konzepte/_recherche-genre.md`, Abschnitte 3.3, 4b
