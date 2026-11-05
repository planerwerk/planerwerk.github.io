// Welt: Spieler erzeugen, Welt bauen, Spielplan, Ziele, Sponsoren, Preise.
const rname=()=>pick(VORNAMEN)+' '+pick(NACHNAMEN);
const salaryFor=s=>{const g=RP.gehalt;return Math.round(g.basis*Math.exp(g.steigung*(s-g.mitte))/g.runden)*g.runden;};
function value(p){const m=RP.marktwert,s=p.age<m.jungUnter?p.str*m.staerkeAnteil+Math.max(p.str,p.pot)*m.talentAnteil:p.str;let v=m.basis*Math.exp(m.steigung*(s-m.mitte));const a=p.age,f=m.alter.find(x=>a<=x[0]);v*=f?f[1]:m.alterSonst;return Math.max(m.minimum,Math.round(v/m.runden)*m.runden);}
function stars(p){const d=p.pot-p.str,st=RP.sterne;const n=d>=st[0]?4:d>=st[1]?3:d>=st[2]?2:1;return '★★★★'.slice(0,n)+'☆☆☆☆'.slice(n);}
const teamLevel=tid=>{const s=squad(tid).map(p=>p.str).sort((a,b)=>b-a).slice(0,RP.niveauSpieler);return s.length?s.reduce((a,b)=>a+b,0)/s.length:RP.niveauLeer;};
function askPrice(p,xiSet){const v=value(p);if(p.team<0)return 0;if(p.list)return p.ask||v;const t=S.teams[p.team];const inXI=xiSet?xiSet.has(p.id):bestXI(t.id,t.form).includes(p.id);return Math.round(v*(inXI?RM.forderung.stammspieler:RM.forderung.sonst)/RM.runden)*RM.runden;}
const extDemand=p=>{const g=RM.gehalt;return Math.round(salaryFor(p.str)*(g.basis+p.seed*g.zufall)*(p.age>=g.altAb?g.altFaktor:1)/1000)*1000;};
const kreditRahmen=t=>RF.kreditRahmen.basis+t.rep*RF.kreditRahmen.jeAnsehen;
const tvGeld=t=>t.lg===1?RF.tv.liga1.basis+t.rep*RF.tv.liga1.jeAnsehen:RF.tv.liga2.basis+t.rep*RF.tv.liga2.jeAnsehen;
const richtPreis=t=>RF.zuschauer.refBasis+t.rep*RF.zuschauer.refJeAnsehen;

