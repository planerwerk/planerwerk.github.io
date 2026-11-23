// Finanzplan (K23 §5.5c, K23a): Monatsbericht, Liquiditätsprognose, Lizenzprüfung im März mit Auflagen und Transfersperre, Insolvenz mit Punktabzug.
// Zuerst nur für deinen Verein, die Computer-Vereine folgen mit K23b (heute buchen sie keine Ausgaben). Die Buchungen bleiben je Spieltag (S.fin je Saison und Art).
// Im Spielstand: S.finM = {s, mo, fin, cash} (Stand am letzten Monatsersten), S.finV = [{mo, ein, aus, saldo, cash, prog}] (Monate der laufenden Saison),
// S.finSchnitt = laufender Saldo je Ligaspiel der letzten Saison, S.lzp = {s, fehlt, geprueft, sperre (Saison der Transfersperre), unter (Monatserste unter dem Rahmen), ins (Saison des Abzugs der letzten Insolvenz, nach dem letzten Spieltag die nächste, Prüfung ET4)},
// S.abzug = {Saison: {Verein: Punkte}} (saison.js table). Am Verein t.fins: Saison des Abzugs der letzten Insolvenz (dein Verein und Computer-Vereine, sperrt eine zweite, ET1). Ohne Zufall.
const finLaufend=()=>Object.entries(S.fin||{}).filter(([k])=>RFP.laufend.includes(k)).reduce((a,[,v])=>a+v,0);
// Laufender Saldo je eigenem Ligaspiel: Schnitt dieser Saison, vor minSpiele der der letzten Saison, sonst 0
function saldoJeSpiel(){const n=finSpiele();if(n>=RFP.minSpiele)return finLaufend()/n;return S.finSchnitt!=null?S.finSchnitt:0;}
// Eigene Ligaspiele seit Beginn der Buchungen: nach einem Vereinswechsel mitten in der Saison erst ab dem Wechsel (S.finSp0 = {s, n}, finanzenStart)
const finSpiele=()=>meineSpieltage()-(S.finSp0&&S.finSp0.s===S.season?S.finSp0.n:0);
function finanzenStart(){S.finSp0={s:S.season,n:meineSpieltage()};}
const restSpiele=(bis)=>meineLigaspiele().filter(e=>(e.tag>S.tag||(e.tag===S.tag&&S.gespielt!==e.tag))&&(bis==null||e.tag<=bis)).length;
// Prognose des Kontostands: bis Saisonende, mit naechste zusätzlich eine ganze nächste Saison mit demselben Schnitt
// Seit K23e abzüglich der festen Zahlungen (Tilgung, Raten aus Ablösen) in den verbleibenden Monaten
function finPrognose(naechste){const t=myT(),s=saldoJeSpiel(),mon=Math.max(0,Math.ceil(((S.plan?S.plan.ende:S.tag)-S.tag)/RFP.monatTage));
  let c=t.cash+s*restSpiele()-festeZahlungen(mon);if(naechste)c+=s*((S.fx&&S.fx[t.lg]||[]).length)-(festeZahlungen(mon+12)-festeZahlungen(mon));return Math.round(c);}
const lzpS=()=>S.lzp||(S.lzp={});
const transferSperre=()=>!!S.lzp&&S.lzp.sperre===S.season;
// Sperre für die nächste Saison steht schon fest (ab dem Nachweis am 31. Mai): keine Käufe mehr, die erst zum Saisonwechsel vollzogen würden
const transferSperreNaechste=()=>!!S.lzp&&S.lzp.sperre===S.season+1;
const monatName=mo=>(typeof MONL!=='undefined'?MONL:MON)[(+mo+11)%12];

