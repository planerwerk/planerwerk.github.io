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

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
