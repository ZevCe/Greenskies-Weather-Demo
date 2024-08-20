//need to figure out how to do api keys securely later
const apiKey = "////////";

function findZip() {
    //sanity checking input was read correctly
    console.log(document.getElementById("zipInput").value);

    //for now we are purposefully making a bad api request
    //this is mostly here just to practice fetch syntax
    //planning on switching to a better api tomorrow
    const requestURL = "http://dataservice.accuweather.com/garbageRequest";
    const requestParameters = {
        method: "GET",
        headers: {
            apikey: apiKey,
            q: "//////",
        }
    }

    fetch(requestURL, requestParameters)
        .then(response => {
            if (!response.ok) {
                if(response.status === 404) {
                    throw new Error("Correct error thrown!");
                }
                else {
                    throw new Error("Unexpected error thrown");
                }
            }
            return response.json();
        })
        .then(data => {
            console.log("data retrieved sucessfully!!");

        })
        .then(error => {
            console.error("Error: ", error);
        })

    document.getElementById("result").style.display = "block";
    updateDisplay();
    //need to prevent this from happening more than once, once submit is functional
    setInterval(updateDisplay(), 60000);
}

function updateDisplay() {
    
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
    }


    //finding out current day
    let currentDay = currentDate.getDay();

    //creating an array of days to reference with our headers
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    //iterating through our day display and setting the
    //day they are displaying to be the correct day
    for(let i = 1; i < 8; i++) {
        //accessing the element
        let dayInfo = document.getElementById("dayData" + i);

        //accessing the header
        let header = dayInfo.getElementsByClassName("dayHeader")[0];
        
        //figuring out which day header should display
        let dayIndex = (currentDay + i-1)%7;
        
        //updating our header
        header.innerHTML = days[dayIndex];
    }
}

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