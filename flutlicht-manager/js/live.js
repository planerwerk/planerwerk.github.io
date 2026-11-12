// Live-Spiel (K05): dein Spiel Minute für Minute mit Eingriffen. Die anderen Spiele des Tages sind vorab berechnet und laufen in der Konferenz mit.
// Wer vorspult, übergibt die Entscheidungen für diese Zeit an den Co-Trainer (K05 §12, U4b).
let LIVE=null;
const ZURUF_TEXT={druck:'Druck machen!',ruhe:'Ruhe bewahren!',konzentration:'Konzentration!',zeit:'Zeit schinden!'};
const ANSPRACHE_TEXT={loben:'Loben',motivieren:'Motivieren',fordern:'Fordern',beruhigen:'Beruhigen',taktik:'Taktik betonen',schweigen:'Schweigen',augenzwinkernd:'Augenzwinkernd'};
const ANSPRACHE_HILFE={loben:'passt bei Führung',motivieren:'passt bei knappem Spiel oder Rückstand',fordern:'passt bei Rückstand, Kämpfer legen zu',beruhigen:'passt bei Führung, weniger Fouls und Patzer',
  taktik:'Umstellungen wirken sofort',schweigen:'nichts, aber auch keine Abnutzung',augenzwinkernd:'wie motivieren, halb so stark, gute Stimmung'};
const liveEinst=()=>{const e=(S.einst&&S.einst.live)||{};return{tempo:e.tempo||'normal',anhalten:Object.assign({},RL.anhalten,e.anhalten||{})};};
function liveEinstSetzen(k,v){S.einst=S.einst||{aus:{}};S.einst.live=S.einst.live||{};if(k==='tempo')S.einst.live.tempo=v;else{S.einst.live.anhalten=S.einst.live.anhalten||{};S.einst.live.anhalten[k]=v;}}

function kickoffLive(){if(BUSY||CONF||LIVE)return;BUSY=true;let v=null;
  try{v=tagesSpieleVorbereiten(S.tag,true);}catch(e){console.error(e);toast('Fehler: '+e.message);}finally{BUSY=false;}
  if(!v)return;if(!v.G){LAST=tagesSpieleAbschliessen(v.out);save();if(LAST.list.length)showConf(LAST);else weiterUI();return;}
  S.live={tag:S.tag,eing:[],m:0,k:0};liveAufbauen(v,'');liveStart();}
function liveAufbauen(v,meldung){const G=v.G,s=G.hid===S.my?0:1;
  LIVE={v,G,s,lauf:false,timer:null,evN:G.ev.length,gewarnt:new Set(),hz:G.m>=45,verl:G.m>=90,ende:G.ende,raus:null,meldung,ansprache:(S.live&&S.live.ansprache)||null,anspPasst:S.live?S.live.anspPasst:null,tab:'spiel'};
  liveFrame();liveRender();}
// Fortsetzen nach Neuladen (K05 §3.3): Das Spiel wird mit denselben Eingriffen bis zur gespeicherten Minute nachgespielt. Die Würfe jeder Minute sind fest (K02), also kommt dasselbe heraus.
function liveFortsetzen(){if(!S.live||LIVE)return;if(S.live.tag!==S.tag||S.phase!=='play'){S.live=null;return;}
  let v=null;try{v=tagesSpieleVorbereiten(S.live.tag,true);}catch(e){console.error(e);}if(!v||!v.G){S.live=null;return;}
  const G=v.G,s=G.hid===S.my?0:1,E=S.live.eing;let i=0,spulenBis=-1;
  const anwenden=()=>{while(i<E.length&&E[i].m===G.m&&(!G.elf||E[i].k==null||E[i].k===G.elf.k))liveEingriffAnwenden(G,s,E[i++],b=>{spulenBis=b;});};
  while(!G.ende&&(G.m<S.live.m||(G.elf&&G.elf.k<S.live.k))){anwenden();G.auto[s]=G.m<spulenBis;G.minute();}
  G.auto[s]=false;anwenden();liveAufbauen(v,'Fortgesetzt: Das Spiel steht wieder da, wo du aufgehört hast.');if(G.ende)liveAbpfiff();}
