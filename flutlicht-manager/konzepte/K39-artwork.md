# K39 – Artwork, Ladebildschirme und Sequenzen

Status: **Entwurf** (25. November 2026, popolupo), nach deiner Vorgabe vom 18.11. (PLAN §4) und vom 25.11. (Ladebildschirme, Videosequenzen, freie KI-Werkzeuge). Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K35b (Look, Abschnitt 13) · Wird gebraucht von: K41 (Audio zu den Sequenzen)

## 1. Ziel und Spielgefühl

- Das Spiel soll **fertig aussehen**: eigene Bilder für Vereine, Spieler und Orte, Ladebildschirme mit Stimmung, kurze Sequenzen bei den großen Momenten.
- **Alles eigen oder frei lizenziert,** zu jeder Datei Herkunft und Lizenz. Keine echten Logos, Trikots, Fotos oder erkennbaren Gesichter echter Personen.
- **Klein und offline:** Das Spiel läuft weiter per Doppelklick und ohne Server. Ein festes Größenbudget (Abschnitt 5).

## 2. Vorbilder und Abgrenzung

- Heutige Sportspiele zeigen Ladebildschirme mit Bild und Tipp, kurze Einlauf- und Jubelszenen, Pokale beim Titel. Das übernehmen wir als Muster, in einfacher Form.
- **Keine echten Videos.** Videodateien wären groß, schwer lizenzierbar und für ein Browserspiel unnötig. „Sequenzen“ sind bei uns animierte Szenen aus Standbildern, Ebenen und Effekten (Abschnitt 3.4).

## 3. Begriffe und Daten

### 3.1 Wappen

- Je Verein erzeugt aus Vereinsfarbe, Kürzel und einer Grundform (Schild, Kreis, Raute, Banner), fest aus der Vereinsnummer. SVG, wenige hundert Byte, im Spiel gezeichnet, keine Dateien. ✅ Gebaut in W5e1 (25.11., ohne Testlauf): `wappen(id, px)` in `js/ansichten.js`, vier Grundformen (Schild, Kreis, Raute, Wimpel), Form fest aus dem Kürzel (in jeder Karriere gleich), Kürzel ab 28 px, Schrift dunkel oder hell nach der Helligkeit der Vereinsfarbe. Zu sehen in der Kopfzeile, auf den Spielkarten (beide Wappen) und klein in Tabellen und Listen statt des Farbpunkts. ✅ „Eigene Wappen laden“ in W5e2 (25.11.): Menü-Karte „Eigene Wappen“, Bilder mit Dateiname = Kürzel, auf 96 × 112 Pixel verkleinert, nur im Browser gespeichert (`REGELN.darstellung.wappenSchluessel`), mit Liste der Kürzel und „Alle entfernen“. Ein ZIP lesen kann das Spiel nicht, mehrere Dateien auf einmal gehen.
- Erkennbar „ein Wappen“, erkennbar nicht das echte.
- **Echte Wappen von Wikipedia (deine Frage vom 25.11.):** nicht im Spiel mitliefern. Gründe (keine Rechtsberatung):
  - **Urheberrecht je Datei verschieden:** Auf Wikimedia Commons liegen manche Vereinswappen als „zu einfach für Urheberrecht“ (gemeinfrei), andere stehen nur in der englischen Wikipedia unter „Fair Use“, das außerhalb der Wikipedia nicht gilt. Man müsste jede Datei einzeln prüfen.
  - **Markenrecht gilt trotzdem:** Auch ein gemeinfreies Wappen ist meist eine eingetragene Marke des Vereins; Commons weist an solchen Dateien ausdrücklich darauf hin. Die Wappen-Lizenzen für Fußballspiele vergeben Vereine und Liga gegen Geld.
  - **Open Source verschärft es eher:** Die Lizenz des Spiels erlaubt jedem die Weitergabe, auch gewerblich. Die Wappen dürften wir aber nicht unter diese Lizenz stellen. Ein Repository mit allen Wappen ist ein naheliegendes Ziel für eine Abmahnung oder Löschaufforderung.
  - **Ausweg wie bei den alten Managerspielen („Originaldaten-Patch“):** Das Spiel liefert erzeugte Wappen. Wer echte Wappen will, lädt sie selbst über **„Eigene Wappen laden“** (Bilddateien oder ein ZIP, Dateiname = Vereinskürzel). Sie bleiben nur im eigenen Browser gespeichert und werden nicht verteilt. Vorläufig, als kleiner Schritt in W5e.
  - Die echten Vereinsnamen sind weniger heikel als die Wappen, weil sie den Verein nur benennen; eine Grauzone bleibt. Vor der Veröffentlichung als Open Source gehört ein Hinweis in die Lizenzdatei, dass Namen und Marken den Vereinen gehören.

