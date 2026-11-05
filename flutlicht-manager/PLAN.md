# Flutlicht Manager – Logik-Plan (ausführlich)

Stand: 5. November 2026. Dieser Plan beschreibt nur die Spiellogik. Oberfläche und Look kommen später.
Jede Stufe ist ein eigener Arbeitsschritt, am besten jeweils in einer neuen Session mit dem Auftrag „Stufe X aus PLAN.md“.

> **Hinweis zu Regelangaben:** Angaben mit **(prüfen)** sind echte Fußballregeln, die ich vor der Umsetzung nachschlage.
> Alle Zahlen in diesem Plan sind Startwerte. Sie liegen später in `daten/regeln.js` und werden per Simulation eingestellt.

---

## 1. Warum die heutige Logik nicht trägt

### 1.1 Der Torwart-Effekt (dein Beispiel)

- Der Torwart macht 30 % des Abwehrwerts aus, ein einzelner Spieler also fast ein Drittel der ganzen Defensive.
- Die Torformel nimmt das Stärkeverhältnis hoch 4. Kleine Unterschiede werden dadurch riesig.
- Beispiel aus der 2. Liga, Torwart 66 → 84:
  - Der Abwehrwert steigt um etwa 8 %.
  - Die erwarteten Gegentore sinken um etwa 26 %, also von ungefähr 1,3 auf 0,95 pro Spiel.
  - In der Realität verhindert ein Spitzentorwart gegenüber einem durchschnittlichen etwa 0,1 bis 0,3 Tore pro Spiel. Das Spiel übertreibt also ungefähr um das Doppelte. (Größenordnung prüfen)
- **Rückkopplung über die Form:** Siege bringen gute Noten, gute Noten bringen Form, Form macht stärker, das bringt Siege. Wer einmal oben ist, bleibt oben.
- **Keine Eingewöhnung:** Ein neuer Spieler bringt sofort seine volle Leistung, und das Mannschaftsgefüge bleibt unverändert.

### 1.2 Weitere Grundfehler

- **Transfers wirken sofort:** Angebot abgeben, fertig. Es gibt keine Verhandlung, keine Konkurrenz, keine Zeit und keine Nebenkosten.
- **Zufall falsch dosiert:** Bei großem Stärkeunterschied bleibt kaum Zufall übrig, weil ihn die Potenz 4 wegdrückt. Bei gleich starken Teams gibt es keinen Tagesform-Faktor.
- **Taktik:** nur feste Zu- und Abschläge, ohne Wechselwirkung mit dem Gegner.
- **Karten:** Sperren werden pauschal ausgewürfelt. Es gibt keine Foularten und kein Sportgericht.
- **Computer-Vereine** kaufen und verkaufen fast zufällig, ohne Kaderplanung.
- **Zeit:** Es gibt nur Wochen-Schritte. Prozesse über mehrere Wochen (Verhandlungen, Sportgericht, Reha) lassen sich so nicht abbilden.

---

## 2. Grundsätze für die neue Logik

1. **Jedes Ergebnis = Erwartung + Zufall.** Wie stark der Zufall wirkt, ist für jede Stelle festgelegt und in `regeln.js` einstellbar.
   - Bei gleich starken Teams ist der Ausgang fast offen.
   - Bayern gegen einen Amateurklub ist deutlich, aber eine Restwahrscheinlichkeit für eine Überraschung bleibt immer.
2. **Kein Einzelspieler entscheidet allein.** Jeder Einfluss hat abnehmenden Ertrag und eine Obergrenze.
3. **Veränderungen brauchen Zeit:** Eingewöhnung, Taktik-Vertrautheit, Trainingswirkung, Verhandlungen.
4. **Computer-Vereine spielen nach denselben Regeln wie du,** ohne versteckte Hilfen.
5. **Kalibrierung gegen echte Statistik:** Für jeden Bereich gibt es Zielwerte und ein Testskript, das sie mit vielen Simulationen prüft.
6. **Reproduzierbarer Zufall:** Ein Zufallsgenerator mit Startwert (Seed), der im Spielstand gespeichert wird. Tests sind dadurch wiederholbar, und Fehler lassen sich nachstellen.

---

## 3. Zeitmodell (Grundlage für Prozesse)

- **Kalender in Tagen:** Die Saison läuft vom 1. Juli bis 30. Juni.
- **Ereignisse liegen an Tagen:**
  - Liga am Wochenende, Pokal und englische Wochen dienstags/mittwochs
  - Trainingstage Montag bis Freitag
  - Sportgericht montags bis donnerstags
  - Transferfenster
  - Fristen in Verhandlungen
- **„Weiter“** springt zum nächsten Ereignis, das eine Entscheidung braucht oder eine Meldung bringt. Alternativ: Tag für Tag oder bis zum nächsten Spiel.
- **Transferfenster:** etwa 1. Juli bis Anfang September und Januar (Daten prüfen). Außerhalb dürfen nur Vereinslose wechseln. Verhandeln darf man immer, wirksam wird ein Wechsel erst im Fenster.
- **Wochenrhythmus:** Mehr als eine Partie pro Woche kostet Frische, und das Training wird dann kürzer.

---

## 4. Spielermodell

### 4.1 Sichtbare Fähigkeiten (1–99)

| Feldspieler | Torwart |
|---|---|
| Technik (Ballkontrolle, Pass) | Reflexe (Linie) |
| Tempo (Antritt, Laufstärke im Sprint) | Strafraumbeherrschung (Flanken, Herauslaufen) |
| Zweikampf (Tackling, Kopfball, Körper) | Spielaufbau (Abwurf, Fuß) |
| Abschluss (Torschuss) | |
| Spielintelligenz (Stellungsspiel, Entscheidungen) | |

