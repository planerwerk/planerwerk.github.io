// Welt: Spieler erzeugen, Welt bauen, Spielplan, Ziele, Sponsoren, Preise.
const rname=()=>pick(VORNAMEN)+' '+pick(NACHNAMEN);
const salaryFor=s=>{const g=RP.gehalt;return Math.round(g.basis*Math.exp(g.steigung*(s-g.mitte))/g.runden)*g.runden;};
function value(p){const m=RP.marktwert,s=p.age<m.jungUnter?p.str*m.staerkeAnteil+Math.max(p.str,p.pot)*m.talentAnteil:p.str;let v=m.basis*Math.exp(m.steigung*(s-m.mitte));const a=p.age,f=m.alter.find(x=>a<=x[0]);v*=f?f[1]:m.alterSonst;if(p.ww>=3)v*=RKA.wechsel.abloese;if(p.ehj!=null&&S.season-p.ehj<=1)v*=1+RSTAT.ehrung.marktwert;if(p.lspZ!=null&&lsAn()&&absTag(S.tag)-p.lspZ<=RWB.laenderspiele.marktwert.tage)v*=1+RWB.laenderspiele.marktwert.plus; /* Nationalspieler (K13h, nur mit Länderspielen) */return Math.max(m.minimum,Math.round(v/m.runden)*m.runden);} // offizieller Wechselwunsch: Ablöse −10 % (K14 §5.4)
function sternZahl(p){const d=p.pot-p.str,st=RP.sterne;return d>=st[0]?4:d>=st[1]?3:d>=st[2]?2:1;}
// Angezeigte Sterne mit Schätzfehler (K03): Das wahre Talent kennt niemand genau
function stars(p){const n=clamp(sternZahl(p)+sternFehler(p),1,4);return '★★★★'.slice(0,n)+'☆☆☆☆'.slice(n);}
const teamLevel=tid=>{const s=squad(tid).map(p=>p.str).sort((a,b)=>b-a).slice(0,RP.niveauSpieler);return s.length?s.reduce((a,b)=>a+b,0)/s.length:RP.niveauLeer;};
function askPrice(p){return forderung(p);} // Forderung des Vereins nach dem Vereinswert (K19 §5.1, U10a), mit dem Stand der Verhandlung
const extDemand=p=>{const g=RM.gehalt;return Math.round(salaryFor(p.str)*(g.basis+p.seed*g.zufall)*(p.age>=g.altAb?g.altFaktor:1)/1000)*1000;};
// Kreditrahmen, Startkonto und Werbung wachsen seit K23c mit e^(steigung × (Ansehen − mitte)), wie die Einnahmen der echten Vereine
const kreditRahmen=t=>{const K=RF.kreditRahmen;return Math.round(K.basis*Math.exp(K.steigung*(t.rep-K.mitte))/K.runden)*K.runden*(t.id===S.my?stufe().kredit:1);};
const startKonto=rep=>{const K=RW.konto;return Math.round(K.basis*Math.exp(K.steigung*(rep-K.mitte))/K.runden)*K.runden;};
// Grundbetrag der Werbung je Ligaspiel (K23c): Grundlage der Angebote für Brust, Ausrüster und Ärmel, der weiteren Partner und der Werbung der Computer-Vereine
const sponsorBasis=t=>{const P=RF.sponsor;return Math.round(P.basis*Math.exp(P.steigung*(t.rep-P.mitte))*(P.liga[t.lg]||P.liga[3]));}; // gerundet, damit Kontostände ganze Euro bleiben
// Schwierigkeit (K02 §5.4): Spielstände ohne Angabe gelten als „Normal“
const stufe=()=>REGELN.schwierigkeit.stufen[S.stufe]||REGELN.schwierigkeit.stufen[REGELN.schwierigkeit.standard];
function stufeAnwenden(k){S.stufe=REGELN.schwierigkeit.stufen[k]?k:REGELN.schwierigkeit.standard;const St=stufe(),t=myT();t.cash=Math.round(t.cash*St.konto);
  if(!St.erinnerungen){S.einst=S.einst||{aus:{}};S.einst.aus=S.einst.aus||{};Object.keys(RK.erinnerungen).forEach(e=>S.einst.aus[e]=1);}setTarget();}
