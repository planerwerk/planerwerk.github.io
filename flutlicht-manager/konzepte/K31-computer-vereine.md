# K31 – Computer-Vereine

Status: **Entwurf** (7. November 2026), geschrieben ohne Rücksprache. Vorläufige Entscheidungen stehen in Abschnitt 12.
**U11a gebaut am 19. November 2026, noch ohne Testlauf** (Kaderplan, Bedarf, Verkaufs- und Kaufregeln, Transferbudget je Fenster): siehe §5.6. **U11b und U11c am selben Tag, ebenfalls ohne Testlauf** (Vereinsprofile, Sternejagd; Verträge nach Rang): siehe §5.7 und §5.8. Auf dem Rechner, auf dem U11a entstand, gibt es kein Node.js. Alle Zahlen in §5.6 und §11 sind deshalb ungeprüft, `tests/welt.js` ist geschrieben, aber nie gelaufen.
Hängt ab von: K19 (Transfers), K21 (Verträge), K18 (Scouting), K28 (Vorstand), K02 (Klugheit) · Wird gebraucht von: K06, K07, K20, K23, K32.

## 1. Ziel und Spielgefühl

- **Die Konkurrenz plant wie ein echter Verein:** Kaderplan mit Planstellen, Bedarf, Budget, Profil. Keine Zufallskäufe (Rohmaterial 1.2).
- **Langzeit-Spannung ist das Hauptziel:** Die Community klagt, dass man nach ein paar Saisons mit einem mittelmäßigen Team jede Liga gewinnt, weil die KI schlecht plant, kaum Stars jagt und sich nicht anpasst (Recherche 4b). Bei uns bleiben die Großen groß, und sie reagieren auf dich.
- **Deine Verkaufsregeln:** verkaufen nur mit Grund und wenn die Position besetzt bleibt. Erst kaufen, dann verkaufen (Rohmaterial 13.3).
- **Gleiche Regeln wie für dich** (Rohmaterial, Grundsatz 4). Keine versteckten Hilfen (K02 §5.3).

## 2. Vorbilder und Abgrenzung

- **Rohmaterial Kapitel 13:** Kaderplan, Bedarfsanalyse, Verkaufs- und Kaufregeln, Minimalfinanzen, Trainerwechsel. Übernommen und an K03 (14 Positionen), K19 (Vereinswert) und K28 (Vorstand) angepasst.
- **Community-Kritik:** KI kauft drei, vier Spieler für dieselbe Position, während Grundrollen fehlen, nutzt ihr Budget nicht, Topvereine kaufen jahrelang nur Durchschnitt, kleine Vereine verkaufen Stars zu billig (Recherche 4, 4b). Jeder Punkt hat hier eine Regel und einen Test.

## 3. Begriffe und Daten

### 3.1 Kaderplan

| Planstellen-Gruppe | Positionen | Planstellen (Standard) |
|---|---|---|
| Torwart | TW | 3 |
| Innenverteidigung | IV | 4 |
| Außenverteidigung | LV, RV | 4 (je 2) |
| zentrales Mittelfeld | DM, ZM, SM | 5 |
| offensives Mittelfeld und Flügel | OM, LM, RM | 4 |
| Sturm und Flügelsturm | MS, HS, LA, RA | 4 |
| Talente | beliebig, bis 21 | 2–4 |

- Jede Planstelle hat einen **Rang**: Stammspieler, Herausforderer, Ergänzung, Talent.
- **Qualitätsziel:** Stammspieler höchstens 3 unter dem Vereinsniveau, Herausforderer höchstens 6, Ergänzung höchstens 10 (Rohmaterial 13.1).
- Die Grundordnung des Vereins (K06) verschiebt die Planstellen leicht, zum Beispiel ein Dreierketten-Verein mit 5 Innenverteidigern und weniger Außenverteidigern.

### 3.2 Vereinsprofil

| Profil | Gewichtung |
|---|---|
| ehrgeizig | Qualitätsziel 1 strenger, nutzt das Budget voll, jagt Stars |
| sparsam | kauft unter Marktwert, verkauft bei gutem Angebot eher |
| Ausbildungsverein | bringt Talente früh, verleiht viel, verkauft Talente teuer |
| Altherren-Truppe | holt erfahrene Spieler, wenig Talente |
| Spekulant | kauft junge, unterbewertete Spieler, verkauft mit Gewinn |
| Malocher | hartes Training, viel Einsatz, kampfstarke Spieler (K07) |

- Dazu ein **Lieblingsstil** (K06) und die **Klugheitsstufe** aus K02 (gilt für alle Computer-Vereine gemeinsam).
- Profile als Stammdaten in `daten/vereine.js` (neu, je Verein ein bis zwei Profile).

### 3.3 Finanzen (Minimalmodell)

- Einnahmen je Saison aus Zuschauern, TV, Sponsor und Transfers, Ausgaben aus Gehältern, Betrieb und Ablösen. Heute: `fremdeEinnahmen` nach Ansehen.
- Daraus legt ihr Vorstand ein **Transferbudget** und einen **Gehaltsrahmen** fest (wie K28 für dich, vereinfacht).
- Über dem Gehaltsrahmen: erst verkaufen, dann kaufen.

## 4. Abläufe

1. **Vor jedem Fenster** (Mitte Juni und Mitte Dezember): Bedarfsanalyse (5.1), Wunschliste mit Priorität und Budget.
2. **Im Fenster:** Anfragen und Angebote nach K19, mit eigener Schätzung (K18). Täglich ein kleiner Teil der Vereine aktiv, damit es nicht alles auf einmal passiert.
3. **Verkauf** nur nach den Regeln (5.2). Angebote an dich und an andere Vereine.
4. **Verträge** nach K21: Stammspieler im letzten Jahr früh verlängern, ältere Reservisten auslaufen lassen.
5. **Laufend:** Aufstellung, Taktik, Training, Rotation, Stimmung nach K04–K07 und K14, mit Klugheitsstufe.
6. **Trainerwechsel** nach K28 (vereinfacht), mit Trainerpool.
7. **Saisonende:** Planstellen neu ordnen (Alter, Karriereende, Talente rücken auf), Profil kann sich langsam ändern (Aufstieg macht ehrgeizig).

## 5. Regeln und Formeln

### 5.1 Bedarf

| Grund | Priorität |
|---|---|
| offene Planstelle (Vertragsende, Verkauf, Karriereende) | hoch |
| Stammspieler mehr als 3 unter dem Qualitätsziel | hoch |
| Stammspieler mehr als 8 Wochen verletzt | mittel (im Winter oft Leihe) |
| Wechselwunsch Stufe 3, der wahrscheinlich erfüllt wird | mittel |
| Planstelle Talent unbesetzt | niedrig, Ausbildungsverein mittel |

- **Eine Lücke, ein Kauf:** Für jede Bedarfsposition wird höchstens ein Spieler geholt, bevor der Bedarf neu berechnet wird. Gegen „drei Spieler für dieselbe Position“.
- **Budget nutzen:** Bleibt am Ende eines Fensters mehr als 40 % des Budgets ungenutzt und gibt es Bedarf, senkt der Verein seine Ansprüche schrittweise (Qualitätsziel +1 je Woche).

