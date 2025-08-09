// Listen for theme changes and update charts
document.getElementById('theme-toggle-btn').addEventListener('click', function() {
    // Small delay to allow CSS transitions to complete
    setTimeout(() => {
        // Redraw all charts
        const dashboardData = {
            purchase_rate: document.getElementById('purchase-rate').textContent.replace('%', '') / 100,
            total_records: parseInt(document.getElementById('total-records').textContent.replace(',', '')),
            avg_income: parseFloat(document.getElementById('avg-income').textContent.replace(/[₹,]/g, '')),
            avg_time: parseFloat(document.getElementById('avg-time').textContent)
        };
        
        // Fetch current chart data
        createPurchaseDistributionChart(dashboardData.purchase_rate);
        
        // Re-fetch other chart data as needed
        const brandDistributionChart = Chart.getChart('brand-distribution-chart');
        if (brandDistributionChart) {
            const brandData = {};
            brandDistributionChart.data.labels.forEach((label, index) => {
                brandData[label] = brandDistributionChart.data.datasets[0].data[index];
            });
            createBrandDistributionChart(brandData);
        }
        
        // Redraw other charts
        const ageDistributionChart = Chart.getChart('age-distribution-chart');
        if (ageDistributionChart) {
            createAgeDistributionChart();
        }
        
        const incomeDistributionChart = Chart.getChart('income-distribution-chart');
        if (incomeDistributionChart) {
            createIncomeDistributionChart();
        }
        
        const agePurchaseRateChart = Chart.getChart('age-purchase-rate-chart');
        if (agePurchaseRateChart) {
            createAgePurchaseRateChart();
        }
        
        const correlationHeatmapChart = Chart.getChart('correlation-heatmap-chart');
        if (correlationHeatmapChart) {
            createCorrelationHeatmapChart();
        }
        
        const featureImportanceChart = Chart.getChart('feature-importance-chart');
        if (featureImportanceChart) {
            // Re-fetch feature importance data
            if (isDemoMode) {
                createFeatureImportanceChart(DEMO_FEATURE_IMPORTANCE.feature_importance);
            } else {
                fetchFeatureImportance();
            }
        }
        
        // Update Feature Influence Chart when theme changes
        const featureInfluenceChart = Chart.getChart('feature-influence-chart');
        if (featureInfluenceChart) {
            createFeatureInfluenceChart();
        }
    }, 200);
});
