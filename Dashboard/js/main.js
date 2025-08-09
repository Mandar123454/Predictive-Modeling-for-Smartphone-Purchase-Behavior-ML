/**
 * Main JavaScript for Smartphone Purchase Prediction Dashboard
 */

// Set default API base URL (will be overridden by static-data-provider.js when needed)
window.apiBaseUrl = '/api';

// Check if we're on Netlify or running locally without backend
const isNetlify = window.location.hostname.includes('netlify.app');
const isLocalWithoutBackend = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Update API base URL if needed
if (isNetlify || isLocalWithoutBackend) {
    window.apiBaseUrl = './data';
    console.log('Setting API base URL to:', window.apiBaseUrl);
}

// DOM Elements
const totalRecordsEl = document.getElementById('total-records');
const purchaseRateEl = document.getElementById('purchase-rate');
const maleRateEl = document.getElementById('male-rate');
const femaleRateEl = document.getElementById('female-rate');
const predictionForm = document.getElementById('prediction-form');
const predictionResult = document.getElementById('prediction-result');
const predictionAlert = document.getElementById('prediction-alert');
const predictionDetails = document.getElementById('prediction-details');

// Chart references
let ageChart, genderChart, featureChart, brandChart;
let ageDemographicsChart, incomeDistributionChart;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkApiStatus();
    loadDashboardData();
    loadFeatureImportance();
    loadBrandComparison();
    setupEventListeners();
});

/**
 * Check if the API is available
 */
function checkApiStatus() {
    fetch(`${apiBaseUrl}/status`)
        .then(response => response.json())
        .then(data => {
            console.log('API Status:', data);
            // You can show a status indicator if needed
        })
        .catch(error => {
            console.error('Error checking API status:', error);
        });
}

/**
 * Load main dashboard data
 */
function loadDashboardData() {
    fetch(`${apiBaseUrl}/dashboard_data`)
        .then(response => response.json())
        .then(data => {
            // Update stats cards
            totalRecordsEl.textContent = data.total_records.toLocaleString();
            purchaseRateEl.textContent = `${(data.purchase_rate * 100).toFixed(1)}%`;
            maleRateEl.textContent = `${(data.purchase_by_gender.Male * 100).toFixed(1)}%`;
            femaleRateEl.textContent = `${(data.purchase_by_gender.Female * 100).toFixed(1)}%`;
            
            // Create charts
            createAgeChart(data.purchase_by_age_group);
            createGenderChart(data.gender_distribution);
        })
        .catch(error => {
            console.error('Error loading dashboard data:', error);
        });
}

/**
 * Load feature importance data
 */
function loadFeatureImportance() {
    fetch(`${apiBaseUrl}/feature_importance`)
        .then(response => response.json())
        .then(data => {
            createFeatureImportanceChart(data.feature_importance);
        })
        .catch(error => {
            console.error('Error loading feature importance data:', error);
        });
}

/**
 * Load brand comparison data
 */
function loadBrandComparison() {
    fetch(`${apiBaseUrl}/compare_brands`)
        .then(response => response.json())
        .then(data => {
            createBrandComparisonChart(data);
            createAgeDemographicsChart(data.age_demographics);
            createIncomeDistributionChart(data.income_distribution);
        })
        .catch(error => {
            console.error('Error loading brand comparison data:', error);
        });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Prediction form submission
    predictionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitPrediction();
    });
}

/**
 * Submit form data for prediction
 */
