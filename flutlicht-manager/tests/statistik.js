// Statistik und Historie (K34 §5.3 bis §5.9, §10, U13): Tore der Spieler gegen die Tabelle, Vorlagen nach Opta-Regel, Ehrungen je Liga, Rekorde mit echten Startwerten,
// Karriere des Trainers, Marktwert nach Ehrung, Speicher, alte Spielstände, Ansicht. Und: Die Statistik ändert kein Ergebnis.
// Aufruf: node tests/statistik.js [Saisons, Standard 2]. Für den Speicher-Test über 20 Saisons: node tests/statistik.js 20 (dauert lange). Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U13 entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt,saisons}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const N=Math.max(1,+(process.argv[2]||2)),SEED=4711,VEREIN=6;

// 1. Echte Startwerte der Bundesliga-Rekorde (K34 §5.6), 2. und 3. Liga leer
{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;const r1=F.rekLiga(1),r2=F.rekLiga(2);
  pruef(r1.sieg&&r1.sieg.hg===12&&r1.sieg.ag===0&&r1.tore&&r1.tore.n===41&&r1.serie&&r1.serie.n===53&&!r2.sieg&&!r2.tore,'Rekorde: 1. Liga startet mit 12:0, 41 Toren und 53 Spielen ohne Niederlage, die 2. Liga leer',
    `${r1.sieg&&r1.sieg.hg}:${r1.sieg&&r1.sieg.ag}, ${r1.tore&&r1.tore.n}, ${r1.serie&&r1.serie.n}`);}

// 2. Marktwert nach einer Ehrung +5 % bis zum Ende der folgenden Saison (K34 §5.5)
{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;const p=W.ev('squad')(VEREIN).sort((a,b)=>b.str-a.str)[0],a=F.value(p);
  p.ehj=S.season;const b=F.value(p);p.ehj=S.season-1;const c=F.value(p);p.ehj=S.season-2;const d=F.value(p);delete p.ehj;
  pruef(Math.abs(b/a-1.05)<0.02&&Math.abs(c/a-1.05)<0.02&&d===a,'Marktwert: geehrt in dieser oder der letzten Saison +5 %, danach nicht mehr',`${a} → ${b}, ${c}, ${d}`);}

// 3. Die Statistik ändert kein Ergebnis: eine Saison mit und ohne statistikNachSpiel, gleiche Ergebnisse und Noten
{const lauf1=vorher=>{let e=null;saisons({n:1,seed:SEED,verein:VEREIN,vorher,beiSaisonende:S=>{e=JSON.stringify(S.res)+'|'+JSON.stringify(S.cup.hist);}});return e;};
  const mit=lauf1(null),ohne=lauf1(F=>{F.statistikNachSpiel=function(){};});
  pruef(!!mit&&mit===ohne,'Statistik ohne Einfluss: Mit und ohne Statistik (und Vorlagen) sind alle Liga- und Pokalergebnisse der ersten Saison gleich',mit?`${mit.length} Zeichen`:'kein Ergebnis');}

// 4. Lauf über N Saisons: Tore, Vorlagen, Ehrungen, Karriere, Rekorde, Speicher
let tore=0,vorl=0,falsch=0;const art={},jeSaison=[];
const lauf=saisons({n:N,seed:SEED,verein:VEREIN,
  beiSpielen:list=>list.forEach(r=>{if(r.test||r.rel||r.supercup)return;(r.ev||[]).forEach(e=>{if(e.t!=='G'||e.p==null)return;tore++;const k=e.art||'?';art[k]=art[k]||[0,0];art[k][0]++;
    if(e.v!=null){vorl++;art[k][1]++;if(e.v===e.p||e.art==='elfmeter'||e.art==='freistoss')falsch++;}});}),
  beiSaisonende:(S,F)=>{const W=F.__W,st=S.stat,a=st&&st.arch[st.arch.length-1],PIX=W.ev('PIX'),KZ=W.ev('KZ'),s=S.season,out={s,ok:true,txt:[]};
    if(!a||a.s!==s){out.ok=false;out.txt.push('kein Archiv');jeSaison.push(out);return;}
    for(const lg of [1,2,3]){const res=S.res[lg].reduce((x,r)=>x+r[2]+r[3],0);let zeilen=0,maxT=0;const proSpieler=new Map();
      for(const p of PIX.values())(p.kar||[]).forEach(z=>{if(z[KZ.s]===s&&z[KZ.lg]===lg){zeilen+=z[KZ.t]||0;proSpieler.set(p.id,(proSpieler.get(p.id)||0)+(z[KZ.t]||0));}});
      proSpieler.forEach(v=>{if(v>maxT)maxT=v;});const eg=(a.eg&&a.eg[lg])||0,e=a.ehr[lg];
      if(res!==zeilen+eg){out.ok=false;out.txt.push(`${lg}. Liga: Tabelle ${res} Tore, Spieler ${zeilen} + ${eg} Eigentore`);}
      if(!e||!e.ts.length||e.ts.some(x=>x[3]!==maxT)){out.ok=false;out.txt.push(`${lg}. Liga: Torschützenkönig ${e&&e.ts.map(x=>x[3]).join('/')} statt ${maxT}`);}
      const pos={};(e?e.elf:[]).forEach(x=>pos[x[3]]=(pos[x[3]]||0)+1);if(!e||e.elf.length!==11||pos.TW!==1||pos.AB!==4||pos.MF!==3||pos.ST!==3){out.ok=false;out.txt.push(`${lg}. Liga: Elf des Jahres ${JSON.stringify(pos)}`);}
      if(!e||!e.sp||!e.tr){out.ok=false;out.txt.push(`${lg}. Liga: Spieler oder Trainer der Saison fehlt`);}
      [].concat(e?e.ts:[],e?e.elf:[],e&&e.sp?[e.sp]:[],e&&e.ta?[e.ta]:[]).forEach(x=>{const p=PIX.get(x[0]);if(p&&p.ehj!==s){out.ok=false;out.txt.push(`${x[1]} geehrt ohne Marktwert-Vermerk`);}});}
    const h=S.hist[S.hist.length-1];if(!h||h.pk==null||h.tf==null||h.ruf==null){out.ok=false;out.txt.push('Karriere: Zeile ohne Punkte, Tore oder Ruf');}
    if(!(st.rek.lg[1]&&st.rek.lg[1].sieg&&st.rek.lg[1].sieg.n>=12&&st.rek.lg[2]&&st.rek.lg[2].sieg)){out.ok=false;out.txt.push('Rekorde fehlen');}
    if([...PIX.values()].some(p=>p.sst)){out.ok=false;out.txt.push('offene Zeilen nach dem Saisonende');}
    let bytes=JSON.stringify(st).length;for(const p of PIX.values())bytes+=JSON.stringify([p.kar||0,p.kas||0,p.mvl||0]).length;out.bytes=bytes;
    jeSaison.push(out);}});
