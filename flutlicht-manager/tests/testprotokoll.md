# Testprotokoll

Asynchroner Kanal zwischen der Entwicklung auf den Zweigen `mitarbeit/popolupo-*` und den Testläufen von Claude (Zweige `claude/*`). Seit dem 20.11.

**So funktioniert es**
- Claude testet die Spitzen der Zweige `mitarbeit/popolupo-*` in einer Kopie und ändert an diesen Zweigen nichts. Die Ergebnisse stehen hier, der neueste Lauf oben.
- Jeder Fund hat eine Nummer (T1.1, T1.2 …). Wer einen Fund behebt oder entscheidet, nennt die Nummer in der Commit-Nachricht oder in der Konsistenzprüfung (zum Beispiel „behebt T1.2“). Claude liest das beim nächsten Lauf und trägt hier „erledigt in …“ ein.
- Diese Datei schreibt nur Claude. So gibt es beim Zusammenführen keine Konflikte. Antworten gehören in Commit-Nachrichten oder in die Konsistenzprüfung.
- Zur Einordnung, was schon vorher rot war (Stand e8ea42d, U10d): `tests/kalibrierung.js` (Favoritensieg Top 3 gegen Letzte 3, Spanne Ballbesitz), `tests/medizin.js` (Rückfall nach Zerrung 15 %, Kreuzbandrisse 10,0), `tests/akzeptanz.js` (Abwehr +0,8, Verhältnis der Bereiche, Tempo über 4 ms). Diese Werte schwanken mit jeder Änderung der Welt, sie zählen nur, wenn sie deutlich schlechter werden.

**Wie Claude testet**
Node.js 22, Playwright mit Chromium, für `tests/ui-zugang.js` axe-core 4.10.2 (per npm in der Testkopie). Die Node-Tests laufen parallel (vier gleichzeitig), die Browser-Tests einzeln nacheinander, `tests/akzeptanz.js` allein am Schluss (wegen der Tempomessung). Dazu `tests/code.js` (Kommentar am Zeilenende verschluckt keinen Code).


**Neu von Claude (26.11. abends, auf Wunsch des Nutzers: wenn nichts zu testen ist, entwickeln oder planen)**
- Die Claude-Zweige enthalten jetzt `popolupo-gj-korrekturen` (78e6b78, zusammengeführt ohne Konflikt). Neue Zweige können wie gewohnt auf `claude/compassionate-galileo-bsbua4` beginnen.
- **Lücken-Check** in `konzepte/_luecken.md`: L1 Spielstand-Sicherheit (Safari löscht nach 7 Tagen, Größe 3,7 Mio. Zeichen nach 10 Saisons bei etwa 5,2 Mio. Grenze), L2 echte Spielernamen (vor einer Veröffentlichung klären), L3 Mehrspieler an einem Gerät, L4 Investoren und 50+1, L5 soziale Medien.
- **L1 gebaut:** „Als Datei sichern“ und „Datei laden“ im Menü (`js/fenster.js`: `saveDatei`, `ladeDatei`, `dateiWaehlen`, `dateiFeld`), „Datei laden“ auf dem Startbildschirm (`js/start.js`), Anteil am Browser-Speicher im Menü (`REGELN.spielstand.browserGrenze`, `dateiName`). `importSave(txt)` nimmt jetzt optional den Text, ohne Text wie bisher das Feld `#imp`. Neuer Browser-Test `tests/ui-sicherung.js` (8 ✓), `tests/ui-zugang.js`, `tests/code.js` und `tests/regeln-fest.js` grün.
- **L1 ergänzt:** Erinnerung zum Saisonende als Nachricht, wenn in dieser Saison keine Datei gesichert wurde (`sicherungErinnern` in `werbungSaisonende` folgend, `js/saison.js`; Merker je Gerät `REGELN.spielstand.sicherungSchluessel`, nicht im Spielstand). Die Simulation bekommt die Nachricht auch (ihr `localStorage`-Ersatz ist leer), sonst ändert sich am Spielstand nichts. Neuer Node-Test `tests/spielstand.js` (Größe, Wachstum, keine NaN oder Infinity im Spielstand, Erinnerung).
- **Windows-App** (auf Wunsch des Nutzers): `desktop/` mit Electron, Spielstand als Datei über `speicherLesen`/`speicherSchreiben` (`js/hilfen.js`, im Browser weiter `localStorage`), Test `tests/desktop.js` (11 ✓, braucht `npm install` in `desktop/` und `xvfb-run`), Installer über `.github/workflows/windows-installer.yml` (erster Lauf erfolgreich). Siehe `desktop/LIESMICH.md`.
- **K24d Stadionname** nach euren Antworten in K24 §12 umgesetzt (`js/werbung.js`, `RF.werbung.anteil.stadion` 0,12, `partner` 0,25, `RF.werbung.stadion`, Posten „Stadionname“ in `RFP.laufend`). `tests/werbung.js` Nr. 22 bis 26 grün, `finanzen`, `lizenz`, `marketing`, `fans` grün. Für die KURZ-Zeilen im `finanzmodell`: Der Posten heißt `Stadionname` (nur dein Verein, Computer-Vereine unverändert).
- **K24e Nachverhandeln** (`werbVerhandeln`, Fenster `werbungVerhandlungsFenster`, `RF.werbung.verhandeln`), `tests/werbung.js` Nr. 27 bis 30 grün. Eure Korrekturen GK (762d613) sind zusammengeführt, die Konflikte mit der Windows-App in `hilfen.js`, `fenster.js` und `start.js` sind gelöst (beide Änderungen drin, `spielstand`, `ui-sicherung`, `desktop` grün).
- **K24f** Ausstieg eines Partners unter 30 Zufriedenheit (nicht im Abstiegsjahr), `tests/werbung.js` Nr. 31.
- **Begonnen bei Claude:** nichts weiter. K24 Rest (Bande und Partnerpool, Trainingskleidung, Verhandeln mit Reglern) bleibt vorgemerkt.

**Entscheidungen des Nutzers vom 27.11. zur Lückenliste** (`konzepte/_luecken.md`): L2 echte Spielernamen „ja, ist ok“, sie bleiben. L3 Mehrspieler an einem Gerät: nein. L6 Schriften: im Spiel statt von Google, nichts dynamisch nachladen. **L6 hat Claude umgesetzt:**
- `index.html` bindet jetzt `css/schriften.css` ein statt `fonts.googleapis.com`. Dort liegen Barlow, Saira Condensed und VT323 eingebettet, unverändert von Google Fonts, latin und latin-ext.
- Die Lizenztexte (OFL 1.1) liegen in `schrift/LIZENZ-*.txt`.
- Neuer Test `tests/offline.js` (7 ✓).
- Das berührt euren Bereich K35b nur an dieser einen Zeile in `index.html`. Die Schriftnamen in `css/spiel.css` sind unverändert.
---

## Lauf 27, 27.11.2026 nachmittags (gezielt): popolupo-t25-geld 4dc2512 (Zielplattform, Text der Erinnerung)

Nur der neue Commit, er ändert eine Zeile in `js/fenster.js` (Text der Erinnerung zum Saisonende): code, regeln-fest, spielstand, ui-sicherung und offline sind **alle grün**. Der Rest ist unverändert wie in Lauf 26.

---

## Lauf 26, 27.11.2026 mittags: popolupo-t25-geld 631c67b (Käufe im Ausland K32 §7, Prüfung GP, Abwehrdruck 0,03, Heimvorteil 1,025, Konten-Messung)

Alle Tests auf eurem neuesten Stand, in einer Kopie, am Zweig nichts geändert, auch `tests/offline.js` (grün). Dazu `tests/desktop.js` (11 ✓, jetzt mit den eingebetteten Schriften). **54 grün, 5 rot**, `desktop` nicht mitgezählt.

Erledigt:
- **akzeptanz, Abwehr:** +1,1, zum ersten Mal seit Lauf 1 grün. Alle vier Sensitivitätszeilen sind grün. Rot bleibt nur das Tempo mit 4,45 ms. Das liegt an der Maschine, wie in Lauf 25 gezeigt: Auch alte Stände brauchen hier heute über 4 ms.
- **T25.1 Langzeit-Spannung:** Ø Platz 6,0 im Mittel der letzten fünf Saisons, grün.
- **Randwerte aus Lauf 25:** `kalibrierung` (Auswärtssiege 32 %) und `spielermodell` sind grün.

Rot sind `welt`, `welt 10`, `kabine`, `sommer` und `akzeptanz`. `finanzmodell` zählt nach seinem Rückgabewert als grün, seine ✗-Zeilen stehen trotzdem hier:
- **T26.1 Konten der Computer-Vereine** (`welt` und `welt 10`, eure neue Prüfung):
  - Die Käufe im Ausland halten das Wachstum nicht auf. In `welt 10` sind 9 von 10 Saisons rot, der Faktor steigt von 0,69 über 1,16 auf 3,42 in 2035, die Konten von 2,1 auf 11,6 Mrd.
  - Der Posten „Ausland“ in der Veränderung bleibt der größte Zufluss, je Saison zwischen +516 und +1.125 Mio.
  - Käufe aus dem Ausland gab es je Saison 5 bis 9.
  - In `welt` (drei Saisons) ist 2027 mit Faktor 1,16 rot.
- **T26.2 kabine, Wechselwünsche** (neu): 1,05 offizielle Wechselwünsche je Kader und Saison, erlaubt ist höchstens 1. Höchstens 7 in einem Verein. In den Läufen 22 bis 25 waren es stets 0,75 und höchstens 4. Die Änderung kommt also mit diesem Stand. Welche Änderung es ist, habe ich nicht geprüft.
- **T26.3 sommer, Kondition zum ersten Ligaspiel** (neu): 78,9, Ziel 80 bis 88. Lauf 22 und 23 81,2, Lauf 25 82,6.
- **T26.4 finanzmodell 2:** 6 ✓, 3 ✗, in Lauf 25 waren es 8 ✓, 1 ✗.
  - Rot sind 1. Liga 2026 (9,2 Mio.), 1. Liga 2028 (7,2 Mio.) und 3. Liga 2028 (−2,7 Mio.).
  - 2. Liga 2028 ist jetzt grün (−1,2 Mio.).
  - Die ✗-Zeilen nennen höhere Ausgaben für Gehalt und Stab, in der 1. Liga 2028 +7,9 Mio.
- **akzeptanz:** nur das Tempo, siehe oben.

**kalibrierung** (Auswärtssiege) wörtlich:

```
🟢 Auswärtssiege: 32 % (Ziel 0.3–0.36)
```

**akzeptanz** (Sensitivität) wörtlich:

```
✓ Sensitivität: ein Spieler (Abwehr) +5 bringt 1–3 Punkte pro Saison: +1.1
✓ Sensitivität: ein Spieler (Mittelfeld) +5 bringt 1–3 Punkte pro Saison: +1.4
✓ Sensitivität: ein Spieler (Angriff) +5 bringt 1–3 Punkte pro Saison: +1.6
✓ Sensitivität: kein Bereich bringt mehr als das Doppelte eines anderen: Abwehr +1.1, Mittelfeld +1.4, Angriff +1.6
```

**transfers**, Zeile zu den Wechseln unter Computer-Vereinen wörtlich:

```
✓ Fenster: Wechsel unter Computer-Vereinen nur im Fenster, mindestens 15 je Saison (vorher etwa 29 über das ganze Jahr): 35 Wechsel, 0 außerhalb
```

**welt 10**, „Langzeit-Spannung“ wörtlich:

```
✓ Langzeit-Spannung: Die fünf Vereine mit dem höchsten Ansehen stehen im Mittel der letzten fünf Saisons unter den besten acht (K31 §10): Ø Platz 6.0 (letzte Saison 6.0; je Saison 2026 6.0, 2027 3.8, 2028 7.0, 2029 5.2, 2030 6.0, 2031 4.4, 2032 3.6, 2033 8.0, 2034 8.0, 2035 6.0)
```

**welt 10**, die zehn Zeilen „Konten der Computer-Vereine“ wörtlich:

```
✓ Saison 2026: Konten der Computer-Vereine zusammen höchstens so hoch wie ihre erwarteten Jahreseinnahmen (vorläufig, K23: Start etwa ein Fünftel): Konten 2.1 Mrd. (Ø 39.0 Mio. je Verein, reichster FC Bayern München 573.5 Mio., 9 im Minus), Jahreseinnahmen 3.1 Mrd., Faktor 0.69 · Veränderung aller Konten +1347.2 Mio.: Ausland +878.5, Europapokal +263.5, Liga +190.7, Pokal +105.0, Transfers -96.1, Eröffnung +5.6, Strafen +0.0, TV-Raten +0.0, Insolvenz +0.0, Leihen +0.0, Rest +0.0
✗ Saison 2027: Konten der Computer-Vereine zusammen höchstens so hoch wie ihre erwarteten Jahreseinnahmen (vorläufig, K23: Start etwa ein Fünftel): Konten 3.6 Mrd. (Ø 65.9 Mio. je Verein, reichster VfB Stuttgart 713.7 Mio., 12 im Minus), Jahreseinnahmen 3.1 Mrd., Faktor 1.16 · Veränderung aller Konten +1460.0 Mio.: Ausland +995.1, Europapokal +278.6, Liga +182.6, Pokal +110.4, Transfers -78.5, Bauen -38.5, Eröffnung +5.2, Supercup +5.0, Strafen +0.0, TV-Raten +0.0, Insolvenz +0.0, Leihen +0.0, Rest +0.0
✗ Saison 2028: Konten der Computer-Vereine zusammen höchstens so hoch wie ihre erwarteten Jahreseinnahmen (vorläufig, K23: Start etwa ein Fünftel): Konten 5.2 Mrd. (Ø 94.7 Mio. je Verein, reichster VfB Stuttgart 892.2 Mio., 8 im Minus), Jahreseinnahmen 3.2 Mrd., Faktor 1.61 · Veränderung aller Konten +1558.8 Mio.: Ausland +1125.3, Europapokal +398.8, Transfers -170.7, Bauen -143.3, Liga +142.8, Pokal +105.1, Insolvenz +7.1, Eröffnung +5.7, Supercup +5.0, Strafen +0.0, TV-Raten +0.0, Leihen +0.0, Rest +83.0
✗ Saison 2029: Konten der Computer-Vereine zusammen höchstens so hoch wie ihre erwarteten Jahreseinnahmen (vorläufig, K23: Start etwa ein Fünftel): Konten 6.4 Mrd. (Ø 117.1 Mio. je Verein, reichster VfB Stuttgart 1127.3 Mio., 12 im Minus), Jahreseinnahmen 3.3 Mrd., Faktor 1.97 · Veränderung aller Konten +1223.2 Mio.: Ausland +952.8, Europapokal +306.4, Transfers -117.2, Pokal +116.0, Bauen -109.3, Liga +35.5, Insolvenz +22.2, Eröffnung +5.5, Supercup +5.0, Strafen +0.0, TV-Raten +0.0, Leihen +0.0, Rest +6.3
✗ Saison 2030: Konten der Computer-Vereine zusammen höchstens so hoch wie ihre erwarteten Jahreseinnahmen (vorläufig, K23: Start etwa ein Fünftel): Konten 7.4 Mrd. (Ø 135.1 Mio. je Verein, reichster VfB Stuttgart 1156.0 Mio., 12 im Minus), Jahreseinnahmen 3.3 Mrd., Faktor 2.25 · Veränderung aller Konten +1000.8 Mio.: Ausland +764.5, Europapokal +359.1, Transfers -115.1, Pokal +109.7, Bauen -106.5, Liga -40.2, Insolvenz +6.2, Eröffnung +5.6, Supercup +5.0, Strafen +0.0, TV-Raten +0.0, Leihen +0.0, Rest +12.6
✗ Saison 2031: Konten der Computer-Vereine zusammen höchstens so hoch wie ihre erwarteten Jahreseinnahmen (vorläufig, K23: Start etwa ein Fünftel): Konten 8.2 Mrd. (Ø 149.9 Mio. je Verein, reichster VfB Stuttgart 1273.2 Mio., 12 im Minus), Jahreseinnahmen 3.3 Mrd., Faktor 2.47 · Veränderung aller Konten +807.1 Mio.: Ausland +605.8, Europapokal +325.7, Transfers -167.4, Pokal +115.7, Bauen -102.4, Insolvenz +20.2, Eröffnung +5.3, Supercup +5.0, Liga -0.9, Strafen +0.0, TV-Raten +0.0, Leihen +0.0, Rest +0.0
✗ Saison 2032: Konten der Computer-Vereine zusammen höchstens so hoch wie ihre erwarteten Jahreseinnahmen (vorläufig, K23: Start etwa ein Fünftel): Konten 9.2 Mrd. (Ø 167.1 Mio. je Verein, reichster FC Bayern München 1591.3 Mio., 9 im Minus), Jahreseinnahmen 3.4 Mrd., Faktor 2.73 · Veränderung aller Konten +941.9 Mio.: Ausland +698.9, Europapokal +366.8, Transfers -230.9, Bauen -126.0, Pokal +122.3, Liga +73.0, Insolvenz +25.5, Eröffnung +5.5, Supercup +5.0, Strafen +0.0, TV-Raten +0.0, Leihen +0.0, Rest +1.7
✗ Saison 2033: Konten der Computer-Vereine zusammen höchstens so hoch wie ihre erwarteten Jahreseinnahmen (vorläufig, K23: Start etwa ein Fünftel): Konten 9.9 Mrd. (Ø 180.3 Mio. je Verein, reichster FC Bayern München 1696.8 Mio., 14 im Minus), Jahreseinnahmen 3.4 Mrd., Faktor 2.93 · Veränderung aller Konten +755.2 Mio.: Ausland +535.2, Europapokal +274.7, Transfers -131.8, Bauen -114.0, Pokal +107.4, Liga +44.9, Insolvenz +36.2, Eröffnung +5.8, Supercup +5.0, Strafen +0.0, TV-Raten +0.0, Leihen +0.0, Rest -8.2
✗ Saison 2034: Konten der Computer-Vereine zusammen höchstens so hoch wie ihre erwarteten Jahreseinnahmen (vorläufig, K23: Start etwa ein Fünftel): Konten 10.8 Mrd. (Ø 196.5 Mio. je Verein, reichster FC Bayern München 1860.8 Mio., 16 im Minus), Jahreseinnahmen 3.4 Mrd., Faktor 3.22 · Veränderung aller Konten +907.5 Mio.: Ausland +647.7, Europapokal +309.7, Transfers -165.3, Pokal +115.3, Bauen -108.2, Liga +74.5, Insolvenz +11.7, Eröffnung +5.7, Supercup +5.0, Strafen +0.0, TV-Raten +0.0, Leihen +0.0, Rest +11.5
✗ Saison 2035: Konten der Computer-Vereine zusammen höchstens so hoch wie ihre erwarteten Jahreseinnahmen (vorläufig, K23: Start etwa ein Fünftel): Konten 11.6 Mrd. (Ø 211.3 Mio. je Verein, reichster FC Bayern München 2207.8 Mio., 17 im Minus), Jahreseinnahmen 3.4 Mrd., Faktor 3.42 · Veränderung aller Konten +838.0 Mio.: Ausland +516.0, Europapokal +266.5, Transfers -137.4, Pokal +120.6, Liga +79.9, Bauen -71.3, Insolvenz +53.1, Eröffnung +5.5, Supercup +5.0, Strafen +0.0, TV-Raten +0.0, Rest +0.0
```

