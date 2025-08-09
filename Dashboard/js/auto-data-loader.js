/**
 * Auto Data Loader for GitHub Pages
 * 
 * This script automatically loads all static data and ensures the dashboard
 * displays properly on GitHub Pages without showing error messages.
 */

// Execute immediately when script is loaded
(function() {
    console.log('Auto Data Loader initialized');
    
    // Set up auto-loading when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Force data loading and error handling
        initializeAutoLoader();
    });
    
    // Immediately hide errors
    hideErrors();
    
    // Set API base URL to use static data
    window.apiBaseUrl = './data';
    console.log('API base URL set to:', window.apiBaseUrl);
    
    // Preload all static data files
    preloadAllData();
    
    // Initialize the auto loader
    function initializeAutoLoader() {
        console.log('Initializing auto loader');
        
        // Override fetch for API calls
        overrideFetch();
        
        // Set up event handlers for demo data button
        setupEventHandlers();
        
        // Hide errors and show dashboard
        hideErrors();
        showDashboard();
        
        // Click the demo data button automatically
        clickDemoButton();
        
        // Force redraw charts after a delay
        setTimeout(redrawCharts, 1000);
    }
    
    // Override fetch to use static data files
    function overrideFetch() {
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            // Map API calls to static files
            if (url.includes('/api/')) {
                let endpoint = url.split('/api/')[1].split('?')[0];
                let staticUrl;
                
                switch(endpoint) {
                    case 'status':
                        staticUrl = './data/status.json';
                        break;
                    case 'dashboard_data':
                        staticUrl = './data/dashboard_data.json';
                        break;
                    case 'feature_importance':
                        staticUrl = './data/feature_importance.json';
                        break;
                    case 'predict':
                        staticUrl = './data/prediction.json';
                        break;
                    case 'compare_brands':
                        staticUrl = './data/brand_comparison.json';
                        break;
                    default:
                        staticUrl = './data/fallback.json';
                }
                
                console.log(`Redirecting API call: ${url} → ${staticUrl}`);
                return originalFetch(staticUrl)
                    .then(response => {
                        if (!response.ok) {
                            console.warn(`Static file not found: ${staticUrl}, using fallback`);
                            return originalFetch('./data/fallback.json');
                        }
                        return response;
                    })
                    .catch(error => {
                        console.error('Error loading static data:', error);
                        // Create a synthetic success response
                        return new Response(
                            JSON.stringify({ 
                                status: "success", 
                                message: "Generated fallback data" 
                            }),
                            { 
                                status: 200, 
                                headers: { 'Content-Type': 'application/json' } 
                            }
                        );
                    });
            }
            
            // For direct data file requests, add fallback handling
            if (url.includes('./data/') || url.includes('/data/')) {
                return originalFetch(url, options)
                    .then(response => {
                        if (!response.ok) {
                            console.warn(`File not found: ${url}, using fallback`);
                            return originalFetch('./data/fallback.json');
                        }
                        return response;
                    })
                    .catch(error => {
                        console.error('Error loading data file:', error);
                        // Create a synthetic success response
                        return new Response(
                            JSON.stringify({ 
                                status: "success", 
                                message: "Generated fallback data" 
                            }),
                            { 
                                status: 200, 
                                headers: { 'Content-Type': 'application/json' } 
                            }
                        );
                    });
            }
            
            // For other requests, use original fetch
            return originalFetch(url, options);
        };
        console.log('Fetch function overridden to use static data');
    }
    
    // Hide all error containers
    function hideErrors() {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.style.display = 'none';
            console.log('Error container hidden');
        }
        
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
            console.log('Loading overlay hidden');
        }
    }
    
    // Show the dashboard
    function showDashboard() {
        const dashboard = document.querySelector('.dashboard');
        if (dashboard) {
            dashboard.style.display = 'flex';
            console.log('Dashboard shown');
        }
    }
    
    // Set up event handlers
    function setupEventHandlers() {
        // Handle demo data button
        const demoButton = document.getElementById('use-demo-data');
        if (demoButton) {
            demoButton.addEventListener('click', function() {
                hideErrors();
                showDashboard();
                console.log('Demo data button clicked');
            });
        }
        
        // Handle retry button
        const retryButton = document.getElementById('retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', function() {
                hideErrors();
                showDashboard();
                console.log('Retry button clicked');
            });
        }
    }
    
    // Automatically click demo data button
    function clickDemoButton() {
        setTimeout(function() {
            const demoButton = document.getElementById('use-demo-data');
            if (demoButton) {
                console.log('Auto-clicking demo data button');
                demoButton.click();
            }
        }, 500);
    }
    
    // Preload all data files
    function preloadAllData() {
        const dataFiles = [
            './data/status.json',
            './data/dashboard_data.json',
            './data/feature_importance.json',
            './data/prediction.json',
            './data/brand_comparison.json',
            './data/fallback.json'
        ];
        
        console.log('Preloading all data files');
        
        dataFiles.forEach(url => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(`Preloaded: ${url}`);
                })
                .catch(error => {
                    console.warn(`Failed to preload: ${url}`, error);
                });
        });
    }
    
    // Force redraw all charts
    function redrawCharts() {
        console.log('Forcing chart redraw');
        
        // Ensure all charts are visible
        document.querySelectorAll('canvas').forEach(function(canvas) {
            canvas.style.display = 'block';
            canvas.style.visibility = 'visible';
            canvas.style.opacity = '1';
        });
        
        // If there are any global chart objects defined, try to update them
        if (window.ageChart) window.ageChart.update();
        if (window.genderChart) window.genderChart.update();
        if (window.featureChart) window.featureChart.update();
        if (window.brandChart) window.brandChart.update();
        
        // Schedule another redraw for safety
        setTimeout(function() {
            document.querySelectorAll('canvas').forEach(function(canvas) {
                canvas.style.display = 'block';
                canvas.style.visibility = 'visible';
                canvas.style.opacity = '1';
            });
        }, 2000);
    }
})();
