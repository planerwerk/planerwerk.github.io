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
| **K23g** Lizenzprüfung der Computer-Vereine, dazu Korrekturen DF | `mitarbeit/popolupo-k23g-lizenz-computer` (auf K29b) | fertig, ungetestet |
| **K25c** Dauerkarten-Aktion | `mitarbeit/popolupo-k25c-dauerkarten-aktion` (auf K23g) | fertig, ungetestet |
| **K26d** Dach, dazu Korrekturen DI | `mitarbeit/popolupo-k26d-dach` (auf K25c) | fertig, ungetestet |
| **K29c** Exklusivinterview | `mitarbeit/popolupo-k29c-exklusivinterview` (auf K26d) | fertig, ungetestet |
| **K25d** Mitglieder und Mitgliederaktion, dazu Kleinigkeiten zu K29c, Korrekturen DL | `mitarbeit/popolupo-k25d-mitglieder` (auf K29c) | fertig, ungetestet |
| **K29d** Medienklima und Beziehungen in der Pressekonferenz | `mitarbeit/popolupo-k29d-klima-fragen` (auf K25d) | fertig, ungetestet |
| **U12g** Trainervertrag als Karriere-Statistik (K28 §5.10), dazu Korrekturen DM zu K29d | `mitarbeit/popolupo-u12g-trainervertrag` (auf K29d) | fertig, ungetestet |
| **K29e** Medienprofil der Computer-Trainer, Sticheleien vor Topspielen | `mitarbeit/popolupo-k29e-trainer-medienprofil` (auf U12g) | fertig, ungetestet. **Lädt allein nicht** (Namenskonflikt aus U12g, DN1), erst die nächste Spitze |
| **U12h** Ruf wirkt (K28 §5.11), dazu Korrekturen DN zu U12g (Namenskonflikte) | `mitarbeit/popolupo-u12h-ruf-wirkt` (auf K29e) | fertig, ungetestet |
| **K34b** echte Rekorde der 2. und 3. Liga als Startwert | `mitarbeit/popolupo-k34b-rekorde` (auf U12h) | fertig, ungetestet |
| **K32c** Ex-Spieler im Stab | `mitarbeit/popolupo-k32c-exspieler-stab` (auf K34b) | fertig, ungetestet |
| **K20d** Nein des Spielers zum Höchstbietenden, dazu Korrekturen DO | `mitarbeit/popolupo-k20d-spieler-nein` (auf K32c) | fertig, ungetestet |
| **U12i** Präsidentenwahl auf der Mitgliederversammlung | `mitarbeit/popolupo-u12i-praesidentenwahl` (auf K20d) | fertig, ungetestet |
| **U12j** Jobangebot während der Saison (Karte), dazu Korrekturen DP | `mitarbeit/popolupo-u12j-jobangebot` (auf U12i) | fertig, ungetestet |
| **K29f** Interview am Spielfeldrand | `mitarbeit/popolupo-k29f-spielfeldrand` (auf U12j) | fertig, ungetestet |
| **K29g** Pressekonferenz nach dem Urteil, dazu Korrekturen DQ und DR (Pressekonferenzen nach dem Spiel) | `mitarbeit/popolupo-k29g-urteil` (auf K29f) | fertig, ungetestet |
| **U12k** Vorstand senkt das Ziel von sich aus | `mitarbeit/popolupo-u12k-vorstand-senkt` (auf K29g) | fertig, ungetestet |
| **K25e** Vorkaufsrecht der Mitglieder bei Dauerkarten | `mitarbeit/popolupo-k25e-mitglieder-dauerkarten` (auf U12k) | fertig, ungetestet |
| **K14b** Kabinen-Karten (Kabinenparty, Neuzugang, Eingewöhnung), dazu Korrekturen DS | `mitarbeit/popolupo-k14b-kabinen-karten` (auf K25e) | fertig, ungetestet |
| **K19c** Transferstatus „unverkäuflich“ | `mitarbeit/popolupo-k19c-unverkaeuflich` (auf K14b) | fertig, ungetestet |
| **K09b** Erinnerung „Gelbsperre droht“ | `mitarbeit/popolupo-k09b-gelbsperre-erinnerung` (auf K19c) | fertig, ungetestet |
| **K16b** Trainerteam mitnehmen, dazu Korrekturen DT | `mitarbeit/popolupo-k16b-team-mitnehmen` (auf K09b) | fertig, ungetestet |
| **K29h** Kritik am Urteil mit eigenen Texten | `mitarbeit/popolupo-k29h-urteil-texte` (auf K16b) | fertig, ungetestet |
| **K14c** Karte „Führungsspieler meutert“ | `mitarbeit/popolupo-k14c-meuterei` (auf K29h) | fertig, ungetestet |
| **K07b** Erinnerung „Plan passt nicht“ | `mitarbeit/popolupo-k07b-plan-erinnerung` (auf K14c) | fertig, ungetestet |
| **K34c** Europapokal in der Saisonstatistik | `mitarbeit/popolupo-k34c-europa-statistik` (auf K07b) | fertig, ungetestet |
| **K29i** Interviews der Spieler und Maulkorb, dazu Korrekturen DU | `mitarbeit/popolupo-k29i-maulkorb` (auf K34c) | fertig, ungetestet |
| **U12l** Budgetgespräch mit dem Vorstand | `mitarbeit/popolupo-u12l-budgetgespraech` (auf K29i) | fertig, ungetestet |
| **K18c** Gegnerbeobachtung | `mitarbeit/popolupo-k18c-gegnerbeobachtung` (auf U12l) | fertig, ungetestet |
| U19d2 volle Kader der Auslandsvereine in der Engine | zurückgestellt | Entwurf in K37 §5.7. Die Engine behandelt Auslandsvereine als Block wie Amateure, viele Stellen schlagen Spieler in `PIX` nach. Erst nach einem Testlauf und der Messung des Faktors 0,93 |

