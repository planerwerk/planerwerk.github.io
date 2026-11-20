// Statistik und Historie (K34 §5.3 bis §5.9, U13): Werte je Spieler und Saison, Vorlagen, Karriere, Ehrungen, Rekorde, Saisonarchiv, Vitrine, Ehemalige, Jubiläen.
// Am Spieler: p.sst laufende Zeile (eine Saison, ein Verein), p.kar Karrierezeilen als Zahlenlisten (Spalten in KZ), p.kas Summenzeile nach dem Verdichten,
// p.mvl Monatsverlauf (nur eigener Kader), p.ehj Saison der letzten Ehrung (Marktwert, welt.js value).
// Im Spielstand: S.stat = {ab: erste Saison, tz: {Verein: [Punkte, erwartete Punkte × 100]}, eg: {Liga: Eigentore}, lauf: {Verein: [Serie ohne Niederlage, Liga]},
//   rek: {lg: {Liga: {sieg, tore, serie}}, welt: {transfer}, v: {Verein: {zus, sieg, zu, ab}}}, arch: [Saisonarchiv], ehem: [Ehemalige], vit: [Vitrine], st: [Stationen des Trainers]}.
// Zufall nur für die Vorlagen, mit eigenem Strom je Spiel (K34 §5.4). Alles andere kommt ohne Zufall aus.
const KZ={s:0,tid:1,lg:2,sp:3,min:4,t:5,v:6,n:7,nz:8,ge:9,ro:10,ps:11,pt:12,pv:13,str:14,mw:15,zn:16,pa:17};
const PARADEN=new Set(['parade','parade_nah','flanke_tw','elfmeter_gehalten']);
const stSaison=s=>`${s}/${String((s+1)%100).padStart(2,'0')}`;
const stVerein=id=>id==null?'–':id>=AV0?((avVon(id)||{}).name||'Ausland'):S.teams[id]?S.teams[id].name:'?';
const stNote=n100=>n100?(n100/100).toFixed(2).replace('.',','):'–';

function statS(){const s=S.stat||(S.stat={ab:S.season,tz:{},eg:{},lauf:{},rek:{lg:{},welt:{},v:{}},arch:[],ehem:[],vit:[],st:[]});
  if(!s.st.length&&S.my!=null&&S.teams&&S.teams[S.my])s.st.push({tid:S.my,von:[S.season,S.tag]});return s;}

// ---------- Zeilen je Saison und Verein ----------
function sstFuer(p,tid){let x=p.sst;if(x&&(x.s!==S.season||x.tid!==tid)){statZeileSchliessen(p);x=null;}
  if(!x)x=p.sst={s:S.season,tid,lg:0,sp:0,min:0,t:0,v:0,ns:0,nz:0,ge:0,ro:0,ps:0,pt:0,pv:0,zn:0,pa:0,s0:Math.round(p.str)};return x;}
function statZeileSchliessen(p){const x=p.sst;if(!x)return;delete p.sst;if(!x.sp&&!x.ps)return;
  const z=[x.s,x.tid,x.lg,x.sp,x.min,x.t,x.v,x.nz?Math.round(x.ns/x.nz*100):0,x.nz,x.ge,x.ro,x.ps,x.pt,x.pv,Math.round(p.str),Math.round(value(p)/1000),x.zn,x.pa];
  while(z.length>KZ.mw+1&&!z[z.length-1])z.pop();(p.kar=p.kar||[]).push(z);}
// Alle Zeilen eines Spielers (abgeschlossen und laufend) im Format von p.kar
function statZeilen(p){const l=(p.kar||[]).slice(),x=p.sst;if(x&&(x.sp||x.ps))l.push([x.s,x.tid,x.lg,x.sp,x.min,x.t,x.v,x.nz?Math.round(x.ns/x.nz*100):0,x.nz,x.ge,x.ro,x.ps,x.pt,x.pv,Math.round(p.str),Math.round(value(p)/1000),x.zn,x.pa]);return l;}
// Summe der Karriere (mit Summenzeile p.kas), für Ehemalige, Vergleich und Spielerkarte
function statSumme(p){const k=p.kas||{},a={von:k.von!=null?k.von:null,bis:k.bis!=null?k.bis:null,sp:k.sp||0,min:k.min||0,t:k.t||0,v:k.v||0,ns:(k.n||0)*(k.nz||0)/100,nz:k.nz||0,ge:k.ge||0,ro:k.ro||0,ps:k.ps||0,pt:k.pt||0,pv:k.pv||0,zn:k.zn||0,pa:k.pa||0,ver:Object.assign({},k.ver||{})};
  statZeilen(p).forEach(z=>{const g=i=>z[i]||0;a.von=a.von==null?z[KZ.s]:Math.min(a.von,z[KZ.s]);a.bis=a.bis==null?z[KZ.s]:Math.max(a.bis,z[KZ.s]);
    a.sp+=g(KZ.sp);a.min+=g(KZ.min);a.t+=g(KZ.t);a.v+=g(KZ.v);a.ns+=g(KZ.n)*g(KZ.nz)/100;a.nz+=g(KZ.nz);a.ge+=g(KZ.ge);a.ro+=g(KZ.ro);a.ps+=g(KZ.ps);a.pt+=g(KZ.pt);a.pv+=g(KZ.pv);a.zn+=g(KZ.zn);a.pa+=g(KZ.pa);
    a.ver[z[KZ.tid]]=(a.ver[z[KZ.tid]]||0)+g(KZ.sp)+g(KZ.ps);});
  a.n=a.nz?Math.round(a.ns/a.nz*100):0;return a;}
// Pflichtspiele für einen Verein (Liga und Pokal), ab Spielbeginn
function vereinsSpiele(p,tid){const x=p.sst;return(p.kar||[]).reduce((n,z)=>n+(z[KZ.tid]===tid?(z[KZ.sp]||0)+(z[KZ.ps]||0):0),0)+(x&&x.tid===tid?x.sp+x.ps:0)+((p.kas&&p.kas.ver&&p.kas.ver[tid])||0);}

// ---------- Nach jedem Spieltag (ablauf.js, nach applyMatch) ----------
function statistikNachSpiel(list,d){list.forEach(r=>{if(!r||r.test||r.rel||r.supercup)return;const cup=!!r.cup,lg=cup?0:r.lg;if(!cup&&!lg)return;
  mitStrom(strom('vorlagen',S.season,d,r.h,r.a),()=>vorlagenVerteilen(r));statSpielBuchen(r,cup,lg,d);});}
