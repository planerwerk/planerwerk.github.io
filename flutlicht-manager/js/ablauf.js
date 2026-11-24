// Tagesablauf (K01): Spiele eines Tages, Werte pro Tag und pro Woche, Finanzen, Training, Transfermarkt, Vorstand, Bau.

// Alle Spiele eines Tages in allen Wettbewerben. Ergebnis: {tag, gruppen:[{titel,art,e,list}], list, mine}
// Zwei Schritte (K05): vorbereiten lost aus und rechnet alle Spiele, abschließen trägt sie ein (Tabellen, Finanzen, Vorstand).
// Beim Live-Spiel bleibt dein Spiel dazwischen offen und läuft Minute für Minute in der Ansicht (js/live.js).
function tagesSpiele(d){const v=tagesSpieleVorbereiten(d,false);return tagesSpieleAbschliessen(v.out);}
function tagesSpieleVorbereiten(d,live){kartenAuto(d); // unbeantwortete Ereigniskarten vor dem Anpfiff (K30, U12d)
  return mitStrom(strom('spieltag',S.season,d),()=>{const out={tag:d,gruppen:[],list:[],mine:null},vorher=S.gespielt;let G=null,platz=null;S.gespielt=d;
  if(S.sponsOffers&&meinSpiel(d))sponsorWaehlen(0);if(werbungAusstehend()&&meinSpiel(d))werbungVorSpiel(); // freie Werbeflächen: erstes Angebot (K24a)
  const spiel=(h,a,o,meta,g)=>{const i=g.list.length;if(o.wichtig){kiSpritzen(h);kiSpritzen(a);} // fit spritzen nur in wichtigen Spielen (K10 §7)
    if(!o.test&&(h===S.my||a===S.my))trainerVorSpiel(d); /* gesperrt: heute auf der Tribüne (K09g) */
    if(meta.cup&&(h===S.my||a===S.my)){const bxi=pokalBezugsElf([[h,a]]);if(bxi)meta=Object.assign({},meta,{bxi});} /* Vergleichself der Pokal-Rotation vor dem Anpfiff, nach dem Fitspritzen (K13e, FD3, FF1) */
    if(live&&!o.test&&(h===S.my||a===S.my)){G=spielAnlegen(h,a,Object.assign({},o,{auto:[h!==S.my,a!==S.my]}));platz={meta,g,i};g.list.push(null);return;}g.list.push(Object.assign(sim(h,a,o),meta));};
  testspielHeute(d).forEach(x=>{const g={titel:'Testspiel',art:'test',e:{art:'test'},x,list:[]},hg=x.heim?[S.my,x.gegner]:[x.gegner,S.my];spiel(hg[0],hg[1],{test:1,wb:'test'},{test:1},g);out.gruppen.push(g);}); // Testspiele ohne Halt (K11)
  for(const e of termineAm(d)){
    if(e.art==='liga'){const g={titel:`${ligaName(e.lg)} · ${e.md+1}. Spieltag`,art:'liga',e,list:[]};e.idx.forEach(i=>{const[h,a]=S.fx[e.lg][e.md][i];spiel(h,a,{},{lg:e.lg,min:S.plan.zeit[e.lg][e.md][i][1]},g);});out.gruppen.push(g);}
    else if(e.art==='pokal'){if(S.cup.hist.length!==e.r)continue;const fin=e.r===5,g={titel:`DFB-Pokal · ${POKAL_RUNDEN[e.r]}`,art:'pokal',e,list:[]},pl=pokalPaareAm(e);if(!pl.length)continue;
      pl.forEach(([h,a])=>spiel(h,a,{wb:'pokal',ko:1,neutral:fin,wichtig:e.r>=RTA.ki.wichtigAbRunde},Object.assign({cup:1,min:e.min},fin?{neutral:1}:{}),g));out.gruppen.push(g);} /* neutral: Finale (Prüfung FF3) */
    else if(e.art==='supercup'){const x=S.supercup,g={titel:'Supercup',art:'supercup',e,list:[]};spiel(x.h,x.a,{wb:'pokal',ko:1,elfDirekt:1,wichtig:true},{supercup:1,min:e.min},g);out.gruppen.push(g);}
    else if(e.art==='eu'){const L=euSpieleAm(e);if(!L.length)continue;const g={titel:euSpielName(e),art:'eu',e,list:[],kurz:[]}; // Europapokal (K37, U19a): Ausland gegen Ausland als Kurzrechnung im eigenen Strom
      mitStrom(strom('eukurz',S.season,d,e.wb,e.runde,e.leg,e.md==null?-1:e.md),()=>L.forEach(m=>{if(!euDe(m.h)&&!euDe(m.a))g.kurz.push(Object.assign(euKurz(m.h,m.a,m.o),{i:m.i}));}));
      L.forEach(m=>{if(euDe(m.h)||euDe(m.a))spiel(m.h,m.a,m.o,{eu:e.wb,euI:m.i,min:e.min},g);});out.gruppen.push(g);}
    else if(e.art==='rel'||e.art==='rel2'){const sp=S[e.art==='rel'?'relSp':'relSp2'];if(!relBereit(e.art)||sp[e.leg])continue;const[h,a]=e.leg===0?relTeams(e.art).reverse():relTeams(e.art);const g={titel:`Relegation${e.art==='rel2'?' 2./3. Liga':''} · ${e.leg?'Rückspiel':'Hinspiel'}`,art:e.art,e,list:[]};spiel(h,a,e.leg===1&&sp[0]?{wichtig:true,ko:1,agg:[sp[0].ag,sp[0].hg]}:{wichtig:true},{rel:1,min:e.min},g);out.gruppen.push(g);}
  }
  if(G)S.gespielt=vorher; // erst nach dem Abpfiff gilt der Tag als gespielt (Neuladen mitten im Spiel)
  return{out,G,platz};});}
