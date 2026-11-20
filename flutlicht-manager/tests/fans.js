// Fanstimmung (K27 §5.4b, §10, U16): Faktor für Zuschauer, Preise, wöchentlicher Schritt, Derby, Pokal, Verkauf eines Lieblings, Baustein im Vorstand,
// Pfiffe bei Protest, Fan-Gespräch, Lizenz, und eine Saison im Ablauf (70 % der Vereine zwischen 40 und 80).
// Aufruf: node tests/fans.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U16 entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt,saisons}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711,nah=(a,b,e=0.01)=>Math.abs(a-b)<=e;
function welt(lernstufen){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';if(lernstufen)F.lizenzStart(true);F.setTarget();F.sponsOffers();if(S.sponsOffers)F.sponsorWaehlen(0);
  S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);return{W,F,S,ev:W.ev,t:W.ev('myT()')};}

// 1. Zuschauerfaktor: 0,85 bei 0, 1 bei 60, 1,10 bei 100; am Start 60
{const {F,t,ev}=welt(false),f=v=>{t.fanst=v;return F.fanFaktor(t);},start=ev('fanst')(t);
  pruef(start===60&&nah(f(0),0.85)&&nah(f(60),1)&&nah(f(100),1.1)&&nah(f(30),0.925),'Zuschauerfaktor: Start 60, 0,85 bei 0, 1 bei 60, 1,10 bei 100',[f(0),f(30),f(60),f(100)].map(x=>x.toFixed(3)).join(', '));}

// 2. Preise: 10 % über dem Richtpreis kosten 3 Punkte, 50 % darüber höchstens −15
{const {F,t,ev}=welt(false),rp=ev('richtPreis')(t),alt=t.price;t.price=rp*1.1;const a=F.fanBausteine(t).preise;t.price=rp*1.5;const b=F.fanBausteine(t).preise;t.price=alt;
  pruef(nah(a,-3,0.05)&&b===-15,'Preise: +10 % auf den Richtpreis −3, +50 % −15 (Grenze)',`${a.toFixed(2)}, ${b}`);}

// 3. Wöchentlicher Schritt: 15 % Richtung Ziel, Anlässe verblassen
{const {F,t}=welt(false);t.fanst=40;t.fanE=10;const z=F.fanZiel(t);F.fansWoche();
  pruef(nah(t.fanst,Math.round((40+(z-40)*0.15)*10)/10,0.051)&&nah(t.fanE,8,0.05),'Woche: 15 % Richtung Ziel, Erfolgsanlass verblasst um 20 %',`Ziel ${z.toFixed(1)}, jetzt ${t.fanst}, Anlass ${t.fanE}`);}

// 4. Derby mit Sieger ±6, Pokal: weiter +2, Aus gegen Tieferklassige −4
{const {F,S,ev}=welt(false),dz=ev('istDerby'),T=S.teams.filter(t=>t.lg<=3);let paar=null;for(const a of T){const b=T.find(x=>x.id!==a.id&&dz(a.id,x.id));if(b){paar=[a,b];break;}}
  let derby=false;if(paar){const[a,b]=paar;a.fanE=0;b.fanE=0;F.fansDerby({h:a.id,a:b.id,hg:2,ag:0});derby=a.fanE===6&&b.fanE===-6;}
  const hoch=S.teams.find(t=>t.lg===1),tief=S.teams.find(t=>t.lg===3);hoch.fanE=0;tief.fanE=0;F.fansPokal([{h:tief.id,a:hoch.id,hg:1,ag:0}]);
  pruef(!!paar&&derby&&tief.fanE===2&&hoch.fanE===-4,'Anlässe: Derbysieg +6 und −6 für den Verlierer, Pokal weiter +2, Aus gegen einen Drittligisten −4',paar?`${paar[0].name} – ${paar[1].name}, Pokal ${tief.fanE}/${hoch.fanE}`:'kein Derby gefunden');}

