// Ereigniskarten (Konzept K30 §5.5, U12d): Prüfen, Auswählen, Dosierung, Sperren, Entscheidungen mit Halt und Automatik, erlaubte Wirkungen.
// Katalog in daten/karten.js (KARTEN), Zahlen in daten/regeln.js unter REGELN.karten (Kurzform RKT). Zufall im Strom „ereignisse“.
// ACHTUNG: U12d entstand ohne Testlauf (tests/karten.js ist noch nie gelaufen).
// Spielstand S.karten = {sp: {Karte:Spieler:Verein → Tag}, w: Zähler der Woche und des Monats, offen: [{id, tag, s, b, text}], v: {Karte → Variante}, log: [...], einmal: {Karte → 1}}

function karten(){if(!S.karten)S.karten={sp:{},w:{},offen:[],v:{},log:[],einmal:{}};return S.karten;}
const karteVon=id=>KARTEN.find(c=>c.id===id);

// ---------- Auslöser (K30 §3.1): geben die Beteiligten zurück ({spieler, verein}) oder null ----------
const AUSLOESER={
  // Präsident mit Ehrgeiz, die letzten drei Ligaspiele verloren: Er will einen teuren Spieler sehen, der nicht in der Elf steht
  praesidentSerie(){const t=myT();if(praesident(t).ehrgeiz<RV.nebenziele.ehrgeizigAb&&S.maezen!==S.season)return null; // mit Mäzen auch ohne Ehrgeiz (K23e)
   const r=table(t.lg).find(x=>x.id===S.my);if(!r||r.last.length<3||r.last.slice(-3).some(x=>x>0))return null;
    const xi=new Set((S.lineup||[]).map(x=>x&&x.id!=null?x.id:x)),p=squad(S.my).filter(q=>!xi.has(q.id)&&avail(q)).sort((a,b)=>value(b)-value(a))[0];return p?{spieler:p.id}:null;},
  // Jobangebot (K28 §8, U12j): Ruf ab jobangebot.rufAb, ab dem 5. Ligaspiel, nicht im Ultimatum, höchstens eins je sperrTage über alle Vereine (Prüfung DQ2).
  // Ein Verein derselben oder einer höheren Liga mit mindestens abstand mehr Ansehen als deiner, aber höchstens jobangebotGrenze (Prüfung DQ1)
  jobangebot(){const J=RV.jobangebot,t=myT(),K=karten(),heute=absTag(S.tag),sp=(karteVon('jobangebot')||{}).sperrTage||RKT.sperrTage;
    if(ruf()<J.rufAb||meineSpieltage()<RV.platzAbSpieltag||S.ult||Object.keys(K.sp).some(k=>k.startsWith('jobangebot:')&&heute-K.sp[k]<sp))return null;
    const l=S.teams.filter(x=>x.id!==S.my&&aktiv(x)&&x.lg<=t.lg&&x.rep>=t.rep+J.abstand&&x.rep<=jobangebotGrenze());return l.length?{verein:pick(l).id}:null;},
  // Vertrauen ab 80, obwohl du unter dem Saisonziel stehst (ab dem 5. Ligaspiel)
  rueckendeckung(){if(S.trust<80||meineSpieltage()<RV.platzAbSpieltag)return null;return rank(myT().lg,S.my)>S.target?{}:null;},
  // Ein Verein, zu dem deine Beziehung unter −50 liegt (K17)
  versoehnung(){const l=S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&bezWirk(t.id)<RBZ.wirkung.gespraechUnter);return l.length?{verein:pick(l).id}:null;},
  // Ein Spieler deines Kaders zwischen 24 und 34
  hochzeit(){const l=squad(S.my).filter(p=>p.age>=24&&p.age<=34);return l.length?{spieler:pick(l).id}:null;},
  // Kabine (K14 §8, K14b). Kantersieg: dein letztes Ligaspiel gewonnen mit mindestens RPK.anlass.kantersieg Toren Abstand, höchstens RKT.kabine.partyTage her (Prüfung DT5)
  kantersieg(){const t=myT(),K=RKT.kabine,l=(S.res[t.lg]||[]).filter(r=>r[0]===S.my||r[1]===S.my),r=l[l.length-1];if(!r)return null;const gf=r[0]===S.my?r[2]:r[3],ga=r[0]===S.my?r[3]:r[2];
    const e=meineLigaspiele().find(x=>x.md===r[4]);if(!e||S.tag-e.tag>K.partyTage)return null;return gf-ga>=RPK.anlass.kantersieg?{}:null;},
  // Neuzugang: seit RKT.kabine.neuMin bis neuTage bei dir, einsatzfähig, mindestens so stark wie dein Kader im Schnitt − staerkeMinus, in dieser Saison höchstens kaumMinuten Minuten, ab abSpieltag
  neuzugangDraengt(){const K=RKT.kabine,heute=absTag(S.tag),lvl=teamLevel(S.my);if(meineSpieltage()<K.abSpieltag)return null;
    const l=squad(S.my).filter(p=>p.seit!=null&&heute-p.seit>=K.neuMin&&heute-p.seit<=K.neuTage&&!p.leihe&&avail(p)&&p.str>=lvl-K.staerkeMinus&&!(p.sst&&p.sst.s===S.season&&p.sst.tid===S.my&&p.sst.min>K.kaumMinuten));return l.length?{spieler:pick(l).id}:null;},
  // Meuterei (K14 §8, K14c): ein Führungsspieler deines Kaders mit Stimmung unter RKT.kabine.meutertUnter
  meuterei(){const K=RKT.kabine,l=squad(S.my).filter(p=>hatEig(p,'fuehrungsspieler')&&stimmung(p)<K.meutertUnter);return l.length?{spieler:pick(l).id}:null;},
  // Eingewöhnung: aus dem Ausland gekommen (p.ausAb, seit Prüfung DT1), andere Nationalität, seit höchstens RKT.kabine.fremdTage bei dir
  eingewoehnung(){const K=RKT.kabine,heute=absTag(S.tag),l=squad(S.my).filter(p=>p.ausAb!=null&&heute-p.ausAb<=K.fremdTage&&p.nat&&p.nat!==RW.nation.heimat);return l.length?{spieler:pick(l).id}:null;},
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
    const v=auslandKaeufer(p,value(p)).filter(x=>x.land==='ENG').sort((a,b)=>avBudget(b)-avBudget(a))[0];return v?{spieler:p.id,verein:v.id}:null;},
  // Finanzen (K23e): Mäzen nur in der Not (Kontostand im Minus oder offene Lizenzauflagen), Steuerprüfung immer möglich (selten über die Stufe)
  maezen(){return inNot()?{}:null;},
  steuer(){return{};},
  // Marketing (K25 §8, K25b): ein Spieler deines Vereins bis 20 mit mindestens 3 Ligatoren in dieser Saison
  teenieStar(){const l=squad(S.my).filter(p=>p.age<=20&&(p.g||0)>=3);return l.length?{spieler:pick(l).id}:null;},
  // Training (K07 §8, K07c): ein gesunder Spieler deines Kaders mit Frische unter RKT.training.pauseUnter und Professionalität ab profiAb bittet um Pause
  pauseBitte(){const T=RKT.training,l=squad(S.my).filter(p=>!(p.inj>0)&&p.fit<T.pauseUnter&&profi(p)>=T.profiAb);return l.length?{spieler:pick(l).id}:null;},
  // Jugend (K08 §8, K08b): Talent zum Probetraining, jederzeit in der Saison
  probetraining(){return S.phase==='play'?{}:null;},
  // Stadion (K26 §8, K26e): ein laufendes Bauprojekt ab RKT.stadion.zuschussAb Kosten, noch ohne Zuschuss
  zuschuss(){const c=S.constr;return c&&c.phase!=null&&!c.zuschuss&&c.kosten>=RKT.stadion.zuschussAb?{}:null;},
  // Verträge (K21 §8, K22 §8, K21c): Gehalt deutlich unter dem Marktgehalt und Stimmung gesunken; Neuzugang mit Berater, höchstens provisionTage bei dir
  gehaltsneid(){const V=RKT.vertrag,l=squad(S.my).filter(p=>!p.leihe&&!p.wech&&p.sal<salaryFor(p.str)*V.neidUnter&&stimmung(p)<V.neidStimmung);return l.length?{spieler:pick(l).id}:null;},
  provision(){const V=RKT.vertrag,heute=absTag(S.tag),l=squad(S.my).filter(p=>p.seit!=null&&heute-p.seit<=V.provisionTage&&!!beraterVon(p));return l.length?{spieler:pick(l).id}:null;},
  // Fans (K27 §8, K27c): Ticketpreis über Richtpreis × RKT.fans.preisFaktor bei Fanstimmung unter protestUnter; ein Spieler deines Kaders mit Wechselwunsch ab wwAb
  ticketProtest(){const F=RKT.fans,t=myT();return S.phase==='play'&&t.price>richtPreis(t)*F.preisFaktor&&fanst(t)<F.protestUnter?{}:null;},
  pfiffe(){const l=squad(S.my).filter(p=>(p.ww||0)>=RKT.fans.wwAb);return l.length?{spieler:pick(l).id}:null;},
  // Stab (K16 §8, K16c): ein Mitarbeiter deines Stabs ab Qualität RKT.stab.qAb (Pflichtrollen nur, wenn du mehr als einen hast) und ein Verein mit mehr Ansehen und freiem Platz
  stabAbgeworben(){const K=RKT.stab,t=myT(),l=[];(S.stab||[]).filter(x=>x.team===S.my&&x.q>=K.qAb&&(!RST.rollen[x.r].pflicht||stabVon(S.my,x.r).length>1)).forEach(x=>
    S.teams.forEach(b=>{if(b.id!==S.my&&aktiv(b)&&b.rep>=t.rep+K.ansehenPlus&&stabVon(b.id,x.r).length<RST.rollen[x.r].plaetze)l.push({stab:x.id,verein:b.id});}));
    return l.length?pick(l):null;},
  // K08c: ein Talent deiner Jugend ab RKT.jugend.lockAb mit Talent ab deinem Kaderschnitt + lockPlus, dazu ein Verein mit Ansehen ab deinem + grossPlus
  talentGelockt(){const J=RKT.jugend,t=myT(),lvl=teamLevel(S.my);if(S.jgV!==S.my)return null;const l=(S.jg||[]).filter(p=>p.age>=J.lockAb&&p.pot>=lvl+J.lockPlus);
    const v=S.teams.filter(x=>x.id!==S.my&&aktiv(x)&&x.rep>=t.rep+J.grossPlus);return l.length&&v.length?{spieler:pick(l).id,verein:pick(v).id}:null;},
  // Verletzungsserie: mindestens serieAb Trainingsverletzungen deines Kaders in den letzten serieTage Tagen (laufende und ausgeheilte)
  verletzungsserie(){const T=RKT.training,heute=absTag(S.tag),n=squad(S.my).reduce((a,p)=>a+(p.vl&&p.vl.q==='training'&&heute-p.vl.ab<=T.serieTage?1:0)+(p.vh||[]).filter(x=>x.q==='training'&&heute-x.ab<=T.serieTage).length,0);return n>=T.serieAb?{}:null;},
  // Europapokal (K37 §8, U19e), aus euMeineSpiele (europa.js). Auswärts: dein nächstes Europapokal-Auswärtsspiel bei einem Auslandsverein in den nächsten RKT.europa.vorTage Tagen
  // (nicht das Finale, es ist neutral). Nach dem Spiel: dein letztes gespieltes Europapokalspiel liegt 1 bis RKT.europa.nachTage Tage zurück.
  euAuswaerts(){const E=RKT.europa,m=euMeineSpiele().find(x=>x.a===S.my&&x.h>=AV0&&x.runde!=='fin'&&x.hg==null&&x.tag>=S.tag&&x.tag<S.tag+E.vorTage);return m?{verein:m.h}:null;},
  euNachSpiel(){const E=RKT.europa,m=euMeineSpiele().filter(x=>x.hg!=null&&S.tag-x.tag>=1&&S.tag-x.tag<=E.nachTage).pop();return m?{verein:m.h===S.my?m.a:m.h}:null;},
  // Wunder: im Hinspiel mit mindestens RKT.europa.wunderAb Toren Rückstand, im Rückspiel (1 bis nachTage Tage her) gedreht, nach Toren oder im Elfmeterschießen
  euWunder(){const E=RKT.europa,l=euMeineSpiele(),m=l.find(x=>x.leg===1&&x.hg!=null&&S.tag-x.tag>=1&&S.tag-x.tag<=E.nachTage);if(!m)return null;
    const h=l.find(x=>x.wb===m.wb&&x.runde===m.runde&&x.leg===0);if(!h||h.hg==null)return null;const mir=(x,a,b)=>x.h===S.my?a:b;
    const gf0=mir(h,h.hg,h.ag),ga0=mir(h,h.ag,h.hg),gf=gf0+mir(m,m.hg,m.ag),ga=ga0+mir(m,m.ag,m.hg),pen=m.pen?mir(m,m.pen[0]-m.pen[1],m.pen[1]-m.pen[0]):0;
    return ga0-gf0>=E.wunderAb&&(gf>ga||(gf===ga&&pen>0))?{verein:m.h===S.my?m.a:m.h}:null;}
};

