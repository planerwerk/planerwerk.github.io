// Europapokal (K37, U19a): Champions League, Europa League, Conference League mit Ligaphase und K.-o.-Runden nach dem Modus seit 2024/25.
// Teilnehmer: deutsche Vereine nach Tabelle und Pokal der Vorsaison (erste Saison: daten/termine.js), Auslandsvereine aus dem Pool (K32) nach Kontingent, Ansehen und Zufall.
// Spiele mit deutscher Beteiligung laufen durch die Engine. Der Auslandsverein spielt dort als Block mit seiner Teamstärke (wie die Amateure im Pokal), die Torschützen kommen aus seinen Kernspielern.
// Ausland gegen Ausland: Kurzrechnung im eigenen Strom. Seit U19b: Prämien und Wertsäule für deutsche Vereine, Ansehen zum Saisonwechsel, Vertrauen des Vorstands, Titel in der Vitrine.
// Im Spielstand: S.eu = {s, v (Zähler für den Terminindex), vor {cl, el, ecl} Titelverteidiger, titel {cl, el, ecl} Sieger dieser Saison, geld {Verein: Prämien der Saison}, cl/el/ecl: {t Teilnehmer, q, lp, ko}}
//   lp: [heim, gast, spieltag, tag, heimtore, gasttore]. q und ko.po bis ko.hf: [x (Rückspiel zu Hause), y, hinspiel [tore y, tore x] | null, rückspiel [tore x, tore y, elfmeter | null] | null].
//   ko.fin: [x, y, ergebnis [tore x, tore y, elfmeter | null] | null] auf neutralem Platz.
const EU_WB=['cl','el','ecl'],EU_KO=['po','af','vf','hf','fin'];
const EU_RUNDE={q:'Play-off-Runde der Qualifikation',lp:'Ligaphase',po:'K.-o.-Play-offs',af:'Achtelfinale',vf:'Viertelfinale',hf:'Halbfinale',fin:'Finale'};
const euName=wb=>REU.wb[wb].name;
const euRep=id=>id>=AV0?avVon(id).rep:S.teams[id].rep;
const euLand=id=>id>=AV0?avVon(id).land:'GER';
const euDe=id=>id<AV0;
const euAktiv=()=>!!S.eu&&S.eu.s===S.season;

// ---------- Termine ----------
// Absolute Tage der Saison, verschoben wie alle Rahmentermine (K01). Ein Finale nach dem letzten Spieltag rückt auf den Tag vor dem Saisonende (K37 §4.4).
function euPlanFuer(saison,ende){const T=TERMINE_2026.europa,sh=schiebung(saison),t=iso=>tagAusDatum(iso,saison,sh),zw=x=>Array.isArray(x)?[t(x[0]),t(x[1])]:[t(x),t(x)],P={};
  EU_WB.forEach(wb=>{const W=T[wb];P[wb]={min:minute(W.zeit),los:t(W.los),liga:W.liga.map(zw),losPo:t(W.losPo),losAf:t(W.losAf),fin:Math.min(t(W.fin),ende-1)};
    ['po','af','vf','hf'].forEach(r=>{P[wb][r]=W[r].map(zw);});if(W.quali)P[wb].quali=W.quali.map(zw);});return P;}
const euPlan=()=>S.plan.eu||(S.plan.eu=euPlanFuer(S.season,S.plan.ende));

// ---------- Teamstärke der Auslandsvereine ----------
// Mittel der elf Besten aus Kernspielern (K32 §3.1) und Ergänzung mit der Grundstärke aus dem Ansehen, mal Faktor (Kalibrierung, AW13). Je Tag zwischengespeichert.
let EUST={k:null,m:null};
function euStaerke(id){const k=S.seed+'/'+S.season+'/'+S.tag+'/'+(S.ausland?S.ausland.pl.length:0);if(EUST.k!==k)EUST={k,m:new Map()};if(EUST.m.has(id))return EUST.m.get(id);
  const v=avVon(id),g=avStaerke(v),l=avKader(id).map(p=>p.str).sort((a,b)=>b-a).slice(0,11);while(l.length<11)l.push(g);
  const x=REU.staerke.faktor*l.reduce((s,y)=>s+y,0)/11;EUST.m.set(id,x);return x;}
// Torschützen eines Auslandsvereins: Stürmer doppelt, übrige Feldspieler einfach
const euTorschuetzen=id=>avKader(id).filter(p=>p.pos!=='TW').flatMap(p=>p.pos==='ST'?[p.n,p.n]:[p.n]);
// Ausland gegen Ausland ohne Engine (K37 §5.2): erwartete Tore aus dem Verhältnis der Stärken, im K.-o.-Spiel Verlängerung und Elfmeterschießen
function euKurz(h,a,o){const K=REU.kurz,q=euStaerke(h)*(o.neutral?1:K.heim)/euStaerke(a),xh=clamp(K.tore*Math.pow(q,K.exp),0.2,5),xa=clamp(K.tore*Math.pow(1/q,K.exp),0.1,5);
  let hg=poisson(xh),ag=poisson(xa),pen=null;const agg=o.agg||[0,0],gleich=()=>hg+agg[0]===ag+agg[1];
  if(o.ko&&gleich()){hg+=poisson(xh*K.verl);ag+=poisson(xa*K.verl);if(gleich())pen=shootout();}
  return{h,a,hg,ag,pen};}

// ---------- Geld und Ansehen (K37 §5.3, §5.4, U19b) ----------
// Betrag aus REGELN.europa.geld mal Faktor (bis K23c 0,2), auf 1.000 gerundet
const euGeldWert=(wb,k,n=1)=>Math.round((REU.geld[wb][k]||0)*n*REU.geld.faktor/1000)*1000;
// Zahlung an einen deutschen Verein: dein Verein bucht „Europapokal“, Computer-Vereine aufs Konto. S.eu.geld zählt je Verein mit (Finanzseite, Tests).
function euZahlen(tid,betrag,grund){if(!betrag||!euDe(tid))return;S.eu.geld=S.eu.geld||{};S.eu.geld[tid]=(S.eu.geld[tid]||0)+betrag;
  if(tid===S.my){money('Europapokal',betrag);if(grund)news(`Europapokal: ${grund}, ${fmt(betrag)}.`,'good');}else S.teams[tid].cash+=betrag;}
