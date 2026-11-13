// Stimmung, Kabine und Gespräche (K14 §10, K15 §10): Verteilung, Trägheit, Bankplatz, Leistung, Zusammenhalt, keine Dauerkrise,
// Gespräche lösen Gesprächswünsche, gebrochene Versprechen kosten Glaubwürdigkeit, Dauerlob nutzt sich ab, Charakter zählt, Gesprächszeit begrenzt.
// Bankzeit nach Grund (K14 §12, U8d): Rotation, Joker, Konkurrent, Unerfahrene, Torwart, Aufbau, Formkrise, Tribüne, Auswechslung, Erfolg, Chance genutzt, Rolle „Pokal“.
// Aufruf: node tests/kabine.js [Seed=5]. Nur Node.js.
const {neueWelt,saisons}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %',f1=x=>x.toFixed(1),f2=x=>x.toFixed(2),m=l=>l.length?l.reduce((a,b)=>a+b,0)/l.length:0;
const welt=(verein=6)=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=verein;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(verein,W.ev('myT()').form);return{W,F,S,ev:W.ev};};
const tage=(F,S,n)=>{for(let i=0;i<n;i++){F.tagEnde(S.tag);S.tag++;S.gespielt=-1;F.tagBeginn(S.tag);}};

// 1. Eine Saison im Ablauf: Verteilung, Trägheit, keine Dauerkrise, Leistung über den Zustandsfaktor, Wertebereiche
{const deltas=[],sf=new Map(),mitte=[];let fehler=null;
  try{saisons({n:1,seed:SEED,verein:6,
    beiSaisonstart:(S,F)=>{if(F.__w)return;F.__w=1;const o=F.kabineWoche;F.kabineWoche=function(d){const v=new Map(S.pl.filter(p=>p.team>=0&&p.st!=null).map(p=>[p.id,p.st]));o(d);
      S.pl.forEach(p=>{if(v.has(p.id)&&p.team>=0)deltas.push(Math.abs(p.st-v.get(p.id)));});if(S.res[1].length>=150&&!mitte.length)S.pl.forEach(p=>{if(p.team>=0)mitte.push(p.st);});};},
    beiSpielen:(list,S)=>list.forEach(r=>[0,1].forEach(s=>{const tid=s?r.a:r.h;if(tid>=1000||r.test)return;const xi=(r.xi[s]||[]).map(id=>S.pl.find(p=>p.id===id)).filter(Boolean);if(!xi.length)return;
      const f=xi.reduce((a,p)=>a+(p.st==null?1:p.st<20?1-0.03*(20-p.st)/20:p.st>85?1+0.02*(p.st-85)/15:1),0)/xi.length;if(!sf.has(tid))sf.set(tid,[]);sf.get(tid).push(f);})),
    beiSaisonende:(S)=>{const st=S.pl.filter(p=>p.team>=0&&S.teams[p.team]&&p.st!=null).map(p=>p.st),im=st.filter(x=>x>=45&&x<=80).length/st.length,im2=mitte.filter(x=>x>=45&&x<=80).length/Math.max(1,mitte.length);
      pruef(im>=0.7&&im2>=0.7,'Verteilung: mindestens 70 % der Spieler zwischen 45 und 80 Stimmung (Saisonmitte und Saisonende)',`${pc(im2)} und ${pc(im)}, Schnitt ${f1(m(st))}`);
      const aktive=S.teams.filter(t=>t.lg<=3&&t.id!==S.my),ww3=m(aktive.map(t=>(t.kst&&t.kst.ww3)||0)); // ohne deinen Verein: Im Test führt niemand Gespräche
      pruef(ww3<=1,'Keine Dauerkrise: im Schnitt höchstens ein offizieller Wechselwunsch je Kader und Saison (Computer-Vereine)',`${f2(ww3)} (höchstens ${Math.max(...aktive.map(t=>(t.kst&&t.kst.ww3)||0))} in einem Verein)`);
      const zh=aktive.map(t=>t.zh);pruef(zh.every(x=>x>=0&&x<=100),'Zusammenhalt im Bereich 0–100',`${f1(Math.min(...zh))} bis ${f1(Math.max(...zh))}, Schnitt ${f1(m(zh))}`);
      const bad=S.pl.filter(p=>p.st!=null&&(p.st<0||p.st>100||!(p.ww>=0&&p.ww<=4)));pruef(!bad.length,'Stimmung 0–100 und Wechselwunsch 0–4 bei allen Spielern',bad.length?bad[0].n:'');
      const fr=S.bz.filter(b=>b[2]==='F').length,ri=S.bz.filter(b=>b[2]==='R').length;console.log(`  Beziehungen am Saisonende: ${fr} Freundschaften, ${ri} Rivalitäten`);}});}
  catch(e){fehler=e;}
  pruef(!fehler,'Saison mit Stimmung und Kabine läuft ohne Fehler',fehler?fehler.stack.split('\n').slice(0,3).join(' | '):'');
  const ueber=deltas.filter(x=>x>8.0001).length/Math.max(1,deltas.length),p99=deltas.slice().sort((a,b)=>a-b)[Math.floor(deltas.length*0.99)]||0;
  pruef(ueber<=0.005,'Trägheit: ohne große Ereignisse höchstens ±8 in einer Woche (weniger als 0,5 % darüber)',`99 % bis ${f1(p99)}, über 8: ${(ueber*100).toFixed(2)} %`);
  const ab=[...sf.values()].map(l=>m(l)),wmin=Math.min(...ab),wmax=Math.max(...ab);
  pruef(wmin>=0.99&&wmax<=1.01,'Leistung: Stimmung verschiebt die Stärke der Startelf im Saisonschnitt höchstens um ±1 % (Näherung für ±3 Punkte)',`${f2((wmin-1)*100)} % bis +${f2((wmax-1)*100)} %`);}

