// Feste Texte: Ticker, Namen von Runden und Einstellungen.
// {n} = Spieler, {sc} = Spielstand, {gk} = Torwart des Gegners.
const TICKER_TOR=["TOR! {n} trifft zum {sc}!","TOR! {n} schiebt eiskalt ein. {sc}","TOR! Kopfball {n}, unhaltbar! {sc}","TOR! {n} zieht aus 18 Metern ab – drin! {sc}","TOR! Nach einer Ecke staubt {n} ab. {sc}","TOR! {n} vollendet einen Konter. {sc}"];
const TICKER_CHANCE=["{n} scheitert an {gk}.","{n} trifft nur den Pfosten!","Schuss von {n} – knapp drüber.","{gk} pariert stark gegen {n}.","{n} verzieht freistehend.","Gefährlicher Freistoß von {n}, {gk} ist zur Stelle."];
const POKAL_RUNDEN=['1. Runde','2. Runde','Achtelfinale','Viertelfinale','Halbfinale','Finale'];
const AUSRICHTUNG={N:'Normal',O:'Offensiv',D:'Defensiv',K:'Konter'};
const EINSATZ={F:'Fair',N:'Normal',H:'Hart'};
const TRAINING_STUFEN=['Locker','Normal','Hart'];
const TRAINING_TEXT=['Wenig Belastung: frischer, Kondition sinkt Richtung 70, Entwicklung langsamer (×0,8)','Ausgewogen: Kondition Richtung 80, normale Entwicklung','Viel Belastung: Kondition Richtung 90, Entwicklung schneller (×1,2), weniger frisch, Verletzungsrisiko'];
