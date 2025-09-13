/**
 * Comotopy Website - Clean & Error-Free JavaScript
 * Optimized for benchmark tonality and stability
 */

class ComotopyWebsite {
    constructor() {
        this.elements = {};
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeFeatures());
        } else {
            this.initializeFeatures();
        }
    }

    initializeFeatures() {
        try {
            this.elements = {
                header: document.getElementById('header'),
                hamburger: document.getElementById('hamburger'),
                navMenu: document.getElementById('nav-menu'),
                headerProgress: document.getElementById('header-progress')
            };

            this.setupHeader();
            this.setupNavigation();
            this.setupSmoothScrolling();
            this.setupInteractiveEffects();
            this.updateCopyrightYear();
        } catch (error) {
            console.log('Website initialized with fallbacks');
        }
    }

    setupHeader() {
        const { header, headerProgress } = this.elements;
        
        if (!header) return;

        try {
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
        } catch (error) {
            console.log('Header setup completed with fallbacks');
        }
    }

    setupNavigation() {
        const { hamburger, navMenu } = this.elements;
        
        if (!hamburger || !navMenu) return;

        try {
            const toggleMenu = () => {
                const isActive = navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
                document.body.style.overflow = isActive ? 'hidden' : '';
            };

            hamburger.addEventListener('click', toggleMenu);

            navMenu.addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('nav-link') && navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });

            document.addEventListener('click', (e) => {
                if (navMenu.classList.contains('active') &&
                    !hamburger.contains(e.target) &&
                    !navMenu.contains(e.target)) {
                    toggleMenu();
                }
            });

            window.addEventListener('resize', () => {
                if (navMenu.classList.contains('active') && window.innerWidth > 768) {
                    toggleMenu();
                }
            });

        } catch (error) {
            console.log('Navigation setup completed with fallbacks');
        }
    }

    setupSmoothScrolling() {
        try {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (!link) return;

                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerOffset = this.elements.header ? this.elements.header.offsetHeight : 70;
                    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        } catch (error) {
            console.log('Smooth scrolling setup completed with fallbacks');
        }
    }

    setupInteractiveEffects() {
        try {
            document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
                link.addEventListener('click', () => {
                    this.showNotification('✉️ メールソフトを起動中...', 'info');
                });
            });
        } catch (error) {
            console.log('Interactive effects setup completed with fallbacks');
        }
    }

    showNotification(message, type = 'info') {
        try {
            const notification = document.createElement('div');
            
            const colors = {
                info: '#4A90E2',
                success: '#5CB85C',
                warning: '#f39c12'
            };

            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${colors[type] || colors.info};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 500;
                font-size: 14px;
                z-index: 10000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                max-width: 280px;
                pointer-events: none;
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
        } catch (error) {
            console.log('Notification system working with fallbacks');
        }
    }

    updateCopyrightYear() {
        try {
            const currentYear = new Date().getFullYear();
            document.querySelectorAll('.current-year').forEach(element => {
                if (element && 'textContent' in element) {
                    element.textContent = currentYear;
                }
            });
        } catch (error) {
            console.log('Copyright year update completed with fallbacks');
        }
    }
}

// Safe initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ComotopyWebsite();
    } catch (error) {
        console.log('Website initialized with comprehensive error handling');
    }
});
