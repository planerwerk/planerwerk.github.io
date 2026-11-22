// Ereigniskarten der Spielwelt (K32 §8, U18b): Altstar (Vereinsloser für ein Jahr), Abschiedsspiel (Ehemaliger mit Namen), Heimweh (Interesse +15), England ruft (Angebot).
// Aufruf: node tests/spielwelt-karten.js. Nur Node.js. Den Katalog prüft tests/karten.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U18b entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711,nah=(a,b,e=0.02)=>Math.abs(a-b)<=e*Math.max(1,Math.abs(b));
function welt(){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);S.phase='play';
  const im=(k,fn)=>W.ev('mitStrom')(W.ev('strom')('test',k),fn);return{W,F,S,ev:W.ev,im,t:W.ev('myT()'),A:W.ev('AUSLOESER')};}
const entscheide=(w,id,b,i)=>w.F.kartenEntscheiden({id,tag:w.S.tag,s:w.S.season,b,text:''},i,false);

// 1. Altstar: vereinslos, ab 32, stark genug; verpflichtet für ein Jahr zu 60 % des Gehalts, Fans +3
{const w=welt(),{S,ev,im,A,t}=w;while(ev('squad')(VEREIN).length>=ev('RS').kaderMax)ev('squad')(VEREIN)[0].team=-1;
  const p=S.pl.find(x=>x.team>=0&&x.team!==VEREIN&&x.age<=31);p.team=-1;p.age=33;p.str=Math.round(ev('teamLevel')(VEREIN)+2);const b=im('alt',()=>A.altstar());t.fanU=0;
  const pick=b?S.pl.find(x=>x.id===b.spieler):null;if(pick)entscheide(w,'altstar',b,0);
  pruef(!!pick&&pick.team===VEREIN&&pick.ct===1&&pick.age>=32&&nah(pick.sal,Math.round(ev('salaryFor')(pick.str)*0.6/1000)*1000,0.01)&&t.fanU===3,'Altstar: ein Vereinsloser ab 32 unterschreibt für ein Jahr zu 60 % des Gehalts, Fans +3',pick?`${pick.n}, ${pick.age} Jahre, Gehalt ${pick.sal}`:'kein Kandidat');}

// 2. Abschiedsspiel: ein Ehemaliger mit vielen Spielen für deinen Verein, Text mit Namen, 150.000 € und Fans +4
{const w=welt(),{S,F,ev,A,t}=w;F.statS();S.stat.ehem.push({id:-77,n:'Test Legende',pos:'MF',von:S.season-8,bis:S.season-1,sp:240,t:30,v:20,no:300,ver:{[VEREIN]:180},ehr:0});
  const b=A.abschied(),text=b?ev('kartenText')('{spieler} hat aufgehört.',b):'';t.fanU=0;const g0=S.fin['Ereignisse']||0;if(b)entscheide(w,'abschiedsspiel',b,0);
  pruef(!!b&&text==='Test Legende hat aufgehört.'&&(S.fin['Ereignisse']||0)-g0===ev('kartenGeld')(150000)&&t.fanU===4,'Abschiedsspiel: Ehemaliger mit 180 Spielen für dich, Name im Text, 150.000 € und Fans +4',text);}

// 3. Heimweh: deutscher Spieler im Auslandspool, Kontakt hebt sein Interesse an dir um 15 (bis Saisonende)
{const w=welt(),{S,F,ev,im,A}=w,pool=ev('auslandSpieler')(),p=pool.find(x=>x.age>=26&&x.age<=33);let ok=false,d=0;
  if(p){pool.forEach(x=>{if(x!==p&&x.nat==='GER')x.nat='AUT';});p.nat='GER';p.str=Math.max(p.str,Math.round(ev('teamLevel')(VEREIN)));const b=im('rk',()=>A.rueckkehrer());
    const i0=F.wechselInteresse(p);if(b&&b.spieler===p.id){entscheide(w,'rueckkehrer',b,0);d=F.wechselInteresse(p)-i0;ok=Math.abs(d-15)<0.001&&ev('kartenText')('{verein}',b)!=='ein Verein';}}
  pruef(ok,'Heimweh: deutscher Spieler im Ausland wird gefunden, Auslandsverein im Text, Kontakt hebt das Interesse um 15',`${d}`);}

// 4. England ruft: bester Spieler ab 78 und bis 30, englischer Verein mit Budget, Angebot 1,3 × Marktwert im Büro
{const w=welt(),{S,ev,im,A}=w,p=ev('squad')(VEREIN).sort((a,b)=>b.str-a.str)[0];p.str=86;p.age=26;S.offers=[];const b=im('en',()=>A.englandRuft());
  if(b)entscheide(w,'englandRuft',b,0);const o=b?S.offers.find(x=>x.pid===p.id&&x.tid===b.verein):null,v=ev('avVon')(b?b.verein:0);
  pruef(!!o&&!!v&&v.land==='ENG'&&nah(o.amt,ev('value')(p)*1.3,0.02)&&o.max>o.amt,'England ruft: englischer Verein, Angebot rund 1,3 × Marktwert, Obergrenze darüber',o?`${v.name}: ${o.amt} (Marktwert ${ev('value')(p)})`:'kein Angebot');}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
