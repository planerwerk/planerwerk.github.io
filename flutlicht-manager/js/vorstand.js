// Vorstand (Konzept K28, U12a): Präsident, Vertrauen mit Bausteinen und Trägheit, Ultimatum statt sofortiger Entlassung, Ruf als Trainer.
// Zahlen in daten/regeln.js unter REGELN.vorstand (Kurzform RV). Die Computer-Vereine nutzen dieselbe Formel vereinfacht (js/computer.js, kiVorstandWoche, K31 §5.10).
// ACHTUNG: U12a entstand ohne Testlauf (K28 §5.6), tests/vorstand.js ist noch nie gelaufen.
// Im Spielstand neu: S.ult = {tid, s, ab (eigene Ligaspiele bei Beginn), n (1 oder 2 = letztes)} während eines Ultimatums, S.ruf (Ruf als Trainer, fehlt = Startwert).

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
  S.trust=clamp(S.trust+(vertrauenZiel(V,T[i],i+1,S.target,finanzen+umfeld)-S.trust)*V.traegheit,0,100);}

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
