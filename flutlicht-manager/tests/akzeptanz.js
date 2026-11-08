// Akzeptanztests der Engine (K04 §10): Torwart-Test, Sensitivität, glatter Anstieg, ein Star allein, kein Exploit über Positionen, Tempo.
// Spielt gezielt Spiele mit festen Kadern, ohne Saisonablauf. Beide Varianten eines Vergleichs laufen mit denselben Zufallsströmen,
// so bleibt nur der Unterschied der Kader übrig. Aufruf: node tests/akzeptanz.js [Saisons=200] [Seed=5]. Nur Node.js.
const {neueWelt}=require('./sim');
const N=+(process.argv[2]||200),SEED=+(process.argv[3]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const f1=x=>x.toFixed(1),f2=x=>x.toFixed(2),vz=x=>(x>=0?'+':'')+f1(x);

const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=-9; // kein eigener Verein: alle stellen nach bestXI auf
const kader=id=>S.pl.filter(p=>p.team===id);
const niveau=id=>{const s=kader(id).map(p=>p.str).sort((a,b)=>b-a).slice(0,14);return s.reduce((a,b)=>a+b,0)/s.length;};
const liga=lg=>S.teams.filter(t=>t.lg===lg).map(t=>t.id);
const elf=id=>F.side(id,false,true).xp; // [{p,pos}] wie die Engine aufstellt
const mitte=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};

// Bilanz eines Teams: n Durchgänge gegen alle Gegner, je ein Heim- und ein Auswärtsspiel. Punkte pro Durchgang (= Saison), Tore pro Spiel.
let spiele=0;
function bilanz(tid,gegner,n=N){let pkt=0,gf=0,ga=0,sp=0;
  for(let r=0;r<n;r++){S.season=5000+r;
    for(const g of gegner){if(g===tid)continue;
      S.tag=1;let x=F.sim(tid,g);gf+=x.hg;ga+=x.ag;pkt+=x.hg>x.ag?3:x.hg===x.ag?1:0;
      S.tag=2;x=F.sim(g,tid);gf+=x.ag;ga+=x.hg;pkt+=x.ag>x.hg?3:x.ag===x.hg?1:0;sp+=2;}}
  spiele+=sp;return{pkt:pkt/n,gf:gf/sp,ga:ga/sp};}
// Vergleich: Änderung anwenden, messen, zurücknehmen
function mit(aendern,messen){const zurueck=aendern();try{return messen();}finally{zurueck();}}
const staerke=(p,wert)=>()=>{const alt=p.str;p.str=wert;return()=>{p.str=alt;};};

// Testteam: Mittelfeld der 2. Liga
const L2=liga(2).sort((a,b)=>niveau(b)-niveau(a)),X=L2[Math.floor(L2.length/2)];
S.teams[X].form='4-4-2'; // Bezugsordnung für alle Vergleiche
console.log(`Testteam ${S.teams[X].name} (2. Liga, Niveau ${f1(niveau(X))}, 4-4-2), ${N} Durchgänge gegen die übrigen 17 Teams`);
const basis=bilanz(X,L2);
console.log(`Basis: ${f1(basis.pkt)} Punkte pro Saison, ${f2(basis.gf)}:${f2(basis.ga)} Tore pro Spiel`);

// 1. Torwart-Test (Rohmaterial 5.6, dein Beispiel 66 → 84): Torwart aus der Spitze der 1. Liga (der zweitbeste)
{const tw=elf(X).find(x=>x.pos==='TW').p,bl=liga(1).map(id=>elf(id).find(x=>x.pos==='TW').p.str).sort((a,b)=>b-a)[1];
  const b=mit(staerke(tw,bl),()=>bilanz(X,L2)),dGa=basis.ga-b.ga,dP=b.pkt-basis.pkt;
  console.log(`Torwart ${Math.round(tw.str)} → ${Math.round(bl)}`);
  pruef(dGa>=0.08&&dGa<=0.25,'Torwart-Test: 0,08–0,25 Gegentore weniger pro Spiel',f2(dGa));
  pruef(dP>=2&&dP<=6,'Torwart-Test: +2 bis +6 Punkte pro Saison',vz(dP));}

