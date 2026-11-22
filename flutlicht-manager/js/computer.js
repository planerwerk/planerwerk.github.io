// Computer-Vereine (Konzept K31, U11a): Kaderplan mit Planstellen, Bedarf, Verkaufs- und Kaufregeln, Transferbudget je Fenster.
// Alle Zahlen stehen in daten/regeln.js unter REGELN.computer (Kurzform RCV). ACHTUNG: U11a entstand ohne Testlauf (K31 §5.6), tests/welt.js ist noch nie gelaufen.
// Die Regeln gelten für jeden Verein, dessen Transfers nicht du führst (stabMacht(tid,'transfers')): alle Computer-Vereine und dein Verein in der Automatik (K36).
// Im Spielstand neu: am Verein t.tb = {k: Saison und Fenster, b: Budget, a: ausgegeben, n: Zugänge über den Markt, f: Planstellen aufgefüllt, s: Sternejagd erledigt}
// und t.profil (zweites Vereinsprofil, U11b). Verträge nach Rang seit U11c (vertragChance, kiVertraegeFrueh, dazu newSeason in js/saison.js).
// Leihen unter Computer-Vereinen seit U11d1 (§5.9: kiLeihbar, kiLeihKandidat, kiLeihe), mit dem Leihkontingent aus js/leihe.js.
// Vorstand und Trainerwechsel der Computer-Vereine seit U11d2 (§5.10: kiVorstandWoche, kiTrainerWechsel, kiVorstandSaison), am Verein t.vor, Protokoll S.trainerWechsel.
// Präsident und Formel des Vertrauens in js/vorstand.js (U12a).
// Noch nicht gebaut: Klugheit (§5.4), Vorverträge und Klauseln unter Computer-Vereinen, Trainerpool mit Namen, Gehaltsrahmen (§3.3).

// ---------- Vereinsprofile (K31 §3.2, §5.7, U11b) ----------
// Bis zu zwei Profile. „ehrgeizig“ folgt aus der Lage (unter den Ersten nach Ansehen in seiner Liga, oder in der ersten Saison nach einem Aufstieg) und wird nicht gespeichert.
// Das zweite steht am Verein (t.profil): beim Aufbau der Welt gelost oder aus daten/vereine.js.
function vereinsProfile(t){const l=[],E=RCV.profile.ehrgeizigBis[t.lg];if((E&&t.expPos<=E)||(t.lastLg&&t.lg<t.lastLg))l.push('ehrgeizig');if(t.profil&&RCV.profile.werte[t.profil])l.push(t.profil);return l;}
// Wert einer Stellschraube für einen Verein: das erste seiner Profile, das sie setzt, sonst der Standard
const profilWert=(t,k,std)=>{for(const n of vereinsProfile(t)){const v=RCV.profile.werte[n][k];if(v!=null)return v;}return std;};
// Aufbau der Welt (eigener Zufallsstrom, damit die übrige Welt gleich bleibt)
function profileAufbau(){S.teams.forEach((t,i)=>{const k=(VEREINE[i]&&VEREINE[i].profil)||waehleGewichtet(RCV.profile.gewichte);if(k!=='kein')t.profil=k;});}
// Qualitätsziele eines Vereins (ehrgeizig: 1 strenger)
function planQualitaet(t){const d=profilWert(t,'qualitaet',0),Q=RCV.qualitaet;return{stamm:Q.stamm+d,herausforderer:Q.herausforderer+d,ergaenzung:Q.ergaenzung+d};}

// ---------- Kaderplan (K31 §3.1) ----------
// Sechs Planstellen-Gruppen aus den 14 feinen Positionen (Schiene zählt zu den Außenverteidigern)
function planGruppe(p){return RCV.gruppeVon[feinPos(p)]||RCV.gruppeVon[STD_POS[p.pos]]||'ZM';}
// Planstellen und Stammplätze je Gruppe: Mittel aus dem Standard und dem Doppelten der Plätze in der Grundordnung (die Ordnung verschiebt den Plan nur leicht), Torwart fest.
// Das ergibt bei jeder Grundordnung zusammen 24 Planstellen.
function planSoll(t){const P=RCV.planstellen,n={},soll={},stamm={};slotsVerein(t).forEach(pos=>{const g=RCV.gruppeVon[pos];if(g)n[g]=(n[g]||0)+1;});
  RCV.gruppen.forEach(g=>{stamm[g]=n[g]||0;soll[g]=g==='TW'?P.TW:Math.round((P[g]+2*stamm[g])/2);});return{soll,stamm};}
