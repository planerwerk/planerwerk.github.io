// Zweite Mannschaft (Konzept K08 §5.6, U9d): Amateurkader deines Vereins in der Regionalliga oder Oberliga, Budget mit Deckel, Station zwischen U19 und Profis.
// Alle Zahlen stehen in daten/regeln.js unter REGELN.zweite (Kurzform RZ). Welche Vereine 2026/27 eine Zweite haben, steht in daten/vereine.js (Feld zw).
// Wie der Jugendkader spielt die Zweite keine simulierten Spiele (K08 §12 Nr. 1). Ihre Spieler stehen nicht in S.pl, die Spielerkarte kennt sie über PIX.
// Am Saisonende wird ihre Platzierung aus ihrer Stärke über die Saison ausgespielt. Wie beim Jugendkader hat nur dein Verein eine solche Zweite.
// Hoffenheim II und Stuttgart II sind eigene Vereine in der 3. Liga: Solange sie dort spielen, ist die Zweite ein Computer-Verein mit eigenem Kader und eigenen
// Finanzen. Du schickst Jugendspieler hin und holst Spieler von dort. Steigt sie ab, wird sie zum Amateurkader, steigt sie aus der Regionalliga auf, wieder zum Verein.

const ZWEITE_TEAM=-4; // Kennzeichen im Feld team: Spieler im Amateurkader der Zweiten
const ZWEITE_ID0=700000; // eigener Nummernkreis (Jugend ab 500.000, Auslandspool ab 1.000.000)
const istZweite=p=>!!p&&p.team===ZWEITE_TEAM;
const zwDaten=t=>(t&&VEREINE.find(v=>v.kurz===t.sh))||{};
// Die Zweite als eigener Eintrag in der Welt (Hoffenheim II, Stuttgart II), in der 3. Liga oder im Regionalliga-Pool
const zweiteEintrag=(tid=S.my)=>S.teams.find(t=>t.zweite===tid)||null;
// Spielt deine Zweite als simulierter Verein in der 3. Liga, gehört ihr Kader zu S.pl
const zweiteSim=()=>{const t=zweiteEintrag();return t&&aktiv(t)?t:null;};
// Hat dein Verein eine Zweite? Aus den Daten (Regionalliga, Oberliga) oder als eigener Eintrag. Eine Zweite hat selbst keine Zweite.
const hatZweite=()=>!!S&&S.my!=null&&(!!zweiteEintrag()||!!zwDaten(myT()).zw);
// Darf eine Zweite aus dem Regionalliga-Pool in die 3. Liga? Nur, wenn ihre erste Mannschaft in der 1. oder 2. Liga spielt (DFB: keine Zweite eines Drittligisten in der Regionalliga).
const zweiteDarfAufsteigen=t=>t.zweite<0||!S.teams[t.zweite]||S.teams[t.zweite].lg<=2;

// ---------- Liga, Budget, Deckel ----------
// Liga der Zweiten: 4 Regionalliga, 5 Oberliga. Die Zweite eines Drittligisten darf nicht in der Regionalliga spielen (DFB), sie muss in die Oberliga.
function zweiteLigaStart(){const l=zweiteEintrag()?4:(zwDaten(myT()).zw||5);return myT().lg>=3?Math.max(l,5):l;}
const zweiteLiga=()=>S.zw&&S.zwV===S.my&&S.zwL?S.zwL:zweiteLigaStart();
const zweiteLigaName=(l=zweiteLiga())=>l===4?`Regionalliga ${myT().region}`:(zwDaten(myT()).ol||'Oberliga');
const zweiteL=()=>RZ.ligen[zweiteLiga()];
// Stufe des Budgets (1–5). Solange der Verein sie führt (K36), die übliche Stufe nach Ansehen.
const zweiteStartStufe=t=>(RZ.stufe.start.find(x=>t.rep>=x[0])||[0,2])[1];
function zweiteStufe(){const t=myT();if(autoB('zweite'))return zweiteStartStufe(t);if(t.zws==null)t.zws=zweiteStartStufe(t);return t.zws;}
// Kosten je Ligaspieltag. Spielt die Zweite als eigener Verein in der 3. Liga, hat sie eigene Finanzen.
const zweiteKosten=()=>hatZweite()&&!zweiteSim()?Math.round(RZ.stufe.kosten[zweiteStufe()]*zweiteL().kosten):0;
// Deckel (deine Vorgabe vom 13.11.): nie stärker als ein gutes Team ihrer Liga, immer mit Abstand unter den Profis
const zweiteDeckel=()=>Math.min(zweiteL().gut,teamLevel(S.my)-RZ.deckel.profiAbstand);
// Stärke der Zweiten: Schnitt der besten 14 wie bei den Profis. Gewertet wird sie höchstens bis zum Deckel.
function zweiteStaerke(l=zweiteKader()){const s=l.map(p=>p.str).sort((a,b)=>b-a).slice(0,RP.niveauSpieler);return s.length?s.reduce((a,b)=>a+b,0)/s.length:zweiteL().schnitt-RZ.deckel.profiAbstand;}
const zweiteWertung=()=>Math.min(zweiteStaerke(),zweiteDeckel());
const zweiteTraining=()=>RZ.stufe.training[zweiteStufe()];