// TV-Gelder (K23 §5.1, K23c): Säulenmodell, Saisonbetrag je Verein einmal je Saison und Ligazusammensetzung berechnet (S.tvS), ohne Zufall, ausgezahlt je Ligaspiel.
// Fünfjahreswertung: t.tvw = Punkte der letzten Saisons (jüngste zuerst, saison.js), t.tv0 = Startpunkte nach Liga und Ansehen für fehlende Saisons.
function tvPunkteStart(){const off={};let n=0;LIGEN.forEach(lg=>{off[lg]=n;n+=lgIds(lg).length;});
  LIGEN.forEach(lg=>S.teams.filter(t=>t.lg===lg).sort((a,b)=>b.rep-a.rep||a.id-b.id).forEach((t,i)=>{if(t.tv0==null)t.tv0=n-off[lg]-i;}));
  S.teams.forEach(t=>{if(t.tv0==null)t.tv0=0;});}
const tvWertung=t=>RF.tv.gewichte.reduce((s,w,i)=>s+w*(t.tvw&&t.tvw[i]!=null?t.tvw[i]:t.tv0||0),0);
function tvSaison(){const T=RF.tv,c=S.tvS;if(c&&c.s===S.season&&S.teams.every(t=>!aktiv(t)||c.lg[t.id]===t.lg))return c.v;
  if(S.teams.some(t=>t.tv0==null))tvPunkteStart();
  const v={},lg={};LIGEN.forEach(l=>{const L=S.teams.filter(t=>t.lg===l),n=L.length,topf=T.topf[l]||0;if(!n)return;
    if(l>=3){L.forEach(t=>{v[t.id]=Math.round(topf/n);lg[t.id]=l;});return;}
    let sw=0;for(let i=1;i<=n;i++)sw+=n+T.versatz-i;const sr=L.reduce((s,t)=>s+t.rep*t.rep,0)||1;
    L.slice().sort((a,b)=>tvWertung(b)-tvWertung(a)||b.rep-a.rep||a.id-b.id).forEach((t,i)=>{v[t.id]=Math.round(topf*(T.gleich/n+T.leistung*(n+T.versatz-(i+1))/sw+T.interesse*t.rep*t.rep/sr));lg[t.id]=l;});});
  S.tvS={s:S.season,v,lg};return v;}
const tvSaisonBetrag=t=>tvSaison()[t.id]||0;
const tvRang=t=>S.teams.filter(x=>x.lg===t.lg).sort((a,b)=>tvWertung(b)-tvWertung(a)||b.rep-a.rep||a.id-b.id).findIndex(x=>x.id===t.id)+1; // Platz in der Leistungssäule (Anzeige)
const tvGeld=t=>Math.round(tvSaisonBetrag(t)/((S.fx&&S.fx[t.lg]||[]).length||(t.lg===3?38:34)));
// Auszahlung (K23 §4, K23h): je Ligaspiel tvGeld, mit RF.tv.raten.an stattdessen vier Raten (tvRatenTag). tvGeld bleibt der Maßstab für Verwaltung und Prognosen.
const tvRatenAn=()=>!!(RF.tv.raten&&RF.tv.raten.an);
const tvJeSpiel=t=>tvRatenAn()?0:tvGeld(t);
// Täglich (ablauf.js taeglichLauf, nach finanzenTag): an den Ratentagen ein Viertel des Saisonbetrags an jeden aktiven Verein, ohne Zufall.
// Seit Prüfung FK3 bucht dein Verein sie unter „TV-Raten“. Das steht nicht in RFP.laufend, der Saldo je Ligaspiel bleibt also ohne TV (sonst zählte die Rate vom 1. August,
// die vor dem ersten Spiel kommt, in jedem Spiel mit). Prognosen setzen stattdessen die noch offenen Raten der Saison an (tvOffen). S.tvRT: Tag der letzten Rate.
function tvRatenTag(d){const R0=RF.tv.raten;if(!tvRatenAn()||!R0.tage.includes(mmtt(d)))return;let mein=0;S.tvRT=d;
  S.teams.forEach(t=>{if(!aktiv(t))return;const b=Math.round(tvSaisonBetrag(t)/R0.tage.length);if(!b)return;if(t.id===S.my){money('TV-Raten',b);mein=b;}else t.cash+=b;});
  if(mein)news(`TV-Gelder: Die ${R0.tage.indexOf(mmtt(d))+1}. Rate ist da, ${fmt(mein)} für deinen Verein.`,'');}
