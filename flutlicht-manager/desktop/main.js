// Flutlicht Manager als Windows-App (Electron, 26.11.2026). Das Spiel selbst bleibt unverändert im Ordner spiel/ (kopiert von kopieren.js).
// Unterschied zum Browser: Der Spielstand liegt als Datei im Benutzerordner (%APPDATA%\Flutlicht Manager\spielstaende), ohne Größengrenze und ohne
// das Löschen nach sieben Tagen (konzepte/_luecken.md L1). Das Spiel erreicht die Dateien nur über window.flutlichtApp aus preload.js.
const {app,BrowserWindow,ipcMain,shell}=require('electron');
const path=require('path');const fs=require('fs');

if(process.env.FLUTLICHT_DATEN)app.setPath('userData',path.resolve(process.env.FLUTLICHT_DATEN)); // nur für Tests: eigener Ordner statt des Benutzerordners

const ordner=()=>{const d=path.join(app.getPath('userData'),'spielstaende');fs.mkdirSync(d,{recursive:true});return d;};
const datei=k=>{if(!/^[a-z0-9-]{1,64}$/.test(String(k)))throw new Error('ungültiger Name');return path.join(ordner(),k+'.json');};

// Lesen: Datei oder null. Ist die Datei kaputt (zum Beispiel Strom weg beim Schreiben), gilt die Sicherungskopie vom vorigen Speichern.
ipcMain.on('speicher-lesen',(e,k)=>{try{const f=datei(k);for(const x of [f,f+'.vorher']){if(!fs.existsSync(x))continue;const t=fs.readFileSync(x,'utf8');try{JSON.parse(t);e.returnValue=t;return;}catch(err){}}e.returnValue=null;}catch(err){e.returnValue=null;}});
// Schreiben (Prüfung GL7, GL8): erst die neue Datei vollständig auf die Platte (fsync), dann die bisherige zu .vorher umbenennen (nicht kopieren), dann die neue
// an ihren Platz. So ist zu jedem Zeitpunkt eine vollständige Datei da, auch bei Stromausfall. Eine leere Hauptdatei wird nicht zu .vorher, damit die letzte gute
// Kopie bleibt. Unter Windows halten Virenscanner oder Indexdienst Dateien kurz fest (EPERM, EBUSY): bis zu fünf Versuche mit kurzer Pause. Antwort true oder false.
const warte=ms=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);
const mitVersuch=fn=>{for(let i=0;;i++){try{return fn();}catch(err){if(i>=4||!['EPERM','EBUSY','EACCES'].includes(err.code))throw err;warte(60*(i+1));}}};
ipcMain.on('speicher-schreiben',(e,k,v)=>{try{const f=datei(k),neu=f+'.neu',fd=fs.openSync(neu,'w');try{fs.writeSync(fd,String(v),null,'utf8');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
  if(fs.existsSync(f)&&fs.statSync(f).size>0)mitVersuch(()=>fs.renameSync(f,f+'.vorher'));mitVersuch(()=>fs.renameSync(neu,f));e.returnValue=true;}catch(err){console.error('Spielstand nicht geschrieben:',err&&err.code);e.returnValue=false;}});
ipcMain.on('speicher-ort',e=>{try{e.returnValue=ordner();}catch(err){e.returnValue='';}});

function fenster(){
  const w=new BrowserWindow({width:1280,height:900,minWidth:360,minHeight:600,title:'Flutlicht Manager',backgroundColor:'#0d1626',autoHideMenuBar:true,
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true,spellcheck:false}});
  w.loadFile(path.join(__dirname,'spiel','index.html'));
  // Links nach draußen (Quellen, Hilfe) öffnen im normalen Browser, das Spielfenster bleibt beim Spiel.
  w.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\//.test(url))shell.openExternal(url);return{action:'deny'};});
  // Nur das Spiel selbst darf geladen werden (Prüfung GL10): Eine auf das Fenster gezogene Datei (etwa eine Spielstand-Datei) ersetzte sonst das Spiel.
  const eigen=u=>/^file:/i.test(u)&&/\/spiel\/index\.html(?:[?#].*)?$/i.test(u);
  w.webContents.on('will-navigate',(ev,url)=>{if(!eigen(url)){ev.preventDefault();if(/^https:\/\//.test(url))shell.openExternal(url);}});
  return w;}

if(!app.requestSingleInstanceLock())app.quit();          // nur ein Fenster: zwei gleichzeitig würden sich den Spielstand überschreiben
else{
  app.on('second-instance',()=>{const w=BrowserWindow.getAllWindows()[0];if(w){if(w.isMinimized())w.restore();w.focus();}});
  app.whenReady().then(fenster);
  app.on('window-all-closed',()=>app.quit());}
