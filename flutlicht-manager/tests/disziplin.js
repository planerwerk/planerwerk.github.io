// Disziplin und Sportgericht (K09 §10): Kartenhäufigkeit, Hitzköpfe, Tätlichkeiten, Gelbsperren im Pokal, Urteil spätestens nach 10 Tagen,
// Einspruch, Sperren getrennt nach Liga und Pokal, Saisonwechsel. Aufruf: node tests/disziplin.js [Saisons=2] [Seed=4]. Nur Node.js.
const {saisons}=require('./sim');
const N=+(process.argv[2]||2),SEED=+(process.argv[3]||4),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const f2=x=>x.toFixed(2),pc=x=>(x*100).toFixed(0)+' %';
const L={},hk={k:0,min:0},and={k:0,min:0},pokalGelb={},urteile=[];let welt=null;
const res=saisons({n:N,seed:SEED,verein:6,beiSaisonstart:(S,F)=>{if(welt)return;welt=F;
    const orig=F.sgUrteil;F.sgUrteil=function(v,n,a,d){urteile.push({art:v.art,vor:v.vor,antrag:v.antrag,tag:v.tag,am:d,einspruch:!!v.einspruch,ausgang:a});return orig(v,n,a,d);};},
  beiSpielen:(liste,S)=>{const hat=(p,k)=>p&&p.eig&&p.eig.includes(k);
    liste.forEach(r=>{const k=r.cup?'pokal':r.lg?'l'+r.lg:null;if(!k)return;const x=L[k]=L[k]||{spiele:0,gelb:0,rot:0,gr:0,taet:0};x.spiele++;
      r.ev.forEach(e=>{if(e.p==null)return;if(e.t==='Y')x.gelb++;if(e.t==='R'){if(e.gy)x.gr++;else x.rot++;if(e.art==='taetlichkeit'||e.art==='schwer')x.taet++;}
        if(r.cup&&e.t==='Y')pokalGelb[S.season+'/'+e.p]=(pokalGelb[S.season+'/'+e.p]||0)+1;});
      if(r.cup)return;const karten={};r.ev.forEach(e=>{if(e.p!=null&&(e.t==='Y'||e.t==='R'))karten[e.p]=(karten[e.p]||0)+1;});
      r.xpo.forEach(l=>l.forEach(([id,,,min])=>{const p=S.pl.find(q=>q.id===id),z=hat(p,'hitzkopf')?hk:and;z.min+=min;z.k+=karten[id]||0;}));});}});
