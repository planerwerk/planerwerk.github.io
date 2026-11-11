// Scouting und Informationsnebel (Konzept K18, U9a). Zahlen in daten/regeln.js unter REGELN.scouting (Kurzform RSC).
// Jeder Spieler hat echte Werte. Was du von fremden Spielern siehst, hängt von der Kenntnis deines Vereins ab (0–100):
// die Stärke als Spanne, Merkmale erst ab einer gewissen Kenntnis. Die Spanne ist ehrlich: Der wahre Wert liegt in mindestens 80 % der Fälle darin.
// Die Fehler sind je Spieler fest und kommen aus dem Seed, nicht aus einem Zufallsstrom: Neuladen ändert nichts, mehr Kenntnis rückt die Mitte an die Wahrheit.

// Standardnormaler Wert je Schlüssel (Box-Muller aus zwei Hash-Zahlen)
function hashNormal(...k){const h=hash32([S.seed,...k].join('|')),a=(mix32(h,1)+0.5)/4294967296,b=(mix32(h,2)+0.5)/4294967296;return Math.sqrt(-2*Math.log(a))*Math.cos(2*Math.PI*b);} // nachgemischt, sonst leicht schief
// Grundkenntnis (K18 §3.1): was jeder weiß, ohne zu beobachten. Ausland und Jugend kommen mit K32 und K08.
function grundKenntnis(p){const G=RSC.grund;if(p.team===S.my)return G.eigen;const t=S.teams[p.team];if(p.team<0||!t||t.lg>3)return G.unten;return t.lg===myT().lg?G.liga:G.deutsch;}
const kenntnisEintrag=p=>(S.kenntnis||{})[p.id];
function kenntnis(p){const g=grundKenntnis(p),e=kenntnisEintrag(p);return e?Math.max(g,Math.round(e.k)):g;}
const sichtBreite=k=>{for(const[b,w]of RSC.sicht)if(k<b)return w;return RSC.sicht[RSC.sicht.length-1][1];};
// Streuung des Grundfehlers eines Scouts (K18 §5.2, kalibriert): 0,15 × (21 − Qualität)
const scoutFehler=q=>RSC.fehler.je*(21-q);
// Lieblingstyp (aus der Nummer des Scouts, bei etwa 30 %): überschätzt diesen Typ um 2–4
function lieblingstyp(x){if(!x||x.r!=='scout')return null;const h=hash32('lt|'+x.id),F=RSC.fehler;if(h%100>=F.lieblingsChance*100)return null;
  return{typ:['schnell','kopfballstark','jung'][(h>>>8)%3],plus:F.lieblingstyp[0]+(h>>>12)%(F.lieblingstyp[1]-F.lieblingstyp[0]+1)};}
const LIEBLINGSTYP_NAME={schnell:'schnelle Spieler',kopfballstark:'Kopfballspieler',jung:'junge Spieler'};
const passtTyp=(p,typ)=>typ==='jung'?p.age<=21:hatMk(p,typ);
// Spezialgebiet (aus der Nummer des Scouts): Inland, Jugend oder Ausland. Ausland bringt erst mit dem Auslandspool (K32) Vorteile.
const scoutGebiet=x=>['inland','inland','jugend','ausland'][hash32('gb|'+x.id)%4];
const GEBIET_NAME={inland:'Inland',jugend:'Jugend',ausland:'Ausland'};
function gebietFaktor(x,p){const g=scoutGebiet(x),P=RSC.proWoche;if(g==='jugend')return p.age<=21?P.gebiet:P.fremd;return g==='inland'?P.gebiet:P.fremd;}
const scoutVon=id=>(S.stab||[]).find(x=>x.id===id);

// Sicht auf die Stärke (K18 §3.2, §5.2): Mitte und Spanne. Eigene Spieler genau.
function staerkeSicht(p){if(p.team===S.my)return{genau:true,mitte:p.str,lo:Math.round(p.str),hi:Math.round(p.str),k:100};
  const k=kenntnis(p),sk=sichtBreite(k)/RSC.z,e=kenntnisEintrag(p),sc=(e&&e.s||[]).map(scoutVon).filter(Boolean);
  let mitte=p.str+hashNormal('k',p.id)*sk,v=sk*sk,bias=0;
  if(sc.length){let sum=0,vs=0;sc.forEach(x=>{const sd=scoutFehler(x.q),lt=lieblingstyp(x);sum+=hashNormal('s',x.id,p.id)*sd;vs+=sd*sd;if(lt&&passtTyp(p,lt.typ))bias+=lt.plus;});
    mitte+=sum/sc.length;v+=vs/(sc.length*sc.length);bias/=sc.length;mitte+=bias;}
  const h=Math.max(1,RSC.z*Math.sqrt(v)+Math.abs(bias)); // ehrlich: die Spanne deckt Fehler und Vorliebe ab
  return{genau:false,mitte,lo:clamp(Math.round(mitte-h),1,99),hi:clamp(Math.round(mitte+h),1,99),k};}