// Täglich (ablauf.js taeglichLauf): am Monatsersten der Bericht, am 1. März die Lizenzprüfung, am 31. Mai der Nachweis
function finanzenTag(d){const k=mmtt(d);if(k.slice(3)==='01'){finanzenMonat(d);kiInsolvenzPruefen();}if(S.phase==='play'&&k===RFP.lizenzTag){lizenzPruefung();kiLizenzPruefen(false);}if(k===RFP.nachweisTag){lizenzNachweis();kiLizenzPruefen(true);}} // Computer-Vereine seit K23g
// Reihenfolge: erst die Insolvenz (ein Schuldenschnitt gehört in den abgelaufenen Monat), dann der Bericht, dann der neue Stand, dann Tilgung und Raten (gehören in den neuen Monat).
// k: Kreditflüsse des Monats (Aufnahme +, Tilgung −), getrennt von Einnahmen und Ausgaben (K23e).
// ohneZahlungen: zum Saisonwechsel (der 1. Juli selbst läuft nie durch taeglich), Tilgung und Raten bucht dann finanzenSaisonstart in die neue Saison.
// Ohne Stand (neues Spiel, Vereinswechsel) gilt S.fin seit dem Anfang als Grundlage, so kommt der erste Bericht schon am nächsten Monatsersten.
function finanzenMonat(d,ohneZahlungen){const t=myT();let M=S.finM||{s:S.season,mo:mmtt(d-1).slice(0,2),fin:{},cash:t.cash,k:0};const mo=mmtt(d).slice(0,2);
  if(M&&M.s!==S.season){M={s:S.season,mo:M.mo,fin:{},cash:M.cash,k:0};S.finV=[];} // neue Saison: S.fin und die Kreditflüsse beginnen bei null
  insolvenzPruefen();const fin=S.fin||{};
  if(M){let ein=0,aus=0;for(const k of new Set([...Object.keys(fin),...Object.keys(M.fin)])){const v=(fin[k]||0)-(M.fin[k]||0);if(v>0)ein+=v;else aus+=v;}
    const k=kreditNetto()-(M.k||0),prog=finPrognose(false),R0=-kreditRahmen(t),bald=t.cash+saldoJeSpiel()*restSpiele(S.tag+RFP.warnMonate*RFP.monatTage)-festeZahlungen(RFP.warnMonate);
    (S.finV=S.finV||[]).push({mo:M.mo,ein,aus,saldo:ein+aus,k,cash:t.cash,prog});
    const warn=bald<R0?` Achtung: Nach der Prognose fällt der Kontostand in den nächsten drei Monaten unter den Kreditrahmen (${fmt(R0)}). Dann droht die Insolvenz.`:'';
    news(`Monatsbericht ${monatName(M.mo)}: Einnahmen ${fmt(ein)}, Ausgaben ${fmt(-aus)}, Saldo ${fmt(ein+aus)}.${k?` Kredit ${k>0?'aufgenommen':'getilgt'}: ${fmt(Math.abs(k))}.`:''} Kontostand ${fmt(t.cash)}, Prognose zum Saisonende ${fmt(prog)}.${warn}`,warn||ein+aus<0?'bad':'');}
  S.finM={s:S.season,mo,fin:Object.assign({},fin),cash:t.cash,k:kreditNetto()};if(!ohneZahlungen){monatsRaten();instandhaltung();}} // Instandhaltung der Bauten (K26 §5.1)
// Saisonwechsel (saison.js newSeasonLauf, nach S.fin={}): Stand für den Juli, dann Tilgung, Raten und Instandhaltung des 1. Juli in der neuen Saison
function finanzenSaisonstart(){S.finM={s:S.season,mo:'07',fin:{},cash:myT().cash,k:0};monatsRaten();instandhaltung();}
// Insolvenz (K23 §5.4): an zwei Monatsersten nacheinander unter dem negativen Kreditrahmen. Punktabzug, Vertrauen, Schuldenschnitt, höchstens einmal je Saison.
function insolvenzPruefen(){const t=myT(),L=lzpS(),I=RFP.insolvenz;if(t.cash<-kreditRahmen(t))L.unter=(L.unter||0)+1;else L.unter=0;
  if(L.unter<I.monate||L.ins===S.season||t.fins===S.season||S.phase!=='play')return; /* t.fins: Sperre am Verein, überlebt einen Jobwechsel (Prüfung ET1) */
  /* Nach dem letzten Spieltag der eigenen Liga gilt der Abzug für die neue Saison (Prüfung ER1: sonst zwischen den Relegationsspielen; ES1: sofort gebucht statt aufgeschoben) */
  const s=insolvenzSaison(t);L.ins=s;t.fins=s;L.unter=0;
  const A=S.abzug||(S.abzug={}),a=A[s]||(A[s]={});a[S.my]=(a[S.my]||0)+I.punkte;S.trust=clamp(S.trust+I.vertrauen,0,100);money('Schuldenschnitt',-t.cash);
  news(`Insolvenz: ${t.name} ist zahlungsunfähig. ${I.punkte} Punkte Abzug${s>S.season?' in der neuen Saison':''}, die Gläubiger verzichten auf die Schulden, der Kredit bleibt. Der Vorstand ist entsetzt.`,'bad');}
