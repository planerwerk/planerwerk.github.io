// Vorstand (Konzept K28, U12a): Präsident, Vertrauen mit Bausteinen und Trägheit, Ultimatum statt sofortiger Entlassung, Ruf als Trainer.
// Zahlen in daten/regeln.js unter REGELN.vorstand (Kurzform RV). Die Computer-Vereine nutzen dieselbe Formel vereinfacht (js/computer.js, kiVorstandWoche, K31 §5.10).
// ACHTUNG: U12a entstand ohne Testlauf (K28 §5.6), tests/vorstand.js ist noch nie gelaufen.
// Im Spielstand neu: S.ult = {tid, s, ab (eigene Ligaspiele bei Beginn), n (1 oder 2 = letztes)} während eines Ultimatums, S.ruf (Ruf als Trainer, fehlt = Startwert).
// Seit U12b (K28 §5.7): S.ziele (Nebenziele der Saison), S.ruecktritt (1 nach einem Rücktritt bis zum nächsten Job), Bereich ruecktritt.

// ---------- Präsident (K28 §3) ----------
// Geduld, Ehrgeiz, Sparsamkeit (je 1–20), fest aus der Vereinsnummer. Kein Zufallsstrom, alte Spielstände brauchen nichts. Bisher wirkt nur die Geduld.
function praesident(t){const P=RV.praesident,w=k=>P.min+(Math.imul(t.id+1,k)>>>0)%(P.max-P.min+1);return{geduld:w(2654435761),ehrgeiz:w(2246822519),sparsam:w(3266489917)};}
function praesidentText(t){const g=praesident(t).geduld,F=RV.ruf;return g<=F.ungeduldig?'ungeduldig':g>=F.geduldig?'geduldig':'mittel geduldig';}
// Chance auf Entlassung nach einem gescheiterten ersten Ultimatum (K28 §5.3): basis + jeGeduld × Geduld. E: Werte (RV.ultimatum.entlassung oder RCV.vorstand.entlassung)
function entlassChance(t,E){return clamp(E.basis+E.jeGeduld*praesident(t).geduld,0,1);}

// ---------- Vertrauen (K28 §5.1) ----------
// Ziel des Vertrauens: basis + Sport (Platz gegen Soll-Platz) + Serie (Punkte je Spiel der letzten Ligaspiele) + extra (Finanzen, Umfeld). r: Zeile aus table(), pos: Tabellenplatz.
// V: Werte (RV.vertrauen für dich, RCV.vorstand für Computer-Vereine)
function vertrauenZiel(V,r,pos,soll,extra){const l=r.last.slice(-V.serieSpiele),sport=clamp((soll-pos)*V.jePlatz,V.sport[0],V.sport[1]),
    serie=l.length?clamp((l.reduce((a,b)=>a+b,0)/l.length-V.serieMitte)*V.serieFaktor,V.serie[0],V.serie[1]):0;
  return clamp(V.basis+sport+serie+(extra||0),0,100);}
// Woche (montags im Strom „woche“): Meldung bei Konto im Minus wie bisher (gleich viele Würfe), dann ab dem fünften eigenen Ligaspiel der träge Anteil:
// Vertrauen um traegheit Richtung Ziel. Finanzen: Konto im Minus, Kredit. Umfeld: Glaubwürdigkeit (K15) unter glaubUnter.
function vorstandWoche(){const t=myT(),V=RV.vertrauen;
  if(t.cash<0&&R()<RV.kontoMinusMeldung)news('Der Vorstand ist alarmiert: Das Vereinskonto ist im Minus!','bad');
  if(S.phase!=='play'||S.fired||meineSpieltage()<RV.platzAbSpieltag)return;
  const T=table(t.lg),i=T.findIndex(r=>r.id===S.my);if(i<0)return;
  const finanzen=Math.max(V.finanzMin,(t.cash<0?V.kontoMinus:0)+(S.loan>0?V.kredit:0)),g=glaub(t),umfeld=g<V.glaubUnter?V.umfeldMin*(V.glaubUnter-g)/V.glaubUnter:0;
  S.trust=clamp(S.trust+(vertrauenZiel(V,T[i],i+1,S.target,finanzen+umfeld+zieleBaustein()+fansVorstand(t))-S.trust)*V.traegheit,0,100);}

