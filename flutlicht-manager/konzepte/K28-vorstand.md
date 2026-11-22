# K28 – Vorstand, Ziele, Karriere

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12. Teilweise gebaut: Computer-Vereine in U11d2 (§7), Vertrauen, Ultimatum und Ruf für dich in U12a (§5.6), Nebenziele und Rücktritt in U12b (§5.7), beide 20.11., Zielgespräch in U12e (§5.8, 22.11.), Zwischenbilanz im Winter in U12f (§5.9, 22.11.), Trainervertrag als Statistik in U12g (§5.10, 22.11.), Wirkung des Rufs in U12h (§5.11, 22.11.), Präsidentenwahl in U12i (§5.12, 22.11.), Jobangebot während der Saison in U12j (§5.13, 22.11.), alle ohne Testlauf.
Hängt ab von: K02 (Geduld je Stufe), K15 (Gespräche) · Wird gebraucht von: K12b, K14, K19, K23, K29.

## 1. Ziel und Spielgefühl

- **Ziele sind verhandelbar,** wie bei Anstoss 3 (PLAN §4). Wer tiefstapelt, bekommt weniger Geld. Wer hoch pokert, steht unter Druck.
- **Der Vorstand hat ein Gesicht:** Präsident mit Charakter, geduldig oder ungeduldig, sparsam oder großzügig.
- **Entlassung mit Drama statt Schalter:** Vor dem Rauswurf kommt das Ultimatum, das „Endspiel“.
- **Dein Ruf als Trainer zählt:** für Jobangebote, für die Autorität in der Kabine (K14) und für Spieler, die zu dir wechseln wollen (K19).
- **Faire Ziele:** Die Community klagt über unrealistische Vorgaben nach Aufstiegen (Recherche 4b).

## 2. Vorbilder und Abgrenzung

- **Anstoss 3:** Saisonziel mit dem Präsidium verhandeln (PLAN §4). Übernommen.
- **Heute im Spiel:** Vertrauen 0–100, Änderungen je Spiel, Saisonziel aus dem erwarteten Platz, Entlassung unter 12 nach der Schonfrist, Jobangebote. Bleibt die Grundlage („nichts wegnehmen“).
- **Bewusst anders:** Das Vertrauen hat Bausteine und Trägheit wie die Stimmung (K14), statt nur nach jedem Spiel zu springen.

## 3. Begriffe und Daten

| Begriff | Bereich | Ort |
|---|---|---|
| Vertrauen | 0–100 (gibt es) | `S.trust` |
| **Ruf des Trainers** | 0–100, Start 30 für Neulinge | `S.ruf` |
| Präsident | Name, Geduld, Sparsamkeit, Ehrgeiz (je 1–20) | `t.praes` |
| Saisonziele | Liga-Platz (gibt es), dazu bis zu zwei Nebenziele | `S.ziele` |
| Budget | Transferbudget, Gehaltsrahmen, Stab-Budget | `S.budget` (K23) |
| Trainervertrag | Laufzeit, Gehalt | `S.vertrag` |

### 3.1 Nebenziele (Auswahl)

| Nebenziel | Beispiel |
|---|---|
| Pokal | „mindestens Achtelfinale“ |
| Jugend | „eigene Talente bekommen 1.500 Einsatzminuten“ |
| Finanzen | „kein Verlust in dieser Saison“ |
| Kader | „Gehaltssumme unter X“ |
| Zuschauer | „Schnitt über X“ (mit K27) |

## 4. Abläufe

1. **Zielgespräch** in der Vorbereitung (K12b legt den Termin): Der Vorstand schlägt Platz und Nebenziele vor, du kannst verhandeln (5.2).
2. **Laufend:** Vertrauen aus Bausteinen (5.1), wöchentlich mit Trägheit.
3. **Winter:** Zwischenbilanz. Ziel kann bei klarer Abweichung angepasst werden (auf deinen Antrag oder vom Vorstand).
4. **Ultimatum:** fällt das Vertrauen unter die Grenze der Schwierigkeitsstufe (K02, Normal 12), stellt der Vorstand ein Ultimatum: die nächsten zwei Pflichtspiele. Halt mit Meldung.
5. **Entlassung:** nach gescheitertem Ultimatum mit einer Wahrscheinlichkeit nach Geduld des Präsidenten (5.3). Danach Jobangebote wie heute.
6. **Saisonende:** Bilanz der Ziele, Ruf, Vertragsgespräch des Trainers (Verlängerung, Gehalt).

## 5. Regeln und Formeln

### 5.1 Vertrauen

```
Ziel-Vertrauen = 50 + Sport + Ziele + Finanzen + Umfeld     (begrenzt 0–100)
Vertrauen bewegt sich wöchentlich 20 % zum Ziel, nach jedem Spiel zusätzlich wie heute (kleiner gewichtet)
```

| Baustein | Spanne | Woraus |
|---|---|---|
| Sport | −35 bis +25 | Tabellenplatz gegenüber dem Ziel, Punkte gegenüber der Erwartung (K04 §5.8), Pokal |
| Ziele | −10 bis +10 | Stand der Nebenziele |
| Finanzen | −15 bis +5 | Kontostand, Verlust, Kredit (heute: Konto im Minus −2 je Woche) |
| Umfeld | −10 bis +5 | Medien (K29), Fans (K27), Glaubwürdigkeit (K15, unter 25 zählt negativ) |

