# K37 – Europapokal

Status: **Entwurf** (21. November 2026, popolupo), nach „weiter, entscheide du“. Grundlage sind die ersten Gedanken in PLAN §4 (10.11.). Vorläufige Entscheidungen stehen in Abschnitt 12. Umsetzung in U19 (Teilschritte in §4.6). **U19a bis U19c umgesetzt (21. November 2026, popolupo), in Lauf 5 getestet. U19d1 Kaderliste umgesetzt (22. November 2026), noch ohne Testlauf.**
Hängt ab von: K01 (Kalender), K13 (Wettbewerbe), K23 (Finanzen), K32 (Auslandsvereine) · Wird gebraucht von: K02 §5.3a (Vorsprung der Großen), K07 und K12a (Belastung), K19 (Anziehung für Spieler), K28 (Ziele des Vorstands), K34 (Statistik).

## 1. Ziel und Spielgefühl

- **Der Vorsprung der Großen bekommt seinen echten Grund.** Bayern hat 2025/26 rund 83 Mio. € aus den nationalen und internationalen Medientöpfen bekommen. Eine gute Saison in der Champions League bringt noch einmal so viel. Ohne Europapokal fehlt dem Spiel diese Einnahme, und die Großen sind nur über das Ansehen reich (K02 §5.3a).
- **Abende unter Flutlicht:** Dienstag, Mittwoch und Donnerstag gegen Manchester City, Inter oder Ferencváros. Die Auslosung ist ein Moment wie im Pokal (K13).
- **Englische Wochen als Preis:** Mehr Spiele heißen Rotation, Frische, Verletzungen. Wer in der Conference League weit kommt, kann in der Liga zurückfallen.
- **Ein Ziel für mittlere Vereine:** Platz 7 reicht für die Conference League, Platz 6 für die Europa League. Der Pokalsieg ist der kurze Weg nach Europa.

## 2. Vorbilder und Abgrenzung

- **Echter Modus seit 2024/25** (Websuche 21.11.): drei Wettbewerbe mit je 36 Vereinen in einer gemeinsamen Ligaphase. Champions League und Europa League spielen 8 Spiele gegen 8 verschiedene Gegner, die Conference League 6. Platz 1–8 kommen direkt ins Achtelfinale, 9–24 spielen die K.-o.-Play-offs, 25–36 scheiden aus. Danach Hin- und Rückspiel bis zum Halbfinale, ein Finale an einem festen Ort. Keine Auswärtstorregel mehr, bei Gleichstand Verlängerung und Elfmeterschießen im Rückspiel.
- **Genre:** Manager-Spiele zeigen den Europapokal meist als weitere Liste mit Ergebnissen. Hier zählen die Abende wie Ligaspiele: Live-Spiel, Aufstellung, Belastung.
- **Bewusst anders:** Kein Nachbau der UEFA-Marken, Hymnen oder Logos (K35b). Die Wettbewerbe heißen im Spiel wie im Sprachgebrauch (Champions League, Europa League, Conference League), ohne Gestaltung der UEFA.
- **Bewusst einfacher (vorläufig):** Die Auslandsligen werden nicht gespielt. Wer aus dem Ausland teilnimmt, ergibt sich aus Ansehen und Zufall (§5.1). Qualifikationsrunden gibt es nur, wo ein deutscher Verein hineinmuss (Conference League über Platz 7).

## 3. Begriffe und Daten

| Wert | Bedeutung | Ort |
|---|---|---|
| Wettbewerb `cl`, `el`, `ecl` | Champions League, Europa League, Conference League | `REGELN.europa` |
| Startplätze | Bundesliga 1–4 `cl`, 5 und Pokalsieger `el`, 6 `el` (wenn der Pokalsieger schon dabei ist, sonst `ecl`), 7 `ecl` über die Play-off-Runde der Qualifikation | `REGELN.europa.plaetze` |
| Teilnehmer der ersten Saison | echte deutsche Starter 2026/27 (§5.1) | `daten/termine.js` |
| Länderkontingente | wie viele Vereine je Land in welchem Wettbewerb (angelehnt an die Zulassungsliste der UEFA) | `REGELN.europa.laender` |
| Termine | Spieltage der Ligaphase, K.-o.-Runden, Finale, Auslosungen | `daten/termine.js` (`europa`) |
| `S.eu` | je Wettbewerb `{t: Teilnehmer, lp: Paarungen der Ligaphase, tab, ko: Runden mit Paarungen und Ergebnissen, los}` | Spielstand |
| `S.euGeld` | Prämien der Saison je deutschem Verein (Aufschlüsselung für die Finanzseite) | Spielstand |
| Teamstärke Ausland | Kernspieler aus dem Pool plus Ergänzung mit der Grundstärke aus dem Ansehen (`avStaerke`) | abgeleitet |

## 4. Abläufe

### 4.1 Saisonwechsel (1. Juli)
1. Aus der Abschlusstabelle und dem Pokalsieger der Vorsaison stehen die deutschen Teilnehmer fest (§5.1).
2. Je Wettbewerb füllt das Spiel die übrigen Plätze mit Auslandsvereinen (§5.1).
3. Die Termine der Saison werden wie alle Rahmentermine um volle Wochen verschoben (K01).

