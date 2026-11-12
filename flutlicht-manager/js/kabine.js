// Stimmung, Kaderrollen, Wechselwunsch, Kabine, Zusammenhalt, Beziehungen und Kapitän (Konzept K14, U8).
// Alle Zahlen stehen in daten/regeln.js unter REGELN.kabine (Kurzform RKA). Gespräche, Versprechen und Ansprachen: js/gespraeche.js (K15).
// Gilt für alle Vereine gleich. Nur Gesprächswünsche deiner Spieler werden zum Halt, bei Computer-Vereinen führt der Trainer das Gespräch (K15 §7).

const KR_STUFE={talent:1,ergaenzung:1,rotation:2,stamm:3,schluessel:4};
const KR_NAME={schluessel:'Schlüsselspieler',stamm:'Stammspieler',rotation:'Rotation',ergaenzung:'Ergänzung',talent:'Talent'};
const KR_LISTE=['schluessel','stamm','rotation','ergaenzung','talent'];
const KR_AUS_STUFE=['','ergaenzung','rotation','stamm','schluessel'];
const WW_NAME=['zufrieden','grummelt','will reden','will weg','will öffentlich weg'];
const BAUSTEIN_NAME={einsatz:'Einsatzzeit',erfolg:'Erfolg',leistung:'Form',vertrag:'Gehalt und Vertrag',trainer:'Trainer (Rolle, Gespräche)',umfeld:'Umfeld (Kapitän, Urlaub)'};
const BAUSTEIN_GRUND={einsatz:'zu wenig Einsatzzeit',erfolg:'Misserfolg',leistung:'schwache Form',vertrag:'Gehalt und Vertrag',trainer:'Rolle oder Gespräche',umfeld:'Umfeld'};

// Startwert ohne Zufall (aus der Spielernummer), damit das Anlegen keinen Zufallsstrom verschiebt (K02)
const stimmungStart=p=>RKA.start[0]+(Math.imul(p.id,2654435761)>>>0)%(RKA.start[1]-RKA.start[0]+1);
function kabineInit(p){if(p.st==null)p.st=stimmungStart(p);if(p.ww==null)p.ww=0;}
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
function rollenBerechnen(tid,kader){const t=S.teams[tid],sq=kader||squad(tid);if(!t||!sq.length)return;const need={},xi=new Set(elfOhneAusfaelle(t,sq));
  slotsVerein(t).forEach(pos=>{const g=posGruppe(pos);need[g]=(need[g]||0)+1;});const stamm=sq.filter(p=>xi.has(p.id));stamm.forEach(p=>p.krA='stamm');
  ['TW','AB','MF','ST'].forEach(g=>{let rot=g==='TW'?0:Math.ceil((need[g]||0)*RKA.rotationAnteil);
    sq.filter(p=>p.pos===g&&!xi.has(p.id)).sort((a,b)=>b.str-a.str).forEach(p=>{p.krA=rot-->0?'rotation':'ergaenzung';});});
  stamm.sort((a,b)=>b.str-a.str).slice(0,RKA.schluesselAnzahl).forEach(p=>p.krA='schluessel');
  sq.forEach(p=>{if(p.krA==='ergaenzung'&&p.age<=RKA.talentBis)p.krA='talent';
    p.krS=Math.min(4,KR_STUFE[p.krA]+(p.ch&&p.ch.ehr>=RKA.ehrgeizigAb?1:0));if(p.kr&&(!KR_STUFE[p.kr]||tid!==S.my))delete p.kr;});}
// Beste Elf, wenn alle fit wären (wie bestXI in engine.js, aber ohne Ausfälle): wer darin steht, ist Stammspieler
function elfOhneAusfaelle(t,sq){const sl=slotsVerein(t),used=new Set(),xi=Array(sl.length).fill(null);
  const pass=ok=>sl.forEach((pos,i)=>{if(xi[i]!=null)return;let best=null,bv=-1;for(const p of sq){if(used.has(p.id)||!ok(p,pos))continue;const v=eff(p,pos,100);if(v>bv){bv=v;best=p;}}if(best){xi[i]=best.id;used.add(best.id);}});
  pass((p,pos)=>(p.fp||STD_POS[p.pos])===pos);pass((p,pos)=>posGruppe(p.fp||STD_POS[p.pos])===posGruppe(pos));return fillXI(sl,sq,xi,used).filter(x=>x!=null);}
