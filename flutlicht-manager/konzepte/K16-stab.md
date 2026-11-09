# K16 – Trainerstab und Mitarbeiter

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K03, K07, K10 (wo der Stab wirkt), K35a (Bänder) · Wird gebraucht von: K02, K04–K08, K10, K12a, K18, K19, K21, K29, K31.

**Umsetzungshinweise (U6c, 9. November 2026):** Trainerstab mit den acht Rollen aus Welle 2 (`js/stab.js`, Werte in `REGELN.stab`), eigene Ansicht „Stab“ mit Einstellen, Verlängern und Entlassen, Qualität als Spanne bis sechs Wochen nach der Einstellung. Test: `tests/stab.js`. Abweichungen in §12 unter U6c.

## 1. Ziel und Spielgefühl

- **Der Stab macht dich besser, aber nicht allmächtig.** Ein guter Arzt verkürzt Ausfälle, ein guter Co-Trainer liest das Spiel genauer, ein guter Athletiktrainer verhindert Verletzungen.
- **Automatik und Delegieren in jedem Bereich** (vorläufig übernommen, PLAN §2): Wer nicht alles selbst machen will, gibt Bereiche ab. Das Ergebnis ist so gut wie die Person, die es macht. „Tiefe bei hohem Tempo“ (Recherche 5).
- **Menschen mit Profil:** Mitarbeiter haben Qualität, ein Spezialgebiet, eine Haltung und eigene Pläne. Der ehrgeizige Co-Trainer will irgendwann Cheftrainer werden.
- **Ehrliche Unsicherheit:** Wie genau eine Vorhersage ist, hängt vom Mitarbeiter ab (K35a). Mit schwachem Stab sind die Bänder breit.

## 2. Vorbilder und Abgrenzung

- **Football Manager:** großer Stab mit Bewertungen und Berichten. Community-Wünsche: Standardtrainer, Ernährungsberater, Psychologe, Personalvergleich, ein Trainerteam, das mit dir den Verein wechselt, Ex-Spieler, die nach der Karriere Trainer werden (Recherche 4b).
- **Anstoss 3:** Personal mit klarer Funktion, etwa Platzwart und Spitzel (PLAN §4).
- **Bewusst anders:** wenige Rollen mit klarer, sichtbarer Wirkung statt 30 Assistenten. Jede Rolle muss sich ihren Platz verdienen (Recherche 4d).

## 3. Begriffe und Daten

### 3.1 Rollen

| Rolle | Plätze | Wirkung | ab |
|---|---|---|---|
| **Co-Trainer** | 1–2 | Automatik für Aufstellung, Taktik, Training, Lernziele und Sofort-Berechnen. Halbzeit-Einschätzung (K05). Talent-Schätzung eigener Spieler (K03). Einzeltrainingsplätze (K07). | Welle 2 |
| **Torwarttrainer** | 1 | Lernen und Entwicklung der Torhüter | Welle 2 |
| **Athletiktrainer** | 1 | Verletzungsrisiko im Training bis −20 % (K07), Konditionswirkung ×1,0–1,1 | Welle 2 |
| **Mannschaftsarzt** | 1 | Diagnose schneller und genauer, weniger Fehldiagnosen (K10), Hinweise auf Saisonbelastung (K12a) | Welle 2 |
| **Physiotherapeut** | 1–2 | Ausfallzeit bis −20 % (K10), zusammen mit dem Reha-Zentrum (K26) höchstens −25 % | Welle 2 |
| **Videoanalyst** | 1 | Gegneranalyse genauer (K06), Spielvorbereitung +1 % zusätzlich (K07) | Welle 2 |
| **Standardtrainer** | 1 | Standard-Einheiten wirken ×1,0–1,3 (K07), Lernen der Standard-Merkmale (K03) | Welle 2 |
| **Sportpsychologe** | 1 | Selbstvertrauen erholt sich schneller nach unten, „nervenschwach“ wirkt halb so stark, Prägung (K08) weniger riskant | Welle 2 |
| Scouts | 1–6 | Beobachtung, Spannen (K18) | Welle 3 |
| Jugendleiter, Jugendtrainer | 1–3 | Nachwuchs (K08) | Welle 3 |
| Sportdirektor | 1 | Automatik für Verträge und Transfers (K19, K21) | Welle 3 |
| Pressesprecher | 1 | Automatik für Presse (K29) | Welle 4 |

### 3.2 Werte eines Mitarbeiters

