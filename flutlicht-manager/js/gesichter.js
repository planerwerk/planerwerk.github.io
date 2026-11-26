// Spielergesichter (K39 §3.2, W5e5): Comic-Gesicht aus einem Baukasten, fest an den Spieler gebunden (Name und Nation, in jeder Karriere gleich).
// Teile: Kopfform, Ohren, Augen, Brauen, Nase, Mund, Frisur, Bart, Trikot in der Vereinsfarbe. Haut- und Haarfarbe nach Herkunftsregion gewichtet
// (daten/aussehen.js, deine Vorgabe vom 18.11.), graue Haare und Geheimratsecken mit dem Alter. Frisuren und Bärte hängen nicht von der Herkunft ab.
// Kein Porträt echter Personen: nur grobe, gewürfelte Merkmale (PLAN §4, § 22 KUG). Ohne Spielzufall: alle Würfe aus hash32, keine Wirkung aufs Spiel.
// Rein dekorativ (aria-hidden), der Name steht immer daneben.
const gesichtWurf=(p,m)=>mix32(hash32(`gesicht|${p.n}|${p.nat||''}|${m}`),7)/4294967296; // nachgemischt, sonst hängen die Merkmale zusammen (Prüfung FX1)
const gesichtWahl=(u,w)=>{const s=w.reduce((a,b)=>a+b,0);let x=u*s;for(let i=0;i<w.length;i++){x-=w[i];if(x<0)return i;}return w.length-1;};
const gesichtRegion=nat=>{const R=AUSSEHEN.region;for(const k in R)if((' '+R[k]+' ').includes(' '+nat+' '))return k;return'welt';};
const gesichtMisch=(hex,f)=>{const m=/^#([0-9a-f]{6})$/i.exec(hex||'');if(!m)return hex;return'#'+[0,2,4].map(i=>Math.round(parseInt(m[1].substr(i,2),16)*(1-f)).toString(16).padStart(2,'0')).join('');};
// Frisuren: Name und Grundgewicht; ab 30 Jahren werden Glatze und Geheimratsecken wahrscheinlicher
const FRISUREN=[['kahl',3],['stoppel',10],['kurz',22],['scheitel',14],['tolle',10],['locken',9],['afro',6],['lang',6],['dutt',3],['geheimrats',4],['irokese',2],['undercut',13]];
function gesicht(p,px=56){if(!p||typeof AUSSEHEN==='undefined')return'';
  const A=AUSSEHEN,reg=A.regionen[gesichtRegion(p.nat)]||A.regionen.welt,u=m=>gesichtWurf(p,m),r=(m,a,b)=>+(a+(b-a)*u(m)).toFixed(1),alter=p.age||25;
  const hi=gesichtWahl(u('haut'),reg.haut),haut=A.haut[hi],hautD=gesichtMisch(haut,0.14),linie=gesichtMisch(haut,0.38);
  const grau=alter>=A.grauAb&&u('grau')<(alter-A.grauAb+1)*A.grauJeJahr,haar=grau?A.grau:A.haar[gesichtWahl(u('haar'),reg.haar)];
  const tm=p.team>=0&&p.team<1000&&S.teams[p.team]?S.teams[p.team].col:'#5a6b85';
  const w=r('w',26,31),h=r('h',33,38),cy=58,top=cy-h,unten=cy+h,kn=0.62-0.22*u('kinn');
  const kopf=`M50 ${top}C${50+w*1.1} ${top} ${50+w} ${cy+h*0.35} ${+(50+w*kn).toFixed(1)} ${+(cy+h*0.82).toFixed(1)}Q50 ${unten+3} ${+(50-w*kn).toFixed(1)} ${+(cy+h*0.82).toFixed(1)}C${50-w} ${cy+h*0.35} ${50-w*1.1} ${top} 50 ${top}Z`;
  // Frisur
  const fw=FRISUREN.map(([k,g])=>g+(alter>=30&&(k==='kahl'||k==='geheimrats')?8:0)),fr=FRISUREN[gesichtWahl(u('frisur'),fw)][0];
  const kappe=(yf,schlaefe,deck)=>`<path d="M${+(50-w*1.02).toFixed(1)} ${+(cy-h*schlaefe).toFixed(1)}C${+(50-w*1.08).toFixed(1)} ${+(top-h*0.25).toFixed(1)} ${+(50+w*1.08).toFixed(1)} ${+(top-h*0.25).toFixed(1)} ${+(50+w*1.02).toFixed(1)} ${+(cy-h*schlaefe).toFixed(1)}C${+(50+w*0.75).toFixed(1)} ${yf} ${+(50-w*0.75).toFixed(1)} ${yf} ${+(50-w*1.02).toFixed(1)} ${+(cy-h*schlaefe).toFixed(1)}Z" fill="${haar}"${deck<1?` fill-opacity="${deck}"`:''}/>`;
  const yf=+(cy-h*0.45).toFixed(1);let hinten='',vorne='';
  if(fr==='stoppel')vorne=kappe(yf,0.2,0.45);
  else if(fr==='kurz')vorne=kappe(yf,0.2,1);
  else if(fr==='scheitel')vorne=kappe(yf,0.2,1)+`<ellipse cx="${+(50-w*0.35).toFixed(1)}" cy="${yf}" rx="${+(w*0.6).toFixed(1)}" ry="5" fill="${haar}"/>`;
  else if(fr==='tolle')vorne=kappe(yf,0.2,1)+`<ellipse cx="${+(50+w*0.15).toFixed(1)}" cy="${+(top-h*0.1).toFixed(1)}" rx="${+(w*0.62).toFixed(1)}" ry="${+(h*0.22).toFixed(1)}" fill="${haar}"/>`;
  else if(fr==='locken'){vorne=kappe(yf,0.2,1);for(let i=0;i<7;i++){const a=(200+i*23.3)*Math.PI/180;vorne+=`<circle cx="${+(50+w*1.0*Math.cos(a)).toFixed(1)}" cy="${+(cy-h*0.35+h*0.75*Math.sin(a)).toFixed(1)}" r="6.5" fill="${haar}"/>`;}}
  else if(fr==='afro'){hinten=`<ellipse cx="50" cy="${+(cy-h*0.45).toFixed(1)}" rx="${+(w*1.35).toFixed(1)}" ry="${+(h*0.95).toFixed(1)}" fill="${haar}"/>`;vorne=kappe(yf,0.2,1);}
  else if(fr==='lang'){const seite=s=>`<path d="M${+(50+s*w*1.05).toFixed(1)} ${+(cy-h*0.3).toFixed(1)}L${+(50+s*w*1.12).toFixed(1)} ${+(cy+h*0.95).toFixed(1)}L${+(50+s*w*0.7).toFixed(1)} ${+(cy+h*0.95).toFixed(1)}L${+(50+s*w*0.75).toFixed(1)} ${+(cy-h*0.1).toFixed(1)}Z" fill="${haar}"/>`;hinten=seite(-1)+seite(1);vorne=kappe(yf,0.2,1);}
  else if(fr==='dutt')vorne=kappe(yf,0.2,1)+`<circle cx="50" cy="${+(top-h*0.22).toFixed(1)}" r="8" fill="${haar}"/>`;
  else if(fr==='geheimrats')vorne=kappe(+(cy-h*0.8).toFixed(1),0.25,1);
  else if(fr==='irokese')vorne=kappe(yf,0.2,0.3)+`<rect x="45" y="${+(top-h*0.3).toFixed(1)}" width="10" height="${+(h*0.75).toFixed(1)}" rx="5" fill="${haar}"/>`;
  else if(fr==='undercut')vorne=kappe(yf,0.2,0.4)+kappe(+(cy-h*0.6).toFixed(1),0.45,1);
  // Gesicht
  const ey=+(cy-1+r('ey',-2,2)).toFixed(1),ex=+(w*r('ex',0.36,0.44)).toFixed(1),es=r('es',3.4,4.6),ef=r('ef',0.55,0.95),ew=+(es+1.6).toFixed(1);
  const pup=hi<=2&&u('aug')<0.35?(u('aug2')<0.6?'#3d6e9c':'#4f7a4f'):'#2b1d14',pr=+Math.min(2.4,ew*ef*0.85).toFixed(1);
  const auge=x=>`<ellipse cx="${x}" cy="${ey}" rx="${ew}" ry="${+(ew*ef).toFixed(1)}" fill="#ffffff"/><circle cx="${x}" cy="${ey}" r="${pr}" fill="${pup}"/>`;
  const by=+(ey-r('bd',6,9)).toFixed(1),bl=r('bl',5,7),bt=r('bt',-2.5,2.5),bw=r('bw',1.8,3.4);
  const braue=s=>`<path d="M${+(50+s*(ex+bl)).toFixed(1)} ${+(by+bt*0.3).toFixed(1)}L${+(50+s*(ex-bl)).toFixed(1)} ${+(by-bt).toFixed(1)}" stroke="${haar}" stroke-width="${bw}" stroke-linecap="round"/>`;
  const ny=+(cy+r('nl',8,13)).toFixed(1),nw=r('nw',2.5,5),nt=Math.floor(u('nt')*4);
  const nase=nt===0?`<path d="M50 ${ey+3}L${+(50-nw).toFixed(1)} ${ny}L50 ${+(ny+1).toFixed(1)}" fill="none" stroke="${linie}" stroke-width="1.8" stroke-linejoin="round"/>`
    :nt===1?`<path d="M${+(50-nw).toFixed(1)} ${ny}Q50 ${+(ny+3).toFixed(1)} ${+(50+nw).toFixed(1)} ${ny}" fill="none" stroke="${linie}" stroke-width="1.8" stroke-linecap="round"/>`
    :nt===2?`<path d="M50 ${ey+3}L50 ${ny}M${+(50-nw).toFixed(1)} ${+(ny+1).toFixed(1)}h1.5M${+(50+nw-1.5).toFixed(1)} ${+(ny+1).toFixed(1)}h1.5" fill="none" stroke="${linie}" stroke-width="1.8" stroke-linecap="round"/>`
    :`<circle cx="50" cy="${ny}" r="${+(nw*0.6).toFixed(1)}" fill="${linie}" fill-opacity=".55"/>`;
  const my=+(cy+h*0.55+r('my',-1,2)).toFixed(1),mw=r('mw',5,9),ms=r('ms',-1.5,4);
  const mund=`<path d="M${+(50-mw).toFixed(1)} ${my}Q50 ${+(my+ms).toFixed(1)} ${+(50+mw).toFixed(1)} ${my}" fill="none" stroke="#7a3b32" stroke-width="${r('mt',1.8,3)}" stroke-linecap="round"/>`;
  let bart='';if(alter>=19&&u('bart')<0.38){const bt2=Math.floor(u('bartart')*3);
    const kinnBart=`M${+(50-w*0.95).toFixed(1)} ${cy+4}C${+(50-w*0.9).toFixed(1)} ${+(cy+h*0.7).toFixed(1)} ${+(50-w*0.5).toFixed(1)} ${unten} 50 ${unten+1}C${+(50+w*0.5).toFixed(1)} ${unten} ${+(50+w*0.9).toFixed(1)} ${+(cy+h*0.7).toFixed(1)} ${+(50+w*0.95).toFixed(1)} ${cy+4}C${+(50+w*0.6).toFixed(1)} ${+(cy+h*0.55).toFixed(1)} ${+(50-w*0.6).toFixed(1)} ${+(cy+h*0.55).toFixed(1)} ${+(50-w*0.95).toFixed(1)} ${cy+4}Z`;
    bart=bt2===0?`<path d="${kinnBart}" fill="${haar}" fill-opacity=".28"/>`:bt2===1?`<path d="${kinnBart}" fill="${haar}" fill-opacity=".9"/>`
      :`<path d="M${+(50-mw-1).toFixed(1)} ${+(my-2).toFixed(1)}Q50 ${+(my-6).toFixed(1)} ${+(50+mw+1).toFixed(1)} ${+(my-2).toFixed(1)}Q50 ${+(my-3).toFixed(1)} ${+(50-mw-1).toFixed(1)} ${+(my-2).toFixed(1)}Z" fill="${haar}"/>`;}
  const hals=`<rect x="${+(50-w*0.42).toFixed(1)}" y="${+(cy+h*0.6).toFixed(1)}" width="${+(w*0.84).toFixed(1)}" height="22" fill="${hautD}"/>`;
  const sy=unten+4,trikot=`<path d="M8 120C10 102 30 ${sy} 50 ${sy}C70 ${sy} 90 102 92 120Z" fill="${tm}"/><path d="M42 ${sy}L50 ${sy+8}L58 ${sy}" fill="none" stroke="#ffffff" stroke-opacity=".7" stroke-width="2"/>`;
  const ohren=`<ellipse cx="${+(50-w+1).toFixed(1)}" cy="${cy+2}" rx="4.5" ry="7" fill="${hautD}"/><ellipse cx="${+(50+w-1).toFixed(1)}" cy="${cy+2}" rx="4.5" ry="7" fill="${hautD}"/>`;
  return`<svg class="gs" viewBox="0 0 100 120" width="${px}" height="${Math.round(px*1.2)}" aria-hidden="true" focusable="false">${trikot}${hals}${hinten}${ohren}<path d="${kopf}" fill="${haut}"/>${bart}${mund}${nase}${auge(+(50-ex).toFixed(1))}${auge(+(50+ex).toFixed(1))}${braue(-1)}${braue(1)}${vorne}</svg>`;}