- Die Schwierigkeitsstufe (K02) setzt Ultimatum-Grenze und Schonfrist.
- Die bestehenden Werte je Sieg, Remis und Niederlage (`vorstand.sieg` usw.) bleiben als schneller Anteil, mit halbem Gewicht.

### 5.2 Ziele verhandeln

- **Vorschlag des Vorstands:** wie heute aus dem erwarteten Platz (`targetFor`), verschoben durch den Ehrgeiz des Präsidenten (±1 Platz).
- **Tiefstapeln** um einen Platz: Zusage nach Vertrauen und Ruf (Grundchance 60 %, −20 % je weiterer Platz). Folge: Transferbudget −15 % je Platz, Prämie bei Erfolg kleiner.
- **Hochpokern:** immer angenommen. Budget +10 % je Platz, Prämie größer, aber das Ziel gilt.
- **Nach einem Aufstieg** ist das Standardziel Klassenerhalt, egal wie stark der Kader ist (gegen unrealistische Ziele, Recherche 4b).

### 5.3 Entlassung

```
Chance nach gescheitertem Ultimatum = 0,9 − 0,03 × Geduld des Präsidenten     (0,3 bis 0,87)
```

- Wird man nicht entlassen, gibt es ein zweites, letztes Ultimatum.
- **Saisonende:** Ziel deutlich verfehlt (wie heute `saisonWeitAb`), Vertrauen unter `entlassenSaisonUnter`: Entlassung wie heute.
- **Rücktritt** jederzeit möglich, Ruf −5.

### 5.4 Ruf des Trainers

- **Steigt:** Saisonziel übertroffen (+3 je Platz), Titel (Meister +15, Pokal +10, Aufstieg +8), Punkte über der Erwartung über eine Saison.
- **Sinkt:** Entlassung (−8), Abstieg (−6), Ziel deutlich verfehlt (−4). Langsames Vergessen: 5 % Richtung 30 pro Saison.
- **Wirkt auf:** Jobangebote (heute nach Ansehen der Vereine), Ruf-Gefälle in der Kabine (K14 §5.2), Interesse von Spielern an deinem Verein (K19), Presse (K29), Startwert der Glaubwürdigkeit beim neuen Verein (K15).

### 5.5 Trainervertrag

- Laufzeit 1–3 Jahre, Gehalt nach Liga und Ruf. Verlängerung zum Saisonende, wenn das Vertrauen über 55 liegt.
- **Abfindung** bei Entlassung (Restgehalt × 0,5). Das Gehalt ist eine Karriere-Statistik (K34), kein eigenes Wirtschaftsspiel (vorläufig, Community-Wunsch „mit dem Trainergehalt etwas anfangen“ später).

### 5.6 Umsetzung U12a (20. November 2026, ohne Testlauf): Vertrauen mit Bausteinen, Ultimatum, Ruf

U12 in Teilschritten (vorläufig, §12 Nr. 5):

- **U12a:** Vertrauen, Ultimatum und Ruf für dich (gebaut).
- **U12b:** Zielgespräch und Nebenziele. Braucht Budgets aus K23 für Tiefstapeln und Hochpokern.
- **U12c:** Beziehungen (K17).
- **U12d:** Ereignis-Gerüst (K30), dazu die Karten aus §8.

**Vertrauen (§5.1).** Zwei Teile:

- **Schneller Anteil nach jedem Ligaspiel:** die bisherigen Werte je Sieg, Remis und Niederlage, jetzt mit halbem Gewicht (`vertrauen.schnell` 0,5). Die bisherigen Werte je Spiel für den Tabellenplatz (`platz`) entfallen, der Platz steckt jetzt im Baustein Sport. Die Pokalwerte bleiben, wie sie sind.
- **Träger Anteil jeden Montag:** ab dem 5. eigenen Ligaspiel bewegt sich das Vertrauen um 20 % auf ein Ziel zu.

```
Ziel = 50 + Sport + Serie + Finanzen + Umfeld   (0 bis 100)
Sport    = 5 × (Saisonziel − Tabellenplatz), begrenzt auf −35 bis +25
Serie    = 10 × (Punkte je Spiel in den letzten 5 Ligaspielen − 1,3), begrenzt auf −15 bis +10
Finanzen = −15 bei Konto im Minus, dazu −5 mit Kredit (zusammen höchstens −15)
Umfeld   = bei Glaubwürdigkeit unter 25 (K15) bis −10, linear
```

- Die Formel ist dieselbe wie bei den Computer-Vereinen (K31 §5.10), nur mit dem Saisonziel statt dem erwarteten Platz und mit Umfeld.
- Nebenziele (Baustein „Ziele“) gibt es erst mit U12b. Fans und Medien im Umfeld kommen mit K27 und K29.
- Die bisherigen −2 je Woche bei Konto im Minus gehen im Baustein Finanzen auf. Die Meldung „Der Vorstand ist alarmiert“ bleibt.

**Ultimatum (§4 Nr. 4, §5.3).** Grenze und Schonfrist kommen weiter aus der Schwierigkeit (K02: Leicht 5 und 10, Normal 12 und 6, Schwer 18 und 4). Fällt das Vertrauen nach der Schonfrist unter die Grenze, gibt es keine sofortige Entlassung mehr:

1. **Ultimatum:** Meldung, dann 2 Ligaspiele Zeit. Es gibt keinen eigenen Halt, das nächste Spiel hält ohnehin an.
2. Danach ist das Vertrauen wieder mindestens an der Grenze: Das Ultimatum ist aufgehoben (Meldung).
3. Sonst wirst du mit der Chance 0,9 − 0,03 × Geduld deines Präsidenten entlassen. Der Präsident ist derselbe wie in K31 §5.10, fest aus der Vereinsnummer. Wirst du nicht entlassen, folgt ein **letztes Ultimatum** über 2 Ligaspiele.
4. Nach dem letzten Ultimatum unter der Grenze: Entlassung.

Das Ultimatum endet mit der Saison und mit einem Jobwechsel. Die Entlassung zum Saisonende (Ziel weit verfehlt und Vertrauen unter 15, Abstieg in die Regionalliga) bleibt wie bisher.

**Ruf als Trainer (§5.4).** Start 30 (auch für alte Spielstände). Zum Saisonende:

| Anlass | Ruf |
|---|---|
| Saisonziel übertroffen | +3 je Platz |
| Meister / Pokalsieg / Aufstieg | +15 / +10 / +8 |
| Abstieg | −6 |
| Ziel deutlich verfehlt (mehr als 3 Plätze) | −4 |
| Entlassung (auch zum Saisonende) | −8 |
| Vergessen | vorher 5 % Richtung 30 |

- **Wirkung in U12a:** Die Jobangebote richten sich nach dem Ansehen deines Vereins minus 4 plus 1 je Punkt Ruf über 30 (darunter entsprechend weniger). Wer dreimal sein Ziel um zwei Plätze übertrifft, hat einen Ruf von etwa 47 und bekommt Angebote von Vereinen mit etwa 13 mehr Ansehen als seiner (§10: 10 bis 20).
- Kabine, Spielerinteresse, Presse und Glaubwürdigkeit (§5.4) kommen später.

**Anzeige im Büro (Information, immer frei, K36):** Ruf als Trainer, die Geduld des Präsidenten in Worten (ungeduldig bis 7, geduldig ab 14), ein laufendes Ultimatum mit den verbleibenden Ligaspielen.

### 5.7 Umsetzung U12b (20. November 2026, ohne Testlauf): Nebenziele und Rücktritt

Das **Zielgespräch** mit Tiefstapeln und Hochpokern (§5.2) wartet: Seine Folgen sind Transferbudget und Prämie, beides gibt es erst mit K23. Ohne sie wäre Tiefstapeln immer richtig. U12b baut die Nebenziele (§3.1) und den Rücktritt (§5.3).

**Nebenziele.** Der Vorstand setzt sie zum Saisonstart und beim Jobwechsel, zusammen mit dem Saisonziel (eigener Zufallsstrom je Saison und Verein, mehrfaches Setzen gibt dasselbe):

| Nebenziel | Erfüllt | Verfehlt | gibt es, wenn |
|---|---|---|---|
| Pokal | mindestens die Runde erreicht: 1. Liga Achtelfinale, 2. und 3. Liga 2. Runde | vorher ausgeschieden | dein Verein im Pokal ist |
| Jugend | Spieler bis 21 Jahre im Kader kommen zusammen auf 25 Einsätze | Saisonende darunter | du Spieler bis 21 hast |
| Finanzen | kein Verlust in der Saison (Summe der Buchungen mindestens 0) | Saisonende mit Verlust | immer |

- **Anzahl:** eines. Ein ehrgeiziger Präsident (Ehrgeiz ab 14) setzt zwei.
- **Auswahl:** Das Profil deines Vereins (K31 §3.2) kommt zuerst: Ausbildungsverein → Jugend, sparsam → Finanzen, ehrgeizig → Pokal. Den Rest lost der Vorstand.
- **Baustein „Ziele“ im Vertrauen** (§5.1, −10 bis +10, montags): erfüllt +5, verfehlt −5. Finanzen mit Verlust bis jetzt: −3 („gefährdet“).
- **Saisonende:** je erfülltem Nebenziel Vertrauen +5, je verfehltem −5, mit Meldung. Das geschieht vor der Prüfung auf Entlassung zum Saisonende.
- **Anzeige:** im Büro unter dem Saisonziel, mit Stand.
- Kader (Gehaltssumme) und Zuschauer (§3.1) fehlen noch. Zuschauer brauchen K27, die Gehaltssumme einen Gehaltsrahmen aus K23.

**Rücktritt** (§5.3, **neue Funktion**, Bereich `ruecktritt`, Grundlizenz, ohne Automatik, K36):

- Im Büro „Zurücktreten …“, mit Rückfrage.
- Danach wie nach einer Entlassung: Jobangebote nach deinem Ruf. Der Ruf sinkt nur um 5 statt um 8.
- Das Fenster heißt dann „Zurückgetreten“ statt „Entlassen!“.
- Nur während der Saison und nur, solange du nicht entlassen bist.

### 5.8 Umsetzung U12e (22. November 2026, popolupo, ohne Testlauf): Zielgespräch

Jetzt gibt es Budgets (K23d, K23 §5.5f) und echte Größenordnungen (K23c), damit hat §5.2 Folgen.

