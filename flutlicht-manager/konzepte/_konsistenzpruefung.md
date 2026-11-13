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

---

## AM. Nachtrag zur Umsetzung U6c (9. November 2026)

| # | Befund | Status |
|---|---|---|
| AM1 | **AL5 erledigt:** `stabFaktor` liefert jetzt die Wirkungen des Stabs (Co-Trainer, Athletik-, Torwart-, Standardtrainer, Physiotherapeut, Videoanalyst, Psychologe). | ✅ |
| AM2 | **K07 §12 Nr. 4:** Einzeltrainingsplätze kommen vom Co-Trainer (3 + Qualität/5 je Co-Trainer, höchstens 10), nicht mehr fest 5. | ✅ |
| AM3 | **K23 und K28:** Stabsgehälter sind neue Kosten (Erstligist etwa 3 Mio. € pro Jahr). Ein Budget für den Stab und der Abgleich mit den Einnahmen fehlen noch. | 📌 bei K23 und K28 (Welle 3/4) |
| AM4 | **K10:** Der Mannschaftsarzt hat noch keine Wirkung, der Physiotherapeut verkürzt die alten Ausfallzeiten. | 📌 bei U7 (K10) |
| AM5 | **K33:** Neue Felder im Spielstand `stab` (alle Mitarbeiter), `stabId`, `stabVersion`. | ✅ in K33 |
| AM6 | **K07:** Trainingsverletzungen mit Athletiktrainer nachgestellt (Grundrate 0,00032), Anteil weiter 40–45 %. | ✅ |

---

## AN. Nachtrag zur Umsetzung U7a (9. November 2026)

| # | Befund | Status |
|---|---|---|
| AN1 | **H3 und K9 erledigt:** Sperren gelten je Wettbewerb (Liga mit Relegation, Pokal), Rot läuft über das Sportgericht. `engine.gelbSperreAb`, `engine.rotSperre` und die Kartenquoten in `engine.fouls` gehen in `REGELN.disziplin` auf. `engine.karten` bleibt nur für Amateurklubs. | ✅ |
| AN2 | **AI4 erledigt:** Die Regel für verwarnte Spieler steht jetzt in `REGELN.disziplin.faktoren.mitGelb`. | ✅ |
| AN3 | **K04 §5.11:** Die vorläufige Strenge je Spiel ist durch den Schiedsrichter-Pool ersetzt (Strenge 0,85–1,15, Elfmeterneigung 0,9–1,1). | ✅ |
| AN4 | **K10:** Verletzungsfolge im Strafmaß (+1 bei vier Wochen Ausfall des Gegners) braucht Verletzungen, die mit dem Foul verknüpft sind. | 📌 bei U7b (K10) |
| AN5 | **K09 §5.1:** Der Faktor „Rückstand in der Schlussphase“ verschob die Form zugunsten schwacher Kader und ist vorläufig aus (K09 §12 Nr. 9). Die Ursache ist zu klären, bevor er wieder an geht. | 📌 offen |
| AN6 | **Tests mit kleiner Stichprobe schwanken:** In `kalibrierung.js` (Favoritensiege bei n=72, Heimsieg bei Gleichstarken bei n=226), `taktik.js` (Kreislauf-Mittel) und `training.js` (Verletzungen „dauerhaft hart“) reißen einzelne Seeds, im alten wie im neuen Stand. Über fünf Seeds liegen die Mittel im Ziel (Favoritensiege 71 %, Heimsieg 43 %). Diese Tests sollten über mehrere Seeds mitteln. | 📌 bei der nächsten Testpflege |
| AN7 | **K33:** Neue Felder `schiri`, `verfahren`, `verfahrenId`, `sgArchiv`, am Spieler `sperre`, `kt`, `vg`. Alte Spielstände werden beim ersten Zugriff übernommen (`sus` wird zu `sperre.liga.rot`, `yc` zu `kt.liga`). | ✅ in K33 |

---

## AO. Nachtrag zur Umsetzung U7b (9. November 2026)

| # | Befund | Status |
|---|---|---|
| AO1 | **AM4 und AN4 erledigt:** Der Mannschaftsarzt wirkt auf Diagnose und Spanne. Die Verletzungsfolge (Gegner fällt mindestens 28 Tage aus) erhöht den Strafantrag um ein Spiel. | ✅ |
| AO2 | **K07 und K10:** `engine.verletzung` ist in `REGELN.medizin` aufgegangen. `training.verletzung` behält Grundrate, Belastungssprung und Frische, Art und Dauer kommen aus K10. Die Grundrate im Training ist fünfmal so hoch (0,0016). | ✅ |
| AO3 | **Spielgefühl:** Verletzungen sind etwa fünfmal so häufig wie vorher, aber kürzer. Im Schnitt fehlen 8 % des Kaders statt etwa 2 %. Kaderbreite zählt damit mehr, auch für die Computer-Vereine (K31: Kaderplan). | 📌 beim Spielen beobachten |
| AO4 | **K03:** Der Text von „verletzungsanfällig“ („60 % öfter“) passt nicht mehr, weil dazu die niedrige Robustheit wirkt. | 📌 Text prüfen |
| AO5 | **K10 §10:** Das Verhältnis Spiel zu Training je Stunde (Ziel 3–6) passt nicht zu einem Training-Anteil von 40–55 % bei fast täglichem Training (K10 §12 Nr. 7). | 📌 bei K11 und der Trainingsdauer klären |
| AO6 | **K33:** Neue Felder `vstat`, `krankBis`, am Spieler `vl`, `vh`, `rf`, `spritze`. Alte Verletzungen ohne `vl` laufen als reine Ausfalltage weiter. | ✅ in K33 |
| AO7 | **Akzeptanztest:** Das Tempo (höchstens 4 ms pro Spiel) reißt auf dieser Maschine im Moment auch der Stand vor U7b (5,35 ms). Der direkte Vergleich gibt alt und neu gleich schnell (4,3–4,4 ms). Die Sensitivität der Abwehr (+0,8 bis +1,4) schwankt je Seed wie vorher, im Mittel ist sie etwa 0,1 Punkte kleiner, weil Spieler im Spiel öfter verletzt ausfallen. | 📌 wie AN6: über mehrere Seeds mitteln, Tempo-Grenze an die Maschine binden |

