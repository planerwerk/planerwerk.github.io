// Spielermodell (Konzept K03): Zustand im Spiel, Frische, Kondition, Form, Selbstvertrauen, Spielpraxis, Entwicklung an jedem Spieltag.
// Alle Zahlen stehen in daten/regeln.js unter REGELN.spieler.

// Zustandsfaktor (K03 §5.8): Frische, Form und Spielpraxis zusammen, gedeckelt. Die Stärke bleibt der Hauptwert.
function zustand(p){const Z=RP.zustand,F=RP.form,P=RP.spielpraxis,k=RE.staerke;
  const fr=k.fitBasis+k.fitAnteil*p.fit/100,fo=1+(p.form-F.mitte)*F.wirkung,pr=p.sp<P.wirkungUnter?1-P.wirkungMax*(P.wirkungUnter-p.sp)/P.wirkungUnter:1;
  return clamp(fr*fo*pr*stimmungFaktor(p),Z.min,Z.max);} // Stimmung (K14 §5.3): unter 20 bis −3 %, über 85 bis +2 %

// Frische-Erholung pro Tag (K03 §5.3): Wer müde ist, erholt sich anfangs schneller
function erholung(p){const F=RP.frische,a=F.alter.find(x=>p.age<=x[0]);return(F.erholung[0]+F.erholung[1]*(100-p.fit))*(a?a[1]:F.alterSonst)*(F.koErholung[0]+F.koErholung[1]*p.ko)*belastungErholung(p);}
// Werte pro Tag: Spielpraxis zerfällt, Frische erholt sich minus Trainingslast, Kondition sinkt im Urlaub und bei Verletzung
// training: Frische-Änderung aus der Einheit des Tages (K07), negativ = Belastung
function tagesWerte(p,urlaub,training){const K=RP.kondition;
  p.sp*=RP.spielpraxis.zerfall;
  if(urlaub==='laufplan'){laufplanTag(p);p.fit=Math.min(100,p.fit+erholung(p));lastBuchen(p,0);return;}
  if(urlaub){p.ko=Math.max(0,p.ko-K.urlaub);p.fit=Math.min(100,p.fit+erholung(p));p.sb=Math.max(0,(p.sb||0)-RSO.belastung.urlaub);lastBuchen(p,0);return;}
  if(p.inj>0)p.ko=Math.max(0,p.ko-K.verletzt);
  p.fit=clamp(p.fit+erholung(p)+(training||0),0,100);}
// Werte pro Woche: Kondition wandert zum Trainingsziel, Form und Selbstvertrauen ziehen zur Mitte
function wochenWerte(p){const K=RP.kondition,F=RP.form,V=RP.selbstvertrauen;
  if(p.team<0){const ziel=K.vereinslos-Math.max(0,p.age-K.altAb)*K.altJeJahr;p.ko=clamp(p.ko+(ziel-p.ko)*K.tempo,0,100);}
  trainingWoche(p);
  // Sportpsychologe (K16): Selbstvertrauen unter 0 erholt sich schneller
  const ps=p.sv<0&&p.team>=0?Math.min(1/V.ausgleich,1+RST.wirkung.psycho.erholung*stabFaktor(p.team,'psycho')):1;p.form+=(F.mitte-p.form)*F.ausgleich;p.sv-=p.sv*V.ausgleich*ps;}
// Frische und Spielpraxis nach einem Pflichtspiel
function nachSpiel(p,min){const F=RP.frische;p.fit=clamp(p.fit-F.spiel*min/90*(F.ko[0]+F.ko[1]*p.ko)*(hatMk(p,'ausdauernd')?0.75:1),RE.fitnessMin,100);p.sp=Math.min(100,p.sp+RP.spielpraxis.jeSpiel*min/90);
  lastBuchen(p,RT.spielLast*min/90);p.wk=(p.wk||0)+RT.spielKondition*min/90;p.ltag=S.tag;p.lmin=min;p.sb=Math.min(100,(p.sb||0)+min/RSO.belastung.jeMinuten);}

