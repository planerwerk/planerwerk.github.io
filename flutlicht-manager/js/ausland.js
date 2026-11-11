// Nationen und Auslandspool (Konzept K32 §3.1 und §3.2, U9b). Zahlen in daten/regeln.js unter REGELN.welt.nation und REGELN.welt.ausland.
// Das Ausland ist ein Pool erzeugter Spieler bei echten Auslandsvereinen (daten/ausland.js), ohne Spielplan und ohne echte Kader.
// Poolspieler liegen getrennt von den Ligaspielern in S.ausland.pl, damit alle Schleifen über S.pl (Training, Spieltag, Kabine) unberührt bleiben.
// PIX kennt beide. Ein Poolspieler hat alle Werte aus K03, sein Feld team ist die Kennung des Auslandsvereins (ab 2000).

// ---------- Nationen (K32 §3.2) ----------
let NAT_IX=null;
const nation=k=>{if(!NAT_IX)NAT_IX=new Map(NATIONEN.map(n=>[n[0],{k:n[0],name:n[1],rang:n[2],sprache:n[3]}]));return NAT_IX.get(k)||null;};
const natName=p=>{const n=nation(p.nat);return n?n.name:'unbekannt';};
// Landsleute und gemeinsame Sprache (K03 §3.4): abgeleitet, nicht gespeichert. Wirken erst mit Integration und Grüppchen (K03 §5.5, K14).
const landsleute=(a,b)=>!!a.nat&&a.nat===b.nat;
const gleicheSprache=(a,b)=>{const x=nation(a.nat),y=nation(b.nat);return !!x&&!!y&&x.sprache===y.sprache;};
// Nationalität eines erfundenen Spielers der deutschen Vereine: aus dem Nachnamen, fest je Spieler (Hash aus Seed und Nummer, kein Zufallsstrom)
let HERKUNFT_IX=null;
function natAusName(p){const N=RW.nation;if(!HERKUNFT_IX){HERKUNFT_IX=new Map();for(const k in NACHNAMEN_HERKUNFT)NACHNAMEN_HERKUNFT[k].split(' ').forEach(n=>HERKUNFT_IX.set(n,k));}
  const h=mix32(hash32('nat|'+S.seed+'|'+p.id),7),x=(h%1000)/1000,her=HERKUNFT_IX.get(last(p.n));
  if(her)return x<N.fremderName?her:N.heimat;return x<N.deutscherName?N.heimat:N.sonst[(h>>>12)%N.sonst.length];}

// ---------- Auslandsvereine und Poolspieler (K32 §3.1) ----------
const AV0=2000;                                    // Kennungen der Auslandsvereine beginnen hier (Amateure im Pokal: ab 1000)
const POOL_ID0=1000000;                            // Poolspieler haben einen eigenen Nummernkreis, damit neue Poolspieler die Nummern der Ligaspieler nicht verschieben
const istAusland=p=>p.team>=AV0;
const avVon=id=>S.ausland&&id>=AV0?S.ausland.v[id-AV0]||null:null;
const auslandSpieler=()=>S.ausland?S.ausland.pl:[];
const avKader=id=>auslandSpieler().filter(p=>p.team===id);
// Ländergruppe eines Auslandsvereins: das Land selbst oder Skandinavien und Osteuropa
const avGruppe=v=>AUSLAND_GRUPPE[v.land]||v.land;
const gruppenName=g=>AUSLAND_GRUPPEN[g]||(nation(g)?nation(g).name:g);
const auslandGruppen=()=>{const l=[];(S.ausland?S.ausland.v:[]).forEach(v=>{const g=avGruppe(v);if(!l.includes(g))l.push(g);});return l;};
// Teamstärke eines Auslandsvereins: der übrige Kader ist nur diese Zahl (für spätere Spiele im Europapokal, K37)
const avStaerke=v=>grundStaerke(v.rep);
// Verein eines beliebigen Spielers als Text
const vereinName=p=>istAusland(p)?(avVon(p.team)||{name:'Ausland'}).name:p.team>=0&&S.teams[p.team]?S.teams[p.team].name:'vereinslos';
// Ablöseforderung eines Auslandsvereins: Marktwert × Faktor nach Finanzkraft. Arme Vereine verkaufen günstiger, reiche teurer (K32 §6).
function auslandPreis(p){const v=avVon(p.team),F=RW.ausland.forderung;return Math.round(value(p)*(F[0]+F[1]*(v?v.fin:50)/100)/RM.runden)*RM.runden;}
const avBudget=v=>v.fin*v.fin*RW.ausland.budget;