// Das live gespielte Spiel an seinen Platz eintragen
function liveEintragen(v){const r=Object.assign(v.G.ergebnis(),v.platz.meta);v.platz.g.list[v.platz.i]=r;return r;}
function tagesSpieleAbschliessen(out){return mitStrom(strom('spieltagEnde',S.season,out.tag),()=>tagesSpieleAbschliessenLauf(out));}
function tagesSpieleAbschliessenLauf(out){const d=out.tag;S.gespielt=d;
  out.gruppen.filter(g=>g.art==='test').forEach(g=>g.list.forEach(r=>{testspielNach(r,g.x);turnierNach(r,g.x);}));out.gruppen=out.gruppen.filter(g=>g.art!=='test');
  out.list=out.gruppen.flatMap(g=>g.list);if(!out.list.length){out.gruppen.filter(g=>g.art==='eu').forEach(g=>euNachSpielen(g,null));return out;} // nur Ausland gegen Ausland im Europapokal: trotzdem eintragen (K37)
  einsatzVorher(out.list);versprechenNachSpiel(out.list);scoutingNachSpiel(out.list); // wer fehlte (K14 §12) und Versprechen (K15), solange Gesperrte noch als gesperrt gelten
  // Sperren zählen die Spiele der eigenen Mannschaft im selben Wettbewerb (K09)
  const spielten=new Set(),wbs=new Set();out.list.forEach(r=>{spielten.add(r.h);spielten.add(r.a);const w=wbVon(r);wbs.add(r.h+':'+w);wbs.add(r.a+':'+w);});
  sperrenAbsitzen(wbs);
  out.list.forEach(r=>applyMatch(r,!!r.cup));
  statistikNachSpiel(out.list,d); // Statistik, Vorlagen (eigener Strom je Spiel), Rekorde, Jubiläen (K34, U13)
  einsatzBuchen(out.list,d); // Einsatzzeit und Bankzeit nach Grund (K14 §12), nach den Noten
  praemienNachSpiel(out.list); // Prämien deiner Spieler (K21, U10b)
  mitStrom(strom('praegung',S.season,d),()=>praegungNachSpiel(out.list,d)); // Prägungen junger Spieler (K08 §5.3)
  S.pl.forEach(p=>{if(spielten.has(p.team))entwicklungBuchen(p,d);});
  out.mine=out.list.find(r=>r.h===S.my||r.a===S.my)||null;if(out.mine)lizenzSpiel();
  const t=myT(),m=out.mine;
  for(const g of out.gruppen){const e=g.e,mg=g.list.includes(m)?m:null;
    if(g.art==='liga'){g.list.forEach(r=>{S.res[e.lg].push([r.h,r.a,r.hg,r.ag,e.md]);bezDerbySpiel(r);fansDerby(r);}); // Derby mit Sieger: Rivalität wächst (K17, U12c)
      if(mg){news(`${e.md+1}. Spieltag: ${tn(mg.h)} – ${tn(mg.a)} ${mg.hg}:${mg.ag}`,(mg.h===S.my?mg.hg>mg.ag:mg.ag>mg.hg)?'good':(mg.hg===mg.ag?'':'bad'));finanzenLiga(mg);teampraemieSpiel(mg);durchschautMeldung(mg);vorstandLiga(e,mg);fansHeimspiel(mg);
        if(e.md+1===RK.vertragsWarnungNachSpieltag){const x=squad(S.my).filter(p=>p.ct<=1);if(x.length)news(`Achtung: ${x.length} Vertrag/Verträge enden zum Saisonende (${x.slice(0,6).map(p=>p.n).join(', ')}${x.length>6?' …':''}). Verlängern: im Kader auf den Spieler klicken.`,'bad');}}
      g.list.forEach(r=>[r.h,r.a].forEach(id=>{if(id!==S.my)kiFinanzenSpiel(S.teams[id],r);}));} // Computer-Vereine nach denselben Regeln wie du statt Pauschale (K23b)
    else if(g.art==='pokal'){const zeilen=g.list.map(r=>[r.h,r.a,r.hg,r.ag,r.pen]),sieger=g.list.map(winner); // geteilte Runde (T8.2): erst nach dem zweiten Tag eintragen
      if(pokalGeteilt(e.r)&&!e.spaet)S.cup.teil={r:e.r,z:zeilen,s:sieger};else{const T=S.cup.teil&&S.cup.teil.r===e.r?S.cup.teil:{z:[],s:[]};S.cup.hist.push(T.z.concat(zeilen));S.cup.alive=T.s.concat(sieger);delete S.cup.teil;}fansPokal(g.list);pokalSensationen(g.list);teampraemiePokal(g.list);
      if(mg){const won=winner(mg)===S.my,opp=mg.h===S.my?mg.a:mg.h;news(`DFB-Pokal, ${POKAL_RUNDEN[e.r]}: ${tn(mg.h)} – ${tn(mg.a)} ${mg.hg}:${mg.ag}${mg.pen?` (i.E. ${mg.pen[0]}:${mg.pen[1]})`:''} – ${won?(e.r===5?'POKALSIEG!':'weiter!'):'ausgeschieden.'}`,won?'good':'bad');
        if(!won)pokalRotation(mg); /* K13e */if(!won&&(opp>=1000||S.teams[opp].lg>t.lg))S.trust+=RV.pokalAus;if(won)S.trust+=RV.pokalWeiter;
        if(mg.h===S.my&&e.r!==5)heimspielEinnahmen(mg,true);money('Pokalprämien',RF.pokalPraemien[e.r]);}
      if(e.r===5){const cw=S.cup.alive[0];news(`${tn(cw)} gewinnt den DFB-Pokal!`,'good');if(cw===S.my){money('Pokalprämien',RF.pokalSieg);S.trust+=RV.pokalSieg;}}
      g.list.forEach(r=>kiPokalSpiel(r,e.r));} // Computer-Vereine: Rundenprämie und Zuschauer wie du statt Pauschale für alle (K23b)
    else if(g.art==='rel'||g.art==='rel2'){const r=g.list[0];S[g.art==='rel'?'relSp':'relSp2'][e.leg]={h:r.h,a:r.a,hg:r.hg,ag:r.ag,pen:r.pen||null};
      if(mg)news(`${spielName(e)}: ${tn(r.h)} – ${tn(r.a)} ${r.hg}:${r.ag}${r.pen?` (i.E. ${r.pen[0]}:${r.pen[1]})`:''}`,(r.h===S.my?r.hg>r.ag:r.ag>r.hg)?'good':(r.hg===r.ag?'':'bad'));}
    else if(g.art==='supercup'){const r=g.list[0],w=winner(r);S.supercup.r={hg:r.hg,ag:r.ag,pen:r.pen||null,sieger:w};supercupPraemie(r,w);
      news(`Supercup: ${tn(r.h)} – ${tn(r.a)} ${r.hg}:${r.ag}${r.pen?` (i.E. ${r.pen[0]}:${r.pen[1]})`:''}. ${tn(w)} holt den Supercup.`,mg?(w===S.my?'good':'bad'):'');}
    else if(g.art==='eu')euNachSpielen(g,mg);} // Europapokal (K37, U19a)
  letztesSpielMerken(out.mine,d); // Joker und frühe Auswechslungen für Karten (K05c)
  trainerNachSpiel(out.mine,d); // Sperre des Trainers: ein Spiel abgesessen (K09g)
  presseNachSpiel(out.mine);spielfeldrandNachSpiel(out.mine); // Interview am Spielfeldrand (K29f). Kampfansagen prüfen, Pressekonferenz nach Krise, Serie, Kantersieg (K29 §5.4, U17a)
  S.trust=clamp(S.trust,0,100);vorstandPruefen();
  return out;}

