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
// Alter Spielstand (Prüfung FB3): Ein Nachlass aus einer Karte stand vor FA1 als fester Betrag in v.f (nl ohne nlF, noch keine Runde). Beim Laden fällt er weg.
// Gegenangebote aus Spielständen vor FB tragen weder fMy noch fNl (Prüfung FC4): Sie gelten für den Verein beim Laden und, wenn gerade ein Nachlass läuft, nur mit ihm.
function verhUmstellen(){Object.values(S.verh||{}).forEach(v=>{if(!v)return;if(v.nl&&v.nlF==null&&!v.r)v.f=null;if(v.f!=null&&v.fMy==null){v.fMy=S.my;v.fNl=v.nlF>0?1:0;}});fristenAltstand();}
// Spielstände, die vor Prüfung FD schon einen Saisonwechsel hatten (Prüfung FF5): Fristen, die zu weit in der Zukunft liegen, stammen aus der Vorsaison.
// Kater mehr als katerTage voraus und Standardtraining in der Zukunft fallen weg, eine Gegnerbeobachtung mehr als 60 Tage voraus auch, Angebote für deine Spieler
// gelten höchstens noch angebotTage. Beim Laden (verhUmstellen), ohne Zufall; bei Ständen nach FD ändert sich nichts.
function fristenAltstand(){const K=RTA.einstellung.saison.katerTage,h=S.tag;
  [...(S.teams||[]),...((S.ausland&&S.ausland.v)||[])].forEach(t=>{if(!t)return;if(t.kater!=null&&t.kater-h>K)delete t.kater;if(t.stdTag!=null&&t.stdTag>h)delete t.stdTag;if(t.gb&&t.gb.bis-h>60)t.gb=null;});
  (S.offers||[]).forEach(o=>{if(o&&o.bis!=null&&o.bis-h>RK.angebotTage)o.bis=h+RK.angebotTage;});}
// Fristen in Saisontagen (Prüfung FC1): S.tag beginnt jede Saison neu. Beim Saisonwechsel rücken Pause, Preisdruck, Einigung und Bieterfrist der Verhandlungen,
// die Vertagung der Vertragsgespräche (S.vt) und der Tag des letzten Vertragsgesprächs (S.vtGespr) um dt Tage (Länge der alten Saison) zurück.
// Sonst sperrte ein Abbruch im Mai die ganze nächste Saison, und eine alte Einigung lebte wieder auf.
// Seit Prüfung FD ebenso: am Verein (auch Auslandsvereine) der Kater nach „Spiel der Saison“ `kater` (FD1), der Tag des Standardtrainings `stdTag` und das Ende der
// Gegnerbeobachtung `gb.bis` (FD5), die Fristen der Angebote für deine Spieler `S.offers[].bis` (FD2) und das Fenster der letzten Bieterrunde am Spieler `bieterF` (FD4).
function fristenSaisonwechsel(dt){const z=x=>x==null?x:x-dt;
  Object.values(S.verh||{}).forEach(v=>{if(!v)return;v.pause=z(v.pause);v.druck=z(v.druck);if(v.einig)v.einig.bis=z(v.einig.bis);if(v.konk)v.konk.bis=z(v.konk.bis);});
  Object.values(S.vt||{}).forEach(v=>{if(v&&v.pause!=null)v.pause=z(v.pause);});
  if(S.vtGespr)Object.keys(S.vtGespr).forEach(id=>{S.vtGespr[id]=z(S.vtGespr[id]);});
  [...(S.teams||[]),...((S.ausland&&S.ausland.v)||[])].forEach(t=>{if(!t)return;if(t.kater!=null)t.kater=z(t.kater);if(t.stdTag!=null)t.stdTag=z(t.stdTag);if(t.gb&&t.gb.bis!=null)t.gb.bis=z(t.gb.bis);});
  (S.offers||[]).forEach(o=>{if(o&&o.bis!=null)o.bis=z(o.bis);});
  const gesehen=new Set();[...(S.pl||[]),...(S.zw||[]),...((S.ausland&&S.ausland.pl)||[])].forEach(p=>{if(!p||gesehen.has(p))return;gesehen.add(p);if(p.bieterF!=null)p.bieterF=z(p.bieterF);});} /* auch Zweite und Ausland (Prüfung FF4), jeder Spieler einmal */
