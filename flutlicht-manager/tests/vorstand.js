// Vorstand (K28 §5.6, U12a): Formel des Vertrauens, träger Anteil je Woche, schneller Anteil je Spiel mit halbem Gewicht, Ultimatum statt sofortiger Entlassung,
// Ruf als Trainer zum Saisonende und bei Entlassung, Jobangebote nach Ruf. Aufruf: node tests/vorstand.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U12a entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711,nah=(a,b,e=0.01)=>Math.abs(a-b)<=e;
function welt(){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);
  const im=(k,fn)=>W.ev('mitStrom')(W.ev('strom')('test',k),fn);return{W,F,S,ev:W.ev,im,B:W.ev('RV')};} // W auch für Überschreibungen in den Tests zum Zielgespräch (Nr. 10 bis 13)

// 1. Formel (K28 §5.1): 50 + Sport (5 je Platz gegen das Soll, −35 bis +25) + Serie (10 × (Punkte je Spiel − 1,3), −15 bis +10) + Finanzen und Umfeld, begrenzt auf 0 bis 100
{const {F,B}=welt(),V=B.vertrauen,z=(pos,soll,last,extra)=>F.vertrauenZiel(V,{last},pos,soll,extra);
  const a=z(8,8,[1,1,1,1,1],0),b=z(3,8,[3,3,3,3,3],0),c=z(18,8,[0,0,0,0,0],-15),d=z(8,8,[],0),e=z(8,8,[3,3,3,3,3,0,0,0,0,0],0);
  pruef(nah(a,47)&&nah(b,85)&&c===0&&nah(d,50)&&nah(e,37),'Formel: im Soll mit 1 Punkt je Spiel 47, fünf Plätze besser und nur Siege 85 (Sport höchstens +25, Serie höchstens +10), ganz unten 0, ohne Spiele 50, nur die letzten 5 Spiele zählen',
    [a,b,c,d,e].map(x=>Math.round(x*10)/10).join(', '));}

// 2. Träger Anteil (montags): erst ab dem 5. eigenen Ligaspiel, dann 20 % Richtung Ziel. Konto im Minus und Kredit: Finanzen −15 (nicht −20)
{const w=welt(),{S,F,ev,im,B}=w,t=ev('myT()'),ls=ev('meineLigaspiele()');
  S.tag=ls[3].tag+1;S.trust=50;im('w1',()=>F.vorstandWoche());const frueh=S.trust;
  S.tag=ls[6].tag+1;S.trust=50;im('w2',()=>F.vorstandWoche());const normal=S.trust;
  const T=ev('table')(t.lg),i=T.findIndex(r=>r.id===S.my),g=ev('glaub')(t),V=B.vertrauen,umf=g<V.glaubUnter?V.umfeldMin*(V.glaubUnter-g)/V.glaubUnter:0,soll=50+(F.vertrauenZiel(V,T[i],i+1,S.target,umf+Math.max(V.finanzMin,(t.cash<0?V.kontoMinus:0)+(S.loan>0?V.kredit:0)))-50)*V.traegheit;
  const cash=t.cash,loan=S.loan;t.cash=-1;S.loan=1e6;S.trust=50;im('w3',()=>F.vorstandWoche());const minus=S.trust;t.cash=cash;S.loan=loan;
  const ohneGeld=cash<0||loan>0?null:normal-minus;
  pruef(frueh===50&&nah(normal,soll)&&(ohneGeld==null||nah(ohneGeld,-V.finanzMin*V.traegheit)),'Träger Anteil: vor dem 5. Ligaspiel nichts, danach 20 % Richtung Ziel, Konto im Minus mit Kredit kostet im Ziel 15 (also 3 in einer Woche)',
    `früh ${frueh}, normal ${Math.round(normal*100)/100} (soll ${Math.round(soll*100)/100}), Unterschied mit Minus ${ohneGeld==null?'nicht geprüft':Math.round(ohneGeld*100)/100}`);}

// 3. Schneller Anteil: ein Sieg zählt halb so viel wie vor U12a, der Tabellenplatz je Spiel entfällt
{const {S,F,ev,B}=welt(),t=ev('myT()'),o=S.teams.filter(x=>x.lg===t.lg&&x.id!==S.my).sort((a,b)=>Math.abs(a.rep-t.rep)-Math.abs(b.rep-t.rep))[0];
  const str=o.rep>t.rep+B.staerkerAb,soll=B.vertrauen.schnell*(str?B.sieg.staerker:B.sieg.sonst);S.trust=50;F.vorstandLiga({md:20},{h:S.my,a:o.id,hg:2,ag:0});
  pruef(nah(S.trust-50,soll),'Schneller Anteil: Sieg mit halbem Gewicht, kein Zuschlag für den Tabellenplatz',`+${Math.round((S.trust-50)*100)/100} (soll +${soll})`);}

