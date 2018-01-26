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
      wxGrid.setAttribute("id", "tableUL");



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
        // weather icons -- URLs for images

        weatherData.img = [];
        weatherData.img[0] = response["forecast"]["txt_forecast"]["forecastday"][0]["icon_url"];
        weatherData.img[1] = response["forecast"]["txt_forecast"]["forecastday"][1]["icon_url"];
        weatherData.img[2] = response["forecast"]["txt_forecast"]["forecastday"][2]["icon_url"];
        weatherData.img[3] = response["forecast"]["txt_forecast"]["forecastday"][3]["icon_url"];
        weatherData.img[4] = response["forecast"]["txt_forecast"]["forecastday"][4]["icon_url"];
        weatherData.img[5] = response["forecast"]["txt_forecast"]["forecastday"][5]["icon_url"];

        // one word descriptions for weather icons
        weatherData.desc = [];
        weatherData.desc[0] = response["forecast"]["txt_forecast"]["forecastday"][0]["icon"];
        weatherData.desc[1] = response["forecast"]["txt_forecast"]["forecastday"][1]["icon"];
        weatherData.desc[2] = response["forecast"]["txt_forecast"]["forecastday"][2]["icon"];
        weatherData.desc[3] = response["forecast"]["txt_forecast"]["forecastday"][3]["icon"];
        weatherData.desc[4] = response["forecast"]["txt_forecast"]["forecastday"][4]["icon"];
        weatherData.desc[5] = response["forecast"]["txt_forecast"]["forecastday"][5]["icon"];

        // weather days titles and pop
        weatherData.dayname = [];
        weatherData.dayname[0] = response["forecast"]["txt_forecast"]["forecastday"][0]["title"];
        weatherData.dayname[1] = response["forecast"]["txt_forecast"]["forecastday"][1]["title"];
        weatherData.dayname[2] = response["forecast"]["txt_forecast"]["forecastday"][2]["title"];
        weatherData.dayname[3] = response["forecast"]["txt_forecast"]["forecastday"][3]["title"];
        weatherData.dayname[4] = response["forecast"]["txt_forecast"]["forecastday"][4]["title"];
        weatherData.dayname[5] = response["forecast"]["txt_forecast"]["forecastday"][5]["title"];

        // probablility of preciptitation
        weatherData.pop = [];
        weatherData.pop[0] = response["forecast"]["txt_forecast"]["forecastday"][0]["pop"];
        weatherData.pop[1] = response["forecast"]["txt_forecast"]["forecastday"][1]["pop"];
        weatherData.pop[2] = response["forecast"]["txt_forecast"]["forecastday"][2]["pop"];
        weatherData.pop[3] = response["forecast"]["txt_forecast"]["forecastday"][3]["pop"];
        weatherData.pop[4] = response["forecast"]["txt_forecast"]["forecastday"][4]["pop"];
        weatherData.pop[5] = response["forecast"]["txt_forecast"]["forecastday"][5]["pop"];

        // adjust days for simpleforecast   ** index starts at 1 ** index might start at 1?
        weatherData.snow = [];
        weatherData.snow[0] = response["forecast"]["simpleforecast"]["forecastday"][0]["snow_day"]["in"];
        weatherData.snow[1] = response["forecast"]["simpleforecast"]["forecastday"][0]["snow_night"]["in"];
        weatherData.snow[2] = response["forecast"]["simpleforecast"]["forecastday"][1]["snow_day"]["in"];
        weatherData.snow[3] = response["forecast"]["simpleforecast"]["forecastday"][1]["snow_night"]["in"];
        weatherData.snow[4] = response["forecast"]["simpleforecast"]["forecastday"][2]["snow_day"]["in"];
        weatherData.snow[5] = response["forecast"]["simpleforecast"]["forecastday"][2]["snow_night"]["in"];

        if (!weatherData.snow[0]) {
          weatherData.snow[0] = 0;
        }

        var li = document.createElement("li");
        ul.appendChild(li).innerHTML =
          "<div>" +
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

        for (let i = 0; i < 6; i++) {
          var box;
          box = '<div class="day">' +
           weatherData.dayname[i]+
           '</div><div class="icon">' +
           '<img class="glyph" src="' +
           weatherData.img[i] +
           '" /><br /><span>Snow: ' +
           weatherData.snow[i] +
           "&#34;</span><br /><span>POP: " +
           weatherData.pop[i] +
           "&#37;</span>" +
           "</div>";

           var lineup = document.getElementById("tableUL");
           var newItem = document.createElement("li");
           // var lineupItem = document.createElement(li).setAttribute("id", "boxitem");
           wxGrid.appendChild(newItem).innerHTML = box;

        }


        //
        //   '<div><ul class="box-container">' +
        //
        //   '<li class="content-box"><div class="day">' +
        //   dayname_0 +
        //   '</div><div class="icon">' +
        //   '<img class="glyph" src="' +
        //   fimg_0 +
        //   '" /><br /><span>Snow: ' +
        //   snow_0 +
        //   "&#34;</span><br /><span>POP: " +
        //   pop_0 +
        //   "&#37;</span>" +
        //   "</div></div></div></div>" +
        //
        //   '<li class="content-box"><div class="day">' +
        //   dayname_1 +
        //   '</div><div class="icon">' +
        //   '<img class="glyph" src="' +
        //   fimg_1 +
        //   '" /><br /><span>Snow: ' +
        //   snow_1 +
        //   "&#34;</span><br /><span>POP: " +
        //   pop_1 +
        //   "&#37;</span>" +
        //   "</div></li>" +
        //
        //   '<li class="content-box"><div class="day">' +
        //   dayname_2 +
        //   '</div><div class="icon">' +
        //   '<img class="glyph" src="' +
        //   fimg_2 +
        //   '" /><br /><span>Snow: ' +
        //   snow_2 +
        //   "&#34;</span><br /><span>POP: " +
        //   pop_2 +
        //   "&#37;</span>" +
        //   "</div></li>" +
        //
        //   '<li class="content-box"><div class="day">' +
        //   dayname_3 +
        //   '</div><div class="icon">' +
        //   '<img class="glyph" src="' +
        //   fimg_3 +
        //   '" /><br /><span>Snow: ' +
        //   snow_3 +
        //   "&#34;</span><br /><span>POP: " +
        //   pop_3 +
        //   "&#37;</span>" +
        //   "</div></li>" +
        //
        //   '<li class="content-box"><div class="day">' +
        //   dayname_4 +
        //   '</div><div class="icon">' +
        //   '<img class="glyph" src="' +
        //   fimg_4 +
        //   '" /><br /><span>Snow: ' +
        //   snow_4 +
        //   "&#34;</span><br /><span>POP: " +
        //   pop_4 +
        //   "&#37;</span>" +
        //   "</div></li>" +
        //
        //   '<div class="content-box"><div class="day">' +
        //   dayname_5 +
        //   '</div><div class="icon">' +
        //   '<img class="glyph" src="' +
        //   fimg_5 +
        //   '" /><br /><span>Snow: ' +
        //   snow_5 +
        //   "&#34;</span><br /><span>POP: " +
        //   pop_5 +
        //   "&#37;</span>" +
        //   "</div></li></ul></div>";
        //
        // let forecastBox =
        //   '<div class="content-box"><div class="day">' +
        //   dayname_5 +
        //   '</div><div class="icon">' +
        //   '<img class="glyph" src="' +
        //   fimg_5 +
        //   '" /><br /><span>Snow: ' +
        //   snow_5 +
        //   "&#34;</span><br /><span>POP: " +
        //   pop_5 +
        //   "&#37;</span>" +
        //   "</div></div></div>" +
        //   "</div>";



        // icon description: <span>' + fdesc_2 + '</span><br />

        // '</span><br /><img src=' + fimg_0 +'><img src=' + fimg_1 + '><img src="' + fimg_2 + '"><img src="' + fimg_3 + '"><img src="' + fimg_4 + '"><img src="' + fimg_5 + '"<br /><br />';

        // '</span><br /><img src="' + fimg_0 +'"><img src="' + fimg_1 + '"><img src="' + fimg_2 + '"><img src="' + fimg_3 + '">' +
        // '</span><br /><span>Snow: ' + snow_0 + ' ' + snow_1 + ' ' + snow_2 + ' ' + snow_3 + '</span><br />' +
        // '<span>POP: ' + pop_0 + ' ' + pop_1 + ' ' + pop_2 + ' ' + pop_3 + '</span><br /><br />';

        //  ------- formatted graphic box -----------
        //   <div class="content-box">
        //   <div class="day">'+ dayname_0 +'</div>
        //   <div class="icon">
        //     <img class="glyph" src=' + fimg_0 + ' />
        //     <span>' + fdesc_0 + '</span><br />
        //     <span>' + snow_0 + '&#34;</span><br />
        // <span>' + pop_0 + '</span>
        //   </div>
        // </div>
        // </div>

        // <img src="' + conditions_icon + '">
        // ul.applendChild(li).innerHTML = '<img src="' + fimg_0 +'"><img src="' + fimg_1 +'"><img src="' + fimg_2 +'">'
        // ' + wind_mph + ' / ' + wind_dir + ' Gust ' + wind_gust_mph +'
      }
    };

    xhr.send();
  });
}
