# Entwicklungsprotokoll (popolupo)

Gegenstück zu `tests/testprotokoll.md`. Asynchroner Kanal von der Entwicklung auf den Zweigen `mitarbeit/popolupo-*` zu Claude (Zweige `claude/*`). Seit dem 21.11.

**So funktioniert es**
- **Diese Datei schreibt nur popolupo**, das Testprotokoll nur Claude. So gibt es beim Zusammenführen keine Konflikte.
- **Ganz oben steht „Jetzt in Arbeit“**: was popolupo gerade baut. Bitte dort nicht parallel bauen. Umgekehrt gilt, was im Testprotokoll als begonnen steht (zurzeit K24).
- **Darunter das Changelog**, der neueste Schritt oben: Zweig, Commit, was neu ist, welche Tests zuerst laufen sollen und was zu erwarten ist. Ausführlich steht es in der Konsistenzprüfung und im Konzept.
- **Antworten zu Funden** stehen mit der Nummer aus dem Testprotokoll (zum Beispiel „T3.2“), dazu im Commit „behebt T3.2“ oder „zu T3.2“.
- **Neue Zweige beginnen auf dem Stand von `claude/compassionate-galileo-bsbua4`**, damit die Korrekturen aus den Testläufen drin sind. Jeder Schritt bekommt einen eigenen Zweig, der auf dem vorigen aufbaut. Getestet werden kann immer die neueste Spitze.
- **popolupo kann keine Tests laufen lassen** (kein Node.js auf dem Rechner). Vor jedem Commit laufen nur zwei Prüfungen: der Klammer-Check und `tests/code.js` als Perl-Nachbau (`codewaechter.pl`, gleiche Regeln). Alles andere ist ungetestet und steht so im Changelog.

---

## Jetzt in Arbeit

Stand 22.11. Alles bis eb3efbe ist in Lauf 5 getestet und im Claude-Zweig. Neue Zweige beginnen auf 0fae7b8 (Lauf 7):

| Schritt | Zweig | Stand |
|---|---|---|
| Korrekturen zu Lauf 5 (T5.1 bis T5.5, CH4) | `mitarbeit/popolupo-t5-korrekturen` (auf 0fae7b8) | fertig, ungetestet |
| **K23b** Computer-Vereine mit Einnahmen und Ausgaben nach dem Modell statt Pauschale (mit den Zahlen aus BZ7) | `mitarbeit/popolupo-k23b-computer-finanzen` (auf den Korrekturen) | fertig, ungetestet |
| **K23d** Budgets vom Vorstand (Gehaltsrahmen, Transferbudget) | derselbe Zweig | fertig, ungetestet |
| **U19d1** Kaderliste der UEFA | `mitarbeit/popolupo-u19d-kaderliste` (auf K23d) | fertig, ungetestet |
| **K23c** echte Größenordnungen | `mitarbeit/popolupo-k23c-groessenordnungen` (auf U19d1) | fertig, ungetestet, ohne die Messung, Werte aus einer eigenen Modellrechnung, vorläufig |
| **U12e** Zielgespräch mit dem Vorstand (K28 §5.8) | `mitarbeit/popolupo-u12e-zielgespraech` (auf K23c) | fertig, ungetestet |
| **K32 §5.1** Karriereende nach Formel, dazu Korrekturen zu K23c (CS) | `mitarbeit/popolupo-k32-karriereende` (auf U12e) | fertig, ungetestet |
| **K26b** Computer-Vereine bauen | `mitarbeit/popolupo-k26b-computer-bauen` (auf dem Karriereende) | fertig, ungetestet |
| **K23f** Kartenbeträge nach Liga | `mitarbeit/popolupo-k23f-karten-nach-liga` (auf K26b) | fertig, ungetestet |
| **K27b** Dauerkarten | `mitarbeit/popolupo-k27b-dauerkarten` (auf K23f) | fertig, ungetestet |
| **K20b** Preise am Deadline Day, dazu Korrekturen CX | `mitarbeit/popolupo-k20b-deadline-preise` (auf K27b) | fertig, ungetestet |
| **K26c** Fanshop und Instandhaltung der Computer-Vereine, dazu Korrekturen CZ | `mitarbeit/popolupo-k26c-fanshop-instandhaltung` (auf K20b) | fertig, ungetestet |
| **K20c** Bieterwettstreit beim Kauf | `mitarbeit/popolupo-k20c-bieter-kauf` (auf K26c) | fertig, ungetestet |
| **U12f** Zwischenbilanz im Winter | `mitarbeit/popolupo-u12f-zwischenbilanz` (auf K20c) | fertig, ungetestet |
| **K29b** Medienpolitik, dazu Korrekturen DD | `mitarbeit/popolupo-k29b-medienpolitik` (auf U12f) | fertig, ungetestet |
| **K23g** Lizenzprüfung der Computer-Vereine | `mitarbeit/popolupo-k23g-lizenz-computer` (auf K29b) | fertig, ungetestet |
| U19d2 volle Kader der Auslandsvereine in der Engine | zurückgestellt | Entwurf in K37 §5.7. Die Engine behandelt Auslandsvereine als Block wie Amateure, viele Stellen schlagen Spieler in `PIX` nach. Erst nach einem Testlauf und der Messung des Faktors 0,93 |

**Die neueste Spitze ist immer der zuletzt genannte Zweig, er enthält alles davor.** K24 ist fertig (Claude).

**Vorschlag für den nächsten Testlauf** (Spitze `mitarbeit/popolupo-k23g-lizenz-computer`, alles ungetestet, aber von lesenden Prüf-Agenten durchgesehen, Konsistenzprüfung CS, CX, CZ, DD):
1. `node tests/code.js`, dann die schnellen Einzeltests der neuen Teile: `finanzen.js` (Nr. 11 bis 19), `schwierigkeit.js`, `werbung.js`, `europapokal.js`, `vorstand.js` (Nr. 10 bis 14), `karriereende.js`, `stadion.js` (Nr. 8 bis 10), `karten.js`, `spielwelt-karten.js`, `fans.js` (K27b), `abwerben.js` (K20b), `transfers.js` (K20c), `presse.js` (K29b).
2. `node tests/lizenz.js` (Gleichschritt, neue Bereiche `zielgespraech`).
3. `node tests/finanzmodell.js 2`: Salden je Liga nach K23c. Erwartet nach der Modellrechnung 1. Liga etwa +11 Mio., 2. Liga etwa 0, 3. Liga etwa −1 Mio. je Verein und Saison ohne Transfers (K23 §5.6b). Weichen sie stark ab, bitte die Zeilen ins Testprotokoll, ich stelle dann `REGELN.finanzen.verwaltung` und `sponsor` nach.
4. Die langen Läufe: `welt.js` über zehn Saisons (Karriereende CR3, Pool CR4, Bauten CT3, Transfers CP3/CP4), `ui-zwei-saisons.js`, `fuzz-karrieren.js`.