---

## AP. Nachtrag zur Umsetzung U7c (9. November 2026)

| # | Befund | Status |
|---|---|---|
| AP1 | **AK6 erledigt:** Runde 1 wird aus Profitopf und Amateurtopf gelost, zwei Erstligisten treffen dort nie aufeinander. | ✅ |
| AP2 | **H5, T1 erledigt:** Die Relegation hat Verlängerung und Elfmeterschießen im Rückspiel, kein Los mehr. | ✅ |
| AP3 | **T2:** Die Regel für Zweitmannschaften ist gebaut (eine Liga tiefer, der beste Absteiger bleibt), die echte Regel ist weiter nicht geprüft. | 🔶 K13 §12 Nr. 11 |
| AP4 | **72 Stunden:** Der feste Pokaltag je Runde ergab bis zu 124 Spiele mit weniger als drei Tagen Abstand in drei Saisons, der Spielplan-Generator in den Folgesaisons weitere 50. Behoben durch Spielverlegungen nach der Auslosung und `planReparieren`. | ✅ |
| AP5 | **AI5 und K13 §10:** In der Relegation setzt sich der Erstligist im Spiel nur in etwa 50 % durch, echt sind es etwa 80 %. Grund ist der zu kleine Abstand der Kader zwischen dem Ende der 1. und der Spitze der 2. Liga. | 📌 bei K32 (Weltaufbau) |
| AP6 | **K03, K32:** Länderspiele brauchen Nationalitäten. | 📌 bei K32 und dem Auslandspool |
| AP7 | **UI-Test:** Der Knopf „Annehmen“ beim Sportgericht (U7a) wurde mit dem eines Transferangebots verwechselt. Er heißt jetzt „Strafe annehmen“. | ✅ |
| AP8 | **K33:** Neue Felder `supercup`, `cup.los`, `relSp[].pen`, am Spieler `spritzeAm` (Tag der letzten Spritze, für die Prüfung der Einsätze). | ✅ in K33 |

---

## AQ. Nachtrag zur Umsetzung U7d (9. November 2026)

| # | Befund | Status |
|---|---|---|
| AQ1 | **K11 §10 und §5.3:** Das Ziel „eine Woche Vorsprung“ passt nicht zur Vertrautheit ×1,25 im Lager. Gebaut ist ×1,25 (K11 §12 Nr. 10). | 📌 bei Bedarf Wert erhöhen |
| AQ2 | **K11 §10:** Lagerkoller 10 % pro Tag ergibt bei zehn Tagen nur 27 % statt „mindestens ein Drittel“. Jetzt 13 %. | ✅ |
| AQ3 | **Computer-Vereine** spielen noch keine Testspiele und fahren in kein Lager. Ihre Spieler haben im Sommer daher weniger Spielpraxis als deine. | 📌 bei K31 (Computer-Vereine) oder UL |
| AQ4 | **K32:** Auslandsvereine als Gegner im Trainingslager kommen mit den echten Vereinsnamen (PLAN §2, 8.11.). | 📌 bei K32 |
| AQ5 | **K33:** Neue Felder `testspiele`, `testId`, `lager`. | ✅ in K33 |
| AQ6 | **K07:** In der Vorbereitung plant die Automatik meist „Aufbau“ ohne Taktik-Einheiten. Die Vertrautheit wächst dort nur über Spiele, und der Lager-Bonus für Vertrautheit greift nur mit einer Vorlage mit Taktik (zum Beispiel „Standard“). Die Vorlage „Vorbereitung“ mit Taktik-Einheiten kommt selten zum Zug. | 📌 bei K07 prüfen |
| AQ7 | **Kalibrierung nach Welle 2:** Über neun Seeds liegen die Favoritensiege (Top 3 gegen Letzte 3) bei 75,6 % (vor U7b 73,0 %, Ziel 65–75 %), der Heimsieg bei gleich Starken bei 43,8 %, Remis bei 23,9 %. Mehr Verletzungen (U7b) treffen vermutlich die schwächeren Kader stärker. Der Unterschied liegt im Rauschen, aber beide Werte sitzen am oberen Rand. | 📌 einmal gesamt nachkalibrieren (mit AN6, über mehrere Seeds) |
| AQ8 | **Kalender:** Relegation (Donnerstag, Montag) und Pokalfinale (Samstag dazwischen) liegen wie im echten Plan so dicht, dass ein Verein in beidem dreimal in fünf Tagen spielt. Die 72-Stunden-Prüfung nimmt diesen Fall aus. | 📌 echte Regel bei einem solchen Zusammentreffen prüfen |

---

## AR. Nachtrag zu K36 (9. November 2026)

