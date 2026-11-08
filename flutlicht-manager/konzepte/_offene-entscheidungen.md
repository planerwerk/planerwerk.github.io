# Offene und vorläufige Entscheidungen

Stand: 7. November 2026. Automatisch aus Abschnitt 12 aller Konzepte zusammengestellt.

**Alle Punkte gelten, bis du widersprichst** (PLAN §1, Punkt 9). Keiner blockiert die Arbeit.

Am 7.11. habe ich viele Konzepte ohne Rücksprache geschrieben. Wo eine Entscheidung nötig war, habe ich sie getroffen und als „vorläufig“ markiert. Hier stehen alle an einem Ort. Ein kurzes „passt“ oder eine Änderung je Punkt reicht.

**Am wichtigsten, weil sie deine eigenen Regeln oder viel Datenarbeit berühren:**

1. **K12a, Frage 1:** Im Urlaub ohne 7-Tage-Grenze springen (Ausnahme von deiner Regel in PLAN §2).
2. **K32, Frage 1:** Ausland als Vereinsgruppen („England – Spitze“) statt echter Auslandsvereine.
3. **K02, Frage 1:** Zufall getrennt nach Spiel, Tag und Bereich, damit Neuladen kein neues Glück bringt.
4. **K06, Frage 1:** Seiten links und rechts in der Engine getrennt.
5. **K31, Frage 4:** Schwelle „lange schwach“ für deine Verkaufsregel: Notenschnitt 4,5 über die letzten 10 Einsätze.
6. **K09, Frage 1:** Kein „bewusst Gelb abholen“ als Spieleroption.


## K02 – Zufall, Kalibrierung, Schwierigkeit
Datei: `konzepte/K02-zufall-kalibrierung.md`

1. **Zufallsströme nach Spiel, Tag und Bereich** statt eines einzigen Stroms. Vorteil: Neuladen bringt kein neues Glück, Bereiche stören sich nicht, Tests werden genauer. Nachteil: etwas Umbau in `js/zufall.js` und an allen Stellen, die würfeln. Weil alte Spielstände ohnehin nicht weiterleben müssen (PLAN §1, Punkt 9), ist jetzt der günstigste Zeitpunkt.
2. **Drei Stufen** (Leicht, Normal, Schwer). Eine vierte („Legende“, ohne Erinnerungen und mit sehr ungeduldigem Vorstand) kann später dazukommen.
3. **Seed eingeben** beim Start als Option für Fortgeschrittene, versteckt im Startbildschirm.
4. **Rangkorrelation 0,6–0,8** als Maß für „Glück gleicht sich aus“ ist ein geschätzter Startwert. Er sollte mit echten Daten geprüft werden (Marktwert-Rang vor der Saison gegen Abschlusstabelle).

## K04 – Match-Engine
Datei: `konzepte/K04-engine.md`

1. **Links und rechts** (geändert durch K06 §5.7: Seiten getrennt, ohne zusätzliche Regler). Ursprünglich: ein gemeinsamer Bereich „außen“. Getrennte Seiten (unser linker Flügel gegen ihren rechten Verteidiger) wären tiefer, aber teurer im Balancing. Vorschlag: K06 entscheidet, wenn die Grundordnungen stehen.
2. **Schiedsrichter** bekommen vorläufig nur einen Strengefaktor je Spiel. Echte Profile mit Namen und Ruf kommen mit K09, wenn das Sportgericht gebaut wird.
3. **Videobeweis** nur als seltenes Ereignis „Tor aberkannt“ (etwa 3 % der Tore, Zahl prüfen). Keine eigene Mechanik.
4. **Wetter und Rasen** später mit K26 (Rasenqualität, Platzwart). Bis dahin kein Wetter.
5. **Abseits** zählt nur als Statistik und als „Tor aberkannt“, ohne Taktik (Abseitsfalle vielleicht in K06).
6. **Heimvorteil** niedriger als heute (×1,03 statt ×1,04/1,03), weil er in den letzten Jahren gesunken ist. Kalibrierung in K02 entscheidet den Endwert.

## K05 – Live-Spiel
Datei: `konzepte/K05-live-spiel.md`

