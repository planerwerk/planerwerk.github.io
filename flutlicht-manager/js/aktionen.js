// Aktionen des Spielers.
// Beim Öffnen der Aufstellung wird die Startelf mit den Ausfällen abgeglichen und gespeichert (Erinnerung „Aufstellung“ erledigt)
function tab(k){TAB=k;if(k==='aufst'&&S){S.lineup=myXI();save();}render();window.scrollTo(0,0);}
function setSlot(i,id){if(!darf('aufstellung','startelf'))return;id=+id;const xi=myXI(),j=xi.indexOf(id);if(j>=0)xi[j]=xi[i];xi[i]=id;S.lineup=xi;save();render();}
function setForm(f){if(!darf('formation','ordnung'))return;myT().form=f;S.lineup=besteElfDu();save();render();} // ohne Tribüne (Prüfung FI4)
function setTac(v){if(!darf(v==='SD'||v==='SO'?'ausrichtung5':'ausrichtung3','ordnung'))return;myT().tac=v;save();render();}
// Trainerstab (K16): einstellen (sofort, Vertrag zwei Jahre), verlängern (zwei Jahre, 10 % mehr Gehalt), entlassen (Abfindung: halbes Restgehalt). Ein Co-Trainer ist Pflicht.
function stabEinstellen(id){if(!darf('stab','vertragOderStab'))return;const x=S.stab.find(y=>y.id===id);if(!x||x.team>=0)return;const R0=RST.rollen[x.r];if(stabVon(S.my,x.r).length>=R0.plaetze){toast(`Für die Rolle ${R0.name} sind alle Plätze besetzt.`);return;}
  stabAnstellen(x);save();render();}
function stabVerlaengern(id){if(!darf('stab','vertragOderStab'))return;const x=S.stab.find(y=>y.id===id);if(!x||x.team!==S.my)return;x.ct+=RST.einstellenJahre;x.sal=Math.round(x.sal*RST.verlaengernGehalt/RST.gehalt.runden)*RST.gehalt.runden; /* Zahlen aus den Regeln seit Prüfung EQ7 */news(`${RST.rollen[x.r].name} ${x.n} verlängert bis ${S.season+x.ct} (${fmt(x.sal)} pro Jahr).`);save();render();}
function stabEntlassen(id){if(!darf('stab'))return;const x=S.stab.find(y=>y.id===id);if(!x||x.team!==S.my)return;if(x.r==='co'&&stabVon(S.my,'co').length<=1){toast('Ein Co-Trainer ist Pflicht. Stell erst einen neuen ein.');return;}
  const ab=Math.round(x.sal*x.ct*RST.abfindung);money('Abfindungen',-ab);x.team=-1;stabGeaendert();auftraegeAufraeumen();news(`${RST.rollen[x.r].name} ${x.n} entlassen, Abfindung ${fmt(ab)}.`);save();render();}
// Sommerpause (K12a): Urlaubslänge (auch im laufenden Urlaub änderbar) und Trainingsauftakt früher oder später
function setUrlaub(w){if(!darf('sommer','sommerplan'))return;if(!RSO.urlaubWochen.includes(w))return;S.sommer=Object.assign({},S.sommer||{},{urlaub:w});const t=myT();
  if(t.urlaub>0){const vorbei=(t.urlaubGesamt||t.urlaub)-t.urlaub;t.urlaub=Math.max(1,w*7-vorbei);t.urlaubGesamt=w*7;}save();if(S.phase==='end')showSummary();else render();}
function setAuftakt(v){if(!darf('sommer','sommerplan'))return;if(!RSO.auftaktVersatz.includes(v))return;S.sommer=Object.assign({},S.sommer||{},{versatz:v});save();if(S.phase==='end')showSummary();else render();}
// Training (K07): Vorlage des Wochenplans, Umschulung auf eine neue Position (belegt einen Einzeltrainingsplatz)
function setVorlage(k){if(!darf('vorlage','vorlage'))return;myT().vorlage=k==='auto'||!vorlageDef(k,myT())?'auto':k;save();render();}
// Eigene Vorlage aus dem Formular im Training (K07f): Auswahlfelder ev_<slot>_e und ev_<slot>_i, Name ev_name. Danach gilt die neue Vorlage.
function eigeneVorlageSpeichern(){if(!darf('vorlage','vorlage'))return;const w={},g=id=>{const e=document.getElementById(id);return e?e.value:'';};
  EIGENE_SLOTS.forEach(([k])=>{w[k]=[g(`ev_${k}_e`),g(`ev_${k}_i`)];});const r=eigeneVorlageSpeichernLauf(eigeneVorlageAus(w,g('ev_name')));
  if(!S.eigV||!S.eigV[r]){toast(r);return;}myT().vorlage=r;news(`Eigene Trainingsvorlage „${S.eigV[r].name}“ gespeichert und eingestellt.`);save();render();}