// 2. Bankplatz (K14 §10): ehrgeizig, sieht sich als Stammspieler, spielt zwölf Wochen keine Minute → Gesprächswunsch in 60–80 % der Fälle
{const {S,F,ev}=welt();tage(F,S,ev('auftaktTag(myT())')+40-S.tag);const kand=S.pl.filter(p=>p.team>=0&&S.teams[p.team].lg<=3&&(p.krA==='stamm'||p.krA==='schluessel')&&p.inj<=0).slice(0,400);
  kand.forEach(p=>{p.ch.ehr=16;p.max=0;});let d=S.tag;
  for(let w=0;w<12;w++){d+=7;S.tag=d;kand.forEach(p=>{p.ea=0;});F.kabineWoche(d);kand.forEach(p=>{p.max=Math.max(p.max,p.ww);});}
  const q=kand.filter(p=>p.max>=2).length/kand.length,q8=kand.filter(p=>p.max>=1).length/kand.length;
  pruef(q>=0.6&&q<=0.8,'Bankplatz: ehrgeiziger Stammspieler ohne Einsatz erreicht in zwölf Wochen den Gesprächswunsch in 60–80 % der Fälle',`${pc(q)} von ${kand.length} (Grummeln: ${pc(q8)})`);}

// 3. Zusammenhalt (K14 §10): sechs neue Stammspieler → etwa −2 %, Erholung in 8–12 Wochen (stabile Elf, 40 % Siege)
{const {S,F,ev}=welt();const t=ev('myT()');t.zh=50;for(let i=0;i<6;i++)F.zusammenhaltAendern(t,ev('RKA').zusammenhalt.neuer);const f0=ev('kabineFaktor')(S.my).f;
  const xi=F.myXI().filter(x=>x!=null);let w=0;while(t.zh<45&&w<30){w++;t.xiV=xi.slice();t.xiW=xi.slice();t.siegeW=(w%5===1||w%5===3)?1:0;S.tag+=7;F.kabineWoche(S.tag);}
  pruef(f0<=0.985&&f0>=0.975,'Zusammenhalt: sechs neue Stammspieler kosten etwa 2 % Teamstärke',`${f2((f0-1)*100)} % (Zusammenhalt ${50+6*ev('RKA').zusammenhalt.neuer})`);
  pruef(w>=8&&w<=12,'Zusammenhalt erholt sich mit stabiler Elf in 8–12 Wochen (bis 45)',`${w} Wochen`);}

// 4. Gespräche lösen Gesprächswünsche (K15 §10): sinnvolles Gespräch mit passender Zusage löst 40–60 %
{let gel=0,n=0;for(let k=0;k<6;k++){const {S,F,ev}=welt(4+k);const sq=ev('squad')(S.my).filter(p=>p.inj<=0);
  sq.forEach(p=>{if(n>=150)return;p.ww=2;p.st=33;p.ea=0.15;S.gw=[{pid:p.id,tag:S.tag,s:S.season}];S.gz=[];S.vs=[];const r=F.gespraechFuehren(p.id,'einsatz','s');if(r.ok){n++;if(r.geloest)gel++;}});}
  pruef(n>50&&gel/n>=0.4&&gel/n<=0.6,'Gespräch mit Einsatz-Zusage löst 40–60 % der Gesprächswünsche',`${pc(gel/n)} von ${n}`);}

// 5. Versprechen brechen kostet (K15 §10): nach zwei gebrochenen Versprechen Glaubwürdigkeit unter 45. Gehalten bringt Stimmung und Glaubwürdigkeit.
{const {S,F,ev}=welt();const t=ev('myT()'),sq=ev('squad')(S.my);t.glaub=60;
  [sq[15],sq[16]].forEach(p=>{p.ea=0.1;p.st=40;S.gz=[];const r=F.gespraechFuehren(p.id,'wechsel','s');if(r.versprechen)F.versprechenAngebot(p.id,r.versprechen.preis+1);});
  pruef(t.glaub<45,'Zwei gebrochene Versprechen: Glaubwürdigkeit unter 45',`${f1(t.glaub)}`);
  const p=sq[17];p.ea=0.1;S.gz=[];const g0=t.glaub,r=F.gespraechFuehren(p.id,'einsatz','s'),st0=p.st;const v=r.versprechen;
  if(v){const m0={h:S.my,a:sq.length?1:0,xpo:[[[p.id,0,1,90]],[]],xi:[[p.id],[]],hg:1,ag:0};for(let i=0;i<v.n;i++)F.versprechenNachSpiel([m0]);}
  pruef(v&&v.stand==='gehalten'&&t.glaub>g0&&p.st>st0,'Einsatz-Versprechen gehalten: Stimmung und Glaubwürdigkeit steigen',v?`${v.stand}, Glaubwürdigkeit ${f1(g0)} → ${f1(t.glaub)}, Stimmung ${f1(st0)} → ${f1(p.st)}`:'keine Zusage');}

// 6. Dauerlob lohnt nicht (K15 §10): wöchentliches Lob an denselben Spieler bringt nach vier Wochen fast nichts mehr (höchstens ein Viertel)
{const {S,F,ev}=welt();const p=ev('squad')(S.my).find(q=>!ev('hatEig')(q,'diva'));p.lastG=2;const w=[];for(let i=0;i<4;i++){S.gz=[];const r=F.gespraechFuehren(p.id,'lob','s');w.push(r.w);S.tag+=7;}
  pruef(w[0]>0&&w[3]<=w[0]*0.25,'Dauerlob: in der vierten Woche höchstens ein Viertel der Wirkung',w.map(f2).join(' → '));}

