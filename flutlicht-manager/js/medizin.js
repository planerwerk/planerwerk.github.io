// Medizin (K10, Welle 2): Verletzungsarten mit Dauer, Ursachen (Foul, Zweikampf, Überlastung, Training, Krankheit), Verdacht und Diagnose als Spanne,
// Behandlung und Aufbautraining, Rückkehr mit Rückfallfenster, fit spritzen, früher zurückholen, Krankheiten mit Ansteckung.
// Die Verletzungen selbst entstehen in der Engine (js/engine.js) und im Training (js/training.js), hier werden sie angelegt und verwaltet.
const URSACHE={foul:'Foul',kollision:'Zweikampf',ueberlastung:'Überlastung',training:'Training',krankheit:'Krankheit'};
const PHASE={verdacht:'Untersuchung',behandlung:'Behandlung',aufbau:'Aufbautraining'};

// Risiko eines Spielers für alle Quellen (K10 §5.1): Robustheit, „verletzungsanfällig“, Saisonbelastung, Rückfallfenster
function robFaktor(p){const r=p.ch&&p.ch.rob!=null?p.ch.rob:10;return RMD.robustheit[0]+RMD.robustheit[1]*r;}
function rueckfallFaktor(p){const f=p.rf;return f&&absTag(S.tag)<=f.bis?1+f.w*RMD.reha.rueckfallMal:1;}
const verletzRisiko=p=>robFaktor(p)*(hatEig(p,'verletzungsanfaellig')?RMD.anfaellig:1)*belastungRisiko(p);
// Überlastung im Spiel: Frische unter 80 % je Punkt +5 %, unter 60 % doppelt, ab 30 Jahren ×1,3
function ueberlastFaktor(p,fr){const Q=RMD.risiko,f=fr==null?p.fit:fr;let x=f<Q.frischeAb?1+Q.frischeJePunkt*(Q.frischeAb-f):1;if(f<Q.frischeKritisch)x*=Q.kritisch;
  return x*(p.age>=Q.altAb?Q.alt:1)*rueckfallFaktor(p)*stabFaktor(p.team,'athletik');}

// Art würfeln nach Quelle: Kontakt (Foul, Zweikampf) zieht anteil × k, Überlastung anteil × (1 − k), Training anteil
function artFuer(q,p){const A=RMD.arten,R0=RMD.reha;if(q==='krankheit')return'krankheit';
  if(q!=='foul'&&q!=='kollision'&&p&&p.rf&&absTag(S.tag)<=p.rf.bis&&R()<R0.gleicheArt)return p.rf.art; // Rückfall: oft dieselbe Art
  const l=MED_ARTEN.filter(k=>A[k].anteil>0);return waehleArt(l,k=>A[k].anteil*(q==='training'?1:q==='ueberlastung'?1-A[k].k:A[k].k));}
const MED_ARTEN=Object.keys(RMD.arten);
function waehleArt(l,gew){const w=l.map(gew);let r=R()*w.reduce((a,b)=>a+b,0);for(let i=0;i<l.length;i++){if((r-=w[i])<=0)return l[i];}return l[l.length-1];}
const dauerFuer=art=>{const[a,b]=RMD.arten[art].tage;return Math.round(a+(b-a)*Math.pow(R(),RMD.schiefe));};

// Spanne der Rückkehr (K10 §5.2): Verdacht ±60 %, Diagnose ±25 %, mit Arzt (K16) enger. Die Spanne enthält immer die wahre Dauer.
function arztBreite(tid){const A=RMD.diagnose.arzt,q=tid>=0&&S.stab?stabQ(tid,'arzt'):10;return clamp(A.ohne+A.jeQualitaet*q,A.min,A.ohne);}
const diagnoseTage=tid=>{const[o,m]=RMD.diagnose.tage,q=tid>=0&&S.stab?stabQ(tid,'arzt'):10;return Math.round(o+(m-o)*q/20);};
function spanne(t,breite){return[Math.max(1,Math.round(t*(1-breite*R()))),Math.max(1,Math.round(t*(1+breite*R())))];}

// Verletzung oder Krankheit anlegen. Gibt die Verletzung zurück (oder null, wenn der Spieler schon ausfällt).
function verletzen(p,q,o={}){if(!p||p.team<0)return null;const art=o.art||artFuer(q,p),A=RMD.arten[art];
  let t=dauerFuer(art);if(q!=='krankheit')t=Math.max(1,Math.round(t*stabFaktor(p.team,'physio')));
  if(p.inj>0&&p.vl&&p.inj>=t)return null;const heute=absTag(S.tag),b=arztBreite(p.team),D=RMD.diagnose;
  p.inj=t+1; // Zähler läuft ab morgen herunter (wie bisher: w Wochen = die nächsten 7·w Tage)
  p.vl={art,q,ab:heute,t,dg:heute+(q==='krankheit'?0:diagnoseTage(p.team)),sv:spanne(t,D.verdacht*b),sd:spanne(t,D.genau*b)};
  p.spritze=null;if(q==='krankheit'){const tm=S.teams[p.team];if(tm)tm.krankBis=heute+RMD.krankheit.ansteckungTage;}
  verletzungZaehlen(p.team,q,t);
  if(p.team===S.my&&!o.still)news(q==='krankheit'?`${p.n} ist krank (${A.name}) und fällt einige Tage aus.`:`Verletzung (${URSACHE[q]}): ${p.n}, ${RMD.gruppen[A.g]}. Erste Einschätzung: ${spanneText(p.vl.sv)}.`,'bad');
  return p.vl;}
