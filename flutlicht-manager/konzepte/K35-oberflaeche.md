# K35 – Oberfläche und Bedienung

Status: **Entwurf**. Hängt ab von: allen Konzepten, weil jedes Bildschirme braucht. Grundlage für die Umsetzung ab U1.

**Stand U1 (6.11.):** Die Bausteine aus `muster/regler.html` stehen jetzt in `js/regler.js` und `css/regler.css` und sind im Spiel eingebaut: Kopfzeile, Büro, Kader, Spielerkarte, Finanzen (Ticketpreis als Stell-Regler mit Zuschauer-Spanne), Stadion, Aufstellung und Vorbericht (Tauziehen). Die Musterseite bleibt die Referenz für Aussehen und neue Bausteine. Ohne Trainerstab (K16) hat die Vorhersage noch eine feste Genauigkeit: Die Spanne reicht vom schwächsten bis zum stärksten Gegner.

**Vorschlag zur Aufteilung:**
- **K35a Bedienkonzept und Regler-Bausteine:** schon in **Welle 1**, weil jede Stufe danach Bildschirme baut.
- **K35b Look und Stil:** in **Welle 5**, wie bisher geplant.

## 1. Ziel und Spielgefühl

- **Auf einen Blick sehen,** wo ein Wert steht, wo sein Maximum liegt und wo das Optimum. Deshalb stellen wir alles, was eine Größe hat, als **Regler** dar, nicht als nackte Zahl.
- **Schnell spielen:** In einer normalen Woche braucht man ein bis zwei Klicks pro Entscheidung. Tiefe gibt es auf Wunsch, nicht als Pflicht (Lehre aus CM 01/02 und FM26).
- **Ehrliche Unsicherheit:** Was man nicht genau weiß, sieht auch unscharf aus, als Spanne oder Fragezeichen.
- **Retro-Gefühl der 90er** mit eigener Gestaltung: Anzeigetafel, Flutlicht, Mischpult. Kein Nachbau eines bestimmten Spiels.

## 2. Vorbilder und Abgrenzung

- **Aus dem Genre:** Büro als Zentrale, Kalenderblatt, Kontostand, Symbolleiste, Aufstellung per Ziehen und Ablegen (bei Anstoss-Fans beliebt).
- **Lehre aus FM26:** keine Suche durch Untermenüs, eine Schnellansicht statt Seitenwechsel, Bedienung auf PC und Handy gleich gut.
- **Unser eigenes Element:** das **Regler-System**. Anzeigen sehen aus wie LED-Balken einer Anzeigetafel, Eingaben wie die Schieberegler eines Mischpults.

## 3. Das Regler-System

Fünf Arten, alle aus einem Baukasten.

### 3.1 Anzeige-Regler (nur lesen)

Zeigt den Wert zwischen Minimum und Maximum, dazu Markierungen.

```
Stärke      |██████████████████████▌░░░░▒▒▒▒▒▒░░░░░░░░░░░|  72
            1          Ø Liga 68 ┘     └─ Talent 80–86     99
```

- **Füllung** = aktueller Wert. **Schraffur dahinter** = erreichbares Maximum, also das Talent, nur als Spanne (siehe 3.3).
- **Feine Markierungen** für Vergleiche: Liga-Schnitt, Mannschafts-Schnitt, Wert des Spielers, gegen den er konkurriert.
- **Zonen** in Farbe, aber nie nur über die Farbe lesbar. Beispiel Frische:

```
Frische     |███████████████████████████████████████▌░░░░|  88 %
            0        ⚠ Verletzungsgefahr unter 60 ┘     100
```

### 3.2 Trend unter dem Regler

Ein kleiner Verlauf zeigt die letzten Wochen, zum Beispiel Form, Stimmung oder Marktwert.

```
Form        |██████████████▌░░░░░░░░░░░░░░░░░|  9 / 20   ▁▃▅▆▅▃▂  ↓
```

### 3.3 Unscharfe Regler (Informationsnebel, K18)

Fremde Spieler zeigen eine **Spanne statt eines Punkts**. Je besser das Scouting, desto schmaler die Spanne. Unbekanntes erscheint als Fragezeichen.

```
Stärke (2 Scout-Berichte)   |░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░|  ca. 64–75
Talent (unbekannt)          |? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? |  ?
Kopfballstark               ● sicher        Hitzkopf   ◌ Gerücht
```

### 3.4 Stell-Regler mit Vorhersage (eingeben)

Für alles, was du einstellst. Unter dem Regler steht eine **Vorhersage**, an der man das Optimum sieht.

