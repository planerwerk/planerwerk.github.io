// Marketing (K25 §5.4, K25a): Trikot je Saison mit Reaktion der Fans, Kampagnen mit abnehmendem Ertrag, Werbewert, Faktoren im Fanartikel-Erlös. Zuerst nur dein Verein.
// Im Spielstand: S.mk = {s, trikot: {d Design, f Faktor, fest}, k: {Art: {n Zahl in der Saison, bis absoluter Tag, w Wirkung}}, fans (Bonus zum Saisonende), ww (Werbewert 0–100)}.
// Zufall nur bei der Reaktion auf das Trikot (eigener Strom 'trikot' je Saison). Geldneutral bis K23c: Faktoren auf den heutigen Fanartikel-Erlös.
const TRIKOT_NAME={klassisch:'klassisches Design',modern:'modernes Design',mutig:'mutiges Design'};
function mkS(){const t=myT();let M=S.mk;if(!M||M.s!==S.season){const ww=M&&M.ww!=null?M.ww:Math.round(t.rep*RMK.werbewert.startJeAnsehen);M=S.mk={s:S.season,trikot:null,k:{},fans:0,ww};}return M;}
const mkAktiv=k=>{const M=S.mk;return !!M&&M.s===S.season&&!!M.k[k]&&M.k[k].bis>=absTag(S.tag);};
const kampagnenKosten=k=>{const t=myT();return Math.round(RMK.kampagnen[k].kosten*(RMK.ligaFaktor[t.lg]||RMK.ligaFaktor[3])/1000)*1000;};
// Kampagne (K25 §5.1): Kosten sofort, Wirkung mit abnehmendem Ertrag in derselben Saison, jede Art höchstens einmal gleichzeitig
function kampagneStarten(k){if(!darf('marketing'))return;const C=RMK.kampagnen[k],t=myT();if(!C)return;const M=mkS();
  if(mkAktiv(k)){toast(`${C.name} läuft schon.`);return;}if(C.sommer&&!vorbereitungAktiv()){toast(`${C.name} gibt es nur in der Vorbereitung.`);return;}
  if(C.dauerkarten&&dkAktuell()){toast('Die Dauerkarten sind schon verkauft.');return;} // Dauerkarten-Aktion nur vor dem Verkauf (K25c)
  const kosten=kampagnenKosten(k);if(t.cash<kosten){toast('Dafür reicht dein Kontostand nicht.');return;}
  const e=M.k[k]||(M.k[k]={n:0,bis:-1,w:1}),w=RMK.abnutzung[Math.min(e.n,RMK.abnutzung.length-1)];e.n++;e.w=w;
  e.bis=C.sommer?absTag(ersterPflichttag(S.my)!=null?ersterPflichttag(S.my):S.tag):absTag(S.tag)+C.tage;money('Marketing',-kosten);
  if(C.fans)M.fans+=C.fans*w;if(C.werbewert)M.ww=clamp(Math.round(M.ww+C.werbewert*w),0,100);if(C.stimmung)fanAnlass(t,'fanU',C.stimmung*w);
  if(C.mitglieder)t.mitglieder=Math.round(mitgliederVon(t)*(1+C.mitglieder*w)); // Mitgliederaktion (K25d)
  news(`${C.name} gestartet (${fmt(kosten)})${w<1?`. Zum ${e.n}. Mal in dieser Saison, Wirkung nur noch ${Math.round(w*100)} %`:''}.`);save();render();}
// Trikot (K25 §5.3): Wahl bis zum ersten Pflichtspiel, Reaktion aus eigenem Strom je Saison (gleich, egal an welchem Tag)
function trikotWaehlen(d){if(!darf('marketing'))return;const M=mkS();if(M.trikot&&M.trikot.fest){toast('Das Trikot dieser Saison ist schon vorgestellt.');return;}if(!RMK.trikot[d])return;trikotVorstellen(d,false);save();render();}
function trikotVorstellen(d,auto){const M=mkS(),T=RMK.trikot[d],t=myT();
  mitStrom(strom('trikot',S.season,S.my),()=>{let f,fs,txt;
    if(d==='mutig'){const kult=R()<T.kult;f=kult?T.faktor[1]:T.faktor[0];fs=kult?T.fans[1]:T.fans[0];txt=kult?'Das mutige Trikot wird Kult, die Fans reißen es den Händlern aus den Händen.':'Das mutige Trikot spaltet die Fans, in den Netzwerken gibt es Spott.';}
    else{f=T.faktor[0]+R()*(T.faktor[1]-T.faktor[0]);fs=T.fans;txt=d==='klassisch'?'Das klassische Trikot kommt gut an.':'Das moderne Trikot findet seine Käufer.';}
    M.trikot={d,f:Math.round(f*100)/100,fest:1};if(fs)fanAnlass(t,'fanU',fs);
    news(`Trikotvorstellung${auto?' (der Verein wählt)':''}: ${TRIKOT_NAME[d]}. ${txt}`,d==='mutig'?(fs>0?'good':'bad'):'');});}
