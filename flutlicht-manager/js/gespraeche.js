// Gespräche, Versprechen, Glaubwürdigkeit und Mannschaftsansprache (Konzept K15, U8).
// Alle Zahlen stehen in daten/regeln.js unter REGELN.gespraeche (Kurzform RGS). Stimmung und Wechselwunsch: js/kabine.js (K14).
// Ein Gespräch ist ein Thema und eine Haltung (K15 §12 Nr. 1). Höchstens drei Einzelgespräche und eine Mannschaftsansprache pro Woche.

const THEMEN={rolle:'Rolle erklären',einsatz:'Einsatz versprechen',geduld:'Geduld erbitten',wechsel:'Wechsel in Aussicht stellen',konkurrent:'Keine Konkurrenz holen',lob:'Loben',kritik:'Kritisieren',schuetzen:'Druck nehmen'};
const THEMA_HILFE={rolle:'Er sieht sich höher, als du ihn einsetzt. Erklären hilft ein wenig, verspricht aber nichts.',
  einsatz:`Zusage: mindestens ${Math.round(RGS.versprechen.einsatz.anteil*100)} % der Minuten in den nächsten ${RGS.versprechen.einsatz.spiele} Pflichtspielen, in denen er fit ist.`,
  geduld:`Zusage: ein Startelf-Einsatz innerhalb von ${RGS.versprechen.geduld.tage/7} Wochen. Für Talente, Neuzugänge und nach Verletzungen.`,
  wechsel:`Zusage: Bei einem Angebot über seinem Marktwert lässt du ihn gehen. Er kommt auf die Transferliste. Gilt ${Math.round(RGS.versprechen.wechsel.tage/30)} Monate.`,
  konkurrent:`Zusage: ${Math.round(RGS.versprechen.konkurrent.tage/30)} Monate kein Neuzugang auf seiner Position, der höchstens ${RGS.versprechen.konkurrent.staerke} Punkte schwächer ist als er.`,
  lob:'Passt nach einer guten Note, nach einer schlechten wirkt es seltsam.',kritik:'Passt nach einer schwachen Note. Manche spornt es an, andere trifft es hart.'};
const HALTUNGEN={v:'verständnisvoll',s:'sachlich',b:'bestimmt'};
THEMA_HILFE.schuetzen='Für junge Spieler nach einem schweren Spiel oder bei zu viel Last: senkt das Risiko eines Knacks und baut Selbstvertrauen auf (K08).';
const M_ANSPRACHEN={rueckendeckung:'Rückendeckung',weckruf:'Weckruf',ziel:'Ziel neu setzen',endspiel:'Endspiel-Rede',rotation:'Rotation ankündigen'};
const M_ANSPRACHE_HILFE={rueckendeckung:'passt nach einer Niederlagenserie: Selbstvertrauen und Stimmung aller steigen',weckruf:'passt bei schwachen Ergebnissen trotz guter Lage: die nächsten zwei Spiele zählen für die Form stärker, Kämpfer mögen das, Diven nicht',
  ziel:'passt zum Saisonstart und in der Winterpause: Stimmung aller etwas besser',endspiel:'passt vor einem Pokalfinale, der Relegation oder dem letzten Spieltag: wirkt im Spiel, nur Nervenschwache verkrampfen',
  rotation:'passt vor einer englischen Woche: sieben Tage lang nimmt kein Stammspieler eine Pause auf der Bank übel, bis zu drei Spiele in Folge'};
const VERSPRECHEN_NAME={einsatz:'Einsatz',geduld:'Geduld',wechsel:'Wechsel',konkurrent:'keine Konkurrenz'};
const VERSPRECHEN_STAND={offen:'offen',gehalten:'gehalten',gebrochen:'gebrochen',hinfaellig:'hinfällig'};

