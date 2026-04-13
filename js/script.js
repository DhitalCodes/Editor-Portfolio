(function () {
    'use strict';

    /* ── Prevent text selection ── */
    addEventListener('selectstart', (e) => e.preventDefault());

  
    //    1. NAVBAR SCROLL & MOBILE MENU
  
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('[data-close-menu]');
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');

    const THEME_STORAGE_KEY = 'site-theme';
    const rootBody = document.body;
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    const applyTheme = (theme) => {
        let nextTheme = theme;
        if (nextTheme !== 'light' && nextTheme !== 'dark') nextTheme = 'dark';
        rootBody.setAttribute('data-theme', nextTheme);

        const isLight = nextTheme === 'light';
        const toggles = [themeToggle, mobileThemeToggle].filter(Boolean);

        toggles.forEach((toggle) => {
            const icon = toggle.querySelector('i');
            const label = toggle.querySelector('.theme-toggle-label');
            const isMobileToggle = toggle === mobileThemeToggle;

            toggle.setAttribute('aria-pressed', String(isLight));
            toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');

            if (label) {
                if (isMobileToggle) label.textContent = isLight ? 'Day Mode' : 'Night Mode';
                else label.textContent = isLight ? 'Day' : 'Night';
            }

            if (icon) {
                icon.classList.remove('fa-moon', 'fa-sun');
                icon.classList.add(isLight ? 'fa-sun' : 'fa-moon');
            }
        });
    };

    const initializeTheme = () => {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        const initialTheme = storedTheme === 'light' || storedTheme === 'dark'
            ? storedTheme
            : (prefersLight ? 'light' : 'dark');
        applyTheme(initialTheme);
    };

    initializeTheme();

    const handleThemeToggle = () => {
        const currentTheme = rootBody.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    };

    themeToggle?.addEventListener('click', handleThemeToggle);
    mobileThemeToggle?.addEventListener('click', handleThemeToggle);

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


    //    2. ANIMATED COUNTER

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


    
    //    3. PORTFOLIO FILTER
   
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


    //    4. MODAL (Image & Video)
   
    const backdrop = document.getElementById('modalBackdrop');
    const modalBox = document.getElementById('modalBox');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    const portfolioGrid = document.getElementById('portfolioGrid');

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

    function openPortfolioPreview(triggerEl) {
        if (!triggerEl) return;

        const type = triggerEl.dataset.type;
        const isShort = triggerEl.dataset.short === 'true';

        if (type === 'image') {
            const src = triggerEl.dataset.src;
            openModal(`<img src="${src}" alt="Portfolio image" loading="lazy">`);
            return;
        }

        if (type === 'video') {
            const id = triggerEl.dataset.video;
            const videoTitle = triggerEl.closest('.port-overlay')?.querySelector('.port-meta h4')?.textContent || 'YouTube video';
            if (isShort) {
                openModal(`<iframe class="short-frame" src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="${videoTitle}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`);
            } else {
                openModal(`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="${videoTitle}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`);
            }
        }
    }

    if (portfolioGrid) {
        const wraps = portfolioGrid.querySelectorAll('.port-img-wrap');

        // Make each thumbnail keyboard-focusable and screen-reader discoverable.
        wraps.forEach((wrap) => {
            const title = wrap.querySelector('.port-meta h4')?.textContent?.trim() || 'Portfolio preview';
            wrap.setAttribute('tabindex', '0');
            wrap.setAttribute('role', 'button');
            wrap.setAttribute('aria-label', `Open preview: ${title}`);
        });

        // Single click/tap anywhere on the thumbnail opens preview.
        portfolioGrid.addEventListener('click', (e) => {
            if (e.target.closest('.port-yt')) return;

            const expandBtn = e.target.closest('.port-expand');
            if (expandBtn) {
                e.preventDefault();
                openPortfolioPreview(expandBtn);
                return;
            }

            const wrap = e.target.closest('.port-img-wrap');
            if (!wrap) return;

            const trigger = wrap.querySelector('.port-expand');
            if (!trigger) return;

            e.preventDefault();
            openPortfolioPreview(trigger);
        });

        // Keyboard support: Enter or Space opens the focused thumbnail.
        portfolioGrid.addEventListener('keydown', (e) => {
            if (e.target.closest('.port-expand, .port-yt')) return;

            const wrap = e.target.closest('.port-img-wrap');
            if (!wrap) return;
            if (e.key !== 'Enter' && e.key !== ' ') return;

            e.preventDefault();
            const trigger = wrap.querySelector('.port-expand');
            openPortfolioPreview(trigger);
        });
    }

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
        const nameInput = document.getElementById('fname');
        const emailInput = document.getElementById('femail');
        const nameFeedback = document.getElementById('fnameFeedback');
        const emailFeedback = document.getElementById('femailFeedback');

        const setFieldState = (inputEl, feedbackEl, state, message = '') => {
            const field = inputEl?.closest('.form-field');
            if (!field || !feedbackEl) return;

            field.classList.remove('is-valid', 'is-invalid');
            inputEl.removeAttribute('aria-invalid');

            feedbackEl.textContent = message;

            if (!state) return;

            if (state === 'valid') {
                field.classList.add('is-valid');
            } else if (state === 'invalid') {
                field.classList.add('is-invalid');
                inputEl.setAttribute('aria-invalid', 'true');
            }
        };

        const validateName = () => {
            if (!nameInput) return true;

            const value = nameInput.value.trim();
            const namePattern = /^[A-Za-z][A-Za-z\s.'-]{1,}$/;

            if (!value) {
                setFieldState(nameInput, nameFeedback, null);
                return false;
            }

            if (value.length < 2 || !namePattern.test(value)) {
                setFieldState(nameInput, nameFeedback, 'invalid', 'Please enter a valid full name.');
                return false;
            }

            setFieldState(nameInput, nameFeedback, 'valid');
            return true;
        };

        const validateEmail = () => {
            if (!emailInput) return true;

            const value = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

            if (!value) {
                setFieldState(emailInput, emailFeedback, null);
                return false;
            }

            if (!emailPattern.test(value)) {
                setFieldState(emailInput, emailFeedback, 'invalid', 'Please enter a valid email address.');
                return false;
            }

            setFieldState(emailInput, emailFeedback, 'valid');
            return true;
        };

        nameInput?.addEventListener('input', validateName);
        emailInput?.addEventListener('input', validateEmail);
        nameInput?.addEventListener('blur', validateName);
        emailInput?.addEventListener('blur', validateEmail);

        form.addEventListener('submit', (e) => {
            const nameOk = validateName();
            const emailOk = validateEmail();

            if (!nameOk || !emailOk) {
                e.preventDefault();
                const focusTarget = !nameOk ? nameInput : emailInput;
                focusTarget?.focus();
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            btn.innerHTML = '<span>Sending…</span><i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
            }, 1200);
        });
    }
    const emailCopyEl = document.getElementById('copyEmailBtn');
    const copyToast = document.getElementById('copy-toast');
    let copyToastTimer;

    const showCopyFeedback = (message, isSuccess = true) => {
        if (!copyToast) return;

        copyToast.textContent = message;
        copyToast.classList.add('show');
        copyToast.classList.toggle('error', !isSuccess);

        clearTimeout(copyToastTimer);
        copyToastTimer = setTimeout(() => {
            copyToast.classList.remove('show', 'error');
            copyToast.textContent = 'Tap to copy email';
        }, 2200);
    };

    const copyWithFallback = async (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.select();

        let copied = false;
        try {
            copied = document.execCommand('copy');
        } finally {
            document.body.removeChild(textarea);
        }

        return copied;
    };

    if (emailCopyEl) {
        if (copyToast) {
            copyToast.setAttribute('role', 'status');
            copyToast.setAttribute('aria-live', 'polite');
            copyToast.textContent = 'Tap to copy email';
        }

        emailCopyEl.addEventListener('click', async () => {
            const email = emailCopyEl.querySelector('span')?.textContent.trim() || emailCopyEl.textContent.trim();
            try {
                const copied = await copyWithFallback(email);
                if (!copied) throw new Error('Copy command failed.');

                if (navigator.vibrate) navigator.vibrate(18);
                emailCopyEl.classList.add('copied');
                showCopyFeedback('Copied! Email is now on your clipboard.');
                setTimeout(() => emailCopyEl.classList.remove('copied'), 1200);
            } catch (error) {
                showCopyFeedback('Copy failed. Long-press or use Ctrl+C.', false);
            }
        });

        emailCopyEl.addEventListener('mouseenter', () => {
            if (copyToast && !copyToast.classList.contains('show')) {
                copyToast.textContent = 'Click to copy email';
            }
        });

        emailCopyEl.addEventListener('mouseleave', () => {
            if (copyToast && !copyToast.classList.contains('show')) {
                copyToast.textContent = 'Tap to copy email';
            }
        });
    }

    //    9. AI CHAT WIDGET
    const chatLauncher = document.getElementById('chatLauncher');
    const chatWidget = document.getElementById('chatWidget');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    const appendChatMessage = (text, sender = 'bot') => {
        if (!chatMessages) return;
        const msg = document.createElement('div');
        msg.classList.add('chat-msg', sender === 'user' ? 'user-msg' : 'bot-msg');
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const getBotReply = (message) => {
        const input = message.toLowerCase();

        if (/(price|cost|budget|rate|package)/.test(input)) {
            return 'Pricing depends on project scope. Share your requirements in the contact form and you will get a custom quote quickly.';
        }
        if (/(service|offer|edit|motion|thumbnail|reel)/.test(input)) {
            return 'I can help with video editing, motion graphics, thumbnails, YouTube content, and social media reels.';
        }
        if (/(time|turnaround|delivery|deadline)/.test(input)) {
            return 'Typical turnaround is based on complexity, but most projects start with clear milestones and timely delivery.';
        }
        if (/(available|hire|book|work|project)/.test(input)) {
            return 'Yes, currently open to new projects. You can use the contact form to discuss your project details.';
        }
        if (/(hello|hi|hey)/.test(input)) {
            return 'Hi there! Tell me what kind of content you need help with.';
        }
        return 'Thanks for your message! Please share your project goal, style, and deadline, and you will get tailored guidance.';
    };

    const openChat = () => {
        if (!chatWidget || !chatLauncher) return;
        chatWidget.hidden = false;
        chatLauncher.setAttribute('aria-expanded', 'true');
        chatInput?.focus();
    };

    const closeChat = () => {
        if (!chatWidget || !chatLauncher) return;
        chatWidget.hidden = true;
        chatLauncher.setAttribute('aria-expanded', 'false');
        chatLauncher.focus();
    };

    chatLauncher?.addEventListener('click', () => {
        if (!chatWidget) return;
        if (chatWidget.hidden) openChat();
        else closeChat();
    });

    chatClose?.addEventListener('click', closeChat);

    chatForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!chatInput) return;

        const userText = chatInput.value.trim();
        if (!userText) return;

        appendChatMessage(userText, 'user');
        chatInput.value = '';

        const typingText = 'Typing...';
        appendChatMessage(typingText, 'bot');

        setTimeout(() => {
            if (!chatMessages) return;
            const lastBotMessage = chatMessages.lastElementChild;
            if (lastBotMessage && lastBotMessage.textContent === typingText) {
                lastBotMessage.textContent = getBotReply(userText);
            } else {
                appendChatMessage(getBotReply(userText), 'bot');
            }
        }, 420);
    });

    console.log('Frame By Aadi loaded.');
})();
