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
  const platz=t=>(t.match(/\{[a-z]+\}/g)||[]).filter(x=>!['{spieler}','{verein}','{praesident}','{mitarbeiter}'].includes(x));
  K.forEach(c=>{if(ids.has(c.id))fehler.push(c.id+': doppelt');ids.add(c.id);if(!A[c.ausloeser])fehler.push(c.id+': Auslöser fehlt');if(!stufen.includes(c.stufe))fehler.push(c.id+': Stufe');
    if(c.chance!=null&&!(c.chance>0&&c.chance<=1))fehler.push(c.id+': chance'); /* Anlasskarten (K30d) */
    (c.wirkung||[]).forEach(w=>{if(!erlaubt.includes(w.art))fehler.push(c.id+': Wirkung '+w.art);});if(c.wirkung&&c.art!=='info')fehler.push(c.id+': wirkung nur an Info-Karten'); /* K30e */
    if(!c.texte||!c.texte.length)fehler.push(c.id+': kein Text');(c.texte||[]).forEach(t=>{if(platz(t).length)fehler.push(c.id+': Platzhalter '+platz(t));});
    if(c.art==='entscheidung'){if(!c.optionen||c.optionen.length<2||c.optionen.length>3)fehler.push(c.id+': Optionen');if(!(c.auto>=0&&c.auto<(c.optionen||[]).length))fehler.push(c.id+': Voreinstellung');}
    else if(c.art!=='info')fehler.push(c.id+': Art');
    (c.optionen||[]).forEach(o=>{(o.wirkung||[]).forEach(w=>{if(!erlaubt.includes(w.art))fehler.push(c.id+': Wirkung '+w.art);
      (w.dann||[]).forEach(x=>{if(!erlaubt.includes(x.art))fehler.push(c.id+': Wirkung '+x.art);});if(w.dann&&!ev('KARTEN_MIT_ERFOLG').includes(w.art))fehler.push(c.id+': dann bei '+w.art);}); /* Prüfung EE */[o.folge,...(o.wirkung||[]).map(w=>w.gut),...(o.wirkung||[]).map(w=>w.schlechtText)].filter(Boolean).forEach(t=>{if(platz(t).length)fehler.push(c.id+': Platzhalter '+platz(t));});});});
  /* Ketten (K30c, K30 §10): jede Folgekarte existiert und kommt nur über die Kette, jede nurKette-Karte hat einen Vorgänger, tage gültig */
  const ziele=new Set();K.forEach(c=>(c.optionen||[]).forEach(o=>{if(!o.kette)return;const z=K.find(x=>x.id===o.kette.karte),t=o.kette.tage;ziele.add(o.kette.karte);
    if(!z)fehler.push(c.id+': Folgekarte '+o.kette.karte+' fehlt');else if(!z.nurKette)fehler.push(o.kette.karte+': Folgekarte ohne nurKette');if(!Array.isArray(t)||!(t[0]>=1&&t[1]>=t[0]))fehler.push(c.id+': Kette ohne gültige tage');}));
  K.forEach(c=>{if(c.nurKette&&!ziele.has(c.id))fehler.push(c.id+': nurKette ohne Vorgänger');});
  pruef(!fehler.length&&K.length>=5,'Katalog: nur erlaubte Wirkungen und Platzhalter, jeder Auslöser vorhanden, Entscheidungen mit 2–3 Optionen und gültiger Voreinstellung, Folgekarten vorhanden',fehler.join('; ')||`${K.length} Karten`);}

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
  const sq=ev('squad')(VEREIN),p=sq.slice().sort((a,b)=>b.str-a.str)[0];sq.forEach(x=>{delete x.seit;delete x.ausAb;x.nat=ev('RW').nation.heimat;});S.tag=ev('meineLigaspiele')()[K.abSpieltag].tag+1;
  p.seit=heute()-K.neuMin-6;const n1=A.neuzugangDraengt();p.sst={s:S.season,tid:VEREIN,min:K.kaumMinuten+1};const n2=A.neuzugangDraengt();delete p.sst;p.seit=heute()-K.neuTage-1;const n3=A.neuzugangDraengt();
  p.ausAb=heute()-10;p.nat='BRA';const e1=A.eingewoehnung();p.nat=ev('RW').nation.heimat;const e2=A.eingewoehnung();
  pruef(party&&keineParty&&!!n1&&n1.spieler===p.id&&n2===null&&n3===null&&!!e1&&e1.spieler===p.id&&e2===null,'Kabinen-Karten: Kantersieg, Neuzugang ohne Einsatz, Eingewöhnung',
    `Party ${party}/${keineParty}, Neuzugang ${n1&&n1.spieler===p.id} / mit Einsatz ${n2} / zu lange da ${n3}, Eingewöhnung ${e1&&e1.spieler===p.id} / Inländer ${e2}`);}

// K14c. Führungsspieler meutert (K14 §8): nur ein Führungsspieler mit Stimmung unter 25
{const {ev}=welt(),A=ev('AUSLOESER'),K=ev('RKT').kabine,sq=ev('squad')(VEREIN);sq.forEach(x=>{ev('stimmung')(x);x.eig=(ev('eigenschaften')(x)||[]).filter(e=>e!=='fuehrungsspieler');x.st=50;});
  const p=sq[0];p.eig=p.eig.concat(['fuehrungsspieler']);p.st=K.meutertUnter-5;const ja=A.meuterei();p.st=K.meutertUnter+5;const gut=A.meuterei();p.st=10;p.eig=p.eig.filter(e=>e!=='fuehrungsspieler');const ohne=A.meuterei();
  pruef(!!ja&&ja.spieler===p.id&&gut===null&&ohne===null,'Meuterei: Führungsspieler mit schlechter Stimmung, sonst nicht',`schlecht ${ja&&ja.spieler===p.id}, gut ${gut}, kein Führungsspieler ${ohne}`);}

