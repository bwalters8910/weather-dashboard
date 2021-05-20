let cities = [];



function init() {
  checkLocalStorage();
};

function addBorder() {
  $("#currentDayCard").addClass("b-s");
};

function appendForcast(data) {
  showTitle();
  for (i = 0; i < 5; i++) {
    $("#forecastContainer").append(
      `<div class="d-f f-d-c b-s p-20px">
            <p>${data.daily[i].dt}</p>
            <p><image src="https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png"></p>
            <p>Temp: ${data.daily[i].temp.day} °F</p>
            <p>Wind: ${data.daily[i].wind_speed} mph</p>
            <p>Humidity: ${data.daily[i].humidity}%</p>
        </div>`
    );
  }
};

function appendToday(data) {
  $("#currentDayCard").append(
    `<h2>${data.current.dt} <image src="https://openweathermap.org/img/w/${data.current.weather[0].icon}.png"></h2>
        <p>Temp: ${data.current.temp} °F</p>
        <p>Wind: ${data.current.wind_speed} mph</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p id="uv">UV Index: ${data.current.uvi}</p>`
  );
  addBorder();
  checkUvi(data);
};

function checkLocalStorage() {
  let citiesStorage = localStorage.getItem("cities");
     if (citiesStorage) {
        // loop through local storage and create btns with the button label as the city
        cities = JSON.parse(citiesStorage);
       console.log(cities)
       createBtns(cities);
    };
};

function checkUvi(data) {
  if (data.current.uvi > 5) {
    $("#uv").addClass("danger");
  } else if (data.current.uvi < 3) {
    $("#uv").addClass("good");
  } else {
    $("#uv").addClass("moderate");
  }
};

function clearCurrentInfo() {
  $("#currentDayCard").empty();
  $("#forecastContainer").empty();
};

function createBtns(cities) {
  for (i = 0; i < cities.length; i++) {
    $("#pastBtnContainer").prepend(
      `<button data-past=${cities[i]} class="btn btn-secondary">${cities[i]}</button>`
    );
  };
};

function storeCity() {
  let pastCities = cities;
  localStorage.setItem("cities", JSON.stringify(pastCities));
};

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
      appendForcast(data);
    });
};

function getLatLon(city) {
  clearCurrentInfo();
  let chosenCity = city || $("#cityInput").val() || "chicago";
  cities.push(city);
  storeCity();
  let apiKey = "c4688ef0bd37f92ed6bda82728650dcc";
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
};

function showTitle() {
  $("#forecastTitle").removeClass("d-n");
};

init();

$("#searchBtn").on("click", () => getLatLon());
$(".btn-secondary").on("click", checkValue);

function checkValue(e) {
  console.log();
  let selectedCity = e.target.getAttribute("data-past");
  getLatLon(selectedCity);
}

// TO DO's
// convert Unix Time to readable
// check local storage for searched city, and don't add if already there /// some() method? // use includes
// click on past city button (class) - just call the get weather with the label of button // use this
// append buttons at the end of the cycle, without refreshing page




