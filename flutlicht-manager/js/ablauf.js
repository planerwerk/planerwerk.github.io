// Tagesablauf (K01): Spiele eines Tages, Werte pro Tag und pro Woche, Finanzen, Training, Transfermarkt, Vorstand, Bau.

// Alle Spiele eines Tages in allen Wettbewerben. Ergebnis: {tag, gruppen:[{titel,art,e,list}], list, mine}
function tagesSpiele(d){return mitStrom(strom('spieltag',S.season,d),()=>tagesSpieleLauf(d));}
function tagesSpieleLauf(d){const out={tag:d,gruppen:[],list:[],mine:null};S.gespielt=d;
  if(S.sponsOffers&&meinSpiel(d))sponsorWaehlen(0);
  for(const e of termineAm(d)){
    if(e.art==='liga'){const list=e.idx.map(i=>{const[h,a]=S.fx[e.lg][e.md][i];const r=sim(h,a);r.lg=e.lg;r.min=S.plan.zeit[e.lg][e.md][i][1];return r;});out.gruppen.push({titel:`${ligaName(e.lg)} · ${e.md+1}. Spieltag`,art:'liga',e,list});}
    else if(e.art==='pokal'){if(S.cup.hist.length!==e.r)continue;const al=shuffle(S.cup.alive.slice()),fin=e.r===5,list=[];for(let i=0;i<al.length;i+=2){let h=al[i],a=al[i+1];if(h<1000&&a>=1000)[h,a]=[a,h];const r=sim(h,a,{ko:1,neutral:fin});r.cup=1;r.min=e.min;list.push(r);}out.gruppen.push({titel:`DFB-Pokal · ${POKAL_RUNDEN[e.r]}`,art:'pokal',e,list});}
    else if(e.art==='rel'||e.art==='rel2'){const sp=S[e.art==='rel'?'relSp':'relSp2'];if(!relBereit(e.art)||sp[e.leg])continue;const[h,a]=e.leg===0?relTeams(e.art).reverse():relTeams(e.art);const r=sim(h,a);r.rel=1;r.min=e.min;out.gruppen.push({titel:`Relegation${e.art==='rel2'?' 2./3. Liga':''} · ${e.leg?'Rückspiel':'Hinspiel'}`,art:e.art,e,list:[r]});}
  }
  out.list=out.gruppen.flatMap(g=>g.list);if(!out.list.length)return out;
  // Sperren zählen die Spiele der eigenen Mannschaft
  const spielten=new Set();out.list.forEach(r=>{spielten.add(r.h);spielten.add(r.a);});
  S.pl.forEach(p=>{if(p.sus>0&&spielten.has(p.team))p.sus--;});
  out.list.forEach(r=>applyMatch(r,!!r.cup));
  S.pl.forEach(p=>{if(spielten.has(p.team))entwicklungBuchen(p,d);});
  out.mine=out.list.find(r=>r.h===S.my||r.a===S.my)||null;
  const t=myT(),m=out.mine;
  for(const g of out.gruppen){const e=g.e,mg=g.list.includes(m)?m:null;
    if(g.art==='liga'){g.list.forEach(r=>S.res[e.lg].push([r.h,r.a,r.hg,r.ag,e.md]));
      if(mg){news(`${e.md+1}. Spieltag: ${tn(mg.h)} – ${tn(mg.a)} ${mg.hg}:${mg.ag}`,(mg.h===S.my?mg.hg>mg.ag:mg.ag>mg.hg)?'good':(mg.hg===mg.ag?'':'bad'));finanzenLiga(mg);vorstandLiga(e,mg);
        if(e.md+1===RK.vertragsWarnungNachSpieltag){const x=squad(S.my).filter(p=>p.ct<=1);if(x.length)news(`Achtung: ${x.length} Vertrag/Verträge enden zum Saisonende (${x.slice(0,6).map(p=>p.n).join(', ')}${x.length>6?' …':''}). Verlängern: im Kader auf den Spieler klicken.`,'bad');}}
      g.list.forEach(r=>[r.h,r.a].forEach(id=>{if(id!==S.my){const x=S.teams[id];x.cash+=x.rep*x.rep*RF.fremdeEinnahmen.liga;}}));}
    else if(g.art==='pokal'){S.cup.hist.push(g.list.map(r=>[r.h,r.a,r.hg,r.ag,r.pen]));S.cup.alive=g.list.map(winner);
      if(mg){const won=winner(mg)===S.my,opp=mg.h===S.my?mg.a:mg.h;news(`DFB-Pokal, ${POKAL_RUNDEN[e.r]}: ${tn(mg.h)} – ${tn(mg.a)} ${mg.hg}:${mg.ag}${mg.pen?` (i.E. ${mg.pen[0]}:${mg.pen[1]})`:''} – ${won?(e.r===5?'POKALSIEG!':'weiter!'):'ausgeschieden.'}`,won?'good':'bad');
        if(!won&&(opp>=1000||S.teams[opp].lg>t.lg))S.trust+=RV.pokalAus;if(won)S.trust+=RV.pokalWeiter;
        if(mg.h===S.my&&e.r!==5)heimspielEinnahmen(mg,true);money('Pokalprämien',RF.pokalPraemien[e.r]);}
      if(e.r===5){const cw=S.cup.alive[0];news(`${tn(cw)} gewinnt den DFB-Pokal!`,'good');if(cw===S.my){money('Pokalprämien',RF.pokalSieg);S.trust+=RV.pokalSieg;}}
      S.teams.forEach(x=>{if(x.id!==S.my&&aktiv(x))x.cash+=x.rep*x.rep*RF.fremdeEinnahmen.pokal;});}
    else if(g.art==='rel'||g.art==='rel2'){const r=g.list[0];S[g.art==='rel'?'relSp':'relSp2'][e.leg]={h:r.h,a:r.a,hg:r.hg,ag:r.ag};
      if(mg)news(`${spielName(e)}: ${tn(r.h)} – ${tn(r.a)} ${r.hg}:${r.ag}`,(r.h===S.my?r.hg>r.ag:r.ag>r.hg)?'good':(r.hg===r.ag?'':'bad'));}}
  S.trust=clamp(S.trust,0,100);vorstandPruefen();
  return out;}

