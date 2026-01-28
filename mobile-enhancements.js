// Mobile-Specific JavaScript Enhancements for SplytHires
// Add these functions to your existing script-light.js

// ==================== MOBILE DETECTION & INITIALIZATION ====================
class MobileEnhancements {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.init();
    }

    init() {
        this.handleResponsiveNavigation();
        this.optimizeAnimationsForMobile();
        this.handleTouchInteractions();
        this.fixViewportIssues();
        this.handleOrientationChange();
        this.lazyLoadImages();
        
        // Re-initialize on window resize
        window.addEventListener('resize', this.debounce(() => {
            this.isMobile = window.innerWidth <= 768;
            this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
            this.optimizeAnimationsForMobile();
        }, 250));
    }

    // ==================== MOBILE NAVIGATION ====================
    handleResponsiveNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelector('.nav-links');
        
        if (this.isMobile && navbar && navLinks) {
            // Create mobile menu toggle button
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
            
            // Add to navbar if not already present
            if (!document.querySelector('.mobile-menu-btn')) {
                navbar.querySelector('.nav-container').appendChild(mobileMenuBtn);
            }

            // Toggle menu
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-active');
                mobileMenuBtn.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                // Change icon
                const icon = mobileMenuBtn.querySelector('i');
                if (navLinks.classList.contains('mobile-active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target) && navLinks.classList.contains('mobile-active')) {
                    navLinks.classList.remove('mobile-active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                }
            });

            // Close menu on link click
            navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('mobile-active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                });
            });
        }
    }

    // ==================== OPTIMIZE ANIMATIONS ====================
    optimizeAnimationsForMobile() {
        if (this.isMobile) {
            // Disable complex animations on mobile for performance
            const dashboard3d = document.querySelector('.dashboard-3d');
            if (dashboard3d) {
                dashboard3d.style.animation = 'none';
            }

            // Simplify notification bubbles
            const notificationBubbles = document.querySelectorAll('.notification-bubble');
            notificationBubbles.forEach(bubble => {
                bubble.style.display = 'none';
            });

            // Reduce marquee speed
            const marqueeContent = document.querySelectorAll('.marquee-content');
            marqueeContent.forEach(marquee => {
                marquee.style.animationDuration = '45s';
            });
        }
    }

    // ==================== TOUCH INTERACTIONS ====================
    handleTouchInteractions() {
        if (this.isTouch) {
            // Add touch feedback to buttons
            const buttons = document.querySelectorAll('.cta-primary, .cta-secondary, .modal-cta-primary');
            buttons.forEach(button => {
                button.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                });
                
                button.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 100);
                });
            });

            // Prevent double-tap zoom on buttons
            buttons.forEach(button => {
                button.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    button.click();
                });
            });

            // Handle card taps
            const cards = document.querySelectorAll('.pricing-card, .feature-card, .screenshot-card');
            cards.forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                
                card.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);
                });
            });
        }
    }

    // ==================== VIEWPORT FIXES ====================
    fixViewportIssues() {
        // Fix 100vh on mobile (accounts for address bar)
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVh();
        window.addEventListener('resize', this.debounce(setVh, 100));
        window.addEventListener('orientationchange', setVh);

        // Prevent zoom on input focus (iOS)
        if (this.isMobile && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    if (input.style.fontSize < '16px') {
                        input.style.fontSize = '16px';
                    }
                });
            });
        }
    }

    // ==================== ORIENTATION CHANGE ====================
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Hide certain elements in landscape mode
            setTimeout(() => {
                if (window.innerHeight < 500 && window.orientation !== 0) {
                    document.body.classList.add('landscape-mode');
                } else {
                    document.body.classList.remove('landscape-mode');
                }
            }, 100);
        });
    }

    // ==================== LAZY LOADING ====================
    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px'
            });

            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ==================== UTILITY FUNCTIONS ====================
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ==================== MOBILE MODAL IMPROVEMENTS ====================
class MobileModalHandler {
    constructor() {
        this.init();
    }

    init() {
        this.handleModalScrolling();
        this.preventBackgroundScroll();
        this.improveCalendlyModal();
    }

    handleModalScrolling() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            // Prevent scroll chaining on mobile
            modal.addEventListener('touchmove', (e) => {
                if (e.target === modal) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    }

    preventBackgroundScroll() {
        const modals = document.querySelectorAll('.modal');
        const openButtons = document.querySelectorAll('[id*="open-modal"]');
        const closeButtons = document.querySelectorAll('.close-button, .close-button-calendly');

        openButtons.forEach(button => {
            button.addEventListener('click', () => {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            });
        });

        // Also handle backdrop clicks
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                }
            });
        });
    }

    improveCalendlyModal() {
        const calendlyModal = document.getElementById('calendly-modal');
        if (calendlyModal && window.innerWidth <= 768) {
            // Make Calendly iframe responsive
            const iframe = calendlyModal.querySelector('iframe');
            if (iframe) {
                iframe.setAttribute('scrolling', 'yes');
                iframe.style.webkitOverflowScrolling = 'touch';
            }
        }
    }
}

// ==================== MOBILE SCROLL OPTIMIZATIONS ====================
class MobileScrollOptimizer {
    constructor() {
        this.ticking = false;
        this.lastScrollY = 0;
        this.init();
    }

    init() {
        if (window.innerWidth <= 768) {
            this.setupScrollHandler();
            this.hideNavbarOnScroll();
        }
    }

    setupScrollHandler() {
        window.addEventListener('scroll', () => {
            this.lastScrollY = window.scrollY;
            
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                
                this.ticking = true;
            }
        }, { passive: true });
    }

    handleScroll() {
        // Optimize animations based on scroll position
        const sections = document.querySelectorAll('[data-animation]');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('in-view');
            }
        });
    }

    hideNavbarOnScroll() {
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
}

// ==================== INITIALIZE ALL MOBILE ENHANCEMENTS ====================
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize mobile enhancements on mobile devices
    if (window.innerWidth <= 1024) {
        new MobileEnhancements();
        new MobileModalHandler();
        new MobileScrollOptimizer();
    }
});

// Add mobile menu styles dynamically
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: transparent;
            border: none;
            color: var(--text-primary);
            font-size: 1.5rem;
            cursor: pointer;
            transition: transform 0.3s ease;
            z-index: 1001;
        }

        .mobile-menu-btn:active {
            transform: scale(0.9);
        }

        .nav-links {
            display: flex !important;
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem 1rem;
            gap: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        }

        .nav-links.mobile-active {
            transform: translateY(0);
            opacity: 1;
        }

        .nav-link {
            padding: 1rem;
            text-align: center;
            font-size: 1.1rem;
            border-bottom: 1px solid var(--border-light);
        }

        .nav-link:last-child {
            border-bottom: none;
        }

        body.menu-open {
            overflow: hidden;
        }

        /* Landscape mode adjustments */
        body.landscape-mode .hero-visual {
            display: none;
        }

        body.landscape-mode .dashboard-3d {
            display: none;
        }

        /* Smooth scrolling for mobile */
        html {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        }

        /* Prevent horizontal scroll */
        body {
            overflow-x: hidden;
            position: relative;
        }

        /* Touch-friendly tap highlights */
        * {
            -webkit-tap-highlight-color: rgba(79, 70, 229, 0.1);
        }
    }
`;
document.head.appendChild(mobileStyles);