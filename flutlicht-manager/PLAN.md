# Flutlicht Manager – Gesamtplan

Stand: 7. November 2026 (U1 umgesetzt, dazu Sommer, Anstoßzeiten und 3. Liga; Konzepte K02, K03 und K04 als Entwurf, damit stehen alle Konzepte der Welle 1). Das Projekt ist ein Nebenprojekt, das langsam und gründlich wachsen soll, ohne Schnellschüsse.

## 1. Arbeitsweise

**Erst das Konzept, dann der Code, ein Bereich nach dem anderen.**

1. Jeder Spielbereich bekommt ein eigenes Konzeptdokument in `konzepte/`, nach der Vorlage `konzepte/_vorlage.md`.
2. Ein Konzept wird mit dir besprochen und erst dann umgesetzt. Status: `Idee → Entwurf → abgestimmt → umgesetzt`.
3. Die Umsetzung läuft in Wellen. Jede Welle endet mit einem spielbaren Stand und grünen Tests.
4. **Session-Regel zum Token-Sparen:** pro Session ein bis vier Konzepte oder ein Umsetzungsschritt, immer in einer neuen Session. Startsatz zum Beispiel: „Konzept K03 aus PLAN.md“ oder „Umsetzung U2“.
5. Alle Stellschrauben, also Zahlen, Wahrscheinlichkeiten und Preise, kommen in `daten/regeln.js`. Spielerdaten liegen in `daten/spieler.js`. Bearbeitet werden sie nur dort, nicht im Spiel.
6. Rohmaterial aus der ersten Planung steht in `konzepte/_rohmaterial-logik-v1.md`: Engine, Sportgericht, Transfers, Computer-Vereine. Daraus speisen sich die Konzepte.
7. Die Genre-Recherche steht in `konzepte/_recherche-genre.md`: was BMH, Anstoss 3, Football Manager, We Are Football und Hattrick enthalten, was die Community kritisiert und was wir übernehmen. Vor jedem Konzept lesen.
8. Die Konsistenzprüfung steht in `konzepte/_konsistenzpruefung.md`: Widersprüche, Lücken, Abhängigkeiten, Zuständigkeiten und offene Entscheidungen. Bei jedem neuen Konzept fortschreiben.
9. **Gespielt wird erst die fertige Alpha** (7.11.). Bis dahin müssen Spielstände nicht zwischen Versionen umgewandelt werden, und die Reihenfolge im Plan darf sich ändern, wenn das den Bau einfacher oder stimmiger macht.

## 2. Bereits entschieden (aus deinen Antworten)