// Werte pro Tag: Ausfalltage zählen herunter, Frische erholt sich, Fristen laufen ab, Bau wird fertig.
function taeglich(d){return mitStrom(strom('tag',S.season,d),()=>taeglichLauf(d));}
function taeglichLauf(d){const T=RT;praegungTag(d);wechselTag(d);konkurrenzTag(d);laenderspielTag(d); // vereinbarte Wechsel zum Winterfenster (K19, U10a), Frist im Bieterwettstreit (K20c); TV-Raten (K23h, nur mit Schalter) seit Prüfung FK3 nach finanzenTag
  if(S.phase==='play')testspieleTag(d);
  const ab=S.phase==='play'?spielAbstand(d):new Map(),status=new Map();
  S.teams.forEach(t=>{if(!aktiv(t))return;sommerTag(t,ab.get(t.id),d);const st=sommerStatus(t);status.set(t.id,st);
    if(S.phase==='play'&&d===auftaktTag(t)&&st!=='urlaub'){sommerAuftakt(t);status.set(t.id,'');if(t.id===S.my){news('Trainingsauftakt: Die Mannschaft ist zurück. Morgen ist Leistungstest.');neuzugaengeAuftakt();}} /* Neuzugänge mit Integration (K12a §8, K07h) */
    if(S.phase==='play'&&d===auftaktTag(t)+RSO.leistungstest.tag&&t.id===S.my)leistungstest();
    if(!status.get(t.id))trainingVerein(t,ab.get(t.id),d);});
  S.pl.forEach(p=>{if(p.inj>0)p.inj--;if(p.team<-1)return;const st=p.team>=0?status.get(p.team)||'':'',urlaub=st==='urlaub'?true:st==='laufplan'?'laufplan':false;
    const tr=!urlaub&&p.team>=0&&p.inj<=0&&S.phase==='play'&&!beiNationalteam(p)?trainingTag(p,S.teams[p.team],ab.get(p.team),d):0;tagesWerte(p,urlaub,tr);});
  S.offers.filter(o=>o.bis<d).forEach(o=>versprechenAngebot(o.pid,o.amt)); // abgelaufenes Angebot zählt wie abgelehnt (Versprechen „Wechsel“, K15)
  S.offers=S.offers.filter(o=>o.bis>=d&&PIX.get(o.pid)&&PIX.get(o.pid).team===S.my&&!PIX.get(o.pid).wech&&(o.tid>=AV0?!!avVon(o.tid):S.teams[o.tid]&&aktiv(S.teams[o.tid])));
  kartenAuto(d-1); // offene Ereigniskarten von gestern entscheidet der Co-Trainer (K30, U12d)
  if(S.karten&&S.karten.kette&&S.karten.kette.length)mitStrom(strom('ereignisse',S.season,d,'kette'),()=>kartenKette(d)); // fällige Folgekarten (K30c), eigener Strom
  medizinTag(d);sportgerichtTag(d);kontrolleTag(d);pokalAuslosungTag(d);versprechenTag();testspieleAuto(d);lizenzTag(d);vorbereitungTag(d);deadlineTag(d);presseTag(d);finanzenTag(d);tvRatenTag(d);marketingTag(d);werbungTag(d); // Saisoneröffnung aller Vereine (K12b §5.2, U14) und zusätzlicher Markttag am Deadline Day (K20 §5.4, U15), je mit eigenem Strom
  bauTag(d);euTag(d);} // Bau mit Genehmigung, Verzögerung und Ende (K26 §4, K26a, js/stadion.js), Auslosungen im Europapokal (K37, U19a, js/europa.js)