// Rang nach dem Platz in der Gruppe (nach Stärke): so viele Stammspieler wie Plätze in der Grundordnung, ebenso viele Herausforderer, der Rest der Planstellen Ergänzung, darüber Überhang
const planRang=(G,i)=>i<G.stamm?'stamm':i<Math.min(G.soll,2*G.stamm)?'herausforderer':i<G.soll?'ergaenzung':'ueber';
// Kaderstärke wie teamLevel (Schnitt der besten 14), nur für einen schon gesammelten Kader
const kaderNiveau=sq=>{const s=sq.map(p=>p.str).sort((a,b)=>b-a).slice(0,RP.niveauSpieler);return s.length?s.reduce((a,b)=>a+b,0)/s.length:RP.niveauLeer;};
// Der Plan eines Vereins. niveau: Anspruch = Kaderstärke, mindestens die Grundstärke nach dem Ansehen (so baut ein Verein wieder auf, dessen Kader unter seinen Rang gefallen ist).
// gr: je Gruppe Soll, Stammplätze und die Spieler nach Stärke. rang: je Spieler stamm, herausforderer, ergaenzung, talent oder ueber.
// abgabe: wen der Verein nach §5.2 abgeben würde (Spielernummer → Grund). talente: Spieler bis talentBis, die nicht Stammspieler sind.
function kaderplan(t,kader){const sq=kader||squad(t.id),Q=planQualitaet(t),talentSoll=profilWert(t,'talente',RCV.talente),{soll,stamm}=planSoll(t),niveau=Math.max(kaderNiveau(sq),grundStaerke(t.rep)),gr={},rang=new Map(),abgabe=new Map(),jung=[];
  RCV.gruppen.forEach(g=>{gr[g]={g,soll:soll[g],stamm:stamm[g],l:[]};});sq.forEach(p=>gr[planGruppe(p)].l.push(p));
  RCV.gruppen.forEach(g=>{const G=gr[g];G.l.sort((a,b)=>b.str-a.str||a.id-b.id);G.l.forEach((p,i)=>{const r=planRang(G,i);rang.set(p.id,r);if(r==='ueber'&&p.age<=RCV.talentBis)jung.push(p);});});
  // Überzählige junge Spieler besetzen die Talent-Planstellen (die mit dem größten Talent zuerst) und sind kein Überhang
  jung.sort((a,b)=>b.pot-a.pot||a.id-b.id).slice(0,talentSoll[1]).forEach(p=>rang.set(p.id,'talent'));
  // Abgabe (§5.2): Regel B zuerst (die Gruppe hat mehr Spieler als Planstellen), dann ein Grund A: Wechselwunsch ab Stufe 3, Überhang, oder deutlich zu schwach für seinen Rang (nie der Stammspieler)
  RCV.gruppen.forEach(g=>{const G=gr[g];if(G.l.length<=G.soll)return;
    G.l.forEach(p=>{const r=rang.get(p.id);if(r==='talent')return;
      const grund=(p.ww||0)>=3?'wechselwunsch':r==='ueber'?'ueberhang':r!=='stamm'&&p.str<niveau-Q[r]-RCV.verkauf.unterPlanstelle?'schwach':null;if(grund)abgabe.set(p.id,grund);});});
  return{t,alle:sq,niveau,Q,talentSoll,gr,rang,abgabe,talente:sq.filter(p=>p.age<=RCV.talentBis&&rang.get(p.id)!=='stamm').length};}

// ---------- Bedarf (K31 §5.1) ----------
// Liste der Lücken, die dringendste zuerst. Je Eintrag: g Gruppe (null beim Talent), grund, prio (3 hoch, 2 mittel, 1 niedrig), rang der Planstelle,
// min: gesuchte Stärke (beim Talent: gesuchtes Talent), statt: der Spieler, der ersetzt werden soll.
function planBedarf(P){const Q=P.Q,B=RCV.bedarf,niveau=P.niveau,out=[];
  RCV.gruppen.forEach(g=>{const G=P.gr[g],n=G.l.length;
    if(n<G.soll){const r=planRang(G,n);out.push({g,grund:'offen',prio:3,rang:r,min:niveau-Q[r],luecke:G.soll-n});}
    for(let i=0;i<Math.min(G.stamm,n);i++){const p=G.l[i];
      if(p.str<niveau-Q.stamm-B.stammUnterZiel)out.push({g,grund:'schwach',prio:3,rang:'stamm',min:niveau-Q.stamm,statt:p,luecke:niveau-Q.stamm-p.str});
      else if(n<=G.soll){const ersatz=G.l[G.stamm]; // mit Überhang in der Gruppe ist der Ersatz schon da („eine Lücke, ein Kauf“)
        if(p.inj>B.verletztTage&&(!ersatz||ersatz.str<niveau-Q.herausforderer))out.push({g,grund:'verletzt',prio:2,rang:'herausforderer',min:niveau-Q.herausforderer,luecke:1});
        else if((p.ww||0)>=3)out.push({g,grund:'wechselwunsch',prio:2,rang:'stamm',min:niveau-Q.stamm,luecke:1});}}});
  if(P.talente<P.talentSoll[0])out.push({g:null,grund:'talent',prio:1,rang:'talent',min:niveau-Q.stamm,luecke:P.talentSoll[0]-P.talente});
  return out.sort((a,b)=>b.prio-a.prio||b.luecke-a.luecke);}

