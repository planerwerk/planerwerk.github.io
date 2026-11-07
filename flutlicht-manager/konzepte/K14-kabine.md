# K14 – Stimmung, Selbstvertrauen, Kabine

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K03 (Werte, Beziehungsdaten), K15 (Gespräche) · Wird gebraucht von: K05, K08, K11, K12a, K19, K21, K29.

## 1. Ziel und Spielgefühl

- **Spieler sind Menschen:** Wer auf der Bank sitzt, obwohl er sich als Stammspieler sieht, wird unzufrieden. Wer gebraucht wird, blüht auf.
- **Langsam statt Ausschläge über Nacht:** Stimmung hat Trägheit. Die Community schätzt glaubwürdige Reaktionen, FM24 hat extreme Ausschläge reduziert (Recherche 4).
- **Die Kabine ist mehr als die Summe:** Führungsspieler, Grüppchen, Freundschaften, Rivalitäten. Ein unzufriedener Leitwolf zieht andere mit.
- **Folgen sind spürbar, aber kein Haupthebel:** Stimmung wirkt auf Training, Verträge und Wechselwünsche stärker als auf die Leistung im Spiel (Rohmaterial 9.2).

## 2. Vorbilder und Abgrenzung

- **Rohmaterial Kapitel 9:** Stimmung 0–100 aus Einsatzzeit, Erfolg, Leistung, Vertrag, Trainer, Umfeld. Wechselwunsch in Stufen. Kabine mit Ansteckung. Übernommen.
- **Football Manager:** Hierarchie, Grüppchen und Beziehungen werden angezeigt. Stimmung fällt schnell, wenn ein Spieler einen viel höheren Ruf hat als der Trainer (Recherche 3.1, 4). Übernommen als Ruf-Gefälle.
- **Anstoss 3:** Freundschaften, Konkurrenz um den Stammplatz, Landsleute, Zimmerbelegung (PLAN §4). Übernommen.
- **Bewusst anders:** **Kaderrollen** mit klarer Erwartung an Einsatzzeit. Der Spieler hat eine eigene Einschätzung, die von deiner abweichen kann. Daraus entsteht der Konflikt, nicht aus versteckten Zahlen.

## 3. Begriffe und Daten

| Wert | Bereich | Ort |
|---|---|---|
| Stimmung je Spieler | 0–100, Start 60–75 | `st` (K03) |
| Kaderrolle | Schlüsselspieler, Stammspieler, Rotation, Ergänzung, Talent | `rolle`, von dir gesetzt oder automatisch |
| Eigene Einschätzung | Rolle, die der Spieler für sich sieht | berechnet |
| Wechselwunsch | Stufe 0–4 | `ww` |
| Mannschaftsstimmung | 0–100 | berechnet |
| **Zusammenhalt** | 0–100 je Mannschaft, Start 50 | `t.zh` |
| Beziehungen | Freundschaft, Rivalität, Stärke 1–3 | `S.bz` (K03 §3.6) |
| Kapitän | ein Spieler | `t.taktik.kapitaen` (K06) |

### 3.1 Kaderrollen und Erwartung

| Rolle | erwartete Einsatzzeit (Anteil der möglichen Minuten, 6 Wochen) |
|---|---|
| Schlüsselspieler | 85 % |
| Stammspieler | 65 % |
| Rotation | 40 % |
| Ergänzung | 15 % |
| Talent | 15 %, dazu Entwicklung und gelegentliche Einsätze |

- **Eigene Einschätzung:** aus seinem Rang nach Stärke auf seiner Position im Kader, verschoben durch Ehrgeiz (ehrgeizig: eine Stufe höher) und Ruf (Nationalspieler: mindestens Stammspieler).
- **Liegt deine Rolle unter seiner Einschätzung,** sinkt die Stimmung langsam. Diven doppelt so stark.

## 4. Abläufe

