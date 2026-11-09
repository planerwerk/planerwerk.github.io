// Match-Engine v2 (Konzept K04): Teamwerte aus Positionsanteilen mit getrennten Seiten (K06), Szenen pro Minute mit eigenem Zufallsstrom (K02),
// Chancentypen, Standards, Fouls mit Ort, Merkmale (K03), Ermüdung im Spiel, Erwartung vor dem Spiel, Noten gegen die Erwartung.
const slots=f=>RE.formationen[f]||RE.formationen['4-4-2'];
const posGruppe=pos=>RE.gruppe[pos]||pos;
const avail=p=>(p.inj<=0||gespritzt(p))&&!gesperrt(p); // Sperren gelten je Wettbewerb (K09, js/disziplin.js)
const TAUSCH={LV:'RV',RV:'LV',LM:'RM',RM:'LM',LA:'RA',RA:'LA',LS:'RS',RS:'LS'};
const seite=pos=>/^(LV|LM|LA|LS)$/.test(pos)?'L':/^(RV|RM|RA|RS)$/.test(pos)?'R':null;
const linksForm=pos=>seite(pos)==='R'?TAUSCH[pos]:pos;
const STD_POS={TW:'TW',AB:'IV',MF:'ZM',ST:'MS'};
// Eignung eines Spielers für einen Platz (K03 §3.1a): eigene Position 100 %, verwandte 75–92 %, Gruppe 70 %, sonst 55 %, Torwart und Feld 45 %
function eignung(p,pos){const E=RE.eignung,fp=p.fp||STD_POS[p.pos];if(fp===pos)return 1;const tr=p.eig&&p.eig[pos]?p.eig[pos]/100:0;
  const gA=posGruppe(fp),gB=posGruppe(pos);let w;
  if(gA==='TW'||gB==='TW')w=E.torwartFeld;
  else{let a=fp,b=pos;if(seite(a)==='R'){a=TAUSCH[a];b=TAUSCH[b]||b;}w=(E.nah[a]&&E.nah[a][b])||(E.nah[b]&&E.nah[b][a])||(gA===gB?E.gleicheGruppe:E.andereGruppe);
    if(hatMk(p,'vielseitig'))w=Math.min(E.vielseitigMax,w+E.vielseitig);}
  let f=Math.max(w,tr*100)/100;const s=seite(pos);
  if(s&&E.seitenPositionen.includes(pos)&&!hatMk(p,'beidfuessig')&&((s==='L'&&p.fuss==='R')||(s==='R'&&p.fuss==='L')))f*=E.falscheSeite;
  return f;}
// Wirkung eines Spielers auf einem Platz. fr: Frische im Spiel (sonst die gespeicherte), extra: Faktor aus der Lage (Kämpfer, wichtige Spiele)
function eff(p,pos,fr,extra){const f=fr==null?p.fit:fr;let z=zustandMit(p,f)*(gespritzt(p)?RMD.spritzen.wirkung:1);if(f<RE.ermuedung.schwelle)z*=1-RE.ermuedung.abfall*(RE.ermuedung.schwelle-f);return p.str*z*eignung(p,pos)*(extra||1);}
function zustandMit(p,fr){if(fr===p.fit)return zustand(p);const a=p.fit;p.fit=fr;const z=zustand(p);p.fit=a;return z;}
// Aufstellung: erst Spieler auf ihrer eigenen Position, dann aus derselben Gruppe, dann nach Wirkung
function fillXI(sl,pool,xi,used){sl.forEach((pos,i)=>{if(xi[i]!=null)return;let best=null,bv=-1;for(const p of pool){if(used.has(p.id))continue;const v=eff(p,pos);if(v>bv){bv=v;best=p;}}xi[i]=best?best.id:null;if(best)used.add(best.id);});return xi;}
function bestXI(tid,form,kader){const sl=slotsVerein(S.teams[tid],form),pool=(kader||squad(tid)).filter(avail),used=new Set(),xi=Array(sl.length).fill(null);
  const pass=ok=>sl.forEach((pos,i)=>{if(xi[i]!=null)return;let best=null,bv=-1;for(const p of pool){if(used.has(p.id)||!ok(p,pos))continue;const v=eff(p,pos);if(v>bv){bv=v;best=p;}}if(best){xi[i]=best.id;used.add(best.id);}});
  pass((p,pos)=>(p.fp||STD_POS[p.pos])===pos);pass((p,pos)=>posGruppe(p.fp||STD_POS[p.pos])===posGruppe(pos));
  return fillXI(sl,pool,xi,used);}
function myXI(){const t=myT(),sl=slotsVerein(t),pool=squad(S.my).filter(avail),used=new Set();
  const xi=sl.map((pos,i)=>{const id=(S.lineup||[])[i];const p=PIX.get(id);if(p&&p.team===S.my&&avail(p)&&!used.has(id)){used.add(id);return id;}return null;});
  return fillXI(sl,pool,xi,used);}

// Teamwerte (K04 §3.2): Kontrolle, Angriff Mitte, Angriff links und rechts, Abwehr Mitte, Abwehr links und rechts, Torwart
function teamWerte(sd,fr,off,lage){const T=RE.team,k=RE.staerke,acc={K:[],AM:[],AL:[],AR:[],DM:[],DL:[],DR:[]};let tw=k.leererPlatz;
  sd.xp.forEach(x=>{if(off&&off.has(x.p.id))return;const w=eff(x.p,x.pos,fr?fr[x.p.id]:null,lage?lage(x.p):1);
    if(x.pos==='TW'){tw=w;return;}const a=RE.anteile[linksForm(x.pos)]||[0,0,0,0,0],s=seite(x.pos),wd=w*(hatMk(x.p,'zweikampfstark')?RE.mk.zweikampfstark.abwehr:1);
    acc.K.push([a[0],w]);acc.AM.push([a[1],w]);acc.DM.push([a[3],wd]);
    if(s==='L'){acc.AL.push([a[2],w]);acc.DL.push([a[4],wd]);}else if(s==='R'){acc.AR.push([a[2],w]);acc.DR.push([a[4],wd]);}
    else{acc.AL.push([a[2]/2,w]);acc.AR.push([a[2]/2,w]);acc.DL.push([a[4]/2,wd]);acc.DR.push([a[4]/2,wd]);}});
  // Ein Einzelner kann nicht alles allein (K04 §10, „ein Star allein“): Was weit über dem Schnitt der anderen im Bereich liegt, zählt nur zum Teil.
  const daempfen=l=>{const sa=l.reduce((s,x)=>s+x[0],0),sw=l.reduce((s,x)=>s+x[0]*x[1],0);return l.map(([a,w])=>{if(sa-a<=0)return[a,w];const g=(sw-a*w)/(sa-a)+T.ueberragend.ab;return[a,w>g?g+(w-g)*T.ueberragend.anteil:w];});};
  const wert=l0=>{const l=daempfen(l0),sa=l.reduce((s,x)=>s+x[0],0);if(sa<=0)return k.leererPlatz;const m=l.reduce((s,x)=>s+x[0]*x[1],0)/sa,st=l.filter(x=>x[0]>=T.mindestAnteil).map(x=>x[1]);
    const v=st.length?(1-T.schwaechstes)*m+T.schwaechstes*Math.min(...st):m;return v*Math.min(T.anzahlMax,T.anzahl[0]+T.anzahl[1]*sa);};
  const w={TW:tw};for(const key in acc)w[key]=wert(acc[key]);
  const ta=RE.ausrichtung[sd.tac],ei=RE.einsatz[sd.ein],hm=sd.heim?RE.heim.alle:1;
  ['AM','AL','AR'].forEach(q=>w[q]*=(ta?ta.A:1)*(ei?ei.A:1)*hm);['DM','DL','DR'].forEach(q=>w[q]*=(ta?ta.D:1)*(ei?ei.D:1)*hm);w.K*=hm;w.TW*=hm;
  if(sd.stilF){w.K*=sd.stilF.kontrolle;['DM','DL','DR'].forEach(q=>w[q]*=sd.stilF.abwehr);}if(sd.mult&&sd.mult!==1)for(const k in w)w[k]*=sd.mult;
  return w;}
