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

  // set locations to be iterated
  // var ul = document.getElementById("weatherList");
  // var li = document.createElement("li");

  Object.keys(station).forEach(function(key) {
    const weatherData = {};

    // set locations to be iterated
    var ul = document.getElementById("weatherList");
    var li = document.createElement("li");
    // var wxGrid = document.createElement('ul')
    // wxGrid.setAttribute("class", "fxList");

    var findFxLists;
    var currentFxList;
    var textBox;
    var forecastBox;
    var box;

    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.wunderground.com/api/dda1e42fba07eb1c/geolookup/conditions/forecast/q/pws:" +
        station[key] +
        ".json",
      true
    );

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {

        var response = JSON.parse(xhr.responseText)
        weatherData['location'] = key;

        // _*_*(_*_*_*_*_*_*  Current Observations by full day period
        // var location = response['location']['city'];
        weatherData.temp_f= response.current_observation.temp_f;
        weatherData.altitude = response.current_observation.observation_location.elevation.slice(0, -3);
        weatherData.weather_obs = response.current_observation.weather;
        weatherData.wind_string = response.current_observation.wind_string;
        weatherData.wind_dir = response.current_observation.wind_dir;
        weatherData.wind_mph = response.current_observation.wind_mph;
        weatherData.wind_gust_mph = response.current_observation.wind_gust_mph;
        weatherData.snow_day = response.forecast.precip_1hr_in;
        weatherData.forecast = response.forecast.txt_forecast.forecastday[0].fcttext;
        weatherData.precip_1hr = response.current_observation.precip_1hr_in;
        weatherData.precip_today = response.current_observation.precip_today_in;
        weatherData.time = response.current_observation.observation_time_rfc822.slice(0, -9); // trim string for clarity

        //  ----------****** textforecast by half-day periods
        // data containers
        weatherData.img = [];
        weatherData.desc = [];
        weatherData.dayname = [];
        weatherData.pop = [];
        weatherData.snow = [];
        weatherData.qpf = [];

        //  API send six periods only
        for (let i=0; i<6; i++){
          // weather icons -- URLs for images
          weatherData.img[i] = response.forecast.txt_forecast.forecastday[i].icon_url;
          // one word descriptions for weather icons
          weatherData.desc[i] = response.forecast.txt_forecast.forecastday[i].icon;
          // weather days titles
          weatherData.dayname[i] = response.forecast.txt_forecast.forecastday[i].title;
          // probablility of preciptitation
          weatherData.pop[i] = response.forecast.txt_forecast.forecastday[i].pop;
          // adjusted array days for simpleforecast --day--and--night   ** index starts at 1 ** index might start at 1?
          weatherData.snow[i] = response.forecast.simpleforecast.forecastday[Math.floor(i/2)].snow_day.in;
          weatherData.snow[i] = response.forecast.simpleforecast.forecastday[Math.floor(i/2)].snow_night.in;
          weatherData.qpf[i] = response.forecast.simpleforecast.forecastday[Math.floor(i/2)].qpf_day.in;
          weatherData.qpf[i] = response.forecast.simpleforecast.forecastday[Math.floor(i/2)].qpf_night.in;
        }

        if (!weatherData.snow[0]) {
          weatherData.snow[0] = 0;
        }
        textBox="";
        textBox = '<div class="text-forecast">' +
        "<span><b>" +
        weatherData.location +
        "</b> " +
        weatherData.altitude +
        "'  " +
        weatherData.temp_f +
        "F  " +
        weatherData.weather_obs +
        "</span><br /><span> Wind: " +
        weatherData.wind_string +
        "</span><br /><span>Precip 24hr: " +
        weatherData.precip_today +
        " 1hr: " +
        weatherData.precip_1hr +
        "</span><br /><span>" +
        weatherData.forecast +
        "</span><br /><span>At: " +
        weatherData.time +
        "</span></div>";

          // add new UL to iterate through forecast graphics
        // li.appendChild(wxGrid);

        // get all TableULs and take the last one to append to
        // findFxLists = document.getElementsByClassName("fxList")
        // currentFxList = findFxLists[findFxLists.length - 1];
        // dayBox = document.createElement("li");

        // iterate through forecast days
        box="";
        for (let i = 0; i < 6; i++) {
          box += '<div class="wxBox"><div class="day">' +
           weatherData.dayname[i]+
           '</div><div class="icon">' +
           '<img class="glyph" src="' +
           weatherData.img[i] +
           '" /><br /><span>Snow: ' +
           weatherData.snow[i] +
           "&#34;</span><br /><span>QPF: " +
           weatherData.qpf[i] +
           "&#34;</span><br /><span>POP: " +
           weatherData.pop[i] +
           "&#37;</span>" +
           "</div></div>";
           // var lineupItem = document.createElement(li).setAttribute("id", "boxitem");
           // currentFxList.appendChild(dayBox).innerHTML = box;
        }
        // forecastBox = '<div class="theSlot">' + box + '</div>';
        // ul.appendChild(dayBox).innerHTML = box;
        var dayBox = document.createElement("li");
        var gxBox = document.createElement("li");
        var ul = document.getElementById("weatherList");

        // ul.appendChild(dayBox).innerHTML = '<div class="wxReport">' +textBox + box + '</div>';
        ul.appendChild(dayBox).innerHTML = textBox ;
        ul.appendChild(gxBox).innerHTML = box;
      }
    };
    xhr.send();
  });
}