1. **Konferenz nur bei gleicher Anstoßzeit,** frühere Spiele des Tages optional als Zuschauer vorher (löst I6).
2. **Kein Wechsel für Gehirnerschütterung** in der Bundesliga, bis eine Einführung belegt ist. Stellschraube vorhanden.
3. **Augenzwinkernde Ansprache** als eigene Tonlage mit halber Wirkung, aber besserer Stimmung (We-Are-Football-Idee, eigene Texte).
4. **Live-Stand wird bei jeder Pause gespeichert.**

## K06 – Taktik
Datei: `konzepte/K06-taktik.md`

1. **Seiten getrennt** (5.7). Das ändert die vorläufige Entscheidung in K04 §12, Punkt 1. Grund: Der Fuß und die Positionen links und rechts aus K03 bekommen erst so eine echte Bedeutung, und es kostet keine zusätzlichen Regler.
2. **Keine getrennte Ordnung mit und ohne Ball** wie in FM26. Zu viel Bedienung für den Nutzen.
3. **Vertrautheit je Mannschaft,** nicht je Spieler. Neuzugänge senken sie pauschal. Je Spieler wäre genauer, aber schwer lesbar.
4. **Fünf Stufen der Ausrichtung** statt drei. „Konter“ wandert von der Ausrichtung zum Spielstil.
5. **„Spiel der Saison“ ohne Höchstzahl,** gebremst durch den Kater.
6. **Weggelassen:** Raum- oder Manndeckung, Abseitsfalle, Standardvarianten. Kann später kommen, wenn es sich den Platz verdient.

## K07 – Training
Datei: `konzepte/K07-training.md`

1. **Plan nach Abstand zum Spiel** statt nach Wochentagen. Grund: Spieltage über das Wochenende verteilt und englische Wochen.
2. **Eine Einheit pro Tag,** Doppeleinheiten nur in Vorbereitung und Pausen.
3. **Belastungssprung** als Verletzungsursache, kein „optimaler Bereich“ (Studienlage, siehe 5.4).
4. **Fünf Einzeltrainingsplätze** bis zum Trainerstab (K16).
5. **Trainingsspiel** als eigene Einheit, weil es Reservisten Spielpraxis gibt und in der Community gewünscht wird.

## K08 – Jugend und Talententwicklung
Datei: `konzepte/K08-jugend.md`

1. **Jugendkader ohne simulierte Spiele.** Entwicklung über Training. Spart Rechenzeit und Halte.
2. **Aufrücken spätestens mit 19,** sonst endet der Vertrag.
3. **Leihmanager** als zusätzliche Rolle im Stab in Welle 3 (Community-Wunsch), K16 wird ergänzt.
4. **Talentwerte des Jahrgangs** sind Spielwerte und werden mit K32 so kalibriert, dass die Welt im Gleichgewicht bleibt.

## K09 – Disziplin und Sportgericht
Datei: `konzepte/K09-sportgericht.md`

1. **Kein „bewusst Gelb abholen“** als Spieleroption. Es wäre ein Exploit und ist im echten Fußball strafbar.
2. **Liga-Rotsperren gelten vorläufig nur in der Liga,** Pokal-Rotsperren nur im Pokal (auch in der nächsten Pokalsaison). Ob eine Liga-Rotsperre auch für den Pokal gilt, muss noch geprüft werden.
3. **Relegation** zählt vorläufig zur Liga: Gelbe Karten und Sperren aus der Liga gelten dort (prüfen).
4. **Trainer-Karten** mit Sperre nach der 4. Gelben (Zahl prüfen) und Tribüne als Folge.
5. **Einspruch-Ausgänge** sind Spielwerte, nicht recherchiert.

## K10 – Medizin und Verletzungen
Datei: `konzepte/K10-medizin.md`

1. **Krankheiten** zählen als eigener Ausfall mit Ansteckung, getrennt von den Verletzungszielen.
2. **Fit spritzen** nur bei wenigen Arten, mit Verschlimmerungsrisiko statt festem Verbot.
3. **Verletzungsverlauf** wird zwei Jahre gespeichert. Das reicht für Rückfälle und Hinweise, ohne den Spielstand aufzublähen.

## K11 – Freundschaftsspiele und Trainingslager
Datei: `konzepte/K11-testspiele.md`

