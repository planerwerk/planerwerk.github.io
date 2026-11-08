// Spielermodell (K03 §10): Alterskurve, Gleichgewicht der Welt, Form, Frische, Kondition, Talentgrenze, keine Formspirale.
// Aufruf: node tests/spielermodell.js [Saisons=6] [Seed=11]. Nur Node.js nötig.
const {neueWelt,saisons}=require('./sim');
const N=+(process.argv[2]||6),SEED=+(process.argv[3]||11),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const f1=x=>x.toFixed(1),f2=x=>x.toFixed(2);

// 1. Frische und Kondition als Einzelrechnung mit den echten Funktionen (K03 §5.3)
{const {W,F}=neueWelt();F.buildWorld(1);const S=W.S;S.my=0;S.train=1;S.phase='play';S.tag=S.plan.trainingsauftakt+10;
  const p={age:26,fit:100,ko:80,sp:70,inj:0,team:5,form:10,sv:0};
  const spiel=()=>F.nachSpiel(p,90),tag=(ruhe)=>F.tagesWerte(p,false,ruhe);
  // ein Spiel pro Woche: Spieltag, Ruhetag, 5 Trainingstage
  for(let w=0;w<3;w++){spiel();tag(true);for(let i=0;i<5;i++)tag(false);}
  pruef(p.fit>=99,'Frische: ein Spiel pro Woche, zum nächsten Spiel wieder bei 100 %',f1(p.fit));
  p.fit=100;spiel();tag(true);tag(false);spiel();tag(true);tag(false);tag(false);spiel();const nach3=p.fit;
  pruef(nach3>=72&&nach3<=82,'Frische: drei Spiele in acht Tagen, danach 72–82 %',f1(nach3));
  tag(true);tag(true);tag(true);pruef(p.fit>=90,'Frische: nach drei Ruhetagen mindestens 90 %',f1(p.fit));
  p.ko=80;for(let i=0;i<28;i++)F.tagesWerte(p,true,false);const ab=80-p.ko;
  pruef(ab>=15&&ab<=20,'Kondition: vier Wochen Urlaub kosten 15–20',f1(ab));
  S.train=2;p.team=S.my;for(let w=0;w<5;w++)F.wochenWerte(p);pruef(p.ko>=80,'Kondition: fünf Wochen hartes Training danach mindestens 80',f1(p.ko));}

// 1b. Lernen im Spiel (K03 §5.6) mit erfundenen Szenen
{const {W,F}=neueWelt();F.buildWorld(2);const S=W.S,PIX=W.ev('PIX');S.my=0;
  const p=S.pl.find(x=>x.team>=0&&x.pos==='ST'&&x.str>=66&&x.age<30);
  if(!p)pruef(false,'Lernen im Spiel: kein passender Stürmer gefunden');else{
  p.mk={};p.ls=null;const sz=n=>Array.from({length:n},()=>[p.id,'gross',1]);
  F.lernenImSpiel({sz:sz(20)});pruef(p.lf&&Math.abs(p.lf.torjaeger-25)<0.01,'Lernen im Spiel: höchstens 25 % je Merkmal und Spiel',p.lf&&p.lf.torjaeger);
  F.lernenImSpiel({sz:sz(20)});F.lernenImSpiel({sz:sz(20)});F.lernenImSpiel({sz:sz(20)});pruef(!!p.mk.torjaeger,'Lernen im Spiel: nach vier starken Spielen ist „Torjäger“ gelernt');
  p.mk.elfmeter=1;p.fk={elfmeter:100};for(let i=0;i<4;i++)F.lernenImSpiel({sz:[[p.id,'elfmeter',0]]});pruef(!p.mk.elfmeter,'Fehlerkonto: vier verschossene Elfmeter ohne Treffer kosten das Merkmal');
  p.mk.elfmeter=1;p.fk={elfmeter:100};F.lernenImSpiel({sz:[[p.id,'elfmeter',0]]});F.lernenImSpiel({sz:[[p.id,'elfmeter',1]]});F.lernenImSpiel({sz:[[p.id,'elfmeter',0]]});F.lernenImSpiel({sz:[[p.id,'elfmeter',0]]});
  pruef(!!p.mk.elfmeter,'Fehlerkonto: ein Treffer zwischendurch rettet das Merkmal',p.fk.elfmeter);
  const q=S.pl.find(x=>x.team>=0&&x.pos==='AB'&&!x.mk.ungestuem);q.lf=null;for(let i=0;i<10;i++)F.lernenImSpiel({sz:[[q.id,'rot',0]]});pruef(!!q.mk.ungestuem,'Lernen im Spiel: zehn Platzverweise machen ungestüm');}}