// Jobwechsel (Prüfung FC3): Einigungen über eine Ablöse galten für den alten Verein (womöglich samt dessen Nachlass), sie verfallen.
function verhJobwechsel(){Object.values(S.verh||{}).forEach(v=>{if(v)v.einig=null;});}
// Grundforderung an dich: mit deiner Beziehung zum Verein (K17 §5.2, U12c, nur inländische Vereine). Preise unter Computer-Vereinen nutzen forderungBasis ohne Beziehung.
// Deadline Day (K20 §4.3, K20b): Forderung deutscher Computer-Vereine schwankt in den letzten Tagen des Fensters, fest je Spieler und Tag (eigener Strom), Transferliste billiger
function deadlinePreis(p){const D=RAW.deadline;if(!D.preis||!(p.team>=0&&p.team<1000&&p.team!==S.my)||!deadlineTage())return 1;const u=mitStrom(strom('deadlinePreis',S.season,absTag(S.tag),p.id),()=>R());
  return clamp(1+D.preis*(2*u-1)+(p.list?D.liste:0),1-D.preis+Math.min(0,D.liste),1+D.preis);}
// Transferstatus „unverkäuflich“ (K19 §5, K19c). Computer-Vereine: ihre stärksten Spieler mit langem Vertrag, nicht auf der Liste. Nur für deine Käufe (forderungDu),
// nicht unter Computer-Vereinen (kiSternPreis nutzt forderungBasis), sonst würde der Gleichschritt abweichen. Du zahlst dann den Höchstpreis maxFaktor × Marktwert.
function unverkaeuflichKI(p){const U=RTR.unverkaeuflich;if(!p||p.team<0||p.team>=AV0||p.team===S.my||p.list||p.leihe||(p.ct||0)<U.bindungAb)return false;const t=S.teams[p.team];if(!t||!aktiv(t))return false;
  return squad(p.team).slice().sort((a,b)=>b.str-a.str).slice(0,U.schluessel).some(q=>q.id===p.id);}
// Deine Spieler: S.unv = {Spieler: 1}. Überraschungsangebote nur ab dem Höchstpreis (ablauf.js market), nicht zugleich auf der Transferliste.
const unverkaeuflichDu=p=>!!(p&&S.unv&&S.unv[p.id]&&p.team===S.my);
const forderungDu=p=>(unverkaeuflichKI(p)?value(p)*RTR.maxFaktor:forderungBasis(p))*(p.team>=0&&p.team<AV0&&S.teams[p.team]?bezAbloese(p.team):1)*abwFaktor(p)*gerFaktor(p)*deadlinePreis(p)*konkurrenzTischFaktor(p); // aufgeflogenes Abwerben +15 % (K20 §5.4, U15), bekanntes Interesse aus der Gerüchteküche (K29 §5.5, U17b)
// Aktuelle Forderung: Grundforderung oder das letzte Gegenangebot
// Nachlass aus einer Karte (K30c, K19f, Prüfung FA1): Anteil v.nlF bis zum absoluten Tag v.nlBis, nur für den Verein, für den du ihn bekommen hast (v.nlMy).
// Er übersteht einen Abbruch der Verhandlung und verfällt mit der Frist. Vorher stand ein fester Betrag in v.f, der nie verfiel.
const nachlassFaktor=v=>v&&v.nlF>0&&v.nlMy===S.my&&v.nlBis!=null&&absTag(S.tag)<=v.nlBis?1-v.nlF:1;
// Gegenangebot v.f gilt nur für den Verein, für den es kam (fMy), und eines unter einem Nachlass verfällt mit ihm (fNl, Prüfung FB2).
// Hat es ein älteres Gegenangebot ohne Nachlass ersetzt (v.fAlt = {f, my}), gilt danach wieder das ältere (Prüfung FC5).
function gegenFrist(v){if(!v||!v.fNl||v.f==null||nachlassFaktor(v)<1)return;const a=v.fAlt;v.f=a?a.f:null;v.fMy=a?a.my:null;v.fNl=0;delete v.fAlt;}
const gegenGilt=v=>{gegenFrist(v);return !!v&&v.f!=null&&(v.fMy==null||v.fMy===S.my);};
function forderung(p){const v=verhandlungVon(p),b=rundeAb(forderungDu(p)*nachlassFaktor(v)),f=gegenGilt(v)?Math.min(b,v.f):b;return konkurrenzOffen(v)?Math.max(f,v.konk.amt):f;} // Gegenangebot eines anderen Vereins (K20c)
// ---------- Bieterwettstreit beim Kauf (K20 §4.2, K20c) ----------
// In der Verhandlung v: kg = Saison der einmaligen Prüfung, konk = {tid Konkurrent, amt Gebot, bis Frist (Tag)} solange offen. Gewürfelt im eigenen Strom je Spieler und Saison.
const konkurrenzOffen=v=>!!(v&&v.konk&&v.konk.bis>=S.tag);
// Nach deiner angenommenen Ablöse (aktionen.js offer): Gibt es einen Mitbieter, Rückgabe sein Gebot (und v.konk gesetzt), sonst null.
// Mitbieter wie beim Kauf unter Computer-Vereinen (K31): Bedarf, höchstens computer.kauf.ansehenMinus Ansehen unter dem Verkäufer, Alter bis alterMax, Gehaltsrahmen, Beziehung.
// Sein Gebot: deine Ablöse + bieter.plus (gieriger Berater + bieter.gierig), höchstens transfers.maxFaktor × Marktwert und angebote.kontoAnteil seines Kontos (Prüfung DD1: vorher sein
// Vereinswert, der fast immer unter deiner Ablöse lag). Nicht, wenn das Fenster vor dem Ende der Frist schließt (DD5).
// Computer-Vereine, die für p (bei Verein von) mit einem Gebot über fee mitbieten könnten. Auch für die Karte „Der lachende Dritte“ (K30c).
function mitbieter(p,von,fee){const B=RAW.bieter,C=RCV.kauf;return S.teams.filter(t=>t.id!==S.my&&t.id!==p.team&&aktiv(t)&&!kiTransferSperre(t)&&t.rep>=von.rep-C.ansehenMinus&&p.age<=C.alterMax&&hatBedarf(t,p)&&t.cash*RM.angebote.kontoAnteil>fee*(1+B.plus[0])
    &&rahmenErlaubt(t,salaryFor(p.str))&&bez(t.id,p.team)>=RBZ.wirkung.gespraechUnter&&squad(t.id).length<RM.kaeufer.kaderMax);}
