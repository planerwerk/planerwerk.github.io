# K08 – Jugend und Talententwicklung

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache, **überarbeitet nach deiner Vorgabe vom 13.11.** (Jugendarbeit als Langzeitprozess, Abschnitt 5.0). Vorläufige Entscheidungen stehen in Abschnitt 12. **Umgesetzt in U9c** (13. November 2026, `js/jugend.js`, Test `tests/jugend.js`): Jugendniveau, Jugendkader, Jahrgang, Aufrücken, Verkauf und Geld bei Abgängen, Prägungen mit Umgang, Belastung junger Spieler, Paten, Jugendtrainer. **Zweite Mannschaft umgesetzt in U9d** (15. November 2026, `js/zweite.js`, Test `tests/zweite.js`, Abschnitt 5.6). Noch offen: Leistungszentrum (K26), Leihe (U10), Ereigniskarten (U12).
Hängt ab von: K03 (Entwicklung, Talent, Persönlichkeit), K07 (Training), K14 (Rolle „Talent“), K15 (Gespräche), K16 (Jugendtrainer) · Wird gebraucht von: K18, K19, K26, K32.

## 1. Ziel und Spielgefühl

- **Junge Spieler verändern sich am schnellsten, in beide Richtungen** (PLAN §2). Ein Debüt im Topspiel kann einen Schub geben, aber auch einen Knacks.
- **Verheizen ist möglich:** zu viele Minuten, zu viel Druck, zu viel Kritik. Schützen ist eine echte Aufgabe.
- **Eigene Talente sind etwas Besonderes:** der Jahrgang, der Junge aus der Region, der Tag, an dem er aufrückt.
- **Unsicherheit:** Wie gut ein 17-Jähriger wird, weiß niemand genau (Talentsterne mit Unschärfe, K03).

## 2. Vorbilder und Abgrenzung

- **Football Manager:** Persönlichkeit treibt die Entwicklung, Mentoren formen sie, Faustregel „15 bis 17 Jahre Training, ab 18 Spiele“, Anlagen und Jugendtrainer als Voraussetzung (Recherche 3.1). Übernommen.
- **Community-Wünsche:** Spätzünder, die mit guter Förderung doch noch Stars werden. „Skandale“ um dein Wunderkind. Ein Leihmanager mit Regeln (Recherche 4b). Übernommen.
- **PLAN §4:** Prägungsereignisse mit Schub oder Knacks, abhängig von Druckresistenz, Note, Spielausgang und deinem Umgang danach. Übernommen als Kern.
- **Bewusst anders:** Jugendmannschaften spielen keine simulierten Spiele. Ihre Entwicklung läuft über Training, Trainer und Anlagen. Das hält das Spiel schnell.

## 3. Begriffe und Daten

| Begriff | Bedeutung | Ort |
|---|---|---|
| Jugendarbeit | Stufe 1–5 (gibt es), künftig Nachwuchsleistungszentrum in K26 | `t.youth` |
| Jugendkader | U19 und U17 als Liste ohne Spiele, je 8–15 Spieler | `S.pl` mit `team` und Kennzeichen `jugend:true` |
| Jahrgang | neue 15-Jährige jeden Sommer | erzeugt am 1. Juli |
| Prägung | Ereignis mit Schub oder Knacks | Spieler `pr` (Verlauf) |
| Belastung junger Spieler | Index aus Minuten, Druck, Kritik | berechnet |
| Pate | Mentor im Profikader für ein Talent | Spieler `pate` |
| Leihe mit Regeln | Spielzeit, Liga, Rückruf | K19, Felder am Leihvertrag |

## 4. Abläufe

1. **Jahrgang** (1. Juli): 3–6 neue 15-Jährige in der U17. Qualität nach Jugendarbeit, Jugendtrainer und Region (5.1). Meldung mit den auffälligsten Namen und unscharfen Sternen.
2. **Entwicklung im Jugendkader:** wie K03, aber Training statt Spielpraxis: Praxisfaktor fest 1,0, Trainingsfaktor aus Jugendtrainer und Jugendarbeit (5.2).
3. **Aufrücken:** Ab 17 kann ein Spieler in den Profikader. Er bekommt einen Profivertrag (K21) und die Rolle „Talent“ (K14). Mit 19 muss er aufrücken oder gehen (Vertrag endet, er wird vereinslos und taucht im Markt auf).
4. **Debüt und Prägungen** im Profikader (5.3).
5. **Leihe** für Spielpraxis (5.5).
6. **Wochenbericht:** Belastung junger Spieler, Prägungen, Fortschritte im Jugendkader.

