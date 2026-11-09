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

---

## K. Nachtrag zu K04 (7. November 2026)

Geprüft: `K04-engine.md` gegen K03, PLAN.md, Rohmaterial 5–8, Recherche und `js/engine.js`.

| # | Befund | Status |
|---|---|---|
| K1 | **J1, J16, J18 aufgelöst:** K04 misst die Note gegen eine erwartete Note, liefert Szenen mit Beteiligten und gibt dem Torwart eine Note aus verhinderten Toren. | ✅ K04 §5.9, §3.4 |
| K2 | **Torwart-Deckel:** Rohmaterial 5.1 nennt ±15 %, F nennt den Akzeptanztest +4–6 Punkte. K04 übernimmt ±15 % und legt den Test auf 0,08–0,25 Gegentore und +2 bis +6 Punkte. Die Untergrenze ist neu: Ein besserer Torwart muss auch etwas bringen. | ✅ K04 §10 |
| K3 | **Heimvorteil:** Rohmaterial 5.4 erwartet 43–46 % Heimsiege. 2024/25 waren es 38,6 % (118 Heim-, 111 Auswärtssiege in 306 Spielen). Der Heimvorteil ist gesunken. | ✅ K04 setzt das Ziel auf 40–46 % und den Heimfaktor niedriger. Endwert in K02. |
| K4 | **Positionen in der Engine:** K04 rechnet mit den 14 Positionen aus K03 über Anteile an sechs Teamwerten. Die Grundordnungen in `regeln.js` kennen nur AB, MF, ST. | 📌 K06 stellt die Grundordnungen um. Bis dahin Mischanteile (K04 §3.2). |
| K5 | **Seiten:** K03 hat Fuß und Seitenstrafe, K04 nur einen gemeinsamen Bereich „außen“. | 🔶 vorläufig: gemeinsamer Bereich, K06 entscheidet über getrennte Seiten (K04 §12, Punkt 1) |
| K6 | **Standardschützen** braucht K04 (Ecken, Freistöße, Elfmeter), K03 (Lernen im Spiel) und K06 (Einteilung). | 📌 K06 führt die Einteilung ein. Bis dahin wählt die Engine den Besten. |
| K7 | **Erwartung vor dem Spiel** (Poisson-Näherung) wird von drei Stellen genutzt: Tauziehen (K35a), Serien (K03), Spielbericht (K04). | ✅ eine Funktion, eine Quelle (K04 §5.8) |
| K8 | **Noch unbelegte Zielwerte:** Elfmeter, Fouls, Rote Karten, Torschüsse pro Spiel, Anteil der Tore in der zweiten Halbzeit, Torschnitt 2. und 3. Liga. | 📌 K02 recherchiert vor der Kalibrierung. |
| K9 | **Rote Karte und Sportgericht:** K04 erzeugt Fouls mit Ort und Schwere, die Kartenregeln und Sperren bleiben bis K09 wie heute (Sperre über alle Wettbewerbe, H3). | 📌 K09 |

---

## L. Nachtrag zu K02 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| L1 | **Spielstand:** K02 ersetzt den einen Zufallsstrom `S.zufall` durch Ströme nach Spiel, Tag und Bereich mit Zählern `S.zz`. K33 beschreibt noch `S.zufall`. | 📌 K33 bei U2 anpassen. Alte Spielstände müssen nicht umgewandelt werden (PLAN §1, Punkt 9). |
| L2 | **Seed-Test** prüft heute nur gleichen Verlauf und Speichern/Laden. | 📌 U2 erweitert ihn um „Neuladen bringt nichts“ und „Bereiche unabhängig“ (K02 §10.3). |
| L3 | **Geduld des Vorstands** (`entlassenUnter`, `schonfristSpieltage`) hängt künftig an der Schwierigkeitsstufe. | ✅ K02 §5.4. K28 baut darauf auf. |
| L4 | **Klugheit der Computer-Vereine** als Stufe braucht Entscheidungsregeln mit Qualität. | 📌 K31 |
| L5 | **Talentsterne:** K03 legt „bis 1 Stern daneben“ fest. K02 übernimmt das für „Normal“, „Leicht“ zeigt sie genau. | ✅ passt zu deiner Entscheidung vom 7.11. |
| L6 | **Simulation ohne Browser:** Die Spiellogik ist fast frei von Oberfläche. `welt.js`, `saison.js` und `hilfen.js` rufen an wenigen Stellen `render()` oder `document` auf, `aktionen.js` häufig. | 📌 U2: `tests/sim.js` mit kleinen Attrappen für `render()` und `document`. Aktionen bleiben im Browser-Test. |
| L7 | **Rangkorrelation** Stärke gegen Abschlusstabelle als Maß für die Dosis Zufall ist geschätzt (0,6–0,8). | 📌 vor der Kalibrierung mit echten Daten prüfen |

---

