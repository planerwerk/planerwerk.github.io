# K25 – Marketing und Merchandising

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12. **Teilschritt K25a umgesetzt (21. November 2026, popolupo, §5.4), noch ohne Testlauf.**
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

### 5.4 Umsetzung K25a (21.11.2026, popolupo): Trikot, Kampagnen, Werbewert, Faktoren im Fanartikel-Erlös

- **Geldneutral bis K23c:** Der Fanartikel-Erlös bleibt „Zuschauer × Betrag je Fanshop-Stufe“ im Heimspiel. Neu sind Faktoren darauf: Trikot (0,8 bis 1,25), Publikumslieblinge (+5 % je Liebling aus K27, höchstens +15 %), laufende Trikot-Kampagne (+15 %). Die Formel aus §5.2 mit Fans, Kaufkraft und Online-Shop kommt mit K23c, weil sie die Größe der Einnahmen verschiebt.
- **Trikot je Saison** (§5.3): klassisch, modern oder mutig, zu wählen vom 1. Juli bis zum ersten Pflichtspiel (Punkt „Trikotvorstellung“ in der Liste aus K12b). Danach steht es fest. Reaktion beim Vorstellen, eigener Strom `trikot`:
  - klassisch: Faktor 0,95 bis 1,05, Fanstimmung +1
  - modern: Faktor 0,9 bis 1,15
  - mutig: halb und halb Kult (Faktor 1,25, Fanstimmung +3) oder Spott (Faktor 0,8, Fanstimmung −3), mit Meldung
  - Ohne Wahl nimmt der Verein vor dem ersten Pflichtspiel das klassische.
  Tradition (K27) fehlt als Stammdatum, darum ist die Erwartung für alle gleich. Seit K25e (23.11.2026, popolupo, ohne Testlauf) gilt ein Verein mit Gründungsjahr bis 1910 (`gegr`, K27d) als Traditionsverein: Das klassische Trikot bringt dort Faktor +0,05 und Fans +1 mehr, das mutige wird nur mit 35 % statt 50 % Kult (geschätzt, vorläufig). Seit Prüfung EJ4 gelten Hoffenheim und Leverkusen trotz frühem Gründungsjahr nicht als Traditionsvereine (`tradition:false` in `VEREINE`, vorläufig). **Seit K25f (§5.6) zählt statt des Gründungsjahrs die Fankultur aus Stadion, Mitgliedern und Zugkraft, stufenlos.**
- **Kampagnen** (§5.1), Kosten in der 1. Liga, 2. Liga × 0,4, 3. Liga × 0,2:

  | Kampagne | Kosten | Dauer | Wirkung |
  |---|---|---|---|
  | Trikot-Kampagne | 150.000 € | 4 Wochen | Fanartikel +15 % |
  | Fanwerbung in der Region | 200.000 € | 8 Wochen | Fans +2 % zum Saisonende, Werbewert +5 |
  | Jugend-Camps | 60.000 € | nur im Sommer (bis zum ersten Pflichtspiel) | Fans +1 % zum Saisonende, Fanstimmung +1 |
  | Fanarbeit | 50.000 € | eine Halbserie (120 Tage) | Pfiffe bei Protest wirken nur zu 70 % (K27), seit K09h kommen die Karten „Pyrotechnik im Derby“ und „Wurfgeschosse“ um 30 % seltener (K09 Nr. 14) |

  Dieselbe Kampagne in derselben Saison wirkt beim zweiten Mal halb, beim dritten Mal ein Viertel. Gleichzeitig läuft jede Art höchstens einmal.
