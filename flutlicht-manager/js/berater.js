// Berater (Konzept K22, U10c): erfundene Berater mit Profil, Mandanten, Beziehung zu dir, Forderungsfaktor, Provision, Tipps, Angebote, Warnung vor Vorverträgen.
// Alle Zahlen stehen in daten/regeln.js unter REGELN.berater (Kurzform RBE). Die Berater entstehen mit eigenem Zufallsstrom (S.ber), wer welchen Berater hat,
// folgt fest aus Seed und Spielernummer (ohne Zufallszahl), damit die übrige Welt gleich bleibt. Berater sind erfunden, keine echten Namen (K22 §2).

// ---------- Berater und Mandanten ----------
function beraterAufbau(){const B=RBE,prof=Object.keys(B.profile),w=prof.map(k=>B.profile[k].anteil);S.ber=[];
  for(let i=0;i<B.anzahl;i++){let x=R()*w.reduce((a,b)=>a+b,0),k=0;while(k<prof.length-1&&(x-=w[k])>0)k++;
    S.ber.push({id:i,n:rname(),prof:prof[k],einf:ri(B.einfluss[0],B.einfluss[1]),prov:Math.round((B.provision.gehalt[0]+R()*(B.provision.gehalt[1]-B.provision.gehalt[0]))*1000)/1000,
      provAbl:Math.round((B.provision.abloese[0]+R()*(B.provision.abloese[1]-B.provision.abloese[0]))*1000)/1000,bz:0,ein:-99});}}
const beraterListe=()=>{if(!S.ber)mitStrom(strom('berater'),beraterAufbau);return S.ber;};
// Fester Anteil aus Seed und Nummer (0 bis unter 1), ohne den Zufall der Welt zu berühren
const berHash=(p,k)=>(hash32(`${k}|${S.seed}|${p.id}`)%100000)/100000;
// Berater eines Spielers: Stars fast immer, sonst etwa 60 %. Große Berater (Einfluss) haben mehr Mandanten. Familienberater nur bei jungen Spielern.
function beraterVon(p){if(!p||p.id==null)return null;const B=RBE,anteil=Math.max(p.str,p.pot||0)>=B.starsAb?B.anteilStars:B.anteilMit;if(berHash(p,'mit')>=anteil)return null;
  const l=beraterListe().filter(b=>b.prof!=='familie'||p.age<=B.familieBis),sum=l.reduce((a,b)=>a+b.einf,0);let x=berHash(p,'wer')*sum;for(const b of l){if((x-=b.einf)<0)return b;}return l[l.length-1]||null;}
const mandanten=(b,tid)=>squad(tid).filter(p=>beraterVon(p)===b);

// ---------- Wirkung (K22 §5, §12 Nr. 5) ----------
// Forderungsfaktor: Profil, verschoben durch die Beziehung (−2 % je 20 Punkte, höchstens ±10 %)
function beraterFaktor(p){const b=beraterVon(p);if(!b)return 1;const B=RBE.beziehung;return RBE.profile[b.prof].forderung*(1-clamp(b.bz/20*B.je20,-B.max,B.max));}
// Provision bei Unterschrift: Anteil am ersten Jahresgehalt, beim Wechsel dazu ein Anteil an der Ablöse. Gute Beziehung: −10 % je 20 Punkte, höchstens −50 %, schlechte entsprechend mehr
function beraterProvision(p,sal,abl){const b=beraterVon(p);if(!b)return 0;const B=RBE.beziehung;return Math.round((sal*b.prov+(abl||0)*b.provAbl)*(1-clamp(b.bz/20*B.provJe20,-B.provMax,B.provMax))/1000)*1000;}
// Interesse beim Wechsel: Ab +60 rät er seinem Spieler zu dir
const beraterInteresse=p=>{const b=beraterVon(p);return b&&b.bz>=RBE.beziehung.ratAb?RBE.beziehung.interesse:0;};
// Beziehung ändern (−100 bis +100)
function beraterBeziehung(p,d){const b=beraterVon(p);if(!b||!d)return;b.bz=clamp(b.bz+d,-100,100);}
// Abschluss: Provision buchen, Beziehung nach dem Verlauf (zügig und fair +5, nach drei Runden −5 kommt aus vertragRunde)
function beraterAbschluss(p,sal,abl,runden){const pr=beraterProvision(p,sal,abl);if(pr)money('Beraterprovision',-pr);if(runden<=RBE.beziehung.zuegigBis)beraterBeziehung(p,RBE.beziehung.zuegig);return pr;}