// Werte pro Tag: Ausfalltage zählen herunter, Frische erholt sich, Fristen laufen ab, Bau wird fertig.
function taeglich(d){return mitStrom(strom('tag',S.season,d),()=>taeglichLauf(d));}
function taeglichLauf(d){const T=RT;
  const urlaub=imUrlaub(),heute=spielendeAm(d),gestern=spielendeAm(d-1);
  S.pl.forEach(p=>{if(p.inj>0)p.inj--;if(p.team<-1)return;tagesWerte(p,urlaub,p.team>=0&&(heute.has(p.team)||gestern.has(p.team)));});
  S.offers=S.offers.filter(o=>o.bis>=d&&PIX.get(o.pid)&&PIX.get(o.pid).team===S.my);
  const c=S.constr;if(c&&d>=c.bis){const t=myT();if(c.k==='cap')t.cap+=RB.tribuene.plaetze;if(c.k==='logen')t.logen+=RB.logen.anzahl;if(c.k==='shop')t.shop++;news(`Bau abgeschlossen: ${c.label}.`,'good');S.constr=null;}}
// Werte pro Woche (montags): Training und Entwicklung, Transfermarkt, Vorstand bei Minus auf dem Konto.
function woechentlich(d){return mitStrom(strom('woche',S.season,d),()=>woechentlichLauf(d));}
function woechentlichLauf(d){if(!imUrlaub())mitStrom(strom('training',S.season,d),training);mitStrom(strom('markt',S.season,d),market);
  if(myT().cash<0){S.trust+=RV.kontoMinus;if(R()<RV.kontoMinusMeldung)news('Der Vorstand ist alarmiert: Das Vereinskonto ist im Minus!','bad');}
  S.trust=clamp(S.trust,0,100);vorstandPruefen();}