**welt 10**, die zehn Zeilen „mindestens 15 Wechsel mit Ablöse“ wörtlich:

```
✓ Saison 2026: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 37 mit Ablöse (Sommer 34, Winter 3; Käufer aus Liga 1/2/3: 9/11/17), 8 aus dem Ausland, 16 Vereinslose, 9 Vereine im Minus zum Saisonende · Sommerbeginn: 55 von 55 Vereinen mit Budget, zusammen 461.3 Mio., 178 Spieler gelistet · Winterbeginn: 55 von 55 Vereinen mit Budget, zusammen 602.4 Mio., 152 Spieler gelistet
✓ Saison 2027: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 24 mit Ablöse (Sommer 22, Winter 2; Käufer aus Liga 1/2/3: 11/11/2), 8 aus dem Ausland, 21 Vereinslose, 12 Vereine im Minus zum Saisonende · Sommerbeginn: 49 von 55 Vereinen mit Budget, zusammen 1309.3 Mio., 149 Spieler gelistet · Winterbeginn: 49 von 55 Vereinen mit Budget, zusammen 997.9 Mio., 146 Spieler gelistet
✓ Saison 2028: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 27 mit Ablöse (Sommer 22, Winter 5; Käufer aus Liga 1/2/3: 8/14/5), 7 aus dem Ausland, 22 Vereinslose, 8 Vereine im Minus zum Saisonende · Sommerbeginn: 47 von 55 Vereinen mit Budget, zusammen 2063.0 Mio., 133 Spieler gelistet · Winterbeginn: 49 von 56 Vereinen mit Budget, zusammen 1505.6 Mio., 139 Spieler gelistet
✓ Saison 2029: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 28 mit Ablöse (Sommer 27, Winter 1; Käufer aus Liga 1/2/3: 11/11/6), 7 aus dem Ausland, 23 Vereinslose, 12 Vereine im Minus zum Saisonende · Sommerbeginn: 50 von 55 Vereinen mit Budget, zusammen 2966.9 Mio., 120 Spieler gelistet · Winterbeginn: 49 von 55 Vereinen mit Budget, zusammen 1825.7 Mio., 131 Spieler gelistet
✓ Saison 2030: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 26 mit Ablöse (Sommer 23, Winter 3; Käufer aus Liga 1/2/3: 11/4/11), 7 aus dem Ausland, 27 Vereinslose, 12 Vereine im Minus zum Saisonende · Sommerbeginn: 44 von 55 Vereinen mit Budget, zusammen 3667.1 Mio., 82 Spieler gelistet · Winterbeginn: 45 von 55 Vereinen mit Budget, zusammen 2123.7 Mio., 88 Spieler gelistet
✓ Saison 2031: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 23 mit Ablöse (Sommer 19, Winter 4; Käufer aus Liga 1/2/3: 7/9/7), 5 aus dem Ausland, 32 Vereinslose, 12 Vereine im Minus zum Saisonende · Sommerbeginn: 45 von 55 Vereinen mit Budget, zusammen 4079.9 Mio., 82 Spieler gelistet · Winterbeginn: 43 von 55 Vereinen mit Budget, zusammen 2284.1 Mio., 75 Spieler gelistet
✓ Saison 2032: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 20 mit Ablöse (Sommer 19, Winter 1; Käufer aus Liga 1/2/3: 9/7/4), 9 aus dem Ausland, 26 Vereinslose, 9 Vereine im Minus zum Saisonende · Sommerbeginn: 44 von 55 Vereinen mit Budget, zusammen 4538.1 Mio., 65 Spieler gelistet · Winterbeginn: 45 von 55 Vereinen mit Budget, zusammen 2521.7 Mio., 73 Spieler gelistet
✓ Saison 2033: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 21 mit Ablöse (Sommer 19, Winter 2; Käufer aus Liga 1/2/3: 7/8/6), 6 aus dem Ausland, 18 Vereinslose, 14 Vereine im Minus zum Saisonende · Sommerbeginn: 42 von 55 Vereinen mit Budget, zusammen 5037.1 Mio., 67 Spieler gelistet · Winterbeginn: 44 von 55 Vereinen mit Budget, zusammen 2750.1 Mio., 74 Spieler gelistet
✓ Saison 2034: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 24 mit Ablöse (Sommer 23, Winter 1; Käufer aus Liga 1/2/3: 7/10/7), 8 aus dem Ausland, 23 Vereinslose, 16 Vereine im Minus zum Saisonende · Sommerbeginn: 41 von 55 Vereinen mit Budget, zusammen 5778.0 Mio., 72 Spieler gelistet · Winterbeginn: 42 von 55 Vereinen mit Budget, zusammen 3146.9 Mio., 72 Spieler gelistet
✓ Saison 2035: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 16 mit Ablöse (Sommer 14, Winter 2; Käufer aus Liga 1/2/3: 7/6/3), 7 aus dem Ausland, 21 Vereinslose, 17 Vereine im Minus zum Saisonende · Sommerbeginn: 37 von 55 Vereinen mit Budget, zusammen 6201.5 Mio., 86 Spieler gelistet · Winterbeginn: 41 von 55 Vereinen mit Budget, zusammen 3311.7 Mio., 87 Spieler gelistet
```

**finanzmodell 2**, KURZ und Saldo wörtlich:

```
KURZ 2026 L1: ein 137.7 Mio = TV 49.8 Mio + Werbung/Sonstiges 63.5 Mio + Spieltag 24.4 Mio | aus 128.6 Mio = Gehalt+Stab 76.4 Mio + Betrieb 1.5 Mio + Verwaltung 49.3 Mio + Jugend 1.4 Mio | Saldo 9.2 Mio
KURZ 2026 L2: ein 33.0 Mio = TV 12.4 Mio + Werbung/Sonstiges 10.9 Mio + Spieltag 9.6 Mio | aus 32.3 Mio = Gehalt+Stab 18.9 Mio + Betrieb 1.0 Mio + Verwaltung 11.0 Mio + Jugend 1.4 Mio | Saldo 0.7 Mio
KURZ 2026 L3: ein 10.5 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.8 Mio + Spieltag 4.4 Mio | aus 12.3 Mio = Gehalt+Stab 8.3 Mio + Betrieb 0.7 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -1.8 Mio
KURZ 2027 L1: ein 133.4 Mio = TV 49.8 Mio + Werbung/Sonstiges 59.6 Mio + Spieltag 24.0 Mio | aus 121.4 Mio = Gehalt+Stab 70.9 Mio + Betrieb 1.5 Mio + Verwaltung 47.6 Mio + Jugend 1.4 Mio | Saldo 12.0 Mio
KURZ 2027 L2: ein 37.0 Mio = TV 12.4 Mio + Werbung/Sonstiges 13.0 Mio + Spieltag 11.5 Mio | aus 37.8 Mio = Gehalt+Stab 23.3 Mio + Betrieb 1.1 Mio + Verwaltung 12.0 Mio + Jugend 1.4 Mio | Saldo -0.8 Mio
KURZ 2027 L3: ein 9.5 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.5 Mio + Spieltag 3.7 Mio | aus 11.6 Mio = Gehalt+Stab 7.7 Mio + Betrieb 0.6 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -2.0 Mio
KURZ 2028 L1: ein 137.6 Mio = TV 49.8 Mio + Werbung/Sonstiges 62.0 Mio + Spieltag 25.8 Mio | aus 130.4 Mio = Gehalt+Stab 78.8 Mio + Betrieb 1.6 Mio + Verwaltung 48.7 Mio + Jugend 1.4 Mio | Saldo 7.2 Mio
KURZ 2028 L2: ein 35.2 Mio = TV 12.4 Mio + Werbung/Sonstiges 11.3 Mio + Spieltag 11.5 Mio | aus 36.4 Mio = Gehalt+Stab 22.9 Mio + Betrieb 1.0 Mio + Verwaltung 11.2 Mio + Jugend 1.4 Mio | Saldo -1.2 Mio
KURZ 2028 L3: ein 9.7 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.6 Mio + Spieltag 3.8 Mio | aus 12.4 Mio = Gehalt+Stab 8.5 Mio + Betrieb 0.6 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -2.7 Mio
```

```
✗ Saldo 1. Liga Saison 2026: 9.2 Mio je Verein (Ziel 11.0 Mio ± 1.5) · TV 49.8 Mio, Werbung/Sonstiges 63.5 Mio, Spieltag 24.4 Mio, Gehalt+Stab 76.4 Mio (Kader 28.8 Spieler, Ø Gehalt 2.56 Mio, Ø Stärke 73.5), Betrieb 1.5 Mio, Verwaltung 49.3 Mio
✓ Saldo 2. Liga Saison 2026: 0.7 Mio je Verein (Ziel 0.0 Mio ± 1.5) · TV 12.4 Mio, Werbung/Sonstiges 10.9 Mio, Spieltag 9.6 Mio, Gehalt+Stab 18.9 Mio (Kader 29.3 Spieler, Ø Gehalt 0.63 Mio, Ø Stärke 65.8), Betrieb 1.0 Mio, Verwaltung 11.0 Mio
✓ Saldo 3. Liga Saison 2026: -1.8 Mio je Verein (Ziel -1.0 Mio ± 1.5) · TV 1.3 Mio, Werbung/Sonstiges 4.8 Mio, Spieltag 4.4 Mio, Gehalt+Stab 8.3 Mio (Kader 28.4 Spieler, Ø Gehalt 0.29 Mio, Ø Stärke 61.1), Betrieb 0.7 Mio, Verwaltung 1.8 Mio
✓ Saldo 1. Liga Saison 2027: 12.0 Mio je Verein (Ziel 11.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges −3.9, Spieltag −0.4, Gehalt+Stab −5.5 (Kader 28.8 → 28.2 Spieler, Ø Gehalt 2.56 → 2.46 Mio, Ø Stärke 73.5 → 73.6), Betrieb −0.0, Verwaltung −1.7, Jugend +0.0 · abgestiegen 0, aufgestiegen 3 (Saldo 27.7 Mio, Ø Gehalt 0.89 Mio), geblieben 15 (Saldo 8.9 Mio, Ø Gehalt 2.77 Mio)
✓ Saldo 2. Liga Saison 2027: -0.8 Mio je Verein (Ziel 0.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +2.1, Spieltag +1.9, Gehalt+Stab +4.4 (Kader 29.3 → 28.8 Spieler, Ø Gehalt 0.63 → 0.79 Mio, Ø Stärke 65.8 → 67.5), Betrieb +0.1, Verwaltung +1.0, Jugend +0.0 · abgestiegen 3 (Saldo -6.3 Mio, Ø Gehalt 1.51 Mio), aufgestiegen 3 (Saldo 5.0 Mio, Ø Gehalt 0.47 Mio), geblieben 12 (Saldo -0.8 Mio, Ø Gehalt 0.70 Mio)
✓ Saldo 3. Liga Saison 2027: -2.0 Mio je Verein (Ziel -1.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges −0.3, Spieltag −0.7, Gehalt+Stab −0.6 (Kader 28.4 → 28.1 Spieler, Ø Gehalt 0.29 → 0.27 Mio, Ø Stärke 61.1 → 61.2), Betrieb −0.1, Verwaltung −0.1, Jugend +0.0 · abgestiegen 3 (Saldo -1.7 Mio, Ø Gehalt 0.35 Mio), aufgestiegen 4 (Saldo -2.2 Mio, Ø Gehalt 0.23 Mio), geblieben 13 (Saldo -2.0 Mio, Ø Gehalt 0.27 Mio)
✗ Saldo 1. Liga Saison 2028: 7.2 Mio je Verein (Ziel 11.0 Mio ± 1.5) · gegenüber Vorsaison: TV −0.0, Werbung/Sonstiges +2.4, Spieltag +1.8, Gehalt+Stab +7.9 (Kader 28.2 → 27.7 Spieler, Ø Gehalt 2.46 → 2.83 Mio, Ø Stärke 73.6 → 74.4), Betrieb +0.1, Verwaltung +1.0, Jugend +0.0 · abgestiegen 0, aufgestiegen 2 (Saldo 1.0 Mio, Ø Gehalt 2.91 Mio), geblieben 16 (Saldo 7.9 Mio, Ø Gehalt 2.82 Mio)
✓ Saldo 2. Liga Saison 2028: -1.2 Mio je Verein (Ziel 0.0 Mio ± 1.5) · gegenüber Vorsaison: TV −0.0, Werbung/Sonstiges −1.7, Spieltag −0.0, Gehalt+Stab −0.5 (Kader 28.8 → 28.5 Spieler, Ø Gehalt 0.79 → 0.80 Mio, Ø Stärke 67.5 → 67.3), Betrieb −0.1, Verwaltung −0.8, Jugend +0.0 · abgestiegen 2 (Saldo 2.9 Mio, Ø Gehalt 0.95 Mio), aufgestiegen 2 (Saldo 2.9 Mio, Ø Gehalt 0.52 Mio), geblieben 14 (Saldo -2.3 Mio, Ø Gehalt 0.82 Mio)
✗ Saldo 3. Liga Saison 2028: -2.7 Mio je Verein (Ziel -1.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +0.1, Spieltag +0.1, Gehalt+Stab +0.8 (Kader 28.1 → 28.5 Spieler, Ø Gehalt 0.27 → 0.30 Mio, Ø Stärke 61.2 → 62.0), Betrieb +0.0, Verwaltung +0.0, Jugend +0.0 · abgestiegen 2 (Saldo -2.3 Mio, Ø Gehalt 0.41 Mio), aufgestiegen 4 (Saldo -3.1 Mio, Ø Gehalt 0.27 Mio), geblieben 14 (Saldo -2.7 Mio, Ø Gehalt 0.28 Mio)
```

---

## Lauf 25, 27.11.2026 vormittags: popolupo-t24-abwehr 46123d6 (Prüfung GO, GL9, Diagnose welt 10, akzeptanz-sweep)

Alle Tests auf eurem neuesten Stand, in einer Kopie, am Zweig nichts geändert. Dazu `tests/desktop.js` (11 ✓, mit GL9 im Spiel) und `node tests/akzeptanz-sweep.js` (Standard 100 Durchgänge). **53 grün, 4 rot** (ohne desktop gezählt). L6 (Schriften, 118894d) ist in eurem Stand noch nicht enthalten, `tests/offline.js` lief deshalb nicht mit. Eure neuen Prüfungen sind grün: `spielstand` Nr. 6 zu GL9 (18 ✓), `vertraege` 4d zu GO (27 ✓).

Rot:
- **T25.1 welt 10, Langzeit-Spannung** (neu, für popolupo): Die fünf Vereine mit dem höchsten Ansehen stehen im Schnitt auf Platz 9,6, Ziel sind die besten acht. In Lauf 22 und 23 waren es 6,0, in Lauf 24 5,4. Dafür sind die Wechsel mit Ablöse jetzt in allen zehn Saisons grün (2034: 24, in Lauf 24 nur 13). 46123d6 misst nur, die Welt hat sich also durch einen früheren Commit geändert. Vermutlich war es GO (784881d, Verträge), geprüft habe ich das nicht.
- **spielermodell, Gleichgewicht 2. Liga** (Randwert): 69.6 → 70.9 → 71.8 → 71.4 → 71.4 → 71.5, Spanne 2,2 bei höchstens 2. In Lauf 22 und 23: 69.6 → … → 71.5, Spanne 1,9.
- **kalibrierung, Auswärtssiege** (Randwert): 30 %, knapp unter dem Ziel von 30 bis 36 %. Lauf 22 und 23: 32 %.
- **akzeptanz:** Abwehr +0,9 (unverändert). Dazu erstmals das Tempo mit 4,29 ms bei höchstens 4 ms, allein wiederholt 4,33 ms. **Am Code liegt das nicht:** Teil 6 allein auf den Ständen der Läufe 22 bis 25 ergibt heute auf dieser Maschine überall 3,9 bis 5,5 ms. Für Lauf 22 stand damals 2,84 ms im Protokoll. Die Maschine ist langsamer geworden, das Tempo zählt in diesem Lauf nicht.

