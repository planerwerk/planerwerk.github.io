// Pressekonferenzen (K29 §5.4, U17a): Anlässe, Fragen, Antworten mit Ton, Wirkung mit Streuung, Deckel und Abnutzung, Gedächtnis, Zeitungsecho, Sprüche-Chronik.
// Im Spielstand: S.presse = {klima: Medienklima 0–100, n: {Saison: Zahl}, letzte: absoluter Tag, sperre: {Anlass: absoluter Tag}, arten: [die letzten zwei Antwortarten],
//   aus: {Saison: Ausraster}, aussagen: [{s, tag, art, pid, gegner, txt, ok}], antritt: 1 = Antrittspressekonferenz fällig, fue: Saison der letzten zur Tabellenführung}.
// S.pk = offene Pressekonferenz {id, art, tag, s, gegner, pid, serie, i, fragen: [{t, o, sp, j}], antw: [{art, txt}]}. Chronik in S.stat.chronik (K34).
// Zufall: Anlass und Fragen im Strom 'presse', deine Antworten im Grundstrom (deine Handlung).
function presseS(){return S.presse||(S.presse={klima:RPK.klimaStart,n:{},letzte:-99,sperre:{},arten:[],aus:{},aussagen:[]});}
const pkText=(s,c)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>c[k]!=null?c[k]:m);
const pkOffen=s=>/\{\w+\}/.test(s);
function pkKontext(pk){const t=myT(),p=pk.pid!=null?PIX.get(pk.pid):null;return{verein:t.name,gegner:pk.gegner!=null?tn(pk.gegner):null,spieler:p?p.n:null,platz:rank(t.lg,S.my),serie:pk.serie!=null?pk.serie:null,trainer:S.mgr||'Der Trainer',liga:ligaName(t.lg),medium:pk.medium&&PRESSE.medien[pk.medium]?PRESSE.medien[pk.medium].name:null,
  gtrainer:pk.gegner!=null?trainerName(pk.gegner):null,zitat:pk.zitat?pkText(pk.zitat,{verein:t.name}):null};} /* gtrainer, zitat: Stichelei (K29e) */
// Text ohne offene Platzhalter, fest gewählt (k), sonst der erste passende
function pkWahl(l,c,k){const ok=l.map(x=>pkText(x,c)).filter(x=>!pkOffen(x));return ok.length?ok[k%ok.length]:pkText(l[0],c).replace(/\{\w+\}/g,'');}
const jMedium=n=>(PRESSE.journalisten.find(j=>j.n===n)||{m:'fach'}).m;
// Journalist nach Medienklima (K29d): unter 50 kommen Boulevard und Portal öfter, darüber die übrigen. Ein Wurf x wie vorher, bei Klima 50 dieselbe Wahl wie vor K29d.
function pkJournalist(x){const js=PRESSE.journalisten,K=RPK.klimaFragen,d=(50-presseS().klima)/50*K.gewicht,g=js.map(j=>Math.max(0,1+(K.scharf.includes(j.m)?d:-d))),s=g.reduce((a,b)=>a+b,0);
  let r=x*s;for(let i=0;i<js.length;i++){r-=g[i];if(r<0)return js[i].n;}return js[js.length-1].n;}
// Medienprofil eines Computer-Trainers (K29 §7, K29e): fest aus seiner Nummer, ohne Zufall, Anteile aus den Regeln
function medienProfil(x){if(!x)return null;const A=RPK.medienprofil.anteile,k=Object.keys(A),s=k.reduce((a,b)=>a+A[b],0);let r=(Math.imul(x.id+1,2654435761)>>>0)%s;
  for(const p of k){r-=A[p];if(r<0)return p;}return k[k.length-1];}
// Stichelei des gegnerischen Trainers vor Topspielen (K29 §7, K29e), im Strom presse: Lautsprecher und Psychospieler mit ihrer Chance, als erste Frage. Andere Profile würfeln nicht.
function pkStichelei(pk){const M=RPK.medienprofil;if(!M.anlaesse.includes(pk.art)||pk.gegner==null||pk.gegner>=1000)return;const x=trainerVon(pk.gegner);if(!x)return;const pr=medienProfil(x),c=pr&&M.chance[pr]||0;
  if(!c||R()>=c)return;const l=PRESSE.sticheleien[pr],F=PRESSE.stichelFrage;pk.profil=pr;pk.zitat=l[Math.floor(R()*l.length)];
  pk.fragen.unshift({t:F[Math.floor(R()*F.length)],o:['humor','provokation','floskel'],sp:0,j:pkJournalist(R()),st:1});
  news(`${x.n} (${tn(pk.gegner)}) stichelt vor dem Spiel: „${pkText(pk.zitat,{verein:myT().name})}“`);}