// K30b. Meldungsdichte (K30 §5.1): „wenig“ erlaubt eine kleine Entscheidung je zwei Wochen und 3 Infos, „viel“ zwei je Woche und 8 Infos, „normal“ wie bisher.
//       Die Vorwoche zählt nur, wenn sie direkt davor lag. Ohne Einstellung gilt „normal“.
{const {S,F,ev}=welt(),c=ev('karteVon')('hochzeit'),d=S.tag,R0=ev('RKT'),frei=ev('wochenSpiele')(d)+2<=R0.halteProWoche;
  const W=F.kartenBudget(d);W.ent=1;const W2=F.kartenBudget(d+7),vor=W2.entVor,W4=(()=>{W2.ent=1;return F.kartenBudget(d+21);})(),luecke=W4.entVor;
  const stufe=k=>{F.kartenDichteSetzen(k);return F.kartenDichte();},ohne=(delete S.einst,ev('kartenDichteStufe')());
  const probe=(k,ent,entVor)=>{F.kartenDichteSetzen(k);const X={ent,entVor,gross:0,ber:{}};return F.entscheidungImBudget(c,X,d);};
  const wenigVor=probe('wenig',0,1),normalVor=probe('normal',0,1),vielZweite=probe('viel',1,0),normalZweite=probe('normal',1,0);
  pruef(ohne==='normal'&&vor===1&&luecke===0&&stufe('wenig').info===3&&stufe('normal').info===R0.infoProWoche&&stufe('viel').info===8&&wenigVor===false&&normalVor===probe('normal',0,0)&&normalZweite===false&&vielZweite===frei,
    'Meldungsdichte: wenig, normal, viel verschieben die Grenzen; Vorwoche nur direkt davor; ohne Einstellung normal',`Vorwoche ${vor}/${luecke}, wenig nach einer Entscheidung der Vorwoche ${wenigVor}, viel zweite ${vielZweite} (Halte frei ${frei})`);}

// K07c. Trainingskarten (K07 §8): Pause nur bei Frische unter 65 und Professionalität ab 13; die Wirkung pause hebt die Frische und kostet Spielpraxis;
//       Verletzungsserie ab drei Trainingsverletzungen in 14 Tagen, ältere zählen nicht
{const {S,ev}=welt(),A=ev('AUSLOESER'),T=ev('RKT').training,sq=ev('squad')(S.my),heute=ev('absTag')(S.tag);
  sq.forEach(q=>{q.fit=100;q.inj=0;delete q.vl;delete q.vh;});const p=sq[0];p.ch=Object.assign({},p.ch||{},{pro:T.profiAb});p.fit=T.pauseUnter-5;const ja=A.pauseBitte();
  p.ch.pro=T.profiAb-1;const unprofi=A.pauseBitte();p.ch.pro=T.profiAb;p.fit=T.pauseUnter+1;const frisch=A.pauseBitte();
  p.fit=50;p.sp=50;ev('kartenWirkung')({art:'pause',wert:15},{spieler:p.id},{titel:'Test'});const wirkt=p.fit===65&&p.sp===50-T.pauseSpielpraxis;
  const tv=ab=>[{art:'zerrung',q:'training',ab,t:10}];sq[0].vh=tv(heute-3);sq[1].vh=tv(heute-4);const zwei=A.verletzungsserie();sq[2].vh=tv(heute-5);const drei=A.verletzungsserie();
  sq[2].vh=tv(heute-T.serieTage-1);const alt=A.verletzungsserie();
  pruef(!!ja&&ja.spieler===p.id&&unprofi===null&&frisch===null&&wirkt&&zwei===null&&!!drei&&alt===null,'Trainingskarten: Pause nur müde und professionell, Wirkung pause, Verletzungsserie ab drei in 14 Tagen',
    `Pause ${!!ja}, unprofessionell ${unprofi}, frisch ${frisch}, Wirkung ${wirkt}, zwei ${zwei}, drei ${!!drei}, eine zu alt ${alt}`);}

// K08b. Talent zum Probetraining (K08 §8): Auslöser in der Saison; die Wirkung talent bringt einen 16-Jährigen in den Jugendkader (auch im Index), wert 0 bringt niemanden
{const {S,ev,im}=welt(),A=ev('AUSLOESER');S.phase='play';const ja=!!A.probetraining();ev('jugendKader')();const n0=S.jg.length;
  im('pt',()=>ev('kartenWirkung')({art:'talent',wert:6},{},{titel:'Test'}));const neu=S.jg[S.jg.length-1],n1=S.jg.length;ev('kartenWirkung')({art:'talent',wert:0},{},{titel:'Test'});
  pruef(ja&&n1===n0+1&&neu.age===ev('RKT').jugend.alter&&ev('PIX').get(neu.id)===neu&&ev('istJugend')(neu)&&S.jg.length===n1,'Probetraining: neues Talent im Jugendkader, ohne Erfolg niemand',
    `Auslöser ${ja}, Jugendkader ${n0} → ${n1}, Alter ${neu&&neu.age}, Talent ${neu&&neu.pot}`);}

// K08c. Großer Verein lockt dein Talent (K08 §8): Auslöser nur mit einem Talent ab 17 über dem Kaderschnitt; Profivertrag holt ihn in den Kader;
//       ziehen lassen: er spielt danach beim Verein, Ausbildungsentschädigung fließt, Weiterverkaufsbeteiligung für dich
{const {S,ev}=welt(),A=ev('AUSLOESER'),J=ev('RKT').jugend;S.phase='play';ev('jugendKader')();const lvl=ev('teamLevel')(S.my);S.jg.forEach(p=>{p.pot=lvl-5;});const ohne=A.talentGelockt();
  const [p1,p2]=S.jg;p1.age=p2.age=J.lockAb;p1.pot=p2.pot=lvl+J.lockPlus+2;const b=A.talentGelockt(),wirk=ev('kartenWirkung');
  const k0=ev('squad')(S.my).length;wirk({art:'jugendHoch',wert:1},{spieler:p1.id},{titel:'Test'});const hoch=p1.team===S.my&&!S.jg.includes(p1)&&ev('squad')(S.my).length===k0+1;
  const v=b?S.teams[b.verein]:S.teams.find(x=>x.id!==S.my),c0=v.cash,f0=S.fin['Jugend: Abgänge']||0;wirk({art:'jugendWeg',wert:1},{spieler:p2.id,verein:v.id},{titel:'Test'});
  const geld=(S.fin['Jugend: Abgänge']||0)-f0,weg=p2.team===v.id&&!S.jg.includes(p2)&&!!p2.wvb&&p2.wvb.tid===S.my&&c0-v.cash===geld;
  pruef(ohne===null&&!!b&&hoch&&weg,'Talent gelockt: Auslöser, Profivertrag in den Kader, Wechsel mit Ausbildungsentschädigung und Beteiligung',`ohne Talent ${ohne}, Auslöser ${!!b}, Profivertrag ${hoch}, Wechsel ${weg} (${geld} €)`);}

