// Finanzplan (K23 §5.5c, K23a): Monatsbericht, Liquiditätsprognose, Lizenzprüfung im März mit Auflagen und Transfersperre, Insolvenz mit Punktabzug.
// Zuerst nur für deinen Verein, die Computer-Vereine folgen mit K23b (heute buchen sie keine Ausgaben). Die Buchungen bleiben je Spieltag (S.fin je Saison und Art).
// Im Spielstand: S.finM = {s, mo, fin, cash} (Stand am letzten Monatsersten), S.finV = [{mo, ein, aus, saldo, cash, prog}] (Monate der laufenden Saison),
// S.finSchnitt = laufender Saldo je Ligaspiel der letzten Saison, S.lzp = {s, fehlt, geprueft, sperre (Saison der Transfersperre), unter (Monatserste unter dem Rahmen), ins (Saison der letzten Insolvenz)},
// S.abzug = {Saison: {Verein: Punkte}} (saison.js table). Ohne Zufall.
const finLaufend=()=>Object.entries(S.fin||{}).filter(([k])=>RFP.laufend.includes(k)).reduce((a,[,v])=>a+v,0);
// Laufender Saldo je eigenem Ligaspiel: Schnitt dieser Saison, vor minSpiele der der letzten Saison, sonst 0
function saldoJeSpiel(){const n=meineSpieltage();if(n>=RFP.minSpiele)return finLaufend()/n;return S.finSchnitt!=null?S.finSchnitt:0;}
const restSpiele=(bis)=>meineLigaspiele().filter(e=>(e.tag>S.tag||(e.tag===S.tag&&S.gespielt!==e.tag))&&(bis==null||e.tag<=bis)).length;
// Prognose des Kontostands: bis Saisonende, mit naechste zusätzlich eine ganze nächste Saison mit demselben Schnitt
// Seit K23e abzüglich der festen Zahlungen (Tilgung, Raten aus Ablösen) in den verbleibenden Monaten
function finPrognose(naechste){const t=myT(),s=saldoJeSpiel(),mon=Math.max(0,Math.ceil(((S.plan?S.plan.ende:S.tag)-S.tag)/RFP.monatTage));
  let c=t.cash+s*restSpiele()-festeZahlungen(mon);if(naechste)c+=s*((S.fx&&S.fx[t.lg]||[]).length)-(festeZahlungen(mon+12)-festeZahlungen(mon));return Math.round(c);}
const lzpS=()=>S.lzp||(S.lzp={});
const transferSperre=()=>!!S.lzp&&S.lzp.sperre===S.season;
const monatName=mo=>(typeof MONL!=='undefined'?MONL:MON)[(+mo+11)%12];

// Täglich (ablauf.js taeglichLauf): am Monatsersten der Bericht, am 1. März die Lizenzprüfung, am 31. Mai der Nachweis
function finanzenTag(d){const k=mmtt(d);if(k.slice(3)==='01')finanzenMonat(d);if(S.phase==='play'&&k===RFP.lizenzTag)lizenzPruefung();if(k===RFP.nachweisTag)lizenzNachweis();}
// Reihenfolge: erst die Insolvenz (ein Schuldenschnitt gehört in den abgelaufenen Monat), dann der Bericht, dann der neue Stand, dann Tilgung und Raten (gehören in den neuen Monat).
// k: Kreditflüsse des Monats (Aufnahme +, Tilgung −), getrennt von Einnahmen und Ausgaben (K23e).
function finanzenMonat(d){const t=myT();let M=S.finM;const mo=mmtt(d).slice(0,2);
  if(M&&M.s!==S.season){M={s:S.season,mo:M.mo,fin:{},cash:M.cash,k:0};S.finV=[];} // neue Saison: S.fin und die Kreditflüsse beginnen bei null
  insolvenzPruefen();const fin=S.fin||{};
  if(M){let ein=0,aus=0;for(const k of new Set([...Object.keys(fin),...Object.keys(M.fin)])){const v=(fin[k]||0)-(M.fin[k]||0);if(v>0)ein+=v;else aus+=v;}
    const k=kreditNetto()-(M.k||0),prog=finPrognose(false),R0=-kreditRahmen(t),bald=t.cash+saldoJeSpiel()*restSpiele(S.tag+RFP.warnMonate*RFP.monatTage)-festeZahlungen(RFP.warnMonate);
    (S.finV=S.finV||[]).push({mo:M.mo,ein,aus,saldo:ein+aus,k,cash:t.cash,prog});
    const warn=bald<R0?` Achtung: Nach der Prognose fällt der Kontostand in den nächsten drei Monaten unter den Kreditrahmen (${fmt(R0)}). Dann droht die Insolvenz.`:'';
    news(`Monatsbericht ${monatName(M.mo)}: Einnahmen ${fmt(ein)}, Ausgaben ${fmt(-aus)}, Saldo ${fmt(ein+aus)}.${k?` Kredit ${k>0?'aufgenommen':'getilgt'}: ${fmt(Math.abs(k))}.`:''} Kontostand ${fmt(t.cash)}, Prognose zum Saisonende ${fmt(prog)}.${warn}`,warn||ein+aus<0?'bad':'');}
  S.finM={s:S.season,mo,fin:Object.assign({},fin),cash:t.cash,k:kreditNetto()};monatsRaten();}