- **Gesamtstärke** = positionsabhängiger gewichteter Schnitt. Beispiel Innenverteidiger: Zweikampf 35 %, Spielintelligenz 30 %, Tempo 20 %, Technik 15 %.
- **Positionen:** eine Hauptposition und bis zu zwei Nebenpositionen mit Eignung 60–95 %.
  - Mit Rollen: TW, IV, AV, DM, ZM, OM, Flügel, ST.
  - Die grobe Einteilung TW/AB/MF/ST bleibt für die Anzeige.

### 4.2 Versteckte Werte (nicht direkt sichtbar, erkennbar nur über Scouting und Verhalten)

| Wert | Wirkung |
|---|---|
| Talent (Obergrenze) | maximale Gesamtstärke |
| Professionalität | Trainingswirkung, Verletzungsrisiko, Verhalten außerhalb des Platzes |
| Ehrgeiz | will spielen und gewinnen; reagiert stärker auf Bankplatz und Misserfolg |
| Loyalität | bleibt eher, verlangt weniger, schwerer abzuwerben |
| Temperament | Karten, Tätlichkeiten, Reaktion auf Kritik |
| Druckresistenz | Leistung in engen Spielen und Derbys, beim Elfmeter |
| Verletzungsanfälligkeit | Häufigkeit und Rückfallrisiko |
| Anpassungsfähigkeit | Dauer der Eingewöhnung |

### 4.3 Veränderliche Zustände

| Zustand | Bereich | Ändert sich durch |
|---|---|---|
| Frische | 0–100 % | Spiele (Minuten × Laufintensität), Training, Regeneration, Reisen |
| Fitnessniveau (Kondition) | 1–99 | Konditionstraining, Pausen, Verletzungen, Alter |
| Form | −3 bis +3 | gleitender Schnitt der letzten 5 Noten, gedämpft, mit Rückkehr zum Mittel |
| Selbstvertrauen | −3 bis +3 | Tore, Fehler, Lob, Kritik |
| Stimmung | 0–100 | siehe Kapitel 9 |
| Integration | 0–100 % | Neuzugänge, siehe 4.4 |
| Spielpraxis | 0–100 % | Minuten in den letzten Wochen; ohne Praxis sinkt die Leistung |
| Verletzung, Sperre | Art, Tage | siehe Kapitel 6 und 7 |

**Wichtig gegen Rückkopplung:** Die Form hängt an der **eigenen** Note, und die Note hängt vor allem an der eigenen Leistung im Spiel, nicht am Endergebnis. Zusätzlich zieht die Form langsam zur Mitte zurück.

### 4.4 Eingewöhnung von Neuzugängen

- **Startwert der Integration:**
  - gleiche Liga und gleiches Land: 70 %
  - neue Liga: 55 %
  - neues Land oder neue Sprache: 35 %
  - Wirkung von Anpassungsfähigkeit und Charakter: ±15 %
- **Anstieg** etwa 4–10 % pro Woche mit Einsatzzeit, weniger ohne.
- **Leistung im Spiel** = Fähigkeit × (0,85 + 0,15 × Integration). Ein Neuzugang bringt also anfangs bis zu 15 % weniger.
- **Mannschaftsgefüge:** sinkt kurz mit jedem neuen Stammspieler und steigt mit gemeinsamer Spielzeit. Wirkung auf das ganze Team: ±3 %.

### 4.5 Informationsnebel (Scouting)

- Werte fremder Spieler siehst du nur als Spanne, zum Beispiel „Technik 70–80“.
- Die Spanne wird schmaler mit:
  - Beobachtung durch Scouts (Wochen, Kosten)
  - Spielen gegen ihn
  - gleicher Liga
- Bei eigenen Spielern sind die sichtbaren Werte genau. Versteckte Werte zeigen sich nur in Tendenzen, zum Beispiel „gilt als launisch“.

---

## 5. Match-Engine

### 5.1 Ablauf pro Minute

- **Spieldauer:** 90 Minuten plus Nachspielzeit. Die Nachspielzeit hängt von der Zahl der Unterbrechungen ab, etwa 1–4 und 3–8 Minuten.
- **Ballbesitz-Phase:** Das Mittelfeld-Duell entscheidet, wer die Minute gestaltet. Es hängt ab von Technik, Spielintelligenz, Spielstil und Frische.
- **Angriffsversuch:** Ob daraus eine Torchance wird, entscheidet der Vergleich Angriff gegen Abwehr, abhängig vom Spielstil.
- **Chancentyp und Torwahrscheinlichkeit (Startwerte):**

  | Typ | Torwahrscheinlichkeit |
  |---|---|
  | Großchance | ≈ 0,35 |
  | Halbchance | ≈ 0,12 |
  | Fernschuss | ≈ 0,04 |
  | Kopfball nach Standard | ≈ 0,09 |
  | Elfmeter | ≈ 0,76 |

- **Abschluss:** Schütze und Torwart verändern die Torwahrscheinlichkeit. Der Torwart-Effekt ist gedeckelt auf etwa ±15 %. So verhindert ein Spitzentorwart pro Saison spürbar Tore, macht ein Team aber nicht unschlagbar.
- **Nebenereignisse:** Fouls, Karten, Verletzungen, Abseitstor, Videobeweis (selten) und Standards.

### 5.2 Teamwerte mit abnehmendem Ertrag

- Ein Mannschaftsteil ist kein reiner Durchschnitt. Das schwächste Glied wird stärker gewichtet, damit Lücken auffallen.
- Jeder einzelne Spieler kann einen Mannschaftsteil höchstens um etwa 6 % heben.

