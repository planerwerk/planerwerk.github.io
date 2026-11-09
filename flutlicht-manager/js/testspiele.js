// Testspiele und Trainingslager (K11, Welle 2): Gegner anfragen (Zusage nach Niveau, Kalender, Region, Phase), Antwort nach 1–3 Tagen,
// Testspiel ohne Halt mit vielen Wechseln, ohne Sperren, mit weniger Belastung und Wirkung; Einnahmen; Trainingslager mit Ort, Kosten,
// stärkerem Training, Zusammenhalt, Lagerkoller, Ablenkung und Wetter. Computer-Vereine spielen noch keine Testspiele und fahren in kein Lager.
const RTS_ORT=()=>RLA.orte;

// Phase und Vorbereitungswoche des eigenen Vereins an Tag d
const vorbereitungsWoche=d=>Math.floor((d-auftaktTag(myT()))/7)+1;
const inVorbereitung=d=>d>=auftaktTag(myT())&&d<ersterPflichttermin();
// Pflichtspiele eines Vereins in [d−k, d+k] (Liga, Pokal-Auslosung, Relegation, Supercup)
function pflichtspielNah(tid,d,k){for(let x=d-k;x<=d+k;x++){if(spielendeAm(x).has(tid))return true;if(S.supercup&&S.supercup.tag===x&&[S.supercup.h,S.supercup.a].includes(tid))return true;
    const P=S.plan.pokal.findIndex(z=>z[0]===x);if(P>=0&&S.cup.alive.includes(tid)&&S.cup.hist.length<=P)return true;}return false;}
// Mögliche Tage für ein Testspiel: ab übermorgen plus Antwortzeit, kein Urlaub, Abstand zu eigenen Pflichtspielen, höchstens eins pro Tag
function testspielTage(){const T=RTS,l=[],von=S.tag+T.vorlaufTage,bis=Math.min(S.plan.ende-1,S.tag+T.planTage),belegt=new Set((S.testspiele||[]).filter(x=>x.stand!=='abgesagt').map(x=>x.tag));
  for(let d=von;d<=bis;d++){if(belegt.has(d)||d<auftaktTag(myT())||pflichtspielNah(S.my,d,T.abstandPflichtspiel))continue;
    const w=Math.floor(d/7),n=(S.testspiele||[]).filter(x=>x.stand!=='abgesagt'&&Math.floor(x.tag/7)===w).length;if(n>=T.maxProWoche)continue;l.push(d);}return l;}
// Vorgeschlagene Gegner: zwei Amateurvereine aus der Region, Profis aus der 1. bis 3. Liga nach Niveau (näher zuerst)
function testspielGegner(d){const me=teamLevel(S.my),t=myT(),pro=S.teams.filter(x=>aktiv(x)&&x.id!==S.my).map(x=>({id:x.id,d:teamLevel(x.id)-me,reg:x.region===t.region}))
    .sort((a,b)=>Math.abs(a.d)-Math.abs(b.d)-(a.reg-b.reg)*2).slice(0,RTS.vorschlaege);
  const am=[0,1].map(k=>1000+(hash32(S.season+'/'+d+'/'+k)%S.am.length));return[...am.map(id=>({id,am:true})),...pro.map(x=>({id:x.id,d:x.d}))];}
// Zusage (K11 §5.1): Grundwert × Niveau × Kalender × Region × Phase, begrenzt
function zusageChance(tid,d){const Z=RTS.zusage;if(tid>=1000)return Z.max;const o=S.teams[tid],diff=teamLevel(tid)-teamLevel(S.my);
  let p=Z.grund*(diff>=Z.staerkerAb?Z.staerker:diff<=-Z.schwaecherAb?Z.schwaecher:1)*(pflichtspielNah(tid,d,RTS.abstandPflichtspiel)?Z.kalender:1)
    *(o.region===myT().region?Z.region:1)*(inVorbereitung(d)?Z.vorbereitung:Z.saison);
  if(inVorbereitung(d)&&vorbereitungsWoche(d)<RTS.abWoche)p*=Z.frueh; // Profis erst ab der 3. Vorbereitungswoche (Anstoss-Idee)
  return clamp(p,Z.min,Z.max);}