## 5. Regeln und Formeln

### 5.0 Jugendniveau (deine Vorgabe vom 13.11.)

- **Jugendarbeit ist ein Langzeitprozess.** Jeder Verein hat ein Jugendniveau von 0 bis 100. Die Qualität der Jahrgänge und das Tempo im Jugendkader hängen an diesem Niveau, nicht an den Ausgaben des laufenden Jahres.
- **Die Ausgaben (Stufe 1 bis 5) setzen nur ein Ziel:** 15, 35, 55, 75, 95. Das Niveau bewegt sich jede Woche ein kleines Stück dorthin, höchstens 6 Punkte je Saison nach oben und bis zu 10 nach unten. Von ganz unten bis zum Deckel dauert es knapp zwölf Saisons. Wer spart, verliert schneller, als er aufgebaut hat.
- **Startwert:** 10 + 0,5 × Ansehen (Bayern etwa 57, ein Drittligist um 35).
- **Deckel 70,** bis es das Leistungszentrum gibt (K26). Stufen mit einem Ziel über dem Deckel bringen bis dahin nicht mehr.
- **Nichts wird überdurchschnittlich gut:** Kein Talent liegt mehr als 12 Punkte über der Grundstärke des Vereins.

### 5.1 Qualität des Jahrgangs

**Gebaut (U9c), ersetzt die Formel darunter:**

```
Talent eines Neuen = Grundstärke des Vereins − 12 + (Jugendniveau − 40) × 0,15 + Jugendtrainer/4 + Region + Zufall (−8 bis +12), höchstens Grundstärke + 12
Stärke mit 15 = Talent − 19 bis 29
```

Die Grundstärke des Vereins ist dieselbe wie bei den Aufrückern der Computer-Vereine. Abschlag und Abstand sind so kalibriert, dass die zwei Besten eines Jahrgangs mit 17 im Schnitt den zwei Aufrückern eines Computer-Vereins entsprechen (Stärke 62,0 gegen 61,8, Talent 75,1 gegen 75,3). Region: Vereine ab 40.000 Fans +2.

**Entwurf vom 7.11. (nicht gebaut):**

```
Talent eines Neuen = Basis(Liga) + 3 × Jugendarbeit + Jugendtrainer/4 + Region + Zufall (−8 bis +12)
Stärke mit 15 = Talent − 15 bis 25
```

- **Basis:** 1. Liga 54, 2. Liga 50, 3. Liga 46. Ein Talent von 80 startet mit 15 also bei etwa 55–65 und kann mit der Wachstumsrate aus K03 (etwa +4 pro Saison bis 19, dann +2,6) mit 21 um 77 liegen. Das passt zu den heutigen Nachwuchsspielern, die mit 17 etwa 15–17 Punkte unter der Grundstärke ihres Vereins starten.

- **Region:** Großstadt und Ballungsraum +2, sonst 0.
- **Goldener Jahrgang:** mit 3 % alle Talente eines Jahrgangs +5 (Ereignis).
- Mit Jugendarbeit 5 und gutem Jugendtrainer kommt etwa alle ein bis zwei Jahre ein Spieler, der mit 21 auf Bundesliga-Niveau ist (Ziel in Abschnitt 10).

### 5.2 Entwicklung im Jugendkader

- Wachstum wie K03 §5.1 mit Alter, Talentrest, Form (bei Jugendlichen fest 10) und Professionalität.
- **Trainingsfaktor** = 0,8 + 0,004 × Jugendniveau + 0,01 × Qualität des Jugendtrainers (0,8–1,28). Im Entwurf hing er an der Stufe der Ausgaben.
- **Spielpraxis** zählt bis 18 nur halb (K03 §5.1). Im Jugendkader gilt sie als ausreichend.
- **Mentor im Profikader** (Eigenschaft „Mentor“, K03) als Pate: Wachstum ×1,1, Professionalität des Talents +1 pro Saison mit 30 %.

### 5.3 Prägungsereignisse

**Auslöser** (nur bis 21 Jahre):

| Ereignis | Grundchance Schub | Grundchance Knacks |
|---|---|---|
| Debüt in einem Pflichtspiel | 15 % | 5 % |
| erstes Spiel von Beginn an in einem Topspiel (Derby, Gegner aus den Top 4, Pokal ab Viertelfinale) | 20 % | 12 % |
| entscheidendes Tor (Siegtor, Ausgleich in der Schlussphase) | 30 % | 0 % |
| entscheidender Fehler (Patzer vor Gegentor, verschossener Elfmeter, Platzverweis) | 0 % | 30 % |