// Spielverlegung beantragen (K13 §13, K13d): Lizenzbereich verlegung, Gründe und neuer Termin in wettbewerbe.js
function spielVerlegen(){if(!darf('verlegung'))return;const g=spielVerlegenLauf();if(g){toast(g);return;}save();render();}
function eigeneVorlageLoeschen(k){if(!darf('vorlage','vorlage'))return;eigeneVorlageLoeschenLauf(k);save();render();}
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
function autoXI(){if(!darf('aufstellung'))return;S.lineup=besteElfDu();save();render();toast('Beste verfügbare Elf aufgestellt.');} // ohne Spieler auf der Tribüne (Prüfung FG4)
function setPrice(v){if(!darf('preise','sponsorOderPreis'))return;const P=RF.ticketPreis;myT().price=clamp(Math.round(+v||P.standard),P.min,P.max);save();render();}
function loan(k){if(!darf('kredit'))return;const t=myT(),max=kreditRahmen(t);if(k>0){const a=Math.min(k*1e6,max-S.loan);if(a<=0){toast('Kreditrahmen ausgeschöpft.');return;}kreditAufnehmen(a,+((document.getElementById('kreditJahre')||{}).value)||RFP.kredit.standard);}else{const a=Math.min(k===-99?S.loan:1e6,S.loan,Math.max(0,t.cash));if(a<=0){toast('Nichts zu tilgen oder kein Geld.');return;}kreditTilgen(a);}save();render();}
const bauLabel=(k,t)=>k==='cap'?`Tribünenausbau (+${RB.tribuene.plaetze.toLocaleString('de-DE')} Plätze)`:k==='logen'?`${RB.logen.anzahl} VIP-Logen`:'Fanshop Stufe '+(t.shop+1);
const bauKosten=(k,t)=>k==='cap'?RB.tribuene.kosten:k==='logen'?RB.logen.kosten:RB.fanshop.kosten[t.shop];
const bauWochen=k=>k==='cap'?RB.tribuene.wochen:k==='logen'?RB.logen.wochen:RB.fanshop.wochen;
const bauVoll=(k,t)=>k==='cap'?t.cap>=RB.tribuene.max:k==='logen'?t.logen>=RB.logen.max:t.shop>=RB.fanshop.max;
function startBuild(k){if(!darf('stadion'))return;bauStarten(k);} // seit K26a mit Genehmigung, Auflagen und Verzögerung (js/stadion.js), Lizenz auch hier (T5.5)
function setListed(id,on){if(!darf('transfers','gespraechOderTransfer'))return;const p=PIX.get(id);if(p.wech||p.leihe){toast('Das geht bei ihm gerade nicht.');return;}if(on){if(S.unv)delete S.unv[id];const v=+document.getElementById('ask').value;p.list=1;p.ask=Math.max(RM.runden,Math.round(v*1e6/RM.runden)*RM.runden);news(`${p.n} steht für ${fmt(p.ask)} auf der Transferliste.`);}else{p.list=0;S.offers=S.offers.filter(o=>o.pid!==id);versprechenAngebot(id,null);}save();openP(id);render();}
// Transferstatus „unverkäuflich“ für deine Spieler (K19 §5, K19c): Überraschungsangebote nur ab dem Höchstpreis, runter von der Transferliste, offene Angebote verfallen
function setUnverkaeuflich(id,on){if(!darf('transfers','gespraechOderTransfer'))return;const p=PIX.get(id);if(!p||p.team!==S.my)return;S.unv=S.unv||{};
  if(on){S.unv[id]=1;p.list=0;S.offers=S.offers.filter(o=>o.pid!==id);versprechenAngebot(id,null);news(`${p.n} ist unverkäuflich. Angebote gibt es nur noch zum Höchstpreis.`);}else delete S.unv[id];save();openP(id);render();}
