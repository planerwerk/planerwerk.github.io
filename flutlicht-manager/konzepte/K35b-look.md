# K35b – Look und Stil

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12. **Neu ausgerichtet am 25.11.2026** nach deiner Vorgabe (Abschnitt 13): kein Retro-Zwang, vertraut und intuitiv, Kacheln, eigene Schrift. Abschnitt 13 geht den Abschnitten 1 bis 12 vor, wo sie sich widersprechen.
Hängt ab von: K35a (Bedienkonzept, Regler) · Wird gebraucht von: –

## 1. Ziel und Spielgefühl

- **Ein eigener Retro-Look,** der an Stadionnächte erinnert: Flutlicht, Anzeigetafel, Mischpult. Kein Nachbau eines bestimmten Spiels.
- **Lesbar vor schön:** Zahlen, Regler und Tabellen müssen auf einen Blick funktionieren, auch auf dem Handy.
- **Atmosphäre in kleinen Dosen:** Die Anzeigetafel beim Spiel, das Flutlicht beim Abendspiel, das Mischpult bei den Reglern.

## 2. Vorbilder und Abgrenzung

- **Anstoss-Community** schätzt Übersicht, Aufstellung per Ziehen und Ablegen, Atmosphäre und Humor (Recherche 4c). Das nehmen wir als Ziel, nicht als Vorlage für das Aussehen.
- **Bewusst anders:** keine Logos, Wappen oder Trikots echter Vereine. Vereinsfarben (gibt es in `daten/vereine.js`) als farbige Streifen und Kürzel.

## 3. Begriffe und Daten

### 3.1 Bausteine des Looks

| Baustein | Wo | Gestaltung |
|---|---|---|
| **Anzeigetafel** | Live-Spiel, Spielergebnisse, Kopfzeile | dunkle Fläche, Ziffern im Matrix- oder Klappziffer-Stil, Vereinskürzel in Vereinsfarbe |
| **Flutlicht** | Hintergrund, Ladezustand, Abendspiele | leichter Lichtkegel oben, nachts stärker (Anstoßzeit ab 18 Uhr) |
| **Mischpult** | Regler (K35a) | Schieberegler mit Rillen und Skala, Zonen als farbige Markierungen |
| **Rasen** | Aufstellung | gemähte Streifen, Positionen als Plaketten mit Eignungsfarbe |
| **Zeitung** | Presse, Gerüchte (K29) | Schlagzeile in Serifenschrift, Spalten, leicht vergilbt |
| **Posteingang** | Büro | Karteikarten, Entscheidungen hervorgehoben |

### 3.2 Themen

- **Flutlicht (dunkel)** als Standard: dunkles Grün und Anthrazit, Akzent in warmem Weiß und Signalgelb.
- **Tageslicht (hell):** helles Grau, Rasengrün, gleiche Akzente.
- Umschaltbar im Menü, Systemeinstellung als Vorgabe.
- **Kontrast:** alle Texte mindestens WCAG AA, Zonenfarben zusätzlich mit Muster oder Symbol (farbenblind-tauglich).

### 3.3 Schrift

- Fließtext: eine gut lesbare serifenlose Schrift aus dem System (keine externen Schriften nötig, das Spiel läuft auch offline).
- Ziffern der Anzeigetafel: Monospace mit Zifferneffekt per CSS.
- Zeitung: Serifenschrift aus dem System.

## 4. Abläufe

- Look wird in Stufen eingeführt (U19 und folgende), Bildschirm für Bildschirm, ohne die Bedienung zu ändern.
- Jede Stufe mit Screenshot-Test auf Handy- und Desktopbreite (Playwright, gibt es im Repo).

## 5. Regeln und Formeln

- **Farbtokens** an einer Stelle (`css/spiel.css`, Variablen), damit Themen umschaltbar sind.
- **Bewegung sparsam:** Klappziffern bei Toren, Flutlicht-Aufblenden beim Anpfiff. Abschaltbar, und aus, wenn das System „weniger Bewegung“ wünscht.
- **Handy zuerst** für Büro, Live-Spiel und Aufstellung, Tabellen mit waagerechtem Scrollen nur innerhalb der Tabelle.