// Sticheleien unter Computer-Trainern (K29 §7, K29m), wöchentlich im Strom presse/ki: Derbys und Spitzenspiele deiner Liga ohne deinen Verein in den nächsten
// RPK.medienprofil.ki.tage Tagen. Erst der Heimtrainer, dann der Gast, Lautsprecher und Psychospieler mit ihrer Chance; höchstens ki.max Meldungen; Beziehung der Vereine + ki.bez (K17)
function kiSticheleienWoche(d){if(S.phase!=='play')return;const M=RPK.medienprofil,K=M.ki,A=RPK.anlass,lg=myT().lg,Z=S.plan.zeit[lg];if(!S.fx[lg]||!Z)return;
  const T=table(lg),pl=id=>T.findIndex(r=>r.id===id)+1;let n=0;
  S.fx[lg].forEach((md,k)=>md.forEach(([h,a],i)=>{if(n>=K.max||h===S.my||a===S.my)return;const tag=Z[k]&&Z[k][i]?Z[k][i][0]:null;if(tag==null||tag<=d||tag-d>K.tage)return;
    const derby=istDerby(h,a),spitze=k+1>=A.spitzeAb&&pl(h)<=A.spitzeBis&&pl(a)<=A.spitzeBis;if(!derby&&!spitze)return;
    for(const [von,ziel] of [[h,a],[a,h]]){const x=trainerVon(von),pr=medienProfil(x),c=pr&&M.chance[pr]||0;if(!c||R()>=c)continue;const l=PRESSE.sticheleien[pr];
      news(`${x.n} (${tn(von)}) stichelt vor ${derby?'dem Derby':'dem Spitzenspiel'} gegen ${tn(ziel)}: „${pkText(l[Math.floor(R()*l.length)],{verein:tn(ziel)})}“`);bezAendern(von,ziel,K.bez,'Stichelei vor dem Spiel');n++;break;}}));}
// Stichelei ohne Antwort (Co-Trainer geschickt oder nicht hingegangen, aber ohne Automatik): die eigene Mannschaft grübelt. Nicht, wenn die erste Frage
// (die Stichelei) schon beantwortet ist, nach einer Entlassung oder in einer neuen Saison (Prüfung DO1)
function stichelOffen(pk){if(!pk.profil||pk.i>0||S.fired||pk.s!==S.season||autoB('presse'))return;const v=RPK.medienprofil.offen[pk.profil]||0;if(!v)return;squad(S.my).forEach(p=>stimmungAendern(p,v));
  news(`Die Stichelei von ${trainerName(pk.gegner)} blieb unbeantwortet. In der Kabine wird darüber geredet.`,'bad');}

// ---------- Anlass (K29 §4.1) ----------
function presseAnlass(art,o={}){if(S.phase!=='play'||S.pk||S.fired)return false;const P=presseS(),Q=RPK,heute=absTag(S.tag),A=PRESSE.anlaesse[art];if(!A)return false;
  if((P.n[S.season]||0)>=Q.budget||heute-P.letzte<Q.abstand||(P.sperre[art]!=null&&heute-P.sperre[art]<Q.sperre))return false;
  return mitStrom(strom('presse',S.season,S.tag,art),()=>{let l=A.fragen.filter(f=>(o.pid!=null||!f.sp)&&(o.gegner!=null||!f.t.includes('{gegner}'))&&(o.serie!=null||!f.t.includes('{serie}'))&&(o.medium!=null||!f.t.includes('{medium}'))&&(!f.trainer||o.trainer));if(!l.length)return false;
    const n=Math.min(l.length,Q.fragen[0]+Math.floor(R()*(Q.fragen[1]-Q.fragen[0]+1))+(P.klima<Q.klimaFragen.bohrenUnter?Q.klimaFragen.bohrenPlus:0)),fr=[]; /* schlechtes Klima: eine Frage mehr (K29d) */
    while(fr.length<n&&l.length)fr.push(l.splice(Math.floor(R()*l.length),1)[0]);
    const tg=S.tag+(o.morgen&&S.tag+1<S.plan.ende?1:0); /* morgen: nach dem Spiel am Tag danach, mit Halt (Prüfung DR1), nicht über das Saisonende (DS2) */
    P.id=(P.id||0)+1;S.pk={id:P.id,art,tag:tg,s:S.season,medium:o.medium||null,gegner:o.gegner!=null?o.gegner:null,pid:o.pid!=null?o.pid:null,serie:o.serie!=null?o.serie:null,i:0,
      fragen:fr.map(f=>({t:f.t,o:f.o,sp:f.sp?1:0,j:pkJournalist(R())})),antw:[]};pkStichelei(S.pk);
    P.n[S.season]=(P.n[S.season]||0)+1;P.letzte=absTag(tg);P.sperre[art]=absTag(tg); /* Abstand ab dem Tag der Pressekonferenz (DS4) */
    if(autoB('presse'))presseDelegieren(true);else news(`Pressekonferenz ${tg>S.tag?'morgen':'heute'}: ${A.name}. Im Büro hingehen oder den Co-Trainer schicken.`);return true;});}
// Co-Trainer schicken (oder automatisch): Floskeln, Medienklima −2
function presseDelegieren(auto){const pk=S.pk;if(!pk)return;const P=presseS(),A=PRESSE.anlaesse[pk.art];S.pk=null;P.klima=clamp(P.klima+RPK.delegieren,0,100);
  news(`${A.name}: ${auto?'Der Co-Trainer geht hin':'Du schickst den Co-Trainer'}. ${pkSchlagzeile('delegiert',pk)}`);stichelOffen(pk);if(!auto){save();closeOv();render();}}
