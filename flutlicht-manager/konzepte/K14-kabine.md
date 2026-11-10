# K14 – Stimmung, Selbstvertrauen, Kabine

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12. **Umgesetzt in U8** (9. November 2026, `js/kabine.js`, Test `tests/kabine.js`): Stimmung mit sechs Bausteinen und Trägheit, Kaderrollen mit eigener Einschätzung, Wechselwunsch in vier Stufen mit Gesprächswunsch als Halt, Mannschaftsstimmung, Ansteckung, Zusammenhalt mit Wirkung im Spiel, Freundschaften, Rivalitäten, Grüppchen, Kapitän, Teamevent, Folgen für Leistung, Lernen und Verlängerung. Abweichungen und Lücken in Abschnitt 12. **Die Bankzeit wird nach deiner Entscheidung vom 10.11. umgebaut** (§12, „Bankzeit nach Grund“, vorgemerkt als U8d, noch nicht gebaut).
Hängt ab von: K03 (Werte, Beziehungsdaten), K15 (Gespräche) · Wird gebraucht von: K05, K08, K11, K12a, K19, K21, K29.

## 1. Ziel und Spielgefühl

- **Spieler sind Menschen:** Wer auf der Bank sitzt, obwohl er sich als Stammspieler sieht, wird unzufrieden. Wer gebraucht wird, blüht auf.
- **Langsam statt Ausschläge über Nacht:** Stimmung hat Trägheit. Die Community schätzt glaubwürdige Reaktionen, FM24 hat extreme Ausschläge reduziert (Recherche 4).
- **Die Kabine ist mehr als die Summe:** Führungsspieler, Grüppchen, Freundschaften, Rivalitäten. Ein unzufriedener Leitwolf zieht andere mit.
- **Folgen sind spürbar, aber kein Haupthebel:** Stimmung wirkt auf Training, Verträge und Wechselwünsche stärker als auf die Leistung im Spiel (Rohmaterial 9.2).

## 2. Vorbilder und Abgrenzung

- **Rohmaterial Kapitel 9:** Stimmung 0–100 aus Einsatzzeit, Erfolg, Leistung, Vertrag, Trainer, Umfeld. Wechselwunsch in Stufen. Kabine mit Ansteckung. Übernommen.
- **Football Manager:** Hierarchie, Grüppchen und Beziehungen werden angezeigt. Stimmung fällt schnell, wenn ein Spieler einen viel höheren Ruf hat als der Trainer (Recherche 3.1, 4). Übernommen als Ruf-Gefälle.
- **Anstoss 3:** Freundschaften, Konkurrenz um den Stammplatz, Landsleute, Zimmerbelegung (PLAN §4). Übernommen.
- **Bewusst anders:** **Kaderrollen** mit klarer Erwartung an Einsatzzeit. Der Spieler hat eine eigene Einschätzung, die von deiner abweichen kann. Daraus entsteht der Konflikt, nicht aus versteckten Zahlen.

## 3. Begriffe und Daten

| Wert | Bereich | Ort |
|---|---|---|
| Stimmung je Spieler | 0–100, Start 60–75 | `st` (K03) |
| Kaderrolle | Schlüsselspieler, Stammspieler, Rotation, Ergänzung, Talent | `rolle`, von dir gesetzt oder automatisch |
| Eigene Einschätzung | Rolle, die der Spieler für sich sieht | berechnet |
| Wechselwunsch | Stufe 0–4 | `ww` |
| Mannschaftsstimmung | 0–100 | berechnet |
| **Zusammenhalt** | 0–100 je Mannschaft, Start 50 | `t.zh` |
| Beziehungen | Freundschaft, Rivalität, Stärke 1–3 | `S.bz` (K03 §3.6) |
| Kapitän | ein Spieler | `t.taktik.kapitaen` (K06) |

### 3.1 Kaderrollen und Erwartung

| Rolle | erwartete Einsatzzeit (Anteil der möglichen Minuten, 6 Wochen) |
|---|---|
| Schlüsselspieler | 85 % |
| Stammspieler | 65 % |
| Rotation | 40 % |
| Ergänzung | 15 % |
| Talent | 15 %, dazu Entwicklung und gelegentliche Einsätze |

