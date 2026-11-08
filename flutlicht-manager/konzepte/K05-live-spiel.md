# K05 – Live-Spiel

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K04 (Engine), K06 (Taktik), K02 (Zufallsströme) · Wird gebraucht von: K14, K15, K16, K29, K35b.

**Umsetzungshinweise (U4a, 8. November 2026):** Die Engine ist ein Zustand, der Minute für Minute läuft (`spielAnlegen` in `js/engine.js`, `sim()` spielt ihn ohne Eingriffe durch). Gebaut sind Bank (9), Wechselregeln, Taktik im Spiel mit Umstellungszeit, Zurufe an Mannschaft und Spieler, Halbzeitansprache und der Computer-Trainer aus 5.5, alle Werte in `REGELN.live`. Getestet mit `tests/live.js` (Abschnitt 10). Die Ansicht folgt in U4b, Konferenz nach Anstoßzeit und Fortsetzen nach Neuladen in U4c. Abweichungen in §12 unter U4a.

## 1. Ziel und Spielgefühl

- **Der Spieltag ist der Höhepunkt der Woche.** Dein Spiel läuft live, Minute für Minute, mit Anzeigetafel, Ticker und Konferenz.
- **Eingreifen lohnt sich:** Wechsel, Taktik und Zurufe ändern ab diesem Moment, was passiert. Es gibt kein Ergebnis, das vorher feststeht (K04 §4).
- **Tempo nach Wunsch:** live mit Pausen bei wichtigen Momenten, schnell durchlaufen oder sofort berechnen. Tempo ist eine Qualität (Recherche 4d).
- **Kleine Momente mit Wirkung:** Halbzeitansprache, Zuruf an einen Spieler, „Zeit schinden“ in der Nachspielzeit, das Elfmeterschießen Schuss für Schuss.

## 2. Vorbilder und Abgrenzung

- **Anstoss:** Textticker mit Humor, Konferenz am Samstag. Übernommen.
- **We Are Football:** Halbzeitansprache, auch augenzwinkernd (Recherche 3.2). Übernommen als zusätzliche Tonlage.
- **Football Manager:** Zurufe von der Seitenlinie wurden in FM26 vermisst (Recherche 4b). Bei uns gibt es sie, mit Abnutzung.
- **Bewusst anders:** keine 2D- oder 3D-Darstellung. Eine **Druckleiste** zeigt, wer gerade drückt, ein kleines Spielfeld zeigt Aufstellung, Frische und Noten-Tendenz.

## 3. Begriffe und Daten

### 3.1 Ansicht

| Teil | Inhalt |
|---|---|
| Anzeigetafel | Spielstand, Minute, Nachspielzeit, Karten |
| Ticker | Ereignisse aus K04 mit Text, wichtige hervorgehoben |
| Druckleiste | Ballbesitz und Chancen der letzten 5 Minuten als Balken |
| Spielfeld | eigene Aufstellung mit Frische-Balken und Noten-Tendenz je Spieler |
| Statistik | Torschüsse, aufs Tor, Großchancen, Ecken, Fouls, Ballbesitz |
| Konferenz | die anderen Spiele mit derselben Anstoßzeit, live mit Toren und Karten, dazu die Tabelle „im Moment“ |

### 3.2 Regeln für Wechsel

- **5 Wechsel** in höchstens **3 Gelegenheiten** während des Spiels. Wechsel in der Halbzeitpause zählen nicht als Gelegenheit. So gilt es in der Bundesliga dauerhaft seit 2022 (Quellen).
- **Verlängerung:** ein zusätzlicher Wechsel (Regel für den DFB-Pokal prüfen).
- **Gehirnerschütterung:** Das IFAB erlaubt seit Juli 2024 zusätzliche dauerhafte Wechsel bei Gehirnerschütterung, die Wettbewerbe entscheiden selbst. Für die Bundesliga habe ich keine Einführung gefunden. 2021 hatte die DFL sie wegen der fünf Wechsel abgelehnt. Vorläufig **nicht** aktiv, als Stellschraube vorhanden.
- **Bank:** 9 Auswechselspieler (Zahl prüfen).

### 3.3 Spielstand während des Spiels