// Zahl der Ratentage ab heute (die heutige nur, wenn sie noch nicht gezahlt ist) bis zum Saisonende oder bis zum Tag bis; mit Schalter aus 0
function tvRatenOffen(bis){const R0=RF.tv.raten;if(!tvRatenAn())return 0;const ende=Math.min(bis!=null?bis:Infinity,S.plan?S.plan.ende:S.tag);let n=0;
  for(let d=S.tvRT===S.tag?S.tag+1:S.tag;d<=ende;d++)if(R0.tage.includes(mmtt(d)))n++;return n;}
const tvOffen=(t,bis)=>t?tvRatenOffen(bis)*Math.round(tvSaisonBetrag(t)/RF.tv.raten.tage.length):0;
// Die heute fällige, noch nicht gebuchte Rate (Prüfung FL2): Die Ratentage sind Monatserste, gebucht wird nach dem Monatsbericht; die Insolvenzprüfung davor zählt sie mit,
// sonst träfe sie jeden Verein am Tiefpunkt des Quartals. Mit Schalter aus 0.
const tvHeute=t=>tvRatenAn()&&!!t&&RF.tv.raten.tage.includes(mmtt(S.tag))&&S.tvRT!==S.tag?Math.round(tvSaisonBetrag(t)/RF.tv.raten.tage.length):0;
// Spielstände von vor K23c (ohne S.k23c): Gehälter einmal auf die neue Kurve umrechnen (gleiches Verhältnis zum Gehalt nach Stärke wie vorher), damit sich niemand
// plötzlich unterbezahlt fühlt (kabine.js). Kontostände, Verträge mit Sponsoren und Kredite bleiben, sie gleichen sich über die Saisons an. Aufruf nach dem Laden.
// Dazu vorgemerkte Wechsel (p.wech.sal) und deine Werbeverträge (Brust, Ausrüster, Ärmel: Betrag mal neuer durch alten Grundbetrag der Fläche, Prüfung CS4).
function k23cUmstellen(){if(!S||S.k23c)return;const A=RP.gehaltAlt,alt=s=>A.basis*Math.exp(A.steigung*(s-A.mitte)),um=(v,s)=>Math.max(1000,Math.round(v*salaryFor(s)/alt(s)/1000)*1000);
  const neu=p=>{if(!p)return;if(p.sal>0)p.sal=um(p.sal,p.str);if(p.wech&&p.wech.sal>0)p.wech.sal=um(p.wech.sal,p.str);};
  S.pl.forEach(neu);if(S.ausland)S.ausland.pl.forEach(neu);if(S.jg)S.jg.forEach(neu);if(S.zw)S.zw.forEach(neu);
  const t=S.teams&&S.teams[S.my],SA=RF.sponsorAlt;
  if(t&&SA){const sk=(v,f)=>{const a=t.rep*t.rep*(SA.liga[t.lg]||SA.liga[3])*(SA.anteil[f]||0);if(!v||!a)return;const q=sponsorBasis(t)*(RF.werbung.anteil[f]||0)/a;
      v.base=Math.round(v.base*q/1000)*1000;if(v.win)v.win=Math.round(v.win*q/1000)*1000;};
    if(S.spons)sk(S.spons,'brust');Object.entries(S.werbung||{}).forEach(([f,w])=>sk(w,f));}
  S.k23c=1;}
// Am Saisonende (saison.js): Punkte der Saison in die Fünfjahreswertung, Gesamtplatz aus Liga und Tabellenplatz (t.lastPos)
function tvWertungEintragen(){if(S.teams.some(t=>t.tv0==null))tvPunkteStart();const off={};let n=0;LIGEN.forEach(lg=>{off[lg]=n;n+=lgIds(lg).length;});
  S.teams.forEach(t=>{if(!aktiv(t)){if(t.tvw)t.tvw=[0].concat(t.tvw).slice(0,RF.tv.gewichte.length);return;} // Regionalliga: Saison mit 0 Punkten, damit ältere Saisons nachrücken
    if(!t.lastPos)return;t.tvw=[Math.max(0,n+1-(off[t.lg]+t.lastPos))].concat(t.tvw||[]).slice(0,RF.tv.gewichte.length);});}