**finanzmodell 2:** 8 ✓, 1 ✗ (2. Liga 2028 −1,6 Mio.). Die KURZ- und Saldo-Zeilen sind Zeile für Zeile gleich wie in Lauf 24, per Vergleich geprüft, dort stehen sie wörtlich.

**akzeptanz-sweep** (alle vier Zeilen wörtlich):

```
Testteam 1. FC Nürnberg (2. Liga, Niveau 68.1, 4-4-2), 100 Durchgänge gegen die übrigen Teams je Messung
✗ heute                    Abwehr +0.9 · Mittelfeld +1.4 · Angriff +1.6 · Basis 50.2 Punkte, 2.93 Tore je Spiel
✓ abwehr.jePunkt 0,03      Abwehr +1.1 · Mittelfeld +1.5 · Angriff +1.7 · Basis 50.4 Punkte, 2.94 Tore je Spiel
✗ IV Mitte 0,95 außen 0,05 Abwehr +0.9 · Mittelfeld +1.0 · Angriff +1.3 · Basis 50.4 Punkte, 2.90 Tore je Spiel
✗ angriff.exponent 1,65    Abwehr +1.0 · Mittelfeld +1.4 · Angriff +1.6 · Basis 50.2 Punkte, 2.93 Tore je Spiel
```

**welt 10:** Die zehn Zeilen „mindestens 15 Wechsel mit Ablöse“ wörtlich:

```
✓ Saison 2026: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 40 mit Ablöse (Sommer 34, Winter 6; Käufer aus Liga 1/2/3: 9/12/19), 16 Vereinslose, 10 Vereine im Minus zum Saisonende · Sommerbeginn: 55 von 55 Vereinen mit Budget, zusammen 461.3 Mio., 178 Spieler gelistet · Winterbeginn: 55 von 55 Vereinen mit Budget, zusammen 633.4 Mio., 156 Spieler gelistet
✓ Saison 2027: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 18 mit Ablöse (Sommer 17, Winter 1; Käufer aus Liga 1/2/3: 12/4/2), 27 Vereinslose, 11 Vereine im Minus zum Saisonende · Sommerbeginn: 49 von 55 Vereinen mit Budget, zusammen 1376.8 Mio., 147 Spieler gelistet · Winterbeginn: 49 von 55 Vereinen mit Budget, zusammen 1072.8 Mio., 153 Spieler gelistet
✓ Saison 2028: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 22 mit Ablöse (Sommer 19, Winter 3; Käufer aus Liga 1/2/3: 8/10/4), 23 Vereinslose, 10 Vereine im Minus zum Saisonende · Sommerbeginn: 47 von 55 Vereinen mit Budget, zusammen 2142.1 Mio., 148 Spieler gelistet · Winterbeginn: 49 von 56 Vereinen mit Budget, zusammen 1490.7 Mio., 143 Spieler gelistet
✓ Saison 2029: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 30 mit Ablöse (Sommer 28, Winter 2; Käufer aus Liga 1/2/3: 16/3/11), 24 Vereinslose, 12 Vereine im Minus zum Saisonende · Sommerbeginn: 46 von 55 Vereinen mit Budget, zusammen 3039.7 Mio., 105 Spieler gelistet · Winterbeginn: 46 von 55 Vereinen mit Budget, zusammen 1897.1 Mio., 112 Spieler gelistet
✓ Saison 2030: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 32 mit Ablöse (Sommer 30, Winter 2; Käufer aus Liga 1/2/3: 12/9/11), 26 Vereinslose, 12 Vereine im Minus zum Saisonende · Sommerbeginn: 46 von 55 Vereinen mit Budget, zusammen 4040.9 Mio., 86 Spieler gelistet · Winterbeginn: 47 von 55 Vereinen mit Budget, zusammen 2385.4 Mio., 88 Spieler gelistet
✓ Saison 2031: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 22 mit Ablöse (Sommer 22, Winter 0; Käufer aus Liga 1/2/3: 10/8/4), 25 Vereinslose, 14 Vereine im Minus zum Saisonende · Sommerbeginn: 42 von 55 Vereinen mit Budget, zusammen 4624.9 Mio., 67 Spieler gelistet · Winterbeginn: 46 von 55 Vereinen mit Budget, zusammen 2697.2 Mio., 67 Spieler gelistet
✓ Saison 2032: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 29 mit Ablöse (Sommer 26, Winter 3; Käufer aus Liga 1/2/3: 9/9/11), 19 Vereinslose, 13 Vereine im Minus zum Saisonende · Sommerbeginn: 43 von 55 Vereinen mit Budget, zusammen 5483.7 Mio., 82 Spieler gelistet · Winterbeginn: 44 von 55 Vereinen mit Budget, zusammen 3091.6 Mio., 85 Spieler gelistet
✓ Saison 2033: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 23 mit Ablöse (Sommer 22, Winter 1; Käufer aus Liga 1/2/3: 11/9/3), 29 Vereinslose, 13 Vereine im Minus zum Saisonende · Sommerbeginn: 41 von 55 Vereinen mit Budget, zusammen 6274.2 Mio., 79 Spieler gelistet · Winterbeginn: 42 von 55 Vereinen mit Budget, zusammen 3483.6 Mio., 74 Spieler gelistet
✓ Saison 2034: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 24 mit Ablöse (Sommer 23, Winter 1; Käufer aus Liga 1/2/3: 10/6/8), 32 Vereinslose, 12 Vereine im Minus zum Saisonende · Sommerbeginn: 42 von 55 Vereinen mit Budget, zusammen 6996.5 Mio., 77 Spieler gelistet · Winterbeginn: 45 von 55 Vereinen mit Budget, zusammen 3839.2 Mio., 86 Spieler gelistet
✓ Saison 2035: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js): 21 mit Ablöse (Sommer 19, Winter 2; Käufer aus Liga 1/2/3: 10/7/4), 27 Vereinslose, 10 Vereine im Minus zum Saisonende · Sommerbeginn: 45 von 55 Vereinen mit Budget, zusammen 7551.4 Mio., 69 Spieler gelistet · Winterbeginn: 44 von 55 Vereinen mit Budget, zusammen 4417.0 Mio., 76 Spieler gelistet
```

Die Zeilen „Saisonende …“ wörtlich:

```
✓ Saisonende 2026: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 24 bis 30, 0 leere Gruppen, 0 zu lange unter dem Kreditrahmen (10 im Minus, erlaubt)
  Saisonende 2026: offene Planstellen je Verein: 0.5, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: 18 %
  Saisonende 2026: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein): 119 von 1291 (9 %)
✓ Saisonende 2027: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 26 bis 30, 0 leere Gruppen, 0 zu lange unter dem Kreditrahmen (11 im Minus, erlaubt)
  Saisonende 2027: offene Planstellen je Verein: 0.2, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: 11 %
  Saisonende 2027: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein): 150 von 1292 (12 %)
✓ Saisonende 2028: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 24 bis 30, 0 leere Gruppen, 0 zu lange unter dem Kreditrahmen (10 im Minus, erlaubt)
  Saisonende 2028: offene Planstellen je Verein: 0.1, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: 18 %
  Saisonende 2028: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein): 228 von 1279 (18 %)
✓ Saisonende 2029: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 24 bis 30, 0 leere Gruppen, 0 zu lange unter dem Kreditrahmen (12 im Minus, erlaubt)
  Saisonende 2029: offene Planstellen je Verein: 0.1, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: 2 %
  Saisonende 2029: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein): 284 von 1277 (22 %)
✓ Saisonende 2030: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 25 bis 30, 0 leere Gruppen, 0 zu lange unter dem Kreditrahmen (12 im Minus, erlaubt)
  Saisonende 2030: offene Planstellen je Verein: 0.1, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: 4 %
  Saisonende 2030: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein): 269 von 1293 (21 %)
✓ Saisonende 2031: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 24 bis 30, 0 leere Gruppen, 0 zu lange unter dem Kreditrahmen (14 im Minus, erlaubt)
  Saisonende 2031: offene Planstellen je Verein: 0.1, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: 4 %
  Saisonende 2031: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein): 273 von 1304 (21 %)
✓ Saisonende 2032: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 25 bis 30, 0 leere Gruppen, 0 zu lange unter dem Kreditrahmen (13 im Minus, erlaubt)
  Saisonende 2032: offene Planstellen je Verein: 0.1, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: 5 %
  Saisonende 2032: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein): 307 von 1293 (24 %)
✓ Saisonende 2033: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 25 bis 30, 0 leere Gruppen, 0 zu lange unter dem Kreditrahmen (13 im Minus, erlaubt)
  Saisonende 2033: offene Planstellen je Verein: 0.2, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: 4 %
  Saisonende 2033: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein): 266 von 1298 (20 %)
✓ Saisonende 2034: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 25 bis 30, 0 leere Gruppen, 0 zu lange unter dem Kreditrahmen (12 im Minus, erlaubt)
  Saisonende 2034: offene Planstellen je Verein: 0.1, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: 4 %
  Saisonende 2034: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein): 277 von 1315 (21 %)
✓ Saisonende 2035: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 24 bis 30, 0 leere Gruppen, 0 zu lange unter dem Kreditrahmen (10 im Minus, erlaubt)
  Saisonende 2035: offene Planstellen je Verein: 0.1, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: 4 %
  Saisonende 2035: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein): 296 von 1308 (23 %)
```

Nach den Saisonende-Zeilen gibt `welt 10` noch aus: „Budget genutzt im letzten Fenster (nur zur Ansicht): 1 %“. Außerdem „Saison 2035: Zugänge über den Markt je Verein: Sommer 0.8, Winter 0.1“, in K31 §10 stehen für alle Zugänge zusammen 3 bis 8 und 0 bis 3.

---

## Lauf 24, 27.11.2026 nachts (gezielt): Claude-Zweig 38738db (enthält popolupo-t22-korrekturen c4fea1e)

Wegen der Uhrzeit nur ein gezielter Lauf zu euren Änderungen (`js/computer.js`, `js/saison.js`, `daten/regeln.js`, `tests/sim.js`): vertraege, transfers, werbung, spielstand, welt, zweite, finanzen, schwierigkeit, code, regeln-fest, welt 10, finanzmodell 2. **Alle grün außer welt 10.** Der volle Lauf folgt beim nächsten Mal.

- **T22.1 erledigt:** In welt 10 gibt es keine leeren Gruppen und keine Kader unter 15 mehr.
- **welt 10, Rest:** 2034 nur 13 Wechsel mit Ablöse (mindestens 15; 28 Vereinslose, 10 Vereine im Minus). Das alte Randproblem der Ablöse-Wechsel in späten Saisons.
- **finanzmodell 2:** 8 ✓, 1 ✗ (vorher 5 ✓, 4 ✗ in Lauf 22 und 23).

```
KURZ 2026 L1: ein 137.7 Mio = TV 49.8 Mio + Werbung/Sonstiges 63.5 Mio + Spieltag 24.4 Mio | aus 127.2 Mio = Gehalt+Stab 75.0 Mio + Betrieb 1.5 Mio + Verwaltung 49.3 Mio + Jugend 1.4 Mio | Saldo 10.5 Mio
KURZ 2026 L2: ein 33.0 Mio = TV 12.4 Mio + Werbung/Sonstiges 10.9 Mio + Spieltag 9.7 Mio | aus 32.1 Mio = Gehalt+Stab 18.7 Mio + Betrieb 1.0 Mio + Verwaltung 11.0 Mio + Jugend 1.4 Mio | Saldo 0.9 Mio
KURZ 2026 L3: ein 10.6 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.8 Mio + Spieltag 4.5 Mio | aus 12.3 Mio = Gehalt+Stab 8.3 Mio + Betrieb 0.7 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -1.8 Mio
KURZ 2027 L1: ein 140.7 Mio = TV 49.8 Mio + Werbung/Sonstiges 64.3 Mio + Spieltag 26.6 Mio | aus 130.7 Mio = Gehalt+Stab 78.1 Mio + Betrieb 1.6 Mio + Verwaltung 49.6 Mio + Jugend 1.4 Mio | Saldo 10.0 Mio
KURZ 2027 L2: ein 31.4 Mio = TV 12.4 Mio + Werbung/Sonstiges 10.0 Mio + Spieltag 8.9 Mio | aus 30.8 Mio = Gehalt+Stab 18.0 Mio + Betrieb 0.9 Mio + Verwaltung 10.6 Mio + Jugend 1.4 Mio | Saldo 0.6 Mio
KURZ 2027 L3: ein 10.6 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.7 Mio + Spieltag 4.6 Mio | aus 12.6 Mio = Gehalt+Stab 8.6 Mio + Betrieb 0.7 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -2.0 Mio
KURZ 2028 L1: ein 139.7 Mio = TV 49.8 Mio + Werbung/Sonstiges 64.0 Mio + Spieltag 25.9 Mio | aus 128.4 Mio = Gehalt+Stab 76.0 Mio + Betrieb 1.6 Mio + Verwaltung 49.5 Mio + Jugend 1.4 Mio | Saldo 11.3 Mio
KURZ 2028 L2: ein 33.7 Mio = TV 12.4 Mio + Werbung/Sonstiges 10.8 Mio + Spieltag 10.5 Mio | aus 35.3 Mio = Gehalt+Stab 22.0 Mio + Betrieb 1.0 Mio + Verwaltung 10.9 Mio + Jugend 1.4 Mio | Saldo -1.6 Mio
KURZ 2028 L3: ein 11.3 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.9 Mio + Spieltag 5.0 Mio | aus 13.2 Mio = Gehalt+Stab 9.1 Mio + Betrieb 0.7 Mio + Verwaltung 1.9 Mio + Jugend 1.5 Mio | Saldo -1.9 Mio
```

```
✓ Saldo 1. Liga Saison 2026: 10.5 Mio je Verein (Ziel 11.0 Mio ± 1.5) · TV 49.8 Mio, Werbung/Sonstiges 63.5 Mio, Spieltag 24.4 Mio, Gehalt+Stab 75.0 Mio (Kader 28.4 Spieler, Ø Gehalt 2.53 Mio, Ø Stärke 73.4), Betrieb 1.5 Mio, Verwaltung 49.3 Mio
✓ Saldo 2. Liga Saison 2026: 0.9 Mio je Verein (Ziel 0.0 Mio ± 1.5) · TV 12.4 Mio, Werbung/Sonstiges 10.9 Mio, Spieltag 9.7 Mio, Gehalt+Stab 18.7 Mio (Kader 29.0 Spieler, Ø Gehalt 0.63 Mio, Ø Stärke 65.7), Betrieb 1.0 Mio, Verwaltung 11.0 Mio
✓ Saldo 3. Liga Saison 2026: -1.8 Mio je Verein (Ziel -1.0 Mio ± 1.5) · TV 1.3 Mio, Werbung/Sonstiges 4.8 Mio, Spieltag 4.5 Mio, Gehalt+Stab 8.3 Mio (Kader 28.6 Spieler, Ø Gehalt 0.29 Mio, Ø Stärke 61.0), Betrieb 0.7 Mio, Verwaltung 1.8 Mio
✓ Saldo 1. Liga Saison 2027: 10.0 Mio je Verein (Ziel 11.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +0.7, Spieltag +2.3, Gehalt+Stab +3.1 (Kader 28.4 → 28.1 Spieler, Ø Gehalt 2.53 → 2.72 Mio, Ø Stärke 73.4 → 74.3), Betrieb +0.2, Verwaltung +0.3, Jugend +0.0 · abgestiegen 0, aufgestiegen 2 (Saldo 23.2 Mio, Ø Gehalt 1.12 Mio), geblieben 16 (Saldo 8.3 Mio, Ø Gehalt 2.93 Mio)
✓ Saldo 2. Liga Saison 2027: 0.6 Mio je Verein (Ziel 0.0 Mio ± 1.5) · gegenüber Vorsaison: TV −0.0, Werbung/Sonstiges −0.9, Spieltag −0.7, Gehalt+Stab −0.7 (Kader 29.0 → 28.8 Spieler, Ø Gehalt 0.63 → 0.62 Mio, Ø Stärke 65.7 → 66.1), Betrieb −0.1, Verwaltung −0.4, Jugend +0.0 · abgestiegen 2 (Saldo -3.7 Mio, Ø Gehalt 0.67 Mio), aufgestiegen 3 (Saldo 3.2 Mio, Ø Gehalt 0.39 Mio), geblieben 13 (Saldo 0.6 Mio, Ø Gehalt 0.67 Mio)
✓ Saldo 3. Liga Saison 2027: -2.0 Mio je Verein (Ziel -1.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges −0.1, Spieltag +0.1, Gehalt+Stab +0.3 (Kader 28.6 → 28.4 Spieler, Ø Gehalt 0.29 → 0.30 Mio, Ø Stärke 61.0 → 61.9), Betrieb −0.0, Verwaltung −0.0, Jugend +0.0 · abgestiegen 3 (Saldo -2.5 Mio, Ø Gehalt 0.39 Mio), aufgestiegen 4 (Saldo -2.8 Mio, Ø Gehalt 0.23 Mio), geblieben 13 (Saldo -1.6 Mio, Ø Gehalt 0.31 Mio)
✓ Saldo 1. Liga Saison 2028: 11.3 Mio je Verein (Ziel 11.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges −0.3, Spieltag −0.7, Gehalt+Stab −2.1 (Kader 28.1 → 27.1 Spieler, Ø Gehalt 2.72 → 2.76 Mio, Ø Stärke 74.3 → 74.3), Betrieb −0.1, Verwaltung −0.1, Jugend +0.0 · abgestiegen 0, aufgestiegen 2 (Saldo 14.7 Mio, Ø Gehalt 1.06 Mio), geblieben 16 (Saldo 10.9 Mio, Ø Gehalt 2.97 Mio)
✗ Saldo 2. Liga Saison 2028: -1.6 Mio je Verein (Ziel 0.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +0.8, Spieltag +1.5, Gehalt+Stab +4.0 (Kader 28.8 → 29.1 Spieler, Ø Gehalt 0.62 → 0.78 Mio, Ø Stärke 66.1 → 67.0), Betrieb +0.1, Verwaltung +0.4, Jugend +0.0 · abgestiegen 2 (Saldo 0.4 Mio, Ø Gehalt 1.22 Mio), aufgestiegen 2 (Saldo 2.7 Mio, Ø Gehalt 0.50 Mio), geblieben 14 (Saldo -2.4 Mio, Ø Gehalt 0.75 Mio)
✓ Saldo 3. Liga Saison 2028: -1.9 Mio je Verein (Ziel -1.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +0.2, Spieltag +0.5, Gehalt+Stab +0.5 (Kader 28.4 → 28.5 Spieler, Ø Gehalt 0.30 → 0.32 Mio, Ø Stärke 61.9 → 62.2), Betrieb +0.1, Verwaltung +0.1, Jugend +0.0 · abgestiegen 2 (Saldo 2.1 Mio, Ø Gehalt 0.37 Mio), aufgestiegen 4 (Saldo -2.9 Mio, Ø Gehalt 0.24 Mio), geblieben 14 (Saldo -2.2 Mio, Ø Gehalt 0.33 Mio)
```

