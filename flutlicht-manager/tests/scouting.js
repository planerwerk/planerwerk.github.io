// Scouting und Informationsnebel (K18 §10): ehrliche Spannen für jede Scout-Qualität und Kenntnis, Tempo der Beobachtung,
// Fehlkäufe ohne und mit Scouting, Suchauftrag, Verblassen, Spiele gegen den Spieler, gleiche Sicht nach Speichern und Laden.
// Aufruf: node tests/scouting.js [Seed=5]. Nur Node.js.
const {neueWelt}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %';
const welt=(verein=6)=>{const {W,F}=neueWelt();F.__ev=W.ev;F.buildWorld(SEED);const S=W.S;S.my=verein;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(verein,W.ev('myT()').form);return{W,F,S,ev:W.ev};};
// Ein Test-Scout im eigenen Verein mit fester Qualität (Gebiet und Lieblingstyp ergeben sich aus der Nummer)
const scout=(S,F,q,gebiet,ev=F.__ev)=>{let x;for(let i=0;i<50;i++){x=F.stabNeu('scout',q,S.my,1);S.stab.push(x);ev('stabGeaendert')();if(!gebiet||ev('scoutGebiet')(x)===gebiet)return x;S.stab.pop();}return x;};

// 1. Ehrlichkeit (K18 §10): Der wahre Wert liegt für jede Scout-Qualität und Kenntnis in mindestens 80 % der Fälle in der Spanne
{const {S,F,ev}=welt();S.kenntnis={};const fremde=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&S.teams[p.team].lg<=3);let alleOk=true;const zeilen=[];
  const pruefe=(name,setze)=>{let drin=0,n=0,breite=0;fremde.forEach(p=>{setze(p);const s=F.staerkeSicht(p);n++;breite+=s.hi-s.lo;if(p.str>=s.lo-0.5&&p.str<=s.hi+0.5)drin++;});const q=drin/n;if(q<0.8)alleOk=false;zeilen.push(`${name} ${pc(q)} (±${(breite/n/2).toFixed(1)})`);};
  pruefe('Grundkenntnis',p=>{delete S.kenntnis[p.id];});
  for(const q of [3,10,18]){const x=scout(S,F,q);for(const k of [30,60,90])pruefe(`Q${q}/K${k}`,p=>{S.kenntnis[p.id]={k,s:[x.id]};});}
  S.kenntnis={};pruef(alleOk,'Ehrlichkeit: wahrer Wert in mindestens 80 % der Fälle in der Spanne (je Qualität und Kenntnis)',zeilen.join(', '));}

// 2. Tempo (K18 §10): Spieler einer anderen deutschen Liga mit durchschnittlichem Scout (Qualität 10, eigenes Gebiet) in 2–3 Wochen auf Kenntnis 60
{const {S,F,ev}=welt();const x=scout(S,F,10,'inland'),p=S.pl.find(q=>q.team>=0&&S.teams[q.team].lg===2&&q.age>23);let w=0;S.kenntnis={};
  while(ev('kenntnis')(p)<60&&w<10){w++;F.kenntnisPlus(p,x,1);}
  pruef(w>=2&&w<=3,'Tempo: andere deutsche Liga, Scout Qualität 10, in 2–3 Wochen auf Kenntnis 60',`${w} Wochen (Start ${ev('grundKenntnis')(p)})`);}

// 3. Fehlkäufe (K18 §10, kalibriert in U9a): Wer aus zehn Kandidaten aus verschiedenen Vereinen der 2. und 3. Liga den nach Einschätzung besten nimmt, liegt ohne Scouting in 20–30 % der Fälle 5 oder mehr darunter, mit gutem Scouting in unter 10 %. Ein einzelner Kauf ohne Auswahl in unter 15 %.
{const {S,F,ev}=welt();const pool=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&S.teams[p.team].lg>=2&&S.teams[p.team].lg<=3).sort((a,b)=>ev('hash32')('mix|'+a.id)-ev('hash32')('mix|'+b.id));const gut=[scout(S,F,17,'inland'),scout(S,F,18,'inland')];
  const lauf=mitScouting=>{let fehl=0,n=0;for(let i=0;i+10<=pool.length;i+=10){const g=pool.slice(i,i+10);S.kenntnis={};
      if(mitScouting)g.forEach(p=>{gut.forEach(x=>{for(let w=0;w<3;w++)F.kenntnisPlus(p,x,1);});});
      const best=g.map(p=>[p,F.staerkeSicht(p).mitte]).sort((a,b)=>b[1]-a[1])[0];n++;if(best[0].str<=best[1]-5)fehl++;}return fehl/n;};
  const ohne=lauf(false),mit=lauf(true);S.kenntnis={};const einzel=pool.filter(p=>p.str<=F.staerkeSicht(p).mitte-5).length/pool.length;
  pruef(einzel<0.15,'Einzelkauf ohne Scouting (ohne Auswahl): unter 15 % mindestens 5 unter der Einschätzung',pc(einzel));
  pruef(ohne>=0.2&&ohne<=0.3,'Fehlkäufe ohne Scouting, Bester aus zehn: 20–30 % mindestens 5 unter der Einschätzung',pc(ohne));
  pruef(mit<0.1,'Fehlkäufe mit gutem Scouting (zwei Scouts, je drei Wochen): unter 10 %',pc(mit));}

