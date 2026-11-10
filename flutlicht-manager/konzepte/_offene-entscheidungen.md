# Offene und vorläufige Entscheidungen

Stand: 10. November 2026. Automatisch aus Abschnitt 12 aller Konzepte zusammengestellt.

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

**Mit dir entschieden (10.11.): Die Reichen werden reicher, aber mit Maß** (K02 §5.3a), als Folge der Regeln ohne Zuschlag. Der Größte holt etwa zwei Drittel der Titel. Über Jahrzehnte dürfen sich die Verhältnisse verschieben. Champions League, Europa League und Conference League kommen langfristig ins Spiel (K37). Vorläufig: Europapokal-Pauschale bis dahin, Gründe für Machtwechsel (Ansehen sinkt ohne Erfolg, Fehler der Computer-Vereine, Talent-Jahrgänge), Langzeitziel mindestens drei verschiedene Meister in 30 Saisons.

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

Bei der Umsetzung (U7a):
6. **Rote Karten in Liga und Pokal getrennt** (Nr. 2 bestätigt): Laut 90min.de werden Platzverweise in Bundesliga und DFB-Pokal getrennt behandelt und nur im eigenen Wettbewerb abgesessen. Das ist ein Fachartikel, das DFB-Regelwerk selbst habe ich nicht eingesehen.
7. **Die Gelbe vor einer Gelb-Roten Karte zählt nicht** für die Gelbsperre. Nicht belegt, prüfen.
8. **Gelbsperren verfallen am Saisonende,** Rot- und Gelb-Rot-Sperren laufen in die nächste Saison weiter, in Liga und Pokal. Belegt nur über Forenbeiträge, die die DFL-Spielordnung zitieren („Eine Übertragung auf das neue Spieljahr ist ausgeschlossen“). Den Originaltext habe ich nicht gefunden.
9. **„Rückstand in der Schlussphase ×1,2“ (5.1) ist vorläufig aus** (Stellschraube `faktoren.rueckstand` = 1,0). In der Simulation verschob der Faktor die Form zugunsten der schwachen Kader (Test „Keine Formspirale“ auf drei Seeds um etwa 0,6 Punkte). Die Ursache ist noch nicht geklärt.
10. **Foularten kalibriert:** Mit den Rohwerten aus 3.1 gäbe es etwa doppelt so viele Rote Karten. Gebaut sind normal 80 % (Gelb 2,2 %), taktisch 12 % (Gelb 56 %), rücksichtslos 7,7 % (Gelb 80 %, Rot 2,2 %), brutal 0,06 %, Notbremse 0,12 %. Dazu kommen Meckern (0,15 Gelb je Spiel und Team, 2 % davon Rot wegen Beleidigung) und Tätlichkeiten (0,0016 je Spiel und Team, 5 % davon schwer). Die Notbremse ist eine Foulart, keine eigene Konter-Szene.
11. **Strafmaß ohne Verletzungsfolge:** Verletzungen aus der Engine sind noch nicht mit dem Foul verknüpft. Kommt mit K10.
12. **Einspruch:** Ausgang nach Lage. Eine harte Entscheidung (erste Rote Karte, kein Tätlichkeitsfall) wird zu 35 % gemindert und zu 5 % erhöht, eine eindeutige (Tätlichkeit) zu 10 % gemindert und zu 15 % erhöht, sonst 25 % und 10 %. Im Mittel sind es so etwa 30 % gemindert. Bei einem Antrag von nur einem Spiel ist kein Einspruch möglich. Computer-Vereine legen Einspruch ein, wenn ein Stammspieler hart bestraft wurde (60 %), sonst nur selten (10 %).
13. **Zweite Rote Karte vor dem Urteil:** Es bleibt ein Verfahren, gewertet wird das schwerere Vergehen.
14. **Noch nicht gebaut:** Äußerungen und Kontrollausschuss (K29), Zuschauer-Vergehen (K27), Trainer-Karten und Tribüne, Videobeweis, Derby-Faktor, Rudelbildung, Geldstrafen für Spieler (K14), Erinnerung „Gelbsperre droht“ vor wichtigen Spielen. Die Kader-Ansicht zeigt nur einen Hinweis bei 4, 9 oder 14 Gelben.
15. **Lernstufen (K36):** Information ab Teamleiter, Strafe annehmen oder Einspruch ab der A-Lizenz. Davor entscheidet der Verein nach `kiEinspruch`.

## K10 – Medizin und Verletzungen
Datei: `konzepte/K10-medizin.md`

