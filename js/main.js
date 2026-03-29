/* ============================================
   InnovaGCSV - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header scroll effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Mobile nav toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('nav');

    navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        navToggle.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // --- Active nav on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');

    document.querySelectorAll('[data-lightbox]').forEach(card => {
        card.addEventListener('click', () => {
            const src = card.getAttribute('data-lightbox');
            lightboxImg.src = src;
            lightboxImg.alt = card.querySelector('img')?.alt || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // --- Form validation ---
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const servicio = document.getElementById('servicio').value;
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !telefono || !servicio || !mensaje) {
            showFormMessage('Por favor, completa todos los campos requeridos.', 'error');
            return;
        }

        // Build WhatsApp message as fallback
        const waMsg = encodeURIComponent(
            `Hola, soy ${nombre}.\n` +
            `Telefono: ${telefono}\n` +
            `Servicio: ${servicio}\n` +
            `Mensaje: ${mensaje}`
        );

        showFormMessage('Gracias por contactarnos. Te responderemos pronto.', 'success');

        // Open WhatsApp with the message
        setTimeout(() => {
            window.open(`https://wa.me/50374856657?text=${waMsg}`, '_blank');
        }, 1000);

        form.reset();
    });

    function showFormMessage(text, type) {
        let msgEl = document.querySelector('.form-message');
        if (!msgEl) {
            msgEl = document.createElement('div');
            msgEl.className = 'form-message';
            form.appendChild(msgEl);
        }
        msgEl.textContent = text;
        msgEl.style.padding = '12px 16px';
        msgEl.style.borderRadius = '6px';
        msgEl.style.marginTop = '12px';
        msgEl.style.fontWeight = '500';
        msgEl.style.textAlign = 'center';

        if (type === 'success') {
            msgEl.style.background = 'rgba(37, 211, 102, 0.2)';
            msgEl.style.color = '#25d366';
        } else {
            msgEl.style.background = 'rgba(239, 68, 68, 0.2)';
            msgEl.style.color = '#ef4444';
        }

        setTimeout(() => msgEl.remove(), 5000);
    }

    // --- Scroll animations ---
    const animateElements = document.querySelectorAll('.service-block, .project-card, .testimonial-card');
    animateElements.forEach(el => el.classList.add('animate-on-scroll'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));
});
