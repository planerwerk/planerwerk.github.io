# K04 – Match-Engine

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Wo eine Entscheidung nötig war, habe ich sie getroffen und in Abschnitt 12 als „vorläufig“ markiert.
Hängt ab von: K03 (Spielermodell), K02 (Zufall, Kalibrierung) · Wird gebraucht von: K05, K06, K09, K10, K13, K14, K18, K29, K34, K35a.

**Umsetzungshinweise (U3, 8. November 2026):** Die Engine v2 ist gebaut (`js/engine.js`, Werte in `REGELN.engine`) und mit `tests/kalibrierung.js` auf die Zielwerte aus §10 eingestellt. Abweichungen vom Entwurf stehen in §13.

## 1. Ziel und Spielgefühl

- **Glaubwürdige Ergebnisse:** Tore, Siege und Überraschungen in der Häufigkeit wie in echt. Bayern gewinnt meistens, aber nicht immer.
- **Erklärbar statt Drehbuch:** Nach jedem Spiel sieht man, warum es so kam: Ballbesitz, Großchancen, Paraden, Standards, Ermüdung. Das Gefühl „das Ergebnis stand vorher fest“ darf nie entstehen (Recherche, Abschnitt 4).
- **Einfluss ist spürbar, aber begrenzt:** Aufstellung, Positionen, Merkmale, Frische und Taktik machen einen Unterschied. Kein einzelner Spieler und kein einzelner Wert entscheidet allein. Das ist die Lehre aus dem Torwart-Problem (Rohmaterial 1.1).
- **Liefert Stoff für alles andere:** Szenen für das Lernen im Spiel (K03), Noten für die Form, Fouls für das Sportgericht (K09), Verletzungen (K10), Zitate für die Presse (K29), Zahlen für die Statistik (K34).
- **Schnell:** Ein ganzer Spieltag samt Konferenz rechnet sich ohne spürbare Wartezeit. Tests simulieren Hunderte Saisons in wenigen Minuten.

## 2. Vorbilder und Abgrenzung

- **Hattrick:** Das Mittelfeld entscheidet, wer den Ball hat und wie viele Angriffe entstehen. Angriff gegen Abwehr entscheidet, wie gefährlich sie werden. Das übernehmen wir als Grundgerüst.
- **Football Manager:** Chancentypen mit unterschiedlicher Torwahrscheinlichkeit (Großchance, Fernschuss, Kopfball), Standards, Ermüdung, Spielbericht mit Statistik. Übernehmen wir in vereinfachter Form.
- **Anstoss:** Textticker mit Humor und Konferenz. Übernehmen wir für die Darstellung (K05).
- **Bewusst anders:**
  - Keine Grafik-Simulation mit 22 Figuren. Ein **Szenen-Modell** pro Minute: wer hat den Ball, entsteht ein Angriff, welche Chance, wer schießt, was passiert.
  - Das heutige `(Angriff/Abwehr)^4` fliegt raus. Es macht kleine Unterschiede riesig und lässt bei großen keinen Zufall übrig (Rohmaterial 1.2).
  - Der Torwart ist kein Teil des Abwehr-Durchschnitts mehr, sondern wirkt nur dort, wo er wirklich eingreift: bei Schüssen aufs Tor, Flanken und Elfmetern, mit Deckel.

## 3. Begriffe und Daten

### 3.1 Wirkung eines Spielers

```
Wirkung = Stärke × Zustandsfaktor (K03 §5.8, 0,80–1,08) × Eignung (K03 §3.1a) × Tagesform
```

- **Tagesform:** pro Spiel und Spieler gewürfelt, Streuung ±6 %. Dazu eine Tagesform der Mannschaft, ±4 %. Beide sind nicht sichtbar. Im Spielbericht steht nur „hatte einen schwachen Tag“.
- **Frische im Spiel:** Die Frische sinkt während des Spiels (5.7). Die Wirkung wird deshalb alle 15 Minuten neu berechnet.

### 3.2 Teamwerte

Jede Position trägt mit festen Anteilen zu sechs Teamwerten bei:

| Teamwert | wofür |
|---|---|
| **Kontrolle** | Ballbesitz, wie oft man angreift |
| **Angriff Mitte** | Chancen durch die Mitte, Kombinationen, Dribblings |
| **Angriff außen** | Chancen über die Flügel, Flanken |
| **Abwehr Mitte** | verhindert Chancen durch die Mitte |
| **Abwehr außen** | verhindert Flankenläufe |
| **Torwart** | nur bei Schüssen aufs Tor, Flanken in den Strafraum, Elfmetern |

**Anteile je Position** (Startwerte, Summe je Zeile 1):

| Position | Kontrolle | Angr. Mitte | Angr. außen | Abw. Mitte | Abw. außen |
|---|---|---|---|---|---|
| IV | 0,10 | – | – | 0,80 | 0,10 |
| LV, RV | 0,15 | – | 0,25 | 0,10 | 0,50 |
| DM | 0,40 | 0,05 | – | 0,45 | 0,10 |
| ZM | 0,50 | 0,20 | 0,05 | 0,20 | 0,05 |
| SM | 0,55 | 0,35 | 0,05 | 0,05 | – |
| OM | 0,35 | 0,55 | 0,05 | 0,05 | – |
| LM, RM | 0,25 | 0,05 | 0,45 | 0,05 | 0,20 |
| HS | 0,20 | 0,70 | 0,10 | – | – |
| MS | 0,10 | 0,85 | 0,05 | – | – |
| LA, RA | 0,10 | 0,25 | 0,65 | – | – |

