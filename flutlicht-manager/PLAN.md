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
8. Die Konsistenzprüfung steht in `konzepte/_konsistenzpruefung.md`: Widersprüche, Lücken, Abhängigkeiten, Zuständigkeiten und offene Entscheidungen. Bei jedem neuen Konzept fortschreiben. Alle vorläufigen Entscheidungen zum Abhaken stehen in `konzepte/_offene-entscheidungen.md`.
9. **„Weiter, entscheide du“** (8.11.): Sagst du das, trifft Claude offene Fragen selbst (beste Antwort, im Zweifel recherchiert), markiert sie als vorläufig und arbeitet ohne Anhalten weiter, bis die Aufgabe oder das Budget erschöpft ist. Vorläufige Entscheidungen gelten, bis du widersprichst.
10. **Gespielt wird erst die fertige Alpha** (7.11.). Bis dahin müssen Spielstände nicht zwischen Versionen umgewandelt werden, und die Reihenfolge im Plan darf sich ändern, wenn das den Bau einfacher oder stimmiger macht.

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
| **Ausland** (8.11.) | International muss kommen: echte Namen der Auslandsvereine, Spieler und Kader erzeugt das Spiel. Gepflegt werden nur die Vereinsnamen (K32). |
| **Meldungsdichte** (5.11.) | 2–4 Stopps pro Woche mit Entscheidung, alles andere landet im Posteingang. Dazu ein Regler in den Einstellungen. |
| **Spieltage** (6.11.) | über das Wochenende verteilt wie in echt, nach dem offiziellen Spielplan 2026/27 (OpenLigaDB) mit Anstoßzeiten. Samstag 15:30 bleibt die Konferenz, der letzte Spieltag läuft zeitgleich. |
| **Unterbau** (6.11.) | 3. Liga mit 20 echten Vereinen als vollständige Liga, Regionalliga als Pool mit gelosten Meistern und Aufstiegsspielen („etwas Zufall“). Konzept K32a. |
| **Alte Spielstände** (6.11.) | aus Testversionen sind Müll und werden gelöscht. |
| **Verletzungen** (9.11.) | Die realistische Häufigkeit seit U7b bleibt (etwa 40 je Team und Saison, im Schnitt fehlen 8 % des Kaders). Stab (Physiotherapeut, Arzt, Athletiktrainer) und später das Reha-Zentrum sollen sie spürbar drücken können. |
| **Einstieg mit Lernstufen** (9.11.) | Die erste Saison lässt sich mit einem Teil der Funktionen spielen. Wer etwas verstanden hat, steigt eine Stufe auf, und neue Möglichkeiten kommen dazu. Beispiele: Aufstellung gibt es ab Stufe 1, Taktik zuerst einfach und später ausführlicher, das Sportgericht erst auf einer höheren Stufe. Die Stufen lassen sich abschalten, dann ist sofort alles frei. Muss gut durchdacht sein: Konzept K36, erste Gedanken in §4. |
| **Bankzeit nach Grund** (10.11.) | Nicht die Minuten allein zählen, sondern der Grund: Rotation wegen Frische ist keine Abwertung, ein Joker-Tor oder ein starker Kurzeinsatz macht zufrieden. Spielt der direkte Rivale, führt das auf Dauer zur Abwertung (anfangs je nach Typ auch ein Motivationsschub). Für unerfahrene Spieler ist schon die Bank positiv, 10 Minuten Einsatz sehr positiv. Der Ersatztorwart wird nicht abgewertet, außer er ist so stark wie die Nummer 1. Dazu habe ich weitere Fälle durchdacht (Aufbau nach Verletzung, Formkrise, Tribüne, frühe Auswechslung, Vertragsjahr, teurer Neuzugang und andere). Erst in den Plan, noch nicht bauen: K14 §12 „Bankzeit nach Grund“, vorgemerkt als U8d. |
| **Gutes Personal in jedem Bereich** (10.11.) | Für alles lohnt es sich, gute Leute einzustellen, auch für Verhandlungen: Sportdirektor mit Verhandlungsgeschick und Netzwerk, Kaderplaner, Marketingleiter, Greenkeeper. Kontakte zu Beratern bringen bessere Deals, so wie der Sponsorentag bessere Sponsoren. Konzepte K16 §12, K22 §12, K24, K26 (ergänzt). |
| **Die Reichen werden reicher** (10.11.) | Wie in der echten Liga: Bayern holt man praktisch nie ein, mithalten geht manchmal. Die besten Spieler und Mitarbeiter wollen zu den großen Vereinen. Als Folge der Regeln, ohne Zuschlag (kein Gummiband). **Mit Maß:** Der Größte holt etwa zwei Drittel der Titel, nicht 13 von 14. Nach 30 und mehr Jahren dürfen sich die Verhältnisse verschieben, wie bei Gladbach, dem HSV und Dortmund. K02 §5.3a mit Kalibrierziel. |
| **Vertragsverhandlungen** (10.11.) | Echte Verhandlungen mit Prämien: Auflauf-, Punkt-, Tor- und Zu-Null-Prämie, Aufstiegs-, Klassenerhalts- und Titelprämie, Ligaklausel für Ab- und Aufstieg, Handgeld, Klauseln. Konzept K21 (ergänzt), gebaut mit U10. |
| **Europapokal** (5.11., ergänzt 10.11.) | später als Erweiterung, zuerst 1. und 2. Liga und Pokal. **Langfristig fest eingeplant:** Champions League, Europa League und Conference League, weil die internationalen Einnahmen den Vorsprung der Großen erst erklären. Konzept K37, bis dahin eine Pauschale für die Europapokal-Plätze (K23). |
| **Vorläufig übernommen** (Vorschläge aus der Konsistenzprüfung, gelten, solange du nichts anderes sagst) | Automatik und Delegieren in jedem Bereich über den Stab. Nichts wegnehmen, bevor der Ersatz fertig ist. K08 und der Auslandspool nach Welle 3, K16 nach Welle 2. |

