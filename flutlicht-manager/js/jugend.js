// Jugend und Talententwicklung (Konzept K08, U9c): Jugendkader deines Vereins, Jahrgang, Aufrücken, Prägungen, Belastung junger Spieler, Paten.
// Alle Zahlen stehen in daten/regeln.js unter REGELN.jugend (Kurzform RJ).
// Der Jugendkader (S.jg) gehört deinem Verein und spielt keine simulierten Spiele (K08 §12 Nr. 1). Seine Spieler stehen nicht in S.pl, die Spielerkarte kennt sie über PIX.
// Die Jugendarbeit wirkt als Langzeitprozess (deine Vorgabe vom 13.11.): Die Ausgaben setzen nur ein Ziel, das Jugendniveau folgt über viele Saisons.
// Computer-Vereine bekommen ihre Aufrücker weiter mit 17 über saison.nachwuchs. Prägungen gelten für alle Spieler bis 21 Jahre, bei Computer-Vereinen ohne den Umgang des Trainers.

const JUGEND_TEAM=-3; // Kennzeichen im Feld team: Spieler im Jugendkader
const JUGEND_ID0=500000; // eigener Nummernkreis, damit die Nummern der Ligaspieler unverändert bleiben (Auslandspool ab 1.000.000)
const istJugend=p=>!!p&&p.team===JUGEND_TEAM;

// ---------- Jugendtrainer (K16, K08 §5.1 und §5.2) ----------
// Beste Qualität im Verein, ohne Jugendtrainer der Wert „ohne“
const jugendTrainerQ=tid=>S.stab&&stabVon(tid,'jugend').length?stabQ(tid,'jugend'):RST.ohne;
// Kommt wie die Scouts mit eigenem Strom zum Stab dazu, damit der übrige Stab unverändert bleibt. Auch für Spielstände von vor U9c.
function jugendStabAufbau(){const A=RST.start,ab=A.rolleAbAnsehen.jugend||0;S.jgStab=1;
  S.teams.forEach(t=>{if(aktiv(t)&&t.rep>=ab)S.stab.push(stabNeu('jugend',t.rep*A.qualitaetJeAnsehen+ri(A.streuung[0],A.streuung[1]),t.id,t.lg));});
  for(let i=0;i<RJ.stab.vereinslos;i++)S.stab.push(stabNeu('jugend',riA(A.vereinslosQ),-1,2));stabGeaendert();}

// ---------- Jugendkader ----------
// Stufe der Jugendarbeit: Solange der Verein sie führt (K36), die übliche Stufe der Computer-Vereine
const jugendStufe=()=>autoB('jugend')?RS.nachwuchs.computerStufe:myT().youth;
// Jugendniveau 0–100 (K08 §5.0): Startwert nach Ansehen. Die Stufe der Ausgaben setzt das Ziel, das Niveau folgt langsam: Aufbau höchstens 6 Punkte je Saison,
// Abbau schneller. Bis zum Leistungszentrum (K26) gilt ein fester Deckel.
function jugendNiveau(){const t=myT(),N=RJ.niveau;if(t.jn==null)t.jn=clamp(Math.round(N.start[0]+N.start[1]*t.rep),0,N.deckel);return t.jn;}
const jugendZiel=()=>Math.min(RJ.niveau.deckel,RJ.niveau.ziel[jugendStufe()]||0);
function jugendNiveauWoche(){const N=RJ.niveau,t=myT(),jn=jugendNiveau(),z=jugendZiel();t.jn=jn<z?Math.min(z,jn+N.aufbau/52):Math.max(z,jn-N.abbau/52);}
// Trainingsfaktor im Jugendkader (K08 §5.2): aus Jugendniveau und Qualität des Jugendtrainers
const jugendTraining=()=>{const T=RJ.training;return T.basis+T.jeNiveau*jugendNiveau()+T.jeTrainer*jugendTrainerQ(S.my);};
// Erwartetes Talent eines Jahrgangs ohne Zufall (K08 §5.1): Grundstärke des Vereins (wie bei den Aufrückern der Computer-Vereine), Jugendniveau, Jugendtrainer, Region
function jugendTalentMitte(){const J=RJ.jahrgang,N=RJ.niveau,t=myT();return grundStaerke(t.rep)-J.abschlag+(jugendNiveau()-N.mitte)*N.jeTalent+J.jeTrainer*jugendTrainerQ(S.my)+(t.fans>=J.regionAbFans?J.region:0);}
// Ein neuer 15-Jähriger. Deckel: Kein Talent liegt weiter als J.deckel über der Grundstärke des Vereins, die Jugend wird nicht überdurchschnittlich gut.
function jugendNeu(plus=0){const J=RJ.jahrgang,pot=clamp(Math.round(jugendTalentMitte()+riA(J.zufall)+plus),RT.staerkeMin+5,Math.min(99,Math.round(grundStaerke(myT().rep)+J.deckel)));
  S.jid=Math.max(S.jid||0,JUGEND_ID0);const p=mkPlayer({id:S.jid++,pos:pick(RS.nachwuchs.positionen),age:J.alter,str:clamp(pot-riA(J.abstand),RT.staerkeMin,99),pot,team:JUGEND_TEAM,ct:RS.nachwuchs.vertrag});p.sal=0;return p;}