- **Wann:** Mit dem Saisonziel (Saisonstart, Jobwechsel, neues Spiel) legt der Vorstand einen Vorschlag vor. Bis zu deinem nächsten Ligaspiel kannst du im Büro verhandeln (Karte „Zielgespräch mit dem Vorstand“, dazu ein Punkt in der Liste „Vor dem Saisonstart“, K12b). Ohne Entscheidung gilt der Vorschlag. Eine Entscheidung je Saison.
- **Ziel annehmen:** nichts ändert sich.
- **Grenzen** wie beim Saisonziel: in der 2. und 3. Liga nie besser als Platz 2 (Aufstieg), nie schlechter als das schlechteste Ziel der Liga. Stößt ein Schritt an die Grenze, zählt nur die tatsächliche Verschiebung (Budget und Zusage-Chance).
- **Hochpokern** um einen oder zwei Plätze: immer angenommen. Transferbudget +10 % je Platz. „Übertroffen“ zählt beim Ruf weiter vom Vorschlag aus, erreichst du das höhere Ziel, gibt es zusätzlich +2 je Platz. Das Ziel gilt für Vertrauen, Ultimatum, Entlassung und „deutlich verfehlt“. (Korrigiert nach Prüfung CX2: Vorher zählte „übertroffen“ vom höheren Ziel, Hochpokern brachte so weniger Ruf als Annehmen.)
- **Tiefstapeln** um einen oder zwei Plätze: Zusage mit 60 % − 20 % je weiterem Platz + 0,5 % je Punkt Vertrauen über 50 + 0,5 % je Punkt Ruf über 30, bei einem ehrgeizigen Präsidenten (ab 14) −15 %, bei einem ruhigen (bis 7) +15 %, begrenzt auf 5 bis 95 % (eigener Strom).
  - Zugesagt: Ziel schlechter, Transferbudget −15 % je Platz, der Ruf rechnet „übertroffen“ weiter vom Vorschlag aus.
  - Abgelehnt: Das Ziel bleibt, Vertrauen −3.
- **Transferbudget** (K23d): Kontostand über der Reserve, mal dem Faktor aus dem Gespräch. Der Faktor gilt auch für das Budget der Automatik, solange der Verein deine Transfers führt (`kiBudget`, Prüfung CX5). Kaufst du über dem Budget, ist der Vorstand verstimmt: Vertrauen −1 je angefangene 10 % der Ablöse über dem Budget, höchstens −10, mit Meldung.
- **Lizenz (K36):** neuer Bereich `zielgespraech` in der Grundlizenz, ohne Automatik (ohne Entscheidung gilt der Vorschlag).
- **Gleichschritt:** Das Gespräch würfelt nur, wenn du tiefstapelst. Ohne Eingriff ändert sich nichts.
- **Noch nicht:** Zwischenbilanz im Winter (§4 Nr. 3), Sparsamkeit des Präsidenten beim Budget, Nebenziele verhandeln.

### 5.9 Umsetzung U12f (22. November 2026, popolupo, ohne Testlauf): Zwischenbilanz im Winter

- **Wann:** am ersten Montag, nachdem du die Hälfte deiner Ligaspiele gespielt hast (§4 Nr. 3), einmal je Saison und Verein.
- **Klar besser** (Platz mindestens 4 besser als das Ziel): Der Vorstand hebt das Ziel um einen Platz an. Der Ruf rechnet „übertroffen“ dann vom neuen Ziel, nach einem Zielgespräch wird der Vorschlag mit verschoben. Ohne Zufall.
- **Klar schlechter** (mindestens 4 schlechter): Bis zum nächsten Ligaspiel kannst du im Büro beantragen, das Ziel um einen Platz zu senken. Zusage mit 50 % + 0,5 % je Punkt Vertrauen über 50 + 0,5 % je Punkt Ruf über 30 (5 bis 95 %, eigener Strom).
  - Zugesagt wirkt es wie Tiefstapeln: Transferbudget −15 % (wichtig fürs Winterfenster), „übertroffen“ zählt weiter vom alten Vorschlag.
  - Abgelehnt: Vertrauen −3.
- **Dazwischen:** Meldung, das Ziel bleibt.
- **Lizenz (K36):** der Antrag gehört zum Bereich `zielgespraech` (Grundlizenz), ohne Automatik.
- **Seit U12k (22.11., popolupo, ohne Testlauf):** Liegst du mindestens 6 Plätze hinter dem Ziel und ist der Präsident geduldig (Geduld ab 14), senkt der Vorstand das Ziel von sich aus um einen Platz, ohne Antrag und ohne Abzug beim Transferbudget. Wie beim Anheben rechnet danach alles vom neuen Ziel, auch der Ruf. Ungeduldige oder mittlere Präsidenten und 4 bis 5 Plätze Rückstand: Antrag wie bisher.
- **Noch nicht:** Nebenziele werden nicht angepasst.

### 5.10 Umsetzung U12g (22. November 2026, popolupo, ohne Testlauf): Trainervertrag

Nach §5.5, nur als Karriere-Statistik (K34). Es fließt kein Geld, das Gehalt steckt wie bisher in der Verwaltung des Vereins (K23c). Ohne Zufall.

