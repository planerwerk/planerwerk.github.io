// Spiel-Engine: Aufstellung, Teamwerte, Simulation eines Spiels, Auswirkungen auf die Spieler.
const slots=f=>{const[d,m,a]=RE.formationen[f];return['TW',...Array(d).fill('AB'),...Array(m).fill('MF'),...Array(a).fill('ST')];};
const avail=p=>p.inj<=0&&p.sus<=0;
function eff(p,pos){const k=RE.staerke;let e=p.str*zustand(p);if(p.pos!==pos)e*=(p.pos==='TW'||pos==='TW')?k.fremdTorwart:k.fremdPosition;return e;}
function fillXI(sl,pool,xi,used){sl.forEach((pos,i)=>{if(xi[i]!=null)return;let best=null,bv=-1;for(const p of pool){if(used.has(p.id))continue;const v=eff(p,pos);if(v>bv){bv=v;best=p;}}xi[i]=best?best.id:null;if(best)used.add(best.id);});return xi;}
function bestXI(tid,form){const sl=slots(form),pool=squad(tid).filter(avail),used=new Set(),xi=Array(11).fill(null);
  sl.forEach((pos,i)=>{let best=null,bv=-1;for(const p of pool){if(used.has(p.id)||p.pos!==pos)continue;const v=eff(p,pos);if(v>bv){bv=v;best=p;}}if(best){xi[i]=best.id;used.add(best.id);}});
  return fillXI(sl,pool,xi,used);}
function myXI(){const t=myT(),sl=slots(t.form),pool=squad(S.my).filter(avail),used=new Set();
  const xi=sl.map((pos,i)=>{const id=(S.lineup||[])[i];const p=PIX.get(id);if(p&&p.team===S.my&&avail(p)&&!used.has(id)){used.add(id);return id;}return null;});
  return fillXI(sl,pool,xi,used);}
function side(tid,home,neutral){const k=RE.staerke;
  if(tid>=1000){const a=S.am[tid-1000];const v=a.str*(home&&!neutral?RE.heim.amateure:1);return{id:tid,A:v,D:v,red:0,xp:[],xi:[],ein:'N'};}
  const t=S.teams[tid],sl=slots(t.form),xi=tid===S.my?myXI():bestXI(tid,t.form),g={TW:[],AB:[],MF:[],ST:[]},xp=[];
  xi.forEach((id,i)=>{const p=id!=null?PIX.get(id):null;if(p){g[sl[i]].push(eff(p,sl[i]));xp.push({p,pos:sl[i]});}else g[sl[i]].push(k.leererPlatz);});
  const av=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:k.leererPlatz,[d,m,a]=RE.formationen[t.form],Rh=RE.reihen;
  const gk=av(g.TW),df=av(g.AB)*(Rh.abwehr[0]+Rh.abwehr[1]*d),md=av(g.MF)*(Rh.mittelfeld[0]+Rh.mittelfeld[1]*m),at=av(g.ST)*(Rh.angriff[0]+Rh.angriff[1]*a);
  let A=RE.angriff.sturm*at+RE.angriff.mittelfeld*md+RE.angriff.abwehr*df,D=RE.abwehr.abwehr*df+RE.abwehr.mittelfeld*md+RE.abwehr.torwart*gk;
  const ta=RE.ausrichtung[t.tac];if(ta){A*=ta.A;D*=ta.D;}
  const ei=RE.einsatz[t.ein];if(ei){A*=ei.A;D*=ei.D;}
  if(home&&!neutral){A*=RE.heim.angriff;D*=RE.heim.abwehr;}
  return{id:tid,A,D,red:0,xp,xi:xi.filter(x=>x!=null),ein:t.ein};}
