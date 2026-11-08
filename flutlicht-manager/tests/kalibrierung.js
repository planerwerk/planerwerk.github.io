// Kalibrierung der Match-Engine (K04 §10, K02 §4.2): Ist gegen Ziel mit Ampel. Aufruf: node tests/kalibrierung.js [Saisons=4] [Seed=5]
const {saisons}=require('./sim');
const N=+(process.argv[2]||4),SEED=+(process.argv[3]||5),t0=Date.now();
const L={1:{},2:{},3:{}},add=(lg,k,v=1)=>{L[lg][k]=(L[lg][k]||0)+v;};
const pokal={spiele:0,weiter:0},fav={top:{n:0,s:0,u:0},gleich:{n:0,s:0,u:0}},punkte={meister:[],letzter:[]},besitz={};let stufen=null;
saisons({n:N,seed:SEED,verein:6,
  beiSaisonstart:(S,F)=>{const niveau=id=>{const v=S.pl.filter(p=>p.team===id).map(p=>p.str).sort((a,b)=>b-a).slice(0,14);return v.reduce((a,b)=>a+b,0)/v.length;};const lvl=S.teams.filter(t=>t.lg===1).map(t=>({id:t.id,l:niveau(t.id)})).sort((a,b)=>b.l-a.l);stufen={top:new Set(lvl.slice(0,3).map(x=>x.id)),unten:new Set(lvl.slice(-3).map(x=>x.id)),lvl:new Map(lvl.map(x=>[x.id,x.l]))};},
  beiSaisonende:(S,F)=>{const t=F.table(1);punkte.meister.push(t[0].p);punkte.letzter.push(t[t.length-1].p);},
  beiSpielen:(list,S)=>list.forEach(r=>{
    if(r.cup){const am=r.h>=1000?r.h:r.a>=1000?r.a:null;if(am!=null&&!(r.h>=1000&&r.a>=1000)){const pro=am===r.h?r.a:r.h;if(S.teams[pro].lg===1){pokal.spiele++;if(r.hg+r.ag>=0&&((pro===r.h&&(r.hg>r.ag||(r.pen&&r.pen[0]>r.pen[1])))||(pro===r.a&&(r.ag>r.hg||(r.pen&&r.pen[1]>r.pen[0])))))pokal.weiter++;}}return;}
    if(r.rel||r.h>=1000||r.a>=1000)return;const lg=S.teams[r.h].lg;
    add(lg,'spiele');add(lg,'tore',r.hg+r.ag);add(lg,r.hg>r.ag?'heim':r.hg<r.ag?'aus':'remis');
    add(lg,'schuesse',r.st.schuesse[0]+r.st.schuesse[1]);add(lg,'ecken',r.st.ecken[0]+r.st.ecken[1]);add(lg,'fouls',r.st.fouls[0]+r.st.fouls[1]);
    r.ev.forEach(e=>{if(e.t==='G'){if(['ecke','freistoss','freistossFlanke'].includes(e.art))add(lg,'std');if(e.art==='elfmeter')add(lg,'elf');if(e.m>45&&e.m<=90)add(lg,'hz2');}
      if(e.t==='Y')add(lg,'gelb');if(e.t==='R')add(lg,'rot');if(e.art==='elfmeter')add(lg,'elfVersuche');});
    [0,1].forEach(s=>{const id=s?r.a:r.h,b=besitz[id]||(besitz[id]={m:0,n:0});b.m+=r.st.besitz[s]/(r.st.besitz[0]+r.st.besitz[1]);b.n++;});
    if(lg===1&&stufen){const h=r.h,a=r.a,erg=r.hg>r.ag?'h':r.hg<r.ag?'a':'u';
      const fb=(f,g)=>{if(stufen.top.has(f)&&stufen.unten.has(g)){fav.top.n++;if(erg==='u')fav.top.u++;else if((erg==='h')===(f===h))fav.top.s++;}};fb(h,a);fb(a,h);
      if(Math.abs(stufen.lvl.get(h)-stufen.lvl.get(a))<1.5){fav.gleich.n++;if(erg==='h')fav.gleich.s++;if(erg==='u')fav.gleich.u++;}}})});
