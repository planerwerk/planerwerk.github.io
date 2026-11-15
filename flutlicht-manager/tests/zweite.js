// Zweite Mannschaft (K08 §5.6, U9d): Daten 2026/27, Amateurkader, Budget als Prozess mit Deckel, Platzierung, Auf- und Abstieg mit der Regel für Drittligisten,
// Jugend in die Zweite, Aufrücken, Verkauf, Abgang mit 24, Automatik, Kosten, Hoffenheim II und Stuttgart II als Verein in der 3. Liga, Speichern und Laden, zwei Saisons im Ablauf.
// Aufruf: node tests/zweite.js [Seed=5]. Nur Node.js.
const {neueWelt,saisons}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %',f1=x=>x.toFixed(1),m=l=>l.length?l.reduce((a,b)=>a+b,0)/l.length:0;
const welt=(kurz='BMG')=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev,id=S.teams.findIndex(t=>t.sh===kurz);S.my=id;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(id,ev('myT()').form);
  const im=(k,fn)=>ev('mitStrom')(ev('strom')('test',k),fn);return{W,F,S,ev,im,t:ev('myT()'),RZ:ev('RZ'),id};};
// Eine Saison der Zweiten ohne den übrigen Ablauf: 44 Wochen, Saisonende, 1. Juli
const saisonZweite=(w,y,ohneAuf)=>{const {F,S,ev,im}=w;S.phase='play';for(let k=0;k<44;k++)im(`w${y}_${k}`,()=>F.zweiteWoche(k*7));const st=ev('zweiteStaerke()');
  im('e'+y,()=>F.zweiteSaisonEnde(null));if(ohneAuf)S.zwErg=null;im('s'+y,()=>{F.zweiteSaison();F.zweiteAuffuellen();});S.season++;return st;};

// 1. Daten 2026/27: Vereine mit Zweite in Regionalliga und Oberliga, Hoffenheim II und Stuttgart II in der 3. Liga, Vereine ohne Zweite. Keine Zweite eines Drittligisten in der Regionalliga.
{const {W,ev}=welt(),V=ev('VEREINE'),rl=V.filter(v=>v.zw===4),ol=V.filter(v=>v.zw===5),dritt=V.filter(v=>v.liga===3&&v.zw===4),ohneOl=ol.filter(v=>!v.ol),ii=V.filter(v=>v.zweite);
  const keine=['B04','RBL','FCU','WOB','FCH'].filter(k=>V.find(v=>v.kurz===k).zw);
  pruef(rl.length===20&&ol.length===15&&!dritt.length&&!ohneOl.length&&ii.length===2&&!keine.length&&V.filter(v=>v.zw).every(v=>v.liga<=3),'Daten: 20 Zweite in der Regionalliga, 15 in der Oberliga, Hoffenheim II und Stuttgart II in der 3. Liga, Leverkusen, Leipzig, Union, Wolfsburg und Heidenheim ohne Zweite, keine Zweite eines Drittligisten in der Regionalliga',`${rl.length} + ${ol.length} + ${ii.length}`);
  const S=W.S,mit=S.teams.filter(t=>t.lg<=3).filter(t=>{S.my=t.id;return ev('hatZweite()');}).length,zw=S.teams.filter(t=>t.zweite>=0).length;
  pruef(mit===37&&zw===2,'Jeder Verein mit Zweite in den Daten hat eine im Spiel, eine Zweite selbst hat keine',`${mit} Vereine`);}

