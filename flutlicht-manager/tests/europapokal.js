// Europapokal (K37, U19a): Teilnehmer, Auslosung der Ligaphase, Kurzrechnung, Auslandsverein in der Engine, Sperren je Wettbewerb, eine ganze Saison im Ablauf, Saisonwechsel.
// Aufruf: node tests/europapokal.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U19a entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt,saisons}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711;
function welt(seed=SEED){const {W,F}=neueWelt();F.buildWorld(seed);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();if(S.sponsOffers)F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);S.phase='play';return{W,F,S,ev:W.ev};}
const WB=['cl','el','ecl'];

// 1. Teilnehmer der ersten Saison: die echten deutschen Starter, sonst Auslandsvereine, keiner doppelt, 36 je Wettbewerb (Conference League 35 und die Qualifikation)
{const {S,ev}=welt(),E=S.eu,kurz=id=>S.teams[id].sh,alle=[...E.cl.t,...E.el.t,...E.ecl.t,...(E.ecl.q?E.ecl.q.slice(0,2):[])];
  const de=WB.map(wb=>E[wb].t.filter(id=>id<2000).map(kurz).join(',')).join(' | ');
  pruef(E.cl.t.length===36&&E.el.t.length===36&&E.ecl.t.length===35&&!!E.ecl.q&&S.teams[E.ecl.q[0]].sh==='SCF'&&new Set(alle).size===alle.length,'Teilnehmer: 36/36/35 und Qualifikation mit Freiburg, niemand doppelt',de);
  pruef(['FCB','BVB','RBL','VFB'].every(k=>E.cl.t.some(id=>id<2000&&kurz(id)===k))&&['B04','TSG'].every(k=>E.el.t.some(id=>id<2000&&kurz(id)===k)),'Deutsche Starter 2026/27 wie in daten/termine.js');
  const land=id=>ev('avVon')(id).land,zaehl=wb=>{const m={};E[wb].t.filter(id=>id>=2000).forEach(id=>{m[land(id)]=(m[land(id)]||0)+1;});return m;},K=ev('REU').laender,cl=zaehl('cl');
  pruef(Object.keys(K.cl).every(l=>(cl[l]||0)>=K.cl[l]),'Champions League: jedes Land hat mindestens sein Kontingent',JSON.stringify(cl));}

// 2. Auslosung der Ligaphase in 20 Welten: jeder spielt an jedem Spieltag genau einmal, 8 Spiele (Conference League 6), halb zu Hause, keine Gegner aus dem eigenen Land, keiner doppelt, je Topf zwei (eins)
{let fehler=[],laender=0;
  for(let s=1;s<=20;s++){const {F,S,ev}=welt(s),E=S.eu;if(E.ecl.q){E.ecl.t.push(E.ecl.q[0]);E.ecl.q=null;}
    WB.forEach(wb=>{F.euLigaphaseLosen(wb);const W=E[wb],n=wb==='ecl'?6:8,toepfe=wb==='ecl'?6:4,g=36/toepfe,rang=W.t.slice().sort((a,b)=>ev('euRep')(b)-ev('euRep')(a)),topf=id=>Math.floor(rang.indexOf(id)/g);
      W.t.forEach(id=>{const m=W.lp.filter(x=>x[0]===id||x[1]===id),md=new Set(m.map(x=>x[2])),geg=m.map(x=>x[0]===id?x[1]:x[0]),heim=m.filter(x=>x[0]===id).length,jeTopf={};
        geg.forEach(o=>{jeTopf[topf(o)]=(jeTopf[topf(o)]||0)+1;});
        if(m.length!==n||md.size!==n||heim!==n/2||new Set(geg).size!==n)fehler.push(`${wb} Seed ${s}: ${ev("tn")(id)} ${m.length} Spiele, ${md.size} Spieltage, ${heim} Heimspiele`);
        if(Object.values(jeTopf).some(x=>x!==n/toepfe))fehler.push(`${wb} Seed ${s}: ${ev("tn")(id)} Gegner je Topf ${JSON.stringify(jeTopf)}`);
        if(geg.some(o=>ev('euLand')(o)===ev('euLand')(id)))laender++;});});}
  pruef(!fehler.length,'Auslosung: Spieltage, Heimspiele und Gegner je Topf stimmen in 20 Welten',fehler.slice(0,3).join(' · ')||null);
  pruef(laender===0,'Auslosung: nie ein Gegner aus dem eigenen Land',laender);}

