// 11 Karrieren mit verschiedenen Vereinen, je zwei Saisons, mit zufälligen Aktionen und denselben Datenprüfungen.
// Spiel und Testaktionen laufen mit festem Seed je Verein: Ein Fehler lässt sich mit derselben Zahl nachstellen.
const {chromium}=require('playwright');const path=require('path');const PRUEFUNGEN=require('./pruefungen.js');
(async()=>{const b=await chromium.launch();const pg=await b.newPage();const errs=[];
pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+path.resolve(__dirname,'..','index.html'));await pg.evaluate(PRUEFUNGEN);
const res=await pg.evaluate(()=>{const out=[];
 // Speichern ersetzt: Der Test läuft ohne Pause, und jedes Speichern (fast 1 MB) staut sich sonst im Browser. Speichern und Laden prüft tests/seed.js.
 let saves=0;window.save=function(){saves++;};
 // Prüfung jedes Spieltags: kein gesperrter oder verletzter Spieler darf spielen
 // Sperren gelten je Wettbewerb (K09): ein in der Liga gesperrter Spieler darf im Pokal spielen
 let bad=0;const orig=window.tagesSpiele;window.tagesSpiele=function(d){const vor=new Map(S.pl.map(p=>[p.id,{inj:p.inj>0,liga:sperreIn(p,'liga')>0,pokal:sperreIn(p,'pokal')>0}]));const o=orig(d);
   bad+=o.list.flatMap(r=>{const w=wbVon(r);return[...r.xi.flat(),...(r.ein||[]).flat()].filter(id=>{const x=vor.get(id),p=PIX.get(id);return x&&((x.inj&&!(p&&p.spritzeAm===d))||x[w]);});}).length;return o;}; // fit gespritzt (K10) darf spielen
 const clubs=[0,6,15,16,17,18,19,20,23,34,35,36,50];
 for(const cid of clubs){const log={club:VEREINE[cid].name,seed:1000+cid,seasons:[],errors:[],ms:0,changes:0,stops:0};
  let x=(cid*2654435761)>>>0;const T=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;},rnd=a=>a[Math.floor(T()*a.length)];
  let lgVor=0;try{buildWorld(log.seed);S.my=cid;S.mgr='Fuzz';setTarget();sponsOffers();S.lineup=bestXI(cid,myT().form);bad=0;
   const t0=performance.now();let steps=0;
   lgVor=myT().lg;while(S.season<2028&&steps<500){steps++;
    try{const r=T();
     if(r<0.12){const c=S.ausland&&T()<0.3?S.ausland.pl:S.pl.filter(p=>p.team!==S.my&&p.team>=-1);const p=rnd(c);openP(p.id);const f=document.getElementById('fee');if(f)f.value=(askPrice(p)/1e6*(0.6+T()*0.8)).toFixed(1);document.getElementById('yrs').value=String(1+Math.floor(T()*5));offer(p.id);closeOv();}
     else if(r<0.17){const p=rnd(squad(S.my));if(p){openP(p.id);const a=document.getElementById('ask');if(a){a.value=(value(p)/1e6*(0.7+T())).toFixed(1);setListed(p.id,1);}closeOv();}}
     else if(r<0.22){if(S.offers.length)acceptOffer(0);}
     else if(r<0.25){loan(rnd([1,5,-1,-99]));}
     else if(r<0.28){startBuild(rnd(['cap','logen','shop']));}
     else if(r<0.32){setForm(rnd(Object.keys(RE.formationen)));setTac(rnd(['N','O','D','K']));setEin(rnd(['F','N','H']));}
     else if(r<0.35){setVorlage(['auto','standard','aufbau','schonen'][Math.floor(T()*4)]);myT().youth=1+Math.floor(T()*5);setPrice(5+T()*80);}
     else if(r<0.38){const e=squad(S.my).filter(p=>p.ct<=1);if(e.length){openP(e[0].id);extend(e[0].id);closeOv();}}
     else if(r<0.40){const sq=squad(S.my).sort((a,b)=>a.str-b.str);if(sq.length>18){openP(sq[0].id);release(sq[0].id);}}
     else if(r<0.42){const p=rnd(S.pl);openP(p.id);if(document.getElementById('e_s')||typeof saveEdit!=='undefined')log.errors.push('Bearbeiten im Spiel ist noch vorhanden');closeOv();}
     else if(r<0.44){tab('aufst');}
     if(S.sponsOffers&&T()<0.5)pickSponsor(Math.floor(T()*3));
     TF.lg=T()<0.2?'a':'';TF.land=TF.lg&&T()<0.5?rnd(auslandGruppen()):''; // Transfermarkt auch mit dem Filter Ausland prüfen (K32)
     for(const k in V){const h=V[k]().replace(/<[^>]+>/g,' ');const m=h.match(/.{0,50}(undefined|NaN|\[object|Infinity|\bnull\b).{0,30}/);if(m)log.errors.push('Text '+k+': '+m[0]);}
     const hh=hdr().replace(/<[^>]+>/g,' ');if(/undefined|NaN/.test(hh))log.errors.push('Kopfzeile: '+hh.slice(0,120));
     erinnerungen().forEach(e=>{if(/undefined|NaN/.test(e.text))log.errors.push('Erinnerung: '+e.text);});
    }catch(e){log.errors.push('Aktion: '+e.message+' @'+(e.stack||'').split('\n')[1]);}
    if(S.phase==='end'){const sm=S.summary;log.seasons.push(`${sm.season}: Platz ${sm.pos} (${sm.lg}. Liga), Ziel ${sm.target} ${sm.ok?'erreicht':'verfehlt'}${S.fired?', entlassen':''}, Ende ${datumKurz(S.tag)}`);
     if(S.fired){if(!S.jobs)mkJobs();takeJob(S.jobs[0]);log.changes++;}sommerpause();lgVor=myT().lg;continue;}
    if(S.fired){if(!S.jobs)mkJobs();takeJob(S.jobs[0]);log.changes++;}
    if(heuteMeinSpiel()){LAST=tagesSpiele(S.tag);}
    const s0=S.season,t1=S.tag,sp0=sommerSprung(),n=weiter(),sp=sp0||sommerSprung()||S.phase==='end'||myT().urlaub>0||!!myT().urlaubFertig;/* im Urlaub und Laufplan darf der Kalender weiter springen (K12a) */log.stops++;
    if(S.season!==s0){log.seasons.push(`  → ${S.season}: ${myT().name} in Liga ${myT().lg}${lgVor!==myT().lg?(myT().lg<lgVor?' (AUFGESTIEGEN)':' (ABGESTIEGEN)'):''}, Kader ${squad(S.my).length}, Konto ${fmt(myT().cash)}, Start ${datumKurz(S.tag)}`);const ce=__check();if(ce.length)log.errors.push('nach Saisonwechsel: '+[...new Set(ce)].slice(0,4).join('; '));continue;}if(!sp&&(n>7||(S.season===s0&&S.tag-t1>7)))log.errors.push(`Sprung über ${S.tag-t1} Tage`);
    const ce=__check();if(ce.length)log.errors.push(`S${S.season} ${datumKurz(S.tag)}: `+[...new Set(ce)].slice(0,4).join('; '));}
   if(bad)log.errors.push(bad+'× gesperrter/verletzter Spieler eingesetzt');
   if(steps>=500)log.errors.push('Zwei Saisons nicht in 500 Schritten geschafft');
   log.ms=+((performance.now()-t0)/log.stops).toFixed(1);
  }catch(e){log.errors.push('FATAL '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' '));}
  log.errors=[...new Set(log.errors)].slice(0,8);out.push(log);}
 return out;});
let fehler=0;for(const r of res){fehler+=r.errors.length;console.log(`\n${r.club} (Seed ${r.seed}): ${r.stops} Halte, ${r.ms} ms pro Halt, Jobwechsel ${r.changes}\n  `+r.seasons.join('\n  ')+(r.errors.length?'\n  FEHLER:\n   - '+r.errors.join('\n   - '):'\n  keine Fehler'));}
console.log('\nSeitenfehler:',errs.length?[...new Set(errs)].join(' | '):'keine');await b.close();process.exit(fehler||errs.length?1:0);})();
