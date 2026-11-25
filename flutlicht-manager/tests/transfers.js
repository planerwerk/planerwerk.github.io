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

// K19c. Transferstatus „unverkäuflich“ (K19 §5): die drei Stärksten eines Computer-Vereins mit mindestens 2 Jahren Vertrag kosten dich den Höchstpreis (1,8 × Marktwert),
//       mit 1 Jahr Vertrag, auf der Liste oder als Nummer 4 nicht; dein eigener Spieler: markieren, von der Liste, Transferliste hebt es wieder auf
{const w=welt(),{S,F,ev}=w,U=ev('RTR').unverkaeuflich,t=S.teams.find(x=>x.id!==S.my&&ev('aktiv')(x)&&x.lg===1),sq=ev('squad')(t.id).sort((a,b)=>b.str-a.str),p=sq[0],vier=sq[U.schluessel];
  p.ct=3;p.list=0;const ja=F.unverkaeuflichKI(p),f1=ev('forderungDu')(p),sg=ev('schmerzgrenze')(p)===ev('rundeAb')(f1); /* nicht unter den Höchstpreis (DU2) */
  p.ct=1;const kurz=!F.unverkaeuflichKI(p),f0=ev('forderungDu')(p);p.ct=3;p.list=1;p.ask=1e6;const liste=!F.unverkaeuflichKI(p);p.list=0;vier.ct=3;const nr4=!F.unverkaeuflichKI(vier);
  const m=ev('squad')(S.my)[0];F.setUnverkaeuflich(m.id,1);const markiert=ev('unverkaeuflichDu')(m)&&!m.list;F.setListed(m.id,1);const aufgehoben=!ev('unverkaeuflichDu')(m)&&m.list===1;
  pruef(ja&&sg&&f1>=f0&&kurz&&liste&&nr4&&markiert&&aufgehoben,'K19c: unverkäuflich (Schlüsselspieler mit langem Vertrag zum Höchstpreis, eigene markieren und aufheben)',
    `Schlüsselspieler ${ja}, Forderung ${f0} → ${f1}, 1 Jahr ${kurz}, Liste ${liste}, Nummer 4 ${nr4}, eigener markiert ${markiert}, aufgehoben ${aufgehoben}`);}

// K31b. Bedarf der anderen Vereine (K31 §6): genau die deutschen Vereine, die nach market() für ihn auf der Transferliste bieten dürften (Bedarf, Konto, keine Sperre),
//       die mit einer Lücke zuerst; die Karte gibt es nur für deine eigenen Spieler
{const {S,F,ev}=welt(),A=ev('RM').angebote,p=ev('squad')(S.my).slice().sort((a,b)=>b.str-a.str)[0];p.list=1;p.ask=ev('value')(p);
  const B=F.bedarfAndere(p),soll=S.teams.filter(x=>x.id!==S.my&&ev('aktiv')(x)&&!ev('kiTransferSperre')(x)&&x.cash>p.ask*A.kontoAnteil&&ev('hatBedarf')(x,p)).map(x=>x.id).sort((a,b)=>a-b);
  const ist=B.l.map(x=>x.t.id).sort((a,b)=>a-b),ordnung=B.l.every((x,i)=>i===0||B.l[i-1].luecke>=x.luecke),html=F.bedarfAndereText(p),fremd=S.pl.find(x=>x.team>=0&&x.team!==S.my);
  pruef(JSON.stringify(ist)===JSON.stringify(soll)&&ordnung&&B.preis===p.ask&&html.includes('Bedarf anderer Vereine')&&F.bedarfAndereText(fremd)==='',
    'Bedarf anderer Vereine: dieselben Vereine wie die Bieter im Markt, Lücken zuerst, nur für deine Spieler',`${B.l.length} Vereine, davon ${B.l.filter(x=>x.luecke).length} mit Lücke, Ausland ${B.aus}`);}

// K31c. Konkurrent rüstet auf (K31 §8): Der Star-Kauf (Sternejagd) eines Vereins deiner Liga steht als Meldung da, ein normaler Kauf und ein Verein einer anderen Liga nicht
{const {S,F,ev}=welt(),t=ev('myT()'),meld=[],orig=F.news;F.news=function(x,c){if(String(x).startsWith('Konkurrent rüstet auf'))meld.push(x);return orig(x,c);};
  const kaeufer=S.teams.find(x=>x.id!==S.my&&x.lg===t.lg),fremd=S.teams.find(x=>x.lg!==t.lg&&x.lg<=3),spieler=()=>S.pl.find(p=>p.team>=0&&p.team!==S.my&&p.team!==kaeufer.id&&p.team!==fremd.id&&!p.wech&&!p.leihe);
  F.kiWechsel(spieler(),kaeufer,1e6,'stern');const a=meld.length;F.kiWechsel(spieler(),kaeufer,1e6);const b=meld.length;F.kiWechsel(spieler(),fremd,1e6,'stern');const c=meld.length;
  pruef(a===1&&b===1&&c===1,'Konkurrent rüstet auf: Meldung nur beim Star-Kauf eines Vereins deiner Liga',`Star ${a}, normaler Kauf ${b-a}, andere Liga ${c-b}`);}

