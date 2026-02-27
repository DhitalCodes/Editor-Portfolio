(function () {
    'use strict';

    /* ── Prevent text selection ── */
    addEventListener('selectstart', (e) => e.preventDefault());

  
    //    1. CUSTOM CURSOR

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Hover effect on interactive elements */
    const hoverEls = document.querySelectorAll(
        'a, button, .filter-btn, .port-expand, .port-yt, .portfolio-item, .service-card'
    );
    hoverEls.forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });


    
    //    2. NAVBAR SCROLL & MOBILE MENU
  
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('[data-close-menu]');

    // Scroll state
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        // Back to top
        backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    //    3. ANIMATED COUNTER

    const counters = document.querySelectorAll('.counter');

    const runCounter = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start = performance.now();
        const step = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 4); // ease-out quart
            el.textContent = Math.floor(ease * target);
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = target;
        };
        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); counterObserver.unobserve(e.target); } }),
        { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));


    
    //    4. PORTFOLIO FILTER
   
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            portItems.forEach((item) => {
                const cat = item.dataset.category;
                const show = filter === 'all' || cat === filter;

                if (show) {
                    item.classList.remove('hide');
                    // Trigger re-entrance animation
                    item.classList.remove('in-view');
                    requestAnimationFrame(() => {
                        setTimeout(() => item.classList.add('in-view'), 30);
                    });
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });


    //    5. MODAL (Image & Video)
   
    const backdrop = document.getElementById('modalBackdrop');
    const modalBox = document.getElementById('modalBox');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');

    function openModal(html) {
        modalContent.innerHTML = html;
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { modalContent.innerHTML = ''; }, 350);
    }

    // Open from portfolio expand buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.port-expand');
        if (!btn) return;
        e.preventDefault();

        const type = btn.dataset.type;
        const isShort = btn.dataset.short === 'true';

        if (type === 'image') {
            const src = btn.dataset.src;
            openModal(`<img src="${src}" alt="Portfolio image" loading="lazy">`);
        } else if (type === 'video') {
            const id = btn.dataset.video;
            if (isShort) {
                openModal(`<iframe class="short-frame" src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`);
            } else {
                openModal(`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`);
            }
        }
    });

    modalClose.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });


    
    //    6. BACK TO TOP
    
    const backTop = document.getElementById('backToTop');
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  
    //    7. SMOOTH SECTION LINKS
  
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });



    //    8. CONTACT FORM FEEDBACK
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', () => {
            const btn = form.querySelector('button[type="submit"]');
            btn.innerHTML = '<span>Sending…</span><i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
            }, 1200);
        });
    }
    document.querySelector(".detail-val-email").addEventListener("click", function () {
        const email = this.textContent;
        navigator.clipboard.writeText(email);
    });

    console.log('Frame By Aadi loaded.');
})();
