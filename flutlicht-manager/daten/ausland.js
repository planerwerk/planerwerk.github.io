// Auslandsvereine für den Auslandspool (Konzept K32 §3.1, entschieden 8.11.): echte Vereinsnamen, Spieler und Kader erzeugt das Spiel.
// Eine Zeile je Verein: [Name, Land, Stufe, Ansehen, Finanzkraft]
//   Name: echter Verein der höchsten Liga des Landes in der Saison 2026/27 (Schweden und Norwegen: Saison 2026), in der im Deutschen üblichen Schreibweise.
//   Land: Kürzel aus daten/nationen.js, das Land der Liga (der FC Vaduz aus Liechtenstein spielt in der Schweizer Liga).
//   Stufe: 1 Spitze, 2 Mitte, 3 unten, innerhalb der eigenen Liga. Bestimmt die Größe des Kerns (REGELN.welt.ausland.kern).
//   Ansehen: 0–99, dieselbe Skala wie in daten/vereine.js (Bayern 95). Daraus ergibt sich die Stärke der erzeugten Spieler.
//   Finanzkraft: 0–99. Daraus ergeben sich Ablöseforderung und Transferbudget.
// Gepflegt werden nur Name und Land. Stufe, Ansehen und Finanzkraft sind grobe Schätzungen und dürfen hier angepasst werden.
// Quelle der Vereinslisten: englische Wikipedia, Saisonartikel der Ligen 2026/27 (Premier League, La Liga, Serie A, Ligue 1, Eredivisie, Primeira Liga,
// Belgian Pro League, Austrian Bundesliga, Swiss Super League, Süper Lig, Danish Superliga, Ekstraklasa, Czech First League, HNL, Serbian SuperLiga,
// Ukrainian Premier League) und 2026 (Allsvenskan, Eliteserien), abgerufen am 11.11.2026. Zehn Länder sind vollständig, Skandinavien und Osteuropa
// sind eine Auswahl der größten Vereine aus den geprüften Ligen.
// Bearbeiten: Werte hier ändern und das Spiel neu laden. Das wirkt ab der nächsten neuen Karriere.
const AUSLAND_GRUPPEN={SKA:'Skandinavien',OST:'Osteuropa'};                                  // Länder, die im Spiel zu einer Gruppe zusammengefasst sind
const AUSLAND_GRUPPE={DEN:'SKA',SWE:'SKA',NOR:'SKA',POL:'OST',CZE:'OST',CRO:'OST',SRB:'OST',UKR:'OST'};
const AUSLAND=[
  // England, Premier League 2026/27
  ["Manchester City","ENG",1,93,97],["FC Arsenal","ENG",1,93,95],["FC Liverpool","ENG",1,93,95],["FC Chelsea","ENG",1,88,95],["Manchester United","ENG",1,86,94],
  ["Tottenham Hotspur","ENG",1,84,90],["Newcastle United","ENG",1,84,92],["Aston Villa","ENG",1,83,86],["Brighton & Hove Albion","ENG",2,78,80],["Nottingham Forest","ENG",2,77,78],
  ["Crystal Palace","ENG",2,76,76],["AFC Bournemouth","ENG",2,76,76],["FC Brentford","ENG",2,75,75],["FC Fulham","ENG",2,75,75],["FC Everton","ENG",2,75,78],
  ["Leeds United","ENG",3,71,74],["AFC Sunderland","ENG",3,70,72],["Ipswich Town","ENG",3,68,70],["Coventry City","ENG",3,67,68],["Hull City","ENG",3,66,66],
  // Spanien, La Liga 2026/27
  ["Real Madrid","ESP",1,97,96],["FC Barcelona","ESP",1,95,90],["Atlético Madrid","ESP",1,88,84],["Athletic Bilbao","ESP",1,81,72],["FC Villarreal","ESP",1,80,70],
  ["Betis Sevilla","ESP",2,79,68],["Real Sociedad San Sebastián","ESP",2,78,68],["FC Sevilla","ESP",2,76,64],["FC Valencia","ESP",2,74,60],["Celta Vigo","ESP",2,73,58],
  ["CA Osasuna","ESP",2,71,54],["Rayo Vallecano","ESP",2,71,50],["FC Getafe","ESP",3,69,50],["Espanyol Barcelona","ESP",3,69,52],["Deportivo Alavés","ESP",3,67,46],
  ["FC Elche","ESP",3,66,44],["UD Levante","ESP",3,65,44],["Deportivo La Coruña","ESP",3,66,46],["FC Málaga","ESP",3,65,44],["Racing Santander","ESP",3,65,44],
  // Italien, Serie A 2026/27
  ["Inter Mailand","ITA",1,90,82],["SSC Neapel","ITA",1,87,78],["Juventus Turin","ITA",1,87,84],["AC Mailand","ITA",1,86,82],["Atalanta Bergamo","ITA",1,83,70],
  ["AS Rom","ITA",1,83,74],["Lazio Rom","ITA",2,79,64],["AC Florenz","ITA",2,78,64],["FC Bologna","ITA",2,78,62],["Como 1907","ITA",2,74,70],
  ["FC Turin","ITA",2,73,56],["Udinese Calcio","ITA",2,71,52],["CFC Genua","ITA",2,70,50],["Parma Calcio","ITA",3,69,52],["Cagliari Calcio","ITA",3,68,48],
  ["US Sassuolo","ITA",3,69,50],["US Lecce","ITA",3,66,42],["FC Venedig","ITA",3,65,44],["Frosinone Calcio","ITA",3,63,40],["AC Monza","ITA",3,64,46],
  // Frankreich, Ligue 1 2026/27
  ["Paris Saint-Germain","FRA",1,95,97],["Olympique Marseille","FRA",1,83,74],["AS Monaco","FRA",1,82,74],["Olympique Lyon","FRA",1,80,66],["OSC Lille","FRA",1,80,66],
  ["OGC Nizza","FRA",2,77,66],["RC Lens","FRA",2,77,60],["Stade Rennes","FRA",2,76,66],["Racing Straßburg","FRA",2,76,66],["FC Toulouse","FRA",2,71,52],
  ["Stade Brest","FRA",2,71,48],["Paris FC","FRA",2,70,66],["AJ Auxerre","FRA",3,67,44],["SCO Angers","FRA",3,65,40],["Le Havre AC","FRA",3,65,40],
  ["FC Lorient","FRA",3,67,46],["ES Troyes AC","FRA",3,63,42],["Le Mans FC","FRA",3,61,36],
  // Niederlande, Eredivisie 2026/27
  ["PSV Eindhoven","NED",1,82,62],["Ajax Amsterdam","NED",1,81,62],["Feyenoord Rotterdam","NED",1,81,60],["AZ Alkmaar","NED",1,75,50],["FC Twente Enschede","NED",2,73,46],
  ["FC Utrecht","NED",2,72,46],["NEC Nijmegen","NED",2,68,38],["SC Heerenveen","NED",2,67,36],["FC Groningen","NED",2,67,36],["Go Ahead Eagles Deventer","NED",2,67,34],
  ["Sparta Rotterdam","NED",2,65,32],["Fortuna Sittard","NED",3,63,30],["PEC Zwolle","NED",3,62,28],["Willem II Tilburg","NED",3,62,28],["Excelsior Rotterdam","NED",3,61,26],
  ["ADO Den Haag","NED",3,62,28],["SC Cambuur Leeuwarden","NED",3,60,26],["SC Telstar","NED",3,59,24],
  // Portugal, Primeira Liga 2026/27
  ["Sporting Lissabon","POR",1,84,64],["Benfica Lissabon","POR",1,84,68],["FC Porto","POR",1,83,64],["Sporting Braga","POR",1,76,48],["Vitória Guimarães","POR",2,71,38],
  ["FC Famalicão","POR",2,67,34],["Gil Vicente FC","POR",2,66,30],["Moreirense FC","POR",2,65,28],["GD Estoril Praia","POR",2,65,30],["CD Santa Clara","POR",2,65,28],
  ["Rio Ave FC","POR",2,65,30],["Casa Pia AC","POR",3,63,26],["FC Arouca","POR",3,63,26],["CD Nacional Funchal","POR",3,62,24],["Estrela Amadora","POR",3,61,24],
  ["FC Alverca","POR",3,61,26],["Marítimo Funchal","POR",3,62,26],["Académico de Viseu","POR",3,59,22],
  // Belgien, Pro League 2026/27
  ["FC Brügge","BEL",1,79,56],["Union Saint-Gilloise","BEL",1,77,48],["RSC Anderlecht","BEL",1,75,52],["KRC Genk","BEL",1,75,50],["Royal Antwerpen","BEL",1,73,50],
  ["KAA Gent","BEL",2,72,46],["Standard Lüttich","BEL",2,69,40],["KV Mechelen","BEL",2,66,32],["Sporting Charleroi","BEL",2,66,32],["KVC Westerlo","BEL",2,65,34],
  ["OH Leuven","BEL",2,65,36],["VV St. Truiden","BEL",2,64,30],["Cercle Brügge","BEL",2,64,32],["SV Zulte Waregem","BEL",3,62,28],["RAAL La Louvière","BEL",3,60,26],
  ["SK Beveren","BEL",3,60,26],["KV Kortrijk","BEL",3,61,28],["Lommel SK","BEL",3,60,30],
  // Österreich, Bundesliga 2026/27
  ["Red Bull Salzburg","AUT",1,77,54],["Sturm Graz","AUT",1,74,42],["Rapid Wien","AUT",1,71,40],["LASK","AUT",2,69,36],["Austria Wien","AUT",2,68,34],
  ["Wolfsberger AC","AUT",2,67,30],["TSV Hartberg","AUT",3,60,22],["SCR Altach","AUT",3,59,22],["WSG Tirol","AUT",3,59,20],["Grazer AK","AUT",3,58,20],
  ["SV Ried","AUT",3,59,22],["Austria Lustenau","AUT",3,57,20],
  // Schweiz, Super League 2026/27
  ["Young Boys Bern","SUI",1,74,44],["FC Basel","SUI",1,74,44],["FC Lugano","SUI",2,68,34],["Servette Genf","SUI",2,68,34],["FC Zürich","SUI",2,67,34],
  ["FC St. Gallen","SUI",2,67,32],["FC Luzern","SUI",2,66,30],["Lausanne-Sport","SUI",2,65,32],["FC Sion","SUI",2,64,30],["Grasshopper Club Zürich","SUI",3,62,28],
  ["FC Thun","SUI",3,63,26],["FC Vaduz","SUI",3,56,18],
  // Türkei, Süper Lig 2026/27
  ["Galatasaray Istanbul","TUR",1,83,66],["Fenerbahçe Istanbul","TUR",1,82,66],["Beşiktaş Istanbul","TUR",1,78,58],["Trabzonspor","TUR",1,75,50],["Başakşehir Istanbul","TUR",2,72,46],
  ["Samsunspor","TUR",2,70,40],["Göztepe Izmir","TUR",2,68,38],["Kasımpaşa Istanbul","TUR",2,64,32],["Konyaspor","TUR",2,64,30],["Alanyaspor","TUR",2,64,30],
  ["Çaykur Rizespor","TUR",2,64,30],["Gaziantep FK","TUR",2,63,30],["Eyüpspor","TUR",3,63,30],["Kocaelispor","TUR",3,62,30],["Gençlerbirliği Ankara","TUR",3,62,28],
  ["Erzurumspor FK","TUR",3,58,22],["Amed SK","TUR",3,59,24],["Çorum FK","TUR",3,58,22],
  // Skandinavien: Dänemark (Superliga 2026/27), Schweden (Allsvenskan 2026), Norwegen (Eliteserien 2026)
  ["FC Kopenhagen","DEN",1,76,46],["FC Midtjylland","DEN",1,74,44],["Brøndby IF","DEN",1,70,38],["FC Nordsjælland","DEN",2,68,34],["Aarhus GF","DEN",2,68,34],
  ["Silkeborg IF","DEN",3,63,26],["Malmö FF","SWE",1,72,38],["Hammarby IF","SWE",2,66,30],["Djurgårdens IF","SWE",2,66,30],["AIK Solna","SWE",2,65,30],
  ["IF Elfsborg","SWE",2,65,28],["BK Häcken","SWE",2,65,28],["Mjällby AIF","SWE",2,65,24],["FK Bodø/Glimt","NOR",1,76,42],["Molde FK","NOR",2,68,34],
  ["Rosenborg Trondheim","NOR",2,67,32],["Brann Bergen","NOR",2,68,32],["Viking Stavanger","NOR",2,67,30],
  // Osteuropa: Polen (Ekstraklasa), Tschechien (Erste Liga), Kroatien (HNL), Serbien (SuperLiga), Ukraine (Premjer-Liha), jeweils 2026/27
  ["Legia Warschau","POL",1,70,36],["Lech Posen","POL",1,70,36],["Raków Częstochowa","POL",1,68,34],["Jagiellonia Białystok","POL",2,67,28],["Pogoń Stettin","POL",2,64,28],
  ["Slavia Prag","CZE",1,76,44],["Sparta Prag","CZE",1,75,44],["Viktoria Pilsen","CZE",1,73,38],["Baník Ostrau","CZE",2,65,26],
  ["Dinamo Zagreb","CRO",1,74,40],["Hajduk Split","CRO",2,68,30],["HNK Rijeka","CRO",2,67,28],
  ["Roter Stern Belgrad","SRB",1,74,40],["Partizan Belgrad","SRB",2,67,28],["Schachtar Donezk","UKR",1,75,42],["Dynamo Kiew","UKR",1,71,36]
];
