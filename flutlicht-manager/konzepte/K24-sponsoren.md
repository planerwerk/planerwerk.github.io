# K24 – Sponsoren

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12. **Teilschritt K24a umgesetzt** (21. November 2026, `js/werbung.js`, Test `tests/werbung.js`): Werbeflächen Trikotbrust, Ausrüster und Ärmel mit je drei Angeboten in der heutigen Form (festes Geld, Fixum mit Siegprämie, drei Jahre), je Fläche höchstens ein Vertrag, Automatik je Fläche, ohne Wahl das erste Angebot vor dem ersten Pflichtspiel. **Vorläufig geldneutral:** Die drei Flächen teilen sich den bisherigen Brustbetrag (60 / 29 / 11 %), die Höhen aus §5.1 kommen erst mit K23, weil sie die ganze Wirtschaft verschieben. **Teilschritt K24b umgesetzt** (21. November 2026, `js/werbung.js`, `tests/werbung.js` Nr. 11 bis 17): je Fläche (auch die Brust) ein viertes Angebot eines umstrittenen Geldgebers nach §5.4 (30 % über dem besten festen Angebot, zwei Jahre, Fanstimmung −5 bei Vertragsschluss und −1 an jedem Monatsersten über den Baustein Entscheidungen aus K27, Skandal mit 5 % je Saison: Fans −10 und kostenlose Kündigung), Sponsorentag nach §4.3 (seit 22.11. auf Wunsch in drei Größen: klein 5.000 €, mittel 25.000 €, groß 50.000 € in der 1. Liga, in der 2. Liga die Hälfte, in der 3. ein Viertel; Zuschlag auf alle offenen Angebote gewürfelt in 5–7 %, 7–10 % oder 8–11 %; du siehst keine Zahl, nur „Erfolg“, „voller Erfolg“ oder „grandioser Erfolg“ nach der Lage des Wurfs in der Spanne; einmal je Saison; der Wurf hängt nur an der Saison, Neuladen mit einer anderen Größe bringt keinen neuen Wurf), Werbewert aus K25 (`S.mk.ww`) als Faktor auf neue Angebote (über dem Startwert bis +15 %, darunter bis −15 %). Die Automatik und der Vorstand nehmen nie den umstrittenen Geldgeber (§7), ohne deine Wahl bleibt alles geldneutral. **Teilschritt K24c umgesetzt** (21. November 2026, `tests/werbung.js` Nr. 18 bis 21): Zufriedenheit je Vertrag nach §5.3 (0–100, Start 50, zum Saisonende +5 je Platz über dem Ziel höchstens ±25, Fanstimmung und Werbewert je höchstens ±10, Abstieg −20), Verlängerungsangebot eines zufriedenen Partners ab 70 mit 10 % mehr für zwei Jahre, Abstiegsklausel nach §3.2 (laufende Verträge, die in die nächste Saison reichen, −40 %). **Teilschritt K24d umgesetzt** (26. November 2026 nachts, nach den Antworten in §12, `tests/werbung.js` Nr. 22 bis 26): Stadionname als vierte Fläche mit 12 % des Grundbetrags aus dem bisherigen Partneranteil (der sinkt von 37 auf 25 %), geldneutral. Angebote in derselben Form wie die übrigen Flächen, erfundene Namen aus erstem Wort der Firma und Arena, Park oder Stadion. Verkauf kostet Fanstimmung −3 − 3 × Fankultur (−3 bis −6), eine Verlängerung nicht. „Traditionsnamen behalten“ lässt die Angebote bis zur nächsten Saison verfallen, dann fehlen die 12 %. Geld als eigener Posten „Stadionname“ im Finanzbericht und in der Prognose. Ohne Wahl nimmt der Vorstand das erste Angebot, die Automatik das höchste feste. Computer-Vereine sind unverändert (sie verkaufen den Namen automatisch, ihr Geld bleibt gleich). Ältere Spielstände bekommen die Angebote am nächsten Tag nachgereicht. Noch offen: Bande und Partnerpool, Trainingskleidung, Verhandeln mit Reglern, Ausstieg des Sponsors unter 30, Ereignisse aus §8 als Karten, Presse beim Skandal, Computer-Vereine nach §7, Marketingleiter (K16).
**Höhe seit K23c** (22.11.2026, popolupo, ohne Testlauf, K23 §5.6b): Der Grundbetrag der Werbung wächst exponentiell mit dem Ansehen (1. Liga im Schnitt etwa 53 Mio. € je Saison, echt 57). Brust 38 %, Ausrüster 18 %, Ärmel 7 % nach den Zielanteilen in §3.1, die übrigen 37 % zahlen weitere Sponsoren je Ligaspiel ohne Verhandlung (Buchung „Weitere Sponsoren“). Bayern bekäme so etwa 75 Mio. € für die Brust (§5.1: etwa 60 Mio.). Die Regeln der Angebote, Verlängerungen und Klauseln bleiben.

