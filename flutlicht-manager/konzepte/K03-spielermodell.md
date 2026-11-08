# K03 – Spielermodell

Status: **abgestimmt** (7. November 2026, alle Fragen beantwortet). **Teilweise umgesetzt** in U2b (8.11.): Frische, Kondition, Form 0–20 mit Note gegen die Erwartung, Serien, Selbstvertrauen, Spielpraxis, Entwicklung an jedem Spieltag, Zustandsfaktor. Offen: Persönlichkeit, Eigenschaften, Merkmale, Positionen, Fuß, unscharfe Talentsterne (U2c).

**Umsetzungshinweise (U2b):** `pos` bleibt vorerst die Gruppe (TW, AB, MF, ST), `fit` heißt im Code weiter so und bedeutet Frische. Kalibriert mit `tests/spielermodell.js`: Form je Notenpunkt 2,5 statt 1,5 (sonst zu wenig Streuung), Wachstum 20–28 Jahre etwas höher und Talent nach erwarteter Restentwicklung verteilt (sonst bremst die Talentgrenze zu früh), Trainingsformen geben 5 Spielpraxis pro Woche (bis K07), weil die Engine noch keine Einwechslungen kennt. Grundlage sind deine Entscheidungen vom 5.11.: Anstoss-Stil, Stärke 1–99, Form 0–20 mit Mitte 10. Deine Antworten vom 7.11. sind eingearbeitet (Abschnitt 12).
Hängt ab von: K33 (Daten), K01 (Kalender) · Wird gebraucht von: K04, K06, K07, K08, K10, K12a, K14, K15, K16, K18, K19, K21, K27, K29, K31, K32, K34, K35a.

## 1. Ziel und Spielgefühl

- **Auf einen Blick lesbar:** Eine Zahl sagt, wie gut ein Spieler ist (Stärke). Ein paar Wörter sagen, was ihn besonders macht (Merkmale) und wie er tickt (Eigenschaften).
- **Geschichten statt Tabellen:** Ein Spieler lernt in einer Halbserie das Flanken. Der Altstar ist plötzlich nicht mehr schnell. Der Hitzkopf fliegt im Derby vom Platz. Der Stürmer trifft vier Spiele hintereinander, ist in Topform und legt in wenigen Wochen spürbar zu. Nach den Ecken desselben Spielers fallen immer wieder Tore, bis er als Flankengeber gilt.
- **Entscheidungen mit Preis:** Spielen lassen oder schonen? Langer Urlaub oder Kondition? Das Talent jetzt bringen oder verleihen? Welches Merkmal lernt wer?
- **Kein Wert entscheidet allein.** Die Stärke ist der Hauptwert. Zustände wie Form und Frische verschieben die Leistung nur in einem engen, gedeckelten Rahmen.

## 2. Vorbilder und Abgrenzung

- **Anstoss 3** (GameStar 4/2000, PLAN §4): Stärke als eine Zahl, Auf- und Abwertungsrunden nach Alter, Talent und Durchschnittsform, erlernbare Fähigkeiten mit Lernfortschritt, Charakter-Eigenschaften, Beziehungen im Kader. Das übernehmen wir als Grundidee.
- **Football Manager:** versteckte Persönlichkeit (Professionalität, Ehrgeiz) als Motor der Entwicklung, Spielpraxis, Trainingsbelastung. Das übernehmen wir als verdeckte Ebene unter den sichtbaren Eigenschaften.
- **Hattrick:** Selbstvertrauen wirkt auf den Abschluss. Das übernehmen wir.
- **Bewusst anders:**
  - Keine 30 Einzelwerte wie im FM. Merkmale wirken gezielt in bestimmten Spielsituationen und ersetzen die Zahlenwerte (Konsistenzprüfung A1).
  - Keine Auf- und Abwertungsrunden wie bei Anstoss, sondern **kleine Schritte an jedem Spieltag** (entschieden 7.11.). Die Anstoss-Idee bleibt: Die Form bestimmt das Tempo.
  - Merkmale lernt man nicht nur im Training, sondern auch **im Spiel**: Was in seinen Szenen klappt, zahlt auf eine Stärke ein, was schiefgeht, auf eine Schwäche.
  - Eigenschaften entstehen aus verdeckten Werten. Es gibt also eine einzige Quelle und keine zwei Systeme nebeneinander.
  - Eigene Merkmal- und Eigenschaftslisten, keine Kopie der Anstoss-Listen.

## 3. Begriffe und Daten

### 3.1 Feste und langsame Werte

| Wert | Bereich | Sichtbar | Startwert | Ändert sich | Feld |
|---|---|---|---|---|---|
| Position | 14 Positionen, siehe 3.1a | ja | `spieler.js` (feine Position neu) | Umschulung (K07) | `pos` |
| Positionsgruppe | TW, AB, MF, ST | ja | aus der Position | mit der Position | berechnet |
| Nebenpositionen | bis zu 2, je mit Eignung 85–95 % | ja | Daten, sonst Zufall | Umschulung (K07) | `pos2` |
| Starker Fuß | rechts, links | ja | Daten, sonst Zufall (77 % rechts) | nie. „beidfüßig“ ist ein Merkmal. | `fuss` |
| Alter | Jahre | ja | `spieler.js` (am 1.7.) | am 1. Juli +1 | `age` |
| Nationalität | Länderkürzel | ja | `spieler.js` (neu, entschieden 7.11.) | nie | `nat` |
| **Stärke** | 1–99, intern mit Nachkommastellen | eigene als ganze Zahl mit Balken zum nächsten Punkt, fremde als Spanne (K18) | `spieler.js` | kleine Schritte an jedem Spieltag (5.1) | `str` |
| **Talent** | 1–99, Obergrenze der Stärke | nein, nur als Sterne-Schätzung, die um einen Stern danebenliegen kann (entschieden 7.11.) | wie heute aus Alter und Stärke | nur durch Prägung (K08) | `pot` |
| Merkmale | Katalog 3.4 | ja, fremde nur gescoutet | Zufall nach Position und Stärke | Lernen, Altersverlust (5.6) | `mk` |
| Persönlichkeit | 8 Werte, je 1–20 | nein, nur über Eigenschaften | Zufall je Karriere | selten (5.7) | `ch` |
| Eigenschaften | Katalog 3.5 | ja, sobald bekannt | aus der Persönlichkeit | wenn sich die Persönlichkeit ändert | berechnet, bekannte in `ek` |

### 3.1a Positionen (entschieden 7.11.)

| Gruppe | Position | Kürzel |
|---|---|---|
| Tor | Torwart | TW |
| Abwehr | Innenverteidiger | IV |
| | linker und rechter Außenverteidiger | LV, RV |
| Mittelfeld | defensives Mittelfeld (Sechser) | DM |
| | zentrales Mittelfeld (Achter) | ZM |
| | Spielmacher | SM |
| | offensives Mittelfeld (Zehner) | OM |
| | linkes und rechtes Mittelfeld (Flügel) | LM, RM |
| Sturm | Mittelstürmer | MS |
| | hängende Spitze | HS |
| | Linksaußen und Rechtsaußen (Flügel) | LA, RA |

- **Ergänzt** gegenüber deiner Liste: zentrales Mittelfeld, hängende Spitze und die Seiten links und rechts. Die Außenverteidiger heißen LV und RV, weil LA und RA im Fußball meist für Linksaußen und Rechtsaußen stehen.
- **Keine eigene Position:**
  - Schienenspieler (in Dreier- und Fünferkette) ist ein Platz in der Grundordnung. Er nutzt die bessere Eignung aus Außenverteidiger und Flügel im Mittelfeld (K06).
  - Libero gibt es im heutigen Fußball kaum noch. Er kann in K06 als Rolle zurückkommen.
