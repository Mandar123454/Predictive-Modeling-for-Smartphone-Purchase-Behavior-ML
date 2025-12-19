/**
 * SmartPredict Footer Functionality
 * Handles modals, cookie consent, and footer interactions
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initFooter();
        initCookieConsent();
        initBackToTop();
        initFooterModals();
        initFooterNavLinks();
    });

    /**
     * Initialize footer navigation links that switch sections
     */
    function initFooterNavLinks() {
        document.querySelectorAll('.footer-nav-link[data-section]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                
                // Find the nav item and click it
                const navItem = document.querySelector(`.nav li[data-section="${sectionId}"]`);
                if (navItem) {
                    navItem.click();
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Initialize footer elements
     */
    function initFooter() {
        // Add animation on scroll into view
        const footer = document.querySelector('.dashboard-footer');
        if (footer) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Animate footer columns
                        const columns = entry.target.querySelectorAll('.footer-column');
                        columns.forEach((col, index) => {
                            setTimeout(() => {
                                col.style.opacity = '1';
                                col.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(footer);
        }
    }

    /**
     * Cookie Consent Management
     */
    function initCookieConsent() {
        const COOKIE_CONSENT_KEY = 'smartpredict_cookie_consent';
        const cookieBanner = document.getElementById('cookieBanner');
        
        if (!cookieBanner) return;

        // Check if consent already given
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        
        if (!consent) {
            // Show banner after a short delay
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1500);
        }

        // Accept button
        const acceptBtn = document.getElementById('acceptCookies');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
                    essential: true,
                    analytics: true,
                    preferences: true,
                    timestamp: new Date().toISOString()
                }));
                hideCookieBanner();
            });
        }

        // Decline button
        const declineBtn = document.getElementById('declineCookies');
        if (declineBtn) {
            declineBtn.addEventListener('click', function() {
                localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
                    essential: true,
                    analytics: false,
                    preferences: false,
                    timestamp: new Date().toISOString()
                }));
                hideCookieBanner();
            });
        }

        // Manage Cookies button (opens modal)
        const manageCookiesBtn = document.getElementById('manageCookiesBtn');
        if (manageCookiesBtn) {
            manageCookiesBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openCookieSettings();
            });
        }
        
        // Overview Manage Cookies button (in overview footer)
        const overviewManageCookiesBtn = document.getElementById('overviewManageCookiesBtn');
        if (overviewManageCookiesBtn) {
            overviewManageCookiesBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openCookieSettings();
            });
        }

        function hideCookieBanner() {
            cookieBanner.classList.remove('visible');
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Open Cookie Settings Modal
     */
    window.openCookieSettings = function() {
        const modalContent = `
            <div class="cookie-settings-content">
                <p>Customize your cookie preferences below. Essential cookies are required for the dashboard to function.</p>
                
                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <div>
                            <h4><i class="fas fa-check-circle" style="color: #22c55e;"></i> Essential Cookies</h4>
                            <p>Required for basic functionality</p>
                        </div>
                        <label class="toggle disabled">
                            <input type="checkbox" checked disabled>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <div>
                            <h4><i class="fas fa-chart-bar" style="color: #6366f1;"></i> Analytics Cookies</h4>
                            <p>Help us understand how you use the dashboard</p>
                        </div>
                        <label class="toggle">
                            <input type="checkbox" id="analyticsCookies" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <div>
                            <h4><i class="fas fa-sliders-h" style="color: #a855f7;"></i> Preference Cookies</h4>
                            <p>Remember your settings and preferences</p>
                        </div>
                        <label class="toggle">
                            <input type="checkbox" id="preferenceCookies" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="cookie-actions" style="margin-top: 25px; display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="cookie-btn decline" onclick="closeFooterModal()">Cancel</button>
                    <button class="cookie-btn accept" onclick="saveCookiePreferences()">Save Preferences</button>
                </div>
            </div>
        `;

        openFooterModal('Cookie Settings', 'fa-cookie-bite', modalContent);
    }

    /**
     * Save Cookie Preferences
     */
    window.saveCookiePreferences = function() {
        const analytics = document.getElementById('analyticsCookies')?.checked ?? true;
        const preferences = document.getElementById('preferenceCookies')?.checked ?? true;

        localStorage.setItem('smartpredict_cookie_consent', JSON.stringify({
            essential: true,
            analytics: analytics,
            preferences: preferences,
            timestamp: new Date().toISOString()
        }));

        closeFooterModal();
        
        // Hide cookie banner if visible
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('visible');
        }

        // Show confirmation
        showNotification('Cookie preferences saved!', 'success');
    };

    /**
     * Back to Top Button
     */
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Footer Modals System
     */
    function initFooterModals() {
        // Modal triggers
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalType = this.getAttribute('data-modal');
                loadModalContent(modalType);
            });
        });

        // Close on overlay click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('footer-modal-overlay')) {
                closeFooterModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeFooterModal();
            }
        });
    }

    /**
     * Load Modal Content
     */
    function loadModalContent(type) {
        const contents = {
            'license': {
                title: 'MIT License',
                icon: 'fa-balance-scale',
                content: `
                    <div class="license-content">
                        <div class="highlight-box" style="margin-bottom: 20px;">
                            <p><strong>SPDX-License-Identifier: MIT</strong></p>
                        </div>
                        <p><strong>Copyright (c) 2025 Mandar123454 - Smartphone Purchase Prediction Dashboard</strong></p>
                        <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
                        <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
                        <p style="color: rgba(255,255,255,0.6); margin-top: 20px;"><strong>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.</strong></p>
                    </div>
                `
            },
            'contributing': {
                title: 'Contributing Guidelines',
                icon: 'fa-code-branch',
                content: `
                    <h3>How to Contribute</h3>
                    <p>Thank you for your interest in improving SmartPredict!</p>
                    
                    <h3>Getting Started</h3>
                    <ul>
                        <li>Fork the repository</li>
                        <li>Create a feature branch: <code>feature/your-feature</code></li>
                        <li>Make your changes</li>
                        <li>Submit a Pull Request</li>
                    </ul>
                    
                    <h3>Code Standards</h3>
                    <ul>
                        <li>Follow existing code style</li>
                        <li>Add comments for complex logic</li>
                        <li>Test your changes thoroughly</li>
                        <li>Update documentation as needed</li>
                    </ul>
                    
                    <h3>Commit Messages</h3>
                    <p>Use conventional commit format: <code>type: description</code></p>
                    <p>Types: feat, fix, docs, refactor, test, chore</p>
                `
            },
            'code-of-conduct': {
                title: 'Code of Conduct',
                icon: 'fa-users',
                content: `
                    <h3>Our Pledge</h3>
                    <p>We pledge to make participation in our project a harassment-free experience for everyone, regardless of level of experience, gender, identity, orientation, disability, appearance, race, ethnicity, age, religion, or nationality.</p>
                    
                    <h3>Our Standards</h3>
                    <p><strong>Positive behaviors include:</strong></p>
                    <ul>
                        <li>Demonstrating empathy and kindness</li>
                        <li>Being respectful of differing viewpoints</li>
                        <li>Giving and accepting constructive feedback</li>
                        <li>Focusing on what is best for the community</li>
                    </ul>
                    
                    <p><strong>Unacceptable behaviors include:</strong></p>
                    <ul>
                        <li>Harassment or discriminatory comments</li>
                        <li>Personal attacks or trolling</li>
                        <li>Publishing others' private information</li>
                    </ul>
                    
                    <h3>Reporting</h3>
                    <p>Report issues to: <a href="mailto:mandar@example.com">mandar@example.com</a></p>
                `
            }
        };

        const data = contents[type];
        if (data) {
            openFooterModal(data.title, data.icon, data.content);
        }
    }

    /**
     * Open Footer Modal
     */
    window.openFooterModal = function(title, icon, content) {
        // Remove existing modal
        closeFooterModal();

        const modalHTML = `
            <div class="footer-modal-overlay active" id="footerModalOverlay">
                <div class="footer-modal">
                    <div class="footer-modal-header">
                        <h2><i class="fas ${icon}"></i> ${title}</h2>
                        <button class="footer-modal-close" onclick="closeFooterModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="footer-modal-content">
                        ${content}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';

        // Animate in
        requestAnimationFrame(() => {
            const overlay = document.getElementById('footerModalOverlay');
            if (overlay) {
                overlay.classList.add('active');
            }
        });
    };

    /**
     * Close Footer Modal
     */
    window.closeFooterModal = function() {
        const overlay = document.getElementById('footerModalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    };

    /**
     * Show Notification
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `footer-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${type === 'success' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #6366f1, #a855f7)'};
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10002;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    /**
     * Do Not Share My Info Handler
     */
    window.doNotShareInfo = function() {
        localStorage.setItem('smartpredict_do_not_share', 'true');
        localStorage.setItem('smartpredict_cookie_consent', JSON.stringify({
            essential: true,
            analytics: false,
            preferences: false,
            timestamp: new Date().toISOString()
        }));
        showNotification('Your preferences have been saved. We will not share your personal information.', 'success');
    };

})();
