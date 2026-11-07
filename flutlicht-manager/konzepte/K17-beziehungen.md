# K17 – Beziehungsnetz

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: – · Wird gebraucht von: K11, K19, K20, K22, K29, K30, K31.

## 1. Ziel und Spielgefühl

- **Fußball ist ein Dorf:** Wie du mit anderen Vereinen, Beratern und Journalisten umgehst, kommt zurück. Faire Deals öffnen Türen, Abwerben schließt sie.
- **Keine festen Strafen, sondern Beziehungen** (PLAN §2): Abwerben verschlechtert die Beziehung zum anderen Verein, das bringt mehr Klatsch und Tratsch, und das wirkt auf Spieler, manchmal positiv, öfter negativ.
- **Geschichten zwischen Dritten:** Zwei Vereine streiten um einen Spieler, du holst ihn, und die beiden sind aufeinander sauer, nicht auf dich (PLAN §2).

## 2. Vorbilder und Abgrenzung

- **PLAN §4 (Notizen zu K17):** Werte von −100 bis +100, was sie senkt und hebt, wofür sie zählen. Übernommen.
- **Football Manager:** Beziehungen zu Trainern und Vereinen eher als Hintergrund. Bei uns sichtbar und mit klarer Wirkung.
- **Bewusst anders:** Jede Änderung hat einen sichtbaren Grund im Verlauf („−15: Abwerbeversuch bei X entdeckt“).

## 3. Begriffe und Daten

| Beziehung | zwischen | Grundwert |
|---|---|---|
| Verein–Verein | allen Vereinen der Spielwelt | 0, Derby −30, Partnerverein +30 |
| du–Verein | dir und jedem Verein (wandert mit dir) | 0 |
| du–Berater | dir und jedem Berater (K22) | 0 |
| du–Journalist | dir und jedem Journalisten (K29) | 0 |
| du–Spieler außerhalb deines Kaders | nur für Spieler, mit denen du zu tun hattest | 0 |

- Gespeichert in `S.bez` als Paare mit Wert und den letzten fünf Gründen. Nur Paare mit Wert ungleich Grundwert werden gespeichert.
- Beziehungen innerhalb deines Kaders sind Stimmung und Beziehungen aus K14, nicht K17.
- **Derbys und Partnerschaften** als Stammdaten in `daten/vereine.js` (neu: Liste der Derby-Paare).

## 4. Abläufe

1. **Änderungen** sofort bei Anlässen (5.1), mit Grund im Verlauf.
2. **Vergessen:** jeden Monat 5 % zurück zum Grundwert.
3. **Übersicht:** Liste der Beziehungen mit Balken und Gründen, nach Art gefiltert (K35a).
4. **Mitnehmen:** Wechselst du den Verein, nimmst du deine persönlichen Beziehungen (du–Verein, du–Berater, du–Journalist) mit. Die Beziehungen deines alten Vereins bleiben dort.

## 5. Regeln und Formeln

### 5.1 Was Beziehungen ändert

| Anlass | Änderung |
|---|---|
| fairer Transfer (Preis nahe Wert, ohne Hängepartie) | +5 |
| Spottangebot (unter 60 % der Forderung) | −3 |
| Abwerbeversuch entdeckt (K20) | −15 bis −30 |
| Ausstiegsklausel gezogen | −8 |
| Testspiel vereinbart und gespielt (K11) | +3 |
| Leihe mit eingehaltener Spielzeit (K08) | +5, nicht eingehalten −5 |
| Hilfe in der Not (Leihe eines Torwarts bei Verletzungskrise) | +10 |
| öffentliche Kritik in der Presse (K29) | −5 bis −15 |
| Gerücht über Abwerben (wahr oder falsch, K29) | −3 bis −8 |
| Derby gewonnen | −2 (die Rivalität wächst) |
| Rudelbildung, Rote Karte gegen einen ihrer Spieler mit Verletzungsfolge (K09) | −5 |

### 5.2 Wofür Beziehungen zählen

| Bereich | Wirkung |
|---|---|
| Ablöse (K19) | Forderung × (1 − 0,0015 × Beziehung), also ±15 % bei ±100 |
| Verhandlungsbereitschaft | unter −50 lehnt ein Verein Gespräche oft ab (50 %) |
| Testspiele (K11) | Zusage × (1 + 0,005 × Beziehung) |
| Leihangebote | über +40 bietet ein Verein dir in der Not Spieler an |
| Gerüchte (K29) | unter −30 doppelt so viele negative Gerüchte über deinen Verein |
| Brisanz im Spiel | unter −50 wie ein Derby: Karten ×1,3 (K09), wichtige Spiele (K04 §5.5) |
| Berater (K22) | Preise, Tipps, Pakete |
| Journalisten (K29) | Ton der Berichte, Fragen in der Pressekonferenz |

