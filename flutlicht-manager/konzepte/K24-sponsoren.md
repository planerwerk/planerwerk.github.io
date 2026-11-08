# K24 – Sponsoren

Status: **Entwurf** (8. November 2026), nach „weiter, entscheide du“. Vorläufige Entscheidungen stehen in Abschnitt 12.
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
3. **Sponsorentag** (K12b, einmal pro Saison in der Vorbereitung): kostet 50.000 € und einen Tag, danach sind die nächsten Angebote 10 % besser.
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

**Vorläufig entschieden:** begrenzte Flächen nach 3.1, erfundene Sponsoren, Sponsorentag als feste Option in der Vorbereitung, Stadionname nur mit eigenem oder gepachtetem Stadion.

**Noch zu recherchieren:** Ärmel- und Namensrechte-Erlöse in der Bundesliga, Sponsoring in 2. und 3. Liga.

## Quellen

- Hauptsponsoren-Erlöse (Schätzungen): [90min.de: So viel kassieren die Bundesligisten vom Hauptsponsor](https://www.90min.de/bayern-an-der-spitze-so-viel-kassieren-die-bundesligisten-von-ihrem-hauptsponsor), [leinetal24.de: Bundesliga-Vergleich Hauptsponsor](https://www.leinetal24.de/sport/fussball/bundesliga-vergleich-so-viel-kassiert-eintracht-frankfurt-vom-hauptsponsor-zr-94404426.html)
- Sponsorenverhandlungen, begrenzte Werbeflächen: `konzepte/_recherche-genre.md`, Abschnitte 4, 4b
- Sponsorentag: PLAN §4 (GameStar 4/2000)