### 4.2 Qualifikation (nur Conference League, August)
- Der Siebte spielt die Play-off-Runde der Qualifikation gegen einen Auslandsverein (Hinspiel 20.8., Rückspiel 27.8.2026). Wer verliert, ist draußen und bekommt nichts.

### 4.3 Ligaphase (September bis Januar)
1. **Auslosung** am 27. August (Champions League) und 28. August (Europa League, Conference League): vier Töpfe zu neun Vereinen (Conference League: sechs Töpfe zu sechs) nach Ansehen. Jeder Verein bekommt zwei Gegner aus jedem Topf, einen zu Hause, einen auswärts (Conference League: einen aus jedem Topf). Kein Gegner aus dem eigenen Land, höchstens zwei aus demselben Land.
2. **Spieltage:** Champions League dienstags und mittwochs (Anstoß 21:00, einige 18:45), Europa League und Conference League donnerstags (18:45 oder 21:00).
3. **Tabelle** nach Punkten, Tordifferenz, Toren, Auswärtstoren, Siegen.
4. Die Liga verlegt Spiele, die weniger als drei Tage neben einem Europapokalspiel liegen, wie beim Pokal (K13 §3.5, `pokalVerlegen`).

### 4.4 K.-o.-Runden (Februar bis Juni)
1. **Play-offs** (9–24): Paarungen nach Platz (9/10 gegen 23/24, 11/12 gegen 21/22 …), gelost wird nur innerhalb der Platzpaare. Der besser Platzierte hat das Rückspiel zu Hause.
2. **Achtelfinale bis Halbfinale:** Turnierbaum nach Platzierung wie bei der UEFA, Hin- und Rückspiel.
3. **Finale** an einem festen Ort auf neutralem Platz. Liegt der Finaltag nach dem letzten Spieltag der Saison (Tag vor `ende`), rückt es auf diesen Tag vor (2027: Champions League 5.6. und Conference League 2.6. → 1.6.).
4. Jede Auslosung mit deinem Verein ist wie beim Pokal ein Halt mit Meldung im Posteingang (K13). Die übrigen Paarungen stehen in der Ansicht „Europa“.

### 4.5 Saisonende
- Prämien sind dann schon gebucht (§5.3). Ansehen und Fans ändern sich mit dem Saisonwechsel (§5.4).

### 4.6 Teilschritte der Umsetzung (vorläufig)

| Schritt | Inhalt |
|---|---|
| **U19a** | Teilnehmer, Termine, Auslosung und Tabelle der Ligaphase, K.-o.-Baum, Spiele mit deutscher Beteiligung in der Engine, Ausland gegen Ausland als Kurzrechnung, Verlegung der Ligaspiele, Ansicht „Europa“ |
| **U19b** | Prämien und Wertsäule (§5.3), Ansehen und Fans (§5.4), Statistik (K34), Ziele des Vorstands (K28) |
| **U19c** | Länderwertung mit dem fünften Platz in der Champions League, Interesse der Spieler (K19), Nebenziel des Vorstands (K28) |
| **U19d** | Kaderliste der UEFA (25 Spieler, davon 8 lokal ausgebildet), Auslandsvereine mit Ansehen nach ihren Ergebnissen, Auslandsvereine mit vollem Kader in der Engine statt als Block (§5.2), Europapokal in der Saisonstatistik (K34) |

**Stand U19a (21.11.):** Teilnehmer, Termine, Auslosung der Ligaphase, Tabelle, K.-o.-Baum, Spiele, Verlegung der Ligaspiele, Sperren je Wettbewerb (UEFA: Gelbsperre nach der 3., 5., 7. und 9. Gelben), Karte im Reiter Pokal. Einnahmen bisher nur die Zuschauer deiner Heimspiele (wie im Pokal), Prämien folgen mit U19b.

**Stand U19b (21.11.):** Startgeld und Wertsäule mit der Auslosung, Sieg- und Remisprämie je Spiel, Rangprämie nach der Ligaphase (nur Champions League recherchiert), Rundenprämien, Siegprämie, alles mal 0,2 und für alle deutschen Teilnehmer (dein Verein bucht „Europapokal“). Zuschauer nach dem Ansehen des Gegners. Ansehen und damit Fans zum Saisonwechsel (§5.4). Vorstand +1,5 je gewonnenem Duell, +10 beim Titel. Europapokaltore am Spieler getrennt (`eg`), Titel in der Vitrine. **Inzwischen gebaut:** Nebenziel Europapokal des Vorstands (K28 §5.7), Interesse der Spieler an Vereinen im Europapokal (U19c), deutsche Torjäger im Europapokal in der Saisonstatistik (K34c, 22.11., popolupo, ohne Testlauf).

