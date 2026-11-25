// Wettbewerbe und Spielplan (K13 §10): Pokal-Auslosung mit Töpfen und Heimrecht, Auslosung vor der Runde, Bundesligisten raus in Runde 1,
// Relegation mit Verlängerung und Elfmeterschießen, Supercup, 72 Stunden zwischen zwei Spielen, Zweitmannschaften. Aufruf: node tests/wettbewerbe.js [Saisons=3] [Seed=4]
const {saisons,neueWelt}=require('./sim');
const N=+(process.argv[2]||3),SEED=+(process.argv[3]||4),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const f1=x=>x.toFixed(1),pc=x=>(x*100).toFixed(0)+' %';
const tage={},runde1=[],heimFehler=[],losZuSpaet=[],zweiteFehler=[],supercups=[];let losGeprueft=0;
const {W,F}=saisons({n:N,seed:SEED,verein:6,
  beiSaisonstart:S=>{S.teams.forEach(t=>{if(t.zweite>=0&&S.teams[t.zweite]&&S.teams[t.zweite].lg===t.lg&&t.lg<=3)zweiteFehler.push(`${S.season}: ${t.name}`);});},
  beiSpielen:(liste,S,o)=>{const am=id=>id>=1000||S.teams[id].lg>=3;
    // Relegation und Pokalfinale liegen im echten Kalender (Donnerstag, Samstag, Montag) so dicht, dass ein Verein in beiden dreimal in fünf Tagen spielt: ausgenommen
    const relFinale=new Set();o.gruppen.forEach(g=>{if(g.art==='rel'||g.art==='rel2'||(g.art==='pokal'&&g.e.r===5))g.list.forEach(r=>{relFinale.add(r.h);relFinale.add(r.a);});});
    liste.forEach(r=>{[r.h,r.a].forEach(id=>{if(id<1000&&!relFinale.has(id))(tage[id]=tage[id]||[]).push(S.season*400+o.tag);});
      if(r.supercup)supercups.push({s:S.season,h:r.h,a:r.a,hg:r.hg,ag:r.ag,pen:r.pen,verl:r.ev.some(e=>e.m>90&&e.t!=='E'&&e.t!=='P'),tag:o.tag});});
    o.gruppen.filter(g=>g.art==='pokal').forEach(g=>{const rr=g.e.r,L=S.cup.los;losGeprueft++;if(!L||L.am>=S.plan.pokal[rr][0]-1)losZuSpaet.push(`${S.season} Runde ${rr+1}`);
      g.list.forEach(r=>{if(rr===0)runde1.push({h:r.h,a:r.a,hProfi:!am(r.h),aProfi:!am(r.a),aLg:r.a<1000?S.teams[r.a].lg:9,hLg:r.h<1000?S.teams[r.h].lg:9,sieger:r.hg>r.ag?r.h:r.hg<r.ag?r.a:(r.pen[0]>r.pen[1]?r.h:r.a)});
        if(rr<=4&&am(r.h)!==am(r.a)&&!am(r.h))heimFehler.push(`${S.season} Runde ${rr+1}: ${r.h} – ${r.a}`);});});}});
