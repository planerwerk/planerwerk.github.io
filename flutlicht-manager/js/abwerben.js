// Transfers II (K20 §5.4, U15): heimlich abwerben, Deadline Day, Bieterrunde beim Verkauf.
// Im Spielstand: S.abw = {Spieler-Kennung: {b: Wechselbereitschaft, n: Treffen, w: Woche des letzten Treffens, s: Saison, auf: aufgeflogen, ok: Wechselwunsch erreicht}},
// am Spieler p.abwF = {s: Saison, tid: Verein} (Ablöse +15 % bei diesem Verein bis zum Saisonende), p.bieterF = Fenster der letzten Bieterrunde.
// Zufall: Abwerben und Bieterrunde sind deine Handlungen und würfeln im Grundstrom (wie K17). Der zusätzliche Markttag am Deadline Day hat den Strom 'deadline'.

// ---------- Abwerben ----------
const abwWoche=()=>Math.floor(absTag(S.tag)/7);
const abwVon=p=>{const a=(S.abw||{})[p.id];return a&&a.s===S.season?a:null;};
const abwerbbar=p=>!!p&&p.team!==S.my&&p.team>=0&&p.team<1000&&!istAusland(p)&&!p.leihe&&!p.wech&&!!S.teams[p.team]&&aktiv(S.teams[p.team]);
function abwGrund(p){const a=abwVon(p);if(!abwerbbar(p))return'nicht möglich';if(a&&a.auf)return'aufgeflogen, in dieser Saison nicht mehr';if(a&&a.ok)return'er hat schon um den Wechsel gebeten';if(a&&a.w===abwWoche())return'diese Woche schon getroffen';return'';}
// Zuwachs der Wechselbereitschaft je Treffen (K20 §5.1)
function abwPlus(p){const A=RAW.bereitschaft,b=beraterVon(p),st=stimmung(p),I=clamp(wechselInteresse(p),A.interesse[0],A.interesse[1]);
  return Math.max(0,(A.basis+A.jeInteresse*I)*((b&&A.berater[b.prof])||1)*(st<A.stimmung.unter[0]?A.stimmung.unter[1]:st>A.stimmung.ueber[0]?A.stimmung.ueber[1]:1)*(hatEig(p,'vereinstreu')?A.treu:1));}
// Risiko des Auffliegens je Treffen (K20 §5.2), n: bisherige Treffen
function abwRisiko(p,ort,n){const A=RAW.risiko,b=beraterVon(p);return Math.min(1,A.basis*(p.str>A.bekanntAb?A.bekannt:1)*(b?(A.berater[b.prof]||1):A.ohneBerater)*RAW.ort[ort].risiko*(1+A.jeTreffen*n));}
const abwRisikoWort=r=>r<0.05?'Risiko gering':r<0.12?'Risiko mittel':'Risiko hoch';
function abwTreffen(id,ort){if(!darf('abwerben'))return;const p=PIX.get(id),O=RAW.ort[ort];if(!p||!O)return;const g=abwGrund(p);if(g){toast(`Kein Treffen: ${g}.`);return;}
  if(ort==='berater'&&!beraterVon(p)){toast('Er hat keinen Berater.');return;}if(myT().cash<O.kosten){toast('Dafür reicht dein Kontostand nicht.');return;}
  const L=S.abw||(S.abw={}),a=abwVon(p)||(L[p.id]={b:0,n:0,s:S.season});money('Abwerben',-O.kosten);
  const risiko=abwRisiko(p,ort,a.n);a.n++;a.w=abwWoche();const petzt=hatEig(p,'vereinstreu')&&R()<RAW.risiko.petzen;
  if(petzt||R()<risiko)abwAufgeflogen(p,a,petzt);
  else{a.b=Math.min(100,a.b+abwPlus(p));if(a.b>=RAW.bereitschaft.ab){a.ok=1;wwStufe3(p);news(`${p.n} bittet bei ${tn(p.team)} offiziell um den Wechsel. ${tn(p.team)} setzt ihn auf die Transferliste.`,'good');}
    else news(`Treffen mit ${p.n} (${O.name}): Er hört zu. Wechselbereitschaft jetzt ${Math.round(a.b)} von 100.`);}
  save();render();openP(id);}
// Aufgeflogen (K20 §5.3): Beziehung, Ablöse bis zum Saisonende, Stimmung des Spielers, Vertrauen deines Vorstands. Keine Strafe.
function abwAufgeflogen(p,a,petzt){const F=RAW.folgen,tid=p.team,d=Math.round(F.beziehung[0]+R()*(F.beziehung[1]-F.beziehung[0]));a.auf=1;
  bezDuAendern(tid,d,`Abwerbeversuch bei ${p.n} aufgeflogen`);p.abwF={s:S.season,tid};stimmungAendern(p,F.stimmung);S.trust=clamp(S.trust+F.vertrauen,0,100);
  news(`${petzt?`${p.n} hat ${tn(tid)} von deinen Treffen erzählt`:`Aufgeflogen: Deine Treffen mit ${p.n} sind bekannt geworden`}. ${tn(tid)} ist verärgert, die Ablöse für ihn steigt um ${Math.round((F.forderung-1)*100)} %, dein Vorstand ist nicht begeistert.`,'bad');}
