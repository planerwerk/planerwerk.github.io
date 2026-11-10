# K02 – Zufall, Kalibrierung, Schwierigkeit

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.

**Umsetzungshinweise (U2a, U3):** Zufallsströme und Node-Simulator sind gebaut (U2a), Kalibrierung und Akzeptanztests in `tests/kalibrierung.js` und `tests/akzeptanz.js` (U3). Schwierigkeit (5.4) gebaut mit Startkonto, Kreditrahmen, Entlassungsgrenze, Schonfrist, Saisonziel, Talentsternen und Erinnerungen; Auswahl im Startbildschirm, Werte in `REGELN.schwierigkeit`, Test `tests/schwierigkeit.js` (auch: gleiche Ergebnisse auf Leicht und Schwer). Noch nicht wirksam, weil die Teile fehlen: Vorhersage-Bänder (K35a), Scouting-Spannen (K18), Klugheit der Computer-Vereine (K31). Die Stufe gilt für den ganzen Spielstand und lässt sich nicht wechseln.
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

### 5.3a Die Reichen werden reicher (mit dir entschieden am 10. November 2026)

So ist es auch in der echten Liga: Bayern holt man praktisch nie ein. Man kann in einzelnen Jahren mithalten, aber die besten Spieler wollen dorthin, und dort arbeiten die besten Trainer, Ärzte und Greenkeeper. Das Spiel soll das abbilden, **als Folge der Regeln, nicht als Zuschlag** (5.3 gilt weiter).

**Echte Zahlen:**
- Bayern war von 2012/13 bis 2022/23 elfmal in Folge Meister. 2023/24 wurde Leverkusen erstmals Meister, ohne Niederlage. 2024/25 und 2025/26 holte Bayern den Titel wieder, 2025/26 vier Spieltage vor Schluss. Das sind 13 Titel in 14 Jahren.
- Personalaufwand 2024/25 laut DFL-Bericht und Berichten darüber: Bayern etwa 443 Mio. €, Dortmund etwa 268 Mio. €, im Schnitt etwa 96 Mio. € je Erstligist. Ob die Bayern-Zahl nur das Personal im Spielbetrieb meint, ist in den Quellen nicht einheitlich.

**Woher der Vorsprung kommt** (jeweils im zuständigen Konzept, gleiche Regeln für alle):

| Kanal | Wirkung | Konzept |
|---|---|---|
| Geld | Medienerlöse nach Säulen (Leistung zählt mit), Zuschauer, Sponsoren nach Ansehen, Europapokal | K23, K24, K27 |
| Anziehung | Stars wechseln fast nur zu Vereinen mit hohem Ansehen, Titelchancen und hohem Gehalt | K19 („Stars wählerisch“), K21 |
| Personal | die besten Mitarbeiter wollen zu den besten Vereinen, große Vereine werben ab | K16 §12 Nr. 17 |
| Kontakte | wer viele Geschäfte macht, hat die besten Kontakte zu Beratern | K22 §12 Nr. 9 |
| Infrastruktur | Trainingsgelände, Nachwuchszentrum, Reha-Zentrum, Rasen | K26 |
| Talente | die besten Jugendspieler zieht es zu den großen Vereinen | K08, K32 |
| Ansehen | wächst mit Erfolg und hält lange | K28, K32 |

**Wie man trotzdem manchmal mithält:** Zufall im Spiel, Verletzungen und Stimmung beim Großen, gute Arbeit beim Kleinen (Scouting, Talente früh holen, Taktik, Zusammenhalt). Das Spiel bremst niemanden.