// Insolvenz (K23 §5.4): an zwei Monatsersten nacheinander unter dem negativen Kreditrahmen. Punktabzug, Vertrauen, Schuldenschnitt, höchstens einmal je Saison.
function insolvenzPruefen(){const t=myT(),L=lzpS(),I=RFP.insolvenz;if(t.cash<-kreditRahmen(t))L.unter=(L.unter||0)+1;else L.unter=0;
  if(L.unter<I.monate||L.ins===S.season||S.phase!=='play')return;L.ins=S.season;L.unter=0;
  const A=S.abzug||(S.abzug={}),a=A[S.season]||(A[S.season]={});a[S.my]=(a[S.my]||0)+I.punkte;S.trust=clamp(S.trust+I.vertrauen,0,100);money('Schuldenschnitt',-t.cash);
  news(`Insolvenz: ${t.name} ist zahlungsunfähig. ${I.punkte} Punkte Abzug, die Gläubiger verzichten auf die Schulden, der Kredit bleibt. Der Vorstand ist entsetzt.`,'bad');}
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
function finanzenSaisonende(){const n=meineSpieltage();if(n>=RFP.minSpiele)S.finSchnitt=Math.round(finLaufend()/n);}
// Karte auf der Finanzseite
function finanzenKarte(){const t=myT(),L=S.lzp||{},v=S.finV||[],p=finPrognose(false);
  const lz=transferSperre()?'<p class="neg"><b>Transfersperre in dieser Saison</b> (Lizenzauflagen nicht erfüllt).</p>':L.s===S.season&&L.fehlt&&!L.geprueft?`<p class="neg"><b>Lizenzauflagen:</b> Es fehlen ${fmt(L.fehlt)} bis zum Ende der nächsten Saison. Nachweis bis 31. Mai.</p>`:L.sperre===S.season+1?`<p class="neg">Transfersperre in der nächsten Saison.</p>`:'';
  return`<div class="card"><h3>Monate und Prognose</h3>${lz}<p>Prognose zum Saisonende: <b class="${p<0?'neg':''}">${fmt(p)}</b> <span class="dim">(laufender Saldo je Ligaspiel ${fmt(saldoJeSpiel())}, noch ${restSpiele()} Ligaspiele)</span></p>
    ${v.length?`<div class="tw"><table><thead><tr><th>Monat</th><th class="num">Einnahmen</th><th class="num">Ausgaben</th><th class="num">Saldo</th><th class="num" title="Kredit aufgenommen (+) oder getilgt (−)">Kredit</th><th class="num">Konto</th></tr></thead><tbody>${v.map(r=>`<tr><td>${esc(monatName(r.mo))}</td><td class="num posv">${fmt(r.ein)}</td><td class="num neg">${fmt(-r.aus)}</td><td class="num ${r.saldo<0?'neg':'posv'}">${fmt(r.saldo)}</td><td class="num">${r.k?fmt(r.k):'–'}</td><td class="num">${fmt(r.cash)}</td></tr>`).join('')}</tbody></table></div>`:'<p class="dim">Der erste Monatsbericht kommt am nächsten Monatsersten.</p>'}
    ${(S.kredite||[]).length?`<p>Kredite: ${S.kredite.map(k=>`${fmt(k.rest)} (Rate ${fmt(k.rate)} im Monat)`).join(', ')}</p>`:''}${(S.raten||[]).length?`<p>Ablösen in Raten: ${S.raten.map(r=>`${esc(r.n||'')} noch ${fmt(r.rest)} (Rate ${fmt(r.rate)})`).join(', ')}</p>`:''}
    ${verzichtAktiv()?`<p class="dim">Gehaltsverzicht läuft (${Math.round(S.verzicht.anteil*100)} %).</p>`:inNot()?`<div class="row"><button onclick="gehaltsverzicht()"${lzAus('kredit')}>Mannschaft um Gehaltsverzicht bitten</button><span class="dim">${Math.round(RFP.verzicht.anteil*100)} % für drei Monate, Stimmung ${RFP.verzicht.stimmung}, einmal je Saison</span></div>`:''}
    <p class="dim">Lizenzprüfung am 1. März für die nächste Saison. Insolvent ist, wer an zwei Monatsersten nacheinander unter dem Kreditrahmen von ${fmt(-kreditRahmen(t))} steht: ${RFP.insolvenz.punkte} Punkte Abzug.</p></div>`;}

