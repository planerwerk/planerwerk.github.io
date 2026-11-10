# K22 – Berater

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
Hängt ab von: K21 (Verträge), K17 (Beziehungen) · Wird gebraucht von: K19, K20, K29, K30.

## 1. Ziel und Spielgefühl

- **Zwischen dir und dem Spieler steht oft jemand:** Der Berater verhandelt, treibt den Preis, streut Gerüchte oder hält dicht.
- **Berater sind Menschen mit Profil:** gierig, seriös, verschwiegen. Wer sie kennt, verhandelt besser.
- **Beziehungen zahlen sich aus:** Ein Berater, mit dem du gut kannst, gibt Tipps, bietet dir Spieler an und hilft beim Überzeugen (PLAN §2: der entfernte Verwandte, der den Berater kennt).

## 2. Vorbilder und Abgrenzung

- **Football Manager:** Berater und Vermittler gegen Provision, Angebote von Beratern ab FM27 während des ganzen Transferfensters (Recherche 3.1, 4d).
- **Community-Wunsch:** Beziehungen zu Beratern aufbauen, die dann helfen, Spieler zu überzeugen (Recherche 4b).
- **Bewusst anders:** Berater sind erfunden. Keine echten Namen.

## 3. Begriffe und Daten

### 3.1 Profile

| Profil | Forderung (K21) | Tempo | Presse | Besonderheit |
|---|---|---|---|---|
| gierig | ×1,15 | schnell, drängt | streut gern Gerüchte, um den Preis zu treiben | redet dem Spieler Wechsel ein (Wechselwunsch leichter) |
| seriös | ×1,0 | normal | ruhig | hält Absprachen ein, Infos verlässlich |
| verschwiegen | ×1,05 | langsam | nichts dringt nach außen | Abwerben über ihn bleibt eher geheim (K20) |
| Strippenzieher | ×1,1 | normal | gezielt | viele Mandanten, bietet Pakete an |
| Familienberater | ×0,95 | langsam | unberechenbar | Vater oder Bruder, treu, aber unerfahren, emotional |

### 3.2 Werte

| Wert | Bereich | Ort |
|---|---|---|
| Profil | aus 3.1 | `S.berater[]` |
| Provision | 5–10 % des ersten Jahresgehalts, bei Transfers zusätzlich 3–8 % der Ablöse | Spielwerte |
| Mandanten | Liste von Spielern | am Spieler `berater` |
| Beziehung zu dir | −100 bis +100 | K17 |
| Einfluss | 1–20, wie viele Türen er öffnen kann | `S.berater[]` |

- Etwa 60 % der Profis haben einen Berater, junge Spieler und Stars fast immer. Ein Berater hat 1–25 Mandanten.

## 4. Abläufe

1. **Verhandlung mit Berater:** Antwort nach 1–3 Tagen statt sofort (K21). Er nennt Forderungen für Gehalt, Handgeld und Provision.
2. **Provision** wird bei Unterschrift fällig (K23).
3. **Angebote von Beratern:** Während der Transferfenster bieten Berater dir Mandanten an, passend zu deinem Bedarf, wenn die Beziehung reicht. Info im Posteingang, kein Halt.
4. **Treffen mit dem Berater** als eigene Handlung, auch am Verein vorbei (K20, Abwerben).
5. **Beziehung** ändert sich durch faire oder harte Verhandlungen, eingehaltene Absprachen, gemeinsame Geschäfte (K17).

## 5. Regeln und Formeln

- **Forderungsfaktor** nach Profil (3.1), verschoben durch die Beziehung: je 20 Punkte Beziehung ±2 %.
- **Gerüchte:** gierige Berater lassen mit 30 % je Verhandlungswoche ein Gerücht in die Presse (K29). Das kann andere Vereine anlocken (Markt ×1,1–1,3 in K21).
- **Wechselwunsch:** Mandanten gieriger Berater erreichen Stufe 3 in K14 eine Woche früher.
- **Tipps:** Bei Beziehung über 40 nennt der Berater Spieler, die einen Wechsel erwägen, mit ehrlicher Kenntnis 50 (K18).
- **Paket:** Ein Strippenzieher bietet einen Wunschspieler nur zusammen mit einem zweiten Mandanten an (zum Beispiel ein Reservist mit Gehalt).
- **Familienberater:** reagieren auf Kritik am Spieler emotional (Beziehung −10) und auf Lob für den Spieler besonders gut.

## 6. Hebel des Spielers

| Hebel | Nutzen | Preis |
|---|---|---|
| gute Beziehung pflegen | bessere Preise, Tipps, Hilfe beim Überzeugen | faire Verhandlungen, manchmal etwas mehr zahlen |
| hart verhandeln | heute billiger | Beziehung − |
| über den verschwiegenen Berater abwerben | Diskretion | Provision |
| Paket annehmen | Wunschspieler | Ballast im Kader |

## 7. Verhalten der Computer-Vereine

Gleiche Regeln. Berater bieten auch Computer-Vereinen Spieler an, gierige spielen Vereine gegeneinander aus (Bieterwettstreit in K20).

## 8. Ereignisse

