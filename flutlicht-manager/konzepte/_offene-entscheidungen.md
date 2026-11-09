# Offene und vorläufige Entscheidungen

Stand: 8. November 2026. Automatisch aus Abschnitt 12 aller Konzepte zusammengestellt.

**Alle Punkte gelten, bis du widersprichst** (PLAN §1, Punkt 9). Keiner blockiert die Arbeit.

Am 7.11. habe ich viele Konzepte ohne Rücksprache geschrieben. Wo eine Entscheidung nötig war, habe ich sie getroffen und als „vorläufig“ markiert. Hier stehen alle an einem Ort. Ein kurzes „passt“ oder eine Änderung je Punkt reicht.

**Am wichtigsten, weil sie deine eigenen Regeln oder viel Datenarbeit berühren:**

1. **K12a, Frage 1:** Im Urlaub ohne 7-Tage-Grenze springen (Ausnahme von deiner Regel in PLAN §2).
2. ~~K32, Frage 1~~ **entschieden 8.11.:** echte Auslandsvereinsnamen, Spieler erzeugt.
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

## K03 – Spielermodell (Umsetzung U3)

1. **Platz für Stärken nach Klasse:** Ein Spieler hat bis Stärke 64 Platz für 1 Stärke, bis 74 für 2, bis 84 für 3, darüber für 4 (`lernen.platz`). Ohne diese Grenze stieg die Zahl der Stärken in sechs Saisons von 0,9 auf 3,2 pro Spieler, weil alle Vereine lernen und niemand verlernt. Mit der Grenze pendelt sie sich bei etwa 1,8 ein.
2. **Startverteilung im Gleichgewicht:** Neue Spieler bekommen gleich so viele Stärken, wie sich auf Dauer einstellen (etwa 1 bis Stärke 64, 2 bis 74, 3 bis 84, sonst 3–4). Sonst würde die Welt in den ersten Saisons merklich „besser“.
3. **Lerntempo halbiert:** leicht 6 %, mittel 3 %, schwer 1,5 % pro Woche (etwa 17, 33 und 67 Wochen). So haben aufstrebende Spieler länger etwas zu lernen und das Lernziel bleibt eine echte Entscheidung.
4. **Fünf Lernplätze je Verein** (K07 §12 Nr. 4) auch für Computer-Vereine. Der Co-Trainer gibt freie Plätze den jüngsten Spielern. Wählst du selbst ein Ziel und alle Plätze sind belegt, gibt der Spieler mit dem geringsten Fortschritt unter den vom Co-Trainer gewählten seinen Platz ab.
5. **Lernen im Spiel:** Ein Erfolg baut auch den Fortschritt zur passenden Schwäche ab. Fortschritt zu einer Schwäche verjährt um 1 % pro Woche. Sonst wurde fast jeder Spieler mit vielen Karten über die Jahre „ungestüm“.
6. **Fehlerkonto nur dort, wo Fehlschläge selten sind:** Es sinkt bei verschossenen Elfmetern (−25), verlorenen Kopfballduellen vor einem Gegentor (−10), Fehlgriffen des Torwarts (−25) und vergebenen Großchancen (−5). Bei Freistößen und Fernschüssen geht der Großteil daneben, dort kostet ein Fehlschuss nichts.
7. **Kopfballduell vor einem Gegentor** verliert der schwächste Verteidiger auf dem Platz. Einen Fehlgriff des Torwarts gibt es bei 30 % der Kopfballgegentore.
8. **Altersverlust:** Professionalität wirkt mit dem Faktor 1,5 − 0,05 × P (P 20: halb so oft, P 10: wie beschrieben). „langsam“ kommt ab 33 nur bei Feldspielern ohne „schnell“.

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