// Rolle, die der Trainer vergeben hat: bei dir die gewählte (sonst der Vorschlag des Co-Trainers), bei Computer-Vereinen der Vorschlag
const kaderRolle=p=>(p.team===S.my&&p.kr&&!autoB('kaderrollen')&&p.kr)||p.krA||'ergaenzung';
const krStufe=p=>KR_STUFE[kaderRolle(p)]||1;
const einschaetzung=p=>p.krS||krStufe(p);
// Erwartete Einsatzzeit: deine Rolle, wenn sie mindestens seiner Einschätzung entspricht, sonst die Mitte der beiden Anteile
function erwartungEinsatz(p){const R=krStufe(p),E=einschaetzung(p),a=RKA.rollen[R===1&&kaderRolle(p)==='talent'?'talent':KR_AUS_STUFE[R]];return R>=E?a:(a+RKA.rollen[KR_AUS_STUFE[E]])/2;}

// ---------- Einsatzzeit und Spielfolgen (nach jedem Pflichtspiel, vor dem Absitzen der Sperren) ----------
// Gleitender Schnitt der Minuten. Wer verletzt oder gesperrt fehlt, wird nicht gezählt. Dazu Startelf und Siege für den Zusammenhalt.
function einsatzBuchen(list){const a=RKA.einsatzTempo;
  list.forEach(r=>{const wb=wbVon(r);[0,1].forEach(s=>{const tid=s?r.a:r.h,t=S.teams[tid];if(tid>=1000||!t)return;
    const min=new Map(r.xpo[s].map(x=>[x[0],x[3]==null?90:x[3]]));
    mitWettbewerb(wb,()=>squad(tid).forEach(p=>{kabineInit(p);if(p.ea==null)p.ea=erwartungEinsatz(p);if(!min.has(p.id)&&!avail(p))return;
      p.ea=p.ea*(1-a)+a*Math.min(1,(min.get(p.id)||0)/90);}));
    t.xiW=(r.xi[s]||[]).slice();if(winner(r)===tid&&r.hg!==r.ag||(r.pen&&winner(r)===tid))t.siegeW=(t.siegeW||0)+1;
    // Neue Stammspieler (K14 §5.6): ein Neuzugang in der Startelf kostet einmal Zusammenhalt
    (r.xi[s]||[]).forEach(id=>{const p=PIX.get(id);if(p&&p.zhNeu===tid){delete p.zhNeu;zusammenhaltAendern(t,RKA.zusammenhalt.neuer);}});});});}

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
  if(x<0){x*=E.ehrgeiz[0]+E.ehrgeiz[1]*(p.ch?p.ch.ehr:10);if(rufGefaelle(p))x*=RKA.rufGefaelle.einsatz;if(rivalen(p).some(q=>(q.ea||0)>a+0.2))x*=E.rivale;}
  B.einsatz=clamp(x,Z.einsatz[0],Z.einsatz[1]);
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
const lernStimmung=p=>(p.st!=null&&p.st<RKA.folgen.lernenUnter?RKA.folgen.lernen:1)*(rivalen(p).length?RKA.beziehungen.lernen:1);
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
function kabineSaison(){(S.bz||[]).forEach(b=>{if(b[2]==='F')b[3]=Math.min(3,b[3]+1);});S.teams.forEach(t=>{t.kst={ww3:0};delete t.endspiel;delete t.weck;});}
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
function neuAnfang(p,tid){kabineInit(p);S.gw=(S.gw||[]).filter(g=>g.pid!==p.id);p.ww=0;p.wws=0;p.wu=0;p.wv=0;p.st=Math.max(p.st,stimmungStart(p));['ea','tb','kr','gs','streit'].forEach(k=>delete p[k]);p.zhNeu=tid;}
// Beim Aufbau der Welt: Rollen, Kapitän, Startstimmung und Einsatzzeit nach der erwarteten Rolle, damit die ersten Spiele keinen Sprung machen
function kabineStart(){S.bz=S.bz||[];S.teams.forEach(t=>{t.kst={ww3:0};if(!aktiv(t))return;rollenBerechnen(t.id);kapitaenPruefen(t);t.zh=zusammenhalt(t);squad(t.id).forEach(p=>{kabineInit(p);p.ea=erwartungEinsatz(p);});});}
