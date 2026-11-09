// Kalender (Konzept K01): Datum, Spielplan der Saison, Halt-Regeln, „Tag beenden“, Sommer und Erinnerungen.
// Tag 0 ist der 1. Juli der Saison. S.tag ist der aktuelle Tag, S.gespielt der Tag, dessen Spiele schon gelaufen sind.
// Jedes Ligaspiel hat einen eigenen Tag und eine Anstoßzeit: S.plan.zeit[liga][spieltag][i] = [tag, minute], passend zu S.fx[liga][spieltag][i].
const TAG_MS=864e5,LIGEN=[1,2,3];
const WT=['So','Mo','Di','Mi','Do','Fr','Sa'],WTL=['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
const MON=['Jan.','Feb.','März','Apr.','Mai','Juni','Juli','Aug.','Sep.','Okt.','Nov.','Dez.'],MONL=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const saisonNull=saison=>Date.UTC(saison,6,1);
function tagAusDatum(iso,saison,schieben=0){const[y,m,d]=iso.split('-').map(Number);return Math.round((Date.UTC(y,m-1,d)+schieben*TAG_MS-saisonNull(saison))/TAG_MS);}
const datumVon=(tag,saison)=>new Date(saisonNull(saison==null?S.season:saison)+tag*TAG_MS);
const wochentag=tag=>datumVon(tag).getUTCDay();
const datumKurz=tag=>{const d=datumVon(tag);return`${WT[d.getUTCDay()]} ${d.getUTCDate()}.${d.getUTCMonth()+1}.`;};
const datumMittel=tag=>{const d=datumVon(tag);return`${WT[d.getUTCDay()]} ${d.getUTCDate()}. ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;};
const datumLang=tag=>{const d=datumVon(tag);return`${WTL[d.getUTCDay()]}, ${d.getUTCDate()}. ${MONL[d.getUTCMonth()]} ${d.getUTCFullYear()}`;};
const uhr=min=>`${String(Math.floor(min/60)).padStart(2,'0')}:${String(min%60).padStart(2,'0')}`;
const minute=hhmm=>{const[h,m]=hhmm.split(':').map(Number);return h*60+m;};
const tageDerSaison=()=>Math.round((saisonNull(S.season+1)-saisonNull(S.season))/TAG_MS);
const ligaName=lg=>lg===1?'1. Bundesliga':lg===2?'2. Bundesliga':lg===3?'3. Liga':'Regionalliga';
const aktiv=t=>t.lg<=3;

// Verschiebung der Rahmentermine 2026/27 in eine spätere Saison: volle Wochen, gleiche Wochentage
const schiebung=saison=>Math.round((saisonNull(saison)-saisonNull(TERMINE_2026.saison))/(7*TAG_MS))*7;
// Rahmenplan einer Saison (ohne Ligaspiele): Start, Trainingsauftakt, Ende, Pokal, Relegationen, Pausen
function planFuer(saison){const T=TERMINE_2026,sh=schiebung(saison),t=iso=>tagAusDatum(iso,saison,sh),tz=([iso,z])=>[t(iso),minute(z)];
  return{start:0,trainingsauftakt:t(T.trainingsauftakt),ende:t(T.ende),pokal:T.pokal.map(tz),rel:T.relegation.map(tz),rel2:T.relegation2.map(tz),
    pausen:T.pausen.map(p=>({von:t(p.von),bis:t(p.bis),name:p.name,ligen:p.ligen})),zeit:{}};}
// Grundtag eines Spieltags im Rahmenplan 2026/27: Samstag des Wochenendes oder Dienstag unter der Woche
function grundtag(spiele){const tage=spiele.map(x=>tagAusDatum(x[2],TERMINE_2026.saison)),d0=Math.min(...tage),wd=datumVon(d0,TERMINE_2026.saison).getUTCDay();
  if(wd===2||wd===3)return{tag:wd===2?d0:d0-1,mitte:true};return{tag:wd===5?d0+1:wd===0?d0-1:wd===1?d0-2:d0,mitte:false};}
// Verteilt die Spiele eines Spieltags nach dem Raster aus regeln.js: attraktive Paarungen auf die besten Anstoßzeiten
function rasterZeiten(lg,paare,basis,mitte){const A=RK.anstoss[lg],slots=[];
  (mitte?A.mitte:A.wochenende).forEach(([wt,z,n])=>{for(let k=0;k<n;k++)slots.push([wt,z]);});
  const off={Fr:-1,Sa:0,So:1,Di:0,Mi:1},ord=paare.map((p,i)=>[i,S.teams[p[0]].rep+S.teams[p[1]].rep+R()*RK.attraktivZufall]).sort((a,b)=>b[1]-a[1]),z=Array(paare.length);
  ord.forEach(([i],k)=>{const s=slots[Math.min(k,slots.length-1)];z[i]=[basis+off[s[0]],minute(s[1])];});return z;}
// Paarungen und Termine aller Ligaspiele einer Saison. 2026/27: offizieller Spielplan. Später: neu ausgelost, Termine im Raster.
function spielplanFuer(saison){return mitStrom(strom('plan',saison),()=>spielplanLauf(saison));}
function spielplanLauf(saison){const fx={},zeit={},sh=schiebung(saison),ix={};S.teams.forEach(t=>ix[t.sh]=t.id);
  LIGEN.forEach(lg=>{const P=SPIELPLAN_2026[lg],offen=new Set(P.offen),n=P.spieltage.length;
    if(saison===TERMINE_2026.saison&&P.spieltage.every(md=>md.every(([h,a])=>S.teams[ix[h]]&&S.teams[ix[h]].lg===lg&&S.teams[ix[a]].lg===lg))){
      fx[lg]=P.spieltage.map(md=>md.map(([h,a])=>[ix[h],ix[a]]));
      zeit[lg]=P.spieltage.map((md,k)=>{if(!offen.has(k+1))return md.map(x=>[tagAusDatum(x[2],saison),minute(x[3])]);const g=grundtag(md);return rasterZeiten(lg,fx[lg][k],g.tag,g.mitte);});}
    else{fx[lg]=roundRobin(lgIds(lg));
      zeit[lg]=P.spieltage.map((md,k)=>{const g=grundtag(md);
        if(k===n-1){const d=tagAusDatum(md[0][2],TERMINE_2026.saison,sh)+Math.round((saisonNull(TERMINE_2026.saison)-saisonNull(saison))/TAG_MS);return fx[lg][k].map(()=>[d,minute(RK.anstoss[lg].letzter)]);}
        return rasterZeiten(lg,fx[lg][k],g.tag+sh+Math.round((saisonNull(TERMINE_2026.saison)-saisonNull(saison))/TAG_MS),g.mitte);});}});
  planReparieren(fx,zeit);return{fx,zeit};}
// 72 Stunden (K13 §3.5): Spielt ein Verein weniger als drei Tage nach seinem letzten Ligaspiel, rückt die Partie im Fenster nach hinten
// (Dienstag → Mittwoch, Freitag → Samstag), sonst das vorige Spiel nach vorn (Sonntag → Samstag). Der letzte Spieltag bleibt zeitgleich.
function planReparieren(fx,zeit){const M=RWB.spielplan.mindestTage,tagVon=(lg,k,id)=>{const j=fx[lg][k].findIndex(q=>q[0]===id||q[1]===id);return j<0?null:zeit[lg][k][j];};
  for(let pass=0;pass<4;pass++){let n=0;
    LIGEN.forEach(lg=>{const F=fx[lg],Z=zeit[lg],letzter=F.length-1;if(!F)return;
      F.forEach((md,k)=>{if(k===0)return;md.forEach(([h,a],i)=>{const z=Z[k][i],vor=[h,a].map(id=>tagVon(lg,k-1,id)),p=Math.max(...vor.map(x=>x?x[0]:-99));if(z[0]-p>=M)return;
        const nach=k<letzter?Math.min(...[h,a].map(id=>{const x=tagVon(lg,k+1,id);return x?x[0]:1e9;})):1e9,ziel=p+M;
        if(k<letzter&&ziel-z[0]<=2&&ziel<=nach-M){z[0]=ziel;n++;return;}
        vor.forEach(x=>{if(x&&z[0]-x[0]<M&&x[0]-(z[0]-M)<=2&&k-1<letzter){x[0]=z[0]-M;n++;}});});});});
    if(!n)break;}}

// Welche Ligaspiele finden an welchem Tag statt? (Index, nicht gespeichert)
let TAGINDEX={plan:null,map:null};
function spieleAm(d){if(TAGINDEX.plan!==S.plan){const m=new Map();LIGEN.forEach(lg=>(S.plan.zeit[lg]||[]).forEach((md,k)=>md.forEach(([t,mi],i)=>{if(!m.has(t))m.set(t,[]);m.get(t).push({lg,md:k,i,min:mi});})));TAGINDEX={plan:S.plan,map:m};}return TAGINDEX.map.get(d)||[];}
// Termine eines Tages: Ligaspiele (je Liga und Spieltag), Pokalrunde, Relegationen, Saisonende
function termineAm(d){const P=S.plan,L=[],g={};
  spieleAm(d).forEach(x=>{const k=x.lg+':'+x.md;if(!g[k]){g[k]={art:'liga',lg:x.lg,md:x.md,idx:[],tag:d};L.push(g[k]);}g[k].idx.push(x.i);});
  const r=P.pokal.findIndex(x=>x[0]===d);if(r>=0)L.push({art:'pokal',r,tag:d,min:P.pokal[r][1]});
  [['rel',P.rel],['rel2',P.rel2]].forEach(([art,a])=>{const k=a.findIndex(x=>x[0]===d);if(k>=0)L.push({art,leg:k,tag:d,min:a[k][1]});});
  const sc=supercupAm(d);if(sc)L.push({art:'supercup',tag:d,min:sc.min});
  if(d===P.ende)L.push({art:'ende',tag:d});return L;}
// Relegationen: rel = 16. der 1. Liga gegen 3. der 2. Liga, rel2 = 16. der 2. Liga gegen den drittbesten Aufstiegsberechtigten der 3. Liga
const aufstiegsReihe3=()=>table(3).filter(r=>S.teams[r.id].zweite<0).map(r=>r.id);
const relTeams=art=>art==='rel'?[table(1)[15].id,table(2)[2].id]:[table(2)[15].id,aufstiegsReihe3()[2]];
const ligaFertig=lg=>S.res[lg].length>=S.fx[lg].reduce((a,md)=>a+md.length,0);
const relBereit=art=>art==='rel'?ligaFertig(1)&&ligaFertig(2):ligaFertig(2)&&ligaFertig(3);
// Spielt dein Verein an Tag d? Liefert den Termin oder null.
function meinSpiel(d){const t=myT();
  for(const e of termineAm(d)){
    if(e.art==='liga'&&e.lg===t.lg){const i=e.idx.find(j=>{const f=S.fx[e.lg][e.md][j];return f[0]===S.my||f[1]===S.my;});if(i!=null)return{...e,i,min:S.plan.zeit[e.lg][e.md][i][1]};}
    if(e.art==='pokal'&&S.cup.hist.length===e.r&&S.cup.alive.includes(S.my))return e;
    if((e.art==='rel'||e.art==='rel2')&&relBereit(e.art)&&relTeams(e.art).includes(S.my))return e;
    if(e.art==='supercup'&&[S.supercup.h,S.supercup.a].includes(S.my))return e;}
  return null;}
// Heim- und Gastverein deines Spiels (Pokal: wird erst beim Anpfiff gelost)
function paarung(e){if(e.art==='liga')return S.fx[e.lg][e.md][e.i];if(e.art==='supercup')return[S.supercup.h,S.supercup.a];
  if(e.art==='pokal'){const l=S.cup.los&&S.cup.los.r===e.r?S.cup.los.paare.find(x=>x.includes(S.my)):null;return l||null;}if(e.art==='rel'||e.art==='rel2'){const[a,b]=relTeams(e.art);return e.leg===0?[b,a]:[a,b];}return null;}
function spielName(e){return e.art==='supercup'?'Supercup':e.art==='liga'?`${e.md+1}. Spieltag`:e.art==='pokal'?`DFB-Pokal, ${POKAL_RUNDEN[e.r]}`:e.art==='rel'||e.art==='rel2'?`Relegation${e.art==='rel2'?' 2./3. Liga':''}, ${e.leg?'Rückspiel':'Hinspiel'}`:'Saisonende';}
const spielZeit=e=>e.min!=null?`${WT[wochentag(e.tag)]} ${uhr(e.min)}`:datumKurz(e.tag);
function naechstesSpiel(ab){for(let d=ab;d<=S.plan.ende;d++){const e=meinSpiel(d);if(e)return e;}return null;}
// Deine Ligaspiele der Saison mit Tag (auch vergangene)
function meineLigaspiele(){const lg=myT().lg;return(S.fx[lg]||[]).map((md,k)=>{const i=md.findIndex(f=>f[0]===S.my||f[1]===S.my);return i<0?null:{art:'liga',lg,md:k,i,tag:S.plan.zeit[lg][k][i][0],min:S.plan.zeit[lg][k][i][1]};}).filter(Boolean);}
const pauseAm=(d,lg)=>S.plan.pausen.find(p=>d>=p.von&&d<=p.bis&&p.ligen.includes(lg));
const imUrlaub=()=>S.phase==='sommer'||!!sommerStatus(myT())||S.tag<auftaktTag(myT());
function ersterPflichttermin(){const l=meineLigaspiele();let d=l.length?l[0].tag:S.plan.ende;if(S.cup.alive.includes(S.my)&&!S.cup.hist.length)d=Math.min(d,S.plan.pokal[0][0]);return d;}
function tagesText(d){if(S.phase==='sommer')return'Sommerpause – die Mannschaft ist im Urlaub';const e=meinSpiel(d);if(e)return spielName(e);
  if(d<auftaktTag(myT()))return`Sommerurlaub bis ${datumKurz(auftaktTag(myT())-1)}`;if(d===auftaktTag(myT()))return'Trainingsauftakt – die Mannschaft ist zurück';
  const p=pauseAm(d,myT().lg);if(p)return p.name+' – spielfrei';if(d<ersterPflichttermin())return'Saisonvorbereitung';const l=meineLigaspiele();if(l.length&&d>l[l.length-1].tag)return'Saisonende naht';return'spielfrei';}
const meineSpieltage=()=>meineLigaspiele().filter(e=>e.tag<S.tag||(e.tag===S.tag&&S.gespielt===e.tag)).length;
const heuteMeinSpiel=()=>S.phase==='play'&&S.gespielt!==S.tag&&!!meinSpiel(S.tag);

// Halt-Regeln: Hier hält „Tag beenden“ an.
function haltGrund(d){if(S.phase==='end')return'Saisonende';if(S.fired)return'Entlassen';if(S.phase==='play'&&meinSpiel(d))return'Spiel';if(pokalLosHeute(d))return'Auslosung';if(S.offers.some(o=>o.bis===d)||meineVerfahren().some(v=>v.stand==='antrag'&&v.frist===d))return'Frist';if((S.gw||[]).some(g=>g.tag===d&&g.s===S.season))return'Gesprächswunsch';if(S.phase==='play'&&d===auftaktTag(myT()))return'Trainingsauftakt';return'';}
function naechsterHalt(){const ende=S.phase==='sommer'?tageDerSaison():S.plan.ende;
  for(let d=S.tag+1;d<=S.tag+RK.maxSprung;d++){if(d>=ende||haltGrund(d)||(S.phase==='play'&&d===auftaktTag(myT())))return Math.min(d,ende);}return S.tag+RK.maxSprung;}

// Tageswechsel
function tagBeginn(d){taeglich(d);if(wochentag(d)===RK.wochenTag)woechentlich(d);if(S.phase==='play'&&d>=S.plan.ende)seasonEnd();}
function tagEnde(d){if(S.phase==='play'&&S.gespielt!==d)tagesSpiele(d);}
// Beendet den heutigen Tag und springt zum nächsten Halt, höchstens RK.maxSprung Tage weit. Am 1. Juli beginnt die neue Saison.
function weiter(){let n=0;tagEnde(S.tag);
  while(S.phase!=='end'&&!S.fired){S.tag++;n++;S.gespielt=-1;
    if(S.tag>=tageDerSaison()){newSeason();break;}
    tagBeginn(S.tag);if(haltGrund(S.tag)||(n>=RK.maxSprung&&!sommerSprung()))break;tagEnde(S.tag);}
  save();return n;}
// Nach der Saisonbilanz: weiter in die Sommerpause (Urlaub bis zum Trainingsauftakt der neuen Saison)
function sommerpause(){if(S.phase==='end'&&!S.fired){S.phase='sommer';save();}}

// Erinnerungen vor „Tag beenden“: nur, wenn wirklich etwas offen ist. Jede Art ist im Menü abschaltbar.
const erinnerungAn=k=>!(S.einst&&S.einst.aus&&S.einst.aus[k]);
function erinnerungen(){const E=[],d=S.tag,m=heuteMeinSpiel()?meinSpiel(d):null;
  if(erinnerungAn('frist'))S.offers.filter(o=>o.bis===d).forEach(o=>{const p=PIX.get(o.pid);if(p)E.push({art:'frist',text:`Das Angebot von ${esc(S.teams[o.tid].name)} für ${esc(p.n)} (${fmt(o.amt)}) gilt nur noch heute.`,tab:'buero',knopf:'Zum Angebot'});});
  if(erinnerungAn('frist'))meineVerfahren().filter(v=>v.stand==='antrag'&&v.frist===d).forEach(v=>{const p=PIX.get(v.pid);E.push({art:'frist',text:`Sportgericht: Die Frist für ${esc(p.n)} (Antrag ${v.antrag} Spiel${v.antrag===1?'':'e'}) endet heute. Ohne Antwort gilt der Antrag als angenommen.`,tab:'buero',knopf:'Zum Sportgericht'});});
  if(m&&erinnerungAn('aufstellung')){const aus=(S.lineup||[]).map(id=>PIX.get(id)).filter(p=>p&&p.team===S.my&&!avail(p));
    if(aus.length)E.push({art:'aufstellung',text:`In deiner Startelf fehlen ${aus.map(p=>esc(p.n)).join(', ')}. Ohne Änderung stellt das Spiel automatisch Ersatz auf.`,tab:'aufst',knopf:'Zur Aufstellung'});}
  if(m&&erinnerungAn('versprechen'))versprechenKippen().forEach(v=>{const p=PIX.get(v.pid);if(p&&!myXI().includes(p.id))E.push({art:'versprechen',text:`Du hast ${esc(p.n)} Einsatzzeit versprochen (${versprechenText(v)}), aber er steht nicht in der Startelf. Das Versprechen droht zu kippen.`,tab:'aufst',knopf:'Zur Aufstellung'});});
  if(m&&erinnerungAn('sponsor')&&S.sponsOffers)E.push({art:'sponsor',text:'Du hast noch keinen Trikotsponsor gewählt. Sonst nimmt der Vorstand das erste Angebot.',tab:'buero',knopf:'Zu den Angeboten'});
  if(erinnerungAn('vertrag')&&tageDerSaison()-d<=RK.erinnerungVertragTage){const xi=new Set(myXI()),e=squad(S.my).filter(p=>p.ct<=1&&xi.has(p.id));
    if(e.length)E.push({art:'vertrag',text:`Die Verträge von ${e.map(p=>esc(p.n)).join(', ')} enden am 30. Juni. Danach sind sie weg.`,tab:'kader',knopf:'Zum Kader'});}
  return E;}
