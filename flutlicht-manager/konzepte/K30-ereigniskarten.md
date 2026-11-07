# K30 – Ereigniskarten und Story-Playbook (Gerüst)

Status: **Entwurf des Gerüsts** (7. November 2026), geschrieben ohne Rücksprache. Der Katalog wächst laufend (PLAN §3).
Hängt ab von: K01 (Halte), K02 (Zufall), allen Bereichen, die Karten liefern · Wird gebraucht von: allen Konzepten mit Abschnitt 8.

## 1. Ziel und Spielgefühl

- **Geschichten, die aus dem Spiel entstehen:** Karten hängen an echten Zuständen (Form, Stimmung, Beziehungen, Verträge), nicht an Zufall allein.
- **Dosiert, damit es nicht zu viel wird** (PLAN §2). We Are Football 1 wurde für „zu viele Karten“ kritisiert (Recherche 3.2). Bei uns gilt ein festes Budget für Unterbrechungen.
- **Entscheidungen mit Folgen,** sofort und später, manchmal als Kette.
- **Ton:** mit Humor, wie Anstoss (Recherche 2.2), aber ohne Albernheit, die das Spiel entwertet.

## 2. Vorbilder und Abgrenzung

- **PLAN §4 (Notizen zu K30):** Aufbau einer Karte, Dosierung, erste Ideen. Übernommen.
- **Football Manager:** Ereignisse und Pressefragen, oft ohne spürbare Folgen (Recherche 4). Bei uns hat jede Option eine Wirkung, die das Spiel wirklich rechnet.
- **Bewusst anders:** Die meisten Karten sind **Infos im Posteingang,** nur wenige halten an. Karten werden aus den Konzepten gespeist, nicht als loses Zufallsfeuerwerk.

## 3. Begriffe und Daten

### 3.1 Aufbau einer Karte

| Teil | Inhalt |
|---|---|
| Kennung, Titel, Bereich | zum Beispiel `heimweh`, „Heimweh“, K03 |
| Gewicht | klein oder groß |
| Art | Info (Posteingang) oder Entscheidung (Halt) |
| Auslöser | Bedingungen über den Spielstand („Heimweh-Typ, Integration unter 40 seit 8 Wochen“) |
| Häufigkeit | Grundchance je Prüfung (täglich oder wöchentlich) |
| Sperrzeit | wie lange dieselbe Karte nicht wiederkommt (je Spieler oder je Verein) |
| Beteiligte | Rollen, die beim Auslösen besetzt werden (Spieler, Verein, Berater, Journalist) |
| Textvarianten | mehrere Texte mit Platzhaltern (`{spieler}`, `{verein}`) |
| Entscheidungen | 0 bis 3 Optionen, je mit Kosten, Wirkungen und Wahrscheinlichkeiten |
| Folgen | sofort und verzögert (in N Tagen) |
| Folgekarten | Kette mit Bedingung und Verzögerung |

### 3.2 Wirkungen

Karten dürfen nur Werte ändern, die es im Spiel gibt (K35a: Texte beschreiben nur, was das Spiel rechnet). Erlaubte Wirkungen, jeweils mit Ziel und Betrag:

- Stimmung, Selbstvertrauen, Form, Frische, Kondition (K03, K14)
- Zusammenhalt, Glaubwürdigkeit (K14, K15)
- Vertrauen des Vorstands, Ruf des Trainers (K28)
- Beziehung zu Verein, Berater, Journalist (K17)
- Geld (K23), Fans (K27, später)
- Persönlichkeit um 1–3 (K03 §5.7), Talent (nur über K08)
- Merker für Ketten („Familie ist umgezogen“)

### 3.3 Speicherorte

- Katalog: `daten/karten.js` (Stammdaten, mit Texten).
- Logik: `js/karten.js`.
- Dosierung und Grundchancen: `daten/regeln.js` → `karten`.
- Spielstand: zuletzt gezogene Karten mit Datum (Sperrzeiten), offene Ketten (`S.karten`).

## 4. Abläufe