// Entwicklung der Stärke für die Tage seit der letzten Buchung (K03 §5.1)
function entwickeln(p,tage){if(tage<=0)return;const E=RP.entwicklung,P=E.praxis;
  const zeile=a=>E.alter.find(x=>a<=x[0])||[99,E.sonst[0],E.sonst[1]];
  const wachs=zeile(p.age)[1],abb=zeile(p.age+E.positionsAlter[p.pos])[2]*E.abbau[p.pos];
  const rest=clamp((p.pot-p.str)/E.talentWeich,0,1),fa=Math.pow(E.formBasis,p.form-RP.form.mitte),fb=1/fa;
  let pa=p.sp>=P.hoch?P.auf:p.sp<P.tief?P.aufTief:1,pb=p.sp<P.tief&&p.age>=P.abTiefAb?P.abTief:1;
  if(p.age<=P.halbBis){pa=1+(pa-1)/2;pb=1+(pb-1)/2;}
  const prof=profi(p),tr=p.trf||1;
  const schritt=(wachs*rest*fa*pa*tr*(E.profi.auf[0]+E.profi.auf[1]*prof)-abb*fb*pb*(E.profi.ab[0]+E.profi.ab[1]*prof))*tage/E.tageProSaison
    +(R()-0.5)*2*E.zufall*tage/7*(p.age<=E.jung.bisAlter?E.jung.zufall:1);
  p.str=clamp(Math.min(p.str+schritt,Math.max(p.pot,p.str)),RT.staerkeMin,RT.staerkeMax);}
// Professionalität 1–20 (K03 §3.3). Bis die Persönlichkeit kommt, ist jeder durchschnittlich.
const profi=p=>p.ch?p.ch.pro:10;
// Bucht die Entwicklung für einen Spieler bis zum Tag d. Im Urlaub ruht sie.
function entwicklungBuchen(p,d){if(p.ent==null)p.ent=d;if(imUrlaub()){p.ent=d;return;}entwickeln(p,d-p.ent);p.ent=d;}

// Erwartete Ergebnisse aus den erwarteten Toren (Poisson): Sieg, Remis, Niederlage, erwartete Punkte
function erwartung(xgF,xgA){const pk=(l,k)=>{let p=Math.exp(-l);for(let i=1;i<=k;i++)p*=l/i;return p;};let w=0,u=0,n=0;
  for(let a=0;a<=10;a++){const pa=pk(xgF,a);for(let b=0;b<=10;b++){const q=pa*pk(xgA,b);if(a>b)w+=q;else if(a===b)u+=q;else n+=q;}}
  const s=w+u+n;return{sieg:w/s,remis:u/s,niederlage:n/s,punkte:(3*w+u)/s};}
// Form nach dem Spiel aus Note gegenüber erwarteter Note (K03 §5.2). Note: 1 sehr gut bis 6 sehr schlecht.
function formNachNote(p,note,erwNote,k=1){const F=RP.form;p.form=clamp(p.form+F.jeNote*(erwNote-note)*k,F.min,F.max);} // k: Weckruf (K15 §5.4)
// Serie der Mannschaft gegenüber der Erwartung: Punkte der letzten 5 Pflichtspiele minus erwartete Punkte
function serieBuchen(t,punkte,erwPunkte,ids){const F=RP.form.serie;t.erw=(t.erw||[]).concat([[punkte,erwPunkte]]).slice(-F.spiele);if(t.erw.length<F.spiele)return;
  const d=t.erw.reduce((a,x)=>a+x[0]-x[1],0),b=d>=F.abPunkte?F.bonus:d<=-F.abPunkte?-F.bonus:0;
  if(b)ids.forEach(id=>{const p=PIX.get(id);if(p)p.form=clamp(p.form+b,RP.form.min,RP.form.max);});}
