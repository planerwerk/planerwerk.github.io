# K36 – Einstieg mit Lernstufen

Status: **Entwurf** (9. November 2026), geschrieben ohne Rücksprache auf Grundlage deiner Entscheidungen vom 9.11. Vorläufige Entscheidungen stehen in Abschnitt 12. **Umgesetzt in UL** (12. November 2026, `js/lizenz.js`, Tests `tests/lizenz.js` und `tests/ui-lernstufen.js`), freigegeben am 11.11. abends („nichts auslassen“). Die vorläufigen Entscheidungen bleiben vorläufig, bis du widersprichst. Abweichungen vom Entwurf stehen in Abschnitt 12 ab Nr. 14.
Hängt ab von: K16 (Stab und Automatik), K02 (gleiche Regeln, Schwierigkeit), K35a (Bedienkonzept) · Wird gebraucht von: allen Bereichen mit eigener Entscheidung (K05–K07, K09–K16, K19, K21, K23–K29).

## 1. Ziel und Spielgefühl

- **Die erste Saison soll sich leicht anfühlen, ohne dumm zu sein.** Du stellst auf, wählst die Ordnung und schaust dein Spiel. Um Training, Sportgericht, Verträge und Stadion kümmert sich der Stab. Die Simulation läuft trotzdem vollständig.
- **Wer etwas verstanden hat, bekommt mehr.** Neue Möglichkeiten kommen, wenn du die alten benutzt hast, nicht nur, weil Zeit vergangen ist.
- **Man lernt durch Zuschauen.** Gesperrte Bereiche sind sichtbar. Du siehst, was der Stab dort tut. Wenn der Bereich frei wird, kennst du ihn schon.
- **Niemand wird gebremst.** Wer das Genre kennt, überspringt Stufen oder schaltet die Lernstufen ganz ab, jederzeit.
- **Das Gefühl einer Trainerlaufbahn:** Die Stufen heißen wie die Trainerlizenzen, von Teamleiter bis Pro-Lizenz (deine Entscheidung vom 9.11.). Die Lizenz gehört dir, nicht dem Verein.

## 2. Vorbilder und Abgrenzung

- **Schrittweise Offenlegung** (progressive disclosure) ist ein bekanntes Muster der Bedienung: Selten gebrauchte oder schwierige Funktionen kommen später oder an zweiter Stelle, damit ein Programm leichter zu lernen ist (Jakob Nielsen, 1995 und 2006). Wir übertragen das auf die Spielzeit.
- **Football Manager Touch** ist eine eigene, schlankere Ausgabe des Football Manager mit vereinfachtem Training und weniger Funktionen. Sie wird vor dem Spielen gewählt und bleibt so. **Bewusst anders:** Bei uns wächst das Spiel innerhalb einer Karriere, es gibt keine zweite Ausgabe.
- **Delegieren an den Stab** gibt es im Genre schon lange. Bei uns ist es die Grundlage der Lernstufen (PLAN §2: Automatik und Delegieren in jedem Bereich über den Stab).
- **DFB-Lizenzen als Namen:** Die echte Leiter steigt von der C-Lizenz (Breitensport) über B und A zur Pro-Lizenz. Die Pro-Lizenz hieß bis 2021 Fußball-Lehrer und ist Pflicht für Cheftrainer in der 1. bis 3. Liga. Die A-Lizenz reicht für die Regionalliga. „Teamleiter“ ist keine DFB-Lizenz, sondern der Name einzelner Lehrgänge in Landesverbänden (zum Beispiel beim Fußballverband Rheinland). Der Einstieg in das DFB-System ist heute der Basis-Coach als Teil der C-Lizenz. Im Spiel ist das nur ein Name, die Lizenz hat keine Wirkung auf Jobangebote (12, Nr. 9).
- **Bewusst anders als ein Tutorial:** keine Pflichtaufgaben, keine Texttafeln am Stück. Ein kurzer Aufstiegsmoment sagt, was neu ist, der Rest steht dort, wo die Funktion steht.

## 3. Begriffe und Daten

| Begriff | Bedeutung | Ort |
|---|---|---|
| **Lizenz** | deine Lernstufe 1–5: Teamleiter, C-Lizenz, B-Lizenz, A-Lizenz, Pro-Lizenz | `S.lizenz.stufe` |
| Lernstufen an | ob die Stufen gelten. Aus heißt: alles frei | `S.lizenz.an` |
| Bereich | eine Funktion mit eigener Entscheidung, zum Beispiel `stil` oder `sportgericht` | `REGELN.lizenz.frei` |
| frei | ein Bereich ist frei, wenn die Lernstufen aus sind oder deine Lizenz mindestens seine Stufe hat | `frei(bereich)` |
| Pflichtspiele seit Aufstieg | Zähler für die Mindestzeit | `S.lizenz.spiele` |
| Aufgaben | was du schon selbst gemacht hast, je Stufe | `S.lizenz.aufgaben` |
| Verlauf | wann du welche Lizenz bekommen hast und wie (Nutzung, Zeit, übersprungen) | `S.lizenz.verlauf` |
| Automatik je Bereich | ob ein freier Bereich noch vom Stab erledigt wird | `S.lizenz.auto` (K16 §3.3) |

**Wichtig für die Wörter:** Die Lernstufen heißen im Spiel immer „Lizenz“. Das Wort „Stufe“ ist schon belegt (Schwierigkeit in K02, Wechselwunsch in K14), im Code gibt es bereits `stufe()` für die Schwierigkeit.

## 4. Abläufe

1. **Spielstart:** Du wählst „Mit Lernstufen (empfohlen für den Einstieg)“ oder „Alles frei“. Voreinstellung: mit Lernstufen. Du beginnst als Teamleiter.
2. **Während der Saison** zählt das Spiel nach jedem Pflichtspiel deines Vereins mit. Es merkt sich, welche Aufgaben du erledigt hast (5.3). Sind Mindestzeit und Aufgaben erfüllt oder ist die späteste Zeit erreicht, steigst du auf.
3. **Aufstiegsmoment:** Am nächsten Halt erscheint eine Karte (8). Nie mitten im Live-Spiel, nie an einem Spieltag vor dem Anpfiff.
4. **Neu freie Bereiche bleiben zuerst in der Automatik.** Der Co-Trainer macht weiter wie bisher, bis du selbst etwas änderst oder auf „Selbst machen“ stellst. So kommt nach dem Aufstieg keine Arbeit über Nacht.
5. **Überspringen:** In der Lizenz-Ansicht (Menü und Büro) steht „Nächste Lizenz jetzt holen“. Das gilt sofort.
6. **Abschalten:** „Lernstufen abschalten“ im Menü macht sofort alles frei. Wieder einschalten geht nur bei einem neuen Spiel, weil es Möglichkeiten wegnehmen würde.
7. **Vereinswechsel und Entlassung:** Die Lizenz bleibt dir. Zähler und Aufgaben laufen weiter.

### 4.1 Beispiel: zwei Laufbahnen

| | neugierig (nutzt, was frei ist) | gemütlich (spielt nur die Spiele) |
|---|---|---|
| Teamleiter | 1. Juli, erste Saison | 1. Juli, erste Saison |
| C-Lizenz | nach 4 Pflichtspielen, etwa Mitte September | nach 12 Pflichtspielen, etwa Anfang November |
| B-Lizenz | 10 Pflichtspiele später, etwa Dezember | am 1. Juli nach der ersten Saison |
| A-Lizenz | frühestens in der zweiten Saison, nach 10 Pflichtspielen, etwa Oktober | am 1. Januar der zweiten Saison |
| Pro-Lizenz | frühestens am 1. Juli nach der zweiten Saison | am 1. Januar der dritten Saison |

In der ersten Saison erreicht man also zwei oder drei Lizenzen, frei ist alles nach zwei bis zweieinhalb Saisons. Das entspricht deiner Entscheidung „2–3 Stufen in Saison 1, alles frei nach 2–3 Saisons“.

## 5. Regeln und Formeln

### 5.1 Grundsätze