## 6. Hebel des Spielers

Thema wählen, Bewegung an oder aus, Schriftgröße (klein, normal, groß).

## 7. Verhalten der Computer-Vereine

Entfällt.

## 8. Ereignisse

Entfällt. Ausnahme: besondere Anzeige bei Titeln (Konfetti-Anzeigetafel), abschaltbar.

## 9. Wechselwirkungen

K05 (Anzeigetafel, Ticker), K29 (Zeitungslook), K35a (Regler, Bildschirme), K33 (keine externen Dateien nötig, läuft per Doppelklick).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Kontrast | alle Texte mindestens WCAG AA in beiden Themen |
| Handy | keine waagerechte Seitenverschiebung bei 360 px Breite |
| Tempo | Seitenwechsel ohne spürbare Verzögerung |
| Offline | keine externen Schriften oder Bibliotheken |

## 11. Stellschrauben

Keine in `regeln.js`. Farben und Abstände als CSS-Variablen in `css/spiel.css`.

## 12. Offene Fragen

**Vorläufig entschieden:** dunkles Flutlicht-Thema als Standard, Systemschriften, keine Vereinslogos, Bewegung sparsam und abschaltbar.

## 13. Neuausrichtung (25.11.2026, deine Vorgabe, Ausarbeitung popolupo, vorläufig)

### 13.1 Leitbild

- **Vertraut und intuitiv statt Retro.** Wer ein aktuelles Sportspiel oder eine Handy-App kennt, soll sich ohne Erklärung zurechtfinden. Retro-Anklänge (Anzeigetafel, Flutlicht) bleiben als Würze, nicht als Stil.
- **Kacheln als Grundform.** Jede Ansicht besteht aus Kacheln: eine Kachel, ein Thema, eine Kennzahl, ein klarer nächster Schritt. Das wirkt freundlich und ordnet von selbst.
- **Nicht wie Tableau oder Excel.** Tabellen bleiben, wo man vergleichen muss (Ligatabelle, Kaderliste, Finanzen), aber nie als Startseite und nie als einziger Inhalt einer Ansicht. Auf dem Handy werden lange Tabellen zu Listen aus kleinen Karten.
- **Dein Verein im Mittelpunkt.** Die Vereinsfarbe aus `daten/vereine.js` färbt Kopfband, Wappen und die eigene Tabellenzeile (nicht Knöpfe oder Status, §13.3), so fühlt sich jede Karriere anders an.

### 13.2 Kachel-System

| Größe | Raster | Zweck | Beispiele |
|---|---|---|---|
| groß | 2 × 2 | das Wichtigste der Ansicht | Nächstes Spiel mit Gegner, Anstoß und Vergleich |
| breit | 2 × 1 | Liste mit wenigen Zeilen | Posteingang (3 neueste), Tabellenausschnitt (Platz ±2) |
| klein | 1 × 1 | eine Kennzahl mit Trend | Konto, Vertrauen, Stimmung, Verletzte, Fitness |

- **Aufbau einer Kachel:** Titel klein oben, Kennzahl groß, darunter eine Zeile Erklärung oder Trend (Pfeil mit Wert), unten rechts höchstens eine Aktion („Aufstellen“, „Antworten“). Die ganze Kachel ist anklickbar und führt in die Ansicht.
- **Zustand:** eine kleine Marke oben rechts in der Kachel mit Symbol und Wort (✓ gut, ! Achtung, ✕ kritisch, i Info), nie Farbe allein. Geändert beim Bau der Look-Studie (25.11.): kein farbiger Rand links, der wirkt schnell beliebig und trägt ohne Symbol nichts.
- **Raster:** 4 Spalten ab 1.100 px, 2 Spalten ab 600 px, 1 Spalte darunter. Kacheln ordnen sich selbst an, große Kacheln werden auf dem Handy volle Breite.
- **Startseite (Büro) als Kachelfläche:** Nächstes Spiel (groß), Posteingang (breit), Tabelle (breit), Konto, Vertrauen, Stimmung, Verletzte und Sperren, Training dieser Woche, Transfers, Termine (klein). Die heutige Reiterleiste bleibt als Navigation oben (Handy: unten), die Kacheln ersetzen die Textblöcke.
- **Bewegung:** Kacheln heben sich beim Zeigen leicht an (Schatten), beim Antippen kurz gedrückt. Aus bei „weniger Bewegung“.

