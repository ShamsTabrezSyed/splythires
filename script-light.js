// Advanced Animation Engine - GSAP-like Effects
class AnimationEngine {
    constructor() {
        this.elements = new Map();
        this.observers = new Map();
        this.timelines = new Map();
        this.isInitialized = false;
    }

    // Initialize the animation engine
    init() {
        if (this.isInitialized) return;

        this.setupIntersectionObserver();
        // this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupKineticTypography();
        this.setupCountUpAnimations();
        this.setupPricingToggle();
        this.setupFAQ();
        this.setupToastNotifications();
        this.setupCapacityMeter();
        this.setupModal();


        this.isInitialized = true;
    }

    // Easing functions
    easing = {
        linear: t => t,
        easeIn: t => t * t,
        easeOut: t => t * (2 - t),
        easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        spring: t => {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        },
        bounce: t => {
            const n1 = 7.5625;
            const d1 = 2.75;
            if (t < 1 / d1) {
                return n1 * t * t;
            } else if (t < 2 / d1) {
                return n1 * (t -= 1.5 / d1) * t + 0.75;
            } else if (t < 2.5 / d1) {
                return n1 * (t -= 2.25 / d1) * t + 0.9375;
            } else {
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        }
    };

    // Animate element properties
    animate(element, properties, options = {}) {
        const {
            duration = 1000,
            delay = 0,
            easing = 'easeOut',
            onComplete = null
        } = options;

        const startTime = performance.now() + delay;
        const startValues = {};
        const endValues = {};

        // Store initial values
        for (const prop in properties) {
            const currentValue = parseFloat(getComputedStyle(element)[prop]) || 0;
            startValues[prop] = currentValue;
            endValues[prop] = parseFloat(properties[prop]);
        }

        const animation = (currentTime) => {
            if (currentTime < startTime) {
                requestAnimationFrame(animation);
                return;
            }

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easing[easing](progress);

            for (const prop in properties) {
                const startValue = startValues[prop];
                const endValue = endValues[prop];
                const currentValue = startValue + (endValue - startValue) * easedProgress;

                if (prop.includes('translate') || prop.includes('scale') || prop.includes('rotate')) {
                    element.style.transform = prop;
                } else {
                    element.style[prop] = currentValue + (prop.includes('opacity') ? '' : 'px');
                }
            }

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else if (onComplete) {
                onComplete();
            }
        };

        requestAnimationFrame(animation);
    }

    // Setup Intersection Observer for scroll animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animation;

                    switch (animationType) {
                        case 'flip':
                            this.animateFlip(element);
                            break;
                        case 'slide':
                            this.animateSlide(element);
                            break;
                        case 'fade':
                            this.animateFade(element);
                            break;
                        default:
                            this.animateIn(element);
                    }
                }
            });
        }, observerOptions);

        // Observe elements with animation data
        document.querySelectorAll('[data-animation]').forEach(el => {
            observer.observe(el);
        });
    }

    // Animate flip effect
    animateFlip(element) {
        element.style.transform = 'rotateY(90deg)';
        element.style.opacity = '0';

        setTimeout(() => {
            this.animate(element, {
                transform: 'rotateY(0deg)',
                opacity: 1
            }, { duration: 600, easing: 'spring' });
        }, 100);
    }

    // Animate slide effect
    animateSlide(element) {
        const direction = element.dataset.direction || 'up';
        const transforms = {
            up: 'translateY(30px)',
            down: 'translateY(-30px)',
            left: 'translateX(30px)',
            right: 'translateX(-30px)'
        };

        element.style.transform = transforms[direction];
        element.style.opacity = '0';

        setTimeout(() => {
            this.animate(element, {
                transform: direction.includes('X') ? 'translateX(0)' : 'translateY(0)',
                opacity: 1
            }, { duration: 800, easing: 'easeOut' });
        }, 100);
    }

    // Animate fade effect
    animateFade(element) {
        element.style.opacity = '0';

        setTimeout(() => {
            this.animate(element, {
                opacity: 1
            }, { duration: 1000, easing: 'easeOut' });
        }, 100);
    }

    // Animate in effect
    animateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        setTimeout(() => {
            this.animate(element, {
                opacity: 1,
                transform: 'translateY(0)'
            }, { duration: 600, easing: 'easeOut' });
        }, 100);
    }

    // Setup scroll animations
    setupScrollAnimations() {
        let lastScroll = 0;
        const navbar = document.getElementById('navbar');
        const navLogo = document.getElementById('nav-logo');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Navbar scroll effect
            if (navbar) {
                if (currentScroll > 100) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.8)';
                    navbar.style.boxShadow = 'none';
                }
            }

            // Logo scale effect
            if (navLogo && currentScroll > 100) {
                navLogo.style.transform = 'scale(0.9)';
            } else if (navLogo) {
                navLogo.style.transform = 'scale(1)';
            }

            lastScroll = currentScroll;
        });
    }

    // Setup hover effects
    setupHoverEffects() {
        // Marquee pause on hover
        const marquees = document.querySelectorAll('.marquee-content');
        marquees.forEach(marquee => {
            marquee.addEventListener('mouseenter', () => {
                marquee.style.animationPlayState = 'paused';
            });

            marquee.addEventListener('mouseleave', () => {
                marquee.style.animationPlayState = 'running';
            });
        });

        // Partner logo hover effects - enhanced for SVG logos
        const partnerLogos = document.querySelectorAll('.partner-logo');
        partnerLogos.forEach(logo => {
            logo.addEventListener('mouseenter', (e) => {
                // Add enhanced hover effect for better visual feedback
                logo.style.background = 'var(--bg-light-gray)';
                logo.style.boxShadow = '0 8px 30px rgba(79, 70, 229, 0.15)';

                // Animate the logo scaling
                const companyLogo = logo.querySelector('.company-logo');
                if (companyLogo) {
                    companyLogo.style.transform = 'scale(1.1)';
                    companyLogo.style.filter = 'grayscale(0%)';
                    companyLogo.style.opacity = '1';
                }
            });

            logo.addEventListener('mouseleave', (e) => {
                // Reset styles
                logo.style.background = 'transparent';
                logo.style.boxShadow = 'none';

                // Reset logo styles
                const companyLogo = logo.querySelector('.company-logo');
                if (companyLogo) {
                    companyLogo.style.transform = 'scale(1)';
                    companyLogo.style.filter = 'grayscale(100%)';
                    companyLogo.style.opacity = '0.8';
                }
            });
        });
    }

    // Setup kinetic typography
    setupKineticTypography() {
        const kineticText = document.getElementById('kinetic-text');
        const words = ['Interviewing', 'Showing', 'Upgrading', 'Networking', 'Attracting'];
        let currentIndex = 0;

        if (kineticText) {
            setInterval(() => {
                currentIndex = (currentIndex + 1) % words.length;
                const nextWord = words[currentIndex];

                // Typewriter effect
                kineticText.style.opacity = '0';

                setTimeout(() => {
                    kineticText.textContent = nextWord;
                    kineticText.style.opacity = '1';
                }, 300);
            }, 3000);
        }
    }

    // Setup count-up animations
    setupCountUpAnimations() {
        const countElements = document.querySelectorAll('[data-count]');

        const countUp = (element) => {
            const target = parseInt(element.dataset.count);
            const duration = 2000;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(target * this.easing.easeOut(progress));

                element.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            };

            requestAnimationFrame(updateCount);
        };

        // Trigger count-up when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    countUp(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        });

        countElements.forEach(el => observer.observe(el));
    }



    // Setup modal
    setupModal() {
        const modal = document.getElementById('campaign-modal');
        const openBtnHero = document.getElementById('open-modal-btn');
        const openBtnConversion = document.getElementById('open-modal-btn-conversion');
        const closeBtn = document.querySelector('.close-button');

        console.log('Modal:', modal);
        console.log('Open Button Hero:', openBtnHero);
        console.log('Open Button Conversion:', openBtnConversion);
        console.log('Close Button:', closeBtn);

        const openButtons = [];
        if (openBtnHero) openButtons.push(openBtnHero);
        if (openBtnConversion) openButtons.push(openBtnConversion);

        if (modal && openButtons.length > 0 && closeBtn) {
            openButtons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('Open button clicked:', button.id);
                    modal.style.display = 'block';
                });
            });

            closeBtn.addEventListener('click', () => {
                console.log('Close button clicked');
                modal.style.display = 'none';
            });

            window.addEventListener('click', (event) => {
                if (event.target == modal) {
                    console.log('Clicked outside modal');
                    modal.style.display = 'none';
                }
            });
        }
    }

    // Setup pricing toggle
    setupPricingToggle() {
        const toggle = document.getElementById('pricing-toggle');
        const monthlyPrices = document.querySelectorAll('.amount.monthly');
        const quarterlyPrices = document.querySelectorAll('.amount.quarterly');

        if (toggle) {
            toggle.addEventListener('click', () => {
                const isActive = toggle.classList.contains('active');

                // Animate the toggle
                if (isActive) {
                    toggle.classList.remove('active');
                    monthlyPrices.forEach(price => {
                        price.style.display = 'block';
                    });
                    quarterlyPrices.forEach(price => {
                        price.style.display = 'none';
                    });
                } else {
                    toggle.classList.add('active');
                    monthlyPrices.forEach(price => {
                        price.style.display = 'none';
                    });
                    quarterlyPrices.forEach(price => {
                        price.style.display = 'block';
                    });
                }
            });
        }
    }

    // Setup FAQ accordion
    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherAnswer.style.maxHeight = '0';
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // Setup toast notifications
    setupToastNotifications() {
        const toast = document.getElementById('toast-notification');
        const toastMessage = document.getElementById('toast-message');
        const messages = [
            'Alex just landed an interview at Uber.',
            'Sarah received an offer from Meta.',
            'Mike got an interview at Google.',
            'Emily landed an offer from Netflix.',
            'David received an interview at Apple.'
        ];

        let messageIndex = 0;

        const showToast = () => {
            if (toast && toastMessage) {
                toastMessage.textContent = messages[messageIndex];
                toast.classList.add('show');

                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);

                messageIndex = (messageIndex + 1) % messages.length;
            }
        };

        // Show first toast after 5 seconds, then every 30 seconds
        setTimeout(() => {
            showToast();
            setInterval(showToast, 30000);
        }, 5000);
    }

    // Setup capacity meter animation
    setupCapacityMeter() {
        const capacityFill = document.querySelector('.capacity-fill');
        const spotsCount = document.querySelector('.spots-count');

        if (capacityFill && spotsCount) {
            // Simulate spots being taken
            setInterval(() => {
                const currentSpots = parseInt(spotsCount.textContent);
                if (currentSpots > 5) {
                    spotsCount.textContent = currentSpots - 1;

                    // Update capacity meter
                    const newWidth = 75 + ((12 - currentSpots) * 2);
                    this.animate(capacityFill, {
                        width: newWidth + '%'
                    }, { duration: 1000, easing: 'easeOut' });
                }
            }, 15000);
        }
    }



    // Setup floating chat button pulse
    setupFloatingChat() {
        const floatingChat = document.getElementById('floating-chat');

        if (floatingChat) {
            setInterval(() => {
                this.animate(floatingChat, {
                    transform: 'scale(1.1)'
                }, { duration: 200, easing: 'easeOut' });

                setTimeout(() => {
                    this.animate(floatingChat, {
                        transform: 'scale(1)'
                    }, { duration: 200, easing: 'easeOut' });
                }, 200);
            }, 5000);
        }
    }

    // Smooth scroll for navigation links
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Button ripple effects
    setupRippleEffects() {
        const buttons = document.querySelectorAll('.cta-primary, .cta-secondary, .btn-select');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}

// Initialize the animation engine
const animationEngine = new AnimationEngine();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    animationEngine.init();
    animationEngine.setupSmoothScroll();
    animationEngine.setupRippleEffects();
    animationEngine.setupFloatingChat();
});

// Add ripple effect styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .cta-primary, .cta-secondary, .btn-select {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyles);

// Console Easter Egg
console.log('%c⚡ SplytHires - High-Voltage Minimalism', 'font-size: 20px; font-weight: bold; color: #4F46E5;');
console.log('%cStop Applying. Start Interviewing.', 'font-size: 14px; color: #06B6D4;');