**Stand U19c (21.11.):** Länderwertung je Saison (Sieg 2, Remis 1, geteilt durch die Zahl der Vereine des Landes, nur Länder im Pool und Deutschland). Die besten zwei Länder bekommen nächste Saison einen Platz mehr in der Champions League. Für Deutschland heißt das: Der Fünfte spielt Champions League, alle Plätze danach rücken um eins nach. Spieler wollen eher zu einem Verein im Europapokal (Interesse +6, +3, +1). Neues Nebenziel des Vorstands: K.-o.-Play-offs erreichen, in der Champions League ab Ansehen 85 das Achtelfinale.

## 5. Regeln und Formeln

### 5.1 Teilnehmer
- **Deutsche Vereine:** Plätze 1–4 Champions League, 5 Europa League, Pokalsieger Europa League. Ist der Pokalsieger schon über die Liga dabei, rückt der 6. in die Europa League und der 7. in die Conference League. Sonst spielt der 6. die Conference League und der 7. nichts. Ein Pokalsieger aus der 2. Liga spielt ebenfalls die Europa League.
- **Erste Saison 2026/27:** die echten Starter (Websuche 21.11.): Bayern, Dortmund, Leipzig, Stuttgart (Champions League), Leverkusen und Hoffenheim (Europa League), Freiburg (Play-off-Runde der Conference League). Die Zuordnung von Leverkusen, Hoffenheim und Freiburg widersprach sich zunächst zwischen den Quellen. **Geklärt am 21.11.:** Bayern gewann auch den DFB-Pokal (23.5.2026, 3:0 gegen Stuttgart, ZDFheute, DFB), darum rückten der Sechste in die Europa League und der Siebte (Freiburg) in die Conference League nach.
- **Auslandsvereine:** Je Land und Wettbewerb ein Kontingent (§11). Innerhalb des Landes kommen die Vereine nach Ansehen plus Zufall (±8, eigener Strom `europa`) an die Reihe, weil die Auslandsligen nicht gespielt werden. Wer in der Champions League steht, fehlt in der Europa League. Fehlen Plätze, füllt das Spiel mit den nächsten nach Ansehen aus allen Ländern auf.
- **Der Titelverteidiger** jedes Wettbewerbs ist in der nächsten Saison in der Champions League (Champions League, Europa League) beziehungsweise in der Europa League (Conference League) dabei. Ein deutscher Titelverteidiger nimmt dabei keinen Bundesliga-Platz weg (vorläufig, die echte Regel ist verwickelter).

### 5.2 Spiele
- **Mit deutscher Beteiligung:** volle Engine (K04), Live-Spiel wie in der Liga. Der Auslandsverein tritt mit einem Kader an, den das Spiel beim Anpfiff zusammenstellt: seine Kernspieler aus dem Pool (K32 §3.1) und für die übrigen Plätze Ergänzungsspieler mit der Grundstärke aus dem Ansehen (`avStaerke`). Ergänzungsspieler werden nicht gespeichert (Name und Werte fest aus Seed, Verein und Saison). Auslandsspieler bekommen aus dem Spiel keine Folgen (keine Sperren, Verletzungen, Frische), nur Tore und Karten für die Anzeige.
- **So gebaut in U19a (Abweichung, vorläufig):** Der Auslandsverein spielt in der Engine als **Block** mit seiner Teamstärke, wie heute die Amateure im Pokal (`side`, `am`). Die Teamstärke ist das Mittel der elf Besten aus Kernspielern und Ergänzung mit `avStaerke`. Die Torschützen kommen aus seinen Kernspielern. Grund: Der Block-Weg ist in der Engine erprobt (Pokal) und braucht keine Spieler außerhalb von `S.pl`. Die Kehrseite: Gegen einen Block wirken deine Taktik und dein Stil weniger als gegen einen Bundesligisten. Volle Kader kommen in U19c.
- **Ausland gegen Ausland:** Kurzrechnung ohne Minuten: erwartete Tore aus dem Verhältnis der Teamstärken (wie gegen Amateure, `amateurErwartung`), Poisson-Würfe im Strom `europa`. Von rund 530 Spielen je Saison (alle drei Wettbewerbe) laufen so nur die etwa 50 bis 80 mit deutscher Beteiligung durch die Engine.
- **Heimvorteil** wie in der Liga. Finale neutral.
- **Prüfliste für die Technik:** Rund 50 Stellen im Code unterscheiden Vereine nach der Grenze 1000 (Amateure, Stand 21.11.). Auslandsvereine haben Kennungen ab 2000 und brauchen dort einen eigenen Zweig (`side`, Statistik, Kabine, Disziplin).

### 5.3 Geld (U19b)
Echte Beträge 2025/26 (Websuche 21.11.):

