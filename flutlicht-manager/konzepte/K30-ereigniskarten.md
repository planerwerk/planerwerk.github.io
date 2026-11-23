# K30 – Ereigniskarten und Story-Playbook (Gerüst)

Status: **Entwurf des Gerüsts** (7. November 2026), geschrieben ohne Rücksprache. Der Katalog wächst laufend (PLAN §3). Gerüst und fünf Karten gebaut in U12d (§5.5, 20.11., ohne Testlauf).
Hängt ab von: K01 (Halte), K02 (Zufall), allen Bereichen, die Karten liefern · Wird gebraucht von: allen Konzepten mit Abschnitt 8.

## 1. Ziel und Spielgefühl

- **Geschichten, die aus dem Spiel entstehen:** Karten hängen an echten Zuständen (Form, Stimmung, Beziehungen, Verträge), nicht an Zufall allein.
- **Dosiert, damit es nicht zu viel wird** (PLAN §2). We Are Football 1 wurde für „zu viele Karten“ kritisiert (Recherche 3.2). Bei uns gilt ein festes Budget für Unterbrechungen.
- **Entscheidungen mit Folgen,** sofort und später, manchmal als Kette.
- **Ton:** mit Humor, wie Anstoss (Recherche 2.2), aber ohne Albernheit, die das Spiel entwertet.

## 2. Vorbilder und Abgrenzung

- **PLAN §4 (Notizen zu K30):** Aufbau einer Karte, Dosierung, erste Ideen. Übernommen.
- **Football Manager:** Ereignisse und Pressefragen, oft ohne spürbare Folgen (Recherche 4). Bei uns hat jede Option eine Wirkung, die das Spiel wirklich rechnet.
- **Bewusst anders:** Die meisten Karten sind **Infos im Posteingang,** nur wenige halten an. Karten werden aus den Konzepten gespeist, nicht als loses Zufallsfeuerwerk.

## 3. Begriffe und Daten

### 3.1 Aufbau einer Karte

| Teil | Inhalt |
|---|---|
| Kennung, Titel, Bereich | zum Beispiel `heimweh`, „Heimweh“, K03 |
| Gewicht | klein oder groß |
| Art | Info (Posteingang) oder Entscheidung (Halt) |
| Auslöser | Bedingungen über den Spielstand („Heimweh-Typ, Integration unter 40 seit 8 Wochen“) |
| Häufigkeit | Grundchance je Prüfung (täglich oder wöchentlich) |
| Sperrzeit | wie lange dieselbe Karte nicht wiederkommt (je Spieler oder je Verein) |
| Beteiligte | Rollen, die beim Auslösen besetzt werden (Spieler, Verein, Berater, Journalist) |
| Textvarianten | mehrere Texte mit Platzhaltern (`{spieler}`, `{verein}`) |
| Entscheidungen | 0 bis 3 Optionen, je mit Kosten, Wirkungen und Wahrscheinlichkeiten |
| Folgen | sofort und verzögert (in N Tagen) |
| Folgekarten | Kette mit Bedingung und Verzögerung |

### 3.2 Wirkungen

Karten dürfen nur Werte ändern, die es im Spiel gibt (K35a: Texte beschreiben nur, was das Spiel rechnet). Erlaubte Wirkungen, jeweils mit Ziel und Betrag:

- Stimmung, Selbstvertrauen, Form, Frische, Kondition (K03, K14)
- Zusammenhalt, Glaubwürdigkeit (K14, K15)
- Vertrauen des Vorstands, Ruf des Trainers (K28)
- Beziehung zu Verein, Berater, Journalist (K17)
- Geld (K23), Fans (K27, später)
- Persönlichkeit um 1–3 (K03 §5.7), Talent (nur über K08)
- Merker für Ketten („Familie ist umgezogen“)
- **Seit U18b (20.11.2026, K32 §8):** Fans (Baustein Umfeld der Fanstimmung, K27), einen Vereinslosen verpflichten (ein Jahr, Anteil am üblichen Gehalt), Wechselinteresse eines Spielers an dir (K19 §5.3, bis Saisonende), Angebot eines Vereins für deinen Spieler (Vielfaches des Marktwerts, danach wie jedes Angebot, K19 §5.4). Im Code `fans`, `verpflichten`, `interesse`, `angebot`.
- **Seit K23e (21.11.2026, K23 §8):** Einfluss eines Mäzens (`maezen`): Der Präsident mischt sich bis zum Saisonende auch ohne Ehrgeiz ein (Karte „Der Präsident mischt sich ein“).
- **Seit K25b (21.11.2026, K25 §8):** Fanartikel (`merch`): Erlös × (1 + Wert) für vier Wochen (Karte „Trikot ausverkauft“).
- **Seit K23f (22.11.2026, popolupo, ohne Testlauf):** Geld (`geld`, auch der schlechte Ausgang) gilt als Betrag für die 3. Liga und wird mit der Liga deines Vereins mal 2 (2. Liga) oder mal 4 (1. Liga) genommen (`REGELN.karten.geldLiga`, `kartenGeld`). In Texten steht der Betrag als Platzhalter `{geld:Grundwert}` und erscheint umgerechnet. Grund: Seit K23c sind die Einnahmen der 1. Liga etwa 13-mal so groß wie die der 3. Liga.

