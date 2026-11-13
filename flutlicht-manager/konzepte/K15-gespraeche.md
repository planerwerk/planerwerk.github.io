# K15 – Gespräche und Ansprachen

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12. **Umgesetzt in U8** (9. November 2026, `js/gespraeche.js`, Test `tests/kabine.js`): Einzelgespräche mit sieben Themen und drei Haltungen, Reaktion nach Charakter, Glaubwürdigkeit, Abnutzung, vier Arten von Versprechen mit Überwachung, Mannschaftsansprache, Halbzeitansprache mit Glaubwürdigkeit, Computer-Vereine vereinfacht. Abweichungen und Lücken in Abschnitt 12.
Hängt ab von: K14 (Stimmung, Rollen), K03 (Charakter) · Wird gebraucht von: K05, K06, K08, K19, K21, K28, K29.

## 1. Ziel und Spielgefühl

- **Worte sind ein Werkzeug mit Preis:** Wer verspricht, muss liefern. Wer ständig lobt, wird nicht mehr gehört.
- **Jeder Spieler reagiert anders:** Ein Kämpfer braucht Klartext, eine Diva Streicheleinheiten, ein Nervenschwacher Rückendeckung.
- **Wenige, wichtige Gespräche** statt Dauerklicken. Die Community klagt bei Pressekonferenzen über immer gleiche Fragen ohne Folgen (Recherche 4). Hier hat jedes Gespräch einen Anlass und eine Folge.

## 2. Vorbilder und Abgrenzung

- **Rohmaterial 9.4:** Themen wie Einsatz versprechen, Geduld erbitten, Rolle erklären, Verlängerung anbieten, Wechsel in Aussicht stellen, Kritik. Antwort nach Charakter. Übernommen.
- **Football Manager:** Versprechen mit Überwachung, seit FM24 weniger extreme Reaktionen (Recherche 3.1). Übernommen.
- **Community-Wünsche:** Gespräche, die nach einem Streit nicht komplett blockiert sind. Spieler, die mit Taktik oder Position hadern (Recherche 4b). Übernommen.
- **Bewusst anders:** keine langen Dialogbäume. Ein Gespräch ist ein Thema, eine Haltung und höchstens eine Rückfrage.

## 3. Begriffe und Daten

| Begriff | Bedeutung | Ort |
|---|---|---|
| **Glaubwürdigkeit** | wie sehr die Mannschaft deinen Worten glaubt, 0–100, Start 60 | `t.glaub` (je Mannschaft, also für dich beim aktuellen Verein) |
| Versprechen | Zusage mit Bedingung und Frist | `S.versprechen` |
| Abnutzung | wie oft du einem Spieler dasselbe gesagt hast | je Spieler und Thema, 4 Wochen Gedächtnis |
| Gesprächszeit | höchstens 3 Einzelgespräche pro Woche | berechnet |

Glaubwürdigkeit gehört zu K15, K29 nutzt sie für die Presse (Konsistenzprüfung D1).

### 3.1 Themen im Einzelgespräch

| Thema | wann sinnvoll | mögliche Zusage |
|---|---|---|
| Stimmung erfragen | jederzeit | – (zeigt die Gründe aus K14 §5.1) |
| Rolle erklären | Spieler sieht sich höher als seine Rolle | – |
| Einsatz versprechen | Bankspieler, Wechselwunsch | „mindestens X % der Minuten in den nächsten N Spielen“ |
| Geduld erbitten | Talent, Neuzugang, nach Verletzung | „deine Chance kommt bis …“ |
| Position erklären | Spieler hadert mit Position (K06) | Umschulung anbieten (K07) oder zurück auf seine Position |
| Verlängerung anbieten | Vertrag läuft aus | führt zu K21 |
| Wechsel in Aussicht stellen | unzufriedener Spieler, du willst verkaufen | „wir lassen dich bei einem Angebot über X gehen“ |
| Kein Konkurrent | Stammspieler fürchtet Neuzugang | „wir holen niemanden für deine Position bis …“ (bindet dich bei K19) |
| Persönliches | Heimweh, Familie | „wir helfen beim Umzug der Familie“ (Kosten) |
| Lob | gute Leistung | – |
| Kritik | schwache Leistung, Disziplin | – |

### 3.2 Haltung

Zu jedem Thema wählst du eine Haltung: **verständnisvoll**, **sachlich** oder **bestimmt**. Die Haltung trifft auf den Charakter (5.2).

## 4. Abläufe