- `S.live`: Minute, Stand, Ereignisse, Wechsel und Gelegenheiten, aktuelle Taktik, letzte Zurufe, Druckleiste.
- Wird bei jeder Pause gespeichert. Wer den Browser schließt, macht an derselben Stelle weiter. Weil die Würfe je Minute fest sind (K02), ist das Ergebnis danach dasselbe, als hätte man durchgespielt.

## 4. Abläufe

1. **Vor dem Anpfiff:** Aufstellung, Taktik, Schützen (K06). Vorschau mit Tauziehen (K35a). Wahl: **live**, **schnell** oder **sofort berechnen**.
2. **Live:** Minute für Minute. Tempo: langsam (2 s je Minute), normal (1 s), schnell (0,3 s), „bis zur Halbzeit“ oder „bis zum Ende“ (sofort).
3. **Automatisches Anhalten** (jede Art abschaltbar):
   - Tor, für beide Seiten
   - Rote Karte, Gelb-Rot
   - Verletzung eines eigenen Spielers
   - Elfmeter für oder gegen dich, vor der Ausführung (Schütze ändern möglich)
   - eigener Spieler mit Gelb und hohem Foulrisiko („Gelb-Rot-Gefahr“)
   - eigener Spieler unter 55 % Frische
4. **Halbzeit:** Statistik, Einschätzung des Co-Trainers („Ihr Linksverteidiger ist überfordert“, Genauigkeit nach K16), Ansprache, Wechsel und Umstellungen.
5. **Nachspielzeit:** angezeigt wie im Stadion. „Zeit schinden“ verlängert sie um bis zu eine Minute.
6. **K.-o.-Spiele:** Verlängerung, dann Elfmeterschießen live, Schuss für Schuss, in deiner Reihenfolge (K06).
7. **Abpfiff:** Spielbericht mit Gründen (K04 §5.10), Noten, Statistik. Später Pressestimmen (K29).
8. **Sofort berechnen:** Der Co-Trainer trifft die Entscheidungen im Spiel (Automatik, K16). Ergebnis und Bericht erscheinen direkt.

### 4.1 Konferenz

- **Samstag 15:30** und jede andere Anstoßzeit mit mehreren Spielen: Die anderen Spiele werden vorab berechnet (niemand greift ein) und Minute für Minute mit deinem Spiel aufgedeckt. „Tor in Bochum!“ blinkt auf, die Tabelle „im Moment“ ändert sich.
- **Nur gleiche Anstoßzeit.** Heute laufen auch Spiele mit anderer Anstoßzeit desselben Tages parallel mit (Konsistenzprüfung I6). Künftig gilt: Spiele, die vor deinem liegen, kannst du **vorher als Zuschauer** in der Konferenz verfolgen (schnell, abschaltbar). Spiele nach deinem siehst du im Tagesergebnis.
- **Letzter Spieltag:** alle Spiele zeitgleich (PLAN §2), also eine große Konferenz mit Tabelle im Moment, auch für Abstieg und Relegation.

## 5. Regeln und Formeln

### 5.1 Eingriffe und ihre Wirkung

| Eingriff | Wirkung | Zeit bis zur vollen Wirkung |
|---|---|---|
| Wechsel | neuer Spieler mit seiner Frische, Teamwerte neu (K04) | sofort |
| Grundordnung, Rollen | neue Teamwerte, Vertrautheit der neuen Ordnung (K06) | 5 Minuten |
| Spielstil | Multiplikatoren aus K06 §5.1, Kreislauf neu | 5 Minuten |
| Ausrichtung, Einsatz | K06 §5.5, K04 | 2 Minuten |
| Zuruf an die Mannschaft | 5.2 | sofort, 10 Minuten lang |
| Zuruf an einen Spieler | 5.3 | sofort |

### 5.2 Zurufe an die Mannschaft

| Zuruf | Wirkung 10 Minuten lang | Preis |
|---|---|---|
| „Druck machen!“ | Angriffe ×1,08 | Abwehr ×0,97, Frische ×1,2 |
| „Ruhe bewahren!“ | Abwehr ×1,03, weniger Fouls | Angriffe ×0,95 |
| „Konzentration!“ | Patzer und Fehlpässe ×0,7 | – |
| „Zeit schinden!“ (nur bei Führung) | Angriffe beider Teams ×0,8, Nachspielzeit +1 | Gelbe Karten für Zeitspiel ×3 |

