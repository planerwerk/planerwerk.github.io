// Spielstand als Datei (Lücke L1 in konzepte/_luecken.md, 26.11.): „Als Datei sichern“ im Menü liefert eine Datei mit genau dem Spielstand,
// „Datei laden“ im Menü und auf dem Startbildschirm stellt ihn wieder her. Eine kaputte Datei ändert nichts. Der Text-Code bleibt daneben bestehen.
// Aufruf: node tests/ui-sicherung.js. Braucht Playwright.
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const os=require('os');
const FILE='file://'+path.resolve(__dirname,'..','index.html'),probleme=[],ok=t=>console.log('✓ '+t),fehl=t=>{probleme.push(t);console.log('✗ '+t);};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({acceptDownloads:true});const pg=await ctx.newPage();const seitenfehler=[];pg.on('pageerror',e=>seitenfehler.push(e.message));
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'flutlicht-sicherung-'));
  await pg.goto(FILE);await pg.evaluate(()=>localStorage.clear());await pg.reload();
  await pg.evaluate(()=>{buildWorld(4242);S.my=6;S.mgr='Sicherung';setTarget();sponsOffers();sponsorWaehlen(0);S.lineup=bestXI(6,myT().form);save();render();});
  for(let i=0;i<5;i++){await pg.click('header .go');await pg.waitForTimeout(40);if(await pg.$('#trotzdem'))await pg.click('#trotzdem');}
  const vorher=await pg.evaluate(()=>JSON.stringify(S));

  // 1. Menü zeigt die Größe und die Knöpfe
  const menueTab=()=>pg.click('.tabs button:text-is("Menü")');await menueTab();
  const kopf=await pg.textContent('.ov h3:has-text("Spielstand sichern")');
  if(/% des Browser-Speichers/.test(kopf||''))ok('Menü zeigt die Größe mit Anteil am Browser-Speicher: '+kopf.trim());else fehl('Menü zeigt keinen Anteil am Browser-Speicher: '+kopf);
  if(await pg.$('#exp'))ok('Text-Code bleibt daneben bestehen');else fehl('Text-Code fehlt im Menü');

  // 2. Als Datei sichern: Datei mit genau dem Spielstand und sprechendem Namen
  const [dl]=await Promise.all([pg.waitForEvent('download'),pg.click('button:text-is("Als Datei sichern")')]);
  const datei=path.join(tmp,dl.suggestedFilename());await dl.saveAs(datei);const inhalt=fs.readFileSync(datei,'utf8');
  if(/^flutlicht-[a-z0-9]+-\d{4}-\d{2}-\d{2}\.json$/.test(dl.suggestedFilename()))ok('Dateiname: '+dl.suggestedFilename());else fehl('Dateiname unerwartet: '+dl.suggestedFilename());
  if(inhalt===vorher)ok(`Datei enthält genau den Spielstand (${Math.round(inhalt.length/1024)} KB)`);else fehl('Datei weicht vom Spielstand ab');

  // 3. Datei laden im Menü stellt den Stand wieder her
  await pg.evaluate(()=>{S.mgr='Verändert';S.tag+=3;save();});
  await pg.evaluate(()=>closeOv());await menueTab();
  await pg.setInputFiles('#datei-laden',datei);await pg.waitForTimeout(500);
  // Beim Laden ergänzt das Spiel fehlende Felder (verhUmstellen, k23cUmstellen …), wie beim Text-Code. Maßstab ist deshalb das Laden desselben Inhalts als Text-Code.
  const nachher=await pg.evaluate(()=>JSON.stringify(S));
  const perCode=await pg.evaluate(t=>{importSave(t);return JSON.stringify(S);},inhalt);
  if(nachher===perCode&&(await pg.evaluate(()=>S.mgr))==='Sicherung')ok('Datei laden im Menü ergibt denselben Stand wie der Text-Code (Name und Tag wieder wie gesichert)');else fehl('Datei laden im Menü ergibt einen anderen Stand als der Text-Code');
  const gespeichert=await pg.evaluate(()=>localStorage.getItem(REGELN.spielstand.schluessel));
  if(gespeichert===perCode)ok('Geladener Stand ist auch im Browser gespeichert');else fehl('Geladener Stand wurde nicht im Browser gespeichert');

  // 4. Kaputte Datei ändert nichts
  const kaputt=path.join(tmp,'kaputt.json');fs.writeFileSync(kaputt,'{"v":1,"teams":[],"pl":[]');
  await pg.evaluate(()=>menu());await pg.setInputFiles('#datei-laden',kaputt);await pg.waitForTimeout(300);
  if((await pg.evaluate(()=>JSON.stringify(S)))===perCode)ok('Kaputte Datei ändert nichts');else fehl('Kaputte Datei hat den Spielstand verändert');

  // 5. Startbildschirm: Datei laden ohne Spielstand im Browser
  await pg.evaluate(()=>localStorage.clear());await pg.reload();await pg.waitForTimeout(200);
  if(await pg.$('button:text("Weiterspielen")'))fehl('Startbildschirm bietet „Weiterspielen“ ohne Spielstand an');
  await pg.click('summary:has-text("Spielstand laden")');
  await pg.setInputFiles('#datei-laden',datei);await pg.waitForTimeout(500);
  if((await pg.evaluate(()=>S&&JSON.stringify(S)))===perCode)ok('Datei laden auf dem Startbildschirm stellt den Spielstand wieder her');else fehl('Datei laden auf dem Startbildschirm hat nicht funktioniert');

  seitenfehler.forEach(f=>fehl('Seitenfehler: '+f));
  await b.close();try{fs.rmSync(tmp,{recursive:true,force:true});}catch(e){}
  console.log('PROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);})();
