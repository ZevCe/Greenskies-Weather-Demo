//generic unit conversion functions
function convertToFarenheit(num) {return Math.round((num * (9/5)) + 32);}
function convertToCelcius(num) {return Math.round((num - 32) * (5/9));}
function convertToMPH(num) {return Math.round(num/1.609);}
function convertToKPH(num) {return Math.round(num * 1.609);}

//grabs all weather data for a location based on a zip code
function findZip() {

    //verifying input
    let zip = document.getElementById("zipInput").value;
    if(!/^\d{5}(-\d{4})?$/.test(zip)) {
        setResultDivs("zipError");
        return;
    }

    //creating our request, which for the scope of this app is the only request we will need
    //since we are using a free plan there is no need to hide the api key
    let requestUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + zip + "?key=BDYB2F43GCAVB8YW96AWX9SV7"

    //calling the api and getting our data
    fetch(requestUrl, {mode: 'cors'})
        .then(function(response) {
            //checking if api returns successfully
            if (!response.ok) {setResultDivs("apiError");}
            else return response.json();
        })
        .then(function(response) {
            //printing out our json object to the console for easy reference
            console.log(response);
            //updating our divs
            updateDisplay(response);
            setResultDivs("result");
        });
}

//small helper functions to set which divs are visible when a user submits a search
function setResultDivs(status) {
    
    //accessing zipErrorElement and determining if we need to show/hide
    let zipErrorElement = document.getElementById("zipError");
    if(status == "zipError") zipErrorElement.style.display = "block";
    else zipErrorElement.style.display = "none";

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
    }
    else {
        resultElement.style.display = "none";
        hourToggleElement.style.display = "none";
        weekToggleElement.style.display = "none";
    }
}

//helper function for updating the icons in our display
//need to add parameters to check for nighttime at somepoint
function updateIcon(element, conditions) {
    //if else statement for determinging which icon to use
    //would be a switch case but we aren't looking for exact matching
    if(conditions.includes("Rain")) element.src = "./assets/rainy.png";
    else if(conditions.includes("Overcast")) element.src = "./assets/cloudy.png";
    else if(conditions.includes("Partially cloudy")) element.src = "./assets/partlyCloudy.png";
    else if(conditions.includes("Clear")) element.src = "./assets/sunny.png";
    else {element.src = "./assets/snowy.png"; console.log(conditions);}
}

//updating all the elements of our display based on weather data returned from an api call
//need to check for imperial/metric
function updateDisplay(results) {
    
    //creating a date object that is... up to date
    //...I'm so funny please hire me...
    let currentDate = new Date();

    //finding out current hour
    let currentHour = currentDate.getHours();

    //creating an array of hours to reference with our headers
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
        //as I don't understand why I use -2 instead of -1
        if(hourIndex == -1) hourIndex = 23;

        //updating our header
        header.innerHTML = hours[hourIndex];

        //accessing and updating the icon
        let hourIcon = hourInfo.getElementsByClassName("containerImage")[0];
        updateIcon(hourIcon, results.days[0].hours[i-1].conditions);

        //accessing the wind speed html element
        let windSpeedElement = hourInfo.getElementsByClassName("hourWindDiv")[0].getElementsByClassName("hourWindText")[0];
        //grabbing the windspeed from the json object
        let windSpeedNumber = results.days[0].hours[i-1].windspeed;
        //checking for imperial/metric and updating the element  
        if(isImperial) windSpeedElement.innerHTML = Math.round(windSpeedNumber) + " mph";
        else windSpeedElement.innerHTML = convertToKPH(windSpeedNumber) + " kph";

        //accessing the temperature html element and updating temp checking for imperial/metric
        let temperatureElement = hourInfo.getElementsByClassName("hourTemp")[0];
        //grabbing the temperature from the json object
        let temperatureNumber = results.days[0].hours[i-1].temp;
        //checking for imperial/metric and updating the element
        if(isImperial) temperatureElement.innerHTML = Math.round(temperatureNumber) + "\u00B0";
        else temperatureElement.innerHTML = convertToCelcius(temperatureNumber) + "\u00B0";
    }   

    //finding out current day
    let currentDay = currentDate.getDay();

    //creating an array of days to reference with our headers
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
        updateIcon(dayWeatherIcon, results.days[i-1].conditions);

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

//bool which keeps track of the current system to display units in
let isImperial = true;

//changing the units to imperial
function setImperial() {
    if(isImperial) return;
    isImperial = true;
    setUnit();
}

//changing the units to metric
function setMetric() {
    if(!isImperial) return;
    isImperial = false;
    setUnit();
}

//going through the elements and updating all values to imperial/metric
function setUnit() {

    //iterating through our hour display
    for(let i = 1; i < 13; i++) {
        //accessing the hour element
        let hourInfo = document.getElementById("hourData" + i);

        //accessing the temp of the current hour
        let hourTemp = hourInfo.getElementsByClassName("hourTemp")[0];
        
        //grabbing just the number of the hour temp for conversion calculations
        let degree = Number(hourTemp.innerHTML.slice(0, hourTemp.innerHTML.length-1));

        //updating the element with the new number
        if(isImperial) hourTemp.innerHTML = convertToFarenheit(degree) + "\u00B0";
        else hourTemp.innerHTML = convertToCelcius(degree) + "\u00B0";

        //grabbing the wind speed text for the current hourly element
        let windSpeedText = hourInfo.getElementsByClassName("hourWindDiv")[0].getElementsByClassName("hourWindText")[0];
        //grabbing the number itself from the element
        let speed = Number(windSpeedText.innerHTML.slice(0, windSpeedText.innerHTML.length-3));

        //updating the element with the new units
        if(isImperial) windSpeedText.innerHTML = convertToMPH(speed) + " mph";
        else windSpeedText.innerHTML = convertToKPH(speed) + " kph";
    }

    //iterating through our day display
    for(let i = 1; i < 8; i++) {
        //accessing the day element
        let dayInfo = document.getElementById("dayData" + i);

        //accessing the div containing the high and low text elements for the day
        let highLowContainer = dayInfo.getElementsByClassName("highLowContainer")[0];

        //accessing the high text from the div
        let high = highLowContainer.getElementsByClassName("high")[0];
        //accessing just the number of the text for calculations
        let degree = Number(high.innerHTML.slice(2, high.innerHTML.length-1));
        //updating the element with the text
        if(isImperial) high.innerHTML = "H: " + convertToFarenheit(degree) + "\u00B0";
        else high.innerHTML = "H: " + convertToCelcius(degree) + "\u00B0"; 

        //accessing the high text from the div
        let low = highLowContainer.getElementsByClassName("low")[0];
        //accessing just the number of the text for calculations
        degree = Number(low.innerHTML.slice(2, low.innerHTML.length-1));
        //updating the element with the text
        if(isImperial) low.innerHTML = "L: " + convertToFarenheit(degree) + "\u00B0";
        else low.innerHTML = "L: " + convertToCelcius(degree) + "\u00B0";
    }
}

//two simple functions for toggling if forecasts are shown
let showHourly = true;
function toggleHourly() {
    showHourly = !showHourly;

    let hourlyForecastHeader = document.getElementById("hourlyForecastHeader");
    let hourlyForecastBox = document.getElementById("hourlyForecastBox");

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