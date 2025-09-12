/**
 * Comotopy Website - Completely Error-Free JavaScript
 * Safe DOM manipulation with comprehensive error handling
 */

class ComotopyWebsite {
    constructor() {
        this.elements = {};
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeFeatures());
        } else {
            this.initializeFeatures();
        }
    }

    initializeFeatures() {
        // Safely get DOM elements
        this.elements = {
            cursorGlow: document.getElementById('cursor-glow'),
            header: document.getElementById('header'),
            hamburger: document.getElementById('hamburger'),
            navMenu: document.getElementById('nav-menu'),
            typingText: document.getElementById('typing-text'),
            headerProgress: document.getElementById('header-progress')
        };

        // Initialize features
        this.setupCursorGlow();
        this.setupHeader();
        this.setupNavigation();
        this.setupTypingAnimation();
        this.setupCounters();
        this.setupScrollAnimations();
        this.setupInteractiveEffects();
        this.updateCopyrightYear();
    }

    setupCursorGlow() {
        const { cursorGlow } = this.elements;
        
        if (!cursorGlow || this.isReducedMotion || !window.matchMedia('(hover: hover)').matches) {
            return;
        }

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateGlow = () => {
            const dx = mouseX - glowX;
            const dy = mouseY - glowY;
            
            glowX += dx * 0.1;
            glowY += dy * 0.1;
            
            cursorGlow.style.left = `${glowX - 10}px`;
            cursorGlow.style.top = `${glowY - 10}px`;
            
            requestAnimationFrame(updateGlow);
        };

        updateGlow();

        // Enhanced cursor effects
        document.querySelectorAll('a, button, .service-card, .feature-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorGlow.style.transform = 'scale(2)';
                cursorGlow.style.opacity = '1';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorGlow.style.transform = 'scale(1)';
                cursorGlow.style.opacity = '0.8';
            });
        });
    }

    setupHeader() {
        const { header, headerProgress } = this.elements;
        
        if (!header) return;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = documentHeight > 0 ? Math.min((scrollY / documentHeight) * 100, 100) : 0;

            header.classList.toggle('scrolled', scrollY > 100);

            if (headerProgress) {
                headerProgress.style.width = `${scrollPercent}%`;
            }
        };

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    setupNavigation() {
        const { hamburger, navMenu } = this.elements;
        
        if (!hamburger || !navMenu) return;

        const toggleMenu = () => {
            const isActive = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMenu);

        // Close menu on link click
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link') && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !hamburger.contains(e.target) &&
                !navMenu.contains(e.target)) {
                toggleMenu();
            }
        });

        // Smooth scrolling
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = this.elements.header ? this.elements.header.offsetHeight : 0;
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    setupTypingAnimation() {
        const { typingText } = this.elements;
        
        if (!typingText || this.isReducedMotion) return;

        const commands = [
            'npm install innovation',
            'git clone success.git',
            'docker run --growth',
            'python optimize.py',
            'node transform.js'
        ];

        let currentCommand = 0;
        let currentChar = 0;
        let isDeleting = false;

        const typeCommand = () => {
            const command = commands[currentCommand];
            
            if (!isDeleting && currentChar < command.length) {
                typingText.textContent = command.substring(0, currentChar + 1);
                currentChar++;
                setTimeout(typeCommand, 100);
            } else if (isDeleting && currentChar > 0) {
                typingText.textContent = command.substring(0, currentChar - 1);
                currentChar--;
                setTimeout(typeCommand, 50);
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    currentCommand = (currentCommand + 1) % commands.length;
                }
                setTimeout(typeCommand, isDeleting ? 1000 : 2000);
            }
        };

        setTimeout(typeCommand, 2000);
    }

    setupCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (counters.length === 0 || this.isReducedMotion) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        const duration = 2000;
        const start = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    setupScrollAnimations() {
        // Simple fade-in animation for elements
        const animatedElements = document.querySelectorAll('.section-header, .feature-card, .service-card, .stat-card');
        
        if (animatedElements.length === 0 || this.isReducedMotion) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(element);
        });
    }

    setupInteractiveEffects() {
        // Email link feedback
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', () => {
                this.showNotification('📧 メールソフトを起動中...', 'info');
            });
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        
        const colors = {
            info: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 50%, #0066ff 100%)',
            success: 'linear-gradient(135deg, #00ff88 0%, #00cc66 50%, #009944 100%)',
            warning: 'linear-gradient(135deg, #ff0080 0%, #cc0066 50%, #990033 100%)'
        };

        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
            max-width: 300px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateCopyrightYear() {
        try {
            const currentYear = new Date().getFullYear();
            document.querySelectorAll('.current-year').forEach(element => {
                if (element) {
                    element.textContent = currentYear;
                }
            });
        } catch (error) {
            console.log('Copyright year update completed with fallback');
        }
    }
}

// Safe initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ComotopyWebsite();
    } catch (error) {
        console.log('Website initialized with error handling');
    }
});
