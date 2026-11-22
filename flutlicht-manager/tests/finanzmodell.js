// Messskript für K23b (K23 §5.2): Was ergäbe das volle Einnahmenmodell für jeden Verein, wenn Computer-Vereine dieselben Einnahmen und Ausgaben buchten wie du?
// Ändert nichts am Spiel. Spielt N Saisons normal und rechnet je Ligaspiel für jeden Verein nebenher:
//   Einnahmen: TV (tvGeld), Sponsor (Ansehen² × Ligawert), im Heimspiel Zuschauer (Erwartung ohne Würfel, Preis = Richtpreis), Fanartikel und Logen.
//   Ausgaben: Gehälter des Kaders und des Stabs je Ligaspiel, Stadion und Betrieb, Jugendarbeit (Stufe der Computer-Vereine).
//   Zum Vergleich die heutige Pauschale der Computer-Vereine (Ansehen² × fremdeEinnahmen.liga je Ligaspiel).
// Ausgabe je Liga: Einnahmen, Ausgaben und Saldo je Saison (Schnitt, Spanne), Anteil mit Minus, die drei schwächsten und stärksten Vereine, dazu dein Verein mit den echten Buchungen.
// Aufruf: node tests/finanzmodell.js [Saisons, Standard 1]. Nur Node.js. Keine Prüfung mit Exit-Code, nur Zahlen für das Testprotokoll.
// Lief in Lauf 5 (Testprotokoll, BZ7). Die Zeilen „Spieler“ und „nach Stärke“ für K23c (22.11.) sind neu und noch nie gelaufen.
const {saisons}=require('./sim');
const N=Math.max(1,+(process.argv[2]||1)),SEED=4711,VEREIN=6;
const konto=new Map(); // Verein → {ein, aus, alt, sp}
const z=(id)=>{if(!konto.has(id))konto.set(id,{ein:0,aus:0,alt:0,sp:0,tv:0,spons:0,tor:0,gehalt:0});return konto.get(id);};
let F0=null,ergebnis=[];
saisons({n:N,seed:SEED,verein:VEREIN,
  beiSpielen:(list,S,o)=>{const W=F0.__W,ev=W.ev,RF=ev('RF'),RS=ev('RS'),Z=RF.zuschauer;
    list.forEach(r=>{if(!r.lg)return;[r.h,r.a].forEach((id,s)=>{const t=S.teams[id];if(!t)return;const k=z(id),n=(S.fx[t.lg]||[]).length||34;
      const tv=ev('tvGeld')(t),sp=t.rep*t.rep*(RF.sponsor['liga'+t.lg]||RF.sponsor.liga3);let tor=0;
      if(s===0){const opp=S.teams[r.a],preis=ev('richtPreis')(t),ref=Z.refBasis+t.rep*Z.refJeAnsehen,pf=Math.min(Z.preisMax,Math.max(Z.preisMin,Math.pow(ref/preis,Z.preisExponent))),
          ff=Z.formBasis+Z.formJePunkt*F0.formPts(id),of=Z.gegnerBasis+(opp?opp.rep:Z.gegnerOhne)/100*Z.gegnerFaktor,lf=t.lg===1?1:t.lg===2?Z.liga2:Z.liga3;
        const att=Math.min(t.cap,t.fans*pf*ff*of*lf*(Z.zufallBasis+Z.zufallSpanne/2));tor=att*preis+att*(RF.fanartikel[t.shop||0]||0)+(t.logen||0)*RF.loge;}
      const geh=(ev('squad')(id).reduce((a,p)=>a+p.sal,0)+ev('stabGehaelter')(id))/n,betr=t.cap*RF.betrieb.jePlatz+(t.logen||0)*RF.betrieb.jeLoge,jug=RF.jugendKosten[RS.nachwuchs.computerStufe];
      k.ein+=tv+sp+tor;k.aus+=geh+betr+jug;k.alt+=t.rep*t.rep*RF.fremdeEinnahmen.liga;k.sp++;k.tv+=tv;k.spons+=sp;k.tor+=tor;k.gehalt+=geh;});});},
  vorher:(F)=>{F0=F;},
  beiSaisonende:(S,F)=>{const ev=F.__W.ev,fmt=x=>(x/1e6).toFixed(1)+' Mio';
    for(const lg of [1,2,3]){const l=S.teams.filter(t=>t.lg===lg).map(t=>({t,k:z(t.id)})).filter(x=>x.k.sp>0);if(!l.length)continue;
      const saldo=x=>x.k.ein-x.k.aus,sum=f=>l.reduce((a,x)=>a+f(x),0)/l.length,sort=l.slice().sort((a,b)=>saldo(a)-saldo(b));
      const zeile=x=>`${x.t.name} (Ansehen ${x.t.rep}): ein ${fmt(x.k.ein)}, aus ${fmt(x.k.aus)}, Saldo ${fmt(saldo(x))}, heute ${fmt(x.k.alt)}`;
      ergebnis.push(`Saison ${S.season}, ${lg}. Liga, ${l.length} Vereine: Einnahmen ${fmt(sum(x=>x.k.ein))} (TV ${fmt(sum(x=>x.k.tv))}, Sponsor ${fmt(sum(x=>x.k.spons))}, Spieltag ${fmt(sum(x=>x.k.tor))}), `+
        `Ausgaben ${fmt(sum(x=>x.k.aus))} (Gehälter ${fmt(sum(x=>x.k.gehalt))}), Saldo ${fmt(sum(saldo))} je Verein, Spanne ${fmt(saldo(sort[0]))} bis ${fmt(saldo(sort[sort.length-1]))}, `+
        `mit Minus ${l.filter(x=>saldo(x)<0).length}, heutige Pauschale ${fmt(sum(x=>x.k.alt))}`);
      ergebnis.push('  schwächste: '+sort.slice(0,3).map(zeile).join(' | '));ergebnis.push('  stärkste: '+sort.slice(-3).map(zeile).join(' | '));
      // Für K23c (K23 §5.6a): Gehälter und Marktwerte der Spieler je Liga (Schnitt, Median, Spitze) und je Stärkeband
      const sp=l.flatMap(x=>ev('squad')(x.t.id)),med=a=>{const s=a.slice().sort((p,q)=>p-q);return s.length?s[Math.floor(s.length/2)]:0;},sal=sp.map(p=>p.sal),wert=sp.map(p=>ev('value')(p));
      const band=[[0,60],[60,65],[65,70],[70,75],[75,80],[80,85],[85,99]].map(([a,b])=>{const q=sp.filter(p=>p.str>=a&&p.str<b);return q.length?`${a}–${b}: ${q.length} Spieler, Gehalt ${fmt(q.reduce((s,p)=>s+p.sal,0)/q.length)}, Wert ${fmt(q.reduce((s,p)=>s+ev('value')(p),0)/q.length)}`:null;}).filter(Boolean);
      ergebnis.push(`  Spieler: ${sp.length}, Gehalt Schnitt ${fmt(sal.reduce((a,b)=>a+b,0)/Math.max(1,sal.length))}, Median ${fmt(med(sal))}, Spitze ${fmt(Math.max(0,...sal))}; Marktwert Schnitt ${fmt(wert.reduce((a,b)=>a+b,0)/Math.max(1,wert.length))}, Median ${fmt(med(wert))}, Spitze ${fmt(Math.max(0,...wert))}`);
      ergebnis.push('  nach Stärke: '+band.join(' | '));}
    const t=ev('myT()'),lauf=Object.entries(S.fin).filter(([k])=>ev('RFP').laufend.includes(k)).reduce((a,[,v])=>a+v,0);
    ergebnis.push(`Dein Verein ${t.name}: laufender Saldo nach den echten Buchungen ${fmt(lauf)}, nach dem Modell ${fmt(z(t.id).ein-z(t.id).aus)}`);
    konto.clear();}});
console.log(ergebnis.join('\n'));
