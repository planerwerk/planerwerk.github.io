// Aktionen des Spielers.
// Beim Öffnen der Aufstellung wird die Startelf mit den Ausfällen abgeglichen und gespeichert (Erinnerung „Aufstellung“ erledigt)
function tab(k){TAB=k;if(k==='aufst'&&S){S.lineup=myXI();save();}render();window.scrollTo(0,0);}
function setSlot(i,id){if(!darf('aufstellung','startelf'))return;id=+id;const xi=myXI(),j=xi.indexOf(id);if(j>=0)xi[j]=xi[i];xi[i]=id;S.lineup=xi;save();render();}
function setForm(f){if(!darf('formation','ordnung'))return;myT().form=f;S.lineup=bestXI(S.my,f);save();render();}
function setTac(v){if(!darf(v==='SD'||v==='SO'?'ausrichtung5':'ausrichtung3','ordnung'))return;myT().tac=v;save();render();}
// Trainerstab (K16): einstellen (sofort, Vertrag zwei Jahre), verlängern (zwei Jahre, 10 % mehr Gehalt), entlassen (Abfindung: halbes Restgehalt). Ein Co-Trainer ist Pflicht.
function stabEinstellen(id){if(!darf('stab','vertragOderStab'))return;const x=S.stab.find(y=>y.id===id),t=myT();if(!x||x.team>=0)return;const R0=RST.rollen[x.r];if(stabVon(S.my,x.r).length>=R0.plaetze){toast(`Für die Rolle ${R0.name} sind alle Plätze besetzt.`);return;}
  x.team=S.my;x.sal=stabGehalt(x.r,x.q,t.lg);x.ct=2;x.wiv=0;stabGeaendert();news(`${R0.name} ${x.n} kommt (${fmt(x.sal)} pro Jahr).`,'good');save();render();}
function stabVerlaengern(id){if(!darf('stab','vertragOderStab'))return;const x=S.stab.find(y=>y.id===id);if(!x||x.team!==S.my)return;x.ct+=2;x.sal=Math.round(x.sal*1.1/RST.gehalt.runden)*RST.gehalt.runden;news(`${RST.rollen[x.r].name} ${x.n} verlängert bis ${S.season+x.ct} (${fmt(x.sal)} pro Jahr).`);save();render();}
function stabEntlassen(id){if(!darf('stab'))return;const x=S.stab.find(y=>y.id===id);if(!x||x.team!==S.my)return;if(x.r==='co'&&stabVon(S.my,'co').length<=1){toast('Ein Co-Trainer ist Pflicht. Stell erst einen neuen ein.');return;}
  const ab=Math.round(x.sal*x.ct*RST.abfindung);money('Abfindungen',-ab);x.team=-1;stabGeaendert();auftraegeAufraeumen();news(`${RST.rollen[x.r].name} ${x.n} entlassen, Abfindung ${fmt(ab)}.`);save();render();}
// Sommerpause (K12a): Urlaubslänge (auch im laufenden Urlaub änderbar) und Trainingsauftakt früher oder später
function setUrlaub(w){if(!darf('sommer','sommerplan'))return;if(!RSO.urlaubWochen.includes(w))return;S.sommer=Object.assign({},S.sommer||{},{urlaub:w});const t=myT();
  if(t.urlaub>0){const vorbei=(t.urlaubGesamt||t.urlaub)-t.urlaub;t.urlaub=Math.max(1,w*7-vorbei);t.urlaubGesamt=w*7;}save();if(S.phase==='end')showSummary();else render();}
