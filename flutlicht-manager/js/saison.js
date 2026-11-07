// Tabelle, Saisonende, neue Saison, Jobangebote.
function table(lg){const T={};S.teams.filter(t=>t.lg===lg).forEach(t=>T[t.id]={id:t.id,sp:0,s:0,u:0,n:0,tf:0,ta:0,p:0,last:[]});
  S.res[lg].forEach(([h,a,hg,ag])=>{const H=T[h],A=T[a];if(!H||!A)return;H.sp++;A.sp++;H.tf+=hg;H.ta+=ag;A.tf+=ag;A.ta+=hg;
    if(hg>ag){H.s++;A.n++;H.p+=3;H.last.push(3);A.last.push(0);}else if(hg<ag){A.s++;H.n++;A.p+=3;H.last.push(0);A.last.push(3);}else{H.u++;A.u++;H.p++;A.p++;H.last.push(1);A.last.push(1);}});
  return Object.values(T).sort((x,y)=>y.p-x.p||(y.tf-y.ta)-(x.tf-x.ta)||y.tf-x.tf||S.teams[y.id].rep-S.teams[x.id].rep);}
const rank=(lg,id)=>table(lg).findIndex(r=>r.id===id)+1;
function formPts(id){const r=table(S.teams[id].lg).find(x=>x.id===id);if(!r||!r.last.length)return 1.4;const l=r.last.slice(-5);return l.reduce((a,b)=>a+b,0)/l.length;}
const topScorers=lg=>S.pl.filter(p=>p.team>=0&&S.teams[p.team].lg===lg&&p.g>0).sort((a,b)=>b.g-a.g).slice(0,15);
function seasonEnd(){
  const T={1:table(1),2:table(2),3:table(3)},me=myT(),pos=rank(me.lg,S.my),B=RV;
  S.teams.forEach(t=>{if(aktiv(t))t.lastPos=rank(t.lg,t.id);t.lastLg=t.lg;});
  const ergebnis=(sp,paar)=>{const a=sp[0]||sim(paar[1],paar[0]),b=sp[1]||sim(paar[0],paar[1]),g0=a.ag+b.hg,g1=a.hg+b.ag;
    return{sieger:g0>g1?paar[0]:g1>g0?paar[1]:(R()<RS.relegationLos?paar[0]:paar[1]),text:`Hinspiel ${tn(a.h)} – ${tn(a.a)} ${a.hg}:${a.ag}, Rückspiel ${tn(b.h)} – ${tn(b.a)} ${b.hg}:${b.ag}${g0===g1?', Entscheidung im Elfmeterschießen':''}`};};
  // Relegation 1./2. Liga und 2./3. Liga (Zweitmannschaften der 3. Liga dürfen nicht aufsteigen)
  const reihe=aufstiegsReihe3(),rel=[T[1][15].id,T[2][2].id],rel2=[T[2][15].id,reihe[2]],e1=ergebnis(S.relSp,rel),e2=ergebnis(S.relSp2,rel2);
  const rl=regionalligaAufsteiger(),ts=topScorers(1)[0];
  const sm={season:S.season,lg:me.lg,pos,target:S.target,champ:T[1][0].id,champ2:T[2][0].id,champ3:T[3][0].id,
    down:[T[1][16].id,T[1][17].id],up:[T[2][0].id,T[2][1].id],rel,relRes:e1.text,rw:e1.sieger,
    down2:[T[2][16].id,T[2][17].id],up3:[reihe[0],reihe[1]],rel2,rel2Res:e2.text,rw2:e2.sieger,
    down3:T[3].slice(-RS.abstieg3).map(r=>r.id),up4:rl.ids,rlText:rl.text,
    cup:S.cup.alive.length===1?S.cup.alive[0]:null,ts:ts?`${ts.n} (${tn(ts.team)}), ${ts.g} Tore`:'–',ok:pos<=S.target,fin:Object.values(S.fin).reduce((x,y)=>x+y,0)};
  S.trust=clamp(S.trust+(sm.ok?B.saisonErreicht:pos>S.target+B.saisonWeitAb?B.saisonWeit:B.saisonVerfehlt),0,100);
  news(`${tn(sm.champ)} ist Deutscher Meister ${S.season}/${(S.season+1)%100}!`,'good');
  news(`Relegation: ${sm.relRes}. ${tn(sm.rw)} spielt nächste Saison in der 1. Liga.`);
  news(`Relegation 2./3. Liga: ${sm.rel2Res}. ${tn(sm.rw2)} spielt nächste Saison in der 2. Liga.`);
  news(`Aus der Regionalliga steigen auf: ${sm.up4.map(tn).join(', ')}.`);
  S.hist.push({s:S.season,team:me.name,lg:me.lg,pos,ok:sm.ok});
  S.summary=sm;S.phase='end';
  if(sm.down3.includes(S.my)&&!S.fired){S.fired=1;news(`${me.name} steigt in die Regionalliga ab. Der Verein trennt sich von dir.`,'bad');mkJobs();}
  if(S.trust<B.entlassenSaisonUnter&&!S.fired){S.fired=1;mkJobs();}save();}