### 5.3 Zufallsquellen (alle einstellbar)

| Quelle | Wirkung | Startwert |
|---|---|---|
| Tagesform Team | pro Spiel ein Faktor um 1,0 | Streuung ±5 % |
| Tagesform Spieler | pro Spiel und Spieler | Streuung ±8 % |
| Minutenzufall | jede Phase wird gewürfelt | – |
| Chancenverwertung | jede Chance wird gewürfelt | – |
| Schiedsrichter | Strenge bei Karten und Elfmetern | Profil pro Schiedsrichter |
| Wetter/Platz | z. B. Regen: weniger Technik, mehr Fehler | selten |

### 5.4 Zielwerte für die Kalibrierung (mit echten Daten abgleichen)

| Paarung | Sieg Favorit | Remis | Sieg Außenseiter |
|---|---|---|---|
| gleich stark, Heimspiel | ≈ 45 % | ≈ 27 % | ≈ 28 % |
| leichter Favorit (Mittelfeld gegen Abstiegskandidat) | ≈ 55 % | ≈ 25 % | ≈ 20 % |
| klarer Favorit (Top 3 gegen Abstiegskandidat) | ≈ 70 % | ≈ 17 % | ≈ 13 % |
| sehr großer Unterschied (Bayern gegen untere 2. Liga) | ≈ 80 % | ≈ 12 % | ≈ 8 % |
| Pokal, Bundesliga gegen Amateur, inkl. Verlängerung und Elfmeter | ≈ 90–93 % weiter | – | ≈ 7–10 % Aus |

Weitere Zielwerte pro Saison:
- **Tore:** etwa 2,9–3,2 pro Spiel. Heimsieg etwa 43–46 %, Remis 24–28 %.
- **Punkte:** Meister 70–85, Letzter 15–30.
- **Überraschungen:** Mindestens ein Spitzenteam verliert pro Saison gegen ein Team aus der unteren Tabellenhälfte, und das mehrmals.

### 5.5 Spielverlauf-Effekte

- **Führung:** Das führende Team wird automatisch etwas vorsichtiger, das zurückliegende öffnet sich. Gegen Spielende werden die Spiele dadurch offener.
- **Rote Karte:** Das Team stellt um. Im Schnitt sinkt die Torchance des Teams um etwa 25 %, die des Gegners steigt um etwa 20 %.
- **Ermüdung:** Die Frische sinkt pro Minute je nach Kondition, Pressing und Einsatz. Ab etwa 60 % Frische sinkt die Leistung deutlich, und das Verletzungsrisiko steigt.
- **Druck:** In den Schlussminuten bei knappem Stand und in Derbys hilft Druckresistenz. Erfahrung hilft ebenfalls.

### 5.6 Akzeptanztest gegen dein Torwart-Beispiel

Ein Team aus der Mitte der 2. Liga bekommt einen 1.-Liga-Torwart, simuliert über 200 Saisons.
- **Ziel:** im Schnitt höchstens +4 bis +6 Punkte pro Saison und höchstens 0,25 Gegentore weniger pro Spiel.
- **Aufstieg** nur in einem kleinen Teil der Saisons. Kein „verliere kein Spiel mehr“.

---

## 6. Fouls, Karten und Sportgericht

### 6.1 Fouls

- **Pro Minute** gibt es Zweikämpfe, Fouls entstehen daraus. Die Wahrscheinlichkeit hängt ab von Zweikampf-Wert, Temperament, Einsatz, Frische, Spielstand, Derby und Schiedsrichter.
- **Schwere eines Fouls:**

  | Schwere | Häufigkeit | Folge |
  |---|---|---|
  | normal | häufig | meist keine Karte |
  | taktisch | regelmäßig | häufig Gelb |
  | rücksichtslos | gelegentlich | Gelb oder Rot |
  | brutal | sehr selten | Rot |

- **Dazu kommen:**
  - Notbremse (Torchance verhindert)
  - Handspiel auf der Linie
  - Unsportlichkeit, Meckern
  - Tätlichkeit (Schlag, Treten ohne Ball), ligaweit etwa einmal pro Saison

### 6.2 Karten

- **Gelb** wird pro Wettbewerb gezählt. Gelbsperre in der Liga nach der 5., 10. und 15. Gelben Karte (prüfen). Im Pokal gilt eine eigene Regel (prüfen).
- **Gelb-Rot:** automatisch ein Spiel Sperre (prüfen).
- **Rot:** Das Sportgericht entscheidet über die Strafe (6.3). Bis zum Urteil ist der Spieler mindestens im nächsten Spiel gesperrt.
- **Geltungsbereich:** Sperren gelten pro Wettbewerb (prüfen, ob Liga-Rot auch im Pokal sperrt).

### 6.3 Sportgericht (Prozess über mehrere Tage)

- **Ablauf:**
  - Tag 1–2 nach dem Spiel: Anklage durch den Kontrollausschuss mit Strafantrag.
  - Der Verein kann zustimmen, dann gilt die Strafe sofort, oder widersprechen. Bei Widerspruch kommt es zur Verhandlung.
  - Das Urteil fällt nach etwa 3–10 Tagen. Bis dahin bleibt der Spieler vorläufig gesperrt.
