# K35b – Look und Stil

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12.
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

## Quellen

- Was Anstoss-Fans schätzen: `konzepte/_recherche-genre.md`, Abschnitt 4c
- Bedienkonzept und Regler: `konzepte/K35-oberflaeche.md`
