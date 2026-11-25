// Vorstand (Konzept K28, U12a): Präsident, Vertrauen mit Bausteinen und Trägheit, Ultimatum statt sofortiger Entlassung, Ruf als Trainer.
// Zahlen in daten/regeln.js unter REGELN.vorstand (Kurzform RV). Die Computer-Vereine nutzen dieselbe Formel vereinfacht (js/computer.js, kiVorstandWoche, K31 §5.10).
// ACHTUNG: U12a entstand ohne Testlauf (K28 §5.6), tests/vorstand.js ist noch nie gelaufen.
// Im Spielstand neu: S.ult = {tid, s, ab (eigene Ligaspiele bei Beginn), n (1 oder 2 = letztes)} während eines Ultimatums, S.ruf (Ruf als Trainer, fehlt = Startwert).
// Seit U12b (K28 §5.7): S.ziele (Nebenziele der Saison), S.ruecktritt (1 nach einem Rücktritt bis zum nächsten Job), Bereich ruecktritt.

// ---------- Präsident (K28 §3) ----------
// Geduld, Ehrgeiz, Sparsamkeit (je 1–20), fest aus der Vereinsnummer. Kein Zufallsstrom, alte Spielstände brauchen nichts. Bisher wirkt nur die Geduld.
function praesident(t){const P=RV.praesident,b=t.id+1+(t.prw||0)*P.versatz,w=k=>P.min+(Math.imul(b,k)>>>0)%(P.max-P.min+1);return{geduld:w(2654435761),ehrgeiz:w(2246822519),sparsam:w(3266489917)};} /* prw: Zahl der Präsidentenwechsel (U12i), ohne Wechsel wie vorher */
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
  const finanzen=Math.max(V.finanzMin,(t.cash<0?V.kontoMinus:0)+(S.loan>0?V.kredit:0)+(rahmenAnteil(t)>1?V.gehaltUeber:0)),g=glaub(t),umfeld=g<V.glaubUnter?V.umfeldMin*(V.glaubUnter-g)/V.glaubUnter:0;
  S.trust=clamp(S.trust+(vertrauenZiel(V,T[i],i+1,S.target,finanzen+umfeld+zieleBaustein()+fansVorstand(t))-S.trust)*V.traegheit,0,100);}

// ---------- Ultimatum und Entlassung (K28 §4 Nr. 4, §5.3) ----------
// Nach jedem Spieltag und jeden Montag. Grenze und Schonfrist aus der Schwierigkeit (K02). Unter der Grenze nach der Schonfrist: Ultimatum über RV.ultimatum.spiele Ligaspiele.
// Danach wieder an der Grenze: aufgehoben. Sonst Entlassung nach der Geduld des Präsidenten (eigener Strom), sonst ein letztes Ultimatum. Nach dem letzten: Entlassung.
function vorstandPruefen(){const St=stufe(),U=RV.ultimatum;if(S.fired||S.phase!=='play')return;
  {const H=S.trustHalt;if(H&&H.tid===S.my&&H.s===S.season&&H.bis>=absTag(S.tag))S.trust=Math.max(S.trust,H.min);} // Rückendeckung (Karte, K28 §8, K30e): einen Monat nicht unter dem Wert des Tages
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
function entlassen(text){if(S.fired)return;trainerVertragEnde(true);S.fired=1;S.ult=null;rufAendern(RV.ruf.entlassung);if(text)news(text,'bad');mkJobs();} /* trainerVertragEnde: Gehalt bis heute und Abfindung in die Karriere (U12g) */
// Anzeige im Büro: laufendes Ultimatum (oder leer)
function ultimatumText(){const u=S.ult;if(!u||u.tid!==S.my||u.s!==S.season||S.phase!=='play')return'';const rest=Math.max(0,RV.ultimatum.spiele-(meineSpieltage()-u.ab));
  return`<p class="neg"><b>${u.n>1?'Letztes Ultimatum':'Ultimatum'}:</b> noch ${rest} Ligaspiel${rest===1?'':'e'}, dann muss das Vertrauen wieder bei mindestens ${stufe().entlassenUnter} liegen.</p>`;}

// ---------- Nebenziele (K28 §3.1, §5.7, U12b) ----------
// S.ziele = {s Saison, tid Verein, l: [{k pokal|jugend|finanzen, min}]}. Gesetzt mit dem Saisonziel (setTarget), eigener Strom je Saison und Verein: mehrfaches Setzen gibt dasselbe.
// Möglich: Pokal (nur wenn du noch drin bist und die Zielrunde nicht schon erreicht hast), Jugend (nur mit Spielern bis jugendBis), Finanzen (immer).
// Anzahl nach dem Ehrgeiz des Präsidenten, das Nebenziel zum Profil deines Vereins zuerst, den Rest lost der Vorstand.
// Seit U12o (K28 §3.1, 25.11., popolupo, vorläufig): Kader (Gehälter am Saisonende im Gehaltsrahmen, K23) und Zuschauer (Heimschnitt mindestens zuschauerHalten
// des Schnitts der Vorsaison, nur nach einer ganzen Saison bei diesem Verein in derselben Liga, S.hist).
const zuschauerVorsaison=t=>{const h=(S.hist||[]).find(x=>x.s===S.season-1&&x.tid===S.my&&x.lg===t.lg);return h&&h.zus>0&&(h.zusN||0)>=RV.nebenziele.zuschauerHeimAb?h.zus:0;}; /* Prüfung FR1: nur nach genug Heimspielen (zusN), nicht nach einer Teilsaison */
// Seit U12p getrennt: welche Nebenziele möglich sind (in fester Reihenfolge, die Auslosung bleibt gleich) und wie eines aussieht.
function nebenzieleMoeglich(){const N=RV.nebenziele,t=myT(),moegl=[],runde=N.pokalRunde[t.lg]||1,zv=zuschauerVorsaison(t);
  if(S.cup&&S.cup.alive.includes(S.my)&&S.cup.hist.length<runde)moegl.push('pokal');
  if(squad(S.my).some(p=>p.age<=N.jugendBis))moegl.push('jugend');
  moegl.push('finanzen');const eu=euZielMoeglich();if(eu)moegl.push('europa'); // Europapokal (K37, U19c)
  moegl.push('kader');if(zv)moegl.push('zuschauer'); // U12o
  return{moegl,runde,zv,eu};}
const nebenzielObjekt=(k,m)=>{const N=RV.nebenziele;return k==='europa'?{k,min:m.eu.min,wb:m.eu.wb}:{k,min:k==='pokal'?m.runde:k==='jugend'?N.jugendEinsaetze:k==='zuschauer'?Math.round(m.zv*N.zuschauerHalten/100)*100:0};};
function nebenzieleSetzen(){const N=RV.nebenziele,t=myT(),m=nebenzieleMoeglich(),moegl=m.moegl;
  const n=praesident(t).ehrgeiz>=N.ehrgeizigAb?N.anzahl[1]:N.anzahl[0],zuerst=vereinsProfile(t).map(k=>N.profil[k]).filter(k=>k&&moegl.includes(k));
  const l=mitStrom(strom('nebenziele',S.season,S.my),()=>[...new Set([...zuerst,...shuffle(moegl.filter(k=>!zuerst.includes(k)))])].slice(0,n));
  S.ziele={s:S.season,tid:S.my,l:l.map(k=>nebenzielObjekt(k,m))};}
const zuschauerSchnitt=()=>S.att&&S.att[1]?S.att[0]/S.att[1]:0;
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
  if(z.k==='finanzen'){const s=Object.entries(S.fin||{}).filter(([k])=>k!=='Schuldenschnitt').reduce((a,[,v])=>a+v,0);return ende?(s>=0?'erfuellt':'verfehlt'):(s<0?'gefaehrdet':'offen');}
  if(z.k==='kader'){const im=gehaltsSumme(myT())<=gehaltsRahmen(myT());return ende?(im?'erfuellt':'verfehlt'):(im?'offen':'gefaehrdet');} /* U12o */
  if(z.k==='zuschauer'){const ok=zuschauerSchnitt()>=z.min;return ende?(ok?'erfuellt':'verfehlt'):(!ok&&S.att&&S.att[1]>=RV.nebenziele.zuschauerAb?'gefaehrdet':'offen');} /* U12o */
  return'offen';}
