// Wettbewerbe und Spielplan (K13, Welle 2): Pokal-Auslosung mit Töpfen und Heimrecht für Amateure, Auslosung als Halt vor der Runde,
// Relegation mit Verlängerung und Elfmeterschießen, Supercup, Zweitmannschaften nie in der Liga der ersten Mannschaft.
// „Amateure“ im Sinne des DFB: 3. Liga und darunter (hier auch die Amateurklubs mit Nummer ab 1000).
const amateur=tid=>tid>=1000||S.teams[tid].lg>=3;

// Tag der Auslosung einer Pokalrunde: zwei Wochen vor der Runde, frühestens am Tag nach der Vorrunde
function pokalLosTag(r){const P=S.plan&&S.plan.pokal;if(!P||!P[r])return null;return Math.max(P[r][0]-RWB.pokal.auslosungTage,r>0?P[r-1][0]+1:0);}
// Auslosung (K13 §3.2). Runde 1: Profitopf (18 Erstligisten der Vorsaison und die 14 besten Zweitligisten) gegen Amateurtopf, Amateure zu Hause.
// Ab Runde 2 bis zum Halbfinale: Amateure gegen Profis zu Hause, die übrigen Paarungen aus einem Topf, der zuerst Gezogene hat Heimrecht. Finale neutral.
function pokalAuslosen(r){const al=shuffle(S.cup.alive.slice()),paare=[];
  if(r===0){const profi=al.filter(id=>id<1000&&(S.teams[id].lastLg===1||(S.teams[id].lastLg===2&&(S.teams[id].lastPos||99)<=RWB.pokal.profitopfZweite)));
    if(profi.length<al.length/2)al.filter(id=>id<1000&&!profi.includes(id)).sort((a,b)=>S.teams[a].lg-S.teams[b].lg||S.teams[b].rep-S.teams[a].rep).slice(0,al.length/2-profi.length).forEach(id=>profi.push(id));
    while(profi.length>al.length/2)profi.pop();const rest=al.filter(id=>!profi.includes(id));profi.forEach((p,i)=>paare.push([rest[i],p]));return paare;}
  const am=al.filter(amateur),pro=al.filter(id=>!amateur(id));
  if(r<=RWB.pokal.heimrechtBisRunde)while(am.length&&pro.length)paare.push([am.shift(),pro.shift()]);
  const rest=shuffle([...am,...pro]);for(let i=0;i<rest.length;i+=2)paare.push([rest[i],rest[i+1]]);return paare;}
// 72 Stunden (K13 §3.5): Nach der Auslosung verlegt die Liga Spiele, die weniger als drei Tage vor oder nach der Pokalrunde liegen (Sonntag → Samstag davor)
function pokalVerlegen(r,paare){const d=S.plan.pokal[r][0],M=RWB.spielplan.mindestTage,ids=new Set(paare.flat().filter(id=>id<1000));let n=0;
  LIGEN.forEach(lg=>(S.fx[lg]||[]).forEach((md,k)=>md.forEach(([h,a],i)=>{if(!ids.has(h)&&!ids.has(a))return;const z=S.plan.zeit[lg][k][i],alt=z[0];
    if(z[0]>d-M&&z[0]<d){z[0]=d-M;while(wochentag(z[0])===0||wochentag(z[0])===1)z[0]--;}else if(z[0]>d&&z[0]<d+M)z[0]=d+M;else return;n++;
    if(h===S.my||a===S.my)news(`Wegen des Pokals wird dein Ligaspiel gegen ${tn(h===S.my?a:h)} von ${datumKurz(alt)} auf ${datumKurz(z[0])} verlegt.`);})));
  if(n)TAGINDEX.plan=null;return n;}
function pokalAuslosungTag(d){if(S.phase!=='play'||!S.cup||S.cup.alive.length<2)return;const r=S.cup.hist.length,t=pokalLosTag(r);
  if(t==null||d<t||(S.cup.los&&S.cup.los.r===r))return;
  S.cup.los={r,am:d,paare:mitStrom(strom('pokallos',S.season,r),()=>pokalAuslosen(r))};pokalVerlegen(r,S.cup.los.paare);
  const m=S.cup.los.paare.find(x=>x.includes(S.my));
  if(m)news(`Auslosung DFB-Pokal, ${POKAL_RUNDEN[r]}: ${tn(m[0])} – ${tn(m[1])}${r===5?' im Finale in Berlin':m[0]===S.my?', ein Heimspiel':', auswärts'} am ${datumKurz(S.plan.pokal[r][0])}.`,'good');}
