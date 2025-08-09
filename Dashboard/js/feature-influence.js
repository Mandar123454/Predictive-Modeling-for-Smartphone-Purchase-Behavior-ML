// Feature Influence Analysis Chart for Demographics section
// This chart shows how different demographic features influence purchase decisions
function createFeatureInfluenceChart() {
    console.log('Creating enhanced feature influence chart');
    
    // Check if the element exists
    const chartElement = document.getElementById('feature-influence-chart');
    if (!chartElement) {
        console.error('Feature influence chart element not found!');
        return;
    }
    
    // Enhanced feature influence data with clearer values
    const featureInfluenceData = {
        // Features related to demographics
        features: [
            'Income Level', 
            'Age Group', 
            'Education Level', 
            'Family Size', 
            'Geographic Location',
            'Prior Technology Usage'
        ],
        // Positive influence scores (0-1 scale) - slightly adjusted for better visualization
        positiveInfluence: [0.82, 0.68, 0.48, 0.40, 0.55, 0.65],
        // Negative influence scores (0-1 scale) - slightly adjusted for better visualization
        negativeInfluence: [-0.28, -0.20, -0.35, -0.42, -0.18, -0.25]
    };
    
    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Clear existing chart if it exists
    const chartId = 'feature-influence-chart';
    const existingChart = Chart.getChart(chartId);
    if (existingChart) {
        existingChart.destroy();
    }
    
    // Set appropriate colors for current mode
    const textColor = isDarkMode ? '#e2e8f0' : '#333333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    const ctx = chartElement.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: featureInfluenceData.features,
            datasets: [
                {
                    label: 'Positive Influence',
                    data: featureInfluenceData.positiveInfluence,
                    backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.85)' : 'rgba(79, 70, 229, 0.75)',
                    borderColor: isDarkMode ? 'rgba(79, 70, 229, 1)' : 'rgba(79, 70, 229, 0.9)',
                    borderWidth: 2,
                    borderRadius: 6
                },
                {
                    label: 'Negative Influence',
                    data: featureInfluenceData.negativeInfluence,
                    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.85)' : 'rgba(239, 68, 68, 0.75)',
                    borderColor: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 0.9)',
                    borderWidth: 2,
                    borderRadius: 6
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: -1,
                    max: 1,
                    grid: {
                        color: gridColor,
                        lineWidth: isDarkMode ? 0.8 : 0.5,
                        borderDash: isDarkMode ? [5, 5] : []
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            weight: 'bold',
                            size: 13 // Slightly larger for better visibility
                        },
                        callback: function(value) {
                            return Math.abs(value).toFixed(1);
                        },
                        padding: 10
                    },
                    title: {
                        display: true,
                        text: 'Influence Factor (0-1)',
                        color: isDarkMode ? '#818cf8' : '#4f46e5',
                        font: {
                            weight: 'bold',
                            size: 16 // Larger title
                        },
                        padding: {
                            top: 10,
                            bottom: 10
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: isDarkMode ? '#e5e7eb' : '#1f2937',
                        font: {
                            weight: 'bold',
                            size: 14 // Increased font size
                        },
                        padding: 15 // More padding
                    },
                    border: {
                        width: 0
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDarkMode ? '#e5e7eb' : '#1f2937',
                        font: {
                            weight: 'bold',
                            size: 14 // Increased size
                        },
                        usePointStyle: true,
                        pointStyle: 'rectRounded',
                        padding: 30, // More padding
                        boxWidth: 18, // Larger legend boxes
                        boxHeight: 18
                    }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: isDarkMode ? '#e5e7eb' : '#1f2937',
                    bodyColor: isDarkMode ? '#e5e7eb' : '#1f2937',
                    bodyFont: {
                        size: 14
                    },
                    titleFont: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 15,
                    cornerRadius: 6,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const value = context.raw;
                            const type = value >= 0 ? 'Positive' : 'Negative';
                            return `${type} Influence: ${Math.abs(value).toFixed(2)}`;
                        },
                        afterLabel: function(context) {
                            const insights = {
                                'Income Level': 'Higher income strongly correlates with smartphone purchases',
                                'Age Group': 'Middle-aged customers show highest purchase rates',
                                'Education Level': 'Higher education correlates with premium brand selection',
                                'Family Size': 'Larger families are more price-sensitive',
                                'Geographic Location': 'Urban locations show stronger purchase intent',
                                'Prior Technology Usage': 'Previous tech adopters are more likely to upgrade'
                            };
                            return insights[context.label] || '';
                        }
                    }
                }
            }
        }
    });
}

// Initialize the chart when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('Initializing feature influence chart');
        createFeatureInfluenceChart();
    }, 100);
});
