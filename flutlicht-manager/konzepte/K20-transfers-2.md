# K20 – Transfers II: Abwerben, Bieterwettstreit, Deadline Day

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12. **Teilweise umgesetzt mit U15 (20. November 2026, §5.4), noch ohne Testlauf.**
Hängt ab von: K19 (Transfers I), K17 (Beziehungen), K22 (Berater), K29 (Presse) · Wird gebraucht von: K30, K31.

## 1. Ziel und Spielgefühl

- **Abwerben ist erlaubt, aber riskant:** Treffen am Verein vorbei, über Wochen, mit dem Risiko, dass es herauskommt.
- **Keine festen Strafen** (PLAN §2, Konsistenzprüfung A4): Fliegt es auf, leidet die Beziehung zum anderen Verein, es gibt Klatsch und Tratsch, und das wirkt auf Spieler, manchmal positiv, öfter negativ.
- **Bieterwettstreit und Deadline Day** als spannende Momente des Transfermarkts.

## 2. Vorbilder und Abgrenzung

- **Rohmaterial 12.3 und 12.4:** geheime Treffen, Risiko des Auffliegens, Wechselbereitschaft steigt, Deadline Day. Übernommen, **ohne** Beschwerde beim Verband und ohne Geldstrafe (überholt durch PLAN §2).
- **Community-Wunsch:** Abwerben über Berater und Spieler, bevor man mit dem Verein redet. Loyale Spieler petzen bei ihrem Verein (Recherche 4b). Übernommen.

## 3. Begriffe und Daten

| Begriff | Bedeutung | Ort |
|---|---|---|
| Treffen | geheimes Gespräch mit Spieler und Berater, höchstens eins pro Woche je Spieler | `S.abwerben` |
| Wechselbereitschaft | 0–100, wie sehr der Spieler zu dir will | je Abwerbe-Vorgang |
| Ort | Hotel in einer anderen Stadt, Restaurant, Vereinsgelände des Beraters | Auswahl beim Treffen |
| Bieterwettstreit | mehrere Vereine bieten für denselben Spieler | Verhandlung aus K19 mit Konkurrenz |
| Deadline Day | die letzten drei Tage eines Fensters | Kalender |

## 4. Abläufe

### 4.1 Abwerben

1. **Kontakt** über den Berater (K22) oder direkt.
2. **Treffen** wöchentlich, Kosten 5.000–20.000 € (Spesen, Beraterhonorar).
3. Jedes Treffen hebt die **Wechselbereitschaft** (5.1) und birgt das Risiko des **Auffliegens** (5.2).
4. **Ab 70 Bereitschaft:** Der Spieler bittet bei seinem Verein um den Wechsel (Wechselwunsch Stufe 3, K14). Sein Verein senkt den Preis um 10 % oder setzt ihn auf die Liste. Dann normaler Transfer nach K19.
5. **Fliegt es auf:** Folgen nach 5.3.

### 4.2 Bieterwettstreit

- Bieten zwei oder mehr Vereine, informiert der Verkäufer alle über das höchste Angebot (ohne Namen) und gibt eine Frist von 2 Tagen.
- Jeder darf einmal erhöhen. Danach entscheidet der Verkäufer nach Geld, der Spieler nach Interesse (K19 §5.3). Der Spieler kann das höchste Angebot ablehnen.
- Gierige Berater (K22) heizen den Wettstreit an.

### 4.3 Deadline Day

- In den letzten drei Tagen eines Fensters: Vereine mit offenem Bedarf senken ihre Ansprüche (K31), Verkäufer mit Überhang auch. **Angebote ×1,5 häufiger, Preise schwanken stärker** (±15 %).
- Antworten kommen am selben Tag statt nach 1–3 Tagen.
- Eigener Halt am letzten Tag (Info mit Übersicht der offenen Verhandlungen), abschaltbar.

## 5. Regeln und Formeln

### 5.1 Wechselbereitschaft

```
je Treffen + (10 + Interesse/10) × Berater × Stimmung beim alten Verein
```

- **Interesse** aus K19 §5.3. Berater: verschwiegen ×1, seriös ×1, gierig ×1,2.
- **Stimmung** beim alten Verein (K14): unter 40 ×1,3, über 70 ×0,7.
- **Loyale Spieler** (vereinstreu) steigen kaum (×0,4) und **petzen** mit 30 % je Treffen bei ihrem Verein (dann wie Auffliegen).

### 5.2 Auffliegen