// Mit der Auslosung der Ligaphase: Startgeld und Wertsäule (Schnitt × 2 × (37 − Rang des Ansehens) / 37)
function euStartgeld(wb){const W=S.eu[wb],rang=W.t.slice().sort((a,b)=>euRep(b)-euRep(a));
  W.t.filter(euDe).forEach(id=>euZahlen(id,euGeldWert(wb,'start')+euGeldWert(wb,'wert',2*(37-(rang.indexOf(id)+1))/37),`Startgeld und Wertsäule der ${euName(wb)}`));}
// Nach der Ligaphase: Rangprämie (Platz 1 bekommt 36 Anteile, Platz 36 einen)
function euRangpraemie(wb){if(!REU.geld[wb].rang)return;euTabelle(wb).forEach((r,i)=>euZahlen(r.id,euGeldWert(wb,'rang',36-i),`Rangprämie für Platz ${i+1} der Ligaphase`));}
// Beim Erreichen einer K.-o.-Runde
function euRundenGeld(wb,r){(S.eu[wb].ko[r]||[]).forEach(k=>[k[0],k[1]].forEach(id=>euZahlen(id,euGeldWert(wb,r),`${EU_RUNDE[r]} der ${euName(wb)} erreicht`)));}
// Ansehen zum Saisonwechsel (saison.js, vor dem neuen Europapokal): erreichte Runde mal Anteil des Wettbewerbs
function euAnsehen(tid){if(!S.eu||tid>=AV0)return 0;const A=REU.ansehen;let x=0;
  EU_WB.forEach(wb=>{const W=S.eu[wb];if(!W||!W.t.includes(tid))return;const drin=r=>(W.ko[r]||[]).some(k=>k[0]===tid||k[1]===tid);
    x+=(S.eu.titel[wb]===tid?A.titel:drin('fin')||drin('hf')?A.hf:drin('vf')?A.vf:drin('af')?A.af:0)*A.anteil[wb];});return Math.round(x);}

// ---------- Länderwertung, Interesse, Nebenziel (U19c) ----------
// Länderwertung einer Saison: Punkte für Siege und Remis (nach 90 oder 120 Minuten), je Land geteilt durch die Zahl seiner Vereine (mit der Qualifikation)
function euLaenderwertung(E){if(!E)return[];const W=REU.wertung,m=new Map(),gesehen=new Set(),zeile=l=>{if(!m.has(l))m.set(l,{land:l,p:0,n:0});return m.get(l);},
    pkt=(id,gf,ga)=>{zeile(euLand(id)).p+=gf>ga?W.sieg:gf===ga?W.remis:0;};
  EU_WB.forEach(wb=>{const X=E[wb];[...X.t,...(X.q?[X.q[0],X.q[1]]:[])].forEach(id=>{if(gesehen.has(id))return;gesehen.add(id);zeile(euLand(id)).n++;});
    (X.lp||[]).forEach(([h,a,,,hg,ag])=>{if(hg!=null){pkt(h,hg,ag);pkt(a,ag,hg);}});
    const duell=k=>{if(k.length===3){if(k[2]){pkt(k[0],k[2][0],k[2][1]);pkt(k[1],k[2][1],k[2][0]);}return;}
      if(k[2]){pkt(k[1],k[2][0],k[2][1]);pkt(k[0],k[2][1],k[2][0]);}if(k[3]){pkt(k[0],k[3][0],k[3][1]);pkt(k[1],k[3][1],k[3][0]);}};
    if(X.q)duell(X.q);EU_KO.forEach(r=>(X.ko[r]||[]).forEach(duell));});
  return[...m.values()].filter(x=>x.n>0).map(x=>Object.assign(x,{w:Math.round(x.p/x.n*100)/100})).sort((a,b)=>b.w-a.w||b.p-a.p);}
const euLandName=l=>(nation(l)||{name:l}).name;
// Wechselinteresse (vertraege.js wechselInteresse): Spieler wollen eher zu einem Verein im Europapokal
const euInteresse=tid=>{if(!euAktiv()||tid==null||tid<0)return 0;const wb=EU_WB.find(w=>S.eu[w].t.includes(tid));return wb?REU.interesse[wb]:0;};
// Nebenziel des Vorstands (vorstand.js): K.-o.-Play-offs erreichen, in der Champions League ab REU.ziel.afAbAnsehen das Achtelfinale
function euZielMoeglich(){const wb=euMeinWb();if(!wb||!S.eu[wb].t.includes(S.my))return null;return{wb,min:wb==='cl'&&myT().rep>=REU.ziel.afAbAnsehen?'af':'po'};}
function euZielStand(z,ende){const W=euAktiv()&&S.eu[z.wb];if(!W||!W.t.includes(S.my))return ende?'verfehlt':'offen';
  const mit=k=>k[0]===S.my||k[1]===S.my,tb=euLigaFertig(z.wb)?euTabelle(z.wb).findIndex(r=>r.id===S.my):-1;
  if(z.min==='po'&&tb>=0)return tb<24?'erfuellt':'verfehlt';
  if(z.min==='af'){if((W.ko.af||[]).some(mit)||(tb>=0&&tb<8))return'erfuellt';if(tb>=24)return'verfehlt';const k=(W.ko.po||[]).find(mit),s=k?euSieger(k):null;if(s!=null)return s===S.my?'erfuellt':'verfehlt';}
  return ende?'verfehlt':'offen';}

