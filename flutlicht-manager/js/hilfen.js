// Gemeinsamer Zustand und kleine Helfer.
const ri=(a,b)=>a+Math.floor(R()*(b-a+1)), riA=a=>ri(a[0],a[1]), pick=a=>a[Math.floor(R()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function fmt(n){const a=Math.abs(n);if(a>=1e6)return (n/1e6).toLocaleString('de-DE',{minimumFractionDigits:a>=1e7?1:2,maximumFractionDigits:a>=1e7?1:2})+' Mio €';if(a>=1e3)return Math.round(n/1e3).toLocaleString('de-DE')+' Tsd €';return Math.round(n)+' €';}
const de=(n,d=0)=>Number(n).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
// S = Spielstand (wird gespeichert). Alles andere hier ist Zustand der Oberfläche.
let S=null,PIX=new Map(),TAB='buero',CONF=null,LAST=null,SORT='pos',TLG=0,TDAY=null,BUSY=false;
const TF={pos:'',lg:'',max:'',q:'',list:0,land:''};
const app=document.getElementById('app'), ovEl=document.getElementById('ov');
function reindex(){PIX=new Map(S.pl.map(p=>[p.id,p]));if(S.ausland)S.ausland.pl.forEach(p=>PIX.set(p.id,p));if(S.jg)S.jg.forEach(p=>PIX.set(p.id,p));if(S.zw)S.zw.forEach(p=>PIX.set(p.id,p));} // Ligaspieler, Auslandspool (K32), Jugend (K08) und Zweite (K08 §5.6)
function addP(p){S.pl.push(p);PIX.set(p.id,p);return p;}
const myT=()=>S.teams[S.my];
const squad=tid=>S.pl.filter(p=>p.team===tid);
const tn=id=>id>=AV0?avVon(id).name:id>=1000?S.am[id-1000].name:S.teams[id].name; // ab 2000 Auslandsvereine (js/ausland.js), ab 1000 Amateure
const last=n=>n.split(' ').slice(-1)[0];
function news(t,c=''){S.news.unshift({t,c,w:datumKurz(S.tag)});if(S.news.length>REGELN.spielstand.nachrichtenMax)S.news.length=REGELN.spielstand.nachrichtenMax;}
function money(k,v){myT().cash+=v;S.fin[k]=(S.fin[k]||0)+v;}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,3200);}
// Speichern im Browser. Scheitert es (meist: Speicher voll), sagt das Spiel es einmal im Posteingang, statt still nicht mehr zu speichern (T2.5).
let SPEICHER_FEHLER=false;
// Speicherort (Desktop-App, 26.11.): In der Windows-App (Ordner desktop/) liegt der Spielstand als Datei im Benutzerordner, ohne die Größengrenze des Browsers
// und ohne das Löschen nach sieben Tagen (konzepte/_luecken.md L1). Die App stellt dafür window.flutlichtApp bereit (desktop/preload.js). Im Browser wie bisher localStorage.
const APP_SPEICHER=()=>(typeof window!=='undefined'&&window.flutlichtApp)||null;
function speicherLesen(k){const a=APP_SPEICHER();return a?a.lesen(k):localStorage.getItem(k);}
function speicherSchreiben(k,v){const a=APP_SPEICHER();if(a){if(!a.schreiben(k,v))throw new Error('Datei nicht geschrieben');return;}localStorage.setItem(k,v);}
function save(){try{speicherSchreiben(REGELN.spielstand.schluessel,JSON.stringify(S));SPEICHER_FEHLER=false;}catch(e){if(!SPEICHER_FEHLER&&S){SPEICHER_FEHLER=true;news(APP_SPEICHER()?'Der Spielstand ließ sich nicht als Datei speichern, vermutlich ist die Festplatte voll oder der Ordner gesperrt. Was seit dem letzten Speichern passiert ist, geht beim Schließen verloren. Sichere ihn über „Menü“ als Datei an einem anderen Ort.':'Der Browser hat den Spielstand nicht gespeichert, vermutlich ist sein Speicher voll. Was seit dem letzten Speichern passiert ist, geht beim Schließen verloren. Sichere ihn jetzt als Datei (Menü, „Als Datei sichern“) und gib in den Browser-Einstellungen Speicher frei.','bad');}}} /* Hinweis auf die Datei: Prüfung GK7 */
function hasSave(){try{return !!speicherLesen(REGELN.spielstand.schluessel);}catch(e){return false;}}