**Die neueste Spitze ist immer der zuletzt genannte Zweig, er enthält alles davor.** K24 ist fertig (Claude).

**Vorschlag für den nächsten Testlauf** (Spitze `mitarbeit/popolupo-k18c-gegnerbeobachtung`, alles ungetestet, aber von lesenden Prüf-Agenten durchgesehen, Konsistenzprüfung CS, CX, CZ, DD, DF, DI, DL, DM, DN). **Wichtig:** Die Zweige `u12g` und `k29e` laden für sich allein nicht (DN1), bitte die Spitze nehmen:
1. `node tests/code.js`, dann die schnellen Einzeltests der neuen Teile: `finanzen.js` (Nr. 11 bis 20), `geruechte.js`, `schwierigkeit.js`, `werbung.js`, `europapokal.js`, `vorstand.js` (Nr. 10 bis 19), `karriereende.js`, `stadion.js` (Nr. 8 bis 11), `karten.js`, `spielwelt-karten.js`, `fans.js` (K27b), `abwerben.js` (K20b), `transfers.js` (K20c, K20d, K19c), `presse.js` (K29b bis K29i), `marketing.js` (K25c, K25d).
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

### 22.11.2026: Korrekturen nach Prüfung DV zu K29h, K14c, K07b, K34c und K29i (Zweig `mitarbeit/popolupo-k18c-gegnerbeobachtung`)

- Ein lesender Prüf-Agent hat die fünf Schritte und die Korrekturen DU durchgesehen (Konsistenzprüfung DV). Er fand keinen blockierenden Fehler.
- **Behoben:**
  - DV1: „Plan passt nicht“ kommt nicht mehr unter der Automatik der Vorlage und höchstens einmal je Woche.
  - DV2, DV3: Der Maulkorb endet beim Jobwechsel. Der Medien-Kasten nennt die Automatik.
  - DV4, DV5, DV7: Kleinigkeiten.
- **Offen:** DV6, `kontoAnteil` wird an einer alten Stelle anders gelesen.

### 22.11.2026: K18c Gegnerbeobachtung (Zweig `mitarbeit/popolupo-k18c-gegnerbeobachtung`, auf U12l)

- **Neu (K18 §4, K07 §5):** Im Fenster vor dem Spiel schickst du einen Scout deines Stabs zum nächsten Gegner. Das kostet einmal 3.000 € Reisekosten.
  - Bis zu diesem Spiel verdoppelt sich der Bonus der Spielvorbereitung (+2 % statt +1 %), wie mit einem Videoanalysten. Beides zusammen verdoppelt nicht zweimal.
  - Die Automatik beobachtet keine Gegner.
- **Tests zuerst:** `tests/scouting.js` (neuer Fall K18c), dann ein Spiel mit Spielvorbereitung (die Engine liest `gegnerBeobachtet`).

### 22.11.2026: U12l Budgetgespräch (Zweig `mitarbeit/popolupo-u12l-budgetgespraech`, auf K29i)

- **Neu (K28, K15 §12 Nr. 20):** Einmal je Saison kannst du im Büro mehr Transferbudget beantragen.
  - Die Zusage hängt an Vertrauen, Ruf und der Sparsamkeit des Präsidenten. Bei wenig Glaubwürdigkeit ist sie halb so wahrscheinlich.
  - Zugesagt: +20 % Transferbudget bis Saisonende.
  - Abgelehnt: Vertrauen −3.
- **Tests zuerst:** `tests/vorstand.js` Nr. 19.

### 22.11.2026: Korrekturen nach Prüfung DU zu K19c, K09b und K16b (Zweig `mitarbeit/popolupo-k29i-maulkorb`)

- Ein lesender Prüf-Agent hat K19c, K09b und K16b durchgesehen (Konsistenzprüfung DU). Er fand keinen blockierenden Fehler, aber fünf echte Befunde.
- **Behoben:**
  - DU1, DU2: Unverkäufliche Spieler. Angebote kommen wirklich zum Höchstpreis, die Verhandlung geht nicht darunter.
  - DU3 bis DU5: Trainerteam mitnehmen. Mitgebrachte verdrängen sich nicht gegenseitig, die 30 Wochen zählen ab deinem Antritt, beim Jobangebot per Karte kommen die Co-Trainer mit.
  - DU6: Kleinigkeiten.
