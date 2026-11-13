// Stimmung, Kaderrollen, Wechselwunsch, Kabine, Zusammenhalt, Beziehungen und Kapitän (Konzept K14, U8).
// Alle Zahlen stehen in daten/regeln.js unter REGELN.kabine (Kurzform RKA). Gespräche, Versprechen und Ansprachen: js/gespraeche.js (K15).
// Gilt für alle Vereine gleich. Nur Gesprächswünsche deiner Spieler werden zum Halt, bei Computer-Vereinen führt der Trainer das Gespräch (K15 §7).

const KR_STUFE={talent:1,ergaenzung:1,pokal:2,rotation:2,stamm:3,schluessel:4};
const KR_NAME={schluessel:'Schlüsselspieler',stamm:'Stammspieler',rotation:'Rotation',pokal:'spielt im Pokal',ergaenzung:'Ergänzung',talent:'Talent'};
const KR_LISTE=['schluessel','stamm','rotation','pokal','ergaenzung','talent'];
const KR_AUS_STUFE=['','ergaenzung','rotation','stamm','schluessel'];
const WW_NAME=['zufrieden','grummelt','will reden','will weg','will öffentlich weg'];
const BAUSTEIN_NAME={einsatz:'Einsatzzeit',erfolg:'Erfolg',leistung:'Form',vertrag:'Gehalt und Vertrag',trainer:'Trainer (Rolle, Gespräche)',umfeld:'Umfeld (Kapitän, Urlaub)'};
const BAUSTEIN_GRUND={einsatz:'zu wenig Einsatzzeit',erfolg:'Misserfolg',leistung:'schwache Form',vertrag:'Gehalt und Vertrag',trainer:'Rolle oder Gespräche',umfeld:'Umfeld'};

// Startwert ohne Zufall (aus der Spielernummer), damit das Anlegen keinen Zufallsstrom verschiebt (K02)
const stimmungStart=p=>RKA.start[0]+(Math.imul(p.id,2654435761)>>>0)%(RKA.start[1]-RKA.start[0]+1);
function kabineInit(p){if(p.st==null)p.st=stimmungStart(p);if(p.ww==null)p.ww=0;if(p.ppk==null)p.ppk=ppkStart(p);}
const stimmung=p=>{kabineInit(p);return p.st;};
// Sofortige Änderung (K14 §4.2): gedeckelt auf ±10 je Ereignis, der Rest wirkt über den Baustein „Trainer“, wenn rest gesetzt ist
function stimmungAendern(p,v,rest){kabineInit(p);const M=RKA.sofortMax,s=clamp(v,-M,M);p.st=clamp(p.st+s,0,100);if(rest&&v!==s)trainerWirkung(p,v-s);}
const trainerWirkung=(p,v)=>{const Z=RKA.ziel.trainer;p.tb=clamp((p.tb||0)+v,Z[0],Z[1]);};
const zusammenhalt=t=>t.zh==null?RKA.zusammenhalt.start:t.zh;
function zusammenhaltAendern(t,v){if(!t)return;t.zh=clamp(zusammenhalt(t)+v,0,100);}

// ---------- Kaderrollen (K14 §3.1, §7) ----------
// Nach Rang in der Positionsgruppe: so viele Stammplätze, wie die Grundordnung Plätze hat, dazu halb so viele Rotationsplätze (Torhüter: keine).
// Die drei Stärksten unter den Stammspielern sind Schlüsselspieler, junge Ergänzungsspieler Talente.
// krA: Vorschlag des Co-Trainers (so verteilen auch die Computer-Trainer). krS: eigene Einschätzung als Stufe 1–4, Ehrgeizige sehen sich eine Stufe höher.
function rollenBerechnen(tid,kader){const t=S.teams[tid],sq=kader||squad(tid);if(!t||!sq.length)return;const need={},xi=new Set(elfOhneAusfaelle(t,sq)),ohne=sq.filter(p=>p.krA&&p.ea!=null&&erwartungEinsatz(p)===0);
  slotsVerein(t).forEach(pos=>{const g=posGruppe(pos);need[g]=(need[g]||0)+1;});const stamm=sq.filter(p=>xi.has(p.id));stamm.forEach(p=>p.krA='stamm');
  ['TW','AB','MF','ST'].forEach(g=>{let rot=g==='TW'?0:Math.ceil((need[g]||0)*RKA.rotationAnteil);
    sq.filter(p=>p.pos===g&&!xi.has(p.id)).sort((a,b)=>b.str-a.str).forEach(p=>{p.krA=rot-->0?'rotation':'ergaenzung';});});
  stamm.sort((a,b)=>b.str-a.str).slice(0,RKA.schluesselAnzahl).forEach(p=>p.krA='schluessel');
  const pokal=imPokal(tid);
  sq.forEach(p=>{if(p.krA==='ergaenzung'&&p.age<=RKA.talentBis)p.krA='talent';if(p.krP&&stammA(p))delete p.krP;
    // krP: Anspruch aus Leistung (Joker, Chance genutzt), hebt die Einschätzung um eine Stufe, aber nicht über Stammspieler
    p.krS=Math.min(p.krP?3:4,KR_STUFE[p.krA]+(p.ch&&p.ch.ehr>=RKA.ehrgeizigAb?1:0)+(p.krP||0));if(p.kr&&(!KR_STUFE[p.kr]||tid!==S.my))delete p.kr;
    if(p.kr==='pokal'&&!pokal){delete p.kr;p.ea=erwartungEinsatz(p);if(S.phase==='play')news(`Der Pokal ist für euch vorbei: Die Rolle „${KR_NAME.pokal}“ von ${p.n} endet.`);}});
  // Wer bisher nichts erwartet hat (unerfahren, Nummer 2 im Tor) und jetzt eine Erwartung hat, beginnt bei ihr und nicht im Minus
  ohne.forEach(p=>{const e=erwartungEinsatz(p);if(e>0)p.ea=Math.max(p.ea,e);});}
// Beste Elf, wenn alle fit wären (wie bestXI in engine.js, aber ohne Ausfälle): wer darin steht, ist Stammspieler
function elfOhneAusfaelle(t,sq){const sl=slotsVerein(t),used=new Set(),xi=Array(sl.length).fill(null);
  const pass=ok=>sl.forEach((pos,i)=>{if(xi[i]!=null)return;let best=null,bv=-1;for(const p of sq){if(used.has(p.id)||!ok(p,pos))continue;const v=eff(p,pos,100);if(v>bv){bv=v;best=p;}}if(best){xi[i]=best.id;used.add(best.id);}});
  pass((p,pos)=>(p.fp||STD_POS[p.pos])===pos);pass((p,pos)=>posGruppe(p.fp||STD_POS[p.pos])===posGruppe(pos));return fillXI(sl,sq,xi,used).filter(x=>x!=null);}
