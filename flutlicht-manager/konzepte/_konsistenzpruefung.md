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
| AZ12 | **K36 §10 „Kein Nachteil“ nach U8d:** Der Test fiel auf −4,7 Punkte (sechs Seeds), vorher −1,5. Nachgemessen über 18 Seeds auf dem alten und dem neuen Stand: −1,2 ± 1,7 gegen −2,5 ± 1,6, gepaart −1,3 ± 1,3. Ein Rückschritt durch U8d ist nicht nachweisbar, der Gleichschritt-Test (150 Tage Tag für Tag gleich) ist grün. Der feste Vergleich des Mittels mit −2 war bei dieser Streuung ein Münzwurf. Der Test prüft jetzt, ob ein Nachteil von mehr als 2 Punkten nachweisbar ist. Das Ziel selbst bleibt unbelegt. | ✅ Test, 📌 U11 (Buchhaltung, Testspiele) |
| AZ13 | **Kalibrierung nach U8d:** weiter vier rote Werte, einer hat gewechselt. „Heimsieg gleich starker Teams“ ist grün, „Bundesligist kommt im Pokal gegen Amateure weiter“ ist rot (97 % bei 61 Spielen, Ziel 88 bis 94 %, vorher 90 % bei 67). Favoritensiege 85 % statt 82 % (72 Spiele). Bei diesen Fallzahlen passt das zu Rauschen, die Kabine wirkt auf Amateure nicht. Beobachten. | 📌 beobachten |
| AZ14 | **K31, K19 (Fund des Fuzz-Tests):** Wer einen Verein mit zu kleinem Kader verließ (hier 13 Spieler nach vielen Vertragsauflösungen), hinterließ einen Computer-Verein, der erst im Sommer auffüllte. Jetzt füllt der alte Verein beim Vereinswechsel sofort auf, nach derselben Regel wie im Sommer. | ✅ |

---

## BA. Nachtrag zu U9c Jugend (13. November 2026)

| # | Befund | Status |
|---|---|---|
| BA1 | **K08 §5.1 gegen deine Vorgabe vom 13.11.:** Der Entwurf hing das Talent des Jahrgangs an die Stufe der Ausgaben im selben Jahr. Jetzt hängt es am Jugendniveau, das den Ausgaben über viele Saisons folgt (§5.0). | ✅ K08 §5.0, §5.1 |
| BA2 | **K08 §5.1 gegen die Welt:** Der Entwurf rechnete mit einer festen Basis je Liga (54, 50, 46). Die Aufrücker der Computer-Vereine hängen aber an der Grundstärke des Vereins. Gebaut ist die Grundstärke, sonst wären Jugendspieler eines Spitzenvereins zu schwach und die eines Aufsteigers zu stark. | ✅ vorläufig |
| BA3 | **K08 §7 „gleiche Regeln für Computer-Vereine“:** Nur dein Verein hat einen Jugendkader. Abschlag und Abstand sind so kalibriert, dass die zwei Besten eines Jahrgangs den zwei Aufrückern eines Computer-Vereins entsprechen. Computer-Vereine haben kein Jugendniveau und verkaufen keine Jugendspieler. | ✅ vorläufig, 📌 K31 |
| BA4 | **K36 und alte Spielstände:** Bisher kamen bei deinem Verein jeden Sommer zwei Spieler von selbst. Jetzt nur noch mit der Automatik `jugendkader`. Ohne Lernstufen musst du selbst aufrücken lassen, eine Nachricht erinnert vier Wochen vor Saisonende. Der Simulator der Tests holt deshalb selbst zwei Spieler je Sommer. | ✅, Hinweis in den offenen Entscheidungen |
| BA5 | **K08 §5.4 gegen K31:** Die Belastung junger Spieler kostet Stimmung und erhöht das Verletzungsrisiko nur bei deinem Verein. Computer-Trainer achten nicht darauf, sonst hätten ihre jungen Stammspieler dauernd Frust. | 📌 U11 |
| BA6 | **K08 §5.3:** „Öffentlich kritisieren“ und „Presse abschirmen“ fehlen (K29). Dafür zählt Kritik im Einzelgespräch mit ×1,5. Das Derby als Topspiel fehlt (K27). | 📌 K29, K27 |
| BA7 | **K16:** Der Jugendtrainer ist als Rolle gebaut, der Jugendleiter und der Leihmanager nicht. Jugendtrainer kommen wie die Scouts mit eigenem Zufallsstrom zum Stab, damit der übrige Stab unverändert bleibt. | ✅, 📌 U10 (Leihmanager) |
| BA8 | **K03:** Die Eigenschaft „Mentor“ ist jetzt sichtbar, weil sie eine Wirkung hat (Pate, Bankplatz). „Integrationsfigur“, „vereinstreu“ und „Heimweh-Typ“ bleiben unsichtbar. | ✅ |
| BA9 | **K23 Finanzen:** Neue Einnahme „Jugend: Abgänge“. Bei einem Spitzenverein kann ein starker 19-Jähriger ohne Profivertrag etwa 2 Mio € Ausbildungsentschädigung bringen. Das ist viel und gehört in die Kalibrierung der Finanzen. | 📌 K23 |
| BA10 | **K08 §10 „Spätzünder“** (etwa 5 % der Zwei-Sterne-Talente) ist nicht gemessen. Der Mechanismus ist da (ein Schub hebt mit 25 % das Talent um 2 bis 6). Die Messung braucht viele Saisons. | 📌 mit der Kalibrierung |
| BA11 | **tests/medizin.js nach U9c:** „Kreuzbandrisse in der 1. Liga 3–8 pro Saison“ ist beim Standard-Seed rot (8,5, vorher 6,5). Gegengeprüft mit drei Seeds auf dem Stand vor und nach U9c: 6,5 / 8,5 / 5,5 gegen 8,5 / 8,5 / 6,0. Schon vorher lag ein Seed über der Grenze. Der Unterschied (41 gegen 46 Risse in sechs Saisons) liegt im Rauschen, U9c hebt das Risiko nur bei eigenen jungen Spielern über der Belastungsgrenze. Die obere Grenze 8 ist für zwei Saisons zu knapp. | 📌 beobachten, Grenze mit der Kalibrierung prüfen |
| BA12 | **tests/akzeptanz.js Tempo nach U9c:** 4,88 ms pro Spiel bei einer Grenze von 4 ms. Direkt nacheinander gemessen rechnet der Stand vor U9c auf derselben Maschine gleich schnell (4,2 bis 4,4 ms gegen 4,3 bis 4,5 ms), die Maschine war an diesem Abend langsamer als sonst (sonst 2,9 bis 3,8 ms). Eine ganze Saison im Simulator dauert mit U9c etwa 7 % länger (Jugendkader, Prägungen). | ✅ kein Rückschritt der Engine, 📌 Tempo beobachten |
| BA13 | **tests/spielermodell.js und tests/pruefungen.js:** „Niemand überschreitet sein Talent“ verglich mit dem Talent vom Saisonbeginn. Ein Schub darf das Talent heben, verglichen wird jetzt mit dem höheren Wert. Die Datenprüfung der Browser-Tests kennt jetzt den Jugendkader. Nach einem Knacks konnte das Talent um bis zu einen halben Punkt unter die Stärke fallen, das ist behoben. | ✅ |

---

## BB. Nachtrag zu U9d Zweite Mannschaft (15. November 2026)

| # | Befund | Status |
|---|---|---|
| BB1 | **PLAN §4 (K08) „Zweite Mannschaft in der Regionalliga“ gegen die echten Daten:** Nur 20 Vereine aus der 1. und 2. Liga haben 2026/27 eine Zweite in der Regionalliga, zwei in der 3. Liga, 15 Vereine (auch Drittligisten) eine in der Oberliga. Leverkusen, Wolfsburg, Union, Leipzig und Heidenheim haben keine. Die Zweite hängt deshalb an den Daten (`zw`), nicht an der Liga. | ✅ K08 §5.6, §12 Nr. 19 |
| BB2 | **K13 §12 Nr. 4 und 11 (Regel für Zweitmannschaften, „echte Regel prüfen“):** Laut Websuche dürfen Zweite von Drittligisten nicht in der Regionalliga spielen (Düsseldorf II 2026 in die Oberliga). Die bisherige Regel „eine Liga tiefer“ war zu mild. Für die Zweite deines Vereins gilt jetzt die echte Regel, Hoffenheim II und Stuttgart II nehmen als Zweite eines Drittligisten nicht an der Aufstiegslosung teil. Den Wortlaut der Spielordnung habe ich nicht gelesen (dfb.de aus dieser Sitzung nicht erreichbar). | ✅ K13 §12 Nachtrag, K32a §12 |
| BB3 | **K13 §3.7, K32a:** Hoffenheim II und Stuttgart II im Regionalliga-Pool stehen weiter in Liga 4, auch wenn ihre erste Mannschaft in der 3. Liga spielt (eigentlich Oberliga, die es im Spiel nicht gibt). Sie werden nur nicht gelost. | 📌 mit dem Ausbau des Unterbaus |
| BB4 | **K08 §5.6 gegen K32a §4.4:** Die Zweite deines Vereins (außer Hoffenheim und Stuttgart) steht nicht im Regionalliga-Pool. Als Meister der Regionalliga verzichtet sie auf die 3. Liga. Sonst hätten 20 neue Pool-Einträge die Losgewichte und damit die Welt verändert. | ✅ vorläufig, K08 §12 Nr. 25 |
| BB5 | **Exploit beim Bau gefunden:** Mit dem Mindestwert der Jugend (100.000 €) ließ sich fast jeder Amateur verkaufen, ein 23-Jähriger mit Stärke 40 brachte rund 210.000 €. Mit 22 kostenlosen Neuen je Sommer wäre die Zweite eine Geldquelle gewesen. Verkauf jetzt nur ab Stärke 59 (Kaderspieler der 3. Liga), zum halben Marktwert. | ✅ K08 §12 Nr. 27 |
| BB6 | **K23 (wie BA9):** Der Marktwert ist im unteren Bereich hoch: Ein Spieler mit Stärke 58 und 21 Jahren ist rund 2 Mio € wert, echte Regionalligaspieler eher 100.000 bis 500.000 €. Das betrifft Jugend, Zweite und 3. Liga gleich und gehört in die Kalibrierung der Finanzen. | 📌 K23 |
| BB7 | **Talent der Neuen ohne Deckel:** Im ersten Entwurf war nur ihre Stärke gedeckelt. Sie wuchsen mit Spielpraxis in einer Saison auf 63 bis 65 (Drittliga-Niveau), weit über ein gutes Team der Regionalliga. Jetzt ist das Talent gedeckelt (Deckel + 2), die Stärke folgt. | ✅ K08 §12 Nr. 22 |
| BB8 | **Erster Kader zu schwach:** Ohne Vorlauf war der erste Kader ein ganzer Jahrgang von Neuen. Im ersten Simulator-Lauf stieg Gladbach II in der ersten Saison ab (Platz 17). Die Älteren wachsen jetzt beim Aufbau ihre Jahre in der Zweiten nach, wie beim ersten Jugendkader. Gemessen bei Stufe 3: erste Saison im Schnitt 56,2, spätere Saisons 57,2. | ✅ K08 §12 Nr. 24 |
| BB9 | **K36:** zwei neue Bereiche `zweite` und `zweitekader` (B-Lizenz, mit Automatik), 42 Bereiche. | ✅ K36 §5.2, §12 Nr. 32 |
| BB10 | **K33:** neue Felder `zw`, `zwV`, `zwL`, `zwSt`, `zwErg`, `zwHist`, `zid`, am Verein `zws`, am Spieler `zwJ`, in den Daten `zw` und `ol`, neue Datei `js/zweite.js`. Version bleibt 4, alte Spielstände bekommen die Zweite beim ersten Zugriff. | ✅ K33 |
| BB11 | **Offen aus PLAN §4 (K08):** „Was tun Vereine ohne Zweite (Leihe oder Abgang)?“ Bis U10 bleibt es beim Abgang mit 19. Profis in die Zweite abstellen kommt ebenfalls mit U10, weil es dieselben Aufräumarbeiten braucht wie die Leihe. | 📌 U10 |
| BB12 | **Neu gefunden:** Die DFL führt 2026/27 mit der „Bundesliga Talent Series“ einen freiwilligen U21-Wettbewerb ein (laut Suchergebnissen 26 Teams aus 1. und 2. Liga, ohne Leverkusen, Stuttgart, Freiburg, Augsburg, Hoffenheim, Köln und Mainz). Er ist nicht im Spiel. Für Vereine ohne Zweite wäre er die naheliegende Spielpraxis. | 📌 Idee, mit dir abstimmen |
| BB13 | **Gleiche Welt:** Die Zweite würfelt mit eigenen Strömen. `tests/kalibrierung.js` und `tests/medizin.js` geben nach U9d Zeile für Zeile dasselbe aus wie vorher (gemessen mit dem Stand vor U9d in einem zweiten Ordner), `tests/akzeptanz.js` bis auf das Tempo ebenso. | ✅ |
| BB14 | **Tests, die schon vorher rot waren, sind nicht schlimmer geworden:** `tests/kalibrierung.js` drei rote Werte wie vorher (Elfmeter pro Spiel, Heimsieg gleich starker Teams, Spanne Ballbesitz; der Favoritensieg ist bei diesem Seed nicht rot), `tests/medizin.js` wie vorher (Rückfall nach Zerrung 15 % von 952, Kreuzbandrisse 8,5), `tests/akzeptanz.js` wie vorher (Abwehr +0,8, Verhältnis der Bereiche, Tempo). Tempo 5,88 ms nach U9d gegen 5,44 ms vorher, beide über der Grenze 4 ms. Direkt nacheinander gemessen (Liga 1, 306 Spiele, dreimal im Wechsel) vorher 5,56 / 5,47 / 7,21 ms, nachher 6,30 / 5,81 / 6,42 ms: kein messbarer Unterschied, U9d ändert die Engine nicht. Die Maschine schwankt (wie AO7, AV8, BA12). | 📌 wie AS13–AS15, BA11, BA12 |
| BB15 | **`tests/lizenz.js` „Kein Nachteil“:** −3,2 ± 3,4 Punkte über sechs Seeds (ein Seed 37:53), der Test ist grün (ein Nachteil über 2 Punkte ist nicht nachweisbar). Der Stand vor U9d liefert exakt dieselben sechs Paare. Die große Streuung stammt also nicht aus U9d. | 📌 wie AZ12, U11 |
| BB16 | **Alle übrigen Tests grün:** `zweite`, `jugend`, `spielermodell`, `schwierigkeit`, `live`, `taktik`, `training`, `sommer`, `testspiele`, `wettbewerbe`, `disziplin`, `stab`, `scouting`, `lizenz`, `ausland`, `kabine`, `zufall`, dazu einzeln die Browser-Tests `ui-zwei-saisons` (mit dem neuen Schritt für die Zweite), `fuzz-karrieren`, `live-neuladen`, `ui-lernstufen` und `seed`. | ✅ |

---

## BC. Nachtrag zu U10a Transfers I (17. und 18. November 2026)

| # | Befund | Status |
|---|---|---|
| BC1 | **K19 §5.6 gegen den bisherigen Code (H6):** Wechsel gingen jederzeit. Jetzt gelten die Fenster für alle (1.7. bis 1.9., 1.1. bis 1.2.). Außerhalb wird verhandelt und bezahlt, gewechselt wird zum Fensterbeginn. Computer-Vereine wechseln nur im Fenster (26 je Saison gemessen, vorher 29 über das ganze Jahr). | ✅ K19 §12 Nr. 5 bis 7 |
| BC2 | **K19 §3 gegen K19 §5.1:** §3 erweitert den Marktwert um Restlaufzeit und Merkmale, §5.1 nimmt die Restlaufzeit in den Vereinswert. Doppelt gezählt wäre falsch. Gebaut: Marktwert unverändert, Restlaufzeit nur im Vereinswert. Merkmale (+4 % je Merkmal) sind nicht gebaut. | ✅ vorläufig, K19 §12 Nr. 8 |
| BC3 | **K19 §10 „faire Angebote“:** Am reinen Marktwert liegen 57 % der Angebote zwischen 80 und 120 %, bereinigt um die Restlaufzeit 98 %. Spieler mit einem Jahr Restvertrag bringen 60 % (K19 §5.1). Der Test misst bereinigt. | ✅ vorläufig |
| BC4 | **Beim Bau gefunden (tests/ausland.js):** Inländische Bieter brauchten Bedarf und einen Vereinswert von mindestens 80 % der Forderung, Auslandsvereine rechneten ohne Restlaufzeit. Bei kurzen Verträgen blieben fast nur Auslandsvereine, der Anteil stieg von 30 auf 48 bis 72 %. Jetzt bieten alle mit derselben Formel (Marktwert × Restlaufzeit, im Inland dazu Bedarf und Finanzlage), ein Gebot darf unter der Forderung liegen. Anteil wieder 27 bis 30 %. | ✅ |
| BC5 | **K31 und K19 §5.4:** „Bedarf“ ist ein Ersatz für die Kaderplanung der Computer-Vereine (schwächster Stammspieler der Positionsgruppe). Computer-Vereine kaufen untereinander weiter nach der alten Regel (Transferliste, Niveau, Kader), nur im Fenster. | 📌 U11 |
| BC6 | **K17, K18 im Vereinswert:** Beziehung (±15 %) und Schätzung über das eigene Scouting fehlen. Computer-Vereine bewerten mit wahren Werten (wie AV2). | 📌 U11, U12 |
| BC7 | **K19 §4.1:** Antworten kommen sofort statt nach einem bis fünf Tagen, Konkurrenz um denselben Spieler gibt es nicht (K20). Bestandteile (Raten, Boni, Weiterverkauf) und Tausch fehlen. | 📌 K20, später |
| BC8 | **Ausland:** Die echten Fenster im Ausland weichen ab (England schließt teils früher, die Türkei und Saudi-Arabien später). Im Spiel gelten die deutschen Fenster auch für Käufe und Verkäufe ins Ausland. | ✅ vorläufig |
| BC9 | **Kalibrierung nach U10a:** Im Standardlauf (vier Saisons, Seed 5) vier Problemwerte statt drei: Elfmeter pro Spiel, Favoritensieg, Heimsieg gleich starker Teams, Bundesligist gegen Amateure im Pokal; die Spanne beim Ballbesitz ist dafür im Ziel. Gegengeprüft mit drei Seeds auf dem Stand vor und nach U10a (je drei Saisons): vorher 3, 2 und 3 Problemwerte, nachher 3, 0 und 2. Kein Rückschritt, die Werte schwanken mit der Welt, die sich durch die Fenster verändert. | ✅ Rauschen, 📌 wie AZ13 |
| BC10 | **K33:** neue Felder `wechsel`, `verh`, am Spieler `wech`, am Angebot `max` und `r`, neue Datei `js/transfers.js`. Aus `markt` entfernt: `forderung`, `wechsel`, `ernstAb`, die Beträge der Angebote (jetzt `transfers.angebotKI`). | ✅ K33 |
| BC11 | **K36:** keine neuen Bereiche. Verhandeln, Gegenforderung und Annehmen hängen am Bereich `transfers`. | ✅ |
| BC12 | **Alle Tests am 18.11.:** grün sind `transfers`, `zweite`, `jugend`, `medizin` (seit U10a auch Rückfall und Kreuzbandrisse im Ziel), `schwierigkeit`, `spielermodell`, `live`, `training`, `testspiele`, `sommer`, `taktik`, `disziplin`, `scouting`, `wettbewerbe`, `stab`, `kabine`, `zufall`, `ausland`, `lizenz` und einzeln die Browser-Tests `ui-zwei-saisons` (Kauf im Ausland im September als vereinbarter Wechsel zum Winter), `fuzz-karrieren`, `live-neuladen`, `ui-lernstufen`, `seed`. Vorher schon rot: `kalibrierung` (BC9) und `akzeptanz` mit Abwehr +0,8 und dem Verhältnis der Bereiche. Das Tempo ist diesmal im Ziel. | ✅ |

---

## BD. Nachtrag zu U10b Verträge (18. November 2026)

| # | Befund | Status |
|---|---|---|
| BD1 | **K21 §5.1 (Liga-Faktor 1, 0,45, 0,2) gegen die Gehaltskurve:** `salaryFor` hängt an der Stärke und gibt der 2. Liga schon etwa 40 % der Bundesliga. Mit dem Liga-Faktor wären Zweitligagehälter auf etwa 18 % gefallen, und neue Verträge hätten nicht zu den bestehenden gepasst. Gebaut ohne Liga-Faktor. | ✅ vorläufig, K21 §12 Nr. 10 |
| BD2 | **K21 §3.1 (Objekt `vertrag`) gegen den Bestand:** `p.ct` und `p.sal` werden an über 30 Stellen gelesen. Prämien und Klauseln stehen deshalb in eigenen Feldern (`vp`, `ak`, `lk`), Gehalt und Laufzeit bleiben, wo sie sind. | ✅ vorläufig, K21 §12 Nr. 11 |
| BD3 | **K19 §5.3 und K21 §5.1 überschneiden sich beim Geld:** Das Interesse enthielt einen Baustein „Geld“, die Forderung ist aber schon das Gehalt. Gebaut: Interesse ohne Geld, fehlendes Interesse bis −10 macht die Forderung um 3 % je Punkt teurer. | ✅ vorläufig, K19 §12 Nr. 16 |
| BD4 | **K21 §4.3 Vorvertrag gegen K36 und K31:** Computer-Vereine verlieren keine Spieler über Vorverträge, und führt der Verein deine Verträge, passiert es dir auch nicht. Sonst hätte die Automatik einen Nachteil, den die Computer-Vereine nicht haben. Im Simulator ohne Lernstufen redet niemand über Verträge, dort gab es im Zwei-Saisons-Lauf von `tests/vertraege.js` sechs Meldungen zu Vorverträgen. | ✅ vorläufig, 📌 U11 (Vorverträge unter Computer-Vereinen) |
| BD5 | **K21 §4.3 (sechs Monate):** Die Regel stammt aus dem Gedächtnis. Die Websuche fand den Wortlaut von Art. 18 nicht, `www.kaufcan.com` (Quelle in K21) ist aus dieser Sitzung gesperrt. Die neue FIFA-Fassung gilt ab 1. Januar 2027 und kann Art. 18 betreffen. | 📌 prüfen |
| BD6 | **K14 §12:** Vertragsjahr und teurer Neuzugang sind gebaut (Faktor auf das Tempo, mit dem ein Bankplatz die Einsatzerwartung senkt). „Die Presse fragt nach“ fehlt (K29). | ✅, 📌 K29 |
| BD7 | **K21 §10 „Konsistenz“ und „Verlängerung“:** gleich starke, gleich alte Spieler fordern innerhalb von ±15 % (gemessen: Spanne 1,10), zufriedene Spieler nehmen ein faires Angebot in mindestens 80 % der Fälle an (gemessen: alle). „Ablösefreie Wechsel je Liga 15 bis 35“ und „Ausstiegsklauseln 1 bis 5 je Saison ligaweit“ sind nicht messbar, solange Computer-Vereine weder Vorverträge noch Klauseln kennen. | ✅, 📌 U11 |
| BD8 | **K23:** neue Ausgaben „Prämien“ und mehr „Handgelder“ (jetzt bei jeder Unterschrift möglich). Computer-Vereine zahlen keine Prämien (Einnahmen nach Formel, wie AX4). | 📌 K23 |
| BD9 | **K36:** neuer Bereich `praemien` (A-Lizenz, ohne Automatik), 43 Bereiche. | ✅ K36 §5.2, §12 Nr. 33 |
| BD10 | **Medizin nach U10b:** Im Standardlauf Kreuzbandrisse 10,0 je Saison (Grenze 8) und Rückfall nach Zerrung 15 %. Gegengeprüft mit drei Seeds vor und nach U10b (je zwei Saisons): Kreuzbandrisse 4,5 / 7,5 / 7,0 gegen 6,0 / 10,0 / 5,5 (38 gegen 43 Risse), Rückfall 15 / 14 / 13 gegen 16 / 15 / 14 %. U10b ändert an Verletzungen nichts, die Welt verschiebt sich nur durch Vorverträge im Simulator. Rauschen, die obere Grenze bleibt zu knapp (BA11). | 📌 wie BA11 |
| BD11 | **Kalibrierung nach U10b:** zwei Problemwerte (Favoritensieg, Spanne Ballbesitz), weniger als nach U10a. | ✅ |
| BD13 | **Beim Testlauf gefunden und behoben:** (1) Unterschrieb ein Spieler woanders einen Vorvertrag, blieb ein offenes Angebot für ihn stehen (`tests/fuzz-karrieren.js`, Datenprüfung). (2) Bei einem unzufriedenen Spieler fehlte das Laufzeitfeld, weil das ganze Formular ausgeblendet war (`tests/ui-zwei-saisons.js`). Das Feld steht jetzt immer da, „Verlängern“ meldet die Absage. (3) Ein Kommentar am Zeilenende im Browser-Test hatte den Rest der Zeile auskommentiert (wie AX12), vor dem Lauf bemerkt. | ✅ |
| BD14 | **Alle Tests nach U10b:** grün sind `vertraege`, `transfers`, `zweite`, `jugend`, `schwierigkeit`, `spielermodell`, `live`, `sommer`, `taktik`, `testspiele`, `training`, `disziplin`, `scouting`, `wettbewerbe`, `stab`, `kabine`, `zufall`, `ausland`, `lizenz` und einzeln die Browser-Tests `ui-zwei-saisons`, `fuzz-karrieren`, `live-neuladen`, `ui-lernstufen`, `seed`. Bekannt rot: `kalibrierung` (BD11), `medizin` (BD10), `akzeptanz` (Abwehr +0,8, Verhältnis der Bereiche, Tempo 4,81 ms, wie vorher schwankend). | ✅ |
| BD12 | **`tests/lizenz.js` „Kein Nachteil“:** jetzt +2,5 ± 2,5 Punkte für die Automatik (vorher −3,2 ± 3,4). Die Welt hat sich durch U10a und U10b verschoben. Das bestätigt BC: Die Streuung je Seed ist größer als jeder Unterschied der Regeln. | ✅ |

---

## BE. Nachtrag zu U10c Berater (18. November 2026)

| # | Befund | Status |
|---|---|---|
| BE1 | **K22 §5 gegen §10:** Die Beziehung senkt laut §5 nur die Gehaltsforderung. Bei Ablöse, drei Jahresgehältern und Provision ergab das 2 % Ersparnis bei +70, das Ziel „3–6 %“ war mit der Regel nicht erreichbar. Gebaut: Die Beziehung senkt auch die Provision. | ✅ vorläufig, K22 §12 Nr. 13 |
| BE2 | **K22 §3.2 (am Spieler `berater`) gegen „gleiche Welt“:** Eine gespeicherte Zuordnung hätte beim Aufbau Zufall gebraucht. Gebaut: Zuordnung aus Seed und Spielernummer per Hash, nichts gespeichert, kein Zufall verbraucht (geprüft in `tests/berater.js`). Folge: Ein Spieler wechselt nie den Berater. | ✅ vorläufig, 📌 Ereignis Berater-Wechsel (K30) |
| BE3 | **K22 §4 Nr. 1 (Antwort nach 1–3 Tagen):** nicht gebaut, Verhandlungen bleiben sofort (wie BC7). | 📌 mit K20 |
| BE4 | **K22 §12 Nr. 5 „Interesse +10 %“:** Das Interesse ist eine Punktzahl, nicht in Prozent. Gelesen als +5 Punkte. | ✅ vorläufig |
| BE5 | **K14, K29, K20, K16:** gierige Berater und Wechselwunsch, Gerüchte, Abwerben über den Berater, Sportdirektor mit Netzwerk fehlen noch, ebenso Beziehungen der Computer-Vereine (K22 §12 Nr. 9). | 📌 mit ihren Konzepten |
| BE6 | **K36:** neuer Bereich `berater` (B-Lizenz), 44 Bereiche. | ✅ |
| BE7 | **K33, K23:** neues Feld `ber`, am Spieler `vvW`, neue Ausgaben „Beraterprovision“ und „Kontaktpflege“. | ✅ K33, 📌 K23 |
| BE8 | **Alle Tests nach U10c:** grün sind `berater`, `vertraege`, `transfers`, `zweite`, `jugend`, `schwierigkeit`, `spielermodell`, `live`, `sommer`, `testspiele`, `training`, `taktik`, `disziplin`, `scouting`, `wettbewerbe`, `stab`, `kabine`, `zufall`, `ausland`, `lizenz` und einzeln `ui-zwei-saisons`, `fuzz-karrieren`, `live-neuladen`, `ui-lernstufen`, `seed`. `medizin` und `kalibrierung` geben dieselben Werte wie nach U10b (die Berater ändern die Welt nicht), `akzeptanz` wie bekannt (Abwehr, Verhältnis, Tempo 4,31 ms). | ✅ |

---

## BF. Nachtrag zu U10d Leihe, Profis in der Zweiten, Medizincheck (18. November 2026)

