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
  const a=absTag(e.tag),ok=squad(S.my).filter(p=>!(p.inj>0)&&!(sperreIn(p,'liga')>0)&&!beiNationalteam(p,a)),ab=squad(S.my).filter(p=>beiNationalteam(p,a)).length,tw=ok.some(p=>p.pos==='TW');
  return{e,n:ok.length,tw,ab,grund:ok.length<V.minSpieler||!tw||ab>=V.abgestellt};} /* seit K13f auch bei abgestellt Nationalspielern (nur mit Länderspielen) */
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
  return`<div class="card"><h3>Spielverlegung</h3><p>Für das Spiel am ${datumKurz(l.e.tag)} sind nur ${l.n} Spieler einsatzfähig${l.tw?'':', kein Torwart'}${l.ab?`, ${l.ab} bei Nationalmannschaften`:''}. Die Liga verlegt, wenn weniger als ${RWB.verlegung.minSpieler} Spieler mit einem Torwart bereitstehen${lsAn()?` oder mindestens ${RWB.verlegung.abgestellt} bei Nationalmannschaften sind`:''}, höchstens ${RWB.verlegung.proSaison}-mal je Saison.</p>
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
// Pokal-Rotation rächt sich (K13 §8, K13e): Du scheidest als Favorit aus (Amateur oder Niveau mindestens RWB.pokal.rotation.favorit unter deinem) und hast gegenüber
// deinem letzten Ligaspiel (S.ligaXI aus letztesSpielMerken) mindestens rotation.wechsel Spieler der Startelf getauscht. Nur eine Meldung, ohne weitere Wirkung. Gibt die Zahl der Wechsel zurück.
// Ohne Ligaspiel dieser Saison bei deinem Verein (1. Liga: Pokalrunde 1 liegt vor dem Ligastart; nach einem Jobwechsel) zählt die beste Elf (bestXI, ohne Zufall) als Vergleich (Prüfung FC6).
// Seit Prüfung FD3 die beste Elf vor dem Anpfiff (mg.bxi aus pokalBezugsElf in tagesSpieleVorbereiten): nach dem Spiel sind die Stammspieler müde, verletzt oder gesperrt,
// dann wären ausgeruhte Ersatzspieler „besser“. Fehlt bxi (Test, alter Stand), wird wie bisher jetzt gerechnet. Seit Prüfung FF1 mit den Sperren des Pokals
// (mitWettbewerb, sonst zählten Liga-Sperren) und nach dem Fitspritzen (Aufruf im Helfer spiel von tagesSpieleVorbereiten).
const pokalBezugsElf=pl=>{const L=S.ligaXI;if(!pl.some(([h,a])=>h===S.my||a===S.my)||(L&&L.t===S.my&&L.s===S.season))return null;return mitWettbewerb('pokal',()=>bestXI(S.my,myT().form));};
function pokalRotation(mg){if(!mg)return 0;const P=RWB.pokal.rotation,L=S.ligaXI,s=mg.h===S.my?0:1,opp=s?mg.h:mg.a;
  if(winner(mg)===S.my||!mg.xi||!mg.xi[s])return 0;
  if(opp<1000&&teamLevel(S.my)-teamLevel(opp)<P.favorit)return 0;const liga=!!L&&L.t===S.my&&L.s===S.season,alt=new Set(liga?L.ids:(mg.bxi||mitWettbewerb('pokal',()=>bestXI(S.my,myT().form)))),n=mg.xi[s].filter(id=>!alt.has(id)).length;if(n<P.wechsel)return 0;
  news(`Die Rotation rächt sich: Gegenüber ${liga?'dem letzten Ligaspiel':'deiner besten Elf'} standen ${n} neue Spieler in der Startelf. Die Zeitungen fragen, ob der Pokal zu leicht genommen wurde.`,'bad');return n;}
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

// ---------- Länderspiele: Abstellung und Rückkehr (K13 §3.4, §5.1, K13f) ----------
// Nur mit RWB.laenderspiele.an (vorerst aus). Am ersten Tag jeder Länderspielpause (S.plan.pausen, Name „Länderspielpause“) nominiert jede Nation ihre bis zu max
// Stärksten mit Stärke ab der Schwelle (lsSchwelle); wer höchstens rand darüber liegt, braucht Form ab formMin und Spielpraxis ab praxisMin. Gezählt werden die Spieler
// deutscher Vereine und des Auslandspools, markiert nur die deutscher Vereine: p.lsp = {von, bis (absolute Tage, bis = letzter Tag der Pause, seit FM1), n Länderspiele, st Stammkraft}.
// Solange fehlt er (avail) und trainiert nicht im Verein. Danach kehrt er zurück (eigener Strom „laender“ je Spieler): Stammkräfte spielen 90 Minuten, die anderen
// minuten; wer gespielt hat, verliert Frische, trägt Saisonbelastung, kann sich verletzen, Selbstvertrauen ± sv; alle: Stimmung + stimmung.
// Unabhängig davon, ob es dein Verein oder ein Computer-Verein ist (Gleichschritt), nur die Meldungen gibt es bei dir.
const lsAn=()=>!!(RWB.laenderspiele&&RWB.laenderspiele.an);
// Seit Prüfung FO6: mitLsTag setzt den Tag für Vorschauen (Scoutbericht, Vergleich), sonst gilt heute
let LS_TAG=null;
function mitLsTag(a,fn){const alt=LS_TAG;LS_TAG=a;try{return fn();}finally{LS_TAG=alt;}}
const beiNationalteam=(p,a)=>{if(!p||!p.lsp)return false;const x=a!=null?a:LS_TAG!=null?LS_TAG:absTag(S.tag);return x>=p.lsp.von&&x<=p.lsp.bis;};
const lsSchwelle=nat=>{const L=RWB.laenderspiele.schwelle,n=nation(nat);return n&&n.rang?Math.max(L.min,L.basis-L.jeRang*(n.rang-1)):Infinity;};
function laenderspielTag(d){if(!lsAn()||!S.plan)return;const a=absTag(d);
  S.pl.forEach(p=>{if(!p.lsp||a<=p.lsp.bis)return;if(a-p.lsp.bis>2){delete p.lsp;return;} /* FN5: veraltet (Schalter zwischendurch aus), ohne Folgen */mitStrom(strom('laender',S.season,d,p.id),()=>lsRueckkehr(p));});
  S.plan.pausen.filter(x=>x.name==='Länderspielpause'&&x.von===d).forEach(x=>lsNominieren(x));}
// Kader je Nation (seit K13k eigene Funktion, für Pausen und Turniere): Map Nation → die bis zu max Stärksten, sortiert (Spieler deutscher Vereine und des Auslandspools)
function lsKader(){const L=RWB.laenderspiele,nach=new Map();
  [...S.pl,...((S.ausland&&S.ausland.pl)||[])].forEach(p=>{if(p.team<0||!p.nat||p.inj>0||p.lsp)return;if(p.team<AV0){if(!S.teams[p.team]||!aktiv(S.teams[p.team]))return;}else if(!avVon(p.team))return;
    const s=lsSchwelle(p.nat);if(p.str<s||(p.str<s+L.rand&&((p.form||0)<L.formMin||(p.sp||0)<L.praxisMin)))return;
    if(!nach.has(p.nat))nach.set(p.nat,[]);nach.get(p.nat).push(p);});
  nach.forEach((l,k)=>nach.set(k,l.sort((a,b)=>b.str-a.str||a.id-b.id).slice(0,L.max)));return nach;}
function lsNominieren(x){const L=RWB.laenderspiele,von=absTag(x.von),bis=absTag(x.bis),n=Math.max(2,Math.round((x.bis-x.von+1)/L.tageJeSpiel/2)*2);
  const mein=[];lsKader().forEach(l=>l.forEach((p,i)=>{p.lspN=(p.lspN||0)+1;p.lspZ=von;if(p.team>=AV0)return; /* FN7, FO7: Zählung und Marktwert auch im Auslandspool */p.lsp={von,bis,n,st:i<L.stamm?1:0};if(p.team===S.my)mein.push(p);}));
  if(mein.length)news(`Länderspielpause: ${mein.map(p=>`${p.n} (${natName(p)})`).join(', ')} ${mein.length===1?'ist':'sind'} bis ${datumKurz(x.bis)} bei der Nationalmannschaft, ${n} Länderspiele.`,'');}
function lsRueckkehr(p){const L=RWB.laenderspiele,x=p.lsp;delete p.lsp;if(p.team<0||p.team>=AV0)return;let sp=0;
  let M=0;for(let i=0;i<x.n;i++){const m=x.st?90:ri(L.minuten[0],L.minuten[1]);M+=m;if(m>=L.minMin)sp++;} /* FM10: kurze Einsätze zählen nicht voll */
  stimmungAendern(p,L.stimmung);
  if(sp){const a=Math.min(1,M/(90*sp));p.fit=Math.max(0,p.fit-Math.round(ri(L.frische[0],L.frische[1])*a));p.sb=Math.min(100,(p.sb||0)+L.belastung*sp);svAendern(p,R()<0.5?L.sv:-L.sv);if(R()<L.verletzung&&verletzen(p,'kollision'))p.lspV=absTag(S.tag);}
  if(p.team===S.my)news(`${p.n} ist von der Nationalmannschaft zurück, ${sp?`${sp} Länderspiel${sp===1?'':'e'}`:'ohne Einsatz'}${p.inj>0?', verletzt':''}.`,p.inj>0?'bad':'');}

// ---------- Pokal-Rotation der Favoriten (K13 §4, K13j) ----------
// Nur mit RWB.pokal.rotationKI.an (vorerst aus). In den Pokalrunden bis bisRunde schont ein Favorit (Gegner Amateur oder Niveau mindestens rotation.favorit unter seinem)
// Spieler unter frische % Frische: Er stellt aus dem Kader ohne sie auf, wenn danach mindestens minKader Spieler mit Torwart bleiben. Gilt für Computer-Vereine und für
// deinen Verein, wenn der Co-Trainer aufstellt (stabMacht), also in beiden Welten des Gleichschritts gleich. Ohne Zufall. Gibt den Kader oder undefined zurück.
function pokalRotationKader(tid,gid,o){const R=RWB.pokal.rotationKI;if(!R||!R.an||!o||o.wb!=='pokal'||o.runde==null||o.runde>R.bisRunde||tid>=1000||!S.teams[tid]||!stabMacht(tid,'aufstellung'))return undefined;
  if(!(gid>=1000||teamLevel(tid)-teamLevel(gid)>=RWB.pokal.rotation.favorit))return undefined;
  const k=squad(tid).filter(p=>p.fit>=R.frische&&avail(p));return k.length>=R.minKader&&k.some(p=>p.pos==='TW')?k:undefined;}

// ---------- Turniere im Sommer (K13 §3.4, K13k) ----------
// Nur mit Länderspielen. Beim Saisonwechsel eines Turniersommers (Jahr der neuen Saison: Rest 0 bei Division durch 4 EM, Rest 2 WM): Teilnehmer der EM sind die
// turnier.em Bestplatzierten aus UEFA_NATIONEN, der WM die turnier.wm Bestplatzierten, ohne turnier.gesperrt (Prüfung FQ4). Abschneiden fest aus dem Seed (seit Prüfung FQ2
// eine Rangfolge wie ein Turnierbaum, turnierRunden): Platz 1 Titel, 2 Finale, 3–4 Halbfinale usw. Gespielt werden 3 Vorrundenspiele und die K.-o.-Spiele. Kader wie in den
// Pausen (lsKader). Abgestellte deutscher Vereine fehlen bis turnier.spaet Tage nach dem Trainingsauftakt ihres Vereins (p.lsp, Rückkehr wie nach einer Pause) und tragen
// Saisonbelastung, weil der Sommerurlaub fehlt: seit Prüfung FQ1 mindestens die Schwelle RSO.belastung.ab, dazu turnier.belastung. Meldungen: deine Spieler und der Sieger. Ohne R().
// Runden je Nation: Wertung = Rang − streuung × Zufall aus dem Seed, sortiert; Platz i (ab 0) erreicht Stufe ko+1 − (Bits von i), mindestens 0 (Vorrunde).
function turnierRunden(teil,ko,T){const w=n=>n.rang-T.streuung*(hash32(['turnier',S.seed,S.season,n.k].join('|'))%1000)/1000,erg=new Map();
  const folge=teil.slice().sort((a,b)=>w(a)-w(b)||a.rang-b.rang);folge.forEach((n,i)=>erg.set(n.k,Math.max(0,ko+1-(i?32-Math.clz32(i):0))));return{erg,sieger:folge[0]};}
function turnierSommer(){if(!lsAn())return;const T=RWB.laenderspiele.turnier,em=S.season%4===0,wm=S.season%4===2;if(!em&&!wm)return;
  const name=em?'EM':'WM',stufen=em?T.stufenEm:T.stufenWm,ko=stufen.length-2,a0=absTag(S.tag);
  const teil=NATIONEN.map(n=>nation(n[0])).filter(n=>n&&n.rang&&!(T.gesperrt||[]).includes(n.k)&&(!em||UEFA_NATIONEN.includes(n.k))).sort((a,b)=>a.rang-b.rang).slice(0,em?T.em:T.wm);
  const {erg,sieger}=turnierRunden(teil,ko,T),kader=lsKader(),mein=[];
  teil.forEach(n=>{const r=erg.get(n.k),spiele=3+Math.min(r,ko);(kader.get(n.k)||[]).forEach((p,i)=>{p.lspN=(p.lspN||0)+1;p.lspZ=a0;if(p.team>=AV0)return;
    const t=S.teams[p.team];p.lsp={von:a0,bis:absTag(t?auftaktTag(t):S.tag)+T.spaet,n:spiele,st:i<RWB.laenderspiele.stamm?1:0,turnier:1};p.sb=Math.min(100,Math.max(p.sb||0,RSO.belastung.ab)+T.belastung);
    if(p.team===S.my)mein.push(`${p.n} (${natName(p)}, ${stufen[Math.min(r,stufen.length-1)]})`);});});
  news(`${name} ${S.season}: ${sieger?`Sieger ist ${sieger.name}.`:''}${mein.length?` Aus deinem Kader dabei: ${mein.join(', ')}. Sie kommen später zum Trainingsauftakt.`:''}`,'');}
