/**
 * Static Data Provider for Netlify Deployment
 * This script provides static JSON data when the app is deployed on Netlify
 */

document.addEventListener('DOMContentLoaded', function() {
    // Always activate static data when on Netlify OR when running locally without a backend
    const isNetlify = window.location.hostname.includes('netlify.app');
    const isLocalWithoutBackend = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const useStaticData = isNetlify || isLocalWithoutBackend;
    
    if (useStaticData) {
        console.log('Using static data for API calls');
        
        // Override the API base URL to use static JSON
        window.apiBaseUrl = isNetlify ? './data' : './data';
        
        // Prevent the error modal from showing
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
        
        // Override the fetch function for API calls
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            // If this is an API call
            if (url.includes('/api/') || url.startsWith('/api/')) {
                let endpoint = '';
                
                if (url.includes('/api/')) {
                    endpoint = url.split('/api/')[1].split('?')[0];
                } else if (url.startsWith('/api/')) {
                    endpoint = url.substring(5).split('?')[0];
                }
                
                console.log(`Redirecting API call to static JSON for: ${endpoint}`);
                
                // Map API endpoints to static JSON files
                const staticDataMap = {
                    'status': './data/status.json',
                    'dashboard_data': './data/dashboard_data.json',
                    'feature_importance': './data/feature_importance.json',
                    'predict': './data/prediction.json',
                    'compare_brands': './data/brand_comparison.json'
                };
                
                // Use the mapped static file or fallback to a generic response
                const staticUrl = staticDataMap[endpoint] || './data/fallback.json';
                
                return originalFetch(staticUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            // For non-API calls, use original fetch
            return originalFetch(url, options);
        };
    }
});