const {W,F}=res,S=W.S,ev=W.ev;
// 1. Kartenhäufigkeit in den Ligen (K09 §10, echte Anker 2024/25: 0,10 Rot und 0,09 Gelb-Rot pro Spiel)
const sum=['l1','l2','l3'].reduce((a,k)=>{const x=L[k]||{};['spiele','gelb','rot','gr','taet'].forEach(q=>a[q]=(a[q]||0)+(x[q]||0));return a;},{});
pruef(sum.gelb/sum.spiele/2>=1.5&&sum.gelb/sum.spiele/2<=2.2,'Gelbe Karten pro Team und Spiel 1,5–2,2',f2(sum.gelb/sum.spiele/2));
pruef(sum.rot/sum.spiele>=0.07&&sum.rot/sum.spiele<=0.13,'Rote Karten (direkt) pro Spiel 0,07–0,13',f2(sum.rot/sum.spiele));
pruef(sum.gr/sum.spiele>=0.06&&sum.gr/sum.spiele<=0.12,'Gelb-Rote Karten pro Spiel 0,06–0,12',f2(sum.gr/sum.spiele));
const taetJe=sum.taet/(3*N);pruef(taetJe<=3,'Tätlichkeiten je Liga und Saison 0–3',f2(taetJe));
// 2. Hitzköpfe sehen 1,3- bis 1,7-mal so viele Karten (pro Minute)
const q=(hk.k/hk.min)/(and.k/and.min);pruef(q>=1.3&&q<=1.7,'Hitzköpfe sehen 1,3- bis 1,7-mal so viele Karten',`${f2(q)} (${hk.k} Karten in ${Math.round(hk.min/90)} Spielen)`);
// 3. Gelbsperren im Pokal praktisch nie (Schwelle 5 Gelbe in einer Pokalsaison)
const ps=Object.values(pokalGelb).filter(n=>n>=5).length;pruef(ps<=1,'Gelbsperren im Pokal praktisch nie',`${ps} in ${N} Pokalsaison(s)`);
// 4. Verfahren: Urteil spätestens 10 Tage nach dem Spiel, Einsprüche kommen vor
const spaet=urteile.filter(u=>u.am-u.tag>10).length,ein=urteile.filter(u=>u.einspruch).length;
pruef(urteile.length>0&&spaet===0,'Urteil spätestens 10 Tage nach dem Spiel',`${urteile.length} Urteile, ${spaet} zu spät, längstes nach ${Math.max(...urteile.map(u=>u.am-u.tag))} Tagen`);
pruef(ein>0&&ein<urteile.length,'Computer-Vereine legen manchmal Einspruch ein',`${ein} von ${urteile.length}`);
// 5. Einspruch: gemindert in 25–35 % der Fälle (Spielwert), mit der Mischung der Verfahren aus den Saisons (nur Anträge ab 2 Spielen)
{let g=0,n=0;const sp=ev('sgEntscheiden'),vorher=S.sgArchiv;F.sgUrteil=function(v,k,a){if(a==='gemindert')g++;n++;};
  urteile.filter(u=>u.antrag>=2).forEach(u=>{for(let i=0;i<200;i++)sp({pid:-1,wb:'liga',art:u.art,vor:u.vor,antrag:u.antrag,tag:0,gesessen:0},0);});
  S.sgArchiv=vorher;pruef(n>0&&g/n>=0.25&&g/n<=0.35,'Einspruch: gemindert in 25–35 % der Fälle',`${pc(g/n)} von ${n} Würfen`);}
// 6. Wiederholungstäter: eine Rote Karte in den letzten zwölf Monaten gibt im Schnitt ein Spiel mehr
{const a=ev('antragFuer'),m=vor=>{let s=0;for(let i=0;i<2000;i++)s+=a({art:'grob',vor});return s/2000;};const d=m(1)-m(0);
  pruef(d>=0.8&&d<=1.2,'Wiederholungstäter: im Schnitt etwa ein Spiel mehr',f2(d));}
// 7. Sperren je Wettbewerb und Saisonwechsel (K09 §3.2)
{const p=S.pl.find(x=>x.team===S.my&&x.inj<=0),sp=ev('sperren')(p);sp.liga.rot=1;sp.liga.gelb=0;sp.pokal.rot=0;sp.pokal.gelb=0;
  const inLiga=ev('mitWettbewerb')('liga',()=>ev('avail')(p)),inPokal=ev('mitWettbewerb')('pokal',()=>ev('avail')(p));
  pruef(!inLiga&&inPokal,'Liga-Sperre gilt nicht im Pokal',`Liga ${inLiga?'spielberechtigt':'gesperrt'}, Pokal ${inPokal?'spielberechtigt':'gesperrt'}`);
  sp.liga.rot=0;sp.liga.gelb=1;sp.pokal.rot=1;sp.pokal.gelb=1;ev('gelbe')(p).liga=7;ev('disziplinSaison')(p);
  pruef(sp.pokal.rot===1&&sp.pokal.gelb===0&&sp.liga.gelb===0&&p.kt.liga===0,'Saisonwechsel: Gelbe und Gelbsperren verfallen, Rot im Pokal läuft weiter',JSON.stringify(sp));
  sp.pokal.rot=0;}