// ---------- Teilnehmer (K37 §5.1) ----------
// Deutsche Vereine nach Abschlusstabelle und Pokalsieger der Vorsaison. sm fehlt in der ersten Saison: dann die echten Starter.
// fuenf: Deutschland hat über die Länderwertung einen Platz mehr in der Champions League (U19c), dann rücken alle Plätze danach um eins nach.
function euDeutsche(sm,fuenf){const out={cl:[],el:[],ecl:[]};
  if(!sm){const ix={};S.teams.forEach(t=>{ix[t.sh]=t.id;});EU_WB.forEach(wb=>(TERMINE_2026.europaStart[wb]||[]).forEach(k=>{if(ix[k]!=null)out[wb].push(ix[k]);}));return out;}
  const P0=REU.plaetze,o=fuenf?1:0,P={cl:fuenf?[...P0.cl,P0.cl[P0.cl.length-1]+1]:P0.cl,el:P0.el.map(p=>p+o),ecl:P0.ecl.map(p=>p+o),nachruecken:{el:P0.nachruecken.el+o,ecl:P0.nachruecken.ecl+o}};
  const an=p=>{const t=S.teams.find(x=>x.lastLg===1&&x.lastPos===p);return t?t.id:null;},cw=sm.cup,cp=cw!=null&&S.teams[cw].lastLg===1?S.teams[cw].lastPos:99;
  P.cl.forEach(p=>out.cl.push(an(p)));P.el.forEach(p=>out.el.push(an(p)));
  if(cw!=null)out.el.push(cp<=P.el[P.el.length-1]?an(P.nachruecken.el):cw); // Pokalsieger schon über die Liga dabei: der Nächste rückt nach
  out.ecl.push(an(cw!=null&&cp<=P.ecl[0]?P.nachruecken.ecl:P.ecl[0]));
  EU_WB.forEach(wb=>{out[wb]=out[wb].filter((x,i,l)=>x!=null&&l.indexOf(x)===i);});return out;}
// Titelverteidiger (K37 §5.1): Champions League und Europa League in die Champions League, Conference League in die Europa League. Ein deutscher nimmt keinen Bundesliga-Platz weg.
function euTitelDeutsch(de,vor){if(!vor)return;const rang=w=>EU_WB.indexOf(w);
  EU_WB.forEach(wb=>{const id=vor[wb];if(id==null||!euDe(id))return;const ziel=REU.wb[wb].titel,jetzt=EU_WB.find(w=>de[w].includes(id));
    if(jetzt&&rang(jetzt)<=rang(ziel))return;if(jetzt)de[jetzt]=de[jetzt].filter(x=>x!==id);de[ziel].push(id);});}
// Auslandsvereine: je Land nach Ansehen plus Zufall, zuerst die Champions League. Fehlen Plätze, die Nächsten aus allen Ländern. Titelverteidiger sind fest dabei.
function euAuslandWaehlen(bedarf,vor,plus=[]){const Z=REU.zufall,sc=(S.ausland?S.ausland.v:[]).map((v,i)=>({id:AV0+i,land:v.land,w:v.rep+(R()*2-1)*Z,fest:false}));
  const used=new Set(),out={cl:[],el:[],ecl:[]},nimm=(wb,x)=>{used.add(x.id);out[wb].push(x);};
  if(vor)EU_WB.forEach(wb=>{const id=vor[wb],x=id!=null&&!euDe(id)?sc[id-AV0]:null;if(x&&!used.has(x.id)){x.fest=true;nimm(REU.wb[wb].titel,x);}});
  EU_WB.forEach(wb=>{const K=Object.assign({},REU.laender[wb]);if(wb==='cl')plus.forEach(l=>{if(l!=='GER')K[l]=(K[l]||0)+1;}); // Länderwertung: ein Platz mehr (U19c)
    for(const land in K)sc.filter(x=>x.land===land&&!used.has(x.id)).sort((a,b)=>b.w-a.w).slice(0,K[land]).forEach(x=>nimm(wb,x));
    sc.filter(x=>!used.has(x.id)).sort((a,b)=>b.w-a.w).slice(0,Math.max(0,bedarf[wb]-out[wb].length)).forEach(x=>nimm(wb,x));
    out[wb].sort((a,b)=>b.w-a.w);while(out[wb].length>bedarf[wb]){const i=out[wb].map(x=>!x.fest).lastIndexOf(true);if(i<0)break;used.delete(out[wb][i].id);out[wb].splice(i,1);}});
  return{cl:out.cl.map(x=>x.id),el:out.el.map(x=>x.id),ecl:out.ecl.map(x=>x.id),quali:sc.filter(x=>!used.has(x.id)).sort((a,b)=>b.w-a.w).slice(0,REU.quali).map(x=>x.id)};}
// Saisonwechsel (saison.js newSeasonLauf) und neue Welt (welt.js buildWorld, ohne sm): Teilnehmer aller drei Wettbewerbe, eigener Strom 'europa'
function europaAnlegen(sm){const vor=S.eu&&S.eu.titel?S.eu.titel:null,wv=sm&&S.eu?euLaenderwertung(S.eu).map(x=>({land:x.land,w:x.w})):[],plus=wv.slice(0,REU.wertung.plaetze).map(x=>x.land);
  S.eu=null;if(!S.ausland||!S.ausland.v.length)return;
  mitStrom(strom('europa',S.season),()=>{const dt=euDeutsche(sm,plus.includes('GER'));euTitelDeutsch(dt,vor);
    const a=euAuslandWaehlen({cl:36-dt.cl.length,el:36-dt.el.length,ecl:36-dt.ecl.length},vor,plus);
    S.eu={s:S.season,v:1,vor,wv,plus,titel:{cl:null,el:null,ecl:null},cl:{t:[...dt.cl,...a.cl],lp:null,ko:{}},el:{t:[...dt.el,...a.el],lp:null,ko:{}},ecl:{t:a.ecl.slice(),lp:null,ko:{},q:null}};
    // Der deutsche Starter der Conference League spielt die Play-off-Runde der Qualifikation gegen einen der besten übrigen Auslandsvereine (K37 §4.2)
    dt.ecl.forEach(id=>{const g=a.quali.length?a.quali[Math.floor(R()*a.quali.length)]:null;if(g!=null&&!S.eu.ecl.q)S.eu.ecl.q=[id,g,null,null];else S.eu.ecl.t.push(id);});});
  if(S.eu.ecl.q)euVerlegen('ecl','q');
  if(sm&&plus.length)news(`Länderwertung ${S.season-1}/${S.season%100}: ${plus.map(euLandName).join(' und ')} ${plus.length>1?'bekommen':'bekommt'} diese Saison einen Platz mehr in der Champions League.${plus.includes('GER')?' Damit spielt auch der Fünfte der Bundesliga dort.':''}`,plus.includes('GER')?'good':'');
  if(sm){const m=euMeinWb();if(m)news(m==='ecl'&&S.eu.ecl.q&&S.eu.ecl.q[0]===S.my?`Europapokal: Dein Verein spielt die Play-off-Runde der Qualifikation zur Conference League gegen ${tn(S.eu.ecl.q[1])} (${datumKurz(euPlan().ecl.quali[0][0])} und ${datumKurz(euPlan().ecl.quali[1][0])}).`
    :`Europapokal: Dein Verein spielt in der ${euName(m)}. Die Ligaphase wird am ${datumKurz(euPlan()[m].los)} ausgelost.`,'good');}}
