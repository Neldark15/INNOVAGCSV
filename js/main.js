/* ============================================
   InnovaGCSV — Modern JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Loader ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 900);
    });
    // Fallback
    setTimeout(() => loader.classList.add('hidden'), 2500);

    // --- Header scroll ---
    const header = document.getElementById('header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile nav ---
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        nav.classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            nav.classList.remove('open');
        });
    });

    // --- Active nav on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const updateNav = () => {
        const y = window.scrollY + 150;
        sections.forEach(s => {
            const top = s.offsetTop, h = s.offsetHeight, id = s.id;
            if (y >= top && y < top + h) {
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                });
            }
        });
    };
    window.addEventListener('scroll', updateNav, { passive: true });

    // --- Scroll animations ---
    const animated = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const delay = e.target.dataset.delay || 0;
                setTimeout(() => e.target.classList.add('visible'), +delay);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    animated.forEach(el => observer.observe(el));

    // --- Counter animation ---
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = +el.dataset.count;
                const duration = 1800;
                const start = performance.now();

                const animate = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const ease = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * ease);
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lbClose = document.querySelector('.lightbox-close');

    document.querySelectorAll('[data-lightbox]').forEach(card => {
        card.addEventListener('click', () => {
            lightboxImg.src = card.dataset.lightbox;
            lightboxImg.alt = card.querySelector('img')?.alt || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLB = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    lbClose.addEventListener('click', closeLB);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

    // --- Form ---
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', e => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));
        if (!data.nombre || !data.telefono || !data.servicio || !data.mensaje) {
            showMsg('Por favor completa todos los campos requeridos.', 'error');
            return;
        }

        const waMsg = encodeURIComponent(
            `Hola, soy ${data.nombre}.\n` +
            `Tel: ${data.telefono}\n` +
            `Servicio: ${data.servicio}\n` +
            `Proyecto: ${data.mensaje}`
        );

        showMsg('Gracias por tu solicitud. Redirigiendo a WhatsApp...', 'success');
        setTimeout(() => {
            window.open(`https://wa.me/50374856657?text=${waMsg}`, '_blank');
        }, 1200);
        form.reset();
    });

    function showMsg(text, type) {
        let el = form.querySelector('.form-msg');
        if (!el) { el = document.createElement('div'); el.className = 'form-msg'; form.appendChild(el); }
        el.textContent = text;
        el.style.cssText = `
            padding:12px 16px; border-radius:10px; margin-top:12px;
            text-align:center; font-size:.85rem; font-weight:500;
            background:${type === 'success' ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)'};
            color:${type === 'success' ? '#22c55e' : '#ef4444'};
            border:1px solid ${type === 'success' ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.2)'};
        `;
        setTimeout(() => el.remove(), 5000);
    }
});