// Baustein „Ziele“ im Vertrauen (montags)
function zieleBaustein(){const N=RV.nebenziele;let s=0;meineZiele().forEach(z=>{const st=nebenzielStand(z,false);s+=st==='erfuellt'?N.erfuellt:st==='verfehlt'?N.verfehlt:st==='gefaehrdet'?N.gefaehrdet:0;});
  return clamp(s,N.baustein[0],N.baustein[1]);}
// Saisonende (seasonEndLauf, vor der Prüfung auf Entlassung): Vertrauen je Nebenziel, Meldung
function nebenzieleSaison(){const N=RV.nebenziele,l=meineZiele();if(!l.length)return;let alle=true;
  const txt=l.map(z=>{const ok=nebenzielStand(z,true)==='erfuellt';if(!ok)alle=false;S.trust=clamp(S.trust+(ok?N.saisonErfuellt:N.saisonVerfehlt),0,100);return`${nebenzielName(z)}: ${ok?'erfüllt':'verfehlt'}`;});
  news(`Nebenziele des Vorstands: ${txt.join(' · ')}.`,alle?'good':'bad');}
function nebenzielName(z){return z.k==='europa'?`Europapokal: mindestens ${EU_RUNDE[z.min]} in der ${euName(z.wb)}`:z.k==='pokal'?`Pokal: mindestens ${POKAL_RUNDEN[z.min]}`:z.k==='jugend'?`Jugend: Spieler bis ${RV.nebenziele.jugendBis} zusammen ${z.min} Einsätze`:
  z.k==='kader'?'Kader: Gehälter am Saisonende im Rahmen des Vorstands':z.k==='zuschauer'?`Zuschauer: Heimschnitt mindestens ${z.min.toLocaleString('de-DE')}`:'Finanzen: kein Verlust in dieser Saison';}
// Anzeige im Büro
function nebenzieleText(){const l=meineZiele();if(!l.length)return'';const W={erfuellt:'erfüllt',verfehlt:'verfehlt',gefaehrdet:'gefährdet',offen:'offen'};
  return`<p class="dim">Nebenziele: ${l.map(z=>`${esc(nebenzielName(z))}${z.k==='jugend'?` (bisher ${jugendEinsaetze()})`:z.k==='zuschauer'&&S.att&&S.att[1]?` (bisher ${Math.round(zuschauerSchnitt()).toLocaleString('de-DE')})`:z.k==='kader'?` (zurzeit ${Math.round(rahmenAnteil(myT())*100)} %)`:''}: ${W[nebenzielStand(z,false)]}`).join(' · ')}</p>`;}

