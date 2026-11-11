// Vor- und Nachnamen für erfundene Spieler (Nachwuchs, Vereinslose, aufgefüllte Kaderplätze).
const VORNAMEN="Lukas Jonas Leon Finn Paul Felix Noah Elias Luca Tim Jan Niklas Moritz Julian Max Tom David Marvin Kevin Dennis Marco Robin Fabian Philipp Simon Florian Tobias Sebastian Dominik Patrick Erik Malte Jannik Yannick Can Emre Mert Arda Kerem Ilias Amin Karim Youssef Moussa Ibrahima Mamadou Ousmane Kofi Kwame Mateo Luis Diego Rafael Bruno João Tiago Mats Jesper Kasper Oskar Aleksandar Luka Marko Ivan Nikola Filip Jakub Kacper Mikkel Sander Ryo Kenta Lars Henrik Ole Bastian Johannes Valentin Benedikt Leandro Samuel Joel Nils Hannes Timo Kilian Lennard".split(' ');
const NACHNAMEN="Müller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Hoffmann Koch Richter Klein Wolf Schröder Neumann Schwarz Zimmermann Braun Krüger Hartmann Lange Werner Krause Lehmann Köhler Herrmann König Walter Huber Kaiser Fuchs Peters Scholz Möller Weiß Jung Hahn Vogel Friedrich Keller Günther Berger Winkler Roth Beck Lorenz Baumann Franke Albrecht Schuster Ludwig Böhm Winter Kraus Schumacher Krämer Vogt Stein Jäger Otto Sommer Seidel Heinrich Haas Schreiber Graf Dietrich Ziegler Kuhn Pohl Engel Horn Busch Bergmann Voigt Sauer Arnold Pfeiffer Yılmaz Kaya Demir Şahin Çelik Öztürk Aydın Diallo Traoré Koné Mensah Asante Owusu Silva Santos Pereira Costa Novak Kovač Horvat Petrović Jovanović Nowak Kowalski Larsen Nielsen Hansen Andersen Johansson Lindqvist Dahl Bakker Visser Janssen Peeters Dubois Moreau Laurent Tanaka Sato Okafor Hadžić Gashi Krasniqi Berisha".split(' ');

// Herkunft der fremdsprachigen Nachnamen oben (K03, U9b): Daraus leitet das Spiel die Nationalität erfundener Spieler der deutschen Vereine ab.
// Wer einen dieser Namen trägt, spielt mit der Chance aus REGELN.welt.nation für dieses Land, sonst für Deutschland. Alle anderen Nachnamen gelten als deutsch.
const NACHNAMEN_HERKUNFT={TUR:"Yılmaz Kaya Demir Şahin Çelik Öztürk Aydın",SEN:"Diallo",MLI:"Traoré",CIV:"Koné",GHA:"Mensah Asante Owusu",NGA:"Okafor",POR:"Silva Santos Pereira Costa",
  CZE:"Novak",CRO:"Kovač Horvat",SRB:"Petrović Jovanović",BIH:"Hadžić",POL:"Nowak Kowalski",DEN:"Larsen Nielsen Hansen Andersen",SWE:"Johansson Lindqvist",NOR:"Dahl",
  NED:"Bakker Visser Janssen",BEL:"Peeters",FRA:"Dubois Moreau Laurent",JPN:"Tanaka Sato",KVX:"Gashi Krasniqi Berisha"};

