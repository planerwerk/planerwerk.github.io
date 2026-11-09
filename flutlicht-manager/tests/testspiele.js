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
console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