function attendance(t,opp,cup){const Z=RF.zuschauer,ref=Z.refBasis+t.rep*Z.refJeAnsehen,pf=clamp(Math.pow(ref/t.price,Z.preisExponent),Z.preisMin,Z.preisMax),ff=Z.formBasis+Z.formJePunkt*formPts(t.id),of=Z.gegnerBasis+(opp?opp.rep:Z.gegnerOhne)/100*Z.gegnerFaktor,lf=t.lg===1?1:t.lg===2?Z.liga2:Z.liga3;return Math.round(Math.min(t.cap,t.fans*pf*ff*of*lf*(cup?Z.pokal:1)*(Z.zufallBasis+R()*Z.zufallSpanne)));}
function heimspielEinnahmen(m,cup){const t=myT(),att=attendance(t,m.a>=1000?null:S.teams[m.a],cup);m.att=att;S.att[0]+=att;S.att[1]++;money('Zuschauer',att*t.price);if(t.shop)money('Fanartikel',att*RF.fanartikel[t.shop]);if(t.logen)money('VIP-Logen',t.logen*RF.loge);}
// Buchungen je Ligaspieltag des eigenen Vereins
function finanzenLiga(m){const t=myT();if(m.h===S.my)heimspielEinnahmen(m,false);
  money('TV-Gelder',tvGeld(t));
  if(S.spons){money('Sponsor',S.spons.base);if(S.spons.win&&winner(m)===S.my&&m.hg!==m.ag)money('Sponsor',S.spons.win);}
  const n=S.fx[t.lg].length;money('Gehälter',-Math.round(squad(S.my).reduce((s,p)=>s+p.sal,0)/n));
  money('Stadion & Betrieb',-Math.round(t.cap*RF.betrieb.jePlatz+t.logen*RF.betrieb.jeLoge));money('Jugendarbeit',-RF.jugendKosten[t.youth]);
  if(S.loan>0)money('Kreditzinsen',-Math.round(S.loan*RF.kreditZins/n));}
// Woche (K03 §4): Kondition, Form, Selbstvertrauen, Entwicklung für Spieler ohne Pflichtspiel seit 7 Tagen, Wochenbericht des Co-Trainers
function training(){const T=RT,d=S.tag,bericht=[];
  S.pl.forEach(p=>{if(p.team<-1)return;wochenWerte(p);if(p.ent==null||d-p.ent>=7)entwicklungBuchen(p,d);p.played=0;
    const mine=p.team===S.my;
    if(mine){const n=Math.round(p.str);if(p.sw!=null&&n!==p.sw)bericht.push([p,p.sw,n]);p.sw=n;}
    if(mine&&S.train===T.verletzung.stufe&&p.inj<=0&&R()<T.verletzung.chance){const w=riA(T.verletzung.wochen);p.inj=w*7+1;news(`Trainingsverletzung: ${p.n} fällt ${w} Woche(n) aus.`,'bad');}});
  if(bericht.length){const auf=bericht.filter(x=>x[2]>x[1]),ab=bericht.filter(x=>x[2]<x[1]),txt=l=>l.map(([p,a,b])=>`${p.n} (${a} → ${b})`).join(', ');
    news(`Wochenbericht des Co-Trainers: ${auf.length?'verbessert '+txt(auf):''}${auf.length&&ab.length?' · ':''}${ab.length?'nachgelassen '+txt(ab):''}.`,auf.length>=ab.length?'good':'');}}
