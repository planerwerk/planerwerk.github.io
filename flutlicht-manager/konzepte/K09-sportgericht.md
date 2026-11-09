# K09 – Disziplin und Sportgericht

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K04 (Fouls), K01 (Kalender, Fristen) · Wird gebraucht von: K05, K10, K13, K27, K29, K34.

**Umsetzungshinweise (U7a, 9. November 2026):** Gebaut sind Foularten mit Kartenquoten, Meckern und Tätlichkeiten in der Engine, ein Schiedsrichter-Pool mit Strenge und Elfmeterneigung, Sperren getrennt nach Liga und Pokal sowie das Sportgericht nach Roter Karte (Antrag, Frist, Einspruch, Urteil) mit Wiederholungstätern. Code in `js/disziplin.js`, Werte in `REGELN.disziplin`. Das Sportgericht steht im Büro, die Frist ist ein Halt. Test: `tests/disziplin.js`. Abweichungen in §12 unter U7a.

## 1. Ziel und Spielgefühl

- **Karten in echter Häufigkeit** (We Are Football 1 hatte „zu viele Karten“, Recherche 4).
- **Das Sportgericht ist ein Prozess über Tage** mit einer Entscheidung: Strafe annehmen oder Einspruch einlegen.
- **Charakter zählt:** Hitzköpfe sehen mehr Karten, Wiederholungstäter werden härter bestraft.
- **Worte haben Folgen:** Wer den Schiedsrichter öffentlich angreift, bekommt Post vom Kontrollausschuss (K29).
- **Fans gehören dazu:** Pyrotechnik kostet Geld und im Wiederholungsfall Zuschauer.

## 2. Vorbilder und Abgrenzung

- **Echte DFB-Regeln** als Grundlage, soweit belegt (Abschnitt 3.2).
- **Rohmaterial Kapitel 6:** Foularten, Verfahren über Tage, Strafmaß mit Zufall, Widerspruch. Übernommen und an die Regeln angepasst.
- **Bewusst anders:** keine Schiedsrichter, die je nach Tabellenlage pfeifen (K02 §5.3: kein Gummiband). Schiedsrichter unterscheiden sich nur in der Strenge.

## 3. Begriffe und Daten

### 3.1 Foularten

| Art | Anteil an Fouls | Folge |
|---|---|---|
| normal | 80 % | meist keine Karte (Gelb 3 %) |
| taktisch | 12 % | Gelb 70 % |
| rücksichtslos | 7 % | Gelb 85 %, Rot 5 % |
| brutal | 0,3 % | Rot |
| Notbremse | bei Konter und Großchance | Rot, im Strafraum mit Ballversuch Gelb und Elfmeter |
| Handspiel auf der Linie | sehr selten | Rot und Elfmeter |
| Unsportlichkeit, Meckern | je Spiel und Team etwa 0,15 | Gelb |
| Zeitspiel | bei „Zeit schinden“ (K05) | Gelb |
| Tätlichkeit | ligaweit etwa einmal pro Saison | Rot, schweres Verfahren |

### 3.2 Sperren (echte Regeln, soweit gefunden)

| Fall | Regel |
|---|---|
| Gelbe Karten in der Liga | Sperre für das nächste Ligaspiel nach der 5., 10. und 15. Gelben Karte. Danach zählt es neu. |
| Gelbe Karten im DFB-Pokal | ebenfalls nach der 5. Gelben im laufenden Wettbewerb ein Pokalspiel. Pokalkarten zählen nicht für die Liga und verfallen nach der Pokalsaison. In der Pokalgeschichte hat bisher kein Spieler wegen einer Gelbsperre gefehlt. |
| Gelb-Rot | automatisch ein Spiel Sperre im selben Wettbewerb |
| Rot | Das Sportgericht legt die Dauer im Einzelfall fest. Im Pokal laufen Rot-Sperren in die nächste Pokalsaison weiter. |
| Geltungsbereich | Liga und Pokal werden getrennt behandelt (Quellen). Ob eine Liga-Rotsperre auch im Pokal gilt, ist nicht geprüft (Frage 2). |

**Heute im Spiel** zählen Sperren über alle Wettbewerbe zusammen, und es gibt nur Gelbsperren nach der 5. Karte (Konsistenzprüfung H3). K09 trennt nach Wettbewerb.

