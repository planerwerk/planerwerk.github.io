# K12a – Sommerpause und Vorbereitung

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K01 (Kalender), K03 (Frische, Kondition), K07 (Training) · Wird gebraucht von: K11, K12b, K13, K14.

**Umsetzungshinweise (U6b, 9. November 2026):** Urlaub je Verein nach dem letzten eigenen Pflichtspiel (2, 3 oder 4 Wochen), Laufplan bis zum Trainingsauftakt, Trainingsauftakt früher oder später, Saisonbelastung (verdeckt, wirkt auf Erholung und Verletzungsrisiko), Leistungstest am Tag nach dem Auftakt, Springen ohne 7-Tage-Grenze im Urlaub und Laufplan. Code in `js/sommer.js`, Werte in `REGELN.sommer`, Wahl in Training und Saisonbilanz. Test: `tests/sommer.js`. Abweichungen in §12 unter U6b.

## 1. Ziel und Spielgefühl

- **Der Sommer ist eine Phase mit eigenen Entscheidungen,** kein leerer Durchlauf. Du entscheidest dich am 6.11. dafür, ihn nicht zu überspringen (PLAN §2). Bis K11 und K12b umgesetzt sind, ist er noch dünn (Konsistenzprüfung I3).
- **Die zentrale Abwägung:** Wie lange Urlaub? Lang heißt erholt und zufrieden, aber weniger Kondition. Kurz heißt fit zum Start, aber müde Beine im Herbst.
- **Wann geht es los?** Ein früher Trainingsauftakt gibt eine lange Vorbereitung, ein später lässt den Spielern mehr Zeit für sich.
- **Kleine Geschichten:** Wer kommt mit Übergewicht zurück? Wer hat im Urlaub durchtrainiert? Wer ist vom Turnier noch platt?

## 2. Vorbilder und Abgrenzung

- **Anstoss 3:** Testspiel-Gegner erst ab der 3. Vorbereitungswoche verfügbar, Trainingslager mit Kondition und Frische (PLAN §4).
- **Football Manager:** In der Vorbereitung die Athletik langsam zurückfahren, sonst Muskelverletzungen (Recherche 3.1). Bei uns entsteht das aus den Belastungssprüngen in K07 §5.4.
- **Echte Abläufe:** Der Sommer hat 2026 eine Besonderheit, weil die WM bis in den Juli läuft. Die Bundesliga beginnt deshalb erst am 28. August (K01, Quellen). Nationalspieler kommen später zurück.
- **Bewusst anders:** Keine Urlaubsziele oder Reiseplanung. Urlaub ist eine Länge, keine Mini-Spielwiese.

## 3. Begriffe und Daten

| Begriff | Bedeutung | Ort |
|---|---|---|
| Urlaubsbeginn | zwei Tage nach dem letzten eigenen Pflichtspiel | berechnet |
| Urlaubslänge | 2, 3 oder 4 Wochen, wählbar | Spielstand `S.sommer.urlaub` |
| Laufplan | Zeit zwischen Urlaubsende und Trainingsauftakt | berechnet |
| Trainingsauftakt | Datum, wählbar in einem Fenster | `S.sommer.auftakt`, Standard aus `daten/termine.js` |
| Leistungstest | die ersten zwei Tage nach dem Trainingsauftakt | Ereignis im Kalender |
| **Saisonbelastung** | verdeckter Wert 0–100 je Spieler: wie viel die Saison ihm abverlangt hat | Spieler `sb`, **neu in K03** |

### 3.1 Saisonbelastung (neu)

- **Steigt** mit jeder Spielminute: +1 je 45 Minuten in Pflichtspielen, Länderspiele doppelt (K13). Eine volle Saison mit 40 Spielen ergibt etwa 80.
- **Sinkt** nur im Urlaub um 4 pro Tag und in spielfreien Wochen ohne Training um 1 pro Tag.
- **Wirkt** ab 50: Erholung der Frische pro Tag ×(1 − 0,004 × (Belastung − 50)), Verletzungsrisiko ×(1 + 0,01 × (Belastung − 50)). Bei 90 erholt sich ein Spieler also 16 % langsamer und verletzt sich 40 % öfter.
- **Sichtbar** nur als Hinweis des Arztes oder Co-Trainers („wirkt ausgelaugt“), mit K16 genauer.
- **Warum neu?** Ohne diesen Wert gäbe es vor K14 (Stimmung) keinen Grund für einen langen Urlaub (Konsistenzprüfung I8). Mit ihm ist die Wahl sofort echt: Viel eingesetzte Spieler brauchen ihren Urlaub.