function pkSchlagzeile(art,pk){const Z=pkUrteil(pk,art)?PRESSE.urteil.schlagzeile:PRESSE.schlagzeilen[art]; /* Kritik am Urteil (K29h) */if(!Z)return'';return`${PRESSE.medien[Z.m].name}: „${pkWahl(Z.t,pkKontext(pk),pk.id)}“`;}

// ---------- Auslöser ----------
// Täglich (ablauf.js taeglichLauf): Automatik für gestern, Antritt, Auftakt, Tag vor Derby, Spitzenspiel, Pokal ab Viertelfinale, Relegation, Ultimatum, Wechselwunsch
function presseTag(d){if(S.phase!=='play')return;if(S.pk&&S.pk.s!==S.season)S.pk=null;else if(S.pk&&S.pk.tag<d)presseDelegieren(true);const P=presseS(),A=RPK.anlass; /* aus der alten Saison still weg (DS2) */
  if(P.antritt&&presseAnlass('antritt'))P.antritt=0;
  const l=meineLigaspiele();if(l.length&&d===l[0].tag-A.auftaktVorher)presseAnlass('auftakt',{gegner:pkGegner(l[0])});
  const e=meinSpiel(d+1);if(e){const g=pkGegner(e),t=myT();
    if(e.art==='liga'&&g!=null&&istDerby(S.my,g))presseAnlass('derby',{gegner:g});
    else if(e.art==='liga'&&g!=null&&e.md+1>=A.spitzeAb&&rank(t.lg,S.my)<=A.spitzeBis&&rank(t.lg,g)<=A.spitzeBis)presseAnlass('spitze',{gegner:g});
    else if(e.art==='pokal'&&e.r>=A.pokalAb)presseAnlass('pokal',{gegner:g});
    else if(e.art==='rel'||e.art==='rel2')presseAnlass('relegation',{gegner:g});}
  if(S.ult&&S.ult.tid===S.my&&!S.ult.pk&&presseAnlass('ultimatum'))S.ult.pk=1;
  const w=squad(S.my).find(p=>p.ww>=3&&p.ww3s===S.season&&p.pkWW!==S.season);if(w&&presseAnlass('wechselwunsch',{pid:w.id}))w.pkWW=S.season;
  // Urteil des Sportgerichts (K29g): gemerkt in P.urteil, hier nach den Anlässen der Spiele, damit es keine Pressekonferenz vor einem Spiel verdrängt (Prüfung DR2); verfällt nach urteilTage
  // Nur, solange er dein Spieler ist und die Sperre läuft (DS1); verfällt nach urteilTage Tagen (Tag 0 bis urteilTage − 1)
  if(P.urteil){const u=P.urteil,p=PIX.get(u.pid);if(u.s!==S.season||absTag(d)-u.tag>=A.urteilTage||!p||p.team!==S.my||sperreIn(p,u.wb||'liga')<=0)P.urteil=null;else if(presseAnlass('urteil',{pid:u.pid}))P.urteil=null;}}
function pkGegner(e){const f=paarung(e);return f?(f[0]===S.my?f[1]:f[0]):null;}
// Nach den Spielen des Tages (ablauf.js): Kampfansagen prüfen, Krise, Höhenflug, Tabellenführung, Kantersieg
function presseNachSpiel(m){if(!m||S.phase!=='play')return;const s=m.h===S.my?0:1,gf=s?m.ag:m.hg,ga=s?m.hg:m.ag,gegner=s?m.h:m.a,A=RPK.anlass,P=presseS(),sq=squad(S.my);
  kampfansagePruefen(gegner,gf,ga);
  const noten=sq.filter(p=>p.lastG!=null),schlecht=noten.sort((a,b)=>b.lastG-a.lastG)[0],gut=noten.slice().sort((a,b)=>a.lastG-b.lastG)[0];
  // Alle Anlässe nach dem Spiel finden am Tag danach statt (morgen): Nach dem Spiel geht es sofort weiter, am selben Tag hätte der Co-Trainer sie immer übernommen (Prüfung DR1, seit U17a)
  if(gf-ga>=A.kantersieg){presseAnlass('kantersieg',{gegner,pid:gut?gut.id:null,morgen:1});return;}
  if(!m.lg)return;const T=table(myT().lg),r=T.find(x=>x.id===S.my);if(!r)return;const l=r.last;
  const serie=(v)=>{let n=0;for(let i=l.length-1;i>=0&&l[i]===v;i--)n++;return n;},nl=serie(0),ns=serie(3);
  if(nl>=A.krise)presseAnlass('krise',{serie:nl,pid:schlecht?schlecht.id:null,morgen:1});
  else if(ns>=A.hoehenflug)presseAnlass('hoehenflug',{serie:ns,morgen:1});
  else if(T[0].id===S.my&&r.sp>=A.fuehrungAb&&P.fue!==S.season&&presseAnlass('fuehrung',{morgen:1}))P.fue=S.season;}