```
Risiko je Treffen = 8 % × Bekanntheit × Berater × Ort × (1 + 0,2 × bisherige Treffen)
```

- **Bekanntheit:** Stärke über 80 ×1,5, Nationalspieler ×1,3.
- **Berater:** verschwiegen ×0,4, seriös ×1, gierig ×1,5 (er will, dass es bekannt wird).
- **Ort:** Hotel in einer anderen Stadt ×0,6, Restaurant ×1,2, beim Berater ×0,8.

### 5.3 Folgen des Auffliegens

| Wer | Folge |
|---|---|
| abgebender Verein | Beziehung −15 bis −30 (K17). Unter −50 verhandelt er für den Rest der Saison oft gar nicht (50 %). Ablöseforderung +15 %. |
| Spieler | Ungnade beim Verein: Stimmung −10 (K14). Kann dir nützen: Er drängt auf den Wechsel, der Preis sinkt eventuell. |
| Presse | Gerücht (K29), Klatsch über deinen Verein (K17 §5.3) |
| dein Vorstand | Vertrauen −3, bei Traditionsvereinen −6 (K28) |
| deine Fans | je nach Rivalität: gegen den Derby-Rivalen sogar +3 (K27) |

Keine Geldstrafe, kein Verbandsverfahren.

### 5.4 Umsetzung U15 (20.11.2026)

**Abwerben (§4.1, §5.1 bis §5.3):**

- **Wer:** Spieler deutscher Computer-Vereine (nicht aus dem Auslandspool, nicht vereinslos, nicht verliehen). Auf der Spielerkarte die Karte „Heimlich treffen“. Lizenz-Bereich `abwerben` ab der A-Lizenz, ohne Automatik (dein Verein wirbt nie von selbst ab).
- **Treffen:** höchstens eins je Woche und Spieler. Orte mit Kosten: Hotel in einer anderen Stadt 15.000 €, Restaurant 5.000 €, beim Berater 10.000 € (nur mit Berater). Gebucht unter „Abwerben“.
- **Wechselbereitschaft je Treffen:** (10 + Interesse/10) × Berater × Stimmung × treu. Interesse aus K19 §5.3 (`wechselInteresse`), begrenzt auf −50 bis 100. Berater: gierig und Strippenzieher ×1,2, sonst ×1. Stimmung beim alten Verein unter 40 ×1,3, über 70 ×0,7. Vereinstreue Spieler ×0,4.
- **Auffliegen je Treffen:** 8 % × Bekanntheit (Stärke über 80 ×1,5) × Berater (verschwiegen 0,4, Familie 0,8, seriös 1, Strippenzieher 1,2, gierig 1,5, ohne Berater 1,1) × Ort (Hotel 0,6, Restaurant 1,2, Berater 0,8) × (1 + 0,2 × bisherige Treffen). Vereinstreue petzen zusätzlich mit 30 %. Nationalspieler (×1,3) fehlen, das Spiel kennt keine Nationalmannschaft.
- **Ab 70 Bereitschaft:** Er bittet offiziell um den Wechsel (Wechselwunsch Stufe 3, K14, Ablöse −10 %) und sein Verein setzt ihn auf die Transferliste. Danach der normale Kauf nach K19.
- **Aufgeflogen:** Beziehung zu seinem Verein −15 bis −30 (K17), Ablöseforderung dieses Vereins für ihn +15 % bis zum Saisonende, seine Stimmung −10, Vertrauen deines Vorstands −3. Für diesen Spieler ist das Abwerben in dieser Saison vorbei. Fans (K27) und Presse (K29) fehlen noch, es gibt eine Meldung.
- **Zufall:** im Grundstrom, weil es deine Handlung ist (wie bei K17).

**Deadline Day (§4.3):**

- Die letzten drei Tage eines Fensters. Im Büro eine Übersicht: offene Verhandlungen, Angebote für deine Spieler, Lücken im Kader.
- **Halt am letzten Tag** („Deadline Day“), abschaltbar im Menü bei den Erinnerungen.
- **Computer-Vereine:** am letzten Tag ein zusätzlicher Markttag (eigener Strom `deadline`). Die Obergrenzen je Fenster gelten weiter.
- **Seit K20b (22.11.2026, popolupo, ohne Testlauf):** In den letzten drei Tagen schwankt die Forderung deutscher Computer-Vereine an dich um bis zu ±15 %, fest je Spieler und Tag (eigener Strom `deadlinePreis`). Spieler auf ihrer Transferliste kosten 10 % weniger (höchstens −25 %). Angebote für deine Spieler auf der Transferliste kommen 1,5-mal so oft. Antworten kommen schon seit U10a sofort.