function setAuftakt(v){if(!darf('sommer','sommerplan'))return;if(!RSO.auftaktVersatz.includes(v))return;S.sommer=Object.assign({},S.sommer||{},{versatz:v});save();if(S.phase==='end')showSummary();else render();}
// Training (K07): Vorlage des Wochenplans, Umschulung auf eine neue Position (belegt einen Einzeltrainingsplatz)
function setVorlage(k){if(!darf('vorlage','vorlage'))return;myT().vorlage=k==='auto'||!RT.vorlagen[k]?'auto':k;save();render();}
function setUmschulung(id,pos){if(!darf('umschulung','lernziel'))return;const p=PIX.get(id);if(!p||p.team!==S.my)return;if(!pos){p.um=null;save();openP(id);return;}
  const grund=umschulungGrund(p,pos);if(grund){toast(grund);openP(id);return;}
  if(!p.ls&&!p.um&&squad(S.my).filter(x=>x.ls||x.um).length>=lernPlaetze(S.my)){const frei=squad(S.my).filter(x=>x.ls&&!x.ls.selbst&&!x.um).sort((a,b)=>a.ls.f-b.ls.f)[0];
    if(!frei){toast(`Alle ${lernPlaetze(S.my)} Einzeltrainingsplätze sind mit deinen eigenen Zielen belegt.`);openP(id);return;}frei.ls=null;toast(`${frei.n} gibt seinen Platz im Einzeltraining ab.`);}
  p.um=pos;save();openP(id);}
// Taktik (K06): Spielstil, Einstellung zum Spiel (nur für das nächste Spiel), Rollen je Grundordnung, Standardschützen
function setStil(k){if(!darf('stil','stil'))return;if(!STILE.includes(k))return;myT().stil=k;save();render();}
function setEinstellung(k){if(!darf('einstellung'))return;if(!RTA.einstellung[k]&&k!=='normal')return;myT().einstellung=k;save();render();}
function setRolle(i,pos){if(!darf('rollen','rolleOderSchuetze'))return;const t=myT(),f=t.form,sl=slots(f),g=rolleWaehlbar(sl[i]);if(!g||!RTA.rollen[g].includes(pos))return;
  const r=Object.assign({},(t.rollen&&t.rollen[f])||{});if(pos==='SM'){const akt=slotsVerein(t);akt.forEach((p,j)=>{if(p==='SM'&&j!==i)r[j]=slots(f)[j]==='SM'?'ZM':slots(f)[j];});}
  r[i]=pos;t.rollen=Object.assign({},t.rollen||{});t.rollen[f]=r;save();render();}
function setSchuetze(art,i,id){if(!darf('schuetzen','rolleOderSchuetze'))return;const t=myT();t.schuetzen=t.schuetzen||{};id=id?+id:null;
  if(art==='elfmeter'){const l=(t.schuetzen.elfmeter||[]).slice();l[i]=id;t.schuetzen.elfmeter=l.filter((x,j,a)=>x&&a.indexOf(x)===j);}else t.schuetzen[art]=id;save();render();}
function setEin(v){if(!darf('einstellung'))return;myT().ein=v;save();render();}
function autoXI(){if(!darf('aufstellung'))return;S.lineup=bestXI(S.my,myT().form);save();render();toast('Beste verfügbare Elf aufgestellt.');}
function setPrice(v){if(!darf('preise','sponsorOderPreis'))return;const P=RF.ticketPreis;myT().price=clamp(Math.round(+v||P.standard),P.min,P.max);save();render();}
function loan(k){if(!darf('kredit'))return;const t=myT(),max=kreditRahmen(t);if(k>0){const a=Math.min(k*1e6,max-S.loan);if(a<=0){toast('Kreditrahmen ausgeschöpft.');return;}S.loan+=a;t.cash+=a;}else{const a=Math.min(k===-99?S.loan:1e6,S.loan,Math.max(0,t.cash));if(a<=0){toast('Nichts zu tilgen oder kein Geld.');return;}S.loan-=a;t.cash-=a;}save();render();}
const bauLabel=(k,t)=>k==='cap'?`Tribünenausbau (+${RB.tribuene.plaetze.toLocaleString('de-DE')} Plätze)`:k==='logen'?`${RB.logen.anzahl} VIP-Logen`:'Fanshop Stufe '+(t.shop+1);
const bauKosten=(k,t)=>k==='cap'?RB.tribuene.kosten:k==='logen'?RB.logen.kosten:RB.fanshop.kosten[t.shop];
const bauWochen=k=>k==='cap'?RB.tribuene.wochen:k==='logen'?RB.logen.wochen:RB.fanshop.wochen;
const bauVoll=(k,t)=>k==='cap'?t.cap>=RB.tribuene.max:k==='logen'?t.logen>=RB.logen.max:t.shop>=RB.fanshop.max;
function startBuild(k){if(!darf('stadion'))return;const t=myT();if(S.constr||bauVoll(k,t))return;
  const cost=bauKosten(k,t),label=bauLabel(k,t);if(t.cash<cost){toast('Dafür reicht der Kontostand nicht.');return;}
  const bis=S.tag+bauWochen(k)*7;money('Stadionbau',-cost);S.constr={k,bis,label};news(`Baubeginn: ${label}, fertig am ${datumKurz(bis)}.`);save();render();}