// K19d. Weiterverkaufsbeteiligung (K19 §5.2): Verkauf mit 15 % an einen deutschen Verein, der Käufer zahlt 3 % weniger; verkauft er weiter, bekommt dein Verein 15 %
//       der neuen Ablöse aus seinem Konto, danach ist sie erledigt (der dritte Verkauf zahlt nichts mehr)
{const {S,F,ev}=welt(),W=ev('RTR').weiterverkauf,frei=x=>x.id!==S.my&&ev('aktiv')(x)&&!ev('kiTransferSperre')(x)&&x.cash>5e6,vs=S.teams.filter(frei),[b,c,d]=vs;
  const p=ev('squad')(S.my).find(x=>!x.wech&&!x.leihe),f0=S.fin['Transfers']||0,o={pid:p.id,tid:b.id,amt:1e6,max:1e6,r:0,bis:S.tag+5};S.offers.push(o);
  F.verkaufAbschluss(o,true);if(p.wech)ev('wechselVollziehen')(true);const erhalten=(S.fin['Transfers']||0)-f0,soll=Math.round(1e6*(1-W.bewertung*W.anteil)/1000)*1000;
  const hat=!!p.wvb&&p.wvb.tid===S.my&&p.team===b.id,w0=S.fin['Transfers: Weiterverkauf']||0,b0=b.cash;F.kiWechsel(p,c,2e6);const wv=(S.fin['Transfers: Weiterverkauf']||0)-w0,bAbzug=b0+2e6-b.cash;
  const w1=S.fin['Transfers: Weiterverkauf']||0;F.kiWechsel(p,d,3e6);const danach=(S.fin['Transfers: Weiterverkauf']||0)-w1;
  // Prüfung EA4, EA5: Verkauf durch einen anderen als den gebundenen Verein zahlt nichts, Rückkauf durch den Begünstigten auch nicht; beide Male ist sie erledigt
  p.wvb={tid:S.my,anteil:W.anteil,von:b.id};const w2=S.fin['Transfers: Weiterverkauf']||0;F.kiWechsel(p,c,1e6);const fremd=(S.fin['Transfers: Weiterverkauf']||0)-w2===0&&!p.wvb;
  p.wvb={tid:S.my,anteil:W.anteil,von:p.team};ev('statTransfer')(p,1e6,p.team,S.my);const zurueck=(S.fin['Transfers: Weiterverkauf']||0)-w2===0&&!p.wvb;
  pruef(erhalten===soll&&hat&&wv===Math.round(2e6*W.anteil)&&bAbzug===wv&&danach===0&&fremd&&zurueck,'Weiterverkaufsbeteiligung: Abschlag beim Verkauf, Anteil beim nächsten Verkauf des Käufers, danach erledigt, nichts bei fremdem Verkauf oder Rückkauf',
    `erhalten ${erhalten} (soll ${soll}), Klausel ${hat}, Anteil ${wv}, Abzug beim Käufer ${bAbzug}, dritter Verkauf ${danach}, fremder Verkauf ${fremd}, Rückkauf ${zurueck}`);}

// K19e. Rückkehr des verlorenen Sohns (K19 §8): Ein Spieler eines anderen Vereins mit mindestens so vielen Pflichtspielen für deinen Verein wie ein Publikumsliebling hat heimkehrVerein mehr Interesse;
//       kommt er zu dir, steigt die Fanstimmung (Umfeld) um heimkehrFans, mit Meldung. Ohne diese Spiele bleibt alles wie bisher.
{const {S,F,ev,t}=welt(),IV=ev('RVT').interesse,KZ=ev('KZ'),wi=ev('wechselInteresse'),p=S.pl.find(x=>x.team>=0&&x.team<1000&&x.team!==S.my&&!x.leihe&&!x.wech&&F.vereinsSpiele(x,S.my)===0);
  const i0=wi(p),z=[];z[KZ.s]=S.season-2;z[KZ.tid]=S.my;z[KZ.lg]=t.lg;z[KZ.sp]=ev('RFS').ident.lieblingSpiele; /* Grenze wie ein Publikumsliebling (Prüfung EP6) */z[KZ.min]=5000;for(let i=0;i<=KZ.mw;i++)if(z[i]==null)z[i]=0;p.kar=[...(p.kar||[]),z];const i1=wi(p);
  const fu0=t.fanU||0;p.team=S.my;F.neuzugang(p,S.my);const meldung=S.news.some(x=>String(x.t).includes(p.n+' kehrt zurück'));
  pruef(Math.abs(i1-i0-IV.heimkehrVerein)<1e-9&&(t.fanU||0)===fu0+IV.heimkehrFans&&meldung,'Rückkehr des verlorenen Sohns: mehr Interesse, die Fans freuen sich',`Interesse ${i0.toFixed(1)} → ${i1.toFixed(1)}, Umfeld ${fu0} → ${t.fanU}, Meldung ${meldung}`);}

