// Gerüchteküche (K29 §4.3, §5.5, U17b): Anlässe, Woche im eigenen Strom (1 bis 3, höchstens eins über dich), Wirkung (Stimmung, Vertrauen, Ablöse, Gebote),
// Pressekonferenz „Gerüchte“, Treffsicherheit nach 30 Tagen, 20 Wochen im Ablauf.
// Aufruf: node tests/geruechte.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U17b entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711,nah=(a,b,e=0.01)=>Math.abs(a-b)<=e*Math.max(1,Math.abs(b));
function welt(){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);S.phase='play';
  return{W,F,S,ev:W.ev,t:W.ev('myT()')};}
const fremd=w=>w.S.pl.find(p=>p.team>=0&&p.team!==VEREIN&&w.S.teams[p.team].lg===1&&!p.leihe&&!p.wech);

// 1. Anlässe: deine Verhandlung und ein unzufriedener Spieler
{const w=welt(),{F,S,ev}=w,p=fremd(w),q=ev('squad')(VEREIN)[0];S.verh={[p.id]:{team:p.team,f:5e6,r:1,g:3,pause:-1,druck:-999}};q.ww=2;
  const K=F.gerKandidaten();pruef(K.mein.some(c=>c.art==='verhandlung'&&c.pid===p.id&&c.w===1)&&K.mein.some(c=>c.art==='unzufrieden'&&c.pid===q.id),'Anlässe: deine Verhandlung (wahr) und ein Spieler mit Wechselwunsch Stufe 2',K.mein.map(c=>c.art).join(', '));}

// 2. Woche: 1 bis 3 Gerüchte, höchstens eins über deinen Verein, der Grundstrom bleibt unberührt
{const w=welt(),{F,S,ev}=w,mit=ev('mitStrom'),st=ev('strom');let ok=true,txt=[];
  for(let k=0;k<12;k++){const vor=F.gerS().l.length,z0=JSON.stringify(S.zufall);mit(st('geruechte',S.season,k),()=>F.geruechteWoche());const neu=F.gerS().l.slice(vor);S.pk=null;
    if(neu.length<1||neu.length>3||neu.filter(g=>g.mein).length>1||JSON.stringify(S.zufall)!==z0)ok=false;txt.push(neu.length);S.tag+=7;}
  pruef(ok,'Woche: 1 bis 3 Gerüchte, höchstens eins über dich, Grundstrom unberührt',txt.join(' '));}

// 3. Wirkung: unzufrieden −3 Stimmung, Trainergerücht −2 Vertrauen, bekanntes Interesse hebt Forderung (×1,1) und Gebote (×1,15)
{const w=welt(),{F,S,ev}=w,q=ev('squad')(VEREIN)[1],p=fremd(w),st=ev('stimmung');q.st=50;S.trust=50;
  F.gerVeroeffentlichen({art:'unzufrieden',tid:VEREIN,pid:q.id,w:1});S.pk=null;F.gerVeroeffentlichen({art:'trainer',tid:VEREIN,w:1});S.pk=null;
  const f0=ev('forderungDu')(p);F.gerVeroeffentlichen({art:'verhandlung',tid:p.team,klub:VEREIN,pid:p.id,w:1});S.pk=null;const f1=ev('forderungDu')(p);
  const r=ev('squad')(VEREIN)[2],b=S.teams.find(x=>x.lg===1&&x.id!==VEREIN),mit=ev('mitStrom'),sm=ev('strom'),g0=mit(sm('t','g'),()=>F.gebotFuer(b,r,null));
  F.gerVeroeffentlichen({art:'interesse',tid:VEREIN,pid:r.id,w:0.5});S.pk=null;const g1=mit(sm('t','g'),()=>F.gebotFuer(b,r,null));
  pruef(st(q)===47&&S.trust===48&&nah(f1/f0,1.1,0.02)&&nah(g1.amt/g0.amt,1.15,0.03),'Wirkung: Stimmung −3, Vertrauen −2, Forderung ×1,1, Gebot ×1,15',`${st(q)}, ${S.trust}, ${(f1/f0).toFixed(3)}, ${(g1.amt/g0.amt).toFixed(3)}`);}

// 4. Gerücht über deinen Verein bringt die Pressekonferenz „Gerüchte“ mit dem Medium in der Frage
{const w=welt(),{F,S}=w,q=w.ev('squad')(VEREIN)[0];F.gerVeroeffentlichen({art:'absprung',tid:VEREIN,pid:q.id,w:0});
  pruef(!!S.pk&&S.pk.art==='geruecht'&&!!S.pk.medium,'Pressekonferenz: Ein Gerücht über deinen Verein bringt den Anlass „Gerüchte“ mit Medium',S.pk?`${S.pk.art}, ${S.pk.medium}`:'keine');}

// 5. Treffsicherheit nach 30 Tagen: Wechsel trat ein +3, erfundenes Trainer-Aus ohne Wechsel −3
{const w=welt(),{F,S}=w,p=fremd(w),t=S.teams.find(x=>x.lg===2);F.trainerS();const P=F.gerS();P.ruf.fach=60;P.ruf.boulevard=40;
  F.gerVeroeffentlichen({art:'liste',tid:p.team,pid:p.id,w:1,m:'fach'});const g1=P.l[P.l.length-1];g1.m='fach';
  F.gerVeroeffentlichen({art:'trainerAus',tid:t.id,w:0});const g2=P.l[P.l.length-1];g2.m='boulevard';S.pk=null;
  p.team=S.teams.find(x=>x.lg===3).id;S.tag+=31;F.gerPruefen();
  pruef(g1.r===1&&g2.r===0&&P.ruf.fach===63&&P.ruf.boulevard===37,'Treffsicherheit: eingetretener Wechsel +3 für das Fachblatt, falsches Trainer-Aus −3 für den Boulevard',`${g1.r}/${g2.r}, Fachblatt ${P.ruf.fach}, Boulevard ${P.ruf.boulevard}`);}

