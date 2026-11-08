# K26 – Stadion und Infrastruktur

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K23 (Finanzen), K27 (Fans) · Wird gebraucht von: K07, K08, K10, K24, K25.

## 1. Ziel und Spielgefühl

- **Ein Stadionbaukasten statt „1.000 Plätze, Geld weg“:** Die FM-Community spottet, „das Stadion wächst alle sieben Saisons um vier Plätze“, und wünscht sich Ausbau mit Optionen und Schritten (Recherche 4, 4b).
- **Bauen dauert und birgt Risiko:** Planung, Genehmigung, Bauzeit, Verzögerung, Kostensteigerung.
- **Mehr als Plätze:** Trainingsgelände, Nachwuchsleistungszentrum, Reha-Zentrum, Rasen, Flutlicht, Logen.

## 2. Vorbilder und Abgrenzung

- **BMH, Anstoss:** Stadionausbau und Platzwart (PLAN §4, Recherche 2.1).
- **Heute im Spiel:** Tribünen (+3.000 Plätze, 4,5 Mio. €, 6 Wochen), Logen (+10, 2,5 Mio. €, 4 Wochen), Fanshop (3 Stufen). Bleibt die Grundlage.
- **Bewusst anders:** kein grafischer Editor, sondern Bauteile mit klaren Wirkungen.

## 3. Begriffe und Daten

### 3.1 Stadion

| Bauteil | Wirkung |
|---|---|
| Tribüne (Abschnitt) | Sitz- oder Stehplätze. Stehplätze: mehr Fans pro Fläche, günstiger, Stimmung (K27), weniger Einnahmen je Platz |
| Logen und Business-Seats | Einnahmen (gibt es), Sponsoren-Partnerpool (K24) |
| Dach | Zuschauer bei schlechtem Wetter (später), Lautstärke: Heimvorteil +0,5 % bei voller Auslastung |
| Rasenheizung | Spielausfall bei Frost verhindert (K30-Karte) |
| Flutlicht | Pflicht für Abendspiele, Stufe für TV-Anforderungen |
| Anzeigetafel, Catering | Spieltagseinnahmen +3 % bzw. +5 % |
| Fanshop | Sortiment (K25, gibt es als Stufen) |

### 3.2 Infrastruktur

| Anlage | Stufen | Wirkung |
|---|---|---|
| Trainingsgelände | 1–5 | Trainingsfaktor ×(0,9 + 0,05 × Stufe), Verletzungsrisiko im Training ×(1,1 − 0,04 × Stufe) (K07) |
| Nachwuchsleistungszentrum | 1–5 | ersetzt „Jugendarbeit“ (gibt es, K08) als Bauwerk mit laufenden Kosten |
| Reha-Zentrum | 0–3 | Ausfallzeit −3 % je Stufe, mit Physiotherapeut zusammen höchstens −25 % (K10, K16) |
| Platzwart | Mitarbeiter (Anstoss-Idee) | Rasenqualität, weniger Ausfälle bei Frost, kleine Heimstärke bei gutem Rasen |

### 3.3 Eigentum

- **Eigenes Stadion:** Namensrechte (K24), volle Spieltagserlöse, Instandhaltung selbst.
- **Gepachtet** (Stadt): Miete je Heimspiel, Namensrechte nur mit Zustimmung, Umbauten brauchen die Stadt (Genehmigung länger).
- Stammdaten je Verein in `daten/vereine.js` (neu: eigen oder gepachtet, Stehplatzanteil).

## 4. Abläufe

1. **Planung:** Bauteil wählen, Größe, Kosten und Bauzeit sehen (Spanne nach K35a).
2. **Genehmigung:** 2–8 Wochen. Mit 20 % Auflagen (Lärmschutz, Verkehr): Kosten +5 bis +15 %.
3. **Bau:** Dauer nach Bauteil. Bei Tribünen sinkt die Kapazität während des Baus um den Abschnitt.
4. **Verzögerung:** Mit 30 % 1–6 Wochen länger, mit 15 % Kosten +5 bis +20 %. Meldung, wenn es passiert.
5. **Fertig:** Info (gibt es), Wirkung ab sofort.
6. **Großprojekt neues Stadion:** über zwei bis drei Saisons, Finanzierung über Kredit, Namensrechte, Zuschuss der Stadt (Zufall), altes Stadion bis zum Umzug.

