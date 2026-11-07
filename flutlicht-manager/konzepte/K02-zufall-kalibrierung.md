# K02 – Zufall, Kalibrierung, Schwierigkeit

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K33 (Daten, Seed), K03, K04 · Wird gebraucht von: allen Konzepten mit Zufall, besonders K04, K09, K10, K19, K30.

## 1. Ziel und Spielgefühl

- **Glück gehört dazu, aber es entscheidet nicht allein.** Ein Außenseiter gewinnt manchmal, ein Favorit meistens. Über eine Saison setzt sich Qualität durch.
- **Fair:** Kein Würfel ist gezinkt, weder für dich noch gegen dich, weder für die Computer-Vereine noch gegen sie. Kein Gummiband, das Führende bremst oder Zurückliegende anschiebt.
- **Nachvollziehbar:** Derselbe Spielstand mit denselben Entscheidungen ergibt dasselbe Ergebnis. Fehler lassen sich nachstellen, Tests sind verlässlich.
- **Kein Neuladen, bis das Glück passt:** Wer vor dem Spiel neu lädt und nichts ändert, bekommt dasselbe Ergebnis. Wer etwas ändert, sieht nur die Wirkung seiner Entscheidung, nicht neues Glück.
- **Schwierigkeit ohne Schummeln:** Schwerer heißt strengere Bedingungen und weniger Information, nie stärkere Gegner oder schlechtere Würfel.

## 2. Vorbilder und Abgrenzung

- **Community-Kritik:** Bei Football Manager vermuten Spieler regelmäßig, das Ergebnis stehe vorher fest (Recherche, Abschnitt 4). Gegenmittel: erklärbare Ergebnisse (K04 §5.10) und ein offengelegtes Zufallsprinzip.
- **Genre-Konvention:** Schwierigkeit über die Vereinswahl (kleiner Verein = schwer). Das bleibt der wichtigste Hebel.
- **Bewusst anders:** Viele Spiele würfeln bei jedem Laden neu. Wir binden den Zufall an Spiel, Tag und Bereich. Das macht Neuladen nutzlos und Tests genauer.

## 3. Begriffe und Daten

| Begriff | Bedeutung | Ort |
|---|---|---|
| Seed | Startwert einer Karriere, 32 Bit | Spielstand `S.seed` |
| Generator | xoshiro128** mit splitmix32 (gibt es schon) | `js/zufall.js` |
| Zufallsstrom | eigener Generator für einen Zweck, aus Seed und Schlüssel abgeleitet | berechnet |
| Zähler | wie viele Zahlen ein Strom an einem Tag schon geliefert hat | Spielstand `S.zz` |
| Zielwert | Spanne aus echter Statistik mit Quelle | `tests/ziele.js` (neu) |
| Schwierigkeit | Stufe mit festen Werten | `regeln.js` → `schwierigkeit`, gewählt in `S.einst.stufe` |

### 3.1 Zufallsströme (vorläufig entschieden)

Heute zieht alles aus einem einzigen Strom (`S.zufall`). Das hat zwei Nachteile:
- Eine kleine Handlung, etwa ein Blick auf die Transferliste mit Zufall im Hintergrund, verschiebt alle späteren Zahlen. Danach ist der ganze Rest der Saison anders.
- Wer vor dem Spiel speichert, kann die Aufstellung leicht ändern und so neues Glück „erwürfeln“.

**Neu:** Jeder Zweck bekommt seinen eigenen Strom, abgeleitet aus Seed und Schlüssel:

| Strom | Schlüssel | Wofür |
|---|---|---|
| **Spiel** | Seed, Saison, Wettbewerb, Spieltag, Heim, Gast | ein Pflichtspiel oder Testspiel |
| **Tag** | Seed, Tag, Bereich | Entwicklung, Training, Markt, Vorstand, Ereigniskarten, Sportgericht, je Bereich getrennt |
| **Welt** | Seed, Saison | Saisonwechsel: Nachwuchs, neue Spieler, Karriereenden, Spielplan |
| **Start** | Seed | Welt bauen: Persönlichkeit, Merkmale, Talente |

- **Feste Zahl je Minute:** Der Spiel-Strom liefert jede Minute immer gleich viele Zahlen (Start: 12), auch wenn nicht alle gebraucht werden. Eine andere Aufstellung trifft dann auf dieselben Würfe. Das Glück bleibt gleich, nur die Entscheidung wirkt anders.
- **Gemeinsame Zufallszahlen in Tests:** Für Vergleiche wie „Torwart 66 gegen 84“ laufen beide Varianten mit denselben Würfen. Der Unterschied ist dann fast nur noch die Wirkung, und Tests brauchen viel weniger Saisons (Varianzreduktion).
- Der Spielstand speichert nur den Seed und die Zähler. Speichern und Laden ändert nichts.