1. **Krankheiten** zählen als eigener Ausfall mit Ansteckung, getrennt von den Verletzungszielen.
2. **Fit spritzen** nur bei wenigen Arten, mit Verschlimmerungsrisiko statt festem Verbot.
3. **Verletzungsverlauf** wird zwei Jahre gespeichert. Das reicht für Rückfälle und Hinweise, ohne den Spielstand aufzublähen.

Bei der Umsetzung (U7b):
4. **Häufigkeit nach der UEFA-Studie:** Laut einer Aspetar-Zusammenfassung der UEFA Elite Club Injury Study hat ein 25er-Kader etwa 50 Verletzungen mit Ausfall pro Saison, etwa 15 davon im Muskel (Ø 16 Tage), und im Schnitt fehlen 12–14 % des Kaders. Kalibriert auf etwa 40 Verletzungen pro Team und Saison (Ziel 30–50) und 8 % fehlende Spieler an Spieltagen. Vorher waren es etwa 7 Verletzungen und ein halber fehlender Spieler je Team. Verletzungen sind damit deutlich häufiger, im Schnitt aber kürzer (Zerrung Ø 15 Tage, viele Prellungen von 1–7 Tagen).
5. **Quellen im Spiel:** Foul (je erlittenem Foul 1,2 % nach Schwere der Foulart: taktisch ×0,5, rücksichtslos ×4, brutal ×10, harter Einsatz ×1,5), Zweikampf ohne Foul (je Minute und Team 0,16 %) und Überlastung (je Minute und Team 0,22 %, nach Frische, Alter ab 30, Pressing und Konter, Rückfallfenster). Dazu kommt das Training (Grundrate 0,0016 statt 0,00032). Die Werte aus 5.1 (je Spieler und Minute 0,0003) hätten etwa zehnmal zu viele Verletzungen ergeben.
6. **Art nach Quelle:** Jede Art hat einen Kontaktanteil k. Kontakt zieht anteil × k, Überlastung anteil × (1 − k), das Training alle Arten nach anteil (Trainingsspiel, Zweikämpfe). Ergebnis: 35 % Muskel, 25 % Zerrung, 44 % im Training.
7. **Spiel gegen Training je Stunde:** etwa 20-mal statt 3- bis 6-mal (UEFA-Studie etwa 7-mal). Beides zugleich geht mit unserer Trainingszeit (jeder Spieler fast täglich 1,5 Stunden) nicht: Bei einem Training-Anteil von 40–55 % wird das Verhältnis groß. Der Test prüft nur „mindestens dreimal“. Prüfen, wenn K11 und die Trainingsdauer genauer sind.
8. **Zerrung 8–30 Tage** statt 7–28, weil der Physiotherapeut (K16) die Dauer zusätzlich verkürzt. Rückfall: Im Fenster von acht Wochen ist das Risiko ×(1 + 7 × Rückfallwert), und 35 % der Verletzungen in dieser Zeit sind dieselbe Art. Das ergibt etwa 14 % Rückfälle nach einer Zerrung.
9. **Diagnose:** Verdacht nur als Gruppe (Muskel-, Band-, Knieverletzung …) mit Spanne ±60 %, nach der Untersuchung die genaue Art mit ±25 %. Mit Mannschaftsarzt (K16) geht es schneller und genauer: Qualität 10 entspricht dem Durchschnitt, ohne Arzt ist die Spanne doppelt so breit und die Untersuchung dauert 3 Tage. Die Spanne enthält immer die wahre Dauer. Eine Fehldiagnose ist noch nicht gebaut.
10. **Krankheiten:** 0,06 % je Spieler und Tag statt 0,15 %, Ansteckung ×2 für 5 Tage statt ×3 für 7 Tage. Mit den Werten aus dem Entwurf schaukelte sich die Ansteckung auf 35 Krankheiten pro Team und Saison hoch, jetzt sind es etwa 7. Das ist ein Spielwert, nicht recherchiert.
11. **Verletzungen laufen über den Saisonwechsel weiter** (vorher wurden sie am 1. Juli gelöscht). Ein Kreuzbandriss im April kostet also auch die Vorbereitung.
12. **Fit spritzen** geht nur am Spieltag. Computer-Vereine spritzen nur in wichtigen Spielen (Pokal ab Runde 3, Relegation) und nur Stammspieler mit höchstens 10 Tagen Ausfall. Verschlimmerung: Prellung → Faserriss, Bänderdehnung → Bänderriss, Rücken/Leiste → Zerrung, Bruch (Nase) bekommt 7 Tage mehr.
13. **Robustheit und „verletzungsanfällig“** wirken beide (1,6 − 0,06 × Robustheit und ×1,6), wie in 5.1. Ein Anfälliger (Robustheit 1–4) verletzt sich damit gut doppelt so oft wie der Durchschnitt, nicht nur 60 % öfter, wie der Merkmalstext sagt. Prüfen.
14. **Lernstufen (K36):** Verletztenliste und Diagnose ab Stufe 1 (nur Information), fit spritzen und früher zurückholen ab Stufe 4. Davor entscheidet der Arzt nach den Regeln der Computer-Vereine.
15. **Noch nicht gebaut:** zweite Meinung, Fehldiagnose, Pflichtwechsel und Zusatzwechsel bei Gehirnerschütterung, Ereignisse aus §8, Saisonbilanz der Ausfalltage in der Saisonzusammenfassung (die Bilanz steht in der Verletztenliste im Kader), Reha-Zentrum (K26), Rotation der Computer-Vereine nach Saisonbelastung.