// 2. Amateurkader: 22 Spieler von 18 bis 23 Jahren, eigener Nummernkreis, nicht im Profikader, über die Spielerkarte erreichbar, mit Nationalität. Liga und Kosten nach Stufe.
{const {S,ev,t,RZ}=welt('BMG');const l=ev('zweiteKader()'),PIX=ev('PIX');
  pruef(l.length===RZ.kader.soll&&l.every(p=>p.team===-4&&p.id>=700000&&p.age>=18&&p.age<=23&&PIX.get(p.id)===p&&p.nat&&p.sal===0)&&!S.pl.some(p=>p.team===-4),'Amateurkader: 22 Spieler von 18 bis 23 Jahren, eigener Nummernkreis ab 700.000, nicht im Profikader, über die Spielerkarte erreichbar',`${l.length} Spieler, ${ev('zweiteLigaName()')}`);
  const pos={};l.forEach(p=>pos[p.pos]=(pos[p.pos]||0)+1);pruef(Object.keys(RZ.kader.pos).every(k=>pos[k]===RZ.kader.pos[k]),'Amateurkader: Positionen nach der Sollverteilung (3 TW, 7 AB, 7 MF, 5 ST)',JSON.stringify(pos));
  const k3=ev('zweiteKosten()');t.zws=5;const k5=ev('zweiteKosten()');S.zwL=5;const k5o=ev('zweiteKosten()');S.zwL=4;
  pruef(ev('zweiteStufe()')===5&&k3===RZ.stufe.kosten[3]&&k5===RZ.stufe.kosten[5]&&k5o===Math.round(RZ.stufe.kosten[5]*RZ.ligen[5].kosten),'Kosten je Ligaspieltag nach Stufe, in der Oberliga 30 %',`Stufe 3 ${k3} €, Stufe 5 ${k5} €, Oberliga ${k5o} €`);}

// 3. Budget als Prozess (deine Vorgabe vom 13.11.): Stufe 5 macht die Zweite über Jahre besser als Stufe 1, der Umschwung dauert mehrere Saisons, der Deckel hält
{const lauf=(stufe,jahre,wechsel)=>{const w=welt('BMG');w.t.zws=stufe;w.ev('zweiteKader()');const st=[];for(let y=0;y<jahre;y++){if(wechsel&&y===wechsel[0])w.t.zws=wechsel[1];w.S.zwL=4;st.push(saisonZweite(w,y,true));}return{st,w};};
  const a=lauf(1,8),b=lauf(5,8),eq1=m(a.st.slice(4)),eq5=m(b.st.slice(4)),L=b.w.RZ.ligen[4];
  pruef(eq5-eq1>=4&&eq1<L.schnitt&&eq5>=L.gut-1.5,'Budget: Mit Stufe 5 ist die Zweite nach einigen Jahren deutlich stärker als mit Stufe 1 (mindestens 4 Punkte), Stufe 1 unter dem Ligaschnitt, Stufe 5 nahe an einem guten Team',`${f1(eq1)} gegen ${f1(eq5)} (Schnitt ${L.schnitt}, gut ${L.gut})`);
  const c=lauf(1,12,[4,5]),vor=m(c.st.slice(2,4)),ziel=eq5,n80=c.st.slice(4).findIndex(s=>s>=vor+0.8*(ziel-vor));
  pruef(n80>=2,'Budget: Nach dem Wechsel von Stufe 1 auf 5 dauert es mindestens drei Saisons, bis 80 % des Abstands aufgeholt sind (Neue kommen nur im Sommer)',`${c.st.map(f1).join(' ')}, 80 % in Saison ${n80+1}`);
  const w=b.w,dk=w.ev('zweiteDeckel()'),wert=w.ev('zweiteWertung()'),neu=[];w.im('deckel',()=>{for(let i=0;i<300;i++)neu.push(w.F.zweiteNeu([]));});
  pruef(wert<=dk+1e-9&&neu.every(p=>p.pot<=Math.floor(dk+w.RZ.kader.talentUeber)&&p.str<=p.pot&&p.age>=18&&p.age<=21),'Deckel: Gewertet wird die Zweite höchstens wie ein gutes Team ihrer Liga, kein Neuer hat mehr Talent als Deckel + 2',`Wertung ${f1(wert)}, Deckel ${f1(dk)}, bestes Talent ${Math.max(...neu.map(p=>p.pot))}`);
  const v=welt('VER'),dkV=v.ev('zweiteDeckel()'),lvl=v.ev('teamLevel')(v.id);
  pruef(Math.abs(dkV-(lvl-v.RZ.deckel.profiAbstand))<1e-9&&v.ev('zweiteLiga()')===5,'Deckel: Bei einem Drittligisten (Verl, Oberliga) liegt die Zweite mindestens 8 Punkte unter der Kaderstärke der Profis',`Deckel ${f1(dkV)}, Profis ${f1(lvl)}`);}

