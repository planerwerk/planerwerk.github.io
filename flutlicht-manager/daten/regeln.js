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
    erinnerungen:{frist:'Angebot läuft heute ab',aufstellung:'Startelf hat Ausfälle',sponsor:'Kein Sponsor gewählt',vertrag:'Verträge laufen aus'} // abschaltbar im Menü
  },

  welt:{
    startSaison:2026,
    startVertrauen:60,               // Vertrauen des Vorstands zu Beginn, 0–100
    startTraining:1,                 // 0 locker, 1 normal, 2 hart
    startZiel:9,                     // Platzhalter, wird sofort aus dem Ansehen berechnet
    startJugend:2,                   // Stufe der Jugendarbeit (1–5)
    startFormationen:['4-4-2','4-3-3','4-2-3-1','3-5-2'], // daraus wählt jeder Verein zufällig
    konto:{basis:5e5,jeAnsehen2:2500},   // Startkonto = basis + Ansehen² × jeAnsehen2
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
    amateurStaerke:[56,65]           // Stärke der Amateurklubs im Pokal, jede Saison neu
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
      alter:[[19,4.9,0.7],[22,4.0,0.9],[25,2.5,1.0],[28,1.4,1.1],[30,0.8,1.3],[32,0.6,2.0],[34,0.4,2.9]],sonst:[0.3,3.7], // [bis Alter, Wachstum, Abbau] pro Saison, kalibriert mit tests/spielermodell.js (die Talentgrenze bremst einen Teil)
      positionsAlter:{TW:-3,AB:-1,MF:0,ST:1},abbau:{TW:0.7,AB:0.85,MF:1,ST:1}, // Torhüter und Abwehr bauen später und langsamer ab
      talentWeich:3,formBasis:1.2,   // Wachstum × 1,2^(Form−10), Abbau × 1,2^(10−Form)
      praxis:{hoch:60,auf:1.2,tief:20,aufTief:0.7,abTief:1.3,abTiefAb:29,halbBis:18},
      training:[0.8,1,1.2],          // je Trainingsstufe locker, normal, hart (bis K07)
      profi:{auf:[0.8,0.02],ab:[1.2,-0.02]},zufall:0.05,jung:{bisAlter:21,zufall:2}},
    form:{mitte:10,min:0,max:20,jeNote:2.5,ausgleich:0.10,wirkung:0.005,serie:{spiele:5,abPunkte:4,bonus:0.5}}, // Form += 1,5 × (erwartete Note − Note)
    frische:{spiel:15,ko:[1.5,-0.007],erholung:[3,0.1],alter:[[23,1.1],[29,1],[32,0.9]],alterSonst:0.8,koErholung:[0.8,0.004],training:[1,2,3]},
    kondition:{ziel:[70,80,90],vereinslos:65,tempo:0.20,altAb:30,altJeJahr:1,urlaub:0.6,verletzt:0.5},
    selbstvertrauen:{min:-3,max:3,tor:0.5,guteNote:0.3,schlechteNote:-0.3,ausgleich:0.15},
    spielpraxis:{zerfall:0.97,jeSpiel:25,training:5,wirkungUnter:50,wirkungMax:0.04}, // training: Spielformen im Training je Woche (bis K07)
    zustand:{min:0.80,max:1.08},    // Deckel für Form, Frische und Spielpraxis zusammen (K03 §5.8)
    // Persönlichkeit (K03 §3.3): 8 verdeckte Werte 1–20, ausgewürfelt je Karriere
    persoenlichkeit:{mitte:10,streuung:3.5,min:1,max:20,werte:['pro','ehr','loy','tem','dru','anp','fue','rob']},
    // Eigenschaften (K03 §3.5) entstehen aus der Persönlichkeit. Angezeigt nur, wenn ihre Wirkung im Spiel gebaut ist (wirksam).
    eigenschaften:{
      vorbildprofi:{name:'Vorbildprofi',art:'+',wenn:{pro:[17,20]},text:'lernt 25 % schneller, baut im Alter langsamer ab'},
      partyloewe:{name:'Partylöwe',art:'−',wenn:{pro:[1,4]},text:'Kondition 8 niedriger, lernt 25 % langsamer'},
      trainingsweltmeister:{name:'Trainingsweltmeister',art:'±',wenn:{pro:[15,20],dru:[1,7]},text:'lernt 25 % schneller, bringt es im Spiel aber nicht immer'},
      hitzkopf:{name:'Hitzkopf',art:'−',wenn:{tem:[17,20]},text:'sieht 50 % öfter Karten'},
      verletzungsanfaellig:{name:'verletzungsanfällig',art:'−',wenn:{rob:[1,4]},text:'verletzt sich 60 % öfter'},
      nervenschwach:{name:'nervenschwach',art:'−',wenn:{dru:[1,4]},text:'schwächer im Elfmeterschießen'},
      fuehrungsspieler:{name:'Führungsspieler',art:'+',wenn:{fue:[16,20]},abAlter:24},
      integrationsfigur:{name:'Integrationsfigur',art:'+',wenn:{fue:[13,20],anp:[15,20]}},
      mentor:{name:'Mentor',art:'+',wenn:{pro:[14,20],fue:[12,20]},abAlter:29},
      kaempfer:{name:'Kämpfer',art:'+',wenn:{ehr:[16,20],dru:[12,20]}},
      vereinstreu:{name:'vereinstreu',art:'+',wenn:{loy:[17,20]}},
      diva:{name:'Diva',art:'−',wenn:{ehr:[15,20],anp:[1,6]}},
      soeldner:{name:'Söldner',art:'−',wenn:{loy:[1,4]}},
      heimweh:{name:'Heimweh-Typ',art:'−',wenn:{anp:[1,4]}}},
    eigenschaftenWirksam:['vorbildprofi','partyloewe','trainingsweltmeister','hitzkopf','verletzungsanfaellig','nervenschwach'],
    entdeckenWochen:[2,8],          // so lange dauert es, bis der Co-Trainer eine Eigenschaft eines neuen Spielers meldet
    // Merkmale (K03 §3.4): Stärken und Schwächen. Schwierigkeit: Lernfortschritt pro Woche leicht 12 %, mittel 6 %, schwer 3 %.
    merkmale:{
      kopfballstark:{name:'kopfballstark',g:['AB','MF','ST'],s:'mittel',gegen:'kopfballschwach'},schnell:{name:'schnell',g:['AB','MF','ST'],s:'schwer',bis:23,alt:true,gegen:'langsam'},
      ausdauernd:{name:'ausdauernd',g:['AB','MF','ST'],s:'leicht',alt:true,text:'verliert im Spiel ein Viertel weniger Frische'},
      zweikampfstark:{name:'zweikampfstark',g:['AB','MF'],s:'mittel'},stellungssicher:{name:'stellungssicher',g:['AB','MF'],s:'mittel'},ballsicher:{name:'ballsicher',g:['AB','MF'],s:'mittel'},
      flankengeber:{name:'Flankengeber',g:['AB','MF'],s:'mittel'},dribbler:{name:'Dribbler',g:['MF','ST'],s:'schwer'},torjaeger:{name:'Torjäger',g:['MF','ST'],s:'schwer',gegen:'abschlussschwach'},
      weitschuetze:{name:'Weitschütze',g:['MF','ST'],s:'mittel'},freistoss:{name:'Freistoßspezialist',g:['AB','MF','ST'],s:'mittel'},
      elfmeter:{name:'Elfmeterschütze',g:['AB','MF','ST'],s:'leicht',text:'trifft im Elfmeterschießen öfter'},beidfuessig:{name:'beidfüßig',g:['AB','MF','ST'],s:'schwer',bis:25},
      vielseitig:{name:'vielseitig',g:['AB','MF','ST'],s:'mittel'},joker:{name:'Joker',g:['MF','ST'],s:'mittel'},
      reflexe:{name:'Reflexe',g:['TW'],s:'mittel'},strafraum:{name:'Strafraumbeherrscher',g:['TW'],s:'mittel',gegen:'fliegenfaenger'},
      elfmetertoeter:{name:'Elfmetertöter',g:['TW'],s:'leicht',text:'hält im Elfmeterschießen öfter'},mitspielend:{name:'mitspielend',g:['TW'],s:'mittel'},
      kopfballschwach:{name:'kopfballschwach',g:['AB','MF','ST'],s:'mittel',schwaeche:true},abschlussschwach:{name:'abschlussschwach',g:['MF','ST'],s:'mittel',schwaeche:true},
      unkonzentriert:{name:'unkonzentriert',g:['TW','AB','MF','ST'],s:'leicht',schwaeche:true},ungestuem:{name:'ungestüm',g:['AB','MF','ST'],s:'mittel',schwaeche:true},
      fliegenfaenger:{name:'Fliegenfänger',g:['TW'],s:'mittel',schwaeche:true},langsam:{name:'langsam',g:['AB','MF','ST'],s:'schwer',schwaeche:true}},
    merkmaleWirksam:['ausdauernd','elfmeter','elfmetertoeter'],
    lernen:{woche:{leicht:12,mittel:6,schwer:3},alter:[[21,1.3],[25,1.1],[29,1],[32,0.8]],alterSonst:0.6,profi:[0.7,0.03],zufall:[0.7,1.3],
      frischeUnter:[70,0.8],eigenschaft:{vorbildprofi:1.25,trainingsweltmeister:1.25,partyloewe:0.75},maxStaerken:4,automatik:true},
    startMerkmale:{staerken:[[55,0.5],[65,1],[75,1.6],[85,2.3],[90,3]],schwaechen:[[60,0.6],[85,0.3]],beidfuessig:0.1,
      gewichte:{TW:{reflexe:3,strafraum:2,elfmetertoeter:1,mitspielend:2},AB:{kopfballstark:3,zweikampfstark:3,stellungssicher:3,ballsicher:2,flankengeber:1,ausdauernd:1,schnell:1},
        MF:{ballsicher:2,flankengeber:2,dribbler:1,weitschuetze:2,freistoss:1,ausdauernd:2,zweikampfstark:1,schnell:1,elfmeter:1,vielseitig:1},ST:{torjaeger:3,kopfballstark:2,schnell:2,dribbler:2,elfmeter:2,joker:1,weitschuetze:1}}},
    // Feine Positionen (K03 §3.1a) und Fuß. Bis die Daten da sind, per Zufall aus der Gruppe.
    positionen:{TW:{TW:1},AB:{IV:0.5,LV:0.25,RV:0.25},MF:{DM:0.2,ZM:0.25,SM:0.05,OM:0.15,LM:0.175,RM:0.175},ST:{MS:0.5,HS:0.1,LA:0.2,RA:0.2}},
    positionsNamen:{TW:'Torwart',IV:'Innenverteidiger',LV:'linker Außenverteidiger',RV:'rechter Außenverteidiger',DM:'defensives Mittelfeld',ZM:'zentrales Mittelfeld',SM:'Spielmacher',OM:'offensives Mittelfeld',LM:'linkes Mittelfeld',RM:'rechtes Mittelfeld',MS:'Mittelstürmer',HS:'hängende Spitze',LA:'Linksaußen',RA:'Rechtsaußen'},
    fuss:{rechts:0.77},
    talentSchaetzung:{fehler:1,genauNachWochen:104}, // Talentsterne bis 1 daneben, nach 2 Jahren im Verein genau (K03, Normal)
    vertrag:[1,4],                   // Restlaufzeit in Jahren
    gehalt:{basis:1e6,steigung:0.1,mitte:75,runden:1000}, // Gehalt/Jahr = basis × e^(steigung × (Stärke − mitte))
    marktwert:{basis:8e6,steigung:0.1,mitte:75,jungUnter:24,staerkeAnteil:0.6,talentAnteil:0.4,
      alter:[[21,1.5],[24,1.25],[28,1],[30,0.7],[32,0.45]],alterSonst:0.22,minimum:25000,runden:25000},
    sterne:[12,8,4],                 // Talent − Stärke ab diesem Wert: 4, 3 oder 2 Sterne
    niveauSpieler:14,                // Kaderstärke = Schnitt der besten 14
    niveauLeer:50                    // Kaderstärke ohne Spieler
  },

  finanzen:{
    tv:{liga1:{basis:120000,jeAnsehen:2500},liga2:{basis:50000,jeAnsehen:900},liga3:{basis:20000,jeAnsehen:400}}, // je Ligaspieltag
    betrieb:{jePlatz:1,jeLoge:300},  // Stadion und Betrieb je Ligaspieltag
    jugendKosten:[0,20000,40000,70000,110000,160000], // je Ligaspieltag, Index = Stufe
    kreditZins:0.08,                 // pro Saison
    kreditRahmen:{basis:2e6,jeAnsehen:250000},
    pokalPraemien:[2e5,4e5,8e5,1.6e6,3.2e6,4.5e6], // je gespielter Runde
    pokalSieg:3e6,
    pokal:{drittligisten:4,amateure:24}, // DFB-Pokal: 36 aus 1. und 2. Liga, dazu die besten Drittligisten (ohne Zweitmannschaften) und Amateure
    fremdeEinnahmen:{liga:30,pokal:10}, // Computer-Vereine: Ansehen² × Wert je Spieltag bzw. Pokalrunde
    fanartikel:[0,1.5,3,5],          // € je Zuschauer, Index = Fanshop-Stufe
    loge:3000,                       // € je Loge und Heimspiel
    zuschauer:{refBasis:15,refJeAnsehen:0.25, // Richtpreis = refBasis + Ansehen × refJeAnsehen
      preisExponent:1.2,preisMin:0.2,preisMax:1.4, // Preiswirkung = (Richtpreis / Preis)^Exponent, begrenzt
      formBasis:0.86,formJePunkt:0.06, // Form = Punkte der letzten 5 Spiele im Schnitt
      gegnerBasis:0.88,gegnerFaktor:0.3,gegnerOhne:40, // Gegner = basis + Ansehen/100 × faktor
      liga2:0.82,liga3:0.7,pokal:1.05,zufallBasis:0.95,zufallSpanne:0.1},
    ticketPreis:{min:5,max:150,standard:20},
    sponsor:{liga1:45,liga2:18,liga3:8,      // Grundbetrag je Spieltag = Ansehen² × Wert
      angebote:[
        {fix:1,sieg:0,jahre:1,info:'Festes Geld pro Spieltag, 1 Saison'},
        {fix:0.65,sieg:1.3,jahre:1,info:'Weniger Fixum, dafür Prämie pro Sieg, 1 Saison'},
        {fix:0.92,sieg:0,jahre:3,info:'Langfristig: 3 Saisons feste Summe'}]},
    abfindung:0.5,                   // Abfindung = Gehalt × Restlaufzeit × Wert
    handgeld:0.5,                    // Handgeld für Vereinslose = Gehalt × Wert
    handgeldAnzeige:0.6              // Schätzung im Spielerfenster
  },

  markt:{
    kaderMax:36,                     // dein Kader höchstens
    listeVoll:{kaderAb:26,chance:0.3}, // Computer-Verein mit großem Kader setzt einen Ersatzspieler auf die Liste
    listeZufall:{chance:0.06,aufschlag:1.1},
    wechsel:{eins:0.5,zwei:0.5},     // Transfers unter Computer-Vereinen pro Woche: 1 mit 50 %, sonst 2 mit 50 %
    kaeufer:{niveauPlus:2,kaderMax:30},
    neuerVertrag:[2,4],
    forderung:{stammspieler:1.6,sonst:1.25}, // Ablöseforderung = Marktwert × Faktor
    runden:25000,
    angebote:{preis:[[1,0.4],[1.3,0.2],[1.7,0.06]],preisSonst:0.01, // Chance je Woche nach Forderung/Marktwert
      kontoAnteil:0.8,betragBasis:0.85,betragSpanne:0.2,laufzeitWochen:3},
    ueberraschung:{niveauPlus:2,chance:0.012,betragBasis:1.1,betragSpanne:0.4},
    interesse:{basis:18,liga1:5,liga2:-8,liga3:-16,altAb:31,altPlus:8,niveauFaktor:1.5,zufall:20,vereinslosAbstand:5},
    ernstAb:0.7,                     // darunter: „Kein ernsthaftes Angebot“
    gehalt:{basis:1.05,zufall:0.2,altAb:31,altFaktor:0.85} // Gehaltsforderung = Gehalt × (basis + Zufall), ältere günstiger bei Verlängerung
  },

  training:{
    // Trainingsstufe 0 locker, 1 normal, 2 hart: wirkt auf Entwicklung, Kondition und Frische (Werte unter spieler, bis K07 die Wochenpläne bringt)
    staerkeMin:25,staerkeMax:99,
    computerStufe:1,
    verletzung:{stufe:2,chance:0.004,wochen:[1,3]} // nur eigener Verein, nur bei hartem Training
  },

  engine:{
    formationen:{'4-4-2':[4,4,2],'4-3-3':[4,3,3],'4-2-3-1':[4,5,1],'3-5-2':[3,5,2],'5-3-2':[5,3,2],'3-4-3':[3,4,3]},
    staerke:{fitBasis:0.72,fitAnteil:0.28, // Wirkung = Stärke × Zustand (Frische, Form, Spielpraxis, K03 §5.8) × Positionsfaktor
      fremdTorwart:0.45,fremdPosition:0.82,leererPlatz:25},
    reihen:{abwehr:[0.85,0.05],mittelfeld:[0.85,0.04],angriff:[0.85,0.08]}, // Faktor = a + b × Spieler in der Reihe
    angriff:{sturm:0.55,mittelfeld:0.33,abwehr:0.12},
    abwehr:{abwehr:0.45,mittelfeld:0.25,torwart:0.30},
    ausrichtung:{O:{A:1.06,D:0.95},D:{A:0.94,D:1.06},K:{A:0.98,D:1.03}},
    einsatz:{H:{A:1.02,D:1.02},F:{A:0.985,D:0.985}},
    heim:{angriff:1.04,abwehr:1.03,amateure:1.03},
    tore:{basis:1.3,exponent:4,min:0.12,max:4.8,rotAngriff:0.12,rotAngriffMin:0.5,rotAbwehr:0.1,rotAbwehrMin:0.55}, // erwartete Tore je Spiel
    chancen:2.4,                     // Chance ohne Tor, wenn der Wurf unter Torwahrscheinlichkeit × Wert liegt
    schuetzen:{gewicht:{TW:0.03,AB:1,MF:2.4,ST:5},mitte:75,exponent:3},
    karten:{gelb:0.019,rot:0.0007,hart:1.7,fair:0.5}, // je Minute und Mannschaft
    verletzung:{chance:0.0012,gegnerHart:1.5,wochen:[1,6]}, // Ausfall: 7 Tage je Woche nach dem Spieltag
    verlaengerung:0.8,               // Torwahrscheinlichkeit in der Verlängerung relativ
    elfmeter:0.76,
    fitnessVerlust:[7,13],fitnessMin:20,
    note:{basis:3.6,ergebnis:0.55,tor:0.9,staerkeMitte:72,staerkeTeiler:25,zufall:1.6,platzverweis:1.5,min:1,max:6},
    gelbSperreAb:5,rotSperre:[1,3]   // Sperren in Spielen
  },

  vorstand:{
    staerkerAb:5,                    // Gegner gilt als stärker/schwächer ab diesem Unterschied im Ansehen
    sieg:{staerker:4,sonst:2.5},
    remis:{staerker:1,schwaecher:-1,sonst:0},
    niederlage:{staerker:-1,schwaecher:-3.5,sonst:-2.5},
    platzAbSpieltag:5,               // ab diesem Spieltag-Index zählt der Tabellenplatz
    platz:{weitAb:3,weit:-2,drunter:-0.6,drueber:0.6},
    kontoMinus:-2,kontoMinusMeldung:0.3,
    entlassenUnter:12,schonfristSpieltage:6, // entlassen erst nach mehr als so vielen eigenen Ligaspieltagen
    pokalAus:-6,pokalWeiter:1.5,pokalSieg:10,
    saisonErreicht:20,saisonWeitAb:3,saisonWeit:-25,saisonVerfehlt:-8,entlassenSaisonUnter:15,
    neuerJob:55,
    jobs:{ansehenAbschlag:4,kandidaten:8,angebote:4},
    ziel:{spitzeBis:3,spitzePlus:1,plus:2,schlechtester:{1:15,2:15,3:16},unterhalbMindestens:2} // Saisonziel aus dem erwarteten Platz; 2. und 3. Liga: bestes Ziel Platz 2
  },

  saison:{
    ansehen:{faktor:0.6,maxAenderung:5,aufstieg:4,abstieg:-5,min:30,max:99},
    fans:{faktor:0.015,min:3000,maxJePlatz:1.4},
    karriereende:{abAlter:34,nullAlter:33,jeJahr:0.25,spaetestens:38},
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

  stadion:{
    tribuene:{plaetze:3000,kosten:4.5e6,wochen:6,max:90000},
    logen:{anzahl:10,kosten:2.5e6,wochen:4,max:120},
    fanshop:{kosten:[1.5e6,3e6,5e6],wochen:3,max:3}
  },

  ui:{
    transferTreffer:80,              // so viele Treffer zeigt die Transfersuche
    // Zonen der Regler (K35a). Texte beschreiben nur, was das Spiel wirklich rechnet.
    zonenFitness:[{von:0,bis:70,art:'bad',text:'deutlich geschwächt (Frische senkt die Stärke im Spiel)'},
      {von:70,bis:85,art:'warn',text:'etwas geschwächt'},{von:85,bis:100,art:'good',text:'fit'}],
    zonenSpielpraxis:[{von:0,bis:50,art:'warn',text:'fehlt: kostet bis zu 4 % Stärke im Spiel und bremst die Entwicklung'},{von:50,bis:100,art:'good',text:'ausreichend'}],
    zonenVertrauen:[{von:0,bis:12,art:'bad',text:'Entlassung droht'},{von:12,bis:30,art:'warn',text:'Der Vorstand ist unzufrieden'},
      {von:55,bis:100,art:'good',text:'Der Vorstand ist zufrieden'}],
    ausverkauftAb:0.95               // ab diesem Anteil der Plätze gilt ein Heimspiel als (fast) ausverkauft
  }
};

// Schreibschutz: Zur Laufzeit darf kein Code eine Regel ändern.
(function frieren(o){Object.freeze(o);Object.values(o).forEach(v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v))frieren(v);});})(REGELN);
// Kurzformen für den Code
const RW=REGELN.welt,RP=REGELN.spieler,RF=REGELN.finanzen,RM=REGELN.markt,RT=REGELN.training,RE=REGELN.engine,RV=REGELN.vorstand,RS=REGELN.saison,RB=REGELN.stadion,RK=REGELN.kalender,RU=REGELN.ui;
