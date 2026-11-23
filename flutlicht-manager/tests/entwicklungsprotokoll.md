# Entwicklungsprotokoll (popolupo)

Gegenstück zu `tests/testprotokoll.md`. Asynchroner Kanal von der Entwicklung auf den Zweigen `mitarbeit/popolupo-*` zu Claude (Zweige `claude/*`). Seit dem 21.11.

**So funktioniert es**
- **Diese Datei schreibt nur popolupo**, das Testprotokoll nur Claude. So gibt es beim Zusammenführen keine Konflikte.
- **Ganz oben steht „Jetzt in Arbeit“**: was popolupo gerade baut. Bitte dort nicht parallel bauen. Umgekehrt gilt, was im Testprotokoll als begonnen steht (zurzeit K24).
- **Darunter das Changelog**, der neueste Schritt oben: Zweig, Commit, was neu ist, welche Tests zuerst laufen sollen und was zu erwarten ist. Ausführlich steht es in der Konsistenzprüfung und im Konzept.
- **Antworten zu Funden** stehen mit der Nummer aus dem Testprotokoll (zum Beispiel „T3.2“), dazu im Commit „behebt T3.2“ oder „zu T3.2“.
- **Neue Zweige beginnen auf dem Stand von `claude/compassionate-galileo-bsbua4`**, damit die Korrekturen aus den Testläufen drin sind. Jeder Schritt bekommt einen eigenen Zweig, der auf dem vorigen aufbaut. Getestet werden kann immer die neueste Spitze.
- **popolupo kann keine Tests laufen lassen** (kein Node.js auf dem Rechner). Vor jedem Commit laufen nur Perl-Prüfungen: Klammern, `tests/code.js` als Nachbau (`codewaechter.pl`), doppelte Namen (`dubletten.pl`), Platzhalter in einfachen Anführungszeichen, Namen und Aufrufe ohne Deklaration, Regelpfade, Testnamen und seit dem Abend des 22.11. der Kartenkatalog (`kartenpruefung.pl`, wie `tests/karten.js` Fall 1). Alles andere ist ungetestet und steht so im Changelog.

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
| **K18c** Gegnerbeobachtung, dazu Korrekturen DV | `mitarbeit/popolupo-k18c-gegnerbeobachtung` (auf U12l) | fertig, ungetestet |
| **K11b** Sommerturnier | `mitarbeit/popolupo-k11b-sommerturnier` (auf K18c) | fertig, ungetestet |
| **K11c** Testspiel-Anfragen der Computer-Vereine | `mitarbeit/popolupo-k11c-testspiel-anfragen` (auf K11b) | fertig, ungetestet |
| **U19e** Europapokal-Karten, dazu **K31b** Bedarf anderer Vereine und Korrekturen DW | `mitarbeit/popolupo-u19e-europa-karten` (auf K11c) | fertig, ungetestet |
| **K34d** Rekordtransfer mit echtem Startwert, dazu **K31c** „Konkurrent rüstet auf“ | `mitarbeit/popolupo-k34d-rekordtransfer` (auf U19e) | fertig, ungetestet |
| **K30b** Meldungsdichte | `mitarbeit/popolupo-k30b-meldungsdichte` (auf K34d) | fertig, ungetestet |
| **K36c** Meldungen des Stabs gesammelt, dazu Korrekturen DX | `mitarbeit/popolupo-k36c-stabbericht` (auf K30b) | fertig, ungetestet |
| **K11d** Erinnerung „spielfreie Woche ohne Testspiel“ | `mitarbeit/popolupo-k11d-spielfrei-erinnerung` (auf K36c) | fertig, ungetestet |
| **K10b** Fehldiagnose | `mitarbeit/popolupo-k10b-fehldiagnose` (auf K11d) | fertig, ungetestet |
| **K10c** Zweite Meinung | `mitarbeit/popolupo-k10c-zweite-meinung` (auf K10b) | fertig, ungetestet |
| **K10d** Ausfalltage in der Saisonbilanz, dazu Korrekturen DY | `mitarbeit/popolupo-k10d-ausfall-bilanz` (auf K10c) | fertig, ungetestet |
| **K09c** Vereinsstrafe | `mitarbeit/popolupo-k09c-vereinsstrafe` (auf K10d) | fertig, ungetestet |
| **K19d** Weiterverkaufsbeteiligung | `mitarbeit/popolupo-k19d-weiterverkauf` (auf K09c) | fertig, ungetestet |
| **K21b** Teamprämie | `mitarbeit/popolupo-k21b-teampraemie` (auf K19d) | fertig, ungetestet |
| Korrekturen DZ | `mitarbeit/popolupo-dz-korrekturen` (auf K21b) | fertig, ungetestet |
| **K07c** Trainingskarten | `mitarbeit/popolupo-k07c-trainingskarten` (auf den Korrekturen DZ) | fertig, ungetestet |
| **K20e** Computer-Vereine werben ab | `mitarbeit/popolupo-k20e-ki-abwerben` (auf K07c) | fertig, ungetestet |
| **K08b** Talent zum Probetraining | `mitarbeit/popolupo-k08b-probetraining` (auf K20e) | fertig, ungetestet |
| **K08c** Großer Verein lockt dein Talent | `mitarbeit/popolupo-k08c-talent-gelockt` (auf K08b) | fertig, ungetestet |
| Korrekturen EA | `mitarbeit/popolupo-ea-korrekturen` (auf K08c) | fertig, ungetestet |
| **K06b** „Der Gegner hat dich durchschaut“ | `mitarbeit/popolupo-k06b-durchschaut` (auf den Korrekturen EA) | fertig, ungetestet |
| **K18d** Konkurrenz am Tisch | `mitarbeit/popolupo-k18d-konkurrenz-tisch` (auf K06b) | fertig, ungetestet |
| **K18e** Scout liegt daneben | `mitarbeit/popolupo-k18e-scout-daneben` (auf K18d) | fertig, ungetestet |
| **K07d** Erinnerung „Lernplatz frei“ | `mitarbeit/popolupo-k07d-lernplatz` (auf K18e) | fertig, ungetestet |
| **K29j** Trotz Maulkorb | `mitarbeit/popolupo-k29j-maulkorb-bruch` (auf K07d) | fertig, ungetestet |
| Korrekturen EB | `mitarbeit/popolupo-eb-korrekturen` (auf K29j) | fertig, ungetestet |
| **K16c** Mitarbeiter abgeworben | `mitarbeit/popolupo-k16c-stab-abgeworben` (auf den Korrekturen EB) | fertig, ungetestet |
| **K27c** Fan-Karten | `mitarbeit/popolupo-k27c-fan-karten` (auf K16c) | fertig, ungetestet |
| **K21c** Vertragskarten | `mitarbeit/popolupo-k21c-vertragskarten` (auf K27c) | fertig, ungetestet |
| **K13b** Supercup-Prämie | `mitarbeit/popolupo-k13b-supercup-praemie` (auf K21c) | fertig, ungetestet |
| **K26e** Stadt bietet Zuschuss | `mitarbeit/popolupo-k26e-stadt-zuschuss` (auf K13b) | fertig, ungetestet |
| **K12c** Sommerkarten | `mitarbeit/popolupo-k12c-sommerkarten` (auf K26e) | fertig, ungetestet |
| Korrekturen EC | `mitarbeit/popolupo-ec-korrekturen` (auf K12c) | fertig, ungetestet |
| **K13c** Pokalmeldungen | `mitarbeit/popolupo-k13c-pokal-meldungen` (auf den Korrekturen EC) | fertig, ungetestet |
| **K29k** Presse-Karten | `mitarbeit/popolupo-k29k-presse-karten` (auf K13c) | fertig, ungetestet |
| **K17b** Hilfe in der Not | `mitarbeit/popolupo-k17b-hilfe-in-not` (auf K29k) | fertig, ungetestet |
| **K22c** Berater droht mit Wechsel | `mitarbeit/popolupo-k22c-berater-droht` (auf K17b) | fertig, ungetestet |
| **K03b** Formkarten | `mitarbeit/popolupo-k03b-formkarten` (auf dem Testvorschlag) | fertig, ungetestet |
| Korrekturen ED | `mitarbeit/popolupo-ed-korrekturen` (auf K03b) | fertig, ungetestet |
| **K30c** Ketten und „Der lachende Dritte“ | `mitarbeit/popolupo-k30c-ketten` (auf den Korrekturen ED) | fertig, ungetestet |
| Korrekturen EE | `mitarbeit/popolupo-ee-korrekturen` (auf K30c) | fertig, ungetestet |
| **K30d** Anlasskarten mit eigener Chance (K37 §12 Nr. 21, vorläufig entschieden) | `mitarbeit/popolupo-k30d-anlasskarten` (auf den Korrekturen EE) | fertig, ungetestet |
| **K10e** Medizin-Karten (Grippewelle, lange Reha) | `mitarbeit/popolupo-k10e-medizin-karten` (auf K30d) | fertig, ungetestet |
| **K17d** Klatsch und Tratsch | `mitarbeit/popolupo-k17d-klatsch` (auf K10e) | fertig, ungetestet |
| **K09d** Derby-Faktor und Brisanz | `mitarbeit/popolupo-k09d-derby-brisanz` (auf K17d) | fertig, ungetestet |
| **K07e** Rangelei im Training, **K14d** Partynacht (Folgekarte) | `mitarbeit/popolupo-k07e-rangelei-partynacht` (auf K09d) | fertig, ungetestet |
| **K14e** Grüppchenbildung | `mitarbeit/popolupo-k14e-grueppchen` (auf K07e) | fertig, ungetestet |
| Korrekturen EF | `mitarbeit/popolupo-ef-korrekturen` (auf K14e) | fertig, ungetestet |
| **K29l** Presse-Karten („Spruch geht viral“, „Der Rivale antwortet“) | `mitarbeit/popolupo-k29l-presse-karten` (auf den Korrekturen EF) | fertig, ungetestet |
| **K30e** Info-Karten mit Wirkung (Rückendeckung, Dorfverein, Blamage) | `mitarbeit/popolupo-k30e-info-wirkung` (auf K29l) | fertig, ungetestet |
| **K11f** Turniersieg | `mitarbeit/popolupo-k11f-turniersieg` (auf K30e) | fertig, ungetestet |
| **K16d** Arzt widerspricht beim Fitspritzen | `mitarbeit/popolupo-k16d-arzt-widerspricht` (auf K11f) | fertig, ungetestet |
| **K03c** Durchbruch und Altersverlust | `mitarbeit/popolupo-k03c-entwicklung` (auf K16d) | fertig, ungetestet |
| Korrekturen EG | `mitarbeit/popolupo-eg-korrekturen` (auf K03c) | fertig, ungetestet |
| **K07f** Eigene Trainingsvorlagen | `mitarbeit/popolupo-k07f-eigene-vorlagen` (auf den Korrekturen EG) | fertig, ungetestet |
| **K21d** Pokalprämie | `mitarbeit/popolupo-k21d-pokalpraemie` (auf K07f) | fertig, ungetestet |
| **K21e** Aufstiegs- und Klassenerhaltsprämie | `mitarbeit/popolupo-k21e-saisonpraemien` (auf K21d) | fertig, ungetestet |
| **K13d** Spielverlegung beantragen | `mitarbeit/popolupo-k13d-spielverlegung` (auf K21e) | fertig, ungetestet |
| Korrekturen EH | `mitarbeit/popolupo-eh-korrekturen` (auf K13d) | fertig, ungetestet |
| **K30f** Skandale (Wettpate, Wettskandal) | `mitarbeit/popolupo-k30f-skandale` (auf den Korrekturen EH) | fertig, ungetestet |
| Doku-Abgleich (K05, K08, K19, K32), später Korrekturen EI | `mitarbeit/popolupo-ei-korrekturen` (auf K30f) | Doku fertig, Prüfung EI läuft |
| **K27d** Jubiläum mit Gründungsjahren | `mitarbeit/popolupo-k27d-jubilaeum` (auf dem Doku-Abgleich) | fertig, ungetestet |
| **K25e** Tradition beim Trikot | `mitarbeit/popolupo-k25e-tradition` (auf K27d) | fertig, ungetestet |
| Korrekturen EI | `mitarbeit/popolupo-ei-korrekturen-b` (auf K25e) | fertig, ungetestet |
| **K05c** Joker sticht, Handschlag verweigert | `mitarbeit/popolupo-k05c-joker-handschlag` (auf den Korrekturen EI) | fertig, ungetestet |
| **K05d** Last-Minute-Drama | `mitarbeit/popolupo-k05d-last-minute` (auf K05c) | fertig, ungetestet |
| **K06c** Taktik-Coup, **K09e** Pyrotechnik und Rudelbildung im Derby | `mitarbeit/popolupo-k06c-k09e-coup-derby` (auf K05d) | fertig, ungetestet |
| **K06d** Spieler hadert mit seiner Position | `mitarbeit/popolupo-k06d-position-hadern` (auf K06c/K09e) | fertig, ungetestet |
| Korrekturen EK | `mitarbeit/popolupo-ek-korrekturen` (auf K06d) | fertig, ungetestet |
| Korrekturen EJ | `mitarbeit/popolupo-ej-korrekturen` (auf den Korrekturen EK) | fertig, ungetestet |
| **K25f** Fankultur statt Gründungsjahr (Rückmeldung des Nutzers) | `mitarbeit/popolupo-k25f-fankultur` (auf den Korrekturen EJ) | fertig, ungetestet |
| Korrekturen EL | `mitarbeit/popolupo-el-korrekturen` (auf K25f) | fertig, ungetestet |
| Korrekturen EM | `mitarbeit/popolupo-em-korrekturen` (auf den Korrekturen EL) | fertig, ungetestet |
| **K27e** Fankultur bei Fans und Vorstand | `mitarbeit/popolupo-k27e-fankultur-wirkt` (auf den Korrekturen EM) | fertig, ungetestet |
| **K06e** Standard-Spezialisten | `mitarbeit/popolupo-k06e-standards` (auf K27e) | fertig, ungetestet |
| **K15e** Streit nach Kritik | `mitarbeit/popolupo-k15e-streit` (auf K06e) | fertig, ungetestet |
| **K26f** Anwohner klagen | `mitarbeit/popolupo-k26f-anwohner` (auf K15e) | fertig, ungetestet |
| Korrekturen EN | `mitarbeit/popolupo-en-korrekturen` (auf K26f) | fertig, ungetestet |
| U19d2 volle Kader der Auslandsvereine in der Engine | zurückgestellt | Entwurf in K37 §5.7. Die Engine behandelt Auslandsvereine als Block wie Amateure, viele Stellen schlagen Spieler in `PIX` nach. Erst nach einem Testlauf und der Messung des Faktors 0,93 |