// 4. Suchauftrag (K18 §10): 3–8 Kandidaten innerhalb von 4 Wochen, Kosten gebucht
{const {S,F,ev}=welt();const x=scout(S,F,12);const f=F.sucheLauf(x.id,{pos:'MF',alterBis:26,abloeseBis:''});let w=0;const k0=S.fin['Scouting']||0;
  while(w<4){w++;S.tag+=7;F.scoutingWoche();}const a=S.auftraege.find(y=>y.art==='suche');const n=a?a.kand.length:0;
  pruef(!f&&n>=3&&n<=8&&a.kand.every(id=>{const p=ev('PIX').get(id);return p.pos==='MF'&&p.age<=26;}),'Suchauftrag: 3–8 passende Kandidaten in vier Wochen',`${n} Kandidaten${f?', '+f:''}`);
  pruef((S.fin['Scouting']||0)<k0,'Scouting kostet Reisegeld',`${Math.round(-(S.fin['Scouting']||0)).toLocaleString('de-DE')} €`);}

// 5. Verblassen und Spiele: ohne Beobachtung etwa 2 Punkte je Monat, nie unter die Grundkenntnis; ein Spiel gegen ihn bringt +5
{const {S,F,ev}=welt();const x=scout(S,F,15,'inland'),p=S.pl.find(q=>q.team>=0&&S.teams[q.team].lg===2);S.kenntnis={};for(let w=0;w<3;w++)F.kenntnisPlus(p,x,1);const k0=S.kenntnis[p.id].k;
  for(let w=0;w<13;w++)F.scoutingWoche();const k1=S.kenntnis[p.id]?S.kenntnis[p.id].k:ev('grundKenntnis')(p),proMonat=(k0-k1)/3;
  for(let w=0;w<200;w++)F.scoutingWoche();const k2=ev('kenntnis')(p);
  pruef(proMonat>1.5&&proMonat<2.5&&k2===ev('grundKenntnis')(p),'Verblassen: etwa 2 je Monat, nicht unter die Grundkenntnis',`${proMonat.toFixed(1)} je Monat, am Ende ${k2}`);
  const q=S.pl.find(y=>y.team>=0&&y.team!==S.my&&S.teams[y.team].lg===1),g=ev('kenntnis')(q);F.scoutingNachSpiel([{h:S.my,a:q.team,xpo:[[],[[q.id,0,1,90]]],xi:[[],[q.id]]}]);
  pruef(ev('kenntnis')(q)===g+5,'Ein Spiel gegen ihn bringt +5 Kenntnis',`${g} → ${ev('kenntnis')(q)}`);}

// 6. Gleiche Sicht nach Speichern und Laden, eigene Spieler genau
{const {W,S,F,ev}=welt();const x=scout(S,F,9),fremd=S.pl.filter(p=>p.team>=0&&p.team!==S.my).slice(0,200);fremd.slice(0,50).forEach(p=>F.kenntnisPlus(p,x,1));
  const vor=fremd.map(p=>ev('staerkeText')(p)).join(',');W.S=JSON.parse(JSON.stringify(S));F.reindex();const nach=fremd.map(p=>ev('staerkeText')(ev('PIX').get(p.id))).join(',');
  const eigen=ev('squad')(S.my).every(p=>ev('staerkeText')(p)===String(Math.round(p.str)));
  pruef(vor===nach&&eigen,'Gleiche Spannen nach Speichern und Laden, eigene Spieler genau',vor===nach?'':'abweichend');}

