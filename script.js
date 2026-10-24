
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const result = document.getElementById("weather-result");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    result.textContent = "Please enter a city name.";
    return;
  }

  result.textContent = "Loading weather...";

  try {
    const geoUrl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("City search failed");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      result.textContent = "City not found. Try another city.";
      return;
    }

    const place = geoData.results[0];

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Weather request failed");
    }

    const weatherData = await weatherResponse.json();
    const weather = weatherData.current;

    result.innerHTML = `
      <h2>${place.name}, ${place.country || ""}</h2>
      <p>🌡️ Temperature: ${weather.temperature_2m} °C</p>
      <p>🤗 Feels like: ${weather.apparent_temperature} °C</p>
      <p>💧 Humidity: ${weather.relative_humidity_2m}%</p>
      <p>💨 Wind speed: ${weather.wind_speed_10m} km/h</p>
      <p><small>Updated: ${weather.time.replace("T", " ")}</small></p>
    `;
  } catch (error) {
    result.textContent =
      "Unable to load weather. Check your internet and try again.";
    console.error(error);
  }
});
