// Verträge (Konzept K21, U10b): Gehaltsforderung, Verhandlung über ein Paket aus Laufzeit, Gehalt, Handgeld, Prämien und Klauseln, Prämien je Spiel,
// Ligaklausel, Ausstiegsklausel, Vorvertrag im letzten halben Jahr. Dazu das Interesse des Spielers beim Wechsel (K19 §5.3) und die Bankzeit im
// Vertragsjahr und bei teuren Neuzugängen (K14 §12). Alle Zahlen stehen in daten/regeln.js unter REGELN.vertraege (Kurzform RVT).
// Gehalt und Laufzeit bleiben in p.sal und p.ct. Neu am Spieler: p.vp (Prämien je Spiel: a Auflauf, p Punkt, t Tor, z Zu-Null), p.ak (Ausstiegsklausel),
// p.lk (Kürzung bei Abstieg), p.seit (Tag des Wechsels), p.abl (Ablöse). Im Spielstand S.vt (Verhandlungen) und S.vtGespr (letztes Gespräch je Spieler).

// ---------- Forderung (K21 §5.1) ----------
const vtFrac=x=>x-Math.floor(x);
function gehaltForderung(p,neu){const F=RVT.forderung,a=(F.alter.find(x=>p.age<=x[0])||[0,1])[1];
  let f=salaryFor(p.str)*a*(p.age<=F.talentBis&&sternZahl(p)>=F.talentSterne?F.talent:1)*(hatEig(p,'soeldner')?F.soeldner:hatEig(p,'vereinstreu')?F.treu:1)*(F.zufall[0]+(p.seed||0.5)*F.zufall[1]);
  f*=(neu?F.wechsel:vertragsAufschlag(p))*beraterFaktor(p);return Math.round(f/1000)*1000;} // Berater: Profil und Beziehung (K22, U10c)
// Schwelle des Spielers: seine Forderung, je Spieler fest um bis zu ±3 % verschoben. Du siehst nur die Zone.
const vtSchwelle=(p,F)=>F*(1+(vtFrac((p.seed||0.5)*7)-0.5)*2*RVT.zone);
const vtZone=F=>[Math.round(F*(1-RVT.zone)/10000)*10000,Math.round(F*(1+RVT.zone)/10000)*10000];
// Vorschlag fürs Gehaltsfeld: die obere Kante der Zone, dann sagt er sicher zu
const vtVorschlag=F=>Math.ceil(F*(1+RVT.zone)/1000)*1000;

// ---------- Interesse beim Wechsel (K19 §5.3) ----------
// Verein (Ansehen, Liga), Perspektive (Stärke gegen deine Kaderstärke), Alter, Zufall, Ausland (wie bisher), dazu neu: Lage beim alten Verein (Stimmung, Wechselwunsch),
// Bindung (Restlaufzeit, vereinstreu) und Heimat (Landsleute in deinem Kader). Geld gleicht ein wenig fehlendes Interesse aus (gehaltMitInteresse).
function wechselInteresse(p){const t=myT(),I=RM.interesse,IV=RVT.interesse,IA=RW.ausland.interesse,aus=istAusland(p),from=aus?avVon(p.team):p.team>=0?S.teams[p.team]:null,lvl=teamLevel(S.my);
  let x=(t.rep-(from?from.rep:t.rep-I.vereinslosAbstand))+(lvl-p.str)*I.niveauFaktor+I.basis+(t.lg===1?I.liga1:t.lg===2?I.liga2:I.liga3)+(p.age>=I.altAb?I.altPlus:0)+((p.seed||0.5)-0.5)*I.zufall
    +(aus?(p.nat===RW.nation.heimat?IA.heimkehr:IA.fremd):0);
  if(from&&!aus){if(p.st!=null)x+=(IV.lageMitte-p.st)*IV.lage;if(p.ww>=3)x+=IV.wechselwunsch;x+=Math.max(0,(p.ct||1)-1)*IV.bindung;}
  if(from&&hatEig(p,'vereinstreu'))x+=IV.treu;
  if(p.nat)x+=Math.min(IV.landsleuteMax,squad(S.my).filter(q=>q.nat===p.nat).length*IV.landsleute)*(p.nat===RW.nation.heimat?0:1);
  return x+beraterInteresse(p);} // ab +60 rät sein Berater ihm zu dir (K22)
