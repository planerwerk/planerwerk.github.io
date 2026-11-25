// Klang (K41, W5f): Pfiffe, Torjubel, Raunen und Oberflächentöne, erzeugt mit der Web Audio API im Browser, ohne Dateien und ohne Lizenzfrage.
// Einstellung je Gerät im Browser (REGELN.klang.schluessel): an oder aus, Lautstärke; nie im Spielstand. Ton entsteht erst nach der ersten Bedienung
// (Regel der Browser) und nicht bei verstecktem Tab. Jede Information steht auch auf dem Bildschirm, Klang begleitet nur.
// Ohne Zufall im Spiel: Das Rauschen für Jubel und Raunen kommt aus einem eigenen festen Generator (kein R(), kein Math.random), keine Wirkung aufs Spiel.
let KLANG_CTX=null,KLANG_EINST=null;
function klangEinst(){if(KLANG_EINST)return KLANG_EINST;const K=REGELN.klang;let e={};try{e=JSON.parse(localStorage.getItem(K.schluessel)||'{}')||{};}catch(x){e={};}
  KLANG_EINST={an:e.an!==undefined?!!e.an:K.an,laut:typeof e.laut==='number'?Math.max(0,Math.min(1,e.laut)):K.laut};return KLANG_EINST;}
function klangSpeichern(){try{localStorage.setItem(REGELN.klang.schluessel,JSON.stringify(klangEinst()));}catch(x){}}
function klangUmschalten(){const e=klangEinst();e.an=!e.an;klangSpeichern();if(e.an){klangCtx();klang('klick');}if(typeof render==='function')render();}
function klangLautSetzen(v){const e=klangEinst();e.laut=Math.max(0,Math.min(1,(+v||0)/100));klangSpeichern();klang('klick');}
function klangCtx(){if(typeof window==='undefined')return null;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
  if(!KLANG_CTX){try{KLANG_CTX=new AC();}catch(x){return null;}}if(KLANG_CTX.state==='suspended')KLANG_CTX.resume().catch(()=>{});return KLANG_CTX;}
// Ein Klang: klick, brief, pfiff (einmal), pfiff3 (Abpfiff), jubel, raunen. Pegel je Art in REGELN.klang.pegel.
function klang(art){const e=klangEinst(),P=REGELN.klang.pegel;if(!e.an||e.laut<=0||!P[art]||typeof document==='undefined'||document.hidden)return;const c=klangCtx();if(!c||c.state!=='running')return;
  const t=c.currentTime,aus=c.createGain();aus.gain.value=e.laut*P[art];aus.connect(c.destination);
  const ton=(f,von,dauer,typ)=>{const o=c.createOscillator(),g=c.createGain();o.type=typ||'sine';o.frequency.setValueAtTime(f,t+von);g.gain.setValueAtTime(0.0001,t+von);
    g.gain.exponentialRampToValueAtTime(1,t+von+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+von+dauer);o.connect(g);g.connect(aus);o.start(t+von);o.stop(t+von+dauer+0.02);};
  if(art==='klick')ton(1800,0,0.04,'triangle');
  else if(art==='brief'){ton(880,0,0.12);ton(1320,0.1,0.18);}
  else if(art==='pfiff'||art==='pfiff3'){const n=art==='pfiff3'?3:1;
    for(let i=0;i<n;i++){const v=i*0.45,d=i===n-1?0.65:0.3,o=c.createOscillator(),m=c.createOscillator(),mg=c.createGain(),bp=c.createBiquadFilter(),g=c.createGain();
      o.type='square';o.frequency.value=2900;m.frequency.value=45;mg.gain.value=180;m.connect(mg);mg.connect(o.frequency);bp.type='bandpass';bp.frequency.value=3000;bp.Q.value=4;
      g.gain.setValueAtTime(0.0001,t+v);g.gain.exponentialRampToValueAtTime(0.35,t+v+0.02);g.gain.setValueAtTime(0.35,t+v+d-0.05);g.gain.exponentialRampToValueAtTime(0.0001,t+v+d);
      o.connect(bp);bp.connect(g);g.connect(aus);o.start(t+v);m.start(t+v);o.stop(t+v+d+0.02);m.stop(t+v+d+0.02);}}
  else if(art==='jubel'||art==='raunen'){const j=art==='jubel',d=j?2.6:1.2,len=Math.floor(c.sampleRate*d),b=c.createBuffer(1,len,c.sampleRate),x=b.getChannelData(0);let s=12345;
    for(let i=0;i<len;i++){s=(Math.imul(s,1664525)+1013904223)>>>0;x[i]=s/2147483648-1;}
    const q=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();q.buffer=b;f.type='bandpass';f.frequency.value=j?900:450;f.Q.value=0.7;
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(j?0.9:0.5,t+(j?0.35:0.3));g.gain.exponentialRampToValueAtTime(0.0001,t+d);q.connect(f);f.connect(g);g.connect(aus);q.start(t);q.stop(t+d);}}
// Knopf in der Kopfzeile (Stumm, Taste M) und Karte im Menü
function klangKnopf(){const an=klangEinst().an;return`<button class="ton" onclick="klangUmschalten()" aria-label="${an?'Ton ausschalten':'Ton einschalten'}" title="${an?'Ton aus':'Ton an'} (Taste M)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${an?'M4 10v4h3l5 4V6L7 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11':'M4 10v4h3l5 4V6L7 10zM16 9l5 6M21 9l-5 6'}"></path></svg></button>`;}
function klangKarte(){const e=klangEinst();return`<div class="card"><h3>Klang</h3><p class="dim">Pfiffe und Torjubel im Live-Spiel, erzeugt im Browser. Gilt für dieses Gerät. Stumm auch über den Knopf oben oder die Taste M.</p>
  <div class="form"><label class="pick"><input type="checkbox" ${e.an?'checked':''} onchange="klangUmschalten()"> Ton an</label><label>Lautstärke <input type="range" min="0" max="100" step="5" value="${Math.round(e.laut*100)}" onchange="klangLautSetzen(this.value)" aria-label="Lautstärke"></label></div></div>`;}
// Ton erst nach der ersten Bedienung freischalten; Taste M schaltet stumm (nicht beim Tippen in Feldern)
if(typeof document!=='undefined'&&typeof document.addEventListener==='function'){
  const frei=()=>{if(klangEinst().an)klangCtx();};document.addEventListener('pointerdown',frei,{once:true});
  document.addEventListener('keydown',e=>{const z=e.target||{};if((e.key==='m'||e.key==='M')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!['INPUT','TEXTAREA','SELECT'].includes(z.tagName)&&!z.isContentEditable&&typeof S!=='undefined'&&S){e.preventDefault();klangUmschalten();}});}