// 4. Platzierung aus der Stärke: ein gutes Team (am Deckel) landet vorn und wird manchmal Meister, ein durchschnittliches im Mittelfeld, ein schwaches steigt oft ab
{const {ev,im,RZ}=welt();const L=RZ.ligen[4],tab=w=>im('tab'+w,()=>{const l=[];for(let i=0;i<500;i++)l.push(ev('zweiteTabelle')(w,L).platz);return l;});
  const gut=tab(L.gut),mitte=tab(L.schnitt),schwach=tab(L.schnitt-4),meister=gut.filter(x=>x===1).length/gut.length,ab=schwach.filter(x=>x>L.teams-L.ab).length/schwach.length;
  pruef(m(gut)>=2.5&&m(gut)<=6&&meister>=0.05&&meister<=0.3&&m(mitte)>=7.5&&m(mitte)<=11.5&&ab>=0.5,'Platzierung: am Deckel im Schnitt Platz 2,5 bis 6 und 5 bis 30 % Meister, im Ligaschnitt Platz 7,5 bis 11,5, vier Punkte darunter mindestens jede zweite Saison Abstieg',
    `Platz ${f1(m(gut))} (${pc(meister)} Meister), ${f1(m(mitte))}, ${f1(m(schwach))} (${pc(ab)} Abstieg)`);}

// 5. Auf- und Abstieg: Abstieg aus der Regionalliga, Aufstieg aus der Oberliga, Verzicht als Meister der Regionalliga, Regel für Drittligisten
{const w=welt('BMG'),{S,F,ev,im,t}=w;ev('zweiteKader()');const erg=(platz,liga)=>{S.zwL=liga;S.zwErg={platz,s:S.season,v:S.my,liga,teams:18};im('auf'+platz+liga,()=>F.zweiteSaison());S.season--;return S.zwL;};
  // zweiteSaison erhöht die Saison nicht, das tut newSeason. Für die Prüfung bleibt die Saison gleich.
  const ab=erg(17,4),auf=erg(1,5),bleib=erg(1,4),mitte=erg(8,4);S.season++;
  pruef(ab===5&&auf===4&&bleib===4&&mitte===4&&S.news.some(n=>n.t.includes('verzichtet auf den Aufstieg in die 3. Liga')),'Auf- und Abstieg: Platz 17 in der Regionalliga steigt ab, der Oberliga-Meister steigt auf, der Regionalliga-Meister bleibt (Verzicht)',`${ab}, ${auf}, ${bleib}, ${mitte}`);
  t.lg=3;S.zwL=4;S.zwErg=null;im('dritt',()=>F.zweiteSaison());const zwang=S.zwL;S.zwErg={platz:1,s:S.season,v:S.my,liga:5,teams:18};im('dritt2',()=>F.zweiteSaison());const kein=S.zwL;t.lg=1;
  pruef(zwang===5&&kein===5&&S.news.some(n=>n.t.includes('darf nicht in der Regionalliga spielen')),'Regel des DFB: Die Zweite eines Drittligisten muss in die Oberliga und darf als Meister nicht aufsteigen',`${zwang}, ${kein}`);}