1. **Gesperrt heißt automatisch, nicht abgeschaltet.** Was du nicht steuerst, erledigt der Stab nach denselben Regeln wie bei den Computer-Vereinen (K31, K16). Die Simulation ist mit und ohne Lernstufen gleich, es wächst nur, was du selbst entscheidest. Damit gibt es kein zweites Regelwerk und keinen Nachteil gegenüber den Computer-Vereinen.
2. **Gesperrte Bereiche sind sichtbar.** Sie zeigen den aktuellen Stand und eine Zeile wie „Macht der Co-Trainer · frei ab B-Lizenz“. Reiter verschwinden nicht.
3. **Keine Halte aus gesperrten Bereichen.** Im Posteingang steht nur eine Zeile, zum Beispiel „Der Verein hat die Strafe angenommen (2 Spiele Sperre für Müller)“. Erinnerungen vor „Tag beenden“ (K01) zu gesperrten Bereichen erscheinen nicht.
4. **Zuerst einfach, dann ausführlicher.** Ein Bereich kann in zwei Schritten frei werden, zum Beispiel die Ausrichtung mit drei Stufen als Teamleiter und mit fünf Stufen ab der B-Lizenz.
5. **Informationen sind immer frei.** Kader, Werte, Verletzungen, Sperren, Tabellen, Finanzen und Termine sieht man von Anfang an. Gesperrt werden nur Entscheidungen.
6. **Lernstufen ändern nichts an der Schwierigkeit** (K02). Die Schwierigkeit regelt, wie hart die Welt ist, die Lizenz regelt, was du selbst entscheidest.

### 5.2 Was auf welcher Lizenz frei ist

Grundlage sind die Notizen in K10 §12 Nr. 14, K11 §12 Nr. 12, K13 §12 Nr. 13 und die grobe Leiter in PLAN §4. K09 hatte noch keine Notiz, dort gilt die Leiter aus PLAN §4 (Sportgericht auf Stufe 4), die Notiz ist jetzt in K09 §12 Nr. 15 nachgetragen.

**Immer frei, ohne Lizenz:** Büro und Posteingang, Kalender, „Tag beenden“, Tabelle, Spielplan, Pokal-Ansicht, Kader und Spielerkarten (nur ansehen, mit Nationalität), Transfermarkt mit dem Filter Ausland (nur ansehen, U9b), Finanzen und Stadion (nur ansehen), Menü mit Speichern, Laden, Erinnerungen, Einstellungen des Live-Spiels, Jobangebote nach einer Entlassung.

| Bereich (Schlüssel) | Funktion | Lizenz | Bis dahin macht es | Quelle |
|---|---|---|---|---|
| `aufstellung` | Startelf setzen, beste Elf aufstellen, seit U8d einen Spieler auf die Tribüne setzen | 1 Teamleiter | – (auf Wunsch stellt der Co-Trainer auf, 12 Nr. 15) | PLAN §4 |
| `formation` | Grundordnung wählen, auch im Live-Spiel | 1 Teamleiter | – (auf Wunsch wählt der Co-Trainer, 12 Nr. 15) | PLAN §4 |
| `ausrichtung3` | Ausrichtung defensiv, normal, offensiv, auch im Live-Spiel | 1 Teamleiter | – | PLAN §4 |
| `live` | Spiel live ansehen, Konferenz, sofort berechnen, vorspulen | 1 Teamleiter | – | K05 |
| `wechsel` | Wechsel im Live-Spiel | 1 Teamleiter | Computer-Trainer, wenn du nicht wechselst (wie bisher) | K05 |
| `verletzte` | Verletztenliste, Diagnose als Spanne (Information) | 1 Teamleiter | – | K10 Nr. 14 |
| `pokal` | Pokal, Relegation, Supercup, Auslosung als Moment | 1 Teamleiter | – | K13 Nr. 13 |
| `stimmung` | Stimmung, Wechselwunsch und Glaubwürdigkeit sehen, Wochenbericht (U8), seit U8d der Grund des letzten Bankplatzes | 1 Teamleiter | – | K14, K15 |
| `stil` | Spielstil wählen, auch im Live-Spiel, Gegneranalyse | 2 C-Lizenz | Co-Trainer nach `kiStil` | PLAN §4, K06 |
| `zurufe` | Zurufe an die Mannschaft und Halbzeitansprache | 2 C-Lizenz | keine Ansprache (neutral) | PLAN §4, K05 |
| `vorlage` | Trainingsvorlage wählen | 2 C-Lizenz | Co-Trainer nach `vorlageAuto` | PLAN §4, K07 |
| `transfers` | Transferliste, Angebote annehmen und ablehnen (seit U9b auch von Auslandsvereinen), Spieler kaufen | 2 C-Lizenz | Verein nach den Regeln der Computer-Vereine (`market`) | PLAN §4, K19 |
| `gespraeche` | Einzelgespräche ohne Versprechen, Gesprächswunsch als Halt (U8) | 2 C-Lizenz | Co-Trainer führt das Gespräch nach der Regel der Computer-Vereine (K15 §7) | K15 |
| `ansprache` | Mannschaftsansprache außerhalb des Spiels (U8), seit U8d auch „Rotation ankündigen“ | 2 C-Lizenz | keine Ansprache | K15 §5.4 |
| `kapitaen` | Kapitän bestimmen (U8) | 2 C-Lizenz | Co-Trainer wählt nach Führung und Vereinsjahren | K14 §5.8 |
| `ausrichtung5` | Ausrichtung in fünf Stufen | 3 B-Lizenz | nur drei Stufen wählbar | PLAN §4 |
| `einstellung` | Einstellung zum nächsten Spiel, Härte im Zweikampf | 3 B-Lizenz | Co-Trainer wie bei den Computer-Vereinen: in wichtigen Spielen „Spiel der Saison“, sonst normal, Härte normal (12 Nr. 16) | PLAN §4, K06 |
| `rollen` | Rollen am Platz | 3 B-Lizenz | Co-Trainer nach `slotsVerein` | PLAN §4, K06 |
| `schuetzen` | Standardschützen, Reihenfolge im Elfmeterschießen, Zurufe an einzelne Spieler | 3 B-Lizenz | Co-Trainer nach Merkmalen und Stärke | PLAN §4, K05, K06 |
| `beobachten` | Spieler von einem Scout beobachten lassen (U9a) | 2 C-Lizenz | kein Auftrag, nur Grundkenntnis | K18 |
| `lernziel` | Lernziele und Einzeltraining | 3 B-Lizenz | Co-Trainer vergibt die Lernplätze (`lernAutomatik`) | PLAN §4, K07 |
| `umschulung` | Umschulung auf eine neue Position | 3 B-Lizenz | keine Umschulung | PLAN §4, K07 |
| `sommer` | Urlaubslänge und Trainingsauftakt | 3 B-Lizenz | übliche Urlaubslänge und üblicher Auftakt wie bei den Computer-Vereinen (12 Nr. 16) | PLAN §4, K12a |
| `testspiele` | Testspiele anfragen | 3 B-Lizenz | Co-Trainer plant zwei Testspiele gegen Amateure je Vorbereitung | K11 Nr. 12 |
| `lager` | Trainingslager buchen | 3 B-Lizenz | kein Lager (wie die Computer-Vereine heute) | K11 Nr. 12 |
| `stab` | Mitarbeiter einstellen, verlängern, entlassen | 3 B-Lizenz | Verein besetzt fehlende Rollen und verlängert wie die Computer-Vereine (`stabSaison`) | PLAN §4, K16 |
| `vertraege` | Verträge verlängern, Spieler freistellen | 3 B-Lizenz | Verein verlängert nach den Regeln der Computer-Vereine | PLAN §4, K21 |
| `ausland` | Spieler im Ausland beobachten und kaufen (U9b) | 3 B-Lizenz | Verein kauft nur im Inland (wie die Computer-Vereine bis U11), der Auslandsmarkt ist als Information frei | K32 §6, K18 |
| `jugend` | Stufe der Jugendarbeit (setzt seit U9c das Ziel für das Jugendniveau) | 3 B-Lizenz | Verein hält die übliche Stufe 2 wie die Computer-Vereine | K08, 12 Nr. 15 |
| `jugendkader` | Aufrücken aus der Jugend und Verkauf aus der Jugend (U9c). Den Jugendkader ansehen ist immer frei | 3 B-Lizenz | Verein holt jeden Sommer die zwei Besten ab 17 in den Profikader | K08 §12 Nr. 9 |
| `pate` | Einem Talent einen Mentor als Paten geben (U9c) | 4 A-Lizenz | kein Pate | K08 §5.2 |
| `praemien` | Prämien und Klauseln in Vertragsangeboten (U10b) | 4 A-Lizenz | keine Prämien und Klauseln | K21 §12 Nr. 9, 19 |
| `berater` | Berater einladen (U10c). Kontakte ansehen ist immer frei | 3 B-Lizenz | keine Einladungen | K22 §12 Nr. 17 |
| `leihe` | Spieler verleihen, ausleihen und zurückholen (U10d). Profis in die Zweite hängt an `zweitekader` | 3 B-Lizenz | keine Leihen | K08 §5.5 |
| `zweite` | Stufe des Budgets der zweiten Mannschaft (U9d) | 3 B-Lizenz | Verein hält die Startstufe nach Ansehen (ab 80 Stufe 4, sonst 3) | K08 §5.6, §12 Nr. 23 |
| `zweitekader` | Jugendspieler in die Zweite schicken, aus der Zweiten aufrücken lassen, aus der Zweiten verkaufen (U9d). Die Zweite ansehen ist immer frei | 3 B-Lizenz | Verein schickt brauchbare 19-Jährige in die Zweite und holt je Sommer höchstens einen hoch, der fast so gut ist wie die Profis | K08 §5.6, §12 Nr. 31 |
| `kaderrollen` | Kaderrollen festlegen (U8), seit U8d auch die Rolle „spielt im Pokal“ | 3 B-Lizenz | Co-Trainer verteilt die Rollen nach Stärke (K14 §7) | K14 §3.1 |
| `versprechen` | Zusagen im Gespräch, Teamevent (U8) | 3 B-Lizenz | keine Zusagen, kein Teamevent | K15 §5.3, K14 §6 |
| `suchauftrag` | Suchauftrag für Scouts (U9a), auch mit der Region Ausland (U9b) | 4 A-Lizenz | kein Suchauftrag | K18 |
| `sportgericht` | Strafe annehmen oder Einspruch | 4 A-Lizenz | Verein nach `kiEinspruch` | PLAN §4, K09 |
| `medizin` | fit spritzen, früher zurückholen | 4 A-Lizenz | Arzt nach `kiSpritzen` | K10 Nr. 14 |
| `sponsor` | Werbeverträge wählen (Trikotbrust, seit K24a auch Ausrüster und Ärmel) | 4 A-Lizenz | Verein nimmt je Fläche das Angebot mit dem höchsten Grundbetrag | PLAN §4, K24 |
| `preise` | Eintrittspreis | 4 A-Lizenz | Richtpreis nach Liga und Ansehen (`richtPreis`) | K27 |
| `stadion` | Ausbau von Tribüne, Logen, Fanshop, seit K26a auch der Anlagen (Nr. 54) | 5 Pro-Lizenz | kein Ausbau (wie die Computer-Vereine heute) | PLAN §4 (dort Stufe 4), 12 Nr. 4 |
| `kredit` | Kredit aufnehmen und tilgen | 5 Pro-Lizenz | kein Kredit, Tilgung aus Überschüssen am Saisonende | K23, 12 Nr. 4 |

