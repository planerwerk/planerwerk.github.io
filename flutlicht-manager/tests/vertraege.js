// Verträge (K21 §10, U10b): Forderung (Konsistenz, Alter, Söldner), Verhandlung über ein Paket (Annahmezone, Runden mit Stimmung, Pause), Prämien statt Gehalt
// (mit Abschlag nach Sicherheit), Laufzeitwunsch, Klauseln, Prämien je Spiel, Ligaklausel nach Abstieg, Ausstiegsklausel nur im Fenster, Vorvertrag (eigene Spieler und
// ablösefreier Kauf zum Sommer), Interesse beim Wechsel (K19 §5.3), Bankzeit im Vertragsjahr und bei teuren Neuzugängen (K14 §12), Lizenz für Prämien und Klauseln.
// Aufruf: node tests/vertraege.js [Seed=5]. Nur Node.js.
const {neueWelt,saisons}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %',f2=x=>x.toFixed(2),m=l=>l.length?l.reduce((a,b)=>a+b,0)/l.length:0;
const welt=(id=9)=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=id;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(id,ev('myT()').form);
  const doc=ev('document'),setz=o=>{['vt_sal','vt_hg','vt_a','vt_p','vt_t','vt_z','vt_ak','vt_lk','fee','yrs','ext'].forEach(k=>doc.getElementById(k).value=o[k]!=null?String(o[k]):'');doc.getElementById('msg').textContent='';};
  return{W,F,S,ev,doc,setz,t:ev('myT()'),V:ev('RVT')};};

// 1. Forderung (K21 §5.1, §10): gleich starke, gleich alte Spieler fordern innerhalb von ±15 %, Junge und Ältere weniger, Söldner mehr, Wechsel 10 % mehr
{const {S,ev,V}=welt();const p=JSON.parse(JSON.stringify(ev('squad')(S.my)[0]));p.age=27;p.eig=[];const forderungen=[];
  for(let i=0;i<200;i++){p.seed=i/200;forderungen.push(ev('gehaltForderung')(p,true));}const mn=Math.min(...forderungen),mx=Math.max(...forderungen);
  p.seed=0.5;const mitte=ev('gehaltForderung')(p,false),jung=ev('gehaltForderung')(Object.assign({},p,{age:22,pot:p.str}),false),alt=ev('gehaltForderung')(Object.assign({},p,{age:32}),false),soe=ev('gehaltForderung')(Object.assign({},p,{eig:['soeldner']}),false),neu=ev('gehaltForderung')(p,true);
  pruef(mx/mn<=1.15&&jung<mitte&&alt<mitte&&soe>mitte*1.15&&Math.abs(neu/mitte-V.forderung.wechsel)<0.01,'Forderung: gleich starke und gleich alte Spieler innerhalb von ±15 %, Junge und Ältere weniger, Söldner 20 % mehr, beim Wechsel 10 % mehr',`Spanne ${f2(mx/mn)}, ${jung} / ${mitte} / ${alt}, Söldner ${soe}`);}

// 2. Verlängerung (K21 §10): Zufriedene Stammspieler sagen zu einem fairen Angebot (obere Kante der Zone) zu, darunter lehnen sie ab, mit Stimmung und Pause nach drei Runden
{const w=welt(),{S,F,ev,setz,V}=w;const sq=ev('squad')(S.my);let ja=0,n=0;
  sq.forEach(p=>{if(p.st==null)return;p.st=70;const ct=p.ct;setz({ext:2});F.extend(p.id);n++;if(p.ct===2)ja++;p.ct=ct;});
  pruef(n>=15&&ja/n>=0.8,'Verlängerung: Zufriedene Spieler nehmen ein faires Angebot (obere Kante der Zone) in mindestens 80 % der Fälle an',`${ja} von ${n}`);
  const p=sq.find(q=>q.st!=null&&q.ct>=1),F0=ev('gehaltForderung')(p,false),st0=p.st=70,ct0=p.ct;p.ct=1;
  for(let i=0;i<V.runden;i++){setz({ext:2,vt_sal:F0*0.6/1e6});F.extend(p.id);}const v=ev('vtVon')(p);setz({ext:2});F.extend(p.id);
  pruef(p.ct===1&&p.st===st0+V.runden*V.rundeStimmung&&v&&v.pause===S.tag+V.vertagtTage,'Runden: Drei abgelehnte Angebote kosten je 2 Stimmung, danach ist das Gespräch vier Wochen vertagt, auch ein gutes Angebot hilft dann nicht',`Stimmung ${st0} → ${p.st}`);}

