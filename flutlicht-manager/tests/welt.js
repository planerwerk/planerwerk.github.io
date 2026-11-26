// Computer-Vereine (K31 §10, U11a): Kaderplan (Planstellen je Grundordnung, Rang, Talente), Verkaufsregeln A und B, Bedarf, Transferliste, Budget je Fenster,
// gleicher Seed ergibt dieselben Wechsel, dein Verein in der Automatik folgt denselben Regeln. Dann Saisons im Ablauf: Jeder Wechsel wird im Moment des Wechsels
// geprüft (nur im Fenster, Bedarf beim Käufer, Grund A und Regel B beim Verkäufer, Budget, Obergrenze je Fenster), dazu Kadergrößen und Konten am Saisonende.
// Seit U11d1 auch Leihen unter Computer-Vereinen (Nr. 6d, im Ablauf jede Leihe im Moment der Leihe) und das Leihkontingent. Seit U11d2 Vorstand und Trainerwechsel (Nr. 6e, im Ablauf gezählt).
// Die Zielwerte aus K31 §10, die zehn Saisons brauchen (Langzeit-Spannung, ausgewogene Kader, Stars wandern nach oben), zählen erst ab zehn Saisons, sonst werden sie nur ausgegeben.
// Aufruf: node tests/welt.js [Saisons=2] [Seed=5]. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U11a entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt,saisons}=require('./sim');
const N=+(process.argv[2]||2),SEED=+(process.argv[3]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const info=(text,wert)=>console.log(`  ${text}${wert!=null?': '+wert:''}`);
const pc=x=>(x*100).toFixed(0)+' %',f1=x=>x.toFixed(1),m=l=>l.length?l.reduce((a,b)=>a+b,0)/l.length:0;
const welt=(id=9)=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=id;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(id,ev('myT()').form);
  const im=(k,fn)=>ev('mitStrom')(ev('strom')('test',k),fn);return{W,F,S,ev,im,C:ev('RCV')};};
// Einen Tag weiter wie in tests/transfers.js
const schritt=w=>{const S=w.W.S;if(S.sponsOffers)w.F.sponsorWaehlen(0);if(w.ev('heuteMeinSpiel()'))w.F.tagesSpiele(S.tag);w.F.weiter();};
// Protokoll aller Wechsel der Computer-Vereine: Der Zustand wird festgehalten, bevor der Wechsel geschieht. getS liefert den aktuellen Spielstand.
const mitProtokoll=(F,getS,talentBis)=>{const log=[],orig=F.kiWechsel;
  F.kiWechsel=function(p,b,preis,art){const S=getS(),von=p.team>=0?S.teams[p.team]:null,g=F.planGruppe(p),bed=F.planBedarf(F.kaderplan(b));
    const e={s:S.season,tag:S.tag,pid:p.id,nach:b.id,von:von?von.id:-1,preis,g,art:art||'',repDiff:von?b.rep-von.rep:0,offen:F.fensterEnde(S.tag)!=null,nr:F.fensterNr(S.tag),
      bedarf:bed.some(n=>n.grund==='talent'?p.age<=talentBis:n.g===g),grundA:true,regelB:true,kaderVon:99,rest:b.tb?b.tb.b-b.tb.a:-1};
    if(von){const P=F.kaderplan(von);e.grundA=P.abgabe.has(p.id);e.regelB=P.gr[g].l.length>P.gr[g].soll;e.kaderVon=P.alle.length;}
    log.push(e);return orig(p,b,preis,art);};
  return log;};
// Protokoll aller Leihen unter Computer-Vereinen (U11d1), ebenfalls mit dem Zustand vor der Leihe
const mitLeihProtokoll=(F,getS,C)=>{const log=[],orig=F.kiLeihe;
  F.kiLeihe=function(p,b){const S=getS(),von=S.teams[p.team],g=F.planGruppe(p);
    log.push({s:S.season,tag:S.tag,pid:p.id,von:von.id,nach:b.id,alter:p.age,nr:F.fensterNr(S.tag),offen:F.fensterEnde(S.tag)!=null,
      bedarf:F.planBedarf(F.kaderplan(b)).some(n=>n.g===g&&C.leihe.gruende.includes(n.grund)),leihbar:F.kiLeihbar(p,F.kaderplan(von)),kontingent:F.leihErlaubt(p,von.id,b.id),mein:von.id===S.my||b.id===S.my});
    return orig(p,b);};
  return log;};

// 1. Planstellen (K31 §3.1): bei jeder Grundordnung 24, Torwart 3, die Ordnung verschiebt den Plan nur leicht
{const {S,F,ev,C}=welt(),t=S.teams.find(x=>x.id!==S.my&&x.lg===1),alt=t.form,rollen=t.rollen,fehler=[];delete t.rollen;
  for(const f of Object.keys(ev('RE').formationen)){t.form=f;const {soll,stamm}=F.planSoll(t),sum=o=>C.gruppen.reduce((a,g)=>a+o[g],0);
    if(sum(soll)!==24||soll.TW!==3||sum(stamm)!==11||C.gruppen.some(g=>g!=='TW'&&Math.abs(soll[g]-C.planstellen[g])>2))fehler.push(`${f}: ${C.gruppen.map(g=>g+' '+soll[g]).join(', ')}`);}
  t.form='4-3-3';const a=F.planSoll(t).soll;t.form='4-4-2';const b=F.planSoll(t).soll;t.form=alt;if(rollen)t.rollen=rollen;
  pruef(!fehler.length,'Planstellen: bei jeder Grundordnung 24 (Torwart 3, elf Stammplätze), höchstens 2 neben dem Standard',fehler[0]||'alle Grundordnungen');
  pruef(a.ZM===6&&a.OM===2&&a.ST===5&&b.ZM===5&&b.OM===4&&b.ST===4&&b.IV===4&&b.AV===4,'Planstellen: 4-3-3 mit ZM 6, OM 2, ST 5 und 4-4-2 mit ZM 5, OM 4, ST 4',`4-3-3: ZM ${a.ZM}, OM ${a.OM}, ST ${a.ST}`);}

