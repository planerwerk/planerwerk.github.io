// Gerüchteküche (K29 §4.3, §5.5, U17b): montags ein bis drei Gerüchte aus echten Anlässen oder erfunden, Wirkung auf Stimmung, Fans, Vertrauen und Ablöse,
// Pressekonferenz zu Gerüchten über deinen Verein, Treffsicherheit der Medien nach 30 Tagen.
// Im Spielstand: S.ger = {l: [{id, art, m Medium, s, tag (absolut), tid, klub, pid, w (1 wahr, 0.5 halb, 0 falsch), text, mein, team0, chef0, ok, r}], ruf: {Medium: Treffsicherheit}, id}.
// Am Spieler p.gerF = {f: Faktor, bis: absoluter Tag} (bekanntes Interesse hebt die Ablöse). Zufall nur im Strom 'geruechte'.
function gerS(){return S.ger||(S.ger={l:[],ruf:Object.assign({},RGR.medien.start),id:0});}
const gerFaktor=p=>p&&p.gerF&&p.gerF.bis>=absTag(S.tag)?p.gerF.f:1;
function gerText(art,c,k){const T=PRESSE.geruechte[art].t;return T[k%T.length].replace(/\{(\w+)\}/g,(m,x)=>c[x]!=null?c[x]:m);}
function gerMedium(art){const M=PRESSE.geruechte[art].m;return R()<0.6||M.length<2?M[0]:M[1+Math.floor(R()*(M.length-1))];}
// Anlässe dieser Woche: über deinen Verein (mein) und über andere (fremd)
function gerKandidaten(){const G=RGR,mein=[],fremd=[],sq=squad(S.my),lvl=new Map();
  Object.entries(S.verh||{}).forEach(([id,v])=>{const p=PIX.get(+id);if(p&&v&&p.team===v.team&&p.team!==S.my&&p.team>=0&&p.team<1000&&(v.f!=null||v.einig)&&!(v.nl&&!v.r&&!v.einig))mein.push({art:'verhandlung',tid:p.team,klub:S.my,pid:p.id,w:1});}); /* nur ein Nachlass aus der Karte (K30c) ist noch keine Verhandlung (Prüfung EF1) */
  sq.forEach(p=>{if((p.ww||0)>=2)mein.push({art:'unzufrieden',tid:S.my,pid:p.id,w:1});});
  sq.slice().sort((a,b)=>b.str-a.str).slice(0,3).forEach(p=>{const b=beraterVon(p);if(b&&b.prof==='gierig')mein.push({art:'interesse',tid:S.my,pid:p.id,w:0.5});});
  if(S.ult&&S.ult.tid===S.my)mein.push({art:'trainer',tid:S.my,w:1});
  S.teams.forEach(x=>{if(aktiv(x)&&x.id!==S.my&&x.vor&&x.vor.u!=null)fremd.push({art:'trainer',tid:x.id,w:1});});
  S.pl.forEach(p=>{if(!p.list||p.team<0||p.team>=1000||p.team===S.my||!S.teams[p.team]||!aktiv(S.teams[p.team]))return;if(!lvl.has(p.team))lvl.set(p.team,teamLevel(p.team));if(p.str>=lvl.get(p.team))fremd.push({art:'liste',tid:p.team,pid:p.id,w:1});});
  Object.entries(S.bez||{}).forEach(([k,e])=>{if(!e||e.v>=G.aergerUnter)return;const z=k.split(':');
    if(z[0]==='d'&&S.teams[+z[1]])mein.push({art:'aerger',tid:S.my,klub:+z[1],w:null});else if(z[0]==='v'&&S.teams[+z[1]]&&S.teams[+z[2]])fremd.push({art:'aerger',tid:+z[1],klub:+z[2],w:null});});
  // Klatsch (K17 §5.3, K17d): je Verein mit schlechter Beziehung ein Spieler deines Kaders, den er brauchen könnte, „soll dort ein Thema sein“
  gerKlatschVereine().forEach(k=>{const l=sq.filter(p=>!p.wech&&!p.leihe&&hatBedarf(S.teams[k],p));if(l.length)mein.push({art:'thema',tid:S.my,klub:k,pid:pick(l).id,w:null});});
  return{mein,fremd};}
// Vereine, zu denen deine Beziehung (du und dein Verein, bezWirk) mehr als aergerUnter unter ihrem Grundwert liegt (K17 §5.2, K17d). Ohne den Grundwert hätte
// ein einziges entschiedenes Derby (Grundwert −30, −2) den Klatsch eingeschaltet (Prüfung EG3, vorläufig).
const gerKlatschVereine=()=>S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&bezWirk(t.id)-bezGrund(S.my,t.id)<RGR.aergerUnter).map(t=>t.id);
// Gerüchte über deinen Verein mal klatsch.mein, solange es einen solchen Verein gibt (K17 §5.2: doppelt so viele)
const gerKlatschFaktor=()=>gerKlatschVereine().length?RGR.klatsch.mein:1;
// Erfundenes Gerücht (Boulevard, Portal): Absprung eines Spielers oder Trainer vor dem Aus
function gerErfunden(mein){if(mein){const sq=squad(S.my);if(R()<0.3||!sq.length)return{art:'trainerAus',tid:S.my,w:0};return{art:'absprung',tid:S.my,pid:sq[Math.floor(R()*sq.length)].id,w:0};}
  const l=S.teams.filter(t=>aktiv(t)&&t.id!==S.my);if(!l.length)return null;const t=l[Math.floor(R()*l.length)];
  if(R()<0.5)return{art:'trainerAus',tid:t.id,w:0};const sq=squad(t.id).sort((a,b)=>b.str-a.str);return sq.length?{art:'absprung',tid:t.id,pid:sq[0].id,w:0}:null;}