**Verschoben durch:**
- **Druckresistenz:** × (0,5 + Druckresistenz/20) für Schub, × (1,5 − Druckresistenz/20) für Knacks
- **Note gegenüber der erwarteten Note** (K04 §5.9): je Notenpunkt besser ×1,3 Schub, schlechter ×1,3 Knacks
- **Spielausgang:** Sieg ×1,2 Schub, Niederlage ×1,2 Knacks
- **Dein Umgang danach** (innerhalb von 3 Tagen, K15 und K29): loben nach gutem Spiel ×1,3 Schub, schützen oder abschirmen nach schlechtem ×0,5 Knacks, öffentlich kritisieren ×2 Knacks
- **Belastung** (5.4): über der Grenze ×1,5 Knacks
- **Sportpsychologe** (K16): Knacks × (1 − 0,02 × Qualität)

**Folgen:**

| | Schub (Durchbruch) | Knacks |
|---|---|---|
| Talent | mit 25 % +2 bis +6 | mit 15 % −1 bis −3 |
| Entwicklung | ×1,3 für 3 Monate | ×0,5 für 1–3 Monate |
| Selbstvertrauen | +1 | −1 |
| Stimmung | +5 | −5 |
| Meldung | Durchbruch, Presse (K29) | Hinweis des Co-Trainers |

Der **Spätzünder** (Community-Wunsch) entsteht so: Ein Spieler mit mittlerem Talent bekommt mit 19–21 einen Schub, der sein Talent hebt.

### 5.4 Verheizen

```
Belastung junger Spieler = Minutenanteil der letzten 8 Wochen + 0,1 × Druckspiele + 0,15 × öffentliche Kritik
Grenze: 0,85 bis 19 Jahre, 1,0 mit 20–21
```

- Über der Grenze: Knacks-Chance ×1,5 (5.3), Verletzungsrisiko ×1,3 (K10), Stimmung −2 pro Woche.
- Druckspiele: Derby, Topspiel, Pokal ab Viertelfinale, Relegation.
- Sichtbar als Regler auf der Spielerkarte mit Warnzone (K35a).

### 5.6 Zweite Mannschaft (U9d, 15.11.)

Deine Vorgabe vom 13.11.: Die zweite Mannschaft in der Regionalliga wird mit Geld besser, alles ist gedeckelt, die Profis bedienen sich hin und wieder bei ihr, auch um direkt weiterzuverkaufen. Wechsel zu Amateuren bringen nichts.

**Wer hat eine Zweite (Websuche vom 15.11., Wikipedia „2026–27 Regionalliga“ und „2026–27 Oberliga“):**

- **Regionalliga (20):** Bayern II, Augsburg II, Nürnberg II, Fürth II (Bayern); Dortmund II, Gladbach II, Köln II, Schalke II, Paderborn II, Bochum II (West); Frankfurt II, Freiburg II, Mainz II, Kaiserslautern II (Südwest); HSV II, Werder II, St. Pauli II, Hannover II (Nord); Hertha II, Magdeburg II (Nordost).
- **3. Liga (2):** Hoffenheim II und Stuttgart II, im Spiel schon seit U1 eigene Vereine.
- **Oberliga (15):** Elversberg, Darmstadt, Karlsruhe, Kiel, Bielefeld, Dresden, Braunschweig (aus der 2. Liga), Düsseldorf, Rostock, Münster, Regensburg, Ingolstadt, Meppen, Verl, Fortuna Köln (aus der 3. Liga).
- **Keine Zweite im Spiel:** Leverkusen (seit 2014 keine), Wolfsburg (2021 abgemeldet), Union (nur ein U21-Perspektivteam ohne Ligabetrieb), Leipzig, Heidenheim, Osnabrück, Cottbus und die übrigen Drittligisten. Zweitmannschaften unterhalb der Oberliga zählen nicht.
- **Regel des DFB** (aus den Suchergebnissen, Wortlaut der Spielordnung nicht gelesen, dfb.de war aus dieser Sitzung nicht erreichbar): Zweite Mannschaften von Drittligisten dürfen nicht in der Regionalliga spielen, zwei Mannschaften eines Vereins nie in derselben Liga, die Zweite eines Lizenzvereins darf in die 3. Liga. Deshalb musste Düsseldorf II im Sommer 2026 trotz Klassenerhalts in die Oberliga.