// Prüfung FC1, FC3, FC4: Fristen der Verhandlungen in Saisontagen rücken beim Saisonwechsel mit (newSeasonLauf ruft fristenSaisonwechsel mit der Länge der alten Saison auf),
// Einigungen verfallen beim Jobwechsel (takeJob ruft verhJobwechsel auf), Gegenangebote aus alten Spielständen werden beim Laden (auch beim Import) an deinen Verein und,
// mit laufendem Nachlass, an ihn gebunden.
{const {S,ev}=welt();const p=ev('squad')(S.teams.find(t=>t.id!==S.my&&t.lg===1).id)[0],v=ev('verhandlung')(p);
  v.pause=300;v.druck=290;v.einig={fee:1e6,bis:310};v.konk={tid:1,amt:1,bis:305};S.vt={[p.id]:{pause:320}};S.vtGespr={[p.id]:300};
  ev('fristenSaisonwechsel')(365);const ruecken=v.pause===-65&&v.druck===-75&&v.einig.bis===-55&&v.konk.bis===-60&&S.vt[p.id].pause===-45&&S.vtGespr[p.id]===-65;delete v.konk;
  const aufruf=/fristenSaisonwechsel\(absTag\(0\)-tag0\)/.test(String(ev('newSeasonLauf')));
  v.einig={fee:1e6,bis:S.tag+10};ev('verhJobwechsel')();const job=v.einig===null&&/verhJobwechsel\(\)/.test(String(ev('takeJob')));
  v.f=2e6;delete v.fMy;delete v.fNl;v.nlF=0.1;v.nlMy=S.my;v.nlBis=ev('absTag')(S.tag)+30;ev('verhUmstellen')();const alt=v.fMy===S.my&&v.fNl===1;
  const imp=/verhUmstellen\(\)/.test(String(ev('importSave')));
  pruef(ruecken&&aufruf&&job&&alt&&imp,'Verhandlungen: Fristen rücken beim Saisonwechsel mit, Einigungen verfallen beim Jobwechsel, alte Gegenangebote werden beim Laden gebunden',
    `Fristen ${ruecken} (Pause ${v.pause}), Aufruf im Saisonwechsel ${aufruf}, Jobwechsel ${job}, altes Gegenangebot ${alt}, Import ${imp}`);}

// Prüfung FD1, FD2, FD4, FD5: Auch Kater nach „Spiel der Saison“, Standardtraining, Gegnerbeobachtung (am Verein), Angebote für deine Spieler und das Fenster der letzten
// Bieterrunde rücken beim Saisonwechsel mit. Ein Kater vom Saisonende wirkt nur noch die restlichen Tage, ein Angebot vom 28.6. verfällt in der neuen Saison.
{const {S,ev}=welt(),dt=365,a=S.teams.find(t=>t.id!==S.my&&t.lg===1),b=S.teams.find(t=>t.id!==S.my&&t.id!==a.id&&t.lg===1),p=ev('squad')(S.my)[0];
  a.kater=344;b.kater=370;a.stdTag=300;a.gb={g:b.id,bis:330};delete b.stdTag;delete b.gb;S.offers=[{pid:p.id,tid:a.id,fee:1e6,bis:376}];p.bieterF=365;
  ev('fristenSaisonwechsel')(dt);
  const ok=a.kater===344-dt&&b.kater===370-dt&&a.stdTag===300-dt&&a.gb.bis===330-dt&&b.stdTag===undefined&&b.gb===undefined&&S.offers[0].bis===376-dt&&p.bieterF===0;
  S.tag=0;const katerA=!!a.kater&&S.tag<a.kater,katerB=!!b.kater&&S.tag<b.kater,beobachtet=ev('gegnerBeobachtet')(a,b.id);
  pruef(ok&&!katerA&&katerB&&!beobachtet,'Saisonwechsel: Kater, Standardtraining, Gegnerbeobachtung, Angebote und Bieterrunde rücken mit',
    `verschoben ${ok} (Kater ${a.kater}/${b.kater}, Standards ${a.stdTag}, Beobachtung bis ${a.gb.bis}, Angebot bis ${S.offers[0].bis}, Bieterfenster ${p.bieterF}), am 1.7.: Kater alt ${katerA}, Kater jung ${katerB}, Beobachtung ${beobachtet}`);}

// Prüfung FF4, FF5: Das Fenster der letzten Bieterrunde rückt auch bei Spielern der Zweiten und im Ausland mit, jeder Spieler nur einmal. Beim Laden (verhUmstellen) stellt
// fristenAltstand Fristen aus Spielständen vor FD um: zu weit voraus liegender Kater, Standardtraining und Gegnerbeobachtung fallen weg, Angebote gelten höchstens
// angebotTage. Frische Werte bleiben.
{const {S,ev}=welt(),a=S.teams.find(t=>t.id!==S.my&&t.lg===1),p=ev('squad')(S.my)[1],q={id:-77,bieterF:184},au=((S.ausland&&S.ausland.pl)||[])[0];
  S.zw=[q,p];p.bieterF=365;if(au)au.bieterF=184;ev('fristenSaisonwechsel')(365);const zw=q.bieterF===184-365&&p.bieterF===0&&(!au||au.bieterF===184-365);
  const h=S.tag,AT=ev('RK').angebotTage,K=ev('RTA').einstellung.saison.katerTage,b=S.teams.find(t=>t.id!==S.my&&t.id!==a.id);
  a.kater=h+200;a.stdTag=h+100;a.gb={g:0,bis:h+300};b.kater=h+K;b.stdTag=h-3;const frisch={pid:p.id,tid:a.id,bis:h+AT},alt={pid:p.id,tid:a.id,bis:h+300};S.offers=[frisch,alt];
  ev('verhUmstellen')();const ok=a.kater===undefined&&a.stdTag===undefined&&a.gb===null&&frisch.bis===h+AT&&alt.bis===h+AT&&b.kater===h+K&&b.stdTag===h-3;
  pruef(zw&&ok,'Fristen: Bieterrunde auch in der Zweiten und im Ausland, alte Spielstände werden beim Laden umgestellt',`Zweite/Ausland ${zw}, Umstellung ${ok} (Kater ${a.kater}, Angebot alt bis ${alt.bis})`);}