// Saison des Punktabzugs: die laufende, nach dem letzten Spieltag der eigenen Liga die nächste (ER1, ES1)
const insolvenzSaison=t=>ligaFertig(t.lg)?S.season+1:S.season;
// Lizenzprüfung (1. März): Liquidität am Ende der nächsten Saison nach der Prognose. Liquidität = Kontostand + nicht genutzter Kreditrahmen.
const liquiditaet=c=>c+Math.max(0,kreditRahmen(myT())-(S.loan||0));
function lizenzPruefung(){const L=lzpS(),p=finPrognose(true),liq=liquiditaet(p);L.s=S.season;L.geprueft=0;
  if(liq>=0){L.fehlt=0;news(`Lizenzprüfung für ${stSaison(S.season+1)}: ohne Auflagen. Prognose zum Ende der nächsten Saison ${fmt(p)}.`,'good');return;}
  L.fehlt=Math.round(-liq);S.trust=clamp(S.trust+RFP.auflage,0,100);
  news(`Lizenzprüfung für ${stSaison(S.season+1)}: Auflagen. Nach der Prognose fehlen am Ende der nächsten Saison ${fmt(L.fehlt)}. Nachweis bis 31. Mai: Spieler verkaufen oder Kosten senken. Sonst gibt es in der nächsten Saison eine Transfersperre.`,'bad');}
// Nachweis (31. Mai, sonst spätestens beim Saisonwechsel): Fehlt noch Geld, Transfersperre für die nächste Saison
function lizenzNachweis(){const L=S.lzp;if(!L||L.s!==S.season||!L.fehlt||L.geprueft)return;L.geprueft=1;const liq=liquiditaet(finPrognose(true));
  if(liq>=0){L.fehlt=0;news('Lizenz: Die Auflagen sind erfüllt.','good');return;}
  L.sperre=S.season+1;news(`Lizenz: Die Auflagen sind nicht erfüllt. Transfersperre in der Saison ${stSaison(S.season+1)}: keine Käufe, keine Leihen, keine Vereinslosen. Verkaufen geht.`,'bad');}
