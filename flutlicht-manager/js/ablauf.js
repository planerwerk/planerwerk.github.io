// Ablauf: eine Spielrunde mit Spielen, Finanzen, Training, Transfermarkt, Vorstand und Bau.
function playWeek(){
  const w=S.cal[S.wk],out={w,list:[],mine:null},t=myT();
  if(S.sponsOffers)pickSponsor(0);
  if(w.t==='L'){[1,2].forEach(lg=>S.fx[lg][w.md].forEach(([h,a])=>{const r=sim(h,a);r.lg=lg;out.list.push(r);}));}
  else{const al=shuffle(S.cup.alive.slice());const fin=w.r===5;for(let i=0;i<al.length;i+=2){let h=al[i],a=al[i+1];if(h<1000&&a>=1000)[h,a]=[a,h];const r=sim(h,a,{ko:1,neutral:fin});r.cup=1;out.list.push(r);}}
  S.pl.forEach(p=>{p.played=0;if(p.sus>0)p.sus--;if(p.inj>0)p.inj--;});
  out.list.forEach(r=>applyMatch(r,!!r.cup));
  out.mine=out.list.find(r=>r.h===S.my||r.a===S.my)||null;
  const m=out.mine;
  if(w.t==='L'){out.list.forEach(r=>S.res[r.lg].push([r.h,r.a,r.hg,r.ag,w.md]));
    if(m)news(`${w.md+1}. Spieltag: ${tn(m.h)} – ${tn(m.a)} ${m.hg}:${m.ag}`,(m.h===S.my?m.hg>m.ag:m.ag>m.hg)?'good':(m.hg===m.ag?'':'bad'));}
  else{S.cup.hist.push(out.list.map(r=>[r.h,r.a,r.hg,r.ag,r.pen]));S.cup.alive=out.list.map(winner);
    if(m){const won=winner(m)===S.my,opp=m.h===S.my?m.a:m.h;news(`DFB-Pokal, ${POKAL_RUNDEN[w.r]}: ${tn(m.h)} – ${tn(m.a)} ${m.hg}:${m.ag}${m.pen?` (i.E. ${m.pen[0]}:${m.pen[1]})`:''} – ${won?(w.r===5?'POKALSIEG!':'weiter!'):'ausgeschieden.'}`,won?'good':'bad');
      if(!won&&(opp>=1000||S.teams[opp].lg>t.lg))S.trust+=RV.pokalAus;if(won)S.trust+=RV.pokalWeiter;}
    if(w.r===5){const cw=S.cup.alive[0];news(`${tn(cw)} gewinnt den DFB-Pokal!`,'good');if(cw===S.my){money('Pokalprämien',RF.pokalSieg);S.trust+=RV.pokalSieg;}}}
  finances(w,out);training();market();board(w,out);build();
  if(S.wk===RK.vertragsWarnungWoche){const e=squad(S.my).filter(p=>p.ct<=1);if(e.length)news(`Achtung: ${e.length} Vertrag/Verträge enden zum Saisonende (${e.slice(0,6).map(p=>p.n).join(', ')}${e.length>6?' …':''}). Verlängern: im Kader auf den Spieler klicken.`,'bad');}
  S.wk++;save();return out;}
function attendance(t,opp,cup){const Z=RF.zuschauer,ref=Z.refBasis+t.rep*Z.refJeAnsehen,pf=clamp(Math.pow(ref/t.price,Z.preisExponent),Z.preisMin,Z.preisMax),ff=Z.formBasis+Z.formJePunkt*formPts(t.id),of=Z.gegnerBasis+(opp?opp.rep:Z.gegnerOhne)/100*Z.gegnerFaktor,lf=t.lg===1?1:Z.liga2;return Math.round(Math.min(t.cap,t.fans*pf*ff*of*lf*(cup?Z.pokal:1)*(Z.zufallBasis+R()*Z.zufallSpanne)));}
function finances(w,out){const t=myT(),m=out.mine;
  if(m&&m.h===S.my&&!(w.t==='P'&&w.r===5)){const att=attendance(t,m.a>=1000?null:S.teams[m.a],w.t==='P');m.att=att;S.att[0]+=att;S.att[1]++;money('Zuschauer',att*t.price);if(t.shop)money('Fanartikel',att*RF.fanartikel[t.shop]);if(t.logen)money('VIP-Logen',t.logen*RF.loge);}
  if(w.t==='L'){money('TV-Gelder',tvGeld(t));
    if(S.spons){money('Sponsor',S.spons.base);if(S.spons.win&&m&&winner(m)===S.my&&m.hg!==m.ag)money('Sponsor',S.spons.win);}
    money('Gehälter',-Math.round(squad(S.my).reduce((s,p)=>s+p.sal,0)/RF.spieltage));
    money('Stadion & Betrieb',-Math.round(t.cap*RF.betrieb.jePlatz+t.logen*RF.betrieb.jeLoge));money('Jugendarbeit',-RF.jugendKosten[t.youth]);
    if(S.loan>0)money('Kreditzinsen',-Math.round(S.loan*RF.kreditZins/RF.spieltage));}
  if(w.t==='P'&&m)money('Pokalprämien',RF.pokalPraemien[w.r]);
  S.teams.forEach(x=>{if(x.id!==S.my)x.cash+=x.rep*x.rep*(w.t==='L'?RF.fremdeEinnahmen.liga:RF.fremdeEinnahmen.pokal);});}
