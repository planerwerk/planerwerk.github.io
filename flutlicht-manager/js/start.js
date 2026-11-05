// Startbildschirm, Laden, neues Spiel und Programmstart.
function renderStart(){
  const opt=lg=>VEREINE.map((c,i)=>[c,i]).filter(([c])=>c.liga===lg).map(([c,i])=>`<option value="${i}" ${c.kurz==='SCF'?'selected':''}>${c.name}</option>`).join('');
  app.innerHTML=`<div class="start"><div><h1 class="logo">Flutlicht<span>Manager</span></h1><div class="beams" style="margin-top:14px"></div></div>
  <p class="tagline">Fußballmanager für die Saison 2026/27 · 1. und 2. Bundesliga · DFB-Pokal · Transfers, Stadion, Finanzen, Vorstand.</p>
  ${hasSave()?`<button class="go" onclick="loadLocal()">Weiterspielen</button>`:''}
  <div class="card"><h2>Neues Spiel</h2><div class="form"><label>Dein Name <input id="mgr" value="Trainer" maxlength="30"></label>
  <label>Verein <select id="club"><optgroup label="1. Bundesliga 2026/27">${opt(1)}</optgroup><optgroup label="2. Bundesliga 2026/27">${opt(2)}</optgroup></select></label>
  <details><summary>Erweitert</summary><label style="margin-top:8px">Startwert für den Zufall (Seed, leer = zufällig) <input id="seed" inputmode="numeric" placeholder="zum Beispiel 12345"></label></details>
  <button class="go" onclick="newGame()">Anpfiff zur Karriere</button></div></div>
  <details class="card"><summary>Spielstand-Code laden</summary><textarea id="imp" placeholder="Code hier einfügen" style="margin-top:8px"></textarea><div class="row" style="margin-top:8px"><button onclick="importSave()">Laden</button></div></details>
  <p class="dim">Kader aller 36 Vereine: deutsche Wikipedia, Stand Ende August bis Ende Oktober 2026. Die Stärkewerte sind geschätzt und lassen sich im Spiel über „Spielerdaten bearbeiten“ ändern. Nachwuchsspieler, Vereinslose und die Amateurklubs im Pokal sind erfunden.</p></div>`;}
function loadLocal(){try{const s=localStorage.getItem(REGELN.spielstand.schluessel);if(s){S=JSON.parse(s);reindex();TAB='buero';render();}}catch(e){toast('Spielstand konnte nicht geladen werden.');}}
function newGame(){const id=+document.getElementById('club').value,name=(document.getElementById('mgr').value||'Trainer').trim().slice(0,30)||'Trainer';
  const se=(document.getElementById('seed')||{}).value,seed=se&&/^\d+$/.test(se.trim())?(+se.trim())>>>0:neuerSeed();
  buildWorld(seed);S.my=id;S.mgr=name;setTarget();sponsOffers();S.lineup=bestXI(id,myT().form);
  news('Tipp: Kader und Aufstellung prüfen, Sponsor wählen, dann oben auf „1. Spieltag ▶“ klicken.');
  news(`Willkommen, ${name}! Der Vorstand von ${myT().name} erwartet: ${targetText(myT().lg,S.target)}.`,'good');
  save();TAB='buero';render();}

// Test- und Fehlersuch-Zugang
window.FM={get S(){return S;},buildWorld,playWeek,seasonEnd,newSeason,takeJob,render,V,tab,table};
// Start, mit Erhalt des Spielstands bei Live-Updates
try{window.claude?.hot?.snapshot?.(()=>({S,TAB}));}catch(e){}
function start(d){if(d&&d.S){S=d.S;TAB=d.TAB||'buero';reindex();}render();}
try{window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});}catch(e){start({});}