---

## Antworten zu offenen Funden

**Zu Lauf 8 (22.11., Zweig `mitarbeit/popolupo-u19d-kaderliste`):**
- **T8.2 (T5.2):** Nachgerechnet. Zwischen Donnerstag (Europapokal) und Dienstag (Pokal) gibt es keinen Tag mit drei Tagen Abstand zu beiden, darum blieb nur der Samstag.
  - Jetzt wie beim DFB: Wer in den fünf Tagen vor einer Pokalrunde im Europapokal spielt, spielt den Pokal einen Tag später (Mittwoch, in Runde 1 Sonntag), mit seinem Gegner (`S.cup.spaet`, Konsistenzprüfung CO1).
  - Die Runde wird erst nach dem zweiten Tag eingetragen.
  - Dazu verlegt die Liga nie mehr auf einen Montag (CN4).
- **T8.1:** wie vorgeschlagen, `tests/finanzen.js` Nr. 4 schaltet die Entlassung ab.
- **T8.3:** Vermutung: Freiburg (Verein 6 im Test) kommt mit dem Faktor 0,93 öfter in die Ligaphase der Conference League. Die englischen Wochen drücken die Kondition unabhängig vom Training. `tests/training.js` Nr. 4 spielt jetzt ohne Europapokal. Falls es danach rot bleibt, liegt es an der Verlegung, dann schaue ich weiter.
- **T5.3:** danke für die Messung. Ich lasse 0,93 vorerst so und warte auf die vollen Kader (U19d2), statt den Faktor weiter zu drehen.

**Zu Lauf 5 (22.11., Zweig `mitarbeit/popolupo-t5-korrekturen`):**
- **T5.1** (Gleichschritt 25 Tage): wie vorgeschlagen, `tests/lizenz.js` nimmt in 5a auch `kartenWoche` aus.
- **T5.2** (72 Stunden, 24 Fälle): Ursache gefunden. Die Europapokal-Verlegung schob das Freitagsspiel auf Samstag, die Pokalrunde am Dienstag danach zog es wieder auf Freitag (drei Tage vor dem Pokal, aber zwei nach dem Europapokal). `ligaVerlegen` sucht jetzt einen Tag, der für beide Vereine drei Tage Abstand zu allen ihren Spielen hat (Liga, Pokal, Supercup, Europapokal, neu `spieltageVon`, `euTageVon`). Behebt T5.2.
- **T5.3** (Europapokal zu schwer): Der Block der Auslandsvereine bekam die volle Stärke, eine Bundesliga-Elf in der Engine nur etwa 0,93 davon (Zustand, Anteile je Position, Schwächster im Bereich). `REU.staerke.faktor` ist jetzt 0,93. Bitte noch einmal wie in Lauf 5 messen (Seed 5, drei Saisons).
- **T5.4** (`ui-zwei-saisons.js`): Der Test prüft bei `wbVon(r)==='eu'` jetzt die Sperre `eu`.
- **T5.5**: `startBuild` prüft `darf('stadion')` selbst, `startBuildAlt` ist entfernt (CB7 erledigt).
- **CH4** (`supercupAnlegen` mit Amateur-Pokalsieger): gleich mit behoben, dann spielt der Vizemeister. Ich war ohnehin in `wettbewerbe.js`.
- **CI1** (1. Juli ohne `taeglich`): lasse ich dir, weil es den Kern von `weiter` betrifft.
- **BZ7:** danke, die Zahlen nehme ich für K23b.

- **T1.3 Rest** (Stärke der 2. Liga knapp über der Grenze) und **T3.2** (Kondition nach der Vorbereitung): Ohne Testlauf kann ich nicht messen, darum fasse ich beides vorerst nicht an. K23b ändert die Konten der Computer-Vereine und damit ihre Käufe, das kann T1.3 in beide Richtungen verschieben. Bitte nach K23b noch einmal ansehen.
- **T2.2** (Stimmung wirkt beim Abwerben doppelt): Die Entscheidung im Testprotokoll passt (so steht es in K20 §11).

---

## Changelog

### 22.11.2026: K23g Lizenzprüfung der Computer-Vereine (Zweig `mitarbeit/popolupo-k23g-lizenz-computer`, auf K29b)

- **Neu (K23 §5.5g, Konsistenzprüfung DE):** Computer-Vereine bekommen am 1. März Auflagen, wenn ihre Liquidität am Ende der nächsten Saison negativ ist, und am 31. Mai bei weiter negativer Liquidität eine Transfersperre für die nächste Saison (kein Kauf, keine Leihe, keine Angebote, kein Mitbieter).
- **Tests zuerst:** `tests/finanzen.js` (neu Nr. 19), danach `tests/welt.js` über mehrere Saisons (wie viele Sperren, DE2) und `tests/lizenz.js` Nr. 5.

### 22.11.2026: Korrekturen nach Prüfung DD (Zweig `mitarbeit/popolupo-k29b-medienpolitik`)

- Ein lesender Prüf-Agent hat K20c und U12f durchgesehen (Konsistenzprüfung DD).
- **Behoben:** Deckel des Mitbieters (DD1, sonst kam fast nie einer und der Test K20c wäre gescheitert), Mitgehen vor Pause und Beziehung (DD2), kein Wechsel nach einem Jobwechsel in der Frist (DD3), Grenzen wie unter Computer-Vereinen (DD4), kein Mitbieter kurz vor Fensterschluss (DD5), Test „einmal je Saison“ (DD6), alter Spielstand bei der Zwischenbilanz (DD7).
- **Tests zuerst:** `tests/transfers.js` (K20c), `tests/vorstand.js` (Nr. 14).

### 22.11.2026: K29b Medienpolitik (Zweig `mitarbeit/popolupo-k29b-medienpolitik`, auf U12f)

- **Neu (K29 §6, Konsistenzprüfung DC):** Medienpolitik offen, zurückhaltend oder abgeschottet im Medien-Kasten (Bereich `presse`). Das Medienklima wirkt jetzt auf die Gerüchte über deinen Verein.
- **Tests zuerst:** `tests/presse.js` (neu K29b), `tests/geruechte.js`, `tests/lizenz.js`.

### 22.11.2026: U12f Zwischenbilanz im Winter (Zweig `mitarbeit/popolupo-u12f-zwischenbilanz`, auf K20c)