### 3.3 Speicherorte

- Katalog: `daten/karten.js` (Stammdaten, mit Texten).
- Logik: `js/karten.js`.
- Dosierung und Grundchancen: `daten/regeln.js` → `karten`.
- Spielstand: zuletzt gezogene Karten mit Datum (Sperrzeiten), offene Ketten (`S.karten`).

## 4. Abläufe

1. **Prüfen** (täglich in „Tag beenden“ für tägliche, montags für wöchentliche Karten): Welche Karten sind auslösbar?
2. **Auswählen:** Gewichtung nach Grundchance und Priorität, Zufall aus dem Tag-Strom „ereignisse“ (K02).
3. **Budget prüfen** (5.1): Ist eine Entscheidung noch drin? Sonst wird eine Entscheidungskarte als Info gezeigt (der Co-Trainer entscheidet nach Automatik, K16) oder zurückgestellt.
4. **Zeigen:** Info im Posteingang oder Halt mit Entscheidung.
5. **Folgen** anwenden, verzögerte Folgen und Folgekarten in den Kalender legen.

## 5. Regeln und Formeln

### 5.1 Dosierung

| Grenze | Wert |
|---|---|
| Halte insgesamt pro Woche | 2–4 (PLAN §2), Spiele mitgezählt |
| Entscheidungskarten | höchstens eine kleine pro Woche, eine große pro Monat (PLAN §4) |
| je Bereich | höchstens eine Entscheidungskarte pro Woche (so in K03, K06 und anderen vorgesehen) |
| Infos | ohne Grenze, aber höchstens 5 Karten-Infos pro Woche, damit der Posteingang lesbar bleibt |

- Der **Regler Meldungsdichte** (K35a) verschiebt die Grenzen: wenig (eine Entscheidung alle zwei Wochen), normal, viel (zwei pro Woche).
- **Zurückgestellte** Karten verfallen nach ihrer Gültigkeit (Standard 14 Tage), wenn der Auslöser nicht mehr gilt.

### 5.2 Priorität

1. Karten aus Fristen und Pflichten (Sportgericht, Gesprächswunsch Stufe 2, Ultimatum)
2. große Karten mit Kettenfortsetzung
3. Karten mit hoher Bedeutung für den Spieler (Stammspieler, Kapitän)
4. übrige

### 5.3 Wiederholung

- Sperrzeit je Karte und Beteiligtem (Standard 120 Tage).
- Textvarianten werden reihum genutzt, damit sich nichts wöchentlich wiederholt (Lehre aus den Pressekonferenzen, Recherche 4).

### 5.4 Seltenheit und Größe des Katalogs (mit dir entschieden am 10. November 2026)

Es darf sehr viele Karten geben, gern 1000, aber viele davon so selten, dass erst nach etwa 2000 Saisons alle einmal vorgekommen sind. So bleibt auch eine lange Karriere voller Überraschungen. Ausgearbeitet, vorläufig:

**Drei Ebenen:**
1. **Kategorie** mit eigener Rate, zum Beispiel „Kabine“, „Transfermarkt“, „Fans“, „Skandal“. Die Kategorie legt fest, wie oft überhaupt etwas aus ihr kommt. Beispiel: ein Skandal etwa einmal in zehn Saisons (8.4).
2. **Szenario** innerhalb der Kategorie, mit Seltenheitsstufe und Bedingungen (zum Beispiel nur in der 1. Liga, nur mit einem Spieler, der heiratet).
3. **Varianten** je Szenario: Texte, Beteiligte aus der Spielwelt, kleine Abweichungen bei den Folgen.

**Seltenheitsstufen** (je Szenario, wenn seine Bedingungen erfüllt sind):

| Stufe | etwa einmal in | Anteil am Katalog bei 1000 Szenarien | Karten pro Saison |
|---|---|---|---|
| häufig | 3 Saisons | 150 | 50 |
| gelegentlich | 20 Saisons | 300 | 15 |
| selten | 100 Saisons | 350 | 3,5 |
| sehr selten | 400 Saisons | 200 | 0,5 |

Nachgerechnet mit einem kleinen Simulationsskript: Mit diesen Stufen sind nach 10 Saisons etwa 30 % der Szenarien vorgekommen, nach 30 Saisons etwa die Hälfte, nach 100 Saisons gut 70 %. **Bis alle einmal da waren, dauert es im Mittel etwa 2.200 Saisons** (in neun von zehn Läufen zwischen 1.800 und 3.000). Das passt zu deinem Wunsch. Die meisten Karten sind Infos im Posteingang, Halte und Entscheidungen bleiben im Budget aus 5.1.