// ---------- Ablauf im Büro (K29 §4.2) ----------
// Kritik am Urteil (K29h): Schiedsrichterkritik in der Pressekonferenz nach dem Urteil, mit eigenen Texten, Namen und Schlagzeile
const pkUrteil=(pk,art)=>!!pk&&pk.art==='urteil'&&art==='kritikSchiri';
const pkArtName=(pk,art)=>pkUrteil(pk,art)?PRESSE.urteil.name:PRESSE.arten[art].name;
function pkOptionen(pk){const f=pk.fragen[pk.i],c=pkKontext(pk),P=presseS(),l=f.o.slice();
  if((pk.art==='krise'||pk.art==='ultimatum')&&(P.aus[S.season]||0)<RPK.ausraster.proSaison)l.push('ausraster');
  return l.map((art,k)=>({art,text:pkWahl((pkUrteil(pk,art)?PRESSE.urteil.antworten:PRESSE.antworten[art]).filter(x=>f.sp||!x.includes('{spieler}')),c,pk.id+pk.i+k)}));}
function pkZeigen(){const pk=S.pk;if(!pk)return;if(!darf('presse'))return;const f=pk.fragen[pk.i],c=pkKontext(pk),A=PRESSE.anlaesse[pk.art],M=PRESSE.medien[jMedium(f.j)];
  ov(`<div class="phead"><h2>${esc(A.name)}</h2><button class="x" onclick="closeOv()" aria-label="Schließen">✕</button></div><p class="dim">Frage ${pk.i+1} von ${pk.fragen.length} · ${esc(f.j)} (${esc(M.name)}, ${esc(M.art)}, Beziehung ${(b=>`${b>0?'+':''}${b}`)(Math.round(medienBez(jMedium(f.j))))})</p>
    <p><b>„${esc(pkText(f.t,c))}“</b></p><div class="opts">${pkOptionen(pk).map(o=>`<div class="card"><p><b>${PRESSE.arten[o.art].ton} ${esc(pkArtName(pk,o.art))}</b></p><p>„${esc(o.text)}“</p><button onclick="pkAntwort('${o.art}')">So antworten</button></div>`).join('')}</div>
    <p class="dim">Du siehst nur den Ton, nicht die Wirkung. Was es gebracht hat, steht danach in der Zeitung.</p>`);}
function pkAntwort(art){const pk=S.pk;if(!pk)return;const o=pkOptionen(pk).find(x=>x.art===art);if(!o)return;pk.antw.push({art,txt:o.text});pk.i++;
  if(pk.i<pk.fragen.length){save();pkZeigen();return;}pkAbschluss();save();closeOv();render();}
