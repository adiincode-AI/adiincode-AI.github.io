async function getWeather() {

  const city = document.getElementById("cityInput").value;
  const weatherResult = document.getElementById("weatherResult");

  if (!city) {
    weatherResult.innerHTML = "<p>Please enter a city.</p>";
    return;
  }

  weatherResult.innerHTML = "<p>Loading...</p>";

  try {

    const response = await fetch(
      `https://weather-api-xxxx.onrender.com/weather/${city}`
    );

    const data = await response.json();

    console.log(data);

    if (data.error) {
      weatherResult.innerHTML = `
        <p>${data.error}</p>
      `;
      return;
    }

    weatherResult.innerHTML = `
      <div class="weather-output">
        <h4>${data.city}</h4>

        <p>Temperature: ${data.temperature} °C</p>

        <p>Humidity: ${data.humidity}%</p>

        <p> Weather: ${data.weather}</p>

        <p>${data.description}</p>
      </div>
    `;

  } catch (error) {

    console.error(error);

    weatherResult.innerHTML = `
      <p>Failed to fetch weather data.</p>
    `;
  }
}