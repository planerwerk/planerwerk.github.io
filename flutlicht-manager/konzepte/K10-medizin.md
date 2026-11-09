# K10 – Medizin und Verletzungen

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K03 (Frische, Robustheit, Saisonbelastung), K04 (Fouls, Ermüdung), K07 (Belastung) · Wird gebraucht von: K05, K14, K16, K26, K29.

**Umsetzungshinweise (U7b, 9. November 2026):** Gebaut sind elf Verletzungsarten und Krankheit mit Dauer, die Ursachen Foul, Zweikampf, Überlastung, Training und Krankheit, Verdacht und Diagnose als Spanne mit Mannschaftsarzt, Behandlung und Aufbautraining, Rückkehr mit Frische und Rückfallfenster, fit spritzen, früher zurückholen und die Verletzungsfolge im Strafmaß (K09). Code in `js/medizin.js`, Werte in `REGELN.medizin`. Die Verletztenliste mit Bilanz steht im Kader. Test: `tests/medizin.js`. Abweichungen in §12 unter U7b.

## 1. Ziel und Spielgefühl

- **Verletzungen gehören dazu, aber sie sind nicht willkürlich.** Jede Verletzung hat einen sichtbaren Grund: Foul, Überlastung oder einfach Pech.
- **Die Klage über Verletzungen ist vor allem Wahrnehmung** (Recherche 4b: in fast jedem FM-Jahrgang). Gegenmittel: Ursachen zeigen, Vorbeugung spürbar machen, Zahlen an echter Statistik ausrichten.
- **Entscheidungen statt nur Pech:** fit spritzen oder schonen, früher zurückholen oder auskurieren, zweite Meinung einholen, Belastung steuern.
- **Ehrliche Unsicherheit:** Erst kommt ein Verdacht mit Spanne („fällt 2–4 Wochen aus“), die genaue Diagnose folgt nach ein bis drei Tagen.

## 2. Vorbilder und Abgrenzung

- **Rohmaterial Kapitel 7:** Arten mit Ausfallzeit, Diagnose als Spanne, Reha mit bis zu 20 % kürzerer Ausfallzeit, Rückfallrisiko, fit spritzen. Übernommen und ausgebaut.
- **Football Manager:** Verletzungsliste, Belastungsanzeige, medizinische Abteilung. Kritik der Community: Verletzungskrisen ohne erkennbaren Grund.
- **Bewusst anders:** Krankheiten (Grippe, Infekt) zählen als eigener Ausfall mit Ansteckung im Kader. Kein Doping (PLAN §4: bewusst weggelassen).

## 3. Begriffe und Daten

### 3.1 Arten

| Art | Anteil | Ausfall | Ursache meist | Rückfall in 8 Wochen | fit spritzen |
|---|---|---|---|---|---|
| Prellung | 20 % | 1–7 Tage | Kontakt | – | ja |
| Zerrung (meist Oberschenkel hinten) | 25 % | 7–28, Ø etwa 16 | Überlastung, Sprint | 12 % | nein |
| Muskelfaserriss | 12 % | 21–49 | Überlastung | 15 % | nein |
| Bänderdehnung Sprunggelenk | 12 % | 4–21 | Umknicken, Kontakt | 10 % | ja (Tape) |
| Bänderriss Sprunggelenk | 5 % | 28–63 | Kontakt | 8 % | nein |
| Innenband Knie | 4 % | 21–56 | Kontakt | 5 % | nein |
| Meniskus | 2 % | 42–100 | Drehbewegung | 10 % | nein |
| Kreuzbandriss | 1 % | 180–300 | Drehbewegung, Kontakt | 10 % (später im Jahr) | nein |
| Knochenbruch (Mittelfuß, Nase, Schlüsselbein) | 3 % | 28–84, Nase 0–7 mit Maske | Kontakt | – | nur Nase |
| Gehirnerschütterung | 2 % | 7–14 nach Protokoll | Kopfballduell, Zusammenprall | – | nein, Pflichtpause |
| Rücken, Leiste, Sonstiges | 4 % | 3–21 | Überlastung | 10 % | ja |
| **Krankheit** (Infekt, Grippe) | eigene Zählung | 2–10 | Zufall, im Winter doppelt, Ansteckung | – | nein |

