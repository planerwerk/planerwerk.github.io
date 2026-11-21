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

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