// ---------- Glaubwürdigkeit (K15 §3, §5.3): je Mannschaft, für dich beim aktuellen Verein ----------
const glaub=t=>{t=t||myT();if(t.glaub==null)t.glaub=RGS.glaubwuerdigkeit.start;return t.glaub;};
const glaubFaktor=t=>{const G=RGS.glaubwuerdigkeit;return G.faktor[0]+glaub(t)/100*G.faktor[1];};
function glaubAendern(v){const t=myT();t.glaub=clamp(glaub(t)+v,0,100);}
const offeneVersprechen=()=>(S.vs||[]).filter(v=>v.stand==='offen');
// Woche: erholt sich bis 60, zu viele offene Versprechen kosten, unter 25 glaubt dir die Kabine nicht mehr (Vorstand wird aufmerksam)
function glaubwuerdigkeitWoche(){const G=RGS.glaubwuerdigkeit,t=myT();if(!t)return;const g=glaub(t);
  if(g<G.erholungBis)glaubAendern(Math.min(G.erholung,G.erholungBis-g));if(offeneVersprechen().length>=G.offenAb)glaubAendern(-G.offenMinus);
  if(glaub(t)<G.krise&&!t.glaubKrise){t.glaubKrise=1;S.trust=clamp(S.trust+G.krisenVorstand,0,100);news('Die Kabine glaubt dir nicht mehr. Ansprachen und Gespräche wirken kaum noch, und der Vorstand hat davon gehört.','bad');}
  else if(glaub(t)>=G.krise+10)delete t.glaubKrise;}

// ---------- Gesprächszeit (K15 §3): höchstens drei Einzelgespräche pro Woche (Montag bis Sonntag) ----------
const wochenStart=()=>absTag(S.tag)-((wochentag(S.tag)-RK.wochenTag+7)%7);
const gespraecheDieseWoche=()=>(S.gz||[]).filter(x=>x>=wochenStart()).length;
const gespraecheFrei=()=>Math.max(0,RGS.proWoche-gespraecheDieseWoche());

// ---------- Wann ein Thema sinnvoll ist (K15 §3.1) ----------
// Ein Thema ohne Anlass wirkt nicht und gibt keine Zusage. So lässt sich Glaubwürdigkeit nicht mit leichten Versprechen sammeln.
function themaAnlass(p,thema){const V=RGS.versprechen,offen=offeneVersprechen().some(v=>v.pid===p.id&&v.art===thema);
  if(offen)return'Dazu gibt es schon eine offene Zusage.';
  if(thema==='rolle')return einschaetzung(p)>krStufe(p)?'':'Er ist mit seiner Rolle einverstanden.';
  if(thema==='einsatz')return(p.ea==null?erwartungEinsatz(p):p.ea)<V.einsatz.anteil||p.ww>=1?'':'Er spielt ohnehin genug.';
  if(thema==='geduld')return krStufe(p)<=2||p.age<=RKA.talentBis||(p.wiv||0)<RKA.zusammenhalt.neuerWochen||p.ww>=1?'':'Er hat keinen Grund zu warten.';
  if(thema==='wechsel')return p.ww>=1||stimmung(p)<50?'':'Er will gar nicht weg.';
  if(thema==='konkurrent')return einschaetzung(p)>=3&&(rivalen(p).length||squad(S.my).some(q=>q!==p&&q.pos===p.pos&&(q.wiv||0)<RKA.zusammenhalt.neuerWochen&&q.str>=p.str-V.konkurrent.staerke))?'':'Er fürchtet keine Konkurrenz.';
  if(thema==='schuetzen')return p.age<=RJ.praegung.bisAlter&&(p.prO||p.sv<0||(p.lastG!=null&&p.lastG>=RGS.lage.kritikAb)||ueberBelastung(p))?'':'Er spürt gerade keinen besonderen Druck.';
  return'';}
// Lob und Kritik nach der letzten Note: unpassend kehrt die Wirkung halb um (K15 §5.1)
function themaLage(p,thema){const L=RGS.lage,n=p.lastG;if(n==null)return 1;if(thema==='lob'&&n>=L.kritikAb+0.5)return RGS.wirkung.unpassend;if(thema==='kritik'&&n<=L.lobBis-0.5)return RGS.wirkung.unpassend;return 1;}
const REAKTION_REIHE=['diva','nervenschwach','hitzkopf','soeldner','vorbildprofi','fuehrungsspieler','kaempfer'];
// Wirkung (K15 §5.1): Grundwirkung × Haltung und Charakter × Glaubwürdigkeit × Ruf-Gefälle × Abnutzung × Persönlichkeit, nach einem Streit halb
// Schadet ein Gespräch (Kritik), mildert eine passende Haltung den Schaden, eine unpassende verstärkt ihn.
function gespraechWirkung(p,thema,haltung){const W=RGS.wirkung,Rk=RGS.reaktion,eig=REAKTION_REIHE.filter(k=>hatEig(p,k));
  let w0=thema==='kritik'?W.kritik:W[thema]||0;if(thema==='kritik'){const k=eig.find(k=>Rk[k].kritik!=null);if(k)w0=Rk[k].kritik;}
  if(thema==='lob')eig.forEach(k=>{if(Rk[k].lob)w0*=Rk[k].lob;});
  const h=eig.reduce((a,k)=>a*(Rk[k][haltung]||1),1),abn=gespraechAbnutzung(p,thema);
  let w=w0>=0?w0*h:w0*clamp(2-h,0.4,1.6);w*=themaLage(p,thema)*glaubFaktor()*abn*(1+RGS.persoenlichkeit*((p.ch?p.ch.anp:10)-10));
  if(rufGefaelle(p))w*=w>=0?RKA.rufGefaelle.lob:RKA.rufGefaelle.kritik;if(p.streit!=null&&p.streit>absTag(S.tag)-W.nachStreitTage)w*=W.nachStreit;
  let streit=0;eig.forEach(k=>{if(haltung==='b'&&Rk[k].streitB)streit=Math.max(streit,Rk[k].streitB);if(thema==='kritik'&&Rk[k].streitKritik)streit=Math.max(streit,Rk[k].streitKritik);});
  return{w,streit,abn};}
