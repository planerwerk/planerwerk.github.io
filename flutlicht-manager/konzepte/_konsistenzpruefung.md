# Konsistenzprüfung der Pläne

Stand: 5. November 2026.

Geprüft habe ich:
- `PLAN.md`
- `konzepte/_rohmaterial-logik-v1.md` (im Folgenden „Rohmaterial“)
- `konzepte/_recherche-genre.md`
- `konzepte/K29-medien-presse.md`
- `konzepte/_vorlage.md`
- zum Vergleich das laufende Spiel `index.html`

**Status je Befund:**
- ✅ = in diesem Schritt korrigiert
- 🔶 = Vorschlag, braucht deine Entscheidung
- 📌 = Hinweis für das jeweilige Konzept

## Ergebnis in Kürze

- **5 echte Widersprüche** zwischen dem Rohmaterial und späteren Entscheidungen. Der wichtigste: Es gibt drei verschiedene Fähigkeiten-Modelle.
- **6 Abhängigkeitsfehler:** Konzepte stehen in einer früheren Welle als das, worauf sie aufbauen.
- **6 Überschneidungen,** bei denen unklar ist, welches Konzept zuständig ist.
- **5 Lücken,** die in keinem Konzept stehen. Die wichtigsten: ein Gesamt-Budget für Unterbrechungen und Automatik- bzw. Delegationsmodi.
- **Formale Fehler:** Zählung der Konzepte, veraltete Formulierungen, zwei Nummerierungen für die Schritte.

**Der größte Engpass ist K03.** Solange das Fähigkeiten-Modell offen ist, hängen die Engine (K04), die Taktik (K06), das Training (K07) und das Scouting (K18) in der Luft.

---

## A. Widersprüche

| # | Thema | Wo | Konflikt | Lösung |
|---|---|---|---|---|
| A1 | **Fähigkeiten-Modell** | Rohmaterial 4.1 · PLAN K03 Variante B · PLAN K03 Vorschlag | **Drei verschiedene Modelle:** 5 Zahlenwerte (Technik, Tempo, Zweikampf, Abschluss, Spielintelligenz), 8 Zahlenwerte, und „Stärke + erlernbare Merkmale“ (Anstoss-Stil). Das Rohmaterial baut darauf auf: Spielstil-Kreislauf (11), Training (10), Scouting-Spannen (4.5, „Technik 70–80“), Mittelfeld-Duell (5.1). | 🔶 **Entscheidung K03.** Wird es der Anstoss-Stil, müssen die Voraussetzungen des Kreislaufs, die Trainingseinheiten und die Scouting-Spannen neu formuliert werden, über Stärke, Merkmale und Kondition. Die Abhängigkeiten stehen in Abschnitt C. |
| A2 | **Skala der Form** | Rohmaterial 4.3: −3 bis +3 · PLAN K03: 0–20 · Spiel heute: 0–10 | drei Skalen | 🔶 Vorschlag: **0–20** wie bei Anstoss 3, mit 10 als Mitte. Selbstvertrauen bekommt eine eigene Skala, zum Beispiel −3 bis +3. |
| A3 | **Entwicklung der Stärke** | Rohmaterial 10: kleine Schritte pro Trainingseinheit · PLAN K03: Auf- und Abwertungsrunden | zwei Mechaniken | 🔶 Vorschlag: **Stärke** über Würfelrunden, monatlich. **Merkmale** über Lernfortschritt. **Training** verändert beides, also die Chancen in den Runden und das Lerntempo, plus Kondition. Gehört in K03 und K07. |
| A4 | **Strafe fürs Abwerben** | Rohmaterial 12.3 und 12.6: Beschwerde beim Verband und Geldstrafe | PLAN §2: **keine festen Strafen**, stattdessen Beziehung und Klatsch | ✅ Im Rohmaterial als überholt markiert. K20 folgt PLAN §2. |
| A5 | **Zeitsprung** | Rohmaterial 3: „Weiter“ wahlweise bis zum Ereignis, Tag für Tag oder bis zum Spiel | PLAN §2: „Tag beenden“, **höchstens 7 Tage** | ✅ Im Rohmaterial als überholt markiert. K01 folgt PLAN §2. |

