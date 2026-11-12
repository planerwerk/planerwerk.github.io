// Einstieg mit Lernstufen (Konzept K36, UL). Zahlen und Bereiche in daten/regeln.js unter REGELN.lizenz (Kurzform RLZ).
// Die Lernstufen heißen im Spiel „Lizenz“ (Teamleiter, C, B, A, Pro). Gesperrt heißt automatisch, nicht abgeschaltet:
// Was du noch nicht selbst entscheidest, erledigt der Stab nach denselben Regeln wie bei den Computer-Vereinen. Informationen sind immer frei.
// Ohne S.lizenz (alte Spielstände, Tests ohne Lernstufen) ist alles frei und nichts läuft in der Automatik: Das Spiel verhält sich wie vor UL.

const lizenzName=n=>RLZ.namen[clamp(n,1,RLZ.namen.length)-1];
const bereich=b=>{const B=RLZ.bereiche[b];if(!B)throw new Error('Unbekannter Bereich der Lernstufen: '+b);return B;};
// frei: Du darfst in diesem Bereich selbst entscheiden (Lernstufen aus, oder deine Lizenz reicht)
const frei=b=>{const B=bereich(b);return !S||!S.lizenz||!S.lizenz.an||S.lizenz.stufe>=B.ab;};
// autoB: Der Bereich läuft für deinen Verein in der Automatik (gesperrt, oder frei und von dir beim Stab gelassen). Nur Bereiche mit Automatik.
const autoB=b=>{const B=bereich(b);return !!S&&!!S.lizenz&&!!B.auto&&(!frei(b)||!!S.lizenz.auto[b]);};
// Für die Spiellogik: Gilt für diesen Verein in diesem Bereich die Regel der Computer-Vereine?
const stabMacht=(tid,b)=>tid!==S.my||autoB(b);
function lizenzStart(an){S.lizenz={an:!!an,stufe:1,spiele:0,aufgaben:{},gel:{},auto:{},s0:S.season,karte:null,verlauf:[{stufe:1,s:S.season,tag:S.tag,wie:'start'}]};}
const karriereSaison=()=>S.season-(S.lizenz?S.lizenz.s0:S.season)+1;
// Eine Aufgabe gilt als erledigt, sobald du sie einmal selbst gemacht hast (K36 §5.3). Die Güte der Entscheidung zählt nicht.
function aufgabe(k){if(S.lizenz&&S.lizenz.an&&k)S.lizenz.aufgaben[k]=1;}
// Prüfung vor jeder Aktion: gesperrt → Hinweis und Abbruch. Frei → der Bereich gehört ab jetzt dir (Automatik aus), die Aufgabe zählt.
function darf(b,aufg){if(!S.lizenz)return true;if(!frei(b)){toast(`${bereich(b).name}: frei ab der ${lizenzName(bereich(b).ab)}.`);return false;}
  if(S.lizenz.auto[b])delete S.lizenz.auto[b];aufgabe(aufg);return true;}
// Meldung des Stabs über eine Entscheidung in einem Bereich, den du nicht selbst führst (nur Posteingang, kein Halt, K36 §8)
function stabMeldung(text,art){news(text,art||'');}

// ---------- Aufstieg (K36 §5.3): Mindestzeit und Aufgaben, oder die späteste Zeit ----------
function aufstiegStand(){const L=S.lizenz;if(!L||!L.an||L.stufe>=RLZ.namen.length)return null;const A=RLZ.aufstieg[L.stufe],ks=karriereSaison();
  const mindest=L.spiele>=A.spiele,ab=!A.abSaison||ks>=A.abSaison;
  // Aufgaben ohne Gelegenheit zählen, sobald die Mindestzeit erreicht ist (kein Verfahren, kein Verletzter am Spieltag)
  const liste=A.aufgaben.map(k=>({k,name:RLZ.aufgabenNamen[k]||k,ok:!!L.aufgaben[k]||(RLZ.ohneGelegenheit.includes(k)&&mindest&&!L.gel[k]),ohne:!L.aufgaben[k]&&RLZ.ohneGelegenheit.includes(k)&&mindest&&!L.gel[k]}));
  const erledigt=liste.filter(x=>x.ok).length,Sp=A.spaetestens;
  let spaet=false,spaetText='';
  if(Sp.spiele){spaet=L.spiele>=Sp.spiele;spaetText=`nach ${Sp.spiele} Pflichtspielen (noch ${Math.max(0,Sp.spiele-L.spiele)})`;}
  else{const jahr=L.s0+Sp.saison-1,juli=Sp.datum==='07-01',tag=juli?0:tagAusDatum(`${S.season+1}-${Sp.datum}`,S.season);
    spaet=ks>Sp.saison||(ks===Sp.saison&&S.tag>=tag);spaetText=juli?`am 1. Juli ${jahr}`:`am 1. Januar ${jahr+1}`;}
  return{naechste:L.stufe+1,A,spiele:L.spiele,mindest,ab,abText:A.abSaison?(A.abSaison===2?'frühestens in deiner zweiten Saison':'frühestens nach deiner zweiten Saison'):'',liste,erledigt,aufgabenOk:erledigt>=A.noetig,spaet,spaetText,
    reif:spaet||(mindest&&ab&&erledigt>=A.noetig)};}