// Abnutzung (K15 §5.1): dasselbe Thema beim selben Spieler innerhalb von vier Wochen, Lob bei Diven zählt doppelt
function gespraechAbnutzung(p,thema){const A=RGS.abnutzung,n=(p.gs||[]).filter(([d,k])=>k===thema&&d>absTag(S.tag)-A.wochen*7).length*(thema==='lob'&&hatEig(p,'diva')?RGS.reaktion.diva.lobAbnutzung:1);
  return n===0?1:n===1?A.zweites:A.danach;}

// ---------- Ein Einzelgespräch führen ----------
// Ergebnis: {ok, text, w, streit, geloest, versprechen}. Wirkung sofort (gedeckelt ±10) und zur Hälfte im Baustein „Trainer“ (K14 §5.1), Gesprächswunsch gelöst mit Wahrscheinlichkeit nach Wirkung.
function gespraechFuehren(pid,thema,haltung){const p=PIX.get(pid);if(!p||p.team!==S.my||!THEMEN[thema]||!HALTUNGEN[haltung])return{ok:false,text:'Gespräch nicht möglich.'};
  if(!gespraecheFrei())return{ok:false,text:`Diese Woche hast du schon ${RGS.proWoche} Einzelgespräche geführt.`};
  return mitStrom(strom('gespraech',S.season,S.tag,pid,gespraecheDieseWoche()),()=>{kabineInit(p);const anlass=themaAnlass(p,thema),wunsch=(S.gw||[]).some(g=>g.pid===p.id)&&p.ww===2;
    let {w,streit}=anlass?{w:0,streit:0}:gespraechWirkung(p,thema,haltung);
    S.gz=[...(S.gz||[]).filter(x=>x>=wochenStart()),absTag(S.tag)];p.gs=[...(p.gs||[]).filter(([d])=>d>absTag(S.tag)-RGS.abnutzung.wochen*7),[absTag(S.tag),thema]];const gestritten=!anlass&&streit>0&&R()<streit;
    if(gestritten){w=Math.min(w,0)+RGS.streit.stimmung;p.streit=absTag(S.tag);zusammenhaltAendern(myT(),RKA.zusammenhalt.streit);}
    stimmungAendern(p,w);if(w)trainerWirkung(p,w*RGS.wirkung.trainerAnteil);
    if(thema==='kritik'&&hatEig(p,'nervenschwach')&&!anlass)svAendern(p,RGS.reaktion.nervenschwach.sv);
    // Umgang nach einem prägenden Spiel (K08 §5.3), Druck nehmen baut Selbstvertrauen auf, ein Altstar nimmt seine Rolle an (K14 §12)
    if(!anlass){praegungUmgang(p,thema);if(thema==='schuetzen'&&p.sv<0)svAendern(p,RGS.schuetzenSv);if(thema==='rolle'&&w>0&&p.kr&&p.age>=RKA.bank.altstar.ab)p.krOk=p.kr;}
    let vs=null;if(!anlass&&!gestritten&&w>0&&RGS.versprechen[thema])vs=versprechenAnlegen(p,thema);
    let geloest=null;if(wunsch&&!anlass){S.gw=S.gw.filter(g=>g.pid!==p.id);const L=RGS.loesen; // ohne Anlass bleibt der Gesprächswunsch offen
      if(gestritten||w<=0){geloest=false;wwStufe3(p);}else if(R()<clamp(L.basis+L.jePunkt*w,L.min,L.max)){geloest=true;p.ww=1;p.wws=0;p.wv=0;}}
    const text=antwortText(p,thema,w,gestritten,anlass,geloest,vs);news(`Gespräch mit ${p.n} (${THEMEN[thema]}, ${HALTUNGEN[haltung]}): ${text}`,w>0?'good':w<0?'bad':'');
    return{ok:true,text,w,streit:gestritten,geloest,versprechen:vs};});}