// K16c. Mitarbeiter abgeworben (K16 §8): Auslöser mit einem guten Mitarbeiter und einem Verein mit mehr Ansehen und freiem Platz; ziehen lassen: er wechselt, Ablöse
//       ein Jahresgehalt; halten: Gehalt + 20 %; der Platzhalter {mitarbeiter} nennt Name und Rolle
{const {S,ev,im}=welt(),A=ev('AUSLOESER'),K=ev('RKT').stab,R=ev('RST'),t=ev('myT()');const x=ev('stabNeu')('athletik',K.qAb+2,S.my,t.lg);S.stab.push(x);ev('stabGeaendert')();
  const b0=im('k16c',()=>A.stabAbgeworben()),wirk=ev('kartenWirkung'),text=ev('kartenText')('{mitarbeiter}',{stab:x.id});
  const sal0=x.sal;wirk({art:'stabHalten',wert:0.2},{stab:x.id},{titel:'Test'});const halten=x.sal===Math.round(sal0*1.2/1000)*1000&&x.team===S.my;
  const v=S.teams.find(y=>y.id!==S.my&&ev('aktiv')(y)&&ev('stabVon')(y.id,'athletik').length<R.rollen.athletik.plaetze),f0=S.fin['Stab: Ablöse']||0,c0=v.cash;
  wirk({art:'stabWeg',wert:1},{stab:x.id,verein:v.id},{titel:'Test'});const geld=(S.fin['Stab: Ablöse']||0)-f0,weg=x.team===v.id&&geld===Math.round(x.sal*K.abloese/1000)*1000&&c0-v.cash===geld;
  pruef(!!b0&&halten&&weg&&text.includes(x.n)&&text.includes(R.rollen.athletik.name),'Mitarbeiter abgeworben: Auslöser, halten mit mehr Gehalt, wechseln mit Ablöse, Platzhalter',
    `Auslöser ${!!b0}, halten ${halten}, wechseln ${weg} (${geld} €), Text ${text}`);}

// K27c. Fan-Karten (K27 §8): Protest nur bei Preis weit über dem Richtpreis und schlechter Fanstimmung, die Wirkung preisRichtwert setzt den Richtpreis;
//       Pfiffe nur gegen einen Spieler mit offiziellem Wechselwunsch
{const {S,ev}=welt(),A=ev('AUSLOESER'),F=ev('RKT').fans,t=ev('myT()'),rp=ev('richtPreis')(t);S.phase='play';
  t.price=Math.round(rp*F.preisFaktor+5);t.fanst=F.protestUnter-10;const ja=!!A.ticketProtest();t.fanst=F.protestUnter+10;const gut=A.ticketProtest();t.fanst=F.protestUnter-10;
  t.price=Math.round(rp);const billig=A.ticketProtest();t.price=Math.round(rp*F.preisFaktor+5);ev('kartenWirkung')({art:'preisRichtwert',wert:1},{},{titel:'Test'});const gesenkt=t.price===Math.round(rp)||t.price===ev('RF').ticketPreis.min||t.price===ev('RF').ticketPreis.max;
  const sq=ev('squad')(S.my);sq.forEach(p=>{p.ww=0;});const keine=A.pfiffe();sq[0].ww=F.wwAb;const pf=A.pfiffe();
  pruef(ja&&gut===null&&billig===null&&gesenkt&&keine===null&&!!pf&&pf.spieler===sq[0].id,'Fan-Karten: Protest bei hohem Preis und schlechter Stimmung, Preis auf Richtwert, Pfiffe bei Wechselwunsch',
    `Protest ${ja}, gute Stimmung ${gut}, billig ${billig}, gesenkt ${gesenkt}, Pfiffe ${pf&&pf.spieler===sq[0].id}`);}

// K21c. Vertragskarten (K21 §8, K22 §8): Gehaltsneid nur bei Gehalt unter 70 % des Marktgehalts und gesunkener Stimmung, gehaltAnpassen hebt auf 90 %;
//       Provisionsstreit nur bei einem Neuzugang mit Berater
{const {S,ev}=welt(),A=ev('AUSLOESER'),V=ev('RKT').vertrag,sq=ev('squad')(S.my),sf=ev('salaryFor'),heute=ev('absTag')(S.tag);
  sq.forEach(p=>{ev('stimmung')(p);p.st=80;p.sal=Math.round(sf(p.str)*0.5);delete p.seit;}); /* alle niedrig, damit der Gehaltsrahmen die Erhöhung sicher erlaubt (ED7) */const p=sq[0];p.sal=Math.round(sf(p.str)*0.5);const zufrieden=A.gehaltsneid();p.st=V.neidStimmung-10;const neid=A.gehaltsneid();
  const s0=p.sal,neu=Math.round(sf(p.str)*0.9/1000)*1000;ev('kartenWirkung')({art:'gehaltAnpassen',wert:0.9},{spieler:p.id},{titel:'Test'});const ok=p.sal===neu;
  const keinNeu=A.provision(),q=sq.find(x=>!!ev('beraterVon')(x));if(q)q.seit=heute-5;const prov=q?A.provision():{spieler:null};let bzOk=true;if(q){const bz0=ev('beraterVon')(q).bz;ev('kartenWirkung')({art:'beraterBez',wert:5},{spieler:q.id},{titel:'Test'});bzOk=ev('beraterVon')(q).bz===Math.min(100,bz0+5);}
  /* Prüfung EE6: „Zahlen“ gibt die Beziehung zum Berater nur, wenn bezahlt wird (dann) */let zahlOk=true;
  if(q){const c=ev('karteVon')('provision'),w=c.optionen[0].wirkung[0],bz=()=>ev('beraterVon')(q).bz,f=()=>S.fin.Ereignisse||0;let b0=bz(),f0=f();ev('kartenWirkung')(w,{spieler:q.id},c);const mitZ=f()<f0&&bz()===Math.min(100,b0+5);
    q.team=-1;b0=bz();f0=f();ev('kartenWirkung')(w,{spieler:q.id},c);zahlOk=mitZ&&f()===f0&&bz()===b0;q.team=S.my;}
  pruef(zufrieden===null&&!!neid&&neid.spieler===p.id&&ok&&keinNeu===null&&(!q||(!!prov&&prov.spieler===q.id))&&bzOk&&zahlOk,'Vertragskarten: Gehaltsneid, Gehalt angepasst, Provisionsstreit nur bei Neuzugang mit Berater, Beziehung nur mit Zahlung',
    `zufrieden ${zufrieden}, Neid ${!!neid}, Gehalt ${p.sal}, Provision ohne Neuzugang ${keinNeu}, mit ${q?!!prov:'kein Spieler mit Berater'}, Zahlung und Beziehung ${zahlOk}`);}