// K19i. Boni als Teil der Ablöse (K19 §5.2): Der Verkäufer rechnet einen Bonus mit wert an. Mehr als maxAnteil der festen Ablöse geht nicht, nicht bei Auslandsvereinen,
//       kein Aufstiegsbonus in der 1. Liga. Ein Kauf mit Bonus legt ihn in S.boni; er wartet, bis der Spieler da ist, wird nach 25 Pflichtspielen für dich fällig (dein Konto
//       zahlt, der Verkäufer bekommt es), verfällt nach saisons Saisons und entfällt, wenn der Spieler dich verlassen hat.
{const w=welt(),{S,F,ev,t}=w,B=ev('RTR').boni,RMr=ev('RM').runden,doc=ev('document'),bw=ev('bonusWert'),setz=(b,art)=>{doc.getElementById('bonus').value=String(b);doc.getElementById('bonusArt').value=art;};
  setz(3,'spiele');const zuViel=!!(F.bonusAusFormular(4e6,false)||{}).fehler;setz(1,'spiele');const gut=F.bonusAusFormular(4e6,false),ausl=!!(F.bonusAusFormular(4e6,true)||{}).fehler;
  const lg0=t.lg;t.lg=1;setz(1,'aufstieg');const auf1=!!(F.bonusAusFormular(4e6,false)||{}).fehler;t.lg=lg0;setz(0,'spiele');const ohne=F.bonusAusFormular(4e6,false)===null;
  const form=bw({b:2e6})===Math.round(2e6*B.wert)&&bw(null)===0&&zuViel&&!!gut&&gut.art==='spiele'&&gut.b===1e6&&ausl&&auf1&&ohne;
  t.cash=5e8;S.tag=100;let p=null,b=0;
  for(const q of S.pl.filter(x=>x.team>=0&&x.team<1000&&x.team!==S.my&&x.age<29).sort((a,c)=>c.str-a.str).slice(0,30)){const a=ev('askPrice')(q);b=Math.round(a*0.2/RMr)*RMr;setz(b/1e6,'spiele');
    kaufe(w,q,a-bw({b}));if(q.wech&&q.wech.nach===S.my){p=q;break;}}
  setz(0,'spiele');const x=p&&(S.boni||[]).find(y=>y.pid===p.id),vereinbart=!!x&&x.b===b&&x.art==='spiele'&&typeof x.st==='number'&&x.my===S.my; /* FH2: st beim Kauf */
  F.boniWoche();const wartet=!!p&&S.boni.includes(x);const von=p&&S.teams[p.wech.von];if(p)ev('wechselTag')(184);
  F.boniWoche();const da=!!p&&p.team===S.my&&S.boni.includes(x);let faellig=false,zweite=false;
  if(da){const z0=p.team;p.team=ev('ZWEITE_TEAM');F.boniWoche();zweite=S.boni.includes(x);p.team=z0; /* FH2: die Zweite ist kein Abgang */
    x.st-=B.arten.spiele.n;const c0=t.cash,v0=von.cash;F.boniWoche();faellig=!S.boni.includes(x)&&t.cash===c0-x.b&&von.cash===v0+x.b&&S.news[0].t.includes('Bonus fällig');}
  /* FH3: Ein Aufstieg am Ende der letzten Saison zählt noch (Bedingung vor Verfall); der Aufstiegsbonus zählt beim Verkäufer nur oben in der Tabelle voll */
  const alt={pid:p?p.id:0,tid:von?von.id:0,art:'aufstieg',b:1e6,s0:S.season-B.saisons,lg0:t.lg,my:S.my,st:0},weg={pid:S.pl.find(y=>y.team>=0&&y.team!==S.my&&!y.wech).id,tid:0,art:'spiele',b:1e6,s0:S.season,lg0:t.lg,my:S.my,st:0},
    knapp={pid:p?p.id:0,tid:von?von.id:0,art:'aufstieg',b:1e6,s0:S.season-B.saisons,lg0:t.lg+1,my:S.my,st:0};
  const c1=t.cash;S.boni=[alt,weg,knapp];F.boniWoche();const aufgeraeumt=S.boni.length===0&&t.cash===c1-1e6;
  const A=B.arten.aufstieg,oben=ev('rank')(t.lg,S.my)<=A.platz,aufWert=bw({b:2e6,art:'aufstieg'})===Math.round(2e6*B.wert*(oben?1:A.sonst));
  pruef(form&&!!p&&vereinbart&&wartet&&da&&zweite&&faellig&&aufgeraeumt&&aufWert,'Boni: zählen beim Verkäufer zur Hälfte, Grenzen im Formular, fällig nach 25 Pflichtspielen, verfallen und entfallen',
    `Formular ${form}, Kauf ${p?p.n:'keiner'}, vereinbart ${vereinbart} (${b}), wartet ${wartet}, angekommen ${da}, Zweite ${zweite}, fällig ${faellig}, verfallen/entfallen/knapp ${aufgeraeumt}, Aufstiegswert ${aufWert}`);}