## M. Nachtrag zu K06 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| M1 | **K4 und K5 aufgelöst:** Grundordnungen auf den 14 Positionen mit wählbaren Rollen (K06 §3.1), Seiten getrennt (K06 §5.7). K04 §12 Punkt 1 ist entsprechend geändert. | ✅ |
| M2 | **K6 aufgelöst:** Standardschützen je Art und Reihenfolge im Elfmeterschießen (K06 §5.8). | ✅ |
| M3 | **Konter** ist heute eine Ausrichtung (`tac:'K'`), künftig ein Spielstil. Die Ausrichtung bekommt fünf Stufen. | 📌 U3 baut um. Alte Spielstände müssen nicht umgewandelt werden. |
| M4 | **Tempo als Allzweckwaffe:** „schnell“ ist Voraussetzung für Pressing und Konter. | 📌 Sensitivitätstest in K03 §10 und K04 §10 prüft „schnell“ gesondert. Gegenmittel sind eingebaut: „stellungssicher“ halbiert den Vorteil, Mauern schlägt Konter. |
| M5 | **Spieler hadert mit Position** braucht Gespräche (K15) und Stimmung (K14), beides Welle 3. | 📌 Bis dahin nur als Info ohne Entscheidung. |
| M6 | **Taktiktraining:** K06 rechnet bis K07 mit +5 Vertrautheit pro Woche aus dem normalen Training. | 📌 K07 ersetzt das durch Taktik-Einheiten. |
| M7 | **KI reagiert auf den Spieler** (Kontern des Lieblingsstils) hängt an der Klugheitsstufe aus K02. | ✅ passt zu K02 §5.4 |

---

## N. Nachtrag zu K07 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| N1 | **Trainingsstufe** (locker, normal, hart) steckt heute in K03 (Entwicklung, Kondition, Frische) und K06 (Vertrautheit). K07 ersetzt sie durch Einheiten. | ✅ K07 §5.1–5.3 nennt die Ersatzformeln. K03 und K06 verweisen „bis K07“ auf die Stufe. |
| N2 | **Vertrautheit:** K06 hatte mit „etwa +6 je Taktik-Einheit“ gerechnet, K07 legt +2/+3 fest. | ✅ K06 angepasst, Zeitbedarf einheitlich 6–8 Wochen |
| N3 | **Erinnerung „kein Trainingsplan“** aus K01 (H9) ist mit Vorlagen nie fällig. | ✅ K07 ersetzt sie durch „Plan passt nicht“. K01 bei Umsetzung anpassen. |
| N4 | **Verletzungen** entstehen künftig aus Belastungssprung, Frische und Robustheit. Arten und Dauer fehlen noch. | 📌 K10 |
| N5 | **Plan nach Abstand zum Spiel** braucht den Spielplan mit allen Wettbewerben, auch Pokal und Testspiele. | ✅ gibt es seit U1 (K01, `daten/spielplan-2026.js`). Testspiele kommen mit K11. |
| N6 | **Anteil der Trainingsverletzungen** ist geschätzt (30–50 %). | 📌 vor der Kalibrierung recherchieren |

---

## O. Nachtrag zu K12a (7. November 2026)

| # | Befund | Status |
|---|---|---|
| O1 | **I3 und I8 aufgelöst:** Die Urlaubslänge wirkt über Kondition und die neue Saisonbelastung, der Sommer bekommt weniger leere Halte. | ✅ K12a |
| O2 | **7-Tage-Regel:** K12a schlägt vor, im Urlaub und Laufplan ohne Grenze bis zum nächsten Halt zu springen. Das berührt PLAN §2 („höchstens 7 Tage weit“). | 🔶 **deine Entscheidung** (K12a §12, Frage 1) |
| O3 | **Saisonbelastung** ist ein neuer verdeckter Wert. In K03 §3.2 nachgetragen. | ✅ |
| O4 | **Heutiger Urlaub** dauert vom Saisonende bis zum Trainingsauftakt (etwa fünf Wochen) und senkt die „Fitness“. K12a teilt in Urlaub (2–4 Wochen) und Laufplan. | 📌 Umsetzung mit U6 (Training, Sommer). `training.urlaubAbbau` und `urlaubMin` fallen dann weg. |
| O5 | **Turnierteilnehmer** brauchen Länderspiele und Nominierungen. | 📌 K13 |

---

## P. Nachtrag zu K10 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| P1 | **N4 aufgelöst:** Arten, Dauer, Diagnose, Reha, Rückfall und fit spritzen stehen in K10. | ✅ |
| P2 | **Anteil Trainingsverletzungen:** K07 nannte 30–50 %, K10 leitet 40–55 % aus den UEFA-Raten ab. | ✅ K07 angepasst, bleibt „prüfen“ |
| P3 | **Gehirnerschütterungs-Wechsel:** Ob es in Bundesliga und Pokal einen zusätzlichen Wechsel gibt, ist nicht geprüft. | 📌 K05, vor der Umsetzung nachschlagen |
| P4 | **Quellen:** Die Verletzungszahlen stammen aus Zusammenfassungen. Die Zuordnung einzelner Zahlen zu Links ist nicht am Volltext geprüft. | 📌 vor der Kalibrierung (K02) prüfen |
| P5 | **Verletzungsverlauf** `vh` dient später auch der Ableitung der Robustheit bei echten Spielern (K03 §5.9). | ✅ passt zusammen |
| P6 | **Schwere des Fouls** erhöht das Verletzungsrisiko und umgekehrt die Verletzung das Strafmaß. | 📌 K09 |