// 4. Ultimatum statt sofortiger Entlassung (Normal: Grenze 12, Schonfrist 6). Unter der Grenze: Ultimatum über 2 Ligaspiele, danach Entlassung spätestens nach dem letzten Ultimatum.
{const {S,F,ev,B}=welt(),ls=ev('meineLigaspiele()'),St=ev('stufe()'),ruf0=ev('ruf()');
  S.phase='play';S.tag=ls[8].tag+1;S.trust=5;F.vorstandPruefen();const u1=S.ult?Object.assign({},S.ult):null;
  S.tag=ls[9].tag+1;F.vorstandPruefen();const nachEinem=!!S.fired;
  let runde=0;for(const k of [10,12]){if(S.fired)break;S.tag=ls[k].tag+1;S.trust=5;F.vorstandPruefen();runde++;}
  pruef(!!u1&&u1.n===1&&u1.ab===9&&!nachEinem&&S.fired===1&&runde<=2&&!S.ult&&nah(ev('ruf()'),ruf0+B.ruf.entlassung)&&Array.isArray(S.jobs)&&S.jobs.length>0,
    'Ultimatum: unter der Grenze erst ein Ultimatum, nach einem Spiel noch nichts, Entlassung spätestens nach dem letzten Ultimatum, Ruf −8, Jobangebote',`Grenze ${St.entlassenUnter}, ${runde} Prüfung(en) nach dem Ultimatum, Ruf ${ruf0} → ${ev('ruf()')}`);}
{const {S,F,ev}=welt(),ls=ev('meineLigaspiele()');
  S.phase='play';S.tag=ls[8].tag+1;S.trust=5;F.vorstandPruefen();const da=!!S.ult;S.tag=ls[10].tag+1;S.trust=40;F.vorstandPruefen();
  pruef(da&&!S.ult&&!S.fired,'Ultimatum überstanden: Liegt das Vertrauen nach zwei Ligaspielen wieder über der Grenze, ist es aufgehoben');
  S.trust=5;F.vorstandPruefen();const neu=S.ult?Object.assign({},S.ult):null;S.ult.tid=-5;S.tag=ls[12].tag+1;S.trust=40;F.vorstandPruefen();
  pruef(!!neu&&neu.n===1&&!S.ult&&!S.fired,'Ein Ultimatum gilt nur für den Verein, bei dem es gestellt wurde (nach einem Jobwechsel ist es weg)');}

// 5. Ruf zum Saisonende: erst 5 % Richtung 30 vergessen, dann Ziel übertroffen (+3 je Platz), Meister (+15), Abstieg (−6), deutlich verfehlt (−4)
{const {S,F,ev,B}=welt(),F2=B.ruf,me=S.my,sm=o=>Object.assign({pos:8,target:8,lg:1,champ:-1,cup:-1,up:[],up3:[],down:[],down2:[],down3:[],rel:[-1,-1],rel2:[-1,-1],rw:-1,rw2:-1},o);
  S.ruf=30;F.rufSaison(sm({pos:3,target:8}));const a=ev('ruf()');F.rufSaison(sm({pos:1,target:1,champ:me}));const b=ev('ruf()');
  S.ruf=30;F.rufSaison(sm({pos:17,target:15,down:[me]}));const c=ev('ruf()');S.ruf=30;F.rufSaison(sm({pos:14,target:9}));const d=ev('ruf()');
  pruef(nah(a,30+5*F2.jePlatzUeber,0.06)&&nah(b,a+(30-a)*F2.vergessen+F2.meister,0.06)&&nah(c,30+F2.abstieg,0.06)&&nah(d,30+F2.verfehlt,0.06),'Ruf zum Saisonende: Ziel um 5 übertroffen +15, Meister +15 (nach dem Vergessen), Abstieg −6, Ziel um 5 verfehlt −4',
    [a,b,c,d].join(', '));}

// 6. Jobangebote nach Ruf (K28 §10): mit hohem Ruf Vereine mit mehr Ansehen. Für den Vergleich ein Zweitligist aus der Mitte, damit nach oben Platz ist.
{const {S,F,ev,im}=welt(),schnitt=()=>S.jobs.reduce((x,id)=>x+S.teams[id].rep,0)/S.jobs.length,l2=S.teams.filter(t=>t.lg===2).sort((a,b)=>a.rep-b.rep);S.my=l2[Math.floor(l2.length/2)].id;
  S.ruf=30;im('jobs',()=>F.mkJobs());const a=schnitt();S.ruf=60;im('jobs',()=>F.mkJobs());const b=schnitt();
  pruef(b>a+5,'Jobangebote: Ruf 60 bringt Vereine mit deutlich mehr Ansehen als Ruf 30',`Schnitt ${Math.round(a)} → ${Math.round(b)}, dein Verein ${ev('myT()').rep}`);}

