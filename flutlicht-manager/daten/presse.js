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
    wechselwunsch:{name:'Pressekonferenz zum Wechselwunsch',fragen:[
      {t:'{spieler} will weg. Lassen Sie ihn gehen?',o:['rueckendeckung','kritikSpieler','floskel'],sp:1},
      {t:'Haben Sie mit {spieler} gesprochen?',o:['rueckendeckung','kritikSpieler','floskel'],sp:1},
      {t:'Ist das ein Zeichen, dass es in der Kabine nicht stimmt?',o:['rueckendeckung','angriffMedien','floskel']},
      {t:'Wer ersetzt {spieler}, wenn er geht?',o:['rueckendeckung','kritikSpieler','humor'],sp:1}]},
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
    delegiert:{m:'fach',t:['Ohne den Chef: Co-Trainer spricht für {verein}','{trainer} schickt den Co-Trainer']}}};