// ---------- Amateurkader ----------
// Ein Spieler verlässt die simulierte Welt (zu alt, verkauft, Kader voll, Vereinswechsel): aus PIX und aus den Beziehungen (K14)
function zweiteWeg(p){PIX.delete(p.id);if(S.bz)S.bz=S.bz.filter(b=>b[0]!==p.id&&b[1]!==p.id);}
// Position eines Neuen: die Position mit dem größten Fehlbestand gegenüber der Sollverteilung
function zweitePosition(l){const soll=RZ.kader.pos,n=Object.keys(soll).reduce((o,k)=>(o[k]=0,o),{});l.forEach(p=>{if(n[p.pos]!=null)n[p.pos]++;});
  return Object.keys(soll).sort((a,b)=>(n[a]-soll[a])-(n[b]-soll[b]))[0];}
// Ein neuer Amateur (18 bis 21 Jahre). Das Budget bestimmt sein Talent (Ligaschnitt plus Stufe plus Zufall), höchstens knapp über dem Deckel.
// Seine Stärke liegt darunter, bei den Jüngeren weiter (je Jahr unter 21 um 1,5 mehr). So wird die Zweite mit Geld besser, aber nicht über ein gutes Team ihrer Liga hinaus.
function zweiteNeu(l,alter){const K=RZ.kader,L=zweiteL(),a=alter||riA(K.zugangAlter),dk=zweiteDeckel();
  const pot=clamp(Math.round(L.schnitt+RZ.stufe.zugang[zweiteStufe()]+riA(K.zugangZufall)),RT.staerkeMin+5,Math.max(RT.staerkeMin+5,Math.floor(dk+K.talentUeber)));
  const str=clamp(Math.round(pot-riA(K.abstand)-Math.max(0,K.abstandAb-a)*K.abstandJeJahr),RT.staerkeMin,pot);
  S.zid=Math.max(S.zid||0,ZWEITE_ID0);const p=mkPlayer({id:S.zid++,pos:zweitePosition(l),age:a,str,pot,team:ZWEITE_TEAM,ct:1});
  p.sal=0;eigenschaftenNeu(p);return p;}
// Erster Amateurkader: 22 Spieler von 18 bis 23 Jahren, gleichmäßig verteilt. Wer älter ist, kam früher und ist seitdem in der Zweiten gewachsen
// (wie beim ersten Jugendkader), sonst wäre jede Zweite im ersten Jahr zu schwach.
function zweiteAufbau(){const K=RZ.kader,T=RP.entwicklung.tageProSaison,P=RZ.praxis;(S.zw||[]).forEach(zweiteWeg);S.zw=[];S.zwV=S.my;S.zwL=zweiteLigaStart();S.zwSt=[0,0];S.zwErg=null;
  for(let i=0;i<K.soll;i++){const a=K.startAlter[0]+i%(K.startAlter[1]-K.startAlter[0]+1),an=Math.min(a,riA(K.zugangAlter)),p=zweiteNeu(S.zw,an);
    for(let y=an;y<a;y++){for(let q=0;q<4;q++){p.sp=(P.stamm+P.rest)/2;p.form=P.form;p.trf=zweiteTraining();entwickeln(p,T/4);}p.age++;}eigenschaftenNeu(p);S.zw.push(p);PIX.set(p.id,p);}}