- Bis K06 die Grundordnungen auf die 14 Positionen umstellt, gelten für die heutigen Plätze AB, MF und ST die Anteile von IV/LV/RV, ZM und MS im passenden Mischverhältnis.
- **Teamwert** = gewichteter Schnitt der Wirkungen. Dazu:
  - **Schwächstes Glied:** 80 % Schnitt plus 20 % schwächster Beitrag mit mindestens 0,3 Anteil. Eine Lücke fällt also auf.
  - **Deckel für Einzelne:** Kein Spieler hebt einen Teamwert um mehr als 6 % über den Wert, den ein durchschnittlicher Spieler auf seiner Position ergäbe (Rohmaterial 5.2).
  - **Zahl der Spieler:** Wer mehr Spieler in einen Bereich stellt, bekommt mehr, aber mit abnehmendem Ertrag. Faktor `0,85 + 0,05 × Anzahl` wie heute, gedeckelt bei 1,15.

### 3.3 Chancentypen

| Typ | Entsteht aus | Torwahrscheinlichkeit (Start) | Wer schießt meist |
|---|---|---|---|
| Großchance | Angriff durch die Mitte, Konter, Dribbling, Patzer | 0,33 | MS, HS, OM |
| Halbchance | Angriff durch die Mitte oder außen | 0,10 | alle Offensiven |
| Fernschuss | Angriff, der vor dem Strafraum hängenbleibt | 0,035 | OM, SM, ZM, Weitschützen |
| Kopfball nach Flanke | Angriff außen | 0,11 | MS, kopfballstarke Spieler |
| Ecke | abgewehrte Angriffe und Schüsse | 0,04 je Ecke | Kopfballstarke, auch IV |
| Freistoßflanke | Foul in der Hälfte des Gegners | 0,05 | wie Ecke |
| direkter Freistoß | Foul vor dem Strafraum | 0,06 | Freistoßschütze |
| Elfmeter | Foul im Strafraum, selten Handspiel | 0,76 | Elfmeterschütze |
| Konter | Ballgewinn, Gegner aufgerückt | wird zur Großchance oder Halbchance | schnelle Spieler |

Die Werte sind Startpunkte für die Kalibrierung. **Überschlag für zwei gleich starke Teams** (nachgerechnet): je Team etwa 9 Chancen aus dem Spiel und 5 Ecken, zusammen etwa 24 Schüsse, 9–10 Ecken und 3,05 Tore pro Spiel. Davon gut 20 % nach Ecken und Freistößen und 7 % per Elfmeter, Torquote je Schuss etwa 13 %.

### 3.4 Was ein Spiel hinterlässt

- **Ergebnis** und **Ereignisliste** (Minute, Art, Spieler, Text) für Ticker und Konferenz.
- **Statistik:** Ballbesitz, Torschüsse, aufs Tor, Großchancen, Ecken, Fouls, Karten, Abseits, Paraden.
- **Szenen je Spieler** für das Lernen im Spiel (K03 §5.6): Ecke getreten → Tor, Kopfballduell, Elfmeter, Parade, Patzer und so weiter.
- **Note** und **erwartete Note** je Spieler (5.9).
- **Erwartung vor dem Spiel:** Sieg-, Remis- und Niederlagenchance sowie erwartete Punkte. Daraus rechnen die Vorschau (Tauziehen, K35a) und die Serien in K03 §5.2.
- **Spielbericht** mit den drei bis fünf wichtigsten Gründen (5.10).

## 4. Abläufe

**Ein Spiel**, Minute für Minute, beide Mannschaften:

1. **Vor dem Anpfiff:** Aufstellungen, Wirkungen und Teamwerte berechnen. Tagesformen würfeln. Erwartung berechnen und speichern (für Serien und Spielbericht).
2. **Jede Minute:**
   1. **Ballbesitz:** Die Kontrolle beider Teams entscheidet, wer die Minute gestaltet.
   2. **Angriff:** Das Team mit dem Ball greift mit einer Grundwahrscheinlichkeit an. Ob durch die Mitte oder außen, hängt von den Stärken in Angriff Mitte und außen und vom Spielstil ab (K06).
   3. **Chance:** Angriff gegen die passende Abwehr entscheidet, ob eine Chance entsteht und welche (3.3). Misslingt der Angriff, kann ein Konter des Gegners folgen.
   4. **Schütze:** gewichtet nach Position, Chancentyp und Merkmalen. Bei Standards ist es der eingeteilte Schütze (K06).
   5. **Abschluss:** Tor, Parade, vorbei oder geblockt. Abgewehrte Angriffe und Paraden erzeugen Ecken.
   6. **Nebenereignisse:** Fouls mit Ort (im Strafraum → Elfmeter, vor dem Strafraum → Freistoß), Karten (K09), Verletzungen (K10), Abseits, selten ein aberkanntes Tor nach Videobeweis.
3. **Alle 15 Minuten:** Frische und Wirkungen aktualisieren, Spielstand-Effekte anwenden (5.6).
4. **Halbzeit und Wechsel:** Ablauf in K05. Die Engine rechnet nach jedem Wechsel die Teamwerte neu.
5. **Nachspielzeit:** erste Halbzeit 1–5 Minuten, zweite 3–10, je nach Toren, Wechseln, Verletzungen und Karten.
6. **K.-o.-Spiele:** Verlängerung mit sinkender Frische, danach Elfmeterschießen mit Schützen nach Reihenfolge (K13).
7. **Nach dem Abpfiff:** Noten, Szenen, Statistik, Spielbericht. Weitergabe an K03 (Form, Frische, Lernen), K09, K10, K34.

**Konferenz und Live-Spiel:** Alle Spiele laufen durch dieselbe Engine. Das eigene Spiel rechnet live Minute für Minute (K05), die anderen werden vorab berechnet, weil dort niemand eingreift. Ein Wechsel im Live-Spiel ändert ab dieser Minute die Teamwerte. Es gibt kein vorab festgelegtes Ergebnis.

## 5. Regeln und Formeln

Alle Zahlen sind Startwerte für `regeln.js`. Die Kalibrierung gegen Abschnitt 10 übernimmt K02.

### 5.1 Ballbesitz

```
Anteil Heim = K_heim^1,5 / (K_heim^1,5 + K_gast^1,5)
```