// ---------- Geld (K31 §3.3, Minimalmodell) ----------
// Nummer des offenen Fensters in REGELN.transfers.fenster (0 Sommer, 1 Winter), sonst −1
function fensterNr(tag=S.tag){const k=mmtt(tag);return RTR.fenster.findIndex(([a,b])=>k>=a&&k<=b);}
// Transferbudget: einmal am Anfang des Fensters aus dem Konto festgelegt. Danach zählt nur noch, was ausgegeben und durch Verkäufe eingenommen wurde.
// So entscheidet dein Verein in der Automatik genau wie als Computer-Verein, auch wenn die laufende Buchhaltung anders ist (tests/lizenz.js, Gleichschritt).
function kiBudget(t,nr){const k=S.season*10+nr;if(!t.tb||t.tb.k!==k)t.tb={k,b:Math.max(0,Math.round(t.cash*RCV.finanzen.budgetAnteil[nr]*profilWert(t,'budget',1))),a:0,n:0};return t.tb;}
// Budget nutzen (§5.1): In den letzten Wochen des Fensters sinkt die gesuchte Stärke, solange mehr als 40 % des Budgets übrig sind
function kiSenkung(tb){const B=RCV.bedarf,ende=fensterEnde();if(ende==null||tb.a>=tb.b*(1-B.budgetRestAb))return 0;return Math.max(0,B.endspurtWochen-Math.floor((ende-S.tag)/7))*B.anspruchJeWoche;}
// Preis eines Spielers der Transferliste: Vereinswert des Verkäufers (K19 §5.1), aber ohne Aufschlag für den Stellenwert. Wer gehen darf, kostet höchstens den Marktwert.
const kiPreis=p=>Math.max(RP.marktwert.minimum,rundeAb(value(p)*Math.min(1,RTR.stellenwert[kaderRolle(p)]||1)*rlFaktor(p)*finanzFaktor(p.team)));
// Was der Käufer höchstens zahlt: sein Vereinswert nach der Planstelle (Stammplatz ×1,2, sonst ×1) statt nach dem schwächsten Stammspieler (K19 §5.1, Befund BC5)
const kiZahlt=(p,t,n)=>Math.max(RP.marktwert.minimum,rundeAb(value(p)*(n.rang==='stamm'?RTR.kauf.besser:RTR.kauf.gleich)*rlFaktor(p)*finanzFaktor(t.id)*profilWert(t,'zahlt',1)));
// Preis auf der Sternejagd (§5.2, außergewöhnliches Angebot): 150 % des Marktwerts × Restlaufzeit, mindestens die Forderung, die auch du hören würdest (K19 §5.1)
const kiSternPreis=p=>Math.max(RP.marktwert.minimum,rundeAb(Math.max(forderungBasis(p),value(p)*RCV.verkauf.angebotAb*rlFaktor(p))));

// ---------- Verkauf (K31 §5.2): die Transferliste ----------
// Auf der Liste steht, wer Grund A hat und wessen Gruppe danach noch voll ist (Regel B). Alle anderen kommen von der Liste.
// Nicht angefasst werden vereinbarte Wechsel, geliehene Spieler und Profis, die ein anderer Verein in seine Zweite abgestellt hat.
function kiListe(P){const klein=P.alle.length<=RM.verkaeufer.kaderMin;
  P.alle.forEach(p=>{if(p.wech||p.leihe||p.zwP)return;if(!klein&&P.abgabe.has(p.id)){p.list=1;p.ask=kiPreis(p);}else if(p.list){p.list=0;p.ask=0;}});}

