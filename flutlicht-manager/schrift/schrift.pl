#!/usr/bin/perl
# Flutlicht Display (K35b §13.4, W5d): erzeugt die eigene Anzeigeschrift des Spiels als TrueType-Datei und als CSS mit eingebetteter Schrift.
# Aufruf im Ordner flutlicht-manager:  perl schrift/schrift.pl
# Ergebnis: schrift/FlutlichtDisplay.ttf (zum Ansehen und Weitergeben) und css/schrift.css (die Schrift als data-URL, damit sie auch
# per Doppelklick über file:// lädt; Chrome sperrt Schriftdateien von file:// sonst). Beide Dateien nicht von Hand ändern.
#
# Aufbau der Zeichen: ein Strichskelett auf einem Raster wie in der Look-Studie (Breite meist 56, Höhe 100, y nach unten wie in SVG),
# Strichstärke 14, Rundungen mit Radius 20 (die Acht oben 17). Jeder Strich wird zu einer gefüllten Fläche: gerade Striche zu Rechtecken,
# Bögen zu Ringstücken (quadratische Kurven, höchstens 45 Grad je Stück). An Ecken kommt eine Gehrung dazu, bis zum Zweifachen der halben
# Strichstärke, sonst eine abgeschrägte Ecke (wie stroke-miterlimit 2). Freie Enden sind stumpf. Die Flächen dürfen sich überlappen:
# TrueType füllt nach der Nonzero-Regel, das erste Flag jedes Zeichens trägt OVERLAP_SIMPLE.
# Umfang W5d1: Ziffern und Zeichen für Zahlen. Buchstaben folgen (W5d2), bis dahin kommen sie aus Saira Condensed (unicode-range im CSS).
# Lizenz der Schrift: SIL Open Font License 1.1 (vorläufig, K35b §13.4).
use strict; use warnings;
use MIME::Base64 qw(encode_base64);
use Encode qw(encode);
use POSIX qw(floor ceil);
use File::Basename qw(dirname);

my $PI=4*atan2(1,1);
my $S=7;      # Fonteinheiten je Rastereinheit (Höhe 100 → Versalhöhe 700 bei 1000 Einheiten je Geviert)
my $H=7;      # halbe Strichstärke in Rastereinheiten (Strich 14)
my $SB=40;    # Seitenabstand links und rechts in Fonteinheiten
my $K=100;    # Höhe des Rasters (Grundlinie bei y = 100)