// K18c. Gegnerbeobachtung (K18 §8, K07 §5): mit einem Scout im Stab den nächsten Gegner beobachten, Reisekosten einmal, bis zum Spieltag beobachtet, danach nicht mehr; ohne Scout nichts
{const {F,S,ev}=welt(),t=ev('myT()'),l=ev('meineLigaspiele')();S.tag=l[3].tag-2;S.gespielt=-1;
  ev('S').stab=ev('S').stab.filter(x=>!(x.team===S.my&&(x.r==='scout'||x.r==='video')));ev('stabGeaendert')();F.gegnerBeobachten();const ohne=!t.gb; /* ohne Videoanalyst, sonst wirkt die Beobachtung nicht (DW8) */
  const sc=ev('stabNeu')('scout',10,S.my,t.lg);S.stab.push(sc);ev('stabGeaendert')();const n=F.gbNaechstes(),k0=S.fin['Scouting']||0;F.gegnerBeobachten();
  const ja=!!n&&!!t.gb&&t.gb.g===n.g&&t.gb.bis===n.d&&ev('gegnerBeobachtet')(t,n.g)&&(S.fin['Scouting']||0)-k0===-ev('RSC').gegner.kosten;S.tag=(n?n.d:0)+1;const vorbei=!ev('gegnerBeobachtet')(t,n&&n.g);
  pruef(ohne&&ja&&vorbei,'Gegnerbeobachtung: nur mit Scout, Kosten einmal, gilt bis zum Spieltag',`ohne Scout ${ohne}, beobachtet ${ja}, danach vorbei ${vorbei}`);}
// DW8. Keine Kosten ohne Wirkung: am Spieltag ohne Spielvorbereitung der letzten zwei Tage und mit einem Videoanalysten bleibt das Geld, der Knopf fehlt
{const {F,S,ev}=welt(),t=ev('myT()'),l=ev('meineLigaspiele')();S.stab=S.stab.filter(x=>!(x.team===S.my&&(x.r==='scout'||x.r==='video')));S.stab.push(ev('stabNeu')('scout',10,S.my,t.lg));ev('stabGeaendert')();
  S.tag=l[3].tag;S.gespielt=-1;delete t.vbTag;delete t.gb;const k0=S.fin['Scouting']||0;F.gegnerBeobachten();const ohnePrep=!t.gb&&(S.fin['Scouting']||0)===k0&&!F.gegnerBeobachtenText().includes('<button');
  S.tag=l[3].tag-2;S.stab.push(ev('stabNeu')('video',12,S.my,t.lg));ev('stabGeaendert')();F.gegnerBeobachten();const mitVideo=!t.gb&&(S.fin['Scouting']||0)===k0&&F.gegnerBeobachtenText().includes('Videoanalyst');
  pruef(ohnePrep&&mitVideo,'Gegnerbeobachtung ohne Wirkung kostet nichts (am Spieltag ohne Vorbereitung, mit Videoanalyst)',`ohne Vorbereitung ${ohnePrep}, mit Videoanalyst ${mitVideo}`);}

// K18d. Konkurrenz am Tisch (K18 §8): mit Chance 0 nichts; mit Chance 1 nach einem Bericht ein anderer Verein mit Bedarf, die Forderung an dich steigt um 5 %; nach der Frist wieder normal
{const {S,F,ev}=welt(),K=ev('RSC').konkurrenz,p=S.pl.filter(x=>x.team>=0&&x.team!==S.my&&S.teams[x.team]&&S.teams[x.team].lg===1).sort((a,b)=>b.str-a.str)[0];
  K.chance=0;const nein=F.konkurrenzTisch(p),f0=ev('forderungDu')(p);K.chance=1;const b=F.konkurrenzTisch(p),f1=ev('forderungDu')(p);
  const t0=p.team,anders=S.teams.find(x=>x.id!==t0&&x.id!==S.my).id;p.team=anders;const woanders=ev('konkurrenzTischFaktor')(p)===1;p.team=t0; /* nur beim Verein von damals (EC2) */
  p.kTisch.bis=ev('absTag')(S.tag)-1;const f2=ev('forderungDu')(p);
  pruef(nein===null&&!!b&&b.id!==p.team&&b.id!==S.my&&Math.abs(f1/f0-(1+K.preis))<0.001&&Math.abs(f2-f0)<1&&woanders,'Konkurrenz am Tisch: anderer Verein mit Bedarf, Forderung + 5 % bis zur Frist, nur beim selben Verein',
    `Chance 0 ${nein}, Verein ${b&&b.name}, Forderung ${Math.round(f0)} → ${Math.round(f1)} → ${Math.round(f2)}`);}