- Die Anteile richten sich nach den Studien: Muskelverletzungen machen gut ein Drittel aus, Oberschenkel-hinten-Verletzungen inzwischen etwa ein Viertel aller Verletzungen im Männer-Profifußball. In England kostete eine solche Zerrung im Schnitt 18 Tage, 12 % kamen wieder (Quellen).
- Die genaue Dauer wird bei der Verletzung gewürfelt, innerhalb der Spanne nach einer schiefen Verteilung (die meisten kurz, einige lang).

### 3.2 Am Spieler

| Feld | Bedeutung |
|---|---|
| `inj` | Ausfalltage (gibt es), wird zur echten Dauer |
| `vl` | aktuelle Verletzung: Art, Beginn, wahre Dauer, angezeigte Spanne, Phase |
| `vh` | Verlauf der letzten zwei Jahre: Art, Tage. Für Rückfälle, Robustheit-Hinweise und die spätere Ableitung bei echten Spielern (K03 §5.9) |
| Robustheit | verdeckt, aus K03 |

### 3.3 Phasen einer Verletzung

1. **Verdacht** (Tag 0): Art mit Spanne, zum Beispiel „Verdacht auf Muskelverletzung, 1–4 Wochen“.
2. **Diagnose** (Tag 1–3): genaue Art und engere Spanne.
3. **Behandlung:** etwa die ersten 70 % der Dauer.
4. **Aufbautraining:** die letzten 30 %. Individuelles Training, Kondition sinkt langsamer.
5. **Zurück im Mannschaftstraining:** einsatzfähig, aber mit Frische 70–80 %, weniger Spielpraxis und für einige Wochen erhöhtem Rückfallrisiko.

## 4. Abläufe

- **Im Spiel** (K04): Verletzung nach Foul oder Überlastung. Der Spieler muss raus. Ohne verbliebene Wechsel spielt das Team zu zehnt. Im Ticker steht der Grund.
- **Im Training** (K07): nach dem Risiko der Einheit.
- **Krankheit:** täglich ein kleines Risiko je Spieler, im Winter doppelt. Ist einer krank, steigt es für die anderen eine Woche lang.
- **Diagnose** nach 1–3 Tagen, schneller mit gutem Arzt (K16).
- **Meldungen:** Verletzung eines eigenen Spielers ist eine Info. Ein Halt entsteht nur bei einer Entscheidung (fit spritzen am Spieltag, früher zurückholen, zweite Meinung). Das schont das Halte-Budget (PLAN §2).
- **Verletzungsliste** im Kader: Art, Grund, Phase, voraussichtliche Rückkehr als Spanne.
- **Saisonbilanz:** eigene Ausfalltage gegenüber dem Ligaschnitt, aufgeteilt nach Foul, Überlastung, Pech, Krankheit.

## 5. Regeln und Formeln

### 5.1 Woher das Risiko kommt

| Quelle | Grundrisiko | Faktoren |
|---|---|---|
| Foul im Spiel (Kontakt) | je Foul 1,2 % | Schwere des Fouls (K09), harter Einsatz des Gegners ×1,5 |
| Überlastung im Spiel (Muskel) | je Spieler und Minute 0,0003 | Frische unter 80 % (+5 % je Punkt, K07), unter 60 % ×2, Pressing und Konter ×1,2, Alter ab 30 ×1,3 |
| Training | K07 §5.4 | Belastungssprung, Frische, Intensität |
| Krankheit | je Spieler und Tag 0,15 % | Winter ×2, kranker Mitspieler ×3 für 7 Tage |

**Für alle Quellen** zusätzlich: Robustheit (`1,6 − 0,06 × Robustheit`, also 1,54 bei 1 und 0,4 bei 20), „verletzungsanfällig“ ×1,6 (K03), Saisonbelastung (K12a), Athletiktrainer bis −20 % (K16), Rückfallfenster.

### 5.2 Diagnose und Spanne

