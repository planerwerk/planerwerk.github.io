// Kopiert das Spiel (index.html, css, js, daten, schrift) nach desktop/spiel/, damit die App es mitnimmt. Tests, Konzepte und Werkzeuge bleiben draußen.
// Aufruf: node kopieren.js (läuft automatisch vor npm start und npm run installer).
const fs=require('fs');const path=require('path');
const quelle=path.resolve(__dirname,'..'),ziel=path.join(__dirname,'spiel');
fs.rmSync(ziel,{recursive:true,force:true});fs.mkdirSync(ziel,{recursive:true});
const nimm=['index.html','css','js','daten','schrift'],ohne=/\.(pl|md)$/;
let n=0;
function kopiere(von,nach){const st=fs.statSync(von);
  if(st.isDirectory()){fs.mkdirSync(nach,{recursive:true});for(const x of fs.readdirSync(von))kopiere(path.join(von,x),path.join(nach,x));return;}
  if(ohne.test(von))return;fs.copyFileSync(von,nach);n++;}
for(const x of nimm)kopiere(path.join(quelle,x),path.join(ziel,x));
console.log(`${n} Dateien nach ${path.relative(process.cwd(),ziel)||'.'} kopiert`);