console.log(`\n${N} Saison(s), ${sum.spiele} Ligaspiele, in ${((Date.now()-t0)/1000).toFixed(1)} s`);
// K09c. Vereinsstrafe (K09 §5.2, K14 §6): nach einem Urteil gegen deinen Spieler eine Karte im Büro. Verhängen bringt Geld, drückt seine Stimmung und hebt die
//       Glaubwürdigkeit, verzichten umgekehrt. Unter der Automatik des Sportgerichts gibt es sie nicht. Eigene Welt, weil F.sgUrteil oben ersetzt ist.
{const {neueWelt}=require('./sim'),lauf=(ja,auto)=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=6;S.mgr='Test';F.setTarget();
    if(auto){F.lizenzStart(true);S.lizenz.auto.sportgericht=1;}const p=ev('squad')(S.my)[0];ev('stimmung')(p);p.st=50;const t=ev('myT()');t.glaub=50;
    F.sgUrteil({pid:p.id,team:S.my,wb:'liga',art:'grob',tag:S.tag,antrag:2,gesessen:0,vor:0},2,'angenommen',S.tag);const karte=F.vereinsstrafeKarte();
    if(!karte)return{karte:false};const b=S.vstrafe[0].betrag,f0=S.fin['Vereinsstrafen']||0;F.vereinsstrafe(p.id,ja);
    return{karte:true,geld:(S.fin['Vereinsstrafen']||0)-f0,b,st:p.st,glaub:ev('glaub')(t),weg:!S.vstrafe.length,soll:2*(ev('RD').vereinsstrafe.jeSpiel[t.lg]||ev('RD').vereinsstrafe.jeSpiel[3])};};
  const ja=lauf(1,false),nein=lauf(0,false),au=lauf(1,true);
  pruef(ja.karte&&ja.geld===ja.b&&ja.b===ja.soll&&ja.st<50&&ja.glaub>50&&ja.weg&&nein.karte&&nein.geld===0&&nein.st>50&&nein.glaub<50&&!au.karte,
    'Vereinsstrafe: Karte nach dem Urteil, verhängen (Geld, Stimmung runter, Glaubwürdigkeit rauf), verzichten (umgekehrt), keine unter der Automatik',
    `verhängt ${ja.geld} € (soll ${ja.soll}), Stimmung ${ja.st}, Glaubwürdigkeit ${ja.glaub}; verzichtet Stimmung ${nein.st}, Glaubwürdigkeit ${nein.glaub}; Automatik ${au.karte}`);}

