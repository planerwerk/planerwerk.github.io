# Flutlicht Manager als Windows-App

Stand 26. November 2026 (Claude), auf Wunsch: „in einem eigenen Container, Installer nur für Windows“.

## Was die App anders macht als der Browser

- **Eigenes Fenster** statt eines Browser-Tabs. Das Spiel selbst ist unverändert, es wird nach `spiel/` kopiert und mit Electron 45 (Chromium) angezeigt.
- **Spielstand als Datei** in `%APPDATA%\Flutlicht Manager\spielstaende\`. Es gibt keine Größengrenze des Browsers (etwa 5 Mio. Zeichen) und kein Löschen nach sieben Tagen wie bei Safari (`konzepte/_luecken.md`, L1).
  - Gespeichert wird erst vollständig in eine neue Datei (mit fsync auf die Platte). Dann wird die bisherige zu `.vorher` umbenannt und die neue an ihren Platz gelegt (Prüfung GL7).
  - Unter Windows halten Virenscanner oder Indexdienst Dateien manchmal kurz fest. Dann versucht die App es bis zu fünfmal (GL8).
  - Eine auf das Fenster gezogene Datei öffnet die App nicht (GL10).
  - Ist die Datei kaputt, zum Beispiel nach einem Stromausfall beim Schreiben, lädt die App die vorige Fassung.
  - Das Spiel erreicht die Dateien nur über `window.flutlichtApp` (`preload.js`) und nur Namen aus Kleinbuchstaben, Ziffern und Bindestrichen. Sonst hat es keinen Zugriff auf den Rechner (`contextIsolation`, `sandbox`, kein Node im Fenster).
- **Nur ein Fenster gleichzeitig.** Zwei Fenster würden sich den Spielstand überschreiben.
- **Links nach draußen** öffnen im normalen Browser.
- Thema, Klang und eigene Wappen bleiben wie im Browser im `localStorage`, sie sind klein.

## Installer bauen

Der Installer (NSIS, nur Windows, 64 Bit) entsteht auf einem Windows-Rechner von GitHub: Workflow `.github/workflows/windows-installer.yml`.
- **Wann:** bei jedem Push auf `claude/eager-tesla-glelt2`, der die App oder das Spiel ändert, oder von Hand.
- **Wo:** Das Ergebnis `Flutlicht-Manager-Setup-<Version>.exe` liegt im Lauf unter „Artifacts“, 30 Tage lang.

Unter Linux lässt sich nur die entpackte Windows-Fassung bauen (`npx electron-builder --win dir`). Für den Installer selbst braucht electron-builder unter Linux Wine.

**Ohne Code-Signatur** warnt Windows beim ersten Start („Der Computer wurde durch Windows geschützt“). Weiter geht es mit „Weitere Informationen“ → „Trotzdem ausführen“. Eine Signatur kostet Geld und ist ein eigener Schritt vor einer Veröffentlichung.

## Selbst starten (Entwicklung)

```
cd flutlicht-manager/desktop
npm install
npm start
```

`npm start` kopiert das Spiel nach `spiel/` und öffnet die App. Nach Änderungen am Spiel genügt ein Neustart.

**Test:** `xvfb-run -a node tests/desktop.js` (aus `flutlicht-manager/`, unter Linux ohne Bildschirm mit `xvfb-run`). Vorher einmal `npm install` und `node kopieren.js` in `desktop/`.

## Version

`version` in `package.json` bestimmt den Namen des Installers. Bei einer neuen Fassung für Spieler hochzählen.
