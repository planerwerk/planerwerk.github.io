# K32 – Spielwelt und Saisonwechsel

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12. **Auslandspool und Nationen umgesetzt in U9b** (11. November 2026, `js/ausland.js`, `daten/ausland.js`, `daten/nationen.js`, Test `tests/ausland.js`): 208 echte Auslandsvereine in zwölf Ländern, je Verein ein Kern von 6–10 erzeugten Spielern, Nationalität für alle Spieler, Entwicklung und Saisonwechsel des Pools, Kauf im Ausland, Verkauf ins Ausland. Der Rest (Karriereende nach 5.1, Trainerpool, Gleichgewicht der Ligen, Handel der Computer-Vereine mit dem Ausland) folgt in Welle 4 und mit U11. Abweichungen in Abschnitt 12.
Hängt ab von: K03, K08, K31, K33 · Wird gebraucht von: K13 (Nominierungen), K16 und K28 (Trainerpool), K18 (Ausland), K19.
Teile: **Auslandspool** in Welle 3 (vorgezogen, PLAN §2), der Rest in Welle 4. Der Unterbau (3. Liga, Regionalliga) steht in K32a.

## 1. Ziel und Spielgefühl

- **Eine Welt, die über viele Saisons lebt:** Stars werden älter und hören auf, neue Talente kommen, Spieler gehen ins Ausland und kommen zurück.
- **Im Gleichgewicht:** Die Ligen werden über die Jahre weder immer stärker noch immer schwächer (K03 §10).
- **Ausland ohne Riesenaufwand:** Spieler aus dem Ausland sind kaufbar und unsicher (PLAN §2), aber wir simulieren keine fremden Ligen (Konsistenzprüfung C4).
- **Echte Vereinsnamen, erzeugte Spieler** (entschieden 8.11.): Gepflegt werden nur die Namen der Auslandsvereine. Kader, Stärken und Spieler erzeugt das Spiel.

## 2. Vorbilder und Abgrenzung

- **Football Manager:** komplette Datenbank mit vielen Ligen. Zu viel für uns.
- **Anstoss, CM 01/02:** Fans pflegen Datenbanken bis heute (Recherche 4c, 4d). Bei uns: einfache Dateien (K33).
- **Bewusst anders:** Das Ausland ist ein **Pool von Spielern** bei echten Auslandsvereinen, aber ohne Spielplan und ohne echte Kader.

## 3. Begriffe und Daten

### 3.1 Auslandspool

| Begriff | Bedeutung |
|---|---|
| Land | etwa 12 Länder: England, Spanien, Italien, Frankreich, Niederlande, Portugal, Belgien, Österreich, Schweiz, Türkei, Skandinavien, Osteuropa |
| **Auslandsverein** | echter Name, Land, Stufe (Spitze, Mitte, unten), geschätztes Ansehen und Finanzkraft. Nur Name und Land werden gepflegt, der Rest ist eine grobe Schätzung in derselben Datei |
| Poolspieler | erzeugter Spieler mit allen Werten aus K03, Auslandsverein, Vertrag, aber ohne Spiele |
| Kern | je Auslandsverein 6–10 erzeugte Spieler, die für Transfers zählen. Der übrige Kader ist nur eine Teamstärke |
| Größe | etwa 12 Länder × 12–20 Vereine, also rund 1.500–2.500 Poolspieler |

- Poolspieler entwickeln sich nach K03 mit angenommener Spielpraxis nach ihrer Rolle in der Gruppe. Form wandert zufällig um 10.
- **Auslandsvereine kaufen und verkaufen** wie Computer-Vereine (K31), vereinfacht: Bedarf nach Abgängen aus dem Kern, Budget nach Finanzkraft. Reiche Vereine kaufen auch Stars aus der Bundesliga.
- Gespeichert in `S.pl` mit `team` gleich der Kennung des Auslandsvereins, die Vereine in `daten/ausland.js` (neu): `[Name, Land, Stufe, Ansehen, Finanzkraft]`.
- **Speicher:** etwa 2.000 zusätzliche Spieler. K33 prüft, ob der Spielstand im Browser-Speicher bleibt (Ziel unter 3 MB). Sonst wird der Kern auf 6 verkleinert.
- **Europapokal** bleibt eine spätere Erweiterung (PLAN §2), wird mit den echten Auslandsvereinen aber möglich: Ihre Teamstärke reicht für simulierte Spiele.

### 3.2 Nationen