function antwortText(p,thema,w,streit,anlass,geloest,vs){const n=last(p.n);
  if(anlass)return`${anlass} Das Gespräch bringt nichts.`;
  if(streit)return`${n} wird laut und knallt die Tür zu. Ihr habt euch gestritten.${geloest===false?' Er will jetzt offiziell weg.':''}`;
  let t=w>=6?`„Danke, Trainer. Das wollte ich hören.“`:w>=2?`„In Ordnung, ich verstehe.“`:w>0?`${n} nickt, wirkt aber nicht überzeugt.`:w>-3?`${n} zuckt mit den Schultern.`:`${n} ist sichtlich getroffen.`;
  if(thema==='kritik'&&w>0)t=`„Sie haben recht. Ich zeige es Ihnen im nächsten Spiel.“`;
  if(vs)t+=` Zusage: ${versprechenText(vs)}.`;if(geloest===true)t+=' Der Gesprächswunsch ist erledigt.';else if(geloest===false)t+=' Er ist nicht zufrieden und will offiziell weg.';
  return t;}

// ---------- Versprechen (K15 §5.3): mit Bedingung und Frist, laufend überwacht ----------
function versprechenAnlegen(p,art){const V=RGS.versprechen,v={id:(S.vsId=(S.vsId||0)+1),pid:p.id,art,von:absTag(S.tag),stand:'offen'};
  if(art==='einsatz')Object.assign(v,{spiele:0,min:0,n:V.einsatz.spiele});
  if(art==='geduld')v.bis=v.von+V.geduld.tage;
  if(art==='wechsel'){v.bis=v.von+V.wechsel.tage;v.preis=value(p);p.list=1;p.ask=v.preis;}
  if(art==='konkurrent'){v.bis=v.von+V.konkurrent.tage;v.str=Math.round(p.str);}
  S.vs=[...(S.vs||[]).filter(x=>x.stand==='offen'||x.ende>absTag(S.tag)-120),v];return v;}
function versprechenText(v){const V=RGS.versprechen,bis=v.bis!=null?datumKurz(v.bis-absTag(0)):'';
  if(v.art==='einsatz')return`mindestens ${Math.round(V.einsatz.anteil*100)} % der Minuten in ${v.n} Pflichtspielen (bisher ${v.spiele}, ${v.min} Minuten)`;
  if(v.art==='geduld')return`ein Startelf-Einsatz bis ${bis}`;if(v.art==='wechsel')return`bei einem Angebot ab ${fmt(v.preis)} darf er gehen (bis ${bis})`;
  return`kein Neuzugang auf seiner Position ab Stärke ${v.str-V.konkurrent.staerke} (bis ${bis})`;}
function versprechenEnde(v,stand){const V=RGS.versprechen,G=RGS.glaubwuerdigkeit,p=PIX.get(v.pid);v.stand=stand;v.ende=absTag(S.tag);if(!p)return;
  if(stand==='gehalten'){if(p.team===S.my)stimmungAendern(p,V.gehalten);glaubAendern(G.gehalten);news(`Versprechen gehalten: ${p.n} (${VERSPRECHEN_NAME[v.art]}). Die Kabine nimmt dich beim Wort.`,'good');}
  else if(stand==='gebrochen'){glaubAendern(G.gebrochen);if(p.team===S.my){stimmungAendern(p,V.gebrochen,true);for(let i=0;i<V.stufe;i++)wwHoeher(p);}
    news(`Versprechen gebrochen: ${p.n} (${VERSPRECHEN_NAME[v.art]}). Das spricht sich in der Kabine herum.`,'bad');}}