**Regeln dazu:**
- Ein **sehr seltenes Szenario** kommt in einer Karriere höchstens einmal.
- Zufall aus dem eigenen Strom „ereignisse“ (K02), Neuladen bringt keine andere Karte.
- **Inhalte wachsen nach und nach** als Daten (`daten/ereignisse.js`): Vorlagen mit Platzhaltern für Beteiligte, Varianten und Folgen. 1000 Szenarien sind ein Ziel über viele Schritte, kein Startumfang.
- **Sammlung (Idee, vorläufig):** Das Spiel merkt sich über alle Karrieren im Browser, welche Szenarien du schon erlebt hast („Chronik: 137 von 1000“), getrennt vom Spielstand. Seltene Funde sind so eine kleine Belohnung.

### 5.5 Umsetzung U12d (20. November 2026, ohne Testlauf): das Gerüst und die ersten fünf Karten

**Dateien:**

- Katalog: `daten/karten.js` (`KARTEN`), mit Texten, Optionen und Wirkungen als Daten.
- Logik: `js/karten.js`. Die Auslöser sind dort benannte Prüfungen (`AUSLOESER`), auf die der Katalog mit einem Namen zeigt. So bleibt Logik aus den Stammdaten heraus.
- Zahlen: `REGELN.karten`.

**Prüfen und Auswählen** (montags, eigener Strom `ereignisse` je Tag):

1. Die Karten des Katalogs werden in gemischter Reihenfolge geprüft.
2. Eine Karte ist auslösbar, wenn:
   - ihr Auslöser Beteiligte findet,
   - ihre Sperrzeit für diese Beteiligten vorbei ist (Standard 120 Tage),
   - eine sehr seltene Karte in dieser Karriere noch nicht kam.
3. Sie kommt dann mit der Chance 1 / (Saisons der Seltenheitsstufe × 40 Wochen). Eine häufige Karte (alle 3 Saisons) hat also 1 zu 120 je Woche, in der ihre Bedingungen erfüllt sind.
   - **Anlasskarten (K30d, 22.11.2026, popolupo, vorläufig, ohne Testlauf):** Eine Karte kann statt der Stufe eine eigene `chance` je Woche tragen (0 < chance ≤ 1, im Katalog).
   - Das gilt für Karten, deren Anlass selbst selten ist und nur wenige Wochen besteht, etwa ein Auswärtsspiel im Europapokal oder eine Aufholjagd. Mit 1 zu 120 kämen sie praktisch nie (K37 §12 Nr. 21).
   - Es bleibt ein Würfel je Karte und Woche. Budget, Sperre und Info-Grenze gelten wie für alle Karten.
   - Seltenheit nach §5.4 bleibt für Karten ohne festen Anlass. Die Raten in §5.4 zählen Anlasskarten nicht mit.
   - Gesetzt sind bisher: Fanmarsch 0,15, Reisechaos 0,1, Pyrotechnik 0,1, Wunder 1 (eine Aufholjagd wird immer gemeldet). Seit K10e auch Grippewelle 0,5 und lange Reha 0,03.
4. Der Regler Meldungsdichte ist seit K30b gebaut (22.11.2026, popolupo, ohne Testlauf): im Menü wenig, normal oder viel. „Wenig“ erlaubt eine kleine Entscheidung mit Halt je zwei Wochen und 3 Karten-Infos je Woche, „viel“ zwei kleine je Woche, zwei große je Monat und 8 Infos. Die Karten kommen gleich oft (gleiche Würfel), was nicht ins Budget passt, entscheidet der Co-Trainer. Seit Prüfung DY8 zählen Entscheidungen ohne Halt nicht mehr zur Info-Grenze, sie fallen also nie weg. Die Grenze von 4 Halten je Woche (Spiele mitgezählt) gilt in jeder Stufe. Ohne Einstellung „normal“.

**Dosierung (§5.1):**

- Höchstens 5 Infos je Woche.
- Höchstens eine kleine Entscheidung je Woche und eine große je Monat, je Bereich höchstens eine je Woche.
- Halte je Woche höchstens 4, eigene Spiele der Woche mitgezählt.
- Passt eine Entscheidung nicht ins Budget, entscheidet die Automatik: Der Co-Trainer wählt die Voreinstellung der Karte, und sie kommt als Info („Der Co-Trainer hat … entschieden“).

**Entscheidungen:**

- Eine Entscheidungskarte hält am selben Tag an (Halt „Ereignis“) und steht oben im Büro, mit ihren Optionen als Knöpfen.
- Gehst du weiter, ohne zu wählen, entscheidet am nächsten Tag die Automatik.
- **Lizenz-Bereich `ereignisse`** (Grundlizenz, mit Automatik, K36): Wer will, lässt den Co-Trainer alle Karten entscheiden. Dann kommen sie nur noch als Info.

**Wirkungen** (nur erlaubte, §3.2):

