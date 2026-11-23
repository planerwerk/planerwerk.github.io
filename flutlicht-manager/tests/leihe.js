// Leihe, Profis in der Zweiten, Medizincheck (K08 §5.5, §12 Nr. 29, K19 §4.3, §5.5, U10d): Verleihen nur im Fenster und an Vereine mit Bedarf, Gehaltsanteil nach Bereitschaft,
// Gehalt, Einsatzgarantie, Rückruf, Rückkehr und Kaufoption zum Saisonende, Ausleihen nur von Reservisten, Profis in die Zweite (Vertrag bleibt, mit 24 zurück), Medizincheck.
// Aufruf: node tests/leihe.js [Seed=5]. Nur Node.js.
const {neueWelt,saisons}=require('./sim');
const SEED=+(process.argv[2]||5),probleme=[],t0=Date.now();
const pruef=(ok,text,wert)=>{console.log(`${ok?'✓':'✗'} ${text}${wert!=null?': '+wert:''}`);if(!ok)probleme.push(text+(wert!=null?' ('+wert+')':''));};
const welt=(id=9)=>{const {W,F}=neueWelt();F.buildWorld(SEED);const S=W.S,ev=W.ev;S.my=id;S.mgr='Test';F.setTarget();F.sponsOffers();F.sponsorWaehlen(0);S.lineup=F.bestXI(id,ev('myT()').form);return{W,F,S,ev,t:ev('myT()'),L:ev('RLE')};};

// 1. Verleihen: nur im Fenster, nur an Vereine mit Bedarf, höchstens der Gehaltsanteil, den der Verein zahlen will. Danach spielt er dort, du zahlst den Rest seines Gehalts.
{const {S,ev,L}=welt();const p=ev('squad')(S.my).filter(q=>q.pos==='MF').sort((a,b)=>a.str-b.str)[0],V=ev('leihVereine')(p),t=V[0],zb=ev('zahlBereit')(p,t.id);
  S.tag=100;const zu=ev('verleihen')(p,{tid:t.id,anteil:0,rolle:'rotation'});S.tag=10;const zuviel=zb<1?ev('verleihen')(p,{tid:t.id,anteil:1,rolle:'rotation'}):'x';const ohne=S.teams.find(x=>x.id!==S.my&&x.lg<=3&&!V.includes(x));const keinBedarf=ohne?ev('verleihen')(p,{tid:ohne.id,anteil:0}):'x';
  const g0=ev('leiheGehaelter()'),f=ev('verleihen')(p,{tid:t.id,anteil:zb,rolle:'rotation',rueckruf:true});
  pruef(zu&&zu.includes('Transferfenster')&&zuviel&&keinBedarf&&!f&&p.team===t.id&&p.leihe.von===S.my&&!ev('squad')(S.my).includes(p)&&Math.abs(ev('leiheGehaelter()')-g0-p.sal*(1-zb))<1,
    'Verleihen: nur im Fenster, nur an Vereine mit Bedarf und bis zum Gehaltsanteil, den sie zahlen wollen; danach zahlst du den Rest',`${p.n} zu ${t.name}, Anteil ${zb}`);
  // Einsatzgarantie: nach acht Wochen unter der Vereinbarung gibt es eine Meldung, einmal
  p.ea=0.05;S.tag+=L.pruefAbWochen*7;ev('leiheWoche')(S.tag);ev('leiheWoche')(S.tag);const meld=S.news.filter(n=>n.t.includes('hält die Absprache nicht')).length;
  pruef(meld===1,'Einsatzgarantie: Hält der Leihverein die Absprache nicht, kommt nach acht Wochen eine Meldung (einmal)');
  // Rückruf im Winterfenster, wenn vereinbart
  S.tag=150;const r1=ev('zurueckholen')(p);S.tag=184;const r2=ev('zurueckholen')(p);pruef(r1&&!r2&&p.team===S.my&&!p.leihe,'Rückruf: nur im Winterfenster und nur, wenn vereinbart');}