### 5.2 Verkaufsregeln (deine Vorgaben)

Ein Computer-Verein verkauft nur, wenn **A und B** gelten.

**A – es gibt einen Grund:**
- Wechselwunsch ab Stufe 3 (K14), **oder**
- lange schwach: Note über 10 oder mehr Einsätze schlechter als die Schwelle, oder Stärke deutlich unter der Planstelle, **oder**
- Kaderüberhang auf der Position, **oder**
- außergewöhnliches Angebot über 150 % des Marktwerts. Dann wird verkauft, und sofort startet die Ersatzsuche.

**B – die Position bleibt besetzt:** Nach dem Verkauf sind die Planstellen der Gruppe noch voll. Sonst **erst kaufen, dann verkaufen.** Bei drei Torhütern gibt es keinen ab, bevor ein neuer unterschrieben hat.

- **Kleine Vereine und ihre Stars:** Schmerzgrenze mit Stellenwert ×1,5 (K19 §5.1). Gegen „kleine Vereine verkaufen Stars zu billig“.

### 5.3 Kaufregeln

- Nur bei Bedarf, mit Budget und Interesse des Spielers (K19 §5.3).
- **Ehrgeizige Vereine jagen Stars:** Sie setzen jede Saison ein Ziel auf einen Spieler über ihrem Niveau, wenn Budget da ist. Gegen „Topvereine kaufen nur Durchschnitt“.
- **Bietlaune und Geduld** mit Zufall je Verhandlung (aus dem Tag-Strom „markt“, K02).
- **Auch Computer-Vereine werben ab** und können erwischt werden (K20, Welle 4).

### 5.4 Klugheit

| Stufe (K02) | Entscheidungen |
|---|---|
| gemütlich | Bedarf wird verspätet erkannt, Rauschen in Bewertungen ×1,5, kontert deinen Stil selten (K06: 10 %) |
| normal | wie beschrieben, kontert 25 % |
| clever | Bedarf früh, Rauschen ×0,7, nutzt Ausstiegsklauseln, kontert 50 %, vermeidet Belastungssprünge (K07) |

Klugheit ändert nur Entscheidungen, nie Stärken oder Würfel.

### 5.5 Trainerwechsel

- Vertrauen aus Sport und Finanzen (K28 §5.1, vereinfacht), Ultimatum, Entlassung nach Geduld des Präsidenten.
- Neuer Trainer aus dem **Trainerpool** (vereinslose Trainer, Co-Trainer anderer Vereine, ehemalige Spieler, K16). Er bringt seinen Lieblingsstil (Vertrautheit sinkt, K06), einen kurzen Stimmungsschub (+5 für alle, K14) und einen Kaderumbau im nächsten Fenster (Bedarf neu nach seinem Stil).

### 5.6 Umsetzung U11a (19. November 2026, ohne Testlauf)

Code in `js/computer.js`, Zahlen in `REGELN.computer`. Die Regeln gelten für jeden Verein, dessen Transfers nicht du führst: alle Computer-Vereine und dein Verein in der Automatik (K36, Bereich `transfers`).

**Kaderplan**

- Sechs Gruppen aus den 14 Positionen: TW · IV · AV (LV, RV, Schiene) · ZM (DM, ZM, SM) · OM (OM, LM, RM) · ST (MS, HS, LA, RA).
- Planstellen je Gruppe = Mittel aus dem Standard (§3.1) und dem Doppelten der Plätze in der Grundordnung, gerundet. Torwart fest 3. Das ergibt bei jeder Grundordnung 24 Planstellen. Beispiel 4-3-3: ZM 6, OM 2, ST 5.
- Rang nach Stärke in der Gruppe: so viele Stammspieler wie Plätze in der Grundordnung, ebenso viele Herausforderer, der Rest der Planstellen Ergänzung. Wer darüber liegt, ist Überhang.
- Überzählige bis 21 Jahre sind Talente (die bis zu 4 mit dem größten Talent), kein Überhang.
- Anspruch (das „Vereinsniveau“ im Plan) = die eigene Kaderstärke, mindestens aber die Grundstärke nach dem Ansehen (48 + 0,4 × Ansehen). So baut ein Verein wieder auf, dessen Kader unter seinen Rang gefallen ist.

**Bedarf** (in dieser Reihenfolge, je Woche höchstens ein Kauf)

| Grund | Priorität | gesucht wird |
|---|---|---|
| offene Planstelle | hoch | Stärke mindestens Anspruch minus Qualitätsziel des freien Rangs |
| Stammspieler mehr als 3 unter dem Qualitätsziel (also mehr als 6 unter dem Anspruch) | hoch | Anspruch − 3 |
| Stammspieler länger als 8 Wochen verletzt, kein brauchbarer Herausforderer, kein Überhang | mittel | Anspruch − 6 |
| Stammspieler mit Wechselwunsch ab Stufe 3, kein Überhang | mittel | Anspruch − 3 |
| weniger als 2 Talente | niedrig | bis 21 Jahre, Talent mindestens Anspruch − 3 |

**Verkauf** (§5.2, A und B)

- B zuerst: Abgegeben wird nur aus einer Gruppe, die mehr Spieler hat als Planstellen. Geprüft wird noch einmal im Moment des Verkaufs.
- A: Wechselwunsch ab Stufe 3, oder Überhang, oder (nicht bei Stammspielern) mehr als 6 unter dem Qualitätsziel seines Rangs.
- Wer A und B erfüllt, steht auf der Transferliste. Preis: Marktwert × Stellenwert (höchstens 1) × Restlaufzeit × Finanzlage (K19 §5.1).
- Ein Verein mit 20 oder weniger Spielern gibt niemanden ab. Geliehene Spieler, vereinbarte Wechsel und Profis in der Zweiten bleiben außen vor.
- Grund „Note“ (§12 Nr. 4) und das außergewöhnliche Angebot über 150 % fehlen noch (siehe §12 Nr. 9 und 10).

**Kauf**

- Nur im Fenster. Jede Woche ist die Hälfte der Vereine aktiv, in zufälliger Reihenfolge.
- Kandidaten: Vereinslose und Spieler der Transferliste, die in die Gruppe passen und die gesuchte Stärke haben. Höchstens 32 Jahre alt.
- Der Spieler geht nicht zu einem Verein, dessen Ansehen mehr als 30 unter dem seines Vereins liegt, außer er will weg.
- Der Käufer zahlt höchstens seinen Vereinswert: Marktwert × 1,2 für einen Stammplatz, sonst × 1 (K19 §5.1, hier nach der Planstelle statt nach dem schwächsten Stammspieler).
- Gewählt wird der Beste: Stärke, bei Jungen ein Teil des Talents, ab 30 ein Abzug, dazu ein Schätzfehler von ±2.
- Höchstens 4 Zugänge im Sommer und 2 im Winter über den Markt. Kader höchstens 30.

**Budget**

