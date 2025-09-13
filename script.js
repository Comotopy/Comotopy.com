/**
 * Comotopy Website - White-Based Design JavaScript
 * Ultra-clean implementation with comprehensive error handling
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
            this.setupScrollAnimations();
            this.setupInteractiveEffects();
            this.updateCopyrightYear();
        } catch (error) {
            console.log('Website initialized with comprehensive fallbacks');
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

                header.classList.toggle('scrolled', scrollY > 50);

                if (headerProgress) {
                    headerProgress.style.width = `${scrollPercent}%`;
                }
            };

            window.addEventListener('scroll', updateHeader, { passive: true });
            updateHeader();
        } catch (error) {
            console.log('Header functionality initialized with fallbacks');
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
            console.log('Navigation system initialized with fallbacks');
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
            console.log('Smooth scrolling initialized with fallbacks');
        }
    }

    setupScrollAnimations() {
        if (this.isReducedMotion) return;

        try {
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

            document.querySelectorAll('.service-card, .section-header').forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(element);
            });
        } catch (error) {
            console.log('Scroll animations initialized with fallbacks');
        }
    }

    setupInteractiveEffects() {
        try {
            // Enhanced button interactions
            document.querySelectorAll('.btn').forEach(button<span class="cursor">█</span>