// 2. Saisons simulieren: Alterskurve, Gleichgewicht, Form, Talentgrenze, Formspirale
const start=new Map(),deltas={},niveau={1:[],2:[],3:[]},formWerte=[],formStark=[],formSchwach=[];let talentVerletzt=0;
const gruppe=a=>a<=19?'bis 19':a<=22?'20–22':a<=25?'23–25':a<=28?'26–28':a<=30?'29–30':a<=32?'31–32':a<=34?'33–34':'ab 35';
const ZIEL={'bis 19':4.2,'20–22':2.6,'23–25':1.0,'26–28':0,'29–30':-0.5,'31–32':-1.4,'33–34':-2.5,'ab 35':-3.4};
function merken(S){start.clear();S.pl.forEach(p=>{if(p.team>=0)start.set(p.id,{str:p.str,age:p.age,pot:Math.max(p.pot,p.str),pos:p.pos});});}
const abbauTW=[],abbauMF=[],staerkenJeSpieler=[];
const {W,F,S:Send}=saisons({n:N,seed:SEED,verein:6,beiSaisonstart:merken,beiSaisonende:(S,FX)=>{
  // Die Alterstabelle gilt für Mittelfeldspieler (Positionsalter = Alter). Torhüter und Abwehr bauen später ab, Stürmer früher.
  {const pl=S.pl.filter(p=>p.team>=0),RP=FX.__W.ev('RP');staerkenJeSpieler.push(pl.reduce((n,p)=>n+Object.keys(p.mk||{}).filter(k=>!RP.merkmale[k].schwaeche).length,0)/pl.length);}
  S.pl.forEach(p=>{const a=start.get(p.id);if(!a||p.team<0)return;if(a.pos==='MF')(deltas[gruppe(a.age)]=deltas[gruppe(a.age)]||[]).push(p.str-a.str);
    if(a.age>=33){if(a.pos==='TW')abbauTW.push(p.str-a.str);if(a.pos==='MF')abbauMF.push(p.str-a.str);}if(p.str>a.pot+0.001)talentVerletzt++;formWerte.push(p.form);});
  [1,2,3].forEach(lg=>{const ids=S.teams.filter(t=>t.lg===lg).map(t=>t.id);const m=ids.map(id=>{const s=S.pl.filter(p=>p.team===id).map(p=>p.str).sort((a,b)=>b-a).slice(0,14);return s.reduce((x,y)=>x+y,0)/Math.max(1,s.length);});niveau[lg].push(m.reduce((x,y)=>x+y,0)/m.length);});
  // Formspirale: Haben die stärksten Kader automatisch bessere Form? (Der Meister selbst ist durch Glück ausgewählt und taugt nicht als Maß.)
  const lvl=S.teams.filter(t=>t.lg===1).map(t=>{const sq=S.pl.filter(p=>p.team===t.id);const top=sq.map(p=>p.str).sort((a,b)=>b-a).slice(0,14);return{id:t.id,l:top.reduce((a,b)=>a+b,0)/top.length,f:sq.filter(p=>p.apps>=10)};}).sort((a,b)=>b.l-a.l);
  const fs=g=>{const l=g.flatMap(x=>x.f);return l.reduce((a,p)=>a+p.form,0)/Math.max(1,l.length);};formStark.push(fs(lvl.slice(0,4)));formSchwach.push(fs(lvl.slice(-4)));
  }});
console.log(`\n${N} Saisons simuliert in ${((Date.now()-t0)/1000).toFixed(1)} s`);
for(const g of Object.keys(ZIEL)){const d=deltas[g]||[];if(d.length<25){console.log(`– ${g}: zu wenige Spieler (${d.length})`);continue;}
  const m=d.reduce((a,b)=>a+b,0)/d.length;pruef(Math.abs(m-ZIEL[g])<=0.6,`Alterskurve ${g} (Ziel ${ZIEL[g]>0?'+':''}${ZIEL[g]} ±0,6, n=${d.length})`,(m>0?'+':'')+f2(m));}
const mittel=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
pruef(abbauTW.length<5||mittel(abbauTW)>mittel(abbauMF),'Torhüter ab 33 bauen langsamer ab als Mittelfeldspieler',`TW ${f2(mittel(abbauTW))}, MF ${f2(mittel(abbauMF))}`);
// 2. und 3. Liga: Startstärke, Nachwuchs und Auffüllen der Kader kalibrieren K08 und K32. Bis dahin weitere Spanne (die 2. Liga startet etwa einen Punkt unter ihrem Gleichgewicht).
[1,2,3].forEach(lg=>{const v=niveau[lg];if(v.length<2)return;const span=Math.max(...v)-Math.min(...v),gr=lg===3?2.5:lg===2?2:1.5;pruef(span<=gr,`Gleichgewicht ${lg}. Liga: Schnitt der besten 14 schwankt höchstens ${gr}`,v.map(f1).join(' → '));});
const fIn=formWerte.filter(x=>x>=7&&x<=13).length/formWerte.length,fEx=formWerte.filter(x=>x<=4||x>=16).length/formWerte.length;
pruef(fIn>=0.6&&fIn<=0.85,'Form: 60–85 % zwischen 7 und 13',(fIn*100).toFixed(0)+' %');
pruef(fEx<=0.05,'Form: höchstens 5 % bei ≤ 4 oder ≥ 16',(fEx*100).toFixed(1)+' %');
const mS=formStark.reduce((a,b)=>a+b,0)/formStark.length,mW=formSchwach.reduce((a,b)=>a+b,0)/formSchwach.length;
pruef(Math.abs(mS-mW)<=1.5,'Keine Formspirale: die vier stärksten Kader der 1. Liga haben im Schnitt höchstens 1,5 mehr Form als die vier schwächsten',`stark ${f1(mS)}, schwach ${f1(mW)}`);
pruef(talentVerletzt===0,'Niemand überschreitet sein Talent',talentVerletzt);
if(staerkenJeSpieler.length>=2){const sp=Math.max(...staerkenJeSpieler)-Math.min(...staerkenJeSpieler);pruef(sp<=0.4,'Merkmale stabil: Stärken je Spieler schwanken über die Saisons höchstens um 0,4',staerkenJeSpieler.map(f2).join(' → '));}
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
