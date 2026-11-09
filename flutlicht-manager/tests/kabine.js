// Stimmung, Kabine und Gespräche (K14 §10, K15 §10): Verteilung, Trägheit, Bankplatz, Leistung, Zusammenhalt, keine Dauerkrise,
// Gespräche lösen Gesprächswünsche, gebrochene Versprechen kosten Glaubwürdigkeit, Dauerlob nutzt sich ab, Charakter zählt, Gesprächszeit begrenzt.
// Aufruf: node tests/kabine.js [Seed=5]. Nur Node.js.
const {neueWelt,saisons}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %',f1=x=>x.toFixed(1),f2=x=>x.toFixed(2),m=l=>l.length?l.reduce((a,b)=>a+b,0)/l.length:0;
const welt=(verein=6)=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=verein;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(verein,W.ev('myT()').form);return{W,F,S,ev:W.ev};};
const tage=(F,S,n)=>{for(let i=0;i<n;i++){F.tagEnde(S.tag);S.tag++;S.gespielt=-1;F.tagBeginn(S.tag);}};

// 1. Eine Saison im Ablauf: Verteilung, Trägheit, keine Dauerkrise, Leistung über den Zustandsfaktor, Wertebereiche
{const deltas=[],sf=new Map(),mitte=[];let fehler=null;
  try{saisons({n:1,seed:SEED,verein:6,
    beiSaisonstart:(S,F)=>{if(F.__w)return;F.__w=1;const o=F.kabineWoche;F.kabineWoche=function(d){const v=new Map(S.pl.filter(p=>p.team>=0&&p.st!=null).map(p=>[p.id,p.st]));o(d);
      S.pl.forEach(p=>{if(v.has(p.id)&&p.team>=0)deltas.push(Math.abs(p.st-v.get(p.id)));});if(S.res[1].length>=150&&!mitte.length)S.pl.forEach(p=>{if(p.team>=0)mitte.push(p.st);});};},
    beiSpielen:(list,S)=>list.forEach(r=>[0,1].forEach(s=>{const tid=s?r.a:r.h;if(tid>=1000||r.test)return;const xi=(r.xi[s]||[]).map(id=>S.pl.find(p=>p.id===id)).filter(Boolean);if(!xi.length)return;
      const f=xi.reduce((a,p)=>a+(p.st==null?1:p.st<20?1-0.03*(20-p.st)/20:p.st>85?1+0.02*(p.st-85)/15:1),0)/xi.length;if(!sf.has(tid))sf.set(tid,[]);sf.get(tid).push(f);})),
    beiSaisonende:(S)=>{const st=S.pl.filter(p=>p.team>=0&&S.teams[p.team]&&p.st!=null).map(p=>p.st),im=st.filter(x=>x>=45&&x<=80).length/st.length,im2=mitte.filter(x=>x>=45&&x<=80).length/Math.max(1,mitte.length);
      pruef(im>=0.7&&im2>=0.7,'Verteilung: mindestens 70 % der Spieler zwischen 45 und 80 Stimmung (Saisonmitte und Saisonende)',`${pc(im2)} und ${pc(im)}, Schnitt ${f1(m(st))}`);
      const aktive=S.teams.filter(t=>t.lg<=3&&t.id!==S.my),ww3=m(aktive.map(t=>(t.kst&&t.kst.ww3)||0)); // ohne deinen Verein: Im Test führt niemand Gespräche
      pruef(ww3<=1,'Keine Dauerkrise: im Schnitt höchstens ein offizieller Wechselwunsch je Kader und Saison (Computer-Vereine)',`${f2(ww3)} (höchstens ${Math.max(...aktive.map(t=>(t.kst&&t.kst.ww3)||0))} in einem Verein)`);
      const zh=aktive.map(t=>t.zh);pruef(zh.every(x=>x>=0&&x<=100),'Zusammenhalt im Bereich 0–100',`${f1(Math.min(...zh))} bis ${f1(Math.max(...zh))}, Schnitt ${f1(m(zh))}`);
      const bad=S.pl.filter(p=>p.st!=null&&(p.st<0||p.st>100||!(p.ww>=0&&p.ww<=4)));pruef(!bad.length,'Stimmung 0–100 und Wechselwunsch 0–4 bei allen Spielern',bad.length?bad[0].n:'');
      const fr=S.bz.filter(b=>b[2]==='F').length,ri=S.bz.filter(b=>b[2]==='R').length;console.log(`  Beziehungen am Saisonende: ${fr} Freundschaften, ${ri} Rivalitäten`);}});}
  catch(e){fehler=e;}
  pruef(!fehler,'Saison mit Stimmung und Kabine läuft ohne Fehler',fehler?fehler.stack.split('\n').slice(0,3).join(' | '):'');
  const ueber=deltas.filter(x=>x>8.0001).length/Math.max(1,deltas.length),p99=deltas.slice().sort((a,b)=>a-b)[Math.floor(deltas.length*0.99)]||0;
  pruef(ueber<=0.005,'Trägheit: ohne große Ereignisse höchstens ±8 in einer Woche (weniger als 0,5 % darüber)',`99 % bis ${f1(p99)}, über 8: ${(ueber*100).toFixed(2)} %`);
  const ab=[...sf.values()].map(l=>m(l)),wmin=Math.min(...ab),wmax=Math.max(...ab);
  pruef(wmin>=0.99&&wmax<=1.01,'Leistung: Stimmung verschiebt die Stärke der Startelf im Saisonschnitt höchstens um ±1 % (Näherung für ±3 Punkte)',`${f2((wmin-1)*100)} % bis +${f2((wmax-1)*100)} %`);}