---

## Lauf 23, 27.11.2026 nachts: Claude-Zweig 4fae573 (enthält popolupo-t20-zusammen 71d9702 mit den Korrekturen GM und GN)

Alle Tests. **55 grün, 2 rot**, gleich wie Lauf 22. `welt 10` (T22.1, Werte wie in Lauf 22) und akzeptanz (Abwehr +0,9). Das `finanzmodell 2` ist Zeile für Zeile gleich wie in Lauf 22, die KURZ- und Saldo-Zeilen stehen dort.

Zu GM2 (Spielraum 3–22 %): `tests/werbung.js` Nr. 28 schlug nach dem Zusammenführen fehl. Das letzte normale Angebot hatte über 20 % Spielraum, eine Absage ließ sich damit nicht mehr erzwingen. Claude hat den Test angepasst (4fae573): Übrig bleibt jetzt das Angebot mit dem kleinsten Spielraum. Am Spiel war nichts falsch.

---

## Lauf 22, 27.11.2026 kurz nach Mitternacht: Claude-Zweig ad7d927 (enthält popolupo-t20-zusammen 2ef1b7f mit den Korrekturen GL, dazu K24e, K24f und die Testanpassungen T21.1, T21.2)

Alle Tests. **55 grün, 2 rot**, das beste Ergebnis bisher. T21.1 und T21.2 sind grün. kalibrierung, medizin und sommer sind diesmal ebenfalls grün, ihre Randwerte schwanken von Lauf zu Lauf. Der App-Test `tests/desktop.js` war vor dem Lauf einzeln grün (11 ✓, mit den Änderungen aus GL). Rot:

- **akzeptanz:** Abwehr +0,9 (unverändert).
- **T22.1 welt 10** (offen, für popolupo, Nachfolger von T21.3): leere Gruppen in Computer-Kadern.

```
✗ Saisonende 2030: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 11 bis 30, 2 leere Gruppen, 0 zu lange unter dem Kreditrahmen (21 im Minus, erlaubt). Kleine Kader: Hamburger SV (Liga 1, am 1. Juli dein Verein): Kader 11, leer: TW/OM, am 1. Juli 10, nach dem Auffüllen nicht aufgefüllt, 1 Zugänge, Abgänge: keine
✗ Saisonende 2035: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto länger unter dem Kreditrahmen, als die Regeln bis zur Insolvenz erlauben: Kader 14 bis 30, 1 leere Gruppen, 0 zu lange unter dem Kreditrahmen (17 im Minus, erlaubt). Kleine Kader: Borussia Dortmund (Liga 1, am 1. Juli dein Verein): Kader 14, leer: IV, am 1. Juli 14, nach dem Auffüllen nicht aufgefüllt, 0 Zugänge, Abgänge: keine
✗ Ausgewogene Kader: keine Gruppe unbesetzt, höchstens 5 % der Vereine mit mehr als 2 Spielern Überhang je Gruppe (K31 §10): 2 %
```

**finanzmodell 2, KURZ-Zeilen** (seit eurer neuen Fassung drei Saisons):

```
KURZ 2026 L1: ein 137.7 Mio = TV 49.8 Mio + Werbung/Sonstiges 63.5 Mio + Spieltag 24.4 Mio | aus 127.2 Mio = Gehalt+Stab 75.0 Mio + Betrieb 1.5 Mio + Verwaltung 49.3 Mio + Jugend 1.4 Mio | Saldo 10.5 Mio
KURZ 2026 L2: ein 33.0 Mio = TV 12.4 Mio + Werbung/Sonstiges 10.9 Mio + Spieltag 9.7 Mio | aus 32.1 Mio = Gehalt+Stab 18.7 Mio + Betrieb 1.0 Mio + Verwaltung 11.0 Mio + Jugend 1.4 Mio | Saldo 0.9 Mio
KURZ 2026 L3: ein 10.6 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.8 Mio + Spieltag 4.5 Mio | aus 12.4 Mio = Gehalt+Stab 8.4 Mio + Betrieb 0.7 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -1.8 Mio
KURZ 2027 L1: ein 140.8 Mio = TV 49.8 Mio + Werbung/Sonstiges 64.3 Mio + Spieltag 26.7 Mio | aus 131.5 Mio = Gehalt+Stab 78.8 Mio + Betrieb 1.6 Mio + Verwaltung 49.6 Mio + Jugend 1.4 Mio | Saldo 9.3 Mio
KURZ 2027 L2: ein 31.5 Mio = TV 12.4 Mio + Werbung/Sonstiges 10.0 Mio + Spieltag 9.0 Mio | aus 30.7 Mio = Gehalt+Stab 17.8 Mio + Betrieb 0.9 Mio + Verwaltung 10.6 Mio + Jugend 1.4 Mio | Saldo 0.8 Mio
KURZ 2027 L3: ein 10.6 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.7 Mio + Spieltag 4.6 Mio | aus 13.4 Mio = Gehalt+Stab 9.4 Mio + Betrieb 0.7 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -2.8 Mio
KURZ 2028 L1: ein 140.6 Mio = TV 49.8 Mio + Werbung/Sonstiges 65.1 Mio + Spieltag 25.7 Mio | aus 133.0 Mio = Gehalt+Stab 80.1 Mio + Betrieb 1.6 Mio + Verwaltung 50.0 Mio + Jugend 1.4 Mio | Saldo 7.6 Mio
KURZ 2028 L2: ein 34.8 Mio = TV 12.4 Mio + Werbung/Sonstiges 11.1 Mio + Spieltag 11.2 Mio | aus 34.3 Mio = Gehalt+Stab 20.8 Mio + Betrieb 1.0 Mio + Verwaltung 11.1 Mio + Jugend 1.4 Mio | Saldo 0.5 Mio
KURZ 2028 L3: ein 10.6 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.8 Mio + Spieltag 4.5 Mio | aus 14.8 Mio = Gehalt+Stab 10.8 Mio + Betrieb 0.7 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -4.2 Mio
```

**finanzmodell 2, Saldo gegen das Ziel:** 5 ✓, 4 ✗.

```
✓ Saldo 1. Liga Saison 2026: 10.5 Mio je Verein (Ziel 11.0 Mio ± 1.5) · TV 49.8 Mio, Werbung/Sonstiges 63.5 Mio, Spieltag 24.4 Mio, Gehalt+Stab 75.0 Mio (Kader 28.4 Spieler, Ø Gehalt 2.53 Mio, Ø Stärke 73.4), Betrieb 1.5 Mio, Verwaltung 49.3 Mio
✓ Saldo 2. Liga Saison 2026: 0.9 Mio je Verein (Ziel 0.0 Mio ± 1.5) · TV 12.4 Mio, Werbung/Sonstiges 10.9 Mio, Spieltag 9.7 Mio, Gehalt+Stab 18.7 Mio (Kader 29.0 Spieler, Ø Gehalt 0.63 Mio, Ø Stärke 65.7), Betrieb 1.0 Mio, Verwaltung 11.0 Mio
✓ Saldo 3. Liga Saison 2026: -1.8 Mio je Verein (Ziel -1.0 Mio ± 1.5) · TV 1.3 Mio, Werbung/Sonstiges 4.8 Mio, Spieltag 4.5 Mio, Gehalt+Stab 8.4 Mio (Kader 28.6 Spieler, Ø Gehalt 0.29 Mio, Ø Stärke 61.0), Betrieb 0.7 Mio, Verwaltung 1.8 Mio
✗ Saldo 1. Liga Saison 2027: 9.3 Mio je Verein (Ziel 11.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +0.7, Spieltag +2.3, Gehalt+Stab +3.8 (Kader 28.4 → 27.9 Spieler, Ø Gehalt 2.53 → 2.75 Mio, Ø Stärke 73.4 → 74.3), Betrieb +0.2, Verwaltung +0.3, Jugend +0.0 · abgestiegen 0, aufgestiegen 2 (Saldo 22.6 Mio, Ø Gehalt 1.06 Mio), geblieben 16 (Saldo 7.6 Mio, Ø Gehalt 2.97 Mio)
✓ Saldo 2. Liga Saison 2027: 0.8 Mio je Verein (Ziel 0.0 Mio ± 1.5) · gegenüber Vorsaison: TV −0.0, Werbung/Sonstiges −0.9, Spieltag −0.7, Gehalt+Stab −0.9 (Kader 29.0 → 28.8 Spieler, Ø Gehalt 0.63 → 0.62 Mio, Ø Stärke 65.7 → 66.1), Betrieb −0.1, Verwaltung −0.4, Jugend +0.0 · abgestiegen 2 (Saldo -2.3 Mio, Ø Gehalt 0.64 Mio), aufgestiegen 3 (Saldo 3.2 Mio, Ø Gehalt 0.40 Mio), geblieben 13 (Saldo 0.7 Mio, Ø Gehalt 0.67 Mio)
✗ Saldo 3. Liga Saison 2027: -2.8 Mio je Verein (Ziel -1.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges −0.1, Spieltag +0.1, Gehalt+Stab +1.0 (Kader 28.6 → 28.6 Spieler, Ø Gehalt 0.29 → 0.34 Mio, Ø Stärke 61.0 → 62.0), Betrieb −0.0, Verwaltung −0.0, Jugend +0.0 · abgestiegen 3 (Saldo -3.9 Mio, Ø Gehalt 0.45 Mio), aufgestiegen 4 (Saldo -3.3 Mio, Ø Gehalt 0.25 Mio), geblieben 13 (Saldo -2.4 Mio, Ø Gehalt 0.34 Mio)
✗ Saldo 1. Liga Saison 2028: 7.6 Mio je Verein (Ziel 11.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +0.8, Spieltag −1.0, Gehalt+Stab +1.3 (Kader 27.9 → 27.0 Spieler, Ø Gehalt 2.75 → 2.93 Mio, Ø Stärke 74.3 → 74.5), Betrieb −0.1, Verwaltung +0.3, Jugend +0.0 · abgestiegen 0, aufgestiegen 2 (Saldo 12.5 Mio, Ø Gehalt 1.20 Mio), geblieben 16 (Saldo 6.9 Mio, Ø Gehalt 3.14 Mio)
✓ Saldo 2. Liga Saison 2028: 0.5 Mio je Verein (Ziel 0.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +1.1, Spieltag +2.2, Gehalt+Stab +3.0 (Kader 28.8 → 28.8 Spieler, Ø Gehalt 0.62 → 0.74 Mio, Ø Stärke 66.1 → 66.8), Betrieb +0.1, Verwaltung +0.5, Jugend +0.0 · abgestiegen 2 (Saldo 2.9 Mio, Ø Gehalt 1.16 Mio), aufgestiegen 3 (Saldo 0.2 Mio, Ø Gehalt 0.62 Mio), geblieben 13 (Saldo 0.2 Mio, Ø Gehalt 0.70 Mio)
✗ Saldo 3. Liga Saison 2028: -4.2 Mio je Verein (Ziel -1.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +0.0, Spieltag −0.1, Gehalt+Stab +1.4 (Kader 28.6 → 28.5 Spieler, Ø Gehalt 0.34 → 0.39 Mio, Ø Stärke 62.0 → 62.5), Betrieb +0.0, Verwaltung +0.0, Jugend +0.0 · abgestiegen 3 (Saldo -5.9 Mio, Ø Gehalt 0.53 Mio), aufgestiegen 4 (Saldo -3.5 Mio, Ø Gehalt 0.27 Mio), geblieben 13 (Saldo -4.0 Mio, Ø Gehalt 0.40 Mio)
```

---

## Lauf 21, 26.11.2026 nachts: Claude-Zweig 6e0ab41 (enthält popolupo-k24-antworten 762d613 mit den Korrekturen GK, K24d, Windows-App)

Alle Tests. **50 grün, 7 rot.** Davon sind vier unverändert wie in Lauf 19 und 20: kalibrierung (Auswärtssiege 29 %), medizin (Zerrungen 25 %), sommer (Kondition 79,6), akzeptanz (Abwehr +0,9). Das `finanzmodell 2` ist Zeile für Zeile gleich wie in Lauf 20. Neu rot:

- **T21.1 transfers** (erledigt von Claude): „alte Gegenangebote werden beim Laden gebunden“ meldete „Import false“. Der Test suchte `verhUmstellen()` in `importSave`, seit GK steht der Aufruf in `spielstandUebernehmen`. Der Test sucht jetzt in beiden, er ist grün. Am Spiel ist nichts falsch.
- **T21.2 ui-zwei-saisons** (erledigt von Claude): Zeitüberschreitung beim Laden des Text-Codes in Woche 8. Seit GK fragt das Spiel vor dem Ersetzen („Spielstand ersetzen?“), der Test klickte die Rückfrage nicht weg. Er klickt jetzt `#laden-ja`, falls die Rückfrage kommt, und ist grün (geprüft am Arbeitsstand).
- **T21.3 welt 10** (offen, für popolupo): 2032 nur 14 Wechsel mit Ablöse (mindestens 15), zum Saisonende 2034 ein Kader mit 9 Spielern und einer leeren Gruppe. Das alte Randproblem aus Lauf 15 und 16 ist wieder da, nachdem es in Lauf 19 und 20 grün war. Vermutlich ein Schmetterlingseffekt: K24d ändert die Fanstimmung des eigenen Vereins (Stadionname verkauft) und damit den weiteren Verlauf der Welt. Dass ein Computer-Verein bis auf 9 Spieler schrumpft, bleibt ein Fehler der Kaderplanung, unabhängig vom Auslöser. Nicht weiter untersucht.

---

## Lauf 20, 26.11.2026 nachts: Claude-Zweig 66776b1 (78e6b78 von popolupo, dazu L1, Erinnerung, Windows-App)

Kontrolllauf für die Änderungen von Claude an diesem Abend, alle Tests. **53 grün, 4 rot.** Die vier roten sind dieselben wie in Lauf 19, mit denselben Werten: kalibrierung (Auswärtssiege 29 %), medizin (Zerrungen 25 %), sommer (Kondition 79,6), akzeptanz (Abwehr +0,9). Das `finanzmodell 2` ist Zeile für Zeile gleich wie in Lauf 19, ebenso `welt 10`. Die neuen Tests `spielstand` und `ui-sicherung` sind grün. L1 und die Windows-App verschieben also nichts im Spiel.

K24d (f19c6b6) war in diesem Lauf noch nicht dabei, er folgt in Lauf 21.

---

## Lauf 19, 26.11.2026 abends: `popolupo-gj-korrekturen` (78e6b78, enthält t18-ligaklausel)

Nur getestet und geloggt. **51 grün, 4 rot.** Neu grün: welt 10 (alle zehn Saisons mit genug Wechseln, keine leeren Gruppen). Der Lauf ist an der Zeitgrenze der Hintergrundaufgabe in welt 10 abgebrochen; welt 10, die Browser-Tests und akzeptanz liefen danach neu. Alle vier roten Werte liegen knapp am Rand:

- **kalibrierung:** Auswärtssiege 29 % (Ziel 30–36 %).
- **medizin:** Anteil Zerrungen (Oberschenkel hinten) 25 % (Ziel 20–25 %), gerundet genau auf der Grenze.
- **sommer (neu rot):** Kondition zum ersten Ligaspiel nach der Vorbereitung 79,6 (Ziel 80–88).
- **akzeptanz:** Abwehr +0,9 (unverändert).

**finanzmodell 2, KURZ-Zeilen:**

```
KURZ 2026 L1: ein 137.7 Mio = TV 49.8 Mio + Werbung/Sonstiges 63.5 Mio + Spieltag 24.4 Mio | aus 127.7 Mio = Gehalt+Stab 75.5 Mio + Betrieb 1.5 Mio + Verwaltung 49.3 Mio + Jugend 1.4 Mio | Saldo 10.1 Mio
KURZ 2026 L2: ein 33.0 Mio = TV 12.4 Mio + Werbung/Sonstiges 10.9 Mio + Spieltag 9.7 Mio | aus 32.4 Mio = Gehalt+Stab 19.0 Mio + Betrieb 1.0 Mio + Verwaltung 11.0 Mio + Jugend 1.4 Mio | Saldo 0.6 Mio
KURZ 2026 L3: ein 10.6 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.8 Mio + Spieltag 4.4 Mio | aus 12.4 Mio = Gehalt+Stab 8.3 Mio + Betrieb 0.7 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -1.8 Mio
KURZ 2027 L1: ein 141.1 Mio = TV 49.8 Mio + Werbung/Sonstiges 64.5 Mio + Spieltag 26.7 Mio | aus 129.2 Mio = Gehalt+Stab 76.5 Mio + Betrieb 1.6 Mio + Verwaltung 49.7 Mio + Jugend 1.4 Mio | Saldo 11.8 Mio
KURZ 2027 L2: ein 31.4 Mio = TV 12.4 Mio + Werbung/Sonstiges 10.4 Mio + Spieltag 8.6 Mio | aus 32.5 Mio = Gehalt+Stab 19.6 Mio + Betrieb 0.9 Mio + Verwaltung 10.7 Mio + Jugend 1.4 Mio | Saldo -1.2 Mio
KURZ 2027 L3: ein 11.0 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.8 Mio + Spieltag 4.8 Mio | aus 13.7 Mio = Gehalt+Stab 9.6 Mio + Betrieb 0.7 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -2.7 Mio
```