// ---------- Dosierung (K30 §5.1) ----------
// Zähler der laufenden Woche und des laufenden Monats
// entVor: Entscheidungen der Vorwoche (nur wenn sie direkt davor lag), für die Meldungsdichte „wenig“ (K30b)
function kartenBudget(d){const K=karten(),wo=Math.floor(absTag(d)/7),mo=S.season*100+(+mmtt(d).slice(0,2));
  if(K.w.wo!==wo){const vor=K.w.wo===wo-1?(K.w.ent||0):0;K.w=Object.assign(K.w,{wo,info:0,ent:0,entVor:vor,ber:{}});}if(K.w.mo!==mo)Object.assign(K.w,{mo,gross:0});return K.w;}
// Meldungsdichte (K30 §5.1, K35a, K30b): Regler in den Einstellungen (S.einst.dichte). Er verschiebt nur die Grenzen für Halte und Infos, die Würfel bleiben gleich.
// klein: Entscheidungen mit Halt je wochen Wochen, gross: große je Monat, info: Karten-Infos je Woche.
const kartenDichteStufe=()=>{const D=RKT.dichte,k=S.einst&&S.einst.dichte;return D.stufen[k]?k:D.standard;};
function kartenDichte(){const E=RKT.entscheidung,o=RKT.dichte.stufen[kartenDichteStufe()]||{};return{klein:o.klein||E.kleinProWoche,wochen:o.wochen||1,gross:o.gross||E.grossProMonat,info:o.info||RKT.infoProWoche};}
function kartenDichteSetzen(k){if(!RKT.dichte.stufen[k])return;S.einst=S.einst||{aus:{}};S.einst.dichte=k;save();}
// Eigene Spiele in den nächsten sieben Tagen (zählen als Halte)
const wochenSpiele=d=>{let n=0;for(let x=d;x<d+7;x++)if(meinSpiel(x))n++;return n;};
// Passt eine Entscheidung noch ins Budget? Sonst entscheidet die Automatik. Mit der Automatik des Bereichs ereignisse entscheidet immer der Co-Trainer.
function entscheidungImBudget(c,W,d){const E=RKT.entscheidung,D=kartenDichte();if(autoB('ereignisse'))return false;
  if(c.gross?W.gross>=D.gross:W.ent+(D.wochen>1?(W.entVor||0):0)>=D.klein)return false;if((W.ber[c.bereich]||0)>=E.jeBereichProWoche)return false;
  return wochenSpiele(d)+W.ent+1<=RKT.halteProWoche;}

