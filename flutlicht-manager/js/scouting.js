// Scouting und Informationsnebel (Konzept K18, U9a). Zahlen in daten/regeln.js unter REGELN.scouting (Kurzform RSC).
// Jeder Spieler hat echte Werte. Was du von fremden Spielern siehst, hängt von der Kenntnis deines Vereins ab (0–100):
// die Stärke als Spanne, Merkmale erst ab einer gewissen Kenntnis. Die Spanne ist ehrlich: Der wahre Wert liegt in mindestens 80 % der Fälle darin.
// Die Fehler sind je Spieler fest und kommen aus dem Seed, nicht aus einem Zufallsstrom: Neuladen ändert nichts, mehr Kenntnis rückt die Mitte an die Wahrheit.

// Standardnormaler Wert je Schlüssel (Box-Muller aus zwei Hash-Zahlen)
function hashNormal(...k){const h=hash32([S.seed,...k].join('|')),a=(mix32(h,1)+0.5)/4294967296,b=(mix32(h,2)+0.5)/4294967296;return Math.sqrt(-2*Math.log(a))*Math.cos(2*Math.PI*b);} // nachgemischt, sonst leicht schief
// Grundkenntnis (K18 §3.1): was jeder weiß, ohne zu beobachten. Ausland (Pool aus K32): 5. Jugend kommt mit K08.
function grundKenntnis(p){const G=RSC.grund;if(p.team===S.my)return G.eigen;if(istAusland(p))return G.ausland;const t=S.teams[p.team];if(p.team<0||!t||t.lg>3)return G.unten;return t.lg===myT().lg?G.liga:G.deutsch;}
const kenntnisEintrag=p=>(S.kenntnis||{})[p.id];
function kenntnis(p){const g=grundKenntnis(p),e=kenntnisEintrag(p);return e?Math.max(g,Math.round(e.k)):g;}
const sichtBreite=k=>{for(const[b,w]of RSC.sicht)if(k<b)return w;return RSC.sicht[RSC.sicht.length-1][1];};
// Streuung des Grundfehlers eines Scouts (K18 §5.2, kalibriert): 0,15 × (21 − Qualität)
const scoutFehler=q=>RSC.fehler.je*(21-q);
// Lieblingstyp (aus der Nummer des Scouts, bei etwa 30 %): überschätzt diesen Typ um 2–4
function lieblingstyp(x){if(!x||x.r!=='scout')return null;const h=hash32('lt|'+x.id),F=RSC.fehler;if(h%100>=F.lieblingsChance*100)return null;
  return{typ:['schnell','kopfballstark','jung'][(h>>>8)%3],plus:F.lieblingstyp[0]+(h>>>12)%(F.lieblingstyp[1]-F.lieblingstyp[0]+1)};}
const LIEBLINGSTYP_NAME={schnell:'schnelle Spieler',kopfballstark:'Kopfballspieler',jung:'junge Spieler'};
const passtTyp=(p,typ)=>typ==='jung'?p.age<=21:hatMk(p,typ);
// Spezialgebiet (aus der Nummer des Scouts): Inland, Jugend oder Ausland. Im eigenen Gebiet wirkt ein Scout 1,3-fach, außerhalb 0,8-fach (K18 §5.1).
// Inland: Spieler deutscher Vereine und Vereinslose. Ausland: Spieler der Auslandsvereine (K32). Jugend: Spieler bis 21, egal wo.
const scoutGebiet=x=>['inland','inland','jugend','ausland'][hash32('gb|'+x.id)%4];
const GEBIET_NAME={inland:'Inland',jugend:'Jugend',ausland:'Ausland'};
function gebietFaktor(x,p){const g=scoutGebiet(x),P=RSC.proWoche;if(g==='jugend')return p.age<=21?P.gebiet:P.fremd;return (g==='ausland')===istAusland(p)?P.gebiet:P.fremd;}
// Reisekosten je Woche (K18 §5.4): im Ausland das Fünffache
const reiseKosten=ausland=>ausland?RSC.kosten.ausland:RSC.kosten.inland;
const scoutVon=id=>(S.stab||[]).find(x=>x.id===id);

