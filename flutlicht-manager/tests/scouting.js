// Scouting und Informationsnebel (K18 §10): ehrliche Spannen für jede Scout-Qualität und Kenntnis, Tempo der Beobachtung,
// Fehlkäufe ohne und mit Scouting, Suchauftrag, Verblassen, Spiele gegen den Spieler, gleiche Sicht nach Speichern und Laden.
// Aufruf: node tests/scouting.js [Seed=5]. Nur Node.js.
const {neueWelt}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %';
const welt=(verein=6)=>{const {W,F}=neueWelt();F.__ev=W.ev;F.buildWorld(SEED);const S=W.S;S.my=verein;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(verein,W.ev('myT()').form);return{W,F,S,ev:W.ev};};
// Ein Test-Scout im eigenen Verein mit fester Qualität (Gebiet und Lieblingstyp ergeben sich aus der Nummer)
const scout=(S,F,q,gebiet,ev=F.__ev)=>{let x;for(let i=0;i<50;i++){x=F.stabNeu('scout',q,S.my,1);S.stab.push(x);ev('stabGeaendert')();if(!gebiet||ev('scoutGebiet')(x)===gebiet)return x;S.stab.pop();}return x;};

// 1. Ehrlichkeit (K18 §10): Der wahre Wert liegt für jede Scout-Qualität und Kenntnis in mindestens 80 % der Fälle in der Spanne
{const {S,F,ev}=welt();S.kenntnis={};const fremde=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&S.teams[p.team].lg<=3);let alleOk=true;const zeilen=[];
  const pruefe=(name,setze)=>{let drin=0,n=0,breite=0;fremde.forEach(p=>{setze(p);const s=F.staerkeSicht(p);n++;breite+=s.hi-s.lo;if(p.str>=s.lo-0.5&&p.str<=s.hi+0.5)drin++;});const q=drin/n;if(q<0.8)alleOk=false;zeilen.push(`${name} ${pc(q)} (±${(breite/n/2).toFixed(1)})`);};
  pruefe('Grundkenntnis',p=>{delete S.kenntnis[p.id];});
  for(const q of [3,10,18]){const x=scout(S,F,q);for(const k of [30,60,90])pruefe(`Q${q}/K${k}`,p=>{S.kenntnis[p.id]={k,s:[x.id]};});}
  S.kenntnis={};pruef(alleOk,'Ehrlichkeit: wahrer Wert in mindestens 80 % der Fälle in der Spanne (je Qualität und Kenntnis)',zeilen.join(', '));}

// 2. Tempo (K18 §10): Spieler einer anderen deutschen Liga mit durchschnittlichem Scout (Qualität 10, eigenes Gebiet) in 2–3 Wochen auf Kenntnis 60
{const {S,F,ev}=welt();const x=scout(S,F,10,'inland'),p=S.pl.find(q=>q.team>=0&&S.teams[q.team].lg===2&&q.age>23);let w=0;S.kenntnis={};
  while(ev('kenntnis')(p)<60&&w<10){w++;F.kenntnisPlus(p,x,1);}
  pruef(w>=2&&w<=3,'Tempo: andere deutsche Liga, Scout Qualität 10, in 2–3 Wochen auf Kenntnis 60',`${w} Wochen (Start ${ev('grundKenntnis')(p)})`);}

// 3. Fehlkäufe (K18 §10, kalibriert in U9a): Wer aus zehn Kandidaten aus verschiedenen Vereinen der 2. und 3. Liga den nach Einschätzung besten nimmt, liegt ohne Scouting in 20–30 % der Fälle 5 oder mehr darunter, mit gutem Scouting in unter 10 %. Ein einzelner Kauf ohne Auswahl in unter 15 %.
{const {S,F,ev}=welt();const pool=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&S.teams[p.team].lg>=2&&S.teams[p.team].lg<=3).sort((a,b)=>ev('hash32')('mix|'+a.id)-ev('hash32')('mix|'+b.id));const gut=[scout(S,F,17,'inland'),scout(S,F,18,'inland')];
  const lauf=mitScouting=>{let fehl=0,n=0;for(let i=0;i+10<=pool.length;i+=10){const g=pool.slice(i,i+10);S.kenntnis={};
      if(mitScouting)g.forEach(p=>{gut.forEach(x=>{for(let w=0;w<3;w++)F.kenntnisPlus(p,x,1);});});
      const best=g.map(p=>[p,F.staerkeSicht(p).mitte]).sort((a,b)=>b[1]-a[1])[0];n++;if(best[0].str<=best[1]-5)fehl++;}return fehl/n;};
  const ohne=lauf(false),mit=lauf(true);S.kenntnis={};const einzel=pool.filter(p=>p.str<=F.staerkeSicht(p).mitte-5).length/pool.length;
  pruef(einzel<0.15,'Einzelkauf ohne Scouting (ohne Auswahl): unter 15 % mindestens 5 unter der Einschätzung',pc(einzel));
  pruef(ohne>=0.2&&ohne<=0.3,'Fehlkäufe ohne Scouting, Bester aus zehn: 20–30 % mindestens 5 unter der Einschätzung',pc(ohne));
  pruef(mit<0.1,'Fehlkäufe mit gutem Scouting (zwei Scouts, je drei Wochen): unter 10 %',pc(mit));}