const euMeinWb=()=>euAktiv()?EU_WB.find(wb=>S.eu[wb].t.includes(S.my)||(S.eu[wb].q&&S.eu[wb].q.includes(S.my)))||null:null;

// ---------- Auslosung der Ligaphase (K37 §4.3) ----------
// Vier Töpfe zu neun: Tage 0 bis 2 je zwei Spiele im eigenen Topf (Kreis k gegen k+1, k hat Heimrecht) und ein Spiel gegen den Partnertopf (0-1, 2-3),
// Tag 3 das zweite gegen den Partnertopf mit anderem Gegner, Tage 4 bis 7 je zwei gegen die Töpfe der Paarungen 0-2/1-3 und 0-3/1-2.
// So spielt jeder Verein an jedem Spieltag genau einmal, je Topf zwei Gegner, einmal zu Hause und einmal auswärts.
function euPlan4(P){const M=[],N=9,add=(h,a,d)=>M.push([h,a,d]);
  for(let p=0;p<4;p++){[0,2,4,6].forEach(k=>add(P[p][k],P[p][k+1],0));[1,3,5,7].forEach(k=>add(P[p][k],P[p][k+1],1));add(P[p][8],P[p][0],2);}
  [[0,1],[2,3]].forEach(([a,b])=>{const m=[0,...shuffle([1,2,3,4,5,6,7]),8];add(P[a][8],P[b][8],0);add(P[a][0],P[b][0],1);for(let k=1;k<=7;k++)add(P[a][k],P[b][m[k]],2);
    let g;do g=shuffle([...Array(N).keys()]);while(g.some((x,k)=>x===m[k]));for(let k=0;k<N;k++)add(P[b][g[k]],P[a][k],3);});
  [[[0,2],[1,3]],[[0,3],[1,2]]].forEach((paare,j)=>paare.forEach(([a,b])=>{const h=shuffle([...Array(N).keys()]),s=1+Math.floor(R()*(N-1));
    for(let k=0;k<N;k++){add(P[a][k],P[b][h[k]],4+2*j);add(P[b][h[(k+s)%N]],P[a][k],5+2*j);}}));
  return M;}
// Sechs Töpfe zu sechs (Conference League): Tag 0 im eigenen Topf, Tage 1 bis 5 gegen die übrigen Töpfe (Rundenplan für sechs), danach drei Heim- und drei Auswärtsspiele je Verein
function euPlan6(P){const M=[],N=6;for(let p=0;p<6;p++)for(let k=0;k<N;k+=2)M.push([P[p][k],P[p][k+1],0]);
  for(let r=0;r<5;r++)[[5,r],[(r+1)%5,(r+4)%5],[(r+2)%5,(r+3)%5]].forEach(([a,b])=>{const h=shuffle([...Array(N).keys()]);for(let k=0;k<N;k++)M.push(R()<0.5?[P[a][k],P[b][h[k]],r+1]:[P[b][h[k]],P[a][k],r+1]);});
  euHeimAusgleich(M,3);return M;}
// Heimrecht ausgleichen: von einem Verein mit zu vielen Heimspielen über eine Kette getauschter Heimrechte zu einem mit zu wenigen
function euHeimAusgleich(M,soll){const H=new Map();M.forEach(m=>{H.set(m[0],(H.get(m[0])||0)+1);if(!H.has(m[1]))H.set(m[1],0);});
  for(let it=0;it<M.length;it++){const u=[...H.keys()].find(x=>H.get(x)>soll);if(u==null)return;const prev=new Map([[u,null]]),q=[u];let ziel=null;
    while(q.length&&ziel==null){const x=q.shift();for(const m of M){if(m[0]!==x||prev.has(m[1]))continue;prev.set(m[1],m);if(H.get(m[1])<soll){ziel=m[1];break;}q.push(m[1]);}}
    if(ziel==null)return;let y=ziel;while(y!==u){const m=prev.get(y),x=m[0];m[0]=y;m[1]=x;H.set(x,H.get(x)-1);H.set(y,H.get(y)+1);y=x;}}}
// Kein Gegner aus dem eigenen Land, höchstens max aus demselben Land
function euLosOk(M,max){const c=new Map(),zaehl=(id,l)=>{let m=c.get(id);if(!m){m={};c.set(id,m);}m[l]=(m[l]||0)+1;return m[l];};
  for(const[h,a]of M){const lh=euLand(h),la=euLand(a);if(lh===la||zaehl(h,la)>max||zaehl(a,lh)>max)return false;}return true;}
function euLigaphaseLosen(wb){const W=S.eu[wb],A=REU.auslosung,vor=S.eu.vor&&S.eu.vor[wb],n=REU.wb[wb].toepfe,T=W.t.slice().sort((a,b)=>(b===vor)-(a===vor)||euRep(b)-euRep(a));
  if(T.length!==REU.wb[wb].teams){W.lp=[];return;}const g=T.length/n;let M=null;
  for(let v=0;v<A.versuche;v++){const P=Array.from({length:n},(_,i)=>shuffle(T.slice(i*g,i*g+g)));M=n===4?euPlan4(P):euPlan6(P);if(euLosOk(M,v<A.ohneHoechstzahl?A.hoechstzahl:99))break;}
  const tage=euPlan()[wb].liga,reihe=shuffle([...Array(tage.length).keys()]),je={};M.forEach(m=>{const md=reihe[m[2]];(je[md]=je[md]||[]).push(m);});
  W.lp=[];Object.keys(je).forEach(md=>shuffle(je[md]).forEach((m,i)=>W.lp.push([m[0],m[1],+md,tage[md][i%2],null,null])));W.lp.sort((x,y)=>x[2]-y[2]||x[3]-y[3]);S.eu.v++;
  euVerlegen(wb,'lp');euStartgeld(wb);const mein=W.lp.filter(m=>m[0]===S.my||m[1]===S.my);
  if(mein.length)news(`Auslosung ${euName(wb)}: Deine Gegner in der Ligaphase sind ${mein.map(m=>`${tn(m[0]===S.my?m[1]:m[0])} (${m[0]===S.my?'H':'A'})`).join(', ')}.`,'good');}

