// Enhanced animations for portfolio website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing enhanced portfolio animations...');
    
    // Initialize all animation functionality
    initNavigation();
    initSmoothScrolling();
    initEnhancedScrollAnimations();
    initEnhancedPortfolioFilter();
    initModal();
    initFormAnimations();
    initEnhancedHoverEffects();
    initImageLoading();
    initEnhancedCounters();
    initEnhancedTitleAnimation();
    initBackToTop();
    initEnhancedFloatingCards();
    initServiceCardAnimations();
    initPortfolioHoverFix(); // New function to fix portfolio hover
});

// Enhanced Back to Top Button
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced Navigation
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Enhanced Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced Scroll Animations
function initEnhancedScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
    
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);
    
    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });
    
    // Enhanced stagger animations
    const staggerGroups = document.querySelectorAll('.services-grid, .portfolio-grid, .about-highlights, .process-steps');
    
    staggerGroups.forEach(group => {
        const items = group.querySelectorAll('.service-card, .portfolio-item, .highlight-item, .step');
        
        items.forEach((item, index) => {
            item.classList.add('stagger-item');
            item.style.transitionDelay = `${index * 0.15}s`;
        });
        
        const staggerObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.stagger-item');
                    items.forEach(item => {
                        item.classList.add('appear');
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        staggerObserver.observe(group);
    });
    
    // Enhanced hero stats animation
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stats = entry.target.querySelectorAll('.stat');
                    stats.forEach((stat, index) => {
                        setTimeout(() => {
                            stat.classList.add('visible');
                        }, index * 300);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(heroStats);
    }
}

// NEW: Fix for portfolio hover animations
function initPortfolioHoverFix() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        // Remove any existing transition delays that cause staggered hover
        item.style.transitionDelay = '0s';
        
        // Ensure consistent hover behavior for all items
        const img = item.querySelector('img');
        const overlay = item.querySelector('.portfolio-overlay');
        const content = item.querySelector('.portfolio-content');
        
        if (img) {
            img.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        if (overlay) {
            overlay.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        if (content) {
            content.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s';
        }
    });
}

// Enhanced Portfolio Filtering
function initEnhancedPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (filterButtons.length === 0 || portfolioItems.length === 0) return;
    
    // Initialize portfolio items with animation
    portfolioItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate-in');
        }, index * 100);
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Enhanced button active state animation
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.transform = 'scale(1)';
            });
            this.classList.add('active');
            this.style.transform = 'scale(1.05)';
            
            const filterValue = this.getAttribute('data-filter');
            
            // Enhanced filtering animation
            portfolioItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    setTimeout(() => {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.classList.add('animate-in');
                        }, 50);
                    }, index * 100);
                } else {
                    item.classList.remove('animate-in');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 500);
                }
            });
            
            // Enhanced grid height transition
            if (portfolioGrid) {
                portfolioGrid.style.height = `${portfolioGrid.scrollHeight}px`;
                setTimeout(() => {
                    portfolioGrid.style.height = 'auto';
                }, 500);
            }
        });
    });
}

// Enhanced Modal Functionality
function initModal() {
    const modal = document.getElementById('mediaModal');
    if (!modal) return;
    
    const closeModal = document.querySelector('.close-modal');
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const videoFrame = document.getElementById('videoFrame');
    const videoFallback = document.querySelector('.video-fallback');
    const fallbackLink = document.getElementById('fallbackLink');

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeMediaModal();
        });
    }

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeMediaModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeMediaModal();
        }
    });

    const viewFullButtons = document.querySelectorAll('.view-full');
    viewFullButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const imageSrc = this.getAttribute('data-image');
            openImageModal(imageSrc);
        });
    });

    const viewVideoButtons = document.querySelectorAll('.view-video');
    viewVideoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const videoId = this.getAttribute('data-video');
            const isShort = this.getAttribute('data-is-short') === 'true';
            
            const youtubeLinkBtn = this.closest('.portfolio-actions').querySelector('.youtube-link');
            if (fallbackLink && youtubeLinkBtn) {
                fallbackLink.href = youtubeLinkBtn.href;
            }
            
            openVideoModal(videoId, isShort);
        });
    });

    const videoPlaceholders = document.querySelectorAll('.video-thumbnail');
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function(e) {
            e.stopPropagation();
            const videoItem = this.closest('.portfolio-item');
            const viewVideoBtn = videoItem.querySelector('.view-video');
            const youtubeLinkBtn = videoItem.querySelector('.youtube-link');
            
            if (viewVideoBtn && youtubeLinkBtn) {
                const videoId = viewVideoBtn.getAttribute('data-video');
                const isShort = viewVideoBtn.getAttribute('data-is-short') === 'true';
                
                if (fallbackLink) {
                    fallbackLink.href = youtubeLinkBtn.href;
                }
                openVideoModal(videoId, isShort);
            }
        });
    });

    function openImageModal(imageSrc) {
        if (!modalImage) return;
        
        if (modalVideo) {
            modalVideo.style.display = 'none';
            videoFrame.src = '';
        }
        
        modalImage.src = imageSrc;
        modalImage.alt = 'Full size thumbnail';
        modalImage.style.display = 'block';
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function openVideoModal(videoId, isShort = false) {
        if (!videoFrame || !modalVideo) return;
        
        let embedUrl;
        if (isShort) {
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } else {
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        }
        
        if (modalImage) {
            modalImage.style.display = 'none';
            modalImage.src = '';
        }
        
        videoFrame.src = embedUrl;
        modalVideo.style.display = 'block';
        
        if (videoFallback) videoFallback.style.display = 'none';
        videoFrame.style.display = 'block';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        videoFrame.onload = function() {
            if (videoFallback) videoFallback.style.display = 'none';
            videoFrame.style.display = 'block';
        };
        
        videoFrame.onerror = function() {
            videoFrame.style.display = 'none';
            if (videoFallback) videoFallback.style.display = 'block';
        };
    }

    function closeMediaModal() {
        const modal = document.getElementById('mediaModal');
        if (!modal) return;
        
        modal.style.display = 'none';
        
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.src = '';
            modalImage.style.display = 'none';
        }
        
        const videoFrame = document.getElementById('videoFrame');
        if (videoFrame) {
            videoFrame.src = '';
        }
        
        const modalVideo = document.getElementById('modalVideo');
        if (modalVideo) {
            modalVideo.style.display = 'none';
        }
        
        document.body.style.overflow = 'auto';
    }
}