// Rolle, die der Trainer vergeben hat: bei dir die gewählte (sonst der Vorschlag des Co-Trainers), bei Computer-Vereinen der Vorschlag
const kaderRolle=p=>(p.team===S.my&&p.kr&&!autoB('kaderrollen')&&p.kr)||p.krA||'ergaenzung';
const krStufe=p=>KR_STUFE[kaderRolle(p)]||1;
// krOk: Ein Altstar hat seine Rolle im Gespräch angenommen (K14 §12), dann sieht er sich so, wie du ihn einstufst
const einschaetzung=p=>p.krOk&&p.krOk===p.kr&&p.team===S.my?krStufe(p):p.krS||krStufe(p);
// Erwartete Einsatzzeit: deine Rolle, wenn sie mindestens seiner Einschätzung entspricht, sonst die Mitte der beiden Anteile
// Keine Erwartung haben Unerfahrene und die Nummer 2 im Tor (K14 §12). Die Rolle „spielt im Pokal“ erwartet fast alle Pokalspiele.
function erwartungEinsatz(p){const k=kaderRolle(p);if(k==='pokal')return RKA.rollen.pokal;if(unerfahren(p)||ersatzTorwart(p))return 0;
  const R=krStufe(p),E=einschaetzung(p),a=RKA.rollen[R===1&&k==='talent'?'talent':KR_AUS_STUFE[R]];return R>=E?a:(a+RKA.rollen[KR_AUS_STUFE[E]])/2;}

// ---------- Einsatzzeit und Bankzeit nach Grund (K14 §12, U8d), nach jedem Pflichtspiel ----------
// Der Grund zählt, nicht nur die Minuten: Je Spiel und Spieler steht fest, warum er nicht gespielt hat. Davon hängt ab, ob das Spiel in den gleitenden Schnitt
// der Einsatzzeit eingeht (p.ea) und was es sofort an Stimmung bringt oder kostet. p.bg merkt den Grund des letzten Spiels für die Anzeige.
const BANK_GRUND={rotation:'Rotation, geschont (zählt nicht)',joker:'Joker mit Wirkung (zählt als erfüllt)',rivale:'sein Konkurrent spielt',unerfahren:'unerfahren, erwartet noch nichts',
  tw2:'Nummer 2 im Tor, erwartet keine Einsätze',pokal:'spielt im Pokal, Liga zählt nicht',aufbau:'Aufbau nach Verletzung (zählt nicht)',form:'Formkrise, er sieht die Bank ein',
  tribuene:'nicht im Spieltagskader',frueh:'früh ausgewechselt',spaet:'erst in der Nachspielzeit eingewechselt',ww:'will weg, versteht die Bank',sperre:'erstes Spiel nach der Sperre (zählt nicht)',mentor:'betreut als Pate ein Talent, nimmt die Bank hin',bank:'Bank ohne besonderen Grund'};
const feinPos=p=>p.fp||STD_POS[p.pos];
const stammA=p=>KR_STUFE[p.krA]>=3; // stünde in der besten Elf ohne Ausfälle
// Profi-Pflichtspiele über die Karriere. Startwert ohne Zufall aus Alter und Spielernummer (bis 18 Jahre: null)
const ppkStart=p=>p.age<=18?0:(p.age-18)*(5+(Math.imul(p.id,40503)>>>0)%20);
const unerfahren=p=>krStufe(p)<=1&&(p.ppk==null?ppkStart(p):p.ppk)<RKA.bank.unerfahren.spiele;
const ersatzTorwart=p=>p.pos==='TW'&&!stammA(p)&&krStufe(p)<3&&kaderRolle(p)!=='pokal';
const empfindlich=p=>hatEig(p,'diva')||hatEig(p,'nervenschwach');
const formkrise=p=>{const F=RKA.bank.formkrise,l=p.n5||[];return l.length>=F.noten&&l.reduce((a,b)=>a+b,0)/l.length>=F.note;};
const imPokal=tid=>!!(S.cup&&S.cup.alive&&S.cup.alive.includes(tid));
// Rivalen-Zähler als Abzug: nach der Schonfrist je Spiel mehr, bis −10. Diven und Nervenschwache ohne Schonfrist. Kommt zur Spanne des Bausteins „Einsatz“ dazu.
function rivalenAbzug(p){if(!p.rz)return 0;const RV=RKA.bank.rivale,frist=empfindlich(p)?0:RV.schonfrist;return p.rz>frist?Math.min(RV.max,(p.rz-frist)*RV.je):0;}
// Sein Konkurrent in der Startelf: gleiche Feinposition und höchstens 3 Punkte Abstand, oder ein erklärter Rivale (S.bz)
function platzRivale(p,xi){const fp=feinPos(p),ab=RKA.bank.rivale.staerke;for(const id of xi){const q=PIX.get(id);if(!q||q===p)continue;if(feinPos(q)===fp&&Math.abs(q.str-p.str)<=ab)return q;const b=beziehung(p,q);if(b&&b[2]==='R')return q;}return null;}
function englischeWoche(tid,d){const a=spielAbstand(d).get(tid),n=RKA.bank.englischTage;return !!a&&((a.last!=null&&d-a.last<=n)||(a.next!=null&&a.next-d<=n));}
// Mannschaftserfolg: Serie der letzten fünf Spiele gegen die erwarteten Punkte. Siegesserie: Abwertung halb, Krise: ×1,5
function erfolgFaktor(t){const E=RKA.bank.erfolg,l=(t.erw||[]).slice(-5);if(l.length<E.ab)return 1;return clamp(1-l.reduce((a,x)=>a+x[0]-x[1],0)*E.je,E.min,E.max);}
// Bedeutungslose Spiele: In den letzten fünf Spieltagen kann der Verein keine Grenze der Tabelle mehr überschreiten (Titel, Europa, Relegation, Abstieg, eigenes Ziel)
function saisonEntschieden(t,tab){const E=RKA.bank.bedeutungslos,fx=S.fx&&S.fx[t.lg],i=tab.findIndex(r=>r.id===t.id);if(!fx||i<0)return false;
  const rest=fx.length-tab[i].sp;if(rest<1||rest>E.spieltage)return false;
  for(const g of new Set([...(E.grenzen[t.lg]||[]),(t.id===S.my?S.target:t.expPos)||0])){if(!g||g>=tab.length)continue;if(i<g?tab[i].p-tab[g].p<=rest*3:tab[g-1].p-tab[i].p<=rest*3)return false;}return true;}