Bei der Umsetzung (U4a):
5. **Keine Nachspielzeit** als eigene Minuten. Die Anzeige kann sie später zeigen, gespielt werden 90 (bzw. 120) Minuten. „Zeit schinden“ wirkt deshalb nur über weniger Angriffe und Gelbe Karten.
6. **In der Halbzeit** wirken Ausrichtung und Einsatz sofort, die Grundordnung nach 5 Minuten, mit „Taktik betonen“ ebenfalls sofort.
7. **„Sehr offensiv“ und „offensiv“ greifen auch öfter an** (×1,10 bzw. ×1,05, defensiv entsprechend seltener), nicht nur gefährlicher. Sonst brachte „alles nach vorn“ bei 0:1 in der 70. Minute nur 2 Prozentpunkte mehr Punktchance (Ziel 3–8), jetzt etwa 5.
8. **Computer-Trainer** wechselt im Fenster 55.–86. Minute mit 13 % je Minute bis zu zwei Spieler je Gelegenheit: zuerst Verletzte (sofort), dann Müde (Frische unter 65 %), Spieler mit Gelb, und frische Beine (Frische unter 93 %), aber nur, wenn der Ersatz höchstens 6 Punkte schlechter ist als der müde Spieler auf dem Platz. Ergebnis: 4,3–4,5 Wechsel je Team, 98 % zwischen der 55. und 85. Minute. Die Bundesliga lag 2023/24 bei etwa 9,1 Wechseln je Spiel, also gut 4,5 je Team (The Analyst, Stand März 2024).
9. **Verletzte humpeln** bis zum Wechsel weiter (Frische höchstens 30 %). Ohne freien Wechsel spielen sie verletzt zu Ende.
10. **Zuruf an einen Spieler** (bis K15): Lob +2 % für 10 Minuten und Selbstvertrauen +0,3. Kritik: Kämpfer +3 %, Diva oder nervenschwach −2 % und Selbstvertrauen −0,3, Hitzkopf +1 % und 50 % mehr Fouls, alle anderen +1 % und Selbstvertrauen −0,15.
11. **Kurzeinsätze unter 20 Minuten** bekommen keine Note und ändern die Form nicht, zählen aber als Einsatz und für die Spielpraxis.
12. **Vorspulen** („bis zur Halbzeit“, „zum Abpfiff“) übergibt deine Entscheidungen für diese Zeit an den Co-Trainer. Er wechselt dann auch Verletzte und Müde.
13. **Elfmeter halten erst nach der Ausführung an** (Treffer über „Tor“, Fehlschuss über „Elfmeter“). Den Schützen vorher zu ändern, braucht die Schützenliste aus K06 (U5).
14. **Gelb-Rot-Gefahr** hält nur bei verwarnten Abwehrspielern, Sechsern, Ungestümen und Hitzköpfen an. Mit jeder Gelben Karte wären es im Schnitt 6 Halte pro Spiel, jetzt etwa 5,5 (Ziel 3–6).
15. **Halbzeit-Einschätzung des Co-Trainers:** schwächster und stärkster Bereich im Vergleich zum Gegner und wer schon platt ist, immer zutreffend, bis K16 die Genauigkeit an seine Qualität bindet.
16. **Frühere Spiele des Tages als Zuschauer** (4.1) sind noch nicht gebaut. Sie erscheinen in der Konferenz mit Endstand.
17. **Elfmeterschießen** endet, sobald eine Mannschaft uneinholbar führt (wie im echten Spiel). Vorher wurden immer fünf Schüsse je Seite gerechnet.

## K06 – Taktik
Datei: `konzepte/K06-taktik.md`

1. **Seiten getrennt** (5.7). Das ändert die vorläufige Entscheidung in K04 §12, Punkt 1. Grund: Der Fuß und die Positionen links und rechts aus K03 bekommen erst so eine echte Bedeutung, und es kostet keine zusätzlichen Regler.
2. **Keine getrennte Ordnung mit und ohne Ball** wie in FM26. Zu viel Bedienung für den Nutzen.
3. **Vertrautheit je Mannschaft,** nicht je Spieler. Neuzugänge senken sie pauschal. Je Spieler wäre genauer, aber schwer lesbar.
4. **Fünf Stufen der Ausrichtung** statt drei. „Konter“ wandert von der Ausrichtung zum Spielstil.
5. **„Spiel der Saison“ ohne Höchstzahl,** gebremst durch den Kater.
6. **Weggelassen:** Raum- oder Manndeckung, Abseitsfalle, Standardvarianten. Kann später kommen, wenn es sich den Platz verdient.

