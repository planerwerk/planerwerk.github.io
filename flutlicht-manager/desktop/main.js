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
// Schreiben: erst in eine neue Datei, dann umbenennen, die bisherige bleibt als .vorher. Antwort true oder false.
ipcMain.on('speicher-schreiben',(e,k,v)=>{try{const f=datei(k),neu=f+'.neu';fs.writeFileSync(neu,String(v),'utf8');if(fs.existsSync(f))fs.copyFileSync(f,f+'.vorher');fs.renameSync(neu,f);e.returnValue=true;}catch(err){e.returnValue=false;}});
ipcMain.on('speicher-ort',e=>{try{e.returnValue=ordner();}catch(err){e.returnValue='';}});

function fenster(){
  const w=new BrowserWindow({width:1280,height:900,minWidth:360,minHeight:600,title:'Flutlicht Manager',backgroundColor:'#0d1626',autoHideMenuBar:true,
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true,spellcheck:false}});
  w.loadFile(path.join(__dirname,'spiel','index.html'));
  // Links nach draußen (Quellen, Hilfe) öffnen im normalen Browser, das Spielfenster bleibt beim Spiel.
  w.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\//.test(url))shell.openExternal(url);return{action:'deny'};});
  w.webContents.on('will-navigate',(ev,url)=>{if(!url.startsWith('file:')){ev.preventDefault();if(/^https:\/\//.test(url))shell.openExternal(url);}});
  return w;}

if(!app.requestSingleInstanceLock())app.quit();          // nur ein Fenster: zwei gleichzeitig würden sich den Spielstand überschreiben
else{
  app.on('second-instance',()=>{const w=BrowserWindow.getAllWindows()[0];if(w){if(w.isMinimized())w.restore();w.focus();}});
  app.whenReady().then(fenster);
  app.on('window-all-closed',()=>app.quit());}