**Die neueste Spitze ist immer der zuletzt genannte Zweig, er enthält alles davor.** K24 ist fertig (Claude).

**Vorschlag für den nächsten Testlauf** (Spitze `mitarbeit/popolupo-en-korrekturen`, alles ungetestet, bis auf K06e, K15e, K26f und die Korrekturen EN von lesenden Prüf-Agenten durchgesehen, Konsistenzprüfung CS bis EN). **Wichtig:** Die Zweige `u12g` und `k29e` laden für sich allein nicht (DN1), bitte die Spitze nehmen:
1. `node tests/code.js`, dann die schnellen Einzeltests der neuen Teile: `finanzen.js` (Nr. 11 bis 20), `geruechte.js` (seit K17d mit Klatsch), `schwierigkeit.js`, `werbung.js`, `europapokal.js`, `vorstand.js` (Nr. 10 bis 19), `karriereende.js`, `stadion.js` (Nr. 8 bis 11), `karten.js`, `spielwelt-karten.js`, `fans.js` (K27b, K27e), `abwerben.js` (K20b, K20e), `transfers.js` (K20c, K20d, K19c, K31b, K31c, K19d), `presse.js` (K29b bis K29j), `marketing.js` (K25c, K25d, K25e, K25f), dazu seit dem Nachmittag des 22.11.: `testspiele.js` (K11b, K11c), `erinnerungen.js` (K09b, K07b, K11d, K07d), `scouting.js` (K18c bis K18e), `medizin.js` (K10b bis K10d, K16d), `disziplin.js` (K09c, EA1 bis EA3), `vertraege.js` (K21b, K21d, K21e), `statistik.js` (K34d), `taktik.js` (K06b, eigene Welt am Ende), `stab.js` (K16b), `wettbewerbe.js` (K13b, K13c, K13d, eigene Welten am Ende), `lizenz.js` (K36c am Ende), und in `karten.js` die neuen Karten (K30b, K07c, K08b, K08c, K16c, K27c, K21c, K26e, K12c, K29k, K17b, K22c, K03b, K30c, K30d, K10e, K07e, K14d, K14e, K29l, K30e, K11f, K03c, K30f, K27d, K05c, K05d, K06c, K09e, K06d, K06e, K15e, K26f, U19e, dazu die Fälle EK und EL). Der Katalog in `karten.js` Fall 1 ist mit `kartenpruefung.pl` schon ohne Node geprüft.
2. `node tests/lizenz.js` (Gleichschritt, neue Bereiche `zielgespraech`; seit K36c am Ende die gesammelten Meldungen des Stabs). Viele neue Teile wirken nur ohne Automatik oder über Karten, darum sollte 5a gleich bleiben.
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

### 23.11.2026: Korrekturen nach Prüfung EN zu den Korrekturen EM und K27e (Zweig `mitarbeit/popolupo-en-korrekturen`, auf K26f)

- Ein lesender Prüf-Agent hat die Korrekturen EM und K27e durchgesehen (Konsistenzprüfung EN). Kein Fehler in der Spiellogik, fünf niedrige Funde.
- **Behoben:**
  - EN1: Leerzeichen im Marketing-Kasten.
  - EN2: Test der stufenlosen Grenze „ausverkauft“.
  - EN3: Fall K27e mit Dortmund statt Union.
  - EN4, schon seit U16: Anlässe der Fanstimmung verblassen bis ±0,5 ganz auf 0. Vorher blieben sie bei −0,4 oder 0,5 hängen. Das ändert die Fanstimmung aller Vereine minimal, ohne Zufall.
  - EN5: Doku in K27 und K20.
- **Tests zuerst:** `tests/marketing.js` (K25f), `tests/fans.js` (K27e, dazu Fall 3 und 10 wie bisher).

### 23.11.2026: K26f Anwohner klagen (Zweig `mitarbeit/popolupo-k26f-anwohner`, auf K15e)

- **Neu (K26 §8):** Entscheidungskarte „Anwohner klagen“, eine Anlasskarte mit Chance 0,1 je Woche, solange Tribüne oder Dach auf die Genehmigung warten.
  - Lärmschutz bezahlen: 150.000 € in der 1. Liga, nach Liga skaliert.
  - Es auf die Klage ankommen lassen: Mit 50 % kommt die Genehmigung 3 Wochen später, Baubeginn und Ende verschieben sich (`S.constr.klage`).
- **Geändert:** `bauTag` und die Anzeige der Baustelle rechnen die Klage mit. Ohne Klage bleibt alles wie bisher.
- **Gleichschritt:** unberührt, nur dein Verein, Karten sind in 5a aus.
- **Tests zuerst:** `tests/karten.js` (neu Fall K26f).

### 23.11.2026: K15e Streit nach Kritik (Zweig `mitarbeit/popolupo-k15e-streit`, auf K06e)

- **Neu (K15 §8):** Entscheidungskarte „Streit nach Kritik“, eine Anlasskarte mit Chance 0,6 je Woche.
  - Auslöser: Ein Spieler deines Kaders hat sich in den letzten 7 Tagen im Einzelgespräch nach deiner Kritik mit dir gestritten. Das kommt bei Hitzkopf und Diva vor.
  - Wahl: aussprechen (60 % Stimmung +4, sonst −1), hart bleiben (Stimmung −3, Glaubwürdigkeit +1, Zusammenhalt −1) oder aussitzen (er geht zur Presse, Glaubwürdigkeit −1, Vertrauen −1).
- **Gleichschritt:** unberührt, Karten sind in 5a aus.
- **Tests zuerst:** `tests/karten.js` (neu Fall K15e).

### 23.11.2026: K06e Standard-Spezialisten (Zweig `mitarbeit/popolupo-k06e-standards`, auf K27e)