// ---------- Ultimatum und Entlassung (K28 §4 Nr. 4, §5.3) ----------
// Nach jedem Spieltag und jeden Montag. Grenze und Schonfrist aus der Schwierigkeit (K02). Unter der Grenze nach der Schonfrist: Ultimatum über RV.ultimatum.spiele Ligaspiele.
// Danach wieder an der Grenze: aufgehoben. Sonst Entlassung nach der Geduld des Präsidenten (eigener Strom), sonst ein letztes Ultimatum. Nach dem letzten: Entlassung.
function vorstandPruefen(){const St=stufe(),U=RV.ultimatum;if(S.fired||S.phase!=='play')return;
  if(S.ult&&(S.ult.tid!==S.my||S.ult.s!==S.season))S.ult=null; // Verein oder Saison gewechselt
  const sp=meineSpieltage();
  if(!S.ult){if(S.trust<St.entlassenUnter&&sp>St.schonfrist){S.ult={tid:S.my,s:S.season,ab:sp,n:1};
      news(`Ultimatum: Der Vorstand gibt dir noch ${U.spiele} Ligaspiele. Liegt sein Vertrauen danach nicht wieder bei mindestens ${St.entlassenUnter}, droht die Entlassung.`,'bad');}return;}
  if(sp-S.ult.ab<U.spiele)return;
  if(S.trust>=St.entlassenUnter){S.ult=null;news('Der Vorstand ist vorerst zufrieden: Das Ultimatum ist aufgehoben.','good');return;}
  if(S.ult.n<2&&mitStrom(strom('ultimatum',S.season,S.tag),()=>R())>=entlassChance(myT(),U.entlassung)){S.ult={tid:S.my,s:S.season,ab:sp,n:2};
    news(`Letztes Ultimatum: Der Präsident hält noch einmal zu dir. Nach ${U.spiele} weiteren Ligaspielen entscheidet der Vorstand endgültig.`,'bad');return;}
  entlassen(`Der Vorstand hat genug: ${myT().name} trennt sich von dir.`);}
// Entlassung (während der Saison und zum Saisonende): Ruf sinkt, dann Jobangebote nach dem neuen Ruf
function entlassen(text){if(S.fired)return;S.fired=1;S.ult=null;rufAendern(RV.ruf.entlassung);if(text)news(text,'bad');mkJobs();}
// Anzeige im Büro: laufendes Ultimatum (oder leer)
function ultimatumText(){const u=S.ult;if(!u||u.tid!==S.my||u.s!==S.season||S.phase!=='play')return'';const rest=Math.max(0,RV.ultimatum.spiele-(meineSpieltage()-u.ab));
  return`<p class="neg"><b>${u.n>1?'Letztes Ultimatum':'Ultimatum'}:</b> noch ${rest} Ligaspiel${rest===1?'':'e'}, dann muss das Vertrauen wieder bei mindestens ${stufe().entlassenUnter} liegen.</p>`;}

// ---------- Nebenziele (K28 §3.1, §5.7, U12b) ----------
// S.ziele = {s Saison, tid Verein, l: [{k pokal|jugend|finanzen, min}]}. Gesetzt mit dem Saisonziel (setTarget), eigener Strom je Saison und Verein: mehrfaches Setzen gibt dasselbe.
// Möglich: Pokal (nur wenn du noch drin bist und die Zielrunde nicht schon erreicht hast), Jugend (nur mit Spielern bis jugendBis), Finanzen (immer).
// Anzahl nach dem Ehrgeiz des Präsidenten, das Nebenziel zum Profil deines Vereins zuerst, den Rest lost der Vorstand.
function nebenzieleSetzen(){const N=RV.nebenziele,t=myT(),moegl=[],runde=N.pokalRunde[t.lg]||1;
  if(S.cup&&S.cup.alive.includes(S.my)&&S.cup.hist.length<runde)moegl.push('pokal');
  if(squad(S.my).some(p=>p.age<=N.jugendBis))moegl.push('jugend');
  moegl.push('finanzen');const eu=euZielMoeglich();if(eu)moegl.push('europa'); // Europapokal (K37, U19c)
  const n=praesident(t).ehrgeiz>=N.ehrgeizigAb?N.anzahl[1]:N.anzahl[0],zuerst=vereinsProfile(t).map(k=>N.profil[k]).filter(k=>k&&moegl.includes(k));
  const l=mitStrom(strom('nebenziele',S.season,S.my),()=>[...new Set([...zuerst,...shuffle(moegl.filter(k=>!zuerst.includes(k)))])].slice(0,n));
  S.ziele={s:S.season,tid:S.my,l:l.map(k=>k==='europa'?{k,min:eu.min,wb:eu.wb}:{k,min:k==='pokal'?runde:k==='jugend'?N.jugendEinsaetze:0})};}
// Nebenziele der laufenden Saison bei deinem Verein (nach einem Jobwechsel ohne neues setTarget: keine)
const meineZiele=()=>S.ziele&&S.ziele.s===S.season&&S.ziele.tid===S.my?S.ziele.l:[];
const jugendEinsaetze=()=>squad(S.my).filter(p=>p.age<=RV.nebenziele.jugendBis).reduce((a,p)=>a+(p.apps||0),0);
// Stand: 'erfuellt', 'verfehlt', 'gefaehrdet' oder 'offen'. ende: Saisonende, dann gibt es nur erfüllt oder verfehlt.
// Pokal: Runde r erreicht, wenn du in Runde r gespielt hast oder nach r gespielten Runden noch dabei bist.
function nebenzielStand(z,ende){
  if(z.k==='pokal'){const c=S.cup||{alive:[],hist:[]},dabei=r=>(c.hist[r]||[]).some(m=>m[0]===S.my||m[1]===S.my)||(c.alive.includes(S.my)&&c.hist.length>=r);
    return dabei(z.min)?'erfuellt':(ende||!c.alive.includes(S.my))?'verfehlt':'offen';}
  if(z.k==='jugend')return jugendEinsaetze()>=z.min?'erfuellt':ende?'verfehlt':'offen';
  if(z.k==='europa')return euZielStand(z,ende);
  if(z.k==='finanzen'){const s=Object.values(S.fin||{}).reduce((a,b)=>a+b,0);return ende?(s>=0?'erfuellt':'verfehlt'):(s<0?'gefaehrdet':'offen');}
  return'offen';}