| # | Befund | Status |
|---|---|---|
| AR1 | **Wort „Stufe“ dreifach belegt:** Schwierigkeit (K02, im Code `stufe()`), Wechselwunsch (K14) und Lernstufen. Die Lernstufen heißen deshalb im Spiel und im Code „Lizenz“ (`S.lizenz`, `REGELN.lizenz`, `frei()`). | ✅ K36 §3 |
| AR2 | **K09 hatte keine Lernstufen-Notiz.** Nachgetragen als K09 §12 Nr. 15 (Sportgericht ab A-Lizenz, nach PLAN §4). | ✅ |
| AR3 | **PLAN §4 gegen K36:** Stadion steht in PLAN §4 bei Stufe 4, in K36 bei Pro (5), dazu der Kredit. Grund: Die Pro-Lizenz wäre bis Welle 4 sonst leer (K36 §12 Nr. 4). | ✅ vorläufig |
| AR4 | **Automatik braucht Regeln der Computer-Vereine** für Testspiele (AQ3), Vertragsverlängerungen eigener Spieler und Kredit. Ohne sie wäre die Automatik für dich ein zweites Regelwerk. | 📌 UL |
| AR5 | **K16 §5.1 (Automatik mit Rauschen nach Qualität)** ist noch nicht gebaut. Bis dahin nutzt die Automatik die Klugheit „normal“. | 📌 K16 / UL |
| AR6 | **K01 Erinnerungen:** Erinnerungen zu gesperrten Bereichen (zum Beispiel „Kein Sponsor gewählt“ vor der A-Lizenz) müssen entfallen. | 📌 UL |
| AR7 | **U8 schon mit Lizenz je Funktion:** Stimmung sehen ab Teamleiter, Gespräche, Mannschaftsansprache und Kapitän ab C, Kaderrollen, Versprechen und Teamevent ab B (K36 §5.2). | ✅ K14 §12 Nr. 20, K15 §12 Nr. 19 |

---

## AS. Nachtrag zur Umsetzung U8 (9. November 2026)

| # | Befund | Status |
|---|---|---|
| AS1 | **K14 §5.1 gegen §10:** Mit der relativen Einsatz-Lücke (Anteil gegen Erwartung in Prozent der Erwartung) bekam jeder Ergänzungsspieler ohne Minuten die vollen −25, es gab etwa fünf offizielle Wechselwünsche je Kader und Saison (Ziel höchstens einer). Gebaut ist die absolute Lücke mit Spanne −28 bis +10 (K14 §12 Nr. 5). | ✅ |
| AS2 | **K14 §3.1:** „Rang nach Stärke auf seiner Position“ passt nicht zur Aufstellung, die nach Feinposition und Eignung wählt. Stammspieler sind jetzt die Spieler der besten Elf ohne Ausfälle (K14 §12 Nr. 6). | ✅ |
| AS3 | **K14 §10 Bankplatz:** „nach sechs Wochen“ ist mit 20 % Trägheit nicht erreichbar. Test auf zwölf Wochen (K14 §12 Nr. 10). | ✅ vorläufig |
| AS4 | **K11 und K14:** Der Platzhalter „Selbstvertrauen im Lager“ ist durch den Zusammenhalt ersetzt (+1 pro Tag bis zum 7. Tag). | ✅ |
| AS5 | **K15 §5.1 und §5.3:** Ein Einsatz-Versprechen an einen Stammspieler, der ohnehin spielt, wäre leicht zu halten und brächte Glaubwürdigkeit. Jedes Thema braucht deshalb einen Anlass (K15 §12 Nr. 6), der Test prüft das. | ✅ |
| AS6 | **K15 §5.5:** „Passende Halbzeitansprache +1“ hätte mit der immer passenden Ansprache „Taktik“ Glaubwürdigkeit verschenkt. Nur Ansprachen mit Anlass zählen (K15 §12 Nr. 15). | ✅ |
| AS7 | **K28:** Ruf des Trainers für das Ruf-Gefälle und die Glaubwürdigkeitskrise beim Vorstand sind Platzhalter (K14 §12 Nr. 11, K15 §12 Nr. 16). | 📌 K28 |
| AS8 | **K21:** Der Baustein „Vertrag“ ist vorläufig auf −8 begrenzt, weil Gehälter nur beim Verlängern steigen. Wer sich stark verbessert, ist sonst dauerhaft unzufrieden. | 📌 K21 |
| AS9 | **K32:** Landsleute, Sprache und „Nationalspieler sieht sich mindestens als Stammspieler“ brauchen Nationalitäten. | 📌 K32 |
| AS10 | **K02:** Computer-Trainer lösen Gesprächswünsche mit 55 % (Klugheit „normal“), bis es Klugheitsstufen gibt. | 📌 K02 |
| AS11 | **Engine:** Zusammenhalt (±3 %) und Endspiel-Rede (+2 % für ein Spiel) wirken über den Faktor je Spieler in der Minute (`G.bonus`), nicht über die erwarteten Tore vor dem Spiel. Die Note gegen die Erwartung (Form) misst so auch den Zusammenhalt mit. Vergleich vor und nach U8 über vier Seeds (je drei Saisons): Heimsiege 42,75 % gegen 42,75 %, gleich Starke 43,25 % gegen 42,75 %, Favoritensiege 73 % gegen 75 % (n = 54 je Seed, im Rauschen, aber weiter am oberen Rand, AQ7). `tests/kalibrierung.js` zeigt schon vor U8 in jedem Seed rote Werte. | 📌 bei der Gesamtkalibrierung prüfen |
| AS13 | **`tests/sommer.js`, Kondition zum ersten Ligaspiel (Ziel 80–88):** Der Wert schwankt je Seed um mehrere Punkte. Seed 5: vor U8 82,6, danach 79,5; Seed 8: vor U8 76,9, danach 81,2; Mittel über vier Seeds vor U8 80,95, danach 80,85. Kein Effekt von U8, aber der Test ist mit einem Seed zu knapp. | 📌 Test über mehrere Seeds mitteln oder Spanne prüfen |
| AS14 | **`tests/medizin.js`, Rückfall nach einer Zerrung (Ziel 10–15 %):** nach U8 je Seed 16 % (Seed 4), 14 % (5), 13 % (6), 17 % (7), vor U8 mit Seed 4 14 %. U8 berührt Verletzungen nicht, der Wert liegt im Mittel an der oberen Grenze. | 📌 mit K10 nachkalibrieren oder über mehrere Seeds prüfen |
| AS15 | **`tests/akzeptanz.js`, Sensitivität der Abwehr (+0,8 statt 1–3 Punkte):** wie schon in AO7 vor U8. Der Test spielt nur Einzelspiele mit Startwerten, in denen Stimmung und Zusammenhalt noch nicht wirken. | 📌 wie AO7 |
| AS12 | **K33:** Neue Felder für Stimmung, Rollen, Wechselwunsch, Beziehungen, Versprechen, Glaubwürdigkeit und Zusammenhalt (K33 §3). Version bleibt 4, Felder entstehen beim ersten Gebrauch. | ✅ in K33 |