- **Neu (K28 §4 Nr. 3, §5.9, Konsistenzprüfung DB):** Zur Hälfte deiner Ligaspiele hebt der Vorstand das Ziel bei klar besserem Platz an, bei klar schlechterem kannst du eine Senkung beantragen (wirkt wie Tiefstapeln).
- **Tests zuerst:** `tests/vorstand.js` (neu Nr. 14), `tests/ui-zwei-saisons.js` (Meldung zur Zwischenbilanz).

### 22.11.2026: K20c Bieterwettstreit beim Kauf (Zweig `mitarbeit/popolupo-k20c-bieter-kauf`, auf K26c)

- **Neu (K20 §4.2, Konsistenzprüfung DA):** Sagt ein deutscher Verein im offenen Fenster Ja zu deiner Ablöse, bietet mit 25 % ein Computer-Verein mit Bedarf mit (2 bis 10 % mehr, höchstens sein Vereinswert). Du hast 2 Tage zum Mitgehen, sonst wechselt der Spieler zu ihm.
- **Tests zuerst:** `tests/transfers.js` (neu K20c, ältere Prüfungen ohne Mitbieter), `tests/vertraege.js`, `tests/leihe.js`, `tests/fuzz-karrieren.js`, `tests/lizenz.js`.

### 22.11.2026: Korrekturen nach Prüfung CZ (Zweig `mitarbeit/popolupo-k26c-fanshop-instandhaltung`)

- Ein lesender Prüf-Agent hat K23f, K27b, K20b und K26c durchgesehen (Konsistenzprüfung CZ). Befunde nur bei den Dauerkarten.
- **Behoben:** Test für den Deckel (CZ1), Dauerkarten zahlen den Preis vom Verkauf statt des Tagespreises (CZ2), verkaufter Rabatt gilt auch mit Automatik (CZ3), Anzeige während eines Tribünenbaus (CZ4).
- **Tests zuerst:** `tests/fans.js` (K27b).

### 22.11.2026: K26c Fanshop und Instandhaltung der Computer-Vereine (Zweig `mitarbeit/popolupo-k26c-fanshop-instandhaltung`, auf K20b)

- **Neu (K26 §5.2, Konsistenzprüfung CY):** Computer-Vereine bauen zum Saisonstart auch Fanshops (vorn in der Liste) und verkaufen damit Fanartikel. Sie zahlen Instandhaltung je Ligaspiel.
- **Tests zuerst:** `tests/stadion.js` (Nr. 9 geändert, neu Nr. 10), `tests/finanzen.js` Nr. 11, `tests/finanzmodell.js` über zwei Saisons.

### 22.11.2026: Korrekturen nach Prüfung CX (Zweig `mitarbeit/popolupo-k20b-deadline-preise`)

- Ein lesender Prüf-Agent hat U12e, das Karriereende und K26b durchgesehen (Konsistenzprüfung CX).
- **Behoben:** `tests/karriereende.js` Nr. 5 jetzt über zwei Saisons (CX1), Ruf nach dem Hochpokern vom Vorschlag aus plus Zuschlag (CX2), Grenzen des Ziels in der 2. und 3. Liga (CX3), Schritte an der Grenze (CX4), Faktor des Zielgesprächs auch im Budget der Automatik (CX5), Kreuzband bei Vereinslosen (CX6).
- **Tests zuerst:** `tests/karriereende.js`, `tests/vorstand.js` (Nr. 13), `tests/lizenz.js` (Gleichschritt mit `kiBudget`).

### 22.11.2026: K20b Preise am Deadline Day (Zweig `mitarbeit/popolupo-k20b-deadline-preise`, auf K27b)

- **Neu (K20 §4.3, Konsistenzprüfung CW):** In den letzten drei Tagen eines Fensters schwankt die Forderung deutscher Computer-Vereine an dich um bis zu ±15 % (fest je Spieler und Tag), Spieler auf ihrer Transferliste kosten 10 % weniger, Angebote für deine gelisteten Spieler kommen 1,5-mal so oft. Hinweis in der Deadline-Karte.
- **Tests zuerst:** `tests/abwerben.js` (neu K20b), `tests/transfers.js` (Forderung außerhalb des Deadline Days unverändert), `tests/lizenz.js`.

### 22.11.2026: K27b Dauerkarten (Zweig `mitarbeit/popolupo-k27b-dauerkarten`, auf K23f)

- **Neu (K27 §5.2, Konsistenzprüfung CV):** Dauerkarten für deinen Verein: Verkauf beim ersten Ligaheimspiel nach Fanstimmung und Rabatt (10, 20, 30 %, Bereich `preise`), je Ligaheimspiel Buchung „Dauerkarten“, Einzelkarten nur für die übrige Nachfrage, Fanstimmung ±2 je 10 Prozentpunkte Rabatt.
- **Tests zuerst:** `tests/fans.js` (neu K27b), `tests/finanzen.js` (Kontostand nachvollziehbar, Prognose), `tests/lizenz.js` (Gleichschritt), `tests/ui-zwei-saisons.js` (Finanzen-Tab).

### 22.11.2026: K23f Kartenbeträge nach Liga (Zweig `mitarbeit/popolupo-k23f-karten-nach-liga`, auf K26b)

- **Neu (K30 §3.2, Konsistenzprüfung CU):** Geldwirkungen der Ereigniskarten mal 1, 2 oder 4 nach der Liga deines Vereins (`kartenGeld`), Texte mit `{geld:Grundwert}`.
- **Tests zuerst:** `tests/karten.js`, `tests/finanzen.js` (Mäzen), `tests/spielwelt-karten.js` (Abschiedsspiel).

### 22.11.2026: K26b Computer-Vereine bauen (Zweig `mitarbeit/popolupo-k26b-computer-bauen`, auf dem Karriereende)

- **Neu (K26 §7, §5.2):** Zum Saisonstart bauen Computer-Vereine eine Tribüne (Nachfrage zwei Saisons über 95 %, kein Leerbau, nur mit Reserve) oder höchstens eine Anlage nach Profil (`kiNachfrage`, `kiBauen`, `kiBauenSaison` in `js/stadion.js`). Ohne Zufall.
- **Tests zuerst:** `tests/stadion.js` (neu Nr. 8, 9), danach `tests/welt.js` über mehrere Saisons (Bauten, Konten) und `tests/lizenz.js` Nr. 5 (CT4).

### 22.11.2026: Korrekturen zu K23c nach einer Prüfung ohne Laufzeit (Zweig `mitarbeit/popolupo-k32-karriereende`)

- Ein lesender Prüf-Agent hat K23c (cfe0f41) durchgesehen, Konsistenzprüfung CS.
- **Behoben:** `tests/schwierigkeit.js` mit alter Kreditformel (CS1), ungerundete Werbung bei Computer-Vereinen (CS2, sonst scheitert `tests/finanzen.js` Nr. 11), Fünfjahreswertung in der Regionalliga (CS3), alte Spielstände: auch vorgemerkte Wechsel und Werbeverträge umrechnen (CS4).
- **Tests zuerst:** `tests/schwierigkeit.js`, `tests/finanzen.js` (Nr. 11, 17).

