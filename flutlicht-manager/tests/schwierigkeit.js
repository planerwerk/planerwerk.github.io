// Schwierigkeit (K02 §5.4, K43): Bedingungen, Information, Hilfen und Geld ändern sich je Stufe, die Spielerwerte nicht. Die Würfel bleiben dieselben,
// nur die Grenzen, gegen die gewürfelt wird, verschieben sich (K43: Sponsoren, Glück bei Karten, böse Karten, Champions League, Gönner).
// Prüft Startkonto, Kreditrahmen, Saisonziel, Entlassungsgrenze, Talentsterne und Erinnerungen je Stufe, die Regeln aus K43
// und dass eine ganze Saison auf „Leicht“ und „Schwer“ ohne die Regeln aus K43 dieselben Ergebnisse bringt. Aufruf: node tests/schwierigkeit.js. Nur Node.js.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711;
// anpassen(stufen): verstellt die Stufen dieser Welt vor dem Aufbau (die Tests dürfen REGELN verstellen, tests/sim.js)
function welt(stufe,anpassen){const {W,F}=neueWelt();if(anpassen)anpassen(W.ev('REGELN').schwierigkeit.stufen);F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();const vorher={cash:W.ev('myT()').cash,ziel:S.target};
  F.stufeAnwenden(stufe);F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);return{W,F,S,vorher};}
const R={};for(const k of ['leicht','normal','schwer'])R[k]=welt(k);
const St=k=>R.normal.W.ev('REGELN').schwierigkeit.stufen[k];
for(const k of ['leicht','normal','schwer']){const {W,S,vorher}=R[k],t=W.ev('myT()'),kr=W.ev('kreditRahmen'),basis=W.ev('RF').kreditRahmen;
  pruef(Math.abs(t.cash-Math.round(vorher.cash*St(k).konto))<=1,`${St(k).name}: Startkonto ×${St(k).konto}`,`${vorher.cash} → ${t.cash}`);
  pruef(Math.abs(kr(t)-Math.round(basis.basis*Math.exp(basis.steigung*(t.rep-basis.mitte))/basis.runden)*basis.runden*St(k).kredit)<1,`${St(k).name}: Kreditrahmen ×${St(k).kredit}`); // Formel seit K23c
  const z=k==='leicht'?vorher.ziel+1:k==='schwer'?vorher.ziel-1:vorher.ziel;pruef(S.target===z||(k==='schwer'&&S.target===vorher.ziel),`${St(k).name}: Saisonziel`,`${vorher.ziel} → ${S.target}`);
  const aus=Object.keys(W.ev('RK').erinnerungen).filter(e=>!W.ev('erinnerungAn')(e)).length;pruef(St(k).erinnerungen?aus===0:aus===Object.keys(W.ev('RK').erinnerungen).length,`${St(k).name}: Erinnerungen ${St(k).erinnerungen?'an':'aus'}`);
  const p=W.S.pl.find(x=>x.team===VEREIN);p.tf=1;p.wiv=0;pruef(W.ev('sternFehler')(p)===(St(k).sterneGenau?0:1),`${St(k).name}: Talentsterne neuer Spieler ${St(k).sterneGenau?'genau':'unscharf'}`);}
// Grenze des Vorstands: Vertrauen 10 nach 7 Spieltagen. Leicht (Grenze 5): nichts. Schwer (Grenze 18): Ultimatum. Seit U12a (K28 §5.6) entlässt der Vorstand nicht mehr sofort,
// erst nach dem Ultimatum (geprüft in tests/vorstand.js).
for(const k of ['leicht','schwer']){const {W,S}=R[k],ls=W.ev('meineLigaspiele()');S.tag=ls[6].tag+1;S.trust=10;S.phase='play';S.fired=0;S.ult=null;W.ev('vorstandPruefen()');const unter=10<St(k).entlassenUnter;
  pruef(!!S.ult===unter&&!S.fired,`${St(k).name}: Vertrauen 10 nach 7 Spieltagen → ${unter?'Ultimatum':'nichts'}, keine sofortige Entlassung`);}