- Am Anfang jedes Fensters: 50 % des Kontos im Sommer, 25 % im Winter. Verkäufe im Fenster erhöhen es um 80 % der Ablöse.
- Budget nutzen (§5.1): In den letzten drei Wochen des Fensters senkt ein Verein mit mehr als 40 % Rest die gesuchte Stärke um 1 je Woche.

**Sicherheitsnetz**

- Am 1. Juli füllt jeder Verein wie bisher auf die Mindestzahl je Mannschaftsteil auf (`saison.kaderSoll`).
- In der letzten Woche des Sommerfensters füllt er Planstellen, die der Markt nicht besetzt hat: zuerst Vereinslose, sonst erzeugte Spieler der passenden Gruppe.

### 5.7 Umsetzung U11b (19. November 2026, ohne Testlauf): Vereinsprofile und Sternejagd

**Profile** (§3.2). Jeder Verein hat bis zu zwei:

- **„ehrgeizig“ folgt aus der Lage** und wird nicht gespeichert: die ersten vier nach Ansehen in der 1. Liga, die ersten drei in der 2. und 3. Liga, dazu jeder Aufsteiger in seiner ersten Saison („Aufstieg macht ehrgeizig“, §4 Nr. 7).
- **Das zweite Profil steht am Verein** (`profil`). Beim Aufbau der Welt wird es gelost (eigener Zufallsstrom): kein Profil 4, sparsam 2, Ausbildungsverein 2, Malocher 2, Altherren-Truppe 1, Spekulant 1. Ein Eintrag `profil` in `daten/vereine.js` geht vor. Dort steht noch keiner (§12 Nr. 18).

| Profil | Wirkung in U11b |
|---|---|
| ehrgeizig | Qualitätsziel 1 strenger, Budget 70 % statt 50 % des Kontos (Winter 35 %), Sternejagd |
| sparsam | zahlt höchstens 90 % seines Vereinswerts, Budget 35 % (Winter 17,5 %) |
| Ausbildungsverein | 3 bis 5 Talent-Planstellen, Talent zählt bei der Auswahl doppelt, kauft niemanden über 28 |
| Altherren-Truppe | 1 bis 3 Talent-Planstellen, Talent zählt nicht, kein Abzug fürs Alter, kauft bis 34 |
| Spekulant | Talent zählt bei der Auswahl fast dreifach |
| Malocher | noch ohne Wirkung (Training und Einsatz, K07) |

**Sternejagd** (§5.3): Ein ehrgeiziger Verein holt im Sommer höchstens einen Spieler, der nicht auf der Liste steht.

- Der Spieler ist mindestens 2 stärker als der Anspruch des Käufers, höchstens 29 Jahre alt und bekäme einen Stammplatz.
- Sein Verein hat mindestens 5 weniger Ansehen (der Spieler geht nach oben) und mehr als 20 Spieler.
- Preis: das außergewöhnliche Angebot aus §5.2, also 150 % des Marktwerts × Restlaufzeit, mindestens aber die Forderung, die auch du hören würdest (K19 §5.1). Er muss ins Budget passen.
- Der Verkäufer nimmt an, auch wenn seine Gruppe danach eine Planstelle zu wenig hat. Seine Ersatzsuche beginnt in der nächsten Woche (offene Planstelle).
- Der Kauf zählt als der eine Zugang der Woche und zur Obergrenze des Fensters.

### 5.8 Umsetzung U11c (19. November 2026, ohne Testlauf): Verträge nach Rang

§4 Nr. 4: „Stammspieler im letzten Jahr früh verlängern, ältere Reservisten auslaufen lassen.“ Gilt für jeden Verein, dessen Verträge nicht du führst (Bereich `vertraege`, K36), also auch für deinen Verein in der Automatik.

**Früh verlängern:** Von Oktober bis Dezember verlängert ein Verein jede Woche mit 15 % den auslaufenden Vertrag jedes Spielers, den er braucht (Stammspieler, Herausforderer, Talent). Nach den 13 Wochen sind so etwa 88 % gebunden. Grund: Ab dem 1. Januar dürfen andere Vereine und du ihnen einen Vorvertrag geben (K21 §4.3). Laufzeit 1 bis 3 Jahre ab dem Sommer, Gehalt nach Stärke (wie bisher beim Saisonwechsel).

**Saisonwechsel:** Wer dann noch ausläuft, bleibt mit einer Chance nach seinem Rang im Kaderplan (berechnet vor dem Altern):

| Rang | Chance (vorher für alle 70 %) |
|---|---|
| Stammspieler, Herausforderer, Talent | 90 % |
| Ergänzung unter 30 Jahren | 50 % |
| Ergänzung ab 30, Überzählige | 10 % |

Die Chance schließt die Zusage des Spielers ein. Ein Verein ohne Plan (gerade in die Regionalliga abgestiegen) nutzt die alte Regel.

**Nicht gebaut:** Vorverträge und Ausstiegsklauseln unter Computer-Vereinen (Konsistenzprüfung BD4, BD7), Verhandlung über Gehalt und Prämien, Interesse des Spielers.

### 5.9 Umsetzung U11d1 (19. November 2026, ohne Testlauf): Leihen unter Computer-Vereinen

§3.2 („Ausbildungsverein verleiht viel“), §5.1 („Stammspieler mehr als 8 Wochen verletzt: im Winter oft Leihe“), K08 (Talente, Leihen).

**Wirklichkeit (recherchiert, Quellen unten):** Die FIFA begrenzt Leihen seit dem 1. Juli 2022. Ein Verein darf während einer Spielzeit zu jedem Zeitpunkt höchstens acht Berufsspieler verliehen und acht ausgeliehen haben, 2023/24 sieben, **seit dem 1. Juli 2024 sechs**. Zwischen denselben zwei Vereinen sind es höchstens drei je Richtung. Ausgenommen sind Spieler bis 21 Jahre und vom Verein ausgebildete Spieler. Eine Leihe läuft mindestens von einer Registrierungsperiode zur nächsten und höchstens ein Jahr, Weiterverleihen ist verboten. Die DFL hat für Leihen im Inland ebenfalls ein Kontingent von sechs, mit Ausnahmen für junge deutsche Spieler (wenn der verleihende Verein eine U23 hat) und für U21-Spieler mit dem Status „Local Player“.

**Leihkontingent (gilt für alle, auch für dich):**

- Je Verein höchstens 6 verliehene und 6 ausgeliehene Spieler, von einem Verein an denselben anderen höchstens 3.
- Spieler bis 21 Jahre zählen nicht. Gezählt werden die laufenden Leihen.
- Weiterverleihen ging schon vorher nicht (U10d). Jede Leihe läuft bis zum Saisonende.

**Verleihen (ein Computer-Verein gibt ab).** Leihbar ist ein Spieler, der:

- höchstens 23 Jahre alt ist,
- im Kaderplan Überhang ist (beim Ausbildungsverein auch Talente),
- gesund ist, keinen vereinbarten Wechsel hat, nicht schon geliehen ist und nicht in der Zweiten spielt.

