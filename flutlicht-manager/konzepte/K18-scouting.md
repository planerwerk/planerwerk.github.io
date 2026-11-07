# K18 – Scouting und Informationsnebel

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K03 (Werte, Sichtbarkeit), K16 (Scouts als Mitarbeiter), K35a (unscharfe Regler) · Wird gebraucht von: K06, K08, K19, K20, K31, K32.

## 1. Ziel und Spielgefühl

- **Jeder Spieler hat echte Werte, aber was du siehst, hängt vom Scouting ab** (PLAN §2). Besonders unsicher sind Jugendspieler und Spieler aus dem Ausland.
- **Ehrliche Unsicherheit:** Unbekanntes sieht unscharf aus, als Spanne oder Fragezeichen. Kein falscher Wert, der so tut, als wäre er sicher.
- **Fehleinschätzungen gehören dazu:** Ein schwacher Scout liegt öfter daneben, und manche Scouts haben einen Lieblingstyp.
- **Weniger Klickarbeit:** Suchaufträge, die Scouts selbstständig pflegen (Community-Wunsch, Recherche 4b).

## 2. Vorbilder und Abgrenzung

- **Football Manager:** Scout-Berichte, Wissensstand je Region, Suchaufträge. Kritik: Berichte zu unzuverlässig (Recherche 4b).
- **Rohmaterial 4.5:** Spannen, die mit Beobachtung, Spielen gegen den Spieler und gleicher Liga schmaler werden. Übernommen, aber mit Stärke statt „Technik“ (K03 §9).
- **Bewusst anders:** Die Spanne ist **ehrlich**. Auch der Fehler eines schlechten Scouts steckt in der Breite. Wer einen schwachen Scout hat, sieht breitere Spannen, keine falschen Punktwerte.

## 3. Begriffe und Daten

| Begriff | Bedeutung | Ort |
|---|---|---|
| **Kenntnis** | wie gut dein Verein einen Spieler kennt, 0–100 | `S.kenntnis` (nur für Spieler mit Kenntnis über dem Grundwert gespeichert) |
| Grundkenntnis | was jeder weiß, ohne zu beobachten | berechnet (3.1) |
| Scout | Mitarbeiter mit Qualität, Spezialgebiet, Lieblingstyp | `S.stab` (K16) |
| Auftrag | Spieler beobachten, Suchauftrag, Gegnerbeobachtung | `S.auftraege` |
| Bericht | Spannen, Merkmale, Eigenschaften, Empfehlung | `S.berichte` |

### 3.1 Grundkenntnis

| Spieler | Grundkenntnis |
|---|---|
| eigener Verein | 100 (Stärke genau, Talent über Co-Trainer, K03) |
| gleiche Liga | 40, +5 je Spiel gegen ihn |
| andere deutsche Profiliga | 25 |
| Regionalliga, vereinslos | 15 |
| Ausland (Pool aus K32) | 5 |
| Jugendspieler anderer Vereine | 0 |

### 3.2 Was man je Kenntnis sieht

| Kenntnis | Stärke | Talent | Merkmale | Eigenschaften | Verletzungen |
|---|---|---|---|---|---|
| 0–19 | grobe Spanne (±12) oder „?“ | ? | ? | ? | ? |
| 20–39 | Spanne ±8 | Sterne-Spanne über 3 Stufen | die auffälligsten | ? | ? |
| 40–59 | Spanne ±5 | über 2 Stufen | bekannt oder vermutet | Gerüchte (K29) | grob |
| 60–79 | Spanne ±3 | über 2 Stufen, enger | alle | die meisten | genau |
| 80–100 | Spanne ±1–2 | über 1–2 Stufen | alle | alle, mit gutem Scout | genau |

Dazu kommt die Breite aus dem möglichen Fehler des Scouts (5.2). Position, Fuß, Alter, Nationalität, Verein, Vertragsende und Statistik sind immer öffentlich.

## 4. Abläufe

1. **Spieler beobachten:** Scout auswählen, 1–3 Wochen. Danach Bericht und höhere Kenntnis.
2. **Suchauftrag:** Kriterien (Position, Alter, Stärke ab, Ablöse bis, Gehalt bis, Merkmal, Region). Der Scout liefert über die Wochen eine gepflegte Liste mit 3–8 Kandidaten und Kurzbericht. Er fügt hinzu und streicht, ohne dass du klicken musst.
3. **Gegnerbeobachtung:** vor einem Spiel. Macht die Vorschau genauer (Tauziehen, K35a) und zeigt den wahrscheinlichen Stil (K06). Ergänzt den Videoanalysten (K16).
4. **Kenntnis verblasst:** −2 pro Monat für Spieler, die niemand mehr beobachtet, nicht unter die Grundkenntnis.
5. **Bericht** erscheint im Posteingang als Info, kein Halt.

## 5. Regeln und Formeln

### 5.1 Kenntnis gewinnen

```
Kenntnis je Woche Beobachtung = 12 × (0,6 + 0,03 × Qualität) × Spezialgebiet (1,3 im eigenen, 0,8 außerhalb)
```

- Ein durchschnittlicher Scout (Qualität 10) im eigenen Gebiet bringt etwa 14 pro Woche. Einen Spieler einer anderen deutschen Liga bringt er in zwei Wochen von 25 auf etwa 53, in drei auf etwa 67.
- Spiele gegen den Spieler: +5 je Spiel für alle, die ihn gesehen haben.

### 5.2 Fehler des Scouts

