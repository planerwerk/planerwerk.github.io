# K26 – Stadion und Infrastruktur

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12. **Teilschritt K26a umgesetzt (21. November 2026, popolupo, §5.1), K26b Computer-Vereine bauen (22. November 2026, §5.2), beide noch ohne Testlauf.**
Hängt ab von: K23 (Finanzen), K27 (Fans) · Wird gebraucht von: K07, K08, K10, K24, K25.

## 1. Ziel und Spielgefühl

- **Ein Stadionbaukasten statt „1.000 Plätze, Geld weg“:** Die FM-Community spottet, „das Stadion wächst alle sieben Saisons um vier Plätze“, und wünscht sich Ausbau mit Optionen und Schritten (Recherche 4, 4b).
- **Bauen dauert und birgt Risiko:** Planung, Genehmigung, Bauzeit, Verzögerung, Kostensteigerung.
- **Mehr als Plätze:** Trainingsgelände, Nachwuchsleistungszentrum, Reha-Zentrum, Rasen, Flutlicht, Logen.

## 2. Vorbilder und Abgrenzung

- **BMH, Anstoss:** Stadionausbau und Platzwart (PLAN §4, Recherche 2.1).
- **Heute im Spiel:** Tribünen (+3.000 Plätze, 4,5 Mio. €, seit K23c 12 Mio. €, 6 Wochen), Logen (+10, 2,5 Mio. €, 4 Wochen), Fanshop (3 Stufen). Bleibt die Grundlage.
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
| Platzwart | seit 10.11. als Greenkeeper im Stab (K16 §12 Nr. 15) | Rasenqualität, weniger Ausfälle bei Frost, kleine Heimstärke bei gutem Rasen (3.2a) |

### 3.2a Rasenqualität (ergänzt 10. November 2026, vorläufig)

- **Je Platz ein Wert 0–100:** Stadion und Trainingsgelände getrennt.
- **Sinkt:** je Heimspiel −3, je Frosttag ohne Rasenheizung −1, später Konzerte und andere Veranstaltungen.
- **Steigt:** jede Woche um 0,5 bis 3 nach der Qualität des Greenkeepers. In der Sommerpause lässt sich der Rasen neu verlegen (Geld, danach 100).
- **Wirkung, klein und für beide Mannschaften gleich:** Unter 40 leiden Stile mit kurzen Pässen und viel Ballbesitz (Umsetzung −5 %, K06), unter 30 steigt das Verletzungsrisiko leicht (×1,1, K10). Über 80 kennt die Heimmannschaft ihren Platz besonders gut (Heimvorteil +0,3 %). Der Trainingsplatz wirkt auf den Trainingsfaktor (K07).
- Alle Werte sind Spielwerte, Studien habe ich dazu nicht geprüft.

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

### 5.1 Umsetzung K26a (21.11.2026, popolupo): Bauprozess und Anlagen

- **Bauprozess für alle Bauten** (§4, auch Tribüne, Logen, Fanshop): eine Baustelle zur Zeit wie bisher. Erst die **Genehmigung** (2 bis 8 Wochen, mit 20 % Auflagen: +5 bis +15 % Kosten). Dann der **Bau** mit der bisherigen Dauer. Mit 30 % **Verzögerung** um 1 bis 6 Wochen, mit 15 % **Mehrkosten** von 5 bis 20 %. Die Baukosten zahlst du beim Start, Auflagen beim Baubeginn, Mehrkosten beim Ende. Alles wird beim Start im eigenen Strom `bau` gewürfelt, gemeldet wird es, wenn es eintritt. Während eine Tribüne gebaut wird, fehlen ihre 3.000 Plätze.
- **Anlagen** (§3.2), Kosten der nächsten Stufe = Grundkosten × 1,6 je erreichter Stufe:

  | Anlage | Stufen | Start | Grundkosten | Bauzeit | Wirkung |
  |---|---|---|---|---|---|
  | Trainingsgelände | 1–5 | 2 | 2 Mio. € | 10 Wochen | Entwicklung im Training × (1 + 0,05 × (Stufe − 2)), Verletzungsrisiko im Training × (1 − 0,04 × (Stufe − 2)). Auf der Startstufe wie bisher. |
  | Nachwuchsleistungszentrum | 0–5 | 0 | 1,5 Mio. € | 16 Wochen | hebt den Deckel des Jugendniveaus (K08) um 6 je Stufe (70 bis 100). Die Jugendarbeit (K08) bleibt daneben bestehen (Abweichung von §3.2). |
  | Reha-Zentrum | 0–3 | 0 | 1 Mio. € | 8 Wochen | Ausfallzeit −3 % je Stufe, mit dem Physiotherapeuten zusammen höchstens −25 % (K10, K16) |
  | Catering | 0–1 | 0 | 1,5 Mio. € | 6 Wochen | Zuschauereinnahmen +5 % |
  | Anzeigetafel | 0–1 | 0 | 1 Mio. € | 4 Wochen | Zuschauereinnahmen +3 % |

