# K23 – Finanzen und Budget

Status: **Entwurf** (8. November 2026), geschrieben nach „weiter, entscheide du“ (PLAN §1, Punkt 9). Vorläufige Entscheidungen stehen in Abschnitt 12. **Teilschritt K23a umgesetzt (21. November 2026, popolupo, §5.5c), noch ohne Testlauf.**
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
| K23b | gleiche Einnahmen und Ausgaben für Computer-Vereine statt Pauschale (§5.2), Säulenmodell der Medien (§5.1), Pauschale für die Europapokal-Plätze |
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

### 5.6 Größenordnungen

- Ziel: Erstligisten im Schnitt etwa 280 Mio. € Umsatz (2024/25: 5,12 Mrd. € für 18 Vereine), Zweitligisten etwa 67 Mio. € (1,21 Mrd. €), mit großer Spanne. Der größte Verein liegt nahe einer Milliarde.
- Die heutigen Werte im Spiel sind kleiner (TV je Spieltag 120.000 € + 2.500 € × Ansehen). U13 stellt alle Geldwerte auf echte Größenordnung um, Gehälter (K21) und Ablösen (K19) im selben Zug, damit die Verhältnisse stimmen.

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

**Quellen der Recherche vom 21.11.2026:**
- Personalaufwand 2. Liga zum Gesamterlös: https://report.bundesliga.de/2425/de/_assets/downloads/key-bundesliga-2-dfl-er25.pdf
- Personalaufwand 1. Liga zu den Gesamtaufwendungen: https://report.bundesliga.de/2425/de/_assets/downloads/key-economic-figures-dfl-er25.pdf
- 3. Liga 26,2 Mio. € TV-Einnahmen, 1,31 Mio. € je Verein: https://www.dfb.de/ePaper/DFB-Saisonreport-3-Liga-202324/55/
- Punktabzug bei Insolvenz in 3. Liga und Regionalliga: https://www.dfb.de/fileadmin/_dfbdam/221172-OM_04_2020_Final.pdf und https://www.lto.de/recht/hintergruende/h/dfb-schiedsgericht-punktabzug-wegen-insolvenz-ordentliche-gerichtsbarkeit-rechtsmittel

## Quellen

- Umsatz 2024/25, Bundesliga und 2. Liga, Kosten, Gewinn: [bundesliga.com](https://www.bundesliga.com/de/bundesliga/news/bundesliga-saison-2024-25-dfl-milliarden-umsatz-rekord-35757), [sportschau.de](https://sportschau.de/fussball/bundesliga/dfl-verkuendet-umsatzrekord-der-bundesligisten,dfl-umsatzrekord-102.html), [DFL Economic Report 24/25](https://report.bundesliga.de/2425/en/economic-report/economic-figures/licensed-football/revenue-and-expenditure.html)
- Erlösstruktur 2022/23: [DFL-Kennzahlen Bundesliga (PDF)](https://report.bundesliga.de/2425/de/_assets/downloads/key-bundesliga-dfl-er25.pdf)
- Medienerlöse 1,121 Mrd. € ab 2025/26, Verteilerschlüssel, Säulen: [bundesliga.com: Medienerlöse ab 2025/26](https://www.bundesliga.com/en/bundesliga/news/dfl-increases-national-media-revenue-to-1121-billion-per-season-from-2025-26-29981), [bundesliga.com: Verteilerschlüssel](https://www.bundesliga.com/de/bundesliga/news/einstimmiger-beschluss-des-dfl-praesidiums-neuer-verteilerschluessel-sichert-leistungs-und-solidarprinzip-im-deutschen-profifussball-30668), [zdfheute](https://www.zdfheute.de/sport/bundesliga-dfl-tv-gelder-verteilung-keine-reform-100.html)
- Wirtschaft als Stärke von BMH und Anstoss, Finanzübersicht für kleine Vereine: `konzepte/_recherche-genre.md`, Abschnitte 4, 4b