| Thema | Entscheidung |
|---|---|
| **Zeit** | Kalender in Tagen, der **Sommer wird nicht übersprungen** (6.11.): Urlaub (2–4 Wochen), Testspiele, Trainingslager, neue Sponsorverträge. Saisonwechsel am 1. Juli. Der Knopf „Tag beenden“ springt zum nächsten Tag mit einem Ereignis, höchstens 7 Tage weit. Gibt es kein Pflichtspiel, ist spielfrei, zum Beispiel in der Länderspielpause, und man kann Freundschaftsspiele ansetzen. |
| **Erinnerung vor „Tag beenden“** | „Sicher? Du kannst noch …“ erscheint nur, wenn wirklich etwas Sinnvolles offen ist. Beispiele: Aufstellung seit dem letzten Spiel nicht angesehen, aber Spieler fehlen; kein Training geplant; spielfreie Woche ohne Testspiel; eine Frist läuft heute ab. Jede Erinnerungsart lässt sich abschalten. |
| **Transferfenster** | gelten für alle. Die Saisonvorbereitung ist eine eigene Phase mit Schwerpunkt auf Transfers, Sponsoren, Marketing und Trainingslager. |
| **Abwerben** | Keine festen Strafen. Stattdessen verschlechtert sich die Beziehung zum anderen Verein. Das bringt mehr Klatsch und Tratsch, und das wirkt auf Spieler, manchmal positiv, öfter negativ. |
| **Ereigniskarten** | Ein Story-Playbook mit Zufallsereignissen, dosiert, damit es nicht zu viel wird. Beispiel: Zwei Vereine streiten um einen Spieler, über einen entfernten Verwandten kennst du den Berater. Stellst du dich geschickt an, unterschreibt er bei dir, und die beiden Verlierer sind aufeinander sauer, nicht auf dich. |
| **Wissen über Spieler** | Jeder Spieler hat echte Werte. Was du siehst, hängt vom Scouting ab: manche Werte ungenau, manche unbekannt, besonders bei Jugendspielern und bei Spielern aus dem Ausland. |
| **Junge Spieler** | Sie verändern sich am schnellsten, in beide Richtungen, und können „verheizt“ werden. Beispiel: Das Debüt im Topspiel kann einen Schub geben, aber auch einen Knacks. |
| **Spielermodell** (5.11.) | Anstoss-Stil: Stärke 1–99 als Hauptzahl, erlernbare Merkmale mit Lernfortschritt, Charakter-Eigenschaften, Beziehungen im Kader. Form 0–20 mit Mitte 10. |
| **Spielermodell-Details** (7.11.) | Stärke entwickelt sich in kleinen Schritten an jedem Spieltag, die Form (Tore in Serie, Paraden, Serien gegen die Erwartung) beschleunigt oder bremst. Szenen im Spiel (Ecken mit Torfolge, Kopfballtore, Elfmeter) zahlen auf Merkmale ein, Fehlschläge auf Schwächen. Fuß rechts oder links (überwiegend rechts), „beidfüßig“ ist ein Merkmal. Talentsterne dürfen um einen Stern danebenliegen. 14 Positionen in vier Gruppen: TW; IV, LV, RV; DM, ZM, Spielmacher, OM, LM, RM; Mittelstürmer, hängende Spitze, LA, RA. Dazu die Nationalität, kein Libero. Charakter echter Spieler wird aus Fakten abgeleitet, wo es geht (Kapitän, Jahre im Verein, Karten, Verletzungen), sonst Zufall. Später erzeugte Spieler nur Zufall. „Trainingsweltmeister“ umgangssprachlich. Merkmale und Eigenschaften erst anzeigen, wenn sie wirken. Siehe K03 §12. |
| **Meldungsdichte** (5.11.) | 2–4 Stopps pro Woche mit Entscheidung, alles andere landet im Posteingang. Dazu ein Regler in den Einstellungen. |
| **Spieltage** (6.11.) | über das Wochenende verteilt wie in echt, nach dem offiziellen Spielplan 2026/27 (OpenLigaDB) mit Anstoßzeiten. Samstag 15:30 bleibt die Konferenz, der letzte Spieltag läuft zeitgleich. |
| **Unterbau** (6.11.) | 3. Liga mit 20 echten Vereinen als vollständige Liga, Regionalliga als Pool mit gelosten Meistern und Aufstiegsspielen („etwas Zufall“). Konzept K32a. |
| **Alte Spielstände** (6.11.) | aus Testversionen sind Müll und werden gelöscht. |
| **Europapokal** (5.11.) | später als Erweiterung. Zuerst 1. und 2. Liga und Pokal. |
| **Vorläufig übernommen** (Vorschläge aus der Konsistenzprüfung, gelten, solange du nichts anderes sagst) | Automatik und Delegieren in jedem Bereich über den Stab. Nichts wegnehmen, bevor der Ersatz fertig ist. K08 und der Auslandspool nach Welle 3, K16 nach Welle 2. |

## 3. Konzeptliste

Spalte „Welle“: wann das Konzept spätestens fertig sein muss. Umfang des Konzepts selbst: S = klein (mehrere pro Session), M = mittel, L = groß (eine Session).

