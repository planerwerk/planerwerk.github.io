// Werbeflächen (K24 §3.1, Teilschritt K24a, 21.11.2026): Neben der Trikotbrust (S.spons, js/welt.js) gibt es Ausrüster und Ärmel mit eigenen Angeboten.
// Jede Fläche hat höchstens einen Vertrag. Angebote in derselben Form wie bei der Brust (festes Geld, Fixum mit Siegprämie, drei Jahre).
// Vorläufig geldneutral: Brust, Ausrüster und Ärmel teilen sich den bisherigen Brustbetrag nach RF.werbung.anteil (Abstimmung auf K24 §5.1 erst mit K23).
// Im Spielstand: S.werbung = {ausruester:{name, base, win, yrs, info}, aermel:{…}} laufende Verträge, S.werbOffers = {Fläche: [Angebote]} solange eine Fläche frei ist.
// Lizenz: Bereich sponsor (ab der A-Lizenz, Automatik nimmt je Fläche das höchste feste Angebot). Ohne Wahl nimmt der Vorstand vor dem ersten Pflichtspiel das erste Angebot.
// Seit K24b (21.11.): je Fläche ein viertes Angebot eines umstrittenen Geldgebers (im: 'umstritten', Fans, Skandal, Kündigung nach Skandal), Sponsorentag (S.sponsorTag = Saison),
// Werbewert aus K25 als Faktor auf neue Angebote. Ohne deine Wahl bleibt alles geldneutral: Der Vorstand nimmt das erste Angebot, die Automatik meidet umstrittene Geldgeber.

const werbFlaechen=()=>Object.keys(RF.werbung.anteil).filter(f=>f!=='brust');
const werbTitel=f=>RF.werbung.titel[f]||f;
const werbFlaechenAlle=()=>['brust',...werbFlaechen()];
const werbVertrag=f=>f==='brust'?S.spons:(S.werbung||{})[f];
const istUmstritten=o=>!!o&&o.im==='umstritten';
// Faktor aus dem Werbewert (K25, S.mk.ww): über dem Startwert (Ansehen × startJeAnsehen) mehr, darunter weniger, höchstens ±max. Ohne Marketing-Stand neutral.
function werbFaktor(t=myT()){const W=RF.werbung.werbewert,M=S.mk;if(!W||!M||M.ww==null||typeof RMK==='undefined')return 1;return 1+clamp((M.ww-t.rep*RMK.werbewert.startJeAnsehen)*W.jePunkt,-W.max,W.max);}
// Das vierte Angebot einer Fläche: umstrittener Geldgeber über dem besten festen Angebot. Der Name kommt ohne Zufall aus Saison und Fläche (kein Strom wird berührt).
function werbUmstritten(f,b){const U=RF.werbung.umstritten,best=Math.max(...RF.sponsor.angebote.map(a=>a.fix)),k=werbFlaechenAlle().indexOf(f);
  return{name:U.namen[(S.season+2*k+(S.my||0))%U.namen.length],base:Math.round(b*best*U.faktor/1000)*1000,win:0,yrs:U.jahre,info:U.info,im:'umstritten'};}
// Grundbetrag je Spieltag für eine Fläche: wie bei der Brust Ansehen² × Ligawert, davon der Anteil der Fläche
const werbBasis=(f,t=myT())=>t.rep*t.rep*(RF.sponsor['liga'+t.lg]||RF.sponsor.liga3)*RF.werbung.anteil[f];
// Angebote für eine freie Fläche, eigener Zufallsstrom (die Namen sind das einzige Zufällige)
function werbAngebote(f){const b=werbBasis(f)*werbFaktor(),r=v=>Math.round(v/1000)*1000;
  return mitStrom(strom('werbung',S.season,f),()=>{const ns=shuffle(RF.werbung.namen[f].slice());return [...RF.sponsor.angebote.map((a,i)=>({name:ns[i%ns.length],base:r(b*a.fix),win:a.sieg?r(b*a.sieg):0,yrs:a.jahre,info:a.info})),werbUmstritten(f,b)];});}