- **Neu (K06 §8):** Info-Karte „Standard-Spezialisten“, die letzte offene Karte aus K06.
  - Auslöser: In der laufenden Halbserie (deine Ligaspiele bis zur Hälfte der Spieltage) mindestens 8 Ligaspiele, mindestens 7 Tore nach Ecken und Freistößen (ohne Elfmeter) und mindestens 40 % aller Ligatore.
  - Wirkung: Ruf +1. Die Gegner stellen sich 28 Tage darauf ein: Tore deines Vereins nach Ecken und Freistoßflanken × 0,95.
  - Einmal je Halbserie. Die Werte sind geschätzt, bitte nach einem Testlauf ansehen: Wie oft trifft eine Mannschaft der Engine nach Standards?
- **Neu im Spielstand:** `S.std` (Zählung je Halbserie) und `S.stdGegen`.
- **Gleichschritt:** unberührt, Karten sind in 5a aus.
- **Tests zuerst:** `tests/karten.js` (neu Fall K06e; der Katalog ist mit `kartenpruefung.pl` geprüft).

### 23.11.2026: K27e Fankultur bei Fans und Vorstand (Zweig `mitarbeit/popolupo-k27e-fankultur-wirkt`, auf den Korrekturen EM)

- **Neu (K27 §5.4c):** Die Fankultur aus K25f ersetzt die Tradition, die die Konzepte vorsahen:
  - Fanstimmung: Der Baustein Entscheidungen wiegt × (1 + Wirkung × 0,5). Bei Union kostet der Verkauf eines Lieblings −12 statt −8, bei Hoffenheim weiter −8. Das gilt für alle Vereine, die Anzeige im Stadion nennt den Faktor.
  - Abwerben (K20 §5.3): Fliegt ein Versuch auf, sinkt das Vertrauen um −3 × (1 + Wirkung), also bis −6 (Freiburg etwa −5,5).
- **Gleichschritt:** unberührt. Die Fanstimmung gilt für beide Welten gleich, das Abwerben gibt es nur ohne Automatik.
- **Tests zuerst:** `tests/fans.js` (neu Fall K27e), `tests/abwerben.js` (Fall 4 rechnet mit der Fankultur).

### 23.11.2026: Korrekturen nach Prüfung EM zu K25f und den Korrekturen EL (Zweig `mitarbeit/popolupo-em-korrekturen`, auf den Korrekturen EL)

- Ein lesender Prüf-Agent hat K25f und die Korrekturen EL durchgesehen (Konsistenzprüfung EM). Die Werte der Fankultur in K25 §5.6 hat er von Hand nachgerechnet, sie stimmen.
- **Behoben:**
  - EM1 (hoch): `tests/marketing.js` hatte einen Syntaxfehler (`w` doppelt), die ganze Datei wäre nicht gelaufen.
  - EM2: Die Untergrenze der Zugkraft bei vollem Stadion steigt jetzt stufenlos von 93 % bis 97 % statt hart bei 97 %. Neue Werte: Freiburg 75, Heidenheim 59, Kiel 56, Osnabrück 46. Die Karte schreibt ab 97 % „ausverkauft“.
  - EM3: Die Schwelle für die Meldung „Kurve“ steht in `REGELN.marketing.fankultur.kurve`.
- **Tests zuerst:** `tests/marketing.js` (Fall 1 und K25f).

### 23.11.2026: Korrekturen nach Prüfung EL zu den Korrekturen EK und EJ (Zweig `mitarbeit/popolupo-el-korrekturen`, auf K25f)

- Ein lesender Prüf-Agent hat die Korrekturen EK und EJ durchgesehen (Konsistenzprüfung EL). Kein Fehler in der Spiellogik, ein mittlerer Fund im Test.
- **Behoben:**
  - EL1: Test K13d unterscheidet EI3 jetzt wirklich (kein Ersatztermin vor einem nahen Ligaspiel) und prüft die Lage aus EI4 (Supercup am Vortag).
  - EL2: K06 §8 nennt die Bedingungen aus EK6 und EK7.
  - EL3: Kommentare zu `S.letzte` und zum Wettskandal. Der Rückfall auf `S.letzt`, der nie griff, ist gestrichen.
  - EL4: neuer Fall EL in `tests/karten.js` (Stil-Automatik, 28-Tage-Grenze), README nennt die Fälle EK und EL.
- **Tests zuerst:** `tests/wettbewerbe.js` (K13d), `tests/karten.js` (EL).

### 23.11.2026: K25f Fankultur statt Gründungsjahr (Zweig `mitarbeit/popolupo-k25f-fankultur`, auf den Korrekturen EJ)

- **Anlass:** Rückmeldung des Nutzers zu K25e und EJ4:
  - Leverkusen ist kein Traditionsverein, aber fest etabliert.
  - Wolfsburg und Hoffenheim füllen ihr Stadion selten.
  - Union, St. Pauli und Kaiserslautern haben eine starke Kultur.
  - Vorschlag: Stadion und Dauerkarten, Jahre in der Bundesliga gegen Verkaufszahlen.
- **Neu (K25 §5.6):** Fankultur 0 bis 100 aus drei Teilen: Stadion (Fans je Platz), Mitglieder je Platz und Zugkraft (Fans gemessen am Ansehen, je im Ligaschnitt). Sie kommt aus den heutigen Werten am Verein und ändert sich im Spiel mit.
  - Beim Trikot wirkt sie stufenlos: bis 50 nicht, ab 80 voll wie bisher beim Traditionsverein.
  - Der Marketing-Kasten zeigt sie an.
  - `tradition:false` fällt weg, ebenso das Gründungsjahr als Maßstab. `gegr` bleibt für Jubiläen.
- **Von Hand nachgerechnet:** Union 80, Leverkusen 79, St. Pauli 77, Kaiserslautern 71, Freiburg 69, Leipzig 38, Wolfsburg 30, Hoffenheim 27.
- **Tests zuerst:** `tests/marketing.js`, Fall K25f statt K25e. Fall 1 rechnet mit der Wirkung bei Freiburg.

### 23.11.2026: Korrekturen nach Prüfung EJ zu K30f, K25e, K13d und dem Doku-Abgleich (Zweig `mitarbeit/popolupo-ej-korrekturen`, auf den Korrekturen EK)

- Ein lesender Prüf-Agent hat K30f, den Doku-Abgleich, K27d, K25e und die Korrekturen EI durchgesehen (Konsistenzprüfung EJ). Ein mittlerer Fund.
- **Behoben:**
  - EJ1: Der Wettskandal sperrt nur noch, ohne Transferliste.
  - EJ2: Nie ein Spieler deines Kaders in der Zweiten.
  - EJ3: K05 Nr. 16 wieder richtig: Das Zuschauen vorher fehlt.
  - EJ4: Hoffenheim und Leverkusen sind keine Traditionsvereine (vorläufig).
  - EJ5: Test K13d prüft den Termin vor dem nächsten Ligaspiel und den Abstand zu Testspielen.
- **Tests zuerst:** `tests/karten.js` (K30f), `tests/marketing.js` (K25e), `tests/wettbewerbe.js` (K13d).

### 23.11.2026: Korrekturen nach Prüfung EK zu K05c bis K06d (Zweig `mitarbeit/popolupo-ek-korrekturen`, auf K06d)

- Ein lesender Prüf-Agent hat K05c, K05d, K06c/K09e und K06d durchgesehen (Konsistenzprüfung EK). Zwei mittlere Funde.
- **Behoben:**
  - EK1: Verletzt Ausgewechselte zählen nicht als früh ausgewechselt.
  - EK2: Die Karten sehen alle Pflichtspiele der letzten 7 Tage (`S.letzte`), auch Pokal und Europapokal unter der Woche.
  - EK3: Der Merker gilt nur für deinen Verein.
  - EK4: In der Verlängerung gilt ein Tor erst ab Minute 118 als spät.
  - EK5: Kein Last-Minute-Drama in Relegation und Europapokal (vorläufig).
  - EK6: Kein Taktik-Coup, wenn der Co-Trainer den Stil wählt.
  - EK7: Positionszähler erst ab der Mindestzeit, nach 28 Tagen neu.
- **Offen:** EK7 Kettenwechsel in `xpo` (Engine), erst nach einem Testlauf.
- **Tests zuerst:** `tests/karten.js` (K05d, K06c/K09e angepasst, neuer Fall EK).

### 23.11.2026: K06d Spieler hadert mit seiner Position (Zweig `mitarbeit/popolupo-k06d-position-hadern`, auf K06c/K09e)

- **Neu (K06 §8):** Nach jedem Pflichtspiel zählt `p.pfal` die Einsätze in Folge auf einer Position mit Eignung unter 80 %. Ab drei Einsätzen kommt die Entscheidungskarte „Spieler hadert mit seiner Position“: erklären oder hart bleiben.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K06d).

### 23.11.2026: K06c Taktik-Coup, K09e Derby-Karten (Zweig `mitarbeit/popolupo-k06c-k09e-coup-derby`, auf K05d)

- **Neu (K06 §8):** „Taktik-Coup“, wenn du als Außenseiter mit dem Stil gewinnst, der den des Gegners schlägt. Ruf +1, Fans +1.
- **Neu (K09 §8):**
  - „Pyrotechnik im Derby“ als Entscheidung, nach einem Derby mit Chance 0,3.
  - „Rudelbildung“, nach einem Derby mit Roter Karte, Geldstrafe.
- Der Merker `S.letzt` hat dafür `gegner`, `derby`, `rot` und `coup`.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K06c/K09e mit dem Baden-Derby Freiburg – Karlsruhe).

### 23.11.2026: K05d Last-Minute-Drama (Zweig `mitarbeit/popolupo-k05d-last-minute`, auf K05c)

- **Neu (K05 §8):** Entschied ein Tor ab Minute 88 dein Pflichtspiel mit einem Tor Unterschied (ohne Elfmeterschießen), kommt eine Meldung mit Wirkung.
  - Beim Sieg: Fans +2, Stimmung im Kader +1.
  - Bei der Niederlage: Stimmung −1.
  - Der Merker `S.letzt` hat dafür `spaet`.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K05d).

### 23.11.2026: K05c Joker sticht, Handschlag verweigert (Zweig `mitarbeit/popolupo-k05c-joker-handschlag`, auf den Korrekturen EI)

- **Neu (K05 §8):** Nach deinem Pflichtspiel merkt sich das Spiel die Joker (eingewechselt, dann getroffen) und die vor der 60. Minute Ausgewechselten (`S.letzt`). Daraus entstehen zwei Anlasskarten bis 7 Tage danach:
  - „Der Joker sticht“: Selbstvertrauen +1, Stimmung +2.
  - „Handschlag verweigert“: nur bei einer Diva. Zur Wahl stehen zurechtweisen, unter vier Augen klären und ignorieren.
