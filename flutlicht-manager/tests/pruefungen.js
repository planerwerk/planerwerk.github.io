// Gemeinsame Datenprüfungen für alle Testskripte. Läuft im Browser (page.evaluate(PRUEFUNGEN)).
// __check() liefert eine Liste von Befunden, __scan() sucht kaputte Texte auf dem Bildschirm.
module.exports=()=>{
 window.__check=function(){const e=[];
  const c1=S.teams.filter(t=>t.lg===1).length,c2=S.teams.filter(t=>t.lg===2).length;if(c1!==18||c2!==18)e.push(`Ligagrößen ${c1}/${c2}`);
  const ids=new Set();
  S.pl.forEach(p=>{if(ids.has(p.id))e.push('doppelte ID '+p.id);ids.add(p.id);
   for(const k of ['str','pot','form','fit','sal','age','ct','inj','sus','g','apps','yc'])if(typeof p[k]!=='number'||!isFinite(p[k]))e.push(`Spieler ${p.n} ${k}=${p[k]}`);
   if(p.team>=S.teams.length||p.team<-1)e.push(`Spieler ${p.n} team=${p.team}`);
   if(!['TW','AB','MF','ST'].includes(p.pos))e.push('Pos '+p.pos);
   if(p.fit<0||p.fit>100)e.push('Fitness außerhalb '+p.fit);if(p.form<0||p.form>10)e.push('Form außerhalb '+p.form);if(p.str<20||p.str>99)e.push('Stärke außerhalb '+p.str);
   if(p.inj<0||p.sus<0)e.push(`negative Ausfallzeit ${p.n}`);});
  if(PIX.size!==S.pl.length)e.push(`PIX ${PIX.size} vs ${S.pl.length}`);
  S.pl.forEach(p=>{if(PIX.get(p.id)!==p)e.push('PIX veraltet '+p.id);});
  S.teams.forEach(t=>{for(const k of ['cash','rep','cap','fans','price','logen','shop','youth'])if(!isFinite(t[k]))e.push(`Team ${t.name} ${k}=${t[k]}`);
   const n=S.pl.filter(p=>p.team===t.id).length;if(t.id!==S.my&&(n<15||n>36))e.push(`Kader ${t.name}: ${n}`);});
  if(!isFinite(S.trust)||S.trust<0||S.trust>100)e.push('Vertrauen '+S.trust);
  for(const k in S.fin)if(!isFinite(S.fin[k]))e.push('Finanzposten '+k+'='+S.fin[k]);
  if(!isFinite(S.loan))e.push('Kredit NaN');
  if(!Array.isArray(S.zufall)||S.zufall.length!==4||S.zufall.some(x=>!Number.isInteger(x)||x<0||x>4294967295))e.push('Zufallszustand kaputt');
  const xi=myXI(),nn=xi.filter(x=>x!=null);if(new Set(nn).size!==nn.length)e.push('Doppelter Spieler in Startelf');
  nn.forEach(id=>{const p=PIX.get(id);if(!p||p.team!==S.my||!avail(p))e.push('ungültiger Startelf-Spieler '+id);});
  // Kalender
  if(!Number.isInteger(S.tag)||S.tag<S.plan.start||S.tag>S.plan.ende)e.push(`Tag ${S.tag} außerhalb der Saison`);
  if(S.gespielt>S.tag)e.push('gespielt liegt in der Zukunft');
  const vorbei=d=>d<S.tag||(d===S.tag&&S.gespielt===d);
  if(S.phase==='play'){[1,2].forEach(lg=>{const tb=table(lg),sp=tb.map(r=>r.sp);if(Math.max(...sp)!==Math.min(...sp))e.push('ungleiche Spielanzahl Liga '+lg);
    const soll=S.plan.liga[lg].filter(vorbei).length;if(sp[0]!==soll)e.push(`Liga ${lg}: ${sp[0]} Spiele, laut Kalender ${soll}`);
    const pts=tb.reduce((a,r)=>a+r.p,0),g=S.res[lg].length,d=S.res[lg].filter(r=>r[2]===r[3]).length;if(pts!==g*3-d)e.push('Punkte inkonsistent');});
   const ex=64>>S.cup.hist.length;if(S.cup.alive.length!==ex)e.push(`Pokal ${S.cup.alive.length} statt ${ex}`);if(new Set(S.cup.alive).size!==S.cup.alive.length)e.push('Pokal doppelt');
   const cupSoll=S.plan.pokal.filter(vorbei).length;if(S.cup.hist.length!==cupSoll)e.push(`Pokal: ${S.cup.hist.length} Runden, laut Kalender ${cupSoll}`);}
  S.offers.forEach(o=>{if(!PIX.get(o.pid))e.push('Angebot ohne Spieler');if(!(o.bis>=S.tag))e.push('abgelaufenes Angebot liegt noch vor');});
  if(S.constr&&!(S.constr.bis>S.tag))e.push('Bau hätte fertig sein müssen');
  return e;};
 window.__scan=function(){const t=document.getElementById('app').innerText+' || '+document.getElementById('ov').innerText;const re=/undefined|NaN|\[object|\bnull\b|Infinity/;const i=t.search(re);return i<0?'':t.slice(Math.max(0,i-70),i+40).replace(/\s+/g,' ');};
};