function lizenzAufstieg(wie){const L=S.lizenz;if(!L||L.stufe>=RLZ.namen.length)return;const alt=L.stufe;L.stufe++;L.spiele=0;L.gel={};
  // Neu freie Bereiche bleiben zuerst in der Automatik, bis du eingreifst (K36 §4 Nr. 4)
  const neu=Object.keys(RLZ.bereiche).filter(b=>RLZ.bereiche[b].ab===L.stufe);neu.forEach(b=>{if(RLZ.bereiche[b].auto)L.auto[b]=1;});
  L.verlauf.push({stufe:L.stufe,s:S.season,tag:S.tag,wie});L.karte={stufe:L.stufe,wie,tag:S.tag,s:S.season};
  news(`Neue Lizenz: ${lizenzName(L.stufe)}${wie==='zeit'?' (mit der Zeit)':wie==='geholt'?' (sofort geholt)':''}. Neu frei: ${neu.map(b=>RLZ.bereiche[b].name).join(', ')}.`,'good');return alt;}
// Täglich (nicht an einem Tag mit eigenem Spiel, damit die Karte nie vor dem Anpfiff kommt): Gelegenheiten merken, Aufstieg prüfen
function lizenzTag(d){const L=S.lizenz;if(!L||!L.an||L.stufe>=RLZ.namen.length)return;
  if(frei('medizin')&&!autoB('medizin')&&!L.gel.medizin&&squad(S.my).some(p=>{if(p.inj<=0)return false;const i=verletzungInfo(p);return i&&((i.phase==='aufbau'&&!i.pflicht)||(i.spritzbar&&!!meinSpiel(d)));}))L.gel.medizin=1;
  if(S.phase==='play'&&meinSpiel(d))return;const st=aufstiegStand();if(st&&st.reif)lizenzAufstieg(st.mindest&&st.ab&&st.aufgabenOk?'nutzung':'zeit');}
// Nach jedem Pflichtspiel deines Vereins (Liga, Pokal, Relegation, Supercup)
function lizenzSpiel(){if(S.lizenz&&S.lizenz.an)S.lizenz.spiele++;}
// Lizenz-Rückblick am Saisonende (nur Posteingang, K36 §8)
function lizenzRueckblick(){const L=S.lizenz;if(!L||!L.an)return;const st=aufstiegStand();
  news(st?`Lizenz-Rückblick: Du hast die ${lizenzName(L.stufe)}. Für die ${lizenzName(st.naechste)} sind ${st.erledigt} von ${st.A.noetig} nötigen Aufgaben erledigt, spätestens kommt sie ${st.spaetText}.`:`Lizenz-Rückblick: Du hast die ${lizenzName(L.stufe)}, damit ist alles frei.`);}

// ---------- Deine Schalter (K36 §4 Nr. 5 und 6, §6) ----------
function lizenzHolen(){const L=S.lizenz;if(!L||!L.an||L.stufe>=RLZ.namen.length)return;lizenzAufstieg('geholt');save();render();showLizenz();}
// Abschalten macht sofort alles frei. Wieder einschalten geht nur mit einem neuen Spiel. Neu freie Bereiche bleiben in der Automatik, bis du eingreifst.
function lizenzAbschalten(){const L=S.lizenz;if(!L||!L.an)return;Object.keys(RLZ.bereiche).forEach(b=>{if(RLZ.bereiche[b].auto&&!frei(b))L.auto[b]=1;});
  L.an=false;L.karte=null;L.verlauf.push({stufe:L.stufe,s:S.season,tag:S.tag,wie:'aus'});news('Lernstufen abgeschaltet: Alles ist frei. Was bisher der Stab gemacht hat, läuft weiter in der Automatik, bis du eingreifst.');save();render();showLizenz();}
function lizenzAuto(b,an){const L=S.lizenz;if(!L||!bereich(b).auto||!frei(b))return;if(an)L.auto[b]=1;else delete L.auto[b];
  if(b==='aufstellung'&&!an)S.lineup=myXI();save();render();if(document.getElementById('lz-ansicht'))showLizenz();}
function lizenzAllesSelbst(){const L=S.lizenz;if(!L)return;Object.keys(L.auto).forEach(b=>{if(frei(b))delete L.auto[b];});S.lineup=myXI();save();render();showLizenz();}
function lizenzKarteZu(ansehen){if(S.lizenz)S.lizenz.karte=null;save();render();if(ansehen)showLizenz();}