## K11 – Freundschaftsspiele und Trainingslager
Datei: `konzepte/K11-testspiele.md`

1. **Testspiele ohne Halt** als Standard, live nur auf Wunsch.
2. **Erfundene Gegner** für Amateure, Auslandsvereine und Turniere. Echte Profivereine aus 1. bis 3. Liga als Testspielgegner, weil sie ohnehin im Spiel sind.
3. **Reale Regionen** als Lager-Orte (Alpen, Algarve und so weiter), aber keine echten Hotels oder Marken.
4. **Alle Geldbeträge sind Spielwerte,** nicht recherchiert. Kalibrierung mit K23.

Bei der Umsetzung (U7d):
5. **Testspiele anfragen** in der Trainingsansicht: Tag (frühestens in vier Tagen, bis sechs Wochen voraus, zwei Tage Abstand zu eigenen Pflichtspielen, höchstens zwei pro Woche) und Gegner. Vorgeschlagen werden zwei Amateurvereine und die acht Profivereine aus der 1. bis 3. Liga, die im Niveau am nächsten sind (gleiche Region zuerst). Gegen Amateure spielst du auswärts, gegen Profis zu Hause. Die Antwort kommt nach 1–3 Tagen als Nachricht.
6. **Zusage:** Grundwert 0,6 × Niveau (stärker ab 4 Punkten Kaderstärke ×0,4, schwächer ×1,3) × Kalender (Pflichtspiel des Gegners in zwei Tagen ×0,2) × Region (gleiche ×1,2) × Phase (Vorbereitung ×1,2, Saison ×0,7), begrenzt auf 5–95 %. Amateure sagen zu 95 % zu. „Weit weg ×0,8“ ist noch nicht gebaut, weil die Regionen grob sind. Profis sagen in der Vorbereitung vor der 3. Woche nie zu.
7. **Im Testspiel:** bis zu 11 Wechsel ohne Grenze der Gelegenheiten, keine Sperren und keine Karten in der Zählung (auch gesperrte Spieler dürfen spielen), Ermüdung, Belastung und Saisonbelastung ×0,7, Verletzungsrisiko ×0,6, Spielpraxis 60 %, Form zu 30 %, Vertrautheit +2, Lernen im Spiel zur Hälfte (jede zweite Szene). Testspiele zählen nicht als Einsatz, ihre Tore nicht zur Torjägerliste. Sie laufen immer ohne Halt und ohne Live-Ansicht.
8. **Geld:** Als Gastgeber kommen in der 3. Vorbereitungswoche 12 % der Ligaspiel-Nachfrage (Entwurf: 25 %), danach je Woche 1,5 Prozentpunkte weniger, mindestens 4 %, gegen einen großen Namen (Ansehen ab 80) doppelt so viele. Beim Amateurverein gibt es eine Gage von 10.000 bis 80.000 € nach Ansehen. Auswärts bei Profis gibt es nichts. Die Lagerkosten sind um 60 % höher als im Entwurf (Alpen 40.000 €, Schwarzwald 25.000 € pro Tag in der 1. Liga). Mit den Entwurfswerten brachten drei Heim-Testspiele einem Zweitligisten das Siebenfache der Lagerkosten, jetzt etwa das Doppelte. Alles Spielwerte.
9. **Trainingslager** in der Trainingsansicht: Ort, Beginn (in der Vorbereitung oder bis eine Woche vor und während der Winterpause der eigenen Liga), 5–10 Tage, Kosten sofort. Im Lager wirkt das Training ×1,15 (Alpen: Kondition ×1,15 mehr), die Vertrautheit ×1,25. Bis zum 7. Tag bekommen alle +0,1 Selbstvertrauen pro Tag (bis K14 statt Zusammenhalt). Ab dem 8. Tag gibt es mit 13 % pro Tag Lagerkoller (−0,5 Selbstvertrauen für 3–5 Spieler), damit es bei zehn Tagen in etwa einem Drittel der Fälle passiert (mit 10 % wären es nur 27 %). Riviera: Partylöwen fallen nachts auf. Heimat im Winter: 20 % pro Tag fällt das Training aus. Ein Lager pro Pause.
10. **Widerspruch in §10:** „Sieben Tage Lager bringen etwa eine Woche Vorsprung in der Vertrautheit“ passt nicht zu ×1,25 aus 5.3. Gebaut ist ×1,25, der Test prüft 15–35 % mehr Vertrautheitsgewinn. Soll das Lager stärker wirken, muss der Wert hoch.
11. **Noch nicht gebaut:** Testspiele der Computer-Vereine und deren Anfragen an dich, Turniere, Auslandsvereine als Gegner im Lager (kommen mit K32 und den echten Vereinsnamen), Zimmerbelegung (K14), Lager-Ereignisse mit Entscheidung, Marketing der Golfregion (K25), Erinnerung „spielfreie Woche ohne Testspiel“ (K01 H9), Testspiel live ansehen.
12. **Lernstufen (K36):** Testspiele ab Stufe 3 (davor plant der Co-Trainer zwei Testspiele gegen Amateure), Trainingslager ab Stufe 3 (davor fährt der Verein nicht ins Lager). Die Automatik dafür kommt mit UL.

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