### A – Kern

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K01 | Kalender und Tagesablauf (**Entwurf**, Grundgerüst umgesetzt: `konzepte/K01-kalender.md`) | Tagesansicht, „Tag beenden“, Ereignisarten, Fristen, Erinnerungsregeln, spielfreie Tage, Länderspielpausen, englische Wochen | M | 1 |
| K02 | Zufall, Kalibrierung, Schwierigkeit (**Entwurf**: `konzepte/K02-zufall-kalibrierung.md`) | Zufall mit Seed, wie viel Zufall wo, Restwahrscheinlichkeit für Überraschungen, Zielwerte aus echter Statistik, Testskripte, Schwierigkeitsgrade ohne Schummeln | M | 1 |
| K03 | Spielermodell (**Entwurf**: `konzepte/K03-spielermodell.md`) | Fähigkeiten, Spezialitäten (gut/schlecht), versteckte Werte, Zustände (Frische, Kondition, Form, Selbstvertrauen, Stimmung, Integration, Spielpraxis), Alterskurven | L | 1 |
| K04 | Match-Engine (**Entwurf**: `konzepte/K04-engine.md`) | Minutenablauf, Chancentypen, Teamwerte mit abnehmendem Ertrag, Deckel für Einzelspieler (Torwart-Problem), Tagesform, Spielverlauf-Effekte, Ermüdung, Zielverteilungen | L | 1 |
| K33 | Daten, Spielstand, `regeln.js` (**Entwurf**, umgesetzt: `konzepte/K33-daten.md`) | Dateiaufbau, Stammdaten, Versionen des Spielstands, wie man an Werten schraubt, Daten-Update für neue Saisons | S | 1 |

### B – Sport

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K05 | Live-Spiel | Pause, Halbzeit mit Ansprache, Wechselregeln, Taktik im Spiel, Computer-Trainer, automatisches Anhalten | M | 2 |
| K06 | Taktik (**Entwurf**: `konzepte/K06-taktik.md`) | Grundordnungen, Spielstil-Kreislauf, Voraussetzungen, Vertrautheit, Gegneranalyse, Standards | M | 2 |
| K07 | Training (**Entwurf**: `konzepte/K07-training.md`) | Wochenplan, Einheitstypen, Intensität, Einzeltraining, Umschulung, Belastung und Regeneration, Trainingswirkung je Alter | M | 2 |
| K08 | Jugend und Talententwicklung | Nachwuchsleistungszentrum, Sichtung, Aufrücken, Volatilität, Prägungsereignisse (Schub oder Knacks), Belastungssteuerung, Leihe für Spielpraxis, Verheizen | M | 3 |
| K09 | Disziplin und Sportgericht | Foularten, Karten, Verfahren über mehrere Tage, Strafmaß mit Zufall, Widerspruch, Wiederholungstäter, Zuschauer-Vergehen, Verfahren wegen Äußerungen außerhalb des Spiels (zum Beispiel Schiedsrichterkritik, siehe K29) | M | 2 |
| K10 | Medizin und Verletzungen | Verletzungsarten und Dauer, Diagnose als Spanne, Reha, Rückfall, fit spritzen, medizinische Abteilung | S | 2 |
| K12a | Sommerpause und Vorbereitung (aus K12 vorgezogen, 7.11.) | Urlaub mit wählbarer Länge (2–4 Wochen), Trainingsauftakt, Leistungstests, Vorbereitungsplan; Wirkung über Frische und Kondition aus K03 | S | 2 |
| K11 | Freundschaftsspiele und Trainingslager | Gegner anfragen (je nach Beziehung), Einnahmen, Spielpraxis, Risiko, Turniere, Trainingslager-Orte | S | 2 |
| K13 | Wettbewerbe und Spielplan | Liga, Pokal, Relegation, Europapokal später, Länderspiele mit Abstellungen, Spieltage verlegen, englische Wochen | M | 2 |

### C – Menschen

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K14 | Stimmung, Selbstvertrauen, Kabine | Woraus sich die Stimmung zusammensetzt, Trägheit, Folgen, Führungsspieler, Ansteckung, Grüppchen. Dazu Beziehungen im Kader: Freundschaft, Rivalität um den Stammplatz, Landsleute und Sprache, Zimmerbelegung im Trainingslager | M | 3 |
| K15 | Gespräche und Ansprachen | Dialogsystem (Spieler, Kabine, Presse, Vorstand), Versprechen und ihre Überwachung, Glaubwürdigkeit, Abnutzung | M | 3 |
| K16 | Trainerstab und Mitarbeiter | Co-Trainer, Torwart-, Athletik- und Jugendtrainer, Scouts, Ärzte, Physios: Qualität, Gehalt, Verträge, eigene Persönlichkeit. Dazu **Automatik und Delegieren** für jeden Bereich, Genauigkeit der Vorhersagen in den Reglern | M | 2 |
| K17 | Beziehungsnetz | Beziehungswerte zwischen dir, Vereinen, Spielern, Beratern, Journalisten, Vorstand und Fans; was sie verändert; wofür sie zählen (Preise, Testspiele, Gerüchte, Hilfe) | M | 3 |