---

## AT. Nachtrag zu deinen Entscheidungen vom 10. November 2026 (Bankzeit, Verträge)

| # | Befund | Status |
|---|---|---|
| AT1 | **K14 Bankzeit nach Grund ersetzt die Einsatz-Lücke aus U8** (K14 §12 Nr. 5): Heute zählt Rotation wegen Frische als fehlende Einsatzzeit, die Nummer 2 im Tor und Talente haben eine kleine Erwartung (15 %) und verlieren leicht, Joker-Tore zählen nicht. | 📌 U8d |
| AT2 | **Neue Daten für U8d:** Spieltagskader je Pflichtspiel (die Bank gibt es in der Engine), Grund des Bankplatzes, Rivalen-Zähler, Profi-Pflichtspiele über die Karriere (heute zählt `apps` nur die Saison). | 📌 U8d, K33 |
| AT3 | **K08 Prägungsereignisse** (Debüt, erstes Topspiel) bauen auf „Unerfahrene freuen sich über Kurzeinsätze“ auf. Beides muss zusammenpassen. | 📌 K08 / U9 |
| AT4 | **K21 Vorlagenprämie** braucht Torvorlagen in der Engine, die es noch nicht gibt. | 📌 U10 oder K34 (Statistik) |
| AT5 | **K21 und K23:** Prämien müssen je Spieltag und am Saisonende gebucht werden. Die Ligaklausel senkt beim Abstieg die Gehaltssumme. Ohne sie bleibt das volle Gehalt, das größte Abstiegsrisiko (K23). | 📌 U10 |
| AT6 | **K21 und K14:** Prämien hängen am Einsatz. Bankplätze kosten Prämien und damit Stimmung (Söldner doppelt). Das gehört in den Baustein „Vertrag“, sobald es Prämien gibt. | 📌 U10 |
| AT7 | **K36:** Prämien und Klauseln ab der A-Lizenz, Verlängern mit Laufzeit und Grundgehalt ab B (K36 §5.2, „später dazu“). | ✅ |

---

## AU. Nachtrag zu deinen Anregungen vom 10. November 2026 (Bankzeit, Personal, Reiche werden reicher)

| # | Befund | Status |
|---|---|---|
| AU1 | **K14 Bankzeit nach Grund** ist auf 25 Fälle erweitert. Einige brauchen andere Konzepte: „Position erklären“ (K15, war ausgelassen) mit dem Fall „passt nicht ins System“ (K06), teurer Neuzugang und Vertragsjahr (K19, K21), Mentor (K08), Leihwunsch (K08, K19), neuer Trainer (K28), Länderspiele (K13, K32). | 📌 U8d und die jeweiligen Konzepte |
| AU2 | **Neue Kaderrolle „Pokal“** (Pokaltorwart, Pokalelf) ergänzt die fünf Rollen aus K14 §3.1. | 📌 U8d |
| AU3 | **K16 Nr. 2 geändert:** Der Platzwart ist jetzt als Greenkeeper eine Rolle im Stab, nicht mehr nur Teil von K26. | ✅ K16, K26 |
| AU4 | **Verhandlungsboni stapeln sich** (Sportdirektor, Berater-Beziehung, Klauseln, Marketingleiter beim Sponsor): Deckel −15 % auf Forderungen, +18 % auf Sponsorangebote. | ✅ K16 §12 Nr. 14, 16 |
| AU5 | **K02 §5.3 bleibt gültig:** Der Vorsprung der Großen entsteht nur aus Regeln (Geld, Anziehung, Personal, Kontakte, Infrastruktur, Talente, Ansehen), nicht aus Zuschlägen. | ✅ K02 §5.3a |
| AU6 | **Kalibrierung:** Heute wird Bayern in neun simulierten Saisons viermal Meister (häufigster Meister). Ziel nach deiner Entscheidung: etwa zwei Drittel (55–75 % über 20 Saisons), nicht 13 von 14 wie zuletzt in echt. Ohne Markt (U10, U11), Geld in echter Größenordnung (U13) und Europapokal (K37) lässt sich das nicht sinnvoll einstellen. | 📌 Test nach U11 |
| AU7 | **Europapokal-Pauschale** (K23) bis zum echten Europapokal: nur Geld, keine zusätzlichen Spiele. Die Belastung durch englische Wochen fehlt damit den Großen, das macht sie etwas stärker als in echt. | 📌 bei der Kalibrierung beachten |
| AU8 | **K26 Logen** bekommen eine zweite Aufgabe: Einladungen für Berater (K22). | ✅ K22 §12 Nr. 3 |
| AU9 | **Machtwechsel über Jahrzehnte:** Ansehen muss sinken können, Computer-Vereine müssen Fehler machen dürfen (Schulden, falsche Käufe, Trainerwechsel), Talent-Jahrgänge müssen schwanken. Sonst bleibt die Rangfolge über 30 Saisons starr. Betrifft K08, K23, K28, K31, K32. | 📌 Langzeittest über 30 Saisons nach U11 |
| AU10 | **Europapokal** ist jetzt fest eingeplant (K37, Welle 4b), nicht mehr nur „später“. Er braucht die Auslandsvereine aus K32, eine eigene Kalibrierung ihrer Stärke, mehr Termine im Kalender (K01, K13) und die Belastung (K07, K12a). Die Pauschale aus K23 fällt dann weg. | 📌 K37 |
| AU11 | **Vereinswert statt Ansehen:** Das Kalibrierziel folgt jetzt dem Vereinswert (Kader, Finanzkraft, Ansehen, Infrastruktur, Stab). K19 (Wahl des Vereins durch Spieler) und K16 (durch Mitarbeiter) sollen ihn statt des reinen Ansehens nutzen. Der Wert muss in K23 oder K28 definiert werden. | 📌 K19, K23, K28 |
| AU12 | **Doping weggelassen, Manipulation als sehr seltene Ereigniskarte** (entschieden 10.11.): K30 §8.4 braucht vom Sportgericht (K09) Wiederholungsspiele und Annullierungen, vom Kalender (K13) Nachholtermine und eine Tabelle, die gestrichene Ergebnisse verträgt. Das ehemalige Ideen-Konzept K38 ist darin aufgegangen. | 📌 K09, K13, K30 |
| AU13 | **K30 Seltenheitsstufen:** Mit 1000 Szenarien in vier Stufen kommen etwa 69 Karten pro Saison, die meisten als Info. Das Budget für Halte und Entscheidungen (K30 §5.1) bleibt die Grenze. Ein Kartenlabor muss die Raten prüfen, weil Bedingungen die echte Häufigkeit senken. | 📌 Gerüst K30 (U12) |

