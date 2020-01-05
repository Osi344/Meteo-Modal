class Refresh {
    constructor() {
        this.refreshButton= document.getElementById('btnSearch');
        this.refreshBadge= document.getElementById('numberMatching');
        this.input= document.getElementById('inputSearch');
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
            this.input.setAttribute('placeholder','');
            this.input.innerText= ""; 
        }
    }

    toggleButton (aClass,bClass){
        this.refreshButton.classList.remove(aClass);
        this.refreshButton.classList.add(bClass);
    }

    setRefreshBadge(long){
        this.refreshBadge.innerText= long;
    }
}

class Cities {
    constructor() {
        // this.data = respsonse;
        this.list = [];
        this.match =  "";
        this.drop = document.getElementById('dropMenu');
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
        this.dayName = `${response[this.dayNumber]['day_long']}`;
        this.dayFullName = `${this.dayName} ${response[this.dayNumber]['date']}`;
        // forecast condition & img
        this.condition = `${response[this.dayNumber]['condition']}`;
        this.imgSrc = `${response[this.dayNumber]['icon']}`;
        if (index == 0) {
            this.condition = `${response['current_condition']['condition']}`;
            this.imgSrc = `${response['current_condition']['icon_big']}`;
            this.hour = `${response['current_condition']['hour']}`;
            this.temp = `Temp: ${response['current_condition']['tmp']}°C`;
            this.wind = `Vent: ${response['current_condition']['wnd_spd']}km/h - ${response['current_condition']['wnd_dir']}`;
            this.pressure = `Pression: ${response['current_condition']['pressure']}hPa`;
            this.humidity = `Humidité: ${response['current_condition']['humidity']}%`;
        }
        else {
            this.tempMin = `${response[this.dayNumber]['tmin']}°C`;
            this.tempMax = `${response[this.dayNumber]['tmax']}°C`;
        }

    }

    updateCurrentCard() {

        this.content =
            `<div id="currentCard" class="card w-80 text-center">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${this.imgSrc}" class="card-img" alt="bottom">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${this.cityName}</h5>
                            <p class="card-text">${this.dayFullName}<br>${this.condition}<br>${this.temp}</p>
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
            `<div id="nextCard", class="card w-40 text-center">
                <img src="${this.imgSrc}" class="card-img-top" alt="bottom">
                <div class="card-body">
                    <p class="card-text">${this.dayName}</p>
                    <p class="card-text">
                        <small class="text-muted">${this.tempMin} - ${this.tempMax}</small>
                    </p>
                </div>
            </div>`;
    }
}

let myRefreshButton = new Refresh();
let myCities = new Cities();
let countryFilter = "FRA";

function updateInfo(response) {

    let cardArray = [];
    for (let i = 0; i < 5; i++) {

        // parent
        let parent = document.querySelector('#nextMeteo');
        if (i == 0) {
            parent = document.querySelector('#currentMeteo');
        }

        // new object
        let newCard = new MeteoCard(parent, i, response);

        // current
        if (i == 0) {
            newCard.updateCurrentCard();
            parent.innerHTML = `${newCard['content']}`;
        }
        // store next forecast
        else {
            newCard.updateNextCard();
            cardArray.push(newCard);
        }
    }

    // forecast
    let newChildren = "";
    let parent = document.querySelector('#nextMeteo');
    for (let i = 0; i < 4; i++) {
        newChildren += `${cardArray[i]['content']}`;
    }
    parent.innerHTML = newChildren;
}

// init complete French cities list
function getCities(list) {
    for (let i in list) {
        for (let j in list[i]) {
            // countryFilter
            if ((j == "country") && (list[i][j] == countryFilter)) {
                const newCity= new City(list[i]['name'], list[i]['url'], i);
                myCities.addCityToList(newCity);
            }
        }
    }
    myRefreshButton.setRefreshBadge(myCities['list'].length);
    myCities['mainList']= myCities['list'];
}

// update cities list filtering withs earchString
function checkCities(searchString) {

    console.log(`checkCities-1: ${myCities['list'].length}`);
    
    // set search
    let lowString = searchString.toLowerCase();
    let regex = new RegExp ("^" + lowString + ".*");
    
    // escape variables
    let countA = countB = 0;
    myRefreshButton.toggleButton('btn-success','btn-warning');
    let myCitiesArray= [];
    
    // let searchCities= new Cities();
    // searchCities = myCities;
    
    // iteration on cities list
    for (let city in myCities.list) {
        
        // set city test
        let lowName = myCities['list'][city]['name'].toLowerCase();
        
        countA++;
        if (countA<10){
            console.log(`regex:${regex}`);
            console.log(`countA:${countA}`);
            console.log(`lowName:${lowName}`);
        }

        let foundBool = regex.test(lowName);

        if ((lowName === lowString) || (myCities['list'][city]['name'] === searchString)) {
            myCities['match']= myCities['list'][city]['url'];
            myRefreshButton.toggleButton('btn-warning','btn-success');
        }
        // matching regex - update cities list
        else if (foundBool) {

            countB++;    
            if (countB<10) {
                console.log(`foundBool:${countB}`);
            }
            myCitiesArray.push(myCities['list'][city]);
        }
    }
    // ici
    myCities.list= [];
    myCities.list = myCitiesArray;
    myRefreshButton.setRefreshBadge(myCities['list'].length);
}

// async function
const getMeteoAsync = async function (address, choice) {
    try {
        const response = await fetch(address);
        // allright
        if (response.ok) {
            const jsonData = await response.json();
            if (choice == 1) {
                console.log(jsonData);
                updateInfo(jsonData);
            }
            else {
                getCities(jsonData);
                console.log(`Sortie getCities: ${myCities['list'].length}`);
            }
        }
        // server error
        else {
            console.error(`Réponse du serveur: ${response.status}`);
        }
    }
    // no reponse
    catch(error) {
        console.error(error);
    }
}

getMeteoAsync("https://cors-anywhere.herokuapp.com/https://www.prevision-meteo.ch/services/json/list-cities", 0);
getMeteoAsync("https://www.prevision-meteo.ch/services/json/toulon", 1);

// input search
let $cityEntry = document.getElementById('inputSearch');
$cityEntry.addEventListener('input', function (e) {
    myRefreshButton.toggleButton('btn-success','btn-warning');
    myCities['match']= "";
    if (e.target.value.length > 2) {
        checkCities(e.target.value)
    }
});

// refreshbutton
const $refreshButton= document.getElementById('btnSearch');
$refreshButton.addEventListener('click', function(){
    myRefreshButton.doRefresh();
    myCities['list'] = myCities['mainList'];
})