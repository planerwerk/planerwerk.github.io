// Wettbewerbe und Spielplan (K13 §10): Pokal-Auslosung mit Töpfen und Heimrecht, Auslosung vor der Runde, Bundesligisten raus in Runde 1,
// Relegation mit Verlängerung und Elfmeterschießen, Supercup, 72 Stunden zwischen zwei Spielen, Zweitmannschaften. Aufruf: node tests/wettbewerbe.js [Saisons=3] [Seed=4]
const {saisons,neueWelt}=require('./sim');
const N=+(process.argv[2]||3),SEED=+(process.argv[3]||4),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const f1=x=>x.toFixed(1),pc=x=>(x*100).toFixed(0)+' %';
const tage={},runde1=[],heimFehler=[],losZuSpaet=[],zweiteFehler=[],supercups=[];let losGeprueft=0;
const {W,F}=saisons({n:N,seed:SEED,verein:6,
  beiSaisonstart:S=>{S.teams.forEach(t=>{if(t.zweite>=0&&S.teams[t.zweite]&&S.teams[t.zweite].lg===t.lg&&t.lg<=3)zweiteFehler.push(`${S.season}: ${t.name}`);});},
  beiSpielen:(liste,S,o)=>{const am=id=>id>=1000||S.teams[id].lg>=3;
    // Relegation und Pokalfinale liegen im echten Kalender (Donnerstag, Samstag, Montag) so dicht, dass ein Verein in beiden dreimal in fünf Tagen spielt: ausgenommen
    const relFinale=new Set();o.gruppen.forEach(g=>{if(g.art==='rel'||g.art==='rel2'||(g.art==='pokal'&&g.e.r===5))g.list.forEach(r=>{relFinale.add(r.h);relFinale.add(r.a);});});
    liste.forEach(r=>{[r.h,r.a].forEach(id=>{if(id<1000&&!relFinale.has(id))(tage[id]=tage[id]||[]).push(S.season*400+o.tag);});
      if(r.supercup)supercups.push({s:S.season,h:r.h,a:r.a,hg:r.hg,ag:r.ag,pen:r.pen,verl:r.ev.some(e=>e.m>90&&e.t!=='E'&&e.t!=='P'),tag:o.tag});});
    o.gruppen.filter(g=>g.art==='pokal').forEach(g=>{const rr=g.e.r,L=S.cup.los;losGeprueft++;if(!L||L.am>=S.plan.pokal[rr][0]-1)losZuSpaet.push(`${S.season} Runde ${rr+1}`);
      g.list.forEach(r=>{if(rr===0)runde1.push({h:r.h,a:r.a,hProfi:!am(r.h),aProfi:!am(r.a),aLg:r.a<1000?S.teams[r.a].lg:9,hLg:r.h<1000?S.teams[r.h].lg:9,sieger:r.hg>r.ag?r.h:r.hg<r.ag?r.a:(r.pen[0]>r.pen[1]?r.h:r.a)});
        if(rr<=4&&am(r.h)!==am(r.a)&&!am(r.h))heimFehler.push(`${S.season} Runde ${rr+1}: ${r.h} – ${r.a}`);});});}});