function extend(id){if(!darf('vertraege','vertragOderStab'))return;const p=PIX.get(id),y=+(document.getElementById('ext')||{}).value||1;if(!p||p.team!==S.my||p.leihe)return;if(p.wech){toast('Er ist schon verkauft.');return;}
  if(verlaengertNicht(p)){toast(`${p.n} will nicht verlängern. Erst muss seine Stimmung besser werden.`);return;}
  const F=gehaltForderung(p,false),o=vtPaket(p,F,y,false),r=vertragRunde(p,S.my,o,F); // Verhandlung über das Paket (K21 §4.1, U10b)
  if(!r.ok){toast(r.text);save();openP(id);render();return;}vtUnterschrift(p,o,false);beraterAbschluss(p,o.sal,0,r.runden);news(`Vertrag verlängert: ${p.n} bis ${S.season+o.ct}, ${fmt(o.sal)} pro Jahr${o.vp||o.ak||o.lk?', mit Prämien oder Klauseln':''}.`,'good');save();openP(id);render();}
const abfindung=p=>Math.round(p.sal*p.ct*RF.abfindung);
function release(id){if(!darf('vertraege'))return;if((PIX.get(id)||{}).wech||(PIX.get(id)||{}).leihe){toast('Das geht bei ihm gerade nicht.');return;}const p=PIX.get(id),c=abfindung(p);money('Abfindungen',-c);kabineAbgang(p,S.my);vertragEnde(p);p.team=-1;p.list=0;S.offers=S.offers.filter(o=>o.pid!==id);news(`${p.n} wurde freigestellt (Abfindung ${fmt(c)}).`);save();closeOv();render();}
function acceptOffer(i,wv){if(!darf('transfers','gespraechOderTransfer'))return;verkaufAbschluss(S.offers[i],!!wv);save();render();}
// Gegenforderung auf ein Angebot (K19 §4.2): Liegt sie im Rahmen des Bieters, ist der Spieler verkauft, sonst erhöht er (höchstens drei Runden)
function gegenAngebot(i){if(!darf('transfers','gespraechOderTransfer'))return;const o=S.offers[i],el=document.getElementById('gf'+i);if(!o||!el)return;const betrag=Math.round((+el.value||0)*1e6);
  if(betrag<=o.amt){toast('Das Angebot liegt schon darüber. Nimm es einfach an.');return;}const r=gegenRunde(o,betrag);if(r.ok)verkaufAbschluss(o);else toast(r.text);save();render();}
