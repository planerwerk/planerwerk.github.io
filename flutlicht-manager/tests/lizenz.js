// Einstieg mit Lernstufen (K36 §10, UL): gleiche Welt mit Lernstufen und mit Automatik, kein Nachteil gegenüber einem Computer-Verein,
// Tempo des Aufstiegs (neugierig und gemütlich), keine Halte aus gesperrten Bereichen, jede Funktion hat eine Lizenz, Überspringen und Abschalten,
// die Automatik im Einzelnen (Sponsor, Sperren an Aktionen, Verträge, Testspiele).
// Aufruf: node tests/lizenz.js [Seeds für „kein Nachteil“=6] [Seed=5]. Nur Node.js.
const fs=require('fs'),path=require('path');
const {neueWelt,saisons,ROOT}=require('./sim');
const SEEDS=+(process.argv[2]||6),SEED=+(process.argv[3]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const mw=a=>a.reduce((x,y)=>x+y,0)/(a.length||1);
const welt=(an=true,verein=6)=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=verein;S.mgr='Test';F.setTarget();F.lizenzStart(an);F.sponsOffers();S.lineup=F.bestXI(verein,W.ev('myT()').form);return{W,F,S,ev:W.ev};};
// Alle Bereiche mit Automatik oberhalb des Teamleiters dem Stab geben (so läuft ein Spiel ohne Lernstufen wie eines mit gesperrten Bereichen)
const allesAuto=(S,ev,auchElf)=>{const B=ev('RLZ').bereiche;for(const b in B)if(B[b].auto&&(B[b].ab>1||auchElf))S.lizenz.auto[b]=1;};
const punkte=(S,F,id)=>{const lg=S.teams[id].lg,r=F.table(lg).find(x=>x.id===id);return r?r.p:0;};