// Wirkung (K29 §5.1 bis §5.3): Streuung im Grundstrom, Abnutzung, Deckel je Pressekonferenz
const PK_ECHO=['ausraster','kritikSpieler','kritikSchiri','provokation','kritikTeam','angriffMedien','ankuendigung','humor','rueckendeckung','floskel'];
function pkAbschluss(){const pk=S.pk;if(!pk)return;S.pk=null;const P=presseS(),Q=RPK,W=Q.wirkung,D=Q.deckel,t=myT(),krise=pk.art==='krise'||pk.art==='ultimatum',sum={team:0,spieler:0,fans:0,vorstand:0,medien:0};
  let kritik=0,bez=0,schiri=null,chronik=null,trotz=0;const st=()=>Q.streuung[0]+R()*(Q.streuung[1]-Q.streuung[0]),X=Q.ausraster;
  const mws=pk.fragen.map(f=>medienWirkung(jMedium(f.j))); /* K29d: Faktor je Frage vor den Antworten, so hängt er nicht an der Reihenfolge (Prüfung DM2) */
  pk.antw.forEach((a,i)=>{const l=P.arten,ab=l[l.length-1]===a.art?(l[l.length-2]===a.art?Q.abnutzung[1]:Q.abnutzung[0]):1;P.arten=[...l,a.art].slice(-2);
    const fm=pk.fragen[i]?jMedium(pk.fragen[i].j):null,mw=mws[i]!=null?mws[i]:1,oe=v=>v*(v<0?mw:2-mw); /* K29d: Fans und Vorstand lesen es im Medium des Fragers, gewogen milder, verärgert schärfer */
    if(a.art==='ausraster'){P.aus[S.season]=(P.aus[S.season]||0)+1;const x=R();
      if(x<X.weckruf){sum.team+=X.weckrufTeam;news('Nach dem Ausraster: Die Mannschaft wirkt wachgerüttelt.','good');}
      else if(x<X.weckruf+X.bruch){sum.team+=X.bruchTeam;sum.vorstand+=oe(X.bruchVorstand);news('Nach dem Ausraster: In der Kabine rumort es, der Vorstand ist entsetzt.','bad');}
      else{sum.fans+=oe(X.kultFans);chronik=a;news('Nach dem Ausraster: Die Fans feiern dich, der Satz ist schon Kult.','good');}return;} /* auch der Ausraster über das Medium (DM1) */
    if(pk.fragen[i]&&pk.fragen[i].st){const M=RPK.medienprofil;if(a.art==='humor')sum.team+=M.gelassen;else if(a.art==='provokation'){sum.team+=M.konterEigen;trotz+=M.konterGegner;}
      else if(a.art==='floskel')sum.team+=M.ignorieren[pk.profil]||0;} /* Antwort auf die Stichelei (K29e): gelassen, kontern, ignorieren */
    const w=W[a.art]||{},f=st()*ab;['team','spieler','fans','vorstand','medien'].forEach(k=>{if(w[k])sum[k]+=k==='fans'||k==='vorstand'?oe(w[k]*f):w[k]*f;});
    if(fm&&w.medien)medienBezAendern(fm,w.medien*f*REGELN.exklusiv.ausAntwort); /* K29d: Beziehung zum fragenden Medium */
    if(a.art==='humor'&&krise)sum.vorstand+=oe(W.humor.krise*f);if(a.art==='kritikTeam')kritik+=f;if(a.art==='kritikSchiri')schiri=a;
    if(a.art==='provokation'&&pk.gegner!=null&&pk.gegner<1000)bez+=W.provokation.beziehung*f;
    if(a.art==='rueckendeckung'||a.art==='ankuendigung')P.aussagen=[...P.aussagen,{s:S.season,tag:absTag(S.tag),art:a.art,pid:pk.pid,gegner:pk.gegner,txt:a.txt}].slice(-Q.gedaechtnis.aussagen);
    if(a.art==='humor'&&!chronik&&R()<Q.chronikHumor)chronik=a;});
  const c=(x,k)=>clamp(x,-D[k],D[k]),K=W.kritikTeam;
  squad(S.my).forEach(p=>{const ind=kritik?kritik*(hatEig(p,'kaempfer')?K.kaempfer:(hatEig(p,'diva')||hatEig(p,'nervenschwach'))?K.empfindlich:K.sonst):0,v=c(sum.team+ind,'team');if(Math.abs(v)>=0.05)stimmungAendern(p,v);});
  const sp=pk.pid!=null?PIX.get(pk.pid):null;if(sp&&sp.team===S.my&&sum.spieler)stimmungAendern(sp,c(sum.spieler,'spieler'));
  if(trotz&&pk.gegner!=null&&pk.gegner<1000)squad(pk.gegner).forEach(p=>stimmungAendern(p,c(trotz,'team'))); /* Trotz beim Gegner nach deinem Konter (K29e) */
  if(sum.fans)fanAnlass(t,'fanU',c(sum.fans,'fans'));if(sum.vorstand)S.trust=clamp(S.trust+c(sum.vorstand,'vorstand'),0,100);P.klima=fanZahl(clamp(P.klima+c(sum.medien,'medien'),0,100));
  if(bez)bezDuAendern(pk.gegner,Math.round(bez),'Provokation in der Pressekonferenz');
  if(schiri&&R()<Q.schiri.verfahren){const L=Q.schiri.strafe[t.lg]||Q.schiri.strafe[3],b=Math.round((L[0]+R()*(L[1]-L[0]))/1000)*1000;money('Strafen',-b);news(`Das Sportgericht bestraft deine Kritik ${pk.art==='urteil'?'an seinem Urteil':'am Schiedsrichter'} mit ${fmt(b)}.`,'bad');if(!chronik)chronik=schiri;}
  const echo=PK_ECHO.find(x=>pk.antw.some(a=>a.art===x));if(echo)news(`Zeitungsecho, ${pkSchlagzeile(echo,pk)}`);
  if(chronik)chronikEintrag(chronik.txt,echo?pkSchlagzeile(echo,pk):'');}
function chronikEintrag(txt,kopf){const st=statS(),l=st.chronik||(st.chronik=[]);l.push({s:S.season,tag:S.tag,tid:S.my,txt,kopf});if(l.length>RPK.chronikMax)l.splice(0,l.length-RPK.chronikMax);}

// ---------- Gedächtnis (K29 §5.2) ----------
// Montags: Rückendeckung und vier Wochen später verkauft kostet Glaubwürdigkeit
// ---------- Medienpolitik (K29 §6, K29b) ----------
// S.mp = Art (offen, zurueckhaltend, abgeschottet). In der Automatik (Bereich presse) und ohne Wahl gilt der Standard. Wirkt je Woche aufs Medienklima und auf die Gerüchte über dich.
const medienpolitik=()=>{const M=REGELN.medienpolitik,k=autoB('presse')||!S.mp||!M.arten[S.mp]?M.standard:S.mp;return Object.assign({k},M.arten[k]);};
function medienpolitikSetzen(k){if(!darf('presse')||!REGELN.medienpolitik.arten[k])return;S.mp=k;save();render();}
// Faktor des Medienklimas auf Gerüchte über dich (geruechte.js): unter 50 mehr, darüber weniger
const klimaFaktor=()=>1+REGELN.medienpolitik.klimaWirkung*(50-presseS().klima)/50;
function medienpolitikWoche(){const P=presseS(),m=medienpolitik(),k=P.klima,s=m.klima;if(!s)return;
  if(k<m.ziel&&m.richtung>=0)P.klima=fanZahl(Math.min(m.ziel,k+s));else if(k>m.ziel&&m.richtung<=0)P.klima=fanZahl(Math.max(m.ziel,k-s));}
