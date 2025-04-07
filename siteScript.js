// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const closeMenu = document.querySelector('.close-menu');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    navLinks.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
});

closeMenu.addEventListener('click', () => {
    navLinks.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe all elements with reveal class
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(element => {
        observer.observe(element);
    });

    const navbar = document.querySelector('.navbar');
    
    // Function to check scroll position and update navbar
    function checkScroll() {
        const coverHeight = document.querySelector('.cover').offsetHeight;
        
        if (window.scrollY > coverHeight - 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Listen for scroll events
    window.addEventListener('scroll', checkScroll);
    
    // Check initial scroll position
    checkScroll();
}); 