// 7. Charakter zählt (K15 §10): dieselbe Kritik wirkt bei Kämpfern im Schnitt positiv, bei Diven deutlich negativ
{const {S,F,ev}=welt();const sq=ev('squad')(S.my),erg={kaempfer:[],diva:[]};
  for(const art of ['kaempfer','diva'])sq.slice(0,10).forEach(p=>{const alt=p.eig;p.eig=[art];p.lastG=4.5;p.gs=[];delete p.streit;S.gz=[];const r=ev('gespraechWirkung')(p,'kritik','s');erg[art].push(r.w);p.eig=alt;});
  pruef(m(erg.kaempfer)>0&&m(erg.diva)<-4,'Kritik: Kämpfer im Schnitt positiv, Diven deutlich negativ',`Kämpfer ${f2(m(erg.kaempfer))}, Diven ${f2(m(erg.diva))}`);}

// 8. Zeit begrenzt (K15 §10): höchstens drei Einzelgespräche pro Woche, eine Mannschaftsansprache
{const {S,F,ev}=welt();const sq=ev('squad')(S.my);S.gz=[];const r=[0,1,2,3].map(i=>F.gespraechFuehren(sq[i].id,'lob','s').ok);
  const a1=F.mannschaftsAnsprache('ziel').ok,a2=F.mannschaftsAnsprache('rueckendeckung').ok;
  pruef(r.filter(Boolean).length===3&&!r[3]&&a1&&!a2,'Höchstens drei Einzelgespräche und eine Mannschaftsansprache pro Woche',`${r.filter(Boolean).length} Gespräche, Ansprachen ${a1?'ja':'nein'}/${a2?'ja':'nein'}`);}

// 9. Ohne Anlass keine Wirkung (gegen Ausnutzung): Einsatz versprechen an einen Stammspieler, der ohnehin spielt, bringt nichts und keine Zusage
{const {S,F,ev}=welt();const p=ev('squad')(S.my).find(q=>q.krA==='schluessel');p.ea=0.9;p.ww=0;S.gz=[];const g0=ev('myT()').glaub,r=F.gespraechFuehren(p.id,'einsatz','s');
  pruef(r.ok&&!r.versprechen&&r.w===0,'Einsatz versprechen an einen Spieler, der ohnehin spielt: keine Wirkung, keine Zusage',r.text);}

// ---------- Bankzeit nach Grund (K14 §12, U8d) ----------
// Ein Pflichtspiel aus Sicht eines Vereins bauen: Startelf, Einwechslungen [wer, Minute, für wen], Bank, Noten, Tore, Fehlende. Der Gegner ist ein Amateurklub (wird nicht gebucht).
const spiel=(tid,xi,o={})=>{const ein=o.ein||[],min=new Map(xi.map(id=>[id,90]));ein.forEach(([id,mi,aus])=>{min.set(aus,mi);min.set(id,90-mi);});
  return{h:tid,a:1000,hg:o.hg==null?1:o.hg,ag:o.ag==null?1:o.ag,lg:o.lg,cup:o.cup,xi:[xi,[]],xpo:[[...min].map(([id,mi])=>[id,'ZM',0,Math.max(1,mi)]),[]],bk:[[...ein.map(e=>e[0]),...(o.bank||[])],[]],
    ws:ein.map(([id,mi,aus])=>[0,mi,aus,id]),ev:(o.tore||[]).map(q=>({t:'G',p:q})),inj:(o.verletzt||[]).map(id=>({id})),off:[],nt:o.noten||{},na:[(o.fehlt||[]).map(x=>Array.isArray(x)?x:[x,0]),[]]};};
// Welt für die Fälle: keine englische Woche, kein Spieler mit störenden Eigenschaften, alle fit. typ(p,…) setzt die Eigenschaften eines Spielers fest.
const bankWelt=()=>{const w=welt(),{S,F,ev}=w;F.englischeWoche=()=>false;const sq=ev('squad')(S.my),t=ev('myT()');sq.forEach(q=>{q.eig=[];q.fit=100;q.inj=0;q.ww=0;q.ch.ehr=10;});delete t.erw;
  F.rollenBerechnen(S.my);sq.forEach(q=>{q.ea=ev('erwartungEinsatz')(q);});const xi=ev('elfOhneAusfaelle')(t,sq),rest=sq.filter(q=>!xi.includes(q.id));
  return Object.assign(w,{sq,t,xi,rest,B:ev('RKA').bank,typ:(q,...e)=>{q.eig=e;return q;},buch:(x,o)=>F.einsatzBuchen([spiel(S.my,x,o)],S.tag),ohne:(id,ers)=>xi.map(x=>x===id?ers:x)});};