### 3.3 Schiedsrichter

- Erfundener Pool je Liga, etwa 24 Namen, je mit **Strenge** (0,85–1,15 auf Karten), **Elfmeterneigung** (0,9–1,1) und einem Ruf.
- Zufällig angesetzt, aus dem Tag-Strom „sportgericht“ (K02).
- Ersetzt die vorläufige Strenge je Spiel aus K04 §5.11.

### 3.4 Im Spielstand

| Feld | Inhalt |
|---|---|
| Spieler `kt` | Gelbe Karten je Wettbewerb, Saison: `{liga:3,pokal:1}` |
| Spieler `sp_` | Sperren je Wettbewerb: `{liga:1,pokal:0}` (ersetzt `sus`) |
| Spieler `vg` | Vergehen der letzten 12 Monate (für Wiederholungstäter) |
| `S.verfahren` | laufende Verfahren: Spieler, Vergehen, Antrag, Frist, Stand |
| `S.schiri` | Pool je Liga |

## 4. Abläufe

### 4.1 Nach einer Roten Karte

| Tag | Was passiert |
|---|---|
| 0 | Rote Karte. Der Spieler ist **vorläufig** für das nächste Spiel desselben Wettbewerbs gesperrt. |
| 1–2 | Der Kontrollausschuss beantragt eine Strafe (5.2). Meldung mit Frist. |
| bis Frist (2 Tage) | **Entscheidung:** zustimmen (Strafe sofort rechtskräftig) oder Einspruch. Ohne Antwort gilt Zustimmung. |
| 3–10 | Bei Einspruch: Verhandlung, dann Urteil. Bis dahin bleibt die vorläufige Sperre. |

Die Entscheidung ist ein Halt (Frist, K01). Bei etwa einer Roten Karte alle zwei Monate pro Team belastet das das Halte-Budget kaum.

### 4.2 Gelb und Gelb-Rot

Laufen automatisch, ohne Verfahren. Meldung im Posteingang, Sperre in der Aufstellung sichtbar.

### 4.3 Äußerungen

Kritisiert der Trainer (du oder ein Computer-Trainer) in der Pressekonferenz den Schiedsrichter scharf (K29), ermittelt der Kontrollausschuss. Ergebnis nach 3–7 Tagen: Verwarnung, Geldstrafe oder bei Wiederholung ein Innenraumverbot für ein bis zwei Spiele.

### 4.4 Zuschauer-Vergehen

Pyrotechnik, Würfe, Platzsturm (Häufigkeit aus den Fangruppen, K27). Verfahren nach 5–14 Tagen: Geldstrafe für den Verein, im Wiederholungsfall Teilausschluss (ein Block bleibt leer, weniger Einnahmen, K23).

## 5. Regeln und Formeln

### 5.1 Karten im Spiel

- Fouls kommen aus K04 §5.4. Die Art des Fouls wird nach 3.1 gewürfelt.
- **Faktoren** auf die Kartenwahrscheinlichkeit: Strenge des Schiedsrichters, Einsatz hart ×1,7 (wie heute), fair ×0,5, Hitzkopf ×1,5, ungestüm ×1,4 (über mehr Fouls), Frische unter 60 % ×1,2, Rückstand in der Schlussphase ×1,2, Derby ×1,3.
- **Gelb-Rot:** Ein Spieler mit Gelb foult vorsichtiger (Foulrate ×0,7), außer Hitzköpfe.
- **Videobeweis:** wandelt in etwa 3 % der Roten Fälle eine Gelbe Karte in Rot um und umgekehrt (Zahl prüfen).

### 5.2 Strafmaß bei Rot

```
Antrag = Grundstrafe + Wiederholungstäter + Verletzungsfolge + Zufall (−1 bis +1), mindestens 1
```

| Vergehen | Grundstrafe (Spiele) | Spanne |
|---|---|---|
| Notbremse, Handspiel auf der Linie | 1 | 1–2 |
| grobes Foulspiel (rücksichtslos, brutal) | 2 | 1–4 |
| Unsportlichkeit gegen den Schiedsrichter | 2 | 1–5 |
| Tätlichkeit | 4 | 3–6 |
| schwere Tätlichkeit, Angriff auf den Schiedsrichter | 8 | 6–12 |

