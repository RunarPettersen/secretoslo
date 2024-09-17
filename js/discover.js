import { setupLoader } from './utils/loader.js';

setupLoader();

const fetchDestinations = async () => {
    try {
        const response = await fetch('../json/places.json');
        if (!response.ok) {
            throw new Error('Failed to fetch destinations data.');
        }
        const destinations = await response.json();

        // Sort destinations by date (newest first) when the page loads
        destinations.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Display sorted destinations initially
        displayDestinations(destinations);

        // Set up event listener for category filter
        const categorySelect = document.getElementById('categorySelect');
        categorySelect.addEventListener('change', () => {
            const selectedCategory = categorySelect.value;
            filterDestinations(destinations, selectedCategory);
        });

        // Set up event listener for sort order filter
        const sortOrderSelect = document.getElementById('sortOrderSelect');
        sortOrderSelect.addEventListener('change', () => {
            const selectedOrder = sortOrderSelect.value;
            sortDestinations(destinations, selectedOrder);
        });

    } catch (error) {
        console.error('Error fetching destinations:', error);
    }
};

// Sort and display destinations based on selected order
const sortDestinations = (destinations, order) => {
    if (order === 'newest') {
        destinations.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (order === 'oldest') {
        destinations.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (order === 'highest-secret') {
        // Sort by highest secret level
        destinations.sort((a, b) => parseInt(b.secretLevel, 10) - parseInt(a.secretLevel, 10));
    } else if (order === 'lowest-secret') {
        // Sort by lowest secret level
        destinations.sort((a, b) => parseInt(a.secretLevel, 10) - parseInt(b.secretLevel, 10));
    }
    displayDestinations(destinations);
};

// Display destinations function
const displayDestinations = (destinations) => {
    const destinationsGrid = document.getElementById('destinationsGrid');
    destinationsGrid.innerHTML = '';

    destinations.forEach(destination => {
        const destinationCard = document.createElement('div');
        destinationCard.className = 'destination-card';
        destinationCard.innerHTML = `
            <img src="../${destination.image}" alt="${destination.title}" class="destination-image">
            <h2>${destination.title}</h2>
            <p>${destination.introduction}</p>
            <button class="details-btn" data-id="${destination.id}">View Details</button>
        `;
        destinationsGrid.appendChild(destinationCard);
    });

    // Add event listeners to "View Details" buttons
    const detailButtons = document.querySelectorAll('.details-btn');
    detailButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const destinationId = event.target.getAttribute('data-id');
            // Redirect to detail.html with destination ID as a query parameter
            window.location.href = `detail.html?id=${destinationId}`;
        });
    });
};

// Filter destinations by a single selected category
const filterDestinations = (destinations, selectedCategory) => {
    if (selectedCategory === 'all') {
        // Show all destinations if 'all' is selected
        displayDestinations(destinations);
    } else {
        // Filter destinations where the selected category is one of the categories listed in the destination's category array
        const filteredDestinations = destinations.filter(destination =>
            destination.category.map(cat => cat.toLowerCase()).includes(selectedCategory.toLowerCase())
        );
        displayDestinations(filteredDestinations);
    }
};

document.addEventListener('DOMContentLoaded', fetchDestinations);