// ---------- Tabelle und K.-o.-Runden (K37 §4.4) ----------
// Punkte, Tordifferenz, Tore, Auswärtstore, Siege, zuletzt Ansehen (statt des UEFA-Koeffizienten)
function euTabelle(wb){const W=euAktiv()&&S.eu[wb];if(!W||!W.lp)return[];const m=new Map();W.t.forEach(id=>m.set(id,{id,sp:0,s:0,u:0,n:0,t:0,g:0,aw:0,p:0}));
  W.lp.forEach(([h,a,,,hg,ag])=>{const H=m.get(h),A=m.get(a);if(hg==null||!H||!A)return;H.sp++;A.sp++;H.t+=hg;H.g+=ag;A.t+=ag;A.g+=hg;A.aw+=ag;
    if(hg>ag){H.s++;H.p+=3;A.n++;}else if(hg<ag){A.s++;A.p+=3;H.n++;}else{H.u++;A.u++;H.p++;A.p++;}});
  return[...m.values()].sort((x,y)=>y.p-x.p||(y.t-y.g)-(x.t-x.g)||y.t-x.t||y.aw-x.aw||y.s-x.s||euRep(y.id)-euRep(x.id));}
const euLigaFertig=wb=>{const W=S.eu[wb];return!!W.lp&&W.lp.length>0&&W.lp.every(m=>m[4]!=null);};
// Sieger eines Duells (Hin- und Rückspiel) oder des Finales, null solange offen
function euSieger(k){if(k.length===3){const e=k[2];return e?winner({h:k[0],a:k[1],hg:e[0],ag:e[1],pen:e[2]}):null;}
  const[x,y,l1,l2]=k;if(!l1||!l2)return null;const gx=l1[1]+l2[0],gy=l1[0]+l2[1];return gx>gy?x:gy>gx?y:(l2[2]&&l2[2][0]>l2[2][1]?x:y);}
// Play-offs: 9/10 gegen 23/24, 11/12 gegen 21/22, 13/14 gegen 19/20, 15/16 gegen 17/18, gelost nur innerhalb der Platzpaare, der besser Platzierte hat das Rückspiel zu Hause
function euPlayoffsLosen(wb){const W=S.eu[wb],tb=euTabelle(wb).map(r=>r.id),T=[];
  for(let j=0;j<4;j++){const u=shuffle([tb[23-2*j],tb[22-2*j]]);T.push([tb[8+2*j],u[0],null,null],[tb[9+2*j],u[1],null,null]);}
  W.ko.po=T;S.eu.v++;euVerlegen(wb,'po');euLosMeldung(wb,'po');euRangpraemie(wb);euRundenGeld(wb,'po');}
// Achtelfinale: Platz 1/2 gegen die Sieger aus 15/16 – 17/18, 3/4 aus 13/14 – 19/20, 5/6 aus 11/12 – 21/22, 7/8 aus 9/10 – 23/24.
// Turnierbaum in der Reihenfolge 1, 8, 4, 5, 2, 7, 3, 6 (Platz 1 und 2 treffen sich erst im Finale). Wer von einem Platzpaar oben steht, wird gelost.
function euAchtelfinaleLosen(wb){const W=S.eu[wb],tb=euTabelle(wb).map(r=>r.id),sg=W.ko.po.map(euSieger);
  const s=[0,1,2,3].map(j=>shuffle([tb[2*j],tb[2*j+1]])),g=[0,1,2,3].map(j=>shuffle([sg[2*(3-j)],sg[2*(3-j)+1]])),T=(o,j)=>[s[j][o],g[j][o],null,null];
  W.ko.af=[T(0,0),T(0,3),T(0,1),T(0,2),T(1,0),T(1,3),T(1,1),T(1,2)];S.eu.v++;euVerlegen(wb,'af');euLosMeldung(wb,'af');euRundenGeld(wb,'af');}
// Viertelfinale bis Finale aus dem Baum: Nachbarn treffen sich, Heimrecht im Rückspiel für den in der Ligaphase besser Platzierten
function euNaechsteRunde(wb,r){const W=S.eu[wb],sg=W.ko[EU_KO[EU_KO.indexOf(r)-1]].map(euSieger),rang=new Map(euTabelle(wb).map((x,i)=>[x.id,i])),T=[];
  for(let i=0;i<sg.length;i+=2){const[a,b]=[sg[i],sg[i+1]].sort((p,q)=>rang.get(p)-rang.get(q));T.push(r==='fin'?[a,b,null]:[a,b,null,null]);}
  W.ko[r]=T;S.eu.v++;euVerlegen(wb,r);euLosMeldung(wb,r);euRundenGeld(wb,r);}
function euLosMeldung(wb,r){const k=(S.eu[wb].ko[r]||[]).find(x=>x[0]===S.my||x[1]===S.my);if(!k)return;const o=k[0]===S.my?k[1]:k[0],P=euPlan()[wb];
  news(r==='fin'?`${euName(wb)}: Dein Verein steht im Finale gegen ${tn(o)}, am ${datumKurz(P.fin)} auf neutralem Platz.`:`Auslosung ${euName(wb)}, ${EU_RUNDE[r]}: gegen ${tn(o)}, Rückspiel ${k[0]===S.my?'zu Hause':'auswärts'}.`,'good');}