// 2. Saisonende: Rückkehr, Kaufoption, wenn sie für den Leihverein günstig ist
{const {S,ev,t}=welt();const sq=ev('squad')(S.my),a=sq.filter(q=>q.pos==='MF').sort((x,y)=>x.str-y.str)[0],b=sq.filter(q=>q.pos==='AB').sort((x,y)=>x.str-y.str)[0];S.tag=10;
  const ta=ev('leihVereine')(a)[0],tb=ev('leihVereine')(b)[0];ev('verleihen')(a,{tid:ta.id,anteil:0});ev('verleihen')(b,{tid:tb.id,anteil:0,option:Math.round(ev('vwKauf')(b,tb.id)*0.5/25000)*25000});tb.cash=5e8;const c0=t.cash,opt=b.leihe.option;
  ev('leiheEnde')();pruef(a.team===S.my&&!a.leihe&&b.team===tb.id&&!b.leihe&&t.cash===c0+opt,'Saisonende: Der eine kommt zurück, beim anderen zieht der Leihverein die günstige Kaufoption',`Option ${opt} €`);}

// 3. Ausleihen: nur Reservisten, er will bei dir mindestens Rotation sein, du zahlst sein Gehalt, zum Saisonende geht er zurück
{const {S,ev}=welt();S.tag=10;const fremd=S.pl.filter(q=>q.team>=0&&q.team!==S.my);const stamm=fremd.find(q=>['stamm','schluessel'].includes(ev('kaderRolle')(q)));
  const res=fremd.find(q=>['ergaenzung','talent'].includes(ev('kaderRolle')(q))&&ev('einsatzSchaetzung')(q,S.my)>=0.45),bank=fremd.find(q=>['ergaenzung','talent'].includes(ev('kaderRolle')(q))&&ev('einsatzSchaetzung')(q,S.my)<0.45);
  const fs=ev('ausleihen')(stamm),fb=bank?ev('ausleihen')(bank):'x',von=res.team,fr=ev('ausleihen')(res);
  pruef(fs&&fb&&!fr&&res.team===S.my&&res.leihe.von===von&&ev('squad')(S.my).includes(res),'Ausleihen: Stammspieler gibt kein Verein ab, wer bei dir auf der Bank säße, will nicht, ein Reservist mit Aussicht auf Rotation kommt',res.n);
  ev('leiheEnde')();pruef(res.team===von&&!res.leihe,'Ausleihen: Zum Saisonende geht er zurück');}

// 4. Profis in die Zweite: bis 23, Vertrag und Gehalt bleiben, Spielpraxis, zurück mit Vertrag, mit 24 automatisch zurück
{const {S,F,ev,L}=welt();const sq=ev('squad')(S.my),jung=sq.find(q=>q.age<=L.zweiteBis),alt=sq.find(q=>q.age>L.zweiteBis);const ct=jung.ct,sal=jung.sal,g0=ev('leiheGehaelter()');
  const fa=ev('inDieZweite')(alt),fj=ev('inDieZweite')(jung);
  pruef(fa&&!fj&&jung.team===-4&&jung.zwP===1&&!S.pl.includes(jung)&&ev('zweiteKader()').includes(jung)&&ev('leiheGehaelter()')===g0+sal,'In die Zweite: nur bis 23, er behält Vertrag und Gehalt (zahlst du weiter)',jung.n);
  ev('mitStrom')(ev('strom')('zw',1),()=>F.zweiteWoche(S.tag));pruef(jung.sp>=60||jung.sp===ev('RZ').praxis.rest,'In der Zweiten sammelt er Spielpraxis',`Spielpraxis ${jung.sp}`);
  F.zweiteAufruecken(jung.id);pruef(jung.team===S.my&&jung.ct===ct&&jung.sal===sal&&!jung.zwP,'Zurück zu den Profis: mit seinem alten Vertrag');
  ev('inDieZweite')(jung);jung.age=L.zweiteBis;jung.ct=3;S.zwErg=null;ev('mitStrom')(ev('strom')('zw',2),()=>F.zweiteSaison());pruef(jung.team===S.my&&jung.ct===2,'Mit 24 kehrt er automatisch zurück, der Vertrag läuft weiter',`Vertrag ${jung.ct}`);}

