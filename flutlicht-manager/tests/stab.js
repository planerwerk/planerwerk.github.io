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
// K32c. Ex-Spieler im Stab (K32 §3.3b): mit Chance 1 wird jeder Abgänger ab 100 Ligaspielen vereinsloser Mitarbeiter (Torhüter als Torwarttrainer, Qualität nach den Spielen),
//       darunter keiner; wer gerade Trainer im Pool geworden ist, nicht; mit Chance 0,25 über 200 Abgänger etwa ein Viertel
{const w=neueWelt();w.F.buildWorld(SEED);const V=w.W.S,E=w.W.ev('RST').exSpieler,pl=V.pl.filter(p=>p.team>=0).slice(0,240),tw=pl.find(p=>p.pos==='TW'),feld=pl.find(p=>p.pos!=='TW');
  const alt=E.chance;E.chance=1;tw.kas={sp:300};feld.kas={sp:160};const wenig=pl.find(p=>p!==tw&&p!==feld);wenig.kas={sp:20};const vor=V.stab.length;
  const n1=w.F.stabExSpieler([tw,feld,wenig]),neu=V.stab.slice(vor),t1=neu.find(x=>x.n===tw.n),f1=neu.find(x=>x.n===feld.n);
  const coach=pl.find(p=>p!==tw&&p!==feld&&p!==wenig);coach.kas={sp:200};(V.trainer||(V.trainer=[])).push({id:9999,n:coach.n,ex:1,seit:V.season,tid:null,st:[]});const n2=w.F.stabExSpieler([coach]);
  E.chance=alt;const viele=pl.filter(p=>p!==tw&&p!==feld&&p!==wenig&&p!==coach).slice(0,200);viele.forEach(p=>p.kas={sp:150});const n3=w.F.stabExSpieler(viele);
  const qSoll=Math.round(E.basis+300/E.jeSpiele);
  pruef(n1===2&&!!t1&&t1.r==='torwart'&&t1.team===-1&&t1.ex===300&&Math.abs(t1.q-qSoll)<=2&&!!f1&&Object.keys(E.rollen).includes(f1.r)&&n2===0&&n3>=30&&n3<=70,
    'Ex-Spieler im Stab: Torhüter als Torwarttrainer, Feldspieler als Co-, Jugend- oder Standardtrainer, nur ab 100 Ligaspielen, nicht zugleich Trainer, Anteil etwa ein Viertel',
    `${n1} neu (Torhüter ${t1&&t1.r} Q${t1&&t1.q}, Feld ${f1&&f1.r}), Trainer ${n2}, 200 Abgänger → ${n3}`);}
// K16b. Trainerteam mitnehmen (K16 §5): nur wer mindestens 30 Wochen bei dir war, höchstens zwei; beim neuen Verein Gehalt nach seiner Liga, ist die Rolle voll, geht der Schwächste dort
{const w=neueWelt();w.F.buildWorld(SEED);const V=w.W.S,ev=w.W.ev,M=ev('RST').mitnehmen,alt=V.teams.find(t=>ev('aktiv')(t)&&t.lg===2&&ev('stabVon')(t.id,'co').length);V.my=alt.id;
  const co=ev('stabVon')(alt.id,'co')[0],ander=V.stab.find(x=>x.team===alt.id&&x!==co);co.wiv=M.wochen;if(ander)ander.wiv=M.wochen-1;
  const liste=ev('mitnehmbar')().map(x=>x.id),nurCo=liste.includes(co.id)&&(!ander||!liste.includes(ander.id));
  const neu=V.teams.find(t=>ev('aktiv')(t)&&t.lg===1&&ev('stabVon')(t.id,'co').length>=ev('RST').rollen.co.plaetze),schwach=ev('stabVon')(neu.id,'co').slice().sort((a,b)=>a.q-b.q)[0];
  V.mitnehmen=[co.id].concat(ander?[ander.id]:[]);V.my=neu.id;const n=w.F.stabMitnehmen(alt.id);ev('stabGeaendert')();
  const ok=n===1&&co.team===neu.id&&co.sal===ev('stabGehalt')('co',co.q,1)&&(!ander||ander.team===alt.id)&&schwach.team===-1&&ev('stabVon')(neu.id,'co').length<=ev('RST').rollen.co.plaetze&&V.mitnehmen===null;
  pruef(nurCo&&ok,'Trainerteam mitnehmen: nur nach 30 Wochen, Gehalt der neuen Liga, volle Rolle gibt den Schwächsten ab',`wählbar ${liste.length}, mitgenommen ${n}, Co-Trainer jetzt bei ${co.team===neu.id?'neuem Verein':co.team}, Schwächster frei ${schwach.team===-1}`);}
console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
