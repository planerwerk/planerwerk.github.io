// Fanstimmung (K27 §5.4b, U16): je Verein t.fanst (0–100), montags Richtung Ziel aus Erfolg, Preisen, Identifikation, Entscheidungen und Umfeld.
// Anlässe mit Gedächtnis am Verein: t.fanE (Erfolg), t.fanD (Entscheidungen), t.fanU (Umfeld), sie verblassen je Woche. Am Spieler p.ej = Verein, aus dessen Jugend er kommt.
// Wirkung: Zuschauer (Faktor), Baustein im Vertrauen deines Vorstands, Pfiffe bei Protest, Fan-Gespräch (S.fanG = absoluter Tag des letzten). Ohne Zufall.
const fanst=t=>t&&t.fanst!=null?t.fanst:RFS.start;
const fanZahl=x=>Math.round(x*10)/10;
// Publikumsliebling: viele Pflichtspiele für den Verein (ab Spielbeginn, K34) oder Eigengewächs mit etwas weniger
function istLiebling(p,tid){const F=RFS.ident,n=vereinsSpiele(p,tid);return n>=F.lieblingSpiele||(p.ej===tid&&n>=F.lieblingEigen);}
function fanBausteine(t){const F=RFS,E=F.erfolg,c=(x,s)=>clamp(x,s[0],s[1]);let erfolg=t.fanE||0;
  const tab=table(t.lg),i=tab.findIndex(r=>r.id===t.id),r=tab[i];
  if(r&&r.sp>=E.abSpiel){erfolg+=E.jePlatz*((t.expPos||i+1)-(i+1));const l=r.last.slice(-5);if(l.length)erfolg+=E.serie*(l.reduce((a,b)=>a+b,0)/l.length-E.serieMitte);}
  const rp=richtPreis(t),preise=(t.price&&rp>0?F.preise.faktor*(1-t.price/rp):0)+dkFans(t),lieb=squad(t.id).filter(p=>istLiebling(p,t.id)); // dazu der Dauerkartenrabatt (K27b)
  return{erfolg:c(erfolg,E.spanne),preise:c(preise,F.preise.spanne),ident:c(F.ident.basis+F.ident.jeLiebling*lieb.length,F.ident.spanne),entscheid:c(t.fanD||0,F.entscheid.spanne),umfeld:c(t.fanU||0,F.umfeld.spanne),lieb};}
function fanZiel(t){const b=fanBausteine(t);return clamp(RFS.start+b.erfolg+b.preise+b.ident+b.entscheid+b.umfeld,0,100);}
// Montags (ablauf.js woechentlichLauf, vor dem Vorstand): Richtung Ziel, Anlässe verblassen
function fansWoche(){const F=RFS;S.teams.forEach(t=>{if(!aktiv(t))return;const v=fanst(t);t.fanst=fanZahl(v+(fanZiel(t)-v)*F.traegheit);
  if(t.fanE)t.fanE=fanZahl(t.fanE*(1-F.erfolg.verblassen));if(t.fanD)t.fanD=fanZahl(t.fanD*(1-F.entscheid.verblassen));if(t.fanU)t.fanU=fanZahl(t.fanU*(1-F.umfeld.verblassen));});}
const fanAnlass=(t,k,v)=>{if(t)t[k]=fanZahl((t[k]||0)+v);};
// Ligaspiel (ablauf.js): Derby mit Sieger doppelt
function fansDerby(r){if(r.hg===r.ag||!istDerby(r.h,r.a))return;const w=r.hg>r.ag?r.h:r.a,l=w===r.h?r.a:r.h,D=RFS.erfolg.derby;fanAnlass(S.teams[w],'fanE',D);fanAnlass(S.teams[l],'fanE',-D);}
// Pokalrunde (ablauf.js): weiter +2, Aus gegen einen tieferklassigen Verein (oder Amateure) −4
function fansPokal(list){const E=RFS.erfolg,lg=id=>id>=1000?9:S.teams[id].lg;list.forEach(r=>{const w=winner(r),l=w===r.h?r.a:r.h;if(w<1000)fanAnlass(S.teams[w],'fanE',E.pokal);if(l<1000&&lg(w)>lg(l))fanAnlass(S.teams[l],'fanE',E.pokalAusTiefer);});}
// Abgang mit Ablöse (statistik.js statTransfer): Verkauf eines Publikumslieblings
function fansAbgang(p,von){const t=von!=null&&von>=0&&von<1000?S.teams[von]:null;if(!t||!aktiv(t)||!istLiebling(p,von))return;fanAnlass(t,'fanD',RFS.entscheid.lieblingVerkauf);
  if(von===S.my)news(`Die Fans sind enttäuscht: Mit ${p.n} geht einer ihrer Lieblinge.`,'bad');}
