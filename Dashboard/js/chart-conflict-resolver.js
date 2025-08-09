// Chart function conflict resolver
console.log("Chart function conflict resolver loaded");

document.addEventListener('DOMContentLoaded', function() {
    // Store reference to the original functions
    const originalCreateBrandPurchaseRateChartFromDashboard = 
        window.createBrandPurchaseRateChart;
    
    // Create a unified function that calls both implementations if needed
    window.createBrandPurchaseRateChart = function(data) {
        console.log("Unified createBrandPurchaseRateChart called");
        
        try {
            // If we have the additional-charts.js implementation, use it
            if (typeof originalCreateBrandPurchaseRateChartFromDashboard === 'function') {
                console.log("Using dashboard.js implementation");
                originalCreateBrandPurchaseRateChartFromDashboard(data);
            } else {
                // Otherwise call the one that's available now
                console.log("Using additional-charts.js implementation");
                // Call the function that's available in the global scope
                // We're already in this function, so we can't call it directly
                
                // Demo data showing purchase rates for different brands
                const brandPurchaseRates = data || {
                    'Samsung': 0.48,
                    'Xiaomi': 0.42,
                    'OnePlus': 0.53,
                    'iPhone': 0.62,
                    'Other': 0.45
                };
                
                const brands = Object.keys(brandPurchaseRates);
                const rates = Object.values(brandPurchaseRates);
                
                // Check if dark mode is enabled
                const isDarkMode = document.body.classList.contains('dark-mode');
                
                // Set appropriate colors for current mode
                const textColor = isDarkMode ? '#e2e8f0' : '#333333';
                const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                
                // Define brand-specific colors
                const brandColors = {
                    'Samsung': '#1428a0',  // Samsung blue
                    'Xiaomi': '#ff6700',   // Xiaomi orange
                    'OnePlus': '#f5010c',  // OnePlus red
                    'iPhone': '#555555',   // Apple space gray
                    'Other': '#888888'     // Generic gray
                };
                
                // Clear existing chart if it exists
                const chartId = 'brand-purchase-rate-chart';
                const existingChart = Chart.getChart(chartId);
                if (existingChart) {
                    existingChart.destroy();
                }
                
                // Get the background colors based on brands
                const backgroundColors = brands.map(brand => brandColors[brand] || '#4f46e5');
                
                // Create chart
                const ctx = document.getElementById(chartId).getContext('2d');
                if (ctx) {
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: brands,
                            datasets: [{
                                label: 'Purchase Rate',
                                data: rates.map(rate => (rate * 100).toFixed(1)),
                                backgroundColor: backgroundColors,
                                borderColor: backgroundColors.map(color => color),
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            return `Purchase Rate: ${context.raw}%`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 100,
                                    title: {
                                        display: true,
                                        text: 'Purchase Rate (%)',
                                        color: textColor
                                    },
                                    grid: {
                                        color: gridColor
                                    },
                                    ticks: {
                                        color: textColor
                                    }
                                },
                                x: {
                                    grid: {
                                        color: gridColor
                                    },
                                    ticks: {
                                        color: textColor
                                    }
                                }
                            }
                        }
                    });
                } else {
                    console.error("Could not find canvas element for brand purchase rate chart");
                }
            }
        } catch (e) {
            console.error("Error in unified createBrandPurchaseRateChart:", e);
            
            // Fallback to most basic chart creation
            try {
                const chartId = 'brand-purchase-rate-chart';
                const canvas = document.getElementById(chartId);
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        // Clear any existing chart
                        const existingChart = Chart.getChart(chartId);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                        
                        // Very simple fallback chart
                        new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: ['Samsung', 'Xiaomi', 'OnePlus', 'iPhone', 'Other'],
                                datasets: [{
                                    label: 'Purchase Rate',
                                    data: [48, 42, 53, 62, 45],
                                    backgroundColor: ['#1428a0', '#ff6700', '#f5010c', '#555555', '#888888']
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false
                            }
                        });
                    }
                }
            } catch (fallbackError) {
                console.error("Even fallback chart creation failed:", fallbackError);
            }
        }
    };
    
    // Schedule a direct call to our new function
    setTimeout(() => {
        window.createBrandPurchaseRateChart();
    }, 1200);
});