1. **Wöchentlich** (Montag): Zielstimmung je Spieler aus den Bausteinen (5.1), tatsächliche Stimmung bewegt sich 15 % dorthin. Mannschaftsstimmung, Ansteckung, Zusammenhalt, Beziehungen.
2. **Sofort,** aber gedeckelt auf ±10: große Ereignisse wie Siegtor im Derby, Verkauf eines Freundes, gebrochenes Versprechen (K15).
3. **Wechselwunsch** nach Stufen (5.4), mit Gesprächswunsch als Halt (K15).
4. **Wochenbericht** des Co-Trainers: Wer unzufrieden ist und warum, wer gerade aufblüht, Stimmung in der Kabine.

## 5. Regeln und Formeln

### 5.1 Zielstimmung

```
Ziel = 60 + Einsatz + Erfolg + Leistung + Vertrag + Trainer + Umfeld   (begrenzt 0–100)
```

| Baustein | Spanne | Woraus |
|---|---|---|
| Einsatz | −25 bis +10 | Einsatzzeit gegenüber seiner Erwartung (eigene Einschätzung), Ehrgeiz verstärkt |
| Erfolg | −10 bis +10 | Tabellenplatz gegenüber der Erwartung, Serien |
| Leistung | −5 bis +5 | Form (K03) |
| Vertrag | −15 bis +5 | Gehalt gegenüber Mitspielern ähnlicher Stärke, Restlaufzeit, Versprechen im Vertrag (K21) |
| Trainer | −15 bis +10 | Gespräche, Kritik, Lob, gehaltene oder gebrochene Versprechen (K15) |
| Umfeld | −10 bis +5 | Integration und Heimweh, Medien (K29), Fans (K27), Urlaubslänge (K12a: 4 Wochen +3, 2 Wochen −3 für Spieler mit hoher Saisonbelastung) |

### 5.2 Ruf-Gefälle

- Liegt der Ruf eines Spielers (Stärke, Nationalspieler, Erfolge) deutlich über dem Ruf des Trainers (K28), wirken Gespräche und Lob nur halb, Kritik doppelt, und der Baustein „Einsatz“ fällt 1,5-mal so stark.
- So spürt ein junger Trainer bei einem Weltstar die Grenzen seiner Autorität.

### 5.3 Folgen

| Bereich | Folge |
|---|---|
| Leistung | Zustandsfaktor (K03 §5.8): unter 20 bis −3 %, über 85 bis +2 % |
| Training | unter 30 lernt er 30 % langsamer (K03 §5.6) |
| Vertrag | unter 40 verlängert er nur zu deutlich höheren Bedingungen, unter 25 gar nicht (K21) |
| Kabine | Führungsspieler unter 35 ziehen Freunde mit (5.5) |
| Wechselwunsch | Stufen nach 5.4 |

### 5.4 Wechselwunsch in Stufen

| Stufe | Auslöser | Folge |
|---|---|---|
| 1 Grummeln | Stimmung unter 40 seit 3 Wochen | Hinweis im Wochenbericht |
| 2 Gesprächswunsch | Stimmung unter 35 seit 4 Wochen | **Halt:** Gespräch (K15) |
| 3 offizieller Wechselwunsch | Stufe 2 ohne Besserung nach 4 Wochen oder gescheitertes Gespräch | will auf die Transferliste, Ablöse sinkt um 10 %, andere Vereine wissen es (K19) |
| 4 öffentlich | Stufe 3 seit 4 Wochen, Charakter Diva oder Söldner wahrscheinlicher | Medien (K29), Mannschaftsstimmung −3 |

Die Stufe sinkt wieder, wenn die Stimmung über 50 steigt.

### 5.5 Mannschaftsstimmung und Ansteckung

- **Mannschaftsstimmung** = Schnitt der Spieler, Führungsspieler zählen doppelt, der Kapitän 2,5-fach.
- **Ansteckung** wöchentlich: Ein Führungsspieler unter 35 senkt die Stimmung seiner Freunde um 2. Ein Führungsspieler über 70 hebt alle unter 50 um 1.
- **Grüppchen:** Freunde und Landsleute mit gemeinsamer Sprache bilden Gruppen. Liegt eine Gruppe im Schnitt unter 35, sinkt der Zusammenhalt um 2 pro Woche (Ereignis „Grüppchenbildung“).

