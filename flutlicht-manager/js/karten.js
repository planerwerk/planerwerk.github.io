// Ereigniskarten (Konzept K30 §5.5, U12d): Prüfen, Auswählen, Dosierung, Sperren, Entscheidungen mit Halt und Automatik, erlaubte Wirkungen.
// Katalog in daten/karten.js (KARTEN), Zahlen in daten/regeln.js unter REGELN.karten (Kurzform RKT). Zufall im Strom „ereignisse“.
// ACHTUNG: U12d entstand ohne Testlauf (tests/karten.js ist noch nie gelaufen).
// Spielstand S.karten = {sp: {Karte:Spieler:Verein → Tag}, w: Zähler der Woche und des Monats, offen: [{id, tag, s, b, text}], v: {Karte → Variante}, log: [...], einmal: {Karte → 1},
//   kette: [{id Folgekarte, tag absolut, s, b}] seit K30c (fehlt in alten Spielständen)}. Merker am Spieler: p.ld3 = {s, t Verein, v Verkäufer, mit [zwei Vereine], leise} (lachender Dritter, K30c).

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
  // Rettungsangebot (K28 §5.13, U12n): du stehst im Ultimatum, Ruf ab RV.rettung.rufAb, höchstens eins je sperrTage über alle Vereine (wie beim Jobangebot).
  // Ein Verein derselben oder einer tieferen Profiliga mit höchstens deinem Ansehen und höchstens rettung.abstand darunter: ein Schritt zurück statt der Entlassung
  rettung(){const R0=RV.rettung,t=myT(),K=karten(),heute=absTag(S.tag),sp=(karteVon('rettung')||{}).sperrTage||RKT.sperrTage;
    if(!S.ult||S.ult.tid!==S.my||S.fired||ruf()<R0.rufAb||Object.keys(K.sp).some(k=>k.startsWith('rettung:')&&heute-K.sp[k]<sp))return null;
    const l=S.teams.filter(x=>x.id!==S.my&&aktiv(x)&&x.lg>=t.lg&&x.lg<=3&&x.rep<=t.rep&&x.rep>=t.rep-R0.abstand);return l.length?{verein:pick(l).id}:null;},
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
  // Form (K03 §8, K03b): ein gesunder Spieler deines Kaders mit Form bis RKT.form.kriseBis (Krise) oder ab hochAb (Formhoch), in der Saison
  formkrise(){if(S.phase!=='play')return null;const l=squad(S.my).filter(p=>!(p.inj>0)&&p.form<=RKT.form.kriseBis);return l.length?{spieler:pick(l).id}:null;},
  formhoch(){if(S.phase!=='play')return null;const l=squad(S.my).filter(p=>!(p.inj>0)&&p.form>=RKT.form.hochAb);return l.length?{spieler:pick(l).id}:null;},
  // Berater droht mit Wechsel (K21 §8, K22 §8, K22c): ein Spieler deines Kaders im letzten Vertragsjahr mit einem gierigen Berater
  beraterDroht(){const l=squad(S.my).filter(p=>p.ct<=1&&!p.wech&&!p.leihe&&p.sal<salaryFor(p.str)&&(beraterVon(p)||{}).prof==='gierig'); /* nur unter dem Marktgehalt, sonst kostet Nachgeben nichts (Prüfung EE5) */return l.length?{spieler:pick(l).id}:null;},
  // Hilfe in der Not (K17 §8, K17b): ab RKT.hilfe.verletzteAb Verletzten im offenen Fenster; ein Verein mit Beziehung über bezAb hat einen Spieler, den er abgeben würde (RLE.holenRollen)
  hilfeInNot(){const H=RKT.hilfe;if(!fensterOffen()||squad(S.my).filter(p=>p.inj>0).length<H.verletzteAb)return null;const l=[];
    /* Prüfung EE2: nur Spieler, die die Leihe auch zuließe (ausleihenGrund), nicht aus der Zweiten, und der Verleiher behält mehr als kaderMin Spieler (wie kiLeihbar) */
    S.teams.forEach(b=>{if(b.id===S.my||!aktiv(b)||bezWirk(b.id)<=H.bezAb)return;const sq=squad(b.id);if(sq.length<=RM.verkaeufer.kaderMin)return;sq.forEach(p=>{if(!(p.inj>0)&&!p.zwP&&!ausleihenGrund(p))l.push({spieler:p.id,verein:b.id});});});
    return l.length?pick(l):null;},
  // Der lachende Dritte (K30 §8.3, K17 §5.4, K30c): im offenen Fenster ein Spieler auf der Transferliste eines Computer-Vereins, für den mindestens zwei andere Computer-Vereine
  // mitbieten könnten (mitbieter, wie im Bieterwettstreit K20c) und der in deinen Kader passt (hatBedarf). Du kennst seinen Berater (Beziehung ab RKT.dritter.beraterAb)
  // oder hast mit Glück einen Verwandten, der ihn kennt (RKT.dritter.verwandt). mit: die beiden Vereine, die um ihn streiten (die ersten beiden der gemischten Liste).
  lachenderDritter(){const L=RKT.dritter,me=myT();if(!fensterOffen())return null;const l=[];
    S.pl.forEach(p=>{if(!p.list||p.team<0||p.team>=1000||p.team===S.my||p.wech||istLeihe(p)||(p.inj||0)>0)return;const von=S.teams[p.team];if(!von||!aktiv(von)||!hatBedarf(me,p))return;
      const be=beraterVon(p);if(!(be&&be.bz>=L.beraterAb)&&!(R()<L.verwandt))return;const m=mitbieter(p,von,value(p));if(m.length>=2)l.push({p,m});});
    if(!l.length)return null;const x=pick(l),m=shuffle(x.m.slice());return{spieler:x.p.id,verein:x.p.team,mit:[m[0].id,m[1].id]};},
  // Medizin (K10 §8, K10e, Anlasskarten): Grippewelle ab RKT.medizin.grippeAb Kranken im Kader; lange Reha: ein Spieler mit einer Verletzung (keine Krankheit) ab rehaAb Tagen,
  // noch mindestens restAb Tage, Diagnose gestellt, noch nicht beim Spezialisten
  grippewelle(){const n=squad(S.my).filter(p=>p.inj>0&&p.vl&&p.vl.q==='krankheit').length;return n>=RKT.medizin.grippeAb?{}:null;},
  langeReha(){const M=RKT.medizin,heute=absTag(S.tag),l=squad(S.my).filter(p=>p.inj>=M.restAb&&p.vl&&p.vl.q!=='krankheit'&&p.vl.t>=M.rehaAb&&heute>=p.vl.dg&&!p.vl.rfF);return l.length?{spieler:pick(l).id}:null;},
  // Rangelei im Training (K07 §8, K07e): ein gesunder Hitzkopf deines Kaders mit einem gesunden Rivalen im Kader (K14). Die Intensität des Trainings zählt (noch) nicht.
  rangelei(){const l=squad(S.my).filter(p=>!(p.inj>0)&&hatEig(p,'hitzkopf')&&rivalen(p).some(q=>q.team===S.my&&!(q.inj>0)));return l.length?{spieler:pick(l).id}:null;},
  // Partynacht (K14 §8, K14d): Folgekarte nach „Feiern lassen“ (Kabinenparty), ein gesunder Partylöwe deines Kaders macht weiter. Ohne Partylöwen verfällt sie.
  partyNacht(b){const l=squad(S.my).filter(p=>!(p.inj>0)&&hatEig(p,'partyloewe'));return b&&l.length?{spieler:pick(l).id}:null;},
  // Grüppchenbildung (K14 §8, K14e): ein Grüppchen in deinem Kader (grueppchen, K14 §5); Anführer ist ein Führungsspieler der Gruppe, sonst der stärkste
  kabinenGruppe(){const g=grueppchen(S.my);if(!g.length)return null;const l=g[0].filter(p=>!p.wech&&!p.leihe);if(!l.length)return null;const a=l.sort( /* Anführer nicht ausgeliehen und ohne vereinbarten Wechsel (Prüfung EG1) */(x,y)=>(hatEig(y,'fuehrungsspieler')?1:0)-(hatEig(x,'fuehrungsspieler')?1:0)||y.str-x.str)[0];return{spieler:a.id};},
  // Presse (K29 §8, K29l): Spruch geht viral bis RKT.presse.viralTage nach einem Eintrag deines Vereins in der Sprüche-Chronik (K34) dieser Saison;
  // Rivale greift deine Kampfansage auf: offene Kampfansage (Pressekonferenz, Antwort „ankuendigung“) gegen den Gegner deines nächsten Spiels in höchstens vorTage Tagen
  spruchViral(){const T=RKT.presse.viralTage,l=((S.stat&&S.stat.chronik)||[]).filter(c=>c.tid===S.my&&c.s===S.season&&S.tag-c.tag>=0&&S.tag-c.tag<=T);return l.length?{}:null;},
  kampfansageRivale(){const e=naechstesSpiel(S.tag+1);if(!e||e.tag-S.tag>RKT.presse.vorTage)return null;const pa=paarung(e);if(!pa)return null;const g=pa[0]===S.my?pa[1]:pa[0];
    return g!=null&&g<1000&&presseS().aussagen.some(a=>!a.ok&&a.art==='ankuendigung'&&a.gegner===g&&a.s===S.season)?{verein:g}:null;},
  // Testspiele (K11 §8, K30e): in den letzten RKT.testspiel.nachTage Tagen ein Testspiel beim Amateurverein (Dorfverein) oder eine Niederlage gegen einen Amateurverein (Blamage)
  dorfverein(){const N=RKT.testspiel.nachTage,l=(S.testspiele||[]).filter(x=>x.stand==='gespielt'&&x.gegner>=1000&&x.gegner<AV0&&!x.heim&&S.tag-x.tag>=0&&S.tag-x.tag<=N);return l.length?{verein:l[l.length-1].gegner}:null;},
  blamage(){const N=RKT.testspiel.nachTage,l=(S.testspiele||[]).filter(x=>x.stand==='gespielt'&&x.erg&&x.gegner>=1000&&x.gegner<AV0&&S.tag-x.tag>=0&&S.tag-x.tag<=N&&(x.heim?x.erg.hg<x.erg.ag:x.erg.ag<x.erg.hg));
    return l.length?{verein:l[l.length-1].gegner}:null;},
  // Turniersieg (K11 §8, K11f): Sommerturnier (K11b) dieser Saison gewonnen, das Finale (Tag nach dem Halbfinale) höchstens RKT.testspiel.nachTage her
  turniersieg(){const U=S.turnier;if(!U||U.s!==S.season||U.platz!==1)return null;const n=S.tag-(U.tag+1);return n>=0&&n<=RKT.testspiel.nachTage?{}:null;},
  // Entwicklung (K03 §8, K03c): Stärke heute gegen den jüngsten Monatseintrag (p.mvl, K34) dieser Saison, der mindestens RKT.entwicklung.tage alt ist
  durchbruch(){const E=RKT.entwicklung,l=squad(S.my).filter(p=>p.age<=E.jungBis&&kartenStaerkePlus(p)>=E.punkte);return l.length?{spieler:pick(l).id}:null;},
  altersverlust(){const E=RKT.entwicklung,l=squad(S.my).filter(p=>p.age>=E.altAb&&kartenStaerkePlus(p)<=-E.punkte);return l.length?{spieler:pick(l).id}:null;},
  // Skandale (K30 §8.4, K30f), Weltereignisse: ein Wettpate spricht einen gesunden Spieler deines Kaders an (er meldet es);
  // ein Spieler eines Computer-Vereins der drei Profiligen wettet auf eigene Spiele (nicht ausgeliehen, kein vereinbarter Wechsel)
  wettpate(){const l=squad(S.my).filter(p=>!(p.inj>0));return l.length?{spieler:pick(l).id}:null;},
  // Choreo (K27 §5.4, K27f): dein nächstes Ligaspiel ist ein Heimspiel in höchstens RKT.fans.choreoTage Tagen, ein Derby oder Spitzenspiel (wie RPK.anlass), und deine Fankultur wirkt ab choreoAb
  choreo(){const F=RKT.fans,t=myT(),A=RPK.anlass;if(fankulturWirkung(t)<F.choreoAb)return null; /* alle Heim-Ligaspiele im Fenster, nicht nur das nächste (Prüfung EW2: englische Woche) */
    for(const n of meineLigaspiele().filter(e=>e.tag>S.tag&&e.tag-S.tag<=F.choreoTage)){const f=S.fx[n.lg][n.md][n.i],g=pkGegner(n);if(!f||f[0]!==S.my||g==null)continue;
      if(istDerby(S.my,g)||(n.md+1>=A.spitzeAb&&rank(t.lg,S.my)<=A.spitzeBis&&rank(t.lg,g)<=A.spitzeBis))return{verein:g};}return null;},
  // Platzsturm (K27 §5.4, K27g): nach dem letzten Ligaspiel (Liga fertig, höchstens RKT.spiel.nachTage her), zu Hause nicht verloren, und Meister,
  // direkter Aufstieg (2. Liga nach Platz, 3. Liga nach aufstiegsReihe3) oder gerade noch gerettet (vor dem letzten Spieltag unter dem Strich, danach darüber, Prüfung EX3/EY4)
  platzsturm(){const t=myT(),lg=t.lg;if(!ligaFertig(lg))return null;const L=meineLigaspiele(),n=L[L.length-1];if(!n||S.tag-n.tag<0||S.tag-n.tag>RKT.spiel.nachTage)return null;
    const r=(S.res[lg]||[]).find(x=>x[4]===n.md&&(x[0]===S.my||x[1]===S.my));if(!r||r[0]!==S.my||r[2]<r[3])return null;
    const P=RKT.fans.platzsturm,pl=rank(lg,S.my),anz=table(lg).length,sicher=lg===3?anz-RS.abstieg3:anz-P.unterStrich;
    /* Aufstieg in der 3. Liga nach der Reihe ohne zweite Mannschaften (Prüfung EX2); gerettet heißt: vor dem letzten Spieltag unter dem Strich, danach darüber (EX3) */
    const auf=lg===2?pl<=P.aufstieg:lg===3?!(t.zweite>=0)&&aufstiegsReihe3().slice(0,P.aufstieg).includes(S.my):false;
    const r0=S.res[lg];S.res[lg]=r0.filter(x=>x[4]!==n.md);const vorher=rank(lg,S.my);S.res[lg]=r0;const gerettet=pl<=sicher&&vorher>sicher;
    return pl===1||auf||gerettet?{verein:r[1]}:null;},
  // Trainingslager (K11 §8, K11g): Folgekarten aus dem Spielablauf (Prüfung EU1), lagerTag legt sie beim Koller und bei einer Sichtung für denselben Tag in die Kette.
  // Hier nur die Prüfung, ob es noch passt: dasselbe Lager läuft (beim Koller nicht am letzten Tag), der Spieler ist noch bei dir
  lagerkoller(b){const l=lagerAktiv(S.tag);return b&&l&&l.von===b.lager&&S.tag<l.bis?b:null;},
  nachtleben(b){const l=lagerAktiv(S.tag),p=b&&b.spieler!=null?PIX.get(b.spieler):null;return b&&l&&l.von===b.lager&&p&&p.team===S.my?b:null;}, /* b&& seit Prüfung EV5 */
  lagerFreizeit(b){const l=lagerAktiv(S.tag);return b&&l&&l.von===b.lager&&S.tag<l.bis?b:null;}, /* K11j: am selben Tag aus lagerTag */
  // Manipulation in der 3. Liga fliegt auf (K30 §8.4, K30g): ein Spieler eines Computer-Vereins der 3. Liga (keine zweite Mannschaft, nicht verliehen, kein vereinbarter Wechsel)
  // Prüfung ER1: nicht mehr nach dem letzten Spieltag (sonst zwischen den Relegationsspielen), ER2: höchstens einmal in RKT.skandal.abstand Saisons (S.skandal3)
  manipulation3(){if(ligaFertig(3)||(S.skandal3!=null&&S.season-S.skandal3<RKT.skandal.abstand))return null;const l=S.pl.filter(p=>{const t=p.team>=0&&p.team<1000?S.teams[p.team]:null;return t&&t.id!==S.my&&t.lg===3&&!(t.zweite>=0)&&aktiv(t)&&!p.leihe&&!p.wech&&!p.zwP;});const p=l.length?pick(l):null;return p?{spieler:p.id,verein:p.team}:null;},
  wettbetrug(){const l=S.pl.filter(p=>p.team>=0&&p.team<1000&&p.team!==S.my&&!p.leihe&&!p.wech&&!p.zwP&&S.teams[p.team]&&aktiv(S.teams[p.team]));const p=l.length?pick(l):null;return p?{spieler:p.id,verein:p.team}:null;},
  // Jubiläum (K27 §8, K25 §8, K27d): dein Verein wird in diesem Kalenderjahr ein Vielfaches von RKT.jubilaeum.alle Jahre alt (ab ab), Gründungsjahr aus VEREINE (gegr)
  jubilaeum(){const t=myT(),v=VEREINE[S.my],J=RKT.jubilaeum;if(!t||!v||v.kurz!==t.sh||!v.gegr)return null;const j=datumVon(S.tag).getUTCFullYear()-v.gegr;return j>=J.ab&&j%J.alle===0?{verein:S.my}:null;},
  // Nach deinen Spielen der letzten RKT.spiel.nachTage Tage (K05 §8, K05c, S.letzte, Prüfung EK2): ein Joker hat getroffen; eine Diva wurde früh ausgewechselt
  jokerSticht(){const l=kartenLetzt('joker').filter(p=>p.team===S.my);return l.length?{spieler:pick(l).id}:null;},
  handschlag(){const l=kartenLetzt('frueh').filter(p=>p.team===S.my&&hatEig(p,'diva'));return l.length?{spieler:pick(l).id}:null;},
  // Last-Minute-Drama (K05 §8, K05d): eines deiner Pflichtspiele der letzten RKT.spiel.nachTage Tage wurde spät entschieden (spaet in S.letzte, das jüngste zählt)
  lastMinuteSieg(){return kartenLetztSpiel(L=>L.spaet===1)?{}:null;},
  lastMinuteNiederlage(){return kartenLetztSpiel(L=>L.spaet===-1)?{}:null;},
  // Taktik-Coup (K06 §8, K06c), Pyrotechnik und Rudelbildung im Derby (K09 §8, K09e): nach deinen Pflichtspielen der letzten RKT.spiel.nachTage Tage (S.letzte, das jüngste passende)
  taktikCoup(){const L=kartenLetztSpiel(L=>L.coup);return L?{verein:L.gegner}:null;},
  derbyPyro(){const L=kartenLetztSpiel(L=>L.derby&&!L.eu);return L?{verein:L.gegner}:null;}, /* nicht im Europapokal, dort zählt die UEFA (Prüfung FF3) */
  rudelbildung(){const L=kartenLetztSpiel(L=>L.derby&&L.rot);return L?{verein:L.gegner}:null;},
  // Der Hitzkopf und der Schiedsrichter (K03 §8, K03f): ein Hitzkopf deines Kaders flog in einem deiner Pflichtspiele der letzten Tage vom Platz (rotM im Merker)
  hitzkopfSchiri(){const l=kartenLetzt('rotM').filter(p=>p.team===S.my&&hatEig(p,'hitzkopf'));return l.length?{spieler:pick(l).id}:null;},
  // Wurfgeschosse (K09 §4.4, K09h): nach einer Heimniederlage in einem Pflichtspiel der letzten RKT.spiel.nachTage Tage (heim, nl in S.letzte)
  wurf(){const L=kartenLetztSpiel(L=>L.heim&&L.nl&&L.gegner<1000&&!L.eu);return L?{verein:L.gegner}:null;}, /* nicht im Europapokal (Prüfung FF3) */
  // Integration (K03 §8, K11 §8, K03e): Heimweh eines fremdsprachigen Heimweh-Typs, der nach RKT.integration.heimwehWochen Wochen bei dir unter heimwehUnter liegt;
  // Traumtor: ein Neuzugang (Integration unter 100) hat in deinem Testspiel der letzten RKT.spiel.nachTage Tage getroffen (S.letztTest aus testspielNach)
  heimweh(){const H=RKT.integration,l=squad(S.my).filter(p=>p.int!=null&&p.int<H.heimwehUnter&&(p.wiv||0)>=H.heimwehWochen&&deutschVon(p)<100&&hatEig(p,'heimweh'));return l.length?{spieler:pick(l).id}:null;},
  // Trainingsweltmeister übertreibt (K03 §8, K07 §8, K07h): Trainingsweltmeister oder Vorbildprofi deines Kaders, gesund, in der Vorbereitung (RT.vorbereitungTage ab
  // dem Trainingsauftakt) oder mit Belastungssprung (lastQuote über RT.verletzung.sprungAb)
  uebertreibt(){const t=myT(),a=auftaktTag(t),vorb=S.tag>=a&&S.tag<a+RT.vorbereitungTage;
    const l=squad(S.my).filter(p=>p.inj<=0&&(hatEig(p,'trainingsweltmeister')||hatEig(p,'vorbildprofi'))&&(vorb||lastQuote(p)>RT.verletzung.sprungAb));return l.length?{spieler:pick(l).id}:null;},
  traumtor(){const L=S.letztTest;if(!L||L.s!==S.season||S.tag-L.tag<0||S.tag-L.tag>RKT.spiel.nachTage)return null;const l=(L.tore||[]).map(id=>PIX.get(id)).filter(p=>p&&p.team===S.my&&p.int!=null);return l.length?{spieler:pick(l).id}:null;},
  // Länderspiele (K13 §8, K13g): nur mit RWB.laenderspiele.an, sonst gibt es keine Abstellung. Erste Nominierung (p.lspN 1, gerade bei der Nationalmannschaft);
  // verletzt zurück (p.lspV: absoluter Tag der Rückkehr mit Verletzung) in den letzten RKT.spiel.nachTage Tagen und noch verletzt
  bundestrainer(){const l=squad(S.my).filter(p=>beiNationalteam(p)&&p.lspN===1&&p.age<=RWB.laenderspiele.ersteBis);return l.length?{spieler:pick(l).id}:null;},
  lsVerletzung(){const a=absTag(S.tag),l=squad(S.my).filter(p=>p.lspV!=null&&a-p.lspV>=0&&a-p.lspV<=RKT.spiel.nachTage&&p.inj>0);return l.length?{spieler:pick(l).id}:null;},
  // Urlaub verlängern (K12a §8, K12d): dein Spieler ist noch beim Turnier im Sommer (p.lsp.turnier) und hat mindestens abSpiele Spiele gemacht, noch nicht verlängert
  urlaubVerlaengern(){const U=RKT.urlaubVerlaengern,l=squad(S.my).filter(p=>beiNationalteam(p)&&p.lsp.turnier&&p.lsp.n>=U.abSpiele&&!p.lsp.uv);return l.length?{spieler:pick(l).id}:null;},
  // Spieler hadert mit seiner Position (K06 §8, K06d): mindestens RKT.spiel.positionSpiele Einsätze in Folge auf einer Position mit geringer Eignung (p.pfal)
  positionHadern(){const SP=RKT.spiel,h=absTag(S.tag),l=squad(S.my).filter(p=>(p.pfal||0)>=SP.positionSpiele&&p.pfalT!=null&&h-p.pfalT<=SP.positionTage); /* EK7 */return l.length?{spieler:pick(l).id}:null;},
  // Streit nach Kritik (K15 §8, K15e): ein Spieler deines Kaders hat sich in den letzten RKT.gespraech.streitTage Tagen im Einzelgespräch nach deiner Kritik mit dir gestritten
  streitNachKritik(){const h=absTag(S.tag),T=RKT.gespraech.streitTage,l=squad(S.my).filter(p=>p.streit!=null&&h-p.streit>=0&&h-p.streit<=T&&p.streitT==='kritik'); /* Thema des Streits seit Prüfung EO3 (gespraeche.js), vorher nur das Datum */return l.length?{spieler:pick(l).id}:null;},
  // Spieler fordert Versprechen ein (K15 §8, K15f): ein Versprechen an einen Spieler deines Kaders ist in den letzten RKT.versprechen.tage Tagen gebrochen worden (S.vs)
  versprechenEinfordern(){const h=absTag(S.tag),T=RKT.versprechen.tage,l=(S.vs||[]).filter(v=>v.stand==='gebrochen'&&v.ende!=null&&h-v.ende>=0&&h-v.ende<=T).map(v=>PIX.get(v.pid)).filter(p=>p&&p.team===S.my);
    return l.length?{spieler:pick(l).id}:null;},
  // Standard-Spezialisten (K06 §8, K06e): in der laufenden Halbserie auffällig viele Ligatore nach Standards (S.std aus letztesSpielMerken), einmal je Halbserie
  standardSpezialisten(){const A=S.std,St=RKT.standard;return A&&A.s===S.season&&A.t===S.my&&!A.k&&A.sp>=St.abSpiele&&A.n>=St.ab&&A.g>0&&A.n/A.g>=St.anteil?{}:null;},
  // Folgekarte der Kette (nur über kartenKette, mit den Beteiligten der ersten Karte): Der Spieler ist noch beim selben Verein und noch nicht vergeben
  dritterNoch(b){const p=b&&b.spieler!=null?PIX.get(b.spieler):null;return p&&p.team===b.verein&&!p.wech&&!istLeihe(p)&&S.teams[p.team]&&aktiv(S.teams[p.team])?b:null;},
  // Presse (K29 §8, K17 §8, K29k): Medienklima unter RKT.presse.leckUnter; ein Verein deiner Liga mit Beziehung unter RBZ.wirkung.gespraechUnter
  leck(){return presseS().klima<RKT.presse.leckUnter?{}:null;},
  fehde(){const t=myT(),l=S.teams.filter(x=>x.id!==S.my&&aktiv(x)&&x.lg===t.lg&&bezWirk(x.id)<RBZ.wirkung.gespraechUnter);return l.length?{verein:pick(l).id}:null;},
  // Sommer (K12a §8, K12c): bis RKT.sommer.nachTestTage nach dem Leistungstest ein Spieler mit Übergewicht (Kondition wie im Test zu niedrig); im Urlaub ein Partylöwe
  uebergewicht(){const L=S.lt;if(!L||L.s!==S.season||L.tid!==S.my||S.tag<L.tag||S.tag>L.tag+RKT.sommer.nachTestTage)return null; /* nur wer im Leistungstest auffiel (S.lt, Prüfung ED5) */
    const l=(L.ids||[]).map(id=>PIX.get(id)).filter(p=>p&&p.team===S.my&&!(p.inj>0)&&!beiNationalteam(p)); /* FQ3 */return l.length?{spieler:pick(l).id}:null;},
  urlaubsfoto(){if(!imUrlaub())return null;const l=squad(S.my).filter(p=>hatEig(p,'partyloewe')&&!beiNationalteam(p)); /* FQ3: nicht beim Turnier */return l.length?{spieler:pick(l).id}:null;},
  // Stadion (K26 §8, K26e): ein laufendes Bauprojekt ab RKT.stadion.zuschussAb Kosten, noch ohne Zuschuss
  zuschuss(){const c=S.constr;return c&&c.phase!=null&&!c.zuschuss&&c.kosten>=RKT.stadion.zuschussAb?{bau:c.ab}:null;},
  // Anwohner klagen (K26 §8, K26f): Tribüne oder Dach wartet noch mindestens eine Woche auf die Genehmigung, noch keine Klage bei diesem Projekt
  anwohnerKlagen(){const c=S.constr;return c&&c.phase==='genehmigung'&&!c.klage&&RKT.stadion.anwohner.includes(c.k)&&c.ab-absTag(S.tag)>=RKT.stadion.anwohnerRest?{bau:c.ab}:null;},
  // Streit im Stab (K16 §8, K16f): zwei hitzige Mitarbeiter deines Stabs (stabHitzig), keiner gerade im Streit
  // Co-Trainer wird Cheftrainer (K16 §8, K16g): ein Computer-Verein hat vor höchstens RKT.stab.chef.tage Tagen den Trainer gewechselt (S.trainerWechsel),
  // du hast mindestens zwei Co-Trainer, einer davon ab Qualität chef.qAb und ehrgeizig (stabEhrgeizig). Der Verein will ihn statt des Nachfolgers aus dem Pool.
  coChef(){if(!S.stab||!S.trainerWechsel)return null;const C=RKT.stab.chef,h=absTag(S.tag),co=stabVon(S.my,'co');if(co.length<2)return null;
    const l=co.filter(x=>x.q>=C.qAb&&stabEhrgeizig(x));if(!l.length)return null;
    const w=S.trainerWechsel.filter(e=>e.a!=null&&h-e.a>=0&&h-e.a<=C.tage&&e.t!==S.my&&S.teams[e.t]&&aktiv(S.teams[e.t])&&!(trainerVon(e.t)||{}).co); /* EZ2: nicht, wenn dort schon dein früherer Co-Trainer sitzt */
    return w.length?{stab:pick(l).id,verein:w[w.length-1].t}:null;},
  /* Prüfung EY1: ohne Scouts, sie wirken einzeln über x.q und sind unterwegs; EY2: das Paar sortiert, damit die Sperre am Paar hängt und nicht an der Reihenfolge des Würfels */
  stabStreit(){if(!S.stab)return null;const h=absTag(S.tag),l=S.stab.filter(x=>x.team===S.my&&x.r!=='scout'&&stabHitzig(x)&&!(x.streitBis>=h));if(l.length<2)return null;const a=pick(l),b=pick(l.filter(x=>x!==a)),[u,v]=[a.id,b.id].sort((x,y)=>x-y);return{stab:u,stab2:v};},
  // Talent aus dem Nichts (K18 §8, K18f): du hast einen Scout mit dem Spezialgebiet Jugend ab Qualität RKT.jugend.scoutAb, er hat einen 16-Jährigen entdeckt
  talentEntdeckt(){if(!S.stab)return null; /* alte Spielstände ohne Stab (Prüfung EQ5) */const l=meineScouts().filter(x=>scoutGebiet(x)==='jugend'&&x.q>=RKT.jugend.scoutAb);return l.length?{stab:pick(l).id}:null;},
  // Ehemaliger Kapitän kehrt zurück (K16 §8, K16e): ein Ex-Spieler (K32c) mit den meisten Spielen für deinen Verein, mindestens so viele wie ein Publikumsliebling (Prüfung EP6),
  // ist vereinslos, seit höchstens RST.exSpieler.kapitaenSaisons Saisons, noch nicht gefragt, und in seiner Rolle hast du einen freien Platz
  exKapitaen(){const E=RST.exSpieler,l=(S.stab||[]).filter(x=>x.team<0&&x.ex&&x.exV===S.my&&(x.exVsp||0)>=RFS.ident.lieblingSpiele&&!x.gefragt&&x.exS!=null&&S.season-x.exS<=E.kapitaenSaisons&&stabVon(S.my,x.r).length<RST.rollen[x.r].plaetze);
    return l.length?{stab:pick(l).id}:null;},
  // Verträge (K21 §8, K22 §8, K21c): Gehalt deutlich unter dem Marktgehalt und Stimmung gesunken; Neuzugang mit Berater, höchstens provisionTage bei dir
  gehaltsneid(){const V=RKT.vertrag,l=squad(S.my).filter(p=>!p.leihe&&!p.wech&&p.sal<salaryFor(p.str)*V.neidUnter&&stimmung(p)<V.neidStimmung);return l.length?{spieler:pick(l).id}:null;},
  provision(){const V=RKT.vertrag,heute=absTag(S.tag),l=squad(S.my).filter(p=>p.seit!=null&&heute-p.seit<=V.provisionTage&&!!beraterVon(p));return l.length?{spieler:pick(l).id}:null;},
  // Fans (K27 §8, K27c): Ticketpreis über Richtpreis × RKT.fans.preisFaktor bei Fanstimmung unter protestUnter; ein Spieler deines Kaders mit Wechselwunsch ab wwAb
  ticketProtest(){const F=RKT.fans,t=myT();return S.phase==='play'&&t.price>richtPreis(t)*F.preisFaktor&&fanst(t)<F.protestUnter?{}:null;},
  // Spieler will nur zu dir (K19 §8, K19f): im Transferfenster ein Spieler eines Computer-Vereins (1. bis 3. Liga, nicht verliehen, kein vereinbarter Wechsel) mit Wechselwunsch ab Stufe 3,
  // stark genug für dich (teamLevel − RKT.nurZuDir.staerkeUnter) und mit hohem Interesse an deinem Verein (ab RAW.konkurrenz.nein.ab wie in K20d)
  /* Prüfung FA2: nicht deine eigene Zweite und keine Profis, die dorthin abgestellt sind (zwP); FA4: nicht mit Transfersperre */
  nurZuDir(){if(!fensterOffen()||transferSperre())return null;const ab=RAW.konkurrenz.nein.ab,min=teamLevel(S.my)-RKT.nurZuDir.staerkeUnter,l=[];
    S.teams.forEach(t=>{if(t.id===S.my||t.zweite===S.my||!aktiv(t)||t.lg>3)return;squad(t.id).forEach(p=>{if((p.ww||0)>=3&&!p.wech&&!p.leihe&&!p.zwP&&p.str>=min&&wechselInteresse(p)>=ab)l.push(p);});});
    if(!l.length)return null;const p=pick(l);return{spieler:p.id,verein:p.team};},
  // Fans wollen reden (K27 §8, K27h): Fanstimmung unter RKT.fans.redenUnter und das Fan-Gespräch des Monats ist noch frei (fanGespraechFrei)
  fansReden(){return fanst(myT())<RKT.fans.redenUnter&&fanGespraechFrei()?{}:null;},
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
// Karten mit nurMit kommen nur mit diesem Schalter ins Mischen (Prüfung FQ5: sonst würfelten sie auch ohne Länderspiele mit und verschoben den Kartenstrom).
const kartenSchalterAn=c=>!c.nurMit||(c.nurMit==='laenderspiele'&&lsAn());
function kartenWoche(d){if(S.phase!=='play'||S.fired)return;const K=karten(),W=kartenBudget(d),heute=absTag(d);
  for(const c of shuffle(KARTEN.filter(c=>!c.nurKette&&kartenSchalterAn(c)))){const hit=R()<kartenChance(c);if(!hit)continue; /* Folgekarten kommen nur über kartenKette (K30c) */
    if(c.stufe==='sehrSelten'&&K.einmal[c.id])continue;const f=AUSLOESER[c.ausloeser];if(!f)continue;const b=f();if(!b)continue;
    const key=kartenSchluessel(c,b); /* Mitarbeiter als Beteiligter (Prüfung ED3), je Mitarbeiter ohne den Verein (EE3) */if(K.sp[key]!=null&&heute-K.sp[key]<(c.sperrTage||RKT.sperrTage))continue;
    let halt=false;if(c.art==='entscheidung')halt=entscheidungImBudget(c,W,d);
    let stumm=false;if(halt)kartenHaltZaehlen(c,W);else if(c.art==='info'){if(W.info>=kartenDichte().info&&!c.immer){if(!c.wirkung)continue;stumm=true;}else W.info++;} /* immer: Meldung auch über der Grenze (Prüfung ER3, Punktabzug) */ /* Entscheidungen ohne Halt entscheidet der Co-Trainer, sie fallen nicht weg (Prüfung DY8) */
    K.sp[key]=heute;if(c.stufe==='sehrSelten')K.einmal[c.id]=1;kartenZeigen(c,b,d,halt,stumm);}} /* Info mit Wirkung über der Grenze: Wirkung ja, Meldung nein (Prüfung EH3) */