- **Tests zuerst:** `tests/transfers.js` (K19c erweitert), `tests/stab.js` (K16b), `tests/erinnerungen.js`.

### 22.11.2026: K29i Interviews der Spieler und Maulkorb (Zweig `mitarbeit/popolupo-k29i-maulkorb`, auf K34c)

- **Neu (K29 §6):** Montags gibt mit 30 % einer deiner Spieler ein Interview. Mitteilsame (Diva, Partylöwe, Hitzkopf) sind öfter dran und treten öfter ins Fettnäpfchen. Maulkorb im Medien-Kasten: keine Interviews, Mitteilsame verlieren jede Woche Stimmung. In der Automatik passiert nichts.
- **Tests zuerst:** `tests/presse.js` (neuer Fall K29i).

### 22.11.2026: K34c Europapokal in der Saisonstatistik (Zweig `mitarbeit/popolupo-k34c-europa-statistik`, auf K07b)

- **Neu (K37 „Noch nicht“):** In der Saisonstatistik steht eine Karte mit den deutschen Torjägern im Europapokal (bis zu 10).
- **Tests zuerst:** `tests/statistik.js` (neuer Fall K34c).

### 22.11.2026: K07b Erinnerung „Plan passt nicht“ (Zweig `mitarbeit/popolupo-k07b-plan-erinnerung`, auf K14c)

- **Neu (K07 §5 Nr. 4):** Vor „Tag beenden“ erinnert das Spiel in zwei Fällen. Im Menü ist das abschaltbar.
  - Du hast selbst die Standardwoche gewählt, obwohl eine englische Woche ansteht.
  - Mindestens drei Spieler der Startelf haben einen Belastungssprung über 1,5.
- **Tests zuerst:** `tests/erinnerungen.js` (neuer Fall K07b).

### 22.11.2026: K14c Karte „Führungsspieler meutert“ (Zweig `mitarbeit/popolupo-k14c-meuterei`, auf K29h)

- **Neu (K14 §8):** Ein Führungsspieler mit Stimmung unter 25 stellt dich vor der Mannschaft in Frage.
  - Unter vier Augen sprechen: er +6, alle −2. Das ist die Voreinstellung.
  - Durchgreifen: er −5, Glaubwürdigkeit +3, alle −3, Zusammenhalt −2.
- **Tests zuerst:** `tests/karten.js` (Katalog Nr. 1, neuer Fall K14c).

### 22.11.2026: K29h Kritik am Urteil mit eigenen Texten (Zweig `mitarbeit/popolupo-k29h-urteil-texte`, auf K16b)

- **Neu (Prüfung DR5):** In der Pressekonferenz nach dem Urteil heißt die Schiedsrichterkritik „Kritik am Urteil“. Sie hat eigene Antworttexte, eine eigene Schlagzeile und eine eigene Meldung zur Geldstrafe. Die Wirkung bleibt gleich.
- **Tests zuerst:** `tests/presse.js` (neuer Fall K29h).

### 22.11.2026: Korrekturen nach Prüfung DT zu U12k, K25e und K14b (Zweig `mitarbeit/popolupo-k16b-team-mitnehmen`)

- Ein lesender Prüf-Agent hat U12k, K25e und K14b durchgesehen (Konsistenzprüfung DT). Er fand keinen blockierenden Fehler.
- **Behoben:**
  - DT1: Eingewöhnung nur nach einer Ankunft aus dem Ausland.
  - DT2: Die starken Antworten bei Kabinenparty und Neuzugang haben jetzt einen Preis.
  - DT3: Nach Hochpokern senkt der Präsident nicht von sich aus.
  - DT4 und DT5: Neuzugang nur einsatzfähig und ab 14 Tagen, Party nur bis 7 Tage nach dem Spiel.
  - DT6: Kleinigkeiten.
- **Tests zuerst:** `tests/karten.js` (K14b angepasst), `tests/vorstand.js` Nr. 18.

### 22.11.2026: K16b Trainerteam mitnehmen (Zweig `mitarbeit/popolupo-k16b-team-mitnehmen`, auf K09b)

- **Neu (K16 §5, §12 Nr. 4):** Im Fenster der Jobangebote wählst du bis zu zwei Mitarbeiter, die mindestens 30 Wochen bei dir waren. Sie kommen mit zum neuen Verein.
  - Sie bekommen das Gehalt der neuen Liga.
  - Ist ihre Rolle dort voll, geht dort der Schwächste.
- **Tests zuerst:** `tests/stab.js` (neuer Fall K16b).

### 22.11.2026: K09b Erinnerung „Gelbsperre droht“ (Zweig `mitarbeit/popolupo-k09b-gelbsperre-erinnerung`, auf K19c)