# Zeichen: w = Breite im Raster, p = Unterpfade [geschlossen, Segmente ...]; L = Linie x1,y1,x2,y2; A = Bogen cx,cy,r,Winkel1,Winkel2
# (Winkel in Grad, gemessen wie in SVG: 0 nach rechts, 90 nach unten; der Bogen läuft vom ersten zum zweiten Winkel).
my %Z=(
  '0'=>{w=>56,p=>[[1,[A=>27,27,20,180,270],[L=>27,7,29,7],[A=>29,27,20,270,360],[L=>49,27,49,73],[A=>29,73,20,0,90],[L=>29,93,27,93],[A=>27,73,20,90,180],[L=>7,73,7,27]]]},
  '1'=>{w=>56,p=>[[0,[L=>15,21,32,7],[L=>32,7,32,93]]]},
  '2'=>{w=>56,p=>[[0,[A=>27,27,20,180,270],[L=>27,7,29,7],[A=>29,27,20,270,360],[L=>49,27,49,35],[A=>29,35,20,0,53.130102],[L=>41,51,7,93],[L=>7,93,49,93]]]},
  '3'=>{w=>56,p=>[[0,[L=>8,7,48,7],[L=>48,7,26,44],[L=>26,44,29,44],[A=>29,64,20,270,360],[L=>49,64,49,73],[A=>29,73,20,0,90],[L=>29,93,27,93],[A=>27,73,20,90,180]]]},
  '4'=>{w=>56,p=>[[0,[L=>36,93,36,7],[L=>36,7,7,64],[L=>7,64,51,64]]]},
  '5'=>{w=>56,p=>[[0,[L=>47,7,10,7],[L=>10,7,9,44],[L=>9,44,29,44],[A=>29,64,20,270,360],[L=>49,64,49,73],[A=>29,73,20,0,90],[L=>29,93,27,93],[A=>27,73,20,90,180]]]},
  '6'=>{w=>56,p=>[[0,[L=>40,7,13,50]],[1,[A=>27,64,20,180,270],[L=>27,44,29,44],[A=>29,64,20,270,360],[L=>49,64,49,73],[A=>29,73,20,0,90],[L=>29,93,27,93],[A=>27,73,20,90,180],[L=>7,73,7,64]]]},
  '7'=>{w=>56,p=>[[0,[L=>7,7,49,7],[L=>49,7,21,93]]]},
  '8'=>{w=>56,p=>[[1,[A=>27,31,17,90,180],[L=>10,31,10,24],[A=>27,24,17,180,270],[L=>27,7,29,7],[A=>29,24,17,270,360],[L=>46,24,46,31],[A=>29,31,17,0,90],[L=>29,48,27,48]],
                  [1,[L=>27,48,29,48],[A=>29,68,20,270,360],[L=>49,68,49,73],[A=>29,73,20,0,90],[L=>29,93,27,93],[A=>27,73,20,90,180],[L=>7,73,7,68],[A=>27,68,20,180,270]]]},
  '9'=>{w=>56,p=>[[1,[L=>49,27,49,36],[A=>29,36,20,0,90],[L=>29,56,27,56],[A=>27,36,20,90,180],[L=>7,36,7,27],[A=>27,27,20,180,270],[L=>27,7,29,7],[A=>29,27,20,270,360]],[0,[L=>43,50,16,93]]]},
  ':'=>{w=>28,p=>[[0,[L=>7,35,21,35]],[0,[L=>7,65,21,65]]]},
  '.'=>{w=>28,p=>[[0,[L=>7,93,21,93]]]},
  ','=>{w=>28,p=>[[0,[L=>14,86,14,100],[L=>14,100,9,111]]]},
  '-'=>{w=>40,p=>[[0,[L=>7,52,33,52]]]},
  '+'=>{w=>56,p=>[[0,[L=>9,52,47,52]],[0,[L=>28,33,28,71]]]},
  '/'=>{w=>40,p=>[[0,[L=>31,7,9,93]]]},
  '%'=>{w=>56,p=>[[0,[L=>44,7,12,93]],[0,[L=>7,18,21,18]],[0,[L=>35,82,49,82]]]},
);
# Zeichen → Unicode; das Minuszeichen U+2212 teilt sich das Zeichen mit dem Bindestrich, das geschützte Leerzeichen mit dem Leerzeichen
my %U=('0'=>[0x30],'1'=>[0x31],'2'=>[0x32],'3'=>[0x33],'4'=>[0x34],'5'=>[0x35],'6'=>[0x36],'7'=>[0x37],'8'=>[0x38],'9'=>[0x39],
       ':'=>[0x3A],'.'=>[0x2E],','=>[0x2C],'-'=>[0x2D,0x2212],'+'=>[0x2B],'/'=>[0x2F],'%'=>[0x25]);
my $LEER=240; # Breite des Leerzeichens in Fonteinheiten

