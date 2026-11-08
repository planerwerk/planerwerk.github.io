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
  pruef(Math.abs(kr(t)-(basis.basis+t.rep*basis.jeAnsehen)*St(k).kredit)<1,`${St(k).name}: Kreditrahmen ×${St(k).kredit}`);
  const z=k==='leicht'?vorher.ziel+1:k==='schwer'?vorher.ziel-1:vorher.ziel;pruef(S.target===z||(k==='schwer'&&S.target===vorher.ziel),`${St(k).name}: Saisonziel`,`${vorher.ziel} → ${S.target}`);
  const aus=Object.keys(W.ev('RK').erinnerungen).filter(e=>!W.ev('erinnerungAn')(e)).length;pruef(St(k).erinnerungen?aus===0:aus===Object.keys(W.ev('RK').erinnerungen).length,`${St(k).name}: Erinnerungen ${St(k).erinnerungen?'an':'aus'}`);
  const p=W.S.pl.find(x=>x.team===VEREIN);p.tf=1;p.wiv=0;pruef(W.ev('sternFehler')(p)===(St(k).sterneGenau?0:1),`${St(k).name}: Talentsterne neuer Spieler ${St(k).sterneGenau?'genau':'unscharf'}`);}
// Entlassung: Vertrauen 10 nach 7 Spieltagen. Leicht (Grenze 5): bleibt. Schwer (Grenze 18): entlassen.
for(const k of ['leicht','schwer']){const {W,F,S}=R[k],ls=W.ev('meineLigaspiele()');S.tag=ls[6].tag+1;S.trust=10;S.phase='play';S.fired=0;W.ev('vorstandPruefen()');pruef(!!S.fired===(10<St(k).entlassenUnter),`${St(k).name}: Vertrauen 10 nach 7 Spieltagen → ${10<St(k).entlassenUnter?'entlassen':'bleibt'}`);}
// Gleiche Würfel: eine Saison ohne Eingriffe auf Leicht und Schwer, im Gleichschritt, bis zum Saisonende oder bis eine der beiden Welten den Trainer entlässt
// (eine Entlassung ist eine andere Lage, danach dürfen sich die Welten unterscheiden)
{const a=welt('leicht'),b=welt('schwer');let n=0,gleich=true;
  while(n<500&&a.S.phase!=='end'&&!a.S.fired&&!b.S.fired){n++;for(const w of [a,b]){if(w.W.ev('heuteMeinSpiel()'))w.F.tagesSpiele(w.W.S.tag);w.F.weiter();}
    if(a.S.fired||b.S.fired)break; // am Tag der Entlassung endet der Vergleich
    if(JSON.stringify(a.W.S.res)!==JSON.stringify(b.W.S.res)){gleich=false;break;}}
  const sp=Object.values(a.W.S.res).reduce((s,l)=>s+l.length,0);
  pruef(gleich&&sp>=100,'Gleiche Ergebnisse auf Leicht und Schwer (gleicher Seed, ohne Eingriffe)',`${sp} Ergebnisse verglichen${b.S.fired?', Schwer: entlassen an Tag '+b.S.tag:''}`);}
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
