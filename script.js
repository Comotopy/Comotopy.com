/**
 * Comotopy Website - Optimized JavaScript
 * Performance-focused with modern web APIs
 */

class ComotopyWebsite {
    constructor() {
        this.observers = new Map();
        this.throttledFunctions = new Map();
        this.init();
    }

    init() {
        this.initializeHeader();
        this.initializeNavigation();
        this.initializeAnimations();
        this.initializeCounters();
        this.initializeInteractions();
        this.initializeAccessibility();
        this.updateCopyrightYear();
    }

    initializeHeader() {
        const header = document.getElementById('header');
        const headerProgress = document.getElementById('header-progress');
        
        if (!header) return;

        const handleScroll = this.throttle(() => {
            const scrollY = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min((scrollY / documentHeight) * 100, 100);

            // Header background effect
            header.classList.toggle('is-scrolled', scrollY > 100);

            // Progress bar
            if (headerProgress) {
                headerProgress.style.width = `${scrollPercent}%`;
            }
        }, 16);

        window.addEventListener('scroll', handleScroll, { passive: true });
        this.throttledFunctions.set('headerScroll', handleScroll);
    }

    initializeNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (!hamburger || !navMenu) return;

        const toggleMenu = () => {
            const isActive = navMenu.classList.toggle('is-active');
            hamburger.classList.toggle('is-active');
            hamburger.setAttribute('aria-expanded', isActive.toString());
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMenu);

        // Close menu on navigation
        navMenu.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link')) {
                toggleMenu();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('is-active')) {
                toggleMenu();
            }
        });

        // Smooth scrolling for anchor links
        this.initializeSmoothScrolling();
    }

    initializeSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    initializeAnimations() {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-reveal').forEach(element => {
            animationObserver.observe(element);
        });

        this.observers.set('animation', animationObserver);

        // Parallax effect for hero shapes
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.initializeParallax();
        }
    }

    initializeParallax() {
        const heroBackground = document.querySelector('.hero__background');
        if (!heroBackground) return;

        const handleParallax = this.throttle(() => {
            const scrolled = window.pageYOffset;
            const yPos = -(scrolled * 0.3);
            heroBackground.style.transform = `translateY(${yPos}px)`;
        }, 16);

        window.addEventListener('scroll', handleParallax, { passive: true });
        this.throttledFunctions.set('parallax', handleParallax);
    }

    initializeCounters() {
        const counterElements = document.querySelectorAll('[data-counter]');
        if (counterElements.length === 0) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(element => {
            counterObserver.observe(element);
        });

        this.observers.set('counter', counterObserver);
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const start = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(updateCounter);
    }

    initializeInteractions() {
        // Enhanced button interactions
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // Service card tilt effect (desktop only)
        if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.initializeCardTilt();
        }

        // Enhanced email link interactions
        this.initializeEmailLinks();
    }

    initializeCardTilt() {
        document.querySelectorAll('.service-card:not(.service-card--featured)').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    initializeEmailLinks() {
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', () => {
                this.showEmailFeedback();
            });
        });
    }

    showEmailFeedback() {
        const feedback = document.createElement('div');
        feedback.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(10px);
            ">
                📧 メールソフトを起動中...
            </div>
        `;
        
        document.body.appendChild(feedback);
        const notification = feedback.firstElementChild;
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => document.body.removeChild(feedback), 300);
        }, 3000);
    }

    initializeAccessibility() {
        // Keyboard navigation improvements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('nav-menu');
                const hamburger = document.getElementById('hamburger');
                
                if (navMenu && navMenu.classList.contains('is-active')) {
                    navMenu.classList.remove('is-active');
                    hamburger.classList.remove('is-active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.focus();
                    document.body.style.overflow = '';
                }
            }
        });
    }

    updateCopyrightYear() {
        document.querySelectorAll('.current-year').forEach(element => {
            element.textContent = new Date().getFullYear();
        });
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    destroy() {
        this.throttledFunctions.forEach((func, key) => {
            window.removeEventListener('scroll', func);
        });

        this.observers.forEach((observer, key) => {
            observer.disconnect();
        });

        document.body.style.overflow = '';
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.comotopyWebsite = new ComotopyWebsite();
    });
} else {
    window.comotopyWebsite = new ComotopyWebsite();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.comotopyWebsite) {
        window.comotopyWebsite.destroy();
    }
});
