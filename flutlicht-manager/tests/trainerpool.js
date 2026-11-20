// Trainerpool (K32 §3.3b, U18a): Aufbau (jeder Computer-Verein mit Trainer, dein Verein ohne, 12 freie), gleicher Seed gleiche Trainer, Trainerwechsel aus dem Pool,
// dein Jobwechsel, Ruf zum Saisonende, Saisonwechsel (alle Vereine besetzt, Pool aufgefüllt, keine echten Spieler als Trainer), Namen beim Trainer der Saison.
// Aufruf: node tests/trainerpool.js. Nur Node.js.
// ACHTUNG: Dieses Skript ist noch nie gelaufen. U18a entstand auf einem Rechner ohne Node.js. Fehler können im Spiel oder im Skript selbst liegen.
const {neueWelt,saisons}=require('./sim');
const probleme=[],pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const VEREIN=6,SEED=4711;
function welt(){const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S;S.my=VEREIN;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(VEREIN,W.ev('myT()').form);return{W,F,S,ev:W.ev};}

// 1. Aufbau
{const {F,S,ev}=welt(),l=F.trainerS(),von=ev('trainerVon'),stile=ev('STILE'),fehlt=S.teams.filter(t=>t.lg<=3&&t.id!==VEREIN&&!von(t.id)).map(t=>t.name);
  const schlecht=l.filter(x=>!x.n||x.ruf<0||x.ruf>100||!stile.includes(x.stil)).length,frei=ev('trainerFrei')().length;
  pruef(!fehlt.length&&!schlecht&&frei>=12&&S.teams[VEREIN].chef==null,'Aufbau: jeder Computer-Verein mit Trainer (Name, Ruf 0–100, Stil), dein Verein ohne, mindestens 12 freie',`fehlt ${fehlt.length}, fehlerhaft ${schlecht}, frei ${frei}`);}

// 2. Gleicher Seed, gleiche Trainer
{const a=welt(),b=welt();a.F.trainerS();b.F.trainerS();pruef(JSON.stringify(a.S.trainer)===JSON.stringify(b.S.trainer),'Gleicher Seed: dieselben Trainer');}

// 3. Trainerwechsel eines Computer-Vereins: Nachfolger aus dem Pool, der alte geht mit Ruf −5 in den Pool, der Verein spielt den Lieblingsstil des neuen
{const {F,S,ev}=welt(),von=ev('trainerVon'),t=S.teams.find(x=>x.lg===1&&x.id!==VEREIN),alt=von(t.id),ruf0=alt.ruf,frei0=ev('trainerFrei')().length;F.kiTrainerWechsel(t,0);const neu=von(t.id);
  pruef(neu&&neu.id!==alt.id&&alt.tid==null&&alt.ruf===Math.max(0,ruf0-5)&&t.stil===neu.stil&&ev('trainerFrei')().length===frei0&&neu.ruf<=t.rep+10,'Trainerwechsel: Nachfolger aus dem Pool (höchstens 10 über dem Ansehen), alter Trainer frei mit Ruf −5, Stil des neuen, Pool gleich groß',
    neu?`${alt.n} → ${neu.n} (Ruf ${neu.ruf}, Ansehen ${t.rep})`:'kein Nachfolger');}

// 4. Dein Jobwechsel: Der Trainer des neuen Vereins wird frei, dein alter Verein bekommt einen aus dem Pool
{const {F,S,ev}=welt(),von=ev('trainerVon'),neuId=S.teams.find(x=>x.lg===2&&x.id!==VEREIN).id,ihr=von(neuId);F.takeJob(neuId);const alt=S.teams[VEREIN];
  pruef(ihr&&ihr.tid==null&&S.teams[neuId].chef==null&&!!von(VEREIN),'Jobwechsel: der Trainer deines neuen Vereins ist frei, dein alter Verein hat einen neuen',ihr?`${ihr.n} frei, ${alt.name}: ${(von(VEREIN)||{}).n}`:'–');}

// 5. Zwei Saisons: Ruf des Meistertrainers steigt, nach dem Saisonwechsel alle Vereine besetzt, Pool aufgefüllt, keine echten Spieler als Trainer, Namen beim Trainer der Saison
{let start=null,meister=null,nachher=null,namen=null;
  saisons({n:2,seed:SEED,verein:VEREIN,beiSaisonstart:(S,F)=>{const von=F.__W.ev('trainerVon');F.trainerS();
      if(!start)start=new Map(S.trainer.map(x=>[x.id,x.ruf]));
      else nachher={fehlt:S.teams.filter(t=>t.lg<=3&&t.id!==S.my&&!von(t.id)).length,frei:F.__W.ev('trainerFrei')().length,echt:S.trainer.filter(x=>x.ex&&F.echterName(x.n)).length};},
    beiSaisonende:(S,F)=>{if(meister)return;const c=S.summary&&S.summary.champ,x=F.__W.ev('trainerVon')(c);if(x&&c!==S.my)meister={n:x.n,vor:start.get(x.id),nach:x.ruf};
      const a=S.stat&&S.stat.arch[S.stat.arch.length-1];namen=a?[1,2,3].map(lg=>a.ehr[lg]&&a.ehr[lg].tr?a.ehr[lg].tr[1]:null):null;}});
  pruef(!!meister&&(meister.vor==null||meister.nach>meister.vor||meister.vor>=100)&&!!nachher&&nachher.fehlt===0&&nachher.frei>=12&&nachher.echt===0&&!!namen&&namen.every(n=>typeof n==='string'&&n.length>0),
    'Saisons: Meistertrainer mit mehr Ruf, nach dem Saisonwechsel alle Vereine besetzt, mindestens 12 frei, keine echten Spieler als Trainer, Trainer der Saison mit Namen',
    `${meister?`${meister.n} ${meister.vor} → ${meister.nach}`:'kein Meister'}, ${nachher?JSON.stringify(nachher):'–'}, ${namen?namen.join(' / '):'–'}`);}

console.log(probleme.length?`\n${probleme.length} Problem(e).`:'\nAlles in Ordnung.');process.exitCode=probleme.length?1:0;