Bei der Umsetzung (U7c):
6. **Pokal-Auslosung nach den echten Töpfen:** In Runde 1 kommen die 18 Erstligisten und die 14 besten Zweitligisten der Vorsaison in den Profitopf, alle anderen in den Amateurtopf mit Heimrecht. Ab Runde 2 bis zum Halbfinale werden zuerst Amateure (3. Liga und darunter) gegen Profis gelost, die Amateure spielen zu Hause, die übrigen Paarungen kommen aus einem Topf. Für Runde 1 und 2 ist das belegt (diefalsche9.de), für Achtelfinale bis Halbfinale nicht: Die Quellen sagen „ein Topf, der Erstgezogene hat Heimrecht“. Das Heimrecht der Amateure bis zum Halbfinale bleibt also eine Annahme (Nr. 2).
7. **Auslosung als Halt:** 14 Tage vor der Runde, frühestens am Tag nach der Vorrunde. Im Büro steht eine Karte mit allen Paarungen, deine hervorgehoben, dazu eine Nachricht. Gezogene Kugeln als Animation gibt es noch nicht.
8. **72 Stunden:** Nach der Auslosung verlegt die Liga Spiele der Pokalteilnehmer, die weniger als drei Tage vor oder nach der Runde liegen (Sonntag → Samstag davor), mit Nachricht an dich. Der Pokal spielt vorläufig an einem Tag je Runde, nicht an Dienstag und Mittwoch. In den erzeugten Folgesaisons repariert der Spielplan-Generator englische Wochen (Dienstag → Mittwoch, Freitag → Samstag, sonst das Spiel davor nach vorn). Ergebnis: kein Verein spielt zweimal innerhalb von drei Tagen.
9. **Relegation:** Das Rückspiel hat bei Gleichstand in der Summe Verlängerung und Elfmeterschießen aus der Engine, auch live. Das Los bleibt nur für alte Spielstände. Echt setzt sich der Bundesligist seit 2009 in etwa 80 % durch (13 von 16 bis 2024, Sky), im Spiel sind es etwa 50 %, weil der 16. der 1. Liga und der 3. der 2. Liga in unserer Welt fast gleich stark sind (Konsistenzprüfung AI5).
10. **Supercup** ab der zweiten Saison (für die erste fehlt die Vorsaison im Spiel): Meister gegen Pokalsieger am Samstag vor dem 1. Spieltag beim Meister, sonst gegen den Vizemeister, wie 2024 Leverkusen gegen Stuttgart. Bei Gleichstand direkt Elfmeterschießen, seit 2010 gibt es keine Verlängerung. Karten und Sperren zählen wie im Pokal, Tore nicht zur Torjägerliste. Noch ohne Prämie (K23).
11. **Zweitmannschaften:** Spielt die erste Mannschaft in derselben Liga, muss die Zweite eine Liga tiefer, und der beste Absteiger dieser Liga bleibt drin. Die echte Regel ist weiter nicht geprüft (Nr. 4).
12. **Länderspiele noch nicht gebaut:** Spieler haben noch keine Nationalität (kommt mit K32 und dem Auslandspool, K03). Ohne sie gibt es keine Nominierung. Ebenfalls offen: Spielverlegung auf Antrag, Rotation der Favoriten in Runde 1 und 2, Pokal an Dienstag und Mittwoch, Prämien für den Supercup.
13. **Lernstufen (K36):** Pokal, Relegation und Supercup laufen ab Stufe 1 (nur Termine und Ergebnisse). Die Auslosung ist ab Stufe 1 ein Moment. Spielverlegung beantragen kommt später auf Stufe 4, wenn es sie gibt.