// 3. Prämien statt Gehalt (K21 §5.1a): weniger Grundgehalt mit Prämien geht, Mutige nehmen Prämien lieber als Vorsichtige. Laufzeitwunsch und Klauseln wirken.
{const {S,ev,V}=welt();const p=ev('squad')(S.my).filter(q=>q.pos==='ST').sort((a,b)=>b.str-a.str)[0],F0=ev('gehaltForderung')(p,false),wert=o=>ev('paketWert')(p,S.my,Object.assign({ct:3,sal:F0*0.8},o),F0);
  const ohne=wert({}),mitP=wert({vp:{a:5000,p:3000,t:15000}});p.ch.dru=20;const mutig=wert({vp:{a:5000,p:3000,t:15000}});p.ch.dru=2;const vorsichtig=wert({vp:{a:5000,p:3000,t:15000}});
  pruef(ohne<F0*0.9&&mitP>ohne&&mutig>vorsichtig,'Prämien statt Gehalt: Prämien heben den Wert, mutige Spieler (hohe Druckresistenz) rechnen sie höher als vorsichtige',`ohne ${Math.round(ohne)}, mutig ${Math.round(mutig)}, vorsichtig ${Math.round(vorsichtig)}`);
  const jung=Object.assign({},p,{age:21}),alt=Object.assign({},p,{age:32}),w=(q,ct)=>ev('paketWert')(q,S.my,{ct,sal:F0},F0);
  pruef(w(jung,5)<w(jung,2)&&w(alt,1)<w(alt,3),'Laufzeitwunsch: Junge wollen kurz, Ältere lang');
  const ak=wert({ak:ev('value')(p)}),lk=wert({lk:0.3});pruef(ak>ohne+F0*0.09&&lk<ohne-F0*0.04,'Klauseln: Eine Ausstiegsklausel nahe am Marktwert nimmt ihm 10 % Gehalt ab, eine Ligaklausel mit 30 % Kürzung kostet 5 % mehr');}

// 4. Prämien je Spiel (K21 §3.1): Auflauf voll oder halb, Punkt nur in der Liga ab 45 Minuten, Tor, Zu-Null für Abwehr und Torwart ab 60 Minuten
{const {S,ev,t}=welt();const sq=ev('squad')(S.my),[a,b,c,d]=[sq.find(p=>p.pos==='ST'),sq.find(p=>p.pos==='MF'),sq.find(p=>p.pos==='AB'),sq.find(p=>p.pos==='TW')];
  [a,b,c,d].forEach(p=>p.vp={a:4000,p:2000,t:10000,z:5000});
  const r={h:S.my,a:1,hg:2,ag:0,lg:t.lg,xi:[[a.id,c.id,d.id],[]],xpo:[[[a.id,'MS',0,90],[c.id,'IV',0,90],[d.id,'TW',0,90],[b.id,'ZM',0,20]],[]],ws:[[0,70,999,b.id]],ev:[{t:'G',s:0,p:a.id,m:10},{t:'G',s:0,p:a.id,m:50}]};
  S.fin={};const summe=ev('praemienNachSpiel')([r]);const soll=(4000+2000*3+2*10000)+(4000+2000*3+5000)+(4000+2000*3+5000)+4000/2; // Stürmer, Abwehr, Torwart, später eingewechselter Mittelfeldspieler
  pruef(summe===soll&&S.fin['Prämien']===-soll,'Prämien je Spiel: Auflauf voll in der Startelf, halb bei später Einwechslung, Punkte ab 45 Minuten, Tore, Zu-Null für Abwehr und Torwart',`${summe} €, erwartet ${soll} €`);
  const pokal=Object.assign({},r,{lg:null});S.fin={};const sp=ev('praemienNachSpiel')([pokal]);pruef(sp===soll-3*2000*3,'Im Pokal gibt es keine Punktprämie',`${sp} €`);}

