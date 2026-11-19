// Computer-Vereine (Konzept K31, U11a): Kaderplan mit Planstellen, Bedarf, Verkaufs- und Kaufregeln, Transferbudget je Fenster.
// Alle Zahlen stehen in daten/regeln.js unter REGELN.computer (Kurzform RCV). ACHTUNG: U11a entstand ohne Testlauf (K31 §5.6), tests/welt.js ist noch nie gelaufen.
// Die Regeln gelten für jeden Verein, dessen Transfers nicht du führst (stabMacht(tid,'transfers')): alle Computer-Vereine und dein Verein in der Automatik (K36).
// Im Spielstand neu: am Verein t.tb = {k: Saison und Fenster, b: Budget, a: ausgegeben, n: Zugänge über den Markt, f: Planstellen aufgefüllt}.
// Noch nicht gebaut: Vereinsprofile und Sternejagd (§3.2, §5.3), Klugheit (§5.4), Verträge nach Rang (§4 Nr. 4), Leihen, Trainerwechsel (§5.5), Gehaltsrahmen (§3.3).

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
function kaderplan(t,kader){const sq=kader||squad(t.id),Q=RCV.qualitaet,{soll,stamm}=planSoll(t),niveau=Math.max(kaderNiveau(sq),grundStaerke(t.rep)),gr={},rang=new Map(),abgabe=new Map(),jung=[];
  RCV.gruppen.forEach(g=>{gr[g]={g,soll:soll[g],stamm:stamm[g],l:[]};});sq.forEach(p=>gr[planGruppe(p)].l.push(p));
  RCV.gruppen.forEach(g=>{const G=gr[g];G.l.sort((a,b)=>b.str-a.str||a.id-b.id);G.l.forEach((p,i)=>{const r=planRang(G,i);rang.set(p.id,r);if(r==='ueber'&&p.age<=RCV.talentBis)jung.push(p);});});
  // Überzählige junge Spieler besetzen die Talent-Planstellen (die mit dem größten Talent zuerst) und sind kein Überhang
  jung.sort((a,b)=>b.pot-a.pot||a.id-b.id).slice(0,RCV.talente[1]).forEach(p=>rang.set(p.id,'talent'));
  // Abgabe (§5.2): Regel B zuerst (die Gruppe hat mehr Spieler als Planstellen), dann ein Grund A: Wechselwunsch ab Stufe 3, Überhang, oder deutlich zu schwach für seinen Rang (nie der Stammspieler)
  RCV.gruppen.forEach(g=>{const G=gr[g];if(G.l.length<=G.soll)return;
    G.l.forEach(p=>{const r=rang.get(p.id);if(r==='talent')return;
      const grund=(p.ww||0)>=3?'wechselwunsch':r==='ueber'?'ueberhang':r!=='stamm'&&p.str<niveau-Q[r]-RCV.verkauf.unterPlanstelle?'schwach':null;if(grund)abgabe.set(p.id,grund);});});
  return{t,alle:sq,niveau,gr,rang,abgabe,talente:sq.filter(p=>p.age<=RCV.talentBis&&rang.get(p.id)!=='stamm').length};}

// ---------- Bedarf (K31 §5.1) ----------
// Liste der Lücken, die dringendste zuerst. Je Eintrag: g Gruppe (null beim Talent), grund, prio (3 hoch, 2 mittel, 1 niedrig), rang der Planstelle,
// min: gesuchte Stärke (beim Talent: gesuchtes Talent), statt: der Spieler, der ersetzt werden soll.
function planBedarf(P){const Q=RCV.qualitaet,B=RCV.bedarf,niveau=P.niveau,out=[];
  RCV.gruppen.forEach(g=>{const G=P.gr[g],n=G.l.length;
    if(n<G.soll){const r=planRang(G,n);out.push({g,grund:'offen',prio:3,rang:r,min:niveau-Q[r],luecke:G.soll-n});}
    for(let i=0;i<Math.min(G.stamm,n);i++){const p=G.l[i];
      if(p.str<niveau-Q.stamm-B.stammUnterZiel)out.push({g,grund:'schwach',prio:3,rang:'stamm',min:niveau-Q.stamm,statt:p,luecke:niveau-Q.stamm-p.str});
      else if(n<=G.soll){const ersatz=G.l[G.stamm]; // mit Überhang in der Gruppe ist der Ersatz schon da („eine Lücke, ein Kauf“)
        if(p.inj>B.verletztTage&&(!ersatz||ersatz.str<niveau-Q.herausforderer))out.push({g,grund:'verletzt',prio:2,rang:'herausforderer',min:niveau-Q.herausforderer,luecke:1});
        else if((p.ww||0)>=3)out.push({g,grund:'wechselwunsch',prio:2,rang:'stamm',min:niveau-Q.stamm,luecke:1});}}});
  if(P.talente<RCV.talente[0])out.push({g:null,grund:'talent',prio:1,rang:'talent',min:niveau-Q.stamm,luecke:RCV.talente[0]-P.talente});
  return out.sort((a,b)=>b.prio-a.prio||b.luecke-a.luecke);}