Der Verein behält danach mehr als 20 Spieler. Regel B (§5.2) gilt damit von selbst, denn Überhang und Talente liegen über den Planstellen.

**Ausleihen (ein Computer-Verein nimmt).** Eine Leihe besetzt eine Lücke aus dem Bedarf (§5.1) wie ein Kauf:

| Bedarf | Leihe |
|---|---|
| verletzt (Stammspieler länger als 8 Wochen weg) | **zuerst Leihe**, dann Kauf. Eine Lücke auf Zeit bekommt eine Lösung auf Zeit. |
| offene Planstelle | zuerst Kauf. Leihe nur, wenn kein Kauf geht (Budget, kein passender Spieler). |
| schwach, Wechselwunsch, Talent | keine Leihe, da braucht der Verein einen Spieler für länger |

- Gesucht wird wie beim Kauf: passende Gruppe, gesuchte Stärke, Schätzfehler ±2.
- Der Spieler bekäme beim Leihverein mindestens einen Platz als Herausforderer, sonst will er nicht. Er soll spielen.
- Die Ansehensgrenze des Kaufs (30) gilt nicht. Leihen nach unten sind der Normalfall.
- Keine Leihgebühr, keine Kaufoption, kein Rückruf. Computer-Vereine führen keine Gehaltsbuchhaltung (§3.3), also fließt kein Geld. Der Gehaltsanteil am Spieler folgt `zahlBereit` (U10d) und dient nur zur Anzeige.
- Die Leihe zählt als der eine Zugang der Woche und zur Obergrenze des Fensters (4 im Sommer, 2 im Winter).
- Rückkehr am Saisonende wie bei deinen Leihen (`leiheEnde`, U10d).

**Dein Verein:**

- Der Bereich `leihe` hat keine Automatik (K36). Dein Verein verleiht und leiht deshalb nie von selbst, auch nicht, wenn der Verein deine Transfers führt.
- Computer-Vereine leihen nicht bei dir aus.
- Neu für dich ist das Kontingent beim Verleihen und Ausleihen. Die Spielerkarte zeigt jetzt richtig an, wenn ein Spieler zwischen zwei anderen Vereinen verliehen ist (vorher stand dort „Du zahlst sein Gehalt“).

**Meldungen:** Leihen unter Computer-Vereinen kommen nicht in den Posteingang, es wären viele. Man sieht sie auf der Spielerkarte.

### 5.10 Umsetzung U11d2 (19. November 2026, ohne Testlauf): Vorstand und Trainerwechsel bei Computer-Vereinen

§4 Nr. 6, §5.5 und K28 §7: „Gleiche Regeln für Computer-Trainer, vereinfacht: Vertrauen aus Sport und Finanzen, Ultimatum, Entlassung nach Geduld des Präsidenten.“ Gilt für jeden Computer-Verein der 1. bis 3. Liga, nie für deinen Verein. Dein Vorstand bleibt, wie er ist, bis U12.

**Wirklichkeit (recherchiert, Quellen unten):** In der 1. Liga gab es seit 2000 je Saison etwa 4 bis 10 Trainerentlassungen während der Saison. Spitzen waren 10 (2005/06) und 9 (2002/03, 2022/23), die wenigsten 4. In der 2. Liga waren es 2024/25 mit 15 so viele wie nie, bei drei Vereinen sogar zwei. Die Reihe von Statista seit 1963/64 steht hinter einer Anmeldung.

**Präsident:** Jeder Verein hat einen Präsidenten mit Geduld, Ehrgeiz und Sparsamkeit (je 1 bis 20, K28 §3). Die Werte folgen fest aus der Vereinsnummer, ohne Zufallsstrom. So brauchen alte Spielstände nichts nachzutragen, und die Welt bleibt gleich. Er hat keinen Namen, das Spiel sagt „der Präsident“. Wahlen gibt es noch nicht. In U11d2 wirkt nur die Geduld.

**Vertrauen** (0 bis 100, Start 55, am Verein `vor.v`). Jeden Montag in der Spielzeit bewegt es sich um 20 % auf ein Ziel zu:

```
Ziel = 50 + Sport + Serie + Finanzen   (0 bis 100)
Sport    = 5 × (erwarteter Platz − Tabellenplatz), begrenzt auf −35 bis +25   (K28 §5.1)
Serie    = 10 × (Punkte je Spiel in den letzten 5 Ligaspielen − 1,3), begrenzt auf −15 bis +10
Finanzen = −15, wenn das Konto im Minus ist
```

Es zählt erst ab dem 5. Ligaspiel, wie bei dir (`platzAbSpieltag`). Der erwartete Platz ist der Rang nach Ansehen (`expPos`).

**Ultimatum:** Fällt das Vertrauen unter 20 und hat der Trainer mehr als 6 Ligaspiele hinter sich, bekommt er ein Ultimatum über 2 Ligaspiele. Danach:

- Vertrauen wieder mindestens 20: Das Ultimatum ist vorbei.
- Sonst nach dem ersten Ultimatum Entlassung mit der Chance 0,9 − 0,03 × Geduld (0,3 bis 0,87, K28 §5.3), sonst ein zweites, letztes Ultimatum.
- Nach dem zweiten Ultimatum: Entlassung.

**Saisonende:** Hat ein Verein seinen erwarteten Platz um mehr als 3 verfehlt und liegt das Vertrauen unter 30, wechselt er den Trainer im Sommer. Für alle Vereine geht das Vertrauen dann halb zurück zum Start (55), und die Schonfrist beginnt neu.

**Der neue Trainer** (§5.5):

- bringt seinen Lieblingsstil mit (gelost wie beim Aufbau der Welt, `profilStil`). Die Vertrautheit mit dem neuen Stil ist anfangs niedrig (K06). `vertrautheitWoche` speichert sie jede Woche für alle Stile außer dem aktuellen, also gilt der gespeicherte Wert (mindestens 30) und nicht der Startwert 70.
- bringt keine eigene Grundordnung mit. Die wählt der Computer-Trainer schon heute jeden Monat nach dem Kader (`kiOrdnung`), eine mitgebrachte wäre nach spätestens vier Wochen wieder weg.
- gibt allen Spielern einen Stimmungsschub von +5 (K14).
- bekommt Vertrauen 55 und eine neue Schonfrist von 6 Ligaspielen.

Einen Trainerpool mit Namen gibt es noch nicht (K16, K32). Der Trainer hat noch keinen Namen.

**Meldung:** nur, wenn der Verein in deiner Liga spielt („Großer Umbruch“, §8). Alle Wechsel stehen in `S.trainerWechsel` (die letzten 200), für Statistik (K34) und Tests.

## 6. Hebel des Spielers

K31 beschreibt die Gegner. Deine Hebel gegenüber ihnen:
- **Ihre Regeln nutzen:** Ein Verein mit Kaderüberhang verkauft eher, einer mit Wechselwunsch billiger.
- **Ihr Bedarf ist dein Markt:** Wer eine Lücke hat, zahlt für deinen Spieler eher den vollen Wert.
- **Ihre Reaktion einplanen:** Wer immer denselben Stil spielt, wird gekontert (K06).