// Der Kader deiner Zweiten. Als simulierter Verein sein Kader in S.pl, sonst der Amateurkader. Entsteht beim ersten Zugriff und nach einem Vereinswechsel neu.
function zweiteKader(){if(!hatZweite())return[];const sim=zweiteSim();
  if(sim){if(S.zw&&S.zwV!==S.my){S.zw.forEach(zweiteWeg);S.zw=null;}return squad(sim.id);}
  if(!S.zw||S.zwV!==S.my)mitStrom(strom('zweite',S.season,S.my),zweiteAufbau);return S.zw;}
// Leerer Amateurkader für deinen Verein ohne erfundene Spieler (wenn Spieler aus der 3. Liga oder der Jugend hineinkommen)
function zweiteLeer(){if(S.zw&&S.zwV===S.my)return S.zw;(S.zw||[]).forEach(zweiteWeg);S.zw=[];S.zwV=S.my;S.zwL=zweiteLigaStart();S.zwSt=[0,0];S.zwErg=null;return S.zw;}

// ---------- Woche: Spielpraxis, Entwicklung, Stärke über die Saison ----------
// Die 14 Stärksten spielen regelmäßig (Spielpraxis 70), die übrigen weniger. Trainingsfaktor nach Budget, Form fest.
function zweiteWoche(d){if(!hatZweite()||zweiteSim())return;const l=zweiteKader(),P=RZ.praxis,tr=zweiteTraining();
  l.slice().sort((a,b)=>b.str-a.str).forEach((p,i)=>{p.sp=i<RZ.kader.stamm?P.stamm:P.rest;p.form=P.form;p.trf=tr;entwickeln(p,7);});
  if(S.phase==='play'){S.zwSt=S.zwSt||[0,0];S.zwSt[0]+=zweiteWertung();S.zwSt[1]++;}}

// ---------- Saisonende: Platzierung aus der Stärke über die Saison ----------
// Eine Saison mit Hin- und Rückspiel gegen 17 Gegner um den Ligaschnitt. Rückgabe: Platz, Punkte, Tore.
function zweiteTabelle(w,L){const Z=RZ.saison,n=L.teams,st=[w];for(let i=1;i<n;i++)st.push(L.schnitt+(R()+R()+R()-1.5)*2*Z.streuung);
  const pkt=st.map(()=>0),td=st.map(()=>0);
  for(let h=0;h<n;h++)for(let a=0;a<n;a++){if(h===a)continue;const d=Z.k*(st[h]-st[a]),gh=poisson(Z.tore*Z.heim*Math.exp(d)),ga=poisson(Z.tore/Z.heim*Math.exp(-d));
    td[h]+=gh-ga;td[a]+=ga-gh;if(gh>ga)pkt[h]+=3;else if(gh<ga)pkt[a]+=3;else{pkt[h]++;pkt[a]++;}}
  const los=st.map(()=>R()),ord=st.map((_,i)=>i).sort((x,y)=>pkt[y]-pkt[x]||td[y]-td[x]||los[y]-los[x]);
  return{platz:ord.indexOf(0)+1,pkt:pkt[0],td:td[0],teams:n};}
// Am Saisonende (seasonEnd): Platz ausspielen. Steigt deine Zweite aus dem Regionalliga-Pool auf, war sie Meister.
function zweiteSaisonEnde(sm){if(!hatZweite()||zweiteSim())return'';const l=zweiteKader(),L=zweiteL(),liga=zweiteLiga(),name=zweiteLigaName(liga);
  const w=S.zwSt&&S.zwSt[1]?S.zwSt[0]/S.zwSt[1]:zweiteWertung(),e=zweiteEintrag(),erg=zweiteTabelle(w,L);
  if(e&&sm&&sm.up4.includes(e.id))erg.platz=1;
  S.zwErg=Object.assign(erg,{s:S.season,v:S.my,liga,name,w:Math.round(w*10)/10});S.zwHist=[...(S.zwHist||[]),{s:S.season,v:S.my,liga,name,platz:erg.platz,pkt:erg.pkt}].slice(-RZ.kader.verlauf);
  const txt=`Die Zweite beendet die Saison in der ${name} auf Platz ${erg.platz} von ${erg.teams} (${erg.pkt} Punkte).`;news(txt,erg.platz<=3?'good':erg.platz>L.teams-L.ab&&L.ab?'bad':'');return txt;}