### 3.2 Spielerbilder

- Comic-Gesichter aus einem Baukasten (deine Vorgabe vom 18.11., Einzelheiten in PLAN §4): Frisur, Gesichtsform, Augen, Brauen, Nase, Mund, Hautton, fest aus dem Spieler-Seed.
- Die Teile zeichne ich als SVG-Bausteine; KI-Bilder sind für Gesichter ungeeignet (keine einheitlichen Teile, Gefahr ungewollter Ähnlichkeit mit echten Personen).
- Echte Spieler nur grob angenähert (Haarfarbe, Frisur, Hautton aus frei lizenzierten Fotos, PLAN §4), nie als Porträt.

### 3.3 Illustrationen und Ladebildschirme

| Bild | Wo | Stimmung |
|---|---|---|
| Stadion bei Nacht unter Flutlicht | Spielstart, Live-Spiel | Erwartung |
| Kabine vor dem Anpfiff | Halbzeit, Ansprache | Spannung |
| Trainingsplatz am Morgen | Training, Vorbereitung | Arbeit |
| Büro mit Taktiktafel | Büro, Verträge | Ruhe |
| Zeitungsstand, Pressekonferenz | Presse | Trubel |
| Sommerpause am Strand, Trainingslager in den Bergen | Sommer, Lager | Pause |
| Pokal und Konfetti | Titel | Jubel |

- **Ladebildschirm:** eines dieser Bilder passend zum Anlass (Spiel laden, Saisonwechsel, langer Sprung), darüber ein Tipp aus den Lernstufen (K36) oder ein Satz aus der Vereinsgeschichte (K34). Ein Ladebildschirm erscheint nur, wenn etwas wirklich dauert (Saisonwechsel, Laden), höchstens ein bis zwei Sekunden, mit Klick zu überspringen.
- **Herstellung:** mit einem freien KI-Bildmodell (Abschnitt 11), danach von mir auf Format, Farben der Palette und Größe gebracht. Ohne echte Vereine, Logos, Werbung oder Gesichter. Stil einheitlich: gezeichnet, flächig, leicht körnig, nicht fotorealistisch (passt zu den Comic-Gesichtern und wirkt nicht wie ein Fake-Foto).

### 3.4 Sequenzen („Videosequenzen“)

Kurze animierte Szenen von 2 bis 6 Sekunden, jederzeit überspringbar, aus bei „weniger Bewegung“:

| Sequenz | Auslöser | Inhalt |
|---|---|---|
| Intro | erster Start | Flutlichtmasten gehen nacheinander an, das Logo erscheint |
| Einlauf | Anpfiff deines Spiels (Live) | Stadionbild mit Parallax, Vereinsfarben beider Teams, Anzeigetafel klappt auf 0:0 |
| Tor | Tor im Live-Spiel | kurzer Blitz der Anzeigetafel, Konfetti in der Vereinsfarbe |
| Abpfiff | Sieg oder Niederlage | Anzeigetafel mit Endstand, Licht wird wärmer oder kälter |
| Titel | Meisterschaft, Pokal, Aufstieg | Pokal fährt ein, Konfetti, Wappen |
| Entlassung | Entlassung | Büro, Licht geht aus |
| Saisonwechsel | 1. Juli | Kalenderblatt fliegt, neue Saison |

- **Technik:** CSS- und SVG-Animation, für Konfetti und Licht ein kleines Canvas. Standbilder aus 3.3 als Ebenen (Vordergrund, Tribüne, Himmel) mit leichter Bewegung. Keine Videodateien.
- **Später möglich:** echte kurze KI-Videos (Abschnitt 11), wenn ein Werkzeug mit klarer Lizenz kostenlos verfügbar ist. Vorerst nicht nötig.

### 3.5 Symbole

