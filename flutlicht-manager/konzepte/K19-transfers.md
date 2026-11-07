# K19 – Transfers I

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K18 (Scouting), K21 (Verträge), K22 (Berater), K17 (Beziehungen), K14 (Wechselwunsch) · Wird gebraucht von: K20, K23, K31.

## 1. Ziel und Spielgefühl

- **Transfers sind ein Prozess mit Zeit, Konkurrenz und Risiko,** kein Klick „Angebot, fertig“ (Rohmaterial 1.2).
- **Faire, nachvollziehbare Bewertung auf beiden Seiten:** Die Community klagt über Spottangebote der KI (9,75 Mio. für 37 Mio. Marktwert) und über das Vierfache des Marktwerts als Forderung (Recherche 4, 4d). Bei uns bewerten alle Vereine mit derselben Formel, beim Kaufen wie beim Verkaufen.
- **Spieler entscheiden mit:** Rolle, Geld, Verein, Trainer, Heimat. Ein Star geht nicht zu jedem.
- **Fenster gelten für alle** (PLAN §2): Verhandeln geht immer, wirksam wird ein Wechsel nur im Fenster.

## 2. Vorbilder und Abgrenzung

- **Rohmaterial 12.1, 12.2, 12.4:** Anfrage, Angebot mit Bestandteilen, Verhandlungsrunden mit Geduld, Konkurrenz, Spieler und Berater, Medizincheck, Unterschrift, Leihe, Ausstiegsklausel, Vereinslose. Übernommen.
- **Football Manager:** Klauseln, „heiß machen“ über die Medien, abgelehnte, aber nicht beleidigende Angebote drücken den Preis über die Zeit (Recherche 3.1). Übernommen.
- **Abgrenzung zu K20:** Abwerben am Verein vorbei, Bieterwettstreit im Detail und Deadline Day kommen in K20 (Welle 4).

## 3. Begriffe und Daten

| Begriff | Bedeutung | Ort |
|---|---|---|
| Marktwert | wie heute aus Stärke, Alter und Talent, dazu Merkmale (+4 % je Stärke) und Vertragslaufzeit | `value()` erweitert |
| **Vereinswert** | was ein bestimmter Verein für einen Spieler zahlen oder verlangen würde (5.1) | berechnet |
| Transferstatus | unverkäuflich, nur sehr teuer, verhandelbar, auf der Liste | je Spieler, vom Verein |
| Verhandlung | Gegenstand, Stand, Runden, Geduld, Fristen | `S.verhandlungen` |
| Angebot | Ablöse, Raten, Boni, Weiterverkaufsbeteiligung, Tauschspieler | in der Verhandlung |
| Leihe | Dauer, Gehaltsanteil, Einsatzgarantie, Kaufoption oder -pflicht, Rückruf | Leihvertrag am Spieler |
| Fenster | Sommer 1. Juli bis 1. September, Winter 1. Januar bis 1. Februar | `daten/termine.js` (neu als Einträge) |

## 4. Abläufe

### 4.1 Kauf eines Spielers mit Vertrag

| Schritt | Dauer | Was passiert |
|---|---|---|
| 1. Anfrage | 1–5 Tage | Antwort mit Transferstatus und grobem Preisrahmen |
| 2. Angebot an den Verein | 1–3 Tage je Runde | Annahme, Gegenangebot oder Ablehnung. Höchstens 4 Runden, die Geduld sinkt bei Spottangeboten |
| 3. Spieler und Berater | 1–3 Tage | Interesse (5.3), dann Vertrag nach K21 |
| 4. Medizincheck | 1 Tag | Befund möglich (5.5) |
| 5. Unterschrift | sofort | wirksam im offenen Fenster sofort, sonst zum nächsten Fensterbeginn. Integration beginnt (K03) |

- **Konkurrenz:** Andere Vereine können parallel bieten (K31). Du erfährst es über Gerüchte (K29) oder den Berater (K22). Ein höheres Angebot eines anderen Vereins kann deines schlagen.
- **Halte:** Jeder Schritt mit Antwort ist eine Info mit Frist. Ein Halt nur, wenn eine Entscheidung nötig ist (Gegenangebot, Befund).

