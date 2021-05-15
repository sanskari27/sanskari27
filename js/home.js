//jshint esversion:6

var windowHeight;

var products;

let counterExperience = 0;
let counterClients = 0;
let startedCounter = false;

init();

window.addEventListener('scroll', checkPosition);
window.addEventListener('resize', init);

function init() {
    counterExperience = 0;
    windowHeight = window.innerHeight;
    products = $('.animation-1s');
    $(".nav-drawer").addClass("w3-animate-top");
    $("#personal-info").addClass("w3-animate-left");
    $(".introduction").addClass("w3-animate-bottom");
}



function checkPosition() {
    animateStats();
    animateProducts();
    
}
  
function animateProducts(){
    let positionFromTop = products[0].getBoundingClientRect().top;
    if (positionFromTop - windowHeight <= 0) {
        $(products[0]).addClass('w3-animate-left');
        $(products[1]).addClass('w3-animate-bottom');
        $(products[2]).addClass('w3-animate-right');
    }
}
    
function animateStats(){   
    let positionFromTop = $("#stats")[0].getBoundingClientRect().top;
    if (!startedCounter&&positionFromTop - windowHeight <= 0) {
        startedCounter = true;
        setTimeout(experienceCounter,200);
        setTimeout(clientsCounter,24);
    }
}

function experienceCounter(){
    if(counterExperience <= 4){
        $("#years-of-enperience").text(counterExperience);
        counterExperience++;
        setTimeout(experienceCounter,200);
    }
}

function clientsCounter(){
    if(counterClients <= 33){
        $("#satisfied-clients").text(counterClients+"+");
        counterClients++;
        setTimeout(clientsCounter,24);
    }
}