| | Champions League | Europa League | Conference League |
|---|---|---|---|
| Startgeld | 18,62 Mio. | 4,31 Mio. | 3,17 Mio. |
| Sieg / Unentschieden in der Ligaphase | 2,1 Mio. / 0,7 Mio. | 450.000 / 150.000 | 400.000 / 133.000 |
| Rangprämie Ligaphase | 1 bis 36 Anteile zu je etwa 275.000 | 1 bis 36 Anteile zu je 75.000, dazu Platz 1–8 600.000 und Platz 9–16 300.000 (Nachtrag 21.11.) | 1 bis 36 Anteile zu etwa 24.000 £ (gerechnet 28.000 €), Platz 1–8 und 9–16 geschätzt 400.000 und 200.000 (Nachtrag 21.11., nicht amtlich) |
| K.-o.-Play-offs | 1 Mio. | (in der Rangprämie enthalten) | (nicht recherchiert) |
| Achtelfinale | 11 Mio. | 1,75 Mio. | 800.000 |
| Viertelfinale | 12,5 Mio. | 2,5 Mio. | 1,3 Mio. |
| Halbfinale | 15 Mio. | 4,2 bis 4,5 Mio. (Quellen uneins) | 2,5 Mio. |
| Finale | 18,5 Mio. | 7 Mio. | 4 Mio. |
| Sieger zusätzlich | 6,5 Mio. | 6 Mio. | 3 Mio. (eine Quelle 7 Mio. gesamt) |

- **Wertsäule:** 35 % des Topfs gehen nach Zehnjahreswertung und Marktpool, in der Champions League im Schnitt etwa 24 Mio. je Verein (geschätzt: 35 % von 2,467 Mrd. durch 36). Im Spiel: Schnitt je Wettbewerb (Champions League 24 Mio., Europa League 5,5 Mio., Conference League 2,8 Mio., alle geschätzt), verteilt nach dem Rang des Ansehens unter den Teilnehmern: Rang r von 36 bekommt Schnitt × 2 × (37 − r) / 37.
- **Spielgeld:** Die Geldwerte im Spiel sind heute kleiner als echt (TV-Gelder für Bayern im Spiel etwa 12 Mio. je Saison, echt rund 61 Mio. national). Bis K23c alle Geldwerte auf echte Größenordnungen bringt, gilt ein Faktor **0,2** auf alle Europapokal-Beträge. Mit K23c wird er 1. **Seit K23c (22.11.) ist er 1** (K23 §5.6b), die Beträge sind echt.
- **Buchung:** „Europapokal“ in `S.fin`, beim Spiel (Sieg, Unentschieden) und beim Erreichen einer Runde. Startgeld und Wertsäule mit der Auslosung der Ligaphase. Zuschauereinnahmen wie bei einem Pokalspiel.
- **Computer-Vereine** bekommen dasselbe Geld. Das ersetzt die Pauschale für die Europapokal-Plätze, die K23b bis dahin vorsieht.

### 5.4 Ansehen und Fans (U19b)
- Zum Saisonwechsel zählt der Europapokal zur Änderung des Ansehens: Achtelfinale +1, Viertelfinale +2, Halbfinale +3, Sieg +4 (Champions League voll, Europa League zur Hälfte, Conference League zu einem Viertel, gerundet). Die Fans ändern sich wie bisher mit dem Ansehen.
- Gegen große Namen sind die Spiele ausverkauft (Zuschauer nach Ansehen des Gegners, wie im Pokal).

### 5.5 Belastung
- Keine eigene Regel. Frische, Kondition, Verletzungen und Rotation laufen über K07, K10 und die Aufstellung der Computer-Trainer, die schon heute nach Frische auswählt (`bestXI`).

### 5.6 Kaderliste der UEFA (Entwurf 21.11.2026, gebaut als U19d1 am 22.11.2026)

**So gebaut (U19d1):**
- Liste A je deutschem Teilnehmer in `S.eu.liste`. Beim ersten Melden beginnt deine Liste mit dem Vorschlag der automatischen Meldung (zwei Torhüter, dann die Stärksten nach den Regeln).
- Zur Frist meldet jeder Verein ohne gültige Liste automatisch, dein Verein mit Automatik der Co-Trainer.
- Zur Nachmeldung behalten Computer-Vereine ihre Liste und nehmen bis zu drei neue Spieler dazu.
- Zwischen den Fristen ist deine Liste fest.
- Im Europapokal sperrt `gesperrt` jeden, der weder auf Liste A noch auf Liste B steht. In der Qualifikation und vor der ersten Frist gibt es noch keine Liste, dann dürfen alle spielen.
- Karte „Kaderliste“ im Reiter Kader.
Echte Regel 2025/26 (UEFA-Reglement Art. 31, Websuche 21.11.):
- **Liste A:** höchstens 25 Spieler, mindestens 2 Torhüter. 8 Plätze sind lokal Ausgebildeten vorbehalten, davon höchstens 4 verbandsausgebildet. Wer weniger lokal Ausgebildete hat, darf entsprechend weniger melden.
- **Vereinsausgebildet:** drei Jahre im selben Verein zwischen 15 und 21. **Verbandsausgebildet:** drei Jahre bei Vereinen desselben Verbands in diesem Alter.
- **Liste B:** junge Spieler, die seit zwei Jahren im Verein sind, ohne Höchstzahl.
- **Nachmeldung** für die K.-o.-Phase: bis zu drei neue Spieler. Ein Ersatz für einen verletzten Torhüter geht jederzeit.