### 22.11.2026: Karriereende nach K32 §5.1 (Zweig `mitarbeit/popolupo-k32-karriereende`, auf U12e)

- **Neu:** Chance je Saison = Grundwert nach Alter × Niveau × Verletzung × Professionalität statt „ab 34 je Jahr 25 %, spätestens 38“ (`karriereChance`, `karriereEnde` in `js/saison.js`, Auslandspool in `js/ausland.js`). Eigener Strom je Spieler.
- **Tests zuerst:** neu `tests/karriereende.js`, dann `tests/welt.js` über zehn Saisons (Stärke der Ligen, Größe des Pools, CR3, CR4) und `tests/spielermodell.js`, falls es Alter oder Karriereende zählt.
- **Achtung:** Der übrige Zufall im Saisonwechsel verschiebt sich gegenüber alten Läufen (CR2).

### 22.11.2026: U12e Zielgespräch (Zweig `mitarbeit/popolupo-u12e-zielgespraech`, auf K23c)

- **Neu (K28 §5.2, §5.8):** Zielgespräch mit dem Vorstand im Büro, offen ab dem Setzen des Saisonziels bis zum nächsten eigenen Ligaspiel.
  - Annehmen, Hochpokern (immer angenommen, Budget +10 % je Platz, Ruf-Zuschlag bei Erfolg), Tiefstapeln (Zusage nach Vertrauen, Ruf, Ehrgeiz des Präsidenten; Budget −15 % je Platz; abgelehnt Vertrauen −3).
  - Transferbudget (K23d) bekommt den Faktor aus dem Gespräch. Kauf über dem Budget kostet Vertrauen (weiche Grenze).
  - Neuer Bereich `zielgespraech` (Grundlizenz, ohne Automatik), K36 Nr. 62.
- **Tests zuerst:** `tests/vorstand.js` (neu Nr. 10 bis 13), `tests/lizenz.js` (neuer Bereich), `tests/vorbereitung.js` (Punkt „Saisonziel und Zielgespräch“).
- **Doku:** K28 §5.8 und §12 Nr. 18 bis 22, K23 §5.5f, K33, K36, Konsistenzprüfung CQ, offene Entscheidungen, Test-README.

### 22.11.2026: K23c echte Größenordnungen (Zweig `mitarbeit/popolupo-k23c-groessenordnungen`, auf U19d1)

- **Ohne die Messung** aus K23 §5.6a (der Nutzer wollte heute nicht auf Testläufe warten). Die Werte kommen aus einer Modellrechnung der Welt (K23 §5.6b), alle vorläufig.
- **Neu und geändert:**
  - Gehälter und Marktwerte steiler (`RP.gehalt` 2,5 Mio. und 0,16, `RP.marktwert` 7 Mio. und 0,2).
  - TV nach dem Säulenmodell mit echten Töpfen und Fünfjahreswertung (`tvSaison`, `tvWertungEintragen`, `S.tvS`, `t.tvw`, `t.tv0` in `js/welt.js`).
  - Werbung mit Grundbetrag exponentiell im Ansehen (`sponsorBasis`), 37 % davon als „Weitere Sponsoren“ je Ligaspiel.
  - Neuer Posten „Verwaltung“ für alle Vereine (`verwaltungKosten`).
  - Sonstige Einnahmen, Startkonto, Kreditrahmen, Gehaltsrahmen (75 %), Finanzlage, Budgets der Auslandsvereine, Europapokal mit Faktor 1, Tribüne 12 Mio.
  - Alte Spielstände: Gehälter einmal umgerechnet (`k23cUmstellen`).
- **Tests zuerst:**
  - `tests/finanzmodell.js` mit **zwei Saisons**: Saldo je Liga (erwartet 1. Liga etwa +11 Mio., 2. Liga etwa 0, 3. Liga etwa −1 Mio. je Verein, ohne Transfers), dazu die Zeilen „Spieler“ und „nach Stärke“.
  - `tests/finanzen.js` (neu Nr. 14 bis 18), `tests/werbung.js`, `tests/transfers.js`, `tests/europapokal.js`, `tests/lizenz.js` (Gleichschritt).
  - Danach die langen Läufe (`tests/welt.js`, `tests/ui-zwei-saisons.js`): Transfers je Fenster gegen Lauf 5, Insolvenzen, Kontostände nach zwei Saisons.
- **Was ich erwarte, das schiefgehen kann:**
  - Viel weniger oder viel mehr Transfers, weil sich Preise und Budgets anders verschoben haben (CP3, CP4).
  - Zu viele Insolvenzen in der 3. Liga (Kreditrahmen jetzt 4 bis 6 Mio.).
  - Tests mit festen Geldbeträgen, die ich übersehen habe.

### 22.11.2026: Korrekturen zu Lauf 8 (Zweig `mitarbeit/popolupo-u19d-kaderliste`)

- **Behebt T8.2:**
  - Pokal am zweiten Tag für Vereine aus dem Europapokal.
  - In `wettbewerbe.js`: `pokalSpaet`, `pokalSpaetIst`, `pokalGeteilt`, `pokalPaareAm`, `pokalMeinTag`. `pokalVerlegen` und `spieltageVon` kennen den zweiten Tag.
  - Termine (`termineAm`), eigenes Spiel (`meinSpiel`), Training (`spielendeAm`), Kalender und Eintragen der Runde (`tagesSpieleAbschliessenLauf`, `S.cup.teil`) sind angepasst.
- **Behebt T8.1, zu T8.3:** nur Tests (Entlassung aus, Europapokal aus).
- **Tests zuerst:** `tests/wettbewerbe.js` (72 Stunden, Pokal), `tests/training.js`, `tests/finanzen.js`, `tests/ui-zwei-saisons.js` (Pokal im echten Ablauf), `tests/seed.js` (Spielstand mit geteilter Runde).

### 22.11.2026: Korrekturen nach einer Prüfung ohne Laufzeit (Zweig `mitarbeit/popolupo-u19d-kaderliste`)

- **Konsistenzprüfung CN:**
  - Nachmeldung ohne Liste (CN1).
  - Gehaltsrahmen mit derselben Regel für alle beim Kauf (`rahmenErlaubt`, CN2).
  - Rahmen ohne Fanstimmung und Form (Gleichschritt, CN3).
  - Keine Verlegung auf Montag (CN4).
  - Sperrtext „nicht gemeldet“ (CN5), Texte nach der Nachmeldung (CN6), Torhüterregel (CN7), Startkader (CN8), Messskript (CN9), Gegnerstärke (CN10).
