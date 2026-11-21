// Ereigniskarten (Konzept K30 §5.5, U12d): Prüfen, Auswählen, Dosierung, Sperren, Entscheidungen mit Halt und Automatik, erlaubte Wirkungen.
// Katalog in daten/karten.js (KARTEN), Zahlen in daten/regeln.js unter REGELN.karten (Kurzform RKT). Zufall im Strom „ereignisse“.
// ACHTUNG: U12d entstand ohne Testlauf (tests/karten.js ist noch nie gelaufen).
// Spielstand S.karten = {sp: {Karte:Spieler:Verein → Tag}, w: Zähler der Woche und des Monats, offen: [{id, tag, s, b, text}], v: {Karte → Variante}, log: [...], einmal: {Karte → 1}}

function karten(){if(!S.karten)S.karten={sp:{},w:{},offen:[],v:{},log:[],einmal:{}};return S.karten;}
const karteVon=id=>KARTEN.find(c=>c.id===id);

// ---------- Auslöser (K30 §3.1): geben die Beteiligten zurück ({spieler, verein}) oder null ----------
const AUSLOESER={
  // Präsident mit Ehrgeiz, die letzten drei Ligaspiele verloren: Er will einen teuren Spieler sehen, der nicht in der Elf steht
  praesidentSerie(){const t=myT();if(praesident(t).ehrgeiz<RV.nebenziele.ehrgeizigAb)return null;const r=table(t.lg).find(x=>x.id===S.my);if(!r||r.last.length<3||r.last.slice(-3).some(x=>x>0))return null;
    const xi=new Set((S.lineup||[]).map(x=>x&&x.id!=null?x.id:x)),p=squad(S.my).filter(q=>!xi.has(q.id)&&avail(q)).sort((a,b)=>value(b)-value(a))[0];return p?{spieler:p.id}:null;},
  // Vertrauen ab 80, obwohl du unter dem Saisonziel stehst (ab dem 5. Ligaspiel)
  rueckendeckung(){if(S.trust<80||meineSpieltage()<RV.platzAbSpieltag)return null;return rank(myT().lg,S.my)>S.target?{}:null;},
  // Ein Verein, zu dem deine Beziehung unter −50 liegt (K17)
  versoehnung(){const l=S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&bezWirk(t.id)<RBZ.wirkung.gespraechUnter);return l.length?{verein:pick(l).id}:null;},
  // Ein Spieler deines Kaders zwischen 24 und 34
  hochzeit(){const l=squad(S.my).filter(p=>p.age>=24&&p.age<=34);return l.length?{spieler:pick(l).id}:null;},
  // Ein Talent bis 20 bei einem Verein der 2. oder 3. Liga, dessen Talent mindestens deine Kaderstärke erreicht
  geheimtipp(){const lvl=teamLevel(S.my),l=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&p.age<=20&&S.teams[p.team]&&S.teams[p.team].lg>=2&&S.teams[p.team].lg<=3&&p.pot>=lvl);
    if(!l.length)return null;const p=pick(l);return{spieler:p.id,verein:p.team};},
  // Spielwelt (K32 §8, U18b). Auslöser ohne Blick auf Lizenz und Automatik (Gleichschritt, tests/lizenz.js). Altstar: vereinslos, ab 32, mindestens so stark wie dein Kader im Schnitt − 3, Platz im Kader
  altstar(){if(squad(S.my).length>=RS.kaderMax)return null;const lvl=teamLevel(S.my),l=S.pl.filter(p=>p.team===-1&&p.age>=32&&p.str>=lvl-3);return l.length?{spieler:pick(l).id}:null;},
  // Abschiedsspiel: ein Publikumsliebling deines Vereins hat zum letzten Saisonwechsel aufgehört (Ehemalige aus K34)
  abschied(){const st=S.stat;if(!st||!st.ehem)return null;const n=RFS.ident.lieblingSpiele,e=st.ehem.filter(x=>x.bis!=null&&x.bis>=S.season-1&&((x.ver||{})[S.my]||0)>=n).pop();return e?{spieler:e.id,name:e.n}:null;},
  // Rückkehrer: deutscher Spieler im Auslandspool, 26 bis 33, mindestens so stark wie dein Kader im Schnitt − 3
  rueckkehrer(){const lvl=teamLevel(S.my),l=auslandSpieler().filter(p=>p.nat===RW.nation.heimat&&p.age>=26&&p.age<=33&&p.str>=lvl-3);if(!l.length)return null;const p=pick(l);return{spieler:p.id,verein:p.team};},
  // England ruft: dein bester Spieler (ab Stärke 78, bis 30 Jahre) und ein englischer Verein, der ihn bezahlen kann
  englandRuft(){const p=squad(S.my).filter(x=>!x.wech&&!x.leihe).sort((a,b)=>b.str-a.str)[0];if(!p||p.str<78||p.age>30)return null;
    const v=auslandKaeufer(p,value(p)).filter(x=>x.land==='ENG').sort((a,b)=>avBudget(b)-avBudget(a))[0];return v?{spieler:p.id,verein:v.id}:null;}
};

