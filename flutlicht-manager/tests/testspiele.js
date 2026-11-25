// Testspiele und Trainingslager (K11 §10): Zusage nach Niveau, keine Halte durch Testspiele, Lager lohnt, Lagerkoller, Geld, Regeln im Testspiel,
// ein Sommer mit Testspielen und Lager im Ablauf. Aufruf: node tests/testspiele.js [Seed=4]. Nur Node.js.
const {neueWelt}=require('./sim');
const SEED=+(process.argv[2]||4),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %',f2=x=>x.toFixed(2);
const welt=(verein=6)=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=verein;F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(verein,W.ev('myT()').form);return{W,F,S,ev:W.ev};};
// Tage ohne Halt durchlaufen (wie „Tag beenden“, aber ohne an Halten zu stoppen)
const tage=(F,S,n)=>{for(let i=0;i<n;i++){F.tagEnde(S.tag);S.tag++;S.gespielt=-1;F.tagBeginn(S.tag);}};
// 1. Zusage (K11 §10): gleich starker Gegner in der Vorbereitung 60–80 %, klar stärkerer 15–35 % (ohne Pflichtspiel des Gegners in der Nähe)
{const {S,ev}=welt();S.tag=ev('auftaktTag(myT())')+21;const d=S.tag+5,me=ev('teamLevel')(S.my),gl=[],st=[];
  S.teams.forEach(t=>{if(!ev('aktiv')(t)||t.id===S.my||ev('pflichtspielNah')(t.id,d,2))return;const x=ev('teamLevel')(t.id)-me,p=ev('zusageChance')(t.id,d);if(Math.abs(x)<=2)gl.push(p);if(x>=6)st.push(p);});
  const m=l=>l.reduce((a,b)=>a+b,0)/l.length;
  pruef(gl.length>0&&m(gl)>=0.6&&m(gl)<=0.8,'Zusage eines gleich starken Gegners in der Vorbereitung 60–80 %',`${pc(m(gl))} (${gl.length} Vereine)`);
  pruef(st.length>0&&m(st)>=0.15&&m(st)<=0.35,'Zusage eines klar stärkeren Gegners 15–35 %',`${pc(m(st))} (${st.length} Vereine)`);
  S.tag=ev('auftaktTag(myT())')+2;const pro=S.teams.find(t=>ev('aktiv')(t)&&t.id!==S.my).id;pruef(ev('zusageChance')(pro,S.tag+4)===0&&ev('zusageChance')(1000,S.tag+4)>0.9,'Profis sagen erst ab der 3. Vorbereitungswoche zu, davor nur Amateure','');}
// 2. Testspiele ohne Halt, Regeln im Testspiel: keine Sperren, keine Karten in der Zählung, 60 % Spielpraxis, 70 % Belastung
{const {S,F,ev}=welt();S.tag=ev('auftaktTag(myT())')+21;const l=ev('testspielTage')(),d=l[0],x=ev('testspielAnfragen')(1000,d);x.stand='zugesagt';
  pruef(!ev('haltGrund')(d)||ev('haltGrund')(d)!=='Spiel','Ein Testspiel erzeugt keinen Halt',`Halt am Testspieltag: „${ev('haltGrund')(d)||'keiner'}“`);
  const p=ev('squad')(S.my).find(q=>q.inj<=0&&q.pos!=='TW'),sp=ev('sperren')(p);sp.liga.rot=1;
  pruef(ev('mitWettbewerb')('test',()=>ev('avail')(p)),'Ein in der Liga gesperrter Spieler darf im Testspiel spielen','');sp.liga.rot=0;
  const vorher={kt:JSON.stringify(ev('gelbe')(p)),sp:p.sp,fit:p.fit,v:(S.verfahren||[]).length};p.sp=40;p.fit=95;
  const r=F.sim(1000,S.my,{test:1,wb:'test'});r.ev.push({t:'R',p:p.id,n:p.n,art:'grob'});r.yel.push(p.id);
  const min=(r.xpo[1].find(z=>z[0]===p.id)||[])[3];F.testspielNach(r,x);
  const N=ev('RP').spielpraxis.jeSpiel*(min||0)/90*ev('RTS').praxis;
  pruef(JSON.stringify(ev('gelbe')(p))===vorher.kt&&(S.verfahren||[]).length===vorher.v,'Karten im Testspiel zählen nicht und führen zu keinem Verfahren','');
  pruef(min>0&&Math.abs((p.sp-40)-N)<0.01,'Testspiel: 60 % der Spielpraxis eines Pflichtspiels',`${f2(p.sp-40)} statt ${f2(N/ev('RTS').praxis)} (${min} Minuten)`);
  pruef(x.stand==='gespielt'&&x.erg&&x.erg.geld>0,'Testspiel beim Amateurverein bringt eine Gage',x.erg?ev('fmt')(x.erg.geld):'-');}
