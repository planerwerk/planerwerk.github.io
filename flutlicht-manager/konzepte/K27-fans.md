# K27 – Fans und Zuschauer

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12. **Teilweise umgesetzt mit U16 (20. November 2026, §5.4b) und K27b Dauerkarten (22. November 2026, §5.2), noch ohne Testlauf.**
Hängt ab von: K23 (Finanzen), K26 (Stadion) · Wird gebraucht von: K04 (Heimvorteil), K09 (Zuschauer-Vergehen), K14, K24, K25, K28.

## 1. Ziel und Spielgefühl

- **Fans sind mehr als eine Zuschauerzahl:** Sie haben eine Stimmung, Erwartungen und eine Meinung zu deinen Entscheidungen.
- **Ticketpreis als echte Abwägung** (gibt es): mehr Geld pro Fan gegen weniger Zuschauer und schlechtere Stimmung.
- **Dauerkarten, Choreos, Proteste, Pyrotechnik:** kleine Geschichten mit Folgen.
- **Identifikation zählt:** eigene Talente, Publikumslieblinge, Treue zu langjährigen Spielern.

## 2. Vorbilder und Abgrenzung

- **Heute im Spiel:** Fans je Verein, Nachfrage aus Preis, Form, Gegner, Liga und Zufall, Ticketpreis-Regler mit Vorhersage. Bleibt die Grundlage.
- **Community-Wünsche:** Fans nach Niederlagen oder zum Saisonende ansprechen, Platzsturm nach dem Aufstieg, Trikotwechsel mit Fan-Reaktion, volles Auswärtsstadion drückt die Stimmung (Recherche 4b).
- **Bewusst anders:** Fanstimmung als eigener Wert, der auf Vorstand, Sponsoren und Spieler wirkt.

## 3. Begriffe und Daten

| Wert | Bereich | Ort |
|---|---|---|
| Fans (Anhänger) | Anzahl (gibt es) | `t.fans` |
| **Fanstimmung** | 0–100, Start 60 | `t.fanst` |
| Ultra-Szene | 0–3 je Verein (Stammdaten): keine, klein, groß, sehr groß | `daten/vereine.js` (neu) |
| Tradition | 0–3 je Verein (Stammdaten) | `daten/vereine.js` (neu) |
| Dauerkarten | Anzahl je Saison | `t.dauerkarten` |
| Ticketpreis | € (gibt es) | `t.price` |

## 4. Abläufe

1. **Sommer:** Dauerkartenverkauf (5.2), Preis für Dauerkarten festlegen (Rabatt gegenüber Einzelkarten).
2. **Jedes Heimspiel:** Nachfrage, Zuschauer, Einnahmen (gibt es), dazu Stimmung im Stadion (Choreo, Pfiffe), eventuell Pyro (K09).
3. **Wöchentlich:** Fanstimmung bewegt sich 15 % zum Ziel (5.1).
4. **Anlässe:** Proteste, Choreos, Fan-Gespräch (5.4).
5. **Saisonende:** Fanzahl wächst oder schrumpft (gibt es: `saison.fans`), Saisonabschluss mit den Fans (optional).

## 5. Regeln und Formeln

### 5.1 Fanstimmung

```
Ziel = 60 + Erfolg + Preise + Identifikation + Entscheidungen + Umfeld     (0–100)
```

| Baustein | Spanne | Woraus |
|---|---|---|
| Erfolg | −20 bis +20 | Tabelle gegenüber Erwartung, Serien, Derbys (doppelt), Pokal |
| Preise | −15 bis +5 | Ticketpreis gegenüber Richtpreis (gibt es) |
| Identifikation | −5 bis +10 | Einsatzminuten eigener Talente (K08), Publikumslieblinge im Kader (K03), langjährige Spieler |
| Entscheidungen | −15 bis +5 | Verkauf eines Publikumslieblings, umstrittener Sponsor, Stadionname (K24), Trikot (K25) |
| Umfeld | −5 bis +5 | Presse (K29), Fan-Gespräche (5.4) |

- Ultras gewichten Preise und Entscheidungen doppelt, Tradition verstärkt den Baustein Entscheidungen.

### 5.2 Dauerkarten