// Entwicklung im Jugendkader: wie K03, aber Training statt Spielpraxis (Praxis und Form fest)
function jugendWachsen(p,tage){const T=RJ.training;p.trf=jugendTraining();p.sp=T.praxis;p.form=T.form;entwickeln(p,tage);}
// Erster Jugendkader: vier Jahrgänge, die Älteren schon gewachsen und ausgedünnt
function jugendAufbau(){const S0=RJ.start,J=RJ.jahrgang;(S.jg||[]).forEach(p=>PIX.delete(p.id));S.jg=[];S.jgV=S.my;
  S0.alter.forEach((a,i)=>{const n=Math.max(1,Math.round(riA(J.anzahl)*S0.bleiben[i]));
    for(let k=0;k<n;k++){const p=jugendNeu();for(let y=J.alter;y<a;y++){for(let q=0;q<4;q++)jugendWachsen(p,RP.entwicklung.tageProSaison/4);p.age++;}eigenschaftenNeu(p);S.jg.push(p);PIX.set(p.id,p);}});}
// Der Jugendkader deines Vereins. Entsteht beim ersten Zugriff und nach einem Vereinswechsel neu, mit eigenem Zufallsstrom.
function jugendKader(){if(!S.jg||S.jgV!==S.my){if(S.stab&&!S.jgStab)mitStrom(strom('jugendstab'),jugendStabAufbau);mitStrom(strom('jugend',S.season,S.my),jugendAufbau);}return S.jg;}
// Woche: Entwicklung, dazu im Frühjahr die Erinnerung, wer im Sommer 19 wird
function jugendWoche(d){const A=RJ.aufruecken,l=jugendKader();jugendNiveauWoche();l.forEach(p=>jugendWachsen(p,7));
  if(S.phase==='play'&&d>=S.plan.ende-A.erinnerungTage&&S.jgErin!==S.season&&!autoB('jugendkader')){S.jgErin=S.season;const alt=l.filter(p=>p.age>=A.spaetestens-1);
    if(alt.length)news(`Jugend: ${alt.map(p=>`${p.n} (${p.pos}, ${Math.round(p.str)})`).join(', ')} ${alt.length>1?'werden':'wird'} im Sommer ${A.spaetestens}. Wer bis zum 1. Juli nicht in den Profikader aufrückt, verlässt den Verein (Training & Jugend).`);}}
// In den Profikader: Profivertrag über drei Jahre mit kleinem Gehalt, Rolle „Talent“ kommt mit der nächsten Woche (K14)
function jugendHoch(p){const N=RS.nachwuchs;S.jg=S.jg.filter(x=>x!==p);p.team=S.my;p.ct=N.vertrag;p.sal=Math.round(salaryFor(p.str)*N.gehalt/1000)*1000;p.sp=RP.startSpielpraxis;p.wiv=0;p.ppk=0;delete p.trf;delete p.ent;
  S.pl.push(p);PIX.set(p.id,p);kabineInit(p);rollenBerechnen(S.my);p.ea=erwartungEinsatz(p);return p;}