// Paarungen der Runde: aus der Auslosung, sonst jetzt losen (alte Spielstände)
function pokalPaare(r){if(!S.cup.los||S.cup.los.r!==r){S.cup.los={r,am:S.tag,paare:mitStrom(strom('pokallos',S.season,r),()=>pokalAuslosen(r))};pokalVerlegen(r,S.cup.los.paare);}return S.cup.los.paare;}
const pokalLosHeute=d=>S.phase==='play'&&S.cup&&S.cup.alive.includes(S.my)&&pokalLosTag(S.cup.hist.length)===d&&!(S.cup.los&&S.cup.los.r===S.cup.hist.length&&S.cup.los.am<d);

// Supercup (K13 §5.2): Meister gegen Pokalsieger am Samstag vor dem 1. Spieltag beim Meister. Holt ein Verein beides, spielt der Vizemeister.
// Bei Gleichstand direkt Elfmeterschießen (seit 2010 keine Verlängerung). In der ersten Saison gibt es keinen, weil die Vorsaison fehlt.
function supercupAnlegen(sm){S.supercup=null;if(!sm||sm.champ==null)return;const g=sm.cup!=null&&sm.cup!==sm.champ?sm.cup:sm.vize;if(g==null)return;
  const z=S.plan.zeit[1];if(!z||!z[0])return;let d=Math.min(...z[0].map(x=>x[0]))-RWB.supercup.vorSpieltag;while(wochentag(d)!==6)d--;
  // 72 Stunden (K13): Abstand zur ersten Pokalrunde und zu den Ligaspielen beider Teilnehmer. Ein Pokalsieger aus der 2. Liga hat da schon Spieltage, dann rückt der Supercup wochenweise vor.
  const M=RWB.spielplan.mindestTage,P=S.plan.pokal[0],belegt=new Set(P?[P[0]]:[]);
  [sm.champ,g].forEach(id=>{const lg=S.teams[id].lg,zl=S.plan.zeit[lg]||[];(S.fx[lg]||[]).forEach((md,k)=>md.forEach((f,i)=>{if((f[0]===id||f[1]===id)&&zl[k]&&zl[k][i])belegt.add(zl[k][i][0]);}));});
  const frei=x=>{for(let k=1-M;k<M;k++)if(belegt.has(x+k))return false;return true;};for(let n=0;n<8&&!frei(d);n++)d-=7;
  S.supercup={h:sm.champ,a:g,tag:d,min:minute(RWB.supercup.anstoss),r:null};}
const supercupAm=d=>S.supercup&&S.supercup.tag===d&&!S.supercup.r?S.supercup:null;

// Relegation (K13 §3.3): Hin- und Rückspiel, im Rückspiel bei Gleichstand nach beiden Spielen Verlängerung und Elfmeterschießen
function relegationSieger(sp,paar){const a=sp[0],b=sp[1];if(!a||!b)return null;const g0=a.ag+b.hg,g1=a.hg+b.ag; // paar[0] spielt das Hinspiel auswärts
  return g0>g1?paar[0]:g1>g0?paar[1]:b.pen?(b.pen[0]>b.pen[1]?b.h:b.a):null;}

// Zweitmannschaften (K13 §3.7): nie in der Liga der ersten Mannschaft. Muss eine runter, bleibt der beste Absteiger dieser Liga drin.
function zweiteRegeln(){const out=[];S.teams.forEach(t=>{if(t.zweite<0)return;const erste=S.teams[t.zweite];if(!erste||erste.lg!==t.lg||t.lg>3)return;
  const lg=t.lg;t.lg=lg+1;out.push(t.id);const ret=S.teams.filter(x=>x.lg===lg+1&&x.lastLg===lg&&x.id!==t.id&&x.zweite<0).sort((a,b)=>(a.lastPos||99)-(b.lastPos||99))[0];
  if(ret){ret.lg=lg;if(ret.id===S.my)news(`${t.name} muss wegen der ersten Mannschaft absteigen. Dein Verein bleibt deshalb in der ${ligaName(lg)}!`,'good');}
  if(t.id===S.my)news(`Deine Mannschaft muss absteigen, weil die erste Mannschaft (${erste.name}) jetzt in derselben Liga spielt.`,'bad');});return out;}
