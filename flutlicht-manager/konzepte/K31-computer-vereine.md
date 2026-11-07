# K31 – Computer-Vereine

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K19 (Transfers), K21 (Verträge), K18 (Scouting), K28 (Vorstand), K02 (Klugheit) · Wird gebraucht von: K06, K07, K20, K23, K32.

## 1. Ziel und Spielgefühl

- **Die Konkurrenz plant wie ein echter Verein:** Kaderplan mit Planstellen, Bedarf, Budget, Profil. Keine Zufallskäufe (Rohmaterial 1.2).
- **Langzeit-Spannung ist das Hauptziel:** Die Community klagt, dass man nach ein paar Saisons mit einem mittelmäßigen Team jede Liga gewinnt, weil die KI schlecht plant, kaum Stars jagt und sich nicht anpasst (Recherche 4b). Bei uns bleiben die Großen groß, und sie reagieren auf dich.
- **Deine Verkaufsregeln:** verkaufen nur mit Grund und wenn die Position besetzt bleibt. Erst kaufen, dann verkaufen (Rohmaterial 13.3).
- **Gleiche Regeln wie für dich** (Rohmaterial, Grundsatz 4). Keine versteckten Hilfen (K02 §5.3).

## 2. Vorbilder und Abgrenzung

- **Rohmaterial Kapitel 13:** Kaderplan, Bedarfsanalyse, Verkaufs- und Kaufregeln, Minimalfinanzen, Trainerwechsel. Übernommen und an K03 (14 Positionen), K19 (Vereinswert) und K28 (Vorstand) angepasst.
- **Community-Kritik:** KI kauft drei, vier Spieler für dieselbe Position, während Grundrollen fehlen, nutzt ihr Budget nicht, Topvereine kaufen jahrelang nur Durchschnitt, kleine Vereine verkaufen Stars zu billig (Recherche 4, 4b). Jeder Punkt hat hier eine Regel und einen Test.

## 3. Begriffe und Daten

### 3.1 Kaderplan

| Planstellen-Gruppe | Positionen | Planstellen (Standard) |
|---|---|---|
| Torwart | TW | 3 |
| Innenverteidigung | IV | 4 |
| Außenverteidigung | LV, RV | 4 (je 2) |
| zentrales Mittelfeld | DM, ZM, SM | 5 |
| offensives Mittelfeld und Flügel | OM, LM, RM | 4 |
| Sturm und Flügelsturm | MS, HS, LA, RA | 4 |
| Talente | beliebig, bis 21 | 2–4 |

- Jede Planstelle hat einen **Rang**: Stammspieler, Herausforderer, Ergänzung, Talent.
- **Qualitätsziel:** Stammspieler höchstens 3 unter dem Vereinsniveau, Herausforderer höchstens 6, Ergänzung höchstens 10 (Rohmaterial 13.1).
- Die Grundordnung des Vereins (K06) verschiebt die Planstellen leicht, zum Beispiel ein Dreierketten-Verein mit 5 Innenverteidigern und weniger Außenverteidigern.

### 3.2 Vereinsprofil

| Profil | Gewichtung |
|---|---|
| ehrgeizig | Qualitätsziel 1 strenger, nutzt das Budget voll, jagt Stars |
| sparsam | kauft unter Marktwert, verkauft bei gutem Angebot eher |
| Ausbildungsverein | bringt Talente früh, verleiht viel, verkauft Talente teuer |
| Altherren-Truppe | holt erfahrene Spieler, wenig Talente |
| Spekulant | kauft junge, unterbewertete Spieler, verkauft mit Gewinn |
| Malocher | hartes Training, viel Einsatz, kampfstarke Spieler (K07) |

- Dazu ein **Lieblingsstil** (K06) und die **Klugheitsstufe** aus K02 (gilt für alle Computer-Vereine gemeinsam).
- Profile als Stammdaten in `daten/vereine.js` (neu, je Verein ein bis zwei Profile).

### 3.3 Finanzen (Minimalmodell)

- Einnahmen je Saison aus Zuschauern, TV, Sponsor und Transfers, Ausgaben aus Gehältern, Betrieb und Ablösen. Heute: `fremdeEinnahmen` nach Ansehen.
- Daraus legt ihr Vorstand ein **Transferbudget** und einen **Gehaltsrahmen** fest (wie K28 für dich, vereinfacht).
- Über dem Gehaltsrahmen: erst verkaufen, dann kaufen.

## 4. Abläufe

1. **Vor jedem Fenster** (Mitte Juni und Mitte Dezember): Bedarfsanalyse (5.1), Wunschliste mit Priorität und Budget.
2. **Im Fenster:** Anfragen und Angebote nach K19, mit eigener Schätzung (K18). Täglich ein kleiner Teil der Vereine aktiv, damit es nicht alles auf einmal passiert.
3. **Verkauf** nur nach den Regeln (5.2). Angebote an dich und an andere Vereine.
4. **Verträge** nach K21: Stammspieler im letzten Jahr früh verlängern, ältere Reservisten auslaufen lassen.
5. **Laufend:** Aufstellung, Taktik, Training, Rotation, Stimmung nach K04–K07 und K14, mit Klugheitsstufe.
6. **Trainerwechsel** nach K28 (vereinfacht), mit Trainerpool.
7. **Saisonende:** Planstellen neu ordnen (Alter, Karriereende, Talente rücken auf), Profil kann sich langsam ändern (Aufstieg macht ehrgeizig).

