document.addEventListener('DOMContentLoaded', () => {
  getWeather();
});

function getWeather(){
  const station = { "Kirkwood": "KCAKIRKW4", "SugarBowl": "KCASODAS9", "Squaw Valley": "MSIBSV", "Mt. Rose": "MRSMNV" };

  Object.keys(station).forEach(function(key){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.wunderground.com/api/dda1e42fba07eb1c/geolookup/conditions/forecast/q/pws:" + station[key] + ".json", true);

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        var location = key;

        // _*_*(_*_*_*_*_*_*  Current Observations
        // var location = JSON.parse(xhr.responseText)['location']['city'];
        var temp_f = JSON.parse(xhr.responseText)['current_observation']['temp_f'];
        var altitude = JSON.parse(xhr.responseText)['current_observation']['observation_location']['elevation'];
        var weather_obs = JSON.parse(xhr.responseText)['current_observation']['weather'];

        var wind_string = JSON.parse(xhr.responseText)['current_observation']['wind_string'];
        var wind_dir = JSON.parse(xhr.responseText)['current_observation']['wind_dir'];
        var wind_mph = JSON.parse(xhr.responseText)['current_observation']['wind_mph'];
        var wind_gust_mph = JSON.parse(xhr.responseText)['current_observation']['wind_gust_mph'];

        var snow_day = JSON.parse(xhr.responseText)['forecast']['precip_1hr_in'];
        var forecast = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][0]['fcttext'];
        var precip_1hr = JSON.parse(xhr.responseText)['current_observation']['precip_1hr_in'];
        var precip_today = JSON.parse(xhr.responseText)['current_observation']['precip_today_in'];

        var time = JSON.parse(xhr.responseText)['current_observation']['observation_time_rfc822'];
        time = time.slice(0, -9); // trim string for clarity

//  ----------****** textforecast by half-day periods
// weather icons
        var fimg_0 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][0]['icon_url']
        var fimg_1 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][1]['icon_url']
        var fimg_2 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][2]['icon_url']
        var fimg_3 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][3]['icon_url']
        var fimg_4 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][4]['icon_url']
        var fimg_5 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][5]['icon_url']

weather days
        var dayname_0 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][0]['title']
        var dayname_1 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][1]['title']
        var dayname_2 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][2]['title']
        var dayname_3 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][3]['title']
        var dayname_4 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][4]['title']
        var dayname_5 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][5]['title']

        var pop_0 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][0]['pop']
        var pop_1 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][1]['pop']
        var pop_2 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][2]['pop']
        var pop_3 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][3]['pop']
        var pop_4 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][4]['pop']
        var pop_5 = JSON.parse(xhr.responseText)['forecast']['txt_forecast']['forecastday'][5]['pop']



// --------------------- forecast by full day ----- icons, snow amount, probablility of precipitation
        // var fimg_0 = JSON.parse(xhr.responseText)['forecast']['simpleforecast']['forecastday'][0]['icon_url']
        // var fimg_1 = JSON.parse(xhr.responseText)['forecast']['simpleforecast']['forecastday'][1]['icon_url']
        // var fimg_2 = JSON.parse(xhr.responseText)['forecast']['simpleforecast']['forecastday'][2]['icon_url']
        // var fimg_3 = JSON.parse(xhr.responseText)['forecast']['simpleforecast']['forecastday'][3]['icon_url']
        //
        // var snow_0 = JSON.parse(xhr.responseText)['forecast']['simpleforecast']['forecastday'][0]['snow_allday']['in']
        // var snow_1 = JSON.parse(xhr.responseText)['forecast']['simpleforecast']['forecastday'][1]['snow_allday']['in']
        // var snow_2 = JSON.parse(xhr.responseText)['forecast']['simpleforecast']['forecastday'][2]['snow_allday']['in']
        // var snow_3 = JSON.parse(xhr.responseText)['forecast']['simpleforecast']['forecastday'][3]['snow_allday']['in']








        var ul = document.getElementById("weatherList");
        var li = document.createElement("li");
        ul.appendChild(li).innerHTML =
        '<span><b>' + location + '</b> ' + altitude + '  ' + temp_f + 'F  ' + weather_obs +
        '</span><br /><span>' + forecast + '</span><br /><span>Wind: ' + wind_string +
        '</span><br /><span>Precip 24hr: ' + precip_today + ' 1hr: ' + precip_1hr + '<br /><span>At: ' + time +
        // '</span><br /><img src=' + fimg_0 +'><img src=' + fimg_1 + '><img src="' + fimg_2 + '"><img src="' + fimg_3 + '"><img src="' + fimg_4 + '"><img src="' + fimg_5 + '"<br /><br />';
        '</span><br /><img src="' + fimg_0 +'"><img src="' + fimg_1 + '"><img src="' + fimg_2 + '"><img src="' + fimg_3 + '">' +
        '</span><br /><span>Snow: ' + snow_0 + ' ' + snow_1 + ' ' + snow_2 + ' ' + snow_3 + '</span><br />' +
        '<span>POP: ' + pop_0 + ' ' + pop_1 + ' ' + pop_2 + ' ' + pop_3 + '</span><br /><br />';

//  ------- formatted graphic box -----------
      //   <div class="content-box">
      //   <div class="day">{place.forecastDay}</div>
      //   <div class="icon">
      //     <img class="glyph" src={place.icon_url} />
      //     <span>{place.icon_desc}</span><br />
      //     <span>{place.allday_snow}&#34;</span>
      //   </div>
      // </div>
      // </div>


        // <img src="' + conditions_icon + '">
        // ul.applendChild(li).innerHTML = '<img src="' + fimg_0 +'"><img src="' + fimg_1 +'"><img src="' + fimg_2 +'">'
         // ' + wind_mph + ' / ' + wind_dir + ' Gust ' + wind_gust_mph +'
      }
    }

    xhr.send();
  })
}