- **Strafmaß** = Grundstrafe nach Art, Zuschläge für Wiederholungstäter, Verletzungsfolgen beim Gegner und Zufall:

  | Vergehen | Grundstrafe (Spiele) | Spanne | Häufigkeit (Ziel) |
  |---|---|---|---|
  | Notbremse, Handspiel auf der Linie | 1 | 1–2 | regelmäßig |
  | grobes Foulspiel | 2 | 1–4 | gelegentlich |
  | Unsportlichkeit gegen Schiedsrichter | 2 | 1–5 | selten |
  | Tätlichkeit | 4 | 3–6 | etwa 1 pro Saison ligaweit |
  | schwere Tätlichkeit, Angriff auf Schiedsrichter | 8+ | 6–12+ | extrem selten |

- **Widerspruch** kostet Anwaltsgebühren. Ergebnis: Strafe bleibt (häufig), wird gemindert (gelegentlich) oder erhöht (selten).
- **Geldstrafen:**
  - für den Spieler, wird intern weitergegeben
  - für den Verein, z. B. bei Rudelbildung
- **Zuschauer-Vergehen** wie Pyrotechnik: Geldstrafe. Bei Wiederholung Teilausschluss von Zuschauern, das kostet Einnahmen.
- **Zielwerte pro Saison:** Platzverweise ligaweit in realistischer Größenordnung (prüfen), Gelb pro Team und Spiel etwa 1,5–2,2.

---

## 7. Verletzungen

- **Auslöser:**
  - Fouls, je nach Schwere
  - Belastung: niedrige Frische, hartes Training, englische Wochen
  - Zufall
  - Verletzungsanfälligkeit
- **Arten (Startwerte):**

  | Art | Ausfall | Häufigkeit |
  |---|---|---|
  | Prellung | 0–7 Tage | häufig |
  | Zerrung | 1–3 Wochen | häufig |
  | Muskelfaserriss | 3–6 Wochen | regelmäßig |
  | Bänderverletzung | 3–8 Wochen | regelmäßig |
  | Knochenbruch | 6–12 Wochen | selten |
  | Meniskus | 6–14 Wochen | selten |
  | Kreuzbandriss | 6–10 Monate | wenige pro Saison ligaweit |

- **Diagnose:** Erst kommt eine Spanne („fällt 2–4 Wochen aus“), die genaue Dauer steht nach 1–3 Tagen fest.
- **Reha:** Die Qualität der medizinischen Abteilung (kostet Geld) verkürzt die Ausfallzeit um bis zu 20 %.
- **Rückkehr:** Danach gelten verminderte Frische, fehlende Spielpraxis und ein Rückfallrisiko für einige Wochen.
- **„Fit spritzen“** ist möglich, wirkt aber nicht bei allen Arten. Dafür steigt das Risiko einer schlimmeren Verletzung.
- **Verletzung im Spiel:** Der Spieler muss raus. Ohne verbliebene Wechsel spielt das Team zu zehnt.

---

## 8. Live-Spiel: Halbzeit, Wechsel, Eingreifen

- **Dein Spiel läuft live** Minute für Minute. Die anderen Spiele der Konferenz werden vorab berechnet, weil dort niemand eingreift.
- **Pause** ist jederzeit möglich. Bei wichtigen Ereignissen (Tor, Rote Karte, Verletzung) hält das Spiel auf Wunsch automatisch an.
- **Halbzeit:**
  - Statistik: Torschüsse, Ballbesitz, Zweikämpfe, Noten-Tendenz, Frische.
  - Ansprache: loben, motivieren, fordern, beruhigen oder Taktik betonen.
  - Die Wirkung hängt von Spielstand, Charakter der Spieler und Glaubwürdigkeit ab. Wer zu oft dasselbe sagt, verliert an Wirkung. Sie wirkt auf Selbstvertrauen, Stimmung und den Einsatz in der zweiten Halbzeit.
- **Wechsel:**
  - 5 Wechsel in höchstens 3 Unterbrechungen, die Halbzeit zählt nicht mit (prüfen). Bankgröße prüfen.
  - Eingewechselte Spieler sind frisch. Ohne Aufwärmen ist das Risiko leicht höher, zum Beispiel bei einem Wechsel direkt nach einer Verletzung.
- **Taktik im Spiel:** Spielstil, Einsatz, Grundordnung und die Anweisung „Zeit schinden“ lassen sich ändern. Eine Umstellung braucht einige Minuten, bis sie voll wirkt.
- **Computer-Trainer** entscheiden nach Regeln mit Zufall:
  - müde Spieler zwischen der 55. und 80. Minute raus
  - bei Rückstand offensiver
  - bei Gelb-Rot-Gefahr einen Spieler schützen
  - bei Führung defensiver
- **Folgen für Spieler:** Minuten und Note fließen in Spielpraxis, Stimmung und Frische ein. Ein Wechsel kann die Stimmung drücken, etwa bei einem ehrgeizigen Spieler, der früh raus muss.

---

## 9. Stimmung, Kabine, Gespräche

### 9.1 Stimmung eines Spielers (0–100)

Gewichteter Schnitt mit Trägheit, sie ändert sich also nur langsam:

| Teil | Beispiel |
|---|---|
| Einsatzzeit gegenüber Erwartung | Ein Stammspieler auf der Bank verliert stark, ein Talent mit Einsätzen gewinnt. |
| Mannschaftserfolg | Siegesserien, Tabellenplatz gegenüber Erwartung |
| eigene Leistung | Noten, Tore |
| Vertrag und Gehalt | Gehalt im Vergleich zu Teamkollegen gleicher Stärke, Restlaufzeit |
| Verhältnis zum Trainer | Ansprachen, Kritik, gehaltene oder gebrochene Versprechen |
| Umfeld | Medien, Fans, Heimweh bei Neuzugängen aus dem Ausland |

### 9.2 Folgen