// ---------- Zielgespräch (K28 §5.2, U12e, Bereich zielgespraech) ----------
// S.zg = {s Saison, tid Verein, vorschlag (Platz des Vorstands), sp (eigene Ligaspiele beim Setzen), stufe (Plätze: negativ hochgepokert, positiv tiefgestapelt), fertig, ab (1 = abgelehnt)}.
// Gesetzt mit dem Saisonziel (setTarget). Offen bis zu deinem nächsten Ligaspiel. Ohne Entscheidung gilt der Vorschlag (keine Automatik nötig, kein Zufall).
function zielgespraechStart(){S.zg={s:S.season,tid:S.my,vorschlag:S.target,sp:meineSpieltage(),stufe:0};}
const meinZg=()=>S.zg&&S.zg.s===S.season&&S.zg.tid===S.my?S.zg:null;
const zgOffen=()=>{const z=meinZg();return!!z&&!z.fertig&&!S.fired&&S.phase==='play'&&meineSpieltage()===z.sp;};
// Faktor auf das Transferbudget deines Vereins (finanzen.js transferBudget)
const zgBudgetFaktor=()=>{const z=meinZg(),Z=RV.zielgespraech,b=bgFaktor();if(!z||!z.stufe)return b;return b*(z.stufe<0?1-Z.budgetHoch*z.stufe:Math.max(0,1-Z.budgetTief*z.stufe));}; /* mal Budgetgespräch (U12l) */
// Chance, dass der Vorstand beim Tiefstapeln um n Plätze zusagt
function zgTiefChance(n){const Z=RV.zielgespraech.tief,e=praesident(myT()).ehrgeiz;
  return clamp(Z.basis-Z.weiterer*(n-1)+Z.jeVertrauen*(S.trust-50)+Z.jeRuf*(ruf()-RV.ruf.start)+(e>=RV.nebenziele.ehrgeizigAb?-Z.ehrgeiz:e<=Z.ruhigBis?Z.ehrgeiz:0),Z.grenzen[0],Z.grenzen[1]);}
// Grenzen wie bei setTarget: in der 2. und 3. Liga höchstens Platz ziel.unterhalbMindestens (Aufstieg), nie schlechter als das schlechteste Ziel der Liga (Prüfung CX3)
const zgZielGrenze=(lg,z)=>clamp(z,lg>=2?RV.ziel.unterhalbMindestens:1,RV.ziel.schlechtester[lg]||z);
// d = 0: Vorschlag annehmen, d < 0: hochpokern um −d Plätze, d > 0: tiefstapeln um d Plätze. Gezählt werden die Plätze nach der Grenze (CX4).
function zielVerhandeln(d){if(!darf('zielgespraech')||!zgOffen())return;const z=S.zg,Z=RV.zielgespraech,t=myT();if(Math.abs(d)>Z.maxPlaetze)return;
  if(!d){z.fertig=1;news(`Zielgespräch: Du nimmst das Ziel des Vorstands an (${targetText(t.lg,S.target)}).`,'');save();render();return;}
  const neu=zgZielGrenze(t.lg,S.target+d),n=Math.abs(neu-S.target);if(!n){toast('Weiter geht es in diese Richtung nicht.');return;}
  if(d<0){z.stufe=neu-z.vorschlag;S.target=neu;z.fertig=1;news(`Zielgespräch: Du versprichst mehr (${targetText(t.lg,neu)}). Der Vorstand gibt ${Math.round((zgBudgetFaktor()/bgFaktor()-1)*100)} % mehr Transferbudget frei und erwartet, dass du lieferst.`,'good');}
  else if(mitStrom(strom('zielgespraech',S.season,S.my),()=>R())<zgTiefChance(n)){z.stufe=neu-z.vorschlag;S.target=neu;z.fertig=1;
    news(`Zielgespräch: Der Vorstand lässt sich herunterhandeln (${targetText(t.lg,neu)}). Dafür gibt er ${Math.round((1-zgBudgetFaktor()/bgFaktor())*100)} % weniger Transferbudget frei.`,'');}
  else{z.fertig=1;z.ab=1;S.trust=clamp(S.trust+Z.abgelehnt,0,100);news(`Zielgespräch: Der Vorstand lässt nicht mit sich handeln. Das Ziel bleibt (${targetText(t.lg,S.target)}), die Stimmung ist etwas abgekühlt.`,'bad');}
  save();render();}
// Kauf über dem Transferbudget (aktionen.js, vor der Zahlung): der Vorstand ist verstimmt, Vertrauen je angefangene 10 % der Ablöse über dem Budget
function zgUeberBudget(fee){const Z=RV.zielgespraech,b=transferBudget(myT());if(!(fee>b))return;const k=Math.ceil((fee-b)/fee*10);
  S.trust=clamp(S.trust+Math.max(Z.ueberMax,Z.ueberBudget*k),0,100);news(`Der Vorstand hatte für Ablösen nur ${fmt(b)} freigegeben. Dass du ${fmt(fee)} zahlst, gefällt ihm nicht.`,'bad');}