### D – Markt

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K18 | Scouting und Informationsnebel | Scout-Qualität und Spezialgebiete (Region, Jugend), Berichte mit Spanne oder „unbekannt“, Fehleinschätzungen, Kosten, Dauer | M | 3 |
| K19 | Transfers I | Transferliste, Anfrage, Angebot mit Runden, Konkurrenz, Spielergespräch, Medizincheck, Fenster, Leihen, Ausstiegsklauseln | L | 3 |
| K20 | Transfers II | Abwerben in Treffen über Wochen, Risiko des Auffliegens, Folgen über Beziehungen und Gerüchte, Bieterwettstreit, Deadline Day | L | 4 |
| K21 | Verträge und Gehälter | Laufzeit, Prämien, Klauseln, Gehaltsgefüge im Kader, Verlängerung, auslaufende Verträge, ablösefreie Wechsel | M | 3 |
| K22 | Berater | Profile (gierig, seriös, verschwiegen), Provision, Einfluss auf Verhandlung und Gerüchte, Beziehungen | S | 3 |
| K31 | Computer-Vereine | Kaderplan mit Planstellen, Bedarfsanalyse, Verkauf nur mit Grund und Ersatz (erst kaufen, dann verkaufen), Budget, Vereinsprofile, Trainerwechsel | L | 3 |

### E – Verein

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K12b | Saisonvorbereitung, Rahmen | Transferhauptphase, Sponsoren, Kampagnen, Termin fürs Saisonziel-Gespräch, Mannschaftsfoto/Saisoneröffnung | S | 4 |
| K23 | Finanzen und Budget | Einnahmen- und Ausgabenarten, Ratenzahlungen, Kredite, Budget vom Vorstand, Lizenzierung, Pleite-Szenario | M | 4 |
| K24 | Sponsoren | Trikot, Ausrüster, Bande, Stadionname: Angebote, Verhandlung, Prämien, Laufzeiten, Sponsor-Ereignisse | M | 4 |
| K25 | Marketing und Merchandising | Kampagnen (Dauerkarten, Trikot, Fanaktionen), Kosten und Wirkung, Fanshop, Rückwirkung auf Fans und Einnahmen | M | 4 |
| K26 | Stadion und Infrastruktur | Ausbau mit Planung, Genehmigung, Bauzeit und Bauverzögerung; Trainingsgelände, Nachwuchsleistungszentrum, Rasen, Flutlicht, Logen | M | 4 |
| K27 | Fans und Zuschauer | Nachfrage, Ticketpreise, Dauerkarten, Fanstimmung, Fangruppen, Choreografien, Pyrotechnik, Proteste | M | 4 |
| K28 | Vorstand, Ziele, Karriere | Saisonziel verhandeln, Vertrauen, Entlassung, Jobangebote, eigener Ruf als Trainer | S | 3 |

### F – Welt

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K29 | Medien und Presse (**Entwurf**: `konzepte/K29-medien-presse.md`, Gerüchteküche und Datenmodell fehlen noch) | erfundene Zeitungen und Portale mit Ruf, Pressekonferenzen, Interviews, Gerüchteküche (wahr, halb wahr, falsch), Wirkung auf Stimmung, Preise und Fans | M | 4 |
| K30 | Ereigniskarten und Story-Playbook | Aufbau eines Ereignisses (Auslöser, Bedingungen, Häufigkeit, Sperrzeit, Beteiligte, Texte, Entscheidungen, Folgen, Ketten), Dosierung, Katalog | L, wächst laufend | Gerüst 3, Inhalte fortlaufend |
| K32 | Spielwelt und Saisonwechsel | Stammdaten, Auslandsspieler als Transferpool, Karriereenden, neue Talente, Aufstieg und Abstieg, Datenpflege | M | Auslandspool 3, Rest 4 |
| K32a | Unterbau: 3. Liga und Regionalliga (**Entwurf**, umgesetzt: `konzepte/K32a-unterbau.md`) | 3. Liga als echte Liga, Regionalliga-Aufstieg per Los und Aufstiegsspielen, Relegation 2./3. Liga, Zweitmannschaften | S | ✅ vorgezogen |
| K34 | Statistik und Historie | Spieler- und Vereinsstatistik, Rekorde, Ehrungen, Saisonarchiv | S | 4 |

