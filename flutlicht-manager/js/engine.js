// Match-Engine v2 (Konzept K04): Teamwerte aus Positionsanteilen mit getrennten Seiten (K06), Szenen pro Minute mit eigenem Zufallsstrom (K02),
// Chancentypen, Standards, Fouls mit Ort, Merkmale (K03), Ermüdung im Spiel, Erwartung vor dem Spiel, Noten gegen die Erwartung.
const slots=f=>RE.formationen[f]||RE.formationen['4-4-2'];
const posGruppe=pos=>RE.gruppe[pos]||pos;
const avail=p=>p.inj<=0&&p.sus<=0;
const TAUSCH={LV:'RV',RV:'LV',LM:'RM',RM:'LM',LA:'RA',RA:'LA',LS:'RS',RS:'LS'};
const seite=pos=>/^(LV|LM|LA|LS)$/.test(pos)?'L':/^(RV|RM|RA|RS)$/.test(pos)?'R':null;
const linksForm=pos=>seite(pos)==='R'?TAUSCH[pos]:pos;
const STD_POS={TW:'TW',AB:'IV',MF:'ZM',ST:'MS'};
// Eignung eines Spielers für einen Platz (K03 §3.1a): eigene Position 100 %, verwandte 75–92 %, Gruppe 70 %, sonst 55 %, Torwart und Feld 45 %
function eignung(p,pos){const E=RE.eignung,fp=p.fp||STD_POS[p.pos];if(fp===pos)return 1;
  const gA=posGruppe(fp),gB=posGruppe(pos);let w;
  if(gA==='TW'||gB==='TW')w=E.torwartFeld;
  else{let a=fp,b=pos;if(seite(a)==='R'){a=TAUSCH[a];b=TAUSCH[b]||b;}w=(E.nah[a]&&E.nah[a][b])||(E.nah[b]&&E.nah[b][a])||(gA===gB?E.gleicheGruppe:E.andereGruppe);
    if(hatMk(p,'vielseitig'))w=Math.min(E.vielseitigMax,w+E.vielseitig);}
  let f=w/100;const s=seite(pos);
  if(s&&E.seitenPositionen.includes(pos)&&!hatMk(p,'beidfuessig')&&((s==='L'&&p.fuss==='R')||(s==='R'&&p.fuss==='L')))f*=E.falscheSeite;
  return f;}
// Wirkung eines Spielers auf einem Platz. fr: Frische im Spiel (sonst die gespeicherte), extra: Faktor aus der Lage (Kämpfer, wichtige Spiele)
function eff(p,pos,fr,extra){const f=fr==null?p.fit:fr;let z=zustandMit(p,f);if(f<RE.ermuedung.schwelle)z*=1-RE.ermuedung.abfall*(RE.ermuedung.schwelle-f);return p.str*z*eignung(p,pos)*(extra||1);}
function zustandMit(p,fr){if(fr===p.fit)return zustand(p);const a=p.fit;p.fit=fr;const z=zustand(p);p.fit=a;return z;}
// Aufstellung: erst Spieler auf ihrer eigenen Position, dann aus derselben Gruppe, dann nach Wirkung
function fillXI(sl,pool,xi,used){sl.forEach((pos,i)=>{if(xi[i]!=null)return;let best=null,bv=-1;for(const p of pool){if(used.has(p.id))continue;const v=eff(p,pos);if(v>bv){bv=v;best=p;}}xi[i]=best?best.id:null;if(best)used.add(best.id);});return xi;}
function bestXI(tid,form){const sl=slots(form),pool=squad(tid).filter(avail),used=new Set(),xi=Array(sl.length).fill(null);
  const pass=ok=>sl.forEach((pos,i)=>{if(xi[i]!=null)return;let best=null,bv=-1;for(const p of pool){if(used.has(p.id)||!ok(p,pos))continue;const v=eff(p,pos);if(v>bv){bv=v;best=p;}}if(best){xi[i]=best.id;used.add(best.id);}});
  pass((p,pos)=>(p.fp||STD_POS[p.pos])===pos);pass((p,pos)=>posGruppe(p.fp||STD_POS[p.pos])===posGruppe(pos));
  return fillXI(sl,pool,xi,used);}
