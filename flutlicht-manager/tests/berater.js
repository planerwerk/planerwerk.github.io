// Berater (K22 §10, U10c): Anteil mit Berater, Profile, Forderungsfaktor mit Beziehung, Provision, Beziehung durch Abschlüsse, Einladung, Verblassen,
// Tipps ab +40, Angebote und Rat ab +60, Warnung vor einem Vorvertrag, gute Beziehung senkt die Kosten, Lizenz, gleiche Welt.
// Aufruf: node tests/berater.js [Seed=5]. Nur Node.js.
const {neueWelt}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %',f2=x=>x.toFixed(2),m=l=>l.length?l.reduce((a,b)=>a+b,0)/l.length:0;
const welt=(id=9)=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=id;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(id,ev('myT()').form);
  const doc=ev('document'),setz=o=>{['vt_sal','vt_hg','vt_a','vt_p','vt_t','vt_z','vt_ak','vt_lk','fee','yrs','ext'].forEach(k=>doc.getElementById(k).value=o[k]!=null?String(o[k]):'');doc.getElementById('msg').textContent='';};
  return{W,F,S,ev,doc,setz,t:ev('myT()'),B:ev('RBE')};};

// 1. Anteil mit Berater (K22 §10): 55–65 % der Profis, über 90 % der Spieler ab Stärke 80. Familienberater nur bei jungen Spielern. Fest je Spieler.
{const {S,ev,B}=welt();const pl=S.pl.filter(p=>p.team>=0),bv=ev('beraterVon'),mit=pl.filter(p=>bv(p)),stars=pl.filter(p=>Math.max(p.str,p.pot)>=B.starsAb),fam=mit.filter(p=>bv(p).prof==='familie');
  const fest=pl.slice(0,200).every(p=>bv(p)===bv(p));
  pruef(mit.length/pl.length>=0.55&&mit.length/pl.length<=0.65&&stars.filter(p=>bv(p)).length/stars.length>0.9&&fam.every(p=>p.age<=B.familieBis)&&fest&&S.ber.length===B.anzahl,
    'Anteil: 55–65 % der Profis haben einen Berater, über 90 % der Stars, Familienberater nur bis 23, die Zuordnung ist fest',`${pc(mit.length/pl.length)}, Stars ${pc(stars.filter(p=>bv(p)).length/stars.length)}`);}

// 2. Forderung (K22 §5): Profil (gierig ×1,15 gegen seriös), Beziehung −2 % je 20 Punkte, höchstens ±10 %
{const {S,ev,B}=welt();const p=S.pl.find(q=>q.team>=0&&ev('beraterVon')(q)),b=ev('beraterVon')(p),prof=b.prof;b.bz=0;
  b.prof='serioes';const s0=ev('beraterFaktor')(p);b.prof='gierig';const g0=ev('beraterFaktor')(p);b.prof='serioes';b.bz=60;const gut=ev('beraterFaktor')(p);b.bz=-100;const schlecht=ev('beraterFaktor')(p);b.bz=100;const sehrGut=ev('beraterFaktor')(p);b.prof=prof;b.bz=0;
  pruef(s0===1&&Math.abs(g0-1.15)<1e-9&&Math.abs(gut-0.94)<1e-9&&Math.abs(schlecht-1.1)<1e-9&&Math.abs(sehrGut-0.9)<1e-9,'Forderung: gierig ×1,15, Beziehung +60 senkt um 6 %, höchstens ±10 %',`${f2(g0)} / ${f2(gut)} / ${f2(sehrGut)} / ${f2(schlecht)}`);}

// 3. Provision und Beziehung beim Abschluss: zügig +5 und Provision gebucht, drei abgelehnte Runden −5, wechselwilligen Mandanten verkaufen +8
{const {S,F,ev,setz,t,B}=welt();const p=ev('squad')(S.my).find(q=>ev('beraterVon')(q)&&q.st!=null),b=ev('beraterVon')(p);p.st=70;b.bz=0;S.fin={};setz({ext:2});F.extend(p.id);
  const prov=-(S.fin['Beraterprovision']||0);pruef(p.ct===2&&b.bz===B.beziehung.zuegig&&prov===Math.round(p.sal*b.prov/1000)*1000, /* Provision bei Beziehung 0 vor dem Abschluss */'Zügige Verlängerung: Provision (Anteil am Jahresgehalt) wird gebucht, die Beziehung steigt um 5',`${prov} €`);
  const q=ev('squad')(S.my).find(x=>x!==p&&ev('beraterVon')(x)&&x.st!=null),bq=ev('beraterVon')(q);q.st=70;const bz0=bq.bz,F0=ev('gehaltForderung')(q,false);
  for(let i=0;i<3;i++){setz({ext:2,vt_sal:F0*0.5/1e6});F.extend(q.id);}pruef(bq.bz===bz0+B.beziehung.hart,'Drei abgelehnte Runden: Beziehung −5',`${bz0} → ${bq.bz}`);
  const r=ev('squad')(S.my).find(x=>x!==p&&x!==q&&ev('beraterVon')(x)&&x.pos!=='TW'),br=ev('beraterVon')(r),bz1=br.bz;r.ww=3;S.tag=10;S.offers=[{pid:r.id,tid:S.teams.find(x=>x.id!==S.my&&x.lg===1).id,amt:1e6,max:1e6,r:0,bis:S.tag+5}];F.acceptOffer(0);
  pruef(br.bz===bz1+B.beziehung.wunschVerkauf,'Einen wechselwilligen Mandanten ziehen lassen: Beziehung +8',`${bz1} → ${br.bz}`);}

