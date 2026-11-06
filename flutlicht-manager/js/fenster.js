// Fenster über der Arbeitsfläche: Spielerkarte, Vorbericht, Konferenz, Saisonbilanz, Entlassung, Menü.
function ov(h){ovEl.innerHTML=`<div class="ov" role="dialog" aria-modal="true"><div class="ovb">${h}</div></div>`;}
function closeOv(){ovEl.innerHTML='';}
function openP(id){const p=PIX.get(id);if(!p)return;const mine=p.team===S.my,t=p.team>=0?S.teams[p.team]:null,v=value(p);let act='';
  if(mine)act=`<div class="card"><h3>Transferliste</h3>${p.list?`<p>Steht für ${fmt(p.ask)} auf der Liste.</p><button onclick="setListed(${id},0)">Von der Liste nehmen</button>`:`<div class="form"><label>Ablöseforderung (Mio €) <input id="ask" type="number" step="0.1" min="0" value="${(v/1e6).toFixed(1)}"></label><button onclick="setListed(${id},1)">Auf die Transferliste setzen</button></div>`}</div>
    <div class="card"><h3>Vertrag</h3><p>Läuft bis ${S.season+p.ct} · ${fmt(p.sal)} pro Jahr</p><p class="dim">Forderung für eine Verlängerung: ${fmt(extDemand(p))} pro Jahr</p><div class="row"><select id="ext" aria-label="Laufzeit">${[1,2,3,4].map(y=>`<option value="${y}">${y} Jahr(e)</option>`).join('')}</select><button onclick="extend(${id})">Verlängern</button></div><hr><button onclick="release(${id})">Vertrag auflösen (Abfindung ${fmt(abfindung(p))})</button></div>`;
  else act=`<div class="card"><h3>${t?'Transferangebot':'Vereinsloser Spieler'}</h3><div class="form">${t?`<p>${esc(t.name)} verlangt etwa ${fmt(askPrice(p))}${p.list?' (Transferliste)':''}.</p><label>Dein Angebot (Mio €) <input id="fee" type="number" step="0.1" min="0" value="${(askPrice(p)/1e6).toFixed(1)}"></label>`:`<p>Handgeld etwa ${fmt(Math.round(salaryFor(p.str)*RF.handgeldAnzeige))}.</p>`}
    <label>Vertragslaufzeit <select id="yrs">${[1,2,3,4,5].map(y=>`<option value="${y}" ${y===3?'selected':''}>${y} Jahr(e)</option>`).join('')}</select></label><button class="go" onclick="offer(${id})">${t?'Angebot abgeben':'Verpflichten'}</button></div><p id="msg" class="msg" aria-live="polite"></p></div>`;
  const kad=p.team>=0?teamLevel(p.team):null,jung=p.age<=23;
  const werte=`<div class="card rgs">${rgAnzeige({label:'Stärke',sub:jung?'1–99, Schraffur: Talent':'1–99',min:1,max:99,wert:Math.round(p.str),talent:jung?talentBand(p):null,marker:kad?[{v:kad,t:'Ø Kader '+Math.round(kad)}]:[]})}
    ${rgAnzeige({label:'Form',sub:'0–10, Mitte 5',min:0,max:10,wert:p.form,dez:1,marker:[{v:RT.formMitte,t:'Mitte'}]})}
    ${rgAnzeige({label:'Fitness',sub:'wirkt auf die Stärke im Spiel',min:0,max:100,wert:Math.round(p.fit),einheit:' %',zonen:RU.zonenFitness})}</div>`;
  ov(`<div class="phead"><span class="pos ${p.pos}">${p.pos}</span><h2>${esc(p.n)}</h2><button class="x" onclick="closeOv()" aria-label="Schließen">✕</button></div>
  <div class="facts">${fact('Verein',t?esc(t.name):'vereinslos')}${fact('Alter',p.age)}${jung?fact('Talent',stars(p)):''}${fact('Marktwert',fmt(v))}${fact('Gehalt',fmt(p.sal))}${p.team>=0?fact('Vertrag bis',S.season+p.ct):''}${fact('Ligatore',p.g)}${fact('Einsätze',p.apps)}${p.lastG?fact('Letzte Note',p.lastG.toFixed(1).replace('.',',')):''}${p.inj>0?fact('Verletzt',p.inj+(p.inj===1?' Tag':' Tage')):''}${p.sus>0?fact('Gesperrt',p.sus+(p.sus===1?' Spiel':' Spiele')):''}</div>
  ${werte}<div class="grid">${act}</div>`);}