// Wer in Minute m auf dem Platz stand: Startelf, Wechsel bis m, ohne Platzverweise vor m
function aufPlatz(r,s,m){const da=new Set(r.xi[s]||[]);(r.ws||[]).filter(w=>w[0]===s&&w[1]<=m).forEach(w=>{da.delete(w[2]);da.add(w[3]);});
  (r.ev||[]).forEach(e=>{if(e.t==='R'&&e.s===s&&e.m<m)da.delete(e.p);});return[...da];}
// Vorlagen (K34 §5.4): nach dem Spiel, ohne Einfluss auf Ergebnis und Noten. Am Tor-Ereignis: e.v (Kennung), e.vn (Name).
function vorlagenVerteilen(r){const V=RSTAT.vorlage;
  (r.ev||[]).forEach(e=>{if(e.t!=='G'||e.p==null||e.v!=null||V.keine.includes(e.art))return;const tid=e.s?r.a:r.h;if(tid>=1000)return;
    const q=V.anteil[e.art]||0;if(!(R()<q))return;
    const pos=new Map((r.xpo[e.s]||[]).map(x=>[x[0],x[1]])),c=aufPlatz(r,e.s,e.m).filter(id=>id!==e.p).map(id=>PIX.get(id)).filter(Boolean);if(!c.length)return;
    let v=null;const t=S.teams[tid],art=e.art==='ecke'?'ecke':e.art==='freistossFlanke'?'freistoss':null;
    if(art&&t&&t.schuetzen&&t.schuetzen[art]){for(const id of [].concat(t.schuetzen[art])){const x=c.find(p=>p.id===id);if(x){v=x;break;}}}
    if(!v){const fl=V.flanken.includes(e.art);v=waehle(c,p=>{const ps=pos.get(p.id)||STD_POS[p.pos]||'ZM';return(V.gewicht[linksForm(ps)]||1)*Math.pow(Math.max(1,p.str)/V.mitte,V.staerkeExp)*(hatMk(p,'flankengeber')?(fl?V.flankengeber:V.flankengeberSonst):1);});}
    if(v){e.v=v.id;e.vn=v.n;}});}
function statSpielBuchen(r,cup,lg,d){const st=statS(),V=RSTAT,nt=r.nt||{},seite=new Map();
  [0,1].forEach(s=>(r.xpo[s]||[]).forEach(x=>seite.set(x[0],s)));
  [0,1].forEach(s=>{const tid=s?r.a:r.h;if(tid>=1000)return;const gf=s?r.ag:r.hg,ga=s?r.hg:r.ag;
    (r.xpo[s]||[]).forEach(([id,ps,,min=90])=>{const p=PIX.get(id);if(!p)return;const x=sstFuer(p,tid);
      if(cup)x.ps++;else{x.lg=lg;x.sp++;x.min+=min;if(nt[id]!=null){x.ns+=nt[id];x.nz++;}if(ps==='TW'&&min>=V.zuNullMin&&ga===0)x.zn++;}});
    if(!cup){const E=erwartung(r.xg0[s],r.xg0[1-s]),z=st.tz[tid]||(st.tz[tid]=[0,0]);z[0]+=gf>ga?3:gf===ga?1:0;z[1]+=Math.round(E.punkte*100);serieStat(tid,lg,gf<ga);}
    if(tid===S.my&&gf>ga)vereinsRekord(tid,'sieg',gf-ga,{hg:gf,ag:ga,txt:`gegen ${tn(s?r.h:r.a)}`,wann:`${datumKurz(d)} ${stSaison(S.season)}`},(a,b)=>a.n>b.n||(a.n===b.n&&a.hg>b.hg));});
  (r.ev||[]).forEach(e=>{const tid=e.s?r.a:r.h;if(tid>=1000)return;
    if(e.t==='G'){if(e.p==null){if(!cup)st.eg[lg]=(st.eg[lg]||0)+1;return;}const p=PIX.get(e.p);if(p){const x=sstFuer(p,tid);if(cup)x.pt++;else{x.t++;toreRekord(p,tid,lg,x.t);}}
      if(e.v!=null){const q=PIX.get(e.v);if(q){const y=sstFuer(q,tid);if(cup)y.pv++;else y.v++;}}}
    else if(!cup&&(e.t==='Y'||e.t==='R')&&e.p!=null){const p=PIX.get(e.p);if(p){const x=sstFuer(p,tid);if(e.t==='Y')x.ge++;else x.ro++;}}});
  if(!cup)(r.sz||[]).forEach(([id,k,ok])=>{if(!ok||!PARADEN.has(k)||!seite.has(id))return;const s=seite.get(id),tid=s?r.a:r.h,p=PIX.get(id);if(p&&tid<1000)sstFuer(p,tid).pa++;});
  if(!cup)siegRekord(r,lg,d);
  [0,1].forEach(s=>{const tid=s?r.a:r.h;if(tid!==S.my)return;(r.xpo[s]||[]).forEach(([id])=>{const p=PIX.get(id);if(p)jubilaeumSpiele(p,tid);});});}

// ---------- Rekorde (K34 §5.6) ----------
function rekLiga(lg){const L=statS().rek.lg;if(!L[lg]){const A=RSTAT.rekord.allzeit[lg];
    L[lg]=A?{sieg:{n:A.sieg.hg-A.sieg.ag,hg:A.sieg.hg,ag:A.sieg.ag,txt:`${A.sieg.h} – ${A.sieg.a}`,wann:A.sieg.datum,echt:1},tore:{n:A.tore.n,txt:`${A.tore.name} (${A.tore.verein})`,wann:A.tore.saison,echt:1},serie:{n:A.serie.n,txt:A.serie.verein,wann:A.serie.zeit,echt:1}}:{};}
  return L[lg];}