- **Wiederholungstäter:** +1 je Rote Karte in den letzten 12 Monaten.
- **Verletzungsfolge:** +1, wenn der Gegner vier Wochen oder länger ausfällt (K10).
- **Geldstrafe** für den Spieler zusätzlich, die der Verein intern weitergibt oder erlässt (Stimmung, K14).

### 5.3 Einspruch

- Kosten: 10.000–30.000 € für den Anwalt (K23).
- **Ausgang:** bestätigt 60 %, gemindert um ein Spiel 30 %, erhöht um ein Spiel 10 %.
- **Lage verschiebt das:** eindeutige Szene (Tätlichkeit, Videobeweis) → seltener gemindert. Harte Entscheidung (rücksichtslos, erste Rote Karte) → öfter gemindert.
- Die Zahlen sind Spielwerte, keine echte Statistik (nicht recherchiert).

### 5.4 Äußerungen und Trainer

- Geldstrafe für Schiedsrichterkritik: 5.000–50.000 €, nach Schärfe und Wiederholung.
- **Trainer-Karten:** Protest an der Seitenlinie (Auswahl beim automatischen Halt nach Elfmeter oder aberkanntem Tor, K05) kann Gelb bringen. Nach der 4. Gelben eine Spielsperre (Zahl prüfen).
- **Gesperrter Trainer** sitzt auf der Tribüne: keine Zurufe, die Halbzeitansprache hält der Co-Trainer (Qualität nach K16).

### 5.5 Zuschauer

- Geldstrafe je Vorfall nach Schwere, verdoppelt bei Wiederholung in 12 Monaten.
- Dritter schwerer Vorfall in 12 Monaten: Teilausschluss für ein Heimspiel (Block mit 10 % der Plätze leer).

## 6. Hebel des Spielers

| Hebel | Wirkung | Preis |
|---|---|---|
| Einsatz fair (K06) | weniger Karten und Sperren | weniger Zweikampfstärke |
| Spieler mit Gelb auswechseln (K05) | keine Gelb-Rot-Gefahr | Wechsel verbraucht |
| Strafe annehmen | sofort Klarheit, keine Kosten | volle Strafe |
| Einspruch | Chance auf Minderung | Kosten, kleines Risiko der Erhöhung, Sperre bleibt vorläufig |
| Geldstrafe erlassen oder weitergeben | Stimmung (K14) | Geld |
| Schiedsrichter kritisieren (K29) | Rückhalt bei Fans und Spielern | Geldstrafe, Sperre |
| Fanarbeit (K27) | weniger Zuschauer-Vergehen | Geld, Zeit |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln. Einspruch nach Lage: bei harter Entscheidung und wichtigem Spieler eher ja.
- Computer-Trainer mit „Heißsporn“-Profil (K31) kritisieren öfter Schiedsrichter.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Einspruch? (Entscheidung) | Antrag nach Roter Karte | siehe 4.1 |
| Gelbsperre droht | Spieler mit 4, 9 oder 14 Gelben vor einem wichtigen Spiel | Info, Erinnerung vor „Tag beenden“ (abschaltbar) |
| Bewusst Gelb abholen | Spieler mit 4 Gelben, unwichtiges Spiel vor einem wichtigen | **nicht** im Angebot. Das Sportgericht bestraft so etwas, und wir machen es nicht zur Taktik. |
| Rudelbildung | Rote Karte im Derby, Zufall | Geldstrafe für beide Vereine |
| Pyro-Show | Fangruppe, Derby (K27) | Geldstrafe, Presse (K29) |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | Hitzkopf, ungestüm, Temperament |
| K04 Engine | Fouls mit Ort und Art, Karten im Spiel |
| K05 Live-Spiel | Gelb-Rot-Gefahr, Protest an der Seitenlinie, gesperrter Trainer |
| K06 Taktik | Einsatz, Pressing mit mehr Fouls |
| K10 Medizin | Verletzungen aus Fouls, Verletzungsfolge im Strafmaß |
| K13 Wettbewerbe | Sperren je Wettbewerb, Relegation |
| K14 Kabine | Geldstrafe erlassen oder weitergeben |
| K23 Finanzen | Geldstrafen, Anwaltskosten, Einnahmeausfall durch Teilausschluss |
| K27 Fans | Zuschauer-Vergehen |
| K29 Presse | Schiedsrichterkritik, Berichte über Sperren |
| K34 Statistik | Karten, Sperren, Fairplay-Tabelle |

