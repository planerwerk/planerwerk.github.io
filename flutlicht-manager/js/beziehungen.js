// Beziehungsnetz (Konzept K17, U12c): Verein–Verein und du–Verein, Werte −100 bis +100, Gründe im Verlauf, Vergessen jeden Monat, Derbys und Rivalitäten als Grundwert.
// Zahlen in daten/regeln.js unter REGELN.beziehungen (Kurzform RBZ), Derbys in daten/vereine.js (DERBYS). ACHTUNG: U12c entstand ohne Testlauf (tests/beziehungen.js nie gelaufen).
// Im Spielstand: S.bez = {Schlüssel: {v Wert, g: [[Tag, Änderung, Grund], ...]}}. Schlüssel 'v:a:b' (Vereine a < b) oder 'd:id' (du und Verein id).
// Gespeichert wird nur, was vom Grundwert abweicht (fehlt ein Eintrag, gilt der Grundwert). Berater haben ihre eigene Beziehung (K22, js/berater.js).

// ---------- Grundwerte: Derbys und Rivalitäten (Vereinsnummer = Platz in VEREINE) ----------
let DERBY_MAP=null;
const bezPaar=(a,b)=>a<b?a+':'+b:b+':'+a;
function derbyMap(){if(DERBY_MAP)return DERBY_MAP;const m=new Map(),nr=k=>VEREINE.findIndex(v=>v.kurz===k);
  (typeof DERBYS!=='undefined'?DERBYS:[]).forEach(([a,b,name,art])=>{const x=nr(a),y=nr(b);if(x>=0&&y>=0&&x!==y)m.set(bezPaar(x,y),{g:RBZ.grund[art]||0,name,art});});
  return DERBY_MAP=m;}
const bezGrund=(a,b)=>{const d=derbyMap().get(bezPaar(a,b));return d?d.g:0;};
const istDerby=(a,b)=>{const d=derbyMap().get(bezPaar(a,b));return!!d&&d.art==='derby';};
// Brisantes Spiel (K17 §5.2, K09 §5.1, K09d): Derby oder Beziehung der beiden Vereine (nur Verein–Verein, gleich für alle) unter RBZ.wirkung.brisanzUnter. Mehr Karten in der Engine.
const spielBrisant=(a,b)=>istDerby(a,b)||bez(a,b)<RBZ.wirkung.brisanzUnter;
const derbyName=(a,b)=>{const d=derbyMap().get(bezPaar(a,b));return d?d.name:'';};
const bezVerein=id=>id>=0&&!!S.teams[id];

// ---------- Werte ----------
function bez(a,b){if(a===b||!bezVerein(a)||!bezVerein(b))return 0;const e=(S.bez||{})['v:'+bezPaar(a,b)];return e?e.v:bezGrund(a,b);}
function bezDu(id){const e=(S.bez||{})['d:'+id];return e?e.v:0;}
// Was für deine Geschäfte mit Verein id zählt: deine Beziehung plus die deines Vereins, begrenzt (K17 §12 Nr. 4)
const bezWirk=id=>bezVerein(id)&&id!==S.my?clamp(bezDu(id)+bez(S.my,id),-100,100):0;

// ---------- Änderungen mit Grund ----------
function bezBuchen(k,grund0,d,text){if(!d)return;S.bez=S.bez||{};const e=S.bez[k]||(S.bez[k]={v:grund0,g:[]});
  e.v=clamp(e.v+d,-100,100);e.g.unshift([S.tag,d,text]);if(e.g.length>RBZ.verlauf)e.g.length=RBZ.verlauf;}
function bezAendern(a,b,d,text){if(a===b||!bezVerein(a)||!bezVerein(b))return;bezBuchen('v:'+bezPaar(a,b),bezGrund(a,b),d,text);}
function bezDuAendern(id,d,text){if(!bezVerein(id)||id===S.my)return;bezBuchen('d:'+id,0,d,text);}

// ---------- Vergessen (am ersten Montag jedes Monats, aus woechentlichLauf) ----------
// Jeder Eintrag geht um vergessen zurück zum Grundwert. Ist er näher als loeschenUnter, fällt er weg.
function bezVergessen(){const B=S.bez;if(!B)return;
  for(const k of Object.keys(B)){const e=B[k],t=k.split(':'),g0=t[0]==='d'?0:bezGrund(+t[1],+t[2]);e.v+=(g0-e.v)*RBZ.vergessen;if(Math.abs(e.v-g0)<RBZ.loeschenUnter)delete B[k];}}