function myXI(){const t=myT(),sl=slots(t.form),pool=squad(S.my).filter(avail),used=new Set();
  const xi=sl.map((pos,i)=>{const id=(S.lineup||[])[i];const p=PIX.get(id);if(p&&p.team===S.my&&avail(p)&&!used.has(id)){used.add(id);return id;}return null;});
  return fillXI(sl,pool,xi,used);}

// Teamwerte (K04 §3.2): Kontrolle, Angriff Mitte, Angriff links und rechts, Abwehr Mitte, Abwehr links und rechts, Torwart
function teamWerte(sd,fr,off,lage){const T=RE.team,k=RE.staerke,acc={K:[],AM:[],AL:[],AR:[],DM:[],DL:[],DR:[]};let tw=k.leererPlatz;
  sd.xp.forEach(x=>{if(off&&off.has(x.p.id))return;const w=eff(x.p,x.pos,fr?fr[x.p.id]:null,lage?lage(x.p):1);
    if(x.pos==='TW'){tw=w;return;}const a=RE.anteile[linksForm(x.pos)]||[0,0,0,0,0],s=seite(x.pos);
    acc.K.push([a[0],w]);acc.AM.push([a[1],w]);acc.DM.push([a[3],w]);
    if(s==='L'){acc.AL.push([a[2],w]);acc.DL.push([a[4],w]);}else if(s==='R'){acc.AR.push([a[2],w]);acc.DR.push([a[4],w]);}
    else{acc.AL.push([a[2]/2,w]);acc.AR.push([a[2]/2,w]);acc.DL.push([a[4]/2,w]);acc.DR.push([a[4]/2,w]);}});
  const wert=l=>{const sa=l.reduce((s,x)=>s+x[0],0);if(sa<=0)return k.leererPlatz;const m=l.reduce((s,x)=>s+x[0]*x[1],0)/sa,st=l.filter(x=>x[0]>=T.mindestAnteil).map(x=>x[1]);
    const v=st.length?(1-T.schwaechstes)*m+T.schwaechstes*Math.min(...st):m;return v*Math.min(T.anzahlMax,T.anzahl[0]+T.anzahl[1]*sa);};
  const w={TW:tw};for(const key in acc)w[key]=wert(acc[key]);
  const ta=RE.ausrichtung[sd.tac],ei=RE.einsatz[sd.ein],hm=sd.heim?RE.heim.alle:1;
  ['AM','AL','AR'].forEach(q=>w[q]*=(ta?ta.A:1)*(ei?ei.A:1)*hm);['DM','DL','DR'].forEach(q=>w[q]*=(ta?ta.D:1)*(ei?ei.D:1)*hm);w.K*=hm;w.TW*=hm;
  return w;}
// Eine Mannschaft vor dem Anpfiff. A und D sind Gesamtwerte für Vorschau und Tauziehen.
function side(tid,home,neutral){
  if(tid>=1000){const a=S.am[tid-1000],v=a.str*(home&&!neutral?RE.heim.amateure:1),w={K:v,AM:v,AL:v,AR:v,DM:v,DL:v,DR:v,TW:v};return{id:tid,am:true,w,A:v,D:v,red:0,xp:[],xi:[],ein:'N',tac:'N'};}
  const t=S.teams[tid],sl=slots(t.form),xi=tid===S.my?myXI():bestXI(tid,t.form),xp=[];
  xi.forEach((id,i)=>{const p=id!=null?PIX.get(id):null;if(p)xp.push({p,pos:sl[i]});});
  const sd={id:tid,xp,xi:xi.filter(x=>x!=null),ein:t.ein,tac:t.tac,heim:home&&!neutral,red:0};sd.w=teamWerte(sd);
  sd.A=0.5*sd.w.AM+0.25*(sd.w.AL+sd.w.AR);sd.D=0.4*sd.w.DM+0.2*(sd.w.DL+sd.w.DR)+0.2*sd.w.TW;return sd;}