- **Gehalt je Saison:** 2 Mio. € × Liga (1. Liga 1, 2. Liga 0,4, 3. Liga 0,25) × e^(0,05 × (Ansehen − 70)) × (1 + 1 % je Punkt Ruf über 30), auf 10.000 € gerundet.
  - Beispiele beim Startruf: Bayern (Ansehen 95) etwa 7 Mio., ein Verein der 1. Liga mit 60 etwa 1,2 Mio., 2. Liga mit 60 etwa 0,5 Mio., 3. Liga mit 45 etwa 0,14 Mio. (geschätzt).
- **Laufzeit nach der Geduld des Präsidenten:** ungeduldig eine Saison, mittel zwei, geduldig drei.
  - Wer bis zum Winter (Tag 183) anfängt, für den zählt die laufende Saison mit. Wer später oder nach dem Saisonende anfängt, für den zählt sie nicht.
- **Verlängerung zum Saisonende**, wenn der Vertrag ausläuft:
  - Vertrauen über 55: zwei Saisons mit neuem Gehalt (nach dem heutigen Ruf).
  - Sonst eine Saison zum alten Gehalt („Bewährung“).
  - Ein Abschied bei Vertragsende kommt später. Er wäre ein neuer Weg aus dem Job, mit Folgen für Jobangebote, Tests und Gleichschritt.
- **Ligaklausel:** Steigt der Verein auf oder ab, ändert sich das Gehalt zum 1. Juli im Verhältnis der Ligafaktoren.
- **Abfindung bei Entlassung:** Restgehalt × 0,5. Rest heißt die Saisons nach der laufenden bis zum Vertragsende plus der Rest der laufenden Saison nach Tagen (nach dem Saisonende 0). Beim Rücktritt gibt es keine.
- **Karriere (K34 §5.7):**
  - Jede Station zeigt das Gehalt je Saison und was du dort verdient hast. Das Gehalt zählt anteilig nach Tagen, dazu kommt die Abfindung.
  - Jede Saisonzeile zeigt das Gehalt laut Vertrag zum Saisonende.
  - Darüber steht die Summe über alle Stationen.
  - Alte Spielstände bekommen beim ersten Lesen einen Vertrag ab heute. Was davor verdient wurde, fehlt.
- **Anzeige:**
  - In der Karte Saisonziel: Laufzeit und Gehalt.
  - In den Jobangeboten: das Gehalt, das dich dort etwa erwartet.
- **Lizenz (K36):** keine neue Funktion, nur Anzeige und Statistik.
- **Noch nicht:** Vertragsgespräch mit eigener Forderung, Abschied bei Vertragsende, Ausstiegsklausel bei Angeboten anderer Vereine, Gehalt als eigenes Wirtschaftsspiel (Community-Wunsch, §5.5).
- **Nach der Prüfung DN:**
  - Die Funktionen heißen `trainerAbfindung`, `trainerVertragEnde` und `trainerVertragText`, weil es die kurzen Namen schon für Spieler gab.
  - Die Anzeige im Büro liest nur. Alte Spielstände bekommen den Vertrag beim Laden.
  - Die Karriere zählt die laufende Saison anteilig mit.

### 5.11 Umsetzung U12h (22. November 2026, popolupo, ohne Testlauf): Ruf wirkt

Nach §5.4 „Wirkt auf“. Die Jobangebote nutzten den Ruf schon seit U12a, jetzt kommen drei weitere Stellen dazu. Ohne Zufall.

- **Interesse von Spielern (K19 §5.3):** +0,2 je Punkt Ruf über dem Start (30), darunter entsprechend weniger. Ruf 80 bringt +10, Ruf 0 kostet −6.
- **Ruf-Gefälle in der Kabine (K14 §12 Nr. 11):** Dein Ruf in der Kabine ist 50 + 0,3 × Ansehen des Vereins + 0,5 je Punkt Ruf über dem Start, höchstens 95. Vorher zählten 3 Punkte je Trainerjahr, als Platzhalter bis K28. Wer lange ohne Erfolg trainiert, gewinnt damit kein Ansehen in der Kabine mehr.
- **Glaubwürdigkeit beim neuen Verein (K15):** Start 60 + 0,3 je Punkt Ruf über dem Start, zwischen 30 und 90. Sie wird beim Jobwechsel gesetzt, auch bei der Rückkehr zu einem früheren Verein.
- **Lizenz (K36):** keine neue Funktion.
- **Noch nicht:** Ruf und Presse (K29), zum Beispiel mehr Pressekonferenzen oder ein anderes Medienklima für bekannte Trainer.

### 5.12 Umsetzung U12i (22. November 2026, popolupo, ohne Testlauf): Präsidentenwahl

Nach §8 („Neuer Präsident: Wahl alle 3–4 Jahre“) und K25 §5.5 (Mitgliederversammlung).

- **Wann:** im Sommer nach der Saison, auf der Mitgliederversammlung, bei jedem Verein alle 3 oder 4 Jahre. Der Takt ist fest aus der Vereinsnummer, die Vereine wählen also nicht alle im selben Jahr. Im Büro steht, wann dein Verein wieder wählt.
- **Bleibt der Präsident?** Die Chance ist 65 %, dazu:
  - +0,3 je Punkt pro Spiel über 1,35 (darunter entsprechend weniger),
  - +15 % bei einem Aufstieg, −25 % bei einem Abstieg, auch über die Relegation (DQ6),
  - +0,5 % je Punkt Fanstimmung über 50 (darunter weniger),
  - zusammen zwischen 20 und 95 %. Gewürfelt im eigenen Strom je Verein und Saison.