// teile: {fee, bonus, tausch} deines Angebots (K19i, K19j). fee ist der angerechnete Wert; die Teile übernimmt die Einigung, wenn du den Wettstreit doch gewinnst (Prüfung FH1).
function konkurrenzKauf(p,fee,teile){const v=verhandlung(p),B=RAW.bieter,K=RAW.konkurrenz,von=p.team>=0&&p.team<1000?S.teams[p.team]:null;
  if(v.kg===S.season||!von||!fensterOffen()||!fensterOffen(S.tag+B.frist+1)||p.team===S.my||istLeihe(p))return null;v.kg=S.season;
  const kand=mitbieter(p,von,fee);
  if(!kand.length)return null;
  return mitStrom(strom('konkurrenzKauf',S.season,p.id),()=>{if(R()>=K.chance)return null;const b=pick(kand),be=beraterVon(p),gier=be&&be.prof==='gierig'?B.gierig:0;
    const amt=rundeAb(Math.min(fee*(1+B.plus[0]+R()*(B.plus[1]-B.plus[0])+gier),Math.max(fee,value(p)*RTR.maxFaktor),b.cash*RM.angebote.kontoAnteil));if(amt<=fee)return null;
    v.konk={tid:b.id,amt,bis:S.tag+B.frist,dein:fee,my:S.my,teile:teile&&(teile.bonus||teile.tausch)?teile:null};return amt;});} /* dein: deine angenommene Ablöse, my: dein Verein beim Gebot (K20d, DP6), teile: mit Bonus oder Tausch */
// Recht des Spielers (K20 §4.2, K20d): Will er unbedingt zu dir, lehnt er den Höchstbietenden ab. Chance nach seinem Interesse an dir, kleiner, wenn der andere Verein
// mehr Ansehen hat als deiner. Eigener Strom je Spieler und Saison.
function spielerLehntAb(p,b){const N=RAW.konkurrenz.nein,i=wechselInteresse(p);if(i<N.ab)return false;const c=Math.min(N.max,N.basis+(i-N.ab)*N.jePunkt)*(b.rep>myT().rep?N.besser:1);
  return mitStrom(strom('konkurrenzNein',S.season,p.id),()=>R()<c);}