function setListed(id,on){if(!darf('transfers','gespraechOderTransfer'))return;const p=PIX.get(id);if(on){const v=+document.getElementById('ask').value;p.list=1;p.ask=Math.max(RM.runden,Math.round(v*1e6/RM.runden)*RM.runden);news(`${p.n} steht für ${fmt(p.ask)} auf der Transferliste.`);}else{p.list=0;S.offers=S.offers.filter(o=>o.pid!==id);versprechenAngebot(id,null);}save();openP(id);render();}
function extend(id){if(!darf('vertraege','vertragOderStab'))return;const p=PIX.get(id),y=+document.getElementById('ext').value;if(verlaengertNicht(p)){toast(`${p.n} will nicht verlängern. Erst muss seine Stimmung besser werden.`);return;}p.ct=y;p.sal=Math.round(extDemand(p)*vertragsAufschlag(p)/1000)*1000;news(`Vertrag verlängert: ${p.n} bis ${S.season+y}, ${fmt(p.sal)} pro Jahr.`,'good');save();openP(id);render();}
const abfindung=p=>Math.round(p.sal*p.ct*RF.abfindung);
function release(id){if(!darf('vertraege'))return;const p=PIX.get(id),c=abfindung(p);money('Abfindungen',-c);kabineAbgang(p,S.my);p.team=-1;p.list=0;S.offers=S.offers.filter(o=>o.pid!==id);news(`${p.n} wurde freigestellt (Abfindung ${fmt(c)}).`);save();closeOv();render();}
function acceptOffer(i){if(!darf('transfers','gespraechOderTransfer'))return;const o=S.offers[i],p=o&&PIX.get(o.pid);if(!p||p.team!==S.my)return;
  if(o.tid>=AV0){const v=avVon(o.tid);if(!v){S.offers.splice(i,1);save();render();return;} // Verkauf ins Ausland (K32): Der Spieler zieht in den Pool um
    money('Transfers',o.amt);kabineAbgang(p,S.my);insAusland(p,v.id);S.offers=S.offers.filter(x=>x.pid!==o.pid);news(`Verkauft: ${p.n} wechselt für ${fmt(o.amt)} zu ${v.name} (${gruppenName(avGruppe(v))}).`,'good');save();render();return;}
  const b=S.teams[o.tid];if(!aktiv(b)){S.offers.splice(i,1);toast(`${b.name} spielt nicht mehr in den Profiligen, das Angebot ist hinfällig.`);save();render();return;}money('Transfers',o.amt);b.cash-=o.amt;kabineAbgang(p,S.my);p.team=b.id;p.list=0;p.ct=riA(RM.neuerVertrag);S.offers=S.offers.filter(x=>x.pid!==o.pid);news(`Verkauft: ${p.n} wechselt für ${fmt(o.amt)} zu ${b.name}.`,'good');save();render();}
