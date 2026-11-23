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
    ok=ok1&&ok2&&frueh&&kam&&verfallen&&nach<=ev('rundeAb')(fd*0.9)&&leise&&gegen!=null&&gegen<=nach&&einig&&auf===-10&&z[1]-z[0]===L.zwischen&&da[1]-da[0]===L.du&&z[2]-z[1]===L.zwischen&&da[2]===da[1]&&z[3]===z[2]&&!p.ld3&&weg;
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
  let e=null;for(let d=S.tag+T.vorTage+2;d<S.plan.ende&&!e;d++){const x=F.meinSpiel(d);let frei=true;for(let y=d-T.vorTage-1;y<d;y++)if(F.meinSpiel(y))frei=false;if(x&&x.art==='liga'&&frei)e=x;} /* EH2: kein anderes eigenes Spiel kurz davor */
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
  S.trust=40;F.vorstandPruefen();const gehalten=S.trust===85;S.trustHalt.s=S.season-1;S.trust=40;F.vorstandPruefen();const andereSaison=S.trust===40;S.trustHalt.s=S.season;S.trustHalt.bis=heute-1;S.trust=40;F.vorstandPruefen();const vorbei=S.trust===40;
  S.testspiele=[];const ohne=A.dorfverein()===null&&A.blamage()===null;
  S.testspiele=[{id:1,tag:S.tag-2,gegner:am,heim:false,stand:'gespielt',erg:{hg:2,ag:1,zus:0,geld:0}}];const dorf=A.dorfverein(),bl=A.blamage();
  const name=S.am[0].name;F.kartenZeigen(kv('dorfverein'),dorf||{verein:am},S.tag,false);const meldung=S.news.some(n=>n.t.startsWith('Dorfverein')&&n.t.includes(name));
  S.testspiele[0].erg={hg:0,ag:3,zus:0,geld:0};const sieg=A.blamage();
  const n0=S.news.length,v0=S.trust;F.kartenZeigen(kv('blamage'),{verein:am},S.tag,false,true);const still=S.news.length===n0&&S.trust<v0; /* EH3 */
  pruef(halt&&gehalten&&vorbei&&andereSaison&&still&&ohne&&!!dorf&&dorf.verein===am&&!!bl&&meldung&&sieg===null,'Info-Karten mit Wirkung: Rückendeckung hält das Vertrauen, Dorfverein und Blamage nach Testspielen',
    `Halt ${halt}, gehalten ${gehalten}, andere Saison frei ${andereSaison}, still mit Wirkung ${still}, danach frei ${vorbei}, ohne Testspiel ${ohne}, Dorfverein ${dorf&&dorf.verein}, Blamage ${!!bl}, Name in der Meldung ${meldung}, nach Sieg ${sieg}`);}

// K11f. Turniersieg (K11 §8): nur nach einem gewonnenen Sommerturnier dieser Saison, bis 7 Tage nach dem Finale; das Selbstvertrauen des Kaders steigt.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),N=ev('RKT').testspiel.nachTage,sq=ev('squad')(S.my),kv=ev('karteVon');S.phase='play';S.turnier=null;const ohne=A.turniersieg();
  S.turnier={s:S.season,tag:S.tag-3,g:[],platz:2};const zweiter=A.turniersieg();S.turnier.platz=1;const sieg=!!A.turniersieg();S.turnier.tag=S.tag-N-2;const alt=A.turniersieg();
  S.turnier.tag=S.tag-3;sq.forEach(p=>{p.sv=0;});F.kartenZeigen(kv('turniersieg'),{},S.tag,false);const sv=sq.every(p=>(p.sv||0)>0);
  pruef(ohne===null&&zweiter===null&&sieg&&alt===null&&sv,'Turniersieg: nur nach dem Sieg und bis 7 Tage nach dem Finale, Selbstvertrauen des Kaders steigt',
    `ohne ${ohne}, Zweiter ${zweiter}, Sieg ${sieg}, zu alt ${alt}, Selbstvertrauen ${sv}`);}

