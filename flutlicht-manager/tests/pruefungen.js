// Gemeinsame Datenprüfungen für alle Testskripte. Läuft im Browser (page.evaluate(PRUEFUNGEN)).
// __check() liefert eine Liste von Befunden, __scan() sucht kaputte Texte auf dem Bildschirm.
module.exports=()=>{
 window.__check=function(){const e=[];
  const gr=[1,2,3,4].map(l=>S.teams.filter(t=>t.lg===l).length);if(gr[0]!==18||gr[1]!==18||gr[2]!==20)e.push(`Ligagrößen ${gr.join('/')}`);
  const ids=new Set();
  S.pl.forEach(p=>{if(ids.has(p.id))e.push('doppelte ID '+p.id);ids.add(p.id);
   for(const k of ['str','pot','form','fit','ko','sp','sv','sal','age','ct','inj','g','apps'])if(typeof p[k]!=='number'||!isFinite(p[k]))e.push(`Spieler ${p.n} ${k}=${p[k]}`);
   // Sperren und Gelbe Karten je Wettbewerb (K09); alte Spielstände haben noch sus und yc
   if(p.sperre||p.kt){for(const w of ['liga','pokal']){const s=p.sperre&&p.sperre[w],k=p.kt&&p.kt[w];if(p.sperre&&!(s&&[s.rot,s.gelb].every(x=>typeof x==='number'&&isFinite(x))))e.push(`Spieler ${p.n} sperre.${w}=${JSON.stringify(s)}`);if(p.kt&&!(typeof k==='number'&&isFinite(k)))e.push(`Spieler ${p.n} kt.${w}=${k}`);}}
   else if(typeof p.sus!=='number'||typeof p.yc!=='number')e.push(`Spieler ${p.n} ohne Sperren und Karten`);
   if(p.team>=S.teams.length||p.team<-1)e.push(`Spieler ${p.n} team=${p.team}`);
   if(!['TW','AB','MF','ST'].includes(p.pos))e.push('Pos '+p.pos);
   if(p.fit<0||p.fit>100)e.push('Frische außerhalb '+p.fit);if(p.form<0||p.form>20)e.push('Form außerhalb '+p.form);if(p.ko<0||p.ko>100)e.push('Kondition außerhalb '+p.ko);if(p.sp<0||p.sp>100)e.push('Spielpraxis außerhalb '+p.sp);if(p.sv<-3||p.sv>3)e.push('Selbstvertrauen außerhalb '+p.sv);if(p.str<20||p.str>99)e.push('Stärke außerhalb '+p.str);
   if(p.inj<0||(p.sperre&&['liga','pokal'].some(w=>p.sperre[w].rot<0||p.sperre[w].gelb<0)))e.push(`negative Ausfallzeit ${p.n}`);});
  const pool=S.ausland?S.ausland.pl:[],jg=S.jg||[];if(PIX.size!==S.pl.length+pool.length+jg.length)e.push(`PIX ${PIX.size} vs ${S.pl.length}+${pool.length}+${jg.length}`);
  // Jugendkader (K08): eigene Liste, eigener Nummernkreis, 15 bis 18 Jahre, nie im Profikader
  jg.forEach(p=>{if(PIX.get(p.id)!==p)e.push('PIX kennt Jugendspieler nicht '+p.id);if(p.team!==-3||p.id<500000||p.age<15||p.age>18||!(p.str<=p.pot+0.01))e.push('Jugendspieler außerhalb des Rahmens '+p.id);});
  if(S.pl.some(p=>p.team===-3))e.push('Jugendspieler im Profikader');const tj=S.teams[S.my];if(tj.jn!=null&&!(tj.jn>=0&&tj.jn<=REGELN.jugend.niveau.deckel))e.push('Jugendniveau außerhalb des Rahmens '+tj.jn);
  S.pl.forEach(p=>{if(PIX.get(p.id)!==p)e.push('PIX veraltet '+p.id);});
  S.teams.forEach(t=>{for(const k of ['cash','rep','cap','fans','price','logen','shop','youth'])if(!isFinite(t[k]))e.push(`Team ${t.name} ${k}=${t[k]}`);
   const n=S.pl.filter(p=>p.team===t.id).length;if(t.lg>3&&n)e.push(`Regionalligist ${t.name} hat ${n} Spieler`);if(t.lg<=3&&t.id!==S.my&&(n<15||n>36))e.push(`Kader ${t.name}: ${n}`);});
  if(!isFinite(S.trust)||S.trust<0||S.trust>100)e.push('Vertrauen '+S.trust);
  for(const k in S.fin)if(!isFinite(S.fin[k]))e.push('Finanzposten '+k+'='+S.fin[k]);
  if(!isFinite(S.loan))e.push('Kredit NaN');
  if(!Array.isArray(S.zufall)||S.zufall.length!==4||S.zufall.some(x=>!Number.isInteger(x)||x<0||x>4294967295))e.push('Zufallszustand kaputt');
  const xi=myXI(),nn=xi.filter(x=>x!=null);if(new Set(nn).size!==nn.length)e.push('Doppelter Spieler in Startelf');
  nn.forEach(id=>{const p=PIX.get(id);if(!p||p.team!==S.my||!avail(p))e.push('ungültiger Startelf-Spieler '+id);});
  // Kalender
  if(!Number.isInteger(S.tag)||S.tag<0||S.tag>=tageDerSaison())e.push(`Tag ${S.tag} außerhalb der Saison`);
  if(S.gespielt>S.tag)e.push('gespielt liegt in der Zukunft');
  const vorbei=d=>d<S.tag||(d===S.tag&&S.gespielt===d);
  if(S.phase==='play'){[1,2,3].forEach(lg=>{const tb=table(lg),soll={};S.fx[lg].forEach((md,k)=>md.forEach(([h,a],i)=>{if(vorbei(S.plan.zeit[lg][k][i][0])){soll[h]=(soll[h]||0)+1;soll[a]=(soll[a]||0)+1;}}));
    tb.forEach(r=>{if(r.sp!==(soll[r.id]||0))e.push(`Liga ${lg}: ${tn(r.id)} hat ${r.sp} Spiele, laut Kalender ${soll[r.id]||0}`);});
    if(S.fx[lg].some((md,k)=>md.length!==S.plan.zeit[lg][k].length))e.push(`Liga ${lg}: Spielplan und Termine passen nicht zusammen`);
    const pts=tb.reduce((a,r)=>a+r.p,0),g=S.res[lg].length,d=S.res[lg].filter(r=>r[2]===r[3]).length;if(pts!==g*3-d)e.push('Punkte inkonsistent');});
   const ex=64>>S.cup.hist.length;if(S.cup.alive.length!==ex)e.push(`Pokal ${S.cup.alive.length} statt ${ex}`);if(new Set(S.cup.alive).size!==S.cup.alive.length)e.push('Pokal doppelt');
   if(S.cup.alive.some(id=>id<1000&&(S.teams[id].zweite>=0||S.teams[id].lg>3)))e.push('Zweitmannschaft oder Regionalligist im Pokal');
   const cupSoll=S.plan.pokal.filter(([d])=>vorbei(d)).length;if(S.cup.hist.length!==cupSoll)e.push(`Pokal: ${S.cup.hist.length} Runden, laut Kalender ${cupSoll}`);}
  S.offers.forEach(o=>{if(!PIX.get(o.pid))e.push('Angebot ohne Spieler');if(!(o.bis>=S.tag))e.push('abgelaufenes Angebot liegt noch vor');});
  if(S.constr&&!(S.constr.bis>S.tag))e.push('Bau hätte fertig sein müssen');
  // Kabine und Gespräche (K14, K15): Wertebereiche, Gesprächswünsche, Zusagen, Beziehungen
  S.pl.forEach(p=>{if(p.st!=null&&!(p.st>=0&&p.st<=100))e.push(`Stimmung außerhalb 0–100: ${p.n}`);if(p.ww!=null&&!(p.ww>=0&&p.ww<=4))e.push(`Wechselwunsch außerhalb 0–4: ${p.n}`);});
  S.teams.forEach(t=>{if(t.zh!=null&&!(t.zh>=0&&t.zh<=100))e.push(`Zusammenhalt außerhalb 0–100: ${t.name}`);if(t.glaub!=null&&!(t.glaub>=0&&t.glaub<=100))e.push(`Glaubwürdigkeit außerhalb 0–100: ${t.name}`);});
  (S.gw||[]).forEach(g=>{const p=PIX.get(g.pid);if(!p||p.team!==S.my||p.ww!==2)e.push('Gesprächswunsch ohne passenden Spieler');});
  (S.vs||[]).forEach(v=>{if(!PIX.get(v.pid))e.push('Zusage ohne Spieler');if(!['offen','gehalten','gebrochen','hinfaellig'].includes(v.stand))e.push('Zusage mit unbekanntem Stand');});
  (S.bz||[]).forEach(b=>{if(!PIX.get(b[0])||!PIX.get(b[1])||b[0]===b[1])e.push('Beziehung ohne zwei Spieler');});
  // Scouting (K18): Kenntnis 0–100, Aufträge nur mit eigenen Scouts
  for(const id in (S.kenntnis||{})){const k=S.kenntnis[id].k;if(!(k>=0&&k<=100))e.push('Kenntnis außerhalb 0–100');}
  (S.auftraege||[]).forEach(a=>{const x=(S.stab||[]).find(y=>y.id===a.scout);if(!x||x.team!==S.my||x.r!=='scout')e.push('Auftrag ohne eigenen Scout');});
  // Auslandspool und Nationalität (K32, K03): Pool getrennt von den Ligen, Kern 6–10 je Verein, jeder Spieler mit Nation aus der Tabelle
  S.pl.forEach(p=>{if(!p.nat||!nation(p.nat))e.push(`Spieler ${p.n} ohne Nationalität (${p.nat})`);});
  if(S.ausland){const zahl={};pool.forEach(p=>{if(ids.has(p.id))e.push('Poolspieler mit Nummer eines Ligaspielers '+p.id);if(PIX.get(p.id)!==p)e.push('PIX kennt Poolspieler nicht '+p.id);
     if(!(p.team>=2000)||!S.ausland.v[p.team-2000])e.push(`Poolspieler ${p.n} team=${p.team}`);if(!p.nat||!nation(p.nat))e.push(`Poolspieler ${p.n} ohne Nationalität`);
     for(const k of ['str','pot','form','fit','ko','sp','sal','age','ct'])if(typeof p[k]!=='number'||!isFinite(p[k]))e.push(`Poolspieler ${p.n} ${k}=${p[k]}`);
     if(p.str<20||p.str>99||p.form<0||p.form>20)e.push(`Poolspieler ${p.n} Werte außerhalb`);zahl[p.team]=(zahl[p.team]||0)+1;});
    S.ausland.v.forEach(v=>{const n=zahl[v.id]||0;if(n<3||n>14)e.push(`Kern ${v.name}: ${n}`);});
    (S.offers||[]).forEach(o=>{if(o.tid>=2000&&!S.ausland.v[o.tid-2000])e.push('Angebot von unbekanntem Auslandsverein');});}
  return e;};
 window.__scan=function(){const t=document.getElementById('app').innerText+' || '+document.getElementById('ov').innerText;const re=/undefined|NaN|\[object|\bnull\b|Infinity/;const i=t.search(re);return i<0?'':t.slice(Math.max(0,i-70),i+40).replace(/\s+/g,' ');};
};