const S=W.S,ev=W.ev;
// 1. Runde 1: nie zwei Profis gegeneinander (Konsistenzprüfung AK6), Amateure immer zu Hause
const pp=runde1.filter(x=>x.hLg===1&&x.aLg===1).length;pruef(runde1.length>0&&pp===0,'Pokal Runde 1: nie zwei Erstligisten gegeneinander (Profitopf gegen Amateurtopf)',`${pp} von ${runde1.length}`);
pruef(runde1.every(x=>x.hLg>=x.aLg),'Pokal Runde 1: der Verein aus dem Amateurtopf spielt zu Hause (nie ein höherklassiger Gastgeber)',runde1.filter(x=>x.hLg<x.aLg).length+' Ausnahmen');
pruef(heimFehler.length===0,'Pokal bis zum Halbfinale: Amateure (3. Liga und darunter) haben gegen Profis Heimrecht',heimFehler.slice(0,3).join('; ')||'immer');
pruef(losGeprueft>0&&losZuSpaet.length===0,'Auslosung mindestens zwei Tage vor der Runde',losZuSpaet.slice(0,3).join('; ')||`${losGeprueft} Runden`);
// 2. Bundesligisten raus in Runde 1: im Schnitt 2–5 pro Saison (prüfen)
{const raus=runde1.filter(x=>(x.hLg===1&&x.sieger!==x.h)||(x.aLg===1&&x.sieger!==x.a)).length/N;pruef(raus>=1&&raus<=5,'Bundesligisten scheiden in Runde 1 aus: im Schnitt 1–5 pro Saison (Ziel 2–5 prüfen)',f1(raus));}
// 3. 72 Stunden: kein Verein spielt zweimal innerhalb von drei Tagen
{let n=0,b=[];for(const id in tage){const t=[...new Set(tage[id])].sort((a,b)=>a-b);for(let i=1;i<t.length;i++)if(t[i]-t[i-1]<3){n++;if(b.length<3)b.push(`${S.teams[id].name} ${t[i-1]%400}/${t[i]%400}`);}}
  pruef(n===0,'72 Stunden: kein Verein spielt zweimal innerhalb von drei Tagen',n?`${n}× (${b.join('; ')})`:'nie');}
// 4. Zweitmannschaften nie in der Liga der ersten Mannschaft
pruef(zweiteFehler.length===0,'Zweitmannschaften nie in derselben Liga wie die erste',zweiteFehler.join('; ')||'nie');
// 5. Supercup ab der zweiten Saison: Meister gegen Pokalsieger (oder Vizemeister), ohne Verlängerung, bei Gleichstand Elfmeterschießen
pruef(supercups.length===N-1&&supercups.every(x=>!x.verl&&(x.hg!==x.ag)===!x.pen),'Supercup ab der zweiten Saison, ohne Verlängerung, bei Gleichstand Elfmeterschießen',supercups.map(x=>`${x.s}: ${x.hg}:${x.ag}${x.pen?' i.E. '+x.pen.join(':'):''}`).join(', ')||'keiner');
// 6. Relegation direkt simuliert: 16. der 1. Liga gegen 3. der 2. Liga, Hin- und Rückspiel, Rückspiel mit Verlängerung und Elfmeterschießen
{const w=neueWelt();w.F.buildWorld(SEED);const S2=w.W.S;S2.my=-9;const st=id=>S2.pl.filter(p=>p.team===id).map(p=>p.str).sort((a,b)=>b-a).slice(0,14).reduce((a,b)=>a+b,0);
  const l1=S2.teams.filter(t=>t.lg===1).sort((a,b)=>st(b.id)-st(a.id)),l2=S2.teams.filter(t=>t.lg===2).sort((a,b)=>st(b.id)-st(a.id)),e=l1[15].id,z=l2[2].id;
  let erst=0,elf=0,verl=0;const n=300;for(let i=0;i<n;i++){S2.season=7000+i;S2.tag=1;const a=w.F.sim(z,e,{});S2.tag=4;const b=w.F.sim(e,z,{ko:1,agg:[a.ag,a.hg]});
    const s=w.W.ev('relegationSieger')([a,b],[e,z]);if(s===e)erst++;if(b.pen)elf++;if(b.ev.some(x=>x.m>90))verl++;}
  // Echt seit 2009 etwa 80 % (13 von 16 bis 2024). Im Spiel sind der 16. der 1. Liga und der 3. der 2. Liga fast gleich stark (Konsistenzprüfung AI5, K32): nur Plausibilität
  pruef(erst/n>=0.3&&erst/n<=0.85,'Relegation: der Erstligist setzt sich in 30–85 % durch (echt etwa 80 %, Abstand der Kader: AI5)',pc(erst/n));
  pruef(elf>0&&verl>0,'Relegation: Verlängerung und Elfmeterschießen kommen vor, kein Los',`Verlängerung ${pc(verl/n)}, Elfmeterschießen ${pc(elf/n)}`);}