// K03c. Entwicklung (K03 §8): Durchbruch bei einem Spieler bis 21, der seit dem Monatseintrag (mindestens 21 Tage alt) 2 Punkte stärker ist (Selbstvertrauen +1),
//       Altersverlust ab 30 bei 2 Punkten weniger; ein zu junger Eintrag zählt nicht, ohne Eintrag nichts.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),E=ev('RKT').entwicklung,sq=ev('squad')(S.my);S.phase='play';sq.forEach(p=>{p.mvl=[];});const ohne=A.durchbruch()===null&&A.altersverlust()===null;
  const j=sq.find(p=>p.age<=E.jungBis)||sq[0],a=sq.find(p=>p.age>=E.altAb&&p!==j)||sq.find(p=>p!==j);j.age=Math.min(j.age,E.jungBis);a.age=Math.max(a.age,E.altAb);
  j.mvl=[[S.season,S.tag-E.tage+1,Math.round(j.str)-E.punkte,10,0]];const jungEintrag=A.durchbruch();j.mvl=[[S.season,S.tag-E.tage,Math.round(j.str)-E.punkte,10,0]];const d=A.durchbruch();
  a.mvl=[[S.season,S.tag-E.tage,Math.round(a.str)+E.punkte,10,0]];const v=A.altersverlust();
  j.sv=0;F.kartenZeigen(ev('karteVon')('durchbruch'),{spieler:j.id},S.tag,false);const sv=(j.sv||0)>0;
  pruef(ohne&&jungEintrag===null&&!!d&&d.spieler===j.id&&!!v&&v.spieler===a.id&&sv,'Entwicklung: Durchbruch und Altersverlust nach dem Monatseintrag, Selbstvertrauen',
    `ohne Eintrag ${ohne}, zu junger Eintrag ${jungEintrag}, Durchbruch ${d&&d.spieler===j.id}, Altersverlust ${v&&v.spieler===a.id}, Selbstvertrauen ${sv}`);}

// K30f. Skandale (K30 §8.4): Der Wettpate findet einen gesunden Spieler deines Kaders (Stimmung steigt). Der Wettbetrug trifft einen Spieler eines Computer-Vereins,
//       der danach in Liga und Pokal gesperrt ist (seit Prüfung EJ1 ohne Transferliste), nie deinen, auch nicht einen deiner Spieler in der Zweiten (EJ2).
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),K=ev('RKT').skandal,kv=ev('karteVon'),si=ev('sperreIn'),st=ev('stimmung');S.phase='play';
  const w=A.wettpate(),p=w&&ev('PIX').get(w.spieler);if(p){st(p);p.st=50;}F.kartenZeigen(kv('wettpate'),w||{},S.tag,false);const lob=!!p&&p.team===S.my&&st(p)>50;
  const b=A.wettbetrug(),q=b&&ev('PIX').get(b.spieler),l0=q?si(q,'liga'):0,k0=q?si(q,'pokal'):0;F.kartenZeigen(kv('wettbetrug'),b||{},S.tag,false);
  const gesperrt=!!q&&q.team!==S.my&&si(q,'liga')===l0+K.sperreLiga&&si(q,'pokal')===k0+K.sperrePokal;
  const mein=ev('squad')(S.my)[0],m0=si(mein,'liga');ev('kartenWirkung')({art:'wettsperre',wert:1},{spieler:mein.id},{titel:'Test'});const nieMein=si(mein,'liga')===m0; /* EJ2: auch nicht in der Zweiten */const zw=ev('squad')(S.my)[1],z0=si(zw,'liga'),t0=zw.team;zw.zwP=1;zw.team=S.teams.find(t=>t.id!==S.my).id;ev('kartenWirkung')({art:'wettsperre',wert:1},{spieler:zw.id},{titel:'Test'});const nieZweite=si(zw,'liga')===z0;zw.team=t0;delete zw.zwP;
  pruef(lob&&gesperrt&&nieMein&&nieZweite,'Skandale: Wettpate gemeldet (Stimmung steigt), Wettbetrug sperrt einen Spieler eines Computer-Vereins, nie deinen',`Wettpate ${lob}, gesperrt ${gesperrt}, dein Spieler unberührt ${nieMein}, in der Zweiten unberührt ${nieZweite}`);}

// K27d. Jubiläum (K27 §8): Alle Vereine der drei Profiligen (ohne zweite Mannschaften) haben ein Gründungsjahr; die Karte kommt nur im Kalenderjahr eines Vielfachen
//       von 25 Jahren (ab 25), nicht im Gründungsjahr selbst und nicht in krummen Jahren.
{const {S,ev}=welt(),A=ev('AUSLOESER'),V=ev('VEREINE'),J=ev('RKT').jubilaeum,v=V[S.my],jahr=ev('datumVon')(S.tag).getUTCFullYear(),g0=v.gegr;S.phase='play';
  const ohne=V.filter(x=>x.liga<=3&&!x.zweite&&!x.gegr).map(x=>x.kurz);
  v.gegr=jahr-2*J.alle;const rund=A.jubilaeum();v.gegr=jahr-2*J.alle+1;const krumm=A.jubilaeum();v.gegr=jahr;const neu=A.jubilaeum();v.gegr=g0;
  pruef(!ohne.length&&!!rund&&rund.verein===S.my&&krumm===null&&neu===null,'Jubiläum: Gründungsjahre vollständig, Karte nur in runden Jahren',`ohne Gründungsjahr ${ohne.join(',')||'keiner'}, rund ${!!rund}, krumm ${krumm}, Gründungsjahr ${neu}`);}