const staerkeText=p=>{const s=staerkeSicht(p);return s.lo===s.hi?String(s.lo):`${s.lo}–${s.hi}`;};
// Öffentliche Mitte (nur Grundkenntnis): Grundlage für den Marktwert fremder Spieler, damit er nichts verrät
const publikMitte=p=>p.str+hashNormal('k',p.id)*sichtBreite(grundKenntnis(p))/RSC.z;
const wertSicht=p=>p.team===S.my?value(p):value(Object.assign({},p,{str:clamp(publikMitte(p),1,99)}));
// Merkmale je Kenntnis (K18 §3.2): unter 20 nichts, bis 39 das Auffälligste, bis 59 die Stärken, ab 60 alles
function merkmaleSicht(p){const alle=sichtbareMerkmale(p);if(p.team===S.my)return{liste:alle,hinweis:''};const k=kenntnis(p),st=alle.filter(m=>!RP.merkmale[m].schwaeche);
  if(k<20)return{liste:[],hinweis:'unbekannt (Kenntnis unter 20)'};if(k<40)return{liste:st.slice(0,1),hinweis:'nur das Auffälligste (Kenntnis unter 40)'};
  if(k<60)return{liste:st,hinweis:'Schwächen unbekannt (Kenntnis unter 60)'};return{liste:alle,hinweis:''};}
// Empfehlung (K18 §5.3): Mitte gegen deinen besten Spieler auf derselben Position
function empfehlung(p){const E=RSC.empfehlung,s=staerkeSicht(p),best=squad(S.my).filter(q=>q.pos===p.pos).sort((a,b)=>b.str-a.str)[0];if(!best)return'verpflichten';
  const d=s.mitte-best.str;return d>=E.verpflichten?'verpflichten':d>=E.beobachten?'beobachten':'kein Bedarf';}

// ---------- Aufträge (K18 §4): Spieler beobachten (1–3 Wochen) oder Suchauftrag. Ein Scout hat einen Auftrag zur Zeit. ----------
const meineScouts=()=>stabVon(S.my,'scout');
const scoutFrei=x=>!(S.auftraege||[]).some(a=>a.scout===x.id);
const auftragFuer=pid=>(S.auftraege||[]).find(a=>a.art==='spieler'&&a.pid===pid);
function beobachtenLauf(pid,scoutId,wochen){const p=PIX.get(pid),x=meineScouts().find(y=>y.id===scoutId);
  if(!p||p.team===S.my)return'Diesen Spieler kennst du schon genau.';if(!x)return'Dieser Scout arbeitet nicht für dich.';if(!scoutFrei(x))return`${x.n} hat schon einen Auftrag.`;if(auftragFuer(pid))return'Er wird schon beobachtet.';
  S.auftraege=[...(S.auftraege||[]),{art:'spieler',scout:x.id,pid,rest:clamp(Math.round(wochen)||1,1,3),von:absTag(S.tag)}];
  news(`Scout ${x.n} beobachtet ${p.n} (${clamp(Math.round(wochen)||1,1,3)} Woche${wochen>1?'n':''}).`);return'';}
function sucheLauf(scoutId,krit){const x=meineScouts().find(y=>y.id===scoutId);if(!x)return'Dieser Scout arbeitet nicht für dich.';if(!scoutFrei(x))return`${x.n} hat schon einen Auftrag.`;
  const k={pos:['TW','AB','MF','ST'].includes(krit.pos)?krit.pos:'',alterBis:clamp(+krit.alterBis||40,16,40),abloeseBis:Math.max(0,+krit.abloeseBis||0)};
  S.auftraege=[...(S.auftraege||[]),{art:'suche',scout:x.id,krit:k,kand:[],gesehen:[],von:absTag(S.tag)}];news(`Suchauftrag an ${x.n}: ${k.pos||'alle Positionen'}, bis ${k.alterBis} Jahre${k.abloeseBis?`, Ablöse bis ${k.abloeseBis} Mio €`:''}.`);return'';}
function auftragEnde(scoutId){S.auftraege=(S.auftraege||[]).filter(a=>a.scout!==scoutId);}
// Aufträge von Scouts, die nicht mehr für dich arbeiten, fallen weg (Entlassung, Vertragsende)
function auftraegeAufraeumen(){S.auftraege=(S.auftraege||[]).filter(a=>{const x=scoutVon(a.scout);return x&&x.team===S.my;});}
function kenntnisPlus(p,x,f){const P=RSC.proWoche,g=x?P.basis*(P.q[0]+P.q[1]*x.q)*gebietFaktor(x,p)*f:f,S0=S.kenntnis=S.kenntnis||{},e=S0[p.id]||(S0[p.id]={k:grundKenntnis(p),s:[]});
  e.k=Math.min(100,Math.max(e.k,grundKenntnis(p))+g);if(x&&!e.s.includes(x.id))e.s.push(x.id);}