// Chance je Woche (K30 §5.4, K30d): Anlasskarten mit eigener chance (im Katalog, 0 < chance ≤ 1), sonst nach der Seltenheitsstufe. Ein Würfel je Karte und Woche wie bisher.
// Karten mit fanarbeit:true (Zuschauer-Vergehen, K09h, K25 §5) werden bei laufender Fanarbeit seltener (fanarbeitVergehen, marketing.js). Der Würfel bleibt derselbe.
const kartenChance=c=>(c.chance!=null?c.chance:1/(RKT.seltenheit[c.stufe]*RKT.wochenJeSaison))*(c.fanarbeit?fanarbeitVergehen():1);
// Veränderung der Stärke seit dem jüngsten Monatseintrag dieser Saison, der mindestens RKT.entwicklung.tage alt ist (K03c); ohne Eintrag 0
const kartenStaerkePlus=p=>{const T=RKT.entwicklung.tage,a=(p.mvl||[]).filter(e=>e[0]===S.season&&S.tag-e[1]>=T).pop();return a?Math.round(p.str)-a[2]:0;};
// Merker deiner letzten Pflichtspiele für Karten (K05 §8, K05c, ablauf.js nach den Spielen). S.letzt = das letzte, S.letzte = die Spiele der letzten RKT.spiel.nachTage Tage
// (höchstens merken, seit Prüfung EK2: sonst überschrieb das Ligaspiel am Wochenende das Pokalspiel unter der Woche, bevor die Karten montags prüfen).
// Eintrag {s, t dein Verein (EK3), tag, joker: Eingewechselte, die getroffen haben, frueh: vor fruehBis Ausgewechselte ohne Verletzte (EK1), spaet, gegner, derby, rot, coup}. Kein Würfel.
function letztesSpielMerken(r,d){if(!r||r.test)return;const SP=RKT.spiel,s=r.h===S.my?0:1,ein=new Set(r.ev.filter(e=>e.t==='S'&&e.s===s).map(e=>e.p)),verletzt=new Set((r.inj||[]).map(i=>i.id));
  const joker=[...new Set(r.ev.filter(e=>e.t==='G'&&e.s===s&&e.p!=null&&ein.has(e.p)).map(e=>e.p))],frueh=r.ev.filter(e=>e.t==='S'&&e.s===s&&e.ausId!=null&&e.m<SP.fruehBis&&!verletzt.has(e.ausId)).map(e=>e.ausId);
  // spaet (K05d): das letzte Tor entschied ein Spiel mit einem Tor Unterschied, ohne Elfmeterschießen, ab spaetAb in der regulären Zeit oder ab spaetVerlAb in der Verlängerung (EK4):
  // 1 für dich, −1 gegen dich, sonst 0. Nicht in Relegation und Europapokal, dort zählen oft Hin- und Rückspiel zusammen (EK5, vorläufig).
  const tore=r.ev.filter(e=>e.t==='G'),l=tore[tore.length-1],spaetM=l&&((l.m>=SP.spaetAb&&l.m<=90)||l.m>=SP.spaetVerlAb),
    spaet=!r.pen&&!r.rel&&!r.eu&&spaetM&&Math.abs(r.hg-r.ag)===1&&(r.hg>r.ag?0:1)===l.s?(l.s===s?1:-1):0;
  // gegner, derby und rot für K09e (Derby mit Roter Karte), coup für K06c: gewonnen als Außenseiter (Niveau des Gegners mindestens coupAb höher) mit dem Stil, der den des Gegners schlägt,
  // nur wenn du den Stil selbst wählst (EK6)
  const gegner=s?r.h:r.a,gf=s?r.ag:r.hg,ga=s?r.hg:r.ag,tk=r.taktik||[],mein=tk[s],geg=tk[1-s],
    coup=!autoB('stil')&&gf>ga&&gegner<1000&&!!mein&&!!geg&&RTA.kreislauf[mein.stil]===geg.stil&&teamLevel(gegner)-teamLevel(S.my)>=SP.coupAb;
  S.letzt={s:S.season,t:S.my,tag:d,joker,frueh,spaet,gegner,derby:gegner<1000&&istDerby(r.h,r.a),rot:r.ev.some(e=>e.t==='R'),rotM:r.ev.filter(e=>e.t==='R'&&e.s===s&&e.p!=null).map(e=>e.p),coup,heim:s===0&&!r.neutral,nl:gf<ga,eu:!!r.eu}; /* rotM: deine Spieler mit Platzverweis (K03f) */ /* heim (nicht auf neutralem Platz, Prüfung FF3), nl (Niederlage), eu seit K09h für Zuschauer-Vergehen */
  S.letzte=[...(S.letzte||[]).filter(L=>L&&L.s===S.season&&L.t===S.my&&d-L.tag<=SP.nachTage),S.letzt].slice(-SP.merken);
  // K06e: Tore nach Standards (RKT.standard.arten) in deinen Ligaspielen der laufenden Halbserie, S.std = {s, t, h Halbserie, sp Spiele, g Tore, n Standardtore, k Karte schon da}
  if(r.lg!=null&&!r.rel){S.ligaXI={s:S.season,t:S.my,ids:((r.xi||[])[s]||[]).slice()}; /* Startelf deines letzten Ligaspiels für die Pokal-Rotation (K13e) */const N=(S.fx[r.lg]||[]).length,gesp=(S.res[r.lg]||[]).filter(x=>x[0]===S.my||x[1]===S.my).length,h=gesp>N/2?1:0;let A=S.std;
    if(!A||A.s!==S.season||A.t!==S.my||A.h!==h)A=S.std={s:S.season,t:S.my,h,sp:0,g:0,n:0,k:0};A.sp++;(r.ev||[]).forEach(e=>{if(e.t==='G'&&e.s===s){A.g++;if(RKT.standard.arten.includes(e.art))A.n++;}});}
  // K06d: Einsätze in Folge auf einer Position mit Eignung unter positionUnter (p.pfal, Tag p.pfalT), ab der Mindestzeit für eine Note (EK7). Passende Position setzt zurück,
  // ein Zähler älter als positionTage beginnt neu. Wer nicht oder zu kurz spielte, behält seinen Zähler. (Reihenfolge der Kommentare seit Prüfung EO6)
  const heute=absTag(d);((r.xpo||[])[s]||[]).forEach(([id,pos,,min])=>{const p=PIX.get(id);if(!p||p.team!==S.my||!pos||(min!=null&&min<RE.note.mindestMinuten))return;
    const alt=p.pfalT!=null&&heute-p.pfalT<=SP.positionTage?(p.pfal||0):0;p.pfal=eignung(p,pos)<SP.positionUnter?alt+1:0;p.pfalT=heute;});}
