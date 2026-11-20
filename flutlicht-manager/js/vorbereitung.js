// Saisonvorbereitung (K12b §5, U14): Liste „Vor dem Saisonstart“ im Büro, Erinnerung höchstens einmal je Woche, Saisoneröffnung mit Einnahme und Mannschaftsfoto für alle Vereine.
// Im Spielstand: S.vb = {er: absoluter Tag der letzten Erinnerung}, am Verein t.eroe = Saison der letzten Saisoneröffnung, Mannschaftsfotos in S.stat.foto (K34).
// Zufall nur für den Regen, im eigenen Strom 'eroeffnung' je Verein und Saison.

// Erster Pflichtspieltag eines Vereins: erstes Ligaspiel, erste Pokalrunde (wenn dabei), Supercup
function ersterPflichttag(tid){const t=S.teams[tid];if(!t||!S.plan)return null;let d=Infinity;const fx=S.fx&&S.fx[t.lg];
  if(fx)for(let k=0;k<fx.length&&d===Infinity;k++){const i=fx[k].findIndex(f=>f[0]===tid||f[1]===tid);if(i>=0)d=S.plan.zeit[t.lg][k][i][0];}
  const c=S.cup,P=S.plan.pokal&&S.plan.pokal[0];if(c&&P&&((c.hist[0]||[]).some(m=>m[0]===tid||m[1]===tid)||(!c.hist.length&&c.alive.includes(tid))))d=Math.min(d,P[0]);
  const sc=S.supercup;if(sc&&(sc.h===tid||sc.a===tid))d=Math.min(d,sc.tag);
  return d===Infinity?null:d;}
// Saisoneröffnung: letzter Samstag vor dem ersten Pflichtspiel. Je Saison einmal berechnet (Zwischenspeicher, nicht im Spielstand).
let VB_TAGE={k:'',m:null};
function eroeffnungTag(tid){const k=S.seed+'/'+S.season;if(VB_TAGE.k!==k)VB_TAGE={k,m:new Map()};const m=VB_TAGE.m;
  if(!m.has(tid)){const d=ersterPflichttag(tid);let x=d==null?null:d-1;if(x!=null)while(wochentag(x)!==6)x--;m.set(tid,x);}return m.get(tid);}
// Täglich (ablauf.js taeglichLauf): Saisoneröffnung aller Vereine an ihrem Tag
function vorbereitungTag(d){if(S.phase!=='play')return;S.teams.forEach(t=>{if(!aktiv(t)||t.eroe===S.season||eroeffnungTag(t.id)!==d)return;t.eroe=S.season;mitStrom(strom('eroeffnung',S.season,t.id),()=>eroeffnung(t,d));});}
function eroeffnung(t,d){const E=RVB.eroeffnung,regen=R()<E.regen.chance,betrag=Math.round(t.rep*E.jeAnsehen*(regen?E.regen.faktor:1)/1000)*1000;
  if(t.id!==S.my){t.cash+=betrag;return;}
  money('Saisoneröffnung',betrag);mannschaftsfoto(t,d);
  news(`Saisoneröffnung: ${t.name} stellt die Mannschaft vor${regen?', im Regen, aber die Fans bleiben bis zum Schluss':''}. Einnahmen ${fmt(betrag)}. Das Mannschaftsfoto ist gemacht.`,'good');}
const POS_FOLGE={TW:0,AB:1,MF:2,ST:3};
function mannschaftsfoto(t,d){const st=statS(),l=st.foto||(st.foto=[]),sq=squad(t.id).sort((a,b)=>POS_FOLGE[a.pos]-POS_FOLGE[b.pos]||b.str-a.str);
  l.push({s:S.season,tid:t.id,tag:d,ids:sq.map(p=>p.id),n:sq.map(p=>p.n)});if(l.length>RVB.fotos)l.splice(0,l.length-RVB.fotos);}
// Neuzugang nach dem Foto (taktik.js neuzugang): kleine Meldung, einmal je Spieler (K12b §8)
function fotoNachzuegler(p){const l=S.stat&&S.stat.foto,f=l&&l[l.length-1];if(!f||f.s!==S.season||f.tid!==S.my||S.tag<f.tag||S.tag-f.tag>RVB.fotoNachTage||f.ids.includes(p.id)||(f.nach||[]).includes(p.id))return;
  (f.nach=f.nach||[]).push(p.id);news(`${p.n} fehlt auf dem Mannschaftsfoto. Für die Autogrammkarten wird er nachträglich hineinretuschiert.`);}