// Saisonende (saison.js seasonEndLauf): Schnitt je Ligaspiel für die Prognose zu Beginn der nächsten Saison
function finanzenSaisonende(){const n=finSpiele();if(n>=RFP.minSpiele)S.finSchnitt=Math.round(finLaufend()/n);}
// Karte auf der Finanzseite
function finanzenKarte(){const t=myT(),L=S.lzp||{},v=S.finV||[],p=finPrognose(false);
  const lz=transferSperre()?'<p class="neg"><b>Transfersperre in dieser Saison</b> (Lizenzauflagen nicht erfüllt).</p>':L.s===S.season&&L.fehlt&&!L.geprueft?`<p class="neg"><b>Lizenzauflagen:</b> Es fehlen ${fmt(L.fehlt)} bis zum Ende der nächsten Saison. Nachweis bis 31. Mai.</p>`:L.sperre===S.season+1?`<p class="neg">Transfersperre in der nächsten Saison.</p>`:'';
  return`<div class="card"><h3>Monate und Prognose</h3>${lz}<p>Prognose zum Saisonende: <b class="${p<0?'neg':''}">${fmt(p)}</b> <span class="dim">(laufender Saldo je Ligaspiel ${fmt(saldoJeSpiel())}, noch ${restSpiele()} Ligaspiele)</span></p>
    <p>Gehaltsrahmen des Vorstands: <b>${fmt(gehaltsRahmen(t))}</b>, ausgeschöpft zu <b class="${rahmenAnteil(t)>1?'neg':''}">${Math.round(rahmenAnteil(t)*100)} %</b> · Transferbudget <b>${fmt(transferBudget(t))}</b> <span class="dim">(über ${Math.round(RFP.budget.sperreAb*100)} % gibt der Vorstand keine neuen Gehälter frei, über 100 % sinkt sein Vertrauen)</span></p>
    ${v.length?`<div class="tw"><table><thead><tr><th>Monat</th><th class="num">Einnahmen</th><th class="num">Ausgaben</th><th class="num">Saldo</th><th class="num" title="Kredit aufgenommen (+) oder getilgt (−)">Kredit</th><th class="num">Konto</th></tr></thead><tbody>${v.map(r=>`<tr><td>${esc(monatName(r.mo))}</td><td class="num posv">${fmt(r.ein)}</td><td class="num neg">${fmt(-r.aus)}</td><td class="num ${r.saldo<0?'neg':'posv'}">${fmt(r.saldo)}</td><td class="num">${r.k?fmt(r.k):'–'}</td><td class="num">${fmt(r.cash)}</td></tr>`).join('')}</tbody></table></div>`:'<p class="dim">Der erste Monatsbericht kommt am nächsten Monatsersten.</p>'}
    ${(S.kredite||[]).length?`<p>Kredite: ${S.kredite.map(k=>`${fmt(k.rest)} (Rate ${fmt(k.rate)} im Monat)`).join(', ')}</p>`:''}${(S.raten||[]).length?`<p>Ablösen in Raten: ${S.raten.map(r=>`${esc(r.n||'')} noch ${fmt(r.rest)} (Rate ${fmt(r.rate)})`).join(', ')}</p>`:''}
    ${verzichtAktiv()?`<p class="dim">Gehaltsverzicht läuft (${Math.round(S.verzicht.anteil*100)} %).</p>`:inNot()?`<div class="row"><button onclick="gehaltsverzicht()"${lzAus('kredit')}>Mannschaft um Gehaltsverzicht bitten</button><span class="dim">${Math.round(RFP.verzicht.anteil*100)} % für drei Monate, Stimmung ${RFP.verzicht.stimmung}, einmal je Saison</span></div>`:''}
    <p class="dim">Lizenzprüfung am 1. März für die nächste Saison. Insolvent ist, wer an zwei Monatsersten nacheinander unter dem Kreditrahmen von ${fmt(-kreditRahmen(t))} steht: ${RFP.insolvenz.punkte} Punkte Abzug.</p></div>`;}

// ---------- K23b (§5.2, §5.5e): Computer-Vereine nach denselben Regeln wie du ----------
// Sonstige Einnahmen (Mitglieder, Vermarktung, K23 §3.1) je Ligaspiel für alle Vereine, nach Liga (seit K23c etwa 7 % der Einnahmen)
// Seit K25d: Grundbetrag je Liga plus Mitgliedsbeiträge (Mitglieder × Jahresbeitrag ÷ Ligaspiele), gerundet. Alte Spielstände ohne t.mitglieder: Anteil der Fans.
const mitgliederVon=t=>t&&t.mitglieder!=null?t.mitglieder:Math.round(((t&&t.fans)||0)*RFP.mitglieder.ausFans);
// Alte Spielstände (vor K25d, Prüfung DL1): Mitglieder einmal aus daten/vereine.js im Verhältnis der heutigen zu den Start-Fans, sonst Anteil der Fans. Aufruf nach dem Laden.
function mitgliederUmstellen(){if(!S||!S.teams)return;S.teams.forEach(t=>{if(t.mitglieder!=null)return;const c=VEREINE[t.id];
  t.mitglieder=c&&c.mitglieder!=null&&c.fans>0?Math.round(c.mitglieder*(t.fans||c.fans)/c.fans):Math.round((t.fans||0)*RFP.mitglieder.ausFans);});}