// ---------- Exklusivinterview (K29 §6, K29c) ----------
// S.mb = {Medium: Beziehung}, S.exkl = absoluter Tag des letzten Interviews. Ohne Zufall.
const medienBez=m=>S.mb&&S.mb[m]!=null?S.mb[m]:0;
const exklusivFrei=()=>S.exkl==null||absTag(S.tag)-S.exkl>=REGELN.exklusiv.tage;
function exklusivInterview(m){const E=REGELN.exklusiv;if(!darf('presse')||!PRESSE.medien[m])return;if(!exklusivFrei()){toast('Das nächste Exklusivinterview geht erst später.');return;}
  Object.keys(PRESSE.medien).forEach(k=>medienBezAendern(k,k===m?E.plus:E.andere));S.exkl=absTag(S.tag); /* mit Rundung und Grenzen (DM3) */
  const P=presseS();P.klima=fanZahl(clamp(P.klima+E.klima,0,100));news(`Exklusivinterview in ${PRESSE.medien[m].name} (${PRESSE.medien[m].art}). Die anderen Redaktionen sind verstimmt.`,'');save();render();}
// Faktor auf die Wirkung eines Gerüchts über deinen Verein aus diesem Medium (geruechte.js)
const medienWirkung=m=>{const E=REGELN.exklusiv;return clamp(1-medienBez(m)/E.teiler,E.wirkung[0],E.wirkung[1]);};
// Beziehung zu einem Medium ändern (K29d, Antworten in der Pressekonferenz), in den Grenzen, auf eine Nachkommastelle
function medienBezAendern(m,x){if(!PRESSE.medien[m]||!x)return;const E=REGELN.exklusiv,B=S.mb||(S.mb={});B[m]=fanZahl(clamp(medienBez(m)+x,E.grenzen[0],E.grenzen[1]));}
// Montags (presseWoche): Beziehungen verblassen Richtung 0 (K29d)
function medienBezVerblassen(){const B=S.mb,v=REGELN.exklusiv.verblassen;if(!B)return;Object.keys(B).forEach(k=>{const b=B[k];B[k]=b>0?Math.max(0,fanZahl(b-v)):b<0?Math.min(0,fanZahl(b+v)):0;});}
function presseWoche(){medienpolitikWoche();medienBezVerblassen();const P=presseS(),G=RPK.gedaechtnis,heute=absTag(S.tag);
  P.aussagen.forEach(a=>{if(a.ok||a.art!=='rueckendeckung'||a.pid==null)return;if(heute-a.tag>G.rueckendeckungTage){a.ok=1;return;}const p=PIX.get(a.pid);
    if(p&&p.team!==S.my){a.ok=1;glaubAendern(G.rueckendeckungGlaub);news(`Die Presse erinnert an deine Rückendeckung für ${p.n}. Jetzt ist er weg. Deine Glaubwürdigkeit leidet.`,'bad');}});}
// Nach deinem Spiel: Kampfansage gegen diesen Gegner eingelöst (Kult) oder nicht (Häme)
function kampfansagePruefen(gegner,gf,ga){const P=presseS(),G=RPK.gedaechtnis,t=myT();
  P.aussagen.forEach(a=>{if(a.ok||a.art!=='ankuendigung'||a.gegner==null||a.gegner!==gegner)return;a.ok=1;
    if(gf>ga){fanAnlass(t,'fanU',G.kultFans);chronikEintrag(a.txt,`Wort gehalten gegen ${tn(gegner)}`);news(`Wort gehalten: Deine Kampfansage gegen ${tn(gegner)} ist jetzt Kult.`,'good');}
    else if(gf<ga){glaubAendern(G.haemeGlaub);fanAnlass(t,'fanU',G.haemeFans);news(`Häme in der Presse: Erst große Worte, dann verloren gegen ${tn(gegner)}.`,'bad');}});}

// ---------- Interview am Spielfeldrand (K29 §4.1, K29f) ----------
// S.ifr = {tag, s, g Gegner, gf, ga} nach deinem Spiel (ablauf.js nach presseNachSpiel), gilt nur an diesem Tag. Nicht in der Automatik, nicht neben einer offenen
// Pressekonferenz, abschaltbar (S.einst.ifrAus). Ohne Zufall, ohne Antwort ohne Folgen.
// Seit Prüfung DR1: gilt bis zum nächsten Halt, den du siehst. Nach dem Spiel geht es sofort weiter (weiter), am Spieltag selbst sähest du die Karte nie.
// spielfeldrandWeiter (kalender.js weiter, am Anfang) löscht ein Interview von einem früheren Tag. e: Art der Frage (sieg, niederlage, remis nur in der Liga, sonst offen; Elfmeterschießen zählt)
const ifrOffen=()=>!!(S.ifr&&S.ifr.s===S.season);
const IFR_ARTEN=['rueckendeckung','kritikTeam','floskel'];
function spielfeldrandWeiter(){if(S.ifr&&(S.ifr.s!==S.season||S.ifr.tag<S.tag))S.ifr=null;}
function spielfeldrandNachSpiel(m){if(!m)return;S.ifr=null;if(S.phase!=='play'||S.pk||S.fired||autoB('presse')||!darf('presse')||(S.einst&&S.einst.ifrAus))return;const s=m.h===S.my?0:1,gf=s?m.ag:m.hg,ga=s?m.hg:m.ag;
  const e=m.pen?(winner(m)===S.my?'sieg':'niederlage'):gf>ga?'sieg':gf<ga?'niederlage':m.lg?'remis':'offen';S.ifr={tag:S.tag,s:S.season,g:s?m.h:m.a,gf,ga,e};}
