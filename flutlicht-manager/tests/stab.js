// Trainerstab (K16 §10): Bänder ehrlich, Einzeltrainingsplätze, Wirkung eines Top-Stabs auf die Ausfalltage (15–25 % weniger),
// keine Rolle ist Pflicht für den Erfolg, Gehälter und Verträge laufen über eine Saison. Aufruf: node tests/stab.js [Seed=5]. Nur Node.js.
const {neueWelt,saisons}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %';
const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;
// 1. Bänder (K16 §5.2): Die angezeigte Spanne enthält immer die wahre Qualität
{let ok=0,n=0;S.stab.forEach(x=>{const t=ev('stabQText')(x);const m=t.match(/^(\d+)(?:–(\d+))?$/);if(!m)return;n++;const a=+m[1],b=m[2]?+m[2]:a;if(x.q>=a&&x.q<=b)ok++;});
  pruef(ok===n&&n>0,'Bänder: die Spanne der Qualität enthält immer den wahren Wert',`${ok} von ${n}`);}
// 2. Einzeltrainingsplätze (K16 §5.3): ein Co-Trainer mit Qualität 10 gibt 5 Plätze, zwei mit 18 höchstens 10
{const t=S.teams.find(x=>x.lg===2);const alt=S.stab.filter(x=>x.team===t.id&&x.r==='co');alt.forEach(x=>x.team=-1);ev('stabGeaendert')();
  const a=ev('stabNeu')('co',10,t.id,2);S.stab.push(a);ev('stabGeaendert')();const p1=ev('stabPlaetze')(t.id);
  a.q=18;const b=ev('stabNeu')('co',18,t.id,2);S.stab.push(b);ev('stabGeaendert')();const p2=ev('stabPlaetze')(t.id);
  pruef(p1===5&&p2===10,'Einzeltrainingsplätze: ein Co-Trainer (Qualität 10) gibt 5, zwei mit 18 geben 10',`${p1} und ${p2}`);
  S.stab=S.stab.filter(x=>x!==a&&x!==b);alt.forEach(x=>x.team=t.id);ev('stabGeaendert')();}
// 3. Top-Stab gegen ohne (nur Co-Trainer): Ausfalltage 15–25 % weniger. Aus Athletiktrainer (Häufigkeit der Trainingsverletzungen, gut 40 % aller)
//    und Physiotherapeut (Dauer aller Verletzungen) mit den echten Formeln.
{const tid=S.teams.find(x=>x.lg===2).id,setze=q=>{S.stab=S.stab.filter(x=>x.team!==tid);ev('STAB_ROLLEN')().forEach(r=>{if(q!=null||r==='co')S.stab.push(ev('stabNeu')(r,q==null?10:q,tid,2));});ev('stabGeaendert')();};
  setze(18);const athT=ev('stabFaktor')(tid,'athletik'),phT=ev('stabFaktor')(tid,'physio');setze(null);const athO=ev('stabFaktor')(tid,'athletik'),phO=ev('stabFaktor')(tid,'physio');
  const anteil=0.43,ratio=((1-anteil)+anteil*athT/athO)*phT/phO;
  pruef(ratio>=0.75&&ratio<=0.85,'Stab lohnt sich: ein Top-Stab (Qualität 18) senkt die Ausfalltage um 15–25 % gegenüber ohne Stab',`${pc(1-ratio)} weniger`);
  const co=ev('stabFaktor')(tid,'co');pruef(co>=0.85&&co<=1.15,'Kein Pflicht-Stab: Lerntempo mit oder ohne gute Co-Trainer zwischen 0,85 und 1,15',co.toFixed(2));}
// 4. Eine Saison: Gehälter werden gebucht, Verträge laufen aus, vereinslose Mitarbeiter bleiben verfügbar
{let gehalt=0,vorher=0,nachher=0,frei=0;saisons({n:1,seed:SEED,verein:6,beiSaisonstart:S=>{vorher=S.stab.length;},beiSaisonende:S=>{gehalt=S.fin['Trainerstab']||0;}});
  const r=saisons({n:2,seed:SEED,verein:6,beiSaisonstart:S=>{nachher=S.stab.length;frei=S.stab.filter(x=>x.team<0).length;}});
  pruef(gehalt<0,'Gehälter des Stabs werden je Ligaspiel gebucht',Math.round(gehalt).toLocaleString('de-DE')+' €');
  pruef(frei>=W.ev('RST').vereinslos&&Math.abs(nachher-vorher)<=W.ev('RST').vereinslos,'Neue Saison: Verträge laufen aus, genug vereinslose Mitarbeiter bleiben',`${vorher} → ${nachher} Mitarbeiter, ${frei} vereinslos`);}
console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