### G – Später

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K35a | Bedienkonzept und Regler (**Entwurf**: `konzepte/K35-oberflaeche.md`, Bausteine umgesetzt in `js/regler.js`) | Bildschirmliste, Regler-Baukasten (Anzeige, Trend, unscharf, Stell-Regler mit Vorhersage, Tauziehen), Schnellansicht, Meldungsdichte, Automatik-Stufen | M | **1** (Bausteine ab U1) |
| K35b | Look und Stil | Retro-Stil (eigenes Design: Anzeigetafel, Flutlicht, Mischpult), Themen, Bedienung auf dem Handy | M | 5 |

## 4. Erste Gedanken zu den neuen Punkten

Das sind Notizen, keine fertigen Konzepte.

### K01 – „Tag beenden“ und Erinnerungen

- **Ablauf:** Der Knopf „Tag beenden“ verarbeitet den heutigen Tag: Training, Meldungen, Fristen. Danach springt der Kalender zum nächsten Tag mit Ereignis, höchstens 7 Tage weit. Unterwegs verarbeitet er die übersprungenen Tage im Hintergrund.
- **Was als Ereignis zählt:**
  - Spiel
  - Frist (Angebot, Sportgericht, Transferfenster)
  - Gespräch angefragt
  - Bauabschnitt fertig
  - Ereigniskarte
  - Trainingslager-Anreise
  - Monatsabrechnung
- **Erinnerungsregeln** sind eine Liste von Prüfungen mit Priorität:
  - Spieltag: Aufstellung enthält Gesperrte oder Verletzte, oder wurde seit Ausfällen nicht angesehen.
  - Kein Trainingsplan für die Woche.
  - Spielfreie Woche ohne Testspiel.
  - Eine Frist läuft heute ab.
  - Ein Vertrag eines Stammspielers läuft aus, und das Transferfenster schließt bald.
  - Jede Regel ist abschaltbar.
- **Länderspielpause:** Nationalspieler fehlen. Sie kommen müde zurück, manchmal verletzt, manchmal mit Selbstvertrauen. Die Pause ist Zeit für Testspiele und Training.

### K03 – Fähigkeiten (Recherche-Stand)

> Ausgearbeitet in `konzepte/K03-spielermodell.md` (7.11.). Die Notizen hier bleiben als Herleitung stehen.

**Quelle: GameStar 4/2000, Entwickler-Tipps zu Anstoss 3 von Gerald Köhler (von dir hochgeladen).** Daraus geht hervor:

- **Stärke ist eine einzelne Zahl.**
  - Sie verändert sich in **zwei Auf- oder Abwertungsrunden pro Saison**. Die Chance hängt vom Alter ab: jung nur aufwärts, ab etwa 30 vor allem abwärts. Torhüter und Liberos bauen langsamer ab.
  - Talent wirkt mit. Den stärksten Einfluss hat die **Durchschnittsform**: Sehr gute Form vervielfacht die Chance auf +1, schlechte die auf −1.
- **Form** ist ein eigener Wert. Die Schwellen im Artikel liegen bei 6, 8, 12, 14 und 16, die Skala reicht also offenbar etwa bis 20.
- **Kondition und Frische** sind getrennte Werte. Konditionstraining kurz vor dem Spiel lässt die Mannschaft früher müde werden.
- **Fähigkeiten** sind erlernbare Merkmale mit Lernfortschritt pro Woche:
  - Je nach Schwierigkeit „leicht“, „mittel“ oder „schwer“.
  - Bremsen: Verletzung, gleichzeitiges Lernen einer anderen Fähigkeit, Urlaub, fehlendes Training.