- **Eigene Einschätzung:** aus seinem Rang nach Stärke auf seiner Position im Kader, verschoben durch Ehrgeiz (ehrgeizig: eine Stufe höher) und Ruf (Nationalspieler: mindestens Stammspieler).
- **Liegt deine Rolle unter seiner Einschätzung,** sinkt die Stimmung langsam. Diven doppelt so stark.

## 4. Abläufe

1. **Wöchentlich** (Montag): Zielstimmung je Spieler aus den Bausteinen (5.1), tatsächliche Stimmung bewegt sich 15 % dorthin. Mannschaftsstimmung, Ansteckung, Zusammenhalt, Beziehungen.
2. **Sofort,** aber gedeckelt auf ±10: große Ereignisse wie Siegtor im Derby, Verkauf eines Freundes, gebrochenes Versprechen (K15).
3. **Wechselwunsch** nach Stufen (5.4), mit Gesprächswunsch als Halt (K15).
4. **Wochenbericht** des Co-Trainers: Wer unzufrieden ist und warum, wer gerade aufblüht, Stimmung in der Kabine.

## 5. Regeln und Formeln

### 5.1 Zielstimmung

```
Ziel = 60 + Einsatz + Erfolg + Leistung + Vertrag + Trainer + Umfeld   (begrenzt 0–100)
```

| Baustein | Spanne | Woraus |
|---|---|---|
| Einsatz | −25 bis +10 | Einsatzzeit gegenüber seiner Erwartung (eigene Einschätzung), Ehrgeiz verstärkt |
| Erfolg | −10 bis +10 | Tabellenplatz gegenüber der Erwartung, Serien |
| Leistung | −5 bis +5 | Form (K03) |
| Vertrag | −15 bis +5 | Gehalt gegenüber Mitspielern ähnlicher Stärke, Restlaufzeit, Versprechen im Vertrag (K21) |
| Trainer | −15 bis +10 | Gespräche, Kritik, Lob, gehaltene oder gebrochene Versprechen (K15) |
| Umfeld | −10 bis +5 | Integration und Heimweh, Medien (K29), Fans (K27), Urlaubslänge (K12a: 4 Wochen +3, 2 Wochen −3 für Spieler mit hoher Saisonbelastung) |

### 5.2 Ruf-Gefälle

- Liegt der Ruf eines Spielers (Stärke, Nationalspieler, Erfolge) deutlich über dem Ruf des Trainers (K28), wirken Gespräche und Lob nur halb, Kritik doppelt, und der Baustein „Einsatz“ fällt 1,5-mal so stark.
- So spürt ein junger Trainer bei einem Weltstar die Grenzen seiner Autorität.

### 5.3 Folgen

| Bereich | Folge |
|---|---|
| Leistung | Zustandsfaktor (K03 §5.8): unter 20 bis −3 %, über 85 bis +2 % |
| Training | unter 30 lernt er 30 % langsamer (K03 §5.6) |
| Vertrag | unter 40 verlängert er nur zu deutlich höheren Bedingungen, unter 25 gar nicht (K21) |
| Kabine | Führungsspieler unter 35 ziehen Freunde mit (5.5) |
| Wechselwunsch | Stufen nach 5.4 |

### 5.4 Wechselwunsch in Stufen

| Stufe | Auslöser | Folge |
|---|---|---|
| 1 Grummeln | Stimmung unter 40 seit 3 Wochen | Hinweis im Wochenbericht |
| 2 Gesprächswunsch | Stimmung unter 35 seit 4 Wochen | **Halt:** Gespräch (K15) |
| 3 offizieller Wechselwunsch | Stufe 2 ohne Besserung nach 4 Wochen oder gescheitertes Gespräch | will auf die Transferliste, Ablöse sinkt um 10 %, andere Vereine wissen es (K19) |
| 4 öffentlich | Stufe 3 seit 4 Wochen, Charakter Diva oder Söldner wahrscheinlicher | Medien (K29), Mannschaftsstimmung −3 |

Die Stufe sinkt wieder, wenn die Stimmung über 50 steigt.

### 5.5 Mannschaftsstimmung und Ansteckung

- **Mannschaftsstimmung** = Schnitt der Spieler, Führungsspieler zählen doppelt, der Kapitän 2,5-fach.
- **Ansteckung** wöchentlich: Ein Führungsspieler unter 35 senkt die Stimmung seiner Freunde um 2. Ein Führungsspieler über 70 hebt alle unter 50 um 1.
- **Grüppchen:** Freunde und Landsleute mit gemeinsamer Sprache bilden Gruppen. Liegt eine Gruppe im Schnitt unter 35, sinkt der Zusammenhalt um 2 pro Woche (Ereignis „Grüppchenbildung“).