**Bieterrunde (§4.2), nur wenn du verkaufst:**

- Bieten zwei oder mehr Vereine für denselben deiner Spieler, kannst du einmal je Fenster und Spieler eine Bieterrunde ausrufen.
- Jeder Bieter erfährt das höchste Gebot und darf einmal erhöhen, der niedrigste zuerst: auf 2 bis 10 % über das Höchstgebot, höchstens bis zu seiner Grenze. Ist ein gieriger Berater dabei, 5 % mehr. Alle Angebote gelten danach noch mindestens 2 Tage.
- **Noch nicht:** Bieterwettstreit, wenn du kaufst (Computer-Vereine bieten gegen dich), und das Recht des Spielers, das höchste Angebot abzulehnen.

**K20c: Bieterwettstreit beim Kauf (22.11.2026, popolupo, vorläufig, gebaut ohne Testlauf, `konkurrenzKauf` und `konkurrenzTag` in `js/transfers.js`):**
- **Wann:** Sagt ein deutscher Verein im offenen Fenster Ja zu deiner Ablöse, prüft er einmal je Spieler und Saison, ob ein anderer Verein mitbietet (eigener Strom). Nicht beim Vorvertrag, nicht bei Auslandsvereinen, nicht außerhalb des Fensters.
- **Wer bietet mit:** ein Computer-Verein mit Bedarf auf der Position (wie beim Kauf unter Computer-Vereinen, K31), genug Geld, Platz im Gehaltsrahmen (K23d) und einer Beziehung zum Verkäufer, die Gespräche erlaubt (K17). Chance 25 %, wenn es einen gibt.
- **Sein Gebot:** deine Ablöse plus 2 bis 10 % (gieriger Berater des Spielers: 5 % mehr), höchstens sein Vereinswert für den Spieler (`kiZahlt`).
- **Dann:** Der Verkäufer nennt dir das Gebot (ohne Namen) und gibt dir 2 Tage. Bietest du mindestens so viel, steht die Einigung mit dir, der Rest läuft wie bisher (Vertrag mit dem Spieler, K21). Sonst wechselt der Spieler nach Ablauf der Frist zum anderen Verein (`kiWechsel`), sofern das Fenster noch offen ist.
- **Der Spieler** entscheidet danach wie bisher über deinen Vertrag (K21). Ein eigenes Nein zum Höchstbietenden kommt später.
- **Gleichschritt:** nur nach deinem Angebot, die Automatik kauft nach den Regeln der Computer-Vereine und trifft nie auf diesen Ablauf.
- **Beim Bau ergänzt:** kein Mitbieter für ausgeliehene Spieler. Solange das Gegenangebot gilt, ist die Forderung mindestens das Gebot, ein kleineres Angebot bringt nur den Hinweis darauf (keine Verhandlungsrunde). Gehst du mit, zieht der andere zurück.

**Später:** Computer-Vereine werben deine Spieler ab (§7), Klugheit beim Abwerben (K02).

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| abwerben | Spieler billiger oder überhaupt erreichbar | Beziehung, Klatsch, Vorstand |
| verschwiegener Berater, sicherer Ort | weniger Risiko | Kosten |
| Bieterwettstreit mitgehen | Wunschspieler | teurer |
| Deadline Day nutzen | Schnäppchen, schnelle Lücken | hektisch, Fehlkäufe ohne Scouting |

## 7. Verhalten der Computer-Vereine

- Auch sie werben ab, auch deine Spieler. Fliegt es auf, bekommst du eine Meldung und eine Entscheidung: Spieler zur Rede stellen (K15), Preis erhöhen, öffentlich machen (Presse, Beziehung zu ihnen −).
- Klugheit (K02): clevere Vereine wählen sichere Orte und verschwiegene Berater.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Abwerbeversuch aufgeflogen | 5.2 | 5.3 |
| Dein Spieler wird umworben (Entscheidung) | Computer-Verein wirbt ab, fliegt auf | zur Rede stellen, Preis erhöhen, öffentlich machen |
| Der Spieler petzt | loyaler Spieler | wie aufgeflogen |
| Deadline-Day-Krimi | Angebot in den letzten Stunden | Entscheidung mit kurzer Frist |
| Der lachende Dritte | Kette aus K30 §8.3 | Variante „Treffen“ jetzt möglich |

