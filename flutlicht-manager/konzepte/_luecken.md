# Lücken-Check: Was fehlt im Plan?

Stand 26. November 2026 abends (Claude), auf Wunsch: „vielleicht haben wir was Wichtiges vergessen“. Grundlage ist der Stand `mitarbeit/popolupo-gj-korrekturen` (78e6b78). Ich habe PLAN §3 und §5 mit den Dateien in `js/` und `konzepte/` verglichen und nach Themen gesucht, die ein Fußballmanager üblicherweise hat.

## Schon abgedeckt

Viele naheliegende Kandidaten sind schon im Plan oder im Code:
- Länderspiele mit Abstellung, EM und WM im Sommer
- Jobangebote, Trainervertrag, Entlassung
- Rekorde, Saisonarchiv und Ehrungen
- Wetter (Trainingslager, Dach), Schiedsrichter, Derbys
- Mitglieder, Kapitän, Hilfen
- Klang über die Web Audio API (K41, `js/klang.js`)
- Comic-Gesichter aus einem Baukasten (K39, `js/gesichter.js`)
- Recht am eigenen Bild für Gesichter echter Spieler (PLAN §4, § 22 KUG)
- Name des Spiels mit Prüfung im Markenregister (K42)

## Lücken

### L1 Spielstand-Sicherheit (wichtig, Vorschlag: bald)

1. **Sichern nur als Text-Code.** Der Spielstand liegt im `localStorage` des Browsers. Im Menü gibt es einen Text-Code zum Kopieren und Einfügen, aber keine Datei. Bei über 3 Mio. Zeichen ist Kopieren und Einfügen mühsam, auf dem Handy kaum machbar.
2. **Safari löscht nach 7 Tagen.** Safari entfernt seit Version 13.1 allen per Skript geschriebenen Speicher einer Seite, auch den `localStorage`, wenn die Seite an sieben Tagen mit Safari-Nutzung nicht bedient wurde (Intelligent Tracking Prevention). Ein Manager, der zwei Wochen liegen bleibt, wäre weg. Für installierte Web-Apps auf dem Home-Bildschirm sind die Berichte widersprüchlich. Eine offizielle WebKit-Seite zum heutigen Verhalten habe ich nicht gefunden.
3. **Größe gemessen:** Simulation mit 10 Saisons, `JSON.stringify(S)` je Saisonende:

   | Saison | 2026 | 2027 | 2028 | 2029 | 2030 | 2031 | 2032 | 2033 | 2034 | 2035 |
   |---|---|---|---|---|---|---|---|---|---|---|
   | Mio. Zeichen | 2,85 | 3,16 | 3,28 | 3,34 | 3,36 | 3,46 | 3,52 | 3,57 | 3,60 | 3,67 |

   Ab der dritten Saison wächst der Spielstand noch um etwa 0,06 Mio. Zeichen je Saison. Die Spieler (`pl`) machen etwa zwei Drittel aus, der Auslandspool knapp ein Viertel. Chromium nimmt in einem Test hier etwa 5,24 Mio. Zeichen je Seite, Umlaute zählen wie andere Zeichen. MDN nennt 5 MiB je Origin. Der Spielstand braucht also schon nach einer Saison mehr als die Hälfte und nach zehn Saisons etwa 70 %. Geht das Wachstum so weiter, wird es nach grob 25 Saisons eng, früher, wenn neue Funktionen mehr speichern. Die eigenen Wappen teilen sich denselben Speicher. Der Speicherfehler wird gemeldet (`save()` in `js/hilfen.js`), es geht aber nichts verloren nur so lange, wie das Fenster offen bleibt.

**Vorschlag:**
- Spielstand als Datei sichern und laden. **Gebaut am 26.11. abends** (Claude): Im Menü gibt es „Als Datei sichern“ und „Datei laden“, auf dem Startbildschirm „Datei laden“. Das Menü zeigt, wie viel Prozent des Browser-Speichers der Spielstand braucht. Der Text-Code bleibt als Ausweg. Test: `tests/ui-sicherung.js`.
- Dazu ein Test, der nach 10 Saisons eine Obergrenze prüft, zum Beispiel 4,5 Mio. Zeichen.
- **Windows-App gebaut am 26.11. abends** (Claude, auf Wunsch „eigener Container, Installer nur für Windows“): `desktop/` mit Electron, Spielstand als Datei ohne Größengrenze, Installer über GitHub Actions. Siehe `desktop/LIESMICH.md`.
- Später bei Bedarf Kompression (`CompressionStream` im Browser) oder IndexedDB. Beides ist nicht nötig, solange die Größe unter der Grenze bleibt. Vor dem 7-Tage-Löschen schützt nur die Datei.

### L2 Echte Spielernamen (vor einer Veröffentlichung klären)

