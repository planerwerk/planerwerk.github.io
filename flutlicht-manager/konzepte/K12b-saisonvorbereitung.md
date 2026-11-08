# K12b – Saisonvorbereitung (Rahmen)

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K12a (Sommer), K19, K24, K25, K28 · Wird gebraucht von: –

## 1. Ziel und Spielgefühl

- **Die Vorbereitung ist die Zeit für Weichenstellungen:** Kader, Ziele, Sponsoren, Trikot, Kapitän.
- **Ein roter Faden statt verstreuter Menüs:** Eine Liste „Vor dem Saisonstart“ zeigt, was erledigt ist und was noch fehlt, ohne Zwang.
- **Kleine Feste:** Trikotvorstellung, Mannschaftsfoto, Saisoneröffnung mit den Fans.

## 2. Vorbilder und Abgrenzung

- **Anstoss 3:** Saisonziel verhandeln, Sponsorentag, Testspiel-Planung (PLAN §4).
- **Zuständigkeit:** K12b legt nur Termine und die Liste fest. Die Inhalte gehören zu K28 (Zielgespräch, D3), K24 (Sponsoren), K25 (Trikot), K19 (Transfers), K11 (Testspiele), K12a (Training und Urlaub).

## 3. Begriffe und Daten

**Liste „Vor dem Saisonstart“** (im Büro, K35a):

| Punkt | Zuständig | Standardtermin |
|---|---|---|
| Urlaubslänge und Trainingsauftakt | K12a | Saisonabschluss |
| Sponsoren für freie Flächen | K24 | ab 1. Juli |
| Sponsorentag | K24 | Woche 2 der Vorbereitung |
| Trikotvorstellung, Sortiment | K25 | Woche 2 |
| Testspiele, Trainingslager | K11 | Woche 1–3 geplant |
| Zielgespräch mit dem Vorstand | K28 | Woche 3 |
| Kaderplanung (Lücken, Überhang, Verträge) | K19, K21, K31 | laufend |
| Kapitän und Kaderrollen | K14 | vor dem ersten Pflichtspiel |
| Mannschaftsfoto und Saisoneröffnung | K12b | Wochenende vor dem ersten Pflichtspiel |

## 4. Abläufe

1. Die Liste erscheint mit dem Saisonabschluss und verschwindet mit dem ersten Pflichtspiel.
2. Offene Punkte erzeugen höchstens eine Erinnerung vor „Tag beenden“ (K01), gebündelt, abschaltbar.
3. **Automatik:** Was du nicht erledigst, erledigt der zuständige Mitarbeiter (K16). Ohne Sportdirektor entscheidet der Vorstand bei Sponsoren nach dem besten Fixum.
4. **Saisoneröffnung:** Fest mit den Fans im Stadion. Einnahmen (Ansehen × 2.000 €, Spielwert), Fanstimmung +3 (K27), Mannschaftsfoto für die Statistik (K34).

## 5. Regeln und Formeln

Keine eigenen Formeln. K12b ordnet nur Termine. Für Computer-Vereine laufen die Punkte automatisch nach ihren Konzepten.

## 6. Hebel des Spielers

Reihenfolge und Zeitpunkt der Punkte. Wer das Zielgespräch nach den Transfers führt, kennt seinen Kader besser, hat aber weniger Budget-Spielraum während der Transfers.

## 7. Verhalten der Computer-Vereine

Automatisch, ohne Liste.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Saisoneröffnung im Regen | Zufall | weniger Einnahmen, Fans trotzdem treu (+1) |
| Mannschaftsfoto ohne Neuzugang | Transfer nach dem Fototermin | kleine Anekdote in der Presse (K29) |

## 9. Wechselwirkungen

K01 (Erinnerung), K11, K12a, K14, K16 (Automatik), K19, K21, K24, K25, K27, K28, K31, K34, K35a (Liste im Büro).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Halte | die Liste erzeugt höchstens eine zusätzliche Erinnerung pro Woche |
| Automatik | ohne Eingriff sind zum ersten Pflichtspiel alle Punkte erledigt |

## 11. Stellschrauben

```js
vorbereitung:{eroeffnung:{jeAnsehen:2000,fans:3},erinnerungProWoche:1,zielgespraechWoche:3,sponsorentagWoche:2,trikotWoche:2}
```

## 12. Offene Fragen

**Vorläufig entschieden:** Liste statt Pflichtschritte, Automatik für Unerledigtes, Saisoneröffnung als kleines Fest.

## Quellen

- Saisonziel, Sponsorentag, Testspielplanung: PLAN §4 (GameStar 4/2000)
- Zuständigkeiten: `konzepte/_konsistenzpruefung.md`, D3
