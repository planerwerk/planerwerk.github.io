# K21 – Verträge und Gehälter

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache, **ergänzt am 10. November 2026** um Punkt-, Auflauf-, Aufstiegs- und Klassenerhaltsprämien, Ligaklausel und Verhandlung nach Charakter (deine Entscheidung: echte Vertragsverhandlungen mit Prämien). Vorläufige Entscheidungen stehen in Abschnitt 12.
**Stand im Spiel (10.11.):** noch keine Verhandlung. Es gibt nur Laufzeit und Grundgehalt, eine feste Forderung mit dem Knopf „Verlängern“ (seit U8 teurer bei schlechter Stimmung, unter 25 gar nicht) und Handgeld für Vereinslose. Gebaut wird das Konzept mit U10.
Hängt ab von: K14 (Stimmung, Rollen), K15 (Gespräche), K28 (Gehaltsrahmen) · Wird gebraucht von: K19, K20, K22, K23, K31.

## 1. Ziel und Spielgefühl

- **Verträge sind Planung:** Wer läuft wann aus? Wen verlängere ich früh, wen lasse ich gehen? Was kostet mich der Kader nächstes Jahr?
- **Klauseln mit Wirkung:** Ausstiegsklausel, Abstiegsklausel, versprochene Rolle, Zielvorgaben. Jede Klausel ist ein Tausch: der Spieler unterschreibt eher, du gibst etwas auf.
- **Gehaltsgefüge zählt:** Wer deutlich weniger verdient als ein gleich starker Mitspieler, wird unzufrieden.
- **Auslaufende Verträge haben Folgen:** Wer zu spät redet, verliert den Spieler ablösefrei (Anstoss 3, PLAN §4).

## 2. Vorbilder und Abgrenzung

- **Football Manager:** Klauseln (Ausstiegsklausel, Mindestablöse), Berater, Prämien. Community-Wünsche: konsistente Gehaltsforderungen zwischen ähnlichen Vereinen, Vorverträge, individuelle Zielvorgaben im Vertrag, unerwünschte Spieler leichter loswerden (Recherche 3.1, 4b).
- **Echte Regeln:** Verträge höchstens fünf Jahre, für Spieler unter 18 höchstens drei (FIFA, Artikel 18, Quellen). Mit einem Vertrag, der in höchstens sechs Monaten ausläuft, darf ein Spieler mit anderen Vereinen abschließen (nach meinem Wissen, mit der Suche nicht bestätigt). Ab 2027 plant die FIFA Änderungen am Transfersystem.
- **Echte Prämien in deutschen Profiverträgen** (Beispiele aus Urteilen und Berichten): Punkteinsatzprämie (Geld je Punkt der Mannschaft, nur bei Startelf oder mindestens 45 Minuten als Einwechselspieler, in einem Zweitligafall 2.500 € je Punkt, mit Nachzahlung bei einem Platz unter den ersten sechs), Auflaufprämie (voll bei Einsatz von Beginn an oder ab der Halbzeit, halb bei späterer Einwechslung), Prämien nur bei Klassenerhalt, Aufstiegsprämien nach Zahl der Einsätze (HSV). Gehälter gelten oft je Liga: Für die 2. Liga liefen Verträge in Köln mit 40–50 % weniger Gehalt weiter, die Beispiele streuen von etwa 20 bis 50 %.
- **Genre:** In den Komplettlösungen zum Fussball Manager 06/07 wird geraten, einem Spieler mit hoher Forderung ein niedrigeres Grundgehalt plus Prämien für Meisterschaft oder Europapokal anzubieten. Wie ran Trainer Verträge gelöst hat, konnte ich nicht belegen.
- **Bewusst anders:** Verhandlung mit einem Stell-Regler und unscharfer Annahmezone (K35a) statt Zahlenraten.

## 3. Begriffe und Daten

### 3.1 Vertragsteile