---

## AV. Nachtrag zur Umsetzung U9a (11. November 2026)

| # | Befund | Status |
|---|---|---|
| AV1 | **K18 §3.2 und §5.2 gegen §10:** Mit ±8 bei Kenntnis 20–39 und einem Scout-Fehler von 0,3 × (21 − Qualität) wäre jeder Kauf eines „Besten aus zehn“ in der Mehrzahl der Fälle ein Fehlkauf gewesen, und ein durchschnittlicher Scout hätte die Spanne verbreitert. Kalibriert (K18 §12 Nr. 5). | ✅ |
| AV2 | **K31, K19:** Computer-Vereine kennen noch alle wahren Werte. K18 §7 verlangt, dass auch sie mit Unsicherheit bewerten (glaubwürdige Fehlkäufe und Schnäppchen). | 📌 U11 |
| AV3 | **K32, K08:** Grundkenntnis für Ausland (5) und Jugendspieler (0) ist vorbereitet, aber ohne Auslandspool und Jugendkader noch ohne Spieler. | 📌 U9b, U9c |
| AV4 | **K36:** Neue Bereiche `beobachten` (C) und `suchauftrag` (A) in §5.2 eingetragen. | ✅ |
| AV5 | **Kaderstärke der Gegner** (Vorbericht, Spielkarte) bleibt ein genauer öffentlicher Wert. Wer will, kann daraus grob auf einzelne Spieler schließen. | 📌 mit der Gegnerbeobachtung prüfen |
| AV6 | **Talent fremder Spieler:** Die Sterne haben ihren Schätzfehler wie bisher, aber die Kenntnis macht sie noch nicht genauer (K18 §3.2 sieht das vor). | 📌 U9c (Jugend) |
| AV7 | **K33:** neue Felder `kenntnis`, `auftraege`, Rolle `scout`. | ✅ in K33 |
| AV8 | **Tempo der Engine** (`tests/akzeptanz.js`, höchstens 4 ms je Spiel): diesmal 4,79 ms. U9a ändert die Engine nicht, eine direkte Messung vor und nach U9a auf derselben Maschine ergibt beide Male etwa 6 ms (andere Messart). Die Maschine schwankt (wie AO7). | 📌 wie AO7 |
| AV9 | **Fehler aus U8, gefunden vom Zufallstest:** Nach dem Saisonwechsel blieb ein Gesprächswunsch stehen, wenn der Vertrag des Spielers ausgelaufen war. Behoben (`kabineNachSaisonwechsel`). | ✅ |

---

## AW. Nachtrag zur Umsetzung U9b (11. November 2026)

