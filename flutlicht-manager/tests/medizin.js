// Medizin (K10 §10): Verletzungen pro Team und Saison, Anteile der Arten, Training gegen Spiel, Dauer und Rückfall der Zerrung, Kreuzbandrisse,
// Anteil verletzter Spieler, Krankheiten, ehrliche Spanne, fit spritzen, früher zurückholen, Verletzungsfolge im Strafmaß.
// Aufruf: node tests/medizin.js [Saisons=2] [Seed=4]. Nur Node.js.
const {saisons}=require('./sim');
const N=+(process.argv[2]||2),SEED=+(process.argv[3]||4),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const f1=x=>x.toFixed(1),pc=x=>(x*100).toFixed(0)+' %';
const alle=[],proSaison=[];let welt=null,trainingsEinheiten=0,spielMinuten=0,kaderTage=0,verletztTage=0,ehrlich=0,spannen=0;
const {W,F}=saisons({n:N,seed:SEED,verein:6,
  beiSaisonstart:(S,F)=>{if(welt)return;welt=F;
    const v=F.verletzen;F.verletzen=function(p,q,o){const r=v(p,q,o);if(r){alle.push({art:r.art,q,t:r.t,lg:S.teams[p.team]?S.teams[p.team].lg:0,saison:S.season});spannen++;if(r.sd[0]<=r.t&&r.sd[1]>=r.t)ehrlich++;}return r;};
    const tt=F.trainingTag;F.trainingTag=function(p,t,a,d){const r=tt(p,t,a,d);if(r<0)trainingsEinheiten++;return r;};},
  beiSpielen:(liste,S)=>{liste.forEach(r=>{if(r.cup||!r.lg)return;r.xpo.forEach(l=>l.forEach(x=>{spielMinuten+=x[3];}));});
    S.teams.filter(t=>t.lg===1).forEach(t=>{const sq=S.pl.filter(p=>p.team===t.id);kaderTage+=sq.length;verletztTage+=sq.filter(p=>p.inj>0).length;});},
  beiSaisonende:S=>{const l1=S.teams.filter(t=>t.lg<=3).map(t=>(S.vstat||{})[t.id]||{});proSaison.push({n:l1.reduce((a,x)=>a+(x.n||0),0)/l1.length,krank:l1.reduce((a,x)=>a+(x.krankheit||0),0)/l1.length});}});
const S=W.S,ev=W.ev,RMD=ev('RMD'),verl=alle.filter(x=>x.q!=='krankheit');
// 1. Häufigkeit (UEFA-Studie: etwa 50 je 25er-Kader und Saison; K10: 30–50)
const nT=proSaison.reduce((a,x)=>a+x.n,0)/proSaison.length;pruef(nT>=30&&nT<=50,'Verletzungen pro Team und Saison (ohne Krankheit) 30–50',f1(nT));
// 2. Arten: Muskel 30–40 %, Oberschenkel hinten (Zerrung) 20–25 %
const ant=k=>verl.filter(x=>k.includes(x.art)).length/verl.length;
pruef(ant(['zerrung','faserriss'])>=0.30&&ant(['zerrung','faserriss'])<=0.40,'Anteil Muskelverletzungen 30–40 %',pc(ant(['zerrung','faserriss'])));
pruef(ant(['zerrung'])>=0.20&&ant(['zerrung'])<=0.25,'Anteil Zerrungen (Oberschenkel hinten) 20–25 %',pc(ant(['zerrung'])));
// 3. Training gegen Spiel: Anteil 40–55 %, je Stunde ist das Spiel mindestens dreimal so gefährlich
const tr=verl.filter(x=>x.q==='training').length/verl.length;pruef(tr>=0.40&&tr<=0.55,'Anteil Trainingsverletzungen 40–55 %',pc(tr));
{const l=verl.filter(x=>x.lg>=1&&x.lg<=3),sp=l.filter(x=>x.q!=='training').length,tn=l.length-sp,rs=sp/(spielMinuten/60),rt=tn/(trainingsEinheiten*1.5);
  pruef(rs/rt>=3,'Je Stunde ist das Spiel mindestens dreimal so gefährlich wie das Training',`${f1(rs/rt)}-mal (Spiel ${f1(rs*1000)}, Training ${f1(rt*1000)} je 1000 Stunden)`);}