// ---------- Hilfen für Szenen ----------
function waehle(liste,gew){const w=liste.map(gew);let r=R()*w.reduce((a,b)=>a+b,0);for(let i=0;i<liste.length;i++){if((r-=w[i])<=0)return liste[i];}return liste[liste.length-1];}
const mkZahl=(xp,k)=>xp.filter(x=>hatMk(x.p,k)).length;
const abnehmend=n=>RE.mk.abnehmend.slice(0,n).reduce((a,b)=>a+b,0);
const routeChance=(a,d)=>{const A=RE.angriff;return clamp(A.chance*Math.pow(a/d,A.exponent),A.min,A.max);};
const schuetzenFaktor=w=>{const S2=RE.schuetze;return clamp(1+S2.jePunkt*(w-S2.mitte),S2.min,S2.max);};
const torwartFaktor=w=>{const T=RE.torwart;return clamp(1-T.jePunkt*(w-T.mitte),T.min,T.max);};
// Anteile der Angriffswege: dort, wo der Gegner schwächer ist, öfter
function wege(me,op){const wM=0.55*Math.pow(me.AM/op.DM,2),wL=0.225*Math.pow(me.AL/op.DR,2),wR=0.225*Math.pow(me.AR/op.DL,2),s=wM+wL+wR;return{M:wM/s,L:wL/s,R:wR/s};}
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
    return(x.offen+y.fehl*k+std)*schuetzenFaktor(me.w.AM)*torwartFaktor(op.w.TW);};
  return[lam(h,a,H,A),lam(a,h,A,H)];}

