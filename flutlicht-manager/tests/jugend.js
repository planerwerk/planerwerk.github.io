// Jugend und Talententwicklung (K08 §10, U9c): Jugendniveau als Langzeitwert, Jahrgang mit Deckel, Gleichstand mit den Aufrückern der Computer-Vereine,
// Ertrag der Jugend, Aufrücken, Verkauf und Geld bei Abgängen, Prägungen mit Umgang, Belastung junger Spieler, Paten, Gespräch „Druck nehmen“, eine Saison im Ablauf.
// Aufruf: node tests/jugend.js [Seed=5]. Nur Node.js.
const {neueWelt,saisons}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %',f1=x=>x.toFixed(1),f2=x=>x.toFixed(2),m=l=>l.length?l.reduce((a,b)=>a+b,0)/l.length:0;
const welt=(verein=6)=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=verein;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(verein,W.ev('myT()').form);
  const ev=W.ev,im=(k,fn)=>ev('mitStrom')(ev('strom')('test',k),fn);return{W,F,S,ev,im,t:ev('myT()'),RJ:ev('RJ')};};

// 1. Jugendniveau (deine Vorgabe vom 13.11.): Geld wirkt über viele Saisons. Von unten bis zum Deckel mindestens zehn Saisons, Abbau schneller als Aufbau, nie über dem Deckel.
{const {F,ev,t,RJ}=welt();const N=RJ.niveau;t.jn=0;t.youth=5;let wochen=0;const nach=[];while(t.jn<N.deckel&&wochen<52*40){F.jugendNiveauWoche();wochen++;if(wochen%52===0)nach.push(t.jn);}
  const saisonsBisDeckel=wochen/52;for(let i=0;i<52*5;i++)F.jugendNiveauWoche();const oben=t.jn;
  t.youth=1;for(let i=0;i<52*3;i++)F.jugendNiveauWoche();const verlust=oben-t.jn,aufbau3=nach[2];
  pruef(saisonsBisDeckel>=10&&oben<=N.deckel+1e-9&&nach[0]<=N.aufbau+1e-9,'Jugendniveau: von 0 bis zum Deckel dauert es mit der höchsten Stufe mindestens zehn Saisons, über den Deckel geht es nicht',`${f1(saisonsBisDeckel)} Saisons bis ${N.deckel}, nach einer Saison ${f1(nach[0])}`);
  pruef(verlust>aufbau3,'Jugendniveau: Wer spart, verliert schneller, als er aufgebaut hat (drei Saisons)',`−${f1(verlust)} gegen +${f1(aufbau3)}`);
  t.youth=3;t.jn=20;const z=ev('jugendZiel()');t.youth=5;const z5=ev('jugendZiel()');pruef(z===N.ziel[3]&&z5===N.deckel,'Jugendniveau: Die Stufe setzt nur das Ziel, Ziele über dem Deckel bringen bis zum Leistungszentrum nicht mehr',`Stufe 3: ${z}, Stufe 5: ${z5}`);}

// 2. Jahrgang: Das Talent hängt am Niveau, nicht an der Stufe dieses Jahres. Kein Talent über dem Deckel. Stärke mit 15 liegt 19 bis 29 unter dem Talent.
{const {F,ev,im,t,RJ}=welt();const J=RJ.jahrgang,base=ev('grundStaerke')(t.rep),ziehe=jn=>{t.jn=jn;return im('jg'+jn,()=>{const l=[];for(let i=0;i<400;i++)l.push(F.jugendNeu());return l;});};
  t.youth=1;const tief=ziehe(10);t.youth=5;const tief5=ziehe(10),hoch=ziehe(70),dPot=m(hoch.map(p=>p.pot))-m(tief.map(p=>p.pot));
  pruef(Math.abs(m(tief5.map(p=>p.pot))-m(tief.map(p=>p.pot)))<0.01,'Jahrgang: Mehr Geld in diesem Jahr ändert das Talent des Jahrgangs nicht, nur das Niveau zählt',`${f1(m(tief.map(p=>p.pot)))} bei Stufe 1 und Stufe 5`);
  pruef(dPot>=6&&dPot<=12,'Jahrgang: Hohes Jugendniveau (70) bringt 6 bis 12 Punkte mehr Talent als niedriges (10)',`+${f1(dPot)}`);
  const alle=[...tief,...hoch],ueber=alle.filter(p=>p.pot>base+J.deckel+0.5).length,ab=alle.map(p=>p.pot-p.str);
  pruef(ueber===0&&Math.min(...ab)>=J.abstand[0]-0.5&&Math.max(...ab)<=J.abstand[1]+0.5&&alle.every(p=>p.age===15&&p.team===-3&&p.id>=500000),'Jahrgang: kein Talent über dem Deckel (Grundstärke + 12), 15 Jahre alt, Stärke 19 bis 29 unter dem Talent, eigener Nummernkreis',`höchstes Talent ${Math.max(...alle.map(p=>p.pot))} bei Grundstärke ${f1(base)}`);}