// „Tag beenden“ (K01): erst Erinnerungen, dann dein Spiel (Vorbericht, Anpfiff, Konferenz), dann weiter bis zum nächsten Halt.
function tagBeenden(ohneErinnerung){if(CONF){confFrame();renderConf();return;}if(BUSY)return;
  if(S.phase==='end'){showSummary();return;}if(S.fired){showFired();return;}
  if(!ohneErinnerung){const e=erinnerungen();if(e.length){zeigeErinnerungen(e);return;}}
  if(heuteMeinSpiel()){showPre(meinSpiel(S.tag));return;}
  weiterUI();}
function weiterUI(){BUSY=true;let n=0;try{n=weiter();}catch(e){console.error(e);toast('Fehler: '+e.message);}finally{BUSY=false;}
  closeOv();TAB='buero';render();window.scrollTo(0,0);if(S.phase==='end')showSummary();else if(S.fired)showFired();else if(n>1)toast(`${n} Tage weiter: ${datumMittel(S.tag)}`);}
function zeigeErinnerungen(E){ov(`<h2>Sicher? Du kannst noch …</h2><div class="opts">${E.map(e=>`<div class="card"><p>${e.text}</p><div class="row between"><button onclick="closeOv();tab('${e.tab}')">${e.knopf}</button><label class="pick"><input type="checkbox" onchange="erinnerungAus('${e.art}',this.checked)"> nicht mehr erinnern</label></div></div>`).join('')}</div>
  <div class="row" style="margin-top:12px"><button class="go" id="trotzdem" onclick="closeOv();tagBeenden(1)">Trotzdem Tag beenden</button><button onclick="closeOv()">Abbrechen</button></div>`);}
function erinnerungAus(art,aus){S.einst=S.einst||{aus:{}};S.einst.aus=S.einst.aus||{};if(aus)S.einst.aus[art]=1;else delete S.einst.aus[art];save();}
function showPre(e){const t=myT(),f=paarung(e),out=squad(S.my).filter(p=>!avail(p));
  ov(`<h2>${esc(spielName(e))}</h2>${f?`<div class="board"><div class="t">${esc(tn(f[0]))}</div><div class="score">–:–</div><div class="t">${esc(tn(f[1]))}</div></div>${tauziehenNaechstes()}`:'<p>Der Gegner wird jetzt ausgelost.</p>'}
    <p>Deine Elf: ${t.form}, ${AUSRICHTUNG[t.tac]}, Einsatz ${EINSATZ[t.ein]}.${out.length?` <span class="dim">Fehlen: ${out.map(p=>esc(p.n)).join(', ')} – werden automatisch ersetzt.</span>`:''}</p>
    <div class="row"><button onclick="closeOv();tab('aufst')">Aufstellung ändern</button><button class="go" id="kick" onclick="kickoff()">Anpfiff</button></div>`);}
function kickoff(){if(BUSY||CONF)return;BUSY=true;let out=null;try{out=tagesSpiele(S.tag);LAST=out;save();}catch(e){console.error(e);toast('Fehler: '+e.message);}finally{BUSY=false;}if(out&&out.list.length)showConf(out);else weiterUI();}
function showConf(out){const maxM=out.list.some(r=>r.ev.some(e=>e.m>90))?120:90;CONF={out,min:0,speed:1,maxM,done:false};confFrame();renderConf();CONF.timer=setInterval(tickConf,110);}
function confFrame(){const g=CONF.out.gruppen,mg=g.find(x=>x.list.includes(CONF.out.mine))||g[0];CONF.btn=0;ov(`<div class="row between"><h2 style="margin:0">${esc(mg.titel)}${mg.art==='liga'?' · Konferenz':''}</h2><span class="clock" id="cf-clock"></span></div><div class="conf" id="cf-body"></div><div class="row" id="cf-btns"><button id="cf-speed" onclick="confSpeed()">Schneller</button><button onclick="confEnd()">Zum Abpfiff</button></div>`);}
function confSpeed(){if(!CONF)return;CONF.speed=CONF.speed===1?4:1;const b=document.getElementById('cf-speed');if(b)b.textContent=CONF.speed===1?'Schneller':'Normal';}
function confEnd(){if(!CONF)return;CONF.min=CONF.maxM;tickConf();}
function tickConf(){if(!CONF)return;CONF.min=Math.min(CONF.maxM,CONF.min+CONF.speed);if(CONF.min>=CONF.maxM&&!CONF.done){CONF.done=true;clearInterval(CONF.timer);}renderConf();}
function scoreAt(r,mn){const s=[0,0];r.ev.forEach(e=>{if(e.t==='G'&&e.m<=mn)s[e.s]++;});return s;}
function evText(e,r){const tm=esc(tn(e.s?r.a:r.h)),k=e.m*7+e.s*3;
  if(e.t==='G')return`<b>${esc(TICKER_TOR[k%TICKER_TOR.length].replace('{n}',e.n).replace('{sc}',e.sc.join(':')))}</b> <span class="dim">${tm}</span>`;
  if(e.t==='C')return esc(TICKER_CHANCE[k%TICKER_CHANCE.length].replace('{n}',e.n).replace('{gk}',e.gk));
  if(e.t==='Y')return`Gelbe Karte für ${esc(e.n)} <span class="dim">${tm}</span>`;
  if(e.t==='R')return`<b>${e.gy?'Gelb-Rot':'Rote Karte'}</b> für ${esc(e.n)} <span class="dim">${tm}</span>`;
  if(e.t==='I')return`${esc(e.n)} verletzt sich und muss raus. <span class="dim">${tm}</span>`;
  if(e.t==='P')return`<b>Elfmeterschießen: ${e.pen[0]}:${e.pen[1]}</b>`;return esc(e.x||'');}
