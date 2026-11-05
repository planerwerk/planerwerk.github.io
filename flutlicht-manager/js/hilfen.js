// Gemeinsamer Zustand und kleine Helfer.
const ri=(a,b)=>a+Math.floor(R()*(b-a+1)), riA=a=>ri(a[0],a[1]), pick=a=>a[Math.floor(R()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function fmt(n){const a=Math.abs(n);if(a>=1e6)return (n/1e6).toLocaleString('de-DE',{minimumFractionDigits:a>=1e7?1:2,maximumFractionDigits:a>=1e7?1:2})+' Mio €';if(a>=1e3)return Math.round(n/1e3).toLocaleString('de-DE')+' Tsd €';return Math.round(n)+' €';}
const de=(n,d=0)=>Number(n).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
// S = Spielstand (wird gespeichert). Alles andere hier ist Zustand der Oberfläche.
let S=null,PIX=new Map(),TAB='buero',CONF=null,LAST=null,SORT='pos',TLG=0,TDAY=null,BUSY=false;
const TF={pos:'',lg:'',max:'',q:'',list:0};
const app=document.getElementById('app'), ovEl=document.getElementById('ov');
function reindex(){PIX=new Map(S.pl.map(p=>[p.id,p]));}
function addP(p){S.pl.push(p);PIX.set(p.id,p);return p;}
const myT=()=>S.teams[S.my];
const squad=tid=>S.pl.filter(p=>p.team===tid);
const tn=id=>id>=1000?S.am[id-1000].name:S.teams[id].name;
const last=n=>n.split(' ').slice(-1)[0];
function wkLabel(){const w=S.cal&&S.cal[S.wk];return w?(w.t==='L'?(w.md+1)+'. ST':'Pokal'):'Sommer';}
function news(t,c=''){S.news.unshift({t,c,w:wkLabel()});if(S.news.length>REGELN.spielstand.nachrichtenMax)S.news.length=REGELN.spielstand.nachrichtenMax;}
function money(k,v){myT().cash+=v;S.fin[k]=(S.fin[k]||0)+v;}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,3200);}
function save(){try{localStorage.setItem(REGELN.spielstand.schluessel,JSON.stringify(S));}catch(e){}}
function hasSave(){try{return !!localStorage.getItem(REGELN.spielstand.schluessel);}catch(e){return false;}}
