import { setupLoader } from './utils/loader.js';
import { displayGalleryImages } from './utils/gallery.js';
import { isFavorite, toggleFavorite } from './utils/favoritesManager.js';
import { showNearbyPlaces } from './utils/nearbyCalculator.js';
import { displayMessage } from './utils/uiUtils.js';

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
            showNearbyPlaces(currentDestination, destinations);
        } else {
            document.getElementById('destinationDetails').innerHTML = '<p>Destination not found.</p>';
        }
    } catch (error) {
        console.error('Error fetching destination details:', error);
    }
};

// Function to convert secret level number to stars
const getStars = (level) => {
    return '★'.repeat(level);
};

const displayDestinationDetails = (destination) => {
    const detailSection = document.getElementById('destinationDetails');
    const homepageLink = destination.homepage ? `<p><strong>Homepage:</strong> <a href="${destination.homepage}" target="_blank" rel="noopener noreferrer">${destination.homepage}</a></p>` : '';

    // Convert secret level to an integer
    const secretLevel = parseInt(destination.secretLevel, 10);
    const secretLevelStars = getStars(secretLevel);

    // Determine the CSS class for the stars
    const starClass = secretLevel === 10 ? 'yellow-stars' : 'default-stars';

    detailSection.innerHTML = `
        <img src="../${destination.image}" alt="${destination.title}" class="destination-image">
        <p><strong>${destination.introduction}</strong></p>
        <div class="description">${destination.description}</div>
        <p><strong>Location:</strong> ${destination.where}</p>
        <p><strong>Address:</strong> ${destination.address}</p>
        <p><strong>Category:</strong> ${destination.category.join(', ')}</p>
        <p><strong>Tags:</strong> ${destination.tags.join(', ')}</p>
        <p><strong>Secret Level:</strong> <span class="${starClass}">${secretLevelStars}</span></p>
        ${homepageLink}
        <button id="favorite-btn" class="favorite-btn">
            <i class="${isFavorite(destination.id) ? 'fas fa-heart' : 'far fa-heart'}"></i>
            ${isFavorite(destination.id) ? ' Remove from Favorites' : ' Add to Favorites'}
        </button>
        <div id="gallery" class="gallery"></div>
    `;
    document.getElementById('detail-title').textContent = destination.title;

    document.getElementById('favorite-btn').addEventListener('click', () => {
        toggleFavorite(destination, updateFavoriteButton);
    });
};

const updateFavoriteButton = (id) => {
    const favoriteBtn = document.getElementById('favorite-btn');
    favoriteBtn.innerHTML = `
        <i class="${isFavorite(id) ? 'fas fa-heart' : 'far fa-heart'}"></i>
        ${isFavorite(id) ? ' Remove from Favorites' : ' Add to Favorites'}
    `;
};

document.addEventListener('DOMContentLoaded', fetchDestinationDetails);