// 7. Nebenziele (K28 §5.7, U12b): mit dem Saisonziel gesetzt, Anzahl nach dem Ehrgeiz des Präsidenten, gleich bei erneutem Setzen, das Profil zuerst
{const {S,F,ev,B}=welt(),N=B.nebenziele,t=ev('myT()'),l=()=>ev('meineZiele()').map(z=>z.k).join(','),a=l();F.setTarget();const b=l();
  const soll=F.praesident(t).ehrgeiz>=N.ehrgeizigAb?N.anzahl[1]:N.anzahl[0],alt=t.profil;t.profil='ausbildung';F.nebenzieleSetzen();const jung=ev('squad')(S.my).some(p=>p.age<=N.jugendBis),c=l();if(alt)t.profil=alt;else delete t.profil;F.nebenzieleSetzen();
  pruef(a.length>0&&a===b&&a.split(',').length===soll&&(!jung||c.split(',').includes('jugend')),'Nebenziele: mit dem Saisonziel gesetzt, so viele wie der Ehrgeiz des Präsidenten sagt, erneut gesetzt dieselben, beim Ausbildungsverein immer mit Jugend',`${a} (Ehrgeiz ${F.praesident(t).ehrgeiz}), Ausbildungsverein: ${c}`);}

// 8. Stand der Nebenziele und Baustein „Ziele“: Pokal (Runde erreicht, ausgeschieden), Finanzen (gefährdet, zum Saisonende erfüllt oder verfehlt), Jugend (Einsätze)
{const {S,F,ev,B}=welt(),N=B.nebenziele,me=S.my,st=(z,e)=>F.nebenzielStand(z,e),pk={k:'pokal',min:2},fi={k:'finanzen',min:0},ju={k:'jugend',min:N.jugendEinsaetze};
  const spiel=[me,9999,1,0];S.cup={alive:[me],hist:[]};const p0=st(pk,false);S.cup.hist=[[spiel]];const p1=st(pk,false);S.cup.hist=[[spiel],[spiel]];const p2=st(pk,false);
  S.cup={alive:[9999],hist:[[spiel]]};const p3=st(pk,false);
  S.fin={a:-5};const f0=st(fi,false),f1=st(fi,true);S.fin={a:5};const f2=st(fi,true);
  const jung=ev('squad')(me).filter(p=>p.age<=N.jugendBis);jung.forEach(p=>{p.apps=0;});const j0=st(ju,false);if(jung.length)jung[0].apps=N.jugendEinsaetze;const j1=jung.length?st(ju,false):'erfuellt';
  S.ziele={s:S.season,tid:me,l:[pk,fi]};S.cup={alive:[me],hist:[[spiel],[spiel]]};S.fin={a:5};const bs=F.zieleBaustein();
  pruef(p0==='offen'&&p1==='offen'&&p2==='erfuellt'&&p3==='verfehlt'&&f0==='gefaehrdet'&&f1==='verfehlt'&&f2==='erfuellt'&&j0==='offen'&&j1==='erfuellt'&&bs===N.erfuellt,
    'Stand: Pokal offen bis zur Zielrunde, dann erfüllt, früher raus verfehlt. Finanzen mit Verlust gefährdet, zum Saisonende verfehlt oder erfüllt. Jugend nach Einsätzen. Baustein +5 je erfülltem',
    [p0,p1,p2,p3,f0,f1,f2,j0,j1,bs].join(', '));
  S.trust=50;S.ziele={s:S.season,tid:me,l:[pk,fi]};S.cup={alive:[9999],hist:[[spiel]]};F.nebenzieleSaison();
  pruef(S.trust===50+N.saisonVerfehlt+N.saisonErfuellt,'Saisonende: je erfülltem Nebenziel +5, je verfehltem −5',`Vertrauen ${S.trust}`);}

// U12o. Nebenziele Kader und Zuschauer (K28 §3.1): Kader gefährdet über dem Gehaltsrahmen, zum Saisonende erfüllt nur darin. Zuschauer nur nach einer Saison beim Verein
//       in derselben Liga, Ziel zuschauerHalten des Vorjahresschnitts; gefährdet erst ab zuschauerAb Heimspielen unter dem Ziel.
{const {S,F,ev,B}=welt(),N=B.nebenziele,t=ev('myT()'),st=(z,e)=>F.nebenzielStand(z,e),ka={k:'kader',min:0},gr=ev('gehaltsRahmen')(t),sq=ev('squad')(S.my),sal0=sq.map(p=>p.sal);
  const setzeGehalt=f=>{sq.forEach((p,i)=>{p.sal=Math.round(sal0[i]*f);});},summe=()=>ev('gehaltsSumme')(t);
  setzeGehalt(0.01);const k0=summe()<=gr?st(ka,false)==='offen'&&st(ka,true)==='erfuellt':false;setzeGehalt(1);let f=1;while(summe()<=gr*1.2&&f<50){f*=1.5;setzeGehalt(f);}const k1=st(ka,false)==='gefaehrdet'&&st(ka,true)==='verfehlt';setzeGehalt(1);
  const vor=ev('zuschauerVorsaison');S.hist=[];const ohne=vor(t)===0;S.hist=[{s:S.season-1,tid:S.my,lg:t.lg,zus:10000}];const mit=vor(t)===10000;S.hist[0].lg=t.lg===1?2:1;const andereLiga=vor(t)===0;S.hist[0].lg=t.lg;
  F.nebenzieleSetzen();const moeglich=ev('meineZiele()').every(z=>z.k!=='zuschauer'||z.min===Math.round(10000*N.zuschauerHalten/100)*100);
  const zu={k:'zuschauer',min:9500};S.att=[9000*(N.zuschauerAb-1),N.zuschauerAb-1];const z0=st(zu,false);S.att=[9000*N.zuschauerAb,N.zuschauerAb];const z1=st(zu,false),z2=st(zu,true);S.att=[9600*4,4];const z3=st(zu,true);
  const nz=F.nebenzielName(zu),name=(nz.includes('9.500')||nz.includes('9,500'))&&F.nebenzielName(ka).startsWith('Kader');
  pruef(k0&&k1&&ohne&&mit&&andereLiga&&moeglich&&z0==='offen'&&z1==='gefaehrdet'&&z2==='verfehlt'&&z3==='erfuellt'&&name,'Nebenziele Kader und Zuschauer: Gehaltsrahmen zum Saisonende, Zuschauer nach der Vorsaison',
    `Kader im Rahmen ${k0}, darüber ${k1}, Vorsaison ohne/mit/andere Liga ${ohne}/${mit}/${andereLiga}, gesetzt ${moeglich}, Zuschauer ${[z0,z1,z2,z3].join(', ')}, Namen ${name}`);}

