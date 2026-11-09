// Sommerpause und Vorbereitung (K12a §10): Halte im Sommer, Kondition beim Auftakt und zum ersten Pflichtspiel, Urlaubswahl mit Saisonbelastung.
// Spielt eine Saison mit festem Seed bis zum Saisonende und dann den Sommer mit verschiedenen Urlaubslängen. Aufruf: node tests/sommer.js [Seed=5]. Nur Node.js.
const {neueWelt}=require('./sim');
const SEED=+(process.argv[2]||5),VEREIN=6,probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const f1=x=>x.toFixed(1);
// Ein Lauf: Saison spielen, kurz vor dem Ende die Urlaubslänge setzen (optional die Saisonbelastung), dann Sommer bis zum ersten Ligaspiel der neuen Saison
function lauf(wochen,belastung){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='T';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);
  const T=S.teams[VEREIN],kader=()=>S.pl.filter(p=>p.team===VEREIN),mittel=f=>{const q=kader();return q.reduce((a,p)=>a+f(p),0)/q.length;},stamm=()=>kader().sort((a,b)=>b.apps-a.apps).slice(0,14);
  let k=0,halte=null,erg={};W.ev('setUrlaub')(wochen);
  while(k<3000){k++;
    if(S.phase==='play'&&S.season===2026&&belastung&&!erg.gesetzt&&S.tag>=S.plan.ende-70){stamm().forEach(p=>{p.sb=belastung;});erg.gesetzt=true;}
    if(S.phase==='end'){F.sommerpause();halte=0;continue;}
    if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();if(S.fired)S.fired=0;if(halte!=null)halte++;
    if(S.season===2027&&S.phase==='play'&&S.tag===W.ev('auftaktTag')(T)&&erg.auftakt==null){erg.auftakt=mittel(p=>p.ko);erg.halte=halte;erg.sb=stamm().reduce((a,p)=>a+(p.sb||0),0)/14;}
    if(S.season===2027&&S.phase==='play'&&S.res[T.lg].length>0&&erg.erstes==null)erg.erstes=mittel(p=>p.ko);
    if(S.season===2027&&S.phase==='play'&&S.res[T.lg].filter(r=>r[0]===VEREIN||r[1]===VEREIN).length>=10){erg.erholung=stamm().reduce((a,p)=>a+W.ev('belastungErholung')(p),0)/14;break;}}
  return erg;}
const drei=lauf(3);
pruef(drei.halte<=5,'Halte im Sommer: vom Saisonende bis zum Trainingsauftakt höchstens 5',drei.halte);
pruef(drei.auftakt>=65&&drei.auftakt<=75,'Kondition beim Auftakt nach 3 Wochen Urlaub und Laufplan: 65–75',f1(drei.auftakt));
pruef(drei.erstes>=80&&drei.erstes<=88,'Kondition zum ersten Ligaspiel nach der Vorbereitung: 80–88',f1(drei.erstes));
// Urlaubswahl: belastete Stammspieler (Saisonbelastung 90) erholen sich nach 2 Wochen Urlaub im Herbst langsamer als nach 4. Kurzer Urlaub bringt mehr Kondition zum Auftakt.
const zweiB=lauf(2,90),vierB=lauf(4,90);
pruef(zweiB.sb>vierB.sb+10,'Urlaubswahl: nach 2 Wochen Urlaub tragen belastete Stammspieler deutlich mehr Saisonbelastung in die neue Saison',`${f1(zweiB.sb)} gegen ${f1(vierB.sb)}`);
pruef(zweiB.erholung<vierB.erholung,'Urlaubswahl: nach 10 Ligaspielen erholen sie sich nach 2 Wochen Urlaub langsamer als nach 4',`Erholung ×${zweiB.erholung.toFixed(3)} gegen ×${vierB.erholung.toFixed(3)}`);
pruef(zweiB.auftakt>vierB.auftakt,'Urlaubswahl: kurzer Urlaub bringt mehr Kondition zum Auftakt',`${f1(zweiB.auftakt)} gegen ${f1(vierB.auftakt)}`);
console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
