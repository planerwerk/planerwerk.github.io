// Marketing (K25 §5.4, K25a): Trikot mit Reaktion und Voreinstellung, Kampagnen mit Kosten je Liga und abnehmendem Ertrag, Faktor im Fanartikel-Erlös,
// Fanarbeit gegen Pfiffe, Fans-Bonus zum Saisonwechsel, Jugend-Camps nur in der Vorbereitung, Lizenz.
// Aufruf: node tests/marketing.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. K25a entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711,nah=(a,b,e=0.001)=>Math.abs(a-b)<=e;
function welt(lernstufen){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';if(lernstufen)F.lizenzStart(true);F.setTarget();F.sponsOffers();if(S.sponsOffers)F.sponsorWaehlen(0);
  S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);S.phase='play';W.ev('myT()').cash=20e6;return{W,F,S,ev:W.ev,t:W.ev('myT()')};}

// 1. Trikot: klassisch mit Faktor 0,95–1,05 und Fanstimmung +1, danach fest; mutig ergibt 0,8 oder 1,25 mit ±3
{const {F,S,t,ev}=welt(false),K=ev('RMK').fankultur,w=ev('fankulturWirkung')(t),pl=w*K.klassischPlus,fp=Math.round(w*K.klassischFans);t.fanU=0;F.trikotWaehlen('klassisch'); /* seit K25f mit Fankultur (vorher K25e Tradition) */const k=S.mk.trikot,fu=t.fanU;F.trikotWaehlen('mutig');const fest=S.mk.trikot.d==='klassisch';
  const w=welt(false);w.t.fanU=0;w.F.trikotWaehlen('mutig');const m=w.S.mk.trikot;
  pruef(k&&k.d==='klassisch'&&k.f>=0.95+pl-0.005-1e-9&&k.f<=1.05+pl+0.005+1e-9&&fu===1+fp /* ± 0,005: der Faktor wird auf zwei Stellen gerundet, der Zuschlag ist seit K25f stufenlos */&&fest&&m&&(m.f===0.8&&w.t.fanU===-3||m.f===1.25&&w.t.fanU===3),'Trikot: klassisch 0,95–1,05 und Fans +1, danach fest, mutig 0,8 oder 1,25 mit Fans ±3',`klassisch ${k&&k.f}, mutig ${m&&m.f}/${w.t.fanU}`);}

// K25f. Fankultur (K25 §5.6, ersetzt die Tradition nach Gründungsjahr aus K25e): Union, St. Pauli und Kaiserslautern über 60, Wolfsburg, Hoffenheim und RB Leipzig unter 50
// (Leipzig vor den beiden). Bei Leipzig bleibt das klassische Trikot bei 0,95–1,05 und Fans +1. Im Spiel veränderlich: doppelt so viele Plätze senken, doppelt so viele Mitglieder heben sie.
{const w=welt(false),V=w.ev('VEREINE'),fk=w.ev('fankultur'),T=k=>w.S.teams[V.findIndex(v=>v.kurz===k)],wert=k=>fk(T(k));
  const hoch=['FCU','STP','FCK'].every(k=>wert(k)>60),tief=['WOB','TSG','RBL'].every(k=>wert(k)<50),rbVor=wert('RBL')>wert('WOB')&&wert('RBL')>wert('TSG');
  const fck=T('FCK'),cap0=fck.cap,m0=fck.mitglieder,f0=fk(fck);fck.cap=cap0*2;const fGross=fk(fck);fck.cap=cap0;fck.mitglieder=m0*2;const fMitgl=fk(fck);fck.mitglieder=m0;
  const rb=V.findIndex(v=>v.kurz==='RBL');w.S.my=rb;const t2=w.ev('myT()');t2.fanU=0;w.S.mk=null;w.F.trikotWaehlen('klassisch');const k2=w.S.mk.trikot;
  pruef(hoch&&tief&&rbVor&&fGross<f0&&fMitgl>f0&&w.ev('fankulturWirkung')(t2)===0&&!!k2&&k2.f>=0.95&&k2.f<=1.05&&t2.fanU===1,'Fankultur: Union, St. Pauli, Kaiserslautern hoch, Wolfsburg, Hoffenheim, Leipzig tief, Stadion und Mitglieder wirken, Leipzig ohne Zuschlag',
    `${['FCU','STP','FCK','B04','SCF','RBL','WOB','TSG'].map(k=>k+' '+wert(k)).join(', ')}; Kaiserslautern ${f0}, doppeltes Stadion ${fGross}, doppelte Mitglieder ${fMitgl}; Leipzig Faktor ${k2&&k2.f}, Fans ${t2.fanU}`);}

// 2. Ohne Wahl: am Tag vor dem ersten Pflichtspiel nimmt der Verein das klassische
{const {F,S}=welt(false),e=F.ersterPflichttag(VEREIN);F.marketingTag(e-2);const vorher=!S.mk.trikot;F.marketingTag(e-1);
  pruef(vorher&&S.mk.trikot&&S.mk.trikot.d==='klassisch','Voreinstellung: am Tag vor dem ersten Pflichtspiel das klassische Trikot, vorher nichts');}