| Wirkung | Ziel |
|---|---|
| `stimmung` | Beteiligter Spieler |
| `stimmungAlle` | Kader |
| `zusammenhalt` | Kader |
| `glaub` | Glaubwürdigkeit |
| `vertrauen` | Vertrauen des Vorstands |
| `ruf` | Ruf als Trainer |
| `bezDu` | Beziehung zum beteiligten Verein |
| `geld` | Buchung „Ereignisse“ |

Jede Wirkung kann eine Chance haben. Dann wird im Strom `ereignisse` gewürfelt, und sie hat einen Text für Erfolg und Misserfolg.

**Texte:** Platzhalter `{spieler}`, `{verein}`, `{praesident}`. Varianten werden reihum genutzt (§5.3).

**Spielstand `S.karten`:**

- `sp`: Sperren, Karte und Beteiligte → Tag.
- `w`: Zähler der Woche und des Monats.
- `offen`: offene Entscheidungen.
- `v`: Zeiger auf die Textvariante je Karte.
- `log`: die letzten 100 Karten, für Tests und Statistik.
- `einmal`: sehr seltene Karten, die schon kamen.

**Die ersten fünf Karten** (aus Konzepten, deren Werte das Spiel schon rechnet):

| Karte | Konzept | Art | Auslöser | Optionen und Wirkungen |
|---|---|---|---|---|
| Der Präsident mischt sich ein | K28 §8 | Entscheidung, klein | Präsident mit Ehrgeiz ab 14, die letzten drei Ligaspiele verloren | „Er bekommt seine Chance“: Vertrauen +5, Glaubwürdigkeit −3. „Ich stelle auf“: Vertrauen −5, Glaubwürdigkeit +3 (Voreinstellung) |
| Rückendeckung vom Vorstand | K28 §8 | Info | Vertrauen ab 80, obwohl du unter dem Saisonziel stehst | keine |
| Versöhnung | K17 §8 | Entscheidung, klein | Beziehung zu einem Verein unter −50 | „Treffen vorschlagen“: mit 60 % Beziehung +20, sonst −5. „Abwarten“: nichts (Voreinstellung) |
| Ein Spieler heiratet | PLAN §4, K14 | Entscheidung, klein | ein Spieler deines Kaders zwischen 24 und 34 (Sperre je Spieler 2000 Tage) | „Teamausflug zur Feier“: −20.000 €, Zusammenhalt +3, Stimmung des Spielers +5. „Glückwunschkarte“: Stimmung +2 (Voreinstellung) |
| Geheimtipp | K18 §8 | Info | ein Talent bis 20 bei einem Verein der 2. oder 3. Liga mit großem Talent | keine, nur der Hinweis |

Noch nicht gebaut: verzögerte Folgen ohne eigene Karte, die Chronik über alle Karrieren (§5.4), die schweren Skandale (§8.4, die ersten zwei seit K30f, die Manipulation in der 3. Liga seit K30g), Kategorien mit eigener Rate. Ketten und Merker gibt es seit K30c (§5.6).

### 5.6 Umsetzung K30c (22. November 2026, popolupo, ohne Testlauf): Ketten und „Der lachende Dritte“

**Ketten (§3.1, §4 Nr. 5):**

- Eine Option kann eine Folgekarte anstoßen: `kette:{karte, tage:[von, bis]}` in `daten/karten.js`.
- Wird die Option gewählt (von dir oder vom Co-Trainer), legt das Spiel die Folgekarte in `S.karten.kette`.
  - Sie kommt nach `von` bis `bis` Tagen.
  - Gezählt wird ab dem Tag der ersten Karte, nicht ab dem Tag der Antwort.
  - Gewürfelt wird im Strom der ersten Karte, nach ihren Wirkungen. Wann du antwortest, ändert also nichts.
- **Folgekarten** tragen `nurKette:true`. Im Wochenlauf werden sie nicht gezogen.
- Ihr Auslöser bekommt die Beteiligten der ersten Karte und bestätigt sie oder gibt `null` zurück. Zum Beispiel: Ist der Spieler noch beim selben Verein?
- **Täglich** (`kartenKette`, eigener Strom) kommen die fälligen Folgekarten:
  - Ist der Auslöser nicht mehr erfüllt, verfällt die Folgekarte still.
  - Es gilt das Budget für Entscheidungen wie montags. Passt die Karte nicht hinein, entscheidet der Co-Trainer.
  - Sperre und Info-Grenze gelten nicht. Eine Kette läuft zu Ende oder verfällt (§5.2: Ketten vor den übrigen Karten).
- **Ketten enden** mit der Saison, bei der Entlassung und beim Vereinswechsel.
- **Merker** stehen dort, wo sie gebraucht werden. Beim lachenden Dritten ist das der Spieler (`p.ld3`).
- Das Prüfskript (`tests/karten.js` Fall 1 und `kartenpruefung.pl`) prüft:
  - Jede Folgekarte existiert und hat `nurKette`.
  - Jede `nurKette`-Karte hat einen Vorgänger.
  - `tage` ist gültig.

