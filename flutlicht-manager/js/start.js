// Startbildschirm, Laden, neues Spiel und Programmstart.
// Stadion bei Nacht (K39 §3.3, W5e4): eigene Illustration für den Startbildschirm, als SVG im Code (keine Datei, kein fremdes Bild)
function stadionBild(){const masten=[[70,50],[200,70],[420,70],[550,50]],kegel=['M50 50L90 50L430 240L150 240Z','M180 70L220 70L470 240L170 240Z','M400 70L440 70L450 240L150 240Z','M530 50L570 50L470 240L190 240Z'];
  // Intro (K39 §3.4, W5e10): die Masten gehen nacheinander an (Verzögerung je Mast), still bei Sequenzen „aus“ oder „weniger Bewegung“
  const an=i=>`class="st-an" style="animation-delay:${(0.3+0.4*i).toFixed(1)}s"`,still=typeof sequenzAn==='function'&&!sequenzAn();
  const lampen=([x,y],i)=>{let h=`<rect x="${x-22}" y="${y-10}" width="44" height="20" rx="3" fill="#2a3b5a"/>`;for(let r=0;r<2;r++)for(let c=0;c<4;c++)h+=`<circle ${an(i)} cx="${x-15+c*10}" cy="${y-4+r*8}" r="3" fill="#fff3cf"/>`;return h;};
  return`<svg class="stadion${still?' still':''}" viewBox="0 0 620 240" role="img" aria-label="Stadion bei Nacht unter Flutlicht (eigene Illustration)"><defs>
  <linearGradient id="st-himmel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a12"/><stop offset="1" stop-color="#1b2a45"/></linearGradient>
  <radialGradient id="st-schein"><stop offset="0" stop-color="#ffe7a3" stop-opacity=".55"/><stop offset="1" stop-color="#ffc83d" stop-opacity="0"/></radialGradient>
  <linearGradient id="st-kegel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a3" stop-opacity=".16"/><stop offset="1" stop-color="#ffe7a3" stop-opacity="0"/></linearGradient>
  <linearGradient id="st-rasen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8a52"/><stop offset="1" stop-color="#16492c"/></linearGradient></defs>
  <rect width="620" height="240" fill="url(#st-himmel)"/><path d="M0 150H620V162H0Z" fill="#16233a"/><path d="M0 162H620V196H0Z" fill="#0c1524"/><path d="M0 172H620M0 184H620" stroke="#15223a" stroke-width="1.5"/>
  ${kegel.map((d,i)=>`<path ${an(i)} d="${d}" fill="url(#st-kegel)"/>`).join('')}
  <path d="M-60 240L95 196H525L680 240Z" fill="url(#st-rasen)"/><path d="M28 217L95 196H150L114 217ZM200 217L204 196H259L288 217ZM374 217L368 196H423L460 217ZM546 217L476 196H525L600 217Z" fill="#ffffff" opacity=".05"/>
  <path d="M310 196V240M95 196H525M-60 240L95 196M525 196L680 240" fill="none" stroke="#e9f5ec" stroke-width="1.5" opacity=".55"/><ellipse cx="310" cy="222" rx="60" ry="12" fill="none" stroke="#e9f5ec" stroke-width="1.5" opacity=".55"/>
  ${masten.map(([x,y],i)=>`<path d="M${x} ${y+10}L${x<310?x+12:x-12} 150" stroke="#24324d" stroke-width="3"/><circle ${an(i)} cx="${x}" cy="${y}" r="60" fill="url(#st-schein)"/>${lampen([x,y],i)}`).join('')}</svg>`;}
function renderStart(){
  const opt=lg=>VEREINE.map((c,i)=>[c,i]).filter(([c])=>c.liga===lg).map(([c,i])=>`<option value="${i}" ${c.kurz==='SCF'?'selected':''}>${c.name}</option>`).join('');
  app.innerHTML=`<div class="start">${stadionBild()}<div><h1 class="logo">Flutlicht<span>Manager</span></h1><p class="leitspruch">${esc(REGELN.darstellung.leitspruch)}</p></div>
  <p class="tagline">Fußballmanager für die Saison 2026/27 · 1. bis 3. Liga · DFB-Pokal · Transfers, Stadion, Finanzen, Vorstand.</p>
  ${hasSave()?`<button class="go" onclick="loadLocal()">Weiterspielen</button>`:''}
  <div class="card"><h2>Neues Spiel</h2><div class="form"><label>Dein Name <input id="mgr" value="Trainer" maxlength="30"></label>
  <label>Verein <select id="club"><optgroup label="1. Bundesliga 2026/27">${opt(1)}</optgroup><optgroup label="2. Bundesliga 2026/27">${opt(2)}</optgroup></select></label>
  <label>Schwierigkeit <select id="stufe">${Object.entries(REGELN.schwierigkeit.stufen).map(([k,s])=>`<option value="${k}" ${k===REGELN.schwierigkeit.standard?'selected':''}>${s.name}: ${s.text}</option>`).join('')}${REGELN.schwierigkeit.mitwachsend?`<option value="mitwachsend">${REGELN.schwierigkeit.mitwachsend.name}: ${REGELN.schwierigkeit.mitwachsend.text}</option>`:''}</select></label>
  <label>Einstieg <select id="lernstufen"><option value="1" ${RLZ.start?'selected':''}>Mit Lernstufen (empfohlen für den Einstieg): Du beginnst mit Aufstellung und Spiel, der Stab macht den Rest, Schritt für Schritt kommt mehr dazu</option><option value="0" ${RLZ.start?'':'selected'}>Alles frei: jede Entscheidung von Anfang an bei dir</option></select></label>
  <details><summary>Erweitert</summary><label style="margin-top:8px">Startwert für den Zufall (Seed, leer = zufällig) <input id="seed" inputmode="numeric" placeholder="zum Beispiel 12345"></label></details>
  <button class="go" onclick="newGame()">Anpfiff zur Karriere</button></div></div>
  <details class="card"><summary>Spielstand-Code laden</summary><textarea id="imp" placeholder="Code hier einfügen" style="margin-top:8px"></textarea><div class="row" style="margin-top:8px"><button onclick="importSave()">Laden</button></div></details>
  <p class="dim">Kader aller 36 Vereine: deutsche Wikipedia, Stand Ende August bis Ende Oktober 2026. Die Stärkewerte sind geschätzt. Korrekturen gehören in die Datei daten/spieler.js, nicht ins Spiel. Nachwuchsspieler, Vereinslose, die Kader der 3. Liga und die Amateurklubs im Pokal sind erfunden. Die 208 Auslandsvereine tragen echte Namen (höchste Ligen 2026/27), ihre Spieler sind erfunden. Die 3. Liga erreichst du per Abstieg oder Jobwechsel.</p></div>`;}