- **Neu (K09 §12 Nr. 14):** Am Ligaspieltag erinnert „Tag beenden“ an Spieler der Startelf, die mit der nächsten Gelben Karte im folgenden Derby oder Spitzenspiel fehlen würden. Im Menü abschaltbar.
- **Tests zuerst:** neue Datei `tests/erinnerungen.js`.

### 22.11.2026: K19c Transferstatus „unverkäuflich“ (Zweig `mitarbeit/popolupo-k19c-unverkaeuflich`, auf K14b)

- **Neu (K19 §5):**
  - Die drei stärksten Spieler eines Computer-Vereins mit mindestens zwei Jahren Vertrag kosten dich den Höchstpreis (1,8 × Marktwert). Das Spielerfenster sagt es.
  - Das gilt nur für deine Käufe, nicht unter Computer-Vereinen, so bleibt der Gleichschritt gleich.
  - Deine eigenen Spieler markierst du im Spielerfenster als unverkäuflich. Dann kommen Überraschungsangebote nur zum Höchstpreis, die Transferliste hebt die Markierung auf.
- **Tests zuerst:** `tests/transfers.js` (neuer Fall K19c), dann `transfers.js` ganz und `welt.js` (deine Käufe von Schlüsselspielern werden teurer).

### 22.11.2026: Korrekturen nach Prüfung DS zur Korrektur DR (Zweig `mitarbeit/popolupo-k14b-kabinen-karten`)

- Ein lesender Prüf-Agent hat die Wege nach dem Abpfiff verfolgt (Konsistenzprüfung DS). Die Korrektur DR trägt.
- **Behoben:**
  - DS1: Die vorgemerkte Pressekonferenz zum Urteil kommt nur, solange er dein Spieler ist und die Sperre läuft.
  - DS2: Keine Pressekonferenz über das Saisonende hinaus.
  - DS3: Kein altes Interview nach einem Jobwechsel.
  - DS4: Abstand ab dem Tag der Pressekonferenz.
  - DS5: Test Nr. 7 prüft den Tag danach.
- **Tests zuerst:** `tests/presse.js` (Nr. 7, K29g), dann `fuzz-karrieren.js` und `ui-zwei-saisons.js` (ein paar Halte mehr).

### 22.11.2026: K14b Kabinen-Karten (Zweig `mitarbeit/popolupo-k14b-kabinen-karten`, auf K25e)

- **Neu (K14 §8):** drei Ereigniskarten, alle mit Wirkungen, die es schon gibt.
  - Kabinenparty nach einem Kantersieg: feiern (Zusammenhalt +3, alle +1) oder Essen im Teamhotel (Zusammenhalt +1, Geld).
  - Neuzugang drängt auf Einsatz: Er war höchstens 60 Tage da und hat kaum gespielt. Chance (Stimmung +5) oder gedulden (−3).
  - Eingewöhnung eines Spielers aus dem Ausland: Hilfe (Geld, Stimmung +4, Voreinstellung) oder allein (−3).
- **Tests zuerst:** `tests/karten.js` (Katalog Nr. 1 mit den neuen Karten, neuer Fall K14b).

### 22.11.2026: K25e Vorkaufsrecht der Mitglieder bei Dauerkarten (Zweig `mitarbeit/popolupo-k25e-mitglieder-dauerkarten`, auf U12k)

- **Neu (K25 §5.5):** Der Anteil der Dauerkarten steigt mit den Mitgliedern je Platz, höchstens um 10 Prozentpunkte. Die Anzeige vor dem Verkauf nennt den Anteil.
- **Tests zuerst:** `tests/fans.js` (K27b angepasst, neuer Fall K25e).

### 22.11.2026: U12k Vorstand senkt das Ziel von sich aus (Zweig `mitarbeit/popolupo-u12k-vorstand-senkt`, auf K29g)

- **Neu (K28 §5.9):** Liegst du bei der Zwischenbilanz mindestens 6 Plätze hinter dem Ziel und ist der Präsident geduldig, senkt der Vorstand das Ziel um einen Platz. Das geschieht ohne Antrag und ohne Abzug beim Budget. Sonst bleibt es beim Antrag wie bisher.
- **Tests zuerst:** `tests/vorstand.js` Nr. 18, dazu Nr. 14 (unverändert, 4 Plätze Rückstand).

### 22.11.2026: Korrekturen nach Prüfung DR zu K29f und K29g, dazu ein alter Fehler aus U17a (Zweig `mitarbeit/popolupo-k29g-urteil`)

