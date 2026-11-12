// Fenster über der Arbeitsfläche: Spielerkarte, Vorbericht, Konferenz, Saisonbilanz, Entlassung, Menü.
function ov(h){ovEl.innerHTML=`<div class="ov" role="dialog" aria-modal="true"><div class="ovb">${h}</div></div>`;}
function closeOv(){ovEl.innerHTML='';}
function openP(id){const p=PIX.get(id);if(!p)return;const mine=p.team===S.my,aus=istAusland(p),t=aus?avVon(p.team):p.team>=0?S.teams[p.team]:null,v=mine?value(p):wertSicht(p);let act=''; // aus: Spieler eines Auslandsvereins (K32)
  if(mine)act=`<div class="card"><h3>Transferliste</h3>${lzHinweis('transfers')}${p.list?`<p>Steht für ${fmt(p.ask)} auf der Liste.</p><button onclick="setListed(${id},0)"${lzAus('transfers')}>Von der Liste nehmen</button>`:`<div class="form"><label>Ablöseforderung (Mio €) <input id="ask" type="number" step="0.1" min="0" value="${(v/1e6).toFixed(1)}"></label><button onclick="setListed(${id},1)"${lzAus('transfers')}>Auf die Transferliste setzen</button></div>`}</div>
    <div class="card"><h3>Vertrag</h3><p>Läuft bis ${S.season+p.ct} · ${fmt(p.sal)} pro Jahr</p><p class="dim">${verlaengertNicht(p)?'Will bei dieser Stimmung nicht verlängern.':`Forderung für eine Verlängerung: ${fmt(Math.round(extDemand(p)*vertragsAufschlag(p)/1000)*1000)} pro Jahr${vertragsAufschlag(p)>1?' (unzufrieden, deshalb teurer)':''}`}</p><div class="row"><select id="ext" aria-label="Laufzeit">${[1,2,3,4].map(y=>`<option value="${y}">${y} Jahr(e)</option>`).join('')}</select><button onclick="extend(${id})"${lzAus('vertraege')}>Verlängern</button></div>${lzHinweis('vertraege')}<hr><button onclick="release(${id})"${lzAus('vertraege')}>Vertrag auflösen (Abfindung ${fmt(abfindung(p))})</button></div>`;
  else act=`<div class="card"><h3>${t?'Transferangebot':'Vereinsloser Spieler'}</h3><div class="form">${t?`<p>${esc(t.name)} verlangt etwa ${fmt(askPrice(p))}${p.list?' (Transferliste)':''}.</p><label>Dein Angebot (Mio €) <input id="fee" type="number" step="0.1" min="0" value="${(askPrice(p)/1e6).toFixed(1)}"></label>`:`<p>Handgeld etwa ${fmt(Math.round(salaryFor(p.str)*RF.handgeldAnzeige))}.</p>`}
    <label>Vertragslaufzeit <select id="yrs">${[1,2,3,4,5].map(y=>`<option value="${y}" ${y===3?'selected':''}>${y} Jahr(e)</option>`).join('')}</select></label><button class="go" onclick="offer(${id})"${aus?lzAusAlle('transfers','ausland'):lzAus('transfers')}>${t?'Angebot abgeben':'Verpflichten'}</button></div>${aus?lzHinweisAlle('transfers','ausland'):lzHinweis('transfers')}<p id="msg" class="msg" aria-live="polite"></p></div>`;
  if(!mine)act+=scoutKarte(p);
  const kad=aus?avStaerke(t):p.team>=0?teamLevel(p.team):null,jung=p.age<=23;
  const werte=!mine?scoutWerte(p,kad):`<div class="card rgs">${rgAnzeige({label:'Stärke',sub:jung?'1–99, Schraffur: Talent':'1–99',min:1,max:99,wert:Math.round(p.str),talent:jung?talentBand(p):null,marker:kad?[{v:kad,t:'Ø Kader '+Math.round(kad)}]:[]})}
    ${rgAnzeige({label:'Form',sub:'0–20, Mitte 10: Leistung gegenüber der Erwartung, beschleunigt die Entwicklung',min:0,max:20,wert:p.form,dez:1,marker:[{v:RP.form.mitte,t:'Mitte'}]})}
    ${rgAnzeige({label:'Frische',sub:'wirkt auf die Stärke im Spiel',min:0,max:100,wert:Math.round(p.fit),einheit:' %',zonen:RU.zonenFitness})}
    ${rgAnzeige({label:'Kondition',sub:'Trainingszustand: wie schnell die Frische sinkt und zurückkommt',min:0,max:100,wert:Math.round(p.ko)})}
    ${rgAnzeige({label:'Spielpraxis',sub:'Einsatzminuten der letzten Wochen',min:0,max:100,wert:Math.round(p.sp),einheit:' %',zonen:RU.zonenSpielpraxis})}
    ${p.team>=0?rgAnzeige({label:'Belastungssprung',sub:'akute Last der letzten Tage gegen die gewohnte (Verletzungsrisiko, K07)',min:0,max:2,wert:Math.round(lastQuote(p)*100)/100,dez:2,zonen:[{von:0,bis:1.3,art:'good',text:'im Rahmen'},{von:1.3,bis:1.5,art:'warn',text:'erhöhtes Verletzungsrisiko'},{von:1.5,bis:2,art:'bad',text:'deutlich erhöhtes Verletzungsrisiko'}]}):''}</div>`;
  const eig=bekannteEigenschaften(p),mks=mine?sichtbareMerkmale(p):merkmaleSicht(p).liste,RPm=RP.merkmale,RPe=RP.eigenschaften,opts=mine?lernOptionen(p):[],mkListe=l=>l.map(k=>`<span title="${esc(RPm[k].text||'')}">${esc(RPm[k].name)}</span>`).join(', ');
  const profil=`<div class="card"><h3>Profil</h3><div class="facts">${fact('Position',esc(RP.positionsNamen[p.fp]||p.pos))}${fact('Starker Fuß',p.fuss==='L'?'links':'rechts')}${hatMk(p,'beidfuessig')&&RP.merkmaleWirksam.includes('beidfuessig')?fact('','beidfüßig'):''}</div>
    <p><b>Eigenschaften:</b> ${eig.length?eig.map(k=>`<span title="${esc(RPe[k].text||'')}">${esc(RPe[k].name)}</span>`).join(', '):mine?(p.wiv<p.ekw?'der Co-Trainer kennt ihn noch nicht gut genug':'nichts Auffälliges'):'unbekannt'}</p>
    <p><b>Stärken:</b> ${mkListe(mks.filter(k=>!RPm[k].schwaeche))||'keine bekannten'}${!mine&&merkmaleSicht(p).hinweis?` <span class="dim">(${esc(merkmaleSicht(p).hinweis)})</span>`:''}</p>${mks.some(k=>RPm[k].schwaeche)?`<p><b>Schwächen:</b> ${mkListe(mks.filter(k=>RPm[k].schwaeche))}</p>`:''}
    ${mine&&p.lf&&Object.values(p.lf).some(v=>v>=10)?`<p class="dim">Aus den Spielen auf dem Weg zu: ${Object.entries(p.lf).filter(([k,v])=>v>=10&&RP.merkmaleWirksam.includes(k)).sort((x,y)=>y[1]-x[1]).map(([k,v])=>`${esc(RPm[k].name)} ${Math.round(v)} %`).join(', ')}</p>`:''}
    ${mine?`<label>Lernziel <select onchange="setLernziel(${id},this.value)"${lzAus('lernziel')}><option value="">Co-Trainer entscheidet</option>${opts.map(k=>`<option value="${k}" ${p.ls&&p.ls.k===k?'selected':''}>${esc(RPm[k].name)} (${RPm[k].s})</option>`).join('')}</select></label>
      <label>Umschulung <select onchange="setUmschulung(${id},this.value)"${lzAus('umschulung')}><option value="">keine</option>${Object.keys(RP.positionsNamen).filter(x=>x!==(p.fp||'')&&posGruppe(x)!=='TW'&&p.pos!=='TW').map(x=>`<option value="${x}" ${p.um===x?'selected':''}>${esc(RP.positionsNamen[x])} (jetzt ${Math.round(eignung(p,x)*100)} %)</option>`).join('')}</select></label>
      ${p.ls?`<p class="dim">Lernt gerade ${esc(RPm[p.ls.k].name)}: ${Math.round(p.ls.f)} %</p>`:opts.length?'':'<p class="dim">Gerade nichts zu lernen.</p>'}<p class="dim">Lernplätze im Verein: ${squad(S.my).filter(x=>x.ls).length} von ${lernPlaetze(S.my)} belegt</p>`:''}</div>`;
  ov(`<div class="phead"><span class="pos ${p.pos}">${p.pos}</span><h2>${esc(p.n)}</h2><button class="x" onclick="closeOv()" aria-label="Schließen">✕</button></div>
  <div class="facts">${fact('Verein',t?esc(t.name)+(aus?` (${esc(gruppenName(avGruppe(t)))})`:''):'vereinslos')}${fact('Nationalität',esc(natName(p)))}${fact('Alter',p.age)}${jung?fact('Talent',stars(p)):''}${fact(mine?'Marktwert':'Marktwert (geschätzt)',fmt(v))}${fact('Gehalt',fmt(p.sal))}${p.team>=0?fact('Vertrag bis',S.season+p.ct):''}${fact('Selbstvertrauen',svWort(p.sv))}${!mine&&p.ww>=3?fact('Wechselwunsch','will weg'):''}${aus?'':fact('Ligatore',p.g)+fact('Einsätze',p.apps)}${p.lastG?fact('Letzte Note',p.lastG.toFixed(1).replace('.',',')):''}${p.inj>0?fact(p.vl&&p.vl.art==='krankheit'?'Krank':'Verletzt',verletzungText(p)||p.inj+' Tage'):''}${(p.vh||[]).length?fact('Verletzungen (2 Jahre)',p.vh.filter(x=>x.art!=='krankheit').length):''}${sperrText(p)?fact('Sperre',sperrText(p).replace(/^gesperrt \(|\)$/g,'')):''}${aus?'':fact('Gelbe Karten',`Liga ${(p.kt&&p.kt.liga)||0} · Pokal ${(p.kt&&p.kt.pokal)||0}`)}</div>
  ${werte}<div class="grid">${profil}${mine?stimmungKarte(p):''}${act}</div>`);}
