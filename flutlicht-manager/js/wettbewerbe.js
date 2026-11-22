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
function pokalVerlegen(r,paare){const d=S.plan.pokal[r][0],ids=spaet=>new Set(paare.filter(p=>pokalSpaetIst(r,p[0])===spaet).flat().filter(id=>id<1000));
  return ligaVerlegen(d,ids(false),'des Pokals')+ligaVerlegen(d+1,ids(true),'des Pokals');}
// Pokal am zweiten Tag (T8.2, wie beim DFB): Wer in den fünf Tagen vor der Runde im Europapokal spielt, spielt den Pokal einen Tag später (Dienstag → Mittwoch,
// in der 1. Runde Samstag → Sonntag), mit seinem Gegner. Sonst passt zwischen Donnerstag und Dienstag kein Ligaspiel mit drei Tagen Abstand.
// S.cup.spaet[Runde] = Vereine dieser Paarungen, bleibt die ganze Saison stehen (Kalender, Ergebnisse).
function pokalSpaet(r,paare){if(r>=5||!S.plan.pokal[r])return[];const d=S.plan.pokal[r][0];return paare.filter(p=>p.some(id=>id<1000&&euTageVon(id).some(x=>x<d&&x>=d-5))).flat();}
const pokalSpaetIst=(r,id)=>!!(S.cup&&S.cup.spaet&&(S.cup.spaet[r]||[]).includes(id));
const pokalGeteilt=r=>!!(S.cup&&S.cup.spaet&&(S.cup.spaet[r]||[]).length);
const pokalPaareAm=e=>pokalPaare(e.r).filter(p=>pokalSpaetIst(e.r,p[0])===!!e.spaet);
const pokalMeinTag=e=>pokalSpaetIst(e.r,S.my)===!!e.spaet;
// Ligaspiele der Vereine ids, die weniger als drei Tage vor oder nach Tag d liegen, verlegen (Pokal, seit K37 auch Europapokal).
// Seit T5.2: Der neue Tag muss für beide Vereine drei Tage Abstand zu allen ihren übrigen Spielen haben (Liga, Pokal, Supercup, Europapokal). Kandidaten der Reihe nach,
// zuerst in Richtung des alten Termins, nie auf einen Montag (Montag abends vor Donnerstag wären keine 72 Stunden). Passt keiner, gilt die alte Regel (Sonntag und Montag vor dem Termin → Samstag, danach → drei Tage später).
function ligaVerlegen(d,ids,grund){const M=RWB.spielplan.mindestTage;let n=0;
  LIGEN.forEach(lg=>(S.fx[lg]||[]).forEach((md,k)=>md.forEach(([h,a],i)=>{if(!ids.has(h)&&!ids.has(a))return;const z=S.plan.zeit[lg][k][i],alt=z[0];
    if(!(z[0]>d-M&&z[0]<d+M))return;const vor=z[0]<d,belegt=[spieltageVon(h,z),spieltageVon(a,z)];[h,a].forEach((id,j)=>{if(ids.has(id))belegt[j].add(d);});
    const frei=x=>belegt.every(s=>{for(let j=1-M;j<M;j++)if(s.has(x+j))return false;return true;}),kand=(vor?[d-M,d-M-1,d-M-2,d+M,d+M+1]:[d+M,d+M+1,d+M+2,d-M,d-M-1]).filter(x=>wochentag(x)!==1);
    const neu=kand.find(frei);if(neu!=null)z[0]=neu;else if(vor){z[0]=d-M;while(wochentag(z[0])===0||wochentag(z[0])===1)z[0]--;}else z[0]=d+M;n++;
    if(h===S.my||a===S.my)news(`Wegen ${grund} wird dein Ligaspiel gegen ${tn(h===S.my?a:h)} von ${datumKurz(alt)} auf ${datumKurz(z[0])} verlegt.`);})));
  if(n)TAGINDEX.plan=null;return n;}
// ---------- Spielverlegung auf Antrag (K13 §13, K13d) ----------
// Lage für dein nächstes Ligaspiel in höchstens RWB.verlegung.vorTage Tagen (ab morgen, auch wenn vorher ein Pokal- oder Europapokalspiel kommt, Prüfung EI4): n einsatzfähige Spieler (nicht verletzt oder krank, nicht in der Liga gesperrt), tw: ein Torwart dabei,
// grund: weniger als minSpieler oder kein Torwart. Ohne solches Spiel null.
function verlegungLage(){const V=RWB.verlegung;let e=null;for(let d=S.tag+1;d<=S.tag+V.vorTage&&!e;d++){const x=meinSpiel(d);if(x&&x.art==='liga'&&x.i!=null)e=x;}if(!e)return null;
  const ok=squad(S.my).filter(p=>!(p.inj>0)&&!(sperreIn(p,'liga')>0)),tw=ok.some(p=>p.pos==='TW');return{e,n:ok.length,tw,grund:ok.length<V.minSpieler||!tw};}
