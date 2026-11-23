// Vereine der Saison 2026/27, Ligazugehörigkeit wie in dieser Saison.
// Felder: name, kurz (Kürzel, verknüpft mit daten/spieler.js), liga (1 oder 2), ansehen (0–99),
// plaetze (Stadionkapazität, ca.), fans (Fanpotenzial), farbe (Vereinsfarbe), region (Regionalliga-Staffel bei Abstieg).
// mitglieder (K25d, seit 22.11.2026): eingetragene Vereinsmitglieder, Stand Winterpause 2025/26 nach der Übersicht von sechzger.de (Januar 2026, aus Wikipedia und Vereinsangaben,
//   teils ältere Stände), Fortuna Köln 3.000 nach dem DFB-Datencenter, SV Meppen, Würzburger Kickers und Großaspach geschätzt (keine Quelle gefunden), Zweite Mannschaften 0.
//   Ohne Angabe (Regionalliga) rechnet das Spiel mit einem Anteil der Fans (REGELN.finanzplan.mitglieder.ausFans).
// gegr (K27d, seit 23.11.2026, popolupo): Gründungsjahr, wie der Verein selbst zählt (für Jubiläen). Quelle: RSSSF „Germany – Foundation Dates Clubs“
//   (https://rsssf.org/tablesd/duitfound.html, Stand 18.6.2026), gelesen am 23.11.2026. Abweichend nach der Zählung der Vereine, vorläufig: HSV 1887 (RSSSF 1897),
//   Dynamo Dresden 1953 (RSSSF 1990, Neugründung als e. V.). Bei RSSSF nicht gefunden, nach Vereinsangabe (im Vereinsnamen oder Gründungsdatum), UNGEPRÜFT:
//   RB Leipzig 2009, Hoffenheim 1899, Elversberg 1907, Paderborn 1907 (heutiger Verein 1985), Heidenheim 1846, Holstein Kiel 1900, Jahn Regensburg 1907,
//   Ingolstadt 2004, Viktoria Köln 1904, Würzburger Kickers 1907, Großaspach 1994, Havelse 1912. Nur Vereine der drei Profiligen, ohne zweite Mannschaften.
// tradition:false (K25e, Prüfung EJ4, vorläufig): trotz frühem Gründungsjahr kein Traditionsverein im Sinn der Fankultur (Hoffenheim, Leverkusen).
// liga: 1, 2, 3 oder 4 (4 = Regionalliga, ohne Kader und ohne Spielbetrieb im Spiel).
// ewig3: Punkte in der ewigen Tabelle der 3. Liga (Wikipedia, Stand 6.11.2026, Drei-Punkte-Regel). abstieg3: Saison, nach der der Verein aus der 3. Liga abstieg.
// zw: Liga der zweiten Mannschaft 2026/27 (4 = Regionalliga, Staffel wie region; 5 = Oberliga, Name in ol). Ohne zw keine Zweite im Spiel
//   (gar keine oder unterhalb der Oberliga). Quelle: Wikipedia „2026–27 Regionalliga“ und „2026–27 Oberliga“, abgerufen am 15.11.2026 (U9d, K08 §5.6).
//   Hoffenheim und Stuttgart haben ihre Zweite in der 3. Liga, dort ist sie ein eigener Eintrag mit Feld zweite.
// profil (optional, K31 §3.2, U11b): zweites Vereinsprofil, eines von sparsam, ausbildung, altherren, spekulant, malocher (oder "kein"). Ohne Eintrag lost das Spiel
//   beim Aufbau der Welt. Noch steht bei keinem Verein eins: Welcher echte Verein welches Profil hat, ist nicht recherchiert.
// Bearbeiten: Werte hier ändern und das Spiel neu laden. Das wirkt ab der nächsten neuen Karriere.
const VEREINE=[
  {name:"FC Bayern München",kurz:"FCB",gegr:1900,liga:1,ansehen:95,plaetze:75000,fans:75000,mitglieder:432000,farbe:"#dc052d",region:"Bayern",zw:4,ewig3:0},
  {name:"Borussia Dortmund",kurz:"BVB",gegr:1909,liga:1,ansehen:86,plaetze:81365,fans:81000,mitglieder:238109,farbe:"#fde100",region:"West",zw:4,ewig3:0},
  {name:"Bayer 04 Leverkusen",kurz:"B04",gegr:1904,tradition:false,liga:1,ansehen:84,plaetze:30210,fans:30000,mitglieder:70000,farbe:"#e32221",region:"West",ewig3:0},
  {name:"RB Leipzig",kurz:"RBL",gegr:2009,liga:1,ansehen:80,plaetze:47069,fans:42000,mitglieder:1130,farbe:"#dd0741",region:"Nordost",ewig3:79},
  {name:"VfB Stuttgart",kurz:"VFB",gegr:1893,liga:1,ansehen:78,plaetze:60058,fans:58000,mitglieder:126000,farbe:"#e32219",region:"Südwest",ewig3:0},
  {name:"Eintracht Frankfurt",kurz:"SGE",gegr:1899,liga:1,ansehen:77,plaetze:58000,fans:56000,mitglieder:155000,farbe:"#e1000f",region:"Südwest",zw:4,ewig3:0},
  {name:"SC Freiburg",kurz:"SCF",gegr:1904,liga:1,ansehen:72,plaetze:34700,fans:33500,mitglieder:79000,farbe:"#c8102e",region:"Südwest",zw:4,ewig3:0},
  {name:"TSG Hoffenheim",kurz:"TSG",gegr:1899,tradition:false,liga:1,ansehen:70,plaetze:30150,fans:25000,mitglieder:11500,farbe:"#1961b5",region:"Südwest",ewig3:0},
  {name:"1. FSV Mainz 05",kurz:"M05",gegr:1905,liga:1,ansehen:68,plaetze:33305,fans:31000,mitglieder:27000,farbe:"#ed1c24",region:"Südwest",zw:4,ewig3:0},
  {name:"Borussia Mönchengladbach",kurz:"BMG",gegr:1900,liga:1,ansehen:68,plaetze:54042,fans:50000,mitglieder:110000,farbe:"#1c1c1c",region:"West",zw:4,ewig3:0},
  {name:"SV Werder Bremen",kurz:"SVW",gegr:1899,liga:1,ansehen:67,plaetze:42100,fans:41000,mitglieder:68000,farbe:"#1d9053",region:"Nord",zw:4,ewig3:0},
  {name:"Hamburger SV",kurz:"HSV",gegr:1887,liga:1,ansehen:66,plaetze:57000,fans:56000,mitglieder:140000,farbe:"#0a3f86",region:"Nord",zw:4,ewig3:0},
  {name:"1. FC Köln",kurz:"KOE",gegr:1948,liga:1,ansehen:65,plaetze:50000,fans:49500,mitglieder:155000,farbe:"#ed1c24",region:"West",zw:4,ewig3:0},
  {name:"FC Augsburg",kurz:"FCA",gegr:1907,liga:1,ansehen:64,plaetze:30660,fans:28000,mitglieder:30660,farbe:"#ba3733",region:"Bayern",zw:4,ewig3:0},
  {name:"1. FC Union Berlin",kurz:"FCU",gegr:1966,liga:1,ansehen:64,plaetze:22012,fans:22000,mitglieder:71328,farbe:"#d4011d",region:"Nordost",ewig3:78},
  {name:"FC Schalke 04",kurz:"S04",gegr:1904,liga:1,ansehen:64,plaetze:62271,fans:61000,mitglieder:204000,farbe:"#004d9d",region:"West",zw:4,ewig3:0},
  {name:"SV Elversberg",kurz:"SVE",gegr:1907,liga:1,ansehen:55,plaetze:10000,fans:9000,mitglieder:4607,farbe:"#2a2a2a",region:"Südwest",zw:5,ol:"Oberliga Rheinland-Pfalz/Saar",ewig3:114},
  {name:"SC Paderborn 07",kurz:"SCP",gegr:1907,liga:1,ansehen:55,plaetze:15000,fans:13500,mitglieder:9507,farbe:"#005ca9",region:"West",zw:4,ewig3:195},
  {name:"VfL Wolfsburg",kurz:"WOB",gegr:1945,liga:2,ansehen:62,plaetze:30000,fans:22000,mitglieder:22000,farbe:"#65b32e",region:"Nord",ewig3:0},
  {name:"FC St. Pauli",kurz:"STP",gegr:1910,liga:2,ansehen:58,plaetze:29546,fans:29000,mitglieder:52357,farbe:"#6b4226",region:"Nord",zw:4,ewig3:0},
  {name:"Hertha BSC",kurz:"BSC",gegr:1892,liga:2,ansehen:57,plaetze:74475,fans:45000,mitglieder:60620,farbe:"#005ca9",region:"Nordost",zw:4,ewig3:0},
  {name:"1. FC Heidenheim",kurz:"FCH",gegr:1846,liga:2,ansehen:56,plaetze:15000,fans:14500,mitglieder:13000,farbe:"#e2001a",region:"Südwest",ewig3:321},
  {name:"Hannover 96",kurz:"H96",gegr:1896,liga:2,ansehen:55,plaetze:49000,fans:36000,mitglieder:23309,farbe:"#00843d",region:"Nord",zw:4,ewig3:0},
  {name:"1. FC Kaiserslautern",kurz:"FCK",gegr:1900,liga:2,ansehen:55,plaetze:49327,fans:42000,mitglieder:39100,farbe:"#c8102e",region:"Südwest",zw:4,ewig3:212},
  {name:"1. FC Nürnberg",kurz:"FCN",gegr:1900,liga:2,ansehen:54,plaetze:50000,fans:36000,mitglieder:39500,farbe:"#a3112d",region:"Bayern",zw:4,ewig3:0},
  {name:"VfL Bochum",kurz:"BOC",gegr:1848,liga:2,ansehen:53,plaetze:26000,fans:25500,mitglieder:32755,farbe:"#005ca9",region:"West",zw:4,ewig3:0},
  {name:"SV Darmstadt 98",kurz:"D98",gegr:1898,liga:2,ansehen:51,plaetze:17000,fans:17000,mitglieder:15500,farbe:"#004e9e",region:"Südwest",zw:5,ol:"Hessenliga",ewig3:159},
  {name:"Karlsruher SC",kurz:"KSC",gegr:1894,liga:2,ansehen:51,plaetze:34302,fans:28000,mitglieder:20000,farbe:"#0057a8",region:"Südwest",zw:5,ol:"Oberliga Baden-Württemberg",ewig3:219},
  {name:"Holstein Kiel",kurz:"KSV",gegr:1900,liga:2,ansehen:50,plaetze:15034,fans:14500,mitglieder:11565,farbe:"#0b4ea2",region:"Nord",zw:5,ol:"Oberliga Schleswig-Holstein",ewig3:265},
  {name:"1. FC Magdeburg",kurz:"FCM",gegr:1965,liga:2,ansehen:49,plaetze:27250,fans:24000,mitglieder:15896,farbe:"#0055a5",region:"Nordost",zw:4,ewig3:378},
  {name:"Arminia Bielefeld",kurz:"DSC",gegr:1905,liga:2,ansehen:49,plaetze:26515,fans:24500,mitglieder:28780,farbe:"#004f9f",region:"West",zw:5,ol:"Oberliga Westfalen",ewig3:318},
  {name:"Dynamo Dresden",kurz:"SGD",gegr:1953,liga:2,ansehen:49,plaetze:32000,fans:30000,mitglieder:36091,farbe:"#fdd100",region:"Nordost",zw:5,ol:"NOFV-Oberliga Süd",ewig3:575},
  {name:"Eintracht Braunschweig",kurz:"EBS",gegr:1895,liga:2,ansehen:47,plaetze:23325,fans:21000,mitglieder:8144,farbe:"#f6d200",region:"Nord",zw:5,ol:"Oberliga Niedersachsen",ewig3:365},
  {name:"SpVgg Greuther Fürth",kurz:"SGF",gegr:1903,liga:2,ansehen:47,plaetze:16626,fans:11000,mitglieder:4948,farbe:"#00843d",region:"Bayern",zw:4,ewig3:0},
  {name:"VfL Osnabrück",kurz:"OSN",gegr:1899,liga:2,ansehen:45,plaetze:15741,fans:15000,mitglieder:8785,farbe:"#6a2c91",region:"Nord",ewig3:783},
  {name:"FC Energie Cottbus",kurz:"FCE",gegr:1966,liga:2,ansehen:45,plaetze:22528,fans:15500,mitglieder:5904,farbe:"#e30613",region:"Nordost",ewig3:276},
  // 3. Liga 2026/27: Kader erfunden. Kapazität und Fanpotenzial aus dem Zuschauerschnitt laut Wikipedia (Stand 6.11.2026).
  // zweite: Zweitmannschaft dieses Vereins. Sie darf nicht in die 2. Liga aufsteigen und spielt nicht im DFB-Pokal.
  {name:"Fortuna Düsseldorf",kurz:"F95",gegr:1895,liga:3,ansehen:47,plaetze:54600,fans:43500,mitglieder:36000,farbe:"#e30613",region:"West",zw:5,ol:"Oberliga Niederrhein",ewig3:85},
  {name:"Hansa Rostock",kurz:"HRO",gegr:1965,liga:3,ansehen:46,plaetze:29000,fans:33500,mitglieder:30105,farbe:"#005ca9",region:"Nordost",zw:5,ol:"NOFV-Oberliga Nord",ewig3:695},
  {name:"Alemannia Aachen",kurz:"AAC",gegr:1900,liga:3,ansehen:44,plaetze:32960,fans:31500,mitglieder:10760,farbe:"#e6c200",region:"West",ewig3:160},
  {name:"MSV Duisburg",kurz:"MSV",gegr:1902,liga:3,ansehen:44,plaetze:31418,fans:29000,mitglieder:11378,farbe:"#0063b0",region:"West",ewig3:512},
  {name:"Rot-Weiss Essen",kurz:"RWE",gegr:1907,liga:3,ansehen:43,plaetze:19962,fans:23000,mitglieder:14068,farbe:"#d40f14",region:"West",ewig3:251},
  {name:"1. FC Saarbrücken",kurz:"FCS",gegr:1903,liga:3,ansehen:42,plaetze:16003,fans:18500,mitglieder:11657,farbe:"#1d3f8f",region:"Südwest",ewig3:560},
  {name:"Preußen Münster",kurz:"PRM",gegr:1906,liga:3,ansehen:42,plaetze:13945,fans:17500,mitglieder:14659,farbe:"#1f7a3a",region:"West",zw:5,ol:"Oberliga Westfalen",ewig3:555},
  {name:"SV Waldhof Mannheim",kurz:"WMA",gegr:1907,liga:3,ansehen:41,plaetze:24302,fans:14000,mitglieder:2537,farbe:"#003c8f",region:"Südwest",ewig3:385},
  {name:"SSV Jahn Regensburg",kurz:"JRE",gegr:1907,liga:3,ansehen:41,plaetze:15210,fans:11000,mitglieder:5500,farbe:"#c8102e",region:"Bayern",zw:5,ol:"Bayernliga Nord",ewig3:472},
  {name:"FC Ingolstadt 04",kurz:"FCI",gegr:2004,liga:3,ansehen:40,plaetze:15200,fans:6500,mitglieder:2681,farbe:"#b5121b",region:"Bayern",zw:5,ol:"Bayernliga Nord",ewig3:420},
  {name:"SV Wehen Wiesbaden",kurz:"SWW",gegr:1926,liga:3,ansehen:40,plaetze:12500,fans:6000,mitglieder:768,farbe:"#c41e3a",region:"Südwest",ewig3:852},
  {name:"FC Viktoria Köln",kurz:"VIK",gegr:1904,liga:3,ansehen:38,plaetze:8343,fans:6000,mitglieder:703,farbe:"#c8102e",region:"West",ewig3:390},
  {name:"SV Meppen",kurz:"SVM",gegr:1912,liga:3,ansehen:37,plaetze:13241,fans:11000,mitglieder:1700,farbe:"#005ca9",region:"Nord",zw:5,ol:"Oberliga Niedersachsen",ewig3:303},
  {name:"Würzburger Kickers",kurz:"FWK",gegr:1907,liga:3,ansehen:37,plaetze:13090,fans:6000,mitglieder:2000,farbe:"#e2001a",region:"Bayern",ewig3:290},
  {name:"SC Verl",kurz:"VER",gegr:1924,liga:3,ansehen:36,plaetze:5207,fans:3000,mitglieder:1401,farbe:"#2a2a2a",region:"West",zw:5,ol:"Oberliga Westfalen",ewig3:330},
  {name:"TSG 1899 Hoffenheim II",kurz:"TS2",liga:3,ansehen:35,plaetze:6350,fans:2000,mitglieder:0,farbe:"#1961b5",region:"Südwest",zweite:"TSG",ewig3:59},
  {name:"VfB Stuttgart II",kurz:"VF2",liga:3,ansehen:35,plaetze:10001,fans:2000,mitglieder:0,farbe:"#e32219",region:"Südwest",zweite:"VFB",ewig3:477},
  {name:"SC Fortuna Köln",kurz:"FKO",gegr:1948,liga:3,ansehen:33,plaetze:9544,fans:7500,mitglieder:3000,farbe:"#d6001c",region:"West",zw:5,ol:"Mittelrheinliga",ewig3:244},
  {name:"SG Sonnenhof Großaspach",kurz:"SGS",gegr:1994,liga:3,ansehen:31,plaetze:10001,fans:2000,mitglieder:800,farbe:"#1d4f91",region:"Südwest",ewig3:287},
  {name:"TSV Havelse",kurz:"HAV",gegr:1912,liga:3,ansehen:28,plaetze:5001,fans:2000,mitglieder:871,farbe:"#1f4a8a",region:"Nord",ewig3:68},
  // Regionalliga (liga 4): Kandidaten für den Aufstieg in die 3. Liga, ohne Kader. Kapazitäten gerundet und ungefähr.
  {name:"VfB Oldenburg",kurz:"VFO",liga:4,ansehen:33,plaetze:15200,fans:7500,farbe:"#005ca9",region:"Nord",ewig3:35},
  {name:"VfB Lübeck",kurz:"LUE",liga:4,ansehen:33,plaetze:17800,fans:9000,farbe:"#1f7a3a",region:"Nord",ewig3:67},
  {name:"SC Weiche Flensburg 08",kurz:"SCW",liga:4,ansehen:26,plaetze:4000,fans:2000,farbe:"#1a5bab",region:"Nord",ewig3:0},
  {name:"Kickers Emden",kurz:"EMD",liga:4,ansehen:27,plaetze:7200,fans:3500,farbe:"#005ca9",region:"Nord",ewig3:59},
  {name:"SV Drochtersen/Assel",kurz:"DRO",liga:4,ansehen:24,plaetze:3000,fans:2000,farbe:"#d6001c",region:"Nord",ewig3:0},
  {name:"FC Erzgebirge Aue",kurz:"AUE",liga:4,ansehen:42,plaetze:16500,fans:13000,farbe:"#6f2c91",region:"Nordost",ewig3:375,abstieg3:2025},
  {name:"Hallescher FC",kurz:"HFC",liga:4,ansehen:40,plaetze:15000,fans:12000,farbe:"#d40f14",region:"Nordost",ewig3:583},
  {name:"Chemnitzer FC",kurz:"CFC",liga:4,ansehen:39,plaetze:15000,fans:12000,farbe:"#0b6fb8",region:"Nordost",ewig3:391},
  {name:"FC Carl Zeiss Jena",kurz:"FCC",liga:4,ansehen:39,plaetze:15000,fans:12000,farbe:"#003f87",region:"Nordost",ewig3:305},
  {name:"FC Rot-Weiß Erfurt",kurz:"RWF",liga:4,ansehen:37,plaetze:18600,fans:15000,farbe:"#d40f14",region:"Nordost",ewig3:478},
  {name:"1. FC Lokomotive Leipzig",kurz:"LOK",liga:4,ansehen:33,plaetze:10900,fans:5500,farbe:"#0055a5",region:"Nordost",ewig3:0},
  {name:"Rot-Weiß Oberhausen",kurz:"RWO",liga:4,ansehen:37,plaetze:21300,fans:17000,farbe:"#d40f14",region:"West",ewig3:38},
  {name:"SG Wattenscheid 09",kurz:"SGW",liga:4,ansehen:30,plaetze:16200,fans:8000,farbe:"#2a2a2a",region:"West",ewig3:0},
  {name:"Sportfreunde Siegen",kurz:"SFS",liga:4,ansehen:29,plaetze:18500,fans:9000,farbe:"#d40f14",region:"West",ewig3:0},
  {name:"Bonner SC",kurz:"BON",liga:4,ansehen:28,plaetze:10100,fans:5000,farbe:"#c8102e",region:"West",ewig3:0},
  {name:"FC Gütersloh",kurz:"FCG",liga:4,ansehen:27,plaetze:12500,fans:6000,farbe:"#1f4a8a",region:"West",ewig3:0},
  {name:"Kickers Offenbach",kurz:"OFC",liga:4,ansehen:42,plaetze:20500,fans:16500,farbe:"#d40f14",region:"Südwest",ewig3:263},
  {name:"SSV Ulm 1846",kurz:"ULM",liga:4,ansehen:39,plaetze:17400,fans:14000,farbe:"#2a2a2a",region:"Südwest",ewig3:110,abstieg3:2025},
  {name:"SV Sandhausen",kurz:"SVS",liga:4,ansehen:38,plaetze:15400,fans:12500,farbe:"#2a2a2a",region:"Südwest",ewig3:300},
  {name:"Stuttgarter Kickers",kurz:"SKI",liga:4,ansehen:34,plaetze:11400,fans:5500,farbe:"#003f87",region:"Südwest",ewig3:228},
  {name:"VfR Aalen",kurz:"AAL",liga:4,ansehen:31,plaetze:14500,fans:7000,farbe:"#2a2a2a",region:"Südwest",ewig3:317},
  {name:"FC 08 Homburg",kurz:"HOM",liga:4,ansehen:30,plaetze:16500,fans:8000,farbe:"#1f7a3a",region:"Südwest",ewig3:0},
  {name:"SV Eintracht Trier",kurz:"TRI",liga:4,ansehen:30,plaetze:10300,fans:5000,farbe:"#003f87",region:"Südwest",ewig3:0},
  {name:"TSV 1860 München",kurz:"M60",liga:4,ansehen:45,plaetze:15000,fans:12000,farbe:"#73b2e2",region:"Bayern",ewig3:444,abstieg3:2025},
  {name:"SpVgg Unterhaching",kurz:"UHA",liga:4,ansehen:35,plaetze:15000,fans:12000,farbe:"#c8102e",region:"Bayern",ewig3:604},
  {name:"1. FC Schweinfurt 05",kurz:"SW5",liga:4,ansehen:32,plaetze:15000,fans:7500,farbe:"#1f7a3a",region:"Bayern",ewig3:21},
  {name:"Wacker Burghausen",kurz:"WBU",liga:4,ansehen:30,plaetze:10000,fans:5000,farbe:"#2a2a2a",region:"Bayern",ewig3:268},
  {name:"SpVgg Bayreuth",kurz:"BAY",liga:4,ansehen:29,plaetze:21500,fans:11000,farbe:"#e6c200",region:"Bayern",ewig3:32},
  {name:"FC Memmingen",kurz:"MEM",liga:4,ansehen:25,plaetze:5100,fans:2500,farbe:"#d40f14",region:"Bayern",ewig3:0}
];