- **Engine:** Der Wechsel im Spielbericht trägt jetzt auch `ausId`. Ein Feld mehr, kein Würfel, keine Wirkung auf das Spiel. Spielberichte sind in beiden Welten des Gleichschritts gleich.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K05c), `tests/live.js` (Live und berechnet gleich, sollte unverändert grün sein).

### 23.11.2026: Korrekturen nach Prüfung EI zu K21d, K21e und K13d (Zweig `mitarbeit/popolupo-ei-korrekturen-b`, auf K25e)

- Ein lesender Prüf-Agent hat K07f, K21d, K21e, K13d und die Korrekturen EH durchgesehen (Konsistenzprüfung EI). Ein mittlerer Fund.
- **Behoben:**
  - EI1: Pokal- und Saisonprämien sind einmalig gebucht („Sonderprämien“), nicht mehr in der Finanzprognose.
  - EI2: Zweite Mannschaften bekommen keine Saisonprämie.
  - EI3 und EI4: Der verlegte Termin liegt vor dem nächsten Ligaspiel beider Vereine und hält Abstand zu Testspielen. Die Lage findet das Ligaspiel auch nach einem Pokal- oder Europapokalspiel.
  - EI5: Test K13d strenger.
- **Tests zuerst:** `tests/vertraege.js` (K21d, K21e), `tests/wettbewerbe.js` (K13d), dazu `tests/finanzen.js` (die Prognose soll unverändert sein).

### 23.11.2026: K25e Tradition beim Trikot (Zweig `mitarbeit/popolupo-k25e-tradition`, auf K27d)

- **Neu (K25 §5.3):** Ein Verein mit Gründungsjahr bis 1910 gilt als Traditionsverein. Dort bringt das klassische Trikot Faktor +0,05 und Fans +1 mehr, das mutige wird nur mit 35 % statt 50 % Kult. Gewürfelt wird gleich oft wie vorher, die Werte sind geschätzt.
- **Tests zuerst:** `tests/marketing.js`. Fall 1 rechnet jetzt mit der Tradition, denn Freiburg ist ein Traditionsverein. Neu ist Fall K25e.

### 23.11.2026: K27d Jubiläum (Zweig `mitarbeit/popolupo-k27d-jubilaeum`, auf dem Doku-Abgleich)

- **Neu (K27 §8, K25 §8):** Gründungsjahre der 54 Vereine der drei Profiligen in `daten/vereine.js` (`gegr`).
  - Quelle ist RSSSF. Zwölf Vereine fehlen dort, sie stehen nach Vereinsangabe drin und sind ungeprüft.
  - Bei HSV und Dynamo Dresden gilt die Zählung des Vereins.
- Im Kalenderjahr eines Vielfachen von 25 Jahren kommt die Anlasskarte „Rundes Jubiläum“: Choreo, Retro-Trikot oder kleine Feier.
- **Doku-Abgleich** davor (eigener Commit auf `mitarbeit/popolupo-ei-korrekturen`): veraltete Hinweise „noch nicht gebaut“ in K05, K08, K19 und K32 berichtigt.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K27d).

### 23.11.2026: K30f Skandale (Zweig `mitarbeit/popolupo-k30f-skandale`, auf den Korrekturen EH)

- **Neu (K30 §8.4), Weltereignisse als Info-Karten mit Wirkung:**
  - „Ein Wettpate meldet sich“: Dein Spieler meldet den Anwerbeversuch, Stimmung +3, Fans +1.
  - „Wettskandal“: Ein Spieler eines Computer-Vereins ist 20 Liga- und 3 Pokalspiele gesperrt und steht auf der Transferliste.
  - Beide sind „gelegentlich“, zusammen etwa einmal in zehn Saisons.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K30f). Gleichschritt unverändert, Karten sind dort aus.

### 23.11.2026: Korrekturen nach Prüfung EH zu K30e, K29l und K16d (Zweig `mitarbeit/popolupo-eh-korrekturen`, auf K13d)

- Ein lesender Prüf-Agent hat K29l, K30e, K11f, K16d, K03c und die Korrekturen EG durchgesehen (Konsistenzprüfung EH). Kein mittlerer Fund.
- **Behoben:**
  - EH1: Der Halt der Rückendeckung gilt nur in derselben Saison.
  - EH2: Der Test K29l nimmt ein Ligaspiel ohne eigenes Spiel kurz davor.
  - EH3: Info-Karten mit Wirkung wirken auch über der Info-Grenze, nur ohne Meldung.
  - EH4: Die Warnung des Arztes merkt den absoluten Tag.
- **Tests zuerst:** `tests/karten.js` (K30e, K29l), `tests/medizin.js` (K16d).

### 23.11.2026: K13d Spielverlegung beantragen (Zweig `mitarbeit/popolupo-k13d-spielverlegung`, auf K21e)

- **Neu (K13 §12 Nr. 13, K10 §8):** Neuer Lizenzbereich `verlegung` (A-Lizenz, ohne Automatik). Für dein nächstes Ligaspiel (frühestens morgen, höchstens in 7 Tagen) kannst du eine Verlegung beantragen.
  - Voraussetzung: weniger als 16 Spieler einsatzfähig oder kein Torwart (wie die Regel der DFL aus der Corona-Zeit, vorläufig), einmal je Saison.
  - Den neuen Termin sucht die Liga wie bei den übrigen Verlegungen: drei Tage Abstand zu allen Spielen beider Vereine, kein Montag, vor dem letzten Spieltag.
  - Karte im Büro nur, wenn ein Antrag Aussicht hat.
- **Tests zuerst:** `tests/wettbewerbe.js` (neuer Fall K13d am Ende, eigene Welt), `tests/lizenz.js` (neuer Bereich, die Zahl der Bereiche steigt um eins). Im Browser die Büro-Karte. Gleichschritt unverändert, nur deine Handlung.

### 23.11.2026: K21e Aufstiegs- und Klassenerhaltsprämie (Zweig `mitarbeit/popolupo-k21e-saisonpraemien`, auf K21d)

- **Neu (K21 §4):** Mit Teamprämie „hoch“ zahlt dein Verein zum Saisonende eine Aufstiegsprämie (auch nach der Relegation). Die Klassenerhaltsprämie gibt es nur mit dem Saisonziel Klassenerhalt und nicht beim Abstieg. Gebucht wird vor der Summe der Saisonfinanzen.
- **Tests zuerst:** `tests/vertraege.js` (neuer Fall K21e), dann ein Saisonwechsel (`welt.js` oder `ui-zwei-saisons.js`), weil `seasonEndLauf` geändert ist.

### 23.11.2026: K21d Pokalprämie (Zweig `mitarbeit/popolupo-k21d-pokalpraemie`, auf K07f)

- **Neu (K21 §4):** Mit Teamprämie „hoch“ kostet jede gewonnene Runde im DFB-Pokal Kadergröße × Pokalprämie. Die Prämie je Spieler beträgt 20.000 € in der 1. Liga, 6.000 € in der 2. und 2.000 € in der 3. (geschätzt). Es gibt eine Meldung, die Teamprämie im Kader nennt den Betrag.
- **Tests zuerst:** `tests/vertraege.js` (neuer Fall K21d). Gleichschritt unverändert, „hoch“ setzt nur deine Wahl.

### 23.11.2026: K07f Eigene Trainingsvorlagen (Zweig `mitarbeit/popolupo-k07f-eigene-vorlagen`, auf den Korrekturen EG)

- **Neu (K07 §6):** Im Training gibt es ein Formular „Eigene Vorlage“. Je Tag im Abstand zum Spiel wählst du Einheit und Intensität, wie bei den festen Vorlagen. Höchstens drei eigene Vorlagen, Löschen stellt auf den Co-Trainer zurück.
- Sie gelten nur für deinen Verein. Computer-Vereine und dein früherer Verein planen nach der Automatik, ebenso dein Verein mit Automatik des Bereichs `vorlage`.
- **Tests zuerst:** `tests/training.js` (neuer Fall K07f am Ende). Im Browser bitte einmal die Ansicht Training mit dem neuen Formular (axe, `ui-zugang.js`). Gleichschritt unverändert erwartet, die Automatik nutzt keine eigenen Vorlagen.

### 23.11.2026: Korrekturen nach Prüfung EG zu K14e, K17d und EF (Zweig `mitarbeit/popolupo-eg-korrekturen`, auf K03c)

- Ein lesender Prüf-Agent hat K17d, K09d, K07e/K14d, K14e und die Korrekturen EF durchgesehen (Konsistenzprüfung EG). Kein blockierender Fund, vier kleine.
- **Behoben:**
  - EG1: Die Transferliste der Karte „Grüppchenbildung“ beachtet den Stab. Der Anführer ist nie ausgeliehen und hat keinen vereinbarten Wechsel.
  - EG2: Das Gerücht „Thema“ trifft nur beim Wechsel zum genannten Verein.
  - EG3: Klatsch zählt die Beziehung ohne Grundwert, ein Derby allein schaltet ihn nicht ein.
  - EG4: Test K30c strenger, Dauer von `beziehungen.js` in der README.
- **Tests zuerst:** `tests/karten.js` (K14e, K30c), `tests/geruechte.js` (K17d).

### 22.11.2026: K03c Durchbruch und Altersverlust (Zweig `mitarbeit/popolupo-k03c-entwicklung`, auf K16d)

- **Neu (K03 §8), Info-Karten mit Wirkung und Anlasskarten:** „Durchbruch“ (bis 21 Jahre, mindestens +2 Stärke seit dem Monatseintrag `p.mvl`, der mindestens 21 Tage alt ist; Selbstvertrauen +1) und „Nicht mehr der Schnellste“ (ab 30 Jahren, −2).
- **Tests zuerst:** `tests/karten.js` (neuer Fall K03c).

### 22.11.2026: K16d Arzt widerspricht (Zweig `mitarbeit/popolupo-k16d-arzt-widerspricht`, auf K11f)

