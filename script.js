class MeteoCard {
    constructor (parent,index,response){

        this.parent = parent;
        this.dayNumber = `fcst_day_${index}`;
        this.cityName = `${response['city_info']['name']}`;
        this.dayName = `${response[this.dayNumber]['day_long']} ${response[this.dayNumber]['date']}`;
        this.condition = `${response[this.dayNumber]['condition']}`;
        this.imgSrc = `${response[this.dayNumber]['icon']}`;
        if (index == 0 ){
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
   
    updateCurrentCard(){

        // image a centrer verticalement
        this.content= 
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

    updateNextCard(){
        this.content= 
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

// https://cors-anywhere.herokuapp.com/https://www.prevision-meteo.ch/services/json/list-cities

function updateInfo(response){
       
    let cardArray = [];
    for (let i=0; i<5; i++) {
        
        // parent
        let parent= document.querySelector('#nextMeteo');
        if (i == 0) {
            parent= document.querySelector('#currentMeteo');
        }

        // nouvel objet
        let newCard = new MeteoCard(parent,i,response);

        // current
        if (i==0) {
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
    let parent= document.querySelector('#nextMeteo');
    for (let i=0; i<4; i++) {
        newChildren+= `${cardArray[i]['content']}`;
    }
    parent.innerHTML = newChildren;
}

// async method
const getMeteoAsync = async function (address) {
    const response = await fetch(`${address}`);
    const jsonData = await response.json();
    console.log(jsonData);
    updateInfo(jsonData);
}

getMeteoAsync("https://www.prevision-meteo.ch/services/json/toulon");
