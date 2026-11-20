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
  pruef(!fehler.length,'Katalog: 14 Anlässe, je Frage drei bekannte Antwortarten, keine unbekannten Platzhalter',fehler.slice(0,5).join(' | ')||`${Object.keys(P.anlaesse).length} Anlässe`);}

// 2. Anlass: zwei bis drei Fragen, nur eine offen, Abstand 4 Tage, Sperre 21 Tage je Art, Budget 20
{const w=welt(false),{F,S}=w,a=F.presseAnlass('derby',{gegner:gegner(w)}),n=S.pk?S.pk.fragen.length:0,b=F.presseAnlass('krise',{serie:3});
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
  F.presseNachSpiel({h:VEREIN,a:g,hg:0,ag:1,lg});const z1=JSON.stringify(S.zufall);
  pruef(!!S.pk&&S.pk.art==='krise'&&S.pk.serie===3&&z0===z1,'Krise: nach drei Niederlagen in Folge eine Pressekonferenz „Krise“ mit Serie 3, ohne Griff in den Grundstrom',S.pk?`${S.pk.art}, Serie ${S.pk.serie}`:'keine');}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