// Geld für Abgänge (deine Vorgabe vom 13.11.): Auch wer bei dir kein Profi wird, bringt Geld, wenn ein Profiverein ihn nimmt (Ausland, niedrigere Liga).
// Preis beim Verkauf aus der Jugend: Anteil am Marktwert, weil er noch nichts gezeigt hat. Unter dem Mindestwert interessiert sich kein Profiverein, dann bleiben nur Amateure (kein Geld).
const jugendPreis=p=>{const V=RJ.verkauf,v=value(p)*V.faktor;return v>=V.minWert?Math.round(v/V.runden)*V.runden:0;};
// Abgang buchen: Geld, dazu eine Beteiligung am Weiterverkauf für einige Jahre. Der Spieler verlässt die simulierte Welt (Ausland, untere Ligen, Amateure).
function jugendAbgang(p,betrag){S.jg=S.jg.filter(x=>x!==p);PIX.delete(p.id);if(betrag>0){money('Jugend: Abgänge',betrag);S.jgAb=[...(S.jgAb||[]),{n:p.n,w:value(p),s:S.season}].slice(-RJ.verkauf.merken);}return betrag;}
// Verkauf direkt aus der Jugend (ab 16 Jahren)
function jugendVerkauf(p){const preis=jugendPreis(p);if(!preis)return 0;jugendAbgang(p,preis);news(`Verkauf aus der Jugend: ${p.n} (${p.pos}, ${p.age}) wechselt für ${fmt(preis)}. Bei einem Weiterverkauf bist du mit ${Math.round(RJ.verkauf.anteil*100)} % beteiligt.`,'tr');return preis;}
// Weiterverkauf früherer Jugendspieler (1. Juli): mit kleiner Chance je Jahr, dann fließt deine Beteiligung
function jugendWeiterverkauf(){const V=RJ.verkauf;S.jgAb=(S.jgAb||[]).filter(a=>{if(S.season-a.s>=V.jahre)return false;if(R()>=V.weiterChance)return true;
    const abl=Math.round(a.w*(V.weiterFaktor[0]+R()*(V.weiterFaktor[1]-V.weiterFaktor[0]))/V.runden)*V.runden,teil=Math.round(abl*V.anteil/1000)*1000;if(teil>0){money('Jugend: Abgänge',teil);news(`Weiterverkauf: Dein früherer Jugendspieler ${a.n} wechselt für ${fmt(abl)}. Deine Beteiligung: ${fmt(teil)}.`,'good');}return false;});}
// 1. Juli: alle ein Jahr älter, Automatik (K36) holt die zwei Besten ab 17 hoch, 19-Jährige gehen, ein neuer Jahrgang kommt. Paten wirken auf die Professionalität.
function jugendSaison(){const A=RJ.aufruecken,J=RJ.jahrgang,P=RJ.pate,l=jugendKader();l.forEach(p=>{p.age++;eigenschaftenNeu(p);});
  squad(S.my).forEach(p=>{if(p.pate==null)return;if(!pateVon(p)||p.age>P.bisAlter){delete p.pate;return;}if(p.ch&&p.ch.pro<20&&R()<P.profi){p.ch.pro++;eigenschaftenNeu(p);news(`${p.n} hat sich von seinem Paten ${PIX.get(p.pate).n} viel abgeschaut: Er arbeitet professioneller.`,'good');}});
  if(autoB('jugendkader'))l.filter(p=>p.age>=A.ab).sort((a,b)=>b.str-a.str).slice(0,A.auto).forEach(p=>{jugendHoch(p);stabMeldung(`Aus der Jugend: Der Verein hat ${p.n} (${p.pos}, ${p.age}) in den Profikader geholt. Talent ${stars(p)}.`,'good');});
  // Mit 19 ist Schluss. Wen ein Profiverein nimmt, der bringt eine Ausbildungsentschädigung, die anderen gehen zu den Amateuren (kein Geld).
  const weg=S.jg.filter(p=>p.age>=A.spaetestens),zahlt=weg.map(p=>[p,jugendAbgang(p,Math.round(jugendPreis(p)*RJ.verkauf.mit19/RJ.verkauf.runden)*RJ.verkauf.runden)]),geld=zahlt.reduce((a,x)=>a+x[1],0);
  if(weg.length)news(`Jugend: ${weg.map(p=>p.n).join(', ')} ${weg.length>1?'sind':'ist'} zu alt für die U19 und ${weg.length>1?'verlassen':'verlässt'} den Verein.${geld?` Ausbildungsentschädigung von Profivereinen: ${fmt(geld)} (${zahlt.filter(x=>x[1]).map(x=>x[0].n).join(', ')}).`:' Keiner ging zu einem Profiverein, es gibt kein Geld.'}`);
  jugendWeiterverkauf();
  const gold=R()<J.gold.chance,n=riA(J.anzahl),neu=[];for(let i=0;i<n;i++){const p=jugendNeu(gold?J.gold.plus:0);eigenschaftenNeu(p);S.jg.push(p);PIX.set(p.id,p);neu.push(p);}
  neu.sort((a,b)=>b.pot-a.pot);
  news(`${gold?'Goldener Jahrgang! ':''}Neuer Jahrgang in der Jugend: ${n} Fünfzehnjährige. Am auffälligsten: ${neu.slice(0,2).map(p=>`${p.n} (${p.pos}, Talent ${stars(p)})`).join(' und ')}.${gold?' Der Jugendleiter spricht vom besten Jahrgang seit Langem.':''}`,gold?'good':'');}

