// Finanzplan (K23 §5.5c, §10, K23a): Monatsbericht, Prognose, Lizenzprüfung mit Auflagen und Transfersperre, Insolvenz mit Punktabzug, eine Saison im Ablauf
// mit der Prüfung „Kontostand nachvollziehbar aus den Buchungen“ (K23 §10). Dazu K23b (11, 12), K23d (13) und K23c (14 bis 18, echte Größenordnungen).
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

// 11. K23b: Computer-Verein je Ligaspiel nach dem Modell (auswärts TV + Werbung + Sonstiges − Gehälter − Betrieb − Verwaltung (K23c) − Jugend, zu Hause dazu die Zuschauer), keine Pauschale mehr
{const {F,S,ev}=welt(),RF=ev('RF'),t=S.teams.find(x=>x.lg===3&&x.id!==S.my),o=S.teams.find(x=>x.lg===3&&x.id!==S.my&&x.id!==t.id),n=S.fx[3].length;
  const soll=ev('tvGeld')(t)+ev('sponsorBasis')(t)+ev('RFP').sonstiges[3]-Math.round((ev('squad')(t.id).reduce((a,p)=>a+p.sal,0)+ev('stabGehaelter')(t.id))/n)-Math.round(t.cap*RF.betrieb.jePlatz+(t.logen||0)*RF.betrieb.jeLoge)-ev('verwaltungKosten')(t)-RF.jugendKosten[ev('RS').nachwuchs.computerStufe];
  let c=t.cash;F.kiFinanzenSpiel(t,{h:o.id,a:t.id});const aus=t.cash-c;c=t.cash;F.kiFinanzenSpiel(t,{h:t.id,a:o.id});const heim=t.cash-c;
  pruef(aus===soll&&heim-aus===ev('kiHeimEinnahmen')(t,o,false)&&heim>aus,'K23b: Computer-Verein bucht Einnahmen und Ausgaben je Spiel, zu Hause mit Zuschauern',`auswärts ${aus} (Soll ${soll}), zu Hause ${heim}`);}

// 12. K23b: Insolvenz eines Computer-Vereins nach zwei Monatsersten unter dem Kreditrahmen: 9 Punkte Abzug, Konto auf 0
{const {F,S,ev}=welt(),t=S.teams.find(x=>x.lg===2&&x.id!==S.my);t.cash=-ev('kreditRahmen')(t)-1;F.kiInsolvenzPruefen();const nachEinem=(S.abzug&&S.abzug[S.season]||{})[t.id]||0;t.cash=-ev('kreditRahmen')(t)-1;F.kiInsolvenzPruefen();
  pruef(nachEinem===0&&S.abzug[S.season][t.id]===9&&t.cash===0,'K23b: Insolvenz eines Computer-Vereins mit Punktabzug und Schuldenschnitt',`Abzug ${S.abzug&&S.abzug[S.season]&&S.abzug[S.season][t.id]}, Konto ${t.cash}`);}

// 13. K23d: Gehaltsrahmen = gehaltAnteil (seit K23c 75 %) der erwarteten Einnahmen, Anteil steigt mit den Gehältern, Transferbudget = Konto über 10 % Reserve, über 110 % kauft niemand
{const {F,S,ev,t}=welt(),B=ev('RFP').budget,E=ev('erwarteteEinnahmen')(t),r0=ev('rahmenAnteil')(t);ev('squad')(S.my).forEach(p=>{p.sal*=5;});const r1=ev('rahmenAnteil')(t);t.cash=E;
  pruef(ev('gehaltsRahmen')(t)===Math.round(E*B.gehaltAnteil)&&r1>r0*4&&r1>B.sperreAb&&ev('transferBudget')(t)===E-Math.round(E*B.reserve),'K23d: Gehaltsrahmen, Anteil und Transferbudget',`Rahmen ${ev('gehaltsRahmen')(t)}, Anteil ${r0.toFixed(2)} → ${r1.toFixed(2)}, Budget ${ev('transferBudget')(t)}`);}

// 14. K23c: TV-Gelder nach dem Säulenmodell: Töpfe je Liga voll verteilt, oben mehr als unten, 3. Liga gleich, je Ligaspiel ein Teil des Saisonbetrags
{const {S,ev}=welt(),T=ev('RF').tv,b=ev('tvSaisonBetrag'),rang=ev('tvRang'),summe=lg=>S.teams.filter(x=>x.lg===lg).reduce((a,x)=>a+b(x),0);
  const l1=S.teams.filter(x=>x.lg===1).sort((x,y)=>rang(x)-rang(y)),l3=S.teams.filter(x=>x.lg===3),n1=S.fx[1].length;
  const ok=[1,2,3].every(lg=>Math.abs(summe(lg)-T.topf[lg])<=20)&&b(l1[0])>b(l1[l1.length-1])*1.5&&l3.every(x=>b(x)===b(l3[0]))&&Math.abs(ev('tvGeld')(l1[0])*n1-b(l1[0]))<=n1;
  pruef(ok,'K23c: TV-Gelder nach dem Säulenmodell',`1. Liga ${Math.round(summe(1)/1e6)} Mio. (${Math.round(b(l1[0])/1e6)} bis ${Math.round(b(l1[l1.length-1])/1e6)}), 2. Liga ${Math.round(summe(2)/1e6)} Mio., 3. Liga je ${Math.round(b(l3[0])/1e5)/10} Mio.`);}