## K14 – Stimmung, Selbstvertrauen, Kabine
Datei: `konzepte/K14-kabine.md`

1. **Kaderrollen** mit fester Erwartung an Einsatzzeit und eigener Einschätzung des Spielers. Das macht Unzufriedenheit nachvollziehbar.
2. **Zusammenhalt** als eigener Teamwert neben der taktischen Vertrautheit (K06): das eine ist Chemie, das andere Taktik.
3. **Stimmung wirkt wenig auf die Leistung** (−3 % bis +2 %), aber stark auf Training, Verträge und Wechselwünsche.
4. **Teamevent** als einfacher Hebel mit Abnutzung.

Bei der Umsetzung (U8):
5. **Einsatz als absolute Lücke** ((Anteil − Erwartung) × 40, Ehrgeiz verstärkt), Spanne −28 bis +10 statt −25.
6. **Rollen nach der besten Elf ohne Ausfälle**, nicht nach dem Rang der Stärke. Ehrgeiz ab 15: Einschätzung eine Stufe höher.
7. **Erwartung bei zu niedriger Rolle:** Mitte der beiden Anteile. Rolle unter der Einschätzung kostet nur, wenn du sie selbst vergeben hast.
8. **Schwellen:** Grummeln unter 45 seit zwei Wochen, Gesprächswunsch unter 40 seit zwei Wochen, offiziell nach vier Wochen auf Stufe 2, öffentlich mit 10 % pro Woche (Diva, Söldner 30 %). Trägheit 20 %, höchstens ±8 pro Woche.
9. **Bausteine:** Erfolg aus Platz und Serie, Leistung aus der Form, Vertrag aus dem Gehalt (vorläufig höchstens −8 bis K21), Trainer aus Gesprächen und Rolle, Umfeld aus Kapitän und Urlaub.
10. **Bankplatz-Test auf zwölf Wochen** statt sechs.
11. **Ruf-Gefälle** nur bei deinen Spielern, Ruf des Trainers bis K28 aus Ansehen und Trainerjahren.
12. **Zusammenhalt:** neuer Stammspieler −5, Zug zur Mitte 4 % pro Woche, Lager +1 pro Tag statt Selbstvertrauen.
13. **Beziehungen:** Freundschaften und Rivalitäten nach festen Wahrscheinlichkeiten, Rangeleien der Hitzköpfe. Landsleute, Sprache und Zimmer fehlen bis K32.
14. **Kapitän** wählst du, sonst der Co-Trainer nach Führung, Vereinsjahren und Stärke. Absetzen kostet, außer in den ersten 14 Tagen bei einem Verein.
15. **Folgen:** Lernen ×0,7 unter 30, Verlängern unter 40 teurer, unter 25 gar nicht, offizieller Wechselwunsch −10 % Marktwert.
16. **Computer-Vereine:** Gespräch beim Gesprächswunsch gelingt zu 55 %.
17. **Teamevent:** +5 Stimmung, +5 Zusammenhalt, 50.000/25.000/10.000 € je Liga.
18. **Neuanfang beim Vereinswechsel:** Wechselwunsch null, Stimmung mindestens Startwert.
19. **Diva und Söldner** sichtbar und wirksam.
20. **Lernstufen (K36):** Stimmung sehen ab Teamleiter, Kapitän ab C, Kaderrollen und Teamevent ab B.
21. **Noch nicht gebaut:** Ereignisse aus §8 außer dem Gesprächswunsch, Geldstrafen erlassen, Prämien, Integration und Heimweh, Integrationsfigur und Mentor.

