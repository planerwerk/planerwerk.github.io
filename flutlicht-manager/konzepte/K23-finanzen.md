# K23 – Finanzen und Budget

Status: **Entwurf** (8. November 2026), geschrieben nach „weiter, entscheide du“ (PLAN §1, Punkt 9). Vorläufige Entscheidungen stehen in Abschnitt 12. **Teilschritte K23a und K23e umgesetzt (21. November 2026, popolupo, §5.5c, §5.5d), noch ohne Testlauf.**
Hängt ab von: K13 (Wettbewerbe, Prämien), K19 (Transfers), K21 (Gehälter), K28 (Vorstand) · Wird gebraucht von: K24–K27, K31.

## 1. Ziel und Spielgefühl

- **Wirtschaft ist unsere Chance:** Sie war die Stärke von BMH und Anstoss und ist die Schwäche des Football Managers (Recherche 4).
- **Verständlich und ehrlich:** Woher kommt das Geld, wohin geht es, was bleibt am Saisonende? Eine Übersicht, die auch für kleine Vereine taugt (Community-Wunsch, Recherche 4b).
- **Echte Größenordnungen:** Medien, Werbung, Spieltag und Transfers im Verhältnis wie in der Bundesliga.
- **Folgen:** Wer über seine Verhältnisse lebt, bekommt Auflagen, im schlimmsten Fall Punktabzug. Wer aufsteigt, hat stimmige Finanzen statt plötzlicher Schulden (Recherche 4b).

## 2. Vorbilder und Abgrenzung

- **DFL-Wirtschaftsreport:** Struktur der Erlöse, Verteilung der Medienerlöse nach Säulen (Quellen).
- **Heute im Spiel:** Buchungen je Ligaspieltag (TV, Sponsor, Zuschauer, Gehälter, Betrieb, Jugend, Zinsen), Kredit mit 8 % Zins, Startkonto nach Ansehen, Computer-Vereine mit Pauschaleinnahmen. Bleibt bis zum Ersatz („nichts wegnehmen“).
- **Bewusst anders:** **Monatsabrechnung** statt Buchung je Spieltag (Konsistenzprüfung H7). Gleiches Einnahmenmodell für alle Vereine, auch Computer-Vereine.

## 3. Begriffe und Daten

### 3.1 Einnahmen

| Art | Wie berechnet | Anteil in der 1. Liga (Ziel) |
|---|---|---|
| **Medien national** | Säulenmodell (5.1) | 30–38 % |
| Medien international | mit dem Europapokal (K37, fest eingeplant), bis dahin eine Pauschale für die Plätze 1–4, 5–6 und 7 der Bundesliga in der folgenden Saison (seit 10.11., K02 §5.3a) | – |
| **Werbung, Sponsoren** | Verträge aus K24 | 22–28 % |
| **Spieltag** | Zuschauer × Preis, Logen, Catering (heute Zuschauer und Logen) | 10–14 % |
| **Merchandising** | Fanartikel (heute je Zuschauer), mit K25 nach Fans und Stars | 4–7 % |
| **Transfers** | Ablösen (K19) | 8–18 %, stark schwankend |
| Sonstiges | Pokalprämien (K13), Mitgliedsbeiträge, Stadionvermietung, Testspiele (K11) | 7–11 % |

### 3.2 Ausgaben

| Art | Woraus |
|---|---|
| **Personal Spieler** | Gehälter und Prämien (K21) |
| Personal Stab und Verwaltung | K16, dazu Verwaltung pauschal nach Ansehen |
| Spielbetrieb | Stadion (heute je Platz und Loge), Reisen, Sicherheit |
| Jugend | Jugendarbeit (gibt es), später Nachwuchsleistungszentrum (K26) |
| Ablösen | sofort oder in Raten (K19) |
| Provisionen, Handgeld, Abfindungen | K21, K22 |
| Zinsen | Kredit (gibt es) |
| Geldstrafen | K09 |
| Bau | Stadion und Anlagen (K26) |

### 3.3 Im Spielstand

- `t.cash` (gibt es), `S.fin` als Buchungen je Monat und Art (heute je Saison), `S.budget` (Transferbudget, Gehaltsrahmen, Stab), `S.raten` (offene Ratenzahlungen in beide Richtungen), `S.lizenz` (Stand der Prüfung).

## 4. Abläufe

