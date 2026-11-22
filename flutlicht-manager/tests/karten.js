// Ereigniskarten (K30 §5.5, §10, U12d): Prüfskript für den Katalog (nur erlaubte Wirkungen, Platzhalter, Auslöser vorhanden, Voreinstellung gültig),
// Auslöser, Entscheidung mit Halt und Wahl im Büro, Automatik ohne Antwort, Budget je Woche, gleicher Würfel egal wann entschieden wird, Anzeige.
// Aufruf: node tests/karten.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U12d entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711;
function welt(){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);
  const im=(k,fn)=>W.ev('mitStrom')(W.ev('strom')('test',k),fn);return{W,F,S,ev:W.ev,im};}

// 1. Prüfskript (K30 §10): erlaubte Wirkungen, bekannte Platzhalter, Auslöser vorhanden, Stufe bekannt, Entscheidungen mit 2–3 Optionen und gültiger Voreinstellung
{const {ev}=welt(),K=ev('KARTEN'),A=ev('AUSLOESER'),erlaubt=ev('KARTEN_WIRKUNGEN'),stufen=Object.keys(ev('RKT').seltenheit),fehler=[],ids=new Set();
  const platz=t=>(t.match(/\{[a-z]+\}/g)||[]).filter(x=>!['{spieler}','{verein}','{praesident}'].includes(x));
  K.forEach(c=>{if(ids.has(c.id))fehler.push(c.id+': doppelt');ids.add(c.id);if(!A[c.ausloeser])fehler.push(c.id+': Auslöser fehlt');if(!stufen.includes(c.stufe))fehler.push(c.id+': Stufe');
    if(!c.texte||!c.texte.length)fehler.push(c.id+': kein Text');(c.texte||[]).forEach(t=>{if(platz(t).length)fehler.push(c.id+': Platzhalter '+platz(t));});
    if(c.art==='entscheidung'){if(!c.optionen||c.optionen.length<2||c.optionen.length>3)fehler.push(c.id+': Optionen');if(!(c.auto>=0&&c.auto<(c.optionen||[]).length))fehler.push(c.id+': Voreinstellung');}
    else if(c.art!=='info')fehler.push(c.id+': Art');
    (c.optionen||[]).forEach(o=>{(o.wirkung||[]).forEach(w=>{if(!erlaubt.includes(w.art))fehler.push(c.id+': Wirkung '+w.art);});[o.folge,...(o.wirkung||[]).map(w=>w.gut),...(o.wirkung||[]).map(w=>w.schlechtText)].filter(Boolean).forEach(t=>{if(platz(t).length)fehler.push(c.id+': Platzhalter '+platz(t));});});});
  pruef(!fehler.length&&K.length>=5,'Katalog: nur erlaubte Wirkungen und Platzhalter, jeder Auslöser vorhanden, Entscheidungen mit 2–3 Optionen und gültiger Voreinstellung',fehler.join('; ')||`${K.length} Karten`);}

// 2. Auslöser: Hochzeit findet einen Spieler zwischen 24 und 34. Der Präsident mischt sich nur bei Ehrgeiz ab 14 und drei Niederlagen ein, und er will einen, der nicht in der Elf steht.
{const {S,F,ev,im}=welt(),A=ev('AUSLOESER'),h=im('a1',()=>A.hochzeit()),p=h&&S.pl.find(x=>x.id===h.spieler);
  const t=S.teams.find(x=>x.lg<=3&&F.praesident(x).ehrgeiz>=ev('RV').nebenziele.ehrgeizigAb);let ok2=true,info='kein Verein mit ehrgeizigem Präsidenten';
  if(t){S.my=t.id;S.lineup=F.bestXI(t.id,t.form);const vorher=A.praesidentSerie();const g=S.teams.filter(x=>x.lg===t.lg&&x.id!==t.id).slice(0,3);g.forEach(x=>S.res[t.lg].push([t.id,x.id,0,1,0]));
    const n=A.praesidentSerie(),xi=new Set(S.lineup.map(x=>x&&x.id!=null?x.id:x));ok2=vorher===null&&!!n&&!xi.has(n.spieler);info=n?`will ${S.pl.find(x=>x.id===n.spieler).n} sehen`:'keiner';}
  pruef(!!p&&p.age>=24&&p.age<=34&&ok2,'Auslöser: Hochzeit mit einem Spieler von 24 bis 34, Präsident erst nach drei Niederlagen und mit einem Spieler außerhalb der Elf',info);}