// 2. Rang, Talente, Verkaufsregeln und Bedarf an einem gebauten Kader (4-4-2, alle 26 Jahre): 24 Spieler auf 24 Planstellen
{const {S,F,C}=welt(),t=S.teams.find(x=>x.id!==S.my&&x.lg===2&&x.expPos>6),alt=[t.form,t.rep,t.rollen,t.profil];t.form='4-4-2';t.rep=30;delete t.rollen;delete t.profil; // Ansehen 30: Grundstärke 60, der Anspruch kommt aus dem Kader
  let id=900000;const sp=(fp,str,o)=>Object.assign({id:id++,n:'Test '+id,fp,pos:C.grob[C.gruppeVon[fp]],str,age:26,pot:str,ww:0,inj:0,team:t.id},o||{});
  const basis=()=>[sp('TW',72),sp('TW',66),sp('TW',62),sp('IV',72),sp('IV',71),sp('IV',67),sp('IV',64),sp('LV',71),sp('RV',70),sp('LV',66),sp('RV',64),
    sp('ZM',73),sp('DM',71),sp('ZM',68),sp('SM',66),sp('DM',63),sp('LM',72),sp('RM',70),sp('OM',67),sp('LM',64),sp('MS',74),sp('MS',71),sp('LA',67),sp('HS',64)];
  const plan=k=>F.kaderplan(t,k),bedarf=k=>F.planBedarf(plan(k)),gruende=k=>bedarf(k).map(n=>n.grund+(n.g?' '+n.g:'')).join(', ')||'keiner';
  let k=basis(),P=plan(k);
  pruef(P.abgabe.size===0&&bedarf(k).length===1&&bedarf(k)[0].grund==='talent'&&P.rang.get(k[3].id)==='stamm'&&P.rang.get(k[5].id)==='herausforderer'&&P.rang.get(k[2].id)==='ergaenzung',
    'Voller Kader: niemand wird abgegeben, Bedarf nur „Talent“ (alle sind 26), Rang nach Stärke in der Gruppe',`Bedarf: ${gruende(k)}, abgegeben: ${P.abgabe.size}`);
  k=basis();const ueber=sp('IV',60);k.push(ueber);P=plan(k);
  pruef(P.rang.get(ueber.id)==='ueber'&&P.abgabe.get(ueber.id)==='ueberhang'&&P.abgabe.size===1,'Überhang: Der fünfte Innenverteidiger steht zum Verkauf, sonst niemand',[...P.abgabe.values()].join(', '));
  k=basis();const jung=sp('IV',60,{age:19,pot:75});k.push(jung);P=plan(k);
  pruef(P.rang.get(jung.id)==='talent'&&P.abgabe.size===0,'Talent: Ein überzähliger 19-Jähriger besetzt eine Talent-Planstelle und ist kein Überhang',P.rang.get(jung.id));
  k=basis();k[3].ww=3;P=plan(k);const b3=bedarf(k);
  pruef(P.abgabe.size===0&&b3.some(n=>n.grund==='wechselwunsch'&&n.g==='IV'),'Regel B: Ein Stammspieler mit Wechselwunsch wird nicht abgegeben, solange die Gruppe nicht überbesetzt ist. Erst kaufen, dann verkaufen',gruende(k));
  k.push(sp('IV',70));P=plan(k);
  pruef(P.abgabe.get(k[3].id)==='wechselwunsch'&&!F.planBedarf(P).some(n=>n.grund==='wechselwunsch'),'Nach dem Ersatzkauf darf er gehen, und der Bedarf ist weg (eine Lücke, ein Kauf)',[...P.abgabe.values()].join(', '));
  k=basis();k.splice(13,1);const b5=bedarf(k);
  pruef(b5[0].grund==='offen'&&b5[0].g==='ZM'&&b5[0].prio===3&&b5[0].rang==='ergaenzung'&&Math.abs(b5[0].min-(plan(k).niveau-C.qualitaet.ergaenzung))<1e-9,'Offene Planstelle: hoher Bedarf in der Gruppe, gesucht wird der Rang des freien Platzes',gruende(k));
  k=basis();k[21].str=50;k[22].str=49;k[23].str=48;P=plan(k);const b6=F.planBedarf(P).find(n=>n.grund==='schwach'); // der zweite Stammplatz im Sturm fällt an den Besten der drei Schwachen
  pruef(!!b6&&b6.g==='ST'&&b6.statt===k[21]&&Math.abs(b6.min-(P.niveau-C.qualitaet.stamm))<1e-9&&P.abgabe.size===0,'Schwacher Stammspieler (mehr als 6 unter dem Anspruch): Bedarf „schwach“, er selbst bleibt bis zum Ersatz',gruende(k));
  k=basis();k[20].inj=70;k[22].str=55;k[23].str=54;const b7=bedarf(k);k[22].str=70;const b7b=bedarf(k);
  pruef(b7.some(n=>n.grund==='verletzt'&&n.g==='ST')&&!b7b.some(n=>n.grund==='verletzt'),'Lange verletzter Stammspieler: Bedarf nur ohne brauchbaren Herausforderer',`${b7.map(n=>n.grund).join(', ')} / ${b7b.map(n=>n.grund).join(', ')||'keiner'}`);
  k=basis();const letzter=sp('OM',40);k.push(letzter);const schw=k[19];schw.str=45;P=plan(k);
  pruef(P.abgabe.get(schw.id)==='schwach'&&P.abgabe.get(letzter.id)==='ueberhang'&&P.abgabe.size===2,'Zu schwach für seinen Rang (mehr als 6 unter dem Ziel): steht mit Überhang in der Gruppe zum Verkauf, neben dem Überzähligen',[...P.abgabe.values()].join(', '));
  t.form=alt[0];t.rep=alt[1];if(alt[2])t.rollen=alt[2];if(alt[3])t.profil=alt[3];}

// 3. Transferliste außerhalb des Fensters (keine Wechsel): Auf der Liste steht genau, wer nach dem Plan gehen darf. Preis höchstens Marktwert × Restlaufzeit × Finanzlage.
{const w=welt(),{S,F,ev,im}=w;S.tag=120;const cash0=S.teams.map(t=>t.cash);im('liste',()=>F.kiMarkt());
  let falsch=0,gelistet=0,teuer=0,mein=0;const min=ev('RM').verkaeufer.kaderMin;
  S.teams.forEach(t=>{if(t.lg>3)return;const P=F.kaderplan(t);P.alle.forEach(p=>{if(t.id===S.my){if(p.list)mein++;return;}if(p.wech||p.leihe||p.zwP)return;
      const soll=P.alle.length>min&&P.abgabe.has(p.id);if(!!p.list!==soll)falsch++;if(p.list){gelistet++;if(p.ask>ev('value')(p)*ev('rlFaktor')(p)*ev('RTR').finanzlage.reich+25000||p.ask<25000)teuer++;}});});
  pruef(falsch===0&&gelistet>0&&mein===0,'Transferliste: genau die Spieler, die nach den Verkaufsregeln gehen dürfen. Deine Spieler bleiben unberührt',`${gelistet} auf der Liste, ${falsch} falsch, ${mein} von dir`);
  pruef(teuer===0,'Preis auf der Liste: höchstens Marktwert × Restlaufzeit × Finanzlage, mindestens 25.000 €',`${teuer} außerhalb`);
  pruef(S.teams.every((t,i)=>t.cash===cash0[i])&&S.teams.every(t=>!t.tb),'Außerhalb des Fensters: kein Wechsel, kein Budget, kein Geld bewegt');}