1. **Anlass:** Gesprächswunsch des Spielers (Halt, K14 Stufe 2), Hinweis im Wochenbericht oder deine eigene Wahl auf der Spielerkarte.
2. **Gespräch:** Thema, Haltung, eventuell Zusage. Der Spieler antwortet sofort (Text) und nennt, wenn nötig, eine Bedingung („Nur wenn ich auch im Pokal spiele“).
3. **Folge:** Stimmung, Wechselwunsch-Stufe, Versprechen wird angelegt.
4. **Überwachung:** Das Spiel prüft jedes Versprechen laufend. Kurz vor der Frist eine Erinnerung vor „Tag beenden“ (K01), wenn es zu kippen droht.
5. **Ende:** gehalten oder gebrochen, mit Folgen für Stimmung und Glaubwürdigkeit.
6. **Mannschaftsansprache außerhalb des Spiels:** nach einer Serie, vor dem Saisonstart, vor einem Endspiel. Höchstens einmal pro Woche.

## 5. Regeln und Formeln

### 5.1 Wirkung eines Gesprächs

```
Wirkung = Grundwirkung (Thema, Lage) × Reaktion (Charakter, Haltung) × Glaubwürdigkeit × Ruf-Gefälle (K14 §5.2) × Abnutzung
Glaubwürdigkeitsfaktor = 0,5 + Glaubwürdigkeit/100 × 0,7      (0,5 bei 0, 1,2 bei 100)
Abnutzung = 1 beim ersten Mal, 0,5 beim zweiten Mal in 4 Wochen, 0,2 danach
```

- Grundwirkung auf die Stimmung: Stimmung erfragen 0 (nur Auskunft), Rolle erklären +3, Einsatz versprechen +10, Geduld +5, Wechsel in Aussicht +8, Lob +4, Kritik −4 (kann bei manchen positiv sein).
- **Passt das Thema nicht zur Lage** (Lob nach einer Note 5, Kritik nach einem Tor), kehrt sich die Wirkung halb um.
- **Nach einem Streit** ist das nächste Gespräch nicht blockiert, wirkt aber nur halb (Community-Wunsch).

### 5.2 Reaktion nach Charakter

| Eigenschaft (K03) | verständnisvoll | sachlich | bestimmt | Lob | Kritik |
|---|---|---|---|---|---|
| Kämpfer | ×0,8 | ×1 | ×1,3 | ×1 | wirkt positiv (+3) |
| Diva | ×1,4 | ×0,8 | ×0,4, Streitgefahr | ×1,5, nutzt sich doppelt ab | ×2 negativ |
| nervenschwach | ×1,3 | ×1 | ×0,5 | ×1,2 | ×2 negativ, Selbstvertrauen −0,5 |
| Hitzkopf | ×1 | ×1 | ×0,7, 20 % Streit | ×1 | 20 % Streit, Karten im nächsten Spiel ×1,2 |
| Vorbildprofi | ×1 | ×1,2 | ×1 | ×0,7 | ×0,5 negativ |
| Führungsspieler | ×1 | ×1,2 | ×1 | ×1 | unter vier Augen ×0,5 negativ, öffentlich ×2 negativ |
| Söldner | ×0,7 | ×1 | ×1 | ×0,7 | ×1. Spricht lieber über Geld: Verlängerung wirkt ×1,5. |
| ohne Eigenschaft | ×1 | ×1 | ×1 | ×1 | ×1 |

Die Persönlichkeitswerte (K03 §3.3) verschieben das zusätzlich leicht, damit nicht alle Spieler ohne Eigenschaft gleich reagieren.

### 5.3 Versprechen

| Ergebnis | Spieler | Glaubwürdigkeit |
|---|---|---|
| gehalten | +5 Stimmung | +3 |
| gebrochen | −15 Stimmung, Wechselwunsch +1 Stufe | −10 (die Kabine redet) |
| durch Umstände unmöglich (Verletzung des Spielers) | – | – |

- **Glaubwürdigkeit erholt sich** um 1 pro Woche bis 60, darüber nur durch gehaltene Versprechen und Erfolg.
- **Zu viele offene Versprechen:** ab 4 gleichzeitig sinkt die Glaubwürdigkeit um 2 pro Woche. Wer allen alles verspricht, verspricht nichts.

### 5.4 Mannschaftsansprache