// 1. Jede Funktion hat eine Lizenz (K36 §10): alle abgefragten Bereiche stehen in den Regeln, jeder Bereich ab der C-Lizenz hat eine Sperre an seiner Aktion
{const {ev}=welt(),B=ev('RLZ').bereiche,dateien=fs.readdirSync(path.join(ROOT,'js')).filter(f=>f.endsWith('.js')),code={};dateien.forEach(f=>code[f]=fs.readFileSync(path.join(ROOT,'js',f),'utf8'));
  const alles=Object.values(code).join('\n'),genutzt=new Set(),unbekannt=new Set();
  for(const m of alles.matchAll(/\b(?:darf|frei|autoB|lzHinweis|lzAus|stabMacht|lzAusAlle|lzHinweisAlle)\(([^()]*)\)/g))for(const k of m[1].matchAll(/'([a-z0-9]+)'/gi)){const b=k[1];if(B[b])genutzt.add(b);else if(!ev('RLZ').aufgabenNamen[b]&&!['SD','SO','form','stil','ein'].includes(b))unbekannt.add(b);}
  pruef(!unbekannt.size,'Jeder abgefragte Bereich steht in REGELN.lizenz.bereiche',unbekannt.size?[...unbekannt].join(', '):`${genutzt.size} Bereiche im Code`);
  const mitSperre=new Set();for(const m of alles.matchAll(/darf\(([^;]*?)\)\)?(?:return|\|\|)/g))for(const k of m[1].matchAll(/'([a-z0-9]+)'/gi))if(B[k[1]])mitSperre.add(k[1]);
  const ohne=Object.keys(B).filter(b=>B[b].ab>1&&!mitSperre.has(b));
  pruef(!ohne.length,'Jeder Bereich ab der C-Lizenz hat eine Sperre an seiner Aktion',ohne.length?'ohne Sperre: '+ohne.join(', '):`${mitSperre.size} Bereiche mit Sperre`);
  // Aktionen des Spielers: jede Funktion in js/aktionen.js prüft ihren Bereich (Ausnahmen: Helfer ohne Entscheidung)
  const helfer=['tab','bauLabel','bauKosten','bauWochen','bauVoll','abfindung','sgVerfahren'],fehlt=[];
  for(const m of code['aktionen.js'].matchAll(/^function (\w+)\([^)]*\)\{(.*)$/gm)){if(!helfer.includes(m[1])&&!/darf\(/.test(m[2]))fehlt.push(m[1]);}
  pruef(!fehlt.length,'Jede Aktion in js/aktionen.js prüft ihren Bereich',fehlt.join(', ')||null);
  const live=['liveZuruf','liveSpielerZuruf','liveTaktik','liveRein','liveAnsprache','liveReihe'].filter(f=>{const m=code['live.js'].match(new RegExp('^function '+f+'\\([^)]*\\)\\{(.*)$','m'));return !m||!(/darf\(/.test(m[1])||f==='liveRein');});
  pruef(!live.length,'Eingriffe im Live-Spiel prüfen ihren Bereich',live.join(', ')||null);
  const A=ev('RLZ').aufstieg,namen=ev('RLZ').aufgabenNamen,gez=new Set();for(const m of alles.matchAll(/(?:darf\([^;]*?,|aufgabe\()\s*'(\w+)'\)/g))gez.add(m[1]);
  const nie=A.filter(Boolean).flatMap(x=>x.aufgaben).filter(k=>!gez.has(k)||!namen[k]);
  pruef(!nie.length,'Jede Aufgabe für den Aufstieg wird irgendwo gezählt und hat einen Namen',nie.join(', ')||null);}

// 2. Sperren und Automatik im Einzelnen
{const {S,F,ev}=welt(true),t=ev('myT()'),stil=t.stil,vorlage=t.vorlage,preis=t.price,kap=t.kap,cap=t.cap;
  F.setStil('pressing');F.setVorlage('schonen');F.setPrice(99);F.startBuild('cap');F.loan(5);F.setEinstellung('saison');F.setTac('SO');
  pruef(t.stil===stil&&t.vorlage===vorlage&&t.price===preis&&!S.constr&&S.loan===0&&(t.einstellung||'normal')==='normal'&&t.tac!=='SO','Gesperrte Aktionen ändern nichts (Stil, Vorlage, Preis, Ausbau, Kredit, Einstellung, sehr offensiv)');
  F.setTac('O');F.setForm('4-3-3');pruef(t.tac==='O'&&t.form==='4-3-3'&&S.lizenz.aufgaben.ordnung===1,'Als Teamleiter frei: Grundordnung und Ausrichtung in drei Stufen, die Aufgabe zählt');
  pruef(!S.sponsOffers&&S.spons&&S.news.some(n=>n.t.includes('Sponsorvertrag')),'Sponsor: Der Verein nimmt sofort das höchste feste Angebot',S.spons&&S.spons.name);
  const frei=ev('frei'),autoB=ev('autoB');
  pruef(frei('aufstellung')&&!autoB('aufstellung')&&!frei('stil')&&autoB('stil')&&!frei('stadion')&&!autoB('stadion')&&autoB('sportgericht'),'Teamleiter: Aufstellung bei dir, Stil und Sportgericht beim Stab, Stadion ruht');
  const h=ev('V').aufst(),hk=ev('V').kabine();pruef(/gesperrt/.test(h)&&/frei ab der C-Lizenz/.test(h)&&/id="stilsel"[^>]*disabled/.test(h)&&/frei ab der C-Lizenz/.test(hk),'Gesperrtes ist sichtbar, aber aus, mit Hinweis „frei ab der …“');
  // Überspringen
  F.lizenzHolen();pruef(S.lizenz.stufe===2&&S.lizenz.karte&&S.lizenz.karte.stufe===2&&S.lizenz.verlauf[1].wie==='geholt'&&frei('stil')&&autoB('stil'),'Überspringen: C-Lizenz sofort, Karte da, neu freie Bereiche bleiben zuerst in der Automatik');
  F.setStil('pressing');pruef(t.stil==='pressing'&&!autoB('stil')&&S.lizenz.aufgaben.stil===1,'Wer eingreift, übernimmt den Bereich: Stil gesetzt, Automatik aus, Aufgabe gezählt');
  F.lizenzAuto('stil',1);pruef(autoB('stil'),'Ein freier Bereich lässt sich dem Stab zurückgeben');
  const kd=ev('lizenzKarte')();pruef(/Neue Lizenz: C-Lizenz/.test(kd)&&/Spielstil/.test(kd)&&/Hingehen/.test(kd),'Aufstiegskarte nennt die neuen Bereiche und was der Stab bisher getan hat');
  // Abschalten
  F.lizenzAbschalten();const B=ev('RLZ').bereiche;
  pruef(!S.lizenz.an&&Object.keys(B).every(b=>frei(b))&&autoB('sportgericht')&&!S.lizenz.karte,'Abschalten: sofort alles frei, bisher Gesperrtes läuft weiter in der Automatik');
  F.startBuild('cap');pruef(!!S.constr,'Nach dem Abschalten geht auch der Stadionausbau');
  pruef(typeof F.lizenzEinschalten==='undefined'&&ev('aufstiegStand')()===null,'Wieder einschalten gibt es im laufenden Spiel nicht');}

// 3. Tempo des Aufstiegs als Rechnung (K36 §5.3): Mindestzeit und Aufgaben, frühestens, spätestens
{const {S,F,ev}=welt(true),L=S.lizenz,A=ev('RLZ').aufstieg,st=()=>ev('aufstiegStand')(),tun=k=>{L.aufgaben[k]=1;},jan=()=>ev('tagAusDatum')(`${S.season+1}-01-01`,S.season);
  const setze=(stufe,ks,tag,spiele)=>{L.stufe=stufe;L.s0=S.season-(ks-1);S.tag=tag;L.spiele=spiele;L.aufgaben={};L.gel={sportgericht:1,medizin:1};};
  // neugierig
  setze(1,1,60,3);A[1].aufgaben.slice(0,3).forEach(tun);const c0=st().reif;L.spiele=4;const c1=st().reif;
  setze(2,1,120,10);A[2].aufgaben.slice(0,3).forEach(tun);const b1=st().reif;
  setze(3,1,200,10);A[3].aufgaben.slice(0,3).forEach(tun);const a0=st().reif;setze(3,2,100,10);A[3].aufgaben.slice(0,3).forEach(tun);const a1=st().reif;
  setze(4,2,300,12);A[4].aufgaben.slice(0,2).forEach(tun);const p0=st().reif;setze(4,3,5,0);A[4].aufgaben.slice(0,2).forEach(tun);const p1=st().reif;L.spiele=12;const p2=st().reif;
  pruef(!c0&&c1&&b1&&!a0&&a1&&!p0&&!p1&&p2,'Neugierig: C nach 4 Pflichtspielen und 3 Aufgaben, B 10 Spiele später, A frühestens in der zweiten Saison, Pro frühestens nach der zweiten',[c0,c1,b1,a0,a1,p0,p1,p2].map(x=>x?'ja':'nein').join(' '));
  // gemütlich: ohne jede Aufgabe nur die späteste Zeit
  setze(1,1,100,11);const g0=st().reif;L.spiele=12;const g1=st().reif;
  setze(2,1,330,40);const g2=st().reif;setze(2,2,0,0);const g3=st().reif;
  setze(3,2,jan()-1,20);const g4=st().reif;S.tag=jan();const g5=st().reif;
  setze(4,3,jan()-1,20);const g6=st().reif;S.tag=jan();const g7=st().reif;
  pruef(!g0&&g1&&!g2&&g3&&!g4&&g5&&!g6&&g7,'Gemütlich: C nach 12 Pflichtspielen, B am 1. Juli, A am 1. Januar der zweiten, Pro am 1. Januar der dritten Saison',[g0,g1,g2,g3,g4,g5,g6,g7].map(x=>x?'ja':'nein').join(' '));
  // ohne Gelegenheit: Sportgericht und Medizin zählen, wenn es bis zur Mindestzeit keine Gelegenheit gab
  setze(4,3,50,12);L.gel={};const o1=st();L.gel={sportgericht:1,medizin:1};const o2=st();
  pruef(o1.reif&&o1.erledigt===2&&!o2.reif&&o2.erledigt===0,'Aufgaben ohne Gelegenheit zählen ab der Mindestzeit als erledigt',`${o1.erledigt} gegen ${o2.erledigt}`);
  setze(5,3,50,0);pruef(st()===null,'Mit der Pro-Lizenz ist Schluss');}

// 4. Zwei Saisons mit Lernstufen ohne Eingriffe gegen zwei Saisons ohne Lernstufen mit Automatik: gleiche Welt (K36 §10), dazu Halte und Lizenzen
{
  // Lauf ohne Lernstufen, in dem jeder Bereich mit Automatik beim Stab liegt
  const autoLauf=()=>{const {W,F}=neueWelt();F.buildWorld(SEED);let S=W.S;S.my=6;S.mgr='Simulator';F.setTarget();F.lizenzStart(false);allesAuto(S,W.ev);F.sponsOffers();S.lineup=F.bestXI(6,W.ev('myT()').form);const erg=[];let fertig=0,n=0;
    const job=()=>{const S=W.S;if(!S.fired)return;if(!S.jobs||!S.jobs.length)F.mkJobs();const id=S.jobs[0];S.my=id;S.fired=0;S.trust=W.ev('RV').neuerJob;S.offers=[];S.constr=null;S.loan=0;S.fin={};S.att=[0,0];F.setTarget();S.spons=null;F.sponsOffers();S.lineup=F.bestXI(id,W.ev('myT()').form);};
    while(fertig<2&&n<5000){n++;S=W.S;if(S.sponsOffers)F.sponsorWaehlen(0);if(S.phase==='end'){erg.push(JSON.stringify(S.res));fertig++;job();if(fertig>=2)break;F.sommerpause();continue;}job();if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();}return erg;};
  const mitLauf=()=>{const {W,F}=neueWelt();F.buildWorld(SEED);let S=W.S;S.my=6;S.mgr='Simulator';F.setTarget();F.lizenzStart(true);F.sponsOffers();S.lineup=F.bestXI(6,W.ev('myT()').form);const erg=[],halte={},liz=[];let fertig=0,n=0,wochen=0;
    const job=()=>{const S=W.S;if(!S.fired)return;if(!S.jobs||!S.jobs.length)F.mkJobs();const id=S.jobs[0];S.my=id;S.fired=0;S.trust=W.ev('RV').neuerJob;S.offers=[];S.constr=null;S.loan=0;S.fin={};S.att=[0,0];F.setTarget();S.spons=null;F.sponsOffers();S.lineup=F.bestXI(id,W.ev('myT()').form);};
    while(fertig<2&&n<5000){n++;S=W.S;if(S.sponsOffers)F.sponsorWaehlen(0);if(S.phase==='end'){erg.push(JSON.stringify(S.res));liz.push({stufe:S.lizenz.stufe,kader:S.pl.filter(p=>p.team===S.my).length});fertig++;job();if(fertig>=2)break;F.sommerpause();continue;}job();
      if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();const g=W.ev('haltGrund(S.tag)');if(g)halte[g]=(halte[g]||0)+1;}return{erg,halte,liz,S:W.S,W};};
  const a=mitLauf(),b=autoLauf();
  pruef(a.erg.length===2&&a.erg[0]===b[0]&&a.erg[1]===b[1],'Gleiche Welt: zwei Saisons mit Lernstufen ergeben dieselben Ergebnisse wie ohne Lernstufen mit Automatik',a.erg[0]===b[0]?(a.erg[1]===b[1]?'beide Saisons gleich':'zweite Saison weicht ab'):'erste Saison weicht ab');
  const v=a.S.lizenz.verlauf;
  pruef(a.liz[0]&&a.liz[0].stufe===2&&a.liz[1].stufe===4&&v[1].wie==='zeit'&&v[2].tag<=1&&v[2].s===v[0].s+1,'Gemütlich im Spiel: C in der ersten Saison, B am 1. Juli, A im Januar der zweiten Saison',v.map(x=>`${x.stufe}:${x.s}/${x.tag}`).join(' '));
  pruef(!a.halte['Gesprächswunsch']&&!a.halte['Frist']&&a.halte['Lizenz']===3,'Keine Halte aus gesperrten Bereichen, je Aufstieg ein Halt',JSON.stringify(a.halte));
  pruef(a.liz.every(x=>x.kader>=18&&x.kader<=36),'Der Verein hält den Kader zusammen (Verträge, Markt)',a.liz.map(x=>x.kader).join(', '));
  const news=a.S.news.map(n=>n.t).join('\n');pruef(/Lizenz-Rückblick/.test(news),'Lizenz-Rückblick am Saisonende im Posteingang');
  // Halte im Vergleich zu einer Saison ohne Lernstufen (alles von Hand, niemand antwortet)
  const hand=(()=>{const {W,F}=neueWelt();F.buildWorld(SEED);let S=W.S;S.my=6;S.mgr='Simulator';F.setTarget();F.sponsOffers();S.lineup=F.bestXI(6,W.ev('myT()').form);const halte={};let n=0;
    while(S.phase!=='end'&&!S.fired&&n<2000){n++;if(S.sponsOffers)F.sponsorWaehlen(0);if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();S=W.S;const g=W.ev('haltGrund(S.tag)');if(g)halte[g]=(halte[g]||0)+1;}return halte;})();
  const summe=h=>Object.entries(h).filter(([k])=>k!=='Lizenz'&&k!=='Saisonende').reduce((x,[,y])=>x+y,0);
  const ersteSaison=(()=>{const {W,F}=neueWelt();F.buildWorld(SEED);let S=W.S;S.my=6;S.mgr='Simulator';F.setTarget();F.lizenzStart(true);F.sponsOffers();S.lineup=F.bestXI(6,W.ev('myT()').form);const halte={};let n=0;
    while(S.phase!=='end'&&!S.fired&&n<2000){n++;if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();S=W.S;const g=W.ev('haltGrund(S.tag)');if(g)halte[g]=(halte[g]||0)+1;}return{halte,S};})();
  pruef(summe(ersteSaison.halte)<=summe(hand),'Mit Lernstufen nicht mehr Halte als ohne (erste Saison, ohne die Aufstiegskarte)',`${summe(ersteSaison.halte)} gegen ${summe(hand)}`);
  const ts=(ersteSaison.S.testspiele||[]).filter(x=>x.stand==='gespielt').length;pruef(ts===2,'Automatik Testspiele: zwei gegen Amateure in der Vorbereitung',ts);}

// 5a. Gleichschritt: Mit dem Stab am Steuer (ohne die Testspiele, die Computer-Vereine noch nicht spielen) entwickelt sich der Kader Tag für Tag
// genau wie beim selben Verein als Computer-Verein. Das zeigt, dass die Automatik dieselben Regeln nutzt. Später trennen sich die Welten über das Geld
// (dein Verein hat echte Buchhaltung, Computer-Vereine bekommen Einnahmen nach Formel) und damit über den Transfermarkt.
{const TAGE=150,mach=mein=>{const {W,F}=neueWelt();F.buildWorld(SEED+10);const S=W.S;S.my=mein;S.mgr='Sim';F.setTarget();F.lizenzStart(false);allesAuto(S,W.ev,true);delete S.lizenz.auto.testspiele;F.sponsOffers();S.lineup=F.bestXI(mein,W.ev('myT()').form);return{W,F};};
  const a=mach(6),b=mach(30),bild=x=>JSON.stringify(x.W.S.pl.filter(p=>p.team===6).map(p=>[p.id,p.str,p.fit,p.ko,p.form,p.sp,p.st,p.inj,p.sv,p.ww,p.ea]))+JSON.stringify([x.W.S.teams[6].form,x.W.S.teams[6].zh,x.W.S.res[1].filter(r=>r[0]===6||r[1]===6)]);
  const schritt=x=>{const S=x.W.S;if(S.sponsOffers)x.F.sponsorWaehlen(0);if(S.fired){S.fired=0;S.trust=60;}x.W.ev('tagEnde')(S.tag);S.tag++;S.gespielt=-1;x.W.ev('tagBeginn')(S.tag);};
  let gleich=0;for(let i=0;i<TAGE;i++){schritt(a);schritt(b);if(bild(a)!==bild(b))break;gleich++;}
  pruef(gleich>=TAGE,`Gleichschritt: Kader und Ergebnisse ${TAGE} Tage lang Tag für Tag gleich, ob der Stab deinen Verein führt oder er ein Computer-Verein ist`,`${gleich} Tage gleich`);}

// 5. Kein Nachteil (K36 §10): Derselbe Verein holt mit dem Stab am Steuer im Schnitt höchstens 2 Punkte weniger als als Computer-Verein
{const lauf=(seed,mein)=>{const {W,F}=neueWelt();F.buildWorld(seed);let S=W.S;S.my=mein;S.mgr='Simulator';F.setTarget();F.lizenzStart(false);allesAuto(S,W.ev,true);F.sponsOffers();S.lineup=F.bestXI(mein,W.ev('myT()').form);let n=0;
    while(S.phase!=='end'&&n<2000){n++;if(S.sponsOffers)F.sponsorWaehlen(0);if(S.fired){S.fired=0;S.trust=60;}if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();S=W.S;}return punkte(S,F,6);};
  const d=[];for(let i=0;i<SEEDS;i++){const seed=SEED+10+i,a=lauf(seed,6),c=lauf(seed,30);d.push([a,c]);}
  const diff=mw(d.map(([a,c])=>a-c));
  pruef(diff>=-2,`Kein Nachteil: Automatik gegen Computer-Verein über ${SEEDS} Seeds, im Schnitt höchstens 2 Punkte weniger`,`${diff>=0?'+':''}${diff.toFixed(1)} Punkte (${d.map(([a,c])=>a+':'+c).join(', ')})`);}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