// EA1 bis EA3. Vereinsstrafe: zwei Urteile ergeben zwei Karten; am letzten Tag hält das Spiel an („Frist“); für eine Rote Karte bei einem anderen Verein keine Karte
{const {neueWelt}=require('./sim'),{W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=6;S.mgr='Test';F.setTarget();S.phase='play';
  const [p,q,r]=ev('squad')(S.my),urteil=(x,team)=>F.sgUrteil({pid:x.id,team,wb:'liga',art:'grob',tag:S.tag,antrag:1,gesessen:0,vor:0},1,'angenommen',S.tag);
  urteil(p,S.my);urteil(q,S.my);urteil(r,S.my+1);const offen=ev('vereinsstrafeOffen')(),zwei=offen.length===2&&!offen.some(v=>v.pid===r.id);
  const bis=offen[0].bis,frist=ev('vereinsstrafeFrist')(bis)&&!ev('vereinsstrafeFrist')(bis-1),karten=(F.vereinsstrafeKarte().match(/<h3>Vereinsstrafe<\/h3>/g)||[]).length===2;
  pruef(zwei&&karten&&frist,'Vereinsstrafe: mehrere Karten, Halt am letzten Tag, keine für eine Rote Karte bei einem anderen Verein',`offen ${offen.length}, Karten ${karten}, Halt ${frist}`);}

// K09g. Trainer-Karten und Tribüne (K09 §5.4): Jede vierte Gelbe sperrt ein Spiel. Die Sperre gilt ab dem nächsten Pflichtspiel (nicht in dem, in dem sie entstand) und läuft
//       dort ab, Testspiele zählen nicht. Die Gelben verfallen zum Saisonende, die Sperre nicht. Innenraumverbot nach wiederholter Schiedsrichterkritik (1, dann 2 Spiele).
//       Protest nur nach einem Anlass; die zweite Gelbe im selben Spiel ist Gelb-Rot mit Tribüne und Sperre. Auf der Tribüne spricht in der Halbzeit der Co-Trainer.
{const {neueWelt}=require('./sim'),{W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=6;S.mgr='Test';F.setTarget();S.phase='play';S.lineup=F.bestXI(6,ev('myT()').form);
  const T=ev('RD').trainer,abs=ev('absTag'),d=S.tag,geg=S.teams.find(t=>t.id!==6&&t.lg===S.teams[6].lg).id,spiel=o=>Object.assign({h:6,a:geg,ev:[]},o||{});
  for(let i=1;i<T.sperreJe;i++)F.trainerGelb();const vorher=S.trainerK.sp===0;F.trainerGelb();const nachVier=S.trainerK.sp===T.sperreSpiele&&S.trainerK.g===T.sperreJe;
  F.trainerNachSpiel(spiel(),d);const nichtGleich=S.trainerK.sp===T.sperreSpiele; /* im Spiel entstanden: noch nicht abgesessen */
  F.trainerVorSpiel(d);const trib=ev('trainerTribuene')();F.trainerNachSpiel(spiel({test:1}),d);const test=S.trainerK.sp===T.sperreSpiele;
  F.trainerNachSpiel(spiel(),d);const ab=S.trainerK.sp===0&&S.trainerK.heute===null&&!ev('trainerTribuene')();
  F.trainerSperre(1,'Test');S.season++;const saison=ev('trainerKS')().g===0&&S.trainerK.sp===1;S.season--;S.trainerK.s=S.season;S.trainerK.sp=0;
  S.kontrolle={f:[{tid:6,urteil:abs(d),uk:0,txt:'',kopf:''}],alt:[abs(d)-10]};F.kontrolleTag(d);const iv1=S.trainerK.sp===1;S.trainerK.sp=0;
  S.kontrolle={f:[{tid:6,urteil:abs(d),uk:0,txt:'',kopf:''}],alt:[abs(d)-20,abs(d)-10]};F.kontrolleTag(d);const iv2=S.trainerK.sp===Math.min(T.innenraum.max,2);S.trainerK.sp=0;
  const pa=ev('protestAnlass'),anlass=pa({t:'G',art:'elfmeter',s:1},0)&&pa({t:'C',art:'elfmeter',s:1},0)&&pa({t:'R',s:0},0)&&!pa({t:'G',art:'elfmeter',s:0},0)&&!pa({t:'R',s:1},0)&&!pa({t:'G',art:'spiel',s:1},0);
  W.ev('liveRender=function(){};liveSichern=function(){};');const G=F.spielAnlegen(6,geg,{}),L={G,s:0,ende:false,anlass:null,protestiert:false,meldung:''};ev('(function(x){LIVE=x;})')(L);
  S.live={tag:S.tag,eing:[],m:0,k:0};const g0=S.trainerK.g;F.liveProtest();const ohneAnlass=!S.live.prot;
  let n=0;while(!S.live.trib&&n<60){L.anlass=G.m;L.protestiert=false;F.liveProtest();n++;}
  const gelbRot=S.live.trib===1&&S.live.tg===2&&S.trainerK.g===g0+1&&S.trainerK.sp===T.gelbRotSpiele&&ev('liveTribuene')()&&!ev('protestOffen')(Object.assign(L,{anlass:G.m,protestiert:false}))&&S.live.eing.some(e=>e.a==='zuruf');
  while(G.m<45)G.minute();F.liveAnsprache('loben');const co=!!L.ansprache&&L.anspPasst===null&&S.live.eing.some(e=>e.a==='ansprache')&&String(L.meldung).includes('Co-Trainer');
  pruef(vorher&&nachVier&&nichtGleich&&trib&&test&&ab&&saison&&iv1&&iv2&&anlass&&ohneAnlass&&gelbRot&&co,'Trainer-Karten: Sperre nach der vierten Gelben ab dem nächsten Pflichtspiel, Innenraumverbot, Protest mit Gelb-Rot und Tribüne, Ansprache des Co-Trainers',
    `vier Gelbe ${vorher}/${nachVier}, nicht im selben Spiel ${nichtGleich}, Tribüne ${trib}, Testspiel ${test}, abgesessen ${ab}, Saisonwechsel ${saison}, Innenraum ${iv1}/${iv2}, Anlässe ${anlass}, `+
    `ohne Anlass ${ohneAnlass}, Gelb-Rot nach ${n} Protesten ${gelbRot}, Co-Trainer ${co} (${L.ansprache})`);}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