// 6. Jugend in die Zweite, Aufrücken aus der Zweiten, Verkauf, Abgang mit 24, Auffüllen auf 22, höchstens 26
{const {S,F,ev,im,t,RZ}=welt('BMG');const RJ=ev('RJ'),jg=ev('jugendKader()'),z0=ev('zweiteKader()').length,j=jg.find(p=>p.age>=17),jung=jg.find(p=>p.age<17);
  F.jugendInZweite(jung.id);F.jugendInZweite(j.id);const zw=ev('zweiteKader()');
  pruef(zw.includes(j)&&j.team===-4&&j.zwJ===1&&!ev('jugendKader()').includes(j)&&ev('jugendKader()').includes(jung)&&zw.length===z0+1,'Jugend in die Zweite: ab 17 Jahren, er bleibt mit eigenem Kennzeichen in der Zweiten, ein Jüngerer bleibt in der Jugend',`${j.n}, ${j.age} Jahre`);
  const a=zw.slice().sort((x,y)=>y.str-x.str)[0],sp=a.sp,k0=ev('squad')(S.my).length;F.zweiteAufruecken(a.id);
  pruef(a.team===S.my&&S.pl.includes(a)&&!ev('zweiteKader()').includes(a)&&a.ct===RZ.aufruecken.vertrag&&a.sal===Math.round(ev('salaryFor')(a.str)*RZ.aufruecken.gehalt/1000)*1000&&a.st!=null&&a.sp===sp&&ev('squad')(S.my).length===k0+1,'Aufrücken aus der Zweiten: Profivertrag über drei Jahre zum halben Gehalt, die Spielpraxis bleibt',`${a.n}, ${a.age} Jahre, Gehalt ${a.sal}`);
  const v=ev('zweiteKader()').find(p=>p.age>=18);v.str=63;v.pot=72;const preis=ev('zweitePreis')(v),c0=t.cash,ab0=(S.jgAb||[]).length;F.zweiteVerkaufen(v.id);
  const s=ev('zweiteKader()').find(p=>p.age>=18);s.str=40;s.pot=44;s.age=23;const c1=t.cash;F.zweiteVerkaufen(s.id);
  const knapp=ev('zweiteKader()').find(p=>p.age>=18&&p!==s);knapp.str=RZ.verkauf.abStaerke-1;knapp.pot=70;const kp=ev('zweitePreis')(knapp);
  pruef(preis>0&&preis===Math.round(ev('value')(v)*RZ.verkauf.faktor/RJ.verkauf.runden)*RJ.verkauf.runden&&t.cash===c0+preis&&!ev('PIX').get(v.id)&&S.jgAb.length===ab0+1&&t.cash===c1&&ev('zweiteKader()').includes(s)&&kp===0,'Verkauf aus der Zweiten: die Hälfte des Marktwerts mit Beteiligung am Weiterverkauf, nur ab der Stärke eines Drittliga-Kaderspielers (59), für Schwächere zahlt niemand',`${preis} €, mit Stärke 58 und Talent 70: ${kp} €`);
  // 1. Juli: Wer 24 wird, geht ohne Geld, dann wird auf 22 aufgefüllt
  const l=ev('zweiteKader()'),n0=l.length,alt=l.filter(p=>p.age===23).length,c2=t.cash;S.zwErg=null;im('juli',()=>F.zweiteSaison());const nach1=ev('zweiteKader()'),n1=nach1.length,alt1=nach1.some(p=>p.age>23);im('auff',()=>F.zweiteAuffuellen());const nach2=ev('zweiteKader()');
  pruef(alt>=2&&!alt1&&n1===n0-alt&&nach2.length===RZ.kader.soll&&t.cash===c2&&!ev('PIX').get(s.id),'1. Juli: Wer 24 wird, geht zu den Amateuren (kein Geld), Neue füllen auf 22 auf',`${alt} Abgänge, ${nach2.length-n1} Neue`);
  // Höchstens 26: Kommen viele aus der Jugend, müssen die Schwächsten gehen
  for(let i=0;i<8;i++){const p=F.jugendNeu();p.age=19;p.str=70;nach2.push(p);p.team=-4;ev('PIX').set(p.id,p);}im('voll',()=>F.zweiteAuffuellen());const voll=ev('zweiteKader()');
  pruef(voll.length===RZ.kader.max&&voll.filter(p=>p.str===70).length===8,'Höchstens 26 Spieler: Die Schwächsten müssen gehen, starke Neuzugänge bleiben',`${voll.length}`);}