const xgf=(me,op)=>{const T=RE.tore;return clamp(T.basis*Math.pow(me.A*Math.max(T.rotAngriffMin,1-T.rotAngriff*me.red)/(op.D*Math.max(T.rotAbwehrMin,1-T.rotAbwehr*op.red)),T.exponent),T.min,T.max);};
function scorer(me,off){const c=me.xp.filter(x=>!off.has(x.p.id));if(!c.length)return null;const W=RE.schuetzen;let tot=0;const w=c.map(x=>{const v=W.gewicht[x.pos]*Math.pow(x.p.str/W.mitte,W.exponent);tot+=v;return v;});let r=R()*tot;for(let i=0;i<c.length;i++){r-=w[i];if(r<=0)return c[i].p;}return c[c.length-1].p;}
function cardPick(me,off){const c=me.xp.filter(x=>!off.has(x.p.id)&&x.pos!=='TW');return c.length?pick(c).p:null;}
const keeper=op=>{const k=op.xp.find(x=>x.pos==='TW');return k?k.p.n:'der Torwart';};
function shootout(){const q=RE.elfmeter;let a=0,b=0;for(let i=0;i<5;i++){if(R()<q)a++;if(R()<q)b++;}while(a===b){if(R()<q)a++;if(R()<q)b++;}return[a,b];}
function sim(hid,aid,o={}){return mitStrom(strom('spiel',S.season,S.tag,hid,aid),()=>simLauf(hid,aid,o));}
function simLauf(hid,aid,o){
  const H=side(hid,true,o.neutral),A=side(aid,false,o.neutral),Ss=[H,A],ev=[],sc=[0,0],yel={},off=new Set(),inj=[],K=RE.karten,V=RE.verletzung;
  let xg=[xgf(H,A),xgf(A,H)];const xg0=[...xg];
  const goal=(m,s,f)=>{sc[s]++;const p=scorer(Ss[s],off);ev.push({m,s,t:'G',p:p?p.id:null,n:p?p.n:rname(),sc:[...sc]});};
  for(let m=1;m<=90;m++)for(let s=0;s<2;s++){const me=Ss[s],op=Ss[1-s],pg=xg[s]/90,r=R();
    if(r<pg)goal(m,s);else if(r<pg*RE.chancen){const p=scorer(me,off);ev.push({m,s,t:'C',n:p?p.n:rname(),gk:keeper(op)});}
    const ef=me.ein==='H'?K.hart:me.ein==='F'?K.fair:1;
    if(R()<K.gelb*ef){const p=cardPick(me,off);if(p){if(yel[p.id]){off.add(p.id);me.red++;ev.push({m,s,t:'R',p:p.id,n:p.n,gy:1});xg=[xgf(H,A),xgf(A,H)];}else{yel[p.id]=1;ev.push({m,s,t:'Y',p:p.id,n:p.n});}}}
    if(R()<K.rot*ef){const p=cardPick(me,off);if(p){off.add(p.id);me.red++;ev.push({m,s,t:'R',p:p.id,n:p.n});xg=[xgf(H,A),xgf(A,H)];}}
    if(R()<V.chance*(op.ein==='H'?V.gegnerHart:1)){const p=cardPick(me,off);if(p&&!inj.find(x=>x.id===p.id)){inj.push({id:p.id,w:riA(V.wochen)});ev.push({m,s,t:'I',p:p.id,n:p.n});}}
  }
  let pen=null;
  if(o.ko&&sc[0]===sc[1]){for(let m=91;m<=120;m++)for(let s=0;s<2;s++)if(R()<xg[s]/90*RE.verlaengerung)goal(m,s);
    if(sc[0]===sc[1]){pen=shootout();ev.push({m:120,s:pen[0]>pen[1]?0:1,t:'P',pen});}}
  return{h:hid,a:aid,hg:sc[0],ag:sc[1],ev,pen,yel:Object.keys(yel).map(Number),off:[...off],inj,xi:[H.xi,A.xi],xg0,xpo:[H.xp.map(x=>[x.p.id,x.pos]),A.xp.map(x=>[x.p.id,x.pos])]};}
const winner=r=>r.hg>r.ag?r.h:r.hg<r.ag?r.a:(r.pen&&r.pen[0]>r.pen[1]?r.h:r.a);
function applyMatch(r,cup){return mitStrom(strom('nachspiel',S.season,S.tag,r.h,r.a),()=>applyMatchLauf(r,cup));}
// Nach dem Spiel (K03, K04 §5.9): Frische, Spielpraxis, Note, Form gegenüber der erwarteten Note, Selbstvertrauen, Serie gegenüber der Erwartung
function applyMatchLauf(r,cup){const N=RE.note,V=RP.selbstvertrauen,W=RE.schuetzen;
  [0,1].forEach(s=>{const tid=s?r.a:r.h;if(tid>=1000)return;const gf=s?r.ag:r.hg,ga=s?r.hg:r.ag,res=gf>ga?1:gf<ga?-1:0;
    const xgF=r.xg0[s],E=erwartung(xgF,r.xg0[1-s]),eres=E.sieg-E.niederlage,xp=r.xpo[s];
    let tot=0;const gew=xp.map(([id,pos])=>{const p=PIX.get(id),v=p?W.gewicht[pos]*Math.pow(p.str/W.mitte,W.exponent):0;tot+=v;return v;});
    xp.forEach(([id],k)=>{const p=PIX.get(id);if(!p)return;p.apps++;nachSpiel(p,90);
      const goals=r.ev.filter(e=>e.t==='G'&&e.p===id).length;if(cup)p.pg=(p.pg||0)+goals;else if(!r.rel)p.g+=goals;
      const fest=N.basis-(p.str-N.staerkeMitte)/N.staerkeTeiler;
      let gr=fest-res*N.ergebnis-goals*N.tor+(R()-0.5)*N.zufall;if(r.off.includes(id))gr+=N.platzverweis;gr=clamp(Math.round(gr*2)/2,N.min,N.max);
      const erw=clamp(fest-eres*N.ergebnis-(tot?xgF*gew[k]/tot:0)*N.tor,N.min,N.max);
      p.lastG=gr;formNachNote(p,gr,erw);if(goals)svAendern(p,goals*V.tor);if(gr<=2)svAendern(p,V.guteNote);else if(gr>=5)svAendern(p,V.schlechteNote);
      p.played=1;if(tid===S.my)(r.grades=r.grades||{})[id]=gr;});
    serieBuchen(S.teams[tid],res>0?3:res===0?1:0,E.punkte,r.xi[s]);});
  r.yel.forEach(id=>{const p=PIX.get(id);if(!p)return;p.yc++;if(p.yc>=RE.gelbSperreAb){p.yc=0;p.sus=Math.max(p.sus,1);if(p.team===S.my)news(`${p.n} sieht die ${RE.gelbSperreAb}. Gelbe Karte und ist für ein Spiel gesperrt.`,'bad');}});
  r.off.forEach(id=>{const p=PIX.get(id);if(!p)return;p.sus=riA(RE.rotSperre);if(p.team===S.my)news(`Platzverweis: ${p.n} fehlt ${p.sus} Spiel(e).`,'bad');});
  // Ausfall in Tagen: w Wochen = die nächsten 7·w Tage (der Zähler läuft ab morgen jeden Tag um 1 herunter)
  r.inj.forEach(x=>{const p=PIX.get(x.id);if(!p)return;p.inj=Math.max(p.inj,x.w*7+1);if(p.team===S.my)news(`Verletzung: ${p.n} fällt ${x.w} Woche(n) aus.`,'bad');});}
