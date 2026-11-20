// Stilprüfung des Codes: Ein Kommentar mit // am Zeilenende darf keinen Code verschlucken. Der Fehler ist dreimal passiert (Konsistenzprüfung AX12, BD13, BF8):
// Eine Anweisung, die hinter „// Kommentar“ auf derselben Zeile steht, wird nie ausgeführt. Geprüft wird grob: Steht nach dem Kommentar ein Semikolon oder eine
// schließende Klammer, gefolgt von etwas, das wie Code aussieht (Aufruf, Zuweisung, if, const), gilt die Zeile als verdächtig. Texte in Anführungszeichen werden übersprungen.
// Aufruf: node tests/code.js. Nur Node.js.
const fs=require('fs'),path=require('path');const ROOT=path.resolve(__dirname,'..'),probleme=[];
const dateien=[...fs.readdirSync(path.join(ROOT,'js')).map(f=>'js/'+f),...fs.readdirSync(path.join(ROOT,'tests')).map(f=>'tests/'+f),'daten/regeln.js'].filter(f=>f.endsWith('.js'));
// Position des ersten // außerhalb von Zeichenketten, Template-Strings und regulären Ausdrücken (grob, zeilenweise)
function kommentarStart(z){let q=null;for(let i=0;i<z.length;i++){const c=z[i];if(q){if(c==='\\'){i++;continue;}if(c===q)q=null;continue;}
  if(c==='"'||c==="'"||c==='`'){q=c;continue;}if(c==='/'&&z[i+1]==='/'){if(i>0&&z[i-1]===':')continue;return i;}if(c==='/'&&z[i+1]==='*'){const e=z.indexOf('*/',i+2);if(e<0)return -1;i=e+1;continue;}}return -1;}
const codeNachKommentar=/[;})]\s*(if\(|else\b|const |let |return\b|for\(|[A-Za-z_$][\w$.]*\s*\(|[A-Za-z_$][\w$.\[\]]*\s*=[^=>])/;
dateien.forEach(f=>{const zeilen=fs.readFileSync(path.join(ROOT,f),'utf8').split('\n');let inTemplate=false;
  zeilen.forEach((z,n)=>{const anz=(z.match(/`/g)||[]).length;const war=inTemplate;if(anz%2)inTemplate=!inTemplate;if(war)return; // mehrzeilige Templates (HTML) überspringen
    const i=kommentarStart(z);if(i<0)return;const rest=z.slice(i+2);if(codeNachKommentar.test(rest))probleme.push(`${f}:${n+1}: ${z.trim().slice(0,140)}`);});});
console.log(probleme.length?probleme.join('\n'):'✓ Kein Kommentar am Zeilenende verschluckt Code');
console.log('\nPROBLEME ('+probleme.length+')\n'+(probleme.length?'Kommentar am Zeilenende vor Code':'keine'));process.exit(probleme.length?1:0);