// Vor dem Nachlauf der Spiele: wer verletzt oder gesperrt fehlte (danach sitzen die Sperren ab, und neue Verletzungen kommen dazu). 1 = nur gesperrt
function einsatzVorher(list){list.forEach(r=>{const wb=wbVon(r);r.na=[0,1].map(s=>{const tid=s?r.a:r.h;if(tid>=1000||!S.teams[tid])return[];
  return mitWettbewerb(wb,()=>squad(tid).filter(p=>!avail(p)).map(p=>[p.id,p.inj>0?0:1]));});});}
// Nach den Noten (applyMatch): Einsatzzeit und Folgen je Spieler, dazu Startelf, Siege und neue Stammspieler für den Zusammenhalt
function einsatzBuchen(list,d=S.tag){const tabs={},heute=absTag(d);
  list.forEach(r=>{const pokal=wbVon(r)==='pokal',ws=r.ws||[],tore=new Map();(r.ev||[]).forEach(e=>{if(e.t==='G')tore.set(e.p,(tore.get(e.p)||0)+1);});
    [0,1].forEach(s=>{const tid=s?r.a:r.h,t=S.teams[tid];if(tid>=1000||!t)return;const sq=squad(tid),xi=new Set(r.xi[s]||[]);
      const c={r,t,sq,xi,pokal,heute,tore,mein:tid===S.my,min:new Map(r.xpo[s].map(x=>[x[0],x[3]==null?90:x[3]])),kader:r.bk&&r.bk[s]?new Set([...xi,...r.bk[s]]):null,
        fehlt:new Map((r.na&&r.na[s])||[]),rein:new Map(ws.filter(w=>w[0]===s).map(w=>[w[3],w[1]])),raus:new Map(ws.filter(w=>w[0]===s).map(w=>[w[2],w[1]])),verl:new Set((r.inj||[]).map(x=>x.id)),
        englisch:S.plan?englischeWoche(tid,d):false,rotAn:t.rotAn&&heute<=t.rotAn.bis?t.rotAn.f:0,egal:false};
      if(r.lg&&S.res&&S.res[r.lg])c.egal=saisonEntschieden(t,tabs[r.lg]||(tabs[r.lg]=table(r.lg)));
      sq.forEach(p=>bankFall(p,c));
      // Wer wie oft in Folge im Tor stand (Torwart-Duell)
      const tw=(r.xi[s]||[]).map(id=>PIX.get(id)).find(p=>p&&p.pos==='TW');if(tw)t.twS=t.twS&&t.twS[0]===tw.id?[tw.id,t.twS[1]+1]:[tw.id,1];
      t.xiW=(r.xi[s]||[]).slice();if(winner(r)===tid&&r.hg!==r.ag||(r.pen&&winner(r)===tid))t.siegeW=(t.siegeW||0)+1;
      // Neue Stammspieler (K14 §5.6): ein Neuzugang in der Startelf kostet einmal Zusammenhalt
      (r.xi[s]||[]).forEach(id=>{const p=PIX.get(id);if(p&&p.zhNeu===tid){delete p.zhNeu;zusammenhaltAendern(t,RKA.zusammenhalt.neuer);}});});});}
// Ein Spieler in einem Pflichtspiel seines Vereins. c: Spiel, Startelf, Spieltagskader, Minuten, Wechsel, Ausfälle, englische Woche, angekündigte Rotation
function bankFall(p,c){const B=RKA.bank,t=c.t,gespielt=c.min.has(p.id),m=c.min.get(p.id)||0;kabineInit(p);if(p.ea==null)p.ea=erwartungEinsatz(p);
  if(p.rue&&c.heute>p.rue)delete p.rue;
  if(!gespielt&&c.fehlt.has(p.id)){if(c.fehlt.get(p.id))p.nsp=1;delete p.bg;return;} // verletzt oder gesperrt: zählt nicht
  const e=erwartungEinsatz(p),unerf=unerfahren(p),etabliert=!unerf&&krStufe(p)>=2,diva=hatEig(p,'diva')?B.diva:1,rolle=kaderRolle(p),note=c.r.nt&&c.r.nt[p.id]!=null?c.r.nt[p.id]:null;
  let anteil=Math.min(1,m/90),tempo=rolle==='pokal'&&c.pokal?B.pokalTempo:RKA.einsatzTempo,zaehlt=true,grund='';
  if(gespielt){p.ppk=(p.ppk||0)+1;if(note!=null)p.n5=[...(p.n5||[]),note].slice(-5);delete p.nsp;
    if(p.ppk===1)stimmungAendern(p,B.unerfahren.debuet);else if(unerf&&m>=B.unerfahren.einsatzMin)stimmungAendern(p,B.unerfahren.einsatz);
    if(c.xi.has(p.id)){p.bnk=0;p.rz=0;const ab=c.raus.get(p.id);
      // früh ausgewechselt ohne Verletzung oder Platzverweis: Bloßstellung
      if(ab!=null&&ab<B.frueh.vor&&!c.verl.has(p.id)&&!(c.r.off||[]).includes(p.id)){grund='frueh';stimmungAendern(p,B.frueh.stimmung*(diva>1||hatEig(p,'fuehrungsspieler')?B.diva:1));if(hatEig(p,'nervenschwach'))svAendern(p,B.frueh.sv);}
      vertretung(p,c,note);}
    else{const ab=c.rein.get(p.id),stark=(c.tore.get(p.id)||0)>0||(note!=null&&note<=B.joker.note);p.bnk=(p.bnk||0)+1;
      if(m<B.joker.kurz)p.jk=[...(p.jk||[]),stark?1:0].slice(-B.joker.von);
      if(stark){grund='joker';stimmungAendern(p,B.joker.stimmung);anteil=Math.max(anteil,e);jokerAnspruch(p,c);}
      else if(ab!=null&&ab>B.spaet.nach&&m<=B.spaet.minuten){grund='spaet';const v=unerf?B.spaet.unerfahren:etabliert?B.spaet.etabliert:0;if(v)stimmungAendern(p,v);}
      if(!stark&&m<B.rivale.haltenAb&&p.rz&&platzRivale(p,c.xi))p.rz++;}
    if(rolle==='pokal'&&!c.pokal&&anteil<p.ea)zaehlt=false;}
  else{p.bnk=(p.bnk||0)+1;const imKader=!c.kader||c.kader.has(p.id),riv=platzRivale(p,c.xi),entschuldigt=g=>{grund=g;zaehlt=false;};
    if(p.ww>=3)entschuldigt('ww');
    else if(p.nsp){entschuldigt('sperre');if(hatEig(p,'hitzkopf'))stimmungAendern(p,B.sperre.hitzkopf);}
    else if(p.rue&&!(diva>1&&riv))entschuldigt('aufbau');
    else if(rolle==='pokal'&&!c.pokal)entschuldigt('pokal');
    else if(istPate(p))entschuldigt('mentor');
    else if(ersatzTorwart(p))grund='tw2';
    else if(unerf){grund='unerfahren';if(imKader)stimmungAendern(p,B.unerfahren.kader);}
    else if(stammA(p)&&(c.rotAn>0||p.fit<B.frischeUnter||c.englisch)&&p.bnk<=(c.rotAn>0?B.rotationAngekuendigt:B.rotationReihe)){entschuldigt('rotation');if(c.rotAn>0)stimmungAendern(p,B.angekuendigt*c.rotAn);}
    else{ // der Bankplatz zählt
      if(riv){grund='rivale';p.rz=(p.rz||0)+1;
        // Schonfrist: Kämpfer, Vorbildprofis und Mentoren beißen sich rein oder nehmen es hin, Diven und Nervenschwache trifft es sofort
        if(p.rz<=B.rivale.schonfrist){if(hatEig(p,'kaempfer')||hatEig(p,'vorbildprofi')||hatEig(p,'mentor'))zaehlt=false;else if(empfindlich(p)){stimmungAendern(p,B.rivale.sofort*diva);if(hatEig(p,'nervenschwach'))svAendern(p,B.rivale.sv);}}}
      else{p.rz=0;if(formkrise(p)){grund='form';if(diva===1)tempo*=B.formkrise.faktor;if(hatEig(p,'nervenschwach'))svAendern(p,B.formkrise.sv);}else grund='bank';}
      if(!imKader&&etabliert){stimmungAendern(p,B.tribuene*diva);if(grund==='bank')grund='tribuene';}
      // Kapitän, Führungsspieler oder Altstar (ab 31 mit vielen Einsätzen) fit auf der Bank: seine Freunde murren
      if(t.kap===p.id||hatEig(p,'fuehrungsspieler')||(p.age>=B.altstar.ab&&(p.ppk||0)>=B.altstar.spiele))freundeVon(p).forEach(q=>{if(q.team===p.team)stimmungAendern(q,B.fuehrer.freunde);});}
    delete p.nsp;}
  // Bedeutungslose Spiele: Reservisten und Talente erwarten Chancen
  if(c.egal&&!stammA(p)&&krStufe(p)<=2&&!['ww','aufbau','sperre'].includes(grund))stimmungAendern(p,m>=B.bedeutungslos.minuten?B.bedeutungslos.plus:B.bedeutungslos.minus);
  if(zaehlt)p.ea=p.ea*(1-tempo)+tempo*anteil;
  // Wer bisher nichts erwartet hat und es jetzt tut (zehntes Profispiel), beginnt bei seiner Erwartung und nicht im Minus
  if(e===0){const e1=erwartungEinsatz(p);if(e1>0)p.ea=Math.max(p.ea,e1);}
  if(grund)p.bg=grund;else delete p.bg;}