function submitPrediction() {
    const formData = {
        Age: parseInt(document.getElementById('age').value),
        Gender: document.getElementById('gender').value,
        CreditScore: parseInt(document.getElementById('creditScore').value),
        EstimatedSalary: parseInt(document.getElementById('salary').value)
    };

    fetch(`${apiBaseUrl}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        displayPredictionResult(data);
    })
    .catch(error => {
        console.error('Error making prediction:', error);
        predictionResult.classList.remove('d-none');
        predictionAlert.className = 'alert alert-danger';
        predictionAlert.textContent = 'An error occurred while making the prediction. Please try again.';
    });
}

/**
 * Display prediction results
 */
function displayPredictionResult(data) {
    predictionResult.classList.remove('d-none');
    
    if (data.prediction === 1) {
        predictionAlert.className = 'alert alert-success';
        predictionAlert.innerHTML = '<strong>Likely to Purchase</strong> - This customer has a high probability of purchasing a smartphone.';
    } else {
        predictionAlert.className = 'alert alert-warning';
        predictionAlert.innerHTML = '<strong>Unlikely to Purchase</strong> - This customer is not likely to purchase a smartphone.';
    }

    // Display probability and factors
    let detailsHtml = `<p>Probability: ${(data.probability * 100).toFixed(1)}%</p>`;
    detailsHtml += '<h6>Top Influential Factors:</h6>';
    detailsHtml += '<ul>';
    
    data.explanation.top_factors.forEach(factor => {
        detailsHtml += `<li><strong>${factor.feature}</strong>: ${factor.value} (Importance: ${(factor.importance * 100).toFixed(1)}%)</li>`;
    });
    
    detailsHtml += '</ul>';
    predictionDetails.innerHTML = detailsHtml;
}

/**
 * Create age chart
 */
function createAgeChart(ageData) {
    const ctx = document.getElementById('age-chart').getContext('2d');
    
    if (ageChart) {
        ageChart.destroy();
    }
    
    ageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ageData),
            datasets: [{
                label: 'Purchase Rate by Age Group',
                data: Object.values(ageData).map(val => (val * 100).toFixed(1)),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
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
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Purchase Rate (%)'
                    }
                }
            }
        }
    });
}

/**
 * Create gender distribution chart
 */
function createGenderChart(genderData) {
    const ctx = document.getElementById('gender-chart').getContext('2d');
    
    if (genderChart) {
        genderChart.destroy();
    }
    
    genderChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(genderData),
            datasets: [{
                data: Object.values(genderData),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create feature importance chart
 */
function createFeatureImportanceChart(featureData) {
    const ctx = document.getElementById('feature-chart').getContext('2d');
    
    if (featureChart) {
        featureChart.destroy();
    }
    
    // Get the top features
    const features = Object.keys(featureData);
    const importanceValues = Object.values(featureData);
    
    featureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: features,
            datasets: [{
                label: 'Feature Importance',
                data: importanceValues.map(val => (val * 100).toFixed(1)),
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Importance: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Importance (%)'
                    }
                }
            }
        }
    });
}

/**
 * Create brand comparison chart
 */
function createBrandComparisonChart(data) {
    const ctx = document.getElementById('brand-chart').getContext('2d');
    
    if (brandChart) {
        brandChart.destroy();
    }
    
    brandChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.brands,
            datasets: [{
                label: 'Purchase Rate by Brand',
                data: data.purchase_rates.map(val => (val * 100).toFixed(1)),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
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
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Purchase Rate (%)'
                    }
                }
            }
        }
    });
}

/**
 * Create age demographics chart using D3.js
 */
function createAgeDemographicsChart(ageData) {
    const container = document.getElementById('age-demographics-chart');
    container.innerHTML = '';
    
    const brands = Object.keys(ageData);
    const ageGroups = Object.keys(ageData[brands[0]]);
    
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = container.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const svg = d3.select('#age-demographics-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleBand()
        .domain(brands)
        .range([0, width])
        .padding(0.1);
    
    // Y scale
    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    
    // Color scale
    const color = d3.scaleOrdinal()
        .domain(ageGroups)
        .range(d3.schemeCategory10);
    
    // Stack the data
    const stackedData = d3.stack()
        .keys(ageGroups)
        .value((d, key) => d[key])
        (brands.map(brand => ageData[brand]));
    
    // Create the stacked bars
    svg.selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', (d, i) => x(brands[i]))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth());
    
    // Add X axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    // Add Y axis
    svg.append('g')
        .call(d3.axisLeft(y).ticks(10, '%'));
    
    // Add legend
    const legend = svg.selectAll('.legend')
        .data(ageGroups)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 20})`);
    
    legend.append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);
    
    legend.append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(d => d);
}

/**
 * Create income distribution chart using D3.js
 */
function createIncomeDistributionChart(incomeData) {
    const container = document.getElementById('income-distribution-chart');
    container.innerHTML = '';
    
    const brands = Object.keys(incomeData);
    const incomeGroups = Object.keys(incomeData[brands[0]]);
    
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = container.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const svg = d3.select('#income-distribution-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleBand()
        .domain(brands)
        .range([0, width])
        .padding(0.1);
    
    // Y scale
    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    
    // Color scale
    const color = d3.scaleOrdinal()
        .domain(incomeGroups)
        .range(['#66c2a5', '#fc8d62', '#8da0cb']);
    
    // Stack the data
    const stackedData = d3.stack()
        .keys(incomeGroups)
        .value((d, key) => d[key])
        (brands.map(brand => incomeData[brand]));
    
    // Create the stacked bars
    svg.selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', (d, i) => x(brands[i]))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth());
    
    // Add X axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    // Add Y axis
    svg.append('g')
        .call(d3.axisLeft(y).ticks(10, '%'));
    
    // Add legend
    const legend = svg.selectAll('.legend')
        .data(incomeGroups)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 20})`);
    
    legend.append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);
    
    legend.append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(d => {
            if (d === 'low') return 'Low Income';
            if (d === 'medium') return 'Medium Income';
            if (d === 'high') return 'High Income';
            return d;
        });
}
