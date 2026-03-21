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
const SANITY_ORGANIZATION_ID = 'oCAJBUVjO';
const SANITY_DATASET = 'production';
const SANITY_QUERY = encodeURIComponent(`*[_type in ["jobPost", "job"]] | order(coalesce(postedAt, _createdAt) desc){
    title,
    location,
    description,
    "descriptionText": pt::text(description),
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

/**
 * Walks Portable Text (and similar nested shapes) and returns plain text only.
 * Never relies on String(object) — that produces "[object Object]".
 */
function portableTextToPlainText(value, depth = 0) {
    if (value == null || depth > 30) {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    if (Array.isArray(value)) {
        const parts = value
            .map(item => portableTextToPlainText(item, depth + 1))
            .filter(part => part && part.length);
        return parts.join('\n\n');
    }

    if (typeof value === 'object') {
        if (typeof value.text === 'string') {
            return value.text;
        }
        if (Array.isArray(value.children)) {
            return value.children
                .map(child => portableTextToPlainText(child, depth + 1))
                .join('');
        }
        if (Array.isArray(value.body)) {
            return portableTextToPlainText(value.body, depth + 1);
        }
        return '';
    }

    return '';
}

function getSafeDescription(job) {
    const fromPtText = portableTextToPlainText(job.descriptionText);
    if (fromPtText.trim()) {
        return fromPtText.trim();
    }

    const fromDescription = portableTextToPlainText(job.description);
    if (fromDescription.trim()) {
        return fromDescription.trim();
    }

    if (typeof job.description === 'string' && job.description.trim()) {
        return job.description.trim();
    }

    return '';
}

function getSafeExternalUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') {
        return null;
    }

    try {
        const parsed = new URL(rawUrl);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return parsed.href;
        }
        return null;
    } catch (error) {
        return null;
    }
}

function populateApplyPositionSelect(jobs) {
    const select = document.getElementById('apply-position');
    if (!select) {
        return;
    }

    const list = Array.isArray(jobs) ? jobs : [];
    select.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = 'Select a position…';
    select.appendChild(placeholder);

    const general = document.createElement('option');
    general.value = 'General application / inquiry';
    general.textContent = 'General application / inquiry';
    select.appendChild(general);

    list.forEach(job => {
        const title = (job.title || '').trim() || 'Untitled position';
        const opt = document.createElement('option');
        opt.value = title;
        opt.textContent = title;
        select.appendChild(opt);
    });
}

function renderJobs(jobs) {
    const jobsContainer = document.getElementById('jobs-list');
    if (!jobsContainer) {
        return;
    }

    const jobList = jobs || [];
    populateApplyPositionSelect(jobList);

    jobsContainer.innerHTML = '';

    if (jobList.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'jobs-empty';
        emptyState.textContent = 'No job openings right now.';
        jobsContainer.appendChild(emptyState);
        return;
    }

    jobList.forEach(job => {
        const card = document.createElement('article');
        card.className = 'job-card';

        const title = document.createElement('h3');
        title.className = 'job-title';
        title.textContent = job.title || 'Untitled Position';
        card.appendChild(title);

        const meta = document.createElement('p');
        meta.className = 'job-meta';
        const location = job.location ? `Location: ${job.location}` : 'Location: N/A';
        const posted = formatPostedDate(job.postedAt || job.publishedAt || job._createdAt);
        meta.textContent = posted ? `${location} • ${posted}` : location;
        card.appendChild(meta);

        const plainDescription = getSafeDescription(job);
        if (plainDescription) {
            const description = document.createElement('p');
            description.className = 'job-description';
            description.textContent = plainDescription;
            card.appendChild(description);
        }

        const safeApplyUrl = getSafeExternalUrl(job.applyLink);
        if (safeApplyUrl) {
            const apply = document.createElement('a');
            apply.className = 'job-apply';
            apply.href = safeApplyUrl;
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

    populateApplyPositionSelect([]);

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