// Sicht auf die Stärke (K18 §3.2, §5.2): Mitte und Spanne. Eigene Spieler genau.
function staerkeSicht(p){if(p.team===S.my)return{genau:true,mitte:p.str,lo:Math.round(p.str),hi:Math.round(p.str),k:100};
  const k=kenntnis(p),sk=sichtBreite(k)/RSC.z,e=kenntnisEintrag(p),sc=(e&&e.s||[]).map(scoutVon).filter(Boolean);
  let mitte=p.str+hashNormal('k',p.id)*sk,v=sk*sk,bias=0;
  if(sc.length){let sum=0,vs=0;sc.forEach(x=>{const sd=scoutFehler(x.q),lt=lieblingstyp(x);sum+=hashNormal('s',x.id,p.id)*sd;vs+=sd*sd;if(lt&&passtTyp(p,lt.typ))bias+=lt.plus;});
    mitte+=sum/sc.length;v+=vs/(sc.length*sc.length);bias/=sc.length;mitte+=bias;}
  const h=Math.max(1,RSC.z*Math.sqrt(v)+Math.abs(bias)); // ehrlich: die Spanne deckt Fehler und Vorliebe ab
  return{genau:false,mitte,lo:clamp(Math.round(mitte-h),1,99),hi:clamp(Math.round(mitte+h),1,99),k};}
const staerkeText=p=>{const s=staerkeSicht(p);return s.lo===s.hi?String(s.lo):`${s.lo}–${s.hi}`;};
// Öffentliche Mitte (nur Grundkenntnis): Grundlage für den Marktwert fremder Spieler, damit er nichts verrät
const publikMitte=p=>p.str+hashNormal('k',p.id)*sichtBreite(grundKenntnis(p))/RSC.z;
const wertSicht=p=>p.team===S.my?value(p):value(Object.assign({},p,{str:clamp(publikMitte(p),1,99)}));
// Merkmale je Kenntnis (K18 §3.2): unter 20 nichts, bis 39 das Auffälligste, bis 59 die Stärken, ab 60 alles
function merkmaleSicht(p){const alle=sichtbareMerkmale(p);if(p.team===S.my)return{liste:alle,hinweis:''};const k=kenntnis(p),st=alle.filter(m=>!RP.merkmale[m].schwaeche);
  if(k<20)return{liste:[],hinweis:'unbekannt (Kenntnis unter 20)'};if(k<40)return{liste:st.slice(0,1),hinweis:'nur das Auffälligste (Kenntnis unter 40)'};
  if(k<60)return{liste:st,hinweis:'Schwächen unbekannt (Kenntnis unter 60)'};return{liste:alle,hinweis:''};}
// Empfehlung (K18 §5.3): Mitte gegen deinen besten Spieler auf derselben Position
function empfehlung(p){const E=RSC.empfehlung,s=staerkeSicht(p),best=squad(S.my).filter(q=>q.pos===p.pos).sort((a,b)=>b.str-a.str)[0];if(!best)return'verpflichten';
  const d=s.mitte-best.str;return d>=E.verpflichten?'verpflichten':d>=E.beobachten?'beobachten':'kein Bedarf';}

// ---------- Aufträge (K18 §4): Spieler beobachten (1–3 Wochen) oder Suchauftrag. Ein Scout hat einen Auftrag zur Zeit. ----------
const meineScouts=()=>stabVon(S.my,'scout');
const scoutFrei=x=>!(S.auftraege||[]).some(a=>a.scout===x.id);
const auftragFuer=pid=>(S.auftraege||[]).find(a=>a.art==='spieler'&&a.pid===pid);
function beobachtenLauf(pid,scoutId,wochen){const p=PIX.get(pid),x=meineScouts().find(y=>y.id===scoutId);
  if(!p||p.team===S.my)return'Diesen Spieler kennst du schon genau.';if(!x)return'Dieser Scout arbeitet nicht für dich.';if(!scoutFrei(x))return`${x.n} hat schon einen Auftrag.`;if(auftragFuer(pid))return'Er wird schon beobachtet.';
  S.auftraege=[...(S.auftraege||[]),{art:'spieler',scout:x.id,pid,rest:clamp(Math.round(wochen)||1,1,3),von:absTag(S.tag)}];
  news(`Scout ${x.n} beobachtet ${p.n} (${clamp(Math.round(wochen)||1,1,3)} Woche${wochen>1?'n':''}).`);return'';}