**Wichtig:** Das Optimum ist **geschätzt**. Wie genau die Schätzung ist, hängt vom zuständigen Mitarbeiter ab (K16). Mit einem schwachen Marketingleiter ist das Band breit, mit einem guten schmal. So bleibt es eine Entscheidung und wird nicht zum Ablesen.

**Ticketpreis** (K27):

```
Ticketpreis    5 € ├────────────────●────────────────┤ 80 €          34 €
Zuschauer          |█████████████████████████████▌░░░|  29.400 / 34.700
Einnahmen/Spiel            ╭──────╮
                       ╭───╯ ▓▓▓▓ ╰───╮         Schätzung Marketing:
                   ────╯      ▲       ╰────      Optimum etwa 36–42 €
                            du bist hier         (Genauigkeit: mittel)
```

**Trainingsintensität** (K07):

```
Intensität   locker ├──────────────●───────┤ hart
Entwicklung     ▲▲▲▲▲▲▲░░░            Frische Ende der Woche  |██████████▌░|  85 %
Verletzungsrisiko  ●●●○○ mittel       Stimmung  → gleichbleibend
```

**Gehaltsangebot in der Verhandlung** (K19, K21):

```
Gehalt/Jahr   0,5 Mio ├─────────░░░▓▓▓▓▓●▓▓▓▓░░────────┤ 3,0 Mio     1,6 Mio
                               └── hier sagt er wahrscheinlich Ja
                                   (laut Berater-Gespräch, ungenau)
Laufzeit      1 ├──────●──────┤ 5 Jahre     3 Jahre
Handgeld      0 ├──●──────────┤ 2 Mio       0,3 Mio
```

**Weitere Stell-Regler:**

| Regler | Konzept | Vorhersage |
|---|---|---|
| Ablöse-Angebot | K19 | Annahmezone unscharf, je nach Beziehung und Scouting |
| Einsatz (fair bis hart) | K06 | Zweikampfstärke gegen Karten- und Verletzungsrisiko |
| Pressinghöhe und Tempo (falls die Taktik das nutzt) | K06 | Wirkung gegen Ermüdung |
| Ausbau der Tribüne in Plätzen | K26 | Kosten, Bauzeit, Mehreinnahmen nur bei Nachfrage |
| Marketing-Budget | K25 | Wirkungskurve mit **abnehmendem Ertrag**, der Knick ist sichtbar |
| Jugendarbeit | K08 | Kosten gegen erwartete Talentqualität |
| Kredit | K23 | Zinsen, Rahmen, Kontostand am Saisonende |
| Aufteilung Transfer- und Gehaltsbudget | K23, K28 | gekoppelte Regler: einer hoch, der andere runter |
| Sponsorvertrag Laufzeit gegen Summe | K24 | Gesamtsumme, Risiko bei Aufstieg oder Abstieg |

### 3.5 Vergleich als Tauziehen

Zwei Seiten auf einer gemeinsamen Achse, zum Beispiel vor dem Spiel oder beim Vergleich zweier Spieler.

```
               SC Freiburg                FC Bayern
Abwehr        ██████████████|█████████████████████     74 : 86
Mittelfeld    ████████████████|███████████████████     76 : 85
Angriff       █████████████|██████████████████████     73 : 88
Frische       ██████████████████████|█████████████     96 : 88
Spielstil     Konter  ⟳ schlägt Pressing (Bayern)      ✓ Vorteil
```

Der Gegner ist ebenfalls unscharf, solange er nicht analysiert wurde (K06).

### 3.6 Regeln für alle Regler

- **Zahl immer daneben.** Der Balken ist die Übersicht, die Zahl die Genauigkeit.
- **Gleiche Skala für gleiche Werte** im ganzen Spiel, sonst trügt der Balken.
- **Maximum sichtbar:** Jeder Regler zeigt sein Minimum und Maximum, und wo sinnvoll das erreichbare Maximum (Talent, Kapazität, Kreditrahmen).
- **Auf dem Handy** sind Regler groß genug zum Ziehen. Mit Tasten lassen sie sich in Schritten verstellen (Pfeiltasten, Bild hoch/runter).
- **Farben** folgen festen Bedeutungen: grün gut, gelb Achtung, rot kritisch, Akzentfarbe für „du“. Jede Bedeutung hat zusätzlich ein Symbol oder einen Text.
- **Alles in `regeln.js` einstellbar:** Grenzen, Schrittweiten, Zonen.

## 4. Bildschirme

### 4.1 Aufbau