// K26e. Stadt bietet Zuschuss (K26 §8): nur bei einem laufenden Bauprojekt ab 5 Mio. €, einmal; die Wirkung zahlt 15 % der Baukosten
{const {S,ev}=welt(),A=ev('AUSLOESER'),Z=ev('RKT').stadion;S.constr=null;const ohne=A.zuschuss();S.constr={k:'cap',label:'Test',phase:'bau',ab:0,bis:999,kosten:Z.zuschussAb*2};const ja=!!A.zuschuss();
  const f0=S.fin['Stadionbau']||0;ev('kartenWirkung')({art:'zuschuss',wert:0.15},{},{titel:'Test'});const geld=(S.fin['Stadionbau']||0)-f0,nochmal=A.zuschuss();S.constr=null;
  pruef(ohne===null&&ja&&geld===Math.round(Z.zuschussAb*2*0.15/1000)*1000&&nochmal===null,'Stadt bietet Zuschuss: nur beim Bauprojekt, 15 % der Kosten, einmal',`ohne Bau ${ohne}, Auslöser ${ja}, Geld ${geld}, nochmal ${nochmal}`);}

// K12c. Sommerkarten (K12a §8): Übergewicht nur in den Tagen nach dem Leistungstest bei einem Spieler weit unter dem Kondition-Schnitt; Sonderschichten heben die
//       Kondition und kosten Frische; Urlaubsfoto nur im Urlaub und nur bei einem Partylöwen
{const {S,ev}=welt(),A=ev('AUSLOESER'),SO=ev('RSO').leistungstest,K=ev('RKT').sommer,t=ev('myT()'),sq=ev('squad')(S.my).filter(p=>p.inj<=0);
  sq.forEach(p=>{p.ko=80;p.fit=90;});const p=sq[0];p.ko=80-SO.uebergewichtAb-5;const test=ev('auftaktTag')(t)+SO.tag;S.lt={s:S.season,tid:S.my,tag:test,ids:[p.id]}; /* wie nach dem Leistungstest (ED5) */
  S.tag=test-3;const vorher=A.uebergewicht();S.tag=test+2;const ja=A.uebergewicht();S.tag=test+K.nachTestTage+1;const spaet=A.uebergewicht();S.tag=test+2;
  const ko0=p.ko;ev('kartenWirkung')({art:'sonderschicht',wert:6},{spieler:p.id},{titel:'Test'});const schicht=p.ko===ko0+6&&p.fit===90-K.sonderFrische;
  const keinUrlaub=A.urlaubsfoto();
  pruef(vorher===null&&!!ja&&ja.spieler===p.id&&spaet===null&&schicht&&keinUrlaub===null,'Sommerkarten: Übergewicht nach dem Test, Sonderschichten, kein Urlaubsfoto außerhalb des Urlaubs',
    `vorher ${vorher}, danach ${!!ja}, zu spät ${spaet}, Sonderschicht ${schicht}, Urlaubsfoto ${keinUrlaub}`);}

// K29k. Presse-Karten (K29 §8, K17 §8): Leck nur bei Medienklima unter 45; Fehde nur mit einem Verein deiner Liga, zu dem die Beziehung unter −50 liegt
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),P=ev('presseS')(),t=ev('myT()');P.klima=60;const kein=A.leck();P.klima=30;const leck=!!A.leck();
  const keineFehde=A.fehde(),x=S.teams.find(y=>y.id!==S.my&&y.lg===t.lg&&ev('aktiv')(y));F.bezDuAendern(x.id,-90,'Test');const f=A.fehde();
  pruef(kein===null&&leck&&keineFehde===null&&!!f&&f.verein===x.id,'Presse-Karten: Leck bei schlechtem Klima, Fehde bei schlechter Beziehung',`Klima 60 ${kein}, Klima 30 ${leck}, Fehde ohne ${keineFehde}, mit ${f&&f.verein===x.id}`);}

// K17b. Hilfe in der Not (K17 §8): nur im offenen Fenster, ab fünf Verletzten und mit einem Verein, zu dem die Beziehung über 40 liegt; die Wirkung leihe holt den Spieler.
//       Seit Prüfung EE: Der Auslöser bietet nur Spieler an, die die Leihe zuließe (ausleihenGrund), der Verleiher behält mehr als kaderMin. Die Beziehung +5 gibt es nur mit Leihe (dann),
//       und mit Lizenz unter der Stufe der Leihen holt die Karte niemanden.
{const fall=lz=>{const {S,F,ev}=welt(),A=ev('AUSLOESER'),H=ev('RKT').hilfe,sq=ev('squad')(S.my);sq.forEach(p=>{p.inj=0;});const ohne=A.hilfeInNot();
    sq.slice(0,H.verletzteAb).forEach(p=>{p.inj=20;});const b=S.teams.find(x=>x.id!==S.my&&ev('aktiv')(x));F.bezDuAendern(b.id,90,'Test');
    const offen=ev('fensterOffen')(),h=A.hilfeInNot();let geholt=null,plus=null,frei=null,kmin=null;
    if(h){const p=ev('PIX').get(h.spieler),c=ev('karteVon')('hilfeInNot');frei=F.ausleihenGrund(p)===null;kmin=ev('squad')(h.verein).length>ev('RM').verkaeufer.kaderMin;if(lz)F.lizenzStart(true);
      const b0=F.bezDu(h.verein);c.optionen[0].wirkung.forEach(w=>ev('kartenWirkung')(w,h,c));geholt=p.team===S.my&&!!p.leihe;plus=F.bezDu(h.verein)-b0;}
    return{ohne,offen,h,b,geholt,plus,frei,kmin};};
  const a=fall(false),z=fall(true);
  pruef(a.ohne===null&&(a.offen?!!a.h&&a.h.verein===a.b.id&&a.frei&&a.kmin&&a.geholt===true&&a.plus===5&&z.geholt===false&&z.plus===0:a.h===null),'Hilfe in der Not: Verletzungskrise, befreundeter Verein, Leihe nur wenn möglich, Beziehung nur mit Leihe, Lizenz',
    `ohne Krise ${a.ohne}, Fenster ${a.offen}, Angebot ${a.h&&a.h.verein}, ausleihbar ${a.frei}, Verleiher über kaderMin ${a.kmin}, geholt ${a.geholt} (+${a.plus}), mit Lizenz geholt ${z.geholt} (+${z.plus})`);}

