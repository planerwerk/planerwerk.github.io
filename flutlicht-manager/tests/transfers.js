// Transfers I (K19 §10, U10a): Fenster für alle, Vereinswert mit einer Formel, keine Mondpreise, Verhandlungsrunden beim Kauf (Gegenangebot, Schmerzgrenze, Spott, Abbruch, Preisdruck),
// Kauf und Verkauf außerhalb des Fensters mit Wechsel zum Fensterbeginn (Winter und Sommer), faire Angebote für deine Spieler, Gegenforderung, Bedarf der Bieter, Speichern und Laden.
// Aufruf: node tests/transfers.js [Seed=5]. Nur Node.js.
const {neueWelt}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %',f2=x=>x.toFixed(2),m=l=>l.length?l.reduce((a,b)=>a+b,0)/l.length:0;
const welt=(id=9)=>{const {W,F}=neueWelt();const zaehl=[];const orig=F.news;F.news=function(t,c){if(String(t).startsWith('Wechsel perfekt'))zaehl.push(W.S.tag);return orig(t,c);};
  F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=id;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(id,ev('myT()').form);
  ev('RAW').konkurrenz.chance=0; // ohne Mitbieter (K20c), damit die Käufe der älteren Prüfungen gleich bleiben. Nr. K20c schaltet ihn ein.
  const im=(k,fn)=>ev('mitStrom')(ev('strom')('test',k),fn);return{W,F,S,ev,im,t:ev('myT()'),T:ev('RTR'),zaehl};};
// Ein Kauf über die Spielerkarte ohne Oberfläche: Felder für Angebot und Laufzeit setzen, dann offer()
const kaufe=(w,p,fee,yrs=3)=>{const els=w.W.ev('document');els.getElementById('fee').value=String(fee/1e6);els.getElementById('yrs').value=String(yrs);els.getElementById('msg').textContent='';w.F.offer(p.id);if(els.getElementById('msg').textContent.includes('Medizincheck')){els.getElementById('msg').textContent='';w.F.offer(p.id);}return els.getElementById('msg').textContent;}; // bei einem Befund im Medizincheck ein zweiter Klick (U10d)