## 7. Verhalten der Computer-Vereine

Das ganze Konzept.

## 8. Ereignisse

| Meldung | Auslöser | Folge |
|---|---|---|
| Großer Umbruch | neuer Trainer bei einem Konkurrenten | Info, Gerüchte (K29) |
| Rekordtransfer | Ablöse über dem Ligarekord | Presse, Statistik (K34) |
| Konkurrent rüstet auf | ehrgeiziger Rivale kauft einen Star | Presse, deine Fans erwarten eine Antwort (K27) |
| Notverkauf | Verein über dem Gehaltsrahmen | Spieler unter Wert auf dem Markt |

**Stand 22.11.2026:**
- „Großer Umbruch“ seit U11d2.
- „Rekordtransfer“ seit U13, seit K34d mit echtem Startwert.
- **„Konkurrent rüstet auf“ seit K31c (ohne Testlauf):** Gelingt einem Verein deiner Liga die Sternejagd (§5.7), steht es als Meldung da. Nur eine Meldung, ohne Presse und Fans. Eine Wirkung auf deinen Verein gäbe es nur in deiner Welt, nicht beim selben Verein als Computer-Verein, und das bricht den Gleichschritt in `tests/lizenz.js`. Presse und Fans kommen, wenn es dafür eine Karte gibt (K30).
- **„Notverkauf“ seit K31d (24.11.2026, popolupo, ohne Testlauf, Schalter aus):** Liegen die Gehälter eines Computer-Vereins (Kader und Stab) über 110 % seines Gehaltsrahmens (K23d), setzt er jede Woche den Spieler mit dem höchsten Gehalt, der kein Schlüsselspieler ist, für 75 % seines üblichen Preises auf die Transferliste, mit einer Meldung je Verein und Saison (`kiNotverkauf` nach `kiListe`, ohne Zufall). Er ändert die Verkäufe aller Vereine, darum ist er vorerst abgeschaltet (`REGELN.computer.notverkauf.an = false`) und wird erst nach einer Messung eingeschaltet. Seit Prüfung FK1: Den Spieler kauften die Computer-Vereine nie, weil `kiKandidat` nur Spieler mit Abgabegrund nahm. Jetzt trägt er den Merker `p.nv` (Saison, `kiListe` löscht ihn jede Woche, der Notverkauf setzt ihn neu), und `kiKandidat` kauft ihn auch ohne Abgabegrund zum Notpreis `p.ask`. Wie `kiListe` gilt der Notverkauf auch für deinen Verein, wenn dein Stab die Transfers führt, so wirkt er in beiden Welten des Gleichschritts gleich.

## 9. Wechselwirkungen

| Konzept | Zusammenspiel |
|---|---|
| K02 | Klugheitsstufe, keine Hilfen |
| K03, K14 | Planstellen nach Positionen, Wechselwünsche |
| K04–K07 | Aufstellung, Taktik, Live-Entscheidungen, Training |
| K08 | Talente, Leihen |
| K17 | Handelspartner nach Beziehung |
| K18 | eigene Schätzung mit Fehlern |
| K19–K21 | Transfers, Abwerben, Verträge |
| K23 | Finanzen (Minimalmodell, später voll) |
| K28 | Vorstand und Trainerwechsel |
| K32 | Karriereenden, neue Spieler, Auslandspool, Trainerpool |

## 10. Zielwerte und Tests

Testskript: `tests/welt.js` (neu), viele Saisons ohne menschlichen Spieler.

| Prüfung | Ziel |
|---|---|
| Langzeit-Spannung | nach 10 Saisons sind die fünf Vereine mit dem höchsten Ansehen im Schnitt noch unter den besten acht der 1. Liga |
| ausgewogene Kader | nach 10 Saisons hat kein Verein eine Planstellen-Gruppe dauerhaft unbesetzt, höchstens 5 % der Vereine mit mehr als 2 Spielern Überhang je Gruppe |
| Budget genutzt | im Schnitt 60–100 % des Transferbudgets je Saison ausgegeben |
| Zugänge | je Verein im Sommer 3–8, im Winter 0–3 (Rohmaterial 13.4, prüfen) |
| Stars wandern nach oben | Spieler ab 85 Stärke spielen nach 10 Saisons zu mindestens 70 % bei Vereinen mit Ansehen über 75 |
| kein Kaderchaos | höchstens 1 % der Käufe auf eine Position ohne Bedarf |
| Verkaufsregeln | kein Verkauf ohne Grund A, keine Gruppe nach einem Verkauf unterbesetzt ohne Ersatzkauf im selben Fenster |
| Trainerwechsel | 4–10 pro Saison in der 1. Liga (recherchiert 19.11., §5.10; vorher 3–7) |
| Klugheit | „clever“ holt im Schnitt mehr Punkte je Euro als „gemütlich“, bei gleichen Kadern und Würfeln |

**Stand U11a:** `tests/welt.js` ist geschrieben und **noch nie gelaufen**. Es prüft den Kaderplan an einem gebauten Kader, die Transferliste, das Budget, „gleicher Seed, gleiche Wechsel“, die Automatik und dann Saisons im Ablauf: Jeder Wechsel wird im Moment des Wechsels geprüft (nur im Fenster, Bedarf beim Käufer, Grund A und Regel B beim Verkäufer, Budget, Obergrenze). Langzeit-Spannung, ausgewogene Kader und „Stars wandern nach oben“ zählen erst ab zehn Saisons (`node tests/welt.js 10`), darunter gibt das Skript die Werte nur aus. Budgetnutzung und Zugänge je Verein werden ausgegeben, aber nicht gewertet, bis die Zahlen kalibriert sind. Trainerwechsel und Klugheit sind nicht gebaut.

**Stand U11d1:** `tests/welt.js` Nr. 6d prüft Leihen an einem gebauten Fall: ein Verein mit lange verletztem Stammspieler im Winterfenster leiht einen Überzähligen, und das Kontingent stoppt die siebte Leihe. Im Ablauf (Nr. 7) wird jede Leihe im Moment der Leihe geprüft: nur im Fenster, Bedarf beim Leihverein, leihbar beim Verleiher, Kontingent. Am Saisonende sind alle zurück. Auch das ist nie gelaufen.

## 11. Stellschrauben

```js
computer:{
  planstellen:{TW:3,IV:4,AV:4,ZM:5,OM:4,ST:4,talente:[2,4]},
  qualitaet:{stamm:3,herausforderer:6,ergaenzung:10,ehrgeizig:-1},
  profile:{ehrgeizig:{budget:1,stars:true},sparsam:{kauf:0.9,verkauf:1.2},ausbildung:{talente:4,leihe:true},altherren:{alter:28},spekulant:{jungUnter:23,gewinn:1.3},malocher:{training:'hoch',einsatz:'hart'}},
  bedarf:{verletztWochen:8,einKaufJeLuecke:true,budgetRestAb:0.4,anspruchJeWoche:1},
  verkauf:{noteSchwelle:4.5,noteSpiele:10,unterPlanstelle:6,angebotAb:1.5,kleineStars:1.5},
  sterneJagd:{jeSaison:1,ueberNiveau:5},
  klugheit:{gemuetlich:{rauschen:1.5,reaktion:0.10},normal:{rauschen:1,reaktion:0.25},clever:{rauschen:0.7,reaktion:0.50}},
  aktivJeTag:0.2,trainerSchub:5
}
```