// K05c. Nach deinem Spiel (K05 §8): letztesSpielMerken findet Joker (eingewechselt, dann getroffen) und vor der 60. Minute Ausgewechselte, Testspiele zählen nicht;
//       „Joker sticht“ nur bis 7 Tage danach, „Handschlag verweigert“ nur bei einer Diva.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),sq=ev('squad')(S.my),eig=ev('eigenschaften'),N=ev('RKT').spiel;S.phase='play';delete S.letzt;
  const j=sq[0],a=sq[1],d=sq[2];a.eig=(eig(a)||[]).filter(e=>e!=='diva');d.eig=(eig(d)||[]).filter(e=>e!=='diva');d.eig.push('diva');
  const ev0=[{m:50,s:0,t:'S',p:j.id,n:j.n,aus:a.n,ausId:a.id},{m:55,s:0,t:'S',p:sq[3].id,n:sq[3].n,aus:d.n,ausId:d.id},{m:70,s:0,t:'G',p:j.id,n:j.n,sc:[1,0]},{m:80,s:1,t:'G',p:null,n:'X',sc:[1,1]}];
  F.letztesSpielMerken({h:S.my,a:0,hg:1,ag:1,ev:ev0,test:1},S.tag);const test=!S.letzt;
  F.letztesSpielMerken({h:S.my,a:0,hg:1,ag:1,ev:ev0},S.tag);const L=S.letzt,merk=!!L&&L.joker.join()===String(j.id)&&L.frueh.length===2;
  const jo=A.jokerSticht(),hs=A.handschlag();S.letzt.tag=S.tag-N.nachTage-1;const alt=A.jokerSticht();
  pruef(test&&merk&&!!jo&&jo.spieler===j.id&&!!hs&&hs.spieler===d.id&&alt===null,'Nach dem Spiel: Joker und frühe Auswechslungen gemerkt, Handschlag nur bei einer Diva, nicht nach Testspielen',
    `Testspiel ignoriert ${test}, gemerkt ${merk}, Joker ${jo&&jo.spieler===j.id}, Handschlag ${hs&&hs.spieler===d.id}, zu alt ${alt}`);}

// K05d. Last-Minute-Drama (K05 §8): spätes Siegtor (ab Minute spaetAb, ein Tor Unterschied) für dich oder gegen dich; früh entschieden, Remis,
//       Elfmeterschießen oder zwei Tore Unterschied nicht.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),N=ev('RKT').spiel;S.phase='play';
  const g=(m,s)=>({m,s,t:'G',p:null,n:'X',sc:[0,0]}),lauf=r=>{S.letzte=[];F.letztesSpielMerken(Object.assign({h:S.my,a:0,ev:[]},r),S.tag);return[!!A.lastMinuteSieg(),!!A.lastMinuteNiederlage()];};
  const sieg=lauf({hg:2,ag:1,ev:[g(10,0),g(20,1),g(N.spaetAb+1,0)]}),nieder=lauf({hg:1,ag:2,ev:[g(10,0),g(20,1),g(N.spaetAb,1)]}),frueh=lauf({hg:2,ag:1,ev:[g(10,0),g(20,1),g(60,0)]}),
    remis=lauf({hg:1,ag:1,ev:[g(10,0),g(N.spaetAb+1,1)]}),pen=lauf({hg:1,ag:0,pen:[4,3],ev:[g(N.spaetAb+1,0)]}),hoch=lauf({hg:3,ag:1,ev:[g(10,0),g(20,0),g(30,1),g(N.spaetAb+1,0)]});
  pruef(sieg[0]&&!sieg[1]&&nieder[1]&&!nieder[0]&&!frueh[0]&&!remis[0]&&!remis[1]&&!pen[0]&&!hoch[0],'Last-Minute-Drama: spätes Siegtor oder Gegentor, nicht früh, nicht beim Remis, Elfmeterschießen oder zwei Toren',
    `Sieg ${sieg}, Niederlage ${nieder}, früh ${frueh}, Remis ${remis}, Elfmeter ${pen}, zwei Tore ${hoch}`);}

