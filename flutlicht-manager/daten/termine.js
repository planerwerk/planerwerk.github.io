// Rahmentermine der Saison 2026/27 (Konzept K01). Datum als 'JJJJ-MM-TT'.
// Die Ligaspiele mit Datum und Anstoßzeit stehen in daten/spielplan-2026.js (offizieller Spielplan).
// Hier stehen die übrigen Termine: Saisonstart, Trainingsauftakt, Pokal, Relegation, Pausen, Saisonende.
// Folgejahre: Das Spiel verschiebt alle Termine um volle Wochen, damit die Wochentage gleich bleiben.
const TERMINE_2026={
  saison:2026,
  start:'2026-07-01',            // Saisonwechsel, immer am 1. Juli: neue Saison, neue Verträge, Sponsorangebote
  trainingsauftakt:'2026-07-06', // Ende des Sommerurlaubs, die Mannschaft trainiert wieder
  ende:'2027-06-02',             // Saisonende: Tag nach dem letzten Relegationsspiel, danach Sommerpause
  pokal:[['2026-08-22','15:30'],['2026-10-27','20:45'],['2026-12-01','20:45'],['2027-02-02','20:45'],['2027-04-20','20:45'],['2027-05-29','20:00']], // 1. Runde bis Finale
  relegation:[['2027-05-27','20:30'],['2027-05-31','20:30']],   // 16. der 1. Liga gegen den 3. der 2. Liga (Hinspiel beim Zweitligisten)
  relegation2:[['2027-05-28','20:30'],['2027-06-01','20:30']],  // 16. der 2. Liga gegen den 3. der 3. Liga (Hinspiel beim Drittligisten)
  pausen:[
    {von:'2026-09-21',bis:'2026-10-08',name:'Länderspielpause',ligen:[1,2]},
    {von:'2026-11-09',bis:'2026-11-19',name:'Länderspielpause',ligen:[1,2]},
    {von:'2026-12-21',bis:'2027-01-07',name:'Winterpause',ligen:[1]},
    {von:'2026-12-21',bis:'2027-01-14',name:'Winterpause',ligen:[2]},
    {von:'2026-12-20',bis:'2027-01-15',name:'Winterpause',ligen:[3]},
    {von:'2027-03-22',bis:'2027-04-01',name:'Länderspielpause',ligen:[1,2]}]
};
