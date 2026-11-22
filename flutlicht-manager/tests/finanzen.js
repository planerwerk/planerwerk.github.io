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
{let erg=null;saisons({n:1,seed:SEED,verein:VEREIN,vorher:(F,W)=>{W.ev('entlassen=function(){}');},beiSaisonende:S=>{const v=S.finV||[];if(!v.length){erg={n:0};return;}
    const start=v[0].cash-v[0].saldo-(v[0].k||0),summe=v.reduce((a,r)=>a+r.saldo+(r.k||0),0),diff=Math.abs(v[v.length-1].cash-start-summe),umsatz=v.reduce((a,r)=>a+r.ein-r.aus,0); // k: Kreditflüsse (K23e)
    erg={n:v.length,diff,umsatz,loan:S.loan||0};}});
  pruef(erg&&erg.n>=9&&erg.diff<=Math.max(1000,erg.umsatz*0.001),'Saison: mindestens 9 Monatsberichte, Kontostand gleich Startstand plus Summe der Monatssalden (K23 §10)',
    erg?`${erg.n} Berichte, Abweichung ${Math.round(erg.diff)} € bei ${Math.round(erg.umsatz)} € Umsatz${erg.loan?', Kredit '+erg.loan:''}`:'kein Saisonende');}

// ---------- K23e (§5.5d) ----------
// 6. Kredit mit Laufzeit: Tranche, Tilgung am Monatsersten, Kreditfluss im Bericht, Sondertilgung; alter Kredit ohne Tranche wird übernommen
{const {F,S,ev,t}=welt(),d=tagMit(ev,'10-01');t.cash=10e6;S.loan=0;F.kreditAufnehmen(2.4e6,2);const rate=S.kredite[0].rate;S.finM={s:S.season,mo:'09',fin:Object.assign({},S.fin),cash:t.cash,k:0};S.tag=d;
  const c0=t.cash;F.finanzenMonat(d);const row=S.finV[S.finV.length-1],nachRate=S.loan,cashNach=t.cash;F.kreditTilgen(1e6);
  const w2=welt();w2.S.loan=1e6;w2.F.kreditTilgen(0);const alt=(w2.S.kredite||[]).length===1&&w2.S.kredite[0].rest===1e6;
  pruef(rate===100000&&row.k===2.4e6&&nachRate===2.3e6&&cashNach===c0-1e5&&S.loan===1.3e6&&alt,'Kredit: 2,4 Mio. über 2 Jahre = 100.000 € im Monat, Aufnahme im Bericht, Tilgung am Monatsersten, Sondertilgung, alter Kredit wird Tranche',
    `Rate ${rate}, k ${row.k}, Kredit ${nachRate} → ${S.loan}`);}

// 7. Ablöse in Raten: Hälfte sofort, Rest mit 5 % Aufschlag in 12 Raten, Rate am Monatsersten gebucht
{const {F,S,ev,W}=welt(),d=tagMit(ev,'11-01'),doc=W.ev('document'),el=doc.getElementById('raten');el.checked=true;const f0=S.fin['Transfers']||0;F.abloeseZahlen(4e6,'Testspieler');el.checked=false;
  const sofort=f0-(S.fin['Transfers']||0),r=S.raten[0];S.finM={s:S.season,mo:'10',fin:Object.assign({},S.fin),cash:W.ev('myT()').cash,k:0};S.tag=d;F.finanzenMonat(d);
  pruef(sofort===2e6&&r&&r.rest===Math.round(2e6*1.05)-Math.ceil(2.1e6/12)&&S.fin['Transfers: Raten']===-Math.ceil(2.1e6/12),'Raten: 2 Mio. sofort, 2,1 Mio. in 12 Raten, erste Rate am Monatsersten',`sofort ${sofort}, Rest ${r&&r.rest}`);}

// 8. Gehaltsverzicht: nur in der Not, 15 % weniger Gehalt, Stimmung −10, einmal je Saison
{const {F,S,ev,t}=welt(),p=ev('squad')(VEREIN)[0];p.st=50;t.cash=1e6;F.gehaltsverzicht();const ohneNot=!S.verzicht;t.cash=-1e5;F.gehaltsverzicht();const mit=!!S.verzicht&&ev('gehaltFaktor')()===0.85&&ev('stimmung')(p)===40;
  const bis=S.verzicht.bis;S.verzicht.bis=0;F.gehaltsverzicht();const nurEinmal=S.verzicht.bis===0;S.verzicht.bis=bis;
  pruef(ohneNot&&mit&&nurEinmal,'Gehaltsverzicht: ohne Not abgelehnt, in der Not 15 % weniger Gehalt und Stimmung −10, nur einmal je Saison');}

