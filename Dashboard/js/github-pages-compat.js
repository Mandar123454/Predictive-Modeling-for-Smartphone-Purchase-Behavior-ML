/**
 * GitHub Pages compatibility script
 * 
 * This script ensures the dashboard works on GitHub Pages by:
 * 1. Detecting if we're on GitHub Pages or running locally
 * 2. Using static data files when no backend is available
 * 3. Providing graceful fallbacks for API calls
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('GitHub Pages compatibility script initialized');
    
    // Detect environment
    const isGitHubPages = window.location.hostname.endsWith('github.io');
    const isLocalWithoutBackend = window.location.protocol === 'file:' || 
                                 !window.location.hostname.includes('localhost');
    
    // If on GitHub Pages or running locally without backend
    if (isGitHubPages || isLocalWithoutBackend) {
        console.log('Running on GitHub Pages or without backend - using static data');
        
        // Set API base URL to use static JSON files
        window.apiBaseUrl = './data';
        
        // Override fetch for API calls to use static JSON files
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            // If this is an API call, redirect to local data file
            if (url.includes('/api/')) {
                let endpoint = url.split('/api/')[1].split('?')[0];
                let staticUrl = '';
                
                // Map API endpoints to static JSON files
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
                
                console.log(`Redirecting API call to static file: ${staticUrl}`);
                return originalFetch(staticUrl)
                    .then(response => {
                        if (!response.ok) {
                            console.warn(`Static file not found: ${staticUrl}`);
                            return originalFetch('./data/fallback.json');
                        }
                        return response;
                    })
                    .catch(error => {
                        console.error('Error loading static data:', error);
                        // Create a synthetic response as last resort
                        return new Response(
                            JSON.stringify({ error: "Failed to load data" }), 
                            { 
                                status: 200,
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );
                    });
            }
            
            // For non-API calls, use original fetch
            return originalFetch(url, options);
        };
        
        // Add error handling for demo data
        const demoButton = document.getElementById('use-demo-data');
        if (demoButton) {
            demoButton.addEventListener('click', function() {
                const errorContainer = document.getElementById('error-container');
                if (errorContainer) {
                    errorContainer.style.display = 'none';
                }
                
                const loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
            });
        }
    }
});
