// Regler-Bausteine (K35a), übernommen aus muster/regler.html.
// Anzeigen sehen aus wie LED-Balken einer Anzeigetafel, Eingaben wie Mischpult-Regler.
// Regeln: Die Zahl steht immer daneben. Gleiche Werte haben im ganzen Spiel die gleiche Skala.
// Minimum und Maximum sind sichtbar. Farben: grün gut, gelb Achtung, rot kritisch, blau du, immer mit Text oder Zahl.
// Schätzungen sind Bänder, nie Punkte.
const rgPct=(v,min,max)=>Math.max(0,Math.min(100,(v-min)/(max-min)*100));
const rgBreite=(a,b,min,max)=>Math.max(1.2,rgPct(b,min,max)-rgPct(a,min,max));
// Anzeige-Regler: Wert zwischen min und max, optional Talent (Schraffur), Marker, Warnzonen, Verlauf
function rgAnzeige(o){const{label,sub='',min,max,wert,einheit='',talent,marker=[],zonen=[],trend,art='',dez=0}=o;
  const z=zonen.map(q=>`<div class="rg-zone ${q.art}" style="left:${rgPct(q.von,min,max)}%;width:${rgPct(q.bis,min,max)-rgPct(q.von,min,max)}%"></div>`).join('');
  const pot=talent?`<div class="rg-pot" style="left:${rgPct(talent[0],min,max)}%;width:${rgBreite(talent[0],talent[1],min,max)}%" title="erreichbares Maximum (Talent)"></div>`:'';
  const mk=marker.map(m=>`<div class="rg-mk" style="left:calc(${rgPct(m.v,min,max)}% - 1px)" title="${esc(m.t)}"></div>`).join('');
  const mkl=marker.map(m=>`<span class="rg-mkl" style="left:${rgPct(m.v,min,max)}%">${esc(m.t)}</span>`).join('');
  const zt=zonen.filter(q=>q.text&&wert>=q.von&&wert<=q.bis).map(q=>q.text)[0];
  return`<div class="rg"><div class="rg-lbl">${label}${sub?`<small>${sub}</small>`:''}</div>
    <div class="rg-track" role="meter" aria-label="${esc(label)}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${+(+wert).toFixed(dez)}">${pot}<div class="rg-fill ${art}" style="width:${rgPct(wert,min,max)}%"></div>${z}${mk}</div>
    <div class="rg-val">${de(wert,dez)}${einheit?`<small>${einheit}</small>`:''}</div>
    <div class="rg-scale"><span>${de(min)}</span>${mkl}<span>${de(max)}</span></div>${zt?`<div class="rg-note">${esc(zt)}</div>`:''}${trend&&trend.length>1?rgSpark(trend):''}</div>`;}
function rgSpark(vals){const w=160,h=22,step=w/(vals.length-1),min=Math.min(...vals)-1,max=Math.max(...vals)+1;
  const pts=vals.map((v,i)=>`${(i*step).toFixed(1)},${(h-3-(v-min)/(max-min)*(h-6)).toFixed(1)}`),l=pts[pts.length-1].split(',');
  return`<svg class="rg-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts.join(' ')}" fill="none" stroke="var(--mist)" stroke-width="1.5" vector-effect="non-scaling-stroke"/><circle cx="${l[0]}" cy="${l[1]}" r="3" fill="var(--led)"/></svg>`;}
// Unscharfer Regler: Spanne statt Punkt, unbekannt als Fragezeichen (für Scouting und Vorhersagen)
// f: Formatierung der Zahlen, zum Beispiel v=>de(v/1000,1) mit einheit ' Tsd'
function rgUnscharf(o){const{label,sub='',min,max,spanne,einheit='',f=de}=o;
  const inner=spanne?`<div class="rg-band" style="left:${rgPct(spanne[0],min,max)}%;width:${rgBreite(spanne[0],spanne[1],min,max)}%"></div>`:`<div class="rg-unknown">? ? ? ? ? ?</div>`;
  const val=spanne?(f(spanne[0])===f(spanne[1])?f(spanne[0]):`<small>ca.</small> ${f(spanne[0])}–${f(spanne[1])}`):'?';
  return`<div class="rg"><div class="rg-lbl">${label}${sub?`<small>${sub}</small>`:''}</div><div class="rg-track" role="img" aria-label="${esc(label)}">${inner}</div><div class="rg-val rg-klein">${val}${einheit?`<small>${einheit}</small>`:''}</div><div class="rg-scale"><span>${f(min)}</span><span>${f(max)}</span></div></div>`;}
// Mini-Regler für Tabellen
const rgMini=(v,min,max,art='',dez=0)=>`<div class="rg-mini"><div class="rg-track"><div class="rg-fill ${art}" style="width:${rgPct(v,min,max)}%"></div></div><span class="rg-n">${de(v,dez)}</span></div>`;
// Stell-Regler (Mischpult-Fader) mit optionaler Empfehlung als Band
function rgFader(o){const{id,label,sub='',min,max,step=1,wert,einheit='',empf,unscharf=false,enden,oninput='',onchange=''}=o;
  const rec=empf?`<div class="rg-rec${unscharf?' fuzzy':''}" style="left:${rgPct(empf[0],min,max)}%;width:${rgBreite(empf[0],empf[1],min,max)}%"></div>`:'';
  return`<div class="rg-fader"><label class="rg-lbl" for="${id}">${label}${sub?`<small>${sub}</small>`:''}</label>
    <div class="rg-fwrap">${rec}<input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${wert}" oninput="${oninput}" onchange="${onchange}"></div>
    <output class="rg-val" id="${id}Out" for="${id}">${de(wert)}${einheit?`<small>${einheit}</small>`:''}</output>
    <div class="rg-fends"><span>${enden?enden[0]:de(min)+einheit}</span><span>${enden?enden[1]:de(max)+einheit}</span></div></div>`;}