function sucheLauf(scoutId,krit){const x=meineScouts().find(y=>y.id===scoutId);if(!x)return'Dieser Scout arbeitet nicht für dich.';if(!scoutFrei(x))return`${x.n} hat schon einen Auftrag.`;
  const k={pos:['TW','AB','MF','ST'].includes(krit.pos)?krit.pos:'',alterBis:clamp(+krit.alterBis||40,16,40),abloeseBis:Math.max(0,+krit.abloeseBis||0),region:krit.region==='ausland'?'ausland':'inland'};
  S.auftraege=[...(S.auftraege||[]),{art:'suche',scout:x.id,krit:k,kand:[],gesehen:[],von:absTag(S.tag)}];news(`Suchauftrag an ${x.n}: ${k.region==='ausland'?'Ausland':'Inland'}, ${k.pos||'alle Positionen'}, bis ${k.alterBis} Jahre${k.abloeseBis?`, Ablöse bis ${k.abloeseBis} Mio €`:''}.`);return'';}
function auftragEnde(scoutId){S.auftraege=(S.auftraege||[]).filter(a=>a.scout!==scoutId);}
// Aufträge von Scouts, die nicht mehr für dich arbeiten, fallen weg (Entlassung, Vertragsende)
function auftraegeAufraeumen(){S.auftraege=(S.auftraege||[]).filter(a=>{const x=scoutVon(a.scout);return x&&x.team===S.my;});}
function kenntnisPlus(p,x,f){const P=RSC.proWoche,g=x?P.basis*(P.q[0]+P.q[1]*x.q)*gebietFaktor(x,p)*f:f,S0=S.kenntnis=S.kenntnis||{},e=S0[p.id]||(S0[p.id]={k:grundKenntnis(p),s:[]});
  e.k=Math.min(100,Math.max(e.k,grundKenntnis(p))+g);if(x&&!e.s.includes(x.id))e.s.push(x.id);}
// Bericht als Nachricht (K18 §4.5): Spanne, Talent, Merkmale, Empfehlung
function bericht(p,x){const s=staerkeSicht(p),m=merkmaleSicht(p),t=vereinName(p);
  news(`Scoutbericht von ${x.n}: ${p.n} (${t}, ${p.age}), Stärke etwa ${s.lo}–${s.hi}${p.age<=23?`, Talent ${stars(p)}`:''}${m.liste.length?`, ${m.liste.map(k=>RP.merkmale[k].name).join(', ')}`:''}. Empfehlung: ${empfehlung(p)}.`,'tr');}
// Suchauftrag je Woche: vier neue Namen nach den Kriterien, beobachtet mit halber Wirkung, die besten acht nach Einschätzung bleiben auf der Liste.
// Region Inland: deutsche Vereine und Vereinslose. Region Ausland: der Auslandspool (K32).
function suchWoche(a,x,beob,xi){const C=RSC.suche,k=a.krit,gesehen=new Set(a.gesehen);
  const pool=(k.region==='ausland'?auslandSpieler():S.pl.filter(p=>p.team!==S.my&&p.team>=-1&&(p.team<0||aktiv(S.teams[p.team])))).filter(p=>(!k.pos||p.pos===k.pos)&&p.age<=k.alterBis&&!gesehen.has(p.id)&&(!k.abloeseBis||askPrice(p,xi)<=k.abloeseBis*1e6))
    .sort((p,q)=>publikMitte(q)-publikMitte(p));
  pool.slice(0,C.jeWoche).forEach(p=>{kenntnisPlus(p,x,C.anteil);beob.add(p.id);a.gesehen.push(p.id);});
  a.kand=a.gesehen.map(id=>PIX.get(id)).filter(p=>p&&p.team!==S.my).sort((p,q)=>staerkeSicht(q).mitte-staerkeSicht(p).mitte).slice(0,C.kandidaten[1]).map(p=>p.id);}