| Teil | Bereich | heute |
|---|---|---|
| Laufzeit | bis 30. Juni eines Jahres, 1–5 Jahre (unter 18 höchstens 3) | Restlaufzeit `ct` in Jahren |
| Grundgehalt | € pro Jahr | `sal` |
| Handgeld (Unterschriftsprämie) | einmalig bei Unterschrift, auch bei Verlängerung und Wechsel | gibt es nur für Vereinslose |
| Auflaufprämie | € je Pflichtspiel: voll bei Startelf oder Einwechslung bis zur Halbzeit, halb bei späterer Einwechslung | neu (ersetzt die Einsatzprämie aus dem ersten Entwurf) |
| Punktprämie | € je Punkt der Mannschaft, nur bei Startelf oder mindestens 45 Minuten Einsatz | neu |
| Torprämie / Zu-Null-Prämie | € je Tor oder je Spiel ohne Gegentor (Torhüter, Abwehr ab 60 Minuten) | neu |
| Vorlagenprämie | € je Torvorlage | neu, braucht Vorlagen in der Engine (gibt es noch nicht) |
| Aufstiegsprämie | einmalig beim Aufstieg, gestaffelt nach Einsätzen der Saison (ab 10, ab 20) | neu |
| Klassenerhaltsprämie | einmalig beim Klassenerhalt, gestaffelt wie oben | neu |
| Titelprämie | einmalig für Meisterschaft, Pokalsieg (später Europapokal) | neu |
| Ligaklausel | Gehalt je Liga: bei Abstieg −20 bis −50 %, bei Aufstieg +20 bis +100 % | neu (die Abstiegsklausel mit Kürzung geht darin auf) |
| Treueprämie | einmalig, wenn er den Vertrag bis zum Ende erfüllt | neu |
| Ausstiegsklausel | Betrag, ab einem Datum | neu |
| Abstiegsklausel | bei Abstieg Recht zu gehen (die Gehaltskürzung steht seit 10.11. in der Ligaklausel) | neu |
| Verlängerungsoption | Verein darf um ein Jahr verlängern | neu |
| versprochene Rolle | Kaderrolle aus K14 bis Vertragsende | neu |
| Zielvorgabe | zum Beispiel „ab 25 Einsätzen Gehalt +10 %“ oder „ab 20 Einsätzen ein Jahr länger“ | neu |
| Weiterverkaufsbeteiligung | Anteil an einer späteren Ablöse für den abgebenden Verein | neu, mit K19 |

Gespeichert am Spieler als `vertrag = {bis, gehalt, praemien, klauseln}`. `ct` und `sal` gehen darin auf.

### 3.2 Teamprämien

Sieg-, Klassenerhalts-, Aufstiegs- und Pokalprämien legt der Verein für die ganze Mannschaft fest (Saisonbeginn, K12b). Sie wirken auf die Stimmung (K14, Baustein „Erfolg“) und kosten Geld (K23).

## 4. Abläufe

1. **Verlängerung:** Gespräch über die Spielerkarte oder K15. Angebot mit Stell-Reglern für Laufzeit, Gehalt, Prämien und Klauseln. Antwort sofort (bei Berater nach 1–3 Tagen, K22).
2. **Verhandlungsrunden:** höchstens drei. Jede abgelehnte Runde senkt die Stimmung leicht (−2), die Forderung bleibt. Nach drei Runden ist das Gespräch für vier Wochen vertagt.
3. **Letztes halbes Jahr** (ab 1. Januar vor Vertragsende): Andere Vereine dürfen mit dem Spieler verhandeln. Ein Vorvertrag woanders kommt als Meldung, ohne Vorwarnung, wenn du nicht geredet hast (Anstoss 3).
4. **30. Juni:** Verträge laufen aus. Spieler ohne neuen Vertrag sind vereinslos (gibt es so) oder wechseln ablösefrei zu ihrem Vorvertragsverein.
5. **Ausstiegsklausel:** Ein Verein, der den Betrag bietet, darf direkt mit dem Spieler verhandeln. Du kannst nichts tun außer ihn zum Bleiben zu überreden (K15).
6. **Auflösung:** im Einvernehmen mit Abfindung (gibt es: Gehalt × Restlaufzeit × 0,5) oder gegen eine Ablöse (K19).

## 5. Regeln und Formeln

### 5.1 Gehaltsforderung

```
Forderung = Grundwert(Stärke, Alter) × Liga × Ruf × Markt × Berater × Stimmung × Loyalität
```

- **Grundwert:** wie heute `salaryFor` (exponentiell nach Stärke), dazu Alter: bis 23 ×0,8, 24–30 ×1, ab 31 ×0,9.
- **Liga:** Erwartung an die Liga des neuen Vereins (1. Liga ×1, 2. ×0,45, 3. ×0,2). Gleiche Spieler fordern also bei ähnlichen Vereinen ähnlich viel (Community-Wunsch).
- **Ruf:** Nationalspieler ×1,2, Talente mit hohen Sternen ×1,1.
- **Markt:** mehrere Interessenten ×1,1 bis ×1,3 (K19).
- **Berater:** gierig ×1,15, seriös ×1, verschwiegen ×1,05 (K22).
- **Stimmung:** unter 40 ×1,2, unter 25 verlängert er nicht (K14 §5.3).
- **Loyalität:** vereinstreu ×0,9, Söldner ×1,2 (K03).
- Eine **unscharfe Annahmezone** (K35a) zeigt, wo die Zusage wahrscheinlich ist. Breite nach Kenntnis und Sportdirektor (K16).

