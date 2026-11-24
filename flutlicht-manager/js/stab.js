// Trainerstab (K16, Welle 2): Co-Trainer (Pflicht), Torwart-, Athletik- und Standardtrainer, Arzt, Physiotherapeut, Videoanalyst, Sportpsychologe.
// Mitarbeiter haben Qualität 1–20, Gehalt und Vertrag. Ohne Mitarbeiter wirkt eine Rolle wie Qualität 3.
const STAB_ROLLEN=()=>Object.keys(RST.rollen);
let STAB_IX=null;
function stabIndex(){if(STAB_IX&&STAB_IX.n===S.stab.length&&STAB_IX.key===S.stabVersion)return STAB_IX.m;const m=new Map();(S.stab||[]).forEach(x=>{if(x.team<0)return;const k=x.team+'/'+x.r;if(!m.has(k))m.set(k,[]);m.get(k).push(x);});
  STAB_IX={n:(S.stab||[]).length,key:S.stabVersion,m};return m;}
const stabGeaendert=()=>{S.stabVersion=(S.stabVersion||0)+1;};
const stabVon=(tid,r)=>stabIndex().get(tid+'/'+r)||[];
// beste Qualität einer Rolle im Verein (ohne Mitarbeiter: RST.ohne)
const stabQ=(tid,r)=>{const l=stabVon(tid,r);return l.length?Math.max(...l.map(x=>x.q*stabStreitFaktor(x))):RST.ohne;}; /* Streit im Stab (K16f): Qualität × (1 − malus) bis x.streitBis */
// Streit im Stab (K16 §8, K16f): hitziges Temperament fest aus der Nummer (ohne Zufall), Anteil RST.streit.hitzigProzent; während eines Streits wirkt der Mitarbeiter schwächer
const stabHitzig=x=>hash32('tp|'+x.id)%100<RST.streit.hitzigProzent;
// Ehrgeiz (K16 §8, K16g): fest aus der Nummer wie das Temperament, Anteil RKT.stab.chef.ehrgeizProzent; nur ehrgeizige Co-Trainer wollen Cheftrainer werden
const stabEhrgeizig=x=>hash32('eh|'+x.id)%100<RKT.stab.chef.ehrgeizProzent;
/* nur dein Stab (Prüfung EY3): Nach einem Jobwechsel oder einem Wechsel über K16c wirkt ein alter Streit beim anderen Verein nicht weiter */
const stabStreitFaktor=x=>x.team===S.my&&x.streitBis!=null&&x.streitBis>=absTag(S.tag)?1-RST.streit.malus:1;
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
function stabPlaetze(tid){if(!S.stab)return RP.lernen.plaetze;const l=stabVon(tid,'co'),P=RST.wirkung.coPlaetze;if(!l.length)return P.basis;return Math.min(P.max,Math.round(l.reduce((a,x)=>a+P.basis+P.jeQualitaet*x.q*stabStreitFaktor(x),0)));} /* Streit (K16f, Prüfung EY1) auch hier */
// Ausfallzeit einer Verletzung in Tagen mit Physiotherapeut (K16 §5.3)
const ausfallTage=(tid,wochen)=>Math.max(1,Math.round(wochen*7*stabFaktor(tid,'physio')))+1;

// Gehalt nach Qualität und Liga (K16 §5.4)
function stabGehalt(r,q,lg){const G=RST.gehalt,b=(G.basis[lg]||G.basis[3])*(RST.rollen[r].gehalt||1);return Math.round(b*Math.exp(G.steigung*(q-10))/G.runden)*G.runden;}
let STAB_ID=1;
function stabNeu(r,q,team,lg){const id=S.stabId=(S.stabId||0)+1;return{id,r,n:rname(),q:clamp(Math.round(q),1,20),team,age:riA(RST.alter),ct:riA(RST.vertrag),sal:stabGehalt(r,q,lg||3),wiv:0};}
// Start (K16 §4.1): jeder Verein hat einen Stab nach seinem Ansehen, dazu vereinslose Mitarbeiter
function stabAufbau(){const A=RST.start;S.stab=[];S.stabId=0;
  S.teams.forEach(t=>{if(!aktiv(t))return;STAB_ROLLEN().filter(r=>r!=='scout'&&r!=='jugend').forEach(r=>{const ab=A.rolleAbAnsehen[r]||0;if(t.rep<ab&&!RST.rollen[r].pflicht)return;
      const n=r==='co'&&t.rep>=A.zweiterCoAb?2:1;for(let i=0;i<n;i++)S.stab.push(stabNeu(r,t.rep*A.qualitaetJeAnsehen+ri(A.streuung[0],A.streuung[1])-(i?2:0),t.id,t.lg));});});
  for(let i=0;i<RST.vereinslos;i++){const r=pick(STAB_ROLLEN().filter(r=>r!=='scout'&&r!=='jugend'));S.stab.push(stabNeu(r,riA(A.vereinslosQ),-1,2));}
  stabGeaendert();} // Scouts kommen mit eigenem Strom dazu (js/scouting.js, K18)