| Wert | Bereich | sichtbar |
|---|---|---|
| Qualität | 1–20 | vor der Einstellung als Spanne (Sterne), nach einigen Wochen genau |
| Spezialgebiet | je Rolle, zum Beispiel Co-Trainer: Taktik, Training oder Jugend | ja |
| Haltung | offensiv, ausgewogen, defensiv (Co-Trainer), risikofreudig oder vorsichtig (Arzt) | ja |
| Persönlichkeit | Ehrgeiz, Loyalität, Temperament (je 1–20, wie K03) | über Eigenschaften wie „ehrgeizig“, „treu“ |
| Alter, Gehalt, Vertrag | wie bei Spielern | ja |
| Herkunft | erfunden oder ehemaliger Spieler der Spielwelt | ja |

Gespeichert in `S.stab` (alle Mitarbeiter der Welt mit Verein oder vereinslos), ähnlich wie Spieler.

### 3.3 Automatik je Bereich

| Bereich | wer | Stufen |
|---|---|---|
| Aufstellung und Taktik | Co-Trainer | selbst · Vorschlag · Automatik |
| Training und Lernziele | Co-Trainer, Athletiktrainer | selbst · Vorschlag · Automatik |
| Spiel bei „sofort berechnen“ | Co-Trainer | immer Automatik |
| Medizin (fit spritzen, früher zurückholen) | Arzt | selbst · Automatik |
| Testspiele planen | Co-Trainer | selbst · Automatik |
| Verträge, Transfers | Sportdirektor | ab Welle 3 |
| Presse | Pressesprecher | ab Welle 4 |
| Jugend | Jugendleiter | ab Welle 3 |

- **Vorschlag:** Der Mitarbeiter stellt eine Lösung vor, du bestätigst oder änderst. Kein Halt, er erscheint dort, wo du ohnehin hinschaust (Aufstellung, Wochenplan).
- **Automatik:** Er entscheidet. Du siehst im Wochenbericht, was er getan hat.

## 4. Abläufe

1. **Start einer Karriere:** Jeder Verein hat einen Stab passend zu seinem Ansehen. Du übernimmst ihn.
2. **Einstellen:** Liste vereinsloser Mitarbeiter mit Spanne für die Qualität. Angebot mit Gehalt und Laufzeit, Antwort nach 1–3 Tagen.
3. **Entlassen:** Abfindung wie bei Spielern (Restgehalt × Faktor, K21).
4. **Verträge** laufen zum 30. Juni aus. Verlängerung im Frühjahr wie bei Spielern, vereinfacht.
5. **Abwerbung:** Computer-Vereine können gute Mitarbeiter abwerben, ehrgeizige Co-Trainer nehmen Cheftrainerposten an (Ereignis).
6. **Trainerteam nimmt man mit:** Wechselst du den Verein (heute „Jobangebote“), dürfen dir bis zu zwei Mitarbeiter folgen, wenn ihre Loyalität zu dir hoch genug ist und der neue Verein zahlt.
7. **Ehemalige Spieler:** Beim Karriereende (K32) werden einige Spieler zu Mitarbeitern. Qualität aus Führung, Professionalität und Erfahrung, Spezialgebiet aus ihrer Position (Torhüter oft Torwarttrainer).

## 5. Regeln und Formeln

### 5.1 Wie gut die Automatik entscheidet

```
gewählte Option = die mit dem höchsten Wert aus (wahrer Nutzen + Rauschen)
Rauschen: Streuung = 0,03 × (21 − Qualität)
```

- Gute Mitarbeiter wählen fast immer die beste Option, schwache öfter daneben.
- **Haltung** verschiebt die Bewertung: Ein defensiver Co-Trainer gibt Mauern und Konter +3 % Nutzen, ein offensiver Pressing und Ballbesitz.
- **Spezialgebiet:** im eigenen Gebiet Qualität +3.

### 5.2 Genauigkeit der Vorhersagen

```
Bandbreite = Grundbreite × (1,5 − 0,05 × Qualität) × Schwierigkeitsfaktor (K02)
```

- Qualität 20 → halb so breit, Qualität 10 → normal, Qualität 1 → fast eineinhalbmal so breit.
- Gilt für Ticketpreis (Marketing, später), Gegneranalyse (Videoanalyst), Diagnosen (Arzt), Talentsterne (Co-Trainer).
- **Ehrlichkeit bleibt:** Die wahre Größe liegt in mindestens 80 % der Fälle im Band (K35a §10). Schwache Mitarbeiter haben breite Bänder, keine falschen.

### 5.3 Wirkungen in Zahlen