### 5.1a Prämien in der Verhandlung (ergänzt 10.11.)

- **Der Spieler rechnet mit dem Erwartungswert,** mit Abschlag nach Sicherheitsbedürfnis: Er schätzt Einsätze, Punkte und Tore aus seiner Rolle und Form der letzten Saison. Eine Prämie ist ihm so viel wert wie ihr Erwartungswert × (0,6 bis 1,0). Mutige (hohe Druckresistenz, Ehrgeiz) nehmen eher Prämien statt Grundgehalt, vorsichtige wollen Grundgehalt.
- **Was ihm wichtig ist, hängt vom Charakter ab:** Söldner Grundgehalt und Handgeld, Ehrgeizige Rolle und Titelprämien, Vereinstreue Laufzeit und Treueprämie, Ältere lange Laufzeit, Junge Einsatzzeit und kurze Laufzeit, Diven Rolle und Rang im Gehaltsgefüge.
- **Kostenvorschau für dich:** Zu jedem Angebot zeigt das Spiel, was die Prämien bei einer erwarteten Saison kosten und was im besten Fall (alle Spiele, Aufstieg oder Titel). Die Vorschau ist so unscharf wie die Einschätzung des Sportdirektors (K16).
- **Ligaklausel:** Wer bei Abstieg auf Gehalt verzichtet, verlangt dafür etwas: höheres Grundgehalt (+5 %), Ausstiegsrecht oder höhere Aufstiegsprämie. Ohne Klausel läuft das volle Gehalt in der tieferen Liga weiter (K23: größtes Risiko beim Abstieg).
- **Prämien hängen am Einsatz:** Wer auf der Bank sitzt, bekommt keine Auflauf- und Punktprämie. Das macht den Bankplatz teurer für die Stimmung (K14, Baustein „Vertrag“, Söldner doppelt) und passt zur Bankzeit nach Grund (K14 §12): Bei Schonung zahlt der Verein die Punktprämie trotzdem (Klausel, die der Spieler fordern kann).
- **Teamprämien** (Sieg, Klassenerhalt, Aufstieg, Pokal, §3.2) legt der Verein vor der Saison fest. Individuelle Prämien im Vertrag kommen obendrauf.

### 5.2 Klauseln als Tausch

| Klausel | macht die Unterschrift wahrscheinlicher wie | Preis für dich |
|---|---|---|
| Ausstiegsklausel | Gehalt −10 % akzeptiert | Spieler kann für den Betrag gehen |
| versprochene Rolle | Gehalt −10 % akzeptiert | Versprechen (K15), Stimmung bei Bruch |
| Zielvorgabe | Gehalt −5 % akzeptiert | Mehrkosten bei Erfolg |
| Verlängerungsoption | – (Spieler mögen das nicht) | Gehalt +5 % nötig |
| Abstiegsklausel mit Gehaltskürzung | – | Gehalt +5 % nötig, schützt die Finanzen |
| Abstiegsklausel mit Ausstiegsrecht | Gehalt −5 % akzeptiert | Spieler geht beim Abstieg |
| lange Laufzeit | ältere Spieler wollen lang, junge kurz | – |

### 5.3 Gehaltsgefüge

- Jeder Spieler vergleicht sein Gehalt mit Mitspielern ähnlicher Stärke (±3) im Kader.
- Liegt er mehr als 25 % darunter: Baustein „Vertrag“ in K14 bis −10.
- Ein **Großverdiener** (doppelt so viel wie der Nächste) lässt alle anderen leicht fordernder werden (Forderungen ×1,05 bei der nächsten Verlängerung).

### 5.4 Wann der Spieler verlängern will

