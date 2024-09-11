import { fetchWeatherData, displayWeather } from './utils/weather.js';
import { fetchPlaces } from './utils/places.js'; // Import the fetchPlaces function

const initApp = async () => {
    try {
        // Fetch weather data for Oslo, Norway
        const weatherData = await fetchWeatherData('Oslo');
        displayWeather(weatherData);

        // Fetch places data
        await fetchPlaces();
    } catch (error) {
        console.error('Error initializing app:', error);
        displayMessage('An error occurred while loading the app. Please try again later.', 'error');
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', initApp);
