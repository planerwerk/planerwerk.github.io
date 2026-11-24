// Flutlicht Manager – alle Stellschrauben (Konzept K33).
//
// Ändern: Wert anpassen, Datei speichern, Spiel neu laden. Das gilt sofort, auch für laufende Karrieren.
// Einheiten: Geld in Euro, Wahrscheinlichkeiten von 0 bis 1, Zeiten stehen jeweils dabei.
// Schreibweise [a, b] heißt: zufällig ganzzahlig von a bis b.
// Stärke 1–99 (mit Nachkommastellen, angezeigt gerundet), Form 0–20 (Mitte 10), Frische 0–100 %, Kondition 0–100, Ansehen eines Vereins 0–99.
const REGELN={

  spielstand:{
    version:4,                       // Version des Spielstands (4 = Spielermodell K03: Frische, Kondition, Form 0–20, Entwicklung je Spieltag)
    schluessel:'flutlicht-manager-v4', // Speicherplatz im Browser
    alteSchluessel:['flutlicht-manager-v1','flutlicht-manager-v2','flutlicht-manager-v3'], // Spielstände älterer Testversionen, werden beim Start gelöscht
    nachrichtenMax:80                // so viele Nachrichten bleiben im Posteingang
  },

  kalender:{
    maxSprung:7,                     // „Tag beenden“ springt höchstens so viele Tage weit
    wochenTag:1,                     // an diesem Wochentag laufen die Wochenwerte (0 = Sonntag, 1 = Montag)
    angebotTage:14,                  // so viele Tage gilt ein Angebot für einen deiner Spieler
    vertragsWarnungNachSpieltag:25,  // nach diesem Ligaspieltag warnt das Büro vor auslaufenden Verträgen
    hinweisVertraegeAbSpieltag:18,   // ab so vielen gespielten Ligaspieltagen zeigt das Büro auslaufende Verträge
    erinnerungVertragTage:7,         // so viele Tage vor Saisonende erinnert „Tag beenden“ an auslaufende Verträge
    // Anstoßzeiten für Spieltage ohne feste Ansetzung (und alle Spieltage späterer Saisons), je Liga.
    // [Tag, Uhrzeit, Anzahl Spiele], in der Reihenfolge, in der die attraktivsten Spiele verteilt werden.
    // Wochenende: Fr/Sa/So rund um den Samstag. Wochenmitte: Di/Mi. Der letzte Spieltag läuft zeitgleich.
    anstoss:{
      1:{wochenende:[['Sa','18:30',1],['So','17:30',1],['Fr','20:30',1],['So','15:30',1],['Sa','15:30',5]],mitte:[['Mi','20:30',4],['Di','20:30',3],['Mi','18:30',1],['Di','18:30',1]],letzter:'15:30'},
      2:{wochenende:[['Sa','20:30',1],['Fr','18:30',2],['So','13:30',3],['Sa','13:00',3]],mitte:[['Di','18:30',4],['Mi','18:30',5]],letzter:'15:30'},
      3:{wochenende:[['Sa','16:30',1],['Fr','19:00',1],['So','16:30',1],['So','19:30',1],['So','13:30',1],['Sa','14:00',5]],mitte:[['Di','19:00',5],['Mi','19:00',5]],letzter:'13:30'}},
    attraktivZufall:15,              // Zufall bei der Verteilung auf die Anstoßzeiten (in Ansehen-Punkten)
    erinnerungen:{frist:'Angebot läuft heute ab',aufstellung:'Startelf hat Ausfälle',sponsor:'Kein Sponsor gewählt',vertrag:'Verträge laufen aus',versprechen:'Versprechen droht zu kippen',vorbereitung:'Punkte vor dem Saisonstart offen (höchstens einmal je Woche)',deadline:'Halt am letzten Tag des Transferfensters (Deadline Day)',gelbsperre:'Gelbsperre droht vor einem Derby oder Spitzenspiel',plan:'Trainingsplan passt nicht (englische Woche, Belastungssprung)',spielfrei:'Spielfreie Woche ohne Testspiel (in der Saison)',lernplatz:'Platz im Einzeltraining frei'} // abschaltbar im Menü; vorbereitung seit U14 (K12b)
  },

  welt:{
    startSaison:2026,
    startVertrauen:60,               // Vertrauen des Vorstands zu Beginn, 0–100
    startTraining:1,                 // 0 locker, 1 normal, 2 hart
    startZiel:9,                     // Platzhalter, wird sofort aus dem Ansehen berechnet
    startJugend:2,                   // Stufe der Jugendarbeit (1–5)
    startFormationen:['4-4-2','4-3-3','4-2-3-1','3-5-2'], // daraus wählt jeder Verein zufällig
    // Startkonto = basis × e^(steigung × (Ansehen − mitte)), gerundet (K23c, vorläufig): etwa ein Fünftel der Jahreseinnahmen,
    // Ansehen 95 etwa 127 Mio. €, 71 etwa 27 Mio. €, 52 etwa 8 Mio. €, 39 etwa 3 Mio. €. Vorher basis + Ansehen² × 2.500 €.
    konto:{basis:25e6,steigung:0.065,mitte:70,runden:1e5},
    ticket:{basis:15,jeAnsehen:0.25},    // Startpreis = basis + Ansehen × jeAnsehen (€)
    grund:{basis:48,jeAnsehen:0.4},      // Grundstärke erfundener Spieler = basis + Ansehen × jeAnsehen
    kaderVollAb:20,                  // ab so vielen echten Spielern gilt das Soll „voll“
    sollVoll:{TW:3,AB:6,MF:6,ST:3},  // Mindestzahl je Position, aufgefüllt mit erfundenen Spielern
    sollDuenn:{TW:3,AB:8,MF:8,ST:5},
    stammplaetze:{TW:1,AB:4,MF:4,ST:2}, // so viele aufgefüllte Spieler sind Stammspieler-Niveau
    stammStreuung:[-3,3],            // Stammspieler: Grundstärke + Streuung
    ersatzAbschlag:5,                // Ersatz: Grundstärke − Abschlag + Streuung
    ersatzStreuung:[-5,3],
    ersatzAlter:[19,32],
    jungeEchte:{bisAlter:0,talent:[0,0]}, // ersetzt durch spieler.talent (gilt jetzt für echte und erfundene Spieler)
    nachwuchs:{wennUnter:22,anzahl:2,positionen:['AB','MF','ST'],alter:[17,19],abschlag:15,streuung:[-3,3],talent:[-4,8]},
    vereinslose:{anzahl:45,positionen:['TW','AB','AB','MF','MF','ST','ST'],alter:[21,33],staerke:[56,72]},
    amateurStaerke:[46,56],          // Stärke der Amateurklubs im Pokal (4. bis 6. Liga), jede Saison neu
    // Nationalität (K03, K32 §3.2, U9b). Echte Spieler: fünfte Spalte in daten/spieler.js. Erfundene Spieler der deutschen Vereine: aus dem Nachnamen
    // (daten/namen.js, NACHNAMEN_HERKUNFT), fest je Spieler und ohne Zufallsstrom. Deutscher Nachname: mit 93 % Deutschland, sonst eine Nation aus „sonst“.
    // Fremdsprachiger Nachname: mit 50 % das Land der Herkunft, sonst Deutschland.
    nation:{heimat:'GER',deutscherName:0.93,fremderName:0.5,sonst:['AUT','SUI','DEN','NED','POL','FRA','CRO','USA']},
    // Auslandspool (K32 §3.1, §11, U9b): Vereine aus daten/ausland.js, je Verein ein Kern erzeugter Spieler. Der übrige Kader ist nur die Grundstärke aus dem Ansehen (welt.grund).
    ausland:{
      kern:{1:10,2:8,3:6},             // Kernspieler je Verein nach Stufe (1 Spitze, 2 Mitte, 3 unten)
      positionen:['TW','AB','MF','ST','AB','MF','ST','MF','AB','ST'], // Positionen im Kern, der Reihe nach
      talente:{1:2,2:2,3:1},           // so viele Plätze im Kern gehören jungen Talenten (bis 21 Jahre)
      staerke:[-3,5],                  // Kernspieler: Grundstärke des Vereins + Streuung
      potMax:6,                        // Talent (pot) eines Kernspielers höchstens Grundstärke + 6
      alter:[22,31],
      talent:{alter:[17,20],abschlag:[5,11],pot:[1,8],jungBis:21}, // Talent: Grundstärke − Abschlag, Talent (pot) = Grundstärke + pot
      einheimisch:{1:0.45,2:0.6,3:0.72}, // Anteil der Spieler aus dem Land des Vereins je Stufe (überwiegend aus dem Land, K32 §5.2)
      legionaere:{BRA:8,ARG:6,FRA:7,ESP:5,POR:4,NED:4,BEL:3,ENG:2,ITA:2,GER:4,AUT:2,SUI:2,DEN:3,SWE:2,NOR:2,CRO:3,SRB:3,POL:2,CZE:1,UKR:2,TUR:2,
        SEN:3,CIV:3,MLI:2,CMR:2,GUI:1,COD:2,NGA:4,GHA:3,MAR:3,ALG:2,JPN:2,USA:2,URU:2,COL:3}, // Gewichte für die Nation der übrigen Spieler
      praxis:{stamm:80,talent:45},     // angenommene Spielpraxis (bleibt fest, Poolspieler haben keine Spiele)
      formZufall:0.5,                  // Form wandert je Woche um bis zu ±0,5 und zieht wie überall zur Mitte
      raus:7,rausAbAlter:24,           // im Sommer: wer ab diesem Alter mehr als 7 unter der Grundstärke seines Vereins liegt, fällt aus dem Kern
      altRaus:{ab:31,jeJahr:0.12},     // im Sommer: ab 31 fällt ein Spieler mit (Alter − 30) × 12 % aus dem Kern (Bank, kleinere Liga), zusätzlich zum Karriereende
      aufstieg:{ab:6,chance:0.5,fenster:3}, // im Sommer: wer mehr als 6 darüber liegt, wechselt mit 50 % zu einem größeren Auslandsverein (dessen Grundstärke höchstens 3 unter seiner Stärke)
      forderung:[0.8,0.6],             // Ablöseforderung = Marktwert × (0,8 + 0,6 × Finanzkraft/100): arme Vereine verkaufen günstiger (K32 §6)
      budget:25000,                    // Transferbudget eines Auslandsvereins = Finanzkraft² × 25.000 € (Spielwert, seit K23c doppelt so hoch wie vorher, weil gute Spieler teurer sind)
      angebote:{anteil:0.3,niveau:5},  // Anteil der Angebote für deine Spieler, die aus dem Ausland kommen; der Spieler darf höchstens 5 unter der Grundstärke des Käufers liegen
      // Abwanderung (K32 §8 „Bundesliga verliert je Sommer Spieler an reiche Auslandsgruppen“, T1.3, vorläufig): im Sommerfenster je Liga so viele Käufe aus dem Ausland,
      // ab dieser Stärke, bis zu diesem Alter, höchstens jeVerein je Verein, Ablöse = Vereinswert fürs Ausland × preis. Sommer 2025: allein die vier teuersten Zugänge der Premier League kamen aus der Bundesliga.
      abwanderung:{liga:{1:[6,12],2:[3,6],3:[2,5]},ab:{1:78,2:72,3:67},alterMax:29,jeVerein:2,preis:1.2},
      interesse:{fremd:-5,heimkehr:10},// Wechselbereitschaft zu dir: Spieler aus dem Ausland etwas geringer, Deutsche im Ausland höher (Rückkehr, K32 §8)
      namenVersuche:6,                 // so oft wird ein Name neu gewürfelt, wenn es ihn im Pool schon gibt
      // Vorlauf beim Aufbau der Welt: Der Pool durchläuft so viele Saisons in groben Schritten (Entwicklung, Karriereende, neue Talente), damit er im Gleichgewicht startet.
      // Ohne Vorlauf wären alle Talente gleich jung und würden zusammen hochwachsen (Welle bei den Spielern ab Stärke 85 über etwa zwölf Saisons).
      vorlauf:{saisons:6,schritte:3,tage:105}
    }
  },

  spieler:{
    talent:[[20,[6,18]],[23,[3,11]],[26,[1,6]]], // Talent = Stärke + Zufall, je bis zu diesem Alter. Passt zur Restentwicklung der Alterstabelle (Höhepunkt 26–28)
    talentSonst:[0,2],
    startForm:10,
    startFitness:[95,100],           // Frische zu Beginn
    startKondition:[75,85],
    startSpielpraxis:70,
    // Entwicklung der Stärke an jedem Spieltag (K03 §5.1): verbucht nach jedem Pflichtspiel des Vereins für die Tage seit der letzten Buchung, sonst wöchentlich
    entwicklung:{tageProSaison:320,
      alter:[[19,4.9,0.7],[22,4.0,0.9],[25,2.5,1.0],[28,1.4,1.1],[30,0.8,1.3],[32,0.6,2.0],[34,0.4,2.6]],sonst:[0.3,3.7], // [bis Alter, Wachstum, Abbau] pro Saison, kalibriert mit tests/spielermodell.js (die Talentgrenze bremst einen Teil)
      positionsAlter:{TW:-3,AB:-1,MF:0,ST:1},abbau:{TW:0.7,AB:0.85,MF:1,ST:1}, // Torhüter und Abwehr bauen später und langsamer ab
      talentWeich:3,formBasis:1.2,   // Wachstum × 1,2^(Form−10), Abbau × 1,2^(10−Form)
      praxis:{hoch:60,auf:1.2,tief:20,aufTief:0.7,abTief:1.3,abTiefAb:29,halbBis:18},
      profi:{auf:[0.8,0.02],ab:[1.2,-0.02]},zufall:0.05,jung:{bisAlter:21,zufall:2}},
    form:{mitte:10,min:0,max:20,jeNote:2.3,ausgleich:0.11,wirkung:0.005,serie:{spiele:5,abPunkte:4,bonus:0.5}}, // Form += 2,3 × (erwartete Note − Note), jede Woche 11 % zurück zur Mitte
    frische:{spiel:15,ko:[2.0,-0.0125],erholung:[2.1,0.1],alter:[[23,1.1],[29,1],[32,0.9]],alterSonst:0.8,koErholung:[0.8,0.004]},
    kondition:{vereinslos:65,tempo:0.20,altAb:30,altJeJahr:1,urlaub:0.6,verletzt:0.5},
    selbstvertrauen:{min:-3,max:3,tor:0.5,guteNote:0.3,schlechteNote:-0.3,ausgleich:0.15},
    spielpraxis:{zerfall:0.97,jeSpiel:25,wirkungUnter:50,wirkungMax:0.04}, // Trainingsspiele geben zusätzlich Spielpraxis (K07)
    zustand:{min:0.80,max:1.08},    // Deckel für Form, Frische und Spielpraxis zusammen (K03 §5.8)
    // Integration und Deutsch (K03 §5.5, K03d, 24.11., popolupo, vorläufig): Start beim Zugang deutsch (deutschsprachig) oder fremd, ± anpassung je 10 Punkte Anpassungsfähigkeit.
    // Woche: basis, + einsatz mit einem Spiel, + deutsch ab deutschAb, + figur mit Integrationsfigur, + landsleute mit einem Landsmann, höchstens max. Deutsch: Start start,
    // je Woche min bis max nach Anpassungsfähigkeit, mit zwei Landsleuten halb so schnell. Wirkung im Spiel min + (1 − min) × Integration, nur mit wirkung.an (vorerst aus).
    // Seit Prüfung FK4: kader für Fremdsprachige deutscher Vereine ohne eigenen Wert und ohne laufende Integration (Startkader), sie lernen von dort weiter.
    integration:{start:{deutsch:70,fremd:35,anpassung:15},woche:{basis:3,einsatz:2,deutsch:1,deutschAb:60,figur:1,landsleute:1,max:8},deutsch:{start:20,kader:60,min:1,max:3},wirkung:{an:false,min:0.92}},
    // Persönlichkeit (K03 §3.3): 8 verdeckte Werte 1–20, ausgewürfelt je Karriere
    persoenlichkeit:{mitte:10,streuung:3.5,min:1,max:20,werte:['pro','ehr','loy','tem','dru','anp','fue','rob']},
    // Eigenschaften (K03 §3.5) entstehen aus der Persönlichkeit. Angezeigt nur, wenn ihre Wirkung im Spiel gebaut ist (wirksam).
    eigenschaften:{
      vorbildprofi:{name:'Vorbildprofi',art:'+',wenn:{pro:[17,20]},text:'lernt 25 % schneller, baut im Alter langsamer ab'},
      partyloewe:{name:'Partylöwe',art:'−',wenn:{pro:[1,4]},text:'Kondition 8 niedriger, lernt 25 % langsamer'},
      trainingsweltmeister:{name:'Trainingsweltmeister',art:'±',wenn:{pro:[15,20],dru:[1,7]},text:'lernt 25 % schneller, bringt es im Spiel aber nicht immer'},
      hitzkopf:{name:'Hitzkopf',art:'−',wenn:{tem:[17,20]},text:'sieht 50 % öfter Karten'},
      verletzungsanfaellig:{name:'verletzungsanfällig',art:'−',wenn:{rob:[1,4]},text:'verletzt sich 60 % öfter'},
      nervenschwach:{name:'nervenschwach',art:'−',wenn:{dru:[1,4]},text:'schwächer in engen und wichtigen Spielen und vom Punkt'},
      fuehrungsspieler:{name:'Führungsspieler',art:'+',wenn:{fue:[16,20]},abAlter:24,text:'reißt bei Rückstand die Mannschaft mit, zählt in der Kabine doppelt und steckt andere an'},
      integrationsfigur:{name:'Integrationsfigur',art:'+',wenn:{fue:[13,20],anp:[15,20]}},
      mentor:{name:'Mentor',art:'+',wenn:{pro:[14,20],fue:[12,20]},abAlter:29,text:'als Pate lernt ein Talent 10 % schneller und wird professioneller, einen Bankplatz nimmt er dann hin'},
      kaempfer:{name:'Kämpfer',art:'+',wenn:{ehr:[16,20],dru:[12,20]},text:'legt bei Rückstand zu, Kritik spornt ihn an'},
      vereinstreu:{name:'vereinstreu',art:'+',wenn:{loy:[17,20]}},
      diva:{name:'Diva',art:'−',wenn:{ehr:[15,20],anp:[1,6]},text:'eine zu niedrige Rolle kostet doppelt Stimmung, mag keine Kritik und keinen harten Ton'},
      soeldner:{name:'Söldner',art:'−',wenn:{loy:[1,4]},text:'schaut aufs Gehalt, Gespräche wirken schwächer'},
      heimweh:{name:'Heimweh-Typ',art:'−',wenn:{anp:[1,4]}}},
    eigenschaftenWirksam:['vorbildprofi','partyloewe','trainingsweltmeister','hitzkopf','verletzungsanfaellig','nervenschwach','kaempfer','fuehrungsspieler','diva','soeldner','mentor'],
    entdeckenWochen:[2,8],          // so lange dauert es, bis der Co-Trainer eine Eigenschaft eines neuen Spielers meldet
    // Merkmale (K03 §3.4): Stärken und Schwächen. Schwierigkeit: Lernfortschritt pro Woche leicht 12 %, mittel 6 %, schwer 3 %.
    merkmale:{
      kopfballstark:{name:'kopfballstark',g:['AB','MF','ST'],s:'mittel',gegen:'kopfballschwach',text:'gefährlicher bei Kopfbällen, wird bei Flanken öfter gesucht, verteidigt hohe Bälle besser'},schnell:{name:'schnell',g:['AB','MF','ST'],s:'schwer',bis:23,alt:true,gegen:'langsam',text:'eigene Konter gefährlicher, gegnerische Konter seltener'},
      ausdauernd:{name:'ausdauernd',g:['AB','MF','ST'],s:'leicht',alt:true,text:'verliert im Spiel ein Viertel weniger Frische'},
      zweikampfstark:{name:'zweikampfstark',g:['AB','MF'],s:'mittel',text:'stärker in der Abwehr'},stellungssicher:{name:'stellungssicher',g:['AB','MF'],s:'mittel',text:'der Gegner kommt seltener zu Großchancen'},ballsicher:{name:'ballsicher',g:['AB','MF'],s:'mittel',text:'seltener Konter nach Ballverlust'},
      flankengeber:{name:'Flankengeber',g:['AB','MF'],s:'mittel',text:'mehr Kopfballchancen über außen, gefährlichere Ecken'},dribbler:{name:'Dribbler',g:['MF','ST'],s:'schwer',text:'macht aus Halbchancen öfter Großchancen'},torjaeger:{name:'Torjäger',g:['MF','ST'],s:'schwer',gegen:'abschlussschwach',text:'kommt öfter zum Abschluss und trifft besser'},
      weitschuetze:{name:'Weitschütze',g:['MF','ST'],s:'mittel',text:'schießt öfter aus der Distanz und trifft dabei besser'},freistoss:{name:'Freistoßspezialist',g:['AB','MF','ST'],s:'mittel',text:'direkte Freistöße gehen öfter rein'},
      elfmeter:{name:'Elfmeterschütze',g:['AB','MF','ST'],s:'leicht',text:'trifft vom Punkt öfter'},beidfuessig:{name:'beidfüßig',g:['AB','MF','ST'],s:'schwer',bis:25,text:'trifft etwas besser, keine Einbuße auf der „falschen“ Seite'},
      vielseitig:{name:'vielseitig',g:['AB','MF','ST'],s:'mittel',text:'auf fremden Positionen besser geeignet'},joker:{name:'Joker',g:['MF','ST'],s:'mittel'},
      reflexe:{name:'Reflexe',g:['TW'],s:'mittel',text:'hält Schüsse aus kurzer Distanz besser'},strafraum:{name:'Strafraumbeherrscher',g:['TW'],s:'mittel',gegen:'fliegenfaenger',text:'fängt Flanken ab, weniger Kopfballtore'},
      elfmetertoeter:{name:'Elfmetertöter',g:['TW'],s:'leicht',text:'hält Elfmeter öfter'},mitspielend:{name:'mitspielend',g:['TW'],s:'mittel'},
      kopfballschwach:{name:'kopfballschwach',g:['AB','MF','ST'],s:'mittel',schwaeche:true,text:'schwächer bei Kopfbällen'},abschlussschwach:{name:'abschlussschwach',g:['MF','ST'],s:'mittel',schwaeche:true,text:'vergibt öfter'},
      unkonzentriert:{name:'unkonzentriert',g:['TW','AB','MF','ST'],s:'leicht',schwaeche:true,text:'patzt deutlich öfter'},ungestuem:{name:'ungestüm',g:['AB','MF','ST'],s:'mittel',schwaeche:true,text:'foult öfter, mehr Karten und Elfmeter'},
      fliegenfaenger:{name:'Fliegenfänger',g:['TW'],s:'mittel',schwaeche:true,text:'lässt Flanken fallen, mehr Kopfballtore'},langsam:{name:'langsam',g:['AB','MF','ST'],s:'schwer',schwaeche:true,text:'gegnerische Konter gefährlicher'}},
    // In der Engine wirksam und damit sichtbar (Joker und mitspielend erst mit Einwechslungen und Spielaufbau, K05/K06)
    merkmaleWirksam:['kopfballstark','schnell','ausdauernd','zweikampfstark','stellungssicher','ballsicher','flankengeber','dribbler','torjaeger','weitschuetze','freistoss','elfmeter','beidfuessig','vielseitig',
      'reflexe','strafraum','elfmetertoeter','kopfballschwach','abschlussschwach','unkonzentriert','ungestuem','fliegenfaenger','langsam'],
    lernen:{woche:{leicht:6,mittel:3,schwer:1.5},alter:[[21,1.3],[25,1.1],[29,1],[32,0.8]],alterSonst:0.6,profi:[0.7,0.03],zufall:[0.7,1.3],
      frischeUnter:[70,0.8],eigenschaft:{vorbildprofi:1.25,trainingsweltmeister:1.25,partyloewe:0.75},maxStaerken:4,platz:[[64,1],[74,2],[84,3]],automatik:true,plaetze:5, // plaetze: Lernplätze je Verein bis K16 (K07 §12 Nr. 4)
      
      // Altersverlust (K03 §5.6): ab Positionsalter 31 je Woche 0,6 % für „schnell“ und „ausdauernd“, ab 33 kommt „langsam“ mit 0,5 % dazu. Faktor Professionalität: 1,5 − 0,05 × P (P 20: 0,5; P 10: 1)
      altersverlust:{ab:31,merkmale:['schnell','ausdauernd'],woche:0.006,langsamAb:33,langsam:0.005,profi:[1.5,0.05],profiMin:0.4}},
    // Lernen im Spiel (K03 §5.6). k: Stärke, w: Schwäche, ja: Fortschritt bei Erfolg (und Abbau der Schwäche), nein: Fortschritt zur Stärke bei Misserfolg (negativ = Rückschritt),
    // minus: Fortschritt zur Schwäche bei Misserfolg, kosten: Fehlerkonto bei Misserfolg, zufall: Anteil der Misserfolge, die zählen
    lernenSpiel:{faktor:1,maxProSpiel:25,konto:{erfolg:10,woche:2},schwaecheVerjaehrt:1, // Fortschritt zu einer Schwäche sinkt jede Woche um 1 (Ausrutscher verjähren)
      szenen:{ecke_tor:{k:'flankengeber',ja:8},kopf:{k:'kopfballstark',w:'kopfballschwach',ja:6,nein:1},ecke:{k:'kopfballstark',w:'kopfballschwach',ja:6,nein:1},freistossFlanke:{k:'kopfballstark',w:'kopfballschwach',ja:6,nein:1},
        kopfballduell:{k:'kopfballstark',w:'kopfballschwach',minus:4,kosten:10},freistoss:{k:'freistoss',ja:15},elfmeter:{k:'elfmeter',ja:6,nein:-10,kosten:25},elfmeter_gehalten:{k:'elfmetertoeter',ja:20},
        fern:{k:'weitschuetze',ja:10},gross:{k:'torjaeger',w:'abschlussschwach',ja:3,minus:2,kosten:5},dribbling:{k:'dribbler',ja:3},
        flanke_tw:{k:'strafraum',w:'fliegenfaenger',ja:3,minus:10,kosten:25,zufall:0.3},parade_nah:{k:'reflexe',ja:2},patzer:{w:'unkonzentriert',minus:8},gelb:{w:'ungestuem',minus:3},rot:{w:'ungestuem',minus:10},
        joker:{k:'joker',ja:15}}}, // joker (K05f): ein Eingewechselter trifft (aus r.ev und r.ein, lernenImSpiel), nicht aus der Engine
    startMerkmale:{staerken:[[0,0.85],[55,1],[65,1.9],[75,2.85],[85,3.6]],schwaechen:[[60,0.6],[85,0.3]],beidfuessig:0.1,
      gewichte:{TW:{reflexe:3,strafraum:2,elfmetertoeter:1,mitspielend:2},AB:{kopfballstark:3,zweikampfstark:3,stellungssicher:3,ballsicher:2,flankengeber:1,ausdauernd:1,schnell:1},
        MF:{ballsicher:2,flankengeber:2,dribbler:1,weitschuetze:2,freistoss:1,ausdauernd:2,zweikampfstark:1,schnell:1,elfmeter:1,vielseitig:1},ST:{torjaeger:3,kopfballstark:2,schnell:2,dribbler:2,elfmeter:2,joker:1,weitschuetze:1}}},
    // Feine Positionen (K03 §3.1a) und Fuß. Bis die Daten da sind, per Zufall aus der Gruppe.
    positionen:{TW:{TW:1},AB:{IV:0.5,LV:0.25,RV:0.25},MF:{DM:0.2,ZM:0.25,SM:0.05,OM:0.15,LM:0.175,RM:0.175},ST:{MS:0.5,HS:0.1,LA:0.2,RA:0.2}},
    positionsNamen:{TW:'Torwart',IV:'Innenverteidiger',LV:'linker Außenverteidiger',RV:'rechter Außenverteidiger',DM:'defensives Mittelfeld',ZM:'zentrales Mittelfeld',SM:'Spielmacher',OM:'offensives Mittelfeld',LM:'linkes Mittelfeld',RM:'rechtes Mittelfeld',MS:'Mittelstürmer',HS:'hängende Spitze',LA:'Linksaußen',RA:'Rechtsaußen'},
    fuss:{rechts:0.77},
    talentSchaetzung:{fehler:1,genauNachWochen:104}, // Talentsterne bis 1 daneben, nach 2 Jahren im Verein genau (K03, Normal)
    vertrag:[1,4],                   // Restlaufzeit in Jahren
    // Gehalt/Jahr = basis × e^(steigung × (Stärke − mitte)). K23c (vorläufig, Modellrechnung K23 §5.6b): steiler als vorher (basis 1 Mio., steigung 0,1),
    // damit die Personalkosten je Liga nahe an echt liegen: 1. Liga im Schnitt etwa 72 Mio. €, 2. Liga 17 Mio. €, 3. Liga 7 Mio. € je Verein.
    // Stärke 60 bekommt 0,23 Mio., 70 1,1 Mio., 75 2,5 Mio., 80 5,6 Mio., 85 12 Mio., 90 28 Mio. €.
    gehalt:{basis:2.5e6,steigung:0.16,mitte:75,runden:1000},
    gehaltAlt:{basis:1e6,steigung:0.1,mitte:75},  // Kurve vor K23c, nur zum Umrechnen alter Spielstände (welt.js, k23cUmstellen)
    // Marktwert ebenso steiler (K23c, vorher basis 8 Mio., steigung 0,1): Kaderwert 1. Liga im Schnitt etwa 220 Mio. €, 2. Liga 37 Mio. €, 3. Liga 11 Mio. €.
    // Stärke 60 im besten Alter 0,35 Mio., 70 2,6 Mio., 75 7 Mio., 80 19 Mio., 85 52 Mio., 90 140 Mio. €.
    marktwert:{basis:7e6,steigung:0.2,mitte:75,jungUnter:24,staerkeAnteil:0.6,talentAnteil:0.4,
      alter:[[21,1.5],[24,1.25],[28,1],[30,0.7],[32,0.45]],alterSonst:0.22,minimum:25000,runden:25000},
    sterne:[12,8,4],                 // Talent − Stärke ab diesem Wert: 4, 3 oder 2 Sterne
    niveauSpieler:14,                // Kaderstärke = Schnitt der besten 14
    niveauLeer:50                    // Kaderstärke ohne Spieler
  },

  finanzen:{
    // TV-Gelder (K23 §5.1, K23c, vorläufig): Säulenmodell mit echten Töpfen je Saison (DFL 1,121 Mrd. € für 1. und 2. Liga im Verhältnis 80:20, DFB 26,2 Mio. € für die 3. Liga).
    // 1. und 2. Liga: gleich (Gleichverteilung 50 % plus Nachwuchs 4 %, den es im Spiel noch nicht gibt) zu gleichen Teilen, leistung nach dem Rang in der Fünfjahreswertung
    // innerhalb der Liga (Gewicht n + versatz − Rang), interesse nach Ansehen². Fünfjahreswertung: Punkte je Saison = Zahl der Vereine der drei Ligen + 1 − Gesamtplatz
    // (1. Liga Platz 1 bis 18, 2. Liga 19 bis 36, 3. Liga ab 37), gewichtet mit gewichte (jüngste Saison zuerst). Fehlende Saisons zählen wie der Startplatz nach Ansehen.
    // 3. Liga: Topf zu gleichen Teilen. Ausgezahlt je Ligaspiel. Seit K23h (24.11., popolupo, K23 §4): mit raten.an in vier gleichen Raten an den Tagen raten.tage
    // (August, November, Februar, Mai) an alle Vereine der Profiligen statt je Spiel. Vorerst aus: verschiebt den Zeitpunkt des Geldes aller Vereine, erst messen.
    tv:{topf:{1:897e6,2:224e6,3:26.2e6},gleich:0.54,leistung:0.43,interesse:0.03,versatz:3,gewichte:[5,4,3,2,1],raten:{an:false,tage:['08-01','11-01','02-01','05-01']}},
    betrieb:{jePlatz:1,jeLoge:300},  // Stadion und Betrieb je Ligaspieltag
    jugendKosten:[0,20000,40000,70000,110000,160000], // je Ligaspieltag, Index = Stufe
    kreditZins:0.08,                 // pro Saison
    // Kreditrahmen = basis × e^(steigung × (Ansehen − mitte)), gerundet (K23c, vorläufig, vorher 2 Mio. + 250.000 € je Ansehen): Ansehen 95 etwa 54 Mio. €,
    // 71 etwa 21 Mio. €, 52 etwa 10 Mio. €, 39 etwa 6 Mio. €. Er ist zugleich die Grenze für die Insolvenz.
    kreditRahmen:{basis:20e6,steigung:0.04,mitte:70,runden:1e5},
    // Verwaltung und Sonstiges (K23c, neu, vorläufig): Geschäftsstelle, Reisen, Sicherheit, Vermarktung. Je Ligaspiel dieser Anteil an TV, Werbung (Grundbetrag) und
    // sonstigen Einnahmen, für alle Vereine. Echt liegen die übrigen Aufwendungen bei 40 bis 70 % des Umsatzes. So gewählt, dass die Ligen im Schnitt wie vorher stehen:
    // 1. Liga etwa +11 Mio. € je Saison, 2. Liga etwa 0, 3. Liga knapp im Minus (Modellrechnung K23 §5.6b, ohne Transfers und Pokal).
    verwaltung:{1:0.4,2:0.55,3:0.4},
    pokalPraemien:[2e5,4e5,8e5,1.6e6,3.2e6,4.5e6], // je gespielter Runde
    pokalSieg:3e6,
    pokal:{drittligisten:4,amateure:24}, // DFB-Pokal: 36 aus 1. und 2. Liga, dazu die besten Drittligisten (ohne Zweitmannschaften) und Amateure
    fremdeEinnahmen:{liga:30,pokal:10}, // bis K23b die Pauschale der Computer-Vereine (Ansehen² × Wert je Spieltag bzw. Pokalrunde), seit K23b nur noch zum Vergleich in tests/finanzmodell.js
    fanartikel:[0,1.5,3,5],          // € je Zuschauer, Index = Fanshop-Stufe
    loge:3000,                       // € je Loge und Heimspiel
    zuschauer:{refBasis:15,refJeAnsehen:0.25, // Richtpreis = refBasis + Ansehen × refJeAnsehen
      preisExponent:1.2,preisMin:0.2,preisMax:1.4, // Preiswirkung = (Richtpreis / Preis)^Exponent, begrenzt
      formBasis:0.86,formJePunkt:0.06, // Form = Punkte der letzten 5 Spiele im Schnitt
      gegnerBasis:0.88,gegnerFaktor:0.3,gegnerOhne:40, // Gegner = basis + Ansehen/100 × faktor
      liga2:0.82,liga3:0.7,pokal:1.05,zufallBasis:0.95,zufallSpanne:0.1},
    ticketPreis:{min:5,max:150,standard:20},
    // Werbung (K23c, vorläufig): Grundbetrag je Ligaspiel = basis × e^(steigung × (Ansehen − mitte)) × liga. Vorher Ansehen² × 45, 18 oder 8.
    // Echt (DFL 2023/24): 1. Liga im Schnitt 57 Mio. € je Saison, 3. Liga 5,8 Mio. €. Im Spiel: 1. Liga etwa 53 Mio. € (Ansehen 95 etwa 200 Mio. €, 55 etwa 15 Mio. €),
    // 2. Liga etwa 8 Mio. €, 3. Liga etwa 4 Mio. €. Davon teilen sich Trikotbrust, Ausrüster und Ärmel den Anteil werbung.anteil, den Rest (werbung.partner) zahlen weitere Partner.
    sponsorAlt:{liga:{1:45,2:18,3:8},anteil:{brust:0.6,ausruester:0.29,aermel:0.11}}, // Werbung vor K23c (Ansehen² × liga × anteil), nur zum Umrechnen alter Verträge (welt.js k23cUmstellen)
    sponsor:{basis:1.15e6,steigung:0.065,mitte:70,liga:{1:1,2:0.65,3:0.6},
      angebote:[
        {fix:1,sieg:0,jahre:1,info:'Festes Geld pro Spieltag, 1 Saison'},
        {fix:0.65,sieg:1.3,jahre:1,info:'Weniger Fixum, dafür Prämie pro Sieg, 1 Saison'},
        {fix:0.92,sieg:0,jahre:3,info:'Langfristig: 3 Saisons feste Summe'}]},
    // Werbeflächen (K24 §3.1, Teilschritt K24a, 21.11.): Trikotbrust, Ausrüster und Ärmel mit je eigenen Angeboten in der Form oben.
    // Seit K23c (vorläufig): Anteile am Grundbetrag der Werbung nach den Zielanteilen in K24 §3.1 (Brust 35–45 %, Ausrüster 15–25 %, Ärmel 5–10 %), den Rest (partner)
    // zahlen weitere Partner (Premium-, Logen- und Regionalpartner) je Ligaspiel ohne Verhandlung. Bayern bekommt so etwa 75 Mio. € für die Brust (echt etwa 60 Mio., K24 §5.1).
    // Bis K23c teilten sich die drei Flächen den ganzen Grundbetrag (0,6, 0,29, 0,11). Namen erfunden.
    werbung:{anteil:{brust:0.38,ausruester:0.18,aermel:0.07},partner:0.37,titel:{brust:'Trikotbrust',ausruester:'Ausrüster',aermel:'Ärmel'},
      namen:{ausruester:['Falkner Sport','Sprintwerk','Kranich Teamwear','Nordlicht Athletics','Bergfalke Sport','Tiedemann Sportswear'],
        aermel:['Moorland Versicherung','Weserblick Immobilien','Albtrauf Software','Uferwerk Logistik','Sonnhalde Energie','Grünfeld Mobilfunk']},
      // K24b (21.11., alle Werte aus K24 §5.4, §4.3, vorläufig): je Fläche ein viertes Angebot von einem umstrittenen Geldgeber (30 % über dem besten festen Angebot,
      // zwei Jahre). Fans: −5 bei Vertragsschluss, −1 an jedem Monatsersten. Skandal mit 5 % je Saison: Fans −10, danach darfst du kostenlos kündigen. Die Automatik meidet sie (K24 §7).
      umstritten:{faktor:1.3,jahre:2,fans:-5,fansMonat:-1,skandal:0.05,skandalFans:-10,info:'Umstrittener Geldgeber: 30 % mehr, zwei Jahre, die Fans murren',
        namen:['Kronos Kapital','Sandor Energy Group','Vexo Krypto','Ostkap Rohstoffe','Glücksstern Wetten','Bastion Trading']},
      // Sponsorentag (K24 §4.3, seit 22.11. nach Wunsch in drei Größen): einmal je Saison, solange Angebote offen sind. Kosten in der 1. Liga, in der 2. Liga die Hälfte, in der 3. ein Viertel.
      // Der Zuschlag auf alle offenen Angebote wird je Größe in der Spanne gewürfelt (eigener Strom). Du siehst keine Zahl, nur den Text nach der Lage in der Spanne (unteres, mittleres, oberes Drittel).
      sponsorentag:{stufen:{klein:{name:'klein',adj:'kleiner',kosten:5000,plus:[0.05,0.07]},mittel:{name:'mittel',adj:'mittlerer',kosten:25000,plus:[0.07,0.10]},gross:{name:'groß',adj:'großer',kosten:50000,plus:[0.08,0.11]}},liga:{1:1,2:0.5,3:0.25},
        texte:['Der Sponsorentag war ein Erfolg. Die Gäste sind zufrieden nach Hause gegangen.','Der Sponsorentag war ein voller Erfolg. Die Gäste sind glücklich nach Hause gegangen und schauen voller Erwartung in die Zukunft.','Der Sponsorentag war ein grandioser Erfolg! Alle sind überglücklich nach Hause gegangen und können es kaum erwarten, mit dir zusammenzuarbeiten.']},
      // K24c (21.11., K24 §5.3 und §3.2, vorläufig): Zufriedenheit je Vertrag 0–100, Start 50, zum Saisonende +5 je Platz über dem Ziel (höchstens ±25), Fanstimmung über ihrem
      // Start × 0,5 (±10), Werbewert über seinem Start × 0,5 (±10), Abstieg −20. Ab 70 bietet der Partner zum Vertragsende eine Verlängerung mit 10 % mehr (zwei Jahre).
      // Abstiegsklausel: Laufende Verträge, die in die nächste Saison reichen, zahlen nach einem Abstieg 40 % weniger.
      zufriedenheit:{start:50,jePlatz:5,erfolgMax:25,fans:0.5,fansMax:10,werbewert:0.5,werbewertMax:10,abstieg:-20,verlaengernAb:70,plus:0.1,jahre:2,klausel:0.4},
      werbewert:{jePunkt:0.004,max:0.15}}, // Werbewert aus K25 (S.mk.ww) über seinem Startwert hebt neue Angebote, darunter senkt er sie, höchstens ±15 %
    abfindung:0.5,                   // Abfindung = Gehalt × Restlaufzeit × Wert
    handgeld:0.5,                    // Handgeld für Vereinslose = Gehalt × Wert
    handgeldAnzeige:0.6              // Schätzung im Spielerfenster
  },

  markt:{
    kaderMax:36,                     // dein Kader höchstens
    kaeufer:{kaderMax:30},           // Computer-Vereine kaufen nur, solange ihr Kader kleiner ist. Wer auf die Transferliste kommt und wer kauft, regelt seit U11a der Kaderplan (REGELN.computer)
    verkaeufer:{kaderMin:20},        // Computer-Vereine geben nur ab, solange danach mindestens so viele Spieler bleiben
    neuerVertrag:[2,4],
    runden:25000,
    angebote:{preis:[[1,0.4],[1.3,0.2],[1.7,0.06]],preisSonst:0.01, // Chance je Woche nach Forderung/Marktwert
      kontoAnteil:0.8,laufzeitWochen:3}, // Beträge seit U10a nach dem Vereinswert des Bieters (transfers.angebotKI)
    ueberraschung:{niveauPlus:2,chance:0.012},
    interesse:{basis:18,liga1:5,liga2:-8,liga3:-16,altAb:31,altPlus:8,niveauFaktor:1.5,zufall:20,vereinslosAbstand:5},
    gehalt:{basis:1.05,zufall:0.2,altAb:31,altFaktor:0.85} // Gehaltsforderung = Gehalt × (basis + Zufall), ältere günstiger bei Verlängerung
  },

  // Transfers I (K19 §5, §11, U10a): Fenster für alle, Vereinswert mit einer Formel für Kauf und Verkauf, Verhandlungsrunden.
  // Fenster (DFL 2026/27, jeweils bis 20 Uhr): Sommer 1.7. bis 1.9., Winter 1.1. bis 1.2. Außerhalb wird verhandelt, gewechselt wird zum nächsten Fensterbeginn. Vereinslose jederzeit.
  // Wechsel unter Computer-Vereinen nur im Fenster. Wie viele es sind, folgt seit U11a aus dem Kaderplan (REGELN.computer), nicht mehr aus einer festen Zahl je Woche.
  // Vereinswert = Marktwert × Stellenwert (Kaderrolle beim Verkäufer, Bedarf beim Käufer) × Restlaufzeit × Finanzlage. Forderung = Vereinswert × 1,15, höchstens 1,8 × Marktwert.
  // Schmerzgrenze = Vereinswert × 0,95. Gegenangebot in der Mitte zwischen letzter Forderung und deinem Angebot, nie unter der Schmerzgrenze. Höchstens vier Runden beim Kauf,
  // drei beim Verkauf. Spottangebot (unter 60 % der Forderung) kostet Geduld (zwei Spottangebote, dann Abbruch). Abbruch: vier Wochen Pause. Ein anständiges Angebot (ab 80 %)
  // drückt die Forderung um 3 %, höchstens einmal in vier Wochen. Angebote der Computer-Vereine: 85 bis 100 % ihres Vereinswerts, nur mit Bedarf (mindestens so gut wie ihr Stammspieler).
  transfers:{
    fenster:[['07-01','09-01'],['01-01','02-01']],
    stellenwert:{schluessel:1.5,stamm:1.3,rotation:1,pokal:1,talent:1,ergaenzung:0.8},
    kauf:{besser:1.2,gleich:1,schlechter:0.7,spanne:2},
    bedarfAnzeige:{max:5}, // K31b (22.11., popolupo): höchstens so viele Vereine mit Bedarf auf der Spielerkarte, der Rest als Zahl
    // Weiterverkaufsbeteiligung (K19 §5.2, K19d, 22.11., popolupo): anteil am nächsten Verkauf durch den Käufer; er bewertet sie mit bewertung × anteil × Ablöse und zahlt so viel weniger
    weiterverkauf:{anteil:0.15,bewertung:0.2},
    // Boni als Teil der Ablöse beim Kauf (K19 §5.2, K19i, 24.11., popolupo, vorläufig): Der Verkäufer rechnet einen Bonus mit wert seines Betrags an. Höchstens maxAnteil der
    // festen Ablöse, nur bei Käufen von deutschen Vereinen. Fällig, wenn die Bedingung binnen saisons Saisons eintritt (spiele: so viele Pflichtspiele für dich; aufstieg:
    // dein Verein spielt in einer höheren Liga als beim Kauf), sonst verfällt er; verlässt der Spieler dich vorher, entfällt er.
    // Seit K19k (24.11., popolupo, vorläufig) auch in Angeboten deutscher Computer-Vereine für deine Spieler: mit ki.chance (fest aus dem Seed) ist ki.anteil des Gebots ein
    // Bonus, die feste Ablöse sinkt um wert × Bonus. Aufstiegsbonus mit ki.aufstieg, wenn der Käufer nicht in der 1. Liga spielt, sonst nach arten.spiele.n Pflichtspielen für ihn.
    boni:{wert:0.5,maxAnteil:0.5,saisons:2,arten:{spiele:{n:25,name:'nach 25 Pflichtspielen für dich',erfuellt:'hat 25 Pflichtspiele für dich bestritten'},
      aufstieg:{name:'bei einem Aufstieg deines Vereins',erfuellt:'ist mit dir aufgestiegen',platz:6,sonst:0.2}}, /* Aufstieg: voller wert nur bis Platz platz, sonst × sonst (Prüfung FH3) */
      ki:{chance:0.3,anteil:0.2,aufstieg:0.5}},
    // Spielertausch beim Kauf (K19 §4.3, K19j, 24.11., popolupo, vorläufig): Ein eigener Spieler als Teil des Angebots zählt beim Verkäufer mit wert × seinem Vereinswert
    // als Käufer (vwKauf). Er geht nur mit, wenn der Verein höchstens ansehenMinus weniger Ansehen hat als deiner oder er wechseln will (Wechselwunsch), und nur, wenn
    // der Verkäufer unter kaeufer.kaderMax Spieler hat. Nur bei Käufen von deutschen Vereinen.
    tausch:{wert:0.9,ansehenMinus:10},
    restlaufzeit:[0.6,0.6,0.85,1],
    finanzlage:{knappUnter:2e6,knapp:0.9,reichAb:60e6,reich:1.1}, // K23c: reich erst ab 60 Mio. € (vorher 20 Mio.), weil die Kontostände gewachsen sind
    forderung:1.15,schmerzgrenze:0.95,maxFaktor:1.8,
    runden:{kauf:4,verkauf:3},geduld:2,spott:0.6,anstaendig:0.8,preisdruck:{prozent:0.03,tage:28},pause:28,
    angebotKI:[0.85,1],auslandMax:1.15,
    // Transferstatus „unverkäuflich“ (K19 §5, K19c, 22.11., GESCHÄTZT): bei Computer-Vereinen die schluessel stärksten Spieler mit mindestens bindungAb Jahren Vertrag,
    // nicht auf der Transferliste. Für dich gilt dann der Höchstpreis maxFaktor × Marktwert. Deine eigenen markierst du selbst.
    unverkaeuflich:{schluessel:3,bindungAb:2}},

  // Verträge (K21 §5, §11, U10b): Gehaltsforderung, Verhandlung über ein Paket, Prämien je Spiel, Klauseln, Vorvertrag, Interesse beim Wechsel (K19 §5.3), Bankzeit (K14 §12).
  // Forderung = Gehalt nach Stärke × Alter (bis 23 ×0,8, ab 31 ×0,9) × Talent (bis 23 mit drei Sternen ×1,1) × Söldner 1,2 oder vereinstreu 0,9 × Zufall (0,95 bis 1,05),
  // beim Wechsel ×1,1, bei Verlängerung × Stimmungsaufschlag (K14). Ein Liga-Faktor fehlt bewusst: Die Gehaltskurve nach Stärke gibt der 2. Liga schon etwa 40 % (K21 §12).
  // Annahme, wenn der Wert des Pakets je Jahr die Forderung erreicht (Schwelle je Spieler ±3 %): Gehalt + Handgeld/Laufzeit + erwartete Prämien × Sicherheit
  // (0,6 + 0,02 × Druckresistenz) + Klauseln (Ausstiegsklausel bis 1,5 × Marktwert: 10 % weniger nötig, bis 3 ×: 5 %; Ligaklausel: 5 % je 30 % Kürzung mehr nötig)
  // − Laufzeitwunsch (bis 23 je Jahr über 3: 3 %, ab 30 je Jahr unter 3: 5 %). Drei Runden, jede Ablehnung kostet 2 Stimmung, dann vier Wochen Pause.
  // Prämien: Auflauf voll bei Startelf oder Einwechslung bis zur Halbzeit, sonst halb; Punkt nur in der Liga bei Startelf oder 45 Minuten; Tor je Tor; Zu-Null für Torwart und Abwehr ab 60 Minuten.
  // Vorvertrag ab 1. Januar im letzten Vertragsjahr (FIFA, sechs Monate, Wortlaut nicht geprüft). Ausstiegsklausel ziehen nur im Fenster.
  vertraege:{
    laufzeit:{max:5,maxU18:3,jungBis:23,altAb:30,mitte:3,jung:0.03,alt:0.05},
    forderung:{alter:[[23,0.8],[30,1],[99,0.9]],talent:1.1,talentSterne:3,talentBis:23,soeldner:1.2,treu:0.9,zufall:[0.95,0.1],wechsel:1.1},
    zone:0.03,runden:3,rundeStimmung:-2,vertagtTage:28,gespraechTage:56,
    einsatz:{stamm:0.85,rotation:0.45,rest:0.15},spiele:{1:36,2:36,3:39},punkteJeSpiel:1.4,torquote:{ST:0.35,MF:0.12,AB:0.04,TW:0},zuNullQuote:0.25,
    sicher:[0.6,0.02],praemie:{halbAbMinute:46,punktAbMinuten:45,zuNullAbMinuten:60},
    ausstieg:{billigAb:1.5,mittelAb:3,bonus:0.1,chance:0.25},
    ligaklausel:{malus:0.05,ref:0.3,stufen:[0,0.2,0.3,0.5]},
    // Zielvorgabe (K21 §3.1, §5, K21f, 24.11., popolupo, vorläufig): ab spiele Pflichtspielen für dich seit der Unterschrift Gehalt + plus; der Spieler rechnet sie mit wert × Forderung an
    // (§5: „Gehalt −5 % akzeptiert“). Nur deine Verträge.
    zielvorgabe:{spiele:25,plus:0.1,wert:0.05},
    interesse:{lage:0.3,lageMitte:55,wechselwunsch:15,bindung:-3,treu:-10,landsleute:3,landsleuteMax:6,geldAb:-10,geldJePunkt:0.03,
      // heimkehrVerein (K19 §8, K19e, 23.11., popolupo, GESCHÄTZT): Rückkehr des verlorenen Sohns, mehr Interesse ab den Pflichtspielen eines Publikumslieblings für deinen Verein
      // (fanstimmung.ident.lieblingSpiele, seit Prüfung EP6 keine eigene Zahl mehr), beim Wechsel zu dir Fanstimmung (Umfeld) + heimkehrFans
      heimkehrVerein:10,heimkehrFans:2,
      ruf:0.2}, // U12h (K28 §5.4, 22.11., GESCHÄTZT): je Punkt deines Rufs als Trainer über dem Start mehr Interesse, darunter weniger
    vorvertrag:{von:'01-01',bis:'06-30',chance:0.06,ansehenMinus:5},
    bank:{vertragsjahr:1.5,soeldner:2,neuzugang:1.5,neuTage:365,teuerAnteil:0.25}},

  // Berater (K22 §11, U10c): 60 erfundene Berater mit Profil und Einfluss (1–20). Etwa 60 % der Spieler haben einen, Stars (Stärke oder Talent ab 80) fast alle.
  // Wer welchen Berater hat, folgt fest aus Seed und Spielernummer. Forderung nach Profil (gierig ×1,15 bis Familienberater ×0,95), Beziehung −2 % je 20 Punkte (höchstens ±10 %).
  // Provision bei Unterschrift: 5–10 % des ersten Jahresgehalts, beim Wechsel 3–8 % der Ablöse, mit guter Beziehung bis zu 50 % weniger (U10c, damit sich Kontakte wie in K22 §10 lohnen). Beziehung: zügiger Abschluss (höchstens eine abgelehnte Runde) +5,
  // drei abgelehnte Runden −5, einen wechselwilligen Mandanten verkaufen +8, Einladung +3 (einmal im Monat), jede Saison ein Viertel zurück Richtung null.
  // Ab +40 Tipps zu unzufriedenen Mandanten (Kenntnis 50), ab +60 Angebote im Fenster vor allen anderen, ein Rat an den Spieler (+5 Interesse) und eine Warnung vor einem Vorvertrag.
  berater:{anzahl:60,einfluss:[1,20],
    profile:{gierig:{anteil:0.25,forderung:1.15},serioes:{anteil:0.35,forderung:1},verschwiegen:{anteil:0.15,forderung:1.05},strippenzieher:{anteil:0.1,forderung:1.1},familie:{anteil:0.15,forderung:0.95}},
    anteilMit:0.58,anteilStars:0.92,starsAb:80,familieBis:23,
    provision:{gehalt:[0.05,0.10],abloese:[0.03,0.08]},
    beziehung:{je20:0.02,max:0.1,provJe20:0.1,provMax:0.5,tippsAb:40,erstzugriffAb:60,ratAb:60,interesse:5,warnAb:60,zuegig:5,zuegigBis:1,hart:-5,wunschVerkauf:8,verblassen:0.25},
    tippChance:0.15,tippStimmung:45,tippKenntnis:50,angebotChance:0.1,angebotNiveau:3,
    einladung:{kosten:5000,kostenLoge:2000,plus:3,tage:30}},

  // Leihe, Profis in der Zweiten, Medizincheck (K08 §5.5, §12 Nr. 29, K19 §4.3, §5.5, U10d). Leihen nur im Fenster, bis zum Saisonende, Rückkehr am 1. Juli.
  // Verleihen: Ein Verein mit Bedarf nimmt ihn, wenn er höchstens so viel Gehalt zahlen soll, wie er bereit ist (100 %, wenn der Spieler um mehr als 2 besser ist als seine Kaderstärke,
  // 50 % bei ±2, sonst 0 %). Einsatzgarantie: Stammspieler 60 %, Rotation 30 % der Minuten, geprüft ab der achten Woche. Kaufoption: Der Leihverein zieht sie, wenn sie unter seinem Vereinswert liegt.
  // Ausleihen: nur Spieler, die bei ihrem Verein nicht Stamm- oder Schlüsselspieler sind und bei dir mindestens Rotation wären. Du zahlst das ganze Gehalt.
  // In die Zweite: Profis bis 23 behalten Vertrag und Gehalt und bekommen Spielpraxis. Mit 24 kommen sie zurück.
  // Medizincheck: 5.000 € je Kauf. Befund bei einer Verletzung, mehr als 60 Ausfalltagen in zwölf Monaten oder „verletzungsanfällig“: Ablöse 10 bis 30 % niedriger, zweiter Klick zum Abschluss.
  // Leihkontingent (FIFA seit 1.7.2024, DFL im Inland, K31 §5.9, U11d1): je Verein höchstens max verliehen und max ausgeliehen, von einem Verein an denselben anderen höchstens paar.
  // Spieler bis freiBis Jahre zählen nicht. Gilt für alle Vereine, auch für dich. Gezählt werden die laufenden Leihen.
  leihe:{zahlBereit:{besser:1,gleich:0.5,schlechter:0,spanne:2},anteile:[0,0.5,1],garantie:{stamm:0.6,rotation:0.3},pruefAbWochen:8,
    holenRollen:['ergaenzung','talent','rotation','pokal'],zweiteBis:23,kontingent:{max:6,paar:3,freiBis:21},
    medizin:{kosten:5000,abTagen:60,tage:365,abschlag:[0.1,0.3]}},

  // Computer-Vereine (K31 §5.6, §11, U11a): Kaderplan, Bedarf, Verkaufs- und Kaufregeln, Transferbudget. Gilt für alle Vereine, deren Transfers nicht du führst,
  // also auch für deinen Verein in der Automatik (K36). ALLE ZAHLEN HIER SIND NOCH UNGEPRÜFT: U11a entstand ohne Testlauf (tests/welt.js).
  // Kaderplan: sechs Gruppen aus den 14 Positionen. Planstellen je Gruppe = Mittel aus dem Standard (planstellen) und dem Doppelten der Plätze in der Grundordnung,
  // Torwart fest. Das sind bei jeder Grundordnung 24. Rang nach Stärke: so viele Stammspieler wie Plätze in der Ordnung, ebenso viele Herausforderer, dann Ergänzung, darüber Überhang.
  // Überzählige bis talentBis sind Talente (höchstens talente[1]), kein Überhang. Anspruch = Kaderstärke, mindestens die Grundstärke nach dem Ansehen (welt.grund).
  // qualitaet: so weit darf ein Rang unter dem Anspruch liegen. bedarf: Stammspieler mehr als stammUnterZiel unter seinem Ziel oder länger als verletztTage verletzt.
  // Budget nutzen: In den letzten endspurtWochen des Fensters sinkt die gesuchte Stärke um anspruchJeWoche je Woche, solange mehr als budgetRestAb des Budgets übrig ist.
  // verkauf.unterPlanstelle: so weit unter dem Ziel seines Rangs gilt ein Spieler als zu schwach (nur mit Überhang in der Gruppe, nie Stammspieler).
  // kauf: Zugänge über den Markt je Fenster [Sommer, Winter], der Spieler geht höchstens ansehenMinus nach unten, Höchstalter, Auswahl nach Stärke + talentGewicht × (Talent − Stärke)
  // bis jungBis, minus altMalus je Jahr über altAb, plus Schätzfehler ±schaetzFehler. finanzen: Budget = Konto × budgetAnteil [Sommer, Winter] am Anfang des Fensters,
  // Verkäufe im Fenster erhöhen es um reinvest × Ablöse. aktivJeWoche: Anteil der Vereine, die in einer Fensterwoche auf den Markt gehen.
  // fuellen: letzte Woche des Sommerfensters, offene Planstellen mit Vereinslosen (bis Grundstärke + vereinslosBis, mit vereinslosChance) oder erzeugten Spielern wie saison.auffuell*.
  computer:{
    gruppen:['TW','IV','AV','ZM','OM','ST'],
    gruppeVon:{TW:'TW',IV:'IV',LV:'AV',RV:'AV',LS:'AV',RS:'AV',DM:'ZM',ZM:'ZM',SM:'ZM',OM:'OM',LM:'OM',RM:'OM',MS:'ST',HS:'ST',LA:'ST',RA:'ST'},
    grob:{TW:'TW',IV:'AB',AV:'AB',ZM:'MF',OM:'MF',ST:'ST'},
    planstellen:{TW:3,IV:4,AV:4,ZM:5,OM:4,ST:4},talente:[2,4],talentBis:21,
    qualitaet:{stamm:3,herausforderer:6,ergaenzung:10},
    bedarf:{stammUnterZiel:3,verletztTage:56,budgetRestAb:0.4,endspurtWochen:3,anspruchJeWoche:1},
    verkauf:{unterPlanstelle:6,angebotAb:1.5}, // angebotAb: außergewöhnliches Angebot (× Marktwert), dafür gibt ein Verein auch ohne Grund ab (Sternejagd)
    // Notverkauf (K31 §8, K31d, 24.11., popolupo): Liegen die Gehälter eines Computer-Vereins über ueberRahmen × Gehaltsrahmen (K23d), setzt er den Spieler mit dem höchsten
    // Gehalt außer den Schlüsselspielern für preis × seinen üblichen Preis (kiPreis) auf die Liste. Vorerst aus (an): ändert die Verkäufe aller Vereine, erst messen.
    notverkauf:{an:false,ueberRahmen:1.1,preis:0.75},
    // Vereinsprofile (K31 §3.2, §5.7, U11b). „ehrgeizig“ folgt aus der Lage: unter den ersten ehrgeizigBis nach Ansehen in der Liga oder gerade aufgestiegen.
    // Das zweite Profil wird beim Aufbau der Welt nach gewichte gelost (oder steht als profil in daten/vereine.js). werte: was ein Profil am Standard ändert.
    // qualitaet: Aufschlag auf alle Qualitätsziele (−1 = strenger). budget: Faktor auf den Anteil des Kontos. zahlt: Faktor auf den Vereinswert des Käufers.
    profile:{gewichte:{kein:4,sparsam:2,ausbildung:2,malocher:2,altherren:1,spekulant:1},ehrgeizigBis:{1:4,2:3,3:3},
      werte:{ehrgeizig:{qualitaet:-1,budget:1.4},sparsam:{zahlt:0.9,budget:0.7},ausbildung:{talente:[3,5],talentGewicht:0.6,alterMax:28,leihRaenge:['ueber','talent']},
        altherren:{talente:[1,3],talentGewicht:0,altMalus:0,alterMax:34},spekulant:{talentGewicht:0.8},malocher:{}}},
    // Sternejagd (K31 §5.3): ehrgeizige Vereine, im Fenster fenster (0 = Sommer), höchstens einer je Saison. Der Spieler ist mindestens ueberNiveau stärker als der Anspruch,
    // höchstens alterMax alt, sein Verein hat mindestens ansehenPlus weniger Ansehen. Preis: verkauf.angebotAb × Marktwert × Restlaufzeit, mindestens die Forderung nach K19.
    sterneJagd:{fenster:0,ueberNiveau:2,ansehenPlus:5,alterMax:29},
    // Verträge nach Rang (K31 §4 Nr. 4, §5.8, U11c). Gilt für Vereine, deren Verträge nicht du führst (Bereich vertraege). wichtig: Ränge, die der Verein halten will.
    // Saisonwechsel: Chance auf Verlängerung je Rang (schließt die Zusage des Spielers ein), Ergänzungsspieler nur unter ergaenzungBis Jahren mit der Chance ergaenzung.
    // frueh: in diesem Zeitraum (MM-TT) jede Woche diese Chance, den auslaufenden Vertrag eines wichtigen Spielers vorzeitig zu verlängern (vor den Vorverträgen ab 1. Januar).
    vertrag:{wichtig:['stamm','herausforderer','talent'],chanceWichtig:0.9,ergaenzung:0.5,ergaenzungBis:30,sonst:0.1,frueh:{von:'10-01',bis:'12-31',chance:0.15},
      altAb:30,chanceAlt:0.6}, // altAb, chanceAlt (T1.3, vorläufig): Wichtige ab 30 werden nicht früh verlängert und beim Saisonwechsel nur mit 60 %, wie in der Wirklichkeit gehen ältere Stammspieler oft ablösefrei. Ohne das wuchs die Stärke der Ligen über die Saisons
    kauf:{jeFenster:[4,2],ansehenMinus:30,alterMax:32,jungBis:23,talentGewicht:0.3,altAb:29,altMalus:1,vereinslosBis:2}, // vereinslosBis: Vereinslose höchstens Grundstärke des Käufers + 2 (T1.3, vorläufig)
    finanzen:{budgetAnteil:[0.5,0.25],reinvest:0.8},
    // Leihen unter Computer-Vereinen (K31 §5.9, U11d1). Leihbar: bis alterMax Jahre, Rang in leihRaenge (Ausbildungsverein: Profilwert, auch Talente), gesund, Verleiher behält mehr als
    // markt.verkaeufer.kaderMin. Geliehen wird für die Lücken in gruende: zuerst (vor dem Kauf) bei den Gründen in zuerst, sonst nur, wenn kein Kauf geht. Kontingent: leihe.kontingent.
    leihe:{alterMax:23,leihRaenge:['ueber'],gruende:['verletzt','offen'],zuerst:['verletzt']},
    // Vorstand und Trainerwechsel der Computer-Vereine (K28 §7, K31 §5.5, §5.10, U11d2). Vertrauen 0–100, Start start, montags um traegheit Richtung Ziel = basis + Sport + Serie + Finanzen.
    // Sport: jePlatz × (erwarteter Platz − Tabellenplatz), begrenzt auf sport. Serie: serieFaktor × (Punkte je Spiel der letzten serieSpiele Ligaspiele − serieMitte), begrenzt auf serie.
    // Finanzen: finanzMinus bei Konto im Minus. Erst ab abSpiel Ligaspielen. Ultimatum unter grenze, wenn der Trainer mehr als schonfrist Ligaspiele hinter sich hat, über ultimatumSpiele Spiele.
    // Danach Entlassung mit entlassung.basis + jeGeduld × Geduld des Präsidenten, sonst ein zweites, letztes Ultimatum. Saisonende: erwarteten Platz um mehr als saisonWeitAb verfehlt
    // und Vertrauen unter saisonUnter: Wechsel im Sommer; danach geht das Vertrauen aller um saisonZurueck zurück zum Start. Neuer Trainer: neuer Lieblingsstil, Stimmung + schub für alle
    // (die Grundordnung wählt der Computer-Trainer ohnehin jeden Monat). protokoll: so viele Wechsel bleiben in S.trainerWechsel. ALLE ZAHLEN GESCHÄTZT, Ziel 4 bis 10 je Saison in der 1. Liga.
    vorstand:{start:55,traegheit:0.2,basis:50,jePlatz:5,sport:[-35,25],serieSpiele:5,serieMitte:1.3,serieFaktor:10,serie:[-15,10],finanzMinus:-15,abSpiel:5,
      grenze:20,schonfrist:6,ultimatumSpiele:2,entlassung:{basis:0.9,jeGeduld:-0.03},saisonWeitAb:3,saisonUnter:30,saisonZurueck:0.5,schub:5,protokoll:200},
    aktivJeWoche:0.5,schaetzFehler:2,
    fuellen:{fenster:0,vereinslosBis:4,vereinslosChance:0.6}}, // fenster: Nummer des Fensters in transfers.fenster, an dessen Ende aufgefüllt wird (0 = Sommer)

  // Beziehungsnetz (K17 §5.5, §11, U12c): Werte −100 bis +100. grund: Grundwert für Derby und Rivalität (Paare in daten/vereine.js, DERBYS).
  // vergessen: Anteil zurück zum Grundwert am ersten Montag jedes Monats, loeschenUnter: so nah am Grundwert fällt ein Eintrag weg. verlauf: so viele Gründe je Beziehung.
  // anlass: Änderungen. fairKauf: Ablöse mindestens dieser Anteil der Forderung, fairRunden: Verkauf mit höchstens so vielen Gegenforderungen.
  // wirkung: abloese (Forderung × (1 + abloese × Beziehung)), unter gespraechUnter lehnt ein Verein mit gespraechAblehnen ab, testspiel (Zusage × (1 + testspiel × Beziehung)).
  beziehungen:{grund:{derby:-30,rivale:-15},vergessen:0.05,loeschenUnter:2,verlauf:5,fairKauf:0.9,fairRunden:0,
    anlass:{fair:5,spott:-3,ausstieg:-8,testspiel:3,leiheGut:5,leiheSchlecht:-5,kiWechsel:5,derbySieg:-2},
    wirkung:{abloese:-0.0015,gespraechUnter:-50,gespraechAblehnen:0.5,testspiel:0.005,brisanzUnter:-50},anzeige:3}, // brisanzUnter (K17 §5.2, K09d): zwei Vereine darunter spielen wie im Derby (mehr Karten)

  // Ereigniskarten (K30 §5.5, §11, U12d). Chance je Woche, in der die Bedingungen erfüllt sind: 1 / (seltenheit × wochenJeSaison).
  // Dosierung: infoProWoche, Entscheidungen klein je Woche und groß je Monat, je Bereich je Woche, Halte je Woche (eigene Spiele mitgezählt).
  // sperrTage: Standard-Sperre je Karte und Beteiligten. log: so viele Karten bleiben im Protokoll.
  // Anlasskarten (K30d, 22.11., popolupo, vorläufig) tragen im Katalog statt der Stufe eine eigene chance je Woche, in der ihr Anlass besteht (0 < chance ≤ 1)
  karten:{seltenheit:{haeufig:3,gelegentlich:20,selten:100,sehrSelten:400},wochenJeSaison:40,
    infoProWoche:5,entscheidung:{kleinProWoche:1,grossProMonat:1,jeBereichProWoche:1},halteProWoche:4,sperrTage:120,log:100,
    // Sammlung über alle Karrieren (K30 §5.4, K30h, 24.11., popolupo, vorläufig): erlebte Karten im Browser unter schluessel, getrennt vom Spielstand; stufen: Namen in der Anzeige
    sammlung:{schluessel:'flutlicht-manager-sammlung',stufen:{haeufig:'häufig',gelegentlich:'gelegentlich',selten:'selten',sehrSelten:'sehr selten'}},
    // Meldungsdichte (K30 §5.1, K35a, K30b, 22.11., popolupo): Regler in den Einstellungen. Je Stufe ersetzen klein, gross, info die Grenzen oben, wochen: 1 oder 2, bei 2 zählt die Vorwoche mit (mehr Wochen kennt der Code nicht, Prüfung DY8).
    dichte:{standard:'normal',stufen:{wenig:{name:'wenig (eine Entscheidung alle zwei Wochen)',wochen:2,info:3},normal:{name:'normal (eine je Woche)'},viel:{name:'viel (zwei je Woche)',klein:2,gross:2,info:8}}},
    form:{kriseBis:4,hochAb:16}, // Formkarten (K03 §8, K03b, 22.11., GESCHÄTZT): Formkrise bei Form bis kriseBis, Formhoch ab hochAb (Form 0–20)
    // Der lachende Dritte (K30 §8.3, K17 §5.4, K30c, 22.11., popolupo, GESCHÄTZT): Du kennst den Berater ab Beziehung beraterAb, sonst mit Glück einen Verwandten (verwandt je Prüfung).
    // Unterschreibt der Spieler bei dir, sinkt die Beziehung zwischen den beiden anderen Vereinen um zwischen, deine zu ihnen um du (bei geschicktem Vorgehen gar nicht)
    dritter:{beraterAb:20,verwandt:0.05,zwischen:-10,du:-2},
    // nachlass (Prüfung FA1, 23.11., GESCHÄTZT): Ein Nachlass aus einer Karte (Wirkung nachlass) gilt so viele Tage, etwa ein Transferfenster
    nachlass:{tage:60},
    entwicklung:{jungBis:21,altAb:30,tage:21,punkte:2}, // Durchbruch und Altersverlust (K03 §8, K03c, 22.11., GESCHÄTZT): Stärke seit dem Monatseintrag (p.mvl, K34) mindestens tage alt um punkte gestiegen (bis jungBis Jahre) oder gefallen (ab altAb)
    // Seit Prüfung FK2: 45 nach 4 Wochen. Ein Heimweh-Typ (anp 1–4) startet fremdsprachig bei 22–26 und gewinnt je Woche mindestens 3; nach 8 Wochen lag er nie unter 40.
    // So trifft es Heimweh-Typen, die kaum spielen und keinen Landsmann haben (nach 4 Wochen 37–41, mit Einsatz jede Woche 47 und mehr).
    integration:{heimwehUnter:45,heimwehWochen:4}, // Heimweh-Karte (K03 §8, K03e, 24.11., popolupo): Heimweh-Typ, fremdsprachig, Integration unter heimwehUnter nach heimwehWochen Wochen bei dir
    spiel:{nachTage:7,fruehBis:60,spaetAb:88,spaetVerlAb:118,coupAb:2,positionUnter:0.8,positionSpiele:3,positionTage:28,merken:4}, // Karten nach deinem Spiel (K05 §8, K05c, K05d, K06c: Taktik-Coup als Außenseiter mit mindestens coupAb Niveau Abstand, K06d: positionSpiele Einsätze in Folge mit Eignung unter positionUnter, seit Prüfung EK: spaetVerlAb in der Verlängerung, positionTage höchstens seit dem letzten gezählten Einsatz, merken: so viele Spiele der letzten nachTage Tage, 23.11., GESCHÄTZT): bis nachTage danach; früh ausgewechselt vor Minute fruehBis; spätes Siegtor ab Minute spaetAb (die Nachspielzeit steht nicht eigens im Spielbericht)
    jubilaeum:{ab:25,alle:25}, // Jubiläum (K27 §8, K25 §8, K27d, 23.11.): ab ab Jahren alle alle Jahre, im Kalenderjahr des Jubiläums (Gründungsjahr gegr in daten/vereine.js)
    // Standard-Spezialisten (K06 §8, K06e, 23.11., popolupo, GESCHÄTZT, nach einem Testlauf eichen): in der laufenden Halbserie (eigene Ligaspiele bis zur Hälfte der Spieltage, danach neu)
    // mindestens abSpiele Ligaspiele, mindestens ab Tore nach arten (ohne Elfmeter) und Anteil an allen Ligatoren mindestens anteil. Danach stellen sich die Gegner tage Tage
    // darauf ein: Tore nach Ecken und Freistoßflanken × faktor (wie der Bonus der Standard-Einheit, K07 §5.3). Einmal je Halbserie.
    standard:{arten:['ecke','freistoss','freistossFlanke'],abSpiele:8,ab:7,anteil:0.4,tage:28,faktor:0.95},
    gespraech:{streitTage:7}, // Streit nach Kritik (K15 §8, K15e, 23.11., popolupo, GESCHÄTZT): Streit im Einzelgespräch nach Kritik (p.streit, Thema p.streitT seit Prüfung EO3) höchstens streitTage her
    skandal:{sperreLiga:20,sperrePokal:3,abstand:10}, // Skandale (K30 §8.4, K30f, 23.11., GESCHÄTZT): Wettbetrug eines Spielers eines Computer-Vereins, Sperre in Liga- und Pokalspielen; abstand: Manipulation in der 3. Liga (K30g) höchstens einmal in so vielen Saisons (Prüfung ER2)
    testspiel:{nachTage:7}, // Testspiel-Karten (K11 §8, K30e, 22.11., GESCHÄTZT): bis nachTage nach dem Testspiel beim Amateurverein oder der Niederlage gegen ihn
    medizin:{grippeAb:3,rehaAb:60,restAb:30}, // Medizin-Karten (K10 §8, K10e, 22.11., GESCHÄTZT): Grippewelle ab grippeAb Kranken im Kader; lange Reha bei einer Verletzung ab rehaAb Tagen mit noch mindestens restAb Tagen
    hilfe:{verletzteAb:5,bezAb:40}, // Hilfe in der Not (K17 §8, K17b, 22.11., GESCHÄTZT): ab verletzteAb Verletzten im offenen Fenster bietet ein Verein mit Beziehung über bezAb eine Leihe an
    presse:{leckUnter:45,viralTage:7,vorTage:7}, // Presse-Karten (K29 §8, K17 §8, K29k, 22.11., GESCHÄTZT): Leck bei Medienklima unter leckUnter; Fehde bei Beziehung unter RBZ.wirkung.gespraechUnter.
    // Seit K29l: „Spruch geht viral“ bis viralTage nach einem Eintrag in der Sprüche-Chronik; „Rivale greift deine Kampfansage auf“ bis vorTage vor dem Spiel gegen ihn
    sommer:{nachTestTage:14,sonderFrische:15}, // Sommerkarten (K12a §8, K12c, 22.11., GESCHÄTZT): Übergewicht bis nachTestTage nach dem Leistungstest; Sonderschichten kosten sonderFrische Frische
    stadion:{zuschussAb:5e6,anwohner:['cap','dach'],anwohnerRest:7}, // anwohner: Bauten, gegen die Anwohner klagen können, anwohnerRest: Tage Genehmigung mindestens noch (K26f, 23.11., Prüfung EO2). Stadt bietet Zuschuss (K26 §8, K26e, 22.11., GESCHÄTZT): bei einem Bauprojekt ab zuschussAb Kosten; Anteil in der Karte (Wirkung zuschuss)
    // nurZuDir (K19f, 23.11., GESCHÄTZT): Spieler will nur zu dir ab Stärke teamLevel − staerkeUnter; „hohes Interesse“ ist die Grenze aus K20d (abwerben.konkurrenz.nein.ab)
    nurZuDir:{staerkeUnter:3},
    vertrag:{neidUnter:0.7,neidStimmung:55,provisionTage:60}, // Vertragskarten (K21 §8, K22 §8, K21c, 22.11., GESCHÄTZT): Gehaltsneid unter neidUnter × Marktgehalt und Stimmung unter neidStimmung; Provisionsstreit bis provisionTage nach dem Wechsel
    // choreoTage, choreoAb (K27f, 23.11., GESCHÄTZT): Karte „Choreo in der Kurve“ vor einem Heim-Derby oder Spitzenspiel in höchstens choreoTage Tagen, Wirkung der Fankultur ab choreoAb
    // platzsturm (K27g, Prüfung EX3): direkte Aufstiegsplätze (2. und 3. Liga, in der 3. Liga ohne zweite Mannschaften) und Plätze unter dem Strich in der 1. und 2. Liga (zwei Absteiger + Relegation)
    // redenUnter (K27h, 23.11., GESCHÄTZT): Fans wollen reden bei Fanstimmung unter diesem Wert (K27 §8)
    fans:{preisFaktor:1.3,protestUnter:50,wwAb:3,choreoTage:7,choreoAb:0.5,platzsturm:{aufstieg:2,unterStrich:3},redenUnter:25}, // Fan-Karten (K27 §8, K27c, 22.11., GESCHÄTZT): Protest ab Preis × preisFaktor über dem Richtpreis bei Fanstimmung unter protestUnter; Pfiffe gegen Spieler ab Wechselwunsch wwAb
    // chef (K16g, 23.11., GESCHÄTZT): Co-Trainer wird Cheftrainer, wenn ein Computer-Verein vor höchstens tage Tagen den Trainer gewechselt hat; Co-Trainer ab Qualität qAb und ehrgeizig (ehrgeizProzent, fest aus der Nummer); Ruf als Cheftrainer: Ansehen des Vereins − rufAbschlag
    stab:{qAb:14,ansehenPlus:5,abloese:1,chef:{tage:21,qAb:12,ehrgeizProzent:40,rufAbschlag:5}}, // Mitarbeiter abgeworben (K16 §8, K16c, 22.11., GESCHÄTZT): Qualität ab qAb, Verein mit Ansehen ab deinem + ansehenPlus und freiem Platz; Ablöse abloese × Jahresgehalt, halten: Gehalt + wert aus der Karte
    jugend:{alter:16,lockAb:17,lockPlus:3,grossPlus:10,scoutAb:8}, // scoutAb: Talent aus dem Nichts (K18 §8, K18f, 23.11., GESCHÄTZT) nur mit einem Jugendscout ab dieser Qualität. Probetraining (K08 §8, K08b, 22.11.): Alter des neuen Talents (Plus in der Karte, Wirkung talent). K08c: großer Verein lockt ein Talent ab lockAb Jahren mit Talent ab Kaderschnitt + lockPlus, Verein mit Ansehen ab deinem + grossPlus
    training:{pauseUnter:65,profiAb:13,pauseSpielpraxis:5,serieAb:3,serieTage:14}, // Trainingskarten (K07 §8, K07c, 22.11., GESCHÄTZT): Pause ab Frische unter pauseUnter und Professionalität ab profiAb, kostet pauseSpielpraxis; Verletzungsserie ab serieAb Trainingsverletzungen in serieTage Tagen
    europa:{vorTage:7,nachTage:7,wunderAb:2}, // Europapokal-Karten (K37 §8, U19e, 22.11., GESCHÄTZT): Auswärtsspiel in den nächsten vorTage Tagen, Spiel höchstens nachTage her, Wunder ab wunderAb Toren Rückstand nach dem Hinspiel
    kabine:{neuMin:14,neuTage:60,kaumMinuten:90,abSpieltag:3,staerkeMinus:2,fremdTage:120,partyTage:7,meutertUnter:25}, // Kabinen-Karten (K14 §8, K14b, 22.11., GESCHÄTZT): Neuzugang von neuMin bis neuTage Tagen, höchstens kaumMinuten, ab abSpieltag; Eingewöhnung bis fremdTage; Party höchstens partyTage nach dem Spiel (DT4, DT5)
    // K23f (22.11., popolupo, GESCHÄTZT): Geldbeträge der Karten (Wirkung geld, auch der schlechte Ausgang) mal Faktor nach der Liga deines Vereins, auf 1.000 € gerundet.
    // Die Beträge in daten/karten.js gelten für die 3. Liga. Seit K23c sind die Einnahmen der 1. Liga etwa 13-mal so groß wie die der 3. Liga, der Faktor bleibt bewusst kleiner.
    geldLiga:{1:4,2:2,3:1}},

  // Statistik und Historie (K34 §5.3 bis §5.9, §11, U13). ALLE ANTEILE UND GEWICHTE GESCHÄTZT (K34 §12).
  // vorlage.anteil: Chance auf eine Vorlage je Art des Tores (keine bei Elfmeter, direktem Freistoß, Eigentor). gewicht: je Position auf dem Platz (linke Form),
  // staerkeExp: Gewicht × (Stärke/mitte)^staerkeExp, flankengeber: Faktor bei Kopfball und Flanken, sonst flankengeberSonst.
  // zuNullMin: Torwart mit so vielen Minuten bekommt ein Spiel zu null. verlauf: so viele Monatswerte für eigene Spieler. verdichtenNach: Saisons ohne Einsatz bis zur Summenzeile.
  // ehrung: Elf des Jahres (Grobposition: Anzahl), Mindestzahl Noten, Gewichte für Spieler und Talent der Saison, Marktwert für geehrte Spieler, Ruf für den Trainer der Saison.
  // rekord.allzeit: echte Bundesliga-Rekorde als Startwert der 1. Liga (Quellen in K34). meldenAb: 2. und 3. Liga melden Rekorde erst ab dieser Saison des Spielstands (1 = zweite).
  // ehemalige: Grenzen für die Liste der Ehemaligen. jubilaeum: Pflichtspiele für den Verein (jedes Vielfache), Jahre im Verein.
  statistik:{
    vorlage:{anteil:{ecke:0.95,freistossFlanke:0.95,kopf:0.9,gross:0.85,konter:0.85,halb:0.75,fern:0.4,patzer:0.1},keine:['elfmeter','freistoss'],
      gewicht:{LA:3,OM:3,SM:3,HS:2.5,LM:2.5,ZM:2,MS:1.5,LV:1.5,DM:1,IV:0.4,TW:0.05},staerkeExp:1,mitte:70,flankengeber:2.5,flankengeberSonst:1.2,flanken:['kopf','ecke','freistossFlanke']},
    zuNullMin:60,verlauf:36,verdichtenNach:5,
    ehrung:{elf:{TW:1,AB:4,MF:3,ST:3},elfMinNoten:20,spieler:{minNoten:20,mitte:4,note:10,tor:1,vorlage:0.7,platz:0.5},
      talent:{bisAlter:21,minNoten:10,mitte:4,fortschritt:2,note:5},marktwert:0.05,trainerRuf:5},
    rekord:{allzeit:{1:{sieg:{hg:12,ag:0,h:'Borussia Mönchengladbach',a:'Borussia Dortmund',datum:'29.4.1978'},tore:{n:41,name:'Robert Lewandowski',verein:'FC Bayern München',saison:'2020/21'},
      serie:{n:53,verein:'FC Bayern München',zeit:'November 2012 bis März 2014'}},
      // 2. und 3. Liga seit K34 (22.11.2026, popolupo, Quellen bundesliga.com und dfb.de, siehe K34 §5.6). 2. Liga: Rekorde seit 1974, also auch aus der zweigleisigen Zeit.
      2:{sieg:{hg:11,ag:0,h:'Arminia Bielefeld',a:'Arminia Hannover',datum:'23.5.1980'},tore:{n:41,name:'Horst Hrubesch',verein:'Rot-Weiss Essen',saison:'1977/78'},
        serie:{n:28,verein:'FC St. Pauli und Arminia Bielefeld',zeit:'1976 bis 1979 und 1979/80'}},
      // 3. Liga: 7:0 gab es viermal, hier der erste (danach Wehen Wiesbaden 2018, Mannheim und Zwickau 2022). 21 Spiele ohne Niederlage auch Saarbrücken 2011 über zwei Saisons.
      3:{sieg:{hg:0,ag:7,h:'FC Carl Zeiss Jena',a:'1. FC Saarbrücken',datum:'11.8.2010'},tore:{n:28,name:'Lars Gindorf',verein:'Alemannia Aachen',saison:'2025/26'},
        serie:{n:21,verein:'Karlsruher SC',zeit:'2017/18'}}},
      // transfer: teuerster Zugang eines deutschen Vereins als Startwert des Rekordtransfers (K34d, 22.11.2026, Websuche: Harry Kane 2023 für etwa 95 Mio. €, andere Quellen 100 Mio. plus Boni)
      transfer:{n:95e6,name:'Harry Kane',von:'Tottenham Hotspur',nach:'FC Bayern München',saison:'2023/24'},meldenAb:1},
    ehemalige:{ligaspiele:150,vereinSpiele:30,max:400},
    euListe:10, // Europapokal in der Saisonstatistik (K37, K34c): so viele deutsche Torjäger
    jubilaeum:{spiele:100,jahre:10},
    speicher:{max:1e6,saisons:20,frueh:2.5}}, // Ziel (K34 §10): Statistik nach 20 Saisons unter 1 MB im Spielstand (geprüft in tests/statistik.js). frueh: In den ersten Saisons wächst sie schneller (gemessen 101, 176, 244, 303 KB, ab Saison 13 etwa 650 KB), kurze Läufe dürfen bis zum 2,5-Fachen des Schnitts je Saison (T2.5)

  // Saisonvorbereitung (K12b §5, §11, U14). Saisoneröffnung am letzten Samstag vor dem ersten Pflichtspiel: Einnahme jeAnsehen × Ansehen, bei Regen (chance) nur faktor davon.
  // fotoNachTage: so lange nach dem Mannschaftsfoto gibt es die Meldung für Nachzügler. fotos: so viele Mannschaftsfotos bleiben in der Statistik. GESCHÄTZT.
  vorbereitung:{eroeffnung:{jeAnsehen:2000,regen:{chance:0.2,faktor:0.6}},fotoNachTage:21,fotos:30,erinnerungTage:7},

  // Transfers II (K20 §5.4, §11, U15): Abwerben, Deadline Day, Bieterrunde. ALLE WERTE GESCHÄTZT (K20 §12).
  // ort: Kosten und Faktor fürs Auffliegen. bereitschaft je Treffen: (basis + jeInteresse × Interesse) × Berater × Stimmung (unter/über) × treu, Interesse begrenzt auf interesse.
  // risiko je Treffen: basis × bekannt (ab Stärke bekanntAb) × Berater (ohne: ohneBerater) × Ort × (1 + jeTreffen × bisherige Treffen), petzen: vereinstreue zusätzlich.
  // folgen: Beziehung (Spanne), Ablöse × forderung bis Saisonende, Stimmung, Vertrauen. deadline: letzte Tage des Fensters. bieter: Aufschlag aufs Höchstgebot, gierig zusätzlich, Frist in Tagen.
  abwerben:{ort:{hotel:{name:'Hotel in einer anderen Stadt',kosten:15000,risiko:0.6},restaurant:{name:'Restaurant',kosten:5000,risiko:1.2},berater:{name:'beim Berater',kosten:10000,risiko:0.8}},
    bereitschaft:{basis:10,jeInteresse:0.1,interesse:[-50,100],berater:{gierig:1.2,strippenzieher:1.2},stimmung:{unter:[40,1.3],ueber:[70,0.7]},treu:0.4,ab:70},
    risiko:{basis:0.08,bekanntAb:80,bekannt:1.5,berater:{verschwiegen:0.4,familie:0.8,serioes:1,strippenzieher:1.2,gierig:1.5},ohneBerater:1.1,jeTreffen:0.2,petzen:0.3},
    folgen:{beziehung:[-30,-15],forderung:1.15,stimmung:-10,vertrauen:-3,fankultur:1}, // fankultur (K27e, GESCHÄTZT): Vertrauen × (1 + Wirkung der Fankultur × fankultur), K20 §5.3 „Traditionsvereine −6“
    // Computer-Vereine werben deine Spieler ab (K20 §7, K20e, 22.11., popolupo, GESCHÄTZT): montags mit chance ein Verein mit Bedarf, Ansehen ab deinem − ansehenMinus,
    // Konto über dem Marktwert; der Spieler (Stärke ab deinem Kaderschnitt + staerkePlus, bis alterMax) wird unruhig (Wechselwunsch eine Stufe höher). Mit aufflieg fliegt es auf:
    // Entscheidung binnen frist Tagen (zur Rede stellen: stimmung, glaub; öffentlich: beziehung, fans; Preis hoch: unverkäuflich). Nur, wenn du die Transfers selbst führst.
    ki:{chance:0.04,ansehenMinus:5,staerkePlus:0,alterMax:30,aufflieg:0.5,frist:5,stimmung:-3,glaub:2,beziehung:-15,fans:1},
    // Deadline Day (K20 §4.3, K20b 22.11., GESCHÄTZT): in den letzten tage Tagen eines Fensters schwankt die Forderung deutscher Computer-Vereine an dich um bis zu ±preis
    // (fest je Spieler und Tag), für Spieler auf ihrer Transferliste um liste verschoben. Angebote für deine Spieler auf der Transferliste kommen angebote-mal so oft.
    deadline:{tage:3,preis:0.15,liste:-0.1,angebote:1.5},bieter:{plus:[0.02,0.10],gierig:0.05,frist:2},
    // Bieterwettstreit beim Kauf (K20 §4.2, K20c, 22.11., GESCHÄTZT): Sagt ein deutscher Verein im offenen Fenster Ja zu deiner Ablöse, bietet mit dieser Chance ein Computer-Verein
    // mit Bedarf mit (einmal je Spieler und Saison): deine Ablöse plus bieter.plus (gieriger Berater + bieter.gierig), höchstens sein Vereinswert. Du hast bieter.frist Tage zum Mitgehen.
    konkurrenz:{chance:0.25,
      // K20d (22.11., GESCHÄTZT): Gehst du nicht mit, lehnt der Spieler den anderen Verein ab, wenn sein Interesse an dir mindestens ab ist: Chance basis + jePunkt je Punkt darüber,
      // höchstens max, mal besser, wenn der andere Verein mehr Ansehen hat als deiner. Dann nimmt der Verkäufer deine Ablöse.
      nein:{ab:20,basis:0.25,jePunkt:0.01,max:0.6,besser:0.5},zusageTage:14}}, // zusageTage: so lange gilt die Einigung danach (wie nach einem Ja, aktionen.js offer)

  // Fanstimmung (K27 §5.4b, §11, U16), 0–100. Montags traegheit Richtung Ziel = start + Erfolg + Preise + Identifikation + Entscheidungen + Umfeld, je Baustein begrenzt.
  // erfolg: jePlatz × (erwarteter Platz − Platz) ab abSpiel Ligaspielen, serie × (Punkte je Spiel der letzten fünf − serieMitte), Anlässe (derby, pokal, pokalAusTiefer) mit verblassen je Woche.
  // preise: faktor × (1 − Preis/Richtpreis). ident: basis + jeLiebling (der negative Teil für Söldnertruppen kommt später), Liebling ab lieblingSpiele (Eigengewächs ab lieblingEigen). entscheid: lieblingVerkauf. umfeld: eroeffnung, gespraech [min, max] nach Glaubwürdigkeit, leer unter leerUnter.
  // nachfrage: Zuschauerfaktor bei 0, bei start und bei 100. vorstand: tote Zone [unten, oben], darunter /teilerUnten bis minUnten, darüber /teilerOben bis maxOben.
  // protestUnter: Pfiffe in Ligaheimspielen, Selbstvertrauen pfiffeSv. gespraechTage: Abstand zwischen zwei Fan-Gesprächen. ALLE WERTE GESCHÄTZT (K27 §12).
  fanstimmung:{start:60,traegheit:0.15,
    erfolg:{spanne:[-20,20],jePlatz:2,abSpiel:5,serie:10,serieMitte:1.3,derby:6,pokal:2,pokalAusTiefer:-4,verblassen:0.2},
    preise:{spanne:[-15,5],faktor:30},ident:{spanne:[-5,10],basis:0,jeLiebling:2,lieblingSpiele:60,lieblingEigen:20},
    // entscheid.fankultur (K27e, GESCHÄTZT): Baustein Entscheidungen × (1 + Wirkung der Fankultur × fankultur), K27 §5.4c
    entscheid:{spanne:[-15,5],lieblingVerkauf:-8,verblassen:0.1,fankultur:0.5},umfeld:{spanne:[-5,5],eroeffnung:3,gespraech:[3,8],leer:-5,leerUnter:25,verblassen:0.1},
    nachfrage:[0.85,1,1.10],vorstand:{zone:[45,75],teilerUnten:3,minUnten:-10,teilerOben:5,maxOben:5},
    protestUnter:30,pfiffeSv:-0.2,gespraechTage:30,
    anlassMin:0.5, // Prüfung EN4 (23.11.): Anlässe (fanE, fanD, fanU) verblassen bis zu diesem Betrag ganz auf 0
    // Dauerkarten (K27 §5.2, K27b, 22.11., popolupo, GESCHÄTZT): nur dein Verein, verkauft beim ersten Ligaheimspiel der Saison. Anteil der Plätze = basis + jeStimmung × Fanstimmung/100
    // + jeRabatt × (Rabatt − rabatt), höchstens 1 − gaesteblock. Rabatt wählbar aus stufen (Bereich preise, Automatik: rabatt). Je Ligaheimspiel zahlen alle Inhaber Preis × (1 − Rabatt),
    // auch wenn weniger Zuschauer kommen. Fanstimmung (Baustein Preise): fans je 10 Prozentpunkte Rabatt über oder unter dem Standard.
    dauerkarten:{basis:0.35,jeStimmung:0.25,rabatt:0.2,stufen:[0.1,0.2,0.3],jeRabatt:0.5,gaesteblock:0.1,fans:2,mitglieder:0.1}}, // mitglieder: Vorkaufsrecht, Anteil + mitglieder × Mitglieder je Platz (höchstens 1), K25e, GESCHÄTZT

  // Pressekonferenzen (K29 §5.4, §11, U17a). Texte in daten/presse.js. budget: höchstens je Saison, abstand: Tage zwischen zwei, sperre: Tage je Anlass, fragen: [min, max].
  // anlass: Schwellen (spitzeBis Platz, spitzeAb Spieltag, pokalAb Runde, krise Niederlagen, hoehenflug Siege, fuehrungAb Spieltag, kantersieg Tore Abstand, auftaktVorher Tage).
  // wirkung je Antwortart: team (Stimmung aller), spieler (genannter Spieler), fans (Umfeld K27), vorstand (Vertrauen), medien (Medienklima). streuung: × [min, max]. deckel je Pressekonferenz.
  // abnutzung: Faktor, wenn die Art der letzten (bzw. der letzten beiden) entspricht. ausraster: Wahrscheinlichkeiten, Wirkungen, je Saison. schiri: Verfahren, Strafe je Liga [min, max].
  // gedaechtnis: Rückendeckung und Verkauf (Tage, Glaubwürdigkeit), Kampfansage (Kult, Häme). delegieren: Medienklima. chronikHumor: Chance. ALLE WERTE GESCHÄTZT (K29 §12).
  // Medienpolitik (K29 §6, K29b, 22.11., GESCHÄTZT): dauerhafte Einstellung deines Vereins (Bereich presse, in der Automatik standard). Je Woche zieht sie das Medienklima um klima
  // in Richtung ziel, nur nach oben (richtung 1), nur nach unten (−1) oder in beide Richtungen (0). Seit der Prüfung DF1 zieht auch „zurückhaltend“ zur Mitte, sonst sank das Klima
  // in der Automatik (Co-Trainer bei jeder Pressekonferenz −2) immer weiter. mein: Chance auf ein Gerücht über deinen Verein × mein, erfindung: Anteil erfundener Gerüchte über dich × erfindung.
  // klimaWirkung: Medienklima unter 50 macht Gerüchte über dich häufiger und öfter erfunden, darüber seltener, Faktor 1 + klimaWirkung × (50 − Klima)/50.
  medienpolitik:{standard:'zurueckhaltend',klimaWirkung:0.5,arten:{offen:{name:'offen',text:'Interviews und Einblicke: mehr Berichte über deinen Verein, die Medien mögen dich',mein:1.25,erfindung:0.8,klima:0.5,ziel:70,richtung:1},
    zurueckhaltend:{name:'zurückhaltend',text:'das Übliche, das Klima kehrt langsam zur Mitte zurück',mein:1,erfindung:1,klima:0.5,ziel:50,richtung:0},
    abgeschottet:{name:'abgeschottet',text:'keine Einblicke: weniger Berichte, dafür mehr Erfundenes, die Medien sind verstimmt',mein:0.6,erfindung:1.4,klima:0.5,ziel:30,richtung:-1}}},
  // Exklusivinterview (K29 §6, K29c, 22.11., GESCHÄTZT): höchstens alle tage Tage, Bereich presse. Das gewählte Medium plus, alle anderen andere (Beziehung je Medium in grenzen),
  // Medienklima klima. Gerüchte über deinen Verein wirken (Stimmung, Fans, Vertrauen) mal 1 − Beziehung/teiler, begrenzt auf wirkung: gewogene Medien schreiben milder, verärgerte schärfer.
  exklusiv:{tage:28,plus:10,andere:-3,grenzen:[-30,30],klima:2,teiler:60,wirkung:[0.5,1.5],
    // K29d (22.11., GESCHÄTZT): Beziehungen verblassen je Woche um verblassen Richtung 0, eine Antwort ändert die Beziehung zum fragenden Medium um ihre Wirkung aufs Klima × ausAntwort
    verblassen:0.5,ausAntwort:0.5},
  presse:{budget:20,abstand:4,sperre:21,fragen:[2,3],klimaStart:50,
    anlass:{spitzeBis:4,spitzeAb:10,pokalAb:3,krise:3,hoehenflug:5,fuehrungAb:5,kantersieg:4,auftaktVorher:2,urteilAb:3,urteilTage:7}, // urteilAb: Pressekonferenz ab so vielen Spielen Sperre (K29g), urteilTage: so lange wartet sie auf einen freien Tag (DR2)
    wirkung:{rueckendeckung:{team:2,spieler:5,medien:1},ankuendigung:{team:1,fans:2,vorstand:-0.5},kritikTeam:{vorstand:1,medien:1,kaempfer:2,empfindlich:-3,sonst:-1},
      kritikSpieler:{spieler:-8,medien:1},kritikSchiri:{team:1,fans:3,vorstand:-1},angriffMedien:{team:1,fans:1,vorstand:-1,medien:-4},provokation:{fans:2,medien:1,beziehung:-3},
      floskel:{medien:-1},humor:{team:1,fans:1,medien:1,krise:-1}},
    streuung:[0.5,1.5],deckel:{team:6,spieler:10,fans:6,vorstand:4,medien:8},abnutzung:[0.5,0.25],
    ausraster:{weckruf:0.35,bruch:0.35,kult:0.3,proSaison:2,weckrufTeam:4,bruchTeam:-5,bruchVorstand:-3,kultFans:6},
    // Kontrollausschuss nach Schiedsrichterkritik (K09 §4.3, §5.4, K09f): Urteil nach tage Tagen; ohne frühere Fälle in gedaechtnis Tagen mit verwarnung nur eine Verwarnung,
    // sonst Geldstrafe aus strafe je Liga × (1 + wiederholung × Zahl der früheren Fälle), Faktor höchstens wiederholungMax
    schiri:{verfahren:0.3,strafe:{1:[20000,50000],2:[10000,25000],3:[5000,12000]},tage:[3,7],verwarnung:0.5,wiederholung:0.5,wiederholungMax:2,gedaechtnis:365},
    gedaechtnis:{rueckendeckungTage:28,rueckendeckungGlaub:-5,kultFans:2,haemeGlaub:-3,haemeFans:-2,aussagen:40},delegieren:-2,chronikHumor:0.3,chronikMax:100,
    // K29d (22.11., GESCHÄTZT): Medienklima in der Pressekonferenz. Gewicht der scharfen Medien 1 + gewicht × (50 − Klima)/50, der übrigen 1 − …; unter bohrenUnter eine Frage mehr
    klimaFragen:{scharf:['boulevard','portal'],gewicht:0.5,bohrenUnter:35,bohrenPlus:1},
    // K29e (22.11., GESCHÄTZT): Medienprofile der Computer-Trainer, Anteile in Prozent, fest aus der Trainernummer. Vor den Anlässen in anlaesse stichelt ein Trainer mit dem Profil laut oder psycho
    // mit chance (Strom presse). Antwort auf die Stichelei, zusätzlich zur normalen Wirkung: gelassen (Humor) eigene Mannschaft +gelassen, kontern (Provokation) eigene +konterEigen und die Spieler des Gegners
    // +konterGegner (Trotz), ignorieren (Floskel) eigene +ignorieren[Profil]; nicht hingegangen (ohne Automatik) eigene +offen[Profil]
    // ki (K29m, 23.11., GESCHÄTZT): Sticheleien unter Computer-Trainern vor Derbys und Spitzenspielen deiner Liga in den nächsten tage Tagen, höchstens max je Woche, Beziehung der Vereine + bez
    medienprofil:{anteile:{diplomatisch:40,floskel:25,laut:20,psycho:15},anlaesse:['derby','spitze','pokal','relegation'],chance:{laut:0.6,psycho:0.5},ki:{tage:7,max:1,bez:-2},
      gelassen:1,konterEigen:1,konterGegner:1,ignorieren:{laut:0,psycho:-1},offen:{laut:-1,psycho:-2}},
    // K29f (22.11., GESCHÄTZT): Interview am Spielfeldrand nach deinem Spiel, Wirkung der Antwortart × faktor, ohne Streuung, Abnutzung und Deckel
    spielfeldrand:{faktor:0.5},
    // K29i (22.11., GESCHÄTZT): Interviews deiner Spieler, montags mit chance (eigener Strom), Mitteilsame mit gewicht öfter; Fettnäpfchen mit basis (+ mitteilsam, + unzufrieden unter Stimmung
    // unzufriedenUnter, höchstens max). Maulkorb: keine Interviews, Mitteilsame je Woche Stimmung maulkorb. Nicht in der Automatik (Bereich presse).
    interview:{chance:0.3,mitteilsam:['diva','partyloewe','hitzkopf'],gewicht:3,trotz:{chance:0.15,glaub:-2},fettnapf:{basis:0.3,mitteilsam:0.3,unzufrieden:0.2,unzufriedenUnter:40,max:0.9},
      schlecht:{klima:-2,zusammenhalt:-1,fans:-1},gut:{klima:1,fans:1},maulkorb:-1}},

  // Marketing (K25 §5.4, §11, K25a). trikot: Faktor auf den Fanartikel-Erlös [min, max] und Fanstimmung je Design, mutig: Chance auf Kult, sonst Spott.
  // kampagnen: Kosten in der 1. Liga, Dauer in Tagen (sommer: bis zum ersten Pflichtspiel), Wirkung. ligaFaktor: Kosten je Liga. abnutzung: 1., 2., 3. Mal in der Saison.
  // merch: Publikumslieblinge je Spieler und höchstens. werbewert: Start = Ansehen × startJeAnsehen, Rückgang je Monat Richtung Start, Titel. ALLE WERTE GESCHÄTZT (K25 §12).
  marketing:{trikot:{klassisch:{faktor:[0.95,1.05],fans:1},modern:{faktor:[0.9,1.15],fans:0},mutig:{kult:0.5,faktor:[0.8,1.25],fans:[-3,3]}},
    // Fankultur (K25 §5.6, K25f, 23.11., popolupo, GESCHÄTZT, ersetzt die Tradition nach Gründungsjahr aus K25e): 0–100 = 100 × Summe gewicht × Teil, jeder Teil linear von [0, voll] auf 0–1.
    // auslastung: Fans ÷ Plätze (höchstens 1); mitglieder: Mitglieder je Platz; zugkraft: (Fans ÷ Ligaschnitt) ÷ (Ansehen ÷ Ligaschnitt), Liga ohne zweite Mannschaften,
    // Untergrenze der Zugkraft bei (fast) vollem Stadion: ausverkauftMin × Anteil der Auslastung zwischen ausverkauft[0] und ausverkauft[1] (stufenlos, Prüfung EM2).
    // Wirkung beim Trikot stufenlos von wirkung[0] (keine) bis wirkung[1] (voll): klassisch Faktor +klassischPlus, Fans +klassischFans (gerundet),
    // mutig wird mit mutigKult statt trikot.mutig.kult Kult. Meldung „Kurve“ ab kurve (Anteil der Wirkung, EM3)
    fankultur:{gewicht:{auslastung:0.3,mitglieder:0.3,zugkraft:0.4},auslastung:[0.6,1],mitglieder:[0,2],zugkraft:[0.5,1.5],ausverkauft:[0.93,0.97],ausverkauftMin:0.5,
      wirkung:[50,80],klassischPlus:0.05,klassischFans:1,mutigKult:0.35,kurve:0.5},
    kampagnen:{trikot:{name:'Trikot-Kampagne',kosten:150000,tage:28,merch:0.15},fanwerbung:{name:'Fanwerbung in der Region',kosten:200000,tage:56,fans:0.02,werbewert:5},
      camps:{name:'Jugend-Camps',kosten:60000,sommer:1,fans:0.01,stimmung:1},fanarbeit:{name:'Fanarbeit',kosten:50000,tage:120,pfiffe:0.7,vergehen:0.7}, /* vergehen: Chance der Karten zu Zuschauer-Vergehen (K09h, K25 −30 %) */
      // K25c (22.11., GESCHÄTZT): Dauerkarten-Aktion in der Vorbereitung, vor dem Verkauf (K27b): Anteil der Dauerkarten + dauerkarten
      dauerkarten:{name:'Dauerkarten-Aktion',kosten:100000,sommer:1,dauerkarten:0.05},
      // K25d (22.11., GESCHÄTZT): Mitgliederaktion, Mitglieder + mitglieder, einmal je Saison (einmal, Prüfung DL3: sonst ließ sie sich alle vier Wochen wiederholen und wirkte dauerhaft)
      mitglieder:{name:'Mitgliederaktion',kosten:50000,tage:28,mitglieder:0.02,einmal:1}},
    ligaFaktor:{1:1,2:0.4,3:0.2},abnutzung:[1,0.5,0.25],merch:{liebling:0.05,lieblingMax:0.15},werbewert:{startJeAnsehen:0.5,zurueck:0.02,titel:5},karte:{merchTage:28}}, // karte: Dauer der Wirkung merch aus der Karte „Trikot ausverkauft“ (K25b)

  // Europapokal (K37, U19a). plaetze: Bundesliga-Platz je Wettbewerb, nachruecken: wer einspringt, wenn der Pokalsieger schon über die Liga dabei ist.
  // wb: Teilnehmer, Spiele der Ligaphase, Töpfe; titel: wohin der Titelverteidiger kommt. laender: Auslandsvereine je Land (angelehnt an die Zulassungsliste, an den Pool angepasst).
  // zufall: Streuung des Ansehens bei der Auswahl. quali: der Gegner des deutschen Siebten kommt aus so vielen der besten übrigen Auslandsvereine.
  // auslosung: Baupläne (Versuche), davon die ersten mit Höchstzahl je Land, Tauschversuche im Topf je Bauplan. kurz: Ausland gegen Ausland ohne Engine (Tore bei gleicher Stärke, Exponent, Heimvorteil, Verlängerung als Anteil).
  // staerke: Faktor auf die Teamstärke der Auslandsvereine (Kalibrierung, Konsistenzprüfung AW13). ALLE WERTE GESCHÄTZT (K37 §12).
  europa:{plaetze:{cl:[1,2,3,4],el:[5],ecl:[6],nachruecken:{el:6,ecl:7}},
    wb:{cl:{name:'Champions League',kurz:'CL',teams:36,toepfe:4,titel:'cl'},el:{name:'Europa League',kurz:'EL',teams:36,toepfe:4,titel:'cl'},ecl:{name:'Conference League',kurz:'ECL',teams:36,toepfe:6,titel:'el'}},
    laender:{cl:{ENG:5,ESP:4,ITA:4,FRA:3,POR:2,NED:2,BEL:2,TUR:2,AUT:1,SUI:1,CZE:1,DEN:1,NOR:1,CRO:1,SRB:1,UKR:1},
      el:{ENG:3,ESP:2,ITA:2,FRA:2,POR:2,NED:2,BEL:2,TUR:2,AUT:2,SUI:2,CZE:2,DEN:2,NOR:2,SWE:2,POL:2,CRO:1,SRB:1,UKR:1},
      ecl:{ENG:1,ESP:2,ITA:2,FRA:1,POR:2,NED:3,BEL:3,TUR:3,AUT:3,SUI:3,CZE:1,DEN:2,NOR:2,SWE:3,POL:3,CRO:1}},
    zufall:8,quali:8,auslosung:{versuche:30,ohneHoechstzahl:15,hoechstzahl:2,tausch:3000},
    kurz:{tore:1.4,exp:1.6,heim:1.03,verl:0.33},staerke:{faktor:0.93}, // T5.3: Eine Elf der Stärke S hat in der Engine Teamwerte von etwa 0,93 × S (Zustand, Anteile, Schwächster), der Block sonst die volle Stärke
    // Geld (K37 §5.3, U19b): echte Beträge 2025/26 (Websuche 21.11.2026), mal faktor (bis K23c 0,2, seit K23c 1). start: Startgeld, sieg/remis je Spiel der Ligaphase, rang: je Anteil (Platz 1 = 36 Anteile),
    // po bis fin: beim Erreichen der Runde, titel: Sieger zusätzlich, wert: Schnitt der Wertsäule je Teilnehmer (verteilt nach dem Rang des Ansehens). Nicht recherchierte Werte sind 0 (K37 §12).
    geld:{faktor:1,cl:{start:18.62e6,sieg:2.1e6,remis:0.7e6,rang:275000,po:1e6,af:11e6,vf:12.5e6,hf:15e6,fin:18.5e6,titel:6.5e6,wert:24e6},
      el:{start:4.31e6,sieg:450000,remis:150000,rang:75000,top8:600000,top16:300000,po:0,af:1.75e6,vf:2.5e6,hf:4.2e6,fin:7e6,titel:6e6,wert:5.5e6}, // top8, top16: Bonus nach der Ligaphase für Platz 1–8 und 9–16
      ecl:{start:3.17e6,sieg:400000,remis:133000,rang:28000,top8:400000,top16:200000,po:0,af:800000,vf:1.3e6,hf:2.5e6,fin:4e6,titel:3e6,wert:2.8e6}},
    // Ansehen zum Saisonwechsel (K37 §5.4): erreichte Runde, Anteil je Wettbewerb. vertrauen: Vorstand bei jedem gewonnenen Duell und beim Titel.
    ansehen:{af:1,vf:2,hf:3,titel:4,anteil:{cl:1,el:0.5,ecl:0.25}},vertrauen:{weiter:1.5,titel:10},
    // U19c: wertung: Länderwertung der Saison (Punkte je Sieg und Remis, geteilt durch die Zahl der Vereine des Landes), die besten plaetze Länder bekommen nächste Saison einen Platz mehr
    // in der Champions League (European Performance Spot seit 2024/25). interesse: Wechselinteresse der Spieler an einem Verein im Wettbewerb (K19). ziel: Nebenziel des Vorstands
    // (K28 §5.7), K.-o.-Play-offs erreichen, in der Champions League ab diesem Ansehen das Achtelfinale.
    wertung:{sieg:2,remis:1,plaetze:2},interesse:{cl:6,el:3,ecl:1},ziel:{afAbAnsehen:85},
    // U19d1: liste: Kaderliste der UEFA (Reglement Art. 31): höchstens max auf Liste A, davon tw Torhüter, lokal Plätze für lokal Ausgebildete, davon höchstens verband verbandsausgebildet.
    // Liste B: bis bBis Jahre und aus der eigenen Jugend oder seit bTage Tagen im Verein. nach: neue Spieler bei der Nachmeldung zur K.-o.-Phase.
    liste:{max:25,tw:2,lokal:8,verband:4,bBis:21,bTage:730,nach:3}},

  // Finanzplan (K23 §5.5c, K23a): Monatsbericht, Prognose, Lizenzprüfung, Insolvenz. laufend: Buchungsarten, die in die Prognose eingehen (die übrigen sind einmalig).
  // minSpiele: so viele eigene Ligaspiele braucht der Schnitt dieser Saison, sonst gilt der der letzten Saison. lizenzTag, nachweisTag: Datum (MM-TT) der Prüfung und der Frist.
  // auflage: Vertrauen bei Auflagen. insolvenz: so viele Monatserste nacheinander unter dem negativen Kreditrahmen, Punktabzug, Vertrauen. warnMonate: Vorlauf der Warnung.
  // monatTage: Tage je Monat für die Warnung. PUNKTABZUG GESCHÄTZT (K23 §12 Nr. 9).
  finanzplan:{laufend:['TV-Gelder','Sponsor','Weitere Sponsoren','Zuschauer','Dauerkarten','VIP-Logen','Fanartikel','Gehälter','Trainerstab','Prämien','Stadion & Betrieb','Verwaltung','Jugendarbeit','Zweite Mannschaft','Kreditzinsen','Scouting','Instandhaltung','Sonstige Einnahmen'],
    minSpiele:3,lizenzTag:'03-01',nachweisTag:'05-31',auflage:-5,insolvenz:{monate:2,punkte:9,vertrauen:-30},warnMonate:3,monatTage:30,
    // K23b (§5.5e): sonstiges: Sonstige Einnahmen (Mitglieder, Vermarktung, Stadionvermietung) je Ligaspiel nach Liga, für alle Vereine. Seit K23c (vorläufig) etwa 7 % der Einnahmen
    // ohne Transfers wie in echt (7–11 %): 1. Liga 10,2 Mio. €, 2. Liga 2,7 Mio. €, 3. Liga 1,1 Mio. € je Saison. Vorher 0, 25.000 und 60.000 € als Ausgleich der zu kleinen Werbung.
    // Seit K25d (22.11., vorläufig) ohne die Mitgliedsbeiträge: Grundbetrag je Ligaspiel plus Mitglieder × mitglieder.beitrag ÷ Ligaspiele. Der Grundbetrag ist so gewählt, dass der
    // Schnitt je Liga wie vorher bei 300.000, 80.000 und 30.000 € liegt (Mitglieder im Schnitt etwa 107.000, 24.000 und 7.500, K25 §5.5).
    sonstiges:{1:110000,2:37000,3:18000},
    // mitglieder (K25d): beitrag Jahresbeitrag je Mitglied (€), ausFans Anteil der Fans für Vereine ohne Angabe in daten/vereine.js.
    mitglieder:{beitrag:60,ausFans:0.3},
    // K23d (§5.3, §5.5f): budget: Gehaltsrahmen = gehaltAnteil × erwartete Einnahmen einer Saison (Liga-Modell ohne Transfers). Über sperreAb × Rahmen keine Käufe (du und Computer-Vereine),
    // Transferbudget = Kontostand über einer Reserve von reserve × erwarteten Einnahmen. gehaltAnteil seit K23c 0,75 (vorher 0,85): Nach der Modellrechnung (K23 §5.6b) liegen Gehälter
    // und Stab im Schnitt bei 55 bis 66 % der erwarteten Einnahmen, bei kleinen Drittligisten und Leverkusen (starker Kader) bei 80 bis 84 %. Gesperrt (über 82,5 %) ist anfangs kaum einer.
    budget:{gehaltAnteil:0.75,sperreAb:1.1,reserve:0.1},
    // K23e (§5.5d): kredit: Laufzeiten in Jahren, Standard. raten: Anzahlung, Aufschlag auf den Rest, Zahl der Monatsraten. verzicht: Anteil der Gehälter, Dauer in Tagen, Stimmung. GESCHÄTZT.
    kredit:{jahre:[1,2,3,4,5],standard:3},raten:{anzahlung:0.5,aufschlag:0.05,monate:12},verzicht:{anteil:0.15,tage:90,stimmung:-10}},

  // Gerüchteküche (K29 §4.3, §5.5, U17b). proWoche: [min, max] je Woche, meinVerein: Chance auf eins über deinen Verein, dauer: Tage bis zur Prüfung und Wirkung auf die Ablöse.
  // wirkung: Stimmung des Spielers, Fans, Vertrauen, Ablöse × preis (wahr, halb). medien: Start der Treffsicherheit, treffer/fehler danach. aergerUnter: Beziehung für „Ärger“, aergerWahr: Anteil wahr.
  // erfindung: Chance, dass ein Gerücht erfunden ist. anzeige: so viele im Büro, log: so viele gespeichert. ALLE WERTE GESCHÄTZT (K29 §12 Nr. 15 bis 19).
  geruechte:{proWoche:[1,3],meinVerein:0.5,dauer:30,wirkung:{stimmung:-3,fans:-2,vertrauen:-2,preis:{wahr:1.1,halb:1.15}},
    medien:{start:{boulevard:40,fach:75,tv:60,portal:50,lokal:65},treffer:3,fehler:-3},aergerUnter:-30,aergerWahr:0.3,erfindung:0.25,anzeige:6,log:60,
    // Klatsch und Tratsch (K17 §5.2, §5.3, K17d, 22.11., popolupo): Liegt deine Beziehung zu einem Verein unter aergerUnter, kommen Gerüchte über deinen Verein mein-mal so oft,
    // und es gibt „{spieler} soll dort ein Thema sein“. Wirkung auf den Spieler: mit positiv +stimmung (fühlt sich begehrt), sonst −stimmung (Unruhe). Werte aus K17 §5.3.
    klatsch:{mein:2,positiv:0.3,stimmung:3}},

  // Trainerpool (K32 §3.3b, U18a): Cheftrainer der Computer-Vereine. aufbau: Ruf = Ansehen + streuung, Alter, freie Trainer mit Ruf poolRuf. wechsel: Ruf des Entlassenen, Nachfolger höchstens ueber über dem Ansehen.
  // saison: je Platz über/unter der Erwartung (bis platzMax), Meister, Abstieg, freie Trainer vergessen Richtung mitte, Ruhestand der freien ab ruhestand.
  // exSpieler: ab Ligaspielen mit chance, Ruf basis + Ligaspiele/jeSpiele, mit Ehrung +ehrung. ALLE WERTE GESCHÄTZT (K32 §12 Nr. 21 bis 25).
  trainerpool:{aufbau:{streuung:[-10,10],alter:[38,62],pool:12,poolRuf:[30,80]},wechsel:{entlassen:-5,ueber:10},
    saison:{jePlatz:2,platzMax:6,meister:10,abstieg:-6,vergessen:0.05,mitte:40,ruhestand:68},
    exSpieler:{ab:150,chance:0.15,basis:25,jeSpiele:20,ehrung:10,alter:[34,40]},minPool:12},

  // Training (K07 §11): Einheiten, Intensität, Vorlagen nach Abstand zum Spiel, Kondition und Entwicklung aus dem Wochenreiz, Belastung, Verletzungen, Umschulung
  training:{
    staerkeMin:25,staerkeMax:99,
    einheiten:{regeneration:{frische:1},kondition:{frische:-4,kondition:2,entwicklung:0.3},technik:{frische:-2,kondition:1,entwicklung:1,lernen:0.2},
      taktik:{frische:-2,kondition:1.2,vertrautheit:2,entwicklung:0.6},standards:{frische:-1,kondition:0.5,lernen:0.2},
      vorbereitung:{frische:-1,kondition:0.5,vertrautheit:1},spiel:{frische:-5,kondition:1,praxis:1/3,entwicklung:0.5,risiko:1.5},frei:{}},
    intensitaet:{leicht:{wirkung:0.5,frische:0.5,risiko:0.5},normal:{wirkung:1,frische:1,risiko:1},hoch:{wirkung:1.3,frische:1.5,risiko:2}},
    // Vorlagen (K07 §3.2): p1 = Tag nach dem Spiel (Startspieler), p1rest = übrige, p2 = zwei Tage danach, mitte = mittlere Tage der Reihe nach, m2/m1 = zwei Tage / ein Tag vor dem Spiel
    vorlagen:{
      standard:{name:'Standardwoche',p1:['regeneration','normal'],p1rest:['spiel','leicht'],p2:['frei','normal'],mitte:[['taktik','normal'],['kondition','normal'],['technik','normal']],m2:['taktik','normal'],m1:['vorbereitung','leicht']},
      englisch:{name:'Englische Woche',p1:['regeneration','normal'],p1rest:['technik','leicht'],p2:['taktik','leicht'],mitte:[['technik','leicht']],m2:['taktik','leicht'],m1:['vorbereitung','leicht']},
      aufbau:{name:'Aufbau',p1:['frei','normal'],p1rest:['frei','normal'],p2:['kondition','normal'],mitte:[['kondition','hoch'],['technik','normal'],['spiel','normal']],m2:['taktik','normal'],m1:['vorbereitung','leicht']},
      schonen:{name:'Schonen',p1:['regeneration','normal'],p1rest:['regeneration','leicht'],p2:['frei','normal'],mitte:[['technik','leicht'],['taktik','leicht']],m2:['taktik','leicht'],m1:['vorbereitung','leicht']},
      // Vorbereitung (K07 §3.2, K12a): Woche 1 Kondition normal, Wochen 2–3 hoch, Wochen 4–5 Taktik und Spielformen. Langsam steigern schützt vor Belastungssprüngen.
      vorbereitung:{name:'Vorbereitung',m1:['vorbereitung','leicht'],wochen:[[['kondition','normal'],['technik','normal'],['frei','normal'],['kondition','normal'],['technik','leicht'],['taktik','leicht'],['frei','normal']],
        [['kondition','hoch'],['technik','normal'],['kondition','hoch'],['spiel','normal'],['taktik','normal'],['kondition','normal'],['frei','normal']],
        [['kondition','hoch'],['technik','normal'],['taktik','normal'],['spiel','normal'],['kondition','normal'],['technik','normal'],['frei','normal']],
        [['taktik','normal'],['technik','normal'],['spiel','normal'],['standards','normal'],['taktik','normal'],['kondition','normal'],['frei','normal']]]}},
    eigeneMax:3, // eigene Vorlagen deines Vereins (K07 §6, K07f, 22.11., popolupo, vorläufig): höchstens so viele, Slots wie die festen Vorlagen (p1, p1rest, p2, drei mittlere, m2, m1)
    startVorlage:'auto',blick:14,englischBis:4,pauseAb:9,vorbereitungTage:42,startspielerAb:60,
    kondition:{basis:58,jeReiz:4,max:95},
    // Trainingsfaktor der Entwicklung: 0,6 (kaum Training) bis 1,25, Standardwoche (Reiz 2,5) = 1. Wer platt ist (Frische unter 70), lernt schlechter.
    entwicklung:{min:0.5,max:1.25,normalReiz:1.5,frischeUnter:70,frischeFaktor:0.8}, // normalReiz: Standardwoche mit sieben Tagen Abstand (Taktik, Kondition, Taktik)
    lernen:{mindestTage:3,einheit:0.2},
    // Umschulung (K07 §3.3, Entscheidung vom 12.11.): frei wählbar sind nur Nachbarpositionen (verwandt laut engine.eignung.nah). Weiter entfernte Positionen
    // gehen nur bei sehr jungen Spielern (bis jungBis) oder mit dem Merkmal „vielseitig“. Torwart ist ausgeschlossen, in beide Richtungen.
    // Punkte je Woche: verwandt (Startwert ab verwandtAb) oder fremd, mal Tempo nach Alter. Höchstwert: max (vielseitig maxVielseitig, entfernte Position fernMax)
    // plus Abzug nach Alter. Ein Spieler lernt in seiner Laufbahn höchstens so viele Positionen dazu (positionen, mit „vielseitig“ positionenVielseitig).
    // einsatzMinuten, einsatzTage (K07g, 23.11., GESCHÄTZT): Ein Einsatz auf der neuen Position ab einsatzMinuten zählt wie eine Trainingswoche zusätzlich, höchstens einmal in einsatzTage Tagen
    umschulung:{einsatzMinuten:45,einsatzTage:7,verwandt:4,fremd:2,verwandtAb:75,max:90,maxVielseitig:95,fernMax:85,jungBis:19,
      tempo:[[19,1.25],[23,1],[27,0.8],[30,0.6]],tempoSonst:0.4,
      maxAlter:[[23,0],[27,-2],[30,-5]],maxAlterSonst:-8,
      positionen:1,positionenVielseitig:2},
    verletzung:{basis:0.0016,sprungAb:1.3,sprungJe01:1.5,frischeAb:80,frischeJePunkt:0.05}, // Art und Dauer aus REGELN.medizin (K10)
    last:{akut:7,chronisch:28,grund:2}, // grund: gewohnte Last mindestens 2 pro Tag
    planErinnerung:{vorschau:7,sprungAb:1.5,spielerAb:3,abstandTage:7}, // Erinnerung „Plan passt nicht“ (K07 §5 Nr. 4, K07b, 22.11., GESCHÄTZT)
    lernplatzErinnerung:{abstandTage:7}, // Erinnerung „Lernplatz frei“ (K07 §8, K07d, 22.11.): höchstens einmal je abstandTage
    spielLast:15,spielKondition:1 // Last und Konditionsreiz eines ganzen Pflichtspiels
  },


  // Match-Engine v2 (K04): Szenen-Modell pro Minute. Grundordnungen auf den 14 Positionen (K06), Seiten links und rechts getrennt.
  engine:{
    formationen:{ // Plätze von hinten nach vorn
      '4-4-2':['TW','LV','IV','IV','RV','LM','ZM','ZM','RM','MS','MS'],'4-4-2 Raute':['TW','LV','IV','IV','RV','DM','ZM','ZM','OM','MS','MS'],
      '4-2-3-1':['TW','LV','IV','IV','RV','DM','DM','LA','OM','RA','MS'],'4-3-3':['TW','LV','IV','IV','RV','DM','ZM','ZM','LA','MS','RA'],
      '4-1-4-1':['TW','LV','IV','IV','RV','DM','LM','ZM','ZM','RM','MS'],'4-2-2-2':['TW','LV','IV','IV','RV','DM','DM','OM','OM','MS','MS'],
      '3-5-2':['TW','IV','IV','IV','LS','DM','ZM','ZM','RS','MS','MS'],'3-4-3':['TW','IV','IV','IV','LS','ZM','ZM','RS','LA','MS','RA'],
      '3-4-2-1':['TW','IV','IV','IV','LS','ZM','ZM','RS','OM','OM','MS'],'5-3-2':['TW','LV','IV','IV','IV','RV','DM','ZM','ZM','MS','MS']},
    // Anteile je Position an [Kontrolle, Angriff Mitte, Angriff außen, Abwehr Mitte, Abwehr außen] (K04 §3.2). Rechts wie links, Schiene = Mittel aus LV und LM.
    anteile:{TW:[0,0,0,0,0],IV:[0.05,0,0,0.85,0.10],LV:[0.15,0,0.25,0.10,0.50],DM:[0.40,0.05,0,0.45,0.10],ZM:[0.38,0.27,0.05,0.25,0.05],
      SM:[0.55,0.35,0.05,0.05,0],OM:[0.35,0.55,0.05,0.05,0],LM:[0.25,0.05,0.45,0.05,0.20],HS:[0.20,0.70,0.10,0,0],MS:[0.10,0.85,0.05,0,0],LA:[0.10,0.25,0.65,0,0],LS:[0.20,0.025,0.35,0.075,0.35]},
    gruppe:{TW:'TW',IV:'AB',LV:'AB',RV:'AB',LS:'AB',RS:'AB',DM:'MF',ZM:'MF',SM:'MF',OM:'MF',LM:'MF',RM:'MF',HS:'ST',MS:'ST',LA:'ST',RA:'ST'},
    // Eignung auf fremden Positionen (K03 §3.1a), von → nach in Prozent, rechts spiegelbildlich
    eignung:{nah:{IV:{DM:85,LV:75,RV:75,LS:70,RS:70},LV:{LM:85,RV:80,IV:75,LS:92},DM:{ZM:90,IV:80,SM:80},ZM:{DM:90,OM:90,SM:85,LM:75,RM:75},SM:{OM:90,ZM:85,DM:75},
      OM:{SM:90,ZM:85,HS:85,LA:75,RA:75},LM:{LA:85,RM:80,LV:75,ZM:75,LS:92},MS:{HS:85,LA:70,RA:70},HS:{MS:85,OM:85,LA:75,RA:75},LA:{LM:85,RA:85,HS:75,MS:75}},
      gleicheGruppe:70,andereGruppe:55,torwartFeld:45,vielseitig:5,vielseitigMax:95,falscheSeite:0.92,seitenPositionen:['LV','RV','LM','RM','LS','RS']},
    staerke:{fitBasis:0.72,fitAnteil:0.28,leererPlatz:25}, // Wirkung = Stärke × Zustand (K03 §5.8) × Eignung
    team:{schwaechstes:0.2,mindestAnteil:0.3,anzahl:[0.85,0.05],anzahlMax:1.15,ueberragend:{ab:11,anteil:0.05}}, // überragend: was mehr als 11 über dem Schnitt der anderen im Bereich liegt, zählt nur zu 5 %
    besitz:{exponent:2.3},
    angriff:{proMinute:0.50,chance:0.395,exponent:1.55,min:0.10,max:0.80,konter:0.12},
    mix:{mitte:{gross:0.20,halb:0.45,fern:0.35},aussen:{kopf:0.45,halb:0.25,gross:0.10,fern:0.20},konter:{gross:0.6,halb:0.4}},
    tor:{gross:0.28,halb:0.085,fern:0.03,kopf:0.095,ecke:0.045,freistossFlanke:0.055,freistoss:0.06,elfmeter:0.76}, // kalibriert mit tests/kalibrierung.js
    aufsTor:0.35,geblockt:0.25,ecken:{aussenAbgewehrt:0.55,parade:0.30,geblockt:0.35},eckeSchuss:0.3,
    // Wer schießt: Gewicht je Position und Chancentyp
    schuetzen:{gross:{MS:5,HS:4,OM:3,LA:3,SM:2,ZM:1.5,LM:1.5,DM:0.5,IV:0.2,LV:0.3,LS:0.4},halb:{MS:3,HS:3,OM:2.5,LA:2.5,LM:1.5,ZM:1.5,SM:1.5,DM:0.7,IV:0.3,LV:0.4,LS:0.5},
      fern:{OM:3,SM:3,ZM:2.5,DM:1.5,LM:2,LA:2,HS:2,MS:1,IV:0.4,LV:0.6,LS:0.7},kopf:{MS:5,HS:2,LA:1,LM:1,OM:1,ZM:1,IV:1.5,DM:0.8,LV:0.4,LS:0.5},
      ecke:{IV:4,MS:4,DM:1.5,HS:1.5,ZM:1,OM:0.7,LA:0.7,LM:0.5,LV:0.4,LS:0.5},mitte:75,exponent:1.5},
    schuetze:{mitte:70,jePunkt:0.008,min:0.8,max:1.2},
    abwehr:{versatz:3,jePunkt:0.022,min:0.78,max:1.22}, // Druck der Abwehr auf den Abschluss: 1 − jePunkt × (Abwehr − Angriff − versatz). Abwehrwerte liegen im Schnitt etwa 3 über den Angriffswerten.
    torwart:{mitte:70,jePunkt:0.011,min:0.80,max:1.20,patzer:0.02,unkonzentriert:4},
    fouls:{proMinute:0.12,ort:{flanke:0.20,direkt:0.035,elfmeter:0.011},hart:1.3,fair:0.7, // Häufigkeit der Fouls; Foulart, Karten und Sperren stehen unter disziplin (K09)
      gewicht:{IV:2,LV:1.5,DM:2,ZM:1.3,LS:1.5,LM:1,SM:0.8,OM:0.8,HS:0.8,MS:1,LA:0.8},ungestuem:1.4},
    verlauf:{fuehrung:{A:0.92,D:1.05},rueckstand:{A:1.08,D:0.96},gleich:{A:0.78},abMinute:75, // gleich: bei Unentschieden gehen spät beide weniger Risiko ein
      rot:{A:0.90,D:0.95}},
    // Merkmale in der Engine (K04 §5.5)
    mk:{torjaeger:{wahl:1.3,tor:1.15},kopfballstark:{wahl:1.5,tor:1.15,abwehr:0.92},weitschuetze:{anteil:1.5,tor:1.25},flankengeber:{kopf:1.15,ecke:1.2},
      dribbler:{upgrade:0.15},schnell:{konter:1.15,abwehr:0.92},stellungssicher:{gross:0.92},zweikampfstark:{abwehr:1.03},ballsicher:{konter:0.85},
      freistoss:0.10,elfmeter:0.84,beidfuessig:1.03,reflexe:0.93,strafraum:0.85,elfmetertoeter:0.70,abschlussschwach:0.88,kopfballschwach:0.87,fliegenfaenger:1.15,langsam:1.08,abnehmend:[1,0.6,0.3]},
    ausrichtung:{SD:{A:0.90,D:1.08,T:0.90},D:{A:0.95,D:1.04,T:0.95},N:{A:1,D:1,T:1},O:{A:1.05,D:0.96,T:1.05},SO:{A:1.10,D:0.92,T:1.10}}, // K06 §5.5, T: wie oft angegriffen wird (mehr Spieler vorn)
    einsatz:{H:{A:1.02,D:1.02},F:{A:0.985,D:0.985}},
    heim:{alle:1.03,amateure:1.05},
    eigenschaften:{kaempfer:1.03,fuehrungsspieler:1.01,nervenschwach:0.96,trainingsweltmeister:0.97,engAb:80,nervenschwachElfmeter:0.06}, // Wirkung im Spiel (K03 §3.3), eng: ab Minute 80 mit höchstens einem Tor Abstand
    amateure:{wirkungJeStaerke:1}, // Amateurklubs im Pokal: alle Teamwerte = ihre Stärke
    ermuedung:{proMinute:0.17,ko:[2.0,-0.0125],hart:1.15,schwelle:60,abfall:0.005},
    karten:{gelb:0.019,rot:0.0007,hart:1.7,fair:0.5}, // nur noch für Amateurklubs
    verlaengerung:0.8,               // Chancen in der Verlängerung relativ
    elfmeter:0.76,
    fitnessMin:20,
    note:{mindestMinuten:20,basis:3.6,ergebnis:0.55,tor:0.9,staerkeMitte:72,staerkeTeiler:25,zufall:1.6,platzverweis:1.5,min:1,max:6}
  },

  // Taktik (K06 §11): Spielstile mit Kreislauf, Umsetzung, Vertrautheit, Einstellung zum Spiel, Rollen, Computer-Trainer
  taktik:{
    rollen:{mitte:['DM','ZM','SM','OM'],sturm:['MS','HS']},spielmacherMax:1,
    // Startwerte aus K06 §5.1, mit der Stil-Matrix in tests/taktik.js ausbalanciert (vorläufig, K06 §12)
    stile:{pressing:{kontrolle:1.05,angriffe:1.07,konterEigen:1.30,konterGegen:1.35,frische:1.30,fouls:1.20,mix:{gross:1.15}},
      ballbesitz:{kontrolle:1.13,angriffe:0.90,konterEigen:0.70,konterGegen:1.10,frische:0.95,fouls:0.90,mix:{halb:1.08,fern:0.80}},
      mauern:{kontrolle:0.88,angriffe:0.85,konterEigen:1.00,konterGegen:0.60,frische:0.90,fouls:1.10,abwehr:1.10},
      konter:{kontrolle:0.90,angriffe:0.88,konterEigen:2.10,konterGegen:0.90,frische:1.05,konterMix:{gross:1.30}},
      fluegel:{aussen:0.15,mix:{kopf:1.20}},ausgewogen:{}},
    kreislauf:{pressing:'ballbesitz',ballbesitz:'mauern',mauern:'konter',konter:'pressing',vorteil:0.06,daempfung:0.8}, // daempfung: wer im Kreislauf verliert, verliert diesen Anteil seiner Stil-Vorteile (× Umsetzung des Siegers)
    // Umsetzung = 0,5 × Voraussetzungen + 0,5 × Vertrautheit/100. Grundwert: Bereich gegen Ligaschnitt, ±grundSpanne/2 Punkte = 0 bis 1. Frische und Kondition: von 60 (0) bis 90 (1).
    umsetzung:{voraussetzungen:0.5,vertrautheit:0.5,merkmalErtrag:[1,0.6,0.3],grundSpanne:12,frische:[60,90]},
    vertrautheit:{start:[70,30],trainingWoche:5,jeSpiel:3,vergessen:2,min:30,neuzugang:4,ordnungUnter:60,ordnungMalus:0.03},
    vorbereitungBonus:0.01,vorbereitungTage:2,standardsBonus:1.05, // Spielvorbereitung MD-1/MD-2: Teamwerte +1 %, Standard-Einheit in den letzten 7 Tagen: Tore nach Ecken und Freistoßflanken ×1,05 (K07 §5.3)
    einstellung:{locker:{wirkung:0.96,frische:0.7},saison:{wirkung:1.04,katerTage:10,kater:0.955,frische:5}}, // Kater 10 Tage: trifft auch das nächste Wochenendspiel (K06 §12)
    // Computer-Trainer (K06 §7): Außenseiter mauern oder kontern, Favoriten pressen oder haben den Ball, Reaktion auf deinen Lieblingsstil (Stufe „normal“)
    ki:{aussenseiter:0.95,favorit:1.05,reaktion:0.25,rueckblick:5,profil:{ausgewogen:3,pressing:1,ballbesitz:1,konter:1,mauern:1,fluegel:1},ordnungTreue:1.02,ordnungAlleWochen:4,wichtigAbRunde:3,kreislaufGewicht:0.3}},
  // Sommerpause (K12a §11): Urlaub 2–4 Wochen ab zwei Tage nach dem letzten eigenen Pflichtspiel, Laufplan bis zum Auftakt, Saisonbelastung, Leistungstest
  sommer:{urlaubWochen:[2,3,4],urlaubStandard:3,urlaubBeginnNach:2,endphase:60,auftaktVersatz:[-7,0,7],
    laufplan:{proTag:0.3,profiTeiler:10,partyloewe:-0.3},
    leistungstest:{tag:1,uebergewichtAb:12,meldungenMax:2},
    vorschlag:[45,70], // Co-Trainer: ab Saisonbelastung 45 der Stammspieler drei Wochen, ab 70 vier
    belastung:{jeMinuten:45,urlaub:4,ab:50,erholung:0.004,risiko:0.01}},
  // Trainerstab (K16 §11, Welle 2): Rollen, Wirkungen, Gehälter, Start nach Ansehen. Gehälter sind Spielwerte (K16 §12 Nr. 5).
  stab:{rollen:{co:{name:'Co-Trainer',plaetze:2,pflicht:true,gehalt:1,text:'Automatik, Lernen, Umschulung, Vertrautheit, Einzeltrainingsplätze, Einschätzungen'},
      torwart:{name:'Torwarttrainer',plaetze:1,gehalt:0.5,text:'Entwicklung und Lernen der Torhüter'},athletik:{name:'Athletiktrainer',plaetze:1,gehalt:0.6,text:'weniger Trainingsverletzungen, mehr Kondition'},
      arzt:{name:'Mannschaftsarzt',plaetze:1,gehalt:0.6,text:'Diagnosen (mit K10)'},physio:{name:'Physiotherapeut',plaetze:2,gehalt:0.4,text:'kürzere Ausfallzeiten'},
      video:{name:'Videoanalyst',plaetze:1,gehalt:0.5,text:'Spielvorbereitung wirkt doppelt (ab Qualität 10)'},standard:{name:'Standardtrainer',plaetze:1,gehalt:0.4,text:'Standard-Einheiten wirken stärker'},
      psycho:{name:'Sportpsychologe',plaetze:1,gehalt:0.5,text:'Selbstvertrauen erholt sich schneller, Nervenschwache leiden weniger'},
      jugend:{name:'Jugendtrainer',plaetze:2,gehalt:0.35,text:'hebt das Talent der Jahrgänge und das Tempo der Entwicklung im Jugendkader (K08)'},
      scout:{name:'Scout',plaetze:4,gehalt:0.35,text:'beobachtet Spieler und sucht Kandidaten (K18): schmalere Spannen, weniger Fehlkäufe. Im eigenen Gebiet (Inland, Jugend oder Ausland) lernt er schneller, außerhalb langsamer'}},
    wirkung:{co:[0.85,0.015],coPlaetze:{basis:3,jeQualitaet:0.2,max:10},athletik:{risiko:-0.01,kondition:0.005},torwart:[0.85,0.015],physio:{ausfall:-0.01,max:0.25},
      video:{ab:10,bonus:1},standard:0.015,psycho:{erholung:0.05,nervenschwach:-0.025}},
    ohne:3,gehalt:{basis:{1:300000,2:120000,3:50000},steigung:0.15,runden:5000},
    start:{qualitaetJeAnsehen:0.2,streuung:[-3,3],zweiterCoAb:70,vereinslosQ:[3,16],rolleAbAnsehen:{arzt:30,physio:30,torwart:35,athletik:40,jugend:45,video:55,standard:60,psycho:65}},
    vereinslos:40,vertrag:[1,3],alter:[32,58],rente:68,verlaengern:0.7,abfindung:0.5,unschaerfe:3,genauNachWochen:6,
    einstellenJahre:2, // Vertrag beim Einstellen (von Hand und über die Karte „Ehemaliger Kapitän“, K16e, Prüfung EP1), auch die Jahre beim Verlängern (EQ7)
    verlaengernGehalt:1.1, // Gehalt beim Verlängern von Hand (K16, seit Prüfung EQ7 aus den Regeln statt fest im Code)
    // Streit im Stab (K16 §8, K16f, 23.11., popolupo, GESCHÄTZT): hitzigProzent der Mitarbeiter sind hitzig (fest aus der Nummer), im Streit wirkt ihre Qualität × (1 − malus)
    streit:{hitzigProzent:30,malus:0.1},
    // Ex-Spieler im Stab (K32 §3.3b, K16 §10, K32c, 22.11., GESCHÄTZT): ab Ligaspielen mit chance vereinsloser Mitarbeiter, Torhüter als Torwarttrainer, sonst nach Gewicht rollen;
    // Qualität basis + Ligaspiele/jeSpiele (+ehrung bei einer Ehrung) + streuung. Ziel K16 §10: 5 bis 15 je Saison in der ganzen Welt.
    // kapitaenSaisons (K16 §8, K16e, 23.11., popolupo, GESCHÄTZT): Die Karte „Ehemaliger Kapitän kehrt zurück“ kommt bis so viele Saisons nach dem Karriereende,
    // ab den Pflichtspielen eines Publikumslieblings für deinen Verein (fanstimmung.ident.lieblingSpiele, seit Prüfung EP6 keine eigene Zahl mehr)
    exSpieler:{ab:100,chance:0.25,basis:4,jeSpiele:60,ehrung:2,streuung:[-2,2],rollen:{co:5,jugend:3,standard:2},freiSaisons:5,kapitaenSaisons:1},
    mitnehmen:{max:2,wochen:30}}, // mitnehmen (K16 §5, K16b, GESCHÄTZT): beim Jobwechsel bis zu max Mitarbeiter, die mindestens wochen bei dir waren. freiSaisons: so lange bleibt ein Ex-Spieler ohne Job in der Liste (DP5)
  // Disziplin und Sportgericht (K09 §11, Welle 2). Anteile und Kartenquoten der Foularten sind auf die echten Häufigkeiten kalibriert (K09 §10),
  // nicht die Rohwerte aus §3.1: sonst gäbe es doppelt so viele Rote Karten. art: Vergehen vor dem Sportgericht.
  disziplin:{
    foulArten:{normal:{anteil:0.80,gelb:0.022},taktisch:{anteil:0.12,gelb:0.56},ruecksichtslos:{anteil:0.077,gelb:0.80,rot:0.022,art:'grob'},
      brutal:{anteil:0.0006,rot:1,art:'grob'},notbremse:{anteil:0.0012,rot:1,art:'notbremse'}},
    meckern:{jeSpiel:0.15,rot:0.02},       // Unsportlichkeit und Meckern: Gelb je Spiel und Mannschaft, ein kleiner Teil wird Rot (Beleidigung)
    taetlichkeit:{jeSpiel:0.0016,schwer:0.05}, // etwa eine Tätlichkeit je Liga und Saison (306 Spiele)
    faktoren:{hart:1.3,fair:0.7,hitzkopf:1.5,hitzkopfMeckern:2,hitzkopfTaetlichkeit:3,muedeUnter:60,muede:1.2,rueckstand:1.0,rueckstandAb:75, // Rückstand ×1,2 aus K09 §5.1 vorläufig aus (K09 §12 Nr. 9)
      mitGelb:{foul:0.35,karte:0.5}, // verwarnte Spieler foulen vorsichtiger, außer Hitzköpfen (Konsistenzprüfung AI4)
      derby:1.3}, // Derby oder brisantes Spiel (K09 §5.1, K17 §5.2, K09d, 22.11., popolupo): Karten nach Fouls ×derby. Nicht in Testspielen.
    gelbsperre:{liga:[5,10,15],pokal:[5],eu:[3,5,7,9],spiele:1},gelbRot:1, // nach der letzten Schwelle zählt es neu; eu: Europapokal nach der UEFA-Regel (K37, U19a)
    rot:{notbremse:[1,1,2],grob:[2,1,4],unsportlich:[2,1,5],taetlichkeit:[4,3,6],schwer:[8,6,12],wiederholung:1,wiederholungTage:365,zufall:1,verletzung:1,verletzungAbTagen:28},
    verfahren:{antragTage:[1,2],frist:2,urteilTage:[2,5],urteilSpaetestens:10,archiv:60},
    einspruch:{kosten:[10000,30000],gemindert:0.25,erhoeht:0.10,hart:{gemindert:0.35,erhoeht:0.05},eindeutig:{gemindert:0.10,erhoeht:0.15}},
    ki:{einspruchWichtig:0.6,einspruchSonst:0.1},
    // Vereinsstrafe nach einem Urteil (K09 §5.2, K14 §6, K09c, 22.11., popolupo, GESCHÄTZT): je Spiel Sperre jeSpiel nach Liga, Antwort binnen tage Tagen.
    // Verhängen: Stimmung des Spielers stimmung, Glaubwürdigkeit glaub, das Geld kommt in die Vereinskasse. Erlassen: erlassStimmung, erlassGlaub. Ohne Antwort keine Strafe.
    vereinsstrafe:{jeSpiel:{1:20000,2:8000,3:3000},tage:3,stimmung:-6,glaub:2,erlassStimmung:3,erlassGlaub:-1},
    // Zuschauer-Vergehen deines Vereins (K09 §4.4, §5.5, K09h): Vorfälle der letzten tage Tage. Ab dem zweiten kommt ein Zuschlag in Höhe der Strafe (× zuschlag, also verdoppelt),
    // ab dem ausschlussAb-ten bleibt beim nächsten Heimspiel ein Block mit dem Anteil block der Plätze leer (Teilausschluss). Werte vorläufig.
    zuschauer:{tage:365,zuschlag:1,ausschlussAb:3,block:0.1},
    // Trainer-Karten und Tribüne (K09 §5.4, K09g, 24.11., popolupo): Protest im Live-Spiel bis protestMinuten nach dem Anlass, Gelb mit protestGelb × Strenge des Schiedsrichters.
    // Jede sperreJe-te Gelbe der Saison sperrt sperreSpiele Pflichtspiele, Gelb-Rot gelbRotSpiele. Innenraumverbot nach Schiedsrichterkritik (K09f): ab ab früheren Fällen
    // so viele Spiele wie Fälle über ab − 1, höchstens max. Werte vorläufig (die vier Gelben wie in der Bundesliga seit 2019/20).
    // Seit K09i: Mit protestRot × Strenge zeigt der Schiedsrichter gleich Rot (vor der Gelben geprüft): Tribüne für den Rest und rotSpiele Spiele Sperre.
    trainer:{protestGelb:0.35,protestRot:0.04,rotSpiele:2,protestMinuten:2,sperreJe:4,sperreSpiele:1,gelbRotSpiele:1,innenraum:{ab:1,max:2}},
    schiri:{proLiga:24,strenge:[0.85,1.15],elfmeter:[0.9,1.1]}},
  // Medizin (K10 §11, Welle 2). Häufigkeit nach echten Ankern (UEFA-Studie: etwa 50 Verletzungen je 25er-Kader und Saison, 12–14 % des Kaders fehlen im Schnitt).
  // k: Anteil Kontakt (Foul, Zweikampf). Überlastung im Spiel zieht Arten mit Gewicht anteil × (1 − k), Kontakt anteil × k, Training anteil.
  medizin:{
    arten:{prellung:{name:'Prellung',g:'prellung',anteil:0.20,tage:[1,7],k:1,spritzen:true},
      zerrung:{name:'Zerrung im Oberschenkel',g:'muskel',anteil:0.25,tage:[8,30],k:0,rueckfall:0.12},
      faserriss:{name:'Muskelfaserriss',g:'muskel',anteil:0.12,tage:[21,49],k:0,rueckfall:0.15},
      baenderdehnung:{name:'Bänderdehnung im Sprunggelenk',g:'band',anteil:0.12,tage:[4,21],k:0.6,rueckfall:0.10,spritzen:true},
      baenderriss:{name:'Bänderriss im Sprunggelenk',g:'band',anteil:0.05,tage:[28,63],k:0.8,rueckfall:0.08},
      innenband:{name:'Innenbandverletzung im Knie',g:'knie',anteil:0.04,tage:[21,56],k:0.8,rueckfall:0.05},
      meniskus:{name:'Meniskusverletzung',g:'knie',anteil:0.02,tage:[42,100],k:0.4,rueckfall:0.10},
      kreuzband:{name:'Kreuzbandriss',g:'knie',anteil:0.01,tage:[180,300],k:0.3,rueckfall:0.10},
      bruch:{name:'Knochenbruch',g:'bruch',anteil:0.03,tage:[28,84],k:1},
      kopf:{name:'Gehirnerschütterung',g:'kopf',anteil:0.02,tage:[7,14],k:1,pflicht:true},
      sonstiges:{name:'Rücken- oder Leistenprobleme',g:'sonstiges',anteil:0.04,tage:[3,21],k:0.2,rueckfall:0.10,spritzen:true},
      krankheit:{name:'Infekt',g:'krankheit',anteil:0,tage:[2,10],k:0}},
    gruppen:{prellung:'Prellung',muskel:'Muskelverletzung',band:'Bandverletzung',knie:'Knieverletzung',bruch:'Verdacht auf Bruch',kopf:'Kopfverletzung',sonstiges:'Beschwerden',krankheit:'Infekt'},
    schiefe:1.7, // Dauer = min + (max − min) × Zufall^1,7: die meisten kurz, einige lang
    verschlimmerung:{prellung:'faserriss',baenderdehnung:'baenderriss',sonstiges:'zerrung'},
    risiko:{foul:0.012,schwere:{normal:1,taktisch:0.5,ruecksichtslos:4,brutal:10,notbremse:1.5},hartGegner:1.5, // je erlittenem Foul
      kollision:0.0016,ueberlastung:0.0022, // je Minute und Mannschaft
      frischeAb:80,frischeJePunkt:0.05,frischeKritisch:60,kritisch:2,stil:1.2,altAb:30,alt:1.3},
    robustheit:[1.6,-0.06],anfaellig:1.6,
    krankheit:{proTag:0.0006,winter:2,winterMonate:[11,0,1],ansteckung:2,ansteckungTage:5,hygiene:0.5}, // Spielwerte, nicht recherchiert. hygiene: Faktor während eines Hygieneplans (Karte „Grippewelle“, K10e, GESCHÄTZT)
    diagnose:{tage:[3,1],verdacht:0.6,genau:0.25,arzt:{ohne:2,jeQualitaet:-0.1,min:0.5},fehl:{ohne:0.15,jeQualitaet:-0.006,min:0.03,faktor:0.6,abTage:10}}, // Breite ±60 % und ±25 % bei Arzt-Qualität 10; fehl: Fehldiagnose (K10b, 22.11., GESCHÄTZT), Chance ohne + jeQualitaet × Arzt-Qualität (mindestens min), angezeigt faktor × wahre Dauer, ab abTage Tagen
    reha:{behandlung:0.7,rueckkehrFrische:[70,80],abTagen:7,fenster:56,rueckfallMal:7,gleicheArt:0.35},
    spritzen:{wirkung:0.95,verschlimmerung:0.15,arztAb:5},frueher:{frische:65,rueckfall:2}, // arztAb (K16 §8, K16d, 22.11., GESCHÄTZT): bei mehr Tagen in der angezeigten Spanne rät der Arzt vom Spritzen ab
    // Zweite Meinung (K10 §5, K10c, 22.11., popolupo, GESCHÄTZT): einmal je Verletzung nach der Diagnose, kosten nach Liga; mit besser eine bessere Behandlung (Rest × (1 − aenderung)),
    // mit schlechter mehr Schaden als gedacht (Rest × (1 + aenderung)), sonst eine engere Spanne (Breite × enger). Eine Fehldiagnose (K10b) deckt sie immer auf.
    zweite:{kosten:{1:15000,2:8000,3:4000},besser:0.2,schlechter:0.05,aenderung:0.15,enger:0.5},
    verlaufTage:730},
  // Wettbewerbe und Spielplan (K13 §11, Welle 2): Pokal-Auslosung, Heimrecht der Amateure (3. Liga und darunter) bis zum Halbfinale (Runde 4), Supercup, 72 Stunden
  // supercup.praemie (K13b, 22.11.2026): Franz-Beckenbauer-Supercup 2025, 3 Mio. € für den Sieger, 2 Mio. € für den Verlierer (Websuche 22.11., Medienberichte, keine offizielle DFL-Quelle)
  // pokal.rotation (K13e, 23.11., GESCHÄTZT): Pokal-Rotation rächt sich, wenn du als Favorit (Amateur oder Niveau mindestens favorit unter deinem) ausscheidest und mindestens wechsel Spieler der Startelf des letzten Ligaspiels getauscht hast
  wettbewerbe:{pokal:{auslosungTage:14,profitopfZweite:14,heimrechtBisRunde:4,losTopAb:80,rotation:{favorit:5,wechsel:4}},supercup:{vorSpieltag:6,anstoss:'20:30',praemie:{sieger:3e6,verlierer:2e6}},spielplan:{mindestTage:3},
    // Spielverlegung auf Antrag (K13 §13, K13d, 23.11., popolupo, vorläufig): wie die Regel der DFL aus der Corona-Zeit, mindestens minSpieler einsatzfähige Spieler, darunter ein Torwart, sonst Verlegung möglich.
    // Für dein Ligaspiel in höchstens vorTage Tagen, höchstens proSaison je Saison, neuer Termin bis sucheTage später und vor dem letzten Spieltag deiner Liga.
    verlegung:{minSpieler:16,vorTage:7,proSaison:1,sucheTage:60}},
  // Testspiele und Trainingslager (K11 §11, Welle 2). Geldbeträge und Zusagen sind Spielwerte (K11 §12 Nr. 4).
  testspiele:{abWoche:3,wechsel:11,frische:0.7,risiko:0.6,praxis:0.6,vertrautheit:2,form:0.3,
    zusage:{grund:0.6,staerker:0.4,schwaecher:1.3,staerkerAb:4,schwaecherAb:4,kalender:0.2,region:1.2,vorbereitung:1.2,saison:0.7,min:0.05,max:0.95},
    antwortTage:[1,3],abstandPflichtspiel:2,vorlaufTage:4,planTage:42,maxProWoche:2,vorschlaege:8,
    nachfrage:{start:0.12,jeWoche:-0.015,min:0.04,grosserName:2,grossAb:80},gageAmateur:[10000,80000],
    // Sommerturnier (K11 §3, K11b, 22.11., GESCHÄTZT): Antrittsgeld und Siegprämie je Liga, Stimmung aller beim Turniersieg
    turnier:{name:'Sommerturnier',antritt:{1:150000,2:60000,3:25000},sieg:{1:100000,2:40000,3:15000},stimmung:1},
    kiAnfrage:{chance:0.35,tage:3},spielfrei:{tage:7,abstandTage:7}}, // Anfragen der Computer-Vereine in der Vorbereitung (K11c, GESCHÄTZT): montags mit chance, Antwort binnen tage; spielfrei: Erinnerung „spielfreie Woche ohne Testspiel“ (K01 H9, K11d), Blick auf tage Tage, höchstens einmal je abstandTage
  lager:{orte:{alpen:{name:'Alpen',saison:'sommer',kosten:40000,kondition:1.15,text:'Höhenlage: Kondition wirkt stärker'},schwarzwald:{name:'Schwarzwald',saison:'sommer',kosten:25000,text:'günstig und ruhig'},
      algarve:{name:'Algarve',saison:'winter',kosten:50000,text:'mildes Wetter'},andalusien:{name:'Andalusien',saison:'winter',kosten:55000,text:'warm, gute Plätze'},
      riviera:{name:'Türkische Riviera',saison:'winter',kosten:30000,ablenkung:true,text:'günstig, aber mehr Ablenkung'},golf:{name:'Golfregion',saison:'winter',kosten:90000,text:'sehr warm, lange Reise'},
      heimat:{name:'Heimat',saison:'beide',kosten:0,wetter:0.2,text:'kein Ortswechsel, im Winter fällt öfter Training aus'}},
    ligaFaktor:{1:1,2:0.6,3:0.35},tage:[5,10],training:1.15,vertrautheit:1.25,zusammenhalt:1,zusammenhaltBis:7,kollerAb:8,koller:0.13,kollerSv:-0.5,ablenkung:0.15,ablenkungSv:-1},
  // Stimmung, Kaderrollen, Wechselwunsch, Kabine, Zusammenhalt, Beziehungen, Kapitän (K14 §11, U8). Spielwerte, kalibriert mit tests/kabine.js
  kabine:{start:[60,75],                // Stimmung zu Beginn (0–100)
    rollen:{schluessel:0.85,stamm:0.65,rotation:0.40,ergaenzung:0.15,talent:0.15,pokal:0.9}, // erwartete Einsatzzeit je Kaderrolle (Anteil der Minuten), „spielt im Pokal“: Anteil der Pokalspiele
    einsatzTempo:0.2,                   // gleitender Schnitt der Einsatzzeit je Pflichtspiel (wirkt wie etwa sechs Wochen)
    schluesselAnzahl:3,rotationAnteil:0.5,talentBis:21,ehrgeizigAb:15, // Rollen nach Rang in der Gruppe: Stammplätze, dazu halb so viele Rotationsplätze
    ziel:{basis:60,einsatz:[-28,10],erfolg:[-10,10],leistung:[-5,5],vertrag:[-15,5],trainer:[-15,10],umfeld:[-10,5]},
    einsatz:{skala:40,ehrgeiz:[0.5,0.05]},    // (Anteil − Erwartung) × 40 × (0,5 + 0,05 × Ehrgeiz), negativ verstärkt durch Ehrgeiz
    // Bankzeit nach Grund (K14 §12, U8d): Der Grund entscheidet, ob ein Spiel ohne Einsatz für die Einsatzzeit zählt und was es sofort an Stimmung kostet oder bringt
    bank:{frischeUnter:85,englischTage:4,     // Rotation: Stammspieler mit Frische unter 85 % oder in einer englischen Woche (höchstens 4 Tage zum Spiel davor oder danach)
      rotationReihe:2,rotationAngekuendigt:3,angekuendigt:1, // höchstens zwei Spiele in Folge (angekündigt drei), angekündigt +1 Stimmung
      joker:{note:2.5,stimmung:3,kurz:60,starke:3,von:5},    // eingewechselt mit Tor oder Note bis 2,5: +3 und erfüllt. Ehrgeizige: drei starke Kurzeinsätze in fünf heben die Einschätzung
      rivale:{staerke:3,schonfrist:3,je:1,max:10,sofort:-1,sv:-0.2,lernen:1.1,haltenAb:30}, // Konkurrent in der Startelf: nach drei Spielen −1, −2 … bis −10. Diven und Nervenschwache sofort, Kämpfer lernen ×1,1
      unerfahren:{spiele:10,kader:1,einsatz:3,einsatzMin:10,debuet:5}, // unter 10 Profi-Pflichtspielen: keine Erwartung, Kader +1, Einsatz ab 10 Minuten +3, Debüt +5
      torwart:{duell:2,woche:-1,klarNach:5},                 // Nummer 2 höchstens 2 Punkte dahinter: beide −1 pro Woche, bis fünf Spiele in Folge derselbe im Tor steht
      aufbau:{abTagen:14,tage:21},                           // nach einer Verletzung ab 14 Tagen: drei Wochen ohne Erwartung
      formkrise:{note:4.0,noten:3,faktor:0.5,sv:0.2},        // Notenschnitt der letzten fünf Einsätze ab 4,0: die Bank zählt halb
      tribuene:-2,                                           // gesund, aber nicht im Spieltagskader (Rolle ab Rotation)
      frueh:{vor:46,stimmung:-3,sv:-0.5},spaet:{nach:88,minuten:3,etabliert:-1,unerfahren:1},
      erfolg:{ab:3,je:0.15,min:0.5,max:1.5},                 // Serie der letzten fünf Spiele gegen die Erwartung: Siegesserie halbiert die Abwertung, Krise ×1,5
      chance:{spiele:3,note:3.0},                            // Vertreter eines fehlenden Stammspielers mit Notenschnitt bis 3,0 nach drei Spielen
      sperre:{hitzkopf:-1},fuehrer:{freunde:-1},altstar:{ab:31,spiele:200},
      // Neuer Trainer (K14 §12, K14f, 24.11., popolupo, vorläufig): Übernimmst du einen Verein, hoffen seine Reservisten (Stimmung + hoffen) und tage Tage lang zählt kein
      // Bankplatz deiner Spieler. Nur dein Verein (Trainerwechsel der Computer-Vereine ändern nichts, sonst verschöbe sich die Kalibrierung).
      neuerTrainer:{tage:28,hoffen:2},
      bedeutungslos:{spieltage:5,plus:2,minus:-2,minuten:20,grenzen:{1:[1,4,6,15,16],2:[2,3,15,16],3:[2,3,16]}},
      pokalTempo:0.5,diva:2},
    erfolg:{abSpiele:3,platz:25,platzMax:7,serie:1,serieMax:3,zerfall:0.9},
    // Teamprämie (K21 §3.2, K21b, 22.11., popolupo, GESCHÄTZT): vor dem ersten Ligaspiel normal (in den Gehältern) oder hoch. Hoch: je Ligasieg jeSpieler × Kadergröße
    // zusätzlich, Baustein Erfolg der Stimmung + stimmung. Ab der A-Lizenz (Bereich praemien).
    teampraemie:{stimmung:2,jeSpieler:{1:15000,2:4000,3:1000},pokal:{1:20000,2:6000,3:2000},aufstieg:{2:50000,3:15000},klassenerhalt:{1:30000,2:10000,3:3000},stufen:{normal:'normal (in den Gehältern enthalten)',hoch:'hoch (Sieg- und Pokalprämie obendrauf)'}}, // pokal (K21d, 23.11., GESCHÄTZT): je gewonnene Runde im DFB-Pokal und Spieler; aufstieg und klassenerhalt (K21e, GESCHÄTZT): je Spieler zum Saisonende, Klassenerhalt nur mit diesem Saisonziel
    leistung:0.5,                        // (Form − 10) × 0,5
    vertrag:{unter:0.8,minus:12,ueber:1.15,plus:3,auslaufend:-3,soeldner:1.5,max:-8}, // vorläufig höchstens −8, bis K21 das Gehaltsgefüge baut
    rolle:{zuNiedrig:-4,diva:2,hoeher:1,hoeherMax:2},           // deine Rolle unter seiner Einschätzung: −4 je Stufe (Diva doppelt)
    trainerZerfall:0.1,                  // Wirkung von Gesprächen im Baustein „Trainer“ verblasst um 10 % pro Woche
    traegheit:0.2,wocheMax:8,sofortMax:10,
    rufGefaelle:{ab:15,lob:0.5,kritik:2,einsatz:1.5,trainer:[50,0.3,0.5,95]}, // Ruf des Trainers in der Kabine seit U12h (K28 §5.4): 50 + 0,3 × Ansehen + 0,5 je Punkt Ruf über dem Start, höchstens 95 (vorher 3 je Trainerjahr)
    folgen:{leistung:{unter:20,minus:0.03,ueber:85,plus:0.02},lernenUnter:30,lernen:0.7,vertragUnter:[40,25],vertragAufschlag:0.25},
    wechsel:{grummeln:[45,2],gespraech:[40,2],offiziell:4,oeffentlich:4,oeffentlichChance:0.1,oeffentlichDiva:0.3,abloese:0.9,teamMinus:3,zurueckAb:50},
    ansteckung:{fuehrerUnter:35,freunde:-2,fuehrerUeber:70,alleUnter:50,alle:1},
    gruppe:{min:3,unter:35,zh:-2},
    zusammenhalt:{start:50,stammelf:1,stammelfGleich:9,sieg:1,lager:1,neuer:-5,neuerWochen:8,streit:-3,ausgleich:0.04,wirkung:[0.97,0.0006]},
    beziehungen:{freundChance:0.25,freundAlter:4,maxFreunde:3,rivaleChance:0.3,rivaleStaerke:3,rivaleEhrgeiz:13,rivaleEnde:8,rangelei:0.02,
      verkauf:-8,lernen:1.05},
    kapitaen:{fuehrungAb:14,wochen:52,bonus:[1,2],gewicht:2.5,fuehrer:2,absetzen:-10,absetzenFreunde:-3},
    teamevent:{stimmung:5,zh:5,kosten:{1:50000,2:25000,3:10000},wochen:4},
    urlaub:{lang:3,kurz:-3,wochen:8},
    ki:{gelingt:0.55,stimmung:5}},      // Computer-Trainer: Gespräch bei Gesprächswunsch gelingt zu 55 % (K15 §7, Klugheit „normal“, bis K02 Klugheitsstufen hat)
  // Jugend und Talententwicklung (K08 §11, U9c). Der Jugendkader gehört deinem Verein, Computer-Vereine bekommen ihre Aufrücker weiter über saison.nachwuchs.
  jugend:{
    // Jugendniveau (deine Vorgabe vom 13.11.): Die Ausgaben (Stufe 1–5) setzen das Ziel, das Niveau folgt langsam. Mit +6 je Saison dauert es von 0 bis zum Deckel etwa zwölf Saisons.
    // Startwert 10 + 0,5 × Ansehen. Deckel 70, bis es das Leistungszentrum gibt (K26). Talent des Jahrgangs: (Niveau − 40) × 0,15.
    niveau:{start:[10,0.5],ziel:[0,15,35,55,75,95],deckel:70,aufbau:6,abbau:10,mitte:40,jeTalent:0.15},
    // Jahrgang: Talent = Grundstärke des Vereins − 12 + Niveau + Jugendtrainer/4 + Region + Zufall, höchstens Grundstärke + 12. Stärke mit 15 = Talent − 19 bis 29.
    // Abschlag und Abstand sind so gewählt, dass die zwei Besten eines Jahrgangs mit 17 den Aufrückern eines Computer-Vereins entsprechen (tests/jugend.js).
    jahrgang:{anzahl:[3,6],alter:15,abschlag:12,jeTrainer:0.25,region:2,regionAbFans:40000,zufall:[-8,12],abstand:[19,29],deckel:12,gold:{chance:0.03,plus:5}},
    start:{alter:[15,16,17,18],bleiben:[1,0.9,0.75,0.6]},   // erster Jugendkader: vier Jahrgänge, die Älteren ausgedünnt
    aufruecken:{ab:17,spaetestens:19,auto:2,erinnerungTage:35},
    // Geld für Abgänge: Verkauf aus der Jugend ab 16 zum halben Marktwert, mit 19 als Ausbildungsentschädigung 60 % davon, unter 100.000 € nur Amateure (kein Geld).
    // Beteiligung am Weiterverkauf: 15 %, fünf Jahre lang, je Jahr 12 % Chance auf einen Wechsel für das 1,5- bis 4-Fache des damaligen Werts.
    verkauf:{ab:16,faktor:0.5,mit19:0.6,minWert:100000,runden:10000,anteil:0.15,jahre:5,weiterChance:0.12,weiterFaktor:[1.5,4],merken:40},
    training:{basis:0.8,jeNiveau:0.004,jeTrainer:0.01,praxis:50,form:10}, // Trainingsfaktor im Jugendkader: 0,8 + 0,004 × Niveau + 0,01 × Jugendtrainer
    stab:{vereinslos:8},
    pate:{wachstum:1.1,profi:0.3,jeMentor:2,bisAlter:21},
    // Prägungen (K08 §5.3): [Chance Schub, Chance Knacks] je Anlass. faktor: Häufigkeit insgesamt, kalibriert auf 2–5 Prägungen je Verein und Saison.
    praegung:{faktor:1,debuet:[0.15,0.05],topspiel:[0.20,0.12],tor:[0.30,0],fehler:[0,0.30],topAbRunde:3,topPlaetze:4,topAbSpieltag:5,spaetAb:80,
      druck:{schub:[0.5,0.05],knacks:[1.5,-0.05]},note:1.3,sieg:1.2,niederlage:1.2,
      umgang:{loben:1.3,schuetzen:0.5,kritik:1.5,tage:3},belastung:1.5,psychologe:-0.02,
      schub:{talent:[0.25,2,6],tempo:1.3,tage:90,sv:1,stimmung:5},knacks:{talent:[0.15,1,3],tempo:0.5,tage:[30,90],sv:-1,stimmung:-5},bisAlter:21,verlauf:6},
    // Belastung junger Spieler (K08 §5.4): Minutenanteil + 0,1 je Druckspiel der letzten acht Wochen, Grenze 0,85 bis 19 Jahre und 1,0 bis 21
    belastung:{tage:56,druck:0.1,grenze:[[19,0.85],[21,1.0]],verletzung:1.3,stimmung:-2}},
  // Zweite Mannschaft (K08 §5.6, U9d): Amateurkader deines Vereins in der Regionalliga (4) oder Oberliga (5), ohne simulierte Spiele.
  // Ligen: Stärke des Ligaschnitts und eines guten Teams (gemessen an der 3. Liga: Schnitt 63, Schlusslicht um 59). Die Regionalliga-Meisterschaft bringt vorerst keinen Aufstieg.
  // Saison: 18 Teams mit Hin- und Rückspiel, Gegner mit Stärke Schnitt ± Streuung, erwartete Tore = tore × e^(k × Abstand), zu Hause × heim.
  // Die Oberliga ist der Boden (ab:0): Tiefer fällt die Zweite im Spiel nicht, die Verbandsligen gibt es nicht.
  // Budget in fünf Stufen: Kosten je Ligaspieltag (Oberliga × 0,3), Stärke der Neuen gegenüber dem Ligaschnitt, Trainingsfaktor. Start und Automatik nach Ansehen (ab 80 Stufe 4, sonst 3).
  // Deckel (deine Vorgabe vom 13.11.): Die Zweite spielt nie stärker als ein gutes Team ihrer Liga und immer mindestens 8 Punkte unter der Kaderstärke der Profis.
  // Kader: 22 Spieler bis 23 Jahre (U23), höchstens 26. Wer 24 wird, geht zu den Amateuren (kein Geld). Neue kommen jeden Sommer mit 18 bis 21 Jahren.
  // Talent der Neuen = Ligaschnitt + Stufe (zugang) + Zufall, höchstens Deckel + 2. Stärke = Talent − 1 bis 4, je Jahr unter 21 weitere 1,5.
  // Die 14 Stärksten spielen regelmäßig (Spielpraxis 70, die übrigen 35). Aufrücken mit Profivertrag über drei Jahre zum halben üblichen Gehalt.
  // Automatik (K36): 19-Jährige aus der Jugend, die höchstens 3 unter der Stärke der Zweiten liegen, gehen in die Zweite. Jeden Sommer rückt höchstens einer auf,
  // wenn er höchstens 4 unter der Kaderstärke der Profis liegt. Verkauf ab 18 zur Hälfte des Marktwerts, Beteiligung wie bei der Jugend. Profivereine zahlen nur für Spieler
  // ab Stärke 59 (ein Kaderspieler in der 3. Liga), sonst gingen jeden Sommer 22 kostenlose Neue für mehrere Hunderttausend Euro weg (U9d, Befund BB).
  zweite:{
    ligen:{4:{name:'Regionalliga',schnitt:57,gut:60,teams:18,auf:0,ab:3,kosten:1},5:{name:'Oberliga',schnitt:51,gut:54,teams:18,auf:1,ab:0,kosten:0.3}},
    saison:{streuung:2.5,tore:1.4,heim:1.1,k:0.08},
    stufe:{kosten:[0,15000,30000,50000,80000,120000],zugang:[0,-5,-3,-1,0.5,2],training:[0,0.9,0.95,1,1.05,1.1],start:[[80,4],[0,3]]},
    deckel:{profiAbstand:8},
    kader:{soll:22,max:26,bisAlter:23,zugangAlter:[18,21],zugangZufall:[-4,4],talentUeber:2,abstand:[1,4],abstandAb:21,abstandJeJahr:1.5,stamm:14,startAlter:[18,23],pos:{TW:3,AB:7,MF:7,ST:5},verlauf:10},
    praxis:{stamm:70,rest:35,form:10},
    aufruecken:{gehalt:0.5,vertrag:3,ausJugendAb:17,autoAbstand:4,auto:1},
    ausJugend:{autoAbstand:3,vertrag:2,gehalt:0.3},
    verkauf:{ab:18,faktor:0.5,abStaerke:59}},
  // Scouting und Informationsnebel (K18 §11, U9a). Spannen sind ehrlich: der wahre Wert liegt in mindestens 80 % der Fälle darin (z = 1,4 ergibt etwa 84 %)
  scouting:{grund:{eigen:100,liga:40,jeSpiel:5,deutsch:25,unten:15,ausland:5,jugend:0},
    sicht:[[10,10],[20,7],[30,4.8],[45,3.5],[60,2.5],[80,2],[101,1]], // [bis Kenntnis, Spanne ± Stärke ohne Scout-Fehler], kalibriert auf die Fehlkäufe in tests/scouting.js
    z:1.4,proWoche:{basis:12,q:[0.6,0.03],gebiet:1.3,fremd:0.8},
    fehler:{je:0.15,lieblingstyp:[1,3],lieblingsChance:0.3},   // Grundfehler eines Scouts: Streuung 0,15 × (21 − Qualität)
    verblassen:2,                                             // je Monat ohne Beobachtung, nicht unter die Grundkenntnis
    kosten:{inland:3000,ausland:15000},                       // je Beobachtungswoche (Spielwerte, K23)
    // Seit K18g (24.11., popolupo, vorläufig) mit Scoutbericht in der Vorschau: wahrscheinlicher Stil, Reaktion auf deinen Lieblingsstil, die drei Stärksten der Elf
    // und wer von den bericht.top Stärksten des Kaders fehlt (verletzt oder gesperrt). Nur Anzeige.
    gegner:{kosten:3000,bericht:{top:14}}, // Gegnerbeobachtung vor dem nächsten Pflichtspiel (K18c, 22.11., GESCHÄTZT): Reisekosten einmal
    daneben:{ab:5}, // Scout liegt daneben (K18 §8, K18e, 22.11.): gekaufter Spieler mindestens ab unter der Mitte der Einschätzung beim Kauf
    konkurrenz:{chance:0.25,preis:0.05,tage:60}, // Konkurrenz am Tisch (K18 §8, K18d, 22.11., GESCHÄTZT): nach einem Scoutbericht mit chance ein Verein mit Bedarf, Forderung an dich + preis für tage Tage
    suche:{kandidaten:[3,8],jeWoche:4,anteil:0.5},             // Suchauftrag: je Woche vier neue Namen, Beobachtung mit halber Wirkung
    empfehlung:{verpflichten:1,beobachten:-3},                 // Mitte gegen deinen Stammspieler auf der Position
    start:{scouts:[[0,1],[60,2],[80,3]],vereinslos:8}},        // Scouts je Verein nach Ansehen, dazu vereinslose
  // Gespräche und Ansprachen (K15 §11, U8): Glaubwürdigkeit, Wirkung, Abnutzung, Versprechen, Mannschaftsansprache
  gespraeche:{proWoche:3,schuetzenSv:0.3,
    glaubwuerdigkeit:{start:60,faktor:[0.5,0.7],erholungBis:60,erholung:1,gehalten:3,gebrochen:-10,offenAb:4,offenMinus:2,krise:25,krisenVorstand:-3,
      jeRuf:0.3,neuGrenzen:[30,90]}, // U12h (K28 §5.4, 22.11., GESCHÄTZT): Start beim neuen Verein = start + jeRuf × (Ruf − Startruf), in neuGrenzen
    wirkung:{rolle:3,einsatz:10,geduld:5,wechsel:8,konkurrent:6,schuetzen:3,lob:4,kritik:-4,unpassend:-0.5,nachStreit:0.5,nachStreitTage:28,trainerAnteil:0.5},
    lage:{lobBis:3,kritikAb:4},           // Lob passt bei einer Note bis 3,0, Kritik ab 4,0 (letztes Spiel)
    abnutzung:{wochen:4,zweites:0.5,danach:0.2},
    loesen:{basis:0.15,jePunkt:0.04,min:0.05,max:0.9}, // Gesprächswunsch gelöst mit 15 % + 4 % je Punkt Wirkung
    streit:{stimmung:-5},
    versprechen:{gehalten:5,gebrochen:-15,stufe:1,
      einsatz:{spiele:5,anteil:0.6},geduld:{tage:42},wechsel:{tage:120},konkurrent:{tage:120,staerke:2}},
    reaktion:{   // K15 §5.2: Faktor je Haltung (verständnisvoll, sachlich, bestimmt), Lob, Kritik (negativ = Kritik schadet, positiv = Kritik hilft)
      kaempfer:{v:0.8,s:1,b:1.3,lob:1,kritik:3},diva:{v:1.4,s:0.8,b:0.4,lob:1.5,kritik:-8,streitB:0.3,lobAbnutzung:2},
      nervenschwach:{v:1.3,s:1,b:0.5,lob:1.2,kritik:-8,sv:-0.5},hitzkopf:{v:1,s:1,b:0.7,lob:1,kritik:-4,streitB:0.2,streitKritik:0.2},
      vorbildprofi:{v:1,s:1.2,b:1,lob:0.7,kritik:-2},fuehrungsspieler:{v:1,s:1.2,b:1,lob:1,kritik:-2},soeldner:{v:0.7,s:1,b:1,lob:0.7,kritik:-4}},
    persoenlichkeit:0.02,                 // Anpassungsfähigkeit verschiebt die Wirkung um ±2 % je Punkt Abstand von 10
    mannschaft:{proWoche:1,rueckendeckung:{sv:0.3,stimmung:3},weckruf:{note:1.2,spiele:2,kaempfer:2,diva:-2},ziel:{stimmung:2},endspiel:{wirkung:0.02,nervenschwach:-0.02},rotation:{tage:7,unpassend:-1}},
    halbzeit:{passend:1,unpassend:-2}}, // Glaubwürdigkeit nach einer passenden oder unpassenden Halbzeitansprache
  // Live-Spiel (K05 §11): Tempo, Halte, Wechsel, Umstellungszeit, Zurufe, Halbzeitansprache, Computer-Trainer, Druckleiste
  live:{tempo:{langsam:2000,normal:1000,schnell:300},
    anhalten:{tor:true,rot:true,verletzung:true,elfmeter:true,gelbRotGefahr:true,frischeUnter:55},
    wechsel:{anzahl:5,gelegenheiten:3,verlaengerung:1,bank:9},
    umstellung:{ordnung:5,ausrichtung:2},
    verletztFrische:30,              // ein verletzter Spieler humpelt bis zum Wechsel (Frische höchstens 30)
    zurufe:{dauer:10,abnutzungMinuten:15,druck:{angriff:1.08,abwehr:0.97,frische:1.2},ruhe:{abwehr:1.03,angriff:0.95,fouls:0.85},konzentration:{patzer:0.7},
      zeit:{angriffe:0.8,gelb:3,gelbJeMinute:0.002},spieler:{sv:0.3,wirkung:0.02,hitzkopfFouls:1.5}},
    ansprache:{loben:{sv:0.3},motivieren:{wirkung:0.02},fordern:{kaempfer:0.03,empfindlich:-0.02},beruhigen:{fouls:0.8,patzer:0.8},augenzwinkernd:{wirkung:0.01},unpassend:-0.5,abnutzungSpiele:3},
    ki:{muedeUnter:65,wechselVon:55,wechselBis:86,chanceJeMinute:0.13,frischAb:58,frischUnter:93,toleranz:6,gelbAb:60,jeGelegenheit:2,rueckstandAb:60,alleNachVorn:80,fuehrungAb:75},
    druckleiste:{minuten:5,gross:3,halb:1,ecke:0.5}},
  // Schwierigkeit (K02 §5.4): ändert nur Bedingungen, Information und Hilfen. Werte und Würfel im Spiel sind auf allen Stufen gleich.
  // ziel: Saisonziel um so viele Plätze leichter (+) oder strenger (−). sterneGenau: Talentsterne eigener Spieler sofort genau. sterneWochen: Faktor auf die Zeit, bis sie genau sind.
  schwierigkeit:{standard:'normal',
    stufen:{leicht:{name:'Leicht',text:'mehr Geld, geduldiger Vorstand, genaue Talentsterne',konto:1.5,kredit:1.5,entlassenUnter:5,schonfrist:10,ziel:1,sterneGenau:true,sterneWochen:1,erinnerungen:true},
      normal:{name:'Normal',text:'so, wie das Spiel gedacht ist',konto:1,kredit:1,entlassenUnter:12,schonfrist:6,ziel:0,sterneGenau:false,sterneWochen:1,erinnerungen:true},
      schwer:{name:'Schwer',text:'weniger Geld, ungeduldiger Vorstand, strengeres Ziel, keine Erinnerungen',konto:0.7,kredit:0.6,entlassenUnter:18,schonfrist:4,ziel:-1,sterneGenau:false,sterneWochen:1.5,erinnerungen:false}}},
  vorstand:{
    staerkerAb:5,                    // Gegner gilt als stärker/schwächer ab diesem Unterschied im Ansehen
    sieg:{staerker:4,sonst:2.5},
    remis:{staerker:1,schwaecher:-1,sonst:0},
    niederlage:{staerker:-1,schwaecher:-3.5,sonst:-2.5},
    platzAbSpieltag:5,               // ab so vielen eigenen Ligaspielen zählt der träge Anteil (Tabellenplatz, Serie)
    kontoMinusMeldung:0.3,           // Chance je Woche auf die Meldung „Der Vorstand ist alarmiert“ bei Konto im Minus
    // Vertrauen mit Bausteinen (K28 §5.1, §5.6, U12a). schnell: Gewicht der Werte je Sieg, Remis, Niederlage. Montags um traegheit Richtung Ziel = basis + Sport + Serie + Finanzen + Umfeld.
    // Sport: jePlatz × (Saisonziel − Platz) in sport. Serie wie bei Computer-Vereinen. Finanzen: kontoMinus bei Konto im Minus, kredit mit Kredit, zusammen mindestens finanzMin.
    // Umfeld: bei Glaubwürdigkeit unter glaubUnter linear bis umfeldMin.
    vertrauen:{schnell:0.5,traegheit:0.2,basis:50,jePlatz:5,sport:[-35,25],serieSpiele:5,serieMitte:1.3,serieFaktor:10,serie:[-15,10],kontoMinus:-15,kredit:-5,finanzMin:-15,glaubUnter:25,umfeldMin:-10,gehaltUeber:-5}, // gehaltUeber: Gehälter über dem Rahmen (K23d)
    // Ultimatum statt sofortiger Entlassung (K28 §5.3, U12a): spiele Ligaspiele Zeit, danach Entlassung mit entlassung.basis + jeGeduld × Geduld, sonst ein letztes Ultimatum.
    ultimatum:{spiele:2,entlassung:{basis:0.9,jeGeduld:-0.03}},
    // Ruf als Trainer (K28 §5.4, U12a), 0–100. Zum Saisonende erst vergessen (Richtung start), dann die Anlässe. jobsJePunkt: so viel Ansehen mehr je Punkt Ruf über start bei Jobangeboten.
    // geduldig: Grenzen für die Anzeige der Geduld des Präsidenten (bis ungeduldig: „ungeduldig“, ab geduldig: „geduldig“).
    ruf:{start:30,vergessen:0.05,jePlatzUeber:3,meister:15,pokal:10,aufstieg:8,abstieg:-6,verfehlt:-4,entlassung:-8,ruecktritt:-5,jobsJePunkt:1,ungeduldig:7,geduldig:14},
    // Nebenziele (K28 §3.1, §5.7, U12b): anzahl [normal, Präsident mit Ehrgeiz ab ehrgeizigAb]. pokalRunde je Liga: Index in POKAL_RUNDEN, die erreicht werden muss.
    // jugend: Spieler bis jugendBis zusammen jugendEinsaetze Einsätze. finanzen: Summe der Buchungen der Saison mindestens 0. profil: dieses Nebenziel kommt beim Profil zuerst (K31 §3.2).
    // Baustein „Ziele“ im Vertrauen (montags): erfuellt, verfehlt, gefaehrdet je Nebenziel, begrenzt auf baustein. Saisonende: saisonErfuellt oder saisonVerfehlt je Nebenziel.
    nebenziele:{anzahl:[1,2],ehrgeizigAb:14,pokalRunde:{1:2,2:1,3:1},jugendBis:21,jugendEinsaetze:25,profil:{ausbildung:'jugend',sparsam:'finanzen',ehrgeizig:'pokal'},
      erfuellt:5,verfehlt:-5,gefaehrdet:-3,baustein:[-10,10],saisonErfuellt:5,saisonVerfehlt:-5},
    // Zielgespräch (K28 §5.2, U12e, 22.11., ALLE WERTE GESCHÄTZT): offen ab dem Setzen des Saisonziels bis zu deinem nächsten Ligaspiel, eine Entscheidung je Saison.
    // Hochpokern um 1 bis maxPlaetze Plätze: immer angenommen, Transferbudget +budgetHoch je Platz, zum Saisonende Ruf +rufHoch je Platz, wenn das Ziel erreicht ist.
    // Tiefstapeln: Zusage mit tief.basis − tief.weiterer × (Plätze − 1) + jeVertrauen × (Vertrauen − 50) + jeRuf × (Ruf − Startruf), bei einem ehrgeizigen Präsidenten
    // (ab nebenziele.ehrgeizigAb) − ehrgeiz, bei einem ruhigen (bis ruhigBis) + ehrgeiz, begrenzt auf grenzen (eigener Strom). Zugesagt: Transferbudget −budgetTief je Platz,
    // der Ruf rechnet „übertroffen“ weiter vom Vorschlag aus (kleinere Prämie). Abgelehnt: Vertrauen abgelehnt, das Ziel bleibt.
    // ueberBudget: Kauf über dem Transferbudget kostet Vertrauen je angefangene 10 % der Ablöse über dem Budget, höchstens ueberMax.
    // Zwischenbilanz im Winter (K28 §4 Nr. 3, U12f, 22.11., GESCHÄTZT): in der ersten Woche nach der Hälfte deiner Ligaspiele. Liegt der Platz mindestens abstand besser als das Ziel,
    // hebt der Vorstand es um hoch an (der Ruf rechnet dann von dort). Liegt er mindestens abstand schlechter, kannst du bis zum nächsten Ligaspiel beantragen, es um senken zu senken:
    // Zusage mit antrag.basis + jeVertrauen × (Vertrauen − 50) + jeRuf × (Ruf − Startruf), begrenzt (eigener Strom). Zugesagt wirkt es wie Tiefstapeln (Budget, Ruf), abgelehnt: Vertrauen abgelehnt.
    zwischenbilanz:{abstand:4,hoch:1,senken:1,antrag:{basis:0.5,jeVertrauen:0.005,jeRuf:0.005,grenzen:[0.05,0.95]},abgelehnt:-3,
      vonSichAus:6}, // U12k (22.11., GESCHÄTZT): ab so vielen Plätzen hinter dem Ziel senkt ein geduldiger Präsident (Geduld ab ruf.geduldig) von sich aus um senken
    zielgespraech:{maxPlaetze:2,budgetHoch:0.1,budgetTief:0.15,rufHoch:2,tief:{basis:0.6,weiterer:0.2,jeVertrauen:0.005,jeRuf:0.005,ehrgeiz:0.15,ruhigBis:7,grenzen:[0.05,0.95]},abgelehnt:-3,ueberBudget:-1,ueberMax:-10},
    entlassenUnter:12,schonfristSpieltage:6, // entlassen erst nach mehr als so vielen eigenen Ligaspieltagen. Die Schwierigkeit ersetzt beide Werte.
    pokalAus:-6,pokalWeiter:1.5,pokalSieg:10,
    saisonErreicht:20,saisonWeitAb:3,saisonWeit:-25,saisonVerfehlt:-8,entlassenSaisonUnter:15,
    neuerJob:55,
    praesident:{min:1,max:20, // Geduld, Ehrgeiz, Sparsamkeit des Präsidenten (K28 §3), fest aus der Vereinsnummer und der Zahl der Wechsel (versatz je Wechsel)
      // Präsidentenwahl (K28 §8, K25 §5.5, U12i, 22.11., GESCHÄTZT): Mitgliederversammlung im Sommer alle jahre (je nach Vereinsnummer). Der Präsident bleibt mit bleiben
      // + jePunkt × (Punkte je Spiel − mitte) + aufstieg/abstieg + fans × (Fanstimmung − 50), in grenzen. Sonst ein neuer; bei dir rückt das Vertrauen um vertrauen Richtung 50.
      // U12m (K28 §5.12 „Mitglieder als Stimmen“, 23.11., popolupo, GESCHÄTZT): Das Gewicht der Fanstimmung wächst mit den Mitgliedern je Platz, linear von mitglieder[0]
      // (keine Mitglieder) bis mitglieder[1] (ab mitgliederVoll je Platz), ein Mitglied je Platz ergibt 1 wie bisher
      versatz:101,wahl:{jahre:[3,4],bleiben:0.65,mitte:1.35,jePunkt:0.3,aufstieg:0.15,abstieg:-0.25,fans:0.005,grenzen:[0.2,0.95],vertrauen:0.5,mitglieder:[0.5,1.5],mitgliederVoll:2,anzeigeAb:0.05}}, // anzeigeAb: Abweichung des Gewichts von 1, ab der das Büro es nennt (Prüfung ES3)
    jobs:{ansehenAbschlag:4,kandidaten:8,angebote:4},
    // Jobangebot während der Saison (K28 §8, U12j, 22.11., GESCHÄTZT): Karte ab Ruf rufAb, Verein mit mindestens abstand mehr Ansehen und höchstens Ruf + rufSpanne;
    // beim Wechsel zahlt der neue Verein dem alten abloese × dein Gehalt je Saison
    // rettung (U12n, K28 §5.13, 23.11., GESCHÄTZT): Rettungsangebot im Ultimatum ab Ruf rufAb, von einem Verein derselben oder einer tieferen Liga mit höchstens deinem Ansehen und höchstens abstand darunter
    rettung:{rufAb:40,abstand:15},
    jobangebot:{rufAb:55,abstand:8,rufSpanne:10,abloese:1}, // rufSpanne: über der Mitte der Jobangebote (mkJobs), seit Prüfung DQ1 (vorher Ruf + 40, das hat nichts begrenzt)
    // Budgetgespräch (K28, K15 §12 Nr. 20, U12l, 22.11., GESCHÄTZT): einmal je Saison mehr Transferbudget beantragen. Zusage mit basis + jeVertrauen × (Vertrauen − 50)
    // + jeRuf × (Ruf − Startruf) − jeSparsam × (Sparsamkeit des Präsidenten − 10), bei Glaubwürdigkeit unter glaubUnter × glaubFaktor, in grenzen (eigener Strom).
    // Zugesagt: Transferbudget × (1 + plus) bis Saisonende. Abgelehnt: Vertrauen abgelehnt.
    budgetgespraech:{basis:0.4,jeVertrauen:0.01,jeRuf:0.005,jeSparsam:0.02,vertrauenMitte:50,sparsamMitte:10,glaubUnter:40,glaubFaktor:0.5,grenzen:[0.05,0.9],plus:0.2,abgelehnt:-3}, // Mitten seit Prüfung DW9
    // Trainervertrag (K28 §5.5, U12g, 22.11., GESCHÄTZT, nur Statistik, es fließt kein Geld): Gehalt je Saison = basis × liga × e^(steigung × (Ansehen − mitte)) × (1 + jeRuf × (Ruf − Startruf)), auf runden.
    // Laufzeit nach der Geduld des Präsidenten (Grenzen wie ruf.ungeduldig und ruf.geduldig); ab Tag winterAb zählt die laufende Saison nicht mit. Läuft er aus: Vertrauen über verlaengernAb
    // verlängert um verlaengern Saisons mit neuem Gehalt, sonst um bewaehrung zum alten. Abfindung bei Entlassung: Restgehalt × abfindung. saisonTage: Tage je Saison für den Anteil.
    vertrag:{basis:2e6,liga:{1:1,2:0.4,3:0.25},steigung:0.05,mitte:70,jeRuf:0.01,runden:1e4,laufzeit:{ungeduldig:1,mittel:2,geduldig:3},winterAb:183,verlaengernAb:55,verlaengern:2,bewaehrung:1,abfindung:0.5,saisonTage:365},
    ziel:{spitzeBis:3,spitzePlus:1,plus:2,schlechtester:{1:15,2:15,3:16},unterhalbMindestens:2} // Saisonziel aus dem erwarteten Platz; 2. und 3. Liga: bestes Ziel Platz 2
  },

  saison:{
    ansehen:{faktor:0.6,maxAenderung:5,aufstieg:4,abstieg:-5,min:30,max:99},
    fans:{faktor:0.015,min:3000,maxJePlatz:1.4},
    // Karriereende (K32 §5.1, 22.11., popolupo, vorläufig, ohne Testlauf): Chance je Saison = Grundwert nach Alter × Niveau × Verletzung × Professionalität, höchstens 1.
    // grund: [Alter, Chance], dazwischen linear, darunter 0, ab dem letzten Punkt 1. Torhüter rechnen torwartPlus Jahre jünger. Niveau: Stärke mehr als schwachUnter unter dem Schnitt
    // der Liga (besten 14 je Verein; Vereinslose: Schnitt der 3. Liga) ×schwach, sonst Stammspieler (stammRollen) ×stamm. Kreuzbandriss in den letzten kreuzbandTage Tagen ab kreuzbandAb Jahren
    // ×kreuzband, Vorbildprofi ×profi. Eigener Strom je Spieler und Saison. Vorher: ab 34 Jahren (Alter − 33) × 25 %, spätestens mit 38. Ziel (K32 §10): Schnitt 33 bis 35, Torhüter 35 bis 37.
    karriereende:{grund:[[32,0.10],[34,0.25],[36,0.50],[38,0.90],[39,1]],torwartPlus:2,schwachUnter:10,schwach:1.5,stamm:0.7,stammRollen:['schluessel','stamm'],kreuzbandAb:32,kreuzbandTage:365,kreuzband:1.5,profi:0.8},
    vertrag:{verlaengern:0.7,jahre:[1,3]}, // Computer-Vereine verlängern auslaufende Verträge
    neuForm:10,
    nachwuchs:{anzahl:2,positionen:['TW','AB','AB','MF','MF','ST','ST'],alter:17,abschlag:17,streuung:[-3,3],
      talentAbschlag:7,talentStreuung:[-5,8],talentJeStufe:2,gehalt:0.3,vertrag:3,computerStufe:2},
    kaderSoll:{TW:3,AB:7,MF:7,ST:5},vereinslosBis:4,vereinslosChance:0.6,
    auffuellAlter:[19,30],auffuellAbschlag:3,auffuellStreuung:[-5,4],
    kaderMax:28,vereinsloseMax:90,
    relegationLos:0.5,
    abstieg3:4,                      // so viele Vereine steigen aus der 3. Liga in die Regionalliga ab
    // Regionalliga (K32a): je Staffel wird ein Meister gelost. Gewicht = (grund + ewigFaktor × Anteil an den meisten Punkten der ewigen Tabelle der 3. Liga)
    // × Absteiger-Faktor (frisch aus der 3. Liga abgestiegen: 1, 2 oder 3 Saisons her). West und Südwest steigen direkt auf,
    // von Nord, Nordost und Bayern eine Staffel im Wechsel direkt, die anderen beiden spielen Aufstiegsspiele.
    regionalliga:{staffeln:['Nord','Nordost','West','Südwest','Bayern'],direkt:['West','Südwest'],wechsel:['Bayern','Nord','Nordost'],wechselStart:2025,
      gewicht:{grund:1,ewigFaktor:2,absteiger:[2.5,1.8,1.3]},
      spielStaerke:{basis:50,jeAnsehen:0.4},tore:1.35,heim:1.1}
  },

  // Lernstufen (K36 §11, UL). Im Spiel heißen sie „Lizenz“. Je Bereich: ab = Lizenz, ab der du selbst entscheidest (1 Teamleiter bis 5 Pro-Lizenz),
  // name = Anzeige, tab = wo die Funktion steht, auto = der Bereich kann in der Automatik laufen, wer und tut = wer es dann erledigt und wie
  // (dieselbe Regel wie bei den Computer-Vereinen). Bereiche ohne auto ruhen, solange sie gesperrt sind.
  lizenz:{
    start:true,                      // Voreinstellung beim Spielstart: mit Lernstufen
    namen:['Teamleiter','C-Lizenz','B-Lizenz','A-Lizenz','Pro-Lizenz'],
    bereiche:{
      aufstellung:{ab:1,name:'Aufstellung',tab:'aufst',auto:1,wer:'der Co-Trainer',tut:'stellt vor jedem Spiel die beste verfügbare Elf auf'},
      formation:{ab:1,name:'Grundordnung',tab:'aufst',auto:1,wer:'der Co-Trainer',tut:'prüft einmal im Monat, welche Grundordnung am besten zum Kader passt'},
      ausrichtung3:{ab:1,name:'Ausrichtung (defensiv, ausgewogen, offensiv)',tab:'aufst'},
      live:{ab:1,name:'Spiel live ansehen',tab:'buero'},
      wechsel:{ab:1,name:'Wechsel im Live-Spiel',tab:'buero'},
      verletzte:{ab:1,name:'Verletztenliste',tab:'kader'},
      pokal:{ab:1,name:'Pokal, Relegation, Supercup',tab:'pokal'},
      ruecktritt:{ab:1,name:'Rücktritt',tab:'buero'}, // K28 §5.7, U12b
      zielgespraech:{ab:1,name:'Zielgespräch mit dem Vorstand',tab:'buero'}, // K28 §5.2, U12e: ohne Automatik, ohne Entscheidung gilt der Vorschlag
      ereignisse:{ab:1,name:'Entscheidungen in Ereigniskarten',tab:'buero',auto:1,wer:'der Co-Trainer',tut:'wählt bei jeder Karte die vorsichtige Voreinstellung'}, // K30 §5.5, U12d
      statistik:{ab:1,name:'Statistik und Historie',tab:'statistik'}, // K34 §5.9, U13 (steuert nichts, darum ohne Automatik)
      stimmung:{ab:1,name:'Stimmung und Kabine ansehen',tab:'kabine'},
      stil:{ab:2,name:'Spielstil',tab:'aufst',auto:1,wer:'der Co-Trainer',tut:'wählt den Stil gegen jeden Gegner neu'},
      zurufe:{ab:2,name:'Zurufe und Halbzeitansprache',tab:'buero'},
      vorlage:{ab:2,name:'Trainingsvorlage',tab:'training',auto:1,wer:'der Co-Trainer',tut:'plant das Training nach dem Abstand zum Spiel'},
      transfers:{ab:2,name:'Transfers',tab:'transfer',auto:1,wer:'der Verein',tut:'kauft und verkauft nach den Regeln der Computer-Vereine'},
      gespraeche:{ab:2,name:'Einzelgespräche',tab:'kabine',auto:1,wer:'der Co-Trainer',tut:'spricht mit Spielern, die reden wollen'},
      ansprache:{ab:2,name:'Mannschaftsansprache',tab:'kabine'},
      kapitaen:{ab:2,name:'Kapitän',tab:'kabine',auto:1,wer:'der Co-Trainer',tut:'bestimmt den Kapitän nach Führung und Vereinsjahren'},
      beobachten:{ab:2,name:'Spieler beobachten lassen',tab:'transfer'},
      ausrichtung5:{ab:3,name:'Ausrichtung in fünf Stufen',tab:'aufst'},
      einstellung:{ab:3,name:'Einstellung zum Spiel und Einsatz',tab:'aufst',auto:1,wer:'der Co-Trainer',tut:'ruft in wichtigen Spielen das „Spiel der Saison“ aus, sonst normal'},
      rollen:{ab:3,name:'Rollen am Platz',tab:'aufst',auto:1,wer:'der Co-Trainer',tut:'lässt die Standardrollen der Grundordnung spielen'},
      schuetzen:{ab:3,name:'Standardschützen und Zurufe an einzelne Spieler',tab:'aufst',auto:1,wer:'der Co-Trainer',tut:'lässt den Besten nach Merkmal und Stärke schießen'},
      lernziel:{ab:3,name:'Lernziele',tab:'training',auto:1,wer:'der Co-Trainer',tut:'vergibt die Lernplätze an die jüngsten Spieler'},
      umschulung:{ab:3,name:'Umschulung',tab:'training'},
      sommer:{ab:3,name:'Urlaub und Trainingsauftakt',tab:'training',auto:1,wer:'der Co-Trainer',tut:'nimmt die übliche Urlaubslänge und den üblichen Auftakt'},
      testspiele:{ab:3,name:'Testspiele',tab:'training',auto:1,wer:'der Co-Trainer',tut:'plant zwei Testspiele gegen Amateure je Vorbereitung'},
      lager:{ab:3,name:'Trainingslager',tab:'training'},
      stab:{ab:3,name:'Trainerstab',tab:'stab',auto:1,wer:'der Verein',tut:'verlängert die Verträge der Mitarbeiter meistens und ersetzt einen fehlenden Co-Trainer'},
      vertraege:{ab:3,name:'Verträge',tab:'kader',auto:1,wer:'der Verein',tut:'verlängert die Verträge der Spieler, die er braucht, schon im Herbst und lässt Überzählige gehen'},
      jugend:{ab:3,name:'Jugendarbeit',tab:'training',auto:1,wer:'der Verein',tut:'hält die Jugendarbeit auf der üblichen Stufe'},
      jugendkader:{ab:3,name:'Jugendkader (Aufrücken und Verkauf)',tab:'training',auto:1,wer:'der Verein',tut:'holt jeden Sommer die zwei Besten ab 17 Jahren in den Profikader'},
      zweite:{ab:3,name:'Budget der zweiten Mannschaft',tab:'training',auto:1,wer:'der Verein',tut:'hält die Zweite auf der üblichen Stufe'},
      zweitekader:{ab:3,name:'Zweite Mannschaft (Aufrücken, Wechsel aus der Jugend, Verkauf)',tab:'training',auto:1,wer:'der Verein',tut:'schickt brauchbare 19-Jährige in die Zweite und holt jeden Sommer höchstens einen, der fast so gut ist wie die Profis, hoch'},
      pate:{ab:4,name:'Paten für Talente',tab:'kader'},
      praemien:{ab:4,name:'Prämien und Klauseln in Verträgen',tab:'kader'},
      berater:{ab:3,name:'Berater einladen',tab:'transfer'},
      leihe:{ab:3,name:'Leihen (abgeben, holen, zurückholen)',tab:'kader',auto:1,wer:'der Verein',tut:'leiht bei einem lange verletzten Stammspieler oder einer offenen Planstelle aus und gibt Überzählige bis 23 Jahre ab'}, // Automatik seit T1.1 (vorläufig, K36 Grundsatz 1)
      ausland:{ab:3,name:'Im Ausland beobachten und kaufen',tab:'transfer'},
      kaderrollen:{ab:3,name:'Kaderrollen',tab:'kabine',auto:1,wer:'der Co-Trainer',tut:'verteilt die Rollen nach der besten Elf'},
      versprechen:{ab:3,name:'Zusagen und Teamevent',tab:'kabine'},
      suchauftrag:{ab:4,name:'Suchauftrag für Scouts',tab:'transfer'},
      abwerben:{ab:4,name:'Spieler heimlich abwerben',tab:'transfer'}, // K20 §5.4, U15 (ohne Automatik: dein Verein wirbt nie von selbst ab)
      verlegung:{ab:4,name:'Spielverlegung beantragen',tab:'buero'}, // K13 §13, K13d (ohne Automatik: dein Verein beantragt nie von selbst)
      fangespraech:{ab:2,name:'Fan-Gespräch',tab:'stadion'}, // K27 §5.4b, U16 (ohne Automatik)
      presse:{ab:2,name:'Pressekonferenzen',tab:'buero',auto:1,wer:'der Co-Trainer',tut:'geht zu jeder Pressekonferenz und antwortet mit Floskeln'}, // K29 §5.4, U17a
      marketing:{ab:3,name:'Marketing (Trikot und Kampagnen)',tab:'stadion',auto:1,wer:'der Verein',tut:'nimmt das klassische Trikot und startet keine Kampagnen'}, // K25 §5.4, K25a
      sportgericht:{ab:4,name:'Sportgericht',tab:'buero',auto:1,wer:'der Verein',tut:'nimmt Strafen an oder legt bei harten Anträgen Einspruch ein'},
      medizin:{ab:4,name:'Fit spritzen und früher zurückholen',tab:'kader',auto:1,wer:'der Mannschaftsarzt',tut:'spritzt nur in wichtigen Spielen Stammspieler mit kurzer Verletzung fit'},
      sponsor:{ab:4,name:'Werbeverträge (Trikotbrust, Ausrüster, Ärmel)',tab:'buero',auto:1,wer:'der Verein',tut:'nimmt je Fläche das Angebot mit dem höchsten festen Betrag'}, // seit K24a alle Werbeflächen
      preise:{ab:4,name:'Eintrittspreis',tab:'finanzen',auto:1,wer:'der Verein',tut:'setzt den Richtpreis nach Liga und Ansehen'},
      stadion:{ab:5,name:'Stadionausbau',tab:'stadion'},
      kredit:{ab:5,name:'Kredit',tab:'finanzen',auto:1,wer:'der Verein',tut:'nimmt keinen Kredit auf und tilgt am Saisonende aus dem Guthaben'}
    },
    // Aufstieg zur Lizenz 2 bis 5 (K36 §5.3): Mindestzeit in Pflichtspielen seit dem letzten Aufstieg und so viele der Aufgaben (noetig), oder die späteste Zeit.
    // abSaison: frühestens in dieser Saison deiner Laufbahn. spaetestens: nach so vielen Pflichtspielen, oder in der Saison deiner Laufbahn ab dem Datum (07-01 oder 01-01).
    aufstieg:[null,
      {spiele:4,noetig:3,aufgaben:['startelf','liveBisEnde','wechsel','ordnung'],spaetestens:{spiele:12}},
      {spiele:10,noetig:3,aufgaben:['stil','vorlage','zuruf','gespraechOderTransfer'],spaetestens:{saison:2,datum:'07-01'}},
      {spiele:10,abSaison:2,noetig:3,aufgaben:['rolleOderSchuetze','lernziel','sommerplan','vertragOderStab','kaderrolleOderVersprechen'],spaetestens:{saison:2,datum:'01-01'}},
      {spiele:12,abSaison:3,noetig:2,aufgaben:['sportgericht','medizin','sponsorOderPreis'],spaetestens:{saison:3,datum:'01-01'}}],
    aufgabenNamen:{startelf:'Startelf selbst geändert',liveBisEnde:'ein Pflichtspiel live bis zum Abpfiff verfolgt',wechsel:'im Live-Spiel gewechselt',ordnung:'Grundordnung oder Ausrichtung geändert',
      stil:'Spielstil gewählt',vorlage:'Trainingsvorlage selbst gesetzt',zuruf:'Zuruf oder Halbzeitansprache',gespraechOderTransfer:'Einzelgespräch geführt oder Transferangebot abgegeben',
      rolleOderSchuetze:'Rolle oder Schütze festgelegt',lernziel:'Lernziel oder Umschulung',sommerplan:'Testspiel, Trainingslager oder Urlaubslänge selbst gewählt',vertragOderStab:'Vertrag verlängert oder Mitarbeiter eingestellt',kaderrolleOderVersprechen:'Kaderrolle oder Zusage',
      sportgericht:'Sportgerichtsverfahren selbst entschieden',medizin:'fit gespritzt oder früher zurückgeholt',sponsorOderPreis:'Sponsor oder Eintrittspreis selbst gewählt'},
    // Kleine Aufgabe auf der Aufstiegskarte (K36 §8, K36d): je Aufgabe der Bereich (für den Ort, „Hingehen“) und ein Satz, wie es geht
    aufgabenOrt:{startelf:['aufstellung','In der Aufstellung einen Spieler tauschen.'],liveBisEnde:['live','Das nächste Pflichtspiel live ansehen, ohne ans Ende zu springen.'],
      wechsel:['wechsel','Im Live-Spiel einen Spieler auswechseln.'],ordnung:['formation','In der Aufstellung die Grundordnung oder die Ausrichtung ändern.'],
      stil:['stil','In der Aufstellung den Spielstil gegen den nächsten Gegner wählen.'],vorlage:['vorlage','Im Training eine Wochenvorlage selbst setzen.'],
      zuruf:['zurufe','Im Live-Spiel einen Zuruf geben oder in der Halbzeit zur Mannschaft sprechen.'],gespraechOderTransfer:['gespraeche','Mit einem Spieler ein Einzelgespräch führen oder ein Transferangebot abgeben.'],
      rolleOderSchuetze:['rollen','In der Aufstellung eine Rolle oder einen Standardschützen festlegen.'],lernziel:['lernziel','Einem Spieler ein Lernziel oder eine Umschulung geben.'],
      sommerplan:['testspiele','Ein Testspiel anfragen, ein Trainingslager buchen oder die Urlaubslänge wählen.'],vertragOderStab:['vertraege','Einen Vertrag verlängern oder einen Mitarbeiter einstellen.'],
      kaderrolleOderVersprechen:['kaderrollen','In der Kabine eine Kaderrolle vergeben oder eine Zusage machen.'],sportgericht:['sportgericht','Bei einem Verfahren selbst annehmen oder Einspruch einlegen.'],
      medizin:['medizin','Einen Verletzten fit spritzen oder früher zurückholen.'],sponsorOderPreis:['preise','Einen Werbevertrag oder den Eintrittspreis selbst wählen.']},
    ohneGelegenheit:['sportgericht','medizin'], // zählen als erledigt, wenn es seit dem Aufstieg bis zur Mindestzeit keine Gelegenheit gab
    testspieleAuto:2,testspielAbstand:6          // Automatik: so viele Testspiele je Vorbereitung, mit mindestens so vielen Tagen Abstand
  },

  stadion:{
    tribuene:{plaetze:3000,kosten:12e6,wochen:6,max:90000}, // K23c: 4.000 € je Platz (echt 3.000 bis 6.000 €, K26 §5.1), vorher 4,5 Mio.
    logen:{anzahl:10,kosten:2.5e6,wochen:4,max:120},
    fanshop:{kosten:[1.5e6,3e6,5e6],wochen:3,max:3},
    // Bauprozess (K26 §4, §5.1, K26a): genehmigung Wochen, auflagen Chance und Mehrkosten, verzoegerung Chance und Wochen, mehrkosten Chance und Anteil. instandhaltung: Anteil der Bausumme je Jahr.
    // anlagen: Stufen min/max, Start, Grundkosten (× faktor je erreichter Stufe), Wochen, Wirkung. ALLE WERTE GESCHÄTZT (K26 §12).
    prozess:{genehmigung:[2,8],auflagen:{chance:0.2,kosten:[0.05,0.15]},verzoegerung:{chance:0.3,wochen:[1,6]},mehrkosten:{chance:0.15,anteil:[0.05,0.2]}},instandhaltung:0.01,
    anlagen:{training:{name:'Trainingsgelände',start:2,max:5,kosten:2e6,wochen:10,entwicklung:0.05,risiko:-0.04},
      nlz:{name:'Nachwuchsleistungszentrum',start:0,max:5,kosten:1.5e6,wochen:16,deckelJe:6},
      reha:{name:'Reha-Zentrum',start:0,max:3,kosten:1e6,wochen:8,je:0.03,minFaktor:0.75},
      catering:{name:'Catering',start:0,max:1,kosten:1.5e6,wochen:6,zuschauer:0.05},
      tafel:{name:'Anzeigetafel',start:0,max:1,kosten:1e6,wochen:4,zuschauer:0.03},
      // K26d (22.11., K26 §3.1, GESCHÄTZT): Dach. Lautstärke: Heimvorteil × (1 + heim), wenn das Heimspiel voraussichtlich mindestens abAuslastung der Plätze füllt.
      dach:{name:'Dach',start:0,max:1,kosten:15e6,wochen:20,heim:0.005,abAuslastung:0.95},faktor:1.6},
    // Computer-Vereine bauen (K26 §7, K26b, 22.11., popolupo, ALLE WERTE GESCHÄTZT): einmal je Saison zum Saisonstart, ohne Zufall, ohne Bauzeit (fertig in der Sommerpause).
    // Tribüne: Nachfrage (erwartete Zuschauer ohne Deckel gegen einen Gegner mit dem Ansehen des Ligaschnitts, neutrale Form) mindestens vollAb × Plätze in saisons Saisons nacheinander,
    // die neuen Plätze höchstens nachfrageMax × Nachfrage (kein Leerbau), nach dem Bau bleibt mindestens reserveTribuene × Reserve (finanzplan.budget.reserve × erwartete Einnahmen).
    // Sonst höchstens eine Anlage aus der Liste des Profils (ausbildung oder standard), wenn danach mindestens reserveAnlage × Reserve bleibt.
    // Seit K26c (22.11.): shop (Fanshop-Stufe, Kosten fanshop.kosten) steht mit in den Listen, damit Computer-Vereine Fanartikel verkaufen (K23 §3.1: 4 bis 7 % des Umsatzes).
    // Instandhaltung zahlen sie seit K26c wie du (instandhaltung × Bausumme je Saison, verteilt auf die Ligaspiele).
    computer:{vollAb:0.95,saisons:2,nachfrageMax:1.05,reserveTribuene:1,reserveAnlage:3,anlagen:{standard:['shop','catering','tafel','training'],ausbildung:['training','shop','catering','tafel']}}
  },

  ui:{
    transferTreffer:80,              // so viele Treffer zeigt die Transfersuche
    // Zonen der Regler (K35a). Texte beschreiben nur, was das Spiel wirklich rechnet.
    zonenStimmung:[{von:0,bis:40,art:'bad',text:'unzufrieden'},{von:40,bis:50,art:'warn',text:'grummelt'},{von:65,bis:100,art:'good',text:'zufrieden'}], // K14
    zonenZusammenhalt:[{von:0,bis:35,art:'bad',text:'Teamstärke spürbar schwächer'},{von:65,bis:100,art:'good',text:'Teamstärke etwas stärker'}],
    zonenGlaub:[{von:0,bis:25,art:'bad',text:'Die Kabine glaubt dir nicht mehr'},{von:25,bis:45,art:'warn',text:'Worte wirken schwächer'},{von:70,bis:100,art:'good',text:'Worte wirken stärker'}], // K15
    zonenFitness:[{von:0,bis:70,art:'bad',text:'deutlich geschwächt (Frische senkt die Stärke im Spiel)'},
      {von:70,bis:85,art:'warn',text:'etwas geschwächt'},{von:85,bis:100,art:'good',text:'fit'}],
    zonenSpielpraxis:[{von:0,bis:50,art:'warn',text:'fehlt: kostet bis zu 4 % Stärke im Spiel und bremst die Entwicklung'},{von:50,bis:100,art:'good',text:'ausreichend'}],
    zonenVertrauen:[{von:0,bis:12,art:'bad',text:'Ultimatum, danach droht die Entlassung'},{von:12,bis:30,art:'warn',text:'Der Vorstand ist unzufrieden'},
      {von:55,bis:100,art:'good',text:'Der Vorstand ist zufrieden'}],
    ausverkauftAb:0.95               // ab diesem Anteil der Plätze gilt ein Heimspiel als (fast) ausverkauft
  }
};