// ---------- Paten (K08 §5.2): Ein Mentor im Profikader betreut ein Talent ----------
const mentoren=()=>squad(S.my).filter(p=>hatEig(p,'mentor'));
const pateVon=p=>{const m=p.pate!=null?PIX.get(p.pate):null;return m&&m.team===p.team&&hatEig(m,'mentor')?m:null;};
const patenkinder=m=>squad(m.team).filter(p=>p.pate===m.id);
const istPate=m=>m.team===S.my&&hatEig(m,'mentor')&&patenkinder(m).length>0;
// Faktoren für die Entwicklung (js/spieler.js): Pate ×1,1, Schub ×1,3 oder Knacks ×0,5 für einige Monate
const jugendTempo=p=>(p.pate!=null&&pateVon(p)?RJ.pate.wachstum:1)*(p.pt&&absTag(S.tag)<=p.pt[1]?p.pt[0]:1);

// ---------- Belastung junger Spieler (K08 §5.4): Minutenanteil plus Druckspiele gegen eine Grenze nach Alter ----------
function belastungJung(p){const B=RJ.belastung,g=B.grenze.find(x=>p.age<=x[0]);if(!g||p.team<0)return null;const heute=absTag(S.tag),ds=(p.ds||[]).filter(x=>x>heute-B.tage).length;
  return{wert:(p.ea||0)+B.druck*ds,grenze:g[1],druckspiele:ds};}
const ueberBelastung=p=>{const b=belastungJung(p);return !!b&&b.wert>b.grenze;};

// ---------- Prägungen (K08 §5.3): Schub oder Knacks nach besonderen Spielen, bis 21 Jahre ----------
const PRAEGUNG_NAME={debuet:'sein Debüt',topspiel:'sein erstes Topspiel von Beginn an',tor:'sein entscheidendes Tor',fehler:'seinen entscheidenden Fehler'};
const PRAEGUNG_SEIT={debuet:'seinem Debüt',topspiel:'seinem ersten Topspiel von Beginn an',tor:'seinem entscheidenden Tor',fehler:'seinem entscheidenden Fehler'};
// Siegtor (Führung zum Endstand mit einem Tor Unterschied) oder Ausgleich in der Schlussphase
function entscheidendesTor(r,s,pid){const tore=(r.ev||[]).filter(e=>e.t==='G');if(!tore.length)return false;const gf=s?r.ag:r.hg,ga=s?r.hg:r.ag;
  let a=0,b=0,fuehr=null;tore.forEach(e=>{const vor=a-b;if(e.s===s)a++;else b++;if(e.s===s&&vor===0)fuehr=e;if(e.s!==s&&a-b<=0)fuehr=null;});
  if(gf-ga===1&&fuehr&&fuehr.p===pid)return true;const letzt=tore[tore.length-1];return gf===ga&&letzt.s===s&&letzt.p===pid&&letzt.m>=RJ.praegung.spaetAb;}
// Platzverweis, verschossener Elfmeter bei Niederlage oder Remis, Torwartpatzer vor einem Gegentor ohne Sieg
function entscheidenderFehler(r,s,p){const gf=s?r.ag:r.hg,ga=s?r.hg:r.ag,ohneSieg=r.pen?winner(r)!==(s?r.a:r.h):gf<=ga;if((r.off||[]).includes(p.id))return true;if(!ohneSieg)return false;
  if((r.sz||[]).some(x=>x[0]===p.id&&x[1]==='elfmeter'&&x[2]===0))return true;if((r.ev||[]).some(e=>e.t==='E'&&e.p===p.id&&!e.tor))return true;
  return p.pos==='TW'&&(r.ev||[]).some(e=>e.t==='G'&&e.s!==s&&e.art==='patzer')&&(r.xi[s]||[]).includes(p.id);}