`daten/spieler.js` enthält rund 1.100 echte Spieler mit echtem Namen nach der deutschen Wikipedia. Für Bilder ist die Frage geklärt (PLAN §4: keine Porträts, nur grobe Merkmale). Für Namen steht nichts im Plan.
- Oliver Kahn hat 2003 und 2004 in Hamburg gegen EA gewonnen. EA hatte sich auf Rechte von FIFPro berufen, das Gericht ließ die Rechtekette nicht gelten.
- Ein Urteil speziell zu Namen in Managerspielen habe ich bei der Suche nicht gefunden. Auch keine Stellungnahme der Spielergewerkschaft VdV.
- Die Abwägung erfolgt im Einzelfall: Das OLG Frankfurt hat bei Sammelkarten zugunsten des Verlags entschieden.

**Das ist keine Rechtsberatung.** Vor einer öffentlichen oder gar kostenpflichtigen Veröffentlichung sollte das jemand mit Fachwissen prüfen. Mögliche Wege:
- erfundene Namen als Standard, echte Namen als Datei, die man selbst lädt (früher bei Managerspielen üblich)
- eine Lizenz
- ein privates Spiel ohne Veröffentlichung

Für Vereinsnamen gilt Ähnliches (Marken), Wappen erzeugt das Spiel ohnehin selbst (K39).

### L3 Mehrspieler an einem Gerät (Entscheidung offen)

Mehrere Menschen mit je einem Verein abwechselnd am selben Rechner („Hotseat“) war bei Managern der 90er verbreitet. Im Plan kommt es nicht vor, weder als Ja noch als Nein. Folgen bei Ja:
- Automatiken und Lernstufen je Mensch
- Halte und Meldungen je Mensch
- Live-Spiel bei zwei eigenen Vereinen am selben Tag

Vorschlag: bewusst entscheiden. Ich würde es auf „nach Welle 5“ setzen.

### L4 Investoren und 50+1 (klein)

Steht nur als „später denkbar“ in K02. Ausgliederung, Investor mit Geld gegen Mitsprache und die 50+1-Regel wären ein eigenes kleines Konzept in Welle 4 oder als Ereigniskarten (K30).

### L5 Soziale Medien (klein, optional)

Es gibt Presse und Gerüchte (K29), aber keine Fan-Stimmen im Netz. Möglich wäre eine kurze Liste von Fan-Beiträgen als Ansicht der Fanstimmung (K27), ohne neue Spielwirkung.

### L6 Schriften von Google-Servern (vor einer Veröffentlichung, klein)

`index.html` lädt Barlow, Saira Condensed und VT323 von `fonts.googleapis.com`. Dabei geht die IP-Adresse jedes Spielers an Google, im Browser wie in der Windows-App. Das LG München I hat am 20.01.2022 (3 O 17493/20) eine solche dynamische Einbindung ohne Einwilligung als Verstoß gegen die DSGVO gewertet und 100 € Schadensersatz zugesprochen. Das ist ein Urteil der ersten Instanz, andere Gerichte bindet es nicht.
- **Vorschlag:** die drei Schriften als Dateien ins Spiel legen (`schrift/`, `@font-face` in `css/schrift.css`), so wie die eigene Anzeigeschrift. Dann läuft das Spiel auch offline mit allen Schriften.
- Die Lizenz der drei Schriften prüfe ich vorher an jeder Schrift. Nach meinem Kenntnisstand ist es die SIL Open Font License, geprüft habe ich das noch nicht.
- Der Eingriff betrifft `index.html` und `css/` (K35b, popolupo). Deshalb nur nach Absprache.

## Quellen

- [WebKit: 7-Day Cap on All Script-Writable Storage (Bug 211775)](https://bugs.webkit.org/show_bug.cgi?id=211775), [Didomi: Apple implements 7-day cap](https://docs.didomi.io/releases-and-announcements/announcements/apple-implements-7-day-cap-on-script-writable-storage), [Simo Ahava: First-party cookies and WebKit, revisited](https://www.simoahava.com/privacy/first-party-cookies-webkit-revisited/)
- [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [Pinsent Masons: Football game banned over player's image rights](https://pinsentmasons.com/out-law/news/football-game-banned-over-players-image-rights), [fifplay: Oliver Kahn sued EA Sports](https://www.fifplay.com/oliver-kahn-sued-ea-sports-over-fifa/), [LTO: OLG Frankfurt zu Sammelkarten](https://www.lto.de/recht/nachrichten/n/olg-ffm-11u15616-ehemaliger-torwart-nationalmannschaft-sammelkarten-verlag-presse-persoenlichkeitsrecht)
- [Commons: Reusing content outside Wikimedia](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- [LG München I, 3 O 17493/20 (gesetze-bayern.de)](https://www.gesetze-bayern.de/Content/Document/Y-300-Z-GRURRS-B-2022-N-612), [Dr. Datenschutz zum Urteil](https://www.dr-datenschutz.de/schadensersatz-urteil-google-fonts-und-die-dsgvo/)