// ---------- Kauf (K31 §5.3) ----------
// Bester Kandidat für eine Lücke: Vereinslose und Spieler der Transferliste anderer Vereine. Er passt in die Gruppe, hat die gesuchte Stärke, will zu diesem Verein,
// der Preis passt ins Budget und zum Vereinswert des Käufers, und beim Verkäufer gilt Regel B noch in diesem Moment.
// Auswahl nach Stärke (bei Jungen zählt ein Teil des Talents, ab 30 ein Abzug) mit einem Schätzfehler aus dem Markt-Strom.
function kiKandidat(t,n,rest,senk,kader,plan){const K=RCV.kauf,min=n.min-senk,alterMax=profilWert(t,'alterMax',K.alterMax),talentGewicht=profilWert(t,'talentGewicht',K.talentGewicht),altMalus=profilWert(t,'altMalus',K.altMalus);let best=null,bv=-Infinity;
  for(const p of S.pl){if(p.team===t.id||p.team<-1||p.wech||p.leihe||p.zwP||p.age>alterMax)continue;
    const von=p.team>=0?S.teams[p.team]:null;
    if(p.team>=0&&(!p.list||!von||!aktiv(von)||!stabMacht(von.id,'transfers')))continue;
    // Ein Vereinsloser geht nicht weit nach unten: höchstens Grundstärke des Käufers + kauf.vereinslosBis, etwas enger als beim Auffüllen (T1.3). Ohne die Grenze unterschrieben
    // starke Vereinslose bei Drittligisten (bis 16 über deren Grundstärke), und die unteren Ligen wurden über die Saisons stärker.
    if(!von&&p.str>grundStaerke(t.rep)+(K.vereinslosBis!=null?K.vereinslosBis:RCV.fuellen.vereinslosBis))continue;
    if(n.grund==='talent'){if(p.age>RCV.talentBis||p.pot<min)continue;}
    else if(planGruppe(p)!==n.g||p.str<min||(n.statt&&p.str<=n.statt.str))continue;
    let preis=0;
    if(von){if(von.rep-t.rep>K.ansehenMinus&&(p.ww||0)<3)continue; // er geht nicht weit nach unten, außer er will weg
      if(bez(t.id,von.id)<RBZ.wirkung.gespraechUnter)continue; // mit diesem Verein redet der Käufer nicht (K17 §7, U12c)
      if(kader.get(von.id).length<=RM.verkaeufer.kaderMin||!plan(von).abgabe.has(p.id))continue;
      preis=kiPreis(p);if(preis>rest||preis>kiZahlt(p,t,n))continue;}
    const v=(n.grund==='talent'?p.pot:p.str+(p.age<=K.jungBis?(p.pot-p.str)*talentGewicht:0)-Math.max(0,p.age-K.altAb)*altMalus)+(R()-0.5)*2*RCV.schaetzFehler;
    if(v>bv){bv=v;best={p,preis,von:von?von.id:null};}}
  return best;}
// Sternejagd (§5.3, U11b): der stärkste bezahlbare Spieler eines kleineren Vereins, der nicht auf der Liste stehen muss. Er ist deutlich stärker als der Anspruch des Käufers
// und bekäme dort einen Stammplatz. Sein Verein nimmt das außergewöhnliche Angebot an, auch wenn ihm danach eine Planstelle fehlt (die Ersatzsuche folgt aus dem Bedarf).
function kiStern(t,P,rest,kader){const J=RCV.sterneJagd;let best=null,bv=-Infinity;
  for(const p of S.pl){if(p.team<0||p.team===t.id||p.wech||p.leihe||p.zwP||p.age>J.alterMax||p.str<P.niveau+J.ueberNiveau)continue;
    const von=S.teams[p.team];if(!von||!aktiv(von)||!stabMacht(von.id,'transfers')||t.rep-von.rep<J.ansehenPlus||kader.get(von.id).length<=RM.verkaeufer.kaderMin)continue;
    if(bez(t.id,von.id)<RBZ.wirkung.gespraechUnter)continue; // kein Gespräch unter −50 (K17 §7, U12c)
    const G=P.gr[planGruppe(p)],letzter=G.stamm?G.l[G.stamm-1]:null;if(!G.stamm||(letzter&&p.str<=letzter.str))continue;
    const preis=kiSternPreis(p);if(preis>rest)continue;
    const v=p.str+(R()-0.5)*2*RCV.schaetzFehler;if(v>bv){bv=v;best={p,preis,von:von.id};}}
  return best;}
// Der Wechsel selbst: Geld, Kabine, Vertrag. Vereinslose kommen ohne Ablöse und ohne Meldung (außer bei dir). art: 'stern' bei der Sternejagd (nur für Auswertungen, tests/welt.js).
function kiWechsel(p,b,preis,art){const von=p.team>=0?S.teams[p.team]:null;
  if(von){if(b.id===S.my)money('Transfers',-preis);else b.cash-=preis;
    if(von.id===S.my){money('Transfers',preis);vertragEnde(p);}else von.cash+=preis;
    kabineAbgang(p,von.id);S.offers=S.offers.filter(o=>o.pid!==p.id);news(`Wechsel perfekt: ${p.n} geht für ${fmt(preis)} von ${von.name} zu ${b.name}.`,'tr');
    bezAendern(von.id,b.id,RBZ.anlass.kiWechsel,`Transfer ${p.n}`);} // zum Listenpreis, also fair (K17 §12 Nr. 8, U12c)
  else if(b.id===S.my)stabMeldung(`Der Verein hat den vereinslosen ${p.n} verpflichtet.`);
  p.team=b.id;p.list=0;p.ask=0;p.ct=riA(RM.neuerVertrag);p.sal=salaryFor(p.str);p.seit=absTag(S.tag);p.abl=preis;neuzugang(p,b.id);
  if(von)statTransfer(p,preis,von.id,b.id);} // Rekordtransfer und Vereinsrekorde (K34 §5.6, U13)

