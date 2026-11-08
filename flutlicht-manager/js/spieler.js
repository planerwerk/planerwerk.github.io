// Spielermodell (Konzept K03): Zustand im Spiel, Frische, Kondition, Form, Selbstvertrauen, Spielpraxis, Entwicklung an jedem Spieltag.
// Alle Zahlen stehen in daten/regeln.js unter REGELN.spieler.

// Zustandsfaktor (K03 §5.8): Frische, Form und Spielpraxis zusammen, gedeckelt. Die Stärke bleibt der Hauptwert.
function zustand(p){const Z=RP.zustand,F=RP.form,P=RP.spielpraxis,k=RE.staerke;
  const fr=k.fitBasis+k.fitAnteil*p.fit/100,fo=1+(p.form-F.mitte)*F.wirkung,pr=p.sp<P.wirkungUnter?1-P.wirkungMax*(P.wirkungUnter-p.sp)/P.wirkungUnter:1;
  return clamp(fr*fo*pr,Z.min,Z.max);}
// Trainingsstufe (bis K07): eigener Verein nach Einstellung, Computer-Vereine normal, Vereinslose locker
const trainingsStufe=p=>p.team===S.my?S.train:p.team>=0?RT.computerStufe:0;

// Frische-Erholung pro Tag (K03 §5.3): Wer müde ist, erholt sich anfangs schneller
function erholung(p){const F=RP.frische,a=F.alter.find(x=>p.age<=x[0]);return(F.erholung[0]+F.erholung[1]*(100-p.fit))*(a?a[1]:F.alterSonst)*(F.koErholung[0]+F.koErholung[1]*p.ko);}
// Werte pro Tag: Spielpraxis zerfällt, Frische erholt sich minus Trainingslast, Kondition sinkt im Urlaub und bei Verletzung
function tagesWerte(p,urlaub,spieltOderRuhetag){const F=RP.frische,K=RP.kondition;
  p.sp*=RP.spielpraxis.zerfall;
  if(urlaub){p.ko=Math.max(0,p.ko-K.urlaub);p.fit=Math.min(100,p.fit+erholung(p));return;}
  if(p.inj>0)p.ko=Math.max(0,p.ko-K.verletzt);
  const last=spieltOderRuhetag||p.inj>0||p.team<0?0:F.training[trainingsStufe(p)];
  p.fit=clamp(p.fit+erholung(p)-last,0,100);}
// Werte pro Woche: Kondition wandert zum Trainingsziel, Form und Selbstvertrauen ziehen zur Mitte
function wochenWerte(p){const K=RP.kondition,F=RP.form,V=RP.selbstvertrauen;
  if(!imUrlaub()){const ziel=(p.team<0?K.vereinslos:K.ziel[trainingsStufe(p)])-Math.max(0,p.age-K.altAb)*K.altJeJahr;p.ko=clamp(p.ko+(ziel-p.ko)*K.tempo,0,100);
    if(p.team>=0&&p.inj<=0)p.sp=Math.min(100,p.sp+RP.spielpraxis.training);}
  p.form+=(F.mitte-p.form)*F.ausgleich;p.sv-=p.sv*V.ausgleich;}
// Frische und Spielpraxis nach einem Pflichtspiel
function nachSpiel(p,min){const F=RP.frische;p.fit=clamp(p.fit-F.spiel*min/90*(F.ko[0]+F.ko[1]*p.ko),RE.fitnessMin,100);p.sp=Math.min(100,p.sp+RP.spielpraxis.jeSpiel*min/90);}

// Entwicklung der Stärke für die Tage seit der letzten Buchung (K03 §5.1)
function entwickeln(p,tage){if(tage<=0)return;const E=RP.entwicklung,P=E.praxis;
  const zeile=a=>E.alter.find(x=>a<=x[0])||[99,E.sonst[0],E.sonst[1]];
  const wachs=zeile(p.age)[1],abb=zeile(p.age+E.positionsAlter[p.pos])[2]*E.abbau[p.pos];
  const rest=clamp((p.pot-p.str)/E.talentWeich,0,1),fa=Math.pow(E.formBasis,p.form-RP.form.mitte),fb=1/fa;
  let pa=p.sp>=P.hoch?P.auf:p.sp<P.tief?P.aufTief:1,pb=p.sp<P.tief&&p.age>=P.abTiefAb?P.abTief:1;
  if(p.age<=P.halbBis){pa=1+(pa-1)/2;pb=1+(pb-1)/2;}
  const prof=profi(p),tr=E.training[trainingsStufe(p)];
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
function formNachNote(p,note,erwNote){const F=RP.form;p.form=clamp(p.form+F.jeNote*(erwNote-note),F.min,F.max);}
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
    else if((e.art==='rel'||e.art==='rel2')&&relBereit(e.art))relTeams(e.art).forEach(id=>s.add(id));}
  return s;}