// Regionalliga (K32a): je Staffel wird ein Meister gelost, gewichtet nach Ansehen. West und Südwest steigen direkt auf,
// von Nord, Nordost und Bayern eine Staffel im Wechsel, die beiden anderen Meister spielen Aufstiegsspiele.
function poisson(l){const L=Math.exp(-l);let k=0,p=1;do{k++;p*=R();}while(p>L&&k<12);return k-1;}
function kleinesSpiel(h,a){const G=RS.regionalliga,st=id=>G.spielStaerke.basis+S.teams[id].rep*G.spielStaerke.jeAnsehen,q=st(h)/st(a);return[poisson(G.tore*G.heim*q*q),poisson(G.tore/G.heim/(q*q))];}
function regionalligaAufsteiger(){const G=RS.regionalliga,meister={},ids=[],txt=[];
  G.staffeln.forEach(r=>{const c=S.teams.filter(t=>t.lg===4&&t.region===r);if(!c.length)return;const w=c.map(t=>Math.pow(Math.max(1,t.rep-G.basis),2));let x=R()*w.reduce((a,b)=>a+b,0),k=0;while(k<c.length-1&&(x-=w[k])>0)k++;meister[r]=c[k].id;});
  const wechsel=G.wechsel[((S.season+1-G.wechselStart)%3+3)%3];
  G.direkt.concat([wechsel]).forEach(r=>{if(meister[r]!=null){ids.push(meister[r]);txt.push(`${tn(meister[r])} (Meister ${r})`);}});
  const spiel=G.wechsel.filter(r=>r!==wechsel&&meister[r]!=null).map(r=>meister[r]);
  if(spiel.length===2){const[a,b]=spiel,h1=kleinesSpiel(a,b),h2=kleinesSpiel(b,a),ga=h1[0]+h2[1],gb=h1[1]+h2[0];let w=ga>gb?a:gb>ga?b:null,zusatz='';
    if(w==null){const e=shootout();w=e[0]>e[1]?b:a;zusatz=`, Elfmeterschießen ${e[0]}:${e[1]}`;}
    ids.push(w);txt.push(`Aufstiegsspiele ${tn(a)} – ${tn(b)} ${h1[0]}:${h1[1]} und ${h2[0]}:${h2[1]}${zusatz} → ${tn(w)}`);}
  else spiel.forEach(id=>ids.push(id));
  while(ids.length<RS.abstieg3){const c=S.teams.filter(t=>t.lg===4&&!ids.includes(t.id)).sort((a,b)=>b.rep-a.rep)[0];if(!c)break;ids.push(c.id);}
  return{ids:ids.slice(0,RS.abstieg3),text:txt.join(' · ')};}