// 10. Rotation: Ein Stammspieler, der wegen Frische auf der Bank sitzt, verliert nichts. Das dritte Spiel in Folge zählt.
{const {S,F,ev,sq,xi,rest,buch,ohne,t}=bankWelt();const p=sq.find(q=>xi.includes(q.id)&&q.pos==='MF'),ers=rest.find(q=>q.pos==='MF'&&Math.abs(q.str-p.str)>3)||rest.find(q=>q.pos==='MF');
  const st0=p.st,ea0=p.ea,z0=ev('zielStimmung')(p);p.fit=80;buch(ohne(p.id,ers.id),{bank:[p.id]});const g1=p.bg,ea1=p.ea;buch(ohne(p.id,ers.id),{bank:[p.id]});const ea2=p.ea;buch(ohne(p.id,ers.id),{bank:[p.id]});
  pruef(g1==='rotation'&&ea1===ea0&&ea2===ea0&&p.st===st0&&p.ea<ea0,'Rotation: Stammspieler mit Frische unter 85 % auf der Bank verliert nichts, erst das dritte Spiel in Folge zählt',`Einsatzzeit ${pc(ea0)} → ${pc(ea2)} → ${pc(p.ea)}, Grund „${g1}“`);
  // Mit voller Frische und ohne englische Woche zählt die Bank sofort. In einer englischen Woche nicht.
  const q=sq.find(x=>xi.includes(x.id)&&x.pos==='AB'),e2=rest.find(x=>x.pos==='AB'),eq=q.ea;buch(ohne(q.id,e2.id),{bank:[q.id]});const voll=q.ea<eq;q.ea=eq;q.bnk=0;F.englischeWoche=()=>true;buch(ohne(q.id,e2.id),{bank:[q.id]});
  pruef(voll&&q.ea===eq&&q.bg==='rotation','Rotation: Mit voller Frische zählt der Bankplatz, in einer englischen Woche nicht');F.englischeWoche=()=>false;
  // Rotation ankündigen (K15 §5.4): passt vor einer englischen Woche, gilt sieben Tage, bringt +1, unpassend irritiert sie die Stammspieler
  const r=sq.find(x=>xi.includes(x.id)&&x.pos==='ST'),e3=rest.find(x=>x.pos==='ST'),er=r.ea;F.englischeWocheVoraus=()=>true;const an=F.mannschaftsAnsprache('rotation'),sr=r.st;buch(ohne(r.id,e3.id),{bank:[r.id]});
  const ok1=an.ok&&an.passt&&r.ea===er&&r.st>sr&&r.bg==='rotation';S.tag+=8;buch(ohne(r.id,e3.id),{bank:[r.id]});const vorbei=r.ea<er;
  t.mans=[];F.englischeWocheVoraus=()=>false;const st=sq.filter(x=>xi.includes(x.id)).map(x=>x.st),an2=F.mannschaftsAnsprache('rotation'),runter=sq.filter(x=>xi.includes(x.id)).every((x,i)=>x.st<st[i]);
  pruef(ok1&&vorbei&&an2.ok&&!an2.passt&&runter&&!t.rotAn,'Rotation ankündigen: passend eine Woche lang ohne Abwertung und +1, danach zählt die Bank wieder, unpassend sind die Stammspieler irritiert',`${an.text}`);}

// 11. Joker: eingewechselt mit Tor → zufriedener, das Spiel zählt als erfüllt. Ehrgeizige fordern nach drei starken Kurzeinsätzen mehr.
{const {S,F,ev,sq,xi,rest,buch,B}=bankWelt();const p=rest.find(q=>q.pos==='ST'&&q.krA==='rotation')||rest.find(q=>q.pos==='ST'),raus=xi.map(id=>sq.find(q=>q.id===id)).find(q=>q.pos==='ST');p.ppk=50;F.rollenBerechnen(S.my);p.ea=ev('erwartungEinsatz')(p);
  const st0=p.st,ea0=p.ea;buch(xi,{ein:[[p.id,70,raus.id]],tore:[p.id]});const mitTor=p.st-st0,eaT=p.ea,gT=p.bg;buch(xi,{ein:[[p.id,70,raus.id]]});
  pruef(mitTor===B.joker.stimmung&&eaT>=ea0-1e-9&&gT==='joker'&&p.ea<eaT,'Joker mit Tor: nach dem Spiel zufriedener (+3), das Spiel zählt als erfüllt. Ohne Wirkung zählen nur die Minuten',`Stimmung +${f1(mitTor)}, Einsatzzeit ${pc(ea0)} → ${pc(eaT)} → ${pc(p.ea)}`);
  const s0=p.krS;p.ch.ehr=16;F.rollenBerechnen(S.my);const s1=p.krS;for(let i=0;i<3;i++)buch(xi,{ein:[[p.id,70,raus.id]],noten:{[p.id]:2}});
  pruef(s1===s0+1&&p.krP===1&&p.krS===Math.min(3,s1+1),'Joker: Ein Ehrgeiziger sieht sich nach drei starken Kurzeinsätzen eine Stufe höher (höchstens Stammspieler)',`Einschätzung ${s0} → ${s1} (ehrgeizig) → ${p.krS}`);}

// 12. Unerfahrene: keine Erwartung, Spieltagskader +1, zehn Minuten +3, Debüt +5. Mit dem zehnten Profispiel beginnt die Erwartung ohne Absturz.
{const {S,F,ev,sq,xi,rest,buch,B}=bankWelt();const p=rest.filter(q=>q.krA==='talent'||q.krA==='ergaenzung').sort((a,b)=>a.age-b.age)[0],raus=sq.find(q=>q.id===xi[xi.length-1]);p.ppk=0;p.ea=0;
  const e0=ev('erwartungEinsatz')(p),b0=ev('bausteine')(p).einsatz,s0=p.st;buch(xi,{});const draussen=p.st-s0;buch(xi,{bank:[p.id]});const kader=p.st-s0-draussen,s1=p.st;buch(xi,{ein:[[p.id,80,raus.id]]});const debuet=p.st-s1,s2=p.st;
  buch(xi,{ein:[[p.id,80,raus.id]]});const zehn=p.st-s2,s3=p.st;buch(xi,{ein:[[p.id,85,raus.id]]});const fuenf=p.st-s3;
  pruef(e0===0&&b0===0&&draussen===0&&kader===B.unerfahren.kader&&debuet===B.unerfahren.debuet&&zehn===B.unerfahren.einsatz&&fuenf===0,'Unerfahrene (unter 10 Profispielen): keine Erwartung, Spieltagskader +1, Debüt +5, zehn Minuten +3',`Kader +${f1(kader)}, Debüt +${f1(debuet)}, 10 Minuten +${f1(zehn)}, 5 Minuten ${f1(fuenf)}`);
  p.ppk=9;p.ea=0.02;buch(xi,{ein:[[p.id,80,raus.id]]});const e1=ev('erwartungEinsatz')(p);
  pruef(p.ppk===10&&e1>0&&p.ea>=e1&&ev('bausteine')(p).einsatz>=0,'Mit dem zehnten Profispiel beginnt die Erwartung, ohne Absturz der Einsatzzeit',`Erwartung ${pc(e1)}, Einsatzzeit ${pc(p.ea)}`);}

