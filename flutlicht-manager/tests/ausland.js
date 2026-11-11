// Auslandspool und Nationalitäten (K32 §3.1, §3.2, §10; K18 Ausland; K03 Nationalität; U9b).
// Daten (Länder, Vereine, Kern), vollständige Poolspieler, Nationalität für alle Spieler, eigener Zufallsstrom, Grundkenntnis 5 mit ehrlicher Spanne,
// Gebiet der Scouts, Reisekosten, Suchauftrag im Ausland, Kauf und Verkauf, Speichern und Laden, Pool über mehrere Saisons stabil, Spielstand unter 3 MB.
// Aufruf: node tests/ausland.js [Saisons=6] [Seed=5]. Nur Node.js.
const {neueWelt,saisons}=require('./sim');
const N=+(process.argv[2]||6),SEED=+(process.argv[3]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const pc=x=>(x*100).toFixed(0)+' %',mw=a=>a.reduce((x,y)=>x+y,0)/(a.length||1);
const welt=(verein=6,vorher=null)=>{const {W,F}=neueWelt();F.__ev=W.ev;if(vorher)vorher(F,W);F.buildWorld(SEED);const S=W.S;S.my=verein;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(verein,W.ev('myT()').form);return{W,F,S,ev:W.ev};};
// Ein Test-Scout im eigenen Verein mit fester Qualität und gewünschtem Gebiet (das Gebiet ergibt sich aus der Nummer)
const scout=(S,F,q,gebiet,ev=F.__ev)=>{let x;for(let i=0;i<80;i++){x=F.stabNeu('scout',q,S.my,1);S.stab.push(x);ev('stabGeaendert')();if(!gebiet||ev('scoutGebiet')(x)===gebiet)return x;S.stab.pop();}return x;};

// 1. Daten (K32 §3.1): etwa 12 Länder mit je 12–20 Vereinen, echte Namen eindeutig, Kern 6–10 je Verein, Pool 1.500–2.500 Spieler
{const {S,ev}=welt(),V=S.ausland.v,pl=S.ausland.pl,gr={};V.forEach(v=>{const g=ev('avGruppe')(v);gr[g]=(gr[g]||0)+1;});const zahl=Object.values(gr);
  pruef(Object.keys(gr).length===12&&zahl.every(n=>n>=12&&n<=20),'Zwölf Länder mit je 12–20 Vereinen',Object.entries(gr).map(([g,n])=>`${ev('gruppenName')(g)} ${n}`).join(', '));
  const deutsch=new Set(S.teams.map(t=>t.name));
  pruef(new Set(V.map(v=>v.name)).size===V.length&&V.every(v=>ev('nation')(v.land)&&!deutsch.has(v.name)&&[1,2,3].includes(v.stufe)&&v.rep>0&&v.rep<=99&&v.fin>0&&v.fin<=99),'Vereinsnamen eindeutig, Land bekannt, Stufe, Ansehen und Finanzkraft im Bereich',`${V.length} Vereine`);
  const kern=V.map(v=>ev('avKader')(v.id).length);
  pruef(kern.every(n=>n>=6&&n<=10)&&pl.length>=1500&&pl.length<=2500,'Kern 6–10 Spieler je Verein, Pool 1.500–2.500',`${pl.length} Poolspieler, Kern ${Math.min(...kern)}–${Math.max(...kern)}`);
  const teile=V.every(v=>{const k=ev('avKader')(v.id);return['TW','AB','MF','ST'].every(x=>k.some(p=>p.pos===x));});
  pruef(teile,'Jeder Kern hat Torwart, Abwehr, Mittelfeld und Sturm');
  // 2. Poolspieler haben alle Werte aus K03, liegen getrennt von den Ligaspielern und sind über PIX erreichbar
  const felder=['str','pot','form','fit','ko','sp','sv','sal','age','ct','inj'],PIX=ev('PIX'),liga=new Set(S.pl.map(p=>p.id));
  const ok=pl.every(p=>felder.every(k=>typeof p[k]==='number'&&isFinite(p[k]))&&p.ch&&p.fp&&p.fuss&&p.mk&&p.nat&&p.n&&p.team>=2000&&ev('avVon')(p.team)&&PIX.get(p.id)===p&&!liga.has(p.id)&&p.pot>=p.str);
  pruef(ok&&PIX.size===S.pl.length+pl.length&&S.pl.every(p=>p.team<2000),'Poolspieler mit allen Werten, eigenem Nummernkreis, getrennt von den Ligaspielern, über PIX erreichbar',`PIX ${PIX.size}`);
  const top=pl.filter(p=>ev('avVon')(p.team).rep>=90),unten=pl.filter(p=>ev('avVon')(p.team).rep<62);
  pruef(mw(top.map(p=>p.str))>mw(unten.map(p=>p.str))+12,'Stärke folgt dem Ansehen des Vereins',`Spitzenvereine Ø ${mw(top.map(p=>p.str)).toFixed(1)}, kleine Vereine Ø ${mw(unten.map(p=>p.str)).toFixed(1)}`);
  const jung=pl.filter(p=>p.age<=21),A=ev('RW').ausland,plaetze=V.reduce((a,v)=>a+A.talente[v.stufe],0);
  pruef(jung.length===plaetze&&V.every(v=>ev('avKader')(v.id).filter(p=>p.age<=21).length===A.talente[v.stufe])&&mw(jung.map(p=>p.pot-p.str))>=5,'Talente im Pool: jeder Verein hat seine Talentplätze besetzt, mit Luft nach oben',`${jung.length} bis 21 Jahre, Talent Ø +${mw(jung.map(p=>p.pot-p.str)).toFixed(1)}`);
  const top90=pl.filter(p=>p.str>=90).length,liga90=S.pl.filter(p=>p.str>=90).length;
  pruef(top90>=3&&top90<=30&&Math.max(...pl.map(p=>p.str))<=96,'Weltklasse bleibt selten: 3–30 Poolspieler ab Stärke 90, keiner über 96',`${top90} ab 90 (deutsche Ligen: ${liga90}), stärkster ${Math.max(...pl.map(p=>p.str)).toFixed(0)}`);

  // 3. Nationalität (K03, K32 §3.2): jeder Spieler hat eine Nation aus der Tabelle, echte Spieler aus den Daten, im Pool überwiegend aus dem Land
  const alle=S.pl.concat(pl),ohne=alle.filter(p=>!ev('nation')(p.nat));
  pruef(!ohne.length,'Alle Spieler (Ligen, Vereinslose, Pool) haben eine Nationalität aus daten/nationen.js',`${alle.length} Spieler, ${new Set(alle.map(p=>p.nat)).size} Nationen`);
  const KADER=ev('KADER'),VEREINE=ev('VEREINE');let echte=0,falsch=0;S.teams.forEach((t,i)=>{(KADER[VEREINE[i].kurz]||[]).forEach(([n,,,,nat])=>{const p=S.pl.find(q=>q.team===i&&q.n===n);if(!p)return;echte++;if(p.nat!==nat||!nat)falsch++;});});
  pruef(echte>900&&!falsch,'Echte Spieler tragen die Nationalität aus daten/spieler.js',`${echte} geprüft`);
  const erf=S.pl.filter(p=>p.team>=0&&S.teams[p.team].lg===3),de=erf.filter(p=>p.nat==='GER').length/erf.length;
  pruef(de>=0.65&&de<=0.9,'Erfundene Spieler der deutschen Vereine: 65–90 % Deutsche (3. Liga)',pc(de));
  const heim=pl.filter(p=>p.nat===ev('avVon')(p.team).land).length/pl.length,jeStufe=[1,2,3].map(s=>{const x=pl.filter(p=>ev('avVon')(p.team).stufe===s);return x.filter(p=>p.nat===ev('avVon')(p.team).land).length/x.length;});
  pruef(heim>0.5&&jeStufe[0]<jeStufe[2],'Pool überwiegend aus dem Land des Vereins, bei Spitzenvereinen mehr Legionäre',`${pc(heim)} einheimisch (Spitze ${pc(jeStufe[0])}, unten ${pc(jeStufe[2])})`);
  const NAMEN=ev('NAMEN'),NN=ev('NAMEN_NATION'),mitRaum=pl.filter(p=>NN[p.nat]),passt=mitRaum.filter(p=>NAMEN[NN[p.nat]].n.split(',').some(n=>p.n.endsWith(' '+n))).length;
  pruef(passt===mitRaum.length&&new Set(pl.map(p=>p.n)).size>pl.length*0.98,'Namen passen zur Nation, kaum doppelte Namen',`${mitRaum.length} geprüft, ${pl.length-new Set(pl.map(p=>p.n)).size} doppelt`);
  const rueck=pl.filter(p=>p.nat==='GER').length;pruef(rueck>=10,'Deutsche Spieler im Pool (mögliche Rückkehrer)',rueck);
  pruef(ev('landsleute')(pl.find(p=>p.nat==='FRA'),pl.filter(p=>p.nat==='FRA')[1])&&ev('gleicheSprache')({nat:'GER'},{nat:'AUT'})&&!ev('gleicheSprache')({nat:'GER'},{nat:'FRA'}),'Landsleute und gemeinsame Sprache lassen sich ableiten');
  // 12. Spielstand (K32 §3.1, K33): unter 3 MB
  const kb=JSON.stringify(S).length/1024;pruef(kb<3072,'Spielstand zum Start unter 3 MB',`${Math.round(kb)} KB, davon Pool ${Math.round(JSON.stringify(S.ausland).length/1024)} KB`);}

// 4. Eigener Zufallsstrom: Die deutsche Welt ist mit und ohne Auslandspool gleich (Spieler, Stab, Zufallszustand)
{const a=welt(),b=welt(6,F=>{F.auslandAufbau=function(){};});
  pruef(JSON.stringify(a.S.pl)===JSON.stringify(b.S.pl)&&JSON.stringify(a.S.stab)===JSON.stringify(b.S.stab)&&JSON.stringify(a.S.zufall)===JSON.stringify(b.S.zufall)&&a.S.pid===b.S.pid,'Der Pool ändert die deutsche Welt nicht (eigener Zufallsstrom, eigener Nummernkreis)');
  const c=welt();pruef(JSON.stringify(a.S.ausland)===JSON.stringify(c.S.ausland),'Gleicher Seed, gleicher Pool');}

// 5. Grundkenntnis 5 und ehrliche Spanne (K18 §3.1, §10): Der wahre Wert liegt auch im Ausland in mindestens 80 % der Fälle in der Spanne
{const {S,F,ev}=welt(),pl=S.ausland.pl;S.kenntnis={};let alleOk=true;const zeilen=[];
  pruef(pl.every(p=>ev('grundKenntnis')(p)===5&&ev('kenntnis')(p)===5),'Grundkenntnis für Spieler im Ausland: 5');
  const pruefe=(name,setze)=>{let drin=0,breite=0;pl.forEach(p=>{setze(p);const s=F.staerkeSicht(p);breite+=s.hi-s.lo;if(p.str>=s.lo-0.5&&p.str<=s.hi+0.5)drin++;});const q=drin/pl.length;if(q<0.8)alleOk=false;zeilen.push(`${name} ${pc(q)} (±${(breite/pl.length/2).toFixed(1)})`);};
  pruefe('Grundkenntnis',p=>{delete S.kenntnis[p.id];});
  for(const q of [4,10,17]){const x=scout(S,F,q,'ausland');for(const k of [30,60,90])pruefe(`Q${q}/K${k}`,p=>{S.kenntnis[p.id]={k,s:[x.id]};});}
  S.kenntnis={};pruef(alleOk,'Ehrlichkeit im Ausland: wahrer Wert in mindestens 80 % der Fälle in der Spanne',zeilen.join(', '));
  const grob=mw(pl.map(p=>{const s=F.staerkeSicht(p);return(s.hi-s.lo)/2;})),inl=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&S.teams[p.team].lg===2),fein=mw(inl.map(p=>{const s=F.staerkeSicht(p);return(s.hi-s.lo)/2;}));
  pruef(grob>=8&&grob>fein*1.5,'Ohne Scout ist die Spanne im Ausland deutlich gröber als im Inland',`Ausland ±${grob.toFixed(1)}, andere deutsche Liga ±${fein.toFixed(1)}`);
  pruef(pl.slice(0,300).every(p=>ev('merkmaleSicht')(p).liste.length===0),'Merkmale von Auslandsspielern sind ohne Scout unbekannt');}