- **Neu (K16 §8):** Zeigt die Spanne einer Verletzung mehr als 5 Tage, rät der Mannschaftsarzt vom Fitspritzen ab. Der erste Klick zeigt die Warnung mit dem Risiko, erst ein zweiter Klick am selben Tag spritzt. Der Knopf trägt dann „Arzt rät ab“.
- **Tests zuerst:** `tests/medizin.js` (neuer Fall K16d am Ende, eigene Welt). Nur deine Handlung, der Gleichschritt bleibt.

### 22.11.2026: K11f Turniersieg (Zweig `mitarbeit/popolupo-k11f-turniersieg`, auf K30e)

- **Neu (K11 §8):** Meldung „Turniersieg“ nach dem gewonnenen Sommerturnier (bis 7 Tage nach dem Finale, Chance 1). Das Selbstvertrauen des ganzen Kaders steigt um 1 (neue Wirkung `svAlle`).
- **Tests zuerst:** `tests/karten.js` (neuer Fall K11f).

### 22.11.2026: K30e Info-Karten mit Wirkung (Zweig `mitarbeit/popolupo-k30e-info-wirkung`, auf K29l)

- **Neu (K30 §5.6):** Info-Karten können Wirkungen tragen, sie gelten beim Erscheinen.
  - „Rückendeckung vom Vorstand“ hält jetzt das Vertrauen 30 Tage auf dem Wert des Tages (K28 §8).
  - Neu sind „Dorfverein im Ausnahmezustand“ (Fans +1) und „Blamage gegen Amateure“ (Vertrauen −1, Fans −1) nach Testspielen (K11 §8).
  - `{verein}` nennt jetzt auch Amateurvereine.
- **Tests zuerst:** `tests/karten.js` (Fall 1 prüft die Wirkungen der Info-Karten, neuer Fall K30e, seit EH auch still über der Info-Grenze), `tests/vorstand.js` (soll unverändert grün bleiben, ohne Karte gibt es keinen Halt).

### 22.11.2026: K29l Presse-Karten (Zweig `mitarbeit/popolupo-k29l-presse-karten`, auf den Korrekturen EF)

- **Neu (K29 §8), Anlasskarten:**
  - „Dein Spruch geht viral“ nach einem Eintrag in der Sprüche-Chronik: T-Shirt (Fanartikel +10 %) oder nicht.
  - „Der Rivale antwortet“ vor dem Spiel gegen einen Gegner mit offener Kampfansage: nachlegen, zurückrudern (neue Wirkung `zurueckrudern`, danach weder Kult noch Häme) oder schweigen.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K29l).

### 22.11.2026: Korrekturen nach Prüfung EF zu K30c, K10e und EE (Zweig `mitarbeit/popolupo-ef-korrekturen`, auf K14e)

- Ein lesender Prüf-Agent hat K30c, die Korrekturen EE, K30d und K10e durchgesehen (Konsistenzprüfung EF). Zwei mittlere Funde, kein blockierender.
- **Behoben:**
  - EF1: Das Gegenangebot liegt nie über der Forderung (`kaufRunde`), ein Nachlass allein bringt kein Verhandlungsgerücht.
  - EF2: Der Hygieneplan hält auch nach neuen Kranken.
  - EF3: Der Nachlass senkt auch eine vereinbarte Ablöse.
  - EF4: Der lachende Dritte gilt nicht beim Vorvertrag, der Merker fällt beim Saisonwechsel weg.
  - EF5 und EF6: Tests.
- **Tests zuerst:** `tests/karten.js` (K30c, K10e, K22c), `tests/transfers.js` (Verhandlung, wegen `kaufRunde`), `tests/geruechte.js`, `tests/medizin.js`. Gleichschritt: `kaufRunde` ist nur dein Kauf, `krankFaktor` ohne Hygieneplan wie vorher.

### 22.11.2026: K14e Grüppchenbildung (Zweig `mitarbeit/popolupo-k14e-grueppchen`, auf K07e)

- **Neu (K14 §8):** Karte „Grüppchenbildung“, wenn es in deinem Kader ein Grüppchen gibt (K14 §5: mindestens drei Freunde, Stimmung im Schnitt unter 35). Zur Wahl stehen:
  - eine Aussprache mit der Gruppe,
  - ein Teamevent,
  - den Anführer auf die Transferliste setzen.
- **Neue Wirkungen:** `gruppeStimmung` (alle im Grüppchen) und `transferliste` (wie von Hand, Forderung zum Marktwert, nur mit freien Transfers).
- **Tests zuerst:** `tests/karten.js` (neuer Fall K14e).

### 22.11.2026: K07e Rangelei im Training, K14d Partynacht (Zweig `mitarbeit/popolupo-k07e-rangelei-partynacht`, auf K09d)

- **Neu (K07 §8):** Karte „Rangelei im Training“, wenn ein Hitzkopf einen Rivalen im Kader hat. Zur Wahl stehen Geldstrafe, Aussprache (mit 50 % Zusammenhalt +2, sonst −1) und laufen lassen.
- **Neu (K14 §8):** „Partynacht“ als Folgekarte (K30c) nach „Feiern lassen“ bei der Kabinenparty, ein bis zwei Tage später, wenn ein Partylöwe im Kader ist.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K07e/K14d, Katalog mit zwei Folgekarten).

### 22.11.2026: K09d Derby-Faktor und Brisanz (Zweig `mitarbeit/popolupo-k09d-derby-brisanz`, auf K17d)

- **Neu (K09 §5.1, K17 §5.2):** In Derbys und in Spielen zweier Vereine, deren Beziehung unter −50 liegt, gibt es nach Fouls 1,3-mal so viele Karten. Testspiele zählen nicht. Kein neuer Würfel, nur eine höhere Schwelle in der Engine.
- **Noch offen:** Derbys als „wichtige Spiele“ (K04 §5.5). Das würde die Spielstärke ändern, darum erst nach einem Testlauf.
- **Tests zuerst:** `tests/beziehungen.js` (neuer Fall 11), dann `tests/disziplin.js` (Kartenhäufigkeit, erwartet minimal höher, etwa +1 %). Gleichschritt: Derbys gibt es in beiden Welten gleich, die Beziehung Verein–Verein erreicht in 150 Tagen kaum −50. 5a sollte gleich bleiben.

### 22.11.2026: K17d Klatsch und Tratsch (Zweig `mitarbeit/popolupo-k17d-klatsch`, auf K10e)

- **Neu (K17 §5.2, §5.3):** Liegt deine Beziehung zu einem Verein unter −30, kommen Gerüchte über deinen Verein doppelt so oft. Dazu gibt es die neue Art „{spieler} soll bei {klub} ein Thema sein“: Der Spieler fühlt sich begehrt (+3, 30 %) oder wird unruhig (−3).
- **Tests zuerst:** `tests/geruechte.js` (neuer Fall K17d, die übrigen sollen unverändert grün bleiben). Gerüchte sind im Gleichschritt abgeschaltet.

### 22.11.2026: K10e Medizin-Karten (Zweig `mitarbeit/popolupo-k10e-medizin-karten`, auf K30d)

- **Neu (K10 §8), beide als Anlasskarten:**
  - „Grippewelle“ ab drei Kranken. Der Hygieneplan beendet die Ansteckung, zwei Wochen lang erkranken nur halb so viele.
  - „Lange Reha“ bei Verletzungen ab 60 Tagen. Der Spezialist halbiert das Rückfallrisiko nach der Rückkehr, gezahlt wird nur, solange der Spieler verletzt ist.
- **Geändert in `js/medizin.js`:** Zwei Faktoren, die ohne die Karten 1 sind (`t.hygBis`, `p.vl.rfF`). Gleich viele Würfel wie vorher.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K10e), `tests/medizin.js` (soll unverändert grün bleiben). Gleichschritt unverändert erwartet.

### 22.11.2026: K30d Anlasskarten (Zweig `mitarbeit/popolupo-k30d-anlasskarten`, auf den Korrekturen EE)

- **Neu (K30 §5.5 Nr. 3):** Eine Karte kann statt der Seltenheitsstufe eine eigene `chance` je Woche tragen, in der ihr Anlass besteht. Damit ist die offene Frage K37 §12 Nr. 21 vorläufig entschieden (in `_offene-entscheidungen.md` zur Bestätigung).
- **Gesetzt:** Fanmarsch 0,15, Reisechaos 0,1, Pyrotechnik 0,1, Wunder 1. Gleich viele Würfel je Woche wie vorher.
- **Tests zuerst:** `tests/karten.js` (Fall 1 prüft `chance`, neuer Fall K30d). Gleichschritt unverändert erwartet (keine Karten in 5a).

### 22.11.2026: Korrekturen nach Prüfung EE zu K17b, K22c, K21c, K13c und ED (Zweig `mitarbeit/popolupo-ee-korrekturen`, auf K30c)

- Ein lesender Prüf-Agent hat K13c, K29k, K17b, K22c, K03b und die Korrekturen ED durchgesehen (Konsistenzprüfung EE). Zwei mittlere Funde, kein blockierender.
- **Behoben:**
  - EE1: „Hilfe in der Not“ holt nur mit freigeschalteten Leihen.
  - EE2: Der Auslöser bietet nur Spieler an, die die Leihe zuließe (`ausleihenGrund`), und der Verleiher behält genug Spieler. Neu im Katalog ist `dann`, Folgewirkungen nur bei Erfolg.
  - EE3: Sperre je Mitarbeiter ohne Verein.
  - EE4: Pokal-Los des Jahres nicht in Runde 1 und einmal je Saison.
  - EE5: „Berater droht“ nur unter dem Marktgehalt, Bonus nur mit Erhöhung.
  - EE6: Provision, Beziehung nur mit Zahlung.
- **Tests zuerst:** `tests/karten.js` (Fall 1 mit `dann`, K17b, K21c, K22c), `tests/wettbewerbe.js` (K13c am Ende), `tests/leihe.js` (wegen `ausleihenGrund`, gleiche Prüfungen wie vorher).

### 22.11.2026: K30c Ketten und „Der lachende Dritte“ (Zweig `mitarbeit/popolupo-k30c-ketten`, auf den Korrekturen ED)