| Rolle | Formel |
|---|---|
| Co-Trainer | Lern- und Umschulungstempo, Vertrautheit: `0,85 + 0,015 × Qualität` (0,85–1,15, K07 §5.6). Einzeltrainingsplätze: 3 + Qualität/5 je Co-Trainer, höchstens 10. |
| Athletiktrainer | Trainingsrisiko × `(1 − 0,01 × Qualität)`, Konditionswirkung × `(1 + 0,005 × Qualität)` |
| Arzt | Diagnose 1–3 Tage, guter Arzt ab Qualität 15 immer nach einem Tag. Spanne nach 5.2. Fehldiagnose 5 % bei Qualität 5, 0 % ab 15. |
| Physiotherapeut | Ausfallzeit × `(1 − 0,01 × Qualität)`, mit Reha-Zentrum höchstens −25 % |
| Videoanalyst | Gegneranalyse nach 5.2, Spielvorbereitung +1 % ab Qualität 10 |
| Standardtrainer | Standard-Einheiten × `(1 + 0,015 × Qualität)` |
| Psychologe | Selbstvertrauen unter 0 erholt sich × `(1 + 0,05 × Qualität)` schneller, „nervenschwach“ × `(1 − 0,025 × Qualität)` |
| ohne Mitarbeiter | Rolle wirkt wie Qualität 3, Automatik nicht möglich (außer Co-Trainer, der ist Pflicht) |

### 5.4 Gehalt

- Gehalt nach Qualität und Liga: `Basis(Liga) × e^(0,15 × (Qualität − 10))`. Startwerte für einen Co-Trainer mit Qualität 10: 1. Liga 300.000 €, 2. Liga 120.000 €, 3. Liga 50.000 € pro Jahr. Andere Rollen ×0,4 bis ×0,8. Spielwerte, nicht recherchiert.
- Der Vorstand gibt ein Budget für den Stab vor (K28). Bis dahin zählt der Stab zu den Gehältern (K23).

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| guten Mitarbeiter holen | bessere Automatik, schmalere Bänder, weniger Verletzungen | Gehalt |
| Bereich abgeben | Zeit | Ergebnis hängt an der Person |
| Vorschläge nutzen | Hilfe, ohne die Kontrolle abzugeben | – |
| Spezialgebiet passend wählen | +3 Qualität im Gebiet | eingeschränkter in anderen |
| Mitarbeiter mitnehmen | vertrautes Team beim Vereinswechsel | Kosten beim neuen Verein |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln. Stab nach Budget und Ansehen, große Vereine haben alle Rollen mit hoher Qualität.
- Die **Klugheitsstufe** (K02) der Computer-Vereine ist unabhängig vom Stab. Ihr Stab wirkt auf Verletzungen, Lernen und Entwicklung genauso wie deiner.
- Sie werben gute Mitarbeiter ab, auch deine, nach Ansehen und Gehalt.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Co-Trainer wird Cheftrainer (Entscheidung) | ehrgeiziger Co-Trainer, Angebot eines anderen Vereins | ziehen lassen (Ablöse für den Vertrag), halten (mehr Gehalt, Stimmung) |
| Streit im Stab | Temperament hoch bei zwei Mitarbeitern | Wirkung beider −10 % für einen Monat, Gespräch (K15) |
| Arzt widerspricht | du willst fit spritzen, der vorsichtige Arzt rät ab | Hinweis mit Risiko, du entscheidest |
| Ehemaliger Kapitän kehrt zurück | Karriereende eines verdienten Spielers | Angebot als Co-Trainer oder Jugendtrainer, Fans freuen sich (K27) |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K02 Zufall, Schwierigkeit | Bänder × Schwierigkeitsfaktor |
| K03 Spieler | Talent-Schätzung, Lerntempo, Psychologe und Selbstvertrauen |
| K04, K05, K06 | Automatik im Spiel, Halbzeit-Einschätzung, Gegneranalyse, Haltung |
| K07 Training | Qualitätsfaktor, Einzeltrainingsplätze, Athletik- und Standardtrainer |
| K08 Jugend | Jugendtrainer, Prägung mit Psychologe |
| K10 Medizin | Arzt, Physiotherapeut |
| K12a Sommer | Hinweise auf Saisonbelastung |
| K18 Scouting | Scouts als Mitarbeiter |
| K19, K21 | Sportdirektor-Automatik, Abfindungen |
| K23, K28 | Gehälter, Budget für den Stab |
| K26 Infrastruktur | Reha-Zentrum mit Physiotherapeut gedeckelt |
| K29 Presse | Pressesprecher |
| K32 Welt | ehemalige Spieler werden Mitarbeiter |
| K35a Oberfläche | Stab-Seite mit Vergleich (Community-Wunsch), Bänder |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Automatik Co-Trainer | Qualität 10 erreicht mindestens 85 % der Punkte-Wirkung der besten Wahl (K07 §10), Qualität 18 mindestens 95 %, Qualität 4 etwa 70 % |
| Stab lohnt sich, aber nicht zwingend | Ein kompletter Top-Stab bringt einem Zweitligisten 2–5 Punkte und 15–25 % weniger Ausfalltage pro Saison. Ohne Stab (außer Co-Trainer) ist man spürbar schlechter, aber nicht chancenlos. |
| Bänder | wahre Größe in mindestens 80 % der Fälle im Band, für jede Qualität |
| Ex-Spieler | pro Saison werden 5–15 ehemalige Spieler zu Mitarbeitern in der Welt |
| Kein Pflicht-Stab | Keine einzelne Rolle bringt mehr als 2 Punkte pro Saison |

