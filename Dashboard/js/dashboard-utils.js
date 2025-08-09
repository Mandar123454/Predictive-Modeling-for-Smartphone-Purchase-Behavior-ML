/**
 * Dashboard Utilities
 * Provides common functions for the smartphone purchase dashboard
 */

class DashboardUtils {
    /**
     * Format numbers with commas as thousand separators
     */
    static formatNumber(number, decimals = 0) {
        if (isNaN(number)) return '0';
        return parseFloat(number).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
    
    /**
     * Format percentage values
     */
    static formatPercent(number, decimals = 1) {
        if (isNaN(number)) return '0%';
        return (number * 100).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }) + '%';
    }
    
    /**
     * Format currency values
     */
    static formatCurrency(number, decimals = 0) {
        if (isNaN(number)) return '$0';
        return '$' + parseFloat(number).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
    
    /**
     * Show loading spinner
     */
    static showLoading(message = 'Loading...') {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            const messageElement = loadingOverlay.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
            loadingOverlay.style.display = 'flex';
        }
    }
    
    /**
     * Hide loading spinner
     */
    static hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
    
    /**
     * Show error message
     */
    static showError(message, details = '') {
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        const errorDetails = document.getElementById('error-details');
        
        if (errorContainer && errorMessage) {
            errorMessage.textContent = message;
            if (errorDetails && details) {
                errorDetails.textContent = details;
                errorDetails.style.display = 'block';
            } else if (errorDetails) {
                errorDetails.style.display = 'none';
            }
            errorContainer.style.display = 'flex';
        } else {
            console.error('Error:', message, details);
            alert('Error: ' + message);
        }
    }
    
    /**
     * Hide error message
     */
    static hideError() {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }
    
    /**
     * Make API request with error handling and retry logic
     */
    static async fetchAPI(url, options = {}, retries = 2) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            if (retries > 0) {
                console.warn(`API request failed, retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await DashboardUtils.fetchAPI(url, options, retries - 1);
            } else {
                throw error;
            }
        }
    }
    
    /**
     * Get random color for charts
     */
    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    /**
     * Generate a color palette for charts
     */
    static generateColorPalette(count) {
        const baseColors = [
            '#3b82f6', // Blue
            '#ef4444', // Red
            '#10b981', // Green
            '#f59e0b', // Amber
            '#8b5cf6', // Violet
            '#ec4899', // Pink
            '#06b6d4', // Cyan
            '#6366f1', // Indigo
            '#84cc16', // Lime
            '#14b8a6', // Teal
        ];
        
        if (count <= baseColors.length) {
            return baseColors.slice(0, count);
        }
        
        const colors = [...baseColors];
        for (let i = baseColors.length; i < count; i++) {
            colors.push(DashboardUtils.getRandomColor());
        }
        
        return colors;
    }
    
    /**
     * Show demo mode indicator
     */
    static enableDemoMode() {
        // Check if API is actually unavailable before enabling demo mode
        if (typeof checkApiAvailability === 'function') {
            checkApiAvailability().then(isAvailable => {
                if (isAvailable) {
                    console.log("API is available, no need for demo mode");
                    window.isDemoMode = false;
                    return; // Don't show demo indicator if API is available
                } else {
                    // API is not available, proceed with demo mode
                    DashboardUtils._showDemoIndicator();
                }
            }).catch(() => {
                // Error checking API, assume it's not available
                DashboardUtils._showDemoIndicator();
            });
        } else {
            // checkApiAvailability function not available, show demo indicator
            DashboardUtils._showDemoIndicator();
        }
    }
    
    /**
     * Internal method to show the demo mode indicator
     * @private
     */
    static _showDemoIndicator() {
        if (!document.getElementById('demo-mode-indicator')) {
            const demoIndicator = document.createElement('div');
            demoIndicator.id = 'demo-mode-indicator';
            demoIndicator.className = 'demo-indicator';
            demoIndicator.innerHTML = '<i class="fas fa-info-circle"></i> Demo Mode - Using sample data';
            document.body.prepend(demoIndicator);
        }
        
        window.isDemoMode = true;
    }
    
    /**
     * Hide demo mode indicator
     */
    static disableDemoMode() {
        const demoIndicator = document.getElementById('demo-mode-indicator');
        if (demoIndicator) {
            demoIndicator.remove();
        }
        
        window.isDemoMode = false;
    }
    
    /**
     * Check if a value is empty or undefined
     */
    static isEmpty(value) {
        return value === undefined || 
               value === null || 
               (typeof value === 'string' && value.trim() === '') ||
               (Array.isArray(value) && value.length === 0) ||
               (typeof value === 'object' && Object.keys(value).length === 0);
    }
    
    /**
     * Get safe value with fallback
     */
    static safeValue(value, fallback) {
        return DashboardUtils.isEmpty(value) ? fallback : value;
    }
}