**Machtwechsel über Jahrzehnte** (deine Ergänzung vom 10.11.): Auch Gladbach (fünf Titel, zuletzt 1976/77), der HSV (drei, zuletzt 1982/83) und Dortmund (fünf, zuletzt 2011/12) hatten ihre Hochphasen. Nach 30 und mehr Jahren dürfen sich die Verhältnisse auch im Spiel verschieben, wieder nur als Folge der Regeln:
- **Ansehen ist nicht fest:** Es wächst mit Titeln und internationalen Spielen und sinkt langsam in Jahren ohne Erfolg (K28, K32).
- **Fehler der Computer-Vereine:** Profile mit Risiko machen Schulden, kaufen teuer und falsch, wechseln oft den Trainer (K31, K23 bis zur Insolvenz). So kann auch ein großer Verein abstürzen, wie der HSV.
- **Generationen:** Stars altern, Talent-Jahrgänge sind unterschiedlich stark (K08, K32). Ein Verein mit gutem Nachwuchszentrum und Scouting kann eine Generation lang oben mitspielen.
- **Stab und Kontakte** wandern mit den Leuten (K16, K22).
- **Später denkbar:** Investoren und Aufsteiger mit neuem Geld als Ereigniskarte (K30), im Rahmen der 50+1-Regel. Erst prüfen.

**Europapokal fehlt noch** und ist in Wirklichkeit einer der größten Treiber des Vorsprungs: In der Champions League bekommt jeder Teilnehmer 2025/26 18,62 Mio. € Startgeld, dazu 2,1 Mio. € je Sieg in der Ligaphase, ein Sieger kann auf weit über 100 Mio. € kommen. **Champions League, Europa League und Conference League gehören deshalb langfristig fest ins Spiel** (deine Entscheidung vom 10.11., Konzept K37, PLAN §3). Bis dahin bekommen die Plätze 1–4, 5–6 und 7 der Bundesliga in der folgenden Saison eine Pauschale für internationale Einnahmen (K23, vorläufig, Höhe bei der Umstellung auf echte Geldwerte in U13).

**Vereinswert statt „der Größte“** (deine Ergänzung vom 10.11.): Nicht jede Liga hat einen einzigen Großen. In Spanien teilen sich Real Madrid und Barcelona fast alle Titel (Atlético wurde seit 2014 nur 2020/21 Meister), in England gibt es mehrere große Vereine. Entscheidend ist der **Gesamtwert eines Vereins**: Er zieht die besten Spieler an, und die Meisterschaften gehen eher in seine Richtung. Ob eine Liga einen, zwei oder sechs Große hat, ergibt sich dann von selbst.
- **Vereinswert** (neu, berechnet, sichtbar in der Tabelle und beim Verein): Kaderwert (K19), Finanzkraft aus Umsatz und Konto (K23), Ansehen (K28, K32), Infrastruktur (K26) und Stab (K16). Die Gewichte legt die Kalibrierung fest.
- Spieler (K19) und Mitarbeiter (K16) schauen beim Wechsel auf den Vereinswert, nicht nur auf das Ansehen.

**Kalibrierziel (mit dir entschieden am 10.11.):** Die Titel folgen dem Vereinswert. Über 20 Saisons gehen mindestens 85 % der Meisterschaften an die drei wertvollsten Vereine zu Saisonbeginn. Wie sie sich darauf verteilen, hängt vom Abstand ab: Ist einer weit vorn wie Bayern heute, holt er **etwa zwei Drittel** (55–75 %), nicht 13 von 14 wie zuletzt in echt. Liegen zwei gleichauf, teilen sie sich die Titel. Ein Verein aus der unteren Hälfte des Vereinswerts wird in 20 Saisons höchstens einmal Meister. Über 30 Saisons gibt es mindestens drei verschiedene Meister, und mindestens einmal fällt ein Verein aus den ersten drei des Vereinswerts dauerhaft zurück. Für die Auslandsligen (K32) gilt dieselbe Regel, sobald sie mit dem Europapokal (K37) gespielt werden. **Heute** wird Bayern in drei Seeds je drei Saisons 4-mal von 9 Meister. Das ist schon der häufigste Meister (Frankfurt, Leipzig und Leverkusen teilen sich die übrigen fünf), aber weniger als zwei Drittel. Ohne Markt (U10, U11), echte Geldwerte (U13) und Europapokal (K37) lässt sich das noch nicht sinnvoll einstellen. Geprüft wird nach U11 mit einem neuen Test über viele Saisons.

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