// Eine Mannschaft vor dem Anpfiff. A und D sind Gesamtwerte für Vorschau und Tauziehen.
function side(tid,home,neutral){
  if(tid>=1000){const a=S.am[tid-1000],v=a.str*(home&&!neutral?RE.heim.amateure:1),w={K:v,AM:v,AL:v,AR:v,DM:v,DL:v,DR:v,TW:v};return{id:tid,am:true,w,A:v,D:v,red:0,xp:[],xi:[],ein:'N',tac:'N'};}
  const t=S.teams[tid],sl=slotsVerein(t),xi=tid===S.my?myXI():bestXI(tid,t.form),xp=[];
  xi.forEach((id,i)=>{const p=id!=null?PIX.get(id):null;if(p)xp.push({p,pos:sl[i]});});
  const sd={id:tid,xp,xi:xi.filter(x=>x!=null),ein:t.ein,tac:RE.ausrichtung[t.tac]?t.tac:'N',form:t.form,heim:home&&!neutral,red:0};sd.w=teamWerte(sd);
  sd.A=0.5*sd.w.AM+0.25*(sd.w.AL+sd.w.AR);sd.D=0.4*sd.w.DM+0.2*(sd.w.DL+sd.w.DR)+0.2*sd.w.TW;return sd;}

// ---------- Hilfen für Szenen ----------
function waehle(liste,gew){const w=liste.map(gew);let r=R()*w.reduce((a,b)=>a+b,0);for(let i=0;i<liste.length;i++){if((r-=w[i])<=0)return liste[i];}return liste[liste.length-1];}
const mkZahl=(xp,k)=>xp.filter(x=>hatMk(x.p,k)).length;
const abnehmend=n=>RE.mk.abnehmend.slice(0,n).reduce((a,b)=>a+b,0);
const routeChance=(a,d)=>{const A=RE.angriff;return clamp(A.chance*Math.pow(a/d,A.exponent),A.min,A.max);};
const schuetzenFaktor=w=>{const S2=RE.schuetze;return clamp(1+S2.jePunkt*(w-S2.mitte),S2.min,S2.max);};
const torwartFaktor=w=>{const T=RE.torwart;return clamp(1-T.jePunkt*(w-T.mitte),T.min,T.max);};
// Druck der Abwehr auf den Abschluss, gemessen am Angriff: Kopfbälle Außenverteidigung gegen Flügel, alles andere Mitte gegen Mitte (K04 §10: Abwehr soll so viel bringen wie Angriff).
// Relativ statt gegen einen festen Wert, damit sich das Torniveau der Ligen nicht verschiebt.
const abwehrFaktor=(op,typ,me)=>{const A=RE.abwehr,k=typ==='kopf'||typ==='freistossFlanke',w=k?(op.DL+op.DR)/2:op.DM,a=k?(me.AL+me.AR)/2:me.AM;return clamp(1-A.jePunkt*(w-a-A.versatz),A.min,A.max);};
// Anteile der Angriffswege: dort, wo der Gegner schwächer ist, öfter
function wege(me,op){const wM=0.55*Math.pow(me.AM/op.DM,2),wL=0.225*Math.pow(me.AL/op.DR,2),wR=0.225*Math.pow(me.AR/op.DL,2),s=wM+wL+wR;return{M:wM/s,L:wL/s,R:wR/s};}
// Flügelspiel (K06 §5.1): mehr Angriffe über außen, gleichmäßig auf beide Seiten
function wegeStil(g,sd){const a=sd&&sd.stilF&&sd.stilF.aussen;if(!a)return g;const M=Math.max(0.05,g.M-a),k=(1-M)/Math.max(1e-9,g.L+g.R);return{M,L:g.L*k,R:g.R*k};}
const umsatz=mix=>Object.entries(mix).reduce((a,[k,v])=>a+v*RE.tor[k],0);

// Erwartete Tore vor dem Spiel (K04 §5.8), ohne Würfel: dieselben Formeln wie im Spiel als Mittelwert
function erwarteteTore(H,A){const Rr=RE.angriff,M=RE.mix,F=RE.fouls,T=RE.tor,eh=Math.pow(H.w.K,RE.besitz.exponent),ea=Math.pow(A.w.K,RE.besitz.exponent),pH=eh/(eh+ea);
  const teil=(me,op,pB)=>{const att=90*pB*Rr.proMinute,g=wege(me.w,op.w),cM=routeChance(me.w.AM,op.w.DM),cL=routeChance(me.w.AL,op.w.DR),cR=routeChance(me.w.AR,op.w.DL);
    const ch=att*(g.M*cM+g.L*cL+g.R*cR),fehl=att-ch,aussenFehl=att*(g.L*(1-cL)+g.R*(1-cR));
    const offen=att*(g.M*cM*umsatz(M.mitte)+(g.L*cL+g.R*cR)*umsatz(M.aussen));
    return{offen,ch,fehl,aussenFehl};};
  const h=teil(H,A,pH),a=teil(A,H,1-pH),k=Rr.konter*umsatz(M.konter);
  const lam=(x,y,me,op)=>{const ecken=x.aussenFehl*RE.ecken.aussenAbgewehrt+x.ch*(RE.aufsTor*RE.ecken.parade+RE.geblockt*RE.ecken.geblockt);
    const std=ecken*T.ecke+90*F.proMinute*(F.ort.flanke*T.freistossFlanke+F.ort.direkt*T.freistoss+F.ort.elfmeter*T.elfmeter);
    return(x.offen+y.fehl*k+std)*schuetzenFaktor(me.w.AM)*torwartFaktor(op.w.TW)*abwehrFaktor(op.w,'gross',me.w);};
  return[lam(h,a,H,A),lam(a,h,A,H)];}