// Anspruch aus Leistung: Die Einschätzung steigt um eine Stufe (höchstens Stammspieler), bis er Stammspieler ist oder die Saison endet
function anspruch(p){p.krP=1;p.krS=Math.min(3,(p.krS||1)+1);return KR_NAME[KR_AUS_STUFE[p.krS]];}
// Joker (K14 §12): Ehrgeizige fordern nach drei starken Kurzeinsätzen in fünf mehr („Ich liefere doch!“)
function jokerAnspruch(p,c){const J=RKA.bank.joker;if(p.krP||stammA(p)||!(p.ch&&p.ch.ehr>=RKA.ehrgeizigAb)||(p.jk||[]).reduce((a,b)=>a+b,0)<J.starke)return;
  const als=anspruch(p);p.jk=[];if(c.mein)news(`${p.n} hat als Joker wiederholt geliefert und fordert mehr: Er sieht sich als ${als}.`);}
// Chance genutzt (K14 §12): Er vertritt einen verletzten oder gesperrten Stammspieler seiner Position mit guten Noten. Dann sieht er sich eine Stufe höher, und beide werden Rivalen.
function vertretung(p,c,note){const C=RKA.bank.chance;if(stammA(p)||note==null||p.krP)return;const fp=feinPos(p),weg=c.sq.filter(q=>c.fehlt.has(q.id)&&stammA(q)),wen=weg.find(q=>feinPos(q)===fp)||weg.find(q=>q.pos===p.pos);if(!wen)return;
  const v=p.vtr&&p.vtr[0]===wen.id?p.vtr:[wen.id,0,0];v[1]++;v[2]+=note;p.vtr=v;if(v[1]<C.spiele||v[2]/v[1]>C.note)return;
  const als=anspruch(p);delete p.vtr;if(!beziehung(p,wen)&&Math.abs(p.str-wen.str)<=RKA.beziehungen.rivaleEnde){S.bz=S.bz||[];S.bz.push([p.id,wen.id,'R',1]);}
  if(c.mein)news(`${p.n} hat seine Chance genutzt (Notenschnitt ${(v[2]/v[1]).toFixed(1).replace('.',',')} als Vertreter von ${wen.n}). Er sieht sich als ${als}. Kehrt ${wen.n} zurück, kämpfen beide um den Platz.`);}
// Torwart-Duell (K14 §12): Nummer 2 höchstens zwei Punkte hinter der Nummer 1. Offen, bis du eine Rolle vergibst oder derselbe fünf Spiele in Folge im Tor steht.
function torwartDuell(t,sq){const T=RKA.bank.torwart,tw=(sq||squad(t.id)).filter(p=>p.pos==='TW').sort((a,b)=>(stammA(b)-stammA(a))||b.str-a.str);if(tw.length<2||tw[0].str-tw[1].str>T.duell)return null;
  if(t.twS&&t.twS[1]>=T.klarNach)return null;if(t.id===S.my&&!autoB('kaderrollen')&&(tw[0].kr||tw[1].kr))return null;return[tw[0],tw[1]];}