// „Tag beenden“ (K01): erst Erinnerungen, dann dein Spiel (Vorbericht, Anpfiff, Konferenz), dann weiter bis zum nächsten Halt.
function tagBeenden(ohneErinnerung){if(LIVE){liveFrame();liveRender();return;}if(S.live){liveFortsetzen();if(LIVE)return;}if(CONF){confFrame();renderConf();return;}if(BUSY)return;
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
  ov(`<h2>${esc(spielName(e))} · ${spielZeit(e)} Uhr</h2>${f?`<div class="board"><div class="t">${esc(tn(f[0]))}</div><div class="score">–:–</div><div class="t">${esc(tn(f[1]))}</div></div>${tauziehenNaechstes()}`:'<p>Der Gegner wird jetzt ausgelost.</p>'}
    <p>Deine Elf: ${t.form}, ${STIL_NAME[t.stil]||STIL_NAME.ausgewogen}, ${AUSRICHTUNG[t.tac]||AUSRICHTUNG.N}, Einsatz ${EINSATZ[t.ein]}${(t.einstellung||'normal')!=='normal'?`, <b>${EINSTELLUNG_NAME[t.einstellung]}</b>`:''}.${f?` Schiedsrichter: ${esc(schiriText(schiriFuer(f[0],f[1],hash32(['spiel',S.season,S.tag,f[0],f[1]].join('|')))))}.`:''}${f?gegnerStile(f[0]===S.my?f[1]:f[0]):''}${out.length?` <span class="dim">Fehlen: ${out.map(p=>esc(p.n)).join(', ')} – werden automatisch ersetzt.</span>`:''}</p>
    <div class="row"><button onclick="closeOv();tab('aufst')">Aufstellung ändern</button><button id="sofort" onclick="kickoff()" title="Der Co-Trainer entscheidet im Spiel">Sofort berechnen</button><button class="go" id="kick" onclick="kickoffLive()">Live anpfeifen</button></div>`);}
