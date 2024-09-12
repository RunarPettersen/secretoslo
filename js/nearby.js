import { setupLoader } from './utils/loader.js';

setupLoader();

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat) / 2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon)) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
};

// Function to find and display the eight closest places to the user's location
const showNearbyPlaces = async () => {
    try {
        const response = await fetch('../json/places.json');
        if (!response.ok) {
            throw new Error('Failed to fetch places data.');
        }
        const places = await response.json();

        if (!navigator.geolocation) {
            document.getElementById('nearbyList').innerHTML = '<p>Geolocation is not supported by your browser.</p>';
            return;
        }

        // Get the user's current location
        navigator.geolocation.getCurrentPosition(position => {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;

            // Calculate distance to each place and sort by closest
            const nearbyPlaces = places
                .map(place => {
                    place.distance = calculateDistance(userLatitude, userLongitude, place.latitude, place.longitude);
                    return place;
                })
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 8); // Show the eight closest places

            // Display nearby places in a grid
            const nearbyList = document.getElementById('nearbyList');
            nearbyList.innerHTML = nearbyPlaces.map(place => `
                <div class="nearby-item">
                    <img src="../${place.image}" alt="${place.title}" class="nearby-image">
                    <h3>${place.title}</h3>
                    <p class="description">${place.introduction}</p>
                    <button onclick="window.location.href='../discover/detail.html?id=${place.id}'">View Details</button>
                </div>
            `).join('');

            // Initialize the map
            const map = L.map('map').setView([userLatitude, userLongitude], 13);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            // Add a marker for the user's location
            L.marker([userLatitude, userLongitude]).addTo(map)
                .bindPopup('You are here')
                .openPopup();

            // Add markers for each nearby place
            nearbyPlaces.forEach(place => {
                L.marker([place.latitude, place.longitude]).addTo(map)
                    .bindPopup(`<b>${place.title}</b><br>${place.introduction}`);
            });

        }, error => {
            document.getElementById('nearbyList').innerHTML = `<p>Unable to retrieve your location. Error: ${error.message}</p>`;
        });
    } catch (error) {
        console.error('Error fetching nearby places:', error);
        document.getElementById('nearbyList').innerHTML = '<p>Failed to load nearby places.</p>';
    }
};

// Initialize the function to show nearby places when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', showNearbyPlaces);