// Täglich (ablauf.js taeglichLauf): Frist vorbei, ohne dass du mitgegangen bist: Der Spieler wechselt zum Konkurrenten, wenn das Fenster noch offen ist.
// Nicht, wenn du inzwischen einen der beiden Vereine führst (DD3) oder der Verkäufer unter seine Mindestgröße fiele.
// K20d: Lehnt der Spieler ab oder kann der andere Verein nicht mehr kaufen, bleibt der Verkäufer bei deinem Gebot (Einigung wie nach einem Ja, 14 Tage, Prüfung DP1 und DP2).
function konkurrenzTag(d){if(!S.verh)return;Object.keys(S.verh).forEach(id=>{const v=S.verh[id],k=v&&v.konk;if(!k||d<=k.bis)return;v.konk=null;const p=PIX.get(+id),b=S.teams[k.tid];
  if(!p||p.team!==v.team||p.team===S.my||k.tid===S.my||p.wech||p.leihe||!fensterOffen(d)||squad(p.team).length<=RM.verkaeufer.kaderMin)return;
  const deins=k.dein!=null&&(k.my==null||k.my===S.my),T=k.teile,zusage=txt=>{v.f=k.dein;v.fMy=S.my;v.fNl=0;delete v.fAlt;
    v.einig=T?{fee:T.fee,bonus:T.bonus||null,tausch:T.tausch||null,bis:d+RAW.konkurrenz.zusageTage}:{fee:k.dein,bis:d+RAW.konkurrenz.zusageTage};news(txt,'good');}; /* mit Bonus und Tausch (Prüfung FH1) */
  if(!b||!aktiv(b)||b.cash<k.amt||squad(b.id).length>=RM.kaeufer.kaderMax){if(deins)zusage(`Der andere Verein zieht sein Angebot für ${p.n} zurück. ${vereinName(p)} bleibt bei ${T?'deinem Angebot':`deinen ${fmt(k.dein)}`}.`);return;}
  if(deins&&spielerLehntAb(p,b)){zusage(`${p.n} lehnt das Angebot von ${b.name} ab, er will zu ${myT().name}. ${vereinName(p)} nimmt jetzt ${T?'dein Angebot':`deine ${fmt(k.dein)}`}.`);return;}
  delete S.verh[id];kiWechsel(p,b,k.amt);news(`Bieterwettstreit verloren: ${p.n} wechselt für ${fmt(k.amt)} zu ${b.name}.`,'bad');});}
const schmerzgrenze=p=>unverkaeuflichKI(p)?rundeAb(forderungDu(p)):rundeAb(forderungDu(p)/RTR.forderung*RTR.schmerzgrenze); /* unverkäuflich: nicht unter den Höchstpreis (Prüfung DU2) */
// Eine Runde: dein Angebot an den Verein. Rückgabe {ok,preis} oder {text,gegen}
function kaufRunde(p,fee){const T=RTR,v=verhandlung(p),F=forderung(p),sch=schmerzgrenze(p),wer=vereinName(p);
  // Bieterwettstreit (K20c): Solange das Gegenangebot gilt, zählt nur, ob du mitgehst (vor Pause und Beziehung, Prüfung DD2: der Verkäufer hat schon Ja gesagt). Gehst du mit, zieht der andere zurück.
  if(konkurrenzOffen(v)){if(fee>=v.konk.amt){v.konk=null;return{ok:true,preis:fee};}return{text:`${wer} hat ein höheres Angebot eines anderen Vereins vorliegen: ${fmt(v.konk.amt)}. Bis ${datumKurz(v.konk.bis)} kannst du mitgehen.${v.konk.dein!=null?` Will ${p.n} unbedingt zu dir, lehnt er das andere Angebot vielleicht ab.`:''}`,gegen:v.konk.amt};}
  if(v.pause>S.tag)return{text:`${wer} will bis ${datumKurz(v.pause)} nicht mehr über ${p.n} reden.`};
  // Schlechte Beziehung (K17 §5.2, U12c): Zu Beginn einer Verhandlung lehnt der Verein womöglich jedes Gespräch ab
  if(v.r===0&&bezLehntAb(p.team)){v.pause=S.tag+T.pause;return{text:`${wer} will mit dir nicht über ${p.n} reden (Beziehung ${bezZahl(bezWirk(p.team))}). Frühestens am ${datumKurz(v.pause)} wieder.`};}
  if(fee>=F)return{ok:true,preis:fee};
  v.r++;let txt='';if(fee<F*T.spott){v.g--;txt=`${wer} nimmt das als Spottangebot. `;bezDuAendern(p.team,RBZ.anlass.spott,`Spottangebot für ${p.n}`);}
  if(v.g<=0||v.r>=T.runden.kauf){v.pause=S.tag+T.pause;v.f=null;delete v.fAlt;v.r=0;v.g=T.geduld;return{text:txt+`${wer} bricht die Verhandlung ab. Frühestens am ${datumKurz(v.pause)} wieder.`};}
  let f=Math.max(sch,rundeAb((F+fee)/2));
  if(fee>=F*T.anstaendig&&S.tag-v.druck>=T.preisdruck.tage){f=Math.max(sch,rundeAb(f*(1-T.preisdruck.prozent)));v.druck=S.tag;}
  const nl=nachlassFaktor(v)<1;if(!nl)delete v.fAlt;else if(!v.fNl&&gegenGilt(v))v.fAlt={f:v.f,my:v.fMy}; /* Prüfung FC5: das ältere Gegenangebot ohne Nachlass merken */
  f=Math.min(f,F);v.f=f;v.fMy=S.my;v.fNl=nl?1:0;return{text:txt+`${wer}: Gegenangebot ${fmt(f)} (Runde ${v.r} von ${T.runden.kauf}).`,gegen:f};} /* nie über der eigenen Forderung, auch wenn die Schmerzgrenze nach einem Nachlass gestiegen ist (Prüfung EF1) */

