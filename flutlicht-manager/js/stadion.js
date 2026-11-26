// Stadion und Anlagen (K26 §3.2, §4, §5.1, K26a): Bauprozess mit Genehmigung, Auflagen, Verzögerung und Mehrkosten für alle Bauten,
// Anlagen (Trainingsgelände, Nachwuchsleistungszentrum, Reha-Zentrum, Catering, Anzeigetafel), Instandhaltung. Zuerst nur dein Verein.
// Im Spielstand: S.constr = {k, label, phase ('genehmigung' | 'bau'), ab (absoluter Tag Baubeginn, zugleich Kennung des Projekts), bis (absoluter Tag fertig), kosten, auflage, verzug, mehr, gemeldet,
//   zuschuss (K26e: Betrag der Stadt), klage (K26f: Wochen, um die sich die Genehmigung durch die Klage verschiebt)}
// (eine Baustelle zur Zeit wie bisher; ältere Stände haben {k, bis (Tag der Saison), label}), am Verein t.anl = {training, nlz, reha, catering, tafel}, t.bausumme.
// Zufall: beim Start einer Baustelle alles auf einmal im eigenen Strom 'bau'.
const ANLAGEN=['training','nlz','reha','catering','tafel','dach'];
// Dach (K26d): Heimvorteil × (1 + heim) für den Gastgeber, wenn die erwarteten Zuschauer (ohne Würfel, ohne den konkreten Gegner, Liga) mindestens abAuslastung der Plätze sind.
// Bei deinem Verein mit deinem Ticketpreis wie in attendance (Prüfung DI1), sonst hätte ein halb leeres Stadion bei teuren Tickets den Bonus bekommen. Engine: side()
function dachFaktor(tid){const t=tid>=0&&tid<1000?S.teams[tid]:null,A=RB.anlagen.dach;if(!t||anlage(t,'dach')<1)return 1;
  const n=Math.min(t.cap,zuschauerErwartung(t,null,false,false,true)*(t.id===S.my?preisFaktor(t,t.price):1));return n>=t.cap*A.abAuslastung?1+A.heim:1;}
// Stufe einer Anlage (Computer-Vereine und alte Stände: Startstufe)
const anlage=(t,k)=>{const A=RB.anlagen[k];return t&&t.anl&&t.anl[k]!=null?t.anl[k]:A.start;};
const anlageKosten=(t,k)=>{const A=RB.anlagen[k],st=anlage(t,k);return Math.round(A.kosten*Math.pow(RB.anlagen.faktor,Math.max(0,st-A.start))/1e5)*1e5;};
// Wirkungen
const gelaendeFaktor=tid=>{const t=S.teams[tid],A=RB.anlagen.training;return 1+A.entwicklung*(anlage(t,'training')-A.start);};
const gelaendeRisiko=tid=>{const t=S.teams[tid],A=RB.anlagen.training;return 1+A.risiko*(anlage(t,'training')-A.start);};
const jugendDeckel=()=>Math.min(100,RJ.niveau.deckel+RB.anlagen.nlz.deckelJe*anlage(myT(),'nlz'));
const rehaFaktor=tid=>{const t=S.teams[tid];return 1-RB.anlagen.reha.je*anlage(t,'reha');};
const zuschauerFaktor=t=>1+RB.anlagen.catering.zuschauer*anlage(t,'catering')+RB.anlagen.tafel.zuschauer*anlage(t,'tafel');

// Bauteile: Tribüne, Logen, Fanshop (alt) und Anlagen (neu)
const bauName=(k,t)=>ANLAGEN.includes(k)?`${RB.anlagen[k].name} Stufe ${anlage(t,k)+1}`:bauLabel(k,t);
const bauPreis=(k,t)=>ANLAGEN.includes(k)?anlageKosten(t,k):bauKosten(k,t);
const bauDauer=k=>ANLAGEN.includes(k)?RB.anlagen[k].wochen:bauWochen(k);
const bauFertigAusgebaut=(k,t)=>ANLAGEN.includes(k)?anlage(t,k)>=RB.anlagen[k].max:bauVoll(k,t);
// Start (aktionen.js startBuild): Kosten sofort, Genehmigung, Auflagen, Verzögerung und Mehrkosten jetzt gewürfelt, gemeldet, wenn es eintritt
function bauStarten(k){if(!darf('stadion'))return;const t=myT();if(S.constr){toast('Es wird schon gebaut.');return;}if(bauFertigAusgebaut(k,t))return;
  const kosten=bauPreis(k,t),label=bauName(k,t);if(t.cash<kosten){toast('Dafür reicht der Kontostand nicht.');return;}
  const P=RB.prozess,heute=absTag(S.tag);const w=mitStrom(strom('bau',S.season,S.tag,k),()=>({gen:riA(P.genehmigung),auflage:R()<P.auflagen.chance?P.auflagen.kosten[0]+R()*(P.auflagen.kosten[1]-P.auflagen.kosten[0]):0,
    verzug:R()<P.verzoegerung.chance?riA(P.verzoegerung.wochen):0,mehr:R()<P.mehrkosten.chance?P.mehrkosten.anteil[0]+R()*(P.mehrkosten.anteil[1]-P.mehrkosten.anteil[0]):0}));
  money('Stadionbau',-kosten);const ab=heute+w.gen*7;S.constr={k,label,phase:'genehmigung',ab,bis:ab+bauDauer(k)*7,kosten,auflage:w.auflage,verzug:w.verzug,mehr:w.mehr,gemeldet:0};
  news(`Bauantrag gestellt: ${label}. Die Genehmigung dauert etwa ${w.gen} Wochen, danach ${bauDauer(k)} Wochen Bauzeit.`);save();render();}