| Wann | Was |
|---|---|
| **1. jedes Monats** | Monatsabrechnung: Gehälter (1/12), Stab, Verwaltung, Sponsoren, Medienrate, Zinsen, fällige Raten. **Monatsbericht** im Posteingang (Info). |
| jedes Heimspiel | Spieltagseinnahmen sofort (gibt es) |
| Medien | in vier Raten: August, November, Februar, Mai |
| Saisonstart | Vorstand setzt Budgets (5.3), Zielgespräch (K28) |
| März | **Lizenzprüfung** für die nächste Saison (5.4) |
| Saisonende | Saisonbilanz, Vergleich mit dem Ligaschnitt, Ausblick |

## 5. Regeln und Formeln

### 5.1 Medien national

- **Topf:** 1,121 Mrd. € pro Saison für die 36 Vereine der 1. und 2. Liga, aufgeteilt 80:20 (Quellen).
- **Säulen:** Gleichverteilung 50 %, Leistung 43 %, Nachwuchs 4 %, Interesse 3 % (Quelle zdfheute, Gewichtung noch gegenprüfen).
  - **Gleichverteilung:** gleicher Betrag je Verein der Liga.
  - **Leistung:** Fünfjahreswertung aus beiden Ligen, jüngere Saisons stärker gewichtet. Ein Absteiger bekommt so in der 2. Liga noch deutlich mehr als die anderen, ein Aufsteiger wächst langsam hinein.
  - **Nachwuchs:** Einsatzminuten eigener Talente (K08).
  - **Interesse:** nach Ansehen und Fans (K27).
- **3. Liga:** eigener kleiner Topf vom DFB (Höhe prüfen), gleich verteilt.
- Durchschnitt: etwa 50 Mio. € je Erstligist und 12,5 Mio. € je Zweitligist aus den nationalen Medien.

### 5.2 Gleiche Regeln für alle

- Computer-Vereine bekommen dieselben Medien-, Spieltags-, Sponsor- und Merchandising-Einnahmen wie du, berechnet aus Ansehen, Fans, Stadion und Tabelle. Die heutigen Pauschalen (`fremdeEinnahmen`) entfallen.

### 5.3 Budgets

- **Gehaltsrahmen** = 50 % der erwarteten Einnahmen ohne Transfers (Spielwert, Personalkostenquote nicht recherchiert).
- **Transferbudget** = Kontostand über einer Mindestreserve (10 % der Jahreseinnahmen) plus 50 % der erwarteten Transfereinnahmen, verschoben durch das Zielgespräch (K28 §5.2) und die Sparsamkeit des Präsidenten.
- **Überschreiten** des Gehaltsrahmens: Vertrauen sinkt (K28), ab 10 % darüber muss erst verkauft werden, bevor gekauft wird (wie K31).
- **Stab-Budget** als Teil des Gehaltsrahmens (K16).

### 5.4 Lizenzprüfung und Pleite

- **März:** Liquiditätsprognose bis Ende der nächsten Saison. Negativ → **Auflagen**: Nachweis bis Mai (Verkauf, Kredit, Gehaltsverzicht), sonst Transfersperre im Sommer.
- **Kontostand unter dem negativen Kreditrahmen** zwei Monate in Folge → **Insolvenz**: Punktabzug (Höhe prüfen, vorläufig 9 Punkte wie häufig berichtet), Notverkäufe, Vertrauen −30.
- Kein Bankrott ohne Vorwarnung: Der Monatsbericht warnt drei Monate vorher.

### 5.5 Kredite und Raten

- Kredit wie heute (8 % Zins, Rahmen nach Ansehen), dazu **Laufzeit** und Tilgung monatlich.
- Raten aus Transfers (K19) in beide Richtungen, fällig zum Monatsersten.
- **Gehaltsverzicht** als Notmaßnahme (Gespräch mit dem Mannschaftsrat, K15): −10 bis −20 % für drei Monate, Stimmung −10.

### 5.5b Umsetzung in Teilschritten (21.11.2026, vorläufig)

K23 ändert fast jede Geldzahl im Spiel. Damit jeder Schritt für sich getestet werden kann:

| Teil | Inhalt |
|---|---|
| K23a | Monatsbericht, Liquiditätsprognose, Lizenzprüfung im März mit Auflagen, Insolvenz mit Punktabzug, zuerst nur für deinen Verein |
| K23b | gleiche Einnahmen und Ausgaben für Computer-Vereine statt Pauschale (§5.2). Gebaut am 22.11. (§5.5e). Das Säulenmodell der Medien wandert nach K23c, die Pauschale für die Europapokal-Plätze entfällt, weil es den Europapokal gibt (K37) |
| K23c | echte Größenordnungen (§5.6) für alle Geldwerte in einem Zug, danach die Sponsorenhöhen aus K24 §5.1 |
| K23d | Budgets (§5.3) mit Bezug zum Zielgespräch (K28) |
| K23e | Raten und Kredit mit Laufzeit (§5.5), Gehaltsverzicht, Karten aus §8 |

**Abweichung von §4:** Die Buchungen bleiben bis K23c je Spieltag. Der Monatsbericht fasst sie zusammen. So ändert K23a kein Geld.

### 5.5c Umsetzung K23a (21.11.2026): Monatsbericht, Prognose, Lizenz, Insolvenz

- **Monatsbericht** am Ersten jedes Monats im Posteingang: Einnahmen, Ausgaben, Saldo des Monats je Buchungsart, Kontostand, Prognose bis Saisonende. Die Finanzseite zeigt die Monate der Saison als Tabelle.
- **Laufende und einmalige Buchungen:** Für die Prognose zählen nur laufende Arten (TV, Sponsor, Zuschauer, Logen, Fanartikel, Gehälter, Stab, Prämien, Betrieb, Jugend, Zweite, Zinsen, Scouting). Transfers, Handgelder, Abfindungen, Provisionen, Strafen, Bau und Ereignisse sind einmalig.
- **Prognose:** Kontostand + laufender Saldo je Ligaspiel (Schnitt dieser Saison) × verbleibende Ligaspiele. Vor dem dritten Ligaspiel gilt der Schnitt der letzten Saison, beim ersten Spiel überhaupt 0. Für die Lizenz zusätzlich eine ganze nächste Saison mit demselben Schnitt.
- **Liquidität** = Kontostand + nicht genutzter Kreditrahmen.
- **Lizenzprüfung am 1. März** für die nächste Saison: Ist die Liquidität am Ende der nächsten Saison nach der Prognose negativ, gibt es **Auflagen**: Vertrauen −5, Meldung mit dem fehlenden Betrag, Nachweis bis 31. Mai (verkaufen, Kredit, Kosten senken). Fehlt dann noch Geld, gibt es eine **Transfersperre** für die nächste Saison (du kannst nicht kaufen und nicht leihen, verkaufen geht).
- **Insolvenz:** Liegt der Kontostand an zwei Monatsersten nacheinander unter dem negativen Kreditrahmen, ist der Verein insolvent: 9 Punkte Abzug in der laufenden Saison (vorläufig, die Regel gibt es für die 3. Liga, die Höhe ist nicht belegt), Vertrauen −30, Schuldenschnitt auf Kontostand 0 (der Kredit bleibt), höchstens einmal je Saison.
- **Warnung:** Der Monatsbericht warnt, wenn die Prognose in den nächsten drei Monaten unter den negativen Kreditrahmen fällt.
- **Computer-Vereine:** bekommen Lizenzprüfung und Insolvenz erst mit K23b, weil sie heute keine Ausgaben buchen.
- **Lizenz (K36):** keine neue Funktion. Monatsbericht und Prognose sind Information, Auflagen und Insolvenz Folgen.

### 5.5d Umsetzung K23e (21.11.2026): Kredit mit Laufzeit, Raten, Gehaltsverzicht, Karten

K23e kommt vor K23b bis K23d, weil es die Welt kaum verschiebt (nur dein Verein). K23b wartet auf Messwerte aus `tests/finanzmodell.js`.

