$(document).ready(function () {
    // created avariable for api key
    var appID = "e2f589323ac21fe7c4597c290fc12523";
    var place = "";
    var weatherUrl = "";
    var currentDate = moment().format("L");
    console.log(currentDate);
    var searchHistory = JSON.parse(localStorage.getItem("cities")) === null ? [] : JSON.parse(localStorage.getItem("cities"));
    console.log(searchHistory);

    displaySearchHistory();
    // function to display the weather of the user's place
    function currentWeather() {
        if ($(this).attr("id") === "search-place") {
            place = $("#place").val();
        } else {
            place = $(this).text();
        }

        weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + place + "&APPID=" + appID;
        if (searchHistory.indexOf(place) === -1) {

            searchHistory.push(place);
        }

        localStorage.setItem("cities", JSON.stringify(searchHistory));

        // store the json data into variables and added math functions to convert the temeperature
        $.getJSON(weatherUrl, function (json) {
            var temp = (json.main.temp - 273.15) * (9 / 5) + 32;
            var windspeed = json.wind.speed * 2.237;
            $("#current-city").text(json.name + " " + currentDate);
            $("#weather-img").attr("src", "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#current-temp").text(temp.toFixed(2) + "°F");
            $("#current-humidity").text(json.main.humidity + "%");
            $("#current-speed").text(windspeed.toFixed(2) + " " + "mph");
        });
    }


    //displays weather forecast for 5 days
    function fiveDayForecast() {
        // weather url for 5 day forecast with city variable in it
        var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + place + ",us&APPID=" + appID;

        // a dayCounter variable to keep track of the days
        var dayCounter = 1;

        // did an ajax call to query 
        $.ajax({
            url: fiveDayUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            // a for loop to loop over and repeat the process 5 times
            for (var i = 0; i < response.list.length; i++) {
                //change each text area here
                var dateTime = response.list[i].dt_txt;
                var date = dateTime.split(" ")[0];
                var time = dateTime.split(" ")[1];

                if (time === "15:00:00") {
                    var year = date.split("-")[0];
                    var month = date.split("-")[1];
                    var day = date.split("-")[2];
                    $("#day-" + dayCounter).children(".card-date").text(month + "/" + day + "/" + year);
                    $("#day-" + dayCounter).children(".icon").attr("src", "https://api.openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    $("#day-" + dayCounter).children(".temperature").text("Temp: " + ((response.list[i].main.temp - 273.15) * (9 / 5) + 32).toFixed(2) + "°F");
                    $("#day-" + dayCounter).children(".humidity").text("Humidity: " + response.list[i].main.humidity + "%");
                    $("#day-" + dayCounter).children(".speed").text("Wind-Speed: " + response.list[i].wind.speed + "mph");
                    // add +1 to the day counter
                    dayCounter++;
                }
            }
        });
    }
    // create a function to display the search history of the weather
    function displaySearchHistory() {
        $("#search-history").empty();
        searchHistory.forEach(function (place) {
            // console loggin the search history
            console.log(searchHistory);
            var weatherHistory = $("<li>");
            // adding class and attr to the history tab
            weatherHistory.addClass("list-group-item btn btn-light");
            // prepending new city on top of the old one to display history 
            weatherHistory.text(place);
            $("#search-history").prepend(weatherHistory);
        });
        // add event listeners to the buttons
        $(".btn").click(currentWeather);
        $(".btn").click(fiveDayForecast);
    }

    // create a function to clear history of the cities and their weather
    function clearHistory() {
        // empty the search history
        $("#search-history").empty();
        // assign searchHistory an empty array
        searchHistory = [];
        localStorage.setItem("cities", JSON.stringify(searchHistory));
    }
    //put the listener on btn class so that all buttons have listener
    $("#clear-history").click(clearHistory);
    $("#search-city").click(displaySearchHistory);

});

