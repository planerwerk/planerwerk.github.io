// Pressekonferenzen (K29 §5.4, U17a): Katalog, Anlass mit Budget, Abstand und Sperre, Automatik über die Lizenz, Halt und Co-Trainer am nächsten Tag,
// Antworten mit Wirkung und Deckel, Schiedsrichterkritik mit Geldstrafe, Gedächtnis (Rückendeckung, Kampfansage), Auslöser Krise, eigener Strom.
// Aufruf: node tests/presse.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U17a entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711;
function welt(lernstufen){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';if(lernstufen)F.lizenzStart(true);F.setTarget();F.sponsOffers();if(S.sponsOffers)F.sponsorWaehlen(0);
  S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);S.phase='play';return{W,F,S,ev:W.ev,t:W.ev('myT()')};}
const frei=(w)=>{const P=w.F.presseS();P.letzte=-99;P.sperre={};P.n={};w.S.pk=null;};
const gegner=w=>w.S.teams.find(x=>x.lg===w.t.lg&&x.id!==VEREIN).id;

// 1. Katalog: jede Antwortart gibt es, jede Frage hat drei Arten, keine unbekannten Platzhalter, jeder Anlass hat Fragen ohne Spieler
{const {ev}=welt(false),P=ev('PRESSE'),bekannt=['verein','gegner','spieler','platz','serie','trainer','liga','medium'],fehler=[];
  Object.entries(P.anlaesse).forEach(([k,a])=>{if(!a.fragen.some(f=>!f.sp))fehler.push(k+': nur Fragen mit Spieler');a.fragen.forEach(f=>{if(f.o.length!==3||f.o.some(x=>!P.antworten[x]||!P.arten[x]))fehler.push(k+': '+f.t);
    (f.t.match(/\{(\w+)\}/g)||[]).forEach(m=>{if(!bekannt.includes(m.slice(1,-1)))fehler.push(k+': '+m);});if(f.t.includes('{spieler}')&&!f.sp)fehler.push(k+': {spieler} ohne sp');});});
  Object.keys(P.arten).forEach(x=>{if(!P.antworten[x]||!P.schlagzeilen[x])fehler.push('Art ohne Texte: '+x);});
  pruef(!fehler.length,'Katalog: alle Anlässe, je Frage drei bekannte Antwortarten, keine unbekannten Platzhalter',fehler.slice(0,5).join(' | ')||`${Object.keys(P.anlaesse).length} Anlässe`);}

// 2. Anlass: zwei bis drei Fragen, nur eine offen, Abstand 4 Tage, Sperre 21 Tage je Art, Budget 20
{const w=welt(false),{F,S}=w,a=F.presseAnlass('derby',{gegner:gegner(w)}),n=S.pk?S.pk.fragen.filter(f=>!f.st).length:0,b=F.presseAnlass('krise',{serie:3}); /* n ohne die Stichelei (K29e) */
  S.pk=null;S.tag+=4;const c=F.presseAnlass('derby',{gegner:gegner(w)}),d=F.presseAnlass('krise',{serie:3});
  const P=F.presseS();S.pk=null;P.n[S.season]=20;S.tag+=30;const e=F.presseAnlass('hoehenflug',{serie:5});
  pruef(a&&n>=2&&n<=3&&!b&&!c&&d&&!e,'Anlass: 2 bis 3 Fragen, keine zweite offen, Derby gesperrt für 21 Tage, nach 4 Tagen eine andere Art, Budget 20 je Saison',[a,n,b,c,d,e].join(', '));}

// 3. Automatik: in der ersten Lizenz geht der Co-Trainer sofort, Medienklima −2; ohne Lernstufen Halt heute und Co-Trainer am nächsten Tag
{const w=welt(true),{F,S}=w,k0=F.presseS().klima;F.presseAnlass('derby',{gegner:gegner(w)});const auto=!S.pk&&F.presseS().klima===k0-2;
  const v=welt(false);v.F.presseAnlass('derby',{gegner:gegner(v)});const halt=v.F.haltGrund(v.S.tag),k1=v.F.presseS().klima;v.F.presseTag(v.S.tag+1);
  pruef(auto&&halt==='Pressekonferenz'&&!v.S.pk&&v.F.presseS().klima===k1-2,'Automatik: mit Lernstufen sofort der Co-Trainer, ohne Halt „Pressekonferenz“ und am nächsten Tag der Co-Trainer',`${auto}, Halt „${halt}“`);}

