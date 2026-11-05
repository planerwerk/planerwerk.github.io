// Rahmentermine der Saison 2026/27 (Konzept K01). Datum als 'JJJJ-MM-TT'.
// Im Spiel liegt ein Spieltag an einem Tag: 1. Liga samstags, 2. Liga sonntags, englische Wochen mittwochs,
// Pokal dienstags (1. Runde und Finale samstags), Relegation donnerstags und montags.
// Gesichert sind die Eckdaten (Start, Winterpause, 27. und 34. Spieltag, Pokal, Relegation, Länderspielpausen).
// Die übrigen Spieltage sind passend dazu geschätzt. Quellen und Einzelheiten stehen in konzepte/K01-kalender.md.
// Folgejahre: Das Spiel verschiebt diese Termine um volle Wochen, damit die Wochentage gleich bleiben.
const TERMINE_2026={
  saison:2026,
  start:'2026-08-03',   // Spielbeginn: Montag vor dem 1. Spieltag der 2. Liga
  ende:'2027-06-01',    // Saisonende: Tag nach dem Relegations-Rückspiel
  liga1:[
    '2026-08-29','2026-09-05','2026-09-12','2026-09-19',              // 1.–4.
    '2026-10-10','2026-10-17','2026-10-24','2026-10-31','2026-11-07', // 5.–9.
    '2026-11-21','2026-11-28','2026-12-05','2026-12-12','2026-12-19', // 10.–14., dann Winterpause
    '2027-01-09','2027-01-13','2027-01-16','2027-01-20','2027-01-23', // 15.–19., 16. und 18. unter der Woche
    '2027-01-30','2027-02-06','2027-02-13','2027-02-20','2027-02-27', // 20.–24.
    '2027-03-06','2027-03-13','2027-03-20',                           // 25.–27.
    '2027-04-03','2027-04-10','2027-04-17','2027-04-24',              // 28.–31.
    '2027-05-08','2027-05-15','2027-05-22'],                          // 32.–34.
  liga2:[
    '2026-08-09','2026-08-16','2026-08-30','2026-09-06','2026-09-13','2026-09-20', // 1.–6.
    '2026-10-11','2026-10-18','2026-10-25','2026-11-01','2026-11-08',              // 7.–11.
    '2026-11-22','2026-11-29','2026-12-06','2026-12-13','2026-12-20',              // 12.–16., dann Winterpause
    '2027-01-17','2027-01-24','2027-01-31','2027-02-07','2027-02-14',              // 17.–21.
    '2027-02-21','2027-02-28','2027-03-07','2027-03-14','2027-03-21',              // 22.–26.
    '2027-04-04','2027-04-11','2027-04-18','2027-04-25',                           // 27.–30.
    '2027-05-02','2027-05-09','2027-05-16','2027-05-23'],                          // 31.–34.
  pokal:['2026-08-22','2026-10-27','2026-12-01','2027-02-02','2027-04-20','2027-05-29'], // 1. Runde bis Finale
  relegation:['2027-05-27','2027-05-31'],  // Hinspiel beim Dritten der 2. Liga, Rückspiel beim 16. der 1. Liga
  pausen:[
    {von:'2026-09-21',bis:'2026-10-06',name:'Länderspielpause'},
    {von:'2026-11-09',bis:'2026-11-17',name:'Länderspielpause'},
    {von:'2026-12-21',bis:'2027-01-08',name:'Winterpause',liga:1},
    {von:'2026-12-21',bis:'2027-01-16',name:'Winterpause',liga:2},
    {von:'2027-03-22',bis:'2027-03-30',name:'Länderspielpause'}]
};