// K13b. Supercup-Prämie: Sieger 3 Mio. €, Verlierer 2 Mio. €; Computer-Vereine aufs Konto, dein Verein als Buchung „Supercup“
{const {W:W2,F:F2}=neueWelt();F2.buildWorld(SEED);const S2=W2.S;S2.my=6;S2.mgr='Test';F2.setTarget();const P=W2.ev('RWB').supercup.praemie,[a,b]=S2.teams.filter(t=>t.id!==6&&t.lg===1);
  const ca=a.cash,cb=b.cash;F2.supercupPraemie({h:a.id,a:b.id},a.id);const ki=a.cash-ca===P.sieger&&b.cash-cb===P.verlierer;
  const f0=S2.fin['Supercup']||0;F2.supercupPraemie({h:6,a:b.id},b.id);const mein=(S2.fin['Supercup']||0)-f0===P.verlierer;
  pruef(ki&&mein,'Supercup-Prämie: Sieger und Verlierer, Computer-Vereine und dein Verein',`Computer ${ki}, dein Verein ${mein}`);}

// K13c. Pokalmeldungen: Sensation nur, wenn ein Erstligist gegen einen Amateurverein oder Drittligisten ausscheidet (nicht gegen einen Zweitligisten);
//       Los des Jahres bei einem Spitzenverein gegen einen Amateurverein
{const {W:W3,F:F3}=neueWelt();F3.buildWorld(SEED);const S3=W3.S;S3.my=-9;const l1=S3.teams.filter(t=>t.lg===1).sort((a,b)=>b.rep-a.rep),top=l1[0],mid=S3.teams.find(t=>t.lg===2),am=1000;
  const n=k=>S3.news.filter(x=>x.t.startsWith(k)).length;F3.pokalSensationen([{h:am,a:top.id,hg:2,ag:1},{h:mid.id,a:top.id,hg:0,ag:3}]);const s1=n('Pokalsensation');
  F3.pokalSensationen([{h:mid.id,a:top.id,hg:2,ag:1}]);const s2=n('Pokalsensation');const paare=[[mid.id,l1[5].id],[am,top.id]];
  const r1=F3.pokalLosDesJahres(paare,0),los=F3.pokalLosDesJahres(paare,1),noch=F3.pokalLosDesJahres(paare,2); /* Prüfung EE4: nicht in Runde 1, einmal je Saison */
  pruef(s1===1&&s2===1&&r1===null&&!!los&&los[1]===top.id&&noch===null&&n('Pokal-Los des Jahres')===1,'Pokalmeldungen: Sensation nur gegen Amateure oder Drittligisten, Los des Jahres nicht in Runde 1 und einmal je Saison',
    `Sensationen ${s1}/${s2}, Runde 1 ${r1}, Los ${los&&los.join('–')} (Ansehen ${top.rep}), zweites Mal ${noch}`);}