// 4. Antworten: Kritik am Spieler senkt seine Stimmung um 4 bis 10, Rückendeckung hebt die der Mannschaft, Medienklima im Deckel
{const w=welt(false),{F,S,ev}=w,sq=ev('squad')(VEREIN),p=sq[0],q=sq[1],st=ev('stimmung');p.st=50;q.st=50;
  F.presseAnlass('krise',{serie:3,pid:p.id});let ok=!!S.pk;const st0=st(p),k0=F.presseS().klima;
  if(S.pk){S.pk.fragen=[{t:'{spieler}?',o:['rueckendeckung','kritikSpieler','floskel'],sp:1,j:'Ralf Kessler'}];S.pk.i=0;F.pkAntwort('kritikSpieler');}const dp=st(p)-st0;
  frei(w);F.presseAnlass('hoehenflug',{serie:5});ok=ok&&!!S.pk;const stq=st(q);
  if(S.pk){S.pk.fragen=[{t:'Die Mannschaft?',o:['rueckendeckung','kritikTeam','floskel'],sp:0,j:'Petra Lindner'}];S.pk.i=0;F.pkAntwort('rueckendeckung');}
  const dq=st(q)-stq,dk=F.presseS().klima-k0;
  pruef(ok&&!S.pk&&dp<=-3.9&&dp>=-10&&dq>0&&Math.abs(dk)<=8,'Antworten: Kritik am Spieler kostet ihn 4 bis 10 Stimmung, Rückendeckung hebt die Mannschaft, Medienklima höchstens ±8 je Pressekonferenz',`Spieler ${dp.toFixed(1)}, Mitspieler ${dq.toFixed(1)}, Klima ${dk}`);}

// 5. Schiedsrichterkritik: in rund 30 % der Fälle eine Geldstrafe im Rahmen der Liga
{const w=welt(false),{F,S,t}=w,L=w.ev('RPK').schiri.strafe[t.lg];let n=0,ausser=0;
  for(let k=0;k<40;k++){frei(w);F.presseAnlass('krise',{serie:3});if(!S.pk)continue;S.pk.fragen=[{t:'Schiri?',o:['floskel','kritikSchiri','humor'],sp:0,j:'Ralf Kessler'}];S.pk.i=0;
    const vor=S.fin['Strafen']||0;F.pkAntwort('kritikSchiri');const b=vor-(S.fin['Strafen']||0);if(b>0){n++;if(b<L[0]||b>L[1])ausser++;}}
  pruef(n>=4&&n<=22&&!ausser,'Schiedsrichterkritik: Geldstrafe in 4 bis 22 von 40 Fällen, immer im Rahmen der Liga',`${n} Strafen, ${ausser} außerhalb`);}

// 6. Gedächtnis: Rückendeckung und Verkauf kostet Glaubwürdigkeit 5, Kampfansage eingelöst kommt in die Chronik, verloren kostet 3
{const w=welt(false),{F,S,ev,t}=w,p=ev('squad')(VEREIN)[2],g=gegner(w);F.presseAnlass('wechselwunsch',{pid:p.id});
  S.pk.fragen=[{t:'{spieler}?',o:['rueckendeckung','kritikSpieler','floskel'],sp:1,j:'Holger Vogt'}];S.pk.i=0;F.pkAntwort('rueckendeckung');
  t.glaub=50;p.team=g;F.presseWoche();const glaub1=t.glaub;p.team=VEREIN;
  frei(w);F.presseAnlass('derby',{gegner:g});S.pk.fragen=[{t:'Derby?',o:['ankuendigung','provokation','floskel'],sp:0,j:'Aylin Demir'}];S.pk.i=0;F.pkAntwort('ankuendigung');
  const c0=(S.stat&&S.stat.chronik||[]).length;F.kampfansagePruefen(g,2,0);const c1=(S.stat&&S.stat.chronik||[]).length;
  frei(w);S.tag+=30;F.presseAnlass('derby',{gegner:g});S.pk.fragen=[{t:'Derby?',o:['ankuendigung','provokation','floskel'],sp:0,j:'Aylin Demir'}];S.pk.i=0;F.pkAntwort('ankuendigung');
  t.glaub=50;F.kampfansagePruefen(g,0,1);
  pruef(glaub1===45&&c1===c0+1&&t.glaub===47,'Gedächtnis: Rückendeckung und dann weg −5 Glaubwürdigkeit, eingelöste Kampfansage in der Chronik, verlorene −3',`${glaub1}, Chronik ${c0}→${c1}, ${t.glaub}`);}