| Lage | Bereitschaft |
|---|---|
| Stimmung über 60, Rolle passt | gern, zu fairen Bedingungen |
| Stimmung 40–60 | nur zu besseren Bedingungen |
| Stimmung 25–40 | nur deutlich besser, oder mit Ausstiegsklausel |
| Stimmung unter 25 | gar nicht |
| großer Verein interessiert (K19) | wartet ab, Forderung steigt |

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| früh verlängern | Sicherheit, oft billiger | Risiko, wenn der Spieler nachlässt |
| auslaufen lassen | Gehalt frei | Spieler geht ablösefrei |
| Klauseln anbieten | Unterschrift wahrscheinlicher | siehe 5.2 |
| Prämien statt Grundgehalt | zahlt nur bei Leistung | Mehrkosten bei Erfolg |
| Gehaltsgefüge im Blick | ruhige Kabine | Disziplin bei Neuzugängen |
| Auflösung | unerwünschte Spieler loswerden (Community-Wunsch) | Abfindung |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln. Sie verlängern Stammspieler früh (im letzten Jahr bis Dezember), lassen ältere Reservisten auslaufen (heute: `saison.vertrag.verlaengern` 70 %).
- Sie nutzen Ausstiegsklauseln anderer Vereine, wenn ein Spieler in ihre Planstellen passt (K31).
- Vorverträge mit Spielern anderer Vereine im letzten halben Jahr nach Bedarf (K31).

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Vorvertrag woanders | eigener Spieler im letzten halben Jahr, kein Gespräch, Interesse eines anderen Vereins | Info, Spieler geht ablösefrei |
| Ausstiegsklausel gezogen | Verein bietet den Betrag | Spieler verhandelt, Gespräch (K15) als letzte Chance |
| Gehaltsneid (Entscheidung) | Spieler weit unter dem Gefüge, Stimmung sinkt | Gehalt erhöhen, erklären (K15), ignorieren |
| Zielvorgabe erreicht | Klausel greift | Info, Kosten |
| Berater droht mit Wechsel | gieriger Berater, Verlängerung stockt (K22) | Druck, Presse (K29) |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | Loyalität, Söldner, vereinstreu, Alter |
| K14 Kabine | Baustein „Vertrag“, versprochene Rolle, Gehaltsgefüge |
| K15 Gespräche | Verlängerung anbieten, Versprechen |
| K16 Stab | Sportdirektor-Automatik, Breite der Annahmezone |
| K19, K20 | Ablöse, Ausstiegsklausel, Vorverträge, Weiterverkaufsbeteiligung |
| K22 Berater | Einfluss auf Forderung und Tempo |
| K23 Finanzen | Gehälter, Prämien, Handgeld, Abfindungen |
| K28 Vorstand | Gehaltsrahmen, Nebenziel „Gehaltssumme“ |
| K31 | Verträge der Computer-Vereine |
| K35a | Stell-Regler mit unscharfer Annahmezone |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Konsistenz | zwei gleich starke, gleich alte Spieler fordern bei ähnlichen Vereinen Gehälter innerhalb von ±15 % |
| ablösefreie Wechsel | je Liga und Saison 15–35 Spieler (prüfen) |
| Ausstiegsklauseln | werden pro Saison ligaweit 1–5-mal gezogen (Spielwert) |
| Verlängerung | zufriedene Stammspieler verlängern in mindestens 80 % der Fälle, wenn man rechtzeitig redet |
| Gehaltsgefüge | ein Spieler 30 % unter dem Gefüge verliert über eine Halbserie spürbar Stimmung |

## 11. Stellschrauben

```js
vertraege:{
  laufzeit:{max:5,maxU18:3},vorvertragMonate:6,runden:3,rundeStimmung:-2,vertagtWochen:4,
  forderung:{alter:[[23,0.8],[30,1],[99,0.9]],liga:{1:1,2:0.45,3:0.2},national:1.2,talent:1.1,markt:[1.1,1.3],
    berater:{gierig:1.15,serioes:1,verschwiegen:1.05},stimmung:[[40,1.2],[25,null]],treu:0.9,soeldner:1.2},
  klauseln:{ausstieg:-0.10,rolle:-0.10,ziel:-0.05,option:0.05,abstiegKuerzung:0.05,abstiegAusstieg:-0.05,kuerzung:0.3},
  gefuege:{spanne:3,unter:0.25,minus:-10,grossverdiener:2,ansteckung:1.05},
  praemien:{auflauf:{halbAbMinute:46,halb:0.5},punkt:{startelfOderMinuten:45},zuNull:{abwehrAbMinuten:60},aufstieg:{staffel:[10,20]},klasse:{staffel:[10,20]},
    erwartung:{abschlag:[0.6,1.0]},liga:{abstieg:[-0.5,-0.2],aufstieg:[0.2,1.0]},schonungPunktpraemie:true},
  bereitschaft:[[60,'gern'],[40,'besser'],[25,'deutlich'],[0,'nein']]
}
```

`spieler.vertrag`, `spieler.gehalt`, `markt.gehalt` und `saison.vertrag` aus der heutigen `regeln.js` gehen darin auf.

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Höchstens drei Verhandlungsrunden,** danach vier Wochen Pause.
2. **Teamprämien** legt der Verein für alle fest, individuelle Prämien stehen im Vertrag.
3. **Abstiegsklausel** in zwei Formen (Kürzung oder Ausstiegsrecht).
4. **Weiterverkaufsbeteiligung** kommt mit K19.