// Woche (montags): Aufträge, Kosten, Berichte; Kenntnis verblasst ohne Beobachtung (2 je Monat)
function scoutingWoche(){S.kenntnis=S.kenntnis||{};scoutDanebenWoche();const beob=new Set();let xi=null;
  (S.auftraege||[]).forEach(a=>{const x=scoutVon(a.scout);if(!x||x.team!==S.my){a.ende=1;return;}
    if(a.art==='spieler'){const p=PIX.get(a.pid);if(!p||p.team===S.my){a.ende=1;return;}money('Scouting',-reiseKosten(istAusland(p)));kenntnisPlus(p,x,1);beob.add(p.id);if(--a.rest<=0){a.ende=1;bericht(p,x);konkurrenzTisch(p);}}
    else{money('Scouting',-reiseKosten(a.krit.region==='ausland'));if(!xi&&a.krit.region!=='ausland'){xi=new Set();S.teams.forEach(t=>{if(aktiv(t))bestXI(t.id,t.form).forEach(id=>xi.add(id));});}suchWoche(a,x,beob,xi);}});
  S.auftraege=(S.auftraege||[]).filter(a=>!a.ende);
  for(const id in S.kenntnis){if(beob.has(+id))continue;const p=PIX.get(+id),e=S.kenntnis[id];if(!p||p.team===S.my){delete S.kenntnis[id];continue;}
    e.k-=RSC.verblassen*7/30;if(e.k<=grundKenntnis(p))delete S.kenntnis[id];}}
// Nach deinem Pflichtspiel: Wer gegen dich gespielt hat, ist dir etwas besser bekannt (+5)
function scoutingNachSpiel(list){const m=list.find(r=>r.h===S.my||r.a===S.my);if(!m)return;const s=m.h===S.my?1:0;(m.xpo[s]||[]).forEach(([id])=>{const p=PIX.get(id);if(p&&p.team!==S.my)kenntnisPlus(p,null,RSC.grund.jeSpiel);});}
// Scouts beim Aufbau der Welt (eigener Zufallsstrom, damit der übrige Stab gleich bleibt): je Verein nach Ansehen, dazu vereinslose
function scoutsAufbau(){const A=RST.start,Z=RSC.start;S.teams.forEach(t=>{if(!aktiv(t))return;const n=stufenWert(Z.scouts,t.rep);for(let i=0;i<n;i++)S.stab.push(stabNeu('scout',t.rep*A.qualitaetJeAnsehen+ri(A.streuung[0],A.streuung[1])-i,t.id,t.lg));});
  for(let i=0;i<Z.vereinslos;i++)S.stab.push(stabNeu('scout',riA(A.vereinslosQ),-1,2));stabGeaendert();}

// ---------- Gegnerbeobachtung (K18 §8, K07 §5 „+2 % mit Gegneranalyse“, K18c) ----------
// Ein Scout deines Stabs schaut den Gegner deines nächsten Pflichtspiels an (Reisekosten RSC.gegner.kosten). t.gb = {g Gegner, bis Tag des Spiels}.
// Bis zu diesem Spiel verdoppelt sich der Bonus der Spielvorbereitung (taktik.js), wie mit einem Videoanalysten, beides zusammen nicht doppelt. Ohne Zufall.
const gegnerBeobachtet=(t,g)=>!!(t&&t.gb&&t.gb.g===g&&S.tag<=t.gb.bis);
function gbNaechstes(){const e=heuteMeinSpiel()?meinSpiel(S.tag):naechstesSpiel(S.tag+1);if(!e)return null;const g=pkGegner(e);return g==null||g>=1000?null:{g,d:e.tag};}
// Warum die Beobachtung nichts brächte (Prüfung DW8), sonst '': Der Videoanalyst verdoppelt den Bonus schon, oder am Spieltag fehlt die Spielvorbereitung der letzten zwei Tage (taktik.js)
function gbOhneWirkung(t,n){if(stabFaktor(S.my,'video')>1)return'Dein Videoanalyst hat den Gegner schon im Blick, die Spielvorbereitung wirkt doppelt.';
  if(n.d===S.tag&&!vorbereitungWirkt(t))return`Ohne Spielvorbereitung in den letzten ${RTA.vorbereitungTage} Tagen bringt eine Beobachtung nichts mehr.`;return'';}
function gegnerBeobachten(){if(!darf('beobachten'))return;const t=myT(),n=gbNaechstes();if(!n||gegnerBeobachtet(t,n.g)||gbOhneWirkung(t,n))return;
  if(!stabVon(S.my,'scout').length){toast('Dafür brauchst du einen Scout im Trainerstab.');return;}
  money('Scouting',-RSC.gegner.kosten);t.gb={g:n.g,bis:n.d};news(`Ein Scout beobachtet ${tn(n.g)} vor dem Spiel am ${datumKurz(n.d)}. Die Spielvorbereitung wirkt doppelt.`);save();render();
  if(heuteMeinSpiel())showPre(meinSpiel(S.tag));} /* Fenster vor dem Spiel neu zeichnen, render() tut das nicht (DW8) */