// 7. Automatik (K36): Brauchbare 19-Jährige gehen in die Zweite statt zu den Amateuren, Schwache gehen, höchstens einer rückt aus der Zweiten auf
{const {S,F,ev,im}=welt('BMG');F.lizenzStart(true);const RZ=ev('RZ'),ref=ev('zweiteStaerke()'),jg=ev('jugendKader()');jg.forEach(p=>{if(p.age>=18)p.age=17;});
  const gut=jg[0],schwach=jg[1];[gut,schwach].forEach(p=>{p.age=18;});gut.str=ref+2;gut.pot=ref+8;schwach.str=ref-10;schwach.pot=ref-5;
  const auto=ev("autoB('zweitekader')");im('ja',()=>F.jugendSaison());const zw=ev('zweiteKader()');
  pruef(auto&&zw.includes(gut)&&!zw.includes(schwach)&&!ev('PIX').get(schwach.id),'Automatik: Ein brauchbarer 19-Jähriger geht in die Zweite, ein schwacher verlässt den Verein',`${gut.n} in die Zweite`);
  const lvl=ev('teamLevel')(S.my),zwei=zw.slice(0,2);zwei.forEach(p=>{p.str=lvl;p.pot=lvl+3;p.age=21;});const k0=ev('squad')(S.my).length;S.zwErg=null;im('hoch',()=>F.zweiteSaison());
  pruef(ev('squad')(S.my).length===k0+1&&zwei.filter(p=>p.team===S.my).length===1,'Automatik: Aus der Zweiten rückt je Sommer höchstens einer auf, der fast so gut ist wie die Profis');}

// 8. Kosten im Ablauf und Vereine ohne Zweite: Je Ligaspieltag wird gebucht, ohne Zweite nichts. Gesperrte Aktionen ändern nichts.
{const {S,F,ev,t}=welt('B04');pruef(!ev('hatZweite()')&&ev('zweiteKosten()')===0&&ev('zweiteKader()').length===0&&F.zweiteKarte().includes('keine zweite Mannschaft'),'Ohne Zweite (Leverkusen): keine Kosten, kein Kader, ein Hinweis in der Ansicht');
  const w=welt('BMG');const m0=w.S.fx[w.t.lg].findIndex(md=>md.some(([h,a])=>h===w.id||a===w.id)),spiel=w.S.fx[w.t.lg][m0].find(([h,a])=>h===w.id||a===w.id);
  const r={h:spiel[0],a:spiel[1],hg:1,ag:1};w.S.fin={};w.F.finanzenLiga(r);pruef(w.S.fin['Zweite Mannschaft']===-w.ev('zweiteKosten()'),'Kosten: Je Ligaspieltag wird das Budget der Zweiten gebucht',`${w.S.fin['Zweite Mannschaft']} €`);
  w.F.lizenzStart(true);const st=w.ev('zweiteStufe()');w.F.setZweite(5);const zw=w.ev('zweiteKader()'),p=zw[0];w.F.zweiteAufruecken(p.id);w.F.zweiteVerkaufen(zw[1].id);
  pruef(w.ev('zweiteStufe()')===st&&zw.includes(p)&&p.team===-4,'Lernstufen: Solange der Verein die Zweite führt, ändern gesperrte Aktionen nichts (Budget, Aufrücken, Verkauf)');}