// 4. Eine Fensterwoche: Budget = Konto × Anteil am Anfang des Fensters (Verkäufer bekommen 80 % der Ablöse dazu), jeder Wechsel im Rahmen
{const w=welt(),{S,F,ev,im,C}=w;S.tag=5;const cash0=S.teams.map(t=>t.cash),log=mitProtokoll(F,()=>w.W.S,C.talentBis);im('woche',()=>F.kiMarkt());
  const ein={};log.forEach(e=>{if(e.von>=0)ein[e.von]=(ein[e.von]||0)+Math.round(e.preis*C.finanzen.reinvest);});
  const mitTb=S.teams.filter(t=>t.tb),falsch=mitTb.filter(t=>t.tb.b!==Math.max(0,Math.round(cash0[t.id]*C.finanzen.budgetAnteil[0]*ev('profilWert')(t,'budget',1)))+(ein[t.id]||0)||t.tb.a>t.tb.b||t.cash<0);
  pruef(mitTb.length>0&&!falsch.length&&!S.teams[S.my].tb,'Budget: die Hälfte des Kontos am Anfang des Sommerfensters (ehrgeizig 70 %, sparsam 35 %), Verkäufe erhöhen es, niemand gibt mehr aus. Dein Verein hat keins, solange du die Transfers führst',`${mitTb.length} Vereine mit Budget, ${falsch.length} falsch`);
  pruef(log.every(e=>e.offen&&e.kaderVon>ev('RM').verkaeufer.kaderMin&&e.preis<=e.rest&&(e.art==='stern'||(e.bedarf&&e.grundA&&e.regelB))),'Erste Fensterwoche: jeder Wechsel mit Bedarf, mit Grund, nach Regel B und im Budget',`${log.length} Wechsel, davon ${log.filter(e=>e.von<0).length} Vereinslose`);
  const je={};log.forEach(e=>{je[e.nach]=(je[e.nach]||0)+1;});pruef(Object.values(je).every(n=>n===1),'Eine Lücke, ein Kauf: je Verein höchstens ein Zugang in der Woche');}

// 5. Gleicher Seed, gleiche Wechsel (Sommerfenster bis Mitte September), anderer Verlauf nur durch andere Würfel
{const lauf=()=>{const w=welt(),log=mitProtokoll(w.F,()=>w.W.S,w.C.talentBis);let n=0;while(w.W.S.tag<75&&n++<200)schritt(w);return log.map(e=>[e.tag,e.pid,e.von,e.nach,e.preis].join(':')).join(' ');};
  const a=lauf(),b=lauf();pruef(a===b&&a.length>0,'Gleicher Seed: dieselben Wechsel in derselben Reihenfolge',`${a?a.split(' ').length:0} Wechsel im Sommer`);}

// 6. Automatik (K36): Führt der Verein deine Transfers, gelten für deinen Kader dieselben Regeln (Liste nach Plan, Budget aus dem Konto)
{const w=welt(),{S,F,ev,im,C}=w;F.lizenzStart(true);S.tag=120;im('auto',()=>F.kiMarkt());
  const P=F.kaderplan(S.teams[S.my]),falsch=P.alle.filter(p=>!p.wech&&!p.leihe&&!p.zwP&&!!p.list!==(P.alle.length>ev('RM').verkaeufer.kaderMin&&P.abgabe.has(p.id))).length;
  pruef(ev("autoB('transfers')")&&falsch===0,'Automatik: Als Teamleiter führt der Verein deine Transferliste nach denselben Verkaufsregeln',`${falsch} falsch`);
  S.tag=5;const cash=S.teams[S.my].cash;im('auto2',()=>F.kiMarkt());const tb=S.teams[S.my].tb;
  pruef(!!tb&&tb.a<=tb.b&&tb.b>=Math.max(0,Math.round(cash*C.finanzen.budgetAnteil[0]*ev('profilWert')(S.teams[S.my],'budget',1)))&&S.teams[S.my].cash>=0,'Automatik: Dein Verein bekommt im Fenster ein Budget aus dem Konto und bleibt darin',tb?`Budget ${tb.b}, ausgegeben ${tb.a}`:'kein Budget');}

// 6a. Vereinsprofile (K31 §3.2, §5.7, U11b): „ehrgeizig“ aus der Lage, das zweite Profil gelost, Wirkung auf Qualitätsziel, Talente und Budget
{const {S,F,ev,C}=welt(),akt=S.teams.filter(t=>t.lg<=3),P=C.profile,namen=Object.keys(P.werte),zweite=akt.filter(t=>t.profil),falsch=S.teams.filter(t=>t.profil&&(!P.werte[t.profil]||t.profil==='ehrgeizig'));
  const top=[1,2,3].every(lg=>akt.filter(t=>t.lg===lg).every(t=>F.vereinsProfile(t).includes('ehrgeizig')===(t.expPos<=P.ehrgeizigBis[lg])));
  pruef(top&&!falsch.length&&zweite.length>=akt.length*0.3&&zweite.length<=akt.length*0.9,'Profile: ehrgeizig sind genau die Ersten nach Ansehen je Liga (4, 3, 3), ein zweites Profil haben etwa zwei Drittel der Vereine (30 bis 90 %)',`${zweite.length} von ${akt.length} mit zweitem Profil: ${namen.map(n=>n+' '+akt.filter(t=>t.profil===n).length).join(', ')}`);
  const t=akt.find(x=>x.id!==S.my&&x.lg===2&&x.expPos>6),alt=[t.profil,t.lastLg];delete t.profil;const q0=F.planQualitaet(t).stamm,b0=ev('profilWert')(t,'budget',1);
  t.lastLg=3;const auf=F.vereinsProfile(t).includes('ehrgeizig'),q1=F.planQualitaet(t).stamm,b1=ev('profilWert')(t,'budget',1);t.lastLg=alt[1];
  t.profil='ausbildung';const ta=F.kaderplan(t).talentSoll;t.profil='sparsam';const z=ev('profilWert')(t,'zahlt',1);if(alt[0])t.profil=alt[0];else delete t.profil;
  pruef(q0===C.qualitaet.stamm&&b0===1&&auf&&q1===C.qualitaet.stamm-1&&b1===P.werte.ehrgeizig.budget&&ta[0]===3&&ta[1]===5&&z===0.9,'Profile wirken: Aufsteiger sind ehrgeizig (Qualitätsziel 1 strenger, Budget ×1,4), Ausbildungsverein mit 3 bis 5 Talenten, sparsam zahlt 90 %',`Ziel ${q0} → ${q1}, Budget ×${b1}, Talente ${ta.join('–')}, zahlt ×${z}`);}