const mitgliedsBeitraege=t=>Math.round(mitgliederVon(t)*RFP.mitglieder.beitrag/(((S.fx&&S.fx[t.lg])||[]).length||(t.lg===3?38:34)));
const sonstigeEinnahmen=t=>(RFP.sonstiges[t.lg]||0)+(t.lg<=3?mitgliedsBeitraege(t):0);
// Verwaltung und Sonstiges (K23c) je Ligaspiel für alle Vereine: Anteil nach Liga an TV, Grundbetrag der Werbung und sonstigen Einnahmen. Für dich zählt der Grundbetrag,
// nicht deine Verträge: Gut verhandeln lohnt sich also.
const verwaltungKosten=t=>Math.round((RF.verwaltung[t.lg]||RF.verwaltung[3])*(tvGeld(t)+sponsorBasis(t)+sonstigeEinnahmen(t)));
// Zuschauer im Heimspiel ohne Würfel (Mitte der Spanne) und zum Richtpreis: so verschiebt die Rechnung für Computer-Vereine keinen Zufallsstrom
// neutral (für Budgets): Form 1,4 Punkte je Spiel und Fanstimmung ohne Wirkung, damit der Rahmen nicht schwankt und im Gleichschritt für beide Läufe gleich bleibt
// frei: ohne Deckel durch die Plätze (Nachfrage, K26b)
function zuschauerErwartung(t,opp,cup,neutral,frei){const Z=RF.zuschauer,ff=Z.formBasis+Z.formJePunkt*(neutral?1.4:formPts(t.id)),of=Z.gegnerBasis+(opp?opp.rep:Z.gegnerOhne)/100*Z.gegnerFaktor,lf=t.lg===1?1:t.lg===2?Z.liga2:Z.liga3;
  return Math.round(Math.min(frei?Infinity:t.cap,t.fans*ff*of*lf*(cup?Z.pokal:1)*(Z.zufallBasis+Z.zufallSpanne/2)*(neutral?1:fanFaktor(t))));}
function kiHeimEinnahmen(t,opp,cup,neutral){const att=zuschauerErwartung(t,opp,cup,neutral);return Math.round(att*richtPreis(t)*zuschauerFaktor(t))+(t.shop?Math.round(att*RF.fanartikel[t.shop]):0)+(t.logen||0)*RF.loge;}
// Je Ligaspiel (ablauf.js): TV, Werbung (ganzer Grundbetrag, bei dir Verträge plus weitere Partner), Sonstiges, im Heimspiel Zuschauer, Fanartikel, Logen,
// minus Gehälter von Kader und Stab, Stadion und Betrieb, Verwaltung (K23c), Jugendarbeit (Stufe der Computer-Vereine). Ersetzt die Pauschale fremdeEinnahmen.
function kiFinanzenSpiel(t,r){if(!t||!aktiv(t))return;const n=(S.fx[t.lg]||[]).length||34,heim=r.h===t.id,opp=heim?(S.teams[r.a]||null):null;
  const ein=tvGeld(t)+sponsorBasis(t)+sonstigeEinnahmen(t)+(heim?kiHeimEinnahmen(t,opp,false):0);
  const aus=Math.round((squad(t.id).reduce((s,p)=>s+p.sal,0)+stabGehaelter(t.id))/n)+Math.round(t.cap*RF.betrieb.jePlatz+(t.logen||0)*RF.betrieb.jeLoge)+verwaltungKosten(t)+RF.jugendKosten[RS.nachwuchs.computerStufe]+Math.round((t.bausumme||0)*RB.instandhaltung/n); // Instandhaltung ihrer Bauten (K26c)
  t.cash+=ein-aus;}
// Je Pokalspiel: Rundenprämie für beide, Zuschauer für den Gastgeber (nicht im Finale), Siegprämie im Finale. Bisher bekamen alle Vereine eine Pauschale je Runde.
function kiPokalSpiel(r,runde){[r.h,r.a].forEach(id=>{if(id===S.my||id>=1000)return;const t=S.teams[id];if(!t)return;
  t.cash+=RF.pokalPraemien[runde]+(id===r.h&&runde!==5?kiHeimEinnahmen(t,r.a<1000?S.teams[r.a]:null,true):0)+(runde===5&&winner(r)===id?RF.pokalSieg:0);});}
