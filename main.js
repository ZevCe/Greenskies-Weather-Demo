//generic unit conversion functions
function convertToCelcius(num) {return Math.round((num - 32) * (5/9));}
function convertToKPH(num) {return Math.round(num * 1.609);}

//global variable to keep track of our loaded json
let results = null;

function findCityState() {

    //grabbing city text
    let city = document.getElementById("cityInput").value.trim();

    //grabbing state text
    let state = document.getElementById("stateInput").value.trim();

    //verifying user has entered input for both city and state
    if(city == "" || state == "") {
        setResultDivs("cityStateError");
        return;
    }

    //verifying user has entered a valid state
    let validStates = ["alabama","alaska","arizona","arkansas","california","colorado","connecticut",
    "delaware","florida","georgia","hawaii","idaho","illinois","indiana","iowa","kansas","kentucky",
    "louisiana","maine","maryland","massachusetts","michigan","minnesota","mississippi","missouri", 
    "montana","nebraska","nevada","new hampshire","new jersey","new mexico","new york","north carolina",
    "north dakota","ohio","oklahoma","oregon","pennsylvania","rhode island","south carolina","south dakota",
    "tennessee","texas","utah","vermont","virginia","washington","west virginia","wisconsin","wyoming"]; 
    
    let validAbbreviations = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS',
    'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR',
    'PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

    if(!validStates.includes(state.toLowerCase()) && !validAbbreviations.includes(state.toUpperCase())) {
        setResultDivs("stateError");
        return;
    }


    //creating our request since we are using a free plan there is no need to hide the api key
    let requestUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + city + "," + state + "?key=BDYB2F43GCAVB8YW96AWX9SV7";
    //making our apiCall
    apiCall(requestUrl);
}

//grabs all weather data for a location based on a zip code
function findZip() {

    //verifying input
    let zip = document.getElementById("zipInput").value;
    if(!/^\d{5}(-\d{4})?$/.test(zip)) {
        setResultDivs("zipError");
        return;
    }

    //creating our request since we are using a free plan there is no need to hide the api key
    let requestUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + zip + "?key=BDYB2F43GCAVB8YW96AWX9SV7";
    //making our apiCall
    apiCall(requestUrl);
}

function apiCall(requestUrl) {
    //calling the api and getting our data
    fetch(requestUrl, {mode: 'cors'})
        .then(function(response) {
            //checking if api returns successfully
            if (!response.ok) setResultDivs("apiError");
            else return response.json();
        })
        .then(function(response) {
            //printing out our json object to the console for easy reference
            console.log(response);
            //updating our divs
            results = response;
            updateDisplay();
            setResultDivs("result");
        });
}

//helper functions to set which divs are visible when a user submits a search
function setResultDivs(status) {
    
    //accessing zipErrorElement and determining if we need to show/hide
    let zipErrorElement = document.getElementById("zipError");
    if(status == "zipError") zipErrorElement.style.display = "block";
    else zipErrorElement.style.display = "none";

    //accessing cityStateErrorElement and determining if we need to show/hide
    let cityStateErrorElement = document.getElementById("cityStateError");
    if(status == "cityStateError") cityStateErrorElement.style.display = "block";
    else cityStateErrorElement.style.display = "none";

    //accessing stateErrorElement and determining if we need to show/hide
    let stateErrorElement = document.getElementById("stateError");
    if(status == "stateError") stateErrorElement.style.display = "block";
    else stateErrorElement.style.display = "none";

    //accessing apiErrorElement and determining if we need to show/hide
    let apiErrorElement = document.getElementById("apiError");
    if(status == "apiError") apiErrorElement.style.display = "block";
    else apiErrorElement.style.display = "none";

    //accessing resultElement + related setting elements and determing if we need to show/hide
    let resultElement = document.getElementById("result");
    let hourToggleElement = document.getElementById("hourlyToggle");
    let weekToggleElement = document.getElementById("weeklyToggle");
    if(status == "result") {
        resultElement.style.display = "block";
        hourToggleElement.style.display = "flex";
        weekToggleElement.style.display = "flex";

        //emptying our search fields upon success
        document.getElementById("zipInput").value = "";
        document.getElementById("cityInput").value = "";
        document.getElementById("stateInput").value = "";
    }
    else {
        resultElement.style.display = "none";
        hourToggleElement.style.display = "none";
        weekToggleElement.style.display = "none";
    }
}