- **Eigenschaften** beschreiben den Charakter, zum Beispiel „Integrationsfigur“ oder „Teenie-Star“ (mehr Trikotverkäufe, aber nur bei guter Form).
- **Beziehungen zwischen Spielern:**
  - Freundschaften und Konkurrenz um einen Stammplatz.
  - Ausländer lernen Deutsch langsamer, wenn sie mit Landsleuten zusammenstecken.
  - Das wirkt sich sogar auf die Zimmerbelegung im Trainingslager aus.
- **Weitere Ideen aus dem Artikel:**
  - Saisonziel mit dem Präsidium verhandeln.
  - Spieler mit auslaufendem Vertrag gehen unter Umständen ohne Vorwarnung.
  - Testspiel-Gegner sind erst ab der 3. Vorbereitungswoche verfügbar. Das Zuschauerinteresse an Testspielen lässt nach.
  - Fanwerbung lohnt sich langfristig. Ein Sponsorentag pro Saison bringt bessere Angebote.
  - Fanartikel-Sortiment, Platzwart (Haltbarkeit des Rasens), Spitzel (erfährt Beziehungen im Kader).
  - Bewusst weggelassen: Doping.

Für BMH habe ich keine verlässliche Quelle gefunden. Anstoss 2022 nutzt laut einem Test nur eine Handvoll Fähigkeiten (etwa Zweikampf, Pressing, Flanken) mit gut, neutral oder schlecht.

**Daraus zwei Varianten:**

| | A: klassisch (Anstoss-artig) | B: modern (viele Zahlenwerte) |
|---|---|---|
| Hauptwert | eine Stärke-Zahl | Gesamtstärke berechnet aus 8 Fähigkeiten (Torwartspiel, Zweikampf, Kopfball, Tempo, Technik, Passspiel, Flanken, Abschluss) |
| Besonderheiten | erlernbare Fähigkeiten als Merkmale mit Lernfortschritt | Spezialitäten zusätzlich möglich |
| Entwicklung | Auf- und Abwertungsrunden mit Würfel (Alter, Talent, Form) | kleine Schritte pro Trainingseinheit |
| Lesbarkeit | sehr hoch | mittel |
| Tiefe für Taktik | über Fähigkeiten wie „kopfballstark“ oder „schnell“ | direkt über die Zahlen |
| Balancing | leichter | schwerer |

**Mein Vorschlag: A mit einem Schuss B.**
- **Stärke** als Hauptzahl. Dazu **Form** (0–20), **Kondition**, **Frische**, **Selbstvertrauen** und **Stimmung**.
- **Erlernbare Fähigkeiten** mit Schwierigkeitsgrad und Lernfortschritt. Sie wirken gezielt in der Engine, zum Beispiel:
  - kopfballstark: Standards und Flanken
  - schnell: Konter
  - zweikampfstark: Mauern und Pressing
  - Spielmacher, Flankengeber, Torjäger, Weitschütze, Freistoß- und Elfmeterspezialist
  - Torwart: Reflexe, Strafraumbeherrscher, Elfmetertöter
  - „beidfüßig“
  - Joker
- **Eigenschaften** (Charakter, fest oder selten wechselnd):
  - positiv: Führungsspieler, Integrationsfigur, Publikumsliebling, Trainingsweltmeister, Kämpfer
  - negativ: Hitzkopf, Diva, verletzungsanfällig, nervenschwach, Partylöwe
- **Beziehungen im Kader:** Freundschaft, Rivalität, Landsleute und Sprache.
- **Entwicklung der Stärke** über Auf- und Abwertungsrunden, häufiger als zweimal pro Saison, zum Beispiel monatlich mit kleineren Chancen. Die Wahrscheinlichkeit hängt ab von Alter, Talent, Durchschnittsform, Training und Spielpraxis. Bei jungen Spielern ist die Schwankung nach oben und unten größer (K08).

### K08 – Jugend und Verheizen