## 10. Zielwerte und Tests

**Echte Anker:** In der Bundesliga 2024/25 gab es 30 Rote und 28 Gelb-Rote Karten in 306 Spielen (DFB-Datencenter).

| Prüfung | Ziel |
|---|---|
| Gelbe Karten pro Team und Spiel | 1,5–2,2 (K04 §10) |
| Rote Karten (direkt) pro Spiel | 0,07–0,13 (2024/25: 0,10) |
| Gelb-Rote Karten pro Spiel | 0,06–0,12 (2024/25: 0,09) |
| Tätlichkeiten ligaweit | 0–3 pro Saison |
| Gelbsperren im Pokal | praktisch nie |
| Hitzköpfe | sehen im Schnitt 1,3- bis 1,7-mal so viele Karten wie andere |
| Einspruch | gemindert in 25–35 % der Fälle (Spielwert) |
| Verfahren | Urteil spätestens 10 Tage nach dem Spiel |

## 11. Stellschrauben

```js
disziplin:{
  foulArten:{normal:{anteil:0.80,gelb:0.03},taktisch:{anteil:0.12,gelb:0.70},ruecksichtslos:{anteil:0.07,gelb:0.85,rot:0.05},brutal:{anteil:0.003,rot:1}},
  meckern:0.15,taetlichkeitJeSaison:1,
  faktoren:{hart:1.7,fair:0.5,hitzkopf:1.5,muedeUnter:60,muede:1.2,rueckstand:1.2,derby:1.3,mitGelb:0.7},
  gelbsperre:{liga:[5,10,15],pokal:[5],spiele:1},gelbRot:1,
  rot:{notbremse:[1,1,2],grob:[2,1,4],unsportlich:[2,1,5],taetlichkeit:[4,3,6],schwer:[8,6,12],wiederholung:1,verletzung:1,verletzungAbTagen:28,zufall:1},
  verfahren:{antragTage:[1,2],frist:2,urteilTage:[3,10]},
  einspruch:{kosten:[10000,30000],bestaetigt:0.60,gemindert:0.30,erhoeht:0.10},
  aeusserung:{geld:[5000,50000],innenraumSpiele:[1,2]},
  trainerGelbSperreAb:4,
  zuschauer:{wiederholungFaktor:2,teilausschlussAb:3,blockAnteil:0.10},
  schiri:{proLiga:24,strenge:[0.85,1.15],elfmeter:[0.9,1.1]},
  var:{kartenKorrektur:0.03}
}
```

`engine.karten`, `engine.gelbSperreAb` und `engine.rotSperre` gehen darin auf.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Kein „bewusst Gelb abholen“** als Spieleroption. Es wäre ein Exploit und ist im echten Fußball strafbar.
2. **Liga-Rotsperren gelten vorläufig nur in der Liga,** Pokal-Rotsperren nur im Pokal (auch in der nächsten Pokalsaison). Ob eine Liga-Rotsperre auch für den Pokal gilt, muss noch geprüft werden.
3. **Relegation** zählt vorläufig zur Liga: Gelbe Karten und Sperren aus der Liga gelten dort (prüfen).
4. **Trainer-Karten** mit Sperre nach der 4. Gelben (Zahl prüfen) und Tribüne als Folge.
5. **Einspruch-Ausgänge** sind Spielwerte, nicht recherchiert.

