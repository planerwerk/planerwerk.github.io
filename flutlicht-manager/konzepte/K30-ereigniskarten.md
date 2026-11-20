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
4. Der Regler Meldungsdichte fehlt noch (K35a), es gilt „normal“.

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

Noch nicht gebaut: verzögerte Folgen und Ketten (§3.1, §8.3), Merker, Meldungsdichte, die Chronik über alle Karrieren (§5.4), Skandale (§8.4), Kategorien mit eigener Rate.

## 6. Hebel des Spielers

- Entscheidungen in den Karten.
- Regler Meldungsdichte.
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
| K14 Kabine | 6 | Grüppchenbildung, Führungsspieler meutert |
| K15 Gespräche | 4 | Versprechen kippt, Kabine glaubt dir nicht mehr |
| K16 Stab | 4 | Co-Trainer wird Cheftrainer, Ex-Kapitän kehrt zurück |
| K17 Beziehungen | 4 | Hilfe in der Not, Fehde in der Presse, Versöhnung |
| K18 Scouting | 4 | Geheimtipp, Talent aus dem Nichts |
| K19 Transfers | 5 | Befund beim Medizincheck, Rückkehr des verlorenen Sohns |
| K21 Verträge | 5 | Vorvertrag woanders, Gehaltsneid |
| K22 Berater | 5 | Der entfernte Verwandte, Provisionsstreit |
| K28 Vorstand | 5 | Ultimatum, Präsident mischt sich ein, neuer Präsident |
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

- **Nur als Weltereignis, ohne eigene Entscheidung zum Mitmachen** (vorläufig). Die Idee einer Versuchung (ein Mittelsmann bietet dir an, ein Spiel „zu regeln“) bleibt draußen, solange du sie nicht willst.
- **Doping kommt nicht ins Spiel** (deine Entscheidung vom 10.11.). „Fit spritzen“ mit Schmerzmitteln bleibt, das ist erlaubt (K10).
- Sichtbar ab der ersten Lizenz (nur Information, K36).

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
8. **Erste fünf Karten** nur mit Wirkungen, die es schon gibt. Ketten und verzögerte Folgen kommen mit der nächsten Karte, die sie braucht (der lachende Dritte, §8.3).
9. **Geld aus Karten bucht als „Ereignisse“** in den Finanzen.

**Vorläufig dazu:** Kategorie, Szenario und Varianten als drei Ebenen, vier Seltenheitsstufen (5.4), sehr seltene Szenarien höchstens einmal je Karriere, keine eigene Entscheidung zum Mitmachen bei Manipulation, eine Sammlung erlebter Szenarien über alle Karrieren.

## Quellen

- Aufbau, Dosierung, erste Ideen: PLAN §2 und §4
- Kritik „zu viele Karten“, Pressefragen ohne Folgen: `konzepte/_recherche-genre.md`, Abschnitte 3.2 und 4
- Budget für Unterbrechungen: `konzepte/_konsistenzpruefung.md`, B1
- Bundesliga-Skandal 1971, Hoyzer 2005, Calciopoli 2006: [bpb: Bundesliga-Skandal 1970/71](https://WWW.BPB.DE/system/files/dokument_pdf/PuF_S_18_Bundesliga-Skandal%201970_1971_0.pdf?download=1), [Wikipedia: Hoyzer-Skandal 2005](https://Wikipedia.com/wiki/Robert_Hoyzer), [90min: Juventus in der Serie B](https://www.90min.com/posts/the-last-time-juventus-were-relegated-to-serie-b) (10.11.)