// K19j. Spielertausch (K19 §4.3): Dein Spieler zählt beim Verkäufer mit wert × vwKauf. Er geht nicht zu einem deutlich kleineren Verein, außer mit Wechselwunsch; nicht, wenn
//       der Verkäufer keinen Platz hat; nicht bei Auslandsvereinen. Ein Kauf mit Tausch außerhalb des Fensters: beide wechseln zum nächsten Fensterbeginn.
{const w=welt(),{S,F,ev,t}=w,T=ev('RTR').tausch,doc=ev('document'),M=ev('RM'),tw=ev('tauschWert'),akt=ev('aktiv');
  const q=ev('squad')(S.my).filter(x=>ev('tauschMoeglich')(x)).sort((a,b)=>a.str-b.str)[0],andere=S.teams.filter(x=>x.id!==S.my&&akt(x)).sort((a,b)=>a.rep-b.rep),klein=andere[0];
  const wert=tw(q,klein.id)===Math.round(ev('vwKauf')(q,klein.id)*T.wert/M.runden)*M.runden;
  const ww0=q.ww;q.ww=0;const nein=klein.rep<t.rep-T.ansehenMinus?!!(F.tauschPruefen(q.id,klein,false)||{}).fehler:true;q.ww=1;const mitWunsch=!(F.tauschPruefen(q.id,klein,false)||{}).fehler;q.ww=ww0;
  const ausl=!!(F.tauschPruefen(q.id,klein,true)||{}).fehler,km=M.kaeufer.kaderMax;M.kaeufer.kaderMax=0;const voll=!!(F.tauschPruefen(q.id,klein,false)||{}).fehler;M.kaeufer.kaderMax=km;
  const ohne=F.tauschPruefen('',klein,false)===null,pruefung=wert&&nein&&mitWunsch&&ausl&&voll&&ohne;
  t.cash=5e8;S.tag=100;let p=null,von=null;
  for(const c of S.pl.filter(x=>x.team>=0&&x.team<1000&&x.team!==S.my&&x.age<29&&S.teams[x.team].rep>=t.rep-T.ansehenMinus&&ev('squad')(x.team).length<M.kaeufer.kaderMax).sort((a,b)=>b.str-a.str).slice(0,30)){
    doc.getElementById('tausch').value=String(q.id);kaufe(w,c,Math.max(0,ev('askPrice')(c)-tw(q,c.team)));if(c.wech&&c.wech.nach===S.my){p=c;von=c.wech.von;break;}}
  doc.getElementById('tausch').value='';
  const getauscht=!!p&&!!q.wech&&q.wech.nach===von&&q.wech.von===S.my&&S.wechsel.includes(q.id);ev('wechselTag')(184);const danach=!!p&&p.team===S.my&&q.team===von;
  pruef(pruefung&&!!p&&getauscht&&danach,'Spielertausch: Wert beim Verkäufer, Einverständnis, Kaderplatz, beide wechseln zum Fenster',
    `Prüfung ${pruefung} (Wert ${wert}, kleiner Verein ${nein}, mit Wechselwunsch ${mitWunsch}, Ausland ${ausl}, voll ${voll}), Kauf ${p?p.n:'keiner'}, vereinbart ${getauscht}, nach dem Fenster ${danach}`);}

