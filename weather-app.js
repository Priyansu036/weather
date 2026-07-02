const apiKey = '1c059f0b7d1951dd69eb19758aa30605';
const currentUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const celsiusBtn = document.getElementById('celsiusBtn');
const fahrenheitBtn = document.getElementById('fahrenheitBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const messageBox = document.getElementById('messageBox');
const locationLabel = document.getElementById('locationLabel');
const conditionLabel = document.getElementById('conditionLabel');
const cityName = document.getElementById('cityName');
const temperatureValue = document.getElementById('temperatureValue');
const temperatureUnit = document.getElementById('temperatureUnit');
const weatherDescription = document.getElementById('weatherDescription');
const weatherMain = document.getElementById('weatherMain');
const weatherIcon = document.getElementById('weatherIcon');
const humidityValue = document.getElementById('humidityValue');
const windSpeedValue = document.getElementById('windSpeedValue');
const feelsLikeValue = document.getElementById('feelsLikeValue');
const forecastGrid = document.getElementById('forecastGrid');
const pageShell = document.querySelector('.app-shell');

let activeUnit = 'metric';
let currentWeatherData = null;

function selectWeatherBackground(main) {
  const type = main.toLowerCase();
  if (type.includes('cloud')) return 'bg-cloudy';
  if (type.includes('rain') || type.includes('drizzle') || type.includes('thunder')) return 'bg-rainy';
  if (type.includes('snow')) return 'bg-snowy';
  if (type.includes('mist') || type.includes('fog') || type.includes('haze')) return 'bg-mist';
  return 'bg-sunny';
}

function showSpinner(show) {
  loadingSpinner.style.display = show ? 'block' : 'none';
}

function displayMessage(text, isError = true) {
  messageBox.style.display = 'block';
  messageBox.textContent = text;
  messageBox.style.background = isError ? 'rgba(248, 113, 113, 0.13)' : 'rgba(34, 197, 94, 0.12)';
  messageBox.style.borderColor = isError ? 'rgba(248, 113, 113, 0.28)' : 'rgba(34, 197, 94, 0.25)';
  if (!text) messageBox.style.display = 'none';
}

function formatTemperature(value) {
  return Math.round(value);
}

function getIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function getWindLabel(speed) {
  return activeUnit === 'metric' ? `${Math.round(speed * 3.6)} km/h` : `${Math.round(speed)} mph`;
}

function updateCurrentWeather(data) {
  currentWeatherData = data;
  const unitSymbol = activeUnit === 'metric' ? '°C' : '°F';
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperatureValue.textContent = formatTemperature(data.main.temp);
  temperatureUnit.textContent = unitSymbol;
  weatherDescription.textContent = data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());
  weatherMain.textContent = data.weather[0].main;
  humidityValue.textContent = `${data.main.humidity}%`;
  windSpeedValue.textContent = getWindLabel(data.wind.speed);
  feelsLikeValue.textContent = `${formatTemperature(data.main.feels_like)}${unitSymbol}`;
  weatherIcon.src = getIconUrl(data.weather[0].icon);
  weatherIcon.alt = data.weather[0].description;
  locationLabel.textContent = `Weather loaded for ${data.name}`;
  conditionLabel.textContent = `${data.weather[0].main} · Feels like ${Math.round(data.main.feels_like)}${unitSymbol}`;

  const backgroundClass = selectWeatherBackground(data.weather[0].main);
  pageShell.classList.remove('bg-sunny','bg-rainy','bg-cloudy','bg-snowy','bg-mist');
  pageShell.classList.add(backgroundClass);
}

function createForecastItem(dayLabel, icon, tempMin, tempMax, description) {
  return `
    <div class="forecast-item">
      <span>${dayLabel}</span>
      <img src="${getIconUrl(icon)}" alt="${description}" />
      <strong>${Math.round(tempMax)}° / ${Math.round(tempMin)}°</strong>
      <span>${description}</span>
    </div>
  `;
}

function updateForecast(data) {
  const daily = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString(undefined, { weekday: 'short' });
    if (!daily[day]) {
      daily[day] = [];
    }
    daily[day].push(item);
  });

  const items = Object.keys(daily).slice(0, 5).map(day => {
    const dayForecast = daily[day];
    const midday = dayForecast[Math.floor(dayForecast.length / 2)];
    const temps = dayForecast.map(entry => entry.main.temp);
    const tempMin = Math.min(...temps);
    const tempMax = Math.max(...temps);
    const description = midday.weather[0].main;
    const icon = midday.weather[0].icon;
    return createForecastItem(day, icon, tempMin, tempMax, description);
  });

  forecastGrid.innerHTML = items.join('');
}