**finanzmodell 2, Saldo gegen das Ziel:** 5 ✓, 1 ✗ (3. Liga 2027).

```
✓ Saldo 1. Liga Saison 2026: 10.1 Mio je Verein (Ziel 11.0 Mio ± 1.5) · TV 49.8 Mio, Werbung/Sonstiges 63.5 Mio, Spieltag 24.4 Mio, Gehalt+Stab 75.5 Mio (Kader 28.3 Spieler, Ø Gehalt 2.56 Mio, Ø Stärke 73.5), Betrieb 1.5 Mio, Verwaltung 49.3 Mio
✓ Saldo 2. Liga Saison 2026: 0.6 Mio je Verein (Ziel 0.0 Mio ± 1.5) · TV 12.4 Mio, Werbung/Sonstiges 10.9 Mio, Spieltag 9.7 Mio, Gehalt+Stab 19.0 Mio (Kader 29.2 Spieler, Ø Gehalt 0.64 Mio, Ø Stärke 65.8), Betrieb 1.0 Mio, Verwaltung 11.0 Mio
✓ Saldo 3. Liga Saison 2026: -1.8 Mio je Verein (Ziel -1.0 Mio ± 1.5) · TV 1.3 Mio, Werbung/Sonstiges 4.8 Mio, Spieltag 4.4 Mio, Gehalt+Stab 8.3 Mio (Kader 28.6 Spieler, Ø Gehalt 0.29 Mio, Ø Stärke 61.0), Betrieb 0.7 Mio, Verwaltung 1.8 Mio
✓ Saldo 1. Liga Saison 2027: 11.8 Mio je Verein (Ziel 11.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +1.0, Spieltag +2.4, Gehalt+Stab +1.0 (Kader 28.3 → 27.9 Spieler, Ø Gehalt 2.56 → 2.68 Mio, Ø Stärke 73.5 → 74.1), Betrieb +0.1, Verwaltung +0.4, Jugend +0.0 · abgestiegen 0, aufgestiegen 3 (Saldo 25.5 Mio, Ø Gehalt 0.93 Mio), geblieben 15 (Saldo 9.1 Mio, Ø Gehalt 3.04 Mio)
✓ Saldo 2. Liga Saison 2027: -1.2 Mio je Verein (Ziel 0.0 Mio ± 1.5) · gegenüber Vorsaison: TV −0.0, Werbung/Sonstiges −0.5, Spieltag −1.1, Gehalt+Stab +0.6 (Kader 29.2 → 28.9 Spieler, Ø Gehalt 0.64 → 0.67 Mio, Ø Stärke 65.8 → 66.4), Betrieb −0.2, Verwaltung −0.2, Jugend +0.0 · abgestiegen 3 (Saldo -5.5 Mio, Ø Gehalt 0.85 Mio), aufgestiegen 3 (Saldo 4.2 Mio, Ø Gehalt 0.37 Mio), geblieben 12 (Saldo -1.4 Mio, Ø Gehalt 0.70 Mio)
✗ Saldo 3. Liga Saison 2027: -2.7 Mio je Verein (Ziel -1.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +0.0, Spieltag +0.4, Gehalt+Stab +1.3 (Kader 28.6 → 28.9 Spieler, Ø Gehalt 0.29 → 0.34 Mio, Ø Stärke 61.0 → 62.2), Betrieb +0.1, Verwaltung +0.0, Jugend +0.0 · abgestiegen 3 (Saldo -2.1 Mio, Ø Gehalt 0.42 Mio), aufgestiegen 4 (Saldo -3.2 Mio, Ø Gehalt 0.24 Mio), geblieben 13 (Saldo -2.7 Mio, Ø Gehalt 0.36 Mio)
```

---

## Lauf 18, 26.11.2026 abends: `popolupo-t16-messung` (70f3128, enthält t15-korrekturen)

Nur getestet und geloggt. Der Spielcode ist gegenüber Lauf 17 unverändert, geändert sind nur `finanzmodell.js` und `kalibrierung-sweep.js`. Deshalb liefen nur diese beiden, beide mit exit 0. Die übrigen Ergebnisse aus Lauf 17 gelten weiter.

**finanzmodell 2, KURZ-Zeilen (Durchschnitt je Verein und Saison):**

```
KURZ 2026 L1: ein 137.7 Mio = TV 49.8 Mio + Werbung/Sonstiges 63.5 Mio + Spieltag 24.4 Mio | aus 127.7 Mio = Gehalt+Stab 75.5 Mio + Betrieb 1.5 Mio + Verwaltung 49.3 Mio + Jugend 1.4 Mio | Saldo 10.1 Mio
KURZ 2026 L2: ein 33.0 Mio = TV 12.4 Mio + Werbung/Sonstiges 10.9 Mio + Spieltag 9.7 Mio | aus 32.4 Mio = Gehalt+Stab 19.0 Mio + Betrieb 1.0 Mio + Verwaltung 11.0 Mio + Jugend 1.4 Mio | Saldo 0.6 Mio
KURZ 2026 L3: ein 10.6 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.8 Mio + Spieltag 4.4 Mio | aus 12.4 Mio = Gehalt+Stab 8.3 Mio + Betrieb 0.7 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -1.8 Mio
KURZ 2027 L1: ein 141.1 Mio = TV 49.8 Mio + Werbung/Sonstiges 64.5 Mio + Spieltag 26.7 Mio | aus 129.2 Mio = Gehalt+Stab 76.4 Mio + Betrieb 1.6 Mio + Verwaltung 49.7 Mio + Jugend 1.4 Mio | Saldo 11.9 Mio
KURZ 2027 L2: ein 31.4 Mio = TV 12.4 Mio + Werbung/Sonstiges 10.4 Mio + Spieltag 8.6 Mio | aus 33.4 Mio = Gehalt+Stab 20.5 Mio + Betrieb 0.9 Mio + Verwaltung 10.7 Mio + Jugend 1.4 Mio | Saldo -2.0 Mio
KURZ 2027 L3: ein 10.9 Mio = TV 1.3 Mio + Werbung/Sonstiges 4.8 Mio + Spieltag 4.8 Mio | aus 14.2 Mio = Gehalt+Stab 10.1 Mio + Betrieb 0.7 Mio + Verwaltung 1.8 Mio + Jugend 1.5 Mio | Saldo -3.3 Mio
```

**finanzmodell 2, Saldo gegen das Ziel (K23 Nr. 25):** 4 ✓, 2 ✗ (2. und 3. Liga 2027, beide vor allem wegen höherer Gehälter).

```
✓ Saldo 1. Liga Saison 2026: 10.1 Mio je Verein (Ziel 11.0 Mio ± 1.5) · TV 49.8 Mio, Werbung/Sonstiges 63.5 Mio, Spieltag 24.4 Mio, Gehalt+Stab 75.5 Mio (Kader 28.3 Spieler, Ø Gehalt 2.56 Mio, Ø Stärke 73.5), Betrieb 1.5 Mio, Verwaltung 49.3 Mio
✓ Saldo 2. Liga Saison 2026: 0.6 Mio je Verein (Ziel 0.0 Mio ± 1.5) · TV 12.4 Mio, Werbung/Sonstiges 10.9 Mio, Spieltag 9.7 Mio, Gehalt+Stab 19.0 Mio (Kader 29.2 Spieler, Ø Gehalt 0.64 Mio, Ø Stärke 65.8), Betrieb 1.0 Mio, Verwaltung 11.0 Mio
✓ Saldo 3. Liga Saison 2026: -1.8 Mio je Verein (Ziel -1.0 Mio ± 1.5) · TV 1.3 Mio, Werbung/Sonstiges 4.8 Mio, Spieltag 4.4 Mio, Gehalt+Stab 8.3 Mio (Kader 28.6 Spieler, Ø Gehalt 0.29 Mio, Ø Stärke 61.0), Betrieb 0.7 Mio, Verwaltung 1.8 Mio
✓ Saldo 1. Liga Saison 2027: 11.9 Mio je Verein (Ziel 11.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +1.0, Spieltag +2.4, Gehalt+Stab +0.9 (Kader 28.3 → 28.0 Spieler, Ø Gehalt 2.56 → 2.68 Mio, Ø Stärke 73.5 → 74.1), Betrieb +0.1, Verwaltung +0.4, Jugend +0.0
✗ Saldo 2. Liga Saison 2027: -2.0 Mio je Verein (Ziel 0.0 Mio ± 1.5) · gegenüber Vorsaison: TV −0.0, Werbung/Sonstiges −0.5, Spieltag −1.1, Gehalt+Stab +1.5 (Kader 29.2 → 28.7 Spieler, Ø Gehalt 0.64 → 0.70 Mio, Ø Stärke 65.8 → 66.4), Betrieb −0.2, Verwaltung −0.2, Jugend +0.0
✗ Saldo 3. Liga Saison 2027: -3.3 Mio je Verein (Ziel -1.0 Mio ± 1.5) · gegenüber Vorsaison: TV +0.0, Werbung/Sonstiges +0.0, Spieltag +0.4, Gehalt+Stab +1.8 (Kader 28.6 → 28.8 Spieler, Ø Gehalt 0.29 → 0.36 Mio, Ø Stärke 61.0 → 62.2), Betrieb +0.1, Verwaltung +0.0, Jugend +0.0
```

**kalibrierung-sweep (461 s, Vergleich, kein Fehler im Spiel):**

```
✓ heute                              Meister-Median  76 (66/80/76/74) · Favorit 67 % · Heim 42 % · Remis 25 % · Tore 2.97 · Elfmeter 0.24
✗ Exponent 1,65                      Meister-Median  68 (67/65/69/68) · Favorit 65 % · Heim 45 % · Remis 26 % · Tore 3.01 · Elfmeter 0.26
✓ Exponent 1,75                      Meister-Median  73 (73/76/68/69) · Favorit 67 % · Heim 44 % · Remis 25 % · Tore 3.05 · Elfmeter 0.24
✗ überragend 0,15                    Meister-Median  67 (67/71/66/66) · Favorit 75 % · Heim 43 % · Remis 26 % · Tore 2.98 · Elfmeter 0.23
✓ überragend 0,30                    Meister-Median  75 (72/69/75/78) · Favorit 71 % · Heim 42 % · Remis 26 % · Tore 3.03 · Elfmeter 0.24
✓ Exponent 1,65 + überragend 0,15    Meister-Median  73 (67/71/73/85) · Favorit 71 % · Heim 45 % · Remis 24 % · Tore 3.08 · Elfmeter 0.26
Ziele: Meister-Median 70–85 · Favorit (Top 3 gegen Letzte 3) 65–75 % · Heim 40–46 % · Remis 23–27 % · Tore 2,9–3,3 · Elfmeter 0,2–0,3
```

---

## Lauf 17, 26.11.2026 abends: `popolupo-t15-korrekturen` (e97431f, enthält t14-finanzen)

Nur getestet und geloggt. **52 grün, 3 rot.** welt (2 Saisons) und spielermodell wieder grün. Rot:

- **welt 10:** nur noch 2032 mit 13 Wechseln mit Ablöse (mindestens 15; 16 Vereinslose, 19 Vereine im Minus). Alle Saisonenden mit Kader 20 bis 30 und ohne leere Gruppe.
- **kalibrierung:** „Gleich stark: Heimsieg“ 47 % (n=248, Ziel 40–46 %) steht jetzt unter PROBLEME, deshalb exit 1. Die übrigen Werte sind grün oder gelb.
- **akzeptanz:** Abwehr +0,9 (unverändert).
- **finanzmodell 2 (Saldo je Verein und Saison):** 1. Liga +10,1 / +11,9 Mio., 2. Liga +0,6 / −2,0 Mio., 3. Liga −1,8 / −3,3 Mio. (erwartet etwa +11, 0, −1). Die 1. Liga trifft jetzt beide Saisons. 2. und 3. Liga fallen in der zweiten Saison weiter ab.

---

## Lauf 16, 26.11.2026 abends: `popolupo-t14-finanzen` (aabbce8, enthält gi-korrekturen)

Nur getestet und geloggt. **50 grün, 5 rot.** medizin und jugend wieder grün. Rot:

- **welt (2 Saisons):** 2027 nur 12 Wechsel mit Ablöse (mindestens 15). **welt 10:** 2032 11, 2033 14, 2034 12 Wechsel mit Ablöse; Saisonende 2030 Kader 13 mit einer leeren Gruppe.
- **spielermodell:** 2. Liga Spanne 2,2 (69,8 → 72,0), T1.3 Rest.
- **kalibrierung:** nur gelbe Randwerte.
- **akzeptanz:** Abwehr +0,9.
- **finanzmodell 2 (Saldo je Verein und Saison):** 1. Liga +10,1 / +14,4 Mio., 2. Liga +0,7 / −1,8 Mio., 3. Liga −1,8 / −3,0 Mio. (erwartet etwa +11, 0, −1). Die erste Saison trifft die Erwartung jetzt fast, die zweite liegt in allen Ligen darunter bzw. bei der 1. Liga darüber.

---

## Lauf 15, 26.11.2026 abends: `popolupo-gi-korrekturen` (6760284, enthält t12)

Nur getestet und geloggt. **49 grün, 5 rot.** wettbewerbe und spielermodell jetzt grün (72 Stunden erledigt, 2. Liga im Rahmen). Rot:

- **medizin (neu):** „Fit gespritzt: spielt mit Wirkung ×0,95“: einsatzbereit false, Wirkung ×0,950. Der gespritzte Spieler gilt nicht als einsatzbereit.
- **welt 10:** zwei Saisons mit 12 bzw. 14 Wechseln mit Ablöse (mindestens 15); ein Saisonende mit Kader 12 und einer leeren Gruppe.
- **jugend:** Prägungen 1,99 je Verein (mindestens 2), am Rand.
- **kalibrierung:** nur gelbe Randwerte (Favoritensieg 64 %, Pokal gegen Amateure 88 %, Ballbesitz-Spanne), Meisterpunkte nicht mehr rot.
- **akzeptanz:** Abwehr +0,9.
- **finanzmodell 2:** unverändert zu Lauf 14 (1. Liga +14,0 / +16,4, 2. Liga −1,2 / −3,8, 3. Liga −2,5 / −3,7 Mio. je Verein und Saison).

---

## Lauf 14, 26.11.2026 abends: `popolupo-t12-korrekturen` (a36f093, enthält k43e)

Nur getestet und geloggt. **49 grün, 5 rot.** jugend wieder grün; welt 10 ohne Trainerwechsel-Fund und ohne Konten zu lange unter dem Kreditrahmen. Rot:

- **wettbewerbe:** 72 Stunden 2×, jetzt Leverkusen 105 (Europapokal Do) / 107 (Liga Sa) und 252 / 254 (Do → Sa).
- **welt 10:** 2032 nur 12 und 2035 nur 14 Wechsel mit Ablöse (mindestens 15); Saisonende 2030 ein Kader mit 14 Spielern und einer leeren Gruppe.
- **kalibrierung:** Punkte des Meisters (Median) 66, 64, 76, 65 (Ziel 70–85).
- **spielermodell:** 2. Liga Spanne 2,3 (69,7 → 72,0), T1.3 Rest.
- **akzeptanz:** Abwehr +0,9.
- **finanzmodell 2:** 1. Liga +14,0 / +16,4 Mio., 2. Liga −1,2 / −3,8 Mio., 3. Liga −2,5 / −3,7 Mio. je Verein und Saison (erwartet etwa +11, 0, −1).

---

## Lauf 13, 26.11.2026: `popolupo-k43e-vertrauenszonen` (2672476, enthält gh-korrekturen)

Nur getestet und geloggt. **48 grün, 6 rot, alle Zahlen genau wie in Lauf 12** (wettbewerbe 72 Stunden 2× So Liga → Di Europapokal, welt 10 wie oben, jugend 1,98, kalibrierung Meisterpunkte 66/66/75/66, spielermodell 2. Liga 2,6, akzeptanz Abwehr +0,9, finanzmodell gleich). K43e und gh-korrekturen ändern an den Testergebnissen nichts.

---

## Lauf 12, 26.11.2026: `popolupo-k43d-mitwachsend-erfolg` (0368e92, enthält t11-korrekturen)

Nur getestet und geloggt. **48 grün, 6 rot.** Wieder grün: fuzz-karrieren, welt (2 Saisons), sommer, und alle übrigen bis auf:

- **wettbewerbe:** 72 Stunden noch 2×: Bayern 255 (Liga So) / 257 (Europapokal Di), Frankfurt 108 (Liga So) / 110 (Europapokal Di). Also Sonntag Liga → Dienstag Europapokal.
- **welt 10:** Trainerwechsel 200 in 10 Saisons, 1. Liga höchstens 8 je Saison, aber ein Verein 4-mal in einer Saison (2030, Energie Cottbus; erlaubt 3). Eine Saison nur 13 Wechsel mit Ablöse (mindestens 15). In 8 Saisons 1 bis 4 Vereine zu lange unter dem Kreditrahmen (13 bis 21 im Minus, das ist erlaubt). Zweimal Kader 13 bzw. 14 mit einer leeren Gruppe.
- **jugend:** Prägungen 1,98 je Verein (mindestens 2), am Rand.
- **kalibrierung:** Punkte des Meisters (Median) 66, 66, 75, 66 (Ziel 70–85); sonst nichts rot.
- **spielermodell:** 2. Liga Spanne 2,6 (69,7 → 72,3), T1.3 Rest.
- **akzeptanz:** nur noch Abwehr +0,9 (Verhältnis und Tempo im Ziel).
- **finanzmodell 2 (Saldo je Verein und Saison):** 1. Liga +14,0 / +14,4 Mio., 2. Liga −1,2 / −2,8 Mio., 3. Liga −2,5 / −3,5 Mio. (erwartet etwa +11, 0, −1).

---

## Lauf 11, 26.11.2026 nachmittags: `popolupo-w5g-usability-leitfaden` (ce62ffe, enthält t10b und t10c)

Nur getestet und geloggt. **45 grün, 8 rot** (Lauf 10: 29 grün). Wieder grün u. a. seed, ui-zwei-saisons, medizin, transfers, vorstand, finanzen, schwierigkeit, kabine, scouting, karten, presse, abwerben, disziplin, testspiele, taktik, europapokal, ui-lernstufen, live-neuladen, ui-zugang. Rot:

- **fuzz-karrieren:** ein Fehler „Aktion: Cannot set properties of null (setting 'value')“ (eine Aktion setzt den Wert eines Elements, das es nicht gibt). Sonst keine Funde, die Punkt- und Pokalprüfungen sind ruhig.
- **wettbewerbe:** 72 Stunden noch 3× (Bayern 255/257, Frankfurt 108/110, Hoffenheim …), vorher 12×.
- **welt:** Sternejagd wie T9.2; Saisonende 2026 und 2027 je ein Konto unter dem Kreditrahmen. **welt 10:** Trainerwechsel 200 in 10 Saisons (Grenze höchstens 18 je Saison in der 1. Liga, kein Verein öfter als dreimal), Sternejagd, Saisonende 2034 und 2035 je 4 Konten unter dem Kreditrahmen.
- **kalibrierung:** 3 rot: Favoritensieg Top 3 gegen Letzte 3 60 % (Ziel 65–75), gleich stark Heimsieg 49 % (Ziel 40–46), Elfmeter je Spiel 0,33 (Ziel 0,2–0,3).
- **sommer:** Kondition zum ersten Ligaspiel 77,6 (Ziel 80–88).
- **spielermodell:** 2. Liga Spanne 2,3 (69,6 → 71,9), T1.3 Rest.
- **akzeptanz:** Abwehr +0,8 und Verhältnis wie immer, Tempo diesmal im Ziel.
- **finanzmodell 2 (Saldo je Verein und Saison):** 1. Liga +13,4 / +12,7 Mio., 2. Liga −1,1 / −3,0 Mio., 3. Liga −2,4 / −3,8 Mio. (erwartet etwa +11, 0, −1).

---

## Lauf 10, 26.11.2026: `popolupo-w5e10-intro` (566ae45, enthält alles bis gc-korrekturen)

Nur getestet und geloggt, keine Ursachen gesucht (Auftrag: wenig Aufwand). Grün: 29 Tests (u. a. code, lizenz, statistik, werbung, stadion, marketing, fans, geruechte, live, training, ausland, zweite, leihe, vertraege, ui-lernstufen, live-neuladen, ui-zugang). Rot:

- **seed:** „Speichern, Neuladen und Weiterspielen nach Halt 33 ergibt anderen Verlauf“ (Wiederholbarkeit verletzt, wahrscheinlich Zustand außerhalb von `S`).
- **TypeError „Cannot assign to read only property“** (Tests setzen eingefrorene `REGELN`, vermutlich die neuen Schalter): medizin (`ohne`), transfers (`ab`), vorstand (`grenzen`, Test bricht ab).
- **Schalter-Tests rot:** finanzen (TV-Raten 2×), schwierigkeit (Schalter aus/an/von außen, Menü TV-Raten), kabine (Sprachgrüppchen), scouting (Unsicherheit), spielermodell (Integration und Deutsch 2×), wettbewerbe (Länderspiele 3×, Marktwert Nationalspieler), testspiele (Zimmerbelegung).
- **Weitere neue Fälle rot:** abwerben (Computer-Vereine werben ab: kein Versuch), disziplin (Rote Karte für den Trainer: Rot undefined), karten (lachender Dritter, Lager-Ereignisse, Nachtleben, Choreo), presse (Medienprofile, Trotz Maulkorb, Sticheleien, Schiedsrichterkritik), scouting (Konkurrenz am Tisch: „Chance 0 [object Object]“, Scoutbericht), taktik (Durchschaut: Meldungen 1/1), transfers (Mondpreise höchstens 1,88, Gegenangebot, K20c Bieterwettstreit: Gegenangebot null).
- **Punkte inkonsistent** (Prüfung in `pruefungen.js`: Punkte ≠ 3 × Spiele − Remis): ui-zwei-saisons 36×, fuzz-karrieren 95×. Vermutlich Punktabzug nach Insolvenz, die Prüfung zieht ihn nicht ab. Dazu wieder T9.4 (Pokal am zweiten Tag) 1× bzw. 4×.
- **welt:** Konten im Minus zum Saisonende 14 (2026) und 16 (2027); Sternejagd wie T9.2. **welt 10:** Trainerwechsel 200 in 10 Saisons (Grenze: höchstens 18 je Saison in der 1. Liga, kein Verein öfter als dreimal), 2031 und 2032 nur 13 Wechsel mit Ablöse (mindestens 15).
- **wettbewerbe:** 72 Stunden noch 12× (T8.2), europapokal: 4 Fälle unter drei Tagen bei 6 Vereinen.
- **Randwerte:** medizin Rückfall 16 %, Kreuzbandrisse 9,5; kabine Wechselwunsch 1,05 je Kader (höchstens 1); kalibrierung 1 gelb; spielermodell und akzeptanz wie immer.
- **finanzmodell 2 (K23c, Salden je Verein und Saison):** 1. Liga +13,9 / +12,3 Mio. (erwartet etwa +11), 2. Liga −1,0 / −1,7 Mio. (erwartet etwa 0), 3. Liga −2,7 / −3,8 Mio. (erwartet etwa −1). Einnahmen 1. Liga 137,8 Mio. (TV 49,8, Sponsor 63,5, Spieltag 24,4), Gehälter 75,7 Mio. Rohausgabe: Scratchpad von Claude, auf Wunsch vollständig.

---

## Lauf 9, 22.11.2026: `popolupo-u19d-kaderliste` (2c16d91: K23b, K23d, U19d1, Korrekturen zu Lauf 8)

Nur getestet. Erledigt: T8.1 (finanzen grün), T8.3 (training grün). Grün außerdem lizenz, europapokal, werbung, transfers, vorstand, jugend, ui-lernstufen, live-neuladen, seed, ui-zugang.
- **T8.2 teilweise:** Pokal nach dem Europapokal verlegt. Rest in `wettbewerbe.js` (Seed 4, drei Saisons): 12-mal Do Europapokal → Sa Liga, einmal So Liga → Di Liga.
- **T9.2 `welt.js` Sternejagd:** Käufer im gebauten Fall (Wolfsburg) liegt bei 121 % des Gehaltsrahmens (K23d), darf darum nicht kaufen, trotz 500 Mio. auf dem Konto. Testfall passt nicht mehr.
- **T9.3 `welt.js` „kein Konto im Minus“:** Saisonende 2027 fünf Drittligisten im Minus (−0,1 bis −3,4 Mio., Rahmen 114–164 %). Schnitt der Konten 1. Liga 50,6 → 103,5 Mio. in einer Saison.
- **T9.4 Pokalprüfung in `pruefungen.js`** (ui-zwei-saisons 1×, fuzz-karrieren 5×): „Pokal: 0 Runden, laut Kalender 1“ am zweiten Pokaltag. Die Prüfung kennt den zweiten Tag nicht.
- **medizin:** Kreuzbandrisse 1. Liga 12,5 je Saison (vorher 9–10, Ziel 3–8). sommer 79,7 (Grenze 80), spielermodell 2. Liga Spanne 2,1, kalibrierung drei gelbe Randwerte, akzeptanz wie immer.
- **T5.3 Europapokal:** CL über drei Saisons 1× Sieger (Bayern 2026), 3× Achtelfinale, 4× K.-o.-Play-offs, 4× Ligaphase; Länderwertung GER 6., 3., 11.

---

## Lauf 8, 22.11.2026: `popolupo-t5-korrekturen` (5253729, auf 0fae7b8)

Nur getestet, am Code von popolupo nichts geändert.

**Erledigt laut Lauf 8:** T5.1 und T5.5 (`lizenz.js` grün, Gleichschritt wieder 150 Tage), T5.4 (`ui-zwei-saisons.js` grün). T5.3 deutlich besser (siehe unten). CH4 nicht einzeln geprüft.

| Test | Ergebnis |
|---|---|
| lizenz, europapokal, werbung, statistik, welt, jugend und alle übrigen Node-Tests außer den unten genannten | grün |
| alle Browser-Tests (ui-zwei-saisons, fuzz-karrieren, ui-lernstufen, live-neuladen, seed, ui-zugang) | grün |
| wettbewerbe | rot (1): **T5.2 noch offen**, siehe T8.2 |
| finanzen | rot (1): T8.1 (Fehler im Test) |
| training | rot (2): T8.3, neu |
| spielermodell | rot (2): T1.3 Rest, 2. Liga 69,8 → 72,2, 3. Liga 65,4 → 68,0 |
| kalibrierung | rot (3, alle gelb am Rand): Elfmetertore 8 %, Elfmeter 0,32, Favoritensieg 64 % (Ziel ab 65 %) |
| medizin | rot (3, am Rand): Zerrungen 25 %, Rückfall 16 %, Kreuzbandrisse 9,0 |
| akzeptanz | rot (3) wie immer: Abwehr +0,8, Verhältnis, Tempo 5,8 ms (Rechner war nebenbei belastet) |

**T8.2 (zu T5.2) `wettbewerbe.js` „72 Stunden“: noch 23 Fälle.** Nachgebaut mit Seed 5 über eine Saison: alle Fälle sind **Donnerstag Europapokal → Samstag Liga** (6) oder **Donnerstag Europapokal → Samstag Pokal** (1), zum Beispiel Leverkusen Do 22.10. Europa League / Sa 24.10. Bundesliga, Freiburg Do 20.8. Conference League (Qualifikation) / Sa 22.8. DFB-Pokal. Mittwoch → Freitag kommt nicht mehr vor. `ligaVerlegen` müsste nach einem Donnerstag auf den Sonntag schieben (so plant es auch die DFL für Vereine in der Europa League).

**T8.1 `finanzen.js` „mindestens 9 Monatsberichte“: 4.** Kein Fehler im Spiel: In dieser Welt wird der Trainer der Testsimulation (Freiburg, Seed 4711) an Tag 221 entlassen und wechselt zu Union Berlin. Beim Vereinswechsel beginnt `S.finV` neu (`finanzenJobwechsel`), zum Saisonende stehen darum nur 4 Berichte. In Lauf 7 kam die Entlassung erst am Saisonende (11 Berichte). Vorschlag: Der Test zählt die Berichte bis zum Vereinswechsel mit, oder er wählt einen Verein, der nicht entlassen wird, oder er schaltet die Entlassung ab.

**T8.3 `training.js` neu rot:** „Training wirkt: Kondition der Startelf mindestens 10 höher als mit Schonen“ 77,9 gegen 68,6 (Lauf 7: 79,5 gegen 68,5) und „Training kostet nicht zu viel: höchstens ein Verletzter mehr“ 3,0 gegen 2,0 (Lauf 7: 2,4 gegen 2,5). Zwischen Lauf 7 und Lauf 8 hat sich nur dieser Korrekturzweig geändert (Verlegung und Stärke im Europapokal). Vermutung: Die verlegten Spiele machen den Spielplan dichter, weniger Trainingstage, mehr Belastung. Nicht untersucht.

**T5.3 nach der Korrektur (Faktor 0,93), gemessen wie in Lauf 5 (Seed 5, drei Saisons):**

| Saison | Champions League | Europa League | Conference League | Länderwertung GER |
|---|---|---|---|---|
| 2026 | FCB K.-o.-Play-offs, BVB, RBL, VFB Ligaphase | B04 Achtelfinale, TSG Ligaphase | SCF Ligaphase | 16. von 19 |
| 2027 | FCB Viertelfinale, SCF K.-o.-Play-offs, BMG, B04 Ligaphase | FCA K.-o.-Play-offs, VFB Ligaphase | SGE Achtelfinale | 8. von 19 |
| 2028 | VFB Halbfinale, SGE Viertelfinale, FCB Achtelfinale, BVB Ligaphase | B04 Finale, RBL Ligaphase | SCF Halbfinale | 2. von 19 |

Champions League: 6-mal Ligaphase (vorher 9), 2-mal K.-o.-Play-offs, je einmal Achtelfinale und Halbfinale, 2-mal Viertelfinale, kein deutscher Sieger. Sieger: Chelsea, Liverpool, Liverpool (CL), Sturm Graz, Brentford, Anderlecht (EL), Gent, Bilbao, Groningen (ECL). Damit näher an K37 §10, die Hälfte scheidet aber noch in der Ligaphase aus.

**Neu von Claude auf dem Claude-Zweig** (seit Lauf 7, nicht in diesem Korrekturzweig): Sponsorentag in drei Größen auf Wunsch des Nutzers (c50db88): klein, mittel, groß mit Kosten nach Liga, Zuschlag gewürfelt in 5–7 %, 7–10 % oder 8–11 %, als Rückmeldung nur ein Text (Erfolg, voller Erfolg, grandioser Erfolg). Betrifft nur `js/werbung.js`, `daten/regeln.js` (`RF.werbung.sponsorentag`) und `tests/werbung.js`.

---

## Lauf 7, 21./22.11.2026 nachts: Claude-Zweig mit K24b und K24c (452dc0f, auf eb3efbe)

**Neu von Claude** (Rest von K24, wie im Entwicklungsprotokoll abgesprochen). popolupos Spitze eb3efbe ist dafür in den Claude-Zweig geholt (5d8444b, ohne Konflikt).
- **K24b** (f5f0d50): je Fläche (auch die Brust) ein viertes Angebot eines umstrittenen Geldgebers (30 % über dem besten festen, zwei Jahre, Fans −5 bei Vertragsschluss und −1 an jedem Monatsersten über `fanAnlass(…,'fanD',…)`, Skandal mit 5 % je Saison: Fans −10 und kostenlose Kündigung). Sponsorentag (50.000 €, offene Angebote +10 %, einmal je Saison). Werbewert aus K25 (`S.mk.ww`) als Faktor auf neue Angebote, höchstens ±15 %. Automatik und Vorstand nehmen nie den umstrittenen Geldgeber.
- **K24c** (fd16ce3): Zufriedenheit je Vertrag zum Saisonende (`werbungSaisonende` in `saison.js` neben `marketingSaisonende`), Verlängerungsangebot zufriedener Partner (ab 70, 10 % mehr), Abstiegsklausel (−40 %). **Für popolupo:** Die Laufzeit der Brust zählt jetzt in `werbungSaison` herunter, die Zeile `if(S.spons){S.spons.yrs--…}` in `newSeason` ist weg. `sponsOffers` hängt das Verlängerungsangebot an, bevor die Automatik wählt.
- **Geld:** Ohne deine Wahl unverändert (der Vorstand nimmt das erste Angebot). Bei K23c gern die Höhen in `RF.sponsor` ändern, die drei Flächen hängen über `RF.werbung.anteil` daran.

| Test | Ergebnis |
|---|---|
| werbung (32 Prüfungen, davon 21 neu für K24b und K24c) | grün |
| alle übrigen Node-Tests | genau wie in Lauf 5: grün bis auf T5.1 und T5.5 (lizenz), T5.2 (wettbewerbe), T1.3 Rest (spielermodell), Randwerte in kalibrierung, jugend, medizin. Dieselben Zahlen, K24b und K24c verschieben nichts |
| lizenz | „Sponsor: Der Verein nimmt sofort das höchste feste Angebot“ und „kein Nachteil“ grün (+2,8 ± 2,3 Punkte) |
| fuzz-karrieren, ui-lernstufen, live-neuladen, seed, ui-zugang | grün |
| ui-zwei-saisons | rot (1): nur T5.4 wie in Lauf 5 (Pokalsperre im Europapokal), die neuen Werbeflächen und der Sponsorentag laufen über die echte Oberfläche ohne Fehler |
| akzeptanz | rot (2) wie immer: Abwehr +0,8, Verhältnis der Bereiche (Tempo diesmal im Ziel) |

Lauf 6 (nur K24b) wurde nach 12 grünen Tests abgebrochen, weil K24c den Saisonwechsel berührt und Lauf 7 beides prüft.

---

## Lauf 5, 21.11.2026 abends: `popolupo-u19-europapokal` (eb3efbe), enthält K23a, K23e, K25a, K25b, K26a, U19a bis U19c

Nur getestet, nichts am Code geändert (Auftrag „nur testen“). Die Spitze baut auf 362fa12 auf, alle Korrekturen aus Lauf 3 und 4 sind drin.