// ---------- Woche (montags, eigener Strom, am Ende von woechentlichLauf) ----------
// Gemischte Reihenfolge, erst der Würfel (gleich viele Würfe jede Woche), dann Auslöser, Sperre und Budget.
function kartenWoche(d){if(S.phase!=='play'||S.fired)return;const K=karten(),W=kartenBudget(d),heute=absTag(d);
  for(const c of shuffle(KARTEN.slice())){const hit=R()<1/(RKT.seltenheit[c.stufe]*RKT.wochenJeSaison);if(!hit)continue;
    if(c.stufe==='sehrSelten'&&K.einmal[c.id])continue;const f=AUSLOESER[c.ausloeser];if(!f)continue;const b=f();if(!b)continue;
    const key=[c.id,b.spieler!=null?b.spieler:'',b.verein!=null?b.verein:''].join(':');if(K.sp[key]!=null&&heute-K.sp[key]<(c.sperrTage||RKT.sperrTage))continue;
    let halt=false;if(c.art==='entscheidung')halt=entscheidungImBudget(c,W,d);
    if(halt){W.ent++;if(c.gross)W.gross++;W.ber[c.bereich]=(W.ber[c.bereich]||0)+1;}else if(c.art==='info'){if(W.info>=kartenDichte().info)continue;W.info++;} /* Entscheidungen ohne Halt entscheidet der Co-Trainer, sie fallen nicht weg (Prüfung DY8) */
    K.sp[key]=heute;if(c.stufe==='sehrSelten')K.einmal[c.id]=1;kartenZeigen(c,b,d,halt);}}