// ---------- Automatik, die es vor UL nicht gab ----------
// Testspiele (K36 §5.2, K11): Der Co-Trainer plant in der Vorbereitung zwei Testspiele gegen Amateure
function testspieleAuto(d){if(S.phase!=='play'||!autoB('testspiele')||!inVorbereitung(d))return;const von=auftaktTag(myT());
  const da=(S.testspiele||[]).filter(x=>x.stand!=='abgesagt'&&x.tag>=von);if(da.length>=RLZ.testspieleAuto)return;
  const tage=testspielTage().filter(t=>inVorbereitung(t)&&!da.some(x=>Math.abs(x.tag-t)<RLZ.testspielAbstand));if(!tage.length)return;
  const t=tage[0],g=testspielGegner(t).find(x=>x.am);if(!g)return;const x=testspielAnfragen(g.id,t);if(x)stabMeldung(`Der Co-Trainer hat ein Testspiel bei ${tn(g.id)} am ${datumKurz(t)} angefragt.`);}
// Sponsor (K36 §5.2): Der Verein nimmt das Angebot mit dem höchsten Grundbetrag
function sponsorAuto(){if(!S.sponsOffers||!autoB('sponsor'))return;let i=0;S.sponsOffers.forEach((o,k)=>{if(o.base>S.sponsOffers[i].base)i=k;});const o=S.sponsOffers[i];sponsorWaehlen(i);
  stabMeldung(`Der Verein hat den Sponsorvertrag mit ${o.name} unterschrieben (${fmt(o.base)} pro Spieltag, das höchste feste Angebot).`);}
// Kredit (K36 §5.2): kein neuer Kredit, am Saisonende Tilgung aus dem Guthaben
function kreditAuto(){if(!autoB('kredit')||!(S.loan>0))return;const t=myT(),a=Math.min(S.loan,Math.max(0,t.cash));if(a<=0)return;S.loan-=a;t.cash-=a;stabMeldung(`Der Verein hat ${fmt(a)} Kredit getilgt.`);}

// ---------- Oberfläche ----------
// Hinweis an einer Funktion: gesperrt („Macht der Co-Trainer · frei ab der B-Lizenz“) oder in der Automatik. Leer, wenn du selbst entscheidest.
function lzHinweis(b){if(!S.lizenz)return'';const B=bereich(b);
  if(!frei(b))return`<p class="lz"><span class="tag">gesperrt</span> ${B.auto?`Macht ${esc(B.wer)}`:'Kommt später'} · frei ab der ${lizenzName(B.ab)}</p>`;
  if(autoB(b))return`<p class="lz"><span class="tag offer">Automatik</span> Macht ${esc(B.wer)}: ${esc(B.tut)}. <button onclick="lizenzAuto('${b}',0)">Selbst machen</button></p>`;return'';}
// Attribut für Bedienelemente gesperrter Bereiche
const lzAus=b=>frei(b)?'':' disabled title="frei ab der '+lizenzName(bereich(b).ab)+'"';
const lzAusAlle=(...bs)=>{for(const b of bs){const x=lzAus(b);if(x)return x;}return'';};
const lzHinweisAlle=(...bs)=>{for(const b of bs){const x=lzHinweis(b);if(x)return x;}return'';};
const lizenzChip=()=>S.lizenz&&S.lizenz.an?`<button class="lzchip" onclick="showLizenz()" title="Deine Lizenz: was frei ist und was der Stab macht">${lizenzName(S.lizenz.stufe)}</button>`:'';
// Aufstiegskarte im Büro (K36 §8): was neu ist, was der Stab bisher getan hat, Knöpfe „Ansehen“ und „Später“
function lizenzKarte(){const L=S.lizenz;if(!L||!L.karte)return'';const n=L.karte.stufe,neu=Object.entries(RLZ.bereiche).filter(([,B])=>B.ab===n),st=aufstiegStand();
  return`<div class="card lzkarte"><h2>Neue Lizenz: ${lizenzName(n)}</h2><p>${L.karte.wie==='nutzung'?'Du hast benutzt, was frei war. Jetzt kommt mehr dazu.':L.karte.wie==='geholt'?'Du hast die Lizenz sofort geholt.':'Die Zeit ist reif: Du hast dem Stab lange genug zugesehen.'}</p>
    <table><tbody>${neu.map(([b,B])=>`<tr><td><b>${esc(B.name)}</b><br><span class="dim">${B.auto?`Bisher: ${esc(B.wer)} ${esc(B.tut)}. Das bleibt so, bis du eingreifst.`:'Neu für dich.'}</span></td><td><button onclick="lizenzKarteZu();tab('${B.tab}')">Hingehen</button></td></tr>`).join('')}</tbody></table>
    ${st?`<p class="dim">Nächste Lizenz: ${lizenzName(st.naechste)}. Dafür: ${st.liste.map(x=>esc(x.name)).join(' · ')} (${st.A.noetig} davon).</p>`:'<p class="dim">Das war die letzte Lizenz. Alles ist frei.</p>'}
    <div class="row"><button class="go" onclick="lizenzKarteZu(1)">Ansehen</button><button onclick="lizenzKarteZu()">Später</button></div></div>`;}