// Montags (ablauf.js woechentlichLauf, eigener Strom)
function geruechteWoche(){if(S.phase!=='play'||S.fired)return;const G=RGR,K=gerKandidaten(),n=G.proWoche[0]+Math.floor(R()*(G.proWoche[1]-G.proWoche[0]+1));let meins=false;
  const mp=medienpolitik(),kf=klimaFaktor(),kl=gerKlatschFaktor(); /* Medienpolitik und Medienklima (K29b), Klatsch (K17d): gleich viele Würfe, nur die Schwellen für Gerüchte über dich ändern sich */
  for(let k=0;k<n;k++){let c=null;
    if(!meins&&R()<Math.min(1,G.meinVerein*mp.mein*kf*kl)){c=R()<Math.min(1,G.erfindung*mp.erfindung*kf)?gerErfunden(true):K.mein.length?K.mein.splice(Math.floor(R()*K.mein.length),1)[0]:null;if(c)meins=true;}
    if(!c)c=R()<G.erfindung?gerErfunden(false):K.fremd.length?K.fremd.splice(Math.floor(R()*K.fremd.length),1)[0]:gerErfunden(false); // ohne Anlass erfinden die Medien etwas (T2.3, vorläufig)
    if(c){if(c.w==null)c.w=R()<G.aergerWahr?1:0;gerVeroeffentlichen(c);}}
  gerPruefen();}
function gerVeroeffentlichen(c){const G=RGR,W=G.wirkung,P=gerS(),m=c.w===0&&c.art!=='aerger'?(R()<0.6?'boulevard':'portal'):gerMedium(c.art),t=S.teams[c.tid],p=c.pid!=null?PIX.get(c.pid):null;
  const ctx={verein:tn(c.tid),klub:c.klub!=null?tn(c.klub):'',spieler:p?p.n:'',coach:trainerName(c.tid)};P.id++;
  const g={id:P.id,art:c.art,m,s:S.season,tag:absTag(S.tag),tid:c.tid,klub:c.klub!=null?c.klub:null,pid:c.pid!=null?c.pid:null,w:c.w,text:gerText(c.art,ctx,P.id),mein:c.tid===S.my||c.klub===S.my?1:0,team0:p?p.team:null,chef0:t?t.chef:null};
  P.l.push(g);if(P.l.length>G.log)P.l.splice(0,P.l.length-G.log);news(`Gerüchteküche, ${PRESSE.medien[m].name}: „${g.text}“`,g.mein?'tr':'');
  const mw=g.mein?medienWirkung(m):1; /* Beziehung zum Medium (K29c): gewogen milder, verärgert schärfer */
  if(p&&p.team===S.my&&['unzufrieden','interesse','absprung'].includes(c.art)){stimmungAendern(p,W.stimmung*mw);if(istLiebling(p,S.my))fanAnlass(myT(),'fanU',W.fans*mw);}
  if(p&&p.team===S.my&&c.art==='thema'){const K=G.klatsch;stimmungAendern(p,R()<K.positiv?K.stimmung:-K.stimmung*mw);} /* Klatsch (K17 §5.3, K17d): fühlt sich begehrt oder wird unruhig */
  if(c.tid===S.my&&(c.art==='trainer'||c.art==='trainerAus'))S.trust=clamp(S.trust+W.vertrauen*mw,0,100);
  if(p&&(c.art==='verhandlung'||c.art==='interesse'))p.gerF={f:c.w>=1?W.preis.wahr:W.preis.halb,bis:absTag(S.tag)+G.dauer};
  if(g.mein)presseAnlass('geruecht',{pid:p&&p.team===S.my?p.id:null,medium:m,trainer:c.art==='trainer'||c.art==='trainerAus'});}
// Nach 30 Tagen: Treffsicherheit der Medien. Wechsel- und Trainergerüchte am Ausgang, die übrigen am Wahrheitsgehalt.
function gerPruefen(){const G=RGR,P=gerS(),heute=absTag(S.tag);
  P.l.forEach(g=>{if(g.ok||heute-g.tag<G.dauer)return;let r;
    if(g.art==='thema'){const p=PIX.get(g.pid);r=!!p&&(p.team===g.klub||!!(p.wech&&p.wech.nach===g.klub));} /* thema (K17d): trat ein, wenn er zu diesem Verein gewechselt ist (Prüfung EG2) */
    else if(['verhandlung','liste','interesse','absprung'].includes(g.art)){const p=PIX.get(g.pid);r=!p||p.team!==g.team0||!!p.wech;}
    else if(g.art==='trainer'||g.art==='trainerAus')r=g.tid===S.my||g.chef0==null?(S.my!==g.tid||!!S.fired):(S.teams[g.tid]&&S.teams[g.tid].chef!==g.chef0);
    else r=g.w>=0.5;
    g.ok=1;g.r=r?1:0;P.ruf[g.m]=clamp((P.ruf[g.m]!=null?P.ruf[g.m]:50)+(r?G.medien.treffer:G.medien.fehler),0,100);});}
const gerRufWort=v=>v>=70?'trifft meist':v>=50?'trifft oft':v>=35?'trifft manchmal':'trifft selten';
// Karte im Büro
function gerKarte(){const P=gerS(),l=P.l.slice(-RGR.anzeige).reverse();if(!l.length)return'';
  return`<div class="card"><h3>Gerüchteküche</h3>${l.map(g=>`<p>${g.mein?'<b>':''}„${esc(g.text)}“${g.mein?'</b>':''}<br><span class="dim">${esc(PRESSE.medien[g.m].name)} (${gerRufWort(P.ruf[g.m])})${g.ok?(g.r?' · trat ein':' · stimmte nicht'):''}</span></p>`).join('')}</div>`;}