// Nach jedem Pflichtspiel, nach den Noten und der Einsatzzeit: Anlässe sammeln, Chancen rechnen. Bei deinen Spielern bleibt die Prägung drei Tage offen (dein Umgang zählt).
function praegungNachSpiel(list,d=S.tag){const P=RJ.praegung,tabs={},heute=absTag(d);
  list.forEach(r=>{[0,1].forEach(s=>{const tid=s?r.a:r.h,geg=s?r.h:r.a,t=S.teams[tid];if(tid>=1000||!t)return;
    const jung=r.xpo[s].map(x=>[PIX.get(x[0]),x[3]==null?90:x[3]]).filter(([p])=>p&&p.age<=P.bisAlter&&p.team===tid);if(!jung.length)return;
    const gf=s?r.ag:r.hg,ga=s?r.hg:r.ag,sieg=r.pen?winner(r)===tid:gf>ga,niederlage=r.pen?winner(r)!==tid:gf<ga,xi=new Set(r.xi[s]||[]);
    let top=!!r.rel||!!r.supercup||(!!r.cup&&S.cup&&S.cup.hist.length>=P.topAbRunde);
    if(!top&&r.lg&&geg<1000&&S.res&&S.res[r.lg]){const tab=tabs[r.lg]||(tabs[r.lg]=table(r.lg)),i=tab.findIndex(x=>x.id===geg);top=tab.length>0&&tab[0].sp>=P.topAbSpieltag&&i>=0&&i<P.topPlaetze;}
    jung.forEach(([p,min])=>{const an=[];if(top&&min>=45)p.ds=[...(p.ds||[]).filter(x=>x>heute-RJ.belastung.tage),heute];
      if(p.ppk===1)an.push('debuet');if(top&&xi.has(p.id)&&!p.prT){p.prT=1;an.push('topspiel');}
      if(entscheidendesTor(r,s,p.id))an.push('tor');if(entscheidenderFehler(r,s,p))an.push('fehler');if(!an.length)return;
      let ps=1,pk=1;an.forEach(a=>{ps*=1-P[a][0];pk*=1-P[a][1];});ps=(1-ps)*P.faktor;pk=(1-pk)*P.faktor;
      const dru=p.ch?p.ch.dru:10,note=r.nt&&r.nt[p.id]!=null?r.nt[p.id]:null,erw=r.ne&&r.ne[p.id]!=null?r.ne[p.id]:null;
      ps*=P.druck.schub[0]+P.druck.schub[1]*dru;pk*=P.druck.knacks[0]+P.druck.knacks[1]*dru;
      if(note!=null&&erw!=null){const dn=erw-note;if(dn>0)ps*=Math.pow(P.note,dn);else pk*=Math.pow(P.note,-dn);}
      if(sieg)ps*=P.sieg;if(niederlage)pk*=P.niederlage;if(ueberBelastung(p))pk*=P.belastung;
      if(S.stab&&stabVon(tid,'psycho').length)pk*=Math.max(0,1+P.psychologe*stabQ(tid,'psycho'));
      const o={an,s:ps,k:pk,gut:an.includes('fehler')?false:note!=null&&erw!=null?note<=erw:!niederlage};
      if(tid===S.my){p.prO=Object.assign(o,{bis:heute+P.umgang.tage});
        news(`${p.n} (${p.age}) hat ${an.map(a=>PRAEGUNG_NAME[a]).join(' und ')} hinter sich. Solche Spiele können einen jungen Spieler prägen. Wie du in den nächsten ${P.umgang.tage} Tagen mit ihm umgehst, zählt: ${o.gut?'Lob kann einen Schub auslösen.':'Nimm ihm den Druck (Gespräch „Druck nehmen“), Kritik macht es schlimmer.'}`);}
      else praegungAufloesen(p,o);});});});}