// ---------- Das Spiel (K04, K05) ----------
// Ein Spiel ist ein Zustand, der Minute für Minute weiterläuft. Eingriffe (Wechsel, Taktik, Zurufe, Ansprache) wirken ab der nächsten Minute.
// Jede Minute würfelt aus ihrem eigenen Strom (K02), der Computer-Trainer aus einem eigenen. Wer neu lädt und dieselben Eingriffe macht, bekommt dasselbe Spiel.
// o: ko (K.-o.-Spiel), neutral, wichtig, auto:[heim,gast] (Computer-Trainer entscheidet; Standard: beide)
function sim(hid,aid,o={}){const G=spielAnlegen(hid,aid,o);while(!G.ende)G.minute();return G.ergebnis();}
function spielAnlegen(hid,aid,o={}){const saison=S.season,tag=S.tag;return mitStrom(strom('spiel',saison,tag,hid,aid),()=>spielAufbau(hid,aid,o,saison,tag));}
function spielAufbau(hid,aid,o,saison,tag){const Z=RL.zurufe,hs=hash32(['spiel',saison,tag,hid,aid].join('|')),hk=hash32(['ki',saison,tag,hid,aid].join('|'));
  const G={hid,aid,o,saison,tag,m:0,mNow:0,ende:false,verl:false,auto:[!(o.auto&&o.auto[0]===false),!(o.auto&&o.auto[1]===false)],
    rufe:[[],[],],spielerRuf:{},sv:{},ansp:[null,null],kf:[kabineFaktor(hid),kabineFaktor(aid)],plan:[[],[]],effektBis:0,verlauf:[],wz:[0,0],gel:[[],[]],ein:[[],[]],wechsel:[],minuten:{},raus:new Set()};
  // Zurufe und Ansprache als Faktoren (K05 §5.2, §5.4). w: Stärke nach Abnutzung, passt: Ansprache passt zur Lage (sonst halb umgekehrt)
  const aktiv=(r,m)=>m>r.m&&m<=r.m+Z.dauer;
  G.zf=(t,k)=>{const m=G.mNow;let f=1;const mit=(basis,w)=>{f*=1+(basis-1)*w;};
    G.rufe[t].forEach(r=>{if(!aktiv(r,m)||!r.w)return;const z=Z[r.art];
      if(r.art==='druck'){if(k==='angriff')mit(z.angriff,r.w);if(k==='abwehr')mit(z.abwehr,r.w);if(k==='frische')mit(z.frische,r.w);}
      else if(r.art==='ruhe'){if(k==='abwehr')mit(z.abwehr,r.w);if(k==='angriff')mit(z.angriff,r.w);if(k==='fouls')mit(z.fouls,r.w);}
      else if(r.art==='konzentration'){if(k==='patzer')mit(z.patzer,r.w);}});
    if(k==='zeitspiel'){let z=0;G.rufe[t].forEach(r=>{if(r.art==='zeit'&&aktiv(r,m)&&r.w)z=Math.max(z,r.w*Z.zeit.gelb);});return z;}
    if(k==='angriff')[0,1].forEach(u=>G.rufe[u].forEach(r=>{if(r.art==='zeit'&&aktiv(r,m)&&r.w)mit(Z.zeit.angriffe,r.w);}));
    const a=G.ansp[t];if(a&&m>45&&a.art==='beruhigen'&&(k==='fouls'||k==='patzer'))mit(RL.ansprache.beruhigen[k],a.f);
    return f;};
  // Zusammenhalt und Endspiel-Rede (K14 §5.6, K15 §5.4)
  G.bonus=(s,p,m)=>{const k=G.kf[s],E=RGS.mannschaft.endspiel;let f=k.f*(k.end?1+(hatEig(p,'nervenschwach')?E.nervenschwach:E.wirkung)*k.end:1);const a=G.ansp[s],A=RL.ansprache;
    if(a&&m>45){if(a.art==='motivieren')f*=1+A.motivieren.wirkung*a.f;else if(a.art==='augenzwinkernd')f*=1+A.augenzwinkernd.wirkung*a.f;
      else if(a.art==='fordern')f*=1+(hatEig(p,'kaempfer')?A.fordern.kaempfer:(hatEig(p,'nervenschwach')||hatEig(p,'diva'))?A.fordern.empfindlich:0)*a.f;}
    const r=G.spielerRuf[p.id];if(r&&m>r.m&&m<=r.m+Z.dauer)f*=1+r.f;return f;};
  G.foulSpieler=id=>{const r=G.spielerRuf[id];return r&&r.fouls&&G.mNow>r.m&&G.mNow<=r.m+Z.dauer?r.fouls:1;};
const wb=o.wb||'liga',H=mitWettbewerb(wb,()=>side(hid,true,o.neutral)),A=mitWettbewerb(wb,()=>side(aid,false,o.neutral)),Ss=[H,A];G.schiri=schiriFuer(hid,aid,hs);taktikAnlegen(Ss,o);
  const xg0=(H.am||A.am)?amateurErwartung(H,A):erwarteteTore(H,A);
  const ev=[],sc=[0,0],yel={},off=new Set(),inj=[],st={besitz:[0,0],schuesse:[0,0],aufsTor:[0,0],ecken:[0,0],fouls:[0,0],gross:[0,0],wege:[[0,0,0],[0,0,0]]},sz=[];
  const fr={};Ss.forEach(sd=>sd.xp.forEach(x=>fr[x.p.id]=x.p.fit));
  const E=RE.ermuedung,ermueden=min=>Ss.forEach((sd,s)=>{const zf=G.zf(s,'frische');sd.xp.forEach(x=>{const p=x.p;fr[p.id]=Math.max(RE.fitnessMin,fr[p.id]-(o.test?RTS.frische:1)*E.proMinute*min*(E.ko[0]+E.ko[1]*p.ko)*(hatMk(p,'ausdauernd')?0.75:1)*(sd.ein==='H'?E.hart:1)*zf*(sd.stilF?sd.stilF.frische:1)*(sd.frischeF||1));});});
  // Lage: Kämpfer und Führungsspieler bei Rückstand, Nervenschwache und Trainingsweltmeister in wichtigen Spielen und knapper Schlussphase
  const EG=RE.eigenschaften,lageFn=(s,m)=>{const hinten=sc[s]<sc[1-s],eng=m>=EG.engAb&&Math.abs(sc[0]-sc[1])<=1,wichtig=o.wichtig||eng,fue=hinten&&Ss[s].xp.some(x=>hatEig(x.p,'fuehrungsspieler'))?EG.fuehrungsspieler:1;
    return p=>(hinten&&hatEig(p,'kaempfer')?EG.kaempfer:1)*(wichtig&&hatEig(p,'nervenschwach')?1-(1-EG.nervenschwach)*Math.max(0,1+RST.wirkung.psycho.nervenschwach*stabFaktor(Ss[s].id,'psycho')):1)*(wichtig&&hatEig(p,'trainingsweltmeister')?EG.trainingsweltmeister:1)*fue*G.bonus(s,p,m);};
  const werte=m=>Ss.map((sd,s)=>sd.am?sd.w:teamWerte(sd,fr,off,lageFn(s,m)));
  let W=werte(0);
  const torEv=(m,s,p,art)=>{sc[s]++;ev.push({m,s,t:'G',p:p?p.id:null,n:p?p.n:'Eigentor',sc:[...sc],art});W=werte(m);};
  const keeperName=s=>{const k=Ss[1-s].xp.find(x=>x.pos==='TW');return k?k.p.n:'der Torwart';};
  const imSpiel=s=>Ss[s].xp.filter(x=>!off.has(x.p.id));
  const kandidaten=(s,typ)=>imSpiel(s).filter(x=>x.pos!=='TW'||typ==='notfall');
  const schuetzeWahl=(s,typ)=>{const c=kandidaten(s,typ);if(!c.length)return null;const G=RE.schuetzen[typ]||RE.schuetzen.halb,Mk=RE.mk;
    return waehle(c,x=>(G[linksForm(x.pos)]||0.3)*Math.pow(x.p.str/RE.schuetzen.mitte,RE.schuetzen.exponent)*((typ==='gross'||typ==='halb')&&hatMk(x.p,'torjaeger')?Mk.torjaeger.wahl:1)*((typ==='kopf'||typ==='ecke')&&hatMk(x.p,'kopfballstark')?Mk.kopfballstark.wahl:1)*(typ==='fern'&&hatMk(x.p,'weitschuetze')?Mk.weitschuetze.anteil:1)).p;};
  const torwart=s=>{const k=Ss[1-s].xp.find(x=>x.pos==='TW'&&!off.has(x.p.id));return k?k.p:null;};
  // Standardschützen (K06 §5.8): der eingeteilte, wenn er auf dem Platz steht, sonst der nächste der Liste
  const schuetzeFuer=(s,art)=>{const sd=Ss[s];if(sd.am)return null;const t=S.teams[sd.id],l=t.schuetzen&&t.schuetzen[art];if(!l)return null;for(const id of [].concat(l)){const x=imSpiel(s).find(y=>y.p.id===id);if(x)return x.p;}return null;};
  // Abschluss: Tor, Parade, vorbei oder geblockt. Ergebnis 'tor', 'parade', 'vorbei'
  const abschluss=(m,s,typ,schuetze,basisArt,extra=1)=>{if(!schuetze)return'vorbei';const Mk=RE.mk,kp=torwart(s),opW=W[1-s];st.schuesse[s]++;if(typ==='gross')st.gross[s]++;
    let p=RE.tor[typ]*extra*schuetzenFaktor(schuetze.str*zustandMit(schuetze,fr[schuetze.id]==null?schuetze.fit:fr[schuetze.id]))*torwartFaktor(opW.TW)*(basisArt==='patzer'?1:abwehrFaktor(opW,typ,W[s]))*(1+0.01*(schuetze.sv||0));
    if(typ==='gross'||typ==='halb'){if(hatMk(schuetze,'torjaeger'))p*=Mk.torjaeger.tor;if(hatMk(schuetze,'abschlussschwach'))p*=Mk.abschlussschwach;if(kp&&hatMk(kp,'reflexe'))p*=Mk.reflexe;
      if(typ==='gross'){const n=mkZahl(imSpiel(1-s),'stellungssicher');if(n)p*=Math.pow(Mk.stellungssicher.gross,abnehmend(n));}}
    if(typ==='kopf'||typ==='ecke'||typ==='freistossFlanke'){if(hatMk(schuetze,'kopfballstark'))p*=Mk.kopfballstark.tor;if(hatMk(schuetze,'kopfballschwach'))p*=Mk.kopfballschwach;
      const n=mkZahl(imSpiel(1-s),'kopfballstark');if(n)p*=Math.pow(Mk.kopfballstark.abwehr,abnehmend(n));if(kp&&hatMk(kp,'strafraum'))p*=Mk.strafraum;if(kp&&hatMk(kp,'fliegenfaenger'))p*=Mk.fliegenfaenger;}
    if(typ==='fern'&&hatMk(schuetze,'weitschuetze'))p*=Mk.weitschuetze.tor;
    if(hatMk(schuetze,'beidfuessig'))p*=Mk.beidfuessig;if((typ==='ecke'||typ==='freistossFlanke')&&Ss[s].stdF)p*=Ss[s].stdF;
    p=clamp(p,0.005,0.9);
    const flanke=typ==='kopf'||typ==='ecke'||typ==='freistossFlanke';
    if(R()<p){torEv(m,s,schuetze,basisArt||typ);sz.push([schuetze.id,typ,1]);
      // Lernen (K03 §5.6): Gegentor nach Flanke. Das Kopfballduell verliert der schwächste Verteidiger, ob der Torwart danebengegriffen hat, entscheidet die Auswertung.
      if(flanke){if(kp)sz.push([kp.id,'flanke_tw',0]);const ab=imSpiel(1-s).filter(x=>posGruppe(x.pos)==='AB');if(ab.length)sz.push([ab.reduce((a,b)=>b.p.str<a.p.str?b:a).p.id,'kopfballduell',0]);}
      return'tor';}
    sz.push([schuetze.id,typ,0]);
    if(R()<Math.max(0,RE.aufsTor-p)/(1-p)){st.aufsTor[s]++;if(kp)sz.push([kp.id,flanke?'flanke_tw':(typ==='gross'||typ==='halb')?'parade_nah':'parade',1]);ev.push({m,s,t:'C',n:schuetze.n,gk:keeperName(s),art:typ});return'parade';}
    ev.push({m,s,t:'C',n:schuetze.n,gk:keeperName(s),art:typ,vorbei:1});return R()<RE.geblockt/(1-RE.aufsTor)?'geblockt':'vorbei';};
  const ecke=(m,s)=>{st.ecken[s]++;const c=imSpiel(s);if(!c.length)return;const gw=schuetzeFuer(s,'ecke'),nehmer=gw?{p:gw}:(c.find(x=>hatMk(x.p,'flankengeber'))||null);
    // Ecke: mit Anteil eckeSchuss folgt ein Kopfball oder Abpraller. Die Torquote je Ecke (tor.ecke) gilt über alle Ecken.
    if(R()<RE.eckeSchuss){const sch=schuetzeWahl(s,'ecke');const r=abschluss(m,s,'ecke',sch,'ecke',(nehmer&&hatMk(nehmer.p,'flankengeber')?RE.mk.flankengeber.ecke:1)/RE.eckeSchuss);if(r==='tor'&&nehmer)sz.push([nehmer.p.id,'ecke_tor',1]);}};
  // Standard nach Foul des Gegners an Mannschaft s
  const standard=(m,s)=>{const O=RE.fouls.ort,r=R(),c=imSpiel(s),pe=O.elfmeter*G.schiri.el;if(!c.length)return;
    if(r<pe){const sch=schuetzeFuer(s,'elfmeter')||c.map(x=>x.p).sort((x,y)=>(hatMk(y,'elfmeter')-hatMk(x,'elfmeter'))||(({ST:3,MF:2,AB:1,TW:0})[y.pos]-({ST:3,MF:2,AB:1,TW:0})[x.pos])||(y.str-x.str))[0],kp=torwart(s);
      st.schuesse[s]++;const q=clamp(RE.tor.elfmeter+(hatMk(sch,'elfmeter')?RE.mk.elfmeter-RE.tor.elfmeter:0)-(hatEig(sch,'nervenschwach')?RE.eigenschaften.nervenschwachElfmeter:0)-(kp&&hatMk(kp,'elfmetertoeter')?RE.tor.elfmeter-RE.mk.elfmetertoeter:0),0.4,0.95);
      if(R()<q){torEv(m,s,sch,'elfmeter');sz.push([sch.id,'elfmeter',1]);}else{sz.push([sch.id,'elfmeter',0]);if(kp)sz.push([kp.id,'elfmeter_gehalten',1]);ev.push({m,s,t:'C',n:sch.n,gk:keeperName(s),art:'elfmeter',x:`${sch.n} vergibt den Elfmeter!`});}}
    else if(r<pe+O.direkt){const sch=schuetzeFuer(s,'freistoss')||c.map(x=>x.p).filter(p=>p.pos!=='TW').sort((x,y)=>(hatMk(y,'freistoss')-hatMk(x,'freistoss'))||(y.str-x.str))[0];if(!sch)return;
      st.schuesse[s]++;const p=(hatMk(sch,'freistoss')?RE.mk.freistoss:RE.tor.freistoss)*torwartFaktor(W[1-s].TW);if(R()<p){torEv(m,s,sch,'freistoss');sz.push([sch.id,'freistoss',1]);}else{sz.push([sch.id,'freistoss',0]);ev.push({m,s,t:'C',n:sch.n,gk:keeperName(s),art:'freistoss'});}}
    else if(r<pe+O.direkt+O.flanke){if(R()<RE.eckeSchuss){const sch=schuetzeWahl(s,'ecke');abschluss(m,s,'freistossFlanke',sch,'freistossFlanke',1/RE.eckeSchuss);}}};
  const angriff=(m,s,faktor)=>{const me=W[s],op=W[1-s],g=wegeStil(wege(me,op),Ss[s]),r=R(),weg=r<g.M?'M':r<g.M+g.L?'L':'R';
    const a=weg==='M'?me.AM:weg==='L'?me.AL:me.AR,d=weg==='M'?op.DM:weg==='L'?op.DR:op.DL;st.wege[s][weg==='M'?0:weg==='L'?1:2]++;
    if(R()<routeChance(a,d)*faktor*(Ss[s].kreis||1)){const M=RE.mix,Mk=RE.mk,xs=imSpiel(s);let mix=Object.assign({},weg==='M'?M.mitte:M.aussen);const sf=Ss[s].stilF;if(sf)for(const q in sf.mix)if(mix[q]!=null)mix[q]*=sf.mix[q];
      const nf=mkZahl(xs,'flankengeber');if(weg!=='M'&&nf)mix.kopf*=Math.pow(Mk.flankengeber.kopf,abnehmend(nf));
      const nw=mkZahl(xs,'weitschuetze');if(nw)mix.fern*=Math.pow(Mk.weitschuetze.anteil,abnehmend(nw)*0.5);
      let typ=waehle(Object.keys(mix),k=>mix[k]);
      let drib=false;if(typ==='halb'){const nd=mkZahl(xs,'dribbler');if(nd&&R()<Mk.dribbler.upgrade*abnehmend(nd)){typ='gross';drib=true;}}
      const sch=schuetzeWahl(s,typ);if(drib&&sch)sz.push([sch.id,'dribbling',1]);
      const res=abschluss(m,s,typ,sch);
      if(res==='parade'&&R()<RE.ecken.parade)ecke(m,s);else if(res==='geblockt'&&R()<RE.ecken.geblockt)ecke(m,s);}
    else{if(weg!=='M'&&R()<RE.ecken.aussenAbgewehrt){ecke(m,s);return;}
      // Konter des Gegners (schnell erhöht, ballsicher beim Angreifer und stellungssicher mindern)
      const Mk=RE.mk,ns=mkZahl(imSpiel(1-s),'schnell'),nb=mkZahl(imSpiel(s),'ballsicher'),nl=mkZahl(imSpiel(1-s),'langsam'),nsA=mkZahl(imSpiel(s),'schnell');
      let k=RE.angriff.konter*Math.pow(Mk.schnell.konter,abnehmend(ns))*Math.pow(Mk.ballsicher.konter,abnehmend(nb))/Math.pow(Mk.langsam,abnehmend(nl))*Math.pow(Mk.schnell.abwehr,abnehmend(nsA))*(Ss[1-s].stilF?Ss[1-s].stilF.konterEigen:1)*(Ss[s].stilF?Ss[s].stilF.konterGegen:1);
      if(R()<k*faktor){const typ=waehle(Object.keys(RE.mix.konter),q=>RE.mix.konter[q]*((Ss[1-s].stilF&&Ss[1-s].stilF.konterMix[q])||1));const r2=abschluss(m,1-s,typ,schuetzeWahl(1-s,typ),'konter');if(r2==='parade'&&R()<RE.ecken.parade)ecke(m,1-s);}}};
  // Fouls und Karten (K09 §5.1): Foulart würfeln, Kartenwahrscheinlichkeit mit Strenge, Einsatz, Hitzkopf, Müdigkeit, Rückstand in der Schlussphase
  const kartenFaktor=(s,p,m)=>{const K=RD.faktoren,sd=Ss[s],d=sc[s]-sc[1-s];return G.schiri.st*(sd.ein==='H'?K.hart:sd.ein==='F'?K.fair:1)*(hatEig(p,'hitzkopf')?K.hitzkopf:1)
    *((fr[p.id]!=null?fr[p.id]:p.fit)<K.muedeUnter?K.muede:1)*(d<0&&m>=K.rueckstandAb?K.rueckstand:1)*(yel[p.id]?K.mitGelb.karte:1);};
  const platzverweis=(m,s,p,art,x,opfer)=>{off.add(p.id);Ss[s].red++;ev.push({m,s,t:'R',p:p.id,n:p.n,art,x,opfer});sz.push([p.id,'rot',0]);W=werte(m);};
  const gelbeKarte=(m,s,p,x)=>{sz.push([p.id,'gelb',0]);if(yel[p.id]){off.add(p.id);Ss[s].red++;ev.push({m,s,t:'R',p:p.id,n:p.n,gy:1});W=werte(m);}else{yel[p.id]=1;ev.push({m,s,t:'Y',p:p.id,n:p.n,x});}};
  const FOULARTEN=Object.keys(RD.foulArten);
  const foul=(m,s)=>{const F=RE.fouls,K=RD.faktoren,sd=Ss[s];if(sd.am)return;const c=imSpiel(s).filter(x=>x.pos!=='TW');if(!c.length)return;
    const nU=mkZahl(c,'ungestuem'),f=F.proMinute*(sd.ein==='H'?F.hart:sd.ein==='F'?F.fair:1)*(1+(F.ungestuem-1)*nU/c.length*3)*G.zf(s,'fouls')*(sd.stilF?sd.stilF.fouls:1);
    if(R()>=f)return;st.fouls[s]++;const t=waehle(c,x=>(F.gewicht[linksForm(x.pos)]||1)*(hatMk(x.p,'ungestuem')?F.ungestuem:1)*(yel[x.p.id]&&!hatEig(x.p,'hitzkopf')?K.mitGelb.foul:1)*G.foulSpieler(x.p.id)).p;
    const ak=waehle(FOULARTEN,k=>RD.foulArten[k].anteil),A=RD.foulArten[ak],Q=RMD.risiko,o=Ss[1-s];
    // Verletzung durch das Foul (K10 §5.1): je erlittenem Foul nach Schwere, harter Einsatz des Foulenden ×1,5
    const opfer=R()<Q.foul*(o.test?RTS.risiko:1)*(Q.schwere[ak]||1)*(sd.ein==='H'?Q.hartGegner:1)*teamGew(o,off,vgw)?cardPick(o,off,vgw):null;if(opfer)verletzt(m,1-s,opfer,'foul');
    const k=kartenFaktor(s,t,m),r=R();
    if(A.rot&&r<A.rot*k)platzverweis(m,s,t,A.art,A.art==='notbremse'?`Notbremse! Rot für ${t.n}`:null,opfer?opfer.id:null);
    else if(A.gelb&&r<(A.rot?A.rot*k:0)+A.gelb*k)gelbeKarte(m,s,t);
    standard(m,1-s);};
  // Meckern, Unsportlichkeit, Tätlichkeit (K09 §3.1): ohne Foul, ein Zufallswert je Minute und Mannschaft
  const unsportlich=(m,s)=>{const D=RD,K=D.faktoren,pm=D.meckern.jeSpiel/90*G.schiri.st,pt=D.taetlichkeit.jeSpiel/90,r=R();if(r>=pm+pt)return;
    const c=imSpiel(s);if(!c.length)return;
    if(r<pm){const p=waehle(c,x=>(hatEig(x.p,'hitzkopf')?K.hitzkopfMeckern:1)*(yel[x.p.id]&&!hatEig(x.p,'hitzkopf')?K.mitGelb.karte:1)).p;
      if(R()<D.meckern.rot)platzverweis(m,s,p,'unsportlich',`Rot für ${p.n} nach einer Beleidigung des Schiedsrichters`);else gelbeKarte(m,s,p,`Gelb wegen Meckerns für ${p.n}`);}
    else{const p=waehle(c,x=>hatEig(x.p,'hitzkopf')?K.hitzkopfTaetlichkeit:1).p,schwer=R()<D.taetlichkeit.schwer;
      platzverweis(m,s,p,schwer?'schwer':'taetlichkeit',`Tätlichkeit! Rot für ${p.n}`);}};
  const amateurKarten=(m,s)=>{const K=RE.karten;if(R()<K.gelb){ev.push({m,s,t:'Y',p:null,n:'ein Amateur'});}};
  // Verletzungen ohne Foul (K10 §5.1): Zweikampf (Kontakt) und Überlastung (Muskel, nach Frische, Alter, Spielstil, Rückfallfenster)
  // Risiko je Spieler: der feste Teil (Robustheit, anfällig, Belastung, Alter, Rückfall, Athletiktrainer) einmal pro Spiel, die Frische jede Minute
  const vgC=new Map(),ueC=new Map(),vgw=p=>{let x=vgC.get(p.id);if(x==null){x=verletzGew(p);vgC.set(p.id,x);}return x;};
  const ueFest=p=>{let x=ueC.get(p.id);if(x==null){const Q=RMD.risiko;x=(p.age>=Q.altAb?Q.alt:1)*rueckfallFaktor(p)*stabFaktor(p.team,'athletik');ueC.set(p.id,x);}return x;};
  const ueW=p=>{const Q=RMD.risiko,f=fr[p.id];let x=f<Q.frischeAb?1+Q.frischeJePunkt*(Q.frischeAb-f):1;if(f<Q.frischeKritisch)x*=Q.kritisch;return vgw(p)*ueFest(p)*x;};
  const verletzt=(m,s,p,q)=>{if(!p||inj.find(x=>x.id===p.id))return;inj.push({id:p.id,q});ev.push({m,s,t:'I',p:p.id,n:p.n,q});fr[p.id]=Math.min(fr[p.id],RL.verletztFrische);W=werte(m);};
  const verletzung=(m,s)=>{const sd=Ss[s];if(sd.am)return;const Q=RMD.risiko,r=R(),
      pK=Q.kollision*(o.test?RTS.risiko:1)*teamGew(sd,off,vgw),pU=Q.ueberlastung*(o.test?RTS.risiko:1)*teamGew(sd,off,ueW)*(sd.stil==='pressing'||sd.stil==='konter'?Q.stil:1);
    if(r<pK)verletzt(m,s,cardPick(sd,off,vgw),'kollision');else if(r<pK+pU)verletzt(m,s,cardPick(sd,off,ueW),'ueberlastung');};
  const patzer=(m,s)=>{const T=RE.torwart,kp=Ss[s].xp.find(x=>x.pos==='TW'&&!off.has(x.p.id));if(!kp)return;
    if(R()<T.patzer/90*(hatMk(kp.p,'unkonzentriert')?T.unkonzentriert:1)*G.zf(s,'patzer')){sz.push([kp.p.id,'patzer',1]);abschluss(m,1-s,'gross',schuetzeWahl(1-s,'gross'),'patzer');}};
  const minute=(m,verl)=>{
    if(m%15===1&&m>1){ermueden(15);W=werte(m);}
    const eh=Math.pow(W[0].K,RE.besitz.exponent),ea=Math.pow(W[1].K,RE.besitz.exponent),s=R()<eh/(eh+ea)?0:1;st.besitz[s]++;
    // Spielstand und Unterzahl
    const V=RE.verlauf,fakt=t=>{let A=1,D=1;const d=sc[t]-sc[1-t],dop=m>=V.abMinute?2:1;if(d>0){A*=Math.pow(V.fuehrung.A,dop);}else if(d<0){A*=Math.pow(V.rueckstand.A,dop);}else if(m>=V.abMinute)A*=V.gleich.A;A*=Math.pow(V.rot.A,Ss[t].red);return A*G.zf(t,'angriff');};
    const dfak=t=>{const d=sc[t]-sc[1-t],dop=m>=V.abMinute?2:1;let D=d>0?Math.pow(V.fuehrung.D,dop):d<0?Math.pow(V.rueckstand.D,dop):1;return D*Math.pow(V.rot.D,Ss[t].red)*G.zf(t,'abwehr');};
    const angriffsChance=RE.angriff.proMinute*fakt(s)/dfak(1-s)*(verl?RE.verlaengerung:1)*((RE.ausrichtung[Ss[s].tac]||{T:1}).T||1)*(Ss[s].stilF?Ss[s].stilF.angriffe:1);
    if(Ss[s].am||Ss[1-s].am){if(R()<angriffsChance)amateurAngriff(m,s,verl);}
    else if(R()<angriffsChance)angriff(m,s,verl?RE.verlaengerung:1);
    [0,1].forEach(t=>{if(Ss[t].am)amateurKarten(m,t);else{foul(m,t);unsportlich(m,t);}verletzung(m,t);if(!Ss[t].am)patzer(m,t);if(!Ss[t].am&&G.zf(t,'zeitspiel')>0)zeitspiel(m,t);});
    G.verlauf.push([m,s]);};
  // Zeitspiel (Zuruf „Zeit schinden“): Gelbe Karten für Zeitspiel
  const zeitspiel=(m,t)=>{if(R()<RL.zurufe.zeit.gelbJeMinute*G.zf(t,'zeitspiel')){const c=imSpiel(t).filter(x=>!yel[x.p.id]);if(!c.length)return;const p=waehle(c,()=>1).p;yel[p.id]=1;ev.push({m,s:t,t:'Y',p:p.id,n:p.n,x:`Gelb wegen Zeitspiel für ${p.n}`});sz.push([p.id,'gelb',0]);}};
  // Spiele gegen Amateurklubs: vereinfacht mit Teamwerten aus ihrer Stärke
  const amateurAngriff=(m,s,verl)=>{const me=W[s],op=W[1-s];if(R()<routeChance(me.AM,op.DM)*(verl?RE.verlaengerung:1)){const typ=waehle(Object.keys(RE.mix.mitte),k=>RE.mix.mitte[k]);
      if(Ss[s].am){st.schuesse[s]++;if(R()<RE.tor[typ]*torwartFaktor(op.TW)){sc[s]++;ev.push({m,s,t:'G',p:null,n:rname(),sc:[...sc],art:typ});}}else abschluss(m,s,typ,schuetzeWahl(s,typ));}};
  [H,A].forEach(sd=>sd.xp.forEach(x=>G.minuten[x.p.id]=[0,null]));
  G.Ss=Ss;G.H=H;G.A=A;G.xg0=xg0;G.ev=ev;G.sc=sc;G.st=st;G.fr=fr;G.yel=yel;G.off=off;G.inj=inj;G.sz=sz;G.pen=null;
  G.bank=mitWettbewerb(wb,()=>[bankWaehlen(H),bankWaehlen(A)]);
  G.werte=()=>W;
  // Eine Minute spielen. Nach der 90. Minute ist Schluss, im K.-o.-Spiel bei Gleichstand Verlängerung und Elfmeterschießen.
  G.minute=()=>{if(G.ende)return;if(G.elf){G.elfmeterSchuss();return;}const m=G.m+1;G.verl=m>90;G.mNow=m;
    G.plan.forEach((pl,s)=>{const f=pl.filter(x=>x.ab<=m);if(f.length){f.forEach(x=>umstellen(s,x));G.plan[s]=pl.filter(x=>x.ab>m);W=werte(m);}});
    [0,1].forEach(s=>{if(G.auto[s]&&!Ss[s].am)kiTrainer(s,m);});
    if(m<=G.effektBis+1||m===46)W=werte(m);
    mitStrom(stromNr(hs,m),()=>minute(m,G.verl));G.m=m;
    // Gleichstand: im K.-o.-Spiel, mit Hinspiel nach beiden Spielen (Relegation). Supercup ohne Verlängerung direkt ins Elfmeterschießen (K13).
    const gleich=o.agg?sc[0]+o.agg[0]===sc[1]+o.agg[1]:sc[0]===sc[1];
    if(m===90&&o.ko&&o.elfDirekt&&gleich)G.elf=elfmeterAnlegen();
    else if((m===90&&!(o.ko&&gleich))||m===120){if(m===120&&gleich)G.elf=elfmeterAnlegen();else G.ende=true;}};
  // Elfmeterschießen (K05 §4.6): Schuss für Schuss in der Reihenfolge der Mannschaften, beendet, sobald es entschieden ist
  const elfmeterAnlegen=()=>({z:strom('spiel',saison,tag,hid,aid,'elfmeter'),k:0,t:[0,0],n:[0,0]});
  G.elfmeterReihe=[0,1].map(s=>{const l=elfmeterReihe(Ss[s]).map(p=>p.id),t=!Ss[s].am&&S.teams[Ss[s].id],w=((t&&t.schuetzen&&t.schuetzen.elfmeter)||[]).filter(id=>l.includes(id));return[...w,...l.filter(id=>!w.includes(id))];});
  G.elfmeterSchuss=()=>{const E=G.elf;if(!E||G.ende)return;const s=E.k%2,reihe=G.elfmeterReihe[s].filter(id=>Ss[s].xp.some(x=>x.p.id===id&&!off.has(id))),
      sch=PIX.get(reihe[E.n[s]%Math.max(1,reihe.length)]),kp=torwart(s),tor=mitStrom(E.z,()=>R()<elfmeterQuote(sch,kp));
    E.n[s]++;if(tor)E.t[s]++;E.k++;ev.push({m:120,s,t:'E',p:sch?sch.id:null,n:sch?sch.n:'ein Spieler',tor,st:[...E.t],nr:E.n[s]});
    const rest=s0=>Math.max(0,5-E.n[s0]),fertig=E.n[0]>=5&&E.n[1]>=5?(E.n[0]===E.n[1]&&E.t[0]!==E.t[1]):(E.t[0]+rest(0)<E.t[1]||E.t[1]+rest(1)<E.t[0]);
    if(fertig){G.pen=[...E.t];ev.push({m:120,s:G.pen[0]>G.pen[1]?0:1,t:'P',pen:G.pen});G.ende=true;}};
  G.pause=()=>G.elf&&!G.ende?(G.elf.k===0?'elfmeter':null):G.m===45?'halbzeit':G.m===90&&!G.ende?'verlaengerung':G.m===105?'halbzeitVerlaengerung':null;
  // Wechsel (K05 §3.2): 5 Wechsel in 3 Gelegenheiten, Pausen zählen nicht, in der Verlängerung einer mehr
  G.wechselFrei=s=>{const W5=RL.wechsel,max=o.test?RTS.wechsel:W5.anzahl+(G.m>=90&&o.ko?W5.verlaengerung:0),gel=o.test?99:W5.gelegenheiten+(G.m>=90&&o.ko?W5.verlaengerung:0);
    if(G.wz[s]>=max)return{ok:false,grund:`alle ${max} Wechsel verbraucht`};if(G.pause()||G.gel[s].includes(G.m))return{ok:true};
    if(G.gel[s].length>=gel)return{ok:false,grund:`alle ${gel} Wechsel-Gelegenheiten verbraucht`};return{ok:true};};
  G.wechseln=(s,ausId,einId)=>{if(G.ende)return{ok:false,grund:'Das Spiel ist vorbei.'};const fw=G.wechselFrei(s);if(!fw.ok)return fw;
    const x=Ss[s].xp.find(y=>y.p.id===ausId),p=PIX.get(einId);if(!x||off.has(ausId)||G.raus.has(ausId))return{ok:false,grund:'Dieser Spieler ist nicht auf dem Platz.'};
    if(!p||!G.bank[s].includes(einId))return{ok:false,grund:'Dieser Spieler sitzt nicht auf der Bank.'};
    const aus=x.p;x.p=p;fr[p.id]=p.fit;G.minuten[aus.id][1]=G.m;G.minuten[p.id]=[G.m,null];G.bank[s]=G.bank[s].filter(i=>i!==einId);G.raus.add(aus.id);G.ein[s].push(p.id);
    G.wz[s]++;if(!G.pause()&&!G.gel[s].includes(G.m))G.gel[s].push(G.m);G.wechsel.push({s,m:G.m,aus:aus.id,ein:p.id});
    ev.push({m:G.m,s,t:'S',p:p.id,n:p.n,aus:aus.n});W=werte(G.m);return{ok:true};};
  // Taktik im Spiel (K05 §5.1): Grundordnung nach 5 Minuten, Ausrichtung und Einsatz nach 2. In der Halbzeit wirken Ausrichtung und Einsatz sofort, mit „Taktik betonen“ auch die Grundordnung.
  G.taktik=(s,{form,tac,ein,stil})=>{const U=RL.umstellung,hz=!!G.pause(),sofortOrdnung=hz&&G.ansp[s]&&G.ansp[s].art==='taktik';
    if(stil&&stil!==Ss[s].stil&&!Ss[s].am)G.plan[s].push({art:'stil',wert:stil,ab:G.m+1+(sofortOrdnung?0:U.ordnung)});
    if(form&&form!==Ss[s].form)G.plan[s].push({art:'form',wert:form,ab:G.m+1+(sofortOrdnung?0:U.ordnung)});
    if(tac&&tac!==Ss[s].tac)G.plan[s].push({art:'tac',wert:tac,ab:G.m+1+(hz?0:U.ausrichtung)});
    if(ein&&ein!==Ss[s].ein)G.plan[s].push({art:'ein',wert:ein,ab:G.m+1+(hz?0:U.ausrichtung)});};
  const umstellen=(s,x)=>{const sd=Ss[s];if(x.art==='tac')sd.tac=x.wert;else if(x.art==='ein')sd.ein=x.wert;else if(x.art==='stil'){sd.stil=x.wert;taktikWirkung(Ss);}
    else if(x.art==='form'){const sl=slots(x.wert),da=sd.xp.filter(y=>!off.has(y.p.id)),weg=sd.xp.filter(y=>off.has(y.p.id)),neu=[],frei=new Set(da.map(y=>y.p.id));
      sl.forEach(pos=>{let b=null,bv=-1;da.forEach(y=>{if(!frei.has(y.p.id))return;const v=eff(y.p,pos,fr[y.p.id]);if(v>bv){bv=v;b=y.p;}});if(b){frei.delete(b.id);neu.push({p:b,pos});}});
      sd.xp=[...neu,...weg];sd.form=x.wert;}};
  // Zurufe (K05 §5.2): derselbe Zuruf innerhalb von 15 Minuten wirkt nur halb, ein drittes Mal gar nicht. „Zeit schinden“ nur bei Führung.
  G.zuruf=(s,art)=>{if(!ZURUFE.includes(art))return{ok:false,grund:'Unbekannter Zuruf.'};if(art==='zeit'&&sc[s]<=sc[1-s])return{ok:false,grund:'Zeit schinden geht nur bei Führung.'};
    const n=G.rufe[s].filter(r=>r.art===art&&G.m-r.m<Z.abnutzungMinuten).length,w=n===0?1:n===1?0.5:0;G.rufe[s].push({art,m:G.m,w});G.effektBis=Math.max(G.effektBis,G.m+Z.dauer);W=werte(G.m);return{ok:true,w};};
  // Zuruf an einen Spieler (K05 §5.3, vereinfacht bis K15): Lob hilft, Kritik je nach Charakter
  G.spielerZuruf=(s,id,art)=>{const p=PIX.get(id),SZ=Z.spieler;if(!p)return{ok:false};let f,sv,fouls=1,text;
    if(art==='loben'){f=SZ.wirkung;sv=SZ.sv;text='freut sich';}
    else if(hatEig(p,'kaempfer')){f=SZ.wirkung*1.5;sv=0;text='beißt sich rein';}
    else if(hatEig(p,'diva')||hatEig(p,'nervenschwach')){f=-SZ.wirkung;sv=-SZ.sv;text='lässt den Kopf hängen';}
    else if(hatEig(p,'hitzkopf')){f=SZ.wirkung/2;sv=-SZ.sv/2;fouls=SZ.hitzkopfFouls;text='geht jetzt härter rein';}
    else{f=SZ.wirkung/2;sv=-SZ.sv/2;text='nickt';}
    G.spielerRuf[id]={m:G.m,f,fouls};G.sv[id]=(G.sv[id]||0)+sv;G.effektBis=Math.max(G.effektBis,G.m+Z.dauer);W=werte(G.m);return{ok:true,text};};
  // Halbzeitansprache (K05 §5.4): passt sie nicht zur Lage, kehrt sich die Wirkung halb um. Abnutzung über drei Spiele (in G.ansprache übergeben).
  G.passt=(s,art)=>{const d=sc[s]-sc[1-s];return art==='loben'?d>0:art==='motivieren'?d<=0&&d>=-1:art==='fordern'?d<0:art==='beruhigen'?d>0:true;};
  G.ansprache=(s,art,abnutzung=1)=>{const A=RL.ansprache;if(!ANSPRACHEN.includes(art))return{ok:false};const f=(G.passt(s,art)?1:A.unpassend)*abnutzung;G.ansp[s]={art,f};
    if(art==='loben')Ss[s].xp.forEach(x=>{G.sv[x.p.id]=(G.sv[x.p.id]||0)+A.loben.sv*f;});if(art==='taktik')G.plan[s].forEach(x=>x.ab=Math.min(x.ab,G.m+1));W=werte(G.m);return{ok:true,passt:G.passt(s,art)};};
  // Computer-Trainer (K05 §5.5): verletzte sofort, müde zwischen der 55. und 80. Minute, Taktik nach Spielstand
  const kiTrainer=(s,m)=>{const K=RL.ki;if(m<K.wechselVon&&!inj.length)return;const sd=Ss[s],d=sc[s]-sc[1-s],bank=G.bank[s];
    const ersatz=x=>{const gr=posGruppe(x.pos);let b=null,bv=-1;
      G.bank[s].forEach(id=>{const p=PIX.get(id);if(!p||(x.pos==='TW')!==(p.pos==='TW'))return;const v=eff(p,x.pos)*(posGruppe(p.fp||STD_POS[p.pos])===gr?1:0.9);if(v>bv){bv=v;b=p;}});return b?{p:b,v:bv}:null;};
    const tausch=x=>{if(!G.bank[s].length||!G.wechselFrei(s).ok)return false;const e=ersatz(x);return e?G.wechseln(s,x.p.id,e.p.id).ok:false;};
    // Frische Beine nur, wenn der Ersatz fast so gut ist wie der müde Spieler auf dem Platz (die Besten bleiben drin)
    const lohnt=x=>{const e=ersatz(x);return e&&e.v>=eff(x.p,x.pos,fr[x.p.id])-K.toleranz;};
    const auf=sd.xp.filter(x=>!off.has(x.p.id));
    auf.filter(x=>inj.some(i=>i.id===x.p.id)).forEach(tausch);
    if(m>=K.wechselVon&&m<=K.wechselBis&&mitStrom(stromNr(hk,m*2+s),()=>R())<K.chanceJeMinute){const muede=auf.filter(x=>x.pos!=='TW'&&!inj.some(i=>i.id===x.p.id)&&fr[x.p.id]<K.muedeUnter).sort((a,b)=>fr[a.p.id]-fr[b.p.id]);
      const gelb=m>=K.gelbAb?auf.filter(x=>yel[x.p.id]&&posGruppe(x.pos)!=='ST'):[],wahl=[...new Set([...muede,...gelb])].slice(0,K.jeGelegenheit);
      // frische Beine: die Müdesten zuerst, aber nur, wenn sich der Wechsel lohnt (erst prüfen, wenn noch Platz ist)
      if(wahl.length<K.jeGelegenheit&&m>=K.frischAb)for(const x of auf.filter(x=>x.pos!=='TW'&&fr[x.p.id]<K.frischUnter&&!wahl.includes(x)).sort((a,b)=>fr[a.p.id]-fr[b.p.id])){if(wahl.length>=K.jeGelegenheit)break;if(lohnt(x))wahl.push(x);}
      wahl.forEach(tausch);}
    const ziel=d<0&&m>=K.alleNachVorn?'SO':d<0&&m>=K.rueckstandAb?'O':d>0&&m>=K.fuehrungAb?'D':null;
    if(ziel&&sd.tac!==ziel&&!G.plan[s].some(x=>x.art==='tac'&&x.wert===ziel))G.taktik(s,{tac:ziel});};
  // Ergebnis für applyMatch und die Anzeige. xpo: [id, Position, Anteil an den erwarteten Toren, Minuten]
  G.ergebnis=()=>{const ende=G.m;
    const teil=(sd,s)=>{const ids=Object.entries(G.minuten).filter(([id])=>sd.xi.includes(+id)||G.ein[s].includes(+id)),pos={};
      sd.xp.forEach(x=>pos[x.p.id]=x.pos);G.wechsel.filter(w=>w.s===s).forEach(w=>{if(pos[w.aus]==null)pos[w.aus]=pos[w.ein]||'ZM';});
      const l=ids.map(([id,[a,b]])=>{const p=PIX.get(+id),ps=pos[id]||(p?STD_POS[p.pos]:'ZM'),min=Math.max(1,(b==null?ende:b)-a);
        const g=ps==='TW'?0.01:(RE.schuetzen.halb[linksForm(ps)]||0.3)*Math.pow((p?p.str:60)/RE.schuetzen.mitte,RE.schuetzen.exponent)*Math.min(90,min)/90;return[+id,ps,g,min];});
      const tot=l.reduce((a,x)=>a+x[2],0);return l.map(x=>[x[0],x[1],tot?x[2]/tot:0,x[3]]);};
    return{h:hid,a:aid,hg:sc[0],ag:sc[1],ev,pen:G.pen,sr:G.schiri.n,yel:Object.keys(yel).map(Number),off:[...off],inj,xi:[H.xi,A.xi],ein:G.ein,xg0,xpo:[H.am?[]:teil(H,0),A.am?[]:teil(A,1)],st,sz,sv:G.sv,taktik:[H,A].map(sd=>sd.am?null:{stil:sd.stil,form:sd.form,einst:sd.einst,u:Math.round(sd.u*100)/100})};};
  return G;}