---

## Q. Nachtrag zu K05 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| Q1 | **I6 aufgelöst:** Konferenz nur für Spiele derselben Anstoßzeit, frühere Spiele optional vorher als Zuschauer. | ✅ K05 §4.1 |
| Q2 | **P3 teilweise:** Gehirnerschütterungs-Wechsel in der Bundesliga nicht belegt (2021 abgelehnt, IFAB erlaubt seit 2024). | ✅ vorläufig aus, Stellschraube vorhanden |
| Q3 | **C3 und D2 eingehalten:** Halbzeitansprache wirkt in Welle 2 nur auf Selbstvertrauen und Leistung, K15 übernimmt später die Wirkung, K05 behält Ablauf und Zeitpunkt. | ✅ |
| Q4 | **Zurufe an Spieler** brauchen die Reaktionstabelle nach Charakter aus K15. | 📌 K05 nutzt bis dahin eine vereinfachte Form |
| Q5 | **Weiterspielen nach Neuladen** setzt die festen Würfe je Minute aus K02 voraus. | ✅ passt zu K02 §3.1 |
| Q6 | **Noch zu prüfen:** Bankgröße, Zusatzwechsel in der Verlängerung im Pokal, durchschnittliche Zahl der Wechsel. | 📌 vor der Umsetzung (U4) |

---

## R. Nachtrag zu K09 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| R1 | **H3 aufgelöst:** Sperren je Wettbewerb (Liga, Pokal), Gelbsperren nach der 5., 10. und 15. Karte in der Liga, nach der 5. im Pokal, Gelb-Rot ein Spiel, Rot per Verfahren. | ✅ K09 §3.2 |
| R2 | **K9 aufgelöst:** Fouls mit Art und Schwere, Schiedsrichter-Pool ersetzt den vorläufigen Strengefaktor aus K04. | ✅ |
| R3 | **P6 aufgelöst:** Verletzungsfolge erhöht das Strafmaß um ein Spiel. | ✅ K09 §5.2 |
| R4 | **D5 eingehalten:** Verfahren wegen Äußerungen liegen bei K09, der Inhalt bei K29. | ✅ |
| R5 | **Halte-Budget:** Einspruch-Entscheidungen sind Fristen, etwa eine alle zwei Monate pro Team. | ✅ passt zu PLAN §2 |
| R6 | **Noch zu prüfen:** Liga-Rot im Pokal, Karten in der Relegation, aktuelle Trainer-Kartenregel, echte Geldstrafen. | 📌 vor der Umsetzung (U7) |

---

## S. Nachtrag zu K11 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| S1 | **C2 eingehalten:** Zusagen in Welle 2 nur nach Niveau, Kalender, Region und Phase. K17 ergänzt Beziehungen. | ✅ |
| S2 | **I3 weiter aufgelöst:** Testspiele und Lager füllen den Sommer, ohne viele Halte (Testspiele standardmäßig ohne Halt). | ✅ |
| S3 | **Erinnerung „spielfreie Woche ohne Testspiel“** (H9) wird mit K11 aktiv. | 📌 K01 bei Umsetzung |
| S4 | **Zusammenhalt und Zimmerbelegung** brauchen K14. Bis dahin wirken nur Selbstvertrauen und Deutsch. | 📌 K14 |
| S5 | **Geldbeträge** sind Spielwerte. | 📌 K23 kalibriert |

---

## T. Nachtrag zu K13 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| T1 | **H5 aufgelöst:** Relegation ohne Auswärtstorregel, mit Verlängerung und Elfmeterschießen aus der Engine statt Los. | ✅ K13 §3.3 |
| T2 | **I5 vorläufig gelöst:** Zweitmannschaft muss eine Liga tiefer als die erste, echte Regel noch zu prüfen. | 🔶 K13 §12, Punkt 4 |
| T3 | **O5 aufgelöst:** Länderspiele, Nominierung über Nationalität und Schwelle, Turniere im Sommer. | ✅ K13 §3.4. Braucht die Nationalität aus K03 und eine neue Datei `daten/nationen.js`. |
| T4 | **Nominierungen ausländischer Spieler** brauchen den Auslandspool (K32), sonst werden kleine Nationen nur aus unserer Welt besetzt. | 📌 K32 in Welle 3 |
| T5 | **Supercup** ist neu. Termin vor dem 1. Spieltag kollidiert nicht mit der 1. Pokalrunde (22.8.2026, 1. Spieltag 28.8.2026), wenn er am 22. oder 23.8. nicht liegt. | 📌 bei Umsetzung Termin prüfen |
| T6 | **Spielverlegung** wird eine neue Frist-Entscheidung. Selten, belastet das Halte-Budget kaum. | ✅ |