Hängt ab von: K23 (Finanzen), K27 (Fans), K25 (Marketing) · Wird gebraucht von: K12b, K23, K30.

## 1. Ziel und Spielgefühl

- **Sponsoren verhandeln statt nur auswählen:** ganz oben auf der Wunschliste der FM-Community (Recherche 4).
- **Begrenzte Werbeflächen:** Brust, Ärmel, Ausrüster, Stadionname, Bande, Partnerpool. „43 Sponsoren in einer Saison ist unrealistisch“ (Recherche 4b).
- **Abwägungen:** sicheres Fixum oder Prämien, kurze oder lange Laufzeit, viel Geld von einem umstrittenen Geldgeber oder weniger von einem beliebten.

## 2. Vorbilder und Abgrenzung

- **Anstoss 3:** Sponsorentag einmal pro Saison bringt bessere Angebote (PLAN §4). Übernommen.
- **Heute im Spiel:** drei Angebote zum Saisonwechsel (Fixum, Fixum mit Siegprämie, drei Jahre). Bleibt als Grundform für die Brust.
- **Bewusst anders:** Sponsoren sind erfunden (Namensliste gibt es in `daten/vereine.js`).

## 3. Begriffe und Daten

### 3.1 Werbeflächen

| Fläche | Plätze | Anteil an den Werbeerlösen (1. Liga, Ziel) |
|---|---|---|
| Trikotbrust (Hauptsponsor) | 1 | 35–45 % |
| Ausrüster (Trikot, Ausrüstung, Fanartikel-Lizenz) | 1 | 15–25 % |
| Ärmel | 1 | 5–10 % |
| Stadionname | 1 (nur mit eigenem oder gepachtetem Stadion) | 10–15 % |
| Bande und Partnerpool | 10–30 Partner in Stufen | 15–25 % |
| Trainingskleidung | 1 | 2–5 % |

### 3.2 Angebot

| Teil | Bereich |
|---|---|
| Fixum pro Jahr | € |
| Prämien | Sieg, Tabellenplatz, Aufstieg, Pokalrunde, später Europapokal |
| Laufzeit | 1–5 Jahre |
| Klauseln | Abstieg (−40 % oder Ausstieg), Mindestliga, Verlängerungsoption |
| Image | seriös, neutral, umstritten |
| Fanakzeptanz | wie die Fans den Sponsor sehen (K27) |

Gespeichert als `S.sponsoren` je Fläche (heute nur `S.spons` für die Brust).

## 4. Abläufe