**Abnutzung:** Derselbe Zuruf innerhalb von 15 Minuten wirkt nur halb, ein drittes Mal gar nicht mehr.

### 5.3 Zurufe an einen Spieler

- **Loben** oder **kritisieren**. Wirkung auf sein Selbstvertrauen ±0,3 und 10 Minuten lang auf seine Wirkung ±2 %.
- **Je nach Charakter** (K03): Kämpfer reagieren auf Kritik oft positiv, Diven und Nervenschwache negativ, Hitzköpfe mit mehr Fouls. Die genaue Tabelle gehört zu K15. Bis dahin gilt sie in dieser vereinfachten Form.

### 5.4 Halbzeitansprache

| Ansprache | passt bei | Wirkung in Welle 2 |
|---|---|---|
| loben | Führung, gutes Spiel | Selbstvertrauen +0,3 |
| motivieren | knappes Spiel, Rückstand | Wirkung 2. Halbzeit +2 % |
| fordern | Rückstand, schwaches Spiel | Wirkung +3 % bei Kämpfern, −2 % bei Nervenschwachen und Diven |
| beruhigen | Führung gegen starken Gegner, viele Karten | Fouls ×0,8, Patzer ×0,8 |
| Taktik betonen | Umstellung | neue Taktik wirkt sofort voll statt nach 5 Minuten |
| schweigen | – | nichts, aber keine Abnutzung |
| augenzwinkernd | jederzeit | wie motivieren, halbe Stärke, Stimmung (K14) etwas besser, eigene Texte |

- **Passt sie nicht zur Lage** (zum Beispiel loben bei 0:3), kehrt sich die Wirkung halb um.
- **Abnutzung:** Dieselbe Ansprache in drei Spielen hintereinander wirkt nur noch halb.
- Stimmung und Glaubwürdigkeit kommen mit K14 und K15 dazu (Konsistenzprüfung C3, D2: K05 regelt Ablauf und Zeitpunkt, K15 die Wirkung).

### 5.5 Computer-Trainer im Spiel

- **Wechsel:** müde Spieler (Frische unter 65 %) zwischen der 55. und 80. Minute, verletzte sofort, Spieler mit Gelb und Gelb-Rot-Gefahr nach Lage. Im Schnitt 4–5 Wechsel pro Spiel (prüfen).
- **Taktik nach Spielstand:** bei Rückstand ab der 60. Minute offensiver, ab der 80. „sehr offensiv“. Bei Führung ab der 75. defensiver, in der Nachspielzeit „Zeit schinden“.
- **Klugheit** (K02): „clever“ reagiert früher und passender, „gemütlich“ später und mit mehr Zufall.
- Dieselben Regeln gelten für deinen Co-Trainer, wenn du „sofort berechnen“ wählst. Seine Qualität kommt aus K16.

### 5.6 Druckleiste

Anteil Ballbesitz der letzten 5 Minuten, gewichtet mit Chancen (Großchance ×3, Halbchance ×1, Ecke ×0,5). Reine Anzeige, ohne Wirkung. Sie macht sichtbar, ob ein Eingriff etwas bewirkt.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| live zuschauen | eingreifen, Momente erleben | Zeit |
| sofort berechnen | schnell | der Co-Trainer entscheidet |
| Wechsel | frische Beine, Joker, Reaktion auf Karten | Gelegenheiten begrenzt |
| Taktik ändern | Antwort auf den Spielverlauf | Umstellungszeit, Vertrautheit |
| Zurufe | kurze Schübe | Abnutzung, Nebenwirkungen |
| Halbzeitansprache | Selbstvertrauen, 2. Halbzeit | passt sie nicht, schadet sie |
| Zeit schinden | Führung über die Zeit bringen | Karten, längere Nachspielzeit |

## 7. Verhalten der Computer-Vereine

Siehe 5.5. In der Konferenz und bei Spielen ohne dich laufen beide Computer-Trainer nach diesen Regeln, vorab berechnet.

## 8. Ereignisse

