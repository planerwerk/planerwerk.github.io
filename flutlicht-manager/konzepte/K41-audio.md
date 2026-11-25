# K41 – Audio

Status: **Entwurf** (25. November 2026, popolupo), nach deiner Vorgabe vom 25.11. („über Audio haben wir noch nicht gesprochen“). Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K39 (Sequenzen), K05 (Live-Spiel) · Wird gebraucht von: –

## 1. Ziel und Spielgefühl

- **Stimmung im Stadion,** ohne zu nerven: Ein Managerspiel läuft oft stundenlang, darum ist Klang dezent, kurz und jederzeit abschaltbar.
- Klang **bestätigt** Handlungen (Klick, Speichern, Brief kommt an) und **verstärkt** die großen Momente (Anpfiff, Tor, Abpfiff, Titel).
- **Nichts ist nur hörbar:** Jede Information steht auch auf dem Bildschirm (Barrierefreiheit, Spielen ohne Ton).

## 2. Vorbilder und Abgrenzung

- Heutige Sportmanager setzen auf Stadionatmosphäre im Live-Spiel und ruhige Musik im Menü. Kommentar mit Stimme lassen wir weg (viel Aufwand, schnell repetitiv).
- Musik nur im Titelbildschirm und bei Titeln, nicht als Dauerschleife im Büro.

## 3. Begriffe und Daten

| Gruppe | Klänge | Länge |
|---|---|---|
| **Oberfläche** | Klick, Umschalten, Fehler, Brief kommt an, Speichern | unter 0,2 s |
| **Spiel** | Anpfiff-, Halbzeit-, Abpfiffpfiff, Torjubel (stärker im Heimspiel), Raunen bei Chance, Pfiffe der Gegenfans, Gesang als Schleife | 1 bis 8 s, Schleife 20 bis 40 s |
| **Momente** | Titel-Fanfare, Aufstieg, Entlassung (gedämpft), Saisonwechsel | 2 bis 6 s, passend zu den Sequenzen aus K39 |
| **Musik** | Titelthema, kurze Titelmusik | 30 bis 90 s |

- **Lautstärke der Stadionatmosphäre** folgt dem Spiel: Zuschauerzahl, Stand und Minute (laut nach Tor, leiser bei hoher Führung des Gegners, Unruhe in der Schlussphase).

## 4. Abläufe

- Klang startet erst nach der ersten Bedienung (Browser blockieren automatisches Abspielen vorher).
- Im Live-Spiel läuft die Atmosphäre als Schleife, Ereignisse legen sich darüber. Beim schnellen Vorspulen nur Tore und Abpfiff.
- Bei „weniger Bewegung“ oder ausgeblendetem Tab Ton aus.

## 5. Regeln und Formeln

- **Erzeugt statt aufgenommen, wo es geht:** Pfiffe, Klicks und Oberflächentöne entstehen im Browser mit der Web Audio API (wenige Zeilen, keine Dateien, keine Lizenzfrage). Raunen und Jubel aus Rauschen mit Hüllkurve klingen brauchbar, echter Gesang nicht.
- **Dateien nur frei lizenziert:** Stadionatmosphäre und Gesang aus CC0-Sammlungen (etwa Freesound mit CC0-Filter) oder mit einem KI-Werkzeug mit klarer Lizenz (Abschnitt 11). Jede Datei in `daten/artwork-quellen.md` (gemeinsame Liste mit K39).
- **Größenbudget:** alle Klangdateien zusammen höchstens 2 MB (Ogg Opus, mono, 64 kbit/s), Musik eingeschlossen.
- **Keine echten Vereinslieder oder Fangesänge mit erkennbarem Text** (Urheberrecht an Text und Melodie).

## 6. Hebel des Spielers

- Drei Regler: Gesamt, Stadion, Oberfläche; Musik an oder aus. Stumm-Knopf immer sichtbar in der Kopfzeile, Taste M.
- Voreinstellung: Ton an, leise (40 %), Musik aus.

## 7. Verhalten der Computer-Vereine

Entfällt.

## 8. Ereignisse

Klang begleitet Ereignisse, er löst keine aus.

## 9. Wechselwirkungen

K39 (Sequenzen), K05 (Live-Spiel, Zuschauer), K35b (Einstellungen), K40 (Test ohne Ton, Barrierefreiheit).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Größe | alle Klangdateien ≤ 2 MB |
| Lizenz | jede Datei in der Quellenliste |
| Ruhe | kein Klang länger als 8 s außer Schleife und Musik; ohne Ton keine Information verloren |
| Technik | kein Abspielen vor der ersten Bedienung; Ton aus bei verstecktem Tab |

## 11. Werkzeuge und Lizenzen (Recherche 25.11.2026)

| Zweck | Werkzeug | Kosten | Lizenz | Einbindung |
|---|---|---|---|---|
| Pfiffe, Klicks, einfache Effekte | Web Audio API, selbst programmiert | keine | gehört dem Projekt | im Code |
| Stadionatmosphäre, Jubel | CC0-Sammlungen (Freesound mit CC0-Filter) | keine | CC0 | Dateien, ich bräuchte Netz zum Herunterladen |
| Effekte, Musik per KI | ElevenLabs MCP-Server | Gratis-Kontingent mit API-Schlüssel | Gratisstufe nach meinem Stand nur eingeschränkt nutzbar, vor Nutzung prüfen | MCP-Server in Claude Code, API-Schlüssel von dir |
| Musik per KI | verschiedene Musik-Generatoren | meist Gratisstufe | Gratisstufen erlauben häufig keine Weitergabe; für ein Open-Source-Spiel eher ungeeignet | – |

- **Vorläufig:** Oberflächentöne und Pfiffe selbst erzeugt, Atmosphäre aus CC0, Musik erst später und nur mit klarer Lizenz. Für KI-Audio sehe ich derzeit kein Werkzeug, das kostenlos **und** für ein Open-Source-Spiel sauber lizenziert ist.

## 12. Offene Fragen

**Vorläufig entschieden:** Ton an und leise, Musik aus; Oberflächentöne erzeugt; Atmosphäre aus CC0; keine Stimme, keine echten Fangesänge; Audio kommt nach Kacheln, Schrift und Artwork (W5f).

✅ **Gebaut in W5f (25.11., ohne Testlauf):** `js/klang.js` erzeugt Klick, Brief, Pfiff, dreifachen Abpfiff, Torjubel und Raunen mit der Web Audio API (keine Dateien; Rauschen aus einem festen eigenen Generator, kein Spielzufall). Im Live-Spiel: Anpfiff, Halbzeit- und Abpfiff, Jubel bei eigenem Tor, Raunen bei Gegentor, nicht beim Fortsetzen. Stumm-Knopf in der Kopfzeile, Taste M, Menü-Karte „Klang“ mit Lautstärke; je Gerät im Browser (`REGELN.klang`). Offen: Stadionatmosphäre als Schleife nach Zuschauern und Stand (CC0-Aufnahmen, braucht Netz), Brief-Ton bei neuer Nachricht.

**Für dich:** Willst du überhaupt Musik, oder reicht Stadionatmosphäre?

## Quellen

- ElevenLabs MCP-Server: https://github.com/elevenlabs/elevenlabs-mcp
- Übersicht KI-Musik für Spiele (Lizenzen der Gratisstufen): https://app.cinevva.com/guides/ai-music-generators-games
- Web Audio API: MDN Web Docs