# ---------- Geometrie (Rasterkoordinaten, y nach unten) ----------
sub info { my $s=shift;
  if($s->[0] eq 'L'){my(undef,$x1,$y1,$x2,$y2)=@$s;my($dx,$dy)=($x2-$x1,$y2-$y1);my $l=sqrt($dx*$dx+$dy*$dy)||1;my @d=($dx/$l,$dy/$l);
    return {p0=>[$x1,$y1],p1=>[$x2,$y2],t0=>[@d],t1=>[@d]};}
  my(undef,$cx,$cy,$r,$a1,$a2)=@$s;my $sg=$a2>=$a1?1:-1;my($b1,$b2)=map{$_*$PI/180}($a1,$a2);
  return {p0=>[$cx+$r*cos($b1),$cy+$r*sin($b1)],p1=>[$cx+$r*cos($b2),$cy+$r*sin($b2)],t0=>[-$sg*sin($b1),$sg*cos($b1)],t1=>[-$sg*sin($b2),$sg*cos($b2)]};}
sub linie { my($x1,$y1,$x2,$y2)=@_;my($dx,$dy)=($x2-$x1,$y2-$y1);my $l=sqrt($dx*$dx+$dy*$dy);return () if $l<1e-9;my($nx,$ny)=(-$dy/$l*$H,$dx/$l*$H);
  return [[$x1+$nx,$y1+$ny,1],[$x2+$nx,$y2+$ny,1],[$x2-$nx,$y2-$ny,1],[$x1-$nx,$y1-$ny,1]];}
sub bogen { my($cx,$cy,$r,$a1,$a2)=@_;my $n=ceil(abs($a2-$a1)/45-1e-9);$n=1 if $n<1;my $st=($a2-$a1)/$n;
  my $zug=sub{my($R,$von,$schritt)=@_;my @q;for my $i(0..$n){my $a=($von+$i*$schritt)*$PI/180;push @q,[$cx+$R*cos($a),$cy+$R*sin($a),1];
      if($i<$n){my $m=($von+($i+0.5)*$schritt)*$PI/180;my $d=$R/cos(abs($schritt)/2*$PI/180);push @q,[$cx+$d*cos($m),$cy+$d*sin($m),0];}}return @q;};
  return [$zug->($r+$H,$a1,$st),$zug->($r-$H,$a2,-$st)];}
# Gehrung an einer Ecke J zwischen ankommender Richtung d1 und abgehender d2, nur auf der Außenseite
sub gehrung { my($J,$d1,$d2)=@_;my $kr=$d1->[0]*$d2->[1]-$d1->[1]*$d2->[0];return () if abs($kr)<1e-3;
  my @n1=(-$d1->[1],$d1->[0]);my @n2=(-$d2->[1],$d2->[0]);my $s=($n1[0]*$d2->[0]+$n1[1]*$d2->[1])<0?1:-1;
  my @A=($J->[0]+$s*$n1[0]*$H,$J->[1]+$s*$n1[1]*$H);my @B=($J->[0]+$s*$n2[0]*$H,$J->[1]+$s*$n2[1]*$H);
  my $t=(($B[0]-$A[0])*$d2->[1]-($B[1]-$A[1])*$d2->[0])/$kr;my @M=($A[0]+$t*$d1->[0],$A[1]+$t*$d1->[1]);
  my $ml=sqrt(($M[0]-$J->[0])**2+($M[1]-$J->[1])**2);
  return $ml<=2*$H+1e-9?[[@$J,1],[@A,1],[@M,1],[@B,1]]:[[@$J,1],[@A,1],[@B,1]];}

