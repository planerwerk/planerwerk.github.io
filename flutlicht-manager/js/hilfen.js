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
// Gepackt im Browser-Speicher (Lücke L1, Prüfung GK6, 26.11., vorläufig): Safari nimmt je Seite nach bekannten Messungen nur etwa 2,5 Mio. Zeichen, der Spielstand hat
// nach einer Saison rund 2,85 Mio. Lehnt der Browser das Speichern ab, legt das Spiel den Spielstand gepackt ab, ab dann bis zum Neuladen immer. Verfahren: LZW über die
// UTF-8-Bytes, jeder Code 16 Bit, verteilt auf Zeichen mit 15 Bit ab 32 (keine Steuer- und keine Ersatzzeichen). Wörterbuch bis 65.536 Einträge; ist es voll, beginnt es
// neu (Kopf FLZ2, Prüfung GN3: ein festes Wörterbuch lernte nur aus dem Anfang des Spielstands). FLZ1 (Wörterbuch danach fest) wird weiter gelesen.
// Vor dem Ablegen wird zur Probe entpackt; stimmt das nicht genau, bleibt es beim Fehler und der alte Stand im Speicher. Chrome und Firefox (etwa 5,2 Mio. Zeichen)
// speichern weiter ungepackt, solange es passt. Gelesen wird beides. Ohne Zufall; nur Zeichenketten, Map und Typed Arrays, auch in Node.
const PACK_KOPF='FLZ2:',istGepackt=t=>typeof t==='string'&&/^FLZ[12]:/.test(t);let SPEICHER_GEPACKT=false;
function spielstandPacken(s){const b=unescape(encodeURIComponent(s)),n=b.length,teile=[],puf=[];let acc=0,bits=0,anzahl=0;
  const raus=()=>{teile.push(String.fromCharCode.apply(null,puf));puf.length=0;};
  const code=c=>{acc=(acc<<16)|c;bits+=16;anzahl++;while(bits>=15){bits-=15;puf.push(((acc>>>bits)&0x7FFF)+32);if(puf.length>=8192)raus();}acc&=(1<<bits)-1;};
  if(n){const d=new Map();let next=256,w=b.charCodeAt(0);
    for(let i=1;i<n;i++){const c=b.charCodeAt(i),k=w*256+c,x=d.get(k);if(x!==undefined){w=x;continue;}code(w);d.set(k,next++);if(next===65536){d.clear();next=256;}w=c;} /* voll: neu beginnen (FLZ2) */
    code(w);}
  if(bits>0)puf.push(((acc<<(15-bits))&0x7FFF)+32);raus();
  return PACK_KOPF+anzahl+':'+teile.join('');}
function spielstandEntpacken(t){if(!istGepackt(t))return t;const neu=t.startsWith('FLZ2:'); // FLZ2: Wörterbuch beginnt neu, wenn es voll ist; FLZ1: bleibt fest
  const z=t.indexOf(':',5),anzahl=+t.slice(5,z);if(!(z>0)||!Number.isInteger(anzahl)||anzahl<0)throw new Error('Spielstand gepackt, Kopf beschädigt');
  const codes=new Uint16Array(anzahl);let acc=0,bits=0,j=0;
  for(let i=z+1;i<t.length&&j<anzahl;i++){acc=(acc<<15)|(t.charCodeAt(i)-32);bits+=15;while(bits>=16&&j<anzahl){bits-=16;codes[j++]=(acc>>>bits)&0xFFFF;}acc&=(1<<bits)-1;}
  if(j!==anzahl)throw new Error('Spielstand gepackt, aber unvollständig');
  const pre=new Int32Array(65536),suf=new Uint8Array(65536),erst=new Uint8Array(65536),len=new Int32Array(65536);for(let i=0;i<256;i++){pre[i]=-1;suf[i]=i;erst[i]=i;len[i]=1;}
  let out=new Uint8Array(Math.max(1024,anzahl*4)),pos=0,next=256;
  const platz=m=>{if(pos+m>out.length){const neu=new Uint8Array(Math.max(out.length*2,pos+m));neu.set(out);out=neu;}};
  const schreib=c=>{const l=len[c];platz(l);let p=pos+l-1;for(let x=c;x>=0;x=pre[x])out[p--]=suf[x];pos+=l;};
  if(anzahl){let prev=codes[0];if(prev>255)throw new Error('Spielstand gepackt, aber beschädigt');schreib(prev);
    for(let i=1;i<anzahl;i++){const c=codes[i];let f;
      if(c<next){f=erst[c];schreib(c);}else if(c===next&&next<65536){f=erst[prev];schreib(prev);platz(1);out[pos++]=f;}else throw new Error('Spielstand gepackt, aber beschädigt');
      if(next<65536){pre[next]=prev;suf[next]=f;erst[next]=erst[prev];len[next]=len[prev]+1;next++;if(neu&&next===65536)next=256;}prev=c;}} /* an derselben Stelle wie beim Packen neu */
  const teile=[];for(let i=0;i<pos;i+=8192)teile.push(String.fromCharCode.apply(null,out.subarray(i,Math.min(pos,i+8192))));
  return decodeURIComponent(escape(teile.join('')));}
