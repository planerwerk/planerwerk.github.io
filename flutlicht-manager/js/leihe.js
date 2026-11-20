// Leihe, Profis in der Zweiten, Medizincheck (Konzept K08 §5.5, §12 Nr. 29, K19 §4.3, §5.5, U10d). Zahlen in REGELN.leihe (Kurzform RLE).
// Eine Leihe läuft bis zum Saisonende. Am Spieler p.leihe = {von, anteil (was der Leihverein vom Gehalt zahlt), rolle, rueckruf, option, start}.
// Seit U11d1 leihen auch Computer-Vereine untereinander (js/computer.js, kiLeihe). Für alle gilt das Leihkontingent (leihZaehler, leihErlaubt).
// Der Spieler steht im Kader des Leihvereins (p.team) und spielt dort, sein Vertrag (p.ct, p.sal) bleibt beim abgebenden Verein.

// ---------- Leihkontingent (FIFA seit 1.7.2024, DFL im Inland, K31 §5.9, U11d1) ----------
// Gezählt werden die laufenden Leihen von Spielern über freiBis Jahren: je Verein verliehen (aus) und ausgeliehen (ein), dazu je Paar „von>zu“. Gilt für alle Vereine, auch für dich.
function leihZaehler(){const z={aus:new Map(),ein:new Map(),paar:new Map()};S.pl.forEach(p=>{if(p.leihe)leihZaehlen(z,p,p.leihe.von,p.team);});return z;}
// Eine Leihe von Verein von an Verein zu im Zähler nachtragen (Spieler bis freiBis zählen nicht)
function leihZaehlen(z,p,von,zu){if(p.age<=RLE.kontingent.freiBis)return;[[z.aus,von],[z.ein,zu],[z.paar,von+'>'+zu]].forEach(([m,k])=>m.set(k,(m.get(k)||0)+1));}
// Ist im Kontingent noch Platz für diese Leihe? z: Zähler (sonst frisch gezählt)
function leihErlaubt(p,von,zu,z){const K=RLE.kontingent;if(p.age<=K.freiBis)return true;const c=z||leihZaehler();
  return(c.aus.get(von)||0)<K.max&&(c.ein.get(zu)||0)<K.max&&(c.paar.get(von+'>'+zu)||0)<K.paar;}
const leihKontingentText=()=>{const K=RLE.kontingent;return`Das Leihkontingent ist voll: Spieler über ${K.freiBis} Jahren höchstens ${K.max} verliehen und ${K.max} ausgeliehen je Verein, höchstens ${K.paar} an denselben Verein.`;};

// ---------- Leihe abgeben ----------
const istLeihe=p=>!!(p&&p.leihe);
// Wie viel Gehalt ein Verein übernehmen würde: Er zahlt alles für einen, der ihn besser macht, die Hälfte für einen gleich guten, sonst nichts
function zahlBereit(p,tid){const Z=RLE.zahlBereit,lvl=teamLevel(tid);return p.str>lvl+Z.spanne?Z.besser:p.str>=lvl-Z.spanne?Z.gleich:Z.schlechter;}
// Vereine, die ihn nehmen würden: Bedarf auf seiner Position, aktiv, nicht du, Platz im Leihkontingent (U11d1)
function leihVereine(p){const z=leihZaehler();return S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&hatBedarf(t,p)&&leihErlaubt(p,S.my,t.id,z)).sort((a,b)=>b.rep-a.rep);}
// Verleihen (nur im Fenster). o = {tid, anteil, rolle, rueckruf, option}. Rückgabe Text (Fehler) oder null
function verleihen(p,o){if(!p||p.team!==S.my||p.wech||istLeihe(p))return'Er kann nicht verliehen werden.';if(!fensterOffen())return'Leihen geht nur im Transferfenster.';
  const t=S.teams[o.tid];if(t&&!leihErlaubt(p,S.my,t.id))return leihKontingentText();
  if(!t||!leihVereine(p).includes(t))return`${t?t.name:'Der Verein'} hat keinen Bedarf.`;if(o.anteil>zahlBereit(p,t.id))return`${t.name} übernimmt höchstens ${Math.round(zahlBereit(p,t.id)*100)} % seines Gehalts.`;
  kabineAbgang(p,S.my);S.offers=S.offers.filter(x=>x.pid!==p.id);p.leihe={von:S.my,anteil:o.anteil,rolle:o.rolle==='stamm'?'stamm':'rotation',rueckruf:!!o.rueckruf,option:o.option>0?o.option:0,start:absTag(S.tag)};
  p.team=t.id;p.list=0;neuzugang(p,t.id);news(`Leihe: ${p.n} spielt bis zum Saisonende bei ${t.name} (${t.name} zahlt ${Math.round(o.anteil*100)} % seines Gehalts${o.option?`, Kaufoption ${fmt(o.option)}`:''}).`,'tr');return null;}