### 5.6 Zusammenhalt

- **Steigt:** +1 pro Woche mit unveränderter Stammelf, +1 je Sieg, +1 pro Tag im Trainingslager bis zum 7. Tag (K11), Teamevent.
- **Sinkt:** −4 je neuem Stammspieler (wie K06 bei der Vertrautheit), −3 je Streit, Grüppchen (5.5).
- **Wirkung:** Teamwerte ×(0,97 + 0,0006 × Zusammenhalt), also −3 % bei 0, ±0 bei 50, +3 % bei 100 (Rohmaterial 4.4).

### 5.7 Beziehungen im Kader

| Entsteht durch | Art |
|---|---|
| gemeinsames Zimmer im Trainingslager (K11), Landsleute mit gemeinsamer Sprache, ähnliches Alter, gemeinsame Saisons | Freundschaft (Stärke wächst mit der Zeit) |
| gleiche Position, ähnliche Stärke, beide ehrgeizig | Rivalität um den Stammplatz |
| Streit, Hitzköpfe, Rangelei im Training (K07) | Rivalität |

| Wirkung | |
|---|---|
| Freunde | Verkauf des Freundes: −8 Stimmung. Freund unzufrieden: Ansteckung (5.5). Nebeneinander auf dem Platz: Teamwert ihres Bereichs +0,5 %. |
| Rivalen | beide lernen 5 % schneller (Konkurrenz belebt). Wer den Platz verliert, verliert doppelt Stimmung. Streit-Risiko bei Hitzköpfen. |
| Landsleute | Integration schneller, Deutsch langsamer (K03 §5.5) |

### 5.8 Kapitän

- Du wählst den Kapitän. Hohe Führung und lange Vereinszugehörigkeit: Mannschaftsstimmung +2.
- **Absetzen:** −10 Stimmung für ihn, −3 für seine Freunde.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Kaderrollen festlegen | klare Erwartungen | wer weniger bekommt als er denkt, wird unzufrieden |
| Einsatzzeit verteilen | zufriedene Spieler | Leistung, Frische |
| Gespräche (K15) | Stimmung, Versprechen | Glaubwürdigkeit, wenn man nicht liefert |
| Kapitän | Stimmung | Absetzen kostet |
| Teamevent | +5 Stimmung für alle, Zusammenhalt +5, nutzt sich ab | Geld (K23), höchstens einmal im Monat sinnvoll |
| Prämien (K21) | Erfolg wird belohnt | Geld |
| Zimmer einteilen (K11) | Freundschaften | Streit bei Rivalen |
| Kader zusammenstellen (K19) | Landsleute, Führungsspieler | Ablöse, Gehalt |
| Geldstrafen erlassen (K09) | Stimmung | Disziplin, Geld |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln. Ihre Spieler haben Stimmung, Rollen und Wechselwünsche. Daraus entstehen Gelegenheiten für dich auf dem Markt (K19): ein unzufriedener Star wird billiger.
- Computer-Trainer verteilen Rollen nach Stärke und spielen ihre Stammspieler, mit Rotation nach Frische.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Gesprächswunsch (Entscheidung) | Stufe 2 | Gespräch (K15) |
| Grüppchenbildung (Entscheidung) | Gruppe im Schnitt unter 35 | Aussprache, Anführer verkaufen, Teamevent |
| Führungsspieler meutert | Führungsspieler unter 25 | Mannschaftsstimmung −5, Gespräch dringend |
| Kabinenparty nach Derbysieg | Derbysieg | Stimmung +5, Zusammenhalt +3, eventuell Partylöwen-Folgekarte |
| Neuzugang drängt auf Einsatz | teurer Neuzugang als Ergänzung | Gespräch, Stimmung |
| Heimweh | aus K03 §8 | Stimmung, Integration |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | Stimmung im Zustandsfaktor, Lernbremse, Eigenschaften (Diva, Führungsspieler, Integrationsfigur, Mentor) |
| K05 Live-Spiel | Ansprache, Zurufe, frühe Auswechslung (Diva) |
| K06 Taktik | Spieler hadert mit Position, Kapitän |
| K08 Jugend | Talente mit Rolle „Talent“, Mentor |
| K11 Trainingslager | Zimmer, Zusammenhalt, Lagerkoller |
| K12a Sommer | Urlaubslänge |
| K15 Gespräche | wichtigster Hebel auf den Baustein „Trainer“, Versprechen |
| K19, K21 | Wechselwunsch, Verträge, Gehaltsgefüge |
| K27, K29 | Fans und Medien im Baustein „Umfeld“ |
| K28 Vorstand | Ruf des Trainers für das Ruf-Gefälle |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Verteilung | 70 % der Spieler zwischen 45 und 80 Stimmung |
| Trägheit | ohne große Ereignisse höchstens ±8 in einer Woche |
| Bankplatz | ein ehrgeiziger Spieler, der sich als Stammspieler sieht und 6 Wochen kaum spielt, erreicht in 60–80 % der Fälle Stufe 2 |
| Leistung | Mannschaftsstimmung kostet oder bringt höchstens 3 Punkte pro Saison (über den Zustandsfaktor) |
| Zusammenhalt | ein Team mit 6 neuen Stammspielern startet bei etwa −2 % und erholt sich in 8–12 Wochen |
| Keine Dauerkrise | über eine Saison im Schnitt höchstens ein offizieller Wechselwunsch (Stufe 3) je Kader |

