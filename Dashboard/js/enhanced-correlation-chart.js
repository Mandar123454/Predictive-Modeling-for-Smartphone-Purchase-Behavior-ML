/**
 * Enhanced Correlation Heatmap Chart for Insights Section
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing enhanced correlation heatmap chart");
    
    // Create chart after a slight delay to ensure DOM is ready
    setTimeout(() => {
        createEnhancedCorrelationHeatmap();
    }, 800);
});

function createEnhancedCorrelationHeatmap() {
    // Get chart element
    const chartElement = document.getElementById('correlation-heatmap-chart');
    if (!chartElement) {
        console.error("Correlation heatmap chart element not found");
        return;
    }
    
    // Check for existing chart and destroy if needed
    const existingChart = Chart.getChart('correlation-heatmap-chart');
    if (existingChart) {
        existingChart.destroy();
    }
    
    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Define chart data
    const correlationData = {
        labels: [
            'Time on Website',
            'Previous Purchases',
            'Search Frequency',
            'Marketing Engagement',
            'Device Age',
            'Brand Loyalty',
            'Payment Method'
        ],
        datasets: [{
            axis: 'y',
            label: 'Influence (%)',
            data: [30, 25, 20, 15, 10, 5, 2],
            backgroundColor: [
                'rgba(74, 222, 128, 0.8)',
                'rgba(251, 146, 190, 0.8)',
                'rgba(52, 211, 153, 0.8)',
                'rgba(250, 204, 21, 0.8)',
                'rgba(196, 181, 253, 0.8)',
                'rgba(251, 146, 60, 0.8)',
                'rgba(56, 189, 248, 0.8)'
            ],
            borderColor: 'rgba(30, 41, 59, 0.8)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.7
        }]
    };
    
    // Create the chart
    new Chart(chartElement, {
        type: 'bar',
        data: correlationData,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    right: 20,
                    left: 10,
                    top: 15,
                    bottom: 15
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Influence (%)',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    },
                    ticks: {
                        color: isDarkMode ? '#e2e8f0' : '#334155',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: isDarkMode ? '#e2e8f0' : '#334155',
                        font: {
                            weight: 'bold',
                            size: 13
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: isDarkMode ? '#e2e8f0' : '#1e293b',
                    bodyColor: isDarkMode ? '#e2e8f0' : '#334155',
                    bodyFont: {
                        size: 13
                    },
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    padding: 12,
                    cornerRadius: 6,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return `Influence: ${context.raw}%`;
                        },
                        afterLabel: function(context) {
                            const insights = {
                                'Time on Website': 'Users spending more time on the website show higher purchase intent',
                                'Previous Purchases': 'Past buying behavior strongly predicts future purchases',
                                'Search Frequency': 'More active product researchers are more likely to convert',
                                'Marketing Engagement': 'Users who engage with marketing have higher conversion rates',
                                'Device Age': 'Users with older devices show moderate purchase probability',
                                'Brand Loyalty': 'Previous brand customers show some loyalty effect',
                                'Payment Method': 'Payment method has minimal impact on purchase decisions'
                            };
                            return insights[context.label] || '';
                        }
                    }
                }
            }
        }
    });
    
    console.log("Enhanced correlation heatmap created successfully");
}
