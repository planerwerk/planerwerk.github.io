// Training (K07): Einheiten nach Abstand zum Spiel aus Vorlagen, Belastung und Belastungssprung, Wochenreize für Kondition und Entwicklung,
// Vertrautheit aus Taktik-Einheiten, Spielvorbereitung und Standards, Trainingsverletzungen, Trainingsspiel, Umschulung.
const EINHEIT_NAME={regeneration:'Regeneration',kondition:'Kondition',technik:'Technik und Spielformen',taktik:'Taktik',standards:'Standards',vorbereitung:'Spielvorbereitung',spiel:'Trainingsspiel',frei:'frei'};
const INTENSITAET_NAME={leicht:'leicht',normal:'normal',hoch:'hoch'};

// Letzter und nächster Spieltag je Verein um den Tag d (bis RT.blick Tage zurück und voraus), einmal pro Tag gerechnet
let ABSTAND={key:null,m:null};
function spielAbstand(d){const key=S.season+'/'+d;if(ABSTAND.key===key)return ABSTAND.m;const m=new Map(),get=id=>{let x=m.get(id);if(!x){x={};m.set(id,x);}return x;};
  for(let k=1;k<=RT.blick;k++){spielendeAm(d-k).forEach(id=>{const x=get(id);if(x.last==null)x.last=d-k;});spielendeAm(d+k).forEach(id=>{const x=get(id);if(x.next==null)x.next=d+k;});}
  spielendeAm(d).forEach(id=>{get(id).heute=true;});ABSTAND={key,m};return m;}
// Vorlage, die der Co-Trainer (und jeder Computer-Verein) wählt (K07 §7): englische Woche bei höchstens 4 Tagen zwischen zwei Spielen, Aufbau in Pausen, Vorbereitung vor dem ersten Pflichtspiel
function vorlageAuto(a,d,t){if(!a||a.next==null)return'aufbau';if(a.last==null&&d<auftaktTag(t)+RT.vorbereitungTage)return'vorbereitung';
  const gap=a.last!=null?a.next-a.last:99;return gap<=RT.englischBis?'englisch':a.next-d>RT.pauseAb?'aufbau':'standard';}
const vorlageVon=(t,a,d)=>t&&t.vorlage&&t.vorlage!=='auto'&&RT.vorlagen[t.vorlage]?t.vorlage:vorlageAuto(a,d,t);
// Einheit eines Spielers an Tag d: [Einheit, Intensität] oder null (Spieltag). MD+1 regenerieren nur Spieler mit mindestens 60 Minuten.
function einheitFuer(p,t,a,d){a=a||{};if(a.heute)return null;const key=vorlageVon(t,a,d),V=RT.vorlagen[key];
  const L=a.last!=null?d-a.last:null,N=a.next!=null?a.next-d:null;
  if(key==='vorbereitung'){if(N===1)return V.m1;const a0=auftaktTag(t),w=Math.max(0,Math.floor((d-a0)/7)),l=V.wochen[Math.min(w,V.wochen.length-1)];return l[((d-a0)%l.length+l.length)%l.length];}
  if(L===1)return p&&p.ltag===a.last&&p.lmin>=RT.startspielerAb?V.p1:V.p1rest;if(N===1)return V.m1;if(L===2)return V.p2;if(N===2)return V.m2;
  const i=L!=null?L-3:d;return V.mitte[((i%V.mitte.length)+V.mitte.length)%V.mitte.length];}
const STARTER={ltag:null,lmin:90};
function einheitVerein(t,a,d){return einheitFuer(Object.assign({},STARTER,{ltag:a&&a.last}),t,a,d);}

// Belastung (K07 §3.4): akute und chronische Last als gleitende Mittel über 7 und 28 Tage (statt 28 einzelner Tageswerte), Belastungssprung = akut / chronisch
function lastBuchen(p,l){const L=RT.last;p.la=(p.la||0)+(l-(p.la||0))*2/(L.akut+1);p.lc=(p.lc||0)+(l-(p.lc||0))*2/(L.chronisch+1);}
// Untergrenze der gewohnten Last: auch im Urlaub halten sich Profis etwas fit, sonst wäre jeder erste Trainingstag ein riesiger Sprung
const lastQuote=p=>(p.la||0)/Math.max(p.lc||0,RT.last.grund);
function sprungFaktor(q){const V=RT.verletzung;return q<=V.sprungAb?1:1+V.sprungJe01*(q-V.sprungAb)/0.1;}