- **Entwicklung:** Unter 21 Jahren wirken Lernrate und Zufall stärker, nach oben wie nach unten.
- **Prägungsereignisse**, etwa das Debüt, das erste Topspiel, ein schwerer Fehler oder ein Siegtor:
  - Die Wirkung wird gewürfelt, abhängig von Druckresistenz, eigener Note, Spielausgang und deinem Umgang danach (schützen, loben, kritisieren, Presse abschirmen).
  - Mögliche Folgen: Durchbruch (Selbstvertrauen und Entwicklungstempo steigen), nichts, oder Knacks (Entwicklung stockt für Wochen oder Monate).
- **Verheizen:** Zu viele Minuten, zu viel Druck oder Dauerkritik erhöhen das Risiko für Knacks, Verletzung und Stimmungsabsturz. Eine Leihe kann Spielpraxis geben, ohne diesen Druck.

### K17 und K30 – Beziehungen und Ereigniskarten

- **Beziehungswerte** von −100 bis +100 zwischen Akteuren. Abwerben, Streit und Gerüchte senken sie, Hilfe, faire Deals und Testspiele heben sie.
- **Schlechte Beziehungen** bedeuten: höhere Preise, Absagen, mehr negative Gerüchte, Sticheleien in der Presse, mehr Brisanz in Spielen gegeneinander.
- **Eine Ereigniskarte** besteht aus:
  - Auslöser und Bedingungen
  - Häufigkeit mit Sperrzeit
  - Beteiligten
  - Textvarianten
  - 1–3 Entscheidungen
  - sofortigen und verzögerten Folgen
  - optionalen Folgekarten (Ketten)
- **Dosierung:** etwa eine kleine Karte pro Woche, eine große pro Monat, als Stellschraube in `regeln.js`.
- **Erste Kartenideen:**
  - Zwei Vereine streiten um einen Spieler, mit dem Lachender-Dritter-Ausgang aus deinem Beispiel.
  - Ein entfernter Verwandter kennt den Berater.
  - Ein Spieler heiratet, Teamausflug gefällig?
  - Heimweh eines Neuzugangs.
  - Der Rasen ist nach Frost kaputt, Heimspiel in Gefahr.
  - Ein Lokalreporter hat eine Fehde mit dir.
  - Ein Talent kommt zum Probetraining.
  - Ein Altstar will ein Comeback.
  - Ein anderer Verein will dich als Trainer.
  - Der Sponsor gerät in einen Skandal.
  - Fan-Choreo zum Jubiläum.

## 5. Umsetzung in Wellen

| Welle | Konzepte | Umsetzungsschritte | Ergebnis |
|---|---|---|---|
| 1 Fundament | K01, K02, K03, K04, K33, K35a | ✅ U1 (6.11.): Aufteilung in Dateien, `regeln.js`, Zufall mit Seed, Tageskalender, Regler-Bausteine, Tests. U2: neues Spielermodell mit Startwerten aus den Wikipedia-Kadern. U3: Engine v2 mit Kalibrierung, Torwart-Test bestanden | ein spielbarer Stand mit glaubwürdigen Ergebnissen und dem Kalender-Ablauf |
| 2 Sport | K05–K07, K09–K11, K12a, K13, K16 | U4: Live-Spiel. U5: Taktik. U6: Training, Sommer und Vorbereitung, Trainerstab mit Automatik. U7: Disziplin, Medizin, Testspiele, Spielplan | Spieltage mit Eingreifen, Training mit Wirkung, Sportgericht |
| 3 Menschen und Markt | K08, K14, K15, K17–K19, K21, K22, K28, K31, Gerüst von K30, Auslandspool aus K32 | U8: Stimmung und Gespräche. U9: Scouting, Auslandspool und Jugend. U10: Transfers I, Verträge und Berater. U11: Computer-Vereine. U12: Beziehungen, Vorstand und Ereignis-Gerüst | Transfers als Prozess, sinnvolle Computer-Vereine, erste Ereigniskarten |
| 4 Verein und Welt | K12b, K20, K23–K27, K29, K32 (Rest), K34 | U13 bis U18 nach Bedarf | Saisonvorbereitung, Sponsoren, Marketing, Stadion, Fans, Presse, Abwerben |
| 5 Oberfläche | K35b | U19 und folgende | eigener Retro-Look |

## 6. Aufwand (grob, ehrlich)

