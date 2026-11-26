// Desktop-App (Ordner desktop/, Electron, 26.11.): startet die App unter Linux mit Playwright und prüft das, was sie vom Browser unterscheidet.
// 1. Das Spiel läuft im App-Fenster ohne Seitenfehler und ohne Zugriff auf Node (kein require, kein process).
// 2. Der Spielstand landet als Datei im Datenordner der App, genau wie JSON.stringify(S), und nicht im localStorage.
// 3. Nach dem Neustart bietet die App „Weiterspielen“ an und lädt denselben Stand.
// 4. Keine Größengrenze: ein Spielstand mit 8 Mio. Zeichen wird gespeichert (der Browser nimmt etwa 5,2 Mio.).
// 5. Kaputte Datei (zum Beispiel Strom weg beim Schreiben): Die App nimmt die Kopie vom vorigen Speichern.
// 6. Das Menü nennt die Datei statt des Browser-Speichers, die Erinnerung zum Saisonende entfällt.
// Vorher: cd desktop && npm install && node kopieren.js. Unter Linux ohne Bildschirm mit xvfb-run: xvfb-run -a node tests/desktop.js
const {_electron:electron}=require('playwright');const path=require('path');const fs=require('fs');const os=require('os');
const DESK=path.resolve(__dirname,'..','desktop'),probleme=[],ok=t=>console.log('✓ '+t),fehl=t=>{probleme.push(t);console.log('✗ '+t);};
if(!fs.existsSync(path.join(DESK,'node_modules','electron'))||!fs.existsSync(path.join(DESK,'spiel','index.html'))){console.log('Übersprungen: erst cd desktop && npm install && node kopieren.js');process.exit(0);}
const daten=fs.mkdtempSync(path.join(os.tmpdir(),'flutlicht-app-')),datei=path.join(daten,'spielstaende','flutlicht-manager-v4.json');
const start=()=>electron.launch({executablePath:require(path.join(DESK,'node_modules','electron')),args:[DESK,'--no-sandbox'],env:Object.assign({},process.env,{FLUTLICHT_DATEN:daten})});
(async()=>{let app=await start(),pg=await app.firstWindow();const seitenfehler=[];pg.on('pageerror',e=>seitenfehler.push(e.message));await pg.waitForLoadState('domcontentloaded');await pg.waitForTimeout(500);
  // 1
  const titel=await pg.title();if(/Flutlicht/.test(titel))ok('App-Fenster zeigt das Spiel: '+titel);else fehl('Fenstertitel unerwartet: '+titel);
  const node=await pg.evaluate(()=>[typeof require,typeof process,typeof window.flutlichtApp]);
  if(node[0]==='undefined'&&node[1]==='undefined')ok('Kein Zugriff auf Node im Spielfenster');else fehl('Spielfenster hat Zugriff auf Node: '+node.join(', '));
  if(node[2]==='object')ok('Brücke window.flutlichtApp vorhanden');else fehl('Brücke window.flutlichtApp fehlt');
  // 2
  await pg.evaluate(()=>{buildWorld(4242);S.my=6;S.mgr='App';setTarget();sponsOffers();sponsorWaehlen(0);S.lineup=bestXI(6,myT().form);save();render();});
  for(let i=0;i<3;i++){await pg.click('header .go');await pg.waitForTimeout(60);if(await pg.$('#trotzdem'))await pg.click('#trotzdem');}
  const stand=await pg.evaluate(()=>{save();return JSON.stringify(S);});
  if(fs.existsSync(datei)&&fs.readFileSync(datei,'utf8')===stand)ok(`Spielstand als Datei gespeichert (${Math.round(stand.length/1024)} KB)`);else fehl('Spielstand-Datei fehlt oder weicht ab');
  if(!(await pg.evaluate(()=>localStorage.getItem(REGELN.spielstand.schluessel))))ok('Nicht im localStorage');else fehl('Spielstand steht auch im localStorage');
  // 6
  await pg.evaluate(()=>menu());const kopf=await pg.textContent('.ov h3:has-text("Spielstand sichern")');
  if(/als Datei auf diesem Rechner/.test(kopf))ok('Menü nennt die Datei: '+kopf.trim());else fehl('Menü nennt nicht die Datei: '+kopf);
  await pg.evaluate(()=>closeOv());
  const vorher=await pg.evaluate(()=>S.news.length);await pg.evaluate(()=>sicherungErinnern());
  if((await pg.evaluate(()=>S.news.length))===vorher)ok('Keine Erinnerung zum Sichern in der App');else fehl('App erinnert ans Sichern, obwohl der Stand als Datei liegt');
  await pg.evaluate(()=>save());const gespeichert=fs.readFileSync(datei,'utf8');
  await app.close();
  // 3
  app=await start();pg=await app.firstWindow();pg.on('pageerror',e=>seitenfehler.push(e.message));await pg.waitForLoadState('domcontentloaded');await pg.waitForTimeout(500);
  if(await pg.$('button:text("Weiterspielen")')){await pg.click('button:text("Weiterspielen")');await pg.waitForTimeout(300);
    const mgr=await pg.evaluate(()=>S&&S.mgr),gleich=await pg.evaluate(t=>{const d=JSON.parse(t);return S.tag===d.tag&&S.season===d.season&&S.pl.length===d.pl.length;},gespeichert);
    if(mgr==='App'&&gleich)ok('Nach dem Neustart: Weiterspielen lädt denselben Stand');else fehl('Nach dem Neustart anderer Stand');}
  else fehl('Nach dem Neustart kein „Weiterspielen“');
  // 4
  const gross=await pg.evaluate(()=>{S.ballast='x'.repeat(8e6);SPEICHER_FEHLER=false;save();const f=SPEICHER_FEHLER;delete S.ballast;return f;});
  const groesse=fs.statSync(datei).size;
  if(!gross&&groesse>8e6)ok(`Keine Größengrenze: ${(groesse/1e6).toFixed(1).replace('.',',')} MB gespeichert`);else fehl('Großer Spielstand nicht gespeichert');
  await pg.evaluate(()=>save());
  // 5
  const gut=fs.readFileSync(datei,'utf8');await pg.evaluate(()=>{S.mgr='Neu';save();});
  fs.writeFileSync(datei,gut.slice(0,1000));                                     // kaputt, wie nach Stromausfall
  const gelesen=await pg.evaluate(()=>{const t=window.flutlichtApp.lesen(REGELN.spielstand.schluessel);try{return JSON.parse(t).mgr;}catch(e){return 'kaputt';}});
  if(gelesen==='App')ok('Kaputte Datei: Die App nimmt die Kopie vom vorigen Speichern');else fehl('Kaputte Datei nicht abgefangen: '+gelesen);
  const fremd=await pg.evaluate(()=>window.flutlichtApp.schreiben('../../boese','x'));
  if(fremd===false)ok('Schreiben außerhalb des Spielstand-Ordners abgelehnt');else fehl('Schreiben außerhalb des Ordners möglich');
  await app.close();
  seitenfehler.forEach(f=>fehl('Seitenfehler: '+f));
  try{fs.rmSync(daten,{recursive:true,force:true});}catch(e){}
  console.log('PROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);})().catch(e=>{console.log('✗ Abbruch: '+e.message);process.exit(1);});