// Ruf zum Saisonende (rufSaison): Nach jeder Verhandlung zählt „übertroffen“ vom Vorschlag aus, „deutlich verfehlt“ vom verhandelten Ziel. Ein hochgepokertes und erreichtes
// Ziel bringt dazu einen Zuschlag (Prüfung CX2: vorher zählte „übertroffen“ vom höheren Ziel, Hochpokern brachte so weniger Ruf als Annehmen)
const zgRufSoll=soll=>{const z=meinZg();return z&&z.stufe?z.vorschlag:soll;};
const zgRufZuschlag=pos=>{const z=meinZg();return z&&z.stufe<0&&pos<=S.target?RV.zielgespraech.rufHoch*-z.stufe:0;};
// Nebenziel tauschen (K28 §5.2 „Nebenziele verhandeln“, U12p, 25.11., popolupo, vorläufig): solange das Zielgespräch offen ist, einmal je Saison (S.zg.nt).
// Du stellst ein Nebenziel zur Wahl, der Vorstand sagt mit tausch.basis + Vertrauen und Ruf zu und wählt ein anderes mögliches; abgelehnt: Vertrauen tausch.abgelehnt.
// Eigene Ströme, nur auf deinen Klick.
function nebenzielTauschChance(){const Z=RV.zielgespraech.tausch;return clamp(Z.basis+Z.jeVertrauen*(S.trust-50)+Z.jeRuf*(ruf()-RV.ruf.start),Z.grenzen[0],Z.grenzen[1]);}
function nebenzielTauschen(i){if(!darf('zielgespraech')||!zgOffen())return;const z=S.zg,l=meineZiele(),alt=l[i];if(!alt||z.nt)return;
  const m=nebenzieleMoeglich(),frei=m.moegl.filter(k=>!l.some(x=>x.k===k));if(!frei.length){toast('Der Vorstand hat kein anderes Nebenziel.');return;}
  z.nt=1;if(mitStrom(strom('nebenzielTausch',S.season,S.my),()=>R())<nebenzielTauschChance()){const k=mitStrom(strom('nebenzielNeu',S.season,S.my),()=>pick(frei));l[i]=nebenzielObjekt(k,m);
    news(`Zielgespräch: Der Vorstand tauscht das Nebenziel. Statt „${nebenzielName(alt)}“ gilt jetzt „${nebenzielName(l[i])}“.`,'');}
  else{S.trust=clamp(S.trust+RV.zielgespraech.tausch.abgelehnt,0,100);news(`Zielgespräch: Der Vorstand hält am Nebenziel „${nebenzielName(alt)}“ fest.`,'bad');}
  save();render();}
// Karte im Büro, solange das Gespräch offen ist
// Je Richtung nur Knöpfe mit verschiedenem Ziel, Budget und Chance nach den tatsächlich verschobenen Plätzen (CX4)
function zielgespraechKarte(){if(!zgOffen())return'';const t=myT(),Z=RV.zielgespraech,aus=lzAus('zielgespraech');
  const knoepfe=(vz,txt)=>{const da=new Set([S.target]);return[...Array(Z.maxPlaetze)].map((_,i)=>{const d=vz*(i+1),neu=zgZielGrenze(t.lg,S.target+d),n=Math.abs(neu-S.target);
    if(da.has(neu))return'';da.add(neu);return`<button onclick="zielVerhandeln(${d})"${aus}>${txt(neu,n)}</button>`;}).join('');};
  const hoch=knoepfe(-1,(neu,n)=>`Hochpokern: ${targetText(t.lg,neu)} (Budget +${Math.round(Z.budgetHoch*n*100)} %)`);
  const tief=knoepfe(1,(neu,n)=>`Tiefstapeln: ${targetText(t.lg,neu)} (Zusage etwa ${Math.round(zgTiefChance(n)*100)} %, Budget −${Math.round(Z.budgetTief*n*100)} %)`);
  return`<div class="card"><h3>Zielgespräch mit dem Vorstand</h3><p>Der Vorstand schlägt vor: <b>${targetText(t.lg,S.target)}</b>. Bis zu deinem nächsten Ligaspiel kannst du verhandeln, danach gilt der Vorschlag.</p>
    <p class="dim">Hochpokern sagt der Vorstand immer zu: mehr Transferbudget und mehr Ruf, wenn du lieferst, aber das Ziel gilt. Tiefstapeln nimmt Druck, kostet Budget und bringt weniger Ruf. Lehnt der Vorstand ab, kühlt das Vertrauen um ${-Z.abgelehnt} ab. Eine Entscheidung je Saison.</p>
    <div class="row"><button class="go" onclick="zielVerhandeln(0)"${aus}>Ziel annehmen</button>${hoch}${tief}</div>${nebenzielTauschText(aus)}${lzHinweis('zielgespraech')}</div>`;}
// Nebenziel tauschen (U12p): je Nebenziel ein Knopf, solange noch nicht getauscht und ein anderes möglich ist
function nebenzielTauschText(aus){const z=meinZg(),l=meineZiele();if(!z||z.nt||!l.length)return'';const m=nebenzieleMoeglich();if(!m.moegl.some(k=>!l.some(x=>x.k===k)))return'';
  return`<p class="dim" style="margin-top:8px">Ein Nebenziel kannst du einmal je Saison zum Tausch stellen, vor der Entscheidung über das Ziel. Zusage etwa ${Math.round(nebenzielTauschChance()*100)} %, sonst Vertrauen ${RV.zielgespraech.tausch.abgelehnt}.</p>
    <div class="row">${l.map((x,i)=>`<button onclick="nebenzielTauschen(${i})"${aus}>Tauschen: ${esc(nebenzielName(x))}</button>`).join('')}</div>`;}

// ---------- Zwischenbilanz im Winter (K28 §4 Nr. 3, U12f, Bereich zielgespraech) ----------
// S.zb = {s Saison, tid Verein, sp eigene Ligaspiele bei der Bilanz, pos Platz, art 'hoch' | 'antrag' | 'fest', fertig}. Einmal je Saison und Verein, ohne Zufall (außer beim Antrag).
// Wöchentlich (ablauf.js): ab der Hälfte deiner Ligaspiele
function zwischenbilanzWoche(){const t=myT(),n=(S.fx&&S.fx[t.lg]||[]).length,sp=meineSpieltage();
  if(S.fired||S.phase!=='play'||!n||sp<Math.floor(n/2)||(S.zb&&S.zb.s===S.season&&S.zb.tid===S.my))return;zwischenbilanz(rank(t.lg,S.my),sp);}
