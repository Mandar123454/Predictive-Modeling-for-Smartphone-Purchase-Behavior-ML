// Console debugger for chart functions
console.log("Chart debug monitor loaded");

document.addEventListener('DOMContentLoaded', function() {
    // Monitor chart element presence
    function checkChartElements() {
        console.log("Checking chart elements...");
        
        // Function to log details about a chart element
        function logChartDetails(id) {
            const element = document.getElementById(id);
            if (element) {
                console.log(`${id}: Found`, {
                    display: window.getComputedStyle(element).display,
                    height: window.getComputedStyle(element).height,
                    width: window.getComputedStyle(element).width,
                    visibility: window.getComputedStyle(element).visibility
                });
                
                // Check if Chart.js instance exists
                const chartInstance = Chart.getChart(id);
                console.log(`${id} chart instance:`, chartInstance ? "Found" : "Not found");
            } else {
                console.log(`${id}: Not found in DOM`);
            }
        }
        
        // Log details for the problematic charts
        logChartDetails('age-purchase-rate-chart');
        logChartDetails('brand-purchase-rate-chart');
        
        // Check Chart.js registration
        console.log("All registered Chart.js instances:", Object.keys(Chart.instances).length);
        
        // Check for function definitions
        console.log("createAgePurchaseRateChart function exists:", typeof createAgePurchaseRateChart === 'function');
        console.log("createBrandPurchaseRateChart function exists:", typeof createBrandPurchaseRateChart === 'function');
        
        // Log any errors during chart creation (collect them for 2 seconds)
        const originalError = console.error;
        const errors = [];
        
        console.error = function() {
            errors.push(Array.from(arguments).join(' '));
            originalError.apply(console, arguments);
        };
        
        // Try executing the functions directly if they exist
        try {
            if (typeof createAgePurchaseRateChart === 'function') {
                createAgePurchaseRateChart();
            }
        } catch (e) {
            console.log("Error executing createAgePurchaseRateChart:", e);
        }
        
        try {
            if (typeof createBrandPurchaseRateChart === 'function') {
                createBrandPurchaseRateChart();
            }
        } catch (e) {
            console.log("Error executing createBrandPurchaseRateChart:", e);
        }
        
        // Restore original console.error after 2 seconds and report errors
        setTimeout(() => {
            console.error = originalError;
            console.log("Errors during chart creation:", errors.length ? errors : "None");
        }, 2000);
    }
    
    // Run the check after a delay to ensure all scripts are loaded
    setTimeout(checkChartElements, 1000);
});