//bool which keeps track of the current system to display units in
let isImperial = true;

//changing the units to imperial
function setImperial() {
    //changing the variable
    if(isImperial) return;
    isImperial = true;

    //checking we have data loaded in before making call to update display
    if(results != null) updateDisplay();
}

//changing the units to metric
function setMetric() {
    //changing the variable
    if(!isImperial) return;
    isImperial = false;

    //checking we have data loaded in before making call to update display
    if(results != null) updateDisplay();
}


//updating all the elements of our display using data currently stored in results variable
function updateDisplay() {

    //updating the address so user knows where data is being pulled from
    document.getElementById("apiAddress").innerText = "Showing results for: " + results.resolvedAddress;
    
    //creating a date object that is... up to date
    //...I'm so funny please hire me...
    let currentDate = new Date();

    //getting timezone offset for when searching in places outside of your timezone
    //working on the assumption that user is only going to be searching for locations
    //within the US and abusing the fact that .getTimezoneOffset returns an absolute value
    //while the timezone offset stored in the JSON file returns a negative number for America
    let tzOffset = results.tzoffset + (currentDate.getTimezoneOffset()/60);

    //finding out current hour (in time of search results)
    let currentHour = currentDate.getHours() + Number(tzOffset);

    //figuring out how many hours until sunset
    let sunsetOffset = Number(results.days[0].sunset.slice(0, 2)) - currentHour;

    //figuring out when sunrise today and tomorrow are
    let todaySunrise = Number(results.days[0].sunrise.slice(0, 2));
    let tomorrowSunrise = Number(results.days[1].sunrise.slice(0, 2));

    //figuring out how many hours until the NEXT sunrise (could be either tomorrow or today)
    let sunriseOffset = 0;
    //checking if the sunrise has already happened today
    if(todaySunrise - currentHour <= 0) sunriseOffset = (23 - currentHour) + tomorrowSunrise;
    else sunriseOffset = todaySunrise - currentHour;

    //creating an array of hours to reference for our headers
    let hours = ["1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm",
                "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm", "12am"];

    //iterating through our hour displays
    for(let i = 1; i < 13; i++) {

        //accessing the element
        let hourInfo = document.getElementById("hourData" + i);

        //accessing the header
        let header = hourInfo.getElementsByClassName("hourHeader")[0];

        //figuring out what hour the header should display
        let hourIndex = (currentHour + i-2)%24;
        //idk if necessary, but worried about negative indexing
        //as I don't understand why I use -2 instead of -1 (-2 does give correct result)
        if(hourIndex == -1) hourIndex = 23;

        //updating our header
        header.innerHTML = hours[hourIndex];

        //accessing and updating the icon
        let hourIcon = hourInfo.getElementsByClassName("containerImage")[0];
        //bool in third parameter checks if the current hour is after sunset
        updateIcon(hourIcon, results.days[0].hours[hourIndex + 1].conditions, (i-1 >= sunsetOffset && i-1 < sunriseOffset));

        //accessing the wind speed html element
        let windSpeedElement = hourInfo.getElementsByClassName("hourWindDiv")[0].getElementsByClassName("hourWindText")[0];
        //grabbing the windspeed from the json object
        let windSpeedNumber = results.days[0].hours[hourIndex].windspeed;
        //checking for imperial/metric and updating the element  
        if(isImperial) windSpeedElement.innerHTML = Math.round(windSpeedNumber) + " mph";
        else windSpeedElement.innerHTML = convertToKPH(windSpeedNumber) + " kph";

        //accessing the temperature html element
        let temperatureElement = hourInfo.getElementsByClassName("hourTemp")[0];
        //grabbing the temperature from the json object
        let temperatureNumber = results.days[0].hours[hourIndex].temp;
        //checking for imperial/metric and updating the element
        if(isImperial) temperatureElement.innerHTML = Math.round(temperatureNumber) + "\u00B0";
        else temperatureElement.innerHTML = convertToCelcius(temperatureNumber) + "\u00B0";
    }   

    //finding out current day
    let currentDay = currentDate.getDay();

    //creating an array of days to reference for our headers
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    //iterating through our day displays
    for(let i = 1; i < 8; i++) {
        //accessing the element
        let dayInfo = document.getElementById("dayData" + i);

        //accessing and updating the header text
        let header = dayInfo.getElementsByClassName("dayHeader")[0];
        header.innerHTML = days[(currentDay + i-1)%7];

        //accessing and updating the icon
        let dayWeatherIcon = dayInfo.getElementsByClassName("containerImage")[0];
        //bool in third parameter checks if it is currently past sunset for the current day of the week
        updateIcon(dayWeatherIcon, results.days[i-1].conditions, (i == 1 && sunsetOffset <= 0));

        //accessing and updating the rain chance text
        let rainChanceText = dayInfo.getElementsByClassName("dayRainDiv")[0].getElementsByClassName("dayRainText")[0];
        rainChanceText.innerHTML = results.days[i-1].precipprob + "%";

        //accessing the high/low temperature container
        let highLowContainer = dayInfo.getElementsByClassName("highLowContainer")[0];
        
        //accessing the high temp element
        let highElement = highLowContainer.getElementsByClassName("high")[0];
        //grabbing the high temp from the json object
        let highNum = results.days[i-1].tempmax;
        //checking for imperial/metric and updating the element
        if(isImperial) highElement.innerHTML = "H: " + Math.round(highNum) + "\u00B0";
        else highElement.innerHTML = "H: " + convertToCelcius(highNum) + "\u00B0";

        //accessing the low temp element
        let lowElement = highLowContainer.getElementsByClassName("low")[0];
        //grabbing the low temp from the json object
        let lowNum = results.days[i-1].tempmin;
        //checking for imperial/metric and updating the element
        if(isImperial) lowElement.innerHTML = "L: " + Math.round(lowNum) + "\u00B0";
        else lowElement.innerHTML = "L: " + convertToCelcius(lowNum) + "\u00B0";
    }
}