- **Leistung:** Bei sehr schlechter Stimmung etwa −3 %, bei sehr guter etwa +2 %. Sie ist kein Haupthebel.
- **Training:** Unzufriedene trainieren weniger effektiv.
- **Wechselwunsch in Stufen:**
  1. Grummeln, intern
  2. Gesprächswunsch
  3. offizieller Wechselwunsch
  4. öffentliche Äußerung in den Medien, das drückt die Stimmung im Team
- **Vertrag:** Unzufriedene verlängern nicht oder nur zu hohen Bedingungen.

### 9.3 Kabine

- **Mannschaftsstimmung** = Schnitt der Spieler, Führungsspieler zählen mehrfach.
- **Ansteckung:** Ein unzufriedener Führungsspieler zieht andere mit, ein zufriedener stabilisiert.
- **Kapitän:** Die Wahl wirkt auf die Stimmung, ebenso eine spätere Absetzung.

### 9.4 Gespräche unter vier Augen

Mögliche Themen:
- Einsatz versprechen: wird überwacht. Gebrochen kostet viel Stimmung und Glaubwürdigkeit.
- Geduld erbitten.
- Rolle erklären.
- Verlängerung anbieten.
- Wechsel in Aussicht stellen: senkt die Ablöse, beruhigt den Spieler.
- Kritik.

Die Antwort hängt vom Charakter ab und wird nach Gesprächsverlauf ausgewürfelt.

---

## 10. Training

- **Wochenplan:** Einheiten Montag bis Freitag, bei englischen Wochen weniger.
- **Einheiten:** je Einheit ein Schwerpunkt und eine Intensität:
  - Kondition
  - Technik
  - Zweikampf
  - Abschluss
  - Spielintelligenz/Taktik (erhöht die Vertrautheit mit dem gewählten Spielstil)
  - Standards (eigene und gegnerische)
  - Torwarttraining
  - Regeneration
  - Spielformen/Testspiel (Spielpraxis für Reservisten)
- **Wirkung pro Einheit auf eine Fähigkeit:**
  `Grundrate × Altersfaktor × Talent-Rest × Professionalität × Intensität × Trainerqualität × Zufall`
  - Altersfaktor: unter 21 hoch, ab 30 negativ.
  - Talent-Rest: Abstand zur Obergrenze. Je näher an der Grenze, desto langsamer.
  - Fähigkeiten steigen langsam, über eine Saison einige Punkte. Ältere Spieler bauen nach und nach ab, Tempo zuerst.
- **Belastung:** Die Intensität kostet Frische. Dauerhaft hohe Last bedeutet mehr Verletzungen und schlechtere Stimmung. Regeneration nach Spielen ist Pflicht, sonst steigt das Risiko.
- **Einzeltraining:** bis zu 3 Spieler gleichzeitig, für einen Schwerpunkt oder eine Positionsumschulung. Eine Umschulung dauert Wochen und bringt die Eignung von 60 % auf bis zu 90 %.
- **Trainingslager:** im Sommer und Winter.
  - Kosten: Reise und Hotel.
  - Nutzen: Kondition, Taktik-Vertrautheit, Mannschaftsgefüge.
  - Gute Stimmung bei passendem Ort, Risiko „Lagerkoller“.
- **Trainerstab:** Co-Trainer, Torwart-, Athletik- und Rehatrainer. Ihre Qualität kostet Gehalt und beeinflusst die Faktoren oben.

---

## 11. Taktik

- **Grundordnung:** 4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 5-3-2, 3-4-3.
- **Spielstil als Kreislauf.** Der Vorteil wirkt nur, wenn die Mannschaft die nötigen Fähigkeiten hat:

  | Stil | Schlägt | Braucht | Schwäche |
  |---|---|---|---|
  | Pressing | Ballbesitz | Kondition, Frische, Tempo | ermüdet schnell, anfällig gegen Konter |
  | Ballbesitz | Mauern | Technik, Spielintelligenz | anfällig gegen Pressing |
  | Mauern | Konter | Zweikampf, Disziplin | anfällig gegen Ballbesitz, wenige eigene Chancen |
  | Konter | Pressing | Tempo, Abschluss | anfällig gegen Mauern |
  | Flügelspiel/lange Bälle | neutral | Zweikampf (Kopfball), Tempo | – |

  - **Stärke des Vorteils:** bis etwa ±6 % auf Chancenerzeugung, abhängig davon, wie gut beide Teams ihren Stil umsetzen.
  - **Vertrautheit:** Ein Stil wirkt erst voll nach etwa 3–6 Wochen Taktiktraining. Ein Wechsel mitten in der Saison kostet zunächst.
  - **Gegnerische Taktik** ist vor dem Spiel nur als Tendenz bekannt (Scouting des Gegners). Im Spiel sieht man sie, und eine Reaktion ist möglich.
- **Einsatz** (fair, normal, hart): mehr Zweikampfstärke, aber mehr Fouls, Karten und Verletzungen, auf beiden Seiten.

---

## 12. Transfers als Prozess

### 12.1 Bausteine

- **Scouting:**
  - Scouts gibt es mit Qualität und Gehalt. Aufträge: bestimmter Spieler, Liga oder Position.
  - Berichte nach 1–4 Wochen. Die Spannen werden enger (siehe 4.5).
  - Ohne Scouting kaufst du die Katze im Sack.
- **Transferliste:** Vereine setzen Spieler mit Begründung darauf, zum Beispiel „Kaderüberhang“, „Wechselwunsch“ oder „zu teuer“. Dazu kommen Leihangebote.
- **Spielerberater:** Jeder Spieler hat einen Berater mit Profil: gierig, seriös oder verschwiegen. Der Berater verlangt eine Provision und beeinflusst Verhandlung und Gerüchte.