function declineOffer(i){if(!darf('transfers'))return;const o=S.offers[i];if(o)versprechenAngebot(o.pid,o.amt);S.offers.splice(i,1);save();render();}
function offer(id){{const q=PIX.get(id);if(!darf('transfers','gespraechOderTransfer')||(q&&istAusland(q)&&!darf('ausland')))return;}const p=PIX.get(id),t=myT(),msg=document.getElementById('msg'),yrs=+document.getElementById('yrs').value,M=RM,I=M.interesse;
  if(squad(S.my).length>=M.kaderMax){msg.textContent=`Dein Kader ist voll (höchstens ${M.kaderMax} Spieler).`;return;}
  const aus=istAusland(p),from=aus?avVon(p.team):p.team>=0?S.teams[p.team]:null,lvl=teamLevel(S.my),IA=RW.ausland.interesse;
  const interest=(t.rep-(from?from.rep:t.rep-I.vereinslosAbstand))+(lvl-p.str)*I.niveauFaktor+I.basis+(t.lg===1?I.liga1:t.lg===2?I.liga2:I.liga3)+(p.age>=I.altAb?I.altPlus:0)+(p.seed-0.5)*I.zufall
    +(aus?(p.nat===RW.nation.heimat?IA.heimkehr:IA.fremd):0); // aus dem Ausland etwas schwerer zu holen, Deutsche kommen gern zurück (K32 §8)
  if(interest<0){msg.textContent=`${p.n} hat kein Interesse an einem Wechsel zu ${t.name}.`;return;}
  const sal=Math.round(salaryFor(p.str)*(M.gehalt.basis+p.seed*M.gehalt.zufall)/1000)*1000;let fee=0;
  if(from){fee=Math.round((+document.getElementById('fee').value||0)*1e6);const ask=askPrice(p);
    if(fee<ask*M.ernstAb){msg.textContent=`${from.name}: „Kein ernsthaftes Angebot.“ Gefordert sind etwa ${fmt(ask)}.`;return;}
    if(fee<ask){msg.textContent=`${from.name} will mindestens ${fmt(ask)}.`;return;}
    if(t.cash<fee){msg.textContent='Dafür reicht dein Kontostand nicht.';return;}
    money('Transfers',-fee);if(!aus)from.cash+=fee;}
  else{const hg=Math.round(sal*RF.handgeld/1000)*1000;if(t.cash<hg){msg.textContent='Nicht genug Geld für das Handgeld.';return;}money('Handgelder',-hg);}
  if(aus)ausDemAusland(p,S.my);else if(from)kabineAbgang(p,from.id);p.team=S.my;p.list=0;p.ct=yrs;p.sal=sal;S.offers=S.offers.filter(o=>o.pid!==id);neuzugang(p,S.my);versprechenKauf(p);
  news(`Neuzugang: ${p.n} kommt ${from?`für ${fmt(fee)} von ${from.name}${aus?` (${gruppenName(avGruppe(from))})`:''}`:'ablösefrei'} (Gehalt ${fmt(sal)}/Jahr, bis ${S.season+yrs}).`,'good');save();closeOv();render();toast(`${p.n} unterschreibt!`);}

// Lernziel eines eigenen Spielers (K03 §5.6). Leer = der Co-Trainer entscheidet.
// Lernziel setzen (K03 §5.6, K07): Sind alle Lernplätze belegt, gibt der Spieler mit dem geringsten Fortschritt unter den vom Co-Trainer gewählten seinen Platz ab.
function setLernziel(id,k){if(!darf('lernziel','lernziel'))return;const p=PIX.get(id);if(!p||p.team!==S.my)return;
  if(!k){p.ls=null;}else if(lernbar(p,k)&&(!p.ls||p.ls.k!==k)){
    if(!p.ls){const mit=squad(S.my).filter(x=>x.ls&&x.id!==id);if(mit.length>=lernPlaetze(S.my)){const frei=mit.filter(x=>!x.ls.selbst).sort((a,b)=>a.ls.f-b.ls.f)[0];
      if(!frei){toast(`Alle ${lernPlaetze(S.my)} Lernplätze sind mit deinen eigenen Zielen belegt.`);openP(id);return;}frei.ls=null;toast(`${frei.n} gibt seinen Lernplatz ab.`);}}
    p.ls={k,f:0,selbst:1};}
  save();openP(id);}