// Deine Pflichtspiele der letzten RKT.spiel.nachTage Tage (S.letzte), dein Verein, diese Saison. Alte Spielstände ohne S.letzte oder mit Merkern ohne Verein (vor EK3):
// in der laufenden Woche keine Spielkarten, harmlos (Prüfung EL3, der frühere Rückfall auf S.letzt griff wegen des Filters auf t nie)
const kartenLetzteSpiele=()=>{const N=RKT.spiel.nachTage,l=S.letzte||[];return l.filter(L=>L&&L.s===S.season&&L.t===S.my&&S.tag-L.tag>=0&&S.tag-L.tag<=N);};
// Das jüngste dieser Spiele, für das f gilt, oder null; Spieler aus der Liste k aller dieser Spiele
const kartenLetztSpiel=f=>kartenLetzteSpiele().filter(f).pop()||null;
const kartenLetzt=k=>[...new Set(kartenLetzteSpiele().flatMap(L=>L[k]||[]))].map(id=>PIX.get(id)).filter(Boolean);
const kartenHaltZaehlen=(c,W)=>{W.ent++;if(c.gross)W.gross++;W.ber[c.bereich]=(W.ber[c.bereich]||0)+1;};
// ---------- Ketten (K30 §3.1, §4 Nr. 5, §8.3, K30c) ----------
// Eine Option mit kette:{karte, tage:[von,bis]} legt die Folgekarte in S.karten.kette ({id, tag absolut, s Saison, b Beteiligte}), gewürfelt im Strom der ersten Karte.
// Täglich (ablauf.js taeglichLauf, eigener Strom): Fällige Folgekarten kommen, wenn ihr Auslöser die Beteiligten noch bestätigt (Auslöser mit Argument b), sonst verfallen sie still.
// Budget wie montags, aber ohne Info-Grenze und ohne Sperre: Eine Kette läuft zu Ende oder verfällt. Ketten enden mit der Saison, bei Entlassung und beim Vereinswechsel.
// Folgekarte aus dem Spielablauf für heute (Karten mit ausSpiel, K11g, Prüfung EU1): fällig am Tag d, kommt noch am selben Tag über kartenKette (ablauf.js), ohne Zufall
function kartenKetteHeute(id,b,d){const K=karten();(K.kette=K.kette||[]).push({id,tag:absTag(d),s:S.season,b});}
function kartenKetteLegen(ke,b,k){const K=karten(),t=ke.tage||[1,1],ab=k.s===S.season?absTag(k.tag):absTag(S.tag);(K.kette=K.kette||[]).push({id:ke.karte,tag:ab+ri(t[0],t[1]),s:S.season,b});}
function kartenKette(d){const K=S.karten;if(!K||!K.kette||!K.kette.length)return;if(S.fired){K.kette=[];return;}if(S.phase!=='play')return;
  const heute=absTag(d),faellig=K.kette.filter(e=>e.tag<=heute||e.s!==S.season);if(!faellig.length)return;K.kette=K.kette.filter(e=>!faellig.includes(e));const W=kartenBudget(d);
  faellig.forEach(e=>{if(e.s!==S.season)return;const c=karteVon(e.id),f=c&&AUSLOESER[c.ausloeser],b=f?f(e.b):null;if(!b)return;
    let halt=false;if(c.art==='entscheidung'){halt=entscheidungImBudget(c,W,d);if(halt)kartenHaltZaehlen(c,W);}kartenZeigen(c,b,d,halt);});}
