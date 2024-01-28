function getWeather() {
    const apiKey = '4d8fb5b93d4af21d66a2948710284366';
    const city = document.getElementById('city').value;

    if (!city) {
        displayErrorMessage('Please enter a country or city')
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            displayErrorMessage('Error fetching current weather data. Please try again.')
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            displayErrorMessage('Error fetching hourly forecast data. Please try again.')
        });
}

function displayWeather(data) {
    const weatherInfoDiv = document.getElementById('weather-info');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';

    if (data.cod === '404') {
        displayErrorMessage(data.message)
    } else {
        const currentDate = new Date();
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        dateTime = new Date(data.dt * 1000 + currentDate.getTimezoneOffset() * 60000).toDateString();

        const weatherHtml = `
            <div class="card-bg rounded shadow-sm">
                <div class="d-flex flex-row justify-content-center align-items-center p-4">
                    <div class="p-3">
                        <img src="${iconUrl}" alt="${description}" />
                        <h4 class="text-center">${temperature}°C</h4>
                    </div>
                    <div class="p-3">
                        <h6 class="text-muted">${dateTime}</h6>
                        <h3>${cityName}</h3>
                        <span class="badge bg-light text-dark">${description}</span>
                    </div>
                </div>
                <div class="d-flex flex-row justify-content-center align-items-center">
                    <div class="p-4 d-flex justify-content-center align-items-center">
                        <i class='bx bx-droplet'></i>
                        <span>${humidity}%</span>
                    </div>
                    <div class="p-4 d-flex justify-content-center align-items-center">
                        <i class='bx bxs-thermometer'></i>
                        <span>${pressure} mB</span>
                    </div>
                    <div class="p-4 d-flex justify-content-center align-items-center">
                        <i class='bx bx-wind'></i>
                        <span>${windSpeed} km/h</span>
                    </div>
                </div>
            </div>
            `;

        weatherInfoDiv.innerHTML = weatherHtml;
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="p-4 d-flex flex-column">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
            `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function displayErrorMessage(text) {
    const weatherInfoDiv = document.getElementById('weather-info');
    weatherInfoDiv.innerHTML = `
            <div class="rounded shadow-sm">
                <div class="d-flex flex-row justify-content-center align-items-center p-4">
                    <div class="p-3">
                        <span>${text}</span>
                    </div>
                </div>
            </div>
            `;
    return;
}