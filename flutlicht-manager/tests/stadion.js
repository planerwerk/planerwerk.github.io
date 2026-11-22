// Stadion und Anlagen (K26 §4, §5.1, §10, K26a): Bauprozess (Genehmigung, Auflagen, Bau, Verzögerung, Mehrkosten), Tribüne mit weniger Plätzen während des Baus,
// Wirkungen der Anlagen, Instandhaltung, Anteil der Verzögerungen, alter Spielstand mit Baustelle im alten Format.
// Aufruf: node tests/stadion.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. K26a entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711,nah=(a,b,e=1e-9)=>Math.abs(a-b)<=e;
function welt(){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();if(S.sponsOffers)F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);S.phase='play';
  const t=W.ev('myT()');t.cash=50e6;return{W,F,S,ev:W.ev,t};}
// Lässt die Tage bis zum Ende der Baustelle laufen (nur bauTag, ohne den übrigen Tagesablauf)
function bisFertig(w){const {F,S,ev}=w;let d=S.tag,n=0;while(S.constr&&n<400){d++;n++;F.bauTag(d);}return d;}

// 1. Bauprozess: Kosten sofort, Genehmigung, Baubeginn mit Auflagen, Verzögerung, Mehrkosten, danach Stufe 3 und Bausumme
{const w=welt(),{F,S,ev,t}=w,f0=S.fin['Stadionbau']||0,k0=ev('anlageKosten')(t,'training');F.bauStarten('training');const c=Object.assign({},S.constr),bezahlt0=f0-(S.fin['Stadionbau']||0);
  const ende=bisFertig(w),gesamt=f0-(S.fin['Stadionbau']||0),soll=c.ab+(10+c.verzug)*7-ev('absTag')(0);
  pruef(bezahlt0===k0&&c.phase==='genehmigung'&&ende===soll&&!S.constr&&t.anl.training===3&&t.bausumme===gesamt&&gesamt>=k0,'Bauprozess: Kosten sofort, Genehmigung, Bau 10 Wochen plus Verzögerung, danach Stufe 3, Bausumme mit Auflagen und Mehrkosten',
    `Genehmigung bis Tag ${c.ab-ev('absTag')(0)}, Verzögerung ${c.verzug} Wochen, Kosten ${gesamt} (Grund ${k0})`);}

// 2. Tribüne: während des Baus 3.000 Plätze weniger, danach 3.000 mehr als vorher
{const w=welt(),{F,S,ev,t}=w,cap0=t.cap;F.bauStarten('cap');const c=S.constr;let d=S.tag,waehrend=null,n=0;while(S.constr&&n<400){d++;n++;F.bauTag(d);if(S.constr&&S.constr.phase==='bau'&&waehrend==null)waehrend=t.cap;}
  pruef(waehrend===cap0-3000&&t.cap===cap0+3000,'Tribüne: während des Baus 3.000 Plätze weniger, danach 3.000 mehr',`${cap0} → ${waehrend} → ${t.cap}`);}

// 3. Wirkungen der Anlagen
{const {F,S,ev,t}=welt();t.anl={training:3,nlz:2,reha:3,catering:1,tafel:1};
  const g=ev('gelaendeFaktor')(VEREIN),r=ev('gelaendeRisiko')(VEREIN),j=ev('jugendDeckel')(),h=ev('rehaFaktor')(VEREIN),z=ev('zuschauerFaktor')(t),fremd=ev('gelaendeFaktor')(S.teams.find(x=>x.id!==VEREIN).id);
  pruef(nah(g,1.05)&&nah(r,0.96)&&j===82&&nah(h,0.91)&&nah(z,1.08)&&fremd===1,'Wirkungen: Gelände Stufe 3 ×1,05 und Risiko ×0,96, NLZ Stufe 2 Deckel 82, Reha Stufe 3 ×0,91, Catering und Tafel +8 %, Computer-Verein unverändert',[g,r,j,h,z,fremd].join(', '));}

// 4. Instandhaltung: 1 % der Bausumme im Jahr, monatlich
{const {F,S,t}=welt();t.bausumme=1.2e6;const f0=S.fin['Instandhaltung']||0;F.instandhaltung();
  pruef((S.fin['Instandhaltung']||0)-f0===-1000,'Instandhaltung: 1,2 Mio. Bausumme kosten 1.000 € im Monat');}

// 5. Etwa ein Drittel der Bauten wird später fertig (K26 §10), etwa jeder fünfte Antrag kommt mit Auflagen
{const {F,S,t}=welt();let verzug=0,auflage=0,n=0;for(let k=0;k<300;k++){S.constr=null;S.tag=k;t.cash=50e6;F.bauStarten(k%2?'logen':'catering');if(!S.constr)continue;n++;if(S.constr.verzug)verzug++;if(S.constr.auflage)auflage++;if(t.anl)t.anl.catering=0;}
  pruef(n>=250&&verzug/n>0.2&&verzug/n<0.4&&auflage/n>0.12&&auflage/n<0.28,'Verzögerung bei 20 bis 40 % der Bauten, Auflagen bei 12 bis 28 %',`${n} Bauten, Verzögerung ${Math.round(verzug/n*100)} %, Auflagen ${Math.round(auflage/n*100)} %`);}