Bei der Umsetzung (U5a):
7. **Felder im Spielstand:** `form`, `tac`, `ein` bleiben, dazu am Verein `stil`, `vt` (Vertrautheit), `rollen` (je Grundordnung), `einstellung`, `schuetzen`, `kater`, im Spielstand `stilVerlauf`. Ein gemeinsames Objekt `t.taktik` wie in 3.5 hätte nur umbenannt.
8. **Stile ausbalanciert** mit einer Stil-Matrix (gleich starke Teams, volle Umsetzung): Ballbesitz Kontrolle 1,13 und Angriffe 0,90, Pressing Angriffe 1,07 und Konter gegen sich 1,35, Mauern Kontrolle 0,88, Angriffe 0,85, eigene Konter 1,0, Abwehr 1,10, Konter mit eigenen Kontern 2,1 und Angriffen 0,88, Flügelspiel +15 statt +25 Prozentpunkte außen. Mit den Startwerten war Ballbesitz klar am stärksten, Konter schlug Pressing nicht.
9. **Kreislauf mit Dämpfung:** Wer im Kreislauf verliert, verliert zusätzlich 80 % seiner Stil-Vorteile (× Umsetzung des Siegers). Mit nur +6 % Chancen für den Sieger gewann Pressing gegen Ballbesitz nicht öfter als gegen Pressing.
10. **Kreislauf-Test** als Mittel über die vier Paare (Ziel 3–8 Prozentpunkte, jedes Paar positiv), weil die Stile verschieden stark sind und ein einzelnes Paar die Grundstärke mitmisst. Ergebnis etwa +7.
11. **Kater:** 10 Tage und ×0,955, damit er das nächste Wochenendspiel trifft. Mit 7 Tagen und ×0,97 hätte „Spiel der Saison“ jede Woche nichts gekostet.
12. **Computer-Trainer** wählen zwischen den Stilen ihrer Lage nach Umsetzung und Kreislauf gegen den Stil des Gegners (Gewicht 0,3). Ohne das mauerten Außenseiter gegen Ballbesitz und verloren den Kreislauf, die Favoriten gewannen 80 % gegen die Letzten. Ihre Grundordnung prüfen sie alle vier Wochen, nicht jede Woche (Rechenzeit). „Spiel der Saison“ im Pokal ab dem Viertelfinale und in der Relegation, Derbys folgen mit K31.
13. **Lieblingsstil** jedes Vereins per Zufall (ausgewogen dreifach gewichtet), bis K31 Vereinsprofile bringt. Dein Verein startet mit seinem Lieblingsstil (Vertrautheit 70).
14. **Neuzugang** senkt die Vertrautheit nur, wenn er mindestens Teamniveau − 2 hat (also wahrscheinlich Stammspieler wird).
15. **Einstellung zum Spiel** gilt nur für das nächste Spiel und springt danach auf „normal“ zurück.
16. **Wunder-Ordnung-Test** mit Kunst-Elf: je Grundordnung elf gleich starke Spieler auf ihren Stammpositionen mit passendem Fuß. Mit dem echten Kader gewinnt sonst die Ordnung, die zu den vorhandenen Positionen passt.

## K07 – Training
Datei: `konzepte/K07-training.md`

1. **Plan nach Abstand zum Spiel** statt nach Wochentagen. Grund: Spieltage über das Wochenende verteilt und englische Wochen.
2. **Eine Einheit pro Tag,** Doppeleinheiten nur in Vorbereitung und Pausen.
3. **Belastungssprung** als Verletzungsursache, kein „optimaler Bereich“ (Studienlage, siehe 5.4).
4. **Fünf Einzeltrainingsplätze** bis zum Trainerstab (K16).
5. **Trainingsspiel** als eigene Einheit, weil es Reservisten Spielpraxis gibt und in der Community gewünscht wird.