```
┌──────────────────────────────────────────────────────────────────────┐
│ ▣ Kalenderblatt  Sa 13. Sep 2026    Kontostand 12,4 Mio €            │
│ Vorstand |████████░░| Fans |██████░░░░| Kabine |███████░░░|          │
│                                   [ Tag beenden ▶  nächstes: Sa 20.9. ]│
├──────────────────────────────────────────────────────────────────────┤
│ [Büro] [Kader] [Aufstellung] [Training] [Transfers] [Finanzen] [ … ]  │
├──────────────────────────────────────────────────────────────────────┤
│  Arbeitsfläche des gewählten Bereichs                                │
└──────────────────────────────────────────────────────────────────────┘
```

- **Oben immer:** Datum, Kontostand, drei Stimmungsregler (Vorstand, Fans, Kabine) und „Tag beenden“.
- **Klick auf einen Regler** öffnet die Erklärung: woraus der Wert besteht und was ihn zuletzt verändert hat.

### 4.2 Bildschirmliste

| Bildschirm | Inhalt und Regler | Konzepte |
|---|---|---|
| **Büro** | Posteingang (getrennt nach „Entscheidung nötig“ und „Info“), Termine der Woche, nächstes Spiel mit Tauziehen-Vorschau, Erinnerungen | K01, alle |
| **Kalender** | Monat und Saison: Spiele, Training, Transferfenster, Trainingslager, Länderspielpausen. Testspiele per Klick auf einen freien Tag ansetzen. | K01, K11, K13 |
| **Kader** | Tabelle mit **Mini-Reglern** statt Zahlen, frei wählbare Spalten, Filter. Ein Klick auf eine Zeile öffnet die Schnellansicht. | K03 |
| **Spielerkarte** | alle Werte als Regler (Stärke mit Talent, Kondition, Frische, Form, Selbstvertrauen, Stimmung, Integration, Spielpraxis), Merkmale mit Lernfortschritt, Charakter, Beziehungen im Kader, Vertrag, Statistik, Verläufe | K03, K14, K21 |
| **Aufstellung und Taktik** | Spielfeld mit Ziehen und Ablegen, Eignung pro Position als Farbe am Spieler, Spielstil-Kreislauf mit Vertrautheit pro Stil, Einsatz-Regler, Tauziehen gegen den nächsten Gegner | K05, K06 |
| **Spieltag** | Vorbericht, Live-Ticker mit Frische der eigenen Spieler als Mini-Regler, Wechsel (zählt Wechsel und Unterbrechungen), Halbzeit, Konferenz, Spielbericht mit Gründen (Chancen, xG, Schlüsselszenen) und Noten | K04, K05 |
| **Training** | Wochenplan mit 5 Einheiten, Intensität mit Vorhersage, Einzeltraining mit Lernfortschritt | K07 |
| **Jugend** | Jahrgang, Talente mit unscharfen Reglern, Paten und Mentoren, Leihen | K08 |
| **Transfers** | Suche mit **Spannen-Reglern** als Filter (Alter von–bis, Stärke von–bis, Ablöse bis), Scouting-Aufträge, Verhandlungen mit Stell-Reglern und Verlauf, Gerüchte | K18–K22 |
| **Finanzen** | Bilanz, Prognose bis Saisonende als Kurve, Budget- und Kredit-Regler | K23 |
| **Stadion** | Kapazität mit Nachfrage-Regler, Ausbau-Regler mit Bauzeit, Ticketpreis mit Einnahmekurve, Logen, Rasenzustand | K26, K27 |
| **Sponsoren und Marketing** | Angebote nebeneinander, Kampagnen-Regler mit Wirkungskurve | K24, K25 |
| **Medien** | Pressekonferenz mit Frage und drei Antworten, Zeitung von gestern, Sprüche-Chronik | K29 |
| **Vorstand und Karriere** | Ziele als Regler mit Zielmarke, Vertrauensverlauf, Jobangebote | K28 |
| **Tabellen und Historie** | Tabellen, Torjäger, Rekorde, Saisonarchiv | K13, K34 |
| **Einstellungen** | Automatik pro Bereich (selbst / Vorschlag vom Stab / Stab entscheidet), Erinnerungen, Regler für die **Meldungsdichte** (Unterbrechungs-Budget), Schwierigkeit | K01, K02, K16 |

### 4.3 Beispiel: Spielerkarte

