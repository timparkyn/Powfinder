document.addEventListener("DOMContentLoaded", () => {
  getWeather();
});


// prettier-ignore
function getWeather() {
  const station = {
    Kirkwood: "KCAKIRKW4",
    SugarBowl: "KCASODAS9",
    "Squaw Valley": "MSIBSV",
    "Mt. Rose": "MRSMNV"
  };

  Object.keys(station).forEach(function(key) {
    const weatherData = {};

    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.wunderground.com/api/dda1e42fba07eb1c/geolookup/conditions/forecast/q/pws:" +
        station[key] +
        ".json",
      true
    );

      // set locations to be iterated
      var ul = document.getElementById("weatherList");

      var wxGrid = document.createElement('ul')
      wxGrid.setAttribute("class", "fxList");

      var findFxLists;
      var currentFxList;;
      var dayBox;



    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {

        var response = JSON.parse(xhr.responseText)
        weatherData['location'] = key;

        // _*_*(_*_*_*_*_*_*  Current Observations by full day(s)
        // var location = response['location']['city'];
        weatherData.temp_f= response["current_observation"]["temp_f"];
        weatherData.altitude = response["current_observation"]["observation_location"]["elevation"];
        weatherData.weather_obs = response["current_observation"]["weather"];
        weatherData.wind_string = response["current_observation"]["wind_string"];
        weatherData.wind_dir = response["current_observation"]["wind_dir"];
        weatherData.wind_mph = response["current_observation"]["wind_mph"];
        weatherData.wind_gust_mph = response["current_observation"]["wind_gust_mph"];
        weatherData.snow_day = response["forecast"]["precip_1hr_in"];
        weatherData.forecast = response["forecast"]["txt_forecast"]["forecastday"][0]["fcttext"];
        weatherData.precip_1hr = response["current_observation"]["precip_1hr_in"];
        weatherData.precip_today = response["current_observation"]["precip_today_in"];
        weatherData.time = response["current_observation"]["observation_time_rfc822"].slice(0, -9); // trim string for clarity

        //  ----------****** textforecast by half-day periods

          weatherData.img = [];
          weatherData.desc = [];
          weatherData.dayname = [];
          weatherData.pop = [];
          weatherData.snow = [];


        //  API send six periods only
        for (let i=0; i<6; i++){
          // weather icons -- URLs for images
          weatherData.img[i] = response["forecast"]["txt_forecast"]["forecastday"][i]["icon_url"];

          // one word descriptions for weather icons
          weatherData.desc[i] = response["forecast"]["txt_forecast"]["forecastday"][i]["icon"];

          // weather days titles
          weatherData.dayname[i] = response["forecast"]["txt_forecast"]["forecastday"][i]["title"];

            // probablility of preciptitation
          weatherData.pop[i] = response["forecast"]["txt_forecast"]["forecastday"][i]["pop"];

          // adjust days for simpleforecast   ** index starts at 1 ** index might start at 1?
          weatherData.snow[i] = response["forecast"]["simpleforecast"]["forecastday"][Math.floor(i/2)]["snow_day"]["in"];
          weatherData.snow[i] = response["forecast"]["simpleforecast"]["forecastday"][Math.floor(i/2)]["snow_night"]["in"];
        }


        if (!weatherData.snow[0]) {
          weatherData.snow[0] = 0;
        }

        var li = document.createElement("li");
        ul.appendChild(li).innerHTML =
          '<div class="text-forecast">' +
          "<span><b>" +
          weatherData.location +
          "</b> " +
          weatherData.altitude +
          "  " +
          weatherData.temp_f +
          "F  " +
          weatherData.weather_obs +
          "</span><br /><span>" +
          weatherData.forecast +
          "</span><br /><span>Wind: " +
          weatherData.wind_string +
          "</span><br /><span>Precip 24hr: " +
          weatherData.precip_today +
          " 1hr: " +
          weatherData.precip_1hr +
          "<br /><span>At: " +
          weatherData.time +
          "</span></div><br />";

          // add new UL to iterate through forecast graphics
        li.appendChild(wxGrid);

        // get all TableULs and take the last one to append to
        findFxLists = document.getElementsByClassName("fxList")
        currentFxList = findFxLists[findFxLists.length - 1];
        // dayBox = document.createElement("li");

        // iterate through forecast days
        for (let i = 0; i < 6; i++) {
          dayBox = document.createElement("li");
          var box;
          box = '<div class="wxBox"><div class="day">' +
           weatherData.dayname[i]+
           '</div><div class="icon">' +
           '<img class="glyph" src="' +
           weatherData.img[i] +
           '" /><br /><span>Snow: ' +
           weatherData.snow[i] +
           "&#34;</span><br /><span>POP: " +
           weatherData.pop[i] +
           "&#37;</span>" +
           "</div></div>";

           // var lineupItem = document.createElement(li).setAttribute("id", "boxitem");
           currentFxList.appendChild(dayBox).innerHTML = box;
        }


      }
    };

    xhr.send();
  });
}