// Zurückholen: im Winterfenster, wenn ein Rückruf vereinbart ist
function zurueckholen(p){if(!istLeihe(p)||p.leihe.von!==S.my)return'Er ist nicht von dir verliehen.';if(!p.leihe.rueckruf)return'Ein Rückruf ist nicht vereinbart.';if(!fensterOffen())return'Zurückholen geht nur im Transferfenster.';
  const von=p.team;kabineAbgang(p,von);delete p.leihe;p.team=S.my;kabineInit(p);rollenBerechnen(S.my);news(`${p.n} kommt vorzeitig von ${tn(von)} zurück.`);return null;}

// ---------- Leihe holen ----------
// Ein Verein gibt nur Spieler ab, die bei ihm nicht Stamm- oder Schlüsselspieler sind. Der Spieler will Einsatzzeit: bei dir mindestens Rotation.
function ausleihen(p){if(!p||p.team<0||p.team===S.my||istAusland(p)||p.wech||istLeihe(p))return'Diesen Spieler kannst du nicht ausleihen.';if(!fensterOffen())return'Leihen geht nur im Transferfenster.';
  if(!RLE.holenRollen.includes(kaderRolle(p)))return`${tn(p.team)} gibt ${p.n} nicht ab, er ist dort gesetzt.`;
  if(einsatzSchaetzung(p,S.my)<RVT.einsatz.rotation)return`${p.n} will Spielzeit. Bei dir sähe er die Bank.`;if(squad(S.my).length>=RM.kaderMax)return`Dein Kader ist voll (höchstens ${RM.kaderMax} Spieler).`;
  if(!leihErlaubt(p,p.team,S.my))return leihKontingentText(); // U11d1
  const von=p.team;kabineAbgang(p,von);p.leihe={von,anteil:1,rolle:'rotation',rueckruf:false,option:0,start:absTag(S.tag)};p.team=S.my;p.list=0;neuzugang(p,S.my);kabineInit(p);rollenBerechnen(S.my);
  news(`Leihe: ${p.n} kommt bis zum Saisonende von ${tn(von)}. Du zahlst sein Gehalt.`,'good');return null;}

// ---------- Gehalt, Woche, Saisonende ----------
// Dein Gehaltsanteil für verliehene (was der Leihverein nicht zahlt) und geliehene Spieler (alles), dazu Profis in der Zweiten
function leiheGehaelter(){let s=0;S.pl.forEach(p=>{if(!p.leihe)return;if(p.leihe.von===S.my&&p.team!==S.my)s+=p.sal*(1-p.leihe.anteil);});
  (S.zw||[]).forEach(p=>{if(p.zwP&&S.zwV===S.my)s+=p.sal;});const sim=hatZweite()?zweiteSim():null;if(sim)squad(sim.id).forEach(p=>{if(p.zwP)s+=p.sal;});return s;}