// Neuer Termin: der erste Tag ab dem alten + mindestTage, an dem beide Vereine mindestTage Abstand zu allen ihren Spielen haben, kein Montag,
// bis sucheTage später, vor dem nächsten Ligaspiel beider Vereine (sonst stimmt die Reihenfolge der Spieltage nicht mehr, Prüfung EI3) und vor dem letzten Spieltag,
// nicht an einem Tag mit deinem Testspiel in der Nähe (EI4). Sonst null.
function verlegungTag(e){const M=RWB.spielplan.mindestTage,V=RWB.verlegung,Z=S.plan.zeit[e.lg],z=Z[e.md][e.i],[h,a]=S.fx[e.lg][e.md][e.i],belegt=[spieltageVon(h,z),spieltageVon(a,z)];
  const letzter=Math.min(...Z[Z.length-1].map(x=>x[0])),ts=(S.testspiele||[]).filter(t=>t.stand!=='abgesagt').map(t=>t.tag),
    weiter=Math.min(Infinity,...[h,a].map(id=>{let m=Infinity;S.fx[e.lg].forEach((md,k)=>{if(k<=e.md)return;md.forEach(([x,y],i)=>{if(x===id||y===id)m=Math.min(m,Z[k][i][0]);});});return m;})),frei=x=>belegt.every(s=>{for(let j=1-M;j<M;j++)if(s.has(x+j))return false;return true;})&&ts.every(t=>Math.abs(t-x)>=M);
  for(let x=z[0]+M;x<=z[0]+V.sucheTage&&x<letzter&&x<=weiter-M;x++)if(wochentag(x)!==1&&frei(x))return x;return null;}
// Antrag: Rückgabe null (verlegt, mit Meldung) oder der Grund der Ablehnung. Höchstens proSaison je Saison (S.verlegt = {Saison: Zahl}).
function spielVerlegenLauf(){const V=RWB.verlegung,l=verlegungLage();if(!l)return'In den nächsten Tagen hast du kein Ligaspiel.';
  if(!l.grund)return`Die Liga lehnt ab: ${l.n} Spieler sind einsatzfähig, darunter ein Torwart.`;if(((S.verlegt||{})[S.season]||0)>=V.proSaison)return'In dieser Saison hast du schon eine Verlegung bekommen.';
  const x=verlegungTag(l.e);if(x==null)return'Die Liga findet keinen Ersatztermin.';const z=S.plan.zeit[l.e.lg][l.e.md][l.e.i],alt=z[0],[h,a]=S.fx[l.e.lg][l.e.md][l.e.i];
  z[0]=x;TAGINDEX.plan=null;S.verlegt=Object.assign({},S.verlegt,{[S.season]:((S.verlegt||{})[S.season]||0)+1});
  news(`Spielverlegung: Die Liga verlegt dein Spiel gegen ${tn(h===S.my?a:h)} vom ${datumKurz(alt)} auf den ${datumKurz(x)}.`,'good');return null;}
// Karte im Büro, nur wenn ein Antrag Aussicht hat
function verlegungKarte(){if(S.fired||S.phase!=='play')return'';const l=verlegungLage();if(!l||!l.grund||((S.verlegt||{})[S.season]||0)>=RWB.verlegung.proSaison)return'';
  return`<div class="card"><h3>Spielverlegung</h3><p>Für das Spiel am ${datumKurz(l.e.tag)} sind nur ${l.n} Spieler einsatzfähig${l.tw?'':', kein Torwart'}. Die Liga verlegt, wenn weniger als ${RWB.verlegung.minSpieler} Spieler mit einem Torwart bereitstehen, höchstens ${RWB.verlegung.proSaison}-mal je Saison.</p>
    <button onclick="spielVerlegen()"${lzAus('verlegung')}>Verlegung beantragen</button>${lzHinweis('verlegung')}</div>`;}
// Tage, an denen ein Verein schon spielt (Liga ohne das Spiel ohne, Pokal solange er dabei ist, Supercup, Europapokal)
function spieltageVon(tid,ohne){const s=new Set(),t=tid<1000?S.teams[tid]:null;if(!t)return s;const lg=t.lg,Z=S.plan.zeit[lg]||[];
  (S.fx[lg]||[]).forEach((md,k)=>md.forEach(([h,a],i)=>{const z=Z[k]&&Z[k][i];if(z&&z!==ohne&&(h===tid||a===tid))s.add(z[0]);}));
  if(S.cup&&S.cup.alive.includes(tid))S.plan.pokal.forEach(([x],r)=>{if(r>=S.cup.hist.length)s.add(x+(pokalSpaetIst(r,tid)?1:0));});
  if(S.supercup&&!S.supercup.r&&(S.supercup.h===tid||S.supercup.a===tid))s.add(S.supercup.tag);
  euTageVon(tid).forEach(x=>s.add(x));return s;}