- Ein lesender Prüf-Agent hat K29f und K29g durchgesehen (Konsistenzprüfung DR).
- **Wichtig, seit U17a:** Pressekonferenzen nach dem Spiel (Kantersieg, Krise, Höhenflug, Führung) hast du nie gesehen. Nach dem Abpfiff springt das Spiel zum nächsten Tag, dort hat der Co-Trainer sie sofort übernommen (je −2 Medienklima). Jetzt finden sie am Tag nach dem Spiel statt, mit Halt.
- **Behoben:**
  - DR1: Das Interview am Spielfeldrand gilt bis zum nächsten Halt (vorher nie sichtbar).
  - DR2: Die Pressekonferenz zum Urteil wird vorgemerkt und verdrängt keine Pressekonferenz vor einem Spiel mehr.
  - DR3: Fragen nach Pokalspielen, Elfmeterschießen zählt.
  - DR4: Keine Pressekonferenz nach einer schon abgesessenen Sperre.
- **Tests zuerst:** `tests/presse.js` (K29f, K29g, dazu Nr. 7 Krise), dann `ui-zwei-saisons.js`. Neu: Halt „Pressekonferenz“ am Tag nach einem Spiel mit Krise, Kantersieg, Serie oder Tabellenführung, wenn die Presse nicht in der Automatik ist.

### 22.11.2026: Korrekturen nach Prüfung DQ zu U12i und U12j (Zweig `mitarbeit/popolupo-k29g-urteil`)

- Ein lesender Prüf-Agent hat U12i und U12j durchgesehen (Konsistenzprüfung DQ). Er fand keinen blockierenden Fehler.
- **Behoben:**
  - DQ1: Das Jobangebot hat jetzt eine wirksame Grenze für große Vereine (Mitte der Jobangebote + 10).
  - DQ2: Höchstens ein Jobangebot je Jahr über alle Vereine.
  - DQ3: Offene Karten entscheidet der Co-Trainer bei jedem Jobwechsel noch für den alten Verein.
  - DQ6: Die Präsidentenwahl zählt auch Auf- und Abstieg über die Relegation.
  - DQ7: Schutz für den Fall einer Wahl während der Entlassung.
- **Tests zuerst:** `tests/karten.js` (U12j erweitert), `tests/vorstand.js` Nr. 17, dann alle Tests mit Jobwechsel (`vorstand.js`, `ui-zwei-saisons.js`, `fuzz-karrieren.js`).

### 22.11.2026: K29g Pressekonferenz nach dem Urteil (Zweig `mitarbeit/popolupo-k29g-urteil`, auf K29f)

- **Neu (K29 §4.1):** Sperrt das Sportgericht einen deiner Spieler für mindestens 3 Spiele, kommt eine Pressekonferenz „nach dem Urteil“ mit fünf eigenen Fragen. Kritik am Urteil wirkt wie Schiedsrichterkritik.
- **Tests zuerst:** `tests/presse.js` (neuer Fall K29g, Katalog Nr. 1 mit dem neuen Anlass), dann `disziplin.js`.

### 22.11.2026: K29f Interview am Spielfeldrand (Zweig `mitarbeit/popolupo-k29f-spielfeldrand`, auf U12j)

- **Neu (K29 §4.1):** Nach jedem deiner Spiele steht im Büro eine kleine Karte mit einer Frage und drei Antworten.
  - Halbe Wirkung einer Pressekonferenz, ohne Zufall, ohne Halt.
  - Gilt nur am Spieltag, ohne Antwort passiert nichts.
  - Abschaltbar, nicht neben einer offenen Pressekonferenz und nicht in der Automatik.
- **Tests zuerst:** `tests/presse.js` (neuer Fall K29f), dann `ui-zwei-saisons.js` (neue Karte im Büro).

### 22.11.2026: Korrekturen nach Prüfung DP zu K34b, K32c und K20d (Zweig `mitarbeit/popolupo-u12j-jobangebot`)

- Ein lesender Prüf-Agent hat K34b, K32c und K20d durchgesehen (Konsistenzprüfung DP). Er fand keinen Fehler, aber einen mittleren Befund.
- **Behoben:**
  - DP1 und DP2: Nach dem Nein des Spielers oder wenn der andere Verein ausfällt, steht deine Einigung 14 Tage fest.
  - DP3: Hinweis unter den Rekorden der 2. und 3. Liga.
  - DP4: Eine neue Serie ohne Niederlage wird gemeldet, auch wenn derselbe Verein den alten Rekord hielt.
  - DP5: Ex-Spieler ohne Job gehen nach fünf Saisons.
  - DP6: Kleinigkeiten bei K20d.
- **Tests zuerst:** `tests/transfers.js` (K20c, K20d), `tests/statistik.js`, `tests/stab.js`.

### 22.11.2026: U12j Jobangebot während der Saison (Zweig `mitarbeit/popolupo-u12j-jobangebot`, auf U12i)

- **Neu (K28 §8, §5.13):** eine Ereigniskarte ab Ruf 55.
  - Ein Verein mit mindestens 8 mehr Ansehen will dich sofort.
  - Wechseln: Er übernimmt dich, dein alter Verein bekommt ein Jahresgehalt als Ablöse.
  - Bleiben und öffentlich sagen: Vertrauen +5, Fans +2. Das ist auch die Voreinstellung, der Co-Trainer wechselt nie.
  - Anhören und absagen: Ruf +1, mit 50 % wird es publik (Vertrauen −8).
  - Neue Wirkung `jobwechsel`.