Im Spiel (vorläufig):
- **Lokal ausgebildet als Näherung**, weil die Laufbahn vor dem Spielstart fehlt: vereinsausgebildet ist, wer aus der eigenen Jugend kommt (`p.ej` gleich Verein). Verbandsausgebildet sind die übrigen Spieler mit deutscher Nationalität.
- **Liste B:** bis 21 Jahre und `p.ej` gleich Verein oder seit zwei Jahren im Verein (`p.seit`).
- **Frist:** Meldung bis zum Tag vor dem 1. Spieltag der Ligaphase, Nachmeldung bis zum Tag vor den K.-o.-Play-offs. Ohne Meldung meldet der Verein an diesem Tag die Besten nach den Regeln (mit und ohne Automatik am selben Tag, Gleichschritt).
- **Lizenz:** Bereich `aufstellung` (ab Teamleiter). Mit Automatik meldet der Co-Trainer.
- **Engine:** Im Europapokal sind nur gemeldete Spieler verfügbar (`avail` mit Wettbewerb `eu`).
- **Computer-Vereine** melden automatisch nach Stärke.
- **Ansicht:** im Kader eine Spalte „UEFA“ (A, B oder leer), Melden und Streichen, Zähler 25 / 8 / 4.

### 5.7 Volle Kader der Auslandsvereine (Entwurf für U19d, noch nicht gebaut)
- `side` stellt den Auslandsverein aus seinen Kernspielern (K32 §3.1) und Ergänzungsspielern auf. Die Ergänzung wird je Verein, Saison und Platz fest aus dem Seed erzeugt und nicht gespeichert (Name aus der Namensliste des Landes, Stärke `avStaerke` mit kleiner Streuung).
- **Keine Folgen für Auslandsspieler:** keine Verletzung, keine Karte mit Sperre, keine Frische. Dafür braucht es Wächter in `applyMatchLauf` (Verletzungen), `disziplinNachSpiel` und `lernenImSpiel` für Spieler mit `istAusland`.
- **Stil:** vorläufig „ausgewogen“, später nach Land.
- **Kalibrierung:** wie CC2. Erst messen, ob deutsche Vereine gegen den Block zu oft oder zu selten weiterkommen, dann umstellen.

## 6. Hebel des Spielers
- **Prioritäten setzen:** Aufstellung und Rotation zwischen Liga und Europapokal.
- **Kader breiter planen** (K19), wenn Europa wahrscheinlich ist.
- **Live-Spiel und Taktik** wie in der Liga.
- **Später (U19c):** Kaderliste mit lokal ausgebildeten Spielern.

## 7. Verhalten der Computer-Vereine
- Gleiche Regeln. Sie stellen nach Frische auf und spritzen in wichtigen Spielen fit (K10 §7, ab dem Achtelfinale).
- Auslandsvereine treffen keine Entscheidungen. Ihre Kernspieler spielen, wenn sie gesund sind.

## 8. Ereignisse
Als Karten (K30), **gebaut als U19e am 22.11.2026, ohne Testlauf**. Katalog in `daten/karten.js`, Auslöser in `js/karten.js`, Zahlen in `REGELN.karten.europa`:
- **Fanmarsch** (Entscheidung, klein): Dein nächstes Europapokal-Auswärtsspiel bei einem Auslandsverein liegt in den nächsten 7 Tagen (nicht das Finale, es ist neutral). Busse und Fahnen bezahlen (10.000 € in der 3. Liga, in der 1. Liga ×4) bringt Fans +3, sonst +1. Voreinstellung: die Fans organisieren selbst.
- **Reisechaos** (Entscheidung, klein, gleicher Auslöser): Charterflug am Vortag (20.000 €, 1. Liga ×4) oder Linienflug mit 40 % Risiko auf Stimmung −2 für alle. Voreinstellung: Charterflug.
- **Pyrotechnik** (Entscheidung, klein): Dein letztes Europapokalspiel liegt 1 bis 7 Tage zurück. Die UEFA-Strafe von 12.000 € (1. Liga ×4, also 48.000 €) zahlt der Verein immer, die Wahl betrifft die Haltung: Täter ermitteln (Vertrauen +2, Fans −2), schweigen (Vertrauen −2) oder Einspruch (30 % Senkung auf 4.000 €, sonst 16.000 € mit Verfahrenskosten). Echte UEFA-Strafen für deutsche Vereine lagen bei 25.000 bis 80.000 € (Websuche 22.11., Eintracht Frankfurt gegen Lazio 80.000 €, gegen Inter 50.000 €, gegen die AS Rom 25.000 €). Voreinstellung: schweigen. Der Zuschauerausschluss im Wiederholungsfall (K09) steht nur im Text, als Wirkung fehlt er.
- **Ein Wunder** (Meldung): Im Hinspiel mit mindestens 2 Toren Rückstand, im Rückspiel 1 bis 7 Tage zuvor gedreht (nach Toren oder im Elfmeterschießen).
- **Dosierung wie alle Karten** (K30 §5.4): häufig heißt 1 zu 120 je Woche, in der der Auslöser passt. Ein Verein mit acht bis zehn Europapokal-Wochen sieht die Pyrotechnik etwa alle zwölf bis fünfzehn Saisons, Fanmarsch und Reisechaos (nur in Wochen mit einem Auswärtsspiel im Ausland, etwa die Hälfte) etwa alle 25 bis 30 Saisons, das Wunder (nur in der Woche nach einer Aufholjagd) fast nie (Prüfung DX). Eine eigene, höhere Rate für Karten mit festem Anlass würde K30 §5.4 ändern (mit dir entschieden am 10.11.) und ist darum nicht gebaut, siehe §12 Nr. 21.
- **Gleichschritt:** Die Karten würfeln im Strom `ereignisse` wie alle Karten, `kartenWoche` ist in `tests/lizenz.js` 5a abgeschaltet. Kein neuer Lizenz-Bereich, Entscheidungen im Bereich `ereignisse`.