// Namen nach Nation (daten/namen.js). Deutsche im Ausland: Vornamen der allgemeinen Liste und deutsche Nachnamen.
let NAMEN_IX=null,DE_NACHNAMEN=null;
function auslandName(nat){const k=NAMEN_NATION[nat];
  if(!k){if(nat!==RW.nation.heimat)return rname();if(!DE_NACHNAMEN){const fremd=new Set(Object.values(NACHNAMEN_HERKUNFT).join(' ').split(' '));DE_NACHNAMEN=NACHNAMEN.filter(n=>!fremd.has(n));}return pick(VORNAMEN)+' '+pick(DE_NACHNAMEN);}
  if(!NAMEN_IX)NAMEN_IX={};const N=NAMEN_IX[k]||(NAMEN_IX[k]={v:NAMEN[k].v.split(','),n:NAMEN[k].n.split(',')});return pick(N.v)+' '+pick(N.n);}
// Ein neuer Poolspieler für einen Auslandsverein. talent: junger Spieler mit Abschlag und hohem Talent, sonst Kernspieler um die Grundstärke.
function poolSpieler(v,pos,talent,namen){const A=RW.ausland,base=avStaerke(v);
  const nat=R()<A.einheimisch[v.stufe]?v.land:waehleGewichtet(A.legionaere);let n=auslandName(nat);for(let i=0;i<A.namenVersuche&&namen.has(n);i++)n=auslandName(nat);namen.add(n);
  const o=talent?{age:riA(A.talent.alter),str:Math.round(base-riA(A.talent.abschlag))}:{age:riA(A.alter),str:Math.round(base+riA(A.staerke))};
  const p=mkPlayer({id:S.ausland.pid++,n,pos,age:o.age,str:clamp(o.str,RT.staerkeMin,RT.staerkeMax),team:v.id,nat});
  // Talent (pot) hängt am Verein: Talente bekommen Grundstärke + pot, Kernspieler höchstens Grundstärke + potMax. Sonst wüchsen bei den Spitzenvereinen zu viele Weltstars heran.
  p.pot=clamp(talent?Math.round(base+riA(A.talent.pot)):Math.min(p.pot,Math.round(base+A.potMax)),Math.round(p.str),RT.staerkeMax);
  p.sp=talent?A.praxis.talent:A.praxis.stamm;p.fit=100;poolSchlank(p);return p;}
// Poolspieler ohne Buchführung der Ligen (Sperren, Karten, berechnete Eigenschaften): spart Platz im Spielstand, beim Wechsel nach Deutschland kommt sie zurück
function poolSchlank(p){delete p.eig;delete p.sperre;delete p.kt;}
const POOL_FELDER=['id','n','pos','age','str','pot','form','fit','ko','sv','sp','ent','sw','team','inj','g','pg','apps','ct','list','ask','seed','sal','ch','fp','fuss','mk','ls','wiv','vt','ekw','tf','nat','lf','fk'];
const istTalent=p=>p.age<=RW.ausland.talent.jungBis;
// Plan eines Kerns: feste Plätze für Talente (bis 21 Jahre), die übrigen Plätze nach Positionen, damit jeder Kern alle Mannschaftsteile hat
function kernPlan(v){const A=RW.ausland,soll=A.kern[v.stufe],talente=A.talente[v.stufe],platz={TW:0,AB:0,MF:0,ST:0};A.positionen.slice(0,soll-talente).forEach(x=>platz[x]++);return{soll,talente,platz};}
// Füllt den Kern eines Vereins nach Plan auf: Kernspieler je Position, dann Talente
function kernAuffuellen(v,kader,namen){const P=kernPlan(v),dazu=(pos,talent)=>{const p=poolSpieler(v,pos,talent,namen);kader.push(p);S.ausland.pl.push(p);PIX.set(p.id,p);};
  for(const pos in P.platz)for(let n=kader.filter(p=>!istTalent(p)&&p.pos===pos).length;n<P.platz[pos];n++)dazu(pos,false);
  for(let n=kader.filter(istTalent).length;n<P.talente;n++)dazu(pick(['AB','MF','ST']),true);}
