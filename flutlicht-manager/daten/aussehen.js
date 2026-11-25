// Aussehen der Spieler (K39 §3.2, W5e5): Farben und Gewichte für die Comic-Gesichter aus dem Baukasten (js/gesichter.js).
// Deine Vorgabe vom 18.11. (PLAN §4): Haut- und Haarfarbe werden nach Herkunftsregion gewichtet gewürfelt, nicht fest zugeordnet. Jede Farbe ist überall
// möglich (kein Gewicht ist null), nur unterschiedlich wahrscheinlich. Die Gewichte sind Spielwerte, von popolupo geschätzt (vorläufig, nicht recherchiert),
// und keine Aussage über Menschen. Später können echte Spieler eigene Felder bekommen (PLAN §4, Schritt A1), die dann vor dem Würfeln gelten.
// Region je Nation nach Geografie (FIFA-Kürzel wie in daten/nationen.js). Fehlt eine Nation, gilt „welt“ (alle Farben gleich wahrscheinlich).
// Bearbeiten: Werte hier ändern und das Spiel neu laden. Das Gesicht eines Spielers ergibt sich jedes Mal neu aus diesen Werten und seinem Namen.
const AUSSEHEN={
  haut:['#f6d7c3','#eec1a1','#e0a983','#c98e66','#a8714b','#8a5a3b','#6b4430','#4a2f22'],   // acht Hauttöne, hell bis dunkel
  haar:['#1c1a19','#3b2a20','#6a4a32','#9a6a3e','#c99a55','#e6cf8f','#a4462a'],             // schwarz, dunkelbraun, braun, hellbraun, dunkelblond, blond, rot
  grau:'#a9a9a9',grauAb:33,grauJeJahr:0.08,                                                  // graue Haare ab 33 Jahren, je Jahr 8 Prozentpunkte wahrscheinlicher
  regionen:{   // Gewichte für Haut (8) und Haar (7), Reihenfolge wie oben
    europa:               {haut:[30,30,18,9,5,4,2,2],   haar:[10,28,26,14,10,8,4]},
    nordafrika_nahost:    {haut:[6,14,26,26,14,8,4,2],  haar:[48,32,12,4,2,1,1]},
    subsahara:            {haut:[2,2,3,5,10,20,30,28],  haar:[80,14,3,1,1,0.5,0.5]},
    suedamerika:          {haut:[12,18,20,18,12,9,6,5], haar:[40,34,14,5,4,2,1]},
    mittelamerika_karibik:{haut:[6,10,16,20,16,14,10,8],haar:[55,30,9,3,2,0.5,0.5]},
    nordamerika:          {haut:[20,20,14,12,10,10,8,6],haar:[22,28,22,12,8,6,2]},
    ostasien:             {haut:[18,34,26,12,5,2,2,1],  haar:[85,12,2,0.5,0.25,0.15,0.1]},
    suedostasien:         {haut:[6,14,26,28,14,7,3,2],  haar:[82,14,2,1,0.5,0.25,0.25]},
    zentralasien:         {haut:[8,16,22,24,16,9,3,2],  haar:[70,22,5,1.5,1,0.25,0.25]},
    ozeanien:             {haut:[24,22,14,12,10,8,6,4], haar:[26,28,20,10,8,6,2]},
    welt:                 {haut:[1,1,1,1,1,1,1,1],      haar:[1,1,1,1,1,1,1]}
  },
  region:{
    europa:'ESP FRA ENG POR BEL NED SUI GER CRO ITA NOR DEN AUT SWE RUS UKR POL HUN WAL GRE SCO SRB SVK CZE SVN IRL BIH ROU NIR ALB MKD ISL GEO FIN KVX MNE BUL BLR LUX ARM EST CYP FRO AZE LVA LTU MDA MLT AND GIB LIE SMR',
    nordafrika_nahost:'MAR EGY ALG TUN IRN KSA IRQ UAE QAT JOR OMA SYR PLE BHR LBN LBY MTN SDN TUR ISR',
    subsahara:'SEN CIV NGA COD CMR MLI RSA BFA CPV GHA GUI ANG GAB UGA BEN ZAM MOZ EQG MAD COM GAM NIG KEN TAN RWA TOG NAM GNB ZIM SLE MWI CGO BDI BOT CTA LBR ETH LES',
    suedamerika:'ARG BRA URU ECU PAR VEN CHI PER COL BOL SUR',
    mittelamerika_karibik:'MEX PAN CRC HON JAM HAI GUA SLV TRI CUW DOM NCA',
    nordamerika:'USA CAN',
    ostasien:'JPN KOR CHN',
    suedostasien:'THA VIE IDN PHI',
    zentralasien:'UZB TJK KGZ KAZ',
    ozeanien:'AUS NZL'
  }
};
