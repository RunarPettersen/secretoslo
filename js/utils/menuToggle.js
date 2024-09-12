document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    // Open the mobile menu
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });

    // Close the mobile menu
    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});