// 6. Gebiet der Scouts (K18 §5.1): Ein Scout mit dem Gebiet Ausland lernt dort 1,3-fach, ein Inland-Scout 0,8-fach, im Inland umgekehrt
{const {S,F,ev}=welt(),a=scout(S,F,10,'ausland'),i=scout(S,F,10,'inland'),pa=S.ausland.pl.find(p=>p.age>23),pi=S.pl.find(p=>p.team>=0&&p.team!==S.my&&S.teams[p.team].lg===2&&p.age>23);
  const gewinn=(p,x)=>{S.kenntnis={};const k0=ev('kenntnis')(p);F.kenntnisPlus(p,x,1);return S.kenntnis[p.id].k-k0;};
  const aa=gewinn(pa,a),ia=gewinn(pa,i),ai=gewinn(pi,a),ii=gewinn(pi,i);
  pruef(Math.abs(aa/ia-1.3/0.8)<0.01&&Math.abs(ii/ai-1.3/0.8)<0.01,'Scouts wirken im eigenen Gebiet 1,3-fach, außerhalb 0,8-fach',`Ausland: Auslandsscout +${aa.toFixed(1)}, Inlandsscout +${ia.toFixed(1)} je Woche; Inland: +${ai.toFixed(1)} und +${ii.toFixed(1)}`);
  const wochen=x=>{S.kenntnis={};let w=0;while(ev('kenntnis')(pa)<60&&w<20){w++;F.kenntnisPlus(pa,x,1);}return w;};const wa=wochen(a),wi=wochen(i);
  pruef(wa>=3&&wa<=5&&wi>wa,'Tempo im Ausland: Auslandsscout (Qualität 10) in 3–5 Wochen auf Kenntnis 60, Inlandsscout braucht länger',`${wa} gegen ${wi} Wochen`);S.kenntnis={};}

