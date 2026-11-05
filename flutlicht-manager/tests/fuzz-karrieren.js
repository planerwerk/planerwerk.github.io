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

const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const pg=await b.newPage();const errs=[];
pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+path.resolve(__dirname,'..','index.html'));await pg.evaluate(INJECT);
const res=await pg.evaluate(()=>{const out=[];const rnd=a=>a[Math.floor(Math.random()*a.length)];
 const clubs=[0,6,15,16,17,18,19,20,23,34,35];
 for(const cid of clubs){const log={club:VEREINE[cid].name,seasons:[],errors:[],ms:0,changes:0};
  try{buildWorld();S.my=cid;S.mgr='Fuzz';setTarget();sponsOffers();S.lineup=bestXI(cid,myT().form);
   const t0=performance.now();let weeks=0;
   while(S.season<2028&&weeks<220){weeks++;
    try{const r=Math.random();
     if(r<0.12){const c=S.pl.filter(p=>p.team!==S.my&&p.team>=-1);const p=rnd(c);openP(p.id);const f=document.getElementById('fee');if(f)f.value=(askPrice(p)/1e6*(0.6+Math.random()*0.8)).toFixed(1);document.getElementById('yrs').value=String(1+Math.floor(Math.random()*5));offer(p.id);closeOv();}
     else if(r<0.17){const p=rnd(squad(S.my));if(p){openP(p.id);const a=document.getElementById('ask');if(a){a.value=(value(p)/1e6*(0.7+Math.random())).toFixed(1);setListed(p.id,1);}closeOv();}}
     else if(r<0.22){if(S.offers.length)acceptOffer(0);}
     else if(r<0.25){loan(rnd([1,5,-1,-99]));}
     else if(r<0.28){startBuild(rnd(['cap','logen','shop']));}
     else if(r<0.32){setForm(rnd(Object.keys(RE.formationen)));setTac(rnd(['N','O','D','K']));setEin(rnd(['F','N','H']));}
     else if(r<0.35){S.train=Math.floor(Math.random()*3);myT().youth=1+Math.floor(Math.random()*5);setPrice(5+Math.random()*80);}
     else if(r<0.38){const e=squad(S.my).filter(p=>p.ct<=1);if(e.length){openP(e[0].id);extend(e[0].id);closeOv();}}
     else if(r<0.40){const sq=squad(S.my).sort((a,b)=>a.str-b.str);if(sq.length>18){openP(sq[0].id);release(sq[0].id);}}
     else if(r<0.42){const p=rnd(S.pl);openP(p.id);document.getElementById('e_s').value=String(40+Math.floor(Math.random()*55));saveEdit(p.id);closeOv();}
     if(S.sponsOffers&&Math.random()<0.5)pickSponsor(Math.floor(Math.random()*3));
     for(const k in V){const h=V[k]().replace(/<[^>]+>/g,' ');const m=h.match(/.{0,50}(undefined|NaN|\[object|Infinity|\bnull\b).{0,30}/);if(m)log.errors.push('Text '+k+': '+m[0]);}
     const hh=hdr().replace(/<[^>]+>/g,' ');if(/undefined|NaN/.test(hh))log.errors.push('Kopfzeile: '+hh.slice(0,120));
    }catch(e){log.errors.push('Aktion: '+e.message+' @'+(e.stack||'').split('\n')[1]);}
    if(S.phase==='end'){const sm=S.summary;log.seasons.push(`${sm.season}: Platz ${sm.pos} (${sm.lg}. Liga), Ziel ${sm.target} ${sm.ok?'erreicht':'verfehlt'}${S.fired?', entlassen':''}`);
     if(S.fired){if(!S.jobs)mkJobs();takeJob(S.jobs[0]);log.changes++;}const lgOld=myT().lg;newSeason();log.seasons.push(`  → ${S.season}: ${myT().name} in Liga ${myT().lg}${lgOld!==myT().lg?(myT().lg===1?' (AUFGESTIEGEN)':' (ABGESTIEGEN)'):''}, Kader ${squad(S.my).length}, Konto ${fmt(myT().cash)}`);
     const ce=__check();if(ce.length)log.errors.push('nach Saisonwechsel: '+[...new Set(ce)].slice(0,4).join('; '));continue;}
    if(S.fired){if(!S.jobs)mkJobs();takeJob(S.jobs[0]);log.changes++;}
    if(S.wk>=S.cal.length){seasonEnd();continue;}
    const unav=new Set(S.pl.filter(p=>!avail(p)).map(p=>p.id));
    const o=playWeek();LAST=o;
    if(o.list.flatMap(r=>r.xi.flat()).some(id=>unav.has(id)))log.errors.push(`S${S.season} W${S.wk}: gesperrter/verletzter Spieler eingesetzt`);
    const ce=__check();if(ce.length)log.errors.push(`S${S.season} W${S.wk}: `+[...new Set(ce)].slice(0,4).join('; '));}
   log.ms=+((performance.now()-t0)/weeks).toFixed(1);
  }catch(e){log.errors.push('FATAL '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' '));}
  log.errors=[...new Set(log.errors)].slice(0,8);out.push(log);}
 return out;});
for(const r of res){console.log(`\n${r.club}: ${r.ms} ms/Woche, Jobwechsel ${r.changes}\n  `+r.seasons.join('\n  ')+(r.errors.length?'\n  FEHLER:\n   - '+r.errors.join('\n   - '):'\n  keine Fehler'));}
console.log('\nSeitenfehler:',errs.length?[...new Set(errs)].join(' | '):'keine');await b.close();})();