// Melden: 1. Liga immer (echte Startwerte), 2. und 3. Liga nur die eigene Liga und erst ab der zweiten Saison des Spielstands
const rekMelden=lg=>lg===1||(lg===myT().lg&&S.season-statS().ab>=RSTAT.rekord.meldenAb);
function rekNeu(lg,art,text){if(!rekMelden(lg))return;news(`${lg===1?'Bundesliga-Rekord':'Rekord der '+ligaName(lg)}: ${text}`,'good');}
function siegRekord(r,lg,d){const n=Math.abs(r.hg-r.ag);if(!n)return;const R0=rekLiga(lg),a=R0.sieg,hoch=Math.max(r.hg,r.ag);
  if(a&&(n<a.n||(n===a.n&&hoch<=Math.max(a.hg,a.ag))))return;
  R0.sieg={n,hg:r.hg,ag:r.ag,txt:`${tn(r.h)} – ${tn(r.a)}`,wann:`${datumKurz(d)} ${stSaison(S.season)}`};rekNeu(lg,'sieg',`${tn(r.h)} – ${tn(r.a)} ${r.hg}:${r.ag} ist der höchste Sieg${a?` (bisher ${a.hg}:${a.ag}, ${a.txt})`:''}.`);}
function toreRekord(p,tid,lg,n){const R0=rekLiga(lg),a=R0.tore;if(a&&n<=a.n)return;const gleich=a&&a.pid===p.id&&a.s===S.season;
  R0.tore={n,pid:p.id,s:S.season,txt:`${p.n} (${tn(tid)})`,wann:stSaison(S.season)};if(!gleich)rekNeu(lg,'tore',`${p.n} (${tn(tid)}) hat ${n} Tore in dieser Saison${a?`, mehr als ${a.txt} mit ${a.n}`:''}.`);}
function serieStat(tid,lg,verloren){const st=statS(),l=st.lauf[tid]&&st.lauf[tid][1]===lg?st.lauf[tid]:[0,lg];l[0]=verloren?0:l[0]+1;st.lauf[tid]=l;if(verloren)return;
  const R0=rekLiga(lg),a=R0.serie;if(a&&l[0]<=a.n)return;const gleich=a&&a.tid===tid&&!a.echt&&a.n===l[0]-1; // dieselbe Serie läuft weiter: still verlängern
  R0.serie={n:l[0],tid,txt:tn(tid),wann:stSaison(S.season)};if(!gleich)rekNeu(lg,'serie',`${tn(tid)} ist seit ${l[0]} Ligaspielen ungeschlagen${a?`, länger als ${a.txt} (${a.n})`:''}.`);}
// Vereinsrekorde nur für Vereine, die du trainierst. besser(neu, alt). Meldung nur, wenn ein alter Wert übertroffen wird.
function vereinsRekord(tid,k,n,o,besser){if(tid!==S.my)return;const v=statS().rek.v,r=v[tid]||(v[tid]={}),neu=Object.assign({n},o),alt=r[k];
  if(alt&&!(besser?besser(neu,alt):neu.n>alt.n))return;r[k]=neu;if(!alt)return;
  const T={zus:`Zuschauerrekord: ${de(n)} ${o.txt}`,sieg:`Höchster Sieg der Vereinsgeschichte (seit Spielbeginn): ${o.hg}:${o.ag} ${o.txt}`,zu:`Teuerster Zugang der Vereinsgeschichte: ${o.txt} für ${fmt(n)}`,ab:`Teuerster Abgang der Vereinsgeschichte: ${o.txt} für ${fmt(n)}`};
  news(T[k]+'.','good');}
// Zuschauer (ablauf.js heimspielEinnahmen)
function statZuschauer(m,att){vereinsRekord(S.my,'zus',att,{txt:`gegen ${tn(m.a)}`,wann:`${datumKurz(S.tag)} ${stSaison(S.season)}`});}
// Transfers mit Ablöse: Rekordtransfer der Spielwelt (Zugang eines deutschen Vereins) und Vereinsrekorde
function statTransfer(p,fee,von,nach){if(!p||!(fee>0))return;fansAbgang(p,von); // Verkauf eines Publikumslieblings (K27, U16)
  const st=statS(),de0=id=>id!=null&&id>=0&&id<1000&&!!S.teams[id],wann=stSaison(S.season);
  if(de0(nach)){const a=st.rek.welt.transfer;if(!a||fee>a.n){st.rek.welt.transfer={n:fee,pid:p.id,txt:`${p.n}, ${stVerein(von)} → ${stVerein(nach)}`,wann};
    if(a&&S.season-st.ab>=RSTAT.rekord.meldenAb)news(`Rekordtransfer: ${p.n} wechselt für ${fmt(fee)} von ${stVerein(von)} zu ${stVerein(nach)}. Bisher: ${a.txt} (${fmt(a.n)}).`,'tr');}
    vereinsRekord(nach,'zu',fee,{txt:`${p.n} von ${stVerein(von)}`,wann});}
  if(de0(von))vereinsRekord(von,'ab',fee,{txt:`${p.n} zu ${stVerein(nach)}`,wann});}

// ---------- Jubiläen (K34 §8) ----------
function jubilaeumSpiele(p,tid){const n=vereinsSpiele(p,tid),J=RSTAT.jubilaeum;if(n>0&&n%J.spiele===0)news(`Jubiläum: ${p.n} bestreitet sein ${n}. Pflichtspiel für ${tn(tid)}.`,'good');}
function jubilaeumJahre(){const J=RSTAT.jubilaeum,heute=absTag(S.tag);squad(S.my).forEach(p=>{if(p.seit==null||p.j10)return;if(heute-p.seit>=J.jahre*365){p.j10=1;news(`Jubiläum: ${p.n} ist seit ${J.jahre} Jahren im Verein.`,'good');}});}

// ---------- Verlauf je Monat (woechentlich, erster Montag) ----------
function statistikMonat(){const n=RSTAT.verlauf;squad(S.my).forEach(p=>{const l=p.mvl||(p.mvl=[]);l.push([S.season,S.tag,Math.round(p.str),Math.round(p.form*10)/10,Math.round(value(p)/1000)]);if(l.length>n)l.splice(0,l.length-n);});}