---

## U. Nachtrag zu K16 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| U1 | **B2 umgesetzt:** Automatik und Delegieren je Bereich über eine Person im Stab, Qualität und Haltung bestimmen das Ergebnis. | ✅ K16 §3.3, §5.1 |
| U2 | **H8 aufgelöst:** Breite der Vorhersage-Bänder hängt an der Qualität des zuständigen Mitarbeiters, zusätzlich an der Schwierigkeit (K02). | ✅ K16 §5.2 |
| U3 | **Verweise geprüft:** K07 (Faktor 0,85–1,15, Einzelplätze 5 bei Qualität 10, Athletiktrainer bis −20 %), K10 (Physiotherapeut bis −20 %, mit Reha-Zentrum höchstens −25 %), K03 (Talentsterne), K05 (Halbzeit-Einschätzung) passen zu den Formeln in K16 §5.3. | ✅ |
| U4 | **Ex-Spieler als Mitarbeiter** brauchen Karriereenden aus K32. | 📌 K32 |
| U5 | **Budget für den Stab** kommt mit K28 (Vorstand) und K23 (Finanzen). | 📌 |
| U6 | **K03 abgestimmt:** Alle Fragen sind beantwortet, offen ist nur die Recherche nach einer Datenquelle. Status in PLAN und K03 auf „abgestimmt“ gesetzt. | ✅ |

---

## V. Nachtrag zu K14 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| V1 | **Zusammenhalt** (Mannschaftsgefüge aus Rohmaterial 4.4) ist ein eigener Teamwert. Er war in K11 als Platzhalter (Selbstvertrauen) und in K03 nicht enthalten. | ✅ K14 §5.6. K11 und K06 verweisen darauf. |
| V2 | **Beziehungen:** K03 legt die Daten fest, K14 Entstehung und Wirkung (J5). | ✅ |
| V3 | **Urlaubslänge** wirkt jetzt auch über die Stimmung (K12a, I8). | ✅ K14 §5.1 |
| V4 | **Ruf des Trainers** braucht K28. Bis dahin aus dem Ansehen des Vereins und der Zahl der Trainerjahre. | 📌 K28 |
| V5 | **Kaderrollen** braucht auch K21 (Rolle im Vertrag versprochen). | 📌 K21 |
| V6 | **Stimmung im Zustandsfaktor** (K03 §5.8) bleibt im Deckel 0,80–1,08 zusammen mit Form, Frische und anderen. | ✅ |

---

## W. Nachtrag zu K15 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| W1 | **D1 und D2 umgesetzt:** Glaubwürdigkeit gehört K15, K29 nutzt sie. Halbzeitansprache: Ablauf in K05, Wirkung in K15 §5.5. | ✅ |
| W2 | **Q4 aufgelöst:** Reaktionstabelle nach Charakter für Zurufe, Lob, Kritik und Haltung (K15 §5.2). | ✅ |
| W3 | **M5 aufgelöst:** „Spieler hadert mit Position“ wird zum Gespräch mit Umschulung oder Rückkehr auf seine Position. | ✅ |
| W4 | **Versprechen „kein Konkurrent“** schränkt Transfers ein und muss in K19 geprüft werden, bevor ein Angebot rausgeht. | 📌 K19 |
| W5 | **Gespräche mit dem Vorstand** sollen dieselbe Mechanik nutzen. | 📌 K28 |

---

## X. Nachtrag zu K08 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| X1 | **C1 erledigt:** K08 liegt in Welle 3 zusammen mit K14, K18, K19. Prägung, Verheizen und Leihe sind vollständig beschrieben. | ✅ |
| X2 | **D4 eingehalten:** K08 für den eigenen Nachwuchs, K32 für neue Spieler in der übrigen Welt. | ✅ |
| X3 | **Startstärke des Jahrgangs** zunächst zu niedrig angesetzt (Talent −30 bis −40), passte nicht zur Wachstumsrate aus K03. Korrigiert auf Talent −15 bis −25. | ✅ |
| X4 | **Leihmanager** als neue Rolle im Stab vorgeschlagen. | 📌 K16 in Welle 3 ergänzen |
| X5 | **Belastung junger Spieler** ist ein weiterer Wert neben Frische, Saisonbelastung und Belastungssprung (K07). Vier Belastungsbegriffe können verwirren. | 📌 K35a: auf der Spielerkarte zu einer Anzeige „Belastung“ mit Unterpunkten bündeln |

---

## Y. Nachtrag zu K18 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| Y1 | **A1-Folge erledigt:** Scouting-Spannen über Stärke, Talentsterne, Merkmale und Eigenschaften statt „Technik 70–80“ (K03 §9). | ✅ K18 §3.2 |
| Y2 | **C4:** Der Auslandspool aus K32 ist für Welle 3 vorgezogen (PLAN §2). K18 rechnet mit Grundkenntnis 5 für Auslandsspieler. | 📌 K32 |
| Y3 | **Ehrlichkeit der Spannen** (K35a §10) gilt auch für Scouts: Der Fehler steckt in der Breite. | ✅ |
| Y4 | **Computer-Vereine bewerten unscharf** und können sich irren. Das ist wichtig gegen die Community-Kritik an unfairer KI-Bewertung (Recherche 4) und muss in K31 so umgesetzt werden, dass die Fehler beidseitig sind. | 📌 K31 |