- Die angezeigte Spanne enthält die wahre Dauer mit 90 % Sicherheit bei einem durchschnittlichen Arzt (wie die Vorhersage-Bänder in K35a).
- Breite der Spanne: Verdacht ±60 %, Diagnose ±25 %. Ein guter Arzt halbiert das, ein schlechter verdoppelt es (K16).
- **Fehldiagnose:** Mit einem schlechten Arzt liegt die Diagnose in 5 % der Fälle eine Stufe daneben (Zerrung statt Faserriss). Das zeigt sich nach einer Woche.

### 5.3 Reha und Rückkehr

- **Medizinische Abteilung** (K16, Reha-Zentrum in K26) verkürzt die Ausfallzeit um bis zu 20 % (Rohmaterial 7).
- **Rückkehr:** Frische 70–80 %, Spielpraxis fällt in der Pause wie in K03 §5.4, Kondition sinkt verletzt um 0,5 pro Tag (K03 §5.3).
- **Rückfallfenster:** 8 Wochen nach Rückkehr bei Muskel- und Bänderverletzungen. Risiko für dieselbe Art in dieser Zeit: Grundrisiko × (1 + Rückfallwert × 8). Bei einer Zerrung also etwa doppelt.

### 5.4 Fit spritzen und früher zurückholen

- **Fit spritzen** (nur Arten mit „ja“): Der Spieler kann sofort spielen, mit Wirkung ×0,95. Danach mit 15 % eine Verschlimmerung um eine Stufe (Bänderdehnung → Bänderriss, Prellung → Faserriss im Muskel). Kämpfer wollen, Diven nicht (K14).
- **Früher zurückholen** aus dem Aufbautraining: einsatzfähig sofort, Frische 65 %, Rückfallwert doppelt.
- **Zweite Meinung** (Entscheidung nach der Diagnose): kostet Geld (K23), gibt eine engere Spanne. Mit 20 % kommt eine bessere Behandlung heraus (−15 % Dauer), mit 5 % eine schlechtere Nachricht.

### 5.5 Gehirnerschütterung

- Pflichtpause von mindestens 7 Tagen nach Protokoll, kein fit spritzen, keine frühere Rückkehr.
- Im Spiel: Der Spieler muss sofort raus. Ein zusätzlicher Wechsel ist erlaubt, wenn das in der jeweiligen Liga gilt (Regel prüfen, K05).

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Belastung steuern (K07), rotieren | weniger Muskelverletzungen | Fortschritt, Spielpraxis |
| fit spritzen | Spieler im wichtigen Spiel dabei | Verschlimmerung möglich |
| früher zurückholen | Spieler früher da | Rückfall |
| zweite Meinung | genauere Planung, manchmal schneller | Geld |
| Stab und Reha-Zentrum (K16, K26) | kürzere Ausfälle, genauere Diagnosen, weniger Verletzungen | Gehalt, Baukosten |
| Einsatz „fair“ (K06) | eigene Spieler foulen weniger | schützt nur den Gegner, nicht dich |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln und gleiche Risiken.
- Fit spritzen nur in wichtigen Spielen (K04 §5.5), früher zurückholen selten.
- Rotation nach Frische und Saisonbelastung, mit Klugheitsstufe (K02).

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Kreuzbandriss | Art Kreuzbandriss | Stimmung im Team (K14), Presse (K29), Frage nach Ersatz (K19) |
| Spieler spielt trotz Schmerzen (Entscheidung) | Kämpfer mit kleiner Verletzung vor wichtigem Spiel | ja: Wirkung ×0,95, Verschlimmerung möglich. Nein: Stimmung. |
| Spieler verheimlicht Verletzung | hoher Ehrgeiz, kleine Verletzung, Zufall | spielt weiter, Risiko der Verschlimmerung, Glaubwürdigkeit (K15) |
| Grippewelle | drei oder mehr Kranke gleichzeitig | Info, eventuell Antrag auf Spielverlegung (K13, Community-Wunsch) |
| Verletzungsserie | drei Muskelverletzungen in zwei Wochen | Arzt nennt die Ursache (Belastungssprung, Frische) |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | Robustheit, „verletzungsanfällig“, Frische, Kondition, Saisonbelastung, Spielpraxis nach der Pause |
| K04 Engine | Verletzungen im Spiel aus Fouls und Ermüdung, Wechsel, Unterzahl |
| K05 Live-Spiel | Verletzungswechsel, Gehirnerschütterungs-Wechsel |
| K07 Training | Risiko im Training, Aufbautraining |
| K09 Sportgericht | Schwere des Fouls, Verletzungsfolge beim Gegner erhöht das Strafmaß |
| K12a Sommer | Saisonbelastung |
| K14 Kabine | Stimmung bei schweren Verletzungen, Reaktion auf fit spritzen |
| K16 Stab | Arzt, Physiotherapeut, Athletiktrainer, Reha-Trainer |
| K23 Finanzen | Kosten zweite Meinung, Versicherung (später) |
| K26 Infrastruktur | Reha-Zentrum |
| K29 Presse | schwere Verletzungen, „verheimlicht“ |
| K34 Statistik | Ausfalltage, Verletzungsbilanz |

