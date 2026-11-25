// Barrierefreiheit und Tastatur (K40 §5.1, UX1): axe-core auf Startbildschirm, allen zwölf Ansichten, Spielerkarte und Menü (WCAG 2.0 und 2.1, A und AA),
// dann Tastatur: „Tag beenden“ mit Tab erreichbar und mit Enter auslösbar, sichtbarer Fokus, Fenster bekommen den Fokus und schließen mit Escape.
// Aufruf: node tests/ui-zugang.js. Braucht Playwright, für den ersten Teil dazu axe-core (npm i axe-core). Ohne axe-core prüft es nur die Tastatur.
// ACHTUNG: Dieses Skript ist noch nie gelaufen (UX1 entstand am 20.11. ohne Node.js und Playwright). Beim ersten Lauf sind Verstöße zu erwarten (K40 §10).
const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(__dirname,'..','index.html');
const TABS=['Büro','Kalender','Kader','Kabine','Aufstellung','Tabelle','Spielplan','Pokal','Statistik','Transfers','Finanzen','Stadion','Training & Jugend'];
const probleme=[],hinweise=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
let AXE=null;try{AXE=require('axe-core');}catch(e){hinweise.push('axe-core fehlt (npm i axe-core): nur die Tastatur wird geprüft.');}
(async()=>{
const b=await chromium.launch();const pg=await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
pg.on('pageerror',e=>probleme.push('JS: '+e.message));
await pg.goto(FILE);await pg.evaluate(()=>localStorage.clear());await pg.reload();
// axe-core in die Seite laden und prüfen. Rückgabe: Verstöße [{id, impact, n, help}]
const axeLauf=async wo=>{if(!AXE)return;if(typeof AXE.source!=='string'){hinweise.push('axe-core ohne axe.source, Prüfung übersprungen');AXE=null;return;}
  if(!await pg.evaluate(()=>typeof axe!=='undefined'))await pg.addScriptTag({content:AXE.source});
  const v=await pg.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})).violations.map(x=>({id:x.id,impact:x.impact,n:x.nodes.length,help:x.help})));
  const schwer=v.filter(x=>x.impact==='serious'||x.impact==='critical'),rest=v.filter(x=>!schwer.includes(x));
  pruef(!schwer.length,`axe ${wo}: keine schweren Verstöße`,schwer.map(x=>`${x.id} (${x.impact}, ${x.n}×): ${x.help}`).join(' | ')||null);
  if(rest.length)hinweise.push(`axe ${wo}: ${rest.map(x=>`${x.id} (${x.impact}, ${x.n}×)`).join(', ')}`);};