---

## Z. Nachtrag zu K28 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| Z1 | **V4 aufgelöst:** Ruf des Trainers als eigener Wert (K28 §5.4) für das Ruf-Gefälle in K14. | ✅ |
| Z2 | **W5 aufgelöst:** Vorstandsgespräche nutzen die Mechanik aus K15. | ✅ |
| Z3 | **D3 eingehalten:** K28 führt das Zielgespräch, K12b legt nur den Termin fest. | ✅ |
| Z4 | **L3 passt:** Ultimatum-Grenze und Schonfrist kommen aus der Schwierigkeitsstufe (K02). | ✅ |
| Z5 | **Trainerpool** für Computer-Vereine braucht K31 und K32. | 📌 |

---

## AA. Nachtrag zu K21 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| AA1 | **V5 aufgelöst:** versprochene Rolle als Vertragsklausel, gekoppelt an K14 und K15. | ✅ |
| AA2 | **I4 teilweise:** Gehaltsforderungen hängen jetzt an der Liga des neuen Vereins (2. Liga ×0,45, 3. Liga ×0,2). Das entschärft die Verluste kleiner Drittligisten. | 📌 mit K23 kalibrieren, danach 3. Liga als Startverein freigeben (K32a Frage 1) |
| AA3 | **Vorvertrag nach sechs Monaten** ist nicht am FIFA-Text geprüft, und die FIFA plant ab 2027 Änderungen. | 📌 vor der Umsetzung prüfen |
| AA4 | **Felder:** `ct` und `sal` gehen in `vertrag` auf. Betrifft viele Stellen im Code (Gehälter, Marktwert, Ansichten). | 📌 Umsetzung mit U10 |

---

## AB. Nachtrag zu K17, K19, K22 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| AB1 | **H6 aufgelöst:** Transferfenster gelten mit K19, verhandeln geht immer, wirksam nur im Fenster, Vereinslose jederzeit. | ✅ K19 §5.6 |
| AB2 | **W4 aufgelöst:** Das Versprechen „kein Konkurrent“ (K15) wird vor einem Angebot geprüft. | ✅ K19 §9 |
| AB3 | **C2 schließt sich:** Testspiel-Zusagen nach Beziehung (K17 §5.2), wie in K11 vorgesehen. | ✅ |
| AB4 | **Faire KI-Bewertung:** gleiche Formel beim Kaufen und Verkaufen (K19 §5.1), Ausreißer nur aus Schätzfehlern (K18). Passt zu Y4. | ✅, Umsetzung in K31 |
| AB5 | **Derby-Paare** brauchen eine neue Liste in `daten/vereine.js` (K17). | 📌 Umsetzung |
| AB6 | **A4 eingehalten:** keine festen Strafen fürs Abwerben, nur Beziehung und Klatsch (K17). Das Abwerben selbst folgt in K20. | ✅ |

---

## AC. Nachtrag zu K31 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| AC1 | **Verkaufsregeln** (Rohmaterial 13.3, deine Vorgaben) unverändert übernommen, Planstellen auf die 14 Positionen umgestellt. | ✅ |
| AC2 | **Y4 und AB4 umgesetzt:** Computer-Vereine bewerten mit derselben Formel und eigener Schätzung. | ✅ |
| AC3 | **L4 umgesetzt:** Klugheitsstufen mit konkreten Entscheidungsregeln. | ✅ K31 §5.4 |
| AC4 | **Profile als Stammdaten** brauchen eine Ergänzung in `daten/vereine.js` (je Verein ein bis zwei Profile, Lieblingsstil). | 📌 Umsetzung (U11) |
| AC5 | **Neues Testskript** `tests/welt.js` für die Langzeit-Spannung. | 📌 Umsetzung |
| AC6 | **Vorgabe „Note über 10 oder mehr Einsätze schlechter als die Schwelle“** ist im Rohmaterial ohne Zahl. Vorläufig Notenschnitt 4,5 über die letzten 10 Einsätze. | 🔶 bitte bestätigen |

---

## AD. Nachtrag zu K30 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| AD1 | **B1 umgesetzt:** Halte-Budget, Grenzen für Entscheidungskarten je Woche, Monat und Bereich, Regler Meldungsdichte. | ✅ K30 §5.1 |
| AD2 | **Katalog:** etwa 100 Karten aus 20 Konzepten, dazu 8 Ideen aus PLAN §4. Drei davon gehören zu Konzepten der Welle 4 (K24, K26, K27). | ✅ Übersicht in K30 §8 |
| AD3 | **Erlaubte Wirkungen** sind festgelegt. Ein Prüfskript soll jede Karte dagegen prüfen. | 📌 Umsetzung (U12) |
| AD4 | **Lachender Dritter** als Beispiel einer Kette ausgearbeitet (K17, K22, K30). Braucht das Abwerben aus K20 (Welle 4) für die Variante „Treffen“. | 📌 bis K20 ohne Treffen-Option |