## 3. Konzeptliste

Spalte „Welle“: wann das Konzept spätestens fertig sein muss. Umfang des Konzepts selbst: S = klein (mehrere pro Session), M = mittel, L = groß (eine Session).

### A – Kern

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K01 | Kalender und Tagesablauf (**Entwurf**, Grundgerüst umgesetzt: `konzepte/K01-kalender.md`) | Tagesansicht, „Tag beenden“, Ereignisarten, Fristen, Erinnerungsregeln, spielfreie Tage, Länderspielpausen, englische Wochen | M | 1 |
| K02 | Zufall, Kalibrierung, Schwierigkeit (**Entwurf**: `konzepte/K02-zufall-kalibrierung.md`) | Zufall mit Seed, wie viel Zufall wo, Restwahrscheinlichkeit für Überraschungen, Zielwerte aus echter Statistik, Testskripte, Schwierigkeitsgrade ohne Schummeln | M | 1 |
| K03 | Spielermodell (**abgestimmt** 7.11., alle Fragen beantwortet: `konzepte/K03-spielermodell.md`) | Fähigkeiten, Spezialitäten (gut/schlecht), versteckte Werte, Zustände (Frische, Kondition, Form, Selbstvertrauen, Stimmung, Integration, Spielpraxis), Alterskurven | L | 1 |
| K04 | Match-Engine (**Entwurf**: `konzepte/K04-engine.md`) | Minutenablauf, Chancentypen, Teamwerte mit abnehmendem Ertrag, Deckel für Einzelspieler (Torwart-Problem), Tagesform, Spielverlauf-Effekte, Ermüdung, Zielverteilungen | L | 1 |
| K33 | Daten, Spielstand, `regeln.js` (**Entwurf**, umgesetzt: `konzepte/K33-daten.md`) | Dateiaufbau, Stammdaten, Versionen des Spielstands, wie man an Werten schraubt, Daten-Update für neue Saisons | S | 1 |
| K36 | Einstieg mit Lernstufen (**Entwurf** 9.11.: `konzepte/K36-lernstufen.md`, Gedanken in §4) | Stufenleiter, was auf welcher Stufe frei ist, Aufstieg nach Verständnis statt nach Zeit, Automatik für gesperrte Bereiche, Aufstiegsmoment mit Erklärung, Aus-Schalter, „jetzt freischalten“ | M | 2b |
| K37 | Europapokal: Champions League, Europa League, Conference League (**Idee** 10.11., erste Gedanken in §4) | Qualifikation über Liga und Pokal, Ligaphase und K.-o.-Runden, Auslandsgegner aus K32, Prämien und Marktpool als Geld, Belastung durch englische Wochen, Ansehen, UEFA-Koeffizient | L | 4b |