// ---------- 1. Juli ----------
// Vor dem Altern der Ligaspieler (newSeason): Ist deine simulierte Zweite aus der 3. Liga abgestiegen, kommen ihre Spieler bis 23 Jahre in den Amateurkader, die übrigen werden vereinslos.
function zweiteAbstiegSim(){const e=zweiteEintrag();if(!e||aktiv(e))return;const l=squad(e.id);if(!l.length)return;const jung=l.filter(p=>p.age<RZ.kader.bisAlter),zw=zweiteLeer(); // bis 22, sie werden gleich ein Jahr älter
  jung.forEach(p=>{p.team=ZWEITE_TEAM;p.list=0;p.sal=0;p.ct=1;delete p.kr;if(S.bz)S.bz=S.bz.filter(b=>b[0]!==p.id&&b[1]!==p.id);zw.push(p);});const ids=new Set(jung.map(p=>p.id));S.pl=S.pl.filter(p=>!ids.has(p.id));S.zwL=zweiteLigaStart();
  news(`${e.name} spielt nicht mehr in der 3. Liga. ${jung.length} Spieler bis ${RZ.kader.bisAlter} Jahre bleiben in der Zweiten (jetzt ${zweiteLigaName()}), die übrigen verlassen den Verein.`,'bad');}
// Wird der Kader deiner Zweiten gleich in die 3. Liga übernommen? Dann bekommt sie keinen erfundenen Kader (K32a §4.5).
const zweiteWirdVerein=id=>{const t=S.teams[id];return !!t&&t.zweite===S.my&&!!S.zw&&S.zwV===S.my&&S.zw.length>0;};
// Aufstieg aus dem Regionalliga-Pool: Der Amateurkader wird zum Kader des Vereins in der 3. Liga
function zweiteInDieDritte(e){const N=RZ.aufruecken;S.zw.forEach(p=>{p.age++;eigenschaftenNeu(p);p.team=e.id;p.ct=N.vertrag;p.sal=Math.round(salaryFor(p.str)*N.gehalt/1000)*1000;delete p.trf;delete p.ent;kabineInit(p);S.pl.push(p);PIX.set(p.id,p);});
  const n=S.zw.length;S.zw=[];S.zwSt=[0,0];rollenBerechnen(e.id);news(`${e.name} steigt in die 3. Liga auf. Die ${n} Spieler der Zweiten spielen dort als eigener Verein weiter.`,'good');}
// In den Profikader: aus dem Amateurkader mit Profivertrag (drei Jahre, halbes Gehalt), aus der simulierten Zweiten mit dem bestehenden Vertrag
function zweiteHoch(p){const N=RZ.aufruecken,sim=zweiteSim();
  if(istZweite(p)){S.zw=S.zw.filter(x=>x!==p);if(!p.zwP){p.ct=N.vertrag;p.sal=Math.round(salaryFor(p.str)*N.gehalt/1000)*1000;}p.ppk=p.ppk||0;S.pl.push(p);} // abgestellte Profis behalten ihren Vertrag (U10d)
  else if(sim&&p.team===sim.id){delete p.kr;}else return null;delete p.zwP;
  p.team=S.my;p.list=0;p.wiv=0;delete p.trf;delete p.ent;PIX.set(p.id,p);kabineInit(p);rollenBerechnen(S.my);if(sim)rollenBerechnen(sim.id);p.ea=erwartungEinsatz(p);return p;}