// 3. Kurzrechnung: gleich starke Vereine etwa 2,5 bis 3,3 Tore, der deutlich Stärkere gewinnt öfter
{const {F,S,ev}=welt(),V=S.ausland.v,ids=V.map((v,i)=>2000+i),st=ev('euStaerke'),sort=ids.slice().sort((a,b)=>st(b)-st(a)),stark=sort[0],schwach=sort[sort.length-1],gleich=sort[40];
  let tore=0,siege=0;const N=400;F.mitStrom(ev("strom")('test-eu'),()=>{for(let k=0;k<N;k++){const r=F.euKurz(gleich,gleich,{neutral:1});tore+=r.hg+r.ag;const x=F.euKurz(stark,schwach,{neutral:1});if(x.hg>x.ag)siege++;}});
  pruef(tore/N>2.5&&tore/N<3.3&&siege/N>0.6,'Kurzrechnung: Tore bei gleicher Stärke und Siege des Stärkeren',`${(tore/N).toFixed(2)} Tore, Stärkerer gewinnt ${Math.round(siege/N*100)} %`);}

// 4. Auslandsverein in der Engine: Block mit Teamstärke, Torschützen aus seinen Kernspielern, keine Folgen für Auslandsspieler, Tore zählen nicht als Ligatore
{const {F,S,ev}=welt(),aus=S.eu.cl.t.find(id=>id>=2000),namen=new Set(ev('avKader')(aus).map(p=>p.n)),g0=ev("squad")(VEREIN).reduce((a,p)=>a+p.g,0);let ok=true,tore=0,fremd=0;
  for(let k=0;k<20;k++){S.tag=40+k;const r=Object.assign(F.sim(VEREIN,aus,{wb:'eu'}),{eu:'cl'});F.applyMatch(r,false);
    r.ev.filter(e=>e.t==='G'&&e.s===1).forEach(e=>{tore++;if(!namen.has(e.n))fremd++;});if(!r.taktik||r.taktik[1]!==null)ok=false;}
  const g1=ev("squad")(VEREIN).reduce((a,p)=>a+p.g,0);
  pruef(ok&&tore>0&&fremd===0&&g1===g0,'Engine: Auslandsverein als Block, Torschützen aus seinem Kader, keine Ligatore für deinen Verein',`${tore} Gegentore, ${fremd} fremde Namen, Ligatore ${g0} → ${g1}`);}

// 5. Sperren je Wettbewerb: Gelbe im Europapokal zählen nur dort (UEFA: Sperre nach der 3. Gelben)
{const {F,S,ev}=welt(),p=ev("squad")(VEREIN).find(x=>x.pos!=='TW'),k=ev('gelbe')(p);k.eu=2;const liga=k.liga;
  F.disziplinNachSpiel({h:VEREIN,a:2000,hg:0,ag:0,eu:'cl',yel:[p.id],ev:[]});const sp=ev('sperren')(p);
  pruef(ev('gelbe')(p).eu===3&&ev('gelbe')(p).liga===liga&&sp.eu.gelb===1&&sp.liga.gelb===0&&ev('wbVon')({eu:'cl'})==='eu','Sperren: dritte Gelbe im Europapokal sperrt nur dort',JSON.stringify(sp));}