- **Noch nicht:** Dauerkarten-Aktion (Dauerkarten kommen mit K27 und K23), Mitgliederaktion (Mitglieder und Beiträge mit K23c), Online-Shop, Sortiment in drei Stufen statt Fanshop-Ausbau (K26), Kampagnen der Computer-Vereine. (Stand 25.11.2026: Dauerkarten-Aktion seit K25c, Mitgliederaktion seit K25d, Online-Shop seit K25g: einmalig 500.000 € × Ligafaktor (3. Liga 100.000 €), danach montags Fans × 0,12 € (bis Prüfung FS2 0,05) × Fanartikel-Faktor als „Fanartikel online“, auch in der Sommerpause und im Finanzplan, unabhängig von den Zuschauern, nur dein Verein, `REGELN.marketing.online`, vorläufig. Offen bleiben das Sortiment in drei Stufen und Kampagnen der Computer-Vereine.)
- **Seit K25c (22.11.2026, popolupo, ohne Testlauf):** Dauerkarten-Aktion als Kampagne in der Vorbereitung (100.000 € mal Ligafaktor), solange die Dauerkarten (K27b) noch nicht verkauft sind. Sie hebt den Anteil der verkauften Dauerkarten um 5 Prozentpunkte. Bereich `marketing` wie die übrigen Kampagnen.
- **Werbewert** 0–100: Start = Ansehen ÷ 2. Kampagnen heben ihn (Fanwerbung +5), Monatsende 2 % zurück Richtung Start, Meisterschaft, Pokalsieg oder Aufstieg +5. Vorerst nur Anzeige, die Wirkung auf Sponsoren gehört zu K24 (Claude).
- **Lizenz:** neuer Bereich `marketing` (B-Lizenz, mit Automatik: Der Verein nimmt das klassische Trikot und startet keine Kampagnen).

### 5.5 K25d Mitglieder und Mitgliederaktion (22.11.2026, popolupo, vorläufig)

**Recherche (Websuche 22.11.2026):** Mitgliederzahlen aller Vereine der drei Ligen 2025/26, Stand Winterpause 2025/26, aus einer Übersicht von sechzger.de (Januar 2026, dort aus Wikipedia und Vereinsangaben, teils ältere Stände). Fortuna Köln 3.000 aus dem DFB-Datencenter. Für SV Meppen, Würzburger Kickers und SG Sonnenhof Großaspach habe ich keine Zahl gefunden, dort geschätzt (1.700, 2.000, 800). Zweite Mannschaften haben keine eigenen Mitglieder (0).

| Liga 2026/27 im Spiel | Schnitt | Spanne |
|---|---|---|
| 1. Liga | etwa 107.000 | RB Leipzig 1.130 bis Bayern 432.000 |
| 2. Liga | etwa 24.000 | Greuther Fürth 4.948 bis Hertha 60.620 |
| 3. Liga | etwa 7.500 | Zweite Mannschaften 0 bis Fortuna Düsseldorf 36.000 |

**Regeln (vorläufig):**
- **Stammdatum** `mitglieder` je Verein in `daten/vereine.js`. Vereine ohne Angabe (Regionalliga): 30 % ihrer Fans.
- **Beiträge** zählen zu den sonstigen Einnahmen (K23 §3.1): je Ligaspiel Mitglieder × 60 € (Jahresbeitrag Erwachsene bei Bayern und Dortmund etwa 60 €, Ermäßigungen nicht gerechnet) ÷ Zahl der Ligaspiele, dazu ein kleinerer Grundbetrag je Liga (Vermarktung, Stadionvermietung). Der Grundbetrag ist so gewählt, dass der Schnitt je Liga gleich bleibt wie in K23c (300.000, 80.000, 30.000 € je Ligaspiel): neu 110.000, 37.000 und 18.000 €.
- **Folge:** Mitgliederstarke Vereine bekommen mehr (Bayern etwa 26 Mio. € Beiträge je Saison), mitgliederschwache weniger (Leipzig, Elversberg, Paderborn). Für alle Vereine gleich, auch für dich.
- **Entwicklung:** Zum Saisonwechsel wachsen oder schrumpfen die Mitglieder mit demselben Faktor wie die Fans (Saisonregeln, Ansehen), aber ohne deren Grenzen (Mindest- und Höchstzahl je Platz). Alte Spielstände bekommen die Mitglieder einmal aus den Stammdaten im Verhältnis ihrer heutigen Fans (Prüfung DL).
- **Mitgliederaktion** (Kampagne, Bereich `marketing`): 50.000 € mal Ligafaktor, vier Wochen, Mitglieder +2 %, einmal je Saison (Prüfung DL3, sonst ließ sie sich alle vier Wochen wiederholen).
- **Anzeige:** Mitglieder und Beiträge je Saison im Marketing-Kasten.
- **Seit K25e (22.11., popolupo, ohne Testlauf): Vorkaufsrecht der Mitglieder.** Der Anteil der Dauerkarten (K27b) steigt um 10 % × Mitglieder je Platz, höchstens um 10 Prozentpunkte (ab einem Mitglied je Platz). Bayern bekommt also die vollen 10 Punkte, ein kleiner Verein mit 5.000 Mitgliedern und 15.000 Plätzen gut 3. Die Mitgliederaktion wirkt so auch auf die Dauerkarten. Die Anzeige vor dem Verkauf nennt den Anteil.
- **Noch nicht:** eigene Rabatte für Mitglieder (der Rabatt gilt für alle Dauerkarten). Die Mitgliederversammlung mit der Wahl des Präsidenten gibt es seit U12i (K28 §5.12). Seit U12m zählen die Mitglieder dort: Je mehr Mitglieder je Platz, desto stärker wirkt die Fanstimmung auf die Wahl.

