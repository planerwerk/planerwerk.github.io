// Spielstand (Lücke L1 in konzepte/_luecken.md, 26.11.): Größe und Sauberkeit über mehrere Saisons.
// 1. Größe: Am Ende jeder Saison bleibt JSON.stringify(S) unter 85 % der Browser-Grenze (REGELN.spielstand.browserGrenze, etwa 5,2 Mio. Zeichen).
// 2. Wachstum: ab der dritten Saison höchstens 0,25 Mio. Zeichen je Saison (gemessen am 26.11.: etwa 0,06).
// 3. Sauberkeit: keine Werte, die JSON still verändert (NaN, Infinity, undefined in Listen, Funktionen, Map, Set, Date), sonst steht nach dem Laden etwas anderes da.
// 4. Erinnerung zum Saisonende: Ohne Sicherung als Datei in dieser Saison kommt genau eine Nachricht, nach einer Sicherung keine (Merker je Gerät, nicht im Spielstand).
// Aufruf: node tests/spielstand.js [Saisons, Standard 3]. Nur Node.js.
const {saisons}=require('./sim');
const N=+process.argv[2]||3,probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const mio=n=>(n/1e6).toFixed(2).replace('.',',');
function schmutz(o,pfad,aus,tiefe=0){if(aus.length>=5||tiefe>40)return;
  if(typeof o==='number'){if(!Number.isFinite(o))aus.push(`${pfad} = ${o}`);return;}
  if(typeof o==='function'){aus.push(`${pfad} ist eine Funktion`);return;}
  if(o===null||typeof o!=='object')return;
  {const art=Object.prototype.toString.call(o);if(['[object Map]','[object Set]','[object Date]'].includes(art)){aus.push(`${pfad} ist ${art.slice(8,-1)}`);return;}} // instanceof greift über die vm-Grenze nicht (Prüfung GK8)
  if(Array.isArray(o)){for(let i=0;i<o.length;i++){if(o[i]===undefined){aus.push(`${pfad}[${i}] = undefined`);continue;}schmutz(o[i],`${pfad}[${i}]`,aus,tiefe+1);}return;}
  for(const k of Object.keys(o))schmutz(o[k],`${pfad}.${k}`,aus,tiefe+1);}