---

## AE. Nachtrag zu K32 und Abschluss Welle 3 (7. November 2026)

| # | Befund | Status |
|---|---|---|
| AE1 | **C4, T4, Y2 aufgelöst:** Auslandspool mit Vereinsgruppen je Land, vereinfacht handelnd nach K31. | ✅ K32 §3.1 |
| AE2 | **U4, Z5 aufgelöst:** Ehemalige Spieler werden Mitarbeiter oder Trainer, Trainerpool für Computer-Vereine. | ✅ K32 §3.3, §4.1 |
| AE3 | **Gleichgewicht der Welt** wird nur über Tests kalibriert, nicht im Spiel nachgeregelt (passt zu K02 §5.3). | ✅ |
| AE4 | **Echte Auslandsvereine oder Vereinsgruppen** ist eine Entscheidung mit viel Datenaufwand. | 🔶 deine Entscheidung (K32 §12, Frage 1) |
| AE5 | **Neue Stammdaten-Dateien** aus den Konzepten: `daten/nationen.js` (K13, K32), `daten/ausland.js` (K32), `daten/karten.js` (K30), Ergänzungen in `daten/vereine.js` (Derbys K17, Profile K31) und `daten/spieler.js` (Nationalität, feine Position, Fuß, Fakten für Charakter, K03). | 📌 K33 bei der jeweiligen Umsetzung fortschreiben |
| AE6 | **Übersicht:** Alle vorläufigen Entscheidungen stehen gesammelt in `konzepte/_offene-entscheidungen.md`. | ✅ |

---

## AF. Nachtrag zu K23 (8. November 2026)

| # | Befund | Status |
|---|---|---|
| AF1 | **H7 aufgelöst:** Monatsabrechnung mit Monatsbericht statt Buchung je Ligaspieltag. | ✅ K23 §4 |
| AF2 | **Größenordnung:** Die Geldwerte im Spiel sind heute deutlich kleiner als echte (TV etwa 10 Mio. € pro Saison statt etwa 50 Mio. € im Schnitt der 1. Liga). Alle Geldwerte (Medien, Gehälter, Ablösen, Sponsoren, Bau) müssen gemeinsam umgestellt werden. | 📌 U13 in einem Schritt |
| AF3 | **I4, AA2:** Mit gleichem Einnahmenmodell für alle und Gehältern nach Liga (K21) sollte die 3. Liga wirtschaftlich tragfähig werden. | 📌 Kalibrierung, dann 3. Liga als Startverein freigeben |
| AF4 | **Computer-Vereine:** Pauschaleinnahmen (`fremdeEinnahmen`) entfallen zugunsten des gleichen Modells. | ✅ passt zu K02 §5.3 und K31 |
| AF5 | **Säulengewichtung, 3.-Liga-Topf, Insolvenz-Punktabzug** nicht abschließend belegt. | 📌 vor U13 prüfen |

---

## AG. Nachtrag zu K24–K27 (8. November 2026)

| # | Befund | Status |
|---|---|---|
| AG1 | **Sponsoren** jetzt mit begrenzten Flächen, die heutige Wahl aus drei Angeboten bleibt als Grundform für die Brust. | ✅ K24 |
| AG2 | **Reichweite der Sponsoren:** Exponent 2 ergab eine viel zu enge Spanne (1 zu 5), korrigiert auf 4 (etwa 1 zu 23, wie die echten Hauptsponsoren). | ✅ |
| AG3 | **Fanstimmung** ist ein neuer Teamwert neben den Fans. Sie wirkt auf Nachfrage, Heimvorteil, Vorstand (K28 Umfeld), Sponsoren und Spieler. | ✅ K27 |
| AG4 | **Jugendarbeit** (Stufe 1–5, heute laufende Kosten) wird mit K26 zum Bauwerk „Nachwuchsleistungszentrum“. K08 rechnet mit derselben Stufe. | ✅ |
| AG5 | **Neue Stammdaten:** Ultra-Szene und Tradition (K27), Stadion eigen oder gepachtet und Stehplatzanteil (K26). | 📌 K33 bei Umsetzung |
| AG6 | **Alle Geldbeträge** in K24–K26 sind Spielwerte und werden mit K23 auf echte Größenordnung kalibriert. | 📌 U13 |

---

## AH. Nachtrag zu K12b, K20, K29, K34, K35b (8. November 2026)

