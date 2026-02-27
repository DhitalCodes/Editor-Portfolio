// Scroll Reveal Animations


(function () {
    'use strict';

    /* ── Intersection Observer for reveal elements ── */
    const revealEls = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .portfolio-item'
    );

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        revealEls.forEach((el) => observer.observe(el));
    } else {
        // Fallback: just show everything
        revealEls.forEach((el) => el.classList.add('in-view'));
    }

    /* ── Active nav link on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const activateNavLink = () => {
        const scrollY = window.scrollY;
        sections.forEach((section) => {
            const top = section.offsetTop - 100;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach((l) => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateNavLink, { passive: true });
    activateNavLink();

})();