## 4. Abläufe

| Phase | Wann | Was passiert | Halte |
|---|---|---|---|
| Saisonabschluss | letzter Spieltag bis Urlaubsbeginn | Saisonbilanz, auslaufende Verträge, Vorstand (K28) | wie heute |
| **Urlaub** | 2–4 Wochen | kein Training. Frische steigt auf 100, Kondition sinkt (K03: 0,6 pro Tag), Saisonbelastung sinkt (4 pro Tag). Transfermarkt und Sponsoren laufen weiter. | nur Ereignisse (Angebote, Fristen) |
| Saisonwechsel | 1. Juli, mitten im Urlaub oder Laufplan | neue Saison, Alter +1, Verträge, Sponsorangebote (wie heute) | ja |
| **Laufplan** | Urlaubsende bis Trainingsauftakt | Spieler halten sich selbst fit: Kondition +0,3 pro Tag × Professionalität/10, höchstens bis zum Stand vor dem Urlaub. „Partylöwe“ verliert weiter 0,3 pro Tag. | keine |
| **Trainingsauftakt** | gewähltes Datum | Mannschaft zurück, Vorlage „Vorbereitung“ (K07) | ja |
| Leistungstest | Tag 1–2 | Kondition aller Spieler wird genau angezeigt, Meldungen zu Auffälligen | Info |
| **Vorbereitung** | bis zum ersten Pflichtspiel | Training, ab Woche 3 Testspiele (K11), Trainingslager (K11), Saisoneröffnung (K12b) | Testspiele, Trainingslager |

### 4.1 Die Wahl

- **Wann:** im Saisonabschluss. Der Co-Trainer schlägt eine Länge vor, die sich an der Saisonbelastung der Stammspieler orientiert.
- **Urlaubslänge:** 2, 3 oder 4 Wochen für die ganze Mannschaft.
- **Trainingsauftakt:** frühestens am Urlaubsende, spätestens fünf Wochen vor dem ersten Pflichtspiel (in der Regel die 1. Pokalrunde). Standard ist das Datum aus `daten/termine.js`.
- **Nationalspieler** mit Turnier im Sommer (K13) bekommen automatisch mindestens drei Wochen Urlaub ab ihrem letzten Turnierspiel und steigen später ein.

### 4.2 „Tag beenden“ im Sommer

Im Urlaub und im Laufplan passiert wenig. Damit der Sommer nicht aus zehn leeren Halten besteht (Konsistenzprüfung I3), bekommt „Tag beenden“ hier eine Ausnahme: Ohne Ereignis springt der Kalender bis zum nächsten echten Halt (Saisonwechsel, Trainingsauftakt, Frist, Angebot), auch wenn das mehr als 7 Tage sind. Siehe Frage 1.

## 5. Regeln und Formeln

### 5.1 Was die Urlaubslänge bewirkt

Beispiel (nachgerechnet): Stammspieler mit Kondition 80 und Saisonbelastung 80, letzter Spieltag Ende Mai, Urlaubsbeginn 43 Tage vor dem Standard-Trainingsauftakt am 6. Juli, Professionalität 10:

| Urlaub | Kondition beim Auftakt | Saisonbelastung danach | Wirkung im Herbst |
|---|---|---|---|
| 2 Wochen | etwa 80 | 24 | etwas langsamere Erholung bis in den Herbst nur bei Belastung über 74 vor dem Urlaub |
| 3 Wochen | etwa 74 | 0 | – |
| 4 Wochen | etwa 68 | 0 | – |

Zwischen 3 und 4 Wochen liegt der Unterschied vor allem bei der Kondition. Bei Spielern mit über 90 Belastung (viele Minuten plus Länderspiele) bleiben nach zwei Wochen noch über 30. Die Rechnung nimmt einen Laufplan an, der die Wochen bis zum Auftakt füllt. Ein früher Auftakt verkürzt ihn.

