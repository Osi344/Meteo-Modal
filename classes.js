var Refresh = /** @class */ (function () {
    function Refresh() {
        this.refreshButton = document.getElementById('btnSearch');
        this.refreshBadge = document.getElementById('numberMatching');
        this.toggleDrop = document.getElementById('toggleDrop');
        this.input = document.getElementById('inputSearch');
    }
    Refresh.prototype.getState = function () {
        var state = false;
        if (this.refreshButton.classList.contains('btn-success')) {
            state = true;
        }
        return state;
    };
    // doRefresh() {
    //     if (this.getState()) {
    //         getMeteoAsync(`https://www.prevision-meteo.ch/services/json/${myCities['list'][myCities['match']]['url']}`, 1);
    //         $('#inputSearch').val(`${myCities['list'][myCities['match']]['name']}`);
    //         myInput.setLengthValues();
    //         this.setRefreshBadge(myCities.getListLength());
    //     }
    // }
    Refresh.prototype.toggleButton = function (aClass, bClass) {
        this.refreshButton.classList.remove(aClass);
        this.toggleDrop.classList.remove(aClass);
        this.refreshButton.classList.add(bClass);
        this.toggleDrop.classList.add(bClass);
    };
    Refresh.prototype.setRefreshBadge = function (long) {
        this.refreshBadge.innerText = long.toString();
    };
    return Refresh;
}());
var Cities = /** @class */ (function () {
    function Cities() {
        this.list = [];
        this.match = "";
    }
    Cities.prototype.addCityToList = function (newCity) {
        this.list.push(newCity);
    };
    Cities.prototype.reset = function () {
        this.list = this.mainList;
        this.match = "";
    };
    Cities.prototype.getListLength = function () {
        return this.list.length;
    };
    return Cities;
}());
var City = /** @class */ (function () {
    function City(name, url, index) {
        this.name = name;
        this.url = url;
        this.index = index;
    }
    return City;
}());
var InputCity = /** @class */ (function () {
    function InputCity() {
        this.newLength = 1;
        this.oldLength = 0;
        this.way = true;
    }
    InputCity.prototype.checkWay = function () {
        // set boolean
        var diff = this.newLength - this.oldLength;
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
    };
    InputCity.prototype.setLengthValues = function () {
        this.oldLength = this.newLength;
        this.newLength = $('#inputSearch').val().length;
        this.checkWay();
    };
    InputCity.prototype.show = function () {
        var myText = $('#inputSearch').val();
        console.log("\tmyInput.show:\n\t\ttext:" + myText + "\n\t\told:" + this.oldLength + "\n\t\tnew:" + this.newLength + "\n\t\tway:" + this.way + "\n");
    };
    return InputCity;
}());
var MeteoCard = /** @class */ (function () {
    function MeteoCard(parent, index, response) {
        this.parent = parent;
        this.dayNumber = "fcst_day_" + index;
        this.cityName = "" + response['city_info']['name'];
        this.dayName = "" + response[this.dayNumber]['day_long'];
        this.dayFullName = this.dayName + " " + response[this.dayNumber]['date'];
        // forecast condition & img
        this.condition = "" + response[this.dayNumber]['condition'];
        this.imgSrc = "" + response[this.dayNumber]['icon'];
        if (index == 0) {
            this.condition = "" + response['current_condition']['condition'];
            this.imgSrc = "" + response['current_condition']['icon_big'];
            this.hour = "" + response['current_condition']['hour'];
            this.temp = "Temp: " + response['current_condition']['tmp'] + "\u00B0C";
            this.wind = "Vent: " + response['current_condition']['wnd_spd'] + "km/h - " + response['current_condition']['wnd_dir'];
            this.pressure = "Pression: " + response['current_condition']['pressure'] + "hPa";
            this.humidity = "Humidit\u00E9: " + response['current_condition']['humidity'] + "%";
        }
        else {
            this.tempMin = response[this.dayNumber]['tmin'] + "\u00B0C";
            this.tempMax = response[this.dayNumber]['tmax'] + "\u00B0C";
        }
    }
    MeteoCard.prototype.updateCurrentCard = function () {
        this.content =
            "<div id=\"currentCard\" class=\"card text-center\">\n            <div class=\"row no-gutters\">\n                <div class=\"col-md-4\">\n                    <img src=\"" + this.imgSrc + "\" class=\"card-img\" alt=\"bottom\">\n                </div>\n                <div class=\"col-md-8\">\n                    <div class=\"card-body\">\n                        <h5 class=\"card-title\">" + this.cityName + "</h5>\n                        <p class=\"card-text\">" + this.dayFullName + "<br>" + this.condition + "<br>" + this.temp + "</p>\n                        <p class=\"card-text\">\n                            <small class=\"text-muted\">" + this.wind + "<br>" + this.pressure + " - " + this.humidity + "</small>\n                        </p>\n                    </div>\n                </div>\n            </div>\n        </div>";
    };
    MeteoCard.prototype.updateNextCard = function (index) {
        this.content =
            "<div id=\"card-" + index + "\", class=\"card text-center hidden\">\n                <img src=\"" + this.imgSrc + "\" class=\"card-img-top\" alt=\"bottom\">\n                <div class=\"card-body\">\n                    <p class=\"card-text\">" + this.dayName + "</p>\n                    <p class=\"card-text\">\n                        <small class=\"text-muted\">" + this.tempMin + " - " + this.tempMax + "</small>\n                    </p>\n                </div>\n            </div>";
    };
    return MeteoCard;
}());