function market(){const M=RM;
  S.teams.forEach(t=>{if(t.id===S.my||!aktiv(t))return;const xi=new Set(bestXI(t.id,t.form));const sq=squad(t.id).filter(x=>!x.list&&!xi.has(x.id));if(!sq.length)return;
    if(sq.length>M.listeVoll.kaderAb&&R()<M.listeVoll.chance){const p=pick(sq);p.list=1;p.ask=value(p);}else if(R()<M.listeZufall.chance){const p=pick(sq);p.list=1;p.ask=Math.round(value(p)*M.listeZufall.aufschlag/M.runden)*M.runden;}});
  const n=R()<M.wechsel.eins?1:R()<M.wechsel.zwei?2:0;
  for(let k=0;k<n;k++){const L=S.pl.filter(p=>p.list&&p.team>=0&&p.team!==S.my);if(!L.length)break;const p=pick(L);
    const B=S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&t.id!==p.team&&t.cash>p.ask&&teamLevel(t.id)<p.str+M.kaeufer.niveauPlus&&squad(t.id).length<M.kaeufer.kaderMax);if(!B.length)continue;
    const b=pick(B),from=S.teams[p.team];b.cash-=p.ask;from.cash+=p.ask;news(`Wechsel perfekt: ${p.n} geht für ${fmt(p.ask)} von ${from.name} zu ${b.name}.`,'tr');
    p.team=b.id;p.list=0;p.ct=riA(M.neuerVertrag);p.sal=salaryFor(p.str);}
  const lvl=teamLevel(S.my),A=M.angebote,U=M.ueberraschung,bis=S.tag+RK.angebotTage;
  squad(S.my).forEach(p=>{if(S.offers.some(o=>o.pid===p.id))return;
    if(p.list){const ratio=p.ask/value(p),st=A.preis.find(x=>ratio<=x[0]),pr=st?st[1]:A.preisSonst;
      if(R()<pr){const B=S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&t.cash>p.ask*A.kontoAnteil);if(B.length){const b=pick(B),amt=Math.round(p.ask*(A.betragBasis+R()*A.betragSpanne)/M.runden)*M.runden;S.offers.push({pid:p.id,tid:b.id,amt,bis});news(`Angebot: ${b.name} bietet ${fmt(amt)} für ${p.n} (gilt bis ${datumKurz(bis)}).`,'offer');}}}
    else if(p.str>=lvl+U.niveauPlus&&R()<U.chance){const B=S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&t.rep>=myT().rep&&t.cash>value(p));if(B.length){const b=pick(B),amt=Math.round(value(p)*(U.betragBasis+R()*U.betragSpanne)/M.runden)*M.runden;S.offers.push({pid:p.id,tid:b.id,amt,bis});news(`Überraschung: ${b.name} will ${p.n} und bietet ${fmt(amt)} (gilt bis ${datumKurz(bis)}).`,'offer');}}});
  S.offers=S.offers.filter(o=>PIX.get(o.pid)&&PIX.get(o.pid).team===S.my);}
// Vorstand: Ergebnis im Ligaspiel und Tabellenplatz
function vorstandLiga(e,m){const t=myT(),B=RV,home=m.h===S.my,gf=home?m.hg:m.ag,ga=home?m.ag:m.hg,o=S.teams[home?m.a:m.h],str=o.rep>t.rep+B.staerkerAb,wk=o.rep<t.rep-B.staerkerAb;
  S.trust+=gf>ga?(str?B.sieg.staerker:B.sieg.sonst):gf===ga?(str?B.remis.staerker:wk?B.remis.schwaecher:B.remis.sonst):(str?B.niederlage.staerker:wk?B.niederlage.schwaecher:B.niederlage.sonst);
  if(e.md>=B.platzAbSpieltag){const pos=rank(t.lg,S.my);S.trust+=pos>S.target+B.platz.weitAb?B.platz.weit:pos>S.target?B.platz.drunter:B.platz.drueber;}}
function vorstandPruefen(){if(S.trust<RV.entlassenUnter&&meineSpieltage()>RV.schonfristSpieltage&&!S.fired&&S.phase!=='end'){S.fired=1;mkJobs();}}
