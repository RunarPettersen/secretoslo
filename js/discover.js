const fetchDestinations = async () => {
    try {
        const response = await fetch('../json/places.json');
        if (!response.ok) {
            throw new Error('Failed to fetch destinations data.');
        }
        const destinations = await response.json();
        // Display all destinations initially
        displayDestinations(destinations);

        // Set up event listener for category filter
        const categorySelect = document.getElementById('categorySelect');
        categorySelect.addEventListener('change', () => {
            const selectedCategory = categorySelect.value;
            filterDestinations(destinations, selectedCategory);
        });
    } catch (error) {
        console.error('Error fetching destinations:', error);
    }
};

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

// Filter destinations by category
const filterDestinations = (destinations, category) => {
    if (category === 'all') {
        // Show all destinations if 'all' is selected
        displayDestinations(destinations);
    } else {
        // Filter destinations by the selected category
        const filteredDestinations = destinations.filter(destination => destination.category.toLowerCase() === category.toLowerCase());
        displayDestinations(filteredDestinations);
    }
};

document.addEventListener('DOMContentLoaded', fetchDestinations);