// 13. Torwart: Die Nummer 2 bleibt eine Saison ohne Einsatz zufrieden. Ein gleich starker Ersatztorwart sorgt für Reibereien, bis die Rangfolge klar ist.
{const {S,F,ev,sq,xi,buch,t,B}=bankWelt();const tws=sq.filter(q=>q.pos==='TW').sort((a,b)=>(xi.includes(b.id)-xi.includes(a.id))||b.str-a.str),n1=tws[0],n2=tws[1];n2.str=n1.str-6;n2.ch.ehr=17;n2.ppk=80;S.phase='play';
  F.rollenBerechnen(S.my);n2.ea=ev('erwartungEinsatz')(n2);n2.st=65;let minSt=100;for(let w=0;w<34;w++){buch(xi,{bank:[n2.id]});S.tag+=7;F.kabineWoche(S.tag);minSt=Math.min(minSt,n2.st);}
  pruef(ev('erwartungEinsatz')(n2)===0&&ev('bausteine')(n2).einsatz===0&&n2.bg==='tw2'&&n2.ww===0&&minSt>=50,'Nummer 2 im Tor: bleibt eine Saison ohne Einsatz zufrieden, auch wenn er ehrgeizig ist',`Stimmung nie unter ${f1(minSt)}, Wechselwunsch ${n2.ww}`);
  // Duell: höchstens zwei Punkte Abstand. Vergleich mit derselben Welt ohne Duell über vier Wochen.
  const lauf=duell=>{const b=bankWelt(),{S,F,ev,sq,xi,buch,t}=b,tw=sq.filter(q=>q.pos==='TW').sort((x,y)=>(xi.includes(y.id)-xi.includes(x.id))||y.str-x.str);tw[1].str=tw[0].str-(duell?1:6);tw[1].ppk=80;S.phase='play';F.rollenBerechnen(S.my);
    tw.forEach(q=>{q.st=65;q.ea=ev('erwartungEinsatz')(q);});const xi2=ev('elfOhneAusfaelle')(t,sq);delete t.twS;for(let w=0;w<4;w++){buch(xi2,{bank:[tw[1].id]});S.tag+=7;F.kabineWoche(S.tag);}
    const nach4=[tw[0].st,tw[1].st],offen=!!ev('torwartDuell')(t);buch(xi2,{bank:[tw[1].id]});return{nach4,offen,klar:!ev('torwartDuell')(t),neu:b.S.news.some(n=>/Torwart-Duell/.test(n.t||n.text||''))};};
  const mit=lauf(true),ohne=lauf(false);
  pruef(mit.offen&&mit.klar&&!ohne.offen&&mit.nach4[0]<ohne.nach4[0]-2&&mit.nach4[1]<ohne.nach4[1]-2,'Torwart-Duell: Ein gleich starker Ersatztorwart kostet beide Stimmung, bis derselbe fünf Spiele in Folge im Tor steht',`nach vier Wochen ${mit.nach4.map(f1).join(' und ')} gegen ${ohne.nach4.map(f1).join(' und ')} ohne Duell`);}

