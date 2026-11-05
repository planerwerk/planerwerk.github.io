// Zwei Saisons über die echte Oberfläche spielen, mit Aktionen und Prüfungen nach jeder Woche.
const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(__dirname,'..','index.html');
const problems=[];const note=(w,m)=>{problems.push(`[${w}] ${m}`);};
const seasons=[];const actlog=[];
const TABS=['Büro','Kader','Aufstellung','Tabelle','Spielplan','Pokal','Transfers','Finanzen','Stadion','Training & Jugend'];
const INJECT=()=>{
 window.__check=function(){const S=FM.S,e=[];
  const c1=S.teams.filter(t=>t.lg===1).length,c2=S.teams.filter(t=>t.lg===2).length;if(c1!==18||c2!==18)e.push(`Ligagrößen ${c1}/${c2}`);
  const ids=new Set();
  S.pl.forEach(p=>{if(ids.has(p.id))e.push('doppelte ID '+p.id);ids.add(p.id);
   for(const k of ['str','pot','form','fit','sal','age','ct','inj','sus','g','apps','yc'])if(typeof p[k]!=='number'||!isFinite(p[k]))e.push(`Spieler ${p.n} ${k}=${p[k]}`);
   if(p.team>=S.teams.length||p.team<-1)e.push(`Spieler ${p.n} team=${p.team}`);
   if(!['TW','AB','MF','ST'].includes(p.pos))e.push('Pos '+p.pos);
   if(p.fit<0||p.fit>100)e.push('Fitness außerhalb '+p.fit);if(p.form<0||p.form>10)e.push('Form außerhalb '+p.form);if(p.str<20||p.str>99)e.push('Stärke außerhalb '+p.str);});
  if(PIX.size!==S.pl.length)e.push(`PIX ${PIX.size} vs ${S.pl.length}`);
  S.pl.forEach(p=>{if(PIX.get(p.id)!==p)e.push('PIX veraltet '+p.id);});
  S.teams.forEach(t=>{for(const k of ['cash','rep','cap','fans','price','logen','shop','youth'])if(!isFinite(t[k]))e.push(`Team ${t.name} ${k}=${t[k]}`);
   const n=S.pl.filter(p=>p.team===t.id).length;if(t.id!==S.my&&(n<15||n>36))e.push(`Kader ${t.name}: ${n}`);});
  if(!isFinite(S.trust)||S.trust<0||S.trust>100)e.push('Vertrauen '+S.trust);
  for(const k in S.fin)if(!isFinite(S.fin[k]))e.push('Finanzposten '+k+'='+S.fin[k]);
  if(!isFinite(S.loan))e.push('Kredit NaN');
  const xi=myXI(),nn=xi.filter(x=>x!=null);if(new Set(nn).size!==nn.length)e.push('Doppelter Spieler in Startelf');
  nn.forEach(id=>{const p=PIX.get(id);if(!p||p.team!==S.my||!avail(p))e.push('ungültiger Startelf-Spieler '+id);});
  if(S.phase==='play'){[1,2].forEach(lg=>{const tb=table(lg),sp=tb.map(r=>r.sp);if(Math.max(...sp)!==Math.min(...sp))e.push('ungleiche Spielanzahl Liga '+lg);
    const pts=tb.reduce((a,r)=>a+r.p,0),g=S.res[lg].length,d=S.res[lg].filter(r=>r[2]===r[3]).length;if(pts!==g*3-d)e.push('Punkte inkonsistent');});
   const ex=64>>S.cup.hist.length;if(S.cup.alive.length!==ex)e.push(`Pokal ${S.cup.alive.length} statt ${ex}`);if(new Set(S.cup.alive).size!==S.cup.alive.length)e.push('Pokal doppelt');}
  S.offers.forEach(o=>{if(!PIX.get(o.pid))e.push('Angebot ohne Spieler');});
  return e;};
 window.__scan=function(){const t=document.getElementById('app').innerText+' || '+document.getElementById('ov').innerText;const re=/undefined|NaN|\[object|\bnull\b|Infinity/;const i=t.search(re);return i<0?'':t.slice(Math.max(0,i-70),i+40).replace(/\s+/g,' ');};
};
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:900}});const pg=await ctx.newPage();
pg.on('pageerror',e=>note('JS','PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(1,3).join(' ')));
pg.on('console',m=>{if(m.type()==='error')note('JS','CONSOLE '+m.text());});
await pg.goto(FILE);await pg.evaluate(()=>{try{localStorage.clear();}catch(e){}});await pg.reload();
await pg.selectOption('#club',{label:'SC Freiburg'});await pg.fill('#mgr','Testtrainer');await pg.click('text=Anpfiff zur Karriere');
await pg.evaluate(INJECT);
const st=()=>pg.evaluate(()=>({phase:FM.S.phase,wk:FM.S.wk,season:FM.S.season,fired:FM.S.fired,team:FM.S.teams[FM.S.my].name}));
const tabClick=async t=>{await pg.click(`.tabs button:text-is("${t}")`);};
const closeModal=async()=>{const x=await pg.$('.ovb .x');if(x)await x.click();else await pg.evaluate(()=>closeOv());};
const msgOrClosed=async()=>{await pg.waitForTimeout(60);const open=await pg.$('#msg');if(open){const m=(await open.innerText()).trim();await closeModal();return 'abgelehnt: '+m;}return 'OK';};

async function actions(s,tag){const wk=s.wk,yr=s.season;
 await tabClick('Büro');
 const sp=await pg.$$('.card:has(h3:text-is("Trikotsponsor wählen")) .opt');if(sp.length){await sp[yr%3].click();actlog.push(tag+' Sponsor gewählt');}
 const acc=await pg.$$('button:text-is("Annehmen")');if(acc.length){if(wk%3){await acc[0].click();actlog.push(tag+' Angebot angenommen');}else{await (await pg.$('button:text-is("Ablehnen")')).click();actlog.push(tag+' Angebot abgelehnt');}}
 if(yr===2026&&wk===1){await tabClick('Aufstellung');await pg.selectOption('#formsel','4-3-3');await pg.selectOption('#tacsel','O');await pg.selectOption('#einsel','H');
   const opts=await pg.$$eval('#slot5 option:not([disabled])',o=>o.map(x=>x.value));if(opts.length>3)await pg.selectOption('#slot5',opts[3]);
   await pg.click('button:text-is("Beste Elf automatisch aufstellen")');actlog.push(tag+' Taktik geändert');}
 if(yr===2026&&wk===2){await tabClick('Training & Jugend');await pg.click('.opt:has(b:text-is("Hart"))');await pg.click('.opt:has(b:text-is("Stufe 4"))');
   await tabClick('Finanzen');await pg.fill('#price','38');await pg.locator('#price').dispatchEvent('change');await pg.click('button:text-is("+5 Mio leihen")');
   await tabClick('Stadion');await pg.click('.opt:has(b:text-is("Tribüne ausbauen"))');actlog.push(tag+' Training hart, Jugend 4, Preis 38, Kredit, Tribüne');}
 if(wk===3||wk===18){// Kauf eines gelisteten, bezahlbaren, guten Spielers
   const id=await pg.evaluate(()=>{const t=myT(),lv=teamLevel(S.my);const c=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&p.list&&p.str>lv-3&&askPrice(p)<t.cash*0.7).sort((a,b)=>b.str-a.str);return c.length?c[0].id:null;});
   if(id!=null){await pg.evaluate(i=>openP(i),id);await pg.click('button:text-is("Angebot abgeben")');actlog.push(tag+' Kauf Listenspieler: '+await msgOrClosed());}else actlog.push(tag+' kein passender Listenspieler');
   const star=await pg.evaluate(()=>{const c=S.pl.filter(p=>p.team===0&&!p.list).sort((a,b)=>b.str-a.str);return c[0].id;});// Bayern-Star, Billigangebot
   await pg.evaluate(i=>openP(i),star);await pg.fill('#fee','0.5');await pg.click('button:text-is("Angebot abgeben")');actlog.push(tag+' Billigangebot für Bayern-Star: '+await msgOrClosed());}
 if(wk===5){await tabClick('Transfers');await pg.selectOption('#tf_lg','f');const row=await pg.$('tbody tr.click');if(row){await row.click();await pg.click('button:text-is("Verpflichten")');actlog.push(tag+' Vereinsloser: '+await msgOrClosed());}
   await pg.selectOption('#tf_lg','');await pg.fill('#tf_q','Bayern');await pg.locator('#tf_q').dispatchEvent('change');await pg.click('#tf_list');await pg.selectOption('#tf_max','10');
   await pg.selectOption('#tf_pos','ST');await pg.fill('#tf_q','');await pg.locator('#tf_q').dispatchEvent('change');}
 if(wk===6){const id=await pg.evaluate(()=>squad(S.my).sort((a,b)=>a.str-b.str)[0].id);await pg.evaluate(i=>openP(i),id);
   await pg.fill('#ask',String(await pg.evaluate(i=>(value(PIX.get(i))*0.8/1e6).toFixed(1),id)));await pg.click('button:text-is("Auf die Transferliste setzen")');await closeModal();actlog.push(tag+' Spieler auf Transferliste');}
 if(yr===2026&&wk===8){await tabClick('Menü');const exp=await pg.$eval('#exp',e=>e.value);const before=await pg.evaluate(()=>JSON.stringify(S));
   if(exp!==before)note(tag,'Export-Code weicht vom Spielstand ab');await pg.fill('#imp',exp);await pg.click('button:text-is("Laden")');
   const after=await pg.evaluate(()=>JSON.stringify(S));if(after!==before)note(tag,'Import ergibt anderen Spielstand');actlog.push(tag+' Export/Import geprüft');}
 if(yr===2026&&wk===12){const before=await st();await pg.reload();await pg.click('button:text-is("Weiterspielen")');await pg.evaluate(INJECT);const after=await st();
   if(JSON.stringify(before)!==JSON.stringify(after))note(tag,'Nach Neuladen anderer Stand');actlog.push(tag+' Neu geladen, weitergespielt');}
 if(wk===10){await tabClick('Stadion');const l=await pg.$('.opt:has(b:text-is("10 VIP-Logen"))');if(l){await l.click();actlog.push(tag+' Logen gebaut (falls Geld)');}}
 if(wk===16){await tabClick('Stadion');const f=await pg.$('.opt:has(b:has-text("Fanshop"))');if(f){await f.click();actlog.push(tag+' Fanshop');}}
 if(wk===20){await tabClick('Finanzen');await pg.click('button:text-is("Alles tilgen")');}
 if(wk===24){const ids=await pg.evaluate(()=>squad(S.my).filter(p=>p.ct<=1).map(p=>p.id));for(const id of ids.slice(0,8)){await pg.evaluate(i=>openP(i),id);await pg.selectOption('#ext','2');await pg.click('button:text-is("Verlängern")');await closeModal();}actlog.push(tag+` ${Math.min(8,ids.length)} Verträge verlängert`);}
 if(wk===26){const id=await pg.evaluate(()=>squad(S.my)[0].id);await pg.evaluate(i=>openP(i),id);await pg.click('summary:text-is("Spielerdaten bearbeiten")');
   await pg.fill('#e_n','Test Spieler');await pg.fill('#e_s','81');await pg.click('button:text-is("Übernehmen")');const ok=await pg.evaluate(i=>PIX.get(i).n==='Test Spieler'&&Math.round(PIX.get(i).str)===81,id);if(!ok)note(tag,'Bearbeiten hat nicht gegriffen');await closeModal();}
 if(wk===30){const id=await pg.evaluate(()=>squad(S.my).sort((a,b)=>a.str-b.str)[0].id);await pg.evaluate(i=>openP(i),id);await pg.click('button:has-text("Vertrag auflösen")');actlog.push(tag+' Spieler freigestellt');}
 if(yr===2027&&wk===2){await tabClick('Training & Jugend');await pg.click('.opt:has(b:text-is("Normal"))');await tabClick('Aufstellung');await pg.selectOption('#formsel','3-5-2');}
 if(yr===2027&&wk===9){await pg.evaluate(()=>{S.trust=5;});actlog.push(tag+' Vertrauen künstlich auf 5 gesetzt (Entlassung testen)');}
 // zufälliger Fremdspieler öffnen/schließen, Spieltag und Liga umschalten
 const rid=await pg.evaluate(()=>S.pl[Math.floor(Math.random()*S.pl.length)].id);await pg.evaluate(i=>openP(i),rid);const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Spielerfenster: '+sc);await closeModal();
 if(wk%5===0){await tabClick('Spielplan');await pg.selectOption('#daysel',String(wk%34));await tabClick('Tabelle');await pg.click('button:text-is("2. Liga")');}
}
async function advance(tag){await tabClick('Büro');await pg.click('header .go');
 for(let k=0;k<8;k++){await pg.waitForTimeout(40);const ov=(await pg.evaluate(()=>document.getElementById('ov').innerText)).trim();if(!ov)return;
  if(await pg.$('#kick')){const unav=await pg.evaluate(()=>S.pl.filter(p=>!avail(p)).map(p=>p.id));await pg.click('#kick');
   if(Math.random()<0.08){await pg.waitForTimeout(800);await pg.click('#cf-speed');await pg.waitForTimeout(700);}await pg.click('.ovb button:text-is("Zum Abpfiff")',{timeout:4000});
   await pg.waitForSelector('.ovb button.go:text-is("Weiter")',{timeout:6000});const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Konferenz: '+sc);
   const bad=await pg.evaluate(u=>{const s=new Set(u);return LAST.list.flatMap(r=>r.xi.flat()).filter(id=>s.has(id)).length;},unav);if(bad)note(tag,bad+' gesperrte/verletzte Spieler eingesetzt');
   await pg.click('.ovb button.go:text-is("Weiter")');continue;}
  if(ov.includes('Entlassen!')){actlog.push(tag+' ENTLASSEN – nehme Job');await pg.click('.ovb .opt');continue;}
  if(ov.includes('Saisonbilanz')){const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,'Bilanz: '+sc);
   seasons.push(await pg.evaluate(()=>{const S=FM.S,R=S.res[1].concat(S.res[2]),t1=table(1),t2=table(2),lv=S.teams.filter(t=>t.lg===1).map(t=>teamLevel(t.id)),me=myT();
    const my=squad(S.my);return{saison:S.season,team:me.name,platz:S.summary.pos+'. ('+S.summary.lg+'. Liga), Ziel '+S.summary.target+(S.summary.ok?' erreicht':' verfehlt'),vertrauen:Math.round(S.trust),
    meister:tn(t1[0].id)+' '+t1[0].p+' Pkt',letzter:t1[17].p+' Pkt',meister2:tn(t2[0].id)+' '+t2[0].p,auf:S.summary.up.map(tn).join(', '),ab:S.summary.down.map(tn).join(', '),relegation:S.summary.relRes+' → '+tn(S.summary.rw),
    pokal:S.summary.cup!=null?tn(S.summary.cup):'-',torjaeger:S.summary.ts,toreProSpiel:+(R.reduce((a,r)=>a+r[2]+r[3],0)/R.length).toFixed(2),heimsieg:+(R.filter(r=>r[2]>r[3]).length/R.length).toFixed(2),remis:+(R.filter(r=>r[2]===r[3]).length/R.length).toFixed(2),
    niveauBL:+(lv.reduce((a,b)=>a+b,0)/18).toFixed(1)+' ('+Math.min(...lv).toFixed(1)+'–'+Math.max(...lv).toFixed(1)+')',vereinslose:S.pl.filter(p=>p.team===-1).length,spieler:S.pl.length,kader:my.length,
    konto:fmt(me.cash),kredit:fmt(S.loan),zuschauer:avgAtt()+' / '+me.cap,bilanz:Object.fromEntries(Object.entries(S.fin).sort((a,b)=>b[1]-a[1]).map(([k,v])=>[k,fmt(v)]))};}));
   const j=await pg.$('.ovb button.go:text-is("Jobangebote ansehen")');if(j){await j.click();continue;}await pg.click('.ovb button.go');continue;}
  note(tag,'Unbekanntes Overlay: '+ov.slice(0,80));await pg.evaluate(()=>closeOv());return;}
 note(tag,'Overlay ging nicht zu');}