// Auflösen: dein Umgang verschiebt die Chancen (loben nach gutem Spiel, Druck nehmen nach schlechtem, Kritik schadet)
function praegungAufloesen(p,o){const U=RJ.praegung.umgang;let ps=o.s,pk=o.k;if(o.um==='lob'&&o.gut)ps*=U.loben;if(o.um==='schuetzen'&&!o.gut)pk*=U.schuetzen;if(o.um==='kritik')pk*=U.kritik;ps=Math.min(ps,0.95);pk=Math.min(pk,0.95-ps);
  return mitStrom(strom('praegung',S.season,S.tag,p.id),()=>{const x=R();return x<ps?praegungFolge(p,'schub',o.an):x<ps+pk?praegungFolge(p,'knacks',o.an):null;});}
// Folgen (K08 §5.3): Talent, Tempo der Entwicklung für einige Monate, Selbstvertrauen, Stimmung, Meldung
function praegungFolge(p,art,an){const F=RJ.praegung[art],schub=art==='schub',heute=absTag(S.tag),t=S.teams[p.team];let dt=0;
  if(R()<F.talent[0]){dt=ri(F.talent[1],F.talent[2])*(schub?1:-1);const alt=p.pot;p.pot=clamp(p.pot+dt,Math.round(p.str),99);dt=p.pot-alt;}
  p.pt=[F.tempo,heute+(Array.isArray(F.tage)?riA(F.tage):F.tage)];svAendern(p,F.sv);stimmungAendern(p,F.stimmung);
  p.pr=[...(p.pr||[]),[S.season,schub?1:-1,an[0]]].slice(-RJ.praegung.verlauf);if(t){t.kst=t.kst||{ww3:0};t.kst.pr=(t.kst.pr||0)+1;}
  if(p.team===S.my)news(schub?`Durchbruch: ${p.n} (${p.age}) ist seit ${PRAEGUNG_SEIT[an[0]]} wie verwandelt. Er entwickelt sich in den nächsten Monaten schneller.${dt>0?' Der Co-Trainer traut ihm jetzt mehr zu.':''}`
    :`Der Co-Trainer meldet: ${p.n} (${p.age}) hat ${PRAEGUNG_NAME[an[0]]} nicht verkraftet. Er wirkt verunsichert und entwickelt sich vorerst langsamer.${dt<0?' Der Knacks sitzt tief.':''} Ein Gespräch kann helfen.`,schub?'good':'bad');
  return art;}
// Täglich: offene Prägungen deiner Spieler nach drei Tagen auflösen
function praegungTag(d){const heute=absTag(d);S.pl.forEach(p=>{if(!p.prO)return;if(p.team!==S.my){delete p.prO;return;}if(heute>=p.prO.bis){const o=p.prO;delete p.prO;praegungAufloesen(p,o);}});}
// Dein Umgang (K15): das Gespräch in den drei Tagen danach
function praegungUmgang(p,thema){if(p.prO&&['lob','kritik','schuetzen'].includes(thema))p.prO.um=thema;}

// ---------- Anzeige ----------
// Karte „Jugendarbeit“: Ausgaben als Stufe, Jugendniveau als Regler mit Ziel und Deckel
function jugendArbeitKarte(){const t=myT(),N=RJ.niveau,jn=jugendNiveau(),z=jugendZiel();
  return`<div class="card"><h2>Jugendarbeit</h2><div class="rgs">${rgAnzeige({label:'Jugendniveau',sub:'0–100: bestimmt das Talent der Jahrgänge und das Tempo im Jugendkader',min:0,max:100,wert:Math.round(jn),marker:[{v:z,t:'Ziel'},{v:N.deckel,t:'Deckel'}]})}</div>
    <p>Die Ausgaben setzen das Ziel, das Niveau folgt langsam: höchstens +${N.aufbau} Punkte pro Saison nach oben, bis zu −${N.abbau} nach unten. Gute Jugendarbeit ist eine Sache von vielen Jahren.</p>
    <div class="opts">${[1,2,3,4,5].map(l=>`<button class="opt ${t.youth===l?'on':''}" onclick="setJugend(${l})"${lzAus('jugend')}><b>Stufe ${l}</b><span>${fmt(RF.jugendKosten[l])} pro Spieltag · Ziel ${Math.min(N.deckel,N.ziel[l])}</span></button>`).join('')}</div>${lzHinweis('jugend')}
    <p class="dim">Deckel ${N.deckel}: Mehr geht erst mit einem Leistungszentrum (kommt mit dem Ausbau der Infrastruktur). Stufen mit einem Ziel über dem Deckel bringen bis dahin nicht mehr.</p></div>`;}