- **Eignung auf anderen Positionen:**
  - Hauptposition 100 %, Nebenpositionen 85–95 %.
  - Verwandte Positionen 75–90 %, zum Beispiel IV→DM 85, DM↔ZM 90, ZM↔OM 90, OM↔SM 90, OM→HS 85, HS↔MS 85, LV→LM 85, LM↔LA 85. Die ganze Tabelle steht in `regeln.js`.
  - Übrige Positionen derselben Gruppe 70 %, andere Gruppe 55 %, Torwart und Feld 45 % (wie heute).
  - **Falsche Seite:** −8 % für Außenverteidiger und Flügel im Mittelfeld, die mit dem schwachen Fuß auf der anderen Seite spielen. Bei Linksaußen und Rechtsaußen gibt es keine Strafe, denn „invertierte“ Flügelstürmer (Rechtsfuß links, zieht nach innen) sind üblich. Beidfüßige trifft es nie.
- **Bis K04 und K06** rechnet die Engine weiter mit den vier Gruppen. Die feine Position zeigt aber schon, wer wohin passt. K06 baut die Grundordnungen auf die 14 Positionen um.
- **Daten:** Die Wikipedia-Kader kennen nur die vier Gruppen. Für feine Position und Fuß braucht es eine zweite Quelle (Frage 3).

### 3.2 Zustände

| Zustand | Bereich | Mitte/Start | Bedeutung | Feld |
|---|---|---|---|---|
| **Form** | 0–20 | 10 | Leistungsniveau der letzten Spiele, gemessen an der eigenen Erwartung | `form` |
| **Frische** | 0–100 % | 100 | kurzfristig: wie ausgeruht. Sinkt durch Spiele und Training, steigt durch Ruhe. | `fr` (ersetzt `fit`) |
| **Kondition** | 0–100 | 80 am 1.7. | langfristig: Trainingszustand. Bestimmt, wie schnell die Frische sinkt und zurückkommt. | `ko` |
| **Selbstvertrauen** | −3 bis +3 | 0 | der Kopf: reagiert auf einzelne Momente, auf Lob und Kritik | `sv` |
| Stimmung | 0–100 | 65 | Zufriedenheit. **K14 rechnet**, K03 speichert nur. | `st` |
| Integration | 0–100 % | 100 im Startkader, Neuzugänge nach 5.5 | wie gut er im Verein angekommen ist | `int` |
| Deutsch | 0–100 | Deutsche 100, andere nach Herkunft | Sprache, nur für Integration und Beziehungen | `de` |
| Spielpraxis | 0–100 % | 70 | Einsatzminuten der letzten Wochen | `sp` |
| Saisonbelastung | 0–100, verdeckt | 30 | wie viel die Saison abverlangt hat, sinkt nur im Urlaub (K12a §3.1) | `sb` |
| Lernziele | höchstens 2 Merkmale mit Fortschritt 0–100 % | keine | was er gerade lernt | `ls` |
| Verletzung, Sperre | Tage bzw. Spiele | 0 | wie heute, K09 und K10 bauen aus | `inj`, `sus` |
| Verlauf | Stärke und Form je Monat, 3 Saisons | leer | für Verläufe auf der Spielerkarte (K34, K35a) | `hist` |

**Warum Form und Selbstvertrauen getrennt?** Die Form ist das, was man an den Noten sieht, und wirkt auf alles ein wenig. Das Selbstvertrauen reagiert auf einzelne Momente (Tor, Patzer, Lob) und wirkt nur in entscheidenden Szenen: Abschluss, Torwartparade, Elfmeter. So zählt nichts doppelt.

**Warum Frische und Kondition getrennt?** Heute vermischt `fit` beides. Im Urlaub sinkt deshalb die „Fitness“, obwohl der Spieler ausgeruht ist. Künftig steigt im Urlaub die Frische, und die Kondition sinkt. Erst dadurch wird die Urlaubslänge eine echte Wahl (K12a, Konsistenzprüfung I8).

### 3.3 Persönlichkeit (verdeckt, je 1–20)

| Wert | hoch bedeutet | Wirkt auf |
|---|---|---|
| Professionalität | lebt und trainiert wie ein Profi | Aufwertung, Lerntempo, Kondition, Abbau im Alter |
| Ehrgeiz | will spielen und gewinnen | Stimmung bei Bankplatz und Misserfolg (K14), Wechselwunsch |
| Loyalität | hängt am Verein | Vertrag, Abwerben (K20, K21) |
| Temperament | hitzig | Karten (K09), Streit (K14), Reaktion auf Kritik (K15) |
| Druckresistenz | ruhig in großen Spielen | Leistung in wichtigen Spielen, Elfmeter, Prägung (K08) |
| Anpassungsfähigkeit | kommt schnell an | Integration, Deutsch, Heimweh |
| Führung | Ausstrahlung in der Kabine | Gewicht in der Kabine (K14), Mentor (K08) |
| Robustheit | selten verletzt | Verletzungsrisiko und Rückfälle (K10) |

Bei echten Spielern wird zum Start abgeleitet, was sich aus öffentlichen Fakten belegen lässt (Kapitänsamt, Jahre im Verein, Karten, Verletzungstage), der Rest wird ausgewürfelt (5.9). Ausgewürfelt heißt: Schnitt 10, Streuung 3,5, begrenzt auf 1–20. Spieler, die das Spiel später selbst erzeugt, bekommen alles per Zufall. Nach einigen Saisons sind das fast alle.

### 3.4 Merkmale (erlernbar)

Ein Merkmal ist eine **Stärke** oder eine **Schwäche** in bestimmten Spielsituationen. Merkmale erhöhen nicht die Stärke, sondern wirken über Haken in der Engine (K04) und in der Taktik (K06).

**Stärken der Feldspieler**

| Merkmal | Gruppen | Schwierigkeit | Wirkt bei | Altersverlust |
|---|---|---|---|---|
| kopfballstark | AB, MF, ST | mittel | Flanken und Standards, vorne und hinten | – |
| schnell | alle Feldspieler | schwer, lernbar bis 23 | Konter, Laufduelle | ja |
| ausdauernd | alle Feldspieler | leicht | weniger Frischeverlust im Spiel, Pressing | ja |
| zweikampfstark | AB, MF | mittel | Ballgewinne, Mauern, Pressing | – |
| stellungssicher | AB, MF | mittel | verhindert Chancen, gleicht fehlendes Tempo teilweise aus | – |
| ballsicher | AB, MF | mittel | weniger Ballverluste, Spielaufbau gegen Pressing | – |
| Flankengeber | AB, MF | mittel | Flügelspiel, Ecken | – |
| Dribbler | MF, ST | schwer | Chancen aus Einzelaktionen, holt Fouls heraus | – |
| Torjäger | MF, ST | schwer | Verwertung im Strafraum | – |
| Weitschütze | MF, ST | mittel | Chancen aus der Distanz, gegen Mauern | – |
| Freistoßspezialist | alle Feldspieler | mittel | direkte Freistöße | – |
| Elfmeterschütze | alle Feldspieler | leicht | Elfmeter, Elfmeterschießen | – |
| beidfüßig | alle Feldspieler | schwer, lernbar bis 25 | keine Strafe auf der falschen Seite (3.1a), etwas besserer Abschluss und Flanken | – |
| vielseitig | alle Feldspieler | mittel | Nebenpositionen und verwandte Positionen +5, höchstens 95 % | – |
| Joker | MF, ST | mittel | stärker in den ersten 20 Minuten nach der Einwechslung, Bankplatz kostet weniger Stimmung (K14) | – |

**Stärken der Torhüter**

| Merkmal | Schwierigkeit | Wirkt bei |
|---|---|---|
| Reflexe | mittel | Schüsse aus kurzer Distanz, Eins-gegen-eins |
| Strafraumbeherrscher | mittel | Flanken und Ecken |
| Elfmetertöter | leicht | Elfmeter |
| mitspielend | mittel | Spielaufbau gegen Pressing, Ballbesitz |

