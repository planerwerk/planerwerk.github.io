// Training (K07 §10): Vorbereitung langsam steigern, Vertrautheit, Umschulung, Anteil der Trainingsverletzungen, und über Saisons:
// Training wirkt (gegen „Schonen“), dauerhaft hart lohnt kaum. Aufruf: node tests/training.js [Saisons=3] [Seed=5]. Nur Node.js.
const {neueWelt,saisons}=require('./sim');
const N=+(process.argv[2]||3),SEED=+(process.argv[3]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const f1=x=>x.toFixed(1),pc=x=>(x*100).toFixed(0)+' %';

// 1. Vorbereitung: sofort hart (Aufbau ab dem ersten Tag) bringt in den ersten drei Wochen mindestens 1,5-mal so viele Trainingsverletzungen wie langsames Steigern
{const lauf=vorlage=>{let n=0;for(const seed of [SEED,SEED+1,SEED+2]){const {W,F}=neueWelt();F.buildWorld(seed);const S=W.S;S.my=6;S.mgr='T';F.setTarget();F.sponsOffers();
      S.teams.forEach(t=>{t.vorlage=vorlage;});const bis=S.plan.trainingsauftakt+21;let k=0;while(S.tag<bis&&k<200){k++;F.weiter();if(S.sponsOffers)F.sponsorWaehlen(0);}
      n+=S.pl.reduce((a,p)=>a+(p.tinj||0),0);}return n;};
  const hart=lauf('aufbau'),langsam=lauf('vorbereitung');pruef(hart>=1.5*Math.max(1,langsam),'Vorbereitung: sofort hart mindestens 1,5-mal so viele Trainingsverletzungen in drei Wochen wie langsam steigern',`${hart} gegen ${langsam}`);}
// 2. Vertrautheit: von 30 auf 80 in 6–8 Wochen mit Standardwoche (zwei Taktik-Einheiten, Spielvorbereitung) und einem Spiel pro Woche
{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,RTA=W.ev('RTA'),t={id:999,stil:'pressing',form:'4-4-2',vorlage:'standard',vt:{stil:{pressing:30},ordnung:{'4-4-2':30}}};let w=0;
  while(W.ev('vertraut')(t,'stil','pressing')<80&&w<30){const b=200+w*7;for(let k=1;k<7;k++)W.ev('trainingVerein')(t,{last:b,next:b+7},b+k);
    W.ev('vertrautSetzen')(t,'stil','pressing',W.ev('vertraut')(t,'stil','pressing')+RTA.vertrautheit.jeSpiel);W.ev('vertrautheitWoche')(t);w++;}
  pruef(w>=6&&w<=8,'Vertrautheit: von 30 auf 80 in 6–8 Wochen (Standardwoche, ein Spiel pro Woche)',w+' Wochen');}
// 3. Umschulung: verwandte Position von 75 auf 90 % in etwa vier Wochen, fremde von 60 auf 90 % in etwa 15 Wochen
{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,eig0=W.ev('eignung'),eig=(q,pos)=>eig0(Object.assign({},q,{fuss:'B'}),pos);const p=S.pl.find(x=>x.team>=0&&x.fp==='IV'&&!x.mk.vielseitig),wochen=ziel=>{p.um=ziel;p.eig={};let w=0;while(p.um&&w<40){p.wt=5;W.ev('umschulungWoche')(p);w++;}return w;};
  const v=wochen('LV'),fr=wochen('MS');pruef(v>=3&&v<=5,`Umschulung: verwandte Position (IV → LV, ${Math.round(eig(Object.assign({},p,{eig:null}),'LV')*100)} %) auf 90 % in 3–5 Wochen`,v+' Wochen');
  pruef(fr>=12&&fr<=18,`Umschulung: fremde Position (IV → MS, ${Math.round(eig(Object.assign({},p,{eig:null}),'MS')*100)} %) auf 90 % in 12–18 Wochen`,fr+' Wochen');}
// 4. Über Saisons: Anteil der Trainingsverletzungen 40–55 %. Training wirkt: Mit dem Co-Trainer-Plan ist die Startelf stärker und konditionell besser als mit „Schonen“,
//    ohne deutlich mehr Ausfälle. Punkte schwanken über wenige Saisons zu stark (±7 je Saison), darum wird die Wirkung selbst geprüft:
//    +1 Stärke der Startelf sind etwa +2,5 Punkte pro Saison (tests/akzeptanz.js). Dauerhaft hart kostet sichtbar mehr Trainingsverletzungen.
{const X=6;const lauf=vorlage=>{let spielV=0,trainV=0,eigeneT=0;const str=[],ko=[],aus=[];
    saisons({n:N,seed:SEED,verein:X,beiSaisonstart:S=>{S.teams[X].vorlage=vorlage;},
      beiSpielen:(l,S)=>{l.forEach(r=>{spielV+=r.inj.length;});const r=l.find(x=>x.h===X||x.a===X);if(!r)return;const s=r.h===X?0:1,P=new Map(S.pl.map(p=>[p.id,p])),xi=r.xi[s].map(id=>P.get(id)).filter(Boolean);
        str.push(xi.reduce((a,p)=>a+p.str,0)/xi.length);ko.push(xi.reduce((a,p)=>a+p.ko,0)/xi.length);aus.push(S.pl.filter(p=>p.team===X&&p.inj>0).length);},
      beiSaisonende:S=>{trainV+=S.pl.reduce((a,p)=>a+(p.tinj||0),0);eigeneT+=S.pl.filter(p=>p.team===X).reduce((a,p)=>a+(p.tinj||0),0);S.pl.forEach(p=>{p.tinj=0;});}});
    const m=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length),zweite=a=>a.slice(Math.floor(a.length/2));
    return{anteil:trainV/(trainV+spielV),str:m(zweite(str)),ko:m(ko),aus:m(aus),eigeneT:eigeneT/N};};
  const auto=lauf('auto'),schonen=lauf('schonen'),hart=lauf('aufbau');
  pruef(auto.anteil>=0.40&&auto.anteil<=0.55,'Verletzungen: Anteil aus dem Training 40–55 %',pc(auto.anteil));
  pruef(auto.str-schonen.str>=0.3,'Training wirkt: Startelf mit dem Co-Trainer-Plan stärker als mit „Schonen“ (zweite Hälfte, mindestens +0,3)',`${f1(auto.str)} gegen ${f1(schonen.str)}`);
  pruef(auto.ko-schonen.ko>=10,'Training wirkt: Kondition der Startelf mindestens 10 höher als mit „Schonen“',`${f1(auto.ko)} gegen ${f1(schonen.ko)}`);
  pruef(auto.aus<=schonen.aus+1,'Training kostet nicht zu viel: im Schnitt höchstens ein Verletzter mehr im Kader als mit „Schonen“',`${f1(auto.aus)} gegen ${f1(schonen.aus)}`);
  pruef(hart.eigeneT>auto.eigeneT,'Dauerhaft hart (Aufbau das ganze Jahr) kostet mehr Trainingsverletzungen als der Co-Trainer-Plan',`${f1(hart.eigeneT)} gegen ${f1(auto.eigeneT)} pro Saison`);}
console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