Bei der Umsetzung (U6a):
6. **Belastung als gleitendes Mittel** über 7 und 28 Tage (zwei Zahlen je Spieler) statt 28 einzelner Tageswerte. Gewohnte Last mindestens 2 pro Tag, sonst wäre nach dem Urlaub jeder erste Trainingstag ein riesiger Sprung (Risiko ×35).
7. **Regeneration** bringt netto +1 Frische. „+4 statt Verlust“ ist als Unterschied zu einer normalen Einheit gelesen. Dazu Grunderholung 2,1 statt 3 pro Tag: Sonst waren Spieler nach drei Spielen in acht Tagen wieder bei 86 % statt 72–82 %. Die Standardwoche endet dadurch bei etwa 97 % Frische vor dem Spiel (statt 100 %), das kostet unter 1 % Stärke für alle gleich.
8. **Standardwoche** mit den mittleren Tagen Taktik, Kondition, Technik (in dieser Reihenfolge). Bei sieben Tagen Abstand bleiben zwei mittlere Tage, so gibt es zwei Taktik-Einheiten wie in 5.3 vorgesehen. Der Entwicklungsreiz dieser Woche (1,5) ist der Normalwert (Faktor 1), die Spanne 0,5 bis 1,25.
9. **Kondition wirkt stärker auf die Ermüdung** (im Spiel und nach dem Spiel): Kondition 68 ermüdet etwa 25 % schneller als 84. Vorher brachte Training gegenüber „Schonen“ kaum etwas.
10. **Trainingsverletzungen:** Grundrate 0,00026 je Einheit, damit 40–55 % aller Verletzungen im Training passieren. Das passt zur UEFA-Studie (Spiel 27,5, Training 4,1 Verletzungen je 1000 Stunden) bei üblichen Trainings- und Spielstunden.
11. **„Training wirkt“ wird über die Wirkung geprüft** (Startelf stärker, Kondition höher, nicht mehr Ausfälle), nicht über Punkte: Punkte schwanken über wenige Saisons um ±7 je Saison. Gemessen: Startelf +0,4 bis +0,5 stärker als mit „Schonen“, also etwa +1 Punkt im ersten Jahr und mehr danach.
12. **Vorbereitung** als Vorlage mit vier Wochen (normal, hart, hart, Taktik). Der Co-Trainer nutzt sie bis zum ersten Pflichtspiel. Doppeleinheiten, Leistungstests und Testspiele kommen mit K11 und K12a.
13. **Umschulung** belegt einen der fünf Einzeltrainingsplätze. Verwandt heißt: Eignung ohne Fußabzug mindestens 75 %. Der Fuß bleibt nach der Umschulung ein Nachteil (außer bei beidfüßigen).
14. **Noch nicht gebaut:** eigene Vorlagen speichern, Erinnerung „Plan passt nicht“, Ereignisse aus §8, eigenes Torwarttraining (K16), Bonus +2 % mit Gegneranalyse (K18).

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

Bei der Umsetzung (U6b):
5. **Urlaub je Verein:** Er beginnt zwei Tage nach dem letzten eigenen Pflichtspiel (Liga, Pokal, Relegation), also für viele Vereine schon im Mai. Computer-Vereine nehmen immer drei Wochen.
6. **Trainingsauftakt** eine Woche früher, Standard oder eine Woche später (statt eines freien Datums im Fenster). Das deckt die Wahl ab und bleibt in jeder Saison gültig.
7. **Saisonbelastung wird mitgenommen:** Sie sinkt nur im Urlaub (4 pro Tag) und steigt mit jeder Spielminute. Nach zwei Wochen Urlaub startet ein Stammspieler mit Belastung 90 in die neue Saison mit etwa 26 statt 0 und liegt damit schon im Herbst über 50 (langsamere Erholung, mehr Verletzungen). Die Rechnung in 5.1 („Wirkung im Herbst nur bei Belastung über 74“) ging von einer Wirkung direkt nach dem Urlaub aus, die es mit der Schwelle 50 nie gäbe.
8. **Urlaubslänge auch im laufenden Urlaub änderbar** (Training und Saisonbilanz). Bereits vergangene Urlaubstage zählen.
9. **Formänderung je Notenpunkt 2,3 statt 2,5** und 11 % statt 10 % pro Woche zurück zur Mitte. Mit dem neuen Saisonablauf lagen sonst 6,5 % der Spieler bei Form ≤ 4 oder ≥ 16 (Ziel höchstens 5 %).
10. **Noch nicht gebaut:** Nationalspieler mit Turnier (K13), Ereignisse aus §8, Stimmung aus der Urlaubslänge (K14), Testspiele und Trainingslager (K11).

## K12b – Saisonvorbereitung (Rahmen)
Datei: `konzepte/K12b-saisonvorbereitung.md`