function testspielAnfragen(tid,d){if(!testspielTage().includes(d))return null;(S.testspiele=S.testspiele||[]);S.testId=(S.testId||0)+1;
  const x={id:S.testId,tag:d,gegner:tid,heim:tid<1000,stand:'angefragt',antwortAm:S.tag+riA(RTS.antwortTage)};S.testspiele.push(x);return x;}
// Jeden Tag: Antworten auf Anfragen, Trainingslager
function testspieleTag(d){(S.testspiele||[]).forEach(x=>{if(x.stand!=='angefragt'||d<x.antwortAm)return;const ok=R()<zusageChance(x.gegner,x.tag);x.stand=ok?'zugesagt':'abgesagt';
  news(ok?`Testspiel am ${datumKurz(x.tag)}: ${tn(x.gegner)} sagt zu${x.heim?' und kommt zu dir':', du spielst dort'}.`:`${tn(x.gegner)} sagt das Testspiel am ${datumKurz(x.tag)} ab.`,ok?'good':'');});
  lagerTag(d);}
const testspielHeute=d=>(S.testspiele||[]).filter(x=>x.stand==='zugesagt'&&x.tag===d);

// Nach dem Testspiel (K11 §3.2): weniger Frische und Belastung, Spielpraxis 60 %, Form zu 30 %, Vertrautheit +2, Lernen zur Hälfte, keine Karten, kein Einsatz in der Statistik
function testspielNach(r,x){const T=RTS,N=RE.note,F=RP.frische;
  [0,1].forEach(s=>{const tid=s?r.a:r.h;if(tid>=1000)return;const gf=s?r.ag:r.hg,ga=s?r.hg:r.ag,res=gf>ga?1:gf<ga?-1:0;
    r.xpo[s].forEach(([id,,,min=90])=>{const p=PIX.get(id);if(!p)return;
      p.fit=clamp(p.fit-F.spiel*min/90*(F.ko[0]+F.ko[1]*p.ko)*T.frische,RE.fitnessMin,100);p.sp=Math.min(100,p.sp+RP.spielpraxis.jeSpiel*min/90*T.praxis);
      lastBuchen(p,RT.spielLast*min/90*T.frische);p.wk=(p.wk||0)+RT.spielKondition*min/90;p.ltag=S.tag;p.lmin=min;p.sb=Math.min(100,(p.sb||0)+min/RSO.belastung.jeMinuten*T.frische);
      if(min>=N.mindestMinuten){const fest=N.basis-(p.str-N.staerkeMitte)/N.staerkeTeiler,gr=clamp(Math.round((fest-res*N.ergebnis+(R()-0.5)*N.zufall)*2)/2,N.min,N.max),alt=p.form;
        formNachNote(p,gr,fest);p.form=alt+(p.form-alt)*T.form;}});
    const tk=r.taktik&&r.taktik[s],t=S.teams[tid];if(tk){vertrautSetzen(t,'stil',tk.stil,vertraut(t,'stil',tk.stil)+T.vertrautheit);vertrautSetzen(t,'ordnung',tk.form,vertraut(t,'ordnung',tk.form)+T.vertrautheit);}});
  lernenImSpiel(Object.assign({},r,{sz:r.sz.filter((_,i)=>i%2===0)}));
  r.inj.forEach(i=>verletzen(PIX.get(i.id),i.q||'kollision'));
  // Geld (K11 §5.2): als Gastgeber Zuschauer mit nachlassendem Interesse, beim Amateurverein eine feste Gage
  const t=myT();let geld=0,zus=0;
  if(x.heim&&r.h===S.my){const N2=T.nachfrage,w=inVorbereitung(x.tag)?vorbereitungsWoche(x.tag):99,f=Math.max(N2.min,N2.start+N2.jeWoche*Math.max(0,w-T.abWoche))*(r.a<1000&&S.teams[r.a].rep>=N2.grossAb?N2.grosserName:1);
    zus=Math.round(Math.min(t.cap,attendance(t,r.a<1000?S.teams[r.a]:null,false)*f));geld=zus*t.price;}
  else if(r.h>=1000){const G=T.gageAmateur;geld=Math.round((G[0]+(G[1]-G[0])*clamp(t.rep/100,0,1))/1000)*1000;}
  if(geld)money('Testspiele',geld);x.erg={hg:r.hg,ag:r.ag,zus,geld};x.stand='gespielt';
  const sieg=(r.h===S.my?r.hg-r.ag:r.ag-r.hg);
  news(`Testspiel: ${tn(r.h)} – ${tn(r.a)} ${r.hg}:${r.ag}${zus?` vor ${zus.toLocaleString('de-DE')} Zuschauern`:''}${geld?`, Einnahmen ${fmt(geld)}`:''}.${sieg<0&&(r.h>=1000||r.a>=1000)?' Eine Blamage gegen einen Amateurverein.':''}`,sieg>0?'good':sieg<0?'bad':'');}