**Schwächen** (lassen sich abtrainieren wie ein Merkmal lernen)

| Schwäche | Gruppen | Abtrainieren | Wirkt bei |
|---|---|---|---|
| kopfballschwach | Feldspieler | mittel | Gegenteil von kopfballstark |
| abschlussschwach | MF, ST | mittel | schlechtere Verwertung |
| unkonzentriert | alle | leicht | Patzer, die zu Chancen führen (K04) |
| ungestüm | Feldspieler | mittel | mehr Fouls und Karten (K09) |
| Fliegenfänger | TW | mittel | Fehler bei Flanken und Fernschüssen |
| langsam | Feldspieler | schwer | Gegenteil von schnell. Entsteht vor allem im Alter (5.6). |

**Grenzen:** höchstens **4 Stärken** je Spieler. Ein Spieler lernt **ein Merkmal**. Zwei gleichzeitig gehen, aber dann lernt er jedes nur halb so schnell (Anstoss-Bremse). Stärke und passende Schwäche schließen sich aus.

**Erst zeigen, wenn es wirkt:** Merkmale werden von Anfang an vergeben und gespeichert, aber erst angezeigt, wenn ihre Wirkung gebaut ist. Texte beschreiben nur, was das Spiel wirklich rechnet (K35). Mit U2 kommen „ausdauernd“, „Elfmeterschütze“ und „Elfmetertöter“, mit den feinen Positionen „vielseitig“ und „beidfüßig“, mit U3 (Engine) die übrigen.

### 3.5 Eigenschaften (sichtbar, aus der Persönlichkeit)

| Eigenschaft | Art | entsteht aus | Wirkung (zuständig) |
|---|---|---|---|
| Führungsspieler | + | Führung ≥ 16, Alter ≥ 24 | zählt doppelt in der Kabinenstimmung, stützt das Selbstvertrauen der Jüngeren (K14) |
| Integrationsfigur | + | Führung ≥ 13, Anpassungsfähigkeit ≥ 15 | Neuzugänge integrieren sich schneller, weniger Grüppchen (K14) |
| Vorbildprofi | + | Professionalität ≥ 17 | Lerntempo +25 %, langsamerer Abbau im Alter |
| Mentor | + | Alter ≥ 29, Professionalität ≥ 14, Führung ≥ 12 | junge Spieler an seiner Seite entwickeln sich besser (K08) |
| Kämpfer | + | Ehrgeiz ≥ 16, Druckresistenz ≥ 12 | stärker bei Rückstand (K04), verträgt Kritik (K15, K29) |
| vereinstreu | + | Loyalität ≥ 17 | günstiger bei Verlängerung, schwer abzuwerben (K20, K21) |
| Trainingsweltmeister | ± | Professionalität ≥ 15, Druckresistenz ≤ 7 | lernt schnell, bringt es im Spiel aber nicht: in wichtigen Spielen schwächer (Bedeutung bestätigt 7.11.) |
| Teenie-Star | ± | Alter ≤ 23, Stärke ≥ 75, Zufall | mehr Trikotverkäufe, aber nur bei Form ≥ 12 (K25, K27), mehr Medienrummel (K29) |
| Publikumsliebling | + | erworben: 2 Saisons im Verein, gute Noten, Tore oder Einsatz | Fanstimmung, Trikots, Pfiffe bei seinem Verkauf (K27) |
| Hitzkopf | − | Temperament ≥ 17 | Karten ×1,5 (K09), Streit (K14) |
| Diva | − | Ehrgeiz ≥ 15, Anpassungsfähigkeit ≤ 6 | Bankplatz kostet doppelt Stimmung, reagiert schlecht auf Kritik (K14, K15) |
| nervenschwach | − | Druckresistenz ≤ 4 | schwächer in wichtigen Spielen und beim Elfmeter, Prägung riskanter (K08) |
| verletzungsanfällig | − | Robustheit ≤ 4 | Verletzungen ×1,6, mehr Rückfälle (K10) |
| Partylöwe | − | Professionalität ≤ 4 | Kondition sinkt schneller, Lerntempo −25 %, Ereigniskarten (K29, K30) |
| Söldner | − | Loyalität ≤ 4 | folgt dem Geld, schnell wechselwillig (K19, K21) |
| Heimweh-Typ | − | Anpassungsfähigkeit ≤ 4 | nach einem Wechsel ins Ausland langsame Integration, Heimweh-Karte |

Bei Schnitt 10 und Streuung 3,5 hat etwa jeder Dritte mindestens eine Eigenschaft. Das hält die Liste besonders.

Auch hier gilt „erst zeigen, wenn es wirkt“. Mit U2 kommen Vorbildprofi, Partylöwe und Trainingsweltmeister (Lernen und Entwicklung), Hitzkopf (Karten gibt es schon), verletzungsanfällig (Verletzungen gibt es schon) und nervenschwach (Elfmeterschießen). Die übrigen kommen mit dem Konzept, das ihre Wirkung baut (K04, K08, K14, K15, K21, K27).

**Wann du sie siehst:**
- Eigene Spieler: nach 2–8 Wochen im Verein meldet der Co-Trainer die Eigenschaft (mit gutem Stab schneller, K16).
- Teenie-Star und Publikumsliebling sind öffentlich, also sofort sichtbar.
- Fremde Spieler: über Scouting (K18) und Presse (K29), anfangs als Gerücht („gilt als Hitzkopf“).

### 3.6 Beziehungen im Kader

**Zuständig ist K14** für Entstehung und Wirkung. K03 legt nur die Daten fest:
- Paarliste im Spielstand `S.bz`: `[Spieler A, Spieler B, Art, Stärke 1–3]`, Art = Freundschaft oder Rivalität.
- **Landsleute** und **gemeinsame Sprache** ergeben sich aus Nationalität und Deutsch und werden nicht gespeichert.
- **Rivalität um den Stammplatz** ergibt sich aus gleicher Position und ähnlicher Stärke. K14 entscheidet, wann daraus eine gespeicherte Rivalität wird.

## 4. Abläufe

| Wann | Was passiert | Halt? |
|---|---|---|
| **täglich** (auch an übersprungenen Tagen) | Frische: Erholung minus Trainingslast. Spielpraxis zerfällt. Ausfalltage zählen herunter. Im Urlaub sinkt die Kondition. | nein |
| **nach jedem Spiel** | Frische sinkt nach Minuten und Kondition. Spielpraxis steigt. Die Note verschiebt die Form, Serien der Mannschaft auch. Tore und Patzer verschieben das Selbstvertrauen. Szenen zahlen auf Merkmale ein (5.6). Danach wird die **Entwicklung der Stärke** für den ganzen Kader verbucht (5.1). | nein |
| **wöchentlich** (Montag, `kalender.wochenTag`) | Lernfortschritt. Kondition wandert zum Trainingsziel. Form und Selbstvertrauen ziehen leicht zur Mitte. Integration und Deutsch. Stimmung (K14). In Wochen ohne Pflichtspiel: Entwicklung verbuchen. Altersverlust von Merkmalen. Eigenschaften werden entdeckt. **Wochenbericht des Co-Trainers** im Posteingang: wer einen ganzen Punkt gewonnen oder verloren hat, wer ein Merkmal gelernt hat, wo sich eine Schwäche zeigt. | nein, nur Info |
| **monatlich** | Verlauf speichern (eigene Spieler wöchentlich). | nein |
| **jährlich** (1. Juli) | Alter +1. Persönlichkeit reift (5.7). Eigenschaften neu berechnen. Karriereende (K32), Nachwuchs (K08). | nein |
| Merkmal gelernt | Nachricht. Erinnerung „Lernplatz frei“ vor „Tag beenden“, abschaltbar (K01). | Erinnerung |