// Bank (K05 §3.2): 9 Spieler, darunter ein Torwart, sonst die stärksten verfügbaren aus jeder Gruppe
const ZURUFE=['druck','ruhe','konzentration','zeit'],ANSPRACHEN=['loben','motivieren','fordern','beruhigen','taktik','schweigen','augenzwinkernd'];
function bankWaehlen(sd){if(sd.am)return[];const imXI=new Set(sd.xi),pool=squad(sd.id).filter(p=>avail(p)&&!imXI.has(p.id)).sort((a,b)=>b.str-a.str),n=RL.wechsel.bank,b=[];
  const tw=pool.find(p=>p.pos==='TW');if(tw)b.push(tw);['AB','MF','ST'].forEach(g=>pool.filter(p=>p.pos===g).slice(0,2).forEach(p=>{if(b.length<n&&!b.includes(p))b.push(p);}));
  pool.forEach(p=>{if(b.length<n&&!b.includes(p)&&p.pos!=='TW')b.push(p);});return b.map(p=>p.id);}
// Erwartung gegen Amateurklubs: Verhältnis der Teamwerte
function amateurErwartung(H,A){const q=(H.am?H.w.AM:H.A)/(A.am?A.w.DM:A.D);return[clamp(1.4*Math.pow(q,1.6),0.2,5),clamp(1.4*Math.pow(1/q,1.6),0.1,5)];}
function cardPick(me,off,gew){const c=me.xp.filter(x=>!off.has(x.p.id)&&x.pos!=='TW');if(!c.length)return null;if(!gew)return pick(c).p;
  const w=c.map(x=>gew(x.p));let r=R()*w.reduce((a,b)=>a+b,0);for(let i=0;i<c.length;i++){if((r-=w[i])<=0)return c[i].p;}return c[c.length-1].p;}