```
┌ Jonas Beispiel · MF · 20 · Beispielverein ─────────── [Vergleichen ⇄] ┐
│ Stärke       |█████████████████████▌░░▒▒▒▒▒▒░░░░░░░░|  79  Talent 84–90 │
│ Kondition    |██████████████████████████▌░░░░░░░░░░░|  72               │
│ Frische      |████████████████████████████████████▌░|  95 %             │
│ Form         |████████████████▌░░░░░░░░░░░| 13/20  ▂▃▅▆▇  ↑           │
│ Selbstvertr. |░░░░░░░░░░░░░░|████████▌░░░░|  +2  (−3 … +3)             │
│ Stimmung     |██████████████████████▌░░░░░░░░|  71                     │
│ Spielpraxis  |█████████████████████████████▌░|  90 %                   │
│ Merkmale     Dribbler ●   Weitschütze  ◐ lernt (60 %)                   │
│ Charakter    Publikumsliebling · nervenschwach (vermutet)               │
│ Vertrag bis 2029 · 1,4 Mio €/Jahr · Marktwert |██████▌░░| 18 Mio €     │
└───────────────────────────────────────────────────────────────────────────┘
```

Erfundener Beispielspieler, nur zur Darstellung.

## 5. Abläufe (Bedienung)

- **Eine normale Woche:**
  1. Büro: Posteingang mit Entscheidungen abarbeiten, Training bestätigen.
  2. Am Spieltag: Aufstellung prüfen.
  3. „Tag beenden“.
  4. Spiel live verfolgen oder überspringen.

  Ziel: **unter einer Minute** pro Woche, wenn nichts Besonderes passiert.
- **Schnellansicht:** Ein Klick auf einen Spielernamen öffnet die Karte als Seitenleiste. Die Liste bleibt sichtbar, kein Seitenwechsel.
- **Vergleichen:** Zwei Spieler oder zwei Mannschaften erscheinen nebeneinander auf gleichen Reglern.
- **Rückgängig machen** für Einstellungen, solange der Tag nicht beendet ist.

## 6. Hebel des Spielers

Alle Stell-Regler aus 3.4. Dazu die Automatik-Stufe pro Bereich und die Meldungsdichte.

## 7. Computer-Vereine

Keine eigene Oberfläche. Ihre Werte erscheinen auf denselben, aber unscharfen Reglern.

## 8. Ereignisse

Ereigniskarten (K30) erscheinen als eigene **Karte** mit Bild, Text und 1–3 Knöpfen. Wo eine Entscheidung eine Größe hat, kommt ein Regler dazu, zum Beispiel „Wie viel bietest du dem Platzwart?“.

## 9. Wechselwirkungen

| Konzept | Wechselwirkung |
|---|---|
| K16 | Die Genauigkeit der Vorhersagen hängt am Stab |
| K18 | Breite der Spannen |
| K01 | Posteingang und Meldungsdichte |
| K02 | Schwierigkeit, zum Beispiel ein Modus ohne Vorhersagen |

## 10. Zielwerte und Tests

- **Handy-Breite (390 px):** kein seitlicher Überlauf auf allen Bildschirmen (Test gibt es schon).
- **Klicks pro Woche:** Klicktest im Normalfall höchstens etwa 6 Klicks bis „Tag beenden“.
- **Regler-Prüfung:** Jeder Regler zeigt Minimum, Maximum und Wert. Gleiche Werte haben im ganzen Spiel die gleiche Skala.
- **Vorhersage-Ehrlichkeit:** Der echte Optimalwert liegt in mindestens 80 % der Fälle im angezeigten Band. Bei schwachem Stab ist das Band dafür breiter.

## 11. Stellschrauben

- **Für jeden Wert:** Grenzen, Schrittweiten und Zonen
- **Für die Vorhersagen:** Bandbreite der Optima je Qualität des Stabs
- **Regler** `ui.meldungsdichte` mit Standardwert
- **Farben und Symbole** für die Bedeutungen

## 12. Offene Fragen

1. **Optimum anzeigen:** immer als Band (Vorschlag), oder je nach Schwierigkeit auch gar nicht?
2. **Wie viele Mini-Regler** in der Kadertabelle? Vorschlag: Stärke, Form, Frische und Stimmung als Standard, der Rest wählbar.
3. **Spielfeld der Aufstellung:** freies Positionieren wie bei Anstoss 3 (pixelgenau, mit Aktionsradius) oder feste Positionen?
4. **Look (K35b):** eher Anzeigetafel und Flutlicht (dunkel, LED-Balken) oder hell im Stil eines alten Notizblocks? Oder beides als Thema zum Umschalten?
5. **Klickbares Muster:** steht in `muster/regler.html`. Rückmeldung dazu gehört hierher.