// ---------- Dosierung (K30 §5.1) ----------
// Zähler der laufenden Woche und des laufenden Monats
function kartenBudget(d){const K=karten(),wo=Math.floor(absTag(d)/7),mo=S.season*100+(+mmtt(d).slice(0,2));
  if(K.w.wo!==wo)K.w=Object.assign(K.w,{wo,info:0,ent:0,ber:{}});if(K.w.mo!==mo)Object.assign(K.w,{mo,gross:0});return K.w;}
// Eigene Spiele in den nächsten sieben Tagen (zählen als Halte)
const wochenSpiele=d=>{let n=0;for(let x=d;x<d+7;x++)if(meinSpiel(x))n++;return n;};
// Passt eine Entscheidung noch ins Budget? Sonst entscheidet die Automatik. Mit der Automatik des Bereichs ereignisse entscheidet immer der Co-Trainer.
function entscheidungImBudget(c,W,d){const E=RKT.entscheidung;if(autoB('ereignisse'))return false;
  if(c.gross?W.gross>=E.grossProMonat:W.ent>=E.kleinProWoche)return false;if((W.ber[c.bereich]||0)>=E.jeBereichProWoche)return false;
  return wochenSpiele(d)+W.ent+1<=RKT.halteProWoche;}

// ---------- Woche (montags, eigener Strom, am Ende von woechentlichLauf) ----------
// Gemischte Reihenfolge, erst der Würfel (gleich viele Würfe jede Woche), dann Auslöser, Sperre und Budget.
function kartenWoche(d){if(S.phase!=='play'||S.fired)return;const K=karten(),W=kartenBudget(d),heute=absTag(d);
  for(const c of shuffle(KARTEN.slice())){const hit=R()<1/(RKT.seltenheit[c.stufe]*RKT.wochenJeSaison);if(!hit)continue;
    if(c.stufe==='sehrSelten'&&K.einmal[c.id])continue;const f=AUSLOESER[c.ausloeser];if(!f)continue;const b=f();if(!b)continue;
    const key=[c.id,b.spieler!=null?b.spieler:'',b.verein!=null?b.verein:''].join(':');if(K.sp[key]!=null&&heute-K.sp[key]<(c.sperrTage||RKT.sperrTage))continue;
    let halt=false;if(c.art==='entscheidung')halt=entscheidungImBudget(c,W,d);
    if(halt){W.ent++;if(c.gross)W.gross++;W.ber[c.bereich]=(W.ber[c.bereich]||0)+1;}else{if(W.info>=RKT.infoProWoche)continue;W.info++;}
    K.sp[key]=heute;if(c.stufe==='sehrSelten')K.einmal[c.id]=1;kartenZeigen(c,b,d,halt);}}
// Text mit Platzhaltern, Varianten reihum
function kartenText(t,b){const p=b.spieler!=null?PIX.get(b.spieler):null,v=b.verein!=null?(b.verein>=AV0?avVon(b.verein):S.teams[b.verein]):null; // Auslandsverein und Name eines Ehemaligen seit U18b
  return t.replace(/\{spieler\}/g,p?p.n:(b.name||'ein Spieler')).replace(/\{verein\}/g,v?v.name:'ein Verein').replace(/\{praesident\}/g,'der Präsident');}
function kartenZeigen(c,b,d,halt){const K=karten(),i=K.v[c.id]||0,text=kartenText(c.texte[i%c.texte.length],b);K.v[c.id]=i+1;
  if(c.art==='info'){news(`${c.titel}: ${text}`,'');kartenLog(c,d,null,false);return;}
  const k={id:c.id,tag:d,s:S.season,b,text};
  if(halt){K.offen.push(k);news(`${c.titel}: ${text} Deine Entscheidung steht im Büro.`,'offer');return;}
  kartenEntscheiden(k,c.auto,true);}

// ---------- Entscheiden ----------
// i: Index der Option. auto: der Co-Trainer entscheidet (Budget voll, Automatik oder keine Antwort bis zum Spieltag). Würfel je Karte und Tag (gleich, egal wann entschieden wird).
function kartenEntscheiden(k,i,auto){const c=karteVon(k.id),o=c&&c.optionen&&c.optionen[i];if(!o)return;const K=karten();K.offen=K.offen.filter(x=>x!==k);
  const zus=mitStrom(strom('ereignisse',k.s,k.tag,k.id),()=>o.wirkung.map(w=>kartenWirkung(w,k.b,c)).filter(Boolean));
  const folge=[o.folge?kartenText(o.folge,k.b):'',...zus.map(t=>kartenText(t,k.b))].filter(Boolean).join(' ');
  news(`${c.titel}: ${auto?`${auto===true?'Der Co-Trainer entscheidet':'Ohne deine Antwort entscheidet der Co-Trainer'}: „${o.text}“.`:`Du entscheidest: „${o.text}“.`}${folge?' '+folge:''}`,auto?'':'good');
  kartenLog(c,k.tag,i,!!auto);}