### 5.6 Zusammenhalt

- **Steigt:** +1 pro Woche mit unveränderter Stammelf, +1 je Sieg, +1 pro Tag im Trainingslager bis zum 7. Tag (K11), Teamevent.
- **Sinkt:** −4 je neuem Stammspieler (wie K06 bei der Vertrautheit), −3 je Streit, Grüppchen (5.5).
- **Wirkung:** Teamwerte ×(0,97 + 0,0006 × Zusammenhalt), also −3 % bei 0, ±0 bei 50, +3 % bei 100 (Rohmaterial 4.4).

### 5.7 Beziehungen im Kader

| Entsteht durch | Art |
|---|---|
| gemeinsames Zimmer im Trainingslager (K11), Landsleute mit gemeinsamer Sprache, ähnliches Alter, gemeinsame Saisons | Freundschaft (Stärke wächst mit der Zeit) |
| gleiche Position, ähnliche Stärke, beide ehrgeizig | Rivalität um den Stammplatz |
| Streit, Hitzköpfe, Rangelei im Training (K07) | Rivalität |

| Wirkung | |
|---|---|
| Freunde | Verkauf des Freundes: −8 Stimmung. Freund unzufrieden: Ansteckung (5.5). Nebeneinander auf dem Platz: Teamwert ihres Bereichs +0,5 %. |
| Rivalen | beide lernen 5 % schneller (Konkurrenz belebt). Wer den Platz verliert, verliert doppelt Stimmung. Streit-Risiko bei Hitzköpfen. |
| Landsleute | Integration schneller, Deutsch langsamer (K03 §5.5) |

### 5.8 Kapitän

- Du wählst den Kapitän. Hohe Führung und lange Vereinszugehörigkeit: Mannschaftsstimmung +2.
- **Absetzen:** −10 Stimmung für ihn, −3 für seine Freunde.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| Kaderrollen festlegen | klare Erwartungen | wer weniger bekommt als er denkt, wird unzufrieden |
| Einsatzzeit verteilen | zufriedene Spieler | Leistung, Frische |
| Gespräche (K15) | Stimmung, Versprechen | Glaubwürdigkeit, wenn man nicht liefert |
| Kapitän | Stimmung | Absetzen kostet |
| Teamevent | +5 Stimmung für alle, Zusammenhalt +5, nutzt sich ab | Geld (K23), höchstens einmal im Monat sinnvoll |
| Prämien (K21) | Erfolg wird belohnt | Geld |
| Zimmer einteilen (K11) | Freundschaften | Streit bei Rivalen |
| Kader zusammenstellen (K19) | Landsleute, Führungsspieler | Ablöse, Gehalt |
| Geldstrafen erlassen (K09) | Stimmung | Disziplin, Geld |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln. Ihre Spieler haben Stimmung, Rollen und Wechselwünsche. Daraus entstehen Gelegenheiten für dich auf dem Markt (K19): ein unzufriedener Star wird billiger.
- Computer-Trainer verteilen Rollen nach Stärke und spielen ihre Stammspieler, mit Rotation nach Frische.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Gesprächswunsch (Entscheidung) | Stufe 2 | Gespräch (K15) |
| Grüppchenbildung (Entscheidung) | Gruppe im Schnitt unter 35 | Aussprache, Anführer verkaufen, Teamevent |
| Führungsspieler meutert | Führungsspieler unter 25 | Mannschaftsstimmung −5, Gespräch dringend |
| Kabinenparty nach Derbysieg | Derbysieg | Stimmung +5, Zusammenhalt +3, eventuell Partylöwen-Folgekarte |
| Neuzugang drängt auf Einsatz | teurer Neuzugang als Ergänzung | Gespräch, Stimmung |
| Heimweh | aus K03 §8 | Stimmung, Integration |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | Stimmung im Zustandsfaktor, Lernbremse, Eigenschaften (Diva, Führungsspieler, Integrationsfigur, Mentor) |
| K05 Live-Spiel | Ansprache, Zurufe, frühe Auswechslung (Diva) |
| K06 Taktik | Spieler hadert mit Position, Kapitän |
| K08 Jugend | Talente mit Rolle „Talent“, Mentor |
| K11 Trainingslager | Zimmer, Zusammenhalt, Lagerkoller |
| K12a Sommer | Urlaubslänge |
| K15 Gespräche | wichtigster Hebel auf den Baustein „Trainer“, Versprechen |
| K19, K21 | Wechselwunsch, Verträge, Gehaltsgefüge |
| K27, K29 | Fans und Medien im Baustein „Umfeld“ |
| K28 Vorstand | Ruf des Trainers für das Ruf-Gefälle |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Verteilung | 70 % der Spieler zwischen 45 und 80 Stimmung |
| Trägheit | ohne große Ereignisse höchstens ±8 in einer Woche |
| Bankplatz | ein ehrgeiziger Spieler, der sich als Stammspieler sieht und 6 Wochen kaum spielt, erreicht in 60–80 % der Fälle Stufe 2 |
| Leistung | Mannschaftsstimmung kostet oder bringt höchstens 3 Punkte pro Saison (über den Zustandsfaktor) |
| Zusammenhalt | ein Team mit 6 neuen Stammspielern startet bei etwa −2 % und erholt sich in 8–12 Wochen |
| Keine Dauerkrise | über eine Saison im Schnitt höchstens ein offizieller Wechselwunsch (Stufe 3) je Kader |