// Gegneranalyse (K06 §4): die zuletzt gespielten Stile, ohne Gewähr (Scout und Co-Trainer machen es mit K16, K18 genauer)
function gegnerStile(id){if(id>=1000)return'';const t=S.teams[id];if(!t||!t.stile||!t.stile.length)return'';return` <span class="dim">${esc(t.name)} spielte zuletzt: ${t.stile.slice().reverse().map(k=>STIL_NAME[k]).join(', ')} (${t.form}).</span>`;}
function kickoff(){if(BUSY||CONF)return;BUSY=true;let out=null;try{out=tagesSpiele(S.tag);LAST=out;save();}catch(e){console.error(e);toast('Fehler: '+e.message);}finally{BUSY=false;}if(out&&out.list.length)showConf(out);else weiterUI();}
function showConf(out){const maxM=out.list.some(r=>r.ev.some(e=>e.m>90))?120:90;CONF={out,min:0,speed:1,maxM,done:false};confFrame();renderConf();CONF.timer=setInterval(tickConf,110);}
function confFrame(){const g=CONF.out.gruppen,mg=g.find(x=>x.list.includes(CONF.out.mine))||g[0];CONF.btn=0;ov(`<div class="row between"><h2 style="margin:0">${esc(mg.titel)}${mg.art==='liga'?' · Konferenz':''}</h2><span class="clock" id="cf-clock"></span></div><div class="conf" id="cf-body"></div><div class="row" id="cf-btns"><button id="cf-speed" onclick="confSpeed()">Schneller</button><button onclick="confEnd()">Zum Abpfiff</button></div>`);}
function confSpeed(){if(!CONF)return;CONF.speed=CONF.speed===1?4:1;const b=document.getElementById('cf-speed');if(b)b.textContent=CONF.speed===1?'Schneller':'Normal';}
function confEnd(){if(!CONF)return;CONF.min=CONF.maxM;tickConf();}
function tickConf(){if(!CONF)return;CONF.min=Math.min(CONF.maxM,CONF.min+CONF.speed);if(CONF.min>=CONF.maxM&&!CONF.done){CONF.done=true;clearInterval(CONF.timer);}renderConf();}
function scoreAt(r,mn){const s=[0,0];r.ev.forEach(e=>{if(e.t==='G'&&e.m<=mn)s[e.s]++;});return s;}
function evText(e,r){const tm=esc(tn(e.s?r.a:r.h)),k=e.m*7+e.s*3;
  if(e.t==='G'){const L=(e.art&&TICKER_ARTEN[e.art])||TICKER_TOR;return`<b>${esc(L[k%L.length].replace('{n}',e.n).replace('{sc}',e.sc.join(':')))}</b> <span class="dim">${tm}</span>`;}
  if(e.t==='C')return esc(e.x||TICKER_CHANCE[k%TICKER_CHANCE.length].replace('{n}',e.n).replace('{gk}',e.gk));
  if(e.t==='Y')return`Gelbe Karte für ${esc(e.n)} <span class="dim">${tm}</span>`;
  if(e.t==='R')return`<b>${e.gy?'Gelb-Rot':'Rote Karte'}</b> für ${esc(e.n)} <span class="dim">${tm}</span>`;
  if(e.t==='I')return`${esc(e.n)} verletzt sich. <span class="dim">${tm}</span>`;
  if(e.t==='S')return`Wechsel: ${esc(e.n)} kommt für ${esc(e.aus)}. <span class="dim">${tm}</span>`;
  if(e.t==='E')return`Elfmeter ${e.nr}: ${esc(e.n)} ${e.tor?'trifft':'<b>verschießt</b>'} (${e.st.join(':')}) <span class="dim">${tm}</span>`;
  if(e.t==='P')return`<b>Elfmeterschießen: ${e.pen[0]}:${e.pen[1]}</b>`;return esc(e.x||'');}