// 6. 20 Wochen im Ablauf ohne Fehler, Zahl der Gerüchte plausibel
{const w=welt(),{W,F}=w;let fehler='',n=0;try{while(n<400&&W.S.tag<140){n++;if(W.S.sponsOffers)F.sponsorWaehlen(0);if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(W.S.tag);F.weiter();}}catch(e){fehler=e.message;}
  const l=F.gerS().l,wochen=Math.max(1,Math.floor((W.S.tag)/7));
  pruef(!fehler&&l.length>=wochen&&l.length<=3*wochen+3,'Ablauf: 20 Wochen ohne Fehler, ein bis drei Gerüchte je Woche',fehler||`${l.length} Gerüchte in etwa ${wochen} Wochen, über dich ${l.filter(g=>g.mein).length}`);}

// K29c. Beziehung zu den Medien: Mit allen fünf Medien verärgert (−30) trifft ein Gerücht über dich als Trainer das Vertrauen 1,5-mal so stark, gewogen (+30) halb so stark
{const w=welt(),{S,F,ev}=w,W=ev('RGR').wirkung,E=ev('REGELN').exklusiv,alle=v=>{S.mb={};['boulevard','fach','tv','portal','lokal'].forEach(k=>S.mb[k]=v);};
  alle(E.grenzen[0]);S.trust=50;F.gerVeroeffentlichen({art:'trainerAus',tid:S.my,w:0});const boese=S.trust-50;alle(E.grenzen[1]);S.trust=50;F.gerVeroeffentlichen({art:'trainerAus',tid:S.my,w:0});const gut=S.trust-50;
  pruef(nah(boese,W.vertrauen*E.wirkung[1])&&nah(gut,W.vertrauen*E.wirkung[0]),'Gerücht über dich wirkt nach der Beziehung zum Medium',`verärgert ${boese}, gewogen ${gut} (Grundwert ${W.vertrauen})`);}

// K17d. Klatsch und Tratsch (K17 §5.2, §5.3): Bei einer Beziehung unter −30 gibt es „soll dort ein Thema sein“ mit einem Spieler, den der Verein brauchen könnte.
//       Gerüchte über dich kommen doppelt so oft, der Spieler fühlt sich begehrt oder wird unruhig. Ohne schlechte Beziehung nichts davon.
{const {S,F,ev}=welt(),G=ev('RGR'),k0=ev('gerKlatschFaktor')(),ohne=F.gerKandidaten().mein.filter(c=>c.art==='thema').length;
  const k=S.teams.find(x=>x.id!==S.my&&ev('aktiv')(x)&&ev('squad')(S.my).some(p=>ev('hatBedarf')(x,p)));F.bezDuAendern(k.id,-90,'Test');const k1=ev('gerKlatschFaktor')();
  const c=F.gerKandidaten().mein.find(x=>x.art==='thema'&&x.klub===k.id),p=c&&ev('PIX').get(c.pid);let d=null;
  if(p){ev('stimmung')(p);p.st=50;F.gerVeroeffentlichen(Object.assign({},c,{w:1}));d=p.st-50;}
  pruef(k0===1&&ohne===0&&k1===G.klatsch.mein&&!!p&&ev('hatBedarf')(k,p)&&d!==0&&d!=null&&S.ger.l.some(g=>g.art==='thema'&&g.pid===p.id&&g.mein===1),
    'Klatsch: Thema-Gerücht bei schlechter Beziehung, Gerüchte über dich doppelt so oft, Stimmung ändert sich',`Faktor ${k0} → ${k1}, ohne Ärger ${ohne}, Spieler ${p&&p.n}, Stimmung ${d}`);}

// K29n. Gehaltsforderung bei bekanntem Interesse (K29 §5.5): Solange p.gerF gilt, fordert ein Spieler beim Wechsel wirkung.gehalt mehr; die Verlängerung bleibt, abgelaufen nichts.
{const {S,ev}=welt(),G=ev('RGR').wirkung,gf=ev('gehaltForderung'),a=ev('absTag')(S.tag),p=S.pl.find(x=>x.team>=0&&x.team<1000&&x.team!==S.my&&x.str>=60);delete p.gerF;
  const w0=gf(p,true),v0=gf(p,false);p.gerF={f:G.preis.wahr,bis:a+5};const w1=gf(p,true),v1=gf(p,false);p.gerF.bis=a-1;const w2=gf(p,true);delete p.gerF;
  const hoeher=Math.abs(w1-w0*(1+G.gehalt))<=1100&&w1>w0; /* beide auf 1.000 gerundet */
  pruef(hoeher&&v1===v0&&w2===w0,'Gehaltsforderung bei bekanntem Interesse: beim Wechsel höher, Verlängerung gleich, abgelaufen wie vorher',`Wechsel ${w0} → ${w1}, Verlängerung ${v0}/${v1}, abgelaufen ${w2}`);}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
