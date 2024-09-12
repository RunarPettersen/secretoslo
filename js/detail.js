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
        const destination = destinations.find(dest => dest.id == destinationId);

        if (destination) {
            displayDestinationDetails(destination);
            displayGalleryImages(destination.galleryPath, destination.galleryImages); // Call the separated function
        } else {
            document.getElementById('destinationDetails').innerHTML = '<p>Destination not found.</p>';
        }
    } catch (error) {
        console.error('Error fetching destination details:', error);
    }
};

const displayDestinationDetails = (destination) => {
    const detailSection = document.getElementById('destinationDetails');
    
    // Check if the destination has a homepage link
    const homepageLink = destination.homepage ? `<p><strong>Homepage:</strong> <a href="${destination.homepage}" target="_blank" rel="noopener noreferrer">${destination.homepage}</a></p>` : '';

    detailSection.innerHTML = `
        <img src="../${destination.image}" alt="${destination.title}" class="destination-image">
        <p><strong>${destination.introduction}</strong></p>
        <div class="description">${destination.description}</div>
        <p><strong>Location:</strong> ${destination.where}</p>
        <p><strong>Address:</strong> ${destination.address}</p>
        <p><strong>Category:</strong> ${destination.category}</p>
        <p><strong>Tags:</strong> ${destination.tags.join(', ')}</p>
        ${homepageLink} <!-- Conditionally include the homepage link -->
        <button id="favorite-btn" class="favorite-btn">${isFavorite(destination.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        <div id="gallery" class="gallery"></div> <!-- Gallery section -->
    `;
    document.getElementById('detail-title').textContent = destination.title;

    // Add event listener to the favorite button
    document.getElementById('favorite-btn').addEventListener('click', () => {
        toggleFavorite(destination);
    });
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
    document.getElementById('favorite-btn').textContent = isFavorite(destination.id) ? 'Remove from Favorites' : 'Add to Favorites';
};

document.addEventListener('DOMContentLoaded', fetchDestinationDetails);