// Bericht als Nachricht (K18 §4.5): Spanne, Talent, Merkmale, Empfehlung
function bericht(p,x){const s=staerkeSicht(p),m=merkmaleSicht(p),t=p.team>=0&&S.teams[p.team]?S.teams[p.team].name:'vereinslos';
  news(`Scoutbericht von ${x.n}: ${p.n} (${t}, ${p.age}), Stärke etwa ${s.lo}–${s.hi}${p.age<=23?`, Talent ${stars(p)}`:''}${m.liste.length?`, ${m.liste.map(k=>RP.merkmale[k].name).join(', ')}`:''}. Empfehlung: ${empfehlung(p)}.`,'tr');}
// Suchauftrag je Woche: vier neue Namen nach den Kriterien, beobachtet mit halber Wirkung, die besten acht nach Einschätzung bleiben auf der Liste
function suchWoche(a,x,beob,xi){const C=RSC.suche,k=a.krit,gesehen=new Set(a.gesehen);
  const pool=S.pl.filter(p=>p.team!==S.my&&p.team>=-1&&(p.team<0||aktiv(S.teams[p.team]))&&(!k.pos||p.pos===k.pos)&&p.age<=k.alterBis&&!gesehen.has(p.id)&&(!k.abloeseBis||askPrice(p,xi)<=k.abloeseBis*1e6))
    .sort((p,q)=>publikMitte(q)-publikMitte(p));
  pool.slice(0,C.jeWoche).forEach(p=>{kenntnisPlus(p,x,C.anteil);beob.add(p.id);a.gesehen.push(p.id);});
  a.kand=a.gesehen.map(id=>PIX.get(id)).filter(p=>p&&p.team!==S.my).sort((p,q)=>staerkeSicht(q).mitte-staerkeSicht(p).mitte).slice(0,C.kandidaten[1]).map(p=>p.id);}
// Woche (montags): Aufträge, Kosten, Berichte; Kenntnis verblasst ohne Beobachtung (2 je Monat)
function scoutingWoche(){S.kenntnis=S.kenntnis||{};const beob=new Set();let xi=null;
  (S.auftraege||[]).forEach(a=>{const x=scoutVon(a.scout);if(!x||x.team!==S.my){a.ende=1;return;}money('Scouting',-RSC.kosten.inland);
    if(a.art==='spieler'){const p=PIX.get(a.pid);if(!p||p.team===S.my){a.ende=1;return;}kenntnisPlus(p,x,1);beob.add(p.id);if(--a.rest<=0){a.ende=1;bericht(p,x);}}
    else{if(!xi){xi=new Set();S.teams.forEach(t=>{if(aktiv(t))bestXI(t.id,t.form).forEach(id=>xi.add(id));});}suchWoche(a,x,beob,xi);}});
  S.auftraege=(S.auftraege||[]).filter(a=>!a.ende);
  for(const id in S.kenntnis){if(beob.has(+id))continue;const p=PIX.get(+id),e=S.kenntnis[id];if(!p||p.team===S.my){delete S.kenntnis[id];continue;}
    e.k-=RSC.verblassen*7/30;if(e.k<=grundKenntnis(p))delete S.kenntnis[id];}}
// Nach deinem Pflichtspiel: Wer gegen dich gespielt hat, ist dir etwas besser bekannt (+5)
function scoutingNachSpiel(list){const m=list.find(r=>r.h===S.my||r.a===S.my);if(!m)return;const s=m.h===S.my?1:0;(m.xpo[s]||[]).forEach(([id])=>{const p=PIX.get(id);if(p&&p.team!==S.my)kenntnisPlus(p,null,RSC.grund.jeSpiel);});}
// Scouts beim Aufbau der Welt (eigener Zufallsstrom, damit der übrige Stab gleich bleibt): je Verein nach Ansehen, dazu vereinslose
function scoutsAufbau(){const A=RST.start,Z=RSC.start;S.teams.forEach(t=>{if(!aktiv(t))return;const n=stufenWert(Z.scouts,t.rep);for(let i=0;i<n;i++)S.stab.push(stabNeu('scout',t.rep*A.qualitaetJeAnsehen+ri(A.streuung[0],A.streuung[1])-i,t.id,t.lg));});
  for(let i=0;i<Z.vereinslos;i++)S.stab.push(stabNeu('scout',riA(A.vereinslosQ),-1,2));stabGeaendert();}