// Deine Wahl im Büro
function karteWaehlen(n,i){const k=karten().offen[n];if(!k)return;if(!darf('ereignisse'))return;kartenEntscheiden(k,i,false);save();render();}
// Offene Karten bis zum Tag d: vor den Spielen des Tages (tagesSpieleVorbereiten) und am nächsten Morgen (taeglichLauf). So entscheidet die Automatik vor dem Anpfiff,
// wie in einer Welt, in der der Co-Trainer gleich entschieden hätte (Gleichschritt in tests/lizenz.js).
function kartenAuto(d){const K=S.karten;if(!K||!K.offen.length)return;K.offen.filter(k=>k.tag<=d||k.s!==S.season).forEach(k=>{const c=karteVon(k.id);if(c)kartenEntscheiden(k,c.auto,'spaet');else K.offen=K.offen.filter(x=>x!==k);});}
// Erlaubte Wirkungen (K30 §3.2). Rückgabe: Text zum Ausgang (bei Wirkungen mit Chance) oder ''
function kartenWirkung(w,b,c){let wert=w.wert,txt='';if(w.chance!=null){const ok=R()<w.chance;wert=ok?w.wert:(w.schlecht||0);txt=ok?(w.gut||''):(w.schlechtText||'');}
  const p=b.spieler!=null?PIX.get(b.spieler):null;
  if(w.art==='stimmung'){if(p&&p.team===S.my)stimmungAendern(p,wert);}
  else if(w.art==='stimmungAlle')squad(S.my).forEach(x=>stimmungAendern(x,wert));
  else if(w.art==='zusammenhalt')zusammenhaltAendern(myT(),wert);
  else if(w.art==='glaub')glaubAendern(wert);
  else if(w.art==='vertrauen')S.trust=clamp(S.trust+wert,0,100);
  else if(w.art==='ruf')rufAendern(wert);
  else if(w.art==='bezDu'){if(b.verein!=null)bezDuAendern(b.verein,wert,c.titel);}
  else if(w.art==='geld')money('Ereignisse',wert);
  else if(w.art==='fans')fanAnlass(myT(),'fanU',wert); // seit U18b: Fanstimmung (K27), Umfeld
  else if(w.art==='verpflichten'){if(p&&p.team===-1&&frei('transfers')&&!transferSperre())karteVerpflichten(p,wert);else if(p)news(`${p.n} unterschreibt nicht: Die Transfers führt noch der Verein.`,'');}
  else if(w.art==='interesse'){if(p)p.rkI={s:S.season,v:wert};}
  else if(w.art==='angebot'){if(p&&p.team===S.my&&b.verein!=null&&!S.offers.some(o=>o.pid===p.id&&o.tid===b.verein)){const v=value(p);S.offers.push({pid:p.id,tid:b.verein,amt:rundeAb(v*wert),max:rundeAb(v*(wert+0.2)),r:0,bis:S.tag+RK.angebotTage});}}
  return txt;}
const KARTEN_WIRKUNGEN=['stimmung','stimmungAlle','zusammenhalt','glaub','vertrauen','ruf','bezDu','geld','fans','verpflichten','interesse','angebot'];
// Vereinslosen per Karte holen (Altstar, K32 §8): ein Jahr, Gehalt × f, Kondition −20 (lange ohne Training)
function karteVerpflichten(p,f){p.team=S.my;p.list=0;p.ct=1;p.sal=Math.round(salaryFor(p.str)*f/1000)*1000;p.seit=absTag(S.tag);p.ko=Math.max(0,(p.ko||50)-20);
  neuzugang(p,S.my);kabineInit(p);rollenBerechnen(S.my);news(`${p.n} unterschreibt für ein Jahr (Gehalt ${fmt(p.sal)}).`,'good');}
function kartenLog(c,tag,wahl,auto){const K=karten();K.log.push({id:c.id,s:S.season,tag,wahl,auto});if(K.log.length>RKT.log)K.log.splice(0,K.log.length-RKT.log);}

// ---------- Anzeige im Büro ----------
function kartenKarte(){const K=S.karten;if(!K||!K.offen.length||S.fired)return'';
  return K.offen.map((k,n)=>{const c=karteVon(k.id);if(!c)return'';return`<div class="card"><h2>${esc(c.titel)}</h2><p>${esc(k.text)}</p><div class="opts">${c.optionen.map((o,i)=>`<button class="opt" onclick="karteWaehlen(${n},${i})"${lzAus('ereignisse')}><b>${esc(o.text)}</b>${i===c.auto?'<span>Voreinstellung des Co-Trainers</span>':''}</button>`).join('')}</div>
    <p class="dim">Ohne deine Antwort entscheidet der Co-Trainer vor dem nächsten Spieltag.</p>${lzHinweis('ereignisse')}</div>`;}).join('');}