// ---------- Leihen unter Computer-Vereinen (K31 §5.9, U11d1) ----------
// Leihbar: höchstens alterMax Jahre, im Kaderplan seines Vereins Überhang (Ausbildungsverein: auch Talent), gesund, kein vereinbarter Wechsel, nicht geliehen, nicht in der Zweiten.
// Der Verleiher behält mehr als markt.verkaeufer.kaderMin Spieler. Regel B gilt von selbst: Überhang und Talente liegen über den Planstellen.
function kiLeihbar(p,P){const L=RCV.leihe;return p.age<=L.alterMax&&!(p.inj>0)&&!p.wech&&!p.leihe&&!p.zwP&&P.alle.length>RM.verkaeufer.kaderMin&&profilWert(P.t,'leihRaenge',L.leihRaenge).includes(P.rang.get(p.id));}
// Bester Leihspieler für eine Lücke (nur Gründe aus leihe.gruende): passt in die Gruppe, hat die gesuchte Stärke und bekäme beim Leihverein mindestens einen Platz als Herausforderer
// (er will spielen). Der Verleiher ist ein Verein, dessen Leihen nicht du führst (dein Verein verleiht nie von selbst), und das Kontingent lässt die Leihe zu. Keine Ansehensgrenze.
function kiLeihKandidat(t,n,senk,plan,z){if(!n.g||!RCV.leihe.gruende.includes(n.grund))return null;const min=n.min-senk,G=plan(t).gr[n.g],platz=Math.min(G.soll,2*G.stamm);let best=null,bv=-Infinity;
  for(const p of S.pl){if(p.team<0||p.team===t.id||p.leihe||planGruppe(p)!==n.g||p.str<min||(n.statt&&p.str<=n.statt.str))continue;
    const von=S.teams[p.team];if(!von||!aktiv(von)||!stabMacht(von.id,'leihe')||bez(t.id,von.id)<RBZ.wirkung.gespraechUnter)continue; // kein Gespräch unter −50 (K17 §7, U12c)
    if(G.l.filter(x=>x.str>p.str).length>=platz)continue; // beim Leihverein säße er nur auf der Bank
    if(!kiLeihbar(p,plan(von))||!leihErlaubt(p,von.id,t.id,z))continue;
    const v=p.str+(R()-0.5)*2*RCV.schaetzFehler;if(v>bv){bv=v;best={p,von:von.id};}}
  return best;}
// Die Leihe selbst: bis zum Saisonende, ohne Gebühr, ohne Kaufoption und Rückruf. Computer-Vereine führen keine Gehaltsbuchhaltung (§3.3), der Anteil steht nur am Spieler.
// Keine Meldung unter Computer-Vereinen (K31 §12 Nr. 31). Rückkehr am Saisonende über leiheEnde (js/leihe.js).
// Seit T1.1 (vorläufig) leiht auch dein Verein in der Automatik (Bereich leihe mit Automatik, K36 Grundsatz 1): Holt er einen Spieler, zahlst du das Gehalt voll
// wie beim Ausleihen von Hand (U10d), verleiht er einen, zahlt der andere Verein seinen Anteil. Beides meldet der Verein im Posteingang.
function kiLeihe(p,b){const von=p.team;kabineAbgang(p,von);S.offers=S.offers.filter(o=>o.pid!==p.id);
  p.leihe={von,anteil:b.id===S.my?1:zahlBereit(p,b.id),rolle:'rotation',rueckruf:false,option:0,start:absTag(S.tag)};p.team=b.id;p.list=0;p.ask=0;neuzugang(p,b.id);
  if(b.id===S.my){kabineInit(p);rollenBerechnen(S.my);stabMeldung(`Der Verein hat ${p.n} bis zum Saisonende von ${tn(von)} ausgeliehen.`);}
  else if(von===S.my){rollenBerechnen(S.my);stabMeldung(`Der Verein hat ${p.n} bis zum Saisonende an ${b.name} verliehen.`);}}