// 14. Konkurrent: Wer zehn Spiele hinter seinem Rivalen sitzt, erreicht den Gesprächswunsch. Kämpfer bleiben in den ersten drei Spielen stabil, Diven nicht.
{const lauf=(eig,wochen,ehr=13)=>{const erg=[];for(let k=0;k<6;k++){const {S,F,ev,sq,xi,rest,buch,ohne,typ}=bankWelt();S.phase='play';
    // je Position ein Paar: Der Stammspieler bekommt einen gleich starken Konkurrenten und sitzt
    ['AB','MF','ST'].forEach(g=>{const p=sq.find(q=>xi.includes(q.id)&&q.pos===g&&q.krA==='stamm'),r=rest.find(q=>q.pos===g);if(!p||!r)return;r.fp=p.fp;r.str=p.str;p.ch.ehr=ehr;typ(p,...eig);p.ppk=r.ppk=100;erg.push({p,r,S,F,ev,xi,buch,ohne});});
    const w=erg.filter(x=>x.S===S);F.rollenBerechnen(S.my);w.forEach(x=>{x.p.krA='stamm';x.p.krS=3;x.p.ea=ev('erwartungEinsatz')(x.p);x.p.st=x.st0=ev('zielStimmung')(x.p);x.max=0;});
    for(let i=0;i<wochen;i++){let el=xi.slice();w.forEach(x=>{el=el.map(id=>id===x.p.id?x.r.id:id);});buch(el,{bank:w.map(x=>x.p.id)});S.tag+=7;const vor=w.map(x=>[x.p.krA,x.p.krS]);F.kabineWoche(S.tag);w.forEach((x,j)=>{x.p.krA=vor[j][0];x.p.krS=vor[j][1];x.max=Math.max(x.max,x.p.ww);});}}
    return erg;};
  const zehn=lauf([],10),q=zehn.filter(x=>x.max>=2).length/zehn.length;
  pruef(zehn.length>=12&&q>=0.7,'Konkurrent: Wer zehn Spiele hinter seinem Rivalen sitzt, erreicht den Gesprächswunsch (mindestens 70 % der Fälle)',`${pc(q)} von ${zehn.length}, Zähler ${zehn[0].p.rz}`);
  const k=lauf(['kaempfer'],3),dv=lauf(['diva'],3),nm=lauf([],3),ds=l=>m(l.map(x=>x.p.st-x.st0));
  pruef(ds(k)>=-1&&ds(dv)<=-6&&ds(dv)<ds(nm)-2&&k.every(x=>x.p.rz===3&&x.p.bg==='rivale'),'Konkurrent: Ein Kämpfer bleibt in den ersten drei Spielen stabil, eine Diva nicht',`Kämpfer ${f1(ds(k))}, ohne Eigenschaft ${f1(ds(nm))}, Diva ${f1(ds(dv))}`);
  const kl=k[0],lern=kl.ev('lernStimmung')(kl.p),p0=nm[0];pruef(lern>=1.1&&p0.ev('lernStimmung')(p0.p)<1.1,'Konkurrent: Der Kämpfer beißt sich rein und lernt in dieser Zeit 10 % schneller',`×${f2(lern)}`);
  // Er steht wieder in der Startelf: Der Zähler beginnt neu
  const x=zehn[0];x.buch(x.xi,{});pruef(x.p.rz===0&&x.p.bnk===0,'Konkurrent: Steht er wieder in der Startelf, beginnt der Zähler neu');}

// 15. Aufbau nach Verletzung, Formkrise, Wechselwunsch, erstes Spiel nach der Sperre
{const {S,F,ev,sq,xi,rest,buch,ohne,typ,B}=bankWelt();F.platzRivale=()=>null;const st=sq.filter(q=>xi.includes(q.id)&&q.pos!=='TW'),[a,b,c,d]=st,ers=id=>rest.find(q=>q.pos===sq.find(x=>x.id===id).pos&&Math.abs(q.str-sq.find(x=>x.id===id).str)>3)||rest.find(q=>q.pos!=='TW');
  const bank=(p,o)=>{const e=ers(p.id);buch(ohne(p.id,e.id),Object.assign({bank:[p.id]},o||{}));};
  // Aufbau: Rückkehr nach einer langen Verletzung, drei Wochen ohne Erwartung
  a.vl={art:Object.keys(ev('RMD').arten)[0],q:'foul',ab:ev('absTag')(S.tag)-30,t:30,sd:[30,30],sv:[30,30],dg:0};ev('medizinRueckkehr')(a);a.fit=100;const ea=a.ea;bank(a);const g=a.bg,e1=a.ea;S.tag+=22;bank(a);
  pruef(g==='aufbau'&&e1===ea&&a.ea<ea&&!a.rue,'Aufbau nach Verletzung: drei Wochen lang zählt die Bank nicht, danach wieder',`Einsatzzeit ${pc(ea)} → ${pc(e1)} → ${pc(a.ea)}`);
  // Formkrise: die Bank zählt halb (Diven voll)
  const eb=b.ea;b.n5=[4.5,4,4.5,4,5];bank(b);const halb=eb-b.ea,gb=b.bg,ec=c.ea;bank(c);const voll=ec-c.ea;typ(d,'diva');d.n5=[4.5,4,4.5,4,5];const ed=d.ea;bank(d);
  pruef(gb==='form'&&Math.abs(halb/eb-ev('RKA').einsatzTempo*B.formkrise.faktor)<1e-6&&Math.abs(voll/ec-ev('RKA').einsatzTempo)<1e-6&&Math.abs((ed-d.ea)/ed-ev('RKA').einsatzTempo)<1e-6,'Formkrise (Notenschnitt ab 4,0): Die Bank zählt halb, bei einer Diva voll',`${pc(halb/eb)} gegen ${pc(voll/ec)} der Einsatzzeit`);
  // Offizieller Wechselwunsch: Die Bank versteht er. Erstes Spiel nach einer Sperre: kein Anspruch, Hitzköpfe trotzig.
  const w=st[4],h=st[5],ew=w.ea;w.ww=3;bank(w);const gw=w.bg,ew1=w.ea,eh=h.ea;typ(h,'hitzkopf');buch(ohne(h.id,ers(h.id).id),{fehlt:[[h.id,1]]});const flag=h.nsp,sh=h.st;bank(h);
  pruef(ew1===ew&&gw==='ww'&&flag===1&&h.ea===eh&&h.bg==='sperre'&&h.st===sh+B.sperre.hitzkopf&&!h.nsp,'Wechselwunsch und Sperre: Wer weg will, versteht die Bank. Das erste Spiel nach einer Sperre zählt nicht, Hitzköpfe sind trotzig (−1)');}