await axeLauf('Startbildschirm');
// Eigene Anzeigeschrift (K35b §13.4, W5d1): Die eingebettete Schrift lädt ohne Fehler (sonst fiele das Spiel still auf Saira zurück) und gilt für Ziffern
const schrift=await pg.evaluate(async()=>{try{const f=await document.fonts.load('700 30px "Flutlicht Display"','0123456789:');return f.length?f.map(x=>x.status).join(','):'keine Schrift gefunden';}catch(e){return 'Fehler: '+e.message;}});
pruef(schrift==='loaded','Schrift: Flutlicht Display lädt',schrift);
// Karriere wie in tests/ui-zwei-saisons.js: Freiburg, ohne Lernstufen, fester Seed
await pg.selectOption('#club',{label:'SC Freiburg'});await pg.selectOption('#lernstufen','0');await pg.fill('#mgr','Testtrainer');await pg.click('summary:text-is("Erweitert")');await pg.fill('#seed','4711');await pg.click('text=Anpfiff zur Karriere');
for(const t of TABS){await pg.click(`.tabs button:text-is("${t}")`);await axeLauf('Ansicht '+t);}
// Büro als Kachelfläche (K35b §13.2, W5c): große Kachel „Heute“, mindestens neun Kacheln, keine mit undefined oder NaN, Link „Ganze Tabelle“ führt zur Tabelle
await pg.click('.tabs button:text-is("Büro")');
const kb=await pg.evaluate(()=>{const k=[...document.querySelectorAll('.kacheln .kachel')];return{n:k.length,gross:!!document.querySelector('.kacheln .k-gross'),kaputt:k.filter(x=>/undefined|NaN/.test(x.textContent)).map(x=>x.getAttribute('aria-label'))};});
pruef(kb.n>=9&&kb.gross,'Büro: Kachelfläche mit großer Kachel und mindestens neun Kacheln',kb.n);
pruef(!kb.kaputt.length,'Büro: keine Kachel mit undefined oder NaN',kb.kaputt.join(', ')||null);
await pg.click('.kachel button.k-link:has-text("Ganze Tabelle")');pruef(await pg.evaluate(()=>TAB==='tabelle'),'Büro: Der Link „Ganze Tabelle“ öffnet die Tabelle');
// Eigene Wappen (K39 §3.1, W5e2): Bild mit Dateiname = Kürzel über das Menü laden, Kopfzeile zeigt es, nicht im Spielstand; Entfernen stellt das erzeugte Wappen her
const mb=await pg.$('button:text-is("Menü")');
if(mb){await mb.click();const fi=await pg.$('input[type=file][onchange*="eigeneWappenLaden"]');
  if(fi){const kurz=await pg.evaluate(()=>myT().sh);
    await fi.setInputFiles({name:kurz+'.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=','base64')});
    await pg.waitForFunction(()=>!!document.querySelector('header .club img.wp'),null,{timeout:3000}).catch(()=>{});
    pruef(await pg.evaluate(()=>!!document.querySelector('header .club img.wp')&&!JSON.stringify(S).includes('data:image')),'Eigene Wappen: Bild geladen, in der Kopfzeile, nicht im Spielstand');
    await pg.evaluate(()=>eigeneWappenLoeschen());
    pruef(await pg.evaluate(()=>!document.querySelector('header .club img.wp')&&!!document.querySelector('header .club svg.wp')),'Eigene Wappen: Entfernen stellt das erzeugte Wappen wieder her');}
  else pruef(false,'Eigene Wappen: Das Menü hat die Auswahl');
  await pg.evaluate(()=>closeOv());}
// Sequenzen (K39 §3.4, W5e3): Torjubel mit Konfetti bei „an“, nichts bei „aus“, Konfetti verschwindet von selbst
const seq=await pg.evaluate(async()=>{const warte=ms=>new Promise(r=>setTimeout(r,ms));sequenzSetzen('an');torSequenz(true,'#c8102e');const an=document.querySelectorAll('.konfetti i').length;
  await warte(2600);const weg=!document.querySelector('.konfetti');sequenzSetzen('aus');torSequenz(true,'#c8102e');const aus=!document.querySelector('.konfetti');sequenzSetzen('an');return{an,weg,aus};});
pruef(seq.an>=20&&seq.weg&&seq.aus,'Sequenzen: Konfetti bei „an“, verschwindet von selbst, nichts bei „aus“',JSON.stringify(seq));
await pg.click('.tabs button:text-is("Kader")');const zeile=await pg.$('tr.click');
if(zeile){await zeile.click();await axeLauf('Spielerkarte');
  const fokus=await pg.evaluate(()=>{const a=document.activeElement;return !!a&&!!a.closest('.ovb');});pruef(fokus,'Fenster: Beim Öffnen liegt der Fokus im Fenster');
  await pg.keyboard.press('Escape');pruef(await pg.evaluate(()=>!document.getElementById('ov').innerHTML),'Fenster: Escape schließt die Spielerkarte');}