// 7. Reisekosten (K18 §5.4): Beobachtung im Ausland 15.000 € je Woche, im Inland 3.000 €; Bericht nennt den Auslandsverein
{const {S,F,ev}=welt(),a=scout(S,F,12,'ausland'),i=scout(S,F,12,'inland'),pa=S.ausland.pl[40],pi=S.pl.find(p=>p.team>=0&&p.team!==S.my&&S.teams[p.team].lg===1);
  const f1=F.beobachtenLauf(pa.id,a.id,2),f2=F.beobachtenLauf(pi.id,i.id,2);S.fin={};F.scoutingWoche();const k1=-(S.fin['Scouting']||0);F.scoutingWoche();const k2=-(S.fin['Scouting']||0);
  pruef(!f1&&!f2&&k1===18000&&k2===36000,'Reisekosten: Ausland 15.000 €, Inland 3.000 € je Woche',`${k1.toLocaleString('de-DE')} € nach einer Woche, ${k2.toLocaleString('de-DE')} € nach zwei`);
  const b=S.news.find(n=>n.t.startsWith('Scoutbericht')&&n.t.includes(pa.n));
  pruef(!!b&&b.t.includes(ev('avVon')(pa.team).name)&&ev('kenntnis')(pa)>25,'Bericht nach der Beobachtung nennt den Auslandsverein, die Kenntnis ist gestiegen',`Kenntnis ${ev('kenntnis')(pa)}`);}

