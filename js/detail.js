import { setupLoader } from './utils/loader.js';
import { displayGalleryImages } from './utils/gallery.js'; // Import the gallery functions

setupLoader();

const fetchDestinationDetails = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const destinationId = urlParams.get('id');

    try {
        const response = await fetch('../json/places.json');
        if (!response.ok) {
            throw new Error('Failed to fetch destinations data.');
        }
        const destinations = await response.json();
        const currentDestination = destinations.find(dest => dest.id == destinationId);

        if (currentDestination) {
            displayDestinationDetails(currentDestination);
            displayGalleryImages(currentDestination.galleryPath, currentDestination.galleryImages);
            // Call the function to show nearby places relative to the current place
            showNearbyPlaces(currentDestination, destinations);
        } else {
            document.getElementById('destinationDetails').innerHTML = '<p>Destination not found.</p>';
        }
    } catch (error) {
        console.error('Error fetching destination details:', error);
    }
};

const displayDestinationDetails = (destination) => {
    const detailSection = document.getElementById('destinationDetails');
    const homepageLink = destination.homepage ? `<p><strong>Homepage:</strong> <a href="${destination.homepage}" target="_blank" rel="noopener noreferrer">${destination.homepage}</a></p>` : '';

    detailSection.innerHTML = `
        <img src="../${destination.image}" alt="${destination.title}" class="destination-image">
        <p><strong>${destination.introduction}</strong></p>
        <div class="description">${destination.description}</div>
        <p><strong>Location:</strong> ${destination.where}</p>
        <p><strong>Address:</strong> ${destination.address}</p>
        <p><strong>Category:</strong> ${destination.category}</p>
        <p><strong>Tags:</strong> ${destination.tags.join(', ')}</p>
        ${homepageLink}
        <button id="favorite-btn" class="favorite-btn">
            <i class="${isFavorite(destination.id) ? 'fas fa-heart' : 'far fa-heart'}"></i>
            ${isFavorite(destination.id) ? ' Remove from Favorites' : ' Add to Favorites'}
        </button>
        <div id="gallery" class="gallery"></div> <!-- Gallery section -->
    `;
    document.getElementById('detail-title').textContent = destination.title;

    // Add event listener to the favorite button
    document.getElementById('favorite-btn').addEventListener('click', () => {
        toggleFavorite(destination);
        updateFavoriteButton(destination.id); // Update the button's icon and text
    });
};

// Function to update the favorite button
const updateFavoriteButton = (id) => {
    const favoriteBtn = document.getElementById('favorite-btn');
    favoriteBtn.innerHTML = `
        <i class="${isFavorite(id) ? 'fas fa-heart' : 'far fa-heart'}"></i>
        ${isFavorite(id) ? ' Remove from Favorites' : ' Add to Favorites'}
    `;
};

// Function to find and display the four closest places to the current place
const showNearbyPlaces = (currentDestination, allDestinations) => {
    // Define a function to calculate distance using the Haversine formula
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

    // Filter and sort places by distance to the current destination, excluding itself
    const nearbyPlaces = allDestinations
        .filter(place => place.id !== currentDestination.id)
        .map(place => {
            place.distance = calculateDistance(
                currentDestination.latitude,
                currentDestination.longitude,
                place.latitude,
                place.longitude
            );
            return place;
        })
        .sort((a, b) => a.distance - b.distance) // Sort by distance
        .slice(0, 4); // Take the four closest places

    // Display the four closest places in a grid
    const nearbyList = document.getElementById('nearbyList');
    if (nearbyPlaces.length > 0) {
        nearbyList.innerHTML = nearbyPlaces.map(place => `
            <div class="nearby-item">
                <img src="../${place.image}" alt="${place.title}" class="nearby-image">
                <h3>${place.title}</h3>
                <p class="description">${place.introduction}</p>
                <button onclick="window.location.href='detail.html?id=${place.id}'">View Details</button>
            </div>
        `).join('');
    } else {
        nearbyList.innerHTML = '<p>No nearby places found.</p>';
    }
};

const isFavorite = (id) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.id === id);
};

const displayMessage = (message, type = 'success') => {
    const container = document.getElementById('notification-container');

    // Create the notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Create a close button for the notification
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => {
        container.removeChild(notification);
    });

    // Append the close button to the notification
    notification.appendChild(closeBtn);

    // Append the notification to the container
    container.appendChild(notification);

    setTimeout(() => {
        if (container.contains(notification)) {
            container.removeChild(notification);
        }
    }, 3000);
};

const toggleFavorite = (destination) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (isFavorite(destination.id)) {
        favorites = favorites.filter(fav => fav.id !== destination.id);
        displayMessage('Removed from Favorites', 'error');
    } else {
        favorites.push(destination);
        displayMessage('Added to Favorites', 'success');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

document.addEventListener('DOMContentLoaded', fetchDestinationDetails);