- `daten/nationen.js` (neu, K13): Name, Kürzel, Stärke-Rang, Sprache. Für Nominierungen (K13), Sprache und Landsleute (K03, K14) und die Herkunft neuer Poolspieler.

### 3.3 Trainerpool

- Vereinslose Trainer für Computer-Vereine (K28, K31): erfundene Trainer, entlassene Trainer, ehemalige Spieler (K16). Je Trainer Ruf, Lieblingsstil (K06), Haltung.

## 4. Abläufe

### 4.1 Saisonwechsel (1. Juli, gibt es)

Reihenfolge, ergänzt um die neuen Teile:

1. Abschlusstabellen, Auf- und Abstieg (gibt es, K32a)
2. Karriereenden (5.1) in Ligen und Pool
3. Ehemalige Spieler werden mit 15 % Mitarbeiter oder Trainer (K16)
4. Alter +1, Persönlichkeit reift (K03 §5.7)
5. Verträge laufen aus, Vereinslose (gibt es), Vorverträge werden wirksam (K21)
6. Jahrgänge der Vereine (K08) und des Pools (5.2)
7. Pool auffüllen, wenn er unter die Sollgröße fällt
8. Planstellen und Bedarf der Computer-Vereine neu (K31)
9. Prüfung des Gleichgewichts (5.3), nur als Messwert für die Tests

### 4.2 Datenpflege

- Stammdaten gelten nur für neue Karrieren (K33). Für eine neue echte Saison (zum Beispiel 2027/28) kann eine neue `spieler.js` die Kader ersetzen, laufende Karrieren bleiben unberührt.

## 5. Regeln und Formeln

### 5.1 Karriereende

```
Chance je Saison = Grundwert(Alter) × Niveau × Verletzung × Professionalität
```

- **Grundwert:** ab 32 Jahren 10 %, 34: 25 %, 36: 50 %, 38: 90 %, danach 100 %. Torhüter zwei Jahre später.
- **Niveau:** Spieler, die für ihre Liga zu schwach geworden sind (Stärke unter dem Ligaschnitt − 10), ×1,5. Stammspieler ×0,7.
- **Verletzung:** Kreuzbandriss in den letzten 12 Monaten ab 32 Jahren ×1,5.
- **Professionalität:** Vorbildprofis ×0,8.
- Ziel: Karriereende im Schnitt mit etwa 33 bis 34 (Studie: Profis hören im Schnitt mit 33 auf, K03 Quellen). Heute: `saison.karriereende` mit ab 34, 25 % je Jahr, spätestens 38.

### 5.2 Neue Spieler in der übrigen Welt

- **Vereine der 1. bis 3. Liga:** Jahrgänge nach K08 (D4: K08 für alle Vereinsjahrgänge, K32 für den Pool und Lücken).
- **Pool:** je Gruppe neue 17–19-Jährige, Talent nach Ansehen der Gruppe, Nationalität überwiegend aus dem Land.
- **Aufsteiger aus der Regionalliga:** bekommen einen Kader nach K32a (gibt es, `kaderErzeugen`).

### 5.3 Gleichgewicht

- Messwerte je Saison: Schnitt der besten 14 je Verein und Liga, Zahl der Spieler ab 85 in der 1. Liga, Größe des Pools.
- Ziele aus K03 §10: Schnitt je Liga über 10 Saisons ±1,5, Spieler ab 85 ±30 %.
- **Stellschrauben dafür:** Talentbasis der Jahrgänge (K08), Karriereende (5.1), Größe und Stärke des Pools. Keine automatische Nachregelung im Spiel, nur Kalibrierung über Tests (K02, kein Gummiband).

## 6. Hebel des Spielers

- **Im Ausland einkaufen:** günstiger, aber unsicher (Grundkenntnis 5, K18), Integration langsamer (K03 §5.5), Heimweh möglich.
- **Ins Ausland verkaufen:** reiche Gruppen zahlen gut.
- **Altstars verpflichten:** billig, aber Karriereende nah.

## 7. Verhalten der Computer-Vereine