| # | Befund | Status |
|---|---|---|
| AW1 | **K32 §3.1 gegen den Code:** „Gespeichert in `S.pl`“ hätte jede Schleife über die Ligaspieler getroffen (Training, Spieltag, Kabine, Markt setzen einen deutschen Verein voraus). Der Pool liegt getrennt in `S.ausland.pl`, mit eigenem Nummernkreis und eigenen Zufallsströmen. Zwei simulierte Saisons liefern nach U9b dieselben Ergebnisse wie davor. | ✅ K32 §12 Nr. 7, 8 |
| AW2 | **K32 §3.1 gegen §10 (Pool stabil, Gleichgewicht):** Ein frisch erzeugter Pool ist nicht im Gleichgewicht. Alle Talente waren gleich jung und wuchsen zusammen hoch: Spieler ab Stärke 85 stiegen von 100 auf 167 und fielen auf 87, über 13 Saisons. Jetzt läuft der Pool beim Aufbau sechs Saisons vor. | ✅ K32 §12 Nr. 9 |
| AW3 | **K32 §5.2 (Talent nach Ansehen) gegen K03 (Talent = Stärke + Zufall):** Mit der Talent-Tabelle aus K03 allein wuchsen bei den Spitzenvereinen rund 30 Spieler ab Stärke 90 heran, bis 97. Im Pool hängt das Talent deshalb am Verein (höchstens Grundstärke + 6, Talente + 8). | ✅ K32 §12 Nr. 6 |
| AW4 | **K32 §3.1, §7, §10:** „Auslandsvereine kaufen und verkaufen wie Computer-Vereine“ gilt bisher nur gegenüber dir (Kauf, Angebote für deine Spieler) und innerhalb des Pools (Wechsel zu größeren Vereinen im Sommer). Computer-Vereine kaufen noch nicht im Ausland, Auslandsvereine nicht bei ihnen. Die Tests „Abwanderung“ und „Rückkehrer“ aus K32 §10 fehlen deshalb. | 📌 U11 (K31), `tests/welt.js` |
| AW5 | **K32 §12 Nr. 3:** Die Nationen-Tabelle hat 148 Nationen statt aller Länder der Welt (alle mit abrufbarem Rang und alle, die im Spiel vorkommen). | ✅ vorläufig, K32 §12 Nr. 17 |
| AW6 | **AS9 teilweise erledigt:** Alle Spieler haben eine Nationalität, `landsleute()` und `gleicheSprache()` stehen bereit. Die Wirkung fehlt: Integration und Deutschkenntnisse (K03 §5.5), Heimweh, Grüppchen und Freundschaft unter Landsleuten (K14). „Nationalspieler sieht sich mindestens als Stammspieler“ braucht Nominierungen (K13). | 📌 K03, K14, K13 |
| AW7 | **K13:** Nationen-Tabelle und Nationalitäten sind da, Nominierung, Abstellung und Rückkehr nicht. Der Auslandspool liefert die Spieler ausländischer Ligen dafür. | 📌 eigener Schritt |
| AW8 | **K18 §12 Nr. 9 verschärft sich im Ausland:** Die Ablöseforderung beruht auf dem wahren Wert. Bei Grundkenntnis 5 (Spanne ±10) verrät sie mehr als die Spanne. | 📌 U10 (Verhandlung, Preis als Signal) |
| AW9 | **K16, K18:** Das Gebiet eines Scouts ergibt sich aus seiner Nummer (etwa die Hälfte Inland, je ein Viertel Jugend und Ausland). Seit U9b zählt es, deshalb steht es jetzt in der Stab-Ansicht. Vereine mit einem Scout haben oft keinen für das Ausland. Computer-Vereine nutzen ihre Scouts noch nicht. | ✅ sichtbar, 📌 U11 |
| AW10 | **K36:** neuer Bereich `ausland` (B-Lizenz), Suchauftrag im Ausland mit `suchauftrag` (A), Angebote aus dem Ausland mit `transfers` (C), Auslandsmarkt ansehen frei. | ✅ K36 §5.2 |
| AW11 | **K33:** neue Dateien (`daten/ausland.js`, `daten/nationen.js`, `js/ausland.js`), neue Felder (`nat`, `ausland`, `krit.region`). Spielstand: zum Start 1,7 MB (Pool 0,74 MB), nach einer Saison 2,4 MB, höchstens 2,53 MB in sechs Saisons. Der Zuwachs kommt von den Ligaspielern (von 1,0 auf 1,6 MB, viele Felder mit langen Nachkommastellen aus U6–U8), nicht vom Pool. Das Ziel 3 MB hält, die Reserve ist klein. | ✅ in K33, 📌 Werte der Ligaspieler runden |
| AW12 | **K23:** Reisekosten Ausland, Budget der Auslandsvereine (Finanzkraft² × 12.000 €) und der Ablösefaktor sind Spielwerte. | 📌 K23 |
| AW13 | **K37 (AU10):** Ansehen und Finanzkraft der Auslandsvereine sind von mir geschätzt, die Teamstärke ist die Grundstärke aus dem Ansehen. Für den Europapokal braucht das eine eigene Kalibrierung. | 📌 K37 |
| AW14 | **Datenpflege:** Die Websuche hat mehrere Annahmen korrigiert, die ich ohne Prüfung getroffen hätte (West Ham, Girona und Nantes abgestiegen, Belgien mit 18 Vereinen, Coventry, Hull, Le Mans und Vaduz aufgestiegen). Die Vereinsliste gilt für 2026/27 und veraltet mit jeder Saison (K32 §4.2). Die Nationalitäten stammen aus maschinell gelesenen Wikipedia-Tabellen. Drei ungewöhnliche Einträge (zwei Nachwuchsspieler von Hertha BSC, einer von Energie Cottbus) habe ich ein zweites Mal abgerufen und so belassen. | 📌 Datenpflege je Saison |
| AW15 | **Tests, die schon vor U9b rot waren, sind unverändert.** Gemessen auf derselben Maschine mit dem Stand vor U9b in einem zweiten Ordner: `tests/kalibrierung.js` Ausgabe Zeile für Zeile gleich (vier rote Werte: Elfmeter pro Spiel, Sieg des Favoriten, Heimsieg gleich starker Teams, Spanne Ballbesitz), `tests/medizin.js` gleich (Rückfall nach Zerrung 17 % von 930), `tests/akzeptanz.js` gleich bis auf das Tempo (Abwehr +0,8; Tempo 3,76 ms nach U9b, 3,56 ms davor, beide grün). | 📌 wie AS13–AS15, AV8 |
| AW16 | **`tests/README.md`:** „etwa 1 s je Saison“ für `tests/sim.js` war veraltet. Gemessen sind 18 s je Saison, vor und nach U9b gleich. | ✅ berichtigt |
| AW17 | **Aufbau einer neuen Welt:** etwa 0,3 statt 0,12 Sekunden (Pool mit Vorlauf). Die Spielererzeugung ist dafür beschleunigt (41 statt 76 Mikrosekunden je Spieler, gleiche Welt: Prüfsumme vor und nach der Änderung gleich). | ✅ |
| AW18 | **Alte Spielstände** haben keinen Pool und keine Nationalität (Anzeige „unbekannt“). Die Version bleibt 4, wie bei U8 und U9a (PLAN §1 Nr. 10). | ✅ |

---

## AX. Nachtrag zur Umsetzung UL (12. November 2026)