// ---------- Das Spiel ----------
function sim(hid,aid,o={}){return mitStrom(strom('spiel',S.season,S.tag,hid,aid),()=>simLauf(hid,aid,o));}
function simLauf(hid,aid,o){const H=side(hid,true,o.neutral),A=side(aid,false,o.neutral),Ss=[H,A];
  const xg0=(H.am||A.am)?amateurErwartung(H,A):erwarteteTore(H,A);
  const ev=[],sc=[0,0],yel={},off=new Set(),inj=[],st={besitz:[0,0],schuesse:[0,0],aufsTor:[0,0],ecken:[0,0],fouls:[0,0],gross:[0,0]},sz=[];
  const fr={};Ss.forEach(sd=>sd.xp.forEach(x=>fr[x.p.id]=x.p.fit));
  const E=RE.ermuedung,ermueden=min=>Ss.forEach(sd=>sd.xp.forEach(x=>{const p=x.p;fr[p.id]=Math.max(RE.fitnessMin,fr[p.id]-E.proMinute*min*(E.ko[0]+E.ko[1]*p.ko)*(hatMk(p,'ausdauernd')?0.75:1)*(sd.ein==='H'?E.hart:1));}));
  // Lage: Kämpfer und Führungsspieler bei Rückstand, Nervenschwache und Trainingsweltmeister in wichtigen Spielen und knapper Schlussphase
  const lageFn=(s,m)=>{const hinten=sc[s]<sc[1-s],eng=m>=80&&Math.abs(sc[0]-sc[1])<=1,wichtig=o.wichtig||eng,fue=hinten&&Ss[s].xp.some(x=>hatEig(x.p,'fuehrungsspieler'))?1.01:1;
    return p=>(hinten&&hatEig(p,'kaempfer')?1.03:1)*(wichtig&&hatEig(p,'nervenschwach')?0.96:1)*(wichtig&&hatEig(p,'trainingsweltmeister')?0.97:1)*fue;};
  const werte=m=>Ss.map((sd,s)=>sd.am?sd.w:teamWerte(sd,fr,off,lageFn(s,m)));
  let W=werte(0);
  const torEv=(m,s,p,art)=>{sc[s]++;ev.push({m,s,t:'G',p:p?p.id:null,n:p?p.n:'Eigentor',sc:[...sc],art});W=werte(m);};
  const keeperName=s=>{const k=Ss[1-s].xp.find(x=>x.pos==='TW');return k?k.p.n:'der Torwart';};
  const imSpiel=s=>Ss[s].xp.filter(x=>!off.has(x.p.id));
  const kandidaten=(s,typ)=>imSpiel(s).filter(x=>x.pos!=='TW'||typ==='notfall');
  const schuetzeWahl=(s,typ)=>{const c=kandidaten(s,typ);if(!c.length)return null;const G=RE.schuetzen[typ]||RE.schuetzen.halb,Mk=RE.mk;
    return waehle(c,x=>(G[linksForm(x.pos)]||0.3)*Math.pow(x.p.str/RE.schuetzen.mitte,RE.schuetzen.exponent)*((typ==='gross'||typ==='halb')&&hatMk(x.p,'torjaeger')?Mk.torjaeger.wahl:1)*((typ==='kopf'||typ==='ecke')&&hatMk(x.p,'kopfballstark')?Mk.kopfballstark.wahl:1)*(typ==='fern'&&hatMk(x.p,'weitschuetze')?Mk.weitschuetze.anteil:1)).p;};
  const torwart=s=>{const k=Ss[1-s].xp.find(x=>x.pos==='TW'&&!off.has(x.p.id));return k?k.p:null;};
  // Abschluss: Tor, Parade, vorbei oder geblockt. Ergebnis 'tor', 'parade', 'vorbei'
  const abschluss=(m,s,typ,schuetze,basisArt,extra=1)=>{if(!schuetze)return'vorbei';const Mk=RE.mk,kp=torwart(s),opW=W[1-s];st.schuesse[s]++;if(typ==='gross')st.gross[s]++;
    let p=RE.tor[typ]*extra*schuetzenFaktor(schuetze.str*zustandMit(schuetze,fr[schuetze.id]==null?schuetze.fit:fr[schuetze.id]))*torwartFaktor(opW.TW)*(1+0.01*(schuetze.sv||0));
    if(typ==='gross'||typ==='halb'){if(hatMk(schuetze,'torjaeger'))p*=Mk.torjaeger.tor;if(hatMk(schuetze,'abschlussschwach'))p*=Mk.abschlussschwach;if(kp&&hatMk(kp,'reflexe'))p*=Mk.reflexe;
      if(typ==='gross'){const n=mkZahl(imSpiel(1-s),'stellungssicher');if(n)p*=Math.pow(Mk.stellungssicher.gross,abnehmend(n));}}
    if(typ==='kopf'||typ==='ecke'||typ==='freistossFlanke'){if(hatMk(schuetze,'kopfballstark'))p*=Mk.kopfballstark.tor;if(hatMk(schuetze,'kopfballschwach'))p*=Mk.kopfballschwach;
      const n=mkZahl(imSpiel(1-s),'kopfballstark');if(n)p*=Math.pow(Mk.kopfballstark.abwehr,abnehmend(n));if(kp&&hatMk(kp,'strafraum'))p*=Mk.strafraum;if(kp&&hatMk(kp,'fliegenfaenger'))p*=Mk.fliegenfaenger;}
    if(typ==='fern'&&hatMk(schuetze,'weitschuetze'))p*=Mk.weitschuetze.tor;
    if(hatMk(schuetze,'beidfuessig'))p*=Mk.beidfuessig;
    p=clamp(p,0.005,0.9);
    if(R()<p){torEv(m,s,schuetze,basisArt||typ);sz.push([schuetze.id,typ,1]);return'tor';}
    sz.push([schuetze.id,typ,0]);
    if(R()<Math.max(0,RE.aufsTor-p)/(1-p)){st.aufsTor[s]++;if(kp)sz.push([kp.id,'parade',1]);ev.push({m,s,t:'C',n:schuetze.n,gk:keeperName(s),art:typ});return'parade';}
    ev.push({m,s,t:'C',n:schuetze.n,gk:keeperName(s),art:typ,vorbei:1});return R()<RE.geblockt/(1-RE.aufsTor)?'geblockt':'vorbei';};
  const ecke=(m,s)=>{st.ecken[s]++;const c=imSpiel(s);if(!c.length)return;const nehmer=c.find(x=>hatMk(x.p,'flankengeber'))||null;
    // Ecke: mit Anteil eckeSchuss folgt ein Kopfball oder Abpraller. Die Torquote je Ecke (tor.ecke) gilt über alle Ecken.
    if(R()<RE.eckeSchuss){const sch=schuetzeWahl(s,'ecke');const r=abschluss(m,s,'ecke',sch,'ecke',(nehmer?RE.mk.flankengeber.ecke:1)/RE.eckeSchuss);if(r==='tor'&&nehmer)sz.push([nehmer.p.id,'ecke_tor',1]);}};
  // Standard nach Foul des Gegners an Mannschaft s
  const standard=(m,s)=>{const O=RE.fouls.ort,r=R(),c=imSpiel(s);if(!c.length)return;
    if(r<O.elfmeter){const sch=c.map(x=>x.p).sort((x,y)=>(hatMk(y,'elfmeter')-hatMk(x,'elfmeter'))||(({ST:3,MF:2,AB:1,TW:0})[y.pos]-({ST:3,MF:2,AB:1,TW:0})[x.pos])||(y.str-x.str))[0],kp=torwart(s);
      st.schuesse[s]++;const q=clamp(RE.tor.elfmeter+(hatMk(sch,'elfmeter')?RE.mk.elfmeter-RE.tor.elfmeter:0)-(hatEig(sch,'nervenschwach')?0.06:0)-(kp&&hatMk(kp,'elfmetertoeter')?RE.tor.elfmeter-RE.mk.elfmetertoeter:0),0.4,0.95);
      if(R()<q){torEv(m,s,sch,'elfmeter');sz.push([sch.id,'elfmeter',1]);}else{sz.push([sch.id,'elfmeter',0]);if(kp)sz.push([kp.id,'elfmeter_gehalten',1]);ev.push({m,s,t:'C',n:sch.n,gk:keeperName(s),art:'elfmeter',x:`${sch.n} vergibt den Elfmeter!`});}}
    else if(r<O.elfmeter+O.direkt){const sch=c.map(x=>x.p).filter(p=>p.pos!=='TW').sort((x,y)=>(hatMk(y,'freistoss')-hatMk(x,'freistoss'))||(y.str-x.str))[0];if(!sch)return;
      st.schuesse[s]++;const p=(hatMk(sch,'freistoss')?RE.mk.freistoss:RE.tor.freistoss)*torwartFaktor(W[1-s].TW);if(R()<p){torEv(m,s,sch,'freistoss');sz.push([sch.id,'freistoss',1]);}else{sz.push([sch.id,'freistoss',0]);ev.push({m,s,t:'C',n:sch.n,gk:keeperName(s),art:'freistoss'});}}
    else if(r<O.elfmeter+O.direkt+O.flanke){if(R()<RE.eckeSchuss){const sch=schuetzeWahl(s,'ecke');abschluss(m,s,'freistossFlanke',sch,'freistossFlanke',1/RE.eckeSchuss);}}};
  const angriff=(m,s,faktor)=>{const me=W[s],op=W[1-s],g=wege(me,op),r=R(),weg=r<g.M?'M':r<g.M+g.L?'L':'R';
    const a=weg==='M'?me.AM:weg==='L'?me.AL:me.AR,d=weg==='M'?op.DM:weg==='L'?op.DR:op.DL;
    if(R()<routeChance(a,d)*faktor){const M=RE.mix,Mk=RE.mk,xs=imSpiel(s);let mix=Object.assign({},weg==='M'?M.mitte:M.aussen);
      const nf=mkZahl(xs,'flankengeber');if(weg!=='M'&&nf)mix.kopf*=Math.pow(Mk.flankengeber.kopf,abnehmend(nf));
      const nw=mkZahl(xs,'weitschuetze');if(nw)mix.fern*=Math.pow(Mk.weitschuetze.anteil,abnehmend(nw)*0.5);
      let typ=waehle(Object.keys(mix),k=>mix[k]);
      if(typ==='halb'){const nd=mkZahl(xs,'dribbler');if(nd&&R()<Mk.dribbler.upgrade*abnehmend(nd))typ='gross';}
      const res=abschluss(m,s,typ,schuetzeWahl(s,typ));
      if(res==='parade'&&R()<RE.ecken.parade)ecke(m,s);else if(res==='geblockt'&&R()<RE.ecken.geblockt)ecke(m,s);}
    else{if(weg!=='M'&&R()<RE.ecken.aussenAbgewehrt){ecke(m,s);return;}
      // Konter des Gegners (schnell erhöht, ballsicher beim Angreifer und stellungssicher mindern)
      const Mk=RE.mk,ns=mkZahl(imSpiel(1-s),'schnell'),nb=mkZahl(imSpiel(s),'ballsicher'),nl=mkZahl(imSpiel(1-s),'langsam'),nsA=mkZahl(imSpiel(s),'schnell');
      let k=RE.angriff.konter*Math.pow(Mk.schnell.konter,abnehmend(ns))*Math.pow(Mk.ballsicher.konter,abnehmend(nb))/Math.pow(Mk.langsam,abnehmend(nl))*Math.pow(Mk.schnell.abwehr,abnehmend(nsA));
      if(R()<k*faktor){const typ=waehle(Object.keys(RE.mix.konter),q=>RE.mix.konter[q]);const r2=abschluss(m,1-s,typ,schuetzeWahl(1-s,typ),'konter');if(r2==='parade'&&R()<RE.ecken.parade)ecke(m,1-s);}}};
  const foul=(m,s)=>{const F=RE.fouls,sd=Ss[s];if(sd.am)return;const c=imSpiel(s).filter(x=>x.pos!=='TW');if(!c.length)return;
    const nU=mkZahl(c,'ungestuem'),f=F.proMinute*(sd.ein==='H'?F.hart:sd.ein==='F'?F.fair:1)*(1+(F.ungestuem-1)*nU/c.length*3);
    if(R()>=f)return;st.fouls[s]++;const t=waehle(c,x=>(F.gewicht[linksForm(x.pos)]||1)*(hatMk(x.p,'ungestuem')?F.ungestuem:1)*(yel[x.p.id]&&!hatEig(x.p,'hitzkopf')?F.mitGelb.foul:1)).p,hk=(hatEig(t,'hitzkopf')?1.5:1)*(yel[t.id]?F.mitGelb.karte:1);
    if(R()<F.rot*hk){off.add(t.id);sd.red++;ev.push({m,s,t:'R',p:t.id,n:t.n});W=werte(m);}
    else if(R()<F.gelb*hk){if(yel[t.id]){off.add(t.id);sd.red++;ev.push({m,s,t:'R',p:t.id,n:t.n,gy:1});W=werte(m);}else{yel[t.id]=1;ev.push({m,s,t:'Y',p:t.id,n:t.n});}}
    standard(m,1-s);};
  const amateurKarten=(m,s)=>{const K=RE.karten;if(R()<K.gelb){ev.push({m,s,t:'Y',p:null,n:'ein Amateur'});}};
  const verletzung=(m,s)=>{const V=RE.verletzung,op=Ss[1-s];if(Ss[s].am)return;
    if(R()<V.chance*(op.ein==='H'?V.gegnerHart:1)*teamGew(Ss[s],off,verletzGew)){const p=cardPick(Ss[s],off,verletzGew);if(p&&!inj.find(x=>x.id===p.id)){inj.push({id:p.id,w:riA(V.wochen)});ev.push({m,s,t:'I',p:p.id,n:p.n});}}};
  const patzer=(m,s)=>{const T=RE.torwart,kp=Ss[s].xp.find(x=>x.pos==='TW'&&!off.has(x.p.id));if(!kp)return;
    if(R()<T.patzer/90*(hatMk(kp.p,'unkonzentriert')?T.unkonzentriert:1)){sz.push([kp.p.id,'patzer',1]);abschluss(m,1-s,'gross',schuetzeWahl(1-s,'gross'),'patzer');}};
  const minute=(m,verl)=>{ZS=strom('spiel',S.season,S.tag,hid,aid,m);
    if(m%15===1&&m>1){ermueden(15);W=werte(m);}
    const eh=Math.pow(W[0].K,RE.besitz.exponent),ea=Math.pow(W[1].K,RE.besitz.exponent),s=R()<eh/(eh+ea)?0:1;st.besitz[s]++;
    // Spielstand und Unterzahl
    const V=RE.verlauf,fakt=t=>{let A=1,D=1;const d=sc[t]-sc[1-t],dop=m>=V.abMinute?2:1;if(d>0){A*=Math.pow(V.fuehrung.A,dop);}else if(d<0){A*=Math.pow(V.rueckstand.A,dop);}else if(m>=V.abMinute)A*=V.gleich.A;A*=Math.pow(V.rot.A,Ss[t].red);return A;};
    const dfak=t=>{const d=sc[t]-sc[1-t],dop=m>=V.abMinute?2:1;let D=d>0?Math.pow(V.fuehrung.D,dop):d<0?Math.pow(V.rueckstand.D,dop):1;return D*Math.pow(V.rot.D,Ss[t].red);};
    const angriffsChance=RE.angriff.proMinute*fakt(s)/dfak(1-s)*(verl?RE.verlaengerung:1);
    if(Ss[s].am||Ss[1-s].am){if(R()<angriffsChance)amateurAngriff(m,s,verl);}
    else if(R()<angriffsChance)angriff(m,s,verl?RE.verlaengerung:1);
    [0,1].forEach(t=>{if(Ss[t].am)amateurKarten(m,t);else foul(m,t);verletzung(m,t);if(!Ss[t].am)patzer(m,t);});};
  // Spiele gegen Amateurklubs: vereinfacht mit Teamwerten aus ihrer Stärke
  const amateurAngriff=(m,s,verl)=>{const me=W[s],op=W[1-s];if(R()<routeChance(me.AM,op.DM)*(verl?RE.verlaengerung:1)){const typ=waehle(Object.keys(RE.mix.mitte),k=>RE.mix.mitte[k]);
      if(Ss[s].am){st.schuesse[s]++;if(R()<RE.tor[typ]*torwartFaktor(op.TW)){sc[s]++;ev.push({m,s,t:'G',p:null,n:rname(),sc:[...sc],art:typ});}}else abschluss(m,s,typ,schuetzeWahl(s,typ));}};
  for(let m=1;m<=90;m++)minute(m,false);
  let pen=null;
  if(o.ko&&sc[0]===sc[1]){for(let m=91;m<=120;m++)minute(m,true);
    if(sc[0]===sc[1]){ZS=strom('spiel',S.season,S.tag,hid,aid,'elfmeter');pen=shootout(H,A);ev.push({m:120,s:pen[0]>pen[1]?0:1,t:'P',pen});}}
  const anteil=sd=>{let tot=0;const g=sd.xp.map(x=>{const v=x.pos==='TW'?0.01:(RE.schuetzen.halb[linksForm(x.pos)]||0.3)*Math.pow(x.p.str/RE.schuetzen.mitte,RE.schuetzen.exponent);tot+=v;return v;});return sd.xp.map((x,i)=>[x.p.id,x.pos,tot?g[i]/tot:0]);};
  return{h:hid,a:aid,hg:sc[0],ag:sc[1],ev,pen,yel:Object.keys(yel).map(Number),off:[...off],inj,xi:[H.xi,A.xi],xg0,xpo:[anteil(H),anteil(A)],st,sz};}
