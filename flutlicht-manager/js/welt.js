// Welt: Spieler erzeugen, Welt bauen, Spielplan, Ziele, Sponsoren, Preise.
const rname=()=>pick(VORNAMEN)+' '+pick(NACHNAMEN);
const salaryFor=s=>{const g=RP.gehalt;return Math.round(g.basis*Math.exp(g.steigung*(s-g.mitte))/g.runden)*g.runden;};
function value(p){const m=RP.marktwert,s=p.age<m.jungUnter?p.str*m.staerkeAnteil+Math.max(p.str,p.pot)*m.talentAnteil:p.str;let v=m.basis*Math.exp(m.steigung*(s-m.mitte));const a=p.age,f=m.alter.find(x=>a<=x[0]);v*=f?f[1]:m.alterSonst;return Math.max(m.minimum,Math.round(v/m.runden)*m.runden);}
function stars(p){const d=p.pot-p.str,st=RP.sterne;const n=d>=st[0]?4:d>=st[1]?3:d>=st[2]?2:1;return '★★★★'.slice(0,n)+'☆☆☆☆'.slice(n);}
const teamLevel=tid=>{const s=squad(tid).map(p=>p.str).sort((a,b)=>b-a).slice(0,RP.niveauSpieler);return s.length?s.reduce((a,b)=>a+b,0)/s.length:RP.niveauLeer;};
function askPrice(p,xiSet){const v=value(p);if(p.team<0)return 0;if(p.list)return p.ask||v;const t=S.teams[p.team];const inXI=xiSet?xiSet.has(p.id):bestXI(t.id,t.form).includes(p.id);return Math.round(v*(inXI?RM.forderung.stammspieler:RM.forderung.sonst)/RM.runden)*RM.runden;}
const extDemand=p=>{const g=RM.gehalt;return Math.round(salaryFor(p.str)*(g.basis+p.seed*g.zufall)*(p.age>=g.altAb?g.altFaktor:1)/1000)*1000;};
const kreditRahmen=t=>RF.kreditRahmen.basis+t.rep*RF.kreditRahmen.jeAnsehen;
const tvGeld=t=>{const v=RF.tv['liga'+t.lg]||RF.tv.liga3;return v.basis+t.rep*v.jeAnsehen;};
const richtPreis=t=>RF.zuschauer.refBasis+t.rep*RF.zuschauer.refJeAnsehen;
// Talent als Band aus der Sterne-Stufe: zeigt dieselbe Auskunft wie die Sterne, nur als Regler
function talentBand(p){const s=Math.round(p.str),st=RP.sterne,d=p.pot-p.str;const[a,b]=d>=st[0]?[st[0],99]:d>=st[1]?[st[1],st[0]]:d>=st[2]?[st[2],st[1]]:[0,st[2]];return[Math.min(99,s+a),Math.min(99,s+b)];}
// Vorhersage für den Ticketpreis-Regler: Zuschauer je Ligaheimspiel als Spanne (schwächster bis stärkster Gegner, mit Tageszufall). Würfelt nicht.
function zuschauerSpanne(t,preis){const Z=RF.zuschauer,ref=Z.refBasis+t.rep*Z.refJeAnsehen,pf=clamp(Math.pow(ref/preis,Z.preisExponent),Z.preisMin,Z.preisMax),ff=Z.formBasis+Z.formJePunkt*formPts(t.id),lf=t.lg===1?1:Z.liga2;
  const reps=S.teams.filter(x=>x.lg===t.lg&&x.id!==t.id).map(x=>x.rep),f=rep=>t.fans*pf*ff*(Z.gegnerBasis+rep/100*Z.gegnerFaktor)*lf;
  return[Math.round(Math.min(t.cap,f(Math.min(...reps))*Z.zufallBasis)),Math.round(Math.min(t.cap,f(Math.max(...reps))*(Z.zufallBasis+Z.zufallSpanne)))];}

