// Pressekonferenzen (K29 §3.4, §5.4, §11, U17a): erfundene Medien und Journalisten, Fragen je Anlass, Antworten je Art, Schlagzeilen je Art.
// Alle Texte sind eigene Texte. Keine echten Zitate, keine echten Personen (K29 §12 Nr. 3).
// Platzhalter: {verein} dein Verein, {gegner} der nächste Gegner, {spieler} ein Spieler, {platz} Tabellenplatz, {serie} Länge der Serie, {trainer} dein Name, {liga} deine Liga.
// Frage: t Text, o [Antwort ＋, Antwort −, Antwort ○], sp: die Frage nennt einen Spieler (braucht {spieler}).
const PRESSE={
  medien:{
    boulevard:{name:'Tagesblitz',art:'Boulevard',reich:5},
    fach:{name:'Ballwoche',art:'Fachblatt',reich:4},
    tv:{name:'Sportkanal Eins',art:'Fernsehen',reich:5},
    portal:{name:'Netztribüne',art:'Portal',reich:3},
    lokal:{name:'Lokalbote',art:'Lokalzeitung',reich:2}},
  journalisten:[
    {n:'Ralf Kessler',m:'boulevard'},{n:'Sandra Pohl',m:'boulevard'},{n:'Petra Lindner',m:'fach'},{n:'Jochen Brandt',m:'fach'},
    {n:'Aylin Demir',m:'tv'},{n:'Sven Rohde',m:'tv'},{n:'Mareike Fuchs',m:'portal'},{n:'Holger Vogt',m:'lokal'},{n:'Tomasz Nowak',m:'lokal'}],
  arten:{
    rueckendeckung:{name:'Rückendeckung',ton:'＋'},ankuendigung:{name:'Kampfansage',ton:'＋'},
    kritikTeam:{name:'Kritik an der Mannschaft',ton:'−'},kritikSpieler:{name:'Kritik am Spieler',ton:'−'},kritikSchiri:{name:'Kritik am Schiedsrichter',ton:'−'},
    angriffMedien:{name:'Angriff auf die Medien',ton:'−'},provokation:{name:'Provokation',ton:'−'},
    floskel:{name:'Floskel',ton:'○'},humor:{name:'Humor',ton:'○'},ausraster:{name:'Ausraster',ton:'!'}},
  anlaesse:{
    antritt:{name:'Antrittspressekonferenz',fragen:[
      {t:'Was hat Sie an {verein} gereizt?',o:['ankuendigung','angriffMedien','floskel']},
      {t:'Ihr Vorgänger ist hier gescheitert. Warum sollte es bei Ihnen anders laufen?',o:['ankuendigung','angriffMedien','humor']},
      {t:'Wie lautet Ihr Ziel für diese Saison?',o:['ankuendigung','provokation','floskel']},
      {t:'Kennen Sie die Mannschaft überhaupt schon?',o:['rueckendeckung','kritikTeam','humor']},
      {t:'Die Fans erwarten viel. Halten Sie dem Druck stand?',o:['ankuendigung','angriffMedien','humor']}]},
    auftakt:{name:'Pressekonferenz zum Saisonauftakt',fragen:[
      {t:'Wie gut ist die Mannschaft nach der Vorbereitung?',o:['rueckendeckung','kritikTeam','floskel']},
      {t:'Viele sehen {verein} eher im Mittelfeld. Ärgert Sie das?',o:['ankuendigung','angriffMedien','humor']},
      {t:'Zum Auftakt geht es gegen {gegner}. Was erwarten Sie?',o:['ankuendigung','provokation','floskel']},
      {t:'Wo sehen Sie noch Lücken im Kader?',o:['rueckendeckung','kritikTeam','floskel']},
      {t:'Was ist am Ende der Saison ein Erfolg?',o:['ankuendigung','angriffMedien','floskel']}]},
    derby:{name:'Pressekonferenz vor dem Derby',fragen:[
      {t:'Morgen ist Derby gegen {gegner}. Ist das ein Spiel wie jedes andere?',o:['ankuendigung','provokation','floskel']},
      {t:'Die Fans von {gegner} lachen schon über Ihre Abwehr. Was sagen Sie dazu?',o:['rueckendeckung','provokation','humor']},
      {t:'Wer gewinnt das Derby?',o:['ankuendigung','provokation','humor']},
      {t:'Ihre Mannschaft wirkte zuletzt nervös. Hält sie diesem Druck stand?',o:['rueckendeckung','kritikTeam','floskel']},
      {t:'Haben Sie Respekt vor {gegner}?',o:['floskel','provokation','humor']}]},
    spitze:{name:'Pressekonferenz vor dem Spitzenspiel',fragen:[
      {t:'Erster gegen Verfolger, oder umgekehrt: Wie wichtig ist das Spiel gegen {gegner}?',o:['ankuendigung','provokation','floskel']},
      {t:'Ist {verein} schon ein Titelkandidat?',o:['ankuendigung','angriffMedien','humor']},
      {t:'Was macht {gegner} so stark?',o:['floskel','provokation','humor']},
      {t:'Können Ihre Spieler mit diesem Druck umgehen?',o:['rueckendeckung','kritikTeam','floskel']}]},
    pokal:{name:'Pressekonferenz vor dem Pokalspiel',fragen:[
      {t:'Wie weit soll es im Pokal noch gehen?',o:['ankuendigung','angriffMedien','floskel']},
      {t:'Der Pokal hat seine eigenen Gesetze. Was heißt das für morgen gegen {gegner}?',o:['ankuendigung','provokation','floskel']},
      {t:'Werden Sie rotieren?',o:['rueckendeckung','kritikTeam','humor']},
      {t:'Wie viel ist Ihnen das Finale in Berlin wert?',o:['ankuendigung','angriffMedien','humor']}]},
    relegation:{name:'Pressekonferenz vor der Relegation',fragen:[
      {t:'Zwei Spiele entscheiden über eine ganze Saison. Wie gehen Sie damit um?',o:['rueckendeckung','kritikTeam','floskel']},
      {t:'Wer ist der Favorit gegen {gegner}?',o:['ankuendigung','provokation','floskel']},
      {t:'Was sagen Sie den Fans vor diesem Spiel?',o:['ankuendigung','angriffMedien','humor']}]},
    krise:{name:'Pressekonferenz in der Krise',fragen:[
      {t:'{serie} Niederlagen in Folge. Erreichen Sie die Mannschaft noch?',o:['rueckendeckung','kritikTeam','floskel']},
      {t:'{spieler} wirkte zuletzt völlig neben der Spur. Spielt er am Wochenende?',o:['rueckendeckung','kritikSpieler','floskel'],sp:1},
      {t:'Liegt es auch am Schiedsrichter? Letzte Woche gab es strittige Szenen.',o:['floskel','kritikSchiri','humor']},
      {t:'Woran hat es gelegen?',o:['rueckendeckung','kritikTeam','floskel']},
      {t:'Die Presse schreibt schon über Ihre Nachfolger. Wie gehen Sie damit um?',o:['rueckendeckung','angriffMedien','humor']},
      {t:'Haben Sie noch das Vertrauen des Vorstands?',o:['rueckendeckung','angriffMedien','floskel']}]},
    ultimatum:{name:'Pressekonferenz nach dem Ultimatum',fragen:[
      {t:'Der Vorstand hat Ihnen ein Ultimatum gestellt. Ist das Ihr letztes Spiel?',o:['ankuendigung','angriffMedien','floskel']},
      {t:'Was muss sich ändern, damit Sie bleiben?',o:['rueckendeckung','kritikTeam','floskel']},
      {t:'Hat die Mannschaft gegen Sie gespielt?',o:['rueckendeckung','kritikTeam','humor']},
      {t:'Fühlen Sie sich fair behandelt?',o:['floskel','kritikSchiri','humor']}]},
    hoehenflug:{name:'Pressekonferenz im Höhenflug',fragen:[
      {t:'{serie} Siege in Folge. Was ist das Geheimnis?',o:['rueckendeckung','kritikTeam','humor']},
      {t:'Werden Sie nicht langsam übermütig?',o:['ankuendigung','angriffMedien','humor']},
      {t:'Welcher Spieler hat Sie am meisten überrascht?',o:['rueckendeckung','kritikTeam','floskel']},
      {t:'Wie lange hält diese Serie noch?',o:['ankuendigung','angriffMedien','floskel']}]},
    fuehrung:{name:'Pressekonferenz als Tabellenführer',fragen:[
      {t:'{verein} steht ganz oben. Ist das schon mehr als eine Momentaufnahme?',o:['ankuendigung','angriffMedien','floskel']},
      {t:'Die Konkurrenz sagt, Sie hatten bisher Glück. Was sagen Sie dazu?',o:['rueckendeckung','provokation','humor']},
      {t:'Reden Sie in der Kabine über die Tabelle?',o:['rueckendeckung','kritikTeam','humor']},
      {t:'Wollen Sie oben bleiben?',o:['ankuendigung','provokation','floskel']}]},
    kantersieg:{name:'Pressekonferenz nach dem Kantersieg',fragen:[
      {t:'Was für ein Ergebnis. Ist Ihre Mannschaft so gut, oder war der Gegner so schwach?',o:['rueckendeckung','provokation','humor']},
      {t:'Gibt es trotzdem etwas zu kritisieren?',o:['rueckendeckung','kritikTeam','floskel']},
      {t:'Waren Sie zufrieden mit {spieler}?',o:['rueckendeckung','kritikSpieler','floskel'],sp:1}]},
    urteil:{name:'Pressekonferenz nach dem Urteil',fragen:[ // K29g: Sperre eines deiner Spieler ab RPK.anlass.urteilAb Spielen. Kritik am Urteil wirkt wie Schiedsrichterkritik (Geldstrafe möglich)
      {t:'Das Sportgericht sperrt {spieler}. Ist das Urteil gerecht?',o:['rueckendeckung','kritikSchiri','floskel'],sp:1},
      {t:'Hat {spieler} der Mannschaft mit dieser Aktion geschadet?',o:['rueckendeckung','kritikSpieler','floskel'],sp:1},
      {t:'Wie wollen Sie den Ausfall von {spieler} auffangen?',o:['rueckendeckung','humor','floskel'],sp:1},
      {t:'Haben Sie mit {spieler} schon gesprochen?',o:['rueckendeckung','kritikSpieler','humor'],sp:1},
      {t:'Wird im Verein jetzt über Disziplin geredet?',o:['ankuendigung','kritikTeam','floskel']}]},
    wechselwunsch:{name:'Pressekonferenz zum Wechselwunsch',fragen:[
      {t:'{spieler} will weg. Lassen Sie ihn gehen?',o:['rueckendeckung','kritikSpieler','floskel'],sp:1},
      {t:'Haben Sie mit {spieler} gesprochen?',o:['rueckendeckung','kritikSpieler','floskel'],sp:1},
      {t:'Ist das ein Zeichen, dass es in der Kabine nicht stimmt?',o:['rueckendeckung','angriffMedien','floskel']},
      {t:'Wer ersetzt {spieler}, wenn er geht?',o:['rueckendeckung','kritikSpieler','humor'],sp:1}]},
    geruecht:{name:'Pressekonferenz zu den Gerüchten',fragen:[ // U17b
      {t:'Laut {medium} will {spieler} den Verein verlassen. Stimmt das?',o:['rueckendeckung','kritikSpieler','floskel'],sp:1},
      {t:'{medium} berichtet von Interesse anderer Vereine an {spieler}. Verkaufen Sie?',o:['rueckendeckung','angriffMedien','floskel'],sp:1},
      {t:'Was sagen Sie zu den Berichten über Ihre Zukunft?',o:['ankuendigung','angriffMedien','humor'],trainer:1},
      {t:'Woher kommen diese Geschichten?',o:['floskel','angriffMedien','humor']},
      {t:'Gibt es Unruhe in der Kabine?',o:['rueckendeckung','kritikTeam','floskel']}]},
    abwerben:{name:'Pressekonferenz nach dem aufgeflogenen Treffen',fragen:[
      {t:'Sie haben sich heimlich mit {spieler} getroffen. Was sagen Sie dazu?',o:['ankuendigung','angriffMedien','floskel'],sp:1},
      {t:'Der andere Verein ist verärgert. Entschuldigen Sie sich?',o:['rueckendeckung','provokation','humor']},
      {t:'Ist so ein Vorgehen fair?',o:['floskel','angriffMedien','humor']}]}},
  antworten:{
    rueckendeckung:['Ich stehe voll hinter meiner Mannschaft. Wer gegen sie schießt, schießt gegen mich.','Die Jungs geben jeden Tag alles. Das sehe ich im Training, und das zählt.','{spieler} hat mein volles Vertrauen. Punkt.'],
    ankuendigung:['Wir fahren da nicht hin, um zu verlieren. Wir holen die drei Punkte.','Merken Sie sich das Datum. Am Ende reden alle über {verein}.','Wir haben einen Plan, und der heißt: gewinnen.'],
    kritikTeam:['So reicht das nicht. Einige müssen sich fragen, ob sie verstanden haben, wo sie spielen.','Das war zu wenig. Zu wenig Laufbereitschaft, zu wenig Mut, zu wenig von allem.','Ich erwarte mehr. Von jedem Einzelnen.'],
    kritikSpieler:['{spieler} weiß selbst, dass das nicht gut war. Er muss liefern, sonst spielt ein anderer.','Ich habe mit {spieler} gesprochen. Deutlich.','{spieler} ist im Moment nicht bei hundert Prozent. Mehr sage ich dazu nicht.'],
    kritikSchiri:['Wenn so etwas gepfiffen wird, brauchen wir uns über Fußball nicht mehr zu unterhalten.','Der Schiedsrichter hatte heute einen schwarzen Tag, und wir zahlen dafür.','Ich habe die Szene zehnmal gesehen. Das war nie im Leben ein Foul.'],
    angriffMedien:['Sie schreiben doch sowieso, was Sie wollen. Dann brauchen Sie mich auch nicht zu fragen.','Diese Frage ist eine Frechheit. Haben Sie das Spiel überhaupt gesehen?','Ich lese das nicht mehr. Meine Spieler auch nicht.'],
    provokation:['{gegner} redet viel. Wir lassen den Ball sprechen.','Vor {gegner} habe ich so viel Respekt wie vor dem Wetter von gestern.','Die sollen sich mal warm anziehen. Wir kommen.'],
    floskel:['Wir schauen von Spiel zu Spiel.','Die Mannschaft ist intakt, wir arbeiten weiter und dann sehen wir.','Am Ende zählt nur das Ergebnis. Und das Ergebnis zählt am Ende.'],
    humor:['Ich würde ja antworten, aber mein Pressesprecher schaut so streng.','Wenn ich das wüsste, hätte ich einen besseren Job.','Fragen Sie mich das nächste Woche noch einmal. Dann weiß ich es auch.'],
    ausraster:['Jetzt hören Sie mir mal zu! Seit Wochen derselbe Unsinn! Ich stelle mich hier nicht mehr hin und lasse mir das gefallen!','Wissen Sie was? Schreiben Sie doch, was Sie wollen! Aber nicht über meine Mannschaft! Ende!','Das ist doch alles Theater hier! Theater! Ich gehe jetzt trainieren!']},
  schlagzeilen:{
    rueckendeckung:{m:'lokal',t:['{trainer} stellt sich vor die Mannschaft','Rückendeckung für {spieler}']},
    ankuendigung:{m:'tv',t:['{trainer} kündigt den Sieg gegen {gegner} an','Große Worte bei {verein}']},
    kritikTeam:{m:'boulevard',t:['{trainer} rechnet mit seiner Mannschaft ab','Klartext bei {verein}: „So reicht das nicht“']},
    kritikSpieler:{m:'boulevard',t:['{trainer} watscht {spieler} ab','Trainer gegen {spieler}: Zoff bei {verein}']},
    kritikSchiri:{m:'boulevard',t:['{trainer} tobt über den Schiedsrichter','Schiri-Ärger bei {verein}']},
    angriffMedien:{m:'portal',t:['{trainer} legt sich mit der Presse an','Dünnhäutig: {trainer} geht auf Reporter los']},
    provokation:{m:'boulevard',t:['{trainer} stichelt gegen {gegner}','Kampfansage mit Spitze: {trainer} provoziert {gegner}']},
    floskel:{m:'fach',t:['Viel gesagt, nichts verraten: {trainer} bleibt vage','Pressekonferenz bei {verein}: die üblichen Sätze']},
    humor:{m:'tv',t:['Lacher bei {verein}: {trainer} in Plauderlaune','{trainer} nimmt es mit Humor']},
    ausraster:{m:'boulevard',t:['WUTREDE! {trainer} explodiert','Ausraster bei {verein}: {trainer} verlässt das Podium']},
    delegiert:{m:'fach',t:['Ohne den Chef: Co-Trainer spricht für {verein}','{trainer} schickt den Co-Trainer']}},
  // Medienprofile der Computer-Trainer (K29 §7, K29e). Sticheleien vor Topspielen: Platzhalter {verein} dein Verein. Frage dazu: {gtrainer} Trainer des Gegners, {zitat} seine Stichelei.
  // Antworten auf die Frage: gelassen (Humor), kontern (Provokation), ignorieren (Floskel).
  profile:{diplomatisch:{name:'diplomatisch',text:'lobt jeden Gegner und sagt wenig'},floskel:{name:'Floskelkönig',text:'redet viel und sagt nichts'},
    laut:{name:'Lautsprecher',text:'große Worte vor großen Spielen'},psycho:{name:'Psychospieler',text:'stichelt gezielt gegen deine Spieler'}},
  sticheleien:{
    laut:['Wir fahren da hin, um zu gewinnen. Alles andere interessiert uns nicht.','Bei allem Respekt: {verein} ist für uns kein Maßstab.','Die sollen erst einmal zeigen, dass sie mit uns mithalten können.'],
    psycho:['Ich höre, bei {verein} ist die Stimmung nicht die beste. Das wird man morgen sehen.','Wenn {verein} früh hinten liegt, kippt das Spiel. Das wissen die auch.','Die Abwehr von {verein} wackelt, wenn man sie unter Druck setzt.']},
  // Sticheleien unter Computer-Trainern (K29m, Prüfung FB8): ohne „morgen“ und ohne „hinfahren“, weil das Spiel bis zu 7 Tage entfernt ist und der Heimtrainer zuerst spricht
  kiSticheleien:{
    laut:['Gegen {verein} wollen wir gewinnen, alles andere interessiert uns nicht.','Bei allem Respekt: {verein} ist für uns kein Maßstab.','{verein} soll erst einmal zeigen, dass sie mit uns mithalten können.'],
    psycho:['Ich höre, bei {verein} ist die Stimmung nicht die beste. Das wird man im Spiel sehen.','Wenn {verein} früh hinten liegt, kippt das Spiel. Das wissen die auch.','Die Abwehr von {verein} wackelt, wenn man sie unter Druck setzt.']},
  stichelFrage:['{gtrainer} hat über Ihre Mannschaft gesagt: „{zitat}“ Was entgegnen Sie?','Ihr Kollege {gtrainer} meint: „{zitat}“ Ihre Antwort?'],
  // Pressekonferenz nach dem Urteil (K29g, K29h): die Antwortart Schiedsrichterkritik heißt dort „Kritik am Urteil“, mit eigenen Texten und eigener Schlagzeile (Prüfung DR5)
  urteil:{name:'Kritik am Urteil',antworten:['Dieses Urteil ist ein Witz. {spieler} hat den Ball gespielt, das sieht jeder.','Wir akzeptieren das, aber verstehen tun wir es nicht. Das ist viel zu hart.','Andere bekommen für dasselbe ein Spiel. Bei uns sind es gleich mehrere. Das muss man sich fragen.'],
    schlagzeile:{m:'boulevard',t:['{trainer} schießt gegen das Sportgericht','Urteil gegen {spieler}: {trainer} tobt']}},
  // Interviews deiner Spieler (K29 §6, K29i): Platzhalter {spieler}, {verein}
  spielerInterview:{gut:['{spieler} lobt im Interview den Zusammenhalt bei {verein}.','{spieler} spricht im Fernsehen über seine Ziele mit {verein}. Die Fans hören es gern.','{spieler} gibt sich im Interview bescheiden und hungrig.'],
    schlecht:['{spieler} plaudert im Interview über Ärger in der Kabine.','{spieler} sagt im Interview, er fühle sich bei {verein} nicht wertgeschätzt.','{spieler} lästert im Interview über die Taktik.']},
  // Interview am Spielfeldrand (K29 §4.1, K29f): eine Frage je Ergebnis, Platzhalter {gegner}, {ergebnis} (aus deiner Sicht). Antworten: Rückendeckung, Kritik an der Mannschaft, Floskel.
  spielfeldrand:{sieg:['{ergebnis} gegen {gegner}. Was war heute der Schlüssel?','Ein verdienter Sieg gegen {gegner}?','{ergebnis}. Wie fühlt sich das an?'],
    remis:['{ergebnis} gegen {gegner}. Zufrieden mit dem Punkt?','Ein Punkt gegen {gegner}. Gewonnen oder verloren?'],
    niederlage:['{ergebnis} gegen {gegner}. Woran hat es gelegen?','Woran hat’s gelegen?','Was fehlt Ihrer Mannschaft nach dem {ergebnis}?'],
    offen:['{ergebnis} gegen {gegner}. Wie bewerten Sie das?','Unentschieden gegen {gegner}. Können Sie damit leben?']}, // Remis außerhalb der Liga (Hinspiel), seit Prüfung DR3
  // Gerüchteküche (K29 §4.3, §5.5, U17b). Platzhalter: {verein} betroffener Verein, {klub} zweiter Verein, {spieler}, {coach} Trainer des betroffenen Vereins.
  // m: Medien, die so etwas bringen (das erste ist am wahrscheinlichsten).
  geruechte:{
    verhandlung:{m:['fach','lokal','tv'],t:['{klub} verhandelt mit {verein} über {spieler}','Gespräche zwischen {klub} und {verein}: Es geht um {spieler}']},
    liste:{m:['fach','portal'],t:['{verein} würde {spieler} abgeben','{spieler} darf {verein} verlassen']},
    unzufrieden:{m:['lokal','boulevard'],t:['{spieler} ist bei {verein} unzufrieden','Frust bei {spieler}: Er fühlt sich bei {verein} nicht mehr wohl']},
    interesse:{m:['boulevard','portal','tv'],t:['Mehrere Vereine wollen {spieler} von {verein}','Wettrennen um {spieler}: Gleich drei Klubs sind dran']},
    trainer:{m:['tv','boulevard','fach'],t:['{coach} wackelt bei {verein}','Bei {verein} wird es eng für {coach}']},
    aerger:{m:['boulevard','portal'],t:['Ärger zwischen {verein} und {klub}','Eiszeit: {verein} und {klub} reden nicht mehr miteinander']},
    thema:{m:['boulevard','portal','lokal'],t:['{spieler} soll bei {klub} ein Thema sein','Bei {klub} fällt immer öfter der Name {spieler}']}, /* Klatsch (K17 §5.3, K17d) */
    absprung:{m:['boulevard','portal'],t:['{spieler} vor dem Absprung bei {verein}','Insider: {spieler} hat {verein} schon abgeschrieben']},
    trainerAus:{m:['boulevard','portal'],t:['{coach} vor dem Aus bei {verein}','Erste Kandidaten für die Nachfolge von {coach} gehandelt']}}};