// Text mit Platzhaltern, Varianten reihum
function kartenText(t,b){const p=b.spieler!=null?PIX.get(b.spieler):null,v=b.verein!=null?(b.verein>=AV0?avVon(b.verein):b.verein>=1000?(S.am||[])[b.verein-1000]:S.teams[b.verein]):null; // Auslandsverein und Name eines Ehemaligen seit U18b, Amateurverein seit K30e
  return t.replace(/\{spieler\}/g,p?p.n:(b.name||'ein Spieler')).replace(/\{verein\}/g,v?v.name:'ein Verein').replace(/\{praesident\}/g,'der Präsident')
    .replace(/\{mitarbeiter\}/g,()=>{const x=b.stab!=null?(S.stab||[]).find(y=>y.id===b.stab):null;return x?`${x.n} (${RST.rollen[x.r].name})`:'ein Mitarbeiter';}) /* K16c */
    .replace(/\{geld:(-?\d+)\}/g,(m,x)=>fmt(Math.abs(kartenGeld(+x))));} // Betrag nach Liga (K23f)
// Geldbetrag einer Karte nach der Liga deines Vereins (K23f): Grundwert × RKT.geldLiga, auf 1.000 € gerundet
const kartenGeld=w=>{const t=S.teams&&S.teams[S.my],f=(RKT.geldLiga||{})[t?t.lg:3]||1;return Math.round(w*f/1000)*1000;};
function kartenZeigen(c,b,d,halt,stumm){const K=karten(),i=K.v[c.id]||0,text=kartenText(c.texte[i%c.texte.length],b);K.v[c.id]=i+1;
  if(c.art==='info'){const z=c.wirkung?mitStrom(strom('ereignisse',S.season,d,c.id),()=>c.wirkung.map(w=>kartenWirkung(w,b,c)).filter(Boolean)):[]; /* Info-Karten mit Wirkung (K30e) */
    if(!stumm)news(`${c.titel}: ${text}${z.length?' '+z.map(t=>kartenText(t,b)).join(' '):''}`,'');kartenLog(c,d,null,false,stumm);return;} /* stumm: über der Info-Grenze nur die Wirkung (EH3) */
  const k={id:c.id,tag:d,s:S.season,b,text};
  if(halt){K.offen.push(k);news(`${c.titel}: ${text} Deine Entscheidung steht im Büro.`,'offer');return;}
  kartenEntscheiden(k,c.auto,true);}

