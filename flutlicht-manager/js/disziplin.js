// Disziplin und Sportgericht (K09, Welle 2): Schiedsrichter mit Strenge, Sperren getrennt nach Liga und Pokal,
// Gelbsperren nach der 5., 10. und 15. Gelben, Verfahren nach Roter Karte mit Antrag, Frist, Einspruch und Urteil, Wiederholungstäter.
// Die Karten selbst fallen in der Engine (js/engine.js, foul und unsportlich), mit den Werten aus REGELN.disziplin.
const VERGEHEN={notbremse:'Notbremse',grob:'grobes Foulspiel',unsportlich:'Unsportlichkeit gegen den Schiedsrichter',taetlichkeit:'Tätlichkeit',schwer:'schwere Tätlichkeit'};
const WETTBEWERBE=['liga','pokal'],WB_NAME={liga:'Liga',pokal:'Pokal'},WB_SPIEL={liga:'Ligaspiel',pokal:'Pokalspiel'};
const AUSGANG={bestaetigt:'bestätigt',gemindert:'gemindert',erhoeht:'erhöht',angenommen:'angenommen'};
const wbVon=r=>r&&(r.cup||r.supercup)?'pokal':'liga'; // Relegation zählt zur Liga (K09 §12 Nr. 3), der Supercup zum Pokal (K13)
const absTag=d=>Math.round(saisonNull(S.season)/TAG_MS)+d;

// Sperren je Wettbewerb: rot (Rot und Gelb-Rot, läuft in die nächste Saison weiter) und gelb (Gelbsperre, verfällt am Saisonende).
// Alte Spielstände hatten p.sus (alle Wettbewerbe zusammen) und p.yc: beim ersten Zugriff übernommen.
function sperren(p){if(!p.sperre){p.sperre={liga:{rot:p.sus||0,gelb:0},pokal:{rot:0,gelb:0}};delete p.sus;}return p.sperre;}
function gelbe(p){if(!p.kt){p.kt={liga:p.yc||0,pokal:0};delete p.yc;}return p.kt;}
const sperreIn=(p,wb)=>{const s=p.sperre&&p.sperre[wb];return s?s.rot+s.gelb:p.sperre||wb!=='liga'?0:p.sus||0;}; // im Testspiel (wb 'test') gibt es keine Sperren
const verfahrenVon=(p,wb)=>(S.verfahren||[]).find(v=>v.pid===p.id&&(!wb||v.wb===wb));

// Für welchen Wettbewerb gerade aufgestellt wird. In der Engine gesetzt, sonst gilt das nächste eigene Spiel (Ansichten, Aufstellung).
let WB=null,WB_NAECHST={k:null,wb:'liga'};
function naechsterWb(){if(!S.plan)return'liga';const k=S.season+'/'+S.tag+'/'+S.gespielt+'/'+S.cup.hist.length;
  if(WB_NAECHST.k!==k){const e=S.phase==='play'?naechstesSpiel(S.gespielt===S.tag?S.tag+1:S.tag):null;WB_NAECHST={k,wb:e&&e.art==='pokal'?'pokal':'liga'};}return WB_NAECHST.wb;}
const gesperrt=(p,wb)=>sperreIn(p,wb||WB||(p.team===S.my?naechsterWb():'liga'))>0;
function mitWettbewerb(wb,fn){const alt=WB;WB=wb;try{return fn();}finally{WB=alt;}}

// Schiedsrichter (K09 §3.3): erfundener Pool je Liga mit Strenge (Karten) und Elfmeterneigung. Angesetzt aus dem Spiel-Hash.
function schiriAufbau(){const Q=RD.schiri,f=([a,b])=>Math.round((a+R()*(b-a))*100)/100;S.schiri={};
  LIGEN.forEach(lg=>{S.schiri[lg]=Array.from({length:Q.proLiga},()=>({n:rname(),st:f(Q.strenge),el:f(Q.elfmeter)}));});}
function schiriFuer(hid,aid,hs){if(!S.schiri)mitStrom(strom('schiri'),schiriAufbau);
  const t=hid<1000?S.teams[hid]:aid<1000?S.teams[aid]:null,pool=S.schiri[clamp(t?t.lg:3,1,3)];return pool[mix32(hs,0x5c)%pool.length];}
const schiriText=x=>`${x.n} (${x.st>=1.07?'streng':x.st<=0.93?'großzügig':'normal'})`;