// Woche: Einsatzgarantie verliehener Spieler prüfen (ab der achten Woche, eine Meldung je Leihe)
function leiheWoche(d){const L=RLE;S.pl.forEach(p=>{if(!p.leihe||p.leihe.von!==S.my||p.team===S.my||p.leihe.gemeldet)return;if(absTag(d)-p.leihe.start<L.pruefAbWochen*7)return;
  const soll=L.garantie[p.leihe.rolle]||0;if((p.ea||0)<soll){p.leihe.gemeldet=1;news(`Leihe: ${tn(p.team)} hält die Absprache nicht. ${p.n} kommt auf ${Math.round((p.ea||0)*100)} % der Minuten, vereinbart waren ${Math.round(soll*100)} %.${p.leihe.rueckruf?' Im Winterfenster kannst du ihn zurückholen.':''}`,'bad');}});}
// Saisonende (newSeason, vor den Verträgen): Rückkehr oder Kaufoption
function leiheEnde(){S.pl.forEach(p=>{if(!p.leihe)return;const l=p.leihe,bei=S.teams[p.team],heim=S.teams[l.von];
    if(l.von===S.my&&bei&&bei.id!==S.my)bezDuAendern(bei.id,l.gemeldet?RBZ.anlass.leiheSchlecht:RBZ.anlass.leiheGut,`Leihe von ${p.n}: Absprache ${l.gemeldet?'nicht ':''}gehalten`); // K17, U12c
    if(l.option&&bei&&aktiv(bei)&&bei.id!==l.von&&bei.cash>=l.option&&l.option<=vwKauf(p,bei.id)){if(l.von===S.my){money('Transfers',l.option);vertragEnde(p);}else if(heim)heim.cash+=l.option;bei.cash-=l.option;
      delete p.leihe;p.ct=riA(RM.neuerVertrag)+1;p.seit=absTag(S.tag);p.abl=l.option;if(l.von===S.my)news(`Kaufoption gezogen: ${p.n} bleibt für ${fmt(l.option)} bei ${bei.name}.`,'good');return;}
    const von=p.team;kabineAbgang(p,von);delete p.leihe;p.team=l.von;if(heim)neuzugang(p,l.von);if(l.von===S.my){kabineInit(p);news(`Leihe beendet: ${p.n} ist von ${tn(von)} zurück.`);}});}

// ---------- Profis in die Zweite (K08 §12 Nr. 29) ----------
// Bis 23 Jahre: Er behält Vertrag und Gehalt, spielt in der Zweiten und sammelt Spielpraxis. Zurück mit „Aufrücken“ (Vertrag bleibt) oder automatisch mit 24.
function inDieZweite(p){if(!p||p.team!==S.my||p.wech||istLeihe(p))return'Er kann nicht in die Zweite.';if(!hatZweite())return'Dein Verein hat keine zweite Mannschaft.';if(p.age>RLE.zweiteBis)return`Nur Spieler bis ${RLE.zweiteBis} Jahre.`;
  const sim=zweiteSim();kabineAbgang(p,S.my);S.offers=S.offers.filter(x=>x.pid!==p.id);(S.vs||[]).forEach(v=>{if(v.pid===p.id&&v.stand==='offen')v.stand='hinfaellig';});p.list=0;p.zwP=1;delete p.ls;delete p.um;
  if(sim){p.team=sim.id;neuzugang(p,sim.id);}else{const l=zweiteKader();if(l.length>=RZ.kader.max)return`Die Zweite ist voll (höchstens ${RZ.kader.max} Spieler).`;S.pl=S.pl.filter(x=>x!==p);p.team=ZWEITE_TEAM;l.push(p);}
  PIX.set(p.id,p);rollenBerechnen(S.my);news(`${p.n} spielt vorerst in der Zweiten. Er behält Vertrag und Gehalt.`);return null;}

// ---------- Medizincheck (K19 §5.5) ----------
// Befund: verletzt, mehr als 60 Ausfalltage in den letzten zwölf Monaten oder „verletzungsanfällig“. Folge: Ablöse 10 bis 30 % niedriger (je Spieler fest).
function medizinBefund(p){const M=RLE.medizin,heute=absTag(S.tag),tage=(p.vh||[]).filter(x=>heute-x.ab<=M.tage).reduce((a,x)=>a+(x.t||0),0);
  if(p.inj>0)return'er ist verletzt';if(tage>M.abTagen)return`${tage} Ausfalltage in den letzten zwölf Monaten`;if(hatEig(p,'verletzungsanfaellig'))return'er ist verletzungsanfällig';return null;}