| # | Befund | Status |
|---|---|---|
| BF1 | **K08 §5.5 (Leihvertrag mit Liga, Mindestspielzeit, Rückruf) gegen K19 §3 (Dauer, Gehaltsanteil, Kaufoption oder -pflicht):** Gebaut ist die Schnittmenge: Gehaltsanteil, Einsatz als Stammspieler oder Rotation, Rückruf im Winter, Kaufoption. Dauer immer bis zum Saisonende. Liga als Bedingung, Kaufpflicht und Leihgebühr fehlen. | ✅ vorläufig, K08 §5.5 |
| BF2 | **Gehalt bei Leihen:** Der Vertrag bleibt beim abgebenden Verein, der Leihverein übernimmt einen Anteil. Computer-Vereine haben Einnahmen nach Formel (AX4), ihr Anteil kostet sie also nichts. Für dich zählt nur dein Rest. | ✅, 📌 K23 |
| BF3 | **Profis in der Zweiten (K08 §12 Nr. 29):** Sie verlassen den Profikader (Aufstellung, Kabine, Angebote), behalten aber Vertrag und Gehalt. Freundschaften bleiben bestehen, Zusagen werden hinfällig. Ihr Vertrag läuft in der Zweiten weiter und kann dort enden. | ✅ vorläufig |
| BF4 | **K19 §5.5 Medizincheck:** Befund und Abschlag sind je Spieler fest (kein neuer Zufall). Die Leistungsklausel als zweite Wahl fehlt, ebenso eine genauere Diagnose (K10). Die Kosten fallen beim ersten Prüfen an, auch wenn der Kauf danach platzt. | ✅ vorläufig |
| BF5 | **Bestehende Tests:** Käufe in `tests/transfers.js`, `tests/vertraege.js` und `tests/ausland.js` klicken bei einem Befund ein zweites Mal. | ✅ |
| BF6 | **K16 Leihmanager, K17 Beziehung zum Leihverein, K31 Leihen unter Computer-Vereinen** fehlen. | 📌 K16, U11, U12 |
| BF7 | **K36:** neuer Bereich `leihe` (B-Lizenz), 45 Bereiche. **K33:** Felder `leihe`, `zwP`, `verh.mc`, neue Datei `js/leihe.js`. | ✅ |
| BF8 | **Fehler beim Bau, gefunden von `tests/stab.js`:** Ein Kommentar am Zeilenende (Gehälter verliehener Spieler) hatte auf derselben Zeile die Buchung der Stab-Gehälter auskommentiert. Seit dem ersten Commit von U10d wurden die Gehälter des Trainerstabs nicht gebucht. Behoben, danach Node-Tests und die großen Browser-Tests erneut. Derselbe Fehler wie AX12 und BD13. | ✅ |
| BF9 | **Neuer Wächter `tests/code.js`:** sucht in `js/`, `tests/` und `daten/regeln.js` Kommentare am Zeilenende, hinter denen noch Code steht. Gegenprobe mit der fehlerhaften Fassung: Die Zeile wird gefunden. Läuft ab jetzt bei jedem Testlauf mit. | ✅ |

---

## BG. Nachtrag zu U11a Computer-Vereine: Kaderplan, Bedarf, Kauf und Verkauf (19. November 2026, ohne Testlauf)

**Wichtig:** U11a entstand auf einem Rechner ohne Node.js und ohne Playwright. Kein Test ist gelaufen, auch `tests/welt.js` nicht. Geprüft sind nur die Klammern der geänderten Dateien (Hilfsskript) und der Code von Hand. Alle Zahlen in `REGELN.computer` sind Schätzungen.

| # | Befund | Status |
|---|---|---|
| BG1 | **Fehler aus U10d gefunden und behoben:** In `js/ablauf.js` (`finanzenLiga`) stand die Buchung „Trainerstab“ seit U10d in derselben Zeile hinter einem `//`-Kommentar und lief nicht mehr (wie AX12 und BD13). Eigener Commit, `tests/stab.js` muss es bestätigen. | ✅ ohne Testlauf |
| BG2 | **K31 §3.1 (Planstellen fest je Gruppe) gegen K06 (zehn Grundordnungen):** Ein 4-3-3 hat kein offensives Mittelfeld, ein 3-5-2 drei Innenverteidiger. Gebaut: Planstellen = Mittel aus dem Standard und dem Doppelten der Plätze in der Ordnung. Das ergibt immer 24. | ✅ vorläufig, K31 §12 Nr. 6 |
| BG3 | **K31 §3.1 („Vereinsniveau“) ist nicht definiert.** Gebaut: Anspruch = Kaderstärke, mindestens die Grundstärke nach dem Ansehen. | ✅ vorläufig, K31 §12 Nr. 7 |
| BG4 | **K31 §5.1 gegen §3.1:** „Stammspieler mehr als 3 unter dem Qualitätsziel“ kann 3 oder 6 unter dem Anspruch heißen. Gebaut: 6 (wörtlich). | ✅ vorläufig, K31 §12 Nr. 8 |
| BG5 | **K31 §5.2 Grund „Note“ gegen K33:** Das Spiel speichert keine Noten der letzten Einsätze. Gebaut ist nur „Stärke deutlich unter der Planstelle“. | 📌 K34 oder U11c |
| BG6 | **K31 §5.2 (Angebot über 150 %) gegen K19 §5.1 (Käufer zahlt höchstens das 1,2-Fache):** Unter Computer-Vereinen kommt so nie ein Kauf über 150 % zustande. Gebaut: nur Spieler der Transferliste und Vereinslose. Mehr zahlen erst ehrgeizige Vereine (Sternejagd). | 📌 U11b |
| BG7 | **K31 §5.2 Regel B gegen K19 (dein Kauf):** Für dich gilt weiter der Preis nach Kaderrolle. Du kannst einen Spieler aus einer voll besetzten Gruppe kaufen, der Verein sucht danach Ersatz. | ✅ vorläufig, K31 §12 Nr. 11 |
| BG8 | **BC5 nur zum Teil erledigt:** Der Kaderplan steuert Käufe und Verkäufe unter Computer-Vereinen. `hatBedarf` (Angebote an dich, Leihe, Ausstiegsklausel, Vorvertrag) ist unverändert. Die Umstellung ändert die Häufigkeit der Angebote und braucht `tests/transfers.js`, `tests/leihe.js`, `tests/vertraege.js` und `tests/ausland.js`. | 📌 mit dem ersten Testlauf |
| BG9 | **K03 (feine Positionen per Zufall) gegen den Kaderplan:** Die Hälfte der Mittelfeldspieler landet außen oder offensiv, der Plan will dort zwei bis vier von neun. Echte Kader (im Schnitt 28 Spieler, 6 Stürmer) haben dazu mehr Stürmer als Planstellen. Erwartung für die erste Saison: viele Überzählige auf der Liste, die niemand braucht, und zu wenige zentrale Mittelfeldspieler. | 📌 K03 Daten, messen mit `tests/welt.js` |
| BG10 | **K31 („`saison.kaderSoll` geht im Kaderplan auf“):** nicht ganz. `kaderSoll` bleibt als Mindestkader am 1. Juli, damit jeder Verein spielfähig ist. Offene Planstellen füllt der Verein erst in der letzten Woche des Sommerfensters auf (Vereinslose oder erzeugte Spieler der Gruppe). | ✅ vorläufig, K31 §12 Nr. 12 |
| BG11 | **K36 Gleichschritt (`tests/lizenz.js`):** Der alte Markt hing nur über „Konto größer als der Preis“ am Geld. Der neue hat ein Budget. Damit dein Verein in der Automatik und derselbe Verein als Computer-Verein gleich entscheiden, steht das Budget am ersten Montag des Fensters fest. Die Finanzlage (K19, Konto unter 1,5 oder ab 20 Mio €) hängt weiter am laufenden Konto. | ⚠️ nicht nachgeprüft |
| BG12 | **K23:** Computer-Vereine zahlen weiter keine Gehälter (AX4). Ein Gehaltsrahmen (K31 §3.3) fehlt. Bei deinem Verein in der Automatik kosten Zugänge echtes Gehalt, begrenzt nur durch das Budget für die Ablöse. | 📌 K23 |
| BG13 | **K29 Meldungsdichte:** Jeder Wechsel mit Ablöse steht im Posteingang. Vorher waren es 2 bis 5 je Fensterwoche, jetzt können es in der ersten Juliwoche deutlich mehr sein. | 📌 K29, messen |
| BG14 | **Erwartete Verschiebungen in bestehenden Tests** (nicht gemessen): `tests/transfers.js` Nr. 1 (mindestens 15 Wechsel je Saison, jetzt aus dem Kaderplan statt 2 bis 5 je Woche), `tests/ausland.js` (Anteil der Auslandsangebote: Computer-Vereine geben im Fenster bis zur Hälfte ihres Kontos aus, also bieten weniger deutsche Vereine), `tests/kalibrierung.js` und alle Tests über mehrere Saisons (andere Welt). `tests/pruefungen.js` verlangt Kader von 15 bis 36: Der Markt hält 21 bis 30 ein. | ⚠️ offen |
| BG15 | **K33:** neues Feld `tb` am Verein, neue Datei `js/computer.js`, `mkPlayer` mit `fp`. **K36:** kein neuer Bereich. | ✅ |
| BG16 | **Nicht gebaut aus K31:** Profile und Sternejagd (§3.2, §5.3), Klugheit (§5.4), Verträge nach Rang (§4 Nr. 4, dazu BD4 und BD7), Leihen unter Computer-Vereinen (BF6), Trainerwechsel (§5.5), Gehaltsrahmen und Notverkauf (§3.3, §8), Ereignisse (§8), Käufe im Ausland, Anzeige des Bedarfs anderer Vereine (§6), Schätzung über das eigene Scouting (BC6). | 📌 U11b bis U11d, U12 |
| BG17 | **Alle Tests nach U11a: stehen aus.** Zuerst `node tests/welt.js`, dann `tests/stab.js` (BG1), `tests/transfers.js`, `tests/lizenz.js` (Gleichschritt, „kein Nachteil“), `tests/leihe.js`, `tests/vertraege.js`, `tests/ausland.js`, dann die ganze Liste aus `tests/README.md`, die Browser-Tests einzeln. Der volle Testlauf nach U10d steht ebenfalls noch aus (kein Eintrag in BF). | ⚠️ offen |

---

## BH. Nachtrag zu U11b Computer-Vereine: Vereinsprofile und Sternejagd (19. November 2026, ohne Testlauf)

Wie BG: kein Test gelaufen, alle Zahlen geschätzt.

| # | Befund | Status |
|---|---|---|
| BH1 | **K31 §3.2 und §12 Nr. 2 (Profile als Stammdaten) gegen die Regel „Fakten vorher prüfen“:** Ein Profil je echtem Verein wäre eine Behauptung über echte Vereine. Gebaut: „ehrgeizig“ aus der Lage (Erste nach Ansehen je Liga, Aufsteiger), das zweite Profil gelost. Das Feld `profil` in `daten/vereine.js` ist vorbereitet, aber leer. | ✅ vorläufig, K31 §12 Nr. 18 |
| BH2 | **K06 §7 (`t.stil`, Lieblingsstil „bis K31“):** bleibt, wie er ist. Das zweite Profil hat einen eigenen Zufallsstrom (`vereinsprofil`), die übrige Welt ändert sich durch das Losen nicht. | ✅ |
| BH3 | **K31 §11 (`sterneJagd.ueberNiveau:5`):** gebaut mit 2. Bei 5 fände ein Spitzenverein im Inland fast niemanden, und Käufe im Ausland gibt es für Computer-Vereine noch nicht (K32). | ✅ vorläufig, 📌 K32 |
| BH4 | **BG6 erledigt für ehrgeizige Vereine:** Auf der Sternejagd zahlt der Käufer das außergewöhnliche Angebot (150 % × Restlaufzeit, mindestens die Forderung nach K19). Der Verkäufer gibt ab, auch wenn Regel B verletzt ist, und sucht Ersatz. Alle anderen Vereine kaufen weiter nur von der Liste. | ✅ |
| BH5 | **K02 §5.3a („Die Reichen werden reicher, mit Maß“):** Die Sternejagd zieht starke Spieler zu den Vereinen mit dem höchsten Ansehen, 70 % des Kontos als Budget verstärken das. Ob die drei Wertvollsten dadurch zu oft Meister werden, zeigt erst eine Messung über viele Saisons (Kalibrierziel nach U11, PLAN §7). | ⚠️ messen |
| BH6 | **Profile ohne Wirkung oder mit halber Wirkung:** Malocher (K07), Ausbildungsverein verleiht nicht (U11d), Spekulant verkauft nicht mit Gewinn (Regel B), „sparsam verkauft eher“ fehlt. Profile ändern sich nicht mit der Zeit, außer „ehrgeizig“. | 📌 U11d, K07 |
| BH7 | **K35, K36:** Profile sind für dich nicht sichtbar, kein neuer Bereich. **K33:** Felder `profil` und `tb.s`. | ✅, 📌 K35 |
| BH8 | **Dein Verein in der Automatik** hat wie jeder Verein ein gelostes zweites Profil und kann „ehrgeizig“ sein. Dann geht der Verein mit 70 % deines Kontos auf den Markt und auf Sternejagd. **Entschieden (19.11., vorläufig, von mir auf dein „mach wie du denkst“):** bleibt so. Gründe: K36 Grundsatz 1 (kein zweites Regelwerk), der Gleichschritt in `tests/lizenz.js` verlangt dieselbe Regel, und der alte Markt war strenger: Er kaufte, solange das Konto größer war als der Preis, also mit bis zu 100 % des Kontos. Bleibt ein Unterschied: Dein Verein zahlt für Zugänge echtes Gehalt, Computer-Vereine nicht (AX4, BG12). | ✅ vorläufig, K31 §12 Nr. 22 |
| BH9 | **`tests/welt.js`** prüft dazu: Profile (Verteilung, Wirkung auf Qualitätsziel, Talente, Budget), Sternejagd an einem gebauten Fall und im Ablauf. Nie gelaufen. | ⚠️ offen |

---

## BI. Nachtrag zu U11c Computer-Vereine: Verträge nach Rang (19. November 2026, ohne Testlauf)

Wie BG und BH: kein Test gelaufen, die Zahlen sind geschätzt.

| # | Befund | Status |
|---|---|---|
| BI1 | **K31 §4 Nr. 4 gegen den bisherigen Code:** Computer-Vereine verlängerten beim Saisonwechsel jeden auslaufenden Vertrag mit 70 %, egal ob Stammspieler oder Überzähliger. Jetzt nach Rang im Kaderplan: Gebrauchte 90 %, junge Ergänzung 50 %, sonst 10 %. Gebrauchte werden schon von Oktober bis Dezember gebunden. | ✅ vorläufig, K31 §5.8 |
| BI2 | **K21 §4.3 (Vorvertrag fremder Spieler ohne Ablöse):** Für dich gibt es weniger ablösefreie Gelegenheiten bei Stammspielern anderer Vereine, mehr bei Überzähligen. Das entspricht K31 §1 („plant wie ein echter Verein“). | ✅ vorläufig, K31 §12 Nr. 24 |
| BI3 | **K36 Gleichschritt:** Das frühe Verlängern läuft im Markt-Strom für alle Vereine, deren Verträge nicht du führst, also im Gleichschritt-Test für beide Welten gleich. Nicht nachgeprüft. | ⚠️ messen |
| BI4 | **Saisonwechsel:** Der Kaderplan je Verein wird vor dem Altern und vor den Karriereenden berechnet, ohne Zufall. Die Zahl der Würfe bleibt gleich (ein Wurf je auslaufendem Vertrag), die Welt ändert sich trotzdem, weil andere Spieler bleiben. | ✅ |
| BI5 | **Mehr Vereinslose im Sommer:** Überzählige gehen jetzt meist. Der Deckel `saison.vereinsloseMax` (90) schneidet den Rest ab. Ob der Markt im Juli genug Vereinslose für offene Planstellen hat, zeigt erst `tests/welt.js`. | ⚠️ messen |
| BI6 | **BD4 und BD7 bleiben offen:** Vorverträge und Ausstiegsklauseln unter Computer-Vereinen fehlen weiter (jetzt U11d). | 📌 U11d |
| BI7 | **`tests/welt.js` Nr. 6c:** Chance je Rang, früh verlängern (zwölf Herbstwochen, etwa 86 %), nicht im März, deine Spieler unberührt, dazu im Ablauf der Anteil der Gebrauchten mit auslaufendem Vertrag (nur Ausgabe). Nie gelaufen. | ⚠️ offen |

---

## BJ. Nachtrag zu U11d1 Computer-Vereine: Leihen unter Computer-Vereinen, Leihkontingent (19. November 2026, ohne Testlauf)

Wie BG bis BI: kein Test gelaufen. Das Kontingent ist recherchiert (FIFA, DFL), die übrigen Zahlen sind geschätzt.

| # | Befund | Status |
|---|---|---|
| BJ1 | **Fehler aus U10d gefunden:** Die Spielerkarte nahm an, jede Leihe betreffe dich. Bei einer Leihe zwischen zwei anderen Vereinen hätte dort „Du zahlst sein Gehalt“ gestanden. Mit U11d1 gab es solche Leihen zum ersten Mal, die Karte zeigt jetzt „X hat ihn von Y ausgeliehen“. | ✅ behoben |
| BJ2 | **Andere Stellen, die Leihen nur bei dir erwarten:** `leiheGehaelter` und `leiheWoche` prüfen `von === S.my`. `leiheEnde` gibt jede Leihe zurück, egal von wem. Kauf geliehener Spieler ist gesperrt (`aktionen.js`, „gerade ausgeliehen“), ebenso bei `kiKandidat` und `kiStern`. Passt. | ✅ |
| BJ3 | **Berater-Tipps (K22) können einen geliehenen Spieler nennen** (`berater.js` filtert nur `wech`). Der Kauf scheitert dann mit „gerade ausgeliehen“. Klein, nicht geändert. | 📌 klein |
| BJ4 | **Leihen zählen zur Obergrenze des Fensters** (4 im Sommer, 2 im Winter). Dadurch gibt es etwas weniger Käufe. `tests/transfers.js` Nr. 1 (mindestens 15 Wechsel mit Ablöse je Saison) kann sich verschieben, ebenso `tests/welt.js` Nr. 7. | ⚠️ messen |
| BJ5 | **Zufall:** Die Suche nach Leihspielern würfelt im Markt-Strom (Schätzfehler). Die Welt nach dem ersten Fenster ist eine andere als mit U11c. | ✅ erwartet |
| BJ6 | **Kontingent auch für dich:** `verleihen`, `ausleihen` und die Liste der Leihvereine prüfen es. `tests/leihe.js` verleiht zwei Spieler und leiht einen aus, das bleibt unter 6. Nicht nachgeprüft. | ⚠️ messen |
| BJ7 | **Leihe am 1. Juli:** Der Markt läuft montags. Fiele ein Montag mit offenem Fenster vor den Saisonwechsel, endete eine Leihe sofort wieder. Deshalb leihen Computer-Vereine nur in der Spielphase (`S.phase === 'play'`). | ✅ vorbeugend |
| BJ8 | **Nicht gebaut:** Leihgebühr, Kaufoption und Rückruf unter Computer-Vereinen, Entwicklung beim Leihverein über dessen Stab (K08 §5.5), Leihen ins und aus dem Ausland, die Ausnahmen „vom Verein ausgebildet“ und die der DFL für junge deutsche Spieler. | 📌 später |
| BJ9 | **`tests/welt.js` Nr. 6d und Nr. 7:** Leihbar, Leihkandidat, Leihe ohne Geld, Kontingent (6, 3, bis 21 frei), Rückkehr am Saisonende. Im Ablauf wird jede Leihe geprüft (Fenster, Bedarf, leihbar, Kontingent, nie dein Verein), nach jedem Saisonwechsel ist niemand mehr verliehen. Nie gelaufen. | ⚠️ offen |

---

## BK. Nachtrag zu U11d2 Computer-Vereine: Vorstand und Trainerwechsel (19. November 2026, ohne Testlauf)

Wie BG bis BJ: kein Test gelaufen. Recherchiert ist nur der Zielwert (4 bis 10 Wechsel je Saison in der 1. Liga), alle Stellschrauben sind geschätzt.

| # | Befund | Status |
|---|---|---|
| BK1 | **K31 §5.5 hing an K28.** Gebaut ist nur der Teil für Computer-Vereine (K28 §7). Dein Vorstand rechnet weiter wie bisher (Werte je Spiel, Entlassung unter 12 nach der Schonfrist). Zwei verschiedene Modelle bis U12. | 📌 U12 |
| BK2 | **Kalibrierung offen:** Ob mit Grenze 20, Trägheit 0,2 und Sport 5 je Platz 4 bis 10 Wechsel je Saison in der 1. Liga herauskommen, zeigt erst `tests/welt.js` (Nr. 7 gibt die Zahl je Liga aus, gewertet wird nur „nicht absurd“). | ⚠️ messen |
| BK3 | **Neuer Stil mitten in der Saison:** `t.stil` ändert sich. Ob der Computer-Trainer im Spiel (K06, U5a) und die Gegneranalyse ihn ohne Zwischenspeicher lesen, habe ich nicht nachgeprüft. Die Vertrautheit mit dem neuen Stil ist niedrig, weil `vertrautheitWoche` in `training` jede Woche für jeden aktiven Verein die Werte aller anderen Stile speichert (mindestens 30). Ohne gespeicherten Wert gäbe `vertraut` dem neuen Lieblingsstil den Startwert 70. | ⚠️ prüfen |
| BK9 | **Grundordnung:** Zuerst geplant war eine neue Ordnung mit 50 %. Gestrichen, weil `kiOrdnung` die Ordnung der Computer-Vereine jeden Monat neu nach dem Kader wählt (in `training`). Die mitgebrachte Ordnung wäre nach spätestens vier Wochen wieder weg. | ✅ gestrichen |
| BK4 | **Eigene Zufallsströme** (`vorstandKI` je Woche und zum Saisonwechsel). Die übrigen Ströme bleiben gleich, die Welt ändert sich trotzdem, weil Stil und Ordnung die Spiele ändern. | ✅ |
| BK5 | **Saisonwechsel:** `kiVorstandSaison` läuft vor Auf- und Abstieg und vor `setTarget`, damit erwarteter und letzter Platz zur alten Saison gehören. Die Schonfrist zählt die Ligaspiele der Tabelle, die bei null beginnt, darum steht `ab` dann auf 0. | ✅ |
| BK6 | **Dein alter Verein:** Wirst du entlassen oder wechselst du, ist er ab dann ein Computer-Verein. Sein Vorstand beginnt mit 55, er hat Schonfrist bis zum siebten Ligaspiel der Saison. | ✅ |
| BK7 | **`tests/welt.js` Nr. 6e und Nr. 7:** Präsident, Niederlagenserie mit Ultimatum, Entlassung spätestens nach dem zweiten Ultimatum, Stimmungsschub, Wechsel im Sommer, Rückkehr zum Start. Im Ablauf die Zahl je Liga und Saison. Nie gelaufen. | ⚠️ offen |
| BK8 | **`tests/fuzz-karrieren.js`, `tests/schwierigkeit.js`, `tests/lizenz.js`** prüfen deinen Vorstand. Er ist unverändert, die Gegner spielen aber anders. Kann Werte verschieben. | ⚠️ messen |

---

## BL. Nachtrag zu U12a Vorstand: Vertrauen mit Bausteinen, Ultimatum, Ruf (20. November 2026, ohne Testlauf)

Eigener Zweig `mitarbeit/popolupo-u12-vorstand`, baut auf U11 auf (Präsident aus U11d2). Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BL1 | **Weniger Entlassungen, später:** Statt sofort an der Grenze gibt es zwei Ligaspiele Ultimatum, oft ein zweites. Der träge Anteil zieht das Vertrauen dabei zum Ziel, wer an der Grenze knapp unter dem Ziel liegt, übersteht das Ultimatum meist. `tests/fuzz-karrieren.js` und alle Läufe über mehrere Saisons sehen weniger Jobwechsel. | ⚠️ messen |
| BL2 | **`tests/schwierigkeit.js` angepasst:** Vertrauen 10 nach 7 Spieltagen gibt auf Schwer ein Ultimatum statt der Entlassung. Der Gleichschritt Leicht gegen Schwer bleibt gültig: Das Ultimatum hat keinen eigenen Halt, und der Würfel liegt in einem eigenen Strom (`ultimatum`). | ✅ angepasst |
| BL3 | **`tests/ui-zwei-saisons.js` angepasst:** Vertrauen 5 hätte nicht mehr sicher zur Entlassung geführt. Jetzt Vertrauen 0 und ein abgelaufenes letztes Ultimatum, dann entlässt die nächste Prüfung. | ✅ angepasst |
| BL4 | **Gleich viele Würfe im Strom „woche“:** Die Meldung bei Konto im Minus würfelt wie bisher nur bei Konto im Minus. Die Entlassungschance würfelt im eigenen Strom. Der Rest der Welt bleibt gleich, bis eine Entlassung anders fällt. | ✅ |
| BL5 | **Zwei Modelle angeglichen:** Dieselbe Formel (`vertrauenZiel`) für dich und die Computer-Vereine, mit verschiedenen Werten (dein Soll ist das Saisonziel, du hast zusätzlich Umfeld und Kredit, die Grenze kommt aus der Schwierigkeit). | ✅ |
| BL6 | **`tests/lizenz.js` und `tests/sim.js`** setzen bei einem Jobwechsel `S.fired`, `S.trust` usw. von Hand, aber nicht `S.ult`. Das Ultimatum merkt sich den Verein und verfällt beim Wechsel von selbst. | ✅ |
| BL7 | **Platz je Spiel entfällt:** Bisher gab jedes Ligaspiel ab dem 5. Spieltag −2 bis +0,6 für den Tabellenplatz. Das steckt jetzt im Baustein Sport (montags, träge). Wer weit unter dem Ziel steht, verliert Vertrauen langsamer, aber stetig. Kalibrierung offen. | ⚠️ messen |
| BL8 | **Ruf bei alten Spielständen:** fehlt, gilt als 30. | ✅ |
| BL9 | **`tests/vorstand.js`:** Formel, träger und schneller Anteil, Ultimatum (aufgehoben, letztes, Entlassung, nur beim eigenen Verein), Ruf, Jobangebote. Nie gelaufen. | ⚠️ offen |

---

## BM. Nachtrag zu U12b Vorstand: Nebenziele und Rücktritt (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u12-vorstand`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BM1 | **Zielgespräch (K28 §5.2) verschoben:** Ohne Transferbudget und Prämie (K23) hätte Tiefstapeln keinen Preis. | 📌 mit K23 |
| BM2 | **`setTarget` setzt jetzt auch die Nebenziele.** Es wird beim Spielstart, zum Saisonwechsel, beim Jobwechsel und beim Wechsel der Schwierigkeit gerufen. Eigener Strom je Saison und Verein, darum ändert mehrfaches Rufen nichts und verschiebt keinen anderen Strom. | ✅ |
| BM3 | **Pokal-Runden:** Der Stand liest `S.cup.hist` (eine Liste je gespielter Runde) und `S.cup.alive`. Annahme: `hist[r]` ist Runde r (0 = 1. Runde). So legt `ablauf.js` die Runden an. | ✅ angenommen |
| BM4 | **Einsätze statt Minuten:** `p.apps` zählt jedes Spiel mit Einsatz, auch im Pokal. Ob Testspiele mitzählen, habe ich nicht geprüft. Wenn ja, ist das Jugendziel leichter. | ⚠️ prüfen |
| BM5 | **Nebenziele im Vertrauen:** höchstens ±10 je Woche im Ziel, zum Saisonende ±5 je Nebenziel. Ein verfehltes Nebenziel kann damit über die Entlassung zum Saisonende (Vertrauen unter 15) mitentscheiden. | ⚠️ messen |
| BM6 | **Rücktritt nutzt den Weg der Entlassung** (`S.fired`, Jobangebote, Halt „Entlassen“). Das Fenster sagt „Zurückgetreten“. In den Tests mit Jobwechsel (`sim.js`, `lizenz.js`) wird `S.ruecktritt` nicht zurückgesetzt, dort tritt aber niemand zurück. | ✅ |
| BM7 | **Neuer Knopf im Büro** („Zurücktreten …“, mit Rückfrage). Die Browser-Tests klicken Knöpfe gezielt nach Text, keiner klickt zufällig. | ✅ |
| BM8 | **`tests/vorstand.js` Nr. 7 bis 9:** Nebenziele setzen, Stand, Baustein, Saisonende, Rücktritt mit Jobwechsel. Nie gelaufen. | ⚠️ offen |

---

## BN. Nachtrag zu U12c Beziehungsnetz (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u12-vorstand`. Kein Test gelaufen. Derbys recherchiert, alle anderen Zahlen aus K17 §11.

| # | Befund | Status |
|---|---|---|
| BN1 | **Ablöse mit Beziehung nur für dich:** `forderungDu` statt `forderungBasis` in `forderung` und `schmerzgrenze`. Die Sternejagd der Computer-Vereine nutzt weiter `forderungBasis` ohne Beziehung. | ✅ |
| BN2 | **Tests mit Käufen bei Derby-Rivalen:** `tests/transfers.js` und andere spielen oft mit Freiburg (Nr. 6). Freiburg hat das Baden-Derby gegen Karlsruhe. Ein Kauf in Karlsruhe ist jetzt etwa 4,5 % teurer. Ob ein Test genau dort kauft, habe ich nicht geprüft. | ⚠️ messen |
| BN3 | **Zufall:** Gewürfelt wird nur bei einer Beziehung unter −50 (Ablehnung), im Grundstrom, weil es deine Handlung ist. Alle anderen Änderungen sind fest. Die Welt bleibt gleich, solange niemand unter −50 fällt. | ✅ |
| BN4 | **Derby-Gleichgewicht:** Zwei Derbys je Saison mit Sieger geben −4, das Vergessen holt im Jahr etwa 46 % der Abweichung zurück. Ein Derby pendelt sich bei etwa −39 ein und bleibt über −50, blockiert also keine Wechsel. | ✅ gerechnet |
| BN5 | **Größe des Spielstands:** Jeder Wechsel unter Computer-Vereinen speichert eine Beziehung (+5). Gelöscht wird erst unter 2 Abstand, nach etwa 18 Monaten. Geschätzt einige Hundert Einträge mit je bis zu fünf Gründen, grob 50 KB. | ⚠️ messen |
| BN6 | **Testspiele:** Jedes gespielte Testspiel gibt +3, das erhöht die Zusage beim nächsten Mal leicht. `tests/testspiele.js` prüft Zusagen. Bei Beziehung 0 gilt der alte Wert genau. | ⚠️ messen |
| BN7 | **Nicht gebaut:** Abwerben (K20), Gerüchte und Fehden (K29), Brisanz im Spiel (K09), Hilfe in der Not, Versöhnung und lachender Dritter (K30), Partnervereine (keine Quelle), Rheinland-Derby als Gruppe. | 📌 später |
| BN8 | **`tests/beziehungen.js`:** Grundwerte, Verlauf, Vergessen, Ablöse, Gesprächsbereitschaft, Testspiele, Derby, fairer Kauf, Computer-Vereine meiden −50, Anzeige. Nie gelaufen. | ⚠️ offen |