// ---------- Saisonende (saison.js seasonEndLauf, nach rufSaison, vor einer Entlassung) ----------
// Je Liga die Summen dieser Saison aus allen Zeilen (ein Spieler mit zwei Vereinen in derselben Liga zählt zusammen)
function saisonSammeln(s){const L={1:new Map(),2:new Map(),3:new Map()};
  const add=(p,lg,tid,w,s0)=>{const m=L[lg];if(!m)return;let a=m.get(p.id);if(!a)m.set(p.id,a={p,tid,sp:0,min:0,t:0,v:0,ns:0,nz:0,zn:0,pa:0,ge:0,ro:0,s0:null});
    a.tid=tid;for(const k in w)a[k]+=w[k];if(s0!=null)a.s0=s0;};
  for(const p of PIX.values()){(p.kar||[]).forEach(z=>{if(z[KZ.s]!==s)return;const g=i=>z[i]||0;add(p,g(KZ.lg),z[KZ.tid],{sp:g(KZ.sp),min:g(KZ.min),t:g(KZ.t),v:g(KZ.v),ns:g(KZ.n)*g(KZ.nz)/100,nz:g(KZ.nz),zn:g(KZ.zn),pa:g(KZ.pa),ge:g(KZ.ge),ro:g(KZ.ro)},null);});
    const x=p.sst;if(x&&x.s===s)add(p,x.lg,x.tid,{sp:x.sp,min:x.min,t:x.t,v:x.v,ns:x.ns,nz:x.nz,zn:x.zn,pa:x.pa,ge:x.ge,ro:x.ro},x.s0);}
  return L;}
const statSchnitt=a=>a.nz?a.ns/a.nz:9;
function statBest(l,f){let b=null,bw=-Infinity;l.forEach(a=>{const w=f(a);if(w>bw||(w===bw&&b&&a.p.id<b.p.id)){b=a;bw=w;}});return b;}
// Ehrungen einer Liga (K34 §5.5). tab: Abschlusstabelle der Liga.
function ehrungenLiga(lg,M,tab){const E=RSTAT.ehrung,l=[...M.values()],maxT=l.reduce((m,a)=>Math.max(m,a.t),0);
  const ts=maxT>0?l.filter(a=>a.t===maxT).sort((a,b)=>a.p.id-b.p.id):[];
  const nach=(a,b)=>statSchnitt(a)-statSchnitt(b)||b.nz-a.nz||(b.t+b.v)-(a.t+a.v)||a.p.id-b.p.id,elf=[];
  for(const [pos,n] of Object.entries(E.elf)){let c=l.filter(a=>a.p.pos===pos&&a.nz>=E.elfMinNoten);if(c.length<n)c=l.filter(a=>a.p.pos===pos&&a.nz>=E.elfMinNoten/2);c.sort(nach).slice(0,n).forEach(a=>elf.push(a));}
  const platz=tid=>{const i=tab.findIndex(r=>r.id===tid);return i<0?tab.length:i+1;},SP=E.spieler,TA=E.talent;
  const sp=statBest(l.filter(a=>a.nz>=SP.minNoten),a=>SP.note*(SP.mitte-statSchnitt(a))+SP.tor*a.t+SP.vorlage*a.v+SP.platz*(tab.length-platz(a.tid)));
  const ta=statBest(l.filter(a=>a.p.age<=TA.bisAlter&&a.nz>=TA.minNoten),a=>TA.fortschritt*(a.p.str-(a.s0==null?a.p.str:a.s0))+TA.note*(TA.mitte-statSchnitt(a)));
  const tz=statS().tz;let tr=null,tw=-Infinity;tab.forEach(r=>{const z=tz[r.id];if(!z)return;const w=z[0]-z[1]/100;if(w>tw){tw=w;tr=r.id;}});
  const kurz=a=>[a.p.id,a.p.n,a.tid];
  return{ts:ts.map(a=>kurz(a).concat([a.t])),elf:elf.map(a=>kurz(a).concat([a.p.pos,Math.round(statSchnitt(a)*100)])),sp:sp?kurz(sp):null,ta:ta?kurz(ta):null,
    tr:tr!=null?[tr,tr===S.my?S.mgr:null,Math.round(tw*10)/10]:null};}
function statistikSaison(sm){const st=statS(),s=S.season,E=RSTAT.ehrung,L=saisonSammeln(s),me=myT();
  const auf={1:[...sm.up,...(sm.rw===sm.rel[1]?[sm.rw]:[])],2:[...sm.up3,...(sm.rw2===sm.rel2[1]?[sm.rw2]:[])],3:[...sm.up4]};
  const sc=S.supercup&&S.supercup.r?S.supercup.r.sieger:null,a={s,tab:{},m:[sm.champ,sm.champ2,sm.champ3],p:sm.cup,sc,auf,ehr:{},eg:Object.assign({},st.eg)};
  LIGEN.forEach(lg=>{const tab=table(lg);a.tab[lg]=tab.map(r=>[r.id,r.p,r.tf,r.ta]);a.ehr[lg]=ehrungenLiga(lg,L[lg],tab);});
  st.arch.push(a);
  // Wirkung: Marktwert für geehrte Spieler, Ruf für dich als Trainer der Saison. Meldungen für eigene Spieler und die 1. Liga.
  const geehrt=new Map();LIGEN.forEach(lg=>{const x=a.ehr[lg],g=(e,was)=>{if(!e)return;const p=PIX.get(e[0]);if(!p)return;p.ehj=s;if(!geehrt.has(p))geehrt.set(p,[]);geehrt.get(p).push(was+(lg>1?` (${ligaName(lg)})`:''));};
    x.ts.forEach(e=>g(e,'Torschützenkönig'));x.elf.forEach(e=>g(e,'Elf des Jahres'));g(x.sp,'Spieler der Saison');g(x.ta,'Talent der Saison');
    if(x.tr&&x.tr[0]===S.my){rufAendern(E.trainerRuf);st.vit.push({s,k:'trainer',lg,tid:S.my});news(`Du bist Trainer der Saison${lg>1?` in der ${ligaName(lg)}`:''}! Ruf +${E.trainerRuf}.`,'good');}});
  geehrt.forEach((w,p)=>{if(p.team===S.my)news(`Ehrung für ${p.n}: ${w.join(', ')}.`,'good');});
  const e1=a.ehr[1];if(e1.ts.length)news(`Torschützenkönig der 1. Bundesliga: ${e1.ts.map(x=>`${x[1]} (${tn(x[2])}, ${x[3]} Tore)`).join(' und ')}.${e1.sp?` Spieler der Saison: ${e1.sp[1]} (${tn(e1.sp[2])}).`:''}`);
  // Vitrine (K34 §5.7)
  const v=(k,lg)=>st.vit.push({s,k,lg,tid:S.my});a.m.forEach((id,i)=>{if(id===S.my)v('meister',i+1);});if(sm.cup===S.my)v('pokal',0);if(sc===S.my)v('supercup',0);
  LIGEN.forEach(lg=>{if(auf[lg].includes(S.my))v('aufstieg',lg);});
  // Karriere des Trainers: die Zeile dieser Saison in S.hist ergänzen
  const h=S.hist[S.hist.length-1];if(h&&h.s===s){const row=table(me.lg).find(r=>r.id===S.my)||{p:0,tf:0,ta:0};
    Object.assign(h,{tid:S.my,pk:row.p,tf:row.tf,ta:row.ta,zus:S.att&&S.att[1]?Math.round(S.att[0]/S.att[1]):0,um:Object.values(S.fin||{}).filter(x=>x>0).reduce((x,y)=>x+y,0),erg:sm.fin,ruf:ruf(),st:S.stufe||REGELN.schwierigkeit.standard});}
  // Zeilen schließen, lange Inaktive verdichten (K34 §5.2)
  for(const p of PIX.values()){statZeileSchliessen(p);if(p.kar&&p.kar.length&&p.kar[p.kar.length-1][KZ.s]<=s-RSTAT.verdichtenNach)statVerdichten(p);}
  st.tz={};st.eg={};}