**Mit dir entschieden (10. November 2026):** Es gibt echte Vertragsverhandlungen mit Prämien, unter anderem für Auf- und Abstieg und für Tore. Gebaut wird das mit U10.

**Vorläufig entschieden bei der Ergänzung (10.11.):**
5. **Auflaufprämie statt Einsatzprämie,** dazu Punktprämie, Torprämie, Zu-Null-Prämie, Aufstiegs-, Klassenerhalts- und Titelprämie, Handgeld bei jeder Unterschrift, Treueprämie. Die Vorlagenprämie kommt erst, wenn die Engine Vorlagen zählt.
6. **Ligaklausel statt Abstiegsklausel mit Kürzung:** Gehalt je Liga, Abstieg −20 bis −50 %, Aufstieg +20 bis +100 %. Die Spanne ist aus wenigen Beispielen geschätzt.
7. **Prämien nach Erwartungswert mit Abschlag nach Sicherheitsbedürfnis,** Wichtigkeit der Vertragsteile nach Charakter (5.1a).
8. **Bei Schonung zahlt der Verein die Punktprämie** nur, wenn das im Vertrag steht. Der Spieler kann es fordern.
9. **Lernstufen (K36):** Verlängern mit Laufzeit und Grundgehalt ab der B-Lizenz, Prämien und Klauseln ab der A-Lizenz. Bis dahin verhandelt der Verein nach den Regeln der Computer-Vereine.

**Noch zu recherchieren:** Vorvertrags-Regel sechs Monate (FIFA-Text), mögliche FIFA-Änderungen ab 2027, Zahl ablösefreier Wechsel je Liga.

## Quellen

- Höchstlaufzeit fünf Jahre, unter 18 drei Jahre, Änderungen ab 2027: [Kaufman & Canoles: FIFA's 2027 transfer system overhaul](https://www.kaufcan.com/newsroom/news/sports-entertainment-client-alert-fifas-2027-transfer-system-overhaul), [Cuatrecasas: FIFA revoluciona el sistema de traspasos](https://www.cuatrecasas.com/es/spain/deporte/art/fifa-revoluciona-sistema-traspasos)
- Auslaufende Verträge ohne Vorwarnung: PLAN §4 (GameStar 4/2000)
- Klauseln, Vorverträge, Zielvorgaben, Konsistenz der Forderungen: `konzepte/_recherche-genre.md`, Abschnitte 3.1 und 4b
- Punkteinsatzprämie nur bei Startelf oder 45 Minuten, Nachzahlung nach Tabellenplatz, Auflaufprämie halb bei später Einwechslung, Prämie nur bei Klassenerhalt: [Heuking: Individuelle Punkt-Einsatzprämie](https://www.heuking.de/de/news-events/newsletter-fachbeitraege/artikel/individuelle-punkt-einsatzpraemie-fuer-bundesligaspiele.html), [otto-schmidt.de: Punktprämie nur bei Spieleinsatz](https://www.otto-schmidt.de/news/arbeits-und-sozialrecht/profifussballer-punktpramie-nur-bei-spieleinsatz-2026-06-26.html), [betriebsrat.de: Punktprämie trotz Ersatzbank?](https://www.betriebsrat.de/rechtsprechung/br/urteil/profifussball-punktpraemie-trotz-ersatzbank) (10.11., Zusammenfassungen der Suchergebnisse)
- Aufstiegsprämien nach Einsätzen beim HSV: [ran.de](https://ran.joyn.de/sports/fussball/2-bundesliga/2-bundesliga-hsv-spieler-kassieren-offenbar-ordentlich-ab-auch-ex-funktionaere-wuerden-von-aufstieg-profitieren-76801)
- Gehalt in der 2. Liga 40–50 % niedriger beim 1. FC Köln, rechtliche Grenzen von Abstiegsklauseln: [Ligainsider: Klauseln für den Abstiegsfall](https://www.ligainsider.de/1-fc-koeln/15/1-fc-koeln-diverse-spieler-mit-klauseln-fuer-den-abstiegsfall-302583/), [Bird & Bird: Abstiegsklauseln im Profisport](https://cm.twobirds.com/en/insights/2025/zwischen-bestimmtheit-und-transparenz-die-rechtlichen-fallstricke-von-abstiegsklauseln-im-profisport)
- Grundgehalt plus Prämien als Verhandlungstipp im Genre: [Gameswelt: Fussball Manager 07, Grundlagentipps](https://www.gameswelt.de/fussball-manager-2007/komplettloesung/fussball-manager-07-grundlagentipps-1729/12)