---

## BO. Nachtrag zu U12d Ereigniskarten: Gerüst und die ersten fünf Karten (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u12-vorstand`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BO1 | **Gleichschritt mit und ohne Automatik (`tests/lizenz.js`, K36 §10):** Wer nicht antwortet, bekommt die Voreinstellung, und zwar vor den Spielen desselben Tages (`kartenAuto` am Anfang von `tagesSpieleVorbereiten`). In der Automatik geschieht das schon montags am Ende der Woche. Dazwischen liegt nichts, was Spiele beeinflusst. Der Würfel einer Karte hängt nur an Karte, Saison und Tag. | ✅ entworfen |
| BO2 | **Neuer Halt „Ereignis“** (K01): nur bei einer Entscheidung im Budget, höchstens eine kleine je Woche, mit den Spielen der Woche höchstens 4 Halte. `tests/lizenz.js` zählt Halte, der neue Grund ist dort nicht verboten. | ⚠️ messen |
| BO3 | **Eigener Strom `ereignisse`:** jede Woche fünf Würfe (einer je Karte), danach Auslöser. Keine Verschiebung anderer Ströme. | ✅ |
| BO4 | **Häufigkeit:** Mit 1 zu 120 je Woche und Karte kommen pro Saison grob ein bis zwei Karten, weil die Hochzeit fast immer auslösbar ist und der Geheimtipp oft. Das ist weit unter „15–30 Entscheidungen je Saison“ (§10), der Katalog ist aber erst fünf Karten groß. | 📌 wächst mit dem Katalog |
| BO5 | **Keine Ketten, keine verzögerten Folgen, keine Merker** (§3.1). Die erste Karte, die sie braucht, ist der lachende Dritte (§8.3, K17 §5.4). | 📌 später |
| BO6 | **„Ultimatum“ (K28 §8) ist keine Karte**, sondern seit U12a eine Meldung mit Frist (`vorstandPruefen`). Ob es in den Katalog wandert, entscheidet sich mit der Priorität „Fristen und Pflichten“ (§5.2). | 📌 offen |
| BO7 | **`tests/karten.js`:** Prüfskript für den Katalog, Auslöser, Entscheidung mit Halt, Automatik ohne Antwort, Budget, gleicher Würfel, Woche. Nie gelaufen. | ⚠️ offen |

---

## BP. Nachtrag zu UX1 automatische Usability-Prüfungen (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u12-vorstand` (UX1 folgt laut PLAN §7 direkt auf U12). Konzept neu: `konzepte/K40-usability.md`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BP1 | **Neue Abhängigkeit für Tester:** axe-core (`npm i axe-core`), wie Playwright nicht im Repo. Ohne axe-core prüft das Skript nur die Tastatur und sagt das. | ✅ dokumentiert |
| BP2 | **Fokus beim Öffnen eines Fensters** liegt jetzt auf dem Schließen-Knopf oder dem Fenster selbst. Die Browser-Tests klicken und füllen Felder gezielt, der Fokus stört sie nicht. Nicht nachgeprüft. | ⚠️ messen |
| BP3 | **Escape schließt Fenster mit Schließen-Knopf** (Spielerkarte, Menü, Jugend, Zweite, Lizenz). Entlassung und Saisonbilanz haben keinen und bleiben offen. | ✅ |
| BP4 | **Erster Lauf wird Verstöße finden** (zum Beispiel Kontraste der Regler oder Tabellen ohne Überschriften). Sie kommen nach `konzepte/_usability.md`, abgearbeitet wird danach. | 📌 erwartet |
| BP5 | **Nicht nachgeprüft:** `axe.source` und das Feld `impact` (K40 §12). Das Skript meldet, wenn `axe.source` fehlt. | ⚠️ prüfen |

---

## BQ. Nachtrag zu U13 Statistik und Historie (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u13-statistik` (baut auf U12 auf). Konzept: K34 §5.3 bis §5.9 und §12. Neue Datei `js/statistik.js`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BQ1 | **Vorlagen mit eigenem Strom `vorlagen` je Spiel**, nach dem Spiel verteilt. Ergebnisse, Noten und alle anderen Ströme bleiben gleich. `tests/statistik.js` vergleicht eine Saison mit und ohne Statistik. | ✅ entworfen |
| BQ2 | **Marktwert +5 % für Geehrte** (bis zum Ende der folgenden Saison) ändert Preise und damit ab der zweiten Saison den Transfermarkt. Läufe über mehrere Saisons (`tests/welt.js 10`, `tests/fuzz-karrieren.js`) sehen andere Wechsel. Je Liga und Saison sind das etwa 15 Spieler. | ⚠️ messen |
| BQ3 | **Speicher:** geschätzt 1700 aktive Spieler mit im Schnitt 6 Zeilen zu 45 Zeichen, dazu Archiv (etwa 2 KB je Saison) und Ehemalige (höchstens 400). Grob 500 KB nach 20 Saisons. Der Test misst anteilig. | ⚠️ messen |
| BQ4 | **Meldungen:** Bundesliga-Rekorde kommen fast nie (echte Startwerte). Rekordtransfer und Rekorde der eigenen Liga melden erst ab der zweiten Saison, Vereinsrekorde nur beim Übertreffen eines alten Werts. In den ersten Saisons nach dem Start kann der Rekordtransfer trotzdem mehrmals fallen. | ⚠️ messen |
| BQ5 | **Gleichschritt (`tests/lizenz.js`, `tests/schwierigkeit.js`):** Die Statistik würfelt nur im eigenen Strom. Der Ruf +5 für den Trainer der Saison wirkt nur auf deine Jobangebote. | ✅ entworfen |
| BQ6 | **Rechenzeit der Ansicht:** Die Seite „Saison“ läuft bei jedem Aufbau über alle Spieler (Ligen, Ausland, Jugend, Zweite). Im Browser nicht gemessen. | ⚠️ messen |
| BQ7 | **Browser-Tests:** `tests/ui-zugang.js` und `tests/ui-zwei-saisons.js` prüfen jetzt auch die Ansicht Statistik. Der Vergleich hat eine leere Kopfzelle oben links, axe kann das als kleinen Verstoß melden (zählt nicht, nur schwere Verstöße zählen). | ⚠️ messen |
| BQ8 | **Alte Spielstände:** `S.stat`, `p.sst` und `p.kar` entstehen beim ersten Spiel. Die Statistik beginnt dann mit der laufenden Saison. `tests/statistik.js` prüft das. | ✅ |
| BQ9 | **Zwei Torjägerlisten:** Die Tabelle zeigt weiter `topScorers` (Ligatore nach dem heutigen Verein), die Statistik zählt je Liga aus den Zeilen. Bei einem Wechsel zwischen den Ligen im Winter können sie sich unterscheiden. Die Ehrung folgt der Statistik. | 📌 später angleichen |
| BQ10 | **Nicht gebaut:** Sprüche-Chronik (wartet auf K29), Turnierpokale (K11), Gehalt des Trainers (K28), Startwerte der Rekorde für die 2. und 3. Liga, Linien für Form und Marktwert (gespeichert, angezeigt wird nur die Stärke). | 📌 später |
| BQ11 | **`tests/statistik.js`:** sechs Prüfungen, siehe Test-README. Nie gelaufen. Dafür hat `tests/sim.js` die Option `vorher` bekommen (läuft vor dem Welt-Aufbau). | ⚠️ offen |

---

## BR. Nachtrag zu U14 Saisonvorbereitung (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u14-saisonvorbereitung` (baut auf U13 auf). Konzept: K12b §5.1 bis §5.3 und §12. Neue Datei `js/vorbereitung.js`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BR1 | **Geld für Computer-Vereine:** Jeder Verein bekommt zur Saisoneröffnung Ansehen × 2.000 € (Erstligist mit Ansehen 70: 140.000 €). Das ändert ihre Konten und damit Käufe ab dem ersten Sommer. `tests/welt.js` prüft Budgets und Wechselzahlen, die Größenordnung ist klein gegen die Einnahmen je Spieltag. | ⚠️ messen |
| BR2 | **Eigener Strom `eroeffnung`** je Verein und Saison, nur für den Regen. Der Tagesstrom bleibt gleich. | ✅ |
| BR3 | **Gleichschritt (`tests/lizenz.js`):** Die Eröffnung hängt nicht an Lernstufen oder Automatik, nur am Spielplan. Die Liste ist reine Anzeige. Die neue Erinnerung ist kein Halt. | ✅ entworfen |
| BR4 | **Erinnerung auf „Schwer“:** Die neue Art `vorbereitung` steht in `RK.erinnerungen`, also schaltet „Schwer“ sie zum Spielstart ab wie die anderen. Alte Spielstände auf „Schwer“ haben sie an (die Abschaltung läuft nur beim Start). | 📌 klein |
| BR5 | **Liste erst ab 1. Juli** statt ab Saisonabschluss (K12b §12 Nr. 1). In der Phase „Saisonende“ zeigt das Büro keine Liste. | 📌 vorläufig |
| BR6 | **Nicht gebaut:** Sponsorentag und weitere Werbeflächen (K24), Trikotvorstellung (K25), Zielgespräch (K28), Fanstimmung +3 (K27), Presse-Anekdote zum Foto (K29). Die Liste bekommt die Punkte mit ihren Konzepten. | 📌 später |
| BR7 | **Mannschaftsfotos** liegen in `S.stat.foto` (höchstens 30) und stehen auf der Statistik-Seite Karriere. | ✅ |
| BR8 | **`tests/vorbereitung.js`:** sieben Prüfungen, siehe Test-README. Nie gelaufen. | ⚠️ offen |

---

## BS. Nachtrag zu U15 Transfers II: Abwerben, Deadline Day, Bieterrunde (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u15-transfers2` (baut auf U14 auf). Konzept: K20 §5.4 und §12. Neue Datei `js/abwerben.js`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BS1 | **Zusätzlicher Markttag am letzten Tag jedes Fensters** für alle Computer-Vereine (eigener Strom `deadline`). Die Obergrenzen je Fenster (`computer.kauf.jeFenster` 4 und 2) gelten weiter, weil `kiBudget` je Fenster zählt. `tests/welt.js` sieht mehr Wechsel zum Fensterende, die Zahl je Saison steigt etwas. | ⚠️ messen |
| BS2 | **Neuer Halt „Deadline Day“** zweimal je Saison. `tests/lizenz.js` und `tests/karten.js` zählen Halte, beide Läufe haben ihn gleich. Auf „Schwer“ ist er wie alle Erinnerungen beim Start aus. | ✅ entworfen |
| BS3 | **Abwerben würfelt im Grundstrom**, weil es deine Handlung ist (wie Ablehnungen in K17, BN3). Ohne Abwerben ändert sich nichts. | ✅ |
| BS4 | **Ablöse +15 % nach Auffliegen** steckt in `forderungDu`, also nur für dich. Die Computer-Vereine untereinander sind nicht betroffen. | ✅ |
| BS5 | **Computer-Vereine setzen gelistete Spieler zurück:** `kiListe` (computer.js) nimmt Spieler von der Liste, die nicht mehr im Abgabeplan stehen. Ein abgeworbener Spieler kann so wieder von der Liste fallen, sein Wechselwunsch (Ablöse −10 %) bleibt. Gilt schon für jeden Wechselwunsch Stufe 3 seit U8. | 📌 später prüfen |
| BS6 | **Nicht gebaut:** Computer-Vereine werben deine Spieler ab (§7), Bieterwettstreit beim Kauf, Spieler lehnt das höchste Gebot ab, Preise ±15 % am Deadline Day, Fans und Presse beim Auffliegen (K27, K29), Nationalspieler im Risiko. | 📌 später |
| BS7 | **`tests/abwerben.js`:** sieben Prüfungen, siehe Test-README. Nie gelaufen. | ⚠️ offen |

---

## BT. Nachtrag zu U16 Fans (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u16-fans` (baut auf U15 auf). Konzept: K27 §5.4b und §12. Neue Datei `js/fans.js`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BT1 | **Zuschauer und Einnahmen:** Am Start ist die Stimmung 60 und der Faktor genau 1. Danach schwankt er zwischen 0,85 und 1,10. Wer erfolgreich ist und faire Preise nimmt, hat bis zu 10 % mehr Zuschauer, auch in der Vorhersage am Ticketpreis. Ein eigenes Finanz-Prüfskript gibt es nicht. `tests/testspiele.js` (Zuschauer im Testspiel), `tests/schwierigkeit.js` (Konten) und `tests/ui-zwei-saisons.js` können abweichen. | ⚠️ messen |
| BT2 | **Vorstand mit toter Zone:** Zwischen 45 und 75 wirkt die Fanstimmung nicht. `tests/vorstand.js` rechnet das Ziel ohne Fans nach. Das stimmt, solange die Stimmung in der Zone bleibt, am Start also immer. | ✅ entworfen |
| BT3 | **Pfiffe** ändern das Selbstvertrauen (−0,2 je Heimspiel unter 30) und damit die Torchance (`abschluss` nutzt `sv`). Ergebnisse ändern sich erst, wenn eine Stimmung unter 30 fällt. | ⚠️ messen |
| BT4 | **Ohne Zufall:** Fanstimmung, Anlässe und Fan-Gespräch würfeln nicht. Kein Strom verschiebt sich. | ✅ |
| BT5 | **Publikumslieblinge ab Spielbeginn:** In der ersten Saison gibt es kaum welche (60 Pflichtspiele), die Identifikation steigt erst ab der zweiten. Eigengewächse kennt das Spiel nur für Aufrücker ab U16. | 📌 vorläufig |
| BT6 | **Rechenzeit:** Montags für 56 Vereine Tabelle und Lieblinge (Zeilen der Statistik). Nicht gemessen. | ⚠️ messen |
| BT7 | **Nicht gebaut:** Dauerkarten, Gästeblock (K23), Ultras und Tradition (keine Quellen je Verein), Choreo, Pyro, Platzsturm (K09, K30), Heimvorteil durch Fans, Wirkung auf den Vorstand der Computer-Vereine, Presse (K29), der negative Teil der Identifikation. | 📌 später |
| BT8 | **`tests/fans.js`:** zehn Prüfungen, siehe Test-README. Nie gelaufen. | ⚠️ offen |

---

## BU. Nachtrag zu U17a Pressekonferenzen (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u17-presse` (baut auf U16 auf). Konzept: K29 §5.4 und §12 Nr. 7 bis 14. Neue Dateien `daten/presse.js` und `js/presse.js`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BU1 | **Gleichschritt (`tests/lizenz.js`):** Mit Lernstufen geht bis zur C-Lizenz sofort der Co-Trainer, danach bleibt die Pressekonferenz einen Tag offen und der Co-Trainer geht am nächsten Tag. Ohne Lernstufen mit Automatik geht er sofort. Der Co-Trainer würfelt nicht und ändert nur das Medienklima, das nirgends wirkt. Ergebnisse bleiben gleich. | ✅ entworfen |
| BU2 | **Neuer Halt „Pressekonferenz“:** höchstens 20 je Saison, mindestens 4 Tage Abstand. Der Vergleich „mit Lernstufen nicht mehr Halte als ohne“ (`tests/lizenz.js`) hält, weil die Lernstufen bis zur C-Lizenz keine Pressekonferenz-Halte haben. | ✅ entworfen |
| BU3 | **Eigener Strom `presse`** für Anlass und Fragen, deine Antworten im Grundstrom. Wer nicht antwortet, verschiebt keinen Strom. | ✅ |
| BU4 | **Wirkung auf Stimmung, Vorstand, Fans:** nur durch deine Antworten. Im Test-Lauf ohne Oberfläche antwortet niemand, also keine Wirkung außer Medienklima. Was die Antworten im Spiel bewegen, zeigt erst das Spielen mit Oberfläche. | ⚠️ messen (Testrunde mit Menschen) |
| BU5 | **Kein Ton dominiert (K29 §10):** Der Test mit fünf Strategien über viele Saisons fehlt noch, weil die Simulation keine Antworten wählt. Die Werte sind so gesetzt, dass jede Art einen Preis hat. | 📌 Test später |
| BU6 | **Katalog klein:** 54 Fragen, 30 Antworten, 22 Schlagzeilen. Wiederholungen kommen öfter als in K29 §10 verlangt. | 📌 wächst |
| BU7 | **Kampfansagen ohne Gegner** (Antritt, Auftakt ohne Ligaspiel) werden nicht geprüft. | 📌 klein |
| BU8 | **Nicht gebaut:** Gerüchteküche (U17b), Medienpolitik, Exklusivinterview, Maulkorb, Interviews der Spieler, Interview am Spielfeldrand, Computer-Trainer mit Medienprofil, Journalisten mit Beziehung, Pressekonferenz nach Urteilen. | 📌 später |
| BU9 | **`tests/presse.js`:** sieben Prüfungen, siehe Test-README. Nie gelaufen. | ⚠️ offen |

---

## BV. Nachtrag zu U18a Trainerpool (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u18-trainerpool` (baut auf U17 auf). Konzept: K32 §3.3b und §12 Nr. 21 bis 25. Neue Datei `js/trainerpool.js`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BV1 | **Trainerwechsel würfelt den Stil nicht mehr:** Der Nachfolger bringt seinen Lieblingsstil mit, `profilStil()` fällt im Strom `vorstandKI` weg. Damit verschieben sich die späteren Würfe dieses Stroms, und die Stile der Vereine nach einem Wechsel sind andere. Ergebnisse ab dem ersten Trainerwechsel weichen von U17 ab. Gleichschritt-Tests vergleichen Läufe desselben Stands und bleiben gültig. | ⚠️ messen |
| BV2 | **Eigener Strom `trainerpool`** für Aufbau, neue Trainer und Ex-Spieler. Der Aufbau passiert beim ersten Zugriff (Trainerwechsel, Saisonende, Jobwechsel oder Anzeige). Weil er nur im eigenen Strom würfelt, ist der Zeitpunkt egal. | ✅ |
| BV3 | **Verteilung der Stile:** Freie Trainer bekommen ihren Stil aus `profilStil()` wie bisher die Nachfolger. Die Verteilung über viele Wechsel bleibt gleich. | ✅ entworfen |
| BV4 | **Keine echten Personen:** Cheftrainer haben erfundene Namen. Ex-Spieler werden nur Trainer, wenn ihr Name nicht in `daten/spieler.js` steht. | ✅ |
| BV5 | **Ruf der Computer-Trainer** wirkt noch nirgends außer bei der Wahl des Nachfolgers. Später: Jobangebote für dich gegen Konkurrenz, Medienprofil (K29). | 📌 später |
| BV6 | **Nicht gebaut:** Ex-Spieler als Mitarbeiter im Stab (K16), Karriereende nach K32 §5.1, Ereignisse aus K32 §8 (Altstar, Abschiedsspiel, Rückkehrer, England ruft). | 📌 später |
| BV7 | **`tests/trainerpool.js`:** fünf Prüfungen, siehe Test-README. Nie gelaufen. | ⚠️ offen |

---

## BW. Basisstand mit Testlauf übernommen, Gerüchteküche U17b (20. November 2026, U17b ohne Testlauf)

| # | Befund | Status |
|---|---|---|
| BW1 | **Testlauf auf dem Basisstand:** Der Commit e8ea42d auf `claude/compassionate-galileo-bsbua4` meldet für U10d „alle Tests gelaufen“ und behebt dieselbe verschluckte Buchung der Stab-Gehälter wie mein Commit a789c0a auf U11 (BF8). Ich habe e8ea42d in U11 zusammengeführt (Konflikt in `ablauf.js` zugunsten der Fassung mit `/* */`) und von dort nacheinander in U12 bis U18. Meine Zweige U11 bis U18 selbst sind weiter ungetestet. | ✅ zusammengeführt |
| BW2 | **Wächter `tests/code.js` (BF9) auf meinen Zweigen:** Ohne Node.js habe ich ihn in Perl nachgebaut (gleiche Regeln) und über U11 bis U18 und U17b laufen lassen. Keine Zeile, in der ein Kommentar Code verschluckt. Gegenprobe mit der fehlerhaften Fassung von `ablauf.js`: wird gefunden. | ✅ |
| BW3 | **Gerüchteküche im eigenen Strom `geruechte`.** Wirkungen: Stimmung −3 bei Wechselgerüchten über deine Spieler, Vertrauen −2 bei Gerüchten über dich, Fans −2 beim Liebling, Ablöse und Gebote ×1,1 oder ×1,15 für 30 Tage. Die Stimmung ändert sich auch im Lauf ohne Oberfläche, also auch die Ergebnisse (wenig). | ⚠️ messen |
| BW4 | **Gleichschritt (`tests/lizenz.js`):** Die Gerüchte hängen nur an Dingen, die in beiden Läufen gleich sind (Verhandlungen gibt es im Test nicht, Wechselwunsch, Berater, Ultimatum, Beziehungen, Listen). Die Pressekonferenz dazu fällt unter BU1. | ✅ entworfen |
| BW5 | **Gebote bei bekanntem Interesse:** `gebotFuer` multipliziert Gebot und Grenze der Transferliste, nicht die Obergrenze `max` für deine Gegenforderung. Wer mehr fordert, kommt also nicht weiter als ohne Gerücht. | 📌 klein |
| BW6 | **Nicht gebaut:** Medienpolitik, Exklusivinterview, Gerüchte unter Computer-Vereinen mit Wirkung auf deren Spieler, Gehaltsforderung bei bekanntem Interesse. | 📌 später |
| BW7 | **`tests/geruechte.js`:** sechs Prüfungen, siehe Test-README. Nie gelaufen. `tests/presse.js` kennt den neuen Platzhalter `{medium}` und 14 Anlässe. | ⚠️ offen |

---

## BX. Nachtrag zu U18b Ereigniskarten der Spielwelt (20. November 2026, ohne Testlauf)

Zweig `mitarbeit/popolupo-u18b-spielwelt-karten` (baut auf U17b auf). Konzept: K32 §8 und §12 Nr. 26, K30 §3.2. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BX1 | **Mehr Würfe im Strom `ereignisse`:** Jede Woche ein Wurf mehr je neuer Karte (vier mehr) und eine längere Mischung. Alle späteren Karten fallen dadurch anders als in U17b. Kein anderer Strom ist betroffen. | ✅ bekannt |
| BX2 | **Gleichschritt (`tests/lizenz.js`):** Die Auslöser schauen nicht auf Lizenz oder Automatik, sonst zögen die Läufe mit und ohne Lernstufen verschiedene Karten (ein erster Entwurf tat das, vor dem Commit korrigiert). Die Lizenz prüft erst die Wirkung: „verpflichten“ geht nur, wenn `transfers` frei ist, sonst eine Meldung. Die Voreinstellungen sind in beiden Läufen gleich. | ✅ entworfen |
| BX3 | **Abschiedsspiel braucht Ehemalige** aus K34 (`S.stat.ehem`). Die gibt es erst nach dem ersten Saisonwechsel, und nur mit 60 Pflichtspielen für deinen Verein ab Spielbeginn. In den ersten zwei Saisons kommt die Karte also kaum. | 📌 vorläufig |
| BX4 | **Karriereende nach K32 §5.1** bleibt offen, bis ein Testlauf zeigt, wie stabil die Welt ist (es verschiebt Alter und Zahl der Spieler). | 📌 nach Testlauf |
| BX5 | **`tests/spielwelt-karten.js`:** vier Prüfungen. Den Katalog prüft `tests/karten.js` mit (erlaubte Wirkungen, Platzhalter, Auslöser). Nie gelaufen. | ⚠️ offen |

---

## BY. Nachtrag zu K23a Finanzplan: Monatsbericht, Prognose, Lizenzprüfung, Insolvenz (21. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k23-finanzen` (auf 362fa12, Testlauf 4). Konzept: K23 §5.5b, §5.5c, §12 Nr. 5 bis 9. Neue Datei `js/finanzen.js`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| BY1 | **Kein Geld verschoben:** Die Buchungen bleiben je Spieltag, der Monatsbericht fasst nur zusammen. Für einen gesunden Verein ändert K23a nichts außer Meldungen und der Finanzseite. Ergebnisse aller übrigen Tests sollten gleich bleiben. | ✅ entworfen |
| BY2 | **Ohne Zufall:** Bericht, Prognose, Lizenz und Insolvenz würfeln nicht. Kein Strom verschiebt sich. | ✅ |
| BY3 | **Punktabzug in `table`:** wirkt nur, wenn `S.abzug` für die Saison einen Eintrag hat. Sonst unveränderte Tabelle. | ✅ |
| BY4 | **Transfersperre** sperrt deine Käufe (`offer`), Leihen (`ausleihen`), den Altstar aus den Karten und die Automatik der Transfers für deinen Verein (`kiMarkt`). In der Automatik fallen damit Würfe im Strom `markt` weg, beide Läufe des Gleichschritts haben aber dieselben Finanzen und damit dieselbe Sperre. | ✅ entworfen |
| BY5 | **Liquidität zählt den freien Kreditrahmen mit.** Darum hilft ein neuer Kredit bei den Auflagen nicht (Kontostand steigt, freier Rahmen sinkt gleich viel). Nachweis nur über Verkäufe oder geringere Kosten. | 📌 vorläufig |
| BY6 | **Kontostand nachvollziehbar (K23 §10):** `tests/finanzen.js` prüft über eine Saison, ob Startstand plus Summe der Monatssalden den Kontostand ergibt. Fällt die Prüfung durch, ändert irgendwo Code dein Konto ohne `money()`. Bekannt ist der Kredit (`loan`), er bucht nicht in `S.fin`. | ⚠️ messen |
| BY7 | **Computer-Vereine** bekommen Lizenz und Insolvenz erst mit K23b (heute keine Ausgaben). | 📌 K23b |
| BY8 | **Nummern der Nachträge:** popolupo nimmt in der Konsistenzprüfung die nächsten freien Buchstaben (BY, BZ, CA …). Sollte Claude gleichzeitig einen Nachtrag anhängen, gibt es beim Zusammenführen einen Konflikt am Dateiende. Dann einfach umbenennen. | 📌 Absprache |
| BY9 | **`tests/finanzen.js`:** fünf Prüfungen, siehe Test-README. Nie gelaufen. | ⚠️ offen |

---

## BZ. Nachtrag zu K23e: Kredit mit Laufzeit, Ablöse in Raten, Gehaltsverzicht, Karten Mäzen und Steuerprüfung (21. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k23-finanzen`. Konzept: K23 §5.5d, §12 Nr. 10 bis 14. Kein Test gelaufen. Dazu das Messskript `tests/finanzmodell.js` für K23b.

| # | Befund | Status |
|---|---|---|
| BZ1 | **Monatliche Tilgung verschiebt dein Konto:** Wer einen Kredit hat, zahlt jetzt jeden Monat ab (vorher nur auf Knopfdruck oder in der Automatik am Saisonende). Im Simulator nimmt niemand Kredit, die Tests ohne Kredit bleiben gleich. Alte Spielstände mit Kredit bekommen beim ersten Zugriff eine Tranche über drei Jahre. | ⚠️ messen |
| BZ2 | **Kreditflüsse außerhalb von `S.fin`:** Saisonbilanz, Nebenziel „Finanzen“ (K28) und die Ergebnisse in der Statistik (K34) sehen Kredite wie bisher nicht. Der Monatsbericht und `tests/finanzen.js` rechnen sie getrennt mit (`k`). | ✅ |
| BZ3 | **Raten aus Ablösen:** Der Verkäufer bekommt alles sofort, du zahlst die Hälfte sofort und den Rest mit 5 % Aufschlag. Computer-Vereine nutzen keine Raten. Die Prognose zieht offene Raten und Tilgungen ab. | ✅ vorläufig |
| BZ4 | **Gehaltsverzicht** senkt die Buchung „Gehälter“ für 90 Tage um 15 %. Die Prämien (K21) bleiben. | ✅ |
| BZ5 | **Neue Karten im Strom `ereignisse`:** zwei Würfe mehr je Woche (BX1 gilt weiter). Der Mäzen kommt nur in der Not (Kontostand im Minus oder offene Auflagen), in beiden Läufen des Gleichschritts gleich. | ✅ entworfen |
| BZ6 | **Beträge der Karten** (1,5 Mio. €, 250.000 €, 400.000 €) sind feste Werte in der heutigen Größenordnung. Nach K23c müssen sie mit. | 📌 K23c |
| BZ7 | **`tests/finanzmodell.js` (Messung für K23b):** rechnet in einer normalen Saison für jeden Verein aus, was Einnahmen und Ausgaben nach dem vollen Modell wären, und vergleicht mit der heutigen Pauschale. Keine Prüfung, nur Zahlen. Bitte die Ausgabe ins Testprotokoll, danach stelle ich K23b ein. | ⚠️ bitte laufen lassen |
| BZ8 | **`tests/finanzen.js`** hat vier Prüfungen mehr (Kredit, Raten, Gehaltsverzicht, Mäzen), zusammen neun. Nie gelaufen. | ⚠️ offen |

---

## CA. Nachtrag zu K25a Marketing: Trikot, Kampagnen, Werbewert (21. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k25-marketing` (baut auf `mitarbeit/popolupo-k23-finanzen` auf). Konzept: K25 §5.4, §12 Nr. 1 bis 6. Neue Datei `js/marketing.js`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| CA1 | **Fast geldneutral:** Der Fanartikel-Erlös bleibt je Zuschauer, dazu Faktoren. Das Trikot liegt im Schnitt bei etwa 1,0. Neu sind +5 % je Publikumsliebling (höchstens +15 %). In der ersten Saison gibt es kaum Lieblinge (K27 BT5), danach etwas mehr Fanartikel-Erlös als bisher. | ⚠️ messen |
| CA2 | **Eigener Strom `trikot`** je Saison und Verein, ein Wurf (beim mutigen Design Kult oder Spott, sonst die Stelle in der Spanne). Kein anderer Strom verschiebt sich. | ✅ |
| CA3 | **Gleichschritt (`tests/lizenz.js`):** Ohne Wahl nimmt der Verein am Tag vor dem ersten Pflichtspiel das klassische Trikot, mit und ohne Automatik am selben Tag. Kampagnen startet nur der Mensch. | ✅ entworfen |
| CA4 | **Liste vor dem Saisonstart** (K12b) hat jetzt acht Punkte. `tests/vorbereitung.js` erwartet 8. | ✅ |
| CA5 | **Fanarbeit wirkt auf die Pfiffe** (K27), weil es noch keine Pyrotechnik gibt (K09). | 📌 vorläufig |
| CA6 | **Nicht gebaut:** Dauerkarten-Aktion, Mitgliederaktion, Online-Shop, Sortiment in Stufen, Kampagnen der Computer-Vereine, Karten aus K25 §8 (Retro-Trikot zum Jubiläum, Trikot ausverkauft), Tradition als Stammdatum. | 📌 später |
| CA7 | **`tests/marketing.js`:** sechs Prüfungen, siehe Test-README. Nie gelaufen. | ⚠️ offen |