// Prüfung FH1, FH5, FH6: Gewinnst du den Bieterwettstreit doch noch (der andere Verein kann nicht mehr kaufen), übernimmt die Einigung Bonus und Tausch; ohne sie wie bisher
// der angerechnete Betrag. Ein Verein mit Transfersperre bekommt keinen Tauschspieler. Das Ablösefeld rundet auf.
{const {S,F,ev,t}=welt(),M=ev('RM'),Sp=ev('squad');S.tag=10;
  const p=S.pl.find(x=>x.team>=0&&x.team<1000&&x.team!==S.my&&!x.wech&&!x.leihe&&Sp(x.team).length>M.verkaeufer.kaderMin),b=S.teams.find(x=>x.id!==S.my&&x.id!==p.team&&ev('aktiv')(x));
  const teile={fee:1e6,bonus:{art:'spiele',b:5e5},tausch:{pid:-1,w:2e5}},v=ev('verhandlung')(p),cash=b.cash;b.cash=0;
  v.konk={tid:b.id,amt:3e6,bis:S.tag-1,dein:1.45e6,my:S.my,teile};ev('konkurrenzTag')(S.tag);const mit=!!v.einig&&v.einig.fee===1e6&&v.einig.bonus===teile.bonus&&v.einig.tausch===teile.tausch;
  v.einig=null;v.konk={tid:b.id,amt:3e6,bis:S.tag-1,dein:1.45e6,my:S.my,teile:null};ev('konkurrenzTag')(S.tag);const ohne=!!v.einig&&v.einig.fee===1.45e6&&!v.einig.bonus;b.cash=cash;
  const q=Sp(S.my).find(x=>ev('tauschMoeglich')(x)),z=S.teams.find(x=>x.id!==S.my&&ev('aktiv')(x)&&Sp(x.id).length<M.kaeufer.kaderMax),q0=q.ww;q.ww=3;
  z.lzSperre=S.season;const gesperrt=!!(F.tauschPruefen(q.id,z,false)||{}).fehler;delete z.lzSperre;const frei=!(F.tauschPruefen(q.id,z,false)||{}).fehler;q.ww=q0;
  const mio=ev('mioAuf'),rund=mio(1525000)==='1.53'&&mio(1520000)==='1.52'&&mio(2512500)==='2.52';
  /* Prüfung FI1: Ein Spieler in der simulierten Zweiten (Hoffenheim, Stuttgart: eigener Verein in der 3. Liga, p.zwP) ist für den Bonus noch bei dir */
  /* Prüfung FJ1: buildWorld setzt zweite bei jedem Verein als Zahl (−1 ohne Mutterverein), also < 0 suchen und −1 zurückschreiben */
  const bd=ev('bonusBeiDir'),zw=S.teams.find(x=>x.id!==S.my&&ev('aktiv')(x)&&x.lg===3&&!(x.zweite>=0)),sp=Sp(S.my)[0],t0=sp.team,z0=zw.zweite;zw.zweite=S.my;sp.team=zw.id;sp.zwP=1;
  const simZw=bd(sp);delete sp.zwP;const ohneZwP=!bd(sp);sp.team=t0;zw.zweite=z0==null?-1:z0;
  pruef(mit&&ohne&&gesperrt&&frei&&rund&&simZw&&ohneZwP,'Bieterwettstreit mit Bonus und Tausch, kein Tausch mit gesperrtem Verein, Ablösefeld aufgerundet, simulierte Zweite',
    `mit Teilen ${mit}, ohne ${ohne}, Sperre ${gesperrt}/${frei}, Rundung ${rund} (${mio(1525000)}, ${mio(2512500)}), simulierte Zweite ${simZw}/${ohneZwP}`);}

// K31d. Notverkauf (K31 §8), nur mit Schalter RCV.notverkauf.an: Über dem Gehaltsrahmen kommt der Spieler mit dem höchsten Gehalt (kein Schlüsselspieler) für preis × kiPreis
//       auf die Liste, mit einer Meldung je Verein und Saison. Ausgeschaltet oder unter dem Rahmen passiert nichts.
{const {S,ev}=welt(),N=ev('RCV').notverkauf,t=S.teams.find(x=>x.id!==S.my&&ev('aktiv')(x)&&x.lg===1),P=ev('kaderplan')(t),nv=ev('kiNotverkauf'),sq=ev('squad')(t.id);
  sq.forEach(p=>{p.sal0=p.sal;p.sal*=10;});const aus=nv(t,P)===null;N.an=true;
  const p=nv(t,P),m1=!!S.news[0]&&String(S.news[0].t).includes('Notverkauf');S.news.unshift({t:'x'});const q=nv(t,P),m2=S.news[0].t==='x';
  const ok=!!p&&p.list===1&&p.ask===Math.max(ev('RP').marktwert.minimum,ev('rundeAb')(ev('kiPreis')(p)*N.preis))&&ev('kaderRolle')(p)!=='schluessel'&&m1&&q===p&&m2;
  /* Prüfung FK1: Merker p.nv für den Kauf ohne Abgabegrund, kiListe löscht ihn; auch dein Verein, wenn ihn kiMarkt führt (Automatik der Transfers) */
  const kauf=String(ev('kiKandidat')).includes('preis=p.nv===S.season?p.ask:kiPreis(p)'); /* FL7: kiKandidat kauft zum Notpreis */
  const merk=!!p&&p.nv===S.season;ev('kiListe')(P);const geloescht=!!p&&p.nv===undefined;
  const mt=S.teams[S.my],ich=ev('squad')(S.my);ich.forEach(x=>{x.sal0=x.sal;x.sal*=10;});const pm=nv(mt,ev('kaderplan')(mt)),meinV=!!pm&&pm.nv===S.season;
  ich.forEach(x=>{x.sal=x.sal0;delete x.sal0;if(x.nv){delete x.nv;x.list=0;x.ask=0;}});delete mt.nvS;
  sq.forEach(x=>{x.sal=x.sal0;delete x.sal0;});delete t.nvS;const unter=ev('gehaltsSumme')(t)<=ev('gehaltsRahmen')(t)*N.ueberRahmen?nv(t,P)===null:true;N.an=false;
  pruef(aus&&ok&&merk&&geloescht&&meinV&&unter&&kauf,'Notverkauf: nur mit Schalter und über dem Gehaltsrahmen, teuerster Nicht-Schlüsselspieler unter Wert, eine Meldung je Saison, Merker für den Kauf',
    `aus ${aus}, Notverkauf ${ok}${p?` (${p.n}, ${p.ask})`:''}, Merker ${merk}/${geloescht}, dein Verein ${meinV}, unter dem Rahmen ${unter}, Kauf zum Notpreis ${kauf}`);}