// ---------- Angebote für deine Spieler (K19 §5.4) und deine Gegenforderung (§4.2) ----------
// Gebot eines Bieters: 85–100 % seines Vereinswerts, höchstens die Forderung der Transferliste. Obergrenze = sein Vereinswert.
// Auslandsvereine mit derselben Formel, nur ohne Bedarf (ihre Kader kennt das Spiel nicht im Einzelnen): Marktwert × Restlaufzeit, Obergrenze 15 % darüber (U10a, Befund BC).
const vwAusland=p=>value(p)*rlFaktor(p);
function gebotFuer(b,p,ask){const G=RTR.angebotKI,aus=b.id>=AV0,vw=aus?vwAusland(p):vwKauf(p,b.id);let a=vw*(G[0]+R()*(G[1]-G[0]))*gerFaktor(p);if(ask&&a>ask*gerFaktor(p))a=ask*gerFaktor(p); // bekanntes Interesse (K29 §5.5, U17b)
  
  return{amt:rundeAb(a),max:rundeAb(Math.max(aus?vw*RTR.auslandMax:vw,a))};}
// Hat ein Computer-Verein Bedarf? Der Spieler ist mindestens so gut wie sein schwächster Stammspieler auf der Position (K31 kommt mit U11)
const hatBedarf=(t,p)=>kaufStellenwert(p,t.id)>=RTR.kauf.gleich;
// Bedarf der anderen Vereine (K31 §6, K31b): deutsche Vereine, die für deinen Spieler auf der Transferliste bieten könnten, mit denselben Bedingungen wie die Angebote
// in ablauf.js market (aktiv, ohne Transfersperre, Bedarf, Konto über Preis × angebote.kontoAnteil). Preis: deine Forderung, sonst der Marktwert.
// Vereine mit einer Lücke (Stellenwert besser, sie zahlen mehr, vwKauf) zuerst, dann nach Ansehen. aus: Zahl der Auslandsvereine, die ihn bezahlen könnten. Nur Anzeige, kein Würfel.
function bedarfAndere(p){const preis=p.list&&p.ask?p.ask:value(p),l=S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&!kiTransferSperre(t)&&t.cash>preis*RM.angebote.kontoAnteil&&hatBedarf(t,p))
  .map(t=>({t,luecke:kaufStellenwert(p,t.id)>=RTR.kauf.besser})).sort((a,b)=>b.luecke-a.luecke||b.t.rep-a.t.rep||a.t.id-b.t.id);return{preis,l,aus:auslandKaeufer(p,preis).length};}
function bedarfAndereText(p){if(p.team!==S.my||p.leihe||p.wech)return'';const B=bedarfAndere(p),zeig=B.l.slice(0,RTR.bedarfAnzeige.max);
  return`<div class="card"><h3>Bedarf anderer Vereine</h3>${B.l.length?`<p>${zeig.map(x=>esc(x.t.name)+(x.luecke?' (Lücke, zahlt mehr)':'')).join(', ')}${B.l.length>zeig.length?` und ${B.l.length-zeig.length} weitere`:''}.</p>`:'<p>Kein deutscher Verein braucht im Moment einen Spieler wie ihn und kann ihn bezahlen.</p>'}${B.aus?`<p class="dim">Dazu ${B.aus} Vereine im Ausland, die ihn bezahlen könnten.</p>`:''}<p class="dim">Gerechnet mit ${p.list&&p.ask?'deiner Forderung':'dem Marktwert'} (${fmt(B.preis)}). Deutsche Vereine bieten nur mit Bedarf, Auslandsvereine nach Stärke und Budget. Führt der Stab die Transfers, kommen keine Angebote an dich.</p></div>`;}
// Deine Gegenforderung: Liegt sie im Rahmen des Bieters, nimmt er an. Sonst erhöht er in die Mitte, nach drei Runden zieht er zurück.
function gegenRunde(o,betrag){const T=RTR,max=o.max||o.amt;o.r=(o.r||0)+1;if(betrag<=max){o.amt=Math.max(o.amt,betrag);return{ok:true};}
  if(o.r>=T.runden.verkauf){S.offers=S.offers.filter(x=>x!==o);return{text:`${tn(o.tid)} zieht das Angebot zurück.`};}
  o.amt=Math.min(max,rundeAb((o.amt+betrag)/2));return{text:`${tn(o.tid)} erhöht auf ${fmt(o.amt)} (Runde ${o.r} von ${T.runden.verkauf}).`};}

