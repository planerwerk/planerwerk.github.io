// Feste Texte: Ticker, Namen von Runden und Einstellungen.
// {n} = Spieler, {sc} = Spielstand, {gk} = Torwart des Gegners.
const TICKER_TOR=["TOR! {n} trifft zum {sc}!","TOR! {n} schiebt eiskalt ein. {sc}","TOR! Kopfball {n}, unhaltbar! {sc}","TOR! {n} zieht aus 18 Metern ab – drin! {sc}","TOR! Nach einer Ecke staubt {n} ab. {sc}","TOR! {n} vollendet einen Konter. {sc}"];
const TICKER_CHANCE=["{n} scheitert an {gk}.","{n} trifft nur den Pfosten!","Schuss von {n} – knapp drüber.","{gk} pariert stark gegen {n}.","{n} verzieht freistehend.","Gefährlicher Freistoß von {n}, {gk} ist zur Stelle."];
// Tortexte je Art (K04 §3.3). Fehlt eine Art, gilt TICKER_TOR.
const TICKER_ARTEN={kopf:['TOR! {n} köpft nach einer Flanke ein. {sc}','TOR! Flanke, Kopfball {n} – drin! {sc}'],ecke:['TOR! Nach einer Ecke steigt {n} am höchsten. {sc}','TOR! Ecke, Gewühl, {n} stochert ihn rein. {sc}'],
  freistoss:['TOR! Direkter Freistoß von {n}, unhaltbar in den Winkel! {sc}'],freistossFlanke:['TOR! Freistoßflanke, {n} ist zur Stelle. {sc}'],elfmeter:['TOR! {n} verwandelt den Elfmeter sicher. {sc}','TOR! Elfmeter {n} – der Torwart ahnt die Ecke, aber zu spät. {sc}'],
  konter:['TOR! Blitzkonter, {n} vollendet eiskalt. {sc}','TOR! Konter über das ganze Feld, {n} schiebt ein. {sc}'],fern:['TOR! {n} zieht aus 20 Metern ab – drin! {sc}','TOR! Fernschuss {n}, der Ball schlägt im Winkel ein! {sc}'],
  patzer:['TOR! Ein Patzer in der Abwehr, {n} sagt danke. {sc}'],gross:['TOR! {n} bleibt allein vor dem Tor cool. {sc}','TOR! {n} schiebt eiskalt ein. {sc}'],halb:['TOR! {n} trifft aus spitzem Winkel. {sc}','TOR! {n} trifft zum {sc}!']};
const POKAL_RUNDEN=['1. Runde','2. Runde','Achtelfinale','Viertelfinale','Halbfinale','Finale'];
const AUSRICHTUNG={SD:'Sehr defensiv',D:'Defensiv',N:'Ausgewogen',O:'Offensiv',SO:'Sehr offensiv'};
const EINSATZ={F:'Fair',N:'Normal',H:'Hart'};
const STIL_NAME={ausgewogen:'Ausgewogen',pressing:'Pressing',ballbesitz:'Ballbesitz',mauern:'Mauern',konter:'Konter',fluegel:'Flügelspiel'};
const STIL_TEXT={ausgewogen:'kein Schwerpunkt',pressing:'früh angreifen, Ball hoch gewinnen. Braucht Kondition, schnelle und zweikampfstarke Spieler. Kostet Kraft, anfällig für Konter.',
  ballbesitz:'Ball laufen lassen, geduldig aufbauen. Braucht einen Spielmacher und ballsichere Spieler.',mauern:'tief stehen, Räume eng machen. Braucht eine starke Abwehrmitte.',
  konter:'Ball holen, schnell umschalten. Braucht schnelle Spieler vorn und einen Torjäger.',fluegel:'über außen und Flanken. Braucht Flankengeber und einen kopfballstarken Stürmer.'};
const EINSTELLUNG_NAME={locker:'Locker angehen',normal:'Normal',saison:'Spiel der Saison'};
const TRAINING_STUFEN=['Locker','Normal','Hart'];
const TRAINING_TEXT=['Wenig Belastung: frischer, Kondition sinkt Richtung 70, Entwicklung langsamer (×0,8)','Ausgewogen: Kondition Richtung 80, normale Entwicklung','Viel Belastung: Kondition Richtung 90, Entwicklung schneller (×1,2), weniger frisch, Verletzungsrisiko'];
