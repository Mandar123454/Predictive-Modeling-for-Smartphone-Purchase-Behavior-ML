/**
 * Advanced Purchase Pattern Analysis for Insights Section
 * This provides a more advanced analysis specific for the insights section
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing advanced purchase pattern analysis");
    
    // Create chart after a slight delay to ensure DOM is ready
    setTimeout(() => {
        createAdvancedPurchasePatternAnalysis();
    }, 800);
});

function createAdvancedPurchasePatternAnalysis() {
    // Get chart element
    const chartElement = document.getElementById('purchase-pattern-analysis');
    if (!chartElement) {
        console.error("Purchase pattern analysis chart element not found");
        return;
    }
    
    // Check for existing chart and destroy if needed
    const existingChart = Chart.getChart('purchase-pattern-analysis');
    if (existingChart) {
        existingChart.destroy();
    }
    
    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Define chart data
    const analysisData = {
        labels: ['Browsing Duration', 'Feature Comparison', 'Price Research', 'Review Reading', 'Spec Comparison', 'Video Watching', 'Store Visits'],
        datasets: [
            {
                label: 'High Conversion Segment',
                data: [85, 72, 68, 90, 78, 65, 45],
                borderColor: 'rgba(56, 189, 248, 0.8)',
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: 'rgba(56, 189, 248, 1)',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7
            },
            {
                label: 'Low Conversion Segment',
                data: [45, 38, 52, 30, 42, 25, 20],
                borderColor: 'rgba(251, 113, 133, 0.8)',
                backgroundColor: 'rgba(251, 113, 133, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: 'rgba(251, 113, 133, 1)',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7
            }
        ]
    };
    
    // Create radar chart
    new Chart(chartElement, {
        type: 'radar',
        data: analysisData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Purchase Behavior Pattern Analysis',
                    color: isDarkMode ? '#e2e8f0' : '#334155',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDarkMode ? '#e2e8f0' : '#334155',
                        font: {
                            size: 13
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20
                    }
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
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: isDarkMode ? 'rgba(226, 232, 240, 0.7)' : 'rgba(51, 65, 85, 0.7)',
                        backdropColor: 'transparent'
                    },
                    pointLabels: {
                        color: isDarkMode ? '#e2e8f0' : '#334155',
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    angleLines: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'
                    }
                }
            }
        }
    });
    
    // Add explanation text below the chart
    const container = document.querySelector('.purchase-pattern-container');
    if (container) {
        // Check if explanation already exists
        if (!container.querySelector('.purchase-pattern-explanation')) {
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'purchase-pattern-explanation';
            explanationDiv.innerHTML = `
                <h4>Key Insights:</h4>
                <ul>
                    <li><strong>Review Reading</strong> shows the largest gap (60%) between high and low conversion segments</li>
                    <li><strong>Browsing Duration</strong> has 40% higher engagement in the high conversion group</li>
                    <li><strong>Feature Comparison</strong> activities are 34% more common in customers who purchase</li>
                    <li><strong>Store Visits</strong> show the smallest difference (25%), suggesting physical retail remains important across segments</li>
                </ul>
                <p>This analysis reveals that engaging deeply with product information is the strongest predictor of purchase behavior.</p>
            `;
            container.appendChild(explanationDiv);
        }
    }
    
    console.log("Advanced purchase pattern analysis created");
}