## 4. Abläufe

### 4.1 Zufall im Spielablauf

1. Neue Karriere: Seed aus dem Browser-Zufall (einzige Stelle, die nicht vom Seed abhängt, wie heute). Optional kann man einen Seed eingeben, um eine Welt nachzuspielen.
2. Jede Zufallszahl der Spiellogik kommt aus einem Strom. Die Oberfläche würfelt nie (wie heute).
3. Bei Fehlermeldungen enthält der Export des Spielstands Seed und Zähler. Damit lässt sich jeder Fehler nachstellen.

### 4.2 Kalibrierung

1. **Zielwerte festlegen:** jede Zahl mit Spanne, Quelle und zuständigem Konzept in `tests/ziele.js`.
2. **Simulieren:** `node tests/sim.js` lädt Daten und Spiellogik ohne Browser und spielt N Saisons aller Ligen mit festen Seeds (Start: 200 Saisons der 1. Liga in wenigen Minuten).
3. **Bericht:** Ist gegen Ziel je Zeile, mit Ampel (grün im Ziel, gelb knapp daneben, rot daneben) und der Stellschraube, die am stärksten wirkt.
4. **Stellschrauben drehen:** Werte in `regeln.js` ändern, wieder simulieren. Optional schlägt `node tests/kalibrierung.js` per einfacher Suche Werte für wenige Schrauben vor (zum Beispiel Chance, Exponent, Heimvorteil). Übernommen wird von Hand, damit jede Änderung sichtbar im Repo landet.
5. **Akzeptanztests** laufen danach (Abschnitt 10). Ein Wert gilt erst als kalibriert, wenn Zielwerte und Akzeptanztests grün sind.
6. **Rückfall-Schutz:** Die wichtigsten Kennzahlen stehen als Referenz im Repo. Weicht ein späterer Umbau mehr als die Toleranz ab, meldet der Test das.

### 4.3 Schwierigkeit wählen

- Beim Start einer Karriere, Standard „Normal“.
- **Änderbar** zum Saisonwechsel, leichter jederzeit. Die Stufe steht in der Karriere-Statistik (K34), damit Rekorde vergleichbar bleiben.

## 5. Regeln und Formeln

### 5.1 Grundsatz „Erwartung plus Zufall“

Jede zufällige Größe hat einen Erwartungswert, eine Streuung und Grenzen, die in `regeln.js` stehen. Überblick über die Stellen, an denen gewürfelt wird:

| Bereich | Erwartung kommt aus | Zufall | Grenzen |
|---|---|---|---|
| Spiel | Teamwerten (K04) | Tagesform Team ±4 %, Spieler ±6 %, jede Szene | Chance je Angriff 0,10–0,80, Torwart ±15 %, Schütze ±20 % |
| Entwicklung | Alter, Talent, Form, Praxis (K03) | ±0,05 je Woche, bis 21 doppelt | Talent als Obergrenze |
| Lernen | Schwierigkeit, Alter, Professionalität | ×0,7–1,3 je Woche | höchstens 25 % aus einem Spiel |
| Persönlichkeit | Schnitt 10 | Streuung 3,5 | 1–20 |
| Verletzungen | Frische, Robustheit, Fouls (K10) | je Szene | später Obergrenzen je Art |
| Markt | Bedarf, Wert (K19, K31) | Angebote, Forderungen | Wertuntergrenzen |
| Sportgericht | Strafmaß nach Art (K09) | Spanne je Vergehen | Höchststrafe |
| Ereigniskarten | Auslöser, Bedingungen (K30) | ob und welche Karte | Budget pro Woche, Sperrzeiten |
| Scouting | wahre Werte (K18) | Schätzfehler | je nach Scout |

### 5.2 Restwahrscheinlichkeit für Überraschungen

- Im Spiel ist **nichts sicher**. Die Grenzen in K04 sorgen dafür, dass auch ein klarer Außenseiter Chancen bekommt und ein Tor schießen kann.
- **Ziele** (aus K04 §10): Ein Bundesligist scheidet gegen Amateure in 6–12 % der Pokalspiele aus. Jedes Spitzenteam verliert im Schnitt mindestens zweimal pro Saison gegen eine Mannschaft aus der unteren Hälfte.
- **Keine Serien-Steuerung:** Es gibt keine versteckte Regel, die nach drei Niederlagen einen Sieg wahrscheinlicher macht. Serien entstehen aus Form und Selbstvertrauen (K03), und die wirken für alle gleich.

