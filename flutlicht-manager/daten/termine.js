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
    {von:'2027-03-22',bis:'2027-04-01',name:'Länderspielpause',ligen:[1,2]}],
  // Europapokal 2026/27 (K37, U19a, Websuche 21.11.2026 bei der UEFA). los: Auslosung der Ligaphase, liga: Spieltage, losPo und losAf: Auslosungen der K.-o.-Runden,
  // po bis hf: Hin- und Rückspiel, fin: Finale (liegt es nach dem letzten Spieltag der Saison, rückt es auf den Tag vor dem Saisonende), quali: Play-off-Runde der Qualifikation.
  // Champions League an zwei Tagen (Dienstag und Mittwoch), die Spiele werden verteilt. Die Spieltage der Conference League zwischen dem 1. und 6. sind abgeleitet (K37 §12).
  europa:{
    cl:{zeit:'21:00',los:'2026-08-27',liga:[['2026-09-08','2026-09-09'],['2026-10-13','2026-10-14'],['2026-10-20','2026-10-21'],['2026-11-03','2026-11-04'],['2026-11-24','2026-11-25'],['2026-12-08','2026-12-09'],['2027-01-19','2027-01-20'],['2027-01-27','2027-01-27']],
      losPo:'2027-01-29',po:[['2027-02-16','2027-02-17'],['2027-02-23','2027-02-24']],losAf:'2027-02-26',af:[['2027-03-09','2027-03-10'],['2027-03-16','2027-03-17']],
      vf:[['2027-04-06','2027-04-07'],['2027-04-13','2027-04-14']],hf:[['2027-04-27','2027-04-28'],['2027-05-04','2027-05-05']],fin:'2027-06-05'},
    el:{zeit:'21:00',los:'2026-08-28',liga:['2026-09-17','2026-10-15','2026-10-22','2026-11-05','2026-11-26','2026-12-10','2027-01-21','2027-01-28'],
      losPo:'2027-01-29',po:['2027-02-18','2027-02-25'],losAf:'2027-02-26',af:['2027-03-11','2027-03-18'],vf:['2027-04-08','2027-04-15'],hf:['2027-04-29','2027-05-06'],fin:'2027-05-26'},
    ecl:{zeit:'18:45',quali:['2026-08-20','2026-08-27'],los:'2026-08-28',liga:['2026-10-15','2026-10-22','2026-11-05','2026-11-26','2026-12-10','2026-12-17'],
      losPo:'2027-01-29',po:['2027-02-18','2027-02-25'],losAf:'2027-02-26',af:['2027-03-11','2027-03-18'],vf:['2027-04-08','2027-04-15'],hf:['2027-04-29','2027-05-06'],fin:'2027-06-02'}},
  // Deutsche Teilnehmer 2026/27 (Kürzel aus daten/vereine.js, Websuche 21.11.2026, zweite Quelle offen, K37 §5.1). ecl spielt die Play-off-Runde der Qualifikation.
  europaStart:{cl:['FCB','BVB','RBL','VFB'],el:['B04','TSG'],ecl:['SCF']}
};
