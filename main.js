
function findZip() {
    //sanity checking input was read correctly
    let zip = document.getElementById("zipInput").value;
    console.log(zip);
    if(!/^\d{5}(-\d{4})?$/.test(zip)) {
        console.error("invalid zip!");
        return;
    }

    //creating our request, which for the scope of this app is the only request we will need
    //since we are using a free plan there is no need to hide the api key
    let requestUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + zip + "?key=BDYB2F43GCAVB8YW96AWX9SV7"

    //calling the api and getting our data
    fetch(requestUrl, {mode: 'cors'})
        .then(function(response) {
            if (!response.ok) {
                console.error("API Issue!");
            }
            return response.json();
        })
        .then(function(response) {
            console.log(response);
            updateDisplay(response)
        });


    //unhiding all of our other html, make in if/else statement checking for validity
    document.getElementById("result").style.display = "block";

    //filling in all of our other html elements with data
    updateDisplay();
}

//helper function for updating the icons in our display
function updateIcon(element, conditions) {
    //if else statement for determinging which icon to use
    //would be a switch case but we aren't looking for exact matching
    if(conditions.includes("Rain")) element.src = "./assets/rainy.png";
    else if(conditions.includes("Overcast")) element.src = "./assets/cloudy.png";
    else if(conditions.includes("Partially cloudy")) element.src = "./assets/partlyCloudy.png";
    else if(conditions.includes("Clear")) element.src = "./assets/sunny.png";
    else {element.src = "./assets/snowy.png"; console.log(conditions);}
}

//updating all the elements of our display
//need to check for imperial/metric
function updateDisplay(results) {
    
    //creating a date object that is... up to date
    //...I'm so funny please hire me
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

        //accessing and updating wind speeds
        let windSpeed = hourInfo.getElementsByClassName("hourWindDiv")[0].getElementsByClassName("hourWindText")[0];
        windSpeed.innerHTML = Math.round(results.days[0].hours[i-1].windspeed) + " mph";

        //accessing and updating temp
        hourInfo.getElementsByClassName("hourTemp")[0].innerHTML = Math.round(results.days[0].hours[i-1].temp) + "\u00B0";
    }


    //finding out current day
    let currentDay = currentDate.getDay();

    //creating an array of days to reference with our headers
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


    //iterating through our day displays
    for(let i = 1; i < 8; i++) {
        //accessing the element
        let dayInfo = document.getElementById("dayData" + i);

        //accessing the header
        let header = dayInfo.getElementsByClassName("dayHeader")[0];
        
        //figuring out which day header should display
        let dayIndex = (currentDay + i-1)%7;
        
        //updating our header
        header.innerHTML = days[dayIndex];

        //accessing and updating the icon
        let dayWeatherIcon = dayInfo.getElementsByClassName("containerImage")[0];
        updateIcon(dayWeatherIcon, results.days[i-1].conditions);

        //accessing and updating the rain chance text
        let rainChanceText = dayInfo.getElementsByClassName("dayRainDiv")[0].getElementsByClassName("dayRainText")[0];
        rainChanceText.innerHTML = results.days[i-1].precipprob + "%";

        //accessing and updating the high and low temp text
        let highLowContainer = dayInfo.getElementsByClassName("highLowContainer")[0];
        highLowContainer.getElementsByClassName("high")[0].innerHTML = Math.round(results.days[i-1].tempmax) + "\u00B0";
        highLowContainer.getElementsByClassName("low")[0].innerHTML = Math.round(results.days[i-1].tempmin) + "\u00B0";
    }
}



//need to add comments
//function for switching units between imperial and metric
let isImperial = true;

function setUnit(input) {
    if(input == "metric" && !isImperial) return;
    if(input == "imperial" && isImperial) return;
    isImperial = !isImperial;

    //iterating through our hour displays
    for(let i = 1; i < 13; i++) {

        //accessing the element
        let hourInfo = document.getElementById("hourData" + i);

        let hourTemp = hourInfo.getElementsByClassName("hourTemp")[0];

        let degree = Number(hourTemp.innerHTML.slice(0, hourTemp.innerHTML.length-1));

        if(isImperial) hourTemp.innerHTML = Math.round((degree * (9/5)) + 32) + "\u00B0";
        else hourTemp.innerHTML = Math.round((degree - 32) * (5/9)) + "\u00B0";


        //da other ones
        let windSpeed = hourInfo.getElementsByClassName("hourWindDiv")[0].getElementsByClassName("hourWindText")[0];
        let num = Number(windSpeed.innerHTML.slice(0, windSpeed.innerHTML.length-3));

        if(isImperial) windSpeed.innerHTML = Math.round(num/1.609) + " mph";
        else windSpeed.innerHTML = Math.round(num * 1.609) + " kph";
    }

    //iterating through our day display
    for(let i = 1; i < 8; i++) {
        //accessing the element
        let dayInfo = document.getElementById("dayData" + i);

        let highLowContainer = dayInfo.getElementsByClassName("highLowContainer")[0];

        let high = highLowContainer.getElementsByClassName("high")[0];

        let degree = Number(high.innerHTML.slice(2, high.innerHTML.length-1));

        if(isImperial) high.innerHTML = "H: " + Math.round((degree * (9/5)) + 32) + "\u00B0";
        else high.innerHTML = "H: " + Math.round((degree - 32) * (5/9)) + "\u00B0"; 

        let low = highLowContainer.getElementsByClassName("low")[0];

        degree = Number(low.innerHTML.slice(2, low.innerHTML.length-1));

        if(isImperial) low.innerHTML = "L: " + Math.round((degree * (9/5)) + 32) + "\u00B0";
        else low.innerHTML = "L: " + Math.round((degree - 32) * (5/9)) + "\u00B0";
    }
}