// Für jede freie Fläche Angebote bereitstellen (aufgerufen aus sponsOffers, also beim Start, nach einem Jobwechsel und wenn ein Vertrag ausläuft)
function werbungOffen(){S.werbung=S.werbung||{};S.werbOffers=S.werbOffers||{};werbFlaechen().forEach(f=>{if(!S.werbung[f]&&!S.werbOffers[f]){S.werbOffers[f]=werbAngebote(f);werbVerlaengerung(f,S.werbOffers[f]);}});werbungAuto();}
// Verlängerungsangebot (K24c): Ein zufriedener Partner (ab verlaengernAb), dessen Vertrag gerade ausgelaufen ist, steht mit 10 % mehr in der Liste (aus S.werbAlt, siehe werbungSaison)
function werbVerlaengerung(f,l){const a=(S.werbAlt||{})[f];if(!a||!l)return;const Z=RF.werbung.zufriedenheit,r=v=>Math.round(v*(1+Z.plus)/1000)*1000;
  l.push({name:a.name,base:r(a.base),win:a.win?r(a.win):0,yrs:Z.jahre,info:`Verlängerung: ${a.name} ist zufrieden und bietet 10 % mehr, ${Z.jahre} Jahre`,ver:1,im:a.im});delete S.werbAlt[f];}
function werbungAusstehend(){return !!S.werbOffers&&Object.keys(S.werbOffers).length>0;}
function werbungWaehlen(f,i){const l=(S.werbOffers||{})[f];if(!l||!l[i])return;S.werbung=S.werbung||{};S.werbung[f]={...l[i]};delete S.werbOffers[f];
  news(`Werbevertrag (${werbTitel(f)}) unterschrieben: ${S.werbung[f].name}.`,'good');werbUnterschrieben(f);}
// Nach jeder Unterschrift (auch der Brust, welt.js): Ein umstrittener Geldgeber kostet Fanstimmung (K27 Baustein Entscheidungen)
function werbUnterschrieben(f){const c=werbVertrag(f);if(!istUmstritten(c))return;fanAnlass(myT(),'fanD',RF.werbung.umstritten.fans);news(`Die Fans murren über den neuen Geldgeber ${c.name} (${werbTitel(f)}).`,'bad');}
// Aktion des Spielers
function pickWerbung(f,i){if(!darf('sponsor','sponsorOderPreis'))return;werbungWaehlen(f,i);save();render();}
// Automatik (K36): je Fläche das Angebot mit dem höchsten festen Betrag, wie bei der Brust (sponsorAuto)
function werbungAuto(){if(!autoB('sponsor'))return;Object.keys(S.werbOffers||{}).forEach(f=>{const l=S.werbOffers[f];let k=l.findIndex(o=>!istUmstritten(o));l.forEach((o,j)=>{if(!istUmstritten(o)&&o.base>l[k].base)k=j;});werbungWaehlen(f,k);});} // umstrittene meidet der Verein (K24 §7)
// Vor dem ersten Pflichtspiel: Was noch frei ist, bekommt das erste Angebot (wie die Brust, ablauf.js)
function werbungVorSpiel(){Object.keys(S.werbOffers||{}).forEach(f=>werbungWaehlen(f,0));}
// Saisonwechsel: Laufzeiten zählen herunter, ausgelaufene Flächen bekommen neue Angebote
// Seit K24c zählt hier auch die Brust herunter (vorher saison.js). Ausgelaufene Verträge zufriedener Partner merkt sich S.werbAlt für das Verlängerungsangebot.
function werbungSaison(){werbSkandale();const Z=RF.werbung.zufriedenheit;S.werbAlt={};
  werbFlaechenAlle().forEach(f=>{const c=werbVertrag(f);if(!c)return;c.yrs--;if(c.yrs>0)return;if(!c.skandal&&(c.z!=null?c.z:Z.start)>=Z.verlaengernAb)S.werbAlt[f]=c;if(f==='brust')S.spons=null;else delete S.werbung[f];});
  werbungOffen();}