function pokalAuslosungTag(d){if(S.phase!=='play'||!S.cup||S.cup.alive.length<2)return;const r=S.cup.hist.length,t=pokalLosTag(r);
  if(t==null||d<t||(S.cup.los&&S.cup.los.r===r))return;
  S.cup.los={r,am:d,paare:mitStrom(strom('pokallos',S.season,r),()=>pokalAuslosen(r))};pokalLosDesJahres(S.cup.los.paare,r);(S.cup.spaet=S.cup.spaet||{})[r]=pokalSpaet(r,S.cup.los.paare);pokalVerlegen(r,S.cup.los.paare);
  const m=S.cup.los.paare.find(x=>x.includes(S.my));
  if(m)news(`Auslosung DFB-Pokal, ${POKAL_RUNDEN[r]}: ${tn(m[0])} – ${tn(m[1])}${r===5?' im Finale in Berlin':m[0]===S.my?', ein Heimspiel':', auswärts'} am ${datumKurz(S.plan.pokal[r][0]+(pokalSpaetIst(r,S.my)?1:0))}${pokalSpaetIst(r,S.my)?' (einen Tag später wegen des Europapokals)':''}.`,'good');}
// Paarungen der Runde: aus der Auslosung, sonst jetzt losen (alte Spielstände)
function pokalPaare(r){if(!S.cup.los||S.cup.los.r!==r){S.cup.los={r,am:S.tag,paare:mitStrom(strom('pokallos',S.season,r),()=>pokalAuslosen(r))};pokalVerlegen(r,S.cup.los.paare);}return S.cup.los.paare;}
const pokalLosHeute=d=>S.phase==='play'&&S.cup&&S.cup.alive.includes(S.my)&&pokalLosTag(S.cup.hist.length)===d&&!(S.cup.los&&S.cup.los.r===S.cup.hist.length&&S.cup.los.am<d);

// Supercup (K13 §5.2): Meister gegen Pokalsieger am Samstag vor dem 1. Spieltag beim Meister. Holt ein Verein beides, spielt der Vizemeister.
// Bei Gleichstand direkt Elfmeterschießen (seit 2010 keine Verlängerung). In der ersten Saison gibt es keinen, weil die Vorsaison fehlt.
function supercupAnlegen(sm){S.supercup=null;if(!sm||sm.champ==null)return;const g=sm.cup!=null&&sm.cup<1000&&sm.cup!==sm.champ?sm.cup:sm.vize;if(g==null)return;
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

// Prämien des Supercups (K13 §12 Nr. 12, K13b): Sieger und Verlierer nach RWB.supercup.praemie, für deinen Verein als Buchung „Supercup“, für Computer-Vereine aufs Konto
function supercupPraemie(r,w){const P=RWB.supercup.praemie;[r.h,r.a].forEach(id=>{const x=id===w?P.sieger:P.verlierer;if(!x||id==null||id<0||id>=1000)return;
  if(id===S.my){money('Supercup',x);news(`Supercup-Prämie: ${fmt(x)}.`,'good');}else if(S.teams[id])S.teams[id].cash+=x;});}

// Pokalmeldungen (K13 §8, K13c), nur Meldungen, ohne Würfel. Pokalsensation: ein Erstligist (nicht dein Verein) scheidet gegen einen Amateurverein oder einen Verein ab der 3. Liga aus.
// Los des Jahres: bei der Auslosung ein Erstligist mit Ansehen ab RWB.pokal.losTopAb gegen einen Amateurverein.
function pokalSensationen(list){(list||[]).forEach(r=>{const w=winner(r),l=w===r.h?r.a:r.h;if(l==null||l>=1000||l===S.my||!S.teams[l]||S.teams[l].lg!==1||!amateur(w))return;
  news(`Pokalsensation: ${tn(w)} wirft ${tn(l)} aus dem DFB-Pokal (${r.hg}:${r.ag}${r.pen?`, i.E. ${r.pen[0]}:${r.pen[1]}`:''}).`,'');});}
// Prüfung EE4: nicht in der 1. Runde (dort ziehen alle Profis Amateure), höchstens einmal je Saison (S.cup ist je Saison neu)
function pokalLosDesJahres(paare,r){if(r===0||(S.cup&&S.cup.losJahr))return null;const p=(paare||[]).find(x=>x.some(id=>id!=null&&id<1000&&S.teams[id]&&S.teams[id].lg===1&&S.teams[id].rep>=RWB.pokal.losTopAb)&&x.some(id=>id>=1000));
  if(p){if(S.cup)S.cup.losJahr=1;news(`Pokal-Los des Jahres: ${tn(p[0])} gegen ${tn(p[1])}.`,'');}return p||null;}