### 4.2 Verkauf eines eigenen Spielers

- **Transferliste** mit Wunschpreis, oder Status „unverkäuflich“.
- **Angebote** anderer Vereine kommen wie heute als Frist (14 Tage), jetzt mit Bestandteilen. Du kannst annehmen, ablehnen oder ein Gegenangebot machen (bis zu 3 Runden).
- **Wechselwunsch** des Spielers (K14, Stufe 3) senkt den erzielbaren Preis um 10 %.

### 4.3 Weitere Wege

- **Ausstiegsklausel:** Betrag zahlen, nur noch mit Spieler und Berater verhandeln (K21).
- **Vereinslose:** jederzeit, auch außerhalb der Fenster (gibt es). Meist mit Grund (Alter, Verletzung, Charakter).
- **Leihe** mit Regeln (K08 §5.5): abgeben oder holen.
- **Tausch:** Spieler plus Geld, bewertet mit derselben Formel, beide Spieler müssen zustimmen.
- **Vorvertrag** im letzten halben Jahr eines Vertrags: ablösefreier Wechsel im Sommer (K21).

## 5. Regeln und Formeln

### 5.1 Vereinswert (gleiche Formel für alle, beim Kaufen und Verkaufen)

```
Vereinswert = Marktwert × Stellenwert × Restlaufzeit × Finanzlage × Beziehung × Schätzung
```

| Faktor | Werte |
|---|---|
| **Stellenwert** im Kader des Verkäufers | Schlüsselspieler ×1,5, Stammspieler ×1,3, Rotation ×1,0, Überhang ×0,8 |
| Stellenwert für den Käufer | wie gut er die Lücke füllt: besser als der eigene Stammspieler ×1,2, gleich ×1,0, schlechter ×0,7 |
| **Restlaufzeit** | 1 Jahr ×0,6, 2 Jahre ×0,85, 3 und mehr ×1,0 |
| **Finanzlage** des Verkäufers | knapp bei Kasse ×0,9, reich ×1,1 |
| **Beziehung** (K17) | ±15 % |
| **Schätzung** | der Verein kennt den Spieler nur so gut wie sein Scouting (K18). Er bewertet mit seiner Schätzung, nicht mit dem wahren Wert |

- **Forderung** des Verkäufers = sein Vereinswert × 1,15 (Verhandlungsspielraum). **Schmerzgrenze** = Vereinswert × 0,95.
- **Unverkäuflich** nur für Schlüsselspieler mit hoher Bindung, und auch dann nicht absolut: ab dem 1,8-Fachen des Vereinswerts wird verhandelt.
- **Obergrenze:** Keine Forderung über dem 1,8-Fachen des Marktwerts, außer für Schlüsselspieler im eigenen Kader (Lehre aus der Community).

### 5.2 Verhandlungsrunden

- **Gegenangebot** des Verkäufers liegt in der Mitte zwischen seinem letzten Wert und deinem Angebot, nie unter der Schmerzgrenze.
- **Spottangebot** (unter 60 % der Forderung): Geduld −1, Beziehung −3 (K17).
- **Abgelehnt, aber anständig** (über 80 % der Forderung): Die Forderung sinkt in den nächsten vier Wochen um 3 % (FM-Idee „Preisdruck über die Zeit“).
- **Bestandteile** zählen mit Abschlägen: Raten (bis zu 3 über zwei Jahre) mit 5 % Abschlag pro Jahr, Boni mit 50 % ihres Werts, Weiterverkaufsbeteiligung mit 20 % ihres geschätzten Werts.

### 5.3 Interesse des Spielers

```
Interesse = Perspektive + Geld + Verein + Trainer + Lage + Heimat − Bindung
```