// 3. Gleichstand: Die zwei Besten eines Jahrgangs sind mit 17 im Schnitt so gut wie die zwei Aufrücker eines Computer-Vereins (bei üblichem Niveau)
{const {F,ev,im,t,RJ}=welt();const N=ev('RS').nachwuchs,base=ev('grundStaerke')(t.rep),T=ev('RP').entwicklung.tageProSaison;t.jn=RJ.niveau.mitte;
  const beste=im('gleich',()=>{const s=[],po=[];for(let k=0;k<150;k++){const n=ev('riA')(RJ.jahrgang.anzahl),l=[];for(let i=0;i<n;i++){const p=F.jugendNeu();for(let q=0;q<8;q++)F.jugendWachsen(p,T/4);l.push(p);}
      l.sort((a,b)=>b.str-a.str).slice(0,2).forEach(p=>{s.push(p.str);po.push(p.pot);});}return{s:m(s),po:m(po)};});
  const kiS=base-N.abschlag+N.computerStufe,kiP=base-N.talentAbschlag+(N.talentStreuung[0]+N.talentStreuung[1])/2+N.computerStufe*N.talentJeStufe;
  pruef(Math.abs(beste.s-kiS)<=2.5&&Math.abs(beste.po-kiP)<=3,'Gleichstand: Die zwei Besten eines Jahrgangs entsprechen mit 17 den Aufrückern eines Computer-Vereins (Stärke ±2,5, Talent ±3)',`Stärke ${f1(beste.s)} gegen ${f1(kiS)}, Talent ${f1(beste.po)} gegen ${f1(kiP)}`);}

// 4. Ertrag der Jugend (K08 §10): Mit hohem Niveau und gutem Jugendtrainer kommt regelmäßig ein Spieler, der mit 21 mindestens 75 hat, mit niedrigem Niveau selten
{const w0=welt(),vid=w0.S.teams.filter(x=>x.lg===1).sort((a,b)=>Math.abs(w0.ev('grundStaerke')(a.rep)-71)-Math.abs(w0.ev('grundStaerke')(b.rep)-71))[0].id; // ein Verein aus dem Mittelfeld der 1. Liga (Grundstärke um 71)
  const ertrag=(jn,q)=>{const {S,F,ev,im,t}=welt(vid);t.jn=jn;S.stab=S.stab.filter(x=>!(x.team===S.my&&x.r==='jugend'));if(q)S.stab.push({id:99999,r:'jugend',n:'T',q,team:S.my,age:40,ct:3,sal:0,wiv:99});ev('stabGeaendert()');
    const T=ev('RP').entwicklung.tageProSaison;return im('ertrag'+jn,()=>{let treffer=0;const J=60;for(let k=0;k<J;k++){const n=ev('riA')(ev('RJ').jahrgang.anzahl);let best=0;
        for(let i=0;i<n;i++){const p=F.jugendNeu();for(let q2=0;q2<12;q2++)F.jugendWachsen(p,T/4);p.age=18;delete p.trf;p.sp=60;p.form=10;for(let y=0;y<3;y++){for(let q2=0;q2<4;q2++)ev('entwickeln')(p,T/4);p.age++;}best=Math.max(best,p.str);}
        if(best>=75)treffer++;}return{rate:treffer/J,base:ev('grundStaerke')(t.rep),name:t.name};});};
  const hoch=ertrag(70,17),tief=ertrag(10,0);
  pruef(hoch.rate>=0.5&&tief.rate<=0.2&&hoch.rate>tief.rate*2,'Ertrag: Bei einem Verein aus dem Mittelfeld der 1. Liga bringt hohes Niveau mit gutem Jugendtrainer mindestens jedes zweite Jahr einen Spieler mit 75 oder mehr (mit 21), niedriges Niveau höchstens jedes fünfte',`${hoch.name} (Grundstärke ${f1(hoch.base)}): ${pc(hoch.rate)} der Jahrgänge gegen ${pc(tief.rate)}`);}

