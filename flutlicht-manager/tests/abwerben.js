// Transfers II (K20 §5.4, U15): Abwerben (wer, Bereitschaft, Risiko, Treffen je Woche, Wechselwunsch ab 70, Folgen beim Auffliegen, Lizenz),
// Deadline Day (drei Tage, Halt am letzten Tag und abschaltbar, eigener Strom für den zusätzlichen Markttag), Bieterrunde beim Verkauf.
// Aufruf: node tests/abwerben.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U15 entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711,nah=(a,b,e=0.01)=>Math.abs(a-b)<=e*Math.max(1,Math.abs(b));
function welt(lernstufen){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';if(lernstufen)F.lizenzStart(true);F.setTarget();F.sponsOffers();if(S.sponsOffers)F.sponsorWaehlen(0);
  S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);W.ev('myT()').cash=50e6;return{W,F,S,ev:W.ev};}
// Ein Spieler eines anderen Erstligisten, nicht vereinstreu (sonst petzt er)
const ziel=(w,f)=>w.S.pl.find(p=>p.team>=0&&p.team!==VEREIN&&p.team<1000&&w.S.teams[p.team].lg===1&&!w.ev('hatEig')(p,'vereinstreu')&&!p.leihe&&!p.wech&&(!f||f(p)));

// 1. Wer abgeworben werden kann
{const w=welt(false),{F,S,ev}=w,fremd=ziel(w),eigen=ev('squad')(VEREIN)[0],los=S.pl.find(p=>p.team===-1),aus=(S.ausland&&S.ausland.pl||[])[0];
  pruef(ev('abwerbbar')(fremd)&&!ev('abwerbbar')(eigen)&&(!los||!ev('abwerbbar')(los))&&(!aus||!ev('abwerbbar')(aus)),'Abwerben nur bei Spielern deutscher Computer-Vereine, nicht bei eigenen, Vereinslosen oder im Auslandspool');}

// 2. Formeln: Stimmung unter 40 ×1,3 gegen die Mitte, Restaurant doppelt so riskant wie das Hotel, jedes Treffen +20 %
// Die Stimmung wirkt nach K20 §11 zweimal: über das Wechselinteresse (K19 §5.3) und über den eigenen Faktor. Der Faktor wird bei festem Interesse geprüft (T2.2),
// die Gesamtwirkung muss darüber liegen.
{const w=welt(false),{F,ev}=w,p=ziel(w),st=p.st,ab=x=>{p.st=x;const v=F.abwPlus(p);p.st=st;return v;};
  const gesamt=[ab(55),ab(30)];ev('globalThis.__wiAlt=wechselInteresse;wechselInteresse=()=>'+ev('wechselInteresse')(p));const fest=[ab(55),ab(30)];ev('wechselInteresse=__wiAlt');
  const h=F.abwRisiko(p,'hotel',0),r=F.abwRisiko(p,'restaurant',0),h2=F.abwRisiko(p,'hotel',2);
  pruef(fest[0]>0&&nah(fest[1]/fest[0],1.3)&&gesamt[1]/gesamt[0]>=1.3&&nah(r/h,2)&&nah(h2/h,1.4),'Formeln: schlechte Stimmung ×1,3 (bei festem Interesse, mit dem Interesse mehr), Restaurant doppelt so riskant wie das Hotel, nach zwei Treffen ×1,4',`fest ${fest[0].toFixed(2)} → ${fest[1].toFixed(2)}, mit Interesse ${gesamt[0].toFixed(2)} → ${gesamt[1].toFixed(2)}, Hotel ${(h*100).toFixed(1)} %, Restaurant ${(r*100).toFixed(1)} %, Hotel nach 2 Treffen ${(h2*100).toFixed(1)} %`);}

// 3. Treffen ohne Auffliegen bis zum Wechselwunsch: einmal je Woche, Kosten je Treffen, ab 70 Wechselwunsch Stufe 3 und Transferliste
{const w=welt(false),{F,S}=w,p=ziel(w);F.abwRisiko=()=>0;const cash0=W0(w),O=w.ev('RAW').ort.hotel;let n=0,doppelt=false;
  while(!(S.abw&&S.abw[p.id]&&S.abw[p.id].ok)&&n<30){const a=S.abw&&S.abw[p.id],vor=a?a.n:0;F.abwTreffen(p.id,'hotel');if(n===0){F.abwTreffen(p.id,'hotel');doppelt=S.abw[p.id].n!==1;}S.tag+=7;n++;}
  const a=S.abw[p.id],kosten=cash0-W0(w);
  pruef(!doppelt&&a.ok===1&&a.b>=70&&p.ww===3&&p.list===1&&kosten===a.n*O.kosten,'Treffen: einmal je Woche, je Treffen 15.000 €, ab 70 Bereitschaft Wechselwunsch Stufe 3 und Transferliste',`${a.n} Treffen, Bereitschaft ${Math.round(a.b)}, ww ${p.ww}, Liste ${p.list}, Kosten ${kosten}`);}
function W0(w){return w.ev('myT()').cash;}

