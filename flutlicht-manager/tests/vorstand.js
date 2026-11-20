// Vorstand (K28 §5.6, U12a): Formel des Vertrauens, träger Anteil je Woche, schneller Anteil je Spiel mit halbem Gewicht, Ultimatum statt sofortiger Entlassung,
// Ruf als Trainer zum Saisonende und bei Entlassung, Jobangebote nach Ruf. Aufruf: node tests/vorstand.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U12a entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711,nah=(a,b,e=0.01)=>Math.abs(a-b)<=e;
function welt(){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);
  const im=(k,fn)=>W.ev('mitStrom')(W.ev('strom')('test',k),fn);return{W,F,S,ev:W.ev,im,B:W.ev('RV')};}

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

// 9. Rücktritt (K28 §5.3, U12b): sofort weg, Ruf −5 statt −8, Jobangebote; mit dem neuen Job ist der Rücktritt vergessen
{const {S,F,ev,B}=welt();S.phase='play';S.ruf=30;F.ruecktritt();const weg=S.fired===1&&S.ruecktritt===1,r=ev('ruf()'),jobs=(S.jobs||[]).slice();
  if(jobs.length)F.takeJob(jobs[0]);
  pruef(weg&&r===30+B.ruf.ruecktritt&&jobs.length>0&&S.fired===0&&!S.ruecktritt&&S.my===jobs[0],'Rücktritt: sofort weg, Ruf −5, Jobangebote, beim neuen Verein ist alles zurückgesetzt',`Ruf ${r}, ${jobs.length} Angebote`);}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