// 8. Suchauftrag im Ausland (K18 §4.2): 3–8 Kandidaten aus dem Pool in vier Wochen, Auslandskosten
{const {S,F,ev}=welt(),x=scout(S,F,12,'ausland');const f=F.sucheLauf(x.id,{pos:'ST',alterBis:23,abloeseBis:'',region:'ausland'});S.fin={};for(let w=0;w<4;w++){S.tag+=7;F.scoutingWoche();}
  const a=S.auftraege.find(y=>y.art==='suche'),kand=a?a.kand.map(id=>ev('PIX').get(id)):[];
  pruef(!f&&kand.length>=3&&kand.length<=8&&kand.every(p=>ev('istAusland')(p)&&p.pos==='ST'&&p.age<=23)&&-(S.fin['Scouting']||0)===60000,'Suchauftrag Ausland: 3–8 passende Kandidaten aus dem Pool in vier Wochen, 15.000 € je Woche',`${kand.length} Kandidaten, ${(-(S.fin['Scouting']||0)).toLocaleString('de-DE')} €`);
  const {S:S2,F:F2,ev:ev2}=welt(),y=scout(S2,F2,12,'inland');F2.sucheLauf(y.id,{pos:'ST',alterBis:23,abloeseBis:''});for(let w=0;w<4;w++){S2.tag+=7;F2.scoutingWoche();}
  const b=S2.auftraege.find(z=>z.art==='suche');pruef(b&&b.kand.length>=3&&b.kand.every(id=>!ev2('istAusland')(ev2('PIX').get(id))),'Suchauftrag ohne Region bleibt im Inland',`${b?b.kand.length:0} Kandidaten`);}

