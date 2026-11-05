// Zufall mit Seed (K33): xoshiro128** mit 128 Bit Zustand, Startwert über splitmix32.
// Der Zustand liegt im Spielstand (S.zufall). Jede Zufallszahl der Spiellogik kommt von hier, die Oberfläche würfelt nie.
function zufallStart(seed){let a=seed|0;const s=[];
  for(let i=0;i<4;i++){a=(a+0x9e3779b9)|0;let t=a^(a>>>16);t=Math.imul(t,0x21f0aaad);t^=t>>>15;t=Math.imul(t,0x735a2d97);t^=t>>>15;s.push(t>>>0);}
  if(!(s[0]|s[1]|s[2]|s[3]))s[0]=1;return s;}
function zufallZahl(s){const s0=s[0],s1=s[1],s2=s[2]^s0,s3=s[3]^s1,m=Math.imul(s1,5),r=Math.imul((m<<7)|(m>>>25),9);
  s[0]=(s0^s3)>>>0;s[1]=(s1^s2)>>>0;s[2]=(s2^(s1<<9))>>>0;s[3]=((s3<<11)|(s3>>>21))>>>0;return (r>>>0)/4294967296;}
// Zufallszahl von 0 bis unter 1 für die Spiellogik
function R(){return zufallZahl(S.zufall);}
// Startwert für ein neues Spiel (nur hier darf der Browser-Zufall verwendet werden)
function neuerSeed(){try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0];}catch(e){return (Date.now()^Math.floor(Math.random()*4294967296))>>>0;}}