// Täglich (ablauf.js taeglichLauf): ohne Wahl am Tag vor dem ersten Pflichtspiel das klassische Trikot (mit und ohne Automatik am selben Tag, Gleichschritt);
// am Monatsersten geht der Werbewert 2 % zurück Richtung Start
function marketingTag(d){if(S.phase!=='play')return;const M=mkS(),e=ersterPflichttag(S.my);if(!M.trikot&&e!=null&&d>=e-1)trikotVorstellen('klassisch',true);
  if(mmtt(d).slice(3)==='01'){const W=RMK.werbewert,start=myT().rep*W.startJeAnsehen;M.ww=Math.round((M.ww+(start-M.ww)*W.zurueck)*10)/10;}}
// Faktor auf den Fanartikel-Erlös im Heimspiel (ablauf.js heimspielEinnahmen)
function merchFaktor(t){if(!t||t.id!==S.my)return 1;const M=mkS(),E=RMK.merch;let f=M.trikot?M.trikot.f:1;
  const lieb=squad(S.my).filter(p=>istLiebling(p,S.my)).length;f*=1+Math.min(E.lieblingMax,lieb*E.liebling);
  if(mkAktiv('trikot'))f*=1+RMK.kampagnen.trikot.merch*(M.k.trikot.w||1);if(M.extra&&M.extra.bis>=absTag(S.tag))f*=1+M.extra.f;return f;} // extra: Karte „Trikot ausverkauft“ (K25b)
// Pfiffe bei Protest (fans.js fansHeimspiel): mit laufender Fanarbeit schwächer
const fanarbeitFaktor=()=>mkAktiv('fanarbeit')?RMK.kampagnen.fanarbeit.pfiffe:1;
// Saisonende (saison.js seasonEndLauf): Titel heben den Werbewert. Saisonwechsel (newSeasonLauf, vor S.season++): Fans-Bonus der Kampagnen
function marketingSaisonende(sm){const M=mkS(),W=RMK.werbewert;const titel=[sm.champ,sm.champ2,sm.champ3,sm.cup].includes(S.my)||[...sm.up,...sm.up3,...sm.up4].includes(S.my);if(titel)M.ww=clamp(Math.round(M.ww+W.titel),0,100);}
function marketingNeueSaison(){const M=S.mk,t=myT();if(!M||M.s!==S.season||!M.fans)return;t.fans=Math.round(t.fans*(1+M.fans));news(`Die Kampagnen der Saison bringen ${Math.round(M.fans*100)} % mehr Anhänger.`,'good');}
// Vereinswechsel (saison.js takeJob): Trikot, Kampagnen und Werbewert gehören dem alten Verein, beim neuen beginnt alles mit seinem Ansehen
function marketingJobwechsel(){S.mk=null;}
// Karte im Stadion
function marketingKarte(){const t=myT(),M=mkS(),C=RMK.kampagnen,tr=M.trikot,offen=!tr||!tr.fest;
  return`<div class="card"><h2>Marketing</h2>${lzHinweis('marketing')}<p>Werbewert ${Math.round(M.ww)} von 100 <span class="dim">(wie bekannt der Verein ist, wirkt später auf Sponsoren)</span></p>
    <p>Mitglieder ${mitgliederVon(t).toLocaleString('de-DE')} <span class="dim">(Beiträge etwa ${fmt(mitgliederVon(t)*RFP.mitglieder.beitrag)} je Saison, wachsen und schrumpfen mit den Fans, K25d)</span></p>
    <h3>Trikot ${stSaison(S.season)}</h3>${tr?`<p>${esc(TRIKOT_NAME[tr.d])}, Fanartikel × ${de(tr.f,2)}</p>`:offen&&vorbereitungAktiv()?`<div class="row">${Object.keys(RMK.trikot).map(d=>`<button onclick="trikotWaehlen('${d}')"${lzAus('marketing')}>${esc(TRIKOT_NAME[d])}</button>`).join('')}</div><p class="dim">Klassisch ist sicher, mutig wird Kult oder Spott. Ohne Wahl nimmt der Verein vor dem ersten Pflichtspiel das klassische.</p>`:'<p class="dim">Das Trikot wird in der Vorbereitung vorgestellt.</p>'}
    <h3>Kampagnen</h3><table><tbody>${Object.entries(C).map(([k,c])=>{const e=M.k[k],aktiv=mkAktiv(k);return`<tr><td><b>${esc(c.name)}</b><br><span class="dim">${fmt(kampagnenKosten(k))}${c.sommer?', nur in der Vorbereitung':`, ${Math.round(c.tage/7)} Wochen`}${e&&e.n?`, in dieser Saison ${e.n}×`:''}</span></td>
      <td>${aktiv?'läuft':`<button onclick="kampagneStarten('${k}')"${lzAus('marketing')}>Starten</button>`}</td></tr>`;}).join('')}</tbody></table>
    <p class="dim">Dieselbe Kampagne wirkt in einer Saison beim zweiten Mal halb, beim dritten Mal ein Viertel. Fanartikel im Heimspiel × ${de(merchFaktor(t),2)} (Trikot, Lieblinge, Kampagne).</p></div>`;}