function declineOffer(i){if(!darf('transfers'))return;const o=S.offers[i];if(o)versprechenAngebot(o.pid,o.amt);S.offers.splice(i,1);save();render();}
function offer(id){if(transferSperre()||transferSperreNaechste()){toast(transferSperre()?'Transfersperre wegen der Lizenzauflagen: In dieser Saison darfst du nicht kaufen.':'Die Transfersperre für die nächste Saison steht fest: Keine Käufe mehr, auch nicht für den Sommer.');return;}{const q=PIX.get(id);if(!darf('transfers','gespraechOderTransfer')||(q&&istAusland(q)&&!darf('ausland')))return;}const p=PIX.get(id),t=myT(),msg=document.getElementById('msg'),yrs=+document.getElementById('yrs').value||3,M=RM;
  if(squad(S.my).length>=M.kaderMax){msg.textContent=`Dein Kader ist voll (höchstens ${M.kaderMax} Spieler).`;return;}
  const aus=istAusland(p),from=aus?avVon(p.team):p.team>=0?S.teams[p.team]:null;if(p.wech){msg.textContent=`${p.n} wechselt schon zu ${wechselZiel(p.wech)}.`;return;}
  // Interesse (K19 §5.3): Fehlt wenig, verlangt er mehr Geld, fehlt viel, will er nicht (U10b)
  const F=gehaltMitInteresse(p,wechselInteresse(p));if(F==null){msg.textContent=`${p.n} hat kein Interesse an einem Wechsel zu ${t.name}.`;return;}
  const vorv=!!from&&p.ct===1&&vorvertragZeit(),o=vtPaket(p,F,yrs,!from);let fee=0,bonus=null,tausch=null; /* bonus: Teil der Ablöse als Bonus (K19i), tausch: eigener Spieler im Gegenzug (K19j) */
  if(!rahmenErlaubt(t,o.sal)){msg.textContent=`Der Vorstand gibt das Gehalt nicht frei: Mit ${p.n} lägen die Gehälter mehr als ${Math.round((RFP.budget.sperreAb-1)*100)} % über dem Rahmen von ${fmt(gehaltsRahmen(t))}. Erst verkaufen.`;return;} // Gehaltsrahmen (K23d)
  // Schritt 1: Ablöse mit dem Verein (K19 §5.2). Im letzten halben Jahr seines Vertrags geht es ohne Ablöse zum Sommer (Vorvertrag, K21 §4.3).
  if(from&&!vorv){const v=verhandlung(p);if(v.einig&&v.einig.bis>=S.tag){fee=v.einig.fee;bonus=v.einig.bonus||null;tausch=v.einig.tausch||null;
      if(tausch){const z=tauschPruefen(tausch.pid,from,aus);if(z&&z.fehler){v.einig=null;msg.textContent=`Der Tausch geht nicht mehr (${z.fehler}). Die Einigung gilt nicht mehr, mach ein neues Angebot.`;save();return;}}} /* vollständig neu geprüft, auch Transfersperre (Prüfung FI3) */
    else{fee=Math.round((+document.getElementById('fee').value||0)*1e6);
      bonus=bonusAusFormular(fee,aus);if(bonus&&bonus.fehler){msg.textContent=bonus.fehler;return;}tausch=tauschAusFormular(from,aus);if(tausch&&tausch.fehler){msg.textContent=tausch.fehler;return;}
      const bw=bonusWert(bonus)+(tausch?tausch.w:0),wert=fee+bw; /* der Verkäufer rechnet den Bonus zur Hälfte an (K19i), den Tauschspieler mit seinem Wert (K19j) */
      if(t.cash<feeJetzt(fee)+o.hg){msg.textContent='Dafür reicht dein Kontostand nicht.';return;}
      const r=kaufRunde(p,wert);if(!r.ok){msg.textContent=r.text+(bw&&r.gegen?` Mit ${tausch?'Tausch':'Bonus'} fehlen an fester Ablöse noch ${fmt(Math.max(0,r.gegen-wert))}.`:'');const fe=document.getElementById('fee');if(r.gegen&&fe)fe.value=mioAuf(Math.max(0,r.gegen-bw));save();return;} /* aufgerundet, sonst knapp darunter (Prüfung FH6) */
      {const k=aus?null:konkurrenzKauf(p,wert,{fee,bonus,tausch});if(k){const bis=datumKurz(verhandlung(p).konk.bis),fe=document.getElementById('fee');if(fe)fe.value=mioAuf(Math.max(0,k-bw)); // Bieterwettstreit beim Kauf (K20c), mit Bonus und Tausch (FH1)
        msg.textContent=`${from.name} sagt Ja, aber ein anderer Verein bietet ${fmt(k)} für ${p.n}. Bietest du bis ${bis} mindestens so viel, bekommst du den Zuschlag. Sonst wechselt er dorthin, es sei denn, er will unbedingt zu dir (K20d).${bw?` ${tausch?'Bonus und Tausch zählen':'Dein Bonus zählt'} mit ${fmt(bw)}.`:''}`;
        news(`Bieterwettstreit: Für ${p.n} bietet ein anderer Verein ${fmt(k)}. Frist bis ${bis}.`,'offer');save();return;}}
      verhandlung(p).einig={fee,bonus,tausch,bis:S.tag+14};}}
  if(t.cash<feeJetzt(fee)+o.hg+beraterProvision(p,o.sal,fee)){msg.textContent='Dafür reicht dein Kontostand nicht (mit Provision für den Berater).';return;}
  // Schritt 2: Vertrag mit dem Spieler (K21 §4.1)
  if(istLeihe(p)){msg.textContent=`${p.n} ist gerade ausgeliehen.`;return;}
  const r2=vertragRunde(p,S.my,o,F);if(!r2.ok){msg.textContent=(fee?`Einigung mit ${from.name} über ${fmt(fee)} steht (bis ${datumKurz(verhandlung(p).einig.bis)}). `:'')+r2.text;save();return;}
  {const v=verhandlung(p);if(!v.mc){money('Medizincheck',-RLE.medizin.kosten);const b=medizinBefund(p);v.mc={b:b||''};if(b){const a=medizinAbschlag(p),ges=fee+bonusWert(bonus)+(tausch?tausch.w:0);if(ges>0){fee=Math.max(0,Math.round((fee-a*ges)/RM.runden)*RM.runden);if(v.einig)v.einig.fee=fee;} // Medizincheck (K19 §5.5, U10d); Abschlag auf den ganzen angerechneten Wert, abgezogen von der festen Ablöse (Prüfung FH4)
    msg.textContent=`Medizincheck: Befund, ${b}.${ges>0?` Der Verein senkt seine Forderung um ${Math.round(a*100)} %, die feste Ablöse beträgt jetzt ${fmt(fee)}.`:''} Noch einmal „${vorv?'Vorvertrag anbieten':from?'Angebot abgeben':'Verpflichten'}“ zum Abschluss, sonst lass es.`;save();return;}}}
  if(fee&&from&&!aus)bezKaufFair(p,from.id,fee); // fairer Kauf verbessert die Beziehung (K17 §5.5, U12c), vor dem Löschen der Verhandlung
  if(from&&!aus&&!vorv)dritterKauf(p,from.id); // der lachende Dritte (K30c, K17 §5.4): Beziehung zwischen den beiden anderen Vereinen; nicht beim Vorvertrag, der Wechsel ist erst in der nächsten Saison (Prüfung EF4)
  if(fee){zgUeberBudget(fee);abloeseZahlen(fee,p.n);if(!aus)from.cash+=fee;} // über dem Transferbudget ist der Vorstand verstimmt (U12e); seit K23e auf Wunsch in Raten (K23 §5.5d)
  if(bonus&&from&&!aus)bonusVereinbaren(p,from.id,bonus); // Bonus, fällig nach Bedingung (K19i), auch wenn Medizincheck oder Nachlass die feste Ablöse auf 0 senkten (Prüfung FI2)
  if(tausch&&from&&!aus)tauschAbgeben(PIX.get(tausch.pid),from); // dein Spieler geht im Gegenzug (K19j)
 if(S.verh)delete S.verh[p.id];if(o.hg)money('Handgelder',-o.hg);beraterAbschluss(p,o.sal,fee,r2.runden); // Provision und Beziehung (K22)
  kaufSichtMerken(p);if(from&&(vorv||!fensterOffen())){wechselVormerken(p,S.my,Object.assign({ct:o.ct,sal:o.sal,preis:fee,vp:o.vp,ak:o.ak,lk:o.lk},vorv?{ab:tageDerSaison()}:{}));S.offers=S.offers.filter(x=>x.pid!==id); // Wechsel zum nächsten Fenster (K19 §5.6) oder zum Sommer (Vorvertrag)
    news(vorv?`Vorvertrag: ${p.n} kommt im Sommer ablösefrei von ${from.name} (Gehalt ${fmt(o.sal)}/Jahr).`:`Einigung: ${p.n} kommt für ${fmt(fee)} von ${from.name} (Gehalt ${fmt(o.sal)}/Jahr). Er wechselt mit dem Transferfenster am ${datumKurz(p.wech.ab)}.`,'good');save();closeOv();render();toast(`Einigung mit ${p.n}`);return;}
  if(aus)ausDemAusland(p,S.my);else if(from)kabineAbgang(p,from.id);p.team=S.my;p.list=0;vtUnterschrift(p,Object.assign({},o,{hg:0}),true);p.abl=fee;S.offers=S.offers.filter(x=>x.pid!==id);neuzugang(p,S.my);versprechenKauf(p);if(from)statTransfer(p,fee,from.id,S.my); // Rekorde (K34 §5.6, U13)
  news(`Neuzugang: ${p.n} kommt ${from?`für ${fmt(fee)} von ${from.name}${aus?` (${gruppenName(avGruppe(from))})`:''}`:'ablösefrei'} (Gehalt ${fmt(o.sal)}/Jahr, bis ${S.season+o.ct}).`,'good');save();closeOv();render();toast(`${p.n} unterschreibt!`);}
