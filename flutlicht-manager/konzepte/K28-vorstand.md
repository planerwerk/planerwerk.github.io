# K28 – Vorstand, Ziele, Karriere

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
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

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Ultimatum | Vertrauen unter der Grenze | zwei Spiele, Presse (K29) |
| Präsident mischt sich ein (Entscheidung) | ehrgeiziger Präsident, Niederlagenserie | er will einen bestimmten Spieler sehen oder verkaufen: nachgeben (Vertrauen +) oder standhaft (Vertrauen −, Glaubwürdigkeit +) |
| Rückendeckung vom Vorstand | Vertrauen über 80 nach Krise | Info, Vertrauen ein Monat stabil |
| Neuer Präsident | Wahl alle 3–4 Jahre, Zufall | neue Charakterwerte, Ziele werden neu verhandelt |
| Jobangebot während der Saison (Entscheidung) | Ruf hoch, Verein mit höherem Ansehen | wechseln (Ablöse für den Trainervertrag), bleiben (Vertrauen +), Gespräch publik (Glaubwürdigkeit −) |

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

**Noch zu recherchieren:** Zahl der Trainerwechsel pro Saison in 1., 2. und 3. Liga.

## Quellen

- Saisonziel verhandeln: PLAN §4 (GameStar 4/2000)
- Unrealistische Ziele nach Aufstiegen, Trainergehalt: `konzepte/_recherche-genre.md`, Abschnitt 4b
- Heutige Vorstandslogik: `daten/regeln.js` (Abschnitt `vorstand`), `js/ablauf.js`