// Tauziehen: zwei Seiten auf einer Achse, die Mitte ist Gleichstand
function rgTauziehen(links,rechts,zeilen){return`<div class="rg-tug"><div class="rg-tug-kopf"><span></span><span><span>${esc(links)}</span><span>${esc(rechts)}</span></span><span></span></div>
  ${zeilen.map(([n,a,b])=>`<div class="rg-tug-r"><span>${esc(n)}</span><div class="rg-tug-bar" role="img" aria-label="${esc(n)} ${de(a)} zu ${de(b)}"><div class="a" style="width:${a/(a+b)*100}%"></div><div class="b" style="width:${b/(a+b)*100}%"></div><div class="mid"></div></div><span class="rg-n">${de(a)}:${de(b)}</span></div>`).join('')}</div>`;}
// Urteil unter einem Stell-Regler: good, warn oder bad
const rgUrteil=(art,titel,text)=>`<p class="rg-verdict v-${art}"><b>${titel}</b> · ${text}</p>`;

// Kacheln (K35b §13.2, W5c): Übersicht in Kacheln statt Tabellen. Eine Kachel, ein Thema: Titel klein oben, Kennzahl groß, eine Zeile Erklärung,
// höchstens ein Link unten. Zustand als Marke mit Symbol und Wort, nie nur Farbe. Größe: gross (2 × 2), breit (2 × 1) oder klein (1 × 1).
// o = {titel, icon, groesse, wert, sub, status ('gut' | 'achtung' | 'kritisch' | 'info'), trend {art: 'good' | 'warn' | 'bad', hoch, text}, inhalt (HTML), link {text, onclick}}
// Texte in titel, wert, sub, trend.text und link.text werden hier maskiert, inhalt ist fertiges HTML.
const KACHEL_ICON={
  termin:'M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 10h16M9 3v4M15 3v4',
  post:'M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM3 7l9 6 9-6',
  tabelle:'M4 6h16M4 12h16M4 18h16M9 6v12',
  geld:'M12 3a9 9 0 1 0 .01 0zM15 9.2a3.5 3.5 0 1 0 0 5.6M8 11h6M8 13h6',
  vorstand:'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6zM9 12l2 2 4-4',
  ziel:'M12 3a9 9 0 1 0 .01 0zM12 7a5 5 0 1 0 .01 0zM12 11a1 1 0 1 0 .01 0z',
  stimmung:'M12 3a9 9 0 1 0 .01 0zM8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2M9 9.5v.5M15 9.5v.5',
  medizin:'M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM12 8v8M8 12h8',
  training:'M8 4h8v3H8zM6 5.5H5v15h14v-15h-1M9 12h6M9 16h4',
  transfer:'M4 8h14l-3-3M20 16H6l3 3',
  spiel:'M12 3a9 9 0 1 0 .01 0zM12 7.5l4 3-1.5 4.5h-5L8 10.5z',
  kredit:'M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18',
  fitness:'M3 12h4l2-5 4 10 2-5h6',
  stadion:'M3 18c0-4 4-7 9-7s9 3 9 7M3 18h18M6 11V6M18 11V6M5 6h2M17 6h2',
  shop:'M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0',
  lohn:'M4 7h16v10H4zM12 9.5a2.5 2.5 0 1 0 .01 0zM7 12h.01M17 12h.01',
  team:'M8 11a3 3 0 1 0 .01 0zM16 11a3 3 0 1 0 .01 0zM3 20c.7-3 2.7-4.5 5-4.5s4.3 1.5 5 4.5M11 20c.7-3 2.7-4.5 5-4.5s4.3 1.5 5 4.5',
  kapitaen:'M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9 5.5-.8z',
  versprechen:'M8 12l3 3 5-6M12 3a9 9 0 1 0 .01 0z'
};
const KACHEL_STATUS={gut:['✓','gut','good'],achtung:['!','Achtung','warn'],kritisch:['✕','kritisch','bad'],info:['i','Info','blue']};
function kachel(o){const{titel,icon,groesse='',wert,sub,status,trend,inhalt='',link}=o,m=KACHEL_STATUS[status];
  const ic=KACHEL_ICON[icon]?`<svg class="k-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${KACHEL_ICON[icon]}"></path></svg>`:'';
  return`<section class="kachel${groesse?' k-'+groesse:''}" aria-label="${esc(titel)}"><div class="k-kopf">${ic}<h2>${esc(titel)}</h2>${m?`<span class="k-marke ${m[2]}"><b aria-hidden="true">${m[0]}</b>${m[1]}</span>`:''}</div>`
    +(wert!=null?`<div class="k-wert">${esc(String(wert))}</div>`:'')+(sub?`<div class="k-sub">${esc(sub)}</div>`:'')
    +(trend?`<div class="k-trend ${trend.art}"><span aria-hidden="true">${trend.hoch?'▲':'▼'}</span> ${esc(trend.text)}</div>`:'')
    +inhalt+(link?`<button class="k-link" onclick="${link.onclick}">${esc(link.text)} ›</button>`:'')+`</section>`;}
// Statusmarke aus Zonen eines Reglers (good, warn, bad), damit Kacheln und Regler dieselben Grenzen nutzen
const ZONEN_STATUS={good:'gut',warn:'achtung',bad:'kritisch'};
const zonenTreffer=(w,z)=>(z||[]).find(q=>w>=q.von&&w<=q.bis);
const zonenStatus=(w,z)=>{const q=zonenTreffer(w,z);return q?ZONEN_STATUS[q.art]:undefined;};
const zonenText=(w,z)=>{const q=zonenTreffer(w,z);return q&&q.text?q.text:'';};