// ---------- Kalender ----------
// Termine eines Tages je Wettbewerb, Runde und Spiel (Hinspiel leg 0, Rückspiel leg 1). Index je Saison und Stand der Auslosungen.
let EUINDEX={eu:null,v:null,m:null};
function euTermineAm(d){if(!euAktiv()||S.phase!=='play')return[];
  if(EUINDEX.eu!==S.eu||EUINDEX.v!==S.eu.v){const m=new Map(),P=euPlan(),add=(tag,x)=>{if(!m.has(tag))m.set(tag,[]);const l=m.get(tag);if(!l.some(y=>y.wb===x.wb&&y.runde===x.runde&&y.leg===x.leg&&y.md===x.md))l.push(Object.assign({art:'eu',tag},x));};
    EU_WB.forEach(wb=>{const W=S.eu[wb],p=P[wb],min=p.min;if(W.q)[0,1].forEach(leg=>add(p.quali[leg][0],{wb,runde:'q',leg,min}));
      (W.lp||[]).forEach(x=>add(x[3],{wb,runde:'lp',md:x[2],leg:0,min}));
      EU_KO.forEach(r=>{const L=W.ko[r];if(!L)return;if(r==='fin'){add(p.fin,{wb,runde:r,leg:0,min});return;}L.forEach((x,i)=>[0,1].forEach(leg=>add(p[r][leg][i%2],{wb,runde:r,leg,min})));});});
    EUINDEX={eu:S.eu,v:S.eu.v,m};}
  return EUINDEX.m.get(d)||[];}
// Offene Spiele eines Termins mit den Optionen für die Engine
function euSpieleAm(e){const W=euAktiv()&&S.eu[e.wb];if(!W)return[];const P=euPlan()[e.wb],out=[];
  if(e.runde==='lp'){(W.lp||[]).forEach((m,i)=>{if(m[2]===e.md&&m[3]===e.tag&&m[4]==null)out.push({h:m[0],a:m[1],i,o:{wb:'eu'}});});return out;}
  if(e.runde==='fin'){(W.ko.fin||[]).forEach((k,i)=>{if(!k[2]&&P.fin===e.tag)out.push({h:k[0],a:k[1],i,o:{wb:'eu',ko:1,neutral:1,wichtig:1}});});return out;}
  const L=e.runde==='q'?(W.q?[W.q]:[]):(W.ko[e.runde]||[]),tage=e.runde==='q'?P.quali:P[e.runde];
  L.forEach((k,i)=>{if(tage[e.leg][i%2]!==e.tag)return;if(e.leg===0&&!k[2])out.push({h:k[1],a:k[0],i,o:{wb:'eu',wichtig:1}});
    else if(e.leg===1&&k[2]&&!k[3])out.push({h:k[0],a:k[1],i,o:{wb:'eu',ko:1,agg:[k[2][1],k[2][0]],wichtig:1}});});
  return out;}
const euMeinSpiel=e=>euSpieleAm(e).find(m=>m.h===S.my||m.a===S.my)||null;
const euSpielName=e=>`${euName(e.wb)}, ${e.runde==='lp'?`${e.md+1}. Spieltag`:EU_RUNDE[e.runde]+(e.runde==='fin'?'':e.leg?', Rückspiel':', Hinspiel')}`;
// Alle Spiele deines Vereins in dieser Saison (gespielt und offen), für Kalender und Ansicht
function euMeineSpiele(){const out=[];if(!euAktiv())return out;const P=euPlan(),me=S.my;
  EU_WB.forEach(wb=>{const W=S.eu[wb],p=P[wb],min=p.min;
    const duell=(runde,k,i)=>{if(k[0]!==me&&k[1]!==me)return;if(runde==='fin'){const e=k[2];out.push({wb,runde,leg:0,tag:p.fin,min,h:k[0],a:k[1],hg:e?e[0]:null,ag:e?e[1]:null,pen:e?e[2]:null});return;}
      const tage=runde==='q'?p.quali:p[runde];out.push({wb,runde,leg:0,tag:tage[0][i%2],min,h:k[1],a:k[0],hg:k[2]?k[2][0]:null,ag:k[2]?k[2][1]:null,pen:null});
      out.push({wb,runde,leg:1,tag:tage[1][i%2],min,h:k[0],a:k[1],hg:k[3]?k[3][0]:null,ag:k[3]?k[3][1]:null,pen:k[3]?k[3][2]:null});};
    if(W.q)duell('q',W.q,0);(W.lp||[]).forEach(x=>{if(x[0]===me||x[1]===me)out.push({wb,runde:'lp',md:x[2],leg:0,tag:x[3],min,h:x[0],a:x[1],hg:x[4],ag:x[5],pen:null});});
    EU_KO.forEach(r=>(W.ko[r]||[]).forEach((k,i)=>duell(r,k,i)));});
  return out.sort((a,b)=>a.tag-b.tag);}
// Auslosung mit deinem Verein heute: Halt wie beim Pokal (K13)
function euLosHeute(d){if(!euAktiv()||S.phase!=='play')return false;const P=euPlan();
  return EU_WB.some(wb=>{const W=S.eu[wb],p=P[wb];if(d===p.los)return W.t.includes(S.my)||(!!W.q&&W.q[0]===S.my&&euSieger(W.q)===S.my);
    if(d!==p.losPo&&d!==p.losAf)return false;const rang=W.lp?euTabelle(wb).findIndex(r=>r.id===S.my):-1;if(d===p.losPo)return rang>=8&&rang<24;if(d===p.losAf)return(rang>=0&&rang<8)||(W.ko.po||[]).some(k=>euSieger(k)===S.my);return false;});}
// 72 Stunden (K13 §3.5): Ligaspiele deutscher Teilnehmer neben einem Europapokalspiel verlegen
function euVerlegen(wb,runde){const W=S.eu[wb],P=euPlan()[wb],plan=[];
  if(runde==='lp')(W.lp||[]).forEach(m=>plan.push([m[3],[m[0],m[1]]]));
  else if(runde==='fin')(W.ko.fin||[]).forEach(k=>plan.push([P.fin,[k[0],k[1]]]));
  else(runde==='q'?(W.q?[W.q]:[]):(W.ko[runde]||[])).forEach((k,i)=>{const t=runde==='q'?P.quali:P[runde];[0,1].forEach(leg=>plan.push([t[leg][i%2],[k[0],k[1]]]));});
  plan.forEach(([d,ids])=>{const dt=ids.filter(euDe);if(dt.length)ligaVerlegen(d,new Set(dt),'des Europapokals');});}