const richtPreis=t=>RF.zuschauer.refBasis+t.rep*RF.zuschauer.refJeAnsehen;
// Talent als Band aus der Sterne-Stufe: zeigt dieselbe Auskunft wie die Sterne, nur als Regler
function talentBand(p){const s=Math.round(p.str),st=RP.sterne,n=clamp(sternZahl(p)+sternFehler(p),1,4);const[a,b]=n===4?[st[0],99]:n===3?[st[1],st[0]]:n===2?[st[2],st[1]]:[0,st[2]];return[Math.min(99,s+a),Math.min(99,s+b)];}
// Vorhersage für den Ticketpreis-Regler: Zuschauer je Ligaheimspiel als Spanne (schwächster bis stärkster Gegner, mit Tageszufall). Würfelt nicht.
// Preiswirkung auf die Zuschauer: (Richtpreis / Preis)^Exponent, begrenzt (wie attendance in ablauf.js, seit Prüfung DI1 auch für das Dach)
const preisFaktor=(t,preis)=>{const Z=RF.zuschauer,ref=Z.refBasis+t.rep*Z.refJeAnsehen;return clamp(Math.pow(ref/preis,Z.preisExponent),Z.preisMin,Z.preisMax);};
function zuschauerSpanne(t,preis){const Z=RF.zuschauer,pf=preisFaktor(t,preis),ff=Z.formBasis+Z.formJePunkt*formPts(t.id),lf=t.lg===1?1:t.lg===2?Z.liga2:Z.liga3; // 3. Liga mit liga3 wie attendance (DI3)
  const reps=S.teams.filter(x=>x.lg===t.lg&&x.id!==t.id).map(x=>x.rep),f=rep=>t.fans*pf*ff*(Z.gegnerBasis+rep/100*Z.gegnerFaktor)*lf*fanFaktor(t); // Fanstimmung (K27, U16)
  return[Math.round(Math.min(t.cap,f(Math.min(...reps))*Z.zufallBasis)),Math.round(Math.min(t.cap,f(Math.max(...reps))*(Z.zufallBasis+Z.zufallSpanne)))];}