// 7. Auslöser Krise: drei Liganiederlagen in Folge öffnen die Pressekonferenz mit Serie 3; der Anlass würfelt nicht im Grundstrom
{const w=welt(false),{F,S,t}=w,g=gegner(w),lg=t.lg;for(let k=0;k<3;k++)S.res[lg].push([VEREIN,g,0,1,k]);const z0=JSON.stringify(S.zufall);
  F.presseNachSpiel({h:VEREIN,a:g,hg:0,ag:1,lg});const z1=JSON.stringify(S.zufall);const pk=S.pk,d=S.tag;
  // seit DR1: am Tag danach, mit Halt; am Tag danach bleibt sie, einen Tag später übernimmt der Co-Trainer (Prüfung DS5)
  const morgen=!!pk&&pk.tag===d+1&&F.haltGrund(d+1)!=='';F.presseTag(d+1);const bleibt=S.pk===pk;F.presseTag(d+2);const weg=!S.pk;
  pruef(!!pk&&pk.art==='krise'&&pk.serie===3&&z0===z1&&morgen&&bleibt&&weg,'Krise: nach drei Niederlagen in Folge eine Pressekonferenz „Krise“ mit Serie 3 am Tag danach mit Halt, ohne Griff in den Grundstrom',
    pk?`${pk.art}, Serie ${pk.serie}, Tag ${pk.tag - d}, Halt ${morgen}, bleibt ${bleibt}, danach weg ${weg}`:'keine');}

// K29b. Medienpolitik (K29 §6): offen zieht das Medienklima je Woche bis 70 hoch, abgeschottet bis 30 herunter, zurückhaltend zur Mitte (seit DF1); schlechtes Klima macht Gerüchte über dich
//       häufiger (Faktor 1,5 bei 0, 0,5 bei 100); mit Lernstufen (Bereich presse in der Automatik) gilt der Standard
{const {S,F,ev}=welt(false),P=ev('presseS')(),M=ev('REGELN').medienpolitik;P.klima=50;F.medienpolitikSetzen('offen');F.presseWoche();const k1=P.klima;for(let i=0;i<60;i++)F.presseWoche();const k2=P.klima;
  F.medienpolitikSetzen('abgeschottet');for(let i=0;i<100;i++)F.presseWoche();const k3=P.klima;F.medienpolitikSetzen('zurueckhaltend');F.presseWoche();const k4=P.klima;
  P.klima=0;const f0=ev('klimaFaktor')();P.klima=100;const f100=ev('klimaFaktor')();P.klima=50;
  const w=welt(true);w.S.mp='offen';const auto=w.ev('medienpolitik')().k===M.standard;
  pruef(k1===50+M.arten.offen.klima&&k2===M.arten.offen.ziel&&k3===M.arten.abgeschottet.ziel&&k4===k3+M.arten.zurueckhaltend.klima&&Math.abs(f0-1.5)<1e-9&&Math.abs(f100-0.5)<1e-9&&S.mp==='zurueckhaltend'&&auto,
    'Medienpolitik: Klima zieht zum Ziel der Art, Faktor auf Gerüchte, Standard in der Automatik',`Klima ${k1} / ${k2} / ${k3} / ${k4}, Faktor ${f0} / ${f100}, Automatik ${auto}`);}

// K29c. Exklusivinterview (K29 §6): gewähltes Medium +10, andere −3, Medienklima +2, erst nach 28 Tagen wieder; Wirkung der Gerüchte × (1 − Beziehung/60)
{const {S,F,ev}=welt(false),E=ev('REGELN').exklusiv,P=ev('presseS')();P.klima=50;F.exklusivInterview('fach');const a=ev('medienBez')('fach'),b=ev('medienBez')('boulevard'),k=P.klima;
  F.exklusivInterview('tv');const gesperrt=ev('medienBez')('tv')===E.andere;S.tag+=E.tage;F.exklusivInterview('tv');const wieder=ev('medienBez')('tv')===E.andere+E.plus;
  const wf=ev('medienWirkung')('fach'),wb=ev('medienWirkung')('boulevard');
  pruef(a===E.plus&&b===E.andere&&k===50+E.klima&&gesperrt&&wieder&&Math.abs(wf-(1-(E.plus+E.andere)/E.teiler))<1e-9&&Math.abs(wb-(1-2*E.andere/E.teiler))<1e-9,'Exklusivinterview: Beziehungen, Sperrfrist, Wirkung auf Gerüchte',
    `Fachblatt ${a}, Boulevard ${b}, Klima ${k}, gesperrt ${gesperrt}, wieder ${wieder}, Wirkung ${wf.toFixed(3)} / ${wb.toFixed(3)}`);}