- **Kredit mit Laufzeit** (§5.5): Beim Aufnehmen wählst du 1 bis 5 Jahre (Standard 3). Jede Tranche wird am Monatsersten in gleichen Raten getilgt. Zinsen wie bisher je Ligaspiel auf den offenen Betrag. Sondertilgung geht jederzeit, die älteste Tranche zuerst. Die Automatik des Vereins (Bereich `kredit`) tilgt am Saisonende wie bisher aus dem Guthaben.
- **Kreditflüsse getrennt erfasst:** Aufnahme und Tilgung sind keine Einnahmen oder Ausgaben und stehen deshalb nicht in `S.fin` (sonst zählten sie in der Saisonbilanz und im Nebenziel „Finanzen“ des Vorstands). Der Monatsbericht nennt sie getrennt, die Prüfung „Kontostand nachvollziehbar“ rechnet sie mit.
- **Ablöse in Raten** (§5.5, K19): Beim Kauf von einem Verein mit Ablöse kannst du „in Raten“ wählen. Die Hälfte zahlst du sofort, der Rest kostet 5 % Aufschlag und wird in 12 Monatsraten fällig (Buchung „Transfers: Raten“). Der Verkäufer bekommt sein Geld sofort (eine Bank finanziert, vereinfacht). Die Prognose zieht fällige Raten ab.
- **Gehaltsverzicht** (§5.5): nur in der Not (Kontostand im Minus oder offene Lizenzauflagen), höchstens einmal je Saison. Die Mannschaft verzichtet drei Monate auf 15 % der Gehälter, die Stimmung aller sinkt um 10. Lizenz-Bereich `kredit` (Pro-Lizenz), weil es dieselbe Art Notmaßnahme ist wie der Kredit.
- **Karten** (§8, K30): „Ein Mäzen bietet Geld an“ (gelegentlich, nur in der Not): 1,5 Mio. €, dafür mischt sich der Präsident für den Rest der Saison auch ohne Ehrgeiz ein (Karte „Der Präsident mischt sich ein“). „Steuerprüfung“ (selten): zahlen (−250.000 €) oder Einspruch (50 %: nichts, sonst −400.000 €).

### 5.5e Umsetzung K23b (22.11.2026, popolupo): Computer-Vereine nach denselben Regeln

Grundlage ist die Messung BZ7 im Testprotokoll (Lauf 5, zwei Saisons). Nach dem vollen Modell lägen die Vereine im Schnitt bei:

| Liga | Saldo je Verein und Saison | mit Minus | heutige Pauschale |
|---|---|---|---|
| 1. Liga | +9,8 bis +12,5 Mio. (Spanne −13,8 bis +31,0) | 1 von 18 | 5,2 Mio. |
| 2. Liga | +0,1 bis −1,5 Mio. | 9 bis 11 von 18 | 2,8 Mio. |
| 3. Liga | −2,9 bis −3,8 Mio. | 16 bis 18 von 20 | 1,8 Mio. |

Gebaut:
- **Je Ligaspiel** bucht jeder Computer-Verein dasselbe wie du:
  - Einnahmen: TV-Geld, Sponsor (Ansehen² × Ligawert wie bei den Angeboten an dich), sonstige Einnahmen, zu Hause Zuschauer, Fanartikel und Logen.
  - Ausgaben: Gehälter von Kader und Stab, Stadion und Betrieb, Jugendarbeit.
  - Die Zuschauerzahl kommt aus dem Erwartungswert ohne Würfel, zum Richtpreis. So verschiebt sich kein Zufallsstrom. Die Pauschale `fremdeEinnahmen` entfällt.
- **Pokal:** Rundenprämie für beide Teilnehmer, Zuschauer für den Gastgeber, Siegprämie im Finale. Vorher bekam jeder Verein eine Pauschale je Runde, auch ohne Spiel.
- **Sonstige Einnahmen** (Mitglieder, Vermarktung, §3.1) je Ligaspiel für alle Vereine, auch für dich: 1. Liga 0, 2. Liga 25.000 €, 3. Liga 60.000 €. Damit liegt die 2. Liga im Schnitt knapp im Plus und die 3. Liga knapp im Minus, wie in echt. **Vorläufig bis K23c**, dort kommen sie aus echten Anteilen.
- **Insolvenz für Computer-Vereine** nach deiner Regel: zwei Monatserste unter dem negativen Kreditrahmen, 9 Punkte Abzug, Schuldenschnitt. Bei einem Kreditrahmen von 12 Mio. für einen Drittligisten kommt das selten und erst nach Jahren.
- **Noch nicht:** Lizenzprüfung für Computer-Vereine (mit den Budgets in K23d), Säulenmodell der TV-Gelder (§5.1, mit den echten Beträgen in K23c), Zuschauer der Computer-Vereine im Europapokal.

### 5.5f Umsetzung K23d (22.11.2026, popolupo): Budgets vom Vorstand

- **Gehaltsrahmen** = 85 % der erwarteten Einnahmen einer Saison ohne Transfers:
  - TV, Sponsor und Sonstiges je Ligaspiel, dazu die Heimspiele zum Erwartungswert.
  - Die Form ist dabei neutral, damit der Rahmen nicht schwankt.
  - **Vorläufig 85 % statt 50 % (§5.3):** Heute liegen die Gehälter im Spiel bei 70 bis 85 % dieser Einnahmen (BZ7). Mit K23c sinkt der Anteil.