// Fehlt etwas Interesse (bis −10), will er mehr Geld: je Punkt 3 % mehr. Darunter hilft kein Geld.
function gehaltMitInteresse(p,interesse){const F=gehaltForderung(p,true),IV=RVT.interesse;if(interesse>=0)return F;if(interesse<IV.geldAb)return null;return Math.round(F*(1-interesse*IV.geldJePunkt)/1000)*1000;}

// ---------- Wert eines Pakets aus Sicht des Spielers (K21 §5.1a, §5.2) ----------
// Erwarteter Anteil der Pflichtspiele, in denen er spielt: beim eigenen Verein seine Einsatzerwartung, sonst nach seinem Rang auf der Position
function einsatzSchaetzung(p,tid){if(p.team===tid&&p.ea!=null)return p.ea;const E=RVT.einsatz,l=squad(tid).filter(q=>q.pos===p.pos&&q!==p).map(q=>q.str),k=STAMM_JE_GRUPPE[p.pos]||1,rang=l.filter(s=>s>p.str).length;
  return rang<k?E.stamm:rang<2*k?E.rotation:E.rest;}
// Erwartete Prämien je Saison (für den Spieler und für deine Kostenvorschau) und im besten Fall (alle Spiele)
function praemienErwartung(p,tid,vp){const V=RVT,lg=(S.teams[tid]||{}).lg||1,sp=V.spiele[lg]||36,e=einsatzSchaetzung(p,tid),tq=V.torquote[p.pos]||0,zn=p.pos==='TW'||p.pos==='AB'?V.zuNullQuote:0;
  const je=x=>(vp.a||0)*x+(vp.p||0)*x*V.punkteJeSpiel+(vp.t||0)*x*tq+(vp.z||0)*x*zn;return{erw:je(sp*e),max:je(sp)};}
// Wert je Jahr: Gehalt + Handgeld/Laufzeit + erwartete Prämien × Sicherheit + Klauseln − Laufzeitwunsch (alles relativ zur Forderung F)
function paketWert(p,tid,o,F){const V=RVT,sicher=V.sicher[0]+V.sicher[1]*(p.ch?p.ch.dru:10),pr=praemienErwartung(p,tid,o.vp||{});
  let w=o.sal+(o.hg||0)/Math.max(1,o.ct)+pr.erw*sicher;
  if(o.ak){const r=o.ak/Math.max(1,value(p)),A=V.ausstieg;w+=F*(r<=A.billigAb?A.bonus:r<=A.mittelAb?A.bonus/2:0);}
  if(o.lk)w-=F*V.ligaklausel.malus*(o.lk/V.ligaklausel.ref);
  const L=V.laufzeit;w-=F*(p.age<=L.jungBis?Math.max(0,o.ct-L.mitte)*L.jung:p.age>=L.altAb?Math.max(0,L.mitte-o.ct)*L.alt:0);
  return w;}

// ---------- Verhandlung (K21 §4.1, §4.2) ----------
function vtVerhandlung(p){S.vt=S.vt||{};let v=S.vt[p.id];if(!v||v.team!==p.team)v=S.vt[p.id]={team:p.team,r:0,pause:-1};return v;}
const vtVon=p=>{const v=S.vt&&S.vt[p.id];return v&&v.team===p.team?v:null;};
// Eine Runde: Paket o = {ct, sal, hg, vp, ak, lk} für den Verein tid. F: Forderung (mit Interesse). Rückgabe {ok} oder {text}
function vertragRunde(p,tid,o,F){const V=RVT,v=vtVerhandlung(p),eigen=p.team===tid;S.vtGespr=S.vtGespr||{};S.vtGespr[p.id]=S.tag;
  if(v.pause>S.tag)return{text:`${p.n} will bis ${datumKurz(v.pause)} nicht über einen Vertrag reden.`};
  const maxCt=p.age<18?V.laufzeit.maxU18:V.laufzeit.max;if(!(o.ct>=1&&o.ct<=maxCt))return{text:`Laufzeit 1 bis ${maxCt} Jahre.`};
  const w=paketWert(p,tid,o,F),sch=vtSchwelle(p,F);if(w>=sch){const runden=v.r;if(S.vt)delete S.vt[p.id];return{ok:true,runden};}
  v.r++;if(eigen)stimmungAendern(p,V.rundeStimmung);
  if(v.r>=V.runden){v.pause=S.tag+V.vertagtTage;v.r=0;beraterBeziehung(p,RBE.beziehung.hart);return{text:`${p.n} lehnt ab. Nach ${V.runden} Runden ist das Gespräch bis ${datumKurz(v.pause)} vertagt.`};}
  return{text:`${p.n} lehnt ab (Runde ${v.r} von ${V.runden}). Ihm fehlen etwa ${fmt(Math.max(10000,Math.round((sch-w)/10000)*10000))} pro Jahr.`};}