// Aus der Jugend in die Zweite (ab 17): in den Amateurkader oder mit kleinem Vertrag zur simulierten Zweiten in der 3. Liga
function zweiteAufnehmen(p){if(!istJugend(p)||!hatZweite())return null;const sim=zweiteSim(),J=RZ.ausJugend;S.jg=S.jg.filter(x=>x!==p);p.zwJ=1;p.ej=S.my;delete p.trf;
  if(sim){p.team=sim.id;p.ct=J.vertrag;p.sal=Math.round(salaryFor(p.str)*J.gehalt/1000)*1000;p.sp=RP.startSpielpraxis;p.wiv=0;p.ppk=0;delete p.ent;S.pl.push(p);kabineInit(p);rollenBerechnen(sim.id);p.ea=erwartungEinsatz(p);}
  else{const l=zweiteKader();p.team=ZWEITE_TEAM;p.sal=0;l.push(p);}
  PIX.set(p.id,p);return p;}
// Automatik (K36): höchstens einer je Sommer, der fast so gut ist wie die Profis
function zweiteAutoHoch(l){const A=RZ.aufruecken;if(squad(S.my).length>=RM.kaderMax)return;const lvl=teamLevel(S.my);
  l.filter(p=>p.age<=RZ.kader.bisAlter&&p.str>=lvl-A.autoAbstand).sort((a,b)=>b.str-a.str).slice(0,A.auto).forEach(p=>{zweiteHoch(p);stabMeldung(`Aus der Zweiten: Der Verein hat ${p.n} (${p.pos}, ${p.age}) in den Profikader geholt. Talent ${stars(p)}.`,'good');});}
// Automatik (K36) in jugendSaison: 19-Jährige, die für die Zweite taugen, gehen dorthin statt zu den Amateuren
function zweiteAusJugend(l){if(!hatZweite()||!autoB('zweitekader'))return[];const sim=zweiteSim(),ref=sim?teamLevel(sim.id):zweiteStaerke(),A=RZ.ausJugend;
  const neu=l.filter(p=>p.age>=RJ.aufruecken.spaetestens&&p.str>=ref-A.autoAbstand);neu.forEach(zweiteAufnehmen);
  if(neu.length)stabMeldung(`Jugend: ${neu.map(p=>p.n).join(', ')} ${neu.length>1?'wechseln':'wechselt'} in die Zweite statt den Verein zu verlassen.`);return neu;}
// Teil 1 (vor jugendSaison): Auf- und Abstieg, Regel für Drittligisten, Alter, Abgänge mit 24, Automatik
function zweiteSaison(){if(!hatZweite())return;const e=zweiteEintrag();
  if(e&&aktiv(e)){if(S.zw&&S.zwV===S.my&&S.zw.length)zweiteInDieDritte(e);if(autoB('zweitekader'))zweiteAutoHoch(squad(e.id));return;}
  const l=zweiteKader(),alt=S.zwL||zweiteLigaStart(),E=S.zwErg&&S.zwErg.v===S.my&&S.zwErg.s===S.season?S.zwErg:null,L=RZ.ligen[alt],dritt=myT().lg>=3;let neu=alt,txt=[];
  if(E&&L.auf&&E.platz<=L.auf&&alt>4){if(dritt)txt.push(`Als Zweite eines Drittligisten darf sie nicht in die Regionalliga aufsteigen.`);else{neu=alt-1;txt.push(`Die Zweite steigt in die ${zweiteLigaName(neu)} auf.`);}}
  else if(E&&L.ab&&E.platz>L.teams-L.ab){neu=alt+1;txt.push(`Die Zweite steigt in die ${zweiteLigaName(neu)} ab.`);}
  else if(E&&alt===4&&E.platz===1)txt.push('Der Verein verzichtet auf den Aufstieg in die 3. Liga, die Zweite bleibt in der Regionalliga.');
  if(dritt&&neu<5){neu=5;txt.push(`Die Zweite eines Drittligisten darf nicht in der Regionalliga spielen: Sie muss in die ${zweiteLigaName(5)}.`);}
  S.zwL=neu;S.zwSt=[0,0];
  l.forEach(p=>{p.age++;eigenschaftenNeu(p);});
  // Abgestellte Profis (U10d): Ihr Vertrag läuft weiter. Endet er, gehen sie. Mit 24 kehren sie in den Profikader zurück.
  const ende=l.filter(p=>p.zwP&&--p.ct<=0);ende.forEach(zweiteWeg);if(ende.length)txt.push(`Vertrag ausgelaufen: ${ende.map(p=>p.n).join(', ')} ${ende.length>1?'verlassen':'verlässt'} den Verein.`);
  const zurueck=l.filter(p=>p.zwP&&p.ct>0&&p.age>RZ.kader.bisAlter);
  const weg=l.filter(p=>!p.zwP&&p.age>RZ.kader.bisAlter);weg.forEach(zweiteWeg);S.zw=l.filter(p=>!ende.includes(p)&&!weg.includes(p));zurueck.forEach(p=>{zweiteHoch(p);txt.push(`${p.n} ist zu alt für die U23 und kehrt in den Profikader zurück.`);});
  if(weg.length)txt.push(`${weg.map(p=>p.n).join(', ')} ${weg.length>1?'sind':'ist'} zu alt für die U23 und ${weg.length>1?'gehen':'geht'} zu den Amateuren.`);
  if(autoB('zweitekader'))zweiteAutoHoch(S.zw);
  if(txt.length)news(txt.join(' '),neu<alt?'good':neu>alt?'bad':'');}