// Konferenz nach Anstoßzeit (K05 §4.1): live nur Spiele mit derselben Anstoßzeit, frühere schon beendet, spätere noch nicht angepfiffen
function omKonf(r,meinAnstoss,mn,fertig){if(fertig||r.min==null||meinAnstoss==null||r.min===meinAnstoss)return om(r,fertig?999:mn,fertig,r.min!==meinAnstoss);
  if(r.min<meinAnstoss)return om(r,999,true,true);return`<div class="om"><span><small class="dim">${uhr(r.min)}</small> ${esc(tn(r.h))}</span><span class="s">–:–</span><span>${esc(tn(r.a))}</span></div>`;}
function om(r,mn,done,zeit){const s=scoreAt(r,mn),hot=r.ev.some(e=>e.t==='G'&&e.m<=mn&&e.m>mn-4);return`<div class="om ${hot&&!done?'hot':''}"><span>${zeit&&r.min!=null?`<small class="dim">${uhr(r.min)}</small> `:''}${esc(tn(r.h))}</span><span class="s">${s[0]}:${s[1]}${done&&r.pen?'<small> i.E.</small>':''}</span><span>${esc(tn(r.a))}</span></div>`;}
function renderConf(){const c=CONF;if(!c)return;if(!document.getElementById('cf-body'))confFrame();const o=c.out,mn=Math.floor(c.min);let mine='';
  if(o.mine){const r=o.mine,sc=scoreAt(r,mn);const et=!!r.pen||r.ev.some(e=>e.m>90),end=et?120:90;
    const L=r.ev.filter(e=>e.m<=mn&&(e.t!=='P'||c.done)&&(e.t!=='E'||c.done)).map((e,i)=>({m:e.m,h:evText(e,r),t:e.t,o:e.t==='P'?2:0,i}));
    L.push({m:0,h:'Anpfiff.',t:'K',o:1});if(mn>=45)L.push({m:45,h:'Halbzeit.',t:'K',o:1});if(et&&mn>=90)L.push({m:90,h:'Verlängerung.',t:'K',o:1});if(mn>=end)L.push({m:end,h:r.pen?'Ende der Verlängerung.':'Abpfiff.',t:'K',o:1});
    L.sort((a,b)=>b.m-a.m||b.o-a.o||(b.i||0)-(a.i||0));
    mine=`<div><div class="board"><div class="t">${esc(tn(r.h))}</div><div class="score">${sc[0]}:${sc[1]}</div><div class="t">${esc(tn(r.a))}</div></div>${c.done&&r.pen?`<p class="dim" style="margin-top:6px;text-align:center">Elfmeterschießen ${r.pen[0]}:${r.pen[1]}</p>`:''}<div class="tick">${L.map(e=>`<div><span>${e.m}'</span><i class="ic ${e.t}"></i><span>${e.h}</span></div>`).join('')}</div></div>`;}
  const ma=o.mine?o.mine.min:null,grp=o.gruppen.map(g=>{const oth=g.list.filter(r=>r!==o.mine).sort((a,b)=>(a.min||0)-(b.min||0));return oth.length?`<h3>${g.list.includes(o.mine)?(g.art==='pokal'?'Weitere Pokalspiele':g.art==='liga'?`${ligaName(g.e.lg)}, weitere Spiele des Tages`:esc(g.titel)):esc(g.titel)}</h3><div class="others">${oth.map(r=>omKonf(r,ma,mn,c.done)).join('')}</div>`:'';}).join('');
  document.getElementById('cf-body').innerHTML=`${mine||'<div><p class="dim">Dein Verein spielt heute nicht.</p></div>'}<div>${grp}</div>`;
  document.getElementById('cf-clock').textContent=c.done?'Ende':mn+"'";
  if(c.done&&!c.btn){c.btn=1;document.getElementById('cf-btns').innerHTML='<button class="go" id="cf-next" onclick="closeConf()">Weiter</button>';const n=document.getElementById('cf-next');if(n)n.focus();}}
// Nach der Konferenz endet der Spieltag: weiter bis zum nächsten Halt
function closeConf(){if(CONF)clearInterval(CONF.timer);CONF=null;BUSY=false;weiterUI();}
function showSummary(){const sm=S.summary;if(!sm)return;const L=ids=>ids.map(id=>esc(tn(id))).join(', ');
  ov(`<h2>Saisonbilanz ${sm.season}/${(sm.season+1)%100}</h2>
  <div class="facts">${fact('Dein Platz',sm.pos+'. ('+sm.lg+'. Liga)')}${fact('Ziel',sm.ok?'erreicht':'verfehlt')}${fact('Finanzsaldo',fmt(sm.fin))}${fact('Vorstand',Math.round(S.trust)+' %')}</div>
  <p>Deutscher Meister: <b>${esc(tn(sm.champ))}</b> · Meister 2. Liga: <b>${esc(tn(sm.champ2))}</b> · Meister 3. Liga: <b>${esc(tn(sm.champ3))}</b></p>
  <p><b>1./2. Liga:</b> Absteiger ${L(sm.down)} · Aufsteiger ${L(sm.up)} · Relegation: ${esc(sm.relRes)} → <b>${esc(tn(sm.rw))}</b> spielt in der 1. Liga.</p>
  <p><b>2./3. Liga:</b> Absteiger ${L(sm.down2)} · Aufsteiger ${L(sm.up3)} · Relegation: ${esc(sm.rel2Res)} → <b>${esc(tn(sm.rw2))}</b> spielt in der 2. Liga.</p>
  <p><b>3. Liga/Regionalliga:</b> Absteiger ${L(sm.down3)} · Aufsteiger ${L(sm.up4)}${sm.rlText?` <span class="dim">(${esc(sm.rlText)})</span>`:''}</p>
  ${S.fired?"":sommerKarte()}
  <p>DFB-Pokalsieger: <b>${sm.cup!=null?esc(tn(sm.cup)):'–'}</b> · Torschützenkönig: ${esc(sm.ts)}</p>
  ${S.fired?'<p class="neg"><b>Du musst gehen: Der Verein trennt sich von dir.</b></p><div class="row"><button class="go" onclick="showFired()">Jobangebote ansehen</button></div>':`<p class="dim">Jetzt beginnt die Sommerpause: Urlaub bis zum Trainingsauftakt, am 1. Juli der Saisonwechsel mit neuen Verträgen und Sponsorangeboten.</p><div class="row"><button class="go" onclick="sommerpause();closeOv();TAB='buero';render()">Weiter in die Sommerpause</button><button onclick="closeOv()">Später</button></div>`}`);}
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
  <p class="dim">Schwierigkeit: ${stufe().name} · Startwert für den Zufall (Seed): ${S.seed} · Spielstand-Version ${S.v}</p>
  <div class="row"><button onclick="showLizenz()">Lizenz und Lernstufen</button><button onclick="confirmNew()">Neues Spiel beginnen</button></div>`);}
function copyExp(){const ta=document.getElementById('exp');const done=()=>toast('Code kopiert.');try{navigator.clipboard.writeText(ta.value).then(done,()=>{ta.select();toast('Text ist markiert – bitte manuell kopieren.');});}catch(e){ta.select();toast('Text ist markiert – bitte manuell kopieren.');}}
function importSave(){let d=null;try{d=JSON.parse(document.getElementById('imp').value);}catch(e){}
  if(!d||!d.teams||!d.pl){toast('Der Code ist ungültig.');return;}
  if(d.v!==REGELN.spielstand.version){toast('Dieser Code stammt aus einer älteren Version (Wochenkalender) und passt nicht mehr.');return;}
  if(LIVE){clearInterval(LIVE.timer);LIVE=null;}S=d;reindex();save();closeOv();TAB='buero';render();toast('Spielstand geladen.');if(S.live)liveFortsetzen();}
function confirmNew(){ov(`<h2>Neues Spiel?</h2><p>Der aktuelle Spielstand wird überschrieben, wenn du im neuen Spiel den ersten Schritt machst. Sichere ihn vorher über „Menü“, falls du ihn behalten willst.</p><div class="row"><button class="go" onclick="closeOv();S=null;render()">Ja, neues Spiel</button><button onclick="closeOv()">Abbrechen</button></div>`);}