// ---------- Geld (K31 §3.3, Minimalmodell) ----------
// Nummer des offenen Fensters in REGELN.transfers.fenster (0 Sommer, 1 Winter), sonst −1
function fensterNr(tag=S.tag){const k=mmtt(tag);return RTR.fenster.findIndex(([a,b])=>k>=a&&k<=b);}
// Transferbudget: einmal am Anfang des Fensters aus dem Konto festgelegt. Danach zählt nur noch, was ausgegeben und durch Verkäufe eingenommen wurde.
// So entscheidet dein Verein in der Automatik genau wie als Computer-Verein, auch wenn die laufende Buchhaltung anders ist (tests/lizenz.js, Gleichschritt).
function kiBudget(t,nr){const k=S.season*10+nr;if(!t.tb||t.tb.k!==k)t.tb={k,b:Math.max(0,Math.round(t.cash*RCV.finanzen.budgetAnteil[nr])),a:0,n:0};return t.tb;}
// Budget nutzen (§5.1): In den letzten Wochen des Fensters sinkt die gesuchte Stärke, solange mehr als 40 % des Budgets übrig sind
function kiSenkung(tb){const B=RCV.bedarf,ende=fensterEnde();if(ende==null||tb.a>=tb.b*(1-B.budgetRestAb))return 0;return Math.max(0,B.endspurtWochen-Math.floor((ende-S.tag)/7))*B.anspruchJeWoche;}
// Preis eines Spielers der Transferliste: Vereinswert des Verkäufers (K19 §5.1), aber ohne Aufschlag für den Stellenwert. Wer gehen darf, kostet höchstens den Marktwert.
const kiPreis=p=>Math.max(RP.marktwert.minimum,rundeAb(value(p)*Math.min(1,RTR.stellenwert[kaderRolle(p)]||1)*rlFaktor(p)*finanzFaktor(p.team)));
// Was der Käufer höchstens zahlt: sein Vereinswert nach der Planstelle (Stammplatz ×1,2, sonst ×1) statt nach dem schwächsten Stammspieler (K19 §5.1, Befund BC5)
const kiZahlt=(p,t,n)=>Math.max(RP.marktwert.minimum,rundeAb(value(p)*(n.rang==='stamm'?RTR.kauf.besser:RTR.kauf.gleich)*rlFaktor(p)*finanzFaktor(t.id)));

// ---------- Verkauf (K31 §5.2): die Transferliste ----------
// Auf der Liste steht, wer Grund A hat und wessen Gruppe danach noch voll ist (Regel B). Alle anderen kommen von der Liste.
// Nicht angefasst werden vereinbarte Wechsel, geliehene Spieler und Profis, die ein anderer Verein in seine Zweite abgestellt hat.
function kiListe(P){const klein=P.alle.length<=RM.verkaeufer.kaderMin;
  P.alle.forEach(p=>{if(p.wech||p.leihe||p.zwP)return;if(!klein&&P.abgabe.has(p.id)){p.list=1;p.ask=kiPreis(p);}else if(p.list){p.list=0;p.ask=0;}});}

// ---------- Kauf (K31 §5.3) ----------
// Bester Kandidat für eine Lücke: Vereinslose und Spieler der Transferliste anderer Vereine. Er passt in die Gruppe, hat die gesuchte Stärke, will zu diesem Verein,
// der Preis passt ins Budget und zum Vereinswert des Käufers, und beim Verkäufer gilt Regel B noch in diesem Moment.
// Auswahl nach Stärke (bei Jungen zählt ein Teil des Talents, ab 30 ein Abzug) mit einem Schätzfehler aus dem Markt-Strom.
function kiKandidat(t,n,rest,senk,kader,plan){const K=RCV.kauf,min=n.min-senk;let best=null,bv=-Infinity;
  for(const p of S.pl){if(p.team===t.id||p.team<-1||p.wech||p.leihe||p.zwP||p.age>K.alterMax)continue;
    const von=p.team>=0?S.teams[p.team]:null;
    if(p.team>=0&&(!p.list||!von||!aktiv(von)||!stabMacht(von.id,'transfers')))continue;
    if(n.grund==='talent'){if(p.age>RCV.talentBis||p.pot<min)continue;}
    else if(planGruppe(p)!==n.g||p.str<min||(n.statt&&p.str<=n.statt.str))continue;
    let preis=0;
    if(von){if(von.rep-t.rep>K.ansehenMinus&&(p.ww||0)<3)continue; // er geht nicht weit nach unten, außer er will weg
      if(kader.get(von.id).length<=RM.verkaeufer.kaderMin||!plan(von).abgabe.has(p.id))continue;
      preis=kiPreis(p);if(preis>rest||preis>kiZahlt(p,t,n))continue;}
    const v=(n.grund==='talent'?p.pot:p.str+(p.age<=K.jungBis?(p.pot-p.str)*K.talentGewicht:0)-Math.max(0,p.age-K.altAb)*K.altMalus)+(R()-0.5)*2*RCV.schaetzFehler;
    if(v>bv){bv=v;best={p,preis,von:von?von.id:null};}}
  return best;}
