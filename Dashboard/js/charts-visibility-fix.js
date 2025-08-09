// Chart Visibility Fix - Forces chart creation when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Running chart visibility fix...");
    
    // Wait a bit to ensure the DOM is fully loaded and other scripts have run
    setTimeout(function() {
        console.log("Checking and fixing charts...");
        
        // Check and fix Age Purchase Rate chart
        const agePurchaseChart = Chart.getChart('age-purchase-rate-chart');
        if (!agePurchaseChart) {
            console.log("Age Purchase Rate chart not found, creating...");
            if (typeof createAgePurchaseRateChart === 'function') {
                createAgePurchaseRateChart();
            }
        }
        
        // Check and fix Brand Purchase Rate chart
        const brandPurchaseChart = Chart.getChart('brand-purchase-rate-chart');
        if (!brandPurchaseChart) {
            console.log("Brand Purchase Rate chart not found, creating...");
            if (typeof createBrandPurchaseRateChart === 'function') {
                createBrandPurchaseRateChart();
            }
        }
        
        // Force display the canvas elements
        const chartCanvases = [
            document.getElementById('age-purchase-rate-chart'),
            document.getElementById('brand-purchase-rate-chart')
        ];
        
        chartCanvases.forEach(canvas => {
            if (canvas) {
                canvas.style.display = 'block';
                canvas.style.height = '300px';
                canvas.style.width = '100%';
            }
        });
        
    }, 500); // Wait 500ms to ensure other scripts have had time to run
    
    // Add chart theme change listener
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Delay to allow theme to change first
            setTimeout(function() {
                // Re-render charts with new theme
                if (typeof createAgePurchaseRateChart === 'function') createAgePurchaseRateChart();
                if (typeof createBrandPurchaseRateChart === 'function') createBrandPurchaseRateChart();
            }, 200);
        });
    }
});