// 6b. Sternejagd (K31 §5.3, U11b): Ein ehrgeiziger Verein mit Geld holt einen Spieler über seinem Niveau von einem kleineren Verein, für das außergewöhnliche Angebot, einmal je Saison
{const w=welt(),{S,F,ev,im,C}=w;S.tag=5;const t=S.teams.filter(x=>x.lg===2&&x.id!==S.my).sort((a,b)=>b.rep-a.rep)[0],v=S.teams.filter(x=>x.lg<=3&&x.id!==S.my&&t.rep-x.rep>=C.sterneJagd.ansehenPlus+3).sort((a,b)=>b.rep-a.rep)[0];
  {const sq=ev('squad')(t.id).sort((a,b)=>a.str-b.str);sq.slice(0,Math.max(0,sq.length-26)).forEach(p=>{p.team=-1;});} // Platz im Kader des Käufers (höchstens 30)
  // Der Stern spielt in einer Gruppe, in der die Grundordnung des Käufers einen Stammplatz hat. Stärke 96: Mit 500 Mio € auf dem Konto könnte der Käufer jeden Spieler
  // kleinerer Vereine bezahlen, also muss der Stern klar der Beste sein (auch mit Schätzfehler ±2), sonst nimmt die Jagd einen anderen.
  const niveau=F.kaderplan(t).niveau,plaetze=F.planSoll(t).stamm,q=ev('squad')(v.id).filter(p=>p.pos!=='TW'&&plaetze[F.planGruppe(p)]>0).sort((a,b)=>b.str-a.str)[0];q.str=96;q.pot=Math.max(q.pot,q.str);q.age=24;q.ct=3;q.list=0;delete q.wech;delete q.leihe;
  t.cash=5e8;const soll=ev('value')(q)*C.verkauf.angebotAb*ev('rlFaktor')(q),log=mitProtokoll(F,()=>w.W.S,C.talentBis);
  // T9.2: Seit K23d gilt der Gehaltsrahmen auch für Computer-Vereine. Ein Zweitligist kann das Gehalt eines Sterns der Stärke 96 nie tragen.
  // Hier geht es um die Regeln der Sternejagd, darum ist der Gehaltsrahmen für diesen Fall abgeschaltet (Tests dürfen Regelwerte verstellen, tests/sim.js).
  const B=ev('RFP').budget,sperreAb=B.sperreAb;B.sperreAb=1e9;
  try{for(let i=0;i<14;i++)im('stern'+i,()=>F.kiMarkt());}finally{B.sperreAb=sperreAb;}
  const st=log.filter(e=>e.art==='stern'&&e.nach===t.id),e=st[0];
  pruef(niveau+C.sterneJagd.ueberNiveau<=q.str&&F.vereinsProfile(t).includes('ehrgeizig')&&st.length===1&&e.pid===q.id&&q.team===t.id&&e.preis>=soll-25000&&e.repDiff>=C.sterneJagd.ansehenPlus&&t.tb.s===1,
    'Sternejagd: genau ein Stern je Sommer, der Stärkste eines kleineren Vereins, mindestens 150 % des Marktwerts × Restlaufzeit',e?`${q.n} (${q.str}) von ${v.name} zu ${t.name} für ${e.preis}, Soll mindestens ${Math.round(soll)}`:`kein Stern in 14 Wochen, ${st.length} Käufe`);
  const alle=log.filter(x=>x.art==='stern');pruef(alle.every(x=>x.repDiff>=C.sterneJagd.ansehenPlus&&x.preis<=x.rest&&x.nr===C.sterneJagd.fenster)&&new Set(alle.map(x=>x.nach)).size===alle.length,'Sternejagd: nur nach oben, im Budget, im Sommerfenster, je Verein höchstens einer',`${alle.length} Sterne`);}

