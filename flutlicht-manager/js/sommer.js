// Sommerpause und Vorbereitung (K12a): Urlaub je Verein nach dem letzten eigenen Pflichtspiel, Laufplan bis zum Trainingsauftakt,
// Saisonbelastung als verdeckter Wert, Leistungstest beim Auftakt, Springen im Sommer bis zum nächsten echten Halt.

// Trainingsauftakt deines Vereins: Standard aus dem Kalender, früher oder später nach deiner Wahl (K12a §4.1). Computer-Vereine nehmen den Standard.
const auftaktTag=t=>S.plan.trainingsauftakt+(t&&t.id===S.my&&S.sommer?S.sommer.versatz||0:0);
// Urlaubswahl deines Vereins (Wochen) mit Vorschlag des Co-Trainers nach der Saisonbelastung der Stammspieler
const urlaubWochen=t=>t&&t.id===S.my&&S.sommer&&S.sommer.urlaub?S.sommer.urlaub:RSO.urlaubStandard;
function urlaubVorschlag(tid){const sq=squad(tid).sort((a,b)=>(b.sb||0)-(a.sb||0)).slice(0,14),m=sq.length?sq.reduce((a,p)=>a+(p.sb||0),0)/sq.length:0;
  return{wochen:m>=RSO.vorschlag[1]?4:m>=RSO.vorschlag[0]?3:2,belastung:Math.round(m)};}
// Status eines Vereins: 'urlaub', 'laufplan' oder '' (Training oder Spielbetrieb)
function sommerStatus(t){if(!t)return'';if(t.urlaub>0)return'urlaub';if(t.urlaubFertig&&(S.phase!=='play'||S.tag<auftaktTag(t)||S.tag>=S.plan.ende-RSO.endphase))return'laufplan';return'';}
// Täglich je Verein: Urlaub beginnt zwei Tage nach dem letzten eigenen Pflichtspiel der Saison, läuft herunter, danach Laufplan bis zum Auftakt
function sommerTag(t,a,d){if(t.urlaub>0){t.urlaub--;if(t.urlaub===0)t.urlaubFertig=true;return;}
  if(!t.urlaubFertig&&t.urlaubAb==null&&(S.phase==='sommer'||saisonFertig(t,a,d))){t.urlaubAb=S.phase==='sommer'?d:d+RSO.urlaubBeginnNach;}
  if(t.urlaubAb!=null&&!(t.urlaub>0)&&!t.urlaubFertig&&(S.phase!=='play'||d>=t.urlaubAb)){t.urlaub=urlaubWochen(t)*7;t.urlaubGesamt=t.urlaub;
    squad(t.id).forEach(p=>{p.koVor=p.ko;});kabineUrlaub(t,urlaubWochen(t));if(t.id===S.my)news(`Die Mannschaft geht in den Urlaub (${urlaubWochen(t)} Wochen).`);}}
// Keine Pflichtspiele mehr in dieser Saison: nur in den letzten Wochen der Saison, ohne Spiel in Sicht und nach dem letzten bekannten Spieltag (Pokal und Relegation eingeschlossen)
let LETZTER={key:null,m:null};
function letzterSpieltag(d){const key=S.season+'/'+d;if(LETZTER.key===key)return LETZTER.m;const m=new Map();for(let x=S.plan.ende;x>=S.plan.ende-RSO.endphase;x--)spielendeAm(x).forEach(id=>{if(!m.has(id))m.set(id,x);});LETZTER={key,m};return m;}
function saisonFertig(t,a,d){if(S.phase!=='play'||d<S.plan.ende-RSO.endphase||(a&&(a.next!=null||a.heute)))return false;const l=letzterSpieltag(d).get(t.id);return l==null||l<d;}
// Laufplan (K12a §4): Spieler halten sich selbst fit, höchstens bis zum Stand vor dem Urlaub. Partylöwen lassen weiter nach.
function laufplanTag(p){const L=RSO.laufplan;if(hatEig(p,'partyloewe')){p.ko=Math.max(0,p.ko+L.partyloewe);return;}
  if(p.koVor!=null&&p.ko<p.koVor)p.ko=Math.min(p.koVor,p.ko+L.proTag*profi(p)/L.profiTeiler);}