// Nach dem Abpfiff: Gelbe zählen, Gelb-Rot sperrt ein Spiel, Rot sperrt vorläufig und eröffnet ein Verfahren.
function disziplinNachSpiel(r){const wb=wbVon(r),D=RD,G=D.gelbsperre[wb],mein=id=>{const p=PIX.get(id);return p&&p.team===S.my;};
  const gr=new Set(r.ev.filter(e=>e.t==='R'&&e.gy).map(e=>e.p));
  r.yel.forEach(id=>{if(gr.has(id))return; // die Gelbe vor Gelb-Rot zählt nicht mit (K09 §12 Nr. 7, vorläufig)
    const p=PIX.get(id);if(!p)return;const k=gelbe(p);k[wb]=(k[wb]||0)+1;
    if(G.includes(k[wb])){sperren(p)[wb].gelb+=D.gelbsperre.spiele;if(mein(id))news(`${p.n} sieht die ${k[wb]}. Gelbe Karte im ${wb==='liga'?'Ligabetrieb':'Pokal'} und fehlt im nächsten ${WB_SPIEL[wb]}.`,'bad');}
    if(k[wb]>=G[G.length-1])k[wb]=0;});
  r.ev.forEach(e=>{if(e.t!=='R'||e.p==null)return;const p=PIX.get(e.p);if(!p)return;const s=sperren(p)[wb];
    if(e.gy){s.rot+=D.gelbRot;if(mein(e.p))news(`Gelb-Rot: ${p.n} fehlt im nächsten ${WB_SPIEL[wb]}.`,'bad');return;}
    const offen=verfahrenVon(p,wb);if(offen){offen.art=schwerer(offen.art,e.art);return;} // zweite Rote vor dem Urteil: ein Verfahren
    s.rot+=1;const tag=S.tag,vor=(p.vg||[]).filter(t=>absTag(tag)-t<=D.rot.wiederholungTage).length;
    p.vg=[...(p.vg||[]).filter(t=>absTag(tag)-t<=D.rot.wiederholungTage),absTag(tag)];
    const o=e.opfer!=null?PIX.get(e.opfer):null,folge=!!(o&&o.vl&&o.vl.t>=D.rot.verletzungAbTagen); // Verletzungsfolge beim Gegner (K09 §5.2, K10)
    S.verfahrenId=(S.verfahrenId||0)+1;(S.verfahren=S.verfahren||[]).push({id:S.verfahrenId,pid:p.id,team:p.team,wb,art:e.art||'grob',tag,antragAm:tag+riA(D.verfahren.antragTage),stand:'offen',gesessen:0,vor,folge});
    if(mein(e.p))news(`Rote Karte für ${p.n} (${VERGEHEN[e.art||'grob']}): vorläufig gesperrt. Der Kontrollausschuss beantragt in ein bis zwei Tagen eine Strafe.`,'bad');});}
const schwerer=(a,b)=>{const o=['notbremse','grob','unsportlich','taetlichkeit','schwer'];return o.indexOf(b)>o.indexOf(a)?b:a;};

// Sperren absitzen: wbs enthält "Verein:Wettbewerb" für jedes heutige Spiel. Während eines Verfahrens bleibt die vorläufige Sperre stehen.
function sperrenAbsitzen(wbs){S.pl.forEach(p=>{if(p.team<0||(!p.sperre&&!(p.sus>0)))return;const sp=sperren(p);
  WETTBEWERBE.forEach(wb=>{if(!wbs.has(p.team+':'+wb))return;const s=sp[wb];if(s.rot+s.gelb<=0)return;const v=verfahrenVon(p,wb);
    if(v&&v.stand!=='erledigt'){if(s.gelb>0)s.gelb--;else{v.gesessen++;if(s.rot>1)s.rot--;}return;}
    if(s.rot>0)s.rot--;else s.gelb--;});});}