// Bilanz mit Platz pos: anheben (der Ruf rechnet dann vom neuen Ziel, beim Zielgespräch wird der Vorschlag mit verschoben) oder Antrag ermöglichen
function zwischenbilanz(pos,sp){const t=myT(),Z=RV.zwischenbilanz,z=meinZg();S.zb={s:S.season,tid:S.my,sp,pos,art:'fest'};nebenzieleWinter();
  if(pos<=S.target-Z.abstand){const neu=zgZielGrenze(t.lg,S.target-Z.hoch);if(neu<S.target){const d=neu-S.target;S.target=neu;if(z)z.vorschlag+=d;S.zb.art='hoch';
      news(`Zwischenbilanz: Der Vorstand ist begeistert (Platz ${pos}) und hebt das Ziel an: ${targetText(t.lg,neu)}.`,'good');return;}}
  // U12k: Weit hinter dem Ziel senkt ein geduldiger Präsident von sich aus, ohne Antrag und ohne Abzug beim Budget. Alles rechnet danach vom neuen Ziel (wie beim Anheben).
  if(pos>=S.target+Z.vonSichAus&&praesident(t).geduld>=RV.ruf.geduldig&&!(z&&z.stufe<0)){ /* nicht nach Hochpokern, dann bleibt der Antrag (Prüfung DT3) */ const neu=zgZielGrenze(t.lg,S.target+Z.senken);if(neu>S.target){const d=neu-S.target;S.target=neu;if(z)z.vorschlag+=d;S.zb.art='gesenkt';
      news(`Zwischenbilanz: Platz ${pos}. Der Präsident bleibt geduldig und senkt das Ziel von sich aus: ${targetText(t.lg,neu)}.`,'');return;}}
  if(pos>=S.target+Z.abstand&&zgZielGrenze(t.lg,S.target+Z.senken)>S.target){S.zb.art='antrag';
    news(`Zwischenbilanz: Platz ${pos} liegt weit hinter dem Ziel (${targetText(t.lg,S.target)}). Bis zum nächsten Ligaspiel kannst du im Büro beantragen, das Ziel zu senken.`,'bad');return;}
  news(`Zwischenbilanz: Der Vorstand hält am Ziel fest (${targetText(t.lg,S.target)}, aktuell Platz ${pos}).`,'');}
// Nebenziele im Winter (K28 §5.9 „Nebenziele werden nicht angepasst“, U12q, 25.11., popolupo, vorläufig): Ist ein Nebenziel bei der Zwischenbilanz schon verfehlt
// (etwa das Pokal-Aus), rechnet der Vorstand es ab (Vertrauen zwischenbilanz.nebenzielNeu) und setzt dafür ein anderes mögliches (eigener Strom). Gibt es keins, bleibt es verfehlt.
function nebenzieleWinter(){const l=meineZiele();if(!l.length)return;const m=nebenzieleMoeglich();
  l.forEach((z,i)=>{if(nebenzielStand(z,false)!=='verfehlt')return;const frei=m.moegl.filter(k=>!l.some(x=>x.k===k));if(!frei.length)return;
    const k=mitStrom(strom('nebenzielWinter',S.season,S.my,i),()=>pick(frei));l[i]=nebenzielObjekt(k,m);S.trust=clamp(S.trust+RV.zwischenbilanz.nebenzielNeu,0,100);
    news(`Zwischenbilanz: Das Nebenziel „${nebenzielName(z)}“ ist verfehlt. Der Vorstand rechnet es ab und setzt dafür „${nebenzielName(l[i])}“.`,'');});}
const zbAntragOffen=()=>!!(S.zb&&S.zb.s===S.season&&S.zb.tid===S.my&&S.zb.art==='antrag'&&!S.zb.fertig&&!S.fired&&S.phase==='play'&&meineSpieltage()===S.zb.sp);
function zbChance(){const A=RV.zwischenbilanz.antrag;return clamp(A.basis+A.jeVertrauen*(S.trust-50)+A.jeRuf*(ruf()-RV.ruf.start),A.grenzen[0],A.grenzen[1]);}
// Antrag: zugesagt wirkt wie Tiefstapeln (Zielgespräch: stufe steigt, Budget sinkt, Ruf rechnet vom Vorschlag), abgelehnt kostet Vertrauen
function zielSenkenAntrag(){if(!darf('zielgespraech')||!zbAntragOffen())return;const t=myT(),Z=RV.zwischenbilanz,neu=zgZielGrenze(t.lg,S.target+Z.senken);S.zb.fertig=1;
  if(neu>S.target&&mitStrom(strom('zwischenbilanz',S.season,S.my),()=>R())<zbChance()){const d=neu-S.target,z=meinZg();if(z)z.stufe+=d;else S.zg={s:S.season,tid:S.my,vorschlag:S.target,sp:meineSpieltage(),stufe:d,fertig:1};S.target=neu; /* alter Spielstand ohne Zielgespräch: wie Tiefstapeln anlegen (DD7) */
    news(`Zwischenbilanz: Der Vorstand senkt das Ziel auf ${targetText(t.lg,neu)}. Weniger Druck, aber auch weniger Transferbudget und Ruf.`,'');}
  else{S.trust=clamp(S.trust+Z.abgelehnt,0,100);news(`Zwischenbilanz: Der Vorstand lehnt ab. Das Ziel bleibt (${targetText(t.lg,S.target)}).`,'bad');}
  save();render();}