function gepacktGeprueft(v){const p=spielstandPacken(v);if(spielstandEntpacken(p)!==v)throw new Error('Packen fehlgeschlagen');return p;}
function speicherLesen(k){const a=APP_SPEICHER();return a?a.lesen(k):spielstandEntpacken(localStorage.getItem(k));}
function speicherSchreiben(k,v){const a=APP_SPEICHER();if(a){if(!a.schreiben(k,v))throw new Error('Datei nicht geschrieben');return;}
  const spiel=k===REGELN.spielstand.schluessel;if(spiel&&SPEICHER_GEPACKT){localStorage.setItem(k,gepacktGeprueft(v));return;}
  try{localStorage.setItem(k,v);}catch(e){if(!spiel)throw e;localStorage.setItem(k,gepacktGeprueft(v));SPEICHER_GEPACKT=true;}} /* wirft auch das zweite Mal, bleibt der alte Stand */
// Im gepackten Modus (nur Browser, Prüfung GN1) kostet jedes Speichern Packen und Probe, auf dem Handy grob eine Sekunde. Deshalb dort: nach 1,5 s Ruhe speichern,
// sofort beim Verlassen oder Verstecken der Seite; unveränderte Stände nicht neu packen; nach einem gescheiterten gepackten Versuch erst am nächsten Spieltag wieder.
// Ungepackt (Chrome, Firefox, Simulation, Windows-App) speichert save() wie bisher sofort.
let SPEICHER_TIMER=null,SPEICHER_HOEREN=false,PACK_FEHL_TAG=null,LETZT_GEPACKT=null;
function save(){if(SPEICHER_GEPACKT&&!APP_SPEICHER()&&typeof window!=='undefined'&&typeof window.addEventListener==='function'&&typeof document!=='undefined'&&typeof document.addEventListener==='function'){
    if(!SPEICHER_HOEREN){SPEICHER_HOEREN=true;window.addEventListener('pagehide',speicherJetzt);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')speicherJetzt();});}
    clearTimeout(SPEICHER_TIMER);SPEICHER_TIMER=setTimeout(speicherJetzt,1500);return;}
  speicherJetzt();}
function speicherJetzt(){if(SPEICHER_TIMER){clearTimeout(SPEICHER_TIMER);SPEICHER_TIMER=null;}const j=JSON.stringify(S),gepackt=SPEICHER_GEPACKT&&!APP_SPEICHER();
  if(gepackt&&(j===LETZT_GEPACKT||(SPEICHER_FEHLER&&S&&PACK_FEHL_TAG===S.tag)))return;
  try{speicherSchreiben(REGELN.spielstand.schluessel,j);SPEICHER_FEHLER=false;LETZT_GEPACKT=SPEICHER_GEPACKT&&!APP_SPEICHER()?j:null;}catch(e){if(SPEICHER_GEPACKT&&S)PACK_FEHL_TAG=S.tag;if(!SPEICHER_FEHLER&&S){SPEICHER_FEHLER=true;news(APP_SPEICHER()?'Der Spielstand ließ sich nicht als Datei speichern, vermutlich ist die Festplatte voll oder der Ordner gesperrt. Was seit dem letzten Speichern passiert ist, geht beim Schließen verloren. Sichere ihn über „Menü“ als Datei an einem anderen Ort.':'Der Browser hat den Spielstand nicht gespeichert, vermutlich ist sein Speicher voll. Was seit dem letzten Speichern passiert ist, geht beim Schließen verloren. Sichere ihn jetzt als Datei (Menü, „Als Datei sichern“) und gib in den Browser-Einstellungen Speicher frei.','bad');}}} /* Hinweis auf die Datei: Prüfung GK7 */
function hasSave(){try{const a=APP_SPEICHER(),k=REGELN.spielstand.schluessel;return !!(a?a.lesen(k):localStorage.getItem(k));}catch(e){return false;}} // ohne Entpacken, nur ob etwas da ist