| Test | Ergebnis |
|---|---|
| finanzen, marketing, stadion, europapokal (neu) | grün beim ersten Lauf |
| alle übrigen Node-Tests außer den unten genannten (30), dazu werbung, statistik, welt, sommer | grün. **sommer jetzt 84,8 (T3.2 erledigt durch die veränderte Welt)** |
| fuzz-karrieren, ui-lernstufen, live-neuladen, seed, ui-zugang | grün |
| lizenz | rot (2): T5.1 und T5.5 |
| wettbewerbe | rot (1): T5.2 |
| ui-zwei-saisons | rot (1): T5.4 |
| spielermodell | rot (2): 2. Liga 69,8 → 71,8 (Spanne 2,0), 3. Liga 65,3 → 68,0 (Spanne 2,7), T1.3 Rest |
| kalibrierung | rot, nur zwei gelbe Randwerte (Elfmetertore 8 %, Elfmeter 0,32 je Spiel), besser als in Lauf 4 |
| jugend, medizin | am Rand wie früher (Prägungen 1,95, Rückfall 15 %) |
| akzeptanz | rot (3) wie immer: Abwehr +0,8, Verhältnis der Bereiche, Tempo 4,18 ms |

**T5.1 `lizenz.js` Gleichschritt nur 25 Tage (vorher 150).** Ursache gemessen: Ereigniskarte „Ein Spieler heiratet“ (U12d) am Mo 27.7. Sie trifft deinen Verein, also im einen Lauf einen Freiburger (Stimmung +2), im anderen einen Bielefelder. Wie bei der Gerüchteküche (T1.1) eine gewollte Ungleichheit, die Karte kam vorher nur nicht in den ersten 150 Tagen (der Europapokal ändert die Spiele je Woche und damit das Kartenbudget). Ohne Gerüchte und ohne Karten (`kartenWoche`) sind es wieder 150 Tage gleich. Vorschlag: Der Test nimmt auch die Karten aus.

**T5.5 `lizenz.js` „Jede Aktion in js/aktionen.js prüft ihren Bereich: startBuild“.** Kein Fehler im Spiel: `startBuild` reicht seit K26a an `bauStarten` (stadion.js) weiter, und das prüft `darf('stadion')`. Die Prüfung im Test liest nur die Aktion selbst. Vorschlag: `darf('stadion')` auch in `startBuild`. Nebenbei: `startBuildAlt` wird nirgends aufgerufen.

**T5.2 `wettbewerbe.js` „72 Stunden“: 24 Fälle**, zum Beispiel Bayern an den Tagen 112/114 (Mi 21.10. Champions League, Fr 23.10. Bundesliga), 147/149, 210/212. `ligaVerlegen` (U19a) verlegt Ligaspiele nach einem Europapokal-Abend nicht weit genug. `europapokal.js` lässt einen Fall je Saison zu und ist darum grün. **Echter Fund.**

**T5.4 `ui-zwei-saisons.js` „1 gesperrte/verletzte Spieler eingesetzt“ (Do 27.8.).** Kein Fehler im Spiel. Nachgebaut: Jordy Makengo (Freiburg) spielte in der Qualifikation der Conference League und war nur im DFB-Pokal gesperrt, das ist erlaubt (Sperren je Wettbewerb seit U19a). Der Test vergleicht bei allem außer der Liga mit der Pokalsperre. Vorschlag: bei `wbVon(r)==='eu'` die Sperre `eu` prüfen.

**T5.3 Europapokal zu schwer für deutsche Vereine (CC2, gemessen mit Seed 5 über drei Saisons):**

| Saison | Champions League | Europa League | Conference League | Länderwertung GER |
|---|---|---|---|---|
| 2026 | FCB Achtelfinale, BVB, RBL, VFB Ligaphase | B04 K.-o.-Play-offs, TSG Ligaphase | SCF Ligaphase | 17. von 19 |
| 2027 | FCB, KOE, SGE, RBL Ligaphase | SCF, SVW Ligaphase | kein deutscher Verein in der Ligaphase | 18. von 19 |
| 2028 | BVB, FCB K.-o.-Play-offs, B04, RBL Ligaphase | VFB, WOB Ligaphase | SGE Viertelfinale | 12. von 19 |

Summe in der Champions League: 9-mal Ligaphase, 2-mal K.-o.-Play-offs, 1-mal Achtelfinale, kein deutscher Sieger. Sieger: Chelsea, Chelsea, Atlético Madrid (CL), Juventus, Bodø/Glimt, Başakşehir (EL), Gent, Bilbao, Lech Posen (ECL). K37 §10 nennt „meist Achtelfinale in der Champions League“. Nicht untersucht, ob die Blockstärke der Auslandsvereine (`euStaerke`) oder die Belastung der Deutschen den Ausschlag gibt.

**BZ7 `node tests/finanzmodell.js 2` (Seed 4711, auf eb3efbe, also mit Europapokal):**

```
Saison 2026, 1. Liga, 18 Vereine: Einnahmen 42.4 Mio (TV 10.1 Mio, Sponsor 7.9 Mio, Spieltag 24.4 Mio), Ausgaben 32.6 Mio (Gehälter 29.7 Mio), Saldo 9.8 Mio je Verein, Spanne -8.4 Mio bis 31.0 Mio, mit Minus 1, heutige Pauschale 5.2 Mio
  schwächste: Bayer 04 Leverkusen (Ansehen 84): ein 40.4 Mio, aus 48.8 Mio, Saldo -8.4 Mio, heute 7.2 Mio | 1. FC Union Berlin (Ansehen 64): ein 27.2 Mio, aus 26.5 Mio, Saldo 0.7 Mio, heute 4.2 Mio | TSG Hoffenheim (Ansehen 70): ein 32.2 Mio, aus 30.7 Mio, Saldo 1.4 Mio, heute 5.0 Mio
  stärkste: Hamburger SV (Ansehen 66): ein 46.6 Mio, aus 27.5 Mio, Saldo 19.0 Mio, heute 4.4 Mio | FC Schalke 04 (Ansehen 64): ein 48.0 Mio, aus 23.5 Mio, Saldo 24.5 Mio, heute 4.2 Mio | Borussia Dortmund (Ansehen 86): ein 73.0 Mio, aus 42.1 Mio, Saldo 31.0 Mio, heute 7.5 Mio
Saison 2026, 2. Liga, 18 Vereine: Einnahmen 14.6 Mio (TV 3.3 Mio, Sponsor 1.7 Mio, Spieltag 9.6 Mio), Ausgaben 14.5 Mio (Gehälter 12.1 Mio), Saldo 0.1 Mio je Verein, Spanne -4.8 Mio bis 6.6 Mio, mit Minus 9, heutige Pauschale 2.8 Mio
  schwächste: VfL Wolfsburg (Ansehen 62): ein 15.2 Mio, aus 20.0 Mio, Saldo -4.8 Mio, heute 3.9 Mio | SV Darmstadt 98 (Ansehen 51): ein 11.1 Mio, aus 14.4 Mio, Saldo -3.4 Mio, heute 2.7 Mio | SpVgg Greuther Fürth (Ansehen 47): ein 8.4 Mio, aus 11.4 Mio, Saldo -3.0 Mio, heute 2.3 Mio
  stärkste: 1. FC Nürnberg (Ansehen 54): ein 19.6 Mio, aus 14.7 Mio, Saldo 4.9 Mio, heute 3.0 Mio | 1. FC Kaiserslautern (Ansehen 55): ein 21.2 Mio, aus 15.4 Mio, Saldo 5.8 Mio, heute 3.1 Mio | Hertha BSC (Ansehen 57): ein 23.7 Mio, aus 17.2 Mio, Saldo 6.6 Mio, heute 3.3 Mio
Saison 2026, 3. Liga, 20 Vereine: Einnahmen 6.3 Mio (TV 1.4 Mio, Sponsor 0.5 Mio, Spieltag 4.5 Mio), Ausgaben 9.2 Mio (Gehälter 7.0 Mio), Saldo -2.9 Mio je Verein, Spanne -6.2 Mio bis 4.0 Mio, mit Minus 16, heutige Pauschale 1.8 Mio
  schwächste: TSG 1899 Hoffenheim II (Ansehen 35): ein 2.3 Mio, aus 8.4 Mio, Saldo -6.2 Mio, heute 1.4 Mio | SV Wehen Wiesbaden (Ansehen 40): ein 3.7 Mio, aus 9.4 Mio, Saldo -5.7 Mio, heute 1.8 Mio | VfB Stuttgart II (Ansehen 35): ein 2.2 Mio, aus 7.7 Mio, Saldo -5.4 Mio, heute 1.4 Mio
  stärkste: Hansa Rostock (Ansehen 46): ein 13.3 Mio, aus 11.9 Mio, Saldo 1.4 Mio, heute 2.4 Mio | Alemannia Aachen (Ansehen 44): ein 12.4 Mio, aus 11.0 Mio, Saldo 1.4 Mio, heute 2.2 Mio | Fortuna Düsseldorf (Ansehen 47): ein 17.1 Mio, aus 13.1 Mio, Saldo 4.0 Mio, heute 2.5 Mio
Dein Verein SC Freiburg: laufender Saldo nach den echten Buchungen 6.8 Mio, nach dem Modell 5.6 Mio
Saison 2027, 1. Liga, 18 Vereine: Einnahmen 44.4 Mio (TV 10.2 Mio, Sponsor 8.0 Mio, Spieltag 26.3 Mio), Ausgaben 32.0 Mio (Gehälter 28.9 Mio), Saldo 12.5 Mio je Verein, Spanne -13.8 Mio bis 30.2 Mio, mit Minus 1, heutige Pauschale 5.3 Mio
  schwächste: Bayer 04 Leverkusen (Ansehen 85): ein 41.0 Mio, aus 54.8 Mio, Saldo -13.8 Mio, heute 7.4 Mio | 1. FC Union Berlin (Ansehen 65): ein 27.8 Mio, aus 27.5 Mio, Saldo 0.2 Mio, heute 4.3 Mio | TSG Hoffenheim (Ansehen 72): ein 33.1 Mio, aus 27.5 Mio, Saldo 5.6 Mio, heute 5.3 Mio
  stärkste: Hertha BSC (Ansehen 61): ein 39.4 Mio, aus 18.0 Mio, Saldo 21.4 Mio, heute 3.8 Mio | FC Schalke 04 (Ansehen 65): ein 48.2 Mio, aus 22.1 Mio, Saldo 26.1 Mio, heute 4.3 Mio | Borussia Dortmund (Ansehen 84): ein 71.8 Mio, aus 41.6 Mio, Saldo 30.2 Mio, heute 7.2 Mio
Saison 2027, 2. Liga, 18 Vereine: Einnahmen 13.8 Mio (TV 3.3 Mio, Sponsor 1.6 Mio, Spieltag 8.9 Mio), Ausgaben 15.3 Mio (Gehälter 13.0 Mio), Saldo -1.5 Mio je Verein, Spanne -11.9 Mio bis 8.2 Mio, mit Minus 11, heutige Pauschale 2.7 Mio
  schwächste: SC Freiburg (Ansehen 62): ein 18.1 Mio, aus 30.0 Mio, Saldo -11.9 Mio, heute 3.9 Mio | SC Paderborn 07 (Ansehen 51): ein 9.8 Mio, aus 17.6 Mio, Saldo -7.8 Mio, heute 2.7 Mio | SV Elversberg (Ansehen 49): ein 7.8 Mio, aus 14.5 Mio, Saldo -6.6 Mio, heute 2.4 Mio
  stärkste: 1. FC Kaiserslautern (Ansehen 50): ein 19.4 Mio, aus 16.5 Mio, Saldo 2.9 Mio, heute 2.5 Mio | Karlsruher SC (Ansehen 54): ein 16.7 Mio, aus 12.4 Mio, Saldo 4.3 Mio, heute 3.0 Mio | Fortuna Düsseldorf (Ansehen 51): ein 21.6 Mio, aus 13.4 Mio, Saldo 8.2 Mio, heute 2.7 Mio
Saison 2027, 3. Liga, 20 Vereine: Einnahmen 5.9 Mio (TV 1.3 Mio, Sponsor 0.5 Mio, Spieltag 4.0 Mio), Ausgaben 9.6 Mio (Gehälter 7.5 Mio), Saldo -3.8 Mio je Verein, Spanne -7.6 Mio bis 0.8 Mio, mit Minus 18, heutige Pauschale 1.7 Mio
  schwächste: SV Darmstadt 98 (Ansehen 41): ein 6.8 Mio, aus 14.4 Mio, Saldo -7.6 Mio, heute 1.9 Mio | SV Wehen Wiesbaden (Ansehen 40): ein 3.8 Mio, aus 10.3 Mio, Saldo -6.5 Mio, heute 1.8 Mio | FC Ingolstadt 04 (Ansehen 37): ein 3.6 Mio, aus 9.0 Mio, Saldo -5.4 Mio, heute 1.6 Mio
  stärkste: MSV Duisburg (Ansehen 39): ein 10.1 Mio, aus 10.6 Mio, Saldo -0.4 Mio, heute 1.7 Mio | Hansa Rostock (Ansehen 42): ein 11.8 Mio, aus 11.7 Mio, Saldo 0.1 Mio, heute 2.0 Mio | Alemannia Aachen (Ansehen 43): ein 12.4 Mio, aus 11.6 Mio, Saldo 0.8 Mio, heute 2.1 Mio
Dein Verein VfL Bochum: laufender Saldo nach den echten Buchungen -0.6 Mio, nach dem Modell 1.1 Mio
```

**Zu den Hinweisen im Entwicklungsprotokoll:** Die Änderungen an `tests/sim.js` (Vereinswechsel ruft `finanzenStart`, `bauAbgeben`, `finanzenJobwechsel`, `marketingJobwechsel`) passen. CH4 (`supercupAnlegen` mit Amateur-Pokalsieger) und CI1 (der 1. Juli läuft nicht durch `taeglich`) sind noch nicht bearbeitet, dieser Lauf war nur ein Testlauf.

---

## Lauf 4, 21.11.2026: Claude-Zweig mit K24a Werbeflächen (887b0e2, danach 5910b26)

**Neu von Claude: K24a Werbeflächen** (726a439, Doku 887b0e2): Ausrüster und Ärmel neben der Trikotbrust, je Fläche drei Angebote und höchstens ein Vertrag, Automatik je Fläche, ohne Wahl das erste Angebot vor dem ersten Pflichtspiel. Vorläufig geldneutral (die drei teilen sich den bisherigen Brustbetrag 60 / 29 / 11 %), die Höhen aus K24 §5.1 erst mit K23. Neue Datei `js/werbung.js`, Test `tests/werbung.js`, `tests/vorbereitung.js` angepasst (Werbeverträge sind erst erledigt, wenn alle Flächen vergeben sind). **Für popolupo:** K24 ist damit angefangen, bitte nicht parallel daran bauen. Frei sind K23, K25, K26 und U19.

| Test | Ergebnis |
|---|---|
| alle Node-Tests außer den unten genannten (33), dazu werbung (neu) und statistik | grün |
| ui-zwei-saisons, ui-lernstufen, live-neuladen, seed, ui-zugang | grün |
| fuzz-karrieren | rot in Lauf 4 (T4.1), nach der Korrektur grün |
| spielermodell, sommer, kalibrierung, medizin, disziplin, akzeptanz | wie in Lauf 3 (T1.3 Rest, T3.2, Werte am Rand). Gleiche Zahlen wie in Lauf 3: K24a ist wirklich geldneutral |

**T4.1 (erledigt in 5910b26):** Die Abwanderung brachte Auslandsvereinen bis zum Saisonende zu viele Kernspieler (Manchester City und Inter Mailand je 15, erlaubt 6–10). Jetzt kauft ein Auslandsverein nur, wenn der Spieler bei ihm einen Kernplatz bekäme, höchstens einmal je Sommer, und sein Kern wird gleich auf Plan gekürzt. Danach geprüft: spielermodell (2. Liga Spanne jetzt 2,0), sommer, welt, ausland, statistik, lizenz, transfers, werbung, fuzz-karrieren.

---

## Lauf 3, 21.11.2026: Claude-Zweig mit den Korrekturen (b53a0c2, danach b4c97a4)

Am 20.11. abends kam nichts Neues dazu, getestet und korrigiert wurde der Stand von Lauf 2. Claude hat dafür `popolupo-u18b-spielwelt-karten` (cb3649b) in den Claude-Zweig geholt (2ee1122). **Für popolupo:** Bitte vor dem Weiterbauen den Zweig `claude/compassionate-galileo-bsbua4` holen, die Korrekturen stecken in Code und Tests von U11 bis U18b.

**Erledigt** (Fund, Commit, was geändert ist):