// 16. Tribüne, frühe Auswechslung, Einwechslung in der Nachspielzeit, Führungsspieler auf der Bank
{const {S,F,ev,sq,xi,rest,buch,ohne,typ,B}=bankWelt();const rot=rest.find(q=>q.krA==='rotation'&&q.pos!=='TW'),rot2=rest.find(q=>q.krA==='rotation'&&q!==rot&&q.pos!=='TW'),jung=rest.find(q=>q.krA==='talent'||q.krA==='ergaenzung');rot.ppk=rot2.ppk=100;jung.ppk=2;
  const s1=rot.st,s2=rot2.st;buch(xi,{bank:[rot2.id]});const trib=rot.st-s1,bankSt=rot2.st-s2;typ(rot,'diva');const s3=rot.st;buch(xi,{bank:[rot2.id]});
  pruef(trib===B.tribuene&&bankSt===0&&rot.bg==='tribuene'&&rot.st-s3===B.tribuene*B.diva,'Tribüne: Wer zum Kader zählt (ab Rotation) und nicht im Spieltagskader steht, verliert −2 je Spiel, eine Diva −4. Auf der Bank nichts',`${f1(trib)} und ${f1(rot.st-s3)}`);
  // Tribüne von dir gesetzt: Die Bank lässt ihn aus
  const P=ev('PIX').get(rot2.id);P.trib=1;const sd={id:S.my,xi};const b1=ev('bankWaehlen')(sd).includes(rot2.id);delete P.trib;const b2=ev('bankWaehlen')(sd).includes(rot2.id);
  pruef(!b1&&b2,'Tribüne: Ein Spieler, den du auf die Tribüne setzt, kommt nicht auf die Bank');
  const a=sq.find(q=>q.id===xi[3]),b=sq.find(q=>q.id===xi[4]),c=sq.find(q=>q.id===xi[5]),sa=a.st,sb=b.st;typ(c,'fuehrungsspieler');const sc=c.st;
  buch(xi,{ein:[[rot2.id,30,a.id],[jung.id,60,b.id]]});const fa=a.st-sa,fb=b.st-sb,ga=a.bg;buch(xi,{ein:[[rot2.id,40,c.id]]});const fc=c.st-sc;const sv=a.st;buch(xi,{ein:[[rot2.id,30,a.id]],verletzt:[a.id]});
  pruef(fa===B.frueh.stimmung&&fb===0&&ga==='frueh'&&fc===B.frueh.stimmung*B.diva&&a.st===sv,'Früh ausgewechselt (vor der 46. Minute): −3, Führungsspieler doppelt, nicht bei einer Verletzung und nicht nach der Pause',`${f1(fa)}, Führungsspieler ${f1(fc)}`);
  rot2.eig=[];const s5=rot2.st,s6=jung.st;buch(xi,{ein:[[rot2.id,89,a.id],[jung.id,89,b.id]]});
  pruef(rot2.st-s5===B.spaet.etabliert&&jung.st-s6===B.spaet.unerfahren+0&&rot2.bg==='spaet','Einwechslung in der Nachspielzeit: Etablierte −1 (Zeitspiel-Wechsel), Unerfahrene +1',`${f1(rot2.st-s5)} und +${f1(jung.st-s6)}`);
  // Führungsspieler fit auf der Bank: seine Freunde murren
  const fr=sq.find(q=>q!==c&&!xi.includes(q.id)===false&&q!==a&&q!==b);S.bz=[[c.id,fr.id,'F',1]];const sf=fr.st,ers=rest.find(q=>q.pos===c.pos&&q!==rot2)||rot;buch(ohne(c.id,ers.id),{bank:[c.id]});
  pruef(fr.st-sf===B.fuehrer.freunde,'Führungsspieler oder Kapitän fit auf der Bank: seine Freunde verlieren −1',`${f1(fr.st-sf)}`);}