**Mit dir entschieden (10.11.): Bankzeit nach Grund** (K14 §12, vorgemerkt als U8d). Rotation wegen Frische keine Abwertung, Kurzeinsatz mit Tor oder guter Note positiv, Rivale spielt auf Dauer negativ (anfangs je nach Typ Schub), Unerfahrene freuen sich über Bank und Kurzeinsatz, Ersatztorwart neutral, außer er ist so stark wie die Nummer 1. Meine Vorschläge dazu (vorläufig): Schonung zählt wie Verletzung, Joker mit Tor oder Note bis 2,5 +3, Rivalen-Zähler ab dem vierten Spiel −1 bis −10, Unerfahrene (unter zehn Profi-Pflichtspielen) +1 für den Kader, +3 für 10 Minuten, +5 für das Debüt, Torwart-Rivalität ab 2 Punkten Abstand. Weitere Fälle von mir (vorläufig, K14 §12): Pokaltorwart und Pokalelf als Rolle, Aufbau nach Verletzung, Platz verloren während der Verletzung, nach einer Sperre, Formkrise, passt nicht ins System, teurer Neuzugang, Kapitän und Altstar auf der Bank, Vertragsjahr, Tribüne statt Bank, früh ausgewechselt, Einwechslung in der Nachspielzeit, Wunsch nach Leihe, bedeutungslose Spiele, Mannschaftserfolg, Chance genutzt, neuer Trainer, Wechselwunsch und Bank, Länderspiele. Dazu sechs Grundsätze (Grund vor Minuten, kurz verständnisvoll und auf Dauer die Summe, der Typ bestimmt die Richtung, Leistung schafft Anspruch, Erklären hilft, Erfolg macht genügsam).

## K15 – Gespräche und Ansprachen
Datei: `konzepte/K15-gespraeche.md`

1. **Kurze Gespräche:** Thema, Haltung, höchstens eine Rückfrage. Keine Dialogbäume.
2. **Drei Einzelgespräche pro Woche** als Grenze gegen Dauerklicken.
3. **Glaubwürdigkeit je Mannschaft,** nicht je Spieler. Gebrochene Versprechen sprechen sich herum.
4. **Computer-Vereine** nur vereinfacht.

Bei der Umsetzung (U8):
5. **Sieben Themen** gebaut, ohne „Stimmung erfragen“ (Gründe stehen auf der Spielerkarte), „Position erklären“, „Verlängerung anbieten“ und „Persönliches“.
6. **Ohne Anlass keine Wirkung und keine Zusage**, damit sich Glaubwürdigkeit nicht mit leichten Versprechen sammeln lässt.
7. **Zusagen konkret:** Einsatz 60 % der Minuten in fünf Pflichtspielen, Geduld ein Startelfeinsatz in sechs Wochen, Wechsel zum Marktwert auf die Transferliste (vier Monate), keine Konkurrenz vier Monate. Grundwirkung „keine Konkurrenz“ +6.
8. **Schädliche Gespräche:** Haltungsfaktor umgekehrt (Schaden × (2 − Faktor), 0,4–1,6).
9. **Mehrere Eigenschaften:** Faktoren multipliziert, für Kritik zählt die erste nach Vorrang. Streit bei Diva (bestimmt 30 %) und Hitzkopf (bestimmt oder Kritik 20 %).
10. **Persönlichkeit:** Anpassungsfähigkeit ±2 % je Punkt.
11. **Wirkung** sofort (±10) und zur Hälfte im Baustein „Trainer“.
12. **Gesprächswunsch gelöst** mit 15 % + 4 % je Punkt Wirkung, gescheitert heißt sofort offizieller Wechselwunsch.
13. **Lob ab Note 4,5 und Kritik bis 2,5 unpassend.**
14. **Mannschaftsansprache** mit festen Bedingungen je Art, Abnutzung je Art über vier Wochen.
15. **Halbzeitansprache:** Wirkung × Glaubwürdigkeit, Glaubwürdigkeit ändert sich nur bei Ansprachen mit Anlass.
16. **Glaubwürdigkeitskrise** unter 25: einmal −3 beim Vorstand.
17. **Erinnerung** „Versprechen droht zu kippen“ am Spieltag, abschaltbar.
18. **Vereinswechsel:** offene Zusagen hinfällig.
19. **Lernstufen (K36):** Gespräche und Mannschaftsansprache ab C, Versprechen ab B.
20. **Noch nicht gebaut:** Gespräche mit dem Vorstand, öffentliche Kritik und Presse, Karten aus §8.

## K16 – Trainerstab und Mitarbeiter
Datei: `konzepte/K16-stab.md`

1. **Acht Rollen in Welle 2** (Co-Trainer, Torwart-, Athletik-, Standardtrainer, Arzt, Physiotherapeut, Videoanalyst, Psychologe). Scouts, Jugend, Sportdirektor und Pressesprecher kommen mit ihren Konzepten.
2. **Kein Ernährungsberater, kein Platzwart** als eigene Rolle. Der Platzwart gehört zu K26 (Rasen), Ernährung steckt im Athletiktrainer.
3. **Co-Trainer ist Pflicht.** Ohne ihn gäbe es keine Automatik und keine Halbzeit-Einschätzung.
4. **Trainerteam mitnehmen** bis zu zwei Personen.
5. **Gehälter sind Spielwerte,** Kalibrierung mit K23.

