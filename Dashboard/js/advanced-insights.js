/**
 * Advanced Insights Implementation
 * Provides enhanced visualizations and interactive elements for the insights section
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Advanced insights implementation loaded");
    
    // Initialize advanced correlation analysis
    setTimeout(() => {
        initializeAdvancedCorrelation();
    }, 800);
});

// Create an enhanced correlation heatmap chart
function initializeAdvancedCorrelation() {
    console.log("Initializing advanced correlation chart");
    
    const chartElement = document.getElementById('correlation-heatmap-chart');
    if (!chartElement) {
        console.error("Correlation heatmap chart element not found");
        return;
    }
    
    // Get existing chart instance and destroy if it exists
    const existingChart = Chart.getChart('correlation-heatmap-chart');
    if (existingChart) {
        existingChart.destroy();
    }
    
    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Set colors based on theme
    const textColor = isDarkMode ? '#e2e8f0' : '#334155';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
    
    // Define correlation data
    // This represents a correlation matrix between features and purchase outcome
    const correlationData = {
        labels: [
            'Time On Website',
            'Income',
            'Previous Purchases',
            'Marketing Engaged',
            'Search Frequency',
            'Device Age',
            'Age'
        ],
        datasets: [{
            label: 'Correlation with Purchase',
            data: [0.78, 0.65, 0.62, 0.58, 0.43, 0.37, 0.25],
            backgroundColor: function(context) {
                const value = context.dataset.data[context.dataIndex];
                // Color gradient based on correlation strength
                if (value >= 0.7) return isDarkMode ? '#4ade80' : '#22c55e'; // Strong
                if (value >= 0.5) return isDarkMode ? '#60a5fa' : '#3b82f6'; // Moderate to Strong
                if (value >= 0.3) return isDarkMode ? '#93c5fd' : '#60a5fa'; // Moderate
                return isDarkMode ? '#c4b5fd' : '#a78bfa'; // Weak
            },
            borderColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.7
        }]
    };
    
    // Create advanced chart with interactive elements
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
                    top: 15
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Correlation Strength',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 5
                        }
                    },
                    grid: {
                        color: gridColor,
                        lineWidth: 0.5,
                        display: true
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value.toFixed(1);
                        },
                        maxTicksLimit: 6
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor,
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
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const value = context.raw;
                            let strength = 'Weak';
                            if (value >= 0.7) strength = 'Strong';
                            else if (value >= 0.5) strength = 'Moderate to Strong';
                            else if (value >= 0.3) strength = 'Moderate';
                            
                            return `Correlation: ${(value * 100).toFixed(0)}% (${strength})`;
                        },
                        afterLabel: function(context) {
                            const label = context.label;
                            
                            // Additional insights for each feature
                            const insights = {
                                'Time On Website': 'Users spending more time browsing show the strongest correlation with purchase behavior',
                                'Income': 'Higher income levels significantly increase purchase likelihood across all demographics',
                                'Previous Purchases': 'Repeat customers are much more likely to make additional purchases',
                                'Marketing Engaged': 'Users who interact with marketing materials convert at higher rates',
                                'Search Frequency': 'More active researchers show increased purchase intent',
                                'Device Age': 'Users with older devices are somewhat more likely to purchase',
                                'Age': 'Age has a weaker correlation compared to behavioral factors'
                            };
                            
                            return insights[label] || '';
                        }
                    }
                }
            }
        }
    });
    
    // Add enhanced interactive elements
    addCorrelationInteractions();
    console.log("Advanced correlation chart created");
}

// Add interactive elements to the correlation chart
function addCorrelationInteractions() {
    console.log("Adding correlation interactions");
    
    // Add legend with interactive elements
    const container = document.querySelector('.correlation-container');
    if (!container) return;
    
    // Create legend element if it doesn't exist
    let legend = container.querySelector('.correlation-legend');
    if (!legend) {
        legend = document.createElement('div');
        legend.className = 'correlation-legend';
        
        // Create legend items
        const legendItems = [
            { color: '#4ade80', label: 'Strong Correlation (>70%)' },
            { color: '#60a5fa', label: 'Moderate-Strong (50-70%)' },
            { color: '#93c5fd', label: 'Moderate (30-50%)' },
            { color: '#c4b5fd', label: 'Weak (<30%)' }
        ];
        
        // Add legend items
        legendItems.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.className = 'correlation-legend-item';
            
            const colorBox = document.createElement('div');
            colorBox.className = 'correlation-legend-color';
            colorBox.style.backgroundColor = item.color;
            
            const label = document.createElement('span');
            label.className = 'correlation-legend-label';
            label.textContent = item.label;
            
            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            legend.appendChild(legendItem);
        });
        
        // Add interaction tip
        const interactionTip = document.createElement('div');
        interactionTip.className = 'chart-interaction-tip';
        interactionTip.innerHTML = '<i class="fas fa-info-circle"></i> Hover over bars for detailed correlation insights';
        
        // Add elements to container
        container.appendChild(legend);
        container.appendChild(interactionTip);
    }
}

// Ensure the advanced correlation chart is visible
function checkCorrelationVisibility() {
    const container = document.getElementById('correlation-heatmap-chart-container');
    if (container) {
        container.style.visibility = 'visible';
        container.style.display = 'block';
        container.style.height = '380px';
        container.style.opacity = '1';
    }
}

// Call this on page load and section changes
setInterval(checkCorrelationVisibility, 1000);
