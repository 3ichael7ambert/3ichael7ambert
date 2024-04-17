// Replace 'YOUR_IPGEOLOCATION_API_KEY'
const ipGeolocationApiKey = "YOUR_IPGEOLOCATION_API_KEY";
// Replace 'YOUR_OPENWEATHERMAP_API_KEY'
const openWeatherMapApiKey = "YOUR_OPENWEATHERMAP_API_KEY";

// Function to get user's location using IP Geolocation API
function getUserLocation() {
  return fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=${ipGeolocationApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data.city;
    })
    .catch((error) => {
      console.error("Error fetching user location:", error);
    });
}

// Function to fetch weather data using OpenWeatherMap API
function fetchWeather(city) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data.weather[0].main;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

// Main function to fetch weather for user's location
async function getWeatherForUserLocation() {
  try {
    const city = await getUserLocation();
    if (city) {
      const weather = await fetchWeather(city);
      if (weather) {
        document.getElementById(
          "weather-info"
        ).innerText = `Current weather in ${city}: ${weather}`;
      } else {
        console.log("Unable to fetch weather data.");
      }
    } else {
      console.log("Unable to determine user location.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

getWeatherForUserLocation();