### 5.3 Klatsch und Tratsch

- Schlechte Beziehungen zu einem Verein erzeugen Gerüchte über deine Spieler (K29), zum Beispiel „X soll dort Thema sein“.
- **Wirkung auf den Spieler** (K14, Baustein Umfeld): mit 30 % positiv (fühlt sich begehrt, +3), mit 70 % negativ (Unruhe, −3, Wechselwunsch etwas wahrscheinlicher).

### 5.4 Der lachende Dritte

- Bieten zwei Vereine um denselben Spieler und gewinnst du ihn, sinkt die Beziehung **zwischen den beiden** um 10, deine zu ihnen nur um 2.
- Mit einer Ereigniskarte (K30) und geschicktem Vorgehen auch 0.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| fair verhandeln | bessere Preise später, Hilfe in der Not | heute etwas teurer |
| abwerben | Spieler billiger oder überhaupt | Beziehung, Klatsch, Gerüchte |
| Testspiele, Leihen | Beziehungen pflegen | Kalender, Kontrolle |
| Presse zurückhaltend | weniger Ärger mit Vereinen | weniger Rückhalt bei Fans |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln: Ihre Beziehungen untereinander ändern sich durch dieselben Anlässe.
- Sie handeln lieber mit Vereinen, zu denen sie gute Beziehungen haben, und meiden Gespräche unter −50.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Der entfernte Verwandte (K22, K30) | Zufall | lachender Dritter möglich |
| Hilfe in der Not (Entscheidung) | Verletzungskrise bei dir, Verein mit Beziehung über 40 | Leihe annehmen (+10 Beziehung bei Rückgabe in Ordnung) |
| Fehde in der Presse | Beziehung unter −50, Trainer kritisiert dich öffentlich | Antwort (K29) oder schweigen |
| Versöhnung | Beziehung lange unter −50, Zufall | Treffen, +20, wenn es klappt |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K08 Jugend | Leihen mit Spielzeit |
| K09 Sportgericht | Brisanz, Vorfälle |
| K11 Testspiele | Zusage nach Beziehung |
| K14 Kabine | Klatsch wirkt auf die Stimmung |
| K19, K20 | Preise, Gesprächsbereitschaft, Abwerben |
| K22 Berater | Beziehung zu Beratern |
| K29 Presse | Journalisten, Gerüchte, Fehden |
| K30 Ereigniskarten | lachender Dritter, Versöhnung |
| K31 Computer-Vereine | Handelspartner nach Beziehung |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Wirkung spürbar | wer drei Vereine abwirbt, zahlt bei ihnen in den nächsten zwei Jahren im Schnitt 8–15 % mehr Ablöse |
| Vergessen | ein Wert von −50 ohne neue Anlässe ist nach einem Jahr etwa −27 |
| Derby | Derby-Paare bleiben dauerhaft unter 0 |
| Kein Dauerkrieg | im Schnitt weniger als 5 % der Vereinspaare unter −50 |

## 11. Stellschrauben

```js
beziehungen:{
  grund:{derby:-30,partner:30},vergessen:0.05,
  anlass:{fair:5,spott:-3,abwerben:[-15,-30],ausstieg:-8,testspiel:3,leiheGut:5,leiheSchlecht:-5,hilfe:10,kritik:[-5,-15],geruecht:[-3,-8],derbySieg:-2,vorfall:-5},
  wirkung:{abloese:-0.0015,gespraechUnter:-50,gespraechAblehnen:0.5,testspiel:0.005,hilfeAb:40,geruechtUnter:-30,brisanzUnter:-50},
  klatsch:{positiv:0.3,plus:3,minus:-3},
  dritter:{untereinander:-10,du:-2},verlauf:5
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Persönliche Beziehungen wandern mit dir,** die des Vereins bleiben beim Verein.
2. **Derbys als Stammdaten** mit festem Grundwert −30.
3. **Keine Beziehung zu einzelnen Fans oder Fangruppen hier,** das gehört zu K27.

## Quellen

- Abwerben ohne feste Strafen, Klatsch und Tratsch, lachender Dritter: PLAN §2
- Werte, Anlässe, Wirkungen: PLAN §4 (Notizen zu K17 und K30)