**Vorläufig entschieden bei der Umsetzung (U7a, 9. November 2026):**
6. **Rote Karten in Liga und Pokal getrennt** (Nr. 2 bestätigt): Laut 90min.de werden Platzverweise in Bundesliga und DFB-Pokal getrennt behandelt und nur im eigenen Wettbewerb abgesessen. Das ist ein Fachartikel, das DFB-Regelwerk selbst habe ich nicht eingesehen.
7. **Die Gelbe vor einer Gelb-Roten Karte zählt nicht** für die Gelbsperre. Nicht belegt, prüfen.
8. **Gelbsperren verfallen am Saisonende,** Rot- und Gelb-Rot-Sperren laufen in die nächste Saison weiter, in Liga und Pokal. Belegt nur über Forenbeiträge, die die DFL-Spielordnung zitieren („Eine Übertragung auf das neue Spieljahr ist ausgeschlossen“). Den Originaltext habe ich nicht gefunden.
9. **„Rückstand in der Schlussphase ×1,2“ (5.1) ist vorläufig aus** (Stellschraube `faktoren.rueckstand` = 1,0). In der Simulation verschob der Faktor die Form zugunsten der schwachen Kader (Test „Keine Formspirale“ auf drei Seeds um etwa 0,6 Punkte). Die Ursache ist noch nicht geklärt.
10. **Foularten kalibriert:** Mit den Rohwerten aus 3.1 gäbe es etwa doppelt so viele Rote Karten. Gebaut sind normal 80 % (Gelb 2,2 %), taktisch 12 % (Gelb 56 %), rücksichtslos 7,7 % (Gelb 80 %, Rot 2,2 %), brutal 0,06 %, Notbremse 0,12 %. Dazu kommen Meckern (0,15 Gelb je Spiel und Team, 2 % davon Rot wegen Beleidigung) und Tätlichkeiten (0,0016 je Spiel und Team, 5 % davon schwer). Die Notbremse ist eine Foulart, keine eigene Konter-Szene.
11. **Strafmaß ohne Verletzungsfolge:** Verletzungen aus der Engine sind noch nicht mit dem Foul verknüpft. Kommt mit K10.
12. **Einspruch:** Ausgang nach Lage. Eine harte Entscheidung (erste Rote Karte, kein Tätlichkeitsfall) wird zu 35 % gemindert und zu 5 % erhöht, eine eindeutige (Tätlichkeit) zu 10 % gemindert und zu 15 % erhöht, sonst 25 % und 10 %. Im Mittel sind es so etwa 30 % gemindert. Bei einem Antrag von nur einem Spiel ist kein Einspruch möglich. Computer-Vereine legen Einspruch ein, wenn ein Stammspieler hart bestraft wurde (60 %), sonst nur selten (10 %).
13. **Zweite Rote Karte vor dem Urteil:** Es bleibt ein Verfahren, gewertet wird das schwerere Vergehen.
14. **Noch nicht gebaut:** Äußerungen und Kontrollausschuss (K29), Zuschauer-Vergehen (K27), Trainer-Karten und Tribüne, Videobeweis, Derby-Faktor, Rudelbildung, Geldstrafen für Spieler (K14), Erinnerung „Gelbsperre droht“ vor wichtigen Spielen. Die Kader-Ansicht zeigt nur einen Hinweis bei 4, 9 oder 14 Gelben.

**Noch zu recherchieren:** Geltung von Liga-Rotsperren im Pokal, Kartenregeln in der Relegation, aktuelle Trainer-Kartenregel, Höhe echter DFB-Geldstrafen für Pyrotechnik.

## Quellen

- Gelbsperren Liga und Pokal getrennt, Pokal-Rot läuft weiter: [90min.de: Karten im DFB-Pokal](https://www.90min.de/posts/karten-im-dfb-pokal-zahlen-sperren-auch-fur-die-bundesliga), [ran.de: Warum es noch nie eine Gelbsperre im Pokal gab](https://ran.joyn.de/sports/fussball/dfb-pokal/dfb-pokal-warum-es-noch-nie-eine-gelbsperre-gab-113230), [DFB: Sperren](https://www.dfb.de/ueber-uns/verbandsrecht/sperren), [DFB: DFB-Pokal (englisch)](https://www.dfb.de/en/national-tournaments/dfb-cup-men/)
- Rote Karte im Einzelfall: [bundesliga.com: Die Rote Karte](https://www.bundesliga.com/de/faq/wie-sehen-die-fussball-regeln-aus/die-rote-karte-als-disziplinarische-massnahme-im-fussball-22821)
- Gelb-Rot und Wahrnehmung der ersten Gelben: [LTO](https://www.lto.de/recht/nachrichten/n/fussball-platzverweis-sperre-sportgericht-freiburg-bundesliga-stille-verwarnung)
- Trainer-Karten: [echo24.de](https://www.echo24.de/sport/fussball/bundesliga-regel-revolution-trainer-nach-vier-gelben-karten-gesperrt-zr-12328637.html)
- Platzverweise 2024/25: [DFB-Datencenter](https://datencenter.dfb.de/ranglisten/bundesliga/2024-25)
- Foularten, Verfahren, Strafmaß: `konzepte/_rohmaterial-logik-v1.md`, Kapitel 6
