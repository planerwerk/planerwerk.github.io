// Finanzplan (K23 §5.5c, §10, K23a): Monatsbericht, Prognose, Lizenzprüfung mit Auflagen und Transfersperre, Insolvenz mit Punktabzug, eine Saison im Ablauf
// mit der Prüfung „Kontostand nachvollziehbar aus den Buchungen“ (K23 §10).
// Aufruf: node tests/finanzen.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. K23a entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt,saisons}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711;
function welt(){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();if(S.sponsOffers)F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);S.phase='play';
  return{W,F,S,ev:W.ev,t:W.ev('myT()')};}
const tagMit=(ev,mmtt)=>{for(let d=0;d<400;d++)if(ev('mmtt')(d)===mmtt)return d;return null;};

// 1. Monatsbericht: Einnahmen und Ausgaben des Monats aus den Buchungen, Zeile in der Monatsliste, Meldung
{const {F,S,ev,t}=welt(),d=tagMit(ev,'09-01');S.fin={'TV-Gelder':1e6,'Gehälter':-8e5};S.finM={s:S.season,mo:'08',fin:{'TV-Gelder':4e5,'Gehälter':-3e5},cash:t.cash};S.tag=d;F.finanzenMonat(d);
  const r=(S.finV||[])[0],n=S.news.find(x=>/Monatsbericht/.test(x.t||x));
  pruef(r&&r.ein===6e5&&r.aus===-5e5&&r.saldo===1e5&&!!n&&S.finM.mo==='09','Monatsbericht: 600.000 € ein, 500.000 € aus, Saldo 100.000 €, neue Zeile und Meldung',r?JSON.stringify(r):'keine Zeile');}

// 2. Prognose: Kontostand + Saldo je Ligaspiel × verbleibende Ligaspiele (vor dem dritten Spiel mit dem Schnitt der letzten Saison)
{const {F,S,ev,t}=welt();S.finSchnitt=100000;const rest=ev('restSpiele')(),p=F.finPrognose(false),p2=F.finPrognose(true);
  pruef(rest>0&&p===Math.round(t.cash+1e5*rest)&&p2===Math.round(p+1e5*S.fx[t.lg].length),'Prognose: Kontostand plus 100.000 € je verbleibendem Ligaspiel, für die Lizenz eine Saison mehr',`${rest} Spiele, ${p}, ${p2}`);}

// 3. Lizenz: Auflagen bei negativer Prognose (Vertrauen −5), Nachweis verfehlt: Transfersperre in der nächsten Saison, Kauf und Leihe gesperrt
{const {F,S,ev,t}=welt();S.finSchnitt=-5e5;t.cash=-1e6;S.trust=50;F.lizenzPruefung();const L=S.lzp,aufl=L.fehlt>0&&S.trust===45;F.lizenzNachweis();const sperre=L.sperre===S.season+1;
  S.season++;const gesperrt=ev('transferSperre')(),p=S.pl.find(x=>x.team===-1)||S.pl.find(x=>x.team>=0&&x.team!==VEREIN),team0=p.team;F.offer(p.id);const kauf=p.team===team0;
  const leih=String(F.ausleihen(S.pl.find(x=>x.team>=0&&x.team!==VEREIN))||'');S.season--;
  pruef(aufl&&sperre&&gesperrt&&kauf&&/Transfersperre/.test(leih),'Lizenz: Auflagen (Vertrauen −5), Nachweis verfehlt, Transfersperre in der nächsten Saison, Kauf und Leihe gesperrt',`fehlt ${L.fehlt}, Sperre ${L.sperre}`);}

// 4. Insolvenz: zweimal nacheinander unter dem negativen Kreditrahmen, 9 Punkte Abzug in der Tabelle, Vertrauen −30, Kontostand 0
{const {F,S,ev,t}=welt(),g=S.teams.find(x=>x.lg===t.lg&&x.id!==VEREIN).id;S.res[t.lg].push([VEREIN,g,2,0,0]);const vor=ev('table')(t.lg).find(r=>r.id===VEREIN).p;
  t.cash=-ev('kreditRahmen')(t)-1e6;S.trust=60;F.insolvenzPruefen();const nachEins=!(S.abzug&&S.abzug[S.season]);F.insolvenzPruefen();const nach=ev('table')(t.lg).find(r=>r.id===VEREIN).p;
  pruef(nachEins&&vor===3&&nach===-6&&S.trust===30&&t.cash===0,'Insolvenz: erst beim zweiten Monatsersten, 9 Punkte Abzug (3 → −6), Vertrauen −30, Kontostand 0',`${vor} → ${nach}, Vertrauen ${S.trust}, Konto ${t.cash}`);}

// 5. Eine Saison im Ablauf: Monatsberichte, und der Kontostand ist aus den Buchungen nachvollziehbar (Summe der Monatssalden = Änderung des Kontostands)
{let erg=null;saisons({n:1,seed:SEED,verein:VEREIN,beiSaisonende:S=>{const v=S.finV||[];if(!v.length){erg={n:0};return;}
    const start=v[0].cash-v[0].saldo,summe=v.reduce((a,r)=>a+r.saldo,0),diff=Math.abs(v[v.length-1].cash-start-summe),umsatz=v.reduce((a,r)=>a+r.ein-r.aus,0);
    erg={n:v.length,diff,umsatz,loan:S.loan||0};}});
  pruef(erg&&erg.n>=9&&erg.diff<=Math.max(1000,erg.umsatz*0.001),'Saison: mindestens 9 Monatsberichte, Kontostand gleich Startstand plus Summe der Monatssalden (K23 §10)',
    erg?`${erg.n} Berichte, Abweichung ${Math.round(erg.diff)} € bei ${Math.round(erg.umsatz)} € Umsatz${erg.loan?', Kredit '+erg.loan:''}`:'kein Saisonende');}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