// Werte pro Woche (montags): Training und Entwicklung, Transfermarkt, Vorstand bei Minus auf dem Konto.
function woechentlich(d){return mitStrom(strom('woche',S.season,d),()=>woechentlichLauf(d));}
function woechentlichLauf(d){if(!imUrlaub())mitStrom(strom('training',S.season,d),training);mitStrom(strom('kabine',S.season,d),()=>kabineWoche(d));mitStrom(strom('jugend',S.season,d),()=>jugendWoche(d));mitStrom(strom('zweite',S.season,d),()=>zweiteWoche(d));mitStrom(strom('vertraege',S.season,d),()=>vertraegeWoche(d));mitStrom(strom('berater',S.season,d),()=>beraterWoche(d));leiheWoche(d);scoutingWoche();boniWoche();boniEinWoche();zielvorgabenWoche();mitStrom(strom('ausland',S.season,d),auslandWoche);mitStrom(strom('markt',S.season,d),market);
  mitStrom(strom('vorstandKI',S.season,d),kiVorstandWoche);mitStrom(strom('kiAbwerben',S.season,d),()=>kiAbwerbenWoche(d)); /* Computer-Vereine werben deine Spieler ab (K20 §7, K20e), nur ohne Automatik der Transfers */ // Vorstand und Trainerwechsel der Computer-Vereine (K31 §5.10, U11d2)
  if(+mmtt(d).slice(3)<=7){bezVergessen();statistikMonat();} // erster Montag des Monats: Beziehungen 5 % zurück zum Grundwert (K17 §4, U12c), Verlauf des eigenen Kaders (K34 §5.3, U13)
  fansWoche();presseWoche();spielerInterviewWoche();mitStrom(strom('geruechte',S.season,d),geruechteWoche);mitStrom(strom('presse','ki',S.season,d),()=>kiSticheleienWoche(d));vorstandWoche();zwischenbilanzWoche(); // Zwischenbilanz im Winter (K28, U12f), Fanstimmung (K27, U16) vor dem Vorstand; träger Anteil des Vertrauens aus Bausteinen, Meldung bei Konto im Minus (K28 §5.1, U12a, js/vorstand.js)
  S.trust=clamp(S.trust,0,100);vorstandPruefen();
  mitStrom(strom('ereignisse',S.season,d),()=>kartenWoche(d));} // Ereigniskarten als Letztes der Woche (K30 §5.5, U12d, js/karten.js)