---

## CB. Nachtrag zu K26a Stadion: Bauprozess, Anlagen, Instandhaltung (21. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k26-stadion` (baut auf `mitarbeit/popolupo-k25-marketing` auf). Konzept: K26 §5.1, §12 Nr. 1 bis 7. Neue Datei `js/stadion.js`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| CB1 | **Welt neutral zum Start:** Das Trainingsgelände beginnt auf Stufe 2 mit Faktor 1, Nachwuchsleistungszentrum und Reha-Zentrum auf Stufe 0 (Deckel 70 wie bisher, Faktor 1). Catering und Anzeigetafel fehlen zum Start. Ohne Ausbau ändert sich nichts an Training, Jugend, Verletzungen und Zuschauereinnahmen. | ✅ entworfen |
| CB2 | **Eigener Strom `bau`** je Saison, Tag und Bauteil. Alle Würfe (Genehmigung, Auflagen, Verzögerung, Mehrkosten) fallen beim Start. Kein anderer Strom verschiebt sich. | ✅ |
| CB3 | **Gleichschritt (`tests/lizenz.js`):** Bauen startet nur der Mensch, `stadion` hat keine Automatik. Ohne Bau läuft `bauTag` leer. | ✅ entworfen |
| CB4 | **Tribüne:** Während des Baus fehlen 3.000 Plätze, danach kommen 6.000 dazu, zusammen +3.000 wie bisher. Bei einer laufenden alten Baustelle ohne Phase kommen wie bisher 3.000 dazu. | ✅ entworfen |
| CB5 | **Reha und Physio zusammen höchstens −25 %** Ausfallzeit. Der Physio allein schafft höchstens −25 % (`stab.physio.max`), die Untergrenze ändert für Vereine ohne Reha-Zentrum nichts. | ✅ |
| CB6 | **Computer-Vereine bauen noch nicht.** Ihre Anlagen stehen auf der Startstufe, Instandhaltung zahlen sie nicht. | 📌 vorläufig |
| CB7 | **`startBuildAlt`** in `js/aktionen.js` bleibt als alter Ablauf stehen, wird aber nicht mehr aufgerufen. Kann weg, sobald `tests/stadion.js` gelaufen ist. **Entfernt am 22.11. (T5.5).** | ✅ |
| CB8 | **Nicht gebaut:** neues Stadion als Großprojekt, Stehplätze und Sitzplätze, Rasenqualität und Rasenheizung, Flutlicht, Parkplätze, Namensrechte, Zuschuss der Stadt. | 📌 später |
| CB9 | **`tests/stadion.js`:** sechs Prüfungen, siehe Test-README. Nie gelaufen. | ⚠️ offen |

---

## CC. Nachtrag zu U19a Europapokal: Teilnehmer, Ligaphase, K.-o.-Runden, Spiele (21. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-u19-europapokal` (baut auf `mitarbeit/popolupo-k26-stadion` auf). Konzept: K37, §12 Nr. 1 bis 13. Neue Datei `js/europa.js`. Kein Test gelaufen.

| # | Befund | Status |
|---|---|---|
| CC1 | **Die Welt ändert sich:** Bis zu neun deutsche Vereine spielen 6 bis 17 Spiele mehr. Frische, Verletzungen und Training (über `spielendeAm`) ändern sich bei ihnen, damit auch Liga-Ergebnisse. Kalibrierung, Akzeptanz und Fuzz-Tests können sich verschieben. | ⚠️ messen |
| CC2 | **Stärke der Auslandsvereine** (AW13): Mittel der elf Besten aus Kernspielern und `avStaerke`, Faktor `REU.staerke.faktor` = 1. Ob deutsche Vereine zu oft oder zu selten weiterkommen, zeigt erst ein Lauf über viele Saisons (K37 §10). | ⚠️ messen |
| CC3 | **Block statt Kader** (K37 §5.2, Nr. 11): Gegen einen Auslandsverein laufen die Angriffe wie gegen Amateure (`amateurAngriff`), Stil und Taktik wirken weniger. Fouls und Verletzungen gibt es nur auf deiner Seite. | 📌 vorläufig, U19c |
| CC4 | **Eigene Ströme** `europa` (Teilnehmer), `eulos` (Auslosungen je Wettbewerb und Runde), `eukurz` (Kurzrechnung je Termin). Die Engine-Spiele haben ihren Strom je Spiel wie bisher. Im Grundstrom würfelt nichts Neues. | ✅ |
| CC5 | **72 Stunden:** `pokalVerlegen` heißt jetzt `ligaVerlegen` mit Grund im Text. Neu verlegt es auch ein Ligaspiel am selben Tag (vorher nur davor oder danach). Das kann beim Pokal einen alten, nie bemerkten Doppeltermin eines Drittligisten auflösen. | ✅ entworfen |
| CC6 | **Sperren je Wettbewerb:** `eu` neben `liga` und `pokal`, beim ersten Zugriff angelegt. Gelbsperre nach der 3., 5., 7. und 9. Gelben. `tests/pruefungen.js` prüft `eu`, wenn es da ist. | ✅ entworfen |
| CC7 | **Finale nach dem Saisonende:** 2027 liegen das Finale der Champions League (5.6.) und der Conference League (2.6.) nach dem letzten Spieltag. Beide rücken auf den 1.6. | 📌 vorläufig |
| CC8 | **Ausland gegen Ausland** ist eine Kurzrechnung ohne Minuten (etwa 450 von 530 Spielen je Saison). Diese Spiele erscheinen nur in Tabelle und Baum, nicht in der Statistik. | 📌 vorläufig |
| CC9 | **Noch kein Geld außer Zuschauern** bei deinen Heimspielen, keine Prämien für Computer-Vereine, kein Ansehen, keine Statistik der Europapokaltore (`p.g` zählt sie nicht). Kommt mit U19b. | 📌 U19b |
| CC10 | **`tests/europapokal.js`:** sieben Prüfungen, siehe Test-README. Nie gelaufen. | ⚠️ offen |

---

## CD. Nachtrag zu U19b Europapokal: Prämien, Wertsäule, Ansehen (21. November 2026, popolupo, ohne Testlauf)

Gleicher Zweig wie CC. Konzept: K37 §5.3, §5.4, §12 Nr. 14 und 15.

| # | Befund | Status |
|---|---|---|
| CD1 | **Geld für die Großen:** Ein deutscher Verein in der Champions League bekommt mit Faktor 0,2 etwa 3,7 Mio. Startgeld, 2 bis 9 Mio. Wertsäule und 0,4 Mio. je Sieg, mit Achtelfinale und Viertelfinale zusammen grob 15 bis 20 Mio. Spielgeld. Das ist mehr als die TV-Gelder der Saison im Spiel (Bayern etwa 12 Mio.). So ist es gewollt (K02 §5.3a), aber es verschiebt die Konten der Computer-Vereine und damit K23b. | ⚠️ messen |
| CD2 | **Faktor 0,2 ist uneinheitlich mit dem Pokal:** Die Pokalprämien im Spiel (0,2 bis 4,5 Mio.) sind schon echte Beträge, TV-Gelder und Gehälter etwa ein Fünftel. Der Europapokal folgt TV und Gehältern. K23c bringt alles auf eine Größenordnung. | 📌 K23c |
| CD3 | **Rang- und Play-off-Prämie** nur in der Champions League, in Europa League und Conference League nicht recherchiert und darum 0. **Nachtrag 21.11.:** Europa League recherchiert (75.000 je Anteil, Platz 1–8 600.000, 9–16 300.000) und eingebaut. Conference League aus Salary Sport geschätzt (28.000 € je Anteil, Platz 1–8 400.000, 9–16 200.000), nicht amtlich. | 📌 amtliche Werte offen |
| CD4 | **Ansehen** steigt zum Saisonwechsel um höchstens 4 (Champions-League-Sieg), zusammen mit dem Ansehen aus der Liga ohne eigene Obergrenze. Die Fans folgen über `Z.fans.faktor`. | ✅ entworfen |
| CD5 | **Zuschauer:** Der Gegner zählt mit seinem Ansehen wie ein Bundesligist, das Spiel gilt als Pokalspiel (`cup`). | ✅ |
| CD6 | **Nicht gebaut:** Ziele des Vorstands mit Europapokal (K28), Interesse der Spieler (K19), Europapokal in der Saisonstatistik (K34). | 📌 später |
| CD7 | **`tests/europapokal.js`** hat jetzt acht Prüfungen (dazu Geld und Ansehen). Nie gelaufen. | ⚠️ offen |

---

## CE. Nachtrag zu U19c Europapokal: Länderwertung, Interesse, Nebenziel (21. November 2026, popolupo, ohne Testlauf)

Gleicher Zweig wie CC. Konzept: K37 §12 Nr. 16 bis 18.

| # | Befund | Status |
|---|---|---|
| CE1 | **Länderwertung ohne die übrigen Länder:** Nur die 18 Länder des Pools und Deutschland. Länder mit vielen Vereinen in Europa League und Conference League verlieren im Schnitt, weil dort weniger gewonnen wird als bei den Großen. Ob Deutschland zu oft oder zu selten den fünften Platz holt, zeigt erst ein Lauf über viele Saisons (echt: Für 2024/25 bekam Deutschland den Platz, für 2026/27 nach einer Überschrift bei ran vom Frühjahr 2026 nicht, Websuche 21.11.). | ⚠️ messen |
| CE2 | **Wechselinteresse** steigt für deinen Verein im Europapokal um bis zu 6. Das ändert Ergebnisse in `tests/vertraege.js` und `tests/transfers.js`, wenn dein Testverein international spielt (Freiburg in der Qualifikation der Conference League). | ⚠️ messen |
| CE3 | **Nebenziel „Europapokal“** kommt in den Topf der möglichen Nebenziele, wenn dein Verein schon in der Ligaphase steht. Die Auslosung der Nebenziele im Strom `nebenziele` ändert sich dann, sonst nicht. | ✅ |
| CE4 | **`tests/europapokal.js`** hat jetzt neun Prüfungen. Nie gelaufen. | ⚠️ offen |

---

## CF. Vereinswechsel räumt auf: Bau, Finanzplan, Marketing (21. November 2026, popolupo, ohne Testlauf)

Bei einer Nachkontrolle von K23e, K25a und K26a gefunden. Diese Zustände hängen am Spieler, nicht am Verein, und gingen bisher beim Vereinswechsel mit.

| # | Befund | Status |
|---|---|---|
| CF1 | **Tribüne (K26a):** `takeJob` löschte `S.constr`. Lief gerade ein Tribünenbau, fehlten dem alten Verein danach für immer 3.000 Plätze. Jetzt baut der alte Verein fertig (`bauAbgeben`), die Wirkung kommt sofort, Auflagen und Mehrkosten fallen weg. | ✅ behoben |
| CF2 | **Kredit und Raten (K23e):** `takeJob` setzte nur `S.loan` auf 0, die Tranchen in `S.kredite` und die Ablöse-Raten in `S.raten` blieben. Der neue Verein hätte sie monatlich abbezahlt. Jetzt setzt `finanzenJobwechsel` Tranchen, Raten, Verzicht, Monatsberichte, Lizenzprüfung (auch eine Transfersperre), Schnitt und Mäzen zurück. Die Schulden des alten Vereins verschwinden wie bisher. | ✅ behoben |
| CF3 | **Marketing (K25a):** Werbewert, Trikot und Kampagnen gingen zum neuen Verein mit. Jetzt beginnt dort alles neu (`marketingJobwechsel`). | ✅ behoben |
| CF4 | **Simulator:** `tests/sim.js` ahmt `takeJob` nach und ruft jetzt dieselben drei Funktionen auf, wenn es sie gibt. | ✅ |
| CF5 | **Tests:** `tests/stadion.js` Nr. 7 (Tribüne beim Wechsel), `tests/finanzen.js` Nr. 10 (nichts geht mit, der neue Verein zahlt nichts). Nie gelaufen. | ⚠️ offen |

---

## CG. Nachtrag zu K25b: Karte „Trikot ausverkauft“ (21. November 2026, popolupo, ohne Testlauf)

Konzept: K25 §8. Gleicher Zweig wie CC.

| # | Befund | Status |
|---|---|---|
| CG1 | **Mehr Würfe im Strom `ereignisse`:** Eine Karte mehr im Katalog, darum fallen die späteren Karten anders als vorher (wie BX1). | ✅ erwartet |
| CG2 | **Gleichschritt:** Der Auslöser schaut nur auf Alter und Ligatore, nicht auf Lizenz oder Automatik. | ✅ |
| CG3 | **Europapokaltore** (`eg`, U19b) wurden zum Saisonwechsel nicht zurückgesetzt. Jetzt wie `g` und `pg`. | ✅ behoben |
| CG4 | **Tests:** `tests/marketing.js` Nr. 7, `tests/karten.js` prüft den Katalog. Nie gelaufen. | ⚠️ offen |

---

## CH. Prüfung des Europapokals ohne Laufzeit (21. November 2026, popolupo)

Ein zweiter Durchgang hat `js/europa.js` und alle Anschlüsse nur gelesen (eigener Prüf-Agent, ohne meine Annahmen). Funde und was daraus wurde:

| # | Befund | Status |
|---|---|---|
| CH1 | **Tage nur mit Spielen Ausland gegen Ausland gingen verloren:** `tagesSpieleAbschliessenLauf` brach ohne Engine-Spiele früh ab, die Kurzrechnung wurde nie eingetragen. Folge: Ligaphase unvollständig, keine Play-offs, kein Sieger (zum Beispiel Conference League ohne deutschen Verein, Spieltag 6 am 17.12.). Jetzt werden diese Gruppen vor dem Abbruch eingetragen. Dazu ein Sicherheitsnetz `euNachholen`: Jeden Morgen holt es Spiele vor dem Tag nach, die noch offen sind (Kurzrechnung, deutsche Vereine mit ihrer Kaderstärke). | ✅ behoben |
| CH2 | **Kein Gegner aus dem eigenen Land hielt in der Champions League fast nie:** Die Auslosung zog ganze Baupläne neu und prüfte erst danach. Bei rund 35 Paaren aus demselben Land war eine gültige Auslosung sehr unwahrscheinlich, übrig blieb die letzte ungültige (etwa Bayern gegen Dortmund). Jetzt tauscht sie Vereine innerhalb der Töpfe (lokale Suche), bis die Konflikte weg sind. | ✅ behoben |
| CH3 | **`tests/europapokal.js` Nr. 1** hätte immer versagt (zwei `null` aus der Qualifikation zählten als Doppelte). | ✅ behoben |
| CH4 | **Amateurverein als Pokalsieger** (Kennung ab 1000) hätte `euDeutsche` abstürzen lassen. Jetzt geht sein Platz an die Liga. **Schon vorher da:** `supercupAnlegen` in `js/wettbewerbe.js` greift für den Pokalsieger ebenfalls auf `S.teams[id]` zu und würde dort zuerst abbrechen. Nicht von mir geändert. | ✅ behoben / ⚠️ alt, für dich |
| CH5 | **Rückspiel erst nach dem Hinspiel als dein Spiel sichtbar:** Für Planung, nächstes Spiel und englische Wochen fehlte es. Jetzt ist es vorher sichtbar, gespielt wird es erst nach dem Hinspiel. | ✅ behoben |
| CH6 | **Nach dem Aus in der Qualifikation** zeigte die Karte noch „Dein Verein spielt in der Conference League“. Jetzt zählt die Qualifikation nur, solange sie offen ist. | ✅ behoben |
| CH7 | **Europapokaltore** wurden nicht zurückgesetzt. Schon mit CG3 behoben. | ✅ |
| CH8 | **`tests/europapokal.js` Nr. 6** brach bei fehlender Runde mit einem Fehler ab statt sauber zu scheitern. | ✅ behoben |
| CH9 | **Ohne Befund geprüft:** Datenformen von Hin- und Rückspiel in allen Lese- und Schreibstellen, Bauplan der Ligaphase (je Spieltag ein Spiel, Heimspiele, Gegner je Topf), Turnierbaum und Termine, Terminindex, alle Spielpfade mit Auslandsvereinen, Zufall nur über Ströme, `F.` gegen `ev(...)` in den Tests. | ✅ |
| CH11 | **Zweite Prüfung, Finanzplan, Marketing, Stadion:** siehe CI. | ✅ |
| CH10 | **Laufzeit der Auslosung:** im schlechtesten Fall 30 Baupläne mit je 3.000 Tauschversuchen, grob eine bis zwei Sekunden. Meist reicht der erste Bauplan. Bitte beim Testlauf auf die Dauer achten. | ⚠️ messen |

---

## CI. Prüfung von K23a, K23e, K25a, K26a ohne Laufzeit (21. November 2026, popolupo)

Wieder ein eigener Prüf-Agent, nur lesend. Keine Laufzeitfehler gefunden, aber diese Fehler:

| # | Befund | Status |
|---|---|---|
| CI1 | **Der 1. Juli läuft nie durch `taeglich`** (`weiter` bricht nach `newSeason` ab). Folgen im Finanzplan: Der Bericht am 1. August hieß „Juni“, enthielt aber den Juli. Der Juni wurde nie berichtet, Tilgung und Raten liefen nur elfmal im Jahr. Jetzt schließt `newSeasonLauf` den Juni mit `finanzenMonat(…, true)`, und `finanzenSaisonstart` bucht Tilgung, Raten und Instandhaltung des 1. Juli in die neue Saison. **Allgemein für dich:** Auch andere Tagesaufgaben laufen am 1. Juli nicht. Bisher ist mir dort nichts aufgefallen. | ✅ behoben / ⚠️ Hinweis |
| CI2 | **Saldo je Spiel nach einem Vereinswechsel mitten in der Saison:** `S.fin` beginnt beim Wechsel neu, gezählt wurden aber alle Ligaspiele des neuen Vereins. Jetzt zählen nur die Spiele seit dem Wechsel (`S.finSp0`, `finanzenStart`). | ✅ behoben |
| CI3 | **Transfersperre umgehbar:** Nach dem verfehlten Nachweis am 31. Mai ging im Juni noch ein Kauf, vollzogen zum Saisonwechsel. Die Automatik füllte den Kader beim Saisonwechsel ebenfalls auf. Jetzt sperrt `offer` ab dem Urteil (`transferSperreNaechste`), und die Automatik füllt deinen Kader dann nicht auf. Wechsel, die vor dem Urteil vereinbart wurden, bleiben gültig (vorläufig, sonst müsste Geld zurück). | ✅ behoben |
| CI4 | **Schuldenschnitt als Einnahme:** Er stand in `S.fin` und machte das Nebenziel „Finanzen“ durch eine Insolvenz erfüllbar. Jetzt zählt er dort nicht mit. | ✅ behoben |
| CI5 | **Erster Monatsbericht kam einen Monat zu spät** (neues Spiel, Vereinswechsel). Ohne Stand gilt jetzt `S.fin` seit dem Anfang als Grundlage. | ✅ behoben |
| CI6 | **Rate 0 bei sehr kleinen Krediten:** Die Tranche wäre nie kleiner geworden. Rate jetzt mindestens 1 €, aufgerundet. | ✅ behoben |
| CI7 | **Alter Spielstand, Bau im alten Format** mit Fertigtag nach dem Saisonende wird nie fertig. War schon vorher so. Nicht geändert. | 📌 alt |
| CI8 | **Ohne Befund geprüft:** Kredite (Summe der Tranchen gleich `S.loan` auf allen Wegen), Monatsbericht innerhalb der Saison, Termine der Lizenzprüfung, Bauprozess mit Tribüne, alle `S.teams`-Zugriffe der Anlagen, Zufall nur über Ströme, Erwartungswerte in den Tests. | ✅ |

---

## CJ. Korrekturen zu Lauf 5 (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-t5-korrekturen` (auf 0fae7b8). Funde aus `tests/testprotokoll.md`, Lauf 5.

| # | Befund | Status |
|---|---|---|
| CJ1 | **T5.2, 72 Stunden:** Jede Verlegung schaute nur auf den Anlass (Pokal oder Europapokal). Eine spätere Pokalverlegung konnte ein schon verlegtes Spiel neben den Europapokal zurückschieben. `ligaVerlegen` prüft jetzt alle Termine beider Vereine (`spieltageVon`). Passt kein Kandidat (drei Tage in Richtung des alten Termins, zwei in die andere), gilt die alte Regel. | ✅ behoben |
| CJ2 | **T5.3, Stärke der Auslandsvereine:** Teamwerte einer Elf liegen in der Engine bei etwa 0,93 × Stärke (Zustand mit Frische um 90, Anteile je Position etwa 0,97, 20 % Gewicht auf dem Schwächsten). Der Block der Auslandsvereine hatte die volle Stärke. Faktor jetzt 0,93. Ob das „meist Achtelfinale“ ergibt, zeigt erst die nächste Messung. | ⚠️ messen |
| CJ3 | **T5.1, T5.4:** nur Tests angepasst (Karten aus dem Gleichschritt, Sperre `eu` im Browser-Test). | ✅ |
| CJ4 | **T5.5, CB7:** `startBuild` prüft die Lizenz selbst, `startBuildAlt` ist weg. | ✅ |
| CJ5 | **CH4:** `supercupAnlegen` nimmt bei einem Amateur-Pokalsieger den Vizemeister. | ✅ behoben |

---

## CK. Nachtrag zu K23b: Computer-Vereine nach denselben Regeln (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k23b-computer-finanzen` (auf den Korrekturen zu Lauf 5). Konzept: K23 §5.5e, §12 Nr. 15 bis 18. Grundlage: Messung BZ7.

| # | Befund | Status |
|---|---|---|
| CK1 | **Die Welt verschiebt sich:** Erstligisten haben im Schnitt etwa doppelt so viel Geld wie mit der Pauschale (+10 statt +5 Mio. je Saison), Vereine mit großem Stadion noch mehr (Dortmund, Schalke, HSV +20 bis +30 Mio.), Leverkusen mit kleinem Stadion und hohen Gehältern ein Minus. Mehr Geld heißt mehr Käufe (Budget 70 % des Kontos). Das kann T1.3 Rest und die Dominanz der Großen (K02 §5.3a) in beide Richtungen verschieben. | ⚠️ messen |
| CK2 | **Sonstige Einnahmen auch für dich:** In der 2. Liga 0,85 Mio., in der 3. Liga 2,3 Mio. mehr je Saison. Das macht deinen Start in den unteren Ligen leichter als bisher. | 📌 vorläufig bis K23c |
| CK3 | **Kein neuer Zufall:** Zuschauer der Computer-Vereine aus dem Erwartungswert, keine Würfe im Strom `spieltagEnde`. | ✅ |
| CK4 | **Insolvenzen der Computer-Vereine** sind selten (Kreditrahmen in der 3. Liga rund 12 Mio.). Erst eine lange Verlustreihe führt dorthin. Bitte über viele Saisons zählen. | ⚠️ messen |
| CK5 | **Pokal:** Die Pauschale ging an alle Vereine, auch ohne Spiel. Jetzt bekommen nur Teilnehmer Geld, dafür mehr (Rundenprämien 0,2 bis 4,5 Mio.). | ✅ |
| CK6 | **`tests/finanzen.js` Nr. 11 und 12:** Buchung je Spiel, Insolvenz. Nie gelaufen. | ⚠️ offen |

---

## CL. Nachtrag zu K23d: Budgets vom Vorstand (22. November 2026, popolupo, ohne Testlauf)

Gleicher Zweig wie CK. Konzept: K23 §5.5f, §12 Nr. 19 und 20.

| # | Befund | Status |
|---|---|---|
| CL1 | **Kaufstopp über 110 % des Rahmens** trifft Vereine mit hohen Gehältern und kleinem Stadion. Nach BZ7 wäre Leverkusen ein Kandidat. Wer als dein Verein dort startet, muss vielleicht erst verkaufen. | ⚠️ beobachten |
| CL2 | **Gleichschritt:** Die Regel gilt für deinen Verein in der Automatik genauso wie für Computer-Vereine, ohne Zwischenspeicher, aus dem aktuellen Zustand. Beide Läufe entscheiden gleich. | ✅ entworfen |
| CL3 | **Stabilisiert K23b:** Ein Computer-Verein mit zu hohen Gehältern kauft nicht mehr nach. Verkäufe und auslaufende Verträge senken die Gehälter mit der Zeit. Schneller geht es erst mit Notverkäufen, die gibt es noch nicht. | 📌 später |
| CL4 | **Anteil 85 % vorläufig:** Er passt zu den heutigen Größenordnungen (Gehälter bei 70 bis 85 % der Einnahmen). Mit K23c auf echte Werte senken. | 📌 K23c |
| CL5 | **`tests/finanzen.js` Nr. 13.** Nie gelaufen. | ⚠️ offen |

---

## CM. Nachtrag zu U19d1: Kaderliste der UEFA (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-u19d-kaderliste` (auf K23d). Konzept: K37 §5.6, §12 Nr. 19.

| # | Befund | Status |
|---|---|---|
| CM1 | **Lokal ausgebildet als Näherung:** Die Laufbahn vor dem Spielstart fehlt. Vereinsausgebildet ist nur, wer aus der eigenen Jugend kommt (`p.ej`), verbandsausgebildet sind die übrigen Deutschen. Echte Eigengewächse der Startkader zählen deshalb nur als verbandsausgebildet. Die Höchstzahl sinkt bei wenigen lokal Ausgebildeten, wie im Reglement. | 📌 vorläufig |
| CM2 | **Liste B** nur für Spieler bis 21 aus der eigenen Jugend oder seit zwei Jahren im Verein (`p.seit`). Echte junge Spieler der Startkader haben kein `p.seit` und brauchen zuerst eine Meldung auf Liste A. | 📌 vorläufig |
| CM3 | **Gleichschritt:** Zur Frist meldet der Verein ohne gültige Liste automatisch, mit Automatik immer. Beide Läufe melden am selben Tag dieselbe Liste. | ✅ entworfen |
| CM4 | **Neuzugänge nach der Frist** dürfen erst nach der Nachmeldung im Europapokal spielen, wie in echt. | ✅ |
| CM5 | **`tests/europapokal.js` Nr. 10.** Nie gelaufen. | ⚠️ offen |
| CM6 | **Startkader:** Ohne Laufbahn hätte kein Verein in den ersten Jahren mehr als 21 Spieler auf Liste A gehabt (höchstens 4 lokal Ausgebildete). Jetzt gelten Deutsche der Startkader ohne Wechsel, die zum Spielstart höchstens 21 waren, als vereinsausgebildet. | 📌 vorläufig |

---

## CN. Prüfung der Änderungen vom 22.11. ohne Laufzeit (popolupo)

Dritter Prüf-Agent, nur lesend, über T5-Korrekturen, K23b, K23d und U19d1. Keine Laufzeitfehler, diese Funde:

| # | Befund | Status |
|---|---|---|
| CN1 | **Nachmeldung ohne Liste:** Ein Verein ohne Liste (alter Spielstand) hätte zur Nachmeldung nur drei Spieler behalten, alle übrigen wären gesperrt gewesen. Jetzt bekommt er die volle automatische Meldung. | ✅ behoben |
| CN2 | **Gehaltsrahmen nicht gleich für alle:** Computer-Vereine wurden vor dem Kauf ohne das neue Gehalt geprüft, und ihre Leihen waren ebenfalls gesperrt. Bei dir war die Karte „verpflichten“ ungeprüft. Jetzt gilt überall `rahmenErlaubt(Verein, neues Gehalt)` beim Kauf (Angebot, Karte, `kiMarkt` mit dem Gehalt des Kandidaten). Leihen sind für alle frei. | ✅ behoben |
| CN3 | **Gleichschritt-Risiko:** Der Rahmen hing an der Fanstimmung, die sich durch die Trikotvorstellung nur bei deinem Verein ändert. Jetzt rechnet er mit neutraler Fanstimmung und Form. | ✅ behoben |
| CN4 | **Verlegung auf Montag:** Montag abends vor einem Donnerstag wären keine 72 Stunden. Montage sind jetzt keine Kandidaten mehr. | ✅ behoben |
| CN5 | **Leeres rotes Etikett im Kader** für nicht gemeldete Spieler vor einem Europapokalspiel. `sperrText` nennt jetzt „nicht gemeldet (Europapokal)“ und Europapokal-Sperren. | ✅ behoben |
| CN6 | **Text nach der Nachmeldung** sprach von einer Nachmeldung in der Vergangenheit. Neue Phase „ko“ mit eigenem Text. | ✅ behoben |
| CN7 | **Torhüterregel:** Mit nur einem Torhüter außerhalb von Liste B konnte keine Liste gültig werden. Jetzt kommen Torhüter von Liste B auf Liste A, und die Regel verlangt nur so viele Torhüter, wie der Kader hat. | ✅ behoben |
| CN8 | **Startkader und Liste A** (CM6). | ✅ behoben (Näherung) |
| CN9 | **`tests/finanzmodell.js`** rechnete die Zeile „nach dem Modell“ anders als das Spiel. Jetzt mit `kiHeimEinnahmen` und `sonstigeEinnahmen`. | ✅ behoben |
| CN10 | **Anzeige der Gegnerstärke** zeigte den Block mit 0,93 neben deiner ungeteilten Kaderstärke. Jetzt beide auf derselben Skala. | ✅ behoben |

---

## CO. Korrekturen zu Lauf 8 (22. November 2026, popolupo, ohne Testlauf)