// Derbys und Rivalitäten (K17 §3, §5.5, U12c): [Kürzel, Kürzel, Name, Art]. Art 'derby' (Grundwert der Beziehung −30) oder 'rivale' (−15), Werte in REGELN.beziehungen.grund.
// Nur Paare, die die Quelle ausdrücklich nennt: Wikipedia (englisch), „German football rivalries“, abgerufen am 20.11.2026.
// Fürth–Nürnberg, Regensburg–Ingolstadt und Bremen–HSV sind aus dem Aufbau der Tabelle dort erschlossen (K17 Quellen).
const DERBYS=[
  ["BVB","S04","Revierderby","derby"],["SVW","HSV","Nordderby","derby"],["HSV","STP","Hamburger Derby","derby"],["FCU","BSC","Berliner Derby","derby"],
  ["BMG","KOE","Rheinderby","derby"],["KOE","FKO","Kölner Derby","derby"],["KOE","VIK","Kölner Derby","derby"],["SGF","FCN","Frankenderby","derby"],
  ["FCN","FCB","Bayerisches Derby","derby"],["FCA","FCI","Derby Augsburg–Ingolstadt","derby"],["JRE","FCI","Donauderby","derby"],["KSC","VFB","Baden-Schwaben-Derby","derby"],
  ["SCF","KSC","Baden-Derby","derby"],["SGE","D98","Hessenderby","derby"],["H96","EBS","Niedersachsenderby","derby"],["PRM","OSN","Grenzlandderby","derby"],
  ["FCK","FCS","Südwestderby","derby"],["DSC","PRM","Westfalenderby","derby"],["SGD","FCM","Elb-Clásico","derby"],["HRO","STP","Derby Rostock–St. Pauli","derby"],
  ["FCB","BVB","Der Klassiker","rivale"],["HSV","FCB","Nord-Süd-Gipfel","rivale"],["SVW","FCB","Nord-Süd-Gipfel","rivale"]];