// Text mit Platzhaltern, Varianten reihum
function kartenText(t,b){const p=b.spieler!=null?PIX.get(b.spieler):null,v=b.verein!=null?(b.verein>=AV0?avVon(b.verein):S.teams[b.verein]):null; // Auslandsverein und Name eines Ehemaligen seit U18b
  return t.replace(/\{spieler\}/g,p?p.n:(b.name||'ein Spieler')).replace(/\{verein\}/g,v?v.name:'ein Verein').replace(/\{praesident\}/g,'der Präsident')
    .replace(/\{mitarbeiter\}/g,()=>{const x=b.stab!=null?(S.stab||[]).find(y=>y.id===b.stab):null;return x?`${x.n} (${RST.rollen[x.r].name})`:'ein Mitarbeiter';}) /* K16c */
    .replace(/\{geld:(-?\d+)\}/g,(m,x)=>fmt(Math.abs(kartenGeld(+x))));} // Betrag nach Liga (K23f)
// Geldbetrag einer Karte nach der Liga deines Vereins (K23f): Grundwert × RKT.geldLiga, auf 1.000 € gerundet
const kartenGeld=w=>{const t=S.teams&&S.teams[S.my],f=(RKT.geldLiga||{})[t?t.lg:3]||1;return Math.round(w*f/1000)*1000;};
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
  else if(w.art==='geld'){if(wert)money('Ereignisse',kartenGeld(wert));} // nach Liga (K23f)
  else if(w.art==='fans')fanAnlass(myT(),'fanU',wert); // seit U18b: Fanstimmung (K27), Umfeld
  else if(w.art==='verpflichten'){const ok=p&&rahmenErlaubt(myT(),Math.round(salaryFor(p.str)*wert));if(p&&p.team===-1&&frei('transfers')&&!transferSperre()&&ok)karteVerpflichten(p,wert);else if(p)news(`${p.n} unterschreibt nicht: ${ok?'Die Transfers führt noch der Verein.':'Der Vorstand gibt das Gehalt nicht frei (Gehaltsrahmen).'}`,'');}
  else if(w.art==='interesse'){if(p)p.rkI={s:S.season,v:wert};}
  else if(w.art==='maezen')S.maezen=S.season; // K23e: Präsident mischt sich bis Saisonende ein
  else if(w.art==='merch')mkS().extra={bis:absTag(S.tag)+RMK.karte.merchTage,f:wert}; // K25b: Fanartikel-Erlös für einige Wochen höher
  else if(w.art==='angebot'){if(p&&p.team===S.my&&b.verein!=null&&!S.offers.some(o=>o.pid===p.id&&o.tid===b.verein)){const v=value(p);S.offers.push({pid:p.id,tid:b.verein,amt:rundeAb(v*wert),max:rundeAb(v*(wert+0.2)),r:0,bis:S.tag+RK.angebotTage});}}
  else if(w.art==='jobwechsel'){if(b.verein!=null)karteJobwechsel(b.verein);} /* U12j: nur über deine Wahl, die Voreinstellung bleibt */
  else if(w.art==='talent'){if(wert>0){jugendKader();const q=jugendNeu(wert);q.age=RKT.jugend.alter;eigenschaftenNeu(q);S.jg.push(q);PIX.set(q.id,q);news(`${q.n} (${q.pos}, ${q.age}) kommt nach dem Probetraining in deine Jugend.`,'good');}} /* K08b: neues Talent mit Plus wert */
  else if(w.art==='jugendHoch'){if(p&&istJugend(p)&&(S.jg||[]).includes(p)){if(squad(S.my).length>=RM.kaderMax)news(`Im Kader ist kein Platz, ${p.n} bleibt vorerst in der Jugend.`,'');else{jugendHoch(p);news(`${p.n} unterschreibt seinen ersten Profivertrag.`,'good');}}} /* K08c */
  else if(w.art==='jugendWeg'){const v=b.verein!=null?S.teams[b.verein]:null;if(p&&v&&aktiv(v)&&istJugend(p)&&(S.jg||[]).includes(p))karteJugendWeg(p,v);} /* K08c: wechselt wirklich zum lockenden Verein */
  else if(w.art==='stabWeg'||w.art==='stabHalten'){const x=b.stab!=null?(S.stab||[]).find(y=>y.id===b.stab):null,v=b.verein!=null?S.teams[b.verein]:null;if(x&&x.team===S.my)karteStab(x,v,w.art==='stabWeg',wert);} /* K16c */
  else if(w.art==='preisRichtwert'){const t=myT();t.price=clamp(Math.round(richtPreis(t)),RF.ticketPreis.min,RF.ticketPreis.max);} /* K27c: Ticketpreis auf den Richtpreis */
  else if(w.art==='gehaltAnpassen'){if(p&&p.team===S.my){const neu=Math.max(p.sal,Math.round(salaryFor(p.str)*wert/1000)*1000);if(!rahmenErlaubt(myT(),neu-p.sal))txt='Der Vorstand gibt die Erhöhung nicht frei (Gehaltsrahmen).';else p.sal=neu;}} /* K21c */
  else if(w.art==='beraterBez'){if(p)beraterBeziehung(p,wert);} /* K21c: Beziehung zum Berater des Spielers */
  else if(w.art==='zuschuss'){const c=S.constr;if(c&&!c.zuschuss){const x=Math.round(c.kosten*wert/1000)*1000;c.zuschuss=x;money('Stadionbau',x);txt=`Die Stadt überweist ${fmt(x)}.`;}} /* K26e: Anteil wert der Baukosten */
  else if(w.art==='pause'){if(p&&p.team===S.my){p.fit=Math.min(100,p.fit+wert);p.sp=Math.max(0,(p.sp||0)-RKT.training.pauseSpielpraxis);}} /* K07c: Frische +wert, etwas Spielpraxis weg */
  return txt;}