function statVerdichten(p){const a=statSumme(p);p.kas={von:a.von,bis:a.bis,sp:a.sp,min:a.min,t:a.t,v:a.v,n:a.n,nz:a.nz,ge:a.ge,ro:a.ro,ps:a.ps,pt:a.pt,pv:a.pv,zn:a.zn,pa:a.pa,ver:a.ver};delete p.kar;}
// Abschied (saison.js newSeasonLauf, vor dem Löschen): Ehemalige mit langer Karriere, Ehrung oder vielen Spielen für einen deiner Vereine
function statistikAbschied(l){const st=statS(),E=RSTAT.ehemalige,meine=new Set(st.st.map(x=>x.tid).concat([S.my]));
  l.forEach(p=>{if(!p.kar&&!p.kas&&!p.sst)return;const a=statSumme(p),haupt=Object.entries(a.ver).sort((x,y)=>y[1]-x[1])[0];
    const fuerMich=Object.entries(a.ver).some(([tid,n])=>meine.has(+tid)&&n>=E.vereinSpiele);
    if(a.sp<E.ligaspiele&&p.ehj==null&&!fuerMich)return;
    st.ehem.push({id:p.id,n:p.n,pos:p.pos,von:a.von,bis:a.bis,sp:a.sp,t:a.t,v:a.v,no:a.n,ps:a.ps,pt:a.pt,tid:haupt?+haupt[0]:null,ver:a.ver,ehr:p.ehj!=null?1:0});});
  if(st.ehem.length>E.max)st.ehem.splice(0,st.ehem.length-E.max);}
// Stationen des Trainers (saison.js takeJob, bevor der neue Verein gilt)
function statStation(neu){const l=statS().st,a=l[l.length-1];if(a&&a.bis==null){a.bis=[S.season,S.tag];a.g=S.fired?'entlassen':S.ruecktritt?'zurückgetreten':'gewechselt';}l.push({tid:neu,von:[S.season,S.tag]});}
// Summe einer Saison über alle Vereine (Vergleich)
function statSaisonSumme(p,s){const a={sp:0,t:0,v:0,ns:0,nz:0};statZeilen(p).forEach(z=>{if(z[KZ.s]!==s)return;a.sp+=z[KZ.sp]||0;a.t+=z[KZ.t]||0;a.v+=z[KZ.v]||0;a.ns+=(z[KZ.n]||0)*(z[KZ.nz]||0)/100;a.nz+=z[KZ.nz]||0;});return a;}

// ---------- Ansicht (K34 §5.9) ----------
// Zustand der Ansicht (nicht im Spielstand): Unterseite, Liga, Archiv-Saison, gemerkte Spieler für den Vergleich
let STV='saison',STLG=0,STARCH=null,VGL=[];
const ST_SEITEN=[['saison','Saison'],['ehrungen','Ehrungen'],['rekorde','Rekorde'],['archiv','Archiv'],['karriere','Karriere']];
const stLigaWahl=lg=>`<div class="row">${LIGEN.map(l=>`<button class="${l===lg?'go':''}" aria-pressed="${l===lg}" onclick="STLG=${l};render()">${l}. Liga</button>`).join('')}</div>`;
const stLink=e=>e?`<a href="#" onclick="openP(${e[0]});return false">${esc(e[1])}</a> <span class="dim">(${esc(stVerein(e[2]))})</span>`:'–';
function statistikAnsicht(){const st=statS(),f={saison:stAnsichtSaison,ehrungen:stAnsichtEhrungen,rekorde:stAnsichtRekorde,archiv:stAnsichtArchiv,karriere:stAnsichtKarriere}[STV]||stAnsichtSaison;
  return`<div class="card"><div class="row between"><h2>Statistik</h2><div class="row">${ST_SEITEN.map(([k,l])=>`<button class="${STV===k?'go':''}" aria-pressed="${STV===k}" onclick="STV='${k}';render()">${l}</button>`).join('')}</div></div>
    <p class="dim">Alle Zahlen seit Beginn deines Spielstands (Saison ${stSaison(st.ab)}). Frühere Spiele zählen nicht.</p></div>${stVergleich()}${f(st)}`;}