## B. Lücken (in keinem Konzept)

| # | Lücke | Warum wichtig | Vorschlag |
|---|---|---|---|
| B1 | **Gesamt-Budget für Unterbrechungen** | Pro Saison kämen zusammen: Ereigniskarten (etwa 40 kleine und 10 große), 12–20 Pressekonferenzen, Interviews nach jedem Spiel, Gerüchte, Angebote, Erinnerungen und Sportgericht. Mit 7-Tage-Sprüngen hält das Spiel dann fast jeden Tag an. Das widerspricht deinem „nicht zu viel“ und der Lehre aus CM 01/02, dass Tempo eine Qualität ist. | 🔶 Unterscheiden zwischen **„hält an“** (Entscheidung nötig) und **„landet im Posteingang“** (nur Info). Dazu ein Ziel für die Unterbrechungen pro Woche, etwa 2–4, als Stellschraube in K01 und K02. |
| B2 | **Automatik und Delegieren** | Die Recherche sagt deutlich: „Tiefe bei hohem Tempo“, sonst zu zeitaufwendig wie FM. Das steht bisher nur verstreut in den Plänen: Co-Trainer zur Pressekonferenz, Automatik beim Training. | 🔶 Grundsatz: **Jeder Bereich hat einen Automatik-Modus über eine Person aus dem Stab,** zum Beispiel Co-Trainer für Training und Aufstellung, Sportdirektor für Verträge und Kader, Pressesprecher für Medien. Ihre Qualität und ihr Charakter bestimmen das Ergebnis. Zuständig: K16, das dafür von klein auf mittel wächst und in Welle 2 rückt. |
| B3 | **Gerüchteküche** | PLAN K29 verspricht „Gerüchte (wahr, halb wahr, falsch)“, der Entwurf K29 behandelt aber nur Pressekonferenzen. Das Rohmaterial 12.5 hat Ansätze. | 📌 In K29 ein eigenes Kapitel „Gerüchte“ ergänzen, oder ein eigenes Konzept K29b. |
| B4 | **Datenmodell in K29** | Der Vorlage nach gehört ein Abschnitt „Begriffe und Daten“ dazu: Journalist, Medium, Gedächtnis der Aussagen, Sprüche-Chronik. Er fehlt, an seiner Stelle steht die Auswertung. | 📌 Bei der Überarbeitung von K29 nachtragen. |
| B5 | **Übergang vom laufenden Spiel** | Das heutige Spiel hat Sponsorwahl, einfachen Stadionbau, Kredit, Gelbsperren, Verträge und anderes. Lehre aus FM26: **nichts wegnehmen, bevor der Ersatz fertig ist.** | 🔶 Grundsatz: Eine bestehende Funktion bleibt, bis ihr Nachfolger umgesetzt ist. U1 baut nur um und streicht nichts, außer dem Bearbeiten im Spiel, das du so wolltest. |

## C. Abhängigkeiten

