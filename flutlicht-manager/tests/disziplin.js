// Disziplin und Sportgericht (K09 §10): Kartenhäufigkeit, Hitzköpfe, Tätlichkeiten, Gelbsperren im Pokal, Urteil spätestens nach 10 Tagen,
// Einspruch, Sperren getrennt nach Liga und Pokal, Saisonwechsel. Aufruf: node tests/disziplin.js [Saisons=2] [Seed=4]. Nur Node.js.
const {saisons}=require('./sim');
const N=+(process.argv[2]||2),SEED=+(process.argv[3]||4),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const f2=x=>x.toFixed(2),pc=x=>(x*100).toFixed(0)+' %';
const L={},hk={k:0,min:0},and={k:0,min:0},pokalGelb={},urteile=[];let welt=null;
const res=saisons({n:N,seed:SEED,verein:6,beiSaisonstart:(S,F)=>{if(welt)return;welt=F;
    const orig=F.sgUrteil;F.sgUrteil=function(v,n,a,d){urteile.push({art:v.art,vor:v.vor,antrag:v.antrag,tag:v.tag,am:d,einspruch:!!v.einspruch,ausgang:a});return orig(v,n,a,d);};},
  beiSpielen:(liste,S)=>{const hat=(p,k)=>p&&p.eig&&p.eig.includes(k);
    liste.forEach(r=>{const k=r.cup?'pokal':r.lg?'l'+r.lg:null;if(!k)return;const x=L[k]=L[k]||{spiele:0,gelb:0,rot:0,gr:0,taet:0};x.spiele++;
      r.ev.forEach(e=>{if(e.p==null)return;if(e.t==='Y')x.gelb++;if(e.t==='R'){if(e.gy)x.gr++;else x.rot++;if(e.art==='taetlichkeit'||e.art==='schwer')x.taet++;}
        if(r.cup&&e.t==='Y')pokalGelb[S.season+'/'+e.p]=(pokalGelb[S.season+'/'+e.p]||0)+1;});
      if(r.cup)return;const karten={};r.ev.forEach(e=>{if(e.p!=null&&(e.t==='Y'||e.t==='R'))karten[e.p]=(karten[e.p]||0)+1;});
      r.xpo.forEach(l=>l.forEach(([id,,,min])=>{const p=S.pl.find(q=>q.id===id),z=hat(p,'hitzkopf')?hk:and;z.min+=min;z.k+=karten[id]||0;}));});}});