// K29d. Medienklima in der Pressekonferenz: bei Klima 50 dieselbe Wahl der Journalisten wie vorher, bei 0 etwa 60 % Boulevard und Portal, bei 100 etwa 14 %;
//       unter 35 eine Frage mehr; Antworten wirken auf den Vorstand × (1 − Beziehung/60) zum fragenden Medium (negativ) und ändern diese Beziehung; Beziehungen verblassen je Woche um 0,5
{const {S,F,ev}=welt(false),P=ev('presseS')(),js=ev('PRESSE').journalisten,K=ev('RPK').klimaFragen,scharf=n=>K.scharf.includes(ev('jMedium')(n));
  P.klima=50;let gleich=true;for(let k=0;k<200;k++){const x=(k+0.5)/200;if(F.pkJournalist(x)!==js[Math.floor(x*js.length)].n)gleich=false;}
  const anteil=kl=>{P.klima=kl;let n=0;for(let k=0;k<1000;k++)if(scharf(F.pkJournalist((k+0.5)/1000)))n++;return n/1000;},a0=anteil(0),a100=anteil(100);
  const w=welt(false);w.F.presseS().klima=20;w.F.presseAnlass('derby',{gegner:gegner(w)});const n=w.S.pk?w.S.pk.fragen.filter(f=>!f.st).length:0;
  const vorstand=b=>{const v=welt(false);v.S.mb={boulevard:b};v.S.trust=50;v.F.presseAnlass('krise',{serie:3});if(!v.S.pk)return[NaN,NaN];
    v.S.pk.fragen=[{t:'Medien?',o:['rueckendeckung','angriffMedien','floskel'],sp:0,j:'Ralf Kessler'}];v.S.pk.i=0;v.F.pkAntwort('angriffMedien');return[v.S.trust-50,v.S.mb.boulevard];};
  const [df,bf]=vorstand(30),[dh]=vorstand(-30);
  S.mb={fach:2,tv:-1.2,lokal:0.3};F.presseWoche();const e1=[S.mb.fach,S.mb.tv,S.mb.lokal].join('/');for(let i=0;i<4;i++)F.presseWoche();const e5=[S.mb.fach,S.mb.tv].join('/');
  pruef(gleich&&Math.abs(a0-0.6)<0.01&&Math.abs(a100-1.5/10.5)<0.01&&n>=3&&n<=4&&df<0&&Math.abs(dh/df-3)<1e-6&&bf>=27&&bf<=29&&e1==='1.5/-0.7/0'&&e5==='0/0',
    'Medienklima in der Pressekonferenz: Journalisten nach Klima, Frage mehr unter 35, Wirkung und Beziehung über das fragende Medium, Verblassen',
    `gleich ${gleich}, scharf ${a0.toFixed(3)} / ${a100.toFixed(3)}, Fragen ${n}, Vorstand ${df.toFixed(2)} / ${dh.toFixed(2)}, Boulevard danach ${bf}, Verblassen ${e1} → ${e5}`);}