// K13d. Spielverlegung (K13 §13): nur mit weniger als 16 einsatzfähigen Spielern (oder ohne Torwart), für das nächste Ligaspiel in höchstens 7 Tagen, einmal je Saison.
//       Der neue Termin liegt nach dem alten, hat drei Tage Abstand zu allen Spielen beider Vereine, ist kein Montag und liegt vor dem letzten Spieltag.
{const {W:W4,F:F4}=neueWelt();F4.buildWorld(SEED);const S4=W4.S,ev4=W4.ev,V=ev4('RWB').verlegung,M=ev4('RWB').spielplan.mindestTage;S4.my=6;S4.mgr='Test';S4.phase='play';
  let e=null;for(let d=S4.tag+1;d<S4.plan.ende&&!e;d++){const x=F4.meinSpiel(d);if(x&&x.art==='liga')e=x;}
  let ok=false,info='kein Ligaspiel gefunden';
  if(e){S4.tag=e.tag-2;const sq=ev4('squad')(S4.my);sq.forEach(p=>{p.inj=0;});const voll=F4.spielVerlegenLauf();let n=sq.length;for(const p of sq){if(n<V.minSpieler)break;if(p.pos!=='TW'){p.inj=10;n--;}}
    /* EI3, EI4 (Prüfung EJ): Termin vor dem nächsten eigenen Ligaspiel, Abstand zu einem Testspiel */const x0=F4.verlegungTag(e);let nl=Infinity;S4.fx[e.lg].forEach((md,k)=>{if(k<=e.md)return;md.forEach(([x,y],i)=>{if(x===S4.my||y===S4.my)nl=Math.min(nl,S4.plan.zeit[e.lg][k][i][0]);});});
    S4.testspiele=[{id:99,tag:x0,gegner:1000,stand:'zugesagt'}];const mitTs=F4.verlegungTag(e);S4.testspiele=[];const vorNaechstem=x0!=null&&x0+M<=nl,tsAbstand=mitTs==null||Math.abs(mitTs-x0)>=M;
    /* Prüfung EL1: EI3 unterscheidbar. Rückt das nächste eigene Ligaspiel auf alt + M + 1, bleibt davor kein Tag (der Code vor EI3 fände einen danach). EI4, Lage: ein Supercup
       am Vortag versperrt das Ligaspiel nicht (der Code vor EI4 sah nur das nächste Spiel) */
    let nk=null;S4.fx[e.lg].forEach((md,k)=>{if(k<=e.md||nk)return;md.forEach(([x,y],i)=>{if(!nk&&(x===S4.my||y===S4.my))nk=S4.plan.zeit[e.lg][k][i];});});
    const nk0=nk?nk[0]:null;if(nk)nk[0]=S4.plan.zeit[e.lg][e.md][e.i][0]+M+1;const ohneTag=nk?F4.verlegungTag(e):'kein weiteres Ligaspiel';if(nk)nk[0]=nk0;
    const sc0=S4.supercup;S4.supercup={h:S4.my,a:S4.teams.find(t=>t.id!==S4.my).id,tag:e.tag-1};const lageMit=F4.verlegungLage();S4.supercup=sc0;const lageOk=!!lageMit&&lageMit.e.tag===e.tag;
    const z=S4.plan.zeit[e.lg][e.md][e.i],alt=z[0],[h,a]=S4.fx[e.lg][e.md][e.i],r=F4.spielVerlegenLauf(),neu=z[0],Z=S4.plan.zeit[e.lg],letzter=Math.min(...Z[Z.length-1].map(x=>x[0]));
    const abstand=[h,a].every(id=>[...F4.spieltageVon(id,z)].every(x=>Math.abs(x-neu)>=M)),zweimal=F4.spielVerlegenLauf();
    ok=typeof voll==='string'&&vorNaechstem&&tsAbstand&&ohneTag===null&&lageOk&&r===null&&neu>alt&&abstand&&neu<letzter&&ev4('wochentag')(neu)!==1&&typeof zweimal==='string'&&zweimal.includes('schon eine Verlegung'); /* EI5 */
    info=`voller Kader ${typeof voll==='string'?'abgelehnt':voll}, vor dem nächsten Ligaspiel ${vorNaechstem}, Abstand zum Testspiel ${tsAbstand}, ohne Tag davor ${ohneTag}, Lage trotz Supercup ${lageOk}, Antrag ${r}, ${alt} → ${neu}, Abstand ${abstand}, vor dem letzten Spieltag ${neu<letzter}, zweiter Antrag ${typeof zweimal==='string'?'abgelehnt':zweimal}`;}
  pruef(ok,'Spielverlegung: nur bei Personalnot, neuer Termin mit Abstand, einmal je Saison',info);}