K = Kontrolle mit Heimvorteil und Spielstil. Ergibt bei 10 % Unterschied in der Kontrolle etwa 57 zu 43 % Ballbesitz.

### 5.2 Angriff und Chance

- **Angriff pro Minute mit Ball:** 0,50 (Spielstil verschiebt das, K06).
- **Weg:** außen mit Anteil `Angriff außen / (Angriff Mitte + Angriff außen)`, verschoben durch Spielstil und durch die Schwäche der gegnerischen Abwehr in diesem Bereich.
- **Chance entsteht** mit `0,41 × (Angriff / Abwehr)^1,6`, gedeckelt auf 0,10–0,80. Angriff und Abwehr sind der passende Bereich (Mitte gegen Mitte, außen gegen außen).
- **Typ:** durch die Mitte 20 % Großchance, 45 % Halbchance, 35 % Fernschuss. Außen 45 % Kopfball nach Flanke, 25 % Halbchance, 10 % Großchance, 20 % Fernschuss. Merkmale verschieben diese Anteile (5.5).
- **Misslungener Angriff:** Mit 12 % startet der Gegner einen Konter, mehr bei Pressing des Angreifers und wenn der Gegner schnelle Spieler hat.
- **Ecken** entstehen aus 55 % der abgewehrten Außenangriffe, 30 % der Paraden und 35 % der geblockten Schüsse (etwa jeder vierte Schuss wird geblockt). Ziel: etwa 10 pro Spiel.

### 5.3 Abschluss und Torwart

```
p(Tor) = Basis(Chancentyp) × Schütze × Torwart × Merkmale × Selbstvertrauen
Schütze = 1 + 0,010 × (Wirkung Schütze − 70), begrenzt auf 0,80–1,20
Torwart = 1 − 0,008 × (Wirkung Torwart − 70), begrenzt auf 0,85–1,15
```

- Der **Torwart** wirkt nur hier und bei Flanken (5.5). Sein Deckel liegt bei ±15 %, wie im Rohmaterial vorgesehen.
- **Beispiel zum Torwart-Test:** Ein Zweitligist (Torwart 66) holt einen Torwart mit 84. Der Torwart-Faktor sinkt von 1,03 auf 0,89, gegen ihn fallen etwa 14 % weniger Tore. Bei 1,4 Gegentoren pro Spiel sind das etwa 0,2 pro Spiel. Das liegt im Ziel (höchstens 0,25) und passt zu den echten Werten: Die besten Torhüter einer Saison verhindern etwa 5 Tore mehr als erwartet (Quellen).
- **Aufs Tor:** etwa 35 % aller Schüsse. Was aufs Tor geht und nicht drin ist, zählt als Parade.
- **Patzer:** Je Spiel und Torwart gibt es mit 2 % einen Patzer, der dem Gegner eine Großchance schenkt. „unkonzentriert“ vervierfacht das, „Fliegenfänger“ verdoppelt es bei Flanken.

### 5.4 Fouls, Standards, Elfmeter

- **Fouls:** pro Minute und Team etwa 0,12, mehr bei hartem Einsatz, Pressing, „ungestüm“ und hohem Temperament. Ziel 10–13 pro Team und Spiel (prüfen).
- **Ort des Fouls:** 75,2 % in der eigenen Hälfte oder im Mittelfeld (kein gefährlicher Standard), 20 % in gefährlicher Zone (Freistoßflanke), 3,5 % zentral vor dem Strafraum (direkter Freistoß), 1,3 % im Strafraum (Elfmeter). Ziel 0,2–0,3 Elfmeter pro Spiel (prüfen).
- **Karten:** Schwere des Fouls und Strafmaß kommen aus K09. Bis dahin gilt die heutige Kartenwahrscheinlichkeit, verteilt auf die Fouls.
- **Schützen:** Für Elfmeter, direkte Freistöße und Ecken (links und rechts) teilt der Trainer Schützen ein (K06). Ohne Einteilung nimmt die Engine den Besten nach Merkmal und Stärke.

### 5.5 Merkmale und Eigenschaften in der Engine

Jedes Merkmal aus K03 hat einen Haken mit Startwert. Mehrere Spieler mit demselben Merkmal im selben Bereich zählen 100 %, 60 %, 30 % (K03 §5.6).

| Merkmal | Wirkung (Start) |
|---|---|
| kopfballstark | Kopfball- und Eckenchancen: als Schütze 1,5-mal so oft gewählt, Torwahrscheinlichkeit ×1,15. In der Abwehr: gegnerische Kopfballchancen ×0,92. |
| schnell | Konter entstehen ×1,15 häufiger und werden öfter zur Großchance. In der Abwehr: gegnerische Konter ×0,92. |
| ausdauernd | Frischeverlust im Spiel ×0,75 |
| zweikampfstark | Abwehr seines Bereichs +3 %, Pressing wirkt stärker |
| stellungssicher | gegnerische Großchancen in seinem Bereich ×0,92, halbiert den Vorteil gegnerischer schneller Spieler |
| ballsicher | eigene misslungene Angriffe führen ×0,85 seltener zu Kontern, hilft gegen Pressing |
| Flankengeber | Außenangriffe werden ×1,15 öfter zur Kopfballchance. Als Eckenschütze: Eckentore ×1,2. |
| Dribbler | Halbchance wird mit 15 % zur Großchance, zieht ×1,3 mehr Fouls |
| Torjäger | Großchancen und Halbchancen: Torwahrscheinlichkeit ×1,15, als Schütze 1,3-mal so oft gewählt |
| Weitschütze | Fernschüsse ×1,5 so oft, Torwahrscheinlichkeit ×1,25 |
| Freistoßspezialist | direkter Freistoß 0,06 → 0,10 |
| Elfmeterschütze | Elfmeter 0,76 → 0,84 |
| beidfüßig | Abschluss und Flanken ×1,03, keine Strafe auf der falschen Seite |
| Joker | Wirkung ×1,06 in den ersten 20 Minuten nach der Einwechslung |
| Reflexe (TW) | Großchancen und Halbchancen gegen ihn ×0,93 |
| Strafraumbeherrscher (TW) | gegnerische Kopfball-, Ecken- und Freistoßflankenchancen ×0,85 |
| Elfmetertöter (TW) | gegnerische Elfmeter 0,76 → 0,70 |
| mitspielend (TW) | gegnerisches Pressing wirkt schwächer |
| kopfballschwach, abschlussschwach, langsam | Gegenteil der jeweiligen Stärke, gleiche Größe |
| unkonzentriert | Patzer ×4 (Feldspieler: Fehlpass vor dem eigenen Strafraum) |
| ungestüm | Fouls ×1,4 |
| Fliegenfänger (TW) | Flankenchancen gegen ihn ×1,15, Patzer bei Flanken ×2 |