### B – Sport

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K05 | Live-Spiel (**Entwurf**: `konzepte/K05-live-spiel.md`) | Pause, Halbzeit mit Ansprache, Wechselregeln, Taktik im Spiel, Computer-Trainer, automatisches Anhalten | M | 2 |
| K06 | Taktik (**Entwurf**: `konzepte/K06-taktik.md`) | Grundordnungen, Spielstil-Kreislauf, Voraussetzungen, Vertrautheit, Gegneranalyse, Standards | M | 2 |
| K07 | Training (**Entwurf**: `konzepte/K07-training.md`) | Wochenplan, Einheitstypen, Intensität, Einzeltraining, Umschulung, Belastung und Regeneration, Trainingswirkung je Alter | M | 2 |
| K08 | Jugend und Talententwicklung (**Entwurf**: `konzepte/K08-jugend.md`) | Nachwuchsleistungszentrum, Sichtung, Aufrücken, Volatilität, Prägungsereignisse (Schub oder Knacks), Belastungssteuerung, Leihe für Spielpraxis, Verheizen | M | 3 |
| K09 | Disziplin und Sportgericht (**Entwurf**: `konzepte/K09-sportgericht.md`) | Foularten, Karten, Verfahren über mehrere Tage, Strafmaß mit Zufall, Widerspruch, Wiederholungstäter, Zuschauer-Vergehen, Verfahren wegen Äußerungen außerhalb des Spiels (zum Beispiel Schiedsrichterkritik, siehe K29) | M | 2 |
| K10 | Medizin und Verletzungen (**Entwurf**: `konzepte/K10-medizin.md`) | Verletzungsarten und Dauer, Diagnose als Spanne, Reha, Rückfall, fit spritzen, medizinische Abteilung | S | 2 |
| K12a | Sommerpause und Vorbereitung (aus K12 vorgezogen, 7.11.; **Entwurf**: `konzepte/K12a-sommer.md`) | Urlaub mit wählbarer Länge (2–4 Wochen), Trainingsauftakt, Leistungstests, Vorbereitungsplan; Wirkung über Frische und Kondition aus K03 | S | 2 |
| K11 | Freundschaftsspiele und Trainingslager (**Entwurf**: `konzepte/K11-testspiele.md`) | Gegner anfragen (je nach Beziehung), Einnahmen, Spielpraxis, Risiko, Turniere, Trainingslager-Orte | S | 2 |
| K13 | Wettbewerbe und Spielplan (**Entwurf**: `konzepte/K13-wettbewerbe.md`) | Liga, Pokal, Relegation, Europapokal später, Länderspiele mit Abstellungen, Spieltage verlegen, englische Wochen | M | 2 |

### C – Menschen

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K14 | Stimmung, Selbstvertrauen, Kabine (**Entwurf**, umgesetzt in U8: `konzepte/K14-kabine.md`) | Woraus sich die Stimmung zusammensetzt, Trägheit, Folgen, Führungsspieler, Ansteckung, Grüppchen. Dazu Beziehungen im Kader: Freundschaft, Rivalität um den Stammplatz, Landsleute und Sprache, Zimmerbelegung im Trainingslager | M | 3 |
| K15 | Gespräche und Ansprachen (**Entwurf**, umgesetzt in U8: `konzepte/K15-gespraeche.md`) | Dialogsystem (Spieler, Kabine, Presse, Vorstand), Versprechen und ihre Überwachung, Glaubwürdigkeit, Abnutzung | M | 3 |
| K16 | Trainerstab und Mitarbeiter (**Entwurf**: `konzepte/K16-stab.md`) | Co-Trainer, Torwart-, Athletik- und Jugendtrainer, Scouts, Ärzte, Physios: Qualität, Gehalt, Verträge, eigene Persönlichkeit. Dazu **Automatik und Delegieren** für jeden Bereich, Genauigkeit der Vorhersagen in den Reglern | M | 2 |
| K17 | Beziehungsnetz (**Entwurf**: `konzepte/K17-beziehungen.md`) | Beziehungswerte zwischen dir, Vereinen, Spielern, Beratern, Journalisten, Vorstand und Fans; was sie verändert; wofür sie zählen (Preise, Testspiele, Gerüchte, Hilfe) | M | 3 |

