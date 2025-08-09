// Direct chart implementations
console.log("Direct chart implementations loaded");

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        console.log("Creating direct chart implementations...");
        
        // Direct implementation of Feature Influence Analysis chart
        createDirectFeatureInfluenceChart();
        
        // Direct implementation of Marketing Impact chart
        createDirectMarketingImpactChart();
        
        // Direct implementation of Demographics Purchase Probability chart
        createDirectDemographicsProbabilityChart();
        
    }, 1000);
});

// Direct implementation of Feature Influence Analysis chart
function createDirectFeatureInfluenceChart() {
    const canvas = document.getElementById('correlation-heatmap-chart');
    if (!canvas) {
        console.error('Cannot find correlation-heatmap-chart canvas');
        return;
    }
    
    // Clear any existing chart
    const existingChart = Chart.getChart('correlation-heatmap-chart');
    if (existingChart) {
        existingChart.destroy();
    }
    
    console.log('Creating direct feature influence chart');
    
    // Feature influence analysis data
    const features = ['Time on Website', 'Previous Purchases', 'Search Frequency', 'Marketing Engagement', 'Device Age', 'Brand Loyalty', 'Payment Method'];
    const values = [28, 24, 19, 15, 8, 4, 2];
    
    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e2e8f0' : '#333333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: features,
            datasets: [{
                label: 'Influence Factor (%)',
                data: values,
                backgroundColor: [
                    'rgba(99, 102, 241, 0.9)',  // Different color palette for feature influence analysis
                    'rgba(99, 102, 241, 0.85)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(99, 102, 241, 0.75)',
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(99, 102, 241, 0.65)',
                    'rgba(99, 102, 241, 0.6)'
                ],
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    },
                    title: {
                        display: true,
                        text: 'Influence (%)',
                        color: textColor
                    }
                },
                y: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Feature Importance: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Direct implementation of Marketing Impact chart
function createDirectMarketingImpactChart() {
    const canvas = document.getElementById('marketing-impact-chart');
    if (!canvas) {
        console.error('Cannot find marketing-impact-chart canvas');
        return;
    }
    
    // Clear any existing chart
    const existingChart = Chart.getChart('marketing-impact-chart');
    if (existingChart) {
        existingChart.destroy();
    }
    
    console.log('Creating direct marketing impact chart');
    
    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e2e8f0' : '#333333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Marketing impact data
    const labels = ['Marketing Engaged', 'Not Engaged'];
    const data = [65, 35];
    const backgroundColor = [isDarkMode ? '#4f46e5' : '#4338ca', '#94a3b8'];
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Purchase Rate (%)',
                data: data,
                backgroundColor: backgroundColor,
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    },
                    title: {
                        display: true,
                        text: 'Purchase Rate (%)',
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
            },
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
            }
        }
    });
}

// Direct implementation of Demographics Purchase Probability chart
function createDirectDemographicsProbabilityChart() {
    const canvas = document.getElementById('demographics-probability-chart');
    if (!canvas) {
        console.error('Cannot find demographics-probability-chart canvas');
        return;
    }
    
    // Clear any existing chart
    const existingChart = Chart.getChart('demographics-probability-chart');
    if (existingChart) {
        existingChart.destroy();
    }
    
    console.log('Creating direct demographics probability chart');
    
    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e2e8f0' : '#333333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Demographics probability data - using stacked bar chart
    const labels = ['18-25', '26-35', '36-45', '46-55', '56+'];
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Low Income (<50k)',
                    data: [30, 40, 43, 35, 28],
                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.7)'
                },
                {
                    label: 'Medium Income (50-100k)',
                    data: [45, 55, 58, 50, 45],
                    backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.7)' : 'rgba(79, 70, 229, 0.7)'
                },
                {
                    label: 'High Income (>100k)',
                    data: [60, 75, 70, 65, 55],
                    backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.7)' : 'rgba(139, 92, 246, 0.7)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    },
                    title: {
                        display: true,
                        text: 'Purchase Probability (%)',
                        color: textColor
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    },
                    title: {
                        display: true,
                        text: 'Age Groups',
                        color: textColor
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                }
            }
        }
    });
}