- **Neu (K30 §3.1, §8.3, K30 §5.6):** Ereigniskarten können Folgekarten anstoßen. Eine Option mit `kette:{karte, tage}` legt die Folgekarte nach einigen Tagen. Sie kommt täglich über `kartenKette`, wenn ihr Auslöser die Beteiligten noch bestätigt, sonst verfällt sie still.
- **Erste Kette „Der lachende Dritte“ (K17 §5.4):**
  - Karte 1: Zwei Computer-Vereine könnten um einen Spieler der Transferliste bieten, du kennst seinen Berater. Treffen, offiziell melden oder heraushalten.
  - Karte 2 nach dem Treffen: schnell bieten oder die Vereine gegeneinander ausspielen (Nachlass 10 % oder Ärger).
  - Kaufst du ihn, sinkt die Beziehung zwischen den beiden Vereinen um 10, deine zu ihnen um 2, nach erfolgreichem Ausspielen gar nicht.
- **Umbau:** Die Mitbieter im Bieterwettstreit (K20c) sind als `mitbieter` herausgelöst, mit denselben Bedingungen.
- **Prüfskript:** `kartenpruefung.pl` und `tests/karten.js` Fall 1 prüfen die Folgekarten. `kartenpruefung.pl` erkennt Fehler, die ich in einer Kopie eingebaut habe.
- **Tests zuerst:** `tests/karten.js` (Fall 1 und neuer Fall K30c), `tests/transfers.js` (K20c, wegen `mitbieter`). Gleichschritt (`lizenz.js` 5a) unverändert erwartet, denn ohne `kartenWoche` gibt es keine Ketten.

### 22.11.2026: Korrekturen nach Prüfung ED zu K16c, K27c, K21c, K26e, K12c und EC (Zweig `mitarbeit/popolupo-ed-korrekturen`, auf K03b)

- Ein lesender Prüf-Agent hat K16c, K27c, K21c, K13b, K26e, K12c und die Korrekturen EC durchgesehen (Konsistenzprüfung ED). Zwei mittlere Funde, kein blockierender.
- **Behoben:** ED1 Preis höchstens auf den Richtpreis; ED2 Test prüft die Konter-Markierung in `kiStil`; ED3 Sperre je Mitarbeiter; ED4 Pflichtrolle, Ablöse und Gehaltsrahmen beim Mitarbeiter; ED5 „Übergewicht“ nur für die im Leistungstest Auffälligen (`S.lt`); ED6 Provision und Zuschuss bei später Entscheidung; ED7 strengere Tests.
- **Tests zuerst:** `tests/karten.js` (K12c, K21c), `tests/taktik.js` (K06b), `tests/scouting.js` (K18d, K18e).

### 22.11.2026: K03b Formkarten (Zweig `mitarbeit/popolupo-k03b-formkarten`, auf dem Testvorschlag)

- **Neu (K03 §8):** Karte „Formkrise“ (Form bis 4; Gespräch, Pause oder durchziehen, neue Wirkung `selbstvertrauen`) und Meldung „Formhoch“ (Form ab 16).
- **Tests zuerst:** `tests/karten.js` (neuer Fall K03b und Katalog).

### 22.11.2026: K22c Berater droht mit Wechsel (Zweig `mitarbeit/popolupo-k22c-berater-droht`, auf K17b)

- **Neu (K21 §8, K22 §8):** Karte für einen Spieler im letzten Vertragsjahr mit gierigem Berater: nachgeben (Gehalt aufs Marktgehalt im Gehaltsrahmen) oder standhaft bleiben (Beziehung zum Berater −10).
- **Tests zuerst:** `tests/karten.js` (neuer Fall K22c und Katalog).

### 22.11.2026: K17b Hilfe in der Not (Zweig `mitarbeit/popolupo-k17b-hilfe-in-not`, auf K29k)

- **Neu (K17 §8):** Bei mindestens fünf Verletzten im offenen Transferfenster bietet ein Verein mit Beziehung über 40 einen Spieler zur Leihe an. Annehmen läuft über die normale Leihe mit allen Prüfungen (neue Kartenwirkung `leihe`), Beziehung +5.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K17b und Katalog).

### 22.11.2026: K29k Presse-Karten (Zweig `mitarbeit/popolupo-k29k-presse-karten`, auf K13c)

- **Neu (K29 §8, K17 §8):** Karten „Wer war das Leck?“ (Medienklima unter 45) und „Fehde in der Presse“ (Verein deiner Liga mit Beziehung unter −50).
- **Tests zuerst:** `tests/karten.js` (neuer Fall K29k und Katalog). Der Katalog ist ab jetzt auch mit `kartenpruefung.pl` (Perl) geprüft: 35 Karten, keine Funde.

### 22.11.2026: K13c Pokalmeldungen (Zweig `mitarbeit/popolupo-k13c-pokal-meldungen`, auf den Korrekturen EC)

- **Neu (K13 §8):** Meldung „Pokalsensation“, wenn ein Erstligist (nicht dein Verein) gegen einen Amateurverein oder Drittligisten ausscheidet, und „Pokal-Los des Jahres“ bei der Auslosung (Spitzenverein gegen Amateure). Ohne Würfel.
- **Tests zuerst:** `tests/wettbewerbe.js` (neuer Fall K13c am Ende, eigene Welt).

### 22.11.2026: Korrekturen nach Prüfung EC zu K06b, K18d, K18e, K07d und EB (Zweig `mitarbeit/popolupo-ec-korrekturen`, auf K12c)

- Ein lesender Prüf-Agent hat K06b, K18d, K18e, K07d, K29j und die Korrekturen EB durchgesehen (Konsistenzprüfung EC). Nur kleine Funde.
- **Behoben:** EC1 „Durchschaut“ nur nach einem echten Konter (`kiStil` markiert ihn, `konter` im Spielergebnis, ohne Würfel); EC2 Aufschlag nur beim Verein von damals; EC3 „Scout lag daneben“ nur mit Scout; EC4 „Lernplatz frei“ nur, wenn jemand etwas lernen kann; EC5 „unverkäuflich“ aus der Abwerbe-Karte bricht ein Wechselversprechen wie sonst auch.
- **Tests zuerst:** `tests/taktik.js` (K06b mit Markierung), `tests/scouting.js` (K18d, K18e), `tests/erinnerungen.js` (K07d), `tests/abwerben.js`.

### 22.11.2026: K12c Sommerkarten (Zweig `mitarbeit/popolupo-k12c-sommerkarten`, auf K26e)

- **Neu (K12a §8):** Karten „Übergewicht nach dem Urlaub“ (bis 14 Tage nach dem Leistungstest; Geldstrafe, Sonderschichten mit neuer Wirkung `sonderschicht`, ignorieren) und „Urlaubsfoto in der Zeitung“ (im Urlaub, Partylöwe; zur Rede stellen oder durchgehen lassen).
- **Tests zuerst:** `tests/karten.js` (neuer Fall K12c und Katalog).

### 22.11.2026: K26e Stadt bietet Zuschuss (Zweig `mitarbeit/popolupo-k26e-stadt-zuschuss`, auf K13b)

- **Neu (K26 §8):** Große Entscheidungskarte bei einem Bauprojekt ab 5 Mio. €: Die Stadt zahlt 15 % der Baukosten, dafür sinkt dein Ticketpreis auf den Richtpreis. Einmal je Projekt.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K26e und Katalog).

### 22.11.2026: K13b Supercup-Prämie (Zweig `mitarbeit/popolupo-k13b-supercup-praemie`, auf K21c)

- **Neu (K13 §12 Nr. 12):** Der Supercup bringt dem Sieger 3 Mio. € und dem Verlierer 2 Mio. € (Franz-Beckenbauer-Supercup 2025, nach Medienberichten), Computer-Vereinen aufs Konto, deinem Verein als Buchung „Supercup“.
- **Tests zuerst:** `tests/wettbewerbe.js` (neuer Fall K13b am Ende, eigene Welt).

### 22.11.2026: K21c Vertragskarten (Zweig `mitarbeit/popolupo-k21c-vertragskarten`, auf K27c)

- **Neu (K21 §8, K22 §8):** Karten „Gehaltsneid“ (Gehalt deutlich unter dem Marktgehalt und Stimmung gesunken; anpassen im Gehaltsrahmen, erklären, ignorieren) und „Provisionsstreit“ (Neuzugang mit Berater; zahlen oder nicht, mit Wirkung auf die Beziehung zum Berater).
- **Tests zuerst:** `tests/karten.js` (neuer Fall K21c und Katalog).

### 22.11.2026: K27c Fan-Karten (Zweig `mitarbeit/popolupo-k27c-fan-karten`, auf K16c)

- **Neu (K27 §8):** Karten „Protest gegen Ticketpreise“ (Preis weit über dem Richtpreis bei schlechter Fanstimmung; senken setzt den Richtpreis) und „Pfiffe gegen den eigenen Spieler“ (Spieler mit offiziellem Wechselwunsch; in Schutz nehmen oder schweigen).
- **Tests zuerst:** `tests/karten.js` (neuer Fall K27c und Katalog).

### 22.11.2026: K16c Mitarbeiter abgeworben (Zweig `mitarbeit/popolupo-k16c-stab-abgeworben`, auf den Korrekturen EB)

- **Neu (K16 §8):** Karte „Mitarbeiter abgeworben“: Ein Verein mit mehr Ansehen und freiem Platz will einen guten Mitarbeiter deines Stabs. Ziehen lassen (Ablöse ein Jahresgehalt) oder mit 20 % mehr Gehalt halten (Voreinstellung). Neuer Platzhalter `{mitarbeiter}`.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K16c, Katalog mit neuem Platzhalter).

### 22.11.2026: Korrekturen nach Prüfung EB zu K20e und K08c (Zweig `mitarbeit/popolupo-eb-korrekturen`, auf K29j)

- Ein lesender Prüf-Agent hat K07c, K20e, K08b, K08c und die Korrekturen EA durchgesehen (Konsistenzprüfung EB). Zwei mittlere Funde, kein blockierender.
- **Behoben:**
  - EB1 bis EB4 (Abwerben durch Computer-Vereine): kein Gesprächswunsch unter der Automatik der Gespräche, nur Spieler bis Stufe 1, „unverkäuflich“ ohne Nebenwirkungen, Halt „Frist“ und keine zweite Karte.
  - EB5, EB6 (Talent gelockt): Kaderdeckel deines Vereins (36), beim neuen Verein `seit` und `abl`, Prüfung auf `aktiv`.
  - EB8: Eine fremde alte Klausel verhindert deine Weiterverkaufsbeteiligung nicht mehr.