// K18g. Scoutbericht (K18 §5 Nr. 3): kiStil ohne Reaktion ist kiStilWahl, mit Reaktion der Stil gegen deinen Lieblingsstil (stilLiebling, nur wenn du den Stil wählst).
//       Der Bericht nennt Verein, wahrscheinlichen Stil und einen verletzten Stammspieler; die Vorschau zeigt ihn erst nach der Beobachtung.
{const {F,S,ev}=welt(),t=ev('myT()'),l=ev('meineLigaspiele')(),K=ev('RTA').ki,SN=ev('STIL_NAME'),side=ev('side'),ns=ev('naechstesSpiel');
  let i=3;while(i<l.length-1&&(ns(l[i].tag-1)||{}).tag!==l[i].tag)i++; /* ein Ligaspiel, vor dem kein anderes Spiel liegt */S.tag=l[i].tag-2;S.gespielt=-1;
  const f=ev('paarung')(l[i]),home=f[0]===S.my,o=home?f[1]:f[0],mich=()=>Object.assign(side(S.my,home,false),{stil:'ausgewogen'});t.stil='ausgewogen';
  const r0=K.reaktion;K.reaktion=0;const op=side(o,!home,false),gleich=F.kiStil(op,mich())===F.kiStilWahl(op,mich());
  S.stilVerlauf=['ballbesitz','ballbesitz','pressing'];const L=F.stilLiebling(),lieb=!!L&&L.lieb==='ballbesitz'&&ev('RTA').kreislauf[L.gegen]==='ballbesitz';
  K.reaktion=1;const op2=side(o,!home,false),re=ev('autoB')('stil')?true:F.kiStil(op2,mich())===L.gegen&&op2.konter===1;K.reaktion=r0;
  const v=ev('squad')(o).slice().sort((a,b)=>b.str-a.str)[0],inj0=v.inj;v.inj=10;const b=F.scoutBericht(o,home),stil=F.kiStilWahl(side(o,!home,false),mich());v.inj=inj0;
  const bericht=b.includes('Scoutbericht')&&b.includes(S.teams[o].name)&&b.includes(SN[stil]||stil)&&b.includes(v.n+' (verletzt)');
  S.stab=S.stab.filter(x=>!(x.team===S.my&&(x.r==='scout'||x.r==='video')));S.stab.push(ev('stabNeu')('scout',10,S.my,t.lg));ev('stabGeaendert')();delete t.gb;
  /* Prüfung FM3: der Bericht steht nur im Vergleich (tauziehenNaechstes), nicht noch einmal im Text zur Beobachtung */
  const ohne=!F.tauziehenNaechstes().includes('Scoutbericht');F.gegnerBeobachten();const mit=!!t.gb&&F.tauziehenNaechstes().includes('Scoutbericht')&&!F.gegnerBeobachtenText().includes('Scoutbericht');
  pruef(gleich&&lieb&&re&&bericht&&ohne&&mit,'Scoutbericht: wahrscheinlicher Stil wie die Wahl im Spiel, Reaktion auf deinen Lieblingsstil, Ausfälle, erst nach der Beobachtung, nur einmal',
    `ohne Reaktion gleich ${gleich}, Lieblingsstil ${lieb}, Reaktion ${re}, Bericht ${bericht} („${b}“), Vorschau ohne/mit ${ohne}/${mit}`);}

// Prüfung FM4, FM9, FM11: Ein im Wettbewerb des nächsten Spiels gesperrter Spieler steht nicht unter „Gefährlich“, sondern unter „Es fehlen (gesperrt)“
//       (scoutBericht rechnet mit mitWettbewerb); ein Abgestellter steht dort mit „Nationalmannschaft“.
{const {F,S,ev}=welt(),t=ev('myT()'),l=ev('meineLigaspiele')(),ns=ev('naechstesSpiel');let i=3;while(i<l.length-1&&(ns(l[i].tag-1)||{}).tag!==l[i].tag)i++;S.tag=l[i].tag-2;S.gespielt=-1;
  const f=ev('paarung')(l[i]),home=f[0]===S.my,o=home?f[1]:f[0],wb=ev('naechsterWb')(),sq=ev('squad')(o).filter(x=>!(x.inj>0)).sort((a,b)=>b.str-a.str),g=sq[0],n=sq[1];
  const sp0=g.sperre;g.sperre=Object.assign({},g.sperre||{},{[wb]:{rot:1,gelb:0}}); /* gesperrt nur im Wettbewerb des nächsten Spiels (p.sperre je Wettbewerb, disziplin.js) */
  const gesperrt=ev('gesperrt')(g,wb);let ok=true,txt='';
  if(gesperrt){txt=F.scoutBericht(o,home);ok=!txt.split('Es fehlen')[0].includes(g.n)&&txt.includes(g.n+' (gesperrt)');}if(sp0===undefined)delete g.sperre;else g.sperre=sp0;
  const a=ev('absTag')(S.tag);n.lsp={von:a,bis:a+3,n:2,st:1};const txt2=F.scoutBericht(o,home);delete n.lsp;const nat=txt2.includes(n.n+' (Nationalmannschaft)');
  pruef(ok&&nat,'Scoutbericht: gesperrt im Wettbewerb des Spiels fehlt, nicht gefährlich; Nationalspieler fehlen',`gesperrt ${gesperrt?ok:'nicht prüfbar'}, Nationalmannschaft ${nat}`);}