// ---------- K23e (§5.5d): Kredit mit Laufzeit, Raten aus Ablösen, Gehaltsverzicht ----------
// Kredit in Tranchen: S.kredite = [{rest, rate, bis}], S.loan bleibt die Summe der Reste (Zinsen und Anzeige wie bisher).
// Kreditflüsse stehen nicht in S.fin, sondern in S.finK = {s, auf, tilg} (Saison), damit Saisonbilanz und Nebenziel „Finanzen“ unberührt bleiben.
function kreditFluss(v){const K=S.finK&&S.finK.s===S.season?S.finK:(S.finK={s:S.season,auf:0,tilg:0});if(v>0)K.auf+=v;else K.tilg+=v;}
const kreditNetto=()=>S.finK&&S.finK.s===S.season?S.finK.auf+S.finK.tilg:0;
// Alter Spielstand oder Kredit ohne Tranche: eine Tranche mit Standardlaufzeit
function kreditAltUebernehmen(){const K=S.kredite||(S.kredite=[]),summe=K.reduce((x,k)=>x+k.rest,0);if((S.loan||0)>summe+1){const a=S.loan-summe,j=RFP.kredit.standard;K.push({rest:a,rate:Math.round(a/(j*12)),bis:absTag(S.tag)+j*365});}}
function kreditAufnehmen(a,jahre){const t=myT(),j=RFP.kredit.jahre.includes(jahre)?jahre:RFP.kredit.standard;kreditAltUebernehmen();
  S.kredite.push({rest:a,rate:Math.round(a/(j*12)),bis:absTag(S.tag)+j*365});S.loan=(S.loan||0)+a;t.cash+=a;kreditFluss(a);}
// Sondertilgung (und Automatik am Saisonende): älteste Tranche zuerst, nur aus dem Guthaben
function kreditTilgen(a){const t=myT();kreditAltUebernehmen();const g=Math.max(0,Math.min(a,S.loan||0,Math.max(0,t.cash)));let rest=g;
  for(const k of S.kredite){if(rest<=0)break;const x=Math.min(rest,k.rest);k.rest-=x;rest-=x;}S.kredite=S.kredite.filter(k=>k.rest>0);S.loan-=g;t.cash-=g;if(g)kreditFluss(-g);return g;}
// Am Monatsersten nach dem Bericht: Tilgung der Tranchen (auch ins Minus, es ist eine Pflicht) und fällige Raten aus Ablösen
function monatsRaten(){const t=myT();kreditAltUebernehmen();let tilg=0;S.kredite.forEach(k=>{const x=Math.min(k.rest,k.rate);k.rest-=x;tilg+=x;});S.kredite=S.kredite.filter(k=>k.rest>0);
  if(tilg){S.loan=Math.max(0,(S.loan||0)-tilg);t.cash-=tilg;kreditFluss(-tilg);}
  (S.raten||[]).forEach(r=>{const x=Math.min(r.rest,r.rate);r.rest-=x;money('Transfers: Raten',-x);});S.raten=(S.raten||[]).filter(r=>r.rest>0);}
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