function verletzungZaehlen(tid,q,t){const s=(S.vstat=S.vstat||{})[tid]=(S.vstat[tid]||{n:0,tage:0,foul:0,kollision:0,ueberlastung:0,training:0,krankheit:0});s[q]=(s[q]||0)+1;if(q!=='krankheit'){s.n++;s.tage+=t;}}
const spanneText=([a,b])=>a===b?`${a} ${a===1?'Tag':'Tage'}`:b<=13?`${a}–${b} Tage`:`${Math.max(1,Math.round(a/7))}–${Math.max(1,Math.round(b/7))} Wochen`;
// Phase und angezeigte Spanne (ab Diagnose die genaue Art)
function verletzungInfo(p){const v=p.vl;if(!v||p.inj<=0)return null;const heute=absTag(S.tag),seit=heute-v.ab,diag=heute>=v.dg;
  const phase=!diag?'verdacht':seit<v.t*RMD.reha.behandlung?'behandlung':'aufbau',sp=diag?v.sd:v.sv,A=RMD.arten[v.art];
  return{phase,name:diag?A.name:RMD.gruppen[A.g],rest:[Math.max(0,sp[0]-seit),Math.max(1,sp[1]-seit)],art:v.art,q:v.q,spritzbar:!!A.spritzen,pflicht:!!A.pflicht};}
const verletzungText=p=>{const i=verletzungInfo(p);return i?`${i.name}, ${PHASE[i.phase]}, noch ${spanneText(i.rest)}`:'';};

// Rückkehr (K10 §5.3): nach längeren Ausfällen Frische 70–80 %, danach acht Wochen erhöhtes Rückfallrisiko bei Muskel- und Bandverletzungen
function medizinRueckkehr(p,frisch){const v=p.vl;if(!v)return;const A=RMD.arten[v.art],R0=RMD.reha,heute=absTag(S.tag);
  if(v.t>=R0.abTagen)p.fit=Math.min(p.fit,frisch!=null?frisch:riA(R0.rueckkehrFrische));
  if(A.rueckfall)p.rf={art:v.art,bis:heute+R0.fenster,w:A.rueckfall*(frisch!=null?RMD.frueher.rueckfall:1)};
  p.vh=[...(p.vh||[]).filter(x=>heute-x.ab<=RMD.verlaufTage),{art:v.art,q:v.q,ab:v.ab,t:v.t}];p.vl=null;p.spritze=null;
  if(p.team===S.my&&v.t>=R0.abTagen)news(`${p.n} ist nach ${A.name} zurück im Mannschaftstraining.`,'good');}

// Jeden Tag: Rückkehr, Krankheiten (im Winter doppelt, Ansteckung im Kader)
function medizinTag(d){const K=RMD.krankheit,heute=absTag(d),winter=K.winterMonate.includes(datumVon(d).getUTCMonth());
  S.pl.forEach(p=>{if(p.team<0)return;if(p.inj===0&&p.vl)medizinRueckkehr(p);});
  if(S.phase!=='play')return;
  S.pl.forEach(p=>{if(p.team<0||p.inj>0)return;const t=S.teams[p.team];if(!t||!aktiv(t)||sommerStatus(t)==='urlaub')return;
    if(R()<K.proTag*(winter?K.winter:1)*((t.krankBis||0)>=heute?K.ansteckung:1))verletzen(p,'krankheit');});}

// Fit spritzen (K10 §5.4): nur am Spieltag und nur bei Arten mit „ja“. Wirkung ×0,95, danach mit 15 % Verschlimmerung.
const gespritzt=p=>p.spritze===S.tag&&p.inj>0&&p.vl&&RMD.arten[p.vl.art].spritzen;
function nachSpritze(p){if(!gespritzt(p))return;p.spritze=null;const neu=RMD.verschlimmerung[p.vl.art],q0=p.vl.q;
  if(R()<RMD.spritzen.verschlimmerung){const alt=RMD.arten[p.vl.art].name;if(neu){const rest=p.inj;p.vl=null;verletzen(p,q0,{art:neu,still:true});p.inj=Math.max(p.inj,rest);}
    else p.inj+=7;if(p.team===S.my)news(`Die Spritze hat nicht gehalten: Bei ${p.n} ist aus der ${alt} mehr geworden (${verletzungText(p)||'länger verletzt'}).`,'bad');}}
// Computer-Vereine spritzen nur in wichtigen Spielen, und nur Stammspieler mit kurzer Verletzung (K10 §7)
function kiSpritzen(tid){if(tid>=1000||tid===S.my)return;const sq=squad(tid),elfter=(sq.map(p=>p.str).sort((a,b)=>b-a)[10])||0;
  sq.forEach(p=>{if(p.inj>0&&p.inj<=10&&p.vl&&RMD.arten[p.vl.art].spritzen&&p.str>=elfter){p.spritze=S.tag;p.spritzeAm=S.tag;}});}

// Saisonbilanz je Verein und Ligaschnitt (K10 §4)
function verletzungsBilanz(tid){const s=(S.vstat||{})[tid]||{n:0,tage:0},t=S.teams[tid],l=S.teams.filter(x=>x.lg===t.lg).map(x=>(S.vstat||{})[x.id]||{n:0,tage:0});
  return{n:s.n,tage:s.tage,krank:s.krankheit||0,schnittN:l.reduce((a,x)=>a+x.n,0)/Math.max(1,l.length),schnittTage:l.reduce((a,x)=>a+x.tage,0)/Math.max(1,l.length)};}