// Karte im Reiter „Training & Jugend“
function jugendKarte(){const A=RJ.aufruecken,l=jugendKader().slice().sort((a,b)=>b.age-a.age||b.str-a.str),hat=S.stab&&stabVon(S.my,'jugend').length;
  const zeile=p=>`<tr class="click" onclick="openP(${p.id})"><td>${esc(p.n)}</td><td><span class="pos ${p.pos}">${p.fp||p.pos}</span></td><td class="num">${p.age}</td><td class="num">${Math.round(p.str)}</td><td>${stars(p)}</td>
    <td>${p.age>=A.ab?`<button onclick="event.stopPropagation();jugendAufruecken(${p.id})"${lzAus('jugendkader')}>Aufrücken</button>`:''}${p.age>=A.spaetestens-1?' <span class="tag warn">wird im Sommer 19</span>':''}</td><td class="num">${jugendPreis(p)?fmt(jugendPreis(p)):'<span class="dim">–</span>'}</td></tr>`;
  return`<div class="card"><h2>Jugendkader</h2><p>${l.length} Spieler von 15 bis 18 Jahren. Sie spielen keine Pflichtspiele und entwickeln sich im Training (Faktor ${de(jugendTraining(),2)} aus Jugendarbeit und Jugendtrainer).</p>
    <div class="tw"><table><thead><tr><th>Name</th><th>Pos</th><th class="num">Alter</th><th class="num">Stärke</th><th>Talent</th><th></th><th class="num">Verkaufswert</th></tr></thead><tbody>${l.map(zeile).join('')}</tbody></table></div>${lzHinweis('jugendkader')}
    <p class="dim">Aufrücken ab ${A.ab} Jahren: Profivertrag über ${RS.nachwuchs.vertrag} Jahre. Wer am 1. Juli ${A.spaetestens} wird und nicht aufgerückt ist, verlässt den Verein. Nimmt ihn ein Profiverein, bekommst du eine Ausbildungsentschädigung, bei Amateuren nichts. Verkaufen kannst du ab ${RJ.verkauf.ab} Jahren auch vorher (Spielerkarte), mit Beteiligung am Weiterverkauf. Jeden Sommer kommt ein neuer Jahrgang mit ${RJ.jahrgang.anzahl[0]} bis ${RJ.jahrgang.anzahl[1]} Fünfzehnjährigen.
    Jugendtrainer: ${hat?`Qualität ${esc(stabQText(stabVon(S.my,'jugend').slice().sort((a,b)=>b.q-a.q)[0]))}`:'keiner (Stab)'}. Bessere Jugendarbeit und ein guter Jugendtrainer heben das Talent der Jahrgänge und das Tempo der Entwicklung.</p></div>`;}
// Spielerkarte eines Jugendspielers
function openJ(p){const A=RJ.aufruecken,eig=eigenschaften(p).filter(k=>RP.eigenschaftenWirksam.includes(k)),RPe=RP.eigenschaften;
  ov(`<div class="phead"><span class="pos ${p.pos}">${p.pos}</span><h2>${esc(p.n)}</h2><button class="x" onclick="closeOv()" aria-label="Schließen">✕</button></div>
  <div class="facts">${fact('Verein',esc(myT().name)+' (Jugend)')}${fact('Nationalität',esc(natName(p)))}${fact('Alter',p.age)}${fact('Talent',stars(p))}${fact('Position',esc(RP.positionsNamen[p.fp]||p.pos))}${fact('Starker Fuß',p.fuss==='L'?'links':'rechts')}</div>
  <div class="card rgs">${rgAnzeige({label:'Stärke',sub:'1–99, Schraffur: Talent',min:1,max:99,wert:Math.round(p.str),talent:talentBand(p),marker:[{v:teamLevel(S.my),t:'Ø Kader '+Math.round(teamLevel(S.my))}]})}</div>
  <div class="grid"><div class="card"><h3>Profil</h3><p><b>Eigenschaften:</b> ${eig.length?eig.map(k=>`<span title="${esc(RPe[k].text||'')}">${esc(RPe[k].name)}</span>`).join(', '):'nichts Auffälliges'}</p>
    <p class="dim">Im Jugendkader entwickelt er sich im Training. Wie gut er wird, weiß niemand genau.</p></div>
  <div class="card"><h3>Aufrücken</h3>${p.age>=A.ab?`<p>Profivertrag über ${RS.nachwuchs.vertrag} Jahre, Gehalt ${fmt(Math.round(salaryFor(p.str)*RS.nachwuchs.gehalt/1000)*1000)} pro Jahr.</p><button class="go" onclick="jugendAufruecken(${p.id})"${lzAus('jugendkader')}>In den Profikader holen</button>${lzHinweis('jugendkader')}`:`<p class="dim">Aufrücken geht ab ${A.ab} Jahren.</p>`}
    ${p.age>=A.spaetestens-1?`<p class="dim">Er wird im Sommer ${A.spaetestens}: Rückt er bis zum 1. Juli nicht auf, verlässt er den Verein.</p>`:''}</div>
  <div class="card"><h3>Verkaufen</h3>${p.age<RJ.verkauf.ab?`<p class="dim">Verkaufen geht ab ${RJ.verkauf.ab} Jahren.</p>`:jugendPreis(p)?`<p>Ein Profiverein zahlt ${fmt(jugendPreis(p))}. Bei einem späteren Weiterverkauf bist du mit ${Math.round(RJ.verkauf.anteil*100)} % beteiligt.</p><button onclick="jugendVerkaufen(${p.id})"${lzAus('jugendkader')}>Verkaufen</button>`:'<p class="dim">Kein Profiverein zahlt für ihn. Verlässt er den Verein, geht er zu den Amateuren.</p>'}</div></div>`);}