// Gleiche Würfel: eine Saison ohne Eingriffe auf Leicht und Schwer, im Gleichschritt, bis zum Saisonende oder bis eine der beiden Welten den Trainer entlässt
// (eine Entlassung ist eine andere Lage, danach dürfen sich die Welten unterscheiden)
// Verglichen wird Tag für Tag: Die Halte unterscheiden sich je Stufe (Erinnerungen, seit U15 auch „Deadline Day“ nur auf Leicht), also läuft die Welt weiter, die zurückliegt (T2.7).
// Die Regeln aus K43 ändern Ergebnisse mit Absicht (mehr Geld, andere Karten, Europa League statt Champions League). Sie sind hier neutral gestellt und unten einzeln geprüft.
const K43_NEUTRAL=st=>['leicht','schwer'].forEach(k=>Object.assign(st[k],{sponsor:1,kartenGlueck:0,kartenNegativ:1,ohneCL:false,goenner:false}));
{const a=welt('leicht',K43_NEUTRAL),b=welt('schwer',K43_NEUTRAL);let n=0,gleich=true,verglichen=0;
  while(n<1000&&a.S.phase!=='end'&&!a.S.fired&&!b.S.fired){n++;const ta=a.W.S.tag,tb=b.W.S.tag;
    for(const w of ta===tb?[a,b]:ta<tb?[a]:[b]){if(w.W.ev('heuteMeinSpiel()'))w.F.tagesSpiele(w.W.S.tag);w.F.weiter();}
    if(a.S.fired||b.S.fired)break; // am Tag der Entlassung endet der Vergleich
    if(a.W.S.tag===b.W.S.tag){verglichen++;if(JSON.stringify(a.W.S.res)!==JSON.stringify(b.W.S.res)){gleich=false;break;}}}
  const sp=Object.values(a.W.S.res).reduce((s,l)=>s+l.length,0);
  pruef(gleich&&sp>=100,'Gleiche Ergebnisse auf Leicht und Schwer ohne die Regeln aus K43 (gleicher Seed, ohne Eingriffe)',`${sp} Ergebnisse verglichen${b.S.fired?', Schwer: entlassen an Tag '+b.S.tag:''}`);}

// K43a. Sponsoren: Angebote für Brust und Ausrüster auf Leicht ×1,2 und auf Schwer ×0,85 gegenüber Normal (gerundet auf 1.000 €)
{const b=k=>R[k].S.spons.base,q=k=>b(k)/b('normal'),a=k=>((R[k].S.werbOffers||{}).ausruester||[{}])[0].base,qa=k=>a(k)/a('normal');
  pruef(Math.abs(q('leicht')-St('leicht').sponsor)<0.02&&Math.abs(q('schwer')-St('schwer').sponsor)<0.02,'K43: Angebote für die Brust je Stufe',`Leicht ${b('leicht')}, Normal ${b('normal')}, Schwer ${b('schwer')}`);
  pruef(Math.abs(qa('leicht')-St('leicht').sponsor)<0.03&&Math.abs(qa('schwer')-St('schwer').sponsor)<0.03,'K43: Angebote für den Ausrüster je Stufe',`Leicht ${a('leicht')}, Normal ${a('normal')}, Schwer ${a('schwer')}`);}
// K43b. Böse Karten: Infokarte, die nur schlecht ausgeht (Blamage: Vertrauen und Fans runter), ja. Platzsturm (Fans rauf, Strafe) nein.
//       Chance auf Schwer ×1,5, auf Normal und Leicht unverändert (auf Leicht fällt die Karte nach dem Wurf weg, der Würfel bleibt).
{const ev=R.normal.W.ev,K=id=>ev('KARTEN').find(c=>c.id===id),nur=ev('karteNurSchlecht'),bl=K('blamage'),ps=K('platzsturm'),wu=K('wurf');
  const ch=k=>R[k].W.ev('kartenChance')(R[k].W.ev('KARTEN').find(c=>c.id==='blamage'));
  pruef(!!bl&&!!ps&&!!wu&&nur(bl)===true&&nur(wu)===true&&nur(ps)===false,'K43: Blamage und Wurfgeschosse gelten als nur schlecht, Platzsturm nicht',`Blamage ${bl&&nur(bl)}, Wurfgeschosse ${wu&&nur(wu)}, Platzsturm ${ps&&nur(ps)}`);
  pruef(Math.abs(ch('normal')-bl.chance)<1e-9&&Math.abs(ch('leicht')-bl.chance)<1e-9&&Math.abs(ch('schwer')-Math.min(1,bl.chance*St('schwer').kartenNegativ))<1e-9,
    'K43: Chance der Blamage je Stufe (Schwer häufiger)',`Leicht ${ch('leicht')}, Normal ${ch('normal')}, Schwer ${ch('schwer')}`);}
// K43c. Champions League erst ab Normal: beim Saisonwechsel tauscht euOhneClAufLeicht, in der ersten Saison euOhneClStart (vor der Auslosung).
{const {W}=R.leicht,S=W.S,mein=S.my;const dt={cl:[1,mein,3],el:[7,8],ecl:[9]};W.ev('euOhneClAufLeicht')(dt);
  pruef(JSON.stringify(dt)===JSON.stringify({cl:[1,3,7],el:[mein,8],ecl:[9]}),'K43: Saisonwechsel auf Leicht, dein Verein in die Europa League, der Erste dort in die Champions League',JSON.stringify(dt));
  const n=R.normal.W,dn={cl:[1,R.normal.S.my,3],el:[7,8],ecl:[9]};n.ev('euOhneClAufLeicht')(dn);pruef(dn.cl.includes(R.normal.S.my),'K43: auf Normal bleibt dein Verein in der Champions League');}
