# K32a – Unterbau: 3. Liga und Regionalliga

Status: **Entwurf**, umgesetzt am 6. November 2026 (deine Vorgabe: „sinnvoll umsetzen, etwas Zufall“).
Abgespalten von K32 (Spielwelt und Saisonwechsel). Hängt ab von: K01, K33 · Wird gebraucht von: K13, K19, K28, K31.

## 1. Ziel und Spielgefühl

- Die 2. Liga ist keine geschlossene Gesellschaft mehr: Wer unten landet, steigt in die 3. Liga ab, und von unten kommen echte Vereine nach.
- Die 3. Liga lebt: echte Tabelle, Ergebnisse, Torjäger, Spieler zum Kaufen. Dein Verein kann dort landen und weiterspielen.
- Aus der Regionalliga steigt nicht immer der Favorit auf. Ein bisschen Glück gehört dazu.

## 2. Vorbilder und Abgrenzung

- FM simuliert viele Ligen vollständig. Das ist teuer und für uns nicht nötig.
- Wir simulieren drei Ligen vollständig und die Regionalliga nur als Losverfahren. Das bleibt schnell und trotzdem glaubwürdig.

## 3. Begriffe und Daten

| Was | Inhalt | Ort |
|---|---|---|
| 3. Liga | 20 echte Vereine 2026/27, Kader erfunden, Kapazität und Fanpotenzial aus dem Zuschauerschnitt laut Wikipedia | `daten/vereine.js`, `liga:3` |
| Zweitmannschaft | Feld `zweite` (Hoffenheim II, Stuttgart II): kein Aufstieg in die 2. Liga, kein DFB-Pokal | `daten/vereine.js` |
| Regionalliga-Pool | 29 Vereine aus den fünf Staffeln, ohne Kader, mit Region | `daten/vereine.js`, `liga:4` |
| Region | Staffel, in die ein Verein bei Abstieg aus der 3. Liga fällt | alle Vereine, Feld `region` |

## 4. Abläufe

1. **Saisonende:** Neben der Relegation 1./2. Liga gibt es die Relegation 2./3. Liga (16. der 2. Liga gegen den Dritten der 3. Liga, Hin- und Rückspiel am 28.5. und 1.6.).
2. **Auf- und Abstieg 2./3. Liga:** Platz 17 und 18 der 2. Liga steigen ab, die beiden besten Aufstiegsberechtigten der 3. Liga steigen auf. Zweitmannschaften werden übersprungen.
3. **Abstieg aus der 3. Liga:** Die letzten vier gehen in die Regionalliga ihrer Region. Ihre Spieler werden vereinslos.
4. **Aufstieg aus der Regionalliga:**
   - Je Staffel wird ein Meister gelost, gewichtet mit (Ansehen − 15)². Der Favorit hat die besten Chancen, sicher ist es nicht.
   - Die Meister von West und Südwest steigen direkt auf. Von Nord, Nordost und Bayern steigt eine Staffel im Wechsel direkt auf (2027 Nordost, 2028 Bayern, 2029 Nord …).
   - Die beiden anderen Meister spielen zwei Aufstiegsspiele, ein kleines Torspiel nach Stärke, bei Gleichstand Elfmeterschießen.
5. **Aufsteiger** bekommen einen neuen, erfundenen Kader.
6. **Dein Verein:** Steigt er aus der 3. Liga ab, trennt er sich von dir, und du bekommst Jobangebote.

## 5. Regeln und Formeln

- Kaderstärke der Drittligisten über das Ansehen (28–47), also etwa 58–66. Die 2. Liga liegt bei 65–72.
- Finanzen 3. Liga: TV-Geld 20.000 € + 400 € je Ansehenspunkt pro Spieltag, Zuschauerfaktor 0,7, Sponsor-Faktor 8.
- DFB-Pokal: 36 Vereine aus 1. und 2. Liga, die vier Drittligisten mit dem höchsten Ansehen (ohne Zweitmannschaften), 24 Amateure.

## 6. Hebel des Spielers

Keine neuen. Spieler der 3. Liga lassen sich kaufen, und Jobangebote können aus der 3. Liga kommen.

## 7. Verhalten der Computer-Vereine

Drittligisten handeln auf dem Transfermarkt wie alle anderen. Regionalligisten kaufen und verkaufen nicht.

## 8. Ereignisse

Später möglich (K30): ein Traditionsverein will zurück, ein Lizenzentzug, ein Aufsteiger verzichtet auf die 3. Liga.

## 9. Wechselwirkungen

| Konzept | Wechselwirkung |
|---|---|
| K13 | Relegation und Aufstiegsspiele genauer, Heimrecht im Pokal |
| K21, K23 | Gehälter und Finanzen der 3. Liga stimmen noch nicht (siehe Konsistenzprüfung) |
| K31 | Computer-Vereine der 3. Liga planen ihren Kader |
| K32 | echte Kader für die 3. Liga, Datenpflege je Saison |

## 10. Zielwerte und Tests

- Jede Saison: 2 + 1 Wechsel zwischen 1. und 2. Liga, 2 + 1 zwischen 2. und 3. Liga, 4 zwischen 3. Liga und Regionalliga.
- Ligagrößen bleiben 18/18/20. Regionalligisten haben keine Spieler. Keine Zweitmannschaft im Pokal.
- Im Fuzz-Test spielen zwei Karrieren in der 3. Liga.

## 11. Stellschrauben

`saison.abstieg3`, `saison.regionalliga` (Staffeln, direkte Aufsteiger, Wechsel, Gewichtung, Torspiel), `finanzen.tv.liga3`, `finanzen.zuschauer.liga3`, `finanzen.sponsor.liga3`, `finanzen.pokal`, `markt.interesse.liga3`.

## 12. Offene Fragen

1. **Start in der 3. Liga:** Erst nach K21 und K23, wenn die Gehälter der 3. Liga stimmen. Bis dahin erreichst du sie nur über Abstieg oder Jobwechsel. Einverstanden?
2. **Echte Kader der 3. Liga** wie für 1. und 2. Liga aus Wikipedia nachtragen?
3. **Regionalliga-Wechsel:** Die Reihenfolge Nord, Nordost, Bayern habe ich aus den Aufstiegsspielen 2025 und 2026 abgeleitet. Bitte bei Gelegenheit gegen die DFB-Regel prüfen.
4. **Kapazitäten der Regionalligisten** sind gerundet und aus dem Gedächtnis. Nachprüfen, wenn sie wichtig werden.
