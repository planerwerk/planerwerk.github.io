// Werbeflächen (K24 §3.1, Teilschritt K24a): Trikotbrust, Ausrüster und Ärmel mit eigenen Angeboten, je Fläche höchstens ein Vertrag, zusammen geldneutral
// gegenüber der früheren Brust allein, Automatik je Fläche, erstes Angebot vor dem ersten Pflichtspiel, Geld je Spieltag, Laufzeit und Saisonwechsel,
// Jobwechsel, Sperre ohne Lizenz, eigener Zufallsstrom, Speichern und Laden, Anzeige. Aufruf: node tests/werbung.js. Nur Node.js.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711;
function welt(lernstufen){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';if(lernstufen)F.lizenzStart(true);F.setTarget();F.sponsOffers();
  S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);return{W,F,S,ev:W.ev};}

// 1. Angebote je Fläche, geldneutral: Die festen Beträge der drei Flächen ergeben zusammen den früheren Brustbetrag (Ansehen² × Ligawert), bis auf Rundung
{const {S,ev}=welt(false),t=ev('myT()'),SP=ev('RF').sponsor,alt=t.rep*t.rep*(SP['liga'+t.lg]||SP.liga3),A=SP.angebote;
  const fl=Object.keys(S.werbOffers||{}),summe=k=>S.sponsOffers[k].base+fl.reduce((a,f)=>a+S.werbOffers[f][k].base,0);
  const ok=fl.length===2&&fl.includes('ausruester')&&fl.includes('aermel')&&fl.every(f=>S.werbOffers[f].length===A.length)&&A.every((a,k)=>Math.abs(summe(k)-alt*a.fix)<=3000);
  const namen=fl.every(f=>S.werbOffers[f].every(o=>ev('RF').werbung.namen[f].includes(o.name)));
  pruef(ok&&namen,'Angebote: Ausrüster und Ärmel je drei, Namen aus der Liste, die festen Beträge aller drei Flächen ergeben zusammen den früheren Brustbetrag',`früher ${Math.round(alt)}, jetzt ${A.map((a,k)=>summe(k)).join(' / ')} (Soll ${A.map(a=>Math.round(alt*a.fix)).join(' / ')})`);}

// 2. Wahl: je Fläche höchstens ein Vertrag, die Angebote der Fläche sind danach weg, Meldung
{const {S,F}=welt(false);F.sponsorWaehlen(1);F.werbungWaehlen('ausruester',2);const w=S.werbung.ausruester;
  pruef(S.spons&&w&&w.yrs===3&&!S.werbOffers.ausruester&&S.werbOffers.aermel&&!S.werbung.aermel&&S.news.some(n=>n.t.includes('Werbevertrag (Ausrüster)'))&&F.werbungAusstehend(),
    'Wahl: Ausrüster vergeben (drei Jahre), Ärmel noch offen, Meldung im Posteingang',`${w&&w.name}, ${w&&w.yrs} Jahre`);
  F.werbungWaehlen('ausruester',0);pruef(S.werbung.ausruester===w,'Eine vergebene Fläche lässt sich nicht noch einmal vergeben');}

// 3. Automatik (K36): Mit Lernstufen wählt der Verein je Fläche sofort das höchste feste Angebot
{const {S,ev}=welt(true),fl=['ausruester','aermel'],A=ev('RF').sponsor.angebote,best=A.reduce((k,a,i)=>a.fix>A[k].fix?i:k,0);
  pruef(!S.sponsOffers&&!ev('werbungAusstehend()')&&fl.every(f=>S.werbung[f]&&S.werbung[f].yrs===A[best].jahre&&!S.werbung[f].win),'Automatik: alle Flächen sofort vergeben, je Fläche das höchste feste Angebot',fl.map(f=>S.werbung[f]&&S.werbung[f].name).join(', '));}

