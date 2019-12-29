class Refresh {
    constructor() {
        this.refreshButton= document.getElementById('btnSearch');
    }

    getState(){
        let state= 0;
        if (this.refreshButton.classList.contains('btn-success')) {
            state++;
        }
        console.log(`state:${state}`);
        return state;
    }

    doRefresh(){
        if (this.getState()){
            console.log(`url match:${myCities['match']}`);
            getMeteoAsync(`https://www.prevision-meteo.ch/services/json/${myCities['match']}`, 1);
        }
    }

    toggleButton (aClass,bClass,blinkState){
        // let normalAClass= `btn-${aClass}`;
        // let outlineAClass= `btn-outline-${aClass}`;
        // let normalBClass= `btn-${bClass}`;
        // let outlineBClass= `btn-outline-${bClass}`;
        this.refreshButton.classList.remove(aClass);
        this.refreshButton.classList.add(bClass);
        // if (blinkState) {
        //     let outlineBClass= "";
        //     if (bClass= /^(btn-)(.+)$/) {
        //         outlineBClass= $1 + "outline-" + $2;
        //     }
        //     toggleRefreshButton (bClass,outlineBClass,0);
        //     toggleRefreshButton (outlineBClass,bClass,0);
        // }
    }
}

class Cities {
    constructor() {
        // this.data = respsonse;
        this.list = [];
        this.match =  "";
    }

    addCityToList(newCity) {
        this.list.push(newCity);
    }
}

class City {
    constructor(name, url, index) {
        this.name = name;
        this.url = url;
        this.index = index;
    }
}

class MeteoCard {
    constructor(parent, index, response) {

        this.parent = parent;
        this.dayNumber = `fcst_day_${index}`;
        this.cityName = `${response['city_info']['name']}`;
        this.dayName = `${response[this.dayNumber]['day_long']} ${response[this.dayNumber]['date']}`;
        this.condition = `${response[this.dayNumber]['condition']}`;
        this.imgSrc = `${response[this.dayNumber]['icon']}`;
        if (index == 0) {
            this.imgSrc = `${response[this.dayNumber]['icon_big']}`;
            this.hour = `${response['current_condition']['hour']}`;
            this.temp = `Temp: ${response['current_condition']['tmp']}°C`;
            this.wind = `Vent: ${response['current_condition']['wnd_spd']}km/h - ${response['current_condition']['wnd_dir']}`;
            this.pressure = `Pression: ${response['current_condition']['pressure']}hPa`;
            this.humidity = `Humidité: ${response['current_condition']['humidity']}%`;
        }
        else {
            this.tempMin = `Tmin: ${response[this.dayNumber]['tmin']}°C`;
            this.tempMax = `Tmax: ${response[this.dayNumber]['tmax']}°C`;
        }

    }

    updateCurrentCard() {

        // image a centrer verticalement
        this.content =
            `<div class="card w-80 text-center">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${this.imgSrc}" class="card-img" alt="bottom">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${this.cityName}</h5>
                            <p class="card-text">${this.dayName}<br>${this.condition} - ${this.temp}</p>
                            <p class="card-text">
                                <small class="text-muted">${this.wind}<br>${this.pressure} - ${this.humidity}</small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    updateNextCard() {
        this.content =
            `<div class="card w-25 text-center">
                <img src="${this.imgSrc}" class="card-img-top" alt="bottom">
                <div class="card-body">
                    <p class="card-text">${this.dayName}</p>
                    <p class="card-text">
                        <small class="text-muted">${this.condition}<br>${this.tempMin} - ${this.tempMax}</small>
                    </p>
                </div>
            </div>`;
    }
}

let myRefreshButton = new Refresh();
let myCities = new Cities();
let countryFilter = "FRA";
// https://cors-anywhere.herokuapp.com/https://www.prevision-meteo.ch/services/json/list-cities

function updateInfo(response) {

    let cardArray = [];
    for (let i = 0; i < 5; i++) {

        // parent
        let parent = document.querySelector('#nextMeteo');
        if (i == 0) {
            parent = document.querySelector('#currentMeteo');
        }

        // nouvel objet
        let newCard = new MeteoCard(parent, i, response);

        // current
        if (i == 0) {
            newCard.updateCurrentCard();
            parent.innerHTML = `${newCard['content']}`;
        }
        // stockage next
        else {
            newCard.updateNextCard();
            cardArray.push(newCard);
        }
    }

    // prevision
    let newChildren = "";
    let parent = document.querySelector('#nextMeteo');
    for (let i = 0; i < 4; i++) {
        newChildren += `${cardArray[i]['content']}`;
    }
    parent.innerHTML = newChildren;
}

function getCities(list) {
    let myBool= 0;
    for (let i in list) {
        for (let j in list[i]) {
            // countryFilter
            if ((j == "country") && (list[i][j] == "FRA")) {
                const newCity= new City(list[i]['name'], list[i]['url'], i);
                myCities.addCityToList(newCity);
                myBool= 1;
            }
        }
        // if(k>30) {
        // break;
        // }
    }
    if (myBool) {
        myCities.index++;
    }
}


function checkCities(searchString) {
    // set search
    let lowString = searchString.toLowerCase();
    let regex = `/^(${lowString}).*/`;
    // escape variables
    let resetList= 0;
    let searchCities= new Cities();
    searchCities = myCities;
    // iteration on cities list
    for (let city in searchCities['list']) {
        // set city test
        let lowName = searchCities['list'][city]['name'].toLowerCase();
        var foundB = lowName.match(regex);
        if (searchCities['list'][city]['name'] === searchString) {
            myCities['match']= searchCities['list'][city]['url'];
            console.log(`url:${searchCities['list'][city]['url']}`);
            // console.log("\t\tsuper");
            myRefreshButton.toggleButton('btn-warning','btn-success',1);
        }
        // 
        else if (foundB) {
            if (! resetList) {
                myRefreshButton.toggleButton('btn-success','btn-warning',1);
                myCities.list= [];
                resetList++;
            }
            myCities.addCityToList(searchCities['list'][city]);
        }
    }
}

// async function
const getMeteoAsync = async function (address, choice) {
    const response = await fetch(address);
    const jsonData = await response.json();
    if (choice == 1) {
        console.log(jsonData);
        updateInfo(jsonData);
    }
    else {
        getCities(jsonData);
    }
}

getMeteoAsync("https://cors-anywhere.herokuapp.com/https://www.prevision-meteo.ch/services/json/list-cities", 0);
getMeteoAsync("https://www.prevision-meteo.ch/services/json/toulon", 1);

let $cityEntry = document.getElementById('inputSearch');
$cityEntry.addEventListener('input', function (e) {
    myRefreshButton.toggleButton('btn-success','btn-warning',0);
    if (e.target.value.length > 2) {
        checkCities(e.target.value)
    }
});

const $refreshButton= document.getElementById('btnSearch');
$refreshButton.addEventListener('click', function(){
    myRefreshButton.doRefresh();
})