## 9. Wechselwirkungen
- **K23 Finanzen:** größte neue Einnahme der Großen. K23b misst erst die Konten ohne Europapokal, U19b setzt danach den Faktor (§5.3).
- **K02 §5.3a:** Kalibrierziel „etwa zwei Drittel der Titel für die drei Größten“ ist erst mit Europapokal-Geld sinnvoll zu messen.
- **K19 Transfers:** Spieler wollen eher zu Vereinen im Europapokal (Interesse +, U19b).
- **K28 Vorstand:** Ziele wie „Europapokal erreichen“ oder „Achtelfinale“ (U19b).
- **K34 Statistik:** Europapokal-Spiele und Tore getrennt zählen (U19b).
- **K13 Wettbewerbe:** Termine neben Pokal und Liga, Verlegung nach 72 Stunden.
- **K36 Lernstufen:** Spiele und Auslosungen sind ab Teamleiter dabei. Kein neuer Bereich in U19a bis U19c. Die Kaderliste in U19d gehört zum Bereich `aufstellung` (berichtigt am 21.11., einen Bereich `kader` gibt es nicht, §5.6).

## 10. Zielwerte und Tests
- **Deutsche Ergebnisse** über viele Saisons in der Größenordnung der Wirklichkeit: in der Champions League kommen deutsche Vereine meist ins Achtelfinale, der Größte gelegentlich ins Halbfinale, ein deutscher Sieger etwa alle 10 bis 15 Jahre (Bayern 2013, 2020). Die Teamstärke der Auslandsvereine braucht dafür eine eigene Kalibrierung (K32, Konsistenzprüfung AW13).
- **Kein deutscher Seriensieger:** in 20 Saisons höchstens 4 Titel in der Champions League.
- **Ablauf:** jeder Wettbewerb hat genau 36 Teilnehmer, jeder spielt 8 (Conference League 6) Spiele in der Ligaphase, kein Gegner aus dem eigenen Land, kein Spiel weniger als drei Tage neben einem anderen Pflichtspiel desselben Vereins.
- **Geld:** Prämien stimmen mit der Tabelle in §5.3 mal Faktor überein, Summe der Buchungen „Europapokal“ gleich `S.euGeld`.
- **Gleichschritt:** Die Kurzrechnung würfelt im eigenen Strom, `tests/zufall.js` und `tests/lizenz.js` bleiben grün.
- **Test:** `tests/europapokal.js` (U19a, U19b).

## 11. Stellschrauben
```
REGELN.europa = {
  plaetze:{cl:[1,2,3,4], el:[5], pokal:'el', nachruecken:[6,7], ecl:[7]},
  wb:{cl:{name:'Champions League', teams:36, spiele:8, toepfe:4}, el:{…, spiele:8, toepfe:4}, ecl:{…, spiele:6, toepfe:6}},
  laender:{cl:{ENG:5, ESP:4, ITA:4, FRA:3, NED:2, POR:2, BEL:1, TUR:1, AUT:1, SUI:1, DEN:1, CZE:1, …}, el:{…}, ecl:{…}},   // geschätzt nach der Zulassungsliste
  zufall:8,                       // Streuung des Ansehens bei der Auswahl der Auslandsvereine
  geld:{faktor:0.2, cl:{start:18.62e6, sieg:2.1e6, remis:0.7e6, rang:275000, po:1e6, af:11e6, vf:12.5e6, hf:15e6, fin:18.5e6, titel:6.5e6, wert:24e6}, el:{…}, ecl:{…}},
  ansehen:{af:1, vf:2, hf:3, titel:4, anteil:{cl:1, el:0.5, ecl:0.25}}
}
```

## 12. Offene Fragen

**Vorläufig entschieden (21.11.2026, popolupo):**