// Ein Trainingstag eines Spielers: gibt den Frischeverlust (negativ) oder -gewinn zurück und bucht Reize, Last, Spielpraxis und Verletzungsrisiko
function trainingTag(p,t,a,d){const T=RT,e=einheitFuer(p,t,a,d);if(!e)return 0;const lf=lagerFaktor(p.team,d);if(!lf.training)return 0; // Wetter im Lager: Einheit fällt aus
  const[u,iz]=e,E=T.einheiten[u]||{},I=T.intensitaet[iz]||T.intensitaet.normal;
  const df=(E.frische||0)>0?E.frische*I.wirkung:(E.frische||0)*I.frische;
  p.wk=(p.wk||0)+(E.kondition||0)*I.wirkung*stabFaktor(p.team,'kondition')*lf.kondition;p.we=(p.we||0)+(E.entwicklung||0)*I.wirkung*lf.training*(p.fit<T.entwicklung.frischeUnter?T.entwicklung.frischeFaktor:1);
  if(u!=='frei'&&u!=='regeneration')p.wt=(p.wt||0)+1;if(E.lernen)p.wl=1;
  if(E.praxis)p.sp=Math.min(100,p.sp+RP.spielpraxis.jeSpiel*E.praxis*I.wirkung);
  lastBuchen(p,Math.max(0,-df));
  if(E.risiko!==0&&u!=='frei'&&u!=='regeneration'){const V=T.verletzung,r=V.basis*I.risiko*(E.risiko||1)*sprungFaktor(lastQuote(p))*(p.fit<V.frischeAb?1+V.frischeJePunkt*(V.frischeAb-p.fit):1)*verletzRisiko(p)*rueckfallFaktor(p)*stabFaktor(p.team,'athletik');
    if(R()<r&&verletzen(p,'training'))p.tinj=(p.tinj||0)+1;}
  return df;}
// Verein am Tag d: Vertrautheit aus Taktik-Einheiten und Spielvorbereitung (K07 §5.3), Merker für Spielvorbereitung und Standards
function trainingVerein(t,a,d){const e=einheitVerein(t,a,d);if(!e)return;const[u,iz]=e,E=RT.einheiten[u]||{},I=RT.intensitaet[iz]||RT.intensitaet.normal;
  if(E.vertrautheit){const w=u==='taktik'?E.vertrautheit*(iz==='hoch'?1.5:iz==='leicht'?0.5:1):E.vertrautheit,f=stabFaktor(t.id,'co')*lagerFaktor(t.id,d).vertrautheit;
    vertrautSetzen(t,'stil',t.stil||'ausgewogen',vertraut(t,'stil',t.stil||'ausgewogen')+w*f);vertrautSetzen(t,'ordnung',t.form,vertraut(t,'ordnung',t.form)+w*f);}
  if(u==='vorbereitung')t.vbTag=d;if(u==='standards')t.stdTag=d;}
// Woche (K07 §5.1, §5.2): Konditionsziel aus dem Wochenreiz, Trainingsfaktor der Entwicklung, Lernen nur mit mindestens drei Trainingstagen
function trainingWoche(p){const T=RT,K=T.kondition;
  if(p.team>=0&&!sommerStatus(S.teams[p.team])){const ziel=Math.min(K.max,K.basis+K.jeReiz*(p.wk||0))-Math.max(0,p.age-RP.kondition.altAb)*RP.kondition.altJeJahr-(hatEig(p,'partyloewe')?8:0);
    p.ko=clamp(p.ko+(ziel-p.ko)*RP.kondition.tempo,0,100);
    const E=T.entwicklung;p.trf=clamp((E.min+(1-E.min)*(p.we||0)/E.normalReiz)*(p.pos==='TW'?stabFaktor(p.team,'torwart'):1),E.min,E.max);}
  p.wk=0;p.we=0;}
const genugTraining=p=>(p.wt||0)>=RT.lernen.mindestTage;
// Umschulung (K07 §3.3): Eignung auf der neuen Position steigt pro Woche, verwandte Positionen schneller
function umschulungWoche(p){if(!p.um||p.team<0||p.inj>0)return;const U=RT.umschulung,pos=p.um,max=hatMk(p,'vielseitig')?U.maxVielseitig:U.max;p.eig=p.eig||{};
  const basis=Math.round(eignung(Object.assign({},p,{eig:null,fuss:'B'}),pos)*100), // ohne Fußabzug: verwandt ist, was nah beieinander liegt
   akt=Math.max(p.eig[pos]||0,basis),plus=(basis>=U.verwandtAb?U.verwandt:U.fremd)*stabFaktor(p.team,'co')*(genugTraining(p)?1:0.5);
  p.eig[pos]=Math.min(max,akt+plus);if(p.eig[pos]>=max){if(p.team===S.my)news(`Umschulung abgeschlossen: ${p.n} kann jetzt ${RP.positionsNamen[pos]||pos} (${max} %).`,'good');p.um=null;}}