// Erwartung gegen Amateurklubs: Verhältnis der Teamwerte
function amateurErwartung(H,A){const q=(H.am?H.w.AM:H.A)/(A.am?A.w.DM:A.D);return[clamp(1.4*Math.pow(q,1.6),0.2,5),clamp(1.4*Math.pow(1/q,1.6),0.1,5)];}
function cardPick(me,off,gew){const c=me.xp.filter(x=>!off.has(x.p.id)&&x.pos!=='TW');if(!c.length)return null;if(!gew)return pick(c).p;
  const w=c.map(x=>gew(x.p));let r=R()*w.reduce((a,b)=>a+b,0);for(let i=0;i<c.length;i++){if((r-=w[i])<=0)return c[i].p;}return c[c.length-1].p;}
// Eigenschaften im Spiel (K03 §3.5): Verletzungsanfällige verletzen sich öfter
const verletzGew=p=>hatEig(p,'verletzungsanfaellig')?1.6:1;
const teamGew=(me,off,gew)=>{const c=me.xp.filter(x=>!off.has(x.p.id)&&x.pos!=='TW');return c.length?c.reduce((a,x)=>a+gew(x.p),0)/c.length:1;};
// Elfmeterschießen: mit Mannschaften nach Schützen und Torwart (Elfmeterschütze, Elfmetertöter, nervenschwach), ohne nur mit Grundquote
function shootout(H,A){const q0=RE.elfmeter;
  if(!H||!A||!H.xp||!H.xp.length||!A.xp||!A.xp.length){let a=0,b=0;for(let i=0;i<5;i++){if(R()<q0)a++;if(R()<q0)b++;}while(a===b){if(R()<q0)a++;if(R()<q0)b++;}return[a,b];}
  const rang={ST:3,MF:2,AB:1,TW:0},reihe=t=>t.xp.map(x=>x.p).sort((x,y)=>(hatMk(y,'elfmeter')-hatMk(x,'elfmeter'))||(rang[y.pos]-rang[x.pos])||(y.str-x.str)),
    tw=t=>{const k=t.xp.find(x=>x.pos==='TW');return k?k.p:null;},q=(s,k)=>clamp(q0+(hatMk(s,'elfmeter')?0.08:0)-(hatEig(s,'nervenschwach')?0.06:0)-(k&&hatMk(k,'elfmetertoeter')?0.06:0),0.5,0.95);
  const rh=reihe(H),ra=reihe(A),kh=tw(H),ka=tw(A);let a=0,b=0,i=0;
  for(;i<5;i++){if(R()<q(rh[i%rh.length],ka))a++;if(R()<q(ra[i%ra.length],kh))b++;}
  while(a===b){if(R()<q(rh[i%rh.length],ka))a++;if(R()<q(ra[i%ra.length],kh))b++;i++;}return[a,b];}