- **Instandhaltung** (§5): 1 % der Bausumme im Jahr, monatlich gebucht („Instandhaltung“, laufend in der Prognose von K23a). Gezählt werden die Bauten ab K26a.
- **Computer-Vereine** bauen noch nicht (§7). Ihre Anlagen bleiben auf der Startstufe, das Trainingsgelände wirkt dort also wie bisher.
- **Lizenz:** Bereich `stadion` (wie die Tribünen), kein neuer Bereich.
- **Noch nicht:** Steh- und Sitzplätze, Business-Seats, Dach, Rasenheizung, Flutlicht, Rasenqualität mit Greenkeeper (§3.2a), Eigentum und Miete (§3.3), neues Stadion als Großprojekt, Karten aus §8, Bauen der Computer-Vereine.

### 5.2 Umsetzung K26b (22.11.2026, popolupo, ohne Testlauf): Computer-Vereine bauen

- **Wann:** einmal je Saison zum Saisonstart (nach Auf- und Abstieg und den TV-Geldern der neuen Saison), ohne Zufall. Gebaut wird ohne Genehmigung und Bauzeit, es ist in der Sommerpause fertig (vereinfacht gegenüber deinem Bauprozess).
- **Tribüne** (§7): Die Nachfrage ist die erwartete Zuschauerzahl eines Ligaheimspiels ohne Deckel durch die Plätze, gegen einen Gegner mit dem Ansehen des Ligaschnitts, mit neutraler Form (dieselbe Rechnung wie die Einnahmen der Computer-Vereine, K23b). Liegt sie zwei Saisons nacheinander über 95 % der Plätze, kommen 3.000 Plätze dazu, wenn
  - die neue Zahl höchstens 105 % der Nachfrage ist (kein Leerbau, §10),
  - danach noch die Reserve des Vorstands bleibt (10 % der erwarteten Einnahmen, K23d) und
  - höchstens 90.000 Plätze entstehen.
- **Anlagen** (sonst, höchstens eine je Saison): die erste noch nicht ausgebaute aus der Liste des Profils. Ausbildungsvereine: Trainingsgelände, Catering, Anzeigetafel. Alle anderen: Catering, Anzeigetafel, Trainingsgelände. Nur wenn danach noch dreimal die Reserve bleibt.
  - Abweichung von §7: Ausbildungsvereine bauen das Trainingsgelände statt des Nachwuchszentrums, weil das Nachwuchszentrum im Spiel nur auf deine Jugend wirkt (`jugendDeckel`). Das Trainingsgelände wirkt bei allen Vereinen (Entwicklung, Verletzungen).
- **Meldung:** nur für Tribünen in deiner Liga.
- **Dein Verein** baut nicht von selbst: Der Bereich `stadion` hat keine Automatik (K36).
- **Seit K26c (22.11.2026, popolupo, ohne Testlauf):** Der Fanshop (`t.shop`, Kosten nach Stufe wie bei dir) steht vorn in den Listen (bei Ausbildungsvereinen nach dem Trainingsgelände). So verkaufen auch Computer-Vereine Fanartikel. Sie zahlen Instandhaltung wie du (1 % der Bausumme je Saison, verteilt auf die Ligaspiele).
- **Noch nicht:** Reha-Zentrum und Nachwuchszentrum für sie, Abriss bei dauerhaft leerem Stadion.

### 5.3 Umsetzung K26d (22.11.2026, popolupo, ohne Testlauf): Dach

- **Dach** als weitere Anlage (§3.1): eine Stufe, 15 Mio. €, 20 Wochen Bauzeit, mit dem Bauprozess aus §5.1.
- **Wirkung:** Heimvorteil × 1,005 im Heimspiel, wenn das Stadion voraussichtlich mindestens zu 95 % voll ist. Die Schätzung nimmt die erwarteten Zuschauer ohne Würfel und ohne den konkreten Gegner (Engine `side`, `dachFaktor`). Seit Prüfung DI1 mit deinem Ticketpreis wie bei den echten Zuschauern, sonst bekam ein halb leeres Stadion bei teuren Tickets den Bonus.
- **Nicht** für Computer-Vereine (nicht in ihren Baulisten aus K26b), kein Schutz vor Wetter, weil es im Spiel kein Wetter gibt.
- **Lizenz:** Bereich `stadion` wie die übrigen Bauten.

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

**Stand 22.11.2026:** Bauverzögerung, Auflagen (Lärmschutz, Verkehr) und Mehrkosten kommen seit K26a als Meldungen im Bauablauf. „Stadt bietet Zuschuss“ seit K26e (ohne Testlauf) als große Entscheidungskarte bei einem Bauprojekt ab 5 Mio. €: annehmen bringt 15 % der Baukosten (neue Kartenwirkung `zuschuss`), dafür sinkt der Ticketpreis auf den Richtpreis. „Rasen nach Frost kaputt“ fehlt (Rasenqualität ist zurückgestellt).

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

**Ergänzt am 10. November 2026:** Der Platzwart heißt jetzt Greenkeeper und gehört zum Stab (K16 §12 Nr. 15), damit er wie alle Mitarbeiter eingestellt, bezahlt und abgeworben wird. Die Rasenqualität hat eigene Regeln (3.2a).