1. **Saisonwechsel:** Für jede freie Fläche kommen 2–4 Angebote (für die Brust wie heute).
2. **Verhandeln:** Stell-Regler für Fixum, Prämienanteil und Laufzeit, unscharfe Annahmezone (K35a). Höchstens drei Runden. Konkurrenzangebote heben den Preis.
3. **Sponsorentag** (K12b, einmal pro Saison in der Vorbereitung): kostet 50.000 € und einen Tag, danach sind die nächsten Angebote 10 % besser. Ein guter **Marketingleiter** (K16 §12 Nr. 14, seit 10.11.) bringt bis zu 10 % mehr, beides zusammen höchstens 18 %.
4. **Laufend:** Prämien bei Erfüllung, Monatsrate des Fixums (K23).
5. **Vertragsende:** Verlängerungsangebot des Sponsors nach Zufriedenheit (5.3).

## 5. Regeln und Formeln

### 5.1 Wert einer Fläche

```
Wert = Basis(Fläche, Liga) × Reichweite × Erfolg × Image × Markt
Reichweite = (Ansehen/70)^4 × (0,7 + 0,3 × Fans/Ligaschnitt)
```

- **Basis Trikotbrust:** 1. Liga 12 Mio. €, 2. Liga 2,5 Mio. €, 3. Liga 0,6 Mio. € (Spielwerte, abgestimmt auf die Spanne unten).
- **Erfolg:** Platz der letzten Saison gegenüber der Erwartung, ±20 %.
- **Image:** umstrittene Sponsoren zahlen +30 %, seriöse −0 %.
- **Markt:** 1,0 bis 1,3 nach Zahl der Interessenten, Sponsorentag +10 %.
- **Nachgerechnet:** Ansehen 99 mit doppeltem Fanschnitt ergibt etwa 62 Mio. €, Ansehen 50 mit halbem Fanschnitt etwa 2,7 Mio. €. Mit Exponent 2 wäre die Spanne viel zu eng gewesen (etwa 1 zu 5).
- **Echte Spanne als Ziel:** Hauptsponsoren in der 1. Liga von etwa 2,5 Mio. € (kleinster Verein) bis 60–65 Mio. € (Bayern, Schätzung), Dortmund etwa 30 Mio. €, Frankfurt etwa 13 Mio. € (Quellen).

### 5.2 Fixum gegen Prämie

- Ein Sponsor zahlt bei hohem Prämienanteil im Erwartungswert 10 % mehr als beim reinen Fixum (wie heute 0,65 Fixum + 1,3 Siegprämie). Wer an seine Mannschaft glaubt, verdient mehr, wer danebenliegt, weniger.

### 5.3 Zufriedenheit des Sponsors

- Steigt mit Erfolg, Fans (K27), Medienpräsenz (K29), Aktionen (K25), sinkt mit Skandalen und Abstieg.
- Über 70: Verlängerung mit +10 %. Unter 30: kein Angebot, eventuell Ausstieg über eine Klausel.

### 5.4 Umstrittene Sponsoren

- Fanstimmung −5 bei Vertragsschluss, −1 je Monat (K27). Protestgefahr (Ereignis).
- Skandalrisiko 5 % pro Saison: dann Presse (K29), Fanstimmung −10, Ausstieg möglich.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| hart verhandeln | mehr Geld | Sponsor sucht sich eventuell einen anderen Verein |
| Prämien statt Fixum | mehr Geld bei Erfolg | Risiko |
| lange Laufzeit | Sicherheit | steigt dein Wert, bist du unter Preis gebunden |
| umstrittener Sponsor | viel Geld | Fans, Skandalrisiko |
| Stadionname verkaufen | Geld | Fans mögen es oft nicht (−3 Fanstimmung, Traditionsvereine −6) |
| Sponsorentag | bessere Angebote | Geld, ein Tag |

## 7. Verhalten der Computer-Vereine

Gleiches Modell. Sie nehmen das beste Angebot nach Profil (sparsam: Fixum, ehrgeizig: Prämien), Traditionsvereine meiden umstrittene Sponsoren und Stadionnamen.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Sponsor-Skandal (PLAN §4) | 5.4 | Presse, Fans, Ausstiegsrecht |
| Sponsor in Not | Zufall, selten | Zahlungen stocken, Ausstieg |
| Sponsor will mitreden (Entscheidung) | großer Sponsor, Zufall | Spieler zu einem Termin schicken (Frische −, Stimmung −) oder ablehnen (Zufriedenheit −) |
| Fanprotest gegen Stadionnamen | Verkauf des Namens, Traditionsverein | Fanstimmung, Presse |

