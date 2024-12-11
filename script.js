// Use your OpenWeatherMap API Key here
const apiKey = '731ba8bc9525d08ce5055e63dfbc4e98';

const weatherContainer = document.getElementById("weather");
const cityElement = document.getElementById("city");
const errorElement = document.getElementById('error');

const units = 'imperial'; // Use 'imperial' for Fahrenheit or 'metric' for Celsius
let temperatureSymbol = units === 'metric' ? "°F" : "°C";

async function getWeather() {
    try {
        // Clear previous weather info and errors
        weatherContainer.innerHTML = '';
        errorElement.innerHTML = '';
        cityElement.innerHTML = '';

        // Get the city entered by the user
        const cityInputtedByUser = document.getElementById('cityInput').value;

        // If the input is empty, show an error
        if (!cityInputtedByUser) {
            errorElement.innerHTML = 'Please enter a city name.';
            return;
        }

        // Construct the API URL
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInputtedByUser}&appid=${apiKey}&units=${units}`;

        // Fetch the weather data from the API
        const response = await fetch(apiUrl);
        
        // Check for errors in the API response
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Handle errors for invalid city
        if (data.cod === '400' || data.cod === '404') {
            errorElement.innerHTML = `City not found. Please input another city.`;
            return;
        }

        // Display the city name at the top
        cityElement.innerHTML = `Hourly Weather for ${data.city.name}`;

        // Display weather data for each 3-hour increment (next 24 hours)
        data.list.slice(0, 8).forEach(hourlyWeatherData => {
            const hourlyWeatherDataDiv = createWeatherDescription(hourlyWeatherData);
            weatherContainer.appendChild(hourlyWeatherDataDiv);
        });

    } catch (error) {
        console.log(error);
        errorElement.innerHTML = 'An error occurred. Please try again later.';
    }
}

function convertToLocalTime(dt) {
    const date = new Date(dt * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${period}`;
}

function createWeatherDescription(weatherData) {
    const { main, weather, dt } = weatherData;

    const description = document.createElement("div");
    const convertedDateAndTime = convertToLocalTime(dt);

    // Create a div with a sleek card-like design
    description.classList.add("weather-card");

    // Fetch the weather condition icon based on the weather data
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

    // Create the HTML content for each hourly weather update
    description.innerHTML = `
        <div class="weather-info">
            <img src="${iconUrl}" alt="Weather Icon" class="weather-icon">
            <div class="weather-details">
                <h3>${main.temp}${temperatureSymbol}</h3>
                <p><strong>Condition:</strong> ${weather[0].description}</p>
                <p><strong>Time:</strong> ${convertedDateAndTime.substring(10)}</p>
                <p><strong>Date:</strong> ${convertedDateAndTime.substring(5, 10)}</p>
            </div>
        </div>
    `;
    
    // Add transition class to ensure smooth fade-in effect
    setTimeout(() => {
        description.classList.add("show");
    }, 100);

    return description;
}