const probleme=[],f2=x=>x.toFixed(2),pc=x=>(x*100).toFixed(0)+' %';
const pruef=(wert,min,max,text,anz)=>{const ok=wert>=min&&wert<=max,nah=!ok&&wert>=min-(max-min)*0.25&&wert<=max+(max-min)*0.25;console.log(`${ok?'🟢':nah?'🟡':'🔴'} ${text}: ${anz} (Ziel ${min}–${max})`);if(!ok)probleme.push(text);};
console.log(`${N} Saisons in ${((Date.now()-t0)/1000).toFixed(1)} s\n`);
for(const lg of [1,2,3]){const x=L[lg];if(!x.spiele)continue;const g=x.spiele;console.log(`— ${lg}. Liga (${g} Spiele)`);
  pruef(x.tore/g,lg===1?2.9:2.8,lg===1?3.3:3.4,'Tore pro Spiel',f2(x.tore/g));
  if(lg===1){pruef(x.heim/g,0.40,0.46,'Heimsiege',pc(x.heim/g));pruef(x.remis/g,0.23,0.27,'Remis',pc(x.remis/g));pruef(x.aus/g,0.30,0.36,'Auswärtssiege',pc(x.aus/g));
    pruef(x.schuesse/g,22,28,'Torschüsse pro Spiel (prüfen)',f2(x.schuesse/g));pruef(x.tore/x.schuesse,0.10,0.13,'Torquote je Schuss',pc(x.tore/x.schuesse));
    pruef(x.ecken/g,9,11,'Ecken pro Spiel',f2(x.ecken/g));pruef((x.std||0)/x.tore,0.20,0.30,'Tore nach Ecken und Freistößen',pc((x.std||0)/x.tore));
    pruef((x.elf||0)/x.tore,0.05,0.08,'Elfmetertore',pc((x.elf||0)/x.tore));pruef((x.elfVersuche||0)/g,0.2,0.3,'Elfmeter pro Spiel',f2((x.elfVersuche||0)/g));
    pruef((x.gelb||0)/g/2,1.5,2.2,'Gelbe Karten pro Team und Spiel',f2((x.gelb||0)/g/2));pruef((x.rot||0)/g,0.12,0.25,'Platzverweise pro Spiel',f2((x.rot||0)/g));
    pruef((x.hz2||0)/x.tore,0.47,0.58,'Anteil Tore nach der Pause',pc((x.hz2||0)/x.tore));}}
console.log('— Saison, Favoriten, Pokal');
// Bundesliga seit 1995/96: Meister meist 70–90 Punkte, in einzelnen Jahren nur 63–69 (z. B. Dortmund 1995/96 mit 68)
const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
pruef(Math.min(...punkte.meister),63,90,'Punkte des Meisters (schlechtester Wert)',punkte.meister.join(', '));pruef(median(punkte.meister),70,85,'Punkte des Meisters (Median)',punkte.meister.join(', '));
pruef(Math.max(...punkte.letzter),15,30,'Punkte des Letzten (bester Wert)',punkte.letzter.join(', '));
if(fav.top.n)pruef(fav.top.s/fav.top.n,0.65,0.75,`Top 3 gegen Letzte 3: Sieg des Favoriten (n=${fav.top.n})`,pc(fav.top.s/fav.top.n));
if(fav.gleich.n)pruef(fav.gleich.s/fav.gleich.n,0.40,0.46,`Gleich stark: Heimsieg (n=${fav.gleich.n})`,pc(fav.gleich.s/fav.gleich.n));
if(pokal.spiele)pruef(pokal.weiter/pokal.spiele,0.88,0.94,`Pokal: Bundesligist kommt gegen Amateure weiter (n=${pokal.spiele})`,pc(pokal.weiter/pokal.spiele));
const bs=Object.values(besitz).filter(b=>b.n>=20).map(b=>b.m/b.n);pruef(Math.max(...bs)-Math.min(...bs),0.15,0.25,'Spanne Ballbesitz der Teams',`${pc(Math.min(...bs))} bis ${pc(Math.max(...bs))}`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