| # | Befund | Status |
|---|---|---|
| AX1 | **K36 §5.2 gegen §5.1 Nr. 1:** Die Tabelle sah für Einstellung („normal“) und Sommer (Urlaub nach Belastung) eigene Regeln der Automatik vor. Grundsatz 1 verlangt aber dieselbe Regel wie bei den Computer-Vereinen. Gebaut ist die Regel der Computer-Vereine („Spiel der Saison“ in wichtigen Spielen, übliche Urlaubslänge). | ✅ K36 §12 Nr. 16 |
| AX2 | **K36 §7, AR4, AQ3:** Computer-Vereine spielen weiter keine Testspiele. Die Automatik plant sie nur für dich (zwei gegen Amateure). Über sechs Seeds holt der Verein damit 52,2 Punkte, ohne die Testspiele 53,5, als Computer-Verein 53,7. Der Unterschied liegt im Rauschen, zeigt aber in die falsche Richtung. | 📌 K11, U11: Testspiele für alle oder Automatik ohne |
| AX3 | **K06 §7 gegen K36:** Computer-Trainer konterten mit 25 % „deinen Lieblingsstil“, auch wenn ihn dein Co-Trainer gewählt hatte. Das war ein Nachteil nur für deinen Verein (Seed 15: 39 statt 47 Punkte). Die Reaktion gilt jetzt nur, wenn du den Stil selbst wählst. | ✅ |
| AX4 | **K23 gegen K36 §10 (gleiche Welt wie ein Computer-Verein):** Dein Verein hat echte Buchhaltung, Computer-Vereine bekommen Einnahmen nach Formel. Dadurch unterscheidet sich das Konto, später der Transfermarkt, und über den gemeinsamen Tageszufall irgendwann auch dein Kader (Seed 15: nach 206 Tagen, ein Spieler nach einer Krankheit mit 72 statt 76 % Frische). Bis dahin sind beide Welten Tag für Tag gleich. | 📌 K23, U11 (eine Buchhaltung für alle) |
| AX5 | **K36 §10 „kein Nachteil“:** Eine einzelne Saison schwankt um mehrere Punkte, sechs Seeds tragen das Ziel „höchstens 2 Punkte“ nur knapp (gemessen −1,5). Der Test ist ergänzt um den Gleichschritt über 150 Tage, der die Gleichheit der Regeln genau prüft. | ✅ K36 §12 Nr. 28 |
| AX6 | **AR6 erledigt:** Erinnerungen und Halte aus Bereichen, die der Stab führt, entfallen (Sportgericht-Frist, Verträge, Gesprächswunsch, Angebote). In der ersten Saison gibt es mit Lernstufen 39 Halte, ohne 54 (Seed 5). | ✅ |
| AX7 | **AR5 bleibt offen:** K16 §5.1 (Rauschen der Automatik nach Qualität des Mitarbeiters) ist nicht gebaut. Die Automatik entscheidet wie ein Computer-Verein, unabhängig von der Qualität deines Stabs. | 📌 K16 |
| AX8 | **K36 §8:** Meldungen des Stabs stehen einzeln im Posteingang, die Sammlung im Wochenbericht fehlt. Die „kleine Aufgabe“ auf der Aufstiegskarte ist die Liste der Aufgaben der nächsten Lizenz. | 📌 klein |
| AX9 | **Lücke in K36 §5.2:** Die Stufe der Jugendarbeit hatte keine Lizenz. Neu `jugend` (B). Aufstellung und Grundordnung haben eine freiwillige Automatik. | ✅ K36 §12 Nr. 15 |
| AX10 | **Fehler aus früheren Schritten, beim Lesen gefunden (K07, K03):** Das Feld `eig` am Spieler ist doppelt belegt. `js/spieler.js` speichert dort die Liste der Eigenschaften, `js/training.js` den Fortschritt einer Umschulung je Position (`p.eig[pos]`), `eignung()` liest ihn von dort. Der Fortschritt hing damit an einer Liste, ging beim Speichern und Laden verloren und wurde am 1. Juli überschrieben (nachgemessen: 60 % Eignung nach fünf Wochen, nach dem Laden wieder der Grundwert). Behoben: Die Umschulung hat das eigene Feld `ue`, `tests/training.js` prüft den Fortschritt nach Speichern, Laden und Saisonwechsel. Der Test hatte den Fehler verdeckt, weil er das Feld vor der Messung selbst ersetzte. | ✅ behoben |
| AX11 | **K35a:** Rolle und Spieler standen in einem Beschriftungsblock (zwei Auswahlfelder in einem `label`). Ein gesperrtes Rollenfeld blockierte dort die Spielerauswahl für Bedienhilfen und den Browser-Test. Gesperrte Rollen stehen jetzt nur als Kürzel da. Allgemein gilt: ein Bedienelement je Beschriftung. | ✅, 📌 K35b |
| AX12 | **Beim Bau selbst verursacht und behoben:** Vier Kommentare am Zeilenende hatten Code auf derselben Zeile auskommentiert (Angebotsprüfung im Markt, Startelf beim Spielstart, Reaktion der Gegner in der Taktik, Rollenwahl in der Aufstellung). Gefunden über den Browser-Test und eine Suche, vor dem Commit behoben. | ✅ |
| AX13 | **Tests, die schon vorher rot waren, sind unverändert:** `tests/kalibrierung.js` Ausgabe Zeile für Zeile wie vor U9b und UL (vier rote Werte), `tests/medizin.js` Rückfall nach Zerrung 17 % von 930, `tests/akzeptanz.js` gleich bis auf das Tempo (Abwehr +0,8; Tempo 3,09 ms, grün). Ohne Lernstufen ist die simulierte Saison dieselbe wie vor UL. | 📌 wie AS13–AS15, AW15 |
| AX14 | **K33:** neues Feld `lizenz`, neue Datei `js/lizenz.js`. Version bleibt 4. | ✅ in K33 |

