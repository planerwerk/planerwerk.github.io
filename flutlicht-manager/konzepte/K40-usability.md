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

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache, 20.11.):

1. **Eigenes Skript statt Einbau in `ui-zwei-saisons.js`:** kurz, schnell und unabhängig von den langen Spielläufen.
2. **Nur „serious“ und „critical“ als Problem.** Die übrigen Funde werden ausgegeben, damit der erste Lauf nicht an Kleinigkeiten hängt.
3. **axe-core wird nicht mitgeliefert.** Es kommt aus der Installation dessen, der die Tests laufen lässt, so wie Playwright.

**Nicht nachgeprüft:** Ob der Node-Baustein `axe-core` den Quelltext als `axe.source` anbietet und die Verstöße das Feld `impact` tragen, entspricht meinem Kenntnisstand, die Dokumentation habe ich dazu nicht gelesen. Das Skript prüft beides und meldet, wenn es fehlt.

## Quellen

- Vorschlag K40 und Zeitpunkt UX1: PLAN §4 („K39 Artwork und K40 Usability-Tests“, 18.11.)
- axe-core, `axe.run`, `runOnly` mit Kennungen wie `wcag2a` und `wcag2aa`: Deque, „Axe API documentation“, abgerufen am 20.11.2026 (https://www.deque.com/axe/core-documentation/api-documentation), dazu die Übersicht zu `@axe-core/playwright` (https://www.npmjs.com/package/@axe-core/playwright)