## 9. Wechselwirkungen

K12b (Sponsorentag), K23 (Werbeerlöse), K25 (Aktionen erhöhen die Zufriedenheit), K26 (Stadionname, Logen), K27 (Fanakzeptanz), K29 (Medienpräsenz), K30 (Karten), K35a (Stell-Regler).

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Werbeanteil | 22–28 % der Einnahmen in der 1. Liga (K23) |
| Spanne Hauptsponsor | 1. Liga etwa 2,5 bis 65 Mio. €, Verhältnis größter zu kleinster etwa 20–25 |
| Flächen | nie mehr als die Plätze aus 3.1 |
| Prämien lohnen | für einen Verein, der seine Erwartung trifft, bringen Prämienverträge im Schnitt 5–10 % mehr |

## 11. Stellschrauben

```js
sponsoren:{
  flaechen:{brust:1,ausruester:1,aermel:1,stadion:1,training:1,partner:[10,30]},
  basis:{brust:{1:12e6,2:2.5e6,3:0.6e6},anteile:{ausruester:0.5,aermel:0.2,stadion:0.35,training:0.08,partner:0.6}},
  reichweite:{ansehenRef:70,exp:4,fans:0.3},erfolg:0.2,image:{umstritten:1.3},markt:[1,1.3],sponsorentag:{kosten:50000,plus:0.1},
  praemieMehrwert:0.1,zufriedenheit:{verlaengernAb:70,plus:0.1,keinAngebotUnter:30},
  umstritten:{fans:-5,fansMonat:-1,skandal:0.05},stadionname:{fans:-3,tradition:-6}
}
```

`finanzen.sponsor` aus der heutigen `regeln.js` geht darin auf.

## 12. Offene Fragen

**Vorläufig entschieden:** begrenzte Flächen nach 3.1, erfundene Sponsoren, Sponsorentag als feste Option in der Vorbereitung, Stadionname nur mit eigenem oder gepachtetem Stadion. Seit K24a (21.11.): Ausrüster und Ärmel gehören zum Bereich `sponsor` (A-Lizenz) und nutzen dieselbe Angebotsform wie die Brust, Anteile am bisherigen Brustbetrag 60 / 29 / 11 % (geldneutral bis K23), eigener Zufallsstrom `werbung` je Saison und Fläche. Seit K24b (21.11.): Der umstrittene Geldgeber ist ein viertes Angebot je Fläche (Name ohne Zufall aus Saison und Fläche, damit der Grundstrom der Brust unberührt bleibt), Skandal im Strom `werbSkandal` je Saison und Fläche, Kündigung nur nach einem Skandal. Der Sponsorentag hebt die offenen Angebote nachträglich (statt nur die nächsten), weil Angebote zum Saisonwechsel kommen und der Tag in der Vorbereitung liegt. Seit 22.11. gewürfelt im Strom `sponsorentag` je Saison, Rückmeldung nur als Text (Wunsch: „stumpf 10 % ist langweilig“, der Spieler soll die Zahl nicht sehen). Werbewert: 0,4 % je Punkt über oder unter dem Startwert aus K25, höchstens ±15 %. Seit K24c (21.11.): Die Laufzeit der Brust zählt zusammen mit den übrigen Flächen in `werbungSaison` herunter (vorher in `saison.js`), damit das Verlängerungsangebot für alle Flächen gleich entsteht. Unter 30 Zufriedenheit gibt es vorerst nur kein Verlängerungsangebot, ein Ausstieg des Sponsors folgt später.