// Regler „Belastung“ auf der Spielerkarte deiner Spieler bis 21 Jahre
function belastungRegler(p){const b=belastungJung(p);if(!b||p.team!==S.my)return'';const max=1.5;
  return rgAnzeige({label:'Belastung (junger Spieler)',sub:`Anteil der Minuten${b.druckspiele?` plus ${b.druckspiele} Druckspiel${b.druckspiele>1?'e':''}`:''}. Über der Grenze drohen Knacks, Verletzung und Frust (K08)`,min:0,max,wert:Math.min(max,Math.round(b.wert*100)/100),dez:2,
    zonen:[{von:0,bis:b.grenze,art:'good',text:'im Rahmen'},{von:b.grenze,bis:max,art:'bad',text:'er wird verheizt'}],marker:[{v:b.grenze,t:'Grenze'}]});}
// Hinweise und Pate in der Karte „Stimmung und Gespräch“
function jugendHinweis(p){const P=RJ.praegung,Pa=RJ.pate;if(p.age>P.bisAlter||p.team!==S.my)return'';const l=[];
  if(p.prO)l.push(`<p><b>Prägendes Spiel:</b> ${esc(p.prO.an.map(a=>PRAEGUNG_NAME[a]).join(' und '))}. Dein Umgang bis ${esc(datumKurz(S.tag+Math.max(0,p.prO.bis-absTag(S.tag))))} zählt${p.prO.um?` (bisher: ${esc(THEMEN[p.prO.um])})`:''}.</p>`);
  if(p.pt&&absTag(S.tag)<=p.pt[1])l.push(`<p class="dim">${p.pt[0]>1?'Nach seinem Durchbruch entwickelt er sich gerade schneller.':'Nach einem Knacks entwickelt er sich gerade langsamer.'}</p>`);
  if((p.pr||[]).length)l.push(`<p class="dim">Prägungen: ${p.pr.map(x=>`${x[0]}/${(x[0]+1)%100} ${x[1]>0?'Schub':'Knacks'}`).join(', ')}</p>`);
  const ms=mentoren().filter(m=>m.id!==p.id),frei0=m=>patenkinder(m).filter(q=>q!==p).length<Pa.jeMentor;
  l.push(`<label>Pate <select id="patesel" onchange="setPate(${p.id},this.value)"${lzAus('pate')}><option value="">keiner</option>${ms.filter(m=>p.pate===m.id||frei0(m)).map(m=>`<option value="${m.id}" ${p.pate===m.id?'selected':''}>${esc(m.n)} (${m.age})</option>`).join('')}</select></label>${lzHinweis('pate')}
    <p class="dim">${ms.length?`Ein Mentor als Pate: Entwicklung ×${de(Pa.wachstum,1)}, mit der Zeit mehr Professionalität. Ein Mentor betreut höchstens ${Pa.jeMentor} Talente.`:'Im Kader ist kein Mentor (erfahrener, professioneller Spieler ab 29 Jahren).'}</p>`);
  return l.join('');}
