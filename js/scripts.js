/*
  Autor: Diego Marinho
  Descrição: Função para buscar dados meteorológicos
*/

const apiKey = "3c23f996d4cdd36cb14d8f155af720a0";
const apiCountryURL = "https://countryflagsapi.com/png/";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
const suggestionButtons = document.querySelectorAll("#suggestions button");

const weatherElements = {
  city: document.querySelector("#city"),
  temperature: document.querySelector("#temperature span"),
  description: document.querySelector("#description"),
  weatherIcon: document.querySelector("#weather-icon"),
  country: document.querySelector("#country"),
  humidity: document.querySelector("#umidity span"),
  wind: document.querySelector("#wind span"),
};

const { errorMessageContainer, loader, weatherContainer, suggestionContainer } = {
  errorMessageContainer: document.querySelector("#error-message"),
  loader: document.querySelector("#loader"),
  weatherContainer: document.querySelector("#weather-data"),
  suggestionContainer: document.querySelector("#suggestions"),
};

const toggleLoader = () => {
  loader.classList.toggle("hide");
};

const getWeatherData = async (city) => {
  toggleLoader();

  try {
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=en`;
    const res = await fetch(apiWeatherURL);

    if (!res.ok) {
      throw new Error("City not found");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching weather data", error);
    showErrorMessage();
  } finally {
    toggleLoader();
  }
};

const showErrorMessage = () => {
  hideInformation();
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");
  suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
  hideInformation();

  try {
    const data = await getWeatherData(city);
    const { main, weather, wind, sys } = data;

    weatherElements.city.innerText = data.name;
    weatherElements.temperature.innerText = parseInt(main.temp);
    weatherElements.description.innerText = weather[0].description;
    weatherElements.weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${weather[0].icon}.png`);
    weatherElements.country.setAttribute("src", apiCountryURL + sys.country);
    weatherElements.humidity.innerText = `${main.humidity}%`;
    weatherElements.wind.innerText = `${wind.speed}km/h`;

    weatherContainer.classList.remove("hide");
  } catch (error) {
    console.error("Error displaying weather data", error);
    showErrorMessage();
  }
};

const handleSearch = async () => {
  const city = cityInput.value.trim();

  if (city) {
    showWeatherData(city);
  }
};

searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    handleSearch();
  }
});

suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.getAttribute("id");
    showWeatherData(city);
  });
});