| # | Befund | Status |
|---|---|---|
| CO1 | **T8.2, Donnerstag → Samstag:** In einer Pokalwoche (Europapokal am Donnerstag, Pokal am Dienstag) passt kein Ligaspiel mit drei Tagen Abstand zu beiden. Wie beim DFB spielen solche Vereine den Pokal jetzt einen Tag später, ihre Gegner mit ihnen. In Runde 1 (Samstag) heißt das Sonntag, nach der Qualifikation zur Conference League am Donnerstag. `S.cup.spaet[Runde]` hält die Vereine fest. Die Runde wird erst nach dem zweiten Tag in `S.cup.hist` eingetragen, bis dahin liegt der erste Tag in `S.cup.teil`. | ✅ behoben |
| CO2 | **Eingriff in den Pokal (K13):** `termineAm`, `meinSpiel`, `spielendeAm`, `kalTermin` und das Eintragen der Runde kennen jetzt zwei Tage. Das Finale und alte Spielstände ohne `S.cup.spaet` spielen wie bisher an einem Tag. | ⚠️ bitte im Browser-Test ansehen |
| CO3 | **T8.1, T8.3:** nur Tests. `tests/finanzen.js` ohne Entlassung, `tests/training.js` Nr. 4 ohne Europapokal (die englischen Wochen eines Europapokal-Vereins verschieben Kondition und Ausfälle). | ✅ |

---

## CP. Nachtrag zu K23c: echte Größenordnungen (22. November 2026, popolupo, ohne Testlauf)

Ausführlich in K23 §5.6b. Gebaut ohne die Messung aus K23 §5.6a, mit einer eigenen Modellrechnung der Welt (Perl, außerhalb des Repos).

| # | Befund | Status |
|---|---|---|
| CP1 | **Alle Geldwerte auf einmal:** Gehälter, Marktwerte, TV (Säulenmodell), Werbung, Sonstiges, neuer Posten Verwaltung, Startkonto, Kreditrahmen, Gehaltsrahmen, Finanzlage beim Vereinswert, Budgets der Auslandsvereine, Europapokal (Faktor 1), Tribüne. Nach der Modellrechnung stehen die Ligen im Schnitt wie vorher (1. Liga etwa +11 Mio., 2. Liga 0, 3. Liga −1 Mio. je Verein und Saison), nur in echter Größe. | ⚠️ bitte mit `tests/finanzmodell.js` (zwei Saisons) nachmessen |
| CP2 | **Gleichschritt (K36, `tests/lizenz.js` 5a):** Die TV-Gelder hängen vom Ansehen ab. Damit beide Läufe gleich rechnen, werden sie zu Saisonbeginn festgelegt (`tvSaison` in `newSeason` und `buildWorld`), nicht beim ersten Gebrauch. Neu berechnet wird nur, wenn sich eine Liga geändert hat. | ✅ so gebaut |
| CP3 | **Wer kauft noch?** Der Gehaltsrahmen (75 %) sperrt nach der Modellrechnung anfangs nur Leverkusen und die kleinsten Drittligisten. Leverkusen hat den zweitteuersten Kader, liegt ohne Champions League im Minus und muss erst Gehalt abbauen. | ⚠️ im Testlauf ansehen: Zahl der Käufe je Fenster gegen Lauf 5 |
| CP4 | **Wirkung auf Transfers:** Gute Spieler werden viel teurer (Stärke 85: 52 statt 22 Mio.), schwache viel billiger (Stärke 60: 0,35 statt 1,8 Mio.). Drittligisten haben im Verhältnis zu den Preisen mehr Geld als vorher, der Gehaltsrahmen bremst sie. Jugendverkäufe bringen weniger. | ⚠️ im Testlauf ansehen |
| CP5 | **Alte Spielstände:** Gehälter einmal auf die neue Kurve umgerechnet (`k23cUmstellen` beim Laden, Import und Live-Update, Merker `S.k23c`). Kontostände bleiben, die TV-Wertung startet aus Liga und Ansehen. | ✅ |
| CP6 | **Tests angepasst:** `tests/werbung.js` Nr. 1 (drei Flächen zusammen 63 % des Grundbetrags), `tests/finanzen.js` Nr. 11 (mit Verwaltung) und neu Nr. 14 bis 18, `tests/transfers.js` (reich ab `finanzlage.reichAb`), `tests/europapokal.js` Nr. 6 (Startgeld mit dem Faktor aus den Regeln), `tests/finanzmodell.js` (Werbung und Verwaltung wie im Spiel). | ✅ ungetestet |
| CP7 | **Noch nicht umgestellt:** feste Beträge der Karten, Kampagnen (K25), Fanartikel, Logen, Stab, übrige Bauten. Fanartikel der Computer-Vereine fehlen ganz. | offen, nach dem Testlauf |

---

## CQ. Nachtrag zu U12e: Zielgespräch (22. November 2026, popolupo, ohne Testlauf)

Ausführlich in K28 §5.8. Zweig `mitarbeit/popolupo-u12e-zielgespraech`, auf K23c.

| # | Befund | Status |
|---|---|---|
| CQ1 | **Zeitpunkt:** `zielgespraechStart` hängt am Ende von `setTarget` (Saisonstart, Jobwechsel, neues Spiel). Offen, solange die Zahl deiner gespielten Ligaspiele gleich der beim Setzen ist. Ein Jobwechsel mitten in der Saison öffnet ein neues Gespräch beim neuen Verein. | ✅ |
| CQ2 | **Gleichschritt (K36):** Gewürfelt wird nur beim Tiefstapeln (Strom `zielgespraech`), also nur nach deinem Klick. Ohne Eingriff bleibt alles wie vorher, auch das Transferbudget (Faktor 1). | ✅ |
| CQ3 | **Transferbudget weich:** `zgUeberBudget` steht in `offer` direkt vor der Zahlung der Ablöse. Käufe über die Automatik (Computer-Regeln) laufen nicht durch `offer` und kosten nichts. Vorher konnte man das ganze Konto ausgeben, das geht weiter, nur mit Vertrauen. | ⚠️ im Spiel ansehen, ob die Meldung zu oft kommt (das Budget ist das Konto über 10 % der erwarteten Einnahmen) |
| CQ4 | **Ruf:** `rufSaison` rechnet „übertroffen“ nach dem Tiefstapeln vom Vorschlag aus, „deutlich verfehlt“ weiter vom verhandelten Ziel. Ein hochgepokertes, erreichtes Ziel bringt den Zuschlag dazu. Alte Spielstände ohne `S.zg`: alles wie bisher. | ✅ |
| CQ5 | **Vorbereitungsliste (K12b):** Der Punkt „Saisonziel“ heißt jetzt „Saisonziel und Zielgespräch“. Er bleibt ohne Entscheidung „Standard“ (nicht „offen“), damit die Erinnerung vor „Tag beenden“ nicht öfter kommt als bisher. | ✅ |

---

## CR. Nachtrag zum Karriereende nach K32 §5.1 (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k32-karriereende`, auf U12e. Ausführlich in K32 §5.1 (Umsetzung) und §12 Nr. 27.

| # | Befund | Status |
|---|---|---|
| CR1 | **Formel statt Pauschale:** Grundwert nach Alter (32: 10 %, 34: 25 %, 36: 50 %, 38: 90 %, linear dazwischen, ab 39 sicher), Torhüter zwei Jahre später, ×1,5 zu schwach für die Liga, ×0,7 Stammspieler, ×1,5 Kreuzbandriss in zwölf Monaten, ×0,8 Vorbildprofi. | ✅ |
| CR2 | **Zufall:** vorher im Strom des Saisonwechsels, jetzt eigener Strom je Spieler und Saison. Dadurch verschiebt sich der übrige Zufall des Saisonwechsels einmal gegenüber früheren Läufen (andere Anzahl Würfe). Vergleiche mit alten Läufen gleichen Seeds stimmen ab dem ersten Saisonwechsel nicht mehr. | ⚠️ bekannt |
| CR3 | **Gleichgewicht (K32 §5.3, K03 §10):** Mit 32 und 33 hören jetzt einige auf, mit 35 bis 37 weniger als vorher. Die Ligen könnten über zehn Saisons etwas jünger und anfangs etwas schwächer werden. | ⚠️ `tests/welt.js` über zehn Saisons ansehen |
| CR4 | **Auslandspool:** gleiche Chance ohne Niveau, im Strom des Pools. Der Pool verliert ab 32 etwas mehr Spieler, seine eigenen Regeln bleiben. | ⚠️ Größe des Pools über zehn Saisons (K32 §10: ±15 %) |

---

## CS. Prüfung von K23c ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat den Commit cfe0f41 gelesen (nichts ausgeführt). Die Korrekturen liegen auf dem Zweig `mitarbeit/popolupo-k32-karriereende` (der neuesten Spitze), nicht auf dem K23c-Zweig.

| # | Befund | Status |
|---|---|---|
| CS1 | **`tests/schwierigkeit.js` Nr. 1** rechnete den Kreditrahmen noch mit der alten Formel (`jeAnsehen` fehlt seit K23c, Soll NaN). Jetzt mit der Formel aus den Regeln. | ✅ behoben |
| CS2 | **Werbung ungerundet:** `sponsorBasis` gab Kommazahlen zurück, dadurch wurden die Kontostände der Computer-Vereine krumm und `tests/finanzen.js` Nr. 11 wäre fast immer an der letzten Binärstelle gescheitert. `sponsorBasis` rundet jetzt auf ganze Euro. | ✅ behoben |
| CS3 | **Fünfjahreswertung in der Regionalliga:** Vereine in der Regionalliga bekamen keine Saison eingetragen, ihre alten Saisons rückten nicht nach. Jetzt zählt eine Saison dort mit 0 Punkten. | ✅ behoben |
| CS4 | **Alte Spielstände:** Vorgemerkte Wechsel (`p.wech.sal`) und deine Werbeverträge blieben auf der alten Größe, während Gehälter und Verwaltung neu rechnen (grob −8 Mio. € je Saison für einen Erstligisten). Jetzt rechnet `k23cUmstellen` beides mit um (Verträge: mal neuer durch alten Grundbetrag der Fläche, alte Werte in `RF.sponsorAlt`). `tests/finanzen.js` Nr. 17 prüft es mit. | ✅ behoben |
| CS5 | **Nicht geprüft werden konnte:** `tests/transfers.js` Nr. 4, 5 und 9 erkennen „kein Interesse“ am Text. Eine Absage wegen des Gehaltsrahmens würde dort als Erfolg zählen. Nach Schätzung bleibt genug Spielraum. | ⚠️ im Lauf ansehen |
| CS6 | Ohne Befund: Laufzeitfehler, alte Schlüssel im übrigen Code, Gleichschritt (TV hängt nur an Ansehen, Liga und Wertung, alle vor `tvSaison` gesetzt), Rangfolge der Wertung, Kommentare mitten in der Zeile, die neuen Tests 14 bis 16 und 18 (18 nur grob). | ✅ |

---

## CT. Nachtrag zu K26b: Computer-Vereine bauen (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k26b-computer-bauen`, auf dem Karriereende. Ausführlich in K26 §5.2.

| # | Befund | Status |
|---|---|---|
| CT1 | **Zeitpunkt:** `kiBauenSaison` läuft in `newSeason` nach `tvSaison` und `finanzenSaisonstart`, also mit den Ligen und TV-Geldern der neuen Saison. Ohne Zufall. | ✅ |
| CT2 | **Nachfrage:** `zuschauerErwartung` hat einen neuen fünften Parameter `frei` (ohne Deckel durch die Plätze). Alle bisherigen Aufrufe bleiben gleich. | ✅ |
| CT3 | **Geld:** Tribüne 12 Mio. € (K23c), Anlagen nach `anlageKosten`. Gebaut wird nur mit der Reserve aus K23d, Anlagen mit dreifacher Reserve. Das Transferbudget der Computer-Vereine (Anteil des Kontos zum Fensterbeginn, K31) sinkt dadurch im Sommer nach einem Bau. | ⚠️ im Testlauf ansehen: Bauten je Saison, Kontostände, Käufe im Sommer |
| CT4 | **K36 „Kein Nachteil“:** Nur der Computer-Lauf baut. Ab der zweiten Saison kann er dadurch etwas besser dastehen (Trainingsgelände). Bisher war die Grenze 2 Punkte im Schnitt. | ⚠️ `tests/lizenz.js` Nr. 5 ansehen |
| CT5 | **Instandhaltung** zahlen Computer-Vereine noch nicht, ihre Bausumme wird aber gezählt. | offen |

---

## CU. Nachtrag zu K23f: Kartenbeträge nach Liga (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k23f-karten-nach-liga`, auf K26b. Erledigt CP7 zum Teil (Karten), K30 §3.2.

| # | Befund | Status |
|---|---|---|
| CU1 | **Beträge:** Die Werte in `daten/karten.js` gelten für die 3. Liga, mal 2 in der 2. und mal 4 in der 1. Liga, auf 1.000 € gerundet. Auch der schlechte Ausgang (Einspruch bei der Steuerprüfung). Ein Ausgang mit 0 € bucht nichts mehr (vorher eine Buchung über 0 €). | ✅ |
| CU2 | **Texte:** Platzhalter `{geld:Grundwert}`, ersetzt in `kartenText` (auch im Ausgang). Das Prüfskript in `tests/karten.js` erkennt ihn nicht als unbekannten Platzhalter, weil es nur `{wort}` sucht. | ✅ |
| CU3 | **Tests angepasst:** `tests/karten.js` (Teamausflug), `tests/finanzen.js` (Mäzen), `tests/spielwelt-karten.js` (Abschiedsspiel) rechnen mit `kartenGeld`. Der Testverein spielt in der 1. Liga, die Beträge sind dort viermal so hoch. | ✅ ungetestet |
| CU4 | **Noch offen aus CP7:** Kampagnen (haben schon einen Ligafaktor, K25a), Fanartikel und Logen, Fanartikel der Computer-Vereine. | offen |

---

## CV. Nachtrag zu K27b: Dauerkarten (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k27b-dauerkarten`, auf K23f. Ausführlich in K27 §5.2 (Umsetzung).

| # | Befund | Status |
|---|---|---|
| CV1 | **Einnahmen:** `heimspielEinnahmen` bucht in der Liga „Dauerkarten“ (alle Inhaber, Preis × (1 − Rabatt)) und „Zuschauer“ nur für die übrige Nachfrage. Die gezählten Zuschauer sind mindestens die Zahl der Dauerkarten. Bei vollem Stadion und 20 % Rabatt sinken die Spieltagseinnahmen gegenüber vorher um etwa 9 bis 12 %. | ⚠️ im Testlauf ansehen, ob die Prognose und das Nebenziel Finanzen damit kippen |
| CV2 | **Gleichschritt:** In der Automatik gilt der Standardrabatt, der Baustein der Fanstimmung bekommt +0. Der Würfel der Zuschauer bleibt (ein Wurf je Heimspiel wie vorher). Nur das Geld deines Vereins ändert sich, und das trennt die Läufe ohnehin. | ✅ |
| CV3 | **Computer-Vereine** haben keine Dauerkarten. Ihre Einnahmen sind ohnehin der Erwartungswert ohne Würfel (K23b). | bewusst |
| CV4 | **Alte Spielstände:** ohne `S.dk` verkauft der Verein beim nächsten Ligaheimspiel, auch mitten in der Saison. | ✅ |

---

## CW. Nachtrag zu K20b: Preise am Deadline Day (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k20b-deadline-preise`, auf K27b. Erledigt den offenen Punkt aus K20 §4.3.

| # | Befund | Status |
|---|---|---|
| CW1 | **Forderung:** `deadlinePreis` steckt in `forderungDu`, also nur in Forderungen deutscher Computer-Vereine an dich. Fest je Spieler und Tag (Strom `deadlinePreis`), darum zeigt jede Ansicht am selben Tag denselben Preis. Laufende Verhandlungen behalten ihre niedrigere Forderung (`Math.min` mit `v.f`). | ✅ |
| CW2 | **Angebote an dich:** Die Chance je Markttag für Spieler auf deiner Transferliste ist in den letzten drei Tagen 1,5-mal so hoch. Gleich viele Würfe wie vorher, nur die Schwelle ändert sich. | ✅ |
| CW3 | **Gleichschritt:** Die Regeln der Computer-Vereine (`kiPreis`, `kiZahlt`, `kiSternPreis`) und die Automatik rechnen ohne Schwankung. | ✅ |
| CW4 | **Noch nicht:** Computer-Vereine untereinander mit Schwankung, Bieterwettstreit beim Kauf (K20 §4.2). | offen |

---

## CX. Prüfung von U12e, Karriereende und K26b ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat a764c13, d7b48e2 und e3322cf gelesen (nichts ausgeführt). Korrekturen auf der neuesten Spitze `mitarbeit/popolupo-k20b-deadline-preise`.

| # | Befund | Status |
|---|---|---|
| CX1 | **`tests/karriereende.js` Nr. 5:** `sommerpause` setzt nur die Phase, die neue Saison beginnt erst mit `weiter`. Der Test maß deshalb vor dem Altern. Jetzt zwei Saisons im Simulator, gemessen zum Start der zweiten. | ✅ behoben |
| CX2 | **Ruf nach dem Hochpokern** war kleiner als nach dem Annehmen („übertroffen“ zählte vom höheren Ziel, −3 je Platz, der Zuschlag gab nur +2 zurück). Jetzt zählt „übertroffen“ nach jeder Verhandlung vom Vorschlag aus, der Zuschlag kommt dazu. `tests/vorstand.js` Nr. 13 prüft den neuen Wert. | ✅ behoben |
| CX3 | **Grenzen des Ziels:** In der 2. und 3. Liga ließ sich auf Platz 1 hochpokern, `setTarget` erlaubt dort höchstens Platz 2. Jetzt dieselbe Grenze. | ✅ behoben |
| CX4 | **Schritte an der Grenze:** Ein Schritt um zwei, der nur einen Platz verschiebt, zeigte doppeltes Budget und würfelte mit der Chance für zwei Plätze. Jetzt zählen die tatsächlich verschobenen Plätze, doppelte Knöpfe fallen weg. | ✅ behoben |
| CX5 | **Budget in der Automatik:** Mit Lizenz 1 führt der Verein die Transfers, sein Budget (`kiBudget`) kannte den Faktor aus dem Gespräch nicht. Jetzt schon. Ohne Verhandlung ist der Faktor 1, der Gleichschritt bleibt. | ✅ behoben |
| CX6 | **Kreuzband bei Vereinslosen:** Ein entlassener Spieler mit Kreuzbandriss behielt `p.vl` für immer und bekam jede Saison ×1,5. Jetzt zählt ein laufender Riss nur mit `p.inj > 0`. | ✅ behoben |
| CX7 | Ohne Befund: Laufzeitfehler, Regelpfade, alte Spielstände, Fenster des Gesprächs, Formel des Karriereendes, Bauen der Computer-Vereine (K26b), Zufall und Gleichschritt, Kommentare mitten in der Zeile. | ✅ |

---

## CY. Nachtrag zu K26c: Fanshop und Instandhaltung der Computer-Vereine (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k26c-fanshop-instandhaltung`, auf K20b mit den Korrekturen CX. Erledigt CT5 und einen Teil von CU4.

| # | Befund | Status |
|---|---|---|
| CY1 | **Fanshop:** `kiBauen` kennt neben den Anlagen den Eintrag `shop` (Stufe `t.shop`, Kosten `RB.fanshop.kosten`). Die Einnahmen daraus rechnet `kiHeimEinnahmen` schon seit K23b (Zuschauer × Fanartikel je Stufe). Ein Fanshop der Stufe 1 bringt einem Erstligisten etwa 1 Mio. € je Saison und kostet 1,5 Mio. €. | ✅ |
| CY2 | **Instandhaltung:** `kiFinanzenSpiel` zieht je Ligaspiel 1 % der Bausumme je Saison anteilig ab, wie bei dir monatlich. Gezählt werden nur Bauten ab K26b. | ✅ |
| CY3 | **Wirkung auf die Salden (K23 §5.6b):** Die Computer-Vereine gewinnen mit dem Fanshop etwas dazu, die Modellrechnung ohne Fanartikel unterschätzt das. Im Testlauf mit `tests/finanzmodell.js` ansehen. | ⚠️ |
| CY4 | **`tests/stadion.js` Nr. 9** prüft jetzt den Fanshop als erste Anlage, neu Nr. 10 die Instandhaltung. | ✅ ungetestet |

---

## CZ. Prüfung von K23f, K27b, K20b und K26c ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 5559cf4, 183ed6e, ba38849 und 32b75fc gelesen (nichts ausgeführt). Korrekturen auf der neuesten Spitze `mitarbeit/popolupo-k26c-fanshop-instandhaltung`.

| # | Befund | Status |
|---|---|---|
| CZ1 | **`tests/fans.js` (K27b):** Der Deckel von 90 % war mit Fanstimmung 100 und 30 % Rabatt nicht erreichbar (0,65). Jetzt prüft der Test ihn mit 100 % Rabatt (Rechnung 1,0, gedeckelt 0,9). | ✅ behoben |
| CZ2 | **Ausnutzbar:** Die Inhaber zahlten den Ticketpreis des Tages. Nach dem Verkauf den Preis auf 150 € setzen brachte für die Dauerkarten fast das Doppelte eines ausverkauften Stadions, ohne dass sie wegbleiben. Jetzt gilt der Preis vom Verkauf (`S.dk.p`), höchstens der heutige. Der Test setzt den Preis danach hoch und erwartet dieselbe Buchung. | ✅ behoben |
| CZ3 | **Rabatt nach dem Verkauf:** Wurde danach die Automatik eingeschaltet, rechnete die Fanstimmung mit dem Standardrabatt statt dem verkauften. Jetzt gilt nach dem Verkauf immer der verkaufte Rabatt. | ✅ behoben |
| CZ4 | **Anzeige:** Der Betrag je Heimspiel zählte während eines Tribünenbaus zu viele Plätze. Jetzt wie die Buchung höchstens die Plätze. | ✅ behoben |
| CZ5 | Ohne Befund: K23f (Rundung, alle Textwege mit Platzhalter, Tests), K20b (Grenzen, verschachtelter Strom, Gleichschritt, kein anderer Test an einem Deadline-Tag), K26c (Fanshop-Stufen und Kostenliste, Instandhaltung, Tests 9 und 10), Laufzeit, Kommentare mitten in der Zeile. | ✅ |

---

## DB. Nachtrag zu U12f: Zwischenbilanz im Winter (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-u12f-zwischenbilanz`, auf K20c. Ausführlich in K28 §5.9.

| # | Befund | Status |
|---|---|---|
| DB1 | **Zeitpunkt:** `zwischenbilanzWoche` läuft montags nach `vorstandWoche`, ab der Hälfte der eigenen Ligaspiele, einmal je Saison und Verein (`S.zb`). Ein Jobwechsel nach der Hälfte bringt beim neuen Verein sofort eine Bilanz. | ✅ |
| DB2 | **Zusammenspiel mit dem Zielgespräch (U12e):** Anheben verschiebt den Vorschlag mit (der Ruf rechnet vom neuen Ziel), ein zugesagter Antrag erhöht `stufe` wie Tiefstapeln (Budget −15 %, „übertroffen“ vom alten Vorschlag). Ohne Zielgespräch in der Saison (alter Spielstand) ändert sich nur das Ziel. | ✅ |
| DB3 | **Gleichschritt:** Die Bilanz liegt nach den 150 Tagen des Tests, würfelt nur beim Antrag und ändert nur Ziel und Vertrauen deines Vereins. | ✅ |
| DB4 | **Kommentar-Wächter:** Ein Kommentar mit `);` am Zeilenende wurde als verschluckter Code gemeldet (Fehlalarm), umformuliert. | ✅ |

---

## DC. Nachtrag zu K29b: Medienpolitik und Wirkung des Medienklimas (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k29b-medienpolitik`, auf U12f. Ausführlich in K29 (Umsetzung K29b).

| # | Befund | Status |
|---|---|---|
| DC1 | **Medienklima wirkt:** Bisher wurde es nur angezeigt (K29 §12 Nr. 13). Jetzt verändert es die Schwellen für Gerüchte über deinen Verein in `geruechteWoche`, gleich viele Würfe. Pressekonferenzen, die das Klima bewegen, haben damit erstmals eine Folge über die Anzeige hinaus. | ✅ |
| DC2 | **Ältere Tests:** Mit Klima 50 und „zurückhaltend“ sind alle Faktoren 1. Bewegen Pressekonferenzen im Test das Klima, ändert sich die Zahl der Gerüchte über dich leicht. | ⚠️ `tests/geruechte.js` ansehen |
| DC3 | **Gleichschritt:** Automatik heißt „zurückhaltend“, die Gerüchteküche ist im Test 5a ohnehin aus. | ✅ |

---

## DD. Prüfung von K20c und U12f ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat bf2de5e und 2c36bd0 gelesen (nichts ausgeführt). Korrekturen auf der neuesten Spitze `mitarbeit/popolupo-k29b-medienpolitik`.

| # | Befund | Status |
|---|---|---|
| DD1 | **Mitbieter kam fast nie:** Sein Gebot war durch seinen Vereinswert gedeckelt (höchstens etwa 1,32 × Marktwert), deine Ablöse für Stamm- und Schlüsselspieler liegt aber bei 1,5 bis 1,8 × Marktwert. Der Test K20c wäre gescheitert. Jetzt gedeckelt durch 1,8 × Marktwert und 80 % seines Kontos. Der Test nimmt einen Spieler von der Transferliste. | ✅ behoben |
| DD2 | **Mitgehen blockiert:** Vor dem Gegenangebot liefen Pause und die Prüfung der Beziehung, bei schlechter Beziehung konntest du nicht mitgehen. Jetzt zählt das Gegenangebot zuerst. | ✅ behoben |
| DD3 | **Jobwechsel in der Frist:** Führst du danach den Mitbieter oder den Verkäufer, lief der Wechsel trotzdem. Jetzt nicht mehr. | ✅ behoben |
| DD4 | **Grenzen der Computer-Vereine:** Mitbieter jetzt nur bis 30 Ansehen unter dem Verkäufer und für Spieler bis 32, der Verkäufer behält seine Mindestgröße. Budget und Zahl der Käufe je Fenster des Mitbieters zählen noch nicht mit. | ✅ behoben, Budget offen |
| DD5 | **Gebot kurz vor Fensterschluss:** wirkte nicht (der Wechsel braucht ein offenes Fenster). Jetzt gibt es dann keinen Mitbieter. | ✅ behoben |
| DD6 | **`tests/vorstand.js` Nr. 14:** Die Prüfung „einmal je Saison“ lief vor der Hälfte der Spiele und prüfte nichts. Jetzt nach der Hälfte. | ✅ behoben |
| DD7 | **Alter Spielstand ohne Zielgespräch:** Ein zugesagter Antrag in der Zwischenbilanz senkte nur das Ziel. Jetzt legt er das Zielgespräch wie nach dem Tiefstapeln an (Budget, Ruf). | ✅ behoben |
| DD8 | Ohne Befund: Laufzeit, Ablauf nach dem Mitgehen, Tagesreihenfolge, Gleichschritt, Logik der Zwischenbilanz, Kommentare. | ✅ |

---

## DE. Nachtrag zu K23g: Lizenzprüfung der Computer-Vereine (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k23g-lizenz-computer`, auf K29b. Ausführlich in K23 §5.5g.

| # | Befund | Status |
|---|---|---|
| DE1 | **Ablauf:** `kiLizenzPruefen` hängt in `finanzenTag` an denselben Tagen wie deine Prüfung (1. März Auflagen, 31. Mai Sperre). Die Sperre (`kiTransferSperre`) greift in `kiMarkt` (Kauf, Leihe, Sternejagd), in `market` (Angebote für deine Spieler) und bei Mitbietern (K20c). | ✅ |
| DE2 | **Modell der Liquidität:** derselbe erwartete Saldo wie in `kiFinanzenSpiel`. Pokal, Europapokal und Transfers fehlen darin, große Vereine im Europapokal stehen dadurch schlechter da als in Wirklichkeit. Nach der Modellrechnung (K23 §5.6b) reicht ihr Konto trotzdem. | ⚠️ im Testlauf über mehrere Saisons ansehen, wie viele Sperren es gibt |
| DE3 | **K36 „Kein Nachteil“:** Dein Verein in der Automatik läuft durch deine Prüfung, derselbe Verein als Computer-Verein durch diese. Über mehrere Saisons kann das auseinanderlaufen. | ⚠️ `tests/lizenz.js` Nr. 5 |

---

## DF. Prüfung von K29b und K23g ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 8fe3f70 und ab898d3 gelesen (nichts ausgeführt). Korrekturen auf der neuesten Spitze `mitarbeit/popolupo-k23g-lizenz-computer`.

| # | Befund | Status |
|---|---|---|
| DF1 | **Medienklima in der Automatik:** Der Co-Trainer senkt es bei jeder Pressekonferenz um 2, nichts hob es wieder. Seit K29b kostet ein schlechtes Klima Gerüchte. Jetzt zieht auch „zurückhaltend“ (Standard und Automatik) das Klima je Woche um 0,5 zur Mitte, in beide Richtungen. | ✅ behoben |
| DF2 | **Lücke der Sperre:** Vom 31. Mai bis zum 1. Juli kamen noch Angebote gesperrter Vereine, ein angenommenes führte am 1. Juli zum Wechsel. Jetzt gilt die Sperre ab dem 31. Mai, und `verkaufAbschluss` lehnt Angebote gesperrter Vereine ab. | ✅ behoben |
| DF3 | **Andere Wege:** Ausstiegsklausel (`vertraege.js`) und Leihe an einen gesperrten Verein (`leihVereine`) gingen noch. Jetzt nicht mehr. Vereinslose zum Auffüllen bleiben bewusst erlaubt. Kaufoption aus einer Leihe und Vorverträge gelten wie bei dir weiter. | ✅ behoben, Rest bewusst |
| DF4 | Ohne Befund: Laufzeit, Grenzen und Rundung des Klimas, gleich viele Würfe, Modell der Liquidität, Zeitpunkte, Gleichschritt, beide Tests, Kommentare. | ✅ |

---

## DG. Nachtrag zu K25c: Dauerkarten-Aktion (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k25c-dauerkarten-aktion`, auf K23g mit den Korrekturen DF.