// 2b. Prüfung FB4: Ein Einsatz auf der Umschulungsposition zählt auch im Testspiel (K07 §3.3, K07g). Ein Innenverteidiger der Startelf schult auf
//     Linksverteidiger um; sein Eintrag in r.xpo bekommt die Position LV, wie es die Engine bei einer Aufstellung dort täte.
{const {S,F,ev}=welt();S.tag=ev('auftaktTag(myT())')+21;const d=ev('testspielTage')()[0],x=ev('testspielAnfragen')(1000,d);x.stand='zugesagt';
  const r=F.sim(1000,S.my,{test:1,wb:'test'}),U=ev('RT').umschulung,z=r.xpo[1].find(e=>{const q=ev('PIX').get(e[0]);return q&&q.fp==='IV'&&!q.mk.vielseitig&&(e[3]==null||e[3]>=U.einsatzMinuten);});
  const p=z&&ev('PIX').get(z[0]);if(p){p.age=22;p.ue={};p.uf=[];p.um='LV';p.inj=0;delete p.umE;z[1]='LV';}F.testspielNach(r,x);
  pruef(!!p&&p.umE!=null&&((p.ue&&p.ue.LV)||0)>0,'Testspiel: Einsatz auf der Umschulungsposition zählt',p?`umE ${p.umE}, LV ${p.ue&&p.ue.LV}`:'kein Innenverteidiger mit genug Minuten');}
// 3. Lager lohnt (K11 §10): sieben Tage Lager im Sommer, Vertrautheit wächst um etwa ein Viertel schneller (×1,25), Konditionsreiz ×1,15
{const run=lager=>{const {S,F,ev}=welt();const a=ev('auftaktTag(myT())');tage(F,S,a+7-S.tag); // zweite Vorbereitungswoche: erst dann gibt es Taktik-Einheiten
if(lager){const f=ev('lagerMoeglich')('schwarzwald',S.tag+1,7);if(f)return{fehler:f};ev('lagerBuchenLauf')('schwarzwald',S.tag+1,7);}
    const t=ev('myT()'),st=t.stil||'ausgewogen';t.vorlage='standard'; // mit Taktik-Einheiten (die Automatik plant in der Vorbereitung „Aufbau“ ohne Taktik, Konsistenzprüfung AQ6)
    ev('vertrautSetzen')(t,'stil',st,20);const v0=ev('vertraut')(t,'stil',st);tage(F,S,8);return{dv:ev('vertraut')(t,'stil',st)-v0,kosten:(S.fin['Trainingslager']||0)};};
  const A=run(true),B=run(false);
  pruef(!A.fehler&&A.dv/B.dv>=1.15&&A.dv/B.dv<=1.35,'Lager: Vertrautheit wächst im Lager um 15–35 % schneller als zu Hause',A.fehler||`${f2(A.dv)} gegen ${f2(B.dv)} (×${f2(A.dv/B.dv)}), Kosten ${Math.round(-A.kosten).toLocaleString('de-DE')} €`);}