K03 erzeugt also **keine eigenen Halte**. Das schont das Budget von 2–4 Stopps pro Woche (PLAN §2). Entscheidungen aus diesem Bereich kommen über Ereigniskarten (Abschnitt 8).

## 5. Regeln und Formeln

Alle Zahlen sind Startwerte für `regeln.js`. Kalibriert wird nach Abschnitt 10.

### 5.1 Entwicklung der Stärke (an jedem Spieltag, entschieden 7.11.)

Die Stärke hat intern Nachkommastellen und wächst oder schrumpft **in kleinen Schritten an jedem Spieltag**. Angezeigt wird die ganze Zahl, dazu ein Balken zum nächsten Punkt und ein Trendpfeil.

- **Wann verbucht wird:** nach jedem Pflichtspiel seines Vereins, für den ganzen Kader, ob einer gespielt hat oder nicht. Berechnet wird für die Tage seit der letzten Verbuchung. In Zeiten ohne Pflichtspiel (Vorbereitung, Winter, Länderspielpause) wird jeden Montag verbucht. Im Urlaub ruht die Entwicklung.
- Weil die Tage zählen und nicht die Spiele, wächst ein Spieler nicht schneller, nur weil sein Verein mehr Spiele hat (Konsistenzprüfung H4). Mehr Spiele wirken über Spielpraxis und Form.

```
Schritt = ( Wachstum(Alter)        × Talentrest × Form_auf × Praxis_auf × Training × Profi_auf
          − Abbau(Positionsalter)  × Form_ab × Praxis_ab × Profi_ab × Positionsfaktor )
          × Tage / 320  +  Zufall
```

320 sind die Entwicklungstage einer Saison (365 Tage ohne etwa sechs Wochen Urlaub).

**Alterstabelle** (pro Saison, bei Form 10 und neutralen Bedingungen):

| Alter | Wachstum | Abbau | netto pro Saison |
|---|---|---|---|
| bis 19 | 4,9 | 0,7 | +4,2 |
| 20–22 | 3,5 | 0,9 | +2,6 |
| 23–25 | 2,0 | 1,0 | +1,0 |
| 26–28 | 1,1 | 1,1 | ±0 |
| 29–30 | 0,8 | 1,3 | −0,5 |
| 31–32 | 0,6 | 2,0 | −1,4 |
| 33–34 | 0,4 | 2,9 | −2,5 |
| ab 35 | 0,3 | 3,7 | −3,4 |

- **Form** (der aktuelle Wert, Mitte 10): `Form_auf = 1,2^(Form − 10)`, `Form_ab = 1,2^(10 − Form)`. Bei Form 15 wächst ein Spieler 2,5-mal so schnell und baut nur 0,4-mal so schnell ab. Bei Form 5 ist es umgekehrt. Das ist die Anstoss-Regel „die Form zählt am meisten“, nur in kleinen Schritten.
- **Beispiel:** Ein 22-jähriger Stürmer trifft in vier Spielen hintereinander und steht danach bei Form 15. Statt etwa 0,06 legt er jetzt etwa 0,18 Punkte pro Woche zu. Hält die Form zwei Monate, ist das ein ganzer Punkt mehr, als er sonst gewonnen hätte. Läuft es umgekehrt, baut er in dieser Zeit ab.
- **Positionsalter** (nur für den Abbau): Alter − 3 bei Torhütern, − 1 bei Abwehrspielern, ± 0 im Mittelfeld, + 1 im Sturm. **Positionsfaktor** auf den Abbau: TW 0,7, AB 0,85, MF und ST 1. Das folgt den Studien: Stürmer erreichen den Höhepunkt früh und bauen am schnellsten ab, Torhüter und Verteidiger spät und langsam (Quellen).
- **Talentrest:** `min(1, (Talent − Stärke) / 6)`. Am Talent ist Schluss, das Wachstum ist dann 0. Nur eine Prägung (K08) hebt das Talent.
- **Spielpraxis** (Wert aus 5.4): ab 60 % → Praxis_auf 1,2. Unter 20 % → Praxis_auf 0,7, ab 29 Jahren zusätzlich Praxis_ab 1,3. Bis 18 Jahre zählt die Praxis nur halb, denn junge Spieler entwickeln sich zuerst im Training (Faustregel aus der FM-Community).
- **Training** bis K07: locker 0,8, normal 1, hart 1,2.
- **Professionalität:** `Profi_auf = 0,8 + 0,02 × P`, `Profi_ab = 1,2 − 0,02 × P` (P = 1–20).
- **Zufall:** je Verbuchung ±0,05 × Tage/7, bis 21 Jahre doppelt so viel. Große Sprünge kommen nicht aus dem Würfel, sondern aus Prägungsereignissen (K08).
- **Meldung:** Der Wochenbericht nennt nur, wer am Montag eine andere ganze Zahl hat als am Montag davor. So flackert nichts, wenn der Wert um eine Grenze pendelt.

### 5.2 Form

- **Nach jedem Spiel:** `Form += 1,5 × (erwartete Note − Note)`, begrenzt auf 0–20. Die **erwartete Note** hängt von Stärke, Position und Gegner ab und kommt aus K04.
- **Was die Form bewegt:** alles, was in die Note eingeht, gemessen an der Erwartung: Tore und Vorlagen, beim Torwart Paraden und Spiele zu null, gewonnene Zweikämpfe, Patzer, Platzverweise. Wer vier Spiele hintereinander trifft, steht danach bei Form 14–16.
- **Serien der Mannschaft:** Holt die Mannschaft in den letzten fünf Pflichtspielen mindestens 4 Punkte mehr als erwartet, bekommt jeder, der im Spiel stand, +0,5 Form. Bei 4 Punkten weniger als erwartet −0,5. Die Erwartung kommt aus dem Stärkeverhältnis vor dem Spiel (K04). Eine Siegesserie des Favoriten bringt deshalb wenig, die eines Außenseiters viel. So wachsen die Großen nicht automatisch immer schneller.
- **Wöchentlich:** Form wandert um 10 % zur Mitte 10.
- **Wirkung im Spiel:** ±0,5 % je Punkt Abstand von 10, also höchstens ±5 %.
- **Wichtig gegen Rückkopplung** (Rohmaterial 1.1): Die Note misst die Leistung **gegenüber der Erwartung**. Heute bekommen starke Spieler allein wegen ihrer Stärke bessere Noten und damit bessere Form. Das muss K04 ändern (Konsistenzprüfung J1).

### 5.3 Frische und Kondition

- **Spiel:** `Frische −= 15 × Minuten/90 × (1,5 − 0,007 × Kondition)`. Bei Kondition 40 kostet ein Spiel etwa 18 Punkte, bei 80 etwa 14, bei 95 etwa 12. „ausdauernd“ spart ein Viertel.
- **Erholung pro Tag:** `(3 + 0,1 × (100 − Frische))` × Altersfaktor (bis 23: 1,1, bis 29: 1, bis 32: 0,9, danach 0,8) × (0,8 + 0,004 × Kondition). Wer müde ist, erholt sich anfangs schneller, die letzten Prozent dauern.
- **Training pro Tag** kostet je nach Stufe 1, 2 oder 3 Punkte (bis K07). Ruhetag 0.
- **Beispiel** (Kondition 80, normales Training): Bei einem Spiel pro Woche ist der Spieler zum nächsten Spiel wieder bei 100 %. Bei drei Spielen in acht Tagen steht er nach dem dritten bei etwa 77 %, nach drei Ruhetagen wieder bei etwa 92 %.
- **Kondition** wandert pro Woche um 20 % zu einem Ziel: locker 70, normal 80, hart 90, ab 30 Jahren je Jahr 1 weniger, „Partylöwe“ 8 weniger. Im Urlaub sinkt sie um 0,6 pro Tag (4 Wochen etwa −17), verletzt um 0,5. Ein Pflichtspiel über 90 Minuten bringt +1.
- **Wirkung im Spiel:** Frische wie heute `0,72 + 0,28 × Frische`. Die Kondition steuert in K04 und K05, wie schnell die Frische während des Spiels sinkt.
- **Unter 80 % Frische** steigt das Verletzungsrisiko (Höhe in K10).