**Später dazu, wenn es die Funktion gibt** (Vorschlag, wird im jeweiligen Umsetzungsschritt festgelegt): Spielverlegung beantragen (4, K13 Nr. 13), Scouting im Detail (4, K18), Jugend und Nachwuchsleistungszentrum (3, K08), Prämien in Verträgen (4, K21), Marketing (4, K25), Presse und Pressekonferenzen (5, K29), Beziehungen (5, K17), Entscheidungen aus Ereigniskarten (5, K30; bis dahin wählt der Stab die vorsichtige Antwort), Abwerben und Berater (5, K20, K22).

**Pro gibt es heute nur zwei Bereiche.** Das ist gewollt: Die Pro-Lizenz ist die Stufe für die Gesamtverantwortung. Mit Welle 4 kommen Presse, Beziehungen und Ereigniskarten dazu.

### 5.3 Aufstieg

Ein Aufstieg braucht **Mindestzeit und Aufgaben** oder die **späteste Zeit**. Gezählt werden die Pflichtspiele deines Vereins (Liga, Pokal, Relegation, Supercup) seit dem letzten Aufstieg. Eine Aufgabe zählt, sobald du sie einmal selbst erledigt hast, auch vor der Mindestzeit.

| Nach | Mindestzeit | Aufgaben (davon nötig) | spätestens |
|---|---|---|---|
| C-Lizenz | 4 Pflichtspiele | Startelf selbst geändert · ein Pflichtspiel live bis zum Abpfiff verfolgt · im Live-Spiel gewechselt · Ordnung oder Ausrichtung geändert (3 von 4) | nach 12 Pflichtspielen |
| B-Lizenz | 10 Pflichtspiele | Spielstil gewählt · Trainingsvorlage selbst gesetzt · Zuruf oder Halbzeitansprache · Einzelgespräch geführt oder Transferangebot abgegeben (3 von 4) | 1. Juli nach der ersten Saison |
| A-Lizenz | 10 Pflichtspiele und frühestens in der zweiten Saison | Rolle oder Schütze festgelegt · Lernziel oder Umschulung · Testspiel, Trainingslager oder Urlaubslänge selbst gewählt · Vertrag verlängert oder Mitarbeiter eingestellt · Kaderrolle oder Versprechen (3 von 5) | 1. Januar der zweiten Saison |
| Pro-Lizenz | 12 Pflichtspiele und frühestens am 1. Juli nach der zweiten Saison | Sportgerichtsverfahren selbst entschieden · fit gespritzt oder früher zurückgeholt · Sponsor oder Eintrittspreis selbst gewählt (2 von 3) | 1. Januar der dritten Saison |

- **Warum Aufgaben:** Wer eine Funktion einmal benutzt hat, hat sie gefunden. Mehr wollen wir nicht prüfen. Ob die Entscheidung gut war, spielt keine Rolle.
- **Warum eine späteste Zeit:** Niemand soll hängen bleiben. Wer nur die Spiele spielt, hat zumindest gesehen, was der Stab tut (Grundsatz 2).
- **Warum A und Pro an Saisons gebunden sind:** Sonst könnte ein neugieriger Spieler in der ersten Saison vier Lizenzen holen. Du hast 2–3 in der ersten Saison festgelegt.
- **Aufgaben für Bereiche ohne Gelegenheit:** Gab es seit dem Aufstieg kein Sportgerichtsverfahren und keinen Verletzten am Spieltag, zählt die Aufgabe als erledigt, sobald die Mindestzeit erreicht ist. Wer keine Gelegenheit hatte, soll nicht warten.
- **Nach einem Abstieg oder einer Entlassung** läuft alles weiter wie bisher. Die Lizenz sinkt nie.

### 5.4 Wie gut die Automatik entscheidet

- Die Automatik nutzt die Regeln der Computer-Vereine mit der Klugheit „normal“ (K02). Sobald K16 §5.1 gebaut ist (Rauschen nach Qualität des Mitarbeiters), hängt sie an der Qualität deines Stabs, genau wie bei den Computer-Vereinen.
- Ziel: Die Automatik holt im Schnitt so viele Punkte wie ein Computer-Verein mit gleichem Kader (10). Wer selbst entscheidet, kann besser oder schlechter sein.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Mit Lernstufen spielen | ruhiger Einstieg, man sieht dem Stab zu | weniger Einfluss in der ersten Saison |
| Funktionen ausprobieren | schnellerer Aufstieg | keiner |
| Nächste Lizenz sofort holen | mehr Einfluss | mehr auf einmal zu lernen |
| Lernstufen abschalten | alles frei | wieder einschalten nur mit neuem Spiel |
| Freien Bereich in der Automatik lassen | weniger Arbeit | Ergebnis so gut wie der Stab |

## 7. Verhalten der Computer-Vereine