// ---------- Zielstimmung (K14 §5.1) ----------
// Ruf-Gefälle (K14 §5.2): Ruf des Trainers bis K28 aus dem Ansehen des Vereins und den Trainerjahren, Ruf des Spielers aus der Stärke
function trainerRuf(){const T=RKA.rufGefaelle.trainer;return Math.min(T[3],T[0]+T[1]*myT().rep+T[2]*(S.hist||[]).length);}
const rufGefaelle=p=>p.team===S.my&&p.str-trainerRuf()>=RKA.rufGefaelle.ab;
// Index der Beziehungen je Spieler, neu aufgebaut, wenn sich die Liste ändert (BZV zählt Änderungen ohne neue Länge)
let BZI=null,BZV=0;
function bzIdx(){const b=S.bz||[];if(BZI&&BZI.ref===b&&BZI.n===b.length&&BZI.v===BZV)return BZI.m;const m=new Map();
  b.forEach(e=>[e[0],e[1]].forEach(id=>{if(!m.has(id))m.set(id,[]);m.get(id).push(e);}));BZI={ref:b,n:b.length,v:BZV,m};return m;}
const bzMit=(p,art)=>(bzIdx().get(p.id)||[]).filter(b=>b[2]===art).map(b=>PIX.get(b[0]===p.id?b[1]:b[0])).filter(Boolean);
const rivalen=p=>bzMit(p,'R'),freundeVon=p=>bzMit(p,'F');
const beziehung=(p,q)=>(bzIdx().get(p.id)||[]).find(b=>b[0]===q.id||b[1]===q.id);
// Erfolg je Verein, einmal pro Woche: Tabellenplatz gegenüber der Erwartung und Serie gegenüber den erwarteten Punkten. Ohne Tabelle (Sommer) verblasst der alte Wert.
function erfolgBerechnen(t){const E=RKA.erfolg,lg=t.lg,sp=(S.res[lg]||[]).filter(r=>r[0]===t.id||r[1]===t.id).length;
  if(S.phase!=='play'||sp<E.abSpiele||!t.expPos){t.erf=(t.erf||0)*E.zerfall;return;}
  const n=S.teams.filter(x=>x.lg===lg&&aktiv(x)).length||18,pl=clamp((t.expPos-rank(lg,t.id))/n*E.platz,-E.platzMax,E.platzMax);
  const se=(t.erw||[]).slice(-5).reduce((a,x)=>a+x[0]-x[1],0);t.erf=pl+clamp(se*E.serie,-E.serieMax,E.serieMax);}
function bausteine(p){const Z=RKA.ziel,t=S.teams[p.team]||{},B={},E=RKA.einsatz;
  const e=erwartungEinsatz(p),a=p.ea==null?e:p.ea;let x=(a-e)*E.skala;
  if(x<0){x*=E.ehrgeiz[0]+E.ehrgeiz[1]*(p.ch?p.ch.ehr:10);if(rufGefaelle(p))x*=RKA.rufGefaelle.einsatz;x*=erfolgFaktor(t);}
  B.einsatz=clamp(x,Z.einsatz[0],Z.einsatz[1])-rivalenAbzug(p);
  B.erfolg=clamp(t.erf||0,Z.erfolg[0],Z.erfolg[1]);
  B.leistung=clamp((p.form-RP.form.mitte)*RKA.leistung,Z.leistung[0],Z.leistung[1]);
  const V=RKA.vertrag,q=p.sal/salaryFor(p.str);let v=q<V.unter?-V.minus*Math.min(1,(V.unter-q)/0.4):q>V.ueber?V.plus*Math.min(1,(q-V.ueber)/0.35):0;
  if(p.ct<=1&&einschaetzung(p)>=3)v+=V.auslaufend;if(v<0&&hatEig(p,'soeldner'))v*=V.soeldner;B.vertrag=clamp(v,Math.max(Z.vertrag[0],V.max),Z.vertrag[1]);
  const Ro=RKA.rolle,R=krStufe(p),Sx=einschaetzung(p);let tr=p.tb||0;
  if(p.team===S.my&&p.kr&&!autoB('kaderrollen')){if(R<Sx)tr+=Ro.zuNiedrig*(Sx-R)*(hatEig(p,'diva')?Ro.diva:1);else if(R>Sx)tr+=Math.min(Ro.hoeherMax,Ro.hoeher*(R-Sx));} // nur eine Rolle, die du selbst vergeben hast
  B.trainer=clamp(tr,Z.trainer[0],Z.trainer[1]);
  B.umfeld=clamp((p.ubW>0?p.ub||0:0)+(t.kap!==p.id?t.kapB||0:0),Z.umfeld[0],Z.umfeld[1]);
  return B;}
const zielStimmung=p=>{const B=bausteine(p);return clamp(RKA.ziel.basis+Object.values(B).reduce((a,b)=>a+b,0),0,100);};
// Hauptgrund für schlechte Stimmung: der Baustein, der am meisten abzieht
function hauptgrund(p){const B=bausteine(p),[k,v]=Object.entries(B).sort((a,b)=>a[1]-b[1])[0];return v<=-3?k:null;}

// ---------- Folgen (K14 §5.3) ----------
// Leistung: im Zustandsfaktor (K03 §5.8), unter 20 bis −3 %, über 85 bis +2 %
function stimmungFaktor(p){const F=RKA.folgen.leistung,s=p.st;if(s==null)return 1;return s<F.unter?1-F.minus*(F.unter-s)/F.unter:s>F.ueber?1+F.plus*(s-F.ueber)/(100-F.ueber):1;}
// Lernen: unter 30 lernt er 30 % langsamer, Rivalen lernen 5 % schneller (Konkurrenz belebt)
// Kämpfer und Vorbildprofis beißen sich in den ersten drei Spielen hinter dem Konkurrenten rein: ×1,1 (K14 §12)
const lernStimmung=p=>(p.st!=null&&p.st<RKA.folgen.lernenUnter?RKA.folgen.lernen:1)*(rivalen(p).length?RKA.beziehungen.lernen:1)*(p.rz>=1&&p.rz<=RKA.bank.rivale.schonfrist&&(hatEig(p,'kaempfer')||hatEig(p,'vorbildprofi'))?RKA.bank.rivale.lernen:1);
// Vertrag: unter 40 nur zu deutlich höheren Bedingungen, unter 25 gar nicht (K21 baut das später aus)
const verlaengertNicht=p=>p.st!=null&&p.st<RKA.folgen.vertragUnter[1];
const vertragsAufschlag=p=>p.st!=null&&p.st<RKA.folgen.vertragUnter[0]?1+RKA.folgen.vertragAufschlag:1;
// Zusammenhalt im Spiel (K14 §5.6): Teamwerte × (0,97 + 0,0006 × Zusammenhalt), dazu die Endspiel-Rede für ein Spiel (K15 §5.4)
function kabineFaktor(tid){const t=S.teams[tid];if(tid>=1000||!t)return{f:1,end:0};const W=RKA.zusammenhalt.wirkung,e=t.endspiel&&t.endspiel.tag===S.tag&&t.endspiel.s===S.season?t.endspiel.f:0;
  return{f:W[0]+W[1]*zusammenhalt(t),end:e};}