- **Über 100 %** sinkt das Vertrauen des Vorstands (Baustein Finanzen −5).
- **Über 110 %** gibt der Vorstand keine neuen Gehälter frei. Das gilt für dich (Angebot) und für Computer-Vereine (kein Kauf im Fenster), damit beide Läufe im Gleichschritt-Test gleich entscheiden.
- **Transferbudget** = Kontostand über einer Reserve von 10 % der erwarteten Einnahmen. Vorerst nur Anzeige, das Budget der Computer-Vereine bleibt wie bisher ein Anteil des Kontos (K31).
- **Noch nicht:** Zielgespräch (K28 §5.2), sparsame Profile mit mehr Reserve, Lizenzprüfung für Computer-Vereine.

### 5.6 Größenordnungen

- Ziel: Erstligisten im Schnitt etwa 280 Mio. € Umsatz (2024/25: 5,12 Mrd. € für 18 Vereine), Zweitligisten etwa 67 Mio. € (1,21 Mrd. €), mit großer Spanne. Der größte Verein liegt nahe einer Milliarde.
- Die heutigen Werte im Spiel sind kleiner (TV je Spieltag 120.000 € + 2.500 € × Ansehen). U13 stellt alle Geldwerte auf echte Größenordnung um, Gehälter (K21) und Ablösen (K19) im selben Zug, damit die Verhältnisse stimmen.

### 5.6a Plan für K23c (22.11.2026, popolupo, Entwurf, noch nicht gebaut)

**Echt gegen Spiel**, je Verein und Saison. Echt: Saison 2023/24 (DFL-Wirtschaftsreport 2025, DFB-Saisonreport 3. Liga). Spiel: Messung BZ7, Saison 2026.

| Bereich | 1. Liga echt | 1. Liga Spiel | 2. Liga echt | 2. Liga Spiel | 3. Liga echt | 3. Liga Spiel |
|---|---|---|---|---|---|---|
| Umsatz | 267 Mio. (4,80 Mrd. / 18) | 42 Mio. | 59 Mio. (1,07 Mrd. / 18) | 15 Mio. | etwa 16 Mio. (Aufwand 16,8 Mio., Minus etwa 0,6 Mio.) | 6 Mio. |
| Medien national | etwa 50 Mio. (Topf 1,121 Mrd., 80 % für die 1. Liga) | 10 Mio. | etwa 12,5 Mio. | 3,3 Mio. | nicht recherchiert | 1,4 Mio. |
| Werbung | 57 Mio. (1,02 Mrd. / 18) | 8 Mio. | nicht recherchiert | 1,7 Mio. | nicht recherchiert | 0,5 Mio. |
| Spieltag | 29 Mio. (524 Mio. / 18) | 24 Mio. | nicht recherchiert | 10 Mio. | nicht recherchiert | 4,5 Mio. |
| Personal Spielbetrieb | 93 Mio. (1,67 Mrd. / 18) | 30 Mio. | 16,4 Mio. (296 Mio. / 18) | 12 Mio. | nicht recherchiert | 7 Mio. |

**Was daraus folgt:**
- Zuschauer, Pokalprämien und vermutlich auch die Ablösen liegen im Spiel schon nahe an echt.
- TV-Gelder (etwa ein Fünftel), Werbung (etwa ein Siebtel) und die Gehälter der Großen (etwa ein Drittel) sind zu klein.
- Ein einheitlicher Faktor reicht deshalb nicht. K23c hebt die zu kleinen Bereiche, die übrigen bleiben.

**Vorschlag (vorläufig):**
1. **TV:** Säulenmodell (§5.1) mit echten Töpfen, 1. Liga im Schnitt 50 Mio., 2. Liga 12,5 Mio., 3. Liga eigener Topf (Höhe recherchieren).
2. **Werbung:** `RF.sponsor` (K24, Claude ist einverstanden, siehe Testprotokoll Lauf 7) auf echte Größe, 1. Liga im Schnitt 57 Mio. für alle Flächen zusammen.
3. **Gehälter steiler statt nur höher:**
   - In der 1. Liga sollen sie etwa dreimal so hoch werden, in der 3. Liga nur wenig mehr.
   - Formel `gehalt = basis × e^(steigung × (Stärke − 75))` mit `basis` 2,1 Mio. statt 1 Mio. und `steigung` 0,137 statt 0,1.
   - Gerechnet: Stärke 60 bekommt 0,27 statt 0,22 Mio., Stärke 85 8,2 statt 2,7 Mio., Stärke 90 16 statt 4,5 Mio.
   - Marktwerte im selben Verhältnis anpassen, sonst stimmt das Verhältnis Gehalt zu Wert nicht mehr (echt etwa 10 bis 15 % je Jahr). Das muss vorher gemessen werden.