## 5. Regeln und Formeln

- **Kosten je Platz** (Spielwerte, prüfen): Stehplatz 1.500 €, Sitzplatz 3.000 €, Business-Seat 15.000 €, Loge 250.000 € (heute: 1.500 € je Platz, 250.000 € je Loge).
- **Instandhaltung:** 1 % der Bausumme pro Jahr in der Monatsabrechnung (K23).
- **Anlagen:** Kosten steigen je Stufe (×1,6), laufende Kosten je Stufe.
- **Abnehmender Nutzen:** Kapazität über der Nachfrage bringt nichts, außer in Spitzenspielen. Die Vorhersage zeigt die zu erwartende Auslastung als Band (K35a).

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Tribünen ausbauen | Einnahmen, Fans | Baukosten, Bauzeit mit weniger Plätzen |
| Stehplätze statt Sitzplätze | Stimmung, mehr Fans | weniger je Platz |
| Logen und Business | hohe Einnahmen je Platz | teuer, nur bei Nachfrage |
| Trainingsgelände | bessere Entwicklung, weniger Verletzungen | Geld |
| Nachwuchszentrum | bessere Jahrgänge | laufende Kosten |
| Reha-Zentrum | kürzere Ausfälle | Geld |
| neues Stadion | großer Sprung | Schulden, Jahre |

## 7. Verhalten der Computer-Vereine

Bauen nach Nachfrage und Budget: Tribünen, wenn die Auslastung zwei Saisons über 95 % liegt und Geld da ist. Anlagen nach Profil (Ausbildungsvereine: Nachwuchszentrum).

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Rasen nach Frost kaputt (PLAN §4) | Winter, keine Rasenheizung | Heimspiel in Gefahr: Ersatzrasen (Geld) oder Antrag auf Verlegung (K13) |
| Bauverzögerung | 4.4 | Info, Kosten |
| Stadt bietet Zuschuss | Großprojekt, Zufall | Geld gegen Auflagen |
| Anwohner klagen | Ausbau, Zufall | Genehmigung verzögert |

## 9. Wechselwirkungen

K04 (Heimvorteil), K07 (Trainingsgelände), K08 (Nachwuchszentrum), K10 (Reha), K13 (Spielverlegung), K16 (Platzwart, Physio), K23 (Kosten, Kredit), K24 (Namensrechte, Logen), K25 (Fanshop), K27 (Kapazität, Stehplätze, Stimmung).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Bau lohnt | ein Tribünenausbau bei dauerhaft ausverkauftem Stadion verdient sich in 6–12 Jahren zurück |
| Verzögerungen | etwa ein Drittel der Bauten dauert länger als geplant |
| Kein Leerbau | Computer-Vereine bauen nicht über die Nachfrage hinaus |

## 11. Stellschrauben

```js
stadion:{
  kostenJePlatz:{steh:1500,sitz:3000,business:15000},loge:250000,instandhaltung:0.01,
  genehmigung:{wochen:[2,8],auflagen:0.2,auflagenKosten:[0.05,0.15]},
  verzoegerung:{chance:0.3,wochen:[1,6],kostenChance:0.15,kosten:[0.05,0.20]},
  anlagen:{training:{stufen:5,faktor:[0.9,0.05],risiko:[1.1,-0.04]},nlz:{stufen:5},reha:{stufen:3,je:0.03},kostenFaktor:1.6},
  dach:{heim:0.005},catering:0.05,tafel:0.03,miete:0.1
}
```

`stadion.tribuene`, `stadion.logen`, `stadion.fanshop` gehen darin auf.

## 12. Offene Fragen

**Vorläufig entschieden:** Bauteile statt Editor, eigene oder gepachtete Stadien als Stammdaten, Nachwuchszentrum ersetzt die Stufe „Jugendarbeit“ als Bauwerk, Platzwart als Mitarbeiter. Kosten sind Spielwerte.

**Noch zu recherchieren:** echte Baukosten je Platz, Stehplatzanteile der Bundesliga-Stadien, Eigentumsverhältnisse der Stadien.

## Quellen

- Stadionbaukasten, Spott über kleine Ausbauten: `konzepte/_recherche-genre.md`, Abschnitte 4 und 4b
- Platzwart: PLAN §4 (GameStar 4/2000)