const KARTEN_WIRKUNGEN=['stimmung','stimmungAlle','zusammenhalt','glaub','vertrauen','ruf','bezDu','geld','fans','verpflichten','interesse','angebot','maezen','merch','jobwechsel','pause','talent','jugendHoch','jugendWeg','stabWeg','stabHalten','preisRichtwert','gehaltAnpassen','beraterBez','zuschuss'];
// Höchstes Ansehen eines Vereins, der dir einen Job anbietet: dieselbe Mitte wie die Jobangebote nach einer Entlassung (saison.js mkJobs) plus jobangebot.rufSpanne
const jobangebotGrenze=()=>{const J=RV.jobs;return myT().rep-J.ansehenAbschlag+(ruf()-RV.ruf.start)*RV.ruf.jobsJePunkt+RV.jobangebot.rufSpanne;};
// Vereinswechsel (saison.js takeJob, vor dem Wechsel): offene Karten entscheidet der Co-Trainer noch für den alten Verein, sie wandern nicht mit (Prüfung DQ3)
function kartenJobwechsel(){const K=S.karten;if(!K||!K.offen.length)return;K.offen.slice().forEach(k=>{const c=karteVon(k.id);if(c)kartenEntscheiden(k,c.auto,'spaet');});K.offen=[];}
// Jobwechsel per Karte (K28 §8, U12j): Gehalt bis heute in die Karriere, Ablöse für deinen Vertrag (Gehalt je Saison × jobangebot.abloese, höchstens das Konto des neuen Vereins)
// vom neuen an den alten Verein, dann takeJob. Nicht, wenn der Verein nicht mehr aktiv ist, du entlassen bist oder er inzwischen deiner ist.
function karteJobwechsel(id){const t=S.teams[id],alt=myT();if(!t||!aktiv(t)||S.fired||id===S.my){news('Das Angebot ist nicht mehr zu haben.','');return;}
  const geh=S.tvt&&S.tvt.tid===S.my?S.tvt.geh:trainerGehalt(S.my),a=Math.max(0,Math.min(Math.round(geh*RV.jobangebot.abloese/1000)*1000,Math.max(0,t.cash)));
  trainerVertragEnde(false);t.cash-=a;alt.cash+=a;news(`${t.name} zahlt ${alt.name} ${fmt(a)} Ablöse für deinen Vertrag.`,'');mitnehmenCoTrainer();takeJob(id);} /* Co-Trainer kommen mit (K16b, Prüfung DU5) */
