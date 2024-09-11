let currentImageIndex = 0; // Track the current image index
let imageFilenames = []; // Store the list of image filenames for navigation
let galleryPath = ''; // Store the gallery path for constructing image URLs

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
            displayGalleryImages(destination.galleryPath, destination.galleryImages);
        } else {
            document.getElementById('destinationDetails').innerHTML = '<p>Destination not found.</p>';
        }
    } catch (error) {
        console.error('Error fetching destination details:', error);
    }
};

const displayDestinationDetails = (destination) => {
    const detailSection = document.getElementById('destinationDetails');
    detailSection.innerHTML = `
        <img src="${destination.image}" alt="${destination.title}" class="destination-image">
        <p><strong>${destination.introduction}</strong></p>
        <div class="description">${destination.description}</div>
        <p><strong>Location:</strong> ${destination.where}</p>
        <p><strong>Address:</strong> ${destination.address}</p>
        <p><strong>Category:</strong> ${destination.category}</p>
        <p><strong>Tags:</strong> ${destination.tags.join(', ')}</p>
        <button id="favorite-btn" class="favorite-btn">${isFavorite(destination.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        <div id="gallery" class="gallery"></div> <!-- Gallery section -->
    `;
    document.getElementById('detail-title').textContent = destination.title;

    // Add event listener to the favorite button
    document.getElementById('favorite-btn').addEventListener('click', () => {
        toggleFavorite(destination);
    });
};

const displayGalleryImages = (path, filenames) => {
    const gallery = document.getElementById('gallery');
    imageFilenames = filenames; // Store filenames for navigation
    galleryPath = path; // Store the gallery path for constructing full image URLs

    if (imageFilenames && imageFilenames.length > 0) {
        imageFilenames.forEach((filename, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = `${galleryPath}/${filename}`; // Correctly construct the image path
            imgElement.alt = "Gallery Image";
            imgElement.className = 'gallery-image';

            // Add click event to open image in lightbox
            imgElement.addEventListener('click', () => openLightbox(index));

            gallery.appendChild(imgElement);
        });
    } else {
        gallery.innerHTML = '<p>No images available in the gallery.</p>';
    }
};

// Function to open the lightbox with the clicked image
const openLightbox = (index) => {
    currentImageIndex = index;
    updateLightboxImage();
    document.getElementById('lightbox').style.display = 'flex';
};

// Function to update the image in the lightbox
const updateLightboxImage = () => {
    const lightboxImg = document.getElementById('lightbox').querySelector('img');
    lightboxImg.src = `${galleryPath}/${imageFilenames[currentImageIndex]}`; // Correctly construct the image path for lightbox
};

// Function to close the lightbox
const closeLightbox = () => {
    document.getElementById('lightbox').style.display = 'none';
};

// Function to show the next image
const showNextImage = () => {
    currentImageIndex = (currentImageIndex + 1) % imageFilenames.length;
    updateLightboxImage();
};

// Function to show the previous image
const showPrevImage = () => {
    currentImageIndex = (currentImageIndex - 1 + imageFilenames.length) % imageFilenames.length;
    updateLightboxImage();
};

// Add event listeners for the lightbox buttons and background
document.addEventListener('DOMContentLoaded', () => {
    // Close lightbox when clicking outside the image or on the close button
    document.getElementById('lightbox').addEventListener('click', (event) => {
        if (event.target.classList.contains('close')) {
            closeLightbox();
        }
    });

    // Event listeners for navigation buttons
    document.getElementById('next-btn').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from closing lightbox
        showNextImage();
    });

    document.getElementById('prev-btn').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from closing lightbox
        showPrevImage();
    });
});

const isFavorite = (id) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.id === id);
};

const toggleFavorite = (destination) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (isFavorite(destination.id)) {
        favorites = favorites.filter(fav => fav.id !== destination.id);
        alert('Removed from Favorites');
    } else {
        favorites.push(destination);
        alert('Added to Favorites');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    document.getElementById('favorite-btn').textContent = isFavorite(destination.id) ? 'Remove from Favorites' : 'Add to Favorites';
};

document.addEventListener('DOMContentLoaded', fetchDestinationDetails);
