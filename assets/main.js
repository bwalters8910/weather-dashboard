// assign global variables //////////////////////////////////////
// apiKey
//HTML ID's
// city
// temp
// wind
// huimidity
// uvindex - set class
// 5 day container

let cities = [];


// functions ////////////////////////////////////////////////////
// init
function init() {
  // check local storage for the key (cities)
  checkLocalStorage();

};

function checkLocalStorage() {
  let citiesStorage = localStorage.getItem("cities");
     if (citiesStorage) {
        // loop through local storage and create btns with the button label as the city
        cities = JSON.parse(citiesStorage);
       console.log(cities)
       createBtns(cities);
    };
}

function createBtns(cities) {
  for (i = 0; i < cities.length; i++) {
    $("#pastBtnContainer").prepend(`<button>${cities[i]}<button>`);
  };
}

function storeCity() {
  let pastCities = cities;
  localStorage.setItem("cities", JSON.stringify(pastCities));
}


function getLatLon() {
  clearCurrentInfo();
  let chosenCity = $("#cityInput").val();
  cities.push(chosenCity);
  console.log(cities);
  storeCity();
  let apiKey = "c4688ef0bd37f92ed6bda82728650dcc";
    console.log(chosenCity);
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${chosenCity}&limit=5&appid=${apiKey}`)
    .then(function (response) {
      console.log(response.status);
      // //  Conditional for the the response.status.
      //  if (response.status !== 200) {
      // //   // Place the response.status on the page.
      //   currentDayCard.textContent = response.status;
      //  }
      return response.json();
    })
    .then(function (data) {
      $("#currentDayCard").append(`<h2>${data[0].name}, ${data[0].country}<h2>`);
      console.log(data);
      let lon = data[0].lat;
      let lat = data[0].lon;
      console.log(lon);
      console.log(lat);
      getForecast(lon, lat, apiKey);
    });
}

function getForecast(lat, lon, apiKey) {
  fetch(
    `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`
  )
    .then(function (response) {
      console.log(response.status);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      appendToday(data);
      appendFuture(data);
    });
}

function appendToday(data) {
  $("#currentDayCard").append(
    `<h2>${data.current.dt} <image src="https://openweathermap.org/img/w/${data.current.weather[0].icon}.png"></h2>
        <p>Temp: ${data.current.temp}</p>
        <p>Wind: ${data.current.wind_speed} mph</p>
        <p>Humidity: ${data.current.humidity}</p>
        <p id="uv">UV Index: ${data.current.uvi}</p>`
  );
  addBorder();
  checkUvi(data);
}

function appendFuture(data) {
  showTitle();
  for (i = 0; i < 5; i++) {
    $("#forecastContainer").append(
      `<div class="d-f f-d-c b-s p-5px">
            <p>${data.daily[i].dt}</p>
            <p><image src="https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png"></p>
            <p>Temp: ${data.daily[i].temp.day}</p>
            <p>Wind: ${data.daily[i].wind_speed} mph</p>
            <p>Humidity: ${data.daily[i].humidity}</p>
        </div>`
    );
  }
}

function checkUvi(data) {
  if (data.current.uvi > 5) {
    $("#uv").addClass("danger");
  } else if (data.current.uvi < 3) {
    $("#uv").addClass("good");
  } else {
    $("#uv").addClass("moderate");
  }
}

function showTitle() {
  $("#forecastTitle").removeClass("d-n");
}

function addBorder() {
  $("#currentDayCard").addClass("b-s");
}

function clearCurrentInfo() {
  $("#currentDayCard").empty();
  $("#forecastContainer").empty();
}




// save to local storage the city the user just searched,
// check local storage for that city first, don't add if already there


// events ////////////////////////////////////////////////////////
// init - check local storage
init();
// search button (call the api and get cream filling)
// click on past city button (class) - just call the get weather with the label of button

$("#searchBtn").on("click", getLatLon);