// K19k. Boni in Angeboten der Computer-Vereine (K19 §5.2): bonusKI legt fest aus dem Seed ki.anteil des Gebots als Bonus an und senkt feste Ablöse und Rahmen um
//       wert × Bonus, nie bei Auslandsvereinen. Ein Verkauf mit Bonus legt ihn in S.boniEin; fällig nach 25 Pflichtspielen für den Käufer (er zahlt, dein Konto bekommt es)
//       oder bei seinem Aufstieg, verfällt nach saisons Saisons, entfällt, wenn der Spieler den Käufer verlassen hat; der Jobwechsel leert die Liste.
{const {S,F,ev,t}=welt(),B=ev('RTR').boni,K=B.ki,akt=ev('aktiv'),rab=ev('rundeAb'),b=S.teams.find(x=>x.id!==S.my&&akt(x)&&x.lg>1),p=ev('squad')(S.my).find(x=>!x.wech&&!x.leihe);
  const c0=K.chance;K.chance=1;const g={amt:10e6,max:12e6};F.bonusKI(b,p,g);const x=rab(10e6*K.anteil),ab=rab(x*B.wert);
  const mit=!!g.bo&&g.bo.b===x&&g.amt===10e6-ab&&g.max===12e6-ab&&(g.bo.art==='spiele'||g.bo.art==='aufstieg');
  const ga={amt:10e6,max:12e6};F.bonusKI({id:ev('AV0'),lg:2},p,ga);const ausl=!ga.bo&&ga.amt===10e6;
  K.chance=0;const g0={amt:10e6,max:12e6};F.bonusKI(b,p,g0);const ohne=!g0.bo&&g0.amt===10e6;K.chance=c0;
  const text=ev('angebotBetrag')({amt:1e6,tid:b.id,bo:{art:'spiele',b:2e5}}).includes(`Bonus nach ${B.arten.spiele.n} Pflichtspielen`);
  let d=0;while(d<400&&!ev('fensterOffen')(d))d++;S.tag=d;
  const o={pid:p.id,tid:b.id,amt:g.amt,max:g.max,r:0,bis:S.tag+5,bo:{art:'spiele',b:x}};S.offers.push(o);F.verkaufAbschluss(o);
  const e=(S.boniEin||[]).find(y=>y.pid===p.id),verkauft=p.team===b.id&&!!e&&e.tid===b.id&&e.b===x&&e.art==='spiele'&&e.my===S.my&&e.lg0===b.lg&&typeof e.st==='number';
  let wartet=false,faellig=false;if(e){F.boniEinWoche();wartet=S.boniEin.includes(e);
    e.st-=B.arten.spiele.n;const c1=t.cash,v1=b.cash;F.boniEinWoche();faellig=!S.boniEin.includes(e)&&t.cash===c1+x&&b.cash===v1-x&&String(S.news[0].t).includes('Bonus fällig');}
  const q=S.pl.find(y=>y.team>=0&&y.team<1000&&y.team!==b.id&&y.team!==S.my&&!y.wech&&!y.leihe);
  const alt={pid:p.id,tid:b.id,art:'aufstieg',b:1e6,s0:S.season-B.saisons,lg0:b.lg,my:S.my,st:0},weg={pid:q.id,tid:b.id,art:'spiele',b:1e6,s0:S.season,lg0:b.lg,my:S.my,st:0},
    auf={pid:p.id,tid:b.id,art:'aufstieg',b:1e6,s0:S.season-B.saisons,lg0:b.lg+1,my:S.my,st:0};
  const c2=t.cash;S.boniEin=[alt,weg,auf];F.boniEinWoche();const aufgeraeumt=S.boniEin.length===0&&t.cash===c2+1e6;
  S.boniEin=[weg];F.finanzenJobwechsel();const job=S.boniEin.length===0;
  pruef(mit&&ausl&&ohne&&text&&verkauft&&wartet&&faellig&&aufgeraeumt&&job,'Boni in Angeboten der Computer-Vereine: Gebot geteilt, Verkauf merkt den Bonus, fällig, verfallen, entfallen, Jobwechsel',
    `Gebot ${mit}, Ausland ${ausl}, ohne ${ohne}, Text ${text}, Verkauf ${verkauft}, wartet ${wartet}, fällig ${faellig}, verfallen/entfallen/Aufstieg ${aufgeraeumt}, Jobwechsel ${job}`);}