### 13.3 Farbstudie

**Grundsätze** (Stand der Technik, keine eigene Messung):
- **Kontrast nach WCAG 2.2 AA:** Text mindestens 4,5 : 1, große Schrift und Bedienelemente mindestens 3 : 1, in beiden Themen. Wird mit einem automatischen Test geprüft (K40).
- **Farbsehschwäche:** Eine Rot-Grün-Schwäche betrifft grob jeden zwölften Mann (Größenordnung aus der Fachliteratur, nicht eigens nachgeprüft). Gerade im Fußball (grüner Rasen, Rot als Warnfarbe) darf keine Aussage nur an Rot gegen Grün hängen. Gut und schlecht deshalb zusätzlich mit Symbol, Form oder Helligkeit; als zweites Paar Blau gegen Orange für Diagramme.
- **Wenige Farben mit fester Bedeutung:** Grundfläche, Kachel, Text, gedämpfter Text, ein Akzent (Aktion), Gut, Achtung, Schlecht, Information. Alles andere sind Vereinsfarben.
- **Vertraute Bedeutungen:** Grün gut, Gelb Achtung, Rot schlecht, Blau Information, die Hauptaktion im Akzent. So machen es fast alle Apps und Sportspiele.

**Drei Paletten zur Wahl** (Entwürfe, in der Look-Studie nebeneinander):

| Palette | Grundfläche | Kachel | Akzent | Wirkung |
|---|---|---|---|---|
| **A Flutlichtnacht** (Vorschlag) | Nachtblau `#0e1726` | Schiefer `#17233a` | Flutlichtgelb `#ffc83d` | dunkel, ruhig, Stadion am Abend; die heutige grüne Fläche wird blau, Grün bleibt für „gut“ frei |
| **B Rasen** | Tiefgrün `#0f1f18` | `#183027` | Kreideweiß mit Gelb | nah am heutigen Look, aber Grün hat dann zwei Bedeutungen |
| **C Tageslicht** (hell) | Hellgrau `#f3f5f8` | Weiß | Blau `#2563eb` | freundlich, für Tagsüber und helle Umgebungen |

- **Vorläufig:** A als Standard, C als helles Thema (umschaltbar im Menü: dunkel, hell oder wie das Gerät; Standard dunkel), B entfällt. Gut `#3ecf8e`, Achtung `#ffb020`, Schlecht `#ff6b6b`, Information `#5aa9ff` in A; in C dunkler, damit 4,5 : 1 auf Weiß hält.
- **Vereinsfarbe nur für die Identität:** Kopfband, Wappen, eigene Tabellenzeile. Nie für Knöpfe oder Status, sonst verwechselt man ein rotes Vereinsband mit „kritisch“ (gefunden beim Bau der Look-Studie). Die Aktionsfarbe bleibt fest: Flutlichtgelb im dunklen, Blau im hellen Thema. Erreicht die Vereinsfarbe auf der Grundfläche keine 3 : 1, hellt oder dunkelt das Spiel sie in Stufen von 10 % ab, bis es reicht.
- **Look-Studie (W5a, 25.11.):** als Entwurf zum Anschauen gebaut (Büro als Kachelfläche für Desktop und Handy, Farbstudie mit live berechneten Kontrasten und einer Simulation der Rot-Grün-Schwäche, Schrift mit ersten Zeichen der eigenen Anzeigeschrift, Titelbildschirm mit den BMH-Leitsprüchen, Ladebildschirm). Kein Spielcode.