// ---------- Mannschaftsstimmung und Kapitän (K14 §5.5, §5.8) ----------
function mannschaftsStimmung(tid){const t=S.teams[tid],K=RKA.kapitaen;let s=0,w=0;squad(tid).forEach(p=>{const g=p.id===t.kap?K.gewicht:hatEig(p,'fuehrungsspieler')?K.fuehrer:1;s+=stimmung(p)*g;w+=g;});return w?s/w:RKA.ziel.basis;}
// Der Co-Trainer (und jeder Computer-Trainer) wählt unter den Stammspielern nach Führung, Vereinsjahren und Stärke
function kapitaenWahl(t,kader){const sq=kader||squad(t.id),l=sq.filter(p=>KR_STUFE[p.krA]>=3);let best=null,bv=-1;
  (l.length?l:sq).forEach(p=>{const v=(p.ch?p.ch.fue:10)+Math.min(p.wiv||0,260)/52*2+p.str/20;if(v>bv){bv=v;best=p;}});return best?best.id:null;}
function kapitaenPruefen(t,kader){const K=RKA.kapitaen;let k=PIX.get(t.kap);if(!k||k.team!==t.id){t.kap=kapitaenWahl(t,kader);t.kapAuto=1;k=PIX.get(t.kap);}
  t.kapB=k&&k.ch&&k.ch.fue>=K.fuehrungAb?(k.wiv>=K.wochen?K.bonus[1]:K.bonus[0]):0;}

// ---------- Beziehungen (K14 §5.7, Daten nach K03 §3.6: S.bz = [Spieler A, Spieler B, Art F/R, Stärke 1–3]) ----------
function beziehungenWoche(aktive,kader){const B=RKA.beziehungen;
  S.bz=(S.bz||[]).filter(([a,b,art])=>{const p=PIX.get(a),q=PIX.get(b);return p&&q&&p.team===q.team&&p.team>=0&&!(art==='R'&&Math.abs(p.str-q.str)>B.rivaleEnde);});
  aktive.forEach(t=>{const sq=kader.get(t.id)||[],mein=t.id===S.my;if(sq.length<2)return;
    if(R()<B.freundChance){const p=pick(sq),l=sq.filter(q=>q!==p&&Math.abs(q.age-p.age)<=B.freundAlter&&!beziehung(p,q)&&freundeVon(q).length<B.maxFreunde);
      if(l.length&&freundeVon(p).length<B.maxFreunde)S.bz.push([p.id,pick(l).id,'F',1]);}
    if(R()<B.rivaleChance){const l=sq.filter(p=>p.ch&&p.ch.ehr>=B.rivaleEhrgeiz&&KR_STUFE[p.krA]>=2),p=l.length?pick(l):null,
      q=p&&l.find(x=>x!==p&&(x.fp||x.pos)===(p.fp||p.pos)&&Math.abs(x.str-p.str)<=B.rivaleStaerke&&!beziehung(p,x));
      if(q){S.bz.push([p.id,q.id,'R',1]);if(mein)news(`Kabine: ${p.n} und ${q.n} kämpfen um denselben Platz. Konkurrenz belebt, aber wer verliert, ist doppelt enttäuscht.`);}}
    sq.forEach(p=>{if(!hatEig(p,'hitzkopf')||R()>=B.rangelei)return;const q=pick(sq.filter(x=>x!==p));if(!q)return;const bz=beziehung(p,q);
      if(bz&&bz[2]==='F'){S.bz.splice(S.bz.indexOf(bz),1);BZV++;}if(!bz||bz[2]==='F')S.bz.push([p.id,q.id,'R',1]);
      zusammenhaltAendern(t,RKA.zusammenhalt.streit);if(mein)news(`Rangelei im Training: ${p.n} und ${q.n} sind aneinandergeraten. Der Zusammenhalt leidet.`,'bad');});});}
// Ein Spieler verlässt den Verein (Verkauf, Freistellung): Freunde verlieren Stimmung, seine Beziehungen enden
function kabineAbgang(p,tid){if(!p)return;freundeVon(p).filter(q=>q.team===tid).forEach(q=>{stimmungAendern(q,RKA.beziehungen.verkauf);if(tid===S.my)news(`${q.n} ist traurig über den Abschied seines Freundes ${p.n}.`,'bad');});
  S.bz=(S.bz||[]).filter(b=>b[0]!==p.id&&b[1]!==p.id);S.gw=(S.gw||[]).filter(g=>g.pid!==p.id);delete p.kr;delete p.zhNeu;}
// Grüppchen: Freunde, die zusammenhängen (mindestens drei), mit schlechter Stimmung im Schnitt
function grueppchen(tid,kader){const G=RKA.gruppe,ids=new Set((kader||squad(tid)).map(p=>p.id)),adj=new Map();
  (S.bz||[]).forEach(([a,b,art])=>{if(art!=='F'||!ids.has(a)||!ids.has(b))return;[[a,b],[b,a]].forEach(([x,y])=>{if(!adj.has(x))adj.set(x,[]);adj.get(x).push(y);});});
  const seen=new Set(),out=[];adj.forEach((_,id)=>{if(seen.has(id))return;const comp=[],stack=[id];seen.add(id);
    while(stack.length){const x=stack.pop();comp.push(x);(adj.get(x)||[]).forEach(y=>{if(!seen.has(y)){seen.add(y);stack.push(y);}});}
    if(comp.length>=G.min){const l=comp.map(i=>PIX.get(i)),m=l.reduce((s,p)=>s+stimmung(p),0)/l.length;if(m<G.unter)out.push(l);}});return out;}

// ---------- Wechselwunsch (K14 §5.4) ----------
function wwStufe3(p){const t=S.teams[p.team];p.ww=3;p.wws=0;S.gw=(S.gw||[]).filter(g=>g.pid!==p.id);if(t&&p.ww3s!==S.season){p.ww3s=S.season;t.kst=Object.assign({ww3:0},t.kst||{});t.kst.ww3++;} // je Spieler und Saison einmal gezählt
  if(p.team===S.my)news(`${p.n} hat offiziell um seine Freigabe gebeten. Andere Vereine wissen es, sein Marktwert sinkt um 10 %.`,'bad');
  if(stabMacht(p.team,'transfers')){p.list=1;p.ask=value(p);}}
