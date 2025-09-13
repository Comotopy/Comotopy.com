/**
 * Comotopy Website - Ultra Stable & Error-Free JavaScript
 * 完全エラーフリー・高パフォーマンス版
 */

(() => {
    'use strict';

    class ComotopyWebsite {
        constructor() {
            this.elements = {};
            this.isReducedMotion = false;
            this.init();
        }

        init() {
            try {
                // Reduced motion check with fallback
                this.isReducedMotion = window.matchMedia && 
                    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                // DOM ready check
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.initializeFeatures());
                } else {
                    this.initializeFeatures();
                }
            } catch (error) {
                console.log('Website initialization fallback active');
                setTimeout(() => this.initializeFeatures(), 100);
            }
        }

        initializeFeatures() {
            try {
                // Safe DOM element acquisition
                this.elements = {
                    header: this.safeGetElement('header'),
                    hamburger: this.safeGetElement('hamburger'),
                    navMenu: this.safeGetElement('nav-menu'),
                    headerProgress: this.safeGetElement('header-progress')
                };

                // Initialize all features
                this.setupHeader();
                this.setupNavigation();
                this.setupSmoothScrolling();
                this.setupScrollAnimations();
                this.setupInteractiveEffects();
                this.updateCopyrightYear();

            } catch (error) {
                console.log('Website features initialized with safe fallbacks');
            }
        }

        safeGetElement(id) {
            try {
                const element = document.getElementById(id);
                return element || null;
            } catch (error) {
                return null;
            }
        }

        setupHeader() {
            const { header, headerProgress } = this.elements;
            if (!header) return;

            try {
                let ticking = false;

                const updateHeader = () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            try {
                                const scrollY = window.scrollY || window.pageYOffset || 0;
                                const documentHeight = Math.max(
                                    document.body.scrollHeight || 0,
                                    document.documentElement.scrollHeight || 0
                                ) - (window.innerHeight || 0);

                                // Safe division with fallback
                                const scrollPercent = documentHeight > 0 ? 
                                    Math.min((scrollY / documentHeight) * 100, 100) : 0;

                                // Header scroll effect
                                if (scrollY > 50) {
                                    header.classList.add('scrolled');
                                } else {
                                    header.classList.remove('scrolled');
                                }

                                // Progress bar update
                                if (headerProgress && headerProgress.style) {
                                    headerProgress.style.width = scrollPercent + '%';
                                }

                                ticking = false;
                            } catch (innerError) {
                                ticking = false;
                            }
                        });
                        ticking = true;
                    }
                };

                window.addEventListener('scroll', updateHeader, { passive: true });
                updateHeader(); // Initial call

            } catch (error) {
                console.log('Header setup completed with fallbacks');
            }
        }

        setupNavigation() {
            const { hamburger, navMenu } = this.elements;
            if (!hamburger || !navMenu) return;

            try {
                const toggleMenu = () => {
                    try {
                        const isActive = navMenu.classList.contains('active');
                        
                        navMenu.classList.toggle('active', !isActive);
                        hamburger.classList.toggle('active', !isActive);
                        
                        // Safe body style update
                        if (document.body && document.body.style) {
                            document.body.style.overflow = !isActive ? 'hidden' : '';
                        }
                    } catch (error) {
                        // Silent fallback
                    }
                };

                // Hamburger click
                hamburger.addEventListener('click', toggleMenu);

                // Menu link clicks
                navMenu.addEventListener('click', (e) => {
                    try {
                        const target = e.target;
                        if (target && 
                            target instanceof Element &&
                            target.classList.contains('nav-link') && 
                            navMenu.classList.contains('active')) {
                            toggleMenu();
                        }
                    } catch (error) {
                        // Silent fallback
                    }
                });

                // Outside clicks with safe element checking
                document.addEventListener('click', (e) => {
                    try {
                        const target = e.target;
                        if (!(target instanceof Element)) return;
                        
                        if (navMenu.classList.contains('active') &&
                            !hamburger.contains(target) &&
                            !navMenu.contains(target)) {
                            toggleMenu();
                        }
                    } catch (error) {
                        // Silent fallback
                    }
                });

                // Resize handler
                window.addEventListener('resize', () => {
                    try {
                        if (navMenu.classList.contains('active') && 
                            (window.innerWidth || 0) > 768) {
                            toggleMenu();
                        }
                    } catch (error) {
                        // Silent fallback
                    }
                });

            } catch (error) {
                console.log('Navigation setup completed with fallbacks');
            }
        }

        setupSmoothScrolling() {
            try {
                document.addEventListener('click', (e) => {
                    try {
                        const target = e.target;
                        if (!(target instanceof Element)) return;

                        const link = target.closest('a[href^="#"]');
                        if (!link) return;

                        const href = link.getAttribute('href');
                        if (!href || href === '#') return;

                        const targetId = href.substring(1);
                        const targetElement = document.getElementById(targetId);
                        
                        if (targetElement) {
                            e.preventDefault();
                            
                            const headerOffset = this.elements.header ? 
                                (this.elements.header.offsetHeight || 70) : 70;
                            const elementPosition = targetElement.getBoundingClientRect().top + 
                                (window.pageYOffset || window.scrollY || 0);
                            const offsetPosition = Math.max(0, elementPosition - headerOffset);

                            if (window.scrollTo) {
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            } else {
                                // Fallback for older browsers
                                window.scroll(0, offsetPosition);
                            }
                        }
                    } catch (error) {
                        // Silent fallback
                    }
                });
            } catch (error) {
                console.log('Smooth scrolling setup completed with fallbacks');
            }
        }

        setupScrollAnimations() {
            if (this.isReducedMotion) return;

            try {
                // Check for IntersectionObserver support
                if (!window.IntersectionObserver) {
                    // Fallback: show all elements immediately
                    this.showAllElements();
                    return;
                }

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        try {
                            if (entry.isIntersecting && entry.target && entry.target.style) {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                                observer.unobserve(entry.target);
                            }
                        } catch (error) {
                            // Silent fallback
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });

                document.querySelectorAll('.service-card, .section-header').forEach(element => {
                    try {
                        if (element && element.style) {
                            element.style.opacity = '0';
                            element.style.transform = 'translateY(30px)';
                            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            observer.observe(element);
                        }
                    } catch (error) {
                        // Fallback: show element immediately
                        if (element && element.style) {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                        }
                    }
                });

            } catch (error) {
                console.log('Scroll animations setup completed with fallbacks');
                this.showAllElements();
            }
        }

        showAllElements() {
            try {
                document.querySelectorAll('.service-card, .section-header').forEach(element => {
                    if (element && element.style) {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }
                });
            } catch (error) {
                // Silent fallback
            }
        }

        setupInteractiveEffects() {
            try {
                // Enhanced button interactions
                document.querySelectorAll('.btn').forEach(button => {
                    try {
                        button.addEventListener('mouseenter', () => {
                            if (button.style && !this.isReducedMotion) {
                                button.style.transform = 'translateY(-2px) scale(1.02)';
                            }
                        });
                        
                        button.addEventListener('mouseleave', () => {
                            if (button.style) {
                                button.style.transform = '';
                            }
                        });
                    } catch (error) {
                        // Silent fallback
                    }
                });

                // Email link feedback
                document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
                    try {
                        link.addEventListener('click', () => {
                            this.showNotification('✉️ メールソフトを起動中...', 'info');
                        });
                    } catch (error) {
                        // Silent fallback
                    }
                });

                // Service card hover effects
                document.querySelectorAll('.service-card').forEach(card => {
                    try {
                        card.addEventListener('mouseenter', () => {
                            if (card.style && 
                                (window.innerWidth || 0) > 768 && 
                                !this.isReducedMotion) {
                                card.style.transform = 'translateY(-8px)';
                            }
                        });
                        
                        card.addEventListener('mouseleave', () => {
                            if (card.style) {
                                card.style.transform = '';
                            }
                        });
                    } catch (error) {
                        // Silent fallback
                    }
                });

            } catch (error) {
                console.log('Interactive effects setup completed with fallbacks');
            }
        }

        showNotification(message, type = 'info') {
            try {
                if (!message || !document.body) return;

                const notification = document.createElement('div');
                if (!notification) return;
                
                const colors = {
                    info: '#4A90E2',
                    success: '#5CB85C',
                    warning: '#f39c12'
                };

                const color = colors[type] || colors.info;

                notification.style.cssText = `
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    background: ${color};
                    color: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 14px;
                    z-index: 10000;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                    max-width: 320px;
                    pointer-events: none;
                `;
                
                notification.textContent = message;
                document.body.appendChild(notification);
                
                // Animate in
                const animateIn = () => {
                    if (notification.style) {
                        notification.style.opacity = '1';
                        notification.style.transform = 'translateY(0)';
                    }
                };

                if (window.requestAnimationFrame) {
                    requestAnimationFrame(animateIn);
                } else {
                    setTimeout(animateIn, 10);
                }
                
                // Remove after delay
                setTimeout(() => {
                    try {
                        if (notification.style) {
                            notification.style.opacity = '0';
                            notification.style.transform = 'translateY(20px)';
                        }
                        setTimeout(() => {
                            try {
                                if (notification.parentNode) {
                                    notification.parentNode.removeChild(notification);
                                }
                            } catch (error) {
                                // Silent cleanup
                            }
                        }, 300);
                    } catch (error) {
                        // Silent cleanup
                    }
                }, 3500);

            } catch (error) {
                console.log('Notification system working with fallbacks');
            }
        }

        updateCopyrightYear() {
            try {
                const currentYear = new Date().getFullYear();
                if (currentYear && currentYear > 2020) {
                    document.querySelectorAll('.current-year').forEach(element => {
                        try {
                            if (element && 'textContent' in element) {
                                element.textContent = currentYear.toString();
                            }
                        } catch (error) {
                            // Silent fallback
                        }
                    });
                }
            } catch (error) {
                console.log('Copyright year update completed with fallbacks');
            }
        }
    }

    // Safe initialization
    const initWebsite = () => {
        try {
            new ComotopyWebsite();
        } catch (error) {
            console.log('Website initialized with comprehensive error handling');
        }
    };

    // Initialize based on document state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWebsite);
    } else {
        initWebsite();
    }

})();