- **Verkauf** im Sommer: Anteil der Kapazität = 0,35 + 0,25 × Fanstimmung/100, verschoben durch den Rabatt (Spielwert, prüfen) und begrenzt durch die Plätze ohne Gästeblock.
- Dauerkarten-Inhaber zählen in jedem Heimspiel als Zuschauer (Nichterscheinen spielt keine Rolle für die Einnahmen).
- **Folge:** Einnahmen sicherer, weniger Schwankung durch Formkrisen.

**Umsetzung K27b (22.11.2026, popolupo, ohne Testlauf, `js/fans.js`):**
- **Nur dein Verein.** Die Einnahmen der Computer-Vereine bleiben beim Erwartungswert (K23b), dort gleichen sich Schwankungen ohnehin aus.
- **Verkauf** beim ersten Ligaheimspiel der Saison (auch nach einem Jobwechsel beim neuen Verein). Anteil der Plätze = 0,35 + 0,25 × Fanstimmung/100 + 0,5 × (Rabatt − 20 %), höchstens 90 % (10 % Gästeblock).
- **Rabatt** 10, 20 oder 30 % im Finanzen-Tab unter dem Eintrittspreis, nur vor dem Verkauf, Bereich `preise` (in der Automatik 20 %).
- **Je Ligaheimspiel:** Alle Inhaber zählen als Zuschauer und zahlen den Ticketpreis vom Tag des Verkaufs × (1 − Rabatt), höchstens den heutigen Preis, wenn du ihn später senkst (Buchung „Dauerkarten“, laufend in der Prognose). Ein späteres Hochsetzen des Preises ändert an den Dauerkarten nichts (Prüfung CZ2). Die übrige Nachfrage kauft Einzelkarten zum vollen Preis. Pokal und Europapokal laufen wie bisher nur mit Einzelkarten.
- **Fanstimmung:** Baustein Preise +2 je 10 Prozentpunkte Rabatt über dem Standard, −2 darunter.
- **Rechnung:** Bei 20 % Rabatt und einem vollen Stadion bringen Dauerkarten weniger als Einzelkarten. In einer Krise (Nachfrage unter der Zahl der Dauerkarten) bringen sie mehr. Das ist der Hebel aus §6.
- **Noch nicht:** Gästeblock als eigene Plätze, Dauerkarten der Computer-Vereine, Warteliste.

### 5.3 Nachfrage

- Formel wie heute (Preis, Form, Gegner, Liga, Pokal, Zufall), dazu Faktor Fanstimmung: 0,85 bei 0 bis 1,10 bei 100.
- **Gästeblock** 10 % der Plätze, gefüllt nach Fans des Gegners und Entfernung.
- **Heimvorteil:** fast ausverkauft +1 % (K04), dazu Fanstimmung über 80 +0,5 %.

### 5.4 Anlässe

| Anlass | Wann | Folge |
|---|---|---|
| Choreografie | Derby, Jubiläum, Spitzenspiel, Ultras ≥ 1 | Stimmung im Team +3 (K14), Presse, Heimvorteil +0,5 % |
| Pyrotechnik | Ultras, Derby, Wut | Geldstrafe (K09), Spielunterbrechung möglich |
| Protest | Fanstimmung unter 30 oder Entscheidung, die Ultras ablehnen | Pfiffe (Selbstvertrauen der Spieler −0,2 im Heimspiel), Spruchbänder, Presse |
| Fan-Gespräch | jederzeit, höchstens einmal im Monat | Fanstimmung +3 bis +8 bei Glaubwürdigkeit (K15), −5 bei leeren Versprechen |
| Platzsturm | Aufstieg, Klassenerhalt am letzten Spieltag | Feier, kleine Geldstrafe (K09) |

### 5.4b Umsetzung U16 (20.11.2026)

