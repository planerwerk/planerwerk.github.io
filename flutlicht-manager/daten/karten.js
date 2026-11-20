// Katalog der Ereigniskarten (K30 §3.1, §5.5, U12d). Wächst mit den Konzepten (Abschnitt 8 jedes Konzepts).
// Felder: id, titel, bereich (Konzept), art 'info' oder 'entscheidung', gross (große Entscheidung, sonst klein), stufe (haeufig, gelegentlich, selten, sehrSelten, REGELN.karten.seltenheit),
// ausloeser (Name einer Prüfung in js/karten.js, AUSLOESER), sperrTage (sonst REGELN.karten.sperrTage), texte (Varianten, reihum; Platzhalter {spieler}, {verein}, {praesident}),
// optionen (bei Entscheidungen 2–3, bei Infos höchstens eine ohne Text): {text, wirkung: [{art, wert, chance?, gut?, schlecht?}], folge (Text danach)}, auto (Index der Voreinstellung).
// Erlaubte Wirkungen (K30 §3.2): stimmung (beteiligter Spieler), stimmungAlle, zusammenhalt, glaub, vertrauen, ruf, bezDu (beteiligter Verein), geld (Euro, Buchung „Ereignisse“).
// Mit chance: Die Wirkung tritt nur mit dieser Wahrscheinlichkeit ein, sonst gilt der Wert in schlecht. Die Texte gut und schlechtText beschreiben den Ausgang.
const KARTEN=[
  {id:'praesidentMischtSich',titel:'Der Präsident mischt sich ein',bereich:'K28',art:'entscheidung',gross:false,stufe:'haeufig',ausloeser:'praesidentSerie',
    texte:['Drei Niederlagen in Folge. Der Präsident ruft an: Er will {spieler} am Wochenende in der Startelf sehen.',
      'Der Präsident steht nach dem Training am Platz: „Warum spielt eigentlich {spieler} nicht?“ Drei Niederlagen machen ihn ungeduldig.'],
    optionen:[{text:'Er bekommt seine Chance',wirkung:[{art:'vertrauen',wert:5},{art:'glaub',wert:-3}],folge:'Der Präsident ist zufrieden. In der Kabine hat man mitbekommen, wer hier aufstellt.'},
      {text:'Ich stelle auf, nicht der Präsident',wirkung:[{art:'vertrauen',wert:-5},{art:'glaub',wert:3}],folge:'Der Präsident legt verärgert auf. Die Mannschaft rechnet dir das hoch an.'}],auto:1},
  {id:'rueckendeckung',titel:'Rückendeckung vom Vorstand',bereich:'K28',art:'info',stufe:'haeufig',ausloeser:'rueckendeckung',
    texte:['Der Vorstand stellt sich öffentlich hinter dich: Trotz der Tabelle glaubt man an deinen Weg.','„Der Trainer hat unser volles Vertrauen“, sagt der Präsident, und diesmal meint er es.']},
  {id:'versoehnung',titel:'Versöhnung',bereich:'K17',art:'entscheidung',gross:false,stufe:'haeufig',ausloeser:'versoehnung',sperrTage:365,
    texte:['Der Sportdirektor von {verein} meldet sich. Die Funkstille der letzten Monate schadet beiden. Ein Treffen?'],
    optionen:[{text:'Treffen vorschlagen',wirkung:[{art:'bezDu',wert:20,chance:0.6,schlecht:-5,gut:'Das Treffen war gut. Mit {verein} kann man wieder reden.',schlechtText:'Das Treffen endet im Streit.'}]},
      {text:'Abwarten',wirkung:[],folge:'Du lässt die Sache ruhen.'}],auto:1},
  {id:'hochzeit',titel:'Ein Spieler heiratet',bereich:'K14',art:'entscheidung',gross:false,stufe:'haeufig',ausloeser:'hochzeit',sperrTage:2000,
    texte:['{spieler} heiratet am Wochenende und lädt die ganze Mannschaft ein. Ein Teamausflug zur Feier?','Hochzeit im Kader: {spieler} gibt seiner Freundin das Jawort. Die Jungs fragen, ob alle hindürfen.'],
    optionen:[{text:'Teamausflug zur Feier',wirkung:[{art:'geld',wert:-20000},{art:'zusammenhalt',wert:3},{art:'stimmung',wert:5}],folge:'Ein schöner Abend. Die Mannschaft rückt zusammen.'},
      {text:'Glückwunschkarte vom Verein',wirkung:[{art:'stimmung',wert:2}],folge:'{spieler} freut sich über die Karte.'}],auto:1},
  {id:'geheimtipp',titel:'Geheimtipp',bereich:'K18',art:'info',stufe:'haeufig',ausloeser:'geheimtipp',sperrTage:365,
    texte:['Ein Bekannter aus dem Unterhaus schwärmt von {spieler} bei {verein}: „Den musst du dir anschauen.“','Am Rande eines Testspiels hört man den Namen {spieler} ({verein}) immer wieder.']}
];