| Meldung | Auslöser | Folge |
|---|---|---|
| Joker sticht | Eingewechselter trifft | Info, Selbstvertrauen, Lernen „Joker“ (K03) |
| Ansprache wirkt | 2. Halbzeit deutlich besser als die erste nach „fordern“ | Spielbericht erwähnt es, Glaubwürdigkeit (K15) |
| Spieler verweigert den Handschlag | früh ausgewechselter Spieler mit hohem Ehrgeiz (Diva) | Stimmung (K14), Presse (K29) |
| Last-Minute-Drama | Tor in der Nachspielzeit, das ein Spiel entscheidet | Ticker hervorgehoben, Presse |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K02 Zufall | feste Würfe je Minute, Weiterspielen nach Neuladen ohne Unterschied |
| K03 Spieler | Selbstvertrauen, Frische, Charakter für Zurufe und Ansprache |
| K04 Engine | rechnet jede Minute, nimmt Eingriffe auf, liefert Ticker, Statistik, Bericht |
| K06 Taktik | Änderungen im Spiel, Umstellungszeit |
| K10 Medizin | Verletzungswechsel |
| K13 Wettbewerbe | Verlängerung, Elfmeterschießen, zusätzlicher Wechsel |
| K14, K15 | Stimmung und Glaubwürdigkeit aus Ansprache und Zurufen |
| K16 Stab | Einschätzung zur Halbzeit, Automatik beim Sofort-Berechnen |
| K29 Presse | Pressestimmen nach dem Spiel |
| K35a, K35b | Ansicht, Retro-Look der Anzeigetafel |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Dauer live (normal) | 3–5 Minuten Echtzeit je Spiel einschließlich der Pausen |
| Automatische Halte | im Schnitt 3–6 pro Spiel bei Standardeinstellung |
| Eingriff wirkt | Mit gemeinsamen Zufallszahlen: Bei 0:1 in der 70. Minute steigt die Chance auf mindestens einen Punkt durch „sehr offensiv“ um 3–8 Prozentpunkte, die Gefahr eines zweiten Gegentors ebenfalls |
| Zurufe begrenzt | Dauerndes Rufen bringt über eine Saison höchstens 1 Punkt mehr als nie zu rufen |
| Ansprache begrenzt | passende Ansprache gegenüber „schweigen“: höchstens +0,05 Punkte je Spiel im Schnitt |
| Computer-Wechsel | im Schnitt 4–5 pro Spiel, die meisten zwischen der 55. und 85. Minute (prüfen) |
| Neuladen | Weiterspielen nach Neuladen ergibt dasselbe Ergebnis wie Durchspielen (K02) |
| Konferenz | nur Spiele derselben Anstoßzeit laufen parallel |

## 11. Stellschrauben