// ---------- Vorstand und Trainerwechsel (K28 §7, K31 §5.5, §5.10, U11d2) ----------
// Präsident jedes Vereins (praesident) und die Formel des Vertrauens (vertrauenZiel) stehen seit U12a in js/vorstand.js, für dich und die Computer-Vereine.
// Vorstand eines Computer-Vereins am Verein: t.vor = {v Vertrauen, u Ligaspiele bei Beginn des Ultimatums (null = keins), n Nummer des Ultimatums, ab Ligaspiele beim Amtsantritt}
function kiVor(t){if(!t.vor)t.vor={v:RCV.vorstand.start,u:null,n:0,ab:0};return t.vor;}
// Ziel des Vertrauens aus der Tabellenzeile r und dem Platz pos: Sport (Platz gegen erwarteten Platz), Serie (letzte Ligaspiele), Finanzen (Konto im Minus)
function kiVertrauenZiel(t,r,pos){const V=RCV.vorstand;return vertrauenZiel(V,r,pos,t.expPos,t.cash<0?V.finanzMinus:0);}
// Entlassung nach einem gescheiterten ersten Ultimatum (K28 §5.3): 0,9 − 0,03 × Geduld
function kiEntlassChance(t){return entlassChance(t,RCV.vorstand.entlassung);}
// Woche (montags, eigener Strom): Vertrauen, Ultimatum, Entlassung. Nur Computer-Vereine der 1. bis 3. Liga, nur in der Spielzeit, ab dem fünften Ligaspiel.
function kiVorstandWoche(){if(S.phase!=='play')return;const V=RCV.vorstand,tab={};
  S.teams.forEach(t=>{if(t.id===S.my||!aktiv(t)||t.lg>3)return;const T=tab[t.lg]||(tab[t.lg]=table(t.lg)),i=T.findIndex(r=>r.id===t.id),r=T[i];if(!r||r.sp<V.abSpiel)return;
    const o=kiVor(t);o.v=Math.round((o.v+(kiVertrauenZiel(t,r,i+1)-o.v)*V.traegheit)*10)/10;
    if(o.u==null){if(o.v<V.grenze&&r.sp-o.ab>V.schonfrist){o.u=r.sp;o.n=1;}return;} // Ultimatum über die nächsten Ligaspiele
    if(r.sp-o.u<V.ultimatumSpiele)return;
    if(o.v>=V.grenze){o.u=null;o.n=0;return;} // überstanden
    if(o.n>=2||R()<kiEntlassChance(t))kiTrainerWechsel(t,r.sp);else{o.u=r.sp;o.n=2;}});} // sonst das zweite, letzte Ultimatum
// Der Wechsel: neuer Lieblingsstil (die Vertrautheit damit ist niedrig, vertrautheitWoche hat sie für alle anderen Stile gespeichert), Stimmungsschub, Vertrauen auf Start,
// Schonfrist ab sp Ligaspielen. Die Grundordnung wählt der Computer-Trainer wie bisher jeden Monat (kiOrdnung in training). Meldung nur aus deiner Liga („Großer Umbruch“, §8).
function kiTrainerWechsel(t,sp){const V=RCV.vorstand,w=trainerWechseln(t);t.stil=w.neu.stil; // Nachfolger aus dem Trainerpool mit seinem Lieblingsstil (K32 §3.3b, U18a)
  squad(t.id).forEach(p=>stimmungAendern(p,V.schub));t.vor={v:V.start,u:null,n:0,ab:sp};
  const l=S.trainerWechsel||(S.trainerWechsel=[]);l.push({s:S.season,tag:S.tag,t:t.id,lg:t.lg});if(l.length>V.protokoll)l.splice(0,l.length-V.protokoll);
  if(t.lg===myT().lg)news(`Großer Umbruch: ${t.name} trennt sich von ${w.alt?w.alt.n:'seinem Trainer'}. Nachfolger ${w.neu.n} setzt auf ${STIL_NAME[t.stil]||t.stil}.`,'tr');}
// Saisonwechsel (eigener Strom, vor Auf- und Abstieg): erwarteten Platz deutlich verfehlt und wenig Vertrauen, dann Wechsel im Sommer.
// Danach für alle: Vertrauen halb zurück zum Start, kein Ultimatum, Schonfrist neu (die Tabelle beginnt bei null).
function kiVorstandSaison(){const V=RCV.vorstand;S.teams.forEach(t=>{if(t.id===S.my||!aktiv(t)||t.lg>3)return;
  if(t.lastPos>t.expPos+V.saisonWeitAb&&kiVor(t).v<V.saisonUnter)kiTrainerWechsel(t,0);
  const o=kiVor(t);o.v=Math.round((o.v+(V.start-o.v)*V.saisonZurueck)*10)/10;o.u=null;o.n=0;o.ab=0;});}