1. Echter Modus seit 2024/25 mit Ligaphase und K.-o.-Runden, Qualifikation nur für den deutschen Siebten (§2, §4.2).
2. Sieben feste deutsche Plätze (4/2/1). Die Länderwertung mit fünftem Platz kommt in U19c (§4.6).
3. Auslandsvereine nach Kontingent, Ansehen und Zufall, weil die Auslandsligen nicht gespielt werden (§5.1).
4. Spiele mit deutscher Beteiligung in der vollen Engine, Ausland gegen Ausland als Kurzrechnung (§5.2).
5. Auslandsspieler ohne Folgen aus dem Spiel (§5.2).
6. Echte Beträge 2025/26 mal Faktor 0,2 bis K23c (§5.3). Seit K23c Faktor 1.
7. Wertsäule nach Rang des Ansehens unter den Teilnehmern (§5.3).
8. Finale nach dem Saisonende rückt auf den letzten Spieltag vor (§4.4).
9. Ein deutscher Titelverteidiger nimmt keinen Bundesliga-Platz weg (§5.1).
10. Kein neuer Lizenz-Bereich in U19a und U19b (§9).
11. In U19a spielt der Auslandsverein in der Engine als Block mit Teamstärke, volle Kader kommen in U19c (§5.2).
12. Auslosung der Ligaphase nach einem festen Bauplan, der jedem Verein je Spieltag genau ein Spiel gibt, je Topf zwei Gegner (Conference League: einen) und gleich viele Heim- und Auswärtsspiele. Gezogen wird, wer an welchem Platz im Topf steht. Danach tauscht die Auslosung Vereine innerhalb eines Topfs, bis kein Gegner aus dem eigenen Land und höchstens zwei aus demselben Land bleiben (bis zu 30 Baupläne mit je 3.000 Tauschversuchen, die zweite Hälfte ohne die Höchstzahl; findet sie keine Lösung, nimmt sie die mit den wenigsten Konflikten) (§4.3, geändert nach einer Prüfung am 21.11., Konsistenzprüfung CH2).
13. Gelbsperre im Europapokal nach der 3., 5., 7. und 9. Gelben (UEFA-Regel, ohne das Streichen nach dem Viertelfinale) (§4.4).
14. Vorstand +1,5 Vertrauen je gewonnenem Duell (wie im Pokal) und +10 beim Titel, kein Abzug beim Ausscheiden (U19b).
15. Startgeld und Wertsäule werden mit der Auslosung der Ligaphase gezahlt, die Rangprämie nach der Ligaphase, Rundenprämien beim Erreichen der Runde (U19b).
16. Länderwertung nur aus der laufenden Saison (die echte Regel für den Zusatzplatz nutzt ebenfalls nur eine Saison), ohne Bonuspunkte und ohne halbe Punkte in der Qualifikation (U19c).
17. Interesse der Spieler +6 (Champions League), +3 (Europa League), +1 (Conference League), verglichen mit dem bisherigen Verein (U19c).
18. Nebenziel „Europapokal“: K.-o.-Play-offs, in der Champions League ab Ansehen 85 das Achtelfinale (U19c).
19. Kaderliste mit Näherung für lokal Ausgebildete (eigene Jugend, sonst deutsche Nationalität), Bereich `aufstellung`, ohne Meldung meldet der Verein zur Frist (U19d1, §5.6).
20. Stärke der Auslandsvereine 0,93 (T5.3, Konsistenzprüfung CJ2).
21. **Europapokal-Karten in der normalen Dosierung** (U19e, §8, 22.11., popolupo): Sie sind damit selten. Vorschlag für später, nicht gebaut: ein Feld `chance` je Karte für Karten mit festem Anlass (Wahrscheinlichkeit je Woche, in der der Anlass besteht), bei gleich vielen Würfen je Woche. Das ändert K30 §5.4 und braucht deine Entscheidung. **Seit K30d (22.11., popolupo) vorläufig von mir entschieden und gebaut** (K30 §5.5 Nr. 3): Fanmarsch 0,15, Reisechaos 0,1, Pyrotechnik 0,1, Wunder 1 je Woche mit Anlass. Bitte bestätigen oder verwerfen.
22. **UEFA-Strafe mal Ligafaktor** (U19e): Die Karten rechnen alle Beträge von der 3. Liga hoch (K23f). Im Europapokal spielen fast nur Vereine der 1. Liga, dort sind es 48.000 €, im Bereich der echten Strafen.

**Noch zu recherchieren:** amtliche Rangprämie der Conference League (vorläufig aus Salary Sport geschätzt), genaue Halbfinal- und Siegprämien in Europa League und Conference League, die Zulassungsliste 2026/27 für die Länderkontingente, die Termine der Conference-League-Ligaphase 2026/27 (gefunden nur Spieltag 1 am 15.10. und Spieltag 6 am 17.12.). **Erledigt am 21.11.:** Rangprämie der Europa League, deutsche Starter 2026/27.

## Quellen