## 11. Stellschrauben

```js
kabine:{
  rollen:{schluessel:0.85,stamm:0.65,rotation:0.40,ergaenzung:0.15,talent:0.15},rollenWochen:6,
  ziel:{basis:60,einsatz:[-25,10],erfolg:[-10,10],leistung:[-5,5],vertrag:[-15,5],trainer:[-15,10],umfeld:[-10,5]},
  traegheit:0.15,sofortMax:10,diva:2,
  rufGefaelle:{ab:15,lob:0.5,kritik:2,einsatz:1.5},
  folgen:{leistung:{unter:20,minus:0.03,ueber:85,plus:0.02},lernenUnter:30,vertragUnter:[40,25]},
  wechsel:{grummeln:[40,3],gespraech:[35,4],offiziell:4,oeffentlich:4,abloese:0.9,teamMinus:3,zurueckAb:50},
  ansteckung:{fuehrerUnter:35,freunde:-2,fuehrerUeber:70,alle:1},gruppeUnter:35,gruppeZh:-2,
  zusammenhalt:{start:50,stammelf:1,sieg:1,lager:1,neuer:-4,streit:-3,wirkung:[0.97,0.0006]},
  freunde:{verkauf:-8,nebeneinander:0.005},rivalen:{lernen:1.05,platzverlust:2},
  kapitaen:{gut:2,absetzen:-10,absetzenFreunde:-3},teamevent:{stimmung:5,zh:5}
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Kaderrollen** mit fester Erwartung an Einsatzzeit und eigener Einschätzung des Spielers. Das macht Unzufriedenheit nachvollziehbar.
2. **Zusammenhalt** als eigener Teamwert neben der taktischen Vertrautheit (K06): das eine ist Chemie, das andere Taktik.
3. **Stimmung wirkt wenig auf die Leistung** (−3 % bis +2 %), aber stark auf Training, Verträge und Wechselwünsche.
4. **Teamevent** als einfacher Hebel mit Abnutzung.

**Vorläufig entschieden bei der Umsetzung (U8, 9. November 2026):**
5. **Einsatz als absolute Lücke:** (Anteil − Erwartung) × 40, bei zu wenig Einsatz × (0,5 + 0,05 × Ehrgeiz), Spanne −28 bis +10 (Entwurf: −25). Mit der relativen Lücke aus dem Entwurf verlor ein Ergänzungsspieler mit 15 % Erwartung bei null Minuten sofort die vollen −25, und es gab etwa fünf offizielle Wechselwünsche je Kader und Saison. −28 statt −25, damit der Bankplatz-Test (Nr. 10) in 60–80 % der Fälle anschlägt.
6. **Rollen nach der besten Elf ohne Ausfälle** (wie die Aufstellung des Co-Trainers), nicht nach dem Rang der Stärke: Wer in dieser Elf steht, ist Stammspieler, die drei Stärksten davon sind Schlüsselspieler. Je Gruppe kommen halb so viele Rotationsplätze dazu (Torhüter: keine), der Rest ist Ergänzung, bis 21 Jahre Talent. Nach Stärke allein galten Spieler als Stammspieler, die wegen ihrer Feinposition nie aufgestellt werden. Die eigene Einschätzung liegt bei Ehrgeiz ab 15 eine Stufe höher. „Nationalspieler mindestens Stammspieler“ fehlt, bis es Nationalitäten gibt (K32).
7. **Erwartung bei einer Rolle unter der Einschätzung:** die Mitte der beiden Anteile (Rotation, sieht sich als Stammspieler: 52,5 %). Die Rolle unter seiner Einschätzung kostet −4 je Stufe (Diva doppelt) **nur, wenn du die Rolle selbst vergeben hast**, eine höhere Rolle bringt +1 je Stufe (höchstens +2). Sonst zählte der Ehrgeiz doppelt.
8. **Schwellen:** Grummeln unter 45 seit zwei Wochen, Gesprächswunsch unter 40 seit zwei Wochen, offiziell nach vier Wochen auf Stufe 2 und weiter unter 40, öffentlich danach mit 10 % pro Woche (Diva, Söldner 30 %). Entwurf: 40/3, 35/4, „wahrscheinlicher“. Trägheit 20 % pro Woche (Entwurf 15 %), höchstens ±8 einschließlich Ansteckung. Ein offizieller Wechselwunsch zählt je Spieler und Saison einmal.
9. **Bausteine im Einzelnen:** Erfolg = (erwarteter Platz − Platz) / Ligagröße × 25 (höchstens ±7) plus Serie der letzten fünf Spiele gegen die erwarteten Punkte (±3), ab dem dritten Ligaspiel, im Sommer verblasst er um 10 % pro Woche. Leistung = (Form − 10) × 0,5. Vertrag: Gehalt unter 80 % des Gehalts für seine Stärke bis −12, über 115 % bis +3, auslaufender Vertrag eines Stammspielers −3, Söldner × 1,5, **vorläufig höchstens −8**, bis K21 das Gehaltsgefüge baut. Trainer: die Hälfte jeder Gesprächswirkung (verblasst um 10 % pro Woche) plus Rolle. Umfeld: Kapitän (+1 bei Führung ab 14, +2 nach einem Jahr im Verein) und Urlaub (K12a). Integration, Heimweh, Medien und Fans fehlen noch.
10. **Bankplatz-Test auf zwölf Wochen** statt sechs: Mit der Trägheit ist ein Gesprächswunsch nach sechs Wochen nicht erreichbar. Nach gut zwei Monaten auf der Bank wirkt er glaubwürdig.
11. **Ruf-Gefälle** nur bei deinen Spielern: Ruf des Trainers bis K28 = 50 + 0,3 × Ansehen des Vereins + 3 je Trainerjahr (höchstens 95), Ruf des Spielers = Stärke, wirksam ab 15 Punkten Abstand.
12. **Zusammenhalt:** Ein neuer Stammspieler (Neuzugang bei seinem ersten Startelfeinsatz) kostet −5 (Entwurf −4), damit sechs Neue etwa −2 % ergeben. Der Wert zieht jede Woche um 4 % zur Mitte 50 (nicht im Entwurf), sonst hätten erfolgreiche Teams auf Dauer +3 %. „Stammelf unverändert“ heißt: mindestens 9 der 11 aus der letzten Startelf der Vorwoche. Das Trainingslager gibt +1 pro Tag bis zum 7. Tag und ersetzt den Platzhalter Selbstvertrauen aus K11. Rangelei und Streit −3, Grüppchen −2 pro Woche.
13. **Beziehungen:** Freundschaft entsteht je Verein und Woche mit 25 % zwischen zwei Spielern mit höchstens vier Jahren Altersunterschied (höchstens drei Freunde je Spieler) und wird mit jeder gemeinsamen Saison fester (Stärke bis 3, noch ohne Wirkung). Rivalität mit 30 % je Woche bei gleicher Feinposition, höchstens 3 Punkten Abstand und beidseitigem Ehrgeiz ab 13, sie endet bei mehr als 8 Punkten Abstand. Hitzköpfe geraten mit 2 % pro Woche im Training aneinander. Wirkungen: Abschied eines Freundes −8, Rivalen lernen 5 % schneller, wer gegen seinen Rivalen den Platz verliert, verliert das 1,5-Fache beim Einsatz. Landsleute, Sprache und Zimmerbelegung fehlen (Nationalität mit K32), „nebeneinander auf dem Platz +0,5 %“ ist nicht gebaut.
14. **Kapitän:** Du wählst ihn in der Kabine. Sonst wählt der Co-Trainer, wie jeder Computer-Trainer, unter den Stammspielern nach Führung, Vereinsjahren und Stärke. In der Bundesliga ist das je Verein verschieden: Mal bestimmt der Trainer, mal wählt die Mannschaft. Absetzen kostet −10 (Freunde −3), außer in den ersten 14 Tagen nach Spielbeginn oder bei einem neuen Verein.
15. **Folgen:** Leistung wie im Entwurf (über den Zustandsfaktor, im Saisonschnitt praktisch null). Lernen × 0,7 unter 30. Verlängern unter 40 nur 25 % teurer, unter 25 gar nicht. Offizieller Wechselwunsch: Marktwert −10 % für alle, Computer-Vereine setzen den Spieler auf die Transferliste. Öffentlich: −3 für alle Mitspieler.
16. **Computer-Vereine:** Beim Gesprächswunsch gelingt das Gespräch des Trainers zu 55 % (Klugheit „normal“, bis K02 Klugheitsstufen hat), dann Stufe 1 und +5 Stimmung.
17. **Teamevent:** +5 Stimmung, +5 Zusammenhalt, 50.000 € (1. Liga), 25.000 € (2. Liga), 10.000 € (3. Liga), Spielwerte. Abnutzung über vier Wochen wie bei Gesprächen (1; 0,5; 0,2).
18. **Neuanfang beim Vereinswechsel:** Wechselwunsch auf null, Stimmung mindestens so hoch wie ein Startwert (60–75).
19. **Diva und Söldner** sind jetzt sichtbar und wirksam (K03 §3.5).
20. **Lernstufen (K36):** Stimmung, Wechselwunsch und Kabinenbericht ab Teamleiter (nur Information), Kapitän ab der C-Lizenz, Kaderrollen und Teamevent ab der B-Lizenz. Bis dahin wählt der Co-Trainer Kapitän und Rollen.
21. **Noch nicht gebaut:** Ereignisse aus §8 außer dem Gesprächswunsch (Kabinenparty, Führungsspieler meutert, Neuzugang drängt auf Einsatz, Heimweh), Geldstrafen erlassen (K09), Prämien (K21), Integration und Heimweh, Integrationsfigur und Mentor, Wochen-Stammelf für Computer-Vereine mit Rotation nach Rollen.

### Bankzeit nach Grund (mit dir entschieden am 10. November 2026, noch nicht gebaut)

Vorgemerkt als U8d. Bis dahin gilt die Einsatz-Lücke aus Nr. 5. Deine Fälle sind gesetzt, die übrigen Fälle, Zahlen und der Aufbau sind meine Vorschläge (vorläufig).

**Grundsätze**

1. **Der Grund zählt, nicht nur die Minuten.** Ein Spieler fragt sich, ob er geschätzt wird. Dieselben 20 Minuten sind für einen Stammspieler eine Abwertung und für ein Talent ein Geschenk.
2. **Kurzfristig verständnisvoll, auf Dauer zählt die Summe.** Ein einzelnes Spiel auf der Bank kostet fast nie etwas. Eine Serie hinter demselben Konkurrenten kostet immer mehr.
3. **Der Typ entscheidet über die Richtung:** Vorbildprofis und Mentoren nehmen es hin, Kämpfer beißen sich rein, Diven sind gekränkt, Nervenschwache verunsichert (Selbstvertrauen), Söldner rechnen in Prämien (K21), Ehrgeizige fordern.
4. **Leistung schafft Anspruch.** Wer als Joker liefert, ist erst zufrieden. Liefert er immer wieder und startet trotzdem nie, wächst der Frust („Ich liefere doch!“).
5. **Erklären hilft.** Eine angekündigte Rotation oder eine erklärte Rolle kostet weniger als ein stiller Bankplatz (K15).
6. **Erfolg macht genügsam.** In einer Siegesserie wird die Bank eher akzeptiert, in der Krise fragt jeder: „Warum nicht ich?“

**Fälle**

| Fall | Woran das Spiel es erkennt | Wirkung | Typ |
|---|---|---|---|
| **Rotation, Schonung** (deiner) | stünde in der besten Elf ohne Ausfälle, sitzt aber mit Frische unter 85 %, in einer englischen Woche oder nach einer Länderspielreise | keine Abwertung, das Spiel zählt nicht für die Einsatzzeit. Angekündigt sogar +1 („wir brauchen dich frisch“) | – |
| **Joker mit Wirkung** (deiner) | eingewechselt, Tor, Vorlage (sobald es sie gibt) oder Note bis 2,5 | sofort +3, das Spiel zählt als erfüllt | Ehrgeizige: nach drei starken Kurzeinsätzen in fünf Spielen steigt die Einschätzung um eine Stufe |
| **Rivale spielt** (deiner) | sein Rivale (gleiche Feinposition, höchstens 3 Punkte Abstand) steht in der Startelf, er nicht | Rivalen-Zähler: die ersten drei Spiele je nach Typ, danach −1, −2, −3 … bis −10 im Baustein „Einsatz“, bis er wieder spielt | Kämpfer, Entschlossene: erst Schub (Lernen ×1,1), Diven und Nervenschwache: sofort negativ |
| **Unerfahrene** (deiner) | Talent oder Ergänzung mit weniger als 10 Pflichtspielen für Profis | keine Erwartung an Einsatzzeit. Spieltagskader +1, Einsatz ab 10 Minuten +3, Debüt +5 (Prägung in K08) | – |
| **Ersatztorwart** (deiner) | Nummer 2 im Tor | keine Erwartung an Einsatzzeit | – |
| **Torwart-Duell** (deiner) | Nummer 2 höchstens 2 Punkte hinter der Nummer 1 oder davor | beide −1 pro Woche, bis die Rangfolge geklärt ist (Rolle von dir vergeben oder fünf Spiele in Folge derselbe) | Diven doppelt |
| **Pokaltorwart, Pokalelf** | du gibst ihm die Rolle „spielt im Pokal“ (neue Kaderrolle) | Erwartung erfüllt, wenn er alle Pokalspiele spielt | – |
| **Aufbau nach Verletzung** | die ersten drei Wochen nach der Rückkehr | keine Erwartung, er weiß, dass er Zeit braucht | – |
| **Platz verloren während der Verletzung** | sein Ersatz hatte in der Zeit einen Notenschnitt bis 3,0 und spielt weiter | wird nach dem Aufbau zum Rivalen-Fall | Diven sofort |
| **Nach einer Sperre** | Bank im ersten Spiel nach der Sperre | kein Anspruch, er hat es selbst verschuldet | Hitzköpfe trotzig: −1 |
| **Formkrise** | Notenschnitt der letzten fünf Einsätze ab 4,0 | Abwertung nur halb, er sieht es ein | Nervenschwache: Entlastung, Selbstvertrauen erholt sich schneller. Diven: voll |
| **Passt nicht ins System** | deine Ordnung hat keinen Platz für seine Position | Abwertung voll, mit Gespräch „Position erklären“ (K15, kommt mit diesem Fall) halb, Umschulung (K07) als Ausweg | – |
| **Teurer Neuzugang** | Ablöse oder Gehalt im oberen Viertel des Kaders, weniger als ein Jahr im Verein | Abwertung ×1,5, die Presse fragt nach (K29) | – |
| **Kapitän, Führungsspieler, Altstar auf der Bank** | Kapitän oder Führungsspieler, oder ab 31 Jahren mit vielen Einsätzen | er selbst wie üblich, dazu −1 für seine Freunde. Ein Altstar mit der Rolle „Ergänzung“ und Gespräch nimmt es hin | Mentoren: kein Abzug, wenn er Talente betreut (K08) |
| **Vertragsjahr** | Vertrag läuft zum Saisonende aus | Abwertung ×1,5, er will sich zeigen. Hat er woanders unterschrieben, erwartet er nichts mehr | Söldner ×2 |
| **Tribüne statt Bank** | gesund, aber nicht im Spieltagskader | für Etablierte (Rolle ab Rotation) −2 je Spiel, für Unerfahrene normal | Diven doppelt |
| **Früh ausgewechselt** | vor der 46. Minute ohne Verletzung oder Platzverweis | Bloßstellung −3 | Diven und Führungsspieler doppelt, Nervenschwache Selbstvertrauen −0,5 |
| **Einwechslung in der Nachspielzeit** | nach der 88. Minute | für Etablierte −1 (Zeitspiel-Wechsel), für Unerfahrene +1 | – |
| **Spielpraxis fehlt** | jung, sechs Wochen unter 10 % Einsatz | statt Wechselwunsch der Wunsch nach einer Leihe (K08, K19) | – |
| **Bedeutungslose Spiele** | Saisonziel sicher erreicht oder verfehlt, letzte fünf Spieltage | Reservisten und Talente erwarten Chancen: wer sie bekommt +2, wer nicht −2 | – |
| **Mannschaftserfolg** | Serie der letzten fünf Spiele (wie im Baustein „Erfolg“) | Siegesserie: Abwertung halb, Krise: ×1,5 | – |
| **Chance genutzt** | er vertritt einen verletzten oder gesperrten Stammspieler mit Notenschnitt bis 3,0 | Einschätzung steigt eine Stufe, kehrt der andere zurück, entsteht ein Rivalen-Fall | – |
| **Neuer Trainer** | du übernimmst einen Verein | vier Wochen Neubeginn: Reservisten hoffen (+2), keine Abwertung für niemanden | – |
| **Wechselwunsch und Bank** | offizieller Wechselwunsch (Stufe 3) | Bank versteht er, kein weiterer Abzug, die Kabine auch | – |
| **Länderspiele** (später, K13) | Nationalspieler vor einem Turnier | Abwertung ×1,5, er fürchtet um seine Nominierung | – |

**Stufen beim Bau:** U8d bringt Rotation, Joker, Rivale, Unerfahrene, Torwart, Aufbau nach Verletzung, Formkrise, Tribüne, frühe Auswechslung, Nachspielzeit, Mannschaftserfolg und Chance genutzt. Die übrigen Fälle kommen mit ihren Konzepten: System (K06, Gespräch „Position erklären“), teurer Neuzugang und Vertragsjahr (K19, K21), Altstar und Mentor (K08), Leihwunsch (K08, K19), Neuer Trainer (K28), Länderspiele (K13, K32). „Rotation ankündigen“ kommt als vierte Mannschaftsansprache dazu (K15 §5.4).

**Neue Daten:** Spieltagskader je Pflichtspiel (die Bank gibt es in der Engine schon), Grund des Bankplatzes je Spiel, Rivalen-Zähler, Profi-Pflichtspiele über die Karriere (heute zählt `apps` nur die Saison), die letzten fünf Noten, starke Kurzeinsätze, Kaderrolle „Pokal“.

**Tests (für U8d):** Ein Stammspieler, der wegen Frische rotiert, verliert keine Stimmung. Ein Joker mit Tor ist nach dem Spiel zufriedener als vorher. Ein Talent mit 10 Minuten gewinnt Stimmung. Die Nummer 2 im Tor bleibt eine Saison ohne Einsatz zufrieden, ein gleich starker Ersatztorwart sorgt für Reibereien. Wer zehn Spiele hinter seinem Rivalen sitzt, erreicht den Gesprächswunsch. Ein Kämpfer bleibt in den ersten drei Spielen hinter dem Rivalen stabil, eine Diva nicht. Über eine Saison bleibt es bei höchstens einem offiziellen Wechselwunsch je Kader.


## Quellen

- Stimmung, Folgen, Kabine, Gespräche: `konzepte/_rohmaterial-logik-v1.md`, Kapitel 9
- Ruf des Trainers, Trägheit, Kabinendynamik: `konzepte/_recherche-genre.md`, Abschnitte 3.1 und 4
- Freundschaften, Rivalität, Landsleute, Zimmer: PLAN §4 (GameStar 4/2000)
- Kapitän je Verein vom Trainer bestimmt oder von der Mannschaft gewählt: [Sky: Die Anführer der Klubs](https://sport.sky.de/fussball/artikel/bundesliga-noch-acht-kapitaene-gesucht-die-anfuehrer-der-klubs/11760992/33895), [bundesliga.com: Kapitäne 2025/26](https://www.bundesliga.com/de/bundesliga/news/kapitane-bundesliga-saison-2025-26-33526) (U8, Zusammenfassungen der Suchergebnisse)
