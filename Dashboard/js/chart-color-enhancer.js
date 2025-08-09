// Function to enhance chart colors for dark mode
function enhanceChartColors() {
    // Define vibrant color schemes for dark mode charts
    const vibrantColors = [
        '#60a5fa', // Blue
        '#f472b6', // Pink
        '#34d399', // Green
        '#fbbf24', // Yellow
        '#a78bfa', // Purple
        '#fb923c', // Orange
        '#22d3ee', // Cyan
        '#f87171', // Red
        '#4ade80', // Light green
        '#e879f9'  // Magenta
    ];

    // Apply to Chart.js defaults
    Chart.defaults.color = '#e0e0e0';
    Chart.defaults.borderColor = '#444';
    
    // Enhanced tooltip styling
    Chart.defaults.plugins.tooltip = {
        ...Chart.defaults.plugins.tooltip,
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        titleColor: '#60a5fa',
        bodyColor: '#e0e0e0',
        borderColor: '#555',
        borderWidth: 1,
        padding: {
            top: 12,
            right: 12,
            bottom: 12,
            left: 12
        },
        cornerRadius: 6,
        displayColors: true,
        boxPadding: 6,
        titleFont: {
            size: 14,
            weight: 'bold'
        },
        bodyFont: {
            size: 13
        },
    };
    
    // Enhanced legend styling
    Chart.defaults.plugins.legend = {
        ...Chart.defaults.plugins.legend,
        labels: {
            color: '#e0e0e0',
            font: {
                size: 13
            },
            padding: 20,
            usePointStyle: true,
            boxWidth: 10,
            boxHeight: 10
        }
    };

    // Find all chart instances and enhance them
    Object.values(Chart.instances).forEach((chart) => {
        if (chart.config && chart.config.data && chart.config.data.datasets) {
            chart.config.data.datasets.forEach((dataset, i) => {
                // Apply vibrant colors to datasets
                const color = vibrantColors[i % vibrantColors.length];
                
                // Store original colors if not already stored
                if (!dataset._originalBackgroundColor) {
                    dataset._originalBackgroundColor = dataset.backgroundColor;
                }
                if (!dataset._originalBorderColor) {
                    dataset._originalBorderColor = dataset.borderColor;
                }
                
                // Apply colors based on chart type
                switch(chart.config.type) {
                    case 'bar':
                    case 'horizontalBar':
                        if (!Array.isArray(dataset.backgroundColor)) {
                            dataset.backgroundColor = color;
                        } else {
                            dataset.backgroundColor = dataset.backgroundColor.map((_, i) => 
                                vibrantColors[i % vibrantColors.length]);
                        }
                        dataset.borderWidth = 1;
                        dataset.borderRadius = 4;
                        dataset.hoverBorderWidth = 2;
                        break;
                        
                    case 'line':
                        dataset.borderColor = color;
                        dataset.pointBackgroundColor = color;
                        dataset.pointBorderColor = '#1e1e1e';
                        dataset.pointBorderWidth = 2;
                        dataset.pointRadius = 4;
                        dataset.pointHoverRadius = 6;
                        dataset.tension = 0.3; // Smooth curves
                        
                        // Line styling
                        dataset.borderWidth = 3;
                        
                        // Area under line styling
                        if (dataset.fill) {
                            const ctx = chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                            gradient.addColorStop(0, `${color}50`); // 50 = 31% opacity in hex
                            gradient.addColorStop(1, `${color}05`); // 05 = 2% opacity in hex
                            dataset.backgroundColor = gradient;
                        }
                        break;
                        
                    case 'pie':
                    case 'doughnut':
                    case 'polarArea':
                        dataset.backgroundColor = vibrantColors;
                        dataset.borderColor = '#1e1e1e';
                        dataset.borderWidth = 2;
                        dataset.hoverBorderColor = '#1e1e1e';
                        dataset.hoverBorderWidth = 3;
                        break;
                        
                    case 'radar':
                        dataset.borderColor = color;
                        dataset.pointBackgroundColor = color;
                        dataset.backgroundColor = `${color}30`; // 30 = 19% opacity in hex
                        break;
                        
                    case 'scatter':
                        dataset.backgroundColor = color;
                        dataset.pointRadius = 6;
                        dataset.pointHoverRadius = 8;
                        break;
                        
                    default:
                        if (dataset.backgroundColor && !Array.isArray(dataset.backgroundColor)) {
                            dataset.backgroundColor = color;
                        }
                        if (dataset.borderColor && !Array.isArray(dataset.borderColor)) {
                            dataset.borderColor = color;
                        }
                }
            });
            
            // Enhanced grid lines
            if (chart.options && chart.options.scales) {
                // X axis styling
                if (chart.options.scales.x) {
                    chart.options.scales.x.grid = {
                        ...chart.options.scales.x.grid,
                        color: 'rgba(75, 85, 99, 0.2)',
                        borderColor: '#444',
                        tickColor: '#444',
                        drawBorder: true,
                        drawTicks: true
                    };
                    
                    chart.options.scales.x.ticks = {
                        ...chart.options.scales.x.ticks,
                        color: '#e0e0e0',
                        padding: 8
                    };
                }
                
                // Y axis styling
                if (chart.options.scales.y) {
                    chart.options.scales.y.grid = {
                        ...chart.options.scales.y.grid,
                        color: 'rgba(75, 85, 99, 0.2)',
                        borderColor: '#444',
                        tickColor: '#444',
                        drawBorder: true,
                        drawTicks: true,
                        zeroLineColor: '#555'
                    };
                    
                    chart.options.scales.y.ticks = {
                        ...chart.options.scales.y.ticks,
                        color: '#e0e0e0',
                        padding: 8
                    };
                }
            }
            
            // Update the chart with enhanced styling
            chart.update();
        }
    });
}

// Run when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for charts to initialize
    setTimeout(enhanceChartColors, 1000);
    
    // Also update colors when switching sections
    document.querySelectorAll('.sidebar ul li').forEach(item => {
        item.addEventListener('click', function() {
            setTimeout(enhanceChartColors, 500);
        });
    });
});