// 4. Lagerkoller (K11 §10): bei zehn Tagen in mindestens einem Drittel der Fälle
{const {S,ev}=welt();const a=ev('auftaktTag(myT())')+3;let k=0;const n=400;
  for(let i=0;i<n;i++){S.lager=[{ort:'schwarzwald',von:a,bis:a+9,saison:S.season,kosten:0,tag:0,koller:0}];for(let d=a;d<=a+9;d++)ev('lagerTag')(d);if(S.lager[0].koller>0)k++;}
  pruef(k/n>=1/3&&k/n<=0.5,'Lagerkoller bei zehn Tagen in einem Drittel bis der Hälfte der Fälle',pc(k/n));S.lager=[];}
// 5. Geld (Spielwert): drei Heim-Testspiele ab der 3. Vorbereitungswoche bringen einem Zweitligisten etwa die Kosten eines Lagers (7 Tage Schwarzwald)
{const {S,ev}=welt();const z=S.teams.filter(t=>t.lg===2).sort((a,b)=>b.rep-a.rep)[9];S.my=z.id;const t=ev('myT()'),T=ev('RTS').nachfrage,a=ev('auftaktTag(myT())');
  let geld=0;[3,4,5].forEach(w=>{const f=Math.max(T.min,T.start+T.jeWoche*(w-3));geld+=Math.min(t.cap,ev('attendance')(t,S.teams.find(x=>x.lg===2&&x.id!==z.id),false)*f)*t.price;});
  const k=ev('lagerKosten')('schwarzwald',7);pruef(geld/k>=0.5&&geld/k<=2.5,'Drei Heim-Testspiele bringen einem Zweitligisten etwa die Lagerkosten (Faktor 0,5–2,5)',`${Math.round(geld).toLocaleString('de-DE')} € gegen ${k.toLocaleString('de-DE')} €`);}
// 6. Ein Sommer im Ablauf: zwei Testspiele beim Amateurverein und ein Lager, gespielt ohne Halt, Geld gebucht, keine Fehler
{let geplant=0;const {S,F,ev}=welt();const a=ev('auftaktTag(myT())');tage(F,S,a+1-S.tag);
  const l=ev('testspielTage')();[l[0],l[3]].forEach(d=>{if(d!=null&&ev('testspielAnfragen')(1000+(d%5),d))geplant++;});const lf=ev('lagerMoeglich')('alpen',S.tag+2,6);if(!lf)ev('lagerBuchenLauf')('alpen',S.tag+2,6);
  tage(F,S,40);const g=(S.testspiele||[]).filter(x=>x.stand==='gespielt').length;
  pruef(geplant===2&&g===2&&(S.fin['Testspiele']||0)>0,'Zwei angefragte Testspiele gegen Amateure werden gespielt und bringen Geld',`${g} von ${geplant} gespielt, ${Math.round(S.fin['Testspiele']||0).toLocaleString('de-DE')} €`);
  pruef(!lf&&(S.fin['Trainingslager']||0)<0,'Trainingslager in der Vorbereitung buchbar, Kosten gebucht',lf||`${Math.round(-(S.fin['Trainingslager']||0)).toLocaleString('de-DE')} €`);}
