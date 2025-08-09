// Function to update all charts with enhanced dark mode styling
function updateAllCharts() {
    // Define common chart styling for dark mode
    Chart.defaults.color = '#e0e0e0';
    Chart.defaults.borderColor = '#444';
    Chart.defaults.backgroundColor = '#2a2a2a';
    
    // Enhanced chart colors for better visibility in dark mode
    const darkModeColors = [
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
    
    // Set enhanced chart options
    const darkModeChartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#e0e0e0',
                    font: {
                        size: 13
                    },
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 30, 30, 0.9)',
                titleColor: '#60a5fa',
                bodyColor: '#e0e0e0',
                borderColor: '#555',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 6,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                displayColors: true,
                boxPadding: 6
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(68, 68, 68, 0.5)',
                    borderColor: '#555',
                    tickColor: '#555'
                },
                ticks: {
                    color: '#e0e0e0'
                }
            },
            y: {
                grid: {
                    color: 'rgba(68, 68, 68, 0.5)',
                    borderColor: '#555',
                    tickColor: '#555'
                },
                ticks: {
                    color: '#e0e0e0'
                }
            }
        }
    };
    
    // Apply enhanced styling to all existing charts
    Object.values(Chart.instances).forEach(chart => {
        // Apply dark mode colors to datasets
        if (chart.config.data.datasets) {
            chart.config.data.datasets.forEach((dataset, i) => {
                if (!dataset.originalBackgroundColor) {
                    dataset.originalBackgroundColor = dataset.backgroundColor;
                }
                if (!dataset.originalBorderColor) {
                    dataset.originalBorderColor = dataset.borderColor;
                }
                
                // Set enhanced colors
                if (Array.isArray(dataset.backgroundColor)) {
                    dataset.backgroundColor = darkModeColors;
                } else {
                    dataset.backgroundColor = darkModeColors[i % darkModeColors.length];
                }
                
                if (dataset.borderColor) {
                    dataset.borderColor = Array.isArray(dataset.borderColor) 
                        ? darkModeColors 
                        : darkModeColors[i % darkModeColors.length];
                }
                
                // Enhance line charts
                if (dataset.type === 'line' || chart.config.type === 'line') {
                    dataset.borderWidth = 3;
                    dataset.pointBorderWidth = 2;
                    dataset.pointRadius = 4;
                    dataset.pointHoverRadius = 6;
                    dataset.tension = 0.3; // Smooth curves
                }
                
                // Enhance bar charts
                if (dataset.type === 'bar' || chart.config.type === 'bar') {
                    dataset.borderWidth = 1;
                    dataset.borderRadius = 4;
                    dataset.hoverBorderWidth = 2;
                    
                    // Add gradient if possible
                    if (typeof dataset.backgroundColor !== 'object' || !Array.isArray(dataset.backgroundColor)) {
                        const color = dataset.backgroundColor;
                        if (chart.ctx) {
                            const gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height);
                            gradient.addColorStop(0, color);
                            gradient.addColorStop(1, 'rgba(30, 30, 30, 0.5)');
                            dataset.backgroundColor = gradient;
                        }
                    }
                }
            });
        }
        
        // Apply dark mode options
        chart.options = {
            ...chart.options,
            ...darkModeChartOptions
        };
        
        // Update the chart to reflect changes
        chart.update();
    });
    
    // Re-create charts that might not be in the Chart.instances registry
    if (typeof createCorrelationHeatmapChart === 'function') {
        createCorrelationHeatmapChart();
    }
    
    if (typeof createFeatureInfluenceChart === 'function') {
        createFeatureInfluenceChart();
    }
    
    if (typeof createDemographicsCharts === 'function') {
        createDemographicsCharts();
    }
    
    if (typeof createBrandComparisonChart === 'function') {
        createBrandComparisonChart();
    }
    
    console.log('All charts updated with enhanced dark mode styling');
}