1. **Prüfen** (täglich in „Tag beenden“ für tägliche, montags für wöchentliche Karten): Welche Karten sind auslösbar?
2. **Auswählen:** Gewichtung nach Grundchance und Priorität, Zufall aus dem Tag-Strom „ereignisse“ (K02).
3. **Budget prüfen** (5.1): Ist eine Entscheidung noch drin? Sonst wird eine Entscheidungskarte als Info gezeigt (der Co-Trainer entscheidet nach Automatik, K16) oder zurückgestellt.
4. **Zeigen:** Info im Posteingang oder Halt mit Entscheidung.
5. **Folgen** anwenden, verzögerte Folgen und Folgekarten in den Kalender legen.

## 5. Regeln und Formeln

### 5.1 Dosierung

| Grenze | Wert |
|---|---|
| Halte insgesamt pro Woche | 2–4 (PLAN §2), Spiele mitgezählt |
| Entscheidungskarten | höchstens eine kleine pro Woche, eine große pro Monat (PLAN §4) |
| je Bereich | höchstens eine Entscheidungskarte pro Woche (so in K03, K06 und anderen vorgesehen) |
| Infos | ohne Grenze, aber höchstens 5 Karten-Infos pro Woche, damit der Posteingang lesbar bleibt |

- Der **Regler Meldungsdichte** (K35a) verschiebt die Grenzen: wenig (eine Entscheidung alle zwei Wochen), normal, viel (zwei pro Woche).
- **Zurückgestellte** Karten verfallen nach ihrer Gültigkeit (Standard 14 Tage), wenn der Auslöser nicht mehr gilt.

### 5.2 Priorität

1. Karten aus Fristen und Pflichten (Sportgericht, Gesprächswunsch Stufe 2, Ultimatum)
2. große Karten mit Kettenfortsetzung
3. Karten mit hoher Bedeutung für den Spieler (Stammspieler, Kapitän)
4. übrige

### 5.3 Wiederholung

- Sperrzeit je Karte und Beteiligtem (Standard 120 Tage).
- Textvarianten werden reihum genutzt, damit sich nichts wöchentlich wiederholt (Lehre aus den Pressekonferenzen, Recherche 4).

## 6. Hebel des Spielers

- Entscheidungen in den Karten.
- Regler Meldungsdichte.
- Automatik: Der Co-Trainer oder der zuständige Mitarbeiter entscheidet Karten, die als Info kommen (K16).

## 7. Verhalten der Computer-Vereine

Computer-Vereine bekommen keine Karten. Ihre Geschichten entstehen aus denselben Zuständen und werden über die Presse (K29) sichtbar, zum Beispiel „Ärger im Lager von X“.

## 8. Katalog (Stand 7.11.)

### 8.1 Aus den Konzepten

Jedes Konzept führt seine Karten in Abschnitt 8. Stand heute:

| Konzept | Karten (ungefähr) | Beispiele |
|---|---|---|
| K03 Spieler | 10 | Durchbruch, Formkrise, Heimweh, Partynacht |
| K05 Live-Spiel | 4 | Joker sticht, Handschlag verweigert |
| K06 Taktik | 4 | Taktik-Coup, Spieler hadert mit Position |
| K07 Training | 6 | Spieler bittet um Pause, Rangelei im Training |
| K08 Jugend | 6 | Goldener Jahrgang, Probetraining, Skandal ums Wunderkind |
| K09 Sportgericht | 5 | Einspruch, Rudelbildung, Pyro-Show |
| K10 Medizin | 5 | Kreuzbandriss, spielt trotz Schmerzen, Grippewelle |
| K11 Testspiele | 7 | Dorfverein im Ausnahmezustand, Lagerkoller |
| K12a Sommer | 4 | Übergewicht nach dem Urlaub, Urlaub verlängern |
| K13 Wettbewerbe | 5 | Pokal-Los des Jahres, Anruf des Bundestrainers |
| K14 Kabine | 6 | Grüppchenbildung, Führungsspieler meutert |
| K15 Gespräche | 4 | Versprechen kippt, Kabine glaubt dir nicht mehr |
| K16 Stab | 4 | Co-Trainer wird Cheftrainer, Ex-Kapitän kehrt zurück |
| K17 Beziehungen | 4 | Hilfe in der Not, Fehde in der Presse, Versöhnung |
| K18 Scouting | 4 | Geheimtipp, Talent aus dem Nichts |
| K19 Transfers | 5 | Befund beim Medizincheck, Rückkehr des verlorenen Sohns |
| K21 Verträge | 5 | Vorvertrag woanders, Gehaltsneid |
| K22 Berater | 5 | Der entfernte Verwandte, Provisionsstreit |
| K28 Vorstand | 5 | Ultimatum, Präsident mischt sich ein, neuer Präsident |
| K31 Computer-Vereine | 4 | Konkurrent rüstet auf, Notverkauf |