// Der Wechsel selbst: Geld, Kabine, Vertrag. Vereinslose kommen ohne Ablöse und ohne Meldung (außer bei dir).
function kiWechsel(p,b,preis){const von=p.team>=0?S.teams[p.team]:null;
  if(von){if(b.id===S.my)money('Transfers',-preis);else b.cash-=preis;
    if(von.id===S.my){money('Transfers',preis);vertragEnde(p);}else von.cash+=preis;
    kabineAbgang(p,von.id);S.offers=S.offers.filter(o=>o.pid!==p.id);news(`Wechsel perfekt: ${p.n} geht für ${fmt(preis)} von ${von.name} zu ${b.name}.`,'tr');}
  else if(b.id===S.my)stabMeldung(`Der Verein hat den vereinslosen ${p.n} verpflichtet.`);
  p.team=b.id;p.list=0;p.ask=0;p.ct=riA(RM.neuerVertrag);p.sal=salaryFor(p.str);p.seit=absTag(S.tag);p.abl=preis;neuzugang(p,b.id);}

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

// ---------- Woche (montags im Markt-Strom, aufgerufen aus market in js/ablauf.js) ----------
// 1. Transferliste aller Vereine nach den Verkaufsregeln (auch außerhalb der Fenster, damit du sie siehst).
// 2. Im Fenster: Ein Teil der Vereine ist aktiv, in zufälliger Reihenfolge. Jeder kauft höchstens einen Spieler, für seine dringendste Lücke, die sich besetzen lässt.
// 3. In der letzten Woche des Sommerfensters: offene Planstellen auffüllen.
function kiMarkt(){const nr=fensterNr(),vereine=S.teams.filter(t=>aktiv(t)&&stabMacht(t.id,'transfers')),kader=new Map(S.teams.map(t=>[t.id,[]])),plaene=new Map();
  S.pl.forEach(p=>{const l=kader.get(p.team);if(l)l.push(p);});
  const plan=t=>{let x=plaene.get(t.id);if(!x){x=kaderplan(t,kader.get(t.id));plaene.set(t.id,x);}return x;};
  vereine.forEach(t=>kiListe(plan(t)));
  if(nr<0)return;
  vereine.forEach(t=>kiBudget(t,nr)); // Budget aller Vereine vor dem ersten Wechsel des Fensters festlegen (nicht erst, wenn ein Verein an der Reihe ist oder verkauft)
  const K=RCV.kauf,dran=shuffle(vereine.filter(()=>R()<RCV.aktivJeWoche));
  dran.forEach(t=>{const tb=kiBudget(t,nr),sq=kader.get(t.id);if(tb.n>=K.jeFenster[nr]||sq.length>=RM.kaeufer.kaderMax)return;
    const senk=kiSenkung(tb);
    for(const n of planBedarf(plan(t))){const c=kiKandidat(t,n,tb.b-tb.a,senk,kader,plan);if(!c)continue;
      kiWechsel(c.p,t,c.preis);tb.a+=c.preis;tb.n++;sq.push(c.p);plaene.delete(t.id);
      if(c.von!=null){const l=kader.get(c.von),i=l.indexOf(c.p);if(i>=0)l.splice(i,1);kiBudget(S.teams[c.von],nr).b+=Math.round(c.preis*RCV.finanzen.reinvest);plaene.delete(c.von);}
      break;}});
  const ende=fensterEnde();
  if(nr===RCV.fuellen.fenster&&ende!=null&&ende-S.tag<7)vereine.forEach(t=>{const tb=kiBudget(t,nr);if(tb.f)return;tb.f=1;const l=kader.get(t.id);planAuffuellen(t,kaderplan(t,l),l);});}
