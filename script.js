var pocetakIntervala; // Interval za početak igre
var kraj; // Interval za odbrojavanje vremena
var sekunde = 30; // Vreme trajanja igre
var pozadinskaMuzika; // Muzika koja svira u pozadini
var dugmeMuzika; // Zvuk prilikom klika na dugme
var udaracMuzika; // Zvuk prilikom udarca krtice
var zavrsetak; // Zvuk na kraju igre
var suma = 0; // Ukupni skor

function pocetak() {
    var x = document.getElementById("prvi"); // Element koji označava početak igre
    var slika = document.getElementsByClassName("slikaKrtice"); // Sve slike krtica
    var rupe = document.getElementsByClassName("rupe"); // Sve rupe iz kojih krtice izlaze
    var skor = document.getElementById("skor"); // Prikaz trenutnog skora
    skor.innerHTML = 0;
    var poeni = 0; // Poeni u trenutnoj igri
    var broj = 0; // Random broj za odabir rupe
    var vidljivo = true; // Da li je krtica vidljiva
    var kliknuto = false; // Da li je krtica pogođena

    // Postavlja interval za pojavljivanje i skrivanje krtica
    pocetakIntervala = setInterval(function () {
        broj = Math.floor(Math.random() * 9) + 0; // Random odabir rupe (0-8)
        
        if (vidljivo) {
            slika[broj].style.visibility = "hidden"; // Sakrij krticu
        } else {
            slika[broj].style.visibility = "visible"; // Prikaži krticu
        }
        vidljivo = !vidljivo; // Promeni stanje vidljivosti

        // Događaj klik na krticu
        slika[broj].addEventListener("click", () => {
            if (vidljivo && !kliknuto) {
                console.log("bravo"); // Ispis u konzoli (debug)
                udaracMuzika = new muzika("sound/udarac.wav"); // Zvuk udarca
                udaracMuzika.play();
                poeni += 10; // Dodaj 10 poena za pogodak
                skor.innerHTML = poeni; // Ažuriraj prikaz skora
                slika[broj].style.visibility = "hidden"; // Sakrij krticu
                kliknuto = true; // Obeleži da je krtica pogođena
                suma = poeni; // Ažuriraj ukupni skor
            }
        });

        setTimeout(function () {
            slika[broj].style.visibility = "hidden"; // Sakrij krticu nakon kratkog vremena
        }, 700); // Koliko dugo se krtica zadrzava
        
        kliknuto = false; // Resetuj kliknuto stanje
    }, 900); // Učestalost pojavljivanja krtica

    // Početak odbrojavanja vremena
    kraj = setInterval(vreme, 1000);

    // Pusti pozadinsku muziku ako već nije puštena
    if (!pozadinskaMuzika) { 
        pozadinskaMuzika = new muzika("sound/pozadinska.wav");
        pozadinskaMuzika.play();
    }
}

function ponovo() {
    var ime = document.getElementById("ime").value; // Uzimanje imena iz input polja
    if (ime == "") {
        alert("Morate uneti ime!"); // Ako ime nije uneto, prikaži alert
    } else {
        dugmeMuzika = new muzika("sound/dugme.wav"); // Zvuk klika na dugme
        dugmeMuzika.play();
        poeni = 0; // Resetovanje poena
        skor.innerHTML = 0; // Resetovanje prikaza skora
        sekunde = 30; // Resetovanje tajmera
        clearInterval(pocetakIntervala); // Zaustavljanje starog intervala
        clearInterval(kraj); // Zaustavljanje starog odbrojavanja
        pocetak(); // Počni igru ispočetka
    }
}

function stop() {
    poeni = 0; // Resetuj poene
    clearInterval(pocetakIntervala); // Zaustavi interval za krtice
    clearInterval(kraj); // Zaustavi odbrojavanje vremena
}

function vreme() {
    var timer = document.getElementById("vreme"); // Prikaz vremena
    var keyword = document.getElementById("ime").value; // Ime igrača
    var polje = document.getElementById("lista"); // Prikaz liste rezultata

    timer.innerHTML = sekunde; // Prikaz trenutnog vremena
    sekunde--; // Smanji vreme za 1

    if (sekunde < 5) {
        timer.style.color = "red"; // Promeni boju vremena u crveno ako je manje od 5 sekundi
    } else {
        timer.style.color = "white"; // Inače, vreme je prikazano belom bojom
    }

    // Kada vreme istekne
    if (sekunde < 0) {
        zavrsetak = new muzika("sound/zavrsetak.wav"); // Zvuk završetka igre
        zavrsetak.play();
        localStorage.setItem(keyword, suma); // Sačuvaj rezultat u localStorage
        stop(); // Zaustavi igru
        sekunde = 30; // Resetuj vreme za novu igru
        polje.innerHTML += '<li>' + keyword + ': ' + suma + '</li>'; // Dodaj rezultat u listu
        document.getElementById("ime").value = ""; // Resetuj input za ime
    }
}

// Konstruktor za puštanje muzike
function muzika(src) {
    this.muzika = document.createElement("audio");
    this.muzika.src = src;
    this.muzika.setAttribute("preload", "auto");
    this.muzika.setAttribute("controls", "none");

    // Ako je u pitanju pozadinska muzika, postavi je da se ponavlja
    if (src == "sound/pozadinska.wav") {
        this.muzika.setAttribute("loop", "true");
    }

    this.muzika.style.display = "none"; // Sakrij audio element
    document.body.appendChild(this.muzika); // Dodaj audio element u DOM

    // Funkcija za puštanje muzike
    this.play = function () {
        this.muzika.play();
    }
}

// Funkcija koja se poziva pri učitavanju stranice
addEventListener('load', unos);

function unos() {
    var kljucevi = Object.keys(localStorage); // Uzimanje svih ključeva iz localStorage
    var polje = document.getElementById("lista"); // Element za prikaz liste rezultata

    // Sortiranje ključeva po vrednosti rezultata
    kljucevi.sort(function (a, b) {
        return localStorage[b] - localStorage[a];
    });

    // Dodavanje rezultata u listu
    for (let i = 0; i < localStorage.length; i++) {
        var keyword = kljucevi[i];
        var vrednost = localStorage.getItem(keyword);
        polje.innerHTML += '<li>' + keyword + ': ' + vrednost + '</li>';
    }
}