Bei der Umsetzung (U6c):
6. **Gebaut sind die acht Rollen aus Welle 2** mit Qualität 1–20, Gehalt und Vertrag, Start nach Ansehen (Qualität ≈ Ansehen × 0,2 ± 3; Videoanalyst, Standardtrainer und Psychologe erst ab Ansehen 55–65, zweiter Co-Trainer ab 70) und 40 vereinslosen Mitarbeitern.
7. **Wirkungen nach 5.3:** Co-Trainer (Lernen, Umschulung, Vertrautheit, Einzeltrainingsplätze, Talentsterne genauer), Athletiktrainer (Trainingsrisiko, Konditionsreiz), Torwarttrainer (Entwicklung und Lernen der Torhüter), Physiotherapeut (Ausfallzeit, höchstens −25 %), Videoanalyst (Spielvorbereitung doppelt ab Qualität 10), Standardtrainer (Standard-Einheiten stärker), Psychologe (Selbstvertrauen unter 0 erholt sich schneller, nervenschwach wirkt schwächer). Der Arzt wirkt erst mit K10.
8. **Einstellen geht sofort** (Vertrag zwei Jahre), nicht nach 1–3 Tagen Bedenkzeit. Verlängern: zwei Jahre, 10 % mehr Gehalt. Entlassen: halbes Restgehalt als Abfindung. Ein Co-Trainer ist Pflicht.
9. **Gehälter** werden wie die Spielergehälter je Ligaspiel gebucht. Ein Erstligist wie Freiburg zahlt so etwa 3 Mio. € pro Jahr, ein kleiner Drittligist mit nur einem Co-Trainer etwa 35.000 €. Spielwerte, Abgleich mit K23 und dem Stab-Budget aus K28.
10. **Computer-Vereine** besetzen einen fehlenden Co-Trainer wöchentlich aus dem Pool nach und verlängern auslaufende Verträge zu 70 %.
11. **Noch nicht gebaut:** Automatik mit Rauschen, Haltung und Spezialgebiet (5.1), Modus „Vorschlag“, Bänder für Vorhersagen außer der Qualität selbst, Abwerbung, Mitnehmen beim Vereinswechsel, Ex-Spieler als Mitarbeiter (K32), Ereignisse aus §8.

**Mit dir entschieden (10.11.): Für jeden Bereich lohnt sich gutes Personal**, auch für Verhandlungen.
12. **Der Verhandler ist der Sportdirektor:** Verhandlungsgeschick (Forderungen bis −8 %, Ablösen ±5 %) und Netzwerk (Kontakte zu zwei bis sechs Beratern).
13. **Kaderplaner** als Zuarbeiter (Kostenvorschau, Fristen, Gehaltsgefüge).
14. **Marketingleiter:** Sponsorangebote bis +10 %, mit Sponsorentag höchstens +18 %.
15. **Greenkeeper (Platzwart)** als Rolle im Stab (vorher in K26).
16. **Deckel:** Alle Verhandlungsboni zusammen höchstens −15 %.
17. **Die Besten wollen zu den Besten:** Mitarbeiter wählen ihren Verein wie Spieler, große Vereine werben ab.
18. **Computer-Vereine** stellen nach denselben Regeln ein.

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

**Mit dir entschieden (10.11.):** echte Vertragsverhandlungen mit Prämien, gebaut mit U10.
5. **Auflaufprämie statt Einsatzprämie,** dazu Punkt-, Tor-, Zu-Null-, Aufstiegs-, Klassenerhalts- und Titelprämie, Handgeld bei jeder Unterschrift, Treueprämie. Vorlagenprämie erst mit Vorlagen in der Engine.
6. **Ligaklausel:** Gehalt je Liga, Abstieg −20 bis −50 %, Aufstieg +20 bis +100 %.
7. **Prämien nach Erwartungswert mit Abschlag nach Sicherheitsbedürfnis,** Wichtigkeit der Vertragsteile nach Charakter.
8. **Punktprämie bei Schonung** nur, wenn sie im Vertrag steht.
9. **Lernstufen (K36):** Laufzeit und Grundgehalt ab B, Prämien und Klauseln ab A.

## K22 – Berater
Datei: `konzepte/K22-berater.md`

1. **Fünf Profile,** darunter Strippenzieher und Familienberater als eigene Typen.
2. **Provisionen als Spielwerte.** Die echten Regeln (FIFA-Beraterreglement, Rechtsstreit um Obergrenzen) sind nicht geprüft und für das Spiel nicht nötig.