// Sportgericht (K09 §4.1): Antrag annehmen oder Einspruch einlegen
function sgVerfahren(id){return meineVerfahren().find(v=>v.id===id&&v.stand==='antrag');}
function sgAnnehmen(id){if(!darf('sportgericht','sportgericht'))return;const v=sgVerfahren(id);if(!v)return;sgAnnehmenLauf(v,S.tag);save();render();}
function sgEinspruch(id){if(!darf('sportgericht','sportgericht'))return;const v=sgVerfahren(id);if(!v||v.antrag<2)return;mitStrom(strom('sportgericht',S.season,S.tag,id),()=>sgEinspruchLauf(v,S.tag));
  news(`Einspruch für ${PIX.get(v.pid).n} eingelegt (Anwalt ${fmt(v.kosten)}). Urteil am ${datumKurz(v.urteilAm)}.`);save();render();}
// Medizin (K10 §5.4): fit spritzen am Spieltag, früher zurückholen aus dem Aufbautraining
function medSpritzen(id){if(!darf('medizin','medizin'))return;const p=PIX.get(id),i=p&&p.team===S.my?verletzungInfo(p):null;if(!i||!i.spritzbar||!heuteMeinSpiel())return;p.spritze=S.tag;p.spritzeAm=S.tag;news(`${p.n} wird für heute fit gespritzt.`);save();render();}
function medFrueher(id){if(!darf('medizin','medizin'))return;const p=PIX.get(id),i=p&&p.team===S.my?verletzungInfo(p):null;if(!i||i.phase!=='aufbau'||i.pflicht)return;p.inj=0;medizinRueckkehr(p,RMD.frueher.frische);news(`${p.n} ist früher zurück, aber noch nicht bei voller Frische.`);save();render();}
// Testspiele und Trainingslager (K11)
function tsAnfragen(){if(!darf('testspiele','sommerplan'))return;const d=+document.getElementById('ts_tag').value,g=+document.getElementById('ts_geg').value;const x=testspielAnfragen(g,d);if(!x){toast('Dieser Tag geht nicht.');return;}
  news(`Testspiel am ${datumKurz(d)} bei ${tn(g)} angefragt. Antwort bis ${datumKurz(x.antwortAm)}.`);save();render();}
function lagerBuchen(){if(!darf('lager','sommerplan'))return;const o=document.getElementById('la_ort').value,v=+document.getElementById('la_von').value,n=+document.getElementById('la_tage').value,f=lagerMoeglich(o,v,n);if(f){toast(f);return;}
  const k=lagerBuchenLauf(o,v,n);news(`Trainingslager gebucht: ${RLA.orte[o].name}, ${datumKurz(v)} bis ${datumKurz(v+n-1)}, Kosten ${fmt(k)}.`);save();render();}
// Kabine und Gespräche (K14, K15): Kaderrolle, Kapitän, Einzelgespräch, Mannschaftsansprache, Teamevent
function setKaderrolle(id,k){if(!darf('kaderrollen','kaderrolleOderVersprechen'))return;const p=PIX.get(id);if(!p||p.team!==S.my)return;
  if(k==='pokal'&&!imPokal(S.my)){toast('Ihr seid nicht mehr im Pokal.');return;}
  const alt=kaderRolle(p);if(k&&KR_STUFE[k])p.kr=k;else delete p.kr;
  if((alt==='pokal')!==(kaderRolle(p)==='pokal'))p.ea=erwartungEinsatz(p); // Rolle „spielt im Pokal“ misst nur Pokalspiele: Die Einsatzzeit beginnt bei der neuen Erwartung
  save();openP(id);render();}
// Tribüne (K14 §12): Der Spieler kommt nicht in den Spieltagskader, bis du es zurücknimmst. Etablierte nehmen das übel.
function setTribuene(id){if(!darf('aufstellung'))return;const p=PIX.get(id);if(!p||p.team!==S.my)return;if(p.trib)delete p.trib;else{p.trib=1;if(S.lineup)S.lineup=S.lineup.map(x=>x===id?null:x);}save();openP(id);render();}
function setKapitaen(v){if(!darf('kapitaen'))return;const t=myT(),id=+v,neu=PIX.get(id);if(!neu||neu.team!==S.my||id===t.kap)return;const alt=PIX.get(t.kap),K=RKA.kapitaen,f=S.kapFrei;
  const frei=f?(f.s===S.season&&S.tag<=f.bis):(S.season===RW.startSaison&&S.tag<=14);
  if(alt&&alt.team===S.my&&!frei){stimmungAendern(alt,K.absetzen);freundeVon(alt).forEach(q=>{if(q.team===S.my)stimmungAendern(q,K.absetzenFreunde);});news(`${alt.n} ist nicht mehr Kapitän und enttäuscht. Neuer Kapitän: ${neu.n}.`,'bad');}
  else news(`Neuer Kapitän: ${neu.n}.`);t.kap=id;t.kapAuto=0;kapitaenPruefen(t);save();render();}
