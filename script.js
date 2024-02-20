var pocetakIntervala;
var kraj;
var sekunde=30;
var pozadinskaMuzika;
var dugmeMuzika;
var udaracMuzika;
var zavrsetak;
var suma=0;
function pocetak(){
   var x= document.getElementById("prvi");
   var slika=document.getElementsByClassName("slikaKrtice");
   var rupe = document.getElementsByClassName("rupe");
   var skor = document.getElementById("skor");
   skor.innerHTML=0;
   var poeni=0;
   var broj=0;
   var vidljivo=true;
   var kliknuto=false;
   

   pocetakIntervala = setInterval(function(){
    broj=Math.floor(Math.random()*9)+0;
    if(vidljivo)
    {
        slika[broj].style.visibility = "hidden";
    }
    else{
        slika[broj].style.visibility = "visible";
    }
    vidljivo = !vidljivo;

    slika[broj].addEventListener("click",() => {
        if(vidljivo && !kliknuto){
        console.log("bravo");
        udaracMuzika = new muzika("sound/udarac.wav");
        udaracMuzika.play();
        poeni+=10;
        skor.innerHTML = poeni;
        slika[broj].style.visibility = "hidden";
        kliknuto=true;
        suma=poeni;
        }
    })
    
    setTimeout(function(){
        slika[broj].style.visibility = "hidden";

        
    },500); //Koliko dugo se krtica zadrzava
    kliknuto=false;
    
   },700);
  
   kraj= setInterval(vreme,1000);
   if (!pozadinskaMuzika) { 
    pozadinskaMuzika = new muzika("sound/pozadinska.wav");
    pozadinskaMuzika.play();
}

}
function ponovo(){
    var ime = document.getElementById("ime").value;
    if(ime==""){
        alert("Morate uneti ime!");
    }
    else{

    dugmeMuzika = new muzika("sound/dugme.wav");
    dugmeMuzika.play();
    poeni=0;
    skor.innerHTML=0;
    sekunde=30;
    clearInterval(pocetakIntervala);
    clearInterval(kraj);
    pocetak();
    
    }
    
}
function stop(){
    poeni=0;
    clearInterval(pocetakIntervala);
    clearInterval(kraj);
}
function vreme(){
    var timer = document.getElementById("vreme");
    var keyword= document.getElementById("ime").value;
    var polje = document.getElementById("lista");
    timer.innerHTML=sekunde;
    sekunde--;
    if(sekunde<5)
    {
        timer.style.color= "red";
    }
    else
    {
        timer.style.color= "white";
    }
   

    if(sekunde<0)
    {
        zavrsetak = new muzika("sound/zavrsetak.wav");
        zavrsetak.play();
        localStorage.setItem(keyword,suma);  
        stop();
        sekunde=30;
        polje.innerHTML+='<li>' + keyword + ': ' + suma + '</li>';
        document.getElementById("ime").value = "";
        
    }
}

function muzika(src){
    this.muzika = document.createElement("audio");
    this.muzika.src= src;
    this.muzika.setAttribute("preload", "auto");
    this.muzika.setAttribute("controls","none");
    if(src=="sound/pozadinska.wav"){
    this.muzika.setAttribute("loop", "true");
    }
    this.muzika.style.display="none";

    document.body.appendChild(this.muzika);

    this.play = function () {
            this.muzika.play();
    }
}
addEventListener('load',unos);
function unos(){
    var kljucevi = Object.keys(localStorage);
    var polje = document.getElementById("lista");

    kljucevi.sort(function (a,b){
        return localStorage[b] - localStorage [a];
    })

    for(let i=0; i < localStorage.length; i++){
        var keyword = kljucevi[i];
        var vrednost = localStorage.getItem(keyword);
        polje.innerHTML += '<li>' + keyword + ': ' + vrednost + '</li>';
    }

}