function mkPlayer(o){const age=o.age,str=o.str,T=RP.talent;const p={id:S.pid++,n:o.n||rname(),pos:o.pos,age,str,pot:o.pot||Math.round(str+(age<=T[0][0]?riA(T[0][1]):age<=T[1][0]?riA(T[1][1]):riA(RP.talentSonst))),form:RP.startForm,fit:riA(RP.startFitness),team:o.team,inj:0,sus:0,yc:0,g:0,pg:0,apps:0,ct:o.ct||riA(RP.vertrag),list:0,ask:0,seed:R()};p.sal=salaryFor(p.str);return p;}
const lgIds=lg=>S.teams.filter(t=>t.lg===lg).map(t=>t.id);
const grundStaerke=rep=>RW.grund.basis+rep*RW.grund.jeAnsehen;
function buildWorld(seed){const W=RW;
  S={v:REGELN.spielstand.version,seed:seed>>>0,zufall:zufallStart(seed),pid:1,season:W.startSaison,tag:0,gespielt:-1,plan:null,relSp:[],relSp2:[],einst:{aus:{}},my:0,mgr:'',teams:[],pl:[],am:[],news:[],offers:[],fin:{},loan:0,trust:W.startVertrauen,train:W.startTraining,target:W.startZiel,hist:[],phase:'play',lineup:[],spons:null,sponsOffers:null,constr:null,res:{1:[],2:[],3:[]},att:[0,0],fired:0};
  S.plan=planFuer(S.season);S.tag=S.plan.start;
  S.am=AMATEURE.map(n=>({name:n,str:riA(W.amateurStaerke)}));
  PIX=new Map();
  VEREINE.forEach((c,i)=>{
    const t={id:i,name:c.name,sh:c.kurz,lg:c.liga,region:c.region,zweite:c.zweite?VEREINE.findIndex(v=>v.kurz===c.zweite):-1,rep:c.ansehen,cap:c.plaetze,fans:c.fans,col:c.farbe,cash:Math.round(W.konto.basis+c.ansehen*c.ansehen*W.konto.jeAnsehen2),form:pick(W.startFormationen),tac:'N',ein:'N',price:Math.round(W.ticket.basis+c.ansehen*W.ticket.jeAnsehen),logen:0,shop:0,youth:W.startJugend,expPos:W.startZiel,lastPos:W.startZiel};
    S.teams.push(t);if(c.liga>3)return;
    const real=KADER[c.kurz]||[], base=grundStaerke(c.ansehen), quota=real.length>=W.kaderVollAb?W.sollVoll:W.sollDuenn, st=W.stammplaetze, have={TW:0,AB:0,MF:0,ST:0};
    real.forEach(([n,pos,age,str])=>{const p=mkPlayer({n,pos,age,str,team:i});if(age<=W.jungeEchte.bisAlter)p.pot=str+riA(W.jungeEchte.talent);addP(p);have[pos]++;});
    for(const pos in quota)for(let k=have[pos];k<quota[pos];k++){const starter=k<st[pos];addP(mkPlayer({pos,age:riA(W.ersatzAlter),str:Math.round(starter?base+riA(W.stammStreuung):base-W.ersatzAbschlag+riA(W.ersatzStreuung)),team:i}));}
    const N=W.nachwuchs;if(real.length<N.wennUnter)for(let k=0;k<N.anzahl;k++){const p=mkPlayer({pos:pick(N.positionen),age:riA(N.alter),str:Math.round(base-N.abschlag+riA(N.streuung)),team:i});p.pot=Math.round(base+riA(N.talent));addP(p);}
  });
  const V=W.vereinslose;for(let k=0;k<V.anzahl;k++)addP(mkPlayer({pos:pick(V.positionen),age:riA(V.alter),str:riA(V.staerke),team:-1}));
  const sp=spielplanFuer(S.season);S.fx=sp.fx;S.plan.zeit=sp.zeit;initCup();
}
// Neuer Kader für einen Verein, der aus der Regionalliga aufsteigt (alles erfundene Spieler)
function kaderErzeugen(t){const W=RW,base=grundStaerke(t.rep),st=W.stammplaetze;
  for(const pos in W.sollDuenn)for(let k=0;k<W.sollDuenn[pos];k++){const starter=k<st[pos];addP(mkPlayer({pos,age:riA(W.ersatzAlter),str:Math.round(starter?base+riA(W.stammStreuung):base-W.ersatzAbschlag+riA(W.ersatzStreuung)),team:t.id}));}}
function roundRobin(ids){const n=ids.length,arr=shuffle(ids.slice()),rounds=[];for(let r=0;r<n-1;r++){const md=[];for(let i=0;i<n/2;i++){let h=arr[i],a=arr[n-1-i];if((r+i)%2===1)[h,a]=[a,h];md.push([h,a]);}rounds.push(md);arr.splice(1,0,arr.pop());}return rounds.concat(rounds.map(md=>md.map(([h,a])=>[a,h])));}
// DFB-Pokal: 1. und 2. Liga, die stärksten Drittligisten ohne Zweitmannschaften, dazu Amateure (zusammen 64)
function initCup(){const P=RF.pokal,dritt=S.teams.filter(t=>t.lg===3&&t.zweite<0).sort((a,b)=>b.rep-a.rep).slice(0,P.drittligisten);
  S.cup={alive:[...S.teams.filter(t=>t.lg<=2).map(t=>t.id),...dritt.map(t=>t.id),...S.am.slice(0,P.amateure).map((a,i)=>1000+i)],hist:[]};}
function targetFor(r,lg){const z=RV.ziel;return r===1?1:r<=z.spitzeBis?r+z.spitzePlus:Math.min(z.schlechtester[lg],r+z.plus);}
function targetText(lg,t){if(lg===1)return t===1?'Deutsche Meisterschaft':t<=4?'Platz '+t+' oder besser (Champions League)':t<=7?'Platz '+t+' oder besser (Europapokal)':t<=12?'Platz '+t+' oder besser (Mittelfeld)':'Klassenerhalt (Platz '+t+' oder besser)';return t<=2?'Aufstieg (Platz '+t+' oder besser)':t===3?'Relegationsplatz (Platz 3)':t>=RV.ziel.schlechtester[lg]?'Klassenerhalt (Platz '+t+' oder besser)':'Platz '+t+' oder besser';}
function setTarget(){LIGEN.forEach(lg=>S.teams.filter(t=>t.lg===lg).sort((a,b)=>b.rep-a.rep).forEach((t,i)=>t.expPos=i+1));const lg=myT().lg,r=targetFor(myT().expPos,lg);S.target=lg>=2?Math.max(RV.ziel.unterhalbMindestens,r):r;}
function sponsOffers(){const t=myT(),SP=RF.sponsor;const b=t.rep*t.rep*(SP['liga'+t.lg]||SP.liga3);const ns=shuffle(SPONSOREN.slice());const r=v=>Math.round(v/1000)*1000;
  S.sponsOffers=SP.angebote.map((a,i)=>({name:ns[i],base:r(b*a.fix),win:a.sieg?r(b*a.sieg):0,yrs:a.jahre,info:a.info}));}
function sponsorWaehlen(i){S.spons={...S.sponsOffers[i]};S.sponsOffers=null;news(`Sponsorvertrag unterschrieben: ${S.spons.name}.`,'good');}
function pickSponsor(i){sponsorWaehlen(i);save();render();}