// K22c. Berater droht mit Wechsel (K22 §8): nur bei einem Spieler im letzten Vertragsjahr mit gierigem Berater
//       Seit Prüfung EE5 nur unter dem Marktgehalt; „Nachgeben“ gibt Beziehung und Stimmung nur mit Erhöhung (dann), sonst nennt die Karte den Grund.
{const {S,ev}=welt(),A=ev('AUSLOESER'),sq=ev('squad')(S.my),bv=ev('beraterVon'),sf=ev('salaryFor');sq.forEach(p=>{p.ct=3;p.sal=Math.round(sf(p.str)*0.5);});const ohne=A.beraterDroht(); /* EF5: sicher im Gehaltsrahmen */
  const g=sq.find(p=>(bv(p)||{}).prof==='gierig'),a=sq.find(p=>bv(p)&&bv(p).prof!=='gierig');if(g)g.ct=1;if(a)a.ct=1;let gut=null,mit=null,dann=null,ohneErh=null;
  if(g){g.sal=sf(g.str)*2;gut=A.beraterDroht();g.sal=Math.round(sf(g.str)*0.8/1000)*1000;mit=A.beraterDroht();
    const c=ev('karteVon')('beraterDroht'),w=c.optionen[0].wirkung[0],b0=bv(g).bz,s0=g.sal;const t=ev('kartenWirkung')(w,{spieler:g.id},c);dann=g.sal>s0&&bv(g).bz-b0===5&&!!t;
    const b1=bv(g).bz;const t2=ev('kartenWirkung')(w,{spieler:g.id},c);ohneErh=bv(g).bz===b1&&/verdient schon/.test(t2);}
  else mit=A.beraterDroht();
  pruef(ohne===null&&(g?gut===null&&!!mit&&mit.spieler===g.id&&dann&&ohneErh:mit===null),'Berater droht: nur letztes Vertragsjahr, gieriger Berater und unter Marktgehalt; Bonus nur mit Erhöhung',
    `ohne ${ohne}, gierig ${g?g.n:'keiner im Kader'}, gut bezahlt ${gut}, Auslöser ${mit&&mit.spieler}, Nachgeben mit Erhöhung ${dann}, zweimal ohne Erhöhung ${ohneErh}`);}

// K03b. Formkarten (K03 §8): Formkrise bis Form 4, Formhoch ab 16, nur gesunde Spieler; die Wirkung selbstvertrauen ändert das Selbstvertrauen
{const {S,ev}=welt(),A=ev('AUSLOESER'),FK=ev('RKT').form,sq=ev('squad')(S.my);S.phase='play';sq.forEach(p=>{p.form=10;p.inj=0;});const keine=A.formkrise()===null&&A.formhoch()===null;
  const p=sq[0],q=sq[1];p.form=FK.kriseBis;q.form=FK.hochAb;const k=A.formkrise(),h=A.formhoch();p.inj=5;const verletzt=A.formkrise();p.inj=0;
  const sv0=p.sv||0;ev('kartenWirkung')({art:'selbstvertrauen',wert:2},{spieler:p.id},{titel:'Test'});const sv=(p.sv||0)-sv0;
  pruef(keine&&!!k&&k.spieler===p.id&&!!h&&h.spieler===q.id&&verletzt===null&&sv>0,'Formkarten: Krise und Hoch nach Form, nicht verletzt, Selbstvertrauen wirkt',`ohne ${keine}, Krise ${k&&k.spieler===p.id}, Hoch ${h&&h.spieler===q.id}, verletzt ${verletzt}, Selbstvertrauen +${sv}`);}

// K30c. Ketten und „Der lachende Dritte“ (K30 §3.1, §8.3, K17 §5.4): Der Auslöser braucht das offene Fenster, zwei Mitbieter und den Berater oder einen Verwandten.
//       Das Treffen kostet Geld, setzt den Merker und legt die Folgekarte auf drei bis sieben Tage später. kartenKette zeigt sie erst am fälligen Tag und lässt sie still verfallen,
//       wenn der Spieler weg ist oder die Saison vorbei. nachlass senkt die Forderung oder kostet Beziehung. dritterKauf: zwischen den beiden −10, du −2 (leise 0), nur beim selben
//       Verkäufer. Der Vereinswechsel löscht die Ketten.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),L=ev('RKT').dritter,me=ev('myT()'),aktiv=ev('aktiv'),hb=ev('hatBedarf'),val=ev('value'),absTag=ev('absTag');S.phase='play';
  let n=0;while(!ev('fensterOffen')()&&n++<400)S.tag++;S.pl.forEach(p=>{p.list=0;});
  const p=S.pl.find(p=>p.team>=0&&p.team<1000&&p.team!==S.my&&!p.wech&&!p.leihe&&!(p.inj>0)&&aktiv(S.teams[p.team])&&hb(me,p)&&F.mitbieter(p,S.teams[p.team],val(p)).length>=2);let ok=false,info='kein Spieler mit zwei Mitbietern gefunden';
  if(p){p.list=1;const be=ev('beraterVon')(p);if(be)be.bz=0;L.verwandt=0;const ohne=A.lachenderDritter();L.verwandt=1;const h=A.lachenderDritter();
    const ok1=ohne===null&&!!h&&h.spieler===p.id&&h.verein===p.team&&h.mit.length===2&&h.mit[0]!==h.mit[1]&&!h.mit.includes(p.team)&&!h.mit.includes(S.my);
    const heute=absTag(S.tag);let ok2=false,frueh=false,kam=false,verfallen=false,nach=null,fd=null,leise=false,gegen=null,einig=false,auf=null,z=[],da=[],weg=false,e=null;
    if(ok1){F.kartenZeigen(ev('karteVon')('dritterTipp'),h,S.tag,true);F.karteWaehlen(S.karten.offen.length-1,0);e=(S.karten.kette||[])[0];
      ok2=S.karten.kette.length===1&&e.id==='dritterTreffen'&&e.tag>=heute+3&&e.tag<=heute+7&&(S.fin.Ereignisse||0)<0&&!!p.ld3&&p.ld3.v===p.team&&p.ld3.leise===0;
      if(ok2){const tagD=S.tag+(e.tag-heute);F.kartenKette(tagD-1);frueh=S.karten.kette.length===1;F.kartenKette(tagD);
        kam=!S.karten.kette.length&&(S.karten.offen.some(k=>k.id==='dritterTreffen')||S.karten.log.some(l=>l.id==='dritterTreffen'));}
      /* Verfall: Spieler nicht mehr beim Verein der Karte, Eintrag aus der Vorsaison */
      S.karten.kette=[{id:'dritterTreffen',tag:heute,s:S.season,b:{spieler:p.id,verein:h.mit[0],mit:h.mit}},{id:'dritterTreffen',tag:heute,s:S.season-1,b:h}];
      const nOff=S.karten.offen.length,nLog=S.karten.log.length;F.kartenKette(S.tag);verfallen=!S.karten.kette.length&&S.karten.offen.length===nOff&&S.karten.log.length===nLog;
      /* nachlass: Forderung −10 % und leise, aufgeflogen −10 Beziehung zum Verkäufer */
      F.verhandlung(p).f=null;fd=ev('forderungDu')(p);F.kartenWirkung({art:'nachlass',wert:0.1},h,{titel:'Test'});nach=F.forderung(p);leise=!!p.ld3&&p.ld3.leise===1;p.gerF={f:1.1,bis:absTag(S.tag)+30};const kr=F.kaufRunde(p,ev('rundeAb')(nach*0.8));gegen=kr.ok?null:kr.gegen;delete p.gerF;F.verhandlung(p).einig={fee:fd*2,bis:S.tag+14};F.kartenWirkung({art:'nachlass',wert:0.1},h,{titel:'Test'});einig=F.verhandlung(p).einig.fee<fd*2;delete F.verhandlung(p).einig;
      const du0=F.bezDu(p.team);F.kartenWirkung({art:'nachlass',wert:-10},h,{titel:'Test'});auf=F.bezDu(p.team)-du0;
      /* Ausgang: nicht leise, leise, falscher Verkäufer */
      const [a,b]=h.mit,m=l=>({s:S.season,t:S.my,v:p.team,mit:[a,b],leise:l});z.push(F.bez(a,b));da.push(F.bezDu(a));
      p.ld3=m(0);F.dritterKauf(p,p.team);z.push(F.bez(a,b));da.push(F.bezDu(a));p.ld3=m(1);F.dritterKauf(p,p.team);z.push(F.bez(a,b));da.push(F.bezDu(a));
      p.ld3=m(0);F.dritterKauf(p,a);z.push(F.bez(a,b));
      /* Vereinswechsel */
      S.karten.kette=[{id:'dritterTreffen',tag:heute+5,s:S.season,b:h}];F.kartenJobwechsel();weg=!S.karten.kette.length;}
    ok=ok1&&ok2&&frueh&&kam&&verfallen&&nach<=ev('rundeAb')(fd*0.9)&&leise&&(gegen==null||gegen<=nach)&&einig&&auf===-10&&z[1]-z[0]===L.zwischen&&da[1]-da[0]===L.du&&z[2]-z[1]===L.zwischen&&da[2]===da[1]&&z[3]===z[2]&&!p.ld3&&weg;
    info=`Spieler ${p.n}, ohne Berater und Verwandten ${ohne}, Auslöser ${!!h}, Treffen ${ok2} (${e?e.tag-heute:'-'} Tage), nicht zu früh ${frueh}, gekommen ${kam}, verfallen ${verfallen}, Forderung ${fd} → ${nach}, Gegenangebot ${gegen}, vereinbart gesenkt ${einig}, leise ${leise}, aufgeflogen ${auf}, zwischen ${z[1]-z[0]}/${z[2]-z[1]}/${z[3]-z[2]}, du ${da[1]-da[0]}/${da[2]-da[1]}, Jobwechsel ${weg}`;}
  pruef(ok,'Der lachende Dritte: Auslöser, Folgekarte nach 3 bis 7 Tagen, Verfall, Nachlass, Ausgang für die beiden Vereine und dich',info);}

