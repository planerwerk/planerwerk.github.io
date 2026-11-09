// Taktik (K06): Spielstile mit Kreislauf und Umsetzung, Vertrautheit, Einstellung zum Spiel, Rollen, Standardschützen, Computer-Trainer.
const STILE=['ausgewogen','pressing','ballbesitz','mauern','konter','fluegel'];

// Vertrautheit eines Vereins mit einem Stil oder einer Grundordnung, 0–100 (K06 §3.4). Ohne Eintrag: bisheriger Stil und Ordnung 70, alles andere 30.
function vertraut(t,art,k){const V=RTA.vertrautheit,v=t.vt&&t.vt[art]&&t.vt[art][k];if(v!=null)return v;return(art==='stil'?(t.stil||'ausgewogen'):t.form)===k?V.start[0]:V.start[1];}
function vertrautSetzen(t,art,k,w){t.vt=t.vt||{stil:{},ordnung:{}};t.vt[art]=t.vt[art]||{};t.vt[art][k]=Math.round(clamp(w,RTA.vertrautheit.min,100)*10)/10;}
// Woche (K06 §5.4, bis K07): gewählter Stil und gewählte Ordnung +5, alles andere −2, nicht unter 30
// Seit K07 kommt der Zuwachs aus Taktik-Einheiten und Spielvorbereitung (trainingVerein), hier nur das Vergessen
function vertrautheitWoche(t){const V=RTA.vertrautheit,stil=t.stil||'ausgewogen';
  STILE.forEach(k=>{if(k!==stil)vertrautSetzen(t,'stil',k,vertraut(t,'stil',k)-V.vergessen);});
  Object.keys(RE.formationen).forEach(f=>{if(f!==t.form)vertrautSetzen(t,'ordnung',f,vertraut(t,'ordnung',f)-V.vergessen);});}
// Neuzugang (K06 §5.4): Ein neuer Stammspieler senkt alle Vertrautheitswerte um 4
function neuzugang(p,tid){const t=S.teams[tid];if(!t||p.str<teamLevel(tid)-2)return;const V=RTA.vertrautheit;
  STILE.forEach(k=>vertrautSetzen(t,'stil',k,vertraut(t,'stil',k)-V.neuzugang));Object.keys(RE.formationen).forEach(f=>vertrautSetzen(t,'ordnung',f,vertraut(t,'ordnung',f)-V.neuzugang));}
const ordnungFaktor=(t,f)=>{const V=RTA.vertrautheit,v=vertraut(t,'ordnung',f);return v<V.ordnungUnter?(1-V.ordnungMalus)+V.ordnungMalus*v/V.ordnungUnter:1;};

// Rollen (K06 §3.1): Mittelfeld-Mitte als DM, ZM, SM oder OM (höchstens ein Spielmacher), Sturm-Mitte als MS oder HS. Gespeichert je Grundordnung.
const rolleWaehlbar=pos=>RTA.rollen.mitte.includes(pos)?'mitte':RTA.rollen.sturm.includes(pos)?'sturm':null;
function slotsVerein(t,form){const f=form||t.form,sl=slots(f).slice(),r=t&&t.rollen&&t.rollen[f];if(r)for(const i in r){const g=rolleWaehlbar(sl[i]);if(g&&RTA.rollen[g].includes(r[i]))sl[i]=r[i];}return sl;}

// Ligaschnitt der Teamwerte (für die Umsetzung), einmal pro Tag gerechnet
let LIGA_W={key:null,w:{}};
function ligaWerte(lg){const key=S.season+'/'+S.tag;if(LIGA_W.key!==key)LIGA_W={key,w:{}};if(LIGA_W.w[lg])return LIGA_W.w[lg];
  const ts=S.teams.filter(t=>t.lg===lg&&squad(t.id).length),acc={};ts.forEach(t=>{const w=side(t.id,false,true).w;for(const k in w)acc[k]=(acc[k]||0)+w[k]/ts.length;});return LIGA_W.w[lg]=acc;}