**Mit dir entschieden (10.11.): Kontakte zu Beratern bringen bessere Deals.** Vorläufig:
3. **Beziehung aufbauen:** faire Abschlüsse, Mandanten gut behandeln und entwickeln, einen wechselwilligen Mandanten zu einem guten Preis gehen lassen, jungen Mandanten Chancen geben, Einladung in die Loge oder zum Essen (einmal im Monat, nutzt sich ab), großzügigere Provision, Sportdirektor mit Netzwerk.
4. **Beschädigen:** harte Verhandlungen, gebrochene Zusagen an Mandanten, Mandant dauerhaft gegen seine Rolle auf der Bank, Verkauf gegen seinen Willen, aufgeflogenes Abwerben. Ohne Kontakt verblasst die Beziehung.
5. **Nutzen:** Forderungen bis −10 %, Tipps, Erstzugriff ab +60, Fürsprache beim Spieler, Warnung vor Vorverträgen.
6. **Deckel** zusammen mit dem Sportdirektor −15 %.
7. **Berater-Klüngel** ab fünf Mandanten im Kader.
8. **Bestechung und Schwarzgeld** bewusst weggelassen.
9. **Computer-Vereine** nach denselben Regeln.

## K23 – Finanzen und Budget
Datei: `konzepte/K23-finanzen.md`

1. **Monatsabrechnung** statt Buchung je Spieltag.
2. **Echte Größenordnungen** für alle Geldwerte, umgestellt in einem Schritt mit Gehältern und Ablösen (U13).
3. **Gehaltsrahmen 50 %** der erwarteten Einnahmen ohne Transfers (Spielwert).
4. **Insolvenz mit 9 Punkten Abzug** (vorläufig, prüfen).

## K24 – Sponsoren
Datei: `konzepte/K24-sponsoren.md`

**Noch zu recherchieren:** Ärmel- und Namensrechte-Erlöse in der Bundesliga, Sponsoring in 2. und 3. Liga.

**Ergänzt 10.11.:** Ein guter Marketingleiter bringt bis zu 10 % bessere Angebote, zusammen mit dem Sponsorentag höchstens 18 %.

## K25 – Marketing und Merchandising
Datei: `konzepte/K25-marketing.md`

sechs Kampagnen, drei Trikotdesigns je Saison, Sortiment in drei Stufen, Online-Shop ohne eigene Steuerung. Alle Beträge sind Spielwerte (Kalibrierung mit K23).

## K26 – Stadion und Infrastruktur
Datei: `konzepte/K26-stadion.md`

**Noch zu recherchieren:** echte Baukosten je Platz, Stehplatzanteile der Bundesliga-Stadien, Eigentumsverhältnisse der Stadien.

**Ergänzt 10.11.:** Greenkeeper (Platzwart) im Stab (K16), Rasenqualität 0–100 je Platz mit kleiner Wirkung auf Ballbesitzstile, Verletzungsrisiko und Heimvorteil (K26 3.2a, Spielwerte).

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

## K36 – Einstieg mit Lernstufen
Datei: `konzepte/K36-lernstufen.md`

Mit dir entschieden (9.11.): Namen nach den Trainerlizenzen, 2–3 Stufen in der ersten Saison, alles frei nach 2–3 Saisons, Überspringen und Abschalten jederzeit, Gesperrtes über den Stab.

1. **Die C-Lizenz kommt auch ohne jede Nutzung,** spätestens nach 12 Pflichtspielen. Alle späteren Lizenzen haben ebenfalls eine späteste Zeit.
2. **Mindestzeit plus Aufgaben,** eine Aufgabe heißt nur „einmal selbst gemacht“.
3. **A-Lizenz frühestens in der zweiten Saison, Pro-Lizenz frühestens nach der zweiten Saison.**
4. **Pro bringt heute Stadion und Kredit,** damit die Stufe bis Welle 4 nicht leer ist.
5. **Gesperrte Bereiche sind sichtbar** mit Hinweis „Macht der Co-Trainer · frei ab …“.
6. **Neu freie Bereiche bleiben zuerst in der Automatik,** bis du eingreifst.
7. **Informationen sind nie gesperrt,** nur Entscheidungen.
8. **Die Lizenz gehört dir** und bleibt beim Vereinswechsel.
9. **Keine Wirkung auf Jobangebote,** obwohl echt die Pro-Lizenz für die 1. bis 3. Liga Pflicht ist.
10. **Ausrichtung zuerst mit drei Stufen,** fünf ab der B-Lizenz.
11. **Zurufe an einzelne Spieler ab B,** an die Mannschaft ab C.
12. **Automatik mit Klugheit „normal“,** bis K16 §5.1 gebaut ist.
13. **Der Aufstieg zählt nicht in das Halte-Budget.**