function mkPlayer(o){const age=o.age,str=o.str,T=RP.talent;const p={id:o.id!=null?o.id:S.pid++,n:o.n||rname(),pos:o.pos,age,str,pot:o.pot||Math.round(str+riA((T.find(x=>age<=x[0])||[0,RP.talentSonst])[1])),form:RP.startForm,fit:riA(RP.startFitness),ko:riA(RP.startKondition),sv:0,sp:RP.startSpielpraxis,ent:S.tag,sw:Math.round(str),team:o.team,inj:0,sperre:{liga:{rot:0,gelb:0},pokal:{rot:0,gelb:0}},kt:{liga:0,pokal:0},g:0,pg:0,apps:0,ct:o.ct||riA(RP.vertrag),list:0,ask:0,seed:R()};p.sal=salaryFor(p.str);if(o.fp)p.fp=o.fp;spielerStart(p);p.nat=o.nat||natAusName(p);return p;} // Nationalität (K03): echte Spieler aus den Daten, erfundene aus dem Nachnamen. o.fp: feine Position vorgegeben (Kaderplan, K31)
const lgIds=lg=>S.teams.filter(t=>t.lg===lg).map(t=>t.id);
const grundStaerke=rep=>RW.grund.basis+rep*RW.grund.jeAnsehen;
function buildWorld(seed){const W=RW;
  S={v:REGELN.spielstand.version,seed:seed>>>0,zufall:zufallStart(seed),pid:1,season:W.startSaison,tag:0,gespielt:-1,plan:null,relSp:[],relSp2:[],einst:{aus:{}},my:0,mgr:'',teams:[],pl:[],am:[],news:[],offers:[],fin:{},loan:0,trust:W.startVertrauen,train:W.startTraining,target:W.startZiel,hist:[],phase:'play',lineup:[],spons:null,sponsOffers:null,constr:null,res:{1:[],2:[],3:[]},att:[0,0],fired:0,k23c:1};
  S.plan=planFuer(S.season);S.tag=S.plan.start;
  S.am=AMATEURE.map(n=>({name:n,str:riA(W.amateurStaerke)}));
  PIX=new Map();
  VEREINE.forEach((c,i)=>{
    const t={id:i,name:c.name,sh:c.kurz,lg:c.liga,region:c.region,zweite:c.zweite?VEREINE.findIndex(v=>v.kurz===c.zweite):-1,ewig3:c.ewig3||0,abstieg3:c.abstieg3||0,rep:c.ansehen,cap:c.plaetze,fans:c.fans,mitglieder:c.mitglieder!=null?c.mitglieder:Math.round(c.fans*RFP.mitglieder.ausFans),col:c.farbe,cash:startKonto(c.ansehen),form:pick(W.startFormationen),tac:'N',ein:'N',price:Math.round(W.ticket.basis+c.ansehen*W.ticket.jeAnsehen),logen:0,shop:0,youth:W.startJugend,expPos:W.startZiel,lastPos:W.startZiel};
    S.teams.push(t);if(c.liga>3)return;
    const real=KADER[c.kurz]||[], base=grundStaerke(c.ansehen), quota=real.length>=W.kaderVollAb?W.sollVoll:W.sollDuenn, st=W.stammplaetze, have={TW:0,AB:0,MF:0,ST:0};
    real.forEach(([n,pos,age,str,nat])=>{const p=mkPlayer({n,pos,age,str,team:i,nat});if(age<=W.jungeEchte.bisAlter)p.pot=str+riA(W.jungeEchte.talent);addP(p);have[pos]++;});
    for(const pos in quota)for(let k=have[pos];k<quota[pos];k++){const starter=k<st[pos];addP(mkPlayer({pos,age:riA(W.ersatzAlter),str:Math.round(starter?base+riA(W.stammStreuung):base-W.ersatzAbschlag+riA(W.ersatzStreuung)),team:i}));}
    const N=W.nachwuchs;if(real.length<N.wennUnter)for(let k=0;k<N.anzahl;k++){const p=mkPlayer({pos:pick(N.positionen),age:riA(N.alter),str:Math.round(base-N.abschlag+riA(N.streuung)),team:i});p.pot=Math.round(base+riA(N.talent));addP(p);}
  });
  const V=W.vereinslose;for(let k=0;k<V.anzahl;k++)addP(mkPlayer({pos:pick(V.positionen),age:riA(V.alter),str:riA(V.staerke),team:-1}));
  const sp=spielplanFuer(S.season);S.fx=sp.fx;S.plan.zeit=sp.zeit;initCup();
  mitStrom(strom('profil'),()=>S.teams.forEach(t=>{t.stil=profilStil();})); // Lieblingsstil jedes Vereins (K06 §7, bis K31)
  mitStrom(strom('vereinsprofil'),profileAufbau); // zweites Vereinsprofil (K31 §3.2, U11b), eigener Strom
  S.teams.forEach(t=>{t.urlaubFertig=true;});S.pl.forEach(p=>{p.koVor=p.ko;if(p.team>=0&&p.de==null&&deutschVon(p)<100)p.de=deutschVon(p);}); /* Deutsch der Startkader schon jetzt (Prüfung FL4), ohne Zufall */
  mitStrom(strom('stab'),stabAufbau);mitStrom(strom('scouts'),scoutsAufbau);mitStrom(strom('jugendstab'),jugendStabAufbau);kabineStart();mitStrom(strom('ausland'),auslandAufbau); // Auslandspool zuletzt und mit eigenem Strom (K32 §3.1)
  europaAnlegen(null); // Europapokal mit den echten Startern 2026/27 (K37, U19a), eigener Strom
  tvSaison(); // TV-Gelder der ersten Saison (K23c), ohne Zufall
  // Trainerstab nach Ansehen (K16), Kabine mit Rollen, Kapitän und Startstimmung (K14) // Start Anfang Juli: Urlaub vorbei, Laufplan bis zum Trainingsauftakt (K12a)
}
// Neuer Kader für einen Verein, der aus der Regionalliga aufsteigt (alles erfundene Spieler)
function kaderErzeugen(t){const W=RW,base=grundStaerke(t.rep),st=W.stammplaetze;
  for(const pos in W.sollDuenn)for(let k=0;k<W.sollDuenn[pos];k++){const starter=k<st[pos];addP(mkPlayer({pos,age:riA(W.ersatzAlter),str:Math.round(starter?base+riA(W.stammStreuung):base-W.ersatzAbschlag+riA(W.ersatzStreuung)),team:t.id}));}}