// K13e. Pokal-Rotation rächt sich (K13 §8): Aus als Favorit (gegen Amateure oder ein Niveau mindestens rotation.favorit darunter) mit mindestens rotation.wechsel
//       getauschten Spielern gegenüber dem letzten Ligaspiel gibt eine Meldung; nicht bei wenigen Wechseln, nicht gegen einen gleich starken Gegner, nicht nach einem Sieg.
{const {W:W4,F:F4}=neueWelt();F4.buildWorld(SEED);const S4=W4.S,ev4=W4.ev;S4.my=6;S4.mgr='Test';S4.phase='play';const P=ev4('RWB').pokal.rotation,sq=ev4('squad')(6).map(p=>p.id);
  const alt=sq.slice(0,11),neu=[...sq.slice(0,11-P.wechsel),...sq.slice(11,11+P.wechsel)],wenig=[...sq.slice(0,12-P.wechsel),...sq.slice(11,10+P.wechsel)];S4.ligaXI={s:S4.season,t:6,ids:alt};
  const lv=ev4('teamLevel'),gleich=S4.teams.filter(t=>t.id!==6&&t.lg===1).sort((a,b)=>Math.abs(lv(a.id)-lv(6))-Math.abs(lv(b.id)-lv(6)))[0].id,spiel=(a,xi,hg,ag)=>({h:6,a,hg,ag,pen:null,xi:[xi,[]]});
  const amateur=F4.pokalRotation(spiel(1000,neu,0,1)),zuWenig=F4.pokalRotation(spiel(1000,wenig,0,1)),gegenGleich=Math.abs(lv(gleich)-lv(6))<P.favorit?F4.pokalRotation(spiel(gleich,neu,0,1)):0,sieg=F4.pokalRotation(spiel(1000,neu,2,1));
  /* Prüfung FC6: Ohne Ligaspiel dieser Saison (Elf der Vorsaison) zählt die beste Elf: mit ihr keine Meldung, mit rotation.wechsel anderen Spielern die Meldung */
  S4.ligaXI.s=S4.season-1;const b=ev4('bestXI')(6,ev4('myT()').form),rest=sq.filter(id=>!b.includes(id)),mitBester=F4.pokalRotation(spiel(1000,b.slice(),0,1));
  const ohneBeste=F4.pokalRotation(spiel(1000,[...b.slice(0,b.length-P.wechsel),...rest.slice(0,P.wechsel)],0,1)),text=S4.news[0]&&String(S4.news[0].t).includes('besten Elf');
  /* Prüfung FD3: Die beste Elf von vor dem Anpfiff (bxi im Ergebnis) gilt, nicht die nach dem Spiel; pokalBezugsElf nur für dein Spiel und ohne Ligaspiel dieser Saison */
  const andere=[...b.slice(0,b.length-P.wechsel),...rest.slice(0,P.wechsel)],vorher=F4.pokalRotation(Object.assign(spiel(1000,andere.slice(),0,1),{bxi:andere.slice()})),be=ev4('pokalBezugsElf');
  const fremd=be([[S4.teams.find(t=>t.id!==6).id,1000]]),eigen=be([[6,1000]]);S4.ligaXI.s=S4.season;const mitLiga=be([[6,1000]]);S4.ligaXI.s=S4.season-1;
  const fd3=vorher===0&&fremd===null&&Array.isArray(eigen)&&eigen.length===b.length&&mitLiga===null&&/mitWettbewerb\('pokal'/.test(String(be)); /* FF1: mit den Sperren des Pokals */
  pruef(amateur===P.wechsel&&zuWenig===0&&gegenGleich===0&&sieg===0&&mitBester===0&&ohneBeste===P.wechsel&&text&&sq.length>=11+P.wechsel&&fd3,
    'Pokal-Rotation: Meldung nach dem Aus als Favorit mit vielen Wechseln, nicht bei wenigen, nicht gegen Gleichstarke, nicht nach Sieg; vor dem ersten Ligaspiel gegenüber der besten Elf (vor dem Anpfiff, FD3)',
    `gegen Amateure ${amateur}, zu wenig ${zuWenig}, gegen Gleichstarke ${gegenGleich}, nach Sieg ${sieg}, beste Elf ${mitBester}, ohne die beste Elf ${ohneBeste} (Meldung ${text}), FD3: Elf vor dem Anpfiff ${vorher}, fremdes Spiel ${fremd}, eigenes ${eigen&&eigen.length}, mit Ligaspiel ${mitLiga}`);}

// K13f. Länderspiele (K13 §3.4, §5.1), nur mit Schalter: aus wird niemand abgestellt; an am ersten Tag der Pause die Stärksten je Nation ab der Schwelle
//       (höchstens max, nur Spieler deutscher Vereine markiert); sie fehlen (avail) bis zum letzten Tag der Pause (FM1), danach kehren sie zurück, Stammkräfte mit weniger Frische.
{const {W:W5,F:F5}=neueWelt();F5.buildWorld(SEED);const S5=W5.S,ev=W5.ev;S5.my=6;S5.mgr='Test';F5.setTarget();
  const L=ev('RWB').laenderspiele,x=S5.plan.pausen.find(y=>y.name==='Länderspielpause'),abs=ev('absTag'),av=ev('avail'),bn=ev('beiNationalteam');
  S5.tag=x.von;F5.laenderspielTag(x.von);const aus=!S5.pl.some(p=>p.lsp);
  L.an=true;F5.laenderspielTag(x.von);const nom=S5.pl.filter(p=>p.lsp),je={};nom.forEach(p=>{je[p.nat]=(je[p.nat]||0)+1;});
  const schwelle=nom.every(p=>p.str>=ev('lsSchwelle')(p.nat)&&p.team>=0&&p.team<ev('AV0')&&p.lspN===1&&p.lspZ===abs(x.von)),max=Object.values(je).every(n=>n<=L.max),fehlt=nom.length>0&&nom.every(p=>!av(p)&&bn(p))&&nom.some(p=>F5.status(p).includes('Nationalmannschaft')); /* K13i: Kaderliste zeigt es */
  const bis=nom.length?nom[0].lsp.bis:0,st=nom.find(p=>p.lsp.st);if(st)st.fit=100;
  S5.tag=x.bis+2;F5.laenderspielTag(x.bis+2);const zurueck=nom.every(p=>!p.lsp)&&(!st||st.fit<100||st.inj>0);L.an=false;
  pruef(aus&&nom.length>0&&schwelle&&max&&fehlt&&zurueck&&bis===abs(x.bis),'Länderspiele: nur mit Schalter, Stärkste je Nation ab der Schwelle, fehlen bis nach der Pause, kommen müde zurück',
    `aus ${aus}, nominiert ${nom.length} (${Object.keys(je).length} Nationen), Schwelle ${schwelle}, höchstens ${L.max} ${max}, fehlen ${fehlt}, Ende ${bis}/${abs(x.bis)}, zurück ${zurueck}`);}

// Prüfung FM2, FO2: Der Auslandspool zählt bei der Rangfolge mit. Eigene Welt, die vollständige Rangfolge einer Nation (deutsche Vereine und Pool) wie in lsNominieren,
//       max = ihre Länge, eine Nation, deren Letzter bei einem deutschen Verein spielt; ein starker Poolspieler dazu verdrängt genau diesen.
{const {W:W9,F:F9}=neueWelt();F9.buildWorld(SEED);const S9=W9.S,ev=W9.ev,L=ev('RWB').laenderspiele,x=S9.plan.pausen.find(y=>y.name==='Länderspielpause'),s=ev('lsSchwelle'),AV0=ev('AV0'),av=ev('avVon'),akt=ev('aktiv');
  const pool=(S9.ausland&&S9.ausland.pl)||[],dabei=p=>p.team>=0&&!!p.nat&&!(p.inj>0)&&(p.team<AV0?!!S9.teams[p.team]&&akt(S9.teams[p.team]):!!av(p.team));
  const gut=p=>{const t=s(p.nat);return p.str>=t&&!(p.str<t+L.rand&&((p.form||0)<L.formMin||(p.sp||0)<L.praxisMin));},nach={};
  [...S9.pl,...pool].filter(p=>dabei(p)&&gut(p)).forEach(p=>{(nach[p.nat]=nach[p.nat]||[]).push(p);});Object.values(nach).forEach(l=>l.sort((a,b)=>b.str-a.str||a.id-b.id));
  const N=Object.keys(nach).find(n=>nach[n].length>=2&&nach[n].length<=L.max&&nach[n][nach[n].length-1].team<AV0),q=pool.find(y=>!!av(y.team)&&y.nat!==N);let ok=false,info='keine passende Nation';
  if(N&&q){const E=nach[N],w=E[E.length-1],m0=L.max,q0={nat:q.nat,str:q.str,inj:q.inj,form:q.form,sp:q.sp};Object.assign(q,{nat:N,str:200,inj:0,form:10,sp:100});L.max=E.length;L.an=true;S9.tag=x.von;F9.laenderspielTag(x.von);
    ok=!w.lsp&&E.slice(0,-1).every(p=>p.team>=AV0||!!p.lsp)&&!q.lsp&&q.lspN===1;info=`${N}: ${E.length} Spieler, Letzter ${w.n} ${w.lsp?'nominiert':'verdrängt'}, Poolspieler gezählt ${q.lspN===1}`;
    L.an=false;L.max=m0;Object.assign(q,q0);delete q.lspN;delete q.lspZ;S9.pl.forEach(p=>{delete p.lsp;delete p.lspN;delete p.lspZ;});}
  pruef(ok,'Länderspiele: der Auslandspool zählt bei der Rangfolge mit (FM2, FO7)',info);}

// K13h. Marktwert der Nationalspieler (K13 §3.4): bis marktwert.tage nach der letzten Nominierung (p.lspZ) marktwert.plus mehr, nur mit Schalter.
{const {W:W6,F:F6}=neueWelt();F6.buildWorld(SEED);const S6=W6.S,ev=W6.ev,L=ev('RWB').laenderspiele,val=ev('value'),abs=ev('absTag');S6.my=6;
  const p=S6.pl.filter(x=>x.team>=0&&x.team<1000&&x.age>=24).sort((a,b)=>b.str-a.str)[0],v0=val(p);p.lspZ=abs(S6.tag);const aus=val(p)===v0;L.an=true;const an=val(p);
  p.lspZ=abs(S6.tag)-L.marktwert.tage-1;const alt=val(p);L.an=false;delete p.lspZ;
  pruef(aus&&an>v0&&Math.abs(an/v0-(1+L.marktwert.plus))<0.02&&alt===v0,'Marktwert der Nationalspieler: mehr nach einer Nominierung, nur mit Schalter, nach einem Jahr wieder normal',
    `ohne Schalter ${aus}, ${v0} → ${an}, zu lange her ${alt===v0}`);}

// Prüfung FM10, FN5, FN10: Rückkehr von der Nationalmannschaft. Unter minMin Minuten zählt kein Länderspiel (keine Müdigkeit); eine Stammkraft kommt müde zurück,
//       die Saisonbelastung höchstens bis 100, eine Verletzung setzt lspV; eine über zwei Tage alte Abstellung verfällt ohne Folgen.
{const {W:W7,F:F7}=neueWelt();F7.buildWorld(SEED);const S7=W7.S,ev=W7.ev,L=ev('RWB').laenderspiele,abs=ev('absTag');S7.my=6;
  const [p,q,r]=S7.pl.filter(x=>x.team>=0&&x.team<1000&&!(x.inj>0)),a=abs(S7.tag),m0=L.minuten,v0=L.verletzung;L.an=true;
  L.minuten=[5,5];p.fit=100;p.lsp={von:a-5,bis:a-1,n:2,st:0};F7.laenderspielTag(S7.tag);const kurz=!p.lsp&&p.fit===100;
  q.fit=100;q.sb=99;L.verletzung=1;q.lsp={von:a-5,bis:a-1,n:2,st:1};F7.laenderspielTag(S7.tag);const lang=!q.lsp&&q.fit<100&&q.sb===100&&q.inj>0&&q.lspV===a;
  r.fit=100;const st0=r.st;r.lsp={von:a-20,bis:a-10,n:2,st:1};F7.laenderspielTag(S7.tag);const alt=!r.lsp&&r.fit===100&&r.st===st0&&!(r.inj>0);
  L.minuten=m0;L.verletzung=v0;L.an=false;
  pruef(kurz&&lang&&alt,'Länderspiele: Rückkehr nach Minuten, Belastung höchstens 100, Verletzung gemerkt, veraltete Abstellung ohne Folgen',`kurz ${kurz}, Stammkraft ${lang} (Frische ${q.fit}, Belastung ${q.sb}), veraltet ${alt}`);}

// K13j. Pokal-Rotation der Favoriten (K13 §4), nur mit Schalter: gegen einen Amateur in Runde 1 ohne die Müden; nicht nach bisRunde, nicht in der Liga, nicht ohne
//       Favoritenrolle; dein Verein nur, wenn der Co-Trainer aufstellt. Die Pokalspiele geben die Runde mit (market-unabhängig, ablauf.js).
{const {W:W8,F:F8}=neueWelt();F8.buildWorld(SEED);const S8=W8.S,ev=W8.ev,R=ev('RWB').pokal.rotationKI,rk=ev('pokalRotationKader');S8.my=6;
  const t=S8.teams.find(x=>x.id!==6&&x.lg===1),sq=ev('squad')(t.id),m=sq.find(p=>p.pos!=='TW'),o={wb:'pokal',runde:0};sq.forEach(p=>{p.fit=100;});m.fit=R.frische-10;
  const aus=rk(t.id,1000,o)===undefined;R.an=true;const k=rk(t.id,1000,o),ohneMuede=!!k&&!k.includes(m)&&k.length===sq.length-1;
  const spaet=rk(t.id,1000,{wb:'pokal',runde:R.bisRunde+1})===undefined,liga=rk(t.id,1000,{wb:'liga'})===undefined,gleich=rk(t.id,t.id,o)===undefined;
  const mein=ev('autoB')('aufstellung')?!!rk(6,1000,o):rk(6,1000,o)===undefined;R.an=false;
  const runde=String(ev('tagesSpieleVorbereiten')).includes('runde:e.r')&&String(ev('side')).includes('bestXI(tid,t.form,kader)');
  pruef(aus&&ohneMuede&&spaet&&liga&&gleich&&mein&&runde,'Pokal-Rotation der Favoriten: nur mit Schalter, früh im Pokal gegen Schwächere ohne die Müden, dein Verein nur mit Automatik',
    `aus ${aus}, ohne Müde ${ohneMuede}, spätere Runde ${spaet}, Liga ${liga}, gleich stark ${gleich}, dein Verein ${mein}, Anschluss ${runde}`);}

// K13k. Turniere im Sommer (K13 §3.4), nur mit Länderspielen: im EM-Jahr fehlen Spieler europäischer Nationen bis nach dem Trainingsauftakt, mit 3 bis 7 Spielen und
//       Saisonbelastung; im Jahr ohne Turnier und ohne Schalter nichts; im WM-Jahr eine Meldung zur WM. Aufruf beim Saisonwechsel vor der Aufstellung.
{const {W:WA,F:FA}=neueWelt();FA.buildWorld(SEED);const SA=WA.S,ev=WA.ev,L=ev('RWB').laenderspiele,T=L.turnier,U=ev('UEFA_NATIONEN'),abs=ev('absTag'),s0=SA.season;SA.my=6;
  SA.season=2028;FA.turnierSommer();const aus=!SA.pl.some(p=>p.lsp);L.an=true;SA.season=2027;FA.turnierSommer();const keins=!SA.pl.some(p=>p.lsp);
  SA.season=2028;const sb={};SA.pl.forEach(p=>{sb[p.id]=p.sb||0;});FA.turnierSommer();const nom=SA.pl.filter(p=>p.lsp);
  const em=nom.length>0&&nom.every(p=>U.includes(p.nat)&&p.lsp.n>=3&&p.lsp.n<=3+T.stufenEm.length-2&&p.sb===Math.min(100,sb[p.id]+T.belastung)&&p.lsp.bis>abs(SA.tag));
  SA.pl.forEach(p=>{delete p.lsp;});SA.season=2030;FA.turnierSommer();const wm=String(SA.news[0].t).includes('WM 2030');SA.pl.forEach(p=>{delete p.lsp;});L.an=false;SA.season=s0;
  const aufruf=String(ev('newSeasonLauf')).includes('turnierSommer();S.lineup=besteElfDu()');
  pruef(aus&&keins&&em&&wm&&aufruf,'Turniere im Sommer: nur mit Schalter und im Turnierjahr, EM nur mit Europäern, Spiele und Belastung, WM-Meldung',
    `aus ${aus}, kein Turnier ${keins}, EM ${em} (${nom.length} Spieler), WM ${wm}, Aufruf ${aufruf}`);}

console.log(`\n${N} Saison(s) in ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