| # | Befund | Status |
|---|---|---|
| AH1 | **B3 und B4 erledigt:** K29 hat jetzt Datenmodell (3.4) und Gerüchteküche (4.3). Offene Fragen in K29 vorläufig entschieden. | ✅ |
| AH2 | **A4 eingehalten:** Abwerben in K20 ohne Geldstrafen und Verfahren, nur Beziehung, Klatsch, Vorstand, Fans. | ✅ |
| AH3 | **D6 eingehalten:** K34 speichert die Sprüche-Chronik, K29 liefert sie. | ✅ |
| AH4 | **D3 eingehalten:** K12b legt nur Termine fest, das Zielgespräch bleibt bei K28. | ✅ |
| AH5 | **Alle Konzepte K01–K35b stehen.** PLAN §7 neu geordnet: nächster Schritt ist U2. | ✅ |
| AH6 | **Speicher:** K32 (rund 2.000 Poolspieler) und K34 (Statistik bis 1 MB) zusammen könnten den Browser-Speicher belasten. | 📌 K33: Größe des Spielstands bei U2 und später messen, Ziel unter 3–4 MB |

---

## AI. Nachtrag zur Umsetzung U2 und U3 (8. November 2026)

| # | Befund | Status |
|---|---|---|
| AI1 | **AH6 gemessen:** Spielstand nach drei Saisons rund 0,9 MB, davon 0,83 MB Spieler. Er wächst von Saison zu Saison nicht. | ✅ unter dem Ziel von 3–4 MB, mit K32 und K34 erneut messen |
| AI2 | **K04 §10 und K02:** Die Kalibrierung liegt in `tests/kalibrierung.js`, nicht in `tests/engine.js`. K04 ist angepasst. | ✅ |
| AI3 | **K04 §12 Nr. 6:** Heimvorteil nach Kalibrierung ×1,04. | ✅ in K04 §13 |
| AI4 | **K09 und K04:** Verwarnte Spieler foulen vorsichtiger. Das gehört fachlich zu K09 (Sportgericht, Karten) und steht als Regel in `REGELN.engine.fouls.mitGelb`. | 📌 K09 bei U7 übernehmen |
| AI5 | **K32 und K04:** Wie stark die Favoriten gewinnen, hängt auch am Abstand der Kader in der Welt. In einer Testwelt war er zu klein. | 📌 bei K32 (Weltaufbau) prüfen |
| AI6 | **K03 und K07:** Die fünf Lernplätze aus K07 §12 Nr. 4 sind gebaut, für alle Vereine. K16 ändert später die Zahl über den Co-Trainer (`lernPlaetze`). | ✅ |
| AI7 | **K03 §5.6:** Ohne Grenze wuchsen die Merkmale ungebremst. Neu: Platz für Stärken nach Klasse, Startverteilung im Gleichgewicht, Lerntempo halbiert. Test „Merkmale stabil“ in `tests/spielermodell.js`. | ✅ vorläufig, K03 §12 |
| AI8 | **K08 und K32:** Die 2. Liga startet etwa einen Punkt unter ihrem Gleichgewicht und steigt in den ersten Saisons. Spanne im Test vorläufig 2,0 statt 1,5. | 📌 bei K32 (Weltaufbau) und K08 (Nachwuchs) prüfen |
| AI9 | **Rohmaterial 5.6 und K04 §10:** Torwart-Test bestanden (Spitzentorwart 72 → 84: 0,17 Gegentore weniger, +3,9 Punkte). Rohmaterial verlangte höchstens +4 bis +6 Punkte und höchstens 0,25 Gegentore weniger. | ✅ |
| AI10 | **K04 §12 Nr. 6:** Heimvorteil nach den Akzeptanztests wieder ×1,03, also wie ursprünglich vorgeschlagen. AI3 ist damit überholt. | ✅ |
| AI11 | **K02 §5.4 und K18, K31, K35a:** Schwierigkeit gebaut. Vorhersage-Bänder, Scouting-Spannen und Klugheit der Computer-Vereine greifen erst, wenn K35a, K18 und K31 gebaut sind. Die Werte stehen dann in `REGELN.schwierigkeit.stufen`. | 📌 bei U-Schritten zu K18, K31, K35a ergänzen |

---

## AJ. Nachtrag zur Umsetzung U4a (8. November 2026)

| # | Befund | Status |
|---|---|---|
| AJ1 | **K06 §5.5 und K04:** Die Ausrichtung hat jetzt die fünf Stufen aus K06 (sehr defensiv bis sehr offensiv). Die alte Stufe „Konter“ ist entfallen, sie gehört als Spielstil zu K06 §5.1 (U5). Alte Spielstände mit „Konter“ spielen „ausgewogen“. | ✅ |
| AJ2 | **K03 und K05:** Eingewechselte bekommen Spielpraxis nach Minuten. Die 5 Spielpraxis pro Trainingswoche aus U2b (Ersatz, weil die Engine keine Wechsel kannte) bleiben, bis K07 das Training neu regelt. | 📌 bei U6 (K07) prüfen |
| AJ3 | **K16:** Der Co-Trainer entscheidet beim Sofort-Berechnen nach denselben Regeln wie die Computer-Trainer, noch ohne Qualität. | 📌 bei U6 (K16) |
| AJ4 | **K15:** Zurufe an Spieler und Halbzeitansprache wirken in vereinfachter Form (K05 §12 Nr. 10). Glaubwürdigkeit und Stimmung fehlen noch. | 📌 bei U8 (K14, K15) |
| AJ5 | **K19/K31 und Markt:** Computer-Vereine gaben im Sommer Spieler ab, bis der Kader unter 15 fiel (Datenprüfung im UI-Test, FC Augsburg mit 12). Neu: Verkäufer behalten mindestens 20 Spieler (`markt.verkaeufer.kaderMin`). | ✅ vorläufig, K31 regelt Kaderplanung später |
| AJ6 | **K06 und K05:** Elfmeter-Halt vor der Ausführung und Schützenwahl im Spiel brauchen die Schützenliste aus K06. | 📌 bei U5 |