**Der lachende Dritte (§8.3, K17 §5.4), Karte 1 „dritterTipp“** (Entscheidung, klein, häufig, Sperre 365 Tage):

- **Auslöser:** im offenen Fenster ein Spieler auf der Transferliste eines Computer-Vereins, dazu:
  - Er passt in deinen Kader (wie der Bedarf der Computer-Vereine).
  - Mindestens zwei andere Computer-Vereine könnten mitbieten. Dafür gelten dieselben Bedingungen wie im Bieterwettstreit K20c: Bedarf, Ansehen, Alter, Konto, Gehaltsrahmen, Beziehung zum Verkäufer und Kaderplatz (`mitbieter`, aus `konkurrenzKauf` herausgelöst).
  - Du kennst seinen Berater (Beziehung ab 20), oder du hast mit 5 % Glück einen Verwandten, der ihn kennt.
- **Treffen mit dem Berater:** 5.000 € (3. Liga, nach Liga mehr). Mit 20 % spricht es sich herum: Beziehung zum Verkäufer −5. Folgekarte nach 3 bis 7 Tagen.
- **Offiziell beim Verein melden:** Beziehung zum Berater +3.
- **Nicht einmischen** (Voreinstellung).

**Karte 2 „dritterTreffen“** (nur als Folgekarte):

- **Schnell bieten** (Voreinstellung): Wechselinteresse des Spielers an dir +10 bis Saisonende.
- **Die Vereine gegeneinander ausspielen:**
  - Mit 60 % senkt der Verkäufer seine Forderung um 10 %. Das ist ein Gegenangebot in der Verhandlung, es gilt bis zum nächsten Abbruch.
  - Sonst fliegt es auf: Beziehung zum Verkäufer −10.

**Ausgang** (`dritterKauf`, beim Abschluss deines Kaufs):

- Gilt nur, wenn der Spieler in derselben Saison vom selben Verein zu deinem Verein wechselt.
- Die Beziehung zwischen den beiden anderen Vereinen sinkt um 10.
- Deine Beziehung zu beiden sinkt um 2. Nach erfolgreichem Ausspielen sinkt sie nicht.
- Wer nur die erste Karte beantwortet (Treffen oder offiziell melden) und dann kauft, bekommt den Ausgang ebenfalls, mit −2.
- Seit Prüfung EF:
  - Ein Vorvertrag zählt nicht, der Spieler wechselt erst in der nächsten Saison.
  - Der Merker fällt beim Saisonwechsel weg.
  - Der Nachlass senkt auch eine schon vereinbarte Ablöse.
  - Das Gegenangebot liegt nie über der Forderung.
  - Ein Nachlass allein bringt kein Verhandlungsgerücht.

**Vorläufig entschieden (von mir, ohne Rücksprache):**

1. **Die beiden Vereine** sind zwei zufällige der möglichen Mitbieter. Echte laufende Verhandlungen unter Computer-Vereinen gibt es nicht, sie kaufen zum Listenpreis (K31).
2. **Kosten und Risiko** des Treffens sind kleiner als beim Abwerben (K20). Es geht um ein Gespräch mit dem Berater, nicht mit dem Spieler eines anderen Vereins.
3. **„Geschickt“ heißt: Ausspielen hat geklappt.** Nur dann bleibt deine Beziehung zu den beiden unverändert (K17 §5.4).
4. **Keine Lizenzprüfung im Auslöser** (wie bei allen Karten). Das Angebot machst du auf dem Transfermarkt, dort gelten Lizenz und Transfersperre.
5. **Werte geschätzt** (`REGELN.karten.dritter`, Kosten, Chancen und Nachlass im Katalog).

**Info-Karten mit Wirkung (K30e, 22.11.2026, popolupo, ohne Testlauf):**

- Eine Info-Karte kann `wirkung:[…]` tragen. Die Wirkungen gelten sofort beim Erscheinen, gewürfelt im Strom `ereignisse` von Saison, Tag und Karte. Ihre Texte stehen hinter der Meldung.
- Bisher:
  - „Rückendeckung vom Vorstand“ (K28 §8): 30 Tage lang fällt das Vertrauen nicht unter den Wert des Tages (`vertrauenHalt`, `S.trustHalt`, angewandt in `vorstandPruefen`).
  - „Dorfverein im Ausnahmezustand“ (K11 §8): Fans +1, bis 7 Tage nach einem Testspiel beim Amateurverein.
  - „Blamage gegen Amateure“ (K11 §8): Vertrauen −1, Fans −1, bis 7 Tage nach einer Niederlage gegen einen Amateurverein.
- `{verein}` nennt seit K30e auch Amateurvereine beim Namen.

**Folgewirkungen nur bei Erfolg (`dann`, seit Prüfung EE, 22.11.2026):**