// Teil 2 (nach jugendSaison): mit Neuen auf 22 auffüllen, über 26 gehen die Schwächsten
function zweiteAuffuellen(){if(!hatZweite()||zweiteSim())return;const K=RZ.kader,l=zweiteKader(),neu=[];
  while(l.length<K.soll){const p=zweiteNeu(l);l.push(p);PIX.set(p.id,p);neu.push(p);}
  let raus=[];if(l.length>K.max){raus=l.filter(p=>!p.zwP).sort((a,b)=>a.str-b.str).slice(0,l.length-K.max);raus.forEach(zweiteWeg);S.zw=l.filter(p=>!raus.includes(p));}
  if(neu.length||raus.length)news(`Zweite Mannschaft (${zweiteLigaName()}): ${neu.length?`${neu.length} Neue aus der Region (Stärke ${Math.min(...neu.map(p=>Math.round(p.str)))} bis ${Math.max(...neu.map(p=>Math.round(p.str)))})`:'keine Neuen'}${raus.length?`, ${raus.map(p=>p.n).join(', ')} ${raus.length>1?'müssen':'muss'} gehen, der Kader ist voll`:''}.`);}

// ---------- Geld ----------
// Verkauf aus der Zweiten ab 18: Ein Profiverein (Ausland, niedrigere Liga) zahlt die Hälfte des Marktwerts, du bleibst am Weiterverkauf beteiligt.
// Profivereine interessieren sich nur für Spieler ab der Stärke eines Drittliga-Kaderspielers, die übrigen gehen zu den Amateuren (kein Geld).
const zweitePreis=p=>{const V=RZ.verkauf,v=value(p)*V.faktor;return p.str>=V.abStaerke&&v>=RJ.verkauf.minWert?Math.round(v/RJ.verkauf.runden)*RJ.verkauf.runden:0;};
function zweiteVerkauf(p){const preis=zweitePreis(p);if(!preis||!istZweite(p))return 0;S.zw=S.zw.filter(x=>x!==p);zweiteWeg(p);money('Zweite: Abgänge',preis);
  S.jgAb=[...(S.jgAb||[]),{n:p.n,w:value(p),s:S.season}].slice(-RJ.verkauf.merken);
  news(`Verkauf aus der Zweiten: ${p.n} (${p.pos}, ${p.age}) wechselt für ${fmt(preis)}. Bei einem Weiterverkauf bist du mit ${Math.round(RJ.verkauf.anteil*100)} % beteiligt.`,'tr');return preis;}