function attendance(t,opp,cup){const Z=RF.zuschauer,ref=Z.refBasis+t.rep*Z.refJeAnsehen,pf=clamp(Math.pow(ref/t.price,Z.preisExponent),Z.preisMin,Z.preisMax),ff=Z.formBasis+Z.formJePunkt*formPts(t.id),of=Z.gegnerBasis+(opp?opp.rep:Z.gegnerOhne)/100*Z.gegnerFaktor,lf=t.lg===1?1:t.lg===2?Z.liga2:Z.liga3;return Math.round(Math.min(t.cap,t.fans*pf*ff*of*lf*(cup?Z.pokal:1)*(Z.zufallBasis+R()*Z.zufallSpanne)*fanFaktor(t)));} // Fanstimmung (K27 §5.4b, U16)
function heimspielEinnahmen(m,cup){const t=myT();if(autoB('preise'))t.price=clamp(Math.round(richtPreis(t)),RF.ticketPreis.min,RF.ticketPreis.max); // Automatik: Richtpreis (K36)
  /* Teilausschluss nach Zuschauer-Vergehen (K09h): ein Block mit dem Anteil A.anteil der Plätze bleibt leer, einmal, nicht im Europapokal (UEFA). Es fallen Einzelkarten weg:
     Dauerkarten gibt es höchstens für 1 − Gästeblock der Plätze (dkAnteil), bei block 0,1 also nie im gesperrten Block (Prüfung FF2).
     Nach einem Jobwechsel verfällt er (er galt dem alten Verein). */
  if(S.ausschluss&&S.ausschluss.tid!==S.my)S.ausschluss=null;
  const A=S.ausschluss&&!m.eu?S.ausschluss:null,cap=A?Math.round(t.cap*(1-A.anteil)):t.cap;
  const att0=Math.min(cap,attendance(t,m.a>=AV0?avVon(m.a):m.a>=1000?null:S.teams[m.a],cup)),pz=t.price*zuschauerFaktor(t);
  if(A){S.ausschluss=null;news(`Teilausschluss: Ein Block blieb leer, ${(t.cap-cap).toLocaleString('de-DE')} Plätze weniger.`,'');}
  /* Dauerkarten (K27b): in der Liga zählen alle Inhaber als Zuschauer und zahlen Preis × (1 − Rabatt), die übrige Nachfrage kauft Einzelkarten */
  const dk=cup?null:(dkAktuell()||dkVerkauf(t)),n=dk?Math.min(dk.n,cap):0,att=Math.max(att0,n);
  m.att=att;S.att[0]+=att;S.att[1]++;statZuschauer(m,att);if(n)money('Dauerkarten',Math.round(n*dkPreis(t,dk)));money('Zuschauer',Math.round(Math.max(0,att0-n)*pz));if(t.shop)money('Fanartikel',Math.round(att*RF.fanartikel[t.shop]*merchFaktor(t)));if(t.logen)money('VIP-Logen',t.logen*RF.loge);}