// K06c, K09e. Taktik-Coup nur als siegreicher Außenseiter mit dem Stil, der den des Gegners schlägt; Pyrotechnik nur nach einem Derby (Freiburg – Karlsruhe);
//       Rudelbildung nur nach einem Derby mit Roter Karte.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),K=ev('RTA').kreislauf,tl=ev('teamLevel'),N=ev('RKT').spiel;S.phase='play';
  const geg=S.teams.filter(t=>t.id!==S.my&&ev('aktiv')(t)).sort((a,b)=>tl(b.id)-tl(a.id))[0],stark=tl(geg.id)-tl(S.my)>=N.coupAb,st='pressing';
  const r=o=>Object.assign({h:S.my,a:geg.id,hg:1,ag:0,ev:[],taktik:[{stil:st},{stil:K[st]}]},o),m=o=>{S.letzte=[];F.letztesSpielMerken(r(o),S.tag);};
  m({});const coup=A.taktikCoup();m({taktik:[{stil:st},{stil:st}]});const falscherStil=A.taktikCoup();m({hg:0,ag:1});const verloren=A.taktikCoup(),keinDerby=A.derbyPyro();
  const ksc=S.teams.find(t=>t.sh==='KSC');S.letzte=[];F.letztesSpielMerken({h:S.my,a:ksc.id,hg:1,ag:1,ev:[]},S.tag);const pyro=A.derbyPyro(),ohneRot=A.rudelbildung();
  S.letzte=[];F.letztesSpielMerken({h:S.my,a:ksc.id,hg:1,ag:1,ev:[{m:30,s:1,t:'R',p:null}]},S.tag);const rudel=A.rudelbildung();
  pruef(stark&&!!coup&&coup.verein===geg.id&&falscherStil===null&&verloren===null&&keinDerby===null&&!!pyro&&pyro.verein===ksc.id&&ohneRot===null&&!!rudel,
    'Taktik-Coup als Außenseiter mit dem passenden Stil, Pyrotechnik nach dem Derby, Rudelbildung nur mit Roter Karte',
    `Außenseiter ${stark}, Coup ${coup&&coup.verein}, gleicher Stil ${falscherStil}, verloren ${verloren}, kein Derby ${keinDerby}, Pyro ${pyro&&pyro.verein}, ohne Rot ${ohneRot}, Rudel ${!!rudel}`);}

// K06d. Spieler hadert mit seiner Position (K06 §8): Der Zähler steigt nur bei Einsätzen mit Eignung unter 80 % und fällt auf 0 bei passender Position;
//       ab drei Einsätzen in Folge kommt die Karte.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),N=ev('RKT').spiel,el=ev('eignung'),sq=ev('squad')(S.my);S.phase='play';sq.forEach(p=>{p.pfal=0;});
  const p=sq.find(x=>x.pos!=='TW'),recht=p.fp||ev('STD_POS')[p.pos],spiel=pos=>F.letztesSpielMerken({h:S.my,a:0,hg:0,ag:0,ev:[],xpo:[[[p.id,pos,0,90]],[]]},S.tag);
  spiel('TW');spiel('TW');const zwei=A.positionHadern();spiel('TW');const drei=A.positionHadern();spiel(recht);const zurueck=p.pfal===0&&A.positionHadern()===null;
  pruef(el(p,'TW')<N.positionUnter&&zwei===null&&!!drei&&drei.spieler===p.id&&zurueck,'Position: drei Einsätze in Folge falsch eingesetzt bringen die Karte, passende Position setzt zurück',
    `Eignung als Torwart ${el(p,'TW').toFixed(2)}, nach zwei ${zwei}, nach drei ${drei&&drei.spieler===p.id}, zurück ${zurueck}`);}

// EK. Korrekturen nach Prüfung EK: Verletzt Ausgewechselte zählen nicht als früh (EK1); ein spät gewonnenes Pokalspiel unter der Woche bleibt neben dem Ligaspiel danach
//     erhalten (EK2); der Merker gilt nur für deinen Verein (EK3); ein Tor in der 95. Minute ist nicht spät, eines ab spaetVerlAb schon (EK4); Europapokal ohne Last-Minute (EK5);
//     kurze Einsätze zählen nicht für die Position (EK7).
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),N=ev('RKT').spiel,sq=ev('squad')(S.my),eig=ev('eigenschaften');S.phase='play';S.letzte=[];delete S.letzt;
  const d=sq[2];d.eig=(eig(d)||[]).filter(e=>e!=='diva');d.eig.push('diva');
  F.letztesSpielMerken({h:S.my,a:0,hg:0,ag:0,ev:[{m:30,s:0,t:'S',p:sq[3].id,n:'x',aus:d.n,ausId:d.id}],inj:[{id:d.id}]},S.tag);const verletzt=A.handschlag()===null;
  const g=(m,s)=>({m,s,t:'G',p:null,n:'X',sc:[0,0]});S.letzte=[];F.letztesSpielMerken({h:S.my,a:0,hg:2,ag:1,ev:[g(10,0),g(20,1),g(N.spaetAb+1,0)]},S.tag-3);
  F.letztesSpielMerken({h:S.my,a:0,hg:0,ag:0,ev:[]},S.tag-1);const beide=!!A.lastMinuteSieg(),my0=S.my;S.my=S.teams.find(t=>t.id!==my0).id;const fremd=A.lastMinuteSieg()===null;S.my=my0;
  const spaet=(m,o)=>{S.letzte=[];F.letztesSpielMerken(Object.assign({h:S.my,a:0,hg:2,ag:1,ev:[g(10,0),g(20,1),g(m,0)]},o||{}),S.tag);return !!A.lastMinuteSieg();};
  const v95=spaet(95),v119=spaet(N.spaetVerlAb+1),eu=spaet(N.spaetAb+1,{eu:'el'});
  const p=sq.find(x=>x.pos!=='TW');p.pfal=0;delete p.pfalT;F.letztesSpielMerken({h:S.my,a:0,hg:0,ag:0,ev:[],xpo:[[[p.id,'TW',0,1]],[]]},S.tag);const kurz=(p.pfal||0)===0;
  pruef(verletzt&&beide&&fremd&&!v95&&v119&&!eu&&kurz,'Korrekturen EK: Verletzte nicht früh, Pokal unter der Woche bleibt, nur dein Verein, Verlängerung, Europapokal, kurze Einsätze',
    `verletzt ${verletzt}, beide Spiele ${beide}, anderer Verein ${fremd}, 95. Minute ${v95}, ab spaetVerlAb ${v119}, Europapokal ${eu}, kurz ${kurz}`);}