| # | Befund | Status |
|---|---|---|
| DG1 | **Kampagne:** neuer Eintrag in `REGELN.marketing.kampagnen` (Sommer, 100.000 € mal Ligafaktor). Die Karte im Marketing listet sie wie die übrigen. Nach dem Verkauf der Dauerkarten lehnt `kampagneStarten` sie ab. | ✅ |
| DG2 | **Wirkung:** `dkAnteil` addiert für deinen Verein 0,05 mal Abnutzung, wenn die Aktion in dieser Saison lief. Der Deckel von 90 % bleibt. | ✅ |
| DG3 | **Prüfskript für Tests (neu, außerhalb des Repos):** `testnamen.pl` prüft alle Tests: `F.name(...)` nur für function-Deklarationen, `ev('name')` nur für vorhandene Namen, `ev('name=…')` nicht für const. Über alle Tests 0 Funde. | ✅ |

---

## DH. Nachtrag zu K26d: Dach (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k26d-dach`, auf K25c. Ausführlich in K26 §5.3.

| # | Befund | Status |
|---|---|---|
| DH1 | **Engine:** `side` setzt `sd.dach` einmal je Spiel (nur für den Gastgeber), `teamWerte` multipliziert den Heimvorteil damit. Seiten, die anderswo gebaut werden, haben kein `dach` und rechnen mit 1. | ✅ |
| DH2 | **Schätzung der Auslastung:** ohne den konkreten Gegner (die Seite kennt ihn nicht), also etwas vorsichtig. Ohne Würfel. | ✅ |
| DH3 | **Gleichschritt:** Nur dein Verein kann bauen, die Automatik baut nicht. | ✅ |

---

## DI. Prüfung von K25c und K26d ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 8a94e04 und 0f01091 gelesen (nichts ausgeführt). Korrekturen auf der neuesten Spitze `mitarbeit/popolupo-k26d-dach`. K25c ohne Befund.

| # | Befund | Status |
|---|---|---|
| DI1 | **Dach ohne Ticketpreis:** Die Schätzung der Auslastung kam aus dem Modell der Computer-Vereine (Richtpreis). Bei doppeltem Preis bekam ein halb leeres Stadion den Bonus, bei Kampfpreisen ein ausverkauftes keinen. Jetzt mit deinem Preis (`preisFaktor`, dieselbe Formel wie `attendance`). `tests/stadion.js` Nr. 11 prüft beide Fälle. | ✅ behoben |
| DI2 | **Kommentar:** `dachFaktor` hatte einen ungenutzten Parameter für den Gegner. Entfernt, Kommentar richtig gestellt. | ✅ behoben |
| DI3 | **Älterer Fehler:** Die Preisvorschau (`zuschauerSpanne`) rechnete die 3. Liga mit dem Faktor der 2. Liga (0,82 statt 0,7) und zeigte etwa 17 % zu viele Zuschauer. Jetzt wie `attendance`. | ✅ behoben |
| DI4 | Ohne Befund: Bau des Dachs über die allgemeinen Abläufe, Computer-Vereine bauen es nicht, `zuschauerErwartung` aus `side` ohne Zufall und nur mit Dach, Gleichschritt, Tests, K25c. | ✅ |

---

## DJ. Nachtrag zu K29c: Exklusivinterview (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k29c-exklusivinterview`, auf K26d mit den Korrekturen DI. Ausführlich in K29 (Umsetzung K29c).

| # | Befund | Status |
|---|---|---|
| DJ1 | **Beziehungen je Medium** (`S.mb`) und Exklusivinterview mit Sperrfrist (`S.exkl`), ohne Zufall. Die Wirkung von Gerüchten über dich wird mit der Beziehung des berichtenden Mediums gewichtet (`medienWirkung`), gleich viele Würfe. | ✅ |
| DJ2 | **Stimmung mit Kommastellen:** −3 × 1,5 gibt −4,5. Das gab es schon durch die Streuung der Pressekonferenzen. | ✅ |
| DJ3 | **Gleichschritt:** nur nach deinem Klick, die Gerüchteküche ist im Test 5a aus. | ✅ |

---

## DK. Prüfung von K29c und Nachtrag zu K25d: Mitglieder (22. November 2026, popolupo, ohne Testlauf)

Zweig `mitarbeit/popolupo-k25d-mitglieder`, auf K29c. K25d ausführlich in K25 §5.5.

| # | Befund | Status |
|---|---|---|
| DK1 | **Prüfung K29c (Agent, nur lesend):** ohne Fehler. Drei Kleinigkeiten behoben: Die Wirkung der Beziehung auf ein Gerücht hat jetzt einen eigenen Test (`tests/geruechte.js` K29c), der Block `exklusiv` steht in `daten/regeln.js` unter seinem Kommentar und nicht mehr zwischen Kommentar und `medienpolitik`, die Anzeige nennt die verbleibenden Tage bis zum nächsten Interview. | ✅ |
| DK2 | **Mitglieder (K25d):** Stammdatum aus `daten/vereine.js` (56 Vereine, Quellen dort), Beiträge (60 € je Jahr) in den sonstigen Einnahmen aller Vereine, Grundbetrag je Liga gesenkt, so dass der Schnitt je Liga gleich bleibt. Mitglieder folgen beim Saisonwechsel den Fans, Mitgliederaktion +2 %. | ✅ |
| DK3 | **Verschiebung innerhalb der Ligen:** Mitgliederstarke Vereine bekommen mehr (Bayern etwa +19,5 Mio. € je Saison gegenüber K23c, nach 40 % Verwaltung etwa +11,7 Mio. €), mitgliederschwache weniger (Leipzig, Elversberg, Paderborn etwa −6 Mio. €). Das ändert die Salden aus K23 §5.6b je Verein, nicht im Schnitt. | ⚠️ `tests/finanzmodell.js` ansehen |
| DK4 | **`tests/finanzen.js` Nr. 11** rechnet die sonstigen Einnahmen jetzt mit `sonstigeEinnahmen` statt dem festen Wert, neu Nr. 20 für Mitglieder und Beiträge. | ✅ |

---

## DL. Prüfung von K25d ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 902200f gelesen (nichts ausgeführt). Korrekturen auf `mitarbeit/popolupo-k25d-mitglieder`.

| # | Befund | Status |
|---|---|---|
| DL1 | **Alte Spielstände:** Ohne `t.mitglieder` rechnete das Spiel mit 30 % der Fans, in der 1. Liga liegen die echten Zahlen aber beim 2,5-Fachen der Fans (sonstige Einnahmen etwa 132.000 statt 300.000 € je Ligaspiel). Jetzt rechnet `mitgliederUmstellen` beim Laden einmal aus den Stammdaten um, im Verhältnis der heutigen zu den Start-Fans. | ✅ behoben |
| DL2 | **Sprung bei kleinen Vereinen:** Großaspach, Havelse und die Zweiten haben weniger Fans als die Mindestzahl, die Mitglieder wären beim ersten Saisonwechsel um 50 % gesprungen. Jetzt folgen die Mitglieder dem Wachstumsfaktor der Fans ohne deren Grenzen. | ✅ behoben |
| DL3 | **Mitgliederaktion wiederholbar:** alle vier Wochen, mit dauerhafter Wirkung. Jetzt einmal je Saison (`einmal` in den Kampagnen). | ✅ behoben |
| DL4 | **Doku:** Bayern bekommt gegenüber K23c etwa +19,5 Mio. € (nicht +15), das Minimum der 2. Liga ist Greuther Fürth (nicht Elversberg). | ✅ behoben |
| DL5 | Ohne Befund: Werte der Tests von Hand nachgerechnet, `S.fx` bei jedem Aufruf vorhanden, Zweite mit 0 Mitgliedern, Zeile in `saison.js`, `vereine.js` (56 Vereine, Zeilenenden), alle Nutzer von `sonstigeEinnahmen`, Gleichschritt, Kommentare. | ✅ |

---

## DM. Prüfung von K29d ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat dc13074 gelesen (nichts ausgeführt). Kein blockierender Fehler. Die Korrekturen liegen auf `mitarbeit/popolupo-u12g-trainervertrag`, mit U12g zusammen.

| # | Befund | Status |
|---|---|---|
| DM1 | **Ausraster ohne Medium:** Bruch (Vorstand −3) und Kult (Fans +6) gingen am Faktor der Beziehung vorbei, obwohl die Doku „jede Antwort“ sagt. Jetzt auch über das fragende Medium. Kein zusätzlicher Wurf. | ✅ behoben |
| DM2 | **Reihenfolge:** Der Faktor wurde je Antwort neu gelesen, nachdem frühere Antworten derselben Pressekonferenz die Beziehung schon geändert hatten. Jetzt steht der Faktor je Frage vor den Antworten fest. | ✅ behoben |
| DM3 | **Exklusivinterview ohne Rundung:** Ganze Zahlen auf jetzt gebrochene Beziehungen, ohne `fanZahl`. Jetzt über `medienBezAendern`, mit Rundung und Grenzen. | ✅ behoben |
| DM4 | Die zusätzliche Frage stand als 1 im Code, jetzt `klimaFragen.bohrenPlus`. | ✅ behoben |
| DM5 | **Doku:** „Noch nicht“ von K29c ist veraltet. Die Beziehung steigt auch bei Kritik und Provokation (Klima +1), mit Abnutzung weniger. Im Changelog sind es die Fälle 4, 5 und 6. | ✅ behoben |
| DM6 | Ohne Befund: gleiche Wahl bei Klima 50 auch an den Grenzen (R() liefert k/2^32, ×9 exakt), Anteile 0,6 und 1/7, Würfe nur im Strom `presse`, Gleichschritt (Co-Trainer sofort, `S.mb` bleibt leer), Zuordnung Antwort zu Frage, Deckel nach dem Faktor, Rundung und −0 beim Verblassen, alle Testwerte von Hand. | ✅ |

---

## DN. Prüfung von U12g ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 3286ff9 gelesen (nichts ausgeführt). **Ein blockierender Fehler.** Die Korrekturen liegen auf `mitarbeit/popolupo-u12h-ruf-wirkt`. Die Zweige `u12g` und `k29e` laden für sich allein nicht, getestet werden soll die Spitze.

| # | Befund | Status |
|---|---|---|
| DN1 | **`abfindung` doppelt:** In `aktionen.js` gibt es `const abfindung` für Spieler, U12g legte `function abfindung` dazu. Der Browser meldet einen SyntaxError und lädt `aktionen.js` nicht, die Node-Tests scheitern beim Laden. Jetzt `trainerAbfindung`. | ✅ behoben |
| DN2 | **`vertragEnde` doppelt:** Die Trainerfassung überschrieb still die Spielerfassung aus `vertraege.js`. Jeder Verkauf hätte eine Trainerabfindung gebucht, und Prämien wie Klauseln wären am Spieler geblieben. Jetzt `trainerVertragEnde`. | ✅ behoben |
| DN3 | **`vertragText` doppelt:** Das Spielerfenster hätte deinen Trainervertrag gezeigt. Jetzt `trainerVertragText`. | ✅ behoben |
| DN4 | Die Anzeige legte den Vertrag beim Zeichnen an. Jetzt liest sie nur, alte Spielstände bekommen den Vertrag beim Laden (`vertragUmstellen`). | ✅ behoben |
| DN5 | Der Jobwechsel in `tests/sim.js` nahm weder Station noch Vertrag mit. Jetzt wie `takeJob` (Station, Vertrag, Glaubwürdigkeit). | ✅ behoben |
| DN6 | „verdient“ zeigte die laufende Saison erst am Saisonende. Jetzt anteilig bis heute, nur in der Anzeige. | ✅ behoben |
| DN7 | Ein Kommentar stand an der falschen Stelle. | ✅ behoben |
| DN8 | Ohne Befund: Ablauf bei Spielbeginn, Jobwechsel in der Saison und nach dem Saisonende, Entlassung in der Saison und am Saisonende, Rücktritt, Verlängerung, Ligaklausel, keine doppelte oder verlorene Buchung, keine anderen Wege aus dem Job, Test Nr. 15 von Hand nachgerechnet, Spaltenzahlen, Zahlen in der Doku. | ✅ |

**Neue Prüfung vor jedem Commit:** `perl C:\Users\siegemund.gerry\projekte\flutlicht-tools\dubletten.pl flutlicht-manager` meldet Namen, die auf oberster Ebene in zwei Dateien deklariert sind. Alle Skripte teilen sich einen Namensraum. Für den Kommentar-Wächter (`tests/code.js`) wäre dieselbe Prüfung nützlich.

---

## DO. Prüfung von K29e und U12h ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 69be27f und 569fb0d gelesen (nichts ausgeführt, nur `dubletten.pl` und `codewaechter.pl`, beide ohne Befund). Kein blockierender Fehler. Korrekturen auf `mitarbeit/popolupo-k20d-spieler-nein`.

| # | Befund | Status |
|---|---|---|
| DO1 | **Strafe für eine offene Stichelei zu oft:** Sie traf auch, wenn du die Stichelei (immer Frage 1) schon beantwortet und dann den Co-Trainer geschickt hattest, nach einer Entlassung (dann die Mannschaft des alten Vereins) und bei einer Pressekonferenz aus der alten Saison. Jetzt nur ohne Antwort, nicht nach einer Entlassung, nur in derselben Saison. | ✅ behoben |
| DO2 | **Gleichschritt nach einer Entlassung:** `tests/lizenz.js` 5a setzt nach einer Entlassung `fired` und `trust` zurück, aber nicht den Ruf. Seit U12h wirkt der Ruf in der Kabine, Lauf A wäre dann abgewichen. Der Test setzt jetzt auch `S.ruf` zurück. | ✅ behoben |
| DO3 | **Test Nr. 16 zu schwach:** Mit Ruf +50 lag die Kabine bei der Obergrenze 95, jeder Faktor ab 0,47 hätte bestanden. Jetzt Ruf +20 (erwartet 81,6). | ✅ behoben |
| DO4 | Hinweis: In allen `saisons()`-Läufen ohne Lernstufen geht der Co-Trainer am Tag danach. Der Sim-Verein verliert vor Topspielen mit stichelnden Trainern also 1 oder 2 Stimmung. Kein Test mit festen Erwartungen bricht. | zur Kenntnis |
| DO5 | Ohne Befund: Würfe nur im Strom `presse`, nichts für Diplomaten und Floskelkönige, keine Abstürze (Amateure, Ausland, ohne Trainer, alte offene Pressekonferenzen), Gleichschritt unter Automatik, Deckel, Platzhalter, Testwerte von Hand (Anteile, Sticheleien, 51/51, 48), alle Umbenennungen aus DN, `vertragUmstellen` auf allen drei Ladewegen, `gehaltLaufend`, Doku. | ✅ |

---

## DP. Prüfung von K34b, K32c und K20d ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat e4dcccf, 39d3e7c, 8454a66 und d66cdc7 gelesen (nichts ausgeführt, `dubletten.pl` und `codewaechter.pl` ohne Befund). Kein Fehler, ein mittlerer Befund. Korrekturen auf `mitarbeit/popolupo-u12j-jobangebot`.

| # | Befund | Status |
|---|---|---|
| DP1 | **K20d, Nein ohne feste Einigung:** Nach dem Nein des Spielers sank nur die Forderung. Dein nächstes Angebot lief noch einmal durch die Runde mit dem Verkäufer, dort konnte die schlechte Beziehung (unter der Gesprächsgrenze) ablehnen und eine Pause setzen, obwohl der Verkäufer schon Ja gesagt hatte. Jetzt steht die Einigung 14 Tage fest (`einig`, wie nach einem Ja). | ✅ behoben |
| DP2 | **K20d, Mitbieter fällt aus:** Kann der andere Verein nicht mehr kaufen (Geld, Kader, nicht aktiv), ging das Ja zu deinem Gebot verloren. Jetzt bleibt der Verkäufer dabei. | ✅ behoben |
| DP3 | **K34b, Hinweis unter den Rekorden:** Bei der 2. und 3. Liga stand noch „Rekorde seit Spielbeginn“. Jetzt „Startwerte sind die echten Rekorde der …“. | ✅ behoben |
| DP4 | **Serie ohne Niederlage (alt, seit U13):** Erreichte ein Verein mit einer neuen Serie seinen alten Rekord plus eins, galt sie als dieselbe Serie, und es kam keine Meldung. Jetzt merkt sich die Serie ihren Beginn. | ✅ behoben |
| DP5 | **K32c, Ex-Spieler häufen sich:** Computer-Vereine holen nur Co-Trainer, also blieben Ex-Spieler bis 68 in der Liste und zählten beim Auffüllen mit. Jetzt gehen sie nach fünf Saisons ohne Job und zählen beim Auffüllen nicht mit. | ✅ behoben |
| DP6 | **K20d, Kleinigkeiten:** Das Nein gilt nur für den Verein, den du beim Gebot geführt hast. Die Meldung beim Gebot nennt das mögliche Nein. Der Hinweis erscheint nicht bei alten Gegenangeboten ohne deine Ablöse. | ✅ behoben |
| DP7 | Ohne Befund: Startwerte für neue und alte Spielstände (gleich gut: der echte bleibt), echte Rekorde werden nie still verlängert, 0:7 als Startwert, kein Meldungsschwall, Ströme in K32c, Reihenfolge im Saisonwechsel, Meldung nur für eigene Ehemalige, Ausschluss neuer Trainer, alle Testwerte von Hand, Gleichschritt. | ✅ |

---

## DQ. Prüfung von U12i und U12j ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 86ef44d und a3b1902 gelesen (nichts ausgeführt, `dubletten.pl` und `codewaechter.pl` ohne Befund). Kein blockierender Fehler. Korrekturen auf `mitarbeit/popolupo-k29g-urteil`.

| # | Befund | Status |
|---|---|---|
| DQ1 | **Jobangebot ohne wirksame Grenze:** Ruf + 40 lag ab Ruf 55 immer bei mindestens 95, ein Drittligatrainer konnte also Bayern angeboten bekommen. Jetzt höchstens die Mitte der Jobangebote nach einer Entlassung (`mkJobs`) plus 10. | ✅ behoben |
| DQ2 | **„Einmal je Jahr“ nur je Verein:** Die Sperre hing am Schlüssel mit dem Verein, ein anderer Verein konnte in der nächsten Woche anrufen. Jetzt prüft der Auslöser alle Jobangebote der letzten 365 Tage. | ✅ behoben |
| DQ3 | **Offene Karten wanderten mit:** Nach einem Jobwechsel entschied der Co-Trainer offene Karten des alten Vereins für den neuen (Geld, Fans, Vertrauen, Verpflichtung). Jetzt entscheidet er sie am Anfang von `takeJob` noch für den alten Verein (`kartenJobwechsel`), für jeden Jobwechsel. | ✅ behoben |
| DQ4 | Kredite und Raten verschwinden beim Jobwechsel wie bisher (auch bei Rücktritt und Entlassung), Computer-Vereine führen keine Kredite. Jetzt in K28 §5.13 genannt. | dokumentiert |
| DQ5 | Die Ablöse für den Trainervertrag steht nicht in den Finanzen, nur in der Meldung (`takeJob` leert `S.fin`). | dokumentiert |
| DQ6 | **Präsidentenwahl ohne Relegation:** Auf- und Abstieg über die Relegation zählten nicht. Jetzt wie in `rufSaison`. | ✅ behoben |
| DQ7 | Wahl bei deinem Verein, während du entlassen bist: keine Meldung, kein Vertrauen (im Spiel kaum möglich, Schutz). | ✅ behoben |
| DQ8 | Hinweis: Jeder neue Präsident bekommt eine andere Geduld (101 × Multiplikator ergibt modulo 20 immer 9). So gewollt, fest. | zur Kenntnis |
| DQ9 | Ohne Befund: gleiche Werte ohne Wechsel, Wahl vor Auf- und Abstieg mit der fertigen Tabelle, eigener Strom, Zielgespräch und Nebenziele mit dem neuen Präsidenten, „Sommer s+1“, Automatik bleibt immer, Reihenfolge beim Wechsel (Gehalt, Ablöse, Station „gewechselt“), Pressekonferenz, Ultimatum und Vertrag werden zurückgesetzt, Testwerte von Hand, Gleichschritt. | ✅ |

---

## DR. Prüfung von K29f und K29g ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 30a8575 und 3ef6aa5 gelesen (nichts ausgeführt, `dubletten.pl` und `codewaechter.pl` ohne Befund). **Ein schwerer Befund**, dazu ein alter Fehler aus U17a mit derselben Ursache. Korrekturen auf `mitarbeit/popolupo-k29g-urteil`.

| # | Befund | Status |
|---|---|---|
| DR1 | **Interview am Spielfeldrand nie sichtbar:** Nach dem Abpfiff ruft das Spiel sofort `weiter()` auf, der Tag springt weiter, die Karte galt nur am Spieltag. Jetzt gilt sie bis zum nächsten Halt (`spielfeldrandWeiter` am Anfang von `weiter`). **Derselbe Fehler seit U17a:** Pressekonferenzen nach dem Spiel (Kantersieg, Krise, Höhenflug, Führung) übernahm im selben Schritt der Co-Trainer, du hast sie nie gesehen (je −2 Medienklima). Jetzt finden sie am Tag danach statt, mit Halt. | ✅ behoben |
| DR2 | **Urteil verdrängt Spiel-Pressekonferenzen:** Das Sportgericht läuft im Tageslauf vor `presseTag`, die Pressekonferenz zum Urteil blockierte Derby, Spitzenspiel, Pokal oder Saisonauftakt. Jetzt vorgemerkt und in `presseTag` nach diesen Anlässen geöffnet, verfällt nach 7 Tagen. | ✅ behoben |
| DR3 | **Remis-Frage nach Pokalspielen:** Ein Elfmeterschießen galt als Remis („Zufrieden mit dem Punkt?“). Jetzt zählt der Sieger, ein Remis außerhalb der Liga bekommt eine eigene Frage. | ✅ behoben |
| DR4 | **Pressekonferenz nach abgesessener Sperre:** Jetzt nur, solange die Sperre noch läuft. | ✅ behoben |
| DR5 | Die Antworten zur Kritik am Urteil waren die Texte der Schiedsrichterkritik. Seit K29h eigene Texte, Name und Schlagzeile. | ✅ behoben (K29h) |
| DR6 | Test K29f hing am Tag (Frage reihum). Jetzt mit festem Tag. Doku: bei schlechtem Klima bis zu vier Fragen. | ✅ behoben |
| DR7 | Ohne Befund: Interview für Liga, Pokal (auch geteilte Runden), Supercup, Europapokal und Relegation, nicht für Testspiele; Speichern und Laden, alte Spielstände ohne `einst`, keine Wirkung in der Automatik, keine Würfe, Platzhalter; alle Wege zum Urteil, Ströme, Gleichschritt, Katalog. | ✅ |

---

## DS. Prüfung der Korrektur DR (Ablauf nach dem Abpfiff) ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat ef6619c gelesen und die drei Wege nach dem Abpfiff Schritt für Schritt verfolgt (Konferenz, Live-Spiel, Spiel in `weiter`). Die Korrektur trägt: Die Pressekonferenz nach dem Spiel kommt am Tag danach mit Halt, das Interview steht beim nächsten Halt. Korrekturen auf `mitarbeit/popolupo-k14b-kabinen-karten`.

| # | Befund | Status |
|---|---|---|
| DS1 | **Vorgemerktes Urteil ohne Prüfung des Spielers:** Nach einem Verkauf oder Jobwechsel binnen 7 Tagen kam die Pressekonferenz zu einem fremden Spieler (mit Glaubwürdigkeitsverlust nach Rückendeckung). Jetzt nur, solange er dein Spieler ist und die Sperre läuft; `takeJob` löscht die Vormerkung. | ✅ behoben |
| DS2 | **Saisonende:** Eine Pressekonferenz nach dem letzten Spiel lag bis in die neue Saison und kostete dann 2 Punkte Medienklima. Jetzt nie über das Saisonende hinaus, eine alte aus der Vorsaison fällt still weg. | ✅ behoben |
| DS3 | **Interview nach einer Entlassung** (alt): Beim neuen Verein stand noch das Interview zum letzten Spiel. `takeJob` löscht es. | ✅ behoben |
| DS4 | Abstand und Sperre der Pressekonferenzen zählen jetzt ab ihrem Tag, nicht ab dem Spieltag. Die Vormerkung zum Urteil gilt jetzt genau 7 Tage. | ✅ behoben |
| DS5 | Test Nr. 7 prüft jetzt Tag danach, Halt, Bleiben und Übernahme durch den Co-Trainer. | ✅ behoben |
| DS6 | Hinweis: `fuzz-karrieren.js` und `ui-zwei-saisons.js` bekommen ein paar Halte mehr je Saison, ihre Grenzen bitte im Blick behalten. | zur Kenntnis |
| DS7 | Ohne Befund: alle drei Wege, Spiel am Tag danach (ein Halt), Erinnerungen, `naechsterHalt` nach dem Laden, Interview in allen Wegen bis zum nächsten `weiter`, Urteil am selben Tag, Gleichschritt 5a, Test 4 in `lizenz.js`, `schwierigkeit.js`. | ✅ |

---

## DT. Prüfung von U12k, K25e und K14b ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 6fd507f, 9a8696d und 9d4e16d gelesen (nichts ausgeführt, `dubletten.pl` und `codewaechter.pl` ohne Befund). Kein blockierender Fehler. Korrekturen auf `mitarbeit/popolupo-k16b-team-mitnehmen`.

| # | Befund | Status |
|---|---|---|
| DT1 | **Eingewöhnung für jeden Ausländer:** Auch wer von einem deutschen Verein kam, „tat sich schwer im neuen Land“. Jetzt nur nach einer Ankunft aus dem Ausland (`p.ausAb`, gesetzt in `ausDemAusland`). | ✅ behoben |
| DT2 | **Eine Antwort immer besser:** Kabinenparty „feiern“ und Neuzugang „Chance“ kosteten nichts. Jetzt: Bei der Party werden mit 30 % Fotos publik (Vertrauen −3). Die Chance für den Neuzugang kostet Zusammenhalt −1. Der Text verspricht keine Folge mehr, die es nicht gibt. | ✅ behoben |
| DT3 | **U12k nach Hochpokern:** Die freiwillige Senkung behielt das höhere Budget und den Ruf-Zuschlag. Jetzt senkt der Präsident nach Hochpokern nicht von sich aus, dann bleibt der Antrag. | ✅ behoben |
| DT4 | Neuzugang: nur einsatzfähig und frühestens nach 14 Tagen im Verein. Die Zahl 2 (Stärke) steht jetzt in den Regeln. | ✅ behoben |
| DT5 | Kabinenparty nur bis 7 Tage nach dem Kantersieg (nicht nach der Winterpause). | ✅ behoben |
| DT6 | Kleinigkeiten: Kommentare, `gesenkt` in K33, „Prozentpunkte“ in der Anzeige der Dauerkarten. | ✅ behoben |
| DT7 | Ohne Befund: U12k bei alten Spielständen und am Rand der Liga, Vertrauen danach, Test 18 und 14; K25e bei 0 Mitgliedern und Kapazität 0, Freiburg genau +10 Punkte, Tests K27b und K25e; `S.res` nur Liga, `p.seit` auf allen Wegen, Katalog, Test K14b, Gleichschritt. Hinweis: Fast jeder Erstligist bekommt die vollen 10 Punkte Vorkaufsrecht. | ✅ |

---

## DU. Prüfung von K19c, K09b und K16b ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 4659aa2, e418ef8 und f7f7716 gelesen (nichts ausgeführt, `dubletten.pl` und `codewaechter.pl` ohne Befund). Kein blockierender Fehler, fünf echte Befunde. Korrekturen auf `mitarbeit/popolupo-k29i-maulkorb`.

| # | Befund | Status |
|---|---|---|
| DU1 | **Unverkäuflich ohne Angebote:** Ein Überraschungsangebot erreicht höchstens etwa 1,5 × Marktwert, die Grenze 1,8 × also nie. Jetzt hebt der Bieter auf den Höchstpreis, wenn er ihn zahlen kann (ohne zusätzlichen Wurf). | ✅ behoben |
| DU2 | **Verhandlung unter den Höchstpreis:** Die Schmerzgrenze lag bei etwa 1,49 × Marktwert. Jetzt bei unverkäuflichen Schlüsselspielern gleich dem Höchstpreis. | ✅ behoben |
| DU3 | **Mitgebrachte verdrängten sich:** Der zweite Mitgebrachte konnte den ersten verdrängen. Jetzt geht nur ein Mitarbeiter, der schon dort war, mit Meldung. | ✅ behoben |
| DU4 | **„30 Wochen bei dir“ zählte ab Eintritt beim Verein:** `wiv` lief weiter, wenn du kamst. Jetzt beginnen die übrigen Mitarbeiter des neuen Vereins bei 0 Wochen mit dir. | ✅ behoben |
| DU5 | **Jobangebot per Karte ohne Wahl:** Jetzt kommen dort die mitnehmbaren Co-Trainer mit. | ✅ behoben |
| DU6 | Kleinigkeiten: Wahl des Trainerteams über den Jobangeboten, Gelbsperre-Erinnerung nicht unter der Automatik der Aufstellung und nicht für schon Gesperrte, `S.unv` wird beim Jobwechsel geleert. Die Aufschläge in `forderungDu` (Beziehung, Abwerben, Gerüchte, Deadline Day) können den Höchstpreis noch übersteigen, das ist gewollt. | ✅ behoben |
| DU7 | Ohne Befund: kein Durchsickern in Wechsel unter Computer-Vereinen, Würfe im Markt unverändert, Gleichschritt, Hinweis im Spielerfenster, `askPrice`; nächstes Ligaspiel auch mit Pokal dazwischen, Spitzenspiel wie in der Presse, Menü der Erinnerungen, Derby BVB–S04 im Test; Eigentum, Gehalt, `stabGeaendert`, Aufräumen von `S.mitnehmen`, Tests K19c und K16b. | ✅ |

---