function ifrKontext(){const x=S.ifr,c=pkKontext({gegner:x.g,pid:null,serie:null,medium:null});c.ergebnis=`${x.gf}:${x.ga}`;return c;}
// Antwort: Wirkung der Antwortart (RPK.wirkung) × spielfeldrand.faktor; Kritik trifft alle wie „sonst“ (ohne Kämpfer und Empfindliche)
function spielfeldrandAntwort(art){if(!ifrOffen()||!IFR_ARTEN.includes(art)||!darf('presse'))return;const F=RPK.spielfeldrand.faktor,w=RPK.wirkung[art]||{},t=myT(),P=presseS();S.ifr=null;
  const team=(art==='kritikTeam'?w.sonst:(w.team||0))*F;if(team)squad(S.my).forEach(p=>stimmungAendern(p,team));
  if(w.fans)fanAnlass(t,'fanU',w.fans*F);if(w.vorstand)S.trust=clamp(S.trust+w.vorstand*F,0,100);if(w.medien)P.klima=fanZahl(clamp(P.klima+w.medien*F,0,100));
  news(`Interview am Spielfeldrand: ${PRESSE.arten[art].name}.`);save();render();}
function spielfeldrandAus(an){S.einst=S.einst||{aus:{}};S.einst.ifrAus=an?0:1;if(!an)S.ifr=null;save();render();}
function spielfeldrandKarte(){if(!ifrOffen())return'';const x=S.ifr,c=ifrKontext(),Z=PRESSE.spielfeldrand,l=Z[x.e||(x.gf>x.ga?'sieg':x.gf<x.ga?'niederlage':'remis')]||Z.offen,frage=pkText(l[x.tag%l.length],c);
  return`<div class="card"><h3>Interview am Spielfeldrand</h3><p><b>„${esc(frage)}“</b></p><div class="opts">${IFR_ARTEN.map((art,i)=>`<button class="opt" onclick="spielfeldrandAntwort('${art}')"${lzAus('presse')}><b>${PRESSE.arten[art].ton} ${esc(PRESSE.arten[art].name)}</b><span>„${esc(pkWahl(PRESSE.antworten[art].filter(z=>!z.includes('{spieler}')),c,x.tag+i))}“</span></button>`).join('')}</div>
    <p class="dim">Kurz und freiwillig, die Wirkung ist halb so groß wie in einer Pressekonferenz. Ohne Antwort passiert nichts. <button onclick="spielfeldrandAus(false)">Interviews ausschalten</button></p></div>`;}

// ---------- Interviews deiner Spieler und Maulkorb (K29 §6, K29i) ----------
// S.maulkorb = 1: keine Interviews, Mitteilsame verlieren je Woche Stimmung. Montags (presseWoche), nicht in der Automatik, eigener Strom je Saison und Tag.
const mitteilsam=p=>RPK.interview.mitteilsam.some(k=>hatEig(p,k));
function spielerInterviewWoche(){if(S.phase!=='play'||S.fired||autoB('presse'))return;const I=RPK.interview,t=myT(),sq=squad(S.my);if(!sq.length)return;
  if(S.maulkorb){sq.filter(mitteilsam).forEach(p=>stimmungAendern(p,I.maulkorb));
    // Trotz Maulkorb (K29 §6, K29j): ein unzufriedener Mitteilsamer redet mit I.trotz.chance doch, Wirkung eines schlechten Interviews, deine Glaubwürdigkeit sinkt. Eigener Strom.
    mitStrom(strom('interview',S.season,S.tag,'trotz'),()=>{const l=sq.filter(p=>mitteilsam(p)&&stimmung(p)<I.fettnapf.unzufriedenUnter);if(!l.length||R()>=I.trotz.chance)return;
      const p=l[Math.floor(R()*l.length)],W=I.schlecht,P=presseS();if(W.klima)P.klima=fanZahl(clamp(P.klima+W.klima,0,100));if(W.fans)fanAnlass(t,'fanU',W.fans);if(W.zusammenhalt)zusammenhaltAendern(t,W.zusammenhalt);
      glaubAendern(I.trotz.glaub);news(`Trotz Maulkorb: ${p.n} redet mit der Presse und lässt kein gutes Haar an der Lage im Verein. Deine Autorität leidet.`,'bad');});return;}
  mitStrom(strom('interview',S.season,S.tag),()=>{if(R()>=I.chance)return;const g=sq.map(p=>mitteilsam(p)?I.gewicht:1),s=g.reduce((a,b)=>a+b,0);let x=R()*s,p=sq[sq.length-1];
    for(let i=0;i<sq.length;i++){x-=g[i];if(x<0){p=sq[i];break;}}const F=I.fettnapf,c=Math.min(F.max,F.basis+(mitteilsam(p)?F.mitteilsam:0)+(stimmung(p)<F.unzufriedenUnter?F.unzufrieden:0));
    const schlecht=R()<c,W=schlecht?I.schlecht:I.gut,l=PRESSE.spielerInterview[schlecht?'schlecht':'gut'],txt=pkText(l[Math.floor(R()*l.length)],{spieler:p.n,verein:t.name}),P=presseS();
    if(W.klima)P.klima=fanZahl(clamp(P.klima+W.klima,0,100));if(W.fans)fanAnlass(t,'fanU',W.fans);if(W.zusammenhalt)zusammenhaltAendern(t,W.zusammenhalt);news(`Interview: ${txt}`,schlecht?'bad':'good');});}
