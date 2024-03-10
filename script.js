const notificationEl= document.querySelector(".notif");
const iconEl= document.querySelector(".icon");
const temperatureEl= document.querySelector(".temp p");
const appTempEl= document.querySelector(".apparentTemp p");
const locationEl= document.querySelector(".location p");
const text=document.getElementById("searchbar");
const searchButton=document.getElementById("search");
const currCity=document.querySelector(".city p");

const weather={};
const geoapi={};

weather.temp = {
    unit : "celsius"
};



//Searchbar for location
searchButton.addEventListener("click",searching);
text.addEventListener("keypress", function(e){
    if (e.key === "Enter"){
        document.getElementById("search").click();
    }
});

function searching(){
    const name= searchbar.value;
    getPlace(name);
    
};



//Parsing json using a geolocation api then collecting the latitude, longitude and name of the city
function getPlace(name){
    
let geocodingapi = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`;


fetch(geocodingapi).then(function(georesponse){
    let geodata = georesponse.json();
    console.log(geodata);
    return geodata;
})
.then(function(geodata){
    if (geodata.results.length > 0) {
    geoapi.cityname=geodata.results[0].name;
    geoapi.lati=geodata.results[0].latitude;
    geoapi.longi=geodata.results[0].longitude;
    }
})
.then (function(){
    position();
});
};

function position(){
    var latitude= geoapi.lati;
    var longitude= geoapi.longi;
    getWeather(latitude, longitude);
};





//PARSING JSON USING THE API then collecting the data that we need

function getWeather(latitude, longitude){  
let api = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,is_day,rain,showers,snowfall,weather_code&timezone=Europe%2FMoscow`;


fetch(api).then(function(response){
        let data = response.json();
        return data;
})
.then(function(data){
    weather.temp.value= data.current.temperature_2m;
    weather.lat= data.latitude;
    weather.long= data.longitude;
    weather.rain= data.current.rain;
    weather.showers= data.current.showers;
    weather.snowfall= data.current.snowfall;
    weather.daytime= data.current.is_day;
    weather.appTemp= data.current.apparent_temperature; 

})
.then(function(){
    displayWeather();
});
};


// DISPLAY WEATHER TO UI
function displayWeather(){

    if(weather.daytime == 1){
        weather.iconId= 'sun'}
    else{weather.iconId= 'moon'}
    if(weather.rain > 0.00){
        weather.iconId= 'rain'
    };
    if(weather.showers > 0.00){
        weather.iconId= 'showers'
    };
    if(weather.snowfall > 0.00){
        weather.iconId= 'snow'
    };

iconEl.innerHTML =  `<img src="icons/${weather.iconId}.png"/>`;
temperatureEl.innerHTML = `${weather.temp.value}°<span>C</span>`;
appTempEl.innerHTML = `Felt temperature: ${weather.appTemp}°<span>C</span>`;
locationEl.innerHTML = `Latitude: ${weather.lat} , Longitude: ${weather.long}`;
currCity.innerHTML= `${geoapi.cityname}`;
};



