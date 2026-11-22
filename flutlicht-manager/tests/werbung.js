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
  const ok=fl.length===2&&fl.includes('ausruester')&&fl.includes('aermel')&&fl.every(f=>S.werbOffers[f].length===A.length+1)&&S.sponsOffers.length===A.length+1&&A.every((a,k)=>Math.abs(summe(k)-alt*a.fix)<=3000);
  const U=ev('RF').werbung.umstritten,namen=fl.every(f=>S.werbOffers[f].every(o=>o.im==='umstritten'?U.namen.includes(o.name):ev('RF').werbung.namen[f].includes(o.name)));
  pruef(ok&&namen,'Angebote: Ausrüster und Ärmel je drei (dazu seit K24b je ein umstrittenes, auch bei der Brust), Namen aus den Listen, die festen Beträge aller drei Flächen ergeben zusammen den früheren Brustbetrag',`früher ${Math.round(alt)}, jetzt ${A.map((a,k)=>summe(k)).join(' / ')} (Soll ${A.map(a=>Math.round(alt*a.fix)).join(' / ')})`);}

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
  pruef(S.werbung.ausruester&&S.werbung.ausruester.yrs===2&&!S.werbung.aermel&&S.werbOffers.aermel&&S.werbOffers.aermel.length===4,'Saisonwechsel: drei Jahre werden zu zwei, der Einjahresvertrag läuft aus und die Fläche bekommt neue Angebote',`Ausrüster noch ${S.werbung.ausruester&&S.werbung.ausruester.yrs}, Ärmel ${S.werbung.aermel?'belegt':'frei'}`);}

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
  pruef(kopie.werbung.aermel.name===S.werbung.aermel.name&&kopie.werbOffers.ausruester.length===4,'Speichern und Laden: Verträge und offene Angebote bleiben erhalten');
  pruef(karte.includes('Ausrüster')&&karte.includes('pickWerbung')&&!karte.includes('undefined')&&vertr.includes('Ärmel')&&vertr.includes('Trikotbrust')&&vertr.includes('Zusammen fest'),'Anzeige: Büro mit den Angeboten je Fläche, Finanzen mit allen Verträgen und der Summe');}

// ---------- K24b: umstrittene Geldgeber, Sponsorentag, Werbewert ----------
// 11. Das vierte Angebot jeder Fläche (auch der Brust) ist umstritten: 30 % über dem besten festen Angebot, zwei Jahre, ohne Siegprämie
{const {S,ev}=welt(false),U=ev('RF').werbung.umstritten,A=ev('RF').sponsor.angebote,best=l=>Math.max(...l.filter(o=>o.im!=='umstritten').map(o=>o.base));
  const listen={brust:S.sponsOffers,...S.werbOffers},ok=Object.entries(listen).every(([f,l])=>{const u=l[A.length];return u&&u.im==='umstritten'&&!u.win&&u.yrs===U.jahre&&Math.abs(u.base-best(l)*U.faktor)<=2000&&l.slice(0,A.length).every(o=>o.im!=='umstritten');});
  pruef(ok,'Umstritten: je Fläche (Brust, Ausrüster, Ärmel) ein viertes Angebot, 30 % über dem besten festen, zwei Jahre, ohne Siegprämie',Object.entries(listen).map(([f,l])=>`${f} ${l[A.length]&&l[A.length].base} gegen ${best(l)}`).join(', '));}

// 12. Die Automatik meidet umstrittene Geldgeber (K24 §7), der Vorstand nimmt ohne Wahl das erste Angebot (nie das umstrittene)
{const {S}=welt(true),{S:S2,F:F2}=welt(false);F2.sponsorWaehlen(0);F2.werbungVorSpiel();
  pruef(S.spons&&S.spons.im!=='umstritten'&&Object.values(S.werbung).every(w=>w.im!=='umstritten')&&S2.spons.im!=='umstritten'&&Object.values(S2.werbung).every(w=>w.im!=='umstritten'),'Automatik und Vorstand nehmen nie den umstrittenen Geldgeber');}