// K11b. Sommerturnier (K11 §3): in der Vorbereitung anmelden (Antrittsgeld), Halbfinale gewonnen → Finale am Tag danach, Finale gewonnen → Platz 1, Pokal in der Vitrine, Siegprämie;
//       Halbfinale verloren → Spiel um Platz 3; nur einmal je Saison
{const T=welt().ev('RTS').turnier,lauf=(sieg1,sieg2)=>{const {F,S,ev}=welt();S.tag=ev('auftaktTag')(ev('myT()'))+3*7;const d=ev('testspielTage')().find(x=>F.turnierMoeglich(x));if(d==null)return{fehler:'kein Turniertag'};
    const f0=S.fin['Testspiele']||0;F.turnierAnmelden(d);const x1=S.testspiele.find(x=>x.turnier&&x.runde===1);if(!x1)return{fehler:'nicht angemeldet'};const antritt=(S.fin['Testspiele']||0)-f0;
    const tag2frei=ev('testspielTage')().includes(d+1); /* Tag 2 ist reserviert (DW1) */
    F.turnierNach({h:S.my,a:x1.gegner,hg:sieg1?2:0,ag:sieg1?0:2},x1);const x2=S.testspiele.find(x=>x.turnier&&x.runde===2);if(!x2)return{fehler:'kein zweites Spiel'};
    F.turnierNach({h:S.my,a:x2.gegner,hg:sieg2?1:0,ag:sieg2?0:1},x2);const v=(S.stat&&S.stat.vit||[]).some(e=>e.k==='turnier'),f1=S.fin['Testspiele']||0;
    // Einmal je Saison (DW10): Tage, an denen ohne das erste Turnier eines ginge, gehen jetzt nicht
    const U=S.turnier,frei=ev('testspielTage')().filter(x=>{S.turnier=null;const m=F.turnierMoeglich(x);S.turnier=U;return m;});
    return{d,antritt,tag2frei,finale:x2.finale,tag2:x2.tag===d+1,platz:S.turnier.platz,v,sieg:f1-f0-antritt,nochmal:frei.some(x=>F.turnierMoeglich(x)),pruefbar:frei.length};};
  const a=lauf(true,true),b=lauf(false,true),lg=welt().ev('myT()').lg;
  // Vor der Woche RTS.abWoche geht kein Turnier, weil keine Profis zusagen (DW6)
  const frueh=(()=>{const {F,S,ev}=welt();S.tag=ev('auftaktTag')(ev('myT()'));return ev('testspielTage')().filter(x=>ev('vorbereitungsWoche')(x)<ev('RTS').abWoche).some(x=>F.turnierMoeglich(x));})();
  pruef(!a.fehler&&a.antritt===(T.antritt[lg]||T.antritt[3])&&!a.tag2frei&&a.finale===1&&a.tag2&&a.platz===1&&a.v&&a.sieg===(T.sieg[lg]||T.sieg[3])&&!a.nochmal&&a.pruefbar>0&&!b.fehler&&b.finale===0&&b.platz===3&&!b.v&&b.sieg===0&&!frueh,
    'Sommerturnier: Anmeldung mit Antrittsgeld, Tag 2 reserviert, Finale am Tag danach, Turniersieg mit Pokal und Siegprämie, Spiel um Platz 3, einmal je Saison, nicht vor der 3. Woche',
    a.fehler||b.fehler||`Platz ${a.platz} und ${b.platz}, Pokal ${a.v}, Siegprämie ${a.sieg}, Tag 2 frei ${a.tag2frei}, nochmal ${a.nochmal} (${a.pruefbar} Tage geprüft), früh ${frueh}`);}