4. **Europapokal:** Faktor `REU.geld.faktor` 0,2 → 1.
5. **Sonstige Einnahmen** (K23b) aus echten Anteilen (7–11 % des Umsatzes) statt fester Beträge je Liga.
6. **Kosten mitziehen:**
   - Betrieb, Jugend, Stab, Startkonto, Kreditrahmen.
   - Feste Beträge in Karten, Kampagnen (K25) und Bauten (K26, echt 3.000 bis 6.000 € je Sitzplatz).
7. **Reihenfolge:** erst messen, wie Gehälter und Marktwerte im Spiel heute verteilt sind (je Liga Schnitt und Spanne), dann alle Werte in einem Commit, dann ein voller Testlauf.

**Noch zu recherchieren:**
- TV-Topf der 3. Liga.
- Werbung und Spieltag der 2. und 3. Liga.
- Personal der 3. Liga.
- Echte Gehälter und Marktwerte nach Stärke (zum Beispiel Kaderwert und Gehaltsliste eines Vereins je Liga).

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Ticketpreise (gibt es), Logen, Stadion (K26) | Spieltag | Zuschauer, Baukosten |
| Sponsoren (K24) | Werbung | Verpflichtungen, Laufzeiten |
| Marketing (K25) | Merchandising, Fans | Kosten |
| Transfers | Geld oder Kader | sportlich |
| Kredit | Liquidität | Zinsen |
| Jugend (K08) | Säule Nachwuchs, spätere Verkäufe | Kosten |
| Gehaltsverzicht | Rettung in der Not | Stimmung |

## 7. Verhalten der Computer-Vereine

- Gleiches Modell (5.2). Ihr Vorstand setzt Budgets nach denselben Regeln, sparsame Profile halten mehr Reserve (K31).
- Auch Computer-Vereine können Auflagen bekommen und insolvent werden.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Liquiditätswarnung | Prognose negativ | Info, Maßnahmen vorschlagen |
| Auflagen bei der Lizenz (Entscheidung) | März, Prognose negativ | verkaufen, Kredit, Gehaltsverzicht |
| Mäzen bietet Geld an (Entscheidung) | Verein in Not, Zufall | Geld gegen Einfluss (Präsident mischt sich öfter ein, K28) |
| Steuerprüfung | Zufall, selten | kleine Nachzahlung, Presse |

## 9. Wechselwirkungen

K08 (Nachwuchssäule), K09 (Strafen), K11 (Testspiele), K13 (Prämien), K16 (Stab), K19 (Ablösen, Raten), K21 (Gehälter), K22 (Provisionen), K24–K27 (Einnahmen), K28 (Budgets, Vertrauen), K31 (gleiche Regeln), K34 (Finanzstatistik), K35a (Finanzseite mit Prognose-Band).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Erlösstruktur 1. Liga | Medien 30–38 %, Werbung 22–28 %, Spieltag 10–14 %, Merchandising 4–7 %, Transfers 8–18 % (DFL 2022/23: 34 / 25 / 12 / 5 / 14 %) |
| Umsatz | Schnitt 1. Liga 250–320 Mio. €, 2. Liga 55–80 Mio. € |
| Ligaergebnis | über alle Vereine leicht positiv (2024/25: +271,5 Mio. € bei 6,33 Mrd. € Umsatz) |
| Pleiten | 0–1 Insolvenz je Saison in 1. bis 3. Liga |
| Aufsteiger | ein durchschnittlicher Aufsteiger macht im ersten Jahr kein großes Minus, wenn er im Gehaltsrahmen bleibt |
| Monatsbericht | Kontostand jederzeit nachvollziehbar aus den Buchungen |

## 11. Stellschrauben

