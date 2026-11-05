// Vereine der Saison 2026/27, Ligazugehörigkeit wie in dieser Saison.
// Felder: name, kurz (Kürzel, verknüpft mit daten/spieler.js), liga (1 oder 2), ansehen (0–99),
// plaetze (Stadionkapazität, ca.), fans (Fanpotenzial), farbe (Vereinsfarbe).
// Bearbeiten: Werte hier ändern und das Spiel neu laden. Das wirkt ab der nächsten neuen Karriere.
const VEREINE=[
  {name:"FC Bayern München",kurz:"FCB",liga:1,ansehen:95,plaetze:75000,fans:75000,farbe:"#dc052d"},
  {name:"Borussia Dortmund",kurz:"BVB",liga:1,ansehen:86,plaetze:81365,fans:81000,farbe:"#fde100"},
  {name:"Bayer 04 Leverkusen",kurz:"B04",liga:1,ansehen:84,plaetze:30210,fans:30000,farbe:"#e32221"},
  {name:"RB Leipzig",kurz:"RBL",liga:1,ansehen:80,plaetze:47069,fans:42000,farbe:"#dd0741"},
  {name:"VfB Stuttgart",kurz:"VFB",liga:1,ansehen:78,plaetze:60058,fans:58000,farbe:"#e32219"},
  {name:"Eintracht Frankfurt",kurz:"SGE",liga:1,ansehen:77,plaetze:58000,fans:56000,farbe:"#e1000f"},
  {name:"SC Freiburg",kurz:"SCF",liga:1,ansehen:72,plaetze:34700,fans:33500,farbe:"#c8102e"},
  {name:"TSG Hoffenheim",kurz:"TSG",liga:1,ansehen:70,plaetze:30150,fans:25000,farbe:"#1961b5"},
  {name:"1. FSV Mainz 05",kurz:"M05",liga:1,ansehen:68,plaetze:33305,fans:31000,farbe:"#ed1c24"},
  {name:"Borussia Mönchengladbach",kurz:"BMG",liga:1,ansehen:68,plaetze:54042,fans:50000,farbe:"#1c1c1c"},
  {name:"SV Werder Bremen",kurz:"SVW",liga:1,ansehen:67,plaetze:42100,fans:41000,farbe:"#1d9053"},
  {name:"Hamburger SV",kurz:"HSV",liga:1,ansehen:66,plaetze:57000,fans:56000,farbe:"#0a3f86"},
  {name:"1. FC Köln",kurz:"KOE",liga:1,ansehen:65,plaetze:50000,fans:49500,farbe:"#ed1c24"},
  {name:"FC Augsburg",kurz:"FCA",liga:1,ansehen:64,plaetze:30660,fans:28000,farbe:"#ba3733"},
  {name:"1. FC Union Berlin",kurz:"FCU",liga:1,ansehen:64,plaetze:22012,fans:22000,farbe:"#d4011d"},
  {name:"FC Schalke 04",kurz:"S04",liga:1,ansehen:64,plaetze:62271,fans:61000,farbe:"#004d9d"},
  {name:"SV Elversberg",kurz:"SVE",liga:1,ansehen:55,plaetze:10000,fans:9000,farbe:"#2a2a2a"},
  {name:"SC Paderborn 07",kurz:"SCP",liga:1,ansehen:55,plaetze:15000,fans:13500,farbe:"#005ca9"},
  {name:"VfL Wolfsburg",kurz:"WOB",liga:2,ansehen:62,plaetze:30000,fans:22000,farbe:"#65b32e"},
  {name:"FC St. Pauli",kurz:"STP",liga:2,ansehen:58,plaetze:29546,fans:29000,farbe:"#6b4226"},
  {name:"Hertha BSC",kurz:"BSC",liga:2,ansehen:57,plaetze:74475,fans:45000,farbe:"#005ca9"},
  {name:"1. FC Heidenheim",kurz:"FCH",liga:2,ansehen:56,plaetze:15000,fans:14500,farbe:"#e2001a"},
  {name:"Hannover 96",kurz:"H96",liga:2,ansehen:55,plaetze:49000,fans:36000,farbe:"#00843d"},
  {name:"1. FC Kaiserslautern",kurz:"FCK",liga:2,ansehen:55,plaetze:49327,fans:42000,farbe:"#c8102e"},
  {name:"1. FC Nürnberg",kurz:"FCN",liga:2,ansehen:54,plaetze:50000,fans:36000,farbe:"#a3112d"},
  {name:"VfL Bochum",kurz:"BOC",liga:2,ansehen:53,plaetze:26000,fans:25500,farbe:"#005ca9"},
  {name:"SV Darmstadt 98",kurz:"D98",liga:2,ansehen:51,plaetze:17000,fans:17000,farbe:"#004e9e"},
  {name:"Karlsruher SC",kurz:"KSC",liga:2,ansehen:51,plaetze:34302,fans:28000,farbe:"#0057a8"},
  {name:"Holstein Kiel",kurz:"KSV",liga:2,ansehen:50,plaetze:15034,fans:14500,farbe:"#0b4ea2"},
  {name:"1. FC Magdeburg",kurz:"FCM",liga:2,ansehen:49,plaetze:27250,fans:24000,farbe:"#0055a5"},
  {name:"Arminia Bielefeld",kurz:"DSC",liga:2,ansehen:49,plaetze:26515,fans:24500,farbe:"#004f9f"},
  {name:"Dynamo Dresden",kurz:"SGD",liga:2,ansehen:49,plaetze:32000,fans:30000,farbe:"#fdd100"},
  {name:"Eintracht Braunschweig",kurz:"EBS",liga:2,ansehen:47,plaetze:23325,fans:21000,farbe:"#f6d200"},
  {name:"SpVgg Greuther Fürth",kurz:"SGF",liga:2,ansehen:47,plaetze:16626,fans:11000,farbe:"#00843d"},
  {name:"VfL Osnabrück",kurz:"OSN",liga:2,ansehen:45,plaetze:15741,fans:15000,farbe:"#6a2c91"},
  {name:"FC Energie Cottbus",kurz:"FCE",liga:2,ansehen:45,plaetze:22528,fans:15500,farbe:"#e30613"}
];

// Erfundene Amateurklubs, die im DFB-Pokal mitspielen (28 Stück, zusammen mit den 36 Profivereinen 64 Teams).
const AMATEURE=["TSV Rheinau","SV Hohenfeld","FC Eintracht Lohberg","SpVgg Kirchheide","VfR Altmühl","TuS Bergen-Ost","SC Wiesental","FSV Lindenau","FC Ahrweiler-Süd","SV Moorbach","TSG Steinfurt-Land","FC Viktoria Hellweg","SV Blau-Weiß Elmshagen","TuS Nordenham-Mitte","VfB Grünstadt","SV Germania Kalkreuth","FC Teutonia Wendel","SC Hafenstadt","TSV Bad Hollerbach","SpVgg Unterried","SV Rot-Weiß Ostheim","FC Sankt Albrecht","VfL Heidekamp","TuS Oberwinter","SV Seeblick","FC Haldenau","SV Fortuna Talheim","FC Wacker Rennsteig"];

// Erfundene Sponsoren für die Trikotsponsor-Angebote.
const SPONSOREN=["Rheinwerk Energie","Nordsee Versicherung","Alpentaler Brauerei","Hansa Logistik","Brückner Bau","SolarTec Süd","Kaiser Mobilfunk","Waldquell Mineralwasser","Elbtal Bank","Mainfranken Autohaus","Ostwind Reisen","Lindner Pharma"];