`markt.listeVoll`, `markt.listeZufall`, `markt.wechsel`, `markt.kaeufer` und `saison.kaderSoll` aus der heutigen `regeln.js` gehen darin auf.

**Gebaut in U11a** (`REGELN.computer`, alle Zahlen ungeprüft):

```js
computer:{
  gruppen:['TW','IV','AV','ZM','OM','ST'],
  planstellen:{TW:3,IV:4,AV:4,ZM:5,OM:4,ST:4},talente:[2,4],talentBis:21,
  qualitaet:{stamm:3,herausforderer:6,ergaenzung:10},
  bedarf:{stammUnterZiel:3,verletztTage:56,budgetRestAb:0.4,endspurtWochen:3,anspruchJeWoche:1},
  verkauf:{unterPlanstelle:6,angebotAb:1.5},
  profile:{gewichte:{kein:4,sparsam:2,ausbildung:2,malocher:2,altherren:1,spekulant:1},ehrgeizigBis:{1:4,2:3,3:3},   // U11b
    werte:{ehrgeizig:{qualitaet:-1,budget:1.4},sparsam:{zahlt:0.9,budget:0.7},ausbildung:{talente:[3,5],talentGewicht:0.6,alterMax:28},
      altherren:{talente:[1,3],talentGewicht:0,altMalus:0,alterMax:34},spekulant:{talentGewicht:0.8},malocher:{}}},
  sterneJagd:{fenster:0,ueberNiveau:2,ansehenPlus:5,alterMax:29},                                                  // U11b
  vertrag:{wichtig:['stamm','herausforderer','talent'],chanceWichtig:0.9,ergaenzung:0.5,ergaenzungBis:30,sonst:0.1,   // U11c
    frueh:{von:'10-01',bis:'12-31',chance:0.15}},
  kauf:{jeFenster:[4,2],ansehenMinus:30,alterMax:32,jungBis:23,talentGewicht:0.3,altAb:29,altMalus:1},
  finanzen:{budgetAnteil:[0.5,0.25],reinvest:0.8},
  aktivJeWoche:0.5,schaetzFehler:2,
  fuellen:{fenster:0,vereinslosBis:4,vereinslosChance:0.6}
}
```

Dazu seit U11d1 (§5.9): `computer.leihe:{alterMax:23,leihRaenge:['ueber'],gruende:['verletzt','offen'],zuerst:['verletzt']}`, im Profil Ausbildungsverein `leihRaenge:['ueber','talent']`, und für alle Vereine `leihe.kontingent:{max:6,paar:3,freiBis:21}`.

Entfernt sind `markt.listeVoll`, `markt.listeZufall`, `markt.kaeufer.niveauPlus` und `transfers.fensterWechsel`. Geblieben sind `markt.kaeufer.kaderMax` (30), `markt.verkaeufer.kaderMin` (20) und `saison.kaderSoll` (Mindestkader am 1. Juli, siehe §12 Nr. 12).

## 12. Offene Fragen

**Vorläufig entschieden** (von mir, ohne Rücksprache):

1. **Planstellen nach Gruppen** der 14 Positionen statt je einzelner Position.
2. **Sechs Profile,** je Verein ein bis zwei, als Stammdaten.
3. **Klugheit gilt für alle Computer-Vereine gemeinsam** (eine Stufe je Spielstand, K02).
4. **„Note über 10 oder mehr Einsätze schlechter als die Schwelle“** aus deinen Vorgaben: Schwelle vorläufig 4,5 im Notenschnitt der letzten 10 Einsätze.

**Vorläufig entschieden mit U11a** (19.11., von mir, ohne Rücksprache und ohne Testlauf):

5. **U11 in Teilschritten:** U11a Kaderplan, Bedarf, Kauf und Verkauf, Budget (gebaut). U11b Vereinsprofile und Sternejagd (gebaut). U11c Verträge nach Rang (gebaut, enger als zuerst geplant, Nr. 23). U11d Vorverträge und Klauseln unter Computer-Vereinen, Leihen unter Computer-Vereinen (als U11d1 gebaut, Nr. 25), Klugheit, Trainerwechsel (hängt an K28).
6. **Planstellen folgen der Grundordnung nur zur Hälfte** (Mittel aus Standard und dem Doppelten der Plätze). So bleibt es bei 24 Planstellen, und ein Wechsel der Ordnung macht nicht den halben Kader überzählig.
7. **Anspruch = Kaderstärke, mindestens die Grundstärke nach dem Ansehen.** Nur die eigene Kaderstärke hätte bedeutet: Ein Verein, dessen Kader schwächer geworden ist, will nichts mehr. Das wäre gegen „die Großen bleiben groß“.
8. **„Stammspieler mehr als 3 unter dem Qualitätsziel“** (§5.1) wörtlich gelesen: mehr als 6 unter dem Anspruch. Die schärfere Lesart (mehr als 3 unter dem Anspruch) hätte bei fast jedem Kader Dauerbedarf erzeugt.
9. **Grund „Note“ fehlt** (Nr. 4): Das Spiel speichert keine Noten der letzten Einsätze. Als „lange schwach“ zählt bis dahin nur „Stärke deutlich unter der Planstelle“.
10. **Das außergewöhnliche Angebot (über 150 %)** ist für Käufe unter Computer-Vereinen noch nicht gebaut. Ein Käufer zahlt höchstens das 1,2-Fache (K19 §5.1), also bekommt er nur Spieler der Transferliste. Mehr zahlen erst ehrgeizige Vereine auf Sternejagd (U11b). Für dich gilt weiter K19: Stammspieler kosten etwa das 1,5-Fache (Stellenwert 1,3 × Forderung 1,15), das entspricht der Regel.
11. **Regel B gilt für dich noch nicht:** Du kannst weiter jeden Spieler kaufen, den sein Verein nach K19 bepreist. Der Verein sucht danach Ersatz (offene Planstelle).
12. **`saison.kaderSoll` bleibt als Mindestkader am 1. Juli**, damit jeder Verein spielfähig ist. Die Planstellen füllt erst der Markt, den Rest das Sicherheitsnetz in der letzten Woche des Sommerfensters. So kommt der Markt vor den erzeugten Spielern dran.
13. **Angebote an dich, Leihe, Ausstiegsklausel und Vorvertrag** fragen weiter `hatBedarf` aus U10a (mindestens so gut wie der schwächste Stammspieler des Mannschaftsteils), nicht den Kaderplan. Die Umstellung ändert, wie oft du Angebote bekommst. Das braucht einen Testlauf (Konsistenzprüfung BC5, BG).
14. **Budget fest am Anfang des Fensters** (50 % und 25 % des Kontos). Grund: Dein Verein in der Automatik hat echte Buchhaltung, ein Computer-Verein Einnahmen nach Formel. Mit einem festen Budget entscheiden beide im Sommerfenster gleich (`tests/lizenz.js`, Gleichschritt). Einen Gehaltsrahmen gibt es noch nicht (K23).
15. **Feine Positionen und Kaderplan passen nicht zusammen:** `spieler.positionen` würfelt die Hälfte der Mittelfeldspieler auf die Außen und ins offensive Mittelfeld, der Plan will dort zwei bis vier von neun. Folge im ersten Sommer: viele Überzählige im offensiven Mittelfeld und im Sturm, zu wenige zentrale Mittelfeldspieler. Das gleicht sich über das Auffüllen und den Kaderschnitt aus, nicht über den Markt. Besser wird es erst mit echten Daten zu den feinen Positionen (K03, PLAN §7 Nr. 5).
16. **Meldungen:** Jeder Wechsel mit Ablöse steht wie bisher im Posteingang. Es werden mehr als vorher. Bündeln oder nach Liga filtern kommt mit K29.
17. **Keine neue Funktion für dich, also kein neuer Bereich der Lernstufen (K36).** Die Automatik des Bereichs `transfers` folgt den neuen Regeln. Die Anzeige „Bedarf der anderen Vereine“ (§6) gibt es seit K31b (22.11., ohne Testlauf): Auf der Karte deines Spielers stehen die deutschen Vereine, die für ihn auf der Transferliste bieten dürften, mit denselben Bedingungen wie die Angebote im Markt (Bedarf nach `hatBedarf`, Konto über Preis × `angebote.kontoAnteil`, keine Transfersperre). Vereine mit einer Lücke (Stellenwert „besser“, sie zahlen mehr) stehen vorn, höchstens fünf mit Namen, dazu die Zahl möglicher Käufer im Ausland. Preis ist deine Forderung, sonst der Marktwert. Reine Information, frei, ohne Würfel.