// ---------- Sicherheitsnetz: offene Planstellen am Ende des Sommerfensters ----------
// Was der Markt nicht besetzt hat, füllt der Verein auf: zuerst der beste Vereinslose der Gruppe, sonst ein erzeugter Spieler der Gruppe (Stärke und Alter wie kaderAuffuellen am 1. Juli).
function planAuffuellen(t,P,liste){const Z=RS,F=RCV.fuellen,base=grundStaerke(t.rep),neu=[];
  RCV.gruppen.forEach(g=>{const G=P.gr[g];for(let have=G.l.length;have<G.soll&&liste.length<RM.kaeufer.kaderMax;have++){
      const fa=S.pl.filter(p=>p.team===-1&&planGruppe(p)===g&&p.str<=base+F.vereinslosBis).sort((a,b)=>b.str-a.str||a.id-b.id)[0];let p;
      if(fa&&R()<F.vereinslosChance){p=fa;p.team=t.id;p.list=0;p.ask=0;p.ct=riA(Z.vertrag.jahre);p.sal=salaryFor(p.str);p.seit=absTag(S.tag);p.abl=0;}
      else{const grob=RCV.grob[g],w={};Object.keys(RP.positionen[grob]).forEach(k=>{if(RCV.gruppeVon[k]===g)w[k]=RP.positionen[grob][k];});
        p=addP(mkPlayer({pos:grob,fp:waehleGewichtet(w),age:riA(Z.auffuellAlter),str:Math.round(base-Z.auffuellAbschlag+riA(Z.auffuellStreuung)),team:t.id}));}
      neuzugang(p,t.id);liste.push(p);neu.push(p);}});
  if(neu.length&&t.id===S.my)stabMeldung(`Der Verein hat den Kader ergänzt: ${neu.map(p=>p.n).join(', ')}.`);return neu.length;}

// ---------- Verträge nach Rang (K31 §4 Nr. 4, §5.8, U11c) ----------
// Chance, dass ein auslaufender Vertrag beim Saisonwechsel verlängert wird (die Zusage des Spielers eingeschlossen). P: Kaderplan seines Vereins, ohne Plan die alte Regel.
function vertragChance(p,P){const V=RCV.vertrag,r=P?P.rang.get(p.id):null;if(!r)return RS.vertrag.verlaengern;
  if(V.wichtig.includes(r))return V.altAb&&p.age>=V.altAb?V.chanceAlt:V.chanceWichtig;return r==='ergaenzung'&&p.age<V.ergaenzungBis?V.ergaenzung:V.sonst;} // ab altAb seltener (T1.3)
// Früh verlängern: Von Oktober bis Dezember bindet ein Verein jede Woche mit 15 % die Spieler mit auslaufendem Vertrag, die er braucht,
// bevor ab dem 1. Januar andere Vereine (und du) ihnen einen Vorvertrag geben dürfen (K21 §4.3). Laufzeit und Gehalt wie beim Saisonwechsel.
function kiVertraegeFrueh(kader){const V=RCV.vertrag,F=V.frueh,k=mmtt(S.tag);if(S.phase!=='play'||k<F.von||k>F.bis)return;
  S.teams.forEach(t=>{if(!aktiv(t)||!stabMacht(t.id,'vertraege'))return;const sq=kader.get(t.id)||[],P=kaderplan(t,sq);
    sq.forEach(p=>{if(p.ct!==1||p.wech||p.leihe||p.zwP||!V.wichtig.includes(P.rang.get(p.id))||(V.altAb&&p.age>=V.altAb)||R()>=F.chance)return; // ab altAb nicht früh (T1.3)
      p.ct=1+riA(RS.vertrag.jahre);p.sal=salaryFor(p.str);if(t.id===S.my)stabMeldung(`Der Verein hat den Vertrag von ${p.n} vorzeitig verlängert (bis Juni ${S.season+p.ct}).`);});});}