// K29e. Medienprofile der Computer-Trainer (K29 §7): fest aus der Nummer mit etwa 40/25/20/15 %; ein Psychospieler stichelt vor dem Derby in etwa der Hälfte der Fälle (erste Frage,
//       ohne offene Platzhalter), ein Diplomat nie; Konter hebt die eigene Mannschaft und den Gegner je um 1; Co-Trainer ohne Automatik −2, mit Automatik nichts
{const {S,F,ev}=welt(false),M=ev('RPK').medienprofil,zahl={};for(let k=0;k<2000;k++){const p=F.medienProfil({id:k});zahl[p]=(zahl[p]||0)+1;}
  const anteil=Object.keys(M.anteile).every(k=>Math.abs((zahl[k]||0)/2000-M.anteile[k]/100)<0.04),fest=F.medienProfil({id:7})===F.medienProfil({id:7});
  const w=welt(false),g=gegner(w),zaehle=prof=>{w.ev(`medienProfil=function(){return '${prof}'}`);let n=0,ok=true;for(let k=0;k<30;k++){frei(w);w.S.tag++;w.F.presseAnlass('derby',{gegner:g});const pk=w.S.pk;
    if(pk&&pk.profil){n++;const f=pk.fragen[0],c=w.ev('pkKontext')(pk);if(!f.st||f.o.join()!=='humor,provokation,floskel'||/\{\w+\}/.test(w.ev('pkText')(f.t,c)))ok=false;}}return[n,ok];};
  const [np,okp]=zaehle('psycho'),[nd]=zaehle('diplomatisch');
  w.ev("medienProfil=function(){return 'psycho'}");w.ev('RPK').medienprofil.chance.psycho=1;frei(w);w.S.tag++;w.F.presseAnlass('derby',{gegner:g});const eig=w.ev('squad')(VEREIN),geg=w.ev('squad')(g);
  eig.forEach(p=>p.st=50);geg.forEach(p=>p.st=50);w.S.pk.fragen=[w.S.pk.fragen[0]];w.S.pk.i=0;w.F.pkAntwort('provokation');const konter=[eig[0].st,geg[0].st].join('/');
  frei(w);w.S.tag++;w.F.presseAnlass('derby',{gegner:g});eig.forEach(p=>p.st=50);w.F.presseDelegieren(true);const offen=eig[0].st;
  const a=welt(true);a.ev("medienProfil=function(){return 'psycho'}");a.ev('RPK').medienprofil.chance.psycho=1;const ea=a.ev('squad')(VEREIN);ea.forEach(p=>p.st=50);a.F.presseAnlass('derby',{gegner:gegner(a)});
  const auto=!a.S.pk&&ea.every(p=>p.st===50);
  pruef(anteil&&fest&&np>=6&&np<=24&&okp&&nd===0&&konter==='51/51'&&offen===48&&auto,'Medienprofile: Anteile, Stichelei vor dem Derby, Konter wirkt auf beide, offene Stichelei −2, Automatik ohne Wirkung',
    `Anteile ${JSON.stringify(zahl)}, Psychospieler ${np} von 30 (${okp}), Diplomat ${nd}, Konter ${konter}, offen ${offen}, Automatik ${auto}`);}

// K29f. Interview am Spielfeldrand (K29 §4.1): nach deinem Spiel eine Frage ohne offene Platzhalter, Rückendeckung hebt die Mannschaft um 1 (halbe Wirkung) und das Klima um 0,5,
//       gilt bis zum nächsten Halt (seit DR1: weiter löscht es erst ab dem Tag danach), Pokal-Remis mit eigener Frage, Elfmeterschießen zählt (DR3),
//       abschaltbar, nicht neben einer offenen Pressekonferenz, nicht in der Automatik
{const {S,F,ev}=welt(false),g=gegner({S,t:ev('myT()')}),sq=ev('squad')(VEREIN),P=ev('presseS')();P.klima=50;sq.forEach(p=>p.st=50);S.tag=0; /* Frage reihum nach dem Tag: Tag 0 = erste Frage */
  F.spielfeldrandNachSpiel({h:VEREIN,a:g,hg:0,ag:2,lg:1});const offen=ev('ifrOffen')(),html=F.spielfeldrandKarte(),frage=/Woran|fehlt/.test(html)&&!/\{\w+\}/.test(html)&&html.includes('0:2');
  F.spielfeldrandAntwort('rueckendeckung');const st=sq[0].st,kl=P.klima,weg=!S.ifr;
  F.spielfeldrandNachSpiel({h:g,a:VEREIN,hg:1,ag:3,lg:1});F.spielfeldrandWeiter();const heute=!!S.ifr;F.spielfeldrandNachSpiel(null);const bleibt=!!S.ifr;
  S.tag++;F.spielfeldrandWeiter();const morgen=!S.ifr;S.tag--;
  F.spielfeldrandNachSpiel({h:VEREIN,a:g,hg:1,ag:1});const pokal=S.ifr&&S.ifr.e==='offen';F.spielfeldrandNachSpiel({h:VEREIN,a:g,hg:1,ag:1,pen:[4,3]});const elf=S.ifr&&S.ifr.e==='sieg';
  F.spielfeldrandAus(false);F.spielfeldrandNachSpiel({h:VEREIN,a:g,hg:1,ag:1,lg:1});const aus=!S.ifr;F.spielfeldrandAus(true);
  S.pk={art:'derby',fragen:[],i:0,antw:[],s:S.season,tag:S.tag};F.spielfeldrandNachSpiel({h:VEREIN,a:g,hg:1,ag:1,lg:1});const pk=!S.ifr;S.pk=null;
  const a=welt(true);a.F.spielfeldrandNachSpiel({h:VEREIN,a:gegner(a),hg:2,ag:0,lg:1});const auto=!a.S.ifr;
  pruef(offen&&frage&&st===51&&kl===50.5&&weg&&heute&&bleibt&&morgen&&pokal&&elf&&aus&&pk&&auto,'Interview am Spielfeldrand: Frage, halbe Wirkung, bis zum nächsten Halt, Pokal und Elfmeterschießen, abschaltbar, nicht neben Pressekonferenz und Automatik',
    `offen ${offen}, Frage ${frage}, Stimmung ${st}, Klima ${kl}, am Spieltag ${heute}/${bleibt}, danach weg ${morgen}, Pokal ${pokal}, Elfmeter ${elf}, aus ${aus}, neben Pressekonferenz ${pk}, Automatik ${auto}`);}

