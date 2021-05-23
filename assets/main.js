let cities = [];

function init() {
  checkLocalStorage();
};

function addBorder() {
  $("#currentDayCard").addClass("b-s");
};

function appendForcast(data) {
  showTitle();

  //converts UNIX time to readable format
  for (i = 1; i < 6; i++) {
    let unixTime = data.daily[i].dt;
    let date = new Date(unixTime * 1000);

    //renders forcast cards to the screen
    $("#forecastContainer").append(
      `<div class="d-f f-d-c b-s p-20px card text-white bg-primary mb-3">
            <p>${date}</p>
            <p><image src="https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png"></p>
            <p>Temp: ${data.daily[i].temp.day} °F</p>
            <p>Wind: ${data.daily[i].wind_speed} mph</p>
            <p>Humidity: ${data.daily[i].humidity}%</p>
        </div>`
    );
  }
};

function appendToday(data) {
  // converts unix to readable date
  let unixTime = data.current.dt;
  let regularDate = new Date(unixTime * 1000);

  //renders my data to the screen
  $("#currentDayCard").append(
    `<div class="card text-dark bg-light mb-3">
    <h2>${regularDate} <image src="https://openweathermap.org/img/w/${data.current.weather[0].icon}.png"></h2>
        <p>Temp: ${data.current.temp} °F</p>
        <p>Wind: ${data.current.wind_speed} mph</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p id="uv">UV Index: ${data.current.uvi}</p>
        </div>`
  );
  addBorder();
  // checks UVI and adds a class to correspond to risk level
  checkUvi(data);
};

function checkLocalStorage() {
  let citiesStorage = localStorage.getItem("cities");
     if (citiesStorage) {
        // loops through local storage and create btns with the button label as the city
        cities = JSON.parse(citiesStorage);
       createBtns(cities);
       $("#clearBtn").removeClass("d-n");
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

function checkValue(e) {
  console.log();
  let selectedCity = e.target.getAttribute("data-past");
  getLatLon(selectedCity);
};

function clearCurrentInfo() {
  $("#currentDayCard").empty();
  $("#forecastContainer").empty();
};

function clearStorage() {
  localStorage.clear();
  location.reload();
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
      return response.json();
    })
    .then(function (data) {
      // passes data into append functions to render the info on the screen
      appendToday(data);
      appendForcast(data);
    });
};

function getLatLon(city) {
  //clears containers before appending more data
  clearCurrentInfo();
  let chosenCity = city || $("#cityInput").val().toUpperCase() || "Chicago";
  //chosenCity = chosenCity.replace(/ /g, '');
  // checks to see if city is alreay in local strage array cities, adds it if not
  if (!cities.includes(chosenCity)) {
    cities.push(chosenCity);
  }
  // stores the cities arrray in local stroage
  storeCity();
  // returns the lat & lon for the chosen city
  let apiKey = "c4688ef0bd37f92ed6bda82728650dcc";
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${chosenCity}&limit=5&appid=${apiKey}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $("#currentDayCard").append(`<h2>${data[0].name}, ${data[0].country}<h2>`);
      let lon = data[0].lat;
      let lat = data[0].lon;
      // passes lat lon & api key into secondary fetch function to get the "creme filling"
      getForecast(lon, lat, apiKey);
    });
};

function showTitle() {
  $("#forecastTitle").removeClass("d-n");
};

init();

$("#searchBtn").on("click", () => getLatLon());
$(".btn-secondary").on("click", checkValue);
$("#clearBtn").on("click", clearStorage);


// TO DO's
// caplitalize first letter and remove all spaces for users input
// get unix time in more user friendly format
// convert first letter of any input to capital letter
// append buttons at the end of the cycle, without refreshing page & without creating duplicatates