// ---------- Anzeige ----------
function zweiteKarte(){if(!hatZweite())return`<div class="card"><h2>Zweite Mannschaft</h2><p class="dim">${esc(myT().name)} hat keine zweite Mannschaft, die im Spiel vorkommt (wie Leverkusen, Leipzig oder Union, oder sie spielt unterhalb der Oberliga). Wer aus der Jugend mit ${RJ.aufruecken.spaetestens} nicht aufrückt, verlässt den Verein.</p></div>`;
  const sim=zweiteSim(),A=RZ.aufruecken;
  if(sim){const l=squad(sim.id).slice().sort((a,b)=>a.age-b.age||b.str-a.str);
    return`<div class="card"><h2>Zweite Mannschaft: ${esc(sim.name)}</h2><p>Sie spielt in der 3. Liga (Platz ${rank(3,sim.id)}) als eigener Verein mit eigenem Kader und eigenen Finanzen. Stärke ${de(teamLevel(sim.id),1)}. Du kannst Spieler zu den Profis holen und Jugendspieler ab ${A.ausJugendAb} hinschicken.</p>
      <div class="tw"><table><thead><tr><th>Name</th><th>Pos</th><th class="num">Alter</th><th class="num">Stärke</th><th>Talent</th><th></th></tr></thead><tbody>${l.map(p=>`<tr class="click" onclick="openP(${p.id})"><td>${esc(p.n)}</td><td><span class="pos ${p.pos}">${p.fp||p.pos}</span></td><td class="num">${p.age}</td><td class="num">${Math.round(p.str)}</td><td>${stars(p)}</td><td><button onclick="event.stopPropagation();zweiteAufruecken(${p.id})"${lzAus('zweitekader')}>Zu den Profis</button></td></tr>`).join('')}</tbody></table></div>${lzHinweis('zweitekader')}
      <p class="dim">Steigt sie in die Regionalliga ab, bleiben die Spieler bis ${RZ.kader.bisAlter} Jahre als Amateurkader, mit Budget wie bei jeder Zweiten.</p></div>`;}
  const t=myT(),l=zweiteKader().slice().sort((a,b)=>b.str-a.str),L=zweiteL(),st=zweiteStaerke(),dk=zweiteDeckel(),stufe=zweiteStufe(),E=S.zwErg&&S.zwErg.v===S.my?S.zwErg:null;
  const zeile=p=>`<tr class="click" onclick="openP(${p.id})"><td>${esc(p.n)}${p.zwJ?' <span class="dim" title="aus deiner Jugend">(J)</span>':''}</td><td><span class="pos ${p.pos}">${p.fp||p.pos}</span></td><td class="num">${p.age}</td><td class="num">${Math.round(p.str)}</td><td>${stars(p)}</td>
    <td><button onclick="event.stopPropagation();zweiteAufruecken(${p.id})"${lzAus('zweitekader')}>Aufrücken</button></td><td class="num">${zweitePreis(p)?fmt(zweitePreis(p)):'<span class="dim">–</span>'}</td></tr>`;
  return`<div class="card"><h2>Zweite Mannschaft</h2><p><b>${esc(zweiteLigaName())}</b>${E?` · letzte Saison Platz ${E.platz} (${esc(E.name)})`:''}. ${l.length} Spieler bis ${RZ.kader.bisAlter} Jahre, keine eigenen Spiele im Spiel: Am Saisonende zählt ihre Stärke über die Saison.</p>
    <div class="rgs">${rgAnzeige({label:'Stärke der Zweiten',sub:`Schnitt der besten ${RP.niveauSpieler}. Ligaschnitt ${L.schnitt}, gewertet wird höchstens bis zum Deckel`,min:40,max:80,wert:Math.round(st*10)/10,dez:1,marker:[{v:Math.round(dk*10)/10,t:'Deckel'},{v:Math.round(teamLevel(S.my)),t:'Profis'}]})}</div>
    <div class="opts">${[1,2,3,4,5].map(k=>`<button class="opt ${stufe===k?'on':''}" onclick="setZweite(${k})"${lzAus('zweite')}><b>Stufe ${k}</b><span>${fmt(Math.round(RZ.stufe.kosten[k]*L.kosten))} pro Spieltag · Neue um ${de(L.schnitt+RZ.stufe.zugang[k],1)}</span></button>`).join('')}</div>${lzHinweis('zweite')}
    <p class="dim">Das Budget wirkt über die Neuen, die jeden Sommer kommen, und über das Training (Faktor ${de(zweiteTraining(),2)}). Bis sich der Kader umgeschlagen hat, dauert es drei bis vier Jahre. Deckel: nie stärker als ein gutes Team der Liga (${L.gut}) und immer mindestens ${RZ.deckel.profiAbstand} unter den Profis.</p>
    <div class="tw"><table><thead><tr><th>Name</th><th>Pos</th><th class="num">Alter</th><th class="num">Stärke</th><th>Talent</th><th></th><th class="num">Verkaufswert</th></tr></thead><tbody>${l.map(zeile).join('')}</tbody></table></div>${lzHinweis('zweitekader')}
    <p class="dim">Die ${RZ.kader.stamm} Stärksten spielen regelmäßig und sammeln Spielpraxis. Aufrücken mit Profivertrag über ${A.vertrag} Jahre zum halben üblichen Gehalt. Wer ${RZ.kader.bisAlter+1} wird, geht zu den Amateuren (kein Geld). Verkaufen kannst du ab ${RZ.verkauf.ab} Jahren (Spielerkarte), mit Beteiligung am Weiterverkauf. Profivereine zahlen nur für Spieler ab Stärke ${RZ.verkauf.abStaerke}. Jugendspieler schickst du ab ${A.ausJugendAb} aus dem Jugendkader hierher.</p></div>`;}