- **Neuer Präsident:** neue Werte für Geduld, Ehrgeiz und Sparsamkeit (weiter fest aus der Vereinsnummer, jetzt mit der Zahl der Wechsel).
  - Bei Computer-Vereinen wirkt die neue Geduld auf Trainerwechsel (K31).
  - Bei dir wirkt sie auf Nebenziele, Tiefstapeln und die Vertragslaufzeit beim nächsten Vertrag. Dein Vertrauen rückt zur Hälfte Richtung 50, denn der Neue muss sich erst ein Bild machen. Du bekommst eine Meldung, auch bei einer Wiederwahl.
- **Lizenz (K36):** keine neue Funktion.
- **Noch nicht:** Namen der Präsidenten, Kandidaten mit Programm, Einfluss des Trainers auf die Wahl, Mitglieder als Stimmen (K25d), neue Ziele direkt nach der Wahl (gilt erst mit dem Saisonziel der neuen Saison).

### 5.13 Umsetzung U12j (22. November 2026, popolupo, ohne Testlauf): Jobangebot während der Saison

Nach §8 als Ereigniskarte (K30, `daten/karten.js`, Bereich `ereignisse`).

- **Wann:** Dein Ruf ist mindestens 55, du hast mindestens 5 Ligaspiele bestritten und stehst nicht im Ultimatum. Es meldet sich ein Verein derselben oder einer höheren Liga mit mindestens 8 mehr Ansehen als deiner. Große Vereine melden sich erst bei großem Ruf: Ihr Ansehen ist höchstens die Mitte der Jobangebote nach einer Entlassung (Ansehen deines Vereins − 4 + Ruf über 30) plus 10 (seit Prüfung DQ1, vorher Ruf + 40, das begrenzte nichts). Stufe „häufig“ (etwa alle drei Saisons, solange die Bedingungen gelten), höchstens ein Angebot je Jahr über alle Vereine (DQ2).
- **Wechseln:** Du übernimmst den Verein sofort.
  - Dein Gehalt bis heute steht in der Karriere, die Station endet mit „gewechselt“, eine Abfindung gibt es nicht.
  - Der neue Verein zahlt deinem alten ein Jahresgehalt als Ablöse für deinen Vertrag, höchstens sein Kontostand.
  - Danach gilt alles wie bei jedem Jobwechsel: neuer Vertrag, Vertrauen 55, Glaubwürdigkeit nach Ruf.
  - Offene Karten des alten Vereins entscheidet vorher der Co-Trainer, sie wandern nicht mit (gilt für jeden Jobwechsel, DQ3).
  - Kredite und Raten bleiben wie bei jedem Jobwechsel beim alten Verein, ohne Buchung (Computer-Vereine führen keine Kredite). Die Ablöse steht nur in der Meldung, nicht in den Finanzen (DQ4, DQ5).
- **Bleiben und es öffentlich sagen:** Vertrauen +5, Fans +2. Das ist auch die Voreinstellung, der Co-Trainer wechselt nie für dich.
- **Sich alles anhören und dann absagen:** Ruf +1. Mit 50 % wird das Treffen publik, dann Vertrauen −8.
- **Noch nicht:** Ausstiegsklausel im Trainervertrag, Angebot während des Ultimatums als Rettung, Angebote aus dem Ausland.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| tiefstapeln | weniger Druck | weniger Budget, geringere Prämie |
| hochpokern | mehr Budget | Ziel gilt, Ultimatum näher |
| Gespräch mit dem Vorstand (K15) | Ziel im Winter anpassen, Budget für einen Transfer | Glaubwürdigkeit, Abnutzung |
| Nebenziele erfüllen | Vertrauen | Einsatzminuten für Talente, Sparen |
| Rücktritt | einem Rauswurf zuvorkommen | Ruf −5 |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln für Computer-Trainer, vereinfacht: Vertrauen aus Sport und Finanzen, Ultimatum, Entlassung nach Geduld des Präsidenten.
- Entlassene Computer-Trainer und neue Trainer kommen aus einem Trainerpool (K31), darunter ehemalige Spieler (K16, K32).
- **Gebaut in U11d2 (19. November 2026, ohne Testlauf, K31 §5.10):**
  - Vertrauen der Computer-Vereine aus Sport, Serie und Finanzen, mit Trägheit.
  - Ultimatum unter 20 über zwei Ligaspiele, Entlassung nach der Geduld des Präsidenten, ein zweites, letztes Ultimatum.
  - Trainerwechsel im Sommer bei deutlich verfehltem Ziel.
  - Der Präsident hat Geduld, Ehrgeiz und Sparsamkeit, fest aus der Vereinsnummer und ohne Namen. Gewählt wird er nicht.
  - Noch ohne Trainerpool: Der neue Trainer bringt einen neuen Lieblingsstil mit und einen Stimmungsschub.
  - **Dein Vorstand ist unverändert** (Rest von K28 in U12).

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Ultimatum | Vertrauen unter der Grenze | zwei Spiele, Presse (K29) |
| Präsident mischt sich ein (Entscheidung) | ehrgeiziger Präsident, Niederlagenserie | er will einen bestimmten Spieler sehen oder verkaufen: nachgeben (Vertrauen +) oder standhaft (Vertrauen −, Glaubwürdigkeit +) |
| Rückendeckung vom Vorstand | Vertrauen über 80 nach Krise | Info, Vertrauen ein Monat stabil |
| Neuer Präsident | Wahl alle 3–4 Jahre, Zufall | neue Charakterwerte, Ziele werden neu verhandelt |
| Jobangebot während der Saison (Entscheidung) | Ruf hoch, Verein mit höherem Ansehen | wechseln (Ablöse für den Trainervertrag), bleiben (Vertrauen +), Gespräch publik (Glaubwürdigkeit −) |

