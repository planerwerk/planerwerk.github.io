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
// 3. Umschulung (K07 §3.3, Entscheidung vom 12.11.): nur Nachbarpositionen, entfernte nur sehr jung oder vielseitig, nie Torwart, nach Alter gestaffelt, selten
{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev,eig0=ev('eignung'),eig=(q,pos)=>eig0(Object.assign({},q,{fuss:'B'}),pos),grund=ev('umschulungGrund'),ziele=ev('umschulungZiele');
  const iv=S.pl.filter(x=>x.team>=0&&x.fp==='IV'&&!x.mk.vielseitig),p=iv[0],frisch=(q,alter)=>{q.age=alter;q.ue={};q.uf=[];q.um=null;delete q.mk.vielseitig;return q;};
  const wochen=(q,ziel)=>{q.um=ziel;let w=0;while(q.um&&w<60){q.wt=5;ev('umschulungWoche')(q);w++;}return w;};
  frisch(p,22);const v=wochen(p,'LV');pruef(v>=3&&v<=5&&p.ue.LV===90&&p.uf.includes('LV'),'Umschulung: Nachbarposition (IV → LV, 75 %) mit 22 Jahren auf 90 % in 3–5 Wochen',v+' Wochen');
  // Nachbarn laut Eignungstabelle, deine Beispiele: Außenverteidiger zu Innenverteidiger, Mittelstürmer zum Außenstürmer
  const nb=ev('nachbarPos');pruef(nb('LV','IV')&&nb('RV','IV')&&nb('MS','LA')&&nb('MS','RA')&&nb('IV','DM')&&!nb('IV','MS')&&!nb('ZM','LV')&&!nb('LA','RM')&&!nb('IV','TW'),'Nachbarpositionen: Außenverteidiger und Innenverteidiger, Mittelstürmer und Außenstürmer, nicht Innenverteidiger und Mittelstürmer');
  frisch(p,24);const z24=ziele(p).sort().join(' ');pruef(z24==='DM LV RV'&&!!grund(p,'MS')&&!!grund(p,'ZM'),'Mit 24 Jahren stehen nur die Nachbarpositionen zur Wahl',z24);
  // Torwart nie: ein 30-jähriger Mittelfeldspieler nicht, ein 17-Jähriger nicht, ein Torwart nicht ins Feld
  const mf=frisch(S.pl.find(x=>x.team>=0&&x.fp==='ZM'),30),tw=S.pl.find(x=>x.team>=0&&x.pos==='TW');const g30=grund(mf,'TW');mf.age=17;const g17=grund(mf,'TW');mf.mk.vielseitig=1;const gv=grund(mf,'TW');delete mf.mk.vielseitig;
  pruef(!!g30&&!!g17&&!!gv&&!!grund(tw,'IV')&&!ziele(tw).length,'Torwart ist ausgeschlossen: kein Feldspieler wird Torwart (auch nicht jung oder vielseitig), kein Torwart Feldspieler',g30);
  // sehr jung: auch entfernte Positionen (aus einem Innenverteidiger wird ein Stürmer), aber langsamer und mit niedrigerem Höchstwert
  frisch(p,17);const zj=ziele(p).length,fj=wochen(p,'MS');pruef(zj>=10&&fj>=10&&fj<=14&&p.ue.MS===85&&eig(p,'MS')>=0.85,'Sehr jung (17): Innenverteidiger zum Mittelstürmer geht, von 55 auf 85 % in 10–14 Wochen',`${fj} Wochen, ${zj} Ziele wählbar`);
  pruef(!!grund(p,'LV')&&!ziele(p).length,'Selten: Nach einer Umschulung ist Schluss, eine zweite Position gibt es nicht',grund(p,'LV'));
  // vielseitig: entfernte Positionen in jedem Alter und eine zweite Umschulung
  const vs=frisch(iv[1],26);vs.mk.vielseitig=1;const zv=ziele(vs).length,w1=wochen(vs,'LV');const g2=grund(vs,'DM'),w2=wochen(vs,'DM');const g3=grund(vs,'RV');delete vs.mk.vielseitig;
  pruef(zv>=10&&vs.uf.length===2&&!g2&&!!g3&&vs.ue.LV===93,'Vielseitig: auch entfernte Positionen, Höchstwert 95 (mit 26: 93), zwei Umschulungen, keine dritte',`${zv} Ziele, ${w1} und ${w2} Wochen`);
  // Alter: Ältere lernen langsamer und weniger, ab Anfang 30 lohnt es kaum noch
  const a30=frisch(iv[2],30),w30=wochen(a30,'LV'),m30=a30.ue.LV,a33=frisch(iv[3],33),m33=ev('umschulungMax')(a33,'LV'),g33=grund(a33,'DM');
  pruef(10/w30<15/v&&m30===85&&m33===82&&!!g33,'Alter: mit 30 lernt er IV → LV langsamer (Punkte je Woche) und nur bis 85 %, mit 33 bis 82 %, IV → DM (85 %) bringt dann nichts mehr',`${(10/w30).toFixed(1)} gegen ${(15/v).toFixed(1)} Punkte je Woche, ${g33}`);
  pruef(!grund(frisch(iv[4],30),'LV')&&!!grund(iv[4],'MS'),'Ein 30-jähriger Innenverteidiger wird kein Mittelstürmer');
  // Der Fortschritt übersteht Speichern, Laden und den Saisonwechsel (bis UL hing er an der Liste der Eigenschaften und ging verloren)
  const q=frisch(S.pl.find(x=>x.team>=0&&x.fp==='ZM'&&x!==mf),23);q.um='LM';for(let w=0;w<3;w++){q.wt=5;ev('umschulungWoche')(q);}const e0=eig(q,'LM'),geladen=JSON.parse(JSON.stringify(q));ev('eigenschaftenNeu')(q);
  pruef(e0>eig(Object.assign({},q,{ue:null}),'LM')+0.02&&Math.abs(eig(geladen,'LM')-e0)<1e-9&&Math.abs(eig(q,'LM')-e0)<1e-9&&Array.isArray(q.eig),'Umschulung: Fortschritt bleibt nach Speichern, Laden und Saisonwechsel erhalten',`${Math.round(e0*100)} %`);
  // Aktion: ein gesperrtes Ziel wird abgelehnt, die Spielerkarte bietet nur erlaubte Ziele an
  S.my=p.team;frisch(iv[5]||p,28);const sp=S.pl.find(x=>x.team===S.my&&x.fp==='IV'&&!x.mk.vielseitig)||p;frisch(sp,28);F.setUmschulung(sp.id,'MS');const abgelehnt=!sp.um;F.setUmschulung(sp.id,'LV');
  pruef(abgelehnt&&sp.um==='LV','Aktion: ein entferntes Ziel wird abgelehnt, die Nachbarposition angenommen');}