// K30d. Anlasskarten (K30 §5.4, K37 §12 Nr. 21): Karten mit chance nehmen diese Chance je Woche statt der Stufe; das Wunder (chance 1) kommt in der Woche nach dem Rückspiel sicher.
{const {S,W,ev}=welt(),AV=ev('AV0'),me=S.my,d=S.tag,kc=ev('kartenChance'),kv=ev('karteVon');S.phase='play';W.ev('euMeineSpiele=function(){return S.testEu||[];}');
  const sp=o=>Object.assign({wb:'el',runde:'af',leg:0,tag:d,min:0,h:me,a:AV,hg:null,ag:null,pen:null},o);S.testEu=[sp({tag:d-11,h:AV,a:me,hg:3,ag:0}),sp({leg:1,tag:d-4,hg:4,ag:0})];
  const vorher=((S.karten||{}).log||[]).length;ev('kartenWoche')(d);const wunder=S.karten.log.slice(vorher).some(l=>l.id==='wunder');delete S.testEu;
  const stufe=Math.abs(kc(kv('hochzeit'))-1/(ev('RKT').seltenheit.haeufig*ev('RKT').wochenJeSaison))<1e-12;
  pruef(kc(kv('wunder'))===1&&kc(kv('fanmarsch'))===kv('fanmarsch').chance&&stufe&&wunder,'Anlasskarten: eigene Chance je Woche statt der Stufe, das Wunder kommt sicher',
    `Wunder ${kc(kv('wunder'))}, Fanmarsch ${kc(kv('fanmarsch'))}, Hochzeit nach Stufe ${stufe}, Wunder in der Woche ${wunder}`);}

// K10e. Medizin-Karten (K10 §8): Grippewelle erst ab drei Kranken, der Hygieneplan beendet die Ansteckung und setzt hygBis. Lange Reha nur bei langer Verletzung mit Diagnose;
//       der Spezialist halbiert das Rückfallrisiko nach der Rückkehr und kostet nur, solange der Spieler noch verletzt ist (dann).
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),M=ev('RKT').medizin,sq=ev('squad')(S.my),t=ev('myT()'),heute=ev('absTag')(S.tag),st=ev('stimmung');S.phase='play';
  sq.forEach(p=>{p.inj=0;p.vl=null;st(p);p.st=50;});const keine=A.grippewelle()===null&&A.langeReha()===null;
  sq.slice(0,M.grippeAb-1).forEach(p=>F.verletzen(p,'krankheit',{still:true}));const zuWenig=A.grippewelle()===null;F.verletzen(sq[M.grippeAb-1],'krankheit',{still:true});const welle=!!A.grippewelle();
  ev('kartenWirkung')({art:'hygiene',wert:14},{},{titel:'Test'});const hyg=t.krankBis<heute&&t.hygBis===heute+14;F.verletzen(sq[M.grippeAb],'krankheit',{still:true});const hygNeu=ev('krankFaktor')(t,heute)===ev('RMD').krankheit.hygiene;
  const p=sq[M.grippeAb+1],q=sq[M.grippeAb+2];[p,q].forEach(x=>{F.verletzen(x,'kollision',{art:'kreuzband',still:true});x.vl.dg=heute;});const mit=A.langeReha();
  let bezahlt=false,nochmal=null,halb=false,gesund=false;
  if(mit){const r=ev('PIX').get(mit.spieler),s=r===p?q:p,c=ev('karteVon')('langeReha'),w=c.optionen[0].wirkung[0],f0=S.fin.Ereignisse||0,st0=st(r);ev('kartenWirkung')(w,mit,c);
    bezahlt=(S.fin.Ereignisse||0)<f0&&r.vl.rfF===0.5&&st(r)>st0;nochmal=A.langeReha();const RF=ev('RMD').arten.kreuzband.rueckfall;
    r.inj=0;F.medizinRueckkehr(r);s.inj=0;F.medizinRueckkehr(s);halb=Math.abs(r.rf.w-RF*0.5)<1e-9&&Math.abs(s.rf.w-RF)<1e-9;
    const f1=S.fin.Ereignisse||0;ev('kartenWirkung')(w,{spieler:r.id},c);gesund=(S.fin.Ereignisse||0)===f1&&!r.vl;nochmal=nochmal&&nochmal.spieler===s.id;}
  pruef(keine&&zuWenig&&welle&&hyg&&hygNeu&&!!mit&&bezahlt&&nochmal&&halb&&gesund,'Medizin-Karten: Grippewelle ab drei Kranken, Hygieneplan, lange Reha, Spezialist halbiert den Rückfall und kostet nur mit Verletzung',
    `ohne Anlass ${keine}, zwei Kranke ${zuWenig}, drei ${welle}, Hygiene ${hyg}, nach neuem Kranken ${hygNeu}, Reha ${!!mit}, bezahlt ${bezahlt}, der andere danach ${nochmal}, Rückfall halb ${halb}, gesund ohne Kosten ${gesund}`);}

