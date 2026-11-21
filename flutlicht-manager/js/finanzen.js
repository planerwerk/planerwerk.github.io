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
function finPrognose(naechste){const t=myT(),s=saldoJeSpiel();let c=t.cash+s*restSpiele();if(naechste)c+=s*((S.fx&&S.fx[t.lg]||[]).length);return Math.round(c);}
const lzpS=()=>S.lzp||(S.lzp={});
const transferSperre=()=>!!S.lzp&&S.lzp.sperre===S.season;
const monatName=mo=>(typeof MONL!=='undefined'?MONL:MON)[(+mo+11)%12];

// Täglich (ablauf.js taeglichLauf): am Monatsersten der Bericht, am 1. März die Lizenzprüfung, am 31. Mai der Nachweis
function finanzenTag(d){const k=mmtt(d);if(k.slice(3)==='01')finanzenMonat(d);if(S.phase==='play'&&k===RFP.lizenzTag)lizenzPruefung();if(k===RFP.nachweisTag)lizenzNachweis();}
function finanzenMonat(d){const t=myT(),fin=S.fin||{};let M=S.finM;const mo=mmtt(d).slice(0,2);
  if(M&&M.s!==S.season){M={s:S.season,mo:M.mo,fin:{},cash:M.cash};S.finV=[];} // neue Saison: S.fin beginnt bei null
  if(M){let ein=0,aus=0;for(const k of new Set([...Object.keys(fin),...Object.keys(M.fin)])){const v=(fin[k]||0)-(M.fin[k]||0);if(v>0)ein+=v;else aus+=v;}
    const prog=finPrognose(false),R0=-kreditRahmen(t),bald=t.cash+saldoJeSpiel()*restSpiele(S.tag+RFP.warnMonate*RFP.monatTage);
    (S.finV=S.finV||[]).push({mo:M.mo,ein,aus,saldo:ein+aus,cash:t.cash,prog});
    const warn=bald<R0?` Achtung: Nach der Prognose fällt der Kontostand in den nächsten drei Monaten unter den Kreditrahmen (${fmt(R0)}). Dann droht die Insolvenz.`:'';
    news(`Monatsbericht ${monatName(M.mo)}: Einnahmen ${fmt(ein)}, Ausgaben ${fmt(-aus)}, Saldo ${fmt(ein+aus)}. Kontostand ${fmt(t.cash)}, Prognose zum Saisonende ${fmt(prog)}.${warn}`,warn||ein+aus<0?'bad':'');}
  insolvenzPruefen();S.finM={s:S.season,mo,fin:Object.assign({},fin),cash:t.cash};}
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
    ${v.length?`<div class="tw"><table><thead><tr><th>Monat</th><th class="num">Einnahmen</th><th class="num">Ausgaben</th><th class="num">Saldo</th><th class="num">Konto</th></tr></thead><tbody>${v.map(r=>`<tr><td>${esc(monatName(r.mo))}</td><td class="num posv">${fmt(r.ein)}</td><td class="num neg">${fmt(-r.aus)}</td><td class="num ${r.saldo<0?'neg':'posv'}">${fmt(r.saldo)}</td><td class="num">${fmt(r.cash)}</td></tr>`).join('')}</tbody></table></div>`:'<p class="dim">Der erste Monatsbericht kommt am nächsten Monatsersten.</p>'}
    <p class="dim">Lizenzprüfung am 1. März für die nächste Saison. Insolvent ist, wer an zwei Monatsersten nacheinander unter dem Kreditrahmen von ${fmt(-kreditRahmen(t))} steht: ${RFP.insolvenz.punkte} Punkte Abzug.</p></div>`;}
