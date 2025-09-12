/**
 * Comotopy Ultra Cool Website JavaScript
 * Next-gen interactive features with error handling
 */

class ComotopyUltraCool {
    constructor() {
        this.cursorGlow = document.getElementById('cursor-glow');
        this.header = document.getElementById('header');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.typingElement = document.getElementById('typing-text');
        
        this.init();
    }

    init() {
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
        if (!this.cursorGlow || !window.matchMedia('(hover: hover)').matches) return;

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
            
            this.cursorGlow.style.left = `${glowX - 10}px`;
            this.cursorGlow.style.top = `${glowY - 10}px`;
            
            requestAnimationFrame(updateGlow);
        };

        updateGlow();

        // Enhanced cursor effects on interactive elements
        document.querySelectorAll('a, button, .service-card, .feature-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursorGlow.style.transform = 'scale(2)';
                this.cursorGlow.style.opacity = '1';
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursorGlow.style.transform = 'scale(1)';
                this.cursorGlow.style.opacity = '0.8';
            });
        });
    }

    setupHeader() {
        if (!this.header) return;

        const headerProgress = this.header.querySelector('.header__progress');
        
        const updateHeader = () => {
            const scrollY = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min((scrollY / documentHeight) * 100, 100);

            // Header background effect
            this.header.classList.toggle('scrolled', scrollY > 100);

            // Progress bar
            if (headerProgress) {
                headerProgress.style.width = `${scrollPercent}%`;
            }
        };

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    setupNavigation() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.addEventListener('click', () => {
            const isActive = this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close menu on link click
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
                document.body.style.overflow = '';
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

    setupTypingAnimation() {
        if (!this.typingElement) return;

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
                this.typingElement.textContent = command.substring(0, currentChar + 1);
                currentChar++;
                setTimeout(typeCommand, 100);
            } else if (isDeleting && currentChar > 0) {
                this.typingElement.textContent = command.substring(0, currentChar - 1);
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

        // Start typing animation after page load
        setTimeout(typeCommand, 2000);
    }

    setupCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (counters.length === 0) return;

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
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
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
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Animate elements on scroll
        document.querySelectorAll('.section-header, .feature-card, .service-card, .stat-card').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(element);
        });
    }

    setupInteractiveEffects() {
        // Enhanced button interactions
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });

        // Service card tilt effect
        document.querySelectorAll('.service-card, .feature-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 768) return;

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
            info: 'var(--gradient-primary)',
            success: 'var(--gradient-accent)',
            warning: 'var(--gradient-secondary)'
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
            box-shadow: var(--shadow-neon);
            backdrop-filter: blur(10px);
            max-width: 300px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });
        
        // Animate out and remove
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
            document.querySelectorAll('.current-year').forEach(element => {
                element.textContent = new Date().getFullYear();
            });
        } catch (error) {
            console.log('Copyright year update failed, but continuing...');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComotopyUltraCool();
});