// 2. Sensitivität: ein Feldspieler +5, getrennt nach Bereich
// Je Bereich die beiden zentralen Spieler der 4-4-2 (Innenverteidiger, zentrales Mittelfeld, Mittelstürmer), jeweils einzeln, dann der Mittelwert
{const xp=elf(X),wahl={Abwehr:'IV',Mittelfeld:'ZM',Angriff:'MS'},d={},n2=Math.ceil(N/2),b2=bilanz(X,L2,n2).pkt;
  for(const [b,pos] of Object.entries(wahl)){const xs=xp.filter(y=>y.pos===pos);if(!xs.length)continue;d[b]=xs.reduce((s,x)=>s+mit(staerke(x.p,x.p.str+5),()=>bilanz(X,L2,n2)).pkt-b2,0)/xs.length;}
  for(const [b,v] of Object.entries(d))pruef(v>=1&&v<=3,`Sensitivität: ein Spieler (${b}) +5 bringt 1–3 Punkte pro Saison`,vz(v));
  const w=Object.values(d);if(w.length>=2)pruef(Math.max(...w)<=2*Math.max(0.1,Math.min(...w)),'Sensitivität: kein Bereich bringt mehr als das Doppelte eines anderen',Object.entries(d).map(([b,v])=>b+' '+vz(v)).join(', '));}

// 3. Glatter Anstieg: ganze Elf +2, +4, +6. Jeder Schritt bringt etwas, keiner mehr als das Doppelte eines anderen (keine harte Schwelle)
{const xp=elf(X),stufe=k=>mit(()=>{xp.forEach(x=>x.p.str+=k);return()=>xp.forEach(x=>x.p.str-=k);},()=>bilanz(X,L2,Math.ceil(N/2)).pkt);
  const b2=bilanz(X,L2,Math.ceil(N/2)).pkt,p=[b2,stufe(2),stufe(4),stufe(6)],schritte=[p[1]-p[0],p[2]-p[1],p[3]-p[2]];
  pruef(schritte.every(s=>s>0)&&Math.max(...schritte)<=2*Math.min(...schritte),'Glatter Anstieg: Elf +2/+4/+6, jeder Schritt bringt Punkte, keiner mehr als das Doppelte',schritte.map(vz).join(', '));}

// 4. Ein Star allein: ein 95er in einem 65er-Team (das Team der 3. Liga, dessen Niveau am nächsten an 65 liegt) bringt höchstens 6 Punkte
{const L3=liga(3),Y=[...L3].sort((a,b)=>Math.abs(niveau(a)-65)-Math.abs(niveau(b)-65))[0],b0=bilanz(Y,L3,Math.ceil(N/2)),st=elf(Y).find(x=>x.pos==='MS'||x.pos==='HS'||x.pos==='OM')||elf(Y).find(x=>x.pos!=='TW');
  const b1=mit(staerke(st.p,95),()=>bilanz(Y,L3,Math.ceil(N/2))),dP=b1.pkt-b0.pkt;
  console.log(`Star: ${S.teams[Y].name} (3. Liga, Niveau ${f1(niveau(Y))}), ${st.pos} ${Math.round(st.p.str)} → 95`);
  pruef(dP>0&&dP<=6,'Ein Star allein: ein 95er hebt die Punkte um höchstens 6 pro Saison',vz(dP));}

// 5. Kein Exploit über Positionen: drei Mittelfeldspieler werden zu Stürmern gleicher Stärke (fünf Stürmer auf dem Platz)
{const xp=elf(X);S.my=X;S.lineup=F.side(X,false,true).xi.slice();const tw=S.teams[X];
  const posGruppe=W.ev('posGruppe'),mf=xp.filter(x=>posGruppe(x.pos)==='MF').slice(0,3),neu=['LA','RA','HS'];
  const b0=bilanz(X,L2,Math.ceil(N/2)),b1=mit(()=>{const alt=mf.map(x=>[x.p.fp,x.p.pos]);mf.forEach((x,i)=>{x.p.fp=neu[i];x.p.pos='ST';});return()=>mf.forEach((x,i)=>{x.p.fp=alt[i][0];x.p.pos=alt[i][1];});},()=>bilanz(X,L2,Math.ceil(N/2)));
  pruef(b1.pkt<b0.pkt,`Kein Exploit: fünf Stürmer (${tw.form}) bringen weniger Punkte als die ausgewogene Elf`,`${f1(b1.pkt)} statt ${f1(b0.pkt)}`);
  S.my=-9;S.lineup=null;}

// 6. Tempo: Ziel unter 2 Sekunden für eine Saison der 1. Liga (306 Spiele) im Browser. Node ist etwas schneller, darum hier höchstens 4 ms pro Spiel.
{const ms=(Date.now()-t0)/spiele;pruef(ms<=4,'Tempo: höchstens 4 ms pro Spiel (306 Spiele unter 1,3 s)',f2(ms)+' ms');}
console.log(`\n${spiele} Spiele in ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
