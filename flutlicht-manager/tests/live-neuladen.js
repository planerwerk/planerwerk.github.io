// Live-Spiel neu laden (K05 §3.3, §10): Wer mitten im Spiel den Browser schließt und weiterspielt, bekommt mit denselben Eingriffen dasselbe Spiel.
// Zwei Läufe mit gleichem Seed und gleichen Eingriffen (Zuruf, Taktik, Vorspulen, Halbzeitansprache, Wechsel), einer mit Neuladen in der 60. Minute.
// Aufruf: node tests/live-neuladen.js. Braucht Playwright.
const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(__dirname,'..','index.html'),probleme=[];
async function lauf(neuladen){const b=await chromium.launch();const pg=await b.newPage();const fehler=[];pg.on('pageerror',e=>fehler.push(e.message));
  await pg.goto(FILE);await pg.evaluate(()=>localStorage.clear());await pg.reload();
  await pg.evaluate(()=>{buildWorld(4242);S.my=6;S.mgr='T';setTarget();sponsOffers();sponsorWaehlen(0);S.lineup=bestXI(6,myT().form);save();render();});
  for(let i=0;i<60&&!(await pg.$('#kick'));i++){await pg.click('header .go');await pg.waitForTimeout(40);if(await pg.$('#trotzdem'))await pg.click('#trotzdem');}
  await pg.click('#kick');await pg.evaluate(()=>liveStop());
  await pg.evaluate(()=>{for(let i=0;i<20;i++)LIVE.G.minute();liveZuruf('druck');liveTaktik('tac','O');});
  await pg.evaluate(()=>{liveSpulen('hz');liveAnsprache('motivieren');const x=LIVE.G.Ss[LIVE.s].xp.find(y=>y.pos!=='TW').p.id;liveRaus(x);liveRein(LIVE.G.bank[LIVE.s][1]);});
  await pg.evaluate(()=>{for(let i=0;i<15;i++)LIVE.G.minute();liveSichern();});
  if(neuladen){await pg.reload();await pg.waitForTimeout(300);await pg.click('button:text("Weiterspielen")');await pg.waitForTimeout(300);}
  const m=await pg.evaluate(()=>LIVE?LIVE.G.m:-1);
  await pg.evaluate(()=>{liveZuruf('ruhe');liveBisEnde();});
  const spiel=await pg.evaluate(()=>JSON.stringify([LIVE.G.sc,LIVE.G.ev,LIVE.G.wechsel,LIVE.G.pen]));
  await pg.click('#lv-weiter');const res=await pg.evaluate(()=>JSON.stringify([S.res,S.cup.hist,S.live]));await b.close();return{m,spiel,res,fehler};}
(async()=>{const a=await lauf(false),c=await lauf(true);
  if(c.m!==a.m)probleme.push(`Nach dem Neuladen steht das Spiel in Minute ${c.m} statt ${a.m}`);else console.log(`Neuladen in Minute ${c.m}: Spiel steht wieder da`);
  if(a.spiel!==c.spiel)probleme.push('Nach dem Neuladen verläuft das Spiel anders');else console.log('Gleiches Spiel mit und ohne Neuladen');
  if(a.res!==c.res)probleme.push('Nach dem Neuladen stehen andere Ergebnisse in Tabelle oder Pokal');
  [...a.fehler,...c.fehler].forEach(f=>probleme.push('Seitenfehler: '+f));
  console.log('PROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);})();