### 13.4 Schrift

- **Eigene Schrift für das Spiel** (deine Vorgabe): eine Anzeigeschrift für Überschriften, Kennzahlen und die Anzeigetafel, Arbeitsname „Flutlicht Display“. Geometrisch, schmal, mit klaren Ziffern (Tabellenziffern gleich breit), Großbuchstaben, Kleinbuchstaben, Ziffern, deutsche Umlaute und ß, Satzzeichen.
- **Wie sie entsteht, ohne etwas zu installieren:** Ich entwerfe die Zeichen als Formen auf einem Raster und erzeuge daraus mit einem kleinen eigenen Skript eine TrueType-Datei (das Format ist offen beschrieben). Alternative ohne Skript: Glyphr Studio oder FontStruct im Browser, dort lassen sich gezeichnete Formen als Schrift ausgeben. Die Schrift gehört dann dem Projekt, Lizenz frei wählbar (Vorschlag: SIL Open Font License).
- **Fließtext:** keine eigene Schrift (Lesbarkeit braucht Hinting und viel Feinarbeit), sondern eine freie, gut lesbare Schrift unter der SIL Open Font License, als Datei im Spiel (offline, keine fremden Server). Vorschlag zum Prüfen: Atkinson Hyperlegible (für gute Lesbarkeit entworfen) oder die heutige Barlow; Entscheidung in der Look-Studie.
- **Zeitung (Presse):** eine freie Serifenschrift, ebenfalls als Datei.

### 13.5 Vertraute Bedienung (Abgleich mit heutigen Spielen und Apps)

- Eine Hauptaktion je Ansicht, immer an derselben Stelle („Weiter“ oben rechts, auf dem Handy unten rechts als großer Knopf).
- Zurück-Weg immer sichtbar, Breadcrumb in Unteransichten.
- Kurze Rückmeldungen als Einblendung unten (Toast), Rückfragen nur bei Unumkehrbarem.
- Hinweise beim Zeigen (Tooltip) und ein Fragezeichen an jeder Kennzahl, das erklärt, woher sie kommt.
- Suche und Filter in langen Listen (Transfermarkt, Kader), Sortieren per Klick auf die Spalte.
- Ziehen und Ablegen, wo es natürlich ist (Aufstellung seit K35c, später Training und Kaderrollen).
- Tastatur: Leertaste „Weiter“, Zahlen für Reiter, Escape schließt Fenster. Auf dem Handy Wischen zwischen Reitern.
- Speichern geschieht automatisch, ein kleines Zeichen zeigt es.

### 13.6 Umsetzung (Welle 5, Reihenfolge vorläufig)