### 5.6 K25f Fankultur statt Gründungsjahr (23.11.2026, popolupo, vorläufig)

**Anlass:** Rückmeldung des Nutzers vom 23.11. zu K25e und Prüfung EJ4:
- Leverkusen ist kein Traditionsverein, aber seit Jahren fester Teil der Bundesliga, mit einem gut aufgebauten Verein dahinter.
- Wolfsburg hat 25 Jahre in der ersten Liga gespielt und füllt sein Stadion mit 30.000 Plätzen selten. Hoffenheim ist vermutlich ähnlich.
- Leipzig sieht etwas besser aus, hängt aber am Geld von Red Bull.
- Union Berlin und St. Pauli haben eine eigene Kultur, Kaiserslautern eine sehr starke.
- Nur mit Zahlen ist das schwer zu fassen. Die Idee mit Stadion und Dauerkarten ist gut, etwa Jahre in der Bundesliga gegen verkaufte Karten.

**Regel (vorläufig):** Jeder Verein hat eine Fankultur von 0 bis 100. Sie ersetzt beim Trikot das Gründungsjahr aus K25e. Sie hat drei Teile, alle aus den heutigen Werten des Vereins im Spiel. Zu Beginn sind das die Stammdaten aus `daten/vereine.js`.

| Teil | Wert | 0 bei | voll bei | Gewicht |
|---|---|---|---|---|
| Stadion | Fans ÷ Plätze, höchstens 1 | 0,6 | 1,0 | 30 % |
| Mitglieder | Mitglieder je Platz | 0 | 2 | 30 % |
| Zugkraft | (Fans ÷ Ligaschnitt der Fans) ÷ (Ansehen ÷ Ligaschnitt des Ansehens) | 0,5 | 1,5 | 40 % |

- **Zugkraft** setzt „Jahre in der Bundesliga gegen Verkaufszahlen“ um. Die Jahre in der Bundesliga stehen nicht in den Stammdaten, das Ansehen ist der nächste Wert für den sportlichen Stand. Wer mehr Zuschauer hat, als sein Ansehen in dieser Liga erwarten lässt, hat eine starke Kultur, etwa Kaiserslautern in der 2. Liga. Wer weniger hat, hat eine schwache, etwa Wolfsburg.
- **Ausverkauft** (ab 97 % Auslastung): Die Zugkraft zählt mindestens halb. Ein volles Stadion verdeckt die echte Nachfrage, etwa bei Union und St. Pauli. Seit Prüfung EM2 steigt diese Untergrenze stufenlos von 93 % (0) bis 97 % (halb). Vorher sprang Freiburg mit 170 Fans mehr von 69 auf 78.
- **Ligaschnitt:** alle Vereine derselben Liga ohne zweite Mannschaften.
- **Dauerkarten:** Echte Dauerkartenzahlen stehen nicht in den Stammdaten. Im Spiel zählen Dauerkarten als Zuschauer, und ihr Anteil hängt von den Mitgliedern je Platz ab (Vorkaufsrecht, §5.5). So stecken sie in den Teilen Stadion und Mitglieder.
- **Im Spiel veränderlich:** Weil die Teile aus den heutigen Werten kommen, ändert sich die Fankultur mit. Ein größeres Stadion, das nicht voll wird, senkt sie. Mehr Fans und Mitglieder heben sie, etwa durch Kampagnen oder Erfolg. Steigt das Ansehen ohne mehr Fans, sinkt die Zugkraft.

**Wirkung beim Trikot, stufenlos:** Bis 50 gibt es keine Wirkung, ab 80 die volle, dazwischen anteilig. Die volle Wirkung ist die bisherige für Traditionsvereine:
- Das klassische Trikot bringt Faktor +0,05.
- Das klassische Trikot bringt Fans +1, ab halber Wirkung (ganze Zahl).
- Das mutige Trikot wird nur mit 35 % statt 50 % Kult.

Gewürfelt wird gleich oft wie vorher. Die Meldung spricht von der Kurve statt vom Traditionsverein, weil auch Leverkusen hoch liegen kann.