// 2. Bankplatz (K14 §10): ehrgeizig, sieht sich als Stammspieler, spielt zwölf Wochen keine Minute → Gesprächswunsch in 60–80 % der Fälle
{const {S,F,ev}=welt();tage(F,S,ev('auftaktTag(myT())')+40-S.tag);const kand=S.pl.filter(p=>p.team>=0&&S.teams[p.team].lg<=3&&(p.krA==='stamm'||p.krA==='schluessel')&&p.inj<=0).slice(0,400);
  kand.forEach(p=>{p.ch.ehr=16;p.max=0;});let d=S.tag;
  for(let w=0;w<12;w++){d+=7;S.tag=d;kand.forEach(p=>{p.ea=0;});F.kabineWoche(d);kand.forEach(p=>{p.max=Math.max(p.max,p.ww);});}
  const q=kand.filter(p=>p.max>=2).length/kand.length,q8=kand.filter(p=>p.max>=1).length/kand.length;
  pruef(q>=0.6&&q<=0.8,'Bankplatz: ehrgeiziger Stammspieler ohne Einsatz erreicht in zwölf Wochen den Gesprächswunsch in 60–80 % der Fälle',`${pc(q)} von ${kand.length} (Grummeln: ${pc(q8)})`);}

// 3. Zusammenhalt (K14 §10): sechs neue Stammspieler → etwa −2 %, Erholung in 8–12 Wochen (stabile Elf, 40 % Siege)
{const {S,F,ev}=welt();const t=ev('myT()');t.zh=50;for(let i=0;i<6;i++)F.zusammenhaltAendern(t,ev('RKA').zusammenhalt.neuer);const f0=ev('kabineFaktor')(S.my).f;
  const xi=F.myXI().filter(x=>x!=null);let w=0;while(t.zh<45&&w<30){w++;t.xiV=xi.slice();t.xiW=xi.slice();t.siegeW=(w%5===1||w%5===3)?1:0;S.tag+=7;F.kabineWoche(S.tag);}
  pruef(f0<=0.985&&f0>=0.975,'Zusammenhalt: sechs neue Stammspieler kosten etwa 2 % Teamstärke',`${f2((f0-1)*100)} % (Zusammenhalt ${50+6*ev('RKA').zusammenhalt.neuer})`);
  pruef(w>=8&&w<=12,'Zusammenhalt erholt sich mit stabiler Elf in 8–12 Wochen (bis 45)',`${w} Wochen`);}

// 4. Gespräche lösen Gesprächswünsche (K15 §10): sinnvolles Gespräch mit passender Zusage löst 40–60 %
{let gel=0,n=0;for(let k=0;k<6;k++){const {S,F,ev}=welt(4+k);const sq=ev('squad')(S.my).filter(p=>p.inj<=0);
  sq.forEach(p=>{if(n>=150)return;p.ww=2;p.st=33;p.ea=0.15;S.gw=[{pid:p.id,tag:S.tag,s:S.season}];S.gz=[];S.vs=[];const r=F.gespraechFuehren(p.id,'einsatz','s');if(r.ok){n++;if(r.geloest)gel++;}});}
  pruef(n>50&&gel/n>=0.4&&gel/n<=0.6,'Gespräch mit Einsatz-Zusage löst 40–60 % der Gesprächswünsche',`${pc(gel/n)} von ${n}`);}