**Wie sie im Spiel funktioniert (vorläufig, von mir):**

```
Amateurkader: 22 Spieler bis 23 Jahre (U23), höchstens 26, keine simulierten Spiele (wie der Jugendkader)
Stärke = Schnitt der besten 14. Gewertet = min(Stärke, Deckel)
Deckel = min(gutes Team der Liga, Kaderstärke der Profis − 8)        Regionalliga: Schnitt 57, gut 60 · Oberliga: Schnitt 51, gut 54
Neue (jeden Sommer, 18–21 Jahre): Talent = Ligaschnitt + Stufe (−5, −3, −1, +0,5, +2) + Zufall (−4 bis +4), höchstens Deckel + 2
                                   Stärke = Talent − 1 bis 4, je Jahr unter 21 weitere 1,5
Budget: Stufe 1–5, 15.000 bis 120.000 € je Ligaspieltag (Oberliga × 0,3), Trainingsfaktor 0,9 bis 1,1. Start: ab Ansehen 80 Stufe 4, sonst 3
Spielpraxis: die 14 Stärksten 70 (Wachstum ×1,2), die übrigen 35
Saisonende: 18 Teams, Hin- und Rückspiel, Gegner um den Ligaschnitt (Streuung 2,5), erwartete Tore 1,4 × e^(0,08 × Abstand), Heimvorteil 1,1
```

- **Geld wirkt als Prozess:** Das Budget hebt das Talent der Neuen und das Training. Weil jeden Sommer nur fünf bis sieben Neue kommen, dauert der Umschwung von Stufe 1 auf Stufe 5 fünf bis sechs Saisons (gemessen: 52 → 55 → 57 → 57 → 58 → 59 → 60). Im Gleichgewicht: Stufe 1 um 53 (steigt ab), Stufe 3 um 57 (Platz 9), Stufe 5 am Deckel 60 (Platz 5, in 14 % der Saisons Meister).
- **Auf- und Abstieg:** Die letzten drei der Regionalliga steigen in die Oberliga ab, der Oberliga-Meister steigt auf. Die Oberliga ist der Boden. Der Meister der Regionalliga verzichtet vorerst auf die 3. Liga (bis die Regionalliga ausgebaut ist, K32a §12 Nr. 1). Spielt die erste Mannschaft in der 3. Liga, muss die Zweite in die Oberliga und darf nicht aufsteigen.
- **Flüsse:** Aus der Jugend ab 17 in die Zweite (statt mit 19 zu gehen). Aus der Zweiten jederzeit in den Profikader (Profivertrag drei Jahre, halbes Gehalt, die Spielpraxis bleibt). Verkauf ab 18 zum halben Marktwert mit Beteiligung am Weiterverkauf, aber nur ab Stärke 59 (Kaderspieler der 3. Liga). Wer 24 wird, geht zu den Amateuren, ohne Geld.
- **Automatik (K36):** Brauchbare 19-Jährige (höchstens 3 unter der Stärke der Zweiten) gehen in die Zweite, die übrigen wie bisher. Je Sommer rückt höchstens einer auf, der höchstens 4 unter der Kaderstärke der Profis liegt. Das Budget hält der Verein auf der Startstufe.
- **Hoffenheim und Stuttgart:** Solange ihre Zweite in der 3. Liga spielt, ist sie ein Computer-Verein mit eigenem Kader und eigenen Finanzen. Du schickst Jugendspieler mit kleinem Vertrag hin und holst Spieler mit ihrem Vertrag zu den Profis. Steigt sie ab, bleiben die Spieler bis 22 als Amateurkader. Wird sie aus der Regionalliga gelost, nimmt sie den Amateurkader in die 3. Liga mit.

### 5.5 Leihe für Spielpraxis

**Gebaut in U10d (18. November 2026, `js/leihe.js`, Test `tests/leihe.js`), vorläufig:** Leihen nur im Transferfenster und immer bis zum Saisonende. Verleihen an Vereine mit Bedarf; sie übernehmen 100 % des Gehalts, wenn der Spieler um mehr als 2 besser ist als ihre Kaderstärke, 50 % bei ±2, sonst nichts. Vereinbart werden Einsatz (Stammspieler 60 %, Rotation 30 % der Minuten, Meldung ab der achten Woche, wenn es nicht passt), Rückruf im Winterfenster und eine Kaufoption, die der Leihverein zum Saisonende zieht, wenn sie unter seinem Vereinswert liegt. Ausleihen geht bei Spielern, die bei ihrem Verein Ergänzung, Talent, Rotation oder Pokalspieler sind und bei dir mindestens Rotation wären; du zahlst das ganze Gehalt. Nicht gebaut: Leihgebühr, Kaufpflicht, Liga als Bedingung, Beziehung zum Leihverein (K17), Leihmanager (K16), Leihen der Computer-Vereine untereinander (U11).