// Saisonende (K24c, saison.js): Zufriedenheit aller laufenden Verträge, Abstiegsklausel
function werbungSaisonende(sm){const Z=RF.werbung.zufriedenheit,t=myT(),me=S.my;
  const ab=sm.down.includes(me)||sm.down2.includes(me)||(sm.down3||[]).includes(me)||(!!sm.rel&&sm.rel[0]===me&&sm.rw!==me)||(!!sm.rel2&&sm.rel2[0]===me&&sm.rw2!==me);
  const ww=S.mk&&S.mk.ww!=null&&typeof RMK!=='undefined'?S.mk.ww-t.rep*RMK.werbewert.startJeAnsehen:0;
  const d=clamp(Z.jePlatz*(sm.target-sm.pos),-Z.erfolgMax,Z.erfolgMax)+clamp((fanst(t)-RFS.start)*Z.fans,-Z.fansMax,Z.fansMax)+clamp(ww*Z.werbewert,-Z.werbewertMax,Z.werbewertMax)+(ab?Z.abstieg:0);
  werbFlaechenAlle().forEach(f=>{const c=werbVertrag(f);if(!c)return;c.z=clamp(Math.round((c.z!=null?c.z:Z.start)+d),0,100);
    if(ab&&c.yrs>1){const r=v=>Math.round(v*(1-Z.klausel)/1000)*1000;c.base=r(c.base);if(c.win)c.win=r(c.win);news(`Abstiegsklausel: ${c.name} (${werbTitel(f)}) zahlt ab der neuen Saison ${Math.round(Z.klausel*100)} % weniger.`,'bad');}});}
// Skandal (K24 §5.4, K24b): zum Saisonwechsel je umstrittenem Vertrag mit 5 %, eigener Strom. Fans −10, danach darfst du kostenlos kündigen.
function werbSkandale(){const U=RF.werbung.umstritten;werbFlaechenAlle().forEach(f=>{const c=werbVertrag(f);if(!istUmstritten(c)||c.skandal)return;
  if(!mitStrom(strom('werbSkandal',S.season,f),()=>R()<U.skandal))return;c.skandal=1;fanAnlass(myT(),'fanD',U.skandalFans);
  news(`Skandal um ${c.name}: Die Presse berichtet über dubiose Geschäfte deines Geldgebers (${werbTitel(f)}). Du darfst den Vertrag ohne Kosten kündigen (Finanzen).`,'bad');});}
// Kündigung nach einem Skandal (Aktion): Die Fläche wird frei und bekommt neue Angebote
function werbungKuendigen(f){if(!darf('sponsor','sponsorOderPreis'))return;const c=werbVertrag(f);if(!c||!c.skandal)return;news(`Vertrag mit ${c.name} (${werbTitel(f)}) nach dem Skandal gekündigt.`);
  if(f==='brust'){S.spons=null;sponsOffers();}else{delete S.werbung[f];werbungOffen();}save();render();}
// Monatserster (ablauf.js): Laufende umstrittene Verträge kosten jeden Monat etwas Fanstimmung
function werbungTag(d){if(S.phase!=='play'||mmtt(d).slice(3)!=='01')return;const n=werbFlaechenAlle().filter(f=>istUmstritten(werbVertrag(f))).length;if(n)fanAnlass(myT(),'fanD',RF.werbung.umstritten.fansMonat*n);}
// Sponsorentag (K24 §4.3, Aktion): einmal je Saison, solange Angebote offen sind, kostet Geld, danach sind alle offenen Angebote besser
// Seit 22.11. in drei Größen (klein, mittel, groß): Kosten nach Liga, Zuschlag gewürfelt im eigenen Strom, als Rückmeldung nur ein Text nach der Lage des Wurfs in der Spanne.
const sponsorTagKosten=k=>{const T=RF.werbung.sponsorentag;return Math.round(T.stufen[k].kosten*(T.liga[myT().lg]||T.liga[3])/1000)*1000;};
function sponsorenTag(k='gross'){if(!darf('sponsor','sponsorOderPreis'))return;const T=RF.werbung.sponsorentag,St=T.stufen[k];if(!St)return;if(S.sponsorTag===S.season){toast('Der Sponsorentag war in dieser Saison schon.');return;}
  if(!S.sponsOffers&&!werbungAusstehend()){toast('Es sind keine Angebote offen.');return;}const kosten=sponsorTagKosten(k);money('Marketing',-kosten);
  const u=mitStrom(strom('sponsorentag',S.season),()=>R()),plus=St.plus[0]+u*(St.plus[1]-St.plus[0]),text=T.texte[Math.min(T.texte.length-1,Math.floor(u*T.texte.length))];
  const hoch=o=>{o.base=Math.round(o.base*(1+plus)/1000)*1000;if(o.win)o.win=Math.round(o.win*(1+plus)/1000)*1000;};(S.sponsOffers||[]).forEach(hoch);Object.values(S.werbOffers||{}).forEach(l=>l.forEach(hoch));
  S.sponsorTag=S.season;S.sponsorTagErg={s:S.season,k,stufe:Math.min(T.texte.length-1,Math.floor(u*T.texte.length))};news(`${text} (${St.adj} Sponsorentag, ${fmt(kosten)})`,'good');save();render();}