// ---------- Anlässe ----------
// Ein Derby mit Sieger macht die Rivalität größer (jede Liga, alle Vereine). r: Ergebnis {h, a, hg, ag}
function bezDerbySpiel(r){if(r.hg!==r.ag&&istDerby(r.h,r.a))bezAendern(r.h,r.a,RBZ.anlass.derbySieg,`${derbyName(r.h,r.a)} ${r.hg}:${r.ag}`);}
// Dein Kauf: fair, wenn die Ablöse mindestens fairKauf × Forderung ist
function bezKaufFair(p,von,fee){if(fee>=RBZ.fairKauf*forderungDu(p))bezDuAendern(von,RBZ.anlass.fair,`fairer Transfer: ${p.n}`);}

// ---------- Wirkungen ----------
// Ablöse bei deinen Käufen (K17 §5.2): × (1 + abloese × Beziehung), also −15 % bis +15 %
const bezAbloese=id=>1+RBZ.wirkung.abloese*bezWirk(id);
// Gesprächsbereitschaft: unter gespraechUnter lehnt ein Verein mit gespraechAblehnen ab (Würfel im Grundstrom: deine Handlung)
const bezLehntAb=id=>bezWirk(id)<RBZ.wirkung.gespraechUnter&&R()<RBZ.wirkung.gespraechAblehnen;

// ---------- Anzeige (Information, frei) ----------
const bezZahl=v=>{const r=Math.round(v);return(r>0?'+':r<0?'−':'')+Math.abs(r);};
function bezGrundText(id){const e=(S.bez||{})['d:'+id],f=(S.bez||{})['v:'+bezPaar(S.my,id)],l=[...(e?e.g:[]),...(f?f.g:[])].sort((x,y)=>y[0]-x[0]);
  if(l.length)return`${bezZahl(l[0][1])}: ${l[0][2]}`;const d=derbyMap().get(bezPaar(S.my,id));return d?`${d.name} (${bezZahl(d.g)})`:'';}
// Karte auf der Spielerkarte eines Spielers von Verein id
function bezKarte(id){if(!bezVerein(id)||id===S.my)return'';const v=bezWirk(id),g=bezGrundText(id);
  return`<div class="card"><h3>Beziehung zu ${esc(S.teams[id].name)}</h3><p>${bezZahl(v)}${g?` · zuletzt ${esc(g)}`:''}</p><p class="dim">Wirkt auf die Ablöse (${bezZahl(RBZ.wirkung.abloese*v*100)} %) und auf Testspiele${v<RBZ.wirkung.gespraechUnter?', und er redet oft gar nicht mit dir':''}.</p></div>`;}
// Büro: die besten und die schlechtesten Beziehungen deines Vereins und von dir
function beziehungenKarte(){const ids=new Set();Object.keys(S.bez||{}).forEach(k=>{const t=k.split(':');if(t[0]==='d')ids.add(+t[1]);else if(+t[1]===S.my)ids.add(+t[2]);else if(+t[2]===S.my)ids.add(+t[1]);});
  derbyMap().forEach((d,k)=>{const[a,b]=k.split(':').map(Number);if(a===S.my)ids.add(b);if(b===S.my)ids.add(a);});
  const l=[...ids].filter(id=>bezVerein(id)&&id!==S.my&&aktiv(S.teams[id])).map(id=>({id,v:bezWirk(id)})).filter(x=>Math.round(x.v)!==0).sort((a,b)=>b.v-a.v);if(!l.length)return'';
  const n=RBZ.anzeige,zeige=[...l.slice(0,n),...l.slice(Math.max(n,l.length-n))],zeile=x=>`<li>${esc(S.teams[x.id].name)}: ${bezZahl(x.v)}${bezGrundText(x.id)?` <span class="dim">(${esc(bezGrundText(x.id))})</span>`:''}</li>`;
  return`<div class="card"><h2>Beziehungen</h2><ul>${zeige.map(zeile).join('')}</ul><p class="dim">Gute Beziehungen senken Ablösen und helfen bei Testspielen, schlechte machen es teurer.</p></div>`;}