let guard=0;const t0=Date.now();
while(guard++<300){const s=await st();if(s.season>=2028)break;const tag=`${s.season}/${String(s.season+1).slice(2)} W${s.wk}`;
 try{const tabs=s.wk%4===0?TABS:[TABS[s.wk%10],TABS[(s.wk*3+1)%10]];for(const t of tabs){await tabClick(t);const sc=await pg.evaluate(()=>__scan());if(sc)note(tag,`Text in ${t}: ${sc}`);}
  if(s.phase==='play'&&!s.fired)await actions(s,tag);
  (await pg.evaluate(()=>__check())).forEach(m=>note(tag,m));
  await advance(tag);}catch(e){note(tag,'TESTFEHLER '+e.message.split('\n')[0]);await pg.evaluate(()=>{if(CONF){confEnd();closeConf();}else closeOv();}).catch(()=>{});}}
// Handy-Breite: Überlauf prüfen
await pg.setViewportSize({width:390,height:844});const ovf=[];
for(const t of TABS){await tabClick(t);const w=await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);if(w>1)ovf.push(t+' +'+w+'px');}
await pg.evaluate(()=>openP(squad(S.my)[0].id));let w=await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);if(w>1)ovf.push('Spielerfenster +'+w);await closeModal();
await tabClick('Büro');await pg.click('header .go');if(await pg.$('#kick')){await pg.click('#kick');await pg.waitForTimeout(2600);w=await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);if(w>1)ovf.push('Konferenz +'+w);await pg.screenshot({path:require('os').tmpdir()+'/fm-mobile-conf.png'});}
console.log('DAUER',Math.round((Date.now()-t0)/1000)+'s','Schritte',guard);
console.log('SAISONS',JSON.stringify(seasons,null,1));
console.log('AKTIONEN\n'+actlog.join('\n'));
console.log('HANDY-ÜBERLAUF',ovf.length?ovf.join(', '):'keiner');
const uniq=[...new Set(problems)];console.log('PROBLEME ('+problems.length+')\n'+(uniq.slice(0,60).join('\n')||'keine'));
await b.close();})();
