// Kalender (Konzept K01): Datum, Spielplan der Saison, Halt-Regeln, „Tag beenden“ und Erinnerungen.
// Tag 0 ist der 1. Juli der Saison. S.tag ist der aktuelle Tag, S.gespielt der Tag, dessen Spiele schon gelaufen sind.
const TAG_MS=864e5;
const WT=['So','Mo','Di','Mi','Do','Fr','Sa'],WTL=['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
const MON=['Jan.','Feb.','März','Apr.','Mai','Juni','Juli','Aug.','Sep.','Okt.','Nov.','Dez.'],MONL=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const saisonNull=saison=>Date.UTC(saison,6,1);
function tagAusDatum(iso,saison,schieben=0){const[y,m,d]=iso.split('-').map(Number);return Math.round((Date.UTC(y,m-1,d)+schieben*TAG_MS-saisonNull(saison))/TAG_MS);}
const datumVon=(tag,saison)=>new Date(saisonNull(saison==null?S.season:saison)+tag*TAG_MS);
const wochentag=tag=>datumVon(tag).getUTCDay();
const datumKurz=tag=>{const d=datumVon(tag);return`${WT[d.getUTCDay()]} ${d.getUTCDate()}.${d.getUTCMonth()+1}.`;};
const datumMittel=tag=>{const d=datumVon(tag);return`${WT[d.getUTCDay()]} ${d.getUTCDate()}. ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;};
const datumLang=tag=>{const d=datumVon(tag);return`${WTL[d.getUTCDay()]}, ${d.getUTCDate()}. ${MONL[d.getUTCMonth()]} ${d.getUTCFullYear()}`;};

// Spielplan einer Saison aus den Rahmenterminen. Spätere Jahre: um volle Wochen verschoben, Wochentage bleiben gleich.
function planFuer(saison){const T=TERMINE_2026,sh=Math.round((saisonNull(saison)-saisonNull(T.saison))/(7*TAG_MS))*7,t=iso=>tagAusDatum(iso,saison,sh);
  return{start:t(T.start),ende:t(T.ende),liga:{1:T.liga1.map(t),2:T.liga2.map(t)},pokal:T.pokal.map(t),rel:T.relegation.map(t),pausen:T.pausen.map(p=>({von:t(p.von),bis:t(p.bis),name:p.name,liga:p.liga||0}))};}
// Termine eines Tages: Ligaspieltage, Pokalrunde, Relegation, Saisonende
function termineAm(d){const P=S.plan,L=[];
  [1,2].forEach(lg=>{const md=P.liga[lg].indexOf(d);if(md>=0)L.push({art:'liga',lg,md,tag:d});});
  const r=P.pokal.indexOf(d);if(r>=0)L.push({art:'pokal',r,tag:d});
  const k=P.rel.indexOf(d);if(k>=0)L.push({art:'rel',leg:k,tag:d});
  if(d===P.ende)L.push({art:'ende',tag:d});return L;}
// Relegation: 16. der 1. Liga gegen den 3. der 2. Liga (erst sinnvoll, wenn beide Ligen fertig sind)
const relTeams=()=>[table(1)[15].id,table(2)[2].id];
const ligenFertig=()=>S.res[1].length>=lgIds(1).length/2*S.fx[1].length&&S.res[2].length>=lgIds(2).length/2*S.fx[2].length;
// Spielt dein Verein an Tag d? Liefert den Termin oder null.
function meinSpiel(d){const t=myT();
  for(const e of termineAm(d)){
    if(e.art==='liga'&&e.lg===t.lg)return e;
    if(e.art==='pokal'&&S.cup.hist.length===e.r&&S.cup.alive.includes(S.my))return e;
    if(e.art==='rel'&&ligenFertig()&&relTeams().includes(S.my))return e;}
  return null;}
// Heim- und Gastverein deines Spiels (Pokal: wird erst beim Anpfiff gelost)
function paarung(e){if(e.art==='liga')return S.fx[e.lg][e.md].find(x=>x.includes(S.my));if(e.art==='rel'){const[a,b]=relTeams();return e.leg===0?[b,a]:[a,b];}return null;}
function spielName(e){return e.art==='liga'?`${e.md+1}. Spieltag`:e.art==='pokal'?`DFB-Pokal, ${POKAL_RUNDEN[e.r]}`:e.art==='rel'?`Relegation, ${e.leg?'Rückspiel':'Hinspiel'}`:'Saisonende';}
function naechstesSpiel(ab){for(let d=ab;d<=S.plan.ende;d++){const e=meinSpiel(d);if(e)return e;}return null;}
const pauseAm=(d,lg)=>S.plan.pausen.find(p=>d>=p.von&&d<=p.bis&&(!p.liga||p.liga===lg));
const ersterPflichttermin=()=>Math.min(S.plan.liga[myT().lg][0],S.plan.pokal[0]);
function tagesText(d){const e=meinSpiel(d);if(e)return spielName(e);const p=pauseAm(d,myT().lg);if(p)return p.name+' – spielfrei';if(d<ersterPflichttermin())return'Saisonvorbereitung';if(d>S.plan.liga[myT().lg][33])return'Saisonende naht';return'spielfrei';}
const meineSpieltage=()=>{const lg=myT().lg;return S.plan.liga[lg].filter(d=>d<S.tag||(d===S.tag&&S.gespielt===d)).length;};
const heuteMeinSpiel=()=>S.gespielt!==S.tag&&!!meinSpiel(S.tag);

// Halt-Regeln: Hier hält „Tag beenden“ an.
function haltGrund(d){if(S.phase==='end')return'Saisonende';if(S.fired)return'Entlassen';if(meinSpiel(d))return'Spiel';if(S.offers.some(o=>o.bis===d))return'Frist';return'';}
function naechsterHalt(){for(let d=S.tag+1;d<=S.tag+RK.maxSprung;d++){if(d>=S.plan.ende||meinSpiel(d)||S.offers.some(o=>o.bis===d))return Math.min(d,S.plan.ende);}return S.tag+RK.maxSprung;}

// Tageswechsel
function tagBeginn(d){taeglich(d);if(wochentag(d)===RK.wochenTag)woechentlich(d);if(d>=S.plan.ende&&S.phase!=='end')seasonEnd();}
function tagEnde(d){if(S.gespielt!==d)tagesSpiele(d);}
// Beendet den heutigen Tag und springt zum nächsten Halt, höchstens RK.maxSprung Tage weit. Gibt die Zahl der Tage zurück.
function weiter(){let n=0;tagEnde(S.tag);
  while(S.phase!=='end'&&!S.fired){S.tag++;n++;S.gespielt=-1;tagBeginn(S.tag);if(haltGrund(S.tag)||n>=RK.maxSprung)break;tagEnde(S.tag);}
  save();return n;}

// Erinnerungen vor „Tag beenden“: nur, wenn wirklich etwas offen ist. Jede Art ist im Menü abschaltbar.
const erinnerungAn=k=>!(S.einst&&S.einst.aus&&S.einst.aus[k]);
function erinnerungen(){const E=[],d=S.tag,m=S.gespielt!==d?meinSpiel(d):null;
  if(erinnerungAn('frist'))S.offers.filter(o=>o.bis===d).forEach(o=>{const p=PIX.get(o.pid);if(p)E.push({art:'frist',text:`Das Angebot von ${esc(S.teams[o.tid].name)} für ${esc(p.n)} (${fmt(o.amt)}) gilt nur noch heute.`,tab:'buero',knopf:'Zum Angebot'});});
  if(m&&erinnerungAn('aufstellung')){const aus=(S.lineup||[]).map(id=>PIX.get(id)).filter(p=>p&&p.team===S.my&&!avail(p));
    if(aus.length)E.push({art:'aufstellung',text:`In deiner Startelf fehlen ${aus.map(p=>esc(p.n)).join(', ')}. Ohne Änderung stellt das Spiel automatisch Ersatz auf.`,tab:'aufst',knopf:'Zur Aufstellung'});}
  if(m&&erinnerungAn('sponsor')&&S.sponsOffers)E.push({art:'sponsor',text:'Du hast noch keinen Trikotsponsor gewählt. Sonst nimmt der Vorstand das erste Angebot.',tab:'buero',knopf:'Zu den Angeboten'});
  if(erinnerungAn('vertrag')&&S.plan.ende-d<=RK.erinnerungVertragTage){const xi=new Set(myXI()),e=squad(S.my).filter(p=>p.ct<=1&&xi.has(p.id));
    if(e.length)E.push({art:'vertrag',text:`Die Verträge von ${e.map(p=>esc(p.n)).join(', ')} enden zum Saisonende. Danach sind sie weg.`,tab:'kader',knopf:'Zum Kader'});}
  return E;}