// Jobwechsel: Die Verträge gehören dem alten Verein
function werbungNeuerVerein(){S.werbung={};S.werbOffers={};S.werbAlt={};}
// Geld je eigenem Spiel (finanzenLiga): Fixum und Siegprämie wie bei der Brust
function werbungSpieltag(m){Object.values(S.werbung||{}).forEach(w=>{money('Sponsor',w.base);if(w.win&&winner(m)===S.my&&m.hg!==m.ag)money('Sponsor',w.win);});}
// Summe der festen Beträge aller Flächen je Spieltag (Anzeige)
const werbungSumme=()=>(S.spons?S.spons.base:0)+Object.values(S.werbung||{}).reduce((a,w)=>a+w.base,0);

// Büro: Angebote für freie Flächen (die Brust zeigt ansichten.js wie bisher)
function werbungAngebotsKarte(){if(!werbungAusstehend()&&!S.sponsOffers)return'';const T=RF.werbung.sponsorentag,tag=S.sponsorTag===S.season;
  return`<div class="card"><h3>Werbeflächen vergeben</h3><p class="dim">Neben der Trikotbrust: Ausrüster und Ärmel. Ohne Wahl nimmt der Vorstand vor dem ersten Pflichtspiel das erste Angebot. Umstrittene Geldgeber zahlen mehr, kosten aber Fanstimmung und können in einen Skandal geraten.</p><div class="row" style="margin:6px 0;flex-wrap:wrap;gap:6px">${Object.keys(T.stufen).map(k=>`<button onclick="sponsorenTag('${k}')"${tag?' disabled':''}${lzAus('sponsor')}>Sponsorentag ${esc(T.stufen[k].name)} (${fmt(sponsorTagKosten(k))})</button>`).join('')}<span class="dim">${tag?'In dieser Saison schon veranstaltet.':'Einmal je Saison: Du lädst Partner ins Stadion, danach werden die offenen Angebote besser. Je größer der Tag, desto mehr ist drin.'}</span></div>${Object.keys(S.werbOffers||{}).map(f=>`<h4 style="margin:10px 0 4px">${esc(werbTitel(f))}</h4><div class="opts">${S.werbOffers[f].map((o,i)=>`<button class="opt" onclick="pickWerbung('${f}',${i})"${lzAus('sponsor')}><b>${esc(o.name)}</b>${istUmstritten(o)?' <span class="tag warn">umstritten</span>':''}${o.ver?' <span class="tag good">Verlängerung</span>':''}<span>${fmt(o.base)} pro Spieltag${o.win?` + ${fmt(o.win)} pro Sieg`:''} · ${esc(o.info)}</span></button>`).join('')}</div>`).join('')}</div>`;}
// Finanzen: alle laufenden Werbeverträge
function werbungVertraege(){const z=(f,w)=>`<p><b>${esc(werbTitel(f))}:</b> ${w?`${esc(w.name)}${istUmstritten(w)?` <span class="tag warn">${w.skandal?'Skandal':'umstritten'}</span>`:''}, ${fmt(w.base)} pro Spieltag${w.win?` + ${fmt(w.win)} pro Sieg`:''}, Laufzeit noch ${w.yrs} Saison(s), Zufriedenheit ${w.z!=null?w.z:RF.werbung.zufriedenheit.start}${w.skandal?` <button onclick="werbungKuendigen('${f}')"${lzAus('sponsor')}>Kostenlos kündigen</button>`:''}`:'frei (Angebote im Büro)'}</p>`;
  return werbFlaechenAlle().map(f=>z(f,werbVertrag(f))).join('')+`<p class="dim">Zusammen fest: ${fmt(werbungSumme())} pro Spieltag.</p>`;}