// 3. Entscheidung mit Halt: Die Karte steht im Büro, der Tag hält an („Ereignis“). Deine Wahl wirkt (Ausflug: −20.000 €, Zusammenhalt +3, Stimmung +5).
{const {S,F,ev}=welt(),c=ev('karteVon')('hochzeit'),p=ev('squad')(S.my).find(x=>x.age>=24&&x.age<=34),t=ev('myT()');S.phase='play';
  const zh0=ev('zusammenhalt')(t),st0=ev('stimmung')(p);F.kartenZeigen(c,{spieler:p.id},S.tag,true);const offen=S.karten.offen.length,halt=ev('haltGrund')(S.tag),html=F.kartenKarte();
  F.karteWaehlen(0,0);
  pruef(offen===1&&halt==='Ereignis'&&html.includes(c.titel)&&!S.karten.offen.length&&S.fin.Ereignisse===ev('kartenGeld')(-20000)&&ev('zusammenhalt')(t)===Math.min(100,zh0+3)&&ev('stimmung')(p)>st0,
    'Entscheidung: Halt „Ereignis“, Karte im Büro, deine Wahl wirkt (Geld, Zusammenhalt, Stimmung)',`Halt ${halt}, Geld ${S.fin.Ereignisse}`);}

// 4. Ohne Antwort entscheidet der Co-Trainer vor dem Anpfiff (kartenAuto), mit der Voreinstellung der Karte
{const {S,F,ev}=welt(),c=ev('karteVon')('hochzeit'),p=ev('squad')(S.my).find(x=>x.age>=24&&x.age<=34);S.phase='play';const st0=ev('stimmung')(p);
  F.kartenZeigen(c,{spieler:p.id},S.tag,true);F.kartenAuto(S.tag);const l=S.karten.log[S.karten.log.length-1];
  pruef(!S.karten.offen.length&&l.wahl===c.auto&&l.auto&&!(S.fin||{}).Ereignisse&&ev('stimmung')(p)>st0,'Ohne Antwort: Der Co-Trainer wählt die Voreinstellung (Glückwunschkarte, kein Geld)',`Wahl ${l.wahl}`);}

// 5. Budget: eine kleine Entscheidung je Woche, danach entscheidet die Automatik. Mit der Automatik des Bereichs immer der Co-Trainer.
{const {S,F,ev}=welt(),c=ev('karteVon')('hochzeit'),d=S.tag,W=F.kartenBudget(d),a=F.entscheidungImBudget(c,W,d);W.ent=1;const b=F.entscheidungImBudget(c,W,d);
  W.ent=0;F.lizenzStart(true);S.lizenz.auto.ereignisse=1;const auto=F.entscheidungImBudget(c,W,d);
  pruef(b===false&&auto===false,'Budget: nach einer Entscheidung in der Woche keine zweite, mit Automatik keine',`erste: ${a} (hängt an den Spielen der Woche), zweite: ${b}, Automatik: ${auto}`);}

// 6. Gleicher Würfel, egal wann entschieden wird: Versöhnung (60 %) sofort oder nach anderen Würfen ergibt dasselbe
{const lauf=spaeter=>{const {S,F,ev,im}=welt(),c=ev('karteVon')('versoehnung'),x=S.teams.find(t=>t.id!==S.my&&t.lg===1).id;S.phase='play';F.bezDuAendern(x,-80,'Test');
    F.kartenZeigen(c,{verein:x},S.tag,true);if(spaeter)im('anderes',()=>{for(let i=0;i<50;i++)ev('R')();});F.karteWaehlen(0,0);return F.bezDu(x);};
  const a=lauf(false),b=lauf(true);pruef(a===b&&(a===-60||a===-85),'Würfel der Karte hängt nur an Karte und Tag: sofort und später dasselbe Ergebnis (+20 oder −5)',`${a} / ${b}`);}

// 7. Woche: Mit sehr vielen Wochen kommen Karten, keine Info-Grenze wird überschritten, Entscheidungen bleiben im Budget (Prüfung über 300 Montage einer Saison mit eigenem Strom je Woche)
{const {S,F,ev,im}=welt();S.phase='play';let tage=0;const vor=S.tag;
  for(let i=0;i<300;i++){S.tag=vor+7*(i%40);im('w'+i,()=>F.kartenWoche(S.tag));F.kartenAuto(S.tag);tage++;}
  const l=S.karten.log,je={};l.forEach(e=>{je[e.id]=(je[e.id]||0)+1;});S.tag=vor;
  pruef(l.length>0&&!S.karten.offen.length,'Woche: Karten kommen, offene Karten werden vor dem Spieltag entschieden',JSON.stringify(je));}