function liveEingriffAnwenden(G,s,e,spulen){const x=e.x||[];
  if(e.a==='zuruf')G.zuruf(s,x[0]);else if(e.a==='spieler')G.spielerZuruf(s,x[0],x[1]);else if(e.a==='taktik')G.taktik(s,x[0]);
  else if(e.a==='wechsel')G.wechseln(s,x[0],x[1]);else if(e.a==='ansprache')G.ansprache(s,x[0],x[1]);else if(e.a==='reihe')G.elfmeterReihe[s]=x[0].slice();else if(e.a==='spulen')spulen(x[0]);}
// Eingriff merken und sichern
function liveMerken(a,x){const L=LIVE;if(!L||!S.live)return;S.live.eing.push({m:L.G.m,k:L.G.elf?L.G.elf.k:null,a,x});liveSichern();}
function liveSichern(){const L=LIVE;if(!L||!S.live)return;S.live.m=L.G.m;S.live.k=L.G.elf?L.G.elf.k:0;S.live.ansprache=L.ansprache;S.live.anspPasst=L.anspPasst;try{save();}catch(e){console.error(e);}}
// Rahmen einmal aufbauen, danach nur Teile neu zeichnen
function liveFrame(){const L=LIVE,E=liveEinst();
  ov(`<div class="row between"><h2 style="margin:0" id="lv-titel"></h2><span class="clock" id="lv-uhr"></span></div>
  <div id="lv-tafel"></div><div class="lv-druck" id="lv-druck" aria-label="Druckleiste: wer drückt gerade"></div>
  <div class="row lv-steuer" id="lv-steuer"></div><p class="lv-meldung" id="lv-meldung" role="status"></p>
  <div id="lv-pause"></div>
  <div class="tabs lv-tabs">${[['spiel','Spiel'],['elf','Aufstellung & Wechsel'],['taktik','Taktik & Zurufe'],['stat','Statistik'],['konf','Konferenz']].map(([k,l])=>`<button id="lv-tab-${k}" onclick="liveTab('${k}')">${l}</button>`).join('')}</div>
  <div id="lv-inhalt"></div>
  <details class="card"><summary>Tempo und automatisches Anhalten</summary><div class="form" style="margin-top:8px">
    <label>Tempo <select onchange="liveEinstSetzen('tempo',this.value);if(LIVE&&LIVE.lauf){liveStop();liveStart();}">${Object.keys(RL.tempo).map(k=>`<option value="${k}" ${k===E.tempo?'selected':''}>${{langsam:'langsam',normal:'normal',schnell:'schnell'}[k]}</option>`).join('')}</select></label>
    ${[['tor','Tor'],['rot','Rote Karte'],['verletzung','Verletzung eines eigenen Spielers'],['elfmeter','Elfmeter'],['gelbRotGefahr','eigener Spieler mit Gelb']].map(([k,l])=>`<label class="pick"><input type="checkbox" ${E.anhalten[k]?'checked':''} onchange="liveEinstSetzen('${k}',this.checked)"> ${l}</label>`).join('')}
    <label class="pick"><input type="checkbox" ${E.anhalten.frischeUnter?'checked':''} onchange="liveEinstSetzen('frischeUnter',this.checked?${RL.anhalten.frischeUnter}:0)"> eigener Spieler unter ${RL.anhalten.frischeUnter} % Frische</label></div></details>`);
  document.getElementById('lv-titel').textContent=liveTitel();}
