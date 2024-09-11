export const fetchPlaces = async () => {
    try {
        const response = await fetch('json/places.json'); // Update the path if necessary
        if (!response.ok) {
            throw new Error('Failed to fetch places data. Please try again later.');
        }
        const places = await response.json();
        displayPlaces(places, 'restaurant', '.restaurants-section'); // Display restaurants
        displayPlaces(places, 'monument', '.monuments-section'); // Display monuments
    } catch (error) {
        console.error('Error fetching places:', error);
        displayMessage('Failed to load places. Please check your internet connection and try again.', 'error');
    }
};

// Function to display places in the grid
export const displayPlaces = (places, category, sectionSelector) => {
    const placesSection = document.querySelector(sectionSelector);

    // Filter to get only the places of the specified category
    const filteredPlaces = places.filter(place => place.category.toLowerCase() === category.toLowerCase());

    // Limit to first 3 places and add a "See More" button as the fourth item
    const placesToShow = filteredPlaces.slice(0, 3);

    // Create grid items for the first three places
    placesToShow.forEach(place => {
        const placeElement = document.createElement('div');
        placeElement.className = 'place-item';
        placeElement.style.cursor = 'pointer'; // Indicate that the element is clickable

        // Make the whole place element clickable
        placeElement.addEventListener('click', () => {
            // Redirect to detail.html with the place ID as a query parameter
            window.location.href = `discover/detail.html?id=${place.id}`;
        });

        // Parse description and ensure consistent HTML structure
        const parser = new DOMParser();
        const parsedDescription = parser.parseFromString(place.description, 'text/html');
        const textContent = parsedDescription.body.textContent || "";

        // Truncate to first 200 characters
        const shortDescription = textContent.slice(0, 200) + (textContent.length > 200 ? '...' : '');

        placeElement.innerHTML = `
            <h3>${place.title}</h3>
            <p class="description">${shortDescription}</p>
            <img src="${place.image}" alt="${place.title}" class="place-image">
        `;
        placesSection.appendChild(placeElement);
    });

    // Add "See More" button as the fourth grid item
    const seeMoreElement = document.createElement('div');
    seeMoreElement.className = 'place-item see-more';
    seeMoreElement.innerHTML = `
        <button class="see-more-btn">See More</button>
    `;
    seeMoreElement.addEventListener('click', () => {
        // Redirect to the discover page or handle see more action
        window.location.href = 'discover/index.html';
    });
    placesSection.appendChild(seeMoreElement);
};