- Computer-Vereine haben keine Lizenz. Ihre Regeln sind dieselben, mit denen der Stab deine gesperrten Bereiche erledigt. Das ist der Kern des Konzepts: Wer die Lernstufen nutzt, spielt gegen die gleiche Welt.
- Wo es für einen Bereich noch keine Regel der Computer-Vereine gibt, kommt sie mit UL dazu und gilt dann für alle. Das betrifft heute: Testspiele (zwei gegen Amateure je Vorbereitung, K11 Nr. 11 und Konsistenzprüfung AQ3), Verträge der eigenen Spieler und Kredit.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| **Neue Lizenz** (Halt) | Aufstieg | Karte mit drei Teilen: was neu ist (Liste der Bereiche mit Ort, ein Klick führt hin), was der Stab bisher getan hat (zum Beispiel „Der Co-Trainer hat zuletzt die Vorlage Standard gewählt, im Schnitt Intensität mittel“), dazu auf Wunsch eine kleine Aufgabe für die nächste Lizenz. Knöpfe „Ansehen“ und „Später“. |
| Stab hat entschieden (nur Posteingang) | Entscheidung in einem gesperrten Bereich | eine Zeile, kein Halt, gesammelt im Wochenbericht, wenn es mehrere sind |
| Lizenz-Rückblick (nur Posteingang) | Saisonende | welche Lizenz, wie viele Aufgaben noch offen, wann die späteste Zeit erreicht ist |

Der Aufstieg zählt nicht in das Budget von 2–4 Halten pro Woche (PLAN §2), weil er nur viermal in einer Laufbahn kommt.

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K01 Kalender | Aufstiegskarte als Halt, keine Erinnerungen aus gesperrten Bereichen |
| K02 Schwierigkeit | getrennt von den Lernstufen, gleiche Regeln für alle |
| K05 Live-Spiel | Wechsel ab Teamleiter, Zurufe und Halbzeitansprache ab C, Zurufe an einzelne Spieler und Elfmeter-Reihenfolge ab B |
| K06 Taktik | Ordnung und drei Ausrichtungen ab Teamleiter, Stil ab C, Rollen, Schützen, Einstellung und fünf Ausrichtungen ab B |
| K07 Training | Vorlage ab C, Lernziele und Umschulung ab B |
| K09 Sportgericht | ab A, davor Verein nach `kiEinspruch` |
| K10 Medizin | Information ab Teamleiter, fit spritzen und früher zurückholen ab A |
| K11, K12a | Sommer, Testspiele und Lager ab B |
| K13 Wettbewerbe | ab Teamleiter, Spielverlegung später ab A |
| K14, K15 | Stimmung sehen ab Teamleiter, Gespräche, Ansprache und Kapitän ab C, Kaderrollen, Versprechen und Teamevent ab B |
| K16 Stab | liefert die Automatik, Mitarbeiter selbst wählen ab B |
| K19, K21 | Transfers ab C, Verträge ab B |
| K23–K27 | Sponsor und Eintrittspreis ab A, Stadion und Kredit ab Pro |
| K28 Vorstand | unabhängig von der Lizenz. Ein Vorstand kann auch einen Teamleiter entlassen, wie bei einem Computer-Verein. |
| K35a Oberfläche | Hinweis „Macht der Co-Trainer · frei ab …“, Schalter Automatik je Bereich, Lizenz-Ansicht |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Gleiche Welt | Mit gleichem Seed und ohne eigene Eingriffe ergibt eine Saison mit Lernstufen dieselben Ergebnisse wie eine Saison ohne Lernstufen, in der jeder Bereich auf Automatik steht. |
| Kein Nachteil | Die Automatik holt im Schnitt höchstens 2 Punkte weniger als derselbe Verein als Computer-Verein. Der Test prüft über sechs Seeds, ob ein größerer Nachteil nachweisbar ist (12 Nr. 30). |
| Tempo neugierig | Ein Test-Spieler, der jede freie Funktion einmal benutzt, hat am Ende der ersten Saison die B-Lizenz und am 1. Juli nach der zweiten die Pro-Lizenz. |
| Tempo gemütlich | Ein Test-Spieler ohne Eingriffe bekommt die C-Lizenz nach 12 Pflichtspielen, B am 1. Juli, A am 1. Januar der zweiten und Pro am 1. Januar der dritten Saison. |
| Keine Halte aus Gesperrtem | Mit Lernstufen gibt es nicht mehr Halte pro Woche als ohne. Aus gesperrten Bereichen kommt kein Halt. |
| Jede Funktion hat eine Lizenz | Jeder Bereich, den die Oberfläche mit `frei()` abfragt, steht in `REGELN.lizenz.frei`, und jede Aktion in `js/aktionen.js` und `js/live.js` prüft ihren Bereich. |
| Browser-Test | `ui-zwei-saisons.js` läuft einmal mit und einmal ohne Lernstufen. Mit Lernstufen prüft er, dass gesperrte Knöpfe fehlen und der Hinweis erscheint. |
| Überspringen und Abschalten | wirken sofort, Abschalten lässt sich im laufenden Spiel nicht zurücknehmen |

## 11. Stellschrauben

```js
lizenz:{
  start:true,                                   // Voreinstellung beim Spielstart: mit Lernstufen
  namen:['Teamleiter','C-Lizenz','B-Lizenz','A-Lizenz','Pro-Lizenz'],
  frei:{aufstellung:1,formation:1,ausrichtung3:1,live:1,wechsel:1,verletzte:1,pokal:1,stimmung:1,
    stil:2,zurufe:2,vorlage:2,transfers:2,gespraeche:2,ansprache:2,kapitaen:2,beobachten:2,
    ausrichtung5:3,einstellung:3,rollen:3,schuetzen:3,lernziel:3,umschulung:3,sommer:3,testspiele:3,lager:3,stab:3,vertraege:3,kaderrollen:3,versprechen:3,
    sportgericht:4,medizin:4,sponsor:4,preise:4,suchauftrag:4,
    stadion:5,kredit:5},
  aufstieg:[
    null,
    {spiele:4,noetig:3,aufgaben:['startelf','liveBisEnde','wechsel','ordnung'],spaetestens:{spiele:12}},
    {spiele:10,noetig:3,aufgaben:['stil','vorlage','zuruf','gespraechOderTransfer'],spaetestens:{saison:1,datum:'07-01'}},
    {spiele:10,abSaison:2,noetig:3,aufgaben:['rolleOderSchuetze','lernziel','sommerplan','vertragOderStab','kaderrolleOderVersprechen'],spaetestens:{saison:2,datum:'01-01'}},
    {spiele:12,abSaison:3,noetig:2,aufgaben:['sportgericht','medizin','sponsorOderPreis'],spaetestens:{saison:3,datum:'01-01'}}],
  ohneGelegenheit:true,                         // Aufgabe gilt als erledigt, wenn es seit dem Aufstieg keine Gelegenheit gab (5.3)
  automatikKlugheit:'normal'                    // bis K16 §5.1 gebaut ist
}
```

`saison` zählt ab der ersten Saison deiner Laufbahn (1 = erste Saison). `abSaison:3` heißt: frühestens ab dem 1. Juli nach der zweiten Saison.

**Gebaut in UL** (`REGELN.lizenz`): statt `frei:{…}` gibt es `bereiche` mit je einem Eintrag `{ab, name, tab, auto, wer, tut}` (Lizenz, Anzeige, Ort, ob es eine Automatik gibt, wer sie führt und was er tut). Die späteste Zeit steht als Saison deiner Laufbahn mit Datum: `{saison:2,datum:'07-01'}` ist der 1. Juli nach der ersten Saison. Dazu `aufgabenNamen`, `ohneGelegenheit`, `testspieleAuto` und `testspielAbstand`.

## 12. Offene Fragen