// Scoutbericht (K18 §5 Nr. 3, K18g): wahrscheinlicher Stil des Gegners (kiStilWahl gegen deinen eingestellten Stil, ohne Zufall), ob er auf deinen Lieblingsstil reagieren
// könnte (nur wenn du den Stil selbst wählst, wie in kiStil), die drei Stärksten seiner wahrscheinlichen Elf und wer von seinen bericht.top Stärksten fehlt (verletzt oder
// für den Wettbewerb deines nächsten Spiels gesperrt). Nur Anzeige, ändert nichts am Spiel. Text ohne HTML, der Aufrufer escapt.
// Seit Prüfung FM4 mit den Sperren des Wettbewerbs deines nächsten Spiels (mitWettbewerb, wie im Spiel), FM9: auch Abgestellte bei Nationalmannschaften fehlen.
function scoutBericht(o,home,tag){const t=o!=null&&o>=0&&o<1000?S.teams[o]:null;if(!t)return'';const wb=naechsterWb();return mitLsTag(tag!=null?absTag(tag):null,()=>mitWettbewerb(wb,()=>{const mt=myT(),me=side(S.my,home,false),op=side(o,!home,false);
  me.stil=STILE.includes(mt.stil)?mt.stil:'ausgewogen';const stil=kiStilWahl(op,me),L=!autoB('stil')?stilLiebling():null,sn=k=>STIL_NAME[k]||k;
  const gef=op.xp.slice().sort((a,b)=>b.p.str-a.p.str).slice(0,3).map(x=>`${x.p.n} (${x.pos})`),nat=p=>beiNationalteam(p,tag!=null?absTag(tag):undefined),grund=p=>p.inj>0?'verletzt':nat(p)?'Nationalmannschaft':'gesperrt'; /* FN6: am Spieltag */
  const fehlt=squad(o).slice().sort((a,b)=>b.str-a.str).slice(0,RSC.gegner.bericht.top).filter(p=>p.inj>0||gesperrt(p,wb)||nat(p)).map(p=>`${p.n} (${grund(p)})`);
  return scoutBerichtText(t,stil,L,gef,fehlt,sn);}));}
const scoutBerichtText=(t,stil,L,gef,fehlt,sn)=>`Scoutbericht: ${t.name} spielt wohl ${sn(stil)} (${t.form}).${L&&L.gegen!==stil?` Der Trainer kennt deinen Lieblingsstil ${sn(L.lieb)} und könnte mit ${sn(L.gegen)} dagegenhalten.`:''}${gef.length?` Gefährlich: ${gef.join(', ')}.`:''} ${fehlt.length?`Es fehlen: ${fehlt.join(', ')}.`:'Von seinen Stammkräften fehlt keiner.'}`;
// Seit Prüfung FM3 ohne den Bericht: Den zeigt der Vergleich (tauziehenNaechstes), der im Fenster vor dem Spiel schon steht, sonst stand er doppelt da
function gegnerBeobachtenText(){const t=myT(),n=gbNaechstes();if(!n)return'';if(gegnerBeobachtet(t,n.g))return' <span class="dim">Ein Scout hat den Gegner beobachtet, die Spielvorbereitung wirkt doppelt.</span>';
  const ohne=gbOhneWirkung(t,n);if(ohne)return` <span class="dim">${esc(ohne)}</span>`;
  return` <button onclick="gegnerBeobachten()"${lzAus('beobachten')}>Gegner beobachten lassen (${fmt(RSC.gegner.kosten)})</button>`;}