async function fetchWeatherByCoords(lat, lon) {
  showSpinner(true);
  displayMessage('');
  try {
    const [current, forecast] = await Promise.all([
      fetch(`${currentUrl}?lat=${lat}&lon=${lon}&units=${activeUnit}&appid=${apiKey}`),
      fetch(`${forecastUrl}?lat=${lat}&lon=${lon}&units=${activeUnit}&appid=${apiKey}`)
    ]);

    if (!current.ok) {
      const err = await current.json().catch(() => ({}));
      throw new Error(err.message || 'Unable to fetch current weather');
    }
    if (!forecast.ok) {
      const err = await forecast.json().catch(() => ({}));
      throw new Error(err.message || 'Unable to fetch forecast');
    }

    const currentData = await current.json();
    const forecastData = await forecast.json();

    updateCurrentWeather(currentData);
    updateForecast(forecastData);
  } catch (error) {
    console.error('Weather fetch by coords failed:', error);
    displayMessage(error.message || 'Could not load weather data. Try again or search a city.');
  } finally {
    showSpinner(false);
  }
}

async function fetchWeatherByCity(city) {
  if (!city) {
    displayMessage('Please enter a city name before searching.');
    return;
  }
  showSpinner(true);
  displayMessage('');
  try {
    const currentResp = await fetch(`${currentUrl}?q=${encodeURIComponent(city)}&units=${activeUnit}&appid=${apiKey}`);
    if (!currentResp.ok) {
      const errorData = await currentResp.json().catch(() => ({}));
      throw new Error(errorData.message || 'City not found');
    }
    const currentData = await currentResp.json();
    const forecastResp = await fetch(`${forecastUrl}?q=${encodeURIComponent(city)}&units=${activeUnit}&appid=${apiKey}`);
    if (!forecastResp.ok) {
      const errorData = await forecastResp.json().catch(() => ({}));
      throw new Error(errorData.message || 'Unable to load forecast');
    }
    const forecastData = await forecastResp.json();

    updateCurrentWeather(currentData);
    updateForecast(forecastData);
  } catch (error) {
    console.error('Weather fetch by city failed:', error);
    if (error.message.toLowerCase().includes('city not found')) {
      displayMessage('City not found. Please check spelling and try again.');
    } else if (error.message.toLowerCase().includes('invalid api key')) {
      displayMessage('Invalid API key. Replace YOUR_API_KEY in weather-app.js with your OpenWeatherMap key.');
    } else {
      displayMessage(error.message || 'Unable to fetch weather data. Please try again later.');
    }
  } finally {
    showSpinner(false);
  }
}

function setUnit(unit) {
  if (activeUnit === unit) return;
  activeUnit = unit;
  celsiusBtn.classList.toggle('active', unit === 'metric');
  fahrenheitBtn.classList.toggle('active', unit === 'imperial');
  if (currentWeatherData) {
    const search = cityInput.value.trim() || currentWeatherData.name;
    fetchWeatherByCity(search);
  }
}

function handleGeolocationError(error) {
  let message = 'Location access denied. Use the search field instead.';
  if (error.code === 1) {
    message = 'Location permission denied. Please allow location access or search manually.';
  } else if (error.code === 2) {
    message = 'Unable to determine your location. Try again or use a city search.';
  } else if (error.code === 3) {
    message = 'Location request timed out. Please try again.';
  }
  console.error('Geolocation error:', error);
  displayMessage(message);
}

function requestLocation() {
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    displayMessage('Replace YOUR_API_KEY in weather-app.js with your OpenWeatherMap API key.', true);
    return;
  }

  displayMessage('Detecting your location...', false);
  if (!navigator.geolocation) {
    displayMessage('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      displayMessage('Loading weather for your current location...', false);
      fetchWeatherByCoords(latitude, longitude);
    },
    handleGeolocationError,
    { timeout: 10000 }
  );
}

searchBtn.addEventListener('click', () => {
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    displayMessage('Replace YOUR_API_KEY in weather-app.js with your OpenWeatherMap API key.', true);
    return;
  }
  displayMessage('');
  fetchWeatherByCity(cityInput.value.trim());
});

cityInput.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    fetchWeatherByCity(cityInput.value.trim());
  }
});

celsiusBtn.addEventListener('click', () => setUnit('metric'));
fahrenheitBtn.addEventListener('click', () => setUnit('imperial'));
geoBtn.addEventListener('click', requestLocation);

window.addEventListener('load', () => {
  requestLocation();
});