| Baustein | Woraus |
|---|---|
| Perspektive | erwartete Rolle (K14) beim neuen gegenüber dem alten Verein |
| Geld | Gehaltsangebot gegenüber heute |
| Verein | Ansehen, Liga, sportliche Aussicht (Europapokal später) |
| Trainer | dein Ruf (K28) |
| Lage | Stimmung beim alten Verein (K14), Wechselwunsch |
| Heimat | Nationalität, Rückkehr ins Heimatland, Landsleute im Kader |
| Bindung | Loyalität, Vertragslaufzeit, vereinstreu (K03) |

- Unter einer Schwelle: „kein Interesse“ (wie heute). Darüber verhandelt er nach K21.
- Gleiche Formel für Computer-Vereine: Ein Star wechselt nicht zu jedem.

### 5.4 Angebote für deine Spieler

- Computer-Vereine bieten nur mit Bedarf (K31). Ihr erstes Angebot liegt bei 85–100 % ihres Vereinswerts, also nahe am Marktwert, solange ihr Scouting nicht stark danebenliegt.
- **Echte Ausreißer** entstehen nur aus Schätzfehlern (K18), nicht aus einer Regel, die absichtlich zu wenig bietet.

### 5.5 Medizincheck

- **Befund** möglich, wenn der Spieler verletzt ist, in den letzten 12 Monaten länger als 60 Tage ausfiel oder „verletzungsanfällig“ ist (K10).
- Folge: Nachverhandeln (Ablöse −10 bis −30 %), Leistungsklausel (Ablöse in Raten nach Einsätzen) oder Abbruch.
- Kosten: 5.000 € (Spielwert).

### 5.6 Fenster

- Sommer 1. Juli bis 1. September 2026, Winter 1. Januar bis 1. Februar 2027 (K01, Quellen). Folgejahre verschoben wie die anderen Termine.
- Außerhalb: verhandeln ja, wirksam erst im nächsten Fenster. Vereinslose jederzeit.
- **Heute** gehen Wechsel jederzeit (Konsistenzprüfung H6). K19 führt die Fenster ein.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| scouten vor dem Kauf (K18) | weniger Fehlkäufe | Zeit, Geld |
| anständig bieten | Preis sinkt über die Zeit, Beziehung bleibt gut | dauert |
| Spottangebot | manchmal Glück bei knappen Vereinen | Geduld, Beziehung |
| Raten, Boni, Tausch | weniger Geld sofort | teurer insgesamt |
| Wechselwunsch nutzen | billiger | Spieler bringt Unruhe mit? (Charakter prüfen) |
| Vorvertrag | ablösefrei | Beziehung zum alten Verein (K17), Spieler halbes Jahr im Konflikt |
| Leihe | Spieler testen, Talente parken | Gehaltsanteil, Kontrolle |

## 7. Verhalten der Computer-Vereine

