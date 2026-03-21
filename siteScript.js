// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const closeMenu = document.querySelector('.close-menu');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
}

if (closeMenu && navLinks) {
    closeMenu.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) {
            navLinks.classList.remove('active');
        }
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

const SANITY_PROJECT_ID = 'orxxqp7k';
const SANITY_DATASET = 'production';
const SANITY_QUERY = encodeURIComponent(`*[_type in ["jobPost", "job"]] | order(coalesce(postedAt, _createdAt) desc){
    title,
    location,
    description,
    applyLink,
    postedAt,
    _createdAt
}`);

function formatPostedDate(isoDate) {
    if (!isoDate) {
        return '';
    }

    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return `Posted ${date.toLocaleDateString()}`;
}

function renderJobs(jobs) {
    const jobsContainer = document.getElementById('jobs-list');
    if (!jobsContainer) {
        return;
    }

    jobsContainer.innerHTML = '';

    if (!jobs || jobs.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'jobs-empty';
        emptyState.textContent = 'No job openings right now.';
        jobsContainer.appendChild(emptyState);
        return;
    }

    jobs.forEach(job => {
        const card = document.createElement('article');
        card.className = 'job-card';

        const title = document.createElement('h3');
        title.className = 'job-title';
        title.textContent = job.title || 'Untitled Position';
        card.appendChild(title);

        const meta = document.createElement('p');
        meta.className = 'job-meta';
        const location = job.location ? `Location: ${job.location}` : 'Location: N/A';
        const posted = formatPostedDate(job.postedAt || job._createdAt);
        meta.textContent = posted ? `${location} • ${posted}` : location;
        card.appendChild(meta);

        if (job.description) {
            const description = document.createElement('p');
            description.className = 'job-description';
            description.textContent = job.description;
            card.appendChild(description);
        }

        if (job.applyLink) {
            const apply = document.createElement('a');
            apply.className = 'job-apply';
            apply.href = job.applyLink;
            apply.target = '_blank';
            apply.rel = 'noopener noreferrer';
            apply.textContent = 'Apply Now';
            card.appendChild(apply);
        }

        jobsContainer.appendChild(card);
    });
}

function loadJobs() {
    const jobsContainer = document.getElementById('jobs-list');
    if (!jobsContainer) {
        return;
    }

    const apiUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2026-03-21/data/query/${SANITY_DATASET}?query=${SANITY_QUERY}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    fetch(apiUrl, { signal: controller.signal })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => renderJobs(data.result || []))
        .catch(error => {
            console.error('Sanity fetch error:', error);
            jobsContainer.innerHTML = '<p class="jobs-error">Error loading jobs.</p>';
        })
        .finally(() => {
            clearTimeout(timeoutId);
        });
}

document.addEventListener('DOMContentLoaded', loadJobs);