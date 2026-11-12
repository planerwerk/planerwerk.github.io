// Lernstufen über die echte Oberfläche (K36 §10): Start als Teamleiter, gesperrte Bedienelemente sichtbar und aus, Hinweis „frei ab der …“,
// Aufstieg durch Nutzung (Startelf, Ordnung, Live-Spiel mit Wechsel), Aufstiegskarte als Halt, neu freie Bereiche in der Automatik,
// Übernehmen durch Eingreifen, Überspringen, Abschalten. Braucht Playwright. Aufruf: node tests/ui-lernstufen.js
const {chromium}=require('playwright');const path=require('path');const PRUEFUNGEN=require('./pruefungen');
const FILE='file://'+path.resolve(__dirname,'..','index.html'),probleme=[],log=[];
const note=(t)=>{probleme.push(t);console.log('PROBLEM',t);};
(async()=>{
const b=await chromium.launch();const pg=await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
pg.on('pageerror',e=>note('PAGEERR '+e.message));pg.on('console',m=>{if(m.type()==='error')note('CONSOLE '+m.text());});
await pg.goto(FILE);await pg.evaluate(()=>localStorage.clear());await pg.reload();
// Voreinstellung: mit Lernstufen
if(await pg.$eval('#lernstufen',e=>e.value)!=='1')note('Start: Lernstufen sind nicht voreingestellt');
await pg.selectOption('#club',{label:'SC Freiburg'});await pg.fill('#mgr','Lerntrainer');await pg.click('summary:text-is("Erweitert")');await pg.fill('#seed','4711');await pg.click('text=Anpfiff zur Karriere');
await pg.evaluate(PRUEFUNGEN);
const tabClick=async t=>{await pg.click(`.tabs button:text-is("${t}")`);};
const scan=async wo=>{const s=await pg.evaluate(()=>__scan());if(s)note(wo+': '+s);const e=await pg.evaluate(()=>__check());if(e.length)note(wo+' Daten: '+e.slice(0,3).join(' | '));};
let L=await pg.evaluate(()=>S.lizenz);if(!L||!L.an||L.stufe!==1)note('Start: keine Lizenz Teamleiter');
if(!(await pg.$('.lzchip')))note('Kopfzeile ohne Lizenz');if(await pg.evaluate(()=>!!S.sponsOffers))note('Sponsor nicht vom Verein gewählt');
// Gesperrtes ist sichtbar, aber aus
await tabClick('Aufstellung');
if(!(await pg.$eval('#stilsel',e=>e.disabled)))note('Spielstil ist als Teamleiter nicht gesperrt');
if(await pg.$eval('#formsel',e=>e.disabled))note('Grundordnung ist gesperrt');
if(!(await pg.$eval('#tacsel option[value="SO"]',e=>e.disabled)))note('„Sehr offensiv“ ist als Teamleiter wählbar');
if(!(await pg.evaluate(()=>/frei ab der C-Lizenz/.test(document.getElementById('app').innerText))))note('Hinweis „frei ab der C-Lizenz“ fehlt in der Aufstellung');
await scan('Aufstellung');
for(const [t,text] of [['Training & Jugend','frei ab der C-Lizenz'],['Kabine','frei ab der C-Lizenz'],['Finanzen','frei ab der A-Lizenz'],['Stadion','frei ab der Pro-Lizenz'],['Stab','frei ab der B-Lizenz'],['Transfers','frei ab der C-Lizenz']]){
  await tabClick(t);if(!(await pg.evaluate(x=>document.getElementById('app').innerText.includes(x),text)))note(`${t}: Hinweis „${text}“ fehlt`);await scan(t);}
await tabClick('Stadion');if(await pg.$('button.opt:not([disabled])'))note('Stadion: Ausbau ist als Teamleiter klickbar');
// Lizenz-Ansicht
await pg.click('.lzchip');if(!(await pg.evaluate(()=>/Weg zur C-Lizenz/.test(document.getElementById('ov').innerText))))note('Lizenz-Ansicht zeigt den Weg zur C-Lizenz nicht');await scan('Lizenz-Ansicht');await pg.evaluate(()=>closeOv());
// Aufgaben: Ordnung, Startelf
await tabClick('Aufstellung');await pg.selectOption('#formsel','4-3-3');const opts=await pg.$$eval('#slot5 option:not([disabled])',o=>o.map(x=>x.value));if(opts.length>3)await pg.selectOption('#slot5',opts[3]);
L=await pg.evaluate(()=>S.lizenz.aufgaben);if(!L.ordnung||!L.startelf)note('Aufgaben Ordnung und Startelf nicht gezählt: '+JSON.stringify(L));
// Vier Pflichtspiele: das erste live mit Wechsel bis zum Abpfiff, die übrigen sofort berechnet
const spieltag=async live=>{for(let i=0;i<80;i++){if(await pg.$('#kick'))break;await pg.click('header .go');await pg.waitForTimeout(30);if(await pg.$('#trotzdem'))await pg.click('#trotzdem');if(await pg.$('.lzkarte'))return 'karte';}
  if(!(await pg.$('#kick')))return 'kein Spiel';
  if(live){await pg.click('#kick');await pg.evaluate(()=>{liveStop();for(let i=0;i<30&&!LIVE.G.ende;i++)LIVE.G.minute();const x=LIVE.G.Ss[LIVE.s].xp.find(y=>y.pos!=='TW').p.id;liveRaus(x);liveRein(LIVE.G.bank[LIVE.s][1]);
      liveZuruf('druck');while(!LIVE.G.ende){if(LIVE.G.m===45&&!LIVE.hz){LIVE.hz=1;}LIVE.G.minute();}liveAbpfiff();});
    const zuruf=await pg.evaluate(()=>LIVE.G.rufe[LIVE.s].length);if(zuruf)note('Zuruf wirkt als Teamleiter');await pg.evaluate(()=>liveWeiter());}
  else{await pg.click('#sofort');await pg.waitForTimeout(50);await pg.evaluate(()=>{if(CONF){confEnd();closeConf();}});}
  await pg.waitForTimeout(50);return 'ok';};
let r=await spieltag(true);log.push('Spiel 1 live: '+r);
L=await pg.evaluate(()=>S.lizenz);if(!L.aufgaben.wechsel||!L.aufgaben.liveBisEnde)note('Aufgaben Wechsel und „live bis zum Abpfiff“ nicht gezählt: '+JSON.stringify(L.aufgaben));
for(let k=2;k<=4;k++){r=await spieltag(false);log.push(`Spiel ${k}: ${r}`);}
// Nach dem vierten Pflichtspiel kommt die C-Lizenz am nächsten Tag ohne eigenes Spiel, mit Karte als Halt
for(let i=0;i<12&&!(await pg.$('.lzkarte'));i++){if(await pg.$('#kick')){await pg.click('#sofort');await pg.waitForTimeout(50);await pg.evaluate(()=>{if(CONF){confEnd();closeConf();}});}else await pg.click('header .go');await pg.waitForTimeout(30);if(await pg.$('#trotzdem'))await pg.click('#trotzdem');}
L=await pg.evaluate(()=>S.lizenz);
if(L.stufe!==2||L.verlauf[1].wie!=='nutzung')note('C-Lizenz nicht durch Nutzung nach vier Pflichtspielen: '+JSON.stringify(L.verlauf));
if(!(await pg.$('.lzkarte')))note('Aufstiegskarte fehlt im Büro');else{if(await pg.$('#kick'))note('Aufstiegskarte an einem Spieltag vor dem Anpfiff');await scan('Aufstiegskarte');}
log.push('C-Lizenz: '+JSON.stringify(L.verlauf[1]));
// Neu frei, aber noch Automatik. Eingreifen übernimmt.
await pg.click('.lzkarte button:text-is("Später")');if(await pg.$('.lzkarte'))note('Aufstiegskarte lässt sich nicht schließen');
await tabClick('Aufstellung');if(await pg.$eval('#stilsel',e=>e.disabled))note('Spielstil nach der C-Lizenz noch gesperrt');
if(!(await pg.evaluate(()=>autoB('stil')&&/Automatik/.test(document.getElementById('app').innerText))))note('Neu freier Bereich steht nicht in der Automatik');
await pg.selectOption('#stilsel','pressing');if(await pg.evaluate(()=>autoB('stil')||myT().stil!=='pressing'))note('Eingreifen übernimmt den Spielstil nicht');
// Weiter gesperrt: Rollen (B), Sportgericht (A)
if(!(await pg.evaluate(()=>!frei('rollen')&&!frei('sportgericht'))))note('Rollen oder Sportgericht schon frei');
// Überspringen
await pg.click('.lzchip');await pg.click('button:text-is("Nächste Lizenz jetzt holen")');L=await pg.evaluate(()=>S.lizenz);if(L.stufe!==3||L.verlauf[2].wie!=='geholt')note('Überspringen holt die B-Lizenz nicht');await scan('Lizenz-Ansicht nach dem Überspringen');
await pg.evaluate(()=>closeOv());await tabClick('Büro');if(!(await pg.$('.lzkarte')))note('Keine Karte nach dem Überspringen');else await pg.click('.lzkarte button:text-is("Ansehen")');await pg.evaluate(()=>closeOv());
await tabClick('Stab');if(await pg.evaluate(()=>!frei('stab')))note('Stab nach der B-Lizenz gesperrt');await scan('Stab');
// Abschalten
await pg.click('.lzchip');await pg.click('button:has-text("Lernstufen abschalten")');
if(!(await pg.evaluate(()=>!S.lizenz.an&&frei('stadion')&&frei('sportgericht')&&autoB('sportgericht'))))note('Abschalten macht nicht alles frei oder nimmt die Automatik weg');
if(await pg.$('.lzchip'))note('Lizenz steht nach dem Abschalten noch in der Kopfzeile');
await pg.evaluate(()=>closeOv());await tabClick('Stadion');if(!(await pg.$('button.opt:not([disabled])')))note('Stadion nach dem Abschalten nicht bedienbar');
// Speichern und Laden behält die Lizenz, danach noch drei Wochen weiter
await pg.reload();await pg.click('button:text-is("Weiterspielen")');await pg.evaluate(PRUEFUNGEN);L=await pg.evaluate(()=>S.lizenz);if(!L||L.an||L.stufe!==3)note('Lizenz nach dem Laden verloren');
for(let i=0;i<10;i++){if(await pg.$('#kick')){await pg.click('#sofort');await pg.waitForTimeout(50);await pg.evaluate(()=>{if(CONF){confEnd();closeConf();}});}else await pg.click('header .go');await pg.waitForTimeout(30);if(await pg.$('#trotzdem'))await pg.click('#trotzdem');}
await scan('nach drei Wochen');
// Handy-Breite: Lizenz-Ansicht ohne Überlauf
await pg.setViewportSize({width:390,height:800});await pg.evaluate(()=>showLizenz());const w=await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);if(w>1)note('Lizenz-Ansicht läuft auf dem Handy über: +'+w);
console.log(log.join('\n'));console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));await b.close();process.exit(probleme.length?1:0);
})().catch(e=>{console.error('TESTFEHLER',e);process.exit(1);});