// ---------- Woche: Tipps und Angebote, Verblassen zum Saisonwechsel ----------
function beraterWoche(d){const B=RBE.beziehung,l=beraterListe().filter(b=>b.bz>=B.tippsAb);if(!l.length)return;const fremd=S.pl.filter(p=>p.team>=0&&p.team!==S.my&&!p.wech);
  l.forEach(b=>{if(R()>=RBE.tippChance)return;const kandidaten=fremd.filter(p=>beraterVon(p)===b&&((p.ww||0)>=2||(p.st!=null&&p.st<RBE.tippStimmung)));if(!kandidaten.length)return;
    const p=pick(kandidaten),e=(S.kenntnis=S.kenntnis||{})[p.id];kenntnisPlus(p,null,Math.max(0,RBE.tippKenntnis-(e?e.k:grundKenntnis(p))));
    news(`Tipp von Berater ${b.n}: ${p.n} (${p.pos}, ${tn(p.team)}) ist unzufrieden und denkt über einen Wechsel nach.`,'offer');});
  // Erstzugriff ab +60 im Fenster: Er bietet dir einen Mandanten an, der auf einer Position besser ist als dein schwächster Stammspieler
  if(fensterOffen(d))l.filter(b=>b.bz>=B.erstzugriffAb).forEach(b=>{if(R()>=RBE.angebotChance)return;const k=fremd.filter(p=>beraterVon(p)===b&&hatBedarf(myT(),p)&&p.str>=teamLevel(S.my)-RBE.angebotNiveau);if(!k.length)return;
    const p=pick(k);kenntnisPlus(p,null,Math.max(0,RBE.tippKenntnis-((S.kenntnis[p.id]||{}).k||grundKenntnis(p))));news(`Berater ${b.n} bietet dir ${p.n} an (${p.pos}, ${tn(p.team)}). Er hat noch niemand anderem davon erzählt.`,'offer');});}
function beraterSaison(){(S.ber||[]).forEach(b=>{b.bz=Math.round(b.bz*(1-RBE.beziehung.verblassen));});}

// ---------- Einladung (K22 §12 Nr. 3): VIP-Loge oder Essen, höchstens einmal im Monat je Berater ----------
function beraterEinladenLauf(id){const b=beraterListe().find(x=>x.id===id),E=RBE.einladung;if(!b)return'Unbekannter Berater.';if(absTag(S.tag)-b.ein<E.tage)return`${b.n} war erst vor Kurzem eingeladen.`;
  const k=myT().logen>0?E.kostenLoge:E.kosten;money('Kontaktpflege',-k);b.ein=absTag(S.tag);b.bz=clamp(b.bz+E.plus,-100,100);return`${b.n} kommt gern (${fmt(k)}). Die Beziehung wird besser.`;}

// ---------- Anzeige ----------
const BERATER_PROFIL={gierig:'gierig',serioes:'seriös',verschwiegen:'verschwiegen',strippenzieher:'Strippenzieher',familie:'Familienberater'};
const beraterText=p=>{const b=beraterVon(p);return b?`${b.n} (${BERATER_PROFIL[b.prof]}, Beziehung ${b.bz>0?'+':''}${b.bz})`:'keiner';};
function beraterKarte(){const l=beraterListe().map(b=>[b,mandanten(b,S.my).length]).filter(([b,n])=>n||b.bz).sort((a,b)=>b[0].bz-a[0].bz||b[1]-a[1]).slice(0,10);
  return`<div class="card" style="margin-top:14px"><h3>Kontakte zu Beratern</h3>${l.length?`<div class="tw"><table><thead><tr><th>Berater</th><th>Profil</th><th class="num">Beziehung</th><th class="num">Mandanten bei dir</th><th></th></tr></thead><tbody>${l.map(([b,n])=>`<tr><td>${esc(b.n)}</td><td>${esc(BERATER_PROFIL[b.prof])}</td><td class="num">${b.bz>0?'+':''}${b.bz}</td><td class="num">${n}</td><td><button onclick="beraterEinladen(${b.id})"${lzAus('berater')}>Einladen</button></td></tr>`).join('')}</tbody></table></div>`:'<p class="dim">Noch keine Kontakte.</p>'}${lzHinweis('berater')}
    <p class="dim">Gute Beziehungen senken Forderungen (−2 % je 20 Punkte), ab +${RBE.beziehung.tippsAb} gibt es Tipps, ab +${RBE.beziehung.erstzugriffAb} Angebote vor allen anderen und eine Warnung, bevor ein Mandant woanders unterschreibt. Zügige, faire Abschlüsse helfen, drei abgelehnte Runden schaden. Ohne Kontakt verblasst die Beziehung jede Saison um ein Viertel. Einladung: ${fmt(RBE.einladung.kosten)} (mit VIP-Loge ${fmt(RBE.einladung.kostenLoge)}), einmal im Monat.</p></div>`;}