```js
finanzen:{
  medien:{topf:1.121e9,anteil:{1:0.8,2:0.2},saeulen:{gleich:0.50,leistung:0.43,nachwuchs:0.04,interesse:0.03},
    leistungJahre:5,leistungGewichte:[5,4,3,2,1],raten:['08','11','02','05'],liga3Topf:null},
  budget:{gehaltsrahmen:0.5,reserve:0.10,transferAnteil:0.5,ueberschreitenAb:0.10},
  lizenz:{monat:3,nachweisBis:5},insolvenz:{monate:2,punkte:9,vertrauen:-30,warnMonate:3},
  kredit:{zins:0.08,laufzeitJahre:[1,5]},verzicht:{anteil:[0.10,0.20],monate:3,stimmung:-10},
  verwaltungJeAnsehen:40000
}
```

`finanzen.tv`, `finanzen.fremdeEinnahmen` und die Buchung je Spieltag in `js/ablauf.js` gehen darin auf.

## 12. Offene Fragen

**Vorläufig entschieden:**

1. **Monatsabrechnung** statt Buchung je Spieltag.
2. **Echte Größenordnungen** für alle Geldwerte, umgestellt in einem Schritt mit Gehältern und Ablösen (U13).
3. **Gehaltsrahmen 50 %** der erwarteten Einnahmen ohne Transfers (Spielwert).
4. **Insolvenz mit 9 Punkten Abzug** (vorläufig, prüfen).

**Noch zu recherchieren:** Personalkostenquote der Bundesliga, Medientopf der 3. Liga, Punktabzug bei Insolvenz in DFL und 3. Liga, aktuelle Säulengewichtung.

**Recherche vom 21.11.2026 (Suchergebnisse, Auszüge):**
- **Personalkosten:** 2. Liga 2024/25 Personalaufwand Spielbetrieb 24,6 % des Gesamterlöses (2023/24 27,7 %, 2022/23 31,7 %). 1. Liga 2024/25 Personalaufwand Spielbetrieb 35,3 % der Gesamtaufwendungen, die Quote zum Erlös habe ich nicht gefunden. Folgerung für K23d: 50 % Gehaltsrahmen ist zu hoch, eher 35 bis 40 % der Einnahmen ohne Transfers (offen bis K23d).
- **3. Liga:** 26,2 Mio. € TV-Einnahmen brutto je Saison, 1,31 Mio. € je Verein (Vertrag 2023/24 bis 2026/27). Ab 2027/28 neue Verträge, mehr Geld angekündigt, Höhe offen.
- **Insolvenz:** Der DFB regelt den Punktabzug bei Insolvenz für 3. Liga und Regionalliga (Spielausschuss entscheidet, Ausnahme bei Insolvenz des Hauptsponsors). Für die Lizenzligen gilt die Lizenzordnung der DFL, die Fundstelle habe ich nicht gelesen. Die 9 Punkte bleiben vorläufig.

**Vorläufig entschieden mit K23a (21.11.2026, von mir):**

5. Teilschritte K23a bis K23e statt eines großen Schritts (§5.5b).
6. Buchungen bis K23c weiter je Spieltag, der Monatsbericht fasst zusammen (§5.5b).
7. Prognose aus dem laufenden Saldo je Ligaspiel, ohne einmalige Buchungen (§5.5c).
8. Lizenzprüfung am 1. März, Nachweis bis 31. Mai, sonst Transfersperre für die nächste Saison (§5.5c).
9. Insolvenz nach zwei Monatsersten unter dem negativen Kreditrahmen, 9 Punkte, Vertrauen −30, Schuldenschnitt auf 0 (§5.5c).

**Vorläufig entschieden mit K23e (21.11.2026, von mir):**

10. K23e vor K23b bis K23d (§5.5d).
11. Kredit in Tranchen mit Laufzeit 1 bis 5 Jahre und monatlicher Tilgung. Kreditflüsse außerhalb von `S.fin` (§5.5d).
12. Ablöse in Raten: Hälfte sofort, Rest mit 5 % Aufschlag in 12 Monatsraten. Der Verkäufer bekommt alles sofort (§5.5d).
13. Gehaltsverzicht 15 % für drei Monate, Stimmung −10, nur in der Not, einmal je Saison, Bereich `kredit` (§5.5d).
14. Karten Mäzen und Steuerprüfung mit festen Beträgen (§5.5d). Sie passen erst nach K23c zur echten Größe.
15. Computer-Vereine buchen je Ligaspiel nach deinem Modell, Zuschauer ohne Würfel zum Richtpreis (§5.5e).
16. Sonstige Einnahmen je Ligaspiel nach Liga für alle Vereine (0, 25.000, 60.000 €), vorläufig bis K23c (§5.5e).
17. Insolvenz für Computer-Vereine nach deiner Regel, Lizenzprüfung für sie erst mit K23d (§5.5e).
18. Das Säulenmodell der TV-Gelder kommt mit K23c (§5.5e).
19. K23d vor K23c, weil Budgets Anteile der Einnahmen sind und nicht von den Größenordnungen abhängen (§5.5f).
20. Gehaltsrahmen 85 % der erwarteten Einnahmen bis K23c, über 110 % keine neuen Gehälter, für dich und Computer-Vereine (§5.5f).