- Eine Wirkung kann `dann:[…]` tragen. Diese Wirkungen kommen nur, wenn die erste geklappt hat, dazu ihr Text `gut`. Sonst zeigt die Karte den Grund des Scheiterns.
- Erlaubt ist `dann` nur bei Wirkungen, die Erfolg melden (`KARTEN_MIT_ERFOLG`): `leihe`, `gehaltAnpassen`, `provisionZahlen`. Das prüfen `tests/karten.js` Fall 1 und `kartenpruefung.pl`.
- Grund: Bei „Hilfe in der Not“, „Berater droht“, „Gehaltsneid“ und „Provisionsstreit“ kamen Beziehung und Stimmung auch dann, wenn die Leihe, die Erhöhung oder die Zahlung nicht zustande kam.

## 6. Hebel des Spielers

- Entscheidungen in den Karten.
- Regler Meldungsdichte (seit K30b im Menü).
- Automatik: Der Co-Trainer oder der zuständige Mitarbeiter entscheidet Karten, die als Info kommen (K16).

## 7. Verhalten der Computer-Vereine

Computer-Vereine bekommen keine Karten. Ihre Geschichten entstehen aus denselben Zuständen und werden über die Presse (K29) sichtbar, zum Beispiel „Ärger im Lager von X“.

## 8. Katalog (Stand 7.11.)

### 8.1 Aus den Konzepten

Jedes Konzept führt seine Karten in Abschnitt 8. Stand heute:

| Konzept | Karten (ungefähr) | Beispiele |
|---|---|---|
| K03 Spieler | 10 | Durchbruch, Formkrise, Heimweh, Partynacht |
| K05 Live-Spiel | 4 | Joker sticht, Handschlag verweigert |
| K06 Taktik | 4 | Taktik-Coup, Spieler hadert mit Position |
| K07 Training | 6 | Spieler bittet um Pause, Rangelei im Training |
| K08 Jugend | 6 | Goldener Jahrgang, Probetraining, Skandal ums Wunderkind |
| K09 Sportgericht | 5 | Einspruch, Rudelbildung, Pyro-Show |
| K10 Medizin | 5 | Kreuzbandriss, spielt trotz Schmerzen, Grippewelle |
| K11 Testspiele | 7 | Dorfverein im Ausnahmezustand, Lagerkoller |
| K12a Sommer | 4 | Übergewicht nach dem Urlaub, Urlaub verlängern |
| K13 Wettbewerbe | 5 | Pokal-Los des Jahres, Anruf des Bundestrainers |
| K14 Kabine | 6 | Grüppchenbildung; als Karten seit K14b: Kabinenparty, Neuzugang drängt auf Einsatz, Eingewöhnung; seit K14c: Führungsspieler meutert |
| K15 Gespräche | 4 | Versprechen kippt, Kabine glaubt dir nicht mehr |
| K16 Stab | 4 | Co-Trainer wird Cheftrainer, Ex-Kapitän kehrt zurück |
| K17 Beziehungen | 4 | Hilfe in der Not, Fehde in der Presse, Versöhnung |
| K18 Scouting | 4 | Geheimtipp, Talent aus dem Nichts |
| K19 Transfers | 5 | Befund beim Medizincheck, Rückkehr des verlorenen Sohns |
| K21 Verträge | 5 | Vorvertrag woanders, Gehaltsneid |
| K22 Berater | 5 | Der entfernte Verwandte, Provisionsstreit |
| K28 Vorstand | 5 | Ultimatum, Präsident mischt sich ein, neuer Präsident (seit U12i als Wahl, keine Karte), Jobangebot (seit U12j als Karte) |
| K31 Computer-Vereine | 4 | Konkurrent rüstet auf, Notverkauf |

Zusammen etwa 100 Karten, viele davon Infos.

### 8.2 Ideen aus PLAN §4, noch ohne Konzept

| Karte | Bereich | gehört zu |
|---|---|---|
| Zwei Vereine streiten um einen Spieler, lachender Dritter | Markt | K17, K22 (Kette, siehe 8.3) |
| Ein Spieler heiratet, Teamausflug gefällig? | Kabine | K14 |
| Der Rasen ist nach Frost kaputt, Heimspiel in Gefahr | Stadion | K26 |
| Ein Lokalreporter hat eine Fehde mit dir | Presse | K29 |
| Ein Altstar will ein Comeback | Markt | K19 |
| Ein anderer Verein will dich als Trainer | Karriere | K28 (aufgenommen) |
| Der Sponsor gerät in einen Skandal | Sponsoren | K24 |
| Fan-Choreo zum Jubiläum | Fans | K27 |

### 8.4 Skandale: Spielmanipulation, Wettbetrug, Schiedsrichter (mit dir entschieden am 10. November 2026)