// ---------- Entscheiden ----------
// i: Index der Option. auto: der Co-Trainer entscheidet (Budget voll, Automatik oder keine Antwort bis zum Spieltag). Würfel je Karte und Tag (gleich, egal wann entschieden wird).
function kartenEntscheiden(k,i,auto){const c=karteVon(k.id),o=c&&c.optionen&&c.optionen[i];if(!o)return;const K=karten();K.offen=K.offen.filter(x=>x!==k);
  const zus=mitStrom(strom('ereignisse',k.s,k.tag,k.id),()=>{const z=o.wirkung.map(w=>kartenWirkung(w,k.b,c)).filter(Boolean);if(o.kette)kartenKetteLegen(o.kette,k.b,k);return z;}); /* Folgekarte (K30c) nach den Wirkungen, im selben Strom */
  const folge=[o.folge?kartenText(o.folge,k.b):'',...zus.map(t=>kartenText(t,k.b))].filter(Boolean).join(' ');
  news(`${c.titel}: ${auto?`${auto===true?'Der Co-Trainer entscheidet':'Ohne deine Antwort entscheidet der Co-Trainer'}: „${o.text}“.`:`Du entscheidest: „${o.text}“.`}${folge?' '+folge:''}`,auto?'':'good');
  kartenLog(c,k.tag,i,!!auto);}
