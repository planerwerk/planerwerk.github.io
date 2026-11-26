// Regeln bleiben fest (Hinweis aus Prüfung GD, Lauf 11): Im Browser ist REGELN eingefroren (außer den Schaltern in REGELN.experimente), in den Tests seit
// 8321d87 nicht mehr (tests/sim.js setzt __REGELN_OFFEN, damit Tests Regelwerte verstellen dürfen). Ändert das Spiel selbst versehentlich einen Regelwert,
// verhielten sich Tests anders als der Browser. Dieser Test spielt Saisons ohne Eingriffe und vergleicht REGELN vorher und nachher, ohne die Schalter.
// Aufruf: node tests/regeln-fest.js [Saisons=1] [Seed=5]. Nur Node.js.
const {saisons}=require('./sim');
const N=+(process.argv[2]||1),SEED=+(process.argv[3]||5),probleme=[];
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
// Tiefe Kopie als JSON-taugliche Werte (Funktionen als Text), Schalter-Objekte aus REGELN.experimente ausgelassen
const schalter=R=>new Set((R.experimente||[]).map(x=>String(x.pfad)));
function kopie(o,pfad,aus){if(aus.has(pfad))return '(Schalter)';if(typeof o==='function')return 'fn:'+String(o).length;if(!o||typeof o!=='object')return o;
  if(Array.isArray(o))return o.map((v,i)=>kopie(v,pfad+'.'+i,aus));const r={};for(const k of Object.keys(o))r[k]=kopie(o[k],pfad?pfad+'.'+k:k,aus);return r;}
function unterschiede(a,b,pfad,out){if(out.length>=20)return;if(a===b)return;
  if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))unterschiede(a[k],b[k],pfad?pfad+'.'+k:k,out);return;}
  if(Number.isNaN(a)&&Number.isNaN(b))return;out.push(`${pfad}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);}
let vor=null;
const lauf=saisons({n:N,seed:SEED,verein:6,vorher:(F,W)=>{const R=W.ev('REGELN');vor=kopie(R,'',schalter(R));}});
const R=lauf.W.ev('REGELN'),nach=kopie(R,'',schalter(R)),diff=[];unterschiede(vor,nach,'',diff);
pruef(diff.length===0,`REGELN nach ${N} Saison(s) ohne Eingriffe unverändert (außer den Schaltern)`,diff.length?diff.join(' | '):null);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
