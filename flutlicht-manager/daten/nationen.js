// Nationen (Konzepte K32 §3.2, K13, K03): eine Zeile je Nation: [Kürzel, Name, Rang, Sprache]
//   Kürzel: FIFA-Kürzel, steht beim Spieler im Feld nat (daten/spieler.js, fünfte Spalte).
//   Rang: Platz in der FIFA-Weltrangliste der Männer vom 7. Oktober 2026 (abgerufen am 11.11.2026 über die Verbandsseiten der englischen Wikipedia:
//         UEFA, CONMEBOL, CAF, AFC, CONCACAF; Plätze 1–20 gegengeprüft mit der deutschen Wikipedia). Daraus wird später die Schwelle für Nominierungen (K13 §5).
//         Bolivien (78) ist erschlossen (einzige Lücke bis Platz 115). Mit „geschätzt“ markierte Ränge standen nicht in den abgerufenen Tabellen.
//   Sprache: Hauptsprache im Fußball-Alltag, für Landsleute und gemeinsame Sprache (K03 §3.4, K14) und für die Namen erzeugter Spieler (daten/namen.js).
// Die Tabelle enthält die Nationen, deren Rang abgerufen wurde, und alle, die im Spiel vorkommen. Weitere Nationen lassen sich jederzeit anhängen.
// Bearbeiten: Werte hier ändern und das Spiel neu laden. Das wirkt ab der nächsten neuen Karriere.
const NATIONEN=[
  ["ESP","Spanien",1,"es"],["ARG","Argentinien",2,"es"],["FRA","Frankreich",3,"fr"],["ENG","England",4,"en"],["POR","Portugal",5,"pt"],
  ["BRA","Brasilien",6,"pt"],["MAR","Marokko",7,"ar"],["BEL","Belgien",8,"nl"],["NED","Niederlande",9,"nl"],["MEX","Mexiko",10,"es"],
  ["COL","Kolumbien",11,"es"],["SUI","Schweiz",12,"de"],["GER","Deutschland",13,"de"],["CRO","Kroatien",14,"bks"],["ITA","Italien",15,"it"],
  ["USA","Vereinigte Staaten",16,"en"],["JPN","Japan",17,"ja"],["SEN","Senegal",18,"fr"],["NOR","Norwegen",19,"no"],["URU","Uruguay",20,"es"],
  ["DEN","Dänemark",21,"da"],["AUT","Österreich",22,"de"],["IRN","Iran",23,"fa"],["ECU","Ecuador",24,"es"],["EGY","Ägypten",25,"ar"],
  ["AUS","Australien",26,"en"],["CAN","Kanada",27,"en"],["ALG","Algerien",28,"ar"],["CIV","Elfenbeinküste",29,"fr"],["NGA","Nigeria",30,"en"],
  ["TUR","Türkei",31,"tr"],["KOR","Südkorea",32,"ko"],["PAR","Paraguay",33,"es"],["SWE","Schweden",34,"sv"],["RUS","Russland",35,"ru"],
  ["UKR","Ukraine",36,"uk"],["POL","Polen",37,"pl"],["HUN","Ungarn",38,"hu"],["WAL","Wales",39,"en"],["COD","DR Kongo",40,"fr"],
  ["GRE","Griechenland",41,"el"],["CMR","Kamerun",42,"fr"],["SCO","Schottland",43,"en"],["SRB","Serbien",44,"bks"],["SVK","Slowakei",45,"sk"],
  ["PAN","Panama",46,"es"],["MLI","Mali",47,"fr"],["RSA","Südafrika",48,"en"],["VEN","Venezuela",49,"es"],["CHI","Chile",50,"es"],
  ["CZE","Tschechien",51,"cs"],["SVN","Slowenien",52,"sl"],["PER","Peru",53,"es"],["CRC","Costa Rica",54,"es"],["KSA","Saudi-Arabien",55,"ar"],
  ["IRL","Irland",56,"en"],["BIH","Bosnien und Herzegowina",57,"bks"],["ROU","Rumänien",58,"ro"],["UZB","Usbekistan",59,"uz"],["QAT","Katar",60,"ar"],
  ["TUN","Tunesien",61,"ar"],["BFA","Burkina Faso",62,"fr"],["IRQ","Irak",63,"ar"],["NIR","Nordirland",64,"en"],["UAE","Vereinigte Arabische Emirate",65,"ar"],
  ["ALB","Albanien",66,"sq"],["HON","Honduras",67,"es"],["CPV","Kap Verde",68,"pt"],["JAM","Jamaika",69,"en"],["GHA","Ghana",70,"en"],
  ["MKD","Nordmazedonien",71,"mk"],["JOR","Jordanien",72,"ar"],["ISL","Island",73,"is"],["GEO","Georgien",74,"ka"],["FIN","Finnland",75,"fi"],
  ["KVX","Kosovo",76,"sq"],["ISR","Israel",77,"he"],["BOL","Bolivien",78,"es"],["MNE","Montenegro",79,"bks"],["CUW","Curaçao",80,"nl"],
  ["OMA","Oman",81,"ar"],["GUI","Guinea",82,"fr"],["ANG","Angola",83,"pt"],["HAI","Haiti",84,"fr"],["GAB","Gabun",85,"fr"],
  ["SYR","Syrien",86,"ar"],["UGA","Uganda",87,"en"],["NZL","Neuseeland",88,"en"],["BEN","Benin",89,"fr"],["BUL","Bulgarien",90,"bg"],
  ["ZAM","Sambia",91,"en"],["PLE","Palästina",92,"ar"],["THA","Thailand",93,"th"],["BLR","Belarus",94,"ru"],["GUA","Guatemala",95,"es"],
  ["CHN","China",96,"zh"],["BHR","Bahrain",97,"ar"],["MOZ","Mosambik",98,"pt"],["VIE","Vietnam",99,"vi"],["TJK","Tadschikistan",100,"tg"],
  ["LUX","Luxemburg",101,"de"],["SLV","El Salvador",102,"es"],["EQG","Äquatorialguinea",103,"es"],["KGZ","Kirgisistan",104,"ky"],["TRI","Trinidad und Tobago",105,"en"],
  ["MAD","Madagaskar",106,"fr"],["COM","Komoren",107,"fr"],["ARM","Armenien",108,"hy"],["GAM","Gambia",109,"en"],["MTN","Mauretanien",110,"ar"],
  ["NIG","Niger",111,"fr"],["LBN","Libanon",112,"ar"],["LBY","Libyen",113,"ar"],["KEN","Kenia",114,"en"],["TAN","Tansania",115,"en"],
  ["KAZ","Kasachstan",117,"ru"],["SDN","Sudan",118,"ar"],["RWA","Ruanda",119,"en"],["TOG","Togo",120,"fr"],["EST","Estland",122,"et"],
  ["NAM","Namibia",123,"en"],["GNB","Guinea-Bissau",124,"pt"],["CYP","Zypern",125,"el"],["FRO","Färöer",126,"da"],["AZE","Aserbaidschan",127,"az"],
  ["SUR","Suriname",128,"nl"],["ZIM","Simbabwe",129,"en"],["SLE","Sierra Leone",130,"en"],["MWI","Malawi",131,"en"],["CGO","Kongo",132,"fr"],
  ["DOM","Dominikanische Republik",135,"es"],["NCA","Nicaragua",137,"es"],["BDI","Burundi",140,"fr"],["BOT","Botswana",141,"en"],["LVA","Lettland",143,"lv"],
  ["CTA","Zentralafrikanische Republik",145,"fr"],["LBR","Liberia",146,"en"],["ETH","Äthiopien",147,"am"],["LTU","Litauen",148,"lt"],["LES","Lesotho",150,"en"],
  ["MDA","Moldau",158,"ro"],["MLT","Malta",160,"en"],["AND","Andorra",175,"es"],["GIB","Gibraltar",201,"en"],["LIE","Liechtenstein",207,"de"],
  ["SMR","San Marino",211,"it"],
  ["IDN","Indonesien",121,"id"], // geschätzt
  ["PHI","Philippinen",136,"en"]  // geschätzt
];