// 13. Unterschrift beim umstrittenen Geldgeber: Fans −5 (Baustein Entscheidungen), an jedem Monatsersten −1 je laufendem umstrittenen Vertrag
{const {S,F,ev}=welt(false),U=ev('RF').werbung.umstritten,t=ev('myT()'),A=ev('RF').sponsor.angebote;S.phase='play';const d0=t.fanD||0;F.werbungWaehlen('aermel',A.length);const d1=t.fanD||0;
  F.sponsorWaehlen(A.length);const d2=t.fanD||0;let tag=S.tag+1;while(ev('mmtt')(tag).slice(3)!=='01')tag++;ev('werbungTag')(tag);const d3=t.fanD||0;ev('werbungTag')(tag+1);const d4=t.fanD||0;
  pruef(Math.abs(d1-d0-U.fans)<0.01&&Math.abs(d2-d1-U.fans)<0.01&&Math.abs(d3-d2-2*U.fansMonat)<0.01&&d4===d3&&S.news.some(n=>n.t.includes('Die Fans murren')),'Fans: −5 je umstrittener Unterschrift, −1 je Vertrag am Monatsersten, sonst nichts',`${d0} → ${d1} → ${d2} → ${d3} → ${d4}`);}

// 14. Skandal: zum Saisonwechsel mit etwa 5 % je umstrittenem Vertrag (eigener Strom), Fans −10, danach kostenlos kündbar; die Fläche bekommt neue Angebote
{const {S,F,ev}=welt(false),U=ev('RF').werbung.umstritten,A=ev('RF').sponsor.angebote,t=ev('myT()');let n=0,versuche=0,kuendigung=null;ev('render=()=>{};save=()=>{};toast=()=>{};');
  for(let k=0;k<400;k++){S.werbung={};S.werbOffers={};S.werbOffers.aermel=ev("werbAngebote('aermel')");F.werbungWaehlen('aermel',A.length);S.werbung.aermel.yrs=5;S.season++;const vor=t.fanD||0;ev('werbSkandale()');versuche++;
    if(S.werbung.aermel.skandal){n++;if(!kuendigung){const fans=(t.fanD||0)-vor;const z0=JSON.stringify(S.zufall);F.werbungKuendigen('aermel');kuendigung={fans,frei:!S.werbung.aermel&&S.werbOffers.aermel&&S.werbOffers.aermel.length===A.length+1,z:JSON.stringify(S.zufall)===z0};}}}
  pruef(n/versuche>=0.02&&n/versuche<=0.09&&kuendigung&&Math.abs(kuendigung.fans-U.skandalFans)<0.01&&kuendigung.frei&&S.news.some(x=>x.t.includes('Skandal um')),'Skandal: etwa 5 % je Saison, Fans −10, danach kostenlos kündbar, die Fläche bekommt neue Angebote',`${n} von ${versuche} (${(100*n/versuche).toFixed(1)} %), Kündigung ${JSON.stringify(kuendigung)}`);
  const {S:S3,F:F3}=welt(false);F3.werbungWaehlen('aermel',0);ev('render=()=>{};save=()=>{};');const vorher=JSON.stringify(S3.werbung);F3.werbungKuendigen('aermel');
  pruef(JSON.stringify(S3.werbung)===vorher,'Ohne Skandal lässt sich ein Werbevertrag nicht kündigen');}

