// Tagesablauf (K01): Spiele eines Tages, Werte pro Tag und pro Woche, Finanzen, Training, Transfermarkt, Vorstand, Bau.

// Alle Spiele eines Tages in allen Wettbewerben. Ergebnis: {tag, gruppen:[{titel,art,e,list}], list, mine}
// Zwei Schritte (K05): vorbereiten lost aus und rechnet alle Spiele, abschließen trägt sie ein (Tabellen, Finanzen, Vorstand).
// Beim Live-Spiel bleibt dein Spiel dazwischen offen und läuft Minute für Minute in der Ansicht (js/live.js).
function tagesSpiele(d){const v=tagesSpieleVorbereiten(d,false);return tagesSpieleAbschliessen(v.out);}
function tagesSpieleVorbereiten(d,live){return mitStrom(strom('spieltag',S.season,d),()=>{const out={tag:d,gruppen:[],list:[],mine:null},vorher=S.gespielt;let G=null,platz=null;S.gespielt=d;
  if(S.sponsOffers&&meinSpiel(d))sponsorWaehlen(0);
  const spiel=(h,a,o,meta,g)=>{const i=g.list.length;if(live&&(h===S.my||a===S.my)){G=spielAnlegen(h,a,Object.assign({},o,{auto:[h!==S.my,a!==S.my]}));platz={meta,g,i};g.list.push(null);return;}g.list.push(Object.assign(sim(h,a,o),meta));};
  for(const e of termineAm(d)){
    if(e.art==='liga'){const g={titel:`${ligaName(e.lg)} · ${e.md+1}. Spieltag`,art:'liga',e,list:[]};e.idx.forEach(i=>{const[h,a]=S.fx[e.lg][e.md][i];spiel(h,a,{},{lg:e.lg,min:S.plan.zeit[e.lg][e.md][i][1]},g);});out.gruppen.push(g);}
    else if(e.art==='pokal'){if(S.cup.hist.length!==e.r)continue;const al=shuffle(S.cup.alive.slice()),fin=e.r===5,g={titel:`DFB-Pokal · ${POKAL_RUNDEN[e.r]}`,art:'pokal',e,list:[]};for(let i=0;i<al.length;i+=2){let h=al[i],a=al[i+1];if(h<1000&&a>=1000)[h,a]=[a,h];spiel(h,a,{ko:1,neutral:fin,wichtig:e.r>=RTA.ki.wichtigAbRunde},{cup:1,min:e.min},g);}out.gruppen.push(g);}
    else if(e.art==='rel'||e.art==='rel2'){const sp=S[e.art==='rel'?'relSp':'relSp2'];if(!relBereit(e.art)||sp[e.leg])continue;const[h,a]=e.leg===0?relTeams(e.art).reverse():relTeams(e.art);const g={titel:`Relegation${e.art==='rel2'?' 2./3. Liga':''} · ${e.leg?'Rückspiel':'Hinspiel'}`,art:e.art,e,list:[]};spiel(h,a,{wichtig:true},{rel:1,min:e.min},g);out.gruppen.push(g);}
  }
  if(G)S.gespielt=vorher; // erst nach dem Abpfiff gilt der Tag als gespielt (Neuladen mitten im Spiel)
  return{out,G,platz};});}
// Das live gespielte Spiel an seinen Platz eintragen
function liveEintragen(v){const r=Object.assign(v.G.ergebnis(),v.platz.meta);v.platz.g.list[v.platz.i]=r;return r;}
function tagesSpieleAbschliessen(out){return mitStrom(strom('spieltagEnde',S.season,out.tag),()=>tagesSpieleAbschliessenLauf(out));}
function tagesSpieleAbschliessenLauf(out){const d=out.tag;S.gespielt=d;
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
  const ab=S.phase==='play'?spielAbstand(d):new Map(),status=new Map();
  S.teams.forEach(t=>{if(!aktiv(t))return;sommerTag(t,ab.get(t.id),d);const st=sommerStatus(t);status.set(t.id,st);
    if(S.phase==='play'&&d===auftaktTag(t)&&st!=='urlaub'){sommerAuftakt(t);status.set(t.id,'');if(t.id===S.my)news('Trainingsauftakt: Die Mannschaft ist zurück. Morgen ist Leistungstest.');}
    if(S.phase==='play'&&d===auftaktTag(t)+RSO.leistungstest.tag&&t.id===S.my)leistungstest();
    if(!status.get(t.id))trainingVerein(t,ab.get(t.id),d);});
  S.pl.forEach(p=>{if(p.inj>0)p.inj--;if(p.team<-1)return;const st=p.team>=0?status.get(p.team)||'':'',urlaub=st==='urlaub'?true:st==='laufplan'?'laufplan':false;
    const tr=!urlaub&&p.team>=0&&p.inj<=0&&S.phase==='play'?trainingTag(p,S.teams[p.team],ab.get(p.team),d):0;tagesWerte(p,urlaub,tr);});
  S.offers=S.offers.filter(o=>o.bis>=d&&PIX.get(o.pid)&&PIX.get(o.pid).team===S.my&&S.teams[o.tid]&&aktiv(S.teams[o.tid]));
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
  const n=S.fx[t.lg].length;money('Gehälter',-Math.round(squad(S.my).reduce((s,p)=>s+p.sal,0)/n));if(S.stab)money('Trainerstab',-Math.round(stabGehaelter(S.my)/n));
  money('Stadion & Betrieb',-Math.round(t.cap*RF.betrieb.jePlatz+t.logen*RF.betrieb.jeLoge));money('Jugendarbeit',-RF.jugendKosten[t.youth]);
  if(S.loan>0)money('Kreditzinsen',-Math.round(S.loan*RF.kreditZins/n));}