// 5. Ligaklausel nach einem Abstieg, Ausstiegsklausel nur im Fenster
{const {S,ev,t,F}=welt();const p=ev('squad')(S.my)[2],sal=p.sal;p.lk=0.3;t.lastLg=t.lg;t.lg=t.lg+1;ev('vertraegeSaison')();t.lg=t.lastLg;
  pruef(p.sal===Math.round(sal*0.7/1000)*1000,'Ligaklausel: Nach einem Abstieg sinkt das Gehalt um die vereinbarte Kürzung',`${sal} → ${p.sal}`);
  const q=ev('squad')(S.my).sort((a,b)=>b.str-a.str)[0];q.ak=Math.round(ev('value')(q)*0.5/25000)*25000;S.teams.forEach(x=>{if(x.id!==S.my)x.cash=5e8;});const im=(k,fn)=>ev('mitStrom')(ev('strom')('ak',k),fn);
  S.tag=120;for(let i=0;i<20;i++)im('z'+i,()=>ev('vertraegeWoche')(S.tag));const zu=q.team===S.my;const c0=t.cash;S.tag=10;for(let i=0;i<20&&q.team===S.my;i++)im('o'+i,()=>ev('vertraegeWoche')(S.tag));
  pruef(zu&&q.team!==S.my&&t.cash>=c0+q.abl&&!q.ak,'Ausstiegsklausel: Außerhalb des Fensters passiert nichts, im Fenster zahlt ein größerer Verein mit Bedarf den Betrag, der Spieler geht sofort',q.team!==S.my?`${S.teams[q.team].name}, ${q.abl} €`:'nicht gezogen');}

// 6. Vorvertrag (K21 §4.3): Ohne Gespräch unterschreiben eigene Spieler im letzten halben Jahr woanders, mit Gespräch nicht. Fremde Spieler im letzten Jahr kommen ablösefrei zum Sommer.
{const {S,ev,t,F,setz}=welt();const sq=ev('squad')(S.my);sq.forEach(p=>p.ct=1);S.teams.forEach(x=>{if(x.id!==S.my)x.cash=5e8;});const im=(k,fn)=>ev('mitStrom')(ev('strom')('vv',k),fn);
  const geredet=sq.slice(0,6);S.tag=200;S.vtGespr={};geredet.forEach(p=>S.vtGespr[p.id]=S.tag);for(let i=0;i<8;i++)im('w'+i,()=>ev('vertraegeWoche')(S.tag));
  const weg=sq.filter(p=>p.wech&&p.wech.preis===0),geredetWeg=geredet.filter(p=>p.wech).length;
  pruef(weg.length>=3&&geredetWeg===0&&weg.every(p=>p.team===S.my&&p.wech.ab===ev('tageDerSaison()')),'Vorvertrag: Wer nicht über eine Verlängerung geredet hat, verliert Spieler im letzten Jahr ablösefrei zum Sommer, mit Gespräch nicht',`${weg.length} von ${sq.length-geredet.length} ohne Gespräch`);
  const q=S.pl.filter(x=>x.team>=0&&x.team!==S.my&&x.age<30).sort((a,b)=>b.str-a.str).find(x=>{x.ct=1;setz({yrs:3});F.offer(x.id);if(!x.wech&&ev('document').getElementById('msg').textContent.includes('Medizincheck')){setz({yrs:3});F.offer(x.id);}return x.wech&&x.wech.nach===S.my;});const c0=t.cash;
  pruef(q&&q.wech.preis===0&&q.wech.ab===ev('tageDerSaison()'),'Vorvertrag mit einem fremden Spieler im letzten Jahr: ohne Ablöse, Wechsel im Sommer',q&&q.n);}

// 7. Interesse beim Wechsel (K19 §5.3, §10): Stars wechseln kaum zu kleinen Vereinen, unzufriedene Spieler eher, Wechselwunsch hilft, Bindung hält
{const klein=welt(),{S,ev}=klein;const kleinId=S.teams.filter(x=>x.rep<50&&x.lg<=3).sort((a,b)=>a.rep-b.rep)[0].id;S.my=kleinId;const stars=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&p.str>=85);
  const ja=stars.filter(p=>ev('gehaltMitInteresse')(p,ev('wechselInteresse')(p))!=null).length;
  pruef(stars.length>=10&&ja/stars.length<0.05,'Stars wählerisch: Spieler ab Stärke 85 haben in weniger als 5 % der Fälle Interesse an einem Verein mit Ansehen unter 50',`${ja} von ${stars.length}`);
  S.my=9;const p=S.pl.find(x=>x.team>=0&&x.team!==9&&x.st!=null),st=p.st,ww=p.ww,ct=p.ct;p.st=70;p.ww=0;const froh=ev('wechselInteresse')(p);p.st=30;const sauer=ev('wechselInteresse')(p);p.ww=3;const wunsch=ev('wechselInteresse')(p);p.ct=4;const gebunden=ev('wechselInteresse')(p);p.st=st;p.ww=ww;p.ct=ct;
  pruef(sauer>froh&&wunsch>sauer&&gebunden<wunsch,'Interesse: unzufriedene Spieler wollen eher weg, ein Wechselwunsch noch mehr, ein langer Vertrag bindet',`${Math.round(froh)} / ${Math.round(sauer)} / ${Math.round(wunsch)} / ${Math.round(gebunden)}`);
  p.seed=0.5;const I=ev('wechselInteresse')(p);const F0=ev('gehaltForderung')(p,true),Fm=ev('gehaltMitInteresse')(p,-5),Fn=ev('gehaltMitInteresse')(p,-11);pruef(Fm>F0&&Fn==null,'Geld gleicht wenig fehlendes Interesse aus (bis −10), darunter nicht',`${F0} → ${Fm}`);}