Sehr selten, als Weltereignis: **etwa einmal in zehn Saisons** kommt ein Szenario aus dieser Kategorie, die schweren noch viel seltener. Vorbilder sind echte Fälle: der Bundesliga-Skandal 1971 (53 Spieler, zwei Trainer, sechs Funktionäre bestraft, Bielefeld und Offenbach verloren die Lizenz), Schiedsrichter Hoyzer 2005 (Spiele in 2. Liga, Pokal und Regionalliga manipuliert, lebenslang gesperrt) und Calciopoli in Italien 2006 (Juventus verlor zwei Titel und musste absteigen).

| Szenario (Beispiele) | Stufe | Folge |
|---|---|---|
| Wettbetrug in der Regionalliga oder 3. Liga fliegt auf | selten | Spieler gesperrt, ein Verein Punktabzug, Presse |
| Spieler eines Computer-Vereins wettet auf eigene Spiele | selten | Sperre, sein Verein verkauft ihn billig |
| Ein Wettpate spricht einen deiner Spieler an, er meldet es | selten | Lob in der Presse, Stimmung des Spielers + |
| Schiedsrichter hat Spiele manipuliert und fliegt raus | sehr selten | lebenslange Sperre, betroffene Spiele werden wiederholt oder annulliert (Sportgericht, K09), Termine im Kalender (K13) |
| Ein Spiel deines Vereins wird deshalb wiederholt | sehr selten | neuer Termin, Ergebnis gestrichen, Tabelle ändert sich |
| Großer Skandal mit mehreren Vereinen wie 1971 | sehr selten | Lizenzentzug oder Zwangsabstieg, viele Sperren, Ansehen der Liga sinkt für eine Saison |

- **Gebaut als K30g** (23.11.2026, popolupo, ohne Testlauf, Werte vorläufig): „Wettbetrug in der 3. Liga fliegt auf“ als Info-Karte. Sie hat die Stufe selten, kommt also etwa einmal in 100 Saisons, und höchstens einmal in zehn Saisons (`RKT.skandal.abstand`, `S.skandal3`, seit Prüfung ER2; vorher sperrte `sperrTage` nur denselben Spieler). Nicht mehr nach dem letzten Spieltag der 3. Liga, sonst könnte sich zwischen den Relegationsspielen die Paarung ändern (ER1). Sie wird immer gemeldet, auch über der Info-Grenze der Woche (`immer`, ER3).
  - Ein Spieler eines Computer-Vereins der 3. Liga (keine zweite Mannschaft) wird gesperrt wie beim Wettskandal (K30f).
  - Sein Verein bekommt in dieser Saison 3 Punkte abgezogen, über denselben Weg wie nach einer Insolvenz (`S.abzug`, K23a). Das gilt auch, wenn du in der 3. Liga spielst. Dein eigener Verein ist nie betroffen.
  - Die Regionalliga hat keine Kader im Spiel, darum nur die 3. Liga. Schiedsrichter, wiederholte Spiele und der große Skandal fehlen weiter.
- **Nur als Weltereignis, ohne eigene Entscheidung zum Mitmachen** (vorläufig). Die Idee einer Versuchung (ein Mittelsmann bietet dir an, ein Spiel „zu regeln“) bleibt draußen, solange du sie nicht willst.
- **Doping kommt nicht ins Spiel** (deine Entscheidung vom 10.11.). „Fit spritzen“ mit Schmerzmitteln bleibt, das ist erlaubt (K10).
- Sichtbar ab der ersten Lizenz (nur Information, K36).
- **Gebaut seit K30f** (23.11.2026, popolupo, ohne Testlauf, Info-Karten mit Wirkung, Stufe „gelegentlich“, zusammen etwa einmal in zehn Saisons): „Ein Wettpate meldet sich“ (ein Spieler deines Kaders meldet den Anwerbeversuch, Stimmung +3, Fans +1) und „Wettskandal“ (ein Spieler eines Computer-Vereins, nie einer deines Kaders in der Zweiten, ist 20 Liga- und 3 Pokalspiele gesperrt; die Transferliste ist seit Prüfung EJ1 weg, der Markt räumte sie nach einer Woche). Die schweren Szenarien (Schiedsrichter, Wiederholung, Zwangsabstieg) fehlen noch.

### 8.3 Beispiel einer Kette: „Der lachende Dritte“

1. **Auslöser:** Zwei Computer-Vereine verhandeln um denselben Spieler (K19), dein Bedarf passt, du kennst seinen Berater oder hast mit Glück einen entfernten Verwandten (Zufall 5 %).
2. **Karte 1 (Entscheidung):** „Dein Cousin kennt den Berater von {spieler}.“ Optionen: Treffen (Kosten, Risiko wie Abwerben in K20), offiziell bieten, ignorieren.
3. **Karte 2 (nach 3–7 Tagen, wenn Treffen):** Der Spieler ist interessiert. Optionen: schnell bieten (Preis normal), die beiden Vereine gegeneinander ausspielen (Preis niedriger, Risiko, dass es auffliegt).
4. **Ausgang:** Unterschreibt er bei dir, sinkt die Beziehung zwischen den beiden anderen Vereinen um 10, deine zu ihnen nur um 2, bei geschicktem Vorgehen gar nicht (K17 §5.4).