//helper function for updating the icons in our display
function updateIcon(element, conditions, isNighttime) {
    //if else statement for determinging which icon to use
    //would be a switch case but we aren't looking for exact matching
    if(conditions.includes("Rain")) element.src = "./assets/rainy.png";
    else if(conditions.includes("Overcast")) element.src = "./assets/cloudy.png";
    else if(conditions.includes("Partially cloudy")) {
        if(isNighttime) element.src = "./assets/partlyCloudyNight.png";
        else element.src = "./assets/partlyCloudy.png";
    }
    else if(conditions.includes("Clear")) {
        if(isNighttime) element.src = "./assets/nighty.png"
        else element.src = "./assets/sunny.png";
    }
    else {
        //for now just assuming unknown conditions are snowy
        element.src = "./assets/snowy.png";
        console.log(conditions);
    }
}

//variable to keep track of whether the hourly forecase should be displayed
let showHourly = true;

//function for toggling whether the hourly forecast is displayed
function toggleHourly() {
    //updating our variable
    showHourly = !showHourly;

    //grabbing the elements related to hourly forecasts
    let hourlyForecastHeader = document.getElementById("hourlyForecastHeader");
    let hourlyForecastBox = document.getElementById("hourlyForecastBox");

    //showing and hiding the elements as appropriate
    if(showHourly) {
        hourlyForecastHeader.style.display = "block";
        hourlyForecastBox.style.display = "flex";
        
    }
    else {
        hourlyForecastHeader.style.display = "none";
        hourlyForecastBox.style.display = "none";
    }
}

let showWeekly = true;
function toggleWeekly() {
    showWeekly = !showWeekly;

    let weeklyForecastHeader = document.getElementById("weeklyForecastHeader");
    let weeklyForecastBox = document.getElementById("weeklyForecastBox");

    if(showWeekly) {
        weeklyForecastHeader.style.display = "block";
        weeklyForecastBox.style.display = "flex";
    }
    else {
        weeklyForecastHeader.style.display = "none";
        weeklyForecastBox.style.display = "none";
    }
}