// ---------- Liste „Vor dem Saisonstart“ (K12b §5.1) ----------
function vorbereitungAktiv(){if(S.phase!=='play'||!S.plan)return false;const d=ersterPflichttag(S.my);return d!=null&&S.tag<=d&&(S.gespielt==null||S.gespielt<d);}
// Punkte: zust 'ja' (erledigt), 'auto' (erledigt der Stab, der Verein oder der Standard), 'offen'
function vorbereitungPunkte(){const t=myT(),P=[],Z=(k,name,zust,text,tab,b)=>P.push({k,name,zust,text,tab,b}),a=b=>autoB(b);
  const auft=auftaktTag(t);Z('sommer','Urlaub und Trainingsauftakt',a('sommer')?'auto':S.sommer?'ja':S.tag>=auft?'auto':'offen',`${urlaubWochen(t)} Wochen Urlaub, Trainingsauftakt am ${datumMittel(auft)}.`,'training','sommer');
  Z('sponsor','Trikotsponsor',!S.sponsOffers?'ja':a('sponsor')?'auto':'offen',S.spons?`${S.spons.name}.`:`${(S.sponsOffers||[]).length} Angebote liegen vor. Ohne Wahl nimmt der Vorstand vor dem ersten Pflichtspiel das erste.`,'buero','sponsor');
  const ts=(S.testspiele||[]).filter(x=>x.stand!=='abgesagt'),lager=(S.lager||[]).some(l=>l.saison===S.season); // Stand: angefragt, zugesagt, abgesagt, gespielt (js/testspiele.js)
  Z('testspiele','Testspiele und Trainingslager',ts.length?'ja':a('testspiele')?'auto':'offen',ts.length?`${ts.length} Testspiel${ts.length===1?'':'e'} geplant oder gespielt${lager?', Trainingslager gebucht':''}.`:'Noch kein Testspiel geplant.','training','testspiele');
  const soll=RS.kaderSoll,sq=squad(S.my),fehlt=Object.keys(soll).map(pos=>[pos,soll[pos]-sq.filter(p=>p.pos===pos).length]).filter(x=>x[1]>0);
  Z('kader','Kaderplanung',!fehlt.length?'ja':a('transfers')?'auto':'offen',fehlt.length?`Es fehlen ${fehlt.map(([pos,n])=>`${n} ${pos}`).join(', ')} (Sollstärke ${Object.entries(soll).map(([pos,n])=>`${n} ${pos}`).join(', ')}).`:`${sq.length} Spieler, alle Positionen besetzt.`,'transfer','transfers');
  const kap=PIX.get(t.kap);Z('kapitaen','Kapitän',kap&&kap.team===S.my?(t.kapAuto?'auto':'ja'):a('kapitaen')?'auto':'offen',kap&&kap.team===S.my?`${kap.n}${t.kapAuto?' (vom Co-Trainer bestimmt)':''}.`:'Noch kein Kapitän.','kabine','kapitaen');
  Z('ziel','Saisonziel','ja',`${targetText(t.lg,S.target)}. Das Zielgespräch mit dem Vorstand kommt später.`,'buero',null);
  const et=eroeffnungTag(S.my),f=S.stat&&S.stat.foto&&S.stat.foto.find(x=>x.s===S.season&&x.tid===S.my);
  Z('eroeffnung','Saisoneröffnung und Mannschaftsfoto',f?'ja':'auto',f?'Erledigt, das Foto steht in der Statistik.':et!=null?`Am ${datumMittel(et)}, läuft von selbst.`:'Termin steht noch nicht fest.','buero',null);
  return P;}
const VB_ZUST={ja:'erledigt',auto:'',offen:'offen'};
function vorbereitungKarte(){if(!vorbereitungAktiv())return'';const P=vorbereitungPunkte(),offen=P.filter(x=>x.zust==='offen').length,d=ersterPflichttag(S.my);
  const wer=x=>{if(!x.b)return'läuft von selbst';const B=RLZ.bereiche[x.b];return B&&B.auto?`erledigt ${B.wer}`:'Standard';};
  return`<div class="card"><h3>Vor dem Saisonstart</h3><p class="dim">Bis zum ersten Pflichtspiel am ${datumMittel(d)}. ${offen?`${offen} Punkt${offen===1?'':'e'} offen, nichts davon ist Pflicht.`:'Alles erledigt.'}</p>
    <table><tbody>${P.map(x=>`<tr><td><b>${esc(x.name)}</b><br><span class="dim">${esc(x.text)}</span></td><td>${x.zust==='auto'?`<span class="dim">${esc(wer(x))}</span>`:x.zust==='ja'?'✓ erledigt':'<b>offen</b>'}</td><td>${x.zust==='offen'?`<button onclick="tab('${x.tab}')">Hingehen</button>`:''}</td></tr>`).join('')}</tbody></table></div>`;}
// Erinnerung vor „Tag beenden“ (kalender.js erinnerungen): höchstens einmal je erinnerungTage, nur bei offenen Punkten
function vorbereitungErinnerung(){if(!vorbereitungAktiv())return null;const P=vorbereitungPunkte().filter(x=>x.zust==='offen');if(!P.length)return null;
  const heute=absTag(S.tag),vb=S.vb||(S.vb={});if(vb.er!=null&&heute-vb.er<RVB.erinnerungTage)return null;vb.er=heute;
  return{art:'vorbereitung',text:`Vor dem Saisonstart ist noch offen: ${P.map(x=>esc(x.name)).join(', ')}.`,tab:'buero',knopf:'Zur Liste im Büro'};}