**Mit dir entschieden (10. November 2026):** Die Reichen werden reicher, wie in der echten Liga (5.3a), aber mit Maß. Die Titel folgen dem Vereinswert (nicht „dem Größten“): mindestens 85 % an die drei wertvollsten, ein einzelner weit vorn etwa zwei Drittel. Über Jahrzehnte dürfen sich die Verhältnisse verschieben. Champions League, Europa League und Conference League kommen langfristig ins Spiel (K37). Vorläufig dazu: die Kanäle und Gründe für Machtwechsel in 5.3a, eine Europapokal-Pauschale bis zum echten Europapokal.

## Quellen

- Kritik „Ergebnis steht vorher fest“: `konzepte/_recherche-genre.md`, Abschnitt 4
- Generator und Seed: `js/zufall.js`, `konzepte/K33-daten.md`
- Zielwerte: `konzepte/K03-spielermodell.md` §10, `konzepte/K04-engine.md` §10 mit ihren Quellen
- Bayern elfmal in Folge Meister bis 2023, Leverkusen 2024 ohne Niederlage: [bundesliga.com: Leverkusen erster Titel](https://www.bundesliga.com/de/bundesliga/news/bayer-04-leverkusen-deutscher-meister-2024-erster-titel-26960), [FC Bayern gratuliert Leverkusen](https://fcbayern.com/de/news/2024/04/fc-bayern-gratuliert-bayer-04-leverkusen-zur-meisterschaft); Meister 2025/26 vier Spieltage vor Schluss, 35. Titel: [zdfheute](https://www.zdfheute.de/sport/bundesliga-bayern-muenchen-deutscher-meister-saison-bilanz-100.html), [FC Bayern: 8 Meilensteine zur 35. Meisterschaft](https://fcbayern.com/de/news/2026/04/8-meilensteine-zur-35-deutschen-meisterschaft-des-fc-bayern)
- Personalaufwand 2024/25: [DFL Economic Report 24/25](https://report.bundesliga.de/2425/en/economic-report/economic-figures/bundesliga/groups-by-payroll-costs-for-match-operations.html), [buli-tipphilfe.de: Gehälter](https://www.buli-tipphilfe.de/blog/bundesliga-gehaelter-2026-2027), [heidelberg24: Gehaltsranking](https://www.heidelberg24.de/sport/fussball/bundesliga-gehaltsranking-finanzmeister-bayern-dominiert-das-zr-93203342.html) (10.11., Zusammenfassungen der Suchergebnisse)
- Meistertitel Gladbach (fünf, zuletzt 1976/77), HSV (drei, zuletzt 1982/83), Dortmund (fünf, zuletzt 2011/12): [Flashscore: alle Meister seit 1963](https://www.flashscore.de/news/ubersicht-alle-meister-seit-der-bundesliga-einfuhrung-1963/xCfSQik3/), [bundesliga.com: Liste deutscher Meister](https://www.bundesliga.com/de/bundesliga/news/liste-deutscher-meister-bundesliga-koln-bayern-nurnberg-dortmund-bremen-kaiserslautern-23908)
- Champions League 2025/26: 18,62 Mio. € Startgeld, 2,1 Mio. € je Sieg, 0,7 Mio. € je Remis in der Ligaphase, Ausschüttung aller drei Wettbewerbe brutto 4,4 Mrd. €: [UEFA-Rundschreiben 2025/32](https://editorial.uefa.com/resources/029a-1e0b55357e10-4e4ca5094458-1000/20250616_circular_2025_32_de.pdf), [Abendzeitung München](https://www.abendzeitung-muenchen.de/sport/fussball/nach-der-reform-champions-league-noch-groessere-goldgrube-art-1006993,PRINT), [SI: Prize money 2025/26](https://www.si.com/soccer/2025-26-champions-league-prize-money-full-list-earnings-every-club) (10.11., Zusammenfassungen; Beträge für Europa League und Conference League noch nicht geprüft)
- Spanien: Atlético seit 2014 nur 2020/21 Meister, sonst Real Madrid und Barcelona: [ESPN: LaLiga-Meister](https://africa.espn.com/football/story/_/id/45142644/who-won-laliga-championship-all-winners-list), [theScore: Recent La Liga champions](https://www.thescore.com/news/3286479) (10.11.)