jeSaison.forEach(o=>pruef(o.ok,`Saison ${o.s}: Spielertore = Tabellentore je Liga, ein Torschützenkönig mit den meisten Toren, Elf des Jahres 1-4-3-3, Ehrungen mit Marktwert, Karriere, Rekorde`,o.txt.join('; ')||`${o.bytes} Zeichen Statistik`));
pruef(tore>0&&falsch===0&&vorl/tore>0.55&&vorl/tore<0.9,'Vorlagen: nie für den Torschützen selbst, nie bei Elfmeter oder direktem Freistoß, insgesamt 55 bis 90 % der Tore',
  `${vorl} von ${tore} (${Math.round(vorl/Math.max(1,tore)*100)} %), je Art ${Object.entries(art).map(([k,[t,v]])=>`${k} ${Math.round(v/t*100)} %`).join(', ')}`);
{const RS=lauf.W.ev('RSTAT').speicher,letzte=jeSaison[jeSaison.length-1],ziel=RS.max*Math.min(N,RS.saisons)/RS.saisons;
  pruef(letzte&&letzte.bytes<ziel,`Speicher: Statistik nach ${N} Saison(s) unter ${Math.round(ziel/1000)} KB (anteilig zu 1 MB nach 20 Saisons)`,letzte?`${Math.round(letzte.bytes/1000)} KB`:'–');}

// 5. Ansicht: alle Unterseiten, Spielerkarte und Vergleich ohne Fehler
{const {W,F,S}=lauf;let fehler='';try{for(const k of ['saison','ehrungen','rekorde','archiv','karriere']){W.ev(`STV='${k}'`);for(const lg of [1,2,3]){W.ev(`STLG=${lg}`);const h=F.statistikAnsicht();if(!h||h.length<200)fehler+=`${k}/${lg} leer; `;}}
    const sq=W.ev('squad')(S.my);F.vergleichen(sq[0].id);F.vergleichen(sq[1].id);W.ev("STV='saison'");const v=F.statistikAnsicht();if(!v.includes('Vergleich'))fehler+='Vergleich fehlt; ';
    sq.forEach(p=>{if(!F.statKarte(p).includes('Statistik'))fehler+='Karte '+p.n+'; ';});}catch(e){fehler+=e.message;}
  pruef(!fehler,'Ansicht: Saison, Ehrungen, Rekorde, Archiv, Karriere je Liga, Vergleich und Spielerkarte',fehler||null);}

// 6. Alter Spielstand ohne Statistik: weiterspielen legt alles neu an, ab der laufenden Saison
{const {W,F}=neueWelt();F.buildWorld(SEED);let S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);
  let fehler='';try{for(let i=0;i<40&&!W.S.stat;i++){S=W.S;if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();}
    delete W.S.stat;for(const p of W.ev('PIX').values()){delete p.sst;delete p.kar;}for(let i=0;i<20;i++){S=W.S;if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();}}catch(e){fehler=e.message;}
  pruef(!fehler&&W.S.stat&&W.S.stat.ab===W.S.season,'Alter Spielstand: ohne S.stat und Zeilen geht es ohne Fehler weiter, die Statistik beginnt mit der laufenden Saison',fehler||(W.S.stat?`ab ${W.S.stat.ab}`:'kein S.stat'));}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
