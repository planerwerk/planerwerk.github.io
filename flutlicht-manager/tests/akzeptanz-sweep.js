// Vergleich für die Sensitivität der Engine (K04 §10, tests/akzeptanz.js Nr. 2): Ein Feldspieler +5 soll 1–3 Punkte je Saison bringen, kein Bereich mehr als das Doppelte
// eines anderen. Seit dem ersten Testlauf liegt die Abwehr bei +0,8 bis +0,9 (rot), Mittelfeld und Angriff im Ziel. Statt blind zu drehen, misst dieses Skript
// vier Einstellungen mit denselben Zufallsströmen nebeneinander (wie tests/kalibrierung-sweep.js für die Meisterpunkte):
//   heute; abwehr.jePunkt 0,03 statt 0,022 (Druck der Abwehr auf den Abschluss); Innenverteidiger zählt mehr zur Abwehr Mitte (0,95 statt 0,85, ohne Kontrolle);
//   angriff.exponent 1,65 statt 1,55 (Stärkeunterschied wirkt stärker auf die Chancen, betrifft alle Bereiche).
// Je Einstellung eine Zeile ✓ (alle drei Bereiche 1–3 und kein Bereich mehr als das Doppelte) oder ✗, dazu Tore pro Spiel der Basis. Vergleich, kein Fehler im Spiel.
// Aufruf: node tests/akzeptanz-sweep.js [Durchgänge=100] [Seed=5]. Nur Node.js. Dauer etwa viermal Nr. 2 aus tests/akzeptanz.js. Entstanden ohne Node.js (27.11.), noch nie gelaufen.
const {neueWelt}=require('./sim');
const N=+(process.argv[2]||100),SEED=+(process.argv[3]||5),t0=Date.now();
const f1=x=>x.toFixed(1),f2=x=>x.toFixed(2),vz=x=>(x>=0?'+':'')+f1(x);
const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=-9; // kein eigener Verein, wie tests/akzeptanz.js
const RE=W.ev('REGELN').engine;
const kader=id=>S.pl.filter(p=>p.team===id);
const niveau=id=>{const s=kader(id).map(p=>p.str).sort((a,b)=>b-a).slice(0,14);return s.reduce((a,b)=>a+b,0)/s.length;};
const L2=S.teams.filter(t=>t.lg===2).map(t=>t.id).sort((a,b)=>niveau(b)-niveau(a)),X=L2[Math.floor(L2.length/2)];
S.teams[X].form='4-4-2';
function bilanz(tid,gegner,n){let pkt=0,gf=0,ga=0,sp=0;
  for(let r=0;r<n;r++){S.season=5000+r;
    for(const g of gegner){if(g===tid)continue;
      S.tag=1;let x=F.sim(tid,g);gf+=x.hg;ga+=x.ag;pkt+=x.hg>x.ag?3:x.hg===x.ag?1:0;
      S.tag=2;x=F.sim(g,tid);gf+=x.ag;ga+=x.hg;pkt+=x.ag>x.hg?3:x.ag===x.hg?1:0;sp+=2;}}
  return{pkt:pkt/n,tore:(gf+ga)/sp};}
const mit=(aendern,messen)=>{const zurueck=aendern();try{return messen();}finally{zurueck();}};
const staerke=(p,wert)=>()=>{const alt=p.str;p.str=wert;return()=>{p.str=alt;};};
// Einstellungen: je eine Änderung an REGELN.engine, die danach zurückgesetzt wird
const EINST=[
  {name:'heute',setze:()=>()=>{}},
  {name:'abwehr.jePunkt 0,03',setze:()=>{const a=RE.abwehr.jePunkt;RE.abwehr.jePunkt=0.03;return()=>{RE.abwehr.jePunkt=a;};}},
  {name:'IV Abwehr Mitte 0,95',setze:()=>{const a=RE.anteile.IV.slice();RE.anteile.IV=[0,0,0,0.95,0.05];return()=>{RE.anteile.IV=a;};}},
  {name:'angriff.exponent 1,65',setze:()=>{const a=RE.angriff.exponent;RE.angriff.exponent=1.65;return()=>{RE.angriff.exponent=a;};}}];
const wahl={Abwehr:'IV',Mittelfeld:'ZM',Angriff:'MS'};
console.log(`Testteam ${S.teams[X].name} (2. Liga, Niveau ${f1(niveau(X))}, 4-4-2), ${N} Durchgänge gegen die übrigen Teams je Messung`);
for(const E of EINST){const zurueck=E.setze();
  try{const xp=F.side(X,false,true).xp,b=bilanz(X,L2,N),d={};
    for(const [bereich,pos] of Object.entries(wahl)){const xs=xp.filter(y=>y.pos===pos);if(!xs.length)continue;
      d[bereich]=xs.reduce((s,x)=>s+mit(staerke(x.p,x.p.str+5),()=>bilanz(X,L2,N)).pkt-b.pkt,0)/xs.length;}
    const w=Object.values(d),ok=w.length===3&&w.every(v=>v>=1&&v<=3)&&Math.max(...w)<=2*Math.max(0.1,Math.min(...w));
    console.log(`${ok?'✓':'✗'} ${E.name.padEnd(24)} ${Object.entries(d).map(([k,v])=>k+' '+vz(v)).join(' · ')} · Basis ${f1(b.pkt)} Punkte, ${f2(b.tore)} Tore je Spiel`);}
  finally{zurueck();}}
console.log(`\nZiel: jeder Bereich +1 bis +3 Punkte je Saison, keiner mehr als das Doppelte eines anderen. Tore je Spiel sollen nahe bei heute bleiben (2. Liga 2,85–3,1).`);
console.log(`Dauer ${Math.round((Date.now()-t0)/1000)} s\n\nVergleich, kein Fehler im Spiel: ✗ heißt nur, dass diese Einstellung nicht alle Ziele trifft. Bitte alle vier Zeilen wörtlich ins Testprotokoll übernehmen.`);