| # | Konzept (Welle) | braucht | in Welle | Problem | Vorschlag |
|---|---|---|---|---|---|
| C1 | K08 Jugend (2) | K14 Stimmung (3), K18 Scouting (3), K19 Leihe (3), K29 Presse abschirmen (4) | später | Wesentliche Teile fehlen in Welle 2 | 🔶 **K08 in Welle 3 verschieben,** oder in Welle 2 nur den Kern bauen: Volatilität und Prägung, Leihe und Presse später. |
| C2 | K11 Testspiele (2) | K17 Beziehungen (3) | später | „Gegner anfragen je nach Beziehung“ | 📌 In Welle 2 ohne Beziehungen umsetzen, nach Vereinsniveau und Kalender. Beziehungen kommen in Welle 3 dazu. |
| C3 | K05 Live-Spiel (2) | K14 und K15 für die Halbzeitansprache (3) | später | Die Ansprache wirkt auf Stimmung und Glaubwürdigkeit | 📌 In Welle 2 wirkt die Ansprache nur auf das Selbstvertrauen (aus K03). Stimmung und Glaubwürdigkeit folgen in Welle 3. |
| C4 | K18 Scouting (3) | K32 Auslandsspieler (4) | später | Laut §2 sind besonders Spieler aus dem Ausland unbekannt, aber ausländische Ligen gibt es erst mit K32 | 🔶 **Den Auslandspool aus K32 in Welle 3 vorziehen** (nur Spieler, keine Ligen). |
| C5 | K04, K06, K07, K18 (1 bis 3) | K03 Fähigkeiten (1) | gleich | siehe A1 | 📌 K03 als erstes großes Konzept fertig machen. |
| C6 | K12 Saisonvorbereitung (4) | K19 (3), K24 (4), K28 (3) | passt | Die Saisonvorbereitung ist der Rahmen für Transfers und Ziele | 📌 Keine Änderung. Aber K19 und K28 sollten die Vorbereitung als Haupt-Zeitraum schon mitdenken. |

## D. Überschneidungen (wer ist zuständig?)

| # | Thema | taucht auf in | Vorschlag: zuständig |
|---|---|---|---|
| D1 | Glaubwürdigkeit, Versprechen, Abnutzung | K15 und K29 | **K15** führt die Werte, K29 nutzt sie |
| D2 | Halbzeitansprache | K05 und K15 | **K05** für Ablauf und Zeitpunkt, **K15** für die Wirkung |
| D3 | Saisonziel-Gespräch | K12 und K28 | **K28** für das Gespräch, **K12** legt nur den Termin fest |
| D4 | Nachwuchs-Jahrgang | K08 und K32 („neue Talente“) | **K08** für den eigenen Nachwuchs, **K32** für neue Spieler in der übrigen Welt |
| D5 | Verfahren wegen Äußerungen, etwa Schiedsrichterkritik | K29 und K09 | **K09** für Verfahren und Strafmaß. Die Zeile von K09 in PLAN.md um „Äußerungen außerhalb des Spiels“ ergänzen ✅ |
| D6 | Sprüche-Chronik | K29 und K34 | **K34** für die Speicherung, **K29** für den Inhalt. Im Kopf von K29 als Abhängigkeit vermerken 📌 |

## E. Formales

| # | Befund | Status |
|---|---|---|
| E1 | PLAN §6 nennt „34 Konzepte, 8 klein, 20 mittel, 6 groß“. Tatsächlich sind es **35** (K01–K35): **7 klein, 22 mittel, 6 groß**. | ✅ korrigiert |
| E2 | PLAN §7 sagt „idealerweise mit deinem Material zu BMH und Anstoss, falls vorhanden“. Das Anstoss-Material liegt aber schon vor. | ✅ korrigiert |
| E3 | Das Rohmaterial nummeriert die Stufen **L0–L11**, PLAN die Schritte **U1–U19**. Das verwechselt man leicht. | ✅ Im Rohmaterial als überholt markiert |
| E4 | In den Umsetzungsschritten der Welle 3 fehlen K22 (Berater) und K28 (Vorstand). | ✅ ergänzt |
| E5 | Skala der Stärke nicht festgelegt. Das Spiel nutzt heute 1–99, und so sind auch die Wikipedia-Daten geschätzt. Anstoss 3 hatte etwa 5–13 mit Nachkommastelle. | 🔶 Vorschlag: **1–99 behalten**, damit die vorhandenen Daten weiter passen |

## F. Querverweise, die stimmen (zur Kontrolle)