// 9. Rücktritt (K28 §5.3, U12b): sofort weg, Ruf −5 statt −8, Jobangebote; mit dem neuen Job ist der Rücktritt vergessen
{const {S,F,ev,B}=welt();S.phase='play';S.ruf=30;F.ruecktritt();const weg=S.fired===1&&S.ruecktritt===1,r=ev('ruf()'),jobs=(S.jobs||[]).slice();
  if(jobs.length)F.takeJob(jobs[0]);
  pruef(weg&&r===30+B.ruf.ruecktritt&&jobs.length>0&&S.fired===0&&!S.ruecktritt&&S.my===jobs[0],'Rücktritt: sofort weg, Ruf −5, Jobangebote, beim neuen Verein ist alles zurückgesetzt',`Ruf ${r}, ${jobs.length} Angebote`);}

// 10. Zielgespräch (K28 §5.2, U12e): mit dem Saisonziel offen, Hochpokern immer angenommen (Ziel besser, Transferbudget +10 % je Platz), nur eine Entscheidung je Saison,
//     nach dem nächsten Ligaspiel zu, Karte im Büro nur solange offen
{const {S,F,ev,B}=welt(),t=ev('myT()'),Z=B.zielgespraech;t.cash=60e6;const z0=S.target,b0=ev('transferBudget')(t),offen0=ev('zgOffen')(),karte0=F.zielgespraechKarte().length>0;
  F.zielVerhandeln(-1);const z1=S.target,b1=ev('transferBudget')(t);F.zielVerhandeln(-1);const z2=S.target;
  const w=welt();w.S.zg.sp=-1;const zu=!w.ev('zgOffen')()&&w.F.zielgespraechKarte()==='';
  pruef(offen0&&karte0&&z1===Math.max(1,z0-1)&&(z0===1||Math.abs(b1-Math.round(b0*(1+Z.budgetHoch)))<=1)&&z2===z1&&S.zg.fertig===1&&zu,'Zielgespräch: Hochpokern, Budget, eine Entscheidung, Fenster',`Ziel ${z0} → ${z1} → ${z2}, Budget ${b0} → ${b1}, zu nach dem Ligaspiel ${zu}`);}

// 11. Tiefstapeln mit Zusage: Ziel schlechter, Transferbudget −15 % je Platz, der Ruf rechnet „übertroffen“ weiter vom Vorschlag aus
{const {S,F,ev,B,W}=welt(),t=ev('myT()'),Z=B.zielgespraech,me=S.my;W.ev('zgTiefChance=function(){return 1;}');t.cash=60e6;const z0=S.target,b0=ev('transferBudget')(t);
  F.zielVerhandeln(1);const z1=S.target,b1=ev('transferBudget')(t);
  const sm=o=>Object.assign({pos:8,target:S.target,lg:1,champ:-1,cup:-1,up:[],up3:[],down:[],down2:[],down3:[],rel:[-1,-1],rel2:[-1,-1],rw:-1,rw2:-1},o);
  S.ruf=30;F.rufSaison(sm({pos:z0}));const r=ev('ruf()');
  pruef(z1===z0+1&&S.zg.stufe===1&&Math.abs(b1-Math.round(b0*(1-Z.budgetTief)))<=1&&nah(r,30),'Zielgespräch: Tiefstapeln mit Zusage, Budget kleiner, Ziel genau erreicht bringt keinen Ruf (Vorschlag zählt)',`Ziel ${z0} → ${z1}, Budget ${b0} → ${b1}, Ruf ${r}`);}