---

## AK. Nachtrag zur Umsetzung U5a (8. November 2026)

| # | Befund | Status |
|---|---|---|
| AK1 | **K06 §3.5 und K33:** Statt eines Objekts `t.taktik` neue Felder am Verein (`stil`, `vt`, `rollen`, `einstellung`, `schuetzen`, `kater`). K33 ist ergänzt. | ✅ |
| AK2 | **K07 §5.3 und K06 §5.4:** Vertrautheit steigt bis K07 pauschal um 5 pro Woche. Mit K07 kommen Taktik-Einheiten. | 📌 bei U6 |
| AK3 | **K31 und K06 §7:** Lieblingsstil per Zufall, „Spiel der Saison“ ohne Derbys. Vereinsprofile und Derbys kommen mit K31. | 📌 bei U11 |
| AK4 | **K02 §5.4 und K06 §7:** Die Reaktion auf deinen Lieblingsstil nutzt fest die Stufe „normal“ (25 %). Mit der Klugheit der Computer-Vereine (K31) hängt sie an der Schwierigkeit. | 📌 bei U11 |
| AK5 | **K04 §10:** Ballbesitz-Spanne mit Stilen 36–62 %, ein Seed bis 33–60 %. Ziel 15–25 Punkte, also am oberen Rand. | beobachten |
| AK6 | **K13 und Pokal-Auslosung:** In der 1. Runde wurden zwei Bundesligisten gegeneinander gelost (beobachtet: SC Freiburg gegen Borussia Dortmund). Im echten DFB-Pokal treffen in Runde 1 die Profis auf Amateure und Unterklassige. | 📌 bei U7 (K13) |

---

## AL. Nachtrag zur Umsetzung U6a (8. November 2026)

| # | Befund | Status |
|---|---|---|
| AL1 | **AJ2 erledigt:** Die pauschalen +5 Spielpraxis pro Woche sind weg. Reservisten bekommen Spielpraxis aus dem Trainingsspiel am Tag nach dem Spiel. | ✅ |
| AL2 | **AK2 erledigt:** Vertrautheit wächst aus Taktik-Einheiten und Spielvorbereitung (K07 §5.3), das Vergessen bleibt wöchentlich. | ✅ |
| AL3 | **K03 §5.3 und K07:** Die Trainingsstufe ist entfallen. Frischekosten und Konditionsziel kommen aus den Einheiten. Grunderholung 2,1 statt 3 (K07 §12 Nr. 7). | ✅ |
| AL4 | **K10:** Trainingsverletzungen nutzen bis K10 die alten Ausfallzeiten (1–3 Wochen). | 📌 bei U7 (K10) |
| AL5 | **K16:** `stabFaktor` ist vorbereitet (Co-Trainer für Lernen, Umschulung, Vertrautheit; Athletiktrainer für das Verletzungsrisiko), liefert aber noch 1. | 📌 bei U6c |
| AL6 | **K33:** Neue Felder am Verein `vorlage`, `vbTag`, `stdTag`, am Spieler `la`, `lc` (Last), `wk`, `we`, `wt`, `wl` (Wochenreize), `trf` (Trainingsfaktor), `eig` und `um` (Umschulung), `ltag`, `lmin` (letztes Spiel), `tinj` (Trainingsverletzungen der Saison). | ✅ in K33 |
| AL7 | **K12a und K03:** Neuer verdeckter Wert Saisonbelastung `sb` am Spieler, dazu `koVor` (Kondition vor dem Urlaub). Am Verein `urlaub`, `urlaubGesamt`, `urlaubAb`, `urlaubFertig`, im Spielstand `sommer` (Urlaubswochen, Versatz des Auftakts). | ✅ in K33 |
| AL8 | **PLAN §2 (höchstens 7 Tage je „Tag beenden“) und K12a §12 Nr. 1:** Im Urlaub und Laufplan springt der Kalender bis zum nächsten echten Halt. Im Test sind es zwei Halte vom Saisonende bis zum Auftakt. | ✅ vorläufig, bitte bestätigen |
| AL9 | **K03 §10 Form:** Form je Notenpunkt 2,3, Ausgleich 11 % pro Woche (K12a §12 Nr. 9). | ✅ |