## DV. Prüfung von K29h, K14c, K07b, K34c, K29i und der Korrekturen DU ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat a7ed216, 8eb2597, 7c90478, f6a2692, 8a92d9e und bfb2f69 gelesen (nichts ausgeführt, `dubletten.pl` und `codewaechter.pl` ohne Befund). Kein blockierender Fehler. Korrekturen auf `mitarbeit/popolupo-k18c-gegnerbeobachtung`.

| # | Befund | Status |
|---|---|---|
| DV1 | **„Plan passt nicht“ unter Automatik und täglich:** Der Belastungssprung lag in der Vorbereitung bei vielen über 1,5. Die Erinnerung hätte jeden Tag „Tag beenden“ aufgehalten, auch wenn die Vorlage beim Stab liegt. Jetzt nicht unter der Automatik der Vorlage und höchstens einmal je Woche. | ✅ behoben |
| DV2 | Der Maulkorb blieb beim Jobwechsel bestehen. Jetzt hebt `takeJob` ihn auf. | ✅ behoben |
| DV3 | Der Medien-Kasten versprach unter der Automatik Interviews. Jetzt steht dort, dass der Co-Trainer die Linie vorgibt. | ✅ behoben |
| DV4 | Die englische Woche hatte eine eigene Zahl neben `RT.englischBis`. Jetzt gilt dieselbe. | ✅ behoben |
| DV5 | Ein Kommentar stand an der falschen Zeile. | ✅ behoben |
| DV6 | `kontoAnteil` wird im Markt bei Spielern auf der Transferliste anders gelesen (Konto über 0,8 × Preis) als im Mitbieter und bei Unverkäuflichen (0,8 × Konto über dem Preis). Die Stelle ist alt, sie bleibt vorerst so und ist hier vermerkt. | offen |
| DV7 | Überschrift „Torjäger deutscher Vereine“ statt „deutsche Torjäger“. | ✅ behoben |
| DV8 | Ohne Befund: Ströme in K29i (eigener Strom, keine zusätzlichen Würfe im Wochenstrom), Gleichschritt 5a (Presse in beiden Läufen in der Automatik), K29h, K14c, Korrekturen DU, alle neuen Tests von Hand nachgerechnet. | ✅ |

## DW. Prüfung von U12l, K18c, K11b, K11c und der Korrekturen DV ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat a97ce26, dc5ccd6, 8b6873a, 3d6b3ea und 574aca0 gelesen (nichts ausgeführt). Kein blockierender Fehler, keine Namenskonflikte, `${}` nur in Backticks, jeder neue Würfel im eigenen Strom, alte Spielstände ohne die neuen Felder laufen. Korrekturen auf `mitarbeit/popolupo-u19e-europa-karten`.

| # | Befund | Status |
|---|---|---|
| DW1 | **Tag 2 des Sommerturniers war nicht reserviert:** Das zweite Spiel steht erst nach dem Halbfinale in `S.testspiele`. Bis dahin bot `testspielTage` den Tag noch an, für eine Anfrage bei einem Amateurverein oder eine Einladung (K11c), und die Woche bekam drei Testspiele. Jetzt zählt `testspielBelegt` den Tag mit, solange das Turnier läuft. Liegen beide Turniertage in einer Woche, zählen sie zusammen zu `maxProWoche`. | ✅ behoben |
| DW2 | **Einladung ohne Saison und Verein:** `S.tsKI` verfiel nur mit der Antwort. Weil die Tage jede Saison neu zählen, kam eine unbeantwortete Einladung in der nächsten Saison wieder, und nach einem Jobwechsel galt sie für den neuen Verein (im schlimmsten Fall gegen sich selbst). Jetzt mit `s` und `my`, geprüft über `tsKIOffen`, gelöscht in `newSeasonLauf` und `takeJob`. `takeJob` löscht auch `S.turnier` und die noch nicht gespielten Testspiele des alten Vereins (das Letzte war schon vor K11b so). | ✅ behoben |
| DW3 | **Frist versprach mehr als möglich:** Der Termin konnte vier Tage nach der Einladung liegen, die Zusage prüft aber noch einmal mit dem Vorlauf. Eine Zusage am Dienstag scheiterte mit „An diesem Tag geht es nicht mehr“. Jetzt liegt der Termin mindestens Antwortfrist + Vorlauf hinter der Einladung. | ✅ behoben |
| DW4 | **Einladung verfiel ungesehen:** In der Vorbereitung gibt es kaum Halte, „Tag beenden“ springt bis zu sieben Tage. Jetzt hält das Spiel am letzten Tag der Frist an („Frist“, wie bei Angeboten), nicht unter der Automatik der Testspiele. | ✅ behoben |
| DW5 | **Falsche Prozente im Zielgespräch:** `zgBudgetFaktor` enthält seit U12l das Budgetgespräch. Nach einer Zusage im Budgetgespräch stand im Zielgespräch „32 % mehr“ statt 10 %. Die Meldungen rechnen jetzt ohne den Faktor des Budgetgesprächs. | ✅ behoben |
| DW6 | **Turnier vor der 3. Woche:** `turnierMoeglich` bot Tage in Woche 1 und 2 an, dort sagen aber keine Profis zu („keine drei Gegner“). Jetzt erst ab `RTS.abWoche`, wie K11 §12 sagt. | ✅ behoben |
| DW7 | **Zuschauer im Turnier doppelt:** Beide Turnierspiele sind Heimspiele, `testspielNach` buchte dazu Zuschauereinnahmen. Entschieden (vorläufig): im Turnier nur Antrittsgeld und Siegprämie, die Zuschauer gehören dem Ausrichter. | ✅ behoben, vorläufig |
| DW8 | **Gegnerbeobachtung ohne Wirkung kostete Geld:** Mit Videoanalyst oder am Spieltag ohne Spielvorbereitung der letzten zwei Tage verdoppelt die Beobachtung nichts. Jetzt steht dort ein Hinweis statt des Knopfs, und `gegnerBeobachten` bucht nichts. Nach dem Klick zeichnet das Spiel das Fenster vor dem Spiel neu (`render` tat das nicht). | ✅ behoben |
| DW9 | Ein Kommentar zu `jobangebot.rufSpanne` war an die Zeile `budgetgespraech` gerutscht, `bgChance` nutzte die Zahlen 50 und 10 im Code (jetzt `vertrauenMitte`, `sparsamMitte`). Unter der Automatik der Transfers merkt sich `kiBudget` das Budget je Fenster, das Plus aus dem Budgetgespräch wirkt dann erst ab dem nächsten Fenster. Das bleibt so und ist hier vermerkt. | ✅ behoben, Rest dokumentiert |
| DW10 | **Tests:** K11b prüfte „einmal je Saison“ an einem Tag, der auch aus anderen Gründen nicht ging. Jetzt an allen Tagen, an denen ohne das erste Turnier eines ginge, dazu Siegprämie, reservierter Tag 2 und keine Turniere vor der 3. Woche. K11c läuft jetzt über den Montag in `testspieleTag`, antwortet am letzten Tag der Frist und prüft Halt, Saison und Verein. Neu `tests/scouting.js` DW8. Offen: das Elfmeterschießen im Turnier und die Wochengrenze von „Plan passt nicht“ in `tests/erinnerungen.js`. | teils offen |
| DW11 | Ohne Befund: Korrekturen DV, Gleichschritt 5a (die Einladung entsteht dort, weil `auto.testspiele` fehlt, wirkt aber nicht und würfelt im eigenen Strom), Budgetgespräch und Turnier nur per Knopf. | ✅ |

## DX. Prüfung von U19e, K31b und der Korrekturen DW ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat a10719d, 832e7f5 und 9d726b3 gelesen (nichts ausgeführt). Kein blockierender und kein mittlerer Fehler. Geprüft und ohne Befund: Datenform von `euMeineSpiele` (Hin- und Rückspiel, Elfmeterschießen, Finale), Zeitfenster der Europapokal-Karten mit dem Montag, die Liste in K31b gleich den Bietern im Markt, der Halt „Frist“, Gleichschritt 5a, `showPre` nach der Gegnerbeobachtung, DW5. Korrekturen auf `mitarbeit/popolupo-k36c-stabbericht`.

| # | Befund | Status |
|---|---|---|
| DX1 | Nach einem Jobwechsel blieben die gespielten Testspiele des alten Vereins, auch Tag 2 eines gespielten Turniers. `testspielBelegt` erkannte daran den Tag 2 eines neuen Turniers als schon eingetragen (DW1 kam auf diesem Weg zurück), und die alten Spiele zählten beim neuen Verein zur Woche, zur Automatik und zur Vorbereitungsliste. Jetzt löscht `takeJob` alle Testspiele, und Tag 2 muss genau der Tag nach dem Turnierbeginn sein. | ✅ behoben |
| DX2 | Das Fenster der Spielvorbereitung (2 Tage) stand doppelt im Code (taktik.js, scouting.js). Jetzt `RTA.vorbereitungTage` und ein Helfer `vorbereitungWirkt` für beide. | ✅ behoben |
| DX3 | Der Test K11b „einmal je Saison“ war bestanden, wenn es keinen prüfbaren Tag gab. Jetzt muss es einen geben. | ✅ behoben |
| DX4 | Das Changelog zu DW nannte `tests/vorstand.js`, dort fehlte aber ein Fall zu DW5. Jetzt Fall DW5 (Prozente im Zielgespräch nach einem zugesagten Budgetgespräch). | ✅ behoben |
| DX5 | Die Häufigkeit der Europapokal-Karten stand in K37 §8 für alle gleich. Jetzt je Karte (Pyrotechnik etwa alle 12 bis 15 Saisons, Fanmarsch und Reisechaos 25 bis 30, Wunder fast nie). | ✅ behoben |
| DX6 | Der Hinweis unter „Bedarf anderer Vereine“ war ungenau (Auslandsvereine bieten ohne Bedarf, unter der Automatik kommen keine Angebote). Jetzt steht beides da. Der Test K31b vergleicht mit einer Kopie des Filters aus `market()`, nicht mit `market()` selbst. Das bleibt so und ist hier vermerkt. | ✅ behoben, Rest dokumentiert |

## DY. Prüfung von K34d, K31c, K30b, K36c und der Korrekturen DX ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 78704ea, ffad7fa, 5e3b8a1, f9fea58 und 1a8a508 gelesen (nichts ausgeführt). Kein blockierender und kein mittlerer Fehler. Ohne Befund: neue Namen nur einmal, `${}` nur in Backticks, `RTA` und Ladereihenfolge, Gleichschritt 5a (keine neuen Würfel, `news` und `S.stabT` ändern nichts, was 5a vergleicht), alte Spielstände, die Korrekturen DX. Korrekturen auf `mitarbeit/popolupo-k10d-ausfall-bilanz`.

| # | Befund | Status |
|---|---|---|
| DY1 | `tagBeginn` und `tagEnde` gaben die gesammelten Stab-Meldungen nur am Ende aus. Nach einem Fehler im Tageslauf blieb `S.stabT` liegen, spätere Meldungen (etwa beim Jobwechsel) kamen erst einen Tag später. Jetzt `try`/`finally`, und beim Laden eines Spielstands wird `S.stabT` gelöscht. | ✅ behoben |
| DY2 | Der Saisonwechsel läuft außerhalb von `tagBeginn`. Die vielen Verlängerungen kamen dort weiter einzeln. Jetzt sammelt `weiter` auch um `newSeason`. | ✅ behoben |
| DY3 | Eine schlechte Meldung (etwa vom Sportgericht) verlor in der Sammelzeile ihre rote Farbe. Jetzt färbt eine schlechte Meldung die ganze Zeile. | ✅ behoben |
| DY4 | Der Test K36c prüfte nur, dass der Sammler weg ist. Jetzt zwei Meldungen aus einem echten `tagBeginn` (genau eine Zeile, rot) und eine Meldung vor einem Fehler im Tageslauf. | ✅ behoben |
| DY5 | Mit dem echten Startwert meldete das Spiel in der ersten Saison nur den ersten neuen Rekordtransfer, einen zweiten nicht mehr (Sperre `meldenAb`). Mit Startwert braucht es die Sperre nicht mehr, jetzt wird jeder neue Rekord gemeldet. | ✅ behoben |
| DY6 | „Konkurrent rüstet auf“ kam auch, wenn der Rivale unter deiner Automatik der Transfers einen Spieler von dir holte („holt mit deinem Spieler einen Star …“). Jetzt nicht, wenn der Spieler von dir kommt. | ✅ behoben |
| DY7 | Der Test K30b setzte die Entscheidungen vor dem Sprung über eine Woche auf 0 und konnte darum nicht scheitern. Jetzt bleibt es 1, erwartet wird trotzdem 0. | ✅ behoben |
| DY8 | Entscheidungskarten ohne Halt zählten zur Info-Grenze. Unter „wenig“ (3 Infos) konnten sie wegfallen, obwohl der Menütext sagt, die Karten kämen gleich oft. Jetzt zählen nur Info-Karten zur Info-Grenze, Entscheidungen ohne Halt entscheidet der Co-Trainer immer. Das gilt auch für „normal“, die Grenze greift bei etwa 0,13 Karten je Woche aber fast nie. Dazu in den Regeln: `wochen` ist 1 oder 2. | ✅ behoben |
| DY9 | Der Text der Gegnerbeobachtung nannte „zwei Tage“ fest, jetzt `RTA.vorbereitungTage`. | ✅ behoben |

## DZ. Prüfung von K11d, K10b, K10c, K10d und der Korrekturen DY ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 8702394, fc41bed, 0314438, 684a255 und 5c55511 gelesen (nichts ausgeführt). Kein blockierender Fehler, ein mittlerer. Ohne Befund: Namen, `${}`, Zahlen in den Regeln, keine neuen Würfel in geteilten Strömen, alte Spielstände, Gleichschritt 5a (die Fehldiagnose ändert nur `p.vl.sd/sk/fehl` und Meldungen, keine Entscheidung liest `sd`), die Korrekturen DY. Korrekturen auf `mitarbeit/popolupo-dz-korrekturen`.

| # | Befund | Status |
|---|---|---|
| DZ1 | **Mittel: „spielfreie Woche“ am letzten Spieltag.** Nach dem letzten Ligaspiel liegen bis zum Urlaub keine Pflichtspiele, Testspieltage gibt es aber noch. Die Erinnerung kam darum vor dem letzten Spiel fast jeder Saison (auch beim 16. vor einer noch offenen Relegation). Jetzt nur, wenn nach dem Zeitraum noch ein Pflichtspiel kommt. Test K11d prüft den letzten Spieltag ohne Pokalfinale. | ✅ behoben |
| DZ2 | Zweite Meinung am letzten Tag einer Verletzung: Bei „bessere Behandlung“ und `p.inj` 1 änderte sich nichts, der Text sagte aber „die Pause wird länger“. Jetzt entscheidet die tatsächliche Änderung über den Text, ohne Änderung heißt es „bestätigt“. | ✅ behoben |
| DZ3 | Nach einer Spritze, die die Verletzung verschlimmert, bleibt `p.inj` beim alten Rest, `v.t` passt nicht mehr. Die zweite Meinung nimmt die wahre Dauer jetzt aus dem Zähler (`seit + p.inj − 1`), die Spanne enthält sie danach immer. Die Ursache in `nachSpritze` bleibt (älter als K10). | ✅ behoben, Ursache dokumentiert |
| DZ4 | Die Fehldiagnose lag oft ganz unter der ersten Einschätzung und fiel so sofort auf. Jetzt reicht ihre Obergrenze bis zur Untergrenze der ersten Einschätzung (höchstens wahre Dauer − 1). | ✅ behoben |
| DZ5 | Nach einem Jobwechsel in der Phase „Saisonende“ zeigte die Saisonbilanz die Verletzungen des neuen Vereins. Jetzt hält `seasonEnd` den Text in der Bilanz fest. | ✅ behoben |
| DZ6 | Die zweite Meinung erfüllt die Lizenzaufgabe `medizin`, die Gelegenheit dafür zählte sie aber nicht. Jetzt zählt eine mögliche zweite Meinung als Gelegenheit. | ✅ behoben |

## EA. Prüfung von K09c, K19d, K21b und der Korrekturen DZ ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 54e3a1e, 0a9841b, 838821e, 0dd110f und 464e56d gelesen (nichts ausgeführt). Kein blockierender Fehler, drei mittlere. Ohne Befund: Doku-Berichtigung, Korrekturen DZ (`naechstesSpiel` sucht bis zum Saisonende, `v.t` passt zum Zähler), Geldfluss der Weiterverkaufsbeteiligung auf allen Wegen, Gleichschritt, Namen, `${}`. Korrekturen auf `mitarbeit/popolupo-ea-korrekturen`.

| # | Befund | Status |
|---|---|---|
| EA1 | **Mittel: Vereinsstrafe verfällt ungesehen.** Das Urteil kommt im Tageslauf ohne Halt, „Tag beenden“ springt bis zu sieben Tage, die Frist ist drei. Jetzt Meldung „Im Büro: …“ beim Urteil und Halt „Frist“ am letzten Tag. | ✅ behoben |
| EA2 | Ein zweites Urteil innerhalb der Frist löschte die erste Karte. Jetzt eine Liste (alte Spielstände mit einem Objekt werden umgewandelt), je Spieler eine Karte. | ✅ behoben |
| EA3 | Die Karte kam auch für eine Rote Karte bei einem anderen Verein (gekaufter Spieler mit laufendem Verfahren, Rückkehr von einer Leihe). Jetzt nur, wenn das Verfahren deinem Verein gehört. Text „wurde gesperrt“ statt „ist gesperrt“. | ✅ behoben |
| EA4 | **Mittel: Weiterverkaufsbeteiligung hing am Spieler, nicht am Käufer.** Nach einem ablösefreien Wechsel zahlte der nächste Verein, der nichts zugesagt hatte; ein eigener Rückkauf und Weiterverkauf ohne Klausel zahlte trotzdem; eine alte Klausel konnte überschrieben werden. Jetzt `p.wvb.von` = der Verein, der sie schuldet. Nur er zahlt, jeder andere Wechsel mit Ablöse beendet sie ohne Zahlung. Hat der Spieler schon eine Klausel, gibt es keine neue (der Knopf fehlt dann). | ✅ behoben |
| EA5 | Kaufte dein Verein den Spieler zurück, zahlte der Verkäufer dir 15 % deiner eigenen Ablöse. Jetzt endet sie beim Rückkauf ohne Zahlung. | ✅ behoben |
| EA6 | **Mittel: Teamprämie nicht in der Finanzprognose.** Gebucht unter „Prämien: Mannschaft“, das nicht in `RFP.finanzplan.laufend` steht. Jetzt unter „Prämien“ (in der Prognose). | ✅ behoben |
| EA7 | Nach einem Jobwechsel oder im Sommer hieß es „Für diese Saison festgelegt“, auch ohne Wahl bei diesem Verein, und „hoch“ wirkte bis zum 1. Juli auf die Stimmung. Jetzt eigener Text und Wirkung nur in der Saison. | ✅ behoben |

## EB. Prüfung von K07c, K20e, K08b, K08c und der Korrekturen EA ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 34b1633, 53d8da8, 956fc85, 72a06c1 und 5497208 gelesen (nichts ausgeführt). Kein blockierender Fehler, zwei mittlere. Ohne Befund: K07c (Wirkung `pause` prüft den Verein beim Entscheiden), K08b, die Korrekturen EA (Liste der Vereinsstrafen, Halt, Weiterverkauf: zahlt im Normalfall genau einmal), Gleichschritt (Abwerben nur ohne Automatik der Transfers, eigener Strom). Korrekturen auf `mitarbeit/popolupo-eb-korrekturen`.

| # | Befund | Status |
|---|---|---|
| EB1 | **Mittel: Abwerbeversuch erzeugte einen Gesprächswunsch auch unter der Automatik der Gespräche.** `wwHoeher` fragt die Automatik nicht. Wer die Transfers schon selbst führt, die Gespräche aber noch nicht, bekam Halt und Karte aus einem Bereich des Co-Trainers, und niemand sprach mit dem Spieler. Jetzt `kiAbwUnruhig`: auf Stufe 2 wie im Wochenlauf, unter der Automatik spricht der Co-Trainer. | ✅ behoben |
| EB2 | Ein Spieler auf Stufe 2 sprang durch einen Abwerbeversuch direkt zum offiziellen Wechselwunsch (Stufe 3). Jetzt nur Spieler bis Stufe 1. | ✅ behoben |
| EB3 | „Unverkäuflich machen“ rief `setUnverkaeuflich` auf: Spielerfenster über dem Büro, zweite Meldung und `versprechenAngebot`, das ein offenes Wechselversprechen brechen konnte. Jetzt setzt die Antwort den Status still selbst. | ✅ behoben |
| EB4 | Die Frist des Abwerbeversuchs hatte keinen Halt, ein zweiter aufgeflogener Versuch überschrieb den ersten. Jetzt Halt „Frist“ am letzten Tag, und solange eine Karte offen ist, macht ein neuer Versuch den Spieler nur unruhig, ohne neue Karte. | ✅ behoben |
| EB5 | **Mittel: Profivertrag aus der Karte am falschen Kaderdeckel.** `RS.kaderMax` (28, Deckel der Computer-Vereine) statt `RM.kaderMax` (36, dein Kader). Jetzt `RM.kaderMax` wie beim Aufrücken. | ✅ behoben |
| EB6 | Das gelockte Talent bekam beim neuen Verein kein `p.seit`/`p.abl` (galt dort als vereinsausgebildet), und der Verein wurde beim Entscheiden nicht auf `aktiv` geprüft. Jetzt beides. Den Kaderdeckel des Käufers prüft die Karte nicht (ein Talent mehr ist vertretbar). | ✅ behoben, Rest dokumentiert |
| EB7 | Profivertrag und Abgang aus der Karte wirken auch, wenn der Bereich `jugendkader` noch gesperrt ist. Entschieden (vorläufig): gewollt, das entspricht dem Aufrücken durch den Co-Trainer unter der Automatik. | dokumentiert |
| EB8 | Eine fremde, veraltete Klausel (Spieler ablösefrei geholt) verhinderte deine neue Weiterverkaufsbeteiligung. Jetzt blockiert nur eine Klausel, die deinen Verein bindet (oder eine alte ohne `von`). | ✅ behoben |

## EC. Prüfung von K06b, K18d, K18e, K07d, K29j und der Korrekturen EB ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 7a5808c, c35cbc9, 6b31038, 3f2e209, a9de4dc und a032948 gelesen (nichts ausgeführt). Kein blockierender und kein mittlerer Fehler. Ohne Befund: K29j, Namen, `${}`, Zahlen, alte Spielstände, keine neuen Würfel in geteilten Strömen, Gleichschritt, `kiAbwUnruhig` gleich dem Wochenlauf, `kiAbwFrist` für alte Spielstände. Korrekturen auf `mitarbeit/popolupo-ec-korrekturen`.

| # | Befund | Status |
|---|---|---|
| EC1 | „Durchschaut“ nahm den Lieblingsstil aus einem Verlauf, der das gerade gespielte Spiel schon enthielt, und kam auch, wenn der Gegner gar nicht reagiert hatte (schon nach dem ersten Spiel). Jetzt markiert `kiStil` seine Reaktion (`konter` im Ergebnis, ohne Würfel), und die Meldung kommt nur damit und nur, wenn sein Stil deinen schlägt. | ✅ behoben |
| EC2 | Der Aufschlag „Konkurrenz am Tisch“ galt auch nach einem Wechsel des Spielers zu einem anderen Verein. Jetzt nur beim Verein von damals (`kTisch.von`). Die Prüfung `!p` steht jetzt vor dem Zugriff. | ✅ behoben |
| EC3 | „Scout lag daneben“ kam auch ohne Scout (die Einschätzung war nur Grundwissen). Jetzt merkt sich der Kauf, ob ein Scout den Spieler gesehen hat; ohne Scout heißt es „Einschätzung lag daneben“. | ✅ behoben |
| EC4 | „Lernplatz frei“ konnte jede Woche kommen, obwohl niemand etwas lernen konnte (die Automatik der Lernplätze füllt sonst alle). Jetzt nur, wenn ein Spieler ohne Ziel ein Merkmal lernen oder umgeschult werden kann. | ✅ behoben |
| EC5 | „Unverkäuflich“ aus der Abwerbe-Karte umging ein offenes Wechselversprechen (EB3 hatte `versprechenAngebot` entfernt). Jetzt wieder mit `versprechenAngebot`, nur ohne Spielerfenster und zweite Meldung. | ✅ behoben |

## ED. Prüfung von K16c, K27c, K21c, K13b, K26e, K12c und der Korrekturen EC ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 4a991fb, e5a65f5, fc1bf59, 9d07188, 7f00d5f, ffa480a und 65c8e73 gelesen (nichts ausgeführt). Kein blockierender Fehler, zwei mittlere. Ohne Befund: K13b (Supercup, nicht in den 150 Tagen von 5a), `kiStil`/`sd.konter` (neues `sd` je Spiel, kein zusätzlicher Würfel), Dauerkarten bei gesenktem Preis, Namen, `${}`, alte Spielstände. Korrekturen auf `mitarbeit/popolupo-ed-korrekturen`.

| # | Befund | Status |
|---|---|---|
| ED1 | **Mittel: `preisRichtwert` konnte den Preis erhöhen.** Wer unter dem Richtpreis lag, bekam mit dem Zuschuss (Text „Die Ticketpreise sinken“) einen höheren Preis. Jetzt höchstens auf den Richtpreis, nie hinauf. | ✅ behoben |
| ED2 | **Mittel (Test): Die Markierung des Konters wurde nicht geprüft.** Der Test gab `konter` direkt vor. Jetzt ruft er `kiStil` mit sicherer Reaktion auf und prüft `sd.konter`. Das Kopieren in `r.taktik` in der Engine ist eine Zeile und bleibt ohne eigenen Test. | ✅ behoben, Rest dokumentiert |
| ED3 | Die Sperre von „Mitarbeiter abgeworben“ galt je Verein, nicht je Mitarbeiter (der Schlüssel kannte `stab` nicht). Jetzt ist der Mitarbeiter Teil des Schlüssels. | ✅ behoben |
| ED4 | `karteStab`: Pflichtrolle erst beim Entscheiden prüfen (sonst konnte der letzte Co-Trainer gehen), Ablöse höchstens das Konto des Vereins, „halten“ im Gehaltsrahmen (sonst geht er). | ✅ behoben |
| ED5 | „Übergewicht“ nahm die Kondition von heute statt des Tests (Altstar mit −20, nach dem Test Geheilte). Jetzt merkt sich `leistungstest` die Auffälligen (`S.lt`), nur sie kommen infrage. | ✅ behoben |
| ED6 | Späte Entscheidungen: „Provision zahlen“ zahlte auch für einen Spieler, der weg ist (jetzt Wirkung `provisionZahlen` mit Prüfung), „Zuschuss“ konnte ein neueres Projekt treffen (jetzt an `S.constr.ab` gebunden). | ✅ behoben |
| ED7 | Tests: K21c jetzt sicher im Gehaltsrahmen und mit `beraterBez`, K12c mit `S.lt`, K18d mit `kTisch.von` (EC2), K18e mit dem Weg ohne Scout (EC3). Weiter ohne eigenen Test: EC4, EC5, Urlaubsfoto positiv, `b0.stab` in K16c. | teils offen |

## EE. Prüfung von K13c, K29k, K17b, K22c, K03b und der Korrekturen ED ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat dcf771d, 4188cdc, 276ad82, 829e909, 5faa5fd, 3178f67 und 02f4cbf gelesen (nichts ausgeführt). Kein blockierender Fehler, zwei mittlere, beide in K17b.

**Ohne Befund:**

- K29k: `presseS()` legt `klima` auch in alten Spielständen an.
- K03b: `pause` und `selbstvertrauen` sind unabhängig.
- K13c: `winner()` mit Elfmeterschießen, Amateure über `tn`, eine Auslosung je Runde, auch bei geteilter Runde keine doppelte Meldung.
- ED: `karteStab` ohne Schleife, `S.lt` nach Saison, Verein und Tag geschützt, `S.constr.ab` ändert sich nie.
- Gleichschritt 5a: Die neuen Teile außerhalb der Karten schreiben nur Meldungen oder `S.lt`.

Korrekturen auf `mitarbeit/popolupo-ee-korrekturen` (auf K30c).

| # | Befund | Status |
|---|---|---|
| EE1 | **Mittel: „Hilfe in der Not“ umging die Lizenz der Leihen.** Die Wirkung `leihe` rief `ausleihen` direkt auf, Karten brauchen nur den Bereich `ereignisse` (Stufe 1), Leihen sind erst ab Stufe 3 frei. Jetzt prüft die Wirkung `frei('leihe')` wie `verpflichten` die Transfers („Die Leihen führt noch der Verein.“). Der Auslöser bleibt ohne Lizenzprüfung. | ✅ behoben |
| EE2 | **Mittel: Der Auslöser bot Spieler an, die die Leihe ablehnt, und die Beziehung +5 kam auch ohne Leihe.** Die Prüfungen von `ausleihen` stehen jetzt in `ausleihenGrund` (ohne Wirkung). Der Auslöser nimmt nur Spieler ohne Grund, nicht aus der Zweiten (`zwP`), und nur, wenn der Verleiher mehr als `kaderMin` Spieler behält (wie `kiLeihbar`). Neu im Katalog: `dann`, Folgewirkungen nur bei Erfolg (`KARTEN_MIT_ERFOLG`: `leihe`, `gehaltAnpassen`, `provisionZahlen`) mit dem Text `gut`. Die Beziehung +5 steht jetzt in `dann`. Der Test K17b prüft die Leihe, die +5 und den Fall mit Lizenz streng. | ✅ behoben |
| EE3 | Die Sperre von „Mitarbeiter abgeworben“ galt je Mitarbeiter **und** Verein. Ein anderer Verein konnte denselben Mitarbeiter gleich wieder abwerben. Jetzt ohne den Verein, wenn ein Mitarbeiter beteiligt ist. Sperren aus alten Spielständen (Schlüssel mit Verein) gelten einmal nicht mehr. | ✅ behoben |
| EE4 | „Pokal-Los des Jahres“ kam fast jede Saison schon in Runde 1 (dort ziehen alle Profis Amateure) und konnte sich wiederholen. Jetzt nicht in Runde 1 und höchstens einmal je Saison (`S.cup.losJahr`). Test K13c erweitert. | ✅ behoben |
| EE5 | „Berater droht“: „Nachgeben“ kostete nichts, wenn der Spieler schon das Marktgehalt bekam, und Beziehung und Stimmung kamen auch, wenn der Vorstand ablehnte. Jetzt nur unter dem Marktgehalt, und Beziehung und Stimmung kommen nur mit Erhöhung (`dann`), sonst nennt die Karte den Grund. Ebenso „Gehaltsneid“. Test K22c erweitert. | ✅ behoben |
| EE6 | „Provisionsstreit“: Die Beziehung +5 kam auch, wenn der Spieler weg war und nichts gezahlt wurde. Jetzt in `dann`. Test K21c erweitert. | ✅ behoben |

