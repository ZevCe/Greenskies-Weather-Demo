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

    document.getElementById("search").style.display = "none";
    document.getElementById("result").style.display = "block";
    updateDisplay();
    setInterval(updateDisplay(), 60000);

}

function updateDisplay() {

    //finding out current day
    let currentDay = new Date().getDay();

    //creating our array of days
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    //iterating through each of our day headers and setting the
    //day they are displaying to be the correct day
    for(let i = 1; i < 8; i++) {
        //accessing the element
        let header = document.getElementById("dayHeader" + i);
        
        //figuring out which day to display
        let dayIndex = (currentDay + i-1)%7;
        
        //updating our header
        header.textContent = days[dayIndex];
    }
}