// 5. Aufrücken, Verkauf aus der Jugend, Abgang mit 19, Beteiligung am Weiterverkauf
{const {S,F,ev,im,t,RJ}=welt();const l=ev('jugendKader()'),alt=l.filter(p=>p.age>=17).sort((a,b)=>b.str-a.str),jung=l.find(p=>p.age<17),n0=l.length,k0=ev('squad')(S.my).length;
  pruef(n0>=6&&n0<=24&&l.every(p=>p.age>=15&&p.age<=18&&p.team===-3&&ev('PIX').get(p.id)===p)&&!S.pl.some(p=>p.team===-3),'Jugendkader: 6 bis 24 Spieler von 15 bis 18 Jahren, nicht im Profikader, über die Spielerkarte erreichbar',`${n0} Spieler`);
  F.jugendAufruecken(jung.id);const zuJung=ev('squad')(S.my).length===k0;const a=alt[0];F.jugendAufruecken(a.id);
  pruef(zuJung&&a.team===S.my&&a.ct===3&&a.sal>0&&S.pl.includes(a)&&!ev('jugendKader()').includes(a)&&a.st!=null&&a.ppk===0,'Aufrücken: ab 17 Jahren mit Profivertrag über drei Jahre, ein Jüngerer bleibt in der Jugend',`${a.n}, ${a.age} Jahre, Gehalt ${a.sal}`);
  // Verkauf: ein wertvoller Jugendspieler bringt Geld und eine Beteiligung, für einen schwachen zahlt niemand
  const v=ev('jugendKader()').find(p=>p.age>=16);v.str=62;v.pot=80;const preis=ev('jugendPreis')(v),c0=t.cash;F.jugendVerkaufen(v.id);const weg=!ev('jugendKader()').includes(v)&&!ev('PIX').get(v.id);
  const s=ev('jugendKader()').find(p=>p.age>=16);s.str=30;s.pot=34;const c1=t.cash;F.jugendVerkaufen(s.id);
  pruef(preis>=RJ.verkauf.minWert&&t.cash===c0+preis&&weg&&S.jgAb.length===1&&ev('jugendKader()').includes(s)&&t.cash===c1&&ev('jugendPreis')(s)===0,'Verkauf aus der Jugend: Ein Profiverein zahlt den halben Marktwert, du bleibst am Weiterverkauf beteiligt. Für einen Schwachen zahlt niemand',`${preis} €`);
  // 1. Juli: 19-Jährige gehen (Geld nur von Profivereinen), ein neuer Jahrgang kommt
  const kader=ev('jugendKader()');kader.forEach(p=>{if(p.age===18)p.age=17;});kader[0].age=18;kader[0].str=64;kader[0].pot=76;kader[1].age=18;kader[1].str=30;kader[1].pot=42;const n18=kader.filter(p=>p.age===18).length,c2=t.cash,vor=kader.length;
  im('saison',()=>F.jugendSaison());const nach=ev('jugendKader()'),neu=nach.filter(p=>p.age===15).length;
  pruef(n18>=2&&!nach.some(p=>p.age>=19)&&neu>=RJ.jahrgang.anzahl[0]&&neu<=RJ.jahrgang.anzahl[1]&&t.cash>c2&&nach.length===vor-n18+neu,'1. Juli: Wer 19 wird und nicht aufgerückt ist, geht. Nimmt ihn ein Profiverein, gibt es Geld, bei Amateuren nichts. Ein neuer Jahrgang mit 3 bis 6 Fünfzehnjährigen kommt',`${n18} Abgänge, +${t.cash-c2} €, ${neu} Neue`);
  // Weiterverkauf: über fünf Jahre fließt bei einem Teil der Abgänge eine Beteiligung, danach ist die Liste leer
  S.jgAb=[];for(let i=0;i<200;i++)S.jgAb.push({n:'X'+i,w:1e6,s:S.season});const c3=t.cash;let wechsel=0;
  for(let y=0;y<6;y++){const n=S.jgAb.length;im('wv'+y,()=>F.jugendWeiterverkauf());wechsel+=n-S.jgAb.length;S.season++;}
  S.season-=6;const quote=(t.cash-c3)/200/1e6;pruef(S.jgAb.length===0&&quote>0.1&&quote<0.3,'Beteiligung am Weiterverkauf: fünf Jahre lang, im Schnitt 10 bis 30 % des damaligen Werts je Abgang',`${pc(quote)} des Werts`);}

