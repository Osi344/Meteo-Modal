$(document).ready(function () {
    
    import classes;

    // global variables
    let myRefreshButton = new Refresh();
    let myCities = new Cities();
    let myInput = new InputCity();
    let countryFilter = "FRA";

    function doRefresh(): void {

        if (myRefreshButton.getState()) {
            getMeteoAsync(`https://www.prevision-meteo.ch/services/json/${myCities['list'][myCities['match']]['url']}`, 1);
            $('#inputSearch').val(`${myCities['list'][myCities['match']]['name']}`);
            myInput.setLengthValues();
            myRefreshButton.setRefreshBadge(myCities.getListLength());
        }
    }

    // refresh the screen
    function updateForecasts(response): void {

        let cardArray = [];
        for (let i: number = 0; i < 5; i++) {

            // parent
            let parent: HTMLElement = document.querySelector('#nextMeteo');
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
                newCard.updateNextCard(i);
                cardArray.push(newCard);
            }
        }

        // forecast
        $('#nextMeteo').empty();
        for (let i: number = 0; i < 4; i++) {
            $('#nextMeteo').append(`${cardArray[i]['content']}`);
        }
    }

    // init complete French cities list
    function getCities(list: any) {
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

    // create dropdown list regarding filter
    function createDrop(tabCities: City[]) {
        // element
        let $dropDown: HTMLElement = document.getElementById('dropDown');
        // let $dropDown = $('#dropDown').html();

        // clear element children
        $dropDown.innerHTML = "";

        // create new children
        for (let city in tabCities) {
            let newElt:HTMLElement = document.createElement('a');
            // AJOUTER fonction click
            newElt.setAttribute('type', 'button');
            newElt.setAttribute('data-name', city);
            newElt.classList.add('dropdown-item', 'alert-info');
            newElt.textContent = `${tabCities[city]['name']}`;
            $dropDown.appendChild(newElt);
        }

        // click on dropdown-item
        $('.dropdown-item').click(function (e) {
            let linkCity: string = e.currentTarget.getAttribute("data-name");
            myCities['match'] = linkCity;
            $('#inpuSearch').val(e.currentTarget.textContent);
            myInput.setLengthValues();
            myRefreshButton.toggleButton('btn-warning', 'btn-success');
            doRefresh();

        });
    }

    // update cities list filtering with searchString
    function checkCities(searchString: any) {

        // set search
        let lowString: string = searchString.toLowerCase();
        let regex = new RegExp("^" + lowString + ".*");

        // escape variables
        myRefreshButton.toggleButton('btn-success', 'btn-warning');
        let myCitiesArray: City[] = [];
        let indexCity: number = -1;
        let aloneCity: number;

        // iteration on cities list
        for (let city in myCities.list) {

            // set city test
            let lowName: string = myCities['list'][city]['name'].toLowerCase();
            let foundBool: boolean = regex.test(lowName);

            if ((lowName === lowString) || (myCities['list'][city]['name'] === searchString)) {
                indexCity++;
                myCities['match'] = indexCity.toString();
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
        myCities.list = [];
        myCities.list = myCitiesArray;
        myRefreshButton.setRefreshBadge(myCities.getListLength());

        // list matching cities
        if (myCities.getListLength() <= 30) {
            createDrop(myCities['list']);
        }
        else {
            $('#dropDown').empty();
        }

        // uniq value left
        if (myCities.getListLength() == 1) {
            myRefreshButton.toggleButton('btn-warning', 'btn-success');
            if (myInput.way) {
                myCities['match']= aloneCity.toString();
                doRefresh();
            }
        }
        else if (myCities.getListLength() == 0) {
            alert('Aucune ville correspondante');
        }
        
        myRefreshButton.setRefreshBadge(myCities.getListLength());
    }

    // async function
    const getMeteoAsync = async function (address: string, choice: number) {
        try {
            const response = await fetch(address);
            // allright
            if (response.ok) {
                const jsonData: string = await response.json();
                if (choice == 1) {
                    console.log(jsonData);
                    updateForecasts(jsonData);
                }
                else {
                    getCities(jsonData);
                }
            }
            // server error
            else {
                alert(`Réponse du serveur: ${response.status}`);
            }
        }
        // no reponse
        catch (error) {
            alert(error);
        }
    }

    getMeteoAsync("https://cors-anywhere.herokuapp.com/https://www.prevision-meteo.ch/services/json/list-cities", 0);
    getMeteoAsync("https://www.prevision-meteo.ch/services/json/toulon", 1);

    // input search
    let $cityEntry: HTMLElement = document.getElementById('inputSearch');
    $cityEntry.addEventListener('input', function () {
        myRefreshButton.toggleButton('btn-success', 'btn-warning');
        myCities['match'] = "";
        myInput.setLengthValues();

        if (myInput.newLength > 2) {
            if (!myInput.way) {
                myCities.reset();
            }
            // else {
                checkCities($('input:text').val());
            // }
        }
        else if (!myInput.way) {
            myCities.reset();
            myRefreshButton.setRefreshBadge(myCities.getListLength());
        }
    });

    // JQuery events    

    // refresh the forecasts
    $('#btnSearch').on('click', function () {
        doRefresh();
    });
    // fade on when dropdown show
    $('.dropdown').on('show.bs.dropdown', function () {
        $('#fadeModal').fadeTo('fast', 0.4);
    });
    // fade off when dropdown hide
    $('.dropdown').on('hide.bs.dropdown', function () {
        $('#fadeModal').fadeTo('fast', 1);
    });
    //  remove place holder
    $('#inputSearch').on('click', function(e) { 
        $('#inputSearch').removeAttr('placeholder');
    });
    // enter key
    $('#inputSearch').on('keypress', function(e){
        let keyCode: number= (e.keyCode ? e.keyCode : e.which);
        // enter key code
        if(keyCode == 13) { 
            doRefresh();
        }
    });
});