### D – Markt

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K18 | Scouting und Informationsnebel (**Entwurf**: `konzepte/K18-scouting.md`) | Scout-Qualität und Spezialgebiete (Region, Jugend), Berichte mit Spanne oder „unbekannt“, Fehleinschätzungen, Kosten, Dauer | M | 3 |
| K19 | Transfers I (**Entwurf**: `konzepte/K19-transfers.md`) | Transferliste, Anfrage, Angebot mit Runden, Konkurrenz, Spielergespräch, Medizincheck, Fenster, Leihen, Ausstiegsklauseln | L | 3 |
| K20 | Transfers II (**Entwurf**: `konzepte/K20-transfers-2.md`) | Abwerben in Treffen über Wochen, Risiko des Auffliegens, Folgen über Beziehungen und Gerüchte, Bieterwettstreit, Deadline Day | L | 4 |
| K21 | Verträge und Gehälter (**Entwurf**, ergänzt 10.11. um Prämien und Ligaklausel: `konzepte/K21-vertraege.md`) | Laufzeit, Prämien (Auflauf, Punkte, Tore, Auf- und Abstieg), Klauseln, Gehaltsgefüge im Kader, Verlängerung, auslaufende Verträge, ablösefreie Wechsel | M | 3 |
| K22 | Berater (**Entwurf**: `konzepte/K22-berater.md`) | Profile (gierig, seriös, verschwiegen), Provision, Einfluss auf Verhandlung und Gerüchte, Beziehungen | S | 3 |
| K31 | Computer-Vereine (**Entwurf**: `konzepte/K31-computer-vereine.md`) | Kaderplan mit Planstellen, Bedarfsanalyse, Verkauf nur mit Grund und Ersatz (erst kaufen, dann verkaufen), Budget, Vereinsprofile, Trainerwechsel | L | 3 |

### E – Verein

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K12b | Saisonvorbereitung, Rahmen (**Entwurf**: `konzepte/K12b-saisonvorbereitung.md`) | Transferhauptphase, Sponsoren, Kampagnen, Termin fürs Saisonziel-Gespräch, Mannschaftsfoto/Saisoneröffnung | S | 4 |
| K23 | Finanzen und Budget (**Entwurf**: `konzepte/K23-finanzen.md`) | Einnahmen- und Ausgabenarten, Ratenzahlungen, Kredite, Budget vom Vorstand, Lizenzierung, Pleite-Szenario | M | 4 |
| K24 | Sponsoren (**Entwurf**: `konzepte/K24-sponsoren.md`) | Trikot, Ausrüster, Bande, Stadionname: Angebote, Verhandlung, Prämien, Laufzeiten, Sponsor-Ereignisse | M | 4 |
| K25 | Marketing und Merchandising (**Entwurf**: `konzepte/K25-marketing.md`) | Kampagnen (Dauerkarten, Trikot, Fanaktionen), Kosten und Wirkung, Fanshop, Rückwirkung auf Fans und Einnahmen | M | 4 |
| K26 | Stadion und Infrastruktur (**Entwurf**: `konzepte/K26-stadion.md`) | Ausbau mit Planung, Genehmigung, Bauzeit und Bauverzögerung; Trainingsgelände, Nachwuchsleistungszentrum, Rasen, Flutlicht, Logen | M | 4 |
| K27 | Fans und Zuschauer (**Entwurf**: `konzepte/K27-fans.md`) | Nachfrage, Ticketpreise, Dauerkarten, Fanstimmung, Fangruppen, Choreografien, Pyrotechnik, Proteste | M | 4 |
| K28 | Vorstand, Ziele, Karriere (**Entwurf**: `konzepte/K28-vorstand.md`) | Saisonziel verhandeln, Vertrauen, Entlassung, Jobangebote, eigener Ruf als Trainer | S | 3 |