// 4. Suchauftrag (K18 §10): 3–8 Kandidaten innerhalb von 4 Wochen, Kosten gebucht
{const {S,F,ev}=welt();const x=scout(S,F,12);const f=F.sucheLauf(x.id,{pos:'MF',alterBis:26,abloeseBis:''});let w=0;const k0=S.fin['Scouting']||0;
  while(w<4){w++;S.tag+=7;F.scoutingWoche();}const a=S.auftraege.find(y=>y.art==='suche');const n=a?a.kand.length:0;
  pruef(!f&&n>=3&&n<=8&&a.kand.every(id=>{const p=ev('PIX').get(id);return p.pos==='MF'&&p.age<=26;}),'Suchauftrag: 3–8 passende Kandidaten in vier Wochen',`${n} Kandidaten${f?', '+f:''}`);
  pruef((S.fin['Scouting']||0)<k0,'Scouting kostet Reisegeld',`${Math.round(-(S.fin['Scouting']||0)).toLocaleString('de-DE')} €`);}

// 5. Verblassen und Spiele: ohne Beobachtung etwa 2 Punkte je Monat, nie unter die Grundkenntnis; ein Spiel gegen ihn bringt +5
{const {S,F,ev}=welt();const x=scout(S,F,15,'inland'),p=S.pl.find(q=>q.team>=0&&S.teams[q.team].lg===2);S.kenntnis={};for(let w=0;w<3;w++)F.kenntnisPlus(p,x,1);const k0=S.kenntnis[p.id].k;
  for(let w=0;w<13;w++)F.scoutingWoche();const k1=S.kenntnis[p.id]?S.kenntnis[p.id].k:ev('grundKenntnis')(p),proMonat=(k0-k1)/3;
  for(let w=0;w<200;w++)F.scoutingWoche();const k2=ev('kenntnis')(p);
  pruef(proMonat>1.5&&proMonat<2.5&&k2===ev('grundKenntnis')(p),'Verblassen: etwa 2 je Monat, nicht unter die Grundkenntnis',`${proMonat.toFixed(1)} je Monat, am Ende ${k2}`);
  const q=S.pl.find(y=>y.team>=0&&y.team!==S.my&&S.teams[y.team].lg===1),g=ev('kenntnis')(q);F.scoutingNachSpiel([{h:S.my,a:q.team,xpo:[[],[[q.id,0,1,90]]],xi:[[],[q.id]]}]);
  pruef(ev('kenntnis')(q)===g+5,'Ein Spiel gegen ihn bringt +5 Kenntnis',`${g} → ${ev('kenntnis')(q)}`);}

// 6. Gleiche Sicht nach Speichern und Laden, eigene Spieler genau
{const {W,S,F,ev}=welt();const x=scout(S,F,9),fremd=S.pl.filter(p=>p.team>=0&&p.team!==S.my).slice(0,200);fremd.slice(0,50).forEach(p=>F.kenntnisPlus(p,x,1));
  const vor=fremd.map(p=>ev('staerkeText')(p)).join(',');W.S=JSON.parse(JSON.stringify(S));F.reindex();const nach=fremd.map(p=>ev('staerkeText')(ev('PIX').get(p.id))).join(',');
  const eigen=ev('squad')(S.my).every(p=>ev('staerkeText')(p)===String(Math.round(p.str)));
  pruef(vor===nach&&eigen,'Gleiche Spannen nach Speichern und Laden, eigene Spieler genau',vor===nach?'':'abweichend');}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