**Noch zu recherchieren:** Ärmel- und Namensrechte-Erlöse in der Bundesliga, Sponsoring in 2. und 3. Liga.

**Vor K24d zu entscheiden** (26.11. abends, Claude; deshalb noch nicht begonnen):
1. **Wem gehört das Stadion?** §3.1 erlaubt den Stadionnamen nur mit eigenem oder gepachtetem Stadion. Im Spiel gibt es dafür kein Feld, die Daten nennen auch keine Stadionnamen. Vorschlag: Feld `stadionEigen` (eigen, gepachtet, Stadt) je Verein nach Recherche, bei „Stadt“ geht ein Teil des Erlöses an die Stadt.
2. **Woher kommt das Geld?** Seit K23c zahlen „weitere Sponsoren“ automatisch 37 % des Grundbetrags (`RF.werbung.partner`). Vorschlag geldneutral wie bei K24a: Stadionname 12 % daraus, Bande und Partnerpool bleiben automatisch. Wer den Namen nicht verkauft, bekommt dann weniger als heute, das verschiebt das `finanzmodell`. Deshalb nur abgestimmt mit der Kalibrierung von K23 (popolupo).
3. **Traditionsvereine:** §6 nennt −6 statt −3 Fanstimmung. Ein Merkmal „Traditionsverein“ gibt es nicht. Vorschlag: aus Ansehen, Gründungsjahr und Mitgliedern ableiten oder als Liste in den Daten pflegen.
4. **Name:** erfundener Sponsorname plus Wort (zum Beispiel „Falkner-Arena“), echte Stadionnamen nicht (Marken, siehe `konzepte/_luecken.md` L2).

**Antworten dazu** (26.11. nachts, popolupo, vorläufig; K24d kann damit beginnen):
1. **Eigentum:** Ein Feld je Verein lohnt erst mit Recherche für alle 56 Vereine. Bis dahin darf jeder Verein den Namen verkaufen und bekommt den vollen Erlös. Das Feld `stadionEigen` kommt später, wenn die Recherche da ist. Dann geht bei „Stadt“ ein Teil an die Stadt.
2. **Geld:** einverstanden, geldneutral, 12 % aus dem Partneranteil (`RF.werbung.partner`).
   - Computer-Vereine verkaufen den Namen automatisch. Damit bleibt das `finanzmodell` für sie unverändert, und die laufende Kalibrierung von K23 (Ligaklausel, Verwaltung) ist nicht berührt.
   - Nur dein Verein verliert die 12 %, wenn du den Namen nicht verkaufst. Das ist der gewollte Tausch zwischen Tradition und Geld.
   - Bitte den Anteil als eigenen Posten im Finanzbericht zeigen, damit die KURZ-Zeilen ihn trennen können.
3. **Traditionsvereine:** keine neue Liste. Ableitung aus der vorhandenen Fankultur (K27d, `fankulturWirkung` 0 bis 1): Fanstimmung −3 − 3 × Fankultur, also −3 bei schwacher und −6 bei stärkster Fankultur. Die Fankultur enthält schon Mitglieder und Auslastung. Das Gründungsjahr (`gegr`) bleibt Anzeige.
4. **Name:** einverstanden.

## Quellen

- Hauptsponsoren-Erlöse (Schätzungen): [90min.de: So viel kassieren die Bundesligisten vom Hauptsponsor](https://www.90min.de/bayern-an-der-spitze-so-viel-kassieren-die-bundesligisten-von-ihrem-hauptsponsor), [leinetal24.de: Bundesliga-Vergleich Hauptsponsor](https://www.leinetal24.de/sport/fussball/bundesliga-vergleich-so-viel-kassiert-eintracht-frankfurt-vom-hauptsponsor-zr-94404426.html)
- Sponsorenverhandlungen, begrenzte Werbeflächen: `konzepte/_recherche-genre.md`, Abschnitte 4, 4b
- Sponsorentag: PLAN §4 (GameStar 4/2000)
