// Wiederholbarkeit (K33): gleicher Seed + gleiche Eingaben = gleicher Verlauf, auch nach Speichern und Laden.
const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(__dirname,'..','index.html');
// Feste Abfolge von Eingaben und „Tag beenden“, bis Halt Nummer `bis`
const LAUF=({seed,bis,von})=>{if(!von){buildWorld(seed);S.my=6;S.mgr='Seed';setTarget();sponsOffers();S.lineup=bestXI(6,myT().form);S.__halt=0;}
  while(S.__halt<bis){const h=S.__halt++;
    if(h===2&&S.sponsOffers)pickSponsor(1);
    if(h===4){setForm('4-3-3');setTac('O');S.train=2;loan(5);startBuild('cap');}
    if(h===9){const fa=S.pl.filter(p=>p.team===-1).sort((a,b)=>b.str-a.str||a.id-b.id)[0];if(fa){openP(fa.id);offer(fa.id);closeOv();}}
    if(h===14&&S.offers.length)acceptOffer(0);
    if(S.phase==='end'){if(S.fired)takeJob(S.jobs[0]);sommerpause();continue;}
    if(S.fired)takeJob(S.jobs[0]);
    if(heuteMeinSpiel())tagesSpiele(S.tag);
    weiter();}
  const c=JSON.parse(JSON.stringify(S));return JSON.stringify(c);};
(async()=>{const b=await chromium.launch();const probleme=[];
 const lauf=async(seed,bis,neuLaden)=>{const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));await pg.goto(FILE);await pg.evaluate(()=>localStorage.clear());
  let r;if(neuLaden){await pg.evaluate(LAUF,{seed,bis:neuLaden});await pg.evaluate(()=>save());await pg.reload();await pg.evaluate(()=>loadLocal());r=await pg.evaluate(LAUF,{seed,bis,von:1});}
  else r=await pg.evaluate(LAUF,{seed,bis});if(errs.length)probleme.push('Seitenfehler: '+errs.join(' | '));await pg.close();return r;};
 const BIS=70;
 const a=await lauf(777,BIS),a2=await lauf(777,BIS),c=await lauf(778,BIS),d=await lauf(777,BIS,33);
 const info=s=>{const o=JSON.parse(s);return `Saison ${o.season}, Tag ${o.tag}, Konto ${Math.round(o.teams[o.my].cash)}, Zufall ${o.zufall.join('/')}`;};
 console.log('Lauf A, Seed 777:',info(a));
 if(a!==a2)probleme.push('Gleicher Seed, zweiter Lauf: anderer Verlauf');else console.log('Lauf B, Seed 777: identisch mit A');
 if(a===c)probleme.push('Anderer Seed (778) ergibt denselben Verlauf');else console.log('Lauf C, Seed 778: anders als A (richtig)');
 if(a!==d)probleme.push('Speichern, Neuladen und Weiterspielen nach Halt 33 ergibt anderen Verlauf');else console.log('Lauf D, Seed 777 mit Neuladen nach Halt 33: identisch mit A');
 console.log('PROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));await b.close();process.exit(probleme.length?1:0);})();
