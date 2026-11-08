// Zufallsströme (K02 §10.3): Handlungen in einem Bereich ändern die Würfe anderer Bereiche nicht.
// Zwei Welten mit gleichem Seed. In Welt B werden vor dem 1. Spieltag zusätzlich Zufallszahlen aus dem Grundstrom gezogen,
// so wie es eine Handlung des Spielers tun würde. Die Spielergebnisse müssen trotzdem gleich sein.
const {neueWelt,kennzahlen}=require('./sim');
const probleme=[];
function lauf(extra){const {W,F}=neueWelt();F.buildWorld(4242);const S=W.S;S.my=6;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(6,W.ev('myT()').form);
  let n=0,gezogen=false;
  while(n<400&&W.S.phase!=='end'){n++;
    if(!gezogen&&W.S.res[1].length===0&&W.ev('heuteMeinSpiel()')){if(extra)for(let i=0;i<extra;i++)W.ev('R()');gezogen=true;}
    if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(W.S.tag);
    F.weiter();if(W.S.fired)break;}
  return {res:JSON.stringify(W.S.res),k:kennzahlen(W.S),zufall:W.S.zufall.join('/')};}
const a=lauf(0),b=lauf(25);
if(a.zufall===b.zufall)probleme.push('Grundstrom unverändert, obwohl Welt B zusätzlich gewürfelt hat (Test wirkungslos)');
if(a.res!==b.res)probleme.push('Zusätzliche Würfe im Grundstrom haben Spielergebnisse verändert');
else console.log(`Gleiche Ergebnisse trotz zusätzlicher Würfe (1. Liga: ${a.k[1]?a.k[1].spiele:0} Spiele, ${a.k[1]?a.k[1].tore.toFixed(2):'–'} Tore pro Spiel)`);
console.log('PROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