### 12.2 Normaler Transfer (Spieler mit Vertrag)

Jeder Schritt dauert Tage und kostet teils Geld. Fristen laufen, Konkurrenten können dazwischenkommen.

1. **Anfrage beim Verein:** Ist der Spieler verkäuflich, und in welchem Preisrahmen? Antwort nach 1–5 Tagen. Mögliche Antworten:
   - unverkäuflich
   - nur gegen sehr viel Geld
   - verhandelbar
   - auf der Liste
2. **Angebot an den Verein:**
   - Bestandteile: Ablöse, Ratenzahlung, Bonuszahlungen (Einsätze, Aufstieg), Weiterverkaufsbeteiligung, optional ein Spieler im Tausch.
   - Antwort: Annahme, Gegenangebot oder Ablehnung.
   - **Verhandlungsrunden:** Der Verein hat eine Geduld. Zu niedrige Angebote verärgern ihn, dann geht die Verhandlung später nur noch teurer weiter.
   - **Konkurrenz:** Andere Vereine können parallel bieten, es kann zum Bieterwettstreit kommen.
3. **Verhandlung mit Spieler und Berater:**
   - Bestandteile: Gehalt, Laufzeit, Handgeld, Beraterprovision, Prämien, Ausstiegsklausel, Rollenversprechen.
   - **Interesse des Spielers** hängt ab von: sportlicher Perspektive (Rolle, Liga, Ansehen des Vereins), Geld, Stimmung beim alten Verein, Loyalität, Familie und Heimat (Zufall) und Konkurrenzangeboten.
4. **Medizincheck:** kann bei verletzungsanfälligen Spielern Befunde ergeben. Dann nachverhandeln oder abbrechen.
5. **Unterschrift:**
   - Der Wechsel wird zum Fensterbeginn oder sofort im offenen Fenster wirksam.
   - Bezahlt wird nach Vertrag, gegebenenfalls in Raten.
   - Die Eingewöhnung beginnt (4.4).

### 12.3 Abwerben (Kontakt am Verein vorbei)

- **Geheimes Treffen** mit Spieler und Berater:
  - Kosten: Spesen, Beraterhonorar. Dauer: ein Termin pro Woche.
  - Mehrere Treffen über Wochen steigern die Wechselbereitschaft des Spielers.
- **Risiko, dass es herauskommt:** Die Wahrscheinlichkeit pro Treffen hängt ab von:
  - Bekanntheit des Spielers
  - Verschwiegenheit des Beraters
  - Ort des Treffens
  - Zahl der Treffen
  - Zufall
- **Folgen, wenn es herauskommt:**
  - Der abgebende Verein ist verärgert. Die Ablöse steigt, im Extremfall verkauft er dir für den Rest der Saison nicht mehr.
  - Beschwerde beim Verband möglich, Geldstrafe für deinen Verein.
  - Der Spieler gerät bei seinem Verein in Ungnade, seine Stimmung sinkt. Das kann dir nützen: Er drängt auf einen Wechsel, und der Preis sinkt.
  - Dein Vorstand reagiert je nach Ruf, die Fans je nach Rivalität.
- **Wenn der Spieler überzeugt ist,** kann er bei seinem Verein einen Wechsel erzwingen wollen (Wechselwunsch, Streik-Drohung). Das ist der „natürliche“ Weg zu einem günstigeren Preis.
- **Auslaufender Vertrag:** In der letzten Vertragssaison darf man ab einem Stichtag offiziell verhandeln, der Wechsel im Sommer ist dann ablösefrei (Regel prüfen).

### 12.4 Weitere Transferarten

- **Ausstiegsklausel:** Wer sie zahlt, muss nicht mit dem Verein verhandeln, nur noch mit Spieler und Berater.
- **Leihe:** mit oder ohne Kaufoption bzw. Kaufpflicht. Gehaltsanteil, Einsatzgarantie.
- **Vereinslose:** jederzeit verpflichtbar, aber meist mit Gründen (Alter, Verletzung, Charakter).
- **Deadline Day:** In den letzten Tagen eines Fensters kommen mehr Angebote, Vereine handeln hektischer, die Preise schwanken stärker.

### 12.5 Medien und Gerüchte

- **Gerüchteküche** mit erfundenen Zeitungen und Portalen. Gerüchte sind wahr, halb wahr oder falsch, die Quelle hat einen Ruf.
- **Auslöser:** echte Verhandlungen, geplatzte Treffen, Berater, die Druck machen wollen, und reine Erfindungen.
- **Wirkung:** auf Stimmung (betroffene Spieler, Kabine), Fans, Vorstand und Preise. Ein bekanntes Interesse treibt die Ablöse.

### 12.6 Kosten im Überblick

| Kostenart | Wann |
|---|---|
| Scouting | laufend, pro Auftrag |
| Spesen für Treffen | pro Treffen |
| Beraterprovision | bei Abschluss (Prozent der Ablöse oder fester Betrag) |
| Handgeld | bei Unterschrift |
| Ablöse | sofort oder in Raten |
| Bonuszahlungen | bei Eintritt der Bedingung |
| Geldstrafe Abwerben | bei Entdeckung und Verfahren |
| Anwalt | Sportgericht, Verband |

---

## 13. Computer-Vereine

### 13.1 Kaderplanung