// 17. Mannschaftserfolg, Chance genutzt, Rolle „spielt im Pokal“, bedeutungslose Spiele
{const {S,F,ev,sq,xi,rest,buch,ohne,typ,t,B}=bankWelt();const p=sq.find(q=>xi.includes(q.id)&&q.pos==='MF');p.ea=0.2;
  t.erw=[[3,1.4],[3,1.2],[3,1.5],[3,1.3],[3,1.6]];const sieg=ev('bausteine')(p).einsatz;t.erw=[[0,1.4],[0,1.2],[0,1.5],[0,1.3],[0,1.6]];const krise=ev('bausteine')(p).einsatz;delete t.erw;const normal=ev('bausteine')(p).einsatz;
  pruef(Math.abs(sieg-normal*B.erfolg.min)<1e-6&&Math.abs(krise-Math.max(-28,normal*B.erfolg.max))<1e-6&&normal<0,'Mannschaftserfolg: In einer Siegesserie wiegt die Bank halb, in der Krise anderthalbfach',`${f1(sieg)} · ${f1(normal)} · ${f1(krise)}`);
  // Chance genutzt: Vertreter eines verletzten Stammspielers mit Notenschnitt bis 3,0
  const weg=sq.find(q=>xi.includes(q.id)&&q.pos==='AB'),v=rest.find(q=>q.pos==='AB');v.fp=weg.fp;v.ppk=100;v.str=weg.str-5;F.rollenBerechnen(S.my);const k0=v.krS;
  for(let i=0;i<3;i++)buch(ohne(weg.id,v.id),{fehlt:[weg.id],noten:{[v.id]:2.5}});const riv=ev('rivalen')(v).some(q=>q.id===weg.id);
  pruef(v.krP===1&&v.krS===Math.min(3,k0+1)&&riv,'Chance genutzt: Nach drei guten Spielen als Vertreter sieht er sich eine Stufe höher, und beide werden Rivalen',`Einschätzung ${k0} → ${v.krS}`);
  // Rolle „spielt im Pokal“: Liga zählt nicht, jedes Pokalspiel zählt stark
  const tw=sq.filter(q=>q.pos==='TW'&&!xi.includes(q.id))[0],n1=sq.find(q=>q.pos==='TW'&&xi.includes(q.id));tw.ppk=100;S.cup.alive=[S.my,1,2];F.setKaderrolle(tw.id,'pokal');const e0=tw.ea;buch(xi,{lg:t.lg,bank:[tw.id]});const liga=tw.ea,gl=tw.bg;
  buch(ohne(n1.id,tw.id),{cup:1,bank:[n1.id]});const gespielt=tw.ea;buch(xi,{cup:1,bank:[tw.id]});const verpasst=tw.ea,b=ev('bausteine')(tw).einsatz;S.cup.alive=[1,2];F.rollenBerechnen(S.my);
  pruef(e0===0.9&&liga===e0&&gl==='pokal'&&gespielt>e0&&verpasst<0.6&&b<-5&&!tw.kr,'Rolle „spielt im Pokal“: Ligaspiele zählen nicht, ein verpasstes Pokalspiel kostet, die Rolle endet mit dem Ausscheiden',`Einsatzzeit ${pc(e0)} → ${pc(gespielt)} → ${pc(verpasst)}, Baustein ${f1(b)}`);
  // Bedeutungslose Spiele: Alle Grenzen der Tabelle sind außer Reichweite, zwei Spieltage vor Schluss
  const lg=t.lg,ids=S.teams.filter(x=>x.lg===lg).map(x=>x.id),n=S.fx[lg].length;S.res[lg]=[];S.target=9;const mitte=ids.indexOf(S.my);
  // künstliche Tabelle: jeder Verein hat n−2 Spiele, Punkte fallen in Stufen von 8, damit niemand mehr eine Grenze erreicht
  const tab=ids.map((id,i)=>({id,sp:n-2,p:(ids.length-i)*8}));const ent=ev('saisonEntschieden')(t,tab),knapp=ev('saisonEntschieden')(t,tab.map((r,i)=>Object.assign({},r,{p:(ids.length-i)*3})));
  const res=rest.find(q=>q.krA==='rotation'&&q.pos!=='TW'&&q!==v),res2=rest.find(q=>q.krA==='rotation'&&q!==res&&q.pos!=='TW'&&q!==v);res.ppk=res2.ppk=100;res.eig=[];res2.eig=[];F.saisonEntschieden=()=>true;
  const r1=res.st,r2=res2.st,raus=sq.find(q=>q.id===xi[6]);buch(xi,{lg,ein:[[res.id,60,raus.id]],bank:[res2.id]});
  pruef(ent&&!knapp&&res.st-r1===B.bedeutungslos.plus&&res2.st-r2===B.bedeutungslos.minus,'Bedeutungslose Spiele: Ist die Saison entschieden, erwarten Reservisten Chancen (+2 mit Einsatz, −2 ohne)',`${f1(res.st-r1)} und ${f1(res2.st-r2)}`);}

// 18. Eine Saison im Ablauf: Die Fälle kommen im Spiel wirklich vor, Zähler und Felder bleiben im Rahmen
{const zahl={},fehler=[];let spiele=0,pok=0;
  saisons({n:1,seed:SEED,verein:6,beiSpielen:(list,S)=>{list.forEach(r=>{if(r.test)return;spiele++;[0,1].forEach(s=>{const tid=s?r.a:r.h;if(tid>=1000)return;if(!r.bk||!r.ws||!r.na)fehler.push('Ergebnis ohne Bank, Wechsel oder Fehlende');
      S.pl.forEach(p=>{if(p.team!==tid)return;const g=p.bg||(r.xi[s].includes(p.id)?'startelf':(r.ein&&r.ein[s].includes(p.id))?'eingewechselt':'fehlt');zahl[g]=(zahl[g]||0)+1;});});});},
    beiSaisonende:S=>{const pl=S.pl.filter(p=>p.team>=0&&S.teams[p.team]);
      const bad=pl.filter(p=>!(p.ppk>=0)||(p.n5&&p.n5.length>5)||(p.jk&&p.jk.length>5)||p.rz<0||!(p.ea==null||(p.ea>=0&&p.ea<=1)));if(bad.length)fehler.push(`Felder außerhalb des Rahmens bei ${bad[0].n}`);
      const tw2=pl.filter(p=>p.pos==='TW'&&p.krA!=='stamm'&&p.krA!=='schluessel'),un=tw2.filter(p=>p.ww>=2).length/tw2.length;
      pruef(un<=0.1,'Saison: Höchstens 10 % der Ersatztorhüter sind am Saisonende beim Gesprächswunsch oder darüber',`${pc(un)} von ${tw2.length}`);
      const rz=pl.filter(p=>p.rz>3).length;console.log(`  Am Saisonende sitzen ${rz} Spieler länger als drei Spiele hinter einem Konkurrenten, ${pl.filter(p=>p.krP).length} haben einen Anspruch aus Leistung, ${S.teams.filter(x=>x.twD).length} Vereine ein Torwart-Duell.`);}});
  const alle=Object.values(zahl).reduce((a,b)=>a+b,0),an=k=>(zahl[k]||0)/alle;
  console.log('  Gründe je Spieler und Spiel: '+Object.entries(zahl).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${(v/alle*100).toFixed(1)} %`).join(', '));
  pruef(!fehler.length,'Saison: Jedes Ergebnis trägt Bank, Wechsel und Fehlende, alle Felder bleiben im Rahmen',fehler[0]||'');
  pruef(['rotation','joker','rivale','unerfahren','tw2','aufbau','bank'].every(k=>zahl[k]>0),'Saison: Rotation, Joker, Konkurrent, Unerfahrene, Nummer 2 im Tor, Aufbau und Bank kommen im Spiel vor',['rotation','joker','rivale','unerfahren','tw2','aufbau','form','tribuene','spaet','sperre','ww'].map(k=>`${k} ${zahl[k]||0}`).join(', '));}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