- Dazu: Der Vorschlag für den nächsten Testlauf oben nennt jetzt alle neuen Testfälle des Tages.
- **Tests zuerst:** `tests/abwerben.js` (K20e und neu EB1), `tests/karten.js` (K08c), `tests/transfers.js` (K19d).

### 22.11.2026: K29j Trotz Maulkorb (Zweig `mitarbeit/popolupo-k29j-maulkorb-bruch`, auf K07d)

- **Neu (K29 §6):** Steht ein Maulkorb, redet montags mit 15 % ein unzufriedener, mitteilsamer Spieler doch. Folgen wie ein schlechtes Interview, deine Glaubwürdigkeit sinkt um 2. Eigener Strom, nicht unter der Automatik.
- **Tests zuerst:** `tests/presse.js` (neuer Fall K29j, K29i sollte unverändert bleiben).

### 22.11.2026: K07d Erinnerung „Lernplatz frei“ (Zweig `mitarbeit/popolupo-k07d-lernplatz`, auf K18e)

- **Neu (K07 §8):** Vor „Tag beenden“ erinnert das Spiel höchstens einmal je Woche, wenn ein Platz im Einzeltraining frei ist und du Lernziele selbst vergibst. Abschaltbar.
- **Tests zuerst:** `tests/erinnerungen.js` (neuer Fall K07d).

### 22.11.2026: K18e Scout liegt daneben (Zweig `mitarbeit/popolupo-k18e-scout-daneben`, auf K18d)

- **Neu (K18 §8):** Beim Kauf merkt sich das Spiel deine Einschätzung. Ist der Spieler bei dir und war er mindestens 5 schwächer als die Mitte der Einschätzung, kommt am nächsten Montag „Scout lag daneben“.
- **Tests zuerst:** `tests/scouting.js` (neuer Fall K18e).

### 22.11.2026: K18d Konkurrenz am Tisch (Zweig `mitarbeit/popolupo-k18d-konkurrenz-tisch`, auf K06b)

- **Neu (K18 §8):** Nach einem Scoutbericht hat mit 25 % ein deutscher Verein mit Bedarf den Spieler ebenfalls beobachtet. Meldung, und der Verein des Spielers verlangt 60 Tage lang 5 % mehr von dir. Fest aus dem Seed, ohne Würfel.
- **Tests zuerst:** `tests/scouting.js` (neuer Fall K18d).

### 22.11.2026: K06b „Der Gegner hat dich durchschaut“ (Zweig `mitarbeit/popolupo-k06b-durchschaut`, auf den Korrekturen EA)

- **Neu (K06 §8):** Verlierst du ein Ligaspiel mit deinem Lieblingsstil gegen den Stil, der ihn schlägt, kommt eine Meldung. Nur wenn du den Stil selbst wählst, ohne Würfel.
- **Tests zuerst:** `tests/taktik.js` (neuer Fall K06b am Ende, eigene Welt).

### 22.11.2026: Korrekturen nach Prüfung EA zu K09c, K19d und K21b (Zweig `mitarbeit/popolupo-ea-korrekturen`, auf K08c)

- Ein lesender Prüf-Agent hat K09c, K19d, K21b und die Korrekturen DZ durchgesehen (Konsistenzprüfung EA). Drei mittlere Funde, kein blockierender.
- **Behoben:**
  - EA1 bis EA3 (Vereinsstrafe): Meldung und Halt „Frist“, mehrere Karten zugleich, nur für Rote Karten bei deinem Verein.
  - EA4, EA5 (Weiterverkaufsbeteiligung): Nur der Käufer, der sie zugesagt hat, zahlt; jeder andere Wechsel und der Rückkauf beenden sie ohne Zahlung. Gilt auch für das gelockte Talent aus K08c.
  - EA6, EA7 (Teamprämie): Buchung „Prämien“ (in der Finanzprognose), Text nach Jobwechsel, Wirkung nur in der Saison.
- **Tests zuerst:** `tests/disziplin.js` (K09c und neu EA1 bis EA3), `tests/transfers.js` (K19d mit fremdem Verkauf und Rückkauf), `tests/vertraege.js` (K21b).

### 22.11.2026: K08c Großer Verein lockt dein Talent (Zweig `mitarbeit/popolupo-k08c-talent-gelockt`, auf K08b)

- **Neu (K08 §8):** Karte für ein Talent ab 17 aus deiner Jugend, das ein Verein mit deutlich mehr Ansehen will. Profivertrag holt ihn in den Kader, ziehen lassen schickt ihn wirklich zu diesem Verein, mit Ausbildungsentschädigung und 15 % Weiterverkaufsbeteiligung.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K08c und Katalog).

### 22.11.2026: K08b Talent zum Probetraining (Zweig `mitarbeit/popolupo-k08b-probetraining`, auf K20e)

- **Neu (K08 §8):** Karte „Talent zum Probetraining“. Einladen kostet 5.000 € (3. Liga, nach Liga mehr), mit 60 % kommt ein 16-Jähriger mit Talent des Jahrgangs + 6 in deinen Jugendkader (neue Kartenwirkung `talent`).
- **Tests zuerst:** `tests/karten.js` (neuer Fall K08b und Katalog).

### 22.11.2026: K20e Computer-Vereine werben ab (Zweig `mitarbeit/popolupo-k20e-ki-abwerben`, auf K07c)

- **Neu (K20 §7):** Montags mit 4 % macht ein Verein mit Bedarf einen deiner Leistungsträger unruhig (Wechselwunsch eine Stufe höher). Mit 50 % fliegt es auf, dann entscheidest du im Büro: zur Rede stellen, öffentlich machen oder unverkäuflich. Nur, wenn du die Transfers selbst führst, eigener Strom.
- **Tests zuerst:** `tests/abwerben.js` (neuer Fall K20e), `tests/lizenz.js` wie bisher.

### 22.11.2026: K07c Trainingskarten (Zweig `mitarbeit/popolupo-k07c-trainingskarten`, auf den Korrekturen DZ)

- **Neu (K07 §8):** Karte „Spieler bittet um Pause“ (müder, professioneller Spieler; neue Wirkung `pause`: Frische +15, Spielpraxis −5) und Meldung „Verletzungsserie“ (drei Trainingsverletzungen in 14 Tagen). Die Rangelei gibt es schon in der Kabine.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K07c, Fall 1 prüft die neue Wirkung im Katalog).

### 22.11.2026: Korrekturen nach Prüfung DZ zu K11d, K10b, K10c und K10d (Zweig `mitarbeit/popolupo-dz-korrekturen`, auf K21b)

- Ein lesender Prüf-Agent hat K11d, K10b, K10c, K10d und die Korrekturen DY durchgesehen (Konsistenzprüfung DZ). Ein mittlerer Fund, kein blockierender.
- **Behoben:**
  - DZ1 (mittel): Die Erinnerung „spielfreie Woche“ kam am letzten Spieltag. Jetzt nur, wenn danach noch ein Pflichtspiel kommt.
  - DZ2, DZ3: Zweite Meinung mit richtigem Text am letzten Tag und wahrer Dauer aus dem Zähler.
  - DZ4: Die Fehldiagnose überlappt die erste Einschätzung.
  - DZ5: Saisonbilanz hält die Ausfalltage beim Saisonende fest.
  - DZ6: Die zweite Meinung zählt als Gelegenheit für die Lizenzaufgabe.
- **Tests zuerst:** `tests/erinnerungen.js` (K11d mit letztem Spieltag), `tests/medizin.js` (K10b, K10c).

### 22.11.2026: K21b Teamprämie (Zweig `mitarbeit/popolupo-k21b-teampraemie`, auf K19d mit der Doku-Berichtigung zu K12a und K28)

- **Neu (K21 §3.2):** In der Kabine wählst du bis zum ersten Ligaspiel die Teamprämie „normal“ oder „hoch“ (ab A-Lizenz). Hoch kostet je Ligasieg 15.000/4.000/1.000 € je Spieler und hebt den Baustein Erfolg der Stimmung um 2. Ohne Wahl „normal“ ohne Wirkung, wie bei Automatik und Computer-Vereinen.
- **Tests zuerst:** `tests/vertraege.js` (neuer Fall K21b), dazu `tests/kabine.js` und `tests/lizenz.js` wie bisher (der Baustein ändert sich ohne Wahl nicht).

### 22.11.2026: K19d Weiterverkaufsbeteiligung (Zweig `mitarbeit/popolupo-k19d-weiterverkauf`, auf K09c)

- **Neu (K19 §5.2):** Bei einem Angebot eines deutschen Vereins gibt es neben „Annehmen“ den Knopf „Mit 15 % Weiterverkauf“. Der Käufer zahlt 3 % weniger. Verkauft er den Spieler später mit Ablöse weiter (auch ins Ausland), bekommt dein Verein 15 % davon, einmal.
- **Tests zuerst:** `tests/transfers.js` (neuer Fall K19d).

### 22.11.2026: K09c Vereinsstrafe (Zweig `mitarbeit/popolupo-k09c-vereinsstrafe`, auf K10d)

- **Neu (K09 §5.2, K14 §6):** Nach einem Urteil gegen deinen Spieler fragt eine Karte im Büro, ob er eine interne Geldstrafe zahlt (je Spiel Sperre 20.000/8.000/3.000 € nach Liga, Antwort binnen 3 Tagen). Verhängen: Geld, Stimmung −6, Glaubwürdigkeit +2. Verzichten: Stimmung +3, Glaubwürdigkeit −1. Nicht unter der Automatik.
- **Tests zuerst:** `tests/disziplin.js` (neuer Fall K09c, eigene Welt).

### 22.11.2026: Korrekturen nach Prüfung DY zu K34d, K31c, K30b und K36c (Zweig `mitarbeit/popolupo-k10d-ausfall-bilanz`, zweiter Commit)

- Ein lesender Prüf-Agent hat K34d, K31c, K30b, K36c und die Korrekturen DX durchgesehen (Konsistenzprüfung DY). Er fand keinen blockierenden und keinen mittleren Fehler.
- **Behoben:**
  - DY1 bis DY4 (Stab-Meldungen): `try`/`finally` im Tageslauf, Sammeln auch beim Saisonwechsel, rote Farbe bleibt, besserer Test.
  - DY5: Jeder neue Rekordtransfer wird gemeldet.
  - DY6: kein „Konkurrent rüstet auf“ mit deinem eigenen Spieler.
  - DY7, DY8: Test K30b kann scheitern, Entscheidungskarten ohne Halt fallen nie weg.
  - DY9: Text der Gegnerbeobachtung nach der Regel.