// ---------- Konkurrenz am Tisch (K18 §8, K18d) ----------
// Nach dem Bericht eines Scouts über einen Spieler: mit RSC.konkurrenz.chance hat ein deutscher Verein mit Bedarf ihn ebenfalls beobachtet. Sein Verein weiß das und
// verlangt von dir für tage Tage preis mehr (forderungDu). Fest aus Seed, Spieler und Tag (hash32), ohne Würfel aus den Strömen. p.kTisch = {bis, f, tid}.
function konkurrenzTisch(p){if(!p||p.team<0)return null;const K=RSC.konkurrenz,heute=absTag(S.tag),h=hash32(S.seed+'/ktisch/'+p.id+'/'+heute);if(h%10000>=K.chance*10000)return null;
  const l=S.teams.filter(b=>b.id!==S.my&&b.id!==p.team&&aktiv(b)&&hatBedarf(b,p));if(!l.length)return null;const b=l[Math.floor(h/10000)%l.length];
  p.kTisch={bis:heute+K.tage,f:1+K.preis,tid:b.id,von:p.team};news(`Konkurrenz am Tisch: Auch ein Scout von ${b.name} hat ${p.n} beobachtet. Sein Verein weiß das und verlangt von dir ${Math.round(K.preis*100)} % mehr.`,'');return b;}
const konkurrenzTischFaktor=p=>p&&p.kTisch&&p.kTisch.von===p.team&&absTag(S.tag)<=p.kTisch.bis?p.kTisch.f:1; // nur beim selben Verein (Prüfung EC2)

// ---------- Scout liegt daneben (K18 §8, K18e) ----------
// Beim Kauf (aktionen.js) merkt sich das Spiel die Mitte deiner Einschätzung und die wahre Stärke (p.kaufSicht). Ist der Spieler bei dir (montags, scoutingWoche) und lag
// die Mitte mindestens RSC.daneben.ab über der wahren Stärke beim Kauf, kommt eine Meldung. Danach ist der Merker weg. Nur Anzeige.
// Seit K18h merkt kaufSicht auch die Scouts deines Stabs, die ihn beobachtet haben (ids), für ihre Bilanz.
function kaufSichtMerken(p){const s=staerkeSicht(p);if(!s||s.genau)return;const e=kenntnisEintrag(p),ids=(e&&e.s||[]).filter(id=>{const x=scoutVon(id);return x&&x.team===S.my&&x.r==='scout';});
  p.kaufSicht={mitte:Math.round(s.mitte),str:Math.round(p.str),scout:e&&e.s&&e.s.length?1:0,ids};}
function scoutDanebenWoche(){squad(S.my).forEach(p=>{const k=p.kaufSicht;if(!k)return;delete p.kaufSicht;const zuHoch=k.mitte-k.str>=RSC.daneben.ab,bil=scoutBilanz(k,zuHoch);
  if(zuHoch)news(`${k.scout?'Scout lag daneben':'Einschätzung lag daneben'}: ${p.n} ist schwächer als gedacht${k.scout?'':' (ohne Scout nur ein grober Eindruck)'}. Beim Kauf sah es nach etwa ${k.mitte} aus, tatsächlich waren es ${k.str}.${bil.map(x=>` Bilanz von ${x.n}: ${x.bil.d} von ${x.bil.n} Einschätzungen zu hoch${scoutRuf(x)==='unzuverlässig'?', sein Ruf leidet':''}.`).join('')}`,'bad');});}
// Ruf des Scouts (K18 §8, K18h, 25.11., popolupo, vorläufig): Jede Einschätzung beim Kauf zählt in die Bilanz der Scouts, die den Spieler beobachtet haben
// und noch bei dir sind (x.bil {n Einschätzungen, d zu hoch}). Ab RSC.ruf.ab Einschätzungen ein Ruf: unzuverlässig ab dem Anteil RSC.ruf.schlecht zu hoch, treffsicher ohne. Nur Anzeige.
function scoutBilanz(k,zuHoch){return(k.ids||[]).map(scoutVon).filter(x=>x&&x.team===S.my&&x.r==='scout').map(x=>{const b=x.bil=x.bil||{n:0,d:0};b.n++;if(zuHoch)b.d++;return x;});}
const scoutRuf=x=>{const b=x&&x.bil;if(!b||b.n<RSC.ruf.ab)return'';return b.d/b.n>=RSC.ruf.schlecht?'unzuverlässig':b.d?'durchwachsen':'treffsicher';};
const scoutBilanzText=x=>{const b=x&&x.bil;if(!b||!b.n)return'';const r=scoutRuf(x);return`${b.n} ${b.n===1?'Kauf':'Käufe'} eingeschätzt, ${b.d} zu hoch${r?`, ${r}`:''}`;};