**Quellen der Recherche vom 21.11.2026:**
- Personalaufwand 2. Liga zum Gesamterlös: https://report.bundesliga.de/2425/de/_assets/downloads/key-bundesliga-2-dfl-er25.pdf
- Personalaufwand 1. Liga zu den Gesamtaufwendungen: https://report.bundesliga.de/2425/de/_assets/downloads/key-economic-figures-dfl-er25.pdf
- 3. Liga 26,2 Mio. € TV-Einnahmen, 1,31 Mio. € je Verein: https://www.dfb.de/ePaper/DFB-Saisonreport-3-Liga-202324/55/
- Punktabzug bei Insolvenz in 3. Liga und Regionalliga: https://www.dfb.de/fileadmin/_dfbdam/221172-OM_04_2020_Final.pdf und https://www.lto.de/recht/hintergruende/h/dfb-schiedsgericht-punktabzug-wegen-insolvenz-ordentliche-gerichtsbarkeit-rechtsmittel

## Quellen

- Wirtschaftszahlen 2023/24 für den Plan K23c (abgerufen 22.11.2026): [DFL-Wirtschaftsreport, Bundesliga, Gewinn- und Verlustrechnung](https://report.bundesliga.de/2324/en/economic-report/economic-figures/bundesliga/income-statement.html), [DFL, 2. Bundesliga](https://report.bundesliga.de/2324/en/economic-report/economic-figures/bundesliga-2/income-statement.html), [DFL, Lizenzfußball](https://report.bundesliga.de/2324/en/economic-report/economic-figures/licensed-football/revenue-and-expenditure.html), [DFB-Saisonreport 3. Liga 2023/24](https://assets.dfb.de/uploads/000/315/789/original_Saisonreport_3Liga_A4_23_24.pdf), [Stuttgarter Zeitung, Umsatzrekord](https://www.stuttgarter-zeitung.de/sport/dfl-erstmals-ueber-sechs-milliarden-ligen-mit-rekordumsatz-79123089.html)

- Umsatz 2024/25, Bundesliga und 2. Liga, Kosten, Gewinn: [bundesliga.com](https://www.bundesliga.com/de/bundesliga/news/bundesliga-saison-2024-25-dfl-milliarden-umsatz-rekord-35757), [sportschau.de](https://sportschau.de/fussball/bundesliga/dfl-verkuendet-umsatzrekord-der-bundesligisten,dfl-umsatzrekord-102.html), [DFL Economic Report 24/25](https://report.bundesliga.de/2425/en/economic-report/economic-figures/licensed-football/revenue-and-expenditure.html)
- Erlösstruktur 2022/23: [DFL-Kennzahlen Bundesliga (PDF)](https://report.bundesliga.de/2425/de/_assets/downloads/key-bundesliga-dfl-er25.pdf)
- Medienerlöse 1,121 Mrd. € ab 2025/26, Verteilerschlüssel, Säulen: [bundesliga.com: Medienerlöse ab 2025/26](https://www.bundesliga.com/en/bundesliga/news/dfl-increases-national-media-revenue-to-1121-billion-per-season-from-2025-26-29981), [bundesliga.com: Verteilerschlüssel](https://www.bundesliga.com/de/bundesliga/news/einstimmiger-beschluss-des-dfl-praesidiums-neuer-verteilerschluessel-sichert-leistungs-und-solidarprinzip-im-deutschen-profifussball-30668), [zdfheute](https://www.zdfheute.de/sport/bundesliga-dfl-tv-gelder-verteilung-keine-reform-100.html)
- Wirtschaft als Stärke von BMH und Anstoss, Finanzübersicht für kleine Vereine: `konzepte/_recherche-genre.md`, Abschnitte 4, 4b