**Seit K30e** (22.11.2026, popolupo, ohne Testlauf) wirkt „Rückendeckung vom Vorstand“: 30 Tage lang fällt das Vertrauen nicht unter den Wert des Tages (K30 §5.6).

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K02 Schwierigkeit | Ultimatum-Grenze, Schonfrist, Zielverschiebung |
| K04 Engine | erwartete Punkte für den Baustein Sport |
| K12b Saisonvorbereitung | Termin des Zielgesprächs |
| K14 Kabine | Ruf des Trainers |
| K15 Gespräche | Vorstandsgespräche mit derselben Mechanik |
| K16 Stab | Budget für den Stab |
| K19 Transfers | Transferbudget, Interesse der Spieler nach Ruf |
| K23 Finanzen | Budgets, Prämien, Abfindung |
| K27, K29 | Fans und Medien im Baustein Umfeld |
| K31 | Trainerpool, Trainerwechsel bei Computer-Vereinen |
| K34 Statistik | Karriere, Ruf, Titel, Gehalt |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Entlassungen | ligaweit pro Saison 3–7 Trainerwechsel in der 1. Liga (prüfen) |
| Ultimatum | in etwa der Hälfte der Fälle übersteht der Trainer das Ultimatum |
| Tiefstapeln | lohnt nicht immer: im Schnitt gleich viele Punkte, aber weniger Geld |
| Nach dem Aufstieg | Standardziel Klassenerhalt |
| Ruf | ein Trainer, der dreimal sein Ziel übertrifft, bekommt Angebote von Vereinen mit 10–20 höherem Ansehen |

## 11. Stellschrauben