- Bedarf, Planstellen, Budget und „erst kaufen, dann verkaufen“ kommen aus K31.
- Sie bewerten mit derselben Formel (5.1) und ihrem eigenen Scouting.
- Kleine Vereine verkaufen Stars nicht zu billig: Schmerzgrenze mit Stellenwert ×1,5 (Community-Kritik, Recherche 4).

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Konkurrenz bietet mit | anderer Verein bietet für dein Ziel | Info, Entscheidung: erhöhen oder aussteigen |
| Befund beim Medizincheck (Entscheidung) | 5.5 | nachverhandeln, Leistungsklausel, abbrechen |
| Spieler will nur zu dir | hohes Interesse, Wechselwunsch beim alten Verein | Preis sinkt, Stimmung beim alten Verein |
| Fan-Proteste gegen Verkauf | Publikumsliebling verkauft (K27) | Fanstimmung, Presse |
| Rückkehr des verlorenen Sohns | ehemaliger Spieler, Heimat | Interesse hoch, Fans freuen sich |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | Marktwert, Integration, Loyalität |
| K08 Jugend | Leihen mit Regeln |
| K10 Medizin | Medizincheck |
| K14 Kabine | Wechselwunsch, Rolle, Unruhe |
| K15 Gespräche | Versprechen „kein Konkurrent“ wird vor einem Angebot geprüft |
| K17 Beziehungen | Faktor im Vereinswert, Folgen von Spottangeboten |
| K18 Scouting | Schätzung statt wahrer Werte |
| K20 Transfers II | Abwerben, Bieterwettstreit, Deadline Day |
| K21, K22 | Vertrag, Berater, Provision |
| K23 Finanzen | Ablöse, Raten, Boni, Kosten |
| K28 Vorstand | Transferbudget, Ruf des Trainers |
| K29 Presse | Gerüchte, Interesse anderer |
| K31 Computer-Vereine | Bedarf, Planstellen, Budgets |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Faire Angebote | mindestens 80 % der Angebote für deine Spieler liegen zwischen 80 und 120 % des Marktwerts |
| Keine Mondpreise | keine Forderung über dem 1,8-Fachen des Marktwerts (außer Schlüsselspieler) |
| Symmetrie | bei Transfers zwischen Computer-Vereinen liegt die Ablöse im Schnitt bei 0,9–1,3 × Marktwert |
| Stars wählerisch | Spieler ab Stärke 85 wechseln in weniger als 5 % der Fälle zu einem Verein mit Ansehen unter 50 |
| Fenster | außerhalb der Fenster wird kein Wechsel wirksam, außer bei Vereinslosen |
| Transfers je Fenster | je Verein und Sommer 3–8 Zugänge (prüfen) |
| Halte | im Fenster höchstens zwei zusätzliche Halte pro Woche durch Transfers |

## 11. Stellschrauben

```js
transfers:{
  fenster:{sommer:['07-01','09-01'],winter:['01-01','02-01']},
  marktwert:{jeMerkmal:0.04,restlaufzeit:{1:0.6,2:0.85,3:1}},
  stellenwert:{verkauf:{schluessel:1.5,stamm:1.3,rotation:1,ueberhang:0.8},kauf:{besser:1.2,gleich:1,schlechter:0.7}},
  finanzlage:{knapp:0.9,reich:1.1},beziehung:0.0015,
  forderung:1.15,schmerzgrenze:0.95,unverkaeuflichAb:1.8,maxFaktor:1.8,
  runden:{kauf:4,verkauf:3},spott:0.6,anstaendig:0.8,preisdruck:{prozent:0.03,wochen:4},
  bestandteile:{rateJeJahr:0.05,raten:3,boni:0.5,weiterverkauf:0.2},
  antwortTage:{anfrage:[1,5],angebot:[1,3],spieler:[1,3]},
  medizin:{abTagen:60,abschlag:[0.10,0.30],kosten:5000},
  angebotKI:[0.85,1.0],wechselwunschAbschlag:0.9
}
```

`markt.forderung`, `markt.angebote`, `markt.ueberraschung`, `markt.interesse` und `markt.ernstAb` aus der heutigen `regeln.js` gehen darin auf.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Eine Formel für alle Vereine** beim Kaufen und Verkaufen, Ausreißer nur aus Schätzfehlern.
2. **Unverkäuflich ist nie absolut:** ab dem 1,8-Fachen wird verhandelt.
3. **Fenster** nach den echten Terminen 2026/27, danach verschoben wie die übrigen Termine.
4. **Abwerben, Bieterwettstreit im Detail und Deadline Day** bleiben in K20 (Welle 4).

**Noch zu recherchieren:** typische Zahl der Zugänge je Verein und Fenster, echte Transferfenster ab 2027 (FIFA-Änderungen, K21).

## Quellen

- Transferfenster 2026/27: [ran.de: Transferfenster 2026](https://ran.joyn.de/sports/fussball/bundesliga/deadline-day2026-welche-transferfenster-sind-noch-geoeffnet-86342) (aus K01)
- Spottangebote, Mondpreise, Preisdruck über die Zeit: `konzepte/_recherche-genre.md`, Abschnitte 3.1, 4, 4d
- Ablauf, Bestandteile, Medizincheck, weitere Transferarten: `konzepte/_rohmaterial-logik-v1.md`, Abschnitte 12.1, 12.2, 12.4