- **Konzepte:** 36 Stück (K01–K35, K35 geteilt in K35a und K35b). Davon sind 7 klein, 23 mittel und 6 groß. Das sind grob 12–15 Konzept-Sessions, das Ereignis-Playbook wächst danach weiter.
- **Umsetzung:** etwa 19 oder mehr Schritte, große eventuell doppelt, also grob 20–30 Sessions.
- **Tokenkosten** kann ich vorher nicht verlässlich beziffern. Nach der ersten Konzept-Session und nach U1 sieht man den Verbrauch in der Nutzungsanzeige und kann hochrechnen.
- **Sparen:**
  - neue Session pro Schritt
  - nur betroffene Dateien lesen
  - Tests als Skripte im Repo
  - Konzepte knapp und konkret halten

## 7. Nächster Schritt

**U1 ist umgesetzt** (6. November 2026), dazu am 6./7. November nach deinen Entscheidungen: Der Sommer wird gespielt, die Spieltage folgen dem offiziellen Spielplan 2026/27 mit Anstoßzeiten, die 3. Liga ist eine echte Liga, und aus der Regionalliga steigen Vereine mit etwas Zufall auf (K32a). Alle Testskripte in `tests/` sind grün. Offene Fragen stehen am Ende von K01, K32a und K33.

1. **K03 steht als Entwurf** (7.11.): `konzepte/K03-spielermodell.md`. Alle Fragen sind entschieden (7.11.). Offen ist nur die Recherche nach einer Datenquelle für feine Positionen, Fuß und Charakter-Fakten.
2. **K04 steht als Entwurf** (7.11., ohne Rücksprache geschrieben): `konzepte/K04-engine.md`. Sechs vorläufige Entscheidungen in Abschnitt 12 bitte bestätigen oder ändern.
3. **K02 steht als Entwurf** (7.11., ohne Rücksprache): `konzepte/K02-zufall-kalibrierung.md`. Vier vorläufige Entscheidungen in Abschnitt 12, die wichtigste: Zufall getrennt nach Spiel, Tag und Bereich, damit Neuladen kein neues Glück bringt.
4. **Alle Konzepte der Welle 1 stehen.** Nächster Schritt ist die Umsetzung, jeweils in einer neuen Session:
   - **U2 Spielermodell** (K03, Teile von K02): Zufallsströme und Node-Simulator `tests/sim.js` zuerst, dann neue Spielerfelder, Positionen und Fuß (bis die Daten da sind, per Zufall aus der Gruppe), Frische und Kondition getrennt, Entwicklung an jedem Spieltag, Merkmale und Persönlichkeit mit Startverteilung, Talentsterne unscharf, Spielerkarte mit den neuen Reglern, `tests/spielermodell.js`. Die heutige Engine bleibt, bekommt nur Frische statt Fitness und Form 0–20.
   - **U3 Engine v2** (K04, Rest von K02): Szenen-Modell, Teamwerte aus Positionsanteilen, Chancentypen, Standards, Merkmal-Haken, Noten gegen die Erwartung, Spielbericht, Lernen im Spiel, Schwierigkeitsstufen, `tests/kalibrierung.js` und `tests/akzeptanz.js`, Kalibrierung bis alles grün ist.
   - Startsatz: „Projekt Flutlicht Manager im Ordner flutlicht-manager/. Lies PLAN.md, konzepte/_konsistenzpruefung.md, konzepte/K02-zufall-kalibrierung.md und konzepte/K03-spielermodell.md. Setze U2 um.“
5. **Vorgezogen aus Welle 2:** K06 (Taktik) und K07 (Training) stehen als Entwurf. K06 weil es offene Punkte aus K03 und K04 klärt (Grundordnungen auf 14 Positionen, Seiten, Standardschützen). U3 kann die Grundordnungen und Seiten gleich mitbauen. K07 ersetzt die Trainingsstufen durch Wochenpläne nach Abstand zum Spiel und kommt mit U6.
4. Der Sommerteil von K12 ist als **K12a** in Welle 2 gerückt, zu Training (K07) und Testspielen/Trainingslager (K11).

Mit K03 ist der größte Engpass gelöst. Engine, Taktik, Training und Scouting haben jetzt eine Grundlage (K03 §9).
