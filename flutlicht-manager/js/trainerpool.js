// Trainerpool (K32 §3.3b, U18a): Cheftrainer der Computer-Vereine mit Namen, Ruf, Lieblingsstil und Alter, freie Trainer im Pool,
// Nachfolger aus dem Pool, Ruf zum Saisonende, ehemalige Spieler als Trainer. Dein Verein hat keinen Eintrag, der Trainer bist du.
// Im Spielstand: S.trainer = [{id, n, ruf, stil, alter, tid (Verein, sonst null), seit, st: [[Verein, von, bis]]}], am Verein t.chef = Kennung.
// Zufall nur in eigenen Strömen 'trainerpool' (Aufbau, neue Trainer, Ex-Spieler). Die Wahl des Nachfolgers ist fest.
function trainerS(){if(!S.trainer)mitStrom(strom('trainerpool','aufbau'),trainerAufbau);return S.trainer;}
function trainerNeu(ruf,tid){const A=RTP.aufbau,l=S.trainer;S.trainerId=(S.trainerId||0)+1;
  const x={id:S.trainerId,n:rname(),ruf:clamp(Math.round(ruf),0,100),stil:profilStil(),alter:riA(A.alter),tid:tid==null?null:tid,seit:S.season,st:[]};l.push(x);return x;}
function trainerAufbau(){const A=RTP.aufbau;S.trainer=[];
  S.teams.forEach(t=>{if(!aktiv(t)||t.id===S.my)return;const x=trainerNeu(t.rep+riA(A.streuung),t.id);if(t.stil)x.stil=t.stil;t.chef=x.id;});
  for(let k=0;k<A.pool;k++)trainerNeu(riA(A.poolRuf),null);}
const trainerVon=tid=>{if(tid==null||tid===S.my||tid<0||tid>=1000)return null;const t=S.teams[tid];if(!t)return null;const l=trainerS();return l.find(x=>x.id===t.chef)||null;};
const trainerName=tid=>tid===S.my?(S.mgr||'du'):(trainerVon(tid)||{n:`Trainer von ${tn(tid)}`}).n;
const trainerFrei=()=>trainerS().filter(x=>x.tid==null);
// Trainer verlässt seinen Verein (entlassen oder Platz für dich)
function trainerGeht(t,ruf){const x=trainerVon(t.id);t.chef=null;if(!x)return null;x.st.push([t.id,x.seit,S.season]);x.tid=null;x.seit=S.season;if(ruf)x.ruf=clamp(x.ruf+ruf,0,100);return x;}
// Nachfolger: freier Trainer, dessen Ruf am besten zum Ansehen passt (höchstens wechsel.ueber darüber), sonst ein neuer (eigener Strom)
function trainerKommt(t,ausser){const W=RTP.wechsel,l=trainerFrei().filter(x=>x!==ausser&&x.ruf<=t.rep+W.ueber);let x=null;
  l.forEach(y=>{if(!x||Math.abs(y.ruf-t.rep)<Math.abs(x.ruf-t.rep)||(Math.abs(y.ruf-t.rep)===Math.abs(x.ruf-t.rep)&&y.id<x.id))x=y;});
  if(!x)x=mitStrom(strom('trainerpool',S.season,S.tag,t.id),()=>trainerNeu(t.rep+riA(RTP.aufbau.streuung),null));
  x.tid=t.id;x.seit=S.season;t.chef=x.id;return x;}
// Trainerwechsel eines Computer-Vereins (computer.js kiTrainerWechsel): {alt, neu}
function trainerWechseln(t){trainerS();const alt=trainerGeht(t,RTP.wechsel.entlassen),neu=trainerKommt(t,alt);return{alt,neu};}
// Dein Jobwechsel (saison.js takeJob): Der Trainer des neuen Vereins geht, dein alter Verein holt einen aus dem Pool
function trainerJobwechsel(alt,neuId){trainerS();const t=S.teams[neuId];if(t)trainerGeht(t,0);if(alt&&aktiv(alt)&&alt.id!==neuId)trainerKommt(alt);}
// Saisonende (saison.js seasonEndLauf, nach der Statistik): Ruf nach Platz gegen Erwartung, Titel, Abstieg; freie vergessen; Alter
function trainerSaison(sm){const Q=RTP.saison;trainerS().forEach(x=>{const t=x.tid!=null?S.teams[x.tid]:null;
  if(t&&t.lastPos){let d=clamp((t.expPos||t.lastPos)-t.lastPos,-Q.platzMax/Q.jePlatz,Q.platzMax/Q.jePlatz)*Q.jePlatz;if([sm.champ,sm.champ2,sm.champ3].includes(t.id))d+=Q.meister;
    if([...sm.down,...sm.down2,...sm.down3].includes(t.id))d+=Q.abstieg;x.ruf=clamp(Math.round(x.ruf+d),0,100);}
  else if(x.tid==null)x.ruf=Math.round(x.ruf+(Q.mitte-x.ruf)*Q.vergessen);x.alter++;});}
// Echte Spieler (daten/spieler.js) werden keine Trainer: Trainer reden in Meldungen und Pressekonferenzen, dort gibt es keine echten Personen (K29 §12 Nr. 3)
let ECHTE_NAMEN=null;
function echterName(n){if(!ECHTE_NAMEN){ECHTE_NAMEN=new Set();Object.values(typeof KADER!=='undefined'?KADER:{}).forEach(l=>(l||[]).forEach(e=>ECHTE_NAMEN.add(Array.isArray(e)?e[0]:e&&e.n)));}return ECHTE_NAMEN.has(n);}
// Saisonwechsel (saison.js newSeasonLauf): Ruhestand freier Trainer, Ex-Spieler als Trainer, Trainer abgestiegener Vereine frei, Pool auffüllen
function trainerNeueSaison(abgaenge){const Q=RTP,E=Q.exSpieler;trainerS();S.trainer=S.trainer.filter(x=>x.tid!=null||x.alter<Q.saison.ruhestand);
  S.teams.forEach(t=>{if(!aktiv(t)&&t.chef!=null)trainerGeht(t,0);});
  (abgaenge||[]).forEach(p=>{if(echterName(p.n))return;const a=statSumme(p);if(a.sp<E.ab)return;mitStrom(strom('trainerpool',S.season,'ex',p.id),()=>{if(R()>=E.chance)return;
    const x=trainerNeu(E.basis+a.sp/E.jeSpiele+(p.ehj!=null?E.ehrung:0),null);x.n=p.n;x.alter=riA(E.alter);x.ex=1;});});
  const fehlt=Q.minPool-trainerFrei().length;if(fehlt>0)mitStrom(strom('trainerpool',S.season,'fuellen'),()=>{for(let k=0;k<fehlt;k++)trainerNeu(riA(Q.aufbau.poolRuf),null);});
  S.teams.forEach(t=>{if(aktiv(t)&&t.id!==S.my&&!trainerVon(t.id))trainerKommt(t);});}