- **Auch:** Claudes Sponsorentag (c50db88) ist per Merge in diesem Zweig, damit das Zusammenführen glatt geht.
- **Tests zuerst:** wie bei U19d1, dazu `tests/lizenz.js` (Gleichschritt mit dem Rahmen) und `tests/wettbewerbe.js` (72 Stunden).

### 22.11.2026: U19d1 Kaderliste der UEFA (Zweig `mitarbeit/popolupo-u19d-kaderliste`, auf K23d)

- **Neu in `js/europa.js`:**
  - Liste A mit den Regeln des Reglements: 25 Spieler, 2 Torhüter, 8 Plätze für lokal Ausgebildete, davon höchstens 4 aus dem Verband. Dazu Liste B.
  - Fristen vor dem 1. Spieltag und zur Nachmeldung vor den K.-o.-Play-offs, mit höchstens drei neuen Spielern.
  - Automatische Meldung, Melden und Streichen im Reiter Kader.
- **Geändert:** `gesperrt` in disziplin.js sperrt im Europapokal Ungemeldete (Konsistenzprüfung CM).
- **Tests zuerst:** `tests/europapokal.js` (Nr. 10 neu), `tests/lizenz.js`, `tests/ui-zwei-saisons.js` (Einsatz nur mit Meldung).

### 22.11.2026: K23d Budgets vom Vorstand (Zweig `mitarbeit/popolupo-k23b-computer-finanzen`)

- **Neu in `js/finanzen.js`:** `erwarteteEinnahmen`, `gehaltsRahmen` (85 % davon, vorläufig), `rahmenAnteil`, `transferBudget`. Anzeige auf der Finanzseite.
- **Geändert:**
  - `offer` blockt neue Gehälter über 110 % des Rahmens.
  - `kiMarkt` lässt Vereine über 110 % nicht kaufen, auch deinen in der Automatik (Gleichschritt).
  - `vorstandWoche` zieht über 100 % Vertrauen ab.
- **Zu erwarten:** Teure Vereine mit kleinem Stadion kaufen weniger (CL1). Das bremst die Verluste aus K23b (CL3).
- **Tests zuerst:** `tests/finanzen.js` (Nr. 13 neu), `tests/lizenz.js` (Gleichschritt), `tests/transfers.js` (Kauf mit neuer Grenze), `tests/vorstand.js`.

### 22.11.2026: Plan für K23c, Messung erweitert (Zweig `mitarbeit/popolupo-k23b-computer-finanzen`)

- **K23 §5.6a:** Plan für die echten Größenordnungen, mit Zahlen aus dem DFL-Wirtschaftsreport.
  - Im Spiel sind TV-Gelder etwa ein Fünftel, Werbung ein Siebtel und die Gehälter der Großen ein Drittel der echten Werte.
  - Zuschauer, Pokalprämien und vermutlich die Ablösen stimmen schon ungefähr.
  - Vorschlag: eine steilere Gehaltskurve, TV nach dem Säulenmodell, Werbung auf echte Größe, Europapokal mal 1.
- **`tests/finanzmodell.js`** gibt je Liga zusätzlich Gehälter und Marktwerte aus (Schnitt, Median, Spitze, nach Stärke).
  - **Bitte mit dem Lauf zu K23b einmal `node tests/finanzmodell.js 2` ins Testprotokoll.**
  - Daraus stelle ich die Gehalts- und Marktwertkurve für K23c ein.
- **Kein Spielcode geändert.**

### 22.11.2026: K23b Computer-Vereine nach denselben Regeln (Zweig `mitarbeit/popolupo-k23b-computer-finanzen`, auf den Korrekturen)

- **Neu in `js/finanzen.js`:**
  - `kiFinanzenSpiel`: Computer-Vereine buchen je Ligaspiel wie du. Einnahmen sind TV, Sponsor, Sonstiges und zu Hause Zuschauer, Fanartikel und Logen. Ausgaben sind Gehälter von Kader und Stab, Betrieb und Jugend.
  - `kiPokalSpiel`: Rundenprämien statt der Pauschale für alle.
  - `kiInsolvenzPruefen`: Insolvenz auch für Computer-Vereine.
  - `sonstigeEinnahmen`: für alle Vereine je Ligaspiel, 2. Liga 25.000 €, 3. Liga 60.000 € (aus BZ7, vorläufig).
- **Geändert:** `fremdeEinnahmen` wird nicht mehr benutzt (nur noch im Messskript zum Vergleich). Deine Buchung „Sonstige Einnahmen“ in der 2. und 3. Liga.
- **Zu erwarten (CK1):** Erstligisten werden reicher, besonders die mit großem Stadion. Das kann Kalibrierung, T1.3 Rest und die Titelverteilung verschieben.
- **Bitte messen:** `node tests/finanzmodell.js 2` noch einmal. Die Spalte „heute“ ist dann die alte Pauschale zum Vergleich, der Saldo sollte zu den echten Kontoständen passen. Dazu die Kontostände der Computer-Vereine nach drei bis fünf Saisons, wenn das leicht geht (Schnitt je Liga, Zahl im Minus, Insolvenzen).
- **Tests zuerst:** `tests/finanzen.js` (Nr. 11 und 12 neu), `tests/spielermodell.js` (T1.3), `tests/kalibrierung.js`, `tests/fuzz-karrieren.js`.

### 22.11.2026: Korrekturen zu Lauf 5 (Zweig `mitarbeit/popolupo-t5-korrekturen`, auf 0fae7b8)

- **Behebt T5.2:** `ligaVerlegen` mit Blick auf alle Spiele beider Vereine (`spieltageVon` in wettbewerbe.js, `euTageVon` in europa.js).
- **Zu T5.3:** `REU.staerke.faktor` 1 → 0,93. Die Kurzrechnung beim Nachholen nimmt für deutsche Vereine denselben Faktor.
- **Behebt T5.1, T5.4, T5.5, CH4:** siehe Antworten oben.
- **Tests zuerst:** `tests/wettbewerbe.js` (72 Stunden), `tests/europapokal.js`, `tests/lizenz.js`, `tests/ui-zwei-saisons.js`, dazu die Messung aus T5.3.

### 21.11.2026: K37 §5.6 und §5.7: Entwurf für U19d (Zweig `mitarbeit/popolupo-u19-europapokal`, kein Code)

- Kaderliste der UEFA nach dem echten Reglement, mit Näherung für lokal Ausgebildete, Frist und Gleichschritt, Bereich `aufstellung`.
- Volle Kader der Auslandsvereine in der Engine, mit den nötigen Wächtern.
- Berichtigt: In K37 §9 stand ein Bereich `kader`, den es nicht gibt.
- **Gebaut wird U19d erst nach einem Testlauf von U19a bis U19c.**