const svAendern=(p,v)=>{const V=RP.selbstvertrauen;p.sv=clamp((p.sv||0)+v,V.min,V.max);};
// Selbstvertrauen in Worten (K03 §5.4), 7 Stufen
const SV_WORTE=['am Boden','verunsichert','zweifelnd','normal','sicher','selbstbewusst','strotzt vor Selbstvertrauen'];
const svWort=sv=>SV_WORTE[clamp(Math.round((sv||0)+3),0,6)];

// Welche Vereine spielen an Tag d ein Pflichtspiel? (für Training und Ruhetage)
function spielendeAm(d){const s=new Set();for(const e of termineAm(d)){
    if(e.art==='liga')e.idx.forEach(i=>{const f=S.fx[e.lg][e.md][i];s.add(f[0]);s.add(f[1]);});
    else if(e.art==='pokal'&&S.cup.hist.length===e.r)S.cup.alive.forEach(id=>{if(id<1000)s.add(id);});
    else if((e.art==='rel'||e.art==='rel2')&&relBereit(e.art))relTeams(e.art).forEach(id=>s.add(id));
    else if(e.art==='supercup'){s.add(S.supercup.h);s.add(S.supercup.a);}}
  return s;}

// ---------- U2c: Persönlichkeit, Eigenschaften, Merkmale, Position, Fuß, Talentschätzung ----------
// Normalverteilt näherungsweise (Summe dreier Zufallszahlen), gerundet und begrenzt
const normal=(m,s,a,b)=>clamp(Math.round(m+(R()+R()+R()-1.5)*2*s),a,b);
function waehleGewichtet(obj){const e=Object.entries(obj);let x=R()*e.reduce((a,[,w])=>a+w,0);for(const[k,w]of e){if((x-=w)<=0)return k;}return e[e.length-1][0];}
const stufenWert=(tab,x)=>{let v=tab[0][1];for(const[ab,w]of tab)if(x>=ab)v=w;return v;};
// Startwerte eines neuen Spielers (K03 §5.9): Persönlichkeit, feine Position, Fuß, Merkmale. Echte Spieler: alles per Zufall, bis Fakten-Daten da sind.
function spielerStart(p){const P=RP.persoenlichkeit;p.ch={};P.werte.forEach(k=>p.ch[k]=normal(P.mitte,P.streuung,P.min,P.max));
  p.fp=waehleGewichtet(RP.positionen[p.pos]);p.fuss=R()<RP.fuss.rechts?'R':'L';
  // Mit Seite: Linke Positionen eher Linksfüße, rechte eher Rechtsfüße (ohne harte Regel)
  if(/^L/.test(p.fp)&&R()<0.35)p.fuss='L';if(/^R/.test(p.fp)&&R()<0.35)p.fuss='R';
  p.mk={};const M=RP.startMerkmale,ziel=stufenWert(M.staerken,p.str),anz=Math.floor(ziel)+(R()<ziel%1?1:0),gw=Object.assign({},M.gewichte[p.pos]);
  for(let i=0;i<Math.min(anz,platzStaerken(p));i++){const k=waehleGewichtet(gw);if(!k||gw[k]==null)break;p.mk[k]=1;delete gw[k];if(!Object.keys(gw).length)break;}
  if(p.pos!=='TW'&&R()<M.beidfuessig&&Object.keys(p.mk).length<platzStaerken(p))p.mk.beidfuessig=1;
  const sw=stufenWert(M.schwaechen,p.str),ME=MERKMAL_LISTE||(MERKMAL_LISTE=Object.entries(RP.merkmale)),opts=ME.filter(([k,m])=>m.schwaeche&&m.g.includes(p.pos)&&!ME.some(([k2,m2])=>m2.gegen===k&&p.mk[k2])).map(([k])=>k);
  if(opts.length&&R()<sw)p.mk[pick(opts)]=1;
  p.ls=null;p.wiv=0;p.vt=p.team;p.ekw=riA(RP.entdeckenWochen);p.tf=ri(-RP.talentSchaetzung.fehler,RP.talentSchaetzung.fehler);eigenschaftenNeu(p);}