// ---------- Ablauf ----------
// Täglich (ablauf.js taeglichLauf): Auslosungen, je mit eigenem Strom
function euTag(d){if(!euAktiv()||S.phase!=='play')return;const P=euPlan();
  EU_WB.forEach(wb=>{const W=S.eu[wb],p=P[wb];
    if(d>=p.los&&!W.lp)mitStrom(strom('eulos',S.season,wb,'lp'),()=>{if(W.q){euDuellErgaenzen(wb,'q',W.q);const s=euSieger(W.q);if(s!=null&&!W.t.includes(s))W.t.push(s);}euLigaphaseLosen(wb);});
    if(d>=p.losPo&&W.lp&&W.lp.length&&!W.ko.po&&euLigaFertig(wb))mitStrom(strom('eulos',S.season,wb,'po'),()=>euPlayoffsLosen(wb));
    if(d>=p.losAf&&W.ko.po&&!W.ko.af&&W.ko.po.every(k=>euSieger(k)!=null))mitStrom(strom('eulos',S.season,wb,'af'),()=>euAchtelfinaleLosen(wb));});}
// Fehlende Spiele eines Duells nachrechnen (alte Spielstände, übersprungene Tage): Kurzrechnung mit der Kaderstärke deutscher Vereine
function euDuellErgaenzen(wb,runde,k){const st=id=>euDe(id)?teamLevel(id):euStaerke(id),kurz=(h,a,o)=>{const K=REU.kurz,q=st(h)*K.heim/st(a),agg=o.agg||[0,0];
    let hg=poisson(clamp(K.tore*Math.pow(q,K.exp),0.2,5)),ag=poisson(clamp(K.tore*Math.pow(1/q,K.exp),0.1,5)),pen=null;if(o.ko&&hg+agg[0]===ag+agg[1])pen=shootout();return[hg,ag,pen];};
  if(!k[2]){const r=kurz(k[1],k[0],{});k[2]=[r[0],r[1]];}if(!k[3])k[3]=kurz(k[0],k[1],{ko:1,agg:[k[2][1],k[2][0]]});}
// Nach den Spielen eines Termins (ablauf.js tagesSpieleAbschliessenLauf): Ergebnisse eintragen, Runde abschließen, Meldungen
function euNachSpielen(g,mg){const e=g.e,W=S.eu[e.wb];
  [...g.list.map(r=>({i:r.euI,hg:r.hg,ag:r.ag,pen:r.pen||null})),...g.kurz].forEach(x=>{
    if(e.runde==='lp'){const m=W.lp[x.i];m[4]=x.hg;m[5]=x.ag;[[m[0],x.hg-x.ag],[m[1],x.ag-x.hg]].forEach(([id,d])=>euZahlen(id,euGeldWert(e.wb,d>0?'sieg':d===0?'remis':'-')));return;} // Sieg- und Remisprämie (U19b)
    const k=e.runde==='q'?W.q:W.ko[e.runde][x.i];if(e.runde==='fin')k[2]=[x.hg,x.ag,x.pen];else if(e.leg===0)k[2]=[x.hg,x.ag];else k[3]=[x.hg,x.ag,x.pen];});
  if(mg){const mein=mg.h===S.my,gf=mein?mg.hg:mg.ag,ga=mein?mg.ag:mg.hg,k=e.runde==='lp'?null:e.runde==='q'?W.q:W.ko[e.runde].find(x=>x[0]===S.my||x[1]===S.my),s=k?euSieger(k):null;
    const zusatz=e.runde==='lp'||(e.runde!=='fin'&&e.leg===0)?'':s===S.my?(e.runde==='fin'?` – ${euName(e.wb).toUpperCase()}-SIEGER!`:' – weiter!'):' – ausgeschieden.';
    news(`${euSpielName(e)}: ${tn(mg.h)} – ${tn(mg.a)} ${mg.hg}:${mg.ag}${mg.pen?` (i.E. ${mg.pen[0]}:${mg.pen[1]})`:''}${zusatz}`,s!=null&&e.runde!=='lp'?(s===S.my?'good':'bad'):gf>ga?'good':gf<ga?'bad':'');
    if(mein&&e.runde!=='fin')heimspielEinnahmen(mg,true);if(s===S.my&&e.runde!=='lp')S.trust+=REU.vertrauen.weiter;} // Vorstand: jedes gewonnene Duell (U19b)
  euRundeFertig(e);}
// Runde abgeschlossen: Qualifikation, nächste Runde aus dem Baum, Sieger
function euRundeFertig(e){const W=S.eu[e.wb];
  if(e.runde==='q'&&e.leg===1&&W.q){const s=euSieger(W.q);if(s!=null&&!W.t.includes(s))W.t.push(s);return;}
  if(e.runde==='lp'||e.runde==='po'||e.runde==='q')return;
  const L=W.ko[e.runde];if(!L||!L.every(k=>euSieger(k)!=null))return;
  if(e.runde==='fin'){const s=euSieger(L[0]);S.eu.titel[e.wb]=s;news(`${tn(s)} gewinnt die ${euName(e.wb)}!`,s===S.my||euDe(s)?'good':'');euZahlen(s,euGeldWert(e.wb,'titel'),`Siegprämie der ${euName(e.wb)}`);if(s===S.my)S.trust+=REU.vertrauen.titel;return;}
  const n=EU_KO[EU_KO.indexOf(e.runde)+1];if(!W.ko[n])euNaechsteRunde(e.wb,n);}

// ---------- Ansicht ----------
// Karte für dein nächstes Europapokalspiel (ansichten.js spielKarte)
function euSpielKarte(e,f,wann){const home=f[0]===S.my,oid=home?f[1]:f[0],v=avVon(oid),land=v?(nation(v.land)||{name:v.land}).name:null;
  return`<div class="vs"><span>${wann} · ${esc(euSpielName(e))} · ${e.runde==='fin'?'Finale auf neutralem Platz':home?'Heimspiel':'Auswärtsspiel'}</span><b>${esc(tn(oid))}</b><span>${v?`${esc(land)} · Teamstärke ${de(euStaerke(oid),1)}`:`${S.teams[oid].lg}. Liga · Kaderstärke ${teamLevel(oid).toFixed(1)}`} (deine: ${teamLevel(S.my).toFixed(1)})${e.runde!=='lp'&&(e.leg===1||e.runde==='fin')?' · mit Verlängerung und Elfmeterschießen':''}</span></div>`;}
