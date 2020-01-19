var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
$(document).ready(function () {
    // global variables
    var myRefreshButton = new Refresh();
    var myCities = new Cities();
    var myInput = new InputCity();
    var countryFilter = "FRA";
    function doRefresh() {
        if (myRefreshButton.getState()) {
            getMeteoAsync("https://www.prevision-meteo.ch/services/json/" + myCities['list'][myCities['match']]['url'], 1);
            $('#inputSearch').val("" + myCities['list'][myCities['match']]['name']);
            myInput.setLengthValues();
            myRefreshButton.setRefreshBadge(myCities.getListLength());
        }
    }
    // refresh the screen
    function updateForecasts(response) {
        var cardArray = [];
        for (var i = 0; i < 5; i++) {
            // parent
            var parent_1 = document.querySelector('#nextMeteo');
            if (i == 0) {
                parent_1 = document.querySelector('#currentMeteo');
            }
            // new object
            var newCard = new MeteoCard(parent_1, i, response);
            // current
            if (i == 0) {
                newCard.updateCurrentCard();
                parent_1.innerHTML = "" + newCard['content'];
            }
            // store next forecast
            else {
                newCard.updateNextCard(i);
                cardArray.push(newCard);
            }
        }
        // forecast
        $('#nextMeteo').empty();
        for (var i = 0; i < 4; i++) {
            $('#nextMeteo').append("" + cardArray[i]['content']);
        }
    }
    // init complete French cities list
    function getCities(list) {
        for (var i in list) {
            for (var j in list[i]) {
                // countryFilter
                if ((j == "country") && (list[i][j] == countryFilter)) {
                    var newCity = new City(list[i]['name'], list[i]['url'], i);
                    myCities.addCityToList(newCity);
                }
            }
        }
        myCities['mainList'] = myCities['list'];
        myRefreshButton.setRefreshBadge(myCities.getListLength());
    }
    // create dropdown list regarding filter
    function createDrop(tabCities) {
        // element
        var $dropDown = document.getElementById('dropDown');
        // let $dropDown = $('#dropDown').html();
        // clear element children
        $dropDown.innerHTML = "";
        // create new children
        for (var city in tabCities) {
            var newElt = document.createElement('a');
            // AJOUTER fonction click
            newElt.setAttribute('type', 'button');
            newElt.setAttribute('data-name', city);
            newElt.classList.add('dropdown-item', 'alert-info');
            newElt.textContent = "" + tabCities[city]['name'];
            $dropDown.appendChild(newElt);
        }
        // click on dropdown-item
        $('.dropdown-item').click(function (e) {
            var linkCity = e.currentTarget.getAttribute("data-name");
            myCities['match'] = linkCity;
            $('#inpuSearch').val(e.currentTarget.textContent);
            myInput.setLengthValues();
            myRefreshButton.toggleButton('btn-warning', 'btn-success');
            doRefresh();
        });
    }
    // update cities list filtering with searchString
    function checkCities(searchString) {
        // set search
        var lowString = searchString.toLowerCase();
        var regex = new RegExp("^" + lowString + ".*");
        // escape variables
        myRefreshButton.toggleButton('btn-success', 'btn-warning');
        var myCitiesArray = [];
        var indexCity = -1;
        var aloneCity;
        // iteration on cities list
        for (var city in myCities.list) {
            // set city test
            var lowName = myCities['list'][city]['name'].toLowerCase();
            var foundBool = regex.test(lowName);
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
                myCities['match'] = aloneCity.toString();
                doRefresh();
            }
        }
        else if (myCities.getListLength() == 0) {
            alert('Aucune ville correspondante');
        }
        myRefreshButton.setRefreshBadge(myCities.getListLength());
    }
    // async function
    var getMeteoAsync = function (address, choice) {
        return __awaiter(this, void 0, void 0, function () {
            var response, jsonData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, fetch(address)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        jsonData = _a.sent();
                        if (choice == 1) {
                            console.log(jsonData);
                            updateForecasts(jsonData);
                        }
                        else {
                            getCities(jsonData);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        alert("R\u00E9ponse du serveur: " + response.status);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        alert(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    getMeteoAsync("https://cors-anywhere.herokuapp.com/https://www.prevision-meteo.ch/services/json/list-cities", 0);
    getMeteoAsync("https://www.prevision-meteo.ch/services/json/toulon", 1);
    // input search
    var $cityEntry = document.getElementById('inputSearch');
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
    $('#inputSearch').on('click', function (e) {
        $('#inputSearch').removeAttr('placeholder');
    });
    // enter key
    $('#inputSearch').on('keypress', function (e) {
        var keyCode = (e.keyCode ? e.keyCode : e.which);
        // enter key code
        if (keyCode == 13) {
            doRefresh();
        }
    });
});