// Vereinslosen per Karte holen (Altstar, K32 §8): ein Jahr, Gehalt × f, Kondition −20 (lange ohne Training)
function karteVerpflichten(p,f){p.team=S.my;p.list=0;p.ct=1;p.sal=Math.round(salaryFor(p.str)*f/1000)*1000;p.seit=absTag(S.tag);p.ko=Math.max(0,(p.ko||50)-20);
  neuzugang(p,S.my);kabineInit(p);rollenBerechnen(S.my);news(`${p.n} unterschreibt für ein Jahr (Gehalt ${fmt(p.sal)}).`,'good');}
// Talent aus deiner Jugend wechselt zum lockenden Verein (K08c): Ausbildungsentschädigung jugendPreis (kann 0 sein) vom Verein an dich, Vertrag wie ein Aufrücker. Er bleibt dein Eigengewächs (p.ej), und wie bei Abgängen aus der Jugend bist du am Weiterverkauf beteiligt (K19d, RJ.verkauf.anteil)
function karteJugendWeg(p,v){const N=RS.nachwuchs,preis=Math.min(jugendPreis(p),Math.max(0,v.cash));S.jg=S.jg.filter(x=>x!==p);p.team=v.id;p.seit=absTag(S.tag);p.abl=preis;p.ej=S.my;p.wvb={tid:S.my,anteil:RJ.verkauf.anteil,von:v.id};p.ct=N.vertrag;p.sal=Math.round(salaryFor(p.str)*N.gehalt/1000)*1000;
  p.sp=RP.startSpielpraxis;delete p.trf;delete p.ent;S.pl.push(p);PIX.set(p.id,p);if(preis){money('Jugend: Abgänge',preis);v.cash-=preis;}neuzugang(p,v.id);kabineInit(p);rollenBerechnen(v.id);
  news(`${p.n} wechselt aus deiner Jugend zu ${v.name}${preis?`, Ausbildungsentschädigung ${fmt(preis)}`:''}.`,'tr');}