// 5. Medizincheck (K19 §5.5): 5.000 € je Kauf. Bei einem Befund sinkt die Ablöse um 10 bis 30 %, abgeschlossen wird erst mit dem zweiten Klick.
{const {S,F,ev,t,L}=welt();const doc=ev('document');t.cash=5e8;S.tag=10;const kand=S.pl.filter(q=>q.team>=0&&q.team!==S.my&&q.age<29).sort((a,b)=>b.str-a.str);
  const kauf=(p)=>{['vt_sal','vt_hg','vt_a','vt_p','vt_t','vt_z','vt_ak','vt_lk'].forEach(k=>doc.getElementById(k).value='');doc.getElementById('fee').value=String(ev('askPrice')(p)/1e6);doc.getElementById('yrs').value='3';doc.getElementById('msg').textContent='';F.offer(p.id);return doc.getElementById('msg').textContent;};
  const krank=kand.find(q=>{q.inj=20;const fee0=ev('askPrice')(q),m=kauf(q);if(!m.includes('Medizincheck')){q.inj=0;return false;}q.fee0=fee0;return true;});
  const fee1=krank&&ev('verhandlungVon')(krank).einig.fee,a=krank&&ev('medizinAbschlag')(krank),mc=-(S.fin['Medizincheck']||0);const m2=krank?kauf(krank):'';
  pruef(krank&&a>=L.medizin.abschlag[0]&&a<=L.medizin.abschlag[1]&&Math.abs(fee1-krank.fee0*(1-a))<=25000&&mc===L.medizin.kosten&&krank.team===S.my,'Medizincheck: Befund bei einem Verletzten, Ablöse 10 bis 30 % niedriger, Kosten 5.000 €, Abschluss mit dem zweiten Klick',krank&&`${krank.n}, −${Math.round(a*100)} %`);
  const gesund=kand.find(q=>q!==krank&&q.inj<=0&&!ev('medizinBefund')(q)&&!kauf(q).includes('kein Interesse')&&q.team===S.my);pruef(!!gesund,'Medizincheck ohne Befund: Der Kauf geht mit einem Klick durch',gesund&&gesund.n);}

// 6. Zwei Saisons im Ablauf mit Leihen: ohne Fehler, alle zurück oder per Kaufoption weg
{const fehler=[];let geliehen=0;
  saisons({n:2,seed:SEED,verein:9,beiSaisonstart:(S,F)=>{const ev=F;},beiSaisonende:S=>{const l=S.pl.filter(p=>p.leihe);geliehen+=l.length;l.forEach(p=>{if(p.leihe.von===p.team)fehler.push('Leihe beim eigenen Verein');});}});
  pruef(!fehler.length,'Zwei Saisons: keine kaputten Leihen',fehler[0]||null);}

// Prüfung EP2 (K19e): Ein eigener verliehener Spieler mit vielen Spielen für dich, der zum Saisonende zurückkommt, ist keine „Rückkehr des verlorenen Sohns“: keine Meldung, keine Fanstimmung.
{const {S,ev,t}=welt();const KZ=ev('KZ'),a=ev('squad')(S.my).filter(q=>q.pos==='MF').sort((x,y)=>x.str-y.str)[0],z=[];S.tag=10;
  z[KZ.s]=S.season-1;z[KZ.tid]=S.my;z[KZ.lg]=t.lg;z[KZ.sp]=ev('RFS').ident.lieblingSpiele+10;z[KZ.min]=5000;for(let i=0;i<=KZ.mw;i++)if(z[i]==null)z[i]=0;a.kar=[z];
  const ta=ev('leihVereine')(a)[0];ev('verleihen')(a,{tid:ta.id,anteil:0});const fu0=t.fanU||0;ev('leiheEnde')();
  const meldung=S.news.some(x=>String(x.t).includes(a.n+' kehrt zurück'));
  pruef(a.team===S.my&&ev('heimkehrer')(a)&&!meldung&&(t.fanU||0)===fu0,'Leihe zurück: keine Heimkehr-Freude für einen eigenen Spieler (EP2)',`zurück ${a.team===S.my}, Heimkehrer ${ev('heimkehrer')(a)}, Meldung ${meldung}, Umfeld ${fu0} → ${t.fanU}`);}

console.log(`\nin ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.join('\n')||'keine'));process.exit(probleme.length?1:0);