// K19l. Tausch in Angeboten der Computer-Vereine (K19 §4.3): tauschKI legt den teuersten passenden Spieler der Transferliste des Käufers dazu und senkt das Gebot um
//       seinen Preis; nicht mit Bonus, nicht mit Chance 0. Beim Verkauf im offenen Fenster kommt er mit seinem Vertrag zu dir; ist er weg, zahlt der Käufer den Betrag.
{const {S,F,ev,t}=welt(),K=ev('RTR').tausch.ki,rab=ev('rundeAb'),akt=ev('aktiv'),sq=ev('squad'),RB=ev('RFP').budget,sp0=RB.sperreAb;RB.sperreAb=99; /* FP11: Gehaltsrahmen im ganzen Fall aus */
  const b=S.teams.find(x=>x.id!==S.my&&akt(x)&&sq(x.id).length>18),ps=sq(S.my).filter(x=>!x.wech&&!x.leihe),p=ps[0],p2=ps[1];
  const r=sq(b.id).find(q=>!q.wech&&!q.leihe&&!q.zwP);sq(b.id).forEach(q=>{q.list=0;q.ask=0;});r.list=1;r.ask=rab(2e6);r.ww=1;const ct0=r.ct,sal0=r.sal;
  const c0=K.chance;K.chance=1;const g={amt:10e6,max:12e6};F.tauschKI(b,p,g);const mit=!!g.ta&&g.ta.pid===r.id&&g.ta.w===rab(2e6)&&g.amt===10e6-rab(2e6)&&g.max===12e6-rab(2e6);
  const gb={amt:10e6,max:12e6,bo:{art:'spiele',b:1e6}};F.tauschKI(b,p,gb);const mitBonus=!gb.ta;
  K.chance=0;const g0={amt:10e6,max:12e6};F.tauschKI(b,p,g0);const ohne=!g0.ta;K.chance=c0;
  const text=ev('angebotBetrag')({amt:g.amt,tid:b.id,ta:g.ta}).includes(r.n);
  let d=0;while(d<400&&!ev('fensterOffen')(d))d++;S.tag=d;
  const o={pid:p.id,tid:b.id,amt:g.amt,max:g.max,r:0,bis:S.tag+5,ta:g.ta};S.offers.push(o);F.verkaufAbschluss(o);
  const getauscht=p.team===b.id&&r.team===S.my&&r.ct===ct0&&r.sal===sal0&&!r.list;
  const q=sq(b.id).find(x=>x!==p&&!x.wech&&!x.leihe),o2={pid:p2.id,tid:b.id,amt:5e6,max:6e6,r:0,bis:S.tag+5,ta:{pid:q.id,w:1e6}};q.team=S.my; /* nicht mehr beim Käufer */
  const c1=t.cash;S.offers.push(o2);F.verkaufAbschluss(o2);const ersatz=p2.team===b.id&&q.team===S.my&&t.cash===c1+5e6+1e6&&S.news.slice(0,3).some(n=>String(n.t).includes('zahlt stattdessen')); /* danach kommt noch „Verkauft“ */
  /* Prüfung FO1, FO4, FO8: im geschlossenen Fenster nach dem Winter kommt der Tauschspieler zum Sommer mit einem Vertragsjahr weniger; läuft sein Vertrag dann aus, zahlt der
     Käufer, und die Ablöse enthält den Betrag (o.amt), das Angebot keinen Tausch mehr */
  let d2=S.plan.ende-1;while(d2>0&&(ev('fensterOffen')(d2)||(ev('naechstesFenster')(d2)||Infinity)<S.plan.ende))d2--;S.tag=d2;
  const [p3,p4]=ps.slice(2,4),[r3,r4]=sq(b.id).filter(x=>!x.wech&&!x.leihe&&!x.zwP&&x!==p&&x!==q).slice(0,2);r3.ww=1;r4.ww=1;r3.ct=3;r4.ct=1;
  const o3={pid:p3.id,tid:b.id,amt:4e6,max:5e6,r:0,bis:S.tag+5,ta:{pid:r3.id,w:1e6}};S.offers.push(o3);F.verkaufAbschluss(o3);const sommer=!!r3.wech&&r3.wech.nach===S.my&&r3.wech.ct===2;
  const c2=t.cash,o4={pid:p4.id,tid:b.id,amt:4e6,max:5e6,r:0,bis:S.tag+5,ta:{pid:r4.id,w:1e6}};S.offers.push(o4);F.verkaufAbschluss(o4);const auslauf=!r4.wech&&t.cash===c2+5e6&&o4.amt===5e6&&!o4.ta;RB.sperreAb=sp0;
  pruef(mit&&mitBonus&&ohne&&text&&getauscht&&ersatz&&sommer&&auslauf,'Tausch in Angeboten der Computer-Vereine: Spieler der Transferliste, Gebot gesenkt, nicht mit Bonus, Wechsel mit Vertrag, sonst Geld, zum Sommer ein Jahr weniger',
    `Gebot ${mit}, mit Bonus ${mitBonus}, Chance 0 ${ohne}, Text ${text}, getauscht ${getauscht}, Ersatz ${ersatz}, Sommer ${sommer} (${r3.wech&&r3.wech.ct}), Vertrag läuft aus ${auslauf}`);}

// Prüfung FL7: Bonus (K19k) und Tausch (K19l) werden in market() an beiden Stellen angehängt (Transferliste und Überraschung), beim Überraschungsangebot nicht für
//       unverkäufliche Spieler, und beide landen im Angebot.
{const {ev}=welt(),m=String(ev('market')),n=re=>(m.match(re)||[]).length;
  const ok=n(/bonusKI\(b,p,g\)/g)===2&&n(/tauschKI\(b,p,g\)/g)===2&&n(/if\(g\.bo\)o\.bo=g\.bo/g)===2&&n(/if\(g\.ta\)o\.ta=g\.ta/g)===2&&m.includes('if(!unverkaeuflichDu(p)){bonusKI(b,p,g);tauschKI(b,p,g);}');
  pruef(ok,'Angebote an dich: Bonus und Tausch an beiden Stellen in market(), nicht beim unverkäuflichen Spieler',ok?null:'Aufrufe in market() fehlen');}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