UEFA-Strafen für Pyrotechnik (U19e, Websuche 22.11.2026, nur Zusammenfassungen gelesen): [sport1: Strafe nach dem Spiel bei Lazio](https://www.sport1.de/fussball/bundesliga/2019/01/uefa-bestraft-eintracht-frankfurt-mit-geldstrafe-und-zuschauerausschluss), [nau.ch: nur Geldstrafe nach Inter](https://www.nau.ch/sport/fussball/gluck-fur-eintracht-fans-uefa-verhangt-nur-geldstrafe-65500866), [sport1: Strafe nach Marseille 2022](https://www.sport1.de/news/fussball/champions-league/2022/09/nach-marseille-ausschreitungen-uefa-verkundet-strafe-fur-eintracht-frankfurt), [sport1: Bewährung verspielt, 2025](https://www.sport1.de/news/fussball/europa-league/2025/03/bewahrung-verspielt-frankfurt-droht-fan-arger)

Alle abgerufen am 21.11.2026 (Websuche):
- Prämien Champions League 2025/26: [beIN Sports](https://www.beinsports.com/en-us/soccer/uefa-champions-league/articles/uefa-confirms-prize-distribution-for-2025-26-champions-league-2025-08-27), [Football365](https://www.football365.com/news/champions-league-2025-26-prize-money-table-arsenal-liverpool), [beIN Sports, Viertelfinale](https://www.beinsports.com/en-us/soccer/uefa-champions-league/articles/the-fortune-that-the-teams-reaching-the-quarter-finals-of-the-champions-league-like-arsenal-have-pocketed-2026-03-19), UEFA-Rundschreiben 2026/48 ([KSI](https://www.ksi.is/api/download/media/e1wixrnh/20260713_circular_2026_48_en-1.pdf))
- Prämien Europa League 2025/26: [The Scotsman](https://www.scotsman.com/sport/football/rangers/latest-rangers-news/europa-league-prize-money-202526-how-much-rangers-and-celtic-could-earn-from-playing-in-the-competition-5329844), [FootballTransfers](https://www.footballtransfers.com/en/football-finance/uefa-prize-money/2026/04/europa-league-prize-money-2025-26), [Bolavip](https://bolavip.com/en/soccer/uefa-europa-league-final-prize-money)
- Rangprämie und Bonus für Platz 1–16 in der Europa League 2025/26 (Nachtrag 21.11.): [FootballTransfers](https://www.footballtransfers.com/en/football-finance/uefa-prize-money/2026/04/europa-league-prize-money-2025-26), [Salary Sport](https://salarysport.com/football/europa-league/prize-money/) (gleiche Aufteilung in Pfund)
- Pokalsieger 2026 (Nachtrag 21.11.): [ZDFheute, Pokalfinale](https://www.zdfheute.de/sport/fussball-dfb-pokal-2025-26-finale-fc-bayern-muenchen-vfb-stuttgart-tore-ergebnis-100.html), [DFB](https://www.dfb.de/news/vfb-entthront-fc-bayern-gewinnt-zum-21-mal-den-dfb-pokal)
- Rangprämie Conference League (Nachtrag 21.11., nicht amtlich): [Salary Sport](https://salarysport.com/football/conference-league/prize-money/)
- Prämien Conference League 2025/26: [FootballTransfers](https://www.footballtransfers.com/en/transfer-news/football-finance/uefa-prize-money/2026/04/europa-conference-league-prize-money-2025-26), [SalaryLeaks](https://www.salaryleaks.com/prize-money/uefa-conference-league), [Voronoi](https://www.voronoiapp.com/sports/How-much-money-is-at-stake-in-European-Football-6678)
- Kaderliste (Nachtrag 21.11.): [UEFA-Reglement 2025/26, Art. 31](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2025/26/Article-31-Player-lists-Online), [UEFA, Meldung zur Ligaphase](https://www.uefa.com/uefachampionsleague/news/029c-1e6a3464bdcd-ac4d3eea76b7-1000--champions-league-league-phase-squads-player-registration-)
- Termine Champions League 2026/27: [UEFA](https://www.uefa.com/uefachampionsleague/news/02a8-21767f4e5e55-bd27f9adffd3-1000--champions-league-2026-27-alle-spiele-und-ergebnisse-der-liga/), [Flashscore](https://www.flashscore.de/news/fu-ball-champions-league-spielplan-termine-auslosungen-tv-alle-infos-zur-liga-phase-der-uefa-champions-league/d07YaiB4/)
- Termine Europa League und Conference League 2026/27: [UEFA, Europa League](https://www.uefa.com/uefaeuropaleague/news/02a6-20d57cfcd03e-407c22a7f465-1000--2026-27-europa-league-teams-dates-draws-format-final/), [UEFA, Conference League](https://www.uefa.com/uefaconferenceleague/news/02a6-20d57d15f093-a90cf54c928f-1000--202627-conference-league-teams-dates-draws-format-final/)
- Deutsche Startplätze: [ZDFheute](https://www.zdfheute.de/sport/fussball-champions-league-internationale-platzvergabe-100.html), [bundesliga.com](https://www.bundesliga.com/de/bundesliga/news/rennen-platz-7-conference-league-europa-freiburg-frankfurt-augsburg-37373), [Soccergraph](https://www.soccergraph.com/2026/08/which-bundesliga-clubs-qualified-for-europe.html)
- TV-Gelder Bundesliga 2025/26: [ran](https://ran.joyn.de/sports/fussball/bundesliga/bundesliga202526-die-tv-geld-tabelle-der18-klubs-85449) (Bayern 83,4 Mio., davon laut kicker 22,6 Mio. international)