**Mit dir entschieden (9.11.):** Namen nach den Trainerlizenzen. In der ersten Saison 2–3 Stufen, alles frei nach 2–3 Saisons. Überspringen und Abschalten jederzeit. Gesperrte Bereiche laufen automatisch über den Stab.

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Die C-Lizenz kommt auch ohne jede Nutzung,** spätestens nach 12 Pflichtspielen (deine offene Frage aus PLAN §4). Grund: Niemand soll in der ersten Saison hängen bleiben, und wer zwölf Spiele gesehen hat, kennt die Grundlagen. Alle späteren Lizenzen haben ebenfalls eine späteste Zeit.
2. **Mindestzeit plus Aufgaben,** wobei eine Aufgabe nur „einmal selbst gemacht“ heißt. Die Güte der Entscheidung zählt nicht.
3. **A-Lizenz frühestens in der zweiten Saison, Pro-Lizenz frühestens nach der zweiten Saison,** damit die erste Saison bei höchstens drei Lizenzen bleibt.
4. **Pro bringt heute Stadion und Kredit** (in PLAN §4 standen Stadion bei Stufe 4 und Kredit nirgends). Sonst wäre die Pro-Lizenz bis Welle 4 leer. Beides sind langfristige Entscheidungen mit großem Risiko und passen zur Gesamtverantwortung.
5. **Gesperrte Bereiche sind sichtbar** mit Hinweis, statt versteckt. So lernt man durch Zuschauen.
6. **Neu freie Bereiche bleiben zuerst in der Automatik,** bis du eingreifst.
7. **Informationen sind nie gesperrt,** nur Entscheidungen.
8. **Die Lizenz gehört dir** und bleibt beim Vereinswechsel und nach einer Entlassung.
9. **Die Lizenz hat keine Wirkung auf Jobangebote.** Echt bräuchte ein Cheftrainer in der 1. bis 3. Liga die Pro-Lizenz. Im Spiel wäre das eine Strafe für Einsteiger.
10. **Ausrichtung zuerst mit drei Stufen,** die Mitte und die beiden gemäßigten (defensiv, normal, offensiv). „Sehr defensiv“ und „sehr offensiv“ kommen mit der B-Lizenz.
11. **Zurufe an einzelne Spieler** kommen mit den Schützen auf B, die Zurufe an die Mannschaft schon auf C.
12. **Automatik mit Klugheit „normal“,** bis K16 §5.1 die Qualität des Stabs einbezieht.
13. **Der Aufstieg zählt nicht in das Halte-Budget.**

**Vorläufig entschieden bei der Umsetzung (UL, 12. November 2026):**