// Eigenschaften aus der Persönlichkeit. Gespeichert in p.eig (Liste), neu berechnet beim Start und am 1. Juli (Alter, Persönlichkeit).
function eigenschaftenNeu(p){p.eig=eigenschaftenBerechnen(p);}
const eigenschaften=p=>p.eig||(p.eig=eigenschaftenBerechnen(p));
let MERKMAL_LISTE=null,EIGENSCHAFT_LISTE=null; // feste Listen aus den Regeln, einmal aufgebaut (spart Zeit beim Erzeugen vieler Spieler)
function eigenschaftenBerechnen(p){if(!p.ch)return[];const EL=EIGENSCHAFT_LISTE||(EIGENSCHAFT_LISTE=Object.entries(RP.eigenschaften).map(([k,e])=>[k,e,Object.entries(e.wenn)]));
  return EL.filter(([k,e,w])=>w.every(([x,[a,b]])=>p.ch[x]>=a&&p.ch[x]<=b)&&(!e.abAlter||p.age>=e.abAlter)).map(([k])=>k);}
const hatEig=(p,k)=>eigenschaften(p).includes(k);
// Was du über einen Spieler weißt: Eigenschaften eigener Spieler nach einigen Wochen, nur solche, die im Spiel wirken
function bekannteEigenschaften(p){if(p.team!==S.my||p.wiv<p.ekw)return[];return eigenschaften(p).filter(k=>RP.eigenschaftenWirksam.includes(k));}
const sichtbareMerkmale=p=>Object.keys(p.mk||{}).filter(k=>RP.merkmaleWirksam.includes(k));
const hatMk=(p,k)=>!!(p.mk&&p.mk[k]);
// Lernen (K03 §5.6): ein Lernziel, Fortschritt pro Woche
function lernbar(p,k){const m=RP.merkmale[k];if(!m||m.schwaeche||hatMk(p,k)||!m.g.includes(p.pos))return false;if(m.bis&&p.age>m.bis)return false;
  if(Object.keys(p.mk||{}).filter(x=>!RP.merkmale[x].schwaeche).length>=platzStaerken(p))return false;return true;}
// Platz für Stärken: mit der Klasse wächst das Repertoire (bis 64: 1, bis 74: 2, bis 84: 3, sonst 4)
const platzStaerken=p=>{const t=RP.lernen.platz.find(x=>p.str<=x[0]);return Math.min(RP.lernen.maxStaerken,t?t[1]:RP.lernen.maxStaerken);};
const lernOptionen=p=>RP.merkmaleWirksam.filter(k=>lernbar(p,k));
function lernWoche(p){const L=RP.lernen;if(!p.ls||p.inj>0||p.team<0||!genugTraining(p))return;const m=RP.merkmale[p.ls.k];if(!m||!lernbar(p,p.ls.k)){p.ls=null;return;}
  const a=L.alter.find(x=>p.age<=x[0]);let f=L.woche[m.s]*(a?a[1]:L.alterSonst)*(L.profi[0]+L.profi[1]*profi(p))*(L.zufall[0]+R()*(L.zufall[1]-L.zufall[0]));
  if(p.fit<L.frischeUnter[0])f*=L.frischeUnter[1];eigenschaften(p).forEach(e=>{if(L.eigenschaft[e])f*=L.eigenschaft[e];});if(p.wl)f*=1+RT.lernen.einheit;f*=lernStimmung(p);f*=stabFaktor(p.team,'co')*(p.pos==='TW'?stabFaktor(p.team,'torwart'):1);
  p.ls.f=Math.min(100,p.ls.f+f);
  if(p.ls.f>=100)merkmalNeu(p,p.ls.k);}