| Ansprache | passt bei | Wirkung |
|---|---|---|
| Rückendeckung | Niederlagenserie | Selbstvertrauen aller +0,3, Mannschaftsstimmung +3 |
| Weckruf | schlechte Leistungen trotz guter Lage | Form der nächsten zwei Spiele: Note zählt 20 % stärker (Reiz), Kämpfer +, Diven − |
| Ziel neu setzen | Saisonstart, Winterpause | Stimmung +2, Erwartung im Baustein „Erfolg“ wird neu justiert (K14) |
| Endspiel-Rede | Pokalfinale, Relegation, letzter Spieltag | Wirkung im Spiel +2 %, bei Nervenschwachen −2 % |
| Rotation ankündigen (U8d, K14 §12) | englische Woche voraus: zwei Pflichtspiele in sieben Tagen, oder das nächste höchstens vier Tage nach dem letzten | sieben Tage lang zählt die Bank für Stammspieler nicht (bis drei Spiele in Folge), dazu +1 je Spiel auf der Bank. Unpassend: Stammspieler −1 |

Alle mit Glaubwürdigkeit und Abnutzung wie in 5.1.

### 5.5 Halbzeitansprache (Wirkung zu K05)

K05 regelt Ablauf und Zeitpunkt, K15 die Wirkung (Konsistenzprüfung D2). Ab Welle 3 werden die Werte aus K05 §5.4 mit Glaubwürdigkeitsfaktor und Charakter-Reaktion (5.2) multipliziert. Eine passende Ansprache hebt dazu die Glaubwürdigkeit um 1, eine unpassende senkt sie um 2.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Gespräch zur rechten Zeit | Wechselwunsch abwenden, Stimmung | Gesprächszeit (3 pro Woche) |
| Versprechen | starke Wirkung | bindet Einsatzzeit, Kaderplanung und Transfers |
| Haltung passend wählen | mehr Wirkung | falsch gewählt: Streit |
| öffentlich kritisieren (K29) | Druck | Führungsspieler und Diven reagieren doppelt negativ |
| Mannschaftsansprache | kurzer Schub | Abnutzung |

## 7. Verhalten der Computer-Vereine

- Vereinfacht: Bei einem Gesprächswunsch (Stufe 2) führt der Computer-Trainer ein Gespräch, das mit einer Wahrscheinlichkeit nach Klugheitsstufe (K02) gelingt (gemütlich 40 %, normal 55 %, clever 70 %). Gelingt es, sinkt die Stufe.
- Versprechen der Computer-Trainer werden nur für den Wechselwunsch nachgebildet, nicht im Einzelnen.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Versprechen kippt (Erinnerung) | Bedingung kaum noch erreichbar | einlösen (Einsatz geben) oder brechen |
| Spieler fordert Versprechen ein | Frist abgelaufen, gebrochen | Gespräch, Stimmung, Glaubwürdigkeit |
| Streit nach Kritik | Hitzkopf, Diva | Stimmung beider Seiten, eventuell Presse (K29) |
| Kabine glaubt dir nicht mehr | Glaubwürdigkeit unter 25 | Ansprachen wirken kaum, Vorstand wird aufmerksam (K28) |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | Charakter, Selbstvertrauen |
| K05 Live-Spiel | Halbzeitansprache und Zurufe bekommen ihre volle Wirkung |
| K06 Taktik | Spieler hadert mit Position |
| K07 Training | Umschulung als Gesprächsergebnis |
| K08 Jugend | Geduld erbitten, Talente schützen |
| K14 Kabine | Stimmung, Wechselwunsch, Ruf-Gefälle |
| K19 Transfers | Versprechen „kein Konkurrent“ und „Wechsel in Aussicht“ binden dich |
| K21 Verträge | Verlängerung, versprochene Rolle im Vertrag |
| K28 Vorstand | Gespräche mit dem Vorstand nutzen dieselbe Mechanik, Glaubwürdigkeit als Warnsignal |
| K29 Presse | nutzt die Glaubwürdigkeit, öffentliche Kritik |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Gespräche helfen | ein sinnvolles Gespräch mit passender Zusage löst 40–60 % der Gesprächswünsche (Stufe 2) |
| Versprechen brechen kostet | Glaubwürdigkeit fällt nach zwei gebrochenen Versprechen deutlich (unter 45) |
| Dauerlob lohnt nicht | wöchentliches Lob an denselben Spieler bringt nach vier Wochen fast nichts mehr |
| Charakter zählt | dieselbe Kritik wirkt bei Kämpfern im Schnitt positiv, bei Diven deutlich negativ |
| Zeit begrenzt | höchstens 3 Einzelgespräche pro Woche |

## 11. Stellschrauben