### 5.4 Selbstvertrauen und Spielpraxis

- **Selbstvertrauen** (−3 bis +3), Startwerte der Ereignisse:
  - Tor +0,5, Siegtor +0,8, Note 1–2 +0,3
  - verschossener Elfmeter −0,8, Patzer vor einem Gegentor −0,8, Note 5–6 −0,3
  - Lob und Kritik ±0,5 bis ±1, je nach Charakter (K15). Ansprache (K05), Presse (K29), Prägung (K08)
  - wöchentlich 15 % zurück zu 0
  - Wirkung: ±1 % je Punkt, nur in Abschluss, Parade und Elfmeter
  - angezeigt in 7 Stufen: am Boden, verunsichert, zweifelnd, normal, sicher, selbstbewusst, strotzt vor Selbstvertrauen
- **Spielpraxis** (0–100 %): täglich × 0,97. Ein Pflichtspiel bringt +25 × Minuten/90, ein Testspiel 60 % davon. Wer einmal pro Woche spielt, bleibt bei 100. Wer vier Wochen nur auf der Bank sitzt, fällt von 100 auf etwa 43. Wirkung: unter 50 % linear bis −4 % bei 0.

### 5.5 Integration und Deutsch

- **Start bei Neuzugängen:** gleiche Liga 70 %, andere deutsche Liga 55 %, aus dem Ausland 35 %, dazu ±15 je nach Anpassungsfähigkeit.
- **Anstieg pro Woche:** 3–8 Punkte, mehr mit Einsatzzeit, Deutschkenntnissen, einer Integrationsfigur im Kader und Landsleuten.
- **Deutsch:** steigt pro Woche um 1–3 Punkte nach Anpassungsfähigkeit. Mit mehreren Landsleuten im Kader nur halb so schnell (Anstoss).
- **Wirkung im Spiel:** `0,92 + 0,08 × Integration`, also bis −8 %.

### 5.6 Merkmale lernen und verlieren

- **Lernfortschritt pro Woche:** leicht 12 %, mittel 6 %, schwer 3 %. Das sind etwa 8, 17 und 33 Wochen.
  - × Alter: bis 21 1,3; bis 25 1,1; bis 29 1; bis 32 0,8; danach 0,6
  - × Professionalität: `0,7 + 0,03 × P`
  - × Zufall 0,7–1,3 pro Woche
  - **Bremsen:** verletzt, im Urlaub oder in einer Woche ohne Training 0. Zwei Lernziele je 0,5. Frische unter 70 % 0,8. Stimmung unter 30 0,7 (K14).
- **Voraussetzungen:** passende Position, Altersgrenze („schnell“ bis 23, „beidfüßig“ bis 25), höchstens 4 Stärken.
- **Altersverlust:** Ab Positionsalter 31 verliert ein Spieler „schnell“ oder „ausdauernd“ pro Woche mit 0,6 % (Professionalität mindert), etwa jeder Vierte pro Saison. Ab 33 kann „langsam“ mit 0,5 % pro Woche dazukommen. Tempo geht zuerst (Rohmaterial 10).

**Lernen im Spiel** (entschieden 7.11.): Szenen im Spiel zahlen auf Merkmale ein, auch ohne Lernziel. Was klappt, bringt Fortschritt zur Stärke, was schiefgeht, Fortschritt zur passenden Schwäche. Die Szenen liefert die Engine (K04).

| Szene | Stärke ↔ Schwäche | klappt | geht schief |
|---|---|---|---|
| Ecke oder Flanke führt zum Tor | Flankengeber | +8 % | – |
| Kopfballtor, gewonnenes Kopfballduell im Strafraum | kopfballstark ↔ kopfballschwach | +6 % bzw. +1 % | verlorenes Kopfballduell vor einem Gegentor: Schwäche +4 % |
| direktes Freistoßtor | Freistoßspezialist | +15 % | – |
| Elfmeter | Elfmeterschütze | verwandelt +6 % | verschossen: −10 % auf den Fortschritt |
| gehaltener Elfmeter | Elfmetertöter | +20 % | – |
| Tor aus der Distanz | Weitschütze | +10 % | – |
| Großchance | Torjäger ↔ abschlussschwach | Tor +3 % | vergeben: Schwäche +2 % |
| Dribbling führt zur Chance | Dribbler | +3 % | – |
| Flanke oder Ecke (Torwart) | Strafraumbeherrscher ↔ Fliegenfänger | abgefangen +3 % | Fehlgriff vor einem Gegentor: Schwäche +10 % |
| Parade aus kurzer Distanz | Reflexe | +2 % | – |
| Patzer vor einem Gegentor | ↔ unkonzentriert | – | Schwäche +8 % |
| Foul mit Karte | ↔ ungestüm | – | Gelb +3 %, Rot +10 % |

- Bei 100 % ist die Stärke **gelernt** oder die Schwäche **entstanden**. Beides steht im Wochenbericht.
- **Höchstens 25 % pro Spiel** je Merkmal. Ein einzelnes Spiel macht also keinen Spezialisten. Training und Spiel zählen zusammen.
- Lernen im Spiel hängt **nicht** vom Alter ab, denn Erfahrung sammeln auch Ältere. Die Altersgrenzen („schnell“ bis 23) und die Höchstzahl von 4 Stärken gelten trotzdem.
- **Verlernen durch Misserfolg:** Jede gelernte Stärke hat ein Fehlerkonto, das bei 100 beginnt. Ein Fehlschlag in ihrer Szene kostet 25, ein Erfolg bringt 10, jede Woche kommen 2 dazu. Bei 0 ist die Stärke weg. Ein Elfmeterschütze verliert sein Merkmal also etwa nach vier Fehlschüssen ohne Treffer dazwischen.
- **Wer die Szenen bekommt, entscheidest du:** Wer bei dir Ecken, Freistöße und Elfmeter schießt (Standardschützen, K06), sammelt dort die Erfahrung. Damit wird die Wahl der Schützen eine echte Entscheidung.
- **Wirkung in der Engine** (Vorgabe für K04): Ein Merkmal verbessert seine Situation um 10–25 %. Über eine Saison soll es einem Stammspieler etwa so viel bringen wie 2–4 Stärkepunkte, aber nur in seinen Szenen. Hat eine Reihe dasselbe Merkmal mehrfach, zählt der zweite Spieler 60 %, der dritte 30 % (abnehmender Ertrag).

### 5.7 Persönlichkeit im Laufe der Zeit

- Am 1. Juli: ab 27 Jahren Professionalität mit 30 % +1, ab 28 Temperament mit 30 % −1, ab 26 als Stammspieler Führung mit 25 % +1.
- Prägungsereignisse (K08) und Ereigniskarten (K30) können einzelne Werte um 1–3 verschieben.
- Ändert sich dadurch eine Eigenschaft, kommt eine Nachricht, zum Beispiel „Er ist ruhiger geworden“.

### 5.8 Deckel für alle Zustände

Form, Frische, Selbstvertrauen, Spielpraxis, Integration und Stimmung wirken zusammen als ein Faktor auf die Stärke im Spiel. **Dieser Faktor bleibt zwischen 0,80 und 1,08.** Die Stärke bleibt so immer der Hauptwert (Rohmaterial, Grundsatz 2).

### 5.9 Startwerte für eine neue Karriere