- **Jeder Verein hat einen Kaderplan:** Planstellen je Rolle, etwa TW 3, IV 4, AV 4, DM/ZM 5, OM/Flügel 4, ST 4 (je nach Verein leicht anders). Jede Planstelle hat eine Rangfolge: Stammspieler, Herausforderer, Ergänzung, Talent.
- **Qualitätsziel je Planstelle** im Verhältnis zum Vereinsniveau, zum Beispiel: Stammspieler höchstens 3 unter dem Vereinsniveau.
- **Vereinsprofil:** ehrgeizig, sparsam, Talentschmiede, „Altherren-Truppe“ oder Spekulant (kauft billig, verkauft teuer). Es bestimmt die Gewichtung der Entscheidungen.

### 13.2 Bedarfsanalyse zu jedem Fenster

- Gründe für Bedarf:
  - offene Planstelle (Vertragsende, Verkauf, Karriereende)
  - Stammspieler deutlich unter dem Qualitätsziel
  - lange Verletzung (mehr als 8 Wochen) eines Stammspielers
  - Wechselwunsch, der wahrscheinlich erfüllt wird
- Aus dem Bedarf entsteht eine Wunschliste mit Priorität und Budgetrahmen.

### 13.3 Verkaufsregeln (deine Vorgaben)

Ein Computer-Verein verkauft einen Spieler nur, wenn **Bedingung A und Bedingung B** erfüllt sind.

**A – es gibt einen Grund:**
- Der Spieler ist unzufrieden (Wechselwunsch ab Stufe 3) **oder**
- er spielt lange schwach: Notenschnitt über 10 oder mehr Einsätze schlechter als die Schwelle, oder Stärke deutlich unter seiner Planstelle **oder**
- es gibt Kaderüberhang: mehr Spieler als Planstellen auf dieser Position **oder**
- es kommt ein außergewöhnliches Angebot, zum Beispiel über 150 % des Marktwerts. Dann wird verkauft, und sofort startet die Ersatzsuche.

**B – die Position bleibt besetzt:** Die Planstellen der Position sind nach dem Verkauf noch voll besetzt. Sonst gilt: **erst kaufen, dann verkaufen.** Beispiel: Bei 3 Torhütern kann der Verein keinen abgeben, bevor ein neuer unterschrieben hat.

### 13.4 Kaufregeln

- **Nur bei Bedarf** (13.2), mit Budget (13.5) und Interesse des Spielers.
- **Ablauf:** derselbe wie bei dir (Kapitel 12), mit Zufall bei Geduld, Bietlaune und Risikobereitschaft. Auch Computer-Vereine werben ab und können erwischt werden.
- **Zielwerte pro Sommerfenster und Verein:** etwa 3–8 Zu- und Abgänge inklusive Leihen und Nachwuchs. Im Winter 0–3 (mit echten Daten abgleichen).

### 13.5 Finanzen der Computer-Vereine (Minimalmodell)

- **Einnahmen** pro Saison aus Zuschauern, TV, Sponsoring und Transfers. **Ausgaben:** Gehälter, Betrieb, Ablösen.
- Daraus folgen ein Transferbudget und ein Gehaltsrahmen, den der Vorstand festlegt. Ein Verein über dem Rahmen muss verkaufen, bevor er kauft.

### 13.6 Trainerwechsel bei Computer-Vereinen

- Bei Misserfolg im Verhältnis zur Erwartung: Entlassung mit Zufall.
- Ein neuer Trainer bringt einen neuen Spielstil (Vertrautheit sinkt), oft einen kurzen Stimmungsschub und einen Kaderumbau im nächsten Fenster.

---

## 14. Dein Verein: Was du beeinflussen kannst

| Hebel | Wirkung | Zeithorizont |
|---|---|---|
| Aufstellung, Grundordnung | wer spielt, Positions-Eignung | sofort |
| Spielstil, Einsatz | Kreislauf-Vorteil, Karten- und Verletzungsrisiko | sofort, voll erst nach Training |
| Wechsel, Halbzeitansprache | Frische, Selbstvertrauen, Spielverlauf | im Spiel |
| Training (Plan, Intensität, Einzeltraining, Trainingslager) | Fähigkeiten, Kondition, Vertrautheit, Frische, Verletzungen | Wochen bis Monate |
| Gespräche, Kapitän, Versprechen | Stimmung, Kabine | Tage bis Wochen |
| Scouting und Transfers | Kaderqualität | Wochen, mit Eingewöhnung |
| Verträge | Bindung, Stimmung, Kosten | Monate |
| Trainerstab und Medizin (Geld) | Trainingswirkung, Reha | Saison |
| Sportgericht: Widerspruch ja/nein | Länge der Sperre | Tage |

---

## 15. Technische Umsetzung

- **Dateien:**
  - `js/rng.js`: Zufall mit Seed (zum Beispiel xoshiro128), Hilfsfunktionen für Normalverteilung und gewichtete Auswahl
  - `js/kalender.js`: Tage, Ereignisse, Fristen
  - `js/spieler.js`: Modell, Berechnung der Gesamtstärke, Entwicklung
  - `js/engine.js`: Spiel minutenweise, live und als Schnellsimulation
  - `js/disziplin.js`: Fouls, Karten, Sportgericht
  - `js/medizin.js`: Verletzungen, Reha
  - `js/training.js`
  - `js/stimmung.js`
  - `js/transfer.js`: Verhandlungen als Zustandsautomaten mit Fristen
  - `js/ki.js`: Kaderplanung, Kauf- und Verkaufsentscheidungen, Computer-Trainer
  - `js/medien.js`: Gerüchte
  - `daten/regeln.js`: alle Stellschrauben mit Kommentaren
  - `daten/spieler.js`, `daten/vereine.js`: Stammdaten. Bearbeiten nur in der Datei, nicht im Spiel.
