// Saisonvorbereitung (K12b §5, §10, U14): Liste „Vor dem Saisonstart“ mit drei Zuständen, Kaderplanung, Erinnerung höchstens einmal je Woche,
// Saisoneröffnung am letzten Samstag vor dem ersten Pflichtspiel für alle Vereine (einmal, Einnahme, Regen), Mannschaftsfoto, Nachzügler, Automatik.
// Aufruf: node tests/vorbereitung.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U14 entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711;
function welt(lernstufen){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';if(lernstufen)F.lizenzStart(true);F.setTarget();F.sponsOffers();S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);
  return{W,F,S,ev:W.ev};}
const zust=(F,k)=>(F.vorbereitungPunkte().find(x=>x.k===k)||{}).zust;
// Spielt bis nach dem ersten Pflichtspieltag deines Vereins
function bisNachStart(w,mitSponsor){const {W,F}=w,erster=F.ersterPflichttag(W.S.my);let n=0;
  while(W.S.tag<=erster&&n<400){n++;const S=W.S;if(mitSponsor&&S.sponsOffers)F.sponsorWaehlen(0);if(W.ev('heuteMeinSpiel()'))F.tagesSpiele(S.tag);F.weiter();}return erster;}

// 1. Liste am Spielstart: aktiv, sieben Punkte, Sponsor offen bis zur Wahl
{const {F,S}=welt(false),P=F.vorbereitungPunkte(),a=zust(F,'sponsor');F.sponsorWaehlen(0);const b0=zust(F,'sponsor');F.werbungVorSpiel();const b=zust(F,'sponsor'); /* seit K24a gehören Ausrüster und Ärmel dazu */
  pruef(F.vorbereitungAktiv()&&P.length===7&&a==='offen'&&b0==='offen'&&b==='ja'&&F.vorbereitungKarte().includes('Vor dem Saisonstart'),'Liste: am Spielstart aktiv, sieben Punkte, Werbeverträge offen, nach der Wahl der Brust noch offen (Ausrüster, Ärmel), nach allen erledigt',`${P.map(x=>x.k+':'+x.zust).join(', ')}`);}

// 2. Kaderplanung: ein Torwart weniger macht den Punkt offen, mit Lernstufen (Transfers beim Verein) erledigt ihn der Verein
{const {F,ev}=welt(false),tw=ev('squad')(VEREIN).filter(p=>p.pos==='TW');tw.forEach(p=>p.team=-1);const offen=zust(F,'kader'),text=(F.vorbereitungPunkte().find(x=>x.k==='kader')||{}).text||'';
  const w2=welt(true);w2.ev('squad')(VEREIN).filter(p=>p.pos==='TW').forEach(p=>p.team=-1);const auto=zust(w2.F,'kader');
  pruef(offen==='offen'&&text.includes('TW')&&auto==='auto','Kaderplanung: ohne Torhüter offen mit „TW“ im Text, mit Lernstufen erledigt es der Verein',`${offen}, „${text}“, Lernstufen: ${auto}`);}

// 3. Termin der Saisoneröffnung: Samstag, vor dem ersten Pflichtspiel, für jeden Verein der drei Ligen
{const {F,S,ev}=welt(false),schlecht=[];S.teams.filter(t=>t.lg<=3).forEach(t=>{const x=F.eroeffnungTag(t.id),d=F.ersterPflichttag(t.id);if(x==null||d==null||ev('wochentag')(x)!==6||x>=d||d-x>7)schlecht.push(t.name);});
  pruef(!schlecht.length,'Termin: für jeden Verein der letzte Samstag vor seinem ersten Pflichtspiel',schlecht.slice(0,5).join(', ')||null);}

// 4. Ablauf bis nach dem ersten Pflichtspiel: jede Eröffnung genau einmal, deine mit Einnahme und Foto, Liste danach weg
{const w=welt(false),{W,F}=w,cash=new Map(W.S.teams.map(t=>[t.id,t.cash])),erster=bisNachStart(w,true),S=W.S,E=W.ev('RVB').eroeffnung,t=W.ev('myT()');
  const ohne=S.teams.filter(x=>x.lg<=3&&x.eroe!==S.season).map(x=>x.name),geld=S.fin['Saisoneröffnung']||0,voll=Math.round(t.rep*E.jeAnsehen/1000)*1000,regen=Math.round(t.rep*E.jeAnsehen*E.regen.faktor/1000)*1000;
  const foto=S.stat&&S.stat.foto&&S.stat.foto.find(f=>f.s===S.season&&f.tid===S.my);
  pruef(!ohne.length&&(geld===voll||geld===regen)&&!!foto&&foto.ids.length>=15&&!F.vorbereitungAktiv(),'Saisoneröffnung: jeder Verein genau einmal, deine bringt Ansehen × 2.000 € (bei Regen 60 %), das Foto ist gespeichert, nach dem ersten Pflichtspiel ist die Liste weg',
    `ohne Eröffnung: ${ohne.length}, Einnahme ${geld} (voll ${voll}, Regen ${regen}), Foto ${foto?foto.ids.length+' Spieler':'fehlt'}, erstes Pflichtspiel Tag ${erster}`);
  // 5. Nachzügler: ein Spieler, der nicht auf dem Foto ist, bekommt einmal die Meldung
  if(foto){const p=W.ev('squad')(S.my).find(x=>!foto.ids.includes(x.id))||S.pl.find(x=>x.team!==S.my&&x.team>=0);const vor=(foto.nach||[]).length;S.tag=foto.tag+1;F.fotoNachzuegler(p);F.fotoNachzuegler(p);
    pruef((foto.nach||[]).length===vor+1,'Mannschaftsfoto: Ein Nachzügler bekommt genau eine Meldung');}}

// 6. Erinnerung höchstens einmal je Woche, nur mit offenen Punkten
{const {F,S}=welt(false),a=F.vorbereitungErinnerung(),b=F.vorbereitungErinnerung();S.tag+=7;const c=F.vorbereitungErinnerung();
  pruef(!!a&&!b&&!!c&&a.art==='vorbereitung','Erinnerung: beim ersten Mal ja, am selben Tag nicht noch einmal, eine Woche später wieder',[!!a,!!b,!!c].join(', '));}

// 7. Automatik (K12b §10): mit Lernstufen und ohne Eingriff ist zum ersten Pflichtspiel nichts mehr offen
{const w=welt(true);bisNachStart(w,false);const offen=w.F.vorbereitungPunkte().filter(x=>x.zust==='offen').map(x=>x.k);
  pruef(!offen.length,'Automatik: mit Lernstufen und ohne Eingriff ist nach dem ersten Pflichtspiel kein Punkt offen',offen.join(', ')||null);}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