// ---------- Woche (montags im Markt-Strom, aufgerufen aus market in js/ablauf.js) ----------
// 1. Transferliste aller Vereine nach den Verkaufsregeln (auch außerhalb der Fenster, damit du sie siehst).
// 2. Im Fenster: Ein Teil der Vereine ist aktiv, in zufälliger Reihenfolge. Jeder kauft höchstens einen Spieler, für seine dringendste Lücke, die sich besetzen lässt.
// 3. In der letzten Woche des Sommerfensters: offene Planstellen auffüllen.
function kiMarkt(){const nr=fensterNr(),vereine=S.teams.filter(t=>aktiv(t)&&stabMacht(t.id,'transfers')),kader=new Map(S.teams.map(t=>[t.id,[]])),plaene=new Map();
  S.pl.forEach(p=>{const l=kader.get(p.team);if(l)l.push(p);});
  const plan=t=>{let x=plaene.get(t.id);if(!x){x=kaderplan(t,kader.get(t.id));plaene.set(t.id,x);}return x;};
  vereine.forEach(t=>kiListe(plan(t)));
  kiVertraegeFrueh(kader); // Herbst: Verträge der Gebrauchten früh verlängern (U11c), ändert keinen Kader
  if(nr<0)return;
  vereine.forEach(t=>kiBudget(t,nr)); // Budget aller Vereine vor dem ersten Wechsel des Fensters festlegen (nicht erst, wenn ein Verein an der Reihe ist oder verkauft)
  const K=RCV.kauf,L=RCV.leihe,dran=shuffle(vereine.filter(()=>R()<RCV.aktivJeWoche)),z=leihZaehler(); // z: Leihkontingent, bei jeder Leihe nachgeführt (U11d1)
  // Kaderlisten nachführen und die Pläne beider Vereine neu berechnen lassen
  const umzug=(p,von,nach)=>{kader.get(nach).push(p);plaene.delete(nach);if(von!=null){const l=kader.get(von),i=l.indexOf(p);if(i>=0)l.splice(i,1);plaene.delete(von);}};
  // Ein Zugang: Wechsel ausführen, Budget und Zähler des Käufers, Kaderlisten, Budget des Verkäufers
  const zugang=(t,tb,c,art)=>{kiWechsel(c.p,t,c.preis,art);tb.a+=c.preis;tb.n++;umzug(c.p,c.von,t.id);if(c.von!=null)kiBudget(S.teams[c.von],nr).b+=Math.round(c.preis*RCV.finanzen.reinvest);};
  // Eine Leihe (U11d1): zählt als Zugang der Woche und zur Obergrenze des Fensters, kostet kein Budget
  const leihe=(t,tb,c)=>{kiLeihe(c.p,t);leihZaehlen(z,c.p,c.von,t.id);tb.n++;umzug(c.p,c.von,t.id);};
  dran.forEach(t=>{if(t.id===S.my&&transferSperre())return;if(rahmenAnteil(t)>RFP.budget.sperreAb)return;const tb=kiBudget(t,nr),sq=kader.get(t.id);if(tb.n>=K.jeFenster[nr]||sq.length>=RM.kaeufer.kaderMax)return;
    // Sternejagd zuerst: ehrgeizige Vereine, einmal je Saison im Sommerfenster. Gelingt sie, war das der Zugang dieser Woche.
    if(nr===RCV.sterneJagd.fenster&&!tb.s&&vereinsProfile(t).includes('ehrgeizig')){const c=kiStern(t,plan(t),tb.b-tb.a,kader);if(c){tb.s=1;zugang(t,tb,c,'stern');return;}}
    // Je Lücke: bei „verletzt“ zuerst Leihe, dann Kauf; bei „offen“ zuerst Kauf, sonst Leihe (§5.9). Dein Verein leiht nur in der Automatik (Bereich leihe, seit T1.1).
    const senk=kiSenkung(tb),leiht=S.phase==='play'&&stabMacht(t.id,'leihe'); // nicht vor dem Saisonwechsel, sonst endete die Leihe sofort wieder
    for(const n of planBedarf(plan(t))){const zuerst=L.zuerst.includes(n.grund);
      const a=leiht&&zuerst?kiLeihKandidat(t,n,senk,plan,z):null;if(a){leihe(t,tb,a);break;}
      const c=kiKandidat(t,n,tb.b-tb.a,senk,kader,plan);if(c){zugang(t,tb,c);break;}
      const b=leiht&&!zuerst?kiLeihKandidat(t,n,senk,plan,z):null;if(b){leihe(t,tb,b);break;}}});
  const ende=fensterEnde();
  // Abwanderung ins Ausland einmal je Sommer in der letzten Woche des Fensters (K32 §8, T1.3, js/ausland.js): Die Sternejagd hat davor das ganze Fenster,
  // die Lücken schließt gleich danach das Auffüllen.
  if(nr===0&&ende!=null&&ende-S.tag<7&&S.abwanderung!==S.season){S.abwanderung=S.season;auslandAbwanderung(vereine).forEach(({p,von})=>{const l=kader.get(von),i=l?l.indexOf(p):-1;if(i>=0)l.splice(i,1);plaene.delete(von);});}
  if(nr===RCV.fuellen.fenster&&ende!=null&&ende-S.tag<7)vereine.forEach(t=>{const tb=kiBudget(t,nr);if(tb.f)return;tb.f=1;const l=kader.get(t.id);planAuffuellen(t,kaderplan(t,l),l);});}