### 5.3 Kein Gummiband

Verboten sind, für dich wie für alle Computer-Vereine:
- Stärke- oder Glückszuschläge je nach Tabellenplatz, Punktabstand oder Schwierigkeit
- Schiedsrichter, die je nach Lage pfeifen
- Verletzungen, Angebote oder Ereignisse, die gezielt bremsen oder helfen

**Erlaubt** ist, was sich aus den Regeln ergibt: Ein Spitzenteam bekommt mehr Angebote für seine Spieler, ein Absteiger verliert Ansehen. Das ist Folge, nicht Steuerung.

### 5.4 Schwierigkeitsstufen

Schwierigkeit ändert nur **Bedingungen, Information und Hilfen**:

| Stellschraube | Leicht | Normal | Schwer |
|---|---|---|---|
| Startkonto | ×1,5 | ×1 | ×0,7 |
| Kreditrahmen | ×1,5 | ×1 | ×0,6 |
| Geduld des Vorstands (Entlassung unter) | Vertrauen 5 | 12 | 18 |
| Schonfrist neuer Trainer | 10 Spieltage | 6 | 4 |
| Saisonziel | einen Platz leichter | wie berechnet | einen Platz strenger |
| Vorhersage-Bänder (K35a) | ×0,6 schmaler | ×1 | ×1,5 breiter |
| Talentsterne eigener Spieler | genau | bis 1 Stern daneben | bis 1 Stern daneben, länger unsicher |
| Scouting-Spannen (K18) | ×0,7 | ×1 | ×1,3 |
| Erinnerungen ab Werk | alle an | alle an | alle aus |
| Klugheit der Computer-Vereine (K31) | gemütlich | normal | clever |

- **Klugheit der Computer-Vereine** heißt: wie gut sie Kader planen, Taktik wählen und verhandeln. Sie bekommen nie bessere Spieler oder Würfel.
- Werte und Würfel im Spiel selbst sind auf allen Stufen gleich. Ein Spielstand auf „Schwer“ simuliert dieselben Ergebnisse wie auf „Leicht“, wenn man dieselben Entscheidungen trifft.

## 6. Hebel des Spielers

- **Schwierigkeit** wählen (5.4) und den Verein (der größte Hebel).
- **Seed** eingeben, um eine Welt erneut oder mit Freunden gleich zu spielen.
- Keine weiteren Hebel: Am Zufall selbst kann man nicht drehen, und Neuladen bringt kein anderes Glück.

## 7. Verhalten der Computer-Vereine

- Gleiche Ströme, gleiche Regeln, gleiche Grenzen.
- Ihre Entscheidungen (Aufstellung, Taktik, Transfers) dürfen Zufall enthalten, damit sie nicht vorhersehbar sind. Diese Würfe kommen aus dem Tag-Strom des Bereichs.
- Die Klugheitsstufe (5.4) ändert nur ihre Entscheidungsregeln.

## 8. Ereignisse

K02 erzeugt keine Ereignisse. Für Ereigniskarten (K30) legt es nur fest: Ob eine Karte kommt, würfelt der Tag-Strom „Ereignisse“, innerhalb des Wochenbudgets (Konsistenzprüfung B1, PLAN §2).

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K33 Daten | Spielstand bekommt die Zähler `S.zz`. `S.zufall` entfällt nach dem Umbau. |
| K03, K04 | nutzen Spiel- und Tag-Ströme, liefern ihre Zielwerte an `tests/ziele.js` |
| K05 Live-Spiel | Eingriffe ändern Teamwerte, nicht die Würfe |
| K16 Stab | Genauigkeit der Vorhersagen, auf „Leicht“ und „Schwer“ zusätzlich skaliert |
| K18 Scouting | Schätzfehler aus dem Tag-Strom „Scouting“, Spannen je Stufe |
| K28 Vorstand | Geduld und Saisonziel je Stufe |
| K31 Computer-Vereine | Klugheitsstufe |
| K34 Statistik | Stufe je Saison in der Karriere-Statistik |
| K35a Oberfläche | Bänder je Stufe, Stufe im Menü |

## 10. Zielwerte und Tests

### 10.1 Zielwerte

Alle Zielwerte stehen künftig in einer Datei `tests/ziele.js`, jede Zeile mit Spanne, Quelle und Konzept. Die Spiel-Zielwerte kommen aus K04 §10, die Spieler-Zielwerte aus K03 §10. Neue Konzepte tragen ihre Werte dort ein.

### 10.2 Testskripte