Zusammen etwa 100 Karten, viele davon Infos.

### 8.2 Ideen aus PLAN §4, noch ohne Konzept

| Karte | Bereich | gehört zu |
|---|---|---|
| Zwei Vereine streiten um einen Spieler, lachender Dritter | Markt | K17, K22 (Kette, siehe 8.3) |
| Ein Spieler heiratet, Teamausflug gefällig? | Kabine | K14 |
| Der Rasen ist nach Frost kaputt, Heimspiel in Gefahr | Stadion | K26 |
| Ein Lokalreporter hat eine Fehde mit dir | Presse | K29 |
| Ein Altstar will ein Comeback | Markt | K19 |
| Ein anderer Verein will dich als Trainer | Karriere | K28 (aufgenommen) |
| Der Sponsor gerät in einen Skandal | Sponsoren | K24 |
| Fan-Choreo zum Jubiläum | Fans | K27 |

### 8.3 Beispiel einer Kette: „Der lachende Dritte“

1. **Auslöser:** Zwei Computer-Vereine verhandeln um denselben Spieler (K19), dein Bedarf passt, du kennst seinen Berater oder hast mit Glück einen entfernten Verwandten (Zufall 5 %).
2. **Karte 1 (Entscheidung):** „Dein Cousin kennt den Berater von {spieler}.“ Optionen: Treffen (Kosten, Risiko wie Abwerben in K20), offiziell bieten, ignorieren.
3. **Karte 2 (nach 3–7 Tagen, wenn Treffen):** Der Spieler ist interessiert. Optionen: schnell bieten (Preis normal), die beiden Vereine gegeneinander ausspielen (Preis niedriger, Risiko, dass es auffliegt).
4. **Ausgang:** Unterschreibt er bei dir, sinkt die Beziehung zwischen den beiden anderen Vereinen um 10, deine zu ihnen nur um 2, bei geschicktem Vorgehen gar nicht (K17 §5.4).

## 9. Wechselwirkungen

Alle Konzepte mit Abschnitt 8 liefern Karten. K30 regelt nur Aufbau, Auswahl und Dosierung. Die Presse (K29) macht Karten von Computer-Vereinen sichtbar.

## 10. Zielwerte und Tests

| Prüfung | Ziel |
|---|---|
| Budget | in simulierten Saisons nie mehr als 4 Halte pro Woche, im Schnitt 2–3 |
| Entscheidungskarten | 15–30 pro Saison bei Meldungsdichte „normal“ |
| Vielfalt | keine Karte mehr als dreimal pro Saison, keine Textvariante zweimal hintereinander |
| Prüfskript | jede Karte nutzt nur erlaubte Wirkungen (3.2), alle Platzhalter werden gefüllt, jede Folgekarte existiert |

## 11. Stellschrauben

```js
karten:{
  halteProWoche:[2,4],entscheidung:{kleinProWoche:1,grossProMonat:1,jeBereichProWoche:1},infoProWoche:5,
  dichte:{wenig:0.5,normal:1,viel:2},gueltigTage:14,sperrTage:120,
  prioritaet:['frist','kette','wichtig','sonst']
}
```

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Computer-Vereine ohne Karten,** ihre Geschichten kommen über die Presse.
2. **Entscheidungskarten über dem Budget** kommen als Info, der Mitarbeiter entscheidet (Automatik).
3. **Katalog wächst mit den Konzepten,** K30 hält nur die Übersicht.

## Quellen

- Aufbau, Dosierung, erste Ideen: PLAN §2 und §4
- Kritik „zu viele Karten“, Pressefragen ohne Folgen: `konzepte/_recherche-genre.md`, Abschnitte 3.2 und 4
- Budget für Unterbrechungen: `konzepte/_konsistenzpruefung.md`, B1