// 5. Versprechen brechen kostet (K15 §10): nach zwei gebrochenen Versprechen Glaubwürdigkeit unter 45. Gehalten bringt Stimmung und Glaubwürdigkeit.
{const {S,F,ev}=welt();const t=ev('myT()'),sq=ev('squad')(S.my);t.glaub=60;
  [sq[15],sq[16]].forEach(p=>{p.ea=0.1;p.st=40;S.gz=[];const r=F.gespraechFuehren(p.id,'wechsel','s');if(r.versprechen)F.versprechenAngebot(p.id,r.versprechen.preis+1);});
  pruef(t.glaub<45,'Zwei gebrochene Versprechen: Glaubwürdigkeit unter 45',`${f1(t.glaub)}`);
  const p=sq[17];p.ea=0.1;S.gz=[];const g0=t.glaub,r=F.gespraechFuehren(p.id,'einsatz','s'),st0=p.st;const v=r.versprechen;
  if(v){const m0={h:S.my,a:sq.length?1:0,xpo:[[[p.id,0,1,90]],[]],xi:[[p.id],[]],hg:1,ag:0};for(let i=0;i<v.n;i++)F.versprechenNachSpiel([m0]);}
  pruef(v&&v.stand==='gehalten'&&t.glaub>g0&&p.st>st0,'Einsatz-Versprechen gehalten: Stimmung und Glaubwürdigkeit steigen',v?`${v.stand}, Glaubwürdigkeit ${f1(g0)} → ${f1(t.glaub)}, Stimmung ${f1(st0)} → ${f1(p.st)}`:'keine Zusage');}

// 6. Dauerlob lohnt nicht (K15 §10): wöchentliches Lob an denselben Spieler bringt nach vier Wochen fast nichts mehr (höchstens ein Viertel)
{const {S,F,ev}=welt();const p=ev('squad')(S.my).find(q=>!ev('hatEig')(q,'diva'));p.lastG=2;const w=[];for(let i=0;i<4;i++){S.gz=[];const r=F.gespraechFuehren(p.id,'lob','s');w.push(r.w);S.tag+=7;}
  pruef(w[0]>0&&w[3]<=w[0]*0.25,'Dauerlob: in der vierten Woche höchstens ein Viertel der Wirkung',w.map(f2).join(' → '));}

// 7. Charakter zählt (K15 §10): dieselbe Kritik wirkt bei Kämpfern im Schnitt positiv, bei Diven deutlich negativ
{const {S,F,ev}=welt();const sq=ev('squad')(S.my),erg={kaempfer:[],diva:[]};
  for(const art of ['kaempfer','diva'])sq.slice(0,10).forEach(p=>{const alt=p.eig;p.eig=[art];p.lastG=4.5;p.gs=[];delete p.streit;S.gz=[];const r=ev('gespraechWirkung')(p,'kritik','s');erg[art].push(r.w);p.eig=alt;});
  pruef(m(erg.kaempfer)>0&&m(erg.diva)<-4,'Kritik: Kämpfer im Schnitt positiv, Diven deutlich negativ',`Kämpfer ${f2(m(erg.kaempfer))}, Diven ${f2(m(erg.diva))}`);}

// 8. Zeit begrenzt (K15 §10): höchstens drei Einzelgespräche pro Woche, eine Mannschaftsansprache
{const {S,F,ev}=welt();const sq=ev('squad')(S.my);S.gz=[];const r=[0,1,2,3].map(i=>F.gespraechFuehren(sq[i].id,'lob','s').ok);
  const a1=F.mannschaftsAnsprache('ziel').ok,a2=F.mannschaftsAnsprache('rueckendeckung').ok;
  pruef(r.filter(Boolean).length===3&&!r[3]&&a1&&!a2,'Höchstens drei Einzelgespräche und eine Mannschaftsansprache pro Woche',`${r.filter(Boolean).length} Gespräche, Ansprachen ${a1?'ja':'nein'}/${a2?'ja':'nein'}`);}

// 9. Ohne Anlass keine Wirkung (gegen Ausnutzung): Einsatz versprechen an einen Stammspieler, der ohnehin spielt, bringt nichts und keine Zusage
{const {S,F,ev}=welt();const p=ev('squad')(S.my).find(q=>q.krA==='schluessel');p.ea=0.9;p.ww=0;S.gz=[];const g0=ev('myT()').glaub,r=F.gespraechFuehren(p.id,'einsatz','s');
  pruef(r.ok&&!r.versprechen&&r.w===0,'Einsatz versprechen an einen Spieler, der ohnehin spielt: keine Wirkung, keine Zusage',r.text);}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