### 5.2 Leistungstest

- Zeigt die genaue Kondition aller Spieler, auch wenn sonst Werte unscharf sind.
- **Meldungen** (Info, je höchstens zwei):
  - „X kommt mit Übergewicht aus dem Urlaub“: Kondition mindestens 12 unter dem Teamschnitt, meist „Partylöwe“.
  - „Y hat im Urlaub durchgezogen“: Kondition über dem Stand vor dem Urlaub, meist „Vorbildprofi“.
  - „Z ist vom Turnier noch platt“: Nationalspieler mit hoher Saisonbelastung.

### 5.3 Vorbereitung

- Die Vorlage „Vorbereitung“ aus K07 steigert sich: Woche 1 normal, Woche 2–3 hoch mit Doppeleinheiten, ab Woche 4 Taktik und Testspiele.
- **Langsam steigern** ist die Voreinstellung. Wer sofort hart trainiert, erzeugt Belastungssprünge (K07 §5.4) und damit mehr Verletzungen. Der Co-Trainer warnt beim Ändern der Vorlage.
- **Testspiele** erst ab Woche 3 (Anstoss-Idee), Planung in K11.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| langer Urlaub | Saisonbelastung weg, Stimmung (K14) | Kondition zum Start, kürzere Vorbereitung |
| kurzer Urlaub | Kondition, mehr Zeit für die Vorbereitung | ausgelaugte Stammspieler im Herbst |
| früher Trainingsauftakt | lange Vorbereitung, Vertrautheit mit neuer Taktik (K06) | Laufplan kürzer, weniger Erholung |
| Vorbereitung steil oder flach | Kondition früher hoch | Verletzungen |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln. Urlaub meist 3 Wochen, Spitzenvereine mit vielen Nationalspielern eher länger, kleine Vereine eher kürzer.
- Trainingsauftakt nach Profil (K31), Vorbereitung nach der Vorlage aus K07, Klugheit nach K02.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Übergewicht nach dem Urlaub (Entscheidung) | Leistungstest, siehe 5.2 | Geldstrafe (Stimmung, K14), Sonderschichten (Kondition, Frische), ignorieren |
| Urlaubsfoto in der Zeitung | Partylöwe, Zufall | Presse (K29), Vorstand leicht verstimmt |
| Spieler will Urlaub verlängern (Entscheidung) | Nationalspieler mit Saisonbelastung über 90 | ja: späterer Einstieg. Nein: Stimmung, Verletzungsrisiko |
| Neuzugang beim Trainingsauftakt | Transfer im Sommer | Info, Integration beginnt (K03) |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K01 Kalender | Phasen, Halte, Ausnahme beim Springen im Sommer |
| K03 Spieler | Saisonbelastung als neuer verdeckter Wert, Kondition und Frische im Urlaub |
| K07 Training | Vorlage „Vorbereitung“, Belastungssprünge |
| K10 Medizin | Verletzungsrisiko durch Saisonbelastung |
| K11 Testspiele, Trainingslager | ab Woche 3, Trainingslager in der Vorbereitung |
| K12b Saisonvorbereitung | Mannschaftsfoto, Saisoneröffnung, Sponsorentag, Saisonziel-Termin |
| K13 Länderspiele | Turnierteilnehmer kommen später, Länderspiele zählen doppelt in der Saisonbelastung |
| K14 Kabine | Urlaubslänge wirkt auf die Stimmung |
| K19 Transfers | Sommer als Haupttransferzeit, Neuzugänge zum Trainingsauftakt |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Halte im Sommer | vom Saisonende bis zum Trainingsauftakt höchstens 5 Halte ohne Ereignis (heute etwa 10) |
| Kondition beim Auftakt | nach 3 Wochen Urlaub und Laufplan 65–75 |
| Kondition zum ersten Pflichtspiel | nach Standard-Vorbereitung 80–88 |
| Urlaubswahl lohnt | Ein Kader mit hoher Saisonbelastung holt nach 2 Wochen Urlaub in der Hinrunde weniger Punkte als nach 3–4 Wochen. Ein frischer Kader (wenig Belastung) profitiert von kurzem Urlaub. |
| Steiler Start | mehr Trainingsverletzungen als bei flachem Start (K07 §10) |