function liveTitel(){const g=LIVE.v.platz.g;return g.titel;}
function liveTab(k){if(!LIVE)return;LIVE.tab=k;liveRender();}
function liveStart(){const L=LIVE;if(!L||L.lauf||L.ende)return;L.lauf=true;L.timer=setInterval(liveTick,RL.tempo[liveEinst().tempo]||1000);liveSteuer();}
function liveStop(){const L=LIVE;if(!L)return;L.lauf=false;clearInterval(L.timer);L.timer=null;liveSichern();liveSteuer();}
// Eine Minute weiter, danach prüfen, ob angehalten wird
function liveTick(){const L=LIVE;if(!L)return;const G=L.G;if(G.ende){liveAbpfiff();return;}
  G.minute();const halt=liveHalte();liveRender();
  if(G.ende){liveAbpfiff();return;}
  if(G.m%10===0&&!G.elf)liveSichern();
  const p=G.pause();
  if(p==='elfmeter'){liveStop();L.meldung='Auch nach 120 Minuten unentschieden: Elfmeterschießen! Lege die Reihenfolge deiner Schützen fest.';liveRender();return;}if(p==='halbzeit'&&!L.hz){L.hz=true;liveStop();L.meldung='Halbzeit. Ansprache, Wechsel und Umstellungen sind jetzt möglich.';liveRender();return;}
  if(p==='verlaengerung'&&!L.verl){L.verl=true;liveStop();L.meldung='Unentschieden nach 90 Minuten: Es gibt Verlängerung. In der Verlängerung ist ein weiterer Wechsel erlaubt.';liveRender();return;}
  if(halt){liveStop();L.meldung=halt;liveRender();}}
function liveHalte(){const L=LIVE,G=L.G,A=liveEinst().anhalten,neu=G.ev.slice(L.evN);L.evN=G.ev.length;let t=null;
  for(const e of neu){const mein=e.s===L.s;
    if(e.t==='G'&&A.tor)t=`Tor! ${e.n} trifft zum ${e.sc.join(':')}.`;
    else if(e.t==='R'&&A.rot)t=`${e.x||`${e.gy?'Gelb-Rot':'Rot'} für ${e.n}`}${mein?' – du bist in Unterzahl.':'.'}`;
    else if(e.t==='I'&&mein&&A.verletzung)t=`${e.n} ist verletzt (${URSACHE[e.q]||'Verletzung'}) und humpelt nur noch. Wechseln?`;
    else if(e.t==='C'&&e.art==='elfmeter'&&A.elfmeter)t=e.x||'Elfmeter vergeben.';
    else if(e.t==='Y'&&mein&&A.gelbRotGefahr&&e.p&&gelbRotGefahr(G,L.s,e.p))t=`Gelb für ${e.n}. Er foult viel, beim nächsten Foul droht Gelb-Rot.`;}
  if(!t&&A.frischeUnter){const x=G.Ss[L.s].xp.find(y=>!G.off.has(y.p.id)&&!G.raus.has(y.p.id)&&G.fr[y.p.id]<A.frischeUnter&&!L.gewarnt.has(y.p.id));
    if(x){L.gewarnt.add(x.p.id);t=`${x.p.n} ist platt (Frische ${Math.round(G.fr[x.p.id])} %).`;}}
  return t;}
// Gelb-Rot-Gefahr (K05 §4.3): verwarnte Abwehrspieler und Sechser, Ungestüme und Hitzköpfe foulen am meisten
function gelbRotGefahr(G,s,id){const x=G.Ss[s].xp.find(y=>y.p.id===id);if(!x)return false;return posGruppe(x.pos)==='AB'||x.pos==='DM'||hatMk(x.p,'ungestuem')||hatEig(x.p,'hitzkopf');}
// Vorspulen: der Co-Trainer übernimmt bis zur Halbzeit oder bis zum Ende
function liveSpulen(bis){const L=LIVE;if(!L||L.ende)return;if(bis==='ende')L.vorgespult=1;liveStop();const G=L.G,alt=G.auto[L.s],m0=G.m,k0=G.elf?G.elf.k:null;G.auto[L.s]=true;
  while(!G.ende&&!(bis==='hz'&&G.m>=45)){G.minute();}
  G.auto[L.s]=alt;if(S.live){S.live.eing.push({m:m0,k:k0,a:'spulen',x:[G.m]});}L.evN=G.ev.length;if(bis==='hz'&&G.m===45){L.hz=true;L.meldung='Halbzeit. Der Co-Trainer hat bis hierher entschieden.';}
  liveSichern();liveRender();if(G.ende)liveAbpfiff();}
