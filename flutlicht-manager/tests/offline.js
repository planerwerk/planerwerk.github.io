// Offline und ohne fremde Server (Lücke L6, 27.11.2026, Entscheidung des Nutzers: „bitte nichts dynamisch ziehen“).
// 1. index.html lädt Skripte, Stile, Bilder und Schriften nur aus dem Spielordner (kein http, https oder //).
// 2. Keine CSS-Datei holt etwas von außen (url(), @import).
// 3. Kein Skript lädt etwas nach (fetch, XMLHttpRequest, import(), WebSocket, EventSource, sendBeacon oder ein Element mit fremder Adresse).
//    Links auf Quellen im Text (Wikipedia und Ähnliches) sind erlaubt, sie öffnet nur, wer darauf klickt.
// 4. Die Schriften Barlow, Saira Condensed und VT323 liegen eingebettet in css/schriften.css, je latin und latin-ext, die Lizenztexte in schrift/.
// 5. Im Browser (Playwright): Beim Start und beim ersten Tag geht keine einzige Anfrage an einen fremden Server, alle drei Schriften sind geladen.
// Aufruf: node tests/offline.js. Teil 5 braucht Playwright, ohne Playwright wird er übersprungen.
const fs=require('fs'),path=require('path'),ROOT=path.resolve(__dirname,'..');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const lies=p=>fs.readFileSync(path.join(ROOT,p),'utf8'),dateien=d=>fs.readdirSync(path.join(ROOT,d)).filter(f=>/\.(js|css)$/.test(f)).map(f=>d+'/'+f);
const fremd=u=>/^(https?:)?\/\//i.test(String(u).trim());

// 1
{const h=lies('index.html'),refs=[...h.matchAll(/<(?:script|link|img|source|iframe|audio|video)\b[^>]*?\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]);
  const aussen=refs.filter(fremd);pruef(refs.length>0&&!aussen.length,`index.html: ${refs.length} eingebundene Dateien, alle aus dem Spielordner`,aussen.join(', ')||null);}
// 2
{const aussen=[];for(const f of dateien('css')){const t=lies(f);for(const m of t.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)|@import\s+(?:url\()?\s*["']([^"']+)["']/gi)){const u=m[1]||m[2];if(fremd(u))aussen.push(`${f}: ${u.slice(0,60)}`);}}
  pruef(!aussen.length,'CSS: keine Adresse außerhalb des Spiels (url(), @import)',aussen.join('; ')||null);}
// 3
{const aussen=[];for(const f of dateien('js').concat(dateien('daten'))){const t=lies(f);
    for(const m of t.matchAll(/\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts)\s*\(|\bimport\s*\(\s*["'`]/g))aussen.push(`${f}: ${m[0]}`);
    for(const m of t.matchAll(/\.(src|href)\s*=\s*["'`](https?:)?\/\//g))aussen.push(`${f}: ${m[0]}`);}
  pruef(!aussen.length,'Skripte: kein Nachladen (fetch, XMLHttpRequest, import(), WebSocket, fremde src oder href)',aussen.join('; ')||null);}
// 4
{const t=lies('css/schriften.css'),fam=f=>(t.match(new RegExp(`font-family:"${f}"`,'g'))||[]).length;
  const lz=['LIZENZ-Barlow.txt','LIZENZ-SairaCondensed.txt','LIZENZ-VT323.txt'].every(f=>fs.existsSync(path.join(ROOT,'schrift',f))&&/SIL OPEN FONT LICENSE Version 1\.1/.test(fs.readFileSync(path.join(ROOT,'schrift',f),'utf8')));
  pruef(fam('Barlow')===8&&fam('Saira Condensed')===6&&fam('VT323')===2&&!/https?:\/\/fonts\./.test(t.replace(/\/\*[\s\S]*?\*\//g,''))&&lz,'Schriften eingebettet (Barlow 4 Schnitte, Saira Condensed 3, VT323 1, je latin und latin-ext), Lizenztexte vorhanden',`Barlow ${fam('Barlow')}, Saira ${fam('Saira Condensed')}, VT323 ${fam('VT323')}, Lizenzen ${lz}`);}
// 5
(async()=>{let pw=null;try{pw=require('playwright');}catch(e){}
  if(pw){const b=await pw.chromium.launch(),pg=await b.newPage(),anfragen=[],fehler=[];
    pg.on('request',r=>{const u=r.url();if(!/^(file|data|blob|about):/i.test(u))anfragen.push(u);});pg.on('pageerror',e=>fehler.push(e.message));
    await pg.goto('file://'+path.join(ROOT,'index.html'));await pg.evaluate(()=>localStorage.clear());await pg.reload();
    await pg.evaluate(()=>{buildWorld(4242);S.my=6;S.mgr='Offline';setTarget();sponsOffers();S.lineup=bestXI(6,myT().form);save();TAB='buero';render();});
    for(let i=0;i<3;i++){await pg.click('header .go');await pg.waitForTimeout(60);if(await pg.$('#trotzdem'))await pg.click('#trotzdem');}
    const geladen=await pg.evaluate(async()=>{await document.fonts.ready;const t=['Barlow','Saira Condensed','VT323'];
      await Promise.all(t.map(f=>document.fonts.load(`700 16px "${f}"`,'ÄÖÜß€Łş').catch(()=>null)));return t.filter(f=>document.fonts.check(`700 16px "${f}"`,'ÄÖÜß€Łş'));});
    await b.close();
    pruef(!anfragen.length,'Browser: keine Anfrage an fremde Server beim Start und an drei Tagen',anfragen.slice(0,5).join(', ')||null);
    pruef(geladen.length===3,'Browser: alle drei Schriften geladen, auch für Umlaute, €, Ł und ş',geladen.join(', '));
    pruef(!fehler.length,'Browser: keine Seitenfehler',fehler.join(' | ')||null);}
  else console.log('Teil 5 übersprungen (Playwright fehlt)');
  console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);})();