// DW5. Nach einem zugesagten Budgetgespräch (+20 %) nennt das Zielgespräch nur seinen eigenen Teil: beim Tiefstapeln um einen Platz „15 % weniger“, nicht den Gesamtfaktor
{const {S,F,ev,B,W}=welt(),Z=B.zielgespraech;W.ev('zgTiefChance=function(){return 1;}');S.bg={s:S.season,tid:S.my,ok:1};const z0=S.target;F.zielVerhandeln(1);
  const txt=(S.news.find(n=>n.t.startsWith('Zielgespräch'))||{t:''}).t,soll=`${Math.round(Z.budgetTief*100)} % weniger`;
  pruef(S.target===z0+1&&txt.includes(soll)&&ev('bgFaktor')()>1,'Zielgespräch nach dem Budgetgespräch: Prozente nur aus dem Zielgespräch',txt.slice(0,160));}

// 12. Tiefstapeln abgelehnt: Ziel bleibt, Vertrauen −3, Gespräch beendet. Zusage-Chance: steigt mit Vertrauen und Ruf, sinkt mit jedem weiteren Platz
{const {S,F,ev,B,W}=welt(),Z=B.zielgespraech;const c1=F.zgTiefChance(1),c2=F.zgTiefChance(2);S.trust=90;const c3=F.zgTiefChance(1);
  W.ev('zgTiefChance=function(){return 0;}');S.trust=60;const z0=S.target;F.zielVerhandeln(1);
  pruef(S.target===z0&&nah(S.trust,60+Z.abgelehnt)&&S.zg.fertig===1&&S.zg.ab===1&&c2<c1&&c3>c1,'Zielgespräch: Tiefstapeln abgelehnt, Chance nach Vertrauen und Plätzen',`Chance ${c1.toFixed(2)} / ${c2.toFixed(2)} / bei Vertrauen 90 ${c3.toFixed(2)}, Vertrauen ${S.trust}`);}

// 13. Hochgepokert und erreicht: Ruf-Zuschlag je Platz. Kauf über dem Transferbudget: Vertrauen je angefangene 10 % der Ablöse darüber
{const {S,F,ev,B}=welt(),t=ev('myT()'),Z=B.zielgespraech;S.target=Math.max(3,S.target);S.zg.vorschlag=S.target;F.zielVerhandeln(-2);
  const sm=o=>Object.assign({pos:8,target:S.target,lg:1,champ:-1,cup:-1,up:[],up3:[],down:[],down2:[],down3:[],rel:[-1,-1],rel2:[-1,-1],rw:-1,rw2:-1},o);
  S.ruf=30;F.rufSaison(sm({pos:S.target}));const r=ev('ruf()');
  const w=welt(),tt=w.ev('myT()');tt.cash=w.ev('erwarteteEinnahmen')(tt)*w.ev('RFP').budget.reserve+5e6;w.S.trust=50;const b=w.ev('transferBudget')(tt);w.F.zgUeberBudget(b+4e6);const v1=w.S.trust;w.S.trust=50;w.F.zgUeberBudget(b);
  const gr=ev('zgZielGrenze'),grenzen=gr(2,1)===B.ziel.unterhalbMindestens&&gr(3,1)===B.ziel.unterhalbMindestens&&gr(1,0)===1; // CX3: 2. und 3. Liga nicht besser als Platz 2
  pruef(grenzen&&nah(r,30+2*(B.ruf.jePlatzUeber+Z.rufHoch))&&nah(b,5e6,2)&&nah(v1,50+Z.ueberBudget*Math.ceil(4e6/(b+4e6)*10))&&w.S.trust===50,'Zielgespräch: Ruf-Zuschlag nach Hochpokern, Vertrauen bei Kauf über dem Budget',`Ruf ${r}, Budget ${b}, Vertrauen ${v1}`);}

// 14. Zwischenbilanz im Winter (K28 §4 Nr. 3, U12f): klar besser → Vorstand hebt an (Vorschlag mit), klar schlechter → Antrag (zugesagt wie Tiefstapeln, abgelehnt Vertrauen −3),
//     dazwischen bleibt alles, einmal je Saison
{const B=welt().B.zwischenbilanz,sp=w=>w.ev('meineSpieltage')();
  const a=welt();a.S.target=10;const v0=a.S.zg.vorschlag;a.F.zwischenbilanz(10-B.abstand,sp(a));const hoch=a.S.target===10-B.hoch&&a.S.zb.art==='hoch'&&a.S.zg.vorschlag===v0-B.hoch&&!a.ev('zbAntragOffen')();
  const b=welt();b.S.target=5;b.F.zwischenbilanz(5+B.abstand,sp(b));const offen=b.ev('zbAntragOffen')()&&b.F.zwischenbilanzKarte().length>0;b.W.ev('zbChance=function(){return 1;}');b.F.zielSenkenAntrag();
  const gesenkt=b.S.target===5+B.senken&&b.S.zg.stufe===B.senken&&Math.abs(b.ev('zgBudgetFaktor')()-(1-b.B.zielgespraech.budgetTief*B.senken))<1e-9&&!b.ev('zbAntragOffen')();
  const c=welt();c.S.target=5;c.S.trust=60;c.F.zwischenbilanz(5+B.abstand,sp(c));c.W.ev('zbChance=function(){return 0;}');c.F.zielSenkenAntrag();const nein=c.S.target===5&&nah(c.S.trust,60+B.abgelehnt);
  const d=welt();d.S.target=8;d.F.zwischenbilanz(9,sp(d));const fest=d.S.target===8&&d.S.zb.art==='fest';d.S.target=8;const ls=d.ev('meineLigaspiele')(),halb=Math.floor(ls.length/2);d.S.tag=ls[halb].tag+1;d.S.gespielt=-1; // nach der Hälfte (DD6), damit nur S.zb die zweite Bilanz verhindert
  const ueber=d.ev('meineSpieltage')()>=halb;d.F.zwischenbilanzWoche();const einmal=ueber&&d.S.zb.pos===9;
  pruef(hoch&&offen&&gesenkt&&nein&&fest&&einmal,'Zwischenbilanz: anheben, Antrag mit Zusage und Ablehnung, fest, einmal je Saison',`hoch ${hoch}, Antrag ${offen}, gesenkt ${gesenkt}, abgelehnt ${nein}, fest ${fest}, einmal ${einmal}`);}