// Strafmaß (K09 §5.2): Grundstrafe + Wiederholungstäter + Zufall (−1 bis +1), in der Spanne des Vergehens
function antragFuer(v){const[g,a,b]=RD.rot[v.art]||RD.rot.grob;return clamp(g+v.vor*RD.rot.wiederholung+(v.folge?RD.rot.verletzung:0)+ri(-1,1)*RD.rot.zufall,a,b);}
const einspruchLage=v=>v.art==='taetlichkeit'||v.art==='schwer'?'eindeutig':v.vor===0?'hart':'normal';
function sgUrteil(v,n,ausgang,d){const p=PIX.get(v.pid);if(p){const s=sperren(p)[v.wb];s.rot=Math.max(0,s.rot-1)+Math.max(0,n-v.gesessen);}
  v.urteil=n;v.ausgang=ausgang;v.am=d;v.stand='erledigt';
  (S.sgArchiv=S.sgArchiv||[]).unshift({pid:v.pid,n:p?p.n:'?',team:v.team,wb:v.wb,art:v.art,tag:v.tag,antrag:v.antrag,urteil:n,ausgang,am:d,einspruch:!!v.einspruch});
  S.sgArchiv.length=Math.min(S.sgArchiv.length,RD.verfahren.archiv);
  if(p&&p.team===S.my){const rest=sperreIn(p,v.wb);news(`Sportgericht: ${p.n} ist für ${n} ${WB_SPIEL[v.wb]}${n===1?'':'e'} gesperrt (${VERGEHEN[v.art]}, ${AUSGANG[ausgang]}).${rest?` Noch ${rest} offen.`:' Die Sperre ist schon abgesessen.'}`,ausgang==='gemindert'?'good':'bad');}}
function sgAnnehmenLauf(v,d){sgUrteil(v,v.antrag,'angenommen',d);}
function sgEinspruchLauf(v,d){const E=RD.einspruch;v.einspruch=true;v.stand='einspruch';v.kosten=riA(E.kosten);
  v.urteilAm=Math.min(v.tag+RD.verfahren.urteilSpaetestens,d+riA(RD.verfahren.urteilTage));
  if(v.team===S.my&&PIX.get(v.pid)&&PIX.get(v.pid).team===S.my)money('Sportgericht',-v.kosten);}
function sgEntscheiden(v,d){const E=RD.einspruch,L=E[einspruchLage(v)]||E,r=R(),[,a,b]=RD.rot[v.art]||RD.rot.grob;
  let n=v.antrag;if(r<L.gemindert)n=Math.max(1,Math.max(a,n-1));else if(r<L.gemindert+L.erhoeht)n=Math.min(b,n+1);
  sgUrteil(v,n,n<v.antrag?'gemindert':n>v.antrag?'erhoeht':'bestaetigt',d);}
// Computer-Vereine (K09 §7): Einspruch eher bei harter Entscheidung und wichtigem Spieler, nie bei nur einem Spiel
function kiEinspruch(v,p){if(v.antrag<2)return false;const t=S.teams[p.team],xi=t?bestXI(t.id,t.form).includes(p.id):false;
  return R()<(xi&&einspruchLage(v)==='hart'?RD.ki.einspruchWichtig:RD.ki.einspruchSonst);}

// Jeden Tag: Anträge stellen, Fristen ablaufen lassen, Urteile sprechen
function sportgerichtTag(d){if(!S.verfahren||!S.verfahren.length)return;
  S.verfahren.forEach(v=>{const p=PIX.get(v.pid);if(!p){v.stand='erledigt';return;}const mein=p.team===S.my;
    if(v.stand==='offen'&&d>=v.antragAm){v.antrag=antragFuer(v);v.frist=d+RD.verfahren.frist;v.stand='antrag';
      if(mein)news(`Sportgericht: Der Kontrollausschuss beantragt ${v.antrag} ${WB_SPIEL[v.wb]}${v.antrag===1?'':'e'} Sperre für ${p.n} (${VERGEHEN[v.art]}${v.vor?`, ${v.vor}. Rote Karte in zwölf Monaten`:''}). Annehmen oder Einspruch bis ${datumKurz(v.frist)}, im Büro.`,'bad');
      else if(kiEinspruch(v,p))sgEinspruchLauf(v,d);}
    else if(v.stand==='antrag'&&d>v.frist)sgAnnehmenLauf(v,d); // ohne Antwort gilt Zustimmung
    else if(v.stand==='einspruch'&&d>=v.urteilAm)sgEntscheiden(v,d);});
  S.verfahren=S.verfahren.filter(v=>v.stand!=='erledigt');}
const meineVerfahren=()=>(S.verfahren||[]).filter(v=>{const p=PIX.get(v.pid);return p&&p.team===S.my;});

// Saisonwechsel: Gelbe Karten und Gelbsperren verfallen, Rot- und Gelb-Rot-Sperren laufen weiter (K09 §3.2, auch im Pokal)
function disziplinSaison(p){if(p.kt)p.kt={liga:0,pokal:0};else delete p.yc;if(p.sperre)WETTBEWERBE.forEach(wb=>{p.sperre[wb].gelb=0;});}