// 6. Prägungen: Dein Umgang wirkt (K08 §10). „Druck nehmen“ senkt die Knacks-Quote gegenüber Kritik um mindestens die Hälfte, Lob nach gutem Spiel hebt die Schub-Quote
{const {S,F,ev}=welt();const p0=S.pl.find(p=>p.team>=0&&p.team!==S.my&&p.age<=20),zaehl=(um,gut)=>{let sch=0,kn=0;const N=3000;for(let i=0;i<N;i++){S.tag=i+1;const q=JSON.parse(JSON.stringify(p0));q.id=700000+i;
      const r=ev('praegungAufloesen')(q,{an:['debuet'],s:0.2,k:0.2,gut,um});if(r==='schub')sch++;if(r==='knacks')kn++;}return{sch:sch/N,kn:kn/N};};
  const ohne=zaehl(null,false),schutz=zaehl('schuetzen',false),kritik=zaehl('kritik',false),lob=zaehl('lob',true),ohneGut=zaehl(null,true);
  pruef(schutz.kn<=kritik.kn*0.5&&schutz.kn<ohne.kn&&kritik.kn>ohne.kn,'Umgang: „Druck nehmen“ senkt die Knacks-Quote gegenüber Kritik um mindestens die Hälfte',`Druck nehmen ${pc(schutz.kn)}, ohne ${pc(ohne.kn)}, Kritik ${pc(kritik.kn)}`);
  pruef(lob.sch>ohneGut.sch*1.15,'Umgang: Lob nach einem guten Spiel hebt die Schub-Quote',`${pc(lob.sch)} gegen ${pc(ohneGut.sch)}`);
  // Folgen: Schub hebt Tempo, Selbstvertrauen und Stimmung, manchmal das Talent. Knacks umgekehrt.
  S.tag=5;const a=JSON.parse(JSON.stringify(p0));a.st=60;a.sv=0;ev('mitStrom')(ev('strom')('f',1),()=>ev('praegungFolge')(a,'schub',['tor']));const b=JSON.parse(JSON.stringify(p0));b.st=60;b.sv=0;ev('mitStrom')(ev('strom')('f',2),()=>ev('praegungFolge')(b,'knacks',['fehler']));
  pruef(a.st===65&&a.sv===1&&ev('jugendTempo')(a)===1.3&&a.pot>=p0.pot&&b.st===55&&b.sv===-1&&ev('jugendTempo')(b)===0.5&&b.pot<=p0.pot&&a.pr.length===1&&b.pr[0][1]===-1,'Folgen: Schub bringt +5 Stimmung, Selbstvertrauen und drei Monate schnellere Entwicklung, ein Knacks das Gegenteil');}