### F – Welt

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K29 | Medien und Presse (**Entwurf**, mit Gerüchteküche und Datenmodell seit 8.11.: `konzepte/K29-medien-presse.md`) | erfundene Zeitungen und Portale mit Ruf, Pressekonferenzen, Interviews, Gerüchteküche (wahr, halb wahr, falsch), Wirkung auf Stimmung, Preise und Fans | M | 4 |
| K30 | Ereigniskarten und Story-Playbook (**Gerüst als Entwurf**: `konzepte/K30-ereigniskarten.md`) | Aufbau eines Ereignisses (Auslöser, Bedingungen, Häufigkeit, Sperrzeit, Beteiligte, Texte, Entscheidungen, Folgen, Ketten), Dosierung, Katalog | L, wächst laufend | Gerüst 3, Inhalte fortlaufend |
| K32 | Spielwelt und Saisonwechsel (**Entwurf**: `konzepte/K32-spielwelt.md`, mit Auslandspool) | Stammdaten, Auslandsspieler als Transferpool, Karriereenden, neue Talente, Aufstieg und Abstieg, Datenpflege | M | Auslandspool 3, Rest 4 |
| K32a | Unterbau: 3. Liga und Regionalliga (**Entwurf**, umgesetzt: `konzepte/K32a-unterbau.md`) | 3. Liga als echte Liga, Regionalliga-Aufstieg per Los und Aufstiegsspielen, Relegation 2./3. Liga, Zweitmannschaften | S | ✅ vorgezogen |
| K34 | Statistik und Historie (**Entwurf**: `konzepte/K34-statistik.md`) | Spieler- und Vereinsstatistik, Rekorde, Ehrungen, Saisonarchiv | S | 4 |

### G – Später

| ID | Konzept | Kernfragen | Umfang | Welle |
|---|---|---|---|---|
| K35a | Bedienkonzept und Regler (**Entwurf**: `konzepte/K35-oberflaeche.md`, Bausteine umgesetzt in `js/regler.js`) | Bildschirmliste, Regler-Baukasten (Anzeige, Trend, unscharf, Stell-Regler mit Vorhersage, Tauziehen), Schnellansicht, Meldungsdichte, Automatik-Stufen | M | **1** (Bausteine ab U1) |
| K35b | Look und Stil (**Entwurf**: `konzepte/K35b-look.md`) | Retro-Stil (eigenes Design: Anzeigetafel, Flutlicht, Mischpult), Themen, Bedienung auf dem Handy | M | 5 |

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

### K36 – Einstieg mit Lernstufen (9.11.)

Ich halte die Idee für richtig. Das Spiel hat schon jetzt viele Stellschrauben (Stil, Rollen, Schützen, Einstellung, Trainingsvorlagen, Stab, Sportgericht), und es werden mehr. Grundsätze für das Konzept:

1. **Gesperrt heißt automatisch, nicht abgeschaltet.** Was du noch nicht steuern kannst, erledigt der Stab nach denselben Regeln wie bei den Computer-Vereinen: Der Co-Trainer wählt die Trainingsvorlage, der Verein nimmt Strafanträge an, der Computer-Trainer wechselt im Spiel. Die Simulation ist mit und ohne Lernstufen gleich, es wächst nur, was du selbst entscheidest. So entsteht kein Nachteil gegenüber den Computer-Vereinen und kein zweites Regelwerk. Das passt zu „Automatik und Delegieren in jedem Bereich über den Stab“ (§2) und zu „Schwierigkeit ohne Schummeln“ (K02).
2. **Aufstieg nach Verständnis, nicht nur nach Zeit:** eine Mindestzeit (zum Beispiel einige Spieltage) plus Nutzung. Beispiel: Du hast die Aufstellung selbst geändert, ein Spiel live verfolgt und einmal gewechselt. Wer schneller will, schaltet die nächste Stufe sofort frei.
3. **Aufstiegsmoment:** eine kurze Karte. Sie sagt, was neu ist, wo es steht und was der Stab bisher dafür gemacht hat. Dazu auf Wunsch eine kleine Aufgabe.
4. **Abschalten:** beim Spielstart wählbar und jederzeit in den Einstellungen, dann ist sofort alles frei. Wieder einschalten nur bei einem neuen Spiel, weil es Möglichkeiten wegnehmen würde.
5. **Bereiche werden zuerst einfach, dann ausführlicher.** Beispiel Taktik: Stufe 1 Formation und Ausrichtung in drei Stufen, Stufe 2 Spielstile, Stufe 3 Rollen, Standardschützen, fünf Stufen der Ausrichtung und Einstellung.
6. **Grobe Leiter (Vorschlag, im Konzept zu prüfen):**
   - Stufe 1: Aufstellung, Formation, einfache Ausrichtung, Spiel live mit Wechseln, Kader, Tabelle.
   - Stufe 2: Spielstile, Zurufe und Ansprache, Trainingsvorlagen, Transfers.
   - Stufe 3: Rollen und Schützen, Einzeltraining und Umschulung, Trainerstab, Verträge, Sommer und Testspiele.
   - Stufe 4: Sportgericht, Medizin (fit spritzen), Stadion, Sponsoren, Scouting im Detail.
   - Stufe 5: Presse, Beziehungen, Entscheidungen aus Ereigniskarten, alles Übrige.

   Die Namen könnten den DFB-Trainerlizenzen folgen (Teamleiter, C, B, A, Pro), das ist nur eine Idee.