// Insolvenz der Computer-Vereine (am Monatsersten, Regel wie insolvenzPruefen): zwei Monatserste unter dem negativen Kreditrahmen, Punktabzug, Schuldenschnitt
function kiInsolvenzPruefen(){if(S.phase!=='play')return;const I=RFP.insolvenz;
  S.teams.forEach(t=>{if(t.id===S.my||!aktiv(t))return;if(t.cash>=-kreditRahmen(t)){if(t.fu)t.fu=0;return;}t.fu=(t.fu||0)+1;if(t.fu<I.monate||t.fins===S.season)return;
    const s=insolvenzSaison(t);t.fu=0;t.fins=s;const A=S.abzug||(S.abzug={}),a=A[s]||(A[s]={});a[t.id]=(a[t.id]||0)+I.punkte;t.cash=0; /* nach dem letzten Spieltag Abzug in der neuen Saison (ER1, ES1) */
    news(`Insolvenz: ${t.name} ist zahlungsunfähig. ${I.punkte} Punkte Abzug${s>S.season?' in der neuen Saison':''}, die Gläubiger verzichten auf die Schulden.`,'');});}

// ---------- K23g (§5.4, §5.5c): Lizenzprüfung der Computer-Vereine ----------
// Erwarteter Saldo je Ligaspiel nach dem Modell von kiFinanzenSpiel: halb zu Hause, Heimspiel zum Erwartungswert mit neutraler Form
function kiSaldoJeSpiel(t){const n=(S.fx[t.lg]||[]).length||34;
  return tvGeld(t)+sponsorBasis(t)+sonstigeEinnahmen(t)+kiHeimEinnahmen(t,null,false,true)/2-(squad(t.id).reduce((s,p)=>s+p.sal,0)+stabGehaelter(t.id))/n
    -(t.cap*RF.betrieb.jePlatz+(t.logen||0)*RF.betrieb.jeLoge)-verwaltungKosten(t)-RF.jugendKosten[RS.nachwuchs.computerStufe]-(t.bausumme||0)*RB.instandhaltung/n;}
// Liquidität am Ende der nächsten Saison: Konto + Saldo × (restliche Ligaspiele dieser Saison + eine ganze Saison) + Kreditrahmen (wie liquiditaet bei dir). tab: Tabellen je Liga
function kiLiquiditaet(t,tab){const n=(S.fx[t.lg]||[]).length||34,r=(tab&&tab[t.lg]||table(t.lg)).find(x=>x.id===t.id),rest=Math.max(0,n-(r?r.sp:0));return t.cash+kiSaldoJeSpiel(t)*(rest+n)+kreditRahmen(t);}
// 1. März (nachweis false): Auflagen bei negativer Liquidität (t.lzA = Saison). 31. Mai (nachweis true): mit Auflagen und noch negativ: Transfersperre für die nächste Saison (t.lzSperre).
// Ohne Gespräch und ohne Zufall. Gilt nicht für deinen Verein, der hat seine eigene Prüfung (lizenzPruefung).
function kiLizenzPruefen(nachweis){const tab={},me=S.teams[S.my];LIGEN.forEach(lg=>tab[lg]=table(lg));
  S.teams.forEach(t=>{if(t.id===S.my||!aktiv(t))return;const neg=kiLiquiditaet(t,tab)<0;if(!nachweis){t.lzA=neg?S.season:null;return;}
    if(t.lzA===S.season&&neg){t.lzSperre=S.season+1;if(me&&t.lg===me.lg)news(`Lizenz: ${t.name} bekommt eine Transfersperre für die nächste Saison (Liquidität nicht nachgewiesen).`,'');}});}
// Gesperrt in dieser Saison: kein Kauf, keine Leihe, keine Angebote für deine Spieler, kein Mitbieter (computer.js kiMarkt, ablauf.js market, transfers.js konkurrenzKauf)
const kiTransferSperre=t=>!!t&&t.id!==S.my&&t.lzSperre!=null&&t.lzSperre>=S.season; // schon ab dem 31. Mai (Prüfung DF2), sonst kamen im Juni noch Angebote