// 15. Trainervertrag (K28 §5.5, U12g, nur Statistik): Gehalt nach Liga, Ansehen und Ruf, Laufzeit nach der Geduld (ab dem Winter zählt die Saison nicht), Gehalt anteilig in der Station,
//     Abfindung = Restgehalt × 0,5, Verlängerung über Vertrauen 55 um zwei Saisons mit neuem Gehalt, sonst eine zum alten, Ligaklausel zum Saisonwechsel
{const {S,F,ev,B}=welt(),V=B.vertrag,t=ev('myT()'),r=x=>Math.max(V.runden,Math.round(x/V.runden)*V.runden),L=F.vertragLaufzeit(VEREIN);
  const g=F.trainerGehalt(VEREIN),soll=r(V.basis*(V.liga[t.lg]||V.liga[3])*Math.exp(V.steigung*(t.rep-V.mitte)));S.ruf=B.ruf.start+10;const g10=F.trainerGehalt(VEREIN);S.ruf=B.ruf.start;
  S.phase='play';S.tag=0;const v0=F.vertragNeu(VEREIN),bis0=v0.bis;S.tag=200;const bis1=F.vertragNeu(VEREIN).bis;S.tag=0;const v=F.vertragNeu(VEREIN),st=F.offeneStation();
  S.tag=73;F.gehaltBuchen(73);const verd=st.verd;v.bis=S.season+1;const abf=r(v.geh*(1+(1-73/V.saisonTage))*V.abfindung);F.entlassen('Test');
  const w1=welt();w1.S.trust=60;const a=w1.ev('trainerVertrag')();a.bis=w1.S.season;w1.S.hist.push({s:w1.S.season});w1.S.phase='end';w1.F.vertragSaisonende();const lang=a.bis,hg=w1.S.hist[w1.S.hist.length-1].geh;
  const w2=welt();w2.S.trust=50;const b=w2.ev('trainerVertrag')();b.bis=w2.S.season;const gb=b.geh;w2.S.phase='end';w2.F.vertragSaisonende();
  const bisB=b.bis,lgAlt=b.lg===1?2:1;b.lg=lgAlt;b.ab=200;w2.F.vertragNeueSaison();const klausel=b.geh===r(gb*((V.liga[w2.ev('myT()').lg]||V.liga[3])/V.liga[lgAlt]))&&b.ab===0;
  pruef(g===soll&&Math.abs(g10-g*1.1)<=1.1*V.runden&&bis0===S.season+L-1&&bis1===S.season+L&&!!st&&st.geh===v.geh&&verd===Math.round(v.geh*73/V.saisonTage)&&st.abf===abf&&st.verd===verd&&S.fired===1
    &&lang===w1.S.season+V.verlaengern&&hg===a.geh&&bisB===w2.S.season+V.bewaehrung&&klausel,
    'Trainervertrag: Gehalt, Laufzeit, anteiliges Gehalt, Abfindung, Verlängerung, Bewährung, Ligaklausel',
    `Gehalt ${g} (soll ${soll}, Ruf +10 ${g10}), Laufzeit ${L}: bis ${bis0} / ${bis1}, verdient ${verd}, Abfindung ${st&&st.abf} (soll ${abf}), verlängert bis ${lang}, Bewährung bis ${bisB}, Klausel ${klausel}`);}