// 15. K23c: Fünfjahreswertung: Punkte der Saison aus dem Gesamtplatz, ein Absteiger mit guter Wertung bekommt in der 2. Liga das meiste TV-Geld
{const {F,S,ev}=welt(),a=S.teams.filter(x=>x.lg===1).sort((x,y)=>y.rep-x.rep)[0],z=S.teams.find(x=>x.lg===2);
  S.teams.forEach(x=>{if(x.lg<=3)x.lastPos=1;});z.lastPos=3;F.tvWertungEintragen();
  const n=S.teams.filter(x=>x.lg<=3).length,pa=a.tvw[0],pz=z.tvw[0];a.lg=2;
  const v=ev('tvSaisonBetrag')(a),rest=S.teams.filter(x=>x.lg===2&&x.id!==a.id).map(x=>ev('tvSaisonBetrag')(x));
  pruef(pa===n&&pz===n-20&&ev('tvRang')(a)===1&&rest.every(x=>v>x),'K23c: Fünfjahreswertung, ein Absteiger bekommt in der 2. Liga das meiste TV-Geld',`Punkte ${pa} und ${pz}, Rang ${ev('tvRang')(a)}, ${Math.round(v/1e6)} gegen höchstens ${Math.round(Math.max(...rest)/1e6)} Mio.`);}

// 16. K23c: Je Ligaspiel bucht dein Verein Verwaltung und weitere Sponsoren, beide zählen in der Prognose (laufend)
{const {F,S,ev,t}=welt();let m=null;S.fx[t.lg].some(md=>md.some(([h,a])=>{if(a===S.my){m={h,a,hg:1,ag:1,lg:t.lg};return true;}return false;}));
  const v0=S.fin['Verwaltung']||0,w0=S.fin['Weitere Sponsoren']||0;F.finanzenLiga(m);const v=(S.fin['Verwaltung']||0)-v0,w=(S.fin['Weitere Sponsoren']||0)-w0,L=ev('RFP').laufend;
  pruef(v===-ev('verwaltungKosten')(t)&&v<0&&w===Math.round(ev('sponsorBasis')(t)*ev('RF').werbung.partner)&&w>0&&L.includes('Verwaltung')&&L.includes('Weitere Sponsoren'),'K23c: Verwaltung und weitere Sponsoren je Ligaspiel',`Verwaltung ${v}, weitere Sponsoren ${w}`);}

// 17. K23c: Alte Spielstände: Gehälter einmal auf die neue Kurve umgerechnet, im gleichen Verhältnis zur Kurve wie vorher, ein zweiter Aufruf ändert nichts
{const {F,S,ev}=welt(),A=ev('RP').gehaltAlt,alt=s=>A.basis*Math.exp(A.steigung*(s-A.mitte)),kurve=ev('salaryFor'),p=S.pl.find(x=>x.team>=0&&x.str>=80),q=S.pl.find(x=>x.team>=0&&x.str<=62);
  p.sal=Math.round(alt(p.str)*1.2/1000)*1000;q.sal=Math.round(alt(q.str)/1000)*1000;p.wech={nach:S.my,sal:Math.round(alt(p.str)/1000)*1000};
  const t=ev('myT()'),SA=ev('RF').sponsorAlt,brustAlt=Math.round(t.rep*t.rep*SA.liga[t.lg]*SA.anteil.brust),brustNeu=ev('sponsorBasis')(t)*ev('RF').werbung.anteil.brust;if(S.spons)S.spons.base=brustAlt;
  delete S.k23c;F.k23cUmstellen();const sp=p.sal;F.k23cUmstellen();const vertrag=!S.spons||Math.abs(S.spons.base-brustNeu)<=2000;
  pruef(S.k23c===1&&Math.abs(p.sal/kurve(p.str)-1.2)<0.01&&Math.abs(q.sal-kurve(q.str))<=2000&&p.sal===sp&&Math.abs(p.wech.sal-kurve(p.str))<=2000&&vertrag,'K23c: Gehälter, vorgemerkte Wechsel und Werbeverträge alter Spielstände einmal umgerechnet',
    `${p.n}: ${p.sal} (Kurve ${kurve(p.str)}), Wechsel ${p.wech.sal}, ${q.n}: ${q.sal} (Kurve ${kurve(q.str)}), Brust ${S.spons&&S.spons.base} (Soll ${Math.round(brustNeu)})`);}

// 18. K23c: Größenordnungen in der neuen Welt: Gehälter je Liga, Kaderwerte, Startkonto und Kreditrahmen wachsen mit dem Ansehen (Grenzen grob, Modellrechnung K23 §5.6b)
{const {S,ev}=welt(),sq=ev('squad'),val=ev('value'),kr=ev('kreditRahmen'),lg=l=>S.teams.filter(x=>x.lg===l),schnitt=(l,f)=>lg(l).reduce((a,x)=>a+sq(x.id).reduce((b,p)=>b+f(p),0),0)/lg(l).length;
  const g=[1,2,3].map(l=>schnitt(l,p=>p.sal)),w1=schnitt(1,val),w3=schnitt(3,val),reich=lg(1).sort((a,b)=>b.rep-a.rep)[0],arm=lg(3).sort((a,b)=>a.rep-b.rep)[0];
  pruef(g[0]>40e6&&g[0]<120e6&&g[1]>8e6&&g[1]<30e6&&g[2]>3e6&&g[2]<12e6&&w1>w3*8&&reich.cash>arm.cash*10&&kr(reich)>kr(arm)*3,'K23c: Größenordnungen (Gehälter, Kaderwerte, Startkonto, Kreditrahmen)',
    `Gehälter je Verein ${g.map(x=>Math.round(x/1e5)/10).join(' / ')} Mio., Kaderwert 1. Liga ${Math.round(w1/1e6)}, 3. Liga ${Math.round(w3/1e6)} Mio., Konto ${Math.round(reich.cash/1e6)} gegen ${Math.round(arm.cash/1e5)/10} Mio., Kreditrahmen ${Math.round(kr(reich)/1e6)} gegen ${Math.round(kr(arm)/1e6)} Mio.`);}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
