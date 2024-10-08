import { setupLoader } from './utils/loader.js';

setupLoader();

const displayFavorites = () => {
    const favoritesSection = document.getElementById('favoritesSection');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        favoritesSection.innerHTML = '<p>No favorites added yet.</p>';
        return;
    }

    favoritesSection.innerHTML = '';
    favorites.forEach(favorite => {
        const favoriteElement = document.createElement('div');
        favoriteElement.className = 'favorite-item';
        favoriteElement.innerHTML = `
            <h3>${favorite.title}</h3>
            <img src="../${favorite.image}" alt="${favorite.title}" class="favorite-image">
            <p>${favorite.introduction}</p>
            <button class="details-btn">View Details</button>
            <button class="remove-btn">Remove</button>
        `;
        favoritesSection.appendChild(favoriteElement);

        // Add event listener for the "View Details" button
        favoriteElement.querySelector('.details-btn').addEventListener('click', () => {
            location.href = `detail.html?id=${favorite.id}`;
        });

        // Add event listener for the "Remove" button
        favoriteElement.querySelector('.remove-btn').addEventListener('click', () => {
            removeFavorite(favorite.id);
        });
    });
};

// Function to remove a favorite from the list
const removeFavorite = (id) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites(); // Refresh the list to reflect the changes
};

document.addEventListener('DOMContentLoaded', displayFavorites);