// Namen für erzeugte Spieler der Auslandsvereine (K32 §3.1, U9b): je Namensraum Vornamen (v) und Nachnamen (n), getrennt mit Komma.
// Es sind häufige Vor- und Nachnamen, das Spiel würfelt sie zusammen. Übereinstimmungen mit echten Personen sind Zufall.
const NAMEN={
  en:{v:"James,Jack,Harry,Oliver,George,Charlie,Thomas,Callum,Liam,Ryan,Ben,Luke,Joe,Lewis,Connor,Jamie,Kyle,Aaron,Nathan,Ethan,Mason,Tyler,Reece,Declan,Morgan,Owen",
      n:"Smith,Jones,Taylor,Brown,Wilson,Evans,Walker,Wright,Robinson,Thompson,White,Hughes,Edwards,Green,Hall,Wood,Harris,Clarke,Jackson,Turner,Hill,Cooper,Ward,Morris,Baker,Bennett,Carter,Mitchell,Parker,Shaw,Murphy,Kelly,Campbell,Stewart,Reid"},
  es:{v:"Alejandro,Pablo,Sergio,Javier,Carlos,Álvaro,Adrián,Daniel,Marcos,Iker,Hugo,Mario,Rubén,Diego,Jorge,Raúl,Iván,Miguel,Gonzalo,Nicolás,Santiago,Matías,Facundo,Emiliano,Joaquín,Rodrigo",
      n:"García,Fernández,González,Rodríguez,López,Martínez,Sánchez,Pérez,Gómez,Martín,Jiménez,Ruiz,Hernández,Moreno,Muñoz,Álvarez,Romero,Navarro,Torres,Domínguez,Vázquez,Ramos,Gil,Serrano,Blanco,Molina,Castro,Ortega,Rubio,Suárez,Medina,Herrera,Acosta,Rojas"},
  it:{v:"Luca,Marco,Andrea,Matteo,Lorenzo,Alessandro,Davide,Simone,Federico,Francesco,Gabriele,Riccardo,Nicolò,Stefano,Giovanni,Antonio,Tommaso,Pietro,Emanuele,Daniele,Filippo,Samuele,Michele,Giacomo",
      n:"Rossi,Russo,Ferrari,Esposito,Bianchi,Romano,Colombo,Ricci,Marino,Greco,Bruno,Gallo,Conti,De Luca,Mancini,Costa,Giordano,Rizzo,Lombardi,Moretti,Barbieri,Fontana,Santoro,Mariani,Rinaldi,Caruso,Ferrara,Galli,Martini,Leone,Longo,Gentile,Vitale,Pellegrini"},
  fr:{v:"Lucas,Hugo,Théo,Nathan,Enzo,Louis,Jules,Maxime,Antoine,Baptiste,Clément,Quentin,Romain,Julien,Alexis,Yanis,Rayan,Ibrahim,Moussa,Sofiane,Adrien,Florian,Mathis,Valentin",
      n:"Martin,Bernard,Dubois,Thomas,Robert,Richard,Petit,Durand,Leroy,Moreau,Simon,Laurent,Lefebvre,Michel,Garcia,David,Bertrand,Roux,Vincent,Fournier,Morel,Girard,André,Mercier,Dupont,Lambert,Bonnet,François,Legrand,Garnier,Faure,Rousseau,Blanc,Guérin"},
  nl:{v:"Daan,Sem,Lars,Luuk,Thijs,Jesse,Bram,Tim,Stijn,Ruben,Sven,Niels,Jordy,Kevin,Rick,Mees,Finn,Milan,Joris,Wout,Jens,Robin,Noah,Mats,Arne,Lennert",
      n:"de Jong,Jansen,de Vries,van den Berg,van Dijk,Bakker,Janssen,Visser,Smit,Meijer,de Boer,Mulder,de Groot,Bos,Vos,Peters,Hendriks,van Leeuwen,Dekker,Brouwer,de Wit,Dijkstra,Smits,de Graaf,van der Meer,Peeters,Maes,Jacobs,Mertens,Willems,Claes,Goossens,Wouters"},
  pt:{v:"João,Pedro,Tiago,Diogo,Rui,Miguel,André,Bruno,Gonçalo,Rafael,Ricardo,Nuno,Francisco,Tomás,Bernardo,Duarte,Gabriel,Lucas,Matheus,Guilherme,Felipe,Thiago,Caio,Renan,Danilo",
      n:"Silva,Santos,Ferreira,Pereira,Oliveira,Costa,Rodrigues,Martins,Sousa,Fernandes,Gonçalves,Gomes,Lopes,Marques,Alves,Almeida,Ribeiro,Pinto,Carvalho,Teixeira,Moreira,Correia,Mendes,Nunes,Soares,Vieira,Monteiro,Cardoso,Rocha,Neves,Coelho,Cruz,Barbosa,Araújo,Lima"},
  tr:{v:"Emre,Can,Mert,Burak,Arda,Kerem,Ozan,Yusuf,Ahmet,Mehmet,Mustafa,Hakan,Cenk,Oğuz,Berkay,Furkan,Umut,Enes,Deniz,Barış,Halil,Kaan,Tolga,Serdar,Onur",
      n:"Yılmaz,Kaya,Demir,Şahin,Çelik,Yıldız,Yıldırım,Öztürk,Aydın,Özdemir,Arslan,Doğan,Kılıç,Aslan,Çetin,Kara,Koç,Kurt,Özkan,Şimşek,Polat,Korkmaz,Güneş,Aktaş,Bulut,Turan,Güler,Tekin,Avcı"},
  de:{v:"Lukas,Florian,David,Michael,Daniel,Stefan,Thomas,Fabian,Marco,Dominik,Philipp,Manuel,Patrick,Simon,Raphael,Noah,Luca,Elias,Jonas,Julian,Kevin,Sandro,Remo,Silvan,Nico",
      n:"Gruber,Huber,Bauer,Wagner,Pichler,Steiner,Moser,Mayer,Hofer,Leitner,Berger,Fuchs,Eder,Schmid,Winkler,Weber,Schwarz,Maier,Reiter,Brunner,Meier,Keller,Frei,Baumann,Zimmermann,Gerber,Bühler,Graf,Wyss,Roth,Kunz,Lang,Egger,Wimmer,Aigner"},
  da:{v:"Mikkel,Rasmus,Frederik,Magnus,Emil,Oliver,Mathias,Kasper,Jonas,Andreas,Anders,Simon,Victor,Oscar,Jesper,Tobias,Nikolaj,Christian",
      n:"Jensen,Nielsen,Hansen,Pedersen,Andersen,Christensen,Larsen,Sørensen,Rasmussen,Jørgensen,Petersen,Madsen,Kristensen,Olsen,Thomsen,Poulsen,Knudsen,Mortensen"},
  sv:{v:"Gustav,Erik,Isak,Ludvig,Albin,Oscar,Elias,Anton,Viktor,Filip,Axel,Hugo,Linus,Simon,Jesper,Sebastian,Emil,Carl",
      n:"Johansson,Andersson,Karlsson,Nilsson,Eriksson,Larsson,Olsson,Persson,Svensson,Gustafsson,Lindberg,Lindström,Bergström,Lundgren,Axelsson,Holm,Sandberg,Nyström"},
  no:{v:"Sander,Henrik,Kristian,Martin,Magnus,Jonas,Mathias,Andreas,Tobias,Ole,Lars,Håkon,Sondre,Eirik,Marius,Emil,Fredrik,Vegard",
      n:"Hansen,Johansen,Olsen,Larsen,Andersen,Pedersen,Nilsen,Kristiansen,Jensen,Karlsen,Haugen,Solberg,Dahl,Lund,Bakken,Strand,Halvorsen,Berg"},
  pl:{v:"Jakub,Kacper,Mateusz,Piotr,Kamil,Bartosz,Michał,Paweł,Tomasz,Krzysztof,Adam,Dawid,Filip,Szymon,Jan,Maciej,Patryk,Wojciech",
      n:"Nowak,Kowalski,Wiśniewski,Wójcik,Kowalczyk,Kamiński,Zieliński,Szymański,Woźniak,Dąbrowski,Kozłowski,Jankowski,Mazur,Kwiatkowski,Krawczyk,Piotrowski,Grabowski,Pawłowski,Michalski,Król"},
  cs:{v:"Tomáš,Lukáš,Ondřej,Martin,Petr,Vojtěch,Matěj,David,Daniel,Patrik,Jakub,Adam,Filip,Michal,Jan,Marek,Dominik,Štěpán",
      n:"Novák,Svoboda,Novotný,Dvořák,Černý,Procházka,Kučera,Veselý,Horák,Němec,Marek,Pospíšil,Hájek,Král,Jelínek,Růžička,Beneš,Fiala,Sedláček,Kolář"},
  bks:{v:"Luka,Marko,Ivan,Nikola,Filip,Stefan,Aleksandar,Petar,Josip,Ante,Mateo,Dario,Mario,Milan,Dušan,Nemanja,Vuk,Lazar,Uroš,Miloš,Bojan,Darko,Igor,Tin,Roko,Duje",
       n:"Horvat,Kovačević,Babić,Marić,Jurić,Kovač,Knežević,Vuković,Marković,Petrović,Jovanović,Nikolić,Đorđević,Ilić,Pavlović,Stojanović,Popović,Lukić,Tomić,Perić,Matić,Božić,Šimić,Radić,Milošević,Stanković,Savić,Kostić,Živković"},
  uk:{v:"Oleksandr,Andrij,Serhij,Dmytro,Mykola,Wolodymyr,Artem,Bohdan,Denys,Jewhen,Maksym,Roman,Taras,Wiktor,Illja,Oleh,Wladyslaw,Danylo,Jurij",
      n:"Schewtschenko,Kowalenko,Bondarenko,Tkatschenko,Krawtschenko,Melnyk,Kowaltschuk,Bojko,Olijnyk,Lyssenko,Martschenko,Rudenko,Sawtschenko,Petrenko,Moros,Sydorenko,Pawlenko,Kusmenko,Romanenko,Polischtschuk"},
  af:{v:"Mamadou,Ibrahima,Moussa,Ousmane,Cheikh,Abdoulaye,Amadou,Sékou,Youssouf,Boubacar,Lamine,Idrissa,Souleymane,Wilfried,Serge,Franck,Yves,Christian,Cédric,Arsène",
      n:"Diallo,Traoré,Koné,Coulibaly,Touré,Camara,Keita,Sylla,Diop,Ndiaye,Fall,Sow,Ba,Cissé,Konaté,Sangaré,Ouattara,Bamba,Kouassi,Mbemba,Ngoma,Etoundi,Doumbia,Sissoko,Diarra,Fofana"},
  ae:{v:"Kofi,Kwame,Emmanuel,Samuel,Daniel,Chidera,Victor,Kelechi,Joseph,Isaac,Michael,Ebenezer,Abdul,Sadiq,Taiwo,Chukwudi,Kwabena,Yaw",
      n:"Mensah,Asante,Owusu,Boateng,Appiah,Okafor,Eze,Adeyemi,Okonkwo,Balogun,Amoah,Agyemang,Ofori,Nwosu,Okoro,Adebayo,Bello,Lawal"},
  ja:{v:"Ryo,Kenta,Yuto,Haruki,Sota,Daiki,Takumi,Kaito,Ren,Shota,Yuki,Hiroto,Riku,Kosei,Taiga,Yuma",
      n:"Tanaka,Sato,Suzuki,Takahashi,Watanabe,Ito,Yamamoto,Nakamura,Kobayashi,Kato,Yoshida,Yamada,Sasaki,Matsumoto,Inoue,Kimura,Hayashi,Shimizu,Mori,Ikeda"},
  ar:{v:"Youssef,Amine,Karim,Ilias,Sofiane,Bilal,Hamza,Ayoub,Zakaria,Anas,Mehdi,Nabil,Achraf,Walid,Rachid,Omar,Mohamed,Yassine,Adam",
      n:"Amrani,Benali,Bouzid,Haddad,Mansouri,Ziani,Belkacem,Saidi,Tahiri,Idrissi,Cherif,Hamdi,Bennani,Alaoui,Chaoui,Boukhari,Khelifi,Meziane,Lahlou"}
};
// Welcher Namensraum zu welcher Nation gehört. Nationen ohne Eintrag bekommen die allgemeine Liste oben (VORNAMEN, NACHNAMEN).
const NAMEN_NATION={ENG:'en',SCO:'en',WAL:'en',IRL:'en',NIR:'en',USA:'en',AUS:'en',CAN:'en',ESP:'es',ARG:'es',URU:'es',COL:'es',MEX:'es',CHI:'es',PAR:'es',ECU:'es',
  ITA:'it',FRA:'fr',NED:'nl',BEL:'nl',POR:'pt',BRA:'pt',ANG:'pt',TUR:'tr',AUT:'de',SUI:'de',DEN:'da',SWE:'sv',NOR:'no',POL:'pl',CZE:'cs',SVK:'cs',
  CRO:'bks',SRB:'bks',BIH:'bks',MNE:'bks',SVN:'bks',UKR:'uk',SEN:'af',CIV:'af',MLI:'af',CMR:'af',GUI:'af',BFA:'af',COD:'af',NGA:'ae',GHA:'ae',JPN:'ja',MAR:'ar',ALG:'ar',TUN:'ar',EGY:'ar'};
