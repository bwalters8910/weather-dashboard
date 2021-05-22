let cities = [];



function init() {
  checkLocalStorage();
};

function addBorder() {
  $("#currentDayCard").addClass("b-s");
};

function appendForcast(data) {
  showTitle();

  for (i = 1; i < 6; i++) {
    let unixTime = data.daily[i].dt;
    let date = new Date(unixTime * 1000);
    // need to reformat the date to match

    $("#forecastContainer").append(
      `<div class="d-f f-d-c b-s p-20px">
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
  let date = new Date(unixTime * 1000);

  $("#currentDayCard").append(
    `<h2>${date} <image src="https://openweathermap.org/img/w/${data.current.weather[0].icon}.png"></h2>
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
      return response.json();
    })
    .then(function (data) {
      appendToday(data);
      appendForcast(data);
    });
};

function getLatLon(city) {
  clearCurrentInfo();
  let chosenCity = city || $("#cityInput").val() || "chicago";
  if (!cities.includes(chosenCity)) {
    cities.push(chosenCity);
  }
  storeCity();
  let apiKey = "c4688ef0bd37f92ed6bda82728650dcc";
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${chosenCity}&limit=5&appid=${apiKey}`)
    .then(function (response) {
      console.log(response.status);
      console.log(response);
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
// append buttons at the end of the cycle, without refreshing page