**Ergebnis mit den Stammdaten 2026/27** (von Hand nachgerechnet, ohne Laufzeit):

| Verein | Stadion | Mitglieder je Platz | Zugkraft | Fankultur |
|---|---|---|---|---|
| Union Berlin | 1,00 | 3,2 | 0,58, ausverkauft | 80 |
| Leverkusen | 0,99 | 2,3 | 0,60, ausverkauft | 79 |
| St. Pauli | 0,98 | 1,8 | 1,04 | 77 |
| Kaiserslautern | 0,85 | 0,8 | 1,58 | 71 |
| Freiburg | 0,965 | 2,3 | 0,78, fast ausverkauft | 75 |
| RB Leipzig | 0,89 | 0,02 | 0,88 | 38 |
| Wolfsburg | 0,73 | 0,7 | 0,73 | 30 |
| Hoffenheim | 0,83 | 0,4 | 0,60 | 27 |

- **Ganz oben und ganz unten:** Bei 90 und mehr liegen Dortmund, Schalke, der HSV, Bayern und Köln. Unter 5 liegen Wehen Wiesbaden, Großaspach, Würzburg, Ingolstadt, Havelse und Verl, dazu die zweiten Mannschaften.
- **Leverkusen** landet weit oben, weil das Stadion voll ist und der Verein viele Mitglieder hat. Nur die Zugkraft, gemessen am Ansehen, ist schwach. Das passt zu „kein Traditionsverein, aber fest etabliert“. Soll Leverkusen tiefer liegen, bekommt die Zugkraft mehr Gewicht.
- **Große Stadien in der 2. Liga** liegen knapp über 50, weil das Stadion nicht voll wird: Hertha 53, Hannover 51, Nürnberg 56.
- **Kleine, fast volle Stadien** heben die stufenlose Untergrenze (EM2) etwas: Heidenheim 59, Kiel 56, Osnabrück 46. Ohne sie waren es 42, 43 und 42.
- **Regionalliga:** Die Werte dort sind grob, weil Plätze und Fans geschätzt sind.
- **Gründungsjahr:** `gegr` bleibt für Jubiläen (K27d). `tradition:false` aus Prüfung EJ4 fällt weg.

**Später:**
- Fankultur auch beim Vorstand (K20: Verkauf eines Lieblings), beim Stadionnamen (K24), bei den Dauerkarten selbst und bei der Fanstimmung (K27). Seit K27e (K27 §5.4c) wirkt sie auf den Baustein Entscheidungen der Fanstimmung und auf den Vorstand, wenn ein Abwerbeversuch auffliegt.
- Echte Dauerkarten- oder Zuschauerzahlen über mehrere Jahre als Stammdatum, sobald es eine Quelle gibt.

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

**Umsetzung K25b (21.11.2026, popolupo, ohne Testlauf):** „Trikot ausverkauft“ ist eine Entscheidungskarte. Auslöser: ein Spieler deines Vereins bis 20 Jahre mit mindestens 3 Ligatoren in der Saison. Nachproduzieren kostet 100.000 € und bringt vier Wochen lang 20 % mehr Fanartikel, sonst Fanstimmung −1. „Retro-Trikot zum Jubiläum“ wartet auf ein Gründungsjahr in den Stammdaten.

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

**Vorläufig entschieden mit K25a (21.11.2026, popolupo):**

1. Geldneutral: Faktoren auf den heutigen Fanartikel-Erlös statt der neuen Formel, die kommt mit K23c (§5.4).
2. Trikot mit Reaktion aus eigenem Strom, ohne Tradition, klassisch als Voreinstellung (§5.4).
3. Vier von sechs Kampagnen, Dauerkarten und Mitglieder warten auf K27 und K23 (§5.4).
4. Fanarbeit wirkt auf die Pfiffe aus K27, bis es Pyrotechnik gibt (§5.4). Seit K09h (24.11.) wirkt sie zusätzlich auf die Karten zu Zuschauer-Vergehen (−30 %), die Pfiffe bleiben.
5. Werbewert als Wert ohne Wirkung, für K24 vorbereitet (§5.4).
6. Bereich `marketing` ab der B-Lizenz mit Automatik (§5.4).

## Quellen

- Fanwerbung, Fanartikel-Sortiment: PLAN §4 (GameStar 4/2000)
- Trikotwechsel mit Fan-Reaktion: `konzepte/_recherche-genre.md`, Abschnitt 4b