// ---------- K23d (§5.3, §5.5f): Budgets vom Vorstand ----------
// Erwartete Einnahmen einer Saison ohne Transfers und Prämien: Liga-Modell wie bei den Computer-Vereinen (TV, Sponsor, Sonstiges, Heimspiele zum Erwartungswert)
function erwarteteEinnahmen(t){const n=(S.fx[t.lg]||[]).length||34;return Math.round(n*(tvGeld(t)+sponsorBasis(t)+sonstigeEinnahmen(t))+n/2*kiHeimEinnahmen(t,null,false,true));} // neutrale Form (1,4 Punkte je Spiel), damit der Rahmen nicht von Woche zu Woche schwankt
const gehaltsRahmen=t=>Math.round(erwarteteEinnahmen(t)*RFP.budget.gehaltAnteil);
const gehaltsSumme=t=>squad(t.id).reduce((s,p)=>s+p.sal,0)+stabGehaelter(t.id);
// Anteil am Rahmen (1 = genau ausgeschöpft). Über RFP.budget.sperreAb: keine Käufe (offer, kiMarkt), über 1: Vertrauen sinkt (vorstandWoche)
const rahmenAnteil=t=>gehaltsSumme(t)/Math.max(1,gehaltsRahmen(t));
// Darf ein Verein ein neues Gehalt dazunehmen? Gleiche Regel für dich (offer, Karte „verpflichten“) und Computer-Vereine (kiMarkt): mit dem neuen Gehalt höchstens sperreAb × Rahmen
const rahmenErlaubt=(t,neu)=>gehaltsSumme(t)+(neu||0)<=gehaltsRahmen(t)*RFP.budget.sperreAb;
// Bei deinem Verein verschoben durch das Zielgespräch (K28 §5.2, U12e): hochgepokert mehr, tiefgestapelt weniger
const transferBudget=t=>Math.max(0,Math.round((t.cash-Math.round(erwarteteEinnahmen(t)*RFP.budget.reserve))*(t.id===S.my?zgBudgetFaktor():1)));

// ---------- K23e (§5.5d): Kredit mit Laufzeit, Raten aus Ablösen, Gehaltsverzicht ----------
// Kredit in Tranchen: S.kredite = [{rest, rate, bis}], S.loan bleibt die Summe der Reste (Zinsen und Anzeige wie bisher).
// Kreditflüsse stehen nicht in S.fin, sondern in S.finK = {s, auf, tilg} (Saison), damit Saisonbilanz und Nebenziel „Finanzen“ unberührt bleiben.
function kreditFluss(v){const K=S.finK&&S.finK.s===S.season?S.finK:(S.finK={s:S.season,auf:0,tilg:0});if(v>0)K.auf+=v;else K.tilg+=v;}
const kreditNetto=()=>S.finK&&S.finK.s===S.season?S.finK.auf+S.finK.tilg:0;
// Alter Spielstand oder Kredit ohne Tranche: eine Tranche mit Standardlaufzeit
function kreditAltUebernehmen(){const K=S.kredite||(S.kredite=[]),summe=K.reduce((x,k)=>x+k.rest,0);if((S.loan||0)>summe+1){const a=S.loan-summe,j=RFP.kredit.standard;K.push({rest:a,rate:Math.max(1,Math.ceil(a/(j*12))),bis:absTag(S.tag)+j*365});}}
function kreditAufnehmen(a,jahre){const t=myT(),j=RFP.kredit.jahre.includes(jahre)?jahre:RFP.kredit.standard;kreditAltUebernehmen();
  S.kredite.push({rest:a,rate:Math.max(1,Math.ceil(a/(j*12))),bis:absTag(S.tag)+j*365});S.loan=(S.loan||0)+a;t.cash+=a;kreditFluss(a);}
// Sondertilgung (und Automatik am Saisonende): älteste Tranche zuerst, nur aus dem Guthaben
function kreditTilgen(a){const t=myT();kreditAltUebernehmen();const g=Math.max(0,Math.min(a,S.loan||0,Math.max(0,t.cash)));let rest=g;
  for(const k of S.kredite){if(rest<=0)break;const x=Math.min(rest,k.rest);k.rest-=x;rest-=x;}S.kredite=S.kredite.filter(k=>k.rest>0);S.loan-=g;t.cash-=g;if(g)kreditFluss(-g);return g;}