## 9. Wechselwirkungen

K14 (Wechselwunsch, Stimmung), K15 (zur Rede stellen), K17 (Beziehung, Klatsch), K19 (Transfer nach erfolgreichem Abwerben), K22 (Berater), K27 (Fans), K28 (Vorstand), K29 (Gerüchte), K30 (lachender Dritter), K31 (Bedarf am Deadline Day).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Risiko spürbar | bei vier Treffen mit einem bekannten Spieler und gierigem Berater fliegt es in mehr als der Hälfte der Fälle auf |
| Lohnt manchmal | erfolgreich abgeworbene Spieler kosten im Schnitt 10–20 % weniger als über den normalen Weg |
| Deadline Day | in den letzten drei Tagen etwa ein Viertel aller Wechsel eines Fensters (prüfen) |
| Keine Strafen | Abwerben erzeugt nie eine Geldstrafe oder ein Verfahren |

## 11. Stellschrauben

```js
abwerben:{
  kosten:[5000,20000],treffenProWoche:1,
  bereitschaft:{basis:10,jeInteresse:0.1,berater:{gierig:1.2},stimmung:[[40,1.3],[70,0.7]],treu:0.4,petzen:0.3,ab:70,preis:0.9},
  risiko:{basis:0.08,bekannt:1.5,national:1.3,berater:{verschwiegen:0.4,serioes:1,gierig:1.5},ort:{hotel:0.6,restaurant:1.2,berater:0.8},jeTreffen:0.2},
  folgen:{beziehung:[-15,-30],sperreUnter:-50,sperre:0.5,forderung:1.15,stimmung:-10,vorstand:-3,tradition:-6,derbyFans:3},
  bieter:{frist:2,erhoehen:1},
  deadline:{tage:3,angebote:1.5,schwankung:0.15,haltLetzterTag:true}
}
```

## 12. Offene Fragen

**Vorläufig entschieden:** keine Strafen, Wechselbereitschaft ab 70 führt zum Wechselwunsch, Computer-Vereine werben auch ab, Deadline Day mit eigenem Halt am letzten Tag.

**Noch zu recherchieren:** Anteil der Wechsel in den letzten Tagen eines Fensters. Am 20.11.2026 gesucht, keine Zahl gefunden. Die Berichte sagen nur, dass die großen Wechsel meist vorher fertig sind und am letzten Tag viele kleinere kommen (Quellen unten).

**Vorläufig entschieden mit U15 (20.11.2026, von mir, weil „entscheide du“):**

1. Abwerben nur bei deutschen Computer-Vereinen, ab der A-Lizenz, ohne Automatik (§5.4).
2. Feste Kosten je Ort statt einer Spanne (§5.4).
3. Bereitschaft und Risiko mit den Formeln aus §5.1 und §5.2, Berater-Profile aus K22 zugeordnet (Strippenzieher wie gierig, Familie vorsichtig), ohne Berater etwas riskanter (§5.4).
4. Aufgeflogen: Ablöse +15 % bis zum Saisonende, Abwerben dieses Spielers für die Saison vorbei (§5.4).
5. Deadline Day mit Übersicht, Halt am letzten Tag und einem zusätzlichen Markttag der Computer-Vereine. Ohne Preisschwankung (§5.4).
6. Bieterrunde nur beim Verkauf, einmal je Fenster und Spieler (§5.4).
7. Computer-Vereine werben noch nicht ab (§7 kommt später).

## Quellen

- Abwerben ohne feste Strafen, Klatsch und Tratsch: PLAN §2
- Treffen, Risiko, Deadline Day: `konzepte/_rohmaterial-logik-v1.md`, Abschnitte 12.3, 12.4
- Abwerben über Berater, loyale Spieler petzen: `konzepte/_recherche-genre.md`, Abschnitt 4b
- Deadline Day 2024: die großen Wechsel vorher, am letzten Tag vor allem Leipzig und Dortmund aktiv: https://www.zdfheute.de/sport/fussball-deadline-day-transfers-100.html (Suche vom 20.11.2026)
- Sommerfenster 2025 vom 1. Juli bis 1. September (dazu 1. bis 10. Juni): https://www.bundesliga.com/en/bundesliga/news/official-bundesliga-transfer-centre-summer-2025-32088
- Deadline Day 2026, Abschlüsse in den letzten Minuten: https://fussballdaten.de/news/bundesliga-deadline-day-2026-alle-offiziellen-transfers-ueberblick/