**Echte Spieler zum Start (entschieden 7.11.):** Was sich aus öffentlichen, nachprüfbaren Fakten ableiten lässt, wird abgeleitet. Der Rest wird ausgewürfelt. Nie aus Klatsch oder Meinungen in der Presse.

| Wert | abgeleitet aus | sonst |
|---|---|---|
| Position, Nebenpositionen, Fuß | Daten | Zufall nach Gruppe |
| Nationalität | Daten | – |
| Führung | Kapitän oder Vizekapitän im Verein oder in der Nationalmannschaft → 15–18 | Zufall |
| Loyalität | Jahre im aktuellen Verein, eigener Nachwuchs. Ab 6 Jahren → 14–17. | Zufall |
| Temperament | Karten pro 90 Minuten der letzten zwei Saisons, Rote Karten zählen dreifach. Obere 10 % → 15–18, untere 25 % → 4–8. | Zufall |
| Robustheit | Ausfalltage durch Verletzungen der letzten drei Saisons. Viele → 3–6, kaum welche → 13–16. | Zufall |
| Anpassungsfähigkeit | Stationen im Ausland. Ab zwei → 12–16. | Zufall |
| Professionalität, Ehrgeiz, Druckresistenz | keine verlässlichen Fakten | Zufall |
| Merkmale | Elfmeterschütze (hat in den letzten zwei Saisons Elfmeter geschossen), Freistoßspezialist (direkte Freistoßtore), Torjäger (Tore je 90 Minuten deutlich über dem Schnitt seiner Position), Elfmetertöter (gehaltene Elfmeter) | Zufall nach Position und Stärke |

- Abgeleitet wird nicht im Spiel, sondern einmal per Skript aus zusätzlichen Spalten in `spieler.js`. Das Spiel liest nur das Ergebnis. Bearbeiten kannst du die Werte dort wie die Stärke.
- Abgeleitete Werte bekommen ±2 Zufall, damit nicht jede Karriere gleich beginnt.
- **Merkmale per Zufall:** im Schnitt 0,5 Stärken bei Stärke 55, 1 bei 65, 1,6 bei 75, 2,3 bei 85 und 3 ab 90, abgeleitete mitgezählt. „beidfüßig“ bekommen etwa 10 % der Feldspieler (Studien nennen bis zu 18 % in den Topligen, zu kalibrieren). Gewichtet nach Position, zum Beispiel Mittelstürmer oft Torjäger, Torhüter oft Reflexe. Schwächen im Schnitt 0,6 bei Stärke 60 und 0,3 bei 85.
- **Später erzeugte Spieler** (Nachwuchs K08, neue Talente K32): alles per Zufall, mit denselben Verteilungen.
- Kondition 75–85, Frische 100, Form 10, Selbstvertrauen 0, Stimmung 60–75, Integration 100, Spielpraxis 70.

## 6. Hebel des Spielers

| Hebel | Wirkt auf | Kosten und Risiko |
|---|---|---|
| Einsatzzeit | Spielpraxis, Formchance, Entwicklung | Frische, Verletzungsrisiko, Stimmung der Bankspieler (K14) |
| Schonen, rotieren | Frische | Spielpraxis sinkt, Ehrgeizige murren |
| Trainingsstufe (bis K07) | Aufwertung, Kondition | Frische, Verletzungen |
| Lernziel je Spieler | Merkmale | Trainingsplätze (K07, K16), zwei Ziele bremsen |
| Urlaubslänge (K12a) | Stimmung und Frische gegen Kondition | wenig Kondition zum Saisonstart |
| Lob, Kritik, Gespräch (K15) | Selbstvertrauen, Stimmung | Abnutzung, Glaubwürdigkeit |
| Leihe (K08, K19) | Spielpraxis für Talente | Kontrolle über Training und Einsatz geht verloren |
| Umschulung (K07) | Nebenposition | Wochen Training, Lernplatz belegt |
| Automatik | Co-Trainer wählt Lernziele und schont nach Frische | Ergebnis hängt von seiner Qualität und seinem Charakter ab (K16) |

## 7. Verhalten der Computer-Vereine

- **Gleiche Regeln**, gleiche Formeln, keine Hilfen.
- **Lernziele** wählt der Computer-Trainer aus einer Liste, die zur Position passt, gewichtet nach Vereinsprofil (K31). Zum Beispiel lässt ein Konter-Verein bevorzugt „schnell“ und „Torjäger“ lernen.
- **Rotation:** Spieler unter einer Frische-Schwelle werden geschont, Startwert 75 %, je Vereinsprofil anders.
- **Trainingsstufe:** normal bis K07, danach je Profil.
- **Bewertung** von Spielern (K19, K31) nutzt dieselben unscharfen Werte, die ihr Scouting liefert, nicht die echten.

## 8. Ereignisse

Ereigniskarten nach K30. Die meisten landen nur im Posteingang. Entscheidungen sind markiert.

| Karte | Auslöser | Folgen |
|---|---|---|
| Durchbruch | Spieler bis 21 legt in vier Wochen 2 Punkte oder mehr zu | Info, Selbstvertrauen +1, Medien (K29) |
| Formkrise (Entscheidung) | Form ≤ 4 über 3 Wochen | Gespräch, Pause oder Durchziehen: wirkt auf Selbstvertrauen und Form |
| Formhoch | Form ≥ 16 über 3 Wochen | Info, Gerüchte (K29), Interesse anderer Vereine (K19) |
| Merkmal gelernt | Lernfortschritt 100 % | Info, Erinnerung „Lernplatz frei“ |
| Nicht mehr der Schnellste | Altersverlust | Info, eventuell Gespräch über eine neue Rolle (K15) |
| Eigenschaft entdeckt | Co-Trainer-Bericht | Info |
| Der Trainingsweltmeister übertreibt | Vorbildprofi oder Trainingsweltmeister bei hartem Training | kleine Verletzung oder Lob vom Co-Trainer |
| Partynacht (Entscheidung) | Partylöwe, nach einem Sieg, Zufall | Strafe, Gespräch oder Ignorieren: Stimmung, Presse, Kondition |
| Heimweh (Entscheidung) | Heimweh-Typ, Integration < 40 nach 8 Wochen | Familie holen (Kosten), Landsmann verpflichten, Geduld |
| Der Hitzkopf und der Schiedsrichter | Hitzkopf, Rote Karte | Verfahren (K09), Presse (K29) |

Dosierung nach dem Gesamtbudget (Konsistenzprüfung B1): höchstens eine Karte aus K03 mit Entscheidung pro Woche.

## 9. Wechselwirkungen