// Baustein „Ziele“ im Vertrauen (montags)
function zieleBaustein(){const N=RV.nebenziele;let s=0;meineZiele().forEach(z=>{const st=nebenzielStand(z,false);s+=st==='erfuellt'?N.erfuellt:st==='verfehlt'?N.verfehlt:st==='gefaehrdet'?N.gefaehrdet:0;});
  return clamp(s,N.baustein[0],N.baustein[1]);}
// Saisonende (seasonEndLauf, vor der Prüfung auf Entlassung): Vertrauen je Nebenziel, Meldung
function nebenzieleSaison(){const N=RV.nebenziele,l=meineZiele();if(!l.length)return;let alle=true;
  const txt=l.map(z=>{const ok=nebenzielStand(z,true)==='erfuellt';if(!ok)alle=false;S.trust=clamp(S.trust+(ok?N.saisonErfuellt:N.saisonVerfehlt),0,100);return`${nebenzielName(z)}: ${ok?'erfüllt':'verfehlt'}`;});
  news(`Nebenziele des Vorstands: ${txt.join(' · ')}.`,alle?'good':'bad');}
function nebenzielName(z){return z.k==='europa'?`Europapokal: mindestens ${EU_RUNDE[z.min]} in der ${euName(z.wb)}`:z.k==='pokal'?`Pokal: mindestens ${POKAL_RUNDEN[z.min]}`:z.k==='jugend'?`Jugend: Spieler bis ${RV.nebenziele.jugendBis} zusammen ${z.min} Einsätze`:'Finanzen: kein Verlust in dieser Saison';}
// Anzeige im Büro
function nebenzieleText(){const l=meineZiele();if(!l.length)return'';const W={erfuellt:'erfüllt',verfehlt:'verfehlt',gefaehrdet:'gefährdet',offen:'offen'};
  return`<p class="dim">Nebenziele: ${l.map(z=>`${esc(nebenzielName(z))}${z.k==='jugend'?` (bisher ${jugendEinsaetze()})`:''}: ${W[nebenzielStand(z,false)]}`).join(' · ')}</p>`;}

// ---------- Rücktritt (K28 §5.3, §5.7, U12b, Bereich ruecktritt) ----------
function ruecktrittFragen(){if(!darf('ruecktritt'))return;if(S.fired||S.phase!=='play'){toast('Zurücktreten geht nur während der Saison.');return;}
  ov(`<h2>Zurücktreten?</h2><p>Du verlässt ${esc(myT().name)} sofort. Dein Ruf als Trainer sinkt um ${-RV.ruf.ruecktritt} (bei einer Entlassung wären es ${-RV.ruf.entlassung}). Danach bekommst du Jobangebote nach deinem Ruf.</p>
    <div class="row"><button class="go" onclick="ruecktritt()">Ja, zurücktreten</button><button onclick="closeOv()">Abbrechen</button></div>`);}
function ruecktritt(){if(!darf('ruecktritt')||S.fired||S.phase!=='play')return;S.fired=1;S.ruecktritt=1;S.ult=null;rufAendern(RV.ruf.ruecktritt);
  news(`Du trittst bei ${myT().name} zurück.`,'bad');mkJobs();closeOv();save();render();showFired();}

// ---------- Ruf als Trainer (K28 §5.4) ----------
const ruf=()=>S.ruf==null?RV.ruf.start:S.ruf;
function rufAendern(d){S.ruf=Math.round(clamp(ruf()+d,0,100)*10)/10;}
// Saisonende (seasonEndLauf, vor einer Entlassung): erst vergessen, dann Ziel übertroffen oder deutlich verfehlt, Titel, Auf- und Abstieg. sm: Saisonbilanz.
function rufSaison(sm){const F=RV.ruf,me=S.my;let d=(F.start-ruf())*F.vergessen;
  if(sm.pos<sm.target)d+=(sm.target-sm.pos)*F.jePlatzUeber;else if(sm.pos>sm.target+RV.saisonWeitAb)d+=F.verfehlt;
  if(sm.champ===me)d+=F.meister;if(sm.cup===me)d+=F.pokal;
  if(sm.up.includes(me)||sm.up3.includes(me)||(sm.lg===2&&sm.rw===me)||(sm.lg===3&&sm.rw2===me))d+=F.aufstieg;
  if(sm.down.includes(me)||sm.down2.includes(me)||sm.down3.includes(me)||(sm.lg===1&&sm.rel[0]===me&&sm.rw!==me)||(sm.lg===2&&sm.rel2[0]===me&&sm.rw2!==me))d+=F.abstieg;
  rufAendern(d);S.ult=null;}