function liveBisEnde(){liveSpulen('ende');}
function liveSteuer(){const L=LIVE,el=document.getElementById('lv-steuer');if(!el||!L)return;
  if(L.ende){el.innerHTML=`<button class="go" id="lv-weiter" onclick="liveWeiter()">Weiter</button>`;const b=document.getElementById('lv-weiter');if(b)b.focus();return;}
  el.innerHTML=`${L.lauf?`<button id="lv-pause-btn" onclick="liveStop()">Pause</button>`:`<button class="go" id="lv-los" onclick="LIVE.meldung='';liveStart()">${L.G.m===0?'Anpfiff':L.G.m===45?'2. Halbzeit':'Weiter'}</button>`}
    ${L.G.m<45?`<button onclick="liveSpulen('hz')">Bis zur Halbzeit</button>`:''}<button onclick="liveBisEnde()">${L.G.elf?'Alle Elfmeter':'Zum Abpfiff'}</button>`;}
function liveAbpfiff(){const L=LIVE;if(!L||L.ende)return;liveStop();L.ende=true;const G=L.G;L.meldung=G.pen?`Elfmeterschießen ${G.pen[0]}:${G.pen[1]}.`:'Abpfiff.';liveRender();liveSteuer();}
// Ergebnis eintragen und den Tag abschließen
function liveWeiter(){const L=LIVE;if(!L||!L.ende)return;BUSY=true;let out=null;
  try{liveEintragen(L.v);S.live=null;if(!L.vorgespult)aufgabe('liveBisEnde');out=tagesSpieleAbschliessen(L.v.out);LAST=out;
    if(L.ansprache){const T=myT();T.ansp=[...(T.ansp||[]),L.ansprache].slice(-RL.ansprache.abnutzungSpiele);if(L.anspPasst!=null)halbzeitGlaub(L.anspPasst);}save();}
  catch(e){console.error(e);toast('Fehler: '+e.message);}finally{BUSY=false;}
  LIVE=null;closeOv();weiterUI();}

// ---------- Eingriffe ----------
function liveZuruf(art){if(!darf('zurufe','zuruf'))return;const L=LIVE;if(!L||L.ende)return;const r=L.G.zuruf(L.s,art);if(r.ok)liveMerken('zuruf',[art]);
  L.meldung=r.ok?(r.w===1?`„${ZURUF_TEXT[art]}“ – die Mannschaft reagiert.`:r.w>0?`„${ZURUF_TEXT[art]}“ – schon wieder? Wirkt nur noch halb.`:`„${ZURUF_TEXT[art]}“ – keiner hört mehr hin.`):r.grund;liveRender();}
function liveSpielerZuruf(id,art){if(!darf('schuetzen'))return;const L=LIVE;if(!L||L.ende)return;const p=PIX.get(id),r=L.G.spielerZuruf(L.s,id,art);if(r.ok)liveMerken('spieler',[id,art]);if(r.ok)L.meldung=`${art==='loben'?'Lob':'Kritik'} für ${p.n}: ${r.text}.`;liveRender();}
function liveTaktik(k,v){if(!darf(k==='form'?'formation':k==='stil'?'stil':k==='ein'?'einstellung':v==='SD'||v==='SO'?'ausrichtung5':'ausrichtung3',k==='stil'?'stil':k==='ein'?null:'ordnung'))return;const L=LIVE;if(!L||L.ende)return;const o={};o[k]=v;L.G.taktik(L.s,o);liveMerken('taktik',[o]);const pl=L.G.plan[L.s].filter(x=>x.art===k).pop();
  L.meldung=pl?(pl.ab<=L.G.m+1?'Die Umstellung gilt ab sofort.':`Die Umstellung greift ab der ${pl.ab}. Minute.`):'Unverändert.';liveRender();}
function liveRaus(id){const L=LIVE;if(!L)return;L.raus=L.raus===id?null:id;liveRender();}
function liveRein(id){const L=LIVE;if(!L||!L.raus)return;const aus=PIX.get(L.raus),ein=PIX.get(id),ausId=L.raus,r=L.G.wechseln(L.s,L.raus,id);if(r.ok){liveMerken('wechsel',[ausId,id]);aufgabe('wechsel');}
  L.meldung=r.ok?`Wechsel: ${ein.n} kommt für ${aus.n}.`:r.grund;L.raus=null;L.evN=L.G.ev.length;liveRender();}