| Eigenschaft | Wirkung im Spiel |
|---|---|
| Kämpfer | bei Rückstand Wirkung ×1,03 |
| nervenschwach | in wichtigen Spielen ×0,96, Elfmeter −0,06 |
| Trainingsweltmeister | in wichtigen Spielen ×0,97 |
| Hitzkopf | Karten ×1,5 |
| Führungsspieler | bei Rückstand Teamwerte +1 % (nur einer zählt) |

**Wichtige Spiele:** Derby, Pokal ab Achtelfinale, Relegation, die letzten vier Spieltage bei höchstens drei Punkten Abstand zu einem Ziel- oder Abstiegsplatz. Dazu die letzten zehn Minuten bei höchstens einem Tor Unterschied.

### 5.6 Spielverlauf

- **Führung:** Das führende Team spielt vorsichtiger (Angriff ×0,94, Abwehr ×1,04), das zurückliegende offener (Angriff ×1,06, Abwehr ×0,96). Ab der 75. Minute doppelt. Die Spiele werden gegen Ende dadurch offener.
- **Rote Karte:** Der Spieler fehlt in allen Teamwerten. Dazu Umstellung: Angriff ×0,90, Abwehr ×0,95. Ziel: etwa −25 % eigene Torchance, +20 % für den Gegner (Rohmaterial 5.5).
- **Heimvorteil:** alle Teamwerte ×1,03, Amateure im Pokal ×1,05. Bei fast ausverkauftem Stadion +1 % (K27 baut aus). Der Heimvorteil ist in den letzten Jahren kleiner geworden (2024/25 fast so viele Auswärts- wie Heimsiege). Deshalb liegt er niedriger als heute im Code.

### 5.7 Ermüdung im Spiel

- **Frische pro Minute:** `−0,17 × (1,5 − 0,007 × Kondition)`, ×1,3 bei Pressing, ×1,15 bei hartem Einsatz, ×0,75 bei „ausdauernd“. Über 90 Minuten passt das zum Verlust in K03 §5.3.
- **Wirkung:** über den Zustandsfaktor aus K03. Unter 60 % Frische zusätzlich ×(1 − 0,5 × (0,6 − Frische)): Die Leistung sinkt dann deutlich, und das Verletzungsrisiko steigt (K10).
- Eingewechselte Spieler kommen mit ihrer aktuellen Frische, meist nahe 100 %.

### 5.8 Erwartung vor dem Spiel

Erwartete Tore beider Teams aus Teamwerten, Heimvorteil und den Formeln oben, dann Sieg, Remis und Niederlage per Poisson-Näherung. Die Rechnung würfelt nicht und ist billig. Sie liefert:
- die Vorschau (Tauziehen, K35a), unscharf je nach Gegneranalyse (K06, K18)
- die erwarteten Punkte für die Serien (K03 §5.2)
- den Maßstab für den Spielbericht („wir waren Außenseiter“)

### 5.9 Noten und erwartete Note

**Problem heute:** Die Note enthält `−(Stärke − 72)/25`. Starke Spieler bekommen allein wegen ihrer Stärke bessere Noten und damit bessere Form (Konsistenzprüfung J1).

**Neu:**

```
erwartete Note = 3,5 − (Wirkung − Wirkung des direkten Gegenübers) / 25 − 0,3 × (erwartete Punkte − 1,4)
Note          = erwartete Note − Leistung + Zufall (±0,6)
```

- **Leistung** = was er im Spiel getan hat, **minus** was man von seiner Position erwartet:
  - Tore (+0,9), Vorlagen (+0,5), gewonnene Kopfballduelle und Zweikämpfe in seinen Szenen (+0,1)
  - vergebene Großchancen (−0,3), Patzer vor Gegentoren (−0,8), Platzverweis (−1,5)
  - Torwart: verhinderte Tore gegenüber der Erwartung (+0,8 je Tor), Patzer (−1)
  - Mannschaftsergebnis gegenüber der Erwartung (±0,3)
  - Von jedem Posten wird der Erwartungswert der Position abgezogen. Ein Mittelstürmer, der im Schnitt 0,4 Tore pro Spiel schießt, bekommt für ein Tor also +0,9 × 0,6, für kein Tor −0,9 × 0,4.
- Damit ist die **Note im Schnitt gleich der erwarteten Note**, egal wie stark ein Spieler ist. Die Form (K03 §5.2) rechnet mit der Differenz und dreht sich nicht mehr hoch.
- Angezeigt wird die Note wie heute in halben Schritten von 1 bis 6. Starke Spieler haben weiterhin im Schnitt bessere Noten, weil ihre erwartete Note besser ist. Das ist wie im Kicker.

### 5.10 Spielbericht: Warum ist es so gekommen?

Die Engine vergleicht das Spiel mit der Erwartung und nennt die drei bis fünf größten Abweichungen in Worten:
- „Unser Mittelfeld hatte 61 % Ballbesitz, aber nur zwei Großchancen.“
- „Ihr Torwart hat zwei Großchancen pariert und etwa ein Tor verhindert.“
- „Drei unserer vier Gegentore fielen nach Standards.“
- „Nach der 70. Minute ließen die Kräfte nach (Frische unter 60 %).“
- „Die Gelb-Rote Karte in der 38. Minute hat das Spiel gedreht.“