// Prämien und Klauseln im Vertragsformular zeigen (K21, ab der A-Lizenz)
function vertragDetails(id){if(!darf('praemien'))return;VT_DETAIL=1;openP(id);}
// Leihe (K08 §5.5, K19 §4.3, U10d): verleihen, ausleihen, zurückholen. In die Zweite abstellen (K08 §12 Nr. 29).
function verleihenUI(id){if(!darf('leihe'))return;const g=k=>(document.getElementById(k)||{}),p=PIX.get(id);const f=verleihen(p,{tid:+g('le_tid').value,anteil:+g('le_anteil').value||0,rolle:g('le_rolle').value,rueckruf:!!g('le_rueck').checked,option:Math.round((+g('le_option').value||0)*1e6)});
  if(f){toast(f);return;}save();closeOv();render();}
function ausleihenUI(id){if(!darf('leihe'))return;const f=ausleihen(PIX.get(id));if(f){toast(f);return;}save();closeOv();render();}
function leiheZurueck(id){if(!darf('leihe'))return;const f=zurueckholen(PIX.get(id));if(f){toast(f);return;}save();closeOv();render();}
function inZweiteUI(id){if(!darf('zweitekader'))return;const f=inDieZweite(PIX.get(id));if(f){toast(f);return;}save();closeOv();render();}
// Berater einladen (K22 §12 Nr. 3): VIP-Loge oder Essen, einmal im Monat je Berater
function beraterEinladen(id){if(!darf('berater'))return;toast(beraterEinladenLauf(id));save();render();}

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
function medSpritzen(id){if(!darf('medizin','medizin'))return;const p=PIX.get(id),i=p&&p.team===S.my?verletzungInfo(p):null;if(!i||!i.spritzbar||!heuteMeinSpiel())return;
  // Arzt widerspricht (K16 §8, K16d): Bei mehr als arztAb Tagen in der angezeigten Spanne rät er ab. Erst ein zweiter Klick am selben Tag spritzt.
  if(i.rest[1]>RMD.spritzen.arztAb&&p.spritzeWarn!==absTag(S.tag)){p.spritzeWarn=absTag(S.tag);toast(`Der Mannschaftsarzt rät ab: ${p.n} fällt noch ${spanneText(i.rest)} aus, mit ${Math.round(RMD.spritzen.verschlimmerung*100)} % wird es danach schlimmer. Klick noch einmal, wenn du trotzdem spritzen willst.`);save();render();return;}
  delete p.spritzeWarn;p.spritze=S.tag;p.spritzeAm=S.tag;news(`${p.n} wird für heute fit gespritzt.`);save();render();}