```js
live:{
  tempo:{langsam:2000,normal:1000,schnell:300},          // Millisekunden je Spielminute
  anhalten:{tor:true,rot:true,verletzung:true,elfmeter:true,gelbRotGefahr:true,frischeUnter:55},
  wechsel:{anzahl:5,gelegenheiten:3,halbzeitZaehlt:false,verlaengerung:1,gehirnerschuetterung:0,bank:9},
  umstellung:{ordnung:5,stil:5,ausrichtung:2},
  zurufe:{dauer:10,abnutzungMinuten:15,druck:{angriff:1.08,abwehr:0.97,frische:1.2},ruhe:{abwehr:1.03,angriff:0.95,fouls:0.85},
    konzentration:{patzer:0.7},zeit:{angriffe:0.8,nachspiel:1,gelb:3},spieler:{sv:0.3,wirkung:0.02}},
  ansprache:{loben:{sv:0.3},motivieren:{wirkung:0.02},fordern:{kaempfer:0.03,empfindlich:-0.02},beruhigen:{fouls:0.8,patzer:0.8},
    augenzwinkernd:{wirkung:0.01},unpassend:-0.5,abnutzungSpiele:3},
  ki:{muedeUnter:65,wechselVon:55,wechselBis:80,rueckstandAb:60,alleNachVorn:80,fuehrungAb:75},
  druckleiste:{minuten:5,gross:3,halb:1,ecke:0.5}
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Konferenz nur bei gleicher Anstoßzeit,** frühere Spiele des Tages optional als Zuschauer vorher (löst I6).
2. **Kein Wechsel für Gehirnerschütterung** in der Bundesliga, bis eine Einführung belegt ist. Stellschraube vorhanden.
3. **Augenzwinkernde Ansprache** als eigene Tonlage mit halber Wirkung, aber besserer Stimmung (We-Are-Football-Idee, eigene Texte).
4. **Live-Stand wird bei jeder Pause gespeichert.**

**Vorläufig entschieden bei der Umsetzung (U4a):**
5. **Keine Nachspielzeit** als eigene Minuten. Die Anzeige kann sie später zeigen, gespielt werden 90 (bzw. 120) Minuten. „Zeit schinden“ wirkt deshalb nur über weniger Angriffe und Gelbe Karten.
6. **In der Halbzeit** wirken Ausrichtung und Einsatz sofort, die Grundordnung nach 5 Minuten, mit „Taktik betonen“ ebenfalls sofort.
7. **„Sehr offensiv“ und „offensiv“ greifen auch öfter an** (×1,10 bzw. ×1,05, defensiv entsprechend seltener), nicht nur gefährlicher. Sonst brachte „alles nach vorn“ bei 0:1 in der 70. Minute nur 2 Prozentpunkte mehr Punktchance (Ziel 3–8), jetzt etwa 5.
8. **Computer-Trainer** wechselt im Fenster 55.–86. Minute mit 13 % je Minute bis zu zwei Spieler je Gelegenheit: zuerst Verletzte (sofort), dann Müde (Frische unter 65 %), Spieler mit Gelb, und frische Beine (Frische unter 93 %), aber nur, wenn der Ersatz höchstens 6 Punkte schlechter ist als der müde Spieler auf dem Platz. Ergebnis: 4,3–4,5 Wechsel je Team, 98 % zwischen der 55. und 85. Minute. Die Bundesliga lag 2023/24 bei etwa 9,1 Wechseln je Spiel, also gut 4,5 je Team (The Analyst, Stand März 2024).
9. **Verletzte humpeln** bis zum Wechsel weiter (Frische höchstens 30 %). Ohne freien Wechsel spielen sie verletzt zu Ende.
10. **Zuruf an einen Spieler** (bis K15): Lob +2 % für 10 Minuten und Selbstvertrauen +0,3. Kritik: Kämpfer +3 %, Diva oder nervenschwach −2 % und Selbstvertrauen −0,3, Hitzkopf +1 % und 50 % mehr Fouls, alle anderen +1 % und Selbstvertrauen −0,15.
11. **Kurzeinsätze unter 20 Minuten** bekommen keine Note und ändern die Form nicht, zählen aber als Einsatz und für die Spielpraxis.

**Noch zu recherchieren:** Größe der Ersatzbank in der Bundesliga, zusätzlicher Wechsel in der Verlängerung im DFB-Pokal.

## Quellen

- Fünf Wechsel in drei Gelegenheiten plus Halbzeit, dauerhaft: [bundesliga.com, Neu in der Saison 2022/23](https://www.bundesliga.com/de/bundesliga/news/neu-saison-2022-23-regeln-auswechslungen-spielabsetzungen-transferperiode-20452), [ligainsider.de](https://www.ligainsider.de/bundesliga_1008/ohne-zeitliche-begrenzung-dfl-haelt-an-fuenf-wechseln-fest-321433/)
- Wechsel je Spiel: [The Analyst, Substitute trends across Europe's top five leagues (März 2024)](https://theanalyst.com/articles/how-substitute-trends-compare-across-europe-top-five-leagues)
- Gehirnerschütterungs-Wechsel: [IFAB, Concussion Substitutes](https://theifab.com/trials/concussion-substitutes), [Last Word on Sports, Bundesliga 2021](https://lastwordonsports.com/football/2021/02/25/bundesliga-concussion-substitutes-will-not-be-allowed-whilst-clubs-can-have-five-replacements/)
- Ticker, Konferenz, Halbzeitansprache, Zurufe: `konzepte/_recherche-genre.md`, Abschnitte 2.2, 3.2, 4b; `konzepte/_rohmaterial-logik-v1.md`, Kapitel 8