// 6. Alter Spielstand: Baustelle im alten Format wird am Tag der Saison fertig
{const {F,S,t}=welt(),l0=t.logen;S.constr={k:'logen',bis:S.tag+3,label:'10 VIP-Logen'};F.bauTag(S.tag+2);const noch=!!S.constr;F.bauTag(S.tag+3);
  pruef(noch&&!S.constr&&t.logen===l0+10,'Alter Spielstand: Baustelle im alten Format wird am alten Tag fertig');}

// 7. Vereinswechsel während des Tribünenbaus: Der alte Verein baut fertig, ihm fehlen danach keine Plätze
{const w=welt(),{F,S,ev,t}=w,cap0=t.cap;F.bauStarten('cap');let d=S.tag,n=0;while(S.constr&&S.constr.phase!=='bau'&&n<100){d++;n++;F.bauTag(d);}const waehrend=t.cap;F.bauAbgeben();
  pruef(waehrend===cap0-3000&&t.cap===cap0+3000&&!S.constr,'Vereinswechsel: Tribüne beim alten Verein fertig, keine Plätze verloren',`${cap0} → ${waehrend} → ${t.cap}`);}

// 8. K26b (K26 §7): Ein Computer-Verein baut die Tribüne aus, wenn die Nachfrage zwei Saisons nacheinander über 95 % der Plätze liegt, die neuen Plätze nicht über
//    105 % der Nachfrage hinausgehen und genug Geld bleibt. Zu wenig Geld: kein Bau. Zu wenig Nachfrage für 3.000 Plätze mehr: kein Leerbau.
{const {F,S,ev}=welt(),B=ev('RB'),T=B.tribuene,o=S.teams.find(x=>x.lg===1&&x.id!==S.my),n0=ev('kiNachfrage')(o);
  o.cap=Math.round(n0*0.9);o.voll=1;o.cash=200e6;const c0=o.cash,cap0=o.cap,r1=F.kiBauen(o),gebaut=r1==='cap'&&o.cap===cap0+T.plaetze&&o.cash===c0-T.kosten&&o.voll===0;
  o.cap=Math.round(n0*0.9);o.voll=1;o.cash=T.kosten;const r2=F.kiBauen(o),arm=r2!=='cap'&&o.cap===Math.round(n0*0.9);
  o.cap=Math.round(n0*1.02);o.voll=1;o.cash=200e6;const r3=F.kiBauen(o),leer=r3!=='cap'; // voll genug (über 95 %), aber 3.000 Plätze mehr lägen über 105 % der Nachfrage
  pruef(gebaut&&arm&&leer,'K26b: Tribüne nach Nachfrage und Geld, kein Leerbau',`Nachfrage ${n0}, gebaut ${r1}, arm ${r2}, knapp ${r3}`);}

// 9. K26b: Ohne Tribüne baut ein reicher Computer-Verein höchstens eine Anlage je Saison aus der Liste seines Profils, ein armer keine. Dein Verein baut nicht von selbst.
{const {F,S,ev,t}=welt(),B=ev('RB'),o=S.teams.find(x=>x.lg===2&&x.id!==S.my);o.cap=1e5;o.voll=0;o.cash=500e6;
  const liste=B.computer.anlagen[ev('vereinsProfile')(o).includes('ausbildung')?'ausbildung':'standard'],k=F.kiBauen(o),reich=k===liste[0]&&(k==='shop'?o.shop===1:ev('anlage')(o,k)===B.anlagen[k].start+1); // seit K26c steht der Fanshop vorn
  const p=S.teams.find(x=>x.lg===3&&x.id!==S.my);p.cap=1e5;p.cash=0;const arm=F.kiBauen(p)===null;
  const cap0=t.cap,anl0=JSON.stringify(t.anl||{});t.voll=5;F.kiBauenSaison();const mein=t.cap===cap0&&JSON.stringify(t.anl||{})===anl0;
  pruef(reich&&arm&&mein,'K26b: Anlage nach Profil, nur mit Geld, dein Verein nicht',`reich ${k} (erwartet ${liste[0]}), arm ${arm}, dein Verein unverändert ${mein}`);}

// 10. K26c: Computer-Vereine zahlen Instandhaltung je Ligaspiel (1 % der Bausumme je Saison, verteilt auf die Ligaspiele)
{const {F,S,ev}=welt(),o=S.teams.find(x=>x.lg===2&&x.id!==S.my),g=S.teams.find(x=>x.lg===2&&x.id!==S.my&&x.id!==o.id),n=S.fx[2].length;
  o.bausumme=0;let c=o.cash;F.kiFinanzenSpiel(o,{h:g.id,a:o.id});const ohne=o.cash-c;o.bausumme=12e6;c=o.cash;F.kiFinanzenSpiel(o,{h:g.id,a:o.id});const mit=o.cash-c;
  pruef(ohne-mit===Math.round(12e6*ev('RB').instandhaltung/n),'K26c: Instandhaltung der Computer-Vereine je Ligaspiel',`${ohne} → ${mit}`);}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