// Erfundene Amateurklubs für den DFB-Pokal (64 Teams = 36 aus 1. und 2. Liga, 4 aus der 3. Liga, 24 Amateure).
const AMATEURE=["TSV Rheinau","SV Hohenfeld","FC Eintracht Lohberg","SpVgg Kirchheide","VfR Altmühl","TuS Bergen-Ost","SC Wiesental","FSV Lindenau","FC Ahrweiler-Süd","SV Moorbach","TSG Steinfurt-Land","FC Viktoria Hellweg","SV Blau-Weiß Elmshagen","TuS Nordenham-Mitte","VfB Grünstadt","SV Germania Kalkreuth","FC Teutonia Wendel","SC Hafenstadt","TSV Bad Hollerbach","SpVgg Unterried","SV Rot-Weiß Ostheim","FC Sankt Albrecht","VfL Heidekamp","TuS Oberwinter","SV Seeblick","FC Haldenau","SV Fortuna Talheim","FC Wacker Rennsteig"];

// Erfundene Sponsoren für die Trikotsponsor-Angebote.
const SPONSOREN=["Rheinwerk Energie","Nordsee Versicherung","Alpentaler Brauerei","Hansa Logistik","Brückner Bau","SolarTec Süd","Kaiser Mobilfunk","Waldquell Mineralwasser","Elbtal Bank","Mainfranken Autohaus","Ostwind Reisen","Lindner Pharma"];
