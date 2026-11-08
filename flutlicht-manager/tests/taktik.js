// Taktik (K06 §10): Kreislauf wirkt, kein Stil dominiert, halbherzig lohnt nicht, keine Wunder-Ordnung, falsche Positionen kosten,
// Spiel der Saison, Vertrautheit, Seiten, Ballbesitz. Vergleiche mit denselben Zufallsströmen. Aufruf: node tests/taktik.js [Durchgänge=80] [Seed=5]. Nur Node.js.
const {neueWelt}=require('./sim');
const N=+(process.argv[2]||80),SEED=+(process.argv[3]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const f1=x=>x.toFixed(1),pc=x=>(x*100).toFixed(1)+' %',vz=x=>(x>=0?'+':'')+x.toFixed(1);
const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=-9;
const kader=id=>S.pl.filter(p=>p.team===id);
const niveau=id=>{const s=kader(id).map(p=>p.str).sort((a,b)=>b-a).slice(0,14);return s.reduce((a,b)=>a+b,0)/s.length;};
const L1=S.teams.filter(t=>t.lg===1).map(t=>t.id).sort((a,b)=>niveau(b)-niveau(a)),X=L1[8],gegner=L1.filter(id=>id!==X),TX=S.teams[X];
// Eingriffe in die Taktik-Funktionen für die Tests: feste Stile, feste Umsetzung
const setze=(name,code)=>W.ev(`(f=>{${name}=f;})`)(code);
const orig={kiStil:W.ev('kiStil'),umsetzung:W.ev('umsetzung')};
let FEST={},UMS=null;setze('kiStil',(sd,op)=>FEST[sd.id]||orig.kiStil(sd,op));setze('umsetzung',(sd,stil)=>UMS!=null&&sd.id===X&&stil!=='ausgewogen'?UMS:orig.umsetzung(sd,stil));
function bilanz(tid,geg,n,vor){let p=0,gf=0,ga=0,sp=0,bes=[0,0];for(let r=0;r<n;r++){S.season=6000+r;
    for(const g of geg){for(const heim of [true,false]){S.tag=heim?1:2;if(vor)vor();const x=heim?F.sim(tid,g):F.sim(g,tid),s=heim?0:1,a=heim?x.hg:x.ag,b=heim?x.ag:x.hg;p+=a>b?3:a===b?1:0;gf+=a;ga+=b;sp++;bes[0]+=x.st.besitz[s];bes[1]+=x.st.besitz[1-s];}}}
  return{pkt:p/n,besitz:bes[0]/(bes[0]+bes[1]),gf:gf/sp,ga:ga/sp};}

// 1. Kreislauf: gleich starke Teams (X gegen den Nachbarn in der Rangliste), volle Umsetzung. Gegen den Stil, den man schlägt, gewinnt man öfter als gegen den eigenen Stil:
//    im Mittel über die vier Paare des Kreislaufs 3–8 Prozentpunkte, und in jedem Paar mehr als gegen den eigenen Stil
{const Y=L1[9],K=W.ev('RTA').kreislauf;setze('umsetzung',()=>1);const d=[];
  for(const a of ['pressing','ballbesitz','mauern','konter']){let wA=0,wB=0,n=0;
    for(let r=0;r<N*5;r++){S.season=6500+r;S.tag=1;FEST={[X]:a,[Y]:a};const x=F.sim(X,Y);FEST={[X]:a,[Y]:K[a]};const y=F.sim(X,Y);n++;if(x.hg>x.ag)wA++;if(y.hg>y.ag)wB++;}d.push([a,(wB-wA)/n]);}
  const m=d.reduce((s,x)=>s+x[1],0)/d.length;
  pruef(m>=0.03&&m<=0.08&&d.every(x=>x[1]>0),'Kreislauf: gegen den geschlagenen Stil 3–8 Prozentpunkte mehr Siege als gegen den eigenen (Mittel), in jedem Paar mehr',d.map(([a,v])=>a+' '+(v>=0?'+':'')+(v*100).toFixed(1)).join(', ')+' · Mittel '+(m*100).toFixed(1));
  setze('umsetzung',(sd,stil)=>UMS!=null&&sd.id===X&&stil!=='ausgewogen'?UMS:orig.umsetzung(sd,stil));FEST={};}
// 2. Kein Stil dominiert: eine Saison lang immer derselbe Stil mit voller Umsetzung bringt höchstens 3 Punkte mehr als „ausgewogen“
{UMS=1;const basis=(TX.stil='ausgewogen',FEST={[X]:'ausgewogen'},bilanz(X,gegner,N));const erg={};
  for(const st of ['pressing','ballbesitz','mauern','konter','fluegel']){TX.stil=st;FEST={[X]:st};erg[st]=bilanz(X,gegner,N).pkt-basis.pkt;}
  const max=Object.entries(erg).sort((a,b)=>b[1]-a[1])[0];pruef(max[1]<=3,'Kein Stil dominiert: höchstens 3 Punkte mehr als ausgewogen',Object.entries(erg).map(([k,v])=>k+' '+vz(v)).join(', '));
  // 3. Halbherzig lohnt nicht: Pressing mit Umsetzung 0,15 (Voraussetzungen 0, Vertrautheit 30) bringt weniger als ausgewogen
  UMS=0.15;TX.stil='pressing';FEST={[X]:'pressing'};const halb=bilanz(X,gegner,N).pkt-basis.pkt;pruef(halb<0,'Halbherzig lohnt nicht: Pressing ohne passende Spieler bringt weniger als ausgewogen',vz(halb));
  // 9. Ballbesitz: Ballbesitz-Team 55–65 %, Mauer-Team 35–45 %
  UMS=1;TX.stil='ballbesitz';FEST={[X]:'ballbesitz'};const bb=bilanz(X,gegner,Math.ceil(N/2)).besitz;TX.stil='mauern';FEST={[X]:'mauern'};const ma=bilanz(X,gegner,Math.ceil(N/2)).besitz;
  pruef(bb>=0.55&&bb<=0.65,'Ballbesitz: Ballbesitz-Team hat 55–65 % Ballbesitz',pc(bb));pruef(ma>=0.35&&ma<=0.45,'Ballbesitz: Mauer-Team hat 35–45 % Ballbesitz',pc(ma));
  TX.stil='ausgewogen';UMS=null;FEST={};}
// 4. Keine Wunder-Ordnung: jede Grundordnung mit passendem Kader (gleich starke Spieler auf ihren Stammpositionen, richtiger Fuß) und voller Vertrautheit,
//    keine mehr als 3 Punkte über dem Schnitt der anderen (4-2-2-2 eingeschlossen)
{FEST={[X]:'ausgewogen'};TX.stil='ausgewogen';const alt=TX.form,vt=JSON.stringify(TX.vt||null),pk={},echte=kader(X),st=Math.round(echte.map(p=>p.str).sort((a,b)=>b-a).slice(0,11).reduce((a,b)=>a+b,0)/11);
  const gruppe=W.ev('posGruppe'),PIX=W.ev('PIX');echte.forEach(p=>p.team=-5);
  for(const f of Object.keys(W.ev('RE').formationen)){const sl=W.ev('slots')(f),neu=sl.map(pos=>{const p=F.mkPlayer({pos:gruppe(pos),age:26,str:st,team:X});
      Object.assign(p,{fp:pos,fit:100,ko:80,form:10,sv:0,sp:80,mk:{},inj:0,sus:0,fuss:/^(LV|LM|LA|LS)$/.test(pos)?'L':'R'});F.addP(p);return p;});
    TX.form=f;W.ev('vertrautSetzen')(TX,'ordnung',f,100);pk[f]=bilanz(X,gegner,Math.ceil(N/2)).pkt;neu.forEach(p=>{p.team=-5;});}
  echte.forEach(p=>p.team=X);TX.form=alt;TX.vt=JSON.parse(vt);const l=Object.entries(pk),schnitt=f=>l.filter(x=>x[0]!==f).reduce((a,x)=>a+x[1],0)/(l.length-1),ueber=l.map(([f,p])=>[f,p-schnitt(f)]).sort((a,b)=>b[1]-a[1]);
  pruef(ueber[0][1]<=3,'Keine Wunder-Ordnung: keine Grundordnung mehr als 3 Punkte über dem Schnitt der anderen',ueber.map(([f,v])=>f+' '+vz(v)).join(', '));FEST={};}
// 5. Falsche Positionen kosten: dieselben Spieler, aber Abwehr und Angriff getauscht, kostet mindestens 8 Punkte pro Saison
{S.my=X;TX.einstellung='normal';const sl=W.ev('slotsVerein')(TX),xi=F.bestXI(X,TX.form);S.lineup=xi.slice();FEST={};const gut=bilanz(X,gegner,Math.ceil(N/2)).pkt;
  const feld=xi.slice(1).reverse();S.lineup=[xi[0],...feld];const schlecht=bilanz(X,gegner,Math.ceil(N/2)).pkt;S.my=-9;S.lineup=null;
  pruef(gut-schlecht>=8,'Falsche Positionen kosten mindestens 8 Punkte pro Saison',`${f1(gut)} → ${f1(schlecht)}`);}
// 6. Spiel der Saison: dauernd genutzt weniger Punkte als nie, gezielt genutzt in diesen Spielen leicht positiv (Kater trifft das nächste Spiel eine Woche später)
{S.my=X;TX.einstellung='normal';const lauf=modus=>{let p=0,pz=0,nz=0;for(let r=0;r<N;r++){S.season=6900+r;delete TX.kater;let tag=1;
      gegner.forEach((g,i)=>{const ziel=modus==='dauernd'||(modus==='gezielt'&&i%5===0);S.tag=tag;TX.einstellung=ziel?'saison':'normal';const x=F.sim(X,g);const pk=x.hg>x.ag?3:x.hg===x.ag?1:0;p+=pk;if(i%5===0){pz+=pk;nz++;}
        if(ziel)TX.kater=tag+W.ev('RTA').einstellung.saison.katerTage;tag+=7;});}return{p:p/N,pz:pz/nz};};
  const nie=lauf('nie'),dauernd=lauf('dauernd'),gezielt=lauf('gezielt');TX.einstellung='normal';delete TX.kater;S.my=-9;S.lineup=null;
  pruef(dauernd.p<nie.p,'Spiel der Saison dauernd genutzt bringt weniger Punkte als nie',`${f1(nie.p)} → ${f1(dauernd.p)} (Hinrunde, nur Heimspiele)`);
  pruef(gezielt.pz>nie.pz,'Spiel der Saison gezielt genutzt: in diesen Spielen im Schnitt mehr Punkte',`${nie.pz.toFixed(2)} → ${gezielt.pz.toFixed(2)} je Spiel`);}
// 7. Vertrautheit: von 30 auf 80 in 6–8 Wochen mit Training und einem Spiel pro Woche
{const t={id:999,stil:'pressing',form:'4-4-2',vt:{stil:{pressing:30},ordnung:{}}};let w=0;const V=W.ev('RTA').vertrautheit;
  while(W.ev('vertraut')(t,'stil','pressing')<80&&w<30){W.ev('vertrautheitWoche')(t);W.ev('vertrautSetzen')(t,'stil','pressing',W.ev('vertraut')(t,'stil','pressing')+V.jeSpiel);w++;}
  pruef(w>=6&&w<=8,'Vertrautheit: von 30 auf 80 in 6–8 Wochen',w+' Wochen');}
// 8. Seiten: ein deutlich schwächerer Rechtsverteidiger zieht mindestens 55 % der gegnerischen Außenangriffe auf seine Seite
{TX.form='4-4-2';const xi=F.bestXI(X,'4-4-2'),rv=W.ev('PIX').get(xi[W.ev('slots')('4-4-2').indexOf('RV')]),alt=rv.str;rv.str=alt-15;let l=0,r=0;
  for(let k=0;k<N;k++){S.season=7700+k;S.tag=1;for(const g of gegner.slice(0,8)){const x=F.sim(g,X);l+=x.st.wege[0][1];r+=x.st.wege[0][2];}}
  rv.str=alt;pruef(l/(l+r)>=0.55,'Seiten: ein schwacher Rechtsverteidiger zieht mindestens 55 % der Außenangriffe auf seine Seite',pc(l/(l+r)));}
console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