// Deine Wahl im Büro
function karteWaehlen(n,i){const k=karten().offen[n];if(!k)return;if(!darf('ereignisse'))return;kartenEntscheiden(k,i,false);save();render();}
// Offene Karten bis zum Tag d: vor den Spielen des Tages (tagesSpieleVorbereiten) und am nächsten Morgen (taeglichLauf). So entscheidet die Automatik vor dem Anpfiff,
// wie in einer Welt, in der der Co-Trainer gleich entschieden hätte (Gleichschritt in tests/lizenz.js).
function kartenAuto(d){const K=S.karten;if(!K||!K.offen.length)return;K.offen.filter(k=>k.tag<=d||k.s!==S.season).forEach(k=>{const c=karteVon(k.id);if(c)kartenEntscheiden(k,c.auto,'spaet');else K.offen=K.offen.filter(x=>x!==k);});}
// Erlaubte Wirkungen (K30 §3.2). Rückgabe: Text zum Ausgang (bei Wirkungen mit Chance) oder ''
// dann (Prüfung EE2, EE5, EE6): Folgewirkungen nur, wenn die Wirkung geklappt hat (nur bei KARTEN_MIT_ERFOLG), dazu der Text gut. Sonst der Grund des Scheiterns.
function kartenWirkung(w,b,c){let wert=w.wert,txt='',erfolg=true;if(w.chance!=null){const ok=R()<w.chance;wert=ok?w.wert:(w.schlecht||0);txt=ok?(w.gut||''):(w.schlechtText||'');}
  const p=b.spieler!=null?PIX.get(b.spieler):null;
  if(w.art==='stimmung'){if(p&&p.team===S.my)stimmungAendern(p,wert);}
  else if(w.art==='stimmungAlle')squad(S.my).forEach(x=>stimmungAendern(x,wert));
  else if(w.art==='zusammenhalt')zusammenhaltAendern(myT(),wert);
  else if(w.art==='integration'){if(p&&p.team===S.my&&p.int!=null){p.int=Math.min(100,p.int+wert);if(p.int>=100){delete p.int;delete p.intA;}}} /* K03e */
  else if(w.art==='deutsch'){if(p&&p.team===S.my&&deutschVon(p)<100)p.de=Math.min(100,deutschVon(p)+wert);} /* K03e: Sprachkurs */
  else if(w.art==='uebertrieben'){if(p&&p.team===S.my){if(wert>0){svAendern(p,1);stimmungAendern(p,2);}else verletzen(p,'training',{art:'zerrung'});}} /* K07h: Lob (wert > 0) oder Zerrung */
  else if(w.art==='glaub')glaubAendern(wert);
  else if(w.art==='vertrauen')S.trust=clamp(S.trust+wert,0,100);
  else if(w.art==='ruf')rufAendern(wert);
  else if(w.art==='bezDu'){if(b.verein!=null)bezDuAendern(b.verein,wert,c.titel);}
  else if(w.art==='geld'){if(wert)money('Ereignisse',kartenGeld(wert));} // nach Liga (K23f)
  else if(w.art==='zuschauer')zuschauerVorfall(w.wert); // Zuschauer-Vergehen (K09h): Vorfall zählen, Zuschlag für Wiederholungstäter, Teilausschluss
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
  else if(w.art==='preisRichtwert'){const t=myT();t.price=Math.min(t.price,clamp(Math.round(richtPreis(t)),RF.ticketPreis.min,RF.ticketPreis.max));} /* K27c: Ticketpreis höchstens auf den Richtpreis, nie hinauf (Prüfung ED1) */
  else if(w.art==='gehaltAnpassen'){erfolg=false;if(p&&p.team===S.my){const neu=Math.max(p.sal,Math.round(salaryFor(p.str)*wert/1000)*1000);if(neu<=p.sal)txt=`${p.n} verdient schon so viel.`;else if(!rahmenErlaubt(myT(),neu-p.sal))txt='Der Vorstand gibt die Erhöhung nicht frei (Gehaltsrahmen).';else{p.sal=neu;erfolg=true;}}else if(p)txt=`${p.n} ist nicht mehr bei dir.`;} /* K21c, Erfolg nur mit Erhöhung (EE5) */
  else if(w.art==='beraterBez'){if(p)beraterBeziehung(p,wert);} /* K21c: Beziehung zum Berater des Spielers */
  else if(w.art==='provisionZahlen'){if(p&&p.team===S.my&&wert)money('Ereignisse',kartenGeld(wert));else{erfolg=false;if(p)txt=`${p.n} ist nicht mehr bei dir, du zahlst nichts.`;}} /* K21c: nur, solange er bei dir ist (Prüfung ED6, EE6) */
  else if(w.art==='zuschuss'){const c=S.constr;if(c&&!c.zuschuss&&(b.bau==null||c.ab===b.bau)){ /* nur das Projekt, um das es ging (Prüfung ED6) */const x=Math.round(c.kosten*wert/1000)*1000;c.zuschuss=x;money('Stadionbau',x);txt=`Die Stadt überweist ${fmt(x)}.`;}} /* K26e: Anteil wert der Baukosten */
  else if(w.art==='sonderschicht'){if(p&&p.team===S.my){p.ko=Math.min(100,(p.ko||0)+wert);p.fit=Math.max(RE.fitnessMin,p.fit-RKT.sommer.sonderFrische);}} /* K12c: Kondition +wert, Frische − sonderFrische */
  else if(w.art==='konditionAlle')squad(S.my).filter(q=>!(q.inj>0)).forEach(q=>{q.ko=Math.min(100,(q.ko||0)+wert);q.fit=Math.max(RE.fitnessMin,q.fit-RKT.lagerFreizeit.frische);}); /* K11j: Zusatzeinheit im Lager für alle Gesunden */
  else if(w.art==='urlaubVerlaengern'){if(p&&p.team===S.my&&p.lsp){p.lsp.bis+=wert;p.lsp.uv=1;p.sb=Math.max(0,(p.sb||0)-RKT.urlaubVerlaengern.erholung);}} /* K12d: wert Tage länger weg, weniger Saisonbelastung */
  else if(w.art==='leihe'){erfolg=false;if(!frei('leihe'))txt='Die Leihen führt noch der Verein.'; /* Lizenz wie beim Ausleihen von Hand (Prüfung EE1) */
    else if(p&&b.verein!=null&&p.team===b.verein){const f=ausleihen(p);if(f)txt=f;else erfolg=true;}else if(p)txt=`${p.n} ist nicht mehr zu haben.`;} /* K17b: Leihe über ausleihen (leihe.js), mit allen ihren Prüfungen */
  else if(w.art==='selbstvertrauen'){if(p&&p.team===S.my)svAendern(p,wert);} /* K03b */
  else if(w.art==='pause'){if(p&&p.team===S.my){p.fit=Math.min(100,p.fit+wert);p.sp=Math.max(0,(p.sp||0)-RKT.training.pauseSpielpraxis);}} /* K07c: Frische +wert, etwas Spielpraxis weg */
  else if(w.art==='dritter'){if(p&&p.team===b.verein&&b.mit){const m=p.ld3&&p.ld3.s===S.season&&p.ld3.t===S.my?p.ld3:null;p.ld3={s:S.season,t:S.my,v:b.verein,mit:b.mit.slice(),leise:Math.max(wert||0,m?m.leise:0)};}} /* K30c: Merker für den Ausgang (dritterKauf) */
  else if(w.art==='nachlass'){if(!p||p.team!==b.verein||p.wech)txt=`${p?p.n:'Der Spieler'} ist nicht mehr zu haben.`; /* K30c: wert > 0 senkt die Forderung um diesen Anteil, wert < 0 (aufgeflogen) kostet Beziehung */
    else if(wert>0){const v=verhandlung(p),f=rundeAb(forderungDu(p)*(1-wert)),h=absTag(S.tag);v.nlF=Math.max(nachlassFaktor(v)<1?1-nachlassFaktor(v):0,wert);v.nlBis=h+RKT.nachlass.tage;v.nlMy=S.my;v.nl=1; /* Prüfung FA1: Faktor mit Frist und Verein statt eines festen Betrags */if(v.einig){const e=v.einig,z=bonusWert(e.bonus)+(e.tausch?e.tausch.w:0);e.fee=Math.max(0,Math.min(e.fee,z?rundeAb(f-z):f));}if(p.ld3)p.ld3.leise=1;} /* FH4: mit Bonus oder Tausch zählt der ganze angerechnete Wert */ /* EF3: auch eine schon vereinbarte Ablöse; nl: kein Verhandlungsgerücht nur wegen des Nachlasses (EF1) */
    else if(wert<0){bezDuAendern(b.verein,wert,c.titel);if(p.ld3)p.ld3.leise=0;}}
  else if(w.art==='hygiene'){const t=myT(),h=absTag(S.tag);t.krankBis=Math.min(t.krankBis||0,h-1);t.hygBis=h+wert;} /* K10e: Ansteckung vorbei, wert Tage weniger Krankheiten (RMD.krankheit.hygiene) */
  else if(w.art==='spezialist'){if(p&&p.team===S.my&&p.inj>0&&p.vl&&p.vl.q!=='krankheit')p.vl.rfF=wert;else{erfolg=false;if(p)txt=`${p.n} braucht keine Reha mehr.`;}} /* K10e: Rückfallrisiko nach der Rückkehr × wert */
  else if(w.art==='gruppeStimmung'){const g=p?(grueppchen(S.my).find(l=>l.includes(p))||(p.team===S.my?[p]:[])):[];g.forEach(x=>stimmungAendern(x,wert));} /* K14e: alle im Grüppchen des Beteiligten (zerfallen: nur er) */
  else if(w.art==='transferliste'){erfolg=false;if(!frei('transfers'))txt='Die Transfers führt noch der Verein.';else if(autoB('transfers'))txt='Die Transfers führt der Stab, er entscheidet über die Liste.'; /* Prüfung EG1: der Stab würde die Liste wieder räumen */
    else if(p&&p.team===S.my&&(p.wech||p.leihe))txt=`Bei ${p.n} geht das gerade nicht.`;else if(p&&p.team===S.my){if(S.unv)delete S.unv[p.id];p.list=1;p.ask=Math.max(RM.runden,rundeAb(value(p)*wert));erfolg=true;news(`${p.n} steht für ${fmt(p.ask)} auf der Transferliste.`);}else if(p)txt=`${p.n} ist nicht mehr da.`;} /* K14e: wie setListed, Forderung wert × Marktwert */
  else if(w.art==='zurueckrudern'){let n=0;presseS().aussagen.forEach(a=>{if(!a.ok&&a.art==='ankuendigung'&&a.gegner===b.verein){a.ok=1;n++;}});if(!n){erfolg=false;txt='Die Kampfansage ist schon erledigt.';}} /* K29l: Kampfansage zurückgenommen, nach dem Spiel weder Kult noch Häme */
  else if(w.art==='svAlle')squad(S.my).forEach(x=>svAendern(x,wert)); /* K11f: Selbstvertrauen des ganzen Kaders */
  else if(w.art==='stabHolen'){const x=(S.stab||[]).find(y=>y.id===b.stab);if(x){if(!(wert>0))x.gefragt=1;else{ /* Lernstufe wie beim Einstellen von Hand (Prüfung EP1, EQ1: wie darf, ein freier Bereich in der Automatik gehört danach dir) */
    if(!frei('stab')){erfolg=false;txt='Den Trainerstab führt noch der Verein.';}else if(x.team>=0){x.gefragt=1;erfolg=false;txt=x.team===S.my?`${x.n} ist schon in deinem Stab.`:`${x.n} hat inzwischen anderswo zugesagt.`;} /* ER6 */
    else if(stabVon(S.my,x.r).length>=RST.rollen[x.r].plaetze){erfolg=false;txt=`Der Platz als ${RST.rollen[x.r].name} ist inzwischen besetzt.`;}
    else{if(S.lizenz&&S.lizenz.auto&&S.lizenz.auto.stab)delete S.lizenz.auto.stab;aufgabe('vertragOderStab');x.gefragt=1;stabAnstellen(x); /* Lizenz-Aufgabe zählt wie beim Einstellen von Hand (ER5) */txt=`${x.n} ist jetzt ${RST.rollen[x.r].name} (${fmt(x.sal)} pro Jahr).`;}}}} /* gefragt nur nach einer Antwort, die ihn nicht mehr betrifft (EQ1) */ /* K16e: wert 1 holt den Ex-Spieler in deinen Stab wie stabEinstellen (zwei Jahre), wert 0 fragt nur; beides merkt x.gefragt */
  else if(w.art==='stabStreit'){if(wert>0)[b.stab,b.stab2].forEach(id=>{const x=(S.stab||[]).find(y=>y.id===id);if(x&&x.team===S.my)x.streitBis=absTag(S.tag)+wert;});} /* K16f: beide wert Tage schwächer (stabStreitFaktor) */
  else if(w.art==='fanGespraech'){if(!frei('fangespraech')){erfolg=false;txt='Das Gespräch mit den Fans führt noch der Verein.';}else if(!fanGespraechFrei()){erfolg=false;txt='Du warst erst vor kurzem bei den Fans.';}else txt=fanGespraechText(fanGespraechWirkung(myT()));} /* K27h: wie der Knopf im Stadion, Lernstufe wie dort */
  else if(w.art==='chefWeg'||w.art==='chefHalten'){const x=(S.stab||[]).find(y=>y.id===b.stab),v=b.verein!=null?S.teams[b.verein]:null;if(x&&x.team===S.my)karteChef(x,v,w.art==='chefWeg',wert);} /* K16g */
  else if(w.art==='lagerEnde'){const l=lagerAktiv(S.tag);if(l&&(b.lager==null||l.von===b.lager)&&l.bis>S.tag){l.bis=S.tag;lagerAbschluss(l,true);}} /* FP8: Meldung und Marketing auch bei vorzeitiger Abreise */ /* K11g: früher abreisen, das Lager endet heute, bezahlt ist es schon */
  else if(w.art==='punktabzug'){const tid=b.verein;if(tid!=null&&tid!==S.my&&S.teams[tid]&&wert>0){const A=S.abzug||(S.abzug={}),a=A[S.season]||(A[S.season]={});a[tid]=(a[tid]||0)+wert;S.skandal3=S.season;}} /* S.skandal3: Saison des letzten Abzugs (ER2) */ /* K30g: Punktabzug in dieser Saison wie nach einer Insolvenz (S.abzug, saison.js table), nie dein Verein */
  else if(w.art==='bauAuflage'){const c=S.constr;if(c&&c.phase==='genehmigung'&&(b.bau==null||c.ab===b.bau))c.auflage=wert;} /* K26f, Prüfung EO4: Lärmschutz bezahlt, die Auflagen beim Baubeginn (Anteil der Kosten) werden wert, also 0 */
  else if(w.art==='bauVerzug'){const c=S.constr;if(c&&c.phase==='genehmigung'&&wert>0&&(b.bau==null||c.ab===b.bau)){c.klage=(c.klage||0)+wert;c.bis+=wert*7;}} /* K26f: Genehmigung wert Wochen später (c.klage, stadion.js), nur das Projekt, um das es ging */
  else if(w.art==='standardGegner'){S.stdGegen={tid:S.my,bis:absTag(S.tag)+RKT.standard.tage};if(S.std&&S.std.t===S.my)S.std.k=1;} /* K06e: Gegner stellen sich auf deine Standards ein (taktik.js), einmal je Halbserie */
  else if(w.art==='wettsperre'){if(p&&p.team>=0&&p.team<1000&&p.team!==S.my&&!p.zwP){const s=sperren(p),K=RKT.skandal;s.liga.rot+=K.sperreLiga;s.pokal.rot+=K.sperrePokal;}} /* K30f: Sperre. Nie ein Spieler deines Kaders in der Zweiten (zwP, Prüfung EJ2). Ohne Transferliste, die räumte der Markt nach einer Woche (EJ1) */
  else if(w.art==='vertrauenHalt')S.trustHalt={tid:S.my,s:S.season,bis:absTag(S.tag)+wert,min:S.trust}; /* K30e, K28 §8: Vertrauen wert Tage nicht unter dem heutigen (vorstandPruefen) */
  if(w.dann&&erfolg&&KARTEN_MIT_ERFOLG.includes(w.art)){const t=w.dann.map(x=>kartenWirkung(x,b,c)).filter(Boolean);txt=[w.gut||'',...t].filter(Boolean).join(' ');}
  return txt;}