// Zweite Meinung (K10 §5, K10c): einmal je Verletzung nach der Diagnose, Kosten nach Liga, eigener Strom je Spieler und Tag. Deckt eine Fehldiagnose auf (K10b).
// besser: Rest der Ausfallzeit kürzer, schlechter: länger (wahre Dauer t, Zähler inj und Spanne gleich verschoben), sonst eine engere Spanne um die wahre Dauer.
const medZweiteMoeglich=p=>{const i=p&&p.team===S.my?verletzungInfo(p):null;return!!i&&i.phase!=='verdacht'&&i.art!=='krankheit'&&!p.vl.zm;};
function medZweite(id){if(!darf('medizin','medizin'))return;const p=PIX.get(id);if(!medZweiteMoeglich(p))return;const Z=RMD.zweite,v=p.vl,heute=absTag(S.tag),k=Z.kosten[myT().lg]||Z.kosten[3];
  money('Medizin',-k);v.zm=1;const txt=[];if(v.fehl&&v.sk){v.sd=v.sk;delete v.sk;delete v.fehl;txt.push('Die erste Diagnose war zu optimistisch.');}
  mitStrom(strom('zweiteMeinung',S.season,p.id,heute),()=>{const r=R(),rest=p.inj,seit=heute-v.ab;v.t=seit+p.inj-1; /* wahre Dauer aus dem Zähler, auch nach einer Spritze (Prüfung DZ3) */
    const bes=r<Z.besser,schl=!bes&&r<Z.besser+Z.schlechter,d=bes||schl?Math.max(1,Math.round(rest*Z.aenderung))*(bes?-1:1):0,neu=Math.max(1,rest+d),dd=neu-rest;
    if(dd){p.inj=neu;v.t+=dd;v.sd=v.sd.map(x=>Math.max(seit+1,x+dd));v.sd=[Math.min(v.sd[0],v.t),Math.max(v.sd[1],v.t)];txt.push(dd<0?'Eine andere Behandlung verkürzt die Pause.':'Der Schaden ist größer als gedacht, die Pause wird länger.');}
    else{const b=arztBreite(p.team)*RMD.diagnose.genau*Z.enger;v.sd=[Math.max(seit+1,Math.round(v.t*(1-b*R()))),Math.max(seit+1,Math.round(v.t*(1+b*R())))];txt.push('Die Diagnose wird bestätigt und genauer.');}}); /* ohne Änderung (auch am letzten Tag) „bestätigt“ (DZ2) */
  const i=verletzungInfo(p);news(`Zweite Meinung zu ${p.n} (${fmt(k)}): ${txt.join(' ')}${i?` Zurück in etwa ${spanneText(i.rest)}.`:''}`,'');save();render();}
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
// Zweite Mannschaft (K08 §5.6): Budget, aus der Jugend hinschicken, zu den Profis holen, verkaufen
function setZweite(l){if(!darf('zweite'))return;if(!hatZweite()||zweiteSim())return;myT().zws=clamp(Math.round(+l)||1,1,5);save();render();}
function jugendInZweite(id){if(!darf('zweitekader'))return;const p=PIX.get(id);if(!istJugend(p)||!jugendKader().includes(p)||!hatZweite())return;if(p.age<RZ.aufruecken.ausJugendAb){toast(`Wechsel in die Zweite ab ${RZ.aufruecken.ausJugendAb} Jahren.`);return;}
  if(!zweiteSim()&&zweiteKader().length>=RZ.kader.max){toast(`Die Zweite ist voll (höchstens ${RZ.kader.max} Spieler).`);return;}zweiteAufnehmen(p);news(`${p.n} (${p.pos}, ${p.age}) wechselt aus der Jugend in die Zweite.`);save();closeOv();render();}