// Qualität, wie du sie siehst: eigene Mitarbeiter nach einigen Wochen genau, sonst als Spanne (K16 §3.2)
function stabQText(x){if(x.team===S.my&&(x.wiv||0)>=RST.genauNachWochen)return String(x.q);const u=RST.unschaerfe,h=(x.id*2654435761>>>0)%(2*u+1)-u,m=clamp(x.q+h,1,20);return`${clamp(m-u,1,20)}–${clamp(m+u,1,20)}`;}
// Woche: Zeit im Verein (für die genaue Qualität), Computer-Vereine besetzen den Co-Trainer nach, wenn er fehlt
function stabWoche(){(S.stab||[]).forEach(x=>{if(x.team>=0)x.wiv=(x.wiv||0)+1;});
  S.teams.forEach(t=>{if(!aktiv(t)||!stabMacht(t.id,'stab')||stabVon(t.id,'co').length)return;const neu=S.stab.filter(x=>x.team<0&&x.r==='co').sort((a,b)=>b.q-a.q)[0];if(neu){neu.team=t.id;neu.sal=stabGehalt('co',neu.q,t.lg);neu.ct=riA(RST.vertrag);stabGeaendert();if(t.id===S.my)stabMeldung(`Der Verein hat ${neu.n} als Co-Trainer eingestellt.`);}});}
// Neue Saison: Verträge laufen aus. Computer-Vereine verlängern meist, eigene Mitarbeiter gehen, wenn du nicht verlängert hast.
function stabSaison(){(S.stab||[]).forEach(x=>{x.age++;if(x.team<0)return;x.ct--;if(x.ct>0)return;
    if(stabMacht(x.team,'stab')&&R()<RST.verlaengern){x.ct=riA(RST.vertrag);if(x.team===S.my)stabMeldung(`Der Verein hat den Vertrag von ${RST.rollen[x.r].name} ${x.n} verlängert.`);return;}if(x.team===S.my)news(`${RST.rollen[x.r].name} ${x.n} verlässt den Verein (Vertrag ausgelaufen).`,'bad');x.team=-1;});
  /* Ex-Spieler ohne Job gehen nach exSpieler.freiSaisons und zählen beim Auffüllen nicht mit (K32c, Prüfung DP5) */
  S.stab=S.stab.filter(x=>x.team>=0||(x.age<RST.rente&&!(x.ex&&x.exS!=null&&S.season-x.exS>=RST.exSpieler.freiSaisons)));while(S.stab.filter(x=>x.team<0&&!x.ex).length<RST.vereinslos){const r=pick(STAB_ROLLEN());S.stab.push(stabNeu(r,riA(RST.start.vereinslosQ),-1,2));}stabGeaendert();auftraegeAufraeumen();}
// Einstellen bei deinem Verein (aktionen.js stabEinstellen, Karte „Ehemaliger Kapitän“ K16e): Gehalt nach deiner Liga, Vertrag RST.einstellenJahre, mit Meldung (Prüfung EP1)
function stabAnstellen(x){x.team=S.my;x.sal=stabGehalt(x.r,x.q,myT().lg);x.ct=RST.einstellenJahre;x.wiv=0;stabGeaendert();news(`${RST.rollen[x.r].name} ${x.n} kommt (${fmt(x.sal)} pro Jahr).`,'good');}
// Ex-Spieler im Stab (K32 §3.3b, K16 §10, K32c), Saisonwechsel nach dem Trainerpool (saison.js newSeasonLauf): Wer mit mindestens ab Ligaspielen aufhört und nicht gerade
// Trainer im Pool geworden ist, kommt mit chance als vereinsloser Mitarbeiter dazu. Eigener Strom je Spieler. Rückgabe: Zahl der neuen Mitarbeiter.
function stabExSpieler(abgaenge){if(!S.stab)return 0;const E=RST.exSpieler;let n=0;
  (abgaenge||[]).forEach(p=>{const a=statSumme(p);if(a.sp<E.ab||(S.trainer||[]).some(x=>x.ex&&x.n===p.n&&x.seit===S.season))return;
    mitStrom(strom('stab',S.season,'ex',p.id),()=>{if(R()>=E.chance)return;let r='torwart';
      if(p.pos!=='TW'){const W=E.rollen,ks=Object.keys(W);let z=R()*ks.reduce((s,k)=>s+W[k],0);r=ks[ks.length-1];for(const k of ks){z-=W[k];if(z<0){r=k;break;}}}
      const x=stabNeu(r,E.basis+a.sp/E.jeSpiele+(p.ehj!=null?E.ehrung:0)+ri(E.streuung[0],E.streuung[1]),-1,2);x.n=p.n;x.age=p.age;x.ex=a.sp;x.exS=S.season;
      /* Verein mit den meisten Spielen (K16e) */const top=Object.keys(a.ver).sort((u,v)=>a.ver[v]-a.ver[u])[0];if(top!=null){x.exV=+top;x.exVsp=a.ver[top];}S.stab.push(x);n++;
      if(a.ver[S.my])news(`${p.n} beendet seine Karriere und steht als ${RST.rollen[r].name} zur Verfügung (${a.sp} Ligaspiele).`);});});
  if(n)stabGeaendert();return n;}