7. **Halte und Meldungen:** Gesperrte Bereiche erzeugen keine Halte. Im Posteingang steht nur eine Zeile, zum Beispiel „Der Verein hat die Strafe angenommen“.
8. **Technik:** Jede Funktion bekommt in `regeln.js` die Stufe, ab der sie frei ist. Die Oberfläche fragt nur `frei(bereich)` ab. Die Tests laufen mit Lernstufen an und aus. Ab sofort notiere ich bei jedem Umsetzungsschritt, ab welcher Stufe die neue Funktion frei sein soll.

**Mit dir entschieden (9.11. mittags):** Die Stufen heißen wie die Trainerlizenzen (Teamleiter, C-Lizenz, B-Lizenz, A-Lizenz, Pro-Lizenz). In der ersten Saison sind 2–3 Stufen erreichbar, alles ist nach zwei bis drei Saisons frei. Überspringen und Abschalten gehen jederzeit. Noch offen: Kommt Stufe 2 auch ohne jede Nutzung allein nach Zeit? **Vorläufig ja, spätestens nach 12 Pflichtspielen** (K36 §12 Nr. 1).

> Ausgearbeitet in `konzepte/K36-lernstufen.md` (Entwurf, 9.11.): Lizenz je Funktion (§5.2), Aufstieg mit Mindestzeit, Aufgaben und spätester Zeit (§5.3), A frühestens in der zweiten, Pro frühestens nach der zweiten Saison. Abweichung von der Leiter oben: Stadion und Kredit kommen mit der Pro-Lizenz, damit sie bis Welle 4 nicht leer ist. Im Spiel heißen die Stufen „Lizenz“, weil „Stufe“ schon für Schwierigkeit und Wechselwunsch steht.

### K37 – Europapokal (10.11.)

Erste Gedanken, kein Konzept:

- **Warum er kommen muss:** Ohne internationale Einnahmen passt das Geld nicht. In der Champions League bekommt jeder Teilnehmer 2025/26 18,62 Mio. € Startgeld und 2,1 Mio. € je Sieg in der Ligaphase, ein Sieger weit über 100 Mio. €. Das ist der größte Treiber des Vorsprungs der Großen (K02 §5.3a).
- **Drei Wettbewerbe** mit Ligaphase und K.-o.-Runden nach dem echten Modus seit 2024/25. Die Startplätze ergeben sich aus Bundesliga-Platz und Pokalsieg, nach den UEFA-Regeln der jeweiligen Saison (im Konzept prüfen, auch die zusätzlichen Plätze über die Fünfjahreswertung).
- **Gegner:** Auslandsvereine mit echten Namen und erzeugten Kadern aus K32. Ihre Stärke braucht eine eigene Kalibrierung, sonst wird die Bundesliga zu stark oder zu schwach.
- **Folgen:** Geld (K23), Ansehen (K28, K32), mehr Spiele und englische Wochen (K01, K07, K12a: Belastung, Rotation, Verletzungen), Anziehung für Spieler (K19), Auslosungen als Moment (wie der Pokal, K13), ein UEFA-Koeffizient für Deutschland.
- **Lernstufen (K36):** Spiele und Auslosungen sind ab Teamleiter dabei, Entscheidungen wie überall nach ihrer Lizenz.
- **Bis dahin:** Pauschale für die Europapokal-Plätze (K23), ohne zusätzliche Spiele.

## 5. Umsetzung in Wellen