Jeder Satz stammt aus einer Zahl, die die Engine wirklich gerechnet hat. Keine Floskeln ohne Grundlage.

### 5.11 Zufallsquellen im Überblick

| Quelle | Wirkung | Start |
|---|---|---|
| Tagesform Team | Faktor auf alle Teamwerte | ±4 % |
| Tagesform Spieler | Faktor auf die Wirkung | ±6 % |
| Minute | Ballbesitz, Angriff, Chance, Typ, Schütze, Abschluss | je Szene gewürfelt |
| Fouls, Karten, Verletzungen | je Minute | K09, K10 |
| Schiedsrichter | Strenge bei Karten und Elfmetern | vorläufig ein Profil je Spiel, 0,85–1,15 (K09) |
| Videobeweis | aberkennt ein Tor | etwa 3 % der Tore (prüfen) |

Alles läuft über den Zufall mit Seed (K33). Ein Spiel lässt sich mit demselben Seed exakt wiederholen.

## 6. Hebel des Spielers

| Hebel | Wirkung | Preis |
|---|---|---|
| Aufstellung und Positionen | Teamwerte, Eignung, Seiten | falsche Positionen kosten bis zu 45 % |
| Bereiche verstärken | mehr Spieler in Mitte oder außen | weniger in einem anderen Bereich |
| Spielstil, Ausrichtung, Einsatz (K06) | Ballbesitz, Angriffshäufigkeit, Chancenmix, Fouls | Frische, Konteranfälligkeit, Karten |
| Standardschützen (K06) | Eckentore, Freistöße, Elfmeter, Lernen im Spiel | – |
| Schonen und Rotation | Frische, weniger Ermüdung | Spielpraxis, Stimmung |
| Wechsel im Spiel (K05) | frische Beine, Joker, neue Ordnung | höchstens 5 |

## 7. Verhalten der Computer-Vereine

- Dieselbe Engine, dieselben Formeln.
- **Aufstellung:** die besten Wirkungen auf passenden Positionen. Spieler unter der Frische-Schwelle ihres Profils (Start 75 %) werden geschont (K03 §7).
- **Ausrichtung** nach Erwartung: Wer klar Außenseiter ist, spielt auswärts defensiv oder auf Konter, Favoriten offensiv. Mit Zufall, damit es nicht vorhersehbar wird. Vereinsprofile kommen mit K31.
- **Schützen:** die Besten nach Merkmal und Stärke.
- **Im Spiel:** Regeln aus Rohmaterial 8 (müde Spieler zwischen der 55. und 80. Minute raus, bei Rückstand offensiver, bei Führung defensiver). Ausbau in K05.

## 8. Ereignisse

Die Engine löst selbst keine Ereigniskarten aus, sondern meldet Anlässe:
- **Torwart-Patzer**, der ein Spiel entscheidet → Presse (K29), eventuell die Karte „Torwartfrage“ (K30).
- **Elfmeter verschossen** im Pokal oder in der Relegation → Selbstvertrauen (K03), Presse.
- **Rekorde:** höchster Sieg, Hattrick, Serie → Statistik (K34) und Info.
- **Rote Karte mit Folgen** → Sportgericht (K09).
- **Schwere Verletzung** → Medizin (K10), Stimmung.

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | liefert Stärke, Zustände, Merkmale, Eigenschaften. Bekommt Noten, erwartete Noten, Szenen, Minuten, Frischeverlust. |
| K05 Live-Spiel | Darstellung, Pause, Halbzeit, Wechsel, Taktik im Spiel. Nutzt dieselbe Engine. |
| K06 Taktik | Grundordnungen auf 14 Positionen, Spielstil-Kreislauf als Modifikatoren für 5.1 und 5.2, Standardschützen, Gegneranalyse |
| K09 Sportgericht | Fouls mit Schwere und Ort, Karten |
| K10 Medizin | Verletzungen aus Fouls und Ermüdung |
| K13 Wettbewerbe | Verlängerung, Elfmeterschießen, Pokal gegen Amateure |
| K14 Kabine | Ergebnisse und Noten wirken auf die Stimmung |
| K18 Scouting | Gegneranalyse macht die Vorschau genauer |
| K29 Presse | Anlässe und Zahlen für Fragen und Schlagzeilen |
| K34 Statistik | Torschützen, Vorlagen, Noten, Paraden, Rekorde |
| K35a Oberfläche | Tauziehen aus der Erwartung (5.8), Spielbericht (5.10) |

## 10. Zielwerte und Tests

**Echte Anker** (1. Bundesliga):
- **Tore:** 2024/25 fielen 959 Tore in 306 Spielen, 3,13 pro Spiel, zum siebten Mal in Folge mehr als drei (bundesliga.com).
- **Ergebnisse 2024/25:** 118 Heimsiege, 111 Auswärtssiege, damit 77 Remis (selbst gerechnet: 38,6 %, 36,3 %, 25,2 %). Langfristig lag der Heimvorteil höher. Er ist seit der Corona-Zeit kleiner geworden.
- **Standards:** Laut bundesliga.com fällt mehr als ein Viertel aller Tore nach Ecken oder Freistößen.
- **Ecken:** etwa 9,7 pro Spiel im Fünf-Jahres-Schnitt (Spreadex), 2026/27 bisher etwa 10,9 (APWin).
- **Torhüter:** Die besten verhindern in einer Saison etwa 5 Tore mehr als erwartet, die schwächsten lassen etwa 5 mehr zu (Premier League 2024/25, FBref-Daten laut Football365).
- **Elfmeter 2024/25:** 83 Strafstöße, davon 58 verwandelt (bundesliga.com). Das sind 0,27 pro Spiel und eine Quote von 70 %, die als ungewöhnlich niedrig galt. Das DFB-Datencenter nennt 58, vermutlich nur die verwandelten.
- **Platzverweise 2024/25:** 30 Rote und 28 Gelb-Rote Karten (DFB-Datencenter), zusammen 0,19 pro Spiel.
- **2. Liga:** nach dem 10. Spieltag 2024/25 3,4 Tore pro Spiel (Zwischenstand, bundesliga.com).
- **Tore nach Halbzeit:** Die Studien widersprechen sich. 2008–2011 fielen in vier großen Ligen 55 % der Tore nach der Pause, eine Auswertung der Top-5-Ligen 2018–2021 fand mehr Tore vor der Pause.
- **Unsicher, noch prüfen:** Fouls und Torschüsse pro Spiel, Endwerte für 2. und 3. Liga.