1. ✅ **W5a Look-Studie** (25.11., Entwurf zum Anschauen, kein Spielcode): Paletten, Kacheln, Schriftproben, Startseite als Kachelfläche, Titel- und Ladebildschirm.
2. ✅ **W5b Farbsystem** (25.11., ohne Testlauf): Farben der Palette A als Standard, Palette C als helles Thema, Auswahl im Menü (dunkel, hell, wie das Gerät; je Gerät im Browser gespeichert, nicht im Spielstand). Feste Farbwerte im Stylesheet durch die Farbvariablen ersetzt. Beim Nachrechnen angepasst: Schlecht im dunklen Thema `#ff6b6b` (mit `#f2555a` nur 4,1 : 1 auf Knöpfen und Hover-Zeilen), im hellen Thema Gut `#0f7a54` und Achtung `#9a5800` (4,5 : 1 auch auf der hellgrauen Grundfläche, nicht nur auf Weiß). Nach Prüfung FW2: Information im hellen Thema Petrol `#0e7490`, damit sie sich von der blauen Aktionsfarbe unterscheidet. Anzeigetafel im Live-Spiel und Rasen der Aufstellung bleiben in beiden Themen dunkel beziehungsweise grün. Test: `tests/ui-zugang.js` prüft das helle Thema mit axe und das Umschalten.
3. **W5c Kacheln:** Baustein `kachel()` in `js/regler.js`, Startseite (Büro) als Kachelfläche, dann Ansicht für Ansicht. ✅ **W5c1 Büro** (25.11., ohne Testlauf): oben Kacheln „Heute“ (groß, mit Spiel und Wochenleiste), Posteingang (die drei neuesten Nachrichten) und Tabelle (Ausschnitt um deinen Platz) als breite Kacheln, dazu Kontostand, Vorstand, Saisonziel, Stimmung, Ausfälle, Training, Transfers und letztes Spiel. Darunter bleiben die Karten mit Entscheidungen und Einzelheiten wie bisher, die vollständigen Nachrichten unten. ✅ **W5c2** (25.11.): Kachelzeile oben in Finanzen (Kontostand, Saldo der Saison, Kredit, Gehälter) und Kabine (Stimmung, Zusammenhalt, Kapitän, Gespräche, offene Versprechen), Statusmarken aus denselben Zonen wie die Regler (`zonenStatus`). ✅ **W5c3** (25.11.): Stadion (Plätze, Zuschauerschnitt mit Auslastung, VIP-Logen, Fanshop). ✅ **W5c4** (25.11.): Transfers (Fenster, Kontostand, Kader, Angebote, Transferliste) und Training (Trainingsplan, heutige Einheit, Frische, Talente).
4. **W5d Eigene Schrift:** Zeichen entwerfen, TrueType erzeugen, einbinden. ✅ **W5d1 Ziffern** (25.11., ohne Testlauf): `schrift/schrift.pl` baut aus Strichskeletten (Strich 14, Radius 20, Gehrung bis 2) eine TrueType-Datei `schrift/FlutlichtDisplay.ttf` (4,5 KB, Ziffern, : . , - + / %, Minus, Leerzeichen) und `css/schrift.css` mit der Schrift als data-URL (lädt auch über file://). Die Anzeigeschrift des Spiels nimmt sie zuerst, per unicode-range nur für Ziffern und Zahlzeichen; Buchstaben kommen weiter aus Saira Condensed. Das Skript prüft sich selbst (Prüfsummen, Tabellenlängen, Zeichenzuordnung). ✅ **W5d2 Großbuchstaben** (25.11.): A bis Z mit Ä Ö Ü (O und Q breiter als die Null, M und W breiter). Sie gelten über die zweite Familie „Flutlicht Versal“ (dieselbe Datei, andere unicode-range) nur für Text in Versalien: Hauptknöpfe (`.go`) und Titel (`.logo`). ✅ **W5d3 Kleinbuchstaben** (25.11.): a bis z mit ä ö ü ß, €, Klammern, ! ? · – (85 Zeichen, 18 KB; x-Höhe 504, Rundungen Radius 16). Seitdem ist „Flutlicht Display“ die Anzeigeschrift für alle Überschriften, Kennzahlen und Knöpfe; fehlende Zeichen nimmt der Browser einzeln aus Saira Condensed, die Zwischenlösung „Flutlicht Versal“ entfällt. Offen: Kerning, Anführungszeichen, weitere Satzzeichen; Feinschliff nach Blick auf echte Ansichten.
5. **W5e Artwork, Ladebildschirme, Sequenzen** (K39) und **W5f Audio** (K41).
6. Erst nach dem ersten Testlauf des Testers zusammenführen, damit Fehler der Mechanik und der Oberfläche getrennt bleiben.

## Quellen

- Was Anstoss-Fans schätzen: `konzepte/_recherche-genre.md`, Abschnitt 4c
- Bedienkonzept und Regler: `konzepte/K35-oberflaeche.md`
- Kontrastregeln: WCAG 2.2, Erfolgskriterien 1.4.3 (Text) und 1.4.11 (Bedienelemente), W3C
- Freie Schrift-Editoren im Browser: FontStruct (https://fontstruct.com), Glyphr Studio (Websuche vom 25.11.2026)