// Lizenz-Ansicht (Menü, Kopfzeile, Büro): Stand, Weg zur nächsten Lizenz, alle Bereiche mit Automatik-Schalter, Überspringen und Abschalten
function showLizenz(){const L=S.lizenz;if(!L){ov(`<div class="phead"><h2>Lernstufen</h2><button class="x" onclick="closeOv()" aria-label="Schließen">✕</button></div><p>Dieser Spielstand hat keine Lernstufen. Alles ist frei.</p>`);return;}
  const st=aufstiegStand(),gruppen=RLZ.namen.map((n,i)=>[i+1,Object.entries(RLZ.bereiche).filter(([,B])=>B.ab===i+1)]);
  const zeile=([b,B])=>{const f=frei(b),a=autoB(b);return`<tr><td>${esc(B.name)}</td><td>${!f?`<span class="tag">gesperrt</span>${B.auto?' macht '+esc(B.wer):''}`:a?`<span class="tag offer">Automatik</span> ${esc(B.wer)}`:'<span class="tag good">du</span>'}</td><td>${f&&B.auto?`<button onclick="lizenzAuto('${b}',${a?0:1})">${a?'Selbst machen':'Dem Stab geben'}</button>`:''}</td></tr>`;};
  const weg=st?`<div class="card"><h3>Weg zur ${lizenzName(st.naechste)}</h3>
      <div class="rgs">${rgAnzeige({label:'Pflichtspiele seit dem Aufstieg',sub:`mindestens ${st.A.spiele}`,min:0,max:Math.max(st.A.spiele,st.A.spaetestens.spiele||st.A.spiele),wert:Math.min(st.spiele,Math.max(st.A.spiele,st.A.spaetestens.spiele||st.A.spiele)),marker:[{v:st.A.spiele,t:'Mindestzeit'}]})}</div>
      <p>Aufgaben (${st.erledigt} von ${st.A.noetig} nötigen): ${st.liste.map(x=>`<span class="${x.ok?'':'dim'}">${x.ok?'✓':'○'} ${esc(x.name)}${x.ohne?' (keine Gelegenheit, zählt)':''}</span>`).join(' · ')}</p>
      <p class="dim">${st.abText?st.abText.charAt(0).toUpperCase()+st.abText.slice(1)+'. ':''}Spätestens kommt die Lizenz ${st.spaetText}, auch ohne Aufgaben.</p>
      <div class="row"><button onclick="lizenzHolen()">Nächste Lizenz jetzt holen</button><button onclick="lizenzAbschalten()">Lernstufen abschalten (alles frei)</button></div>
      <p class="dim">Abschalten gilt sofort und lässt sich in diesem Spiel nicht zurücknehmen.</p></div>`
    :`<div class="card"><p>${L.an?'Du hast die Pro-Lizenz. Alles ist frei.':'Die Lernstufen sind abgeschaltet. Alles ist frei.'}</p></div>`;
  ov(`<div id="lz-ansicht"><div class="phead"><h2>${L.an?'Deine Lizenz: '+lizenzName(L.stufe):'Lernstufen aus'}</h2><button class="x" onclick="closeOv()" aria-label="Schließen">✕</button></div>
    <p class="dim">Was du noch nicht selbst entscheidest, erledigt der Stab nach denselben Regeln wie bei den Computer-Vereinen. Du siehst überall, was er tut. Informationen sind immer frei.</p>${weg}
    ${gruppen.map(([n,l])=>l.length?`<div class="card"><h3>${lizenzName(n)}${L.an&&n>L.stufe?' <span class="dim">(noch gesperrt)</span>':''}</h3><div class="tw"><table><tbody>${l.map(zeile).join('')}</tbody></table></div></div>`:'').join('')}
    ${Object.keys(L.auto).some(b=>frei(b))?`<div class="row"><button onclick="lizenzAllesSelbst()">Alles Freie selbst machen</button></div>`:''}
    <p class="dim">Verlauf: ${L.verlauf.map(v=>`${v.wie==='aus'?'abgeschaltet':lizenzName(v.stufe)} ${v.s}/${(v.s+1)%100}${v.wie==='zeit'?' (Zeit)':v.wie==='geholt'?' (geholt)':v.wie==='nutzung'?' (Nutzung)':''}`).join(' · ')}</p></div>`);}