// 4. Ohne Wahl: Vor dem ersten Pflichtspiel nimmt der Vorstand je Fläche das erste Angebot (wie bei der Brust)
{const {W,F,S}=welt(false);let n=0;while(n<400&&S.res[ W.ev('myT()').lg ].filter(r=>r[0]===VEREIN||r[1]===VEREIN).length===0){n++;if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();}
  const A=W.ev('RF').sponsor.angebote;
  pruef(!F.werbungAusstehend()&&S.spons&&['ausruester','aermel'].every(f=>S.werbung[f]&&S.werbung[f].yrs===A[0].jahre),'Ohne Wahl: Vor dem ersten Pflichtspiel hat jede Fläche das erste Angebot',['ausruester','aermel'].map(f=>S.werbung[f]&&S.werbung[f].name).join(', '));
  // 5. Geld je Spieltag: Brust und die anderen Flächen werden bei jedem eigenen Ligaspiel gebucht
  const vor=S.fin['Sponsor']||0,erw=S.spons.base+Object.values(S.werbung).reduce((a,w)=>a+w.base,0),sieg=S.spons.win+Object.values(S.werbung).reduce((a,w)=>a+(w.win||0),0);
  let m=0;const spiele=()=>S.res[W.ev('myT()').lg].filter(r=>r[0]===VEREIN||r[1]===VEREIN).length,s0=spiele();
  while(m<100&&spiele()===s0){m++;if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();}
  const d=(S.fin['Sponsor']||0)-vor;pruef(d===erw||d===erw+sieg,'Geld: je eigenem Ligaspiel die festen Beträge aller Flächen (dazu Siegprämien)',`${d} (fest ${erw}${sieg?', mit Sieg '+(erw+sieg):''})`);}

// 6. Saisonwechsel: Laufzeiten zählen herunter, ausgelaufene Flächen bekommen neue Angebote
{const {S,F}=welt(false);F.sponsorWaehlen(0);F.werbungWaehlen('ausruester',2);F.werbungWaehlen('aermel',0);S.season++;F.werbungSaison();
  pruef(S.werbung.ausruester&&S.werbung.ausruester.yrs===2&&!S.werbung.aermel&&S.werbOffers.aermel&&S.werbOffers.aermel.length===3,'Saisonwechsel: drei Jahre werden zu zwei, der Einjahresvertrag läuft aus und die Fläche bekommt neue Angebote',`Ausrüster noch ${S.werbung.ausruester&&S.werbung.ausruester.yrs}, Ärmel ${S.werbung.aermel?'belegt':'frei'}`);}

// 7. Jobwechsel: Die Verträge gehören dem alten Verein
{const {S,F}=welt(false);F.werbungVorSpiel();F.werbungNeuerVerein();F.werbungOffen();
  pruef(!S.werbung.ausruester&&!S.werbung.aermel&&S.werbOffers.ausruester&&S.werbOffers.aermel,'Jobwechsel: alte Verträge weg, neue Angebote für alle Flächen');}

// 8. Lizenz: Ohne A-Lizenz ändert pickWerbung nichts (die Automatik hat schon gewählt, neue Angebote nach einem Jobwechsel bleiben beim Verein)
{const {S,F,ev}=welt(true);S.werbung={};S.werbOffers={};S.lizenz.auto={};F.werbungOffen();const vorher=JSON.stringify(S.werbung);
  ev('render=()=>{};save=()=>{};toast=()=>{};');F.pickWerbung('aermel',1);
  pruef(!ev("darf('sponsor')")&&JSON.stringify(S.werbung)===vorher,'Lizenz: Ohne die A-Lizenz bleibt die Wahl gesperrt',`Stufe ${S.lizenz.stufe}`);}

// 9. Eigener Strom: Angebote für die Flächen würfeln nicht im Grundstrom
{const {S,ev}=welt(false);S.werbOffers={};S.werbung={};const z0=JSON.stringify(S.zufall);ev('werbungOffen()');pruef(JSON.stringify(S.zufall)===z0,'Eigener Zufallsstrom: der Grundstrom bleibt unberührt');}

// 10. Speichern und Laden, Anzeige
{const {S,F,ev}=welt(false);F.werbungWaehlen('aermel',1);const kopie=JSON.parse(JSON.stringify(S));
  const karte=ev('werbungAngebotsKarte()'),vertr=ev('werbungVertraege()');
  pruef(kopie.werbung.aermel.name===S.werbung.aermel.name&&kopie.werbOffers.ausruester.length===3,'Speichern und Laden: Verträge und offene Angebote bleiben erhalten');
  pruef(karte.includes('Ausrüster')&&karte.includes('pickWerbung')&&!karte.includes('undefined')&&vertr.includes('Ärmel')&&vertr.includes('Trikotbrust')&&vertr.includes('Zusammen fest'),'Anzeige: Büro mit den Angeboten je Fläche, Finanzen mit allen Verträgen und der Summe');}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