// K11c. Anfragen der Computer-Vereine (K11 §5): in der Vorbereitung eine Einladung (Chance hier 1), Zusage ergibt ein Auswärtstestspiel, Absage nichts; in der Automatik keine Anfrage
// Seit Prüfung DW: über den Montag in testspieleTag, Antwort am letzten Tag der Frist (DW3), Halt „Frist“ an diesem Tag (DW4), nicht mehr in der nächsten Saison
// oder bei einem anderen Verein (DW2)
{const lauf=(ja,auto)=>{const {F,S,ev}=welt();if(auto){F.lizenzStart(true);}ev('RTS').kiAnfrage.chance=1;let d=ev('auftaktTag')(ev('myT()'))+3*7;
    while(ev('wochentag')(d)!==ev('RK').wochenTag)d++;S.tag=d;F.testspieleTag(d);const a=S.tsKI;
    if(!a)return{a:null};const frist=ev('haltGrund')(a.bis),abstand=a.tag-d;S.tag=a.bis;F.kiTestspielAntwort(ja);const x=(S.testspiele||[]).find(y=>y.gegner===a.tid&&y.tag===a.tag);
    S.tsKI=Object.assign({},a,{bis:a.bis+30});S.season++;const naechste=!!ev('tsKIOffen')(S.tag);S.season--;S.tsKI.my=S.my+1;const andere=!!ev('tsKIOffen')(S.tag);S.tsKI=null;
    return{a,x,weg:true,frist,abstand,alt:naechste||andere};};
  const j=lauf(1,false),n=lauf(0,false),au=lauf(1,true),R=welt().ev('RTS');
  pruef(!!j.a&&!!j.x&&j.x.heim===false&&j.x.stand==='zugesagt'&&j.frist==='Frist'&&j.abstand>=R.kiAnfrage.tage+R.vorlaufTage&&!j.alt&&!!n.a&&!n.x&&!au.a,
    'Anfragen der Computer-Vereine: Einladung am Montag, Zusage am letzten Tag als Auswärtsspiel, Halt zur Frist, Absage, keine in der Automatik, nicht in der nächsten Saison oder bei einem anderen Verein',
    `Zusage ${!!j.x}, Absage ${!n.x}, Automatik ${au.a?'Anfrage':'keine'}, Halt ${j.frist}, Abstand ${j.abstand} Tage, alte Einladung gilt ${j.alt}`);}

// K11h. Auslandsvereine im Trainingslager (K11 §12 Nr. 11): an Lagertagen RTS.lagerAusland Vereine aus dem Land des Lagerorts (Andalusien: Spanien), im Schwarzwald
//       und ohne Lager keine; anfragen geht nur im Lager, gespielt wird auswärts.
{const {S,F,ev}=welt(),RTS=ev('RTS'),tage=F.testspielTage(),iv=ev('inVorbereitung'),vw=ev('vorbereitungsWoche'),av=ev('avVon'),d=tage.find(x=>!iv(x)||vw(x)>=RTS.abWoche);
  const lager=ort=>{S.lager=[{ort,von:d-1,bis:d+3,saison:S.season,kosten:0,tag:0,koller:0}];};let ok=false,info='kein freier Tag';
  if(d!=null){lager('andalusien');const g=F.testspielGegnerAusland(d),spanien=g.length===RTS.lagerAusland&&g.every(x=>x.aus&&av(x.id).land==='ESP');
    lager('schwarzwald');const keinLand=F.testspielGegnerAusland(d).length===0;S.lager=[];const ohne=F.testspielGegnerAusland(d).length===0,abgelehnt=F.testspielAnfragen(g[0].id,d)===null;
    lager('andalusien');const x=F.testspielAnfragen(g[0].id,d),angefragt=!!x&&x.gegner===g[0].id&&x.heim===false;S.lager=[];
    ok=spanien&&keinLand&&ohne&&abgelehnt&&angefragt;info=`Spanien ${spanien} (${g.map(y=>av(y.id).name).join(', ')}), Schwarzwald ${keinLand}, ohne Lager ${ohne}, außerhalb abgelehnt ${abgelehnt}, angefragt ${angefragt}`;}
  pruef(ok,'Auslandsvereine im Trainingslager: Gegner aus dem Land des Lagers, nur dort, auswärts',info);}

// K11i. Marketing der Golfregion (K11 §4.2, K25): am letzten Lagertag marketing.anteil der Lagerkosten als Einnahme, einmal; andere Orte nichts.
{const {S,F,ev}=welt(),t=ev('myT()'),O=ev('RLA').orte,d=S.tag,mk=k=>S.fin[k]||0;
  S.lager=[{ort:'golf',von:d-3,bis:d,saison:S.season,kosten:100000,tag:0,koller:0}];const c0=t.cash,f0=mk('Marketing: Lager');F.lagerTag(d);
  const g=Math.round(100000*O.golf.marketing.anteil/1000)*1000,bezahlt=t.cash===c0+g&&mk('Marketing: Lager')===f0+g&&S.lager[0].mk===1;F.lagerTag(d);const einmal=t.cash===c0+g;
  S.lager=[{ort:'alpen',von:d-3,bis:d,saison:S.season,kosten:100000,tag:0,koller:0}];const c1=t.cash;F.lagerTag(d);const andere=t.cash===c1;S.lager=[];
  pruef(bezahlt&&einmal&&andere,'Marketing der Golfregion: Einnahme am letzten Lagertag, einmal, nur dort',`bezahlt ${bezahlt} (${g}), einmal ${einmal}, andere Orte ${andere}`);}
