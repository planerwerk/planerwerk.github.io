// Live-Spiel (K05 §10): Eingriffe wirken, sind aber begrenzt. Computer-Wechsel wie in der Bundesliga. Nachspielen mit denselben Eingriffen ergibt dasselbe Spiel.
// Alle Vergleiche mit denselben Zufallsströmen (gleiches Spiel, nur der Eingriff unterscheidet sich). Aufruf: node tests/live.js [Durchgänge=150] [Seed=5]. Nur Node.js.
const {neueWelt}=require('./sim');
const N=+(process.argv[2]||150),SEED=+(process.argv[3]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(1)+' %',f2=x=>x.toFixed(2),vz=x=>(x>=0?'+':'')+x.toFixed(2);
const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=-9;
const spielAnlegen=W.ev('spielAnlegen');W.__setLive=v=>W.ev('(v=>{LIVE=v;})')(v);
const kader=id=>S.pl.filter(p=>p.team===id);
const niveau=id=>{const s=kader(id).map(p=>p.str).sort((a,b)=>b-a).slice(0,14);return s.reduce((a,b)=>a+b,0)/s.length;};
const L1=S.teams.filter(t=>t.lg===1).map(t=>t.id).sort((a,b)=>niveau(b)-niveau(a));
const X=L1[8],gegner=L1.filter(id=>id!==X);
// Ein Spiel bis zum Ende, eingriff(G) wird vor jeder Minute aufgerufen. Gibt das Ergebnis aus Sicht von X zurück.
function spiel(h,a,r,eingriff,auto){S.season=7000+r;S.tag=3;const G=spielAnlegen(h,a,{auto});while(!G.ende){if(eingriff)eingriff(G);G.minute();}return G;}
const punkte=(G,s)=>{const d=G.sc[s]-G.sc[1-s];return d>0?3:d===0?1:0;};

// 1. Computer-Wechsel: im Schnitt 4–5 je Team und Spiel, die meisten zwischen der 55. und 85. Minute
{let n=0,w=0,spaet=0;for(let r=0;r<N;r++)for(const g of gegner.slice(0,6)){const G=spiel(X,g,r);n+=2;G.wechsel.forEach(x=>{w++;if(x.m>=55&&x.m<=85)spaet++;});}
  pruef(w/n>=4&&w/n<=5,'Computer-Wechsel: 4–5 je Team und Spiel',f2(w/n));pruef(spaet/w>=0.7,'Computer-Wechsel: mindestens 70 % zwischen der 55. und 85. Minute',pc(spaet/w));}

// 2. Eingriff wirkt: X liegt in der 70. Minute 0:1 (oder mit einem Tor) zurück. „Sehr offensiv“ gegenüber „nichts tun“:
//    Chance auf mindestens einen Punkt +3 bis +8 Prozentpunkte, Gefahr eines weiteren Gegentors ebenfalls höher
{let n=0,punktA=0,punktB=0,gegA=0,gegB=0;
  for(let r=0;r<N*3;r++)for(const g of gegner){
    // Stand nach 70 Minuten (dieselben Ströme wie im ganzen Spiel)
    const bis70=(()=>{S.season=7000+r;S.tag=3;const G=spielAnlegen(X,g,{auto:[false,true]});while(G.m<70)G.minute();return[G.sc[0],G.sc[1]];})();
    if(bis70[0]-bis70[1]!==-1)continue;n++;
    const A=spiel(X,g,r,null,[false,true]),B=spiel(X,g,r,G=>{if(G.m===70)G.taktik(0,{tac:'SO'});},[false,true]);
    if(punkte(A,0)>=1)punktA++;if(punkte(B,0)>=1)punktB++;if(A.sc[1]>bis70[1])gegA++;if(B.sc[1]>bis70[1])gegB++;}
  const dP=(punktB-punktA)/n,dG=(gegB-gegA)/n;
  pruef(dP>=0.03&&dP<=0.08,`Eingriff wirkt: „sehr offensiv“ bei Rückstand mit einem Tor in der 70. Minute bringt 3–8 Prozentpunkte mehr Chance auf einen Punkt (n=${n})`,`${pc(punktA/n)} → ${pc(punktB/n)}`);
  pruef(dG>0,'Eingriff hat einen Preis: die Gefahr eines weiteren Gegentors steigt',`${pc(gegA/n)} → ${pc(gegB/n)}`);}

// 3. Zurufe begrenzt: dauerndes Rufen bringt über eine Saison höchstens 1 Punkt mehr als nie zu rufen
{const muster={'alle 10 Minuten':G=>G.m%10===0&&G.m>0&&G.m<90,'alle 16 Minuten':G=>G.m%16===0&&G.m>0&&G.m<90};
  const basis=(()=>{let p=0;for(let r=0;r<N;r++)for(const g of gegner){p+=punkte(spiel(X,g,r,null,[false,true]),0);p+=punkte(spiel(g,X,r,null,[true,false]),1);}return p/N;})();
  for(const [name,wann] of Object.entries(muster)){let p=0;
    for(let r=0;r<N;r++)for(const g of gegner){p+=punkte(spiel(X,g,r,G=>{if(wann(G))G.zuruf(0,'druck');},[false,true]),0);p+=punkte(spiel(g,X,r,G=>{if(wann(G))G.zuruf(1,'druck');},[true,false]),1);}
    const d=p/N-basis;pruef(d<=1,`Zurufe begrenzt: „Druck machen“ ${name} bringt höchstens 1 Punkt pro Saison`,vz(d));}}

// 4. Ansprache begrenzt: die passende Halbzeitansprache gegenüber „schweigen“ höchstens +0,05 Punkte je Spiel
{let pA=0,pB=0,n=0;const passend=(G,s)=>{const d=G.sc[s]-G.sc[1-s];return d>0?'loben':d<0?'fordern':'motivieren';};
  for(let r=0;r<N;r++)for(const g of gegner){n++;pA+=punkte(spiel(X,g,r,G=>{if(G.m===45)G.ansprache(0,'schweigen');},[false,true]),0);
    pB+=punkte(spiel(X,g,r,G=>{if(G.m===45)G.ansprache(0,passend(G,0));},[false,true]),0);}
  const d=(pB-pA)/n;pruef(d>=0&&d<=0.05,'Ansprache begrenzt: passende Ansprache bringt 0 bis +0,05 Punkte je Spiel',vz(d));}

// 5. Nachspielen: gleiches Spiel mit denselben Eingriffen zweimal, und ohne Eingriffe gleich wie sim()
{let gleich=true;for(let r=0;r<20;r++){const g=gegner[r%gegner.length],e=G=>{if(G.m===30)G.zuruf(0,'ruhe');if(G.m===60)G.taktik(0,{tac:'O'});if(G.m===65&&G.bank[0].length)G.wechseln(0,G.Ss[0].xp[5].p.id,G.bank[0][1]);};
    const a=JSON.stringify(spiel(X,g,r,e,[false,true]).ergebnis()),b=JSON.stringify(spiel(X,g,r,e,[false,true]).ergebnis());if(a!==b)gleich=false;
    S.season=7000+r;S.tag=3;const c=JSON.stringify(F.sim(X,g)),d=JSON.stringify(spiel(X,g,r).ergebnis());if(c!==d)gleich=false;}
  pruef(gleich,'Nachspielen: dieselben Eingriffe ergeben dasselbe Spiel, ohne Eingriffe dasselbe wie sim()');}

// 6. Wechselregeln: höchstens 5 Wechsel in 3 Gelegenheiten, die Halbzeit zählt nicht
{S.season=7999;S.tag=3;const G=spielAnlegen(X,gegner[0],{auto:[false,false]});const xs=()=>G.Ss[0].xp.filter(x=>x.pos!=='TW'&&!G.raus.has(x.p.id)).map(x=>x.p.id);
  while(G.m<45)G.minute();const r1=G.wechseln(0,xs()[0],G.bank[0][1]).ok&&G.wechseln(0,xs()[1],G.bank[0][1]).ok;
  while(G.m<60)G.minute();const r2=G.wechseln(0,xs()[2],G.bank[0][1]).ok;while(G.m<70)G.minute();const r3=G.wechseln(0,xs()[3],G.bank[0][1]).ok;
  while(G.m<80)G.minute();const r4=G.wechseln(0,xs()[4],G.bank[0][1]).ok;const r5=G.wechseln(0,xs()[5],G.bank[0][1]);
  pruef(r1&&r2&&r3&&r4&&!r5.ok,'Wechselregeln: zwei in der Halbzeit plus drei Gelegenheiten erlaubt, ein sechster Wechsel nicht',r5.grund);}

// 7. Automatische Halte (K05 §10): im Schnitt 3–6 pro Spiel bei Standardeinstellung (ohne Halbzeit), mit der Halte-Logik der Ansicht (js/live.js)
{let n=0,h=0;const halte=W.ev('liveHalte');for(let r=0;r<Math.ceil(N/3);r++)for(const g of gegner){S.season=7000+r;S.tag=3;const G=spielAnlegen(X,g,{auto:[true,true]});
    W.__setLive({G,s:0,evN:0,gewarnt:new Set()});while(!G.ende){G.minute();if(halte())h++;}n++;}
  pruef(h/n>=3&&h/n<=6,'Automatische Halte: im Schnitt 3–6 pro Spiel',f2(h/n));W.__setLive(null);}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