// Wechselwunsch eine Stufe höher (gebrochenes Versprechen): Stufe 2 wird zum Gesprächswunsch, Stufe 3 zum offiziellen Wechselwunsch
function wwHoeher(p){const n=Math.min(4,(p.ww||0)+1);if(n===3)wwStufe3(p);else{p.ww=n;p.wws=0;if(n===2)gespraechswunsch(p);}}
// Nach jedem Pflichtspiel deines Vereins (vor dem Absitzen der Sperren): Minuten und Startelf zählen, wenn der Spieler verfügbar war
function versprechenNachSpiel(list){const m=list.find(r=>r.h===S.my||r.a===S.my);if(!m)return;const s=m.h===S.my?0:1,min=new Map(m.xpo[s].map(x=>[x[0],x[3]==null?90:x[3]])),xi=new Set(m.xi[s]||[]);
  mitWettbewerb(wbVon(m),()=>offeneVersprechen().forEach(v=>{const p=PIX.get(v.pid);if(!p||p.team!==S.my)return;
    if(v.art==='einsatz'){if(!min.has(p.id)&&!avail(p))return;v.spiele++;v.min+=Math.min(90,min.get(p.id)||0);
      if(v.spiele>=v.n)versprechenEnde(v,v.min>=RGS.versprechen.einsatz.anteil*90*v.n?'gehalten':'gebrochen');}
    if(v.art==='geduld'&&xi.has(p.id))versprechenEnde(v,'gehalten');}));}
// Täglich: Fristen, Abgänge. Geduld ist hinfällig, wenn er die halbe Zeit verletzt war.
function versprechenTag(){const heute=absTag(S.tag);S.vs=(S.vs||[]).filter(v=>PIX.get(v.pid)); // Spieler nach dem Karriereende: Zusagen fallen weg
  offeneVersprechen().forEach(v=>{const p=PIX.get(v.pid);
  if(!p||(p.team!==S.my&&v.art!=='wechsel')){versprechenEnde(v,'hinfaellig');return;}
  if(v.art==='wechsel'&&p.team!==S.my){versprechenEnde(v,'gehalten');return;}
  if(v.art==='geduld'&&p.inj>0)v.verletzt=(v.verletzt||0)+1;
  if(v.bis!=null&&heute>=v.bis){if(v.art==='geduld')versprechenEnde(v,(v.verletzt||0)*2>=RGS.versprechen.geduld.tage?'hinfaellig':'gebrochen');else if(v.art==='wechsel')versprechenEnde(v,'hinfaellig');else versprechenEnde(v,'gehalten');}});}
// Angebot abgelehnt oder Spieler von der Transferliste genommen: ein Wechsel-Versprechen ist gebrochen
function versprechenAngebot(pid,betrag){offeneVersprechen().forEach(v=>{if(v.pid===pid&&v.art==='wechsel'&&(betrag==null||betrag>=v.preis))versprechenEnde(v,'gebrochen');});}
// Neuzugang gekauft: „keine Konkurrenz“ gebrochen, wenn er auf derselben Position spielt und stark genug ist
function versprechenKauf(neu){offeneVersprechen().forEach(v=>{const p=PIX.get(v.pid);if(v.art==='konkurrent'&&p&&p!==neu&&p.pos===neu.pos&&neu.str>=v.str-RGS.versprechen.konkurrent.staerke)versprechenEnde(v,'gebrochen');});}
// Vereinswechsel des Trainers: Zusagen beim alten Verein sind hinfällig
function versprechenJobwechsel(){offeneVersprechen().forEach(v=>{v.stand='hinfaellig';v.ende=absTag(S.tag);});S.gw=[];}
// Droht ein Einsatz-Versprechen zu kippen? (Erinnerung vor „Tag beenden“, K15 §4.4): mit allen restlichen Spielen über 90 Minuten reicht es knapp oder nicht mehr
function versprechenKippen(){const V=RGS.versprechen.einsatz;return offeneVersprechen().filter(v=>{if(v.art!=='einsatz')return false;const rest=v.n-v.spiele;return rest>0&&v.min+(rest-1)*90<V.anteil*90*v.n;});}

// ---------- Mannschaftsansprache außerhalb des Spiels (K15 §5.4): höchstens einmal pro Woche ----------
const anspracheDieseWoche=()=>(myT().mans||[]).some(([d])=>d>=wochenStart());
// Nächstes Pflichtspiel deines Vereins in den nächsten sieben Tagen und ob es ein Endspiel ist (Pokalfinale, Relegation, letzter Spieltag)
function naechstesEndspiel(){for(let d=S.tag;d<=S.tag+7;d++){const e=meinSpiel(d);if(!e)continue;const fin=(e.art==='pokal'&&e.r===5)||e.art==='rel'||e.art==='rel2'||(e.art==='liga'&&S.fx[e.lg]&&e.md===S.fx[e.lg].length-1);return fin?d:null;}return null;}
function anspracheGeeignet(art){const t=myT(),erw=(t.erw||[]).slice(-3),sp=(S.res[t.lg]||[]).filter(r=>r[0]===S.my||r[1]===S.my).length,mo=datumVon(S.tag).getUTCMonth();
  if(art==='rueckendeckung')return erw.filter(x=>x[0]===0).length>=2;
  if(art==='weckruf')return erw.length>=3&&erw.reduce((a,x)=>a+x[0]-x[1],0)<=-1.5&&t.expPos&&rank(t.lg,S.my)<=t.expPos+2;
  if(art==='ziel')return S.phase==='play'&&(sp<3||mo===11&&datumVon(S.tag).getUTCDate()>=15||mo===0);
  if(art==='endspiel')return naechstesEndspiel()!=null;
  if(art==='rotation')return englischeWocheVoraus();return false;}