// 9. Kauf im Ausland (K32 §6): Der Spieler zieht in den Kader um, Geld gebucht, günstiger bei armen Vereinen, danach läuft die Woche fehlerfrei
{const {S,F,ev}=welt(0),t=ev('myT()'),doc=F.document,pl=S.ausland.pl.slice();let gekauft=null,vor=0,versuche=0;S.fin={};
  const arm=pl.filter(p=>ev('avVon')(p.team).fin<=30),reich=pl.filter(p=>ev('avVon')(p.team).fin>=90),faktor=l=>mw(l.map(p=>F.askPrice(p)/F.value(p)));
  pruef(faktor(arm)<1&&faktor(reich)>1.3,'Ablöseforderung nach Finanzkraft: arme Vereine unter Marktwert, reiche deutlich darüber',`×${faktor(arm).toFixed(2)} gegen ×${faktor(reich).toFixed(2)}`);
  for(const p of pl.filter(q=>q.str>=70&&q.str<=78&&F.askPrice(q)<t.cash*0.5)){versuche++;doc.getElementById('fee').value=String(F.askPrice(p)/1e6);doc.getElementById('yrs').value='3';vor=t.cash;F.offer(p.id);if(p.team===S.my){gekauft=p;break;}if(versuche>40)break;}
  const p=gekauft;
  pruef(!!p&&S.pl.includes(p)&&!S.ausland.pl.includes(p)&&ev('PIX').get(p.id)===p&&t.cash<vor&&S.fin['Transfers']<0&&p.st!=null&&ev('kenntnis')(p)===100&&F.staerkeSicht(p).genau,'Kauf im Ausland: Spieler im Kader, nicht mehr im Pool, Ablöse gebucht, ab jetzt genau bekannt',p?`${p.n} (${p.nat}, ${Math.round(p.str)}) nach ${versuche} Anfrage(n), Ablöse ${Math.round((vor-t.cash)/1e5)/10} Mio €`:'kein Kauf');
  let fehler='';try{S.lineup=F.bestXI(S.my,t.form);for(let i=0;i<40;i++){if(S.sponsOffers)F.sponsorWaehlen(0);if(ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();}}catch(e){fehler=e.message;}
  pruef(!fehler&&p&&p.team===S.my&&isFinite(p.str)&&isFinite(p.fit)&&p.st>=0&&p.st<=100,'Mit dem Neuzugang laufen Tage, Wochen und Spiele fehlerfrei',fehler||`Tag ${S.tag}`);

  // 10. Verkauf ins Ausland (K32 §3.1): Angebot eines Auslandsvereins annehmen, der Spieler zieht in den Pool
  const eigen=ev('squad')(S.my).sort((a,b)=>b.str-a.str)[5],av=S.ausland.v[0],n0=S.ausland.pl.length,cash=t.cash;S.offers=[{pid:eigen.id,tid:av.id,amt:5e6,bis:S.tag+7}];F.acceptOffer(0);
  pruef(eigen.team===av.id&&S.ausland.pl.includes(eigen)&&!S.pl.includes(eigen)&&S.ausland.pl.length===n0+1&&t.cash===cash+5e6&&!S.offers.length&&ev('kenntnis')(eigen)===5,'Verkauf ins Ausland: Spieler im Pool, Geld gebucht, Angebot erledigt',`${eigen.n} zu ${av.name}`);}

// 11. Angebote aus dem Ausland (K32 §3.1): Ein Teil der Angebote für deine Spieler kommt von Auslandsvereinen, die sportlich passen und das Budget haben
{const {S,F,ev}=welt(0),liste=ev('squad')(S.my).sort((a,b)=>b.str-a.str).slice(3,11);let aus=0,inl=0,passt=true;
  for(let w=0;w<150;w++){liste.forEach(p=>{p.list=1;p.ask=Math.round(F.value(p)/25000)*25000;});S.offers=[];ev('mitStrom')(ev('strom')('test',w),F.market);
    S.offers.forEach(o=>{if(o.tid>=2000){aus++;const v=ev('avVon')(o.tid),p=ev('PIX').get(o.pid);if(!(p.str>=ev('avStaerke')(v)-5&&ev('avBudget')(v)>o.amt*0.8))passt=false;}else inl++;});}
  const q=aus/(aus+inl||1);pruef(aus+inl>50&&q>=0.15&&q<=0.45&&passt,'Angebote für deine Spieler: 15–45 % aus dem Ausland, von passenden Vereinen mit Budget',`${aus} von ${aus+inl} (${pc(q)})`);}

// 13. Speichern und Laden: Der Pool bleibt erhalten, PIX kennt ihn wieder, gleiche Spannen
{const {W,S,F,ev}=welt(),x=scout(S,F,9,'ausland'),pl=S.ausland.pl.slice(0,200);pl.slice(0,40).forEach(p=>F.kenntnisPlus(p,x,1));
  const vor=pl.map(p=>ev('staerkeText')(p)).join(',');W.S=JSON.parse(JSON.stringify(S));F.reindex();const nach=pl.map(p=>ev('staerkeText')(ev('PIX').get(p.id))).join(',');
  pruef(vor===nach&&ev('PIX').size===W.S.pl.length+W.S.ausland.pl.length,'Speichern und Laden: Pool erhalten, gleiche Spannen');}

// 14. Über mehrere Saisons (K32 §10): Pool stabil (Größe ±15 %), Stärke im Gleichgewicht, Karriereenden und neue Talente, deutsche Ligen ohne Poolspieler
{const mess=[];let fehler='';
  const messen=S=>{const pl=S.ausland.pl;mess.push({n:pl.length,str:mw(pl.map(p=>p.str)),alter:mw(pl.map(p=>p.age)),ab85:pl.filter(p=>p.str>=85).length,jung:pl.filter(p=>p.age<=21).length,form:mw(pl.map(p=>p.form)),
      formOk:pl.every(p=>p.form>=0&&p.form<=20),sauber:S.pl.every(p=>p.team<2000)&&pl.every(p=>p.team>=2000&&S.ausland.v[p.team-2000]),kb:JSON.stringify(S).length/1024,
      kern:S.ausland.v.every(v=>{const n=pl.filter(p=>p.team===v.id).length;return n>=6&&n<=10;}),nat:pl.every(p=>p.nat)&&S.pl.every(p=>p.nat),alt:Math.max(...pl.map(p=>p.age))});};
  let r;try{r=saisons({n:N,seed:SEED,verein:6,beiSaisonstart:S=>messen(S),beiSaisonende:S=>{if(mess.length&&!mess[mess.length-1].ende){const pl=S.ausland.pl;mess[mess.length-1].ende={form:mw(pl.map(p=>p.form)),streu:Math.sqrt(mw(pl.map(p=>(p.form-10)**2)))};}}});}catch(e){fehler=e.stack.split('\n').slice(0,3).join(' | ');}
  const a=mess[0],z=mess[mess.length-1];
  pruef(!fehler&&mess.length>=N,`${N} Saisons mit Pool ohne Fehler`,fehler||`${mess.length} Saisonstarts gemessen`);
  if(a&&z){const gr=mess.map(m=>m.n);
    pruef(Math.max(...gr)<=a.n*1.15&&Math.min(...gr)>=a.n*0.85,'Pool stabil: Größe über die Saisons ±15 %',gr.join(', '));
    pruef(mess.every(m=>Math.abs(m.str-a.str)<=1.5),'Gleichgewicht: Stärke-Schnitt des Pools ±1,5',mess.map(m=>m.str.toFixed(1)).join(', '));
    pruef(mess.every(m=>m.ab85>=a.ab85*0.7&&m.ab85<=a.ab85*1.3),'Gleichgewicht: Poolspieler ab Stärke 85 ±30 %',mess.map(m=>m.ab85).join(', '));
    pruef(mess.every(m=>m.jung>=S_JUNG_MIN(m.n))&&mess.every(m=>m.alt<=38),'Jede Saison genug Talente, niemand über 38',`bis 21 Jahre: ${mess.map(m=>m.jung).join(', ')}; Alter Ø ${mess.map(m=>m.alter.toFixed(1)).join(', ')}`);
    pruef(mess.every(m=>m.formOk&&m.sauber&&m.kern&&m.nat),'Form 0–20, Kern 6–10 je Verein, Pool und Ligen getrennt, alle mit Nationalität');
    const e=mess.filter(m=>m.ende).map(m=>m.ende);pruef(e.every(x=>Math.abs(x.form-10)<0.5&&x.streu>0.4&&x.streu<3),'Form der Poolspieler wandert um 10',`Ø ${e.map(x=>x.form.toFixed(1)).join(', ')}, Streuung ${e.map(x=>x.streu.toFixed(1)).join(', ')}`);
    pruef(mess.every(m=>m.kb<3072),'Spielstand bleibt unter 3 MB',mess.map(m=>Math.round(m.kb)).join(', ')+' KB');}}
function S_JUNG_MIN(n){return n*0.08;}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