## 11. Stellschrauben

```js
stab:{
  rollen:{co:{plaetze:2,pflicht:true},torwart:{plaetze:1},athletik:{plaetze:1},arzt:{plaetze:1},physio:{plaetze:2},
    video:{plaetze:1},standard:{plaetze:1},psycho:{plaetze:1}},
  automatik:{rauschen:0.03,haltung:0.03,spezialgebiet:3},
  baender:{basis:1.5,jeQualitaet:-0.05},
  wirkung:{co:[0.85,0.015],coPlaetze:{basis:3,jeQualitaet:0.2,max:10},athletik:{risiko:-0.01,kondition:0.005},
    arzt:{schnellAb:15,fehldiagnose:{bei5:0.05,ab15:0}},physio:{ausfall:-0.01,maxMitReha:0.25},
    video:{vorbereitungAb:10,bonus:0.01},standard:0.015,psycho:{erholung:0.05,nervenschwach:-0.025},ohne:3},
  gehalt:{co:{1:300000,2:120000,3:50000},andere:[0.4,0.8],steigung:0.15},
  mitnehmen:{max:2,loyalitaetAb:14},
  exSpieler:{anteil:0.15},
  start:{qualitaetJeAnsehen:0.2,streuung:[-3,3]}
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Acht Rollen in Welle 2** (Co-Trainer, Torwart-, Athletik-, Standardtrainer, Arzt, Physiotherapeut, Videoanalyst, Psychologe). Scouts, Jugend, Sportdirektor und Pressesprecher kommen mit ihren Konzepten.
2. **Kein Ernährungsberater, kein Platzwart** als eigene Rolle. Der Platzwart gehört zu K26 (Rasen), Ernährung steckt im Athletiktrainer.
3. **Co-Trainer ist Pflicht.** Ohne ihn gäbe es keine Automatik und keine Halbzeit-Einschätzung.
4. **Trainerteam mitnehmen** bis zu zwei Personen.
5. **Gehälter sind Spielwerte,** Kalibrierung mit K23.

**Vorläufig entschieden bei der Umsetzung (U6c, 9. November 2026):**
6. **Gebaut sind die acht Rollen aus Welle 2** mit Qualität 1–20, Gehalt und Vertrag, Start nach Ansehen (Qualität ≈ Ansehen × 0,2 ± 3; Videoanalyst, Standardtrainer und Psychologe erst ab Ansehen 55–65, zweiter Co-Trainer ab 70) und 40 vereinslosen Mitarbeitern.
7. **Wirkungen nach 5.3:** Co-Trainer (Lernen, Umschulung, Vertrautheit, Einzeltrainingsplätze, Talentsterne genauer), Athletiktrainer (Trainingsrisiko, Konditionsreiz), Torwarttrainer (Entwicklung und Lernen der Torhüter), Physiotherapeut (Ausfallzeit, höchstens −25 %), Videoanalyst (Spielvorbereitung doppelt ab Qualität 10), Standardtrainer (Standard-Einheiten stärker), Psychologe (Selbstvertrauen unter 0 erholt sich schneller, nervenschwach wirkt schwächer). Der Arzt wirkt erst mit K10.
8. **Einstellen geht sofort** (Vertrag zwei Jahre), nicht nach 1–3 Tagen Bedenkzeit. Verlängern: zwei Jahre, 10 % mehr Gehalt. Entlassen: halbes Restgehalt als Abfindung. Ein Co-Trainer ist Pflicht.
9. **Gehälter** werden wie die Spielergehälter je Ligaspiel gebucht. Ein Erstligist wie Freiburg zahlt so etwa 3 Mio. € pro Jahr, ein kleiner Drittligist mit nur einem Co-Trainer etwa 35.000 €. Spielwerte, Abgleich mit K23 und dem Stab-Budget aus K28.
10. **Computer-Vereine** besetzen einen fehlenden Co-Trainer wöchentlich aus dem Pool nach und verlängern auslaufende Verträge zu 70 %.
11. **Noch nicht gebaut:** Automatik mit Rauschen, Haltung und Spezialgebiet (5.1), Modus „Vorschlag“, Bänder für Vorhersagen außer der Qualität selbst, Abwerbung, Mitnehmen beim Vereinswechsel, Ex-Spieler als Mitarbeiter (K32), Ereignisse aus §8.


## Quellen

- Community-Wünsche zum Stab: `konzepte/_recherche-genre.md`, Abschnitt 4b
- Grundsatz Automatik und Delegieren: `konzepte/_konsistenzpruefung.md`, B2, PLAN §2
- Personal bei Anstoss 3: PLAN §4 (GameStar 4/2000)