// 9. Hoffenheim II in der 3. Liga: ein Verein mit eigenem Kader. Jugend hinschicken, Spieler holen, keine Kosten. Abstieg: Spieler bis 22 bleiben als Amateurkader.
{const {S,F,ev,im,t}=welt('TSG');const sim=ev('zweiteSim()'),RZ=ev('RZ');
  pruef(sim&&sim.sh==='TS2'&&ev('zweiteKader()').length===ev('squad')(sim.id).length&&ev('zweiteKosten()')===0&&!S.zw,'Hoffenheim: Die Zweite spielt als eigener Verein in der 3. Liga, ihr Kader ist der Kader dieses Vereins, keine Kosten für dich',sim&&sim.name);
  const j=ev('jugendKader()').find(p=>p.age>=17);F.jugendInZweite(j.id);const h=ev('squad')(sim.id).filter(p=>p!==j).sort((a,b)=>b.str-a.str)[0],ct=h.ct,sal=h.sal;F.zweiteAufruecken(h.id);
  pruef(j.team===sim.id&&S.pl.includes(j)&&j.ct===RZ.ausJugend.vertrag&&h.team===S.my&&h.ct===ct&&h.sal===sal,'Hoffenheim: Ein Jugendspieler wechselt mit kleinem Vertrag zu Hoffenheim II, ein Spieler von dort kommt mit seinem Vertrag zu den Profis',`${j.n} hin, ${h.n} her`);
  const l=ev('squad')(sim.id),jung=l.filter(p=>p.age<RZ.kader.bisAlter).length;sim.lg=4;F.zweiteAbstiegSim();ev('squad')(sim.id).forEach(p=>{p.team=-1;}); // die Älteren werden vereinslos (newSeason)
  pruef(ev('zweiteKader()').length===jung&&S.zw.every(p=>p.team===-4)&&!S.pl.some(p=>p.team===-4)&&ev('zweiteLiga()')===4,'Abstieg von Hoffenheim II: Spieler bis 22 bleiben als Amateurkader in der Regionalliga',`${jung} von ${l.length}`);
  // Aufstieg aus dem Regionalliga-Pool: Der Amateurkader wird zum Kader des Vereins, es gibt keinen erfundenen Kader
  im('auff',()=>F.zweiteAuffuellen());const ids=S.zw.map(p=>p.id);pruef(ev('zweiteWirdVerein')(sim.id),'Aufstieg vorbereitet: Hoffenheim II nimmt seinen Amateurkader mit');
  sim.lg=3;im('dritte',()=>F.zweiteSaison());const kader=ev('squad')(sim.id);
  pruef(kader.length===ids.length&&kader.every(p=>ids.includes(p.id)&&p.ct>=1&&p.sal>0)&&S.zw.length===0&&ev('zweiteSim()')===sim,'Aufstieg von Hoffenheim II: Die Spieler der Zweiten bilden den Kader in der 3. Liga, mit Vertrag und Gehalt',`${kader.length} Spieler`);
  // Lotterie der Regionalliga: Die Zweite eines Drittligisten darf nicht aufsteigen
  sim.lg=4;t.lg=3;const darfNicht=!ev('zweiteDarfAufsteigen')(sim);t.lg=1;const darf=ev('zweiteDarfAufsteigen')(sim);sim.lg=3;
  pruef(darfNicht&&darf,'Regionalliga: Die Zweite eines Drittligisten nimmt nicht an der Aufstiegslosung teil, die eines Erstligisten schon');}

// 10. Speichern und Laden: Kader, Liga und Ergebnis bleiben, PIX kennt die Zweite wieder
{const {W,S,F,ev}=welt('BVB');const l=ev('zweiteKader()'),vor=l.map(p=>p.id+':'+p.str).join(),L=S.zwL;W.S=JSON.parse(JSON.stringify(S));F.reindex();const nach=ev('zweiteKader()');
  pruef(nach.map(p=>p.id+':'+p.str).join()===vor&&W.S.zwL===L&&nach.every(p=>ev('PIX').get(p.id)===p),'Speichern und Laden: Kader, Liga und Werte der Zweiten bleiben, PIX kennt sie wieder');}

// 11. Zwei Saisons im Ablauf (Gladbach): Platzierung je Saison, Kosten gebucht, Kader im Rahmen, die Ligen der Profis bleiben vollständig
{const fehler=[],erg=[];let kosten=0;
  saisons({n:2,seed:SEED,verein:9,beiSaisonende:S=>{erg.push(S.zwErg&&S.zwErg.v===S.my?`${S.zwErg.name} Platz ${S.zwErg.platz}`:'–');kosten+=S.fin['Zweite Mannschaft']||0;
    const zw=S.zw||[];if(zw.length<15||zw.length>26)fehler.push('Kadergröße '+zw.length);if(zw.some(p=>p.team!==-4||p.age>23||p.age<17))fehler.push('Spieler außerhalb des Rahmens');
    if(S.pl.some(p=>p.team===-4))fehler.push('Spieler der Zweiten in S.pl');if(!S.summary||!S.summary.zw)fehler.push('keine Zeile in der Saisonbilanz');}});
  pruef(!fehler.length&&erg.length===2&&erg.every(x=>x!=='–')&&kosten<0,'Zwei Saisons: Die Zweite hat je Saison einen Platz, die Kosten sind gebucht, der Kader bleibt im Rahmen',fehler[0]||`${erg.join(', ')}, Kosten ${kosten} €`);}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