// Woche (K03 §4): Kondition, Form, Selbstvertrauen, Entwicklung für Spieler ohne Pflichtspiel seit 7 Tagen, Wochenbericht des Co-Trainers
function training(){const T=RT,d=S.tag,bericht=[];lernplaetzeVergeben();if(S.stab)stabWoche();const monat=Math.floor(S.tag/7)%RTA.ki.ordnungAlleWochen===0;S.teams.forEach(t=>{if(!aktiv(t))return;if(t.id!==S.my&&monat)kiOrdnung(t);vertrautheitWoche(t);});
  S.pl.forEach(p=>{if(p.team<-1)return;wochenWerte(p);wocheVerein(p);if(p.ent==null||d-p.ent>=7)entwicklungBuchen(p,d);p.played=0;
    const mine=p.team===S.my;
    if(mine){const n=Math.round(p.str);if(p.sw!=null&&n!==p.sw)bericht.push([p,p.sw,n]);p.sw=n;}
});
  if(bericht.length){const auf=bericht.filter(x=>x[2]>x[1]),ab=bericht.filter(x=>x[2]<x[1]),txt=l=>l.map(([p,a,b])=>`${p.n} (${a} → ${b})`).join(', ');
    news(`Wochenbericht des Co-Trainers: ${auf.length?'verbessert '+txt(auf):''}${auf.length&&ab.length?' · ':''}${ab.length?'nachgelassen '+txt(ab):''}.`,auf.length>=ab.length?'good':'');}}
function market(){const M=RM;
  S.teams.forEach(t=>{if(t.id===S.my||!aktiv(t))return;const alle=squad(t.id);if(alle.length<=M.verkaeufer.kaderMin)return;const xi=new Set(bestXI(t.id,t.form));const sq=alle.filter(x=>!x.list&&!xi.has(x.id));if(!sq.length)return;
    if(sq.length>M.listeVoll.kaderAb&&R()<M.listeVoll.chance){const p=pick(sq);p.list=1;p.ask=value(p);}else if(R()<M.listeZufall.chance){const p=pick(sq);p.list=1;p.ask=Math.round(value(p)*M.listeZufall.aufschlag/M.runden)*M.runden;}});
  const n=R()<M.wechsel.eins?1:R()<M.wechsel.zwei?2:0;
  for(let k=0;k<n;k++){const L=S.pl.filter(p=>p.list&&p.team>=0&&p.team!==S.my&&squad(p.team).length>M.verkaeufer.kaderMin);if(!L.length)break;const p=pick(L);
    const B=S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&t.id!==p.team&&t.cash>p.ask&&teamLevel(t.id)<p.str+M.kaeufer.niveauPlus&&squad(t.id).length<M.kaeufer.kaderMax);if(!B.length)continue;
    const b=pick(B),from=S.teams[p.team];b.cash-=p.ask;from.cash+=p.ask;news(`Wechsel perfekt: ${p.n} geht für ${fmt(p.ask)} von ${from.name} zu ${b.name}.`,'tr');
    p.team=b.id;p.list=0;p.ct=riA(M.neuerVertrag);p.sal=salaryFor(p.str);neuzugang(p,b.id);}
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
function vorstandPruefen(){const St=stufe();if(S.trust<St.entlassenUnter&&meineSpieltage()>St.schonfrist&&!S.fired&&S.phase!=='end'){S.fired=1;mkJobs();}}