const winner=r=>r.hg>r.ag?r.h:r.hg<r.ag?r.a:(r.pen&&r.pen[0]>r.pen[1]?r.h:r.a);
function applyMatch(r,cup){return mitStrom(strom('nachspiel',S.season,S.tag,r.h,r.a),()=>applyMatchLauf(r,cup));}
// Nach dem Spiel (K03, K04 §5.9): Frische, Spielpraxis, Note, Form gegenüber der erwarteten Note, Selbstvertrauen, Serie gegenüber der Erwartung
function applyMatchLauf(r,cup){const N=RE.note,V=RP.selbstvertrauen;
  [0,1].forEach(s=>{const tid=s?r.a:r.h;if(tid>=1000)return;const gf=s?r.ag:r.hg,ga=s?r.hg:r.ag,res=gf>ga?1:gf<ga?-1:0;
    const xgF=r.xg0[s],E=erwartung(xgF,r.xg0[1-s]),eres=E.sieg-E.niederlage;
    r.xpo[s].forEach(([id,,anteil])=>{const p=PIX.get(id);if(!p)return;p.apps++;nachSpiel(p,90);
      const goals=r.ev.filter(e=>e.t==='G'&&e.p===id).length;if(cup)p.pg=(p.pg||0)+goals;else if(!r.rel)p.g+=goals;
      const fest=N.basis-(p.str-N.staerkeMitte)/N.staerkeTeiler;
      let gr=fest-res*N.ergebnis-goals*N.tor+(R()-0.5)*N.zufall;if(r.off.includes(id))gr+=N.platzverweis;gr=clamp(Math.round(gr*2)/2,N.min,N.max);
      const erw=clamp(fest-eres*N.ergebnis-xgF*anteil*N.tor,N.min,N.max);
      p.lastG=gr;formNachNote(p,gr,erw);if(goals)svAendern(p,goals*V.tor);if(gr<=2)svAendern(p,V.guteNote);else if(gr>=5)svAendern(p,V.schlechteNote);
      p.played=1;if(tid===S.my)(r.grades=r.grades||{})[id]=gr;});
    serieBuchen(S.teams[tid],res>0?3:res===0?1:0,E.punkte,r.xi[s]);});
  r.yel.forEach(id=>{const p=PIX.get(id);if(!p)return;p.yc++;if(p.yc>=RE.gelbSperreAb){p.yc=0;p.sus=Math.max(p.sus,1);if(p.team===S.my)news(`${p.n} sieht die ${RE.gelbSperreAb}. Gelbe Karte und ist für ein Spiel gesperrt.`,'bad');}});
  r.off.forEach(id=>{const p=PIX.get(id);if(!p)return;p.sus=riA(RE.rotSperre);if(p.team===S.my)news(`Platzverweis: ${p.n} fehlt ${p.sus} Spiel(e).`,'bad');});
  // Ausfall in Tagen: w Wochen = die nächsten 7·w Tage (der Zähler läuft ab morgen jeden Tag um 1 herunter)
  r.inj.forEach(x=>{const p=PIX.get(x.id);if(!p)return;p.inj=Math.max(p.inj,x.w*7+1);if(p.team===S.my)news(`Verletzung: ${p.n} fällt ${x.w} Woche(n) aus.`,'bad');});}