function zwischenbilanzKarte(){if(!zbAntragOffen())return'';const Z=RV.zwischenbilanz;
  return`<div class="card"><h3>Zwischenbilanz</h3><p>Platz ${S.zb.pos}, Ziel ${targetText(myT().lg,S.target)}. Du kannst beantragen, das Ziel um ${Z.senken} Platz zu senken (Zusage etwa ${Math.round(zbChance()*100)} %). Zugesagt kostet es Transferbudget und Ruf wie Tiefstapeln, abgelehnt kühlt das Vertrauen um ${-Z.abgelehnt} ab. Die Möglichkeit gilt bis zum nächsten Ligaspiel.</p>
    <div class="row"><button onclick="zielSenkenAntrag()"${lzAus('zielgespraech')}>Ziel senken beantragen</button></div>${lzHinweis('zielgespraech')}</div>`;}

// ---------- Rücktritt (K28 §5.3, §5.7, U12b, Bereich ruecktritt) ----------
function ruecktrittFragen(){if(!darf('ruecktritt'))return;if(S.fired||S.phase!=='play'){toast('Zurücktreten geht nur während der Saison.');return;}
  ov(`<h2>Zurücktreten?</h2><p>Du verlässt ${esc(myT().name)} sofort. Dein Ruf als Trainer sinkt um ${-RV.ruf.ruecktritt} (bei einer Entlassung wären es ${-RV.ruf.entlassung}). Danach bekommst du Jobangebote nach deinem Ruf.</p>
    <div class="row"><button class="go" onclick="ruecktritt()">Ja, zurücktreten</button><button onclick="closeOv()">Abbrechen</button></div>`);}
function ruecktritt(){if(!darf('ruecktritt')||S.fired||S.phase!=='play')return;trainerVertragEnde(false);S.fired=1;S.ruecktritt=1;S.ult=null;rufAendern(RV.ruf.ruecktritt);
  news(`Du trittst bei ${myT().name} zurück.`,'bad');mkJobs();closeOv();save();render();showFired();}

// ---------- Ruf als Trainer (K28 §5.4) ----------
const ruf=()=>S.ruf==null?RV.ruf.start:S.ruf;
function rufAendern(d){S.ruf=Math.round(clamp(ruf()+d,0,100)*10)/10;}
// Saisonende (seasonEndLauf, vor einer Entlassung): erst vergessen, dann Ziel übertroffen oder deutlich verfehlt, Titel, Auf- und Abstieg. sm: Saisonbilanz.
function rufSaison(sm){const F=RV.ruf,me=S.my,soll=zgRufSoll(sm.target);let d=(F.start-ruf())*F.vergessen+zgRufZuschlag(sm.pos); // Zielgespräch (U12e)
  if(sm.pos<soll)d+=(soll-sm.pos)*F.jePlatzUeber;else if(sm.pos>sm.target+RV.saisonWeitAb)d+=F.verfehlt;
  if(sm.champ===me)d+=F.meister;if(sm.cup===me)d+=F.pokal;
  if(sm.up.includes(me)||sm.up3.includes(me)||(sm.lg===2&&sm.rw===me)||(sm.lg===3&&sm.rw2===me))d+=F.aufstieg;
  if(sm.down.includes(me)||sm.down2.includes(me)||sm.down3.includes(me)||(sm.lg===1&&sm.rel[0]===me&&sm.rw!==me)||(sm.lg===2&&sm.rel2[0]===me&&sm.rw2!==me))d+=F.abstieg;
  rufAendern(d);S.ult=null;}

// ---------- Trainervertrag (K28 §5.5, U12g) ----------
// S.tvt = {tid, bis (letzte Saison des Vertrags), geh (Gehalt je Saison), lg (Liga für die Ligaklausel), ab (Tag der Saison, bis zu dem das Gehalt schon in der Karriere steht)}.
// Nur Statistik, es fließt kein Geld (vorläufig, K28 §5.5): Das Gehalt steht je Station in statS().st (geh, verd verdient, abf Abfindung) und je Saison in S.hist (geh). Ohne Zufall.
function trainerGehalt(tid){const V=RV.vertrag,t=S.teams[tid];if(!t)return 0;
  const g=V.basis*(V.liga[t.lg]||V.liga[3])*Math.exp(V.steigung*(t.rep-V.mitte))*Math.max(0,1+V.jeRuf*(ruf()-RV.ruf.start));return Math.max(V.runden,Math.round(g/V.runden)*V.runden);}
function vertragLaufzeit(tid){const L=RV.vertrag.laufzeit,F=RV.ruf,g=praesident(S.teams[tid]).geduld;return g<=F.ungeduldig?L.ungeduldig:g>=F.geduldig?L.geduldig:L.mittel;}
// Neuer Vertrag (Spielbeginn, saison.js takeJob, alter Spielstand): nach dem Saisonende oder ab dem Winter zählt die laufende Saison nicht mit
function vertragNeu(tid){const V=RV.vertrag,spiel=S.phase==='play',zaehlt=spiel&&S.tag<V.winterAb;
  S.tvt={tid,bis:S.season+vertragLaufzeit(tid)-(zaehlt?1:0),geh:trainerGehalt(tid),lg:S.teams[tid].lg,ab:spiel?S.tag:V.saisonTage};stationVertrag();return S.tvt;}