// Täglich (ablauf.js taeglichLauf, statt der alten Prüfung): Baubeginn, Verzögerung, Ende
function bauTag(d){const c=S.constr;if(!c)return;const t=myT(),heute=absTag(d);
  if(c.phase==null){if(d>=c.bis)bauFertig(c,t);return;} // alter Stand: Tag der Saison wie bisher
  if(c.phase==='genehmigung'&&heute>=c.ab+(c.klage||0)*7){c.phase='bau'; /* Klage der Anwohner verzögert die Genehmigung (K26f, c.klage Wochen) */let txt=`Baubeginn: ${c.label}.`;
    if(c.auflage){const x=Math.round(c.kosten*c.auflage/1000)*1000;money('Stadionbau',-x);c.kosten+=x;txt+=` Die Genehmigung kommt mit Auflagen (Lärmschutz, Verkehr): ${fmt(x)} mehr.`;}
    if(c.k==='cap'){t.cap=Math.max(0,t.cap-RB.tribuene.plaetze);txt+=` Während des Baus fehlen ${RB.tribuene.plaetze.toLocaleString('de-DE')} Plätze.`;}news(txt+` Fertig am ${datumKurz(c.bis-absTag(0))}.`);}
  if(c.phase==='bau'&&heute>=c.bis){if(c.verzug&&!c.gemeldet){c.gemeldet=1;c.bis+=c.verzug*7;news(`Bauverzögerung: ${c.label} wird ${c.verzug} Woche${c.verzug>1?'n':''} später fertig, am ${datumKurz(c.bis-absTag(0))}.`,'bad');return;}bauFertig(c,t);}}
function bauFertig(c,t){if(c.mehr){const x=Math.round(c.kosten*c.mehr/1000)*1000;money('Stadionbau',-x);c.kosten+=x;news(`Mehrkosten beim Bau: ${fmt(x)}.`,'bad');}
  bauWirkung(c,t);news(`Bau abgeschlossen: ${c.label}.`,'good');S.constr=null;}
// Wirkung eines fertigen Baus: Plätze (die während des Baus fehlenden kommen zurück), Logen, Fanshop oder Stufe der Anlage, Bausumme für die Instandhaltung
function bauWirkung(c,t){if(c.k==='cap')t.cap+=RB.tribuene.plaetze*(c.phase==='bau'?2:1);else if(c.k==='logen')t.logen+=RB.logen.anzahl;else if(c.k==='shop')t.shop++;
  else if(ANLAGEN.includes(c.k)){t.anl=t.anl||{};t.anl[c.k]=anlage(t,c.k)+1;}
  if(c.phase!=null)t.bausumme=(t.bausumme||0)+(c.kosten||0);}
// Vereinswechsel (saison.js takeJob, vor dem Wechsel): Der alte Verein baut ohne dich fertig. Die Wirkung kommt sofort, Auflagen und Mehrkosten fallen weg (vorläufig).
function bauAbgeben(){const c=S.constr;if(c)bauWirkung(c,myT());S.constr=null;}
// Monatlich (finanzen.js finanzenMonat über finanzenTag): Instandhaltung 1 % der Bausumme im Jahr
function instandhaltung(){const t=myT();if(t.bausumme>0)money('Instandhaltung',-Math.round(t.bausumme*RB.instandhaltung/12));}
// Karte im Stadion: Anlagen und Baustelle
function anlagenKarte(){const t=myT(),c=S.constr,W={training:`Entwicklung im Training × ${de(gelaendeFaktor(S.my),2)}, Verletzungsrisiko × ${de(gelaendeRisiko(S.my),2)}`,nlz:`Deckel des Jugendniveaus ${jugendDeckel()}`,
    reha:`Ausfallzeit × ${de(rehaFaktor(S.my),2)}`,dach:`Heimvorteil +${de(RB.anlagen.dach.heim*100,1)} %, wenn das Stadion voll ist${anlage(t,'dach')?'':' (nach dem Bau)'}`,catering:anlage(t,'catering')?'Zuschauereinnahmen +5 %':'Zuschauereinnahmen +5 % nach dem Bau',tafel:anlage(t,'tafel')?'Zuschauereinnahmen +3 %':'Zuschauereinnahmen +3 % nach dem Bau'};
  const bau=c?(c.phase==='genehmigung'?`<p><b>Baustelle:</b> ${esc(c.label)}, Genehmigung läuft${c.klage?', Anwohner haben geklagt':''}, Baubeginn etwa am ${esc(datumKurz(c.ab+(c.klage||0)*7-absTag(0)))}.</p>`:`<p><b>Baustelle:</b> ${esc(c.label||'')}, fertig am ${esc(datumKurz((c.phase?c.bis-absTag(0):c.bis)))}.</p>`):'';
  return`<div class="card"><h2>Anlagen</h2>${lzHinweis('stadion')}${bau}<table><tbody>${ANLAGEN.map(k=>{const A=RB.anlagen[k],st=anlage(t,k),voll=st>=A.max;
    return`<tr><td><b>${esc(A.name)}</b> <span class="dim">Stufe ${st} von ${A.max}</span><br><span class="dim">${esc(W[k])}</span></td><td>${voll?'<span class="dim">ganz ausgebaut</span>':`<button onclick="startBuild('${k}')"${lzAus('stadion')}${c?' disabled':''}>Ausbauen (${fmt(anlageKosten(t,k))}, ${A.wochen} Wochen)</button>`}</td></tr>`;}).join('')}</tbody></table>
    <p class="dim">Jeder Bau braucht erst eine Genehmigung (2 bis 8 Wochen, manchmal mit Auflagen). Etwa ein Drittel der Bauten wird später fertig, manche teurer. Instandhaltung: 1 % der Bausumme im Jahr${t.bausumme?`, zurzeit ${fmt(Math.round(t.bausumme*RB.instandhaltung))}`:''}.</p></div>`;}