function wechselwunschWoche(p){const W=RKA.wechsel,mein=p.team===S.my;
  p.wu=p.st<W.grummeln[0]?(p.wu||0)+1:0;p.wv=p.st<W.gespraech[0]?(p.wv||0)+1:0;p.wws=(p.wws||0)+1;
  if(p.ww>0&&p.st>W.zurueckAb){p.ww--;p.wws=0;if(mein&&p.ww===0)news(`${p.n} ist wieder zufrieden.`,'good');if(p.ww<2)S.gw=(S.gw||[]).filter(g=>g.pid!==p.id);return;}
  if(p.ww===0&&p.wu>=W.grummeln[1]){p.ww=1;p.wws=0;}
  else if(p.ww===1&&p.wv>=W.gespraech[1]){p.ww=2;p.wws=0;if(mein&&!autoB('gespraeche'))gespraechswunsch(p);else{kiGespraech(p);if(mein)stabMeldung(`Der Co-Trainer hat mit ${p.n} gesprochen, der unzufrieden war. ${p.ww===1?'Das Gespräch hat geholfen.':'Es hat nichts gebracht.'}`,p.ww===1?'':'bad');}}
  else if(p.ww===2&&p.wws>=W.offiziell&&p.st<W.gespraech[0]){if(mein)S.gw=(S.gw||[]).filter(g=>g.pid!==p.id);wwStufe3(p);}
  else if(p.ww===3&&p.wws>=W.oeffentlich&&R()<(hatEig(p,'diva')||hatEig(p,'soeldner')?W.oeffentlichDiva:W.oeffentlichChance)){p.ww=4;p.wws=0;
    squad(p.team).forEach(q=>{if(q!==p)stimmungAendern(q,-W.teamMinus);});if(mein)news(`${p.n} beklagt sich öffentlich und will weg. Die Stimmung in der Kabine leidet.`,'bad');}}
// Gesprächswunsch deines Spielers: Halt am selben Tag (K14 §4.3, K15)
function gespraechswunsch(p){S.gw=(S.gw||[]).filter(g=>g.pid!==p.id);S.gw.push({pid:p.id,tag:S.tag,s:S.season});news(`${p.n} möchte mit dir sprechen (${WW_NAME[2]}). Grund: ${BAUSTEIN_GRUND[hauptgrund(p)]||'Unzufriedenheit'}.`,'bad');}
// Computer-Trainer (K15 §7): Das Gespräch gelingt mit fester Wahrscheinlichkeit, dann sinkt die Stufe
function kiGespraech(p){const K=RKA.ki;if(R()<K.gelingt){p.ww=1;p.wws=0;p.wv=0;stimmungAendern(p,K.stimmung);}}

// ---------- Woche (montags, K14 §4.1) ----------
// Zielstimmung, Ansteckung, Trägheit (höchstens ±8 pro Woche), Zusammenhalt, Wechselwunsch, Beziehungen, Glaubwürdigkeit (K15) und Kabinenbericht
function kabineWoche(d){const K=RKA,A=K.ansteckung,aktive=S.teams.filter(t=>aktiv(t)),kader=new Map(aktive.map(t=>[t.id,[]]));
  S.pl.forEach(p=>{const l=kader.get(p.team);if(l)l.push(p);});
  aktive.forEach(t=>{const sq=kader.get(t.id);rollenBerechnen(t.id,sq);erfolgBerechnen(t);kapitaenPruefen(t,sq);if(t.zh==null)t.zh=K.zusammenhalt.start;});
  beziehungenWoche(aktive,kader);
  const anst=new Map(),add=(p,v)=>anst.set(p.id,(anst.get(p.id)||0)+v);
  aktive.forEach(t=>{const sq=kader.get(t.id);sq.filter(p=>hatEig(p,'fuehrungsspieler')).forEach(f=>{const s=stimmung(f);
    if(s<A.fuehrerUnter)freundeVon(f).forEach(q=>{if(q.team===t.id)add(q,A.freunde);});else if(s>A.fuehrerUeber)sq.forEach(q=>{if(q!==f&&stimmung(q)<A.alleUnter)add(q,A.alle);});});});
  // Torwart-Duell (K14 §12): beide −1 pro Woche, Diven doppelt, solange die Rangfolge offen ist (nur während der Saison)
  aktive.forEach(t=>{const du=S.phase==='play'&&t.twS?torwartDuell(t,kader.get(t.id)):null,mein=t.id===S.my;
    if(du){du.forEach(p=>add(p,K.bank.torwart.woche*(hatEig(p,'diva')?K.bank.diva:1)));
      if(mein&&!t.twD)news(`Torwart-Duell: ${du[0].n} und ${du[1].n} sind fast gleich stark, die Rangfolge ist offen. Das kostet beide Stimmung, bis ${frei('kaderrollen')&&!autoB('kaderrollen')?'du einem von beiden eine Kaderrolle gibst oder ':''}derselbe ${K.bank.torwart.klarNach} Spiele in Folge im Tor steht.`);t.twD=1;}
    else if(t.twD){delete t.twD;if(mein&&S.phase==='play')news('Die Rangfolge im Tor ist geklärt.','good');}});
  // Belastung junger Spieler (K08 §5.4), nur bei deinem Verein: über der Grenze −2 pro Woche und höheres Verletzungsrisiko (Merker p.vz)
  (kader.get(S.my)||[]).forEach(p=>{if(ueberBelastung(p)){p.vz=1;add(p,RJ.belastung.stimmung);}else delete p.vz;});
  const vorher=new Map();
  kader.forEach(sq=>sq.forEach(p=>{kabineInit(p);if(p.team===S.my)vorher.set(p.id,p.st);
    p.st=clamp(p.st+clamp((zielStimmung(p)-p.st)*K.traegheit+(anst.get(p.id)||0),-K.wocheMax,K.wocheMax),0,100);
    if(p.tb){p.tb*=1-K.trainerZerfall;if(Math.abs(p.tb)<0.05)delete p.tb;}if(p.ubW>0&&!--p.ubW){delete p.ub;delete p.ubW;}
    if(p.zhNeu!=null&&(p.wiv||0)>K.zusammenhalt.neuerWochen*3)delete p.zhNeu;}));
  const gr=[];aktive.forEach(t=>{const Z=K.zusammenhalt;let dz=(t.siegeW||0)*Z.sieg+(Z.start-zusammenhalt(t))*Z.ausgleich;
    if(t.xiW&&t.xiV&&t.xiW.filter(id=>t.xiV.includes(id)).length>=Z.stammelfGleich)dz+=Z.stammelf;if(t.xiW){t.xiV=t.xiW;t.xiW=null;}t.siegeW=0;
    const g=grueppchen(t.id,kader.get(t.id));dz+=g.length*K.gruppe.zh;if(t.id===S.my)gr.push(...g);zusammenhaltAendern(t,dz);});
  kader.forEach(sq=>sq.forEach(p=>{if(p.team>=0)wechselwunschWoche(p);}));
  glaubwuerdigkeitWoche();S.gw=(S.gw||[]).filter(g=>{const p=PIX.get(g.pid);return p&&p.team===S.my&&p.ww===2;});
  kabinenBericht(vorher,gr);}
