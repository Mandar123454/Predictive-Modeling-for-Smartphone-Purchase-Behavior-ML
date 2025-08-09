// Demographics Heatmap Chart for the Demographics section
function createDemographicsHeatmapChart() {
    console.log('Creating demographics heatmap chart');
    
    // Check if the element exists
    const chartElement = document.getElementById('demographics-heatmap-chart');
    if (!chartElement) {
        console.error('Demographics heatmap chart element not found!');
        return;
    }
    
    // Demographics data showing purchase probability across age and income groups
    const demographicsData = {
        // Age groups (rows)
        labels: ['18-25', '26-35', '36-45', '46-55', '56+'],
        // Income groups (columns)
        incomeGroups: ['<30k', '30k-50k', '50k-70k', '70k-100k', '>100k'],
        // Purchase probability data (2D array: rows = age groups, columns = income groups)
        data: [
            [0.25, 0.30, 0.35, 0.40, 0.45], // 18-25 age group
            [0.35, 0.45, 0.50, 0.60, 0.70], // 26-35 age group
            [0.40, 0.45, 0.55, 0.65, 0.75], // 36-45 age group
            [0.30, 0.40, 0.50, 0.60, 0.65], // 46-55 age group
            [0.25, 0.30, 0.40, 0.50, 0.55]  // 56+ age group
        ]
    };
    
    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Clear existing chart if it exists
    const chartId = 'demographics-heatmap-chart';
    const existingChart = Chart.getChart(chartId);
    if (existingChart) {
        existingChart.destroy();
    }
    
    // Set appropriate colors for current mode
    const textColor = isDarkMode ? '#e2e8f0' : '#333333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Create the data structure for the heatmap
    const datasets = [];
    
    demographicsData.data.forEach((row, i) => {
        datasets.push({
            label: demographicsData.labels[i],
            data: row.map(val => val * 100), // Convert to percentages
            backgroundColor: getColorGradient(row),
            borderWidth: 1,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        });
    });
    
    const ctx = document.getElementById('demographics-heatmap-chart').getContext('2d');
    
    // Create heatmap using Chart.js (using standard chart types)
    // Add a colorful heatmap-style visualization
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: demographicsData.incomeGroups,
            datasets: demographicsData.labels.map((ageGroup, index) => {
                return {
                    label: ageGroup,
                    data: demographicsData.data[index].map(val => val * 100),
                    backgroundColor: demographicsData.data[index].map(val => {
                        // Create a blue to orange gradient based on values
                        const normalizedValue = val; // 0 to 1 range
                        if (normalizedValue < 0.4) {
                            return `rgba(65, 105, 225, 0.7)`; // Royal Blue for low values
                        } else if (normalizedValue < 0.5) {
                            return `rgba(100, 149, 237, 0.7)`; // Cornflower Blue
                        } else if (normalizedValue < 0.6) {
                            return `rgba(30, 144, 255, 0.7)`; // Dodger Blue
                        } else if (normalizedValue < 0.7) {
                            return `rgba(0, 191, 255, 0.7)`; // Deep Sky Blue
                        } else {
                            return `rgba(0, 150, 255, 0.8)`; // Bright Blue for high values
                        }
                    }),
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    barPercentage: 0.98,
                    categoryPercentage: 0.98
                };
            })
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
                x: {
                    stacked: true,
                    type: 'category',
                    grid: {
                        display: true,
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            weight: 'bold'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Income Group',
                        color: textColor,
                        font: {
                            weight: 'bold'
                        },
                        padding: {top: 10, bottom: 0}
                    }
                },
                y: {
                    stacked: true,
                    type: 'category',
                    offset: true,
                    grid: {
                        display: true,
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            weight: 'bold'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Age Group',
                        color: textColor,
                        font: {
                            weight: 'bold'
                        },
                        padding: {top: 0, left: 10}
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title(context) {
                            return `Age: ${context[0].dataset.label}, Income: ${context[0].label}`;
                        },
                        label(context) {
                            return `Purchase Probability: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            }
        }
    });
}

// Helper function to generate heatmap data in the format needed for Chart.js
function generateHeatmapData(demographicsData) {
    const result = [];
    demographicsData.data.forEach((row, y) => {
        row.forEach((value, x) => {
            result.push({
                x,
                y,
                v: value * 100 // Convert to percentage
            });
        });
    });
    return result;
}

// Helper function to get a color gradient for visualization
function getColorGradient(values) {
    return values.map(value => {
        // Scale from 0 to 1
        const normalized = Math.min(Math.max(value, 0), 1);
        
        // Blue to orange gradient (as requested in the requirement)
        if (normalized < 0.5) {
            const r = Math.floor(normalized * 2 * 255);
            return `rgba(${r}, 0, 255, 0.7)`;
        } else {
            const b = Math.floor((1 - (normalized - 0.5) * 2) * 255);
            return `rgba(255, 127, ${b}, 0.7)`;
        }
    });
}

// Initialize the heatmap chart when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure the chart is created after the parent elements
    setTimeout(() => {
        console.log('Initializing demographics heatmap chart');
        createDemographicsHeatmapChart();
    }, 100);
});