## EF. Prüfung von K30c, der Korrekturen EE, K30d und K10e ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 740c1b9, fd53169, 23a16ef und 365d5e6 gelesen (nichts ausgeführt). Kein blockierender Fehler, zwei mittlere.

**Ohne Befund:**

- `mitbieter`: gleiche Bedingung und Reihenfolge wie vorher in `konkurrenzKauf`.
- Gleichschritt: `kartenKette` nur mit Einträgen und im eigenen Strom, die Faktoren in `medizin.js` ohne Karten genau 1, gleich viele Würfel. `ausleihenGrund` wirkt wie vorher.
- Halt „Ereignis“ für Folgekarten.
- Wochenbudget: Die Wochen laufen von Donnerstag bis Mittwoch (`absTag` ab 1.1.1970). Eine Folgekarte 3 bis 7 Tage nach einem Montag liegt immer in der nächsten Woche.
- Keine Ketten über Saison, Entlassung oder Vereinswechsel hinweg.
- `else if`-Kette in `kartenWirkung` intakt, `erfolg` in allen Zweigen richtig.
- K30d ohne Befund.

Korrekturen auf `mitarbeit/popolupo-ef-korrekturen` (auf K14e).

| # | Befund | Status |
|---|---|---|
| EF1 | **Mittel: Nach dem Nachlass konnte das Gegenangebot über der eigenen Forderung liegen.** Die Schmerzgrenze rechnet mit der aktuellen Forderung, der Nachlass senkte nur `v.f`. Stieg die Forderung danach (zum Beispiel bekanntes Interesse aus einem Verhandlungsgerücht, das der Nachlass selbst auslöste), lag das Gegenangebot über dem Nachlass, und der Nachlass war weg. Jetzt ist das Gegenangebot in `kaufRunde` höchstens die aktuelle Forderung. Ein Nachlass allein zählt nicht mehr als Verhandlung für die Gerüchteküche (`v.nl`). Test K30c mit Gegenangebot unter bekanntem Interesse. | ✅ behoben |
| EF2 | **Mittel: Der Hygieneplan endete mit dem ersten neuen Kranken.** Jede neue Krankheit setzte die Ansteckung wieder, dann galt ×2 × 0,5 = 1. Jetzt gilt während des Plans sein Faktor statt der Ansteckung (`krankFaktor`). Test K10e mit einem neuen Kranken. | ✅ behoben |
| EF3 | Der Nachlass senkte keine schon vereinbarte Ablöse (`v.einig.fee`). Jetzt auch die. Test K30c. | ✅ behoben |
| EF4 | `dritterKauf` wirkte auch beim Vorvertrag, obwohl der Spieler erst in der nächsten Saison wechselt. Jetzt nicht beim Vorvertrag. Der Merker `p.ld3` fällt beim Saisonwechsel weg. | ✅ behoben |
| EF5 | Test K22c: Der Gehaltsrahmen konnte die Erhöhung ablehnen. Jetzt verdient der ganze Kader die Hälfte des Marktgehalts, wie in K21c. | ✅ behoben |
| EF6 | Test: Das Gegenangebot nach dem Nachlass war ungeprüft. Jetzt in K30c (EF1). | ✅ behoben |

## EG. Prüfung von K17d, K09d, K07e/K14d, K14e und der Korrekturen EF ohne Laufzeit (22. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat e2e0339, ad4674f, 27a273b, bced550 und 090e8ca gelesen (nichts ausgeführt). Kein blockierender Fehler, vier kleine.

**Ohne Befund:**

- **K09d:** `G.brisant` in `spielAufbau` für alle Wege des Spiels. Testspiele und Turniere tragen `test`. Auslands- und Amateurvereine sind nie brisant. Es gibt keinen neuen Würfel. Im Gleichschritt kann die Beziehung Verein–Verein in 150 Tagen nicht unter −50 sinken.
- **K07e/K14d:** Die Partynacht funktioniert auch mit leeren Beteiligten.
- **Korrekturen EF:** Die Deckelung in `kaufRunde` schadet außerhalb des Nachlasses nicht (schließen zum Preis `F` war schon vorher möglich). `krankFaktor`, `v.nl`, `p.ld3` und der Vorvertrag sind ohne Befund.
- **Insgesamt:** keine doppelten Namen, alte Spielstände sicher.

Korrekturen auf `mitarbeit/popolupo-eg-korrekturen` (auf K03c).

| # | Befund | Status |
|---|---|---|
| EG1 | Die Karte „Grüppchenbildung“ hatte zwei Lücken:<br>– Die Transferliste beachtete nicht, dass der Stab die Transfers führen kann. Er hätte die Liste wieder geräumt, die Strafen wären geblieben.<br>– Anführer konnte ein ausgeliehener Spieler oder einer mit vereinbartem Wechsel sein.<br>Jetzt lehnt die Karte mit Stab ab („Die Transfers führt der Stab“). Der Anführer ist nie ausgeliehen und hat keinen vereinbarten Wechsel. Für solche Spieler gibt es einen eigenen Text. | ✅ behoben |
| EG2 | Das Gerücht „Thema“ galt als eingetreten, wenn der Spieler zu irgendeinem Verein wechselte. Jetzt zählt nur ein Wechsel zum genannten Verein (auch vereinbart). | ✅ behoben |
| EG3 | Die Schwelle für Klatsch (−30) war gleich dem Grundwert eines Derbys. Ein einziges entschiedenes Derby hat den Klatsch eingeschaltet. Jetzt zählt die Beziehung ohne ihren Grundwert (vorläufig). | ✅ behoben |
| EG4 | Test K30c: Die Prüfung des Gegenangebots lief ohne Gegenangebot durch. Jetzt muss es eins geben. Außerdem steht in der README die Dauer von `beziehungen.js` mit 600 Spielen (unter 60 s). | ✅ behoben |

## EH. Prüfung von K29l, K30e, K11f, K16d, K03c und der Korrekturen EG ohne Laufzeit (23. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat b610d0d, d02df69, 9128d11, 1c1c14c, c91b512 und 1f513c3 gelesen (nichts ausgeführt). Kein blockierender und kein mittlerer Fund, drei kleine und eine Kleinigkeit.

**Ohne Befund:**

- K11f, K03c und die Korrekturen EG.
- Vergleiche mit dem Saisontag sind sicher:
  - Die Chronik prüft die Saison.
  - Testspiele und Turnier werden zum Saisonwechsel und beim Vereinswechsel geleert.
  - `p.mvl` prüft die Saison.
- `kampfansageRivale` funktioniert für alle Arten von Spielen.
- `zurueckrudern` verhindert Kult und Häme.
- Test K16d: Lizenz und Spieltag stimmen.
- Gleichschritt unverändert.

Korrekturen auf `mitarbeit/popolupo-eh-korrekturen` (auf K13d).

| # | Befund | Status |
|---|---|---|
| EH1 | Der Halt aus „Rückendeckung“ galt bis zu einem absoluten Tag, ohne Saison. In einem Jahr, in dem die Karte am letzten Montag kommt, hätte er am ersten Tag der neuen Saison das Vertrauen über die Strafe für das verfehlte Ziel gehoben. Jetzt gilt er nur in derselben Saison (`s`). Test K30e. | ✅ behoben |
| EH2 | Test K29l: Freiburg (Verein 6) spielt vor dem ersten Ligaspiel die Qualifikation zur Conference League. Die Prüfung „zu früh“ lief über dieses Spiel und nicht über den Abstand. Jetzt nimmt der Test ein Ligaspiel ohne eigenes Spiel in den 8 Tagen davor. | ✅ behoben |
| EH3 | Info-Karten mit Wirkung fielen über der Info-Grenze der Meldungsdichte ganz weg, mit ihrer Wirkung. So hätte eine Anzeige-Einstellung den Spielstand geändert (gegen K30 §5.1 und DY8). Jetzt wirkt die Karte trotzdem, nur die Meldung entfällt. Test K30e. | ✅ behoben |
| EH4 | `p.spritzeWarn` merkte den Saisontag, in einer späteren Saison am selben Tag wäre die Warnung ausgefallen. Jetzt der absolute Tag. | ✅ behoben |

## EI. Prüfung von K07f, K21d, K21e, K13d und der Korrekturen EH ohne Laufzeit (23. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 1a73ead, 76c57cc, 8c35b79, dae3c5c und 3a436fc gelesen (nichts ausgeführt). Kein blockierender Fehler, ein mittlerer.

**Ohne Befund:**

- **K07f:** Vorlagen nur über `vorlageDef`, Name überall maskiert, Vorbereitung wie bei den festen Vorlagen.
- **Korrekturen EH:** Eine stumme Karte setzt Sperre und Variante, verbraucht aber keine Info.
- **Gleichschritt:** unberührt.
- **Lizenztest:** findet den neuen Bereich `verlegung`.

Korrekturen auf `mitarbeit/popolupo-ei-korrekturen-b` (auf K25e). Davor steht auf `mitarbeit/popolupo-ei-korrekturen` nur der Doku-Abgleich.

| # | Befund | Status |
|---|---|---|
| EI1 | **Mittel: Pokal-, Aufstiegs- und Klassenerhaltsprämie liefen als „Prämien“ in die Prognose.** Die Prognose rechnet „Prämien“ als laufende Kosten (`RFP.laufend`). Drei gewonnene Pokalrunden hätten den Saldo je Spiel um etwa 73.000 € gedrückt und die Lizenzprüfung um Millionen zu schlecht gerechnet. Jetzt sind sie einmalig gebucht („Sonderprämien“). Die Siegprämie der Liga bleibt laufend. | ✅ behoben |
| EI2 | K21e prüft Auf- und Abstieg vor den Regeln für zweite Mannschaften. Eine zweite Mannschaft, die du als Trainer führst, bekam die Prämie. Jetzt nie für zweite Mannschaften. Ein Verein, der wegen einer zweiten Mannschaft doch drinbleibt, bekommt vorläufig keine Klassenerhaltsprämie. | ✅ behoben, Rest vorläufig |
| EI3 | K13d: Der neue Termin konnte nach dem nächsten Ligaspiel liegen, etwa bei Vereinen im Europapokal. Danach hätten Gelbsperren-Hinweis und Saisonstart das falsche Spiel genommen. Jetzt liegt er vor dem nächsten Ligaspiel beider Vereine, mit drei Tagen Abstand. | ✅ behoben |
| EI4 | K13d: Kam vorher ein Pokal- oder Europapokalspiel, war das Ligaspiel nie verlegbar. Jetzt sucht die Lage das nächste Ligaspiel in den 7 Tagen. Der neue Termin hält drei Tage Abstand zu deinen Testspielen. | ✅ behoben |
| EI5 | Test K13d: Der zweite Antrag galt bei jeder Ablehnung als richtig. Jetzt muss der Grund „schon eine Verlegung“ sein. | ✅ behoben |

## EJ. Prüfung von K30f, dem Doku-Abgleich, K27d, K25e und der Korrekturen EI ohne Laufzeit (23. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 4c5af2a, 5cedb2c, 6b57f75, ef4195a und 63acbe0 gelesen (nichts ausgeführt, zweiter Anlauf nach einem Netzwerkfehler). Kein blockierender Fehler, ein mittlerer.

**Ohne Befund:**

- **K27d:** Kennungen der Vereine sind die Indizes von `VEREINE`, `t.sh` ist das Kürzel. Zweite Mannschaften und Regionalliga ohne Jubiläum.
- **Korrekturen EI:** „Sonderprämien“ stehen in Finanzansicht, Vorstand und Saisonbilanz, nicht in der Prognose. Die Grenze `weiter` stimmt. K13d findet für Freiburg den Mittwoch 2. September.
- **K25e:** gleich viele Würfel, Fall 1 hält für Freiburg.
- **Gleichschritt:** unberührt.

Korrekturen auf `mitarbeit/popolupo-ej-korrekturen` (auf den Korrekturen EK).

| # | Befund | Status |
|---|---|---|
| EJ1 | **Mittel: Die Transferliste aus dem Wettskandal hielt nur eine Woche.** `kiListe` räumt montags alle, die nicht im Abgabeplan stehen. Computer-Käufer nahmen ihn ohnehin nicht. Jetzt gibt es nur die Sperre, die Texte sprechen nicht mehr von der Transferliste. | ✅ behoben |
| EJ2 | Der Skandal konnte einen Spieler deines Kaders treffen, der in der zweiten Mannschaft spielt (`zwP`, eigener Verein in der 3. Liga). Jetzt nie. Test K30f. | ✅ behoben |
| EJ3 | Der Doku-Abgleich zu K05 Nr. 16 war falsch: Gemeint ist das Zuschauen vorher, gebaut ist nur der Endstand. Berichtigt, dazu der Hinweis auf die Live-Ansicht. | ✅ behoben |
| EJ4 | Nach dem Gründungsjahr wären Hoffenheim (1899) und Leverkusen (1904) Traditionsvereine. In der Fankultur gelten sie als Gegenbeispiele. Jetzt `tradition:false` in `VEREINE` (vorläufig). Test K25e. Seit K25f überholt: Fankultur aus Stadion, Mitgliedern und Zugkraft statt Gründungsjahr, `tradition:false` entfernt. | ✅ behoben, vorläufig |
| EJ5 | Test K13d konnte EI3 und EI4 nicht vom alten Code unterscheiden. Jetzt prüft er den Termin vor dem nächsten eigenen Ligaspiel und den Abstand zu einem Testspiel. Hinweis zum Entwurf: In einer normalen Woche bleiben nur Dienstag und Mittwoch, mit Spielen unter der Woche gibt es oft keinen Ersatztermin. Das bleibt so, bis die Reihenfolge der Spieltage nach Datum gilt. | ✅ behoben, 📌 Entwurf |

## EK. Prüfung von K05c, K05d, K06c/K09e und K06d ohne Laufzeit (23. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 066a25b, f74e03d, 50542cb und c1ef342 gelesen (nichts ausgeführt). Kein blockierender Fehler, zwei mittlere. Prüfung EJ (K30f bis zu den Korrekturen EI) war am 23.11. an einem Netzwerkfehler abgebrochen und läuft neu.

**Ohne Befund:**

- Testspiele kommen nie bei `out.mine` an.
- Die eigene Seite stimmt auswärts und im Finale.
- `r.taktik` gibt es auch im Live-Spiel.
- Die Richtung des Kreislaufs beim Coup stimmt.
- `xpo` hat die Positionscodes, die `eignung` erwartet.
- Gleichschritt unberührt. `ausId` steht in beiden verglichenen Läufen.
- Alte Spielstände sind sicher.

Korrekturen auf `mitarbeit/popolupo-ek-korrekturen` (auf K06d).

| # | Befund | Status |
|---|---|---|
| EK1 | **Mittel: Verletzte zählten als früh ausgewechselt.** Der Co-Trainer nimmt Verletzte sofort vom Platz, „Handschlag verweigert“ hätte dann von einer Diva erzählt, die verletzt ging. Jetzt zählen Verletzte (`r.inj`) nicht. | ✅ behoben |
| EK2 | **Mittel: Spiele unter der Woche gingen verloren.** Der Merker hielt nur das letzte Spiel, die Karten prüfen montags. Das Ligaspiel am Wochenende überschrieb Pokal- und Europapokalspiele. Jetzt hält `S.letzte` die Spiele der letzten 7 Tage (höchstens 4), die Auslöser schauen in alle. | ✅ behoben |
| EK3 | Der Merker überlebte einen Vereinswechsel. Jetzt trägt er deinen Verein (`t`) und gilt nur für ihn. | ✅ behoben |
| EK4 | Jedes Tor der Verlängerung galt als „spät“. Jetzt ab Minute 88 bis 90 oder ab Minute 118. | ✅ behoben |
| EK5 | Bei Hin- und Rückspiel sagt das einzelne Spiel nichts über das Weiterkommen. Last-Minute-Drama jetzt vorläufig nicht in Relegation und Europapokal. | ✅ behoben, vorläufig |
| EK6 | Der Taktik-Coup zählte auch einen Stil, den der Co-Trainer gewählt hatte. Jetzt nur ohne Automatik des Stils. | ✅ behoben |
| EK7 | Der Zähler `p.pfal` veraltete und zählte auch Kurzeinsätze. Jetzt erst ab der Mindestzeit für eine Note. Ein Zähler älter als 28 Tage beginnt neu (`p.pfalT`), die Karte verlangt einen frischen Zähler. Nicht behoben: Bei einer Kette von Wechseln (A für B, dann B für C) bekommt A in `xpo` die Position „ZM“ (vorhandener Fehler in der Engine). Die Korrektur verschiebt die Anteile in `xpo` für alle Vereine und gehört zu einem Schritt mit Testlauf. | teils, 📌 Engine nach Testlauf |

## EL. Prüfung der Korrekturen EK und EJ ohne Laufzeit (23. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat ba1811d und 994a64c gelesen (nichts ausgeführt). Kein Fehler in der Spiellogik. Ein mittlerer Fund in einem Test, drei niedrige.

**Ohne Befund (im Code nachgeprüft):**

- **EK1 bis EK5:** Jeder Test würde mit dem alten Code scheitern.
- **EK2:** Die Karten prüfen vor den Spielen des Tages, jedes Spiel zählt genau einmal.
- **EK6, EK7:** Der Bereich `stil` existiert. `xpo[3]` sind die Minuten.
- **EJ1 bis EJ4:** stimmen, auch der Index von `S.teams` gleich `VEREINE`.
- **Gleichschritt und Projektregeln:** unberührt.

Korrekturen auf `mitarbeit/popolupo-el-korrekturen` (auf K25f).

| # | Befund | Status |
|---|---|---|
| EL1 | **Mittel: Der Test K13d unterschied EI3 immer noch nicht vom alten Code.** Findet der neue Code einen Tag, findet der alte denselben. Jetzt rückt der Test das nächste eigene Ligaspiel auf drei Tage plus einen nach dem alten Termin und erwartet „kein Ersatztermin“. Neu geprüft wird auch die Lage aus EI4: Ein Supercup am Vortag versperrt das Ligaspiel nicht mehr. | ✅ behoben |
| EL2 | K06 §8 nannte die Bedingungen aus EK6 (nur ohne Stil-Automatik) und EK7 (ab 20 Minuten, Verfall nach 28 Tagen) nicht. Ergänzt. | ✅ behoben |
| EL3 | Kommentare nannten noch `S.letzt` statt `S.letzte` und beim Wettskandal noch die Transferliste. Der Rückfall auf `S.letzt` aus alten Spielständen griff wegen des Filters auf den Verein nie und ist gestrichen. In der laufenden Woche fehlen dann die Spielkarten, harmlos. | ✅ behoben |
| EL4 | Testlücken: EK6 (Stil-Automatik) und die 28-Tage-Grenze aus EK7 waren ungetestet, `tests/README.md` nannte den Fall EK nicht. Neuer Fall EL in `tests/karten.js`, README ergänzt. | ✅ behoben |

## EM. Prüfung von K25f und der Korrekturen EL ohne Laufzeit (23. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 524411c und bda526c gelesen (nichts ausgeführt). Ein hoher Fund, ein Syntaxfehler im Test, dazu zwei niedrige.

**Ohne Befund:**

- **Formel gegen K25 §5.6:** Bereiche, Gewichte, Ligaschnitt ohne zweite Mannschaften und Rundung stimmen.
- **Tabelle in §5.6:** Alle Werte und Aussagen sind von Hand nachgerechnet.
- **Würfel und Gleichschritt:** Die Zahl der Würfe bleibt gleich, der Gleichschritt ist unberührt.
- **Randfälle:** Plätze 0, Ligaschnitt 0 und alte Spielstände sind abgesichert.
- **Reste:** Keine Reste von `traditionsverein` oder `tradition:false` im Code.
- **Korrekturen EL:** Die Tests unterscheiden jetzt wirklich vom alten Code, die Kommentare stimmen.

Korrekturen auf `mitarbeit/popolupo-em-korrekturen` (auf den Korrekturen EL).

| # | Befund | Status |
|---|---|---|
| EM1 | **Hoch: Syntaxfehler in `tests/marketing.js`.** Fall 1 deklarierte `w` zweimal im selben Block (Wirkung und zweite Welt), Node hätte die ganze Datei abgelehnt. Die Wirkung heißt jetzt `wk`. | ✅ behoben |
| EM2 | An der Grenze „ausverkauft“ (97 %) sprang die Fankultur hart: Freiburg (96,5 %) mit 170 Fans mehr von 69 auf 78. Die Karte zeigte gerundet „97 %“, obwohl die Grenze nicht erreicht war. Jetzt steigt die Untergrenze der Zugkraft stufenlos von 93 % bis 97 % (`ausverkauft:[0.93,0.97]`). Die Karte rundet ab und schreibt ab 97 % „ausverkauft“. Neue Werte: Freiburg 75, Heidenheim 59, Kiel 56, Osnabrück 46 (vorher 69, 42, 43, 42), die übrigen unverändert. | ✅ behoben, vorläufig |
| EM3 | Die Schwelle 0,5 für die Meldung „Kurve“ stand als Zahl im Code. Jetzt `RMK.fankultur.kurve`. | ✅ behoben |

## EN. Prüfung der Korrekturen EM und von K27e ohne Laufzeit (23. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat db519e4 und b07996e gelesen, nichts ausgeführt. Die Fankultur hat er mit einem eigenen Perl-Skript nachgerechnet. Kein Fehler in der Spiellogik, fünf niedrige Funde.

**Ohne Befund:**

- **Werte nach EM2 stimmen:** Freiburg 75 (Abwerben −5,5), Heidenheim 59, Kiel 56, Osnabrück 46, alle anderen unverändert.
- **`daten/regeln.js`:** Kein Kommentar schluckt Code.
- **K27e:** gerechnet beim Ziel, das Gedächtnis bleibt unverändert, Grenzen nach der Multiplikation.
- **Tests:** Die neuen Tests scheitern mit dem alten Code.
- **Gleichschritt:** unberührt.

Korrekturen auf `mitarbeit/popolupo-en-korrekturen` (auf K26f).

| # | Befund | Status |
|---|---|---|
| EN1 | Im Marketing-Kasten fehlte seit EM2 das Leerzeichen nach dem Komma („der Plätze,2,3 Mitglieder“). | ✅ behoben |
| EN2 | Die stufenlose Grenze aus EM2 war ungetestet. Fall K25f prüft jetzt Freiburg zwischen 72 und 77 und dass 170 Fans mehr höchstens 4 Punkte ändern, mit harter Grenze waren es 9. | ✅ behoben |
| EN3 | Der Fall K27e nahm Union, das genau auf 80 liegt (roh 79,96). Jetzt Dortmund (100). | ✅ behoben |
| EN4 | **Schon seit U16:** Anlässe der Fanstimmung verblassten nie ganz (Rundung auf eine Stelle blieb bei −0,4 oder 0,5 hängen). Mit K27e stand dann der Faktor der Fankultur für immer in der Anzeige. Jetzt geht ein Anlass bis ±0,5 auf 0 (`RFS.anlassMin`). Getestet in Fall K27e. | ✅ behoben |
| EN5 | K27 §5.4b sagte, die Fanstimmung der Computer-Vereine wirke nirgends. Seit K23b/K23c wirkt sie auf ihre Heimeinnahmen, seit U12i auf die Präsidentenwahl. K20 §5.3 nannte K27e nicht. Beides berichtigt. | ✅ behoben |

## EO. Prüfung von K06e, K15e, K26f und der Korrekturen EN ohne Laufzeit (23. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat 9e16a38, 6294b81, 4bd2343 und 7ae50b5 gelesen (nichts ausgeführt). Kein hoher oder mittlerer Fund, sieben niedrige.

**Ohne Befund (im Code nachgeprüft):**

- **Tore in der Engine:** `art` ist `ecke`, `freistossFlanke`, `freistoss`, `elfmeter` oder der Schusstyp. Eigentore gibt es nicht, das Elfmeterschießen zählt nicht.
- **Zählung K06e:** Nur Ligaspiele haben `r.lg`, auch live. Die Halbserie wechselt nach Spiel 17 (bei 34 Spieltagen). Jobwechsel, neue Saison und alte Spielstände sind abgedeckt.
- **Klage K26f:**
  - `ab` bleibt die Kennung des Projekts.
  - Alle Leser von `ab` und `bis` rechnen die Klage mit.
  - Der Vereinswechsel räumt die Baustelle.
- **`fanVerblasst`:** gleich für alle Vereine. Die Fälle 3, 5 und 10 halten.
- **Gleichschritt:** unberührt.
- **Tests:** Alle neuen Tests scheitern mit dem alten Code.

Korrekturen auf `mitarbeit/popolupo-eo-korrekturen` (auf K19e).

| # | Befund | Status |
|---|---|---|
| EO1 | In K33 stand „VerzÃ¶gerung“, ein Kodierungsfehler aus einem Perl-Einzeiler. | ✅ behoben |
| EO2 | Die Schwelle „mindestens eine Woche Genehmigung übrig“ stand als 7 im Code. Jetzt `REGELN.karten.stadion.anwohnerRest`. | ✅ behoben |
| EO3 | „Streit nach Kritik“ erkannte die Kritik nur am Datum. Kritik ohne Streit und danach Streit nach Lob am selben Tag hätte die Karte ausgelöst. Jetzt merkt das Gespräch das Thema des Streits (`p.streitT`). Test K15e. | ✅ behoben |
| EO4 | „Lärmschutz bezahlen“ änderte am Bau nichts. Beim Baubeginn konnten trotzdem Auflagen für Lärmschutz kommen, man hätte doppelt bezahlt. Zudem zahlte die Automatik ungefragt. Jetzt entfallen die Auflagen (`bauAuflage`), und die Automatik lässt es auf die Klage ankommen. Test K26f. | ✅ behoben |
| EO5 | Test K06e prüfte nur den Faktor, nicht die Wirkung im Spiel. Jetzt prüft er `stdF` in `spielAnlegen`: dein Verein 0,95, der Gegner 1. | ✅ behoben |
| EO6 | In `letztesSpielMerken` stand der K06e-Block zwischen dem Kommentar zu K06d und dessen Code. Umgestellt. | ✅ behoben |
| EO7 | Die Feldliste von `S.constr` in `stadion.js` nannte `zuschuss` und `klage` nicht. Die README nannte die Freiburg-Prüfung aus EN2 nicht. Beides ergänzt. | ✅ behoben |

## EP. Prüfung von K16e, K19e und der Korrekturen EO ohne Laufzeit (23. November 2026, popolupo, Prüf-Agent nur lesend)

Ein Agent hat b957f3b, 2ddcb86 und ba0974c gelesen, nichts ausgeführt. Kein hoher Fund, zwei mittlere, vier niedrige.

**Ohne Befund:**

- **Saisonzählung K16e:** `stabExSpieler` läuft vor `S.season++`. Damit passt „seit höchstens einer Saison“.
- **`statSumme().ver`:** ohne Zufall.
- **K19e:** Alle Aufrufer von `wechselInteresse` gehören nur zu deinem Verein. Computer- und Automatik-Käufe nutzen es nicht.
- **Gleichschritt:** In 5a ist niemand 60 Spiele beim Verein.
- **`spielAnlegen`:** gibt `G.Ss` zurück, `stdF` wird beim Anlegen gesetzt.
- **EO-Korrekturen:** stimmen.

Korrekturen auf `mitarbeit/popolupo-ep-korrekturen` (auf K18f).

| # | Befund | Status |
|---|---|---|
| EP1 | **Mittel: „Ihn in den Stab holen“ prüfte die Lernstufe nicht.** Der Bereich `stab` ist erst ab Stufe 3 frei, Karten kommen ab Stufe 1. Jetzt stellt die Wirkung nur ein, wenn der Bereich frei und nicht in der Automatik ist. Eingestellt wird über `stabAnstellen`, das auch das Einstellen von Hand nutzt. Der Vertrag steht als `einstellenJahre` in den Regeln. Ist der Ex-Spieler inzwischen woanders angestellt, sagt die Meldung das jetzt richtig. Test K16e. | ✅ behoben |
| EP2 | **Mittel: Rückkehr aus der eigenen Leihe galt als Heimkehr.** `leiheEnde` ruft `neuzugang` auch für deinen verliehenen Spieler auf. Ein Stammspieler mit 60 Spielen brachte nach der Leihe „… kehrt zurück!“ und Fans +2. Jetzt übergibt `leiheEnde` `ausLeihe`, dann keine Heimkehr. Neuer Fall in `tests/leihe.js`. | ✅ behoben |
| EP3 | Im Test K16e war die Rolle nach dem Einstellen voll. Die Sperre über `gefragt` wurde deshalb nie wirklich geprüft. Jetzt wird der Platz vorher wieder frei. | ✅ behoben |
| EP4 | Im Test K26f stand `erlassen` nicht in der Meldung. Ergänzt. | ✅ behoben |
| EP5 | K19 und `vertraege.js` sprachen von einer „Karriere vor dem Spielstand“, die gibt es nicht. Gezählt wird ab Spielbeginn. Dazu nennt K19 jetzt `spielerLehntAb`, und der Kommentar zu `gespraech` in den Regeln nennt `p.streitT`. | ✅ behoben |
| EP6 | `heimkehrAb` und `exSpieler.vereinAb` waren Kopien der 60 Spiele des Publikumslieblings. Jetzt gilt `fanstimmung.ident.lieblingSpiele` direkt. Die 1 Saison der Karte steht als `kapitaenSaisons` in den Regeln. | ✅ behoben |
