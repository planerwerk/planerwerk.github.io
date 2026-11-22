// Beziehungsnetz (K17 §5.5, U12c): Derbys und Rivalitäten als Grundwert, Änderungen mit Grund, Vergessen (−50 nach einem Jahr etwa −27), Wirkung auf Ablöse,
// Gesprächsbereitschaft und Testspiele, Derby-Ergebnisse, fairer Kauf, Computer-Vereine meiden Vereine unter −50, Anzeige im Büro.
// Aufruf: node tests/beziehungen.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U12c entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711,nah=(a,b,e=0.01)=>Math.abs(a-b)<=e;
function welt(){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);
  const im=(k,fn)=>W.ev('mitStrom')(W.ev('strom')('test',k),fn),nr=k=>W.ev('VEREINE').findIndex(v=>v.kurz===k);return{W,F,S,ev:W.ev,im,nr,B:W.ev('RBZ')};}

// 1. Grundwerte: Derby −30, Rivalität −15, sonst 0. Alle Kürzel in DERBYS gibt es in VEREINE.
{const {F,ev,nr,B}=welt(),D=ev('DERBYS'),fehlt=D.filter(([a,b])=>nr(a)<0||nr(b)<0).map(x=>x[0]+'–'+x[1]);
  const rev=F.bez(nr('BVB'),nr('S04')),kla=F.bez(nr('FCB'),nr('BVB')),null0=F.bez(nr('FCB'),nr('SCP'));
  pruef(!fehlt.length&&rev===B.grund.derby&&kla===B.grund.rivale&&null0===0&&ev('istDerby')(nr('S04'),nr('BVB'))&&!ev('istDerby')(nr('FCB'),nr('BVB')),
    'Grundwerte: Revierderby −30, Klassiker −15, sonst 0, beide Richtungen gleich, alle Kürzel bekannt',fehlt.length?'fehlt: '+fehlt.join(', '):`${rev}, ${kla}, ${null0}`);}

// 2. Änderung mit Grund, Wirkung für dich = deine Beziehung + die deines Vereins
{const {S,F,ev,nr}=welt(),x=nr('KSC');F.bezDuAendern(x,5,'Test');const e=S.bez['d:'+x];
  pruef(F.bezDu(x)===5&&e.g[0][1]===5&&e.g[0][2]==='Test'&&nah(ev('bezWirk')(x),5+F.bez(S.my,x)),'Änderung mit Grund im Verlauf, für deine Geschäfte zählt die Summe (bei Freiburg und Karlsruhe mit dem Baden-Derby)',`du ${F.bezDu(x)}, Verein ${F.bez(S.my,x)}, zusammen ${ev('bezWirk')(x)}`);}

// 3. Vergessen: −50 ist nach zwölf Monaten etwa −27. Ein Derby geht zurück zu −30, nicht zu 0. Nah am Grundwert fällt der Eintrag weg.
{const {S,F,nr}=welt(),a=nr('FCB'),d=[nr('BVB'),nr('S04')];S.bez={['d:'+a]:{v:-50,g:[]}};F.bezAendern(d[0],d[1],-10,'Test');
  for(let i=0;i<12;i++)F.bezVergessen();const v1=F.bezDu(a),v2=F.bez(d[0],d[1]);for(let i=0;i<60;i++)F.bezVergessen();
  pruef(nah(v1,-27,0.5)&&v2<-30&&v2>-36&&!S.bez['d:'+a]&&F.bez(d[0],d[1])===-30,'Vergessen: −50 nach einem Jahr etwa −27, Derby zurück zu −30, am Ende gelöscht',`${v1.toFixed(1)}, Derby ${v2.toFixed(1)}`);}

// 4. Ablöse: bei +100 etwa 15 % weniger, bei −100 etwa 15 % mehr (nur bei deinen Käufen)
{const {S,F,ev,nr}=welt(),x=nr('SCP'),p=ev('squad')(x).sort((a,b)=>b.str-a.str)[0],f0=F.forderung(p);F.bezDuAendern(x,100,'Test');const f1=F.forderung(p);
  S.bez={};F.bezDuAendern(x,-100,'Test');const f2=F.forderung(p);
  pruef(nah(f1/f0,0.85,0.02)&&nah(f2/f0,1.15,0.02),'Ablöse: Beziehung +100 etwa −15 %, −100 etwa +15 %',`${Math.round(f0)} → ${Math.round(f1)} / ${Math.round(f2)}`);}

// 5. Gesprächsbereitschaft: unter −50 lehnt ein Verein etwa jedes zweite Mal schon das erste Gespräch ab
{const {S,F,ev,nr}=welt(),x=nr('SCP'),p=ev('squad')(x)[0];F.bezDuAendern(x,-80,'Test');let ab=0;const n=60;
  for(let i=0;i<n;i++){if(S.verh)delete S.verh[p.id];const r=F.kaufRunde(p,1);if(r.text&&r.text.includes('nicht über'))ab++;}
  pruef(ab>=n*0.3&&ab<=n*0.7,'Gesprächsbereitschaft: unter −50 etwa jedes zweite Mal abgelehnt',`${ab} von ${n}`);}

