import { baseurl, apiKey } from '../constants/api.js';

// Function to fetch weather data for a given city
export const fetchWeatherData = async (city) => {
    try {
        const response = await fetch(`${baseurl}/current.json?key=${apiKey}&q=${city}`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data. Please try again later.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayMessage('Failed to fetch weather data. Please check your connection and try again.', 'error');
        return null;
    }
};

// Function to display the weather data in the specified section
export const displayWeather = (weatherData) => {
    if (!weatherData) return;

    const weatherSection = document.querySelector('.weather-section');
    const { location, current } = weatherData;

    weatherSection.innerHTML = `
        <div class="weather-content">
            <h3>Weather in ${location.name}, ${location.country}</h3>
            <div class="weather-container">
                <img src="${current.condition.icon}" alt="${current.condition.text}">
                <div> 
                <p>Temperature: ${current.temp_c}°C</p>
                <p>Feels like: ${current.feelslike_c}°C</p>
                <p>Condition: ${current.condition.text}</p>
                <p>Wind: ${current.wind_kph} kph</p>
                <p>Humidity: ${current.humidity}%</p>
                </div>
            </div>
            
        </div>
    `;
};

// Function to display messages (e.g., errors)
export const displayMessage = (message, type = 'error') => {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type}`;
    messageContainer.innerText = message;
    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 5000);
};