14. **Gesperrt und Automatik sind dasselbe Stück Code:** `autoB(bereich)` ist wahr, wenn der Bereich gesperrt ist oder du ihn frei beim Stab gelassen hast. Die Spiellogik fragt dann `stabMacht(verein, bereich)` und behandelt deinen Verein wie einen Computer-Verein. Ohne `S.lizenz` (Tests, alte Spielstände) ist alles frei und nichts automatisch: Das Spiel läuft wie vor UL.
15. **38 Bereiche.** Neu gegenüber §5.2: `jugend` (B-Lizenz, die Stufe der Jugendarbeit hatte keine Lizenz). `aufstellung` und `formation` bleiben beim Teamleiter frei, haben aber eine freiwillige Automatik (der Co-Trainer stellt die beste Elf auf und prüft monatlich die Grundordnung). So lässt sich auch das Kernstück delegieren (K16 §3.3).
16. **Die Automatik nutzt die Regel der Computer-Vereine, auch wo §5.2 etwas Klügeres vorsah:** Einstellung (in wichtigen Spielen „Spiel der Saison“ statt immer normal) und Sommer (übliche Urlaubslänge statt Vorschlag nach Belastung). Grund ist Grundsatz 1: kein zweites Regelwerk. Klügere Regeln kommen mit U11 für alle.
17. **Transfers in der Automatik:** Dein Verein nimmt am Markt der Computer-Vereine teil (Transferliste, Käufe, Verkäufe, Kader auffüllen im Sommer). Angebote an dich gibt es dann nicht. Jeder Wechsel steht im Posteingang.
18. **Testspiele:** Der Co-Trainer plant in der Vorbereitung zwei Testspiele gegen Amateure, wie §5.2 es vorsieht. Computer-Vereine spielen weiter keine (K11, Konsistenzprüfung AQ3). Das ist der einzige Bereich, in dem die Automatik etwas tut, was Computer-Vereine nicht tun.
19. **Gegner reagieren nicht auf deinen Lieblingsstil, solange der Co-Trainer den Stil wählt** (K06 §7). Vorher konterten sie auch die Wahl des Co-Trainers, das kostete in einem Seed acht Punkte.
20. **Neu freie Bereiche bleiben in der Automatik,** bis du dort etwas änderst (dann gehört der Bereich dir) oder „Selbst machen“ wählst. In der Lizenz-Ansicht lässt sich jeder freie Bereich mit Automatik dem Stab zurückgeben.
21. **Abschalten** macht alles frei, bisher Gesperrtes läuft in der Automatik weiter (keine Arbeit über Nacht, wie Nr. 6). „Alles Freie selbst machen“ nimmt alles auf einmal zurück. Wer beim Spielstart „Alles frei“ wählt, führt alles selbst wie vor UL.
22. **Aufstiegskarte:** oben im Büro, als Halt am Tag des Aufstiegs. Geprüft wird nur an Tagen ohne eigenes Spiel, die Karte kommt also nie vor dem Anpfiff. Sie nennt die neuen Bereiche mit Knopf „Hingehen“, was der Stab dort bisher getan hat, und die Aufgaben der nächsten Lizenz.
23. **Aufgabe „live bis zum Abpfiff“** zählt, wenn du im Live-Spiel nicht bis zum Ende vorgespult hast. Vorspulen bis zur Halbzeit ist erlaubt.
24. **Zusagen im Gespräch** hängen am Bereich `versprechen` (B). Themen mit Zusage sind bis dahin im Gespräch gesperrt, die übrigen ab C frei.
25. **Sponsor, Eintrittspreis, Kredit:** Der Verein nimmt sofort das Angebot mit dem höchsten festen Betrag, setzt vor jedem Heimspiel den Richtpreis und tilgt am Saisonende aus dem Guthaben.
26. **Gesperrte Bedienelemente** bleiben sichtbar, sind aber aus, mit dem Hinweis „Macht der Co-Trainer · frei ab der B-Lizenz“. Gesperrte Rollen am Platz stehen nur als Kürzel da. Die Lizenz steht in der Kopfzeile, ein Klick öffnet die Lizenz-Ansicht (auch im Menü).
27. **Meldungen des Stabs** stehen einzeln im Posteingang (Strafe angenommen, Vertrag verlängert, Gespräch geführt, Testspiel angefragt). Die Sammlung im Wochenbericht aus §8 ist noch nicht gebaut.
28. **Test „kein Nachteil“ ergänzt:** Eine einzelne Saison schwankt um mehrere Punkte, sechs Seeds reichen für das Ziel „höchstens 2 Punkte“ nur knapp. Dazu kommt deshalb der Gleichschritt-Test: Ohne die Testspiele entwickelt sich der Kader 150 Tage lang Tag für Tag genau wie beim selben Verein als Computer-Verein. Gemessen über sechs Seeds: Stab am Steuer 52,2 Punkte, ohne Testspiele 53,5, als Computer-Verein 53,7.
29. **Noch nicht gebaut:** Rauschen der Automatik nach Qualität des Mitarbeiters (K16 §5.1, Nr. 12), Testspiele und Kredit der Computer-Vereine (7), Sammlung der Stab-Meldungen im Wochenbericht, eine eigene kleine Aufgabe auf der Aufstiegskarte (sie zeigt die Aufgaben der nächsten Lizenz).
30. **„Kein Nachteil“ genau gemessen (13.11., nach U8d):** Über 18 Seeds holt die Automatik −2,5 ± 1,6 Punkte gegenüber demselben Verein als Computer-Verein, vor U8d waren es −1,2 ± 1,7. Der gepaarte Unterschied (−1,3 ± 1,3) ist nicht von null zu unterscheiden. Das Ziel „höchstens 2 Punkte“ ist damit weder belegt noch widerlegt. Ein Paar streut um etwa 7 Punkte, das Mittel über sechs Seeds um knapp 3, der alte feste Vergleich mit −2 fiel deshalb je nach Lauf rot oder grün aus. Der Test prüft jetzt, ob ein Nachteil von mehr als 2 Punkten nachweisbar ist (Mittel plus 1,64 Standardfehler mindestens −2). Die bekannten Ursachen des Rests bleiben: echte Buchhaltung gegen Einnahmen nach Formel und die Testspiele, die nur dein Verein spielt (Nr. 28, U11).
31. **U9c Jugend:** zwei neue Bereiche, `jugendkader` (B-Lizenz, mit Automatik) und `pate` (A-Lizenz, ohne). Das Gespräch „Druck nehmen“ hängt am Bereich `gespraeche` (C-Lizenz). Jugendkader, Jugendniveau, Belastungsregler und Prägungen sind als Information immer sichtbar. Damit sind es 40 Bereiche.
32. **U9d Zweite Mannschaft:** zwei neue Bereiche, `zweite` (Budget) und `zweitekader` (Wechsel aus der Jugend, Aufrücken, Verkauf), beide B-Lizenz mit Automatik. Die Karte der Zweiten ist als Information immer sichtbar. Damit sind es 42 Bereiche.
33. **U10a und U10b:** Verhandeln und Gegenforderung hängen an `transfers`, Verlängern mit Gehalt, Laufzeit und Handgeld an `vertraege`. Neu ist `praemien` (A-Lizenz, ohne Automatik) für Prämien und Klauseln: Darunter bleibt das Formular einfach. Damit sind es 43 Bereiche.
34. **U10c Berater:** neuer Bereich `berater` (B-Lizenz, ohne Automatik) für die Einladung. Damit sind es 44 Bereiche.
35. **U10d Leihe:** neuer Bereich `leihe` (B-Lizenz, ohne Automatik). Profis in die Zweite abstellen hängt an `zweitekader`, der Medizincheck an `transfers`. Damit sind es 45 Bereiche.
36. **U11a Computer-Vereine (19.11., ohne Testlauf):** keine neue Funktion für dich, also kein neuer Bereich, es bleibt bei 45. Die Automatik des Bereichs `transfers` folgt jetzt dem Kaderplan (K31 §5.6): Der Verein setzt Überzählige auf die Transferliste, kauft nur bei Bedarf und bleibt im Budget (die Hälfte des Kontos im Sommer, ein Viertel im Winter). Das Budget steht am Anfang des Fensters fest, damit die Automatik im Sommerfenster genau wie ein Computer-Verein entscheidet (Gleichschritt in `tests/lizenz.js`, noch nicht nachgeprüft).
37. **U11c Verträge nach Rang (19.11., ohne Testlauf):** Die Automatik des Bereichs `vertraege` folgt jetzt dem Kaderplan: Sie verlängert die Gebrauchten schon im Herbst und lässt Überzählige gehen (K31 §5.8). Text in `REGELN.lizenz.bereiche.vertraege.tut` angepasst. Kein neuer Bereich.
38. **U11d1 Leihen unter Computer-Vereinen (19.11., ohne Testlauf):** keine neue Funktion für dich, kein neuer Bereich. Der Bereich `leihe` bleibt **ohne Automatik**: Dein Verein verleiht und leiht nie von selbst, auch nicht, wenn der Verein deine Transfers führt, und Computer-Vereine leihen nicht bei dir aus (K31 §12 Nr. 32). Neu in der B-Lizenz ist nur das Leihkontingent (6 verliehen, 6 ausgeliehen, 3 je Paar, Spieler bis 21 frei), das für alle gilt.
39. **U11d2 Trainerwechsel bei Computer-Vereinen (19.11., ohne Testlauf):** keine neue Funktion für dich, kein neuer Bereich. Neu ist nur eine Meldung („Großer Umbruch“), wenn ein Verein deiner Liga den Trainer wechselt. Meldungen sind Informationen und immer frei.
40. **U12a Vorstand (20.11., ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Neu sind Informationen im Büro (Ruf als Trainer, Geduld des Präsidenten, laufendes Ultimatum) und Meldungen zum Ultimatum, alles frei. Der Rücktritt (K28 §5.3) wäre eine neue Funktion mit Lizenz und kommt erst mit U12b.
41. **U12b Nebenziele und Rücktritt (20.11., ohne Testlauf):** neuer Bereich `ruecktritt` (Grundlizenz, ohne Automatik, Büro). Damit sind es 46 Bereiche. Begründung für die Grundlizenz: eine Karriere-Entscheidung, keine Fähigkeit, die man lernt (K28 §12 Nr. 17). Die Nebenziele sind Information und Vorgabe des Vorstands, keine Funktion.
42. **U12c Beziehungen (20.11., ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Die Beziehungen sind Information (Büro, Spielerkarte) und wirken in Bereichen, die es schon gibt (`transfers`, `testspiele`, `leihe`).
43. **U12d Ereigniskarten (20.11., ohne Testlauf):** neuer Bereich `ereignisse` (Grundlizenz, mit Automatik, Büro): Entscheidungen in Ereigniskarten. Damit sind es 47 Bereiche. In der Automatik wählt der Co-Trainer die Voreinstellung jeder Karte, sie kommt dann nur als Info. Ohne Automatik entscheidet er auch, wenn du bis zum Anpfiff nicht gewählt hast (K30 §12 Nr. 6). Die Infos selbst sind frei.
44. **U13 Statistik und Historie (20.11., ohne Testlauf):** neuer Bereich `statistik` (Grundlizenz, ohne Automatik, eigene Ansicht „Statistik“). Damit sind es 48 Bereiche. Statistik steuert nichts, darum keine Automatik. Dass sie trotzdem einen Bereich bekommt, folgt der Regel aus §5.2 (jede neue Funktion mit Lizenz). Die Karte „Statistik“ und „Vergleichen“ auf der Spielerkarte gehören dazu.
45. **U14 Saisonvorbereitung (20.11., ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Die Liste „Vor dem Saisonstart“ ist Information und zeigt je Punkt den Bereich, zu dem er gehört (gesperrte Punkte nennen, wer sie erledigt). Die Saisoneröffnung läuft von selbst. Neu ist die Erinnerung `vorbereitung`, abschaltbar wie alle Erinnerungen.
46. **U15 Transfers II (20.11., ohne Testlauf):** neuer Bereich `abwerben` (A-Lizenz, ohne Automatik, Transfers): Spieler heimlich treffen. Damit sind es 49 Bereiche. Begründung für die A-Lizenz: Abwerben setzt Beziehungen, Berater und Vorstand aufs Spiel und braucht Erfahrung mit dem Transfermarkt (`transfers` ab der C-Lizenz, `suchauftrag` ab der A-Lizenz). Ohne Automatik, weil dein Verein nie von selbst abwirbt. Die Bieterrunde gehört zum Bereich `transfers`. Der Deadline Day ist Information mit Halt, frei.
47. **U16 Fans (20.11., ohne Testlauf):** neuer Bereich `fangespraech` (C-Lizenz, ohne Automatik, Stadion): Fan-Gespräch einmal im Monat. Damit sind es 50 Bereiche. Die Fanstimmung selbst ist Information und für alle frei. C-Lizenz wie Einzelgespräche und Mannschaftsansprache, weil es dieselbe Art Handlung ist.
48. **U17a Pressekonferenzen (20.11., ohne Testlauf):** neuer Bereich `presse` (C-Lizenz, mit Automatik, Büro): Pressekonferenzen. Damit sind es 51 Bereiche. In der Automatik geht der Co-Trainer und antwortet mit Floskeln (Medienklima −2), du liest nur die Schlagzeile. Ohne Automatik hält der Tag an („Pressekonferenz“), wer nicht hingeht, schickt am nächsten Tag automatisch den Co-Trainer. Der Gleichschritt (§10) hält, weil der Co-Trainer nicht würfelt und nur das Medienklima ändert.
49. **U17b Gerüchteküche (20.11., ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Gerüchte sind Information. Die Pressekonferenz „Gerüchte“ gehört zum Bereich `presse`.
50. **U18b Karten der Spielwelt (20.11., ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Die Karten gehören zum Bereich `ereignisse`. Die Auslöser schauen nicht auf Lizenzen (Gleichschritt). Der Altstar unterschreibt nur, wenn `transfers` frei ist.
51. **K23a Finanzplan (21.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Monatsbericht und Prognose sind Information, Auflagen, Transfersperre und Insolvenz sind Folgen. Die Transfersperre gilt auch für die Automatik der Transfers und für den Altstar aus den Ereigniskarten.
52. **K23e Kredit, Raten, Gehaltsverzicht (21.11., popolupo, ohne Testlauf):** keine neuen Bereiche. Laufzeit und Sondertilgung gehören zu `kredit` (Pro-Lizenz), ebenso der Gehaltsverzicht als Notmaßnahme. Die Ablöse in Raten ist eine Wahl beim Kauf und gehört zu `transfers`. Die Automatik von `kredit` tilgt wie bisher am Saisonende aus dem Guthaben, die monatliche Tilgung läuft immer.
53. **K25a Marketing (21.11., popolupo, ohne Testlauf):** neuer Bereich `marketing` (B-Lizenz, mit Automatik, Stadion): Trikot wählen und Kampagnen starten. Damit sind es 52 Bereiche. In der Automatik nimmt der Verein das klassische Trikot und startet keine Kampagnen. Ohne Automatik nimmt er das klassische Trikot ebenfalls, wenn du bis zum Tag vor dem ersten Pflichtspiel nicht gewählt hast, am selben Tag wie in der Automatik (Gleichschritt). B-Lizenz, weil Kampagnen Geld kosten und erst mit Fans und Finanzen Sinn ergeben.
54. **K26a Anlagen und Bauprozess (21.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Die Anlagen (Trainingsgelände, Nachwuchsleistungszentrum, Reha-Zentrum, Catering, Anzeigetafel) gehören zu `stadion` (Pro-Lizenz), ohne Automatik wie bisher. Genehmigung, Auflagen, Verzögerung und Mehrkosten sind Folgen eines Baus, den nur der Mensch startet. Der Gleichschritt (§10) hält, weil der Würfel erst beim Start fällt, im eigenen Strom `bau`.
55. **U19a Europapokal (21.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Spiele und Auslosungen sind ab Teamleiter dabei (K37 §9), Aufstellung, Taktik und Live-Spiel gehören zu ihren bisherigen Bereichen. Die Auslosung ist ein Halt wie beim Pokal. Der Gleichschritt hält, weil Auslosungen und die Kurzrechnung eigene Ströme haben und nicht auf Lizenzen schauen.
56. **U19b Prämien und Ansehen im Europapokal (21.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Prämien, Ansehen und Vertrauen sind Folgen der Spiele.
57. **U19c Länderwertung, Interesse, Nebenziel (21.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Die Länderwertung ist Information, das Nebenziel gehört zum Vorstand wie die übrigen Nebenziele.
58. **K25b Karte „Trikot ausverkauft“ (21.11., popolupo, ohne Testlauf):** keine neue Funktion. Die Karte gehört zum Bereich `ereignisse`, der Auslöser schaut nicht auf Lizenzen (Gleichschritt).
59. **K23b und K23d Finanzen der Computer-Vereine, Budgets (22.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Gehaltsrahmen und Transferbudget sind Information, der Kaufstopp über 110 % ist eine Folge und gilt für Automatik und Computer-Vereine gleich (Gleichschritt).
60. **U19d1 Kaderliste der UEFA (22.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Melden und Streichen gehören zu `aufstellung` (Teamleiter, mit Automatik: der Co-Trainer meldet zur Frist). Ohne Meldung meldet der Verein am selben Tag wie die Automatik (Gleichschritt).
61. **K23c echte Größenordnungen (22.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. TV nach dem Säulenmodell, weitere Sponsoren und Verwaltung sind Buchungen ohne Entscheidung. Die TV-Gelder werden zu Saisonbeginn festgelegt, nicht beim ersten Gebrauch, damit beide Läufe im Gleichschritt-Test gleich rechnen.
62. **U12e Zielgespräch (22.11., popolupo, ohne Testlauf):** neue Funktion, neuer Bereich `zielgespraech` in der Grundlizenz (wie `ruecktritt`, K28 §5.8), ohne Automatik: Ohne Entscheidung gilt der Vorschlag des Vorstands. Gewürfelt wird nur beim Tiefstapeln, also nur nach deinem Eingriff (Gleichschritt unberührt).
63. **K32 §5.1 Karriereende (22.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Eigener Strom je Spieler und Saison, unabhängig von Lizenz und Automatik (Gleichschritt).
64. **K26b Computer-Vereine bauen (22.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Nur Computer-Vereine bauen, zum Saisonstart. Dein Verein baut nur selbst (Bereich `stadion`, Pro-Lizenz, ohne Automatik). Der Gleichschritt-Test (150 Tage ohne Saisonwechsel) ist nicht berührt. Im Test „Kein Nachteil“ über ganze Saisons kann der Computer-Lauf ab der zweiten Saison etwas besser dastehen, weil nur er baut.
65. **K23f Kartenbeträge nach Liga (22.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Nur die Höhe der Geldwirkungen hängt an der Liga deines Vereins.
66. **K27b Dauerkarten (22.11., popolupo, ohne Testlauf):** neue Funktion (Rabatt der Dauerkarten wählen) im bestehenden Bereich `preise` (A-Lizenz, Automatik: der Verein nimmt 20 %). Kein neuer Bereich, weil es eine Preisentscheidung wie der Eintrittspreis ist. Gleichschritt: In der Automatik ist der Rabatt der Standard, die Fanstimmung bekommt dann +0.
67. **K20b Preise am Deadline Day (22.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Die Schwankung wirkt nur auf Forderungen an dich (`forderung`), die Regeln der Computer-Vereine und der Automatik rechnen ohne sie (Gleichschritt). Angebote an dich kommen ohnehin nur, wenn du die Transfers selbst führst.
68. **K26c Fanshop und Instandhaltung der Computer-Vereine (22.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Nur Computer-Vereine, zum Saisonstart und je Ligaspiel, ohne Zufall.
69. **K20c Bieterwettstreit beim Kauf (22.11., popolupo, ohne Testlauf):** keine neue Funktion, gehört zum Bereich `transfers` (dein Angebot). Nur nach deinem Angebot, im eigenen Strom je Spieler und Saison. Die Automatik kauft nach den Regeln der Computer-Vereine und trifft nie auf den Ablauf (Gleichschritt).
70. **U12f Zwischenbilanz im Winter (22.11., popolupo, ohne Testlauf):** neue Funktion (Ziel senken beantragen) im Bereich `zielgespraech` (Grundlizenz), ohne Automatik: Ohne Antrag bleibt das Ziel. Das Anheben durch den Vorstand würfelt nicht.
71. **K29b Medienpolitik (22.11., popolupo, ohne Testlauf):** neue Funktion (Medienpolitik wählen) im bestehenden Bereich `presse` (C-Lizenz, Automatik: zurückhaltend). Kein neuer Bereich, weil sie zum Umgang mit den Medien gehört. Gleichschritt: In der Automatik ändert sich nichts, die Gerüchteküche ist im Test ohnehin aus.
72. **K23g Lizenzprüfung der Computer-Vereine (22.11., popolupo, ohne Testlauf):** keine neue Funktion, kein neuer Bereich. Nur Computer-Vereine, am 1. März und 31. Mai, ohne Zufall. Dein Verein hat seine eigene Prüfung. Gleichschritt: außerhalb der 150 Tage. Über mehrere Saisons kann der Computer-Lauf eine Sperre bekommen, wo dein Verein in der Automatik deine Prüfung durchläuft (ähnliche Regel, anderes Modell).
73. **K25c Dauerkarten-Aktion (22.11., popolupo, ohne Testlauf):** keine neue Funktion, eine weitere Kampagne im Bereich `marketing`. Wirkt nur auf deine Dauerkarten (K27b), ohne Zufall.
74. **K26d Dach (22.11., popolupo, ohne Testlauf):** keine neue Funktion, ein weiterer Bau im Bereich `stadion`. Wirkt in der Engine nur mit gebautem Dach. Computer-Vereine bauen es nicht, die Automatik deines Vereins baut nicht (Gleichschritt unberührt).
75. **K29c Exklusivinterview (22.11., popolupo, ohne Testlauf):** neue Funktion im bestehenden Bereich `presse` (C-Lizenz). Ohne Automatik: Der Co-Trainer gibt keine Interviews, die Beziehungen bleiben dann bei 0. Gleichschritt unberührt (Gerüchteküche im Test aus).
76. **K25d Mitglieder und Mitgliederaktion (22.11., popolupo, ohne Testlauf):** keine neue Funktion, eine weitere Kampagne im Bereich `marketing`. Die Beiträge gelten für alle Vereine gleich und ohne Zufall (Gleichschritt unberührt).
77. **K29d Medienklima und Beziehungen in der Pressekonferenz (22.11., popolupo, ohne Testlauf):** keine neue Funktion, Regeln im bestehenden Bereich `presse` (C-Lizenz). In der Automatik geht der Co-Trainer, dann wirkt nur die Wahl der Journalisten im Strom `presse`, der Grundstrom bleibt unberührt (Gleichschritt unberührt).
78. **U12g Trainervertrag (22.11., popolupo, ohne Testlauf):** keine neue Funktion, nur Anzeige und Karriere-Statistik. Der Vorstand verlängert von selbst, du entscheidest nichts. Ohne Zufall und ohne Geld (Gleichschritt unberührt).
79. **K29e Medienprofil der Computer-Trainer und Sticheleien (22.11., popolupo, ohne Testlauf):** keine neue Funktion, eine weitere Frage im bestehenden Bereich `presse` (C-Lizenz). In der Automatik bleibt die Stichelei ohne Wirkung (Gleichschritt unberührt, er vergleicht die Stimmung).
80. **U12h Ruf wirkt (22.11., popolupo, ohne Testlauf):** keine neue Funktion. Der Ruf wirkt auf Interesse, Kabine und Glaubwürdigkeit beim neuen Verein. Ohne Zufall. Im Gleichschritt bleibt der Ruf in den 150 Tagen beim Start, die Werte ändern sich also nicht.
81. **K34b Rekorde der 2. und 3. Liga (22.11., popolupo, ohne Testlauf):** keine neue Funktion, nur Startwerte und Meldungen. Ohne Zufall (Gleichschritt unberührt).
82. **K32c Ex-Spieler im Stab (22.11., popolupo, ohne Testlauf):** keine neue Funktion, mehr Auswahl unter den vereinslosen Mitarbeitern im Bereich `stab`. Erst zum Saisonwechsel, eigener Strom (Gleichschritt unberührt, er läuft 150 Tage).
83. **K20d Recht des Spielers beim Bieterwettstreit (22.11., popolupo, ohne Testlauf):** keine neue Funktion, eine weitere Folge im Kauf (Bereich `transfers`). Nur nach deinem Angebot, eigener Strom (Gleichschritt unberührt).
84. **U12i Präsidentenwahl (22.11., popolupo, ohne Testlauf):** keine neue Funktion. Im Sommer, eigener Strom je Verein (Gleichschritt unberührt, er läuft 150 Tage).
85. **U12j Jobangebot (22.11., popolupo, ohne Testlauf):** neue Karte im bestehenden Bereich `ereignisse`. Der Co-Trainer wechselt nie (Voreinstellung bleiben). Die Wochenkarten sind im Gleichschritt aus.
86. **K29f Interview am Spielfeldrand (22.11., popolupo, ohne Testlauf):** keine neue Funktion, eine kleine Karte im Bereich `presse` (C-Lizenz). In der Automatik gibt es kein Interview (Gleichschritt unberührt).
87. **K29g Pressekonferenz nach dem Urteil (22.11., popolupo, ohne Testlauf):** neuer Anlass im bestehenden Bereich `presse`. In der Automatik geht der Co-Trainer (Gleichschritt unberührt, er vergleicht weder Medienklima noch Pressekonferenzen).
88. **U12k Vorstand senkt von sich aus (22.11., popolupo, ohne Testlauf):** keine neue Funktion, eine weitere Folge der Zwischenbilanz (Grundlizenz, ohne Zufall).
89. **K25e Vorkaufsrecht der Mitglieder (22.11., popolupo, ohne Testlauf):** keine neue Funktion, ein weiterer Baustein im Anteil der Dauerkarten (Bereich `preise`). Ohne Zufall, nur dein Verein verkauft Dauerkarten (Gleichschritt unberührt, er vergleicht kein Geld).
90. **K14b Kabinen-Karten (22.11., popolupo, ohne Testlauf):** drei neue Karten im Bereich `ereignisse` (Kabinenparty, Neuzugang drängt auf Einsatz, Eingewöhnung). Die Wochenkarten sind im Gleichschritt aus.
91. **K19c Transferstatus unverkäuflich (22.11., popolupo, ohne Testlauf):** neue Schaltfläche im Bereich `transfers` (wie die Transferliste). Die Automatik markiert nichts, der Höchstpreis gilt nur für deine Käufe (Gleichschritt unberührt).
92. **K09b Erinnerung Gelbsperre (22.11., popolupo, ohne Testlauf):** keine neue Funktion, eine weitere Erinnerung vor „Tag beenden“, im Menü abschaltbar. Ohne Wirkung aufs Spiel.
93. **K16b Trainerteam mitnehmen (22.11., popolupo, ohne Testlauf):** Wahl im Fenster der Jobangebote, keine neue Funktion. Ohne Zufall, nur beim Jobwechsel.
94. **K29h Kritik am Urteil (22.11., popolupo, ohne Testlauf):** nur Texte, keine neue Funktion.
95. **K14c Führungsspieler meutert (22.11., popolupo, ohne Testlauf):** neue Karte im Bereich `ereignisse`. Die Wochenkarten sind im Gleichschritt aus.
96. **K07b Erinnerung „Plan passt nicht“ (22.11., popolupo, ohne Testlauf):** keine neue Funktion, eine weitere Erinnerung vor „Tag beenden“, im Menü abschaltbar. Ohne Wirkung aufs Spiel.
97. **K34c Europapokal in der Saisonstatistik (22.11., popolupo, ohne Testlauf):** nur Anzeige.
98. **K29i Interviews der Spieler und Maulkorb (22.11., popolupo, ohne Testlauf):** Maulkorb als Schalter im bestehenden Bereich `presse`. In der Automatik weder Interviews noch Maulkorb (Gleichschritt unberührt, er vergleicht die Stimmung).
99. **U12l Budgetgespräch (22.11., popolupo, ohne Testlauf):** keine neue Funktion, eine weitere Schaltfläche im Bereich `zielgespraech` (Grundlizenz, ohne Automatik).
100. **K18c Gegnerbeobachtung (22.11., popolupo, ohne Testlauf):** keine neue Funktion, eine Schaltfläche im bestehenden Bereich `beobachten`. Ohne Zufall, die Automatik beobachtet keine Gegner (Gleichschritt unberührt).

**Für UL zu klären (erledigt):** Vertragsverlängerungen und Kader auffüllen laufen in der Automatik nach der Regel der Computer-Vereine. Testspiele und Kredit haben eine eigene Regel der Automatik (Nr. 18, 25), weil Computer-Vereine dort noch nichts tun. Jeder Bereich mit Automatik hat in den Regeln einen Satz „was der Stab tut“ für Karte, Hinweis und Lizenz-Ansicht.

## Quellen

- Grundsätze und erste Leiter: PLAN §4 (K36, 9.11.), deine Entscheidungen vom 9.11. in PLAN §2 und §4
- Lizenz-Notizen der Konzepte: K10 §12 Nr. 14, K11 §12 Nr. 12, K13 §12 Nr. 13
- DFB-Lizenzen, Pro-Lizenz früher Fußball-Lehrer, Stufen C bis Pro: [fussballtraining.com: Trainerlizenzen im Fußball](https://fussballtraining.com/artikel/trainerlizenzen-im-fussball-ein-ueberblick), [DFB-Ausbildungsordnung (Heft 09, Stand 1.7.2024)](https://dfb.de/fileadmin/_dfbdam/307870-Heft_09_Ausbildungsordnung_20240701.pdf)
- Pro-Lizenz Pflicht in der 1. bis 3. Liga, A-Lizenz für die Regionalliga: [bundesliga.com: Fußballlehrer-Lizenz](https://www.bundesliga.com/de/faq/fussball-allgemein/fussballlehrer-lizenz-so-wird-man-trainer-in-der-bundesliga-22358), [DFB: Sanktion für Unterhaching und Lübeck](https://www.dfb.de/news/detail/sanktion-fuer-unterhaching-und-luebeck-auf-grund-nicht-ausreichender-trainerlizenz-254257/)
- „Teamleiter“ als Lehrgang eines Landesverbands, Basis-Coach als Einstieg: [FV Rheinland: Veranstaltungsheft 2021/22](https://www.fv-rheinland.de/wp-content/uploads/2021/11/FVR-Veranstaltungsheft-2021-2022.pdf), [FVN: Ausbildungsstruktur 2025](https://fvn.de/media/fvn-ausbildungsstruktur_2025.pdf)
- Schrittweise Offenlegung: [Wikipedia: Progressive disclosure](https://en.wikipedia.org/wiki/Progressive_disclosure), [IxDF: Progressive Disclosure](https://ixdf.org/encyclopedia/progressive_disclosure.html)
- Football Manager Touch als schlankere Ausgabe: [footballmanager.com: Unterschiede der Ausgaben](https://footballmanager.com/node/520), [Stuff: FM Touch 2018 im Test](https://www.stuff.tv/review/football-manager-touch-2018-review)
- **Hinweis:** Die Angaben stammen aus den Zusammenfassungen der Suchergebnisse, die Volltexte (DFB-Ausbildungsordnung, Nielsen-Artikel) habe ich nicht gelesen.