// Spielerkarte eines Spielers im Amateurkader
function openZ(p){const A=RZ.aufruecken,eig=eigenschaften(p).filter(k=>RP.eigenschaftenWirksam.includes(k)),RPe=RP.eigenschaften,preis=zweitePreis(p);
  ov(`<div class="phead"><span class="pos ${p.pos}">${p.pos}</span><h2>${esc(p.n)}</h2><button class="x" onclick="closeOv()" aria-label="Schließen">✕</button></div>
  <div class="facts">${fact('Verein',esc(myT().name)+' II')}${fact('Liga',esc(zweiteLigaName()))}${fact('Nationalität',esc(natName(p)))}${fact('Alter',p.age)}${fact('Talent',stars(p))}${fact('Position',esc(RP.positionsNamen[p.fp]||p.pos))}${fact('Starker Fuß',p.fuss==='L'?'links':'rechts')}</div>
  <div class="card rgs">${rgAnzeige({label:'Stärke',sub:'1–99, Schraffur: Talent',min:1,max:99,wert:Math.round(p.str),talent:talentBand(p),marker:[{v:teamLevel(S.my),t:'Ø Profis '+Math.round(teamLevel(S.my))}]})}</div>
  <div class="grid"><div class="card"><h3>Profil</h3><p><b>Eigenschaften:</b> ${eig.length?eig.map(k=>`<span title="${esc(RPe[k].text||'')}">${esc(RPe[k].name)}</span>`).join(', '):'nichts Auffälliges'}</p>
    <p class="dim">${p.zwJ?'Aus deiner Jugend. ':''}${zweiteKader().slice().sort((a,b)=>b.str-a.str).indexOf(p)<RZ.kader.stamm?'Spielt regelmäßig in der Zweiten.':'Kommt in der Zweiten selten zum Einsatz.'}</p></div>
  <div class="card"><h3>Aufrücken</h3><p>Profivertrag über ${A.vertrag} Jahre, Gehalt ${fmt(Math.round(salaryFor(p.str)*A.gehalt/1000)*1000)} pro Jahr.</p><button class="go" onclick="zweiteAufruecken(${p.id})"${lzAus('zweitekader')}>In den Profikader holen</button>${lzHinweis('zweitekader')}
    ${p.age>=RZ.kader.bisAlter?`<p class="dim">Er wird im Sommer ${RZ.kader.bisAlter+1} und verlässt dann die Zweite.</p>`:''}</div>
  <div class="card"><h3>Verkaufen</h3>${p.age<RZ.verkauf.ab?`<p class="dim">Verkaufen geht ab ${RZ.verkauf.ab} Jahren.</p>`:preis?`<p>Ein Profiverein zahlt ${fmt(preis)}. Bei einem späteren Weiterverkauf bist du mit ${Math.round(RJ.verkauf.anteil*100)} % beteiligt.</p><button onclick="zweiteVerkaufen(${p.id})"${lzAus('zweitekader')}>Verkaufen</button>`:`<p class="dim">Kein Profiverein zahlt für ihn${p.str<RZ.verkauf.abStaerke?` (Profivereine interessieren sich ab Stärke ${RZ.verkauf.abStaerke})`:''}.</p>`}</div></div>`);}