- **Verhandlungen** sind Objekte mit Zustand, zum Beispiel `ANFRAGE → ANGEBOT → GEGENANGEBOT → SPIELERGESPRÄCH → MEDIZINCHECK → FERTIG | ABGEBROCHEN`, mit Fristen im Kalender.
- **Spielstand:** mit Versionsnummer und Seed. Alte Spielstände sind nicht kompatibel und werden mit Hinweis abgelehnt.
- **Tests im Repo** (`tests/`):
  - `kalibrierung.js`: 10.000 Spiele pro Stärkepaarung gegen die Zielwerte aus 5.4
  - `saison.js`: 10 Saisons komplett mit Kennzahlen (Punkte, Tore, Karten, Sperren, Verletzungen, Transfers pro Fenster, Kadergrößen, Finanzen) gegen Zielbereiche
  - `torwart.js`: der Akzeptanztest aus 5.6
  - `ui-rauchtest.js`: kurzer Klickdurchlauf, der schon vorhandene Test

---

## 16. Stufen (Reihenfolge, Umfang, fertig wenn …)

| # | Stufe | Inhalt | Umfang | Fertig, wenn … |
|---|---|---|---|---|
| L0 | Fundament | Aufteilung in Dateien, `regeln.js`, Zufall mit Seed, Tageskalender, Tests ins Repo, Bearbeiten im Spiel entfernt | mittel | das Spiel läuft wie bisher, alle Tests sind grün, Seed-Läufe sind reproduzierbar |
| L1 | Spielermodell | Fähigkeiten, versteckte Werte, Zustände, Integration, Startwerte aus den heutigen Daten | mittel | alle Spieler haben plausible Werte, die Spielerkarte zeigt sie, die Gesamtstärke entspricht etwa der heutigen |
| L2 | Engine v2 | Phasen-Engine, Chancentypen, gedeckelter Torwart, Tagesform, Spielverlauf-Effekte, Ermüdung, abnehmender Ertrag | groß | Kalibrierung (5.4) und Torwart-Test (5.6) bestanden |
| L3 | Disziplin und Medizin | Foularten, Karten, Sportgericht mit Verfahren, Verletzungsarten, Reha, fit spritzen | mittel | Zielhäufigkeiten pro Saison getroffen, Sperren korrekt pro Wettbewerb |
| L4 | Live-Spiel | Pause, Halbzeit mit Ansprache, Wechsel nach Regel, Taktik im Spiel, Computer-Trainer | mittel bis groß | Wechsel und Ansprachen wirken messbar, ohne zu dominieren |
| L5 | Taktik-Kreislauf | Spielstile, Voraussetzungen, Vertrautheit, Gegner-Scouting | mittel | jeder Stil ist gegen einen anderen messbar im Vorteil, aber keiner ist immer der beste |
| L6 | Training | Wochenplan, Einheiten, Einzeltraining, Trainingslager, Trainerstab | mittel | Entwicklung über eine Saison im Zielbereich, Überlastung hat spürbare Folgen |
| L7 | Stimmung und Kabine | Modell, Folgen, Gespräche, Versprechen, Kapitän | mittel | Wechselwünsche entstehen nachvollziehbar, Stimmung ist kein Allheilmittel |
| L8 | Transfers I | Scouting, Transferliste, Anfragen, Angebote mit Runden, Spielergespräch, Medizincheck, Fenster, Leihen, Ausstiegsklauseln | groß | ein Transfer dauert realistisch Tage bis Wochen, mit Kosten und Abbruchgründen |
| L9 | Transfers II | Abwerben, geheime Treffen, Entdeckung, Strafen, Medien und Gerüchte, Bieterwettstreit, Deadline Day | groß | Abwerben lohnt sich manchmal und geht manchmal schief, Gerüchte beeinflussen Preise und Stimmung |
| L10 | Computer-Vereine | Kaderplan, Bedarfsanalyse, Verkaufs- und Kaufregeln (13.3/13.4), Finanzmodell, Trainerwechsel | groß | keine unsinnigen Verkäufe (Torwart-Beispiel), Transferzahlen pro Fenster im Zielbereich |
| L11 | Balancing | 10-Saison-Läufe, Feinjustierung aller Zielwerte, Ausnutzbarkeit prüfen (Exploits) | mittel | alle Zielbereiche über mehrere Seeds stabil |

**Abhängigkeiten:** L0 kommt vor allem anderen. L1 kommt vor L2 bis L10. L2 kommt vor L3, L4 und L5. L8 kommt vor L9 und L10. L11 kommt zum Schluss und lässt sich auch zwischendurch in kleinen Runden machen.

**Umfang grob:** 12 Stufen, davon 4 groß. Eine Stufe ist etwa eine Session, eine große eventuell zwei. Die Tokenkosten lassen sich erst nach L0 hochrechnen, wenn man in der Nutzungsanzeige sieht, was eine mittlere Stufe verbraucht hat.

---

## 17. Offene Entscheidungen

1. **Fähigkeiten:** 5 Feldspieler-Werte wie in 4.1, oder weniger (zum Beispiel 3: Technik, Physis, Abschluss)?
2. **Zeit:** Soll „Weiter“ standardmäßig bis zum nächsten Ereignis springen oder Tag für Tag gehen?
3. **Transferfenster:** sollen sie für dich genauso gelten wie für die Computer-Vereine?
4. **Abwerben:** Wie hart sollen die Strafen sein? Vorschlag: Geldstrafe plus ein verärgerter Verein. Punktabzug nur bei Wiederholung in schweren Fällen, oder gar nicht?
5. **Informationsnebel:** Spannen für fremde Spieler, oder lieber genaue Werte, damit es einfacher bleibt?
