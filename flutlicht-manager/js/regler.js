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
  return`<div class="rg"><div class="rg-lbl">${label}${sub?`<small>${sub}</small>`:''}</div><div class="rg-track" aria-label="${esc(label)}">${inner}</div><div class="rg-val rg-klein">${val}${einheit?`<small>${einheit}</small>`:''}</div><div class="rg-scale"><span>${f(min)}</span><span>${f(max)}</span></div></div>`;}
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