const {W,F}=res,S=W.S,ev=W.ev;
// 1. Kartenhäufigkeit in den Ligen (K09 §10, echte Anker 2024/25: 0,10 Rot und 0,09 Gelb-Rot pro Spiel)
const sum=['l1','l2','l3'].reduce((a,k)=>{const x=L[k]||{};['spiele','gelb','rot','gr','taet'].forEach(q=>a[q]=(a[q]||0)+(x[q]||0));return a;},{});
pruef(sum.gelb/sum.spiele/2>=1.5&&sum.gelb/sum.spiele/2<=2.2,'Gelbe Karten pro Team und Spiel 1,5–2,2',f2(sum.gelb/sum.spiele/2));
pruef(sum.rot/sum.spiele>=0.07&&sum.rot/sum.spiele<=0.13,'Rote Karten (direkt) pro Spiel 0,07–0,13',f2(sum.rot/sum.spiele));
pruef(sum.gr/sum.spiele>=0.06&&sum.gr/sum.spiele<=0.12,'Gelb-Rote Karten pro Spiel 0,06–0,12',f2(sum.gr/sum.spiele));
const taetJe=sum.taet/(3*N);pruef(taetJe<=3,'Tätlichkeiten je Liga und Saison 0–3',f2(taetJe));
// 2. Hitzköpfe sehen 1,3- bis 1,7-mal so viele Karten (pro Minute)
const q=(hk.k/hk.min)/(and.k/and.min);pruef(q>=1.3&&q<=1.7,'Hitzköpfe sehen 1,3- bis 1,7-mal so viele Karten',`${f2(q)} (${hk.k} Karten in ${Math.round(hk.min/90)} Spielen)`);
// 3. Gelbsperren im Pokal praktisch nie (Schwelle 5 Gelbe in einer Pokalsaison)
const ps=Object.values(pokalGelb).filter(n=>n>=5).length;pruef(ps<=1,'Gelbsperren im Pokal praktisch nie',`${ps} in ${N} Pokalsaison(s)`);
// 4. Verfahren: Urteil spätestens 10 Tage nach dem Spiel, Einsprüche kommen vor
const spaet=urteile.filter(u=>u.am-u.tag>10).length,ein=urteile.filter(u=>u.einspruch).length;
pruef(urteile.length>0&&spaet===0,'Urteil spätestens 10 Tage nach dem Spiel',`${urteile.length} Urteile, ${spaet} zu spät, längstes nach ${Math.max(...urteile.map(u=>u.am-u.tag))} Tagen`);
pruef(ein>0&&ein<urteile.length,'Computer-Vereine legen manchmal Einspruch ein',`${ein} von ${urteile.length}`);
// 5. Einspruch: gemindert in 25–35 % der Fälle (Spielwert), mit der Mischung der Verfahren aus den Saisons (nur Anträge ab 2 Spielen)
{let g=0,n=0;const sp=ev('sgEntscheiden'),vorher=S.sgArchiv;F.sgUrteil=function(v,k,a){if(a==='gemindert')g++;n++;};
  urteile.filter(u=>u.antrag>=2).forEach(u=>{for(let i=0;i<200;i++)sp({pid:-1,wb:'liga',art:u.art,vor:u.vor,antrag:u.antrag,tag:0,gesessen:0},0);});
  S.sgArchiv=vorher;pruef(n>0&&g/n>=0.25&&g/n<=0.35,'Einspruch: gemindert in 25–35 % der Fälle',`${pc(g/n)} von ${n} Würfen`);}
// 6. Wiederholungstäter: eine Rote Karte in den letzten zwölf Monaten gibt im Schnitt ein Spiel mehr
{const a=ev('antragFuer'),m=vor=>{let s=0;for(let i=0;i<2000;i++)s+=a({art:'grob',vor});return s/2000;};const d=m(1)-m(0);
  pruef(d>=0.8&&d<=1.2,'Wiederholungstäter: im Schnitt etwa ein Spiel mehr',f2(d));}
// 7. Sperren je Wettbewerb und Saisonwechsel (K09 §3.2)
{const p=S.pl.find(x=>x.team===S.my&&x.inj<=0),sp=ev('sperren')(p);sp.liga.rot=1;sp.liga.gelb=0;sp.pokal.rot=0;sp.pokal.gelb=0;
  const inLiga=ev('mitWettbewerb')('liga',()=>ev('avail')(p)),inPokal=ev('mitWettbewerb')('pokal',()=>ev('avail')(p));
  pruef(!inLiga&&inPokal,'Liga-Sperre gilt nicht im Pokal',`Liga ${inLiga?'spielberechtigt':'gesperrt'}, Pokal ${inPokal?'spielberechtigt':'gesperrt'}`);
  sp.liga.rot=0;sp.liga.gelb=1;sp.pokal.rot=1;sp.pokal.gelb=1;ev('gelbe')(p).liga=7;ev('disziplinSaison')(p);
  pruef(sp.pokal.rot===1&&sp.pokal.gelb===0&&sp.liga.gelb===0&&p.kt.liga===0,'Saisonwechsel: Gelbe und Gelbsperren verfallen, Rot im Pokal läuft weiter',JSON.stringify(sp));
  sp.pokal.rot=0;}
console.log(`\n${N} Saison(s), ${sum.spiele} Ligaspiele, in ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