Liste statt Pflichtschritte, Automatik für Unerledigtes, Saisoneröffnung als kleines Fest.

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

## K20 – Transfers II: Abwerben, Bieterwettstreit, Deadline Day
Datei: `konzepte/K20-transfers-2.md`

**Noch zu recherchieren:** Anteil der Wechsel in den letzten Tagen eines Fensters.

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

## K23 – Finanzen und Budget
Datei: `konzepte/K23-finanzen.md`

1. **Monatsabrechnung** statt Buchung je Spieltag.
2. **Echte Größenordnungen** für alle Geldwerte, umgestellt in einem Schritt mit Gehältern und Ablösen (U13).
3. **Gehaltsrahmen 50 %** der erwarteten Einnahmen ohne Transfers (Spielwert).
4. **Insolvenz mit 9 Punkten Abzug** (vorläufig, prüfen).

## K24 – Sponsoren
Datei: `konzepte/K24-sponsoren.md`

**Noch zu recherchieren:** Ärmel- und Namensrechte-Erlöse in der Bundesliga, Sponsoring in 2. und 3. Liga.

## K25 – Marketing und Merchandising
Datei: `konzepte/K25-marketing.md`

sechs Kampagnen, drei Trikotdesigns je Saison, Sortiment in drei Stufen, Online-Shop ohne eigene Steuerung. Alle Beträge sind Spielwerte (Kalibrierung mit K23).

## K26 – Stadion und Infrastruktur
Datei: `konzepte/K26-stadion.md`

**Noch zu recherchieren:** echte Baukosten je Platz, Stehplatzanteile der Bundesliga-Stadien, Eigentumsverhältnisse der Stadien.

## K27 – Fans und Zuschauer
Datei: `konzepte/K27-fans.md`

**Noch zu recherchieren:** Dauerkartenanteile, Zuschauerschnitt der 1. und 3. Liga als Vollsaison, Zahl der Pyro-Verfahren.

## K28 – Vorstand, Ziele, Karriere
Datei: `konzepte/K28-vorstand.md`

1. **Ultimatum vor der Entlassung** statt sofortigem Rauswurf an der Grenze.
2. **Vertrauen mit Bausteinen und Trägheit,** die Werte je Spiel bleiben mit halbem Gewicht.
3. **Nach dem Aufstieg immer Klassenerhalt** als Standardziel.
4. **Trainergehalt nur als Statistik.**

## K29 – Medien und Pressekonferenzen
Datei: `konzepte/K29-medien-presse.md`

1. **Nur den Ton zeigen,** nicht die erwartete Wirkung. Das Zeitungsecho zeigt die Wirkung danach.
2. **Humor bleibt eine Spielart von ○**, im Text erkennbar markiert. Keine vierte Kategorie.
3. **Keine wörtlichen Zitate echter Kultsprüche** und keine Namen echter Personen. Erlaubt sind eigene Sprüche, die an den Ton berühmter Momente erinnern.
4. **Interviews von Spielern** kommen mit K14 und K15 (Welle 3): Führungsspieler und Diven sprechen, mit Wirkung auf Stimmung und Glaubwürdigkeit.
5. **Weitere Recherche** bei der Umsetzung (U17), nicht jetzt.
6. **Gerüchteküche und Datenmodell** ergänzt (3.4, 4.3), damit sind B3 und B4 erledigt.

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

1. ~~Vereinsgruppen~~ **Entschieden am 8.11.:** echte Auslandsvereinsnamen, erzeugte Spieler, nur die Namen werden gepflegt.
2. **Keine automatische Nachregelung** der Weltstärke im Spiel. Das Gleichgewicht wird über Tests kalibriert (K02: kein Gummiband).
3. **Zwölf Länder** im Pool, Nationen-Tabelle für alle Länder der Welt (für Nationalitäten der Spieler).

## K34 – Statistik und Historie
Datei: `konzepte/K34-statistik.md`

Elf des Jahres in 4-3-3, volle Details drei Saisons lang, Sprüche-Chronik bis 100 Einträge.

## K35b – Look und Stil
Datei: `konzepte/K35b-look.md`

dunkles Flutlicht-Thema als Standard, Systemschriften, keine Vereinslogos, Bewegung sparsam und abschaltbar.

