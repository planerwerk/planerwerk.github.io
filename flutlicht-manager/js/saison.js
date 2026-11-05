// Tabelle, Saisonende, neue Saison, Jobangebote.
function table(lg){const T={};S.teams.filter(t=>t.lg===lg).forEach(t=>T[t.id]={id:t.id,sp:0,s:0,u:0,n:0,tf:0,ta:0,p:0,last:[]});
  S.res[lg].forEach(([h,a,hg,ag])=>{const H=T[h],A=T[a];if(!H||!A)return;H.sp++;A.sp++;H.tf+=hg;H.ta+=ag;A.tf+=ag;A.ta+=hg;
    if(hg>ag){H.s++;A.n++;H.p+=3;H.last.push(3);A.last.push(0);}else if(hg<ag){A.s++;H.n++;A.p+=3;H.last.push(0);A.last.push(3);}else{H.u++;A.u++;H.p++;A.p++;H.last.push(1);A.last.push(1);}});
  return Object.values(T).sort((x,y)=>y.p-x.p||(y.tf-y.ta)-(x.tf-x.ta)||y.tf-x.tf||S.teams[y.id].rep-S.teams[x.id].rep);}
const rank=(lg,id)=>table(lg).findIndex(r=>r.id===id)+1;
function formPts(id){const r=table(S.teams[id].lg).find(x=>x.id===id);if(!r||!r.last.length)return 1.4;const l=r.last.slice(-5);return l.reduce((a,b)=>a+b,0)/l.length;}
const topScorers=lg=>S.pl.filter(p=>p.team>=0&&S.teams[p.team].lg===lg&&p.g>0).sort((a,b)=>b.g-a.g).slice(0,15);
function seasonEnd(){
  const t1=table(1),t2=table(2),me=myT(),pos=rank(me.lg,S.my),B=RV;
  S.teams.forEach(t=>{t.lastPos=rank(t.lg,t.id);t.lastLg=t.lg;});
  const rel=[t1[15].id,t2[2].id],a=sim(rel[1],rel[0]),b=sim(rel[0],rel[1]),g0=a.ag+b.hg,g1=a.hg+b.ag;
  const rw=g0>g1?rel[0]:g1>g0?rel[1]:(R()<RS.relegationLos?rel[0]:rel[1]);
  const ts=topScorers(1)[0];
  const sm={season:S.season,lg:me.lg,pos,target:S.target,champ:t1[0].id,champ2:t2[0].id,down:[t1[16].id,t1[17].id],up:[t2[0].id,t2[1].id],rel,relRes:`Hinspiel ${tn(a.h)} – ${tn(a.a)} ${a.hg}:${a.ag}, Rückspiel ${tn(b.h)} – ${tn(b.a)} ${b.hg}:${b.ag}${g0===g1?', Entscheidung im Elfmeterschießen':''}`,rw,cup:S.cup.alive.length===1?S.cup.alive[0]:null,ts:ts?`${ts.n} (${tn(ts.team)}), ${ts.g} Tore`:'–',ok:pos<=S.target,fin:Object.values(S.fin).reduce((x,y)=>x+y,0)};
  S.trust=clamp(S.trust+(sm.ok?B.saisonErreicht:pos>S.target+B.saisonWeitAb?B.saisonWeit:B.saisonVerfehlt),0,100);
  news(`${tn(sm.champ)} ist Deutscher Meister ${S.season}/${(S.season+1)%100}!`,'good');
  news(`Relegation: ${sm.relRes}. ${tn(rw)} spielt nächste Saison in der 1. Liga.`);
  S.hist.push({s:S.season,team:me.name,lg:me.lg,pos,ok:sm.ok});
  S.summary=sm;S.phase='end';if(S.trust<B.entlassenSaisonUnter&&!S.fired){S.fired=1;mkJobs();}save();}
