// Trainerstab (K16, Welle 2): Co-Trainer (Pflicht), Torwart-, Athletik- und Standardtrainer, Arzt, Physiotherapeut, Videoanalyst, Sportpsychologe.
// Mitarbeiter haben Qualität 1–20, Gehalt und Vertrag. Ohne Mitarbeiter wirkt eine Rolle wie Qualität 3.
const STAB_ROLLEN=()=>Object.keys(RST.rollen);
let STAB_IX=null;
function stabIndex(){if(STAB_IX&&STAB_IX.n===S.stab.length&&STAB_IX.key===S.stabVersion)return STAB_IX.m;const m=new Map();(S.stab||[]).forEach(x=>{if(x.team<0)return;const k=x.team+'/'+x.r;if(!m.has(k))m.set(k,[]);m.get(k).push(x);});
  STAB_IX={n:(S.stab||[]).length,key:S.stabVersion,m};return m;}
const stabGeaendert=()=>{S.stabVersion=(S.stabVersion||0)+1;};
const stabVon=(tid,r)=>stabIndex().get(tid+'/'+r)||[];
// beste Qualität einer Rolle im Verein (ohne Mitarbeiter: RST.ohne)
const stabQ=(tid,r)=>{const l=stabVon(tid,r);return l.length?Math.max(...l.map(x=>x.q)):RST.ohne;};
// Wirkung je Bereich (K16 §5.3). art: co (Lernen, Umschulung, Vertrautheit), athletik (Risiko im Training), kondition, torwart, physio (Ausfallzeit), standard, video, psycho
function stabFaktor(tid,art){if(tid==null||tid<0||!S.stab)return 1;const W=RST.wirkung;
  if(art==='co'){const q=stabQ(tid,'co');return W.co[0]+W.co[1]*q;}
  if(art==='athletik')return 1+W.athletik.risiko*stabQ(tid,'athletik');
  if(art==='kondition')return 1+W.athletik.kondition*stabQ(tid,'athletik');
  if(art==='torwart'){const q=stabQ(tid,'torwart');return W.torwart[0]+W.torwart[1]*q;}
  if(art==='physio')return Math.max(1-W.physio.max,1+W.physio.ausfall*stabQ(tid,'physio'));
  if(art==='standard')return 1+W.standard*stabQ(tid,'standard');
  if(art==='video')return stabQ(tid,'video')>=W.video.ab?1+W.video.bonus:1;
  if(art==='psycho')return stabQ(tid,'psycho');
  return 1;}
// Einzeltrainingsplätze: 3 + Qualität/5 je Co-Trainer, höchstens 10 (ohne Stab: 5 wie bisher)
function stabPlaetze(tid){if(!S.stab)return RP.lernen.plaetze;const l=stabVon(tid,'co'),P=RST.wirkung.coPlaetze;if(!l.length)return P.basis;return Math.min(P.max,Math.round(l.reduce((a,x)=>a+P.basis+P.jeQualitaet*x.q,0)));}
// Ausfallzeit einer Verletzung in Tagen mit Physiotherapeut (K16 §5.3)
const ausfallTage=(tid,wochen)=>Math.max(1,Math.round(wochen*7*stabFaktor(tid,'physio')))+1;

// Gehalt nach Qualität und Liga (K16 §5.4)
function stabGehalt(r,q,lg){const G=RST.gehalt,b=(G.basis[lg]||G.basis[3])*(RST.rollen[r].gehalt||1);return Math.round(b*Math.exp(G.steigung*(q-10))/G.runden)*G.runden;}
let STAB_ID=1;
function stabNeu(r,q,team,lg){const id=S.stabId=(S.stabId||0)+1;return{id,r,n:rname(),q:clamp(Math.round(q),1,20),team,age:riA(RST.alter),ct:riA(RST.vertrag),sal:stabGehalt(r,q,lg||3),wiv:0};}
// Start (K16 §4.1): jeder Verein hat einen Stab nach seinem Ansehen, dazu vereinslose Mitarbeiter
function stabAufbau(){const A=RST.start;S.stab=[];S.stabId=0;
  S.teams.forEach(t=>{if(!aktiv(t))return;STAB_ROLLEN().filter(r=>r!=='scout').forEach(r=>{const ab=A.rolleAbAnsehen[r]||0;if(t.rep<ab&&!RST.rollen[r].pflicht)return;
      const n=r==='co'&&t.rep>=A.zweiterCoAb?2:1;for(let i=0;i<n;i++)S.stab.push(stabNeu(r,t.rep*A.qualitaetJeAnsehen+ri(A.streuung[0],A.streuung[1])-(i?2:0),t.id,t.lg));});});
  for(let i=0;i<RST.vereinslos;i++){const r=pick(STAB_ROLLEN().filter(r=>r!=='scout'));S.stab.push(stabNeu(r,riA(A.vereinslosQ),-1,2));}
  stabGeaendert();} // Scouts kommen mit eigenem Strom dazu (js/scouting.js, K18)
// Qualität, wie du sie siehst: eigene Mitarbeiter nach einigen Wochen genau, sonst als Spanne (K16 §3.2)
function stabQText(x){if(x.team===S.my&&(x.wiv||0)>=RST.genauNachWochen)return String(x.q);const u=RST.unschaerfe,h=(x.id*2654435761>>>0)%(2*u+1)-u,m=clamp(x.q+h,1,20);return`${clamp(m-u,1,20)}–${clamp(m+u,1,20)}`;}
// Woche: Zeit im Verein (für die genaue Qualität), Computer-Vereine besetzen den Co-Trainer nach, wenn er fehlt
function stabWoche(){(S.stab||[]).forEach(x=>{if(x.team>=0)x.wiv=(x.wiv||0)+1;});
  S.teams.forEach(t=>{if(!aktiv(t)||t.id===S.my||stabVon(t.id,'co').length)return;const frei=S.stab.filter(x=>x.team<0&&x.r==='co').sort((a,b)=>b.q-a.q)[0];if(frei){frei.team=t.id;frei.sal=stabGehalt('co',frei.q,t.lg);frei.ct=riA(RST.vertrag);stabGeaendert();}});}
// Neue Saison: Verträge laufen aus. Computer-Vereine verlängern meist, eigene Mitarbeiter gehen, wenn du nicht verlängert hast.
function stabSaison(){(S.stab||[]).forEach(x=>{x.age++;if(x.team<0)return;x.ct--;if(x.ct>0)return;
    if(x.team!==S.my&&R()<RST.verlaengern){x.ct=riA(RST.vertrag);return;}if(x.team===S.my)news(`${RST.rollen[x.r].name} ${x.n} verlässt den Verein (Vertrag ausgelaufen).`,'bad');x.team=-1;});
  S.stab=S.stab.filter(x=>x.team>=0||x.age<RST.rente);while(S.stab.filter(x=>x.team<0).length<RST.vereinslos){const r=pick(STAB_ROLLEN());S.stab.push(stabNeu(r,riA(RST.start.vereinslosQ),-1,2));}stabGeaendert();auftraegeAufraeumen();}
// Gehälter des eigenen Stabs je Ligaspiel (wie die Spielergehälter)
const stabGehaelter=tid=>(S.stab||[]).filter(x=>x.team===tid).reduce((a,x)=>a+x.sal,0);