- Kaufen im Ausland wie im Inland, mit ihrem Scouting (K18). Große Vereine scouten das Ausland besser.
- Vereinsgruppen im Ausland handeln vereinfacht nach K31.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Altstar will ein Comeback (PLAN §4) | ehemaliger Star, gerade vereinslos | billiger Vertrag, Fans freuen sich, Kondition niedrig |
| Abschiedsspiel | Karriereende eines Publikumslieblings | Einnahmen, Fans (K27) |
| Rückkehr aus dem Ausland | deutscher Spieler im Pool, Heimweh oder Familie | Interesse an deinem Verein hoch (K19) |
| England ruft | reiche Gruppe bietet für deinen Star | Entscheidung nach K19 |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 | Werte, Entwicklung, Alter, Karriereende |
| K08 | Jahrgänge, Gleichgewicht |
| K13 | Nationen, Nominierungen auch aus dem Pool |
| K16, K28 | ehemalige Spieler als Mitarbeiter und Trainer, Trainerpool |
| K18 | Grundkenntnis Ausland 5 |
| K19, K31 | Transfers mit dem Pool |
| K32a | Unterbau, Aufsteigerkader |
| K33 | Datenpflege, Stammdaten |

## 10. Zielwerte und Tests

Teil von `tests/welt.js` (K31).

| Prüfung | Ziel |
|---|---|
| Karriereende | Schnitt 33–35 Jahre, Torhüter 35–37 |
| Gleichgewicht | wie K03 §10 |
| Pool stabil | Größe über 10 Saisons ±15 % |
| Abwanderung | Bundesliga verliert je Sommer 3–10 Spieler an reiche Auslandsgruppen (prüfen) |
| Rückkehrer | jede Saison einige deutsche Spieler aus dem Pool zurück |

## 11. Stellschrauben

```js
welt:{
  ausland:{laender:12,stufen:[2,3],groesse:[600,1000],praxisNachRolle:true,formZufall:0.5},
  karriereende:{grund:[[32,0.10],[34,0.25],[36,0.50],[38,0.90]],torwartPlus:2,schwachUnter:10,schwach:1.5,stamm:0.7,kreuzbandAb:32,kreuzband:1.5,profi:0.8},
  exSpielerStab:0.15,
  pool:{jahrgangAlter:[17,19],nachfuellenUnter:0.85}
}
```

`saison.karriereende` aus der heutigen `regeln.js` geht darin auf.

**Gebaut in U9b** (`REGELN.welt.nation` und `REGELN.welt.ausland`, mit Kommentar je Wert): Kern je Stufe, Positionen, Talentplätze, Streuung der Stärke, Grenze für das Talent, Anteil der Einheimischen, Gewichte der Legionäre, angenommene Spielpraxis, Formzufall, Abgang aus dem Kern, Wechsel zu größeren Vereinen, Ablöseforderung, Budget, Anteil der Angebote aus dem Ausland, Wechselbereitschaft, Vorlauf.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. ~~Vereinsgruppen~~ **Entschieden am 8.11.:** echte Auslandsvereinsnamen, erzeugte Spieler, nur die Namen werden gepflegt.
2. **Keine automatische Nachregelung** der Weltstärke im Spiel. Das Gleichgewicht wird über Tests kalibriert (K02: kein Gummiband).
3. **Zwölf Länder** im Pool, Nationen-Tabelle für alle Länder der Welt (für Nationalitäten der Spieler).

**Vorläufig entschieden bei der Umsetzung (U9b, 11. November 2026):**

