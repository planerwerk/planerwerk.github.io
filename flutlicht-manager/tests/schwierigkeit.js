// Schwierigkeit (K02 §5.4): Bedingungen, Information und Hilfen ändern sich, Werte und Würfel im Spiel nicht.
// Prüft Startkonto, Kreditrahmen, Saisonziel, Entlassungsgrenze, Talentsterne und Erinnerungen je Stufe
// und dass eine ganze Saison auf „Leicht“ und „Schwer“ dieselben Ergebnisse bringt. Aufruf: node tests/schwierigkeit.js. Nur Node.js.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711;
function welt(stufe){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();const vorher={cash:W.ev('myT()').cash,ziel:S.target};
  F.stufeAnwenden(stufe);F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);return{W,F,S,vorher};}
const R={};for(const k of ['leicht','normal','schwer'])R[k]=welt(k);
const St=k=>R.normal.W.ev('REGELN').schwierigkeit.stufen[k];
for(const k of ['leicht','normal','schwer']){const {W,S,vorher}=R[k],t=W.ev('myT()'),kr=W.ev('kreditRahmen'),basis=W.ev('RF').kreditRahmen;
  pruef(Math.abs(t.cash-Math.round(vorher.cash*St(k).konto))<=1,`${St(k).name}: Startkonto ×${St(k).konto}`,`${vorher.cash} → ${t.cash}`);
  pruef(Math.abs(kr(t)-Math.round(basis.basis*Math.exp(basis.steigung*(t.rep-basis.mitte))/basis.runden)*basis.runden*St(k).kredit)<1,`${St(k).name}: Kreditrahmen ×${St(k).kredit}`); // Formel seit K23c
  const z=k==='leicht'?vorher.ziel+1:k==='schwer'?vorher.ziel-1:vorher.ziel;pruef(S.target===z||(k==='schwer'&&S.target===vorher.ziel),`${St(k).name}: Saisonziel`,`${vorher.ziel} → ${S.target}`);
  const aus=Object.keys(W.ev('RK').erinnerungen).filter(e=>!W.ev('erinnerungAn')(e)).length;pruef(St(k).erinnerungen?aus===0:aus===Object.keys(W.ev('RK').erinnerungen).length,`${St(k).name}: Erinnerungen ${St(k).erinnerungen?'an':'aus'}`);
  const p=W.S.pl.find(x=>x.team===VEREIN);p.tf=1;p.wiv=0;pruef(W.ev('sternFehler')(p)===(St(k).sterneGenau?0:1),`${St(k).name}: Talentsterne neuer Spieler ${St(k).sterneGenau?'genau':'unscharf'}`);}
// Grenze des Vorstands: Vertrauen 10 nach 7 Spieltagen. Leicht (Grenze 5): nichts. Schwer (Grenze 18): Ultimatum. Seit U12a (K28 §5.6) entlässt der Vorstand nicht mehr sofort,
// erst nach dem Ultimatum (geprüft in tests/vorstand.js).
for(const k of ['leicht','schwer']){const {W,S}=R[k],ls=W.ev('meineLigaspiele()');S.tag=ls[6].tag+1;S.trust=10;S.phase='play';S.fired=0;S.ult=null;W.ev('vorstandPruefen()');const unter=10<St(k).entlassenUnter;
  pruef(!!S.ult===unter&&!S.fired,`${St(k).name}: Vertrauen 10 nach 7 Spieltagen → ${unter?'Ultimatum':'nichts'}, keine sofortige Entlassung`);}
// Gleiche Würfel: eine Saison ohne Eingriffe auf Leicht und Schwer, im Gleichschritt, bis zum Saisonende oder bis eine der beiden Welten den Trainer entlässt
// (eine Entlassung ist eine andere Lage, danach dürfen sich die Welten unterscheiden)
// Verglichen wird Tag für Tag: Die Halte unterscheiden sich je Stufe (Erinnerungen, seit U15 auch „Deadline Day“ nur auf Leicht), also läuft die Welt weiter, die zurückliegt (T2.7).
{const a=welt('leicht'),b=welt('schwer');let n=0,gleich=true,verglichen=0;
  while(n<1000&&a.S.phase!=='end'&&!a.S.fired&&!b.S.fired){n++;const ta=a.W.S.tag,tb=b.W.S.tag;
    for(const w of ta===tb?[a,b]:ta<tb?[a]:[b]){if(w.W.ev('heuteMeinSpiel()'))w.F.tagesSpiele(w.W.S.tag);w.F.weiter();}
    if(a.S.fired||b.S.fired)break; // am Tag der Entlassung endet der Vergleich
    if(a.W.S.tag===b.W.S.tag){verglichen++;if(JSON.stringify(a.W.S.res)!==JSON.stringify(b.W.S.res)){gleich=false;break;}}}
  const sp=Object.values(a.W.S.res).reduce((s,l)=>s+l.length,0);
  pruef(gleich&&sp>=100,'Gleiche Ergebnisse auf Leicht und Schwer (gleicher Seed, ohne Eingriffe)',`${sp} Ergebnisse verglichen${b.S.fired?', Schwer: entlassen an Tag '+b.S.tag:''}`);}

// K02a. Neue Regeln ausprobieren (K02 §4.4): Jeder Eintrag in REGELN.experimente zeigt auf einen Schalter, der aus ist. experimentSetzen schaltet ihn für diesen
//       Spielstand ein (S.einst.exp) und wieder aus; experimenteAnwenden schaltet nur aus, was es selbst eingeschaltet hat (ein von außen gesetzter Schalter bleibt).
{const {W,F,S}=welt('normal'),ev=W.ev,X=ev('REGELN').experimente,o=x=>ev('expObjekt')(x.pfad);
  const alleAus=X.length>=4&&X.every(x=>!!o(x)&&o(x).an===false);
  F.experimentSetzen(X[0].k,true);const an=o(X[0]).an===true&&S.einst.exp[X[0].k]===true&&ev('experimentAn')(X[0].k);
  F.experimentSetzen(X[0].k,false);const aus=o(X[0]).an===false&&!S.einst.exp[X[0].k];
  o(X[1]).an=true;F.experimenteAnwenden();const fremd=o(X[1]).an===true;o(X[1]).an=false;
  S.einst.exp={[X[2].k]:true};F.experimenteAnwenden();const laden=o(X[2]).an===true;delete S.einst.exp[X[2].k];F.experimenteAnwenden();const wieder=o(X[2]).an===false;
  pruef(alleAus&&an&&aus&&fremd&&laden&&wieder,'Neue Regeln ausprobieren: alle Schalter aus, ein und aus je Spielstand, von außen gesetzte Schalter bleiben',
    `aus ${alleAus}, an ${an}, wieder aus ${aus}, von außen ${fremd}, Laden ${laden}/${wieder}`);}
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
