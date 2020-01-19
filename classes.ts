class Refresh {

    refreshButton: HTMLElement;
    refreshBadge: HTMLElement;
    toggleDrop: HTMLElement;
    input: HTMLElement;

    constructor() {
        this.refreshButton = document.getElementById('btnSearch');
        this.refreshBadge = document.getElementById('numberMatching');
        this.toggleDrop = document.getElementById('toggleDrop');
        this.input = document.getElementById('inputSearch');
    }

    getState(): boolean {
        let state: boolean = false;
        if (this.refreshButton.classList.contains('btn-success')) {
            state = true;
        }
        return state;
    }

    // doRefresh() {

    //     if (this.getState()) {
    //         getMeteoAsync(`https://www.prevision-meteo.ch/services/json/${myCities['list'][myCities['match']]['url']}`, 1);
    //         $('#inputSearch').val(`${myCities['list'][myCities['match']]['name']}`);
    //         myInput.setLengthValues();
    //         this.setRefreshBadge(myCities.getListLength());
    //     }
    // }

    toggleButton(aClass: string, bClass: string): void {
        this.refreshButton.classList.remove(aClass);
        this.toggleDrop.classList.remove(aClass);
        this.refreshButton.classList.add(bClass);
        this.toggleDrop.classList.add(bClass);
    }

    setRefreshBadge(long: number): void {
        this.refreshBadge.innerText = long.toString();
    }
}

class Cities {

    mainList: City[];
    list: City[];
    match: string;

    constructor() {
        this.list = [];
        this.match = "";
    }

    addCityToList(newCity: City): void {
        this.list.push(newCity);
    }

    reset(): void {
        this.list = this.mainList;
        this.match = "";
    }

    getListLength(): number {
        return this.list.length;
    }
}

class City {

    name: string;
    url: string;
    index: string;

    constructor(name: string, url: string, index: string) {
        this.name = name;
        this.url = url;
        this.index = index;
    }
}

class InputCity {

    newLength: number;
    oldLength: number;
    way: boolean;

    constructor() {
        this.newLength = 1;
        this.oldLength = 0;
        this.way = true;
    }

    checkWay():void {
        // set boolean
        let diff: number = this.newLength - this.oldLength;
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

    setLengthValues():void {
        this.oldLength = this.newLength;
        this.newLength = $('#inputSearch').val().length;
        this.checkWay();
    }

    show():void {
        let myText: any= $('#inputSearch').val();
        console.log(`\tmyInput.show:\n\t\ttext:${myText}\n\t\told:${this.oldLength}\n\t\tnew:${this.newLength}\n\t\tway:${this.way}\n`);
    }
}

class MeteoCard {

    parent: HTMLElement;
    dayNumber: string;
    cityName: string;
    dayName: string;
    dayFullName: string;
    condition: string;  
    imgSrc: string;
    hour: string;
    temp: string;
    wind: string;
    pressure: string;
    humidity: string;
    tempMin: string;
    tempMax: string;
    content: string;

    constructor(parent: HTMLElement, index: number, response: string) {

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

    updateCurrentCard(): void {

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

    updateNextCard(index: number): void {
        this.content =
            `<div id="card-${index}", class="card text-center hidden">
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