// 8. Bankzeit (K14 §12): Im Vertragsjahr und als teurer Neuzugang wiegt der Bankplatz 1,5-mal so schwer (Söldner im Vertragsjahr doppelt), wer woanders unterschrieben hat, erwartet nichts
{const {S,ev,V}=welt();const sq=ev('squad')(S.my),p=sq.find(q=>q.pos==='MF');p.ct=3;delete p.seit;p.eig=[];const normal=ev('vertragsDruck')(p);p.ct=1;const jahr=ev('vertragsDruck')(p);p.eig=['soeldner'];const soe=ev('vertragsDruck')(p);p.eig=[];
  p.ct=3;p.seit=ev('absTag')(S.tag);p.sal=Math.max(...sq.map(q=>q.sal))+1;const teuer=ev('vertragsDruck')(p);p.wech={nach:1};
  pruef(normal===1&&jahr===V.bank.vertragsjahr&&soe===V.bank.soeldner&&teuer===V.bank.neuzugang,'Bankzeit: Vertragsjahr ×1,5, Söldner im Vertragsjahr ×2, teurer Neuzugang im ersten Jahr ×1,5',`${normal} / ${jahr} / ${soe} / ${teuer}`);
  const code=ev('bankFall').toString();pruef(code.includes("p.wech.nach!==p.team")&&code.includes('vertragsDruck'),'Bankzeit: Wer woanders unterschrieben hat, erwartet nichts mehr (Grund „weg“)');delete p.wech;}

// 9. Lizenz (K36): Prämien und Klauseln erst ab der A-Lizenz, darunter zählen die Felder nicht
{const {S,F,ev,setz}=welt();F.lizenzStart(true);const p=ev('squad')(S.my)[1];setz({vt_a:5,vt_ak:10,ext:2});const F0=ev('gehaltForderung')(p,false),o=ev('vtPaket')(p,F0,2,false);
  F.vertragDetails(p.id);pruef(!o.vp&&!o.ak&&!ev('VT_DETAIL'),'Lizenz: Prämien und Klauseln zählen erst ab der A-Lizenz, die Ansicht dafür bleibt zu');}

// 10. Zwei Saisons im Ablauf: Verträge, Prämien und Vorverträge ohne Fehler
{const fehler=[];let vorv=0;
  saisons({n:2,seed:SEED,verein:9,beiSaisonstart:(S,F)=>{const sq=F.squad?F.squad(S.my):[];},beiSaisonende:S=>{S.pl.forEach(p=>{if(p.vp&&Object.values(p.vp).some(x=>!(x>=0)))fehler.push('Prämie kaputt');if(p.wech&&!(S.wechsel||[]).includes(p.id))fehler.push('Wechsel ohne Eintrag');});
    vorv+=S.news.filter(n=>n.t.startsWith('Vorvertrag')).length;}});
  pruef(!fehler.length,'Zwei Saisons: keine kaputten Verträge oder Wechsel',fehler[0]||`${vorv} Meldungen zu Vorverträgen`);}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