// 4. Zerrung: Ø 14–20 Tage, Rückfall in acht Wochen 10–15 %
{const z=verl.filter(x=>x.art==='zerrung'),m=z.reduce((a,x)=>a+x.t,0)/z.length;pruef(m>=14&&m<=20,'Zerrung im Schnitt 14–20 Tage',f1(m));
  let n=0,r=0;S.pl.forEach(p=>{const h=(p.vh||[]).filter(x=>x.art!=='krankheit').sort((a,b)=>a.ab-b.ab);h.forEach((x,i)=>{if(x.art!=='zerrung')return;const zurueck=x.ab+x.t;if(zurueck+56>ev('absTag')(S.tag))return;n++;
    if(h.slice(i+1).some(y=>y.art==='zerrung'&&y.ab>zurueck&&y.ab<=zurueck+56))r++;});});
  pruef(n>20&&r/n>=0.10&&r/n<=0.15,'Rückfall nach einer Zerrung in acht Wochen 10–15 %',`${pc(r/n)} von ${n}`);}
// 5. Kreuzbandrisse in der 1. Liga 3–8 pro Saison
{const k=verl.filter(x=>x.art==='kreuzband'&&x.lg===1).length/N;pruef(k>=3&&k<=8,'Kreuzbandrisse in der 1. Liga 3–8 pro Saison',f1(k));}
// 6. Anteil verletzter oder kranker Spieler an Spieltagen (UEFA-Studie 12–14 %, Spielwert 5–14 %)
pruef(verletztTage/kaderTage>=0.05&&verletztTage/kaderTage<=0.14,'Im Schnitt fehlen 5–14 % des Kaders',pc(verletztTage/kaderTage));
// 7. Krankheiten pro Team und Saison (Spielwert 3–15)
{const k=proSaison.reduce((a,x)=>a+x.krank,0)/proSaison.length;pruef(k>=3&&k<=15,'Krankheiten pro Team und Saison 3–15 (Spielwert)',f1(k));}
// 8. Ehrliche Spanne: Die Diagnose enthält die wahre Dauer in mindestens 85 % der Fälle
pruef(spannen>0&&ehrlich/spannen>=0.85,'Diagnose-Spanne enthält die wahre Dauer in mindestens 85 % der Fälle',pc(ehrlich/spannen));
// 9. Fit spritzen: spielt mit Wirkung ×0,95, wird in etwa 15 % der Fälle schlimmer; früher zurückholen gibt Frische 65 % und doppeltes Rückfallrisiko
{const p=S.pl.find(x=>x.team===S.my&&x.inj<=0&&x.pos!=='TW');let schlimmer=0;const n=2000;
  for(let i=0;i<n;i++){p.inj=0;p.vl=null;ev('verletzen')(p,'kollision',{art:'prellung',still:true});p.inj=4;p.spritze=S.tag;if(i===0){const a=ev('avail')(p),e=ev('eff')(p,'ZM'),q=e/((p.spritze=null),ev('eff')(p,'ZM'));p.spritze=S.tag;
      pruef(a&&Math.abs(q-RMD.spritzen.wirkung)<0.001,'Fit gespritzt: spielt mit Wirkung ×0,95',`einsatzbereit ${a}, Wirkung ×${q.toFixed(3)}`);}
    ev('nachSpritze')(p);if(p.vl&&p.vl.art!=='prellung')schlimmer++;}
  pruef(Math.abs(schlimmer/n-RMD.spritzen.verschlimmerung)<0.03,'Nach der Spritze in etwa 15 % der Fälle schlimmer',pc(schlimmer/n));
  p.inj=0;p.vl=null;ev('verletzen')(p,'training',{art:'zerrung',still:true});p.inj=3;ev('medizinRueckkehr')(p,RMD.frueher.frische);p.inj=0;
  pruef(p.fit<=RMD.frueher.frische&&p.rf&&Math.abs(p.rf.w-RMD.arten.zerrung.rueckfall*2)<1e-9,'Früher zurückgeholt: Frische 65 %, Rückfallrisiko doppelt',`Frische ${Math.round(p.fit)}, Rückfallwert ${p.rf&&p.rf.w}`);p.rf=null;p.fit=95;}
// 10. Verletzungsfolge (K09 §5.2): Fällt der Gegner vier Wochen oder länger aus, beantragt der Kontrollausschuss im Schnitt ein Spiel mehr
{const a=ev('antragFuer'),m=folge=>{let s=0;for(let i=0;i<2000;i++)s+=a({art:'grob',vor:0,folge});return s/2000;};const d=m(true)-m(false);
  pruef(d>=0.7&&d<=1.1,'Verletzungsfolge: im Schnitt etwa ein Spiel mehr',d.toFixed(2));}
console.log(`\n${N} Saison(s), ${verl.length} Verletzungen, ${alle.filter(x=>x.q==='krankheit').length} Krankheiten, in ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