**Ergänzt in U11d1 (19. November 2026, ohne Testlauf, K31 §5.9):** Computer-Vereine leihen untereinander: Überzählige bis 23 Jahre (der Ausbildungsverein auch Talente) gehen an Vereine mit einer Lücke. Für alle Vereine, auch für dich, gilt das **Leihkontingent** nach FIFA und DFL: höchstens 6 Spieler verliehen und 6 ausgeliehen, höchstens 3 von einem Verein an denselben anderen, Spieler bis 21 zählen nicht. Die Spielerkarte zeigt Leihen zwischen zwei anderen Vereinen jetzt richtig an.


- Leihvertrag (K19) mit Regeln: **Mindest-Spielzeit** (Rolle beim Leihverein), **Liga**, **Rückruf** im Winter ja oder nein.
- Entwicklung beim Leihverein nach K03 mit seiner Spielpraxis und dem Trainingsfaktor des Leihvereins (dessen Stab, K16).
- Hält der Leihverein die Spielzeit nicht ein: Meldung, Rückruf möglich (wenn vereinbart), Beziehung zum Verein − (K17).
- **Leihmanager** (Community-Wunsch): eine Rolle im Stab in Welle 3 (K16 ergänzt), der Leihen nach deinen Regeln sucht und überwacht.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Jugendarbeit erhöhen | bessere Jahrgänge | laufende Kosten (gibt es), später NLZ-Ausbau (K26) |
| guter Jugendtrainer (K16) | schnellere Entwicklung | Gehalt |
| früh bringen | Spielpraxis, Chance auf Schub | Risiko Knacks, Verheizen |
| schützen, abschirmen | weniger Knacks | weniger Spielpraxis, weniger Schübe |
| Pate zuweisen | schnellere Entwicklung, Professionalität | – |
| Leihe | Spielpraxis ohne Druck | Kontrolle abgegeben |
| Geduld erbitten (K15) | Stimmung des Talents | Versprechen |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln. Jahrgänge nach ihrer Jugendarbeit.
- Ausbildungsvereine (Profil K31) bringen Talente früher und verleihen öfter.
- Computer-Trainer achten auf die Belastungsgrenze nach Klugheitsstufe (K02).

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Goldener Jahrgang | 3 % je Sommer | Info, Presse |
| Talent zum Probetraining (Entscheidung) | Zufall, aus PLAN §4 | ansehen (Kosten, Zeit), aufnehmen, ablehnen |
| Großer Verein lockt dein Talent (Entscheidung) | Talent mit hohen Sternen, Vertrag läuft aus | Profivertrag anbieten (K21), ziehen lassen (Ausbildungsentschädigung, K23) |
| Skandal um das Wunderkind | Talent mit Presse-Hype, Partylöwe | Presse (K29), Gespräch (K15) |
| Durchbruch | Schub | Info, Selbstvertrauen, Marktwert |
| Der Knacks | Knacks | Hinweis, Gespräch empfohlen |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | Entwicklung, Talent, Persönlichkeit, Mentor, Volatilität |
| K04 Engine | Note gegenüber der Erwartung für Prägungen |
| K07 Training | Jugendliche entwickeln sich vor allem im Training |
| K10 Medizin | Verletzungsrisiko beim Verheizen |
| K14 Kabine | Rolle „Talent“, Stimmung |
| K15 Gespräche | Geduld erbitten, loben, schützen |
| K16 Stab | Jugendtrainer, Jugendleiter, Psychologe, Leihmanager |
| K17 Beziehungen | Leihvereine |
| K18 Scouting | Jugendscouting, Talente anderer Vereine |
| K19, K21 | Leihe, Profivertrag, Ausbildungsentschädigung |
| K26 Infrastruktur | Nachwuchsleistungszentrum |
| K29 Presse | Abschirmen, Hype, Kritik |
| K32 Welt | neue Spieler in der übrigen Welt (D4: K08 für den eigenen Nachwuchs, K32 für den Rest) |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Ertrag der Jugend | Jugendarbeit 5 mit gutem Jugendtrainer: alle 1–2 Jahre ein Spieler, der mit 21 mindestens 75 Stärke hat. Jugendarbeit 1: höchstens alle 5 Jahre |
| Prägungen | je Verein 2–5 pro Saison |
| Umgang wirkt | „schützen“ senkt die Knacks-Quote gegenüber „kritisieren“ um mindestens die Hälfte |
| Verheizen | junge Spieler über der Belastungsgrenze haben mindestens 1,5-mal so oft einen Knacks |
| Spätzünder | etwa 5 % der Spieler mit 2 Sternen mit 17 erreichen mit 23 die Stärke eines 3- bis 4-Sterne-Talents |
| Welt im Gleichgewicht | zusammen mit K32: Stärke der Ligen über 10 Saisons stabil (K03 §10) |

