// Kalibrierung der Engine, Vergleich mehrerer Einstellungen (26.11., Läufe 12 bis 14: Punkte des Meisters im Median 64–66, Ziel 70–85).
// Spielt je Einstellung dieselben Saisons mit demselben Seed und gibt die Kennzahlen nebeneinander aus, damit die Engine nicht blind verstellt wird.
// Variiert werden engine.angriff.exponent (wie stark der Stärkeunterschied die Chancen bestimmt) und engine.team.ueberragend.anteil (wie viel ein überragender
// Spieler über dem Schnitt seines Bereichs zählt). Die Tests dürfen REGELN verstellen (tests/sim.js). Nur Ausgabe, keine Prüfung.
// Aufruf: node tests/kalibrierung-sweep.js [Saisons=4] [Seed=5]. Nur Node.js. Dauer: etwa sechsmal tests/kalibrierung.js mit denselben Saisons.
// ACHTUNG: Dieses Skript ist noch nie gelaufen (entstanden auf einem Rechner ohne Node.js).
const {saisons}=require('./sim');
const N=+(process.argv[2]||4),SEED=+(process.argv[3]||5),t0=Date.now();
const EINST=[{name:'heute',ex:null,ue:null},{name:'Exponent 1,65',ex:1.65,ue:null},{name:'Exponent 1,75',ex:1.75,ue:null},
  {name:'überragend 0,15',ex:null,ue:0.15},{name:'überragend 0,30',ex:null,ue:0.30},{name:'Exponent 1,65 + überragend 0,15',ex:1.65,ue:0.15}];
const pc=x=>(x*100).toFixed(0)+' %',f2=x=>x.toFixed(2),med=a=>{const s=[...a].sort((x,y)=>x-y);return s.length?s[Math.floor(s.length/2)]:0;};
const zeilen=[];
for(const E of EINST){const L={spiele:0,tore:0,heim:0,remis:0,elf:0},fav={n:0,s:0},meister=[];let stufen=null;
  saisons({n:N,seed:SEED,verein:6,
    vorher:(F,W)=>{const R=W.ev('REGELN').engine;if(E.ex!=null)R.angriff.exponent=E.ex;if(E.ue!=null)R.team.ueberragend.anteil=E.ue;},
    beiSaisonstart:(S)=>{const niveau=id=>{const v=S.pl.filter(p=>p.team===id).map(p=>p.str).sort((a,b)=>b-a).slice(0,14);return v.reduce((a,b)=>a+b,0)/v.length;};
      const lvl=S.teams.filter(t=>t.lg===1).map(t=>({id:t.id,l:niveau(t.id)})).sort((a,b)=>b.l-a.l);stufen={top:new Set(lvl.slice(0,3).map(x=>x.id)),unten:new Set(lvl.slice(-3).map(x=>x.id))};},
    beiSaisonende:(S,F)=>{const t=F.table(1);meister.push(t[0].p);},
    beiSpielen:(list,S)=>list.forEach(r=>{if(r.cup||r.rel||r.h>=1000||r.a>=1000||S.teams[r.h].lg!==1)return;
      L.spiele++;L.tore+=r.hg+r.ag;if(r.hg>r.ag)L.heim++;else if(r.hg===r.ag)L.remis++;r.ev.forEach(e=>{if(e.art==='elfmeter')L.elf++;});
      if(stufen){const erg=r.hg>r.ag?'h':r.hg<r.ag?'a':'u',fb=(f,g)=>{if(stufen.top.has(f)&&stufen.unten.has(g)){fav.n++;if(erg!=='u'&&(erg==='h')===(f===r.h))fav.s++;}};fb(r.h,r.a);fb(r.a,r.h);}})});
  const g=Math.max(1,L.spiele);
  zeilen.push(`${E.name.padEnd(34)} Meister-Median ${String(med(meister)).padStart(3)} (${meister.join('/')}) · Favorit ${pc(fav.s/Math.max(1,fav.n))} · Heim ${pc(L.heim/g)} · Remis ${pc(L.remis/g)} · Tore ${f2(L.tore/g)} · Elfmeter ${f2(L.elf/g)}`);
  console.log(zeilen[zeilen.length-1]);}
console.log(`\nZiele: Meister-Median 70–85 · Favorit (Top 3 gegen Letzte 3) 65–75 % · Heim 40–46 % · Remis 23–27 % · Tore 2,9–3,3 · Elfmeter 0,2–0,3`);
console.log(`Dauer ${Math.round((Date.now()-t0)/1000)} s\n\nBitte alle Zeilen vollständig ins Testprotokoll übernehmen.`);