- **Tests zuerst:** `tests/karten.js` (Katalog Nr. 1 mit der neuen Karte, neuer Fall U12j).

### 22.11.2026: U12i Präsidentenwahl (Zweig `mitarbeit/popolupo-u12i-praesidentenwahl`, auf K20d)

- **Neu (K28 §8, §5.12, K25 §5.5):** Mitgliederversammlung im Sommer, bei jedem Verein alle 3 oder 4 Jahre (fester Takt je Verein).
  - Der Präsident bleibt mit 65 %, mehr nach einer guten Saison, einem Aufstieg und bei guter Fanstimmung.
  - Ein neuer Präsident bringt neue Werte für Geduld, Ehrgeiz und Sparsamkeit.
  - Bei dir rückt das Vertrauen zur Hälfte Richtung 50. Im Büro steht, wann dein Verein wieder wählt.
- **Tests zuerst:** `tests/vorstand.js` Nr. 17, dann `welt.js` über mehrere Saisons. Die Trainerwechsel der Computer-Vereine hängen an der Geduld, ihre Zahl kann sich verschieben.

### 22.11.2026: Korrekturen nach Prüfung DO zu K29e und U12h (Zweig `mitarbeit/popolupo-k20d-spieler-nein`)

- Ein lesender Prüf-Agent hat K29e und U12h durchgesehen (Konsistenzprüfung DO). Er fand keinen blockierenden Fehler.
- **Behoben:**
  - DO1: Die Strafe für eine offene Stichelei trifft nur, wenn sie nicht beantwortet ist, nicht nach einer Entlassung und nur in derselben Saison.
  - DO2: `tests/lizenz.js` 5a setzt nach einer Entlassung auch den Ruf zurück.
  - DO3: `tests/vorstand.js` Nr. 16 prüft mit Ruf +20.
- **Tests zuerst:** `tests/presse.js` (K29e), `tests/vorstand.js` Nr. 16, `tests/lizenz.js`.

### 22.11.2026: K20d Nein des Spielers zum Höchstbietenden (Zweig `mitarbeit/popolupo-k20d-spieler-nein`, auf K32c)

- **Neu (K20 §4.2):** Gehst du beim Bieterwettstreit (K20c) nicht mit, lehnt ein Spieler, der unbedingt zu dir will, den anderen Verein ab.
  - Chance ab Interesse 20: 25 % plus 1 % je Punkt, höchstens 60 %. Halb so groß, wenn der andere Verein mehr Ansehen hat.
  - Dann nimmt der Verkäufer deine Ablöse, die Forderung sinkt auf dein Gebot.
- **Tests zuerst:** `tests/transfers.js` (neuer Fall K20d, K20c unverändert).

### 22.11.2026: K32c Ex-Spieler im Stab (Zweig `mitarbeit/popolupo-k32c-exspieler-stab`, auf K34b)

- **Neu (K32 §3.3b, K16 §10):** Wer mit mindestens 100 Ligaspielen aufhört, kommt mit 25 % als vereinsloser Mitarbeiter in den Stab-Markt.
  - Torhüter werden Torwarttrainer, Feldspieler Co-, Jugend- oder Standardtrainer.
  - Die Qualität richtet sich nach den Ligaspielen.
  - Wer gerade Trainer im Pool geworden ist, kommt nicht dazu.
  - Hat er für deinen Verein gespielt, kommt eine Meldung. In der Liste steht „Ex-Spieler, N Ligaspiele“.
- **Tests zuerst:** `tests/stab.js` (neuer Fall K32c), dann `welt.js` über mehrere Saisons. Ziel nach K16 §10: 5 bis 15 neue Ex-Spieler je Saison in der Welt. Bitte die Zahl ins Testprotokoll, wenn sie stark abweicht.

### 22.11.2026: K34b Rekorde der 2. und 3. Liga (Zweig `mitarbeit/popolupo-k34b-rekorde`, auf U12h)

- **Neu (K34 §5.6):** Die 2. und 3. Liga starten mit echten Rekorden, recherchiert bei bundesliga.com und dfb.de.
  - 2. Liga: 11:0, 41 Tore, 28 Spiele ohne Niederlage.
  - 3. Liga: 7:0, 28 Tore, 21 Spiele ohne Niederlage.
  - Beide Ligen melden Rekorde der eigenen Liga jetzt ab der ersten Saison.
  - Alte Spielstände bekommen die Startwerte nachträglich, ein besserer Rekord aus dem Spiel bleibt.
  - Ein Startwert mit Auswärtssieg (0:7) zählt mit dem Betrag des Abstands.
- **Tests zuerst:** `tests/statistik.js` Nr. 1 (geändert: vorher „2. Liga leer“).

### 22.11.2026: U12h Ruf wirkt, dazu Korrekturen DN zu U12g (Zweig `mitarbeit/popolupo-u12h-ruf-wirkt`, auf K29e)