function roundRobin(ids){const n=ids.length,arr=shuffle(ids.slice()),rounds=[];for(let r=0;r<n-1;r++){const md=[];for(let i=0;i<n/2;i++){let h=arr[i],a=arr[n-1-i];if((r+i)%2===1)[h,a]=[a,h];md.push([h,a]);}rounds.push(md);arr.splice(1,0,arr.pop());}return rounds.concat(rounds.map(md=>md.map(([h,a])=>[a,h])));}
// DFB-Pokal: 1. und 2. Liga, die stärksten Drittligisten ohne Zweitmannschaften, dazu Amateure (zusammen 64)
function initCup(){const P=RF.pokal,dritt=S.teams.filter(t=>t.lg===3&&t.zweite<0).sort((a,b)=>b.rep-a.rep).slice(0,P.drittligisten);
  S.cup={alive:[...S.teams.filter(t=>t.lg<=2).map(t=>t.id),...dritt.map(t=>t.id),...S.am.slice(0,P.amateure).map((a,i)=>1000+i)],hist:[]};}
function targetFor(r,lg){const z=RV.ziel;return r===1?1:r<=z.spitzeBis?r+z.spitzePlus:Math.min(z.schlechtester[lg],r+z.plus);}
function targetText(lg,t){if(lg===1)return t===1?'Deutsche Meisterschaft':t<=4?'Platz '+t+' oder besser (Champions League)':t<=7?'Platz '+t+' oder besser (Europapokal)':t<=12?'Platz '+t+' oder besser (Mittelfeld)':'Klassenerhalt (Platz '+t+' oder besser)';return t<=2?'Aufstieg (Platz '+t+' oder besser)':t===3?'Relegationsplatz (Platz 3)':t>=RV.ziel.schlechtester[lg]?'Klassenerhalt (Platz '+t+' oder besser)':'Platz '+t+' oder besser';}
function setTarget(){LIGEN.forEach(lg=>S.teams.filter(t=>t.lg===lg).sort((a,b)=>b.rep-a.rep).forEach((t,i)=>t.expPos=i+1));const lg=myT().lg,r=targetFor(myT().expPos,lg);let z=lg>=2?Math.max(RV.ziel.unterhalbMindestens,r):r;
  // Schwierigkeit: Ziel einen Platz leichter oder strenger, nie schlechter als das schlechteste Ziel der Liga und nie besser als das beste (1. Liga Platz 1, sonst Platz 2)
  if(stufe().ziel)z=clamp(z+stufe().ziel,lg>=2?Math.min(z,RV.ziel.unterhalbMindestens):1,Math.max(z,RV.ziel.schlechtester[lg]));S.target=z;nebenzieleSetzen();zielgespraechStart();} // Nebenziele mit dem Saisonziel (K28 §5.7, U12b, js/vorstand.js)
function sponsOffers(){const t=myT(),SP=RF.sponsor;const b=sponsorBasis(t)*(RF.werbung?RF.werbung.anteil.brust:1)*werbFaktor(); /* Brust: Anteil am Grundbetrag der Werbung, daneben Ausrüster, Ärmel (K24a) und weitere Partner (K23c); Werbewert (K24b) */const ns=shuffle(SPONSOREN.slice());const r=v=>Math.round(v/1000)*1000;
  S.sponsOffers=[...SP.angebote.map((a,i)=>({name:ns[i],base:r(b*a.fix),win:a.sieg?r(b*a.sieg):0,yrs:a.jahre,info:a.info})),werbUmstritten('brust',b)];werbVerlaengerung('brust',S.sponsOffers);sponsorAuto();werbungOffen();} /* viertes Angebot: umstrittener Geldgeber (K24b) */ // in der Automatik wählt der Verein sofort (K36); freie Werbeflächen bekommen Angebote (K24a)
function sponsorWaehlen(i){S.spons={...S.sponsOffers[i]};S.sponsOffers=null;news(`Sponsorvertrag unterschrieben: ${S.spons.name}.`,'good');werbUnterschrieben('brust');}
function pickSponsor(i){if(!darf('sponsor','sponsorOderPreis'))return;sponsorWaehlen(i);save();render();}
