// Aktionen des Spielers.
// Beim Öffnen der Aufstellung wird die Startelf mit den Ausfällen abgeglichen und gespeichert (Erinnerung „Aufstellung“ erledigt)
function tab(k){TAB=k;if(k==='aufst'&&S){S.lineup=myXI();save();}render();window.scrollTo(0,0);}
function setSlot(i,id){id=+id;const xi=myXI(),j=xi.indexOf(id);if(j>=0)xi[j]=xi[i];xi[i]=id;S.lineup=xi;save();render();}
function setForm(f){myT().form=f;S.lineup=bestXI(S.my,f);save();render();}
function setTac(v){myT().tac=v;save();render();}
// Sommerpause (K12a): Urlaubslänge (auch im laufenden Urlaub änderbar) und Trainingsauftakt früher oder später
function setUrlaub(w){if(!RSO.urlaubWochen.includes(w))return;S.sommer=Object.assign({},S.sommer||{},{urlaub:w});const t=myT();
  if(t.urlaub>0){const vorbei=(t.urlaubGesamt||t.urlaub)-t.urlaub;t.urlaub=Math.max(1,w*7-vorbei);t.urlaubGesamt=w*7;}save();if(S.phase==='end')showSummary();else render();}
function setAuftakt(v){if(!RSO.auftaktVersatz.includes(v))return;S.sommer=Object.assign({},S.sommer||{},{versatz:v});save();if(S.phase==='end')showSummary();else render();}
// Training (K07): Vorlage des Wochenplans, Umschulung auf eine neue Position (belegt einen Einzeltrainingsplatz)
function setVorlage(k){myT().vorlage=k==='auto'||!RT.vorlagen[k]?'auto':k;save();render();}
function setUmschulung(id,pos){const p=PIX.get(id);if(!p||p.team!==S.my)return;if(!pos){p.um=null;save();openP(id);return;}
  if(!p.ls&&!p.um&&squad(S.my).filter(x=>x.ls||x.um).length>=lernPlaetze(S.my)){const frei=squad(S.my).filter(x=>x.ls&&!x.ls.selbst&&!x.um).sort((a,b)=>a.ls.f-b.ls.f)[0];
    if(!frei){toast(`Alle ${lernPlaetze(S.my)} Einzeltrainingsplätze sind mit deinen eigenen Zielen belegt.`);openP(id);return;}frei.ls=null;toast(`${frei.n} gibt seinen Platz im Einzeltraining ab.`);}
  p.um=pos;save();openP(id);}
// Taktik (K06): Spielstil, Einstellung zum Spiel (nur für das nächste Spiel), Rollen je Grundordnung, Standardschützen
function setStil(k){if(!STILE.includes(k))return;myT().stil=k;save();render();}
function setEinstellung(k){if(!RTA.einstellung[k]&&k!=='normal')return;myT().einstellung=k;save();render();}
function setRolle(i,pos){const t=myT(),f=t.form,sl=slots(f),g=rolleWaehlbar(sl[i]);if(!g||!RTA.rollen[g].includes(pos))return;
  const r=Object.assign({},(t.rollen&&t.rollen[f])||{});if(pos==='SM'){const akt=slotsVerein(t);akt.forEach((p,j)=>{if(p==='SM'&&j!==i)r[j]=slots(f)[j]==='SM'?'ZM':slots(f)[j];});}
  r[i]=pos;t.rollen=Object.assign({},t.rollen||{});t.rollen[f]=r;save();render();}
function setSchuetze(art,i,id){const t=myT();t.schuetzen=t.schuetzen||{};id=id?+id:null;
  if(art==='elfmeter'){const l=(t.schuetzen.elfmeter||[]).slice();l[i]=id;t.schuetzen.elfmeter=l.filter((x,j,a)=>x&&a.indexOf(x)===j);}else t.schuetzen[art]=id;save();render();}
function setEin(v){myT().ein=v;save();render();}
function autoXI(){S.lineup=bestXI(S.my,myT().form);save();render();toast('Beste verfügbare Elf aufgestellt.');}
function setPrice(v){const P=RF.ticketPreis;myT().price=clamp(Math.round(+v||P.standard),P.min,P.max);save();render();}
function loan(k){const t=myT(),max=kreditRahmen(t);if(k>0){const a=Math.min(k*1e6,max-S.loan);if(a<=0){toast('Kreditrahmen ausgeschöpft.');return;}S.loan+=a;t.cash+=a;}else{const a=Math.min(k===-99?S.loan:1e6,S.loan,Math.max(0,t.cash));if(a<=0){toast('Nichts zu tilgen oder kein Geld.');return;}S.loan-=a;t.cash-=a;}save();render();}
const bauLabel=(k,t)=>k==='cap'?`Tribünenausbau (+${RB.tribuene.plaetze.toLocaleString('de-DE')} Plätze)`:k==='logen'?`${RB.logen.anzahl} VIP-Logen`:'Fanshop Stufe '+(t.shop+1);
const bauKosten=(k,t)=>k==='cap'?RB.tribuene.kosten:k==='logen'?RB.logen.kosten:RB.fanshop.kosten[t.shop];
const bauWochen=k=>k==='cap'?RB.tribuene.wochen:k==='logen'?RB.logen.wochen:RB.fanshop.wochen;
const bauVoll=(k,t)=>k==='cap'?t.cap>=RB.tribuene.max:k==='logen'?t.logen>=RB.logen.max:t.shop>=RB.fanshop.max;
function startBuild(k){const t=myT();if(S.constr||bauVoll(k,t))return;
  const cost=bauKosten(k,t),label=bauLabel(k,t);if(t.cash<cost){toast('Dafür reicht der Kontostand nicht.');return;}
  const bis=S.tag+bauWochen(k)*7;money('Stadionbau',-cost);S.constr={k,bis,label};news(`Baubeginn: ${label}, fertig am ${datumKurz(bis)}.`);save();render();}