// Eigenschaften im Spiel (K03 §3.5): Verletzungsanfällige verletzen sich öfter
const verletzGew=p=>verletzRisiko(p); // Robustheit, verletzungsanfällig, Saisonbelastung (K10 §5.1)
const teamGew=(me,off,gew)=>{const c=me.xp.filter(x=>!off.has(x.p.id)&&x.pos!=='TW');return c.length?c.reduce((a,x)=>a+gew(x.p),0)/c.length:1;};
// Elfmeterschießen: mit Mannschaften nach Schützen und Torwart (Elfmeterschütze, Elfmetertöter, nervenschwach), ohne nur mit Grundquote
// Elfmeterschießen ohne Mannschaften (Regionalliga-Aufstieg): nur Grundquote
function shootout(){const q0=RE.elfmeter;let a=0,b=0;for(let i=0;i<5;i++){if(R()<q0)a++;if(R()<q0)b++;}while(a===b){if(R()<q0)a++;if(R()<q0)b++;}return[a,b];}
// Schützen-Reihenfolge: Elfmeterschützen zuerst, dann Stürmer, Mittelfeld, Abwehr, Torwart, jeweils nach Stärke (bis K06 eigene Listen bringt)
function elfmeterReihe(sd){const rang={ST:3,MF:2,AB:1,TW:0};return sd.xp.map(x=>x.p).sort((x,y)=>(hatMk(y,'elfmeter')-hatMk(x,'elfmeter'))||(rang[y.pos]-rang[x.pos])||(y.str-x.str));}
function elfmeterQuote(s,k){const q0=RE.elfmeter;if(!s)return q0;return clamp(q0+(hatMk(s,'elfmeter')?0.08:0)-(hatEig(s,'nervenschwach')?0.06:0)-(k&&hatMk(k,'elfmetertoeter')?0.06:0),0.5,0.95);}
const winner=r=>r.hg>r.ag?r.h:r.hg<r.ag?r.a:(r.pen&&r.pen[0]>r.pen[1]?r.h:r.a);
function applyMatch(r,cup){return mitStrom(strom('nachspiel',S.season,S.tag,r.h,r.a),()=>applyMatchLauf(r,cup));}
// Nach dem Spiel (K03, K04 §5.9): Frische, Spielpraxis, Note, Form gegenüber der erwarteten Note, Selbstvertrauen, Serie gegenüber der Erwartung
function applyMatchLauf(r,cup){const N=RE.note,V=RP.selbstvertrauen;
  [0,1].forEach(s=>{const tid=s?r.a:r.h;if(tid>=1000)return;const gf=s?r.ag:r.hg,ga=s?r.hg:r.ag,res=gf>ga?1:gf<ga?-1:0;
    const xgF=r.xg0[s],E=erwartung(xgF,r.xg0[1-s]),eres=E.sieg-E.niederlage;
    r.xpo[s].forEach(([id,,anteil,min=90])=>{const p=PIX.get(id);if(!p)return;p.apps++;nachSpiel(p,min);
      const goals=r.ev.filter(e=>e.t==='G'&&e.p===id).length;if(cup)p.pg=(p.pg||0)+goals;else if(!r.rel&&!r.supercup)p.g+=goals;if(min<N.mindestMinuten){p.played=1;return;} // Kurzeinsatz: keine Note
      const fest=N.basis-(p.str-N.staerkeMitte)/N.staerkeTeiler;
      let gr=fest-res*N.ergebnis-goals*N.tor+(R()-0.5)*N.zufall;if(r.off.includes(id))gr+=N.platzverweis;gr=clamp(Math.round(gr*2)/2,N.min,N.max);
      const erw=clamp(fest-eres*N.ergebnis-xgF*anteil*N.tor,N.min,N.max);
      p.lastG=gr;formNachNote(p,gr,erw,weckFaktor(tid));if(goals)svAendern(p,goals*V.tor);if(gr<=2)svAendern(p,V.guteNote);else if(gr>=5)svAendern(p,V.schlechteNote);
      p.played=1;if(tid===S.my)(r.grades=r.grades||{})[id]=gr;});
    serieBuchen(S.teams[tid],res>0?3:res===0?1:0,E.punkte,r.xi[s]);weckNachSpiel(tid);});
  if(r.taktik)r.taktik.forEach((tk,s)=>{const tid=s?r.a:r.h;if(!tk||tid>=1000)return;const t=S.teams[tid],V=RTA.vertrautheit,ES=RTA.einstellung.saison;
    vertrautSetzen(t,'stil',tk.stil,vertraut(t,'stil',tk.stil)+V.jeSpiel);vertrautSetzen(t,'ordnung',tk.form,vertraut(t,'ordnung',tk.form)+V.jeSpiel);
    if(tk.einst==='saison'){t.kater=S.tag+ES.katerTage;r.xi[s].forEach(id=>{const p=PIX.get(id);if(p)p.fit=Math.max(RE.fitnessMin,p.fit-ES.frische);});}
    t.stile=[...(t.stile||[]),tk.stil].slice(-3); // zuletzt gespielte Stile (Gegneranalyse vor dem Spiel, K06 §4)
    if(tid===S.my){t.einstellung='normal';S.stilVerlauf=[...(S.stilVerlauf||[]),tk.stil].slice(-RTA.ki.rueckblick);}});
  lernenImSpiel(r);if(r.sv)Object.entries(r.sv).forEach(([id,v])=>{const p=PIX.get(+id);if(p)svAendern(p,v);});
  r.inj.forEach(x=>verletzen(PIX.get(x.id),x.q||'kollision')); // Verletzungen mit Art und Dauer (K10)
  r.xpo.forEach(l=>l.forEach(([id])=>nachSpritze(PIX.get(id)))); // fit gespritzt: Verschlimmerung möglich
  disziplinNachSpiel(r);} // Karten, Sperren und Verfahren (K09), nach den Verletzungen wegen der Verletzungsfolge
