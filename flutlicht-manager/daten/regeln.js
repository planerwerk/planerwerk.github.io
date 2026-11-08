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
    amateurStaerke:[47,57]           // Stärke der Amateurklubs im Pokal (4. bis 6. Liga), jede Saison neu
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
      nervenschwach:{name:'nervenschwach',art:'−',wenn:{dru:[1,4]},text:'schwächer in engen und wichtigen Spielen und vom Punkt'},
      fuehrungsspieler:{name:'Führungsspieler',art:'+',wenn:{fue:[16,20]},abAlter:24,text:'reißt bei Rückstand die Mannschaft mit'},
      integrationsfigur:{name:'Integrationsfigur',art:'+',wenn:{fue:[13,20],anp:[15,20]}},
      mentor:{name:'Mentor',art:'+',wenn:{pro:[14,20],fue:[12,20]},abAlter:29},
      kaempfer:{name:'Kämpfer',art:'+',wenn:{ehr:[16,20],dru:[12,20]},text:'legt bei Rückstand zu'},
      vereinstreu:{name:'vereinstreu',art:'+',wenn:{loy:[17,20]}},
      diva:{name:'Diva',art:'−',wenn:{ehr:[15,20],anp:[1,6]}},
      soeldner:{name:'Söldner',art:'−',wenn:{loy:[1,4]}},
      heimweh:{name:'Heimweh-Typ',art:'−',wenn:{anp:[1,4]}}},
    eigenschaftenWirksam:['vorbildprofi','partyloewe','trainingsweltmeister','hitzkopf','verletzungsanfaellig','nervenschwach','kaempfer','fuehrungsspieler'],
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
        flanke_tw:{k:'strafraum',w:'fliegenfaenger',ja:3,minus:10,kosten:25,zufall:0.3},parade_nah:{k:'reflexe',ja:2},patzer:{w:'unkonzentriert',minus:8},gelb:{w:'ungestuem',minus:3},rot:{w:'ungestuem',minus:10}}},
    startMerkmale:{staerken:[[0,0.85],[55,1],[65,1.9],[75,2.85],[85,3.6]],schwaechen:[[60,0.6],[85,0.3]],beidfuessig:0.1,
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

  // Match-Engine v2 (K04): Szenen-Modell pro Minute. Grundordnungen auf den 14 Positionen (K06), Seiten links und rechts getrennt.
  engine:{
    formationen:{ // Plätze von hinten nach vorn
      '4-4-2':['TW','LV','IV','IV','RV','LM','ZM','ZM','RM','MS','MS'],'4-4-2 Raute':['TW','LV','IV','IV','RV','DM','ZM','ZM','OM','MS','MS'],
      '4-2-3-1':['TW','LV','IV','IV','RV','DM','DM','LA','OM','RA','MS'],'4-3-3':['TW','LV','IV','IV','RV','DM','ZM','ZM','LA','MS','RA'],
      '4-1-4-1':['TW','LV','IV','IV','RV','DM','LM','ZM','ZM','RM','MS'],'4-2-2-2':['TW','LV','IV','IV','RV','DM','DM','OM','OM','MS','MS'],
      '3-5-2':['TW','IV','IV','IV','LS','DM','ZM','ZM','RS','MS','MS'],'3-4-3':['TW','IV','IV','IV','LS','ZM','ZM','RS','LA','MS','RA'],
      '3-4-2-1':['TW','IV','IV','IV','LS','ZM','ZM','RS','OM','OM','MS'],'5-3-2':['TW','LV','IV','IV','IV','RV','DM','ZM','ZM','MS','MS']},
    // Anteile je Position an [Kontrolle, Angriff Mitte, Angriff außen, Abwehr Mitte, Abwehr außen] (K04 §3.2). Rechts wie links, Schiene = Mittel aus LV und LM.
    anteile:{TW:[0,0,0,0,0],IV:[0.10,0,0,0.80,0.10],LV:[0.15,0,0.25,0.10,0.50],DM:[0.40,0.05,0,0.45,0.10],ZM:[0.35,0.30,0.05,0.25,0.05],
      SM:[0.55,0.35,0.05,0.05,0],OM:[0.35,0.55,0.05,0.05,0],LM:[0.25,0.05,0.45,0.05,0.20],HS:[0.20,0.70,0.10,0,0],MS:[0.10,0.85,0.05,0,0],LA:[0.10,0.25,0.65,0,0],LS:[0.20,0.025,0.35,0.075,0.35]},
    gruppe:{TW:'TW',IV:'AB',LV:'AB',RV:'AB',LS:'AB',RS:'AB',DM:'MF',ZM:'MF',SM:'MF',OM:'MF',LM:'MF',RM:'MF',HS:'ST',MS:'ST',LA:'ST',RA:'ST'},
    // Eignung auf fremden Positionen (K03 §3.1a), von → nach in Prozent, rechts spiegelbildlich
    eignung:{nah:{IV:{DM:85,LV:75,RV:75,LS:70,RS:70},LV:{LM:85,RV:80,IV:75,LS:92},DM:{ZM:90,IV:80,SM:80},ZM:{DM:90,OM:90,SM:85,LM:75,RM:75},SM:{OM:90,ZM:85,DM:75},
      OM:{SM:90,ZM:85,HS:85,LA:75,RA:75},LM:{LA:85,RM:80,LV:75,ZM:75,LS:92},MS:{HS:85,LA:70,RA:70},HS:{MS:85,OM:85,LA:75,RA:75},LA:{LM:85,RA:85,HS:75,MS:75}},
      gleicheGruppe:70,andereGruppe:55,torwartFeld:45,vielseitig:5,vielseitigMax:95,falscheSeite:0.92,seitenPositionen:['LV','RV','LM','RM','LS','RS']},
    staerke:{fitBasis:0.72,fitAnteil:0.28,leererPlatz:25}, // Wirkung = Stärke × Zustand (K03 §5.8) × Eignung
    team:{schwaechstes:0.2,mindestAnteil:0.3,anzahl:[0.85,0.05],anzahlMax:1.15,ueberragend:{ab:11,anteil:0.05}}, // überragend: was mehr als 11 über dem Schnitt der anderen im Bereich liegt, zählt nur zu 5 %
    besitz:{exponent:3.5},
    angriff:{proMinute:0.50,chance:0.42,exponent:1.7,min:0.10,max:0.80,konter:0.12},
    mix:{mitte:{gross:0.20,halb:0.45,fern:0.35},aussen:{kopf:0.45,halb:0.25,gross:0.10,fern:0.20},konter:{gross:0.6,halb:0.4}},
    tor:{gross:0.28,halb:0.085,fern:0.03,kopf:0.095,ecke:0.045,freistossFlanke:0.055,freistoss:0.06,elfmeter:0.76}, // kalibriert mit tests/kalibrierung.js
    aufsTor:0.35,geblockt:0.25,ecken:{aussenAbgewehrt:0.55,parade:0.30,geblockt:0.35},eckeSchuss:0.3,
    // Wer schießt: Gewicht je Position und Chancentyp
    schuetzen:{gross:{MS:5,HS:4,OM:3,LA:3,SM:2,ZM:1.5,LM:1.5,DM:0.5,IV:0.2,LV:0.3,LS:0.4},halb:{MS:3,HS:3,OM:2.5,LA:2.5,LM:1.5,ZM:1.5,SM:1.5,DM:0.7,IV:0.3,LV:0.4,LS:0.5},
      fern:{OM:3,SM:3,ZM:2.5,DM:1.5,LM:2,LA:2,HS:2,MS:1,IV:0.4,LV:0.6,LS:0.7},kopf:{MS:5,HS:2,LA:1,LM:1,OM:1,ZM:1,IV:1.5,DM:0.8,LV:0.4,LS:0.5},
      ecke:{IV:4,MS:4,DM:1.5,HS:1.5,ZM:1,OM:0.7,LA:0.7,LM:0.5,LV:0.4,LS:0.5},mitte:75,exponent:1.5},
    schuetze:{mitte:70,jePunkt:0.008,min:0.8,max:1.2},
    abwehr:{versatz:3,jePunkt:0.014,min:0.8,max:1.2}, // Druck der Abwehr auf den Abschluss: 1 − jePunkt × (Abwehr − Angriff − versatz). Abwehrwerte liegen im Schnitt etwa 3 über den Angriffswerten.
    torwart:{mitte:70,jePunkt:0.011,min:0.80,max:1.20,patzer:0.02,unkonzentriert:4},
    fouls:{proMinute:0.12,ort:{flanke:0.20,direkt:0.035,elfmeter:0.011},gelb:0.17,rot:0.0036,hart:1.3,fair:0.7,mitGelb:{foul:0.35,karte:0.5}, // verwarnte Spieler foulen vorsichtiger (K09)
      gewicht:{IV:2,LV:1.5,DM:2,ZM:1.3,LS:1.5,LM:1,SM:0.8,OM:0.8,HS:0.8,MS:1,LA:0.8},ungestuem:1.4},
    verlauf:{fuehrung:{A:0.92,D:1.05},rueckstand:{A:1.08,D:0.96},gleich:{A:0.78},abMinute:75, // gleich: bei Unentschieden gehen spät beide weniger Risiko ein
      rot:{A:0.90,D:0.95}},
    // Merkmale in der Engine (K04 §5.5)
    mk:{torjaeger:{wahl:1.3,tor:1.15},kopfballstark:{wahl:1.5,tor:1.15,abwehr:0.92},weitschuetze:{anteil:1.5,tor:1.25},flankengeber:{kopf:1.15,ecke:1.2},
      dribbler:{upgrade:0.15},schnell:{konter:1.15,abwehr:0.92},stellungssicher:{gross:0.92},zweikampfstark:{abwehr:1.03},ballsicher:{konter:0.85},
      freistoss:0.10,elfmeter:0.84,beidfuessig:1.03,reflexe:0.93,strafraum:0.85,elfmetertoeter:0.70,abschlussschwach:0.88,kopfballschwach:0.87,fliegenfaenger:1.15,langsam:1.08,abnehmend:[1,0.6,0.3]},
    ausrichtung:{O:{A:1.06,D:0.95},D:{A:0.94,D:1.06},K:{A:0.98,D:1.03}},
    einsatz:{H:{A:1.02,D:1.02},F:{A:0.985,D:0.985}},
    heim:{alle:1.03,amateure:1.05},
    eigenschaften:{kaempfer:1.03,fuehrungsspieler:1.01,nervenschwach:0.96,trainingsweltmeister:0.97,engAb:80,nervenschwachElfmeter:0.06}, // Wirkung im Spiel (K03 §3.3), eng: ab Minute 80 mit höchstens einem Tor Abstand
    amateure:{wirkungJeStaerke:1}, // Amateurklubs im Pokal: alle Teamwerte = ihre Stärke
    ermuedung:{proMinute:0.17,ko:[1.5,-0.007],hart:1.15,schwelle:60,abfall:0.005},
    karten:{gelb:0.019,rot:0.0007,hart:1.7,fair:0.5}, // nur noch für Amateurklubs
    verletzung:{chance:0.0012,gegnerHart:1.5,wochen:[1,6]}, // je Minute und Mannschaft. Ausfall: 7 Tage je Woche
    verlaengerung:0.8,               // Chancen in der Verlängerung relativ
    elfmeter:0.76,
    fitnessMin:20,
    note:{basis:3.6,ergebnis:0.55,tor:0.9,staerkeMitte:72,staerkeTeiler:25,zufall:1.6,platzverweis:1.5,min:1,max:6},
    gelbSperreAb:5,rotSperre:[1,3]   // Sperren in Spielen
  },

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
    platzAbSpieltag:5,               // ab diesem Spieltag-Index zählt der Tabellenplatz
    platz:{weitAb:3,weit:-2,drunter:-0.6,drueber:0.6},
    kontoMinus:-2,kontoMinusMeldung:0.3,
    entlassenUnter:12,schonfristSpieltage:6, // entlassen erst nach mehr als so vielen eigenen Ligaspieltagen. Die Schwierigkeit ersetzt beide Werte.
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