- Seed-Zufall, `regeln.js` und Testskripte stehen überall gleich.
- Torwart-Deckel von ±15 % passt zum Recherche-Wert von 0,1–0,3 verhinderten Toren pro Spiel und zum Akzeptanztest (+4–6 Punkte).
- Transferfenster für alle, verhandeln jederzeit, wirksam im Fenster: PLAN und Rohmaterial stimmen überein.
- Verkaufsregel der Computer-Vereine (erst kaufen, dann verkaufen) gleich in PLAN K31, Rohmaterial 13.3 und Recherche.
- Live-Spiel nur für das eigene Spiel, die Konferenz vorab berechnet: gleich in Rohmaterial 8 und PLAN K05.
- Neu als Prüfpunkt aus der Recherche (FM-Arena): Tempo steckt in zwei Spielstilen des Kreislaufs (Pressing, Konter). Der Sensitivitätstest muss gezielt prüfen, dass Tempo nicht zur Allzweckwaffe wird. 📌 K04, K06

## G. Was ich von dir brauche

1. **K03:** Spielermodell im Anstoss-Stil (Stärke + erlernbare Merkmale + Charakter) oder Zahlenwerte? Mein Vorschlag ist der Anstoss-Stil.
2. **Skalen:** Stärke 1–99 und Form 0–20, einverstanden?
3. **Unterbrechungs-Budget:** „hält an“ gegenüber „Posteingang“, mit etwa 2–4 Unterbrechungen pro Woche?
4. **Automatik und Delegieren** als Grundsatz für alle Bereiche, über Personen im Trainerstab?
5. **Wellen umstellen:** K08 nach Welle 3, den Auslandspool aus K32 nach Welle 3, K16 nach Welle 2?
6. **„Nichts wegnehmen, bevor der Ersatz fertig ist“** als Grundsatz?
7. **Europapokal:** ja oder nein? Davon hängen Kalender, englische Wochen und Finanzen ab (K13).

**Entschieden am 5. November 2026:**
- Zu 1: Anstoss-Stil.
- Zu 2: Form 0–20, Stärke bleibt 1–99.
- Zu 3: 2–4 Stopps pro Woche.
- Zu 7: Europapokal später.
- Punkte 4–6 sind vorläufig übernommen (siehe PLAN §2).

Damit sind A1 bis A3 und E5 aufgelöst: K03 setzt den Anstoss-Stil um, und der Kreislauf, das Training und die Scouting-Spannen werden darauf umgestellt.

---

## H. Nachtrag nach U1 (6. November 2026)

Geprüft: K01, K33 und die Umsetzung U1 gegen PLAN.md, K35 und die übrigen Konzepte.