// Paket aus dem Formular der Spielerkarte. Leere Felder: Gehalt = obere Kante der Zone, Handgeld bei Vereinslosen wie bisher (halbes Jahresgehalt), sonst 0.
// Prämien und Klauseln zählen nur ab der A-Lizenz (K36, Bereich praemien).
function vtPaket(p,F,ct,vereinslos){const el=id=>(document.getElementById(id)||{}).value,zahl=(id,m)=>{const v=el(id);return v===''||v==null||isNaN(+v)?null:Math.max(0,+v*m);};
  const sal=zahl('vt_sal',1e6),o={ct,sal:sal!=null&&sal>0?Math.round(sal/1000)*1000:vtVorschlag(F)};const hg=zahl('vt_hg',1e6);o.hg=hg!=null?Math.round(hg/1000)*1000:vereinslos?Math.round(o.sal*RF.handgeld/1000)*1000:0;
  if(frei('praemien')){const vp={a:zahl('vt_a',1000),p:zahl('vt_p',1000),t:zahl('vt_t',1000),z:zahl('vt_z',1000)};Object.keys(vp).forEach(k=>{if(!vp[k])delete vp[k];else vp[k]=Math.round(vp[k]);});if(Object.keys(vp).length)o.vp=vp;
    const ak=zahl('vt_ak',1e6);if(ak)o.ak=Math.round(ak/RM.runden)*RM.runden;const lk=zahl('vt_lk',0.01);if(lk&&RVT.ligaklausel.stufen.includes(Math.round(lk*100)/100))o.lk=Math.round(lk*100)/100;}
  return o;}
// Vertrag eintragen: Laufzeit, Gehalt, Prämien, Klauseln, Handgeld buchen
function vtUnterschrift(p,o,neu){p.ct=o.ct;p.sal=o.sal;if(o.vp)p.vp=o.vp;else delete p.vp;if(o.ak)p.ak=o.ak;else delete p.ak;if(o.lk)p.lk=o.lk;else delete p.lk;if(o.hg)money('Handgelder',-o.hg);if(neu)p.seit=absTag(S.tag);}
// Vertrag endet (Verkauf, Auflösung): Prämien und Klauseln gelten nicht beim neuen Verein
function vertragEnde(p){delete p.vp;delete p.ak;delete p.lk;if(S.vt)delete S.vt[p.id];}

// ---------- Prämien je Pflichtspiel (K21 §3.1) ----------
function praemienNachSpiel(list){const P=RVT.praemie;let summe=0;
  list.forEach(r=>{[0,1].forEach(s=>{const tid=s?r.a:r.h;if(tid!==S.my)return;const xi=new Set(r.xi[s]||[]),min=new Map((r.xpo[s]||[]).map(x=>[x[0],x[3]==null?90:x[3]])),rein=new Map((r.ws||[]).filter(w=>w[0]===s).map(w=>[w[3],w[1]]));
    const gf=s?r.ag:r.hg,ga=s?r.hg:r.ag,pkt=r.lg?(gf>ga?3:gf===ga?1:0):0,tore=new Map();(r.ev||[]).forEach(e=>{if(e.t==='G'&&e.s===s)tore.set(e.p,(tore.get(e.p)||0)+1);});
    min.forEach((m,id)=>{const p=PIX.get(id);if(!p||!p.vp||p.team!==S.my)return;const v=p.vp,start=xi.has(id),ab=rein.get(id);
      if(v.a)summe+=start||(ab!=null&&ab<P.halbAbMinute)?v.a:v.a/2;
      if(v.p&&pkt&&(start||m>=P.punktAbMinuten))summe+=v.p*pkt;
      if(v.t)summe+=v.t*(tore.get(id)||0);
      if(v.z&&!ga&&(p.pos==='TW'||p.pos==='AB')&&m>=P.zuNullAbMinuten)summe+=v.z;});});});
  if(summe>0)money('Prämien',-Math.round(summe));return summe;}

