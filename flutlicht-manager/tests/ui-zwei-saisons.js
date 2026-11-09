// Zwei Saisons über die echte Oberfläche spielen: „Tag beenden“, Erinnerungen, Konferenz, Transfers, Verträge,
// Speichern und Laden, Entlassung, Handy-Breite. Nach jedem Halt werden die Spieldaten geprüft.
const {chromium}=require('playwright');const path=require('path');const PRUEFUNGEN=require('./pruefungen.js');
const FILE='file://'+path.resolve(__dirname,'..','index.html');
const problems=[];const note=(w,m)=>{problems.push(`[${w}] ${m}`);};
const seasons=[];const actlog=[];const done=new Set();let rem=0,stops=0;const proWoche={};
const TABS=['Büro','Kalender','Kader','Aufstellung','Tabelle','Spielplan','Pokal','Transfers','Finanzen','Stadion','Training & Jugend'];
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:900}});const pg=await ctx.newPage();
pg.on('pageerror',e=>note('JS','PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(1,3).join(' ')));
pg.on('console',m=>{if(m.type()==='error')note('JS','CONSOLE '+m.text());});
// Spielstände älterer Testversionen werden beim Start gelöscht
await pg.goto(FILE);await pg.evaluate(()=>{localStorage.clear();localStorage.setItem('flutlicht-manager-v1','{"v":1}');localStorage.setItem('flutlicht-manager-v2','{"v":2}');});await pg.reload();
if(await pg.evaluate(()=>!!(localStorage.getItem('flutlicht-manager-v1')||localStorage.getItem('flutlicht-manager-v2'))))note('Start','alte Spielstände nicht gelöscht');
if(await pg.$('button:text-is("Weiterspielen")'))note('Start','alter Spielstand wird zum Weiterspielen angeboten');
await pg.selectOption('#club',{label:'SC Freiburg'});await pg.fill('#mgr','Testtrainer');await pg.click('summary:text-is("Erweitert")');await pg.fill('#seed','4711');await pg.click('text=Anpfiff zur Karriere');
await pg.evaluate(PRUEFUNGEN);
if(await pg.evaluate(()=>S.seed)!==4711)note('Start','Seed aus dem Startbildschirm nicht übernommen');
const st=()=>pg.evaluate(()=>({phase:S.phase,tag:S.tag,wk:Math.floor((S.tag-S.plan.start)/7),season:S.season,fired:S.fired,team:S.teams[S.my].name,datum:datumKurz(S.tag)}));
const tabClick=async t=>{await pg.click(`.tabs button:text-is("${t}")`);};
const closeModal=async()=>{const x=await pg.$('.ovb .x');if(x)await x.click();else await pg.evaluate(()=>closeOv());};
const msgOrClosed=async()=>{await pg.waitForTimeout(60);const open=await pg.$('#msg');if(open){const m=(await open.innerText()).trim();await closeModal();return 'abgelehnt: '+m;}return 'OK';};
const once=k=>{if(done.has(k))return false;done.add(k);return true;};

async function actions(s,tag){const wk=s.wk,yr=s.season,K=yr+':'+wk+':';
 await tabClick('Büro');
 const sp=await pg.$$('.card:has(h3:text-is("Trikotsponsor wählen")) .opt');if(sp.length&&wk>=1){await sp[yr%3].click();actlog.push(tag+' Sponsor gewählt');}
 const acc=await pg.$$('button:text-is("Annehmen")');if(acc.length&&once(K+'angebot')){if(wk%3){await acc[0].click();actlog.push(tag+' Angebot angenommen');}else{await (await pg.$('button:text-is("Ablehnen")')).click();actlog.push(tag+' Angebot abgelehnt');}}
 if(yr===2026&&wk===1&&once(K+'taktik')){await tabClick('Aufstellung');await pg.selectOption('#formsel','4-3-3');await pg.selectOption('#tacsel','O');await pg.selectOption('#einsel','H');
   const opts=await pg.$$eval('#slot5 option:not([disabled])',o=>o.map(x=>x.value));if(opts.length>3)await pg.selectOption('#slot5',opts[3]);
   await pg.click('button:text-is("Beste Elf automatisch aufstellen")');
   // Taktik (K06): Spielstil, Rolle, Einstellung, Elfmeterschütze
   await pg.selectOption('#stilsel','pressing');const rs=await pg.$$('.rollesel');if(rs.length)await rs[0].selectOption({index:1});await pg.selectOption('#einstsel','saison');
   const el=await pg.$$('.schuetzen select');if(el.length){const v=await el[0].evaluate(x=>x.options[1]&&x.options[1].value);if(v)await el[0].selectOption(v);}
   const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Aufstellung: '+sc);actlog.push(tag+' Taktik geändert (System, Stil, Rolle, Einstellung, Schütze)');}
 if(yr===2026&&wk===2&&once(K+'verein')){await tabClick('Training & Jugend');await pg.click('.opt:has(b:text-is("Aufbau"))');await pg.click('.opt:has(b:text-is("Stufe 4"))');
   await tabClick('Finanzen');await pg.fill('#price','38');await pg.locator('#price').dispatchEvent('change');await pg.click('button:text-is("+5 Mio leihen")');
   await tabClick('Stadion');await pg.click('.opt:has(b:text-is("Tribüne ausbauen"))');actlog.push(tag+' Training hart, Jugend 4, Preis 38, Kredit, Tribüne');}
 if((wk===3||wk===18)&&once(K+'kauf')){const id=await pg.evaluate(()=>{const t=myT(),lv=teamLevel(S.my);const c=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&p.list&&p.str>lv-3&&askPrice(p)<t.cash*0.7).sort((a,b)=>b.str-a.str);return c.length?c[0].id:null;});
   if(id!=null){await pg.evaluate(i=>openP(i),id);await pg.click('button:text-is("Angebot abgeben")');actlog.push(tag+' Kauf Listenspieler: '+await msgOrClosed());}else actlog.push(tag+' kein passender Listenspieler');
   const star=await pg.evaluate(()=>{const c=S.pl.filter(p=>p.team===0&&!p.list).sort((a,b)=>b.str-a.str);return c[0].id;});
   await pg.evaluate(i=>openP(i),star);await pg.fill('#fee','0.5');await pg.click('button:text-is("Angebot abgeben")');actlog.push(tag+' Billigangebot für Bayern-Star: '+await msgOrClosed());}
 if(wk===4&&yr===2026&&once(K+'menue')){await tabClick('Menü');const cb=await pg.$$('.ovb .pick input');if(cb.length!==4)note(tag,`Menü: ${cb.length} statt 4 Erinnerungs-Schalter`);
   await cb[1].click();const aus=await pg.evaluate(()=>!erinnerungAn('aufstellung'));await cb[1].click();const an=await pg.evaluate(()=>erinnerungAn('aufstellung'));if(!aus||!an)note(tag,'Erinnerung lässt sich nicht ab- und wieder anschalten');await closeModal();
   await tabClick('Kalender');await pg.click('button[aria-label="Monat vor"]');await pg.click('button[aria-label="Monat vor"]');const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Kalender: '+sc);await pg.click('button:text-is("Heute")');actlog.push(tag+' Menü-Schalter und Kalender geprüft');}
 if(wk===5&&once(K+'frei')){await tabClick('Transfers');await pg.selectOption('#tf_lg','f');const row=await pg.$('tbody tr.click');if(row){await row.click();await pg.click('button:text-is("Verpflichten")');actlog.push(tag+' Vereinsloser: '+await msgOrClosed());}
   await pg.selectOption('#tf_lg','');await pg.fill('#tf_q','Bayern');await pg.locator('#tf_q').dispatchEvent('change');await pg.click('#tf_list');await pg.selectOption('#tf_max','10');
   await pg.selectOption('#tf_pos','ST');await pg.fill('#tf_q','');await pg.locator('#tf_q').dispatchEvent('change');}
 if(wk===6&&once(K+'liste')){const id=await pg.evaluate(()=>squad(S.my).sort((a,b)=>a.str-b.str)[0].id);await pg.evaluate(i=>openP(i),id);
   await pg.fill('#ask',String(await pg.evaluate(i=>(value(PIX.get(i))*0.8/1e6).toFixed(1),id)));await pg.click('button:text-is("Auf die Transferliste setzen")');await closeModal();actlog.push(tag+' Spieler auf Transferliste');}
 if(yr===2026&&wk===8&&once(K+'export')){await tabClick('Menü');const exp=await pg.$eval('#exp',e=>e.value);const before=await pg.evaluate(()=>JSON.stringify(S));
   if(exp!==before)note(tag,'Export-Code weicht vom Spielstand ab');await pg.fill('#imp',exp);await pg.click('button:text-is("Laden")');
   const after=await pg.evaluate(()=>JSON.stringify(S));if(after!==before)note(tag,'Import ergibt anderen Spielstand');
   await tabClick('Menü');await pg.fill('#imp','{"v":1,"teams":[],"pl":[]}');await pg.click('button:text-is("Laden")');if((await pg.evaluate(()=>JSON.stringify(S)))!==before)note(tag,'Code der Version 1 wurde geladen');
   await closeModal();actlog.push(tag+' Export/Import geprüft');}
 if(yr===2026&&wk===12&&once(K+'reload')){const before=await pg.evaluate(()=>JSON.stringify(S));await pg.reload();await pg.click('button:text-is("Weiterspielen")');await pg.evaluate(PRUEFUNGEN);const after=await pg.evaluate(()=>JSON.stringify(S));
   if(before!==after)note(tag,'Nach Neuladen anderer Stand');actlog.push(tag+' Neu geladen, weitergespielt');}
 if(wk===10&&once(K+'logen')){await tabClick('Stadion');const l=await pg.$('.opt:has(b:text-is("10 VIP-Logen"))');if(l){await l.click();actlog.push(tag+' Logen gebaut (falls Geld)');}}
 if(wk===16&&once(K+'shop')){await tabClick('Stadion');const f=await pg.$('.opt:has(b:has-text("Fanshop"))');if(f){await f.click();actlog.push(tag+' Fanshop');}}
 if(wk===20&&once(K+'tilgen')){await tabClick('Finanzen');await pg.click('button:text-is("Alles tilgen")');}
 if(wk===24&&once(K+'vertrag')){const ids=await pg.evaluate(()=>squad(S.my).filter(p=>p.ct<=1).map(p=>p.id));for(const id of ids.slice(0,8)){await pg.evaluate(i=>openP(i),id);await pg.selectOption('#ext','2');await pg.click('button:text-is("Verlängern")');await closeModal();}actlog.push(tag+` ${Math.min(8,ids.length)} Verträge verlängert`);}
 if(wk===26&&once(K+'edit')){const id=await pg.evaluate(()=>squad(S.my)[0].id);await pg.evaluate(i=>openP(i),id);
   if(await pg.$('summary:text-is("Spielerdaten bearbeiten")')||await pg.$('#e_s'))note(tag,'Bearbeiten im Spiel ist noch vorhanden');
   if(await pg.evaluate(()=>typeof saveEdit!=='undefined'))note(tag,'saveEdit gibt es noch');
   const rg=await pg.$$eval('.ovb .rg',x=>x.length);if(rg<3)note(tag,`Spielerkarte: ${rg} statt 3 Regler`);await closeModal();actlog.push(tag+' Spielerkarte ohne Bearbeiten, mit Reglern geprüft');}
 if(wk===30&&once(K+'frei')){const id=await pg.evaluate(()=>squad(S.my).sort((a,b)=>a.str-b.str)[0].id);await pg.evaluate(i=>openP(i),id);await pg.click('button:has-text("Vertrag auflösen")');actlog.push(tag+' Spieler freigestellt');}
 if(yr===2027&&wk===2&&once(K+'normal')){await tabClick('Training & Jugend');await pg.click('.opt:has(b:text-is("Co-Trainer entscheidet"))');await tabClick('Aufstellung');await pg.selectOption('#formsel','3-5-2');await pg.selectOption('#stilsel','konter');}
 if(yr===2027&&wk===9&&once(K+'vertrauen')){await pg.evaluate(()=>{S.trust=5;});actlog.push(tag+' Vertrauen künstlich auf 5 gesetzt (Entlassung testen)');}
 const rid=await pg.evaluate(()=>S.pl[Math.floor(Math.random()*S.pl.length)].id);await pg.evaluate(i=>openP(i),rid);const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Spielerfenster: '+sc);await closeModal();
 if(wk%5===0&&once(K+'plan')){await tabClick('Spielplan');await pg.selectOption('#daysel',String(wk%34));await tabClick('Tabelle');await pg.click('button:text-is("2. Liga")');await pg.click('button:text-is("3. Liga")');const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Tabelle 3. Liga: '+sc);}
}
async function advance(tag){await tabClick('Büro');const t0=await pg.evaluate(()=>S.tag);await pg.click('header .go');
 for(let k=0;k<10;k++){await pg.waitForTimeout(30);const ov=(await pg.evaluate(()=>document.getElementById('ov').innerText)).trim();if(!ov)break;
  if(ov.startsWith('Sicher?')){rem++;const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Erinnerung: '+sc);await pg.click('#trotzdem');continue;}
  if(await pg.$('#kick')){const unav=await pg.evaluate(()=>S.pl.filter(p=>!avail(p)).map(p=>p.id)),z=Math.random();
   // Meist live mit Vorspulen, manchmal mit Eingriffen zur Halbzeit, manchmal „Sofort berechnen“ (alte Konferenz)
   if(z<0.15){await pg.click('#sofort');await pg.click('.ovb button:text-is("Zum Abpfiff")',{timeout:4000});}
   else{await pg.click('#kick');
     if(z<0.4){await pg.click('.ovb button:text-is("Bis zur Halbzeit")',{timeout:4000});await pg.click('#lv-tab-elf');const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Halbzeit: '+sc);
       await pg.click('.lv-ansp button >> nth=1');const raus=await pg.$('.lv-akt button:text-is("raus")');if(raus){await raus.click();const rein=await pg.$('.lv-akt button:text-is("rein"):not([disabled])');if(rein)await rein.click();}
       await pg.click('#lv-tab-taktik');await pg.click('.ovb button:text-is("Ruhe bewahren!")');}
     await pg.click('.ovb button:text-is("Zum Abpfiff")',{timeout:4000});}
   await pg.waitForSelector('#cf-next, #lv-weiter',{timeout:6000});const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Spiel: '+sc);
   if(await pg.$('#lv-weiter'))await pg.click('#lv-weiter');
   const bad=await pg.evaluate(u=>{const s=new Set(u);return LAST.list.flatMap(r=>[...r.xi.flat(),...(r.ein||[]).flat()]).filter(id=>s.has(id)).length;},unav);if(bad)note(tag,bad+' gesperrte/verletzte Spieler eingesetzt');
   if(await pg.$('#cf-next'))await pg.click('#cf-next');continue;}
  if(ov.includes('Entlassen!')){actlog.push(tag+' ENTLASSEN – nehme Job');await pg.click('.ovb .opt');continue;}
  if(ov.includes('Saisonbilanz')){const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Bilanz: '+sc);
   seasons.push(await pg.evaluate(()=>{const S=FM.S,R=S.res[1].concat(S.res[2]),t1=table(1),t2=table(2),lv=S.teams.filter(t=>t.lg===1).map(t=>teamLevel(t.id)),me=myT();
    const my=squad(S.my);return{saison:S.season,team:me.name,ende:datumLang(S.tag),platz:S.summary.pos+'. ('+S.summary.lg+'. Liga), Ziel '+S.summary.target+(S.summary.ok?' erreicht':' verfehlt'),vertrauen:Math.round(S.trust),
    meister:tn(t1[0].id)+' '+t1[0].p+' Pkt',letzter:t1[17].p+' Pkt',meister2:tn(t2[0].id)+' '+t2[0].p,auf:S.summary.up.map(tn).join(', '),ab:S.summary.down.map(tn).join(', '),relegation:S.summary.relRes+' → '+tn(S.summary.rw),
    pokal:S.summary.cup!=null?tn(S.summary.cup):'-',torjaeger:S.summary.ts,toreProSpiel:+(R.reduce((a,r)=>a+r[2]+r[3],0)/R.length).toFixed(2),heimsieg:+(R.filter(r=>r[2]>r[3]).length/R.length).toFixed(2),remis:+(R.filter(r=>r[2]===r[3]).length/R.length).toFixed(2),
    niveauBL:+(lv.reduce((a,b)=>a+b,0)/18).toFixed(1)+' ('+Math.min(...lv).toFixed(1)+'–'+Math.max(...lv).toFixed(1)+')',vereinslose:S.pl.filter(p=>p.team===-1).length,spieler:S.pl.length,kader:my.length,
    konto:fmt(me.cash),kredit:fmt(S.loan),zuschauer:avgAtt()+' / '+me.cap,bilanz:Object.fromEntries(Object.entries(S.fin).sort((a,b)=>b[1]-a[1]).map(([k,v])=>[k,fmt(v)]))};}));
   const j=await pg.$('.ovb button.go:text-is("Jobangebote ansehen")');if(j){await j.click();continue;}await pg.click('.ovb button.go');continue;}
  note(tag,'Unbekanntes Fenster: '+ov.slice(0,80));await pg.evaluate(()=>closeOv());break;}
 const s=await pg.evaluate(()=>({tag:S.tag,start:S.plan.start,season:S.season,sp:sommerSprung()||S.phase==='end'||myT().urlaub>0||!!myT().urlaubFertig}));
 const wo=s.season+':'+Math.floor((s.tag-s.start)/7);proWoche[wo]=(proWoche[wo]||0)+1;
 if(s.tag-t0>7&&!s.sp)note(tag,`Sprung über ${s.tag-t0} Tage`);}
let guard=0;const t0=Date.now();
while(guard++<330){const s=await st();if(s.season>=2028)break;const tag=`${s.season}/${String(s.season+1).slice(2)} ${s.datum} W${s.wk}`;
 try{const tabs=s.wk%4===0?TABS:[TABS[s.wk%11],TABS[(s.wk*3+1)%11]];for(const t of tabs){await tabClick(t);const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,`Text in ${t}: ${sc}`);}
  if(s.phase==='play'&&!s.fired)await actions(s,tag);
  (await pg.evaluate(()=>__check())).forEach(m=>note(tag,m));
  await advance(tag);stops++;}catch(e){note(tag,'TESTFEHLER '+e.message.split('\n')[0]);await pg.evaluate(()=>{if(LIVE){liveBisEnde();liveWeiter();}else if(CONF){confEnd();closeConf();}else closeOv();}).catch(()=>{});}}
if(guard>=330)note('Ende','Zwei Saisons nicht in 330 Halten geschafft');
// Handy-Breite: Überlauf prüfen
await pg.setViewportSize({width:390,height:844});const ovf=[];
for(const t of TABS){await tabClick(t);const w=await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);if(w>1)ovf.push(t+' +'+w+'px');}
await pg.evaluate(()=>openP(squad(S.my)[0].id));let w=await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);if(w>1)ovf.push('Spielerfenster +'+w);await closeModal();
await tabClick('Büro');for(let i=0;i<10&&!(await pg.$('#kick'));i++){await pg.click('header .go');await pg.waitForTimeout(50);if(await pg.$('#trotzdem'))await pg.click('#trotzdem');}
if(await pg.$('#kick')){await pg.click('#kick');await pg.waitForTimeout(2600);w=await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);if(w>1)ovf.push('Live-Spiel +'+w);
  await pg.click('#lv-tab-elf');w=await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);if(w>1)ovf.push('Live-Spiel Aufstellung +'+w);await pg.screenshot({path:require('os').tmpdir()+'/fm-mobile-conf.png'});}
else ovf.push('kein Spiel für die Konferenz-Prüfung gefunden');
const pw=Object.values(proWoche);
console.log('DAUER',Math.round((Date.now()-t0)/1000)+'s','Halte',stops,'Erinnerungen',rem,'Halte pro Woche: Schnitt',(pw.reduce((a,b)=>a+b,0)/pw.length).toFixed(2),'höchstens',Math.max(...pw));
console.log('SAISONS',JSON.stringify(seasons,null,1));
console.log('AKTIONEN\n'+actlog.join('\n'));
console.log('HANDY-ÜBERLAUF',ovf.length?ovf.join(', '):'keiner');
const uniq=[...new Set(problems)];console.log('PROBLEME ('+problems.length+')\n'+(uniq.slice(0,60).join('\n')||'keine'));
await b.close();process.exit(problems.length?1:0);})();