| # | Befund | Status |
|---|---|---|
| H1 | **Spielplan-Daten:** Die Rahmentermine stehen jetzt in `daten/termine.js` (K01). K13 behandelt laut PLAN ebenfalls den Spielplan. | 📌 Vorschlag zur Zuständigkeit: **K13** pflegt die Termin-Daten (echte Spieltage, Verlegungen, Anstoßzeiten), **K01** den Tagesablauf. |
| H2 | **Geschätzte Termine:** Gesichert sind nur die Eckdaten. Die übrigen Spieltage der 2. Liga und die englischen Wochen der 1. Liga habe ich passend geschätzt. | 📌 K13: offiziellen Spielplan nachtragen. |
| H3 | **Ausfälle in Tagen:** Verletzungen zählen jetzt Tage, Sperren weiter Spiele der eigenen Mannschaft, über alle Wettbewerbe zusammen. | 📌 K09 trennt Sperren nach Wettbewerb, K10 baut Reha auf den Tagen auf. |
| H4 | **43 statt 40 Wochenschritte** pro Saison: Entwicklung, Alterung und Transfermarkt laufen dadurch etwa 7 % öfter. | 📌 K02 und U3 berücksichtigen das bei der Kalibrierung. |
| H5 | **Relegation als echte Spiele:** Sie haben jetzt Folgen für Fitness, Karten, Verletzungen und Noten. Ihre Tore zählen nicht zur Torjägerliste. Bei Gleichstand in der Summe entscheidet weiter ein Los, angezeigt als Elfmeterschießen. | 📌 K13: Verlängerung und Elfmeterschießen im Rückspiel richtig abbilden. |
| H6 | **Transferfenster** stehen in K01 nur als Ereignisart. Wechsel gehen weiter jederzeit, nach dem Grundsatz „nichts wegnehmen, bevor der Ersatz fertig ist“. | 📌 K19 führt die Fenster ein. |
| H7 | **Finanzen** buchen weiter je Ligaspieltag, nicht monatlich. | 📌 K23 (Monatsabrechnung). |
| H8 | **Vorhersage-Bänder** (Ticketpreis) haben noch eine feste Genauigkeit, weil es keinen Stab gibt. | 📌 K16 macht die Breite vom Stab abhängig, wie in K35 vorgesehen. |
| H9 | **Erinnerungen** „kein Trainingsplan“ und „spielfreie Woche ohne Testspiel“ fehlen, weil Trainingsplan und Testspiele noch nicht existieren. | ✅ bewusst, kommen mit K07 und K11 |
| H10 | **Alte Spielstände** (Version 1, Wochenkalender) lehnt das Spiel ab, weil die Ligen jetzt an verschiedenen Tagen spielen. Sie bleiben im Browser gespeichert. | 🔶 Entscheidung K33, Frage 1 |
| H11 | **Sommerpause:** Juni und Juli werden übersprungen, jede Saison beginnt in der Woche vor dem 1. Spieltag der 2. Liga. | 🔶 Entscheidung K01, Frage 1. K12 füllt die Vorbereitung später. |

**Was ich von dir brauche (neu):** die offenen Fragen am Ende von K01 (Sommer, ein Tag je Spieltag, geschätzte Termine, Erinnerungen ab Werk) und K33 (alte Spielstände, eigene Datensätze, Durchsicht der Stärkewerte).

---

## I. Nachtrag nach deinen Entscheidungen (6./7. November 2026)

| # | Befund | Status |
|---|---|---|
| I1 | H1/H2 erledigt: Der offizielle Spielplan 2026/27 steht in `daten/spielplan-2026.js`. K13 pflegt ihn künftig, K01 regelt den Ablauf. | ✅ |
| I2 | H10 erledigt: Alte Spielstände werden gelöscht. H11 erledigt: Der Sommer wird gespielt. | ✅ |
| I3 | **Leerer Sommer:** Bis K11 und K12 umgesetzt sind, besteht der Sommer aus Urlaub, Transfermarkt und Sponsorwahl, etwa zehn Halte ohne viel Inhalt. | 🔶 Vorschlag: K11 und den Sommerteil von K12 in Welle 2 ziehen (PLAN §7). |
| I4 | **Finanzen der 3. Liga** sind grob: Gehälter richten sich nur nach der Stärke, kleine Drittligisten machen dadurch Verlust. Deshalb ist die 3. Liga zum Start noch nicht wählbar. | 📌 K21 und K23. Offene Frage K32a/1. |
| I5 | **Zweitmannschaften:** Kein Aufstieg in die 2. Liga, kein Pokal. Noch nicht geregelt: Erste und Zweite Mannschaft in derselben Liga (wäre nur nach zwei Abstiegen möglich). | 📌 K13 |
| I6 | **Konferenz:** Spiele mit anderer Anstoßzeit am selben Tag laufen in der Konferenz parallel mit. | 📌 K05 (Live-Spiel) |
| I7 | **Regionalliga:** Wechsel des direkten Aufstiegsplatzes abgeleitet, Kapazitäten der Pool-Vereine aus dem Gedächtnis. | 📌 K32a, Fragen 3 und 4 |
| I8 | **Urlaubslänge 2–4 Wochen** ist noch fest, weil es ohne Frische und Stimmung keinen Grund für einen langen Urlaub gibt. | 📌 K03, K12, K14 |
| I9 | **Fehler gefunden und behoben:** Die Aufstellungsansicht änderte beim Anzeigen die gespeicherte Startelf, ohne zu speichern. Nach dem Neuladen wich der Spielstand ab. | ✅ |
| I10 | Entschieden 7.11.: Plan-Reihenfolge nur ändern, wenn es den Bau einfacher oder stimmiger macht. Daher K12a (Sommer) nach Welle 2. Urlaubswahl kommt mit K12a, sobald Frische und Kondition (K03) wirken. Erledigt sind damit I3 und I8. | ✅ |
| I11 | Regionalliga-Aufstieg nach deiner Vorgabe gewichtet: ewige Tabelle der 3. Liga und frische Absteiger. Zwei Fehlzuordnungen aus Wikipedia korrigiert (Bayern-Amateure und Werder II zählten für die ersten Mannschaften). | ✅ |