// 4. Aufgeflogen: Beziehung −15 bis −30, Ablöse +15 % bis Saisonende, Vertrauen −3, danach keine Treffen mehr
{const w=welt(false),{F,S}=w,p=ziel(w),tid=p.team;F.abwRisiko=()=>1;S.trust=50;const bez0=F.bezDu(tid);F.abwTreffen(p.id,'restaurant');
  const a=S.abw[p.id],bez=F.bezDu(tid)-bez0,soll=F.forderungBasis(p)*w.ev('bezAbloese')(tid)*1.15,ist=w.ev('forderungDu')(p);S.tag+=7;const n=a.n;F.abwTreffen(p.id,'hotel');
  pruef(a.auf===1&&bez<=-15&&bez>=-30&&nah(ist,soll)&&S.trust===47&&a.n===n,'Aufgeflogen: Beziehung −15 bis −30, Ablöse +15 % (mit Beziehung), Vertrauen −3, kein weiteres Treffen in dieser Saison',`Beziehung ${bez}, Forderung ${Math.round(ist)} (soll ${Math.round(soll)}), Vertrauen ${S.trust}`);}

// 5. Lizenz: mit Lernstufen in der ersten Stufe gesperrt, kein Geld weg
{const w=welt(true),{F,S}=w,p=ziel(w),c=W0(w);F.abwTreffen(p.id,'hotel');
  pruef(!(S.abw&&S.abw[p.id])&&W0(w)===c,'Lizenz: Abwerben erst ab der A-Lizenz, vorher passiert nichts');}

// 6. Deadline Day: drei Tage, Halt am letzten Tag, abschaltbar, zusätzlicher Markttag ohne Griff in den Grundstrom
{const w=welt(false),{F,S,ev}=w;let letzter=null,drei=0;for(let d=S.tag;d<S.tag+120;d++){if(ev('deadlineTage')(d))drei++;if(ev('deadlineLetzter')(d)){letzter=d;break;}}
  const grund=letzter!=null?F.haltGrund(letzter):'';F.erinnerungAus('deadline',true);const aus=letzter!=null?F.haltGrund(letzter):'';F.erinnerungAus('deadline',false);
  const z0=JSON.stringify(S.zufall),t0=S.tag;S.tag=letzter;S.phase='play';let fehler='';try{F.deadlineTag(letzter);}catch(e){fehler=e.message;}const z1=JSON.stringify(S.zufall);S.tag=t0;
  pruef(letzter!=null&&drei===3&&!!grund&&aus!=='Deadline Day'&&!fehler&&z0===z1,'Deadline Day: drei Tage, Halt am letzten Tag (außer an einem Spieltag), abschaltbar, Markttag mit eigenem Strom',
    `letzter Tag ${letzter}, Tage ${drei}, Halt „${grund}“, abgeschaltet „${aus}“${fehler?', Fehler '+fehler:''}${z0!==z1?', Grundstrom verändert':''}`);}

// 7. Bieterrunde: der niedrigere Bieter überbietet bis zu seiner Grenze, Fristen mindestens 2 Tage, nur einmal je Fenster
{const w=welt(false),{F,S,ev}=w,p=ev('squad')(VEREIN).sort((a,b)=>b.str-a.str)[3],[A,B]=S.teams.filter(t=>t.id!==VEREIN&&t.lg===1);
  S.offers=[{pid:p.id,tid:A.id,amt:1e6,max:1.5e6,r:0,bis:S.tag+1},{pid:p.id,tid:B.id,amt:1.2e6,max:1.25e6,r:0,bis:S.tag+1}];const vorher=F.bieterMoeglich(p.id);F.bieterRunde(p.id);
  const l=S.offers.filter(o=>o.pid===p.id),top=Math.max(...l.map(o=>o.amt)),ok=l.every(o=>o.amt<=o.max&&o.bis>=S.tag+2),nachher=F.bieterMoeglich(p.id);
  pruef(vorher&&top>1.2e6&&ok&&!nachher,'Bieterrunde: höchstes Gebot steigt, niemand über seiner Grenze, Fristen mindestens 2 Tage, danach nicht noch einmal',`${l.map(o=>o.amt).join(' / ')}`);}

// K20b. Deadline Day (K20 §4.3): Die Forderung eines Computer-Vereins schwankt in den letzten Tagen des Fensters um höchstens ±15 %, am selben Tag gleich,
//       vorher nicht; ein Spieler auf seiner Transferliste ist im Schnitt billiger
{const w=welt(false),{F,S,ev}=w,D=ev('RAW').deadline,d0=S.tag;let tage=[];for(let d=S.tag;d<S.tag+120&&tage.length<D.tage;d++)if(ev('deadlineTage')(d))tage.push(d);
  const p=S.pl.find(q=>q.team>=0&&q.team<1000&&q.team!==S.my&&!q.list&&ev('forderungBasis')(q)>0),f=x=>ev('deadlinePreis')(p);
  S.tag=d0;const vorher=f();const fs=tage.map(d=>{S.tag=d;return f();}),gleich=tage.every((d,i)=>{S.tag=d;return f()===fs[i];});
  const viele=S.pl.filter(q=>q.team>=0&&q.team<1000&&q.team!==S.my).slice(0,200);S.tag=tage[0];const mit=viele.map(q=>{q.list=0;return ev('deadlinePreis')(q);}),liste=viele.map(q=>{q.list=1;const x=ev('deadlinePreis')(q);q.list=0;return x;});
  const schnitt=a=>a.reduce((s,x)=>s+x,0)/a.length;
  pruef(tage.length===D.tage&&vorher===1&&gleich&&fs.every(x=>x>=1-D.preis&&x<=1+D.preis)&&new Set(fs).size>1&&schnitt(liste)<schnitt(mit),'Deadline Day: Forderung schwankt fest je Tag, vorher nicht, Transferliste billiger',
    `Faktoren ${fs.map(x=>x.toFixed(3)).join(' / ')}, ohne Liste ${schnitt(mit).toFixed(3)}, mit Liste ${schnitt(liste).toFixed(3)}`);}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