const KARTEN_MIT_ERFOLG=['leihe','gehaltAnpassen','provisionZahlen','spezialist','transferliste','zurueckrudern','stabHolen']; // Wirkungen, die melden, ob sie geklappt haben (für dann)
const KARTEN_WIRKUNGEN=['stimmung','stimmungAlle','zusammenhalt','glaub','vertrauen','ruf','bezDu','geld','fans','verpflichten','interesse','angebot','maezen','merch','jobwechsel','pause','talent','jugendHoch','jugendWeg','stabWeg','stabHalten','preisRichtwert','gehaltAnpassen','beraterBez','zuschuss','sonderschicht','leihe','selbstvertrauen','provisionZahlen','dritter','nachlass','hygiene','spezialist','gruppeStimmung','transferliste','zurueckrudern','vertrauenHalt','svAlle','wettsperre','standardGegner','bauVerzug','stabHolen','bauAuflage','punktabzug','lagerEnde','stabStreit','chefWeg','chefHalten','fanGespraech','zuschauer','integration','deutsch','uebertrieben','konditionAlle','urlaubVerlaengern'];
// Standard-Spezialisten (K06e, taktik.js taktikWirkung): Faktor auf Tore nach Ecken und Freistoßflanken deines Vereins, solange sich die Gegner darauf eingestellt haben
const standardGegnerFaktor=t=>t&&t.id===S.my&&S.stdGegen&&S.stdGegen.tid===S.my&&S.stdGegen.bis>=absTag(S.tag)?RKT.standard.faktor:1;
// Ausgang des lachenden Dritten (K30 §8.3, K17 §5.4, K30c): Unterschreibt der Spieler bei dir (aktionen.js offer, vor dem Abschluss), sinkt die Beziehung zwischen den beiden
// anderen Vereinen um RKT.dritter.zwischen, deine zu ihnen um RKT.dritter.du, nach geschicktem Vorgehen (leise) gar nicht. Nur in derselben Saison, vom selben Verein, für deinen Verein.
function dritterKauf(p,von){const m=p&&p.ld3;if(!m)return;delete p.ld3;if(m.s!==S.season||m.t!==S.my||m.v!==von||!m.mit||m.mit.length<2)return;const L=RKT.dritter,[a,b]=m.mit,g=`lachender Dritter: ${p.n}`;
  bezAendern(a,b,L.zwischen,g);if(!m.leise){bezDuAendern(a,L.du,g);bezDuAendern(b,L.du,g);}
  news(`Der lachende Dritte: ${p.n} unterschreibt bei dir. ${tn(a)} und ${tn(b)} geben sich gegenseitig die Schuld.${m.leise?' Von deiner Rolle ahnt keiner etwas.':' Auf dich sind beide nicht gut zu sprechen.'}`,'');}
