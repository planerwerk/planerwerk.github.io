// Transfers I (Konzept K19, U10a): Transferfenster für alle, Vereinswert mit einer Formel für Kauf und Verkauf, Verhandlungsrunden, Wechsel zum nächsten Fensterbeginn.
// Alle Zahlen stehen in daten/regeln.js unter REGELN.transfers (Kurzform RTR).
// Außerhalb der Fenster wird verhandelt und bezahlt, der Spieler wechselt zum nächsten Fensterbeginn (S.wechsel, am Spieler p.wech). Vereinslose gehen jederzeit.
// Verträge mit Verhandlung (K21), Interesse des Spielers (K19 §5.3), Berater (K22), Leihe und Medizincheck folgen in U10b bis U10d.

// ---------- Fenster (K19 §5.6) ----------
const mmtt=tag=>{const d=datumVon(tag);return String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0');};
const fensterOffen=(tag=S.tag)=>{const k=mmtt(tag);return RTR.fenster.some(([a,b])=>k>=a&&k<=b);};
// Nächster Fensterbeginn (Tag, auch in der nächsten Saison) und letzter Tag des offenen Fensters
function naechstesFenster(tag=S.tag){for(let d=tag+1;d<tag+400;d++)if(fensterOffen(d)&&!fensterOffen(d-1))return d;return null;}
function fensterEnde(tag=S.tag){if(!fensterOffen(tag))return null;let d=tag;while(fensterOffen(d+1))d++;return d;}
const fensterText=()=>fensterOffen()?`Das Transferfenster ist offen bis ${datumKurz(fensterEnde())}`:`Das Transferfenster ist zu. Einigungen gelten ab dem nächsten Fenster am ${datumKurz(naechstesFenster())}, Vereinslose kommen sofort.`; // endet immer mit einem Punkt (das Datum hat schon einen)

// ---------- Vereinswert (K19 §5.1): eine Formel für alle Vereine ----------
const rundeAb=x=>Math.round(x/RM.runden)*RM.runden;
const rlFaktor=p=>RTR.restlaufzeit[Math.min(3,Math.max(0,p.ct|0))];
function finanzFaktor(tid){const F=RTR.finanzlage,t=tid>=0?S.teams[tid]:null;if(!t)return 1;return t.cash<F.knappUnter?F.knapp:t.cash>=F.reichAb?F.reich:1;}
// Verkäufer: Stellenwert nach Kaderrolle (Schlüsselspieler ×1,5 bis Überhang ×0,8)
const vwVerkauf=p=>value(p)*(RTR.stellenwert[kaderRolle(p)]||1)*rlFaktor(p)*finanzFaktor(p.team);
// Käufer: Bedarf. Verglichen mit dem schwächsten Stammspieler seiner Positionsgruppe (Torwart 1, Abwehr 4, Mittelfeld 4, Sturm 2)
const STAMM_JE_GRUPPE={TW:1,AB:4,MF:4,ST:2};
function kaufStellenwert(p,tid){const K=RTR.kauf,l=squad(tid).filter(q=>q.pos===p.pos&&q!==p).map(q=>q.str).sort((a,b)=>b-a),ref=l.length?l[Math.min(l.length,STAMM_JE_GRUPPE[p.pos]||1)-1]:0;
  return p.str>ref+K.spanne?K.besser:p.str>=ref-K.spanne?K.gleich:K.schlechter;}
const vwKauf=(p,tid)=>value(p)*kaufStellenwert(p,tid)*rlFaktor(p)*finanzFaktor(tid);

// ---------- Forderung und Verhandlung beim Kauf (K19 §5.1, §5.2) ----------
// Grundforderung: Transferliste (Wunschpreis), Ausland (Preis nach Finanzkraft) oder Vereinswert × 1,15, höchstens 1,8 × Marktwert
function forderungBasis(p){if(p.team<0)return 0;if(istAusland(p))return auslandPreis(p);if(p.list&&p.ask)return p.ask;return Math.min(vwVerkauf(p)*RTR.forderung,value(p)*RTR.maxFaktor);}
// Stand der Verhandlung um einen Spieler (gilt, solange er beim selben Verein ist)
function verhandlung(p){S.verh=S.verh||{};let v=S.verh[p.id];if(!v||v.team!==p.team)v=S.verh[p.id]={team:p.team,f:null,r:0,g:RTR.geduld,pause:-1,druck:-999};return v;}
const verhandlungVon=p=>{const v=S.verh&&S.verh[p.id];return v&&v.team===p.team?v:null;};
// Grundforderung an dich: mit deiner Beziehung zum Verein (K17 §5.2, U12c, nur inländische Vereine). Preise unter Computer-Vereinen nutzen forderungBasis ohne Beziehung.
// Deadline Day (K20 §4.3, K20b): Forderung deutscher Computer-Vereine schwankt in den letzten Tagen des Fensters, fest je Spieler und Tag (eigener Strom), Transferliste billiger
function deadlinePreis(p){const D=RAW.deadline;if(!D.preis||!(p.team>=0&&p.team<1000&&p.team!==S.my)||!deadlineTage())return 1;const u=mitStrom(strom('deadlinePreis',S.season,absTag(S.tag),p.id),()=>R());
  return clamp(1+D.preis*(2*u-1)+(p.list?D.liste:0),1-D.preis+Math.min(0,D.liste),1+D.preis);}
const forderungDu=p=>forderungBasis(p)*(p.team>=0&&p.team<AV0&&S.teams[p.team]?bezAbloese(p.team):1)*abwFaktor(p)*gerFaktor(p)*deadlinePreis(p); // aufgeflogenes Abwerben +15 % (K20 §5.4, U15), bekanntes Interesse aus der Gerüchteküche (K29 §5.5, U17b)
// Aktuelle Forderung: Grundforderung oder das letzte Gegenangebot
function forderung(p){const b=rundeAb(forderungDu(p)),v=verhandlungVon(p),f=v&&v.f!=null?Math.min(b,v.f):b;return konkurrenzOffen(v)?Math.max(f,v.konk.amt):f;} // Gegenangebot eines anderen Vereins (K20c)
// ---------- Bieterwettstreit beim Kauf (K20 §4.2, K20c) ----------
// In der Verhandlung v: kg = Saison der einmaligen Prüfung, konk = {tid Konkurrent, amt Gebot, bis Frist (Tag)} solange offen. Gewürfelt im eigenen Strom je Spieler und Saison.
const konkurrenzOffen=v=>!!(v&&v.konk&&v.konk.bis>=S.tag);
// Nach deiner angenommenen Ablöse (aktionen.js offer): Gibt es einen Mitbieter, Rückgabe sein Gebot (und v.konk gesetzt), sonst null.
// Mitbieter wie beim Kauf unter Computer-Vereinen (K31): Bedarf, höchstens computer.kauf.ansehenMinus Ansehen unter dem Verkäufer, Alter bis alterMax, Gehaltsrahmen, Beziehung.
// Sein Gebot: deine Ablöse + bieter.plus (gieriger Berater + bieter.gierig), höchstens transfers.maxFaktor × Marktwert und angebote.kontoAnteil seines Kontos (Prüfung DD1: vorher sein
// Vereinswert, der fast immer unter deiner Ablöse lag). Nicht, wenn das Fenster vor dem Ende der Frist schließt (DD5).
function konkurrenzKauf(p,fee){const v=verhandlung(p),B=RAW.bieter,K=RAW.konkurrenz,C=RCV.kauf,von=p.team>=0&&p.team<1000?S.teams[p.team]:null;
  if(v.kg===S.season||!von||!fensterOffen()||!fensterOffen(S.tag+B.frist+1)||p.team===S.my||istLeihe(p))return null;v.kg=S.season;
  const kand=S.teams.filter(t=>t.id!==S.my&&t.id!==p.team&&aktiv(t)&&!kiTransferSperre(t)&&t.rep>=von.rep-C.ansehenMinus&&p.age<=C.alterMax&&hatBedarf(t,p)&&t.cash*RM.angebote.kontoAnteil>fee*(1+B.plus[0])
    &&rahmenErlaubt(t,salaryFor(p.str))&&bez(t.id,p.team)>=RBZ.wirkung.gespraechUnter&&squad(t.id).length<RM.kaeufer.kaderMax);
  if(!kand.length)return null;
  return mitStrom(strom('konkurrenzKauf',S.season,p.id),()=>{if(R()>=K.chance)return null;const b=pick(kand),be=beraterVon(p),gier=be&&be.prof==='gierig'?B.gierig:0;
    const amt=rundeAb(Math.min(fee*(1+B.plus[0]+R()*(B.plus[1]-B.plus[0])+gier),Math.max(fee,value(p)*RTR.maxFaktor),b.cash*RM.angebote.kontoAnteil));if(amt<=fee)return null;
    v.konk={tid:b.id,amt,bis:S.tag+B.frist};return amt;});}
// Täglich (ablauf.js taeglichLauf): Frist vorbei, ohne dass du mitgegangen bist: Der Spieler wechselt zum Konkurrenten, wenn das Fenster noch offen ist.
// Nicht, wenn du inzwischen einen der beiden Vereine führst (DD3) oder der Verkäufer unter seine Mindestgröße fiele.
function konkurrenzTag(d){if(!S.verh)return;Object.keys(S.verh).forEach(id=>{const v=S.verh[id],k=v&&v.konk;if(!k||d<=k.bis)return;v.konk=null;const p=PIX.get(+id),b=S.teams[k.tid];
  if(!p||p.team!==v.team||p.team===S.my||k.tid===S.my||p.wech||p.leihe||!fensterOffen(d)||!b||!aktiv(b)||b.cash<k.amt||squad(b.id).length>=RM.kaeufer.kaderMax||squad(p.team).length<=RM.verkaeufer.kaderMin)return;
  delete S.verh[id];kiWechsel(p,b,k.amt);news(`Bieterwettstreit verloren: ${p.n} wechselt für ${fmt(k.amt)} zu ${b.name}.`,'bad');});}
const schmerzgrenze=p=>rundeAb(forderungDu(p)/RTR.forderung*RTR.schmerzgrenze);
// Eine Runde: dein Angebot an den Verein. Rückgabe {ok,preis} oder {text,gegen}
function kaufRunde(p,fee){const T=RTR,v=verhandlung(p),F=forderung(p),sch=schmerzgrenze(p),wer=vereinName(p);
  // Bieterwettstreit (K20c): Solange das Gegenangebot gilt, zählt nur, ob du mitgehst (vor Pause und Beziehung, Prüfung DD2: der Verkäufer hat schon Ja gesagt). Gehst du mit, zieht der andere zurück.
  if(konkurrenzOffen(v)){if(fee>=v.konk.amt){v.konk=null;return{ok:true,preis:fee};}return{text:`${wer} hat ein höheres Angebot eines anderen Vereins vorliegen: ${fmt(v.konk.amt)}. Bis ${datumKurz(v.konk.bis)} kannst du mitgehen.`,gegen:v.konk.amt};}
  if(v.pause>S.tag)return{text:`${wer} will bis ${datumKurz(v.pause)} nicht mehr über ${p.n} reden.`};
  // Schlechte Beziehung (K17 §5.2, U12c): Zu Beginn einer Verhandlung lehnt der Verein womöglich jedes Gespräch ab
  if(v.r===0&&bezLehntAb(p.team)){v.pause=S.tag+T.pause;return{text:`${wer} will mit dir nicht über ${p.n} reden (Beziehung ${bezZahl(bezWirk(p.team))}). Frühestens am ${datumKurz(v.pause)} wieder.`};}
  if(fee>=F)return{ok:true,preis:fee};
  v.r++;let txt='';if(fee<F*T.spott){v.g--;txt=`${wer} nimmt das als Spottangebot. `;bezDuAendern(p.team,RBZ.anlass.spott,`Spottangebot für ${p.n}`);}
  if(v.g<=0||v.r>=T.runden.kauf){v.pause=S.tag+T.pause;v.f=null;v.r=0;v.g=T.geduld;return{text:txt+`${wer} bricht die Verhandlung ab. Frühestens am ${datumKurz(v.pause)} wieder.`};}
  let f=Math.max(sch,rundeAb((F+fee)/2));
  if(fee>=F*T.anstaendig&&S.tag-v.druck>=T.preisdruck.tage){f=Math.max(sch,rundeAb(f*(1-T.preisdruck.prozent)));v.druck=S.tag;}
  v.f=f;return{text:txt+`${wer}: Gegenangebot ${fmt(f)} (Runde ${v.r} von ${T.runden.kauf}).`,gegen:f};}

// ---------- Angebote für deine Spieler (K19 §5.4) und deine Gegenforderung (§4.2) ----------
// Gebot eines Bieters: 85–100 % seines Vereinswerts, höchstens die Forderung der Transferliste. Obergrenze = sein Vereinswert.
// Auslandsvereine mit derselben Formel, nur ohne Bedarf (ihre Kader kennt das Spiel nicht im Einzelnen): Marktwert × Restlaufzeit, Obergrenze 15 % darüber (U10a, Befund BC).
const vwAusland=p=>value(p)*rlFaktor(p);
function gebotFuer(b,p,ask){const G=RTR.angebotKI,aus=b.id>=AV0,vw=aus?vwAusland(p):vwKauf(p,b.id);let a=vw*(G[0]+R()*(G[1]-G[0]))*gerFaktor(p);if(ask&&a>ask*gerFaktor(p))a=ask*gerFaktor(p); // bekanntes Interesse (K29 §5.5, U17b)
  
  return{amt:rundeAb(a),max:rundeAb(Math.max(aus?vw*RTR.auslandMax:vw,a))};}
// Hat ein Computer-Verein Bedarf? Der Spieler ist mindestens so gut wie sein schwächster Stammspieler auf der Position (K31 kommt mit U11)
const hatBedarf=(t,p)=>kaufStellenwert(p,t.id)>=RTR.kauf.gleich;
// Deine Gegenforderung: Liegt sie im Rahmen des Bieters, nimmt er an. Sonst erhöht er in die Mitte, nach drei Runden zieht er zurück.
function gegenRunde(o,betrag){const T=RTR,max=o.max||o.amt;o.r=(o.r||0)+1;if(betrag<=max){o.amt=Math.max(o.amt,betrag);return{ok:true};}
  if(o.r>=T.runden.verkauf){S.offers=S.offers.filter(x=>x!==o);return{text:`${tn(o.tid)} zieht das Angebot zurück.`};}
  o.amt=Math.min(max,rundeAb((o.amt+betrag)/2));return{text:`${tn(o.tid)} erhöht auf ${fmt(o.amt)} (Runde ${o.r} von ${T.runden.verkauf}).`};}

// Verkauf eines deiner Spieler nach einem Angebot: im Fenster sofort, sonst Einigung mit Geld jetzt und Wechsel zum nächsten Fensterbeginn
function verkaufAbschluss(o){const p=o&&PIX.get(o.pid);if(!p||p.team!==S.my||p.wech)return;if((p.ww||0)>=3)beraterBeziehung(p,RBE.beziehung.wunschVerkauf); // einen wechselwilligen Mandanten ziehen lassen (K22)
  const offen=fensterOffen(),weg=()=>{S.offers=S.offers.filter(x=>x.pid!==o.pid);};
  if(o.tid>=AV0){const v=avVon(o.tid);if(!v){S.offers=S.offers.filter(x=>x!==o);return;}money('Transfers',o.amt);weg();const land=gruppenName(avGruppe(v));
    if(!offen){wechselVormerken(p,o.tid,{preis:o.amt});news(`Einigung: ${p.n} wechselt für ${fmt(o.amt)} zu ${v.name} (${land}), mit dem Transferfenster am ${datumKurz(p.wech.ab)}.`,'good');return;}
    kabineAbgang(p,S.my);vertragEnde(p);insAusland(p,v.id);statTransfer(p,o.amt,S.my,v.id);news(`Verkauft: ${p.n} wechselt für ${fmt(o.amt)} zu ${v.name} (${land}).`,'good');return;} // Verkauf ins Ausland (K32): Der Spieler zieht in den Pool um
  const b=S.teams[o.tid];if(!b||!aktiv(b)){S.offers=S.offers.filter(x=>x!==o);toast(`${b?b.name:'Der Verein'} spielt nicht mehr in den Profiligen, das Angebot ist hinfällig.`);return;}
  money('Transfers',o.amt);b.cash-=o.amt;weg();if((o.r||0)<=RBZ.fairRunden)bezDuAendern(b.id,RBZ.anlass.fair,`fairer Transfer: ${p.n}`); // Angebot ohne Gegenforderung angenommen (K17, U12c)
  if(!offen){wechselVormerken(p,b.id,{ct:riA(RM.neuerVertrag),preis:o.amt});news(`Einigung: ${p.n} wechselt für ${fmt(o.amt)} zu ${b.name}, mit dem Transferfenster am ${datumKurz(p.wech.ab)}.`,'good');return;}
  kabineAbgang(p,S.my);vertragEnde(p);p.seit=absTag(S.tag);p.abl=o.amt;p.team=b.id;p.list=0;p.ct=riA(RM.neuerVertrag);statTransfer(p,o.amt,S.my,b.id);news(`Verkauft: ${p.n} wechselt für ${fmt(o.amt)} zu ${b.name}.`,'good');}

// ---------- Wechsel zum nächsten Fensterbeginn ----------
// p.wech = {nach, von, ct, sal, preis, ab}. Die Ablöse fließt bei der Einigung, der Spieler bleibt bis zum Fensterbeginn bei seinem Verein.
function wechselVormerken(p,nach,o){p.wech=Object.assign({nach,von:p.team,ab:naechstesFenster()},o);S.wechsel=[...(S.wechsel||[]).filter(id=>id!==p.id),p.id];if(S.verh)delete S.verh[p.id];}
const wechselZiel=w=>w.nach>=AV0?(avVon(w.nach)||{name:'Ausland'}).name:tn(w.nach);
// Vollziehen (Fensterbeginn). Im Sommer vor dem Saisonwechsel der Verträge, darum dort ein Vertragsjahr mehr.
function wechselVollziehen(sommer){const l=(S.wechsel||[]).map(id=>PIX.get(id)).filter(p=>p&&p.wech);S.wechsel=[];
  l.forEach(p=>{const w=p.wech;delete p.wech;if(p.team===-2)return;const mein=w.nach===S.my||w.von===S.my;
    if(w.nach>=AV0){const v=avVon(w.nach);if(!v||istAusland(p))return;kabineAbgang(p,p.team);vertragEnde(p);insAusland(p,v.id);statTransfer(p,w.preis,w.von,v.id);} // Rekorde (K34 §5.6, U13)
    else{const t=S.teams[w.nach];if(!t||!aktiv(t)){if(!istAusland(p)){kabineAbgang(p,p.team);p.team=-1;p.list=0;}return;}
      if(istAusland(p))ausDemAusland(p,w.nach);else kabineAbgang(p,p.team);
      if(w.von===S.my)vertragEnde(p);p.team=w.nach;p.list=0;p.ct=(w.ct||riA(RM.neuerVertrag))+(sommer?1:0);if(w.sal)p.sal=w.sal;p.seit=absTag(S.tag);if(w.preis)p.abl=w.preis;
      if(w.nach===S.my){if(w.vp)p.vp=w.vp;else delete p.vp;if(w.ak)p.ak=w.ak;else delete p.ak;if(w.lk)p.lk=w.lk;else delete p.lk;}neuzugang(p,w.nach);if(w.nach===S.my){kabineInit(p);versprechenKauf(p);}statTransfer(p,w.preis,w.von,w.nach);}
    if(mein)news(`Transferfenster: ${p.n} wechselt wie vereinbart ${w.nach===S.my?'zu dir':'zu '+wechselZiel(w)}.`,w.nach===S.my?'good':'tr');});}
// Täglich: am ersten Tag des Winterfensters (der Sommer beginnt mit dem Saisonwechsel)
function wechselTag(d){if(d>0&&fensterOffen(d)&&!fensterOffen(d-1)&&(S.wechsel||[]).length)wechselVollziehen(false);}

// ---------- Anzeige ----------
function wechselKarte(){const l=(S.wechsel||[]).map(id=>PIX.get(id)).filter(p=>p&&p.wech&&(p.wech.nach===S.my||p.wech.von===S.my));if(!l.length)return'';
  return`<div class="card" style="margin-top:14px"><h3>Vereinbarte Wechsel</h3>${l.map(p=>`<p><a href="#" onclick="openP(${p.id});return false" style="color:var(--chalk)">${esc(p.n)}</a>: ${p.wech.nach===S.my?`kommt von ${esc(vereinName(p))}`:`geht zu ${esc(wechselZiel(p.wech))}`} am ${esc(datumKurz(p.wech.ab))}${p.wech.preis?` (Ablöse ${fmt(p.wech.preis)}, bezahlt)`:''}</p>`).join('')}</div>`;}