// Verkauf eines deiner Spieler nach einem Angebot: im Fenster sofort, sonst Einigung mit Geld jetzt und Wechsel zum nächsten Fensterbeginn
// Weiterverkaufsbeteiligung (K19 §5.2, K19d): p.wvb = {tid: begünstigter Verein, anteil, von: der Verein, der sie schuldet}. Zahlung anteil × Ablöse nur, wenn genau
// dieser Verein ihn mit Ablöse abgibt und nicht an den Begünstigten zurück (Prüfung EA4, EA5). Gibt ihn ein anderer Verein ab (er kam ablösefrei dorthin), ist sie ohne Zahlung
// erledigt. Der Wechsel vom Begünstigten zum Käufer (auch verschoben ins Fenster) lässt sie stehen. Aufgerufen aus statTransfer. Auslandsvereine zahlen aus ihrem Budget, das nicht geführt wird.
function weiterverkaufPruefen(p,fee,von,nach){const w=p&&p.wvb;if(!w||!(fee>0)||von===w.tid)return;delete p.wvb;if((w.von!=null&&von!==w.von)||nach===w.tid)return;const x=Math.round(fee*w.anteil/1000)*1000;if(!x)return;
  if(von===S.my)money('Transfers: Weiterverkauf',-x);else if(von!=null&&von>=0&&S.teams[von])S.teams[von].cash-=x;
  if(w.tid===S.my){money('Transfers: Weiterverkauf',x);news(`Weiterverkaufsbeteiligung: ${p.n} wechselt für ${fmt(fee)}, dein Verein bekommt ${Math.round(w.anteil*100)} %, also ${fmt(x)}.`,'good');}
  else if(S.teams[w.tid])S.teams[w.tid].cash+=x;}