# Ein Zeichen → Konturen in Fonteinheiten (y nach oben, im Uhrzeigersinn, ganze Zahlen)
sub zeichen { my($name,$g)=@_;my @k;
  for my $up(@{$g->{p}}){my($zu,@seg)=@$up;my @in=map{info($_)}@seg;
    for my $s(@seg){push @k,$s->[0] eq 'L'?linie(@$s[1..4]):bogen(@$s[1..5]);}
    my @paare=map{[$_,$_+1]}0..$#seg-1;push @paare,[$#seg,0] if $zu;
    for my $pr(@paare){my($a,$b)=@$pr;my($p,$q)=($in[$a]{p1},$in[$b]{p0});
      my $ab=sqrt(($p->[0]-$q->[0])**2+($p->[1]-$q->[1])**2);warn "Zeichen $name: Lücke $ab zwischen Segment $a und $b\n" if $ab>0.5;
      push @k,gehrung($p,$in[$a]{t1},$in[$b]{t0});}}
  my @aus;
  for my $c(@k){my @p=map{[int(floor($SB+$_->[0]*$S+0.5)),int(floor(($K-$_->[1])*$S+0.5)),$_->[2]]}@$c;
    my $fl=0;for my $i(0..$#p){my($u,$v)=($p[$i],$p[($i+1)%@p]);$fl+=$u->[0]*$v->[1]-$v->[0]*$u->[1];}
    @p=reverse @p if $fl>0;   # TrueType: Außenkonturen im Uhrzeigersinn (Fläche negativ bei y nach oben)
    while(!$p[0][2]){push @p,shift @p;}   # mit einem Punkt auf der Kurve beginnen
    my @r;for my $q(@p){push @r,$q unless @r&&$r[-1][0]==$q->[0]&&$r[-1][1]==$q->[1]&&$r[-1][2]==$q->[2];}   # doppelte Punkte weg
    pop @r while @r>1&&$r[-1][0]==$r[0][0]&&$r[-1][1]==$r[0][1];
    push @aus,\@r if @r>=3;}
  return @aus;}

# ---------- TrueType-Tabellen ----------
sub n16 { return map{$_&0xFFFF}@_; }
sub glyf_bin { my @cs=@_;return '' unless @cs;my(@x,@y,@on,@ende);my $n=0;
  for my $c(@cs){for my $p(@$c){push @x,$p->[0];push @y,$p->[1];push @on,$p->[2];$n++;}push @ende,$n-1;}
  my($x0,$x1,$y0,$y1)=($x[0],$x[0],$y[0],$y[0]);for my $i(0..$#x){$x0=$x[$i] if $x[$i]<$x0;$x1=$x[$i] if $x[$i]>$x1;$y0=$y[$i] if $y[$i]<$y0;$y1=$y[$i] if $y[$i]>$y1;}
  my $b=pack('n',scalar @cs).pack('n4',n16($x0,$y0,$x1,$y1)).pack('n*',@ende).pack('n',0);
  my @f=map{$_?1:0}@on;$f[0]|=0x40;$b.=pack('C*',@f);
  my $v=0;$b.=pack('n*',map{my $d=$_-$v;$v=$_;$d&0xFFFF}@x);$v=0;$b.=pack('n*',map{my $d=$_-$v;$v=$_;$d&0xFFFF}@y);
  return ($b,$x0,$y0,$x1,$y1,$n);}
sub pruefsumme { my $d=shift;$d.="\0"x((4-length($d)%4)%4);my $s=0;$s=($s+$_)%4294967296 for unpack('N*',$d);return $s;}

my @namen=sort{$U{$a}[0]<=>$U{$b}[0]}keys %Z;
my @gl=({name=>'.notdef',adv=>$LEER,bin=>''},{name=>'space',adv=>$LEER,bin=>''});
my %cmap=(0x20=>1,0xA0=>1);
for my $z(@namen){my @k=zeichen($z,$Z{$z});my($bin,$x0,$y0,$x1,$y1,$np)=glyf_bin(@k);
  push @gl,{name=>$z,adv=>$Z{$z}{w}*$S+2*$SB,bin=>$bin,bb=>[$x0,$y0,$x1,$y1],np=>$np,nc=>scalar @k};$cmap{$_}=$#gl for @{$U{$z}};}
my $ng=@gl;
my($gx0,$gy0,$gx1,$gy1,$maxP,$maxC,$advMax,$minL,$minR,$xMaxE,$sumAdv)=(0,0,0,0,0,0,0,32767,32767,0,0);
for my $g(@gl){$advMax=$g->{adv} if $g->{adv}>$advMax;$sumAdv+=$g->{adv};next unless $g->{bb};my($x0,$y0,$x1,$y1)=@{$g->{bb}};
  $gx0=$x0 if $x0<$gx0;$gy0=$y0 if $y0<$gy0;$gx1=$x1 if $x1>$gx1;$gy1=$y1 if $y1>$gy1;$maxP=$g->{np} if $g->{np}>$maxP;$maxC=$g->{nc} if $g->{nc}>$maxC;
  $minL=$x0 if $x0<$minL;$minR=$g->{adv}-$x1 if $g->{adv}-$x1<$minR;$xMaxE=$x1 if $x1>$xMaxE;}
my %T;
my($glyf,@loca)=('');for my $g(@gl){push @loca,length $glyf;my $b=$g->{bin};$b.="\0"x((4-length($b)%4)%4);$glyf.=$b;}push @loca,length $glyf;
$T{glyf}=$glyf;$T{loca}=pack('N*',@loca);
$T{hmtx}=join('',map{pack('nn',$_->{adv},n16($_->{bb}?$_->{bb}[0]:0))}@gl);
my $zeit=1795600000+2082844800;   # Sekunden seit 1904 (25.11.2026)
$T{head}=pack('NNNNnnNNNNnnnnnnnnn',0x00010000,0x00010000,0,0x5F0F3CF5,0x000B,1000,0,$zeit,0,$zeit,n16($gx0,$gy0,$gx1,$gy1),1,8,2,1,0);
$T{hhea}=pack('Nnnnnnnnnnnnnnnnn',0x00010000,n16(900,-250,0),$advMax,n16($minL,$minR,$xMaxE),1,0,0,0,0,0,0,0,$ng);
$T{maxp}=pack('Nn14',0x00010000,$ng,$maxP,$maxC,0,0,2,0,0,0,0,0,0,0,0);
my @cps=sort{$a<=>$b}keys %cmap;
$T{'OS/2'}=pack('nnnnnnnnnnnnnnnn',4,int($sumAdv/$ng+0.5),700,3,0,650,600,0,75,650,600,0,350,50,300,0)
  .pack('C10',2,11,8,6,3,0,0,0,0,0)
  .pack('NNNN',0x3,1<<6,0,0).'NONE'
  .pack('nnnnnnnn',0x20|0x80,$cps[0],($cps[-1]>0xFFFF?0xFFFF:$cps[-1]),800,n16(-200),0,900,250)
  .pack('NN',1,0).pack('nnnnn',0,700,0,0x20,0);
{ my @seg=map{[$_,$_,$cmap{$_}]}@cps;push @seg,[0xFFFF,0xFFFF,0];my $sc=@seg;my $es=floor(log($sc)/log(2));my $sr=2*(2**$es);
  my $st=pack('n*',map{$_->[1]}@seg).pack('n',0).pack('n*',map{$_->[0]}@seg).pack('n*',map{$_->[0]==0xFFFF?1:(($_->[2]-$_->[0])&0xFFFF)}@seg).pack('n*',(0)x$sc);
  my $sub=pack('nnnnnnn',4,14+length($st),0,2*$sc,$sr,$es,2*$sc-$sr).$st;
  $T{cmap}=pack('nn',0,1).pack('nnN',3,1,12).$sub; }
{ my @nm=([0,'(c) 2026 Flutlicht Manager (popolupo)'],[1,'Flutlicht Display'],[2,'Bold'],[3,'FlutlichtDisplay-Bold 0.1'],[4,'Flutlicht Display Bold'],
          [5,'Version 0.100'],[6,'FlutlichtDisplay-Bold'],[13,'SIL Open Font License 1.1 (vorlaeufig)'],[14,'https://openfontlicense.org']);
  my($rec,$str)=('','');for my $e(@nm){my $u=encode('UTF-16BE',$e->[1]);$rec.=pack('nnnnnn',3,1,0x0409,$e->[0],length $u,length $str);$str.=$u;}
  $T{name}=pack('nnn',0,scalar @nm,6+12*@nm).$rec.$str; }
$T{post}=pack('NNnnNNNNN',0x00030000,0,n16(-100),50,0,0,0,0,0);

my @tags=sort keys %T;my $nt=@tags;my $es=floor(log($nt)/log(2));my $sr=(2**$es)*16;
my $kopf=pack('Nnnnn',0x00010000,$nt,$sr,$es,$nt*16-$sr);my $off=12+16*$nt;my($vz,$rumpf,$headOff)=('','',0);
for my $t(@tags){my $d=$T{$t};$headOff=$off+length($rumpf) if $t eq 'head';$vz.=pack('a4NNN',$t,pruefsumme($d),$off+length($rumpf),length $d);$rumpf.=$d."\0"x((4-length($d)%4)%4);}
my $font=$kopf.$vz.$rumpf;substr($font,$headOff+8,4)=pack('N',(0xB1B0AFBA-pruefsumme($font))%4294967296);

# ---------- Selbstprüfung: Verzeichnis, Prüfsummen, Zeichenzahl ----------
{ my($v,$n)=unpack('Nn',$font);die "Kopf falsch\n" unless $v==0x00010000&&$n==$nt;
  for my $i(0..$n-1){my($tag,$ck,$o,$l)=unpack('a4NNN',substr($font,12+16*$i,16));my $d=substr($font,$o,$l);substr($d,8,4)="\0\0\0\0" if $tag eq 'head';
    die "Prüfsumme $tag falsch\n" unless pruefsumme($d)==$ck;die "Tabelle $tag außerhalb\n" if $o+$l>length $font;}
  die "Gesamtsumme falsch\n" unless pruefsumme($font)==0xB1B0AFBA;
  die "loca passt nicht\n" unless (length($T{loca})/4)==$ng+1;
  my %soll=('OS/2'=>96,head=>54,hhea=>36,maxp=>32,post=>32);
  for my $t(sort keys %soll){die "Tabelle $t hat ".length($T{$t})." statt $soll{$t} Byte\n" unless length($T{$t})==$soll{$t};}
  die "hmtx passt nicht\n" unless length($T{hmtx})==4*$ng; }

my $hier=dirname(__FILE__);my $wurzel="$hier/..";
open(my $f,'>:raw',"$hier/FlutlichtDisplay.ttf") or die "Kann TTF nicht schreiben: $!\n";print $f $font;close $f;
my $b64=encode_base64($font,'');
open(my $c,'>:raw',"$wurzel/css/schrift.css") or die "Kann CSS nicht schreiben: $!\n";
print $c "/* Flutlicht Display (K35b \xc2\xa713.4, W5d1): eigene Anzeigeschrift, erzeugt von schrift/schrift.pl, nicht von Hand \xc3\xa4ndern.\n"
 ."   Eingebettet als data-URL, damit sie auch per Doppelklick (file://) l\xc3\xa4dt. Vorerst nur Ziffern und Zeichen f\xc3\xbcr Zahlen (unicode-range),\n"
 ."   Buchstaben kommen weiter aus Saira Condensed. Lizenz der Schrift: SIL Open Font License 1.1 (vorl\xc3\xa4ufig). */\n"
 ."\@font-face{font-family:\"Flutlicht Display\";src:url(data:font/ttf;base64,$b64) format(\"truetype\");font-weight:100 900;font-style:normal;font-display:swap;"
 ."unicode-range:U+0020,U+0025,U+002B-003A,U+00A0,U+2212}\n";
close $c;
printf "Flutlicht Display: %d Zeichen, %d Tabellen, %d Byte TTF, %d Byte CSS, h\xc3\xb6chstens %d Punkte und %d Konturen je Zeichen\n",$ng,$nt,length $font,length($b64)+600,$maxP,$maxC;