// EL. Prüfung EL4: kein Taktik-Coup, wenn die Automatik den Stil wählt (EK6); ein Positions-Zähler älter als positionTage bringt keine Karte und beginnt neu (EK7),
//     ein frischer schon.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),K=ev('RTA').kreislauf,tl=ev('teamLevel'),N=ev('RKT').spiel,sq=ev('squad')(S.my),h=ev('absTag')(S.tag);S.phase='play';sq.forEach(p=>{p.pfal=0;});
  const geg=S.teams.filter(t=>t.id!==S.my&&ev('aktiv')(t)).sort((a,b)=>tl(b.id)-tl(a.id))[0],st='pressing',m=()=>{S.letzte=[];F.letztesSpielMerken({h:S.my,a:geg.id,hg:1,ag:0,ev:[],taktik:[{stil:st},{stil:K[st]}]},S.tag);};
  m();const selbst=!!A.taktikCoup();F.lizenzStart(false);S.lizenz.auto.stil=1;const istAuto=ev('autoB')('stil');m();const auto=A.taktikCoup()===null;delete S.lizenz;
  const p=sq.find(x=>x.pos!=='TW');p.pfal=N.positionSpiele;p.pfalT=h;const frisch=(A.positionHadern()||{}).spieler===p.id;
  p.pfalT=h-N.positionTage-1;const alt=A.positionHadern()===null;F.letztesSpielMerken({h:S.my,a:0,hg:0,ag:0,ev:[],xpo:[[[p.id,'TW',0,90]],[]]},S.tag);const neu=p.pfal===1;
  pruef(selbst&&istAuto&&auto&&frisch&&alt&&neu,'Korrekturen EL: kein Coup mit Stil-Automatik, alter Positions-Zähler verfällt und beginnt neu',
    `Coup selbst ${selbst}, Automatik an ${istAuto}, Coup mit Automatik ${!auto?'ja':'nein'}, frischer Zähler ${frisch}, alter Zähler ohne Karte ${alt}, Neustart bei 1 ${neu}`);}

// K06e. Standard-Spezialisten (K06 §8): ab abSpiele Ligaspielen der Halbserie mit mindestens ab Toren nach Ecken und Freistößen (Elfmeter zählen nicht) und Anteil ab anteil;
//       danach Tore nach Ecken und Freistoßflanken × faktor für tage Tage, nur dein Verein, einmal je Halbserie; die zweite Halbserie zählt neu.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),St=ev('RKT').standard,t=ev('myT()'),gf=ev('standardGegnerFaktor');S.phase='play';delete S.std;delete S.stdGegen;
  const G=(m,art)=>({m,s:0,t:'G',p:null,n:'X',sc:[0,0],art}),sp=evs=>F.letztesSpielMerken({h:S.my,a:0,hg:evs.length,ag:0,lg:t.lg,ev:evs},S.tag);
  for(let i=0;i<St.abSpiele-1;i++)sp([G(10,'ecke'),G(20,'gross')]);const frueh=A.standardSpezialisten();
  sp([G(10,'freistoss'),G(30,'elfmeter')]);const n=S.std.n,g=S.std.g,karte=A.standardSpezialisten(); /* abSpiele Standardtore von 2 × abSpiele Toren, der Elfmeter zählt nur als Tor */
  const wenig=(()=>{const alt=S.std;S.std=Object.assign({},alt,{g:Math.ceil(alt.n/St.anteil)+5});const x=A.standardSpezialisten();S.std=alt;return x;})();
  ev('kartenWirkung')({art:'standardGegner',wert:1},{},{titel:'Test'});const f1=gf(t),fremd=gf(S.teams.find(x=>x.id!==S.my)),danach=A.standardSpezialisten();
  /* Prüfung EO5: die Wirkung im Spiel selbst (taktikWirkung setzt stdF), ohne Standard-Einheit in den letzten 7 Tagen */t.stdTag=null;const GS=F.spielAnlegen(S.my,S.teams.find(x=>x.id!==S.my&&x.lg===t.lg).id,{auto:[true,true]}).Ss,imSpiel=Math.abs(GS[0].stdF-St.faktor)<1e-9&&GS[1].stdF===1;
  S.tag+=St.tage+1;const f2=gf(t);S.tag-=St.tage+1;
  const N=S.fx[t.lg].length;for(let i=0;i<=N/2;i++)S.res[t.lg].push([S.my,0,0,0,i]);sp([G(10,'ecke')]);const neu=S.std.h===1&&S.std.sp===1&&S.std.k===0;
  pruef(frueh===null&&n===St.abSpiele&&g===2*St.abSpiele&&!!karte&&wenig===null&&f1===St.faktor&&fremd===1&&danach===null&&f2===1&&neu&&imSpiel,
    'Standard-Spezialisten: Karte ab genug Standardtoren, Elfmeter zählen nicht, Gegner stellen sich vier Wochen ein, zweite Halbserie zählt neu',
    `vor ${St.abSpiele} Spielen ${frueh}, Standardtore ${n} von ${g}, Karte ${!!karte}, zu kleiner Anteil ${wenig}, Faktor ${f1} (anderer Verein ${fremd}), noch einmal ${danach}, nach ${St.tage} Tagen ${f2}, neue Halbserie ${neu}, im Spiel ${imSpiel}`);}