---

## J. Nachtrag zu K03 (7. November 2026)

Geprüft: `K03-spielermodell.md` gegen PLAN.md, Rohmaterial, Recherche, K01, K29, K35 und den Code (`js/engine.js`, `js/ablauf.js`, `daten/regeln.js`).

| # | Befund | Status |
|---|---|---|
| J1 | **Formspirale im heutigen Code:** Die Note enthält `−(Stärke − 72)/25`. Starke Spieler bekommen also allein wegen ihrer Stärke bessere Noten, dadurch bessere Form, und künftig damit auch mehr Aufwertungen. Das ist die Rückkopplung aus Rohmaterial 1.1. | 📌 **K04** muss die Note gegenüber einer erwarteten Note messen (K03 §5.2). Akzeptanztest „Keine Formspirale“ in K03 §10. |
| J2 | **„Fitness“ vermischt Frische und Kondition.** Deshalb sinkt sie heute im Urlaub, obwohl der Spieler ausgeruht ist. | ✅ K03 trennt beide (§3.2, §5.3). U2 setzt um. Damit wird die Urlaubslänge in K12a eine echte Wahl (I8). |
| J3 | **A1 bis A3 aufgelöst:** Rohmaterial 4.1 (Zahlenwerte), 4.3 (Form −3 bis +3), 4.5 (Scouting-Spannen „Technik 70–80“), 10 (Training je Fähigkeit) und 11 (Kreislauf „braucht Technik“) passen nicht mehr zum Anstoss-Stil. | ✅ Neue Kreislauf-Voraussetzungen und Scouting-Spannen in K03 §9. Rohmaterial im Kopf als ersetzt markiert. |
| J4 | **„Trainingsweltmeister“** steht in PLAN §4 als positive Eigenschaft. Umgangssprachlich meint das meist spöttisch einen, der im Training glänzt und im Spiel nicht. | ✅ Entschieden 7.11.: umgangssprachliche Bedeutung, dazu „Vorbildprofi“ für den reinen Profi. |
| J5 | **Zuständigkeit Beziehungen im Kader:** PLAN §2 nennt sie beim Spielermodell, die Konzeptliste bei K14. | ✅ K03 legt nur die Daten fest (Paarliste `S.bz`), **K14** Entstehung und Wirkung. Integration und Deutsch rechnet K03. |
| J6 | **Stimmung:** Rohmaterial 9 und K03 nennen sie. | ✅ **K14** rechnet, K03 speichert den Wert und nutzt ihn als Bremse beim Lernen. |
| J7 | **Wochenschritte (H4):** Die Entwicklung lief bisher an 43 Wochenschritten pro Saison. | ✅ Entschieden 7.11.: Entwicklung in kleinen Schritten an jedem Spieltag, berechnet für die Tage seit der letzten Verbuchung. Sie hängt also nicht an der Zahl der Spiele oder Wochen. Form, Lernen und Kondition laufen weiter wöchentlich (K02 beachten). |
| J8 | **Talentsterne sind exakt.** `stars()` rechnet aus dem echten Talent. Das widerspricht dem Informationsnebel aus PLAN §2. | ✅ Entschieden 7.11.: Sterne dürfen um einen Stern danebenliegen, nach zwei Jahren im Verein meist genau, ab K16 abhängig vom Co-Trainer. |
| J9 | **Nationalität fehlt in `spieler.js`.** Ohne sie gibt es keine Landsleute, kein Deutsch und keine Herkunft bei der Integration (K03, K14, K18). | ✅ Entschieden 7.11.: Feld `nat` wird festgelegt, Zeitpunkt der Datenpflege offen. Datenquelle: K03 §12, Frage 3. |
| J10 | **Marktwert und Gehalt** hängen heute nur an Stärke, Alter und Talent. | 📌 K19 und K21 nehmen Merkmale und Charakter (Loyalität, Söldner, vereinstreu) dazu. Bis dahin bleibt die heutige Formel. |
| J11 | **Charakter echter Spieler:** Feste negative Eigenschaften in den Daten würden realen Profis einen Stempel aufdrücken. | ✅ Entschieden 7.11.: aus öffentlichen Fakten ableiten (Kapitän, Jahre im Verein, Karten, Verletzungstage), nie aus Klatsch. Der Rest per Zufall (K03 §5.9). |
| J12 | **Abhängigkeit K03 → K04:** Die Form braucht die erwartete Note aus K04, die Merkmale brauchen Haken in K04. | 📌 Vorschlag PLAN §7: K04 als Konzept vor U2, dann U2 und U3 gemeinsam planen. |
| J13 | **Halte-Budget:** K03 erzeugt keine eigenen Halte, nur Infos und höchstens eine Karte mit Entscheidung pro Woche. | ✅ passt zu B1 und PLAN §2 (2–4 Stopps pro Woche). |
| J14 | **Positionen (7.11.):** 14 feine Positionen statt vier Gruppen. Die Engine plant bisher nur Plätze TW/AB/MF/ST, die Formationen in `regeln.js` auch. | 📌 K04 und K06: Plätze und Grundordnungen auf die 14 Positionen umstellen. Bis dahin bestimmt die feine Position nur die Gruppe. Das Merkmal „Spielmacher“ entfällt, weil es jetzt eine Position ist. |
| J15 | **Fuß und Seite** sind neu. Ohne Seiten in der Engine wirken „beidfüßig“ und die Strafe für die falsche Seite erst mit K04/K06. | 📌 K04, K06. Nach „erst zeigen, wenn es wirkt“ erscheint „beidfüßig“ erst dann. |
| J16 | **Lernen im Spiel braucht Szenen aus der Engine:** Ecken, Flanken, Kopfballduelle, Freistöße, Elfmeter, Distanzschüsse, Großchancen, Paraden, Patzer, jeweils mit beteiligtem Spieler. Die heutige Engine kennt nur Tor, Chance, Karte und Verletzung. | 📌 **K04** muss Chancentypen mit Beteiligten liefern. **K06** führt Standardschützen ein. |
| J17 | **Serienbonus und Rückkopplung:** Eine Siegesserie hebt die Form und damit das Wachstum. Ohne Bezug auf die Erwartung würden die Großen immer schneller wachsen. | ✅ K03 §5.2 misst Serien gegen die erwartete Punktzahl aus K04. Test „Serien der Großen“ in K03 §10. |
| J18 | **Paraden und Noten für Torhüter:** Die Form des Torwarts soll an Paraden hängen. Heute bekommt der Torwart eine Note wie jeder andere, ohne Paraden. | 📌 K04: Torwart-Note aus Paraden und verhinderten Toren gegenüber der Erwartung. |