**Noch zu recherchieren:** echte Baukosten je Platz, Stehplatzanteile der Bundesliga-Stadien, Eigentumsverhältnisse der Stadien.

**Recherche Baukosten (21.11.2026, popolupo, Websuche):** Planungswerte je Sitzplatz etwa 3.000 bis 3.500 € bei einfachem und 5.000 bis 6.000 € bei gehobenem Standard (Hubert Nienhoff, gmp Architekten, bei t-online). Beispiel: Der Umbau der Haupttribüne in Stuttgart für die EM 2024 stieg von geplant 65 auf 140 Mio. € (Stuttgarter Zeitung). Echt kosten 3.000 Plätze also etwa 9 bis 18 Mio. €. Im Spiel kostet die Tribüne 4,5 Mio. (Spielgeld, wie TV-Gelder und Gehälter etwa ein Viertel bis ein Fünftel der echten Größenordnung). Bleibt so bis K23c.

**Recherche Stehplätze und Eigentum (21.11.2026, popolupo, Websuche, nur teilweise):** Allianz Arena 75.024 Plätze, davon 15.794 Stehplätze (Sport1, Stand vor Corona, also etwa 21 %). VfB Stuttgart 8.268 Stehplätze (Stuttgarter Zeitung) bei rund 60.000 Plätzen, also etwa 14 %. Eine vollständige Liste je Verein habe ich nicht gefunden. Beim Eigentum unterscheidet eine Arbeit am KIT privates und öffentliches Eigentum sowie öffentlich-private Partnerschaften, eine Liste je Stadion war nicht lesbar. Bekannt ist etwa: In Darmstadt gehört das Stadion der Stadt. **Vorläufig für einen späteren Schritt K26b:** Stehplatzanteil 15 bis 25 % je Stadion, Eigentum als Stammdatum mit „Verein“, „Stadt“ oder „Gesellschaft“, beides erst mit dem Ticketmodell aus K27 und K23c.

**Vorläufig entschieden mit K26a (21.11.2026, popolupo):**

1. Bauprozess mit Genehmigung, Auflagen, Verzögerung und Mehrkosten für alle Bauten, gewürfelt beim Start im eigenen Strom (§5.1).
2. Trainingsgelände mit Startstufe 2 und neutraler Wirkung dort, damit sich ohne Ausbau nichts ändert (§5.1).
3. Nachwuchsleistungszentrum hebt den Deckel des Jugendniveaus, die Jugendarbeit bleibt (§5.1).
4. Reha-Zentrum mit Physio zusammen höchstens −25 % Ausfallzeit (§5.1).
5. Catering +5 %, Anzeigetafel +3 % auf die Zuschauereinnahmen (§5.1).
6. Instandhaltung 1 % der Bausumme im Jahr, nur für Bauten ab K26a (§5.1).
7. Computer-Vereine bauen noch nicht (§5.1). Seit K26b bauen sie (§5.2).

**Vorläufig entschieden mit K26b (22.11.2026, popolupo, ohne Testlauf):**

8. Computer-Vereine bauen zum Saisonstart ohne Zufall und ohne Bauzeit (§5.2).
9. Tribüne nach zwei Saisons mit Nachfrage über 95 %, höchstens bis 105 % der Nachfrage, nur mit Reserve (§5.2).
10. Höchstens eine Anlage je Saison nach Profil, Ausbildungsvereine zuerst das Trainingsgelände statt des Nachwuchszentrums (§5.2).
11. Dein Verein baut nicht von selbst, `stadion` bleibt ohne Automatik (§5.2).

## Quellen

- Stehplätze und Eigentum (abgerufen 21.11.2026): [Sport1, Stehplätze der Bundesliga](https://www.sport1.de/news/fussball/bundesliga/2022/01/bundesliga-stehplatze-bvb-hat-die-meisten), [Stuttgarter Zeitung, Cannstatter Kurve](https://www.stuttgarter-zeitung.de/sport/vfb-stuttgart/vfb-stuttgart-8268-stehplaetze-wo-die-cannstatter-kurve-im-ligavergleich-liegt-78891019.html), [KIT, Eigentümer-Betreiber-Modelle](https://publikationen.bibliothek.kit.edu/1000120963/82115628), [Bund der Steuerzahler, Stadien](https://steuerzahler.de/aktuelles/detail/fussball-das-problem-mit-den-stadien)
- Baukosten je Sitzplatz (abgerufen 21.11.2026): [t-online, Stadion der Zukunft](https://www.t-online.de/sport/fussball/id_89133096/star-architekten-ueber-stadion-der-zukunft-zeit-der-ballerbuden-ist-vorbei-.html), [Stuttgarter Zeitung, Umbau für die EM 2024](https://www.stuttgarter-zeitung.de/lokales/stuttgart/stadionumbau-fuer-em-2024-deutlich-teurer-was-die-kostenexplosion-fuer-den-vfb-bedeutet-78984534.html)
- Stadionbaukasten, Spott über kleine Ausbauten: `konzepte/_recherche-genre.md`, Abschnitte 4 und 4b
- Platzwart: PLAN §4 (GameStar 4/2000)