const trainerVertrag=()=>S.tvt&&S.tvt.tid===S.my?S.tvt:vertragNeu(S.my);
// offene Station des Trainers (K34 §5.7) beim aktuellen Verein, sonst null
function offeneStation(){const l=statS().st,a=l[l.length-1];return a&&a.bis==null&&a.tid===S.my?a:null;}
function stationVertrag(){const a=offeneStation();if(a)a.geh=S.tvt.geh;}
// Gehalt vom Tag v.ab bis zum Tag bis anteilig in die Station
function gehaltBuchen(bis){const v=trainerVertrag(),a=offeneStation(),d=Math.max(0,bis-v.ab);v.ab=Math.max(v.ab,bis);if(a&&d)a.verd=Math.round((a.verd||0)+v.geh*d/RV.vertrag.saisonTage);}
// Restgehalt × Anteil (entlassen: true): restliche Saisons plus der Rest der laufenden. Name mit „trainer“, abfindung gibt es für Spieler (aktionen.js, Prüfung DN1)
function trainerAbfindung(){const V=RV.vertrag,v=trainerVertrag(),rest=Math.max(0,v.bis-S.season)+(S.phase==='play'?Math.max(0,1-S.tag/V.saisonTage):0);return Math.round(v.geh*rest*V.abfindung/V.runden)*V.runden;}
// Entlassung und Rücktritt (vor S.fired): Gehalt bis heute, nach dem Saisonende bis zum Ende der Saison; bei einer Entlassung die Abfindung. vertragEnde gibt es für Spieler (vertraege.js, DN2)
function trainerVertragEnde(entlassung){gehaltBuchen(S.phase==='play'?S.tag:RV.vertrag.saisonTage);if(!entlassung)return;const b=trainerAbfindung(),a=offeneStation();
  if(a&&b){a.abf=b;news(`Abfindung laut Vertrag: ${fmt(b)}.`);}}
// Saisonende (saison.js seasonEndLauf, nach der Prüfung auf Entlassung): Gehalt der Saison, dann verlängert der Vorstand einen auslaufenden Vertrag.
// Entlassen: Gehalt und Abfindung stehen schon (trainerVertragEnde), nur die Saisonzeile bekommt das Gehalt.
function vertragSaisonende(){const V=RV.vertrag,h=S.hist[S.hist.length-1],v=trainerVertrag();if(h&&h.s===S.season)h.geh=v.geh;if(S.fired)return;gehaltBuchen(V.saisonTage);if(v.bis>S.season)return;
  if(S.trust>V.verlaengernAb){v.bis=S.season+V.verlaengern;v.geh=trainerGehalt(S.my);v.lg=myT().lg;stationVertrag();news(`Der Vorstand verlängert deinen Vertrag bis ${stSaison(v.bis)}, Gehalt ${fmt(v.geh)} je Saison.`,'good');}
  else{v.bis=S.season+V.bewaehrung;news(`Der Vorstand verlängert deinen Vertrag nur um ${V.bewaehrung===1?'eine Saison':V.bewaehrung+' Saisons'}, zum alten Gehalt. Eine Bewährung.`,'bad');}}
// Saisonwechsel (saison.js newSeasonLauf, nach Auf- und Abstieg): Ligaklausel, das Gehalt zählt ab dem 1. Juli
function vertragNeueSaison(){if(S.fired)return;const V=RV.vertrag,v=trainerVertrag(),lg=myT().lg;v.ab=0;if(v.lg===lg)return;
  const f=(V.liga[lg]||V.liga[3])/(V.liga[v.lg]||V.liga[3]);v.geh=Math.max(V.runden,Math.round(v.geh*f/V.runden)*V.runden);v.lg=lg;stationVertrag();
  news(`Ligaklausel in deinem Vertrag: In der ${ligaName(lg)} verdienst du ${fmt(v.geh)} je Saison.`,f>1?'good':'bad');}
// Laden eines Spielstands (start.js, fenster.js): Vertrag anlegen, wenn er fehlt (alter Spielstand), damit die Anzeige nur liest (DN4)
function vertragUmstellen(){if(!S||S.my==null||!S.teams||!S.teams[S.my]||S.fired)return;if(!S.tvt||S.tvt.tid!==S.my)vertragNeu(S.my);}
// Gehalt seit v.ab in der laufenden Saison, noch nicht in der Station (Anzeige der Karriere, DN6)
const gehaltLaufend=()=>{const v=S.tvt;return v&&v.tid===S.my&&!S.fired&&S.phase==='play'?Math.round(v.geh*Math.max(0,S.tag-v.ab)/RV.vertrag.saisonTage):0;};
// Anzeige im Büro (Karte Saisonziel), nur lesend. vertragText gibt es für Spieler (vertraege.js, DN3)
function trainerVertragText(){const v=S.tvt;if(S.fired||!v||v.tid!==S.my)return'';return`<p class="dim">Dein Vertrag läuft bis ${stSaison(v.bis)}, Gehalt ${fmt(v.geh)} je Saison (nur Statistik).</p>`;}