// 16. Ruf wirkt (K28 §5.4, U12h): Interesse der Spieler +0,2 je Punkt Ruf über dem Start, Ruf in der Kabine 50 + 0,3 × Ansehen + 0,5 je Punkt (höchstens 95),
//     Glaubwürdigkeit beim neuen Verein 60 + 0,3 je Punkt (30 bis 90); beim Jobwechsel gesetzt
{const {S,F,ev,B}=welt(),G=ev('RGS').glaubwuerdigkeit,T=ev('RKA').rufGefaelle.trainer,p=S.pl.find(x=>x.team>=0&&x.team<1000&&x.team!==VEREIN),r0=B.ruf.start;
  S.ruf=r0;const i0=F.wechselInteresse(p),k0=F.trainerRuf(),g0=F.glaubNeu();S.ruf=r0+20;const i1=F.wechselInteresse(p),k1=F.trainerRuf(),g1=F.glaubNeu();
  const rep=ev('myT()').rep,kSoll=Math.min(T[3],T[0]+T[1]*rep),k1Soll=Math.min(T[3],kSoll+T[2]*20);
  const ziel=S.teams.find(x=>x.lg===2&&x.id!==VEREIN).id;S.fired=1;F.takeJob(ziel);const gJob=S.teams[ziel].glaub;
  pruef(Math.abs(i1-i0-20*ev('RVT').interesse.ruf)<1e-9&&Math.abs(k0-kSoll)<1e-9&&Math.abs(k1-k1Soll)<1e-9&&g0===G.start&&g1===Math.round(G.start+20*G.jeRuf)&&gJob===g1&&S.my===ziel,
    'Ruf wirkt: Interesse, Kabine, Glaubwürdigkeit beim neuen Verein',`Interesse +${(i1-i0).toFixed(2)}, Kabine ${k0} → ${k1}, Glaubwürdigkeit ${g0} → ${g1}, nach dem Wechsel ${gJob}`);}

// 17. Präsidentenwahl (K28 §8, U12i): ohne Wechsel derselbe Präsident wie vorher, nach einem Wechsel meist andere Werte; Wahl alle 3 oder 4 Jahre; Chance 0,65 ± Auf-/Abstieg und
//     Fanstimmung; abgewählt: neuer Präsident, dein Vertrauen rückt zur Hälfte Richtung 50; wiedergewählt: nichts ändert sich
{const {S,F,ev,B}=welt(),W=B.praesident.wahl,t=ev('myT()'),alle=S.teams.filter(x=>ev('aktiv')(x)),p0=JSON.stringify(F.praesident(t));
  const gleich=JSON.stringify(F.praesident(Object.assign({},t,{prw:0})))===p0,anders=alle.filter(x=>JSON.stringify(F.praesident(x))!==JSON.stringify(F.praesident(Object.assign({},x,{prw:1})))).length;
  const takt=alle.every(x=>{let n=0;for(let s=S.season;s<S.season+12;s++)if(ev('wahlFaellig')(x,s))n++;return n===12/ev('wahlJahre')(x);});
  t.fanst=50;const c0=F.wahlChance(t,null),cAuf=F.wahlChance(t,{up:[VEREIN]}),cAb=F.wahlChance(t,{down:[VEREIN]});t.fanst=80;const cFans=F.wahlChance(t,null);t.fanst=50; /* 80 statt 90: mit dem Gewicht 1,5 (U12m) läge 90 an der Obergrenze 0,95 */
  while(!ev('wahlFaellig')(t,S.season))S.season++;const faellig=alle.filter(x=>ev('wahlFaellig')(x,S.season)).length;
  Object.assign(W,{grenzen:[0,0]});S.trust=80;const n1=F.praesidentenWahlen(null),trust1=S.trust,prw1=t.prw;
  Object.assign(W,{grenzen:[1,1]});const n2=F.praesidentenWahlen(null);
  pruef(gleich&&anders>=alle.length*0.9&&takt&&Math.abs(c0-W.bleiben)<1e-9&&Math.abs(cAuf-c0-W.aufstieg)<1e-9&&Math.abs(cAb-c0-W.abstieg)<1e-9&&Math.abs(cFans-c0-30*W.fans*ev('wahlFansGewicht')(t))<1e-9 /* seit U12m mit dem Gewicht nach Mitgliedern je Platz */
    &&n1===faellig&&prw1===1&&trust1===65&&n2===0&&t.prw===1&&S.trust===65,
    'Präsidentenwahl: Werte, Takt, Chance, Abwahl mit Vertrauen zur Mitte, Wiederwahl ohne Folgen',
    `andere Werte bei ${anders} von ${alle.length}, Takt ${takt}, Chance ${c0.toFixed(2)} / Aufstieg ${cAuf.toFixed(2)} / Abstieg ${cAb.toFixed(2)} / Fans 80 ${cFans.toFixed(2)}, abgewählt ${n1} von ${faellig}, Vertrauen ${trust1}, danach ${n2}`);}

// 18. Vorstand senkt von sich aus (K28 §5.9, U12k): mindestens 6 Plätze hinter dem Ziel und ein geduldiger Präsident → Ziel um 1 schlechter, ohne Antrag und ohne Budgetabzug,
//     der Vorschlag rückt mit; ungeduldig oder nur 4 Plätze dahinter → Antrag wie bisher
{const B=welt().B,Z=B.zwischenbilanz,sp=w=>w.ev('meineSpieltage')(),geduld=(w,g)=>w.W.ev(`praesident=function(){return{geduld:${g},ehrgeiz:10,sparsam:10};}`);
  const a=welt();geduld(a,B.ruf.geduldig);a.S.target=5;const v0=a.S.zg.vorschlag,b0=a.ev('zgBudgetFaktor')();a.F.zwischenbilanz(5+Z.vonSichAus,sp(a));
  const senkt=a.S.target===5+Z.senken&&a.S.zb.art==='gesenkt'&&a.S.zg.vorschlag===v0+Z.senken&&!a.ev('zbAntragOffen')()&&a.ev('zgBudgetFaktor')()===b0;
  const b=welt();geduld(b,B.ruf.ungeduldig);b.S.target=5;b.F.zwischenbilanz(5+Z.vonSichAus,sp(b));const ungeduldig=b.S.target===5&&b.S.zb.art==='antrag';
  const c=welt();geduld(c,B.ruf.geduldig);c.S.target=5;c.F.zwischenbilanz(5+Z.abstand,sp(c));const knapp=c.S.target===5&&c.S.zb.art==='antrag';
  pruef(senkt&&ungeduldig&&knapp,'Vorstand senkt von sich aus: geduldiger Präsident weit hinter dem Ziel, sonst Antrag',`gesenkt ${senkt}, ungeduldig Antrag ${ungeduldig}, knapp Antrag ${knapp}`);}