- **Korrekturen DN (wichtig):** U12g hatte drei Namen, die es für Spieler schon gab: `abfindung`, `vertragEnde` und `vertragText`.
  - Der erste Name brach das Laden (SyntaxError). Die anderen beiden hätten still die Spielerfassung ersetzt.
  - Jetzt heißen sie `trainerAbfindung`, `trainerVertragEnde` und `trainerVertragText`.
  - Dazu: Die Anzeige liest nur, der Vertrag kommt beim Laden. Der Jobwechsel in `tests/sim.js` läuft wie `takeJob`, „verdient“ enthält die laufende Saison.
  - Neue Prüfung vor jedem Commit: `dubletten.pl` für doppelte Namen.
- **Neu U12h (K28 §5.11):** Dein Ruf als Trainer wirkt auf das Interesse von Spielern, auf das Ruf-Gefälle in der Kabine (statt der Trainerjahre) und auf die Glaubwürdigkeit beim neuen Verein.
- **Tests zuerst:** `tests/vorstand.js` Nr. 15 und 16, dann alle Tests, die über `tests/sim.js` laufen (der Jobwechsel ist neu).
- **Zu erwarten:** Der Gleichschritt bleibt gleich, denn in 150 Tagen bleibt der Ruf beim Start. `tests/kabine.js` (Ruf-Gefälle): In der ersten Saison gilt derselbe Wert, später hängt er am Erfolg statt an den Jahren.

### 22.11.2026: K29e Medienprofil der Computer-Trainer und Sticheleien (Zweig `mitarbeit/popolupo-k29e-trainer-medienprofil`, auf U12g)

- **Neu (K29 §7, Umsetzung K29e):**
  - Jeder Computer-Trainer hat ein festes Medienprofil aus seiner Nummer.
  - Lautsprecher und Psychospieler sticheln vor Topspielen. Die Stichelei kommt als Meldung und als erste Frage der Pressekonferenz.
  - Deine Antwort wirkt auf beide Mannschaften: Kontern hebt beide, gelassen die eigene. Ignorieren schadet beim Psychospieler, eine unbeantwortete Stichelei schadet immer.
  - In der Automatik ohne Wirkung.
- **Tests zuerst:** `tests/presse.js`. Neuer Fall K29e. Die Fälle 2 und K29d zählen die Fragen ohne die Stichelei.
- **Zu erwarten:** Der Gleichschritt bleibt gleich, weil die Automatik die Stichelei ohne Wirkung lässt.

### 22.11.2026: Korrekturen nach Prüfung DM zu K29d (Zweig `mitarbeit/popolupo-u12g-trainervertrag`)

- Ein lesender Prüf-Agent hat K29d durchgesehen (Konsistenzprüfung DM). Er fand keinen blockierenden Fehler.
- **Behoben:**
  - DM1: Auch der Ausraster wirkt über das fragende Medium.
  - DM2: Der Faktor je Frage steht vor den Antworten fest.
  - DM3: Das Exklusivinterview rundet.
  - DM4: Die zusätzliche Frage steht in den Regeln.
  - DM5: Doku.
- **Tests zuerst:** `tests/presse.js` (K29c, K29d).

### 22.11.2026: U12g Trainervertrag (Zweig `mitarbeit/popolupo-u12g-trainervertrag`, auf K29d)

- **Neu (K28 §5.10, nur Statistik, es fließt kein Geld):**
  - Gehalt je Saison nach Liga, Ansehen und Ruf.
  - Laufzeit nach der Geduld des Präsidenten.
  - Verlängerung zum Saisonende: über Vertrauen 55 zwei Saisons mit neuem Gehalt, sonst eine zum alten.
  - Ligaklausel zum 1. Juli.
  - Abfindung bei Entlassung (Restgehalt × 0,5).
  - Gehalt und Verdienst je Station und Saison in der Karriere, Anzeige im Büro und in den Jobangeboten.
- **Tests zuerst:** `tests/vorstand.js` Nr. 15, dann `statistik.js` und `ui-zwei-saisons.js` (Karriere-Ansicht mit zwei neuen Spalten).
- **Zu erwarten:** Der Gleichschritt bleibt gleich (kein Zufall, kein Geld).

### 22.11.2026: K29d Medienklima und Beziehungen in der Pressekonferenz (Zweig `mitarbeit/popolupo-k29d-klima-fragen`, auf K25d)

- **Neu (K29 §5, Umsetzung K29d):**
  - Journalisten nach Medienklima: Bei schlechtem Klima fragen öfter Boulevard und Portal. Bei Klima 50 bleibt die Wahl wie vorher.
  - Unter Klima 35 eine Frage mehr.
  - Die Wirkung auf Fans und Vorstand läuft über die Beziehung zum fragenden Medium. Jede Antwort ändert diese Beziehung um ihre halbe Wirkung aufs Klima.
  - Beziehungen verblassen montags um 0,5 Richtung 0.
- **Tests zuerst:** `tests/presse.js` (neuer Fall K29d, dazu die alten Fälle 4, 5 und 6, die Journalisten fest setzen).
- **Zu erwarten:** Der Gleichschritt bleibt gleich, weil in der Automatik der Co-Trainer geht und die Wahl der Journalisten nur im Strom `presse` würfelt.

### 22.11.2026: Korrekturen nach Prüfung DL (Zweig `mitarbeit/popolupo-k25d-mitglieder`)

- Ein lesender Prüf-Agent hat K25d durchgesehen (Konsistenzprüfung DL).
- **Behoben:** Mitglieder alter Spielstände aus den Stammdaten (DL1), Mitglieder folgen dem Wachstum der Fans ohne deren Grenzen (DL2), Mitgliederaktion einmal je Saison (DL3), zwei Zahlen in der Doku (DL4).
- **Tests zuerst:** `tests/finanzen.js` Nr. 20.

### 22.11.2026: K25d Mitglieder, dazu Prüfung von K29c (Zweig `mitarbeit/popolupo-k25d-mitglieder`, auf K29c)

- **Neu (K25 §5.5, Konsistenzprüfung DK):** echte Mitgliederzahlen der 56 Vereine in `daten/vereine.js`, Beiträge (60 € je Jahr) in den sonstigen Einnahmen aller Vereine, Grundbetrag je Liga gesenkt (Schnitt gleich), Mitglieder folgen den Fans, Kampagne „Mitgliederaktion“ (+2 %).
- **Prüfung K29c:** ohne Fehler, drei Kleinigkeiten behoben (DK1).
- **Tests zuerst:** `tests/finanzen.js` (Nr. 11 angepasst, neu Nr. 20), `tests/geruechte.js` (neu K29c), `tests/finanzmodell.js` (Salden je Verein verschieben sich, DK3).

### 22.11.2026: K29c Exklusivinterview (Zweig `mitarbeit/popolupo-k29c-exklusivinterview`, auf K26d)

- **Neu (K29 §6, Konsistenzprüfung DJ):** Beziehung zu den fünf Medien, Exklusivinterview alle 28 Tage im Medien-Kasten (Bereich `presse`). Gerüchte über dich wirken nach der Beziehung des Mediums milder oder schärfer.
- **Tests zuerst:** `tests/presse.js` (neu K29c), `tests/geruechte.js`.

### 22.11.2026: Korrekturen nach Prüfung DI (Zweig `mitarbeit/popolupo-k26d-dach`)

- Ein lesender Prüf-Agent hat K25c und K26d durchgesehen (Konsistenzprüfung DI).
- **Behoben:** Dach mit deinem Ticketpreis (DI1), Kommentar und Parameter von `dachFaktor` (DI2), Preisvorschau der 3. Liga mit dem richtigen Ligafaktor (DI3, älterer Fehler).
- **Tests zuerst:** `tests/stadion.js` (Nr. 11), `tests/fans.js` und `tests/ui-zwei-saisons.js` (Preisvorschau).

### 22.11.2026: K26d Dach (Zweig `mitarbeit/popolupo-k26d-dach`, auf K25c)

- **Neu (K26 §3.1, §5.3, Konsistenzprüfung DH):** Dach als Anlage (15 Mio. €, 20 Wochen). Heimvorteil × 1,005, wenn das Heimspiel voraussichtlich voll ist (Engine `side`, `dachFaktor`).
- **Tests zuerst:** `tests/stadion.js` (neu Nr. 11), `tests/live.js` und `tests/taktik.js` (Engine unverändert ohne Dach).

### 22.11.2026: K25c Dauerkarten-Aktion (Zweig `mitarbeit/popolupo-k25c-dauerkarten-aktion`, auf K23g)

- **Neu (K25, Konsistenzprüfung DG):** Kampagne „Dauerkarten-Aktion“ in der Vorbereitung, solange die Dauerkarten (K27b) noch nicht verkauft sind: Anteil der Dauerkarten +5 Prozentpunkte.
- **Tests zuerst:** `tests/marketing.js` (neu K25c), `tests/fans.js` (K27b unverändert).
- **Außerdem:** neues Prüfskript `testnamen.pl` (außerhalb des Repos) für die Tests, über alle Tests ohne Fund.

### 22.11.2026: Korrekturen nach Prüfung DF (Zweig `mitarbeit/popolupo-k23g-lizenz-computer`)

- Ein lesender Prüf-Agent hat K29b und K23g durchgesehen (Konsistenzprüfung DF).
- **Behoben:** Medienklima kehrt mit „zurückhaltend“ zur Mitte zurück (DF1), Sperre ab dem 31. Mai und Rückzug alter Angebote (DF2), keine Ausstiegsklausel und keine Leihe an gesperrte Vereine (DF3).
- **Tests zuerst:** `tests/presse.js` (K29b), `tests/finanzen.js` (Nr. 19), `tests/leihe.js`, `tests/vertraege.js`.

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