function liveAnsprache(art){if(!darf('zurufe','zuruf'))return;const L=LIVE;if(!L||L.G.m!==45||L.ansprache)return;const T=myT(),alt=(T.ansp||[]).slice(-(RL.ansprache.abnutzungSpiele-1));
  // Glaubwürdigkeit (K15 §5.5): Die Wirkung hängt davon ab, wie sehr die Mannschaft dir glaubt. Nur Ansprachen mit Anlass verändern danach die Glaubwürdigkeit.
  const abn=(alt.length===RL.ansprache.abnutzungSpiele-1&&alt.every(a=>a===art)&&art!=='schweigen'?0.5:1)*glaubFaktor(),r=L.G.ansprache(L.s,art,abn);L.ansprache=art;L.anspPasst=['loben','motivieren','fordern','beruhigen'].includes(art)?(r.passt&&abn>=glaubFaktor()?true:r.passt?null:false):null;liveMerken('ansprache',[art,abn]);
  L.meldung=`Ansprache „${ANSPRACHE_TEXT[art]}“${r.passt?'':' – passt nicht zur Lage, die Spieler sind irritiert'}${abn<glaubFaktor()?' (kennen sie schon, wirkt nur halb)':''}.`;liveRender();}

// ---------- Anzeige ----------
function liveRender(){const L=LIVE;if(!L)return;if(!document.getElementById('lv-inhalt'))liveFrame();const G=L.G,r={h:G.hid,a:G.aid};
  document.getElementById('lv-uhr').textContent=L.ende?'Ende':G.elf?'i.E.':G.m===0?'0′':G.m+'′';
  const karten=s=>{const n=G.ev.filter(e=>e.s===s&&e.t==='R').length;return n?` <span class="lv-rot" title="Platzverweise">${'▮'.repeat(n)}</span>`:'';};
  document.getElementById('lv-tafel').innerHTML=`<div class="board"><div class="t">${esc(tn(G.hid))}${karten(0)}</div><div class="score">${G.sc[0]}:${G.sc[1]}</div><div class="t">${karten(1)}${esc(tn(G.aid))}</div></div>${G.pen?`<p class="dim" style="text-align:center;margin-top:6px">Elfmeterschießen ${G.pen[0]}:${G.pen[1]}</p>`:''}`;
  document.getElementById('lv-druck').innerHTML=liveDruck();
  document.getElementById('lv-meldung').textContent=L.meldung||'';
  document.getElementById('lv-pause').innerHTML=G.pause()==='elfmeter'&&!L.lauf?liveElfmeter():G.m===45&&!L.ende&&!L.lauf?liveHalbzeit():'';
  ['spiel','elf','taktik','stat','konf'].forEach(k=>{const b=document.getElementById('lv-tab-'+k);if(b)b.classList.toggle('on',L.tab===k);});
  const inh=document.getElementById('lv-inhalt');
  inh.innerHTML=L.tab==='elf'?liveElf():L.tab==='taktik'?liveTaktikAnsicht():L.tab==='stat'?liveStat():L.tab==='konf'?liveKonf():liveTicker(r);
  liveSteuer();}
// Druckleiste (K05 §5.6): Ballbesitz der letzten 5 Minuten, gewichtet mit Chancen. Reine Anzeige.
function liveDruck(){const L=LIVE,G=L.G,D=RL.druckleiste,von=G.m-D.minuten;let w=[0,0];
  G.verlauf.filter(x=>x[0]>von).forEach(x=>w[x[1]]+=1);G.ev.filter(e=>e.m>von&&(e.t==='C'||e.t==='G')).forEach(e=>w[e.s]+=e.art==='gross'||e.t==='G'?D.gross:D.halb);
  const sum=w[0]+w[1],h=sum?Math.round(100*w[0]/sum):50;return`<div class="lv-druck-bar"><i style="width:${h}%"></i></div><div class="lv-druck-lbl"><span>${esc(tn(G.hid))} ${h} %</span><span>Druck, letzte ${D.minuten} Minuten</span><span>${100-h} % ${esc(tn(G.aid))}</span></div>`;}