function gespraechUI(id){const th=document.getElementById('gthema'),ha=document.getElementById('ghaltung');if(!th||!ha||!darf('gespraeche'))return;
  if(RGS.versprechen[th.value]&&!darf('versprechen'))return; // Zusagen ab der B-Lizenz (K36)
  const r=gespraechFuehren(id,th.value,ha.value);if(r.ok){aufgabe('gespraechOderTransfer');if(r.versprechen)aufgabe('kaderrolleOderVersprechen');}save();
  if(!r.ok){const m=document.getElementById('gmsg');if(m)m.textContent=r.text;return;}openP(id);render();const m=document.getElementById('gmsg');if(m)m.textContent=r.text;}
function mansAnsprache(art){if(!darf('ansprache'))return;const r=mannschaftsAnsprache(art);save();render();toast(r.text);}
function teameventUI(){if(!darf('versprechen','kaderrolleOderVersprechen'))return;teameventLauf();save();render();}
// Jugendarbeit: Stufe 1–5 (bis K08 gebaut ist)
function setJugend(l){if(!darf('jugend'))return;myT().youth=clamp(Math.round(+l)||1,1,5);save();render();}
// Jugend (K08): aufrücken, aus der Jugend verkaufen, Pate zuweisen
function jugendAufruecken(id){if(!darf('jugendkader'))return;const p=PIX.get(id),A=RJ.aufruecken;if(!istJugend(p)||!jugendKader().includes(p))return;if(p.age<A.ab){toast(`Aufrücken geht ab ${A.ab} Jahren.`);return;}
  if(squad(S.my).length>=RM.kaderMax){toast(`Dein Kader ist voll (höchstens ${RM.kaderMax} Spieler).`);return;}jugendHoch(p);news(`Aus der Jugend: ${p.n} (${p.pos}, ${p.age}) rückt in den Profikader auf. Talent ${stars(p)}.`,'good');save();closeOv();render();}
function jugendVerkaufen(id){if(!darf('jugendkader'))return;const p=PIX.get(id);if(!istJugend(p)||!jugendKader().includes(p)||p.age<RJ.verkauf.ab)return;if(!jugendVerkauf(p)){toast('Kein Profiverein zahlt für ihn.');return;}save();closeOv();render();}
function setPate(id,mid){if(!darf('pate'))return;const p=PIX.get(id),m=mid?PIX.get(+mid):null,P=RJ.pate;if(!p||p.team!==S.my||p.age>P.bisAlter)return;
  if(!m)delete p.pate;else{if(m.team!==S.my||m===p||!hatEig(m,'mentor')||patenkinder(m).filter(q=>q!==p).length>=P.jeMentor)return;p.pate=m.id;}save();openP(id);render();}
// Scouting (K18): Spieler beobachten lassen, Suchauftrag starten und beenden
function beobachten(pid){{const q=PIX.get(pid);if(!darf('beobachten')||(q&&istAusland(q)&&!darf('ausland')))return;}const sc=document.getElementById('scsel'),wo=document.getElementById('scwo');if(!sc)return;const f=beobachtenLauf(pid,+sc.value,+(wo?wo.value:2));save();if(f){toast(f);return;}openP(pid);render();}
function sucheStarten(){if(!darf('suchauftrag'))return;const g=id=>document.getElementById(id);const f=sucheLauf(+g('su_scout').value,{pos:g('su_pos').value,alterBis:g('su_alter').value,abloeseBis:g('su_abl').value,region:(g('su_reg')||{}).value});save();if(f)toast(f);render();}
function sucheBeenden(id){if(!darf('suchauftrag'))return;auftragEnde(id);save();render();}