**Vorläufig entschieden mit U11b** (19.11., von mir, ohne Rücksprache und ohne Testlauf):

18. **Profile nicht als Stammdaten der echten Vereine.** „ehrgeizig“ folgt aus der Lage (die Ersten nach Ansehen je Liga, Aufsteiger), das zweite Profil wird gelost. Grund: Welcher echte Verein „sparsam“ oder eine „Altherren-Truppe“ ist, wäre eine Behauptung über echte Vereine, die recherchiert und belegt sein müsste. Das Feld `profil` in `daten/vereine.js` ist dafür vorbereitet. Abweichung von Nr. 2.
19. **Sternejagd mit 2 statt 5 über dem Niveau** (§11 nennt `ueberNiveau:5`). Bei 5 fände ein Spitzenverein in Deutschland fast niemanden. Für die ganz Großen kommt der Stern ohnehin aus dem Ausland (K32, noch nicht gebaut).
20. **Wirkung der Profile nur auf Transfers.** Malocher (Training, Einsatz) ist noch wirkungslos, der Ausbildungsverein verleiht noch nicht (U11d), der Spekulant verkauft noch nicht mit Gewinn (das widerspräche Regel B, §5.2). „Sparsam verkauft bei gutem Angebot eher“ fehlt, weil das außergewöhnliche Angebot nur auf der Sternejagd vorkommt.
21. **Profile sind für dich nicht sichtbar.** Eine Anzeige wäre eine neue Information und bräuchte die Oberfläche (K35, K36: Informationen sind frei).
22. **Dein Verein in der Automatik bekommt dieselben Profile** und kann als „ehrgeiziger“ Verein bis zu 70 % des Kontos ausgeben und auf Sternejagd gehen (Konsistenzprüfung BH8). Gründe: K36 Grundsatz 1, der Gleichschritt in `tests/lizenz.js`, und der alte Markt kaufte mit bis zu 100 % des Kontos.

**Vorläufig entschieden mit U11c** (19.11., von mir, ohne Rücksprache und ohne Testlauf):

23. **U11c enger als in Nr. 5 geplant:** nur Verträge nach Rang (früh verlängern, beim Saisonwechsel nach Rang). Vorverträge und Ausstiegsklauseln unter Computer-Vereinen rutschen nach U11d, weil sie für Computer-Vereine ein Vertragspaket bräuchten, das es noch nicht gibt.
24. **Früh verlängern von Oktober bis Dezember mit 15 % je Woche** (vorläufig, nicht recherchiert). Folge für dich: Spieler anderer Vereine, die dort gebraucht werden, bekommst du seltener ablösefrei über einen Vorvertrag. Überzählige und ältere Ergänzungsspieler bleiben dafür im letzten Jahr und gehen im Sommer meist ablösefrei.

**Vorläufig entschieden mit U11d1** (19.11., von mir, ohne Rücksprache und ohne Testlauf):

25. **U11d in Teilen.** U11d1 sind die Leihen unter Computer-Vereinen (gebaut, §5.9). Die übrigen Teile warten:
    - Klugheit (§5.4) braucht eine Klugheitsstufe im Spielstand. Die gibt es noch nicht, K02 nennt sie, gebaut sind nur die Schwierigkeitsgrade.
    - Vorverträge und Ausstiegsklauseln unter Computer-Vereinen brauchen ein Vertragspaket für Computer-Vereine (Nr. 23).
    - Der Trainerwechsel wartet auf den Vorstand (K28, U12).
26. **Kontingent wie bei FIFA und DFL seit 2024/25:** 6 verliehen, 6 ausgeliehen, 3 zwischen zwei Vereinen, Spieler bis 21 zählen nicht. Drei Vereinfachungen:
    - „Vom Verein ausgebildet“ kennt das Spiel nicht, weil es keine Ausbildungsjahre zählt.
    - Die Ausnahmen der DFL für junge deutsche Spieler fehlen.
    - Gezählt wird, was gerade läuft. Ein Rückruf im Winter macht also einen Platz frei.
27. **Das Kontingent gilt auch für dich** (eine Regel für alle). Die Auswahl der Leihvereine auf der Spielerkarte zeigt nur Vereine, bei denen noch Platz ist.
28. **Leihbar ist nur Überhang bis 23 Jahre, beim Ausbildungsverein dazu die Talente.** Ein anderer Verein behält seine Talente im eigenen Kader. Ob das zu wenige Leihen ergibt, zeigt erst ein Testlauf. Zum Vergleich: Der FC Bayern hatte 2024/25 26 Spieler verliehen, das ist ein Ausreißer, meist Jugendspieler.
29. **Keine Leihgebühr und kein Geld unter Computer-Vereinen**, weil sie keine Gehaltsbuchhaltung haben (§3.3). Kommt mit K23.
30. **Keine Leihe bei „schwach“, „Wechselwunsch“ und „Talent“.** Bei „verletzt“ zuerst Leihe, bei „offen“ nur, wenn kein Kauf geht.
31. **Keine Meldung** für Leihen unter Computer-Vereinen (Nr. 16, bündeln mit K29).
32. **Dein Verein leiht nie von selbst.** Der Bereich `leihe` bekommt keine Automatik (K36), Computer-Vereine leihen nicht bei dir aus. Sonst würde der Verein über deinen Kader entscheiden, ohne dass du es eingestellt hast.