// Prüfung FO8 zu FM4 und FO6: Ist das nächste Spiel ein Pokalspiel (hier vorgegeben), fehlt ein nur im Pokal Gesperrter, vor einem Ligaspiel nicht.
//       Mit dem Spieltag fehlt ein Nationalspieler, der erst bis zum Spiel abgestellt ist, und steht nicht unter „Gefährlich“; mit dem heutigen Tag fehlt er nicht.
{const {F,S,ev}=welt(),l=ev('meineLigaspiele')(),f=ev('paarung')(l[3]),home=f[0]===S.my,o=home?f[1]:f[0],sq=ev('squad')(o),nw=F.naechsterWb;
  sq.forEach(x=>{x.inj=0;delete x.sperre;x.sus=0;delete x.lsp;});sq.sort((a,b)=>b.str-a.str);const g=sq[0],n=sq[1];g.sperre={pokal:{rot:1,gelb:0}};
  F.naechsterWb=()=>'pokal';const tp=F.scoutBericht(o,home);F.naechsterWb=()=>'liga';const tl=F.scoutBericht(o,home);F.naechsterWb=nw;delete g.sperre;
  const pokal=tp.includes(g.n+' (gesperrt)')&&!tp.split('Es fehlen')[0].includes(g.n),liga=!tl.includes(g.n+' (gesperrt)');
  const a=ev('absTag')(S.tag);n.lsp={von:a+2,bis:a+4,n:2,st:1};const mt=F.scoutBericht(o,home,S.tag+3),ot=F.scoutBericht(o,home);delete n.lsp;
  const spieltag=mt.includes(n.n+' (Nationalmannschaft)')&&!mt.split('Es fehlen')[0].includes(n.n),heute=!ot.includes(n.n+' (Nationalmannschaft)');
  pruef(pokal&&liga&&spieltag&&heute,'Scoutbericht: eine Sperre im Pokal zählt nur vor dem Pokalspiel, die Nationalmannschaft am Spieltag statt heute',
    `Pokal ${pokal}, Liga ${liga}, mit Spieltag ${spieltag}, heute ${heute}`);}

// K18e. Scout liegt daneben (K18 §8): Einschätzung beim Kauf 6 über der wahren Stärke gibt eine Meldung, 2 darüber keine; der Merker ist danach weg;
//       kaufSichtMerken merkt sich bei einem fremden Spieler Mitte und Stärke, bei einem eigenen (genau bekannt) nichts
{const {S,F,ev}=welt(),sq=ev('squad')(S.my),[p,q]=sq,n=()=>S.news.filter(x=>x.t.startsWith('Scout lag daneben')).length,f=S.pl.find(x=>x.team>=0&&x.team!==S.my);
  p.kaufSicht={mitte:Math.round(p.str)+6,str:Math.round(p.str),scout:1};q.kaufSicht={mitte:Math.round(q.str)+2,str:Math.round(q.str),scout:1};F.scoutDanebenWoche();
  const r=sq[2],m=()=>S.news.filter(x=>x.t.startsWith('Einschätzung lag daneben')).length;r.kaufSicht={mitte:Math.round(r.str)+6,str:Math.round(r.str),scout:0};F.scoutDanebenWoche();const ohneScout=m()===1&&n()===1; /* ohne Scout andere Meldung (EC3) */
  F.kaufSichtMerken(f);F.kaufSichtMerken(p);
  pruef(n()===1&&ohneScout&&!p.kaufSicht&&!q.kaufSicht&&!!f.kaufSicht&&f.kaufSicht.str===Math.round(f.str),'Scout liegt daneben: Meldung ab 5 unter der Einschätzung, Merker beim Kauf',`Meldungen ${n()}, fremder Spieler ${JSON.stringify(f.kaufSicht)}`);}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