// Zuschauerfaktor (ablauf.js attendance, welt.js zuschauerSpanne): 0,85 bei 0, 1 bei 60, 1,10 bei 100
function fanFaktor(t){const N=RFS.nachfrage,v=fanst(t),s=RFS.start;return v<=s?N[0]+(N[1]-N[0])*v/s:N[1]+(N[2]-N[1])*(v-s)/(100-s);}
// Baustein im Vertrauen deines Vorstands (vorstand.js vorstandWoche), mit toter Zone
function fansVorstand(t){const Z=RFS.vorstand,v=fanst(t);return v<Z.zone[0]?Math.max(Z.minUnten,(v-Z.zone[0])/Z.teilerUnten):v>Z.zone[1]?Math.min(Z.maxOben,(v-Z.zone[1])/Z.teilerOben):0;}
// Nach deinem Ligaheimspiel (ablauf.js): Pfiffe bei Protest
function fansHeimspiel(m){if(!m||m.h!==S.my||fanst(myT())>=RFS.protestUnter)return;(m.xpo[0]||[]).forEach(([id])=>{const p=PIX.get(id);if(p)svAendern(p,RFS.pfiffeSv*fanarbeitFaktor());});
  news(`Pfiffe im eigenen Stadion: Die Fans sind unzufrieden (Fanstimmung ${Math.round(fanst(myT()))}). Das Selbstvertrauen der Spieler leidet.`,'bad');}
// Fan-Gespräch (K27 §5.4): einmal im Monat, Wirkung nach Glaubwürdigkeit
const fanGespraechFrei=()=>S.fanG==null||absTag(S.tag)-S.fanG>=RFS.gespraechTage;
function fanGespraech(){if(!darf('fangespraech'))return;if(!fanGespraechFrei()){toast(`Das nächste Fan-Gespräch geht erst wieder am ${datumKurz(S.fanG+RFS.gespraechTage-absTag(0))}.`);return;}
  const t=myT(),U=RFS.umfeld,g=glaub(t),d=g<U.leerUnter?U.leer:U.gespraech[0]+(U.gespraech[1]-U.gespraech[0])*g/100;S.fanG=absTag(S.tag);fanAnlass(t,'fanU',d);
  news(d<0?`Fan-Gespräch: Die Fans glauben dir nicht mehr und sprechen von leeren Versprechen.`:`Fan-Gespräch: Die Fans fühlen sich ernst genommen.`,d<0?'bad':'good');save();render();}
// Karte im Stadion
function fansKarte(){const t=myT(),b=fanBausteine(t),v=fanst(t),z=fanZiel(t),f=x=>`${x>0?'+':''}${de(x,1)}`;
  return`<div class="card rgs"><h2>Fans</h2>${rgAnzeige({label:'Fanstimmung',sub:'0–100, wirkt auf Zuschauer und Vorstand',min:0,max:100,wert:Math.round(v),marker:[{v:Math.round(z),t:'Ziel '+Math.round(z)}],zonen:[{von:0,bis:RFS.protestUnter,art:'bad',text:'Protest: Pfiffe in Heimspielen'},{von:RFS.vorstand.zone[1],bis:100,art:'good',text:'Rückenwind'}]})}
    <p class="dim">Bausteine des Ziels (montags 15 % Richtung Ziel): Erfolg ${f(b.erfolg)}, Preise ${f(b.preise)}, Identifikation ${f(b.ident)}${b.lieb.length?` (Lieblinge: ${b.lieb.slice(0,5).map(p=>esc(p.n)).join(', ')}${b.lieb.length>5?' …':''})`:''}, Entscheidungen ${f(b.entscheid)}, Umfeld ${f(b.umfeld)}. Zuschauer × ${de(fanFaktor(t),2)}.</p>
    ${lzHinweis('fangespraech')}<div class="row"><button onclick="fanGespraech()"${lzAus('fangespraech')}${fanGespraechFrei()?'':' disabled'}>Fan-Gespräch</button><span class="dim">einmal im Monat, wirkt nach deiner Glaubwürdigkeit (${Math.round(glaub(t))})</span></div></div>`;}

