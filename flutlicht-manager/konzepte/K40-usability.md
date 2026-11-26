# K40 – Usability-Tests

Status: **Entwurf** (20. November 2026), geschrieben ohne Rücksprache. Grundlage ist der Vorschlag in PLAN §4 („K39 Artwork und K40 Usability-Tests“, 18.11.). Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K35a (Oberfläche, Kontrast), K36 (Lernstufen) · Wird gebraucht von: allen Schritten mit Oberfläche.

## 1. Ziel

- **Früh und klein automatisch prüfen,** was Maschinen finden können: fehlende Beschriftungen, zu wenig Kontrast, falsche Rollen, Bedienung ohne Maus.
- **Später mit Menschen,** was Maschinen nicht finden: Verstehen die Leute, was sie tun sollen? Siehe PLAN §4, hier nicht weiter ausgeführt.

## 2. Vorbilder und Quellen

- **axe-core** von Deque: Regeln für Barrierefreiheit, je Regel mit einer Kennung für WCAG-Version und -Stufe (zum Beispiel `wcag2a`, `wcag2aa`) oder `best-practice`. Aufruf über `axe.run` mit `runOnly` und den Kennungen, Ergebnis als Liste von Verstößen (Quelle unten).
- **Playwright:** Die Browser-Tests gibt es schon (`tests/ui-zwei-saisons.js`, `tests/ui-lernstufen.js`).

## 5. Regeln

### 5.1 UX1: automatische Prüfungen (20. November 2026, ohne Testlauf)

Neues Testskript `tests/ui-zugang.js`, läuft wie die anderen Browser-Tests einzeln.

**Barrierefreiheit (axe-core):**

- Startbildschirm, dann jede Ansicht (die zwölf Reiter), die Spielerkarte und das Menü.
- Regeln mit den Kennungen `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`.
- Verstöße mit der Schwere „serious“ oder „critical“ zählen als Problem. „moderate“ und „minor“ werden nur ausgegeben.
- Fehlt axe-core auf dem Rechner, sagt das Skript das und prüft nur die Tastatur. Installieren: `npm i axe-core` im Ordner `flutlicht-manager` oder global.

**Tastatur:**

- „Tag beenden“ ist mit der Tab-Taste erreichbar (höchstens 80 Schritte) und mit Enter auslösbar: Der Tag geht weiter.
- Jedes Element, das den Fokus bekommt, ist sichtbar (hat eine Größe) und ist kein `div` ohne Rolle.
- Ein Fenster (Spielerkarte, Menü) bekommt beim Öffnen den Fokus, Escape schließt es.

**Handy-Breite** prüfen die bestehenden Browser-Tests schon.

### 5.2 Änderung am Spiel für UX1

- **Escape schließt ein Fenster,** wenn es einen Schließen-Knopf hat. Fenster ohne Schließen-Knopf verlangen eine Entscheidung (Entlassung, Saisonbilanz) und bleiben offen.
- **Fokus beim Öffnen:** auf den Schließen-Knopf, sonst auf das Fenster selbst. So landet ein versehentliches Enter nicht auf der ersten Option (zum Beispiel einem Jobangebot).

## 10. Zielwerte

| Prüfung | Ziel |
|---|---|
| axe-core | keine Verstöße „serious“ oder „critical“ |
| Tastatur | „Tag beenden“ erreichbar und auslösbar, Fenster mit Escape zu |

Beim ersten Lauf sind Verstöße zu erwarten (zum Beispiel Kontraste). Sie kommen nach `konzepte/_usability.md`, dann wird abgearbeitet.

## 11. Runde mit Menschen: Leitfaden (W5g, 26.11., vorläufig)

Für die Runde nach Welle 5 (PLAN §4). Durchführen kann sie jede und jeder, ohne Vorwissen. Ergebnisse nach `konzepte/_usability.md`.

### 11.1 Rahmen

- **Personen:** fünf je Runde, die das Spiel noch nicht kennen. Mindestens zwei, die selten Manager-Spiele spielen. Lieber zwei kleine Runden mit Verbesserungen dazwischen als eine große (§ PLAN 4: Fünfergruppen finden je nach Studie 55 bis 99 % der Probleme).
- **Dauer:** 30 bis 45 Minuten je Person: 5 Minuten Einführung, 25 bis 30 Minuten Aufgaben, 5 Minuten Fragebogen, 5 Minuten Gespräch.
- **Gerät:** ein Rechner mit aktuellem Browser, das Spiel frisch geladen (eigenes Browserprofil oder privates Fenster, damit kein alter Spielstand stört). Ton an. Wenn möglich eine Runde auch am Handy.
- **Rollen:** eine Person leitet und schweigt, eine schreibt mit (oder Bildschirmaufnahme mit Einverständnis).

### 11.2 Einführung (zum Vorlesen)

> Wir testen nicht dich, sondern das Spiel. Wenn etwas nicht klappt, liegt es am Spiel, und genau das wollen wir finden. Sag bitte laut, was du denkst: was du suchst, was du erwartest, was dich wundert. Ich helfe dir nicht, außer du kommst gar nicht weiter. Du kannst jederzeit aufhören.

### 11.3 Aufgaben

Jede Aufgabe vorlesen und als Zettel hinlegen. Die Leitung hilft erst, wenn die Person drei Minuten nicht weiterkommt, und dann nur mit einem Hinweis, wo sie schauen könnte.

