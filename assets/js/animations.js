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
    const sections = [...document.querySelectorAll('section[id]')];
    const navLinks = [...document.querySelectorAll('.nav-link')];
    const navById = new Map(
        navLinks
            .map((link) => {
                const href = link.getAttribute('href') || '';
                return href.startsWith('#') ? [href.slice(1), link] : null;
            })
            .filter(Boolean)
    );

    let sectionBounds = [];
    let currentActiveId = '';
    let ticking = false;

    const computeSectionBounds = () => {
        sectionBounds = sections.map((section) => {
            const top = section.offsetTop - 100;
            return {
                id: section.id,
                top,
                bottom: top + section.offsetHeight
            };
        });
    };

    const setActiveLink = (id) => {
        if (!id || id === currentActiveId) return;

        const prev = navById.get(currentActiveId);
        const next = navById.get(id);
        if (prev) prev.classList.remove('active');
        if (next) next.classList.add('active');
        currentActiveId = id;
    };

    const activateNavLink = () => {
        const scrollY = window.scrollY;
        for (let i = 0; i < sectionBounds.length; i += 1) {
            const section = sectionBounds[i];
            if (scrollY >= section.top && scrollY < section.bottom) {
                setActiveLink(section.id);
                return;
            }
        }
        // If scrolled past all sections, activate the last one
        if (sectionBounds.length > 0) {
            setActiveLink(sectionBounds[sectionBounds.length - 1].id);
        }
    };

    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            activateNavLink();
            ticking = false;
        });
    };

    const refreshSectionBounds = () => {
        computeSectionBounds();
        activateNavLink();
    };

    refreshSectionBounds();
    window.addEventListener('resize', refreshSectionBounds, { passive: true });
    if (document.readyState !== 'complete') {
        window.addEventListener('load', refreshSectionBounds);
    }
    document.addEventListener('sections:refresh', refreshSectionBounds);
    window.addEventListener('scroll', onScroll, { passive: true });

})();