// Ein Merkmal kommt dazu (gelernt oder als Schwäche entstanden). Eine gelernte Stärke verdrängt ihre Schwäche und beginnt mit vollem Fehlerkonto.
function merkmalNeu(p,k){const m=RP.merkmale[k];p.mk[k]=1;if(p.lf)delete p.lf[k];if(p.ls&&p.ls.k===k)p.ls=null;
  if(!m.schwaeche){if(m.gegen)delete p.mk[m.gegen];(p.fk=p.fk||{})[k]=100;}
  if(p.team===S.my)news(m.schwaeche?`${p.n} hat eine neue Schwäche: ${m.name}.`:`${p.n} hat ein neues Merkmal gelernt: ${m.name}.`,m.schwaeche?'bad':'good');}
function merkmalWeg(p,k,grund){delete p.mk[k];if(p.fk)delete p.fk[k];if(p.team===S.my)news(`${p.n} hat das Merkmal „${RP.merkmale[k].name}“ verloren${grund?' ('+grund+')':''}.`,'bad');}
// Lernen im Spiel (K03 §5.6): Szenen aus der Engine zahlen auf Merkmale ein, ohne Altersfaktor, höchstens 25 % je Merkmal und Spiel.
// Erfolg: Fortschritt zur Stärke und weg von der passenden Schwäche, bei vorhandener Stärke Fehlerkonto auffüllen. Misserfolg: Fortschritt zur Schwäche oder Fehlerkonto belasten.
function lernenImSpiel(r){const L=RP.lernenSpiel,sum=new Map();
  (r.sz||[]).forEach(([id,typ,ok])=>{const z=L.szenen[typ],p=z&&PIX.get(id);if(!p||p.team<0)return;
    if(!sum.has(id))sum.set(id,{p,st:{},sw:{},fk:{}});const e=sum.get(id),add=(o,k,v)=>{o[k]=(o[k]||0)+v*L.faktor;};
    if(ok){if(z.k){if(hatMk(p,z.k))e.fk[z.k]=(e.fk[z.k]||0)+L.konto.erfolg;else add(e.st,z.k,z.ja);}if(z.w&&z.ja)add(e.sw,z.w,-z.ja);return;}
    if(z.zufall&&R()>=z.zufall)return;
    if(z.k&&hatMk(p,z.k)){if(z.kosten)e.fk[z.k]=(e.fk[z.k]||0)-z.kosten;return;}
    if(z.k&&z.nein)add(e.st,z.k,z.nein);if(z.w&&z.minus)add(e.sw,z.w,z.minus);});
  const cap=v=>clamp(v,-L.maxProSpiel,L.maxProSpiel);
  sum.forEach(({p,st,sw,fk})=>{
    for(const k in st){if(!lernbar(p,k))continue;const v=cap(st[k]);if(p.ls&&p.ls.k===k){p.ls.f=clamp(p.ls.f+v,0,100);if(p.ls.f>=100)merkmalNeu(p,k);continue;}
      const f=clamp(((p.lf=p.lf||{})[k]||0)+v,0,100);if(f>0)p.lf[k]=f;else delete p.lf[k];if(f>=100)merkmalNeu(p,k);}
    for(const k in sw){const m=RP.merkmale[k];if(hatMk(p,k)||!m.g.includes(p.pos)||Object.keys(p.mk).some(x=>RP.merkmale[x].gegen===k))continue;
      const f=clamp(((p.lf=p.lf||{})[k]||0)+cap(sw[k]),0,100);if(f>0)p.lf[k]=f;else delete p.lf[k];if(f>=100)merkmalNeu(p,k);}
    for(const k in fk){if(!hatMk(p,k))continue;const f=clamp(((p.fk=p.fk||{})[k]??100)+fk[k],0,100);p.fk[k]=f;if(f<=0)merkmalWeg(p,k,'zu viele Fehlschläge');}
    if(p.lf&&!Object.keys(p.lf).length)delete p.lf;});}