// 7. Anlässe im Spiel und Verheizen: Debüt und entscheidendes Tor lösen eine offene Prägung aus, über der Belastungsgrenze ist die Knacks-Chance 1,5-mal so hoch
{const {S,F,ev,RJ}=welt();const sq=ev('squad')(S.my),xi=ev('myXI()').filter(x=>x!=null),p=sq.find(q=>xi.includes(q.id)&&q.pos!=='TW'),q=sq.find(x=>xi.includes(x.id)&&x!==p&&x.pos!=='TW');
  const spiel=(tore,o={})=>({h:S.my,a:1000,hg:o.hg==null?1:o.hg,ag:o.ag==null?0:o.ag,lg:null,xi:[xi,[]],xpo:[xi.map(id=>[id,'ZM',0,90]),[]],ev:tore.map((id,i)=>({t:'G',s:0,p:id,m:60+i})),off:o.off||[],sz:[],nt:{},ne:{}});
  sq.forEach(x=>{x.age=27;delete x.prO;});p.age=18;p.ppk=1;p.ea=0.5;p.ch.dru=10;F.praegungNachSpiel([spiel([q.id])],S.tag);const k1=p.prO&&p.prO.k,an1=p.prO&&p.prO.an.join();
  delete p.prO;p.ea=0.95;F.praegungNachSpiel([spiel([q.id])],S.tag);const k2=p.prO&&p.prO.k;const b=ev('belastungJung')(p);
  pruef(an1==='debuet'&&k1>0&&Math.abs(k2/k1-RJ.praegung.belastung)<1e-6&&b.wert>b.grenze&&ev('ueberBelastung')(p),'Verheizen: Über der Belastungsgrenze (85 % der Minuten bis 19 Jahre) ist die Knacks-Chance 1,5-mal so hoch',`${f2(k1)} → ${f2(k2)}, Belastung ${f2(b.wert)} bei Grenze ${b.grenze}`);
  delete p.prO;p.ppk=30;p.ea=0.5;F.praegungNachSpiel([spiel([p.id])],S.tag);const tor=p.prO&&p.prO.an.join();delete p.prO;F.praegungNachSpiel([spiel([p.id,p.id],{hg:3})],S.tag);const klar=!p.prO;
  F.praegungNachSpiel([spiel([q.id],{off:[p.id]})],S.tag);const rot=p.prO&&p.prO.an.join(),sK=p.prO.k,sS=p.prO.s;
  pruef(tor==='tor'&&klar&&rot==='fehler'&&sS===0&&sK>0,'Anlässe: Das Siegtor zum 1:0 zählt, ein Tor beim 3:0 nicht, ein Platzverweis ist ein entscheidender Fehler',`${tor}, ${rot}`);
  // Offene Prägung: drei Tage Zeit, das Gespräch „Druck nehmen“ wird gemerkt, danach löst sie sich auf
  S.gz=[];p.sv=-1;const g=F.gespraechFuehren(p.id,'schuetzen','v'),um=p.prO.um,sv=p.sv;S.tag+=RJ.praegung.umgang.tage;F.praegungTag(S.tag);
  const erw=sq.find(x=>x.age===27&&x!==q);erw.sv=0;erw.lastG=3;S.gz=[];const g2=F.gespraechFuehren(erw.id,'schuetzen','v');
  pruef(g.ok&&um==='schuetzen'&&sv>-1&&!p.prO&&g2.w===0,'Gespräch „Druck nehmen“: zählt als Umgang, baut Selbstvertrauen auf, nach drei Tagen ist die Prägung entschieden. Bei einem Erfahrenen ohne Druck bringt es nichts',g2.text);}

