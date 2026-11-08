# K34 – Statistik und Historie

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K04 (Spieldaten), K29 (Sprüche) · Wird gebraucht von: K28, K35a.

## 1. Ziel und Spielgefühl

- **Die eigene Geschichte nachlesen:** Meisterschaften, Rekorde, Lieblingsspieler, der Spruch aus der Pressekonferenz von vor drei Jahren.
- **Ehrungen als kleine Höhepunkte:** Elf des Jahres, Torschützenkönig, Spieler der Saison (Community-Wunsch, Recherche 4b).
- **Verläufe:** Stärke, Form, Marktwert als Grafik (Community-Wunsch).

## 2. Vorbilder und Abgrenzung

- **Community-Wünsche:** historische Daten, „Elf des Jahres“, Marktwert-Verlauf (Recherche 4b).
- **Heute im Spiel:** Tore, Pokaltore, Einsätze, Gelbe Karten je Saison, Saisonhistorie `S.hist`. Bleibt die Grundlage.
- **Bewusst anders:** Der Speicher im Browser ist begrenzt. Volle Details für die letzten Saisons, ältere verdichtet.

## 3. Begriffe und Daten

| Bereich | Inhalt | Aufbewahrung |
|---|---|---|
| Spieler je Saison | Spiele, Minuten, Tore, Vorlagen, Notenschnitt, Karten, Paraden und Spiele zu null (Torhüter), Verein | alle Saisons, kompakt |
| Spieler-Verläufe | Stärke, Form, Marktwert je Monat (K03 `hist`) | 3 Saisons, danach je Saison ein Wert |
| Vereine je Saison | Platz, Punkte, Tore, Zuschauerschnitt, Umsatz, Ergebnis, Trainer | alle Saisons |
| Rekorde | höchster Sieg, längste Serie, meiste Tore einer Saison, Zuschauerrekord, Rekordtransfer | laufend |
| Ehrungen | Meister, Pokalsieger, Supercup, Aufsteiger, Torschützenkönig, Elf des Jahres, Spieler, Talent und Trainer der Saison | alle Saisons |
| Karriere des Trainers | Vereine, Titel, Ruf, Schwierigkeitsstufe je Saison (K02), Gehalt (K28) | alle Saisons |
| Sprüche-Chronik | Aussagen und Schlagzeilen aus K29 (D6: K34 speichert, K29 liefert) | höchstens 100 Einträge |
| Vitrine | Pokale, auch Testspiel-Turniere (K11) | alle |

## 4. Abläufe

1. **Nach jedem Spiel:** Spielerwerte fortschreiben, Rekorde prüfen (Meldung bei neuem Rekord, K04 §8).
2. **Saisonende:** Ehrungen vergeben (5.1), Saisonarchiv anlegen, Verläufe verdichten.
3. **Ansicht:** Statistikseite mit Tabellen, Verläufen als Linie (K35a), Vergleich zweier Spieler.

## 5. Regeln und Formeln

### 5.1 Ehrungen

- **Torschützenkönig:** meiste Ligatore (Relegation zählt nicht, wie heute).
- **Elf des Jahres:** je Position die besten Notenschnitte mit mindestens 20 Einsätzen, Grundordnung 4-3-3 (K06).
- **Spieler der Saison:** Notenschnitt, Tore und Vorlagen, Mannschaftserfolg gewichtet.
- **Talent der Saison:** bis 21 Jahre, Fortschritt der Stärke plus Notenschnitt.
- **Trainer der Saison:** Punkte über der Erwartung (K04 §5.8).
- Wirkung: Ehrungen heben den Marktwert (+5 %) und den Ruf (K28: Trainer der Saison +5).

### 5.2 Speicher

- Ziel: Statistik nach 20 Saisons höchstens 1 MB im Spielstand.
- Spieler ohne Einsatz in den letzten 5 Saisons werden zu einer Zeile Karrieresumme verdichtet.

## 6. Hebel des Spielers

Keine. Statistik beschreibt, sie steuert nicht.

## 7. Verhalten der Computer-Vereine

Ihre Spieler und Vereine werden gleich erfasst. Ehrungen gelten für alle.

## 8. Ereignisse

| Meldung | Auslöser |
|---|---|
| Neuer Rekord | Rekord gebrochen |
| Elf des Jahres | Saisonende, eigener Spieler dabei |
| Jubiläum | 100. Spiel eines Spielers, 10 Jahre im Verein |

## 9. Wechselwirkungen

K03 (Verläufe), K04 (Spieldaten), K11 (Turnierpokale), K13 (Titel), K28 (Ruf, Karriere), K29 (Sprüche-Chronik), K35a (Ansichten).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Speicher | nach 20 simulierten Saisons Statistik unter 1 MB |
| Konsistenz | Summe der Spielertore = Summe der Vereinstore je Saison (ohne Eigentore) |
| Ehrungen | jede Saison genau ein Torschützenkönig je Liga (bei Gleichstand mehrere) |

## 11. Stellschrauben

```js
statistik:{verlaufSaisons:3,chronikMax:100,verdichtenNachSaisons:5,elfMinEinsaetze:20,elfOrdnung:'4-3-3',ehrungMarktwert:0.05,trainerRuf:5,speicherMax:1e6}
```

## 12. Offene Fragen

**Vorläufig entschieden:** Elf des Jahres in 4-3-3, volle Details drei Saisons lang, Sprüche-Chronik bis 100 Einträge.

## Quellen

- Wünsche zu Statistik und Historie: `konzepte/_recherche-genre.md`, Abschnitt 4b
- Zuständigkeit Sprüche-Chronik: `konzepte/_konsistenzpruefung.md`, D6