| Welle | Konzepte | Umsetzungsschritte | Ergebnis |
|---|---|---|---|
| 1 Fundament | K01, K02, K03, K04, K33, K35a | ✅ U1 (6.11.): Aufteilung in Dateien, `regeln.js`, Zufall mit Seed, Tageskalender, Regler-Bausteine, Tests. U2 (8.11., läuft): ✅ U2a Zufallsströme und Simulator, ✅ U2b Frische, Kondition, Form, Spielpraxis, Entwicklung je Spieltag, ✅ U2c Persönlichkeit, Eigenschaften, Merkmale mit Lernen, feine Positionen, Fuß, unscharfe Talentsterne. U3 (8.11., läuft): ✅ Engine v2 mit Szenen, Seiten, Standards und Kalibrierung (`tests/kalibrierung.js`), ✅ Lernen im Spiel, Altersverlust, Lernplätze, alle wirksamen Merkmale sichtbar, ✅ Akzeptanztests mit Torwart-Test (`tests/akzeptanz.js`), ✅ Schwierigkeitsgrade. **U3 fertig.** | ein spielbarer Stand mit glaubwürdigen Ergebnissen und dem Kalender-Ablauf |
| 2 Sport | K05–K07, K09–K11, K12a, K13, K16 | U4 (8.11.): ✅ U4a Engine als Minuten-Zustand mit Bank, Wechseln, Taktik, Zurufen, Ansprache und Computer-Trainer (`tests/live.js`), ✅ U4b Live-Ansicht mit Eingriffen, Halbzeit, automatischen Halten, ✅ U4c Konferenz nach Anstoßzeit, Fortsetzen nach Neuladen, Elfmeterschießen Schuss für Schuss. **U4 fertig.** U5 (8.11.): ✅ U5a Spielstile mit Kreislauf und Umsetzung, Vertrautheit, Einstellung, Rollen, Schützen, Computer-Trainer (`tests/taktik.js`), ✅ U5b Oberfläche (Stil, Einstellung, Rollen, Schützen, Umsetzung, Vertrautheit, Gegneranalyse, Stil im Live-Spiel). **U5 fertig.** U5: Taktik. U6 (8.11.–9.11.): ✅ U6a Training nach Abstand zum Spiel mit Vorlagen, Belastung, Wochenreizen, Trainingsverletzungen, Umschulung (tests/training.js), ✅ U6b Sommer: Urlaub je Verein, Laufplan, Trainingsauftakt, Saisonbelastung, Leistungstest (tests/sommer.js), ✅ U6c Trainerstab mit acht Rollen, Wirkungen, Gehältern, Verträgen und Stab-Ansicht (tests/stab.js). **U6 fertig.** U7 (9.11.): ✅ U7a Disziplin und Sportgericht mit Foularten, Schiedsrichtern, Sperren je Wettbewerb, Verfahren und Einspruch (tests/disziplin.js); ✅ U7b Medizin mit Verletzungsarten, Ursachen, Diagnose als Spanne, Rückkehr und Rückfall, fit spritzen, Krankheiten (tests/medizin.js); ✅ U7c Pokal-Auslosung mit Töpfen und Heimrecht, 72 Stunden, Relegation mit Verlängerung und Elfmeterschießen, Supercup, Zweitmannschaften (tests/wettbewerbe.js; Länderspiele erst mit Nationalitäten, K32); ✅ U7d Testspiele mit Anfrage und Zusage, eigenen Regeln und Einnahmen, Trainingslager mit Orten und Wirkung (tests/testspiele.js). **U7 fertig, Welle 2 umgesetzt.** | Spieltage mit Eingreifen, Training mit Wirkung, Sportgericht |
| 2b Einstieg | K36 | UL: Lernstufen mit Stufenleiter, Automatik für gesperrte Bereiche, Aufstiegskarte, Aus-Schalter (nach U7, vor U8) | die erste Saison als Einstieg mit wachsenden Möglichkeiten |
| 3 Menschen und Markt | K08, K14, K15, K17–K19, K21, K22, K28, K31, Gerüst von K30, Auslandspool aus K32 | ✅ U8 (9.11.): Stimmung mit Kaderrollen und eigener Einschätzung, Wechselwunsch in vier Stufen mit Gesprächswunsch als Halt, Mannschaftsstimmung, Ansteckung, Zusammenhalt mit Wirkung im Spiel, Freundschaften, Rivalitäten, Grüppchen, Kapitän, Teamevent, Gespräche mit Haltung, Versprechen und Glaubwürdigkeit, Mannschaftsansprache, neue Ansicht Kabine (tests/kabine.js). U8d (vorgemerkt, 10.11.): Bankzeit nach Grund (K14 §12). U9: Scouting, Auslandspool und Jugend. U10: Transfers I, Verträge mit Verhandlung und Prämien (K21, ergänzt 10.11.) und Berater. U11: Computer-Vereine. U12: Beziehungen, Vorstand und Ereignis-Gerüst | Transfers als Prozess, sinnvolle Computer-Vereine, erste Ereigniskarten |
| 4 Verein und Welt | K12b, K20, K23–K27, K29, K32 (Rest), K34 | U13 bis U18 nach Bedarf | Saisonvorbereitung, Sponsoren, Marketing, Stadion, Fans, Presse, Abwerben |
| 4b Europa | K37 | U19: Europapokal mit drei Wettbewerben, internationalen Einnahmen und Belastung | die Bundesliga im europäischen Wettbewerb, der Vorsprung der Großen hat seinen echten Grund |
| 5 Oberfläche | K35b | U20 und folgende | eigener Retro-Look |