function stAnsichtSaison(){const lg=STLG||myT().lg,l=[...saisonSammeln(S.season)[lg].values()];
  const zeile=(a,i,w)=>`<tr class="click ${a.p.team===S.my?'me':''}" onclick="openP(${a.p.id})"><td class="num">${i+1}.</td><td>${esc(a.p.n)}<br><span class="dim">${esc(stVerein(a.tid))}</span></td><td class="num"><b>${w(a)}</b></td></tr>`;
  const liste=(titel,c,w,leer)=>`<div class="card"><h3>${titel}</h3>${c.length?`<table><tbody>${c.slice(0,15).map((a,i)=>zeile(a,i,w)).join('')}</tbody></table>`:`<p class="dim">${leer}</p>`}</div>`;
  const maxNz=l.reduce((m,a)=>Math.max(m,a.nz),0),nMin=Math.max(3,Math.ceil(maxNz/2));
  const tore=l.filter(a=>a.t>0).sort((a,b)=>b.t-a.t||a.min-b.min),vorl=l.filter(a=>a.v>0).sort((a,b)=>b.v-a.v||a.min-b.min),sc=l.filter(a=>a.t+a.v>0).sort((a,b)=>(b.t+b.v)-(a.t+a.v)||b.t-a.t);
  const noten=l.filter(a=>a.nz>=nMin).sort((a,b)=>statSchnitt(a)-statSchnitt(b)),tw=l.filter(a=>a.p.pos==='TW'&&a.sp>0).sort((a,b)=>b.zn-a.zn||b.pa-a.pa);
  return`<div class="card"><div class="row between"><h3>${ligaName(lg)} ${stSaison(S.season)}</h3>${stLigaWahl(lg)}</div></div>
  <div class="grid">${liste('Torjäger',tore,a=>a.t,'Noch keine Tore.')}${liste('Vorlagen',vorl,a=>a.v,'Noch keine Vorlagen.')}${liste('Scorer (Tore und Vorlagen)',sc,a=>`${a.t+a.v} <span class="dim">(${a.t}+${a.v})</span>`,'Noch keine Scorer.')}
  ${liste(`Notenschnitt (ab ${nMin} Noten)`,noten,a=>stNote(Math.round(statSchnitt(a)*100)),'Noch zu wenige Noten.')}${liste('Torhüter: Spiele zu null',tw,a=>`${a.zn} <span class="dim">· ${a.pa} Paraden</span>`,'Noch keine Spiele.')}</div>${stKaderTabelle()}`;}
function stKaderTabelle(){const sq=squad(S.my).map(p=>({p,x:p.sst&&p.sst.s===S.season&&p.sst.tid===S.my?p.sst:null})).sort((a,b)=>((b.x&&b.x.sp)||0)-((a.x&&a.x.sp)||0)||((b.x&&b.x.ps)||0)-((a.x&&a.x.ps)||0));
  const z=({p,x})=>{const g=k=>x?x[k]:0;return`<tr class="click" onclick="openP(${p.id})"><td><span class="pos ${p.pos}">${p.pos}</span> ${esc(p.n)}</td><td class="num">${g('sp')}</td><td class="num">${g('min')}</td><td class="num">${g('t')}</td><td class="num">${g('v')}</td><td class="num">${x&&x.nz?stNote(Math.round(x.ns/x.nz*100)):'–'}</td><td class="num">${g('ge')}/${g('ro')}</td><td class="num">${g('ps')}/${g('pt')}/${g('pv')}</td></tr>`;};
  return`<div class="card"><h3>Dein Kader in dieser Saison</h3><div class="tw"><table><thead><tr><th>Spieler</th><th class="num">Sp</th><th class="num">Min</th><th class="num">T</th><th class="num">V</th><th class="num">Ø</th><th class="num" title="Gelb/Rot">G/R</th><th class="num" title="Pokal: Spiele/Tore/Vorlagen">Pokal</th></tr></thead><tbody>${sq.map(z).join('')}</tbody></table></div>
    <p class="dim">Liga: Spiele, Minuten, Tore, Vorlagen, Notenschnitt (1 sehr gut bis 6), Gelb/Rot. Pokal: Spiele/Tore/Vorlagen.</p></div>`;}
function stAnsichtEhrungen(st){const lg=STLG||myT().lg,A=st.arch.slice().reverse();
  if(!A.length)return`<div class="card"><p>Die ersten Ehrungen gibt es am Ende der Saison ${stSaison(st.ab)}.</p></div>`;
  return`<div class="card"><div class="row between"><h3>Ehrungen ${ligaName(lg)}</h3>${stLigaWahl(lg)}</div></div><div class="grid">${A.map(a=>{const x=a.ehr[lg];if(!x)return'';
    const elf=Object.keys(RSTAT.ehrung.elf).map(pos=>x.elf.filter(e=>e[3]===pos).map(e=>`${stLink(e)} ${stNote(e[4])}`).join(', ')).filter(Boolean);
    const tr=x.tr?`${x.tr[1]?`${esc(x.tr[1])} (${esc(stVerein(x.tr[0]))})`:`Trainer von ${esc(stVerein(x.tr[0]))}`} <span class="dim">(${de(x.tr[2],1)} Punkte über der Erwartung)</span>`:'–';
    return`<div class="card"><h3>${stSaison(a.s)}</h3><div class="facts">${fact('Meister',esc(stVerein(a.m[lg-1])))}${lg===1?fact('Pokalsieger',esc(stVerein(a.p)))+(a.sc!=null?fact('Supercup',esc(stVerein(a.sc))):''):''}</div>
      <p><b>Torschützenkönig:</b> ${x.ts.length?x.ts.map(e=>`${stLink(e)}, ${e[3]} Tore`).join(' und '):'–'}</p><p><b>Spieler der Saison:</b> ${stLink(x.sp)}</p><p><b>Talent der Saison:</b> ${stLink(x.ta)}</p>
      <p><b>Trainer der Saison:</b> ${tr}</p><p><b>Elf des Jahres (4-3-3):</b><br>${elf.join('<br>')||'–'}</p></div>`;}).join('')}</div>`;}
function stAnsichtRekorde(st){const zeile=(k,r,f)=>`<tr><td>${k}</td><td>${r?f(r):'<span class="dim">noch keiner</span>'}</td></tr>`,wann=r=>` <span class="dim">${esc(r.wann||'')}${r.echt?' · echter Rekord':''}</span>`;
  const liga=lg=>{const R0=rekLiga(lg);return`<div class="card"><h3>${ligaName(lg)}</h3><table><tbody>${zeile('Höchster Sieg',R0.sieg,r=>`<b>${r.hg}:${r.ag}</b> ${esc(r.txt)}${wann(r)}`)}
    ${zeile('Meiste Tore einer Saison',R0.tore,r=>`<b>${r.n}</b> ${esc(r.txt)}${wann(r)}`)}${zeile('Längste Serie ohne Niederlage',R0.serie,r=>`<b>${r.n} Spiele</b> ${esc(r.txt)}${wann(r)}`)}</tbody></table>
    ${lg===1?'<p class="dim">Startwerte sind die echten Bundesliga-Rekorde.</p>':'<p class="dim">Rekorde seit Spielbeginn.</p>'}</div>`;};
  const v=Object.entries(st.rek.v).map(([tid,r])=>`<div class="card"><h3>Vereinsrekorde ${esc(stVerein(+tid))}</h3><table><tbody>${zeile('Zuschauer',r.zus,x=>`<b>${de(x.n)}</b> ${esc(x.txt)}${wann(x)}`)}
    ${zeile('Höchster Sieg',r.sieg,x=>`<b>${x.hg}:${x.ag}</b> ${esc(x.txt)}${wann(x)}`)}${zeile('Teuerster Zugang',r.zu,x=>`<b>${fmt(x.n)}</b> ${esc(x.txt)}${wann(x)}`)}${zeile('Teuerster Abgang',r.ab,x=>`<b>${fmt(x.n)}</b> ${esc(x.txt)}${wann(x)}`)}</tbody></table>
    <p class="dim">Seit Spielbeginn, nur in deiner Zeit als Trainer.</p></div>`).join('');
  const w=st.rek.welt.transfer;
  return`<div class="grid">${LIGEN.map(liga).join('')}<div class="card"><h3>Rekordtransfer</h3><p>${w?`<b>${fmt(w.n)}</b> ${esc(w.txt)}${wann(w)}`:'<span class="dim">noch keiner</span>'}</p><p class="dim">Teuerster Zugang eines deutschen Vereins seit Spielbeginn.</p></div>${v}</div>`;}