**Testskript `tests/kalibrierung.js`** (viele Seeds, ganze Saisons):

| Prüfung | Ziel |
|---|---|
| Tore pro Spiel, 1. Liga | 2,9–3,3 |
| Tore pro Spiel, 2. und 3. Liga | ähnlich wie die 1. Liga, 2,8–3,4 |
| Heim / Remis / Auswärts | 40–46 % / 23–27 % / 30–36 % |
| Torschüsse pro Spiel | 22–28 (prüfen) |
| Torquote je Schuss | 10–13 % |
| Ecken pro Spiel | 9–11 |
| Tore nach Ecken und Freistößen | 22–30 % aller Tore, dazu Elfmeter 5–8 % |
| Gelbe Karten pro Team und Spiel | 1,5–2,2 |
| Platzverweise pro Spiel (Rot und Gelb-Rot) | 0,12–0,25 |
| Elfmeter pro Spiel | 0,2–0,3, verwandelt 70–80 % |
| Punkte | Meister im Median 70–85, schlechtester Wert nicht unter 63 (Dortmund wurde 1995/96 mit 68 Punkten Meister), Letzter 15–30 |
| Favoriten | Stärkeunterschied wie Top 3 gegen Abstiegskandidat: 65–75 % Sieg, 12–20 % Remis, 8–15 % Niederlage. Gleich stark mit Heimvorteil: 40–46 % Sieg. |
| Pokal gegen Amateure | Bundesligist kommt in 88–94 % weiter |
| Überraschungen | Jedes Spitzenteam verliert mindestens zweimal pro Saison gegen eine Mannschaft aus der unteren Hälfte, im Schnitt über viele Saisons |
| Ballbesitz | Spanne der Saisonwerte etwa 40–62 % je Team |
| Rote Karte | eigene Torchance etwa −25 %, gegnerische etwa +20 % |
| Spielverlauf | Anteil der Tore nach der Pause 47–58 % (Studien uneinig, daher weites Band) |

**Akzeptanztests:**
- **Torwart-Test** (Rohmaterial 5.6): Ein Zweitliga-Mittelfeldteam bekommt einen Torwart aus der 1. Liga. Über 200 Saisons: 0,08–0,25 Gegentore weniger pro Spiel, +2 bis +6 Punkte. Es muss also etwas bringen, aber nicht alles.
- **Sensitivität:** Ein Feldspieler +5 Stärke bringt 1–3 Punkte pro Saison. Kein Bereich (Kontrolle, Mitte, außen, Abwehr) bringt bei gleicher Investition mehr als das Doppelte eines anderen. Keine harte Schwelle: Die Punkte steigen glatt mit der Teamstärke.
- **Merkmale:** wie in K03 §10 (0,3–2 Punkte je Merkmal und Stammspieler, „schnell“ gesondert).
- **Ein Star allein:** Ein 95er in einem 65er-Team hebt die Punkte um höchstens 6 pro Saison.
- **Kein Exploit über Positionen:** Fünf Stürmer aufzustellen bringt weniger Punkte als eine ausgewogene Elf gleicher Stärke.
- **Wiederholbarkeit:** gleicher Seed, gleiches Spiel, gleiches Ergebnis.
- **Tempo:** eine Saison der 1. Liga (306 Spiele) in unter 2 Sekunden im Browser (Zielwert, prüfen).

## 11. Stellschrauben

Neuer Abschnitt `engine` in `daten/regeln.js` (Skizze, Namen in U3 endgültig). Bestehende Einträge wie `formationen`, `karten`, `elfmeter`, `gelbSperreAb` bleiben, bis K06 und K09 sie ersetzen.