## 5. Regeln und Formeln

### 5.1 Bedarf

| Grund | Priorität |
|---|---|
| offene Planstelle (Vertragsende, Verkauf, Karriereende) | hoch |
| Stammspieler mehr als 3 unter dem Qualitätsziel | hoch |
| Stammspieler mehr als 8 Wochen verletzt | mittel (im Winter oft Leihe) |
| Wechselwunsch Stufe 3, der wahrscheinlich erfüllt wird | mittel |
| Planstelle Talent unbesetzt | niedrig, Ausbildungsverein mittel |

- **Eine Lücke, ein Kauf:** Für jede Bedarfsposition wird höchstens ein Spieler geholt, bevor der Bedarf neu berechnet wird. Gegen „drei Spieler für dieselbe Position“.
- **Budget nutzen:** Bleibt am Ende eines Fensters mehr als 40 % des Budgets ungenutzt und gibt es Bedarf, senkt der Verein seine Ansprüche schrittweise (Qualitätsziel +1 je Woche).

### 5.2 Verkaufsregeln (deine Vorgaben)

Ein Computer-Verein verkauft nur, wenn **A und B** gelten.

**A – es gibt einen Grund:**
- Wechselwunsch ab Stufe 3 (K14), **oder**
- lange schwach: Note über 10 oder mehr Einsätze schlechter als die Schwelle, oder Stärke deutlich unter der Planstelle, **oder**
- Kaderüberhang auf der Position, **oder**
- außergewöhnliches Angebot über 150 % des Marktwerts. Dann wird verkauft, und sofort startet die Ersatzsuche.

**B – die Position bleibt besetzt:** Nach dem Verkauf sind die Planstellen der Gruppe noch voll. Sonst **erst kaufen, dann verkaufen.** Bei drei Torhütern gibt es keinen ab, bevor ein neuer unterschrieben hat.

- **Kleine Vereine und ihre Stars:** Schmerzgrenze mit Stellenwert ×1,5 (K19 §5.1). Gegen „kleine Vereine verkaufen Stars zu billig“.

### 5.3 Kaufregeln

- Nur bei Bedarf, mit Budget und Interesse des Spielers (K19 §5.3).
- **Ehrgeizige Vereine jagen Stars:** Sie setzen jede Saison ein Ziel auf einen Spieler über ihrem Niveau, wenn Budget da ist. Gegen „Topvereine kaufen nur Durchschnitt“.
- **Bietlaune und Geduld** mit Zufall je Verhandlung (aus dem Tag-Strom „markt“, K02).
- **Auch Computer-Vereine werben ab** und können erwischt werden (K20, Welle 4).

### 5.4 Klugheit

| Stufe (K02) | Entscheidungen |
|---|---|
| gemütlich | Bedarf wird verspätet erkannt, Rauschen in Bewertungen ×1,5, kontert deinen Stil selten (K06: 10 %) |
| normal | wie beschrieben, kontert 25 % |
| clever | Bedarf früh, Rauschen ×0,7, nutzt Ausstiegsklauseln, kontert 50 %, vermeidet Belastungssprünge (K07) |

Klugheit ändert nur Entscheidungen, nie Stärken oder Würfel.

### 5.5 Trainerwechsel

- Vertrauen aus Sport und Finanzen (K28 §5.1, vereinfacht), Ultimatum, Entlassung nach Geduld des Präsidenten.
- Neuer Trainer aus dem **Trainerpool** (vereinslose Trainer, Co-Trainer anderer Vereine, ehemalige Spieler, K16). Er bringt seinen Lieblingsstil (Vertrautheit sinkt, K06), einen kurzen Stimmungsschub (+5 für alle, K14) und einen Kaderumbau im nächsten Fenster (Bedarf neu nach seinem Stil).

## 6. Hebel des Spielers

K31 beschreibt die Gegner. Deine Hebel gegenüber ihnen:
- **Ihre Regeln nutzen:** Ein Verein mit Kaderüberhang verkauft eher, einer mit Wechselwunsch billiger.
- **Ihr Bedarf ist dein Markt:** Wer eine Lücke hat, zahlt für deinen Spieler eher den vollen Wert.
- **Ihre Reaktion einplanen:** Wer immer denselben Stil spielt, wird gekontert (K06).

## 7. Verhalten der Computer-Vereine

Das ganze Konzept.

## 8. Ereignisse

