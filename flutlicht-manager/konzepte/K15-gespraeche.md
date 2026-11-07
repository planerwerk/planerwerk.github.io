# K15 – Gespräche und Ansprachen

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
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

## Quellen

- Gesprächsthemen, Versprechen, Antwort nach Charakter: `konzepte/_rohmaterial-logik-v1.md`, Abschnitt 9.4
- Versprechen und gemäßigte Reaktionen im FM, Kritik an Pressekonferenzen, Wünsche zu Gesprächen: `konzepte/_recherche-genre.md`, Abschnitte 3.1, 4 und 4b
- Zuständigkeiten Glaubwürdigkeit und Halbzeitansprache: `konzepte/_konsistenzpruefung.md`, D1 und D2