| Nr. | Aufgabe (so vorlesen) | Geschafft, wenn |
|---|---|---|
| 1 | Starte ein neues Spiel mit einem Verein deiner Wahl auf der Stufe „Normal“. | Das Büro des Vereins ist zu sehen. |
| 2 | Finde heraus, wie viel Geld dein Verein gerade hat und ob er in dieser Saison eher Gewinn oder Verlust macht. | Sie nennt Kontostand und Tendenz. |
| 3 | Setz einen Spieler, der nicht in der Startelf steht, für das nächste Spiel in die Startelf. | Die Aufstellung ist geändert. |
| 4 | Spiel bis zum nächsten Ligaspiel weiter und schau es live an. Sag in der Halbzeit etwas zur Mannschaft. | Eine Halbzeitansprache ist gewählt. |
| 5 | Such einen Spieler für den Angriff, den du dir leisten kannst, und mach ein Angebot. | Ein Angebot ist abgegeben (Ablehnung zählt auch). |
| 6 | Stell das Spiel auf das helle Aussehen um und mach den Ton leiser. | Helles Thema an, Lautstärke geändert. |
| 7 | Spiel weiter, bis eine Ereigniskarte kommt, und entscheide sie. | Eine Karte ist entschieden. |

### 11.4 Beobachtungsbogen (je Person und Aufgabe)

| Person | Aufgabe | geschafft (ohne Hilfe / mit Hinweis / nicht) | Zeit in Minuten | Fehlversuche | Was sie gesucht oder erwartet hat (Zitat) |
|---|---|---|---|---|---|
| P1 | 1 | | | | |

Ein Fehlversuch ist ein Klick oder Weg, den die Person selbst zurücknimmt oder der nicht zum Ziel führt.

### 11.5 Fragebogen SUS (System Usability Scale)

Nach den Aufgaben, ohne Gespräch dazwischen. Jede Aussage von 1 (stimme gar nicht zu) bis 5 (stimme voll zu). Eigene deutsche Fassung der zehn Aussagen nach Brooke (1996):

1. Ich würde dieses Spiel gern öfter spielen.
2. Ich fand das Spiel unnötig kompliziert.
3. Ich fand das Spiel leicht zu bedienen.
4. Ich glaube, ich bräuchte Hilfe von jemandem, der sich auskennt, um das Spiel zu bedienen.
5. Ich fand, die verschiedenen Teile des Spiels passen gut zusammen.
6. Ich fand, im Spiel passt zu vieles nicht zusammen.
7. Ich glaube, die meisten Leute lernen sehr schnell, das Spiel zu bedienen.
8. Ich fand die Bedienung sehr umständlich.
9. Ich fühlte mich bei der Bedienung sicher.
10. Ich musste viel lernen, bevor ich mit dem Spiel zurechtkam.

**Auswertung:** Bei den ungeraden Aussagen (1, 3, 5, 7, 9) zählt Antwort − 1, bei den geraden (2, 4, 6, 8, 10) 5 − Antwort. Die Summe mal 2,5 ergibt den Wert von 0 bis 100. Ein Wert um 68 gilt verbreitet als Durchschnitt (PLAN §4: Originalquelle nicht gefunden). Ziel für das Spiel (vorläufig): im Schnitt mindestens 70.

### 11.6 Gespräch danach (5 Minuten)

- Was war am schwersten? Wo warst du unsicher?
- Wirkt das Spiel freundlich und vertraut oder eher wie eine Tabelle?
- Welche Kachel im Büro hast du zuerst angeschaut, und warum?
- Ist die Schrift gut lesbar? Wie fandest du den Ton (Pfiffe, Menge im Stadion)?
- Was würdest du als Erstes ändern?

### 11.7 Auswertung

- Je Aufgabe: Anteil geschafft ohne Hilfe, mittlere Zeit, häufigste Fehlversuche.
- Probleme sammeln, die bei mindestens zwei Personen auftraten, mit Schwere: **hoch** (Aufgabe nicht geschafft), **mittel** (nur mit Hinweis oder viele Fehlversuche), **niedrig** (Zögern, Verwunderung).
- Alles kommt nach `konzepte/_usability.md`. Die Probleme kommen dazu in die Konsistenzprüfung und werden wie Funde abgearbeitet. Danach eine zweite kleine Runde.
- **Datenschutz:** keine Namen, nur P1 bis P5. Aufnahmen nur mit Einverständnis und nach der Auswertung löschen.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache, 20.11.):

1. **Eigenes Skript statt Einbau in `ui-zwei-saisons.js`:** kurz, schnell und unabhängig von den langen Spielläufen.
2. **Nur „serious“ und „critical“ als Problem.** Die übrigen Funde werden ausgegeben, damit der erste Lauf nicht an Kleinigkeiten hängt.
3. **axe-core wird nicht mitgeliefert.** Es kommt aus der Installation dessen, der die Tests laufen lässt, so wie Playwright.

**Nicht nachgeprüft:** Ob der Node-Baustein `axe-core` den Quelltext als `axe.source` anbietet und die Verstöße das Feld `impact` tragen, entspricht meinem Kenntnisstand, die Dokumentation habe ich dazu nicht gelesen. Das Skript prüft beides und meldet, wenn es fehlt.

## Quellen

- Vorschlag K40 und Zeitpunkt UX1: PLAN §4 („K39 Artwork und K40 Usability-Tests“, 18.11.)
- axe-core, `axe.run`, `runOnly` mit Kennungen wie `wcag2a` und `wcag2aa`: Deque, „Axe API documentation“, abgerufen am 20.11.2026 (https://www.deque.com/axe/core-documentation/api-documentation), dazu die Übersicht zu `@axe-core/playwright` (https://www.npmjs.com/package/@axe-core/playwright)