- **Fanstimmung `t.fanst`** für alle Vereine der drei Ligen, Start 60, montags 15 % Richtung Ziel. Ohne Zufall.
- **Bausteine des Ziels:**
  - **Erfolg** (−20 bis +20): ab dem 5. Ligaspiel 2 × (erwarteter Platz − Platz), dazu 10 × (Punkte je Spiel der letzten fünf − 1,3), dazu Anlässe mit Gedächtnis: Derbysieg +6, Derbyniederlage −6 (doppelt wie in §5.1), Pokalrunde überstanden +2, Pokal-Aus gegen einen tieferklassigen Verein −4. Anlässe verblassen um 20 % je Woche.
  - **Preise** (−15 bis +5): 30 × (1 − Ticketpreis / Richtpreis). 10 % über dem Richtpreis kosten 3 Punkte.
  - **Identifikation** (vorerst 0 bis +10): 2 je Publikumsliebling im Kader. Den negativen Teil (−5 für eine Söldnertruppe aus lauter Neuzugängen) gibt es noch nicht, damit die Stimmung am Start bei 60 bleibt: Weil die Statistik erst mit dem Spielstand beginnt, hätte am Start noch kein Verein einen Liebling. Publikumsliebling: mindestens 60 Pflichtspiele für den Verein (gezählt ab Spielbeginn, K34) oder ein Eigengewächs (aus der eigenen Jugend) mit mindestens 20.
  - **Entscheidungen** (−15 bis +5): Verkauf eines Publikumslieblings −8, verblasst um 10 % je Woche.
  - **Umfeld** (−5 bis +5): Saisoneröffnung +3 (K12b), Fan-Gespräch, verblasst um 10 % je Woche. Presse (K29) kommt später.
- **Wirkung auf die Zuschauer** (§5.3): Faktor 0,85 bei 0, 1,0 bei 60, 1,10 bei 100, linear dazwischen. Am Start also wie bisher. Gilt in deinen Heimspielen, Testspielen und in der Vorhersage am Ticketpreis.
- **Wirkung auf deinen Vorstand** (K28): Baustein Fans im Ziel des Vertrauens, nur außerhalb von 45 bis 75: darunter (Stimmung − 45) / 3 bis höchstens −10, darüber (Stimmung − 75) / 5 bis höchstens +5.
- **Protest** (§5.4): Unter 30 pfeifen die Fans in deinen Ligaheimspielen. Selbstvertrauen deiner eingesetzten Spieler −0,2, mit Meldung.
- **Fan-Gespräch** (§5.4): höchstens einmal im Monat, Stimmung im Baustein Umfeld +3 bis +8 nach deiner Glaubwürdigkeit (K15). Unter 25 Glaubwürdigkeit nennen die Fans es leere Versprechen: −5. Lizenz-Bereich `fangespraech` ab der C-Lizenz, ohne Automatik.
- **Anzeige:** im Stadion die Fanstimmung als Regler mit den Bausteinen und das Fan-Gespräch.
- **Computer-Vereine:** gleiche Stimmung, wirkt aber noch nirgends (ihre Einnahmen kommen aus einer Formel ohne Zuschauer, ihr Vorstand aus U11d2 bleibt unverändert). Seit Prüfung EN5 (23.11.) berichtigt: Seit K23b/K23c rechnen ihre Heimeinnahmen mit `zuschauerErwartung` und damit mit dem Zuschauerfaktor der Fanstimmung. Seit U12i hängt die Präsidentenwahl (`wahlChance`) bei allen Vereinen von der Fanstimmung ab. K27e verstärkt beides leicht bei hoher Fankultur nach dem Verkauf eines Lieblings, ohne Zufall.
- **Noch nicht:** Dauerkarten und Gästeblock (warten auf K23), Ultras und Tradition als Stammdaten (dafür fehlen Quellen je Verein), Choreo, Pyrotechnik und Platzsturm (K09, K30), Heimvorteil durch Fans (würde die Kalibrierung der Engine ändern).

### 5.4c K27e Fankultur statt Tradition (23.11.2026, popolupo, vorläufig)

Tradition als Stammdatum (0–3) fehlt weiter. Seit K25f gibt es dafür die Fankultur (0–100, K25 §5.6). Sie kommt aus Stadion, Mitgliedern und Zugkraft und wurde nach der Rückmeldung des Nutzers vom 23.11. gebaut. Ihre Wirkung ist stufenlos: bis 50 keine, ab 80 die volle (`fankulturWirkung`, 0 bis 1). Hier ersetzt sie die Tradition aus §5.1:

- **Baustein Entscheidungen:** „Tradition verstärkt den Baustein Entscheidungen“ wird zu: Entscheidungen × (1 + Wirkung × 0,5).
  - Bei voller Fankultur wiegt der Verkauf eines Publikumslieblings −12 statt −8. Dasselbe gilt für einen umstrittenen Sponsor (K24).
  - Gerechnet wird beim Ziel, nicht beim Anlass. Darum folgt der Baustein der heutigen Fankultur, und das Gedächtnis `t.fanD` bleibt unverändert.
  - Die Grenzen −15 bis +5 gelten weiter. Das gilt für alle Vereine, ohne Zufall.
  - Seit Prüfung EN4 verblassen alle Anlässe (Erfolg, Entscheidungen, Umfeld) bis ±0,5 ganz auf 0 (`anlassMin`). Vorher blieb das Runden auf eine Stelle bei −0,4 oder 0,5 hängen, und der Faktor stand für immer in der Anzeige.
  - Die Anzeige im Stadion nennt den Faktor.
- **Vorstand beim Abwerben** (K20 §5.3: „bei Traditionsvereinen −6“): Fliegt ein Abwerbeversuch auf, sinkt das Vertrauen um 3 × (1 + Wirkung). Das sind −3 bis −6, bei Freiburg etwa −5,5.
- **Noch nicht:**
  - Ultras als Stammdatum.
  - Fankultur bei den Dauerkarten: Mitglieder je Platz stecken schon in beiden, das zählte doppelt.
  - Stadionname (K24, Claude).

### 5.5 Größenordnungen

- **Echte Werte 2024/25:** Auslastung in der 1. Liga 95,9 %, in der 2. Liga nach der Hinrunde 84,3 % bei etwa 29.800 Zuschauern im Schnitt. Die 36 Vereine der 1. und 2. Liga verkauften zusammen knapp 21 Mio. Tickets (Quellen).

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Ticketpreis (gibt es) | Einnahmen | Zuschauer, Fanstimmung |
| Dauerkartenrabatt | sichere Einnahmen, Fanstimmung | weniger je Spiel |
| eigene Talente spielen lassen | Identifikation | sportliches Risiko |
| Fan-Gespräch | Fanstimmung | Glaubwürdigkeit, Abnutzung |
| Entscheidungen mit Blick auf Fans | Ruhe | weniger Geld (Sponsor, Stadionname) |
| Fanarbeit (K25) | weniger Pyro und Proteste | Kosten |

## 7. Verhalten der Computer-Vereine

Gleiches Modell für Nachfrage, Dauerkarten und Fanstimmung. Ihre Fanstimmung wirkt auf ihren Vorstand (K28, vereinfacht) und erzeugt Presse (K29).

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Fan-Choreo zum Jubiläum (PLAN §4) | Vereinsjubiläum | Stimmung, Presse |
| Protest gegen Ticketpreise | Preis weit über Richtpreis, Ultras | Fanstimmung, Presse, Entscheidung: senken oder halten |
| Pfiffe gegen den eigenen Spieler | Spieler mit Wechselwunsch Stufe 4 oder Verkauf eines Lieblings | Stimmung des Spielers (K14) |
| Platzsturm | Aufstieg | Feier |
| Fans wollen reden (Entscheidung) | Fanstimmung unter 25 | Gespräch (5.4) oder ablehnen |

**Gebaut als K27c (22.11.2026, popolupo, ohne Testlauf), Karten nach K30:** „Protest gegen Ticketpreise“ (Preis über 1,3 × Richtpreis bei Fanstimmung unter 50; senken setzt den Richtpreis, neue Kartenwirkung `preisRichtwert`, Fans +2; halten Fans −3) und „Pfiffe gegen den eigenen Spieler“ (ab Wechselwunsch Stufe 3; in Schutz nehmen Stimmung +3, Fans −1; schweigen Stimmung −3). „Fans wollen reden“ gibt es schon als Fan-Gespräch im Büro (U16), Platzsturm fehlt noch (Aufstiegsfeier). Das Jubiläum gibt es seit K27d (23.11.2026, popolupo, ohne Testlauf): Gründungsjahre der 54 Profivereine in `daten/vereine.js` (`gegr`, Quelle RSSSF, zwölf nach Vereinsangabe ungeprüft). Im Kalenderjahr eines Vielfachen von 25 Jahren kommt die Anlasskarte „Rundes Jubiläum“: Choreo bezahlen (Fans +3), Retro-Trikot (Fanartikel +25 % für vier Wochen, K25 §8) oder im kleinen Rahmen feiern.