**Vorläufig entschieden mit U11d2** (19.11., von mir, ohne Rücksprache und ohne Testlauf):

33. **Trainerwechsel vor dem Vorstand für dich.** K31 §5.5 hängt an K28. Gebaut ist nur der vereinfachte Teil für Computer-Vereine aus K28 §7. Dein Vorstand (Vertrauen, Entlassung) bleibt unverändert bis U12. Grund: Der Teil für Computer-Vereine ändert nichts an deinem Spiel, außer an den Gegnern.
34. **Präsident fest aus der Vereinsnummer** statt gelost. Keine Namen, weil ein Präsident eines echten Vereins eine echte Person wäre.
35. **Grenze 20 statt 12** wie bei dir (Normal). Ohne den schnellen Anteil je Spiel, den dein Vorstand hat, käme das träge Vertrauen der Computer-Vereine kaum unter 12. Die Zahlen sind Schätzungen. Ob 4 bis 10 Wechsel je Saison in der 1. Liga herauskommen, zeigt erst `tests/welt.js`.
36. **Zielwert in §10 geändert:** 4 bis 10 Trainerwechsel je Saison in der 1. Liga (vorher 3 bis 7, ungeprüft).
37. **Kein Trainerpool, keine Namen:** Der neue Trainer ist nur ein neuer Stil und ein Stimmungsschub. Pool und Namen kommen mit K16 und K32.
38. **Keine eigene Grundordnung des neuen Trainers** (Abweichung von §5.5, „Kaderumbau nach seinem Stil“): Die Ordnung wählt `kiOrdnung` jeden Monat nach dem Kader. Ein echter Umbau nach dem Stil des neuen Trainers bräuchte Planstellen je Stil, das wäre ein eigener Schritt.
39. **Meldung nur aus deiner Liga.** Die anderen Wechsel stehen im Protokoll, bis K29 und K34 sie zeigen.

**Recherche (19.11.), nur teilweise geklärt:**

- **Zu- und Abgänge je Verein:** Die englische Wikipedia führt je Fenster Listen „In“ und „Out“ je Verein, ohne Ablösen. Gezählt wurden nur die lesbaren Teile: Winter 2025/26 bei sieben Bundesligisten 0 bis 5 Zugänge (im Schnitt 2,3) und mindestens 3 bis 8 Abgänge. Sommer 2025: Bayern 3 Zugänge und 16 Abgänge, Leverkusen 13 und 17 (Leihrückkehrer und Jugendspieler zählen bei den Abgängen mit). Das ZDF nannte im Sommer 2025 mitten im Fenster 66 Zugänge und 75 Abgänge für die 18 Vereine, also mindestens 3,7 Zugänge je Verein. Das passt zu „Sommer 3–8, Winter 0–3“ in §10, ist aber keine vollständige Zählung.
- **Trainerwechsel pro Saison:** teilweise geklärt (19.11., U11d2). 1. Liga seit 2000 etwa 4 bis 10 Entlassungen während der Saison (90min, ohne Interimstrainer), 2. Liga 2024/25 15 (ran). Die vollständige Reihe von Statista steht hinter einer Anmeldung.

## Quellen

- Transferlisten: Wikipedia (englisch), „List of German football transfers summer 2025“ und „List of German football transfers winter 2025–26“, abgerufen am 19.11.2026, nur teilweise gelesen (https://en.wikipedia.org/wiki/List_of_German_football_transfers_summer_2025, https://en.wikipedia.org/wiki/List_of_German_football_transfers_winter_2025%E2%80%9326)
- Zwischenstand Sommer 2025 (66 Zugänge, 75 Abgänge): ZDFheute, „Bundesliga: Was von der Transferperiode zu erwarten ist“ (https://www.zdfheute.de/sport/bundesliga-transfermarkt-neuzugaenge-100.html)
- Leihkontingent der FIFA (8, 7, ab 1.7.2024 sechs; drei zwischen zwei Vereinen; Ausnahmen bis 21 und vom Verein ausgebildet; Dauer; kein Weiterverleihen): FIFA, Pressemitteilung „Neue Leihgabenregelung der FIFA“ vom 20.01.2022, abgerufen am 19.11.2026 (https://inside.fifa.com/de/organisation/media-releases/neue-leihgabenregelung-der-fifa)
- Nationales Leihkontingent der DFL (sechs, Ausnahmen für junge deutsche Spieler mit U23 beim verleihenden Verein und für U21 „Local Player“): SID bei Flashscore, „DFL ändert Leihspieler-Regeln“, ohne sichtbares Datum, abgerufen am 19.11.2026 (https://www.flashscore.de/news/fu-ball-bundesliga-mehr-chancen-fur-junge-deutsche-spieler-dfl-andert-leihspieler-regeln/KCTnbPDj/)
- 26 verliehene Spieler des FC Bayern 2024/25 (nur aus der Suchvorschau, Seite nicht gelesen): FC Bayern, „Loan Watch: So verlief die Spielzeit 2024/25 für die Leihspieler des FC Bayern“ (https://fcbayern.com/de/news/2025/06/loan-watch-so-verlief-die-spielzeit-2024-25-fuer-die-leihspieler-des-fc-bayern-teil-1)
- Trainerentlassungen je Saison in der 1. Liga seit 2000 (Spitzen 10 in 2005/06, 9 in 2002/03 und 2022/23; ohne Interimstrainer): 90min, „Die Bundesliga-Saisons mit den häufigsten Trainerentlassungen“, abgerufen am 19.11.2026, nur aus der Suchvorschau, einige Überschriften dort wirken vertauscht (https://www.90min.de/die-bundesliga-saisons-mit-den-haufigsten-trainerentlassungen)
- 15 Trainerentlassungen in der 2. Liga 2024/25, zwei Spieltage vor Schluss: ran.de, „2. Bundesliga völlig furios: Entlassungen en masse“, abgerufen am 19.11.2026, nur aus der Suchvorschau (https://ran.joyn.de/sports/fussball/2-bundesliga/2-bundesliga-voellig-furios-entlassungen-en-masse-so-schnell-ist-das-trainerkarussell-im-unterhaus-gefahren-81594)
- Trainerwechsel, Zahlen nicht einsehbar: Statista, „Trainerwechsel pro Saison in der 1. Fußball-Bundesliga“ (https://de.statista.com/statistik/daten/studie/36473/umfrage/trainerwechsel-in-der-fussball-bundesliga-seit-der-saison-63-64)

- Kaderplan, Bedarf, Verkaufs- und Kaufregeln, Finanzen, Trainerwechsel: `konzepte/_rohmaterial-logik-v1.md`, Kapitel 13 (Verkaufsregeln nach deinen Vorgaben)
- Kritik an der KI-Kaderplanung, zu leicht nach ein paar Saisons: `konzepte/_recherche-genre.md`, Abschnitte 4 und 4b