// 6c. Verträge nach Rang (K31 §5.8, U11c): Chance je Rang beim Saisonwechsel, früh verlängern im Herbst nur für Gebrauchte, deine Spieler bleiben unberührt
{const w=welt(),{S,F,ev,im,C}=w,V=C.vertrag,t=S.teams.find(x=>x.id!==S.my&&x.lg===1),P=F.kaderplan(t),nach=r=>P.alle.filter(p=>P.rang.get(p.id)===r);
  // Seit T1.3: Gebrauchte ab altAb (30) nur mit chanceAlt (60 %) und nicht früh
  const gross=P.alle.filter(p=>V.wichtig.includes(P.rang.get(p.id))),st=gross.find(p=>!V.altAb||p.age<V.altAb),ab30=V.altAb?gross.find(p=>p.age>=V.altAb):null;
  const ue=nach('ueber')[0],alt=nach('ergaenzung').find(p=>p.age>=V.ergaenzungBis),jung=nach('ergaenzung').find(p=>p.age<V.ergaenzungBis),ch=p=>F.vertragChance(p,P);
  pruef(ch(st)===V.chanceWichtig&&(!ab30||ch(ab30)===V.chanceAlt)&&(!ue||ch(ue)===V.sonst)&&(!alt||ch(alt)===V.sonst)&&(!jung||ch(jung)===V.ergaenzung)&&F.vertragChance(st,null)===ev('RS').vertrag.verlaengern,
    'Verträge nach Rang: Gebrauchte zu 90 % (ab 30 zu 60 %), junge Ergänzung zu 50 %, ältere Ergänzung und Überzählige zu 10 %, ohne Plan die alte Regel (70 %)',`geprüft: Gebrauchter${ab30?', Gebrauchter ab 30':''}${ue?', Überzählige':''}${alt?', ältere Ergänzung':''}${jung?', junge Ergänzung':''}`);
  // Alle auf ein Jahr Restvertrag, dann zwölf Wochen im Oktober (ohne Fenster: kein Wechsel, nur Verträge)
  S.pl.forEach(p=>{if(p.team>=0)p.ct=1;});const rang=new Map();S.teams.forEach(x=>{if(x.lg<=3&&x.id!==S.my){const Q=F.kaderplan(x);Q.alle.forEach(p=>rang.set(p.id,Q.rang.get(p.id)));}});
  S.tag=F.tagAusDatum(`${S.season}-10-05`,S.season);for(let i=0;i<12;i++)im('frueh'+i,()=>F.kiMarkt());
  const altG=p=>V.altAb&&p.age>=V.altAb; // Gebrauchte ab 30 werden nicht früh verlängert (T1.3), sie zählen zu den anderen
  const gebraucht=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&V.wichtig.includes(rang.get(p.id))&&!p.leihe&&!altG(p)),andere=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&rang.has(p.id)&&(!V.wichtig.includes(rang.get(p.id))||altG(p)));
  const verl=gebraucht.filter(p=>p.ct>1).length/Math.max(1,gebraucht.length),soll=1-Math.pow(1-V.frueh.chance,12),falsch=andere.filter(p=>p.ct!==1).length,mein=ev('squad')(S.my).filter(p=>p.ct!==1).length;
  pruef(Math.abs(verl-soll)<=0.06&&falsch===0&&mein===0&&gebraucht.every(p=>p.ct===1||(p.ct>=2&&p.ct<=1+ev('RS').vertrag.jahre[1])),'Früh verlängern: Im Herbst werden nur Gebrauchte gebunden (zwölf Wochen: etwa 86 %), Ergänzung und Überzählige nie, deine Spieler nicht',`${pc(verl)} von ${gebraucht.length}, ${falsch} andere verlängert, ${mein} von dir`);
  // Außerhalb von Oktober bis Dezember passiert nichts (März: kein Fenster, also auch keine Wechsel, die Laufzeiten neu setzen)
  S.pl.forEach(p=>{if(p.team>=0)p.ct=1;});S.tag=F.tagAusDatum(`${S.season+1}-03-10`,S.season);for(let i=0;i<4;i++)im('maerz'+i,()=>F.kiMarkt());
  pruef(S.pl.every(p=>p.team<0||p.ct===1),'Ab Januar verlängert niemand mehr vorzeitig (dann gelten die Vorverträge), geprüft im März');}

// 6d. Leihen unter Computer-Vereinen (K31 §5.9, U11d1): Ein kleiner Zweitligist mit lange verletztem Stammspieler und ohne brauchbaren Ersatz sucht im Winterfenster eine Leihe.
// Leihbar sind nur Überzählige bis 23, nie Spieler deines Vereins. Kontingent: 6 verliehen, 6 ausgeliehen, 3 je Paar, Spieler bis 21 zählen nicht. Am Saisonende sind alle zurück.
{const w=welt(),{S,F,ev,im,C}=w,K=ev('RLE').kontingent,plan=x=>F.kaderplan(x),squad=ev('squad');
  let d=S.tag;while(F.fensterNr(d)!==1&&d<S.tag+400)d++;S.tag=d; // erster Tag des Winterfensters
  const t=S.teams.filter(x=>x.id!==S.my&&x.lg===2).sort((a,b)=>a.rep-b.rep)[0];delete t.profil;
  const P0=plan(t),g=['IV','ZM','ST','AV','OM'].find(x=>P0.gr[x].stamm>0&&P0.gr[x].soll>P0.gr[x].stamm),G0=P0.gr[g];
  // Die Gruppe genau besetzen, den besten Spieler lange verletzen, die Herausforderer deutlich schwächer machen (kein brauchbarer Ersatz).
  // Seit T1.2: Fehlen Spieler, kommen schwache Herausforderer dazu, und die übrigen Stammspieler sind gut genug für ihren Platz. Sonst bliebe nach der Leihe
  // ein zu schwacher Stammspieler übrig, und der Bedarf „verletzt“ hinge an ihm statt an der Verletzung.
  const schwach=Math.round(P0.niveau-P0.Q.herausforderer-4),fp0=Object.keys(C.gruppeVon).find(k=>C.gruppeVon[k]===g);
  G0.l.slice(G0.soll).forEach(p=>{p.team=-1;p.list=0;});for(let i=G0.l.length;i<G0.soll;i++)F.addP(F.mkPlayer({pos:C.grob[g],fp:fp0,team:t.id,age:27,str:schwach}));
  G0.l[0].inj=70;G0.l.slice(1,G0.stamm).forEach(p=>{p.str=Math.max(p.str,Math.round(P0.niveau-P0.Q.stamm));p.inj=0;});G0.l.slice(G0.stamm,G0.soll).forEach(p=>{p.str=schwach;});
  const n=F.planBedarf(plan(t)).find(x=>x.grund==='verletzt'&&x.g===g);
  // Beim Verleiher (stärkster Erstligist) einen 22-Jährigen dazu, der dort Überhang ist und beim Zweitligisten Herausforderer wäre
  const v=S.teams.filter(x=>x.id!==S.my&&x.lg===1).sort((a,b)=>b.rep-a.rep)[0];delete v.profil;
  const fp=Object.keys(C.gruppeVon).find(k=>C.gruppeVon[k]===g),neu=o=>F.addP(F.mkPlayer(Object.assign({pos:C.grob[g],fp,team:v.id,age:27,str:85},o)));
  for(let i=plan(v).gr[g].l.length;i<plan(v).gr[g].soll;i++)neu({});
  const q=neu({age:22,str:Math.round((n?n.min:60)+2)});q.pot=q.str;q.inj=0;const Pv=plan(v);
  pruef(!!n&&Pv.rang.get(q.id)==='ueber'&&F.kiLeihbar(q,Pv)&&!F.kiLeihbar(Pv.gr[g].l[0],Pv),'Leihbar: ein Überzähliger bis 23 Jahre, nie ein Stammspieler',n?`Bedarf „verletzt“ in ${g}, Rang des 22-Jährigen beim Verleiher: ${Pv.rang.get(q.id)}`:'kein Bedarf „verletzt“');
  const c=n?im('leihe',()=>F.kiLeihKandidat(t,n,0,plan,F.leihZaehler())):null;
  pruef(!!c&&c.von!==S.my&&c.p.str>=n.min&&F.planGruppe(c.p)===g&&F.kiLeihbar(c.p,plan(S.teams[c.von])),'Leihkandidat: passt in die Gruppe, stark genug, beim Verleiher leihbar, nie von deinem Verein',c?`${c.p.n} (Stärke ${c.p.str}, ${c.p.age} Jahre) von ${S.teams[c.von].name}`:'keiner');
  if(c){const geld=[t.cash,S.teams[c.von].cash];F.kiLeihe(c.p,t);const weg=!F.planBedarf(plan(t)).some(x=>x.grund==='verletzt'&&x.g===g);
    pruef(c.p.team===t.id&&!!c.p.leihe&&c.p.leihe.von===c.von&&weg&&t.cash===geld[0]&&S.teams[c.von].cash===geld[1],'Leihe: Er spielt bis zum Saisonende beim Zweitligisten, ohne Geld, und der Bedarf ist weg (eine Lücke, ein Zugang)',`Bedarf weg: ${weg}`);}
  // Kontingent: 3 Vereine verleihen je 2 Spieler über 21 an Verein u, dann ist u voll (ein 22-Jähriger nein, ein 21-Jähriger ja). Paar: 3 von Verein a an Verein b, der vierte nicht, an Verein e schon.
  const leihSetzen=(p,zu)=>{p.leihe={von:p.team,anteil:0,rolle:'rotation',rueckruf:false,option:0,start:0};p.team=zu;p.list=0;},alt=x=>squad(x.id).filter(p=>p.age>K.freiBis&&!p.leihe&&!p.wech);
  const frei=S.teams.filter(x=>x.id!==S.my&&x.id!==t.id&&x.id!==v.id&&x.lg<=3),[u,a,b,e,...geber]=frei;
  geber.slice(0,3).forEach(x=>alt(x).slice(0,2).forEach(p=>leihSetzen(p,u.id)));
  const x4=alt(geber[3])[0],j4=squad(geber[3].id).find(p=>p.age<=K.freiBis),z1=F.leihZaehler();
  alt(a).slice(0,3).forEach(p=>leihSetzen(p,b.id));const a4=alt(a)[0],z2=F.leihZaehler();
  pruef(z1.ein.get(u.id)===K.max&&!F.leihErlaubt(x4,geber[3].id,u.id,z1)&&(!j4||F.leihErlaubt(j4,geber[3].id,u.id,z1))&&!F.leihErlaubt(a4,a.id,b.id,z2)&&F.leihErlaubt(a4,a.id,e.id,z2),
    'Kontingent: höchstens 6 Spieler über 21 ausgeliehen, höchstens 3 von einem Verein an denselben anderen, Spieler bis 21 zählen nicht',`ausgeliehen bei ${u.name}: ${z1.ein.get(u.id)}, ${a.name} → ${b.name}: ${z2.paar.get(a.id+'>'+b.id)}`);
  F.leiheEnde();pruef(S.pl.every(p=>!p.leihe)&&(!c||c.p.team===c.von),'Saisonende: Alle Leihen enden, jeder ist zurück bei seinem Verein',`${S.pl.filter(p=>p.leihe).length} noch verliehen`);}