```js
engine:{
  tagesform:{team:0.04,spieler:0.06},
  anteile:{IV:[0.10,0,0,0.80,0.10],LV:[0.15,0,0.25,0.10,0.50],DM:[0.40,0.05,0,0.45,0.10],ZM:[0.50,0.20,0.05,0.20,0.05],
    SM:[0.55,0.35,0.05,0.05,0],OM:[0.35,0.55,0.05,0.05,0],LM:[0.25,0.05,0.45,0.05,0.20],HS:[0.20,0.70,0.10,0,0],
    MS:[0.10,0.85,0.05,0,0],LA:[0.10,0.25,0.65,0,0]},   // [Kontrolle, Angriff Mitte, Angriff außen, Abwehr Mitte, Abwehr außen], rechts wie links
  team:{schwaechstes:0.2,mindestAnteil:0.3,einzelDeckel:0.06,anzahl:[0.85,0.05],anzahlMax:1.15},
  besitz:{exponent:1.5},
  angriff:{proMinute:0.50,chance:0.41,exponent:1.6,min:0.10,max:0.80,konter:0.12},
  mix:{mitte:{gross:0.20,halb:0.45,fern:0.35},aussen:{kopf:0.45,halb:0.25,gross:0.10,fern:0.20}},
  tor:{gross:0.33,halb:0.10,fern:0.035,kopf:0.11,ecke:0.04,freistossFlanke:0.05,freistoss:0.06,elfmeter:0.76},
  ecken:{aussenAbgewehrt:0.55,parade:0.30,geblockt:0.35},geblockt:0.25,
  schuetze:{mitte:70,jePunkt:0.010,min:0.80,max:1.20},
  torwart:{mitte:70,jePunkt:0.008,min:0.85,max:1.15,patzer:0.02,aufsTor:0.35},
  fouls:{proMinute:0.12,ort:{harmlos:0.752,flanke:0.20,direkt:0.035,elfmeter:0.013}},
  verlauf:{fuehrung:{A:0.94,D:1.04},rueckstand:{A:1.06,D:0.96},abMinute:75,rot:{A:0.90,D:0.95}},
  heim:{alle:1.03,amateure:1.05,ausverkauft:0.01},
  ermuedung:{proMinute:0.17,ko:[1.5,-0.007],pressing:1.3,hart:1.15,schwelle:0.6,abfall:0.5},
  nachspielzeit:{hz1:[1,5],hz2:[3,10]},
  wichtig:{letzteSpieltage:4,abstand:3,schlussMinuten:10},
  note:{mitte:3.5,teiler:25,erwartung:0.3,zufall:0.6,tor:0.9,vorlage:0.5,duell:0.1,grosschanceVergeben:-0.3,
    patzer:-0.8,platzverweis:-1.5,torwartJeTor:0.8,ergebnis:0.3,min:1,max:6},
  var:{aberkannt:0.03},
  merkmale:{ /* Haken aus 5.5 mit Startwerten */ }
}
```

`tore.exponent` (heute 4), `reihen`, `angriff`, `abwehr`, `staerke.fremdTorwart` und `note.staerkeMitte` fallen weg.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache, bitte bei Gelegenheit bestätigen oder ändern):

1. **Links und rechts** (geändert durch K06 §5.7: Seiten getrennt, ohne zusätzliche Regler). Ursprünglich: ein gemeinsamer Bereich „außen“. Getrennte Seiten (unser linker Flügel gegen ihren rechten Verteidiger) wären tiefer, aber teurer im Balancing. Vorschlag: K06 entscheidet, wenn die Grundordnungen stehen.
2. **Schiedsrichter** bekommen vorläufig nur einen Strengefaktor je Spiel. Echte Profile mit Namen und Ruf kommen mit K09, wenn das Sportgericht gebaut wird.
3. **Videobeweis** nur als seltenes Ereignis „Tor aberkannt“ (etwa 3 % der Tore, Zahl prüfen). Keine eigene Mechanik.
4. **Wetter und Rasen** später mit K26 (Rasenqualität, Platzwart). Bis dahin kein Wetter.
5. **Abseits** zählt nur als Statistik und als „Tor aberkannt“, ohne Taktik (Abseitsfalle vielleicht in K06).
6. **Heimvorteil** niedriger als heute (×1,03 statt ×1,04/1,03), weil er in den letzten Jahren gesunken ist. Kalibrierung in K02 entscheidet den Endwert. *Nach Kalibrierung und Akzeptanztests (U3): ×1,03, siehe §13.*

**Noch zu recherchieren:** Fouls und Torschüsse pro Spiel, Endwerte für den Torschnitt der 2. und 3. Liga.

## 13. Umsetzung U3 (8. November 2026)

**Gebaut:** Teamwerte je Bereich aus den Positionsanteilen der Grundordnung (10 Grundordnungen auf 14 Positionen), mit Abzug für das schwächste Glied und Faktor für die Zahl der Spieler. Linke und rechte Seite getrennt. Szenen je Minute: Ballbesitz, Angriffsweg (Mitte, links, rechts, Konter), Chancentyp, Schützenwahl, Abschluss mit Schützen- und Torwartfaktor, Ecken, Fouls mit Ort (Flanke, direkter Freistoß, Elfmeter), Karten, Verletzungen, Torwartpatzer, Ermüdung alle 15 Minuten, Spielstand und Unterzahl. Statistik je Spiel in `r.st`, Szenen für das Lernen (K03 §5.6) in `r.sz`.

**Kalibrierung** (3 Seeds × 8 Saisons, 1. Liga): 3,1–3,2 Tore, Heim/Remis/Auswärts 44–46 / 22–24 / 31–33 %, 25 Schüsse, Torquote 13 %, 9,6 Ecken, 24 % Standardtore, 7 % Elfmetertore, 0,27 Elfmeter, 2,0 Gelbe je Team, 0,2 Platzverweise. Meister im Median 72–74 Punkte. Bundesligist gegen Amateure: 90–91 % weiter. 2. und 3. Liga 2,85–3,1 Tore.

**Abweichungen vom Entwurf:**
1. **Remis spät:** Ohne Zusatz kamen nur 21 % Remis heraus, obwohl die Tore stimmten. Neu: Steht es nach der 75. Minute unentschieden, greifen beide Teams seltener an (×0,85, `verlauf.gleich`). Damit 23–24 %.
2. **Verwarnte Spieler** foulen seltener (×0,35) und sehen seltener eine Karte (×0,5), Hitzköpfe ausgenommen. Sonst gab es zu viele Gelb-Rote Karten (0,55 Platzverweise pro Spiel).
3. **Heimvorteil** zuerst ×1,04, nach den Akzeptanztests wieder ×1,03 wie in §12 Nr. 6 vorgeschlagen (der Abwehrdruck verstärkt den Heimvorteil, siehe unten).
4. **Amateurklubs im Pokal** mit Stärke 47–57 statt 56–65 (entspricht 4. bis 6. Liga). Sie spielen vereinfacht: nur Angriffe durch die Mitte, keine Standards.
5. **Ballbesitz** mit Exponent 3 auf den Kontrollwert, sonst lagen alle Teams bei 46–55 %.
6. **Ausreißer:** In einer von drei Welten gewannen die drei stärksten Kader nur 59 % gegen die drei schwächsten (Ziel 65–75 %). Das liegt an der Welt (kleiner Abstand der Kader), nicht an der Engine. Beobachten, wenn K32 die Welt erzeugt.