// 6. Testspiele: Zusage steigt mit der Beziehung und sinkt mit ihr
{const {S,F,ev,nr}=welt(),x=nr('SCP'),d=S.tag+30,z=()=>F.zusageChance(x,d),a=z();F.bezDuAendern(x,100,'Test');const b=z();S.bez={};F.bezDuAendern(x,-100,'Test');const c=z();
  pruef(b>=a&&c<=a&&(b>a||c<a||a===0),'Testspiele: Zusage mit guter Beziehung höher, mit schlechter niedriger',`${a.toFixed(2)} / +100: ${b.toFixed(2)} / −100: ${c.toFixed(2)}`);}

// 7. Derby-Ergebnis: Sieg macht die Rivalität größer (−2), Remis nicht, ein Nicht-Derby bleibt
{const {F,nr,B}=welt(),a=nr('BVB'),b=nr('S04'),c=nr('FCB');F.bezDerbySpiel({h:a,a:b,hg:2,ag:0});const v1=F.bez(a,b);F.bezDerbySpiel({h:a,a:b,hg:1,ag:1});const v2=F.bez(a,b);
  F.bezDerbySpiel({h:c,a:nr('SCP'),hg:3,ag:0});
  pruef(v1===B.grund.derby+B.anlass.derbySieg&&v2===v1&&F.bez(c,nr('SCP'))===0,'Derby: Sieg −2, Remis nichts, kein Derby nichts',`${v1}, ${v2}`);}

// 8. Fairer Kauf: mindestens 90 % der Forderung bringt +5, darunter nichts
{const {S,F,ev,nr,B}=welt(),x=nr('SCP'),p=ev('squad')(x)[0],f=ev('forderungDu')(p);F.bezKaufFair(p,x,f*0.8);const a=F.bezDu(x);F.bezKaufFair(p,x,f*0.95);
  pruef(a===0&&F.bezDu(x)===B.anlass.fair,'Fairer Kauf: ab 90 % der Forderung +5, darunter nichts',`${a} → ${F.bezDu(x)}`);}

// 9. Computer-Vereine kaufen nicht bei einem Verein, zu dem ihre Beziehung unter −50 liegt (vier Wochen Sommerfenster)
{const {S,F,ev,im,nr}=welt(),x=nr('SCP'),log=[],orig=F.kiWechsel;S.teams.forEach(t=>{if(t.id!==x)F.bezAendern(t.id,x,-60,'Test');});
  F.kiWechsel=function(p,b,preis,art){log.push(p.team);return orig(p,b,preis,art);};S.tag=5;for(let i=0;i<4;i++)im('bz'+i,()=>F.kiMarkt());
  const gelistet=ev('squad')(x).filter(p=>p.list).length;
  pruef(!log.includes(x)&&log.length>0,'Computer-Vereine: kein Kauf bei einem Verein unter −50',`${log.length} Wechsel, ${log.filter(v=>v===x).length} von dort, dort gelistet: ${gelistet}`);}

// 10. Anzeige im Büro: mit dem Derby deines Vereins (Freiburg: Baden-Derby gegen Karlsruhe) steht eine Karte da
{const {S,F,ev,nr}=welt(),h=F.beziehungenKarte(),k=F.bezKarte(nr('KSC'));
  pruef(h.includes('Beziehungen')&&h.includes(S.teams[nr('KSC')].name)&&k.includes('Baden-Derby'),'Anzeige: Büro mit den Beziehungen (Derby dabei), Spielerkarte mit Grund',`Verein ${ev('myT()').name}`);}

// 11. Brisanz (K17 §5.2, K09 §5.1, K09d): Derby oder Beziehung zweier Vereine unter −50 ist brisant. Dort gibt es nach Fouls mehr Karten (×1,3).
//     Dieselben 200 Spiele (gleiche Tage, gleiche Ströme) einmal ohne, einmal mit Brisanz: mindestens 10 % mehr Karten. Testspiele zählen nie als brisant.
{const {S,F,ev,nr,B}=welt(),br=ev('spielBrisant'),a=nr('BVB'),b=nr('S04'),c=nr('FCB'),d=nr('SCP');const derby=br(a,b),vorher=br(c,d);
  const karten=o=>{let n=0;for(let k=0;k<200;k++){S.season=5000+Math.floor(k/100);S.tag=k%100;const r=F.sim(c,d,o);n+=r.ev.filter(e=>e.p!=null&&(e.t==='Y'||e.t==='R')).length;}return n;};
  const ohne=karten({});F.bezAendern(c,d,-90,'Test');const nachher=br(c,d),mit=karten({}),test=karten({test:1,wb:'test'});
  pruef(derby&&!vorher&&nachher&&mit>=ohne*1.1&&test<mit,'Brisanz: Derby und Beziehung unter −50 bringen mehr Karten, Testspiele nicht',`Derby ${derby}, vorher ${vorher}, nachher ${nachher}, Karten ohne ${ohne}, mit ${mit}, Testspiel ${test}`);}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