// 6e. Trainerwechsel bei Computer-Vereinen (K28 §7, K31 §5.10, U11d2): Präsident fest aus der Vereinsnummer. Der Favorit verliert zehnmal: Vertrauen unter 20, Ultimatum über zwei Spiele,
// Entlassung spätestens nach dem zweiten Ultimatum, Stimmungsschub, Vertrauen zurück auf 55. Der Zweite gewinnt immer und bekommt kein Ultimatum. Dein Verein hat diesen Vorstand nicht.
{const w=welt(),{S,F,ev,im,C}=w,V=C.vorstand,squad=ev('squad'),stimmung=ev('stimmung');
  const lg1=S.teams.filter(t=>t.lg===1&&t.id!==S.my).sort((a,b)=>a.expPos-b.expPos),x=lg1[0],y=lg1[1],geg=lg1.slice(2);
  const pr=F.praesident(x);
  pruef(pr.geduld===F.praesident(x).geduld&&S.teams.every(t=>{const g=F.praesident(t).geduld;return g>=1&&g<=20;}),'Präsident: Geduld 1 bis 20, fest aus der Vereinsnummer',`Geduld ${pr.geduld}, Entlassung nach dem ersten Ultimatum ${pc(F.kiEntlassChance(x))}`);
  let k=0;const spiele=n=>{for(let i=0;i<n;i++){const g=geg[k++%geg.length].id;S.res[1].push([x.id,g,0,3]);S.res[1].push([y.id,g,3,0]);}};
  const st0=squad(x.id).reduce((a,p)=>a+stimmung(p),0),stil0=x.stil;
  spiele(10);for(let i=0;i<8;i++)im('vk'+i,()=>F.kiVorstandWoche());const o=x.vor;
  pruef(!!o&&o.v<V.grenze&&o.u===10&&o.n===1&&!!y.vor&&y.vor.u==null&&!S.teams[S.my].vor,'Niederlagenserie: Vertrauen unter 20, Ultimatum über zwei Spiele. Der Verein mit Siegen bekommt keins, dein Verein hat diesen Vorstand nicht',o?`Vertrauen ${o.v}, Ultimatum ab Spiel ${o.u}, beim Zweiten ${y.vor?y.vor.v:'–'}`:'kein Vorstand');
  let runden=0;const weg=()=>(S.trainerWechsel||[]).some(e=>e.t===x.id);while(!weg()&&runden<3){spiele(2);im('vu'+runden,()=>F.kiVorstandWoche());runden++;}
  const st1=squad(x.id).reduce((a,p)=>a+stimmung(p),0);
  pruef(weg()&&runden<=2&&x.vor.v===V.start&&x.vor.u==null&&x.vor.ab>=12&&st1>st0,'Entlassung spätestens nach dem zweiten Ultimatum: neuer Trainer mit Vertrauen 55, neue Schonfrist, Stimmungsschub für alle',
    `nach ${runden} Ultimatum-Runde(n), Stil ${stil0} → ${x.stil}, Stimmung ${st0} → ${st1}`);
  // Saisonwechsel: Ziel weit verfehlt und wenig Vertrauen → Wechsel im Sommer; alle anderen halb zurück zum Start
  const z=lg1[2];z.lastPos=z.expPos+V.saisonWeitAb+2;F.kiVor(z).v=V.saisonUnter-5;const y0=y.vor.v,n0=S.trainerWechsel.length;im('vs',()=>F.kiVorstandSaison());
  pruef(S.trainerWechsel.length===n0+1&&S.trainerWechsel[n0].t===z.id&&Math.abs(y.vor.v-(y0+(V.start-y0)*V.saisonZurueck))<0.11&&y.vor.ab===0,'Saisonwechsel: Ziel weit verfehlt und wenig Vertrauen, Wechsel im Sommer. Die anderen gehen halb zurück zum Start',`${S.trainerWechsel.length-n0} Wechsel im Sommer`);}