```js
vorstand:{
  /* bestehende Werte bleiben, schneller Anteil mit Gewicht 0.5 */
  schnellGewicht:0.5,
  ziel:{basis:50,sport:[-35,25],ziele:[-10,10],finanzen:[-15,5],umfeld:[-10,5],traegheit:0.2},
  ultimatum:{spiele:2,zweites:true},entlassung:{basis:0.9,jeGeduld:-0.03},
  verhandeln:{grund:0.6,jePlatz:-0.2,budgetTief:-0.15,budgetHoch:0.10},
  aufsteigerZiel:'klassenerhalt',
  ruf:{start:30,jePlatzUeber:3,meister:15,pokal:10,aufstieg:8,entlassung:-8,abstieg:-6,verfehlt:-4,vergessen:0.05,ruecktritt:-5},
  trainer:{laufzeit:[1,3],verlaengernAb:55,abfindung:0.5},
  praesident:{wahlJahre:[3,4]}
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Ultimatum vor der Entlassung** statt sofortigem Rauswurf an der Grenze.
2. **Vertrauen mit Bausteinen und Trägheit,** die Werte je Spiel bleiben mit halbem Gewicht.
3. **Nach dem Aufstieg immer Klassenerhalt** als Standardziel.
4. **Trainergehalt nur als Statistik.**

**Vorläufig entschieden mit U12a** (20.11., von mir, ohne Rücksprache und ohne Testlauf):

5. **U12 in vier Teilschritten** (§5.6): U12a Vertrauen, Ultimatum, Ruf. U12b Zielgespräch und Nebenziele. U12c Beziehungen (K17). U12d Ereignis-Gerüst (K30).
6. **Ultimatum über Ligaspiele statt Pflichtspiele.** Pokalspiele liegen unregelmäßig, mit Ligaspielen ist die Frist für alle gleich lang.
7. **Kein eigener Halt für das Ultimatum.** Das nächste eigene Spiel hält ohnehin an, die Meldung steht dann oben.
8. **Platz je Spiel entfällt** (bisher `vorstand.platz`): Sonst zählte der Tabellenplatz doppelt, im schnellen und im trägen Anteil.
9. **Sport gegen das Saisonziel**, nicht gegen den erwarteten Platz wie bei Computer-Vereinen. Dein Ziel ist das, was der Vorstand von dir verlangt (K02 verschiebt es je Stufe).
10. **Präsident ohne Namen und ohne Wahl,** wie in K31 §12 Nr. 34. Neuwahl und „Präsident mischt sich ein“ kommen mit K30.
11. **Ruf wirkt zuerst nur auf Jobangebote.** Die anderen Wirkungen brauchen K14, K19 und K29 im Detail.
12. **Rücktritt** (§5.3): gebaut in U12b (§5.7, Bereich `ruecktritt`, Grundlizenz). Der frühere Hinweis „fehlt noch“ war veraltet (berichtigt am 22.11.2026).

**Vorläufig entschieden mit U12b** (20.11., von mir, ohne Rücksprache und ohne Testlauf):

13. **Zielgespräch verschoben, bis K23 Budgets hat** (§5.7). Damit ist §5.2 ganz offen. U12b besteht aus Nebenzielen und Rücktritt.
14. **Drei Nebenziele statt fünf:** Pokal, Jugend, Finanzen. Für Kader und Zuschauer fehlen Gehaltsrahmen und K27.
15. **Jugend in Einsätzen statt Minuten:** Das Spiel zählt Einsätze je Spieler (`apps`), keine Minuten. 25 Einsätze entsprechen grob einem Talent, das zwei Drittel der Ligaspiele bestreitet.
16. **Ehrgeiz des Präsidenten wirkt:** ab 14 zwei Nebenziele. Damit ist neben der Geduld der zweite Charakterwert in Gebrauch.
17. **Rücktritt in der Grundlizenz:** Er ist eine Karriere-Entscheidung, keine Fähigkeit, die man lernen muss.

**Vorläufig entschieden mit U12e** (22.11., popolupo, ohne Rücksprache und ohne Testlauf, §5.8):

18. **Vorschlag wie bisher** (Ziel aus dem erwarteten Platz, verschoben nach der Schwierigkeit). Der Ehrgeiz des Präsidenten verschiebt nicht den Vorschlag, sondern macht ihn schwerer oder leichter herunterzuhandeln (±15 %).
19. **Ein bis zwei Plätze, eine Entscheidung je Saison,** offen bis zum nächsten eigenen Ligaspiel. Ohne Entscheidung gilt der Vorschlag.
20. **Transferbudget als weiche Grenze:** Kaufen über dem Budget geht, kostet aber Vertrauen (−1 je angefangene 10 % der Ablöse über dem Budget, höchstens −10). Eine harte Sperre hätte viele bestehende Abläufe verändert.
21. **Prämie als Ruf:** Ein Trainergehalt gibt es nicht. Nach dem Tiefstapeln zählt „übertroffen“ vom Vorschlag aus, ein erreichtes hochgepokertes Ziel bringt +2 Ruf je Platz.
22. **Zielgespräch in der Grundlizenz** (Bereich `zielgespraech`), wie der Rücktritt.

**Vorläufig entschieden mit U12f** (22.11., popolupo, ohne Testlauf, §5.9):

23. **Zwischenbilanz zur Hälfte der eigenen Ligaspiele** statt an einem festen Datum. So passt sie zu allen Ligen und zu einem Jobwechsel.
24. **Anheben vom Vorstand, Senken nur auf Antrag**, je ein Platz, Schwelle 4 Plätze Abstand. Ein zugesagter Antrag wirkt wie Tiefstapeln.

**Vorläufig entschieden mit U12g** (22.11., popolupo, ohne Testlauf, §5.10):

25. **Trainergehalt nur als Statistik**, nicht über das Vereinskonto. Nr. 21 gilt weiter für Prämien: Sie bleiben Ruf. Das Gehalt richtet sich nach Liga, Ansehen und Ruf, die Laufzeit nach der Geduld des Präsidenten.
26. **Kein Abschied bei Vertragsende:** Unter Vertrauen 56 verlängert der Vorstand um eine Saison zum alten Gehalt. Der Abschied folgt mit dem Vertragsgespräch.

**Vorläufig entschieden mit U12i** (22.11., popolupo, ohne Testlauf, §5.12):

27. **Präsidentenwahl alle 3 oder 4 Jahre** nach festem Takt je Verein, Chance zu bleiben aus Punkten, Auf- und Abstieg und Fanstimmung. Ein neuer Präsident bekommt neue Werte, dein Vertrauen rückt zur Hälfte Richtung 50.
28. **Jobangebot als Karte** (U12j, §5.13): ab Ruf 55, Wechsel nur auf deine Wahl, Ablöse ein Jahresgehalt für den alten Verein.

**Noch zu recherchieren:** Zahl der Trainerwechsel pro Saison in 1., 2. und 3. Liga.

## Quellen

- Saisonziel verhandeln: PLAN §4 (GameStar 4/2000)
- Unrealistische Ziele nach Aufstiegen, Trainergehalt: `konzepte/_recherche-genre.md`, Abschnitt 4b
- Heutige Vorstandslogik: `daten/regeln.js` (Abschnitt `vorstand`), `js/ablauf.js`

### 5.14 Umsetzung U12l (22. November 2026, popolupo, ohne Testlauf): Budgetgespräch

Nach K15 §12 Nr. 20 („Gespräche mit dem Vorstand“), mit der Glaubwürdigkeit als Warnsignal.

- **Wann:** einmal je Saison und Verein, während der Saison, im Büro unter dem Saisonziel. Bereich `zielgespraech` (Grundlizenz).
- **Zusage:** 40 % + 1 % je Punkt Vertrauen über 50 + 0,5 % je Punkt Ruf über 30 − 2 % je Punkt Sparsamkeit des Präsidenten über 10. Bei Glaubwürdigkeit unter 40 halb so viel. Zwischen 5 und 90 %, eigener Strom.
- **Zugesagt:** Das Transferbudget steigt bis Saisonende um 20 % (zusammen mit dem Faktor aus dem Zielgespräch).
- **Abgelehnt:** Vertrauen −3.
- **Noch nicht:** Gehaltsrahmen verhandeln, Gespräch über einen Stadionausbau.