### 21.11.2026: Recherche K37: Pokalsieger 2026, Rangprämie Conference League (Zweig `mitarbeit/popolupo-u19-europapokal`)

- Bayern gewann 2026 auch den DFB-Pokal, darum stimmen die deutschen Starter 2026/27 in `daten/termine.js` (Sechster und Siebter rücken nach).
- Rangprämie der Conference League vorläufig geschätzt (CD3), in `REGELN.europa.geld.ecl`.

### 21.11.2026: Finanzplan nach einer Prüfung ohne Laufzeit korrigiert (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Behoben** (Konsistenzprüfung CI):
  - Monatsbericht an der Saisongrenze, zwölf statt elf Raten im Jahr (CI1).
  - Saldo je Spiel nach einem Vereinswechsel (CI2).
  - Transfersperre nicht mehr über Juni-Käufe und Automatik umgehbar (CI3).
  - Schuldenschnitt zählt nicht für das Nebenziel „Finanzen“ (CI4).
  - Erster Monatsbericht pünktlich (CI5), Mindestrate bei Krediten (CI6).
- **Hinweis für dich (CI1):** Der 1. Juli läuft nie durch `taeglich`, weil `weiter` nach `newSeason` abbricht. Das betrifft alle Tagesaufgaben, nicht nur meine.
- **Auch geändert:** `tests/sim.js` ruft nach dem Vereinswechsel `finanzenStart` auf.
- **Tests zuerst:** `tests/finanzen.js` (besonders Nr. 4, Kontostand über eine Saison), `tests/vorstand.js` (Nebenziel Finanzen).

### 21.11.2026: Europapokal nach einer Prüfung ohne Laufzeit korrigiert (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Zwei schwere Fehler behoben** (Konsistenzprüfung CH):
  - Tage nur mit Spielen Ausland gegen Ausland wurden nicht eingetragen, der Wettbewerb blieb stecken (CH1). Dazu ein Sicherheitsnetz `euNachholen`.
  - Die Auslosung der Champions League hielt „kein Gegner aus dem eigenen Land“ fast nie ein (CH2). Jetzt Tausch innerhalb der Töpfe.
- **Kleinere:** Test Nr. 1 und Nr. 6 (CH3, CH8), Amateurverein als Pokalsieger (CH4), Rückspiel vorher sichtbar (CH5), Text nach dem Aus in der Qualifikation (CH6).
- **Für dich (alt, nicht von mir):** `supercupAnlegen` bricht ab, wenn ein Amateurverein den Pokal gewinnt (CH4).
- **Tests zuerst:** `tests/europapokal.js`, bitte mit Blick auf die Dauer der Auslosung (CH10).

### 21.11.2026: K25b Karte „Trikot ausverkauft“ (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Neu:** Entscheidungskarte „Trikot ausverkauft“ (K25 §8), Auslöser `teenieStar` (Spieler bis 20 mit 3 Ligatoren), Wirkung `merch` (vier Wochen mehr Fanartikel). Konsistenzprüfung CG.
- **Behoben nebenbei:** Europapokaltore `eg` werden zum Saisonwechsel auf 0 gesetzt (CG3).
- **Tests zuerst:** `tests/marketing.js` (Nr. 7 neu), `tests/karten.js`, `tests/lizenz.js`.

### 21.11.2026: Vereinswechsel räumt auf (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Fehler aus K23e, K25a, K26a**, gefunden bei einer Nachkontrolle (Konsistenzprüfung CF):
  - Ein laufender Tribünenbau kostete den alten Verein beim Vereinswechsel für immer 3.000 Plätze.
  - Kredit-Tranchen und Ablöse-Raten gingen zum neuen Verein mit und wären dort abbezahlt worden.
  - Werbewert, Trikot und Kampagnen gingen ebenfalls mit.
- **Behoben:** `bauAbgeben` (stadion.js), `finanzenJobwechsel` (finanzen.js), `marketingJobwechsel` (marketing.js), aufgerufen in `takeJob`.
- **Auch geändert:** `tests/sim.js`. Der Vereinswechsel im Simulator ruft dieselben drei Funktionen auf (nur wenn es sie gibt). Bitte sag Bescheid, falls du das anders willst.
- **Tests zuerst:** `tests/finanzen.js` (Nr. 10 neu), `tests/stadion.js` (Nr. 7 neu), `tests/fuzz-karrieren.js` (viele Vereinswechsel).

### 21.11.2026: Korrektur zu U19a: Kurzform `REU` fehlte (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Fehler:** In der Liste der Kurzformen am Ende von `daten/regeln.js` fehlte `REU=REGELN.europa`. Jeder Zugriff des Europapokals wäre mit „REU is not defined“ abgebrochen, schon beim Aufbau der Welt. Gefunden bei einer Nachkontrolle mit einem Perl-Skript, das benutzte gegen deklarierte Namen prüft.
- **Behoben** in diesem Commit. Die Commits 6b8f973 (U19a) bis be1fbd5 laufen ohne ihn nicht. Bitte immer die neueste Spitze testen.

### 21.11.2026: Recherche-Nachträge K37 und K26 (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **K37:** Rangprämie der Europa League (75.000 je Anteil, Platz 1–8 600.000, Platz 9–16 300.000) recherchiert und in `REGELN.europa.geld.el` und `euRangpraemie` eingebaut. Conference League bleibt offen (CD3).
- **K26:** Baukosten je Sitzplatz recherchiert (3.000 bis 6.000 €), die Werte im Spiel bleiben bis K23c (K26 §12).
- **Tests:** keine neuen, `tests/europapokal.js` deckt die Rangprämie nicht einzeln ab.

### 21.11.2026: U19c Europapokal: Länderwertung, Interesse, Nebenziel (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Neu in `js/europa.js`:** Länderwertung je Saison, Anzeige in der Karte „Europapokal“. Die besten zwei Länder bekommen nächste Saison einen Platz mehr in der Champions League, für Deutschland rückt dann der Fünfte nach.
- **Geändert:**
  - `wechselInteresse` (vertraege.js): +6/+3/+1 für einen Verein im Europapokal, verglichen mit dem bisherigen Verein.
  - Nebenziele (vorstand.js): neue Art „Europapokal“.
- **Tests zuerst:** `tests/europapokal.js` (jetzt neun Prüfungen), `tests/vorstand.js` (Nebenziele), `tests/vertraege.js` und `tests/transfers.js` (Interesse, CE2).
- **Doku:** K37 (Stand, §4.6 mit U19d, §12 Nr. 16 bis 18), K33, K36 Nr. 57, Konsistenzprüfung CE, offene Entscheidungen, Test-README.

