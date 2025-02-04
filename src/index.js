function refreshWeather(response) {
  let temperaturesElement = document.querySelector("#temperatures");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let icon = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(new Date(response.data.time * 1000));
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  temperaturesElement.innerHTML = Math.round(response.data.temperature.current);
  windSpeedElement.innerHTML = `${response.data.wind.speed} km/h`;
  icon.innerHTML = `<img src="${response.data.condition.icon_url}" alt="Weather Icon" class="degree-icon"/>`;

  getForecast(response.data.city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "607f2b3e7boc10f3aa38ta0b3f655e47";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(refreshWeather)
    .catch((error) => {
      console.error("API Error:", error);
    });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-bar-input");

  // Update cityElement
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = searchInput.value;

  // Call searchCity with the user input
  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "607f2b3e7boc10f3aa38ta0b3f655e47";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

// forecast function
function displayForecast(response) {
  console.log(response.data.daily);

  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 7) {
      forecastHtml =
        forecastHtml +
        `
    <div class="weather-forecast-day">
      <div class="weather-forecast-date">${formatDay(day.time)}</div>
      
        <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
      
       <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong> ${Math.round(day.temperature.maximum)}°C</strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            day.temperature.minimum
          )}°C</div>
        </div>

    </div>
        `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

// Add event listener for form submission
let searchFormElement = document.querySelector("#search-bar");
searchFormElement.addEventListener("submit", handleSearchSubmit);

// Default city search
searchCity("Paris");
getForecast("Paris");
