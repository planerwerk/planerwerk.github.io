# Tests

Die Browser-Tests brauchen Node.js und Playwright mit Chromium, `sim.js` und `zufall.js` nur Node.js. Aufruf aus dem Ordner `flutlicht-manager/`.

| Skript | Was es macht | Dauer |
|---|---|---|
| `node tests/ui-zwei-saisons.js` | Spielt zwei Saisons samt Sommer über die echte Oberfläche mit „Tag beenden“: Erinnerungen, Konferenz, Transfers, Verträge, Menü-Schalter, Kalender, 3. Liga, Speichern und Laden, Löschen alter Spielstände, Entlassung, Handy-Breite. Prüft nach jedem Halt die Spieldaten und zählt die Halte pro Woche. | etwa 110 s |
| `node tests/fuzz-karrieren.js` | 13 Karrieren mit verschiedenen Vereinen (zwei davon in der 3. Liga), je zwei Saisons samt Sommer, mit zufälligen Aktionen. Spiel und Aktionen laufen mit festem Seed je Verein, ein Fehler lässt sich also nachstellen. Prüft jeden Spieltag auf gesperrte oder verletzte Spieler. | etwa 40 s |
| `node tests/sim.js [Saisons] [Seed] [Verein]` | Simulator ohne Browser (K02): lädt Daten und Spiellogik in Node und spielt Saisons automatisch. Gibt Tore pro Spiel und Heim/Remis/Auswärts je Liga aus. Grundlage für die Kalibrier-Tests. | etwa 1 s je Saison |
| `node tests/spielermodell.js [Saisons] [Seed]` | Spielermodell (K03 §10): Frische und Kondition als Einzelrechnung, Lernen im Spiel und Fehlerkonto mit erfundenen Szenen, dann Saisons simuliert: Alterskurve der Mittelfeldspieler, Torhüter bauen langsamer ab, Gleichgewicht der Ligen, Formverteilung, keine Formspirale, Talentgrenze, Merkmale stabil über die Saisons. Nur Node.js. | etwa 10 s für 6 Saisons |
| `node tests/kalibrierung.js [Saisons=3] [Seed=5]` | Engine (K04 §10): Tore, Heim/Remis/Auswärts, Schüsse, Torquote, Ecken, Standards, Elfmeter, Karten, Halbzeiten je Liga, dazu Meisterpunkte, Favoriten, gleich starke Teams, Pokal gegen Amateure, Ballbesitz-Spanne. Ampel je Wert: grün im Ziel, gelb am Rand, rot daneben. Nur Node.js. | etwa 3 s je Saison |
| `node tests/akzeptanz.js [Saisons=200] [Seed=5]` | Akzeptanztests der Engine (K04 §10): Torwart-Test (Spitzentorwart in einem Zweitliga-Team), Sensitivität je Bereich, glatter Anstieg mit der Teamstärke, ein Star allein, kein Exploit mit fünf Stürmern, Tempo. Beide Varianten laufen mit denselben Zufallsströmen. Nur Node.js. | etwa 110 s |
| `node tests/zufall.js` | Zufallsströme (K02): Zusätzliche Würfe im Grundstrom (wie bei einer Handlung des Spielers) ändern keine Spielergebnisse. Braucht kein Playwright. | etwa 2 s |
| `node tests/seed.js` | Wiederholbarkeit: gleicher Seed ergibt den gleichen Verlauf, ein anderer Seed einen anderen, und Speichern, Laden und Weiterspielen ändert nichts. | etwa 10 s |

`tests/pruefungen.js` enthält die gemeinsamen Datenprüfungen, unter anderem: Jeder Verein hat so viele Spiele, wie der Spielplan bis heute vorsieht, Ligagrößen 18/18/20, Regionalligisten ohne Spieler, keine Zweitmannschaft im Pokal, Pokalrunden passen zum Datum, keine abgelaufenen Angebote, Zufallszustand intakt.

Ausgabe: am Ende „PROBLEME (0)“ bzw. „keine Fehler“, sonst eine Liste der Befunde. Bei Befunden endet das Skript mit Exit-Code 1.