4. **Zwölf Länder, 208 Vereine:** England, Spanien, Italien (je 20), Frankreich, Niederlande, Portugal, Belgien, Türkei (je 18), Österreich, Schweiz (je 12) mit der vollständigen höchsten Liga 2026/27. Skandinavien (18: Dänemark, Schweden, Norwegen) und Osteuropa (16: Polen, Tschechien, Kroatien, Serbien, Ukraine) sind eine Auswahl der größten Vereine. Alle Namen sind per Websuche geprüft (englische Wikipedia, Saisonartikel der Ligen, abgerufen am 11.11.2026), in der im Deutschen üblichen Schreibweise. Stufe, Ansehen und Finanzkraft sind grobe Schätzungen von mir.
5. **Kern nach Stufe:** Spitze 10, Mitte 8, unten 6 Spieler, zusammen 1.664 Poolspieler. Jeder Kern hat feste Plätze: einen Torwart, Abwehr, Mittelfeld und Sturm nach einer festen Reihenfolge, dazu zwei Talentplätze (unten einer) für Spieler bis 21 Jahre.
6. **Stärke nach Ansehen:** Kernspieler liegen bei der Grundstärke des Vereins (48 + 0,4 × Ansehen, wie bei erfundenen Spielern deutscher Vereine) −3 bis +5, Talente 5–11 darunter. Das Talent (pot) hängt am Verein: Talente Grundstärke +1 bis +8, Kernspieler höchstens +6. Ohne diese Grenze wuchsen bei den Spitzenvereinen rund 30 Spieler ab Stärke 90 heran (bis 97). Jetzt sind es 7–16, der stärkste liegt bei 93–94 (Bundesliga zum Start: Kane 90).
7. **Gespeichert getrennt von den Ligaspielern** in `S.ausland.pl`, nicht in `S.pl` (Abweichung von 3.1). Grund: Alle Schleifen über `S.pl` (Training, Spieltag, Kabine, Markt) setzen deutsche Vereine voraus. So bleiben sie unberührt und schnell. `PIX` kennt beide Listen, das Feld `team` ist die Kennung des Auslandsvereins (ab 2000). Poolspieler haben einen eigenen Nummernkreis (ab 1.000.000), damit neue Poolspieler die Nummern der Ligaspieler nicht verschieben.
8. **Eigener Zufallsstrom:** Aufbau, Woche und Saisonwechsel des Pools laufen in eigenen Strömen. Die deutsche Welt ist mit und ohne Pool gleich: Zwei simulierte Saisons liefern nach U9b dieselben Ergebnisse wie davor.
9. **Vorlauf beim Aufbau:** Der Pool durchläuft sechs Saisons in groben Schritten, bevor das Spiel beginnt. Ohne Vorlauf waren alle Talente gleich jung und wuchsen zusammen hoch (Spieler ab Stärke 85: von 100 auf 167 und zurück auf 87 über 13 Saisons). Mit Vorlauf startet der Pool im Gleichgewicht und bleibt dort (über sechs gespielte Saisons: Schnitt 77,7–77,8, Alter im Schnitt 26, 109–124 Spieler ab 85). Der Aufbau einer neuen Welt dauert mit Pool und Vorlauf etwa 0,3 statt 0,12 Sekunden.
10. **Entwicklung:** je Woche nach K03 mit fester angenommener Spielpraxis (Kernspieler 80, Talente 45), Form wandert um ±0,5 und zieht zur Mitte. Poolspieler haben keine Spiele, keine Frische-Rechnung, keine Stimmung.
11. **Saisonwechsel des Pools:** Alter +1, Karriereende nach der heutigen Regel (ab 34), dazu fällt aus dem Kern, wer ab 24 Jahren mehr als 7 unter der Grundstärke liegt oder wer ab 31 das Los zieht ((Alter − 30) × 12 %). Wer mehr als 6 über der Grundstärke liegt, wechselt mit 50 % zu einem größeren Auslandsverein. Lücken füllt der Verein aus dem übrigen Kader (ein neuer erzeugter Spieler). Das ist die vereinfachte Fassung von „kaufen und verkaufen wie Computer-Vereine“.
12. **Nationalität im Pool:** einheimisch zu 45 % (Spitze), 60 % (Mitte), 72 % (unten), sonst eine Nation aus einer gewichteten Liste (darunter Deutschland für mögliche Rückkehrer). Die Namen kommen aus Namenslisten je Sprachraum (`daten/namen.js`), doppelte Namen werden vermieden.
13. **Kauf im Ausland:** über dieselbe Spielerkarte wie im Inland. Die Ablöseforderung ist Marktwert × (0,8 + 0,6 × Finanzkraft/100): arme Vereine verkaufen unter Marktwert, reiche deutlich darüber. Die Wechselbereitschaft sinkt um 5 Punkte, bei Deutschen im Ausland steigt sie um 10 (Rückkehr).
14. **Verkauf ins Ausland:** 30 % der Angebote für deine Spieler kommen von Auslandsvereinen, wenn der Spieler höchstens 5 unter deren Grundstärke liegt und das Budget reicht (Finanzkraft² × 12.000 €). Der Spieler zieht dann in den Pool um.
15. **Nationalität erfundener Spieler der deutschen Vereine:** aus dem Nachnamen abgeleitet, fest je Spieler und ohne Zufallsstrom. Deutscher Nachname: 93 % Deutschland. Fremdsprachiger Nachname: 50 % das Land der Herkunft, sonst Deutschland. In der 3. Liga sind so etwa 76 % Deutsche.
16. **Nationalität echter Spieler:** fünfte Spalte in `daten/spieler.js`, für alle 1.011 Spieler aus den Kadertabellen der Wikipedia (abgerufen am 11.11.2026). 474 spielen nicht für Deutschland. Bei Doppelstaatlern zählt die erste Flagge der Kadertabelle. Vier Spieler von Arminia Bielefeld, die dort mit zwei Flaggen stehen, sind als Deutsche eingetragen.
17. **Nationen-Tabelle:** 148 Nationen mit Rang der FIFA-Weltrangliste vom 7. Oktober 2026 (Abweichung von Nr. 3: nicht alle Länder der Welt, sondern alle, deren Rang abrufbar war, und alle, die im Spiel vorkommen). Indonesien und Philippinen sind geschätzt, Bolivien ist erschlossen. Weitere Nationen lassen sich anhängen.
18. **Spielstand:** Poolspieler werden ohne Sperren, Karten und berechnete Eigenschaften gespeichert, Stärke und Form mit zwei Nachkommastellen. Der Pool braucht etwa 740 KB, der ganze Spielstand bleibt über sechs Saisons unter 3 MB.
19. **Lernstufen (K36):** Der Auslandsmarkt ist als Information frei. Im Ausland beobachten und kaufen ab der B-Lizenz (`ausland`), Suchauftrag im Ausland mit dem Suchauftrag ab A. Angebote aus dem Ausland gehören zu den Transfers (C).
20. **Noch nicht gebaut:** Computer-Vereine kaufen im Ausland, Auslandsvereine kaufen bei Computer-Vereinen (beides U11, K31), Integration, Deutschkenntnisse, Heimweh und Landsleute (K03 §5.5, K14), Länderspiele (K13), die Ereignisse aus §8, Karriereende nach 5.1, Trainerpool, Europapokal (K37).