function mkPlayer(o){const age=o.age,str=o.str,T=RP.talent;const p={id:S.pid++,n:o.n||rname(),pos:o.pos,age,str,pot:o.pot||Math.round(str+(age<=T[0][0]?riA(T[0][1]):age<=T[1][0]?riA(T[1][1]):riA(RP.talentSonst))),form:RP.startForm,fit:riA(RP.startFitness),team:o.team,inj:0,sus:0,yc:0,g:0,pg:0,apps:0,ct:o.ct||riA(RP.vertrag),list:0,ask:0,seed:R()};p.sal=salaryFor(p.str);return p;}
const lgIds=lg=>S.teams.filter(t=>t.lg===lg).map(t=>t.id);
const grundStaerke=rep=>RW.grund.basis+rep*RW.grund.jeAnsehen;
function buildWorld(seed){const W=RW;
  S={v:REGELN.spielstand.version,seed:seed>>>0,zufall:zufallStart(seed),pid:1,season:W.startSaison,wk:0,my:0,mgr:'',teams:[],pl:[],am:[],news:[],offers:[],fin:{},loan:0,trust:W.startVertrauen,train:W.startTraining,target:W.startZiel,hist:[],phase:'play',lineup:[],spons:null,sponsOffers:null,constr:null,res:{1:[],2:[]},att:[0,0],fired:0};
  S.am=AMATEURE.map(n=>({name:n,str:riA(W.amateurStaerke)}));
  PIX=new Map();
  VEREINE.forEach((c,i)=>{
    const t={id:i,name:c.name,sh:c.kurz,lg:c.liga,rep:c.ansehen,cap:c.plaetze,fans:c.fans,col:c.farbe,cash:Math.round(W.konto.basis+c.ansehen*c.ansehen*W.konto.jeAnsehen2),form:pick(W.startFormationen),tac:'N',ein:'N',price:Math.round(W.ticket.basis+c.ansehen*W.ticket.jeAnsehen),logen:0,shop:0,youth:W.startJugend,expPos:W.startZiel,lastPos:W.startZiel};
    S.teams.push(t);
    const real=KADER[c.kurz]||[], base=grundStaerke(c.ansehen), quota=real.length>=W.kaderVollAb?W.sollVoll:W.sollDuenn, st=W.stammplaetze, have={TW:0,AB:0,MF:0,ST:0};
    real.forEach(([n,pos,age,str])=>{const p=mkPlayer({n,pos,age,str,team:i});if(age<=W.jungeEchte.bisAlter)p.pot=str+riA(W.jungeEchte.talent);addP(p);have[pos]++;});
    for(const pos in quota)for(let k=have[pos];k<quota[pos];k++){const starter=k<st[pos];addP(mkPlayer({pos,age:riA(W.ersatzAlter),str:Math.round(starter?base+riA(W.stammStreuung):base-W.ersatzAbschlag+riA(W.ersatzStreuung)),team:i}));}
    const N=W.nachwuchs;if(real.length<N.wennUnter)for(let k=0;k<N.anzahl;k++){const p=mkPlayer({pos:pick(N.positionen),age:riA(N.alter),str:Math.round(base-N.abschlag+riA(N.streuung)),team:i});p.pot=Math.round(base+riA(N.talent));addP(p);}
  });
  const V=W.vereinslose;for(let k=0;k<V.anzahl;k++)addP(mkPlayer({pos:pick(V.positionen),age:riA(V.alter),str:riA(V.staerke),team:-1}));
  S.fx={1:roundRobin(lgIds(1)),2:roundRobin(lgIds(2))};S.cal=mkCal();initCup();
}
function roundRobin(ids){const n=ids.length,arr=shuffle(ids.slice()),rounds=[];for(let r=0;r<n-1;r++){const md=[];for(let i=0;i<n/2;i++){let h=arr[i],a=arr[n-1-i];if((r+i)%2===1)[h,a]=[a,h];md.push([h,a]);}rounds.push(md);arr.splice(1,0,arr.pop());}return rounds.concat(rounds.map(md=>md.map(([h,a])=>[a,h])));}
function mkCal(){const c=[],cup=RK.pokalNachSpieltag;for(let md=0;md<34;md++){c.push({t:'L',md});if(cup[md]!==undefined)c.push({t:'P',r:cup[md]});}return c;}
function initCup(){S.cup={alive:[...S.teams.map(t=>t.id),...S.am.map((a,i)=>1000+i)],hist:[]};}
function targetFor(r){const z=RV.ziel;return r===1?1:r<=z.spitzeBis?r+z.spitzePlus:Math.min(z.schlechtester,r+z.plus);}
function targetText(lg,t){if(lg===1)return t===1?'Deutsche Meisterschaft':t<=4?'Platz '+t+' oder besser (Champions League)':t<=7?'Platz '+t+' oder besser (Europapokal)':t<=12?'Platz '+t+' oder besser (Mittelfeld)':'Klassenerhalt (Platz '+t+' oder besser)';return t<=2?'Aufstieg (Platz '+t+' oder besser)':t===3?'Relegationsplatz (Platz 3)':'Platz '+t+' oder besser';}
function setTarget(){[1,2].forEach(lg=>S.teams.filter(t=>t.lg===lg).sort((a,b)=>b.rep-a.rep).forEach((t,i)=>t.expPos=i+1));const r=targetFor(myT().expPos);S.target=myT().lg===2?Math.max(RV.ziel.liga2Mindestens,r):r;}
function sponsOffers(){const t=myT(),SP=RF.sponsor;const b=t.rep*t.rep*(t.lg===1?SP.liga1:SP.liga2);const ns=shuffle(SPONSOREN.slice());const r=v=>Math.round(v/1000)*1000;
  S.sponsOffers=SP.angebote.map((a,i)=>({name:ns[i],base:r(b*a.fix),win:a.sieg?r(b*a.sieg):0,yrs:a.jahre,info:a.info}));}
function pickSponsor(i){S.spons={...S.sponsOffers[i]};S.sponsOffers=null;news(`Sponsorvertrag unterschrieben: ${S.spons.name}.`,'good');save();render();}
