// Create marketing impact chart
function createMarketingImpactChart() {
    // Demo data showing the difference in purchase rate between users with and without marketing engagement
    const marketingData = {
        'Engaged with Marketing': 0.65,
        'No Marketing': 0.35
    };
    
    const labels = Object.keys(marketingData);
    const purchaseRates = Object.values(marketingData);
    
    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Set appropriate colors for current mode
    const textColor = isDarkMode ? '#e2e8f0' : '#333333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    const ctx = document.getElementById('marketing-impact-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Purchase Rate',
                data: purchaseRates.map(rate => rate * 100),
                backgroundColor: ['#4361ee', '#94a3b8'],
                borderWidth: 0,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: textColor,
                        font: {
                            weight: 'bold'
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: gridColor
                    },
                    title: {
                        display: true,
                        text: 'Purchase Rate (%)',
                        color: textColor,
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Purchase Rate: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            }
        }
    });
}

// Create demographics probability chart (heatmap)
function createDemographicsProbabilityChart() {
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
    
    const ctx = document.getElementById('demographics-probability-chart').getContext('2d');
    
    // Create heatmap using Chart.js
    new Chart(ctx, {
        type: 'matrix',
        data: {
            datasets: [{
                label: 'Purchase Probability (%)',
                data: generateHeatmapData(demographicsData),
                backgroundColor(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = (value / 100);
                    return isDarkMode 
                        ? `rgba(77, 143, 255, ${alpha})` 
                        : `rgba(67, 97, 238, ${alpha})`;
                },
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                width: ({ chart }) => (chart.chartArea.width / 5) - 1,
                height: ({ chart }) => (chart.chartArea.height / 5) - 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            scales: {
                x: {
                    type: 'category',
                    labels: demographicsData.incomeGroups,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor
                    },
                    title: {
                        display: true,
                        text: 'Income Group',
                        color: textColor
                    }
                },
                y: {
                    type: 'category',
                    labels: demographicsData.labels,
                    offset: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor
                    },
                    title: {
                        display: true,
                        text: 'Age Group',
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
                        title() {
                            return '';
                        },
                        label(context) {
                            const v = context.dataset.data[context.dataIndex];
                            return [
                                `Age: ${demographicsData.labels[v.y]}`,
                                `Income: ${demographicsData.incomeGroups[v.x]}`,
                                `Purchase Probability: ${v.v.toFixed(1)}%`
                            ];
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
        
        // Blue to red gradient
        if (normalized < 0.5) {
            const r = Math.floor(normalized * 2 * 255);
            return `rgba(${r}, 0, 255, 0.7)`;
        } else {
            const b = Math.floor((1 - (normalized - 0.5) * 2) * 255);
            return `rgba(255, 0, ${b}, 0.7)`;
        }
    });
}

// Create brand purchase rate chart
function createBrandPurchaseRateChart() {
    // Demo data showing purchase rates for different brands
    const brandPurchaseRates = {
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
        'Samsung': '#1428a0', // Samsung Blue
        'Xiaomi': '#ff6700',  // Xiaomi Orange
        'OnePlus': '#f50514',  // OnePlus Red
        'iPhone': '#555555',   // Apple Dark Gray
        'Other': '#8c8c8c'     // Gray for others
    };
    
    // Create color array based on brands
    const colors = brands.map(brand => brandColors[brand] || '#4361ee');
    
    const ctx = document.getElementById('brand-purchase-rate-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: brands,
            datasets: [{
                label: 'Purchase Rate',
                data: rates.map(rate => rate * 100),
                backgroundColor: colors,
                borderWidth: 0,
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal bar chart
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: textColor,
                        font: {
                            weight: 'bold'
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: gridColor
                    },
                    title: {
                        display: true,
                        text: 'Purchase Rate (%)',
                        color: textColor,
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    ticks: {
                        color: textColor,
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Purchase Rate: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            }
        }
    });
}