| Konzept | Was es von K03 braucht oder liefert |
|---|---|
| K04 Engine | Stärke, Zustandsfaktor (5.8), Merkmal-Haken, Selbstvertrauen in Schlüsselszenen. **Muss liefern:** erwartete Note je Spieler, Noten relativ zur Erwartung. |
| K06 Taktik | Grundordnungen mit den 14 Positionen aus 3.1a, Schienenspieler als Platz. **Neue Voraussetzungen des Spielstil-Kreislaufs** (ersetzt die Zahlenwerte aus Rohmaterial 11): Pressing braucht Kondition, Frische, „schnell“, „ausdauernd“, „zweikampfstark“. Ballbesitz braucht Stärke im Mittelfeld, einen starken Spieler auf der Position Spielmacher, „ballsicher“. Mauern braucht „zweikampfstark“, „stellungssicher“, „kopfballstark“. Konter braucht „schnell“, „Torjäger“. Flügelspiel braucht „Flankengeber“, „kopfballstark“. Kein Stil hängt an nur einem Merkmal. |
| K07 Training | ersetzt die Trainingsstufe in 5.1 und 5.3 durch Einheiten. Lernziele als Einzeltraining. Kondition und Frische als Belastungssteuerung. |
| K08 Jugend | Volatilität (5.1), Prägung verschiebt Talent und Persönlichkeit, Mentor |
| K10 Medizin | Robustheit, Frische unter 80 %, Ausfalltage |
| K12a Sommer | Urlaub senkt Kondition und hebt Frische und Stimmung, Vorbereitung baut Kondition auf |
| K14 Kabine | rechnet Stimmung, nutzt Eigenschaften, Beziehungen und Deutsch |
| K15 Gespräche | Lob und Kritik auf Selbstvertrauen, Reaktion nach Charakter |
| K16 Stab | Lerntempo, Zahl der Lernplätze, Genauigkeit der Talentschätzung, Automatik |
| K18 Scouting | **Neue Scouting-Spannen** (ersetzt Rohmaterial 4.5): Stärke als Spanne, zum Beispiel „70–76“. Talent als Sterne-Spanne. Merkmale bekannt, vermutet oder unbekannt. Eigenschaften nur mit gutem Scout oder als Gerücht. |
| K19, K21 Markt | Marktwert und Gehalt nach Stärke, Alter und Talent, dazu Merkmale. Loyalität, Ehrgeiz, Söldner. |
| K27, K25 Fans | Publikumsliebling, Teenie-Star |
| K29 Presse | Charakter steuert Reaktionen und Schlagzeilen |
| K31 Computer-Vereine | Lernziele und Rotation nach Profil |
| K32 Welt | neue Spieler mit denselben Werten, Karriereende |
| K34 Statistik | monatlicher Verlauf |
| K35a Oberfläche | Spielerkarte mit allen Werten als Regler: Stärke mit Talent-Band, Form mit Trend, Frische, Kondition, Selbstvertrauen in Worten, Merkmale als Plaketten mit Lernbalken, Eigenschaften, unbekannte als „?“ |

## 10. Zielwerte und Tests

**Echte Anker:** Höhepunkt der Leistung bei Stürmern etwa mit 25–26, bei Abwehr und Mittelfeld mit 25–27, bei Torhütern später (je nach Studie 27–31). Nach dem Höhepunkt bauen Stürmer und Mittelfeldspieler am schnellsten ab, Torhüter und Verteidiger langsam. Profikarrieren enden im Schnitt mit etwa 33 (Quellen). Die Zahlen schwanken je nach Studie und Messgröße, deshalb sind sie Richtwerte.

Neues Testskript `tests/spielermodell.js`, jeweils mit vielen Seeds:

| Prüfung | Ziel |
|---|---|
| Alterskurve | mittlere Stärkeänderung pro Saison je Altersgruppe wie in der Alterstabelle, ±0,5 |
| Höhepunkt | Feldspieler im Schnitt mit 26–28 am stärksten, Torhüter mit 28–31 |
| Streuung bei Jungen | Von den 17–19-Jährigen legen 5–15 % in einer Saison +7 oder mehr zu, 3–10 % stagnieren oder fallen |
| Gleichgewicht der Welt | Durchschnittsstärke der besten 14 je Liga über 10 Saisons stabil, ±1,5. Zahl der Spieler ab 85 in der 1. Liga ±30 %. |
| Formverteilung | 60–85 % der Werte zwischen 7 und 13, höchstens 5 % bei ≤ 4 oder ≥ 16 |
| Keine Formspirale | Die vier stärksten Kader der 1. Liga haben im Schnitt höchstens 1,5 mehr Form als die vier schwächsten. (Der Meister taugt nicht als Maß, weil er meist die Mannschaft ist, die über ihrer Erwartung gespielt hat.) |
| Frische | 1 Spiel pro Woche: zum nächsten Spiel wieder 100 %. 3 Spiele in 8 Tagen: danach 72–82 %. Nach 3 Ruhetagen wieder mindestens 90 %. |
| Kondition | 4 Wochen Urlaub: −15 bis −20. 5 Wochen Vorbereitung bei hartem Training: zurück auf mindestens 80. |
| Merkmale je Liga | Stammspieler der 1. Liga im Schnitt 1,6–2,4 Stärken, 3. Liga 0,8–1,2, über 10 Saisons stabil |
| Lerndauer | Medianer Lernweg „mittel“ bei 25-Jährigen mit Training: 14–20 Wochen |
| Formserie | Ein Stürmer, der viermal in Folge trifft, steht danach bei Form 14–16 und wächst in den Wochen danach 2- bis 3-mal so schnell wie bei Form 10 |
| Serien der Großen | Der Meister bekommt über die Saison höchstens halb so viel Serienbonus wie das Team, das seine Erwartung am stärksten übertrifft |
| Lernen im Spiel | Ein Stammspieler, der alle Ecken tritt, wird allein aus dem Spiel in 1–2 Saisons Flankengeber. Ein Elfmeterschütze verliert das Merkmal frühestens nach vier Fehlschüssen in Folge. |
| Fuß | 75–80 % Rechtsfüße unter den Feldspielern |

**Akzeptanztests gegen Ausnutzung:**
- **Merkmal-Sensitivität** (nach U3, mit der neuen Engine): Ein Merkmal bei einem Stammspieler bringt 0,3–2 Punkte pro Saison. Kein Merkmal bringt mehr als das Dreifache des Medians. „schnell“ wird gesondert geprüft, damit Tempo keine Allzweckwaffe wird (Recherche 4c).
- **Schonen lohnt nicht immer:** Ein Stammspieler, der die ganze Saison nur jedes zweite Spiel macht, entwickelt sich nicht besser als einer, der jedes Spiel macht.
- **Dauerhaft hart trainieren:** Der Gewinn an Aufwertungen wird durch Verletzungen und Frische aufgezehrt. Gesamtbilanz über eine Saison höchstens leicht positiv.
- **Talent-Zucht:** Höchstens einer von 1000 Spielern steigt in einer Saison um mehr als 10 Punkte. Niemand überschreitet sein Talent.

## 11. Stellschrauben

Neuer Aufbau des Abschnitts `spieler` in `daten/regeln.js` (Skizze, Namen in U2 endgültig):