// Englische Woche voraus (K14 §12): in den nächsten sieben Tagen zwei Pflichtspiele, oder eines höchstens vier Tage nach dem letzten
function englischeWocheVoraus(){const n=RGS.mannschaft.rotation.tage,e=RKA.bank.englischTage,l=[];for(let d=S.tag;d<=S.tag+n;d++)if(meinSpiel(d))l.push(d);
  if(l.length>=2)return true;if(!l.length)return false;const a=spielAbstand(l[0]).get(S.my);return !!a&&a.last!=null&&l[0]-a.last<=e;}
function mannschaftsAnsprache(art){const M=RGS.mannschaft,t=myT();if(!M_ANSPRACHEN[art])return{ok:false,text:'Unbekannte Ansprache.'};
  if(anspracheDieseWoche())return{ok:false,text:'Diese Woche hast du schon zur Mannschaft gesprochen.'};
  const A=RGS.abnutzung,n=(t.mans||[]).filter(([d,k])=>k===art&&d>absTag(S.tag)-A.wochen*7).length,abn=n===0?1:n===1?A.zweites:A.danach,passt=anspracheGeeignet(art);
  const f=(passt?1:RGS.wirkung.unpassend)*abn*glaubFaktor(t),sq=squad(S.my);t.mans=[...(t.mans||[]).filter(([d])=>d>absTag(S.tag)-A.wochen*7),[absTag(S.tag),art]];
  if(art==='rueckendeckung')sq.forEach(p=>{svAendern(p,M.rueckendeckung.sv*f);stimmungAendern(p,M.rueckendeckung.stimmung*f);});
  if(art==='weckruf'){t.weck={n:M.weckruf.spiele,f};sq.forEach(p=>{if(hatEig(p,'kaempfer'))stimmungAendern(p,M.weckruf.kaempfer*Math.abs(f));if(hatEig(p,'diva'))stimmungAendern(p,M.weckruf.diva*Math.abs(f));});}
  if(art==='ziel')sq.forEach(p=>stimmungAendern(p,M.ziel.stimmung*f));
  if(art==='endspiel'){const d=naechstesEndspiel();if(d!=null)t.endspiel={tag:d,s:S.season,f};}
  // Rotation ankündigen (K14 §12, „Erklären hilft“): passend gilt sie sieben Tage, unpassend sind die Stammspieler irritiert
  if(art==='rotation'){if(f>0)t.rotAn={bis:absTag(S.tag)+M.rotation.tage,f};else{delete t.rotAn;sq.forEach(p=>{if(stammA(p))stimmungAendern(p,M.rotation.unpassend);});}}
  const text=`Ansprache „${M_ANSPRACHEN[art]}“${passt?'':' – passt nicht zur Lage, die Spieler sind irritiert'}${abn<1?' (kennen sie schon, wirkt schwächer)':''}.`;news(text,passt?'good':'bad');return{ok:true,text,passt,f};}
// Weckruf: Die Note zählt in den nächsten zwei Pflichtspielen 20 % stärker für die Form (in engine.js beim Formwechsel nach dem Spiel)
const weckFaktor=tid=>{const t=S.teams[tid];return t&&t.weck&&t.weck.n>0?1+(RGS.mannschaft.weckruf.note-1)*t.weck.f:1;};
function weckNachSpiel(tid){const t=S.teams[tid];if(t&&t.weck&&--t.weck.n<=0)delete t.weck;}
// Halbzeitansprache (K15 §5.5): Glaubwürdigkeit nach dem Spiel, passend +1, unpassend −2
function halbzeitGlaub(passt){const H=RGS.halbzeit;glaubAendern(passt?H.passend:H.unpassend);}
