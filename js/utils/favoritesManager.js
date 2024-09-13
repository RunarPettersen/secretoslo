import { displayMessage } from './uiUtils.js'; // Import displayMessage

// Check if a destination is a favorite
export const isFavorite = (id) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.id === id);
};

// Toggle favorite status for a destination
export const toggleFavorite = (destination, updateFavoriteButton) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (isFavorite(destination.id)) {
        favorites = favorites.filter(fav => fav.id !== destination.id);
        displayMessage('Removed from Favorites', 'error');
    } else {
        favorites.push(destination);
        displayMessage('Added to Favorites', 'success');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(destination.id);
};