else hinweise.push('keine Kaderzeile zum Öffnen gefunden');
// Tastatur: vom Seitenanfang mit Tab zu „Tag beenden“, jeder Fokus sichtbar und kein div ohne Rolle
await pg.click('.tabs button:text-is("Büro")');await pg.evaluate(()=>{document.activeElement&&document.activeElement.blur&&document.activeElement.blur();window.scrollTo(0,0);const h=document.querySelector("header.top")||document.body;h.setAttribute("tabindex","-1");h.focus();h.removeAttribute("tabindex"); /* Startpunkt an den Seitenanfang: Nach blur() macht Chrome sonst an der zuletzt fokussierten Stelle weiter (T1.4) */});
let gefunden=false,schritte=0;const unsichtbar=[];
for(;schritte<80&&!gefunden;schritte++){await pg.keyboard.press('Tab');const f=await pg.evaluate(()=>{const a=document.activeElement;if(!a||a===document.body)return null;const r=a.getBoundingClientRect();
    return{text:(a.innerText||a.value||a.getAttribute('aria-label')||'').trim().slice(0,40),tag:a.tagName,rolle:a.getAttribute('role'),sichtbar:r.width>0&&r.height>0};});
  if(!f)continue;if(!f.sichtbar||(f.tag==='DIV'&&!f.rolle))unsichtbar.push(`${f.tag} „${f.text}“`);if(/Tag beenden/i.test(f.text))gefunden=true; /* der Knopf steht per CSS in Großbuchstaben (T1.4) */}
pruef(gefunden,'Tastatur: „Tag beenden“ mit Tab erreichbar',`${schritte} Schritte`);
pruef(!unsichtbar.length,'Tastatur: jeder Fokus sichtbar, kein div ohne Rolle',unsichtbar.slice(0,5).join(', ')||null);
if(gefunden){const vor=await pg.evaluate(()=>S.tag);await pg.keyboard.press('Enter');await pg.waitForTimeout(150);
  const nach=await pg.evaluate(()=>({tag:S.tag,ov:!!document.getElementById('ov').innerHTML}));
  pruef(nach.tag!==vor||nach.ov,'Tastatur: Enter auf „Tag beenden“ geht weiter (oder öffnet den Vorbericht beziehungsweise eine Erinnerung)',`Tag ${vor} → ${nach.tag}${nach.ov?', Fenster offen':''}`);}
// Menü: Fokus und Escape
const menu=await pg.$('button:text-is("Menü")');if(menu){await pg.evaluate(()=>closeOv());await menu.click();await axeLauf('Menü');await pg.keyboard.press('Escape');
  pruef(await pg.evaluate(()=>!document.getElementById('ov').innerHTML),'Fenster: Escape schließt das Menü');}
// Darstellung (K35b §13.3, W5b): Standard dunkel; hell über das Menü, axe im hellen Thema; Wahl bleibt nach dem Neuladen; „Wie das Gerät“ folgt dem Gerät
const grund=()=>pg.evaluate(()=>getComputedStyle(document.body).backgroundColor),thema=()=>pg.evaluate(()=>document.documentElement.getAttribute('data-thema'));
pruef(await thema()===null&&await grund()==='rgb(14, 23, 38)','Darstellung: Standard ist dunkel (Flutlichtnacht)',await grund());
if(menu){await pg.evaluate(()=>closeOv());await menu.click();const hell=await pg.$('input[name=thema][onchange*="hell"]');
  if(hell){await hell.check();pruef(await thema()==='hell'&&await grund()==='rgb(243, 245, 248)','Darstellung: Das Menü schaltet auf hell',await grund());
    await axeLauf('Menü (hell)');await pg.keyboard.press('Escape');
    for(const t of ['Büro','Kader','Aufstellung','Tabelle','Finanzen']){await pg.click(`.tabs button:text-is("${t}")`);await axeLauf(`Ansicht ${t} (hell)`);}
    await pg.reload();pruef(await thema()==='hell','Darstellung: Die Wahl bleibt nach dem Neuladen');
    await pg.evaluate(()=>themaSetzen('system'));await pg.emulateMedia({colorScheme:'light'});pruef(await grund()==='rgb(243, 245, 248)','Darstellung: „Wie das Gerät“ folgt einem hellen Gerät',await grund());
    await pg.emulateMedia({colorScheme:'dark'});pruef(await grund()==='rgb(14, 23, 38)','Darstellung: „Wie das Gerät“ folgt einem dunklen Gerät',await grund());
    await pg.evaluate(()=>themaSetzen('dunkel'));pruef(await thema()===null,'Darstellung: zurück auf dunkel, ohne Attribut');}
  else pruef(false,'Darstellung: Das Menü hat die Auswahl „Darstellung“');}
await b.close();
if(hinweise.length)console.log('\nHINWEISE\n'+hinweise.join('\n'));
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
})();
