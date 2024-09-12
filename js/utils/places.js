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
    let displayedCount = 3; // Number of places initially displayed
    const filteredPlaces = places.filter(place => place.category.toLowerCase() === category.toLowerCase());

    // Function to render places based on the current displayed count
    const renderPlaces = (count) => {
        placesSection.innerHTML = ''; // Clear the section to re-render

        const placesToShow = filteredPlaces.slice(0, count); // Show only the desired count of places

        // Create grid items for the places to show
        placesToShow.forEach(place => {
            const placeElement = document.createElement('div');
            placeElement.className = 'place-item';
            placeElement.style.cursor = 'pointer';

            placeElement.addEventListener('click', () => {
                window.location.href = `discover/detail.html?id=${place.id}`;
            });

            const parser = new DOMParser();
            const parsedDescription = parser.parseFromString(place.description, 'text/html');
            const textContent = parsedDescription.body.textContent || "";

            const shortDescription = textContent.slice(0, 200) + (textContent.length > 200 ? '...' : '');

            placeElement.innerHTML = `
                <h3>${place.title}</h3>
                <p class="description">${shortDescription}</p>
                <img src="${place.image}" alt="${place.title}" class="place-image">
            `;
            placesSection.appendChild(placeElement);
        });

        // If there are more places to show, add the "See More" button
        if (count < filteredPlaces.length) {
            const seeMoreElement = document.createElement('div');
            seeMoreElement.className = 'place-item see-more';
            seeMoreElement.innerHTML = `
                <p>Find more in the same category.</p>
                <button class="see-more-btn">See More</button>
            `;
            seeMoreElement.addEventListener('click', () => {
                displayedCount += 3; // Increment the count of displayed items
                renderPlaces(displayedCount); // Re-render with more items
            });
            placesSection.appendChild(seeMoreElement);
        }
    };

    // Initial render with the default count
    renderPlaces(displayedCount);
};