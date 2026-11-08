# K27 – Fans und Zuschauer

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12.
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

## Quellen

- Auslastung und Ticketrekord 2024/25: [bundesliga.com: Ticketrekord](https://www.bundesliga.com/de/bundesliga/news/ticketrekord-profi-fussball-zuschauer-statistik-38415), [zdfheute: Zuschauerrekord](https://www.zdfheute.de/sport/bundesliga-zweite-liga-zuschauer-rekord-100.html), [sport1.de](https://www.sport1.de/news/fussball/bundesliga/2025/07/fast-21-millionen-dfl-vermeldet-ticketrekord)
- Wünsche zu Fans: `konzepte/_recherche-genre.md`, Abschnitt 4b