function liveTicker(r){const G=LIVE.G,l=G.ev.filter(e=>e.t!=='P'||LIVE.ende).map((e,i)=>({m:e.m,h:evText(e,r),t:e.t,o:0,i}));l.push({m:0,h:'Anpfiff.',t:'K',o:1});
  if(G.m>=45)l.push({m:45,h:'Halbzeit.',t:'K',o:1});if(G.m>90)l.push({m:90,h:'Verlängerung.',t:'K',o:1});if(LIVE.ende)l.push({m:G.m,h:'Abpfiff.',t:'K',o:1});
  l.sort((a,b)=>b.m-a.m||b.o-a.o||(b.i||0)-(a.i||0));return`<div class="tick">${l.map(e=>`<div><span>${e.m}'</span><i class="ic ${e.t}"></i><span>${e.h}</span></div>`).join('')}</div>`;}
function liveElf(){const L=LIVE,G=L.G,s=L.s,sd=G.Ss[s],fw=G.wechselFrei(s),max=RL.wechsel.anzahl+(G.m>=90&&G.o.ko?RL.wechsel.verlaengerung:0);
  const zeile=x=>{const p=x.p,f=Math.round(G.fr[p.id]),rot=G.off.has(p.id),verl=G.inj.some(i=>i.id===p.id),gelb=G.yel[p.id];
    return`<div class="lv-sp ${L.raus===p.id?'sel':''}"><span class="pos ${posGruppe(x.pos)}">${x.pos}</span><span class="lv-n">${esc(p.n)}${gelb?' <i class="ic Y"></i>':''}${verl?' <i class="ic I"></i>':''}${rot?' <i class="ic R"></i>':''}</span>
      <span class="meter" title="Frische ${f} %"><i class="${f<55?'low':f<70?'mid':''}" style="width:${f}%"></i></span><span class="lv-f">${f} %</span>
      ${rot||L.ende?'':`<span class="lv-akt"><button onclick="liveSpielerZuruf(${p.id},'loben')"${lzAus('schuetzen')} title="Loben">Lob</button><button onclick="liveSpielerZuruf(${p.id},'kritik')"${lzAus('schuetzen')} title="Kritisieren">Kritik</button><button onclick="liveRaus(${p.id})" ${fw.ok&&G.bank[s].length?'':'disabled'}>${L.raus===p.id?'abbrechen':'raus'}</button></span>`}</div>`;};
  const bank=G.bank[s].map(id=>PIX.get(id)).filter(Boolean);
  return`<div class="card"><h3>Auf dem Platz <span class="dim">· ${sd.form||myT().form}, Wechsel ${G.wz[s]}/${max}${fw.ok?'':' – '+fw.grund}</span></h3><div class="lv-elf">${sd.xp.filter(x=>!G.raus.has(x.p.id)).map(zeile).join('')}</div></div>
  <div class="card"><h3>Bank</h3>${L.raus?`<p class="dim">Wer kommt für ${esc(PIX.get(L.raus).n)}?</p>`:'<p class="dim">Erst bei einem Spieler auf dem Platz „raus“ wählen.</p>'}
    <div class="lv-elf">${bank.map(p=>`<div class="lv-sp"><span class="pos ${p.pos}">${p.fp||p.pos}</span><span class="lv-n">${esc(p.n)} <span class="dim">${Math.round(p.str)}</span></span><span class="meter"><i style="width:${Math.round(p.fit)}%"></i></span><span class="lv-f">${Math.round(p.fit)} %</span><span class="lv-akt"><button onclick="liveRein(${p.id})" ${L.raus?'':'disabled'}>rein</button></span></div>`).join('')||'<p class="dim">Niemand mehr auf der Bank.</p>'}</div></div>`;}
function liveTaktikAnsicht(){const L=LIVE,G=L.G,s=L.s,sd=G.Ss[s],plan=G.plan[s];
  const sel=(k,opts,akt)=>`<select onchange="liveTaktik('${k}',this.value)" ${L.ende?'disabled':''}${k==='stil'?lzAus('stil'):k==='ein'?lzAus('einstellung'):''}>${opts.map(([v,l])=>`<option value="${v}" ${v===akt?'selected':''} ${k==='tac'&&(v==='SD'||v==='SO')&&!frei('ausrichtung5')?'disabled':''}>${l}</option>`).join('')}</select>`;
  const geplant=plan.length?`<p class="dim">Geplant: ${plan.map(x=>`${{form:'Grundordnung',tac:'Ausrichtung',ein:'Einsatz',stil:'Spielstil'}[x.art]} → ${x.art==='tac'?AUSRICHTUNG[x.wert]:x.art==='ein'?EINSATZ[x.wert]:x.art==='stil'?STIL_NAME[x.wert]:x.wert} ab der ${x.ab}. Minute`).join(', ')}</p>`:'';
  const op=G.Ss[1-s],kr=!op.am&&RTA.kreislauf[sd.stil]===op.stil?'Dein Stil schlägt seinen.':!op.am&&RTA.kreislauf[op.stil]===sd.stil?'Sein Stil schlägt deinen.':'';
  const aktiv=G.rufe[s].filter(r=>G.m>=r.m&&G.m<r.m+RL.zurufe.dauer&&r.w).map(r=>`${ZURUF_TEXT[r.art]} (bis zur ${r.m+RL.zurufe.dauer}. Minute)`);
  return`<div class="card"><h3>Taktik</h3><div class="form">
    <label>Grundordnung ${sel('form',Object.keys(RE.formationen).map(f=>[f,f]),sd.form)}</label>
    <label>Ausrichtung ${sel('tac',Object.entries(AUSRICHTUNG),sd.tac)}</label>
    <label>Einsatz ${sel('ein',Object.entries(EINSATZ),sd.ein)}</label>
    <label>Spielstil ${sel('stil',STILE.map(k=>[k,STIL_NAME[k]]),sd.stil)}</label></div>${lzHinweis('stil')}${lzHinweis('einstellung')}
    <p class="dim">Gegner: ${op.am?'Amateurklub':`${STIL_NAME[op.stil]||'–'}, ${op.form||''}`}. ${kr} Umsetzung deines Stils ${Math.round((sd.u||1)*100)} %.</p>
    <p class="dim">Grundordnung und Spielstil wirken nach ${RL.umstellung.ordnung} Minuten, Ausrichtung und Einsatz nach ${RL.umstellung.ausrichtung}. In der Halbzeit gelten Ausrichtung und Einsatz sofort.</p>${geplant}</div>
  <div class="card"><h3>Zurufe</h3>${lzHinweis('zurufe')}<div class="row">${ZURUFE.map(a=>`<button onclick="liveZuruf('${a}')" ${L.ende?'disabled':''}${lzAus('zurufe')}>${ZURUF_TEXT[a]}</button>`).join('')}</div>
    <p class="dim">Wirken ${RL.zurufe.dauer} Minuten. Derselbe Zuruf innerhalb von ${RL.zurufe.abnutzungMinuten} Minuten wirkt nur halb, ein drittes Mal gar nicht. „Zeit schinden“ nur bei Führung, kostet Gelbe Karten.</p>
    ${aktiv.length?`<p>Aktiv: ${aktiv.map(esc).join(', ')}</p>`:''}</div>`;}
function liveStat(){const G=LIVE.G,st=G.st,b=st.besitz[0]+st.besitz[1],z=(l,a,c)=>`<div class="lv-st"><span>${a}</span><span>${l}</span><span>${c}</span></div>`;
  return`<div class="card lv-stat">${z('Ballbesitz',b?Math.round(100*st.besitz[0]/b)+' %':'–',b?Math.round(100*st.besitz[1]/b)+' %':'–')}${z('Torschüsse',st.schuesse[0],st.schuesse[1])}${z('aufs Tor',st.aufsTor[0],st.aufsTor[1])}${z('Großchancen',st.gross[0],st.gross[1])}${z('Ecken',st.ecken[0],st.ecken[1])}${z('Fouls',st.fouls[0],st.fouls[1])}
    ${z('Gelbe Karten',G.ev.filter(e=>e.t==='Y'&&e.s===0).length,G.ev.filter(e=>e.t==='Y'&&e.s===1).length)}${z('Wechsel',G.wz[0],G.wz[1])}</div>`;}
function liveKonf(){const L=LIVE,G=L.G,mn=G.m,done=L.ende;
  const grp=L.v.out.gruppen.map(g=>{const oth=g.list.filter(r=>r);return oth.length?`<h3>${esc(g.titel)}</h3><div class="others">${oth.map(r=>om(r,mn,done&&mn>=90,false)).join('')}</div>`:'';}).join('');
  return`<div class="card">${grp||'<p class="dim">Heute keine weiteren Spiele.</p>'}<p class="dim">Die anderen Spiele laufen zeitgleich mit, Stand nach ${mn} Minuten.</p></div>`;}
// Elfmeterschießen (K05 §4.6): Reihenfolge der Schützen vor dem ersten Schuss
function liveElfmeter(){const L=LIVE,G=L.G,s=L.s,reihe=G.elfmeterReihe[s].filter(id=>G.Ss[s].xp.some(x=>x.p.id===id&&!G.off.has(id)));
  return`<div class="card lv-hz"><h3>Elfmeterschießen</h3><p class="dim">Die ersten fünf schießen zuerst, danach geht es der Reihe nach weiter. ▲ schiebt einen Schützen nach vorn.</p>
  <ol class="lv-reihe">${reihe.map((id,i)=>{const p=PIX.get(id);return`<li><span>${esc(p.n)}${hatMk(p,'elfmeter')?' <span class="dim">(Elfmeterschütze)</span>':''}${hatEig(p,'nervenschwach')&&bekannteEigenschaften(p).includes('nervenschwach')?' <span class="dim">(nervenschwach)</span>':''}</span>${i?`<button onclick="liveReihe(${id})"${lzAus('schuetzen')} aria-label="${esc(p.n)} nach vorn">▲</button>`:''}</li>`;}).join('')}</ol></div>`;}
function liveReihe(id){if(!darf('schuetzen'))return;const L=LIVE;if(!L||!L.G.elf||L.G.elf.k)return;const r=L.G.elfmeterReihe[L.s],i=r.indexOf(id);if(i>0){[r[i-1],r[i]]=[r[i],r[i-1]];liveMerken('reihe',[r.slice()]);}liveRender();}
// Halbzeit (K05 §4.4): Statistik, Einschätzung des Co-Trainers, Ansprache
function liveHalbzeit(){const L=LIVE,G=L.G;return`<div class="card lv-hz"><h3>Halbzeit</h3><p>${esc(coEinschaetzung(G,L.s))}</p>
  ${L.ansprache?`<p class="dim">Ansprache gehalten: ${ANSPRACHE_TEXT[L.ansprache]}.</p>`:`${lzHinweis('zurufe')}<p class="dim">Ansprache in der Kabine:</p><div class="row lv-ansp">${ANSPRACHEN.map(a=>`<button onclick="liveAnsprache('${a}')"${lzAus('zurufe')} title="${ANSPRACHE_HILFE[a]}">${ANSPRACHE_TEXT[a]}${G.passt(L.s,a)&&a!=='schweigen'&&a!=='taktik'&&a!=='augenzwinkernd'?' ✓':''}</button>`).join('')}</div><p class="dim">✓ passt zur Lage. Unpassende Ansprachen schaden.</p>`}</div>`;}
// Einschätzung des Co-Trainers: schwächster und stärkster Bereich im Vergleich zum Gegner (Genauigkeit ab K16)
function coEinschaetzung(G,s){const W=G.werte(),me=W[s],op=W[1-s];if(!me||!op)return'';
  const v=[['linke Abwehrseite',me.DL/op.AR],['rechte Abwehrseite',me.DR/op.AL],['Innenverteidigung',me.DM/op.AM],['Mittelfeld',me.K/op.K],['linke Angriffsseite',me.AL/op.DR],['rechte Angriffsseite',me.AR/op.DL],['Mitte im Angriff',me.AM/op.DM]].sort((a,b)=>a[1]-b[1]);
  const sch=v[0],st=v[v.length-1],muede=G.Ss[s].xp.filter(x=>!G.off.has(x.p.id)&&!G.raus.has(x.p.id)&&G.fr[x.p.id]<70).map(x=>x.p.n);
  return`Co-Trainer: „Unsere ${sch[0]} ${sch[1]<0.93?'ist klar unterlegen':sch[1]<1?'hat Probleme':'hält einigermaßen'}. Am besten läuft es über die ${st[0]}.${muede.length?` ${muede.slice(0,3).join(', ')} ${muede.length>1?'sind':'ist'} schon ziemlich platt.`:''}“`;}