// 15. Sponsorentag in drei Größen (seit 22.11.): Kosten nach Größe und Liga, Zuschlag in der Spanne der Größe gewürfelt, alle offenen Angebote mit demselben Zuschlag,
// nur ein Text als Rückmeldung (passend zur Lage in der Spanne, keine Zahl), nur einmal je Saison, ohne offene Angebote nichts
{const T=ev0=>ev0('RF').werbung.sponsorentag;let ok=true;const txt=[];
  for(const k of ['klein','mittel','gross']){const {S,F,ev}=welt(false),St=T(ev).stufen[k],t=ev('myT()');ev('render=()=>{};save=()=>{};toast=()=>{};');const c0=t.cash,b0=S.sponsOffers[0].base,u0=S.werbOffers.ausruester[0].base;
    F.sponsorenTag(k);const q=S.sponsOffers[0].base/b0,qu=S.werbOffers.ausruester[0].base/u0,e=S.sponsorTagErg,n=S.news[0].t,pos=(q-1-St.plus[0])/(St.plus[1]-St.plus[0]);F.sponsorenTag('klein');
    const gut=c0-t.cash===St.kosten&&q>=1+St.plus[0]-0.01&&q<=1+St.plus[1]+0.01&&Math.abs(q-qu)<0.02&&n.startsWith(T(ev).texte[e.stufe])&&!/\d+ ?%/.test(n)&&Math.abs(e.stufe-Math.min(2,Math.floor(Math.max(0,Math.min(0.999,pos))*3)))<=1&&S.sponsorTag===S.season;
    if(!gut)ok=false;txt.push(`${k}: −${c0-t.cash} €, ×${q.toFixed(3)}, „${n.slice(0,40)}…“`);}
  const {ev:ev3}=welt(false);ev3('myT()').lg=2;const halb=ev3("sponsorTagKosten('gross')");ev3('myT()').lg=3;const viertel=ev3("sponsorTagKosten('gross')");
  const {S:S2,F:F2,ev:ev2}=welt(false);ev2('render=()=>{};save=()=>{};toast=()=>{};');F2.sponsorWaehlen(0);F2.werbungVorSpiel();const c3=ev2('myT()').cash;F2.sponsorenTag('gross');
  pruef(ok&&halb===25000&&viertel===13000&&ev2('myT()').cash===c3,'Sponsorentag: drei Größen (5.000, 25.000, 50.000 € in der 1. Liga, 2. Liga die Hälfte, 3. ein Viertel), Zuschlag gewürfelt in der Spanne, nur ein Text ohne Zahl, einmal je Saison, ohne offene Angebote nichts',txt.join(' | ')+`, 2. Liga ${halb}, 3. Liga ${viertel}`);}
// 15b. Über viele Saisons trifft der Wurf alle drei Texte, und der Zuschlag bleibt in der Spanne
{const {S,F,ev}=welt(false),St=ev('RF').werbung.sponsorentag.stufen.mittel;ev('render=()=>{};save=()=>{};toast=()=>{};');const stufen=[0,0,0];let min=9,max=0;
  for(let i=0;i<60;i++){S.season++;S.sponsOffers=[{name:'X',base:1000000,win:0,yrs:1,info:''}];F.sponsorenTag('mittel');const q=S.sponsOffers[0].base/1e6-1;min=Math.min(min,q);max=Math.max(max,q);stufen[S.sponsorTagErg.stufe]++;}
  pruef(stufen.every(x=>x>=8)&&min>=St.plus[0]-0.001&&max<=St.plus[1]+0.001,'Sponsorentag über 60 Saisons: alle drei Texte kommen vor, der Zuschlag bleibt in der Spanne (mittel 7–10 %)',`Texte ${stufen.join('/')}, Zuschlag ${(min*100).toFixed(1)}–${(max*100).toFixed(1)} %`);}

// 16. Werbewert (K25): über dem Startwert bessere Angebote, darunter schlechtere, höchstens ±15 %, am Startwert neutral
{const {S,ev}=welt(false),W=ev('RF').werbung.werbewert,start=ev('myT()').rep*ev('RMK').werbewert.startJeAnsehen,f=ww=>{S.mk={s:S.season,ww};return ev('werbFaktor()');};
  const neutral=f(start),plus=f(start+10),viel=f(start+100),minus=f(start-100);delete S.mk;const ohne=ev('werbFaktor()');
  pruef(neutral===1&&Math.abs(plus-(1+10*W.jePunkt))<1e-9&&Math.abs(viel-(1+W.max))<1e-9&&Math.abs(minus-(1-W.max))<1e-9&&ohne===1,'Werbewert: am Startwert und ohne Marketing neutral, +10 Punkte = +4 %, höchstens ±15 %',`${neutral}, ${plus.toFixed(3)}, ${viel}, ${minus}, ohne ${ohne}`);}

// 17. Lizenz: Sponsorentag und Kündigung sind ohne A-Lizenz gesperrt
{const {S,F,ev}=welt(true);ev('render=()=>{};save=()=>{};toast=()=>{};');S.lizenz.auto={};S.werbOffers={aermel:ev("werbAngebote('aermel')")};const c=ev('myT()').cash;F.sponsorenTag();
  pruef(ev('myT()').cash===c&&S.sponsorTag!==S.season,'Lizenz: Ohne A-Lizenz kein Sponsorentag');}