// K15e. Streit nach Kritik (K15 §8): nur nach einem Streit im Einzelgespräch, das eine Kritik war, und höchstens streitTage her; ein Streit nach einem anderen Thema zählt nicht.
//       Seit Prüfung EO3 merkt das Gespräch das Thema des Streits (p.streitT): Kritik ohne Streit, dann Streit nach Lob am selben Tag zählt nicht.
{const {S,ev}=welt(),A=ev('AUSLOESER'),T=ev('RKT').gespraech.streitTage,sq=ev('squad')(S.my),h=ev('absTag')(S.tag),p=sq[0];S.phase='play';sq.forEach(x=>{delete x.streit;delete x.streitT;x.gs=[];});
  p.streit=h-2;p.streitT='kritik';p.gs=[[h-2,'kritik']];const kritik=A.streitNachKritik();p.streitT='lob';p.gs=[[h-2,'kritik'],[h-2,'lob']];const lob=A.streitNachKritik();
  p.streit=h-T-1;p.streitT='kritik';p.gs=[[h-T-1,'kritik']];const alt=A.streitNachKritik();delete p.streit;const ohne=A.streitNachKritik();
  pruef(!!kritik&&kritik.spieler===p.id&&lob===null&&alt===null&&ohne===null,'Streit nach Kritik: nur nach Kritik, nur bis streitTage danach',`nach Kritik ${kritik&&kritik.spieler===p.id}, nach Lob ${lob}, zu alt ${alt}, ohne Streit ${ohne}`);}

// K26f. Anwohner klagen (K26 §8): nur bei Tribüne oder Dach in der Genehmigung mit mindestens einer Woche Rest; verlorene Klage verschiebt Baubeginn und Ende um 3 Wochen,
//       nur beim Projekt, um das es ging.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),h=ev('absTag')(S.tag),kw=ev('kartenWirkung');S.phase='play';
  S.constr={k:'cap',label:'Tribüne',phase:'genehmigung',ab:h+21,bis:h+21+70,kosten:5e6,auflage:0,verzug:0,mehr:0,gemeldet:0};const c=S.constr,da=A.anwohnerKlagen();
  c.k='logen';const logen=A.anwohnerKlagen();c.k='cap';c.ab=h+3;const knapp=A.anwohnerKlagen();c.ab=h+21;
  kw({art:'bauVerzug',wert:3},{bau:h+99},{titel:'Test'});const fremd=!c.klage&&c.bis===h+91;kw({art:'bauVerzug',wert:3},{bau:h+21},{titel:'Test'});const verschoben=c.klage===3&&c.bis===h+112,nochmal=A.anwohnerKlagen();
  c.auflage=0.05;kw({art:'bauAuflage',wert:0},{bau:h+21},{titel:'Test'});const erlassen=c.auflage===0; /* Prüfung EO4: Lärmschutz bezahlt, keine Auflage beim Baubeginn */
  F.bauTag(S.tag+21);const nochNicht=c.phase==='genehmigung';F.bauTag(S.tag+42);const beginn=c.phase==='bau';S.constr=null;
  pruef(!!da&&da.bau===h+21&&logen===null&&knapp===null&&fremd&&verschoben&&nochmal===null&&erlassen&&nochNicht&&beginn,'Anwohner klagen: nur Tribüne oder Dach in der Genehmigung, verlorene Klage verschiebt um 3 Wochen, nur dieses Projekt, bezahlter Lärmschutz erlässt die Auflage',
    `Auslöser ${!!da}, Logen ${logen}, knapp ${knapp}, anderes Projekt unberührt ${fremd}, verschoben ${verschoben}, zweite Klage ${nochmal}, Auflage erlassen ${erlassen}, am alten Termin noch Genehmigung ${nochNicht}, 3 Wochen später Baubeginn ${beginn}`);}

