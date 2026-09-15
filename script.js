// Language and Theme Toggle System
let currentLanguage = 'es';
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    updateLanguage();
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
        });
    });
    const langBtn = document.getElementById('current-lang');
    if (langBtn) langBtn.textContent = currentLanguage === 'es' ? 'BR' : 'ES';
    initCertificateSlider();
    initGallerySlider();
    initHeroSlider();
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

let heroSlideIndex = 0;
let heroSlides = [];

function initHeroSlider() {
    heroSlides = Array.from(document.querySelectorAll('.hero-background img'));
    if (heroSlides.length === 0) return;

    heroSlides[0].classList.add('active');
    if (heroSlides.length < 2) return;

    setInterval(() => {
        heroSlides[heroSlideIndex].classList.remove('active');
        heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
        heroSlides[heroSlideIndex].classList.add('active');
    }, 8000);
}

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
    document.getElementById('current-lang').textContent = currentLanguage === 'es' ? 'BR' : 'ES';
}

function updateLanguage() {
    document.documentElement.lang = currentLanguage === 'es' ? 'es-ES' : 'pt-BR';
    const elements = document.querySelectorAll('[data-pt][data-es]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) element.textContent = text;
    });
    translateStaticText(currentLanguage);
}

const languagePairs = [
    ['Inicio', 'Início'],
    ['Sobre mí', 'Sobre mim'],
    ['Desarrollo', 'Desenvolvimento'],
    ['Formación', 'Formação'],
    ['Proyectos', 'Projetos'],
    ['Contacto', 'Contato'],
    ['Hola, soy', 'Olá, eu sou'],
    ['Muebles a medida y desarrollo web', 'Móveis planejados e desenvolvimento web'],
    ['Experiencia práctica | Precisión | Tecnología aplicada al trabajo', 'Experiência prática | Precisão | Tecnologia aplicada ao trabalho'],
    ['Disponible para trabajar en Valencia y Madrid', 'Disponível para trabalhar em Valencia e Madrid'],
    ['Contactar', 'Entre em contato'],
    ['Ver proyectos', 'Ver projetos'],
    ['Años de experiencia', 'Anos de experiência'],
    ['Años de edad', 'Anos de idade'],
    ['Áreas de trabajo', 'Áreas de atuação'],
    ['Sobre mí', 'Sobre mim'],
    ['Tengo 26 años, soy del norte de Brasil y vengo de una familia humilde. Soy una persona dedicada y trabajadora; creo que un trabajo bien hecho nace de la responsabilidad, la atención a los detalles y las ganas de aprender cada día.', 'Tenho 26 anos, sou do Norte do Brasil e venho de uma família humilde. Sou dedicado e esforçado; acredito que um trabalho bem feito nasce da responsabilidade, da atenção aos detalhes e da vontade de aprender todos os dias.'],
    ['Cuento con 10 años de experiencia profesional en muebles a medida y carpintería. He trabajado con máquinas CNC router y con canteadora automática, siempre buscando precisión, buenos acabados, productividad y cuidado en cada etapa del trabajo.', 'Tenho 10 anos de experiência profissional com móveis planejados e marcenaria. Tenho experiência com máquinas CNC router e coladeira de borda automática, sempre buscando precisão, bom acabamento, produtividade e cuidado em cada etapa do trabalho.'],
    ['Aprendo con facilidad nuevos procesos, máquinas y herramientas. También soy desarrollador de software y puedo aportar sistemas, organización de la información y soluciones digitales para mejorar el día a día de la empresa.', 'Tenho facilidade para aprender novos processos, máquinas e ferramentas. Também sou desenvolvedor de software e posso contribuir com sistemas, organização de informações e soluções digitais para melhorar a rotina da empresa.'],
    ['Mi nivel de español es intermedio y entiendo bien el español hablado. Mi profesora de idiomas es natural de Cataluña, algo que me ha ayudado mucho a mejorar la comprensión del idioma y a familiarizarme con sus diferentes pronunciaciones y expresiones.', 'Falo espanhol em nível intermediário e entendo bem o espanhol falado. Minha professora de línguas é natural da Catalunha, o que tem me ajudado a desenvolver a compreensão do idioma e conhecer melhor as diferenças de pronúncia e vocabulário.'],
    ['Ya tengo preparados mis documentos y certificados de antecedentes. Llevo tiempo planificando mi traslado al extranjero con mi esposa y mi hijo. Mi idea es viajar primero para estabilizarme profesionalmente y, más adelante, reunirme con mi familia.', 'Já estou com meus documentos e antecedentes preparados. Venho me planejando para imigrar com minha esposa e meu filho. Minha intenção é ir primeiro para me estabilizar profissionalmente e, depois, trazer minha família para junto de mim.'],
    ['Lo que puedo aportar', 'O que posso oferecer'],
    ['Habilidades profesionales', 'Habilidades profissionais'],
    ['Muebles a medida', 'Móveis planejados'],
    ['Maquinaria y producción', 'Máquinas e produção'],
    ['Tecnología', 'Tecnologia'],
    ['Desarrollo de software', 'Desenvolvimento de software'],
    ['Competencias técnicas', 'Competências técnicas'],
    ['Creo soluciones web para organizar información, automatizar tareas y mejorar los procesos de trabajo.', 'Crio soluções web para organizar informações, automatizar tarefas e melhorar os processos de trabalho.'],
    ['También tengo experiencia con distintos programas de diseño 3D para muebles. Sé desarrollar proyectos en 3D, preparar renders profesionales y buscar optimizaciones que mejoren la producción, el aprovechamiento de los materiales y el resultado final.', 'Também tenho experiência com diferentes softwares de design 3D para móveis. Sei desenvolver projetos em 3D, preparar renders profissionais e buscar otimizações que melhorem a produção, o aproveitamento dos materiais e o resultado final.'],
    ['Sé leer y comprender proyectos arquitectónicos y estoy dispuesto a aprender los métodos y la forma de trabajar que se utilizan en España.', 'Sei ler e compreender projetos arquitetônicos e estou disposto a aprender os métodos e a forma de trabalho utilizados na Espanha.'],
    ['También he sido líder de equipo en una tienda de muebles, coordinando tareas, apoyando a mis compañeros y ayudando a mantener la organización y la calidad del trabajo.', 'Também já fui líder de equipe em uma loja de móveis, coordenando tarefas, apoiando meus colegas e ajudando a manter a organização e a qualidade do trabalho.'],
    ['Proyectos de muebles a medida', 'Projetos de móveis planejados'],
    ['Añade nuevas fotos a la carpeta', 'Adicione novas fotos na pasta'],
    ['Para añadir una foto: copia este bloque y cambia el nombre del archivo y el texto alternativo.', 'Para adicionar uma foto: copie este bloco e troque o nome do arquivo e o texto alternativo.'],
    ['Contacto', 'Contato'],
    ['Disponible para oportunidades en empresas de muebles a medida en Valencia y Madrid.', 'Disponível para oportunidades em empresas de móveis planejados em Valencia e Madrid.'],
    ['Listo para una nueva oportunidad', 'Pronto para uma nova oportunidade'],
    ['Busco un equipo en el que pueda aportar experiencia, dedicación, esfuerzo y ganas de crecer. También tengo disponibilidad para ayudar con tareas adicionales según las necesidades de la empresa.', 'Busco uma equipe em que eu possa contribuir com experiência, dedicação, esforço e vontade de crescer. Também tenho disponibilidade para ajudar em tarefas extras conforme a demanda da empresa.'],
    ['Documentación preparada', 'Documentos preparados'],
    ['Antecedentes listos', 'Antecedentes prontos'],
    ['Disponibilidad para trasladarme', 'Disponível para mudança'],
    ['Disponible para incorporarme', 'Disponível para contratação'],
    ['WhatsApp directo', 'WhatsApp direto'],
    ['Enviar correo', 'Enviar email'],
    ['Todos los derechos reservados', 'Todos os direitos reservados'],
    ['Cambiar tema', 'Alternar tema'],
    ['Cambiar a portugués', 'Mudar idioma']
];

function translateStaticText(language) {
    const translations = new Map();
    languagePairs.forEach(([spanish, portuguese]) => {
        translations.set(language === 'pt' ? spanish : portuguese, language === 'pt' ? portuguese : spanish);
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(node => {
        const key = node.nodeValue.trim();
        const translated = translations.get(key);
        if (translated) node.nodeValue = node.nodeValue.replace(key, translated);
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