// Saisonwechsel am 1. Juli: Auf- und Abstieg, Alter, Verträge, Nachwuchs, neuer Spielplan
function newSeason(){const sm=S.summary,Z=RS,setze=(ids,lg)=>ids.forEach(id=>S.teams[id].lg=lg);
  setze(sm.down,2);setze(sm.up,1);if(sm.rw===sm.rel[1]){S.teams[sm.rel[1]].lg=1;S.teams[sm.rel[0]].lg=2;}
  setze(sm.down2,3);setze(sm.up3,2);if(sm.rw2===sm.rel2[1]){S.teams[sm.rel2[1]].lg=2;S.teams[sm.rel2[0]].lg=3;}
  setze(sm.down3,4);setze(sm.up4,3);
  S.teams.forEach(t=>{if(t.lastLg>3&&t.lg>3)return;const A=Z.ansehen;let d=t.lastLg<=3?clamp((t.expPos-t.lastPos)*A.faktor,-A.maxAenderung,A.maxAenderung):0;
    if(t.lg<t.lastLg)d+=A.aufstieg;if(t.lg>t.lastLg)d+=A.abstieg;t.rep=clamp(Math.round(t.rep+d),A.min,A.max);t.fans=Math.round(clamp(t.fans*(1+d*Z.fans.faktor),Z.fans.min,t.cap*Z.fans.maxJePlatz));});
  const K=Z.karriereende;
  S.pl.forEach(p=>{if(p.team<-1)return;p.age++;p.g=0;p.pg=0;p.apps=0;p.yc=0;p.sus=0;p.inj=0;p.form=Z.neuForm;
    if(p.team>=0&&!aktiv(S.teams[p.team])){p.team=-1;p.list=0;}
    if((p.age>=K.abAlter&&R()<(p.age-K.nullAlter)*K.jeJahr)||p.age>=K.spaetestens){if(p.team===S.my)news(`${p.n} beendet seine Karriere.`);p.team=-2;return;}
    if(p.team>=0){p.ct--;if(p.ct<=0){if(p.team===S.my){news(`Vertrag ausgelaufen: ${p.n} verlässt den Verein.`,'bad');p.team=-1;p.list=0;}else if(R()<Z.vertrag.verlaengern){p.ct=riA(Z.vertrag.jahre);p.sal=salaryFor(p.str);}else{p.team=-1;p.list=0;}}}
    if(p.team!==S.my)p.list=0;});
  S.pl=S.pl.filter(p=>p.team!==-2);reindex();
  sm.up4.forEach(id=>{if(!squad(id).length)kaderErzeugen(S.teams[id]);});
  const N=Z.nachwuchs;
  S.teams.forEach(t=>{if(!aktiv(t))return;const base=grundStaerke(t.rep),yl=t.id===S.my?t.youth:N.computerStufe;
    for(let k=0;k<N.anzahl;k++){const pos=pick(N.positionen);const p=mkPlayer({pos,age:N.alter,str:Math.round(base-N.abschlag+riA(N.streuung)+yl),team:t.id,ct:N.vertrag});p.pot=Math.round(base-N.talentAbschlag+riA(N.talentStreuung)+yl*N.talentJeStufe);p.sal=Math.round(p.sal*N.gehalt/1000)*1000;addP(p);
      if(t.id===S.my)news(`Aus der Jugend: ${p.n} (${p.pos}, ${N.alter}) rückt in den Profikader auf. Talent ${stars(p)}.`,'good');}
    if(t.id===S.my)return;
    const need=Z.kaderSoll;
    for(const pos in need){let have=squad(t.id).filter(p=>p.pos===pos).length;while(have<need[pos]){const fa=S.pl.filter(p=>p.team===-1&&p.pos===pos&&p.str<=base+Z.vereinslosBis).sort((a,b)=>b.str-a.str)[0];
      if(fa&&R()<Z.vereinslosChance){fa.team=t.id;fa.ct=riA(Z.vertrag.jahre);fa.sal=salaryFor(fa.str);}else addP(mkPlayer({pos,age:riA(Z.auffuellAlter),str:Math.round(base-Z.auffuellAbschlag+riA(Z.auffuellStreuung)),team:t.id}));have++;}}
    const sq=squad(t.id);if(sq.length>Z.kaderMax)sq.sort((a,b)=>a.str-b.str).slice(0,sq.length-Z.kaderMax).forEach(p=>{p.team=-1;p.list=0;});});
  const fa=S.pl.filter(p=>p.team===-1);if(fa.length>Z.vereinsloseMax){fa.sort((a,b)=>a.str-b.str).slice(0,fa.length-Z.vereinsloseMax).forEach(p=>p.team=-2);S.pl=S.pl.filter(p=>p.team!==-2);reindex();}
  S.am.forEach(a=>a.str=riA(RW.amateurStaerke));
  S.season++;S.plan=planFuer(S.season);S.tag=S.plan.start;S.gespielt=-1;S.relSp=[];S.relSp2=[];S.res={1:[],2:[],3:[]};
  const sp=spielplanFuer(S.season);S.fx=sp.fx;S.plan.zeit=sp.zeit;initCup();
  S.fin={};S.att=[0,0];S.offers=S.offers.filter(o=>PIX.get(o.pid)&&PIX.get(o.pid).team===S.my);S.phase='play';S.summary=null;TDAY=null;TLG=0;LAST=null;
  setTarget();if(S.spons){S.spons.yrs--;if(S.spons.yrs<=0)S.spons=null;}if(!S.spons)sponsOffers();
  S.lineup=bestXI(S.my,myT().form);
  news(`Neue Saison ${S.season}/${(S.season+1)%100} in der ${ligaName(myT().lg)}: Ziel des Vorstands – ${targetText(myT().lg,S.target)}. Trainingsauftakt am ${datumMittel(S.plan.trainingsauftakt)}.`,'good');save();}
function mkJobs(){const J=RV.jobs,r=myT().rep-J.ansehenAbschlag,weg=S.summary?S.summary.down3:[];const c=S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&!weg.includes(t.id)).sort((a,b)=>Math.abs(a.rep-r)-Math.abs(b.rep-r)).slice(0,J.kandidaten);S.jobs=shuffle(c).slice(0,J.angebote).map(t=>t.id);}
function takeJob(id){const old=myT().name;LAST=null;S.my=id;S.fired=0;S.trust=RV.neuerJob;S.offers=[];S.constr=null;S.loan=0;S.fin={};S.att=[0,0];setTarget();if(!S.spons||S.sponsOffers===null){S.spons=null;sponsOffers();}S.lineup=bestXI(id,myT().form);
  news(`Neuer Job: ${S.mgr} übernimmt ${myT().name} (vorher ${old}). Ziel: ${targetText(myT().lg,S.target)}.`,'good');save();closeOv();TAB='buero';render();if(S.phase==='end')showSummary();}