const groessen=[];let grenze=0,erinnert=0,W0=null;
saisons({n:N,seed:11,verein:6,vorher:(F,W)=>{W0=W;},beiSaisonende:(S)=>{
  grenze=W0.ev('REGELN').spielstand.browserGrenze;
  const j=JSON.stringify(S);groessen.push([S.season,j.length]);
  const aus=[];schmutz(S,'S',aus);
  pruef(!aus.length,`Saison ${S.season}: keine Werte, die JSON verändert`,aus.length?aus.join('; '):null);
  const n=S.news.filter(x=>/Sichere deinen Spielstand als Datei/.test(x.t)&&x.w===S.news[0].w).length;
  if(groessen.length===1)pruef(n===1,`Saison ${S.season}: ohne Sicherung genau eine Erinnerung zum Saisonende`,n);
  if(groessen.length===1)W0.ev('sicherungMerken()');           // ab jetzt gilt: in dieser Saison gesichert
  if(groessen.length===2)pruef(n===1,`Saison ${S.season}: Sicherung aus der Vorsaison zählt nicht, wieder eine Erinnerung`,n);
  if(groessen.length===2){W0.ev('sicherungMerken()');W0.ev('sicherungErinnern()');pruef(S.news.filter(x=>/Sichere deinen Spielstand/.test(x.t)).length===n,`Saison ${S.season}: nach einer Sicherung in dieser Saison keine weitere Erinnerung`);}
  if(!W0.ev('JSON.stringify(S)').includes('flutlicht-sicherung'))erinnert++;
}});
groessen.forEach(([s,l])=>pruef(l<0.85*grenze,`Saison ${s}: ${mio(l)} Mio. Zeichen, unter 85 % der Browser-Grenze (${mio(0.85*grenze)})`));
for(let i=2;i<groessen.length;i++){const d=groessen[i][1]-groessen[i-1][1];pruef(d<=250000,`Saison ${groessen[i][0]}: Wachstum ${mio(d)} Mio. Zeichen, höchstens 0,25`);}
pruef(erinnert===groessen.length,'Der Merker der letzten Sicherung steht nicht im Spielstand');
// 5. Gepackt im Browser-Speicher (Safari-Grenze etwa 2,5 Mio. Zeichen, Prüfung GK6, js/hilfen.js): Packen und Entpacken ergeben genau denselben Text, auch in
// Grenzfällen; der Spielstand wird deutlich kleiner; lehnt der Speicher ungepackt ab, legt save() gepackt ab, ohne Fehlermeldung, und Lesen ergibt genau den Spielstand.
{const ev=W0.ev,S=ev('S'),j=JSON.stringify(S),pack=ev('spielstandPacken'),entpack=ev('spielstandEntpacken'),t0=Date.now(),p=pack(j),t1=Date.now(),u=entpack(p),t2=Date.now();
  pruef(u===j,'Packen und Entpacken ergeben genau den Spielstand',`${mio(j.length)} → ${mio(p.length)} Mio. Zeichen (${Math.round(100*p.length/j.length)} %), Packen ${t1-t0} ms, Entpacken ${t2-t1} ms`);
  pruef(p.length<0.5*j.length&&p.length<2.4e6,'Gepackt höchstens halb so groß und unter der Safari-Grenze',mio(p.length));
  const proben=['','a','a'.repeat(100000),'äöüßÄÖÜ €—„“ 😀 %25 \\u0000 \n\t','{"x":[1,2,3],"y":"ab'.repeat(5000)+'"}',Array.from({length:70000},(_,i)=>String.fromCharCode(32+(i*7919)%9000)).join('')]; // die letzte füllt das Wörterbuch
  const falsch=proben.filter(s=>entpack(pack(s))!==s).length;pruef(!falsch,'Packen und Entpacken in Grenzfällen (leer, ein Zeichen, lange Wiederholung, Umlaute und Emoji, volles Wörterbuch)',`${falsch} von ${proben.length} falsch`);
  const L=ev('localStorage'),k=ev('REGELN').spielstand.schluessel,orig=L.setItem;L.setItem=(a,b)=>{if(String(b).length>2.5e6)throw new Error('QuotaExceededError');return orig(a,b);};
  ev('SPEICHER_FEHLER=false');ev('save()');const roh=L.getItem(k),fehler=ev('SPEICHER_FEHLER');
  pruef(!fehler&&typeof roh==='string'&&roh.startsWith('FLZ2:')&&ev('speicherLesen')(k)===JSON.stringify(S),'Speicher zu klein (wie Safari): save() legt gepackt ab, ohne Fehlermeldung, Lesen ergibt genau den Spielstand',roh?mio(roh.length)+' Mio. Zeichen':'nichts gespeichert');
  // Prüfung GN2: zweites Speichern im gepackten Modus; dann ist auch gepackt zu groß: der alte Stand bleibt, die Meldung kommt (Simulation ohne Fenster: sofort, ohne Warten)
  S.mgr='Gepackt 2';ev('save()');const zweit=JSON.parse(ev('speicherLesen')(k)).mgr;
  L.setItem=(a,b)=>{if(String(b).length>1e5)throw new Error('QuotaExceededError');return orig(a,b);};S.mgr='Zu groß';ev('save()');const bleibt=JSON.parse(ev('speicherLesen')(k)).mgr,meldung=ev('SPEICHER_FEHLER');L.setItem=orig;
  pruef(zweit==='Gepackt 2'&&bleibt==='Gepackt 2'&&meldung,'Gepackt weiter speichern; ist auch gepackt kein Platz, bleibt der letzte Stand und die Meldung kommt',`zweites Speichern ${zweit}, danach ${bleibt}, Meldung ${meldung}`);
  // FLZ1 (älterer gepackter Stand, Wörterbuch fest) bleibt lesbar: von Hand gepackt „aaa“ = Codes 97, 256 → Zeichen aus den 32 Bit 0x0061 0x0100
  const flz1=(()=>{const v=(97<<16|256)>>>0,c1=((v>>>17)&0x7FFF)+32,c2=((v>>>2)&0x7FFF)+32,c3=(((v&3)<<13)&0x7FFF)+32;return'FLZ1:2:'+String.fromCharCode(c1,c2,c3);})();
  pruef(entpack(flz1)==='aaa','Älterer gepackter Stand (FLZ1) bleibt lesbar',JSON.stringify(entpack(flz1)));}
console.log('PROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