// Spielstände älterer Testversionen passen nicht mehr und werden gelöscht
try{REGELN.spielstand.alteSchluessel.forEach(k=>localStorage.removeItem(k));}catch(e){}
themaAnwenden(themaLesen()); // Darstellung je Gerät (K35b §13.3, W5b), vor dem ersten Zeichnen
function loadLocal(){try{const s=localStorage.getItem(REGELN.spielstand.schluessel);if(s){const d=JSON.parse(s);if(d.v!==REGELN.spielstand.version){toast('Der gespeicherte Spielstand passt nicht zu dieser Version.');return;}S=d;delete S.stabT;reindex();verhUmstellen();k23cUmstellen();mitgliederUmstellen();vertragUmstellen();experimenteAnwenden();TAB='buero';render();if(S.live)liveFortsetzen();}}catch(e){toast('Spielstand konnte nicht geladen werden.');}}
function newGame(){const id=+document.getElementById('club').value,name=(document.getElementById('mgr').value||'Trainer').trim().slice(0,30)||'Trainer';
  const se=(document.getElementById('seed')||{}).value,seed=se&&/^\d+$/.test(se.trim())?(+se.trim())>>>0:neuerSeed();
  buildWorld(seed);S.my=id;S.mgr=name;stufeAnwenden((document.getElementById('stufe')||{}).value);statS();presseS().antritt=1; // Statistik ab Spielbeginn, erste Station des Trainers (K34, U13), Antrittspressekonferenz (K29, U17a)
  // Lernstufen (K36): gesperrte Bereiche führt der Stab, deshalb vor den Sponsorangeboten anlegen
  const ls=document.getElementById('lernstufen');lizenzStart(ls?ls.value!=='0':RLZ.start);sponsOffers();S.lineup=bestXI(id,myT().form);vertragNeu(id); /* Trainervertrag (K28 §5.5, U12g), nach der ersten Station */
  news(`Tipp: Kader und Aufstellung prüfen, Sponsor wählen, dann oben auf „Tag beenden ▶“ klicken. Dein erstes Pflichtspiel ist am ${datumMittel(ersterPflichttermin())}.`);
  news(`Willkommen, ${name}! Der Vorstand von ${myT().name} erwartet: ${targetText(myT().lg,S.target)}.`,'good');
  if(S.lizenz.an)news(`Du beginnst als ${lizenzName(1)}: Aufstellung, Grundordnung, Ausrichtung und dein Spiel gehören dir. Alles andere erledigt der Stab, bis du die nächste Lizenz hast. Oben steht deine Lizenz, ein Klick zeigt den Weg.`);
  experimenteAnwenden();save();TAB='buero';render();} /* neue Regeln nach dem Spielstand (K02a): ein neues Spiel beginnt ohne */

// Neue Regeln ausprobieren (K02a): experimenteAnwenden und Co. stehen seit Prüfung FN1 in js/fenster.js, weil der Test-Simulator start.js nicht lädt.

// Test- und Fehlersuch-Zugang
window.FM={get S(){return S;},buildWorld,weiter,sommerpause,tagesSpiele,meinSpiel,heuteMeinSpiel,seasonEnd,newSeason,takeJob,render,V,tab,table};
// Start, mit Erhalt des Spielstands bei Live-Updates
try{window.claude?.hot?.snapshot?.(()=>({S,TAB}));}catch(e){}
function start(d){if(d&&d.S&&d.S.v===REGELN.spielstand.version){S=d.S;TAB=d.TAB||'buero';reindex();verhUmstellen();k23cUmstellen();mitgliederUmstellen();vertragUmstellen();experimenteAnwenden();}render();if(S&&S.live)liveFortsetzen();}
try{window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});}catch(e){start({});}