## 11. Stellschrauben

```js
// Stand des Entwurfs vom 7.11. Die gebauten Werte stehen in daten/regeln.js unter jugend (mit niveau, verkauf, stab).
jugend:{
  jahrgang:{anzahl:[3,6],alter:15,talentBasis:{1:54,2:50,3:46},jeStufe:3,jeTrainer:0.25,region:2,zufall:[-8,12],abstand:[15,25],gold:{chance:0.03,plus:5}},
  aufruecken:{ab:17,spaetestens:19},
  training:{basis:0.8,jeStufe:0.05,jeTrainer:0.01},
  pate:{wachstum:1.1,profi:0.3},
  praegung:{debuet:[0.15,0.05],topspiel:[0.20,0.12],tor:[0.30,0],fehler:[0,0.30],
    druck:{schub:[0.5,0.05],knacks:[1.5,-0.05]},note:1.3,sieg:1.2,niederlage:1.2,
    umgang:{loben:1.3,schuetzen:0.5,kritik:2},belastung:1.5,psychologe:-0.02,
    schub:{talent:[0.25,2,6],tempo:1.3,monate:3,sv:1,stimmung:5},knacks:{talent:[0.15,1,3],tempo:0.5,monate:[1,3],sv:-1,stimmung:-5},bisAlter:21},
  belastung:{wochen:8,druck:0.1,kritik:0.15,grenze:{19:0.85,21:1.0},knacks:1.5,verletzung:1.3,stimmung:-2}
}
```

`saison.nachwuchs` aus der heutigen `regeln.js` geht darin auf.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Jugendkader ohne simulierte Spiele.** Entwicklung über Training. Spart Rechenzeit und Halte.
2. **Aufrücken spätestens mit 19,** sonst endet der Vertrag.
3. **Leihmanager** als zusätzliche Rolle im Stab in Welle 3 (Community-Wunsch), K16 wird ergänzt.
4. **Talentwerte des Jahrgangs** sind Spielwerte und werden mit K32 so kalibriert, dass die Welt im Gleichgewicht bleibt.

**Mit dir entschieden (13.11.) und in U9c gebaut:** Jugendarbeit wirkt als Langzeitprozess (5.0). Aufrücken und Verkauf direkt aus der Jugend. Geld auch für Abgänge, die bei dir kein Profi wurden, nichts bei Amateuren. Zweite Mannschaft und Leistungszentrum folgen (U9d, K26).

**Vorläufig entschieden bei der Umsetzung (U9c, 13. November 2026):**