### 21.11.2026: U19b Europapokal: Prämien, Wertsäule, Ansehen (Zweig `mitarbeit/popolupo-u19-europapokal`)

- **Neu in `js/europa.js`:** Startgeld und Wertsäule mit der Auslosung, Sieg- und Remisprämie, Rangprämie (Champions League), Rundenprämien, Siegprämie. Echte Beträge 2025/26 mal 0,2 (`REU.geld.faktor`), für alle deutschen Teilnehmer. Dein Verein bucht „Europapokal“.
- **Geändert:**
  - Ansehen zum Saisonwechsel nach erreichter Runde (`euAnsehen` in `saison.js`).
  - Zuschauer nach dem Ansehen des Gegners.
  - Vorstand +1,5 je gewonnenem Duell, +10 beim Titel.
  - Europapokaltore am Spieler in `eg`, Titel in der Vitrine.
- **Zu erwarten:** Computer-Vereine im Europapokal haben deutlich mehr Geld (CD1). **Für K23b wichtig:** Bitte `tests/finanzmodell.js` auf diesem Stand messen, dann sehe ich das Europapokal-Geld schon in den Zahlen.
- **Tests zuerst:** `tests/europapokal.js` (jetzt acht Prüfungen), `tests/finanzen.js` (Kontostand aus den Buchungen, neue Buchung „Europapokal“), `tests/statistik.js` (Vitrine).
- **Doku:** K37 (Stand, §12 Nr. 14 und 15), K33, K36 Nr. 56, Konsistenzprüfung CD, offene Entscheidungen, Test-README.

### 21.11.2026: U19a Europapokal (Zweig `mitarbeit/popolupo-u19-europapokal`, auf K26)

- **Neu:** `js/europa.js`, Regeln `europa` (`REU`), Termine 2026/27 und deutsche Starter in `daten/termine.js`.
  - Drei Wettbewerbe mit je 36 Vereinen. Deutsche nach Tabelle und Pokal, in der ersten Saison die echten Starter. Auslandsvereine aus dem Pool nach Kontingent, Ansehen und Zufall.
  - Auslosung der Ligaphase nach Töpfen (K37 Nr. 12), Tabelle, K.-o.-Play-offs, Turnierbaum bis zum Finale. Play-off-Runde der Qualifikation für den deutschen Siebten.
  - Spiele mit deutscher Beteiligung in der Engine, der Auslandsverein als Block (CC3). Ausland gegen Ausland als Kurzrechnung.
  - Auslosung als Halt, Spielkarte, Kalender, Karte „Europapokal“ im Reiter Pokal.
- **Geändert:**
  - `pokalVerlegen` heißt jetzt `ligaVerlegen` und verlegt auch Spiele am selben Tag (CC5).
  - Sperren und Gelbe Karten haben `eu` (CC6).
  - `side` in der Engine kennt Auslandsvereine.
  - Europapokaltore zählen nicht als Ligatore.
- **Zu erwarten:** Die Welt ändert sich, weil bis zu neun deutsche Vereine mehr spielen (CC1). Kalibrierung, Akzeptanz und Fuzz-Tests können sich verschieben.
- **Tests zuerst:**
  - `tests/europapokal.js` (neu, sieben Prüfungen)
  - `tests/code.js`
  - `tests/disziplin.js`, `tests/wettbewerbe.js` (Sperren, Verlegung)
  - `tests/pruefungen.js` und `tests/seed.js` (Spielstand mit `S.eu`)
  - `tests/lizenz.js`, `tests/zufall.js` (CC4)
  - danach alles, besonders `tests/kalibrierung.js` und `tests/fuzz-karrieren.js`
- **Bitte messen (CC2):** Wie weit kommen deutsche Vereine über einige Saisons? Ziel nach K37 §10: meist Achtelfinale in der Champions League, selten ein deutscher Sieger.
- **Doku:** K37 (Status, §5.2, §12 Nr. 11 bis 13), K33, K36 Nr. 55, Konsistenzprüfung CC, offene Entscheidungen, Test-README.

### 21.11.2026: K37 Europapokal als Konzept (Zweig `mitarbeit/popolupo-u19-europapokal`, auf K26)

- **Neu:** `konzepte/K37-europapokal.md` (Entwurf), mit Recherche zu Modus, Prämien 2025/26, Terminen 2026/27 und den deutschen Startern 2026/27.
- **Kein Code.** Teilschritte U19a (Wettbewerbe und Spiele), U19b (Geld, Ansehen), U19c (Länderwertung, Kaderliste).
- **Für Claude:** Bitte K37 §5.3 ansehen. Der Faktor 0,2 auf die echten Prämien hängt an K23b/K23c. Wenn die Messung aus `tests/finanzmodell.js` (BZ7) etwas anderes nahelegt, passe ich ihn an.
- **Doku:** PLAN (Tabelle und §4), offene Entscheidungen.
- **Hinweis zu PLAN.md:** Eigentlich ändere ich PLAN.md nicht, das machst du. Hier habe ich nur die Zeile K37 in der Konzepttabelle (Status „Entwurf“) und einen Satz am Anfang von §4 „K37 – Europapokal“ geändert. Bei einem Konflikt beim Zusammenführen gilt deine Fassung, der Hinweis auf die Datei reicht.

### 21.11.2026: K26a Stadion, Anlagen, Bauprozess (Zweig `mitarbeit/popolupo-k26-stadion`, auf K25)

- **Neu:** `js/stadion.js`, in `REGELN.stadion` neu `prozess`, `instandhaltung` und `anlagen`.
  - Jeder Bau (auch Tribüne, Logen, Fanshop) braucht erst eine Genehmigung (2 bis 8 Wochen, 20 % mit Auflagen +5 bis +15 %). Danach kommt die Bauzeit, 30 % werden 1 bis 6 Wochen später fertig, 15 % kosten 5 bis 20 % mehr. Alles wird beim Start im eigenen Strom `bau` gewürfelt und gemeldet, wenn es eintritt.
  - Tribüne: Während des Baus fehlen 3.000 Plätze (CB4).
  - Fünf Anlagen in Stufen: Trainingsgelände (Entwicklung und Verletzungsrisiko), Nachwuchsleistungszentrum (Deckel des Jugendniveaus), Reha-Zentrum (Ausfallzeit), Catering und Anzeigetafel (Zuschauereinnahmen). Neue Karte „Anlagen“ im Stadion.
  - Instandhaltung 1 % der Bausumme im Jahr, monatlich gebucht.
  - Zuerst nur dein Verein, Computer-Vereine bauen nicht.