---

## AY. Nachtrag zur Umschulung (Entscheidung vom 12. November 2026)

| # | Befund | Status |
|---|---|---|
| AY1 | **K07 §3.3 gegen deine Entscheidung:** Bisher ließ sich jeder Feldspieler auf jede Feldposition umschulen, bis 90 %, in jedem Alter. Jetzt: nur Nachbarpositionen, entfernte nur bis 19 Jahre oder mit „vielseitig“, Torwart nie, Tempo und Höchstwert nach Alter, eine Umschulung je Laufbahn. | ✅ K07 §3.3, §12 Nr. 13 |
| AY2 | **„Nachbarposition“ war nirgends festgelegt.** Sie folgt jetzt der Eignungstabelle aus K03 §3.1a (`REGELN.engine.eignung.nah`): Nachbarn sind die Paare, die dort als verwandt stehen. Wer die Tabelle ändert, ändert auch die Umschulung. | ✅ vorläufig |
| AY3 | **„Bestimmtes Talent“** ist das Merkmal „vielseitig“. Ein eigenes Talent je Zielposition gibt es nicht. | ✅ vorläufig, 📌 K03 falls du ein eigenes Merkmal willst |
| AY4 | **K31:** Computer-Vereine schulen nicht um („nur bei Mangel auf einer Position“ aus K07 §7 ist nicht gebaut). Mit den strengeren Regeln bleibt das selten, wenn es kommt. | 📌 U11 |
| AY5 | **K07 §3.3:** „Einsätze auf der neuen Position zählen wie eine Trainingswoche zusätzlich“ ist weiter nicht gebaut. | 📌 klein |

---

## AZ. Nachtrag zu U8d Bankzeit nach Grund (13. November 2026)

| # | Befund | Status |
|---|---|---|
| AZ1 | **K14 §5.1 gegen §12:** Der Baustein „Einsatz“ hat die Spanne −28 bis +10, der Rivalen-Zähler kommt mit bis zu −10 dazu. Innerhalb der Spanne war der Test „zehn Spiele hinter dem Rivalen führen zum Gesprächswunsch“ nicht erreichbar (Trägheit 20 % pro Woche). | ✅ K14 §12 Nr. 25, vorläufig |
| AZ2 | **K14 §12 Nr. 13 (U8):** Der feste Faktor 1,5 gegen erklärte Rivalen entfällt, der Zähler ersetzt ihn. Ein erklärter Rivale in der Startelf zählt wie ein Konkurrent mit höchstens 3 Punkten Abstand. | ✅ |
| AZ3 | **K05 §3.2:** Die Bank wählt der Co-Trainer, eine eigene Bankwahl gibt es nicht. Der Fall „Tribüne“ wäre für dich nie eingetreten. Neu: Tribüne an der Spielerkarte. Eine volle Bankwahl bleibt offen. | ✅ klein, 📌 K05 |
| AZ4 | **K15 §5.4:** „Rotation ankündigen“ hieß in K14 „vierte Mannschaftsansprache“, es ist die fünfte (nach Rückendeckung, Weckruf, Ziel, Endspiel). | ✅ K15 §5.4, K14 §12 Nr. 36 |
| AZ5 | **K31:** Computer-Vereine rotieren kaum (etwa 25 Fälle je Saison), weil ihre Aufstellung die Frische nur über die Stärke kennt. Sie kennen weder die Rolle „spielt im Pokal“ noch die Ankündigung. Offen aus U8 bleibt die Wochen-Stammelf mit Rotation nach Rollen. | 📌 U11 |
| AZ6 | **K06, K36:** Stellt der Co-Trainer für dich auf (Automatik), spielt er die beste Elf auch im Pokal. Eine Rolle „spielt im Pokal“ wird dann enttäuscht. | 📌 K06 oder U11 |
| AZ7 | **K03, K04:** „Profi-Pflichtspiele über die Karriere“ gab es nicht. Für vorhandene Spieler sind sie aus dem Alter geschätzt (bis 18 Jahre null). Echte Laufbahndaten kommen mit der Historie (K34). | ✅ vorläufig, 📌 K34 |
| AZ8 | **K14 §12, Fälle für spätere Schritte:** teurer Neuzugang und Vertragsjahr (U10, K19, K21), Altstar, Mentor und Leihwunsch (U9c, U10), passt nicht ins System mit dem Gespräch „Position erklären“ (K06, K15), neuer Trainer (K28, U12), Länderspiele (K13). Im PLAN §7 bei den Schritten vermerkt. | 📌 |
| AZ9 | **K10:** Rückkehrer haben Frische 70 bis 80 %. Damit greift bei Stammspielern nach dem Aufbau oft zuerst die Rotation. Beides entschuldigt die Bank, das passt zusammen. | ✅ |
| AZ10 | **K13 §5.2 Supercup gegen 72 Stunden:** Der Termin wurde nur gegen den 1. Spieltag der Bundesliga und die erste Pokalrunde geprüft. Ein Pokalsieger aus der 2. Liga hatte am Tag danach ein Ligaspiel (tests/wettbewerbe.js, sichtbar geworden durch andere Ergebnisse nach U8d). Jetzt hält der Supercup Abstand zu den Ligaspielen beider Teilnehmer und rückt sonst wochenweise vor. | ✅ |
| AZ11 | **tests/training.js „dauerhaft hart“:** Die Prüfung verglich einen einzelnen Verein (etwa 14 Trainingsverletzungen je Saison). Das Rauschen war größer als die Wirkung (+12 bis +17 %, gemessen an allen Vereinen), die Prüfung fiel je nach Lauf rot oder grün aus. Jetzt trainieren im Vergleichslauf alle Vereine hart, verlangt sind mindestens 5 % mehr. | ✅ |
