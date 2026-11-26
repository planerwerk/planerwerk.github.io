// Brücke zwischen Spiel und Dateien (Desktop-App): nur Lesen und Schreiben benannter Spielstände, kein sonstiger Zugriff auf den Rechner.
// Synchron, damit save() im Spiel so bleibt, wie es ist (js/hilfen.js: speicherLesen, speicherSchreiben).
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('flutlichtApp',{
  lesen:k=>ipcRenderer.sendSync('speicher-lesen',k),
  schreiben:(k,v)=>ipcRenderer.sendSync('speicher-schreiben',k,v),
  ort:()=>ipcRenderer.sendSync('speicher-ort')
});