// 4. Einladung (einmal im Monat, +3, kostet Geld), Verblassen zum Saisonwechsel, Lizenz
{const {S,F,ev,t,B}=welt();const b=ev('beraterListe()')[0];b.bz=10;const c0=t.cash;F.beraterEinladen(b.id);const nach1=b.bz,c1=t.cash;F.beraterEinladen(b.id);const nach2=b.bz;S.tag+=B.einladung.tage;F.beraterEinladen(b.id);
  pruef(nach1===13&&c1===c0-B.einladung.kosten&&nach2===13&&b.bz===16,'Einladung: +3 Beziehung für 5.000 €, höchstens einmal im Monat',`${nach1}, ${nach2}, ${b.bz}`);
  b.bz=40;ev('beraterSaison')();pruef(b.bz===30,'Verblassen: Jede Saison geht ein Viertel der Beziehung zurück',b.bz);
  const w=welt();w.F.lizenzStart(true);const x=w.ev('beraterListe()')[0],bz=x.bz;w.F.beraterEinladen(x.id);pruef(x.bz===bz,'Lizenz: Einladen erst ab der B-Lizenz');}

// 5. Ab +40 Tipps zu unzufriedenen Mandanten (mit Kenntnis 50), ab +60 Angebote im Fenster und ein Rat an den Spieler (+5 Interesse), dazu die Warnung vor einem Vorvertrag
{const {S,F,ev,t,B}=welt();const fremd=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&ev('beraterVon')(p)),b=ev('beraterVon')(fremd[0]),seine=fremd.filter(p=>ev('beraterVon')(p)===b);
  seine.forEach(p=>{p.ww=2;});b.bz=45;S.tag=100;const im=(k,fn)=>ev('mitStrom')(ev('strom')('tipp',k),fn);for(let i=0;i<40;i++)im(i,()=>ev('beraterWoche')(S.tag));
  const tipps=S.news.filter(n=>n.t.startsWith('Tipp von Berater')).length,gewusst=seine.filter(p=>ev('kenntnis')(p)>=B.tippKenntnis).length;
  pruef(tipps>=1&&gewusst>=1,'Tipps ab +40: Der Berater nennt unzufriedene Mandanten, die Kenntnis steigt auf 50',`${tipps} Tipps`);
  const p=seine[0];b.bz=0;const i0=ev('wechselInteresse')(p);b.bz=60;const i1=ev('wechselInteresse')(p);pruef(i1-i0===B.beziehung.interesse,'Ab +60 rät er seinem Spieler zu dir: +5 Interesse',`${Math.round(i0)} → ${Math.round(i1)}`);
  // Warnung vor einem Vorvertrag: Beim ersten Mal warnt er, statt dass der Spieler unterschreibt
  const eig=ev('squad')(S.my).filter(q=>ev('beraterVon')(q));eig.forEach(q=>{q.ct=1;ev('beraterVon')(q).bz=80;});S.teams.forEach(x=>{if(x.id!==S.my)x.cash=5e8;});S.tag=200;S.vtGespr={};
  for(let i=0;i<3;i++)ev('mitStrom')(ev('strom')('vv',i),()=>ev('vertraegeWoche')(S.tag));const warn=S.news.filter(n=>n.t.includes('warnt dich')).length,weg=eig.filter(q=>q.wech).length;
  pruef(warn>=1&&weg<=eig.length-warn,'Warnung ab +60: Bevor ein Mandant woanders einen Vorvertrag unterschreibt, warnt der Berater (einmal je Saison)',`${warn} Warnungen, ${weg} trotzdem weg`);}

// 6. Gute Beziehung lohnt (K22 §10): Über +60 sinken die Kosten eines Transfers (Ablöse, drei Jahresgehälter, Provision) im Schnitt um 3–6 %
{const {S,ev}=welt();const l=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&ev('beraterVon')(p)).slice(0,150),ersparnis=[];
  l.forEach(p=>{const b=ev('beraterVon')(p),bz=b.bz,fee=ev('askPrice')(p),kosten=()=>{const sal=ev('gehaltForderung')(p,true);return fee+3*sal+ev('beraterProvision')(p,sal,fee);};
    b.bz=0;const k0=kosten();b.bz=70;const k1=kosten();b.bz=bz;ersparnis.push(1-k1/k0);});
  const e=m(ersparnis);pruef(e>=0.03&&e<=0.06,'Gute Beziehung (+70) senkt die Kosten eines Transfers im Schnitt um 3–6 %',pc(e));}

// 7. Gleiche Welt: Die Berater ändern den Zufall der übrigen Welt nicht (eigener Strom, Zuordnung ohne Zufallszahl)
{const a=welt(),b=welt();a.ev('beraterListe()');a.S.pl.forEach(p=>a.ev('beraterVon')(p));pruef(JSON.stringify(a.S.zufall)===JSON.stringify(b.S.zufall),'Gleiche Welt: Berater und Mandanten verbrauchen keinen Zufall aus dem Grundstrom');}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