// 6. Eine Saison im Ablauf: alle Spiele gespielt, Runden vollständig, je Wettbewerb ein Sieger, Ligaspiele deutscher Teilnehmer mit drei Tagen Abstand zum Europapokal
{let info=null;saisons({n:1,seed:SEED,verein:VEREIN,beiSaisonende:(S,F)=>{const E=S.eu;info={E:JSON.parse(JSON.stringify(E)),abstand:0,de:0,meinGeld:(E.geld&&E.geld[S.my])||0,meinFin:S.fin['Europapokal']||0};
    const P=S.plan.eu,tage=new Map(),add=(id,d)=>{if(id>=2000)return;if(!tage.has(id))tage.set(id,[]);tage.get(id).push(d);};
    [1,2,3].forEach(lg=>(S.fx[lg]||[]).forEach((md,k)=>md.forEach(([h,a],i)=>{const d=S.plan.zeit[lg][k][i][0];add(h,d);add(a,d);})));
    WB.forEach(wb=>{const W=E[wb],p=P[wb];(W.lp||[]).forEach(m=>{add(m[0],m[3]);add(m[1],m[3]);});
      ['po','af','vf','hf'].forEach(r=>(W.ko[r]||[]).forEach((k,i)=>{[0,1].forEach(leg=>{add(k[0],p[r][leg][i%2]);add(k[1],p[r][leg][i%2]);});}));(W.ko.fin||[]).forEach(k=>{add(k[0],p.fin);add(k[1],p.fin);});
      if(W.q)[0,1].forEach(leg=>{add(W.q[0],p.quali[leg][0]);add(W.q[1],p.quali[leg][0]);});});
    const deIds=new Set(WB.flatMap(wb=>E[wb].t.filter(id=>id<2000)));tage.forEach((l,id)=>{if(!deIds.has(id))return;info.de++;l.sort((a,b)=>a-b);for(let i=1;i<l.length;i++)if(l[i]-l[i-1]<3)info.abstand++;});}});
  const E=info.E,n=(W,r)=>(W.ko[r]||[]).length,voll=wb=>{const W=E[wb];return(W.lp||[]).length===(wb==='ecl'?108:144)&&W.lp.every(m=>m[4]!=null)&&n(W,'po')===8&&n(W,'af')===8&&n(W,'vf')===4&&n(W,'hf')===2&&n(W,'fin')===1&&!!W.ko.fin[0][2];};
  pruef(WB.every(voll)&&WB.every(wb=>E.titel[wb]!=null),'Saison: Ligaphase und alle K.-o.-Runden gespielt, je Wettbewerb ein Sieger',WB.map(wb=>`${wb} ${E.titel[wb]}`).join(', '));
  pruef(info.abstand<=2,'Saison: deutsche Teilnehmer spielen höchstens zweimal mit weniger als drei Tagen Abstand',`${info.abstand} Fälle bei ${info.de} Vereinen`);
  // U19b: Prämien. Jeder deutsche Teilnehmer der Champions League hat mindestens das Startgeld, deine Buchung „Europapokal“ ist gleich deinen Prämien
  const cl=E.cl.t.filter(id=>id<2000),min=Math.round(18.62e6*0.2/1000)*1000;
  pruef(cl.every(id=>(E.geld[id]||0)>=min)&&info.meinGeld===info.meinFin,'Prämien: Startgeld für alle Deutschen in der Champions League, deine Buchung gleich S.eu.geld',`${cl.map(id=>E.geld[id]).join(', ')} · dein Verein ${info.meinGeld} / ${info.meinFin}`);}

// 8. Geld und Ansehen einzeln (U19b): Startgeld mit Wertsäule nach Rang, Ansehen nach erreichter Runde und Wettbewerb
{const {F,S,ev}=welt(),cl=S.eu.cl,id=cl.t.find(x=>x<2000),f0=S.teams[id].cash,rang=cl.t.slice().sort((a,b)=>ev('euRep')(b)-ev('euRep')(a)).indexOf(id)+1,G=ev('REU').geld;
  F.euStartgeld('cl');const soll=Math.round(G.cl.start*G.faktor/1000)*1000+Math.round(G.cl.wert*2*(37-rang)/37*G.faktor/1000)*1000,ist=S.teams[id].cash-f0;
  cl.ko.vf=[[id,2000,null,null]];const a1=F.euAnsehen(id);S.eu.titel.cl=id;const a2=F.euAnsehen(id);S.eu.titel.cl=null;cl.ko={};S.eu.el.t.push(id);S.eu.el.ko.vf=[[id,2001,null,null]];const a3=F.euAnsehen(id);
  pruef(id!==S.my&&ist===soll&&a1===2&&a2===4&&a3===1,'Geld und Ansehen: Startgeld mit Wertsäule, Viertelfinale +2, Titel +4, Europa League zur Hälfte',`${ist} statt ${soll}, Ansehen ${a1}/${a2}/${a3}`);}