## 11. Stellschrauben

```js
sommer:{
  urlaubWochen:[2,3,4],urlaubStandard:3,urlaubBeginnNach:2,   // Tage nach dem letzten eigenen Pflichtspiel
  laufplan:{proTag:0.3,profiTeiler:10,partyloewe:-0.3},
  auftakt:{spaetestensWochenVorPflichtspiel:5},
  nationalspielerMinUrlaubWochen:3,
  leistungstest:{tage:2,uebergewichtAb:12,meldungenMax:2},
  springenOhneGrenze:true                                    // Frage 1
},
spieler:{ saisonbelastung:{jeMinuten:45,laenderspiel:2,urlaub:4,pause:1,ab:50,erholung:0.004,risiko:0.01} }
```

`training.urlaubAbbau` und `training.urlaubMin` fallen weg (ersetzt durch K03 §5.3 und den Laufplan).

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Springen im Sommer ohne 7-Tage-Grenze.** Das weicht von deiner Regel „höchstens 7 Tage“ (PLAN §2) ab, aber nur in Urlaub und Laufplan, und es hält trotzdem bei jedem Ereignis. **Das solltest du bestätigen,** weil es eine deiner Entscheidungen berührt.
2. **Saisonbelastung** als neuer verdeckter Wert in K03. Ohne ihn hat die Urlaubslänge vor K14 kaum Folgen.
3. **Urlaub für die ganze Mannschaft,** nicht je Spieler. Ausnahme: Turnierteilnehmer.
4. **Laufplan** passiert automatisch und hängt an der Professionalität. Keine eigene Planung.

**Vorläufig entschieden bei der Umsetzung (U6b, 9. November 2026):**
5. **Urlaub je Verein:** Er beginnt zwei Tage nach dem letzten eigenen Pflichtspiel (Liga, Pokal, Relegation), also für viele Vereine schon im Mai. Computer-Vereine nehmen immer drei Wochen.
6. **Trainingsauftakt** eine Woche früher, Standard oder eine Woche später (statt eines freien Datums im Fenster). Das deckt die Wahl ab und bleibt in jeder Saison gültig.
7. **Saisonbelastung wird mitgenommen:** Sie sinkt nur im Urlaub (4 pro Tag) und steigt mit jeder Spielminute. Nach zwei Wochen Urlaub startet ein Stammspieler mit Belastung 90 in die neue Saison mit etwa 26 statt 0 und liegt damit schon im Herbst über 50 (langsamere Erholung, mehr Verletzungen). Die Rechnung in 5.1 („Wirkung im Herbst nur bei Belastung über 74“) ging von einer Wirkung direkt nach dem Urlaub aus, die es mit der Schwelle 50 nie gäbe.
8. **Urlaubslänge auch im laufenden Urlaub änderbar** (Training und Saisonbilanz). Bereits vergangene Urlaubstage zählen.
9. **Formänderung je Notenpunkt 2,3 statt 2,5** und 11 % statt 10 % pro Woche zurück zur Mitte. Mit dem neuen Saisonablauf lagen sonst 6,5 % der Spieler bei Form ≤ 4 oder ≥ 16 (Ziel höchstens 5 %).
10. **Noch nicht gebaut:** Nationalspieler mit Turnier (K13), Ereignisse aus §8, Stimmung aus der Urlaubslänge (K14), Testspiele und Trainingslager (K11).


## Quellen

- Bundesliga-Start 2026/27 am 28. August wegen der WM: [flashscore.de](https://www.flashscore.de/news/fu-ball-bundesliga-bundesliga-start-2026-wegen-wm-erst-am-28-august-nur-14-spiele-vor-winterpause/fwAdiTuJ/) (aus K01)
- Testspiele ab der 3. Woche, Trainingslager: PLAN §4 (GameStar 4/2000)
- Vorbereitung und Muskelverletzungen: `konzepte/_recherche-genre.md`, Abschnitte 3.1 und 4b