**Nachtrag Merkmale:** „zweikampfstark“ wirkt jetzt in der Abwehr (×1,03 auf den Abwehrbeitrag). Die Szenen für das Lernen (`r.sz`) enthalten zusätzlich Paraden aus kurzer Distanz, Flanken des Torwarts, verlorene Kopfballduelle, Dribblings und Karten. Die Wirkung von Kämpfer, Führungsspieler, nervenschwach und Trainingsweltmeister steht in `REGELN.engine.eigenschaften`. Weil Spieler seit U3 mehr Stärken haben (K03 §12), ist nachkalibriert: Chance je Angriff 0,41, Ballbesitz-Exponent 3,5. Danach 3,0–3,1 Tore in der 1. Liga.

**Akzeptanztests** (`tests/akzeptanz.js`, 200 Durchgänge, beide Varianten mit denselben Zufallsströmen), alle bestanden:

| Prüfung | Ziel | Ergebnis |
|---|---|---|
| Torwart-Test: Mittelfeldteam der 2. Liga bekommt einen Spitzentorwart der 1. Liga (72 → 84) | 0,08–0,25 Gegentore weniger, +2 bis +6 Punkte | 0,17 weniger, +3,9 Punkte |
| Ein Spieler +5 (Mittel aus den beiden Innenverteidigern, zentralen Mittelfeldspielern, Mittelstürmern) | 1–3 Punkte, kein Bereich mehr als das Doppelte | Abwehr +1,2–1,4, Mittelfeld +1,7–1,8, Angriff +1,2–1,8 |
| Ganze Elf +2, +4, +6 | jeder Schritt bringt etwas, keine Schwelle | je etwa +5,5 bis +6,9 |
| Ein 95er in einem 65er-Team | höchstens +6 Punkte | +4,9 bis +5,9 |
| Fünf Stürmer statt ausgewogener Elf | weniger Punkte | 26 statt 52 |
| Tempo | unter 2 s je Saison im Browser | 1,8 ms je Spiel in Node |

Dafür neu oder geändert:
7. **Abwehrdruck auf den Abschluss:** Die Torquote sinkt, je stärker die Abwehr im Verhältnis zum Angriff ist (Mitte gegen Mitte, bei Kopfbällen Außen gegen Flügel), 1,4 % je Punkt, gedeckelt auf ±20 % (`REGELN.engine.abwehr`). Vorher brachte ein Stürmer über Teamwert und Abschluss doppelt, ein Verteidiger nur einfach.
8. **Ein Einzelner kann nicht alles allein:** Liegt ein Spieler mehr als 11 Punkte über dem Schnitt der anderen in einem Bereich, zählt der Rest nur zu 5 % (`team.ueberragend`).
9. **Schützenwahl flacher** (Exponent 1,5 statt 3) und Schützenfaktor 0,8 % je Punkt statt 1,4 %. Sonst übernahm ein Star fast alle Abschlüsse.
10. **Zentrales Mittelfeld** mit mehr Anteil an Angriff und Abwehr (Kontrolle 0,35, Angriff Mitte 0,30, Abwehr Mitte 0,25). Vorher brachte ein besserer Sechser oder Achter am wenigsten.
11. **Remis spät:** Faktor 0,78 statt 0,85. Ballbesitz-Exponent 3,5, Angriffsexponent 1,7, Chance je Angriff 0,42.

**Noch offen in U3:** Schwierigkeitsgrade (K02 §5.4).

## Quellen

- Tore, Ergebnisse und Elfmeter 2024/25: [bundesliga.com, Trends der Saison 2024/25](https://www.bundesliga.com/de/bundesliga/news/trends-saison-2024-25-tore-joker-zuschauer-elfmeter-killer-32319)
- Platzverweise 2024/25: [DFB-Datencenter, Ranglisten Bundesliga 2024/25](https://datencenter.dfb.de/ranglisten/bundesliga/2024-25)
- 2. Liga, Zwischenstand: [bundesliga.com, Rekord verpasst](https://www.bundesliga.com/de/2bundesliga/news/2bl-rekord-verpasst-45-tore-spieltag-treffer-29493)
- Tore nach Halbzeit (Studien mit widersprüchlichen Ergebnissen, nur Zusammenfassungen gelesen): [Studie auf PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5843336), [Heliyon (2024)](https://doaj.org/article/33e83dc64a3a4c1ca05c8fe81ac3ca5a)
- Standards: [bundesliga.com, Standardschützen und Standardtore](https://www.bundesliga.com/de/bundesliga/news/standard-schutzen-freistosse-elfmeter-ecken-clubs-ubersicht-13683), [bundesliga.com, Match Facts Standard-Gefahr](https://www.bundesliga.com/de/bundesliga/news/match-facts-powered-by-aws-standard-gefahr-beste-teams-ecken-freistosse-19171)
- Ecken: [Spreadex, Bundesliga im Ligenvergleich](https://www1.spreadex.com/sports/blog/features/bundesliga-most-exciting-europe-league), [APWin, Eckstatistik](https://www.apwin.com/league/germany/bundesliga/corners/)
- Torhüter, verhinderte Tore: [Football365, Premier-League-Torhüter 2024/25 nach PSxG](https://www.football365.com/news/feature-premier-league-keepers-ranked-2024-25-psxg), [Driblab: Goals Prevented](https://www.driblab.com/blog/goals-prevented-the-real-way-to-know-if-your-goalkeeper-is-winning-games)
- Engine-Grundgerüst Hattrick, Kritik „Drehbuch“, Tempo als Allzweckwaffe: `konzepte/_recherche-genre.md`, Abschnitte 3.3, 4 und 4c
- Torwart-Test, Chancentypen, Spielverlauf: `konzepte/_rohmaterial-logik-v1.md`, Kapitel 5