// Zu viele Spieler im Kern (nach Zugängen oder weil ein Talent 22 wird): Je Position gehen die Schwächsten, bei den Talenten die mit dem geringsten Talent
function kernKuerzen(v,kader,weg){const P=kernPlan(v),raus=p=>{weg.add(p.id);kader.splice(kader.indexOf(p),1);};
  for(const pos in P.platz){const l=kader.filter(p=>!istTalent(p)&&p.pos===pos).sort((a,b)=>b.str-a.str);l.slice(P.platz[pos]).forEach(raus);}
  kader.filter(istTalent).sort((a,b)=>b.pot-a.pot).slice(P.talente).forEach(raus);}
// Aufbau beim Start der Welt (eigener Zufallsstrom, damit die übrige Welt gleich bleibt)
function auslandAufbau(){S.ausland={v:AUSLAND.map(([name,land,stufe,rep,fin],i)=>({id:AV0+i,name,land,stufe,rep,fin})),pl:[],pid:POOL_ID0};const namen=new Set();
  S.ausland.v.forEach(v=>kernAuffuellen(v,[],namen));
  // Vorlauf (REGELN.welt.ausland.vorlauf): einige Saisons in groben Schritten, damit Alter, Talente und Stärke im Gleichgewicht starten
  const L=RW.ausland.vorlauf;for(let j=0;j<L.saisons;j++){for(let w=0;w<L.schritte;w++)S.ausland.pl.forEach(p=>entwickeln(p,L.tage));auslandSaison();}
  S.ausland.pl.forEach(p=>{p.str=Math.round(p.str*100)/100;p.sw=Math.round(p.str);});}

// Woche (montags, eigener Strom): Form wandert zufällig um die Mitte, die Stärke entwickelt sich nach K03 mit angenommener Spielpraxis. Im Urlaub ruht die Entwicklung wie überall.
function auslandWoche(){if(!S.ausland||imUrlaub())return;const A=RW.ausland,F=RP.form;
  S.ausland.pl.forEach(p=>{p.form=Math.round(clamp(p.form+(R()-0.5)*2*A.formZufall+(F.mitte-p.form)*F.ausgleich,F.min,F.max)*100)/100;entwickeln(p,7);p.str=Math.round(p.str*100)/100;});} // zwei Nachkommastellen reichen und halten den Spielstand klein