| Karte | Auslöser | Folge |
|---|---|---|
| Berater bietet an | Transferfenster, Bedarf, Beziehung | Info mit Kandidat |
| Berater droht mit Wechsel | gieriger Berater, Verlängerung stockt (K21) | Presse, Druck |
| Der entfernte Verwandte (Entscheidung) | aus PLAN §2, Zufall | über den Berater einen umworbenen Spieler holen, die Konkurrenten streiten untereinander (K30) |
| Berater-Wechsel | Spieler wechselt den Berater | Beziehung neu |
| Provisionsstreit | Berater fordert nachträglich mehr | zahlen (Geld) oder nicht (Beziehung −, Stimmung des Spielers −) |

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K14 Kabine | Wechselwunsch über gierige Berater |
| K17 Beziehungen | Beziehungswert zum Berater |
| K18 Scouting | Tipps mit Kenntnis, Übertreibungen bei Angeboten |
| K19, K20 | Transfers, Abwerben, Bieterwettstreit |
| K21 Verträge | Forderungsfaktor, Tempo, Provision |
| K23 Finanzen | Provisionen |
| K29 Presse | Gerüchte |
| K30 Ereigniskarten | Berater-Geschichten |

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Anteil mit Berater | 55–65 % der Profis, über 90 % der Spieler ab Stärke 80 |
| Beziehung lohnt | gute Beziehung (über 60) senkt die Kosten eines Transfers im Schnitt um 3–6 % |
| Gerüchte | gierige Berater erzeugen mindestens dreimal so viele Gerüchte wie seriöse |

## 11. Stellschrauben

```js
berater:{
  profile:{gierig:{forderung:1.15,geruecht:0.30,wechsel:-1},serioes:{forderung:1},verschwiegen:{forderung:1.05,geheim:true},
    strippenzieher:{forderung:1.1,paket:true},familie:{forderung:0.95,emotional:true}},
  anteilMit:0.6,anteilStars:0.9,starsAb:80,mandanten:[1,25],
  provision:{gehalt:[0.05,0.10],abloese:[0.03,0.08]},
  beziehung:{je20:0.02,tippsAb:40,tippKenntnis:50},antwortTage:[1,3]
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Fünf Profile,** darunter Strippenzieher und Familienberater als eigene Typen.
2. **Provisionen als Spielwerte.** Die echten Regeln (FIFA-Beraterreglement, Rechtsstreit um Obergrenzen) sind nicht geprüft und für das Spiel nicht nötig.

**Mit dir entschieden (10. November 2026): Kontakte zu Beratern bringen bessere Deals.** Wie man sie aufbaut, war offen („irgendwie umgarnen“). Mein Vorschlag (vorläufig):

3. **Womit du Beziehung aufbaust** (Beziehung −100 bis +100, K17):

| Handlung | Beziehung | Preis, Grenze |
|---|---|---|
| fairer, zügiger Abschluss (höchstens zwei Runden, Provision pünktlich) | +5 | – |
| seinen Mandanten gut behandeln: gehaltene Zusagen, Einsatzzeit nach Rolle, Entwicklung (+3 Stärke in einer Saison) | +3 je Saison und Mandant | hängt an K14, K15 |
| einen Mandanten zu einem guten Preis ziehen lassen, wenn er weg will | +8 | Ablöse niedriger |
| einem jungen Mandanten eine Chance geben (Probetraining, Leihe, Debüt) | +4 | Kaderplatz |
| **Einladung in die VIP-Loge oder zum Essen** | +3 | Geld (Logen aus K26 werden so auch für Kontakte nützlich), höchstens einmal im Monat je Berater wirksam, nutzt sich ab wie Gespräche (K15) |
| Provision großzügiger als gefordert | +1 je Prozentpunkt | Geld, höchstens +5 |
| ein Sportdirektor mit Netzwerk (K16 §12 Nr. 12) | +20 bis +40 für seine Kontakte | Gehalt, Kontakte gehen mit ihm |

4. **Womit du sie beschädigst:** harte Verhandlung über drei Runden (−5), gebrochene Zusage an seinen Mandanten (−10, K15), ein Mandant sitzt gegen seine Rolle dauerhaft auf der Bank (−3 je Monat, K14 Bankzeit nach Grund), Verkauf gegen den Willen des Spielers (−8), Abwerben über ihn fliegt auf (−15, K20), Gerüchte aus deinem Verein (K29). Ohne Kontakt verblasst die Beziehung jede Saison um ein Viertel Richtung null.
5. **Was eine gute Beziehung bringt:** Forderungen −2 % je 20 Punkte (wie bisher, höchstens −10 %), ehrliche Tipps zu wechselwilligen Spielern ab +40 (wie bisher), **Erstzugriff** ab +60 (er bietet dir einen Mandanten an, bevor andere Vereine davon hören), ab +60 rät er seinem Spieler zu dir (Interesse +10 % in K19) und warnt dich, bevor ein Mandant aus deinem Kader woanders einen Vorvertrag unterschreibt (K21).
6. **Deckel:** Zusammen mit dem Sportdirektor sinkt eine Forderung höchstens um 15 % (K16 §12 Nr. 16).
7. **Risiko großer Nähe:** Hat ein Berater fünf und mehr Mandanten in deinem Kader, entsteht ein Berater-Klüngel. Er drängt dir Pakete auf (Strippenzieher), seine Mandanten halten zusammen (Grüppchen, K14), die Presse spricht vom „Beraterverein“ (K29).
8. **Bestechung und Schwarzgeld** sind kein Werkzeug für Beziehungen. Manipulation und Wettbetrug gibt es nur als sehr seltene Weltereignisse (K30 §8.4, entschieden 10.11.).
9. **Computer-Vereine** bauen Beziehungen nach denselben Regeln auf. Große Vereine machen viele Geschäfte und haben so von selbst die besten Kontakte zu den großen Beratern (K02 §5.3a).

## Quellen

- Berater, Provision, Angebote während des Fensters: `konzepte/_recherche-genre.md`, Abschnitte 3.1, 4b, 4d
- Der entfernte Verwandte, Abwerben: PLAN §2