## 9. Wechselwirkungen

K03 (Publikumsliebling), K04 (Heimvorteil), K08 (Identifikation), K09 (Pyro, Platzsturm), K14 (Umfeld), K15 (Gespräche), K23 (Spieltag), K24 (Sponsor, Stadionname), K25 (Fanartikel, Kampagnen), K26 (Kapazität), K28 (Vertrauen), K29 (Presse).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Auslastung 1. Liga | 92–98 % |
| Auslastung 2. Liga | 78–88 % |
| Fanstimmung | 70 % der Vereine zwischen 40 und 80 |
| Preisabwägung | der einnahmenstärkste Ticketpreis liegt über dem stimmungsneutralen, aber nicht dauerhaft ohne Folgen |
| Pyro | Zahl der Verfahren pro Saison in realistischer Größe (prüfen) |

## 11. Stellschrauben

```js
fans:{
  stimmung:{start:60,traegheit:0.15,erfolg:[-20,20],preise:[-15,5],ident:[-5,10],entscheid:[-15,5],umfeld:[-5,5],ultras:2},
  dauerkarten:{basis:0.35,jeStimmung:0.25,rabatt:0.2},
  nachfrage:{stimmung:[0.85,1.10]},gaesteblock:0.10,
  heim:{stimmungAb:80,plus:0.005},
  anlass:{choreo:{team:3,heim:0.005},protestUnter:30,pfiffeSv:-0.2,gespraech:[3,8],gespraechLeer:-5}
}
```

## 12. Offene Fragen

**Vorläufig entschieden:** Fanstimmung als eigener Wert, Ultra-Szene und Tradition als Stammdaten (0–3), Dauerkarten mit Rabatt, Gästeblock 10 %.

**Noch zu recherchieren:** Dauerkartenanteile, Zuschauerschnitt der 1. und 3. Liga als Vollsaison, Zahl der Pyro-Verfahren.

**Vorläufig entschieden mit U16 (20.11.2026, von mir, weil „entscheide du“):**

1. Fanstimmung für alle Vereine, wirksam vorerst nur bei dir (§5.4b).
2. Gewichte der Bausteine wie in §5.4b, alle geschätzt.
3. Publikumsliebling über Pflichtspiele für den Verein (ab Spielbeginn) oder Eigengewächs. Ein eigenes Merkmal „Publikumsliebling“ (K03) gibt es nicht.
4. Eigengewächse: neues Kennzeichen am Spieler für Aufrücker aus der Jugend, bei dir und bei den Computer-Vereinen. Spieler vom Spielstart haben keins.
5. Zuschauerfaktor neutral bei 60, damit sich am Start nichts ändert.
6. Vorstand mit toter Zone von 45 bis 75, damit kleine Schwankungen das Vertrauen nicht bewegen.
7. Fan-Gespräch ab der C-Lizenz, einmal im Monat.
8. Dauerkarten, Gästeblock, Ultras, Tradition, Choreo, Pyro, Platzsturm und Heimvorteil verschoben (§5.4b).
9. **Dauerkarten gebaut mit K27b** (22.11., popolupo, ohne Testlauf, §5.2): nur dein Verein, Verkauf beim ersten Ligaheimspiel, Rabatt 10, 20 oder 30 % im Bereich `preise`, Zahlung je Ligaheimspiel statt auf einmal (so stimmt die Prognose aus K23a), Fanstimmung ±2 je 10 Prozentpunkte Rabatt.

## Quellen

- Auslastung und Ticketrekord 2024/25: [bundesliga.com: Ticketrekord](https://www.bundesliga.com/de/bundesliga/news/ticketrekord-profi-fussball-zuschauer-statistik-38415), [zdfheute: Zuschauerrekord](https://www.zdfheute.de/sport/bundesliga-zweite-liga-zuschauer-rekord-100.html), [sport1.de](https://www.sport1.de/news/fussball/bundesliga/2025/07/fast-21-millionen-dfl-vermeldet-ticketrekord)
- Wünsche zu Fans: `konzepte/_recherche-genre.md`, Abschnitt 4b