function stAnsichtArchiv(st){if(!st.arch.length)return`<div class="card"><p>Das Archiv beginnt am Ende der Saison ${stSaison(st.ab)}.</p></div>`;
  const a=st.arch.find(x=>x.s===STARCH)||st.arch[st.arch.length-1],meine=new Set(st.st.map(x=>x.tid)),titel=new Map();
  st.arch.forEach(x=>x.m.forEach((id,i)=>{if(id==null)return;const k=id+':'+(i+1);titel.set(k,(titel.get(k)||0)+1);}));
  const meister=LIGEN.map(lg=>{const l=[...titel.entries()].filter(([k])=>+k.split(':')[1]===lg).sort((x,y)=>y[1]-x[1]);return`<p><b>${ligaName(lg)}:</b> ${l.map(([k,n])=>`${esc(stVerein(+k.split(':')[0]))} ${n}×`).join(', ')||'–'}</p>`;}).join('');
  const tab=lg=>`<div class="card"><h3>${ligaName(lg)}</h3><div class="tw"><table><thead><tr><th class="num">#</th><th>Verein</th><th class="num">Tore</th><th class="num">Pkt</th></tr></thead><tbody>${(a.tab[lg]||[]).map((r,i)=>`<tr class="${meine.has(r[0])?'me':''}"><td class="num">${i+1}</td><td>${esc(stVerein(r[0]))}${(a.auf[lg-1]||[]).includes(r[0])?' <span class="dim">(Aufstieg)</span>':''}</td><td class="num">${r[2]}:${r[3]}</td><td class="num"><b>${r[1]}</b></td></tr>`).join('')}</tbody></table></div></div>`;
  return`<div class="card"><div class="row between"><h3>Saison ${stSaison(a.s)}</h3><select aria-label="Saison im Archiv" onchange="STARCH=+this.value;render()">${st.arch.map(x=>`<option value="${x.s}" ${x.s===a.s?'selected':''}>${stSaison(x.s)}</option>`).join('')}</select></div>
    <div class="facts">${fact('Meister',esc(stVerein(a.m[0])))}${fact('Pokalsieger',esc(stVerein(a.p)))}${a.sc!=null?fact('Supercup',esc(stVerein(a.sc))):''}</div><h3>Titel seit Spielbeginn</h3>${meister}</div><div class="grid">${LIGEN.map(tab).join('')}</div>`;}
function stAnsichtKarriere(st){const G={meister:'Meister',pokal:'DFB-Pokal',supercup:'Supercup',aufstieg:'Aufstieg',trainer:'Trainer der Saison'},E=RSTAT.ehemalige,meine=new Set(st.st.map(x=>x.tid));
  const wo=x=>x.k==='meister'||x.k==='trainer'?` ${ligaName(x.lg)}`:x.k==='aufstieg'?` in die ${ligaName(x.lg)}`:'';
  const vit=st.vit.length?`<ul>${st.vit.slice().reverse().map(x=>`<li><b>${G[x.k]||x.k}</b>${wo(x)} · ${esc(stVerein(x.tid))} · ${stSaison(x.s)}</li>`).join('')}</ul>`:'<p class="dim">Noch leer.</p>';
  const stn=st.st.map(x=>`<tr><td>${esc(stVerein(x.tid))}</td><td>${stSaison(x.von[0])}</td><td>${x.bis?stSaison(x.bis[0]):'heute'}</td><td>${esc(x.g||'')}</td></tr>`).reverse().join('');
  const stufeName=k=>k?esc((REGELN.schwierigkeit.stufen[k]||{}).name||k):'–';
  const h=(S.hist||[]).slice().reverse().map(x=>`<tr><td>${stSaison(x.s)}</td><td>${esc(x.team)}</td><td class="num">${x.lg}.</td><td class="num">${x.pos}${x.ok?' ✓':''}</td><td class="num">${x.pk!=null?x.pk:'–'}</td><td class="num">${x.tf!=null?x.tf+':'+x.ta:'–'}</td><td class="num">${x.zus?de(x.zus):'–'}</td><td class="num">${x.um!=null?fmt(x.um):'–'}</td><td class="num">${x.erg!=null?fmt(x.erg):'–'}</td><td class="num">${x.ruf!=null?de(x.ruf):'–'}</td><td>${stufeName(x.st)}</td></tr>`).join('');
  const em=st.ehem.filter(e=>Object.entries(e.ver||{}).some(([t,n])=>meine.has(+t)&&n>=E.vereinSpiele)).sort((a,b)=>b.sp-a.sp).slice(0,25),el=st.ehem.slice().sort((a,b)=>b.sp-a.sp).slice(0,25);
  const ehz=e=>`<tr><td>${esc(e.n)} <span class="dim">${e.pos}</span>${e.ehr?' <span title="geehrt">★</span>':''}</td><td>${esc(stVerein(e.tid))}</td><td>${e.von!=null?stSaison(e.von):''} bis ${e.bis!=null?stSaison(e.bis):''}</td><td class="num">${e.sp}</td><td class="num">${e.t}</td><td class="num">${e.v}</td><td class="num">${stNote(e.no)}</td></tr>`;
  const ehTab=(titel,l)=>`<div class="card"><h3>${titel}</h3>${l.length?`<div class="tw"><table><thead><tr><th>Spieler</th><th>Verein</th><th>Zeit</th><th class="num">Sp</th><th class="num">T</th><th class="num">V</th><th class="num">Ø</th></tr></thead><tbody>${l.map(ehz).join('')}</tbody></table></div>`:'<p class="dim">Noch niemand.</p>'}</div>`;
  const fotos=(st.foto||[]).slice().reverse().slice(0,5).map(f=>`<p><b>${stSaison(f.s)} · ${esc(stVerein(f.tid))}</b><br><span class="dim">${f.n.map(esc).join(', ')}</span></p>`).join(''); // Mannschaftsfotos der Saisoneröffnung (K12b §5.2, U14)
  return`<div class="grid"><div class="card"><h3>Vitrine</h3>${vit}<p class="dim">Turnierpokale aus Testspielen gibt es noch nicht.</p></div><div class="card"><h3>Stationen</h3><table><thead><tr><th>Verein</th><th>von</th><th>bis</th><th>Ende</th></tr></thead><tbody>${stn}</tbody></table></div>${fotos?`<div class="card"><h3>Mannschaftsfotos</h3>${fotos}</div>`:''}</div>
  <div class="card"><h3>Saisons</h3><div class="tw"><table><thead><tr><th>Saison</th><th>Verein</th><th class="num">Liga</th><th class="num" title="Platz, ✓ Saisonziel erreicht">Platz</th><th class="num">Pkt</th><th class="num">Tore</th><th class="num" title="Zuschauerschnitt">Zusch.</th><th class="num">Umsatz</th><th class="num">Ergebnis</th><th class="num">Ruf</th><th>Stufe</th></tr></thead><tbody>${h||'<tr><td colspan="11" class="dim">Noch keine abgeschlossene Saison.</td></tr>'}</tbody></table></div></div>
  <div class="grid">${ehTab('Ehemalige deiner Vereine',em)}${ehTab('Ehemalige mit den meisten Ligaspielen',el)}</div>`;}