// ---------- Saisonwechsel: Ligaklausel (K21 §3.1) ----------
function vertraegeSaison(){const t=myT();if(!(t.lastLg&&t.lg>t.lastLg))return;const l=squad(S.my).filter(p=>p.lk);
  l.forEach(p=>{p.sal=Math.round(p.sal*(1-p.lk)/1000)*1000;});if(l.length)news(`Ligaklausel: Nach dem Abstieg verdienen ${l.map(p=>`${p.n} (−${Math.round(p.lk*100)} %)`).join(', ')} weniger.`);}

// ---------- Woche: Ausstiegsklausel und Vorvertrag (K21 §4.3, §4.5) ----------
const vorvertragZeit=(tag=S.tag)=>{const k=mmtt(tag),V=RVT.vorvertrag;return S.phase==='play'&&k>=V.von&&k<=V.bis;};
function vertraegeWoche(d){const V=RVT,t=myT();
  // Ausstiegsklausel: Ein größerer Verein mit Bedarf und Geld zahlt den Betrag (nur im Fenster). Der Spieler geht sofort.
  if(fensterOffen(d))squad(S.my).filter(p=>p.ak&&!p.wech).forEach(p=>{const B=S.teams.filter(b=>b.id!==S.my&&aktiv(b)&&b.rep>=t.rep&&b.cash>=p.ak&&hatBedarf(b,p)&&vwKauf(p,b.id)>=p.ak);
    if(!B.length||R()>=V.ausstieg.chance)return;const b=pick(B),betrag=p.ak;money('Transfers',betrag);b.cash-=betrag;kabineAbgang(p,S.my);vertragEnde(p);S.offers=S.offers.filter(o=>o.pid!==p.id);
    p.team=b.id;p.list=0;p.ct=riA(RM.neuerVertrag);p.seit=absTag(d);p.abl=betrag;neuzugang(p,b.id);news(`Ausstiegsklausel gezogen: ${b.name} zahlt ${fmt(betrag)} für ${p.n}. Er wechselt sofort.`,'bad');});
  // Vorvertrag woanders: im letzten halben Jahr, wenn du seit acht Wochen nicht mit ihm über einen Vertrag geredet hast (ohne Vorwarnung, K21 §4.3)
  if(vorvertragZeit(d)&&!autoB('vertraege'))squad(S.my).filter(p=>p.ct===1&&!p.wech&&!(S.vtGespr&&S.vtGespr[p.id]>=d-V.gespraechTage)).forEach(p=>{
    const B=S.teams.filter(b=>b.id!==S.my&&aktiv(b)&&b.rep>=t.rep-V.vorvertrag.ansehenMinus&&hatBedarf(b,p));if(!B.length||R()>=V.vorvertrag.chance)return;const b=pick(B),ber=beraterVon(p);
    if(ber&&ber.bz>=RBE.beziehung.warnAb&&p.vvW!==S.season){p.vvW=S.season;news(`Berater ${ber.n} warnt dich: ${b.name} will ${p.n} einen Vorvertrag geben. Rede mit ihm über eine Verlängerung.`,'offer');return;} // K22 §12 Nr. 5
    wechselVormerken(p,b.id,{ct:riA(RM.neuerVertrag),preis:0,ab:tageDerSaison()});S.offers=S.offers.filter(o=>o.pid!==p.id);news(`Vorvertrag: ${p.n} hat bei ${b.name} unterschrieben und geht im Sommer ablösefrei. Ihr hattet nicht über eine Verlängerung geredet.`,'bad');});}