1. **Testspiele ohne Halt** als Standard, live nur auf Wunsch.
2. **Erfundene Gegner** für Amateure, Auslandsvereine und Turniere. Echte Profivereine aus 1. bis 3. Liga als Testspielgegner, weil sie ohnehin im Spiel sind.
3. **Reale Regionen** als Lager-Orte (Alpen, Algarve und so weiter), aber keine echten Hotels oder Marken.
4. **Alle Geldbeträge sind Spielwerte,** nicht recherchiert. Kalibrierung mit K23.

## K12a – Sommerpause und Vorbereitung
Datei: `konzepte/K12a-sommer.md`

1. **Springen im Sommer ohne 7-Tage-Grenze.** Das weicht von deiner Regel „höchstens 7 Tage“ (PLAN §2) ab, aber nur in Urlaub und Laufplan, und es hält trotzdem bei jedem Ereignis. **Das solltest du bestätigen,** weil es eine deiner Entscheidungen berührt.
2. **Saisonbelastung** als neuer verdeckter Wert in K03. Ohne ihn hat die Urlaubslänge vor K14 kaum Folgen.
3. **Urlaub für die ganze Mannschaft,** nicht je Spieler. Ausnahme: Turnierteilnehmer.
4. **Laufplan** passiert automatisch und hängt an der Professionalität. Keine eigene Planung.

## K13 – Wettbewerbe und Spielplan
Datei: `konzepte/K13-wettbewerbe.md`

1. **Supercup** kommt dazu, weil er klein ist und den Saisonstart belebt.
2. **Pokal-Heimrecht** für Unterklassige bis einschließlich Halbfinale (für Runde 1 belegt, spätere Runden prüfen).
3. **Spielverlegung ab 3 Abgestellten** als Spielwert (echte Schwelle nicht gefunden).
4. **Zweitmannschaft muss absteigen,** wenn die erste in ihre Liga fällt (echte Regel prüfen).
5. **Nationen-Tabelle** als neue Datei, grob nach Weltrangliste, gepflegt wie die anderen Stammdaten.

## K14 – Stimmung, Selbstvertrauen, Kabine
Datei: `konzepte/K14-kabine.md`

1. **Kaderrollen** mit fester Erwartung an Einsatzzeit und eigener Einschätzung des Spielers. Das macht Unzufriedenheit nachvollziehbar.
2. **Zusammenhalt** als eigener Teamwert neben der taktischen Vertrautheit (K06): das eine ist Chemie, das andere Taktik.
3. **Stimmung wirkt wenig auf die Leistung** (−3 % bis +2 %), aber stark auf Training, Verträge und Wechselwünsche.
4. **Teamevent** als einfacher Hebel mit Abnutzung.

## K15 – Gespräche und Ansprachen
Datei: `konzepte/K15-gespraeche.md`

1. **Kurze Gespräche:** Thema, Haltung, höchstens eine Rückfrage. Keine Dialogbäume.
2. **Drei Einzelgespräche pro Woche** als Grenze gegen Dauerklicken.
3. **Glaubwürdigkeit je Mannschaft,** nicht je Spieler. Gebrochene Versprechen sprechen sich herum.
4. **Computer-Vereine** nur vereinfacht.

## K16 – Trainerstab und Mitarbeiter
Datei: `konzepte/K16-stab.md`

1. **Acht Rollen in Welle 2** (Co-Trainer, Torwart-, Athletik-, Standardtrainer, Arzt, Physiotherapeut, Videoanalyst, Psychologe). Scouts, Jugend, Sportdirektor und Pressesprecher kommen mit ihren Konzepten.
2. **Kein Ernährungsberater, kein Platzwart** als eigene Rolle. Der Platzwart gehört zu K26 (Rasen), Ernährung steckt im Athletiktrainer.
3. **Co-Trainer ist Pflicht.** Ohne ihn gäbe es keine Automatik und keine Halbzeit-Einschätzung.
4. **Trainerteam mitnehmen** bis zu zwei Personen.
5. **Gehälter sind Spielwerte,** Kalibrierung mit K23.

## K17 – Beziehungsnetz
Datei: `konzepte/K17-beziehungen.md`