// 5. Verkauf eines Publikumslieblings: −8 bei Entscheidungen (60 Pflichtspiele für den Verein)
{const {F,S,ev,t}=welt(false),KZ=ev('KZ'),p=ev('squad')(VEREIN)[0],z=[];z[KZ.s]=S.season-1;z[KZ.tid]=VEREIN;z[KZ.lg]=t.lg;z[KZ.sp]=60;z[KZ.min]=5000;for(let i=0;i<=KZ.mw;i++)if(z[i]==null)z[i]=0;p.kar=[z];
  const lieb=F.istLiebling(p,VEREIN);t.fanD=0;F.statTransfer(p,1e6,VEREIN,S.teams.find(x=>x.id!==VEREIN&&x.lg===1).id);
  pruef(lieb&&t.fanD===-8,'Liebling verkauft: mit 60 Pflichtspielen ein Liebling, Verkauf −8 bei Entscheidungen',`Liebling ${lieb}, Entscheidungen ${t.fanD}`);}

// 6. Vorstand: tote Zone 45 bis 75, darunter bis −10, darüber bis +5
{const {F,t}=welt(false),v=x=>{t.fanst=x;return F.fansVorstand(t);};
  pruef(v(60)===0&&v(45)===0&&nah(v(30),-5)&&v(10)===-10&&nah(v(90),3)&&v(100)===5,'Vorstand: 0 zwischen 45 und 75, bei 30 −5, ganz unten −10, bei 90 +3, höchstens +5',[30,10,60,90,100].map(v).join(', '));}

// 7. Pfiffe bei Protest: Selbstvertrauen −0,2 der eingesetzten Spieler im Ligaheimspiel, nicht auswärts
{const {F,S,ev,t}=welt(false),p=ev('squad')(VEREIN)[0];t.fanst=20;p.sv=0;F.fansHeimspiel({h:VEREIN,a:0,xpo:[[[p.id,'ZM',0.1,90]],[]]});const heim=p.sv;F.fansHeimspiel({h:0,a:VEREIN,xpo:[[],[[p.id,'ZM',0.1,90]]]});
  pruef(nah(heim,-0.2)&&nah(p.sv,-0.2),'Pfiffe: unter 30 im Heimspiel Selbstvertrauen −0,2, auswärts nichts',`${heim}, danach ${p.sv}`);}

// 8. Fan-Gespräch: nach Glaubwürdigkeit, einmal im Monat, unter 25 leere Versprechen; mit Lernstufen erst ab der C-Lizenz
{const {F,S,t}=welt(false);t.glaub=50;t.fanU=0;F.fanGespraech();const a=t.fanU;F.fanGespraech();const b=t.fanU;S.tag+=30;t.glaub=10;F.fanGespraech();const c=t.fanU-b;
  const w2=welt(true);w2.t.fanU=0;w2.F.fanGespraech();
  pruef(nah(a,5.5,0.051)&&b===a&&c===-5&&w2.t.fanU===0,'Fan-Gespräch: Glaubwürdigkeit 50 bringt +5,5, nicht zweimal im Monat, Glaubwürdigkeit 10 kostet 5, in der ersten Lizenz gesperrt',`${a}, ${b}, ${c}, Lizenz ${w2.t.fanU}`);}

// 9. Zuschauer im Heimspiel: gleicher Würfel, Stimmung 100 gibt 10 % mehr als 60
{const {F,S,ev,t}=welt(false),mit=ev('mitStrom'),st=ev('strom'),opp=S.teams.find(x=>x.lg===t.lg&&x.id!==VEREIN),fans=t.fans;t.fans=1000;
  t.fanst=60;const a=mit(st('test','zus'),()=>F.attendance(t,opp,false));t.fanst=100;const b=mit(st('test','zus'),()=>F.attendance(t,opp,false));t.fans=fans;
  pruef(a>0&&nah(b/a,1.1,0.01),'Zuschauer: mit Stimmung 100 rund 10 % mehr als mit 60 (gleicher Würfel)',`${a} → ${b}`);}

// 10. Eine Saison im Ablauf: 70 % der Vereine zwischen 40 und 80 (K27 §10)
{let anteil=null,werte='';saisons({n:1,seed:SEED,verein:VEREIN,beiSaisonende:S=>{const l=S.teams.filter(t=>t.lg<=3).map(t=>t.fanst==null?60:t.fanst);anteil=l.filter(v=>v>=40&&v<=80).length/l.length;werte=`min ${Math.min(...l)}, max ${Math.max(...l)}`;}});
  pruef(anteil!=null&&anteil>=0.7,'Saison: mindestens 70 % der Vereine mit Fanstimmung zwischen 40 und 80',anteil!=null?`${Math.round(anteil*100)} % (${werte})`:'kein Saisonende');}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