// 9. Mäzen: nur in der Not; angenommen bringt Geld, danach mischt sich auch ein Präsident ohne Ehrgeiz ein
{const {F,S,ev,t}=welt(),A=ev('AUSLOESER');t.cash=1e6;const ohne=A.maezen();t.cash=-1e5;const mit=A.maezen();const g0=S.fin['Ereignisse']||0;F.kartenEntscheiden({id:'maezen',tag:S.tag,s:S.season,b:{},text:''},0,false);
  pruef(ohne===null&&!!mit&&(S.fin['Ereignisse']||0)-g0===1500000&&S.maezen===S.season,'Mäzen: nur in der Not, 1,5 Mio. €, danach mischt sich der Präsident ein',`Geld ${(S.fin['Ereignisse']||0)-g0}, Merker ${S.maezen}`);}

// 10. Vereinswechsel (takeJob): Kredite, Raten, Lizenzprüfung und Marketing des alten Vereins gehen nicht mit, der neue Verein zahlt nichts davon
{const {F,S,ev,t}=welt(),alt=t;F.kreditAufnehmen(2e6,3);(S.raten=S.raten||[]).push({n:'Test',rest:600000,rate:50000});S.lzp={s:S.season,fehlt:1,sperre:S.season};ev('mkS')().ww=99;
  const neu=S.teams.find(x=>x.lg===1&&x.id!==S.my).id;F.takeJob(neu);const c0=ev('myT()').cash;F.monatsRaten();const c1=ev('myT()').cash;
  pruef(S.my===neu&&(S.kredite||[]).length===0&&(S.raten||[]).length===0&&!ev('transferSperre')()&&ev('mkS')().ww!==99&&c1===c0,'Vereinswechsel: keine Kredite, Raten, Sperre oder Marketingwerte vom alten Verein',`Kredite ${(S.kredite||[]).length}, Raten ${(S.raten||[]).length}, Werbewert ${ev('mkS')().ww}, Kasse ${c0} → ${c1}`);}

// 11. K23b: Computer-Verein je Ligaspiel nach dem Modell (auswärts TV + Sponsor + Sonstiges − Gehälter − Betrieb − Jugend, zu Hause dazu die Zuschauer), keine Pauschale mehr
{const {F,S,ev}=welt(),RF=ev('RF'),t=S.teams.find(x=>x.lg===3&&x.id!==S.my),o=S.teams.find(x=>x.lg===3&&x.id!==S.my&&x.id!==t.id),n=S.fx[3].length;
  const soll=ev('tvGeld')(t)+t.rep*t.rep*RF.sponsor.liga3+ev('RFP').sonstiges[3]-Math.round((ev('squad')(t.id).reduce((a,p)=>a+p.sal,0)+ev('stabGehaelter')(t.id))/n)-Math.round(t.cap*RF.betrieb.jePlatz+(t.logen||0)*RF.betrieb.jeLoge)-RF.jugendKosten[ev('RS').nachwuchs.computerStufe];
  let c=t.cash;F.kiFinanzenSpiel(t,{h:o.id,a:t.id});const aus=t.cash-c;c=t.cash;F.kiFinanzenSpiel(t,{h:t.id,a:o.id});const heim=t.cash-c;
  pruef(aus===soll&&heim-aus===ev('kiHeimEinnahmen')(t,o,false)&&heim>aus,'K23b: Computer-Verein bucht Einnahmen und Ausgaben je Spiel, zu Hause mit Zuschauern',`auswärts ${aus} (Soll ${soll}), zu Hause ${heim}`);}

// 12. K23b: Insolvenz eines Computer-Vereins nach zwei Monatsersten unter dem Kreditrahmen: 9 Punkte Abzug, Konto auf 0
{const {F,S,ev}=welt(),t=S.teams.find(x=>x.lg===2&&x.id!==S.my);t.cash=-ev('kreditRahmen')(t)-1;F.kiInsolvenzPruefen();const nachEinem=(S.abzug&&S.abzug[S.season]||{})[t.id]||0;t.cash=-ev('kreditRahmen')(t)-1;F.kiInsolvenzPruefen();
  pruef(nachEinem===0&&S.abzug[S.season][t.id]===9&&t.cash===0,'K23b: Insolvenz eines Computer-Vereins mit Punktabzug und Schuldenschnitt',`Abzug ${S.abzug&&S.abzug[S.season]&&S.abzug[S.season][t.id]}, Konto ${t.cash}`);}

// 13. K23d: Gehaltsrahmen = 85 % der erwarteten Einnahmen, Anteil steigt mit den Gehältern, Transferbudget = Konto über 10 % Reserve, über 110 % kauft niemand
{const {F,S,ev,t}=welt(),B=ev('RFP').budget,E=ev('erwarteteEinnahmen')(t),r0=ev('rahmenAnteil')(t);ev('squad')(S.my).forEach(p=>{p.sal*=5;});const r1=ev('rahmenAnteil')(t);t.cash=E;
  pruef(ev('gehaltsRahmen')(t)===Math.round(E*B.gehaltAnteil)&&r1>r0*4&&r1>B.sperreAb&&ev('transferBudget')(t)===E-Math.round(E*B.reserve),'K23d: Gehaltsrahmen, Anteil und Transferbudget',`Rahmen ${ev('gehaltsRahmen')(t)}, Anteil ${r0.toFixed(2)} → ${r1.toFixed(2)}, Budget ${ev('transferBudget')(t)}`);}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