```js
spieler:{
  entwicklung:{tageProSaison:320,               // verbucht nach jedem Pflichtspiel, sonst montags (5.1)
    alter:[[19,4.9,0.7],[22,3.5,0.9],[25,2.0,1.0],[28,1.1,1.1],   // [bis Alter, Wachstum, Abbau] pro Saison
           [30,0.8,1.3],[32,0.6,2.0],[34,0.4,2.9]],sonst:[0.3,3.7],
    positionsAlter:{TW:-3,AB:-1,MF:0,ST:1},abbau:{TW:0.7,AB:0.85,MF:1,ST:1},
    talentWeich:6,formBasis:1.2,praxis:{hoch:60,auf:1.2,tief:20,aufTief:0.7,abTief:1.3,abTiefAb:29,halbBis:18},
    training:[0.8,1,1.2],profi:{auf:[0.8,0.02],ab:[1.2,-0.02]},zufall:0.05,jung:{bisAlter:21,zufall:2}},
  form:{mitte:10,min:0,max:20,jeNote:1.5,ausgleich:0.10,wirkung:0.005,serie:{spiele:5,abPunkte:4,bonus:0.5}},
  frische:{spiel:15,ko:[1.5,-0.007],ausdauernd:0.75,erholung:[3,0.1],alter:[[23,1.1],[29,1],[32,0.9]],alterSonst:0.8,
    koErholung:[0.8,0.004],training:[1,2,3],risikoUnter:80},
  kondition:{ziel:[70,80,90],tempo:0.20,altAb:30,altJeJahr:1,partyloewe:8,urlaub:0.6,verletzt:0.5,spiel:1,start:[75,85]},
  selbstvertrauen:{min:-3,max:3,tor:0.5,siegtor:0.8,guteNote:0.3,elfmeterVerschossen:-0.8,patzer:-0.8,schlechteNote:-0.3,
    ausgleich:0.15,wirkung:0.01},
  spielpraxis:{zerfall:0.97,jeSpiel:25,testspiel:0.6,wirkungUnter:50,wirkungMax:0.04,start:70},
  integration:{start:{liga:70,land:55,ausland:35,anpassung:15},woche:[3,8],wirkung:0.08,deutschWoche:[1,3],landsleute:0.5},
  lernen:{woche:{leicht:12,mittel:6,schwer:3},alter:[[21,1.3],[25,1.1],[29,1],[32,0.8]],alterSonst:0.6,
    profi:[0.7,0.03],zufall:[0.7,1.3],zweiZiele:0.5,frischeUnter:[70,0.8],stimmungUnter:[30,0.7],maxStaerken:4,
    verlustAb:31,verlust:0.006,langsamAb:33,langsam:0.005,  // je Woche
    spiel:{/* Szene → Merkmal, Fortschritt bei Erfolg und Fehlschlag, Tabelle 5.6 */},spielMax:25,
    fehlerkonto:{start:100,fehler:25,erfolg:10,woche:2}},
  zustand:{min:0.80,max:1.08},                    // Deckel für alle Zustände zusammen (5.8)
  positionen:{gruppe:{TW:'TW',IV:'AB',LV:'AB',RV:'AB',DM:'MF',ZM:'MF',SM:'MF',OM:'MF',LM:'MF',RM:'MF',MS:'ST',HS:'ST',LA:'ST',RA:'ST'},
    // Eignung von → nach in %, rechte Seite spiegelbildlich (RV wie LV usw.)
    nah:{IV:{DM:85,LV:75,RV:75},LV:{LM:85,RV:80,IV:75},DM:{ZM:90,IV:80,SM:80},ZM:{DM:90,OM:90,SM:85,LM:75,RM:75},
         SM:{OM:90,ZM:85,DM:75},OM:{SM:90,ZM:85,HS:85,LA:75,RA:75},LM:{LA:85,RM:80,LV:75,ZM:75},
         MS:{HS:85,LA:70,RA:70},HS:{MS:85,OM:85,LA:75,RA:75},LA:{LM:85,RA:85,HS:75,MS:75}},
    gleicheGruppe:70,andereGruppe:55,torwartFeld:45,neben:[85,95],vielseitig:5,
    falscheSeite:{faktor:0.92,positionen:['LV','RV','LM','RM']}},
  fuss:{rechts:0.77,links:0.23},                 // Zufall, wenn die Daten nichts sagen. Studien: 20–30 % Linksfüße unter Profis
  persoenlichkeit:{mitte:10,streuung:3.5,min:1,max:20},
  eigenschaftEntdecken:[2,8],                     // Wochen bis zur Meldung
  merkmale:{ /* Katalog aus 3.4: Kürzel, Name, Art, Positionen, Schwierigkeit, bisAlter, altersverlust, Engine-Haken */ },
  eigenschaften:{ /* Katalog aus 3.5: Kürzel, Name, Art, Bedingung, Wirkung */ },
  start:{merkmale:[[55,0.5],[65,1],[75,1.6],[85,2.3],[90,3]],schwaechen:[[60,0.6],[85,0.3]],beidfuessig:0.1,nebenposition:0.15,stimmung:[60,75]},
  talentSchaetzung:{fehler:1,genauNachJahren:2},  // Sterne bis zu 1 daneben, nach 2 Jahren im Verein meist genau (ab K16 vom Co-Trainer)
  // bleiben wie heute: talent, talentSonst, vertrag, gehalt, marktwert, sterne, niveauSpieler, niveauLeer
}
```

Die bisherigen Einträge `training.wachstum`, `training.zufall`, `training.fitnessGrenze`, `training.erholung`, `training.abbau`, `engine.staerke.formJePunkt` und `engine.form` werden durch diese ersetzt. Die Trainingsstufe bleibt, bis K07 sie ablöst (Grundsatz „nichts wegnehmen“).

## 12. Offene Fragen

**Entschieden am 7. November 2026:**
- **Entwicklung der Stärke** in kleinen Schritten an jedem Spieltag. Die Form beschleunigt oder bremst sie: Tore in Serie, Paraden, Siegesserien gegen die Erwartung, und genauso umgekehrt (5.1, 5.2).
- **Lernen im Spiel:** Szenen wie Ecken mit Torfolge zahlen auf Merkmale ein, Fehlschläge auf Schwächen (5.6).
- **Charakter:** Bei echten Spielern wird abgeleitet, was sich aus Fakten belegen lässt, sonst Zufall. Später erzeugte Spieler bekommen nur Zufall (5.9).
- **Nationalität** wird festgelegt (Feld `nat`). Wann die Daten nachgetragen werden, ist egal.
- **Positionen:** 14 feine Positionen in vier Gruppen, ergänzt um zentrales Mittelfeld, hängende Spitze und die Seiten (3.1a). Kein Libero.
- **Fuß:** rechts oder links, deutlich mehr Rechtsfüße (77 %). „beidfüßig“ ist ein Merkmal.
- **„Trainingsweltmeister“** in der umgangssprachlichen Bedeutung.
- **Katalog:** Die Größe bleibt. Ein Spieler zeigt nur 0–4 Merkmale und meist 0–2 Eigenschaften, das bleibt lesbar, und die Breite sorgt für Abwechslung. Das Merkmal „Spielmacher“ entfällt, weil es jetzt eine Position ist. Neu gilt: erst zeigen, wenn es wirkt (3.4, 3.5).
- **Talentsterne** der eigenen Spieler dürfen um einen Stern danebenliegen. Nach zwei Jahren im Verein stimmen sie meist, ab K16 hängt die Genauigkeit vom Co-Trainer ab.

**Noch offen (nur Recherche, keine Entscheidung):**
1. **Datenquelle** für feine Positionen, Fuß, Kapitänsamt, Karten, Verletzungstage und Elfmeter. Die Wikipedia-Kader haben das nicht vollständig. Klären, wenn die Datenpflege ansteht.

## Quellen

- Anstoss 3: GameStar 4/2000, Entwickler-Tipps von Gerald Köhler (von dir hochgeladen, ausgewertet in PLAN §4)
- Alterskurven nach Position: [Linköping University, Studie zu schwedischen Ligen (PDF)](https://www.ida.liu.se/~nikca89/papers/isace24.pdf), [ESPN: Soccer age curves show goalkeepers, central defenders peak latest](https://global.espn.com/football/story/_/id/37467220/soccer-age-curves-show-goalkeepers-central-defenders-peak-latest), [BMC Sports Science, Medicine and Rehabilitation (2025)](https://www.link.springer.com/article/10.1186/s13102-025-01312-1), [Frontiers in Psychology (2021, PDF)](https://frontiersin.org/articles/10.3389/fpsyg.2021.661523/pdf)
- Linksfüße unter Profis 20–30 %, beidfüßig bis 18 %: [Scientific Reports (2020)](https://dx.doi.org/10.1038/s41598-020-71478-w), [StatsBomb: Footedness](https://blogarchive.statsbomb.com/articles/soccer/footedness-and-why-erik-lamela-is-worth-30m/), [Psychology Today zu Linksfüßigkeit im Profifußball](https://psychologytoday.com/sg/blog/the-asymmetric-brain/202212/messi-magic-left-footedness-in-professional-soccer-players)
- Karriereende im Schnitt mit 33: SoccHealth-Studie laut [Ärzte Zeitung](https://www.aerztezeitung.de/Panorama/Studie-erforscht-langfristige-Gesundheitsfolgen-ehemaliger-Fussballprofis-453354.html)
- FM-Faustregel „erst Training, dann Spiele“, Tempo als Allzweckwaffe: `konzepte/_recherche-genre.md`, Abschnitte 3.1 und 4c