// Enhanced Form Animations
function initFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (!input || !label) return;
        
        if (input.value !== '') {
            label.style.top = '-20px';
            label.style.fontSize = '0.9rem';
            label.style.color = 'var(--primary-color)';
        }
        
        input.addEventListener('focus', function() {
            label.style.top = '-20px';
            label.style.fontSize = '0.9rem';
            label.style.color = 'var(--primary-color)';
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                label.style.top = '15px';
                label.style.fontSize = '1rem';
                label.style.color = 'var(--text-light)';
            }
        });
    });
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Enhanced Hover Effects
function initEnhancedHoverEffects() {
    const buttons = document.querySelectorAll('.btn, .action-btn, .filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
    
    // Fix button hover to prevent jumping
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    const cards = document.querySelectorAll('.service-card, .portfolio-item, .visual-card');
    cards.forEach(card => {
        card.classList.add('hover-lift');
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.add('hover-underline');
    });
    
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(button => {
        button.classList.add('btn-pulse', 'btn-fill');
    });
    
    const secondaryButtons = document.querySelectorAll('.btn-secondary');
    secondaryButtons.forEach(button => {
        button.classList.add('btn-fill');
    });
}

// Enhanced Counter Animations
function initEnhancedCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-count'));
                
                target.textContent = '0';
                
                animateCounter(target, 0, endValue, 2000);
                counterObserver.unobserve(target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        if (element.getAttribute('data-count') === '100') {
            element.textContent = value + '%';
        } else {
            element.textContent = value + '+';
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.classList.add('complete');
            
            setTimeout(() => {
                element.classList.remove('complete');
            }, 800);
        }
    };
    window.requestAnimationFrame(step);
}

// FIXED: Enhanced Title Animation - Ensure text is always visible
function initEnhancedTitleAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // Make sure title is always visible
    heroTitle.style.opacity = '1';
    heroTitle.style.visibility = 'visible';
    
    const titleLines = document.querySelectorAll('.title-line');
    
    // Ensure all title lines are visible by default
    titleLines.forEach(line => {
        line.style.opacity = '1';
        line.style.visibility = 'visible';
        line.style.transform = 'none';
    });
    
    // Only animate if not already animated
    if (heroTitle.classList.contains('title-animated')) {
        return;
    }
    
    heroTitle.classList.add('title-animated');
    
    // Reset for animation
    titleLines.forEach(line => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(30px)';
    });
    
    // Animate each line with delay
    titleLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
            line.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }, index * 500);
    });
}

// Enhanced Floating cards
function initEnhancedFloatingCards() {
    handleFloatingCardsLayout();
    window.addEventListener('resize', handleFloatingCardsLayout);
}

function handleFloatingCardsLayout() {
    const floatingCards = document.querySelector('.floating-cards');
    const floatingCardElements = document.querySelectorAll('.floating-card');
    
    if (!floatingCards) return;
    
    if (window.innerWidth <= 768) {
        floatingCards.classList.add('mobile-layout');
        floatingCardElements.forEach(card => {
            card.classList.add('mobile-card');
        });
    } else {
        floatingCards.classList.remove('mobile-layout');
        floatingCardElements.forEach(card => {
            card.classList.remove('mobile-card');
        });
    }
}

// Enhanced Service Card Animations
function initServiceCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    const serviceObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.service-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 200);
                });
                serviceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        serviceObserver.observe(servicesGrid);
    }
}

// Image loading
function initImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.remove('image-loading');
        });
        
        img.addEventListener('error', function() {
            this.classList.remove('image-loading');
        });
        
        if (!img.complete) {
            img.classList.add('image-loading');
        }
    });
}

// Add loaded class when page loads
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    initEnhancedTitleAnimation();
});