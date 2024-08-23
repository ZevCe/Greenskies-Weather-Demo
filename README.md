# Greenskies Weather Demo
 A small demo weather website demo for Greenskies energy, currently live at https://zevce.github.io/Greenskies-Weather-Demo/. Credit to https://www.flaticon.com/authors/iconixar for all images in the assets folder. 

 # Read Me Questions

## What framework/language did you use, and why?
I decided to use regular javascript/html/css. I made this decision because the first larger scale website I worked on used a very involved tech stack comprised of React, nodeJS, typescript, and I'm sure other tools I was not fully aware of. I did not really understand the benefit of having these tools in the project so I wanted to make a sizeable program without any of these tools to better grasp the limitations of javascript/html/css on it's own. 

## What api did you use, and why?
I used Visual Crossing's API (https://www.visualcrossing.com/) because it offered by far the most tools for a free plan. Visual Crossing provides 1000 api calls per day, a full 15 day forecast, hour by hour reports for each day, and 50 years of historical data all at the free level. With all this data and a generous number of API calls this seemed like the best choice for building the website. 

## What user stories or personas did have in mind when building this?

### User Stories:
- As a frequent domestic traveler I want to be able to easily look up the weather in other US cities so I know what whether to expect when my plane lands.

- As someone planning an outdoor dinner party I want to see an hourly forecast to check for rain as well as find out what time sunset is so I know when I should invite my guests over.

- As a student making after school plans with friends I want to be able to quickly find out the weather for the week based on my own zip code so I know which days are best for outdoor activites. 

- As an immigrant from Germany I want a US based weather website that lets me convert between imperial/metric units so I can quickly understand a weather report.

- As a user who hates bloated UIs I want a weather website that contains all the important information in a single page and lets me hide the reports I don't care about so I can better focus on the information that matters to me. 


### User Personas:
1) Mark Brown is a 35 year old man who works for a large consulting firm. He lives alone and due to the nature of his work spends most of his time travelling. Mark hates the rain but also hates being overdressed, unfortunately for Mark he is quite bad at dealing with timezones and finds himself very frequently misreading weather apps and stepping out into an airport where it is pouring rain when he thought he had a couple more hours of sun. This leads Mark to wasting valuable time digging through his suitcase and pulling out an umbrella or rain jacket. Mark wants a weather app that displays an hourly weathher report in the local time of the location he is travelling to to help reduce the amount of time zone conversions he has to do.

1) Agatha Green is a middle school girl with excellent grades. Agatha is an only child who lives with both her parents very close to the center of town so she is able to easily walk to where she needs to. She enjoys hanging out quite a lot with her friends and likes to try to plan in advance as much as possible. Agatha has made some outdoor plans with friends these past couple weeks but keeps getting rained out and she is now quite frustrated. Agatha wants a weather app that gives her a weekly forecast and tells her how likely it is to rain on any given day.


## What areas could be improved if you had more time?
Given more time I would rewrite this program in React. One of the biggest limitations of the project was once I had created the layout for the hourly/weekly forecast I felt very locked in to that design as any changes I would want to make would require 7 or 12 copy pastes as well as potentially some small updates to ids which would be easy to miss. If I was able to use react components I would feel a lot more confident experimenting with the design as I would only need to change the generic component and all of the individual boxes would update accordingly. There was a lot of data given to me from the API that I did not attempt to display because trying to manage all of that HTML would have gotten overwhelming very fast. I would also add a back end to the website so I could store my API key using github secrets instead of just leaving it exposed in the front end source code. 