// Am Monatsersten nach dem Bericht: Tilgung der Tranchen (auch ins Minus, es ist eine Pflicht) und fällige Raten aus Ablösen
function monatsRaten(){const t=myT();kreditAltUebernehmen();let tilg=0;S.kredite.forEach(k=>{const x=Math.min(k.rest,k.rate);k.rest-=x;tilg+=x;});S.kredite=S.kredite.filter(k=>k.rest>0);
  if(tilg){S.loan=Math.max(0,(S.loan||0)-tilg);t.cash-=tilg;kreditFluss(-tilg);}
  (S.raten||[]).forEach(r=>{const x=Math.min(r.rest,r.rate);r.rest-=x;money('Transfers: Raten',-x);});S.raten=(S.raten||[]).filter(r=>r.rest>0);}
// Vereinswechsel (saison.js takeJob): Kredite, Raten, Verzicht, Monatsberichte, Lizenzprüfung, Schnitt und Mäzen gehören dem alten Verein (wie bisher S.loan)
function finanzenJobwechsel(){S.kredite=[];S.raten=[];S.verzicht=null;S.finK=null;S.finM=null;S.finV=[];S.finSchnitt=null;S.lzp=null;S.maezen=null;}
// Feste Zahlungen der nächsten m Monate (Tilgung und Raten), für die Prognose
function festeZahlungen(m){let s=0;(S.kredite||[]).forEach(k=>s+=Math.min(k.rest,k.rate*m));(S.raten||[]).forEach(r=>s+=Math.min(r.rest,r.rate*m));return s;}
// Ablöse in Raten (Kauf, aktionen.js offer): Hälfte sofort, Rest mit Aufschlag in Monatsraten. Der Verkäufer bekommt alles sofort.
const ratenGewaehlt=()=>{const e=typeof document!=='undefined'&&document.getElementById('raten');return !!(e&&e.checked);};
const feeJetzt=fee=>ratenGewaehlt()?Math.round(fee*RFP.raten.anzahlung):fee;
function abloeseZahlen(fee,name){const R0=RFP.raten;if(!ratenGewaehlt()){money('Transfers',-fee);return;}const anz=Math.round(fee*R0.anzahlung),rest=Math.round((fee-anz)*(1+R0.aufschlag));
  money('Transfers',-anz);(S.raten=S.raten||[]).push({n:name,rest,rate:Math.ceil(rest/R0.monate)});news(`Ablöse in Raten: ${fmt(anz)} jetzt, dazu ${R0.monate} Monatsraten von ${fmt(Math.ceil(rest/R0.monate))}.`);}
// Gehaltsverzicht (Notmaßnahme): nur bei Kontostand im Minus oder offenen Lizenzauflagen, einmal je Saison
const verzichtAktiv=()=>!!S.verzicht&&S.verzicht.bis>=absTag(S.tag);
const gehaltFaktor=()=>verzichtAktiv()?1-S.verzicht.anteil:1;
const inNot=()=>myT().cash<0||(!!S.lzp&&S.lzp.s===S.season&&S.lzp.fehlt>0&&!S.lzp.geprueft);
function gehaltsverzicht(){if(!darf('kredit'))return;const V=RFP.verzicht;if(S.verzicht&&S.verzicht.s===S.season){toast('In dieser Saison gab es schon einen Gehaltsverzicht.');return;}
  if(!inNot()){toast('Die Spieler sehen keinen Grund für einen Verzicht: Der Verein steht nicht in der Not.');return;}
  S.verzicht={s:S.season,bis:absTag(S.tag)+V.tage,anteil:V.anteil};squad(S.my).forEach(p=>stimmungAendern(p,V.stimmung));
  news(`Gehaltsverzicht: Die Mannschaft verzichtet ${Math.round(V.tage/30)} Monate auf ${Math.round(V.anteil*100)} % der Gehälter. Begeistert ist niemand.`,'bad');save();render();}