// Kalendertag (ansichten.js kalTermin)
function euKalTermin(d){const x=euMeineSpiele().find(y=>y.tag===d);if(!x)return null;const home=x.h===S.my,o=home?x.a:x.h,r={kurz:`${REU.wb[x.wb].kurz} ${o>=AV0?(avVon(o).name.split(' ').pop()).slice(0,6):S.teams[o].sh}`,cls:'sp pk',titel:euSpielName(x)+`: ${home?'gegen':'bei'} ${tn(o)}`};
  if(x.hg!=null){const gf=home?x.hg:x.ag,ga=home?x.ag:x.hg;r.erg=`${x.hg}:${x.ag}${x.pen?' i.E.':''}`;r.cls+=gf>ga?' win':gf<ga?' loss':' draw';}return r;}
// Länderwertung dieser Saison (die ersten fünf und Deutschland) und wer diese Saison einen Platz mehr hat
function euWertungText(){const l=euLaenderwertung(S.eu),i=l.findIndex(x=>x.land==='GER'),zeig=l.slice(0,5).concat(i>=5?[l[i]]:[]);if(!l.length)return'';
  return`<p class="dim">Länderwertung dieser Saison: ${zeig.map(x=>`${l.indexOf(x)+1}. ${esc(euLandName(x.land))} ${de(x.w,2)}`).join(' · ')}. Die besten ${REU.wertung.plaetze} bekommen nächste Saison einen Platz mehr in der Champions League.${S.eu.plus&&S.eu.plus.length?` Diese Saison: ${S.eu.plus.map(x=>esc(euLandName(x))).join(' und ')}.`:''}</p>`;}
// Karte im Reiter Pokal: deutsche Starter, dein Wettbewerb mit Tabelle der Ligaphase, K.-o.-Runden und deinen Spielen
function europaKarte(){if(!euAktiv())return'';const mein=euMeinWb(),wb=mein||'cl',W=S.eu[wb],tb=euTabelle(wb),zeile=k=>{const s=euSieger(k),f=(a,b)=>`<b>${a}:${b}</b>`;
    return`<tr class="${k[0]===S.my||k[1]===S.my?'me':''}"><td>${esc(tn(k[0]))}</td><td>${esc(tn(k[1]))}</td><td class="num">${k.length===3?(k[2]?f(k[2][0],k[2][1])+(k[2][2]?' i.E.':''):'–'):`${k[2]?f(k[2][1],k[2][0]):'–'} · ${k[3]?f(k[3][0],k[3][1])+(k[3][2]?' i.E.':''):'–'}`}</td><td>${s!=null?esc(tn(s)):''}</td></tr>`;};
  const starter=EU_WB.map(w=>`${euName(w)}: ${S.eu[w].t.filter(euDe).concat(S.eu[w].q&&!S.eu[w].t.includes(S.eu[w].q[0])?[S.eu[w].q[0]]:[]).map(id=>esc(tn(id))).join(', ')||'–'}`).join(' · ');
  const ko=EU_KO.filter(r=>W.ko[r]).reverse().map(r=>`<h3 style="margin-top:14px">${EU_RUNDE[r]}</h3><div class="tw"><table><tbody>${W.ko[r].map(zeile).join('')}</tbody></table></div>`).join('');
  const lp=tb.length?`<h3 style="margin-top:14px">Ligaphase</h3><div class="tw"><table><thead><tr><th>#</th><th>Verein</th><th class="num">Sp</th><th class="num">Tore</th><th class="num">Pkt</th></tr></thead><tbody>${tb.map((r,i)=>`<tr class="${r.id===S.my?'me':''}${i===7||i===23?' strich':''}"><td>${i+1}</td><td>${esc(tn(r.id))}</td><td class="num">${r.sp}</td><td class="num">${r.t}:${r.g}</td><td class="num"><b>${r.p}</b></td></tr>`).join('')}</tbody></table></div><p class="dim">Platz 1 bis 8 direkt im Achtelfinale, 9 bis 24 in den K.-o.-Play-offs, ab 25 ausgeschieden.</p>`:'';
  const sp=euMeineSpiele().filter(x=>x.wb===wb).map(x=>`<li>${datumKurz(x.tag)} · ${esc(euSpielName(x))}: ${esc(tn(x.h))} – ${esc(tn(x.a))}${x.hg!=null?` <b>${x.hg}:${x.ag}</b>${x.pen?` (i.E. ${x.pen[0]}:${x.pen[1]})`:''}`:''}</li>`).join('');
  const q=W.q&&(W.q[0]===S.my||W.q[1]===S.my)?`<h3 style="margin-top:14px">${EU_RUNDE.q}</h3><div class="tw"><table><tbody>${zeile(W.q)}</tbody></table></div>`:'';
  return`<div class="card"><h2>Europapokal ${S.season}/${(S.season+1)%100}</h2><p>${mein?`Dein Verein spielt in der <b>${euName(mein)}</b>.`:'Dein Verein ist diese Saison nicht im Europapokal.'} <span class="dim">Deutsche Starter: ${starter}.</span></p>
    ${mein&&sp?`<h3>Deine Spiele</h3><ul>${sp}</ul>`:''}${mein?'':`<p class="dim">Hier: ${euName(wb)}.</p>`}${ko}${q}${lp}
    ${euWertungText()}
    ${mein?`<p>Prämien dieser Saison: <b>${fmt((S.eu.geld&&S.eu.geld[S.my])||0)}</b> <span class="dim">(Startgeld, Wertsäule, Siege, Runden, gebucht als „Europapokal“)</span></p>`:''}
    <p class="dim">Modus seit 2024/25: 36 Vereine in einer Ligaphase (Conference League 6, sonst 8 Spiele), danach Hin- und Rückspiel bis zum Halbfinale und ein Finale. Prämien nach den echten Beträgen 2025/26, im Spielgeld mal ${de(REU.geld.faktor,1)} (K37 §5.3).</p></div>`;}