## 10. Zielwerte und Tests

**Echte Anker:** Bei Frauen-Spitzenteams zählte die UEFA-Studie 6,7 Verletzungen je 1000 Stunden, im Spiel 18,4, im Training 4,8, und etwa 35 Ausfälle pro Team und Saison. Bei den Männern sinkt die Verletzungsrate seit 2001 um etwa 3 % pro Saison, Muskelverletzungen bleiben gleich häufig. Kreuzbandrisse liegen im Profifußball bei etwa 0,06 je 1000 Stunden (Quellen).

| Prüfung | Ziel |
|---|---|
| Verletzungen pro Team und Saison (ohne Krankheit) | 30–50 (geschätzt aus den Raten, prüfen) |
| Anteil Muskelverletzungen | 30–40 % |
| Anteil Oberschenkel hinten | 20–25 % |
| Rate im Spiel gegenüber Training (je Stunde) | 3- bis 6-mal so hoch |
| Anteil Trainingsverletzungen an allen | 40–55 % (abgeleitet, prüfen) |
| Zerrung | Ø 14–20 Tage, Rückfall 10–15 % |
| Kreuzbandrisse ligaweit pro Saison | 3–8 (aus 0,06 je 1000 Stunden geschätzt) |
| Belastung wirkt | Teams mit vielen Belastungssprüngen haben mindestens 1,3-mal so viele Muskelverletzungen |
| Spanne ehrlich | wahre Dauer in mindestens 85 % der Fälle in der angezeigten Spanne (Durchschnittsarzt) |
| Fit spritzen | lohnt sich in einem einzelnen wichtigen Spiel, aber nicht als Dauerlösung |

## 11. Stellschrauben

```js
medizin:{
  arten:{prellung:{anteil:0.20,tage:[1,7],spritzen:true},zerrung:{anteil:0.25,tage:[7,28],rueckfall:0.12},
    faserriss:{anteil:0.12,tage:[21,49],rueckfall:0.15},baenderdehnung:{anteil:0.12,tage:[4,21],rueckfall:0.10,spritzen:true},
    baenderriss:{anteil:0.05,tage:[28,63],rueckfall:0.08},innenband:{anteil:0.04,tage:[21,56],rueckfall:0.05},
    meniskus:{anteil:0.02,tage:[42,100],rueckfall:0.10},kreuzband:{anteil:0.01,tage:[180,300],rueckfall:0.10},
    bruch:{anteil:0.03,tage:[28,84]},kopf:{anteil:0.02,tage:[7,14],pflicht:true},sonstiges:{anteil:0.04,tage:[3,21],rueckfall:0.10,spritzen:true}},
  krankheit:{proTag:0.0015,winter:2,ansteckung:3,ansteckungTage:7,tage:[2,10]},
  risiko:{foul:0.012,hartGegner:1.5,minute:0.0003,frischeAb:80,frischeJePunkt:0.05,frischeKritisch:60,kritisch:2,stil:1.2,altAb:30,alt:1.3},
  robustheit:[1.6,-0.06],anfaellig:1.6,
  diagnose:{tage:[1,3],verdacht:0.6,genau:0.25,fehldiagnose:0.05},
  reha:{behandlung:0.7,maxVerkuerzung:0.2,rueckkehrFrische:[70,80],fenster:56},
  spritzen:{wirkung:0.95,verschlimmerung:0.15},frueher:{frische:65,rueckfall:2},
  zweiteMeinung:{besser:0.20,verkuerzung:0.15,schlechter:0.05}
}
```