// K16e. Ehemaliger Kapitän kehrt zurück (K16 §8): nur ein vereinsloser Ex-Spieler mit mindestens so vielen Spielen für deinen Verein wie ein Publikumsliebling, freier Platz in seiner Rolle;
//       „In den Stab holen“ stellt ihn ein (dann Fans +2), „Alles Gute“ fragt nur; danach keine Karte mehr für ihn. Seit Prüfung EP3 wird der Platz vor dem zweiten Ex-Spieler wieder frei,
//       damit die Sperre über gefragt wirklich geprüft wird; seit EP1 stellt die Karte bei gesperrtem Stab (Lernstufe) niemanden ein.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),LS=ev('RFS').ident.lieblingSpiele,RO=ev('RST').rollen,sv=ev('stabVon'),sg=ev('stabGeaendert');S.phase='play';if(!S.stab)F.stabAufbau();
  const r=['jugend','standard','co','athletik'].find(k=>RO[k]&&sv(S.my,k).length<RO[k].plaetze),neu=()=>{const x=F.stabNeu(r,10,-1,1);Object.assign(x,{ex:120,exS:S.season,exV:S.my,exVsp:LS+20});S.stab.push(x);sg();return x;};
  S.stab.forEach(x=>{if(x.team<0)x.gefragt=1;});const x=neu(),da=A.exKapitaen();x.exVsp=LS-1;const wenig=A.exKapitaen();x.exVsp=LS+20;x.exV=S.teams.find(t=>t.id!==S.my).id;const fremd=A.exKapitaen();x.exV=S.my;
  const t=ev('myT()'),fu0=t.fanU||0,kw=ev('kartenWirkung');kw({art:'stabHolen',wert:1,dann:[{art:'fans',wert:2}]},{stab:x.id},{titel:'Test'});const geholt=x.team===S.my&&x.gefragt===1&&(t.fanU||0)>fu0;
  x.team=-1;sg();const danach=A.exKapitaen(); /* Platz wieder frei: x ist gefragt, also keine Karte */
  const y=neu(),yDa=A.exKapitaen();kw({art:'stabHolen',wert:0},{stab:y.id},{titel:'Test'});const nurGefragt=!!yDa&&yDa.stab===y.id&&y.team<0&&y.gefragt===1&&A.exKapitaen()===null;
  const z=neu();F.lizenzStart(true);kw({art:'stabHolen',wert:1},{stab:z.id},{titel:'Test'});const gesperrt=z.team<0&&!z.gefragt;delete S.lizenz;
  /* Prüfung EQ1: frei, aber in der Automatik (Zustand nach dem Aufstieg): Einstellen klappt, die Automatik ist danach aus, wie beim Einstellen von Hand */
  F.lizenzStart(false);S.lizenz.auto.stab=1;kw({art:'stabHolen',wert:1},{stab:z.id},{titel:'Test'});const auto=z.team===S.my&&!S.lizenz.auto.stab;delete S.lizenz;
  pruef(!!r&&!!da&&da.stab===x.id&&wenig===null&&fremd===null&&geholt&&danach===null&&nurGefragt&&gesperrt&&auto,'Ehemaliger Kapitän: nur verdiente Ex-Spieler deines Vereins, Einstellen mit Fans +2, danach keine Karte mehr, nicht bei gesperrtem Stab, aber bei Automatik',
    `Rolle ${r}, Auslöser ${!!da}, zu wenig Spiele ${wenig}, anderer Verein ${fremd}, geholt ${geholt}, danach ${danach}, nur gefragt ${nurGefragt}, Stab gesperrt ${gesperrt}, frei mit Automatik ${auto}`);}

// K18f. Talent aus dem Nichts (K18 §8): nur mit einem eigenen Scout mit Spezialgebiet Jugend ab Qualität scoutAb; ein Inlands- oder schwacher Jugendscout reicht nicht.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),J=ev('RKT').jugend,gb=ev('scoutGebiet'),sg=ev('stabGeaendert'),meine=()=>ev('meineScouts')();S.phase='play';
  meine().forEach(x=>{x.q=1;});sg();const schwach=A.talentEntdeckt();
  /* Prüfung EQ3: ein guter Scout eines anderen Gebiets und ein schwacher Jugendscout reichen jeweils nicht, erst ein guter Jugendscout */
  let inland=null,x=null;for(let i=0;i<40&&(!x||!inland);i++){const y=F.stabNeu('scout',J.scoutAb+2,S.my,1);if(gb(y)==='jugend'){if(!x)x=y;}else if(!inland)inland=y;}
  S.stab.push(inland);sg();const mitInland=A.talentEntdeckt();x.q=J.scoutAb-1;S.stab.push(x);sg();const mitSchwach=A.talentEntdeckt();x.q=J.scoutAb;sg();const da=A.talentEntdeckt();
  pruef(schwach===null&&mitInland===null&&mitSchwach===null&&!!da&&da.stab===x.id,'Talent aus dem Nichts: nur mit einem guten Jugendscout',`ohne guten Scout ${schwach}, guter Scout anderer Gebiete ${mitInland}, schwacher Jugendscout ${mitSchwach}, guter Jugendscout ${!!da&&da.stab===x.id}`);}