// K21b. Teamprämie (K21 §3.2): ohne Lizenz für Prämien nicht setzbar; „hoch“ vor dem ersten Ligaspiel; ein Ligasieg kostet Kadergröße × Prämie, ein Remis nichts;
//       Baustein Erfolg + 2 nur bei deinem Verein; nach dem ersten Ligaspiel nicht mehr änderbar
{const {S,F,ev}=welt(),T=ev('RKA').teampraemie,t=ev('myT()'),o=S.teams.find(x=>x.lg===t.lg&&x.id!==S.my);S.phase='play';
  F.lizenzStart(true);S.lizenz.stufe=1;F.teampraemieSetzen('hoch');const gesperrt=ev('tpStufe')()==='normal';delete S.lizenz;
  F.teampraemieSetzen('hoch');const hoch=ev('tpStufe')()==='hoch',st=ev('teampraemieStimmung'),mein=st(t)===T.stimmung&&st(o)===0;
  const f0=S.fin['Prämien']||0;F.teampraemieSpiel({h:S.my,a:o.id,hg:2,ag:0});const sieg=(S.fin['Prämien']||0)-f0;F.teampraemieSpiel({h:S.my,a:o.id,hg:1,ag:1});const remis=(S.fin['Prämien']||0)-f0-sieg;
  S.tag=ev('meineLigaspiele')()[0].tag+1;F.teampraemieSetzen('normal');const fest=ev('tpStufe')()==='hoch';
  pruef(gesperrt&&hoch&&mein&&sieg===-ev('squad')(S.my).length*(T.jeSpieler[t.lg]||T.jeSpieler[3])&&remis===0&&fest,'Teamprämie: Lizenz, hoch vor dem ersten Ligaspiel, Kosten je Sieg, Stimmung nur bei dir, danach fest',
    `ohne Lizenz ${gesperrt}, hoch ${hoch}, Stimmung ${mein}, Sieg ${sieg}, Remis ${remis}, nach dem ersten Spiel fest ${fest}`);}

// K21d. Pokalprämie (K21 §4): mit „hoch“ kostet jede gewonnene Pokalrunde Kadergröße × Pokalprämie (auch im Elfmeterschießen), eine Niederlage nichts, mit „normal“ nichts
{const {S,F,ev}=welt(),T=ev('RKA').teampraemie,t=ev('myT()'),o=S.teams.find(x=>x.lg===t.lg&&x.id!==S.my),n=ev('squad')(S.my).length,je=T.pokal[t.lg]||T.pokal[3];S.phase='play';
  const k=()=>S.fin['Prämien']||0,lauf=l=>{const f0=k();F.teampraemiePokal(l);return k()-f0;};const normal=lauf([{h:S.my,a:o.id,hg:2,ag:0}]);F.teampraemieSetzen('hoch');
  const sieg=lauf([{h:o.id,a:S.my,hg:0,ag:1},{h:o.id+1,a:o.id+2,hg:1,ag:0}]),elfer=lauf([{h:S.my,a:o.id,hg:1,ag:1,pen:[5,4]}]),aus=lauf([{h:S.my,a:o.id,hg:0,ag:1}]),fremd=lauf([{h:o.id,a:o.id+1,hg:3,ag:0}]);
  pruef(normal===0&&sieg===-n*je&&elfer===-n*je&&aus===0&&fremd===0,'Pokalprämie: nur mit hoch, je gewonnene Runde, auch im Elfmeterschießen',`normal ${normal}, Sieg ${sieg}, Elfmeter ${elfer}, raus ${aus}, ohne dich ${fremd}`);}

// K21e. Aufstiegs- und Klassenerhaltsprämie (K21 §4): nur mit „hoch“; Aufstieg aus der 2. Liga kostet Kadergröße × Prämie; Klassenerhalt nur mit dem Saisonziel Klassenerhalt
//       und nicht beim Abstieg; ein anderes Saisonziel bringt nichts
{const {S,F,ev}=welt(),T=ev('RKA').teampraemie,t=ev('myT()'),n=ev('squad')(S.my).length;S.phase='play';
  const k=()=>S.fin['Prämien']||0,lauf=(auf,ab)=>{const f0=k();F.teampraemieSaison(auf,ab);return k()-f0;};const normal=lauf(true,false);F.teampraemieSetzen('hoch');
  const lg0=t.lg,ziel0=S.target;t.lg=2;const auf=lauf(true,false);t.lg=1;S.target=15;const kl=lauf(false,false),ab=lauf(false,true);S.target=4;const anders=lauf(false,false);t.lg=lg0;S.target=ziel0;
  pruef(normal===0&&auf===-n*T.aufstieg[2]&&kl===-n*T.klassenerhalt[1]&&ab===0&&anders===0,'Aufstiegs- und Klassenerhaltsprämie: nur mit hoch, Klassenerhalt nur mit diesem Ziel',
    `normal ${normal}, Aufstieg ${auf}, Klassenerhalt ${kl}, abgestiegen ${ab}, anderes Ziel ${anders}`);}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
