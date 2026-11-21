// Werbeflächen (K24 §3.1, Teilschritt K24a, 21.11.2026): Neben der Trikotbrust (S.spons, js/welt.js) gibt es Ausrüster und Ärmel mit eigenen Angeboten.
// Jede Fläche hat höchstens einen Vertrag. Angebote in derselben Form wie bei der Brust (festes Geld, Fixum mit Siegprämie, drei Jahre).
// Vorläufig geldneutral: Brust, Ausrüster und Ärmel teilen sich den bisherigen Brustbetrag nach RF.werbung.anteil (Abstimmung auf K24 §5.1 erst mit K23).
// Im Spielstand: S.werbung = {ausruester:{name, base, win, yrs, info}, aermel:{…}} laufende Verträge, S.werbOffers = {Fläche: [Angebote]} solange eine Fläche frei ist.
// Lizenz: Bereich sponsor (ab der A-Lizenz, Automatik nimmt je Fläche das höchste feste Angebot). Ohne Wahl nimmt der Vorstand vor dem ersten Pflichtspiel das erste Angebot.

const werbFlaechen=()=>Object.keys(RF.werbung.anteil).filter(f=>f!=='brust');
const werbTitel=f=>RF.werbung.titel[f]||f;
// Grundbetrag je Spieltag für eine Fläche: wie bei der Brust Ansehen² × Ligawert, davon der Anteil der Fläche
const werbBasis=(f,t=myT())=>t.rep*t.rep*(RF.sponsor['liga'+t.lg]||RF.sponsor.liga3)*RF.werbung.anteil[f];
// Angebote für eine freie Fläche, eigener Zufallsstrom (die Namen sind das einzige Zufällige)
function werbAngebote(f){const b=werbBasis(f),r=v=>Math.round(v/1000)*1000;
  return mitStrom(strom('werbung',S.season,f),()=>{const ns=shuffle(RF.werbung.namen[f].slice());return RF.sponsor.angebote.map((a,i)=>({name:ns[i%ns.length],base:r(b*a.fix),win:a.sieg?r(b*a.sieg):0,yrs:a.jahre,info:a.info}));});}
// Für jede freie Fläche Angebote bereitstellen (aufgerufen aus sponsOffers, also beim Start, nach einem Jobwechsel und wenn ein Vertrag ausläuft)
function werbungOffen(){S.werbung=S.werbung||{};S.werbOffers=S.werbOffers||{};werbFlaechen().forEach(f=>{if(!S.werbung[f]&&!S.werbOffers[f])S.werbOffers[f]=werbAngebote(f);});werbungAuto();}
function werbungAusstehend(){return !!S.werbOffers&&Object.keys(S.werbOffers).length>0;}
function werbungWaehlen(f,i){const l=(S.werbOffers||{})[f];if(!l||!l[i])return;S.werbung=S.werbung||{};S.werbung[f]={...l[i]};delete S.werbOffers[f];
  news(`Werbevertrag (${werbTitel(f)}) unterschrieben: ${S.werbung[f].name}.`,'good');}
// Aktion des Spielers
function pickWerbung(f,i){if(!darf('sponsor','sponsorOderPreis'))return;werbungWaehlen(f,i);save();render();}
// Automatik (K36): je Fläche das Angebot mit dem höchsten festen Betrag, wie bei der Brust (sponsorAuto)
function werbungAuto(){if(!autoB('sponsor'))return;Object.keys(S.werbOffers||{}).forEach(f=>{const l=S.werbOffers[f];let k=0;l.forEach((o,j)=>{if(o.base>l[k].base)k=j;});werbungWaehlen(f,k);});}
// Vor dem ersten Pflichtspiel: Was noch frei ist, bekommt das erste Angebot (wie die Brust, ablauf.js)
function werbungVorSpiel(){Object.keys(S.werbOffers||{}).forEach(f=>werbungWaehlen(f,0));}
// Saisonwechsel: Laufzeiten zählen herunter, ausgelaufene Flächen bekommen neue Angebote
function werbungSaison(){Object.keys(S.werbung||{}).forEach(f=>{const w=S.werbung[f];w.yrs--;if(w.yrs<=0)delete S.werbung[f];});werbungOffen();}
// Jobwechsel: Die Verträge gehören dem alten Verein
function werbungNeuerVerein(){S.werbung={};S.werbOffers={};}
// Geld je eigenem Spiel (finanzenLiga): Fixum und Siegprämie wie bei der Brust
function werbungSpieltag(m){Object.values(S.werbung||{}).forEach(w=>{money('Sponsor',w.base);if(w.win&&winner(m)===S.my&&m.hg!==m.ag)money('Sponsor',w.win);});}
// Summe der festen Beträge aller Flächen je Spieltag (Anzeige)
const werbungSumme=()=>(S.spons?S.spons.base:0)+Object.values(S.werbung||{}).reduce((a,w)=>a+w.base,0);

// Büro: Angebote für freie Flächen (die Brust zeigt ansichten.js wie bisher)
function werbungAngebotsKarte(){if(!werbungAusstehend())return'';
  return`<div class="card"><h3>Werbeflächen vergeben</h3><p class="dim">Neben der Trikotbrust: Ausrüster und Ärmel. Ohne Wahl nimmt der Vorstand vor dem ersten Pflichtspiel das erste Angebot.</p>${Object.keys(S.werbOffers).map(f=>`<h4 style="margin:10px 0 4px">${esc(werbTitel(f))}</h4><div class="opts">${S.werbOffers[f].map((o,i)=>`<button class="opt" onclick="pickWerbung('${f}',${i})"${lzAus('sponsor')}><b>${esc(o.name)}</b><span>${fmt(o.base)} pro Spieltag${o.win?` + ${fmt(o.win)} pro Sieg`:''} · ${esc(o.info)}</span></button>`).join('')}</div>`).join('')}</div>`;}
// Finanzen: alle laufenden Werbeverträge
function werbungVertraege(){const z=(titel,w)=>`<p><b>${esc(titel)}:</b> ${w?`${esc(w.name)}, ${fmt(w.base)} pro Spieltag${w.win?` + ${fmt(w.win)} pro Sieg`:''}, Laufzeit noch ${w.yrs} Saison(s)`:'frei (Angebote im Büro)'}</p>`;
  return z(werbTitel('brust'),S.spons)+werbFlaechen().map(f=>z(werbTitel(f),(S.werbung||{})[f])).join('')+`<p class="dim">Zusammen fest: ${fmt(werbungSumme())} pro Spieltag.</p>`;}
