// Erinnerungen vor „Tag beenden“ (K01, kalender.js erinnerungen): Einzelfälle, die neu dazukommen. Aufruf: node tests/erinnerungen.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. Es entstand am 22.11.2026 (K09b) auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const SEED=4711;

// K09b. Gelbsperre droht (K09 §12 Nr. 14): am Ligaspieltag vor einem Derby nennt die Erinnerung den Spieler der Startelf mit 4 Gelben (die 5. sperrt),
//       mit 3 Gelben nicht, abgeschaltet nicht
{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev,derby=ev('istDerby');
  // ein Verein der 1. Liga mit einem Derby-Gegner in derselben Liga
  const l1=S.teams.filter(t=>t.lg===1),paar=(()=>{for(const a of l1)for(const b of l1)if(a.id!==b.id&&derby(a.id,b.id))return[a.id,b.id];return null;})();
  let ok=false,info='kein Derby in der 1. Liga gefunden';
  if(paar){S.my=paar[0];S.mgr='Test';F.setTarget();F.sponsOffers();if(S.sponsOffers)F.sponsorWaehlen(0);S.lineup=F.bestXI(S.my,ev('myT()').form);
    const l=ev('meineLigaspiele')(),i=l.findIndex((e,k)=>k>0&&ev('pkGegner')(e)===paar[1]);
    if(i>0){S.tag=l[i-1].tag;S.gespielt=-1;const p=ev('squad')(S.my).find(x=>ev('myXI')().includes(x.id)),k=ev('gelbe')(p);
      const hat=()=>F.erinnerungen().some(e=>e.art==='gelbsperre'&&e.text.includes(p.n));
      k.liga=4;const vier=hat();k.liga=3;const drei=hat();k.liga=4;F.erinnerungAus('gelbsperre',true);const aus=hat();F.erinnerungAus('gelbsperre',false);
      ok=vier&&!drei&&!aus;info=`4 Gelbe ${vier}, 3 Gelbe ${drei}, abgeschaltet ${aus}`;}
    else info='kein Derby nach einem Ligaspiel im Spielplan';}
  pruef(ok,'Gelbsperre droht: Erinnerung am Ligaspieltag vor einem Derby, nur bei 4 Gelben, abschaltbar',info);}

// K07b. Plan passt nicht (K07 §5 Nr. 4): drei Spieler der Startelf mit Belastungssprung über 1,5 lösen die Erinnerung aus, zwei nicht; abgeschaltet nicht
{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=6;S.mgr='Test';F.setTarget();F.sponsOffers();if(S.sponsOffers)F.sponsorWaehlen(0);S.lineup=F.bestXI(S.my,ev('myT()').form);
  ev('myT()').vorlage='auto';const E=ev('RT').planErinnerung,xi=ev('myXI')(),sq=ev('squad')(S.my).filter(p=>xi.includes(p.id));sq.forEach(p=>{p.la=0;p.lc=0;});
  const plan=()=>F.erinnerungen().some(e=>e.art==='plan');sq.slice(0,E.spielerAb-1).forEach(p=>{p.la=10;p.lc=2;});const zwei=plan();sq[E.spielerAb-1].la=10;sq[E.spielerAb-1].lc=2;const drei=plan();
  F.erinnerungAus('plan',true);const aus=plan();F.erinnerungAus('plan',false);
  pruef(!zwei&&drei&&!aus,'Plan passt nicht: ab drei Spielern mit Belastungssprung, abschaltbar',`zwei ${zwei}, drei ${drei}, abgeschaltet ${aus}`);}

// K11d. Spielfreie Woche ohne Testspiel (K01 H9): in der Saison an einem Tag, nach dem sieben Tage (ab dem frühesten Testspieltag) ohne Pflichtspiel kommen;
//       höchstens einmal je Woche; nicht mit einem Testspiel in dieser Zeit; nicht vor einem Spiel; abgeschaltet nicht
{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=6;S.mgr='Test';F.setTarget();F.sponsOffers();if(S.sponsOffers)F.sponsorWaehlen(0);S.lineup=F.bestXI(S.my,ev('myT()').form);
  const R0=ev('RTS'),l=ev('meineLigaspiele')(),sf=()=>F.erinnerungen().some(e=>e.art==='spielfrei'),von=x=>x+R0.vorlaufTage,bis=x=>x+R0.vorlaufTage+R0.spielfrei.tage-1;
  const ohneSpiel=x=>{for(let y=von(x);y<=bis(x);y++)if(ev('meinSpiel')(y))return false;return true;};
  let d=null;for(let x=l[0].tag+1;x<l[l.length-1].tag&&d==null;x++){S.tag=x;if(ohneSpiel(x)&&ev('testspielTage')().some(y=>y>=von(x)&&y<=bis(x)))d=x;}
  let ok=false,info='keine spielfreie Woche in der Saison gefunden';
  if(d!=null){S.tag=d;S.gespielt=-1;delete S.tsEr;const ja=sf(),nochmal=sf();delete S.tsEr;
    const t=ev('testspielTage')().find(y=>y>=von(d)&&y<=bis(d));S.testspiele=[{id:999,tag:t,gegner:1000,heim:false,stand:'zugesagt'}];const mitTest=sf();S.testspiele=[];delete S.tsEr;
    S.tag=l[1].tag-R0.vorlaufTage-1;const vorSpiel=sf();delete S.tsEr;S.cup.alive=S.cup.alive.filter(x=>x!==S.my);S.tag=l[l.length-1].tag;const letzter=sf();delete S.tsEr; /* letzter Spieltag ohne Pokalfinale: keine Erinnerung (DZ1) */S.tag=d;F.erinnerungAus('spielfrei',true);const aus=sf();F.erinnerungAus('spielfrei',false);
    ok=ja&&!nochmal&&!mitTest&&!vorSpiel&&!letzter&&!aus;info=`Tag ${d}: Erinnerung ${ja}, gleich nochmal ${nochmal}, mit Testspiel ${mitTest}, vor einem Spiel ${vorSpiel}, letzter Spieltag ${letzter}, abgeschaltet ${aus}`;}
  pruef(ok,'Spielfreie Woche ohne Testspiel: Erinnerung in der Saison, einmal je Woche, nicht mit Testspiel, nicht vor einem Spiel, abschaltbar',info);}

// K07d. Lernplatz frei (K07 §8): ein freier Platz im Einzeltraining gibt eine Erinnerung, höchstens einmal je Woche; alle Plätze belegt keine; abgeschaltet keine
{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=6;S.mgr='Test';F.setTarget();S.phase='play';const sq=ev('squad')(S.my),n=ev('lernPlaetze')(S.my);
  const lp=()=>F.erinnerungen().some(e=>e.art==='lernplatz');sq.forEach(p=>{p.ls=null;p.um=null;});delete S.lpEr;const ja=lp(),nochmal=lp();
  delete S.lpEr;sq.slice(0,n).forEach(p=>{p.ls={k:'test',f:0};});const voll=lp();sq.forEach(p=>{p.ls=null;});delete S.lpEr;F.erinnerungAus('lernplatz',true);const aus=lp();F.erinnerungAus('lernplatz',false);
  pruef(ja&&!nochmal&&!voll&&!aus,'Lernplatz frei: Erinnerung bei freiem Platz, einmal je Woche, nicht bei vollen Plätzen, abschaltbar',`frei ${ja}, gleich nochmal ${nochmal}, voll ${voll}, abgeschaltet ${aus} (${n} Plätze)`);}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
