$(document).ready(function () {

    class Refresh {
        constructor() {
            this.refreshButton = document.getElementById('btnSearch');
            this.refreshBadge = document.getElementById('numberMatching');
            this.toggleDrop = document.getElementById('toggleDrop');
            this.input = document.getElementById('inputSearch');
        }

        getState() {
            let state = false;
            if (this.refreshButton.classList.contains('btn-success')) {
                state = true;
            }
            return state;
        }

        doRefresh() {

            if (this.getState()) {
                // getMeteoAsync(`https://www.prevision-meteo.ch/services/json/${myCities['match']}`, 1);
                getMeteoAsync(`https://www.prevision-meteo.ch/services/json/${myCities['list'][myCities['match']]['url']}`, 1);
                this.input.removeAttribute('placeholder');

                // WARNING
                //this.input.value = myCities['list'][myCities['match']]['name'];

                this.setRefreshBadge(myCities.getListLength());
            }
        }

        toggleButton(aClass, bClass) {
            this.refreshButton.classList.remove(aClass);
            this.toggleDrop.classList.remove(aClass);
            this.refreshButton.classList.add(bClass);
            this.toggleDrop.classList.add(bClass);
        }

        setRefreshBadge(long) {
            this.refreshBadge.innerText = long;
        }
    }

    class Cities {
        constructor() {
            this.list = [];
            this.match = "";
        }

        addCityToList(newCity) {
            this.list.push(newCity);
        }

        reset() {
            this.list = this.mainList;
            this.match = "";
        }

        getListLength() {
            return this.list.length;
        }
    }

    class City {
        constructor(name, url, index) {
            this.name = name;
            this.url = url;
            this.index = index;
        }
    }

    class InputCity {
        constructor() {
            // this.inputElement= $('#inputSearch');
            // this.inputElement = document.getElementById('inputSearch').value;
            this.newLength = 1;
            this.oldLength = 0;
            this.way = true;
        }

        checkWay() {
            // set boolean
            let diff = this.newLentgh - this.oldLength;
            if (diff >= 1) {
                this.way = true;
            }
            else if (diff <= -1) {
                this.way = false;
            }
            // check oldLength
            if (Math.abs(diff) > 1) {
                this.oldLength = this.newLength - 1;
            }
            if (this.oldLength < 0) {
                this.oldLength = 0;
            }
        }

        setLengthValues() {
            this.oldLength = this.newLength;
            this.newLength = $('#inputSearch').val().length;
            console.log(`old: ${this.oldLength} - new: ${this.newLength}`);
            this.checkWay();
        }

        show() {
            let text= $('#inputSearch').val();
            console.log(`\tmyInput.show:\n\t\ttext:${text}\n\t\told:${this.oldLength}\n\t\tnew:${this.newLength}\n\t\tway:${this.way}\n`);
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
                `<div id="currentCard" class="card text-center">
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
                `<div id="nextCard", class="card text-center">
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
    let myInput = new InputCity();
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
                    const newCity = new City(list[i]['name'], list[i]['url'], i);
                    myCities.addCityToList(newCity);
                }
            }
        }
        myCities['mainList'] = myCities['list'];
        myRefreshButton.setRefreshBadge(myCities.getListLength());
    }

    function createDrop(tabCities) {
        // element
        let $dropDown = document.getElementById('dropDown');

        // clear element children
        $dropDown.innerHTML = "";

        // create new children
        for (let city in tabCities) {
            let newElt = document.createElement('a');
            // AJOUTER fonction click
            newElt.setAttribute('type', 'button');
            newElt.setAttribute('data-name', city);
            newElt.classList.add('dropdown-item', 'alert-info');
            newElt.textContent = `${tabCities[city]['name']}`;
            $dropDown.appendChild(newElt);
        }

        // click on dropdown-item
        $('.dropdown-item').click(function (e) {
            let linkCity = e.currentTarget.getAttribute("data-name");
            myCities['match'] = linkCity;
            // oldLength
            // currentLength
            myRefreshButton.toggleButton('btn-warning', 'btn-success');
            myRefreshButton.doRefresh();
        });

        return 1;
    }

    // update cities list filtering withs earchString
    function checkCities(searchString) {

        // set search
        let lowString = searchString.toLowerCase();
        let regex = new RegExp("^" + lowString + ".*");

        // escape variables
        myRefreshButton.toggleButton('btn-success', 'btn-warning');
        let myCitiesArray = [];
        let indexCity = -1;
        let aloneCity = "";

        // iteration on cities list
        for (let city in myCities.list) {

            // set city test
            let lowName = myCities['list'][city]['name'].toLowerCase();
            let foundBool = regex.test(lowName);

            if ((lowName === lowString) || (myCities['list'][city]['name'] === searchString)) {
                indexCity++;
                myCities['match'] = indexCity;
                myRefreshButton.toggleButton('btn-warning', 'btn-success');
                myCitiesArray.push(myCities['list'][city]);
            }
            // matching regex - update cities list
            else if (foundBool) {
                indexCity++;
                aloneCity = indexCity;
                myCitiesArray.push(myCities['list'][city]);
            }
        }
        // ici
        myCities.list = [];
        myCities.list = myCitiesArray;
        myRefreshButton.setRefreshBadge(myCities.getListLength());

        // list matching cities
        if (myCities.getListLength() <= 30) {
            let bool = createDrop(myCities['list']);
        }

        // uniq value left
        if (myCities.getListLength() == 1) {

            myCities['match'] = aloneCity;

            // WARNING
            myInput.value = myCities['list'][myCities['match']]['name'];
            myInput.setLengthValues();
            //currentLength= myCities['list'][aloneCity]['name'].length;

            // oldLength= currentLength-1;
            myRefreshButton.toggleButton('btn-warning', 'btn-success');
            myRefreshButton.doRefresh();
        }
        myRefreshButton.setRefreshBadge(myCities.getListLength());
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
                }
            }
            // server error
            else {
                console.error(`Réponse du serveur: ${response.status}`);
            }
        }
        // no reponse
        catch (error) {
            console.error(error);
        }
    }

    getMeteoAsync("https://cors-anywhere.herokuapp.com/https://www.prevision-meteo.ch/services/json/list-cities", 0);
    getMeteoAsync("https://www.prevision-meteo.ch/services/json/toulon", 1);
    myInput.show();

    // input search
    let $cityEntry = document.getElementById('inputSearch');
    $cityEntry.addEventListener('input', function (e) {
        myRefreshButton.toggleButton('btn-success', 'btn-warning');
        myCities['match'] = "";
        myInput.setLengthValues();
        myInput.show();

        if (myInput.newLength > 2) {
            if (!myInput.way) {
                myCities.reset();
            }
            // checkCities(e.target.value);
            checkCities($('input:text').val());
        }

        // currentLength = e.target.value.length;
        // console.log(`target:${e.target.value} - old:${oldLength} - cur:${currentLength}`);

        // if (currentLength > 2) {
        //     if (currentLength > oldLength) {
        //         console.log('ici');
        //         checkCities(e.target.value);
        //     }
        //     else if (currentLength == oldLength){

        //     }
        //     else {
        //         console.log('ou la');
        //         myCities.reset();
        //         checkCities($('input:text').val());
        //         myRefreshButton.setRefreshBadge(myCities['list'].length);
        //     // }
        // }
        // oldLength = currentLength;
    });

    // refresh the forecasts
    $('#btnSearch').on('click', function () {
        myRefreshButton.doRefresh();
    });
    // fade on when dropdown show
    $('.dropdown').on('show.bs.dropdown', function () {
        $('#fadeModal').fadeTo('fast', 0.4);
    });
    // fade off when dropdown hide
    $('.dropdown').on('hide.bs.dropdown', function () {
        $('#fadeModal').fadeTo('fast', 1);
    });
});