5. **Nur dein Verein hat einen Jugendkader.** Computer-Vereine bekommen weiter jeden Sommer zwei 17-Jährige (`saison.nachwuchs`). Das spart Speicher und Rechenzeit. Nach einem Vereinswechsel entsteht beim neuen Verein ein neuer Jugendkader.
6. **Jugendkader:** vier Jahrgänge von 15 bis 18, anfangs die älteren ausgedünnt (100, 90, 75, 60 %). Jugendspieler stehen nicht im Profikader und haben einen eigenen Nummernkreis ab 500.000.
7. **Aufrücken** ab 17 mit Profivertrag über drei Jahre und 30 % des üblichen Gehalts. Wer am 1. Juli 19 wird und nicht aufgerückt ist, geht. Vier Wochen vor Saisonende erinnert eine Nachricht.
8. **Geld bei Abgängen:** Verkauf aus der Jugend ab 16 zum halben Marktwert. Abgang mit 19: 60 % davon als Ausbildungsentschädigung. Liegt der Preis unter 100.000 €, nimmt ihn kein Profiverein, er geht zu den Amateuren und bringt nichts. Beteiligung am Weiterverkauf: 15 %, fünf Jahre lang, je Jahr 12 % Chance auf einen Wechsel für das 1,5- bis 4-Fache des damaligen Werts (im Schnitt knapp 20 % des Werts je Abgang). Verkaufte und abgegangene Jugendspieler verlassen die simulierte Welt.
9. **Automatik (K36):** Führt der Verein den Jugendkader, holt er am 1. Juli die zwei Besten ab 17 hoch, wie die Computer-Vereine. Führst du ihn selbst, rückt niemand von allein auf.
10. **Prägungen** gelten für alle Vereine und Spieler bis 21. Bei deinen Spielern bleibt eine Prägung drei Tage offen, dein Umgang zählt: Lob nach gutem Spiel ×1,3 Schub, „Druck nehmen“ nach schlechtem ×0,5 Knacks, Kritik im Einzelgespräch ×1,5 Knacks (öffentliche Kritik ×2 kommt mit K29). Computer-Vereine lösen sofort auf, ohne Umgang.
11. **Anlässe:** Debüt (erstes Profi-Pflichtspiel), erstes Topspiel von Beginn an (Gegner unter den ersten vier ab dem 5. Spieltag, Pokal ab Viertelfinale, Relegation, Supercup), entscheidendes Tor (Führung zum Sieg mit einem Tor Unterschied, Ausgleich ab der 80. Minute), entscheidender Fehler (Platzverweis; ohne Sieg: verschossener Elfmeter, Torwartpatzer). Das Derby fehlt, bis K27 Rivalen kennt.
12. **Gemessen:** 2,3 Prägungen je Verein und Saison (Ziel 2 bis 5), ohne die Grundchancen zu ändern.
13. **Belastung junger Spieler:** Minutenanteil (der gleitende Schnitt aus K14) plus 0,1 je Druckspiel der letzten acht Wochen. Über der Grenze: Knacks ×1,5 bei allen, Stimmung −2 pro Woche und Verletzungsrisiko ×1,3 **nur bei deinem Verein**, weil Computer-Trainer noch nicht darauf achten (K31).
14. **Paten:** Ein Mentor (Eigenschaft, jetzt sichtbar) betreut höchstens zwei Talente bis 21. Entwicklung ×1,1, je Saison mit 30 % ein Punkt Professionalität.
15. **Jugendtrainer** ist eine neue Rolle im Stab (zwei Plätze, K16). Bestehende Spielstände bekommen sie nachgetragen.
16. **Ertrag:** Ein Verein aus dem Mittelfeld der 1. Liga bekommt mit Niveau 70 und gutem Jugendtrainer in 52 % der Jahrgänge einen Spieler, der mit 21 mindestens 75 hat, mit Niveau 10 ohne Jugendtrainer nie.
17. **Noch nicht gebaut:** zweite Mannschaft (seit U9d gebaut, Nr. 18 bis 31), Leistungszentrum (K26), Leihe, Leihmanager und Leihwunsch (U10), Ereigniskarten Probetraining, Abwerben und Skandal (U12) (Probetraining seit K08b, 22.11.2026, ohne Testlauf: Karte „Talent zum Probetraining“, 5.000 € in der 3. Liga, mit 60 % kommt ein 16-Jähriger mit Talent des Jahrgangs + 6 in deinen Jugendkader, neue Kartenwirkung `talent`; „Großer Verein lockt dein Talent“ seit K08c: Talent ab 17 mit Talent ab Kaderschnitt + 3, Verein mit mindestens 10 mehr Ansehen; Profivertrag (Wirkung `jugendHoch`, nur mit Platz im Kader) oder ziehen lassen (Wirkung `jugendWeg`: Wechsel zum Verein, Ausbildungsentschädigung nach `jugendPreis`, Weiterverkaufsbeteiligung 15 % wie K19d)), öffentliche Kritik und Abschirmen (K29), Derby als Topspiel (K27), Computer-Trainer achten auf die Belastung (K31), Spätzünder als eigene Messung über viele Saisons.

**Vorläufig entschieden bei der Umsetzung der zweiten Mannschaft (U9d, 15. November 2026):**