// K29g. Pressekonferenz nach dem Urteil (K29 §4.1): Sperre eines deiner Spieler ab 3 Spielen merkt sie vor, presseTag öffnet sie (seit DR2) mit dem Spieler,
//       bei 2 Spielen nicht, bei Spielern anderer Vereine nicht; nach urteilTage verfällt die Vormerkung
{const w=welt(false),{S,F,ev}=w,P=ev('presseS')(),sq=ev('squad')(VEREIN),p=sq[3],q=S.pl.find(x=>x.team>=0&&x.team<1000&&x.team!==VEREIN),v=(x,n)=>({pid:x.id,wb:'liga',team:x.team,art:'grob',tag:S.tag,antrag:n,vor:0,gesessen:0});
  F.sgUrteil(v(p,2),2,'angenommen',S.tag);const zwei=!P.urteil;F.sgUrteil(v(q,4),4,'angenommen',S.tag);const fremd=!P.urteil;
  F.sgUrteil(v(p,3),3,'angenommen',S.tag);const vor=!!P.urteil&&!S.pk;F.presseTag(S.tag);const ok=!!S.pk&&S.pk.art==='urteil'&&S.pk.pid===p.id&&S.pk.fragen.length>=2&&!P.urteil;
  frei(w);P.urteil={pid:p.id,tag:ev('absTag')(S.tag)-ev('RPK').anlass.urteilTage-1,s:S.season};F.presseTag(S.tag);const verfallen=!P.urteil&&!S.pk;
  pruef(zwei&&fremd&&vor&&ok&&verfallen,'Pressekonferenz nach dem Urteil: ab 3 Spielen Sperre für deinen Spieler, vorgemerkt, im Tageslauf geöffnet, verfällt',
    `2 Spiele ohne ${zwei}, anderer Verein ohne ${fremd}, vorgemerkt ${vor}, ${S.pk?S.pk.art:'geöffnet '+ok}, verfallen ${verfallen}`);}

// K29h. Kritik am Urteil (Prüfung DR5): in der Pressekonferenz nach dem Urteil heißt die Schiedsrichterkritik „Kritik am Urteil“, mit eigenen Texten und eigener Schlagzeile; sonst wie bisher
{const w=welt(false),{S,F,ev}=w,P=ev('presseS')(),U=ev('PRESSE').urteil,p=ev('squad')(VEREIN)[3];P.urteil={pid:p.id,tag:ev('absTag')(S.tag),s:S.season,wb:'liga'};ev('sperren')(p).liga.rot=3;F.presseTag(S.tag);
  const pk=S.pk;let ok=!!pk&&pk.art==='urteil';if(ok){pk.fragen=[{t:'{spieler}?',o:['rueckendeckung','kritikSchiri','floskel'],sp:1,j:'Ralf Kessler'}];pk.i=0;}
  const o=ok?F.pkOptionen(pk).find(x=>x.art==='kritikSchiri'):null,text=!!o&&U.antworten.some(a=>ev('pkText')(a,ev('pkKontext')(pk))===o.text),name=ok&&ev('pkArtName')(pk,'kritikSchiri')===U.name;
  const kopf=ok&&/Sportgericht|Urteil/.test(F.pkSchlagzeile('kritikSchiri',pk)),sonst=ev('pkArtName')({art:'derby'},'kritikSchiri')===ev('PRESSE').arten.kritikSchiri.name;
  pruef(ok&&text&&name&&kopf&&sonst,'Kritik am Urteil: eigener Name, eigene Texte, eigene Schlagzeile nur nach dem Urteil',`Pressekonferenz ${ok}, Text ${text}, Name ${name}, Schlagzeile ${kopf}, sonst ${sonst}`);}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