// Trainerteam mitnehmen (K16 §5, §12 Nr. 4, K16b): beim Jobwechsel bis zu mitnehmen.max Mitarbeiter, die mindestens mitnehmen.wochen bei dir waren (wiv).
// Wahl in S.mitnehmen (Liste der Nummern, im Fenster der Jobangebote), takeJob zieht sie um. Beim neuen Verein Gehalt nach seiner Liga; ist die Rolle voll, geht der Schwächste dort.
const mitnehmbar=()=>(S.stab||[]).filter(x=>x.team===S.my&&(x.wiv||0)>=RST.mitnehmen.wochen);
function mitnehmenWahl(id,an){const l=(S.mitnehmen||[]).filter(x=>x!==id);if(an&&l.length<RST.mitnehmen.max&&mitnehmbar().some(x=>x.id===id))l.push(id);S.mitnehmen=l;save();showFired();}
function mitnehmenText(){const l=mitnehmbar();if(!l.length)return'';const w=S.mitnehmen||[];
  return`<div class="card"><h3>Trainerteam mitnehmen</h3><p class="dim">Bis zu ${RST.mitnehmen.max} Mitarbeiter, die mindestens ${RST.mitnehmen.wochen} Wochen bei dir waren, kommen mit. Beim neuen Verein gilt das Gehalt seiner Liga.</p><div class="form">${l.map(x=>`<label class="pick"><input type="checkbox" ${w.includes(x.id)?'checked':''} onchange="mitnehmenWahl(${x.id},this.checked)"> ${esc(RST.rollen[x.r].name)} ${esc(x.n)}</label>`).join('')}</div></div>`;}
// takeJob (saison.js), nach dem Wechsel von S.my: die gewählten Mitarbeiter des alten Vereins ziehen um. Rückgabe: Zahl.
// Seit Prüfung DU3: Mitgebrachte verdrängen sich nicht gegenseitig. DU4: Die übrigen Mitarbeiter des neuen Vereins beginnen bei 0 Wochen mit dir (wiv), so zählt „bei dir“ wirklich.
function stabMitnehmen(altId){const w=(S.mitnehmen||[]).slice(0,RST.mitnehmen.max);S.mitnehmen=null;if(!S.stab)return 0;const lg=myT().lg,mit=new Set();let n=0;
  w.forEach(id=>{const x=S.stab.find(y=>y.id===id&&y.team===altId&&(y.wiv||0)>=RST.mitnehmen.wochen);if(!x)return;
    const da=S.stab.filter(y=>y.team===S.my&&y.r===x.r&&!mit.has(y.id)).sort((a,b)=>a.q-b.q),voll=S.stab.filter(y=>y.team===S.my&&y.r===x.r).length>=RST.rollen[x.r].plaetze;
    if(voll&&da.length){da[0].team=-1;news(`${RST.rollen[x.r].name} ${da[0].n} muss bei ${myT().name} gehen, weil ${x.n} mitkommt.`);}
    x.team=S.my;x.sal=stabGehalt(x.r,x.q,lg);x.ct=Math.max(1,x.ct||1);delete x.streitBis;mit.add(x.id); /* Prüfung EZ4: der Streit bleibt beim alten Verein */n++;news(`${RST.rollen[x.r].name} ${x.n} kommt mit zu ${myT().name}.`,'good');});
  S.stab.forEach(y=>{if(y.team===S.my&&!mit.has(y.id))y.wiv=0;});stabGeaendert();return n;}