// ---------- Präsidentenwahl (K28 §8, K25 §5.5, U12i) ----------
// Mitgliederversammlung im Sommer nach der Saison s, je Verein alle 3 oder 4 Jahre (fest aus der Vereinsnummer). t.prw zählt die Präsidentenwechsel (praesident).
const wahlJahre=t=>{const J=RV.praesident.wahl.jahre;return J[t.id%J.length];};
const wahlFaellig=(t,s)=>(s+t.id)%wahlJahre(t)===0;
function naechsteWahl(t){let s=S.season;while(!wahlFaellig(t,s))s++;return s;}
// Chance, dass der Präsident bleibt: Punkte je Spiel der Saison, Auf- oder Abstieg (sm), Fanstimmung, in Grenzen. Ohne Zufall.
// Mitglieder als Stimmen (U12m): Gewicht der Fanstimmung nach Mitgliedern je Platz (wahlFansGewicht)
const wahlFansGewicht=t=>{const W=RV.praesident.wahl,M=W.mitglieder,k=t?kapOhneBau(t):0,mp=k>0?mitgliederVon(t)/k:0; /* Plätze ohne Bau-Abzug (ES5) */return M[0]+(M[1]-M[0])*Math.min(1,mp/W.mitgliederVoll);};
function wahlChance(t,sm){const W=RV.praesident.wahl,r=table(t.lg).find(x=>x.id===t.id),ppg=r&&r.sp?r.p/r.sp:W.mitte;let c=W.bleiben+(ppg-W.mitte)*W.jePunkt+(fanst(t)-50)*W.fans*wahlFansGewicht(t);
  if(sm){const id=t.id,relAuf=(r,w)=>!!r&&w===id&&r[1]===id,relAb=(r,w)=>!!r&&w!=null&&w!==id&&r[0]===id; /* Relegation wie in rufSaison (Prüfung DQ6) */
    if([...(sm.up||[]),...(sm.up3||[]),...(sm.up4||[])].includes(id)||relAuf(sm.rel,sm.rw)||relAuf(sm.rel2,sm.rw2))c+=W.aufstieg;
    if([...(sm.down||[]),...(sm.down2||[]),...(sm.down3||[])].includes(id)||relAb(sm.rel,sm.rw)||relAb(sm.rel2,sm.rw2))c+=W.abstieg;}
  return clamp(c,W.grenzen[0],W.grenzen[1]);}
// Saisonwechsel (saison.js newSeasonLauf, vor Auf- und Abstieg): Wahl bei allen Vereinen, bei denen sie fällig ist, eigener Strom je Verein und Saison.
// Bei dir: Meldung, ein neuer Präsident kennt dich nicht (Vertrauen rückt Richtung 50). Rückgabe: Zahl der neuen Präsidenten.
function praesidentenWahlen(sm){const W=RV.praesident.wahl;let n=0;
  S.teams.forEach(t=>{if(!aktiv(t)||!wahlFaellig(t,S.season))return;const c=wahlChance(t,sm),bleibt=mitStrom(strom('praesidentWahl',S.season,t.id),()=>R()<c);
    if(!bleibt){t.prw=(t.prw||0)+1;n++;}if(t.id!==S.my||S.fired)return; /* entlassen: keine Meldung, kein Vertrauen (DQ7) */
    if(bleibt)news(`Mitgliederversammlung: Der Präsident wird wiedergewählt. Er ist ${praesidentText(t)}.`);
    else{S.trust=clamp(50+(S.trust-50)*W.vertrauen,0,100);news(`Mitgliederversammlung: Der Präsident wird abgewählt. Der neue ist ${praesidentText(t)}${praesident(t).ehrgeiz>=RV.nebenziele.ehrgeizigAb?' und ehrgeizig':''}. Er muss sich erst ein Bild von dir machen.`,'bad');}});
  return n;}
// Anzeige im Büro (Karte Saisonziel)
function wahlText(t){const s=naechsteWahl(t),g=wahlFansGewicht(t);return`Nächste Präsidentenwahl auf der Mitgliederversammlung im Sommer ${s+1}.${Math.abs(g-1)>=RV.praesident.wahl.anzeigeAb?` Die Fanstimmung zählt dort × ${de(g,2)}, ${g>1?'viele':'wenige'} Mitglieder je Platz (U12m).`:''}`;}

// ---------- Budgetgespräch (K28, K15 §12 Nr. 20, U12l) ----------
// S.bg = {s, tid, ok (1 zugesagt, 0 abgelehnt)}: einmal je Saison und Verein, nur während der Saison, Bereich zielgespraech. Zugesagt: Transferbudget × (1 + plus) bis Saisonende.
const bgMein=()=>S.bg&&S.bg.s===S.season&&S.bg.tid===S.my?S.bg:null;
const bgFaktor=()=>{const b=bgMein();return b&&b.ok?1+RV.budgetgespraech.plus:1;};
const bgOffen=()=>!bgMein()&&S.phase==='play'&&!S.fired;
function bgChance(){const B=RV.budgetgespraech,P=praesident(myT());let c=B.basis+B.jeVertrauen*(S.trust-B.vertrauenMitte)+B.jeRuf*(ruf()-RV.ruf.start)-B.jeSparsam*(P.sparsam-B.sparsamMitte);
  if(glaub()<B.glaubUnter)c*=B.glaubFaktor;return clamp(c,B.grenzen[0],B.grenzen[1]);}
function budgetGespraech(){if(!darf('zielgespraech')||!bgOffen())return;const B=RV.budgetgespraech,ok=mitStrom(strom('budgetgespraech',S.season,S.my),()=>R())<bgChance();
  S.bg={s:S.season,tid:S.my,ok:ok?1:0};
  if(ok)news(`Budgetgespräch: Der Vorstand gibt dir mehr Spielraum, das Transferbudget steigt bis Saisonende um ${Math.round(B.plus*100)} %.`,'good');
  else{S.trust=clamp(S.trust+B.abgelehnt,0,100);news('Budgetgespräch: Der Vorstand lehnt ab. Mehr Geld gibt es nicht, die Bitte hat ihn verstimmt.','bad');}save();render();}
function budgetGespraechText(){const b=bgMein();if(b)return`<p class="dim">Budgetgespräch dieser Saison: ${b.ok?'zugesagt, Transferbudget +'+Math.round(RV.budgetgespraech.plus*100)+' %':'abgelehnt'}.</p>`;if(!bgOffen())return'';
  return`<div class="row"><button onclick="budgetGespraech()"${lzAus('zielgespraech')}>Mehr Transferbudget beantragen (Zusage etwa ${Math.round(bgChance()*100)} %)</button></div>`;}