// 3. Kampagnen: Kosten je Liga, zweites Mal halbe Wirkung, Werbewert, Fans-Bonus zum Saisonwechsel
{const {F,S,t}=welt(false),f0=S.fin['Marketing']||0;F.kampagneStarten('fanwerbung');const k1=f0-(S.fin['Marketing']||0),ww1=S.mk.ww;S.mk.k.fanwerbung.bis=-1;F.kampagneStarten('fanwerbung');
  const fans=S.mk.fans,ww2=S.mk.ww,fans0=t.fans;F.marketingNeueSaison();
  pruef(k1===Math.round(200000*({1:1,2:0.4,3:0.2}[t.lg])/1000)*1000&&nah(fans,0.03)&&ww2>ww1&&t.fans===Math.round(fans0*1.03),'Kampagnen: Kosten nach Liga, zweites Mal halb (Fans +3 % statt +4 %), Werbewert steigt, Bonus zum Saisonwechsel',
    `Kosten ${k1}, Fans-Bonus ${fans}, Werbewert ${ww1} → ${ww2}, Anhänger ${fans0} → ${t.fans}`);}

// 4. Faktor im Fanartikel-Erlös: Trikot × Trikot-Kampagne
{const {F,S,t}=welt(false);F.trikotWaehlen('klassisch');S.mk.trikot.f=1.2;F.kampagneStarten('trikot');const f=F.merchFaktor(t);
  pruef(nah(f,1.2*1.15,0.0001)||f>1.2*1.15,'Fanartikel: Trikot 1,2 und Trikot-Kampagne +15 % (Lieblinge können dazukommen)',f.toFixed(3));}

// 5. Fanarbeit: Pfiffe wirken nur zu 70 %
{const {F,S,ev,t}=welt(false),p=ev('squad')(VEREIN)[0];t.fanst=20;p.sv=0;F.kampagneStarten('fanarbeit');F.fansHeimspiel({h:VEREIN,a:0,xpo:[[[p.id,'ZM',0.1,90]],[]]});
  pruef(nah(p.sv,-0.14,0.0001),'Fanarbeit: Pfiffe senken das Selbstvertrauen nur um 0,14 statt 0,2',p.sv);}

// 6. Jugend-Camps nur in der Vorbereitung; mit Lernstufen in der ersten Lizenz gesperrt
{const {F,S,ev}=welt(false),e=F.ersterPflichttag(VEREIN);S.tag=e+1;S.gespielt=e+1;F.kampagneStarten('camps');const spaet=!(S.mk&&S.mk.k.camps);
  const w=welt(true);w.F.kampagneStarten('fanwerbung');const gesperrt=!(w.S.mk&&w.S.mk.k.fanwerbung);
  pruef(spaet&&gesperrt,'Jugend-Camps nur in der Vorbereitung, Kampagnen erst ab der B-Lizenz');}

// 7. Karte „Trikot ausverkauft“ (K25b): Auslöser bei einem Spieler bis 20 mit 3 Ligatoren, Wirkung merch hebt den Fanartikel-Faktor vier Wochen um 20 %
{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=VEREIN;S.phase='play';const t=ev('myT()'),jung=ev('squad')(VEREIN).sort((a,b)=>a.age-b.age)[0];
  const ohne=ev('AUSLOESER').teenieStar();jung.age=19;jung.g=3;const mit=ev('AUSLOESER').teenieStar();const f0=F.merchFaktor(t);F.kartenWirkung({art:'merch',wert:0.2},{},{titel:'Test'});const f1=F.merchFaktor(t);
  S.tag+=29;const f2=F.merchFaktor(t);
  pruef(!!mit&&Math.abs(f1/f0-1.2)<1e-9&&Math.abs(f2-f0)<1e-9,'Karte „Trikot ausverkauft“: Auslöser und vier Wochen mehr Fanartikel',`ohne ${!!ohne}, mit ${!!mit}, Faktor ${f0.toFixed(3)} → ${f1.toFixed(3)} → ${f2.toFixed(3)}`);}

// K25c. Dauerkarten-Aktion (Sommer-Kampagne): hebt den Anteil der Dauerkarten (K27b) um 0,05, kostet nach Liga, geht nach dem Verkauf nicht mehr
{const {S,F,ev,t}=welt(false),C=ev('RMK').kampagnen.dauerkarten,a0=F.dkAnteil(t,0.2),c0=t.cash;F.kampagneStarten('dauerkarten');const a1=F.dkAnteil(t,0.2),kost=c0-t.cash;
  F.dkVerkauf(t);const c1=t.cash,n1=(S.mk.k.dauerkarten||{}).n;S.mk.k.dauerkarten.bis=-1;F.kampagneStarten('dauerkarten');const danach=t.cash===c1&&S.mk.k.dauerkarten.n===n1;
  pruef(Math.abs(a1-a0-C.dauerkarten)<1e-9&&kost===ev('kampagnenKosten')('dauerkarten')&&danach,'Dauerkarten-Aktion: Anteil höher, Kosten nach Liga, nach dem Verkauf nicht mehr',`Anteil ${a0.toFixed(3)} → ${a1.toFixed(3)}, Kosten ${kost}, danach gesperrt ${danach}`);}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
