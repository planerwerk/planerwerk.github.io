// Simulator ohne Browser (Konzept K02 §10.2): lädt Daten und Spiellogik in Node, mit kleinen Attrappen für Oberfläche und Speicher.
// Als Modul: const {neueWelt,saisons}=require('./sim'). Direkt: node tests/sim.js [Saisons] [Seed] [Vereinsindex]
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');

function skripte(){const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  return [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]).filter(f=>f!=='js/start.js');}

// Eine frische Spielwelt im eigenen Kontext. Funktionen über F, Spielstand über W.S, Konstanten und Pfeilfunktionen über W.ev('name').
function neueWelt(){
  const el=()=>({innerHTML:'',textContent:'',hidden:true,value:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},
    addEventListener(){},removeEventListener(){},querySelector(){return null;},querySelectorAll(){return [];},appendChild(){},focus(){},blur(){},scrollIntoView(){},getBoundingClientRect(){return{left:0,top:0,width:0,height:0};}});
  const els={},store={};
  const document={getElementById:id=>els[id]||(els[id]=el()),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},createElement:()=>el(),body:el(),documentElement:el()};
  const localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];},clear:()=>{for(const k in store)delete store[k];}};
  const ctx={console,document,localStorage,crypto:require('crypto').webcrypto,setTimeout,clearTimeout,requestAnimationFrame:f=>setTimeout(f,0),navigator:{}};ctx.window=ctx;
  vm.createContext(ctx);
  const code=skripte().map(f=>fs.readFileSync(path.join(ROOT,f),'utf8')).join('\n;\n')
    +'\n;render=function(){};closeOv=function(){};showSummary=function(){};toast=function(){};'
    +'\nthis.__W={get S(){return S;},set S(v){S=v;},ev:c=>eval(c)};';
  vm.runInContext(code,ctx,{filename:'flutlicht-manager.js'});
  return {W:ctx.__W,F:ctx};}

// Spielt N Saisons mit einem Verein, der alles automatisch macht (Aufstellung, Sponsor, Sommerpause, Jobwechsel).
// beiSaisonende(S,F) wird am Ende jeder Saison aufgerufen, solange Tabellen und Ergebnisse noch vollständig sind.
// beiSaisonstart(S,F) direkt nach dem Welt-Aufbau und nach jedem Saisonwechsel (1. Juli).
function saisons({n=1,seed=1,verein=6,beiSaisonende=null,beiSaisonstart=null}={}){
  const {W,F}=neueWelt();
  F.buildWorld(seed);let S=W.S;S.my=verein;S.mgr='Simulator';F.setTarget();F.sponsOffers();S.lineup=F.bestXI(verein,W.ev('myT()').form);
  const job=()=>{const S=W.S;if(!S.fired)return;if(!S.jobs||!S.jobs.length)F.mkJobs();const id=S.jobs[0];
    S.my=id;S.fired=0;S.trust=W.ev('RV').neuerJob;S.offers=[];S.constr=null;S.loan=0;S.fin={};S.att=[0,0];F.setTarget();S.spons=null;F.sponsOffers();S.lineup=F.bestXI(id,W.ev('myT()').form);};
  let fertig=0,schritte=0,saison=null;
  while(fertig<n&&schritte<5000){schritte++;S=W.S;
    if(S.season!==saison&&S.phase==='play'){saison=S.season;if(beiSaisonstart)beiSaisonstart(S,F);}
    if(S.sponsOffers)F.sponsorWaehlen(0);
    if(S.phase==='end'){if(beiSaisonende)beiSaisonende(S,F);fertig++;job();if(fertig>=n)break;F.sommerpause();continue;}
    job();
    if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);
    F.weiter();}
  return {W,F,S:W.S};}

// Kennzahlen einer Saison je Liga: Tore pro Spiel, Heimsieg, Remis, Auswärtssieg
function kennzahlen(S){const out={};
  for(const lg of [1,2,3]){const r=S.res[lg];if(!r||!r.length)continue;let t=0,h=0,u=0,a=0;
    r.forEach(([,,hg,ag])=>{t+=hg+ag;if(hg>ag)h++;else if(hg<ag)a++;else u++;});
    out[lg]={spiele:r.length,tore:t/r.length,heim:h/r.length,remis:u/r.length,auswaerts:a/r.length};}
  return out;}

module.exports={neueWelt,saisons,kennzahlen,ROOT};

if(require.main===module){
  const n=+(process.argv[2]||1),seed=+(process.argv[3]||1),verein=+(process.argv[4]||6),t0=Date.now();
  saisons({n,seed,verein,beiSaisonende:(S)=>{const k=kennzahlen(S);
    console.log(`Saison ${S.season}/${(S.season+1)%100}: `+Object.entries(k).map(([lg,x])=>`${lg}. Liga ${x.tore.toFixed(2)} Tore, H/U/A ${(x.heim*100).toFixed(0)}/${(x.remis*100).toFixed(0)}/${(x.auswaerts*100).toFixed(0)} %`).join(' · '));}});
  console.log(`${n} Saison(s) in ${((Date.now()-t0)/1000).toFixed(1)} s`);
}