// K11k. Zimmerbelegung (K11 §5.4): Der Co-Trainer setzt einen fremdsprachigen Neuzugang zu einem deutschsprachigen Eingewöhnten und trennt Rivalen, „Landsleute“ legt
//       zwei Fremdsprachige gleicher Sprache zusammen. Je Lagertag Integration und Deutsch neben dem Muttersprachler, Freundschaft mit freund, Zoff bei Rivalen nur einmal.
//       lagerTag teilt am ersten Tag ein. Zufall fest (hash32), für den Test freund und streit auf 1.
{const {S,F,ev}=welt(),Z=ev('RLA').zimmer,sq=ev('squad')(S.my),ein=ev('zimmerEinteilen'),zt=ev('lagerZimmerTag'),d=S.tag,mit=(z,p)=>z.find(x=>x.slice(0,2).includes(p.id));
  S.bz=[];sq.forEach(p=>{p.nat='GER';delete p.de;delete p.int;delete p.intA;p.eig=[];p.st=50;});const [a,b]=sq,jung=sq.slice(2).sort((x,y)=>x.age-y.age||x.id-y.id),r1=jung[0],r2=jung[1];a.nat='BRA';b.nat='POR';a.int=50;a.de=30;b.de=40;S.bz.push([r1.id,r2.id,'R',1]);
  const co=ein(sq,'co'),za=mit(co,a),partner=za&&za.length>1?ev('PIX').get(za[0]===a.id?za[1]:za[0]):null,coOk=!!partner&&partner.nat==='GER'&&partner.int==null&&mit(co,r1)!==mit(co,r2);
  const la=ein(sq,'landsleute'),laOk=mit(la,a)===mit(la,b),alle=co.reduce((n,z)=>n+z.slice(0,2).length,0)===sq.length;
  const g=sq.find(p=>p!==r1&&p!==r2&&p.nat==='GER'&&p!==a&&p!==b),f0=Z.freund,s0=Z.streit;Z.freund=1;Z.streit=1;const l={zimmer:[[a.id,g.id],[r1.id,r2.id]]};zt(l,d);
  const integ=a.int===50+Z.integration&&a.de===Math.round((30+Z.deutsch)*10)/10,freund=!!ev('beziehung')(a,g),zoff=r1.st<50&&r2.st<50&&l.zimmer[1][2]===1&&S.news.some(x=>String(x.t).includes('Zoff im Doppelzimmer'));
  const st1=r1.st;zt(l,d);const einmal=r1.st===st1&&S.bz.filter(x=>x[2]==='F').length===1;Z.freund=f0;Z.streit=s0;
  S.lager=[{ort:'schwarzwald',von:d,bis:d+4,saison:S.season,kosten:0,tag:0,koller:0}];F.lagerTag(d);const lt=!!S.lager[0].zimmer&&S.lager[0].zimmer.length===Math.ceil(sq.length/2);S.lager=[];
  pruef(coOk&&laOk&&alle&&integ&&freund&&zoff&&einmal&&lt,'Zimmerbelegung: Neue zu Deutschsprachigen, Landsleute zusammen, Integration, Deutsch, Freundschaft, Zoff einmal',
    `Co-Trainer ${coOk}, Landsleute ${laOk}, alle verteilt ${alle}, Integration und Deutsch ${integ} (${a.int}, ${a.de}), Freunde ${freund}, Zoff ${zoff}, einmal ${einmal}, Lagertag ${lt}`);}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