- **Geld und Welt:** ohne Ausbau unverändert (CB1). Alte Spielstände mit laufender Baustelle werden wie bisher fertig.
- **Tests zuerst:**
  - `tests/stadion.js` (neu, sechs Prüfungen)
  - `tests/code.js`
  - `tests/training.js`, `tests/medizin.js`, `tests/jugend.js` (neue Faktoren, zum Start neutral)
  - `tests/lizenz.js` (CB3)
  - `tests/seed.js` (Speichern und Laden mit neuer Baustelle)
- **Doku:** K26 §5.1, §12 Nr. 1 bis 7, K33, K36 Nr. 54, Konsistenzprüfung CB, offene Entscheidungen, Test-README.

### 21.11.2026: K25a Marketing (Zweig `mitarbeit/popolupo-k25-marketing`, auf dem K23-Zweig)

- **Neu:** `js/marketing.js`, Regeln `marketing` (`RMK`), Lizenz-Bereich `marketing` (B-Lizenz, mit Automatik).
  - Trikot je Saison (klassisch, modern, mutig) mit Reaktion der Fans aus eigenem Strom `trikot`. Ohne Wahl am Tag vor dem ersten Pflichtspiel das klassische, mit und ohne Automatik am selben Tag.
  - Vier Kampagnen (Trikot-Kampagne, Fanwerbung, Jugend-Camps, Fanarbeit) mit Kosten je Liga und abnehmendem Ertrag.
  - Werbewert, vorerst ohne Wirkung. **Für K24 (Claude):** `S.mk.ww` (0–100) steht bereit, falls Sponsorangebote davon abhängen sollen.
  - Karte „Marketing“ im Stadion, Punkt „Trikotvorstellung“ in der Liste vor dem Saisonstart.
- **Geld:** fast neutral. Fanartikel bleiben je Zuschauer, dazu Faktoren für Trikot, Lieblinge (+5 % je Liebling, höchstens +15 %) und die Trikot-Kampagne (CA1).
- **Tests zuerst:**
  - `tests/marketing.js` (neu)
  - `tests/vorbereitung.js` (erwartet jetzt 8 Punkte)
  - `tests/fans.js` (Pfiffe mit Fanarbeit)
  - `tests/lizenz.js` (CA3)
  - `tests/code.js`
- **Doku:** K25 §5.4, §12 Nr. 1 bis 6, K33, K36 Nr. 53, Konsistenzprüfung CA, offene Entscheidungen, Test-README.

### 21.11.2026: K23e Kredit, Raten, Gehaltsverzicht, Karten, dazu das Messskript für K23b (Zweig `mitarbeit/popolupo-k23-finanzen`)

- **Neu in `js/finanzen.js`:**
  - Kredit in Tranchen mit 1 bis 5 Jahren Laufzeit (Auswahl auf der Finanzseite), monatliche Tilgung, Sondertilgung, Kreditflüsse getrennt von `S.fin` (Spalte „Kredit“ im Monatsbericht).
  - Ablöse in Raten beim Kauf (Häkchen im Angebot): Hälfte sofort, Rest mit 5 % in 12 Monatsraten.
  - Gehaltsverzicht in der Not (15 %, 3 Monate, Stimmung −10).
  - Karten „Mäzen“ (Geld gegen Einfluss des Präsidenten) und „Steuerprüfung“.
- **Geändert:** `loan` (aktionen.js) und `kreditAuto` (lizenz.js) laufen über die Tranchen. `offer` prüft das Konto mit der Anzahlung. Die Gehaltsbuchung in `finanzenLiga` hat den Faktor des Verzichts. `praesidentSerie` kommt mit Mäzen auch ohne Ehrgeiz.
- **Tests zuerst:**
  - `tests/finanzen.js` (neun Prüfungen)
  - `tests/karten.js` (Katalog mit zwei Karten mehr)
  - `tests/code.js`
  - `tests/transfers.js` und `tests/vertraege.js` (Kauf mit neuer Kontoprüfung)
  - `tests/lizenz.js`
- **Bitte messen (BZ7):** `node tests/finanzmodell.js` und die Ausgabe ins Testprotokoll, gern mit 2 Saisons. Damit stelle ich K23b ein (gleiche Einnahmen für Computer-Vereine), ohne die Welt aus dem Gleichgewicht zu bringen.
- **Doku:** K23 §5.5d, §12 Nr. 10 bis 14, K30 §3.2, K33, K36 Nr. 52, Konsistenzprüfung BZ, offene Entscheidungen, Test-README.

### 21.11.2026: K23a Finanzplan (Zweig `mitarbeit/popolupo-k23-finanzen`)

- **Neu:** `js/finanzen.js`, Regeln `finanzplan` (`RFP`).
  - Monatsbericht am Monatsersten und Monatstabelle auf der Finanzseite.
  - Prognose bis Saisonende aus dem laufenden Saldo je Ligaspiel.
  - Lizenzprüfung am 1. März mit Auflagen (Vertrauen −5) und Nachweis bis 31. Mai, sonst Transfersperre für die nächste Saison (Kauf, Leihe, Altstar, Automatik der Transfers).
  - Insolvenz nach zwei Monatsersten unter dem negativen Kreditrahmen: 9 Punkte Abzug in `table`, Vertrauen −30, Schuldenschnitt.
  - Zuerst nur für deinen Verein.
- **Geld:** unverändert. Die Buchungen bleiben je Spieltag (BY1). Für einen gesunden Verein ändern sich nur Meldungen und die Finanzseite.
- **Tests zuerst:**
  - `tests/finanzen.js` (neu)
  - `tests/code.js`
  - `tests/lizenz.js` (Gleichschritt, BY4)
  - `tests/transfers.js`, `tests/leihe.js` (Kauf und Leihe haben eine neue Sperre am Anfang)
  - danach alles. Ergebnisse sollten sonst gleich bleiben.
- **Zu prüfen:** BY6. Fällt „Kontostand nachvollziehbar aus den Buchungen“ durch, bucht irgendwo Code an `money()` vorbei. Bitte die Abweichung ins Testprotokoll.
- **Doku:** K23 §5.5b, §5.5c, §12 Nr. 5 bis 9 mit Recherche, K33, K36 Nr. 51, Konsistenzprüfung BY, offene Entscheidungen, Test-README. Den veralteten Absatz „Offen seit dem 19.11.“ im Test-README habe ich durch einen Verweis auf die beiden Protokolle ersetzt.

### 21.11.2026: Kanal eingerichtet

- Diese Datei angelegt. Den Testlauf vom 20./21.11. (Läufe 1 bis 4, Funde T1.1 bis T4.1) habe ich gelesen. Die Korrekturen sind ab jetzt die Grundlage meiner Zweige.
- Bis U18b stehen alle Schritte schon im Testprotokoll. Die alten Zweige `mitarbeit/popolupo-u11-*` bis `-u18b-*` ändere ich nicht mehr.
