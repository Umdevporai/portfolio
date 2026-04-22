// Language and Theme Toggle System
let currentLanguage = 'es';
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    updateLanguage();
    const langBtn = document.getElementById('current-lang');
    if (langBtn) langBtn.textContent = currentLanguage === 'es' ? 'PT' : 'ES';
    initCertificateSlider();
    initGallerySlider();
    initShowcaseCarousels();
    initScrollAnimations();
    initLightbox();
});

// Recalculate sliders on window resize
window.addEventListener('resize', () => {
    if (certTrack && certSlides.length > 0) {
        updateCertSlider();
    }
    if (galleryTrack && gallerySlides.length > 0) {
        updateGalleryPosition();
    }
});

// Theme Toggle
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Language Toggle
function toggleLanguage() {
    currentLanguage = currentLanguage === 'pt' ? 'es' : 'pt';
    updateLanguage();
    document.getElementById('current-lang').textContent = currentLanguage === 'es' ? 'PT' : 'ES';
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-pt][data-es]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) element.textContent = text;
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            // Close mobile menu
            document.querySelector('.nav-menu')?.classList.remove('active');
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
    
    // Hide/show navbar on scroll direction
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Certificate Slider
let currentCertSlide = 0;
let certSlides = [];
let certTrack = null;

function initCertificateSlider() {
    certTrack = document.querySelector('.certificates-track');
    certSlides = document.querySelectorAll('.certificate-slide');
    
    if (!certTrack || certSlides.length === 0) return;
    
    // Create dots
    const dotsContainer = document.getElementById('cert-dots');
    if (dotsContainer) {
        certSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.onclick = () => goToCertSlide(index);
            dotsContainer.appendChild(dot);
        });
    }
    
    updateCertSlider();
}

function nextCertificate() {
    currentCertSlide = (currentCertSlide + 1) % certSlides.length;
    updateCertSlider();
}

function prevCertificate() {
    currentCertSlide = (currentCertSlide - 1 + certSlides.length) % certSlides.length;
    updateCertSlider();
}

function goToCertSlide(index) {
    currentCertSlide = index;
    updateCertSlider();
}

function updateCertSlider() {
    if (!certTrack || certSlides.length === 0) return;
    
    const viewport = document.querySelector('.certificates-viewport');
    const viewportWidth = viewport ? viewport.getBoundingClientRect().width : certSlides[0].getBoundingClientRect().width;
    certTrack.style.transform = `translateX(-${currentCertSlide * viewportWidth}px)`;
    
    // Update dots
    const dots = document.querySelectorAll('#cert-dots .dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentCertSlide);
    });
}

// Gallery Auto-Slider
let galleryPaused = false;
let galleryTrack = null;
let currentGalleryIndex = 0;
let gallerySlides = [];
let autoScrollInterval = null;

function initGallerySlider() {
    galleryTrack = document.getElementById('gallery-track');
    if (!galleryTrack) return;
    
    gallerySlides = Array.from(galleryTrack.querySelectorAll('.gallery-slide'));
    
    // Clone slides for infinite scroll
    gallerySlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        galleryTrack.appendChild(clone);
    });
    
    startAutoScroll();
}

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        if (!galleryPaused) {
            nextGallerySlide();
        }
    }, 3000);
}

function nextGallerySlide() {
    currentGalleryIndex++;
    if (currentGalleryIndex >= gallerySlides.length) {
        galleryTrack.style.transition = 'none';
        currentGalleryIndex = 0;
        updateGalleryPosition();
        setTimeout(() => {
            galleryTrack.style.transition = 'transform 0.5s ease';
            currentGalleryIndex = 1;
            updateGalleryPosition();
        }, 50);
    } else {
        galleryTrack.style.transition = 'transform 0.5s ease';
        updateGalleryPosition();
    }
}

function prevGallerySlide() {
    currentGalleryIndex--;
    if (currentGalleryIndex < 0) {
        galleryTrack.style.transition = 'none';
        currentGalleryIndex = gallerySlides.length - 1;
        updateGalleryPosition();
        setTimeout(() => {
            galleryTrack.style.transition = 'transform 0.5s ease';
            currentGalleryIndex = gallerySlides.length - 2;
            updateGalleryPosition();
        }, 50);
    } else {
        galleryTrack.style.transition = 'transform 0.5s ease';
        updateGalleryPosition();
    }
}

function updateGalleryPosition() {
    const allSlides = galleryTrack.querySelectorAll('.gallery-slide');
    const slideWidth = allSlides[0] ? allSlides[0].offsetWidth : 420;
    galleryTrack.style.transform = `translateX(-${currentGalleryIndex * slideWidth}px)`;
}

function pauseGallery() {
    galleryPaused = !galleryPaused;
    const icon = document.getElementById('gallery-pause-icon');
    
    if (galleryPaused) {
        icon.className = 'fas fa-play';
    } else {
        icon.className = 'fas fa-pause';
    }
}

// Showcase Tab Switching (Software em Ação)
let showcaseData = {
    desktop: { index: 0, track: null, slides: [], dots: null },
    mobile: { index: 0, track: null, slides: [], dots: null }
};

function initShowcaseCarousels() {
    // Nothing to init for column layout — tabs handled by switchShowcase
}

function switchShowcase(type) {
    document.querySelectorAll('.showcase-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.showcase-panel').forEach(p => p.classList.remove('active'));

    event.currentTarget.classList.add('active');
    const panel = document.getElementById(`panel-${type}`);
    if (panel) panel.classList.add('active');
}

function nextScreen(type) {}
function prevScreen(type) {}
function goToScreen(type, index) {}
function updateScreenPosition(type) {}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll(
        '.experience-card, .contact-item, .impact-item, .tech-item, .showcase-screens, .showcase-location'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Add animate-in styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado!');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Animation keyframes
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(animationStyle);

// Lightbox
let lightboxImages = [];
let lightboxIndex = 0;

function initLightbox() {
    document.querySelectorAll('.screen-card').forEach((card, idx) => {
        const img = card.querySelector('img');
        const label = card.querySelector('.screen-label');
        if (!img) return;
        card.addEventListener('click', () => {
            // Rebuild image list from currently active panel
            const activePanel = document.querySelector('.showcase-panel.active');
            const cards = activePanel ? activePanel.querySelectorAll('.screen-card') : document.querySelectorAll('.screen-card');
            lightboxImages = Array.from(cards).map(c => ({
                src: c.querySelector('img').src,
                label: c.querySelector('.screen-label') ? c.querySelector('.screen-label').textContent : ''
            }));
            // Find clicked index within the active panel
            const panelCards = Array.from(activePanel ? activePanel.querySelectorAll('.screen-card') : []);
            lightboxIndex = panelCards.indexOf(card);
            if (lightboxIndex === -1) lightboxIndex = 0;
            openLightbox();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lb = document.getElementById('lightbox');
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') lightboxNav(1);
        if (e.key === 'ArrowLeft')  lightboxNav(-1);
    });
}

function openLightbox() {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const lbl = document.getElementById('lightbox-label');
    img.src = lightboxImages[lightboxIndex].src;
    lbl.textContent = lightboxImages[lightboxIndex].label;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
    // Close when clicking the backdrop, the X button, or called with no event (keyboard)
    if (e && e.type === 'click') {
        const lb = document.getElementById('lightbox');
        if (e.target !== lb && !e.currentTarget.classList.contains('lightbox-close')) return;
    }
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

function lightboxNav(dir, e) {
    if (e) e.stopPropagation();
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    openLightbox();
}

console.log('✅ Portfólio João Vinícius carregado!');