// 7. Saisonwechsel: die vier Besten der Bundesliga in der Champions League, Platz 5 und der Pokalsieger in der Europa League, der Sieger der Champions League ist wieder dabei
{let ok=null;saisons({n:2,seed:SEED+1,verein:VEREIN,beiSaisonstart:(S,F)=>{if(S.season===2026)return;const E=S.eu,top=S.teams.filter(t=>t.lastLg===1&&t.lastPos<=4).map(t=>t.id),fuenf=S.teams.find(t=>t.lastLg===1&&t.lastPos===5);
    const tv=E.vor&&E.vor.cl;ok={top:top.every(id=>E.cl.t.includes(id)),fuenf:!!fuenf&&(E.el.t.includes(fuenf.id)||E.cl.t.includes(fuenf.id)),tv:tv==null||E.cl.t.includes(tv),n:WB.map(wb=>E[wb].t.length+(E[wb].q?1:0)).join('/')};}});
  pruef(!!ok&&ok.top&&ok.fuenf&&ok.tv,'Saisonwechsel: Teilnehmer aus Tabelle, Pokal und Titelverteidigung',ok?JSON.stringify(ok):'kein Saisonwechsel');}

// 9. U19c: Länderwertung mit Platz mehr in der Champions League, Plätze der Bundesliga mit und ohne fünften Platz, Interesse, Nebenziel des Vorstands
{const {F,S,ev}=welt(),E=S.eu,cl=E.cl,aus=cl.t.filter(id=>id>=2000);cl.lp=[];cl.t.filter(id=>id<2000).forEach(id=>{for(let k=0;k<8;k++)cl.lp.push([id,aus[k],k,0,3,0]);}); // deutsche Vereine gewinnen alles
  const wl=F.euLaenderwertung(E),erst=wl[0]&&wl[0].land;
  const l1=S.teams.filter(t=>t.lg===1).sort((a,b)=>b.rep-a.rep);l1.forEach((t,i)=>{t.lastLg=1;t.lastPos=i+1;});const pokal=l1[9].id;
  const ohne=F.euDeutsche({cup:pokal},false),mit=F.euDeutsche({cup:pokal},true),pos=l=>l.map(id=>S.teams[id].lastPos).join('+');
  const a=F.euAuslandWaehlen({cl:32,el:34,ecl:35},null,['ENG']),eng=a.cl.filter(id=>ev('avVon')(id).land==='ENG').length;
  const bay=cl.t.find(id=>id<2000&&S.teams[id].sh==='FCB'),inter=ev('euInteresse')(bay),alt=S.my;S.my=bay;const ziel=F.euZielMoeglich();S.my=alt;
  pruef(erst==='GER'&&ohne.cl.length===4&&mit.cl.length===5&&pos(mit.el)==='6+10'&&pos(mit.ecl)==='7'&&pos(ohne.ecl)==='6'&&eng>=6&&inter===6&&!!ziel&&ziel.min==='af',
    'U19c: Länderwertung, fünfter Platz, Kontingent plus eins, Interesse, Nebenziel',`erstes Land ${erst}, CL ${pos(ohne.cl)} / ${pos(mit.cl)}, EL ${pos(mit.el)}, ECL ${pos(ohne.ecl)} / ${pos(mit.ecl)}, England ${eng}, Interesse ${inter}, Ziel ${ziel&&ziel.min}`);}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