// Kabinenbericht im Posteingang, nur wenn sich etwas tut: wer unzufrieden geworden ist (mit Grund), wer aufblüht, Grüppchen
function kabinenBericht(vorher,gr){const un=[],auf=[];squad(S.my).forEach(p=>{const v=vorher.get(p.id);if(v==null)return;
  if(v>=RKA.wechsel.grummeln[0]&&p.st<RKA.wechsel.grummeln[0])un.push(`${p.n} (${BAUSTEIN_GRUND[hauptgrund(p)]||'unzufrieden'})`);
  if(v<=80&&p.st>80)auf.push(p.n);});
  const teile=[];if(un.length)teile.push('unzufrieden: '+un.join(', '));if(auf.length)teile.push('blüht auf: '+auf.join(', '));
  if(gr.length&&!(S.grMeldung>=absTag(S.tag)-28)){teile.push('Grüppchenbildung: '+gr.map(l=>l.map(p=>last(p.n)).join(', ')).join(' / '));S.grMeldung=absTag(S.tag);}
  if(teile.length)news(`Kabinenbericht des Co-Trainers: ${teile.join(' · ')}. Stimmung ${Math.round(mannschaftsStimmung(S.my))}, Zusammenhalt ${Math.round(zusammenhalt(myT()))}.`,un.length||gr.length?'bad':'good');}

// ---------- Saison und Sommer ----------
// Am 1. Juli: Freundschaften werden fester, Zähler der Saison auf null
const BANK_ZAEHLER=['rz','bnk','jk','vtr','nsp','bg','krP','rue']; // Zähler der Bankzeit: neu mit jeder Saison und jedem Vereinswechsel
function kabineSaison(){(S.bz||[]).forEach(b=>{if(b[2]==='F')b[3]=Math.min(3,b[3]+1);});S.teams.forEach(t=>{t.kst={ww3:0};delete t.endspiel;delete t.weck;delete t.rotAn;});
  S.pl.forEach(p=>BANK_ZAEHLER.forEach(k=>delete p[k]));}
// Nach dem Saisonwechsel (neue Kader der Aufsteiger, neue Talente): Rollen sofort, Einsatzzeit nur für Spieler ohne Wert
function kabineNachSaisonwechsel(){S.bz=(S.bz||[]).filter(b=>PIX.get(b[0])&&PIX.get(b[1]));S.vs=(S.vs||[]).filter(v=>PIX.get(v.pid));S.gw=(S.gw||[]).filter(g=>{const p=PIX.get(g.pid);return p&&p.team===S.my&&p.ww===2;}); // ausgelaufene Verträge: Gesprächswunsch erledigt
  S.teams.forEach(t=>{if(!aktiv(t))return;rollenBerechnen(t.id);kapitaenPruefen(t);squad(t.id).forEach(p=>{kabineInit(p);if(p.ea==null)p.ea=erwartungEinsatz(p);});});}
// Urlaubslänge (K12a, K14 §5.1 Umfeld): vier Wochen +3, zwei Wochen −3 für Spieler mit hoher Saisonbelastung, wirkt acht Wochen
function kabineUrlaub(t,wochen){const U=RKA.urlaub;squad(t.id).forEach(p=>{const v=wochen>=4?U.lang:wochen<=2&&(p.sb||0)>=RSO.belastung.ab?U.kurz:0;if(v){p.ub=v;p.ubW=U.wochen+wochen;}else{delete p.ub;delete p.ubW;}});}
// Teamevent (K14 §6): Stimmung und Zusammenhalt, nutzt sich innerhalb von vier Wochen ab, kostet Geld
function teameventMoeglich(){const t=myT(),k=RKA.teamevent.kosten[t.lg]||RKA.teamevent.kosten[3];return{kosten:k,abn:abnutzungTeamevent()};}
function abnutzungTeamevent(){const T=RKA.teamevent,A=RGS.abnutzung,n=(myT().tev||[]).filter(x=>x>absTag(S.tag)-T.wochen*7).length;return n===0?1:n===1?A.zweites:A.danach;}
function teameventLauf(){const T=RKA.teamevent,t=myT(),{kosten,abn}=teameventMoeglich();money('Teamevent',-kosten);
  squad(S.my).forEach(p=>stimmungAendern(p,T.stimmung*abn));zusammenhaltAendern(t,T.zh*abn);t.tev=[...(t.tev||[]).filter(x=>x>absTag(S.tag)-T.wochen*7),absTag(S.tag)];
  news(`Teamevent: Die Mannschaft verbringt einen Tag zusammen (${fmt(kosten)}).${abn<1?' Die Spieler kennen das schon, es wirkt schwächer.':''}`,'good');return abn;}
// Neuer Verein (Transfer, K14): Neuanfang beim Wechselwunsch, Einsatzzeit neu, alte Rolle und Gespräche vergessen. Zählt als neuer Stammspieler für den Zusammenhalt, sobald er in der Startelf steht.
function neuAnfang(p,tid){kabineInit(p);S.gw=(S.gw||[]).filter(g=>g.pid!==p.id);p.ww=0;p.wws=0;p.wu=0;p.wv=0;p.st=Math.max(p.st,stimmungStart(p));['ea','tb','kr','gs','streit','trib','pate','prO','vz','krOk',...BANK_ZAEHLER].forEach(k=>delete p[k]);p.zhNeu=tid;}
// Beim Aufbau der Welt: Rollen, Kapitän, Startstimmung und Einsatzzeit nach der erwarteten Rolle, damit die ersten Spiele keinen Sprung machen
function kabineStart(){S.bz=S.bz||[];S.teams.forEach(t=>{t.kst={ww3:0};if(!aktiv(t))return;rollenBerechnen(t.id);kapitaenPruefen(t);t.zh=zusammenhalt(t);squad(t.id).forEach(p=>{kabineInit(p);p.ea=erwartungEinsatz(p);});});}