// Voraussetzungen eines Stils (K06 §5.2), 0 bis 1: zur Hälfte ein Grundwert, zur Hälfte passende Merkmale mit abnehmendem Ertrag
function voraussetzung(sd,stil){const U=RTA.umsetzung,E=U.merkmalErtrag,xp=sd.xp.filter(x=>x.pos!=='TW'),w=sd.wRoh||sd.w,L=ligaWerte(S.teams[sd.id].lg)||w;
  const grund=(v,l)=>clamp(0.5+(v-l)/U.grundSpanne,0,1),frisch=v=>clamp((v-U.frische[0])/(U.frische[1]-U.frische[0]),0,1);
  const zahl=(f,mk)=>xp.filter(f).reduce((n,x)=>n+mk.filter(k=>hatMk(x.p,k)).length,0);
  const ertrag=(n,bedarf)=>Math.min(1,E.slice(0,Math.min(n,E.length)).reduce((a,b)=>a+b,0)/E.slice(0,bedarf).reduce((a,b)=>a+b,0));
  const gr=x=>posGruppe(x.pos),fluegel=x=>/^(LM|RM|LA|RA|LS|RS)$/.test(x.pos),aussen=x=>/^(LV|RV|LM|RM|LS|RS|LA|RA)$/.test(x.pos),mittel=(l,f)=>l.length?l.reduce((a,x)=>a+f(x),0)/l.length:0;
  let g,m;
  if(stil==='pressing'){g=frisch(mittel(xp,x=>(x.p.ko+x.p.fit)/2));m=ertrag(zahl(x=>gr(x)!=='AB',['schnell','ausdauernd','zweikampfstark']),3);}
  else if(stil==='ballbesitz'){g=grund(w.K,L.K);const sm=xp.find(x=>x.pos==='SM'),schnitt=mittel(xp,x=>eff(x.p,x.pos));m=0.5*(sm&&eff(sm.p,'SM')>=schnitt?1:0)+0.5*ertrag(zahl(()=>true,['ballsicher']),2);}
  else if(stil==='mauern'){g=grund(w.DM,L.DM);m=ertrag(zahl(x=>gr(x)==='AB'||x.pos==='DM',['zweikampfstark','stellungssicher','kopfballstark']),3);}
  else if(stil==='konter'){g=frisch(mittel(xp.filter(x=>gr(x)==='ST'||fluegel(x)||x.pos==='OM'),x=>x.p.fit));m=2/3*ertrag(zahl(x=>gr(x)==='ST'||fluegel(x),['schnell']),2)+1/3*ertrag(zahl(x=>gr(x)==='ST',['torjaeger']),1);}
  else if(stil==='fluegel'){g=grund((w.AL+w.AR)/2,(L.AL+L.AR)/2);m=2/3*ertrag(zahl(aussen,['flankengeber']),2)+1/3*ertrag(zahl(x=>gr(x)==='ST',['kopfballstark']),1);}
  else return 1;
  return 0.5*g+0.5*m;}
// Umsetzung (K06 §5.2): 0,5 × Voraussetzungen + 0,5 × Vertrautheit/100
function umsetzung(sd,stil){if(sd.am||!stil||stil==='ausgewogen')return 1;const U=RTA.umsetzung;return clamp(U.voraussetzungen*voraussetzung(sd,stil)+U.vertrautheit*vertraut(S.teams[sd.id],'stil',stil)/100,0,1);}
// Wirkung eines Stils (K06 §5.1): Vorteile wirken mit dem Anteil der Umsetzung, Nachteile immer voll
function stilWirkung(stil,u){const d=RTA.stile[stil]||{},vorteil={kontrolle:v=>v>1,angriffe:v=>v>1,konterEigen:v=>v>1,konterGegen:v=>v<1,frische:v=>v<1,fouls:v=>v<1,abwehr:v=>v>1};
  const f={kontrolle:1,angriffe:1,konterEigen:1,konterGegen:1,frische:1,fouls:1,abwehr:1,aussen:0,mix:{},konterMix:{}};
  for(const k in d){if(k==='mix'||k==='konterMix'){for(const q in d[k])f[k][q]=1+(d[k][q]-1)*u;}else if(k==='aussen')f.aussen=d.aussen*u;else f[k]=vorteil[k]&&vorteil[k](d[k])?1+(d[k]-1)*u:d[k];}
  return f;}

// Vor dem Anpfiff: Stil, Einstellung, Umsetzung, Kreislauf und Faktoren beider Mannschaften (Computer-Trainer wählen ihren Stil gegen diesen Gegner)
function taktikAnlegen(Ss,o){Ss.forEach(sd=>{if(sd.am)return;const t=S.teams[sd.id];sd.stil=STILE.includes(t.stil)?t.stil:'ausgewogen';
    sd.einst=sd.id===S.my?(t.einstellung||'normal'):(o.wichtig?'saison':'normal');sd.wRoh=sd.w;});
  Ss.forEach((sd,s)=>{if(!sd.am&&sd.id!==S.my)sd.stil=kiStil(sd,Ss[1-s]);});
  taktikWirkung(Ss);}
