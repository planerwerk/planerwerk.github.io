// Schwierigkeit im Langlauf (K43 §4 und §7, 26.11., vorläufig): Misst je Stufe über mehrere Saisons, was die Stufe aus Sicht des Spielers ändert.
// Dein Verein läuft dabei ganz in der Automatik (alle Bereiche beim Stab, wie Gleichschritt 5a in tests/lizenz.js), also wie ein Computer-Verein mit den Regeln der Stufe.
// Drei Startvereine: der mit dem höchsten Ansehen der 1. Liga, der mittlere der 1. Liga und der mittlere der 2. Liga. Gleicher Seed auf allen Stufen.
// Gezählt je Stufe und Verein: Meisterschaften, Pokalsiege, Europapokal-Titel, Insolvenzen (auf Leicht: Rettungen durch den Gönner), Entlassungen,
// Saisons mit negativem Konto am Saisonende, Durchschnitt des Kontos am Saisonende.
// Geprüft wird nur der Zielwert aus K43 §4 (auf Leicht höchstens 6 Meisterschaften in 10 Saisons für den Spitzenverein), und nur ab 10 Saisons. Alles andere ist Ausgabe für die Kalibrierung.
// Aufruf: node tests/schwierigkeit-langlauf.js [Saisons=5] [Seed=7]. Nur Node.js. Dauer: etwa 12 × Saisons × Dauer einer Saison (vier Stufen mit „mitwachsend“, drei Vereine).
// ACHTUNG: Dieses Skript ist noch nie gelaufen (entstanden auf einem Rechner ohne Node.js).
const {neueWelt,saisons}=require('./sim');
const N=+(process.argv[2]||5),SEED=+(process.argv[3]||7),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const allesAuto=(S,ev)=>{const B=ev('RLZ').bereiche;for(const b in B)if(B[b].auto)S.lizenz.auto[b]=1;};
// Startvereine aus einer Welt mit demselben Seed
const vereine=(()=>{const {W,F}=neueWelt();F.buildWorld(SEED);const T=W.S.teams,nach=lg=>T.filter(t=>t.lg===lg).sort((a,b)=>b.rep-a.rep||a.id-b.id);
  const l1=nach(1),l2=nach(2);return[['Spitze 1. Liga',l1[0]],['Mitte 1. Liga',l1[Math.floor(l1.length/2)]],['Mitte 2. Liga',l2[Math.floor(l2.length/2)]]].map(([k,t])=>({k,id:t.id,name:t.name}));})();
const erg={};
// „mitwachsend“ (K43 §5): zeigt zusätzlich die Stufe am Ende jeder Saison (Hinweis aus Prüfung GG)
for(const stufe of ['leicht','normal','schwer','mitwachsend'])for(const v of vereine){
  const z={meister:0,pokal:0,europa:0,pleite:0,entlassen:0,minus:0,konto:[],stufen:[]};let ev=null;
  saisons({n:N,seed:SEED,verein:v.id,stufe,
    // Zählen über Hüllen um insolvenzPruefen (t.fins ändert sich nur bei einer Insolvenz oder Rettung) und entlassen (S.fired springt auf 1)
    vorher:(F,W)=>{ev=W.ev;const ins=F.insolvenzPruefen,ent=F.entlassen;
      F.insolvenzPruefen=function(){const t=W.ev('myT()'),vor=t.fins;const x=ins.apply(this,arguments);if(t.fins!==vor)z.pleite++;return x;};
      F.entlassen=function(){const vor=W.S.fired;const x=ent.apply(this,arguments);if(!vor&&W.S.fired)z.entlassen++;return x;};},
    beiSaisonstart:(S,F)=>{if(!S.lizenz){F.lizenzStart(false);allesAuto(S,ev);}},
    beiSaisonende:(S)=>{const sm=S.summary||{},m=sm.my!=null?sm.my:S.my;if(sm.champ===m&&sm.lg===1)z.meister++;if(sm.cup===m)z.pokal++;
      const ti=S.eu&&S.eu.titel;if(ti&&['cl','el','ecl'].some(w=>ti[w]===m))z.europa++;const t=S.teams[m];if(t){if(t.cash<0)z.minus++;z.konto.push(t.cash);}z.stufen.push(S.stufe);}});
  erg[stufe+'|'+v.k]=z;
  console.log(`${stufe.padEnd(11)} ${v.k.padEnd(15)}`+(stufe==='mitwachsend'?` [Stufe je Saisonende: ${z.stufen.join(' ')}]`:'')+` (${v.name}): Meister ${z.meister}, Pokal ${z.pokal}, Europa ${z.europa}, Pleite ${z.pleite}, entlassen ${z.entlassen}, `
    +`Konto im Minus ${z.minus} von ${z.konto.length}, Konto im Schnitt ${Math.round(z.konto.reduce((a,b)=>a+b,0)/Math.max(1,z.konto.length)/1e5)/10} Mio.`);}
const sp=erg['leicht|Spitze 1. Liga'];
if(N>=10)pruef(sp.meister<=Math.round(6*N/10),`K43 §4: Spitzenverein auf Leicht höchstens 6 Meisterschaften je 10 Saisons`,`${sp.meister} in ${N}`);
else console.log(`  (K43 §4 wird erst ab 10 Saisons geprüft, jetzt ${N}: Spitzenverein auf Leicht ${sp.meister} Meisterschaften)`);
console.log(`\nDauer ${Math.round((Date.now()-t0)/1000)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