// Neue Saison: Urlaubszustand für alle zurücksetzen, die schon fertig sind (der Zähler läuft weiter, falls jemand noch im Urlaub ist)
function sommerNeueSaison(){S.teams.forEach(t=>{if(t.urlaub>0)return;if(!t.urlaubFertig&&t.urlaubAb==null)return;t.urlaubAb=null;});}
// Nach dem Auftakt: Merker zurücksetzen, damit der nächste Sommer neu beginnt
function sommerAuftakt(t){t.urlaubFertig=false;t.urlaubAb=null;}
// Leistungstest (K12a §5.2) am zweiten Tag nach dem Auftakt: genaue Kondition, Auffällige
function leistungstest(){const sq=squad(S.my).filter(p=>p.inj<=0);if(!sq.length)return;const m=sq.reduce((a,p)=>a+p.ko,0)/sq.length,T=RSO.leistungstest;
  const dick=sq.filter(p=>p.ko<=m-T.uebergewichtAb).sort((a,b)=>a.ko-b.ko).slice(0,T.meldungenMax),top=sq.filter(p=>p.koVor!=null&&p.ko>p.koVor+0.5).sort((a,b)=>(b.ko-b.koVor)-(a.ko-a.koVor)).slice(0,T.meldungenMax);
  news(`Leistungstest: Kondition im Schnitt ${Math.round(m)}.${dick.length?` Mit Übergewicht aus dem Urlaub: ${dick.map(p=>`${p.n} (${Math.round(p.ko)})`).join(', ')}.`:''}${top.length?` Im Urlaub durchgezogen: ${top.map(p=>`${p.n} (${Math.round(p.ko)})`).join(', ')}.`:''}`,dick.length?'bad':'');}
// Sommerkarte (Training und Saisonbilanz): Urlaubslänge und Trainingsauftakt wählen
function sommerKarte(){const t=myT(),st=sommerStatus(t),v=urlaubVorschlag(S.my),w=urlaubWochen(t),vs=(S.sommer&&S.sommer.versatz)||0;
  const lage=st==='urlaub'?`Die Mannschaft ist im Urlaub, noch ${t.urlaub} Tage.`:st==='laufplan'?`Urlaub vorbei. Die Spieler halten sich selbst fit (Laufplan) bis zum Trainingsauftakt.`:'Der Urlaub beginnt zwei Tage nach dem letzten Pflichtspiel der Saison.';
  return`<div class="card"><h2>Sommerpause</h2><p>${lage}</p><p class="dim">Co-Trainer: ${v.wochen} Wochen (Saisonbelastung der Stammspieler ${v.belastung}). Langer Urlaub baut die Belastung ab, kostet aber Kondition. Viel eingesetzte Spieler brauchen ihn.</p>
    <div class="row">${RSO.urlaubWochen.map(x=>`<button class="wahl ${x===w?'on':''}" aria-pressed="${x===w}" onclick="setUrlaub(${x})">${x} Wochen Urlaub</button>`).join('')}</div>
    <p class="dim" style="margin-top:8px">Trainingsauftakt: früher heißt längere Vorbereitung, später mehr Zeit für den Laufplan.</p>
    <div class="row">${RSO.auftaktVersatz.map(x=>`<button class="wahl ${x===vs?'on':''}" aria-pressed="${x===vs}" onclick="setAuftakt(${x})">${x<0?'eine Woche früher':x>0?'eine Woche später':'Standard'}</button>`).join('')}</div></div>`;}
// Saisonbelastung (K12a §3.1): bremst ab 50 die Erholung und erhöht das Verletzungsrisiko
const belastungErholung=p=>1-RSO.belastung.erholung*Math.max(0,(p.sb||0)-RSO.belastung.ab);
const belastungRisiko=p=>1+RSO.belastung.risiko*Math.max(0,(p.sb||0)-RSO.belastung.ab);
// Springen ohne 7-Tage-Grenze in Urlaub und Laufplan deines Vereins (K12a §4.2, vorläufig): Halte gibt es weiter bei Fristen, Saisonwechsel und Auftakt
const sommerSprung=()=>S.phase==='sommer'||(S.phase==='play'&&!!sommerStatus(myT()));
