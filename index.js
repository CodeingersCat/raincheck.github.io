import { key, news_key } from "./secret.js";
import countries from "./countries.js";

var logo = document.querySelector("h1");
var srchArea = document.getElementsByClassName("search-div")[0];
var srch = document.getElementById("srch-text");
var srchBtn = document.getElementById("search-button");
var maxTd = document.getElementsByClassName("maxtemp-td")[0];
var minTd = document.getElementsByClassName("mintemp-td")[0];
var desc = document.getElementsByClassName("desc")[0];
var curtemp = document.getElementsByClassName("curtemp")[0];
var feels = document.getElementsByClassName("feels")[0];
var humid = document.getElementsByClassName("humid")[0];
var info = document.getElementsByClassName("info");
var fwrap = document.getElementsByClassName("futur-wrap");
var dateInfo = document.getElementsByClassName("date-info");
var weatherSection = document.getElementsByClassName("weather-data")[0];
var blankPage = document.getElementsByClassName("blank")[0];
var ic = document.querySelector("i");
var fic = document.getElementsByClassName("f-icon");
var article1 = document.getElementsByClassName("one")[1];
var article2 = document.getElementsByClassName("two")[1];
var article3 = document.getElementsByClassName("three")[1];
var img1 = document.getElementsByClassName("one")[0].childNodes[1];
var img2 = document.getElementsByClassName("two")[0].childNodes[1];
var img3 = document.getElementsByClassName("three")[0].childNodes[1];
var top_loc = document.getElementsByClassName("loc")[0];
var top_date = document.getElementsByClassName("date")[0];
var forecast = document.getElementsByClassName("weather-forecast")[0];
var footer = document.getElementsByClassName("footer")[0];
var h2 = document.querySelector('h2');
var city = "";

// document.getElementsByClassName('li')[0].innerHTML = "YOLO";
// document.getElementsByClassName('li')[1].innerHTML = "YOLO";
//document.getElementsByClassName('li')[2].innerHTML = "YOLO";

blankPage.style.display = "flex";
top_date.style.display = "none";
top_loc.style.display = "none";

window.onload = () => {
  var options = {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": news_key,
      "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com"
    }
  };
  var API = "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?q=climate&pageNumber=1&pageSize=10&autoCorrect=true&fromPublishedDate=null&toPublishedDate=null"
  fetch(API, options)
    .then(res => res.json()
    )
    .then(data => {
      h2.innerText = "Articles for you"

      article1.setAttribute("href", data.value[0].url);
      article1.innerHTML = data.value[0].title;     
      img1.setAttribute("src", data.value[0].image.url) 

      article2.setAttribute("href", data.value[1].url);
      article2.innerHTML = data.value[1].title;
      img2.setAttribute("src", data.value[1].image.url) 

      article3.setAttribute("href", data.value[2].url);
      article3.innerHTML = data.value[2].title;
      img3.setAttribute("src", data.value[2].image.url) 
      // document.getElementsByClassName('li')[0].innerHTML = "YOLO";
    // document.getElementsByClassName('li')[1].innerHTML = "YOLO";
    // document.getElementsByClassName('li')[2].innerHTML = "YOLO";
    })
    .catch((err) => {
      blankPage.style.display = "none";
      h2.innerHTML = "ERROR :( \nIf you're reading this while using a working internet connection, please <a href='mailto:shrawansb2000@gmail.com'><u>let me know .</u></a>"
    });
};

const putData = () => {
  city = srch.value;
  var API =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric&appid=" +
    key;

  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      h2.style.display = "none";
      blankPage.style.display = "none";
      top_date.style.display = "block";
      top_loc.style.display = "block";
      weatherSection.style.display = "flex";
      var forecastAPI =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        data.coord.lat +
        "&lon=" +
        data.coord.lon +
        "&exclude=current, minutely, hourly" +
        "&appid=" +
        key +
        "&units=metric";

      var prefix = "wi wi-owm-";
      var id = data.weather[0].id;
      var date = new Date(data.dt * 1000);

      if (data.dt > data.sys.sunset) prefix += "night";
      else prefix += "day";

      ic.setAttribute("class", prefix + "-" + id);

      curtemp.innerHTML = Math.floor(data.main.temp) + " &deg;C";
      humid.innerHTML = "Humidity: " + Math.floor(data.main.humidity) + " %";
      feels.innerHTML =
        "Feels like " + Math.floor(data.main.feels_like) + " &deg;C";
      maxTd.innerHTML = "&#9650;" + Math.floor(data.main.temp_max) + " &deg;C";
      minTd.innerHTML = "&#9660;" + Math.floor(data.main.temp_min) + " &deg;C";
      desc.innerHTML = data.weather[0].main;
      document.getElementsByClassName("loc")[0].innerHTML =
        "&#x1f4cc;" + data.name + ", " + countries[data.sys.country];
      document.getElementsByClassName("date")[0].innerHTML =
        Date(date).split("G")[0];

      fetch(forecastAPI)
        .then((res) => res.json())
        .then((data) => {
          var prefix = "wi wi-owm-";

          if (data.daily[0].dt > data.daily[0].sunset) prefix += "night-";
          else prefix += "day-";
          
          forecast.childNodes[11].style.marginLeft = "4%"
          for (var i = 1; i < 8; i++) {
            if (i == 3 ||
              i == 7){
                forecast.childNodes[i].style.marginLeft = "4%"
              }
            var day = new Date(data.daily[i].dt * 1000)
              .toDateString()
              .slice(0, 3);
            var exactDate = new Date(data.daily[i].dt * 1000)
              .toDateString()
              .slice(4, 11);
            var id = data.daily[i].weather[0].id;
            info[i - 1].childNodes[1].innerHTML =
              "&#9650;" + Math.floor(data.daily[i].temp.max) + " &deg;C";

            info[i - 1].childNodes[3].innerHTML =
              "&#9660;" + Math.floor(data.daily[i].temp.min) + " &deg;C";

            fwrap[i - 1].childNodes[3].innerHTML =
              data.daily[i].weather[0].description;
            fic[i - 1].setAttribute("class", "f-icon " + prefix + id);

            dateInfo[i - 1].childNodes[1].innerHTML = day;
            dateInfo[i - 1].childNodes[3].innerHTML = exactDate;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err)
      blankPage.style.display = "none";
      h2.innerHTML = "ERROR :( \nIf you're reading this while using a working internet connection, please <a href='mailto:shrawansb2000@gmail.com'><u>let me know .</u></a>"
    })
};

srchBtn.addEventListener("click", () => {
  putData();
});

srchArea.addEventListener("keydown", (e) => {
  if (e.keyCode === 13){
    h2.style.display = "block";
    putData();
  }
});

logo.addEventListener("click", () => {
  blankPage.style.display = "flex";
  weatherSection.style.display = "none";
  top_loc.style.display = "none";
  top_date.style.display = "none";
});