## 6. Aufwand (grob, ehrlich)

- **Konzepte:** 38 Stück (K01–K37, K35 geteilt in K35a und K35b; K36 Lernstufen kam am 9.11. dazu, K37 Europapokal am 10.11.). Davon sind 7 klein, 23 mittel und 6 groß. Das sind grob 12–15 Konzept-Sessions, das Ereignis-Playbook wächst danach weiter.
- **Umsetzung:** etwa 19 oder mehr Schritte, große eventuell doppelt, also grob 20–30 Sessions.
- **Tokenkosten** kann ich vorher nicht verlässlich beziffern. Nach der ersten Konzept-Session und nach U1 sieht man den Verbrauch in der Nutzungsanzeige und kann hochrechnen.
- **Sparen:**
  - neue Session pro Schritt
  - nur betroffene Dateien lesen
  - Tests als Skripte im Repo
  - Konzepte knapp und konkret halten

## 7. Nächster Schritt

Stand 9. November 2026:

1. **Alle Konzepte sind geschrieben** (K01–K35b). K03 ist abgestimmt, die übrigen sind Entwürfe. Ihre vorläufigen Entscheidungen gelten, bis du widersprichst (§1, Punkt 9). Gesammelt in `konzepte/_offene-entscheidungen.md`.
2. **Umsetzung** in der Reihenfolge der Wellen (§5). U1 bis U6 sind fertig (Fundament, Live-Spiel, Taktik, Training, Sommer, Trainerstab). U7 ist fertig (Disziplin, Medizin, Wettbewerbe, Testspiele), damit ist Welle 2 umgesetzt. **K36 Lernstufen** ist als Entwurf geschrieben (9.11., `konzepte/K36-lernstufen.md`) und wartet auf deine Abstimmung, danach folgt die Umsetzung UL. **U8 Stimmung und Gespräche** (K14, K15) ist umgesetzt (9.11. abends), mit der Lizenz je neuer Funktion nach K36. Als Nächstes UL, sobald du K36 abgestimmt hast, sonst U9 (Scouting, Auslandspool, Jugend). Vorgemerkt seit 10.11.: U8d Bankzeit nach Grund (K14 §12, kleiner Schritt, wann du willst), Vertragsverhandlungen mit Prämien, Sportdirektor und Berater-Kontakten in U10 (K21, K16, K22), Dominanz der großen Vereine mit etwa zwei Dritteln der Titel als Kalibrierziel nach U11 (K02 §5.3a), Europapokal als Konzept K37 und Welle 4b.
3. **Startsatz** für eine neue Session: „Projekt Flutlicht Manager im Ordner flutlicht-manager/. Lies PLAN.md. Weiter, entscheide du.“ Dann geht es beim nächsten offenen Umsetzungsschritt weiter.
4. **Vor der Kalibrierung zu recherchieren** (aus den Konzepten gesammelt): Datenquelle für feine Positionen, Fuß und Charakter-Fakten (K03), Fouls und Torschüsse pro Spiel (K04), Regeln zu Liga-Rot im Pokal, Relegation und Trainer-Karten (K09), Verletzungsraten der Männer (K10), Heimrecht in späteren Pokalrunden, Supercup, Zweitmannschaften (K13), Vorvertragsregel und FIFA-Änderungen 2027 (K21), Personalkostenquote, 3.-Liga-Medientopf, Insolvenz-Punktabzug (K23).