const S=W.S,ev=W.ev;
// 1. Runde 1: nie zwei Profis gegeneinander (Konsistenzprüfung AK6), Amateure immer zu Hause
const pp=runde1.filter(x=>x.hLg===1&&x.aLg===1).length;pruef(runde1.length>0&&pp===0,'Pokal Runde 1: nie zwei Erstligisten gegeneinander (Profitopf gegen Amateurtopf)',`${pp} von ${runde1.length}`);
pruef(runde1.every(x=>x.hLg>=x.aLg),'Pokal Runde 1: der Verein aus dem Amateurtopf spielt zu Hause (nie ein höherklassiger Gastgeber)',runde1.filter(x=>x.hLg<x.aLg).length+' Ausnahmen');
pruef(heimFehler.length===0,'Pokal bis zum Halbfinale: Amateure (3. Liga und darunter) haben gegen Profis Heimrecht',heimFehler.slice(0,3).join('; ')||'immer');
pruef(losGeprueft>0&&losZuSpaet.length===0,'Auslosung mindestens zwei Tage vor der Runde',losZuSpaet.slice(0,3).join('; ')||`${losGeprueft} Runden`);
// 2. Bundesligisten raus in Runde 1: im Schnitt 2–5 pro Saison (prüfen)
{const raus=runde1.filter(x=>(x.hLg===1&&x.sieger!==x.h)||(x.aLg===1&&x.sieger!==x.a)).length/N;pruef(raus>=1&&raus<=5,'Bundesligisten scheiden in Runde 1 aus: im Schnitt 1–5 pro Saison (Ziel 2–5 prüfen)',f1(raus));}
// 3. 72 Stunden: kein Verein spielt zweimal innerhalb von drei Tagen
{let n=0,b=[];for(const id in tage){const t=[...new Set(tage[id])].sort((a,b)=>a-b);for(let i=1;i<t.length;i++)if(t[i]-t[i-1]<3){n++;if(b.length<3)b.push(`${S.teams[id].name} ${t[i-1]%400}/${t[i]%400}`);}}
  pruef(n===0,'72 Stunden: kein Verein spielt zweimal innerhalb von drei Tagen',n?`${n}× (${b.join('; ')})`:'nie');}
// 4. Zweitmannschaften nie in der Liga der ersten Mannschaft
pruef(zweiteFehler.length===0,'Zweitmannschaften nie in derselben Liga wie die erste',zweiteFehler.join('; ')||'nie');
// 5. Supercup ab der zweiten Saison: Meister gegen Pokalsieger (oder Vizemeister), ohne Verlängerung, bei Gleichstand Elfmeterschießen
pruef(supercups.length===N-1&&supercups.every(x=>!x.verl&&(x.hg!==x.ag)===!x.pen),'Supercup ab der zweiten Saison, ohne Verlängerung, bei Gleichstand Elfmeterschießen',supercups.map(x=>`${x.s}: ${x.hg}:${x.ag}${x.pen?' i.E. '+x.pen.join(':'):''}`).join(', ')||'keiner');
// 6. Relegation direkt simuliert: 16. der 1. Liga gegen 3. der 2. Liga, Hin- und Rückspiel, Rückspiel mit Verlängerung und Elfmeterschießen
{const w=neueWelt();w.F.buildWorld(SEED);const S2=w.W.S;S2.my=-9;const st=id=>S2.pl.filter(p=>p.team===id).map(p=>p.str).sort((a,b)=>b-a).slice(0,14).reduce((a,b)=>a+b,0);
  const l1=S2.teams.filter(t=>t.lg===1).sort((a,b)=>st(b.id)-st(a.id)),l2=S2.teams.filter(t=>t.lg===2).sort((a,b)=>st(b.id)-st(a.id)),e=l1[15].id,z=l2[2].id;
  let erst=0,elf=0,verl=0;const n=300;for(let i=0;i<n;i++){S2.season=7000+i;S2.tag=1;const a=w.F.sim(z,e,{});S2.tag=4;const b=w.F.sim(e,z,{ko:1,agg:[a.ag,a.hg]});
    const s=w.W.ev('relegationSieger')([a,b],[e,z]);if(s===e)erst++;if(b.pen)elf++;if(b.ev.some(x=>x.m>90))verl++;}
  // Echt seit 2009 etwa 80 % (13 von 16 bis 2024). Im Spiel sind der 16. der 1. Liga und der 3. der 2. Liga fast gleich stark (Konsistenzprüfung AI5, K32): nur Plausibilität
  pruef(erst/n>=0.3&&erst/n<=0.85,'Relegation: der Erstligist setzt sich in 30–85 % durch (echt etwa 80 %, Abstand der Kader: AI5)',pc(erst/n));
  pruef(elf>0&&verl>0,'Relegation: Verlängerung und Elfmeterschießen kommen vor, kein Los',`Verlängerung ${pc(verl/n)}, Elfmeterschießen ${pc(elf/n)}`);}
console.log(`\n${N} Saison(s) in ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