// Woche: Fehlerkonto erholt sich, Altersverlust von Tempo und Ausdauer, ab 33 kann „langsam“ dazukommen (K03 §5.6)
function merkmaleWoche(p){const L=RP.lernenSpiel,A=RP.lernen.altersverlust;
  if(p.lf)for(const k in p.lf){if(RP.merkmale[k].schwaeche){p.lf[k]-=L.schwaecheVerjaehrt;if(p.lf[k]<=0)delete p.lf[k];}}
  if(p.fk)for(const k in p.fk){if(!hatMk(p,k)){delete p.fk[k];continue;}p.fk[k]=Math.min(100,p.fk[k]+L.konto.woche);}
  const pa=p.age+RP.entwicklung.positionsAlter[p.pos],pf=Math.max(A.profiMin,A.profi[0]-A.profi[1]*profi(p));
  if(pa>=A.ab)A.merkmale.forEach(k=>{if(hatMk(p,k)&&R()<A.woche*pf)merkmalWeg(p,k,'Alter');});
  if(pa>=A.langsamAb&&p.pos!=='TW'&&!hatMk(p,'langsam')&&!hatMk(p,'schnell')&&R()<A.langsam*pf)merkmalNeu(p,'langsam');}
// Lernplätze (K07 §12 Nr. 4): je Verein höchstens 5 Spieler mit Lernziel. Freie Plätze vergibt der Co-Trainer (K16), bei dir nur, wenn die Automatik an ist.
// Er nimmt die jüngsten Spieler zuerst (sie lernen schneller) und wählt ein Merkmal, das zur Position passt.
function lernAutomatik(p){const o=lernOptionen(p);if(!o.length)return false;const g=RP.startMerkmale.gewichte[p.pos]||{},w={};o.forEach(k=>w[k]=(g[k]||0.3));p.ls={k:waehleGewichtet(w),f:0};return true;}
const lernPlaetze=tid=>stabPlaetze(tid);
function lernplaetzeVergeben(){const nach=new Map();S.pl.forEach(p=>{if(p.team>=0){if(!nach.has(p.team))nach.set(p.team,[]);nach.get(p.team).push(p);}});
  nach.forEach((sq,tid)=>{const n=lernPlaetze(tid),mit=sq.filter(p=>p.ls),um=sq.filter(p=>p.um&&!p.ls).length;
    if(mit.length>n)mit.sort((a,b)=>(b.ls.selbst?1:0)-(a.ls.selbst?1:0)||b.ls.f-a.ls.f).slice(n).forEach(p=>p.ls=null);
    if(tid===S.my&&!RP.lernen.automatik)return;let frei=n-Math.min(n,mit.length+um);if(frei<=0)return;
    for(const p of sq.filter(p=>!p.ls&&p.inj<=0).sort((a,b)=>a.age-b.age||b.str-a.str)){if(frei<=0)break;if(lernAutomatik(p))frei--;}});}
// Woche: Zeit im Verein, neue Spieler (Talentschätzung neu), Lernen
function wocheVerein(p){if(p.team!==p.vt){p.vt=p.team;p.wiv=0;p.ekw=riA(RP.entdeckenWochen);p.tf=ri(-RP.talentSchaetzung.fehler,RP.talentSchaetzung.fehler);}else p.wiv=(p.wiv||0)+1;
  lernWoche(p);umschulungWoche(p);merkmaleWoche(p);p.wt=0;p.wl=0;}
// Talentsterne mit Schätzfehler (K03, K02): bis zu einem Stern daneben, nach zwei Jahren im Verein genau
// Talentsterne: genau nach zwei Jahren, mit gutem Co-Trainer früher (K16 §5.2: Faktor 1,5 − 0,05 × Qualität)
const sternFehler=p=>p.team===S.my&&(stufe().sterneGenau||p.wiv>=RP.talentSchaetzung.genauNachWochen*stufe().sterneWochen*(S.stab?1.5-0.05*stabQ(S.my,'co'):1))?0:(p.tf||0);