**Noch zu recherchieren:** Abgänge der Bundesliga ins Ausland je Sommer, durchschnittliches Karriereende von Torhütern.

## Quellen

- Auslandsspieler unsicher, Auslandspool vorgezogen: PLAN §2, `konzepte/_konsistenzpruefung.md` C4
- Vereine der Auslandsligen 2026/27 (abgerufen am 11.11.2026): englische Wikipedia, Saisonartikel [Premier League](https://en.wikipedia.org/wiki/2026–27_Premier_League), [La Liga](https://en.wikipedia.org/wiki/2026–27_La_Liga), [Serie A](https://en.wikipedia.org/wiki/2026–27_Serie_A), [Ligue 1](https://en.wikipedia.org/wiki/2026–27_Ligue_1), [Eredivisie](https://en.wikipedia.org/wiki/2026–27_Eredivisie), [Primeira Liga](https://en.wikipedia.org/wiki/2026–27_Primeira_Liga), [Belgian Pro League](https://en.wikipedia.org/wiki/2026–27_Belgian_Pro_League), [Austrian Bundesliga](https://en.wikipedia.org/wiki/2026–27_Austrian_Football_Bundesliga), [Swiss Super League](https://en.wikipedia.org/wiki/2026–27_Swiss_Super_League), [Süper Lig](https://en.wikipedia.org/wiki/2026–27_Süper_Lig), [Danish Superliga](https://en.wikipedia.org/wiki/2026–27_Danish_Superliga), [Allsvenskan 2026](https://en.wikipedia.org/wiki/2026_Allsvenskan), [Eliteserien 2026](https://en.wikipedia.org/wiki/2026_Eliteserien), [Ekstraklasa](https://en.wikipedia.org/wiki/2026–27_Ekstraklasa), [Czech First League](https://en.wikipedia.org/wiki/2026–27_Czech_First_League), [HNL](https://en.wikipedia.org/wiki/2026–27_Croatian_Football_League), [Serbian SuperLiga](https://en.wikipedia.org/wiki/2026–27_Serbian_SuperLiga), [Ukrainian Premier League](https://en.wikipedia.org/wiki/2026–27_Ukrainian_Premier_League)
- FIFA-Weltrangliste vom 7. Oktober 2026: [deutsche Wikipedia](https://de.wikipedia.org/wiki/FIFA-Weltrangliste) (Plätze 1–20) und die Verbandsartikel der englischen Wikipedia ([UEFA](https://en.wikipedia.org/wiki/UEFA), [CONMEBOL](https://en.wikipedia.org/wiki/CONMEBOL), [CAF](https://en.wikipedia.org/wiki/Confederation_of_African_Football), [AFC](https://en.wikipedia.org/wiki/Asian_Football_Confederation), [CONCACAF](https://en.wikipedia.org/wiki/CONCACAF))
- Nationalität der echten Spieler: Kadertabellen der Vereinsartikel in der deutschen Wikipedia und der Saisonartikel 2026/27 in der englischen Wikipedia, abgerufen am 11.11.2026
- Karriereende im Schnitt mit 33: K03, Quellen (SoccHealth-Studie laut Ärzte Zeitung)
- Datenbanken der Community: `konzepte/_recherche-genre.md`, Abschnitte 4c und 4d