| Fund | Commit | Änderung |
|---|---|---|
| T2.1 | 551f97e | `presse.js`, `abwerben.js`, `fans.js`: Sponsorwahl nur, wenn Angebote da sind |
| T2.2 | 551f97e | `abwerben.js` prüft den Stimmungsfaktor bei festem Interesse (Code unverändert, die doppelte Wirkung steht so in K20 §11) |
| T2.6 | 551f97e | `ausland.js`: Verkauf außerhalb des Fensters wird erst vorgemerkt, dann zum Fensterbeginn geprüft |
| T2.7 | 551f97e | `schwierigkeit.js` vergleicht Leicht und Schwer Tag für Tag |
| T2.8 | 551f97e | `__scan` nimmt „zu null“ aus, `ui-zwei-saisons.js` liest die Zahl der Erinnerungs-Schalter aus den Regeln |
| T1.5 | 551f97e | `transfers.js` bietet nach der Pause die aktuelle Forderung |
| T1.2 | 551f97e | `welt.js`: Aufbau füllt die Gruppe auf, Stammspieler gut genug (der Code von `planBedarf` blieb) |
| T2.3 | 6cb54e2 | Gerüchte: Fehlt ein Anlass, erfinden die Medien etwas (vorläufig) |
| T2.4 | 6cb54e2 | Trainerpool wird nach der Besetzung wieder auf 12 freie aufgefüllt (eigener Strom) |
| T1.1 | 1bcbd3c | Leihen haben eine Automatik (vorläufig, K36 Grundsatz 1): Dein Verein leiht in der Automatik nach den Regeln der Computer-Vereine und meldet es. Der Gleichschritt-Test nimmt die Gerüchteküche aus (sie trifft gezielt deinen Verein), wie schon die Testspiele |
| T2.5 | 76e52de, f885c60 | Statistik nach 20 Saisons gemessen: 662 KB (Kurve 101, 176, 244, 303 … ab Saison 13 etwa 650 KB), die Prüfung für kurze Läufe erlaubt das 2,5-Fache des Schnitts. Verletzungsakte wird zu jedem Saisonwechsel gekürzt. `save()` meldet einmal, wenn der Browser nicht speichert (bisher still). Grenze des Spielstands: 3 MB Welt plus 1 MB Statistik (K33, K34) |
| T1.3 | 76e52de | Ursache gemessen: Seit U11a verpflichteten Vereine starke Vereinslose ohne Grenze (in der 3. Liga bis 16 über ihrer Grundstärke), und seit U11c hielten sie rund 99 % der Wichtigen (früh und beim Saisonwechsel), der frühere Abfluss starker Spieler fehlte. Geändert (alles vorläufig): Vereinslose höchstens Grundstärke + 2, Wichtige ab 30 nicht früh und nur zu 60 %, Abwanderung ins Ausland in der letzten Woche des Sommerfensters (K32 §8: 1. Liga 6–12, 2. Liga 3–6, 3. Liga 2–5). Ergebnis: 1. und 3. Liga im Rahmen, **2. Liga noch knapp darüber** (siehe unten) |
| T1.4 | b53a0c2 | Namen für sieben Auswahlfelder und das Exportfeld, Rolle `img` für den Regler, Kabinen-Tabelle per Tastatur scrollbar, Nebenschrift `--mist` etwas heller (Kontrast 4,5:1). Im Test: Tab-Startpunkt an den Seitenanfang (nach `blur()` machte Chrome an der letzten Stelle weiter) und Vergleich ohne Großschreibung (der Knopf steht per CSS in Großbuchstaben) |
| T3.1 | b4c97a4 | Neu in Lauf 3 gefunden: Beim Wechsel ins Ausland gingen laufende Statistikzeile, Karriere und Ehrung verloren (Spielertore ≠ Tabellentore). Jetzt wird die Zeile vorher abgeschlossen, `kar`, `kas`, `ehj` bleiben |

**Ergebnisse Lauf 3** (Node-Tests auf b53a0c2, `statistik.js` danach auf b4c97a4 wieder grün):

| Test | Ergebnis |
|---|---|
| alle übrigen Node-Tests (31) | grün, darunter welt, lizenz (Gleichschritt 150 Tage), transfers, ausland, schwierigkeit, presse, abwerben, fans, geruechte, trainerpool |
| ui-zwei-saisons | grün |
| spielermodell | rot (1): 2. Liga 69,8 → 72,4 (Spanne 2,6, höchstens 2). 1. Liga 77,1 → 78,1 und 3. Liga 65,4 → 67,1 im Rahmen |
| sommer | rot (1): T3.2 |
| kalibrierung | rot (5, davon 4 gelb am Rand): Favoritensieg Top 3 gegen Letzte 3 60 % (Ziel 65–75 %, n=73, war schon vor U11 rot) |
| medizin | rot (1): Kreuzbandrisse 9,0 (wie vorher) |
| disziplin | rot (1): Hitzköpfe 1,72-mal so viele Karten (Ziel 1,3–1,7), am Rand |

**T3.2 `tests/sommer.js` „Kondition zum ersten Ligaspiel nach der Vorbereitung 80–88“: 78,1** (Lauf 2: 80,3, vor U11: 84,8). Gemessen: derselbe Kader (24 Spieler, keine Neuzugänge), die Kondition entwickelt sich anders. Ohne die Abwanderung ins Ausland wären es 82,0, ohne die Grenze für Vereinslose 78,4, ohne die Regel ab 30 79,6. Dein Verein ist von der Abwanderung nicht betroffen, der Weg führt über die Welt (Gegner, Belastung der Vorsaison). Nicht weiter untersucht. **Offen.**

**T1.3 Rest:** Die 2. Liga liegt je nach Lauf zwischen 1,9 und 2,7 Spanne (Grenze 2,0). Weitere Stellschrauben (Anspruch gedeckelt, Verlängerung je Liga) brachten nichts Messbares und sind wieder raus. **Offen.**

---

## Lauf 2, 20.11.2026: `popolupo-u18b-spielwelt-karten` (cb3649b)

Die Spitze enthält alle Zweige von U11 bis U18b (Stand 17:27) und den Merge mit e8ea42d. Getestet als Ganzes. Für die neuen Funde ist der auslösende Commit angegeben, wo er gemessen ist.

| Test | Ergebnis | Fund |
|---|---|---|
| code, berater, beziehungen, karten, vorstand, spielwelt-karten (neu), vorbereitung (neu), disziplin, jugend, kabine, leihe, live, scouting, sommer, stab, taktik, testspiele, training, vertraege, wettbewerbe, zufall, zweite | grün | jugend wieder grün (T1.7 erledigt) |
| ui-lernstufen, live-neuladen, seed (Browser) | grün | |
| presse, abwerben, fans (neu) | Abbruch beim Aufbau | T2.1, mit Testkorrektur: presse grün, fans grün, abwerben T2.2 |
| geruechte (neu) | rot (1) | T2.3 |
| trainerpool (neu) | rot (1) | T2.4 |
| statistik (neu) | rot (1) | T2.5 |
| welt | rot (1) | T1.2 offen |
| lizenz | rot (1) | nur noch T1.1, Halte wieder grün (T1.6 erledigt) |
| spielermodell | rot (3) | T1.3 offen, Werte wie in Lauf 1 |
| transfers | rot (1) | T1.5 offen |
| ausland | rot (2) | **neu**, T2.5 und T2.6 |
| schwierigkeit | rot (1) | **neu**, T2.7 |
| kalibrierung | rot (3, alle gelb am Rand) | Remis 23 %, Pokal gegen Amateure 95 % (Ziel bis 94 %), Ballbesitz wie vorher |
| medizin | rot (1) | Kreuzbandrisse 9,5 (vorher 10,0), wie vorher |
| ui-zwei-saisons | rot (63) | **neu**, T2.8 |
| fuzz-karrieren | rot (104) | **neu**, T2.8 |
| ui-zugang | rot (6) | T1.4 offen, genau dieselben Verstöße wie in Lauf 1 |
| akzeptanz | rot (3) | wie vorher: Abwehr +0,8, Verhältnis der Bereiche, Tempo 4,71 ms |

**T2.1 Testhilfe `welt(true)` in `tests/presse.js`, `tests/abwerben.js`, `tests/fans.js` bricht ab** (`TypeError: Cannot read properties of null (reading '0')` in `sponsorWaehlen`). Mit Lernstufen wählt der Verein den Sponsor sofort (`sponsorAuto` in `sponsOffers`), danach ist `S.sponsOffers` leer. Korrektur wie in den älteren Tests: `if(S.sponsOffers)F.sponsorWaehlen(0)`. In einer Testkopie mit dieser einen Zeile: presse grün, fans grün, abwerben siehe T2.2. Kein Fehler im Spiel.

**T2.2 `tests/abwerben.js` „schlechte Stimmung ×1,3“: gemessen ×1,40** (11,80 → 16,51). Ursache: `abwPlus` nimmt die Stimmung zweimal, einmal über `wechselInteresse(p)` (hängt selbst an der Stimmung) und einmal über den Faktor `stimmung.unter`. Hotel gegen Restaurant (×2,0) und zwei Treffen (×1,4) stimmen. **Offen:** Soll die Stimmung doppelt wirken (dann Test anpassen), oder nur über einen der beiden Wege?

**T2.3 `tests/geruechte.js` „1 bis 3 Gerüchte je Woche“: Wochen ohne Gerücht** (0 1 0 1 2 2 1 1 1 0 1 1). Gemessen in einer frischen Welt: `gerKandidaten()` liefert 12 Wochen lang 0 eigene und 0 fremde Anlässe. Ein Platz bekommt dann nur ein Gerücht, wenn der Wurf „erfunden“ trifft, sonst bleibt er leer. Ohne die Vorbereitung des Tests waren es höchstens 1 je Woche, in 6 von 12 Wochen keins. Vorschlag: Fehlt ein Anlass, wird erfunden. Oder der Test baut vorher Anlässe.

**T2.4 `tests/trainerpool.js` „nach dem Saisonwechsel mindestens 12 frei“: 11.** Knapp unter der Grenze, am Anfang sind es genau 12. Der Pool wächst beim Saisonwechsel nicht nach.

**T2.5 Speicherbedarf (U13 Statistik):** `tests/statistik.js` 176 KB nach 2 Saisons (Grenze 100 KB, also anteilig 1 MB nach 20 Saisons). Passend dazu `tests/ausland.js` „Spielstand unter 3 MB“: 1757, 2665, 2898, 3010, 3072, 3164 KB nach 1 bis 6 Saisons (vor U11: höchstens 2629 KB, in U12: 2821 KB).

**T2.6 `tests/ausland.js` „Verkauf ins Ausland“ rot, ein Fehler im Test.** Die 40 Aufrufe von `weiter()` davor enden in U18b am 28.12. (Tag 180), also außerhalb des Fensters. Das Spiel merkt den Wechsel dann richtig nur vor (`p.wech` ab Tag 184, Geld gebucht, Angebot erledigt). In U12 endete die Schleife noch im Fenster. Vorschlag: Der Test stellt das Datum ins Fenster oder ruft danach `wechselTag` auf.

**T2.7 `tests/schwierigkeit.js` „Gleiche Ergebnisse auf Leicht und Schwer“ rot seit U15 (bc11332; U14 e445032 ist noch grün).** Ein Fehler im Test, kein Unterschied im Spiel. Der neue Halt „Deadline Day“ (Erinnerung `deadline`) hält nur auf Leicht (Tag 62 und 215). Der Test schaltet beide Welten Halt für Halt weiter und vergleicht danach verschiedene Tage. Tag für Tag verglichen sind die Ergebnisse bis zur Entlassung auf Schwer (Tag 290) gleich. Vorschlag: im Test beide Welten bis zum selben `S.tag` laufen lassen. Ohne den Markttag am Deadline Day (`deadlineTag`) bleibt der Test rot, daran liegt es also nicht.

**T2.8 `tests/ui-zwei-saisons.js` und `tests/fuzz-karrieren.js`: Fehlalarm „null“ (U13).** Die Textprüfung `__scan` in `tests/pruefungen.js` sucht `\bnull\b` gegen kaputte Anzeigen und schlägt bei der neuen Zeile „Torhüter: Spiele zu null“ in der Statistik an (62 von 63 und alle 104 Meldungen). Vorschlag: „zu null“ in `__scan` ausnehmen oder die Zeile umbenennen. Die einzige weitere Meldung in `ui-zwei-saisons`: „Menü: 7 statt 5 Erinnerungs-Schalter“. Seit U14 (`vorbereitung`) und U15 (`deadline`) sind es 7, der Test erwartet noch 5.

**Stand der Funde aus Lauf 1:** T1.1, T1.2, T1.3, T1.4, T1.5 offen. T1.6 und T1.7 auf U18b grün.

---

## Lauf 1, 20.11.2026: `popolupo-u11-computer-vereine` (c309f56) und `popolupo-u12-vorstand` (70e10e2)

Beide Zweige lagen auf fba0ec9 (U10d). Ergebnisse von U11 und U12 sind bis auf die genannten Ausnahmen gleich.

| Test | U11 | U12 | gegen den Stand davor |
|---|---|---|---|
| code, berater, leihe, vertraege, zweite, ausland, kabine, live, sommer, stab, taktik, training, wettbewerbe, schwierigkeit, scouting, testspiele, zufall | grün | grün | unverändert grün |
| vorstand, beziehungen, karten (neu) | – | grün | erster Lauf, fehlerfrei |
| welt (neu) | 39 von 40 | 39 von 40 | erster Lauf, siehe T1.2 |
| lizenz | rot (2) | rot (2) | **neu rot**, T1.1 und T1.6 |
| spielermodell | rot (3) | rot (3) | **neu rot**, T1.3 |
| transfers | grün | rot (1) | **neu rot in U12**, T1.5 |
| jugend | rot (1) | rot (1) | neu rot, knapp, T1.7 |
| kalibrierung | rot (1) | rot (3) | wie vorher, Werte schwanken |
| medizin | rot (1) | rot (1) | wie vorher, andere Werte am Rand |
| disziplin | rot (1) | grün | Gelb-Rot 0,06 genau am Rand, Rauschen |
| ui-zwei-saisons, fuzz-karrieren, ui-lernstufen, live-neuladen, seed (Browser) | grün | grün | unverändert grün |
| ui-zugang (neu) | – | rot (6) | erster Lauf, T1.4 |
| akzeptanz | rot (3) | rot (3) | wie vorher (Abwehr +0,8, Verhältnis, Tempo 4,9 ms statt 5,4 ms) |

**T1.1 Gleichschritt in `tests/lizenz.js` bricht nach 4 Tagen (vorher 150).** Ursache gemessen: Am Mo 6.7. (erster Montag im Fenster) leiht sich Arminia Bielefeld (Verein 30, im Lauf mit dem Stab ein Computer-Verein) Zento Uno von Gladbach aus. Im Vergleichslauf ist Bielefeld der eigene Verein, und der eigene Verein leiht nie von selbst (Bereich `leihe` ohne Automatik, U10d). Dort bleibt Uno frei, und Freiburg kauft ihn (5,93 Mio €). Budget, Bedarf und Profil von Freiburg sind in beiden Läufen gleich. Der Bruch kommt also aus U11d1 (Leihen unter Computer-Vereinen) zusammen mit der Entscheidung aus U10d, nicht aus der Automatik des Kaufs. **Offen, Entscheidung nötig:** Automatik für `leihe`, oder der Test wählt als Vergleichsverein einen, der im Fenster nicht leiht, oder der Gleichschritt gilt nur bis zum ersten Fenster.

**T1.2 `tests/welt.js` Nr. 6d „Leihe: der Bedarf ist weg“ rot.** Zwei Ursachen:
- Im Code (`planBedarf` in `js/computer.js`): Ist der Geliehene stärker als der verletzte Stammspieler, steht er selbst auf einem Stammplatz. Der Verletzte bleibt Stammspieler (die ersten `G.stamm` nach Stärke), als Ersatz zählt nur der Dritte. Der Bedarf „verletzt“ bleibt. Gemessen: IV mit Soll 4, Stammplätze 2, nach der Leihe 74/gesund, 70/verletzt 70 Tage, 60, 56.
- Im Test: Der Aufbau „Gruppe genau besetzen“ lässt die Gruppe bei 3 statt 4, wenn sie vorher unter dem Soll war (`slice(G0.soll)` entfernt nichts, aufgefüllt wird nicht).

**T1.3 `tests/spielermodell.js`: Die Ligen werden über die Saisons stärker.** Schnitt der besten 14 über 6 Saisons, 1. Liga 77,6 → 79,4 (vorher 77,3 → 77,0), 2. Liga 69,9 → 73,2 (vorher 69,5 → 71,3), 3. Liga 65,5 → 68,9 (vorher 64,9 → 65,9). Ursache nicht untersucht. Vermutung: Das Auffüllen am Ende des Sommerfensters und die Käufe nach Kaderplan holen mehr Stärke aus dem Pool der Vereinslosen und dem Ausland in die Ligen, als durch Abgänge verloren geht.

**T1.4 `tests/ui-zugang.js` (erster Lauf, Verstöße waren angekündigt):** schwere Verstöße nach axe: Kabine `scrollable-region-focusable` (1×), Spielplan `select-name` (1×), Finanzen `aria-prohibited-attr` (1×), Training & Jugend `color-contrast` (3×) und `select-name` (5×), Menü `label` (1×). Tastatur: „Tag beenden“ ist mit Tab nach 80 Schritten nicht erreicht. Grün: Fokus im Fenster beim Öffnen, Escape schließt Spielerkarte und Menü, jeder Fokus sichtbar.

**T1.5 `tests/transfers.js` „Nach der Pause wird wieder verhandelt“ rot (nur U12).** Kein Fehler im Spiel, der Test passt nicht mehr: Zwei Spottangebote kosten seit U12c je −3 Beziehung, dadurch steigt die Forderung (`forderungDu` mit `bezAbloese`) um knapp 1 %. Der Test bietet nach der Pause noch die alte Forderung `F0`. Vorschlag: nach der Pause `forderung(p)` neu holen.

**T1.6 `tests/lizenz.js` „Mit Lernstufen nicht mehr Halte als ohne“:** 47 gegen 44 (vorher 39 gegen 53). Nicht untersucht.

**T1.7 `tests/jugend.js` „Prägungen je Verein 2 bis 5“:** 1,95 (vorher 2,37). Knapp unter der Grenze, vermutlich eine Folge der anderen Welt.

**Nur zur Ansicht aus `tests/welt.js` (nicht gewertet):** Zugänge über den Markt je Verein im Sommer 1,1 und 0,8 (K31 §10 nennt 3 bis 8 für alle Zugänge zusammen). Trainerwechsel in der 1. Liga 2026: 4, 2027: 0 (Ziel 4 bis 10). Budget im letzten Fenster zu 6 % genutzt. Der Langzeitlauf `node tests/welt.js 10` ist noch nicht gelaufen.

**Hinweis Zusammenführen:** Der Fix der Trainerstab-Gehälter steht doppelt (a789c0a und e8ea42d). Seit dem Merge um 17:17 ist das erledigt.