// Saisonwechsel (K32 §4.1, eigener Strom): Alter, Karriereende, Abgänge aus dem Kern, Wechsel zu größeren Auslandsvereinen, neue Talente und Kernspieler
function auslandSaison(){if(!S.ausland)return;const A=RW.ausland,K=RS.karriereende,V=S.ausland.v,weg=new Set();
  S.ausland.pl.forEach(p=>{p.age++;p.form=RS.neuForm;p.sv=0;delete p.eig;const v=avVon(p.team),base=avStaerke(v); // Eigenschaften (Alter, Persönlichkeit) werden bei Bedarf neu berechnet
    if((p.age>=K.abAlter&&R()<(p.age-K.nullAlter)*K.jeJahr)||p.age>=K.spaetestens||(p.age>=A.rausAbAlter&&p.str<base-A.raus)||(p.age>=A.altRaus.ab&&R()<(p.age-A.altRaus.ab+1)*A.altRaus.jeJahr)){weg.add(p.id);return;}
    p.sp=istTalent(p)?A.praxis.talent:A.praxis.stamm;if(--p.ct<=0){p.ct=riA(RS.vertrag.jahre);p.sal=salaryFor(p.str);} // Spielpraxis nach Rolle, Vertrag verlängert mit neuem Gehalt
    if(p.str>base+A.aufstieg.ab&&R()<A.aufstieg.chance){const ziel=V.filter(x=>x.rep>v.rep&&avStaerke(x)>=p.str-A.aufstieg.fenster&&avStaerke(x)<=p.str+A.aufstieg.fenster);
      if(ziel.length){const z=pick(ziel);if((S.kenntnis||{})[p.id])news(`Wechsel im Ausland: ${p.n} geht von ${v.name} zu ${z.name}.`,'tr');p.team=z.id;}}});
  // Kern je Verein nach Plan: Überzählige gehen, Lücken werden gefüllt
  const nach=new Map(V.map(v=>[v.id,[]]));S.ausland.pl.forEach(p=>{if(!weg.has(p.id))nach.get(p.team).push(p);});
  V.forEach(v=>kernKuerzen(v,nach.get(v.id),weg));
  S.ausland.pl=S.ausland.pl.filter(p=>!weg.has(p.id));weg.forEach(id=>PIX.delete(id));
  const namen=new Set(S.ausland.pl.map(p=>p.n));V.forEach(v=>kernAuffuellen(v,nach.get(v.id),namen));}

// ---------- Wechsel zwischen Pool und Ligen ----------
// Ein Poolspieler kommt zu einem deutschen Verein: Er zieht in S.pl um und beginnt dort wie jeder Neuzugang.
function ausDemAusland(p,tid){const i=S.ausland.pl.indexOf(p);if(i>=0)S.ausland.pl.splice(i,1);if(!S.pl.includes(p))S.pl.push(p);
  p.team=tid;p.ent=S.tag;p.sw=Math.round(p.str);p.koVor=p.ko;p.sp=Math.min(p.sp,RW.ausland.praxis.stamm);
  if(!p.sperre)p.sperre={liga:{rot:0,gelb:0},pokal:{rot:0,gelb:0}};if(!p.kt)p.kt={liga:0,pokal:0};eigenschaftenNeu(p);}
// Ein Spieler wechselt zu einem Auslandsverein: Er zieht in den Pool um, alles Vereinsbezogene fällt weg.
function insAusland(p,avId){const i=S.pl.indexOf(p);if(i>=0)S.pl.splice(i,1);if(!S.ausland.pl.includes(p))S.ausland.pl.push(p);
  for(const k in p)if(!POOL_FELDER.includes(k))delete p[k]; // Stimmung, Rollen, Belastung, Verletzungsakte und alles andere Vereinsbezogene
  p.team=avId;p.list=0;p.ask=0;p.inj=0;p.ls=null;p.g=0;p.pg=0;p.apps=0;p.sv=0;p.sp=RW.ausland.praxis.stamm;p.fit=100;p.ct=riA(RM.neuerVertrag);p.sal=salaryFor(p.str);
  S.gw=(S.gw||[]).filter(g=>g.pid!==p.id);S.bz=(S.bz||[]).filter(b=>b[0]!==p.id&&b[1]!==p.id);(S.vs||[]).forEach(v=>{if(v.pid===p.id&&v.stand==='offen')v.stand='hinfaellig';});}
// Auslandsvereine, die für einen deiner Spieler bieten könnten: Er passt sportlich (höchstens einige Punkte unter der Grundstärke) und das Budget reicht (K32 §3.1)
function auslandKaeufer(p,preis){const A=RW.ausland;return(S.ausland?S.ausland.v:[]).filter(v=>p.str>=avStaerke(v)-A.angebote.niveau&&avBudget(v)>preis);}