// ---------- K24c: Zufriedenheit, Verlängerung, Abstiegsklausel ----------
const sm0=(S,pos,target,ab)=>({pos,target,down:ab?[S.my]:[],down2:[],down3:[],rel:null,rel2:null});
// 18. Zufriedenheit zum Saisonende: +5 je Platz über dem Ziel (höchstens ±25), Abstieg −20, Grenzen 0 bis 100
{const {S,F,ev}=welt(false),Z=ev('RF').werbung.zufriedenheit;F.sponsorWaehlen(2);F.werbungVorSpiel();ev('myT()').fanst=ev('RFS').start;
  ev('werbungSaisonende')(sm0(S,5,8,false));const z1=S.spons.z,za=S.werbung.aermel.z;ev('werbungSaisonende')(sm0(S,18,4,false));const z2=S.spons.z;
  pruef(z1===Z.start+3*Z.jePlatz&&za===z1&&z2===z1-Z.erfolgMax,'Zufriedenheit: drei Plätze über dem Ziel +15, weit darunter höchstens −25, für alle Flächen gleich',`${Z.start} → ${z1} → ${z2}`);}

// 19. Abstiegsklausel: Verträge, die in die nächste Saison reichen, zahlen nach einem Abstieg 40 % weniger; auslaufende bleiben
{const {S,F,ev}=welt(false),Z=ev('RF').werbung.zufriedenheit;F.sponsorWaehlen(2);F.werbungWaehlen('aermel',0);F.werbungWaehlen('ausruester',2);
  const b0=S.spons.base,a0=S.werbung.aermel.base,u0=S.werbung.ausruester.base;ev('werbungSaisonende')(sm0(S,17,10,true));
  pruef(Math.abs(S.spons.base-b0*(1-Z.klausel))<=1000&&S.werbung.aermel.base===a0&&Math.abs(S.werbung.ausruester.base-u0*(1-Z.klausel))<=1000&&S.spons.z===Z.start-Z.erfolgMax+Z.abstieg&&S.news.some(n=>n.t.includes('Abstiegsklausel')),
    'Abstiegsklausel: Dreijahresverträge −40 %, der auslaufende Einjahresvertrag bleibt, Zufriedenheit nach Abstieg −20',`Brust ${b0} → ${S.spons.base}, Ärmel ${a0} → ${S.werbung.aermel.base}, Zufriedenheit ${S.spons.z}`);}

// 20. Verlängerung: Läuft der Vertrag eines zufriedenen Partners (ab 70) aus, steht er mit 10 % mehr in den neuen Angeboten; ein unzufriedener nicht. Die Brust zählt nur einmal herunter.
{const {S,F,ev}=welt(false),Z=ev('RF').werbung.zufriedenheit,A=ev('RF').sponsor.angebote;F.sponsorWaehlen(0);F.werbungWaehlen('aermel',0);F.werbungWaehlen('ausruester',2);
  S.spons.z=80;S.werbung.aermel.z=60;const brust=S.spons,yA=S.werbung.ausruester.yrs;S.season++;F.werbungSaison();if(!S.spons)F.sponsOffers();
  const v=(S.sponsOffers||[]).find(o=>o.ver),va=(S.werbOffers.aermel||[]).find(o=>o.ver);
  pruef(!!v&&v.name===brust.name&&Math.abs(v.base-brust.base*(1+Z.plus))<=1000&&v.yrs===Z.jahre&&!va&&S.werbOffers.aermel.length===A.length+1&&S.werbung.ausruester.yrs===yA-1&&!S.werbAlt.brust,
    'Verlängerung: zufriedener Partner (80) mit 10 % mehr in den neuen Angeboten, unzufriedener (60) nicht, Laufzeiten zählen einmal herunter',v?`${brust.name} ${brust.base} → ${v.base}, ${v.yrs} Jahre`:'kein Angebot');}

// 21. Die Automatik nimmt eine Verlängerung, wenn sie das höchste feste Angebot ist
{const {S,F,ev}=welt(true);S.spons.z=90;S.spons.yrs=1;S.spons.base=Math.max(...[S.spons.base])*2;const name=S.spons.name;S.season++;F.werbungSaison();if(!S.spons)F.sponsOffers();
  pruef(S.spons&&S.spons.name===name&&S.spons.ver===1,'Automatik: nimmt die Verlängerung, wenn sie das höchste feste Angebot ist',S.spons&&S.spons.name);}

console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
