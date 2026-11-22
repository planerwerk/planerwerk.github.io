// Karriereende (K32 §5.1, 22.11., popolupo): Grundwert nach Alter (Torhüter zwei Jahre später), Niveau (zu schwach für die Liga ×1,5, Stammspieler ×0,7),
// Kreuzbandriss in den letzten zwölf Monaten ab 32 ×1,5, Vorbildprofi ×0,8, eigener Strom je Spieler, Schnitt des Karriereendes, eine Saison im Ablauf.
// Aufruf: node tests/karriereende.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. Es entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt,saisons}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711,nah=(a,b,e=0.001)=>Math.abs(a-b)<=e;
function welt(){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();S.phase='play';return{W,F,S,ev:W.ev};}
// ein Feldspieler eines anderen Vereins der 1. Liga, ohne Verletzung, Eigenschaften fest (kein Vorbildprofi), Rolle Ergänzung
function spieler(S){const t=S.teams.find(x=>x.lg===1&&x.id!==S.my),p=S.pl.find(q=>q.team===t.id&&q.pos!=='TW');p.vl=null;p.vh=[];p.eig=[];p.krA='ergaenzung';return p;}

// 1. Grundwert nach Alter: 0 bis 31, 10 % mit 32, dazwischen linear (33: 17,5 %), 25 % mit 34, 90 % mit 38, ab 39 sicher. Torhüter zwei Jahre später
{const {S,F}=welt(),p=spieler(S),sch={1:0,2:0,3:0},c=a=>{p.age=a;return F.karriereChance(p,sch);};
  const w=[31,32,33,34,36,38,39,41].map(c);p.pos='TW';const tw=[33,34,36].map(c);
  pruef(w[0]===0&&nah(w[1],0.10)&&nah(w[2],0.175)&&nah(w[3],0.25)&&nah(w[4],0.5)&&nah(w[5],0.9)&&w[6]===1&&w[7]===1&&tw[0]===0&&nah(tw[1],0.10)&&nah(tw[2],0.25),
    'Grundwert nach Alter, Torhüter zwei Jahre später',`Feld ${w.map(x=>x.toFixed(3)).join(' ')}, Torwart ${tw.map(x=>x.toFixed(3)).join(' ')}`);}

// 2. Faktoren: zu schwach für die Liga ×1,5 (vor Stammspieler), Stammspieler ×0,7, Kreuzbandriss in den letzten zwölf Monaten ×1,5, Vorbildprofi ×0,8
{const {S,F,ev}=welt(),K=ev('RS').karriereende,p=spieler(S);p.age=34;p.str=70;const g=F.karriereChance(p,{1:70,2:60,3:50});
  const schwach=F.karriereChance(p,{1:81,2:60,3:50});p.krA='stamm';const stamm=F.karriereChance(p,{1:70,2:60,3:50}),schwachStamm=F.karriereChance(p,{1:81,2:60,3:50});p.krA='ergaenzung';
  const heute=ev('absTag')(S.tag);p.vh=[{art:'kreuzband',q:'foul',ab:heute-100,t:200}];const kb=F.karriereChance(p,{1:70,2:60,3:50});p.vh=[{art:'kreuzband',q:'foul',ab:heute-500,t:200}];const kbAlt=F.karriereChance(p,{1:70,2:60,3:50});
  p.vh=[];p.eig=['vorbildprofi'];const vp=F.karriereChance(p,{1:70,2:60,3:50});
  pruef(nah(g,0.25)&&nah(schwach,0.25*K.schwach)&&nah(stamm,0.25*K.stamm)&&nah(schwachStamm,0.25*K.schwach)&&nah(kb,0.25*K.kreuzband)&&nah(kbAlt,0.25)&&nah(vp,0.25*K.profi),
    'Faktoren: schwach, Stammspieler, Kreuzband (nur zwölf Monate), Vorbildprofi',`${g} / ${schwach} / ${stamm} / ${schwachStamm} / ${kb} / ${kbAlt} / ${vp}`);}

// 3. Gleicher Spieler, gleiche Saison: gleiche Entscheidung (eigener Strom), Vereinslose vergleichen sich mit der 3. Liga
{const {S,F}=welt(),p=spieler(S);p.age=35;const sch={1:70,2:60,3:50},a=F.karriereEnde(p,sch),b=F.karriereEnde(p,sch);p.team=-1;p.str=35;const frei=F.karriereChance(p,sch);
  pruef(a===b&&nah(frei,0.375*1.5),'Gleiche Entscheidung je Spieler und Saison, Vereinslose gegen den Schnitt der 3. Liga',`${a}/${b}, vereinslos ${frei.toFixed(4)}`);}

// 4. Schnitt des Karriereendes nach der Formel (ohne Faktoren, ab 32 gerechnet): Feldspieler 33 bis 35,5, Torhüter etwa zwei Jahre später (K32 §10: 33–35, Torhüter 35–37)
{const {S,F}=welt(),p=spieler(S),sch={1:0,2:0,3:0},schnitt=pos=>{p.pos=pos;let rest=1,sum=0,n=0;for(let a=30;a<=42;a++){p.age=a;const c=F.karriereChance(p,sch);sum+=a*rest*c;n+=rest*c;rest*=1-c;}return sum/n;};
  const feld=schnitt('AB'),tw=schnitt('TW');
  pruef(feld>=33&&feld<=35.5&&tw-feld>1.5&&tw-feld<=2.5,'Schnitt des Karriereendes nach der Formel',`Feldspieler ${feld.toFixed(2)}, Torhüter ${tw.toFixed(2)}`);}

// 5. Eine Saison im Ablauf: nach dem Saisonwechsel ist kein Feldspieler älter als 38 und kein Torhüter älter als 40 (sie wären sicher abgetreten), es haben welche aufgehört
// (Der Simulator hört nach der letzten Saison vor der Sommerpause auf, darum ruft der Test sie am Saisonende selbst auf, wie es der Simulator sonst täte.)
{let info=null;saisons({n:1,seed:SEED,verein:VEREIN,beiSaisonende:(S0,F)=>{info={alt:S0.pl.filter(p=>p.team>=0&&p.age>=31).length,n0:S0.pl.length};F.sommerpause();
    const S=F.__W.S;info.zuAlt=S.pl.filter(p=>p.team>=0&&(p.pos==='TW'?p.age>40:p.age>38)).length;info.neu=S.season;}});
  pruef(info&&info.zuAlt===0&&info.neu===2027,'Saisonwechsel: niemand über der Altersgrenze',info?`zu alt ${info.zuAlt}, vorher ${info.alt} Spieler ab 31, Saison ${info.neu}`:'kein Saisonende');}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