function taktikWirkung(Ss){const E=RTA.einstellung;
  Ss.forEach(sd=>{if(sd.am)return;sd.u=umsetzung(sd,sd.stil);});
  // Kreislauf (K06 §5.3): der Sieger erzeugt mehr Chancen, der Verlierer verliert einen Teil seiner Stil-Vorteile
  Ss.forEach((sd,s)=>{if(sd.am)return;const op=Ss[1-s],K=RTA.kreislauf,sieg=!op.am&&K[sd.stil]===op.stil,nieder=!op.am&&K[op.stil]===sd.stil;
    sd.kreis=sieg?1+K.vorteil*sd.u:1;sd.uWirk=nieder?sd.u*(1-K.daempfung*op.u):sd.u;});
  Ss.forEach(sd=>{if(sd.am)return;const t=S.teams[sd.id];sd.stilF=stilWirkung(sd.stil,sd.uWirk);
    let mult=ordnungFaktor(t,sd.form);if(sd.einst==='locker')mult*=E.locker.wirkung;else if(sd.einst==='saison')mult*=E.saison.wirkung;
    if(t.kater&&S.tag<t.kater)mult*=E.saison.kater;if(t.vbTag!=null&&S.tag-t.vbTag<=2&&S.tag>t.vbTag)mult*=1+RTA.vorbereitungBonus*(stabFaktor(sd.id,'video')>1?2:1);sd.mult=mult;sd.stdF=t.stdTag!=null&&S.tag-t.stdTag<=7?1+(RTA.standardsBonus-1)*stabFaktor(sd.id,'standard'):1;sd.frischeF=sd.einst==='locker'?E.locker.frische:1;});
  Ss.forEach(sd=>{if(sd.am)return;sd.w=teamWerte(sd);sd.A=0.5*sd.w.AM+0.25*(sd.w.AL+sd.w.AR);sd.D=0.4*sd.w.DM+0.2*(sd.w.DL+sd.w.DR)+0.2*sd.w.TW;});}
// Computer-Trainer (K06 §7): Außenseiter mauern oder kontern, Favoriten pressen oder haben den Ball, sonst ihr Profil. Gegen dich kontern sie mit Wahrscheinlichkeit 25 % deinen Lieblingsstil.
function kiStil(sd,op){const K=RTA.ki,t=S.teams[sd.id],q=op.am?2:(sd.A+sd.D)/Math.max(1,op.A+op.D);
  if(op.id===S.my&&R()<K.reaktion){const v=(S.stilVerlauf||[]).slice(-K.rueckblick);if(v.length){const z={};v.forEach(x=>z[x]=(z[x]||0)+1);const lieb=Object.entries(z).sort((a,b)=>b[1]-a[1])[0][0],gegen=Object.keys(RTA.kreislauf).find(k=>RTA.kreislauf[k]===lieb);if(gegen)return gegen;}}
  // Wahl nach Umsetzung und Kreislauf gegen den (bisher bekannten) Stil des Gegners
  const kreis=k=>op.am?0:RTA.kreislauf[k]===op.stil?1:RTA.kreislauf[op.stil]===k?-1:0,wahl=l=>l.map(k=>[k,umsetzung(sd,k)+K.kreislaufGewicht*kreis(k)]).sort((a,b)=>b[1]-a[1])[0][0];
  if(q<K.aussenseiter)return wahl(['mauern','konter']);if(q>K.favorit)return wahl(['ballbesitz','pressing']);return STILE.includes(t.stil)?t.stil:'ausgewogen';}
// Grundordnung der Computer-Vereine (K06 §7): die mit den höchsten Teamwerten, mit Vorliebe für die vertraute
function kiOrdnung(t){let best=t.form,bv=-1;const kader=squad(t.id);if(!kader.length)return;
  for(const f of Object.keys(RE.formationen)){const xi=bestXI(t.id,f,kader),sl=slots(f),xp=[];xi.forEach((id,i)=>{const p=id!=null?PIX.get(id):null;if(p)xp.push({p,pos:sl[i]});});
    const w=teamWerte({xp,tac:'N',ein:'N'}),v=(0.5*w.AM+0.25*(w.AL+w.AR)+0.4*w.DM+0.2*(w.DL+w.DR)+0.2*w.TW+0.3*w.K)*ordnungFaktor(t,f)*(f===t.form?RTA.ki.ordnungTreue:1);if(v>bv){bv=v;best=f;}}
  t.form=best;}
// Profil-Stil eines Computer-Vereins (bis K31)
function profilStil(){return waehleGewichtet(Object.assign({},RTA.ki.profil));}