18. **Nur dein Verein hat einen Amateurkader** (wie beim Jugendkader, Nr. 5). Computer-Vereine bekommen weiter ihre zwei Aufrücker. Hoffenheim II und Stuttgart II bleiben eigene Vereine.
19. **Welche Vereine eine Zweite haben,** steht in `daten/vereine.js` (Feld `zw`, Oberliga mit Namen in `ol`), Stand 2026/27 nach Websuche. Ohne Zweite bleibt es bei U9c: Wer mit 19 nicht aufrückt, geht. Eine Zweite gründen geht nicht (eine neue Zweite müsste ganz unten anfangen), die Leihe kommt mit U10.
20. **Keine simulierten Spiele:** Die Zweite spielt wie der Jugendkader keine Spiele. Am Saisonende zählt ihre gewertete Stärke im Schnitt der Saison. Wer ihr mitten in der Saison die Besten wegnimmt, macht sie schlechter.
21. **Ligastärken** sind an der 3. Liga im Spiel gemessen (Schnitt 63, Schlusslicht um 59): Regionalliga Schnitt 57, gutes Team 60, Oberliga 51 und 54. Spielwerte, nicht recherchiert.
22. **Deckel:** gewertet höchstens wie ein gutes Team der Liga und immer mindestens 8 unter der Kaderstärke der Profis. Das Talent der Neuen ist ebenfalls gedeckelt (Deckel + 2), sonst wuchsen sie in einer Saison auf Drittliga-Niveau (gemessen: 63 bis 65 statt 60).
23. **Budget:** fünf Stufen, Kosten je Ligaspieltag, in der Oberliga 30 %. Start und Automatik: ab Ansehen 80 Stufe 4, sonst Stufe 3. Mit Stufe 2 als Start wären Augsburg II und Hertha II in jeder dritten Saison abgestiegen.
24. **Erster Kader:** 22 Spieler von 18 bis 23, die Älteren mit den Jahren in der Zweiten gewachsen (wie der erste Jugendkader). Er liegt zu Beginn etwa einen Punkt unter dem Saisonschnitt späterer Jahre.
25. **Regionalliga-Meister verzichtet** auf die 3. Liga, bis die Regionalliga simuliert wird. Ausnahme: Hoffenheim II und Stuttgart II stehen im Regionalliga-Pool und können wie bisher gelost werden.
26. **Oberliga als Boden:** Die Zweite steigt nicht in die Verbandsliga ab, weil es sie im Spiel nicht gibt. Nach einem Abstieg aus der Regionalliga heißt ihre Liga „Oberliga“, außer der Verein hat einen echten Oberliga-Namen in den Daten.
27. **Verkauf nur ab Stärke 59:** Ohne diese Schwelle hätte fast jeder Amateur über 200.000 € gebracht (ein 23-Jähriger mit Stärke 40 rund 210.000 €), und jeden Sommer kämen 22 kostenlose Neue nach. Der Marktwert im unteren Bereich ist für K23 zu prüfen.
28. **Kein Geld mit 24:** Amateurverträge laufen aus. Die Ausbildungsentschädigung der FIFA hängt am ersten Profivertrag, gezählt wird die Ausbildung zwischen 12 und 23 Jahren (laut Suchergebnissen, den Wortlaut von Anhang 4 des FIFA-Reglements habe ich nicht gelesen). Vorläufig bringt ein Abgang mit 24 deshalb nichts.
29. **Profis in die Zweite abstellen** (gebaut in U10d, 18.11.): Spieler bis 23 behalten Vertrag und Gehalt (das du weiter zahlst), bekommen in der Zweiten Spielpraxis und kehren mit „Aufrücken“ oder automatisch mit 24 zurück. Zusagen an sie werden hinfällig, Lernziel und Umschulung entfallen. Bei Hoffenheim und Stuttgart gehen sie zum Verein in der 3. Liga.
30. **Wertung über die Saison statt Spieltage:** Platz und Punkte erscheinen erst am Saisonende (Nachricht und Saisonbilanz). Eine Tabelle der Regionalliga mit echten Gegnern gibt es nicht.
31. **Lizenz (K36):** zwei neue Bereiche, `zweite` (Budget) und `zweitekader` (Wechsel aus der Jugend, Aufrücken, Verkauf), beide B-Lizenz mit Automatik.

**Noch zu recherchieren:** Regeln zu Ausbildungsentschädigung und zu deutschen beziehungsweise lokal ausgebildeten Spielern im Kader (DFL), falls sie ins Spiel sollen.

## Quellen

- Persönlichkeit, Mentoren, Faustregel Training vor Spielen: `konzepte/_recherche-genre.md`, Abschnitt 3.1
- Spätzünder, Skandale ums Wunderkind, Leihmanager: `konzepte/_recherche-genre.md`, Abschnitt 4b
- Prägung, Verheizen, Leihe: PLAN §4 (Notizen zu K08)