// Mitarbeiter abgeworben (K16c): weg = er wechselt (Ablöse RKT.stab.abloese × Jahresgehalt vom Verein an dich, nur mit freiem Platz dort), sonst bleibt er mit wert mehr Gehalt
function karteStab(x,v,weg,wert){const K=RKT.stab,rolle=RST.rollen[x.r].name;
  if(weg){if(!v||!aktiv(v)||stabVon(v.id,x.r).length>=RST.rollen[x.r].plaetze){news(`${x.n} bleibt doch, ${v?v.name:'der Verein'} hat keinen Platz mehr.`,'');return;}
    const a=Math.round(x.sal*K.abloese/1000)*1000;x.team=v.id;x.wiv=0;if(a){money('Stab: Ablöse',a);v.cash-=a;}stabGeaendert();news(`${x.n} (${rolle}) wechselt zu ${v.name}${a?`, Ablöse ${fmt(a)}`:''}.`,'tr');return;}
  x.sal=Math.round(x.sal*(1+wert)/1000)*1000;news(`${x.n} (${rolle}) bleibt, für ${fmt(x.sal)} im Jahr.`,'');}
function kartenLog(c,tag,wahl,auto){const K=karten();K.log.push({id:c.id,s:S.season,tag,wahl,auto});if(K.log.length>RKT.log)K.log.splice(0,K.log.length-RKT.log);}

// ---------- Anzeige im Büro ----------
function kartenKarte(){const K=S.karten;if(!K||!K.offen.length||S.fired)return'';
  return K.offen.map((k,n)=>{const c=karteVon(k.id);if(!c)return'';return`<div class="card"><h2>${esc(c.titel)}</h2><p>${esc(k.text)}</p><div class="opts">${c.optionen.map((o,i)=>`<button class="opt" onclick="karteWaehlen(${n},${i})"${lzAus('ereignisse')}><b>${esc(o.text)}</b>${i===c.auto?'<span>Voreinstellung des Co-Trainers</span>':''}</button>`).join('')}</div>
    <p class="dim">Ohne deine Antwort entscheidet der Co-Trainer vor dem nächsten Spieltag.</p>${lzHinweis('ereignisse')}</div>`;}).join('');}