// K30g. Manipulation in der 3. Liga (K30 §8.4): Der Auslöser trifft einen Spieler eines Computer-Vereins der 3. Liga (keine zweite Mannschaft), die Wirkung sperrt ihn
//       und zieht seinem Verein in dieser Saison 3 Punkte ab (Tabelle), nie deinem Verein.
//       Seit Prüfung ER4 über die Karte selbst (kartenZeigen) und ohne Absturz, wenn der Auslöser nichts findet; ER1: nicht nach dem letzten Spieltag; ER2: höchstens einmal in abstand Saisons.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),kv=ev('karteVon'),kw=ev('kartenWirkung'),tab=ev('table'),si=ev('sperreIn'),SK=ev('RKT').skandal;S.phase='play';
  const b=A.manipulation3()||{},p=b.spieler!=null?ev('PIX').get(b.spieler):null,t=b.verein!=null?S.teams[b.verein]:null,ok=!!t&&!!p&&t.lg===3&&!(t.zweite>=0)&&t.id!==S.my&&p.team===t.id;
  const pkt=()=>t?(tab(3).find(r=>r.id===t.id)||{}).p:null,p0=pkt(),l0=p?si(p,'liga'):0;if(ok)F.kartenZeigen(kv('manipulation3'),b,S.tag,false);
  const abzug=ok&&pkt()===p0-3&&si(p,'liga')>l0&&S.skandal3===S.season,a0=((S.abzug||{})[S.season]||{})[S.my]||0;kw({art:'punktabzug',wert:3},{verein:S.my},{titel:'Test'});const nieMein=(((S.abzug||{})[S.season]||{})[S.my]||0)===a0;
  const gesperrt=A.manipulation3()===null;S.skandal3=S.season-SK.abstand;const wieder=!!A.manipulation3();
  const r0=S.res[3].slice(),n=S.fx[3].reduce((s,md)=>s+md.length,0),[h0,a1]=S.fx[3][0][0];while(S.res[3].length<n)S.res[3].push([h0,a1,0,0,0]);const fertig=A.manipulation3()===null;S.res[3]=r0;
  pruef(ok&&abzug&&nieMein&&gesperrt&&wieder&&fertig,'Manipulation in der 3. Liga: Spieler eines Drittligisten gesperrt, Punktabzug für seinen Verein, nie für deinen, höchstens einmal in zehn Saisons, nicht nach dem letzten Spieltag',
    `Verein ${t&&t.name}, Punkte ${p0} → ${pkt()}, gesperrt ${p?si(p,'liga')>l0:'-'}, dein Verein unberührt ${nieMein}, gleich danach ${gesperrt}, nach ${SK.abstand} Saisons ${wieder}, Liga fertig ${fertig}`);}

// K11g. Lager-Ereignisse (K11 §8): Lagerkoller nur im laufenden Lager nach einem Koller, Nachtleben nur nach einer Sichtung (l.gesehen); „Früher abreisen“ beendet das Lager heute.
{const {S,F,ev}=welt(),A=ev('AUSLOESER'),kw=ev('kartenWirkung');S.phase='play';S.lager=[];F.lagerBuchenLauf('riviera',S.tag-2,8);const l=S.lager[0];
  const ohneKoller=A.lagerkoller(),ohneSicht=A.nachtleben();l.koller=1;const koller=A.lagerkoller();const p=ev('squad')(S.my)[0];l.gesehen=[p.id];const nacht=A.nachtleben();
  kw({art:'lagerEnde',wert:1},{lager:l.von},{titel:'Test'});const ende=l.bis===S.tag&&A.lagerkoller()===null&&ev('lagerAktiv')(S.tag+1)===null;
  pruef(ohneKoller===null&&ohneSicht===null&&!!koller&&koller.lager===l.von&&!!nacht&&nacht.spieler===p.id&&ende,'Lager-Ereignisse: Koller und Nachtleben nur mit Anlass, früher abreisen beendet das Lager',
    `ohne Koller ${ohneKoller}, ohne Sichtung ${ohneSicht}, Koller ${!!koller}, Nachtleben ${!!nacht&&nacht.spieler===p.id}, Ende ${ende}`);}

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