function zweiteAufruecken(id){if(!darf('zweitekader'))return;const p=PIX.get(id),sim=zweiteSim();if(!p||!(istZweite(p)&&zweiteKader().includes(p))&&!(sim&&p.team===sim.id))return;
  if(squad(S.my).length>=RM.kaderMax){toast(`Dein Kader ist voll (höchstens ${RM.kaderMax} Spieler).`);return;}zweiteHoch(p);news(`Aus der Zweiten: ${p.n} (${p.pos}, ${p.age}) rückt in den Profikader auf. Talent ${stars(p)}.`,'good');save();closeOv();render();}
function zweiteVerkaufen(id){if(!darf('zweitekader'))return;const p=PIX.get(id);if(!istZweite(p)||!zweiteKader().includes(p)||p.age<RZ.verkauf.ab)return;if(!zweiteVerkauf(p)){toast('Kein Profiverein zahlt für ihn.');return;}save();closeOv();render();}
function setPate(id,mid){if(!darf('pate'))return;const p=PIX.get(id),m=mid?PIX.get(+mid):null,P=RJ.pate;if(!p||p.team!==S.my||p.age>P.bisAlter)return;
  if(!m)delete p.pate;else{if(m.team!==S.my||m===p||!hatEig(m,'mentor')||patenkinder(m).filter(q=>q!==p).length>=P.jeMentor)return;p.pate=m.id;}save();openP(id);render();}
// Scouting (K18): Spieler beobachten lassen, Suchauftrag starten und beenden
function beobachten(pid){{const q=PIX.get(pid);if(!darf('beobachten')||(q&&istAusland(q)&&!darf('ausland')))return;}const sc=document.getElementById('scsel'),wo=document.getElementById('scwo');if(!sc)return;const f=beobachtenLauf(pid,+sc.value,+(wo?wo.value:2));save();if(f){toast(f);return;}openP(pid);render();}
function sucheStarten(){if(!darf('suchauftrag'))return;const g=id=>document.getElementById(id);const f=sucheLauf(+g('su_scout').value,{pos:g('su_pos').value,alterBis:g('su_alter').value,abloeseBis:g('su_abl').value,region:(g('su_reg')||{}).value});save();if(f)toast(f);render();}
function sucheBeenden(id){if(!darf('suchauftrag'))return;auftragEnde(id);save();render();}