| Meldung | Auslöser | Folge |
|---|---|---|
| Großer Umbruch | neuer Trainer bei einem Konkurrenten | Info, Gerüchte (K29) |
| Rekordtransfer | Ablöse über dem Ligarekord | Presse, Statistik (K34) |
| Konkurrent rüstet auf | ehrgeiziger Rivale kauft einen Star | Presse, deine Fans erwarten eine Antwort (K27) |
| Notverkauf | Verein über dem Gehaltsrahmen | Spieler unter Wert auf dem Markt |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K02 | Klugheitsstufe, keine Hilfen |
| K03, K14 | Planstellen nach Positionen, Wechselwünsche |
| K04–K07 | Aufstellung, Taktik, Live-Entscheidungen, Training |
| K08 | Talente, Leihen |
| K17 | Handelspartner nach Beziehung |
| K18 | eigene Schätzung mit Fehlern |
| K19–K21 | Transfers, Abwerben, Verträge |
| K23 | Finanzen (Minimalmodell, später voll) |
| K28 | Vorstand und Trainerwechsel |
| K32 | Karriereenden, neue Spieler, Auslandspool, Trainerpool |

## 10. Zielwerte und Tests

Testskript: `tests/welt.js` (neu), viele Saisons ohne menschlichen Spieler.

| Prüfung | Ziel |
|---|---|
| Langzeit-Spannung | nach 10 Saisons sind die fünf Vereine mit dem höchsten Ansehen im Schnitt noch unter den besten acht der 1. Liga |
| ausgewogene Kader | nach 10 Saisons hat kein Verein eine Planstellen-Gruppe dauerhaft unbesetzt, höchstens 5 % der Vereine mit mehr als 2 Spielern Überhang je Gruppe |
| Budget genutzt | im Schnitt 60–100 % des Transferbudgets je Saison ausgegeben |
| Zugänge | je Verein im Sommer 3–8, im Winter 0–3 (Rohmaterial 13.4, prüfen) |
| Stars wandern nach oben | Spieler ab 85 Stärke spielen nach 10 Saisons zu mindestens 70 % bei Vereinen mit Ansehen über 75 |
| kein Kaderchaos | höchstens 1 % der Käufe auf eine Position ohne Bedarf |
| Verkaufsregeln | kein Verkauf ohne Grund A, keine Gruppe nach einem Verkauf unterbesetzt ohne Ersatzkauf im selben Fenster |
| Trainerwechsel | 3–7 pro Saison in der 1. Liga (prüfen, K28) |
| Klugheit | „clever“ holt im Schnitt mehr Punkte je Euro als „gemütlich“, bei gleichen Kadern und Würfeln |

## 11. Stellschrauben

```js
computer:{
  planstellen:{TW:3,IV:4,AV:4,ZM:5,OM:4,ST:4,talente:[2,4]},
  qualitaet:{stamm:3,herausforderer:6,ergaenzung:10,ehrgeizig:-1},
  profile:{ehrgeizig:{budget:1,stars:true},sparsam:{kauf:0.9,verkauf:1.2},ausbildung:{talente:4,leihe:true},altherren:{alter:28},spekulant:{jungUnter:23,gewinn:1.3},malocher:{training:'hoch',einsatz:'hart'}},
  bedarf:{verletztWochen:8,einKaufJeLuecke:true,budgetRestAb:0.4,anspruchJeWoche:1},
  verkauf:{noteSchwelle:4.5,noteSpiele:10,unterPlanstelle:6,angebotAb:1.5,kleineStars:1.5},
  sterneJagd:{jeSaison:1,ueberNiveau:5},
  klugheit:{gemuetlich:{rauschen:1.5,reaktion:0.10},normal:{rauschen:1,reaktion:0.25},clever:{rauschen:0.7,reaktion:0.50}},
  aktivJeTag:0.2,trainerSchub:5
}
```

`markt.listeVoll`, `markt.listeZufall`, `markt.wechsel`, `markt.kaeufer` und `saison.kaderSoll` aus der heutigen `regeln.js` gehen darin auf.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Planstellen nach Gruppen** der 14 Positionen statt je einzelner Position.
2. **Sechs Profile,** je Verein ein bis zwei, als Stammdaten.
3. **Klugheit gilt für alle Computer-Vereine gemeinsam** (eine Stufe je Spielstand, K02).
4. **„Note über 10 oder mehr Einsätze schlechter als die Schwelle“** aus deinen Vorgaben: Schwelle vorläufig 4,5 im Notenschnitt der letzten 10 Einsätze.

**Noch zu recherchieren:** echte Zahl der Zu- und Abgänge je Verein und Fenster, Trainerwechsel pro Saison.

## Quellen

- Kaderplan, Bedarf, Verkaufs- und Kaufregeln, Finanzen, Trainerwechsel: `konzepte/_rohmaterial-logik-v1.md`, Kapitel 13 (Verkaufsregeln nach deinen Vorgaben)
- Kritik an der KI-Kaderplanung, zu leicht nach ein paar Saisons: `konzepte/_recherche-genre.md`, Abschnitte 4 und 4b