for(const k of ['leicht','normal']){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev,AV0=ev('AV0'),id=S.eu&&S.eu.cl.t.find(x=>x<AV0);
  if(id==null){pruef(false,`K43: erste Saison ${k}, kein deutscher Verein in der Champions League gefunden`);continue;}
  const cl=S.eu.cl.t.length,el=S.eu.el.t.length,de=S.eu.cl.t.filter(x=>x<AV0).length;S.my=id;S.mgr='Test';F.setTarget();F.stufeAnwenden(k);
  const drin=S.eu.cl.t.includes(id),ok=k==='leicht'?!drin&&S.eu.el.t.includes(id)&&S.eu.cl.t.filter(x=>x<AV0).length===de:drin;
  const ziele=(S.ziele&&S.ziele.l)||[],zielOk=ziele.every(z=>z.k!=='europa'||S.eu[z.wb].t.includes(S.my)); // Prüfung GD1: kein Nebenziel in einem Wettbewerb, in dem du nicht spielst
  pruef(ok&&zielOk&&S.eu.cl.t.length===cl&&S.eu.el.t.length===el,`K43: erste Saison auf ${St(k).name}, ${k==='leicht'?'dein Verein spielt Europa League':'dein Verein bleibt in der Champions League'}, gleich viele Plätze, Nebenziel passt`,
    `${ev('tn')(id)}: CL ${drin}, ${S.eu.cl.t.length}/${S.eu.el.t.length}, Nebenziele ${ziele.map(z=>z.k+(z.wb?'/'+z.wb:'')).join(' ')}`);}
// Prüfung GD2: Jobwechsel auf Leicht zu einem Verein aus der Champions League. Vor der Auslosung wird getauscht, nach der Auslosung bietet so ein Verein keinen Job an.
{const {W,F,S}=welt('leicht'),ev=W.ev,AV0=ev('AV0'),id=S.eu&&S.eu.cl.t.find(x=>x<AV0&&x!==S.my);
  if(id==null)pruef(false,'K43: Jobwechsel auf Leicht, kein anderer deutscher Verein in der Champions League gefunden');
  else{const cl=S.eu.cl.t.length,el=S.eu.el.t.length;F.takeJob(id);const getauscht=S.my===id&&!S.eu.cl.t.includes(id)&&S.eu.el.t.includes(id)&&S.eu.cl.t.length===cl&&S.eu.el.t.length===el;
    S.eu.cl.lp=[];S.phase='play';const fest=S.eu.cl.t.every(x=>ev('euClFest')(x));S.fired=1;F.mkJobs();const jobs=(S.jobs||[]).filter(x=>S.eu.cl.t.includes(x)).length;S.fired=0;
    const n=R.normal.W.ev,nFest=n('euClFest')(R.normal.S.eu.cl.t[0]);
    pruef(getauscht&&fest&&jobs===0&&!nFest,'K43: Jobwechsel auf Leicht, vor der Auslosung getauscht, danach keine Jobs bei Vereinen aus der Champions League (Normal: doch)',
      `getauscht ${getauscht}, gesperrt ${fest}, Jobs in der CL ${jobs}, Normal gesperrt ${nFest}`);}}
// K43d. Gönner auf Leicht: keine Insolvenz mit Punktabzug, die Schulden sind weg, das Vertrauen sinkt um 10. Auf Normal Punktabzug wie bisher.
for(const k of ['leicht','normal']){const {W,S}=welt(k),ev=W.ev,t=ev('myT()'),I=ev('RFP').insolvenz;S.phase='play';S.trust=60;t.cash=-1e9;t.fu=I.monate;ev('insolvenzPruefen()');
  const abzug=((S.abzug||{})[S.season]||{})[S.my]||((S.abzug||{})[S.season+1]||{})[S.my]||0;
  const ok=k==='leicht'?abzug===0&&t.cash===0&&S.trust===60+(St(k).goennerVertrauen||0):abzug===I.punkte&&t.cash===0;
  pruef(ok,`K43: Pleite auf ${St(k).name}: ${k==='leicht'?'ein Gönner zahlt, kein Punktabzug':'Insolvenz mit Punktabzug'}`,`Abzug ${abzug}, Konto ${t.cash}, Vertrauen ${S.trust}`);}