// Bindet eine bestehende Klausel deinen Verein? Nur dann gibt es keine neue (Prüfung EB8). Eine fremde Klausel endet beim Verkauf ohnehin ohne Zahlung, alte ohne von zählen mit.
const wvbBindet=p=>!!p.wvb&&(p.wvb.von==null||p.wvb.von===S.my);
// wv: mit Weiterverkaufsbeteiligung (nur an deutsche Vereine). Der Käufer zahlt dafür bewertung × anteil weniger (K19 §5.2).
function verkaufAbschluss(o,wv){const p=o&&PIX.get(o.pid);if(!p||p.team!==S.my||p.wech)return;if((p.ww||0)>=3)beraterBeziehung(p,RBE.beziehung.wunschVerkauf); // einen wechselwilligen Mandanten ziehen lassen (K22)
  if(o.tid<AV0&&kiTransferSperre(S.teams[o.tid])){S.offers=S.offers.filter(x=>x!==o);news(`${S.teams[o.tid].name} hat eine Transfersperre und zieht das Angebot zurück.`,'bad');return;} // Lizenzsperre (K23g, Prüfung DF2)
  const offen=fensterOffen(),weg=()=>{S.offers=S.offers.filter(x=>x.pid!==o.pid);};
  if(o.tid>=AV0){const v=avVon(o.tid);if(!v){S.offers=S.offers.filter(x=>x!==o);return;}money('Transfers',o.amt);weg();const land=gruppenName(avGruppe(v));
    if(!offen){wechselVormerken(p,o.tid,{preis:o.amt});news(`Einigung: ${p.n} wechselt für ${fmt(o.amt)} zu ${v.name} (${land}), mit dem Transferfenster am ${datumKurz(p.wech.ab)}.`,'good');return;}
    kabineAbgang(p,S.my);vertragEnde(p);insAusland(p,v.id);statTransfer(p,o.amt,S.my,v.id);news(`Verkauft: ${p.n} wechselt für ${fmt(o.amt)} zu ${v.name} (${land}).`,'good');return;} // Verkauf ins Ausland (K32): Der Spieler zieht in den Pool um
  const b=S.teams[o.tid];if(!b||!aktiv(b)){S.offers=S.offers.filter(x=>x!==o);toast(`${b?b.name:'Der Verein'} spielt nicht mehr in den Profiligen, das Angebot ist hinfällig.`);return;}
  if(wv&&!wvbBindet(p)){const W=RTR.weiterverkauf;o.amt=Math.round(o.amt*(1-W.bewertung*W.anteil)/1000)*1000;p.wvb={tid:S.my,anteil:W.anteil,von:b.id};} /* erst nach allen Abbrüchen (K19d) */
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

// ---------- Boni als Teil der Ablöse (K19 §5.2, K19i) ----------
// Beim Kauf von einem deutschen Verein kannst du einen Teil als Bonus anbieten (Formular: bonus in Mio €, bonusArt). Der Verkäufer rechnet ihn mit RTR.boni.wert an
// (kaufRunde und Bieterwettstreit sehen fee + bonusWert). Höchstens maxAnteil der festen Ablöse. Die Einigung merkt sich den Bonus (v.einig.bonus).
// Nach dem Abschluss steht er in S.boni = [{pid, tid Verkäufer, art, b Betrag, s0 Saison, lg0 deine Liga beim Kauf, my dein Verein, st Pflichtspiele für dich beim Kauf}].
// Montags (boniWoche, ohne Zufall): erst die Bedingung, dann der Verfall nach saisons Saisons (ein Aufstieg am Ende der zweiten Saison zählt noch, Prüfung FH3), dann der
// Abgang. Leihe nach außen und die Zweite sind kein Abgang (FH2), ein vereinbarter Wechsel zu dir heißt „noch nicht da“. Er gehört dem Verein (Jobwechsel:
// finanzenJobwechsel leert S.boni wie die Raten). Nur deine Käufe, also nicht im Gleichschritt.
// Wert beim Verkäufer: wert × Betrag, beim Aufstiegsbonus nur, wenn du auf einem der ersten arten.aufstieg.platz Plätze stehst, sonst × arten.aufstieg.sonst (FH3).
const bonusWert=x=>{if(!x||!(x.b>0))return 0;const A=RTR.boni.arten.aufstieg,f=x.art==='aufstieg'&&S.teams&&S.teams[S.my]?(rank(myT().lg,S.my)<=A.platz?1:A.sonst):1;return Math.round(x.b*RTR.boni.wert*f);};
function bonusAusFormular(fee,aus){const d=typeof document!=='undefined'?document:null,e=d&&d.getElementById('bonus'),a=d&&d.getElementById('bonusArt'),B=RTR.boni;
  const b=Math.round((e?+e.value||0:0)*1e6/RM.runden)*RM.runden;if(!(b>0))return null;const art=a&&B.arten[a.value]?a.value:'spiele';
  if(aus)return{fehler:'Boni gibt es nur bei Käufen von deutschen Vereinen.'};
  if(b>fee*B.maxAnteil)return{fehler:`Der Bonus darf höchstens ${Math.round(B.maxAnteil*100)} % der festen Ablöse betragen (${fmt(Math.floor(fee*B.maxAnteil/RM.runden)*RM.runden)}).`};
  if(art==='aufstieg'&&myT().lg===1)return{fehler:'In der 1. Liga gibt es keinen Aufstieg.'};
  if(art==='aufstieg'&&ligaFertig(myT().lg))return{fehler:'Nach dem letzten Spieltag gibt es bis zum Saisonwechsel keinen Aufstiegsbonus.'};return{art,b};} /* FH3: sonst wäre ein schon feststehender Aufstieg sicher */
// Bei dir: im Kader, in der Zweiten (Amateurkader oder, bei Hoffenheim und Stuttgart, die simulierte Zweite in der 3. Liga mit p.zwP, Prüfung FI1) oder von dir verliehen
const bonusBeiDir=p=>{if(!p)return false;const z=zweiteSim();return p.team===S.my||istZweite(p)||(!!p.zwP&&!!z&&p.team===z.id)||(!!p.leihe&&p.leihe.von===S.my);};
function bonusVereinbaren(p,tid,x){if(!x||!(x.b>0))return;(S.boni=S.boni||[]).push({pid:p.id,tid,art:x.art,b:x.b,s0:S.season,lg0:myT().lg,my:S.my,st:vereinsSpiele(p,S.my)});
  news(`Bonus vereinbart: ${fmt(x.b)} an ${tn(tid)}, fällig ${RTR.boni.arten[x.art].name} (binnen ${RTR.boni.saisons} Saisons).`,'');}
const bonusText=x=>`${fmt(x.b)} ${RTR.boni.arten[x.art].name}`;
function boniWoche(){const l=S.boni;if(!l||!l.length)return;const B=RTR.boni,t=myT();
  S.boni=l.filter(x=>{if(!x||x.my!==S.my)return false;const p=PIX.get(x.pid),n=p?p.n:'einen früheren Spieler',da=bonusBeiDir(p),unterwegs=!!p&&!!p.wech&&p.wech.nach===S.my;
    if(da){if(x.st==null)x.st=vereinsSpiele(p,S.my); /* Einträge vor FH2 */
      const ok=x.art==='spiele'?vereinsSpiele(p,S.my)-x.st>=B.arten.spiele.n:x.art==='aufstieg'?t.lg<x.lg0:false;
      if(ok){money('Transfers: Boni',-x.b);const v=S.teams[x.tid];if(v)v.cash+=x.b;news(`Bonus fällig: ${p.n} ${B.arten[x.art].erfuellt}. ${fmt(x.b)} gehen an ${tn(x.tid)}.`,'');return false;}}
    if(S.season-x.s0>=B.saisons){news(`Der Bonus für ${n} an ${tn(x.tid)} ist verfallen, die Bedingung trat nicht ein.`,'');return false;}
    if(!da&&!unterwegs){if(p)news(`${p.n} hat deinen Verein verlassen, der Bonus an ${tn(x.tid)} entfällt.`,'');return false;}
    return true;});}
// Betrag für das Ablösefeld in Mio €, auf 0,01 aufgerundet (Prüfung FH6: abgerundet lag der Vorschlag knapp unter der Forderung)
const mioAuf=x=>(Math.ceil(Math.round(x)/1e4)/100).toFixed(2);

// ---------- Spielertausch (K19 §4.3, K19j) ----------
// Im Transferangebot an einen deutschen Verein kannst du einen eigenen Spieler dazugeben (Formular: tausch). Der Verkäufer rechnet ihn mit RTR.tausch.wert × vwKauf an
// (wie Bonus und Ablöse in kaufRunde und im Bieterwettstreit). Dein Spieler geht nur mit, wenn er will (Wechselwunsch oder ein Verein mit höchstens ansehenMinus weniger
// Ansehen), und nur, wenn der Verkäufer Platz im Kader hat. Die Einigung merkt sich den Tausch (v.einig.tausch). Beim Abschluss wechselt er wie bei einem Verkauf, sofort
// im offenen Fenster, sonst zum nächsten Fensterbeginn, mit neuem Vertrag beim Verkäufer, ohne Ablöse (keine Rekorde, die Fans reagieren wie bei einem Verkauf).
const tauschWert=(q,tid)=>q?Math.round(vwKauf(q,tid)*RTR.tausch.wert/RM.runden)*RM.runden:0;
const tauschMoeglich=q=>!!q&&q.team===S.my&&!q.wech&&!q.leihe&&!istLeihe(q);
// Prüft den gewählten Tauschspieler: null ohne Tausch, {fehler} oder {pid, w Wert beim Verkäufer}
function tauschPruefen(id,from,aus){if(id==null||id==='')return null;const q=PIX.get(+id),T=RTR.tausch;if(!tauschMoeglich(q))return{fehler:'Diesen Spieler kannst du nicht tauschen.'};
  if(aus||!from||from.id>=AV0)return{fehler:'Einen Tausch gibt es nur mit deutschen Vereinen.'};
  if(squad(from.id).length>=RM.kaeufer.kaderMax)return{fehler:`${from.name} hat keinen Platz mehr im Kader.`};
  if(kiTransferSperre(from))return{fehler:`${from.name} hat eine Transfersperre und darf keinen Spieler holen.`}; /* Prüfung FH5 */
  if((q.ww||0)<1&&from.rep<myT().rep-T.ansehenMinus)return{fehler:`${q.n} will nicht zu ${from.name}.`};return{pid:q.id,w:tauschWert(q,from.id)};}
const tauschAusFormular=(from,aus)=>{const e=typeof document!=='undefined'&&document.getElementById('tausch');return tauschPruefen(e?e.value:null,from,aus);};
// Abschluss (aktionen.js offer): dein Spieler q geht zum Verkäufer b
function tauschAbgeben(q,b){if(!tauschMoeglich(q)||!b)return;S.offers=S.offers.filter(x=>x.pid!==q.id);fansAbgang(q,S.my); /* die Fans reagieren bei der Einigung */
  if(!fensterOffen()){wechselVormerken(q,b.id,{ct:riA(RM.neuerVertrag),preis:0});news(`Tausch: ${q.n} geht im Gegenzug zu ${b.name}, mit dem Transferfenster am ${datumKurz(q.wech.ab)}.`,'tr');return;}
  kabineAbgang(q,S.my);vertragEnde(q);q.seit=absTag(S.tag);q.abl=0;q.team=b.id;q.list=0;q.ct=riA(RM.neuerVertrag);news(`Tausch: ${q.n} geht im Gegenzug zu ${b.name}.`,'tr');}

// ---------- Anzeige ----------
function wechselKarte(){const l=(S.wechsel||[]).map(id=>PIX.get(id)).filter(p=>p&&p.wech&&(p.wech.nach===S.my||p.wech.von===S.my));if(!l.length)return'';
  return`<div class="card" style="margin-top:14px"><h3>Vereinbarte Wechsel</h3>${l.map(p=>`<p><a href="#" onclick="openP(${p.id});return false" style="color:var(--chalk)">${esc(p.n)}</a>: ${p.wech.nach===S.my?`kommt von ${esc(vereinName(p))}`:`geht zu ${esc(wechselZiel(p.wech))}`} am ${esc(datumKurz(p.wech.ab))}${p.wech.preis?` (Ablöse ${fmt(p.wech.preis)}, bezahlt)`:''}</p>`).join('')}</div>`;}