// Jobangebot per Karte (karten.js karteJobwechsel, ohne Fenster zur Wahl): die mitnehmbaren Co-Trainer kommen mit (Prüfung DU5)
function mitnehmenCoTrainer(){S.mitnehmen=mitnehmbar().filter(x=>x.r==='co').sort((a,b)=>b.q-a.q).slice(0,RST.mitnehmen.max).map(x=>x.id);}
// Gehälter des eigenen Stabs je Ligaspiel (wie die Spielergehälter)
const stabGehaelter=tid=>(S.stab||[]).filter(x=>x.team===tid).reduce((a,x)=>a+x.sal,0);

// ---------- Vorschlag des Co-Trainers (K16 §3.3, K16h) ----------
// Stufen je Bereich: selbst · Vorschlag · Automatik. Automatik ist die Lizenz-Automatik (K36, autoB). Machst du es selbst, zeigt der Co-Trainer im Modus Vorschlag
// (Voreinstellung) dort, wo du ohnehin hinschaust, was er anders machen würde: in der Aufstellung die beste Elf (bestXI, wie seine Automatik), im Trainingsplan die
// Vorlage, die er jetzt nähme (vorlageAuto). Ein Klick übernimmt (autoXI, setVorlage, mit den üblichen Lizenzprüfungen). Kein Halt, ohne Klick keine Wirkung.
// „Selbst“ blendet die Vorschläge aus: S.einst.vorschlagAus = {aufstellung:1, vorlage:1}. Ohne Zufall, ohne Rauschen nach Qualität (K16 §5.1 fehlt noch).
const vorschlagAn=b=>!(S.einst&&S.einst.vorschlagAus&&S.einst.vorschlagAus[b]);
function vorschlagSchalten(b,an){S.einst=S.einst||{aus:{}};const A=S.einst.vorschlagAus=S.einst.vorschlagAus||{};if(an)delete A[b];else A[b]=1;save();render();}
// Unterschied deiner Startelf zur besten Elf: wer neu hinein (rein), wer hinaus (raus), und wie viele Plätze sonst anders besetzt sind (getauscht)
function aufstellungVorschlag(){const t=myT(),xi=myXI(),b=bestXI(S.my,t.form),inXi=new Set(xi.filter(id=>id!=null)),inB=new Set(b.filter(id=>id!=null));
  const rein=b.filter(id=>id!=null&&!inXi.has(id)).map(id=>PIX.get(id)).filter(Boolean),raus=xi.filter(id=>id!=null&&!inB.has(id)).map(id=>PIX.get(id)).filter(Boolean);
  const getauscht=b.filter((id,i)=>id!=null&&inXi.has(id)&&xi[i]!==id).length;return{rein,raus,getauscht};}
function vorschlagAufstellungKarte(){if(autoB('aufstellung'))return'';
  if(!vorschlagAn('aufstellung'))return`<p class="dim"><button onclick="vorschlagSchalten('aufstellung',true)">Vorschläge des Co-Trainers zeigen</button></p>`;
  const v=aufstellungVorschlag(),n=x=>x.map(p=>esc(p.n)).join(', ');
  const text=v.rein.length?`Der Co-Trainer würde ${n(v.rein)} bringen, dafür ${v.raus.length?n(v.raus):'niemanden'} auf die Bank setzen.`:v.getauscht?`Der Co-Trainer würde dieselben Spieler aufstellen, aber ${v.getauscht} anders auf die Positionen verteilen.`:'';
  return`<div class="card"><h3>Vorschlag des Co-Trainers</h3>${text?`<p>${text}</p><div class="row"><button onclick="autoXI()"${lzAus('aufstellung')}>Vorschlag übernehmen</button>`:'<p class="dim">Er hätte dieselbe Elf aufgestellt.</p><div class="row">'}<button onclick="vorschlagSchalten('aufstellung',false)">Keine Vorschläge mehr</button></div></div>`;}
// Trainingsplan: die Vorlage, die der Co-Trainer heute nähme, wenn du eine feste gewählt hast und sie davon abweicht
function vorschlagVorlageText(t,akt){if(akt==='auto'||autoB('vorlage'))return'';
  if(!vorschlagAn('vorlage'))return`<p class="dim"><button onclick="vorschlagSchalten('vorlage',true)">Vorschläge des Co-Trainers zeigen</button></p>`;
  const k=vorlageAuto(spielAbstand(S.tag).get(S.my)||{},S.tag,t);if(k===akt)return'';const D=vorlageDef(k,t);if(!D)return'';
  return`<p>Der Co-Trainer würde jetzt „${esc(D.name)}“ nehmen. <button onclick="setVorlage('${k}')"${lzAus('vorlage')}>Übernehmen</button> <button onclick="vorschlagSchalten('vorlage',false)">Keine Vorschläge mehr</button></p>`;}