// K43e. Glück bei Karten: Ausgang mit Chance 0,5 auf Leicht in mehr Fällen gut als auf Schwer, bei gleichem Würfel (eigener Strom, gleiche Folge)
{const gut=k=>{const {W}=R[k],ev=W.ev;let n=0;ev('mitStrom')(ev('strom')('k43test',1),()=>{for(let i=0;i<400;i++)if(ev('kartenWirkung')({art:'vertrauen',wert:0,chance:0.5,gut:'g',schlecht:0,schlechtText:'s'},{},{id:'k43',titel:'Test'})==='g')n++;});return n;};
  const l=gut('leicht'),m=gut('normal'),s=gut('schwer');pruef(l>m&&m>s,'K43: Glück bei Karten, Leicht > Normal > Schwer',`gute Ausgänge von 400: ${l}/${m}/${s}`);
  // pech:true (Prüfung GD3): chance ist die des schlechten Ausgangs, das Glück wirkt umgekehrt
  const pech=k=>{const {W}=R[k],ev=W.ev;let n=0;ev('mitStrom')(ev('strom')('k43pech',1),()=>{for(let i=0;i<400;i++)if(ev('kartenWirkung')({art:'vertrauen',wert:0,chance:0.5,pech:true,gut:'p',schlecht:0,schlechtText:'s'},{},{id:'k43',titel:'Test'})==='p')n++;});return n;};
  const pl=pech('leicht'),pm=pech('normal'),ps=pech('schwer');pruef(pl<pm&&pm<ps,'K43: Glück bei Karten mit pech, Leicht < Normal < Schwer schlechte Ausgänge',`schlechte Ausgänge von 400: ${pl}/${pm}/${ps}`);}
// Prüfung GD4: Saisonziel auf Leicht nennt die Europa League statt der Champions League
{const l=R.leicht.W.ev('targetText')(1,3),n=R.normal.W.ev('targetText')(1,3);
  pruef(l.includes('Europa League')&&!n.includes('Europa League')&&n.includes('Champions League'),'K43: Saisonziel Platz 3 auf Leicht ohne Champions League',`${l} / ${n}`);}

// K02a. Neue Regeln ausprobieren (K02 §4.4): Jeder Eintrag in REGELN.experimente zeigt auf einen Schalter, der aus ist. experimentSetzen schaltet ihn für diesen
//       Spielstand ein (S.einst.exp) und wieder aus; experimenteAnwenden schaltet nur aus, was es selbst eingeschaltet hat (ein von außen gesetzter Schalter bleibt).
{const {W,F,S}=welt('normal'),ev=W.ev,X=ev('REGELN').experimente,o=x=>ev('expObjekt')(x.pfad);
  const alleAus=X.length>=4&&X.every(x=>!!o(x)&&o(x).an===false);
  F.experimentSetzen(X[0].k,true);const an=o(X[0]).an===true&&S.einst.exp[X[0].k]===true&&ev('experimentAn')(X[0].k);
  F.experimentSetzen(X[0].k,false);const aus=o(X[0]).an===false&&!S.einst.exp[X[0].k];
  o(X[1]).an=true;F.experimenteAnwenden();const fremd=o(X[1]).an===true;o(X[1]).an=false;
  S.einst.exp={[X[2].k]:true};F.experimenteAnwenden();const laden=o(X[2]).an===true;delete S.einst.exp[X[2].k];F.experimenteAnwenden();const wieder=o(X[2]).an===false;
  pruef(alleAus&&an&&aus&&fremd&&laden&&wieder,'Neue Regeln ausprobieren: alle Schalter aus, ein und aus je Spielstand, von außen gesetzte Schalter bleiben',
    `aus ${alleAus}, an ${an}, wieder aus ${aus}, von außen ${fremd}, Laden ${laden}/${wieder}`);}

// Prüfung FN2, FN5, FO8: TV-Raten im Menü umgeschaltet gelten erst ab der nächsten Saison (S.tvModus); Länderspiele im Menü ausgeschaltet holen Abgestellte sofort zurück.
{const {W,F,S}=welt('normal'),ev=W.ev,an=ev('tvRatenAn');delete S.tvModus;
  F.experimentSetzen('tvRaten',true);const dieseSaison=an()===false&&!!S.tvModus&&S.tvModus.s===S.season;S.season++;const naechste=an()===true;S.season--;F.experimentSetzen('tvRaten',false);
  F.experimentSetzen('laenderspiele',true);const p=S.pl.find(x=>x.team>=0);p.lsp={von:0,bis:1e9,n:2,st:1};F.experimentSetzen('laenderspiele',false);const zurueck=!p.lsp;
  pruef(dieseSaison&&naechste&&zurueck,'Neue Regeln im Menü: TV-Raten erst ab der nächsten Saison, Länderspiele aus holt Abgestellte zurück',`diese Saison ${dieseSaison}, nächste ${naechste}, zurück ${zurueck}`);}
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