const medizinAbschlag=p=>{const A=RLE.medizin.abschlag;return Math.round((A[0]+vtFrac((p.seed||0.5)*13)*(A[1]-A[0]))*100)/100;};

// ---------- Anzeige ----------
function leiheKarte(p){if(p.leihe&&p.leihe.von!==S.my&&p.team!==S.my)return`<div class="card"><h3>Leihe</h3><p>${esc(tn(p.team))} hat ihn bis zum Saisonende von ${esc(tn(p.leihe.von))} ausgeliehen.</p></div>`; // unter Computer-Vereinen (U11d1)
  if(p.leihe){const l=p.leihe;return`<div class="card"><h3>Leihe</h3><p>${l.von===S.my?`Verliehen an ${esc(tn(p.team))}`:`Ausgeliehen von ${esc(tn(l.von))}`} bis zum Saisonende. ${l.von===S.my?`${esc(tn(p.team))} zahlt ${Math.round(l.anteil*100)} % seines Gehalts, vereinbart: ${l.rolle==='stamm'?'Stammspieler':'Rotation'}${l.option?`, Kaufoption ${fmt(l.option)}`:''}.`:'Du zahlst sein Gehalt.'}</p>
    ${l.von===S.my&&l.rueckruf?`<button onclick="leiheZurueck(${p.id})"${lzAus('leihe')}>Im Winterfenster zurückholen</button>${lzHinweis('leihe')}`:''}</div>`;}
  if(p.team===S.my&&!p.wech){const V=leihVereine(p).slice(0,12);return`<div class="card"><h3>Verleihen</h3>${V.length?`<div class="form"><label>Verein <select id="le_tid">${V.map(t=>`<option value="${t.id}">${esc(t.name)} (zahlt bis ${Math.round(zahlBereit(p,t.id)*100)} %)</option>`).join('')}</select></label>
    <label>Gehaltsanteil des Leihvereins <select id="le_anteil">${RLE.anteile.map(a=>`<option value="${a}">${Math.round(a*100)} %</option>`).join('')}</select></label>
    <label>Einsatz <select id="le_rolle"><option value="stamm">als Stammspieler (60 % der Minuten)</option><option value="rotation" selected>Rotation (30 %)</option></select></label>
    <label style="grid-auto-flow:column;align-items:center;gap:6px"><input id="le_rueck" type="checkbox"> Rückruf im Winter</label><label>Kaufoption (Mio €, leer = keine) <input id="le_option" type="number" step="0.1" min="0" value=""></label>
    <button onclick="verleihenUI(${p.id})"${lzAus('leihe')}>Verleihen</button></div>`:'<p class="dim">Kein Verein hat gerade Bedarf auf seiner Position.</p>'}${lzHinweis('leihe')}
    ${hatZweite()&&p.age<=RLE.zweiteBis?`<hr><p>In der Zweiten bekommt er Spielpraxis und behält Vertrag und Gehalt.</p><button onclick="inZweiteUI(${p.id})"${lzAus('zweitekader')}>In die Zweite</button>`:''}<p class="dim">Leihen laufen bis zum Saisonende, nur im Transferfenster.</p></div>`;}
  if(p.team>=0&&!istAusland(p)&&!p.wech&&RLE.holenRollen.includes(kaderRolle(p)))return`<div class="card"><h3>Ausleihen</h3><p>${esc(tn(p.team))} würde ihn bis zum Saisonende abgeben, du zahlst sein Gehalt (${fmt(p.sal)} pro Jahr).</p><button onclick="ausleihenUI(${p.id})"${lzAus('leihe')}>Ausleihen</button>${lzHinweis('leihe')}</div>`;
  return'';}