## 11. Stellschrauben

```js
kabine:{
  rollen:{schluessel:0.85,stamm:0.65,rotation:0.40,ergaenzung:0.15,talent:0.15},rollenWochen:6,
  ziel:{basis:60,einsatz:[-25,10],erfolg:[-10,10],leistung:[-5,5],vertrag:[-15,5],trainer:[-15,10],umfeld:[-10,5]},
  traegheit:0.15,sofortMax:10,diva:2,
  rufGefaelle:{ab:15,lob:0.5,kritik:2,einsatz:1.5},
  folgen:{leistung:{unter:20,minus:0.03,ueber:85,plus:0.02},lernenUnter:30,vertragUnter:[40,25]},
  wechsel:{grummeln:[40,3],gespraech:[35,4],offiziell:4,oeffentlich:4,abloese:0.9,teamMinus:3,zurueckAb:50},
  ansteckung:{fuehrerUnter:35,freunde:-2,fuehrerUeber:70,alle:1},gruppeUnter:35,gruppeZh:-2,
  zusammenhalt:{start:50,stammelf:1,sieg:1,lager:1,neuer:-4,streit:-3,wirkung:[0.97,0.0006]},
  freunde:{verkauf:-8,nebeneinander:0.005},rivalen:{lernen:1.05,platzverlust:2},
  kapitaen:{gut:2,absetzen:-10,absetzenFreunde:-3},teamevent:{stimmung:5,zh:5}
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Kaderrollen** mit fester Erwartung an Einsatzzeit und eigener Einschätzung des Spielers. Das macht Unzufriedenheit nachvollziehbar.
2. **Zusammenhalt** als eigener Teamwert neben der taktischen Vertrautheit (K06): das eine ist Chemie, das andere Taktik.
3. **Stimmung wirkt wenig auf die Leistung** (−3 % bis +2 %), aber stark auf Training, Verträge und Wechselwünsche.
4. **Teamevent** als einfacher Hebel mit Abnutzung.

## Quellen

- Stimmung, Folgen, Kabine, Gespräche: `konzepte/_rohmaterial-logik-v1.md`, Kapitel 9
- Ruf des Trainers, Trägheit, Kabinendynamik: `konzepte/_recherche-genre.md`, Abschnitte 3.1 und 4
- Freundschaften, Rivalität, Landsleute, Zimmer: PLAN §4 (GameStar 4/2000)