// Trainingslager (K11 §3.3, §5.3): Ort, Zeitraum, Kosten; im Lager wirkt das Training stärker
function lagerSaison(d){const t=myT(),w=S.plan.pausen.find(p=>p.name==='Winterpause'&&p.ligen.includes(t.lg)&&d>=p.von-7&&d<=p.bis);if(w)return'winter';return inVorbereitung(d)?'sommer':null;}
function lagerKosten(ort,tage){return Math.round(RLA.orte[ort].kosten*(RLA.ligaFaktor[myT().lg]||RLA.ligaFaktor[3])*tage);}
function lagerMoeglich(ort,von,tage){const O=RLA.orte[ort];if(!O||tage<RLA.tage[0]||tage>RLA.tage[1]||von<=S.tag)return'Zeitraum ungültig';
  for(let d=von;d<von+tage;d++){const s=lagerSaison(d);if(!s)return'nur in der Vorbereitung oder der Winterpause';if(O.saison!=='beide'&&O.saison!==s)return`${O.name} nur im ${O.saison==='sommer'?'Sommer':'Winter'}`;
    if(meinSpiel(d))return'im Zeitraum liegt ein Pflichtspiel';}
  if((S.lager||[]).some(l=>l.saison===S.season&&lagerSaison(l.von)===lagerSaison(von)))return'in dieser Pause gibt es schon ein Lager';return'';}
function lagerBuchenLauf(ort,von,tage){const k=lagerKosten(ort,tage);(S.lager=S.lager||[]).push({ort,von,bis:von+tage-1,saison:S.season,kosten:k,tag:0,koller:0});money('Trainingslager',-k);return k;}
const lagerAktiv=d=>(S.lager||[]).find(l=>l.saison===S.season&&d>=l.von&&d<=l.bis)||null;
// Faktoren für Training und Vertrautheit des eigenen Vereins an Tag d (null: kein Lager oder die Einheit fällt wegen Wetter aus)
function lagerFaktor(tid,d){if(tid!==S.my)return{training:1,kondition:1,vertrautheit:1};const l=lagerAktiv(d);if(!l)return{training:1,kondition:1,vertrautheit:1};
  if(l.ausfall===d)return{training:0,kondition:0,vertrautheit:0};const O=RLA.orte[l.ort];return{training:RLA.training,kondition:RLA.training*(O.kondition||1),vertrautheit:RLA.vertrautheit};}
function lagerTag(d){const l=lagerAktiv(d);if(!l)return;const O=RLA.orte[l.ort],sq=squad(S.my).filter(p=>p.inj<=0);l.tag=d-l.von+1;
  if(l.tag===1)news(`Trainingslager in ${O.name} beginnt (${l.bis-l.von+1} Tage).`);
  if(O.wetter&&R()<O.wetter){l.ausfall=d;news(`Trainingslager: Wegen des Wetters fällt das Training heute aus.`);}
  if(l.tag<=RLA.zusammenhaltBis)sq.forEach(p=>svAendern(p,RLA.zusammenhalt)); // Zusammenhalt (bis K14: Selbstvertrauen)
  if(l.tag>=RLA.kollerAb&&R()<RLA.koller){l.koller++;const n=Math.min(sq.length,ri(3,5));shuffle(sq.slice()).slice(0,n).forEach(p=>svAendern(p,RLA.kollerSv));news('Lagerkoller: Die Stimmung im Lager kippt, einige Spieler wollen nach Hause.','bad');}
  if(O.ablenkung)sq.filter(p=>hatEig(p,'partyloewe')).forEach(p=>{if(R()<RLA.ablenkung/(l.bis-l.von+1)){svAendern(p,RLA.ablenkungSv);news(`Trainingslager: ${p.n} wurde nachts in der Stadt gesehen.`,'bad');}});
  if(d===l.bis)news(`Trainingslager in ${O.name} beendet. Der Co-Trainer ist zufrieden mit Kondition und Abläufen.`,'good');}