// Vergleich zweier Spieler (K34 §4): „Vergleichen“ auf der Spielerkarte merkt sich bis zu zwei Spieler
function vergleichen(id){VGL=[id,...VGL.filter(x=>x!==id)].slice(0,2);toast(VGL.length<2?'Gemerkt. Noch einen Spieler wählen, dann steht der Vergleich in der Statistik.':'Der Vergleich steht in der Statistik.');}
function stVergleich(){const l=VGL.map(id=>PIX.get(id)).filter(Boolean);if(!l.length)return'';
  if(l.length<2)return`<div class="card"><p class="dim">Vergleich: ${esc(l[0].n)} ist gemerkt. Auf einer zweiten Spielerkarte „Vergleichen“ wählen.</p></div>`;
  const z=l.map(p=>({p,x:statSaisonSumme(p,S.season),a:statSumme(p)})),r=(k,f)=>`<tr><td>${k}</td>${z.map(o=>`<td class="num">${f(o)}</td>`).join('')}</tr>`;
  return`<div class="card"><div class="row between"><h3>Vergleich</h3><button onclick="VGL=[];render()">Leeren</button></div><div class="tw"><table><thead><tr><th></th>${z.map(o=>`<th class="num"><a href="#" onclick="openP(${o.p.id});return false">${esc(o.p.n)}</a></th>`).join('')}</tr></thead><tbody>
    ${r('Verein',o=>esc(vereinName(o.p)))}${r('Position',o=>o.p.pos)}${r('Alter',o=>o.p.age)}
    ${r('Saison: Ligaspiele',o=>o.x.sp)}${r('Saison: Tore',o=>o.x.t)}${r('Saison: Vorlagen',o=>o.x.v)}${r('Saison: Notenschnitt',o=>o.x.nz?stNote(Math.round(o.x.ns/o.x.nz*100)):'–')}
    ${r('Karriere: Ligaspiele',o=>o.a.sp)}${r('Karriere: Tore',o=>o.a.t)}${r('Karriere: Vorlagen',o=>o.a.v)}${r('Karriere: Notenschnitt',o=>stNote(o.a.n))}${r('Karriere: Pokal (Sp/T/V)',o=>`${o.a.ps}/${o.a.pt}/${o.a.pv}`)}</tbody></table></div>
    <p class="dim">Nur Zahlen aus Spielen seit Spielbeginn, keine geschätzten Werte.</p></div>`;}
// Karte auf der Spielerkarte (fenster.js openP)
function statKarte(p){const l=statZeilen(p).slice().reverse(),a=statSumme(p),tw=p.pos==='TW';
  const z=l.slice(0,8).map(r=>{const g=i=>r[i]||0;return`<tr><td>${stSaison(g(KZ.s))}</td><td>${esc(stVerein(r[KZ.tid]))}</td><td class="num">${g(KZ.lg)?g(KZ.lg)+'.':'–'}</td><td class="num">${g(KZ.sp)}</td><td class="num">${g(KZ.t)}</td><td class="num">${g(KZ.v)}</td><td class="num">${stNote(g(KZ.n))}</td><td class="num">${g(KZ.ps)}/${g(KZ.pt)}</td>${tw?`<td class="num">${g(KZ.zn)}</td>`:''}</tr>`;}).join('');
  return`<div class="card"><div class="row between"><h3>Statistik</h3><button onclick="vergleichen(${p.id})">Vergleichen</button></div>
    ${l.length?`<div class="tw"><table><thead><tr><th>Saison</th><th>Verein</th><th class="num">Liga</th><th class="num">Sp</th><th class="num">T</th><th class="num">V</th><th class="num">Ø</th><th class="num" title="Pokal: Spiele/Tore">Pokal</th>${tw?'<th class="num" title="Spiele zu null">zu 0</th>':''}</tr></thead><tbody>${z}</tbody></table></div>`:''}
    <p class="dim">${a.sp||a.ps?`Seit Spielbeginn: ${a.sp} Ligaspiele, ${a.t} Tore, ${a.v} Vorlagen, Notenschnitt ${stNote(a.n)}${l.length>8?` (die letzten 8 von ${l.length} Zeilen)`:''}`:'Seit Spielbeginn noch kein Pflichtspiel'}${p.ehj!=null?` · zuletzt geehrt ${stSaison(p.ehj)}`:''}.</p></div>`;}