function maulkorbSetzen(an){if(!darf('presse'))return;S.maulkorb=an?1:0;news(an?'Maulkorb: Deine Spieler geben keine Interviews mehr.':'Maulkorb aufgehoben: Deine Spieler dürfen wieder Interviews geben.');save();render();}

// ---------- Anzeige ----------
// Medienpolitik im Medien-Kasten (K29b): aktuelle Art, Knöpfe zum Wechseln (Bereich presse)
function medienpolitikText(){const M=REGELN.medienpolitik,m=medienpolitik(),aus=lzAus('presse');
  return`<p class="dim">Medienpolitik: <b>${esc(m.name)}</b> (${esc(m.text)}). Ein schlechtes Medienklima bringt mehr Gerüchte über deinen Verein, öfter erfundene.</p>
    <div class="row">${Object.keys(M.arten).map(k=>`<button class="${k===m.k?'go':''}" onclick="medienpolitikSetzen('${k}')"${aus}>${esc(M.arten[k].name)}</button>`).join('')}</div>
    <p class="dim">${autoB('presse')?'Der Co-Trainer gibt die Linie vor: Deine Spieler geben keine Interviews.':S.maulkorb?'Maulkorb: Deine Spieler geben keine Interviews, Diven, Partylöwen und Hitzköpfe sind darüber nicht glücklich.':'Deine Spieler geben ab und zu Interviews, mitteilsame öfter und mit mehr Fettnäpfchen.'} <button onclick="maulkorbSetzen(${S.maulkorb?0:1})"${aus}>${S.maulkorb?'Maulkorb aufheben':'Maulkorb verhängen'}</button></p>
    <p class="dim">Bei schlechtem Klima sitzen in der Pressekonferenz öfter Boulevard und Portal, unter ${RPK.klimaFragen.bohrenUnter} gibt es eine Frage mehr.${S.einst&&S.einst.ifrAus?' <button onclick="spielfeldrandAus(true)">Interviews am Spielfeldrand einschalten</button>':''}</p>${exklusivText()}`;}
// Exklusivinterview im Medien-Kasten (K29c): Beziehung je Medium, Knöpfe, solange frei
function exklusivText(){const E=REGELN.exklusiv,aus=lzAus('presse'),l=Object.keys(PRESSE.medien),f=x=>`${x>0?'+':''}${x}`;
  return`<p class="dim">Beziehungen: ${l.map(k=>`${esc(PRESSE.medien[k].name)} ${f(Math.round(medienBez(k)))}`).join(' · ')}. Gewogene Medien schreiben milder über dich, verärgerte schärfer, auch über deine Antworten in der Pressekonferenz. Mit der Zeit verblasst beides.</p>
    ${exklusivFrei()?`<div class="row">${l.map(k=>`<button onclick="exklusivInterview('${k}')"${aus}>Exklusivinterview: ${esc(PRESSE.medien[k].name)}</button>`).join('')}</div>`:`<p class="dim">Das nächste Exklusivinterview geht in ${E.tage-(absTag(S.tag)-S.exkl)} Tag${E.tage-(absTag(S.tag)-S.exkl)===1?'':'en'}.</p>`}`;}
function presseKarte(){const P=presseS(),pk=S.pk,ifr=spielfeldrandKarte(); /* Interview am Spielfeldrand vor dem Medien-Kasten (K29f) */
  if(!pk)return ifr+`<div class="card"><h3>Medien</h3><p>Medienklima ${Math.round(P.klima)} von 100${(P.n[S.season]||0)?` · ${P.n[S.season]} Pressekonferenz${P.n[S.season]===1?'':'en'} in dieser Saison`:''}.</p>${medienpolitikText()}</div>`;
  const A=PRESSE.anlaesse[pk.art];return`<div class="card"><h3>${esc(A.name)}</h3>${lzHinweis('presse')}<p>${pk.fragen.length} Fragen warten. Medienklima ${Math.round(P.klima)} von 100.</p>
    <div class="row"><button class="go" onclick="pkZeigen()"${lzAus('presse')}>Hingehen</button><button onclick="presseDelegieren(false)">Co-Trainer schicken</button></div><p class="dim">Gehst du heute nicht hin, schickt der Verein den Co-Trainer.</p></div>`;}