// K07e, K14d. Rangelei im Training: nur ein gesunder Hitzkopf mit einem gesunden Rivalen im Kader. Partynacht: Folgekarte nach „Feiern lassen“ (Kabinenparty),
//       mit einem Partylöwen im Kader; ohne ihn verfällt sie still.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),sq=ev('squad')(S.my),eig=ev('eigenschaften'),heute=ev('absTag')(S.tag);S.phase='play';
  sq.forEach(p=>{p.eig=(eig(p)||[]).filter(e=>e!=='hitzkopf'&&e!=='partyloewe');p.inj=0;});S.bz=[];ev('BZV++');const ohne=A.rangelei();
  const p=sq[0],q=sq[1];p.eig.push('hitzkopf');const ohneRivale=A.rangelei();S.bz.push([p.id,q.id,'R',1]);ev('BZV++');const r=A.rangelei();q.inj=5;const verletzt=A.rangelei();q.inj=0;
  const party=()=>{const c=ev('karteVon')('kabinenparty');F.kartenZeigen(c,{},S.tag,true);F.karteWaehlen(S.karten.offen.length-1,0);const e=(S.karten.kette||[])[0];
    const n0=S.karten.log.length,o0=S.karten.offen.length;if(e)F.kartenKette(S.tag+(e.tag-heute));
    return{gelegt:!!e&&e.id==='partyNacht'&&e.tag>=heute+1&&e.tag<=heute+2,kam:S.karten.offen.slice(o0).some(k=>k.id==='partyNacht')||S.karten.log.slice(n0).some(l=>l.id==='partyNacht'),rest:(S.karten.kette||[]).length};};
  const a=party();sq[2].eig.push('partyloewe');S.karten.offen=[];const b=party();
  pruef(ohne===null&&ohneRivale===null&&!!r&&r.spieler===p.id&&verletzt===null&&a.gelegt&&!a.kam&&a.rest===0&&b.gelegt&&b.kam&&b.rest===0,
    'Rangelei nur mit Hitzkopf und Rivale; Partynacht als Folgekarte nur mit Partylöwe',`ohne ${ohne}, ohne Rivale ${ohneRivale}, Rangelei ${r&&r.spieler===p.id}, Rivale verletzt ${verletzt}, ohne Partylöwe gelegt ${a.gelegt}/gekommen ${a.kam}, mit ${b.gelegt}/${b.kam}`);}

// K14e. Grüppchenbildung (K14 §8): nur mit einem Grüppchen (drei Freunde, Stimmung im Schnitt unter 35), Anführer ist ein Führungsspieler der Gruppe;
//       die Aussprache wirkt auf alle in der Gruppe, die Transferliste setzt den Anführer mit Marktwert auf die Liste.
{const {S,ev}=welt(),A=ev('AUSLOESER'),sq=ev('squad')(S.my),eig=ev('eigenschaften'),st=ev('stimmung'),G=ev('RKA').gruppe;S.phase='play';
  sq.forEach(p=>{p.eig=(eig(p)||[]).filter(e=>e!=='fuehrungsspieler');st(p);p.st=60;p.list=0;});S.bz=[];const ohne=A.kabinenGruppe();
  const g=sq.slice(0,3);S.bz.push([g[0].id,g[1].id,'F',1],[g[1].id,g[2].id,'F',1]);g.forEach(p=>{p.st=G.unter-10;});g[2].eig.push('fuehrungsspieler');const a=A.kabinenGruppe();
  const s0=g.map(p=>st(p));ev('kartenWirkung')({art:'gruppeStimmung',wert:4},{spieler:g[2].id},{titel:'Test'});const alle=g.every((p,i)=>st(p)>s0[i]);
  const c=ev('karteVon')('grueppchen');ev('kartenWirkung')(c.optionen[2].wirkung[0],{spieler:g[2].id},c);const liste=g[2].list===1&&g[2].ask>0;
  pruef(ohne===null&&!!a&&a.spieler===g[2].id&&alle&&liste,'Grüppchenbildung: nur mit Grüppchen, Führungsspieler als Anführer, Aussprache für alle, Transferliste',
    `ohne ${ohne}, Anführer ${a&&a.spieler===g[2].id}, alle besser ${alle}, Liste ${liste}`);}