// Fertig-Tag der Baustelle als Tag der Saison (neue Stände rechnen mit absoluten Tagen, alte mit dem Tag der Saison)
const bauBisTag=c=>c.phase!=null?c.bis-absTag(0):c.bis;
// Plätze ohne den Abzug während eines Tribünenbaus (bauTag zieht RB.tribuene.plaetze ab), für Verhältnisse wie Mitglieder je Platz (Prüfung ES5)
const kapOhneBau=t=>t.cap+(t.id===S.my&&S.constr&&S.constr.k==='cap'&&S.constr.phase==='bau'?RB.tribuene.plaetze:0);

// ---------- K26b (K26 §7): Computer-Vereine bauen ----------
// Zum Saisonstart (saison.js newSeason), ohne Zufall und ohne Bauzeit. Am Verein: t.voll = Saisons nacheinander mit Nachfrage über RB.computer.vollAb der Plätze.
// Nachfrage: erwartete Zuschauer eines Ligaheimspiels ohne Deckel, Gegner mit dem Ansehen des Ligaschnitts, neutrale Form (finanzen.js zuschauerErwartung)
function kiNachfrage(t){const l=S.teams.filter(x=>x.lg===t.lg),opp={rep:l.reduce((a,x)=>a+x.rep,0)/Math.max(1,l.length)};return zuschauerErwartung(t,opp,false,true,true);}
function kiBauen(t){const B=RB.computer,T=RB.tribuene,n=kiNachfrage(t),res=Math.round(erwarteteEinnahmen(t)*RFP.budget.reserve);
  t.voll=n>=t.cap*B.vollAb?(t.voll||0)+1:0;const neu=t.cap+T.plaetze;
  if(t.voll>=B.saisons&&neu<=T.max&&neu<=n*B.nachfrageMax&&t.cash-T.kosten>=res*B.reserveTribuene){t.cash-=T.kosten;t.cap=neu;t.bausumme=(t.bausumme||0)+T.kosten;t.voll=0;return'cap';}
  // Anlagen und Fanshop (K26c: 'shop' ist die Stufe t.shop mit den Kosten aus RB.fanshop)
  const stufe=x=>x==='shop'?(t.shop||0):anlage(t,x),max=x=>x==='shop'?RB.fanshop.max:RB.anlagen[x].max;
  const liste=B.anlagen[vereinsProfile(t).includes('ausbildung')?'ausbildung':'standard'],k=liste.find(x=>stufe(x)<max(x));if(!k)return null;
  const kosten=k==='shop'?RB.fanshop.kosten[t.shop||0]:anlageKosten(t,k);if(t.cash-kosten<res*B.reserveAnlage)return null;
  t.cash-=kosten;if(k==='shop')t.shop=(t.shop||0)+1;else{t.anl=t.anl||{};t.anl[k]=anlage(t,k)+1;}t.bausumme=(t.bausumme||0)+kosten;return k;}
// Alle Computer-Vereine der drei Ligen, Meldung für Tribünen in deiner Liga
function kiBauenSaison(){const lg=S.teams[S.my]?S.teams[S.my].lg:0;S.teams.forEach(t=>{if(t.id===S.my||!aktiv(t))return;const b=kiBauen(t);
  if(b==='cap'&&t.lg===lg)news(`${t.name} hat in der Sommerpause die Tribüne ausgebaut: jetzt ${t.cap.toLocaleString('de-DE')} Plätze.`);});}