function setListed(id,on){const p=PIX.get(id);if(on){const v=+document.getElementById('ask').value;p.list=1;p.ask=Math.max(RM.runden,Math.round(v*1e6/RM.runden)*RM.runden);news(`${p.n} steht für ${fmt(p.ask)} auf der Transferliste.`);}else{p.list=0;S.offers=S.offers.filter(o=>o.pid!==id);}save();openP(id);render();}
function extend(id){const p=PIX.get(id),y=+document.getElementById('ext').value;p.ct=y;p.sal=extDemand(p);news(`Vertrag verlängert: ${p.n} bis ${S.season+y}, ${fmt(p.sal)} pro Jahr.`,'good');save();openP(id);render();}
const abfindung=p=>Math.round(p.sal*p.ct*RF.abfindung);
function release(id){const p=PIX.get(id),c=abfindung(p);money('Abfindungen',-c);p.team=-1;p.list=0;S.offers=S.offers.filter(o=>o.pid!==id);news(`${p.n} wurde freigestellt (Abfindung ${fmt(c)}).`);save();closeOv();render();}
function acceptOffer(i){const o=S.offers[i],p=PIX.get(o.pid),b=S.teams[o.tid];if(!p||p.team!==S.my)return;money('Transfers',o.amt);b.cash-=o.amt;p.team=b.id;p.list=0;p.ct=riA(RM.neuerVertrag);S.offers=S.offers.filter(x=>x.pid!==o.pid);news(`Verkauft: ${p.n} wechselt für ${fmt(o.amt)} zu ${b.name}.`,'good');save();render();}
function declineOffer(i){S.offers.splice(i,1);save();render();}
function offer(id){const p=PIX.get(id),t=myT(),msg=document.getElementById('msg'),yrs=+document.getElementById('yrs').value,M=RM,I=M.interesse;
  if(squad(S.my).length>=M.kaderMax){msg.textContent=`Dein Kader ist voll (höchstens ${M.kaderMax} Spieler).`;return;}
  const from=p.team>=0?S.teams[p.team]:null,lvl=teamLevel(S.my);
  const interest=(t.rep-(from?from.rep:t.rep-I.vereinslosAbstand))+(lvl-p.str)*I.niveauFaktor+I.basis+(t.lg===1?I.liga1:t.lg===2?I.liga2:I.liga3)+(p.age>=I.altAb?I.altPlus:0)+(p.seed-0.5)*I.zufall;
  if(interest<0){msg.textContent=`${p.n} hat kein Interesse an einem Wechsel zu ${t.name}.`;return;}
  const sal=Math.round(salaryFor(p.str)*(M.gehalt.basis+p.seed*M.gehalt.zufall)/1000)*1000;let fee=0;
  if(from){fee=Math.round((+document.getElementById('fee').value||0)*1e6);const ask=askPrice(p);
    if(fee<ask*M.ernstAb){msg.textContent=`${from.name}: „Kein ernsthaftes Angebot.“ Gefordert sind etwa ${fmt(ask)}.`;return;}
    if(fee<ask){msg.textContent=`${from.name} will mindestens ${fmt(ask)}.`;return;}
    if(t.cash<fee){msg.textContent='Dafür reicht dein Kontostand nicht.';return;}
    money('Transfers',-fee);from.cash+=fee;}
  else{const hg=Math.round(sal*RF.handgeld/1000)*1000;if(t.cash<hg){msg.textContent='Nicht genug Geld für das Handgeld.';return;}money('Handgelder',-hg);}
  p.team=S.my;p.list=0;p.ct=yrs;p.sal=sal;S.offers=S.offers.filter(o=>o.pid!==id);neuzugang(p,S.my);
  news(`Neuzugang: ${p.n} kommt ${from?`für ${fmt(fee)} von ${from.name}`:'ablösefrei'} (Gehalt ${fmt(sal)}/Jahr, bis ${S.season+yrs}).`,'good');save();closeOv();render();toast(`${p.n} unterschreibt!`);}

// Lernziel eines eigenen Spielers (K03 §5.6). Leer = der Co-Trainer entscheidet.
// Lernziel setzen (K03 §5.6, K07): Sind alle Lernplätze belegt, gibt der Spieler mit dem geringsten Fortschritt unter den vom Co-Trainer gewählten seinen Platz ab.
function setLernziel(id,k){const p=PIX.get(id);if(!p||p.team!==S.my)return;
  if(!k){p.ls=null;}else if(lernbar(p,k)&&(!p.ls||p.ls.k!==k)){
    if(!p.ls){const mit=squad(S.my).filter(x=>x.ls&&x.id!==id);if(mit.length>=lernPlaetze(S.my)){const frei=mit.filter(x=>!x.ls.selbst).sort((a,b)=>a.ls.f-b.ls.f)[0];
      if(!frei){toast(`Alle ${lernPlaetze(S.my)} Lernplätze sind mit deinen eigenen Zielen belegt.`);openP(id);return;}frei.ls=null;toast(`${frei.n} gibt seinen Lernplatz ab.`);}}
    p.ls={k,f:0,selbst:1};}
  save();openP(id);}