// Faktor auf die Forderung seines Vereins (transfers.js forderungDu)
const abwFaktor=p=>p.abwF&&p.abwF.s===S.season&&p.abwF.tid===p.team?RAW.folgen.forderung:1;
// Karte auf der Spielerkarte (fenster.js openP)
function abwKarte(p){if(!abwerbbar(p))return'';const a=abwVon(p),g=abwGrund(p),b=beraterVon(p),n=a?a.n:0;
  const opts=Object.entries(RAW.ort).filter(([k])=>k!=='berater'||b).map(([k,o])=>`<option value="${k}">${esc(o.name)} (${fmt(o.kosten)}, ${abwRisikoWort(abwRisiko(p,k,n))})</option>`).join('');
  return`<div class="card"><h3>Heimlich treffen</h3>${lzHinweis('abwerben')}<p class="dim">Am Verein vorbei mit ihm${b?' und seinem Berater':''} reden, höchstens einmal je Woche. Ab ${RAW.bereitschaft.ab} Wechselbereitschaft bittet er offiziell um den Wechsel. Fliegt es auf, ärgert sich ${esc(tn(p.team))}, die Ablöse steigt und dein Vorstand ist verstimmt. Strafen gibt es keine.</p>
    ${a?`<p>Wechselbereitschaft <b>${Math.round(a.b)}</b> von 100 nach ${a.n} Treffen.</p>`:''}${g?`<p class="dim">${esc(g.charAt(0).toUpperCase()+g.slice(1))}.</p>`:`<div class="row"><select id="abwort" aria-label="Ort des Treffens">${opts}</select><button onclick="abwTreffen(${p.id},document.getElementById('abwort').value)"${lzAus('abwerben')}>Treffen</button></div>`}</div>`;}

// ---------- Deadline Day (K20 §4.3) ----------
const deadlineTage=(d=S.tag)=>fensterOffen(d)&&!fensterOffen(d+RAW.deadline.tage);
const deadlineLetzter=(d=S.tag)=>fensterOffen(d)&&!fensterOffen(d+1);
// Täglich (ablauf.js taeglichLauf): am letzten Tag ein zusätzlicher Markttag der Computer-Vereine
function deadlineTag(d){if(S.phase!=='play'||!deadlineLetzter(d))return;mitStrom(strom('deadline',S.season,d),market);news('Deadline Day: Heute schließt das Transferfenster. Die Vereine machen noch schnell Geschäfte.','tr');}
function deadlineKarte(){if(S.phase!=='play'||!deadlineTage())return'';const e=fensterEnde(),soll=RS.kaderSoll,sq=squad(S.my),fehlt=Object.keys(soll).map(pos=>[pos,soll[pos]-sq.filter(p=>p.pos===pos).length]).filter(x=>x[1]>0);
  const v=Object.entries(S.verh||{}).map(([id,x])=>[PIX.get(+id),x]).filter(([p,x])=>p&&p.team===x.team&&p.team!==S.my&&(x.f!=null||(x.einig&&x.einig.bis>=S.tag)));
  return`<div class="card"><h3>Deadline Day</h3><p>Das Transferfenster schließt am ${esc(datumKurz(e))}. Danach gelten Einigungen erst ab dem nächsten Fenster.</p><ul>
    <li>Offene Verhandlungen: ${v.length?v.map(([p,x])=>`<a href="#" onclick="openP(${p.id});return false">${esc(p.n)}</a> <span class="dim">(${esc(tn(p.team))}${x.einig&&x.einig.bis>=S.tag?`, einig über ${fmt(x.einig.fee)}`:x.f!=null?`, Gegenangebot ${fmt(x.f)}`:''})</span>`).join(', '):'keine'}</li>
    <li>Angebote für deine Spieler: ${S.offers.length||'keine'}</li><li>Lücken im Kader: ${fehlt.length?fehlt.map(([pos,n])=>`${n} ${pos}`).join(', '):'keine'}</li></ul></div>`;}

// ---------- Bieterrunde beim Verkauf (K20 §4.2) ----------
// Fenster, für das eine Bieterrunde zählt: das offene (sein erster Tag) oder das nächste
function bieterFenster(){if(!fensterOffen())return naechstesFenster();let d=S.tag;while(fensterOffen(d-1))d--;return d;}
function bieterMoeglich(pid){const p=PIX.get(pid);return !!p&&p.team===S.my&&new Set(S.offers.filter(o=>o.pid===pid).map(o=>o.tid)).size>=2&&p.bieterF!==bieterFenster();}
function bieterRunde(pid){if(!darf('transfers'))return;const p=PIX.get(pid);if(!bieterMoeglich(pid))return;const B=RAW.bieter,l=S.offers.filter(o=>o.pid===pid).sort((a,b)=>a.amt-b.amt),b=beraterVon(p),gier=b&&b.prof==='gierig'?B.gierig:0;
  let top=Math.max(...l.map(o=>o.amt));const vor=top,txt=[];
  l.forEach(o=>{if(o.amt>=top)return;const ziel=rundeAb(top*(1+B.plus[0]+R()*(B.plus[1]-B.plus[0])+gier)),neu=Math.min(o.max||o.amt,ziel);if(neu>top){o.amt=neu;top=neu;txt.push(`${tn(o.tid)} ${fmt(neu)}`);}});
  l.forEach(o=>{o.bis=Math.max(o.bis,S.tag+B.frist);});p.bieterF=bieterFenster();
  news(top>vor?`Bieterrunde für ${p.n}: ${txt.join(', ')}. Höchstes Gebot jetzt ${fmt(top)}.`:`Bieterrunde für ${p.n}: Niemand geht über ${fmt(vor)}.`,'offer');save();render();}
function bieterKnoepfe(){const ids=[...new Set(S.offers.map(o=>o.pid))].filter(bieterMoeglich);if(!ids.length)return'';
  return`<div class="row">${ids.map(id=>`<button onclick="bieterRunde(${id})"${lzAus('transfers')}>Bieterrunde für ${esc(PIX.get(id).n)}</button>`).join('')}</div><p class="dim">Bieterrunde: Alle Bieter erfahren das höchste Gebot und dürfen einmal erhöhen. Einmal je Fenster und Spieler.</p>`;}