- **Grundfehler:** Jeder Scout hat je Spieler einen festen Fehler, gewürfelt beim ersten Bericht, Streuung `0,3 × (21 − Qualität)` Stärkepunkte. Bei Qualität 5 also etwa ±5, bei 18 etwa ±1.
- **Lieblingstyp:** Manche Scouts überschätzen einen Typ um +2 bis +4, zum Beispiel schnelle Spieler, Kopfballspieler oder junge Spieler. Sichtbar als Eigenschaft des Scouts, wenn man ihn länger kennt.
- **Ehrlichkeit:** Die angezeigte Spanne = Spanne aus der Kenntnis + Unsicherheit aus dem Fehler. So liegt der wahre Wert in mindestens 80 % der Fälle in der Spanne (K35a §10). Mit schlechten Scouts sind die Spannen breiter, nicht falsch.
- **Mehrere Scouts** auf denselben Spieler: Die Fehler mitteln sich teilweise, die Spanne wird schmaler.

### 5.3 Empfehlung

- Der Scout vergleicht den Spieler mit deinem Kader auf seiner Position: „Verpflichten“ (besser als dein Stammspieler), „beobachten“, „kein Bedarf“.
- Er schätzt Marktwert und Gehaltsforderung als Spanne (K19, K21).

### 5.4 Kosten

- Gehalt der Scouts (K16).
- Reisekosten je Beobachtungswoche: Inland 3.000 €, Ausland 15.000 € (Spielwerte, K23).

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| mehr und bessere Scouts | schmalere Spannen, weniger Fehlkäufe | Gehalt, Reisekosten |
| Spezialgebiete abdecken | Ausland, Jugend, Torhüter | Gehalt |
| Suchaufträge | Kandidaten ohne Klickarbeit | Scout ist gebunden |
| ohne Scouting kaufen | schnell | Risiko, einen schwächeren Spieler zu bekommen |
| zweiten Scout auf ein Ziel | Fehler mitteln sich | doppelte Kosten |

## 7. Verhalten der Computer-Vereine

- Gleiche Regeln: Auch Computer-Vereine kennen fremde Spieler nur unscharf, nach ihrem eigenen Scouting.
- Sie **bewerten mit Unsicherheit** und können sich irren. Das sorgt für glaubwürdige Fehlkäufe und Schnäppchen auf dem Markt (K19, K31).
- Große Vereine haben mehr und bessere Scouts, auch im Ausland.

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Geheimtipp | Scout findet im Suchauftrag einen Spieler weit über seinem Marktwert | Info mit Empfehlung |
| Scout liegt daneben | gekaufter Spieler mindestens 5 unter der Mitte der letzten Spanne | Hinweis, Ruf des Scouts sinkt |
| Konkurrenz am Tisch | anderer Verein beobachtet denselben Spieler | Info, Preis steigt eventuell (K19) |
| Talent aus dem Nichts | Jugendscout entdeckt einen 16-Jährigen | Probetraining (K08) |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K03 Spieler | was sichtbar ist, Talentsterne |
| K06 Taktik | Gegneranalyse, wahrscheinlicher Stil |
| K08 Jugend | Jugendscouting, Probetraining |
| K16 Stab | Scouts als Mitarbeiter, Videoanalyst |
| K19, K20 | Bewertung vor dem Angebot, Konkurrenz |
| K22 Berater | Berater übertreiben gern (Infos aus Gesprächen mit Beratern sind unsicher) |
| K29 Presse | Gerüchte über Charakter |
| K31 Computer-Vereine | bewerten mit eigener Unsicherheit |
| K32 Welt | Auslandspool mit niedriger Grundkenntnis |
| K35a Oberfläche | Spannen-Regler, Fragezeichen, Filter mit Spannen |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Ehrlichkeit | wahrer Wert in mindestens 80 % der Fälle in der Spanne, für jede Scout-Qualität |
| Tempo | Spieler einer anderen deutschen Liga mit durchschnittlichem Scout in 2–3 Wochen auf Kenntnis 60 |
| Fehlkäufe | ohne Scouting liegen 20–30 % der Neuzugänge 5 oder mehr unter der Erwartung, mit gutem Scouting unter 10 % |
| Suchauftrag | 3–8 Kandidaten innerhalb von 4 Wochen |
| KI irrt auch | Computer-Vereine kaufen gelegentlich zu teuer oder zu billig, Abweichung im Schnitt ähnlich wie bei dir mit Durchschnitts-Scouting |

## 11. Stellschrauben

```js
scouting:{
  grund:{eigen:100,liga:40,jeSpiel:5,deutsch:25,unten:15,ausland:5,jugend:0},
  sicht:[[20,12],[40,8],[60,5],[80,3],[101,1.5]],          // [bis Kenntnis, Spanne ± Stärke]
  proWoche:{basis:12,q:[0.6,0.03],gebiet:1.3,fremd:0.8},
  fehler:{je:0.3,lieblingstyp:[2,4],lieblingsChance:0.3},
  ehrlich:0.8,verblassen:2,
  kosten:{inland:3000,ausland:15000},
  suche:{kandidaten:[3,8],wochen:4}
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Kenntnis je Spieler gespeichert,** nur wenn über dem Grundwert. Das hält den Spielstand klein.
2. **Ehrliche Spannen** auch bei schlechten Scouts: breiter statt falsch.
3. **Lieblingstyp der Scouts** als kleine Persönlichkeit.
4. **Kosten sind Spielwerte,** Kalibrierung mit K23.

## Quellen

- Informationsnebel und Scouting: PLAN §2, `konzepte/_rohmaterial-logik-v1.md`, Abschnitt 4.5
- Suchaufträge, verlässlichere Berichte: `konzepte/_recherche-genre.md`, Abschnitt 4b
- Ehrliche Unsicherheit in der Oberfläche: `konzepte/K35-oberflaeche.md`