// U12j. Jobangebot (K28 §8): erst ab Ruf 55 und dem 5. Ligaspiel, nur Vereine mit mindestens 8 mehr Ansehen; die Voreinstellung bleibt; „Wechseln“ übernimmt den Verein,
//       der alte bekommt eine Ablöse von einem Jahresgehalt, die Station endet mit „gewechselt“
{const {S,F,ev}=welt(),J=ev('RV').jobangebot,A=ev('AUSLOESER'),t=ev('myT()'),c=ev('karteVon')('jobangebot');
  S.ruf=30;const ohneRuf=A.jobangebot();S.ruf=80;const frueh=A.jobangebot();S.tag=ev('meineLigaspiele')()[5].tag+1;const b=A.jobangebot(),z=b?S.teams[b.verein]:null;
  const grenze=ev('jobangebotGrenze')(),passt=!!z&&z.rep>=t.rep+J.abstand&&z.lg<=t.lg&&z.rep<=grenze&&grenze===t.rep-ev('RV').jobs.ansehenAbschlag+(80-ev('RV').ruf.start)*ev('RV').ruf.jobsJePunkt+J.rufSpanne;
  const K=ev('karten')(),key='jobangebot::999';K.sp[key]=ev('absTag')(S.tag);const gesperrt=A.jobangebot()===null;delete K.sp[key]; /* höchstens eins je Jahr über alle Vereine (DQ2) */
  K.offen.push({id:'hochzeit',tag:S.tag,s:S.season,b:{spieler:ev('squad')(VEREIN)[0].id},text:''}); /* offene Karte des alten Vereins (DQ3) */
  ev('statS')();const geh=S.tvt&&S.tvt.tid===S.my?S.tvt.geh:F.trainerGehalt(VEREIN),a=Math.min(Math.round(geh*J.abloese/1000)*1000,z?z.cash:0),c0=t.cash,z0=z?z.cash:0;
  if(z)F.kartenEntscheiden({id:'jobangebot',tag:S.tag,s:S.season,b,text:''},0,false);const st=S.stat.st,alt=st[st.length-2],offenWeg=!K.offen.length&&K.log.some(e=>e.id==='hochzeit'&&e.auto);
  pruef(ohneRuf===null&&frueh===null&&passt&&gesperrt&&offenWeg&&c.auto===1&&S.my===(z&&z.id)&&t.cash===c0+a&&z.cash===z0-a&&!!alt&&alt.g==='gewechselt'&&alt.tid===VEREIN,
    'Jobangebot: Bedingungen, Grenze, ein Angebot je Jahr, Wechsel mit Ablöse und Station, offene Karten bleiben beim alten Verein, Voreinstellung bleiben',
    `ohne Ruf ${ohneRuf}, zu früh ${frueh}, Angebot ${z&&z.name} (${z&&z.rep}, Grenze ${grenze}), gesperrt ${gesperrt}, offene Karten ${offenWeg}, Ablöse ${a}, jetzt Verein ${S.my}, Station ${alt&&alt.g}`);}

// K14b. Kabinen-Karten (K14 §8): Kantersieg im letzten Ligaspiel, Neuzugang mit kaum Einsatz ab dem 3. Ligaspiel, Eingewöhnung eines Spielers aus dem Ausland
{const {S,ev}=welt(),A=ev('AUSLOESER'),t=ev('myT()'),K=ev('RKT').kabine,g=S.teams.find(x=>x.lg===t.lg&&x.id!==VEREIN).id,heute=()=>ev('absTag')(S.tag);
  S.res[t.lg].push([VEREIN,g,4,0,0]);const party=!!A.kantersieg();S.res[t.lg].push([g,VEREIN,1,0,1]);const keineParty=A.kantersieg()===null;
  const sq=ev('squad')(VEREIN),p=sq.slice().sort((a,b)=>b.str-a.str)[0];sq.forEach(x=>{delete x.seit;x.nat=ev('RW').nation.heimat;});S.tag=ev('meineLigaspiele')()[K.abSpieltag].tag+1;
  p.seit=heute()-10;const n1=A.neuzugangDraengt();p.sst={s:S.season,tid:VEREIN,min:K.kaumMinuten+1};const n2=A.neuzugangDraengt();delete p.sst;p.seit=heute()-K.neuTage-1;const n3=A.neuzugangDraengt();
  p.seit=heute()-10;p.nat='BRA';const e1=A.eingewoehnung();p.nat=ev('RW').nation.heimat;const e2=A.eingewoehnung();
  pruef(party&&keineParty&&!!n1&&n1.spieler===p.id&&n2===null&&n3===null&&!!e1&&e1.spieler===p.id&&e2===null,'Kabinen-Karten: Kantersieg, Neuzugang ohne Einsatz, Eingewöhnung',
    `Party ${party}/${keineParty}, Neuzugang ${n1&&n1.spieler===p.id} / mit Einsatz ${n2} / zu lange da ${n3}, Eingewöhnung ${e1&&e1.spieler===p.id} / Inländer ${e2}`);}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