- Eigene SVG-Symbole für Positionen, Verletzung, Sperre, Karten, Vertrag, Geld, Training, Presse, Stimmung. Einheitliche Strichstärke, beide Themen.

## 4. Abläufe

- Artwork kommt Schritt für Schritt in eigenen Zweigen (W5e), nach dem Farbsystem und den Kacheln (K35b §13.6).
- Jede Datei kommt mit einem Eintrag in `daten/artwork-quellen.md`: Datei, Herkunft (selbst gezeichnet, KI-Modell und Eingabe, CC0-Quelle), Lizenz, Datum.

## 5. Regeln und Formeln

- **Größenbudget:** alle Bilder zusammen höchstens 3 MB (WebP, 1.280 px breit für Ladebildschirme, 640 px für Kopfbilder), SVG bevorzugt.
- **Laden nur bei Bedarf:** Bilder erst, wenn die Ansicht sie braucht.
- **Barrierefreiheit:** jedes Bild mit kurzem Alternativtext; Sequenzen überspringbar und abschaltbar.

## 6. Hebel des Spielers

Sequenzen an, kurz oder aus; Ladebildschirme mit oder ohne Tipps; eigene Wappen laden (nur im eigenen Browser, 3.1).

## 7. Verhalten der Computer-Vereine

Entfällt.

## 8. Ereignisse

Die Sequenzen begleiten Ereignisse (Titel, Entlassung), sie lösen keine aus.

## 9. Wechselwirkungen

K35b (Palette, Schrift), K41 (Klang zu den Sequenzen), K36 (Tipps im Ladebildschirm), K34 (Vereinsgeschichte), K05 (Live-Spiel).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Größe | alle Bilder zusammen ≤ 3 MB |
| Lizenz | jede Datei in `daten/artwork-quellen.md` |
| Tempo | Sequenz ≤ 6 s, Ladebildschirm nur bei echter Wartezeit |
| Zugang | Alternativtexte, „weniger Bewegung“ schaltet Sequenzen ab |

## 11. Werkzeuge und Lizenzen (Recherche 25.11.2026)

| Zweck | Werkzeug | Kosten | Lizenz der Ergebnisse | Einbindung |
|---|---|---|---|---|
| Bilder | Hugging Face MCP-Server mit Bild-Spaces (z. B. FLUX.1-schnell) | kostenloses Konto mit Gratis-Kontingent | FLUX.1-schnell steht laut Anbieter unter Apache 2.0 (vor Nutzung prüfen) | in Claude Code als MCP-Server (HTTP), Anmeldung im Browser |
| Bilder, Symbole, Wappen | selbst als SVG (ich) | keine | gehört dem Projekt | im Code |
| Schrift | eigenes Skript oder Glyphr Studio, FontStruct | keine | frei wählbar (Vorschlag OFL) | Datei im Spiel |

- **Was du dafür tun müsstest:** ein kostenloses Konto bei Hugging Face anlegen und in Claude Code den MCP-Server hinzufügen (ein Befehl, Anmeldung im Browser). Ohne das zeichne ich alles als SVG; die Ladebildschirme werden dann schlichter.
- **Vorsicht:** Gratis-Kontingente ändern sich, Lizenzen auch. Vor jeder Nutzung prüfe ich die aktuelle Lizenz des Modells und schreibe sie in die Quellenliste.

## 12. Offene Fragen

**Vorläufig entschieden:** keine Videodateien, Sequenzen als Animation; Gesichter, Wappen und Symbole als SVG von mir; Ladebildschirme und Illustrationen mit einem freien KI-Bildmodell, wenn du den Zugang einrichtest, sonst als SVG; Stil gezeichnet, nicht fotorealistisch; echte Wappen nicht mitliefern, nur selbst laden (3.1).

**Für dich:** Soll ich die KI-Bilder nutzen (dann Hugging-Face-Konto und MCP-Server, siehe 11)?

## Quellen

- Hugging Face, „Generate Images with Claude and Hugging Face“: https://huggingface.co/blog/claude-and-mcp
- mcp-hfspace (Vorgänger des offiziellen Servers, nutzt FLUX.1-schnell): https://github.com/evalstate/mcp-hfspace
- Deine Vorgaben: PLAN §2 (18.11.), PLAN §4 „K39 Artwork und K40 Usability-Tests“