// 19. Budgetgespräch (U12l): Zusage 0,4 bei Vertrauen 50, Startruf und Sparsamkeit 10, halb so viel bei Glaubwürdigkeit unter 40; zugesagt Transferbudget × 1,2 bis Saisonende,
//     nur einmal je Saison; abgelehnt Vertrauen −3
{const B=welt().B.budgetgespraech,setze=(w,s)=>w.W.ev(`praesident=function(){return{geduld:10,ehrgeiz:10,sparsam:${s}};}`);
  const a=welt();setze(a,10);a.S.trust=50;a.S.ruf=a.B.ruf.start;a.ev('myT()').glaub=60;const c0=a.F.bgChance();a.ev('myT()').glaub=30;const c1=a.F.bgChance();a.ev('myT()').glaub=60;
  a.W.ev('bgChance=function(){return 1;}');const f0=a.ev('zgBudgetFaktor')();a.F.budgetGespraech();const ja=a.S.bg&&a.S.bg.ok===1&&Math.abs(a.ev('zgBudgetFaktor')()-f0*(1+B.plus))<1e-9;
  const t1=a.S.trust;a.W.ev('bgChance=function(){return 0;}');a.F.budgetGespraech();const einmal=a.S.bg.ok===1&&a.S.trust===t1;
  const b=welt();b.S.trust=50;b.W.ev('bgChance=function(){return 0;}');b.F.budgetGespraech();const nein=b.S.bg&&b.S.bg.ok===0&&b.S.trust===50+B.abgelehnt&&b.ev('zgBudgetFaktor')()===1;
  pruef(Math.abs(c0-B.basis)<1e-9&&Math.abs(c1-B.basis*B.glaubFaktor)<1e-9&&ja&&einmal&&nein,'Budgetgespräch: Chance, Zusage mit mehr Budget, einmal je Saison, Ablehnung kostet Vertrauen',
    `Chance ${c0.toFixed(2)} / bei wenig Glaubwürdigkeit ${c1.toFixed(2)}, zugesagt ${ja}, einmal ${einmal}, abgelehnt ${nein}`);}

// U12m. Mitglieder als Stimmen (K28 §5.12): Die Fanstimmung zählt bei der Präsidentenwahl ohne Mitglieder halb, bei einem Mitglied je Platz einfach,
//       ab zwei je Platz anderthalbfach (höchstens). Wirkung: Unterschied der Chance zwischen Fanstimmung 70 und 50.
{const {F,ev,B}=welt(),W=B.praesident.wahl,t=ev('myT()'),m0=t.mitglieder,d=m=>{t.mitglieder=m;t.fanst=70;const a=F.wahlChance(t,null);t.fanst=50;const b=F.wahlChance(t,null);return a-b;};
  const ohne=d(0),eins=d(t.cap),viele=d(t.cap*5);t.mitglieder=m0;
  /* Prüfung ES5, ET5: Während eines Tribünenbaus (bauTag zieht Plätze ab) bleiben Wahlgewicht und Vorkaufsrecht der Mitglieder gleich (kapOhneBau) */
  t.mitglieder=Math.round(t.cap*0.8);const g0=ev('wahlFansGewicht')(t),k0=F.dkMitglieder(t),P=ev('RB').tribuene.plaetze,S=ev('S');S.constr={k:'cap',phase:'bau'};t.cap-=P;
  const bau=Math.abs(ev('wahlFansGewicht')(t)-g0)<1e-9&&Math.abs(F.dkMitglieder(t)-k0)<1e-9;t.cap+=P;S.constr=null;t.mitglieder=m0;
  pruef(Math.abs(ohne-20*W.fans*W.mitglieder[0])<1e-9&&Math.abs(eins-20*W.fans)<1e-9&&Math.abs(viele-20*W.fans*W.mitglieder[1])<1e-9&&bau,'Mitglieder als Stimmen: Gewicht der Fanstimmung 0,5 / 1 / 1,5 nach Mitgliedern je Platz, unverändert während eines Tribünenbaus',
    `Fanstimmung +20 bringt ${ohne.toFixed(3)} / ${eins.toFixed(3)} / ${viele.toFixed(3)}, Bau ohne Einfluss ${bau}`);}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
