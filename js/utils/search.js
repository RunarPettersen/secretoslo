document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for search form submission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            // Get the search query from the input field
            const query = document.getElementById('searchInput').value.toLowerCase().trim();

            // Redirect to the search results page with the query as a URL parameter
            if (query) {
                window.location.href = `../search-results.html?query=${encodeURIComponent(query)}`;
            }
        });
    }
});