- **Tests zuerst:** `tests/lizenz.js` (K36c), `tests/karten.js` (K30b und Fall 7), `tests/statistik.js` (K34d), `tests/transfers.js` (K31c).

### 22.11.2026: K10d Ausfalltage in der Saisonbilanz (Zweig `mitarbeit/popolupo-k10d-ausfall-bilanz`, auf K10c)

- **Neu (K10 §12 Nr. 15):** Die Saisonbilanz nennt Verletzungen und Ausfalltage deines Vereins mit dem Ligaschnitt.
- **Tests zuerst:** `tests/medizin.js` (neuer Fall K10d).

### 22.11.2026: K10c Zweite Meinung (Zweig `mitarbeit/popolupo-k10c-zweite-meinung`, auf K10b)

- **Neu (K10 §5):** In der Verletztenliste gibt es nach der Diagnose den Knopf „Zweite Meinung“ (einmal je Verletzung, 15.000/8.000/4.000 € je Liga). Er deckt eine Fehldiagnose auf, mit 20 % verkürzt eine andere Behandlung den Rest der Pause um 15 %, mit 5 % wird sie länger, sonst wird die Spanne enger. Eigener Strom, nur auf deinen Klick.
- **Tests zuerst:** `tests/medizin.js` (neuer Fall K10c).

### 22.11.2026: K10b Fehldiagnose (Zweig `mitarbeit/popolupo-k10b-fehldiagnose`, auf K11d)

- **Neu (K10 §12 Nr. 9):** Bei deinem Verein ist die genaue Diagnose ab 10 Tagen Ausfall manchmal zu optimistisch (ohne guten Arzt öfter). Fehlt der Spieler am Ende der angezeigten Spanne noch, kommt „Rückschlag“ mit der richtigen Spanne. Nur Anzeige, fest aus dem Seed, ohne Würfel aus den Strömen.
- **Tests zuerst:** `tests/medizin.js` (neuer Fall K10b, Fall 8 „ehrliche Spanne“ sollte unverändert über 85 % liegen).

### 22.11.2026: K11d Erinnerung „spielfreie Woche ohne Testspiel“ (Zweig `mitarbeit/popolupo-k11d-spielfrei-erinnerung`, auf K36c)

- **Neu (K01 H9, K11 §3):** In der Saison erinnert das Spiel vor „Tag beenden“, wenn in den sieben Tagen ab dem frühesten Testspieltag kein Pflichtspiel und kein Testspiel liegt, aber eines möglich wäre. Nicht unter der Automatik, nicht im Urlaub, höchstens einmal je Woche, im Menü abschaltbar.
- **Tests zuerst:** `tests/erinnerungen.js` (neuer Fall K11d).

### 22.11.2026: Korrekturen nach Prüfung DX zu U19e, K31b und DW (Zweig `mitarbeit/popolupo-k36c-stabbericht`, zweiter Commit)

- Ein lesender Prüf-Agent hat U19e, K31b und die Korrekturen DW durchgesehen (Konsistenzprüfung DX). Er fand keinen blockierenden und keinen mittleren Fehler.
- **Behoben:**
  - DX1: Nach einem Jobwechsel sind alle Testspiele des alten Vereins weg, Tag 2 eines neuen Turniers bleibt reserviert.
  - DX2: Das Fenster der Spielvorbereitung steht als `RTA.vorbereitungTage` in den Regeln, Engine und Gegnerbeobachtung nutzen denselben Helfer.
  - DX3, DX4: Tests K11b und neu DW5 in `tests/vorstand.js`.
  - DX5, DX6: Texte (Häufigkeit der Europapokal-Karten je Karte, Hinweis unter „Bedarf anderer Vereine“).
- **Tests zuerst:** `tests/testspiele.js`, `tests/vorstand.js` (DW5), `tests/scouting.js`, dazu `tests/taktik.js` wie bisher (die Engine rechnet gleich).

### 22.11.2026: K36c Meldungen des Stabs gesammelt (Zweig `mitarbeit/popolupo-k36c-stabbericht`, auf K30b)

- **Neu (K36 §8, Nr. 27):** Meldungen des Stabs aus einem Tageslauf kommen gesammelt. Eine bleibt eine eigene Zeile, mehrere werden eine Zeile „Der Stab meldet n Entscheidungen: …“. Vorläufig je Tageslauf statt je Woche, damit nichts zu spät kommt. Außerhalb der Tagesläufe kommt sie sofort wie bisher.
- **Tests zuerst:** `tests/lizenz.js` (neuer Fall K36c am Ende, die übrigen Fälle sollten unverändert bleiben, besonders der Sponsor in Fall 3).

### 22.11.2026: K30b Meldungsdichte (Zweig `mitarbeit/popolupo-k30b-meldungsdichte`, auf K34d)

- **Neu (K30 §5.1, K35a):** Im Menü stellst du ein, wie oft Ereigniskarten dich anhalten: wenig (eine Entscheidung je zwei Wochen, 3 Infos), normal (wie bisher), viel (zwei je Woche, 8 Infos). Die Karten kommen gleich oft, den Rest entscheidet der Co-Trainer.
- **Tests zuerst:** `tests/karten.js` (neuer Fall K30b, dazu Fall 5 und 7 wie bisher).

### 22.11.2026: K31c „Konkurrent rüstet auf“ (Zweig `mitarbeit/popolupo-k34d-rekordtransfer`, zweiter Commit)

- **Neu (K31 §8):** Holt ein Verein deiner Liga einen Star (Sternejagd), steht das als Meldung da. Nur eine Meldung, damit der Gleichschritt hält.
- **Tests zuerst:** `tests/transfers.js` (neuer Fall K31c).

### 22.11.2026: K34d Rekordtransfer mit echtem Startwert (Zweig `mitarbeit/popolupo-k34d-rekordtransfer`, auf U19e)

- **Neu (K34 §5.6):** Der Rekordtransfer beginnt mit dem echten: Harry Kane, 2023 für etwa 95 Mio. € von Tottenham zu Bayern. Ein teurerer Zugang im Spiel wird sofort gemeldet. Alte Spielstände bekommen den Startwert einmal nachträglich.
- **Tests zuerst:** `tests/statistik.js` (neuer Fall K34d).

### 22.11.2026: Korrekturen nach Prüfung DW zu U12l, K18c, K11b und K11c (Zweig `mitarbeit/popolupo-u19e-europa-karten`, dritter Commit)

- Ein lesender Prüf-Agent hat die vier Schritte und die Korrekturen DV durchgesehen (Konsistenzprüfung DW). Er fand keinen blockierenden Fehler.
- **Behoben:**
  - DW1, DW6, DW7 (Sommerturnier): Tag 2 ist ab der Anmeldung belegt, Turniere erst ab der 3. Woche, keine Zuschauereinnahmen im Turnier.
  - DW2 bis DW4 (Einladungen): gelten nur in ihrer Saison und für ihren Verein, der Termin passt auch bei einer Antwort am letzten Tag, Halt „Frist“ an diesem Tag.
  - DW5: Das Zielgespräch nennt wieder die richtigen Prozente, wenn vorher das Budgetgespräch geklappt hat.
  - DW8: Die Gegnerbeobachtung kostet nichts mehr, wenn sie nichts bringt (Videoanalyst, keine Spielvorbereitung).
  - DW9: Kommentar, zwei Zahlen in die Regeln.
- **Tests zuerst:** `tests/testspiele.js` (K11b, K11c), `tests/scouting.js` (K18c, DW8), `tests/vorstand.js`.

### 22.11.2026: K31b Bedarf anderer Vereine (Zweig `mitarbeit/popolupo-u19e-europa-karten`, zweiter Commit)

- **Neu (K31 §6):** Auf der Karte deines Spielers steht, welche deutschen Vereine ihn brauchen und bezahlen könnten. Das sind genau die Vereine, von denen auf der Transferliste Angebote kommen dürfen. Vereine mit einer Lücke zahlen mehr und stehen vorn, dazu die Zahl möglicher Käufer im Ausland. Reine Anzeige, kein Würfel.
- **Tests zuerst:** `tests/transfers.js` (neuer Fall K31b).

### 22.11.2026: U19e Europapokal-Karten (Zweig `mitarbeit/popolupo-u19e-europa-karten`, auf K11c)

- **Neu (K37 §8):** vier Ereigniskarten zum Europapokal.
  - Fanmarsch und Reisechaos vor einem Auswärtsspiel bei einem Auslandsverein.
  - Pyrotechnik mit UEFA-Strafe nach einem Europapokalspiel.
  - „Ein Wunder“ als Meldung, wenn du nach mindestens zwei Toren Rückstand im Hinspiel weiterkommst.
- **Dosierung wie alle Karten**, darum selten. Ein Vorschlag für eine eigene Rate steht in K37 §12 Nr. 21.
- **Tests zuerst:** `tests/karten.js` (neuer Fall U19e und das Prüfskript für den Katalog, Fall 1).

### 22.11.2026: K11c Testspiel-Anfragen der Computer-Vereine (Zweig `mitarbeit/popolupo-k11c-testspiel-anfragen`, auf K11b)

- **Neu (K11 §5):** In der Vorbereitung lädt montags mit 35 % ein Verein deines Niveaus dich zu einem Auswärtstestspiel ein. Du sagst im Training binnen 3 Tagen zu oder ab. Nicht in der Automatik, eigener Strom.
- **Tests zuerst:** `tests/testspiele.js` (neuer Fall K11c).

### 22.11.2026: K11b Sommerturnier (Zweig `mitarbeit/popolupo-k11b-sommerturnier`, auf K18c)

- **Neu (K11 §3):** Einmal je Vorbereitung meldest du dich ab der dritten Woche an zwei freien Tagen zu einem Turnier mit vier Vereinen an.
  - Tag 1: Halbfinale als Testspiel. Das andere Halbfinale wird nach Ansehen gerechnet.
  - Tag 2: Finale oder Spiel um Platz 3. Ein Remis entscheidet das Elfmeterschießen.
  - Antrittsgeld und Siegprämie richten sich nach der Liga. Der Pokal kommt in die Vitrine, beim Sieg steigt die Stimmung um 1.
- **Tests zuerst:** `tests/testspiele.js` (neuer Fall K11b), dann ein Sommer im Ablauf mit Turnier.

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