`engine.verletzung` und `training.verletzung` aus der heutigen `regeln.js` gehen darin auf.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Krankheiten** zählen als eigener Ausfall mit Ansteckung, getrennt von den Verletzungszielen.
2. **Fit spritzen** nur bei wenigen Arten, mit Verschlimmerungsrisiko statt festem Verbot.
3. **Verletzungsverlauf** wird zwei Jahre gespeichert. Das reicht für Rückfälle und Hinweise, ohne den Spielstand aufzublähen.

**Vorläufig entschieden bei der Umsetzung (U7b, 9. November 2026):**
4. **Häufigkeit nach der UEFA-Studie:** Laut einer Aspetar-Zusammenfassung der UEFA Elite Club Injury Study hat ein 25er-Kader etwa 50 Verletzungen mit Ausfall pro Saison, etwa 15 davon im Muskel (Ø 16 Tage), und im Schnitt fehlen 12–14 % des Kaders. Kalibriert auf etwa 40 Verletzungen pro Team und Saison (Ziel 30–50) und 8 % fehlende Spieler an Spieltagen. Vorher waren es etwa 7 Verletzungen und ein halber fehlender Spieler je Team. Verletzungen sind damit deutlich häufiger, im Schnitt aber kürzer (Zerrung Ø 15 Tage, viele Prellungen von 1–7 Tagen).
5. **Quellen im Spiel:** Foul (je erlittenem Foul 1,2 % nach Schwere der Foulart: taktisch ×0,5, rücksichtslos ×4, brutal ×10, harter Einsatz ×1,5), Zweikampf ohne Foul (je Minute und Team 0,16 %) und Überlastung (je Minute und Team 0,22 %, nach Frische, Alter ab 30, Pressing und Konter, Rückfallfenster). Dazu kommt das Training (Grundrate 0,0016 statt 0,00032). Die Werte aus 5.1 (je Spieler und Minute 0,0003) hätten etwa zehnmal zu viele Verletzungen ergeben.
6. **Art nach Quelle:** Jede Art hat einen Kontaktanteil k. Kontakt zieht anteil × k, Überlastung anteil × (1 − k), das Training alle Arten nach anteil (Trainingsspiel, Zweikämpfe). Ergebnis: 35 % Muskel, 25 % Zerrung, 44 % im Training.
7. **Spiel gegen Training je Stunde:** etwa 20-mal statt 3- bis 6-mal (UEFA-Studie etwa 7-mal). Beides zugleich geht mit unserer Trainingszeit (jeder Spieler fast täglich 1,5 Stunden) nicht: Bei einem Training-Anteil von 40–55 % wird das Verhältnis groß. Der Test prüft nur „mindestens dreimal“. Prüfen, wenn K11 und die Trainingsdauer genauer sind.
8. **Zerrung 8–30 Tage** statt 7–28, weil der Physiotherapeut (K16) die Dauer zusätzlich verkürzt. Rückfall: Im Fenster von acht Wochen ist das Risiko ×(1 + 7 × Rückfallwert), und 35 % der Verletzungen in dieser Zeit sind dieselbe Art. Das ergibt etwa 14 % Rückfälle nach einer Zerrung.
9. **Diagnose:** Verdacht nur als Gruppe (Muskel-, Band-, Knieverletzung …) mit Spanne ±60 %, nach der Untersuchung die genaue Art mit ±25 %. Mit Mannschaftsarzt (K16) geht es schneller und genauer: Qualität 10 entspricht dem Durchschnitt, ohne Arzt ist die Spanne doppelt so breit und die Untersuchung dauert 3 Tage. Die Spanne enthält immer die wahre Dauer. Eine Fehldiagnose ist noch nicht gebaut.
10. **Krankheiten:** 0,06 % je Spieler und Tag statt 0,15 %, Ansteckung ×2 für 5 Tage statt ×3 für 7 Tage. Mit den Werten aus dem Entwurf schaukelte sich die Ansteckung auf 35 Krankheiten pro Team und Saison hoch, jetzt sind es etwa 7. Das ist ein Spielwert, nicht recherchiert.
11. **Verletzungen laufen über den Saisonwechsel weiter** (vorher wurden sie am 1. Juli gelöscht). Ein Kreuzbandriss im April kostet also auch die Vorbereitung.
12. **Fit spritzen** geht nur am Spieltag. Computer-Vereine spritzen nur in wichtigen Spielen (Pokal ab Runde 3, Relegation) und nur Stammspieler mit höchstens 10 Tagen Ausfall. Verschlimmerung: Prellung → Faserriss, Bänderdehnung → Bänderriss, Rücken/Leiste → Zerrung, Bruch (Nase) bekommt 7 Tage mehr.
13. **Robustheit und „verletzungsanfällig“** wirken beide (1,6 − 0,06 × Robustheit und ×1,6), wie in 5.1. Ein Anfälliger (Robustheit 1–4) verletzt sich damit gut doppelt so oft wie der Durchschnitt, nicht nur 60 % öfter, wie der Merkmalstext sagt. Prüfen.
14. **Lernstufen (K36):** Verletztenliste und Diagnose ab Stufe 1 (nur Information), fit spritzen und früher zurückholen ab Stufe 4. Davor entscheidet der Arzt nach den Regeln der Computer-Vereine.
15. **Noch nicht gebaut:** zweite Meinung, Fehldiagnose, Pflichtwechsel und Zusatzwechsel bei Gehirnerschütterung, Ereignisse aus §8, Saisonbilanz der Ausfalltage in der Saisonzusammenfassung (die Bilanz steht in der Verletztenliste im Kader), Reha-Zentrum (K26), Rotation der Computer-Vereine nach Saisonbelastung.