function training(){const T=RT;
  S.pl.forEach(p=>{if(p.team<0)return;const mine=p.team===S.my,l=mine?S.train:T.computerStufe;
    const cap=T.fitnessGrenze[l];p.fit=p.fit>cap?Math.max(cap,p.fit-T.abbau):Math.min(cap,p.fit+T.erholung);
    const a=p.age,wg=T.wachstum.find(x=>a<=x[0]);let g=wg?wg[1]:T.wachstumSonst;
    if(g>0){g*=T.entwicklung[l]*(p.played?T.einsatz.mit:T.einsatz.ohne);if(p.str>=p.pot)g=0;}
    p.str=clamp(p.str+g+(R()-0.5)*T.zufall,T.staerkeMin,T.staerkeMax);p.form+=(T.formMitte-p.form)*T.formAusgleich;
    if(mine&&l===T.verletzung.stufe&&p.inj<=0&&R()<T.verletzung.chance){p.inj=riA(T.verletzung.wochen);news(`Trainingsverletzung: ${p.n} fällt ${p.inj} Woche(n) aus.`,'bad');}});}
function market(){const M=RM;
  S.teams.forEach(t=>{if(t.id===S.my)return;const xi=new Set(bestXI(t.id,t.form));const sq=squad(t.id).filter(x=>!x.list&&!xi.has(x.id));if(!sq.length)return;
    if(sq.length>M.listeVoll.kaderAb&&R()<M.listeVoll.chance){const p=pick(sq);p.list=1;p.ask=value(p);}else if(R()<M.listeZufall.chance){const p=pick(sq);p.list=1;p.ask=Math.round(value(p)*M.listeZufall.aufschlag/M.runden)*M.runden;}});
  const n=R()<M.wechsel.eins?1:R()<M.wechsel.zwei?2:0;
  for(let k=0;k<n;k++){const L=S.pl.filter(p=>p.list&&p.team>=0&&p.team!==S.my);if(!L.length)break;const p=pick(L);
    const B=S.teams.filter(t=>t.id!==S.my&&t.id!==p.team&&t.cash>p.ask&&teamLevel(t.id)<p.str+M.kaeufer.niveauPlus&&squad(t.id).length<M.kaeufer.kaderMax);if(!B.length)continue;
    const b=pick(B),from=S.teams[p.team];b.cash-=p.ask;from.cash+=p.ask;news(`Wechsel perfekt: ${p.n} geht für ${fmt(p.ask)} von ${from.name} zu ${b.name}.`,'tr');
    p.team=b.id;p.list=0;p.ct=riA(M.neuerVertrag);p.sal=salaryFor(p.str);}
  const lvl=teamLevel(S.my),A=M.angebote,U=M.ueberraschung;
  squad(S.my).forEach(p=>{if(S.offers.some(o=>o.pid===p.id))return;
    if(p.list){const ratio=p.ask/value(p),st=A.preis.find(x=>ratio<=x[0]),pr=st?st[1]:A.preisSonst;
      if(R()<pr){const B=S.teams.filter(t=>t.id!==S.my&&t.cash>p.ask*A.kontoAnteil);if(B.length){const b=pick(B),amt=Math.round(p.ask*(A.betragBasis+R()*A.betragSpanne)/M.runden)*M.runden;S.offers.push({pid:p.id,tid:b.id,amt,exp:S.wk+A.laufzeitWochen});news(`Angebot: ${b.name} bietet ${fmt(amt)} für ${p.n}.`,'offer');}}}
    else if(p.str>=lvl+U.niveauPlus&&R()<U.chance){const B=S.teams.filter(t=>t.id!==S.my&&t.rep>=myT().rep&&t.cash>value(p));if(B.length){const b=pick(B),amt=Math.round(value(p)*(U.betragBasis+R()*U.betragSpanne)/M.runden)*M.runden;S.offers.push({pid:p.id,tid:b.id,amt,exp:S.wk+A.laufzeitWochen});news(`Überraschung: ${b.name} will ${p.n} und bietet ${fmt(amt)}.`,'offer');}}});
  S.offers=S.offers.filter(o=>o.exp>S.wk+1&&PIX.get(o.pid)&&PIX.get(o.pid).team===S.my);}
function board(w,out){const t=myT(),m=out.mine,B=RV;
  if(w.t==='L'&&m){const home=m.h===S.my,gf=home?m.hg:m.ag,ga=home?m.ag:m.hg,o=S.teams[home?m.a:m.h],str=o.rep>t.rep+B.staerkerAb,wk=o.rep<t.rep-B.staerkerAb;
    S.trust+=gf>ga?(str?B.sieg.staerker:B.sieg.sonst):gf===ga?(str?B.remis.staerker:wk?B.remis.schwaecher:B.remis.sonst):(str?B.niederlage.staerker:wk?B.niederlage.schwaecher:B.niederlage.sonst);
    if(w.md>=B.platzAbSpieltag){const pos=rank(t.lg,S.my);S.trust+=pos>S.target+B.platz.weitAb?B.platz.weit:pos>S.target?B.platz.drunter:B.platz.drueber;}}
  if(t.cash<0){S.trust+=B.kontoMinus;if(R()<B.kontoMinusMeldung)news('Der Vorstand ist alarmiert: Das Vereinskonto ist im Minus!','bad');}
  S.trust=clamp(S.trust,0,100);
  if(S.trust<B.entlassenUnter&&S.wk>B.schonfristWochen&&!S.fired){S.fired=1;mkJobs();}}
function build(){const c=S.constr;if(!c)return;c.w--;if(c.w<=0){const t=myT();if(c.k==='cap')t.cap+=RB.tribuene.plaetze;if(c.k==='logen')t.logen+=RB.logen.anzahl;if(c.k==='shop')t.shop++;news(`Bau abgeschlossen: ${c.label}.`,'good');S.constr=null;}}
