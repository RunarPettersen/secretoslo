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

// Function to toggle fullscreen mode
const toggleFullscreen = (element) => {
    if (!document.fullscreenElement) {
        element.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
};

// Function to create a fullscreen button on the map
const createFullscreenButton = (mapContainer) => {
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'fullscreen-btn';
    fullscreenBtn.innerHTML = '🗖'; // Unicode for fullscreen icon

    fullscreenBtn.style.position = 'absolute';
    fullscreenBtn.style.top = '10px';
    fullscreenBtn.style.right = '10px';
    fullscreenBtn.style.padding = '10px';
    fullscreenBtn.style.backgroundColor = 'white';
    fullscreenBtn.style.border = 'none';
    fullscreenBtn.style.borderRadius = '4px';
    fullscreenBtn.style.cursor = 'pointer';
    fullscreenBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

    fullscreenBtn.addEventListener('click', () => toggleFullscreen(mapContainer));

    mapContainer.appendChild(fullscreenBtn);
};

// Function to find and display nearby places and add all places to the map
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
            places.forEach(place => {
                place.distance = calculateDistance(userLatitude, userLongitude, place.latitude, place.longitude);
            });

            // Sort places by distance and display the eight closest
            const nearbyPlaces = places.sort((a, b) => a.distance - b.distance).slice(0, 8);

            // Display nearby places in a grid
            const nearbyList = document.getElementById('nearbyList');
            nearbyList.innerHTML = nearbyPlaces.map(place => `
                <div class="nearby-item">
                    <img src="../${place.image}" alt="${place.title}" class="nearby-image">
                    <h3>${place.title}</h3>
                    <p class="description">${place.introduction}</p>
                    <p class="distance">${place.distance.toFixed(2)} km away</p>
                    <button onclick="window.location.href='../discover/detail.html?id=${place.id}'">View Details</button>
                </div>
            `).join('');

            // Initialize the map centered on the user's location
            const mapContainer = document.getElementById('map');
            const map = L.map(mapContainer).setView([userLatitude, userLongitude], 13);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            // Add a marker for the user's location
            L.marker([userLatitude, userLongitude]).addTo(map)
                .bindPopup('You are here')
                .openPopup();

            // Add markers for all places and make the titles clickable
            places.forEach(place => {
                L.marker([place.latitude, place.longitude]).addTo(map)
                    .bindPopup(`
                        <b><a href="../discover/detail.html?id=${place.id}" target="_blank" rel="noopener noreferrer">${place.title}</a></b><br>
                        ${place.introduction}<br>
                        ${place.distance.toFixed(2)} km away
                    `);
            });

            // Create a fullscreen button on the map
            createFullscreenButton(mapContainer);

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