function om(r,mn,done){const s=scoreAt(r,mn),hot=r.ev.some(e=>e.t==='G'&&e.m<=mn&&e.m>mn-4);return`<div class="om ${hot&&!done?'hot':''}"><span>${esc(tn(r.h))}</span><span class="s">${s[0]}:${s[1]}${done&&r.pen?'<small> i.E.</small>':''}</span><span>${esc(tn(r.a))}</span></div>`;}
function renderConf(){const c=CONF;if(!c)return;if(!document.getElementById('cf-body'))confFrame();const o=c.out,mn=Math.floor(c.min);let mine='';
  if(o.mine){const r=o.mine,sc=scoreAt(r,mn);const et=!!r.pen||r.ev.some(e=>e.m>90),end=et?120:90;
    const L=r.ev.filter(e=>e.m<=mn&&(e.t!=='P'||c.done)).map(e=>({m:e.m,h:evText(e,r),t:e.t,o:e.t==='P'?2:0}));
    L.push({m:0,h:'Anpfiff.',t:'K',o:1});if(mn>=45)L.push({m:45,h:'Halbzeit.',t:'K',o:1});if(et&&mn>=90)L.push({m:90,h:'Verlängerung.',t:'K',o:1});if(mn>=end)L.push({m:end,h:r.pen?'Ende der Verlängerung.':'Abpfiff.',t:'K',o:1});
    L.sort((a,b)=>b.m-a.m||b.o-a.o);
    mine=`<div><div class="board"><div class="t">${esc(tn(r.h))}</div><div class="score">${sc[0]}:${sc[1]}</div><div class="t">${esc(tn(r.a))}</div></div>${c.done&&r.pen?`<p class="dim" style="margin-top:6px;text-align:center">Elfmeterschießen ${r.pen[0]}:${r.pen[1]}</p>`:''}<div class="tick">${L.map(e=>`<div><span>${e.m}'</span><i class="ic ${e.t}"></i><span>${e.h}</span></div>`).join('')}</div></div>`;}
  const grp=o.gruppen.map(g=>{const oth=g.list.filter(r=>r!==o.mine);return oth.length?`<h3>${g.list.includes(o.mine)?(g.art==='pokal'?'Weitere Pokalspiele':g.art==='liga'?`${g.e.lg}. Bundesliga, weitere Spiele`:esc(g.titel)):esc(g.titel)}</h3><div class="others">${oth.map(r=>om(r,mn,c.done)).join('')}</div>`:'';}).join('');
  document.getElementById('cf-body').innerHTML=`${mine||'<div><p class="dim">Dein Verein spielt heute nicht.</p></div>'}<div>${grp}</div>`;
  document.getElementById('cf-clock').textContent=c.done?'Ende':mn+"'";
  if(c.done&&!c.btn){c.btn=1;document.getElementById('cf-btns').innerHTML='<button class="go" id="cf-next" onclick="closeConf()">Weiter</button>';const n=document.getElementById('cf-next');if(n)n.focus();}}
// Nach der Konferenz endet der Spieltag: weiter bis zum nächsten Halt
function closeConf(){if(CONF)clearInterval(CONF.timer);CONF=null;BUSY=false;weiterUI();}
function showSummary(){const sm=S.summary;if(!sm)return;
  ov(`<h2>Saisonbilanz ${sm.season}/${(sm.season+1)%100}</h2>
  <div class="facts">${fact('Dein Platz',sm.pos+'. ('+sm.lg+'. Liga)')}${fact('Ziel',sm.ok?'erreicht':'verfehlt')}${fact('Finanzsaldo',fmt(sm.fin))}${fact('Vorstand',Math.round(S.trust)+' %')}</div>
  <p>Deutscher Meister: <b>${esc(tn(sm.champ))}</b> · Meister 2. Liga: <b>${esc(tn(sm.champ2))}</b></p>
  <p>Absteiger: ${sm.down.map(id=>esc(tn(id))).join(', ')} · Aufsteiger: ${sm.up.map(id=>esc(tn(id))).join(', ')}</p>
  <p>Relegation: ${esc(sm.relRes)} → <b>${esc(tn(sm.rw))}</b> spielt in der 1. Liga.</p>
  <p>DFB-Pokalsieger: <b>${sm.cup!=null?esc(tn(sm.cup)):'–'}</b> · Torschützenkönig: ${esc(sm.ts)}</p>
  ${S.fired?'<p class="neg"><b>Der Vorstand hat dich entlassen.</b></p><div class="row"><button class="go" onclick="showFired()">Jobangebote ansehen</button></div>':`<div class="row"><button class="go" onclick="newSeason();closeOv();TAB='buero';render()">Saison ${sm.season+1}/${(sm.season+2)%100} starten</button><button onclick="closeOv()">Später</button></div>`}`);}
function showFired(){if(!S.jobs)mkJobs();ov(`<h2>Entlassen!</h2><p>Der Vorstand von ${esc(myT().name)} hat dir das Vertrauen entzogen. Diese Vereine bieten dir einen Job an:</p>
  <div class="opts">${S.jobs.map(id=>{const t=S.teams[id];return`<button class="opt" onclick="takeJob(${id})"><b>${chip(id)}${esc(t.name)}</b><span>${t.lg}. Liga · Platz ${rank(t.lg,id)} · Kontostand ${fmt(t.cash)}</span></button>`;}).join('')}</div>
  <div class="row"><button onclick="confirmNew()">Stattdessen neues Spiel</button></div>`);}
function menu(){let size='';try{size=Math.round(JSON.stringify(S).length/1024)+' KB';}catch(e){}
  ov(`<div class="phead"><h2>Menü</h2><button class="x" onclick="closeOv()" aria-label="Schließen">✕</button></div>
  <p>Der Spielstand wird nach jedem Spieltag automatisch in diesem Browser gespeichert. Für andere Geräte oder als Sicherung: Code kopieren und später unter „Spielstand-Code laden“ einfügen.</p>
  <div class="card"><h3>Spielstand sichern (${size})</h3><textarea id="exp" readonly>${esc(JSON.stringify(S))}</textarea><div class="row" style="margin-top:8px"><button onclick="copyExp()">Code kopieren</button></div></div>
  <div class="card"><h3>Spielstand-Code laden</h3><textarea id="imp" placeholder="Code hier einfügen"></textarea><div class="row" style="margin-top:8px"><button onclick="importSave()">Laden</button></div></div>
  <div class="card"><h3>Erinnerungen vor „Tag beenden“</h3><p class="dim">Sie erscheinen nur, wenn wirklich etwas offen ist.</p><div class="form">${Object.entries(RK.erinnerungen).map(([k,l])=>`<label class="pick"><input type="checkbox" ${erinnerungAn(k)?'checked':''} onchange="erinnerungAus('${k}',!this.checked)"> ${l}</label>`).join('')}</div></div>
  ${S.hist.length?`<div class="card"><h3>Deine Karriere</h3>${S.hist.map(h=>`<p>${h.s}/${(h.s+1)%100}: ${esc(h.team)}, ${h.lg}. Liga, Platz ${h.pos} ${h.ok?'✓':''}</p>`).join('')}</div>`:''}
  <p class="dim">Startwert für den Zufall (Seed): ${S.seed} · Spielstand-Version ${S.v}</p>
  <div class="row"><button onclick="confirmNew()">Neues Spiel beginnen</button></div>`);}
function copyExp(){const ta=document.getElementById('exp');const done=()=>toast('Code kopiert.');try{navigator.clipboard.writeText(ta.value).then(done,()=>{ta.select();toast('Text ist markiert – bitte manuell kopieren.');});}catch(e){ta.select();toast('Text ist markiert – bitte manuell kopieren.');}}
function importSave(){let d=null;try{d=JSON.parse(document.getElementById('imp').value);}catch(e){}
  if(!d||!d.teams||!d.pl){toast('Der Code ist ungültig.');return;}
  if(d.v!==REGELN.spielstand.version){toast('Dieser Code stammt aus einer älteren Version (Wochenkalender) und passt nicht mehr.');return;}
  S=d;reindex();save();closeOv();TAB='buero';render();toast('Spielstand geladen.');}
function confirmNew(){ov(`<h2>Neues Spiel?</h2><p>Der aktuelle Spielstand wird überschrieben, wenn du im neuen Spiel den ersten Schritt machst. Sichere ihn vorher über „Menü“, falls du ihn behalten willst.</p><div class="row"><button class="go" onclick="closeOv();S=null;render()">Ja, neues Spiel</button><button onclick="closeOv()">Abbrechen</button></div>`);}