// K29l. Presse-Karten (K29 §8): Spruch geht viral bis 7 Tage nach einem Eintrag deines Vereins in der Sprüche-Chronik. Der Rivale antwortet nur auf eine offene Kampfansage
//       gegen den Gegner deines nächsten Ligaspiels in höchstens 7 Tagen. Zurückrudern erledigt die Kampfansage (danach weder Kult noch Häme) und kostet Glaubwürdigkeit.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),T=ev('RKT').presse,st=ev('statS')(),P=ev('presseS')(),t=ev('myT()');S.phase='play';st.chronik=[];const kein=A.spruchViral();
  F.chronikEintrag('Test','');const viral=!!A.spruchViral();st.chronik[st.chronik.length-1].tag=S.tag-T.viralTage-1;const alt=A.spruchViral();
  let e=null;for(let d=S.tag+T.vorTage+2;d<S.plan.ende&&!e;d++){const x=F.meinSpiel(d);if(x&&x.art==='liga')e=x;}
  const pa=e&&F.paarung(e),g=pa?(pa[0]===S.my?pa[1]:pa[0]):null;let ohne=null,mit=null,weit=null,zurueck=false;
  if(g!=null&&g<1000){P.aussagen=[];const tag0=S.tag;S.tag=e.tag-3;ohne=A.kampfansageRivale();P.aussagen.push({s:S.season,tag:ev('absTag')(S.tag),art:'ankuendigung',pid:null,gegner:g,txt:'Test'});
    mit=A.kampfansageRivale();S.tag=e.tag-T.vorTage-1;weit=A.kampfansageRivale();S.tag=e.tag-3;
    const c=ev('karteVon')('kampfansageRivale'),gl=ev('glaub'),g0=gl(t);ev('kartenWirkung')(c.optionen[1].wirkung[0],{verein:g},c);zurueck=P.aussagen[0].ok===1&&A.kampfansageRivale()===null&&gl(t)<g0;S.tag=tag0;}
  pruef(kein===null&&viral&&alt===null&&ohne===null&&!!mit&&mit.verein===g&&weit===null&&zurueck,'Presse-Karten: Spruch viral nach Chronik, Rivale nur vor dem Spiel gegen ihn, Zurückrudern',
    `ohne Chronik ${kein}, viral ${viral}, zu alt ${alt}, Gegner ${g}, ohne Kampfansage ${ohne}, mit ${mit&&mit.verein}, zu früh ${weit}, zurückgerudert ${zurueck}`);}

// K30e. Info-Karten mit Wirkung (K28 §8, K11 §8): Rückendeckung hält das Vertrauen 30 Tage auf dem Wert des Tages (vorstandPruefen hebt es an, danach nicht mehr).
//       Dorfverein nur nach einem Testspiel beim Amateurverein, Blamage nur nach einer Niederlage gegen ihn; der Name des Amateurvereins steht in der Meldung.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),kv=ev('karteVon'),heute=ev('absTag')(S.tag),am=1000;S.phase='play';
  S.trust=85;F.kartenZeigen(kv('rueckendeckung'),{},S.tag,false);const halt=!!S.trustHalt&&S.trustHalt.min===85&&S.trustHalt.bis===heute+30;
  S.trust=40;F.vorstandPruefen();const gehalten=S.trust===85;S.trustHalt.bis=heute-1;S.trust=40;F.vorstandPruefen();const vorbei=S.trust===40;
  S.testspiele=[];const ohne=A.dorfverein()===null&&A.blamage()===null;
  S.testspiele=[{id:1,tag:S.tag-2,gegner:am,heim:false,stand:'gespielt',erg:{hg:2,ag:1,zus:0,geld:0}}];const dorf=A.dorfverein(),bl=A.blamage();
  const name=S.am[0].name;F.kartenZeigen(kv('dorfverein'),dorf||{verein:am},S.tag,false);const meldung=S.news.some(n=>n.t.startsWith('Dorfverein')&&n.t.includes(name));
  S.testspiele[0].erg={hg:0,ag:3,zus:0,geld:0};const sieg=A.blamage();
  pruef(halt&&gehalten&&vorbei&&ohne&&!!dorf&&dorf.verein===am&&!!bl&&meldung&&sieg===null,'Info-Karten mit Wirkung: Rückendeckung hält das Vertrauen, Dorfverein und Blamage nach Testspielen',
    `Halt ${halt}, gehalten ${gehalten}, danach frei ${vorbei}, ohne Testspiel ${ohne}, Dorfverein ${dorf&&dorf.verein}, Blamage ${!!bl}, Name in der Meldung ${meldung}, nach Sieg ${sieg}`);}

// U19e. Europapokal-Karten (K37 §8): Auswärtsspiel bei einem Auslandsverein in den nächsten 7 Tagen (kein Heimspiel, nicht später, nicht das Finale), Spiel 1 bis 7 Tage her,
//       Wunder nach 0:3 im Hinspiel und 4:0 oder 3:0 mit Elfmeterschießen im Rückspiel, nicht nach nur einem Tor Rückstand und nicht beim Ausscheiden. euMeineSpiele ersetzt der Test.
{const {S,W,ev}=welt(),A=ev('AUSLOESER'),AV=ev('AV0'),me=S.my,d=S.tag;W.ev('euMeineSpiele=function(){return S.testEu||[];}');
  const sp=o=>Object.assign({wb:'el',runde:'af',leg:0,tag:d,min:0,h:me,a:AV,hg:null,ag:null,pen:null},o),mit=(l,f)=>{S.testEu=l;return f();};
  const aus=mit([sp({tag:d+3,h:AV,a:me})],A.euAuswaerts),heim=mit([sp({tag:d+3})],A.euAuswaerts),spaet=mit([sp({tag:d+9,h:AV,a:me})],A.euAuswaerts),fin=mit([sp({runde:'fin',tag:d+3,h:AV,a:me})],A.euAuswaerts);
  const nach=mit([sp({tag:d-4,hg:1,ag:1})],A.euNachSpiel),alt=mit([sp({tag:d-9,hg:1,ag:1})],A.euNachSpiel);
  const hin=(hg,ag)=>sp({tag:d-11,h:AV,a:me,hg,ag}),rueck=(hg,ag,pen)=>sp({leg:1,tag:d-4,hg,ag,pen:pen||null});
  const w1=mit([hin(3,0),rueck(4,0)],A.euWunder),w2=mit([hin(3,0),rueck(3,0,[4,3])],A.euWunder),w3=mit([hin(2,1),rueck(2,0)],A.euWunder),w4=mit([hin(3,0),rueck(2,0)],A.euWunder);delete S.testEu;
  pruef(!!aus&&aus.verein===AV&&heim===null&&spaet===null&&fin===null&&!!nach&&nach.verein===AV&&alt===null&&!!w1&&w1.verein===AV&&!!w2&&w3===null&&w4===null,
    'Europapokal-Karten: Auswärtsspiel bald, Spiel kürzlich, Wunder nur nach zwei Toren Rückstand und Weiterkommen',
    `auswärts ${!!aus}, heim ${heim}, später ${spaet}, Finale ${fin}, nach dem Spiel ${!!nach} / zu lange her ${alt}, Wunder ${!!w1} / i.E. ${!!w2} / ein Tor ${w3} / raus ${w4}`);}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