// 4. Über Saisons: Anteil der Trainingsverletzungen 40–55 %. Training wirkt: Mit dem Co-Trainer-Plan entwickeln sich die Spieler schneller und sind konditionell besser als mit „Schonen“,
//    ohne deutlich mehr Ausfälle. Punkte schwanken über wenige Saisons zu stark (±7 je Saison), darum wird die Wirkung selbst geprüft:
//    +1 Stärke der Startelf sind etwa +2,5 Punkte pro Saison (tests/akzeptanz.js). Dauerhaft hart kostet sichtbar mehr Trainingsverletzungen (gemessen an allen Vereinen).
{const X=6;const lauf=(vorlage,alle)=>{let spielV=0,trainV=0,eigeneT=0;const str=[],ko=[],aus=[];
    saisons({n:N,seed:SEED,verein:X,beiSaisonstart:S=>{S.teams.forEach(t=>{if(alle||t.id===X)t.vorlage=vorlage;});},
      beiSpielen:(l,S)=>{l.forEach(r=>{spielV+=r.inj.length;});const r=l.find(x=>x.h===X||x.a===X);if(!r)return;const s=r.h===X?0:1,P=new Map(S.pl.map(p=>[p.id,p])),xi=r.xi[s].map(id=>P.get(id)).filter(Boolean);
        str.push(S.pl.filter(p=>p.team===X).reduce((a,p,_,q)=>a+(p.trf||1)/q.length,0));ko.push(xi.reduce((a,p)=>a+p.ko,0)/xi.length);aus.push(S.pl.filter(p=>p.team===X&&p.inj>0).length);},
      beiSaisonende:S=>{trainV+=S.pl.reduce((a,p)=>a+(p.tinj||0),0);eigeneT+=S.pl.filter(p=>p.team===X).reduce((a,p)=>a+(p.tinj||0),0);S.pl.forEach(p=>{p.tinj=0;});}});
    const m=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length),zweite=a=>a.slice(Math.floor(a.length/2));
    return{anteil:trainV/(trainV+spielV),trf:m(str),ko:m(ko),aus:m(aus),eigeneT:eigeneT/N,alleT:trainV/N};};
  const auto=lauf('auto'),schonen=lauf('schonen'),hart=lauf('aufbau',true);
  pruef(auto.anteil>=0.40&&auto.anteil<=0.55,'Verletzungen: Anteil aus dem Training 40–55 %',pc(auto.anteil));
  pruef(auto.trf-schonen.trf>=0.08,'Training wirkt: Trainingsfaktor der Entwicklung im Kader mit dem Co-Trainer-Plan mindestens 0,08 höher als mit „Schonen“',`${auto.trf.toFixed(2)} gegen ${schonen.trf.toFixed(2)}`);
  pruef(auto.ko-schonen.ko>=10,'Training wirkt: Kondition der Startelf mindestens 10 höher als mit „Schonen“',`${f1(auto.ko)} gegen ${f1(schonen.ko)}`);
  pruef(auto.aus<=schonen.aus+1,'Training kostet nicht zu viel: im Schnitt höchstens ein Verletzter mehr im Kader als mit „Schonen“',`${f1(auto.aus)} gegen ${f1(schonen.aus)}`);
  // Ein einzelner Verein hat etwa 14 Trainingsverletzungen je Saison, das Rauschen ist größer als die Wirkung (+12 bis +17 %). Darum trainieren im Vergleichslauf alle Vereine hart.
  pruef(hart.alleT>auto.alleT*1.05,'Dauerhaft hart (Aufbau das ganze Jahr, alle Vereine) kostet mindestens 5 % mehr Trainingsverletzungen als der Co-Trainer-Plan',`${Math.round(hart.alleT)} gegen ${Math.round(auto.alleT)} pro Saison (+${((hart.alleT/auto.alleT-1)*100).toFixed(0)} %)`);}
console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