// Schreibschutz: Zur Laufzeit darf kein Code eine Regel ändern.
(function frieren(o){Object.freeze(o);Object.values(o).forEach(v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v))frieren(v);});})(REGELN);
// Kurzformen für den Code
const RW=REGELN.welt,RP=REGELN.spieler,RF=REGELN.finanzen,RM=REGELN.markt,RT=REGELN.training,RE=REGELN.engine,RV=REGELN.vorstand,RS=REGELN.saison,RB=REGELN.stadion,RK=REGELN.kalender,RU=REGELN.ui,RL=REGELN.live,RTA=REGELN.taktik,RSO=REGELN.sommer,RST=REGELN.stab,RD=REGELN.disziplin,RMD=REGELN.medizin,RWB=REGELN.wettbewerbe,RTS=REGELN.testspiele,RLA=REGELN.lager,RKA=REGELN.kabine,RGS=REGELN.gespraeche,RSC=REGELN.scouting,RLZ=REGELN.lizenz,RJ=REGELN.jugend,RZ=REGELN.zweite,RTR=REGELN.transfers,RVT=REGELN.vertraege,RBE=REGELN.berater,RLE=REGELN.leihe,RCV=REGELN.computer,RBZ=REGELN.beziehungen,RKT=REGELN.karten,RSTAT=REGELN.statistik,RVB=REGELN.vorbereitung,RAW=REGELN.abwerben,RFS=REGELN.fanstimmung,RPK=REGELN.presse,RTP=REGELN.trainerpool,RGR=REGELN.geruechte,RFP=REGELN.finanzplan,RMK=REGELN.marketing,REU=REGELN.europa;