// ---------- Bankzeit (K14 §12): Vertragsjahr und teurer Neuzugang ----------
// Faktor auf das Tempo, mit dem ein Bankplatz die Einsatzerwartung senkt. Wer woanders unterschrieben hat, erwartet nichts mehr (siehe bankFall).
function teuerNeu(p){const B=RVT.bank;if(p.seit==null||absTag(S.tag)-p.seit>B.neuTage)return false;const sq=squad(p.team),k=Math.max(1,Math.ceil(sq.length*B.teuerAnteil));
  const sal=sq.map(q=>q.sal).sort((a,b)=>b-a)[k-1]||Infinity,abl=sq.map(q=>q.abl||0).sort((a,b)=>b-a)[k-1]||Infinity;return p.sal>=sal||(p.abl||0)>0&&(p.abl||0)>=abl;}
const vertragsDruck=p=>{const B=RVT.bank;return (p.ct===1&&!p.wech?(hatEig(p,'soeldner')?B.soeldner:B.vertragsjahr):1)*(teuerNeu(p)?B.neuzugang:1);};

// ---------- Anzeige ----------
let VT_DETAIL=0; // Prämien und Klauseln im Formular zeigen (nur ab der A-Lizenz)
// Formular für ein Vertragsangebot (Verlängerung oder Wechsel). F: Forderung, tid: Verein, vereinslos: Handgeld vorschlagen
function vertragFormular(p,F,tid,vereinslos,laufzeitId){const z=vtZone(F),det=VT_DETAIL&&frei('praemien'),hg=vereinslos?Math.round(vtVorschlag(F)*RF.handgeld/1000)*1000:0,pr=p.vp?praemienErwartung(p,tid,p.vp):null;
  const feld=(id,label,wert,schritt='0.01')=>`<label>${label} <input id="${id}" type="number" step="${schritt}" min="0" value="${wert}"></label>`;
  return`<p>Er fordert etwa ${fmt(z[0])} bis ${fmt(z[1])} pro Jahr. Prämien, Handgeld und Klauseln zählen mit. Junge wollen eher kurze, Ältere lange Laufzeiten.</p>
    ${feld('vt_sal','Gehalt (Mio € pro Jahr)',(vtVorschlag(F)/1e6).toFixed(2))}${feld('vt_hg','Handgeld (Mio €, einmalig)',(hg/1e6).toFixed(2))}
    ${det?`${feld('vt_a','Auflaufprämie (Tsd € je Spiel)',0,'1')}${feld('vt_p','Punktprämie (Tsd € je Punkt)',0,'1')}${feld('vt_t','Torprämie (Tsd € je Tor)',0,'1')}${p.pos==='TW'||p.pos==='AB'?feld('vt_z','Zu-Null-Prämie (Tsd € je Spiel)',0,'1'):''}
      ${feld('vt_ak','Ausstiegsklausel (Mio €, leer = keine)','')}<label>Ligaklausel <select id="vt_lk">${RVT.ligaklausel.stufen.map(x=>`<option value="${x*100}">${x?`−${x*100} % Gehalt bei Abstieg`:'keine'}</option>`).join('')}</select></label>
      <p class="dim">Prämien sieht er mit seinem Erwartungswert, Vorsichtige mit Abschlag. Eine Ausstiegsklausel nimmt ihm Gehalt ab, eine Ligaklausel kostet extra.</p>`
      :`<button onclick="vertragDetails(${p.id})"${lzAus('praemien')}>Prämien und Klauseln</button>${lzHinweis('praemien')}`}
    ${pr?`<p class="dim">Laufende Prämien: bei einer üblichen Saison etwa ${fmt(Math.round(pr.erw/1000)*1000)}, höchstens ${fmt(Math.round(pr.max/1000)*1000)}.</p>`:''}`;}
// Zeile in der Spielerkarte: was im Vertrag steht
function vertragText(p){const l=[];if(p.vp){const v=p.vp;if(v.a)l.push(`Auflauf ${fmt(v.a)}`);if(v.p)l.push(`Punkt ${fmt(v.p)}`);if(v.t)l.push(`Tor ${fmt(v.t)}`);if(v.z)l.push(`Zu-Null ${fmt(v.z)}`);}
  if(p.ak)l.push(`Ausstiegsklausel ${fmt(p.ak)}`);if(p.lk)l.push(`Ligaklausel −${Math.round(p.lk*100)} %`);return l.length?`<p class="dim">${l.join(' · ')}</p>`:'';}