// 8. Paten: Ein Mentor betreut höchstens zwei Talente, ihre Entwicklung läuft 10 % schneller, auf der Bank nimmt er es hin
{const {S,F,ev,RJ}=welt();const sq=ev('squad')(S.my),m0=sq.find(p=>p.pos!=='TW'),tal=sq.filter(p=>p!==m0).slice(0,3);m0.age=32;m0.eig=['mentor'];tal.forEach(p=>{p.age=19;p.eig=[];delete p.pate;});
  tal.forEach(p=>F.setPate(p.id,m0.id));const alt=sq.find(p=>p!==m0&&!tal.includes(p));alt.age=26;F.setPate(alt.id,m0.id);
  pruef(tal[0].pate===m0.id&&tal[1].pate===m0.id&&tal[2].pate==null&&alt.pate==null&&ev('jugendTempo')(tal[0])===RJ.pate.wachstum&&ev('jugendTempo')(tal[2])===1&&ev('istPate')(m0),'Paten: Ein Mentor betreut höchstens zwei Talente bis 21 Jahre, ihre Entwicklung läuft 10 % schneller');
  F.setPate(tal[0].id,'');m0.team=-1;const ohneMentor=ev('jugendTempo')(tal[1]);m0.team=S.my;pruef(tal[0].pate==null&&ohneMentor===1,'Paten: Abwählen geht, und verlässt der Mentor den Verein, endet die Wirkung');
  // Altstar (K14 §12): Mit der Rolle Ergänzung und einem Gespräch sieht er sich so, wie du ihn einstufst
  const a=sq.find(p=>p!==m0&&p.krA==='stamm'&&p.pos!=='TW');a.age=33;a.eig=[];a.kr='ergaenzung';a.krS=3;const e0=ev('einschaetzung')(a);a.krOk='ergaenzung';const e1=ev('einschaetzung')(a);a.kr='rotation';const e2=ev('einschaetzung')(a);
  pruef(e0===3&&e1===1&&e2===3,'Altstar: Hat er die Rolle Ergänzung im Gespräch angenommen, sieht er sich so. Mit einer neuen Rolle gilt das nicht mehr',`${e0} → ${e1} → ${e2}`);}

// 9. Automatik (K36): Führt der Verein den Jugendkader, holt er am 1. Juli die zwei Besten ab 17 in den Profikader
{const {S,F,ev,im}=welt();F.lizenzStart(true);const l=ev('jugendKader()'),k0=ev('squad')(S.my).length,auto=ev("autoB('jugendkader')");im('auto',()=>F.jugendSaison());const neu=ev('squad')(S.my).filter(p=>p.id>=500000);
  pruef(auto&&neu.length===2&&neu.every(p=>p.age>=17&&p.ct===3),'Automatik: Der Verein holt am 1. Juli die zwei Besten ab 17 Jahren in den Profikader, solange du den Jugendkader nicht selbst führst',`${neu.map(p=>p.n+' ('+p.age+')').join(', ')}`);}

// 10. Zwei Saisons im Ablauf: Prägungen je Verein, Jugendkader bleibt im Rahmen, Aufrücker kommen an, Felder stimmen
{const pr=[],fehler=[];let jgGroesse=[],aufr=0,meineNews=0;
  saisons({n:2,seed:SEED,verein:6,beiSaisonende:S=>{S.teams.filter(t=>t.lg<=3&&t.id!==S.my).forEach(t=>pr.push((t.kst&&t.kst.pr)||0));jgGroesse.push((S.jg||[]).length);
    const bad=(S.jg||[]).filter(p=>p.age<15||p.age>18||p.team!==-3||!(p.str>=1&&p.str<=p.pot+0.01));if(bad.length)fehler.push('Jugendspieler außerhalb des Rahmens: '+bad[0].n);
    if(S.pl.some(p=>p.team===-3))fehler.push('Jugendspieler im Profikader');const t=S.teams[S.my];if(!(t.jn>=0&&t.jn<=70))fehler.push('Jugendniveau '+t.jn);
    aufr=S.pl.filter(p=>p.team===S.my&&p.id>=500000).length;meineNews+=S.news.filter(n=>/Jahrgang|Durchbruch|prägen/.test(n.t)).length;
    const pt=S.pl.filter(p=>p.pt&&p.pt[0]!==1.3&&p.pt[0]!==0.5);if(pt.length)fehler.push('Tempo nach Prägung falsch');}});
  const mw=m(pr);pruef(mw>=2&&mw<=5,'Prägungen: je Verein 2 bis 5 pro Saison (Computer-Vereine, zwei Saisons)',`${f2(mw)} (höchstens ${Math.max(...pr)} in einem Verein)`);
  pruef(!fehler.length&&jgGroesse.every(n=>n>=6&&n<=26)&&aufr>=2,'Zwei Saisons: Jugendkader bleibt bei 6 bis 26 Spielern, Aufrücker stehen im Profikader, alle Felder im Rahmen',fehler[0]||`Jugendkader ${jgGroesse.join(' und ')}, ${aufr} Aufrücker im Kader`);}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