// Buchungen je Ligaspieltag des eigenen Vereins
function finanzenLiga(m){const t=myT();if(m.h===S.my)heimspielEinnahmen(m,false);
  {const tv=tvJeSpiel(t);if(tv)money('TV-Gelder',tv);} /* mit TV-Raten 0 (K23h) */{const so=sonstigeEinnahmen(t);if(so)money('Sonstige Einnahmen',so);} // Mitglieder, Vermarktung (K23 §3.1, K23b)
  {const wp=Math.round(sponsorBasis(t)*(RF.werbung.partner||0));if(wp)money('Weitere Sponsoren',wp);} // Premium-, Logen- und Regionalpartner ohne Verhandlung (K23c)
  if(S.spons){money('Sponsor',S.spons.base);if(S.spons.win&&winner(m)===S.my&&m.hg!==m.ag)money('Sponsor',S.spons.win);}werbungSpieltag(m); // Ausrüster und Ärmel (K24a)
  const n=S.fx[t.lg].length;money('Gehälter',-Math.round((squad(S.my).reduce((s,p)=>s+p.sal,0)+leiheGehaelter())/n*gehaltFaktor())); /* dazu verliehene Spieler und Profis in der Zweiten (U10d) */if(S.stab)money('Trainerstab',-Math.round(stabGehaelter(S.my)/n));
  money('Stadion & Betrieb',-Math.round(t.cap*RF.betrieb.jePlatz+t.logen*RF.betrieb.jeLoge));money('Verwaltung',-verwaltungKosten(t));money('Jugendarbeit',-RF.jugendKosten[autoB('jugend')?RS.nachwuchs.computerStufe:t.youth]);{const z=zweiteKosten();if(z)money('Zweite Mannschaft',-z);}
  if(S.loan>0)money('Kreditzinsen',-Math.round(S.loan*RF.kreditZins/n));}
// Woche (K03 §4): Kondition, Form, Selbstvertrauen, Entwicklung für Spieler ohne Pflichtspiel seit 7 Tagen, Wochenbericht des Co-Trainers
function training(){const T=RT,d=S.tag,bericht=[];lernplaetzeVergeben();if(S.stab)stabWoche();const monat=Math.floor(S.tag/7)%RTA.ki.ordnungAlleWochen===0;S.teams.forEach(t=>{if(!aktiv(t))return;if(stabMacht(t.id,'formation')&&monat){const f0=t.form;kiOrdnung(t);if(t.id===S.my&&t.form!==f0){S.lineup=besteElfDu(); /* ohne Tribüne (Prüfung FI4) */stabMeldung(`Der Co-Trainer stellt die Grundordnung auf ${t.form} um.`);}}vertrautheitWoche(t);});
  S.pl.forEach(p=>{if(p.team<-1)return;wochenWerte(p);wocheVerein(p);if(p.ent==null||d-p.ent>=7)entwicklungBuchen(p,d);p.played=0;
    const mine=p.team===S.my;
    if(mine){const n=Math.round(p.str);if(p.sw!=null&&n!==p.sw)bericht.push([p,p.sw,n]);p.sw=n;}
});
  if(bericht.length){const auf=bericht.filter(x=>x[2]>x[1]),ab=bericht.filter(x=>x[2]<x[1]),txt=l=>l.map(([p,a,b])=>`${p.n} (${a} → ${b})`).join(', ');
    news(`Wochenbericht des Co-Trainers: ${auf.length?'verbessert '+txt(auf):''}${auf.length&&ab.length?' · ':''}${ab.length?'nachgelassen '+txt(ab):''}.`,auf.length>=ab.length?'good':'');}}