// ---------- Dauerkarten (K27 §5.2, K27b, 22.11., popolupo) ----------
// Nur dein Verein. S.dk = {s Saison, tid Verein, r Rabatt, n verkauft und p Ticketpreis beim Verkauf (beide fehlen bis zum Verkauf)}. Verkauf beim ersten Ligaheimspiel der Saison
// (ablauf.js heimspielEinnahmen), vorher wählst du den Rabatt (Bereich preise, in der Automatik der Standard). Je Ligaheimspiel zahlen alle Inhaber den Preis vom Verkauf
// (höchstens den heutigen, wenn du ihn senkst) × (1 − Rabatt), auch wenn weniger kommen. Kein Zufall. Prüfung CZ: vorher zahlten sie den Preis des Tages, ein späteres Hochsetzen lohnte sich.
const dkStand=()=>S.dk&&S.dk.s===S.season&&S.dk.tid===S.my?S.dk:null;
const dkAktuell=()=>{const d=dkStand();return d&&d.n!=null?d:null;};
// Nach dem Verkauf gilt der verkaufte Rabatt, auch wenn die Automatik danach wieder eingeschaltet wird (CZ3)
const dkRabatt=()=>{const D=RFS.dauerkarten,d=dkStand();if(d&&d.n!=null)return d.r;return autoB('preise')||!d||d.r==null?D.rabatt:d.r;};
// Preis je Dauerkarte und Ligaheimspiel: Preis beim Verkauf, höchstens der heutige, mit Catering und Anzeigetafel, abzüglich Rabatt
const dkPreis=(t,d)=>Math.min(t.price,d.p!=null?d.p:t.price)*zuschauerFaktor(t)*(1-d.r);
// Anteil der Plätze nach Fanstimmung und Rabatt, höchstens ohne Gästeblock
function dkAnteil(t,r){const D=RFS.dauerkarten;return clamp(D.basis+D.jeStimmung*fanst(t)/100+D.jeRabatt*(r-D.rabatt)+(t&&t.id===S.my?dkKampagne():0),0,1-D.gaesteblock);}
// Dauerkarten-Aktion (K25c): in dieser Saison gestartet, mit der Abnutzung aus K25a
const dkKampagne=()=>{const M=S.mk,e=M&&M.s===S.season&&M.k&&M.k.dauerkarten,C=RMK.kampagnen.dauerkarten;return e&&e.n&&C?C.dauerkarten*(e.w||1):0;};
function dkVerkauf(t){const r=dkRabatt(),n=Math.round(t.cap*dkAnteil(t,r));S.dk={s:S.season,tid:S.my,r,n,p:t.price};
  news(`Dauerkarten: ${n.toLocaleString('de-DE')} verkauft (${Math.round(r*100)} % Rabatt). Die Inhaber zahlen in jedem Ligaheimspiel, auch wenn weniger kommen.`,'');return S.dk;}
// Fanstimmung, Baustein Preise (fans.js fanBausteine): mehr Rabatt als der Standard freut die Fans, weniger ärgert sie. Nur dein Verein.
function dkFans(t){if(!t||t.id!==S.my)return 0;const D=RFS.dauerkarten;return D.fans*(dkRabatt()-D.rabatt)*10;}
function dkRabattSetzen(r){const D=RFS.dauerkarten;if(!darf('preise')||!D.stufen.includes(r)||dkAktuell())return;S.dk={s:S.season,tid:S.my,r};save();render();}
// Anzeige im Finanzen-Tab unter dem Eintrittspreis
function dauerkartenText(t){const D=RFS.dauerkarten,d=dkAktuell(),pct=x=>Math.round(x*100)+' %';
  if(d)return`<p>Dauerkarten: <b>${d.n.toLocaleString('de-DE')}</b> verkauft (${pct(d.r)} Rabatt${d.p!=null?`, Preis beim Verkauf ${d.p} €`:''}), je Ligaheimspiel ${fmt(Math.round(Math.min(d.n,t.cap)*dkPreis(t,d)))}.</p>`;
  const r=dkRabatt();
  return`<p>Dauerkarten werden beim ersten Ligaheimspiel verkauft, voraussichtlich etwa ${Math.round(t.cap*dkAnteil(t,r)).toLocaleString('de-DE')} (${pct(r)} Rabatt). Mehr Rabatt: mehr Dauerkarten und zufriedenere Fans, aber weniger je Platz.</p>
    <div class="row">${D.stufen.map(x=>`<button class="${x===r?'go':''}" onclick="dkRabattSetzen(${x})"${lzAus('preise')}>${pct(x)} Rabatt</button>`).join('')}</div>`;}