1. **Persönliche Beziehungen wandern mit dir,** die des Vereins bleiben beim Verein.
2. **Derbys als Stammdaten** mit festem Grundwert −30.
3. **Keine Beziehung zu einzelnen Fans oder Fangruppen hier,** das gehört zu K27.

## K18 – Scouting und Informationsnebel
Datei: `konzepte/K18-scouting.md`

1. **Kenntnis je Spieler gespeichert,** nur wenn über dem Grundwert. Das hält den Spielstand klein.
2. **Ehrliche Spannen** auch bei schlechten Scouts: breiter statt falsch.
3. **Lieblingstyp der Scouts** als kleine Persönlichkeit.
4. **Kosten sind Spielwerte,** Kalibrierung mit K23.

## K19 – Transfers I
Datei: `konzepte/K19-transfers.md`

1. **Eine Formel für alle Vereine** beim Kaufen und Verkaufen, Ausreißer nur aus Schätzfehlern.
2. **Unverkäuflich ist nie absolut:** ab dem 1,8-Fachen wird verhandelt.
3. **Fenster** nach den echten Terminen 2026/27, danach verschoben wie die übrigen Termine.
4. **Abwerben, Bieterwettstreit im Detail und Deadline Day** bleiben in K20 (Welle 4).

## K21 – Verträge und Gehälter
Datei: `konzepte/K21-vertraege.md`

1. **Höchstens drei Verhandlungsrunden,** danach vier Wochen Pause.
2. **Teamprämien** legt der Verein für alle fest, individuelle Prämien stehen im Vertrag.
3. **Abstiegsklausel** in zwei Formen (Kürzung oder Ausstiegsrecht).
4. **Weiterverkaufsbeteiligung** kommt mit K19.

## K22 – Berater
Datei: `konzepte/K22-berater.md`

1. **Fünf Profile,** darunter Strippenzieher und Familienberater als eigene Typen.
2. **Provisionen als Spielwerte.** Die echten Regeln (FIFA-Beraterreglement, Rechtsstreit um Obergrenzen) sind nicht geprüft und für das Spiel nicht nötig.

## K28 – Vorstand, Ziele, Karriere
Datei: `konzepte/K28-vorstand.md`

1. **Ultimatum vor der Entlassung** statt sofortigem Rauswurf an der Grenze.
2. **Vertrauen mit Bausteinen und Trägheit,** die Werte je Spiel bleiben mit halbem Gewicht.
3. **Nach dem Aufstieg immer Klassenerhalt** als Standardziel.
4. **Trainergehalt nur als Statistik.**

## K30 – Ereigniskarten und Story-Playbook (Gerüst)
Datei: `konzepte/K30-ereigniskarten.md`

1. **Computer-Vereine ohne Karten,** ihre Geschichten kommen über die Presse.
2. **Entscheidungskarten über dem Budget** kommen als Info, der Mitarbeiter entscheidet (Automatik).
3. **Katalog wächst mit den Konzepten,** K30 hält nur die Übersicht.

## K31 – Computer-Vereine
Datei: `konzepte/K31-computer-vereine.md`

1. **Planstellen nach Gruppen** der 14 Positionen statt je einzelner Position.
2. **Sechs Profile,** je Verein ein bis zwei, als Stammdaten.
3. **Klugheit gilt für alle Computer-Vereine gemeinsam** (eine Stufe je Spielstand, K02).
4. **„Note über 10 oder mehr Einsätze schlechter als die Schwelle“** aus deinen Vorgaben: Schwelle vorläufig 4,5 im Notenschnitt der letzten 10 Einsätze.

## K32 – Spielwelt und Saisonwechsel
Datei: `konzepte/K32-spielwelt.md`

1. **Ausland als Vereinsgruppen ohne echte Vereinsnamen** („England – Spitze“). Echte Auslandsvereine wären stimmungsvoller, kosten aber viel Datenpflege. Kann später kommen. **Das solltest du entscheiden.**
2. **Keine automatische Nachregelung** der Weltstärke im Spiel. Das Gleichgewicht wird über Tests kalibriert (K02: kein Gummiband).
3. **Zwölf Länder** im Pool, Nationen-Tabelle für alle Länder der Welt (für Nationalitäten der Spieler).