function newSeason(){const sm=S.summary,Z=RS;
  sm.down.forEach(id=>S.teams[id].lg=2);sm.up.forEach(id=>S.teams[id].lg=1);
  if(sm.rw===sm.rel[1]){S.teams[sm.rel[1]].lg=1;S.teams[sm.rel[0]].lg=2;}
  S.teams.forEach(t=>{const A=Z.ansehen;let d=clamp((t.expPos-t.lastPos)*A.faktor,-A.maxAenderung,A.maxAenderung);if(t.lastLg===2&&t.lg===1)d+=A.aufstieg;if(t.lastLg===1&&t.lg===2)d+=A.abstieg;t.rep=clamp(Math.round(t.rep+d),A.min,A.max);t.fans=Math.round(clamp(t.fans*(1+d*Z.fans.faktor),Z.fans.min,t.cap*Z.fans.maxJePlatz));});
  const K=Z.karriereende;
  S.pl.forEach(p=>{if(p.team<-1)return;p.age++;p.g=0;p.pg=0;p.apps=0;p.yc=0;p.sus=0;p.inj=0;p.fit=Z.neuFitness;p.form=Z.neuForm;
    if((p.age>=K.abAlter&&R()<(p.age-K.nullAlter)*K.jeJahr)||p.age>=K.spaetestens){if(p.team===S.my)news(`${p.n} beendet seine Karriere.`);p.team=-2;return;}
    if(p.team>=0){p.ct--;if(p.ct<=0){if(p.team===S.my){news(`Vertrag ausgelaufen: ${p.n} verlässt den Verein.`,'bad');p.team=-1;p.list=0;}else if(R()<Z.vertrag.verlaengern){p.ct=riA(Z.vertrag.jahre);p.sal=salaryFor(p.str);}else{p.team=-1;p.list=0;}}}
    if(p.team!==S.my)p.list=0;});
  S.pl=S.pl.filter(p=>p.team!==-2);reindex();
  const N=Z.nachwuchs;
  S.teams.forEach(t=>{const base=grundStaerke(t.rep),yl=t.id===S.my?t.youth:N.computerStufe;
    for(let k=0;k<N.anzahl;k++){const pos=pick(N.positionen);const p=mkPlayer({pos,age:N.alter,str:Math.round(base-N.abschlag+riA(N.streuung)+yl),team:t.id,ct:N.vertrag});p.pot=Math.round(base-N.talentAbschlag+riA(N.talentStreuung)+yl*N.talentJeStufe);p.sal=Math.round(p.sal*N.gehalt/1000)*1000;addP(p);
      if(t.id===S.my)news(`Aus der Jugend: ${p.n} (${p.pos}, ${N.alter}) rückt in den Profikader auf. Talent ${stars(p)}.`,'good');}
    if(t.id===S.my)return;
    const need=Z.kaderSoll;
    for(const pos in need){let have=squad(t.id).filter(p=>p.pos===pos).length;while(have<need[pos]){const fa=S.pl.filter(p=>p.team===-1&&p.pos===pos&&p.str<=base+Z.vereinslosBis).sort((a,b)=>b.str-a.str)[0];
      if(fa&&R()<Z.vereinslosChance){fa.team=t.id;fa.ct=riA(Z.vertrag.jahre);fa.sal=salaryFor(fa.str);}else addP(mkPlayer({pos,age:riA(Z.auffuellAlter),str:Math.round(base-Z.auffuellAbschlag+riA(Z.auffuellStreuung)),team:t.id}));have++;}}
    const sq=squad(t.id);if(sq.length>Z.kaderMax)sq.sort((a,b)=>a.str-b.str).slice(0,sq.length-Z.kaderMax).forEach(p=>{p.team=-1;p.list=0;});});
  const fa=S.pl.filter(p=>p.team===-1);if(fa.length>Z.vereinsloseMax){fa.sort((a,b)=>a.str-b.str).slice(0,fa.length-Z.vereinsloseMax).forEach(p=>p.team=-2);S.pl=S.pl.filter(p=>p.team!==-2);reindex();}
  S.am.forEach(a=>a.str=riA(RW.amateurStaerke));
  S.season++;S.wk=0;S.res={1:[],2:[]};S.fx={1:roundRobin(lgIds(1)),2:roundRobin(lgIds(2))};S.cal=mkCal();initCup();
  S.fin={};S.att=[0,0];S.offers=[];S.phase='play';S.summary=null;TDAY=null;TLG=0;LAST=null;
  setTarget();if(S.spons){S.spons.yrs--;if(S.spons.yrs<=0)S.spons=null;}if(!S.spons)sponsOffers();
  S.lineup=bestXI(S.my,myT().form);
  news(`Neue Saison ${S.season}/${(S.season+1)%100}: Ziel des Vorstands – ${targetText(myT().lg,S.target)}.`,'good');save();}
function mkJobs(){const J=RV.jobs,r=myT().rep-J.ansehenAbschlag;const c=S.teams.filter(t=>t.id!==S.my).sort((a,b)=>Math.abs(a.rep-r)-Math.abs(b.rep-r)).slice(0,J.kandidaten);S.jobs=shuffle(c).slice(0,J.angebote).map(t=>t.id);}
function takeJob(id){const old=myT().name;LAST=null;S.my=id;S.fired=0;S.trust=RV.neuerJob;S.offers=[];S.constr=null;S.loan=0;S.fin={};S.att=[0,0];setTarget();if(!S.spons||S.sponsOffers===null){S.spons=null;sponsOffers();}S.lineup=bestXI(id,myT().form);
  news(`Neuer Job: ${S.mgr} übernimmt ${myT().name} (vorher ${old}). Ziel: ${targetText(myT().lg,S.target)}.`,'good');save();closeOv();TAB='buero';render();if(S.phase==='end')showSummary();}
