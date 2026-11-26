// Messskript für K23b (K23 §5.2): Was ergäbe das volle Einnahmenmodell für jeden Verein, wenn Computer-Vereine dieselben Einnahmen und Ausgaben buchten wie du?
// Ändert nichts am Spiel. Spielt N Saisons normal und rechnet je Ligaspiel für jeden Verein nebenher:
//   Einnahmen: TV (tvGeld, seit K23c Säulenmodell), Werbung (seit K23c sponsorBasis) und Sonstiges, im Heimspiel Zuschauer (Erwartung ohne Würfel, Preis = Richtpreis), Fanartikel und Logen.
//   Ausgaben: Gehälter des Kaders und des Stabs je Ligaspiel, Stadion und Betrieb mit Verwaltung (seit K23c), Jugendarbeit (Stufe der Computer-Vereine).
//   Zum Vergleich die heutige Pauschale der Computer-Vereine (Ansehen² × fremdeEinnahmen.liga je Ligaspiel).
// Ausgabe je Liga: Einnahmen, Ausgaben und Saldo je Saison (Schnitt, Spanne), Anteil mit Minus, die drei schwächsten und stärksten Vereine, dazu dein Verein mit den echten Buchungen.
// Aufruf: node tests/finanzmodell.js [Saisons, Standard 1]. Nur Node.js. Keine Prüfung mit Exit-Code, nur Zahlen für das Testprotokoll.
// Lief in Lauf 5 (Testprotokoll, BZ7). Die Zeilen „Spieler“ und „nach Stärke“ für K23c (22.11.) sind neu und noch nie gelaufen.
const {saisons}=require('./sim');
const N=Math.max(1,+(process.argv[2]||1)),SEED=4711,VEREIN=6;
const konto=new Map(); // Verein → {ein, aus, alt, sp}
const z=(id)=>{if(!konto.has(id))konto.set(id,{ein:0,aus:0,alt:0,sp:0,tv:0,spons:0,tor:0,gehalt:0,betrieb:0,verw:0,jugend:0});return konto.get(id);};
const kurz=[]; // seit Lauf 12: eine kurze Zeile je Liga und Saison mit allen Posten, zum Übernehmen ins Testprotokoll
// Seit Lauf 16: je Liga und Saison eine Prüfzeile gegen das Ziel aus K23 Nr. 25 (Saldo je Verein etwa +11 / 0 / −1 Mio, Spanne ±1,5), ab der zweiten Saison mit der
// Veränderung jedes Postens gegenüber der Vorsaison. Lauf 16 zeigte Saison 1 im Ziel, Saison 2 in der 1. Liga darüber und in der 2. und 3. Liga darunter.
const ZIEL={1:11e6,2:0,3:-1e6},SPANNE=1.5e6,pruefZeilen=[],vor={},ligaVorher=new Map(); // ligaVorher: Liga jedes Vereins in der Vorsaison (geblieben oder neu, seit Lauf 18)
let F0=null,ergebnis=[];
saisons({n:N,seed:SEED,verein:VEREIN,
  beiSpielen:(list,S,o)=>{const W=F0.__W,ev=W.ev,RF=ev('RF'),RS=ev('RS'),Z=RF.zuschauer;
    list.forEach(r=>{if(!r.lg)return;[r.h,r.a].forEach((id,s)=>{const t=S.teams[id];if(!t)return;const k=z(id),n=(S.fx[t.lg]||[]).length||34;
      // seit K23b dieselbe Rechnung wie im Spiel (kiHeimEinnahmen, sonstigeEinnahmen), Sonstiges zählt hier zum Sponsor
      // seit K23c: Werbung = Grundbetrag (sponsorBasis), Ausgaben mit Verwaltung (verwaltungKosten)
      const tv=ev('tvGeld')(t),sp=ev('sponsorBasis')(t)+ev('sonstigeEinnahmen')(t);let tor=0;
      if(s===0)tor=ev('kiHeimEinnahmen')(t,S.teams[r.a]||null,false);
      const verw=ev('verwaltungKosten')(t),geh=(ev('squad')(id).reduce((a,p)=>a+p.sal,0)+ev('stabGehaelter')(id))/n,betr=t.cap*RF.betrieb.jePlatz+(t.logen||0)*RF.betrieb.jeLoge+verw,jug=RF.jugendKosten[RS.nachwuchs.computerStufe];
      k.ein+=tv+sp+tor;k.aus+=geh+betr+jug;k.alt+=t.rep*t.rep*RF.fremdeEinnahmen.liga;k.sp++;k.tv+=tv;k.spons+=sp;k.tor+=tor;k.gehalt+=geh;k.betrieb+=betr-verw;k.verw+=verw;k.jugend+=jug;});});},
  vorher:(F)=>{F0=F;},
  beiSaisonende:(S,F)=>{const ev=F.__W.ev,fmt=x=>(x/1e6).toFixed(1)+' Mio';
    for(const lg of [1,2,3]){const l=S.teams.filter(t=>t.lg===lg).map(t=>({t,k:z(t.id)})).filter(x=>x.k.sp>0);if(!l.length)continue;
      const saldo=x=>x.k.ein-x.k.aus,sum=f=>l.reduce((a,x)=>a+f(x),0)/l.length,sort=l.slice().sort((a,b)=>saldo(a)-saldo(b));
      const zeile=x=>`${x.t.name} (Ansehen ${x.t.rep}): ein ${fmt(x.k.ein)}, aus ${fmt(x.k.aus)}, Saldo ${fmt(saldo(x))}, heute ${fmt(x.k.alt)}`;
      ergebnis.push(`Saison ${S.season}, ${lg}. Liga, ${l.length} Vereine: Einnahmen ${fmt(sum(x=>x.k.ein))} (TV ${fmt(sum(x=>x.k.tv))}, Sponsor ${fmt(sum(x=>x.k.spons))}, Spieltag ${fmt(sum(x=>x.k.tor))}), `+
        `Ausgaben ${fmt(sum(x=>x.k.aus))} (Gehälter ${fmt(sum(x=>x.k.gehalt))}), Saldo ${fmt(sum(saldo))} je Verein, Spanne ${fmt(saldo(sort[0]))} bis ${fmt(saldo(sort[sort.length-1]))}, `+
        `mit Minus ${l.filter(x=>saldo(x)<0).length}, heutige Pauschale ${fmt(sum(x=>x.k.alt))}`);
      ergebnis.push('  schwächste: '+sort.slice(0,3).map(zeile).join(' | '));ergebnis.push('  stärkste: '+sort.slice(-3).map(zeile).join(' | '));
      kurz.push(`KURZ ${S.season} L${lg}: ein ${fmt(sum(x=>x.k.ein))} = TV ${fmt(sum(x=>x.k.tv))} + Werbung/Sonstiges ${fmt(sum(x=>x.k.spons))} + Spieltag ${fmt(sum(x=>x.k.tor))} | aus ${fmt(sum(x=>x.k.aus))} = Gehalt+Stab ${fmt(sum(x=>x.k.gehalt))} + Betrieb ${fmt(sum(x=>x.k.betrieb))} + Verwaltung ${fmt(sum(x=>x.k.verw))} + Jugend ${fmt(sum(x=>x.k.jugend))} | Saldo ${fmt(sum(saldo))}`);
      // Für K23c (K23 §5.6a): Gehälter und Marktwerte der Spieler je Liga (Schnitt, Median, Spitze) und je Stärkeband
      const sp=l.flatMap(x=>ev('squad')(x.t.id)),med=a=>{const s=a.slice().sort((p,q)=>p-q);return s.length?s[Math.floor(s.length/2)]:0;},sal=sp.map(p=>p.sal),wert=sp.map(p=>ev('value')(p));
      const band=[[0,60],[60,65],[65,70],[70,75],[75,80],[80,85],[85,99]].map(([a,b])=>{const q=sp.filter(p=>p.str>=a&&p.str<b);return q.length?`${a}–${b}: ${q.length} Spieler, Gehalt ${fmt(q.reduce((s,p)=>s+p.sal,0)/q.length)}, Wert ${fmt(q.reduce((s,p)=>s+ev('value')(p),0)/q.length)}`:null;}).filter(Boolean);
      ergebnis.push(`  Spieler: ${sp.length}, Gehalt Schnitt ${fmt(sal.reduce((a,b)=>a+b,0)/Math.max(1,sal.length))}, Median ${fmt(med(sal))}, Spitze ${fmt(Math.max(0,...sal))}; Marktwert Schnitt ${fmt(wert.reduce((a,b)=>a+b,0)/Math.max(1,wert.length))}, Median ${fmt(med(wert))}, Spitze ${fmt(Math.max(0,...wert))}`);
      ergebnis.push('  nach Stärke: '+band.join(' | '));
      {const m=f=>sum(x=>x.k[f]),jetzt={tv:m('tv'),spons:m('spons'),tor:m('tor'),gehalt:m('gehalt'),betrieb:m('betrieb'),verw:m('verw'),jugend:m('jugend'),saldo:sum(saldo),
          kader:sp.length/l.length,sal:sal.reduce((a,b)=>a+b,0)/Math.max(1,sal.length),str:sp.reduce((a,p)=>a+p.str,0)/Math.max(1,sp.length)},v=vor[lg],ok=Math.abs(jetzt.saldo-ZIEL[lg])<=SPANNE;
        const d=f=>{const x=(jetzt[f]-v[f])/1e6;return(x>=0?'+':'−')+Math.abs(x).toFixed(1);},mio2=x=>(x/1e6).toFixed(2);
        pruefZeilen.push(`${ok?'✓':'✗'} Saldo ${lg}. Liga Saison ${S.season}: ${fmt(jetzt.saldo)} je Verein (Ziel ${fmt(ZIEL[lg])} ± 1.5)`+(v?
          ` · gegenüber Vorsaison: TV ${d('tv')}, Werbung/Sonstiges ${d('spons')}, Spieltag ${d('tor')}, Gehalt+Stab ${d('gehalt')} (Kader ${v.kader.toFixed(1)} → ${jetzt.kader.toFixed(1)} Spieler, Ø Gehalt ${mio2(v.sal)} → ${mio2(jetzt.sal)} Mio, Ø Stärke ${v.str.toFixed(1)} → ${jetzt.str.toFixed(1)}), Betrieb ${d('betrieb')}, Verwaltung ${d('verw')}, Jugend ${d('jugend')}`+
          (()=>{const gr=f=>l.filter(x=>ligaVorher.has(x.t.id)&&f(ligaVorher.get(x.t.id))),txt=(g,name)=>{if(!g.length)return`${name} 0`;const s=g.flatMap(x=>ev('squad')(x.t.id));
            return`${name} ${g.length} (Saldo ${fmt(g.reduce((a,x)=>a+saldo(x),0)/g.length)}, Ø Gehalt ${mio2(s.reduce((a,p)=>a+p.sal,0)/Math.max(1,s.length))} Mio)`;};
            // drei Gruppen (Prüfung GJ3): Absteiger von oben, Aufsteiger von unten, geblieben
            return ` · ${txt(gr(v0=>v0<lg),'abgestiegen')}, ${txt(gr(v0=>v0>lg),'aufgestiegen')}, ${txt(gr(v0=>v0===lg),'geblieben')}`;})():
          ` · TV ${fmt(jetzt.tv)}, Werbung/Sonstiges ${fmt(jetzt.spons)}, Spieltag ${fmt(jetzt.tor)}, Gehalt+Stab ${fmt(jetzt.gehalt)} (Kader ${jetzt.kader.toFixed(1)} Spieler, Ø Gehalt ${mio2(jetzt.sal)} Mio, Ø Stärke ${jetzt.str.toFixed(1)}), Betrieb ${fmt(jetzt.betrieb)}, Verwaltung ${fmt(jetzt.verw)}`));
        vor[lg]=jetzt;}}
    const t=ev('myT()'),lauf=Object.entries(S.fin).filter(([k])=>ev('RFP').laufend.includes(k)).reduce((a,[,v])=>a+v,0);
    ergebnis.push(`Dein Verein ${t.name}: laufender Saldo nach den echten Buchungen ${fmt(lauf)}, nach dem Modell ${fmt(z(t.id).ein-z(t.id).aus)}`);
    konto.clear();S.teams.forEach(t=>ligaVorher.set(t.id,t.lg));}});
console.log(ergebnis.join('\n'));
console.log('\nBitte diese KURZ-Zeilen vollständig ins Testprotokoll übernehmen (Durchschnitt je Verein und Saison):\n'+kurz.join('\n'));
console.log('\nSaldo gegen das Ziel (K23 Nr. 25). Bitte die Zeilen mit ✓ und ✗ wörtlich ins Testprotokoll übernehmen, sie nennen die Ursache einer Abweichung:\n'+pruefZeilen.join('\n'));