## 9. Wechselwirkungen

Alle Konzepte mit Abschnitt 8 liefern Karten. K30 regelt nur Aufbau, Auswahl und Dosierung. Die Presse (K29) macht Karten von Computer-Vereinen sichtbar.

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Budget | in simulierten Saisons nie mehr als 4 Halte pro Woche, im Schnitt 2–3 |
| Entscheidungskarten | 15–30 pro Saison bei Meldungsdichte „normal“ |
| Vielfalt | keine Karte mehr als dreimal pro Saison, keine Textvariante zweimal hintereinander |
| Prüfskript | jede Karte nutzt nur erlaubte Wirkungen (3.2), alle Platzhalter werden gefüllt, jede Folgekarte existiert |
| Seltenheit | ein Kartenlabor zieht Karten über 2000 Saisons mit Zuständen aus simulierten Saisons: jede Stufe trifft ihre Rate (±20 %), jedes Szenario ist erreichbar (Bedingungen erfüllbar), sehr seltene höchstens einmal je Karriere |
| Skandale | etwa eine Skandal-Karte in zehn Saisons, schwere unter einmal in 100 Saisons |

## 11. Stellschrauben

```js
karten:{
  halteProWoche:[2,4],entscheidung:{kleinProWoche:1,grossProMonat:1,jeBereichProWoche:1},infoProWoche:5,
  dichte:{wenig:0.5,normal:1,viel:2},gueltigTage:14,sperrTage:120,
  prioritaet:['frist','kette','wichtig','sonst'],
  seltenheit:{haeufig:3,gelegentlich:20,selten:100,sehrSelten:400}, // etwa einmal in so vielen Saisons je Szenario
  kategorien:{skandal:10},                                         // etwa einmal in so vielen Saisons je Kategorie (Beispiel)
  sehrSeltenJeKarriere:1
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Computer-Vereine ohne Karten,** ihre Geschichten kommen über die Presse.
2. **Entscheidungskarten über dem Budget** kommen als Info, der Mitarbeiter entscheidet (Automatik).
3. **Katalog wächst mit den Konzepten,** K30 hält nur die Übersicht.

**Mit dir entschieden (10. November 2026):** Sehr viele Szenarien (Ziel 1000), viele davon so selten, dass alle erst nach etwa 2000 Saisons einmal vorgekommen sind. Manipulation und Wettbetrug als sehr seltene Weltereignisse (etwa einmal in zehn Saisons). Doping kommt nicht ins Spiel.

**Vorläufig entschieden mit U12d** (20.11., von mir, ohne Rücksprache und ohne Testlauf):

4. **Auslöser als benannte Prüfungen im Code,** der Katalog nennt nur ihren Namen. Die Texte, Optionen und Wirkungen stehen als Daten in `daten/karten.js`.
5. **Chance je Woche = 1 / (Saisons der Stufe × 40).** Gilt nur in Wochen, in denen die Bedingungen erfüllt sind. Die Raten in §5.4 sind damit Obergrenzen.
6. **Keine Antwort heißt Automatik am nächsten Tag,** wie bei den Fristen des Sportgerichts.
7. **Bereich `ereignisse` mit Automatik in der Grundlizenz.** Er ist sofort frei, und die Automatik lässt alle Karten vom Co-Trainer entscheiden.
8. **Erste fünf Karten** nur mit Wirkungen, die es schon gibt. Ketten und verzögerte Folgen kommen mit der nächsten Karte, die sie braucht (der lachende Dritte, §8.3). Ketten gibt es seit K30c (§5.6).
9. **Geld aus Karten bucht als „Ereignisse“** in den Finanzen.

**Vorläufig dazu:** Kategorie, Szenario und Varianten als drei Ebenen, vier Seltenheitsstufen (5.4), sehr seltene Szenarien höchstens einmal je Karriere, keine eigene Entscheidung zum Mitmachen bei Manipulation, eine Sammlung erlebter Szenarien über alle Karrieren.

## Quellen

- Aufbau, Dosierung, erste Ideen: PLAN §2 und §4
- Kritik „zu viele Karten“, Pressefragen ohne Folgen: `konzepte/_recherche-genre.md`, Abschnitte 3.2 und 4
- Budget für Unterbrechungen: `konzepte/_konsistenzpruefung.md`, B1
- Bundesliga-Skandal 1971, Hoyzer 2005, Calciopoli 2006: [bpb: Bundesliga-Skandal 1970/71](https://WWW.BPB.DE/system/files/dokument_pdf/PuF_S_18_Bundesliga-Skandal%201970_1971_0.pdf?download=1), [Wikipedia: Hoyzer-Skandal 2005](https://Wikipedia.com/wiki/Robert_Hoyzer), [90min: Juventus in der Serie B](https://www.90min.com/posts/the-last-time-juventus-were-relegated-to-serie-b) (10.11.)