| Skript | Was es prüft | Dauer (Ziel) |
|---|---|---|
| `tests/seed.js` (gibt es) | gleicher Seed = gleicher Verlauf, auch nach Speichern und Laden | 10 s |
| `tests/sim.js` (neu) | lädt Daten und Spiellogik in Node ohne Browser, simuliert Saisons | Grundlage der anderen |
| `tests/kalibrierung.js` (neu) | Bericht Ist gegen Ziel mit Ampel, optional Vorschläge für Stellschrauben | wenige Minuten |
| `tests/akzeptanz.js` (neu) | Torwart-Test, Sensitivität, Star allein, Positionen, Merkmale, Exploits, jeweils mit gemeinsamen Zufallszahlen | wenige Minuten |
| `tests/spielermodell.js` (neu, K03) | Alterskurve, Gleichgewicht der Welt, Form, Frische, Lernen | wenige Minuten |
| `tests/ui-zwei-saisons.js`, `tests/fuzz-karrieren.js` (gibt es) | Oberfläche und zufällige Karrieren | wie heute |

### 10.3 Neue Prüfungen aus K02

- **Neuladen bringt nichts:** Spielstand vor dem Spiel speichern, Spiel ausführen, neu laden, ohne Änderung erneut ausführen: gleiches Ergebnis. Mit geänderter Aufstellung: gleiche Tagesform, gleiche Würfe je Minute.
- **Unabhängigkeit der Bereiche:** Eine zusätzliche Handlung im Markt (zum Beispiel ein abgelehntes Angebot) ändert keine Spielergebnisse desselben Tages.
- **Stufen ohne Schummeln:** Dieselbe Karriere mit denselben Entscheidungen auf „Leicht“ und „Schwer“ ergibt dieselben Spielergebnisse.
- **Glück gleicht sich aus:** Über 1000 Saisons liegt die Rangkorrelation zwischen Teamstärke vor der Saison und Abschlusstabelle in einem realistischen Band (Startwert 0,6–0,8, prüfen). Zu hoch heißt zu wenig Zufall, zu niedrig heißt Lotterie.

## 11. Stellschrauben

```js
zufall:{
  ziehungenProMinute:12,            // Spiel-Strom: feste Zahl von Würfen je Minute
  bereiche:['entwicklung','training','markt','vorstand','ereignisse','sportgericht','scouting','medizin']
},
schwierigkeit:{
  standard:'normal',
  stufen:{
    leicht:{konto:1.5,kredit:1.5,entlassenUnter:5,schonfrist:10,ziel:-1,baender:0.6,talentFehler:0,scouting:0.7,erinnerungen:true,klugheit:'gemuetlich'},
    normal:{konto:1,kredit:1,entlassenUnter:12,schonfrist:6,ziel:0,baender:1,talentFehler:1,scouting:1,erinnerungen:true,klugheit:'normal'},
    schwer:{konto:0.7,kredit:0.6,entlassenUnter:18,schonfrist:4,ziel:1,baender:1.5,talentFehler:1,talentGenauNach:3,scouting:1.3,erinnerungen:false,klugheit:'clever'}
  }
}
```

`vorstand.entlassenUnter` und `vorstand.schonfristSpieltage` werden dann aus der Stufe gelesen.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache, bitte bei Gelegenheit bestätigen oder ändern):

1. **Zufallsströme nach Spiel, Tag und Bereich** statt eines einzigen Stroms. Vorteil: Neuladen bringt kein neues Glück, Bereiche stören sich nicht, Tests werden genauer. Nachteil: etwas Umbau in `js/zufall.js` und an allen Stellen, die würfeln. Weil alte Spielstände ohnehin nicht weiterleben müssen (PLAN §1, Punkt 9), ist jetzt der günstigste Zeitpunkt.
2. **Drei Stufen** (Leicht, Normal, Schwer). Eine vierte („Legende“, ohne Erinnerungen und mit sehr ungeduldigem Vorstand) kann später dazukommen.
3. **Seed eingeben** beim Start als Option für Fortgeschrittene, versteckt im Startbildschirm.
4. **Rangkorrelation 0,6–0,8** als Maß für „Glück gleicht sich aus“ ist ein geschätzter Startwert. Er sollte mit echten Daten geprüft werden (Marktwert-Rang vor der Saison gegen Abschlusstabelle).

## Quellen

- Kritik „Ergebnis steht vorher fest“: `konzepte/_recherche-genre.md`, Abschnitt 4
- Generator und Seed: `js/zufall.js`, `konzepte/K33-daten.md`
- Zielwerte: `konzepte/K03-spielermodell.md` §10, `konzepte/K04-engine.md` §10 mit ihren Quellen
