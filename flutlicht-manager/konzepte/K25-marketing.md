# K25 – Marketing und Merchandising

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K27 (Fans), K24 (Ausrüster), K23 (Finanzen) · Wird gebraucht von: K23, K24, K27.

## 1. Ziel und Spielgefühl

- **Fanwerbung lohnt sich langfristig** (Anstoss 3, PLAN §4): Wer heute investiert, hat in zwei Jahren mehr Fans, Mitglieder und Trikotverkäufe.
- **Das Trikot ist ein Ereignis:** jedes Jahr ein neues Design mit Reaktion der Fans (Community-Wunsch, Recherche 4b).
- **Kampagnen mit abnehmendem Ertrag:** Die erste Aktion wirkt stark, die fünfte kaum noch.

## 2. Vorbilder und Abgrenzung

- **Anstoss 3:** Fanartikel-Sortiment, Fanwerbung (PLAN §4).
- **Heute im Spiel:** Fanshop in drei Stufen, Fanartikel je Zuschauer (0 / 1,5 / 3 / 5 €). Bleibt die Grundlage.
- **Bewusst anders:** kein eigenes Wirtschaftsspiel für einzelne Artikel. Sortiment in drei Stufen, Trikotwahl, Kampagnen.

## 3. Begriffe und Daten

| Begriff | Bedeutung |
|---|---|
| Kampagne | Aktion mit Kosten, Dauer und Wirkung |
| Trikot | Design je Saison: klassisch, modern, mutig |
| Sortiment | einfach, breit, groß (statt Fanshop-Stufen allein) |
| Online-Shop | zweite Verkaufsstelle, Ertrag unabhängig von Zuschauern |
| Mitglieder | Zahl, Beitrag (K23, Sonstiges) |
| Werbewert | wie sehr der Verein in den Köpfen ist, 0–100, steigt mit Kampagnen und Erfolg, sinkt langsam |

## 4. Abläufe

1. **Saisonvorbereitung** (K12b): Trikotvorstellung, Wahl des Designs, Sortiment.
2. **Kampagnen** jederzeit starten, Wirkung über Wochen.
3. **Monatlich:** Merchandising-Erlöse (5.2) in der Monatsabrechnung (K23).

## 5. Regeln und Formeln

### 5.1 Kampagnen

| Kampagne | Kosten (1. Liga) | Dauer | Wirkung |
|---|---|---|---|
| Dauerkarten-Aktion | 100.000 € | Sommer | Dauerkarten +5 % (K27) |
| Trikot-Kampagne | 150.000 € | 4 Wochen | Trikotverkäufe +15 % in der Zeit |
| Fanwerbung in der Region | 200.000 € | 8 Wochen | Fans +2 % zum Saisonende, Werbewert +5 |
| Mitgliederaktion | 80.000 € | 6 Wochen | Mitglieder +3 % |
| Jugend-Camps | 60.000 € | Sommer | Fans +1 %, Identifikation (K27) +1 |
| Fanarbeit | 50.000 € je Halbserie | laufend | Pyro und Proteste −30 % (K09, K27) |

- Kosten für die 2. Liga ×0,4, 3. Liga ×0,2.
- **Abnehmender Ertrag:** dieselbe Kampagne in derselben Saison zum zweiten Mal halb, zum dritten Mal ein Viertel.

### 5.2 Merchandising

```
Erlös je Monat = Fans × Kaufkraft × Sortiment × Trikotfaktor × Erfolg × Stars
```

- **Sortiment:** einfach 1, breit 1,5, groß 2 (mit Kosten wie heute der Fanshop-Ausbau, K26).
- **Trikotfaktor:** Fanreaktion auf das Design (5.3), 0,8 bis 1,25.
- **Stars:** Teenie-Star in Form +10 % (K03), Publikumslieblinge +5 % je Spieler (höchstens +15 %).
- **Ausrüster** (K24) bekommt einen Anteil, dafür zahlt er das Ausrüster-Fixum.
- **Ziel:** Merchandising 4–7 % der Einnahmen in der 1. Liga (K23).

### 5.3 Trikot

- Drei Designs zur Wahl. Fans reagieren nach Tradition (K27): Traditionsvereine mögen klassisch (+), mutige Designs teilen die Fans (Verkäufe mal hoch, mal Spott).
- Reaktion gewürfelt mit Erwartung je Tradition, Ergebnis sofort als Info („Das neue Trikot spaltet die Fans“).

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Kampagnen | Fans, Dauerkarten, Mitglieder, Ruhe | Geld, abnehmender Ertrag |
| Sortiment ausbauen | Merchandising | Baukosten (K26) |
| Trikotwahl | Verkäufe, Fanstimmung | Risiko bei mutigen Designs |
| Fanarbeit | weniger Strafen | Geld |

## 7. Verhalten der Computer-Vereine

Gleiches Modell, Kampagnen nach Budget und Profil. Ehrgeizige Vereine investieren mehr in Fanwerbung.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Trikot spaltet die Fans | mutiges Design | Presse, Verkäufe schwanken |
| Retro-Trikot zum Jubiläum | Vereinsjubiläum | Verkäufe +30 % für einen Monat |
| Trikot ausverkauft | Teenie-Star in Form, Erfolg | Info, Nachproduktion kostet |

## 9. Wechselwirkungen

K03 (Teenie-Star, Publikumsliebling), K09 (Fanarbeit gegen Pyro), K12b (Trikotvorstellung), K23 (Erlöse), K24 (Ausrüster), K26 (Fanshop), K27 (Fans, Tradition, Dauerkarten).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Merchandising-Anteil | 4–7 % in der 1. Liga |
| Fanwerbung lohnt | über drei Saisons bringt regelmäßige Fanwerbung mehr ein, als sie kostet |
| Kein Dauerfeuer | eine Kampagne fünfmal pro Saison lohnt sich nicht |

## 11. Stellschrauben

```js
marketing:{
  kampagnen:{dauerkarten:{kosten:1e5,wirkung:0.05},trikot:{kosten:1.5e5,wochen:4,wirkung:0.15},fanwerbung:{kosten:2e5,wochen:8,fans:0.02,werbewert:5},
    mitglieder:{kosten:8e4,wochen:6,wirkung:0.03},camps:{kosten:6e4,fans:0.01},fanarbeit:{kosten:5e4,wirkung:-0.3}},
  ligaFaktor:{1:1,2:0.4,3:0.2},abnutzung:[1,0.5,0.25],
  merch:{sortiment:{einfach:1,breit:1.5,gross:2},trikot:[0.8,1.25],teenie:0.1,liebling:0.05,lieblingMax:0.15}
}
```

`finanzen.fanartikel` geht darin auf.

## 12. Offene Fragen

**Vorläufig entschieden:** sechs Kampagnen, drei Trikotdesigns je Saison, Sortiment in drei Stufen, Online-Shop ohne eigene Steuerung. Alle Beträge sind Spielwerte (Kalibrierung mit K23).

## Quellen

- Fanwerbung, Fanartikel-Sortiment: PLAN §4 (GameStar 4/2000)
- Trikotwechsel mit Fan-Reaktion: `konzepte/_recherche-genre.md`, Abschnitt 4b