**Noch zu recherchieren:** aktuelle Gesamtrate für Männer-Profis (je 1000 Stunden und pro Team und Saison), Anteil der Trainingsverletzungen, Regel zu zusätzlichen Wechseln bei Gehirnerschütterung in Bundesliga und Pokal.

## Quellen

- UEFA-Studie Frauen (Raten, 35 Ausfälle pro Saison): [PubMed 38182274](https://pubmed.ncbi.nlm.nih.gov/38182274/)
- UEFA-Studie Männer 2001–2019 (Trends): [PMC8458074](https://pmc.ncbi.nlm.nih.gov/articles/PMC8458074)
- Oberschenkel-hinten-Verletzungen, Anteil und Rate: [PMC9985757](https://pmc.ncbi.nlm.nih.gov/articles/PMC9985757), [BJSM (2015)](https://bjsm.bmj.com/content/early/2015/03/09/bjsports-2014-094285.full.pdf)
- England, 18 Tage je Zerrung, 12 % Rückfall: [PMC1724733](https://pmc.ncbi.nlm.nih.gov/articles/PMC1724733)
- Kreuzbandrisse: [Serie A, PubMed 31800358](https://pubmed.ncbi.nlm.nih.gov/31800358/), [Deutschland, Szymski et al. 2021 (PDF)](https://epub.uni-regensburg.de/49315/1/Szymski2021_Article_HigherRiskOfACLRuptureInAmateu.pdf)
- Arten, Diagnose, Reha, fit spritzen: `konzepte/_rohmaterial-logik-v1.md`, Kapitel 7
- UEFA-Studie Männer, 50 Verletzungen je 25er-Kader und 12–14 % fehlend: [Aspetar: Lessons learned from two decades of injury surveillance](https://journal.aspetar.com/en/journals/volume-8-targeted-topic-hamstring-injuries-aspetar-experience/lessons-learned-from-two-decades-of-injury-surveillance-in-elite-football), 15 Muskelverletzungen und Ø 16 Tage: [Aspetar, Ekstrand](https://www.aspetar.com/Journal/viewarticle.aspx?id=449) (U7b, Zusammenfassungen der Suchergebnisse)
- **Hinweis:** Die Zahlen stammen aus den Zusammenfassungen der Suchergebnisse, die Volltexte habe ich nicht gelesen. Welche Zahl genau zu welchem Link gehört, sollte vor der Kalibrierung geprüft werden.
- Wahrnehmung von Verletzungen in der Community: `konzepte/_recherche-genre.md`, Abschnitt 4b