// 7. Saisons im Ablauf: jeder Wechsel geprüft, Zahl der Wechsel, Obergrenze je Fenster, Kader und Konten am Saisonende
{const R0=neueWelt().W,C=R0.ev('RCV'),RM=R0.ev('RM');let log=null,leihLog=null,S0=null,evL=null;const ende=[],fuell=[],nochVerliehen=[];
  const lauf=saisons({n:N,seed:SEED,verein:6,vorher:(F,W)=>{evL=W.ev;},
    beiSaisonstart:(S,F)=>{if(log){nochVerliehen.push(S.pl.filter(p=>p.leihe).length);return;}S0=S;log=mitProtokoll(F,()=>S0,C.talentBis);leihLog=mitLeihProtokoll(F,()=>S0,C);const orig=F.planAuffuellen;F.planAuffuellen=function(t,P,l){const n=orig(t,P,l);fuell.push({s:S0.season,t:t.id,n});return n;};},
    beiSaisonende:(S,F)=>{const z={s:S.season,offen:0,leer:0,ueber2:0,vereine:0,kader:[],minus:0,ueberKredit:0,gebraucht:0,laufenAus:0};
      // Seit K23c haben auch Computer-Vereine einen Kreditrahmen: ein Konto im Minus ist erlaubt, nur nicht unter dem Kreditrahmen (T9.3, Lauf 10)
      S.teams.forEach(t=>{if(t.lg>3||t.id===S.my)return;z.vereine++;const P=F.kaderplan(t);z.kader.push(P.alle.length);if(t.cash<0)z.minus++;if(t.cash<-evL('kreditRahmen')(t))z.ueberKredit++;let u2=false;
        P.alle.forEach(p=>{if(C.vertrag.wichtig.includes(P.rang.get(p.id))){z.gebraucht++;if(p.ct===1)z.laufenAus++;}});
        C.gruppen.forEach(g=>{const G=P.gr[g];if(G.l.length<G.soll)z.offen+=G.soll-G.l.length;if(!G.l.length&&G.soll>0)z.leer++;if(G.l.filter(p=>P.rang.get(p.id)==='ueber').length>2)u2=true;});if(u2)z.ueber2++;});
      ende.push(z);}});
  const S=lauf.W.S,ev=lauf.W.ev,jahre=[...new Set(log.map(e=>e.s))];
  pruef(log.length>0&&log.every(e=>e.offen),'Wechsel der Computer-Vereine nur im Fenster',`${log.length} Wechsel in ${N} Saison(s), ${log.filter(e=>!e.offen).length} außerhalb`);
  const ohne=log.filter(e=>e.art!=='stern'&&!e.bedarf).length;pruef(ohne<=log.length*0.01,'Kein Kaderchaos: höchstens 1 % der Käufe ohne Bedarf in der Gruppe (K31 §10)',`${ohne} von ${log.length}`);
  const vk=log.filter(e=>e.von>=0&&e.art!=='stern'),regel=vk.filter(e=>!e.grundA||!e.regelB||e.kaderVon<=RM.verkaeufer.kaderMin).length;
  pruef(regel===0,'Verkaufsregeln: kein Verkauf ohne Grund A, keine Gruppe nach dem Verkauf unter ihren Planstellen, kein Verein unter 21 Spielern (K31 §10)',`${regel} von ${vk.length} Verkäufen`);
  pruef(log.every(e=>e.preis<=e.rest),'Budget: kein Kauf über dem Rest des Budgets',`${log.filter(e=>e.preis>e.rest).length} darüber`);
  {const st=log.filter(e=>e.art==='stern'),je={};st.forEach(e=>{const k=e.s+':'+e.nach;je[k]=(je[k]||0)+1;});
    pruef(st.every(e=>e.nr===C.sterneJagd.fenster&&e.repDiff>=C.sterneJagd.ansehenPlus)&&Object.values(je).every(n=>n===1),'Sternejagd im Ablauf: nur im Sommer, nur nach oben, je Verein und Saison höchstens einer',`${st.length} Sterne in ${N} Saison(s)`);}
  // Leihen (U11d1): jede im Moment der Leihe geprüft, nach jedem Saisonwechsel niemand mehr verliehen
  {const falsch=leihLog.filter(e=>!(e.offen&&e.bedarf&&e.leihbar&&e.kontingent&&!e.mein));
    pruef(!falsch.length,'Leihen unter Computer-Vereinen: nur im Fenster, nur für eine Lücke (verletzt oder offen), nur Leihbare, im Kontingent, nie mit deinem Verein',`${leihLog.length} Leihen, ${falsch.length} falsch`);
    pruef(nochVerliehen.every(x=>x===0),'Leihen enden mit der Saison: nach jedem Saisonwechsel ist niemand mehr verliehen',nochVerliehen.join(', ')||'kein Saisonwechsel im Lauf');
    [...new Set(leihLog.map(e=>e.s))].forEach(s=>{const l=leihLog.filter(e=>e.s===s);info(`Saison ${s}: Leihen unter Computer-Vereinen`,`Sommer ${l.filter(e=>e.nr===0).length}, Winter ${l.filter(e=>e.nr===1).length}, davon Spieler bis 21: ${l.filter(e=>e.alter<=21).length}`);});}
  // Trainerwechsel (U11d2): je Saison und Liga, während der Saison und im Sommer danach. Ziel 4 bis 10 in der 1. Liga (K31 §10), bis zur Kalibrierung nur grob gewertet.
  {const tw=S.trainerWechsel||[],je={},proVerein={};tw.forEach(e=>{je[e.s+':'+e.lg]=(je[e.s+':'+e.lg]||0)+1;proVerein[e.s+':'+e.t]=(proVerein[e.s+':'+e.t]||0)+1;});
    jahre.forEach(s=>info(`Saison ${s}: Trainerwechsel`,`1. Liga ${je[s+':1']||0}, 2. Liga ${je[s+':2']||0}, 3. Liga ${je[s+':3']||0} (Ziel 1. Liga: 4 bis 10)`));
    const max1=Math.max(0,...jahre.map(s=>je[s+':1']||0)),maxV=Object.entries(proVerein).sort((a,b)=>b[1]-a[1])[0]; // welche Grenze verletzt ist (Lauf 10 nannte nur die Summe)
    pruef(jahre.every(s=>(je[s+':1']||0)<=18)&&Object.values(proVerein).every(n=>n<=3),'Trainerwechsel nicht absurd: höchstens 18 je Saison in der 1. Liga, kein Verein öfter als dreimal in einer Saison',
      `${tw.length} Wechsel in ${N} Saison(s), 1. Liga höchstens ${max1} je Saison, ein Verein höchstens ${maxV?maxV[1]:0}${maxV?` (Saison ${maxV[0].split(':')[0]}, ${S.teams[+maxV[0].split(':')[1]]?S.teams[+maxV[0].split(':')[1]].name:'?'})`:''}`);}
  const jeFenster={};[...log,...leihLog].forEach(e=>{const k=e.s+':'+e.nr+':'+e.nach;jeFenster[k]=(jeFenster[k]||0)+1;});
  const zuViel=Object.entries(jeFenster).filter(([k,n])=>n>C.kauf.jeFenster[+k.split(':')[1]]).length;pruef(zuViel===0,'Obergrenze: höchstens 4 Zugänge über den Markt im Sommer und 2 im Winter je Verein, Leihen eingerechnet',`${zuViel} darüber`);
  jahre.forEach(s=>{const l=log.filter(e=>e.s===s),bez=l.filter(e=>e.von>=0),so=l.filter(e=>e.nr===0),wi=l.filter(e=>e.nr===1),f=fuell.filter(x=>x.s===s),z=ende.find(x=>x.s===s)||{vereine:55};
    pruef(bez.length>=15,`Saison ${s}: mindestens 15 Wechsel mit Ablöse unter Computer-Vereinen (wie tests/transfers.js)`,`${bez.length} mit Ablöse, ${l.length-bez.length} Vereinslose`);
    info(`Saison ${s}: Zugänge über den Markt je Verein`,`Sommer ${f1(so.length/z.vereine)}, Winter ${f1(wi.length/z.vereine)} (K31 §10 nennt 3–8 und 0–3 für alle Zugänge zusammen)`);
    info(`Saison ${s}: am Ende des Sommerfensters aufgefüllt`,`${f.reduce((a,x)=>a+x.n,0)} Spieler bei ${f.filter(x=>x.n>0).length} Vereinen`);});
  ende.forEach(z=>{const mn=Math.min(...z.kader),mx=Math.max(...z.kader);
    pruef(mn>=15&&mx<=36&&z.ueberKredit===0&&z.leer===0,`Saisonende ${z.s}: Kader zwischen 15 und 36, keine Gruppe ganz leer, kein Konto unter dem Kreditrahmen`,`Kader ${mn} bis ${mx}, ${z.leer} leere Gruppen, ${z.ueberKredit} unter dem Kreditrahmen (${z.minus} im Minus, erlaubt)`);
    info(`Saisonende ${z.s}: offene Planstellen je Verein`,`${f1(z.offen/z.vereine)}, Vereine mit mehr als 2 Spielern Überhang in einer Gruppe: ${pc(z.ueber2/z.vereine)}`);
    info(`Saisonende ${z.s}: Gebrauchte mit auslaufendem Vertrag (U11c, früh verlängert sollten es unter 20 % sein)`,`${z.laufenAus} von ${z.gebraucht} (${pc(z.laufenAus/Math.max(1,z.gebraucht))})`);});
  // Budget genutzt (K31 §10: 60 bis 100 %): Anteil des Winterbudgets der letzten Saison, der ausgegeben wurde (das Sommerbudget ist dann schon überschrieben)
  {const tb=S.teams.filter(t=>t.tb&&t.tb.b>0).map(t=>t.tb.a/t.tb.b);info('Budget genutzt im letzten Fenster (nur zur Ansicht)',tb.length?pc(m(tb)):'kein Budget');}
  // Zielwerte, die zehn Saisons brauchen (K31 §10)
  const letzte=ende[ende.length-1],top5=S.teams.filter(t=>t.lg<=3).sort((a,b)=>b.rep-a.rep).slice(0,5),platz=top5.map(t=>t.lg===1?t.lastPos:18+t.lastPos),
    stars=S.pl.filter(p=>p.team>=0&&p.str>=85),oben=stars.filter(p=>S.teams[p.team].rep>75).length;
  if(N>=10){
    pruef(m(platz)<=8,'Langzeit-Spannung: Die fünf Vereine mit dem höchsten Ansehen stehen im Schnitt unter den besten acht (K31 §10)',`Ø Platz ${f1(m(platz))}`);
    pruef(letzte.leer===0&&letzte.ueber2<=letzte.vereine*0.05,'Ausgewogene Kader: keine Gruppe unbesetzt, höchstens 5 % der Vereine mit mehr als 2 Spielern Überhang je Gruppe (K31 §10)',`${pc(letzte.ueber2/letzte.vereine)}`);
    pruef(!stars.length||oben/stars.length>=0.7,'Stars wandern nach oben: Spieler ab Stärke 85 zu mindestens 70 % bei Vereinen mit Ansehen über 75 (K31 §10)',`${oben} von ${stars.length}`);}
  else{info('Erst ab zehn Saisons gewertet (node tests/welt.js 10): Langzeit-Spannung',`fünf höchste Ansehen im Schnitt auf Platz ${f1(m(platz))}`);
    info('Erst ab zehn Saisons gewertet: Stars bei Vereinen mit Ansehen über 75',`${oben} von ${stars.length}`);}
  info('Nicht gebaut und nicht geprüft','Klugheit, Vorverträge und Klauseln unter Computer-Vereinen (K31 §10, Rest von U11d)');}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
