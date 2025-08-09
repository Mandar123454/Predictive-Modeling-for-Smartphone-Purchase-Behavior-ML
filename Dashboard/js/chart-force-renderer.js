// Force chart rendering script
console.log("Chart Force Renderer loaded");

// Function to manually rebuild problematic charts
function forceRebuildCharts() {
    console.log("Force rebuilding charts...");
    
    // Get chart canvases
    const ageChart = document.getElementById('age-purchase-rate-chart');
    const brandChart = document.getElementById('brand-purchase-rate-chart');
    
    // Helper function to rebuild a canvas element
    function rebuildCanvas(canvas, id, parentElement) {
        if (canvas && parentElement) {
            // Remove old canvas
            canvas.remove();
            
            // Create new canvas
            const newCanvas = document.createElement('canvas');
            newCanvas.id = id;
            newCanvas.style.display = 'block';
            newCanvas.style.height = '300px';
            newCanvas.style.width = '100%';
            
            // Add to parent
            parentElement.appendChild(newCanvas);
            
            return newCanvas;
        }
        return null;
    }
    
    // Rebuild canvases if they exist
    if (ageChart) {
        const parentElement = ageChart.parentElement;
        rebuildCanvas(ageChart, 'age-purchase-rate-chart', parentElement);
        
        // Create chart with demo data
        setTimeout(() => {
            if (typeof createAgePurchaseRateChart === 'function') {
                console.log("Recreating age purchase rate chart");
                createAgePurchaseRateChart();
            }
        }, 100);
    }
    
    if (brandChart) {
        const parentElement = brandChart.parentElement;
        rebuildCanvas(brandChart, 'brand-purchase-rate-chart', parentElement);
        
        // Create chart with demo data
        setTimeout(() => {
            if (typeof createBrandPurchaseRateChart === 'function') {
                console.log("Recreating brand purchase rate chart");
                createBrandPurchaseRateChart();
            }
        }, 100);
    }
}

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Chart Force Renderer - DOM ready");
    
    // Execute first delayed run
    setTimeout(forceRebuildCharts, 800);
    
    // Execute again after 1.5 seconds in case first attempt fails
    setTimeout(forceRebuildCharts, 1500);
    
    // Add listener for theme changes
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            // Delay to allow theme switch to complete
            setTimeout(forceRebuildCharts, 300);
        });
    }
    
    // Add button to manually trigger chart rebuild
    const dashboardSection = document.querySelector('.demographic-insights');
    if (dashboardSection) {
        const rebuildButton = document.createElement('button');
        rebuildButton.className = 'btn btn-secondary btn-sm mt-3';
        rebuildButton.style.marginRight = '10px';
        rebuildButton.textContent = 'Refresh Charts';
        rebuildButton.onclick = function(e) {
            e.preventDefault();
            forceRebuildCharts();
        };
        
        // Add to DOM
        const firstSection = dashboardSection.querySelector('.chart-container');
        if (firstSection) {
            firstSection.parentElement.insertBefore(rebuildButton, firstSection);
        }
    }
});