```js
gespraeche:{
  proWoche:3,glaubwuerdigkeit:{start:60,faktor:[0.5,0.7],erholungBis:60,erholung:1,gehalten:3,gebrochen:-10,offenAb:4,offenMinus:2},
  wirkung:{rolle:3,einsatz:10,geduld:5,wechsel:8,lob:4,kritik:-4,unpassend:-0.5,nachStreit:0.5},
  abnutzung:{wochen:4,zweites:0.5,danach:0.2},
  versprechen:{gehalten:5,gebrochen:-15,stufe:1},
  reaktion:{ /* Tabelle aus 5.2 */ },
  mannschaft:{rueckendeckung:{sv:0.3,stimmung:3},weckruf:{note:1.2},ziel:{stimmung:2},endspiel:{wirkung:0.02,nervenschwach:-0.02},proWoche:1},
  halbzeit:{passend:1,unpassend:-2},
  ki:{gelingt:{gemuetlich:0.40,normal:0.55,clever:0.70}}
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Kurze Gespräche:** Thema, Haltung, höchstens eine Rückfrage. Keine Dialogbäume.
2. **Drei Einzelgespräche pro Woche** als Grenze gegen Dauerklicken.
3. **Glaubwürdigkeit je Mannschaft,** nicht je Spieler. Gebrochene Versprechen sprechen sich herum.
4. **Computer-Vereine** nur vereinfacht.

**Vorläufig entschieden bei der Umsetzung (U8, 9. November 2026):**
5. **Gebaut sind sieben Themen:** Rolle erklären, Einsatz versprechen, Geduld erbitten, Wechsel in Aussicht stellen, keine Konkurrenz, Lob, Kritik. Nicht gebaut: „Stimmung erfragen“ (die Gründe stehen immer auf der Spielerkarte, Informationen sind nie gesperrt, K36), „Position erklären“ (Hadern mit der Position fehlt in K06), „Verlängerung anbieten“ (läuft über den Vertrag auf der Spielerkarte), „Persönliches“ (Heimweh fehlt).
6. **Ohne Anlass keine Wirkung und keine Zusage:** Rolle erklären nur, wenn er sich höher sieht; Einsatz versprechen nur bei weniger als 60 % Einsatz oder Wechselwunsch; Geduld nur für Rotation, Ergänzung, Talente, Neuzugänge oder bei Wechselwunsch; Wechsel nur bei Wechselwunsch oder Stimmung unter 50; keine Konkurrenz nur für Stammspieler mit Rivalen oder einem neuen, ähnlich starken Mitspieler auf seiner Position. Sonst ließe sich Glaubwürdigkeit mit leichten Zusagen sammeln. Auch ein Gespräch ohne Anlass kostet Gesprächszeit.
7. **Zusagen konkret:** Einsatz = mindestens 60 % der Minuten in den nächsten fünf Pflichtspielen, in denen er verfügbar ist. Geduld = ein Startelf-Einsatz innerhalb von sechs Wochen (hinfällig, wenn er die halbe Zeit verletzt war). Wechsel = er kommt zum Marktwert auf die Transferliste; gebrochen, wenn du ein Angebot ab diesem Preis ablehnst oder verfallen lässt oder ihn von der Liste nimmst, gehalten bei einem Verkauf, hinfällig nach vier Monaten ohne Angebot. Keine Konkurrenz = vier Monate kein Kauf auf seiner Position, der höchstens 2 Punkte schwächer ist als er. Grundwirkung „keine Konkurrenz“ +6 (im Entwurf ohne Zahl).
8. **Haltung bei schädlichen Gesprächen:** Ist die Wirkung negativ (Kritik), wirkt der Haltungsfaktor umgekehrt: Schaden × (2 − Faktor), begrenzt auf 0,4–1,6. Eine passende Haltung mildert, eine unpassende verstärkt.
9. **Mehrere Eigenschaften:** Haltungs- und Lobfaktoren werden multipliziert, für Kritik gilt die erste Eigenschaft in der Reihenfolge Diva, nervenschwach, Hitzkopf, Söldner, Vorbildprofi, Führungsspieler, Kämpfer. Kritik: Kämpfer +3, Diva −8, nervenschwach −8 und Selbstvertrauen −0,5, Hitzkopf −4, Vorbildprofi −2, Führungsspieler −2 (unter vier Augen), Söldner −4. Streit: Diva bei bestimmter Haltung 30 %, Hitzkopf bei bestimmter Haltung oder Kritik 20 %; Folgen −5 Stimmung, Zusammenhalt −3, das nächste Gespräch wirkt vier Wochen lang halb. „Hitzkopf: Karten im nächsten Spiel ×1,2“ und „Söldner: Verlängerung ×1,5“ sind nicht gebaut.
10. **Persönlichkeit:** Die Anpassungsfähigkeit verschiebt die Wirkung um ±2 % je Punkt Abstand von 10.
11. **Wirkung sofort und als Baustein:** Die Wirkung geht sofort auf die Stimmung (höchstens ±10, K14 §4.2) und zur Hälfte in den Baustein „Trainer“ (verblasst um 10 % pro Woche). Ein gebrochenes Versprechen kostet −10 sofort und −5 über den Baustein.
12. **Gesprächswunsch:** gelöst mit 15 % + 4 % je Punkt Wirkung (5–90 %), eine Einsatz-Zusage löst so etwa die Hälfte. Gescheitert (Streit oder keine positive Wirkung): sofort offizieller Wechselwunsch. Sonst bleibt Stufe 2 ohne neuen Halt. Ein gebrochenes Versprechen hebt den Wechselwunsch um eine Stufe, Stufe 2 wird dabei wieder zum Gesprächswunsch.
13. **Lob und Kritik nach der letzten Note:** Lob ab 4,5 und Kritik bis 2,5 sind unpassend (halb umgekehrt).
14. **Mannschaftsansprache, wann sie passt:** Rückendeckung nach zwei Niederlagen in den letzten drei Pflichtspielen. Weckruf, wenn die letzten drei Spiele 1,5 Punkte unter der Erwartung lagen und der Platz höchstens zwei schlechter ist als erwartet. Ziel neu setzen vor dem dritten Ligaspiel, ab dem 15. Dezember und im Januar. Endspiel-Rede, wenn das nächste Pflichtspiel in den nächsten sieben Tagen ein Pokalfinale, ein Relegationsspiel oder der letzte Spieltag ist. Abnutzung je Ansprache über vier Wochen.
15. **Halbzeitansprache:** Die Wirkung aus K05 wird mit dem Glaubwürdigkeitsfaktor multipliziert. Die Glaubwürdigkeit ändert sich danach nur bei Ansprachen mit Anlass (Loben, Motivieren, Fordern, Beruhigen) und ohne Abnutzung: passend +1, unpassend −2. Sonst brächte jede Ansprache „Taktik“ einen Punkt. Die Reaktion einzelner Spieler nach Charakter ist nicht gebaut, „Fordern“ berücksichtigt Kämpfer und Diven schon in K05.
16. **Glaubwürdigkeitskrise** unter 25: einmal −3 Vertrauen beim Vorstand (bis K28), wieder möglich nach einer Erholung über 35. Ein Bonus aus Erfolg ist nicht gebaut.
17. **Erinnerung** „Versprechen droht zu kippen“ am Spieltag (abschaltbar), wenn der Spieler nicht in der Startelf steht und die restlichen Spiele kaum noch reichen.
18. **Vereinswechsel:** Offene Zusagen beim alten Verein sind hinfällig, ohne Folgen.
19. **Lernstufen (K36):** Einzelgespräche ohne Zusagen und Mannschaftsansprache ab der C-Lizenz, Zusagen (Versprechen) ab der B-Lizenz. Bis dahin führt der Co-Trainer das Gespräch beim Gesprächswunsch nach der Regel der Computer-Vereine (kommt mit UL).
20. **Noch nicht gebaut:** Gespräche mit dem Vorstand (K28), öffentliche Kritik und Presse (K29), Karten aus §8 als eigene Ereignisse (gebrochene Versprechen und Glaubwürdigkeitskrise kommen als Nachricht).
21. **Thema „Druck nehmen“ (U9c, K08 §5.3):** für Spieler bis 21 nach einem prägenden oder schwachen Spiel, bei negativem Selbstvertrauen oder zu hoher Belastung. Wirkung 3, ohne Zusage, dazu +0,3 Selbstvertrauen, wenn es negativ ist. In den drei Tagen nach einem prägenden Spiel zählt das Gespräch als Umgang (Lob, Kritik oder Druck nehmen).

## Quellen

- Gesprächsthemen, Versprechen, Antwort nach Charakter: `konzepte/_rohmaterial-logik-v1.md`, Abschnitt 9.4
- Versprechen und gemäßigte Reaktionen im FM, Kritik an Pressekonferenzen, Wünsche zu Gesprächen: `konzepte/_recherche-genre.md`, Abschnitte 3.1, 4 und 4b
- Zuständigkeiten Glaubwürdigkeit und Halbzeitansprache: `konzepte/_konsistenzpruefung.md`, D1 und D2