// Bieter für einen deiner Spieler: deutsche Vereine oder, mit dem Anteil aus REGELN.welt.ausland.angebote, Auslandsvereine mit passender Stärke und genug Budget (K32 §3.1)
function bieter(inland,p,preis,abAnsehen){const aus=auslandKaeufer(p,preis).filter(v=>abAnsehen==null||v.rep>=abAnsehen);if(!aus.length)return inland;return !inland.length||R()<RW.ausland.angebote.anteil?aus:inland;}
function market(){const M=RM;
  // Transferliste und Wechsel aller Vereine, deren Transfers nicht du führst: Kaderplan, Bedarf, Verkaufs- und Kaufregeln (K31, U11a, js/computer.js). Wechsel nur im Fenster (K19 §5.6).
  kiMarkt();
  const lvl=teamLevel(S.my),A=M.angebote,U=M.ueberraschung,bis=S.tag+RK.angebotTage;
  // Angebote an dich nur, wenn du die Transfers selbst führst (K36)
  // Gebote nach dem Vereinswert des Bieters, nur von Vereinen mit Bedarf (K19 §5.4, U10a). max: wie weit der Bieter bei deiner Gegenforderung mitgeht
  if(!autoB('transfers'))squad(S.my).forEach(p=>{if(p.wech||p.leihe||S.offers.some(o=>o.pid===p.id))return;
    if(p.list){const ratio=p.ask/value(p),st=A.preis.find(x=>ratio<=x[0]),pr=(st?st[1]:A.preisSonst)*(deadlineTage()?RAW.deadline.angebote:1); // Deadline Day öfter (K20b)
      if(R()<pr){const B=bieter(S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&!kiTransferSperre(t)&&t.cash>p.ask*A.kontoAnteil&&hatBedarf(t,p)),p,p.ask);if(B.length){const b=pick(B),g=gebotFuer(b,p,p.ask);bonusKI(b,p,g);const o={pid:p.id,tid:b.id,amt:g.amt,max:g.max,r:0,bis};if(g.bo)o.bo=g.bo;S.offers.push(o);news(`Angebot: ${b.name} bietet ${angebotBetrag(o)} für ${p.n} (gilt bis ${datumKurz(bis)}).`,'offer');}}}
    else if(p.str>=lvl+U.niveauPlus&&R()<U.chance){const B=bieter(S.teams.filter(t=>t.id!==S.my&&aktiv(t)&&!kiTransferSperre(t)&&t.rep>=myT().rep&&t.cash>value(p)&&hatBedarf(t,p)),p,value(p),myT().rep);if(B.length){const b=pick(B),g=gebotFuer(b,p,null);if(unverkaeuflichDu(p)){const hp=rundeAb(value(p)*RTR.maxFaktor);g.amt=b.cash*A.kontoAnteil>=hp?hp:0;g.max=Math.max(g.max||0,g.amt);} /* unverkäuflich: nur zum Höchstpreis, wenn der Bieter ihn zahlen kann (Prüfung DU1) */ if(g.amt>0){if(!unverkaeuflichDu(p))bonusKI(b,p,g);const o={pid:p.id,tid:b.id,amt:g.amt,max:g.max,r:0,bis};if(g.bo)o.bo=g.bo;S.offers.push(o);news(`Überraschung: ${b.name} will ${p.n} und bietet ${angebotBetrag(o)} (gilt bis ${datumKurz(bis)}).`,'offer');}}}});
  S.offers=S.offers.filter(o=>PIX.get(o.pid)&&PIX.get(o.pid).team===S.my);}
// Vorstand: Ergebnis im Ligaspiel, schneller Anteil mit halbem Gewicht (K28 §5.1, U12a). Der Tabellenplatz zählt seit U12a im trägen Anteil (vorstandWoche).
// Ultimatum und Entlassung: vorstandPruefen in js/vorstand.js.
function vorstandLiga(e,m){const t=myT(),B=RV,home=m.h===S.my,gf=home?m.hg:m.ag,ga=home?m.ag:m.hg,o=S.teams[home?m.a:m.h],str=o.rep>t.rep+B.staerkerAb,wk=o.rep<t.rep-B.staerkerAb;
  S.trust+=B.vertrauen.schnell*(gf>ga?(str?B.sieg.staerker:B.sieg.sonst):gf===ga?(str?B.remis.staerker:wk?B.remis.schwaecher:B.remis.sonst):(str?B.niederlage.staerker:wk?B.niederlage.schwaecher:B.niederlage.sonst));}