// Höchstes Ansehen eines Vereins, der dir einen Job anbietet: dieselbe Mitte wie die Jobangebote nach einer Entlassung (saison.js mkJobs) plus jobangebot.rufSpanne
const jobangebotGrenze=()=>{const J=RV.jobs;return myT().rep-J.ansehenAbschlag+(ruf()-RV.ruf.start)*RV.ruf.jobsJePunkt+RV.jobangebot.rufSpanne;};
// Vereinswechsel (saison.js takeJob, vor dem Wechsel): offene Karten entscheidet der Co-Trainer noch für den alten Verein, sie wandern nicht mit (Prüfung DQ3)
// Schlüssel der Sperre je Karte: Spieler (mit dem Verein dazu, also Karte:Spieler:Verein, Prüfung FB1), sonst Mitarbeiter (mit stab2 das ganze Paar, Prüfung EZ1), sonst Verein (Prüfung ED3, EE3). Als Funktion seit Prüfung FA5, damit der Test ihn prüfen kann.
const kartenSchluessel=(c,b)=>[c.id,b.spieler!=null?b.spieler:b.stab!=null?'s'+b.stab+(b.stab2!=null?'+'+b.stab2:''):'',b.stab==null&&b.verein!=null?b.verein:''].join(':');
/* ziel: der Verein, zu dem du wechselst. Ein offenes Angebot genau dieses Vereins (K16g) gilt dann nicht mehr (Prüfung EZ3) */
let KARTEN_ZIEL=null;
function kartenJobwechsel(ziel){const K=S.karten;if(!K)return;KARTEN_ZIEL=ziel==null?null:ziel;try{K.offen.slice().forEach(k=>{const c=karteVon(k.id);if(c)kartenEntscheiden(k,c.auto,'spaet');});}finally{KARTEN_ZIEL=null;}K.offen=[];K.kette=[];} /* Ketten enden mit dem Verein (K30c) */
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
function karteStab(x,v,weg,wert){const K=RKT.stab,R0=RST.rollen[x.r],rolle=R0.name;
  if(weg){if(R0.pflicht&&stabVon(S.my,x.r).length<=1){news(`${x.n} bleibt, ohne ihn hättest du keinen ${rolle} mehr.`,'');return;} /* Pflichtrolle erst beim Entscheiden prüfen (Prüfung ED4) */
    if(v&&v.id===KARTEN_ZIEL){news(`${x.n} bleibt, du wechselst selbst zu ${v.name}.`,'');return;} /* Prüfung FA3 wie EZ3 */
    if(!v||!aktiv(v)||stabVon(v.id,x.r).length>=R0.plaetze){news(`${x.n} bleibt doch, ${v?v.name:'der Verein'} hat keinen Platz mehr.`,'');return;}
    const a=Math.min(Math.round(x.sal*K.abloese/1000)*1000,Math.max(0,v.cash));x.team=v.id;x.wiv=0;if(a){money('Stab: Ablöse',a);v.cash-=a;}stabGeaendert();news(`${x.n} (${rolle}) wechselt zu ${v.name}${a?`, Ablöse ${fmt(a)}`:''}.`,'tr');return;}
  const neu=Math.round(x.sal*(1+wert)/1000)*1000;if(!rahmenErlaubt(myT(),neu-x.sal)){news(`Der Vorstand gibt die Gehaltserhöhung für ${x.n} nicht frei (Gehaltsrahmen).`,'');karteStab(x,v,true,0);return;} /* ED4 */
  x.sal=neu;news(`${x.n} (${rolle}) bleibt, für ${fmt(x.sal)} im Jahr.`,'');}
// Co-Trainer wird Cheftrainer (K16g): weg = ziehen lassen (Ablöse wie K16c, er übernimmt den Verein, dessen Nachfolger geht zurück in den Pool),
// sonst halten mit Gehalt + wert (Gehaltsrahmen; gibt der Vorstand es nicht frei, geht er doch). Ohne zweiten Co-Trainer oder ohne gültiges Angebot bleibt er.
function karteChef(x,v,weg,wert){const K=RKT.stab,C=K.chef,rolle=RST.rollen[x.r].name;
  if(!weg){const neu=Math.round(x.sal*(1+wert)/1000)*1000;if(rahmenErlaubt(myT(),neu-x.sal)){x.sal=neu;news(`${x.n} (${rolle}) bleibt, für ${fmt(x.sal)} im Jahr.`,'');return;}
    news(`Der Vorstand gibt die Gehaltserhöhung für ${x.n} nicht frei (Gehaltsrahmen).`,'');}
  if(stabVon(S.my,x.r).length<=1){news(`${x.n} bleibt, ohne ihn hättest du keinen ${rolle} mehr.`,'');return;}
  if(!v||v.id===S.my||!aktiv(v)||v.id===KARTEN_ZIEL){news(`${x.n} bleibt, das Angebot gilt nicht mehr.`,'');return;} /* EZ3: du wechselst selbst zu diesem Verein */
  trainerS();const alt=trainerGeht(v,0),c=mitStrom(strom('trainerpool',S.season,S.tag,'co',x.id),()=>trainerNeu(v.rep-C.rufAbschlag,v.id));c.n=x.n;c.co=1;if(x.age!=null)c.alter=x.age;v.chef=c.id;v.stil=c.stil; /* EZ5: sein Alter */
  const a=Math.min(Math.round(x.sal*K.abloese/1000)*1000,Math.max(0,v.cash));if(a){money('Stab: Ablöse',a);v.cash-=a;}S.stab=S.stab.filter(y=>y!==x);stabGeaendert();
  news(`${x.n} wird Cheftrainer bei ${v.name}${a?`, Ablöse ${fmt(a)}`:''}.${alt?` ${alt.n} war dort nur wenige Tage im Amt.`:''}`,'tr');}
function kartenLog(c,tag,wahl,auto,stumm){const K=karten();K.log.push({id:c.id,s:S.season,tag,wahl,auto});if(K.log.length>RKT.log)K.log.splice(0,K.log.length-RKT.log);if(!stumm)sammlungMerken(c);} /* FM7: stumme Karten sieht niemand, sie zählen nicht zur Sammlung */
// ---------- Sammlung über alle Karrieren (K30 §5.4, K30h) ----------
// Welche Karten du schon erlebt hast, im Browser unter RKT.sammlung.schluessel, getrennt vom Spielstand und über alle Karrieren: {id: Zahl}. Gezählt wird jede Karte,
// die in dein Kartenprotokoll kommt (auch die der Automatik). Ohne Browser-Speicher (privates Fenster) gilt sie nur bis zum Neuladen. Kein Zufall, keine Meldung, kein Spielstand.
let SAMMLUNG=null;
function sammlungLaden(){if(SAMMLUNG)return SAMMLUNG;try{const x=JSON.parse(localStorage.getItem(RKT.sammlung.schluessel)||'{}');SAMMLUNG=x&&typeof x==='object'?x:{};}catch(e){SAMMLUNG={};}return SAMMLUNG;}
function sammlungMerken(c){if(!c||!c.id)return;const m=sammlungLaden();m[c.id]=(m[c.id]||0)+1;try{localStorage.setItem(RKT.sammlung.schluessel,JSON.stringify(m));}catch(e){}}
// Anzeige (Statistik, Seite Sammlung): erlebt von allen je Seltenheitsstufe, die erlebten Karten mit Titel, Bereich und Zahl. Unbekannte bleiben verborgen.
function sammlungAnsicht(){const m=sammlungLaden(),N=RKT.sammlung.stufen,st=c=>c.stufe&&N[c.stufe]?c.stufe:'haeufig',alle=KARTEN,da=alle.filter(c=>m[c.id]);
  const zeilen=Object.keys(N).map(k=>{const l=alle.filter(c=>st(c)===k),e=l.filter(c=>m[c.id]).length;return l.length?`<tr><td>${esc(N[k])}</td><td class="num">${e} von ${l.length}</td></tr>`:'';}).join('');
  const liste=da.slice().sort((a,b)=>Object.keys(N).indexOf(st(b))-Object.keys(N).indexOf(st(a))||a.titel.localeCompare(b.titel,'de')).map(c=>`<tr><td>${esc(c.titel)}</td><td class="dim">${esc(N[st(c)])}${c.bereich?`, ${esc(c.bereich)}`:''}</td><td class="num">${m[c.id]}×</td></tr>`).join('');
  return`<div class="grid"><div class="card"><h3>Sammlung: ${da.length} von ${alle.length} Ereignissen erlebt</h3><p class="dim">Über alle Karrieren in diesem Browser, getrennt vom Spielstand. Gelegentliche kommen etwa alle ${RKT.seltenheit.gelegentlich} Saisons, seltene alle ${RKT.seltenheit.selten}, sehr seltene alle ${RKT.seltenheit.sehrSelten}.</p>
    <table><tbody>${zeilen}</tbody></table></div><div class="card"><h3>Schon erlebt</h3>${liste?`<div class="tw"><table><tbody>${liste}</tbody></table></div>`:'<p class="dim">Noch keine Ereigniskarte.</p>'}</div></div>`;}

// ---------- Anzeige im Büro ----------
function kartenKarte(){const K=S.karten;if(!K||!K.offen.length||S.fired)return'';
  return K.offen.map((k,n)=>{const c=karteVon(k.id);if(!c)return'';return`<div class="card"><h2>${esc(c.titel)}</h2><p>${esc(k.text)}</p><div class="opts">${c.optionen.map((o,i)=>`<button class="opt" onclick="karteWaehlen(${n},${i})"${lzAus('ereignisse')}><b>${esc(o.text)}</b>${i===c.auto?'<span>Voreinstellung des Co-Trainers</span>':''}</button>`).join('')}</div>
    <p class="dim">Ohne deine Antwort entscheidet der Co-Trainer vor dem nächsten Spieltag.</p>${lzHinweis('ereignisse')}</div>`;}).join('');}