// 1. Fenster: Sommer 1.7. bis 1.9., Winter 1.1. bis 1.2. Wechsel unter Computer-Vereinen nur dort, über eine Saison etwa so viele wie vorher
{const w=welt(),{F,S,ev}=w,auf=ev('fensterOffen');
  pruef(auf(0)&&auf(62)&&!auf(63)&&!auf(183)&&auf(184)&&auf(215)&&!auf(216)&&ev('naechstesFenster')(100)===184&&ev('naechstesFenster')(220)===365,'Fenster: 1. Juli bis 1. September und 1. Januar bis 1. Februar, danach zählt der nächste Fensterbeginn');
  while(S.phase!=='end'&&S.tag<330){if(S.sponsOffers)F.sponsorWaehlen(0);if(ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();}
  const aus=w.zaehl.filter(d=>!auf(d)).length;pruef(w.zaehl.length>=15&&aus===0,'Fenster: Wechsel unter Computer-Vereinen nur im Fenster, mindestens 15 je Saison (vorher etwa 29 über das ganze Jahr)',`${w.zaehl.length} Wechsel, ${aus} außerhalb`);}

// 2. Vereinswert (K19 §5.1): Kaderrolle, Restlaufzeit und Finanzlage wirken, keine Forderung über dem 1,8-Fachen des Marktwerts
{const {S,ev,T}=welt();const p=S.pl.find(q=>q.team>=0&&q.team!==S.my&&!q.list),t=S.teams[p.team],kr=p.krA,ct=p.ct,cash=t.cash,vw=()=>ev('vwVerkauf')(p);
  t.cash=5e6;const werte={};for(const r of ['schluessel','stamm','rotation','ergaenzung']){p.krA=r;werte[r]=vw();}p.krA='stamm';p.ct=3;const lang=vw();p.ct=1;const kurz=vw();p.ct=3;t.cash=1e5;const arm=vw();t.cash=T.finanzlage.reichAb;const reich=vw();p.krA=kr;p.ct=ct;t.cash=cash;
  pruef(werte.schluessel>werte.stamm&&werte.stamm>werte.rotation&&werte.rotation>werte.ergaenzung&&Math.abs(kurz/lang-T.restlaufzeit[1])<1e-9&&Math.abs(arm/lang-T.finanzlage.knapp)<1e-9&&Math.abs(reich/lang-T.finanzlage.reich)<1e-9,
    'Vereinswert: Schlüsselspieler > Stammspieler > Rotation > Ergänzung, ein Jahr Restlaufzeit ×0,6, knappe Kasse ×0,9, reich ×1,1');
  const l=S.pl.filter(q=>q.team>=0&&q.team!==S.my),r=l.map(q=>ev('askPrice')(q)/ev('value')(q)),zuHoch=l.filter(q=>!q.list&&ev('askPrice')(q)>ev('value')(q)*T.maxFaktor+ev('RM').runden);
  pruef(!zuHoch.length&&m(r)>=0.9&&m(r)<=1.4,'Keine Mondpreise: keine Forderung über dem 1,8-Fachen des Marktwerts, im Schnitt 0,9 bis 1,4',`Ø ${f2(m(r))}, höchstens ${f2(Math.max(...r))}, vorher Ø 1,39`);}

// 3. Verhandlungsrunden beim Kauf (K19 §5.2): Gegenangebot in der Mitte, nie unter der Schmerzgrenze, Preisdruck, Spott, Abbruch mit Pause
{const w=welt(),{S,F,ev,T,t}=w;t.cash=5e8;const kandidat=S.pl.filter(q=>q.team>=0&&q.team!==S.my&&!q.list&&q.age<30&&ev('askPrice')(q)>2e6).sort((a,b)=>b.str-a.str);
  const p=kandidat.find(q=>{const I=ev('RM').interesse;return true;}),F0=ev('forderung')(p),sch=ev('schmerzgrenze')(p);
  const r1=ev('kaufRunde')(p,Math.round(F0*0.85/25000)*25000),f1=ev('forderung')(p);
  const r2=ev('kaufRunde')(p,sch-25000),f2v=ev('forderung')(p);
  pruef(!r1.ok&&r1.gegen&&f1<F0&&f1>=sch&&Math.abs(f1-Math.max(sch,Math.round((F0+F0*0.85)/2*(1-T.preisdruck.prozent)/25000)*25000))<=25000&&!r2.ok&&f2v>=sch&&f2v<=f1,'Gegenangebot: in der Mitte zwischen Forderung und Angebot (nach einem anständigen Angebot 3 % weniger), nie unter der Schmerzgrenze',`Forderung ${F0}, nach 85 %: ${f1}, Schmerzgrenze ${sch}, dann ${f2v}`);
  const r3=ev('kaufRunde')(p,f2v);pruef(r3.ok,'Wer das Gegenangebot bietet, bekommt den Zuschlag');
  // Spott: zwei Spottangebote, dann Abbruch und vier Wochen Pause
  delete S.verh[p.id];const s1=ev('kaufRunde')(p,Math.round(F0*0.3)),s2=ev('kaufRunde')(p,Math.round(F0*0.3)),v=ev('verhandlungVon')(p),s3=ev('kaufRunde')(p,F0*2);
  pruef(!s1.ok&&!s2.ok&&s2.text.includes('bricht')&&v.pause===S.tag+T.pause&&!s3.ok&&s3.text.includes('nicht mehr'),'Spott: Nach zwei Spottangeboten bricht der Verein ab und redet vier Wochen nicht, auch nicht über ein hohes Angebot',s2.text);
  // Seit U12c kosten Spottangebote Beziehung, die Forderung steigt dadurch leicht: nach der Pause die aktuelle Forderung bieten (T1.5)
  S.tag+=T.pause;const F1=ev('forderung')(p),s4=ev('kaufRunde')(p,F1);S.tag-=T.pause;pruef(s4.ok&&F1>=F0,'Nach der Pause wird wieder verhandelt (zur aktuellen Forderung, nach zwei Spottangeboten nicht billiger)',`${F0} → ${F1}`);
  delete S.verh[p.id];let n=0,r;do{r=ev('kaufRunde')(p,Math.round(F0*0.7));n++;}while(!r.text?.includes('bricht')&&n<10);
  pruef(n===T.runden.kauf,'Höchstens vier Runden: Danach bricht der Verein ab',`nach ${n} Angeboten`);}

// 4. Kauf außerhalb des Fensters: Einigung und Geld jetzt, der Spieler kommt zum nächsten Fensterbeginn (Winter), mit seinem Vertrag
{const w=welt(),{S,F,ev,t}=w;t.cash=5e8;S.tag=100;const p=S.pl.filter(q=>q.team>=0&&q.team!==S.my&&q.age<29).sort((a,b)=>b.str-a.str).find(q=>{const msg=kaufe(w,q,ev('askPrice')(q)*1.0);return !msg||!msg.includes('kein Interesse');});
  const von=p&&p.wech?p.wech.von:null,cash=t.cash;
  pruef(p&&p.wech&&p.wech.nach===S.my&&p.team===von&&S.wechsel.includes(p.id)&&p.wech.ab===184,'Kauf außerhalb des Fensters: Einigung, der Spieler bleibt bis zum Winterfenster beim alten Verein',p&&`${p.n} (${S.teams[von].name}), Wechsel am Tag ${p.wech&&p.wech.ab}`);
  const vor=ev('forderung')(p);F.offer(p.id);pruef(ev('document').getElementById('msg').textContent.includes('wechselt schon'),'Ein zweites Angebot für ihn geht nicht');
  ev('wechselTag')(150);const noch=p.team===von;ev('wechselTag')(184);
  pruef(noch&&p.team===S.my&&!p.wech&&p.ct===3&&!S.wechsel.length&&S.pl.includes(p),'Winterfenster: Am 1. Januar wechselt er mit dem vereinbarten Vertrag',`Vertrag ${p.ct} Jahre`);}

// 5. Kauf im Frühjahr: Wechsel im Sommer mit dem Saisonwechsel, der Vertrag läuft ab dann volle Jahre
{const w=welt(),{S,F,ev,t}=w;t.cash=5e8;S.tag=250;const p=S.pl.filter(q=>q.team>=0&&q.team!==S.my&&q.age<28).sort((a,b)=>b.str-a.str).find(q=>{const msg=kaufe(w,q,ev('askPrice')(q),2);return !msg||!msg.includes('kein Interesse');});
  pruef(p&&p.wech&&p.wech.ab===365,'Kauf im Frühjahr: Wechsel mit dem Sommerfenster');
  ev('wechselVollziehen')(true);pruef(p.team===S.my&&p.ct===3,'Sommer: Der Wechsel geschieht vor dem Saisonwechsel der Verträge (2 Jahre plus das laufende Jahr, nach dem Saisonwechsel 2)',`Vertrag ${p.ct}`);}

// 6. Angebote für deine Spieler (K19 §5.4, §10): nur Bieter mit Bedarf, faire Beträge nahe am Marktwert
{const w=welt(),{S,F,ev,im,T}=w,sq=ev('squad')(S.my),quoten=[],quotenRL=[],PIX=ev('PIX');let ohneBedarf=0;
  im('angebote',()=>{for(let k=0;k<400;k++){const p=sq[k%sq.length];p.list=1;p.ask=ev('value')(p);S.offers=[];S.tag=10;ev('market')();
    S.offers.filter(o=>o.tid<2000).forEach(o=>{const q=PIX.get(o.pid);quoten.push(o.amt/ev('value')(q));quotenRL.push(o.amt/(ev('value')(q)*ev('rlFaktor')(q)));if(!ev('hatBedarf')(S.teams[o.tid],q))ohneBedarf++;});p.list=0;}});
  const fair=quoten.filter(x=>x>=0.8&&x<=1.2).length/quoten.length,fairRL=quotenRL.filter(x=>x>=0.8&&x<=1.2).length/quotenRL.length;
  pruef(quoten.length>=20&&ohneBedarf===0&&fairRL>=0.8,'Faire Angebote: mindestens 80 % zwischen 80 und 120 % des Marktwerts (bereinigt um die Restlaufzeit), nur von Vereinen mit Bedarf',`${quoten.length} Angebote, ${pc(fairRL)} bereinigt, ${pc(fair)} am reinen Marktwert`);}

// 7. Gegenforderung: im Rahmen des Bieters verkauft, darüber erhöht er, nach drei Runden zieht er zurück
{const w=welt(),{S,F,ev,T,t}=w;const p=ev('squad')(S.my).find(q=>q.pos!=='TW'),b=S.teams.find(x=>x.id!==S.my&&x.lg===1);S.tag=10;
  const ang=()=>{S.offers=[{pid:p.id,tid:b.id,amt:4e6,max:5e6,r:0,bis:S.tag+10}];return S.offers[0];};
  let o=ang();const r1=ev('gegenRunde')(o,6e6),hoch=o.amt;const r2=ev('gegenRunde')(o,7e6);const r3=ev('gegenRunde')(o,8e6);
  pruef(!r1.ok&&hoch===5e6&&!r2.ok&&r3.text.includes('zieht')&&!S.offers.length,'Gegenforderung über dem Rahmen: Der Bieter erhöht bis zu seiner Grenze, nach drei Runden zieht er zurück',`${hoch}`);
  o=ang();const c0=t.cash;const el=ev('document').getElementById('gf0');el.value='4.8';F.gegenAngebot(0);
  pruef(p.team===b.id&&t.cash===c0+4.8e6,'Gegenforderung im Rahmen: verkauft zum geforderten Preis (im Fenster sofort)',`${t.cash-c0} €`);}

// 8. Verkauf außerhalb des Fensters: Geld jetzt, der Spieler spielt bis zum Fenster für dich, kein zweites Angebot, keine Auflösung
{const w=welt(),{S,F,ev,t}=w;const p=ev('squad')(S.my).find(q=>q.pos!=='TW'),b=S.teams.find(x=>x.id!==S.my&&x.lg===1);S.tag=120;S.offers=[{pid:p.id,tid:b.id,amt:3e6,max:3e6,r:0,bis:S.tag+10}];
  const c0=t.cash;F.acceptOffer(0);const da=p.team===S.my&&p.wech&&t.cash===c0+3e6;F.release(p.id);const bleibt=p.team===S.my;S.offers=[];p.list=1;p.ask=1;const r=ev('RM');
  ev('mitStrom')(ev('strom')('x',1),()=>{for(let i=0;i<30;i++)ev('market')();});
  pruef(da&&bleibt&&!S.offers.some(o=>o.pid===p.id),'Verkauf außerhalb des Fensters: Geld sofort, er bleibt bis zum Fenster, keine Auflösung, keine weiteren Angebote');
  ev('wechselTag')(184);pruef(p.team===b.id&&!p.wech,'Winterfenster: Der verkaufte Spieler wechselt');}

// 9. Speichern und Laden mit einem vereinbarten Wechsel
{const w=welt(),{S,F,ev,t,W}=w;t.cash=5e8;S.tag=100;const p=S.pl.filter(q=>q.team>=0&&q.team!==S.my&&q.age<29).sort((a,b)=>b.str-a.str).find(q=>{const msg=kaufe(w,q,ev('askPrice')(q));return !msg||!msg.includes('kein Interesse');});
  W.S=JSON.parse(JSON.stringify(S));F.reindex();const q=ev('PIX').get(p.id);ev('wechselTag')(184);pruef(q&&q.team===W.S.my&&!q.wech,'Speichern und Laden: Der vereinbarte Wechsel bleibt erhalten und wird vollzogen');}

// K20c. Bieterwettstreit beim Kauf (K20 §4.2): Nach dem Ja des Verkäufers bietet ein Computer-Verein mit Bedarf mehr, die Forderung steigt auf sein Gebot,
//       weniger reicht nicht, Mitgehen gewinnt (der andere zieht zurück), nur einmal je Spieler und Saison; ohne Mitgehen wechselt der Spieler nach der Frist zum Konkurrenten
{const w=welt(),{S,F,ev}=w;ev('RAW').konkurrenz.chance=1;S.teams.forEach(x=>{if(x.id!==S.my)x.cash=5e8;});
  const p=S.pl.filter(q=>q.team>=0&&q.team<1000&&q.team!==S.my&&!q.leihe&&S.teams[q.team].lg===2&&q.age<=30).sort((a,b)=>b.str-a.str)[0];
  p.list=1;p.ask=ev('rundeAb')(ev('value')(p)*0.9);const fee=ev('forderung')(p); // auf der Transferliste: Ablöse unter dem Deckel von 1,8 × Marktwert (Prüfung DD1)
  const k=F.konkurrenzKauf(p,fee),v=ev('verhandlungVon')(p),zweimal=F.konkurrenzKauf(p,fee)===null;
  const f1=ev('forderung')(p),r1=F.kaufRunde(p,fee),r2=k?F.kaufRunde(p,k):null,weg=!v||!v.konk;
  const w2=welt(),q=w2.S.pl.filter(x=>x.team>=0&&x.team<1000&&x.team!==w2.S.my&&!x.leihe).sort((a,b)=>b.str-a.str)[5],b=w2.S.teams.find(x=>x.id!==w2.S.my&&x.id!==q.team&&w2.ev('aktiv')(x)&&w2.ev('squad')(x.id).length<30);
  b.cash=5e8;const vq=w2.ev('verhandlung')(q);vq.konk={tid:b.id,amt:1e6,bis:w2.S.tag};w2.F.konkurrenzTag(w2.S.tag);const noch=q.team!==b.id;w2.F.konkurrenzTag(w2.S.tag+1);
  pruef(k>fee&&!!v&&v.konk===null&&zweimal&&f1===k&&!r1.ok&&r1.gegen===k&&!!r2&&r2.ok&&weg&&noch&&q.team===b.id,'K20c: Bieterwettstreit beim Kauf (Gegenangebot, Mitgehen, Frist)',
    `Ablöse ${fee}, Gegenangebot ${k}, Forderung ${f1}, weniger: ${r1.text||''}, Wechsel nach der Frist zu ${q.team===b.id?b.name:'–'}`);}

// K20d. Recht des Spielers (K20 §4.2): Gehst du nicht mit, lehnt ein Spieler mit genug Interesse an dir den anderen Verein ab, dann nimmt der Verkäufer deine Ablöse (Forderung = dein Gebot).
//       Mit Chance 0 wechselt er wie in K20c; das Gebot merkt sich die Ablöse (dein)
{const w=welt(),{S,F,ev}=w,N=ev('RAW').konkurrenz.nein,q=S.pl.filter(x=>x.team>=0&&x.team<1000&&x.team!==S.my&&!x.leihe).sort((a,b)=>b.str-a.str)[5];
  const b=S.teams.find(x=>x.id!==S.my&&x.id!==q.team&&ev('aktiv')(x)&&ev('squad')(x.id).length<30),von=q.team;b.cash=5e8;
  Object.assign(N,{ab:-999,basis:1,max:1,besser:1});const vq=ev('verhandlung')(q);vq.konk={tid:b.id,amt:2e6,bis:S.tag,dein:15e5};F.konkurrenzTag(S.tag+1);
  const bleibt=q.team===von&&vq.f===15e5&&!!ev('verhandlungVon')(q)&&ev('forderung')(q)<=15e5;
  N.max=0;N.basis=0;vq.konk={tid:b.id,amt:2e6,bis:S.tag+1,dein:15e5};F.konkurrenzTag(S.tag+2);const weg=q.team===b.id;
  pruef(bleibt&&weg,'K20d: Der Spieler lehnt den Höchstbietenden ab und der Verkäufer nimmt deine Ablöse, ohne Chance wechselt er',`bleibt ${bleibt} (Forderung ${ev('forderung')(q)}), ohne Chance gewechselt ${weg}`);}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
