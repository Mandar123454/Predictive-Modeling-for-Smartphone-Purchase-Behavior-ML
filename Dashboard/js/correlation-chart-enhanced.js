/**
 * Feature Correlation Chart
 * Provides an enhanced visualization of feature correlations with purchase decisions
 */

// Initialize the chart on page load
document.addEventListener('DOMContentLoaded', function() {
    // The chart will be created by dashboard.js
    // This script adds additional functionality
    
    // Add resize listener to ensure the chart resizes properly
    window.addEventListener('resize', function() {
        // Get the current chart
        const currentChart = Chart.getChart('correlation-heatmap-chart');
        
        // If chart exists, resize it
        if (currentChart) {
            currentChart.resize();
        }
    });
});

// Add extra descriptions to the correlation features when hovering
function setupCorrelationDescriptions() {
    const container = document.querySelector('.chart-card.correlation-container');
    if (!container) return;
    
    // Feature descriptions to show on hover
    const featureDescriptions = {
        'Income': 'Higher income shows strong positive correlation with purchase likelihood',
        'Time On Website': 'More time spent researching correlates with higher purchase rates',
        'Previous Purchases': 'Past buying behavior is a reliable predictor of future purchases',
        'Marketing Engaged': 'Engagement with marketing materials shows moderate correlation',
        'Search Frequency': 'How often users search for smartphone info indicates interest',
        'Age': 'Age shows some correlation but less influential than other factors',
        'Device Age': 'Older device age slightly increases likelihood of new purchase'
    };
    
    // Create enhanced tooltip element (in addition to Chart.js tooltip)
    const tooltip = document.createElement('div');
    tooltip.className = 'correlation-enhanced-tooltip';
    tooltip.style.cssText = 'position: absolute; background: rgba(0,0,0,0.85); color: white; padding: 12px; border-radius: 6px; font-size: 14px; max-width: 300px; z-index: 1000; display: none; pointer-events: none; box-shadow: 0 4px 8px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);';
    document.body.appendChild(tooltip);
    
    // Get all labels
    const canvas = document.getElementById('correlation-heatmap-chart');
    
    // Track if tooltip is visible
    let isTooltipVisible = false;
    let currentFeature = '';
    let tooltipTimeout;
    
    // Show tooltip on canvas hover with improved detection
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const chart = Chart.getChart('correlation-heatmap-chart');
        
        if (chart) {
            // Use nearest mode with a lower intersection threshold
            const elements = chart.getElementsAtEventForMode(
                event, 
                'nearest', 
                { intersect: false, axis: 'y' }, 
                false
            );
            
            if (elements.length > 0) {
                clearTimeout(tooltipTimeout);
                const element = elements[0];
                const label = chart.data.labels[element.index];
                const value = chart.data.datasets[0].data[element.index];
                const description = featureDescriptions[label] || `${label} impacts purchase decisions`;
                
                // Only update if different from current feature
                if (currentFeature !== label) {
                    currentFeature = label;
                    
                    // Build rich tooltip content
                    tooltip.innerHTML = `
                        <div style="font-weight: bold; font-size: 16px; margin-bottom: 6px; color: #4ade80;">${label}</div>
                        <div style="margin-bottom: 8px;">Correlation: <span style="font-weight: bold; color: ${value > 50 ? '#4ade80' : value > 30 ? '#60a5fa' : '#93c5fd'}">${value}%</span></div>
                        <div style="line-height: 1.4; opacity: 0.9;">${description}</div>
                    `;
                    
                    // Calculate tooltip position with smart placement
                    const tooltipWidth = 280; // approximate width
                    const tooltipHeight = 120; // approximate height
                    let left = event.clientX + 15;
                    let top = event.clientY + 10;
                    
                    // Avoid tooltip going off-screen
                    if (left + tooltipWidth > window.innerWidth) {
                        left = event.clientX - tooltipWidth - 10;
                    }
                    if (top + tooltipHeight > window.innerHeight) {
                        top = event.clientY - tooltipHeight - 10;
                    }
                    
                    tooltip.style.left = left + 'px';
                    tooltip.style.top = top + 'px';
                    tooltip.style.display = 'block';
                    isTooltipVisible = true;
                }
            } else {
                // Add slight delay before hiding to prevent flickering
                tooltipTimeout = setTimeout(() => {
                    tooltip.style.display = 'none';
                    isTooltipVisible = false;
                    currentFeature = '';
                }, 100);
            }
        }
    });
    
    // Hide tooltip when leaving canvas
    canvas.addEventListener('mouseleave', function() {
        tooltip.style.display = 'none';
        isTooltipVisible = false;
        currentFeature = '';
    });
}

// Call this function when the chart is ready
function enhanceCorrelationChart() {
    setupCorrelationDescriptions();
    
    // Update the container to indicate it's interactive and add improved styling
    const container = document.querySelector('.chart-card.correlation-container');
    if (container) {
        // Add a better looking title that matches the feature influence chart
        const chartHeader = container.querySelector('.chart-header');
        if (chartHeader) {
            chartHeader.innerHTML = `
                <h3>Feature Influence Analysis</h3>
                <p class="chart-subtitle">Relative impact of features on purchase decisions</p>
            `;
        }
        
        // Add interactive tip with improved styling
        const infoText = document.createElement('div');
        infoText.className = 'chart-interaction-tip';
        infoText.innerHTML = '<i class="fas fa-info-circle"></i> Hover over bars for detailed insights';
        infoText.style.cssText = 'text-align: center; font-size: 0.85rem; margin-top: 12px; color: #666; font-style: italic; background: rgba(0,0,0,0.03); padding: 6px; border-radius: 4px;';
        
        // Add legend with better styling to match screenshot
        const legend = document.createElement('div');
        legend.className = 'correlation-legend';
        legend.style.cssText = 'display: flex; justify-content: center; margin-top: 15px; flex-wrap: wrap;';
        
        // Create legend items to match the screenshot
        const legendItems = [
            { color: '#4ade80', label: 'Strong Positive Influence (>50%)' },
            { color: '#60a5fa', label: 'Moderate Positive Influence (30-50%)' },
            { color: '#93c5fd', label: 'Weak Positive Influence (<30%)' },
            { color: '#f87171', label: 'Negative Influence' }
        ];
        
        // Add legend items
        legendItems.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.style.cssText = 'display: flex; align-items: center; margin: 5px 10px;';
            
            const colorBox = document.createElement('div');
            colorBox.style.cssText = `width: 12px; height: 12px; background-color: ${item.color}; margin-right: 6px; border-radius: 2px;`;
            
            const label = document.createElement('span');
            label.textContent = item.label;
            label.style.cssText = 'font-size: 0.85rem;';
            
            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            legend.appendChild(legendItem);
        });
        
        // Append new elements in the right order
        container.appendChild(legend);
        container.appendChild(infoText);
        
        // Add a slight box shadow to make the bars pop more
        const canvas = document.getElementById('correlation-heatmap-chart');
        canvas.style.filter = 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))';
        
        // Apply more professional styling to the container
        container.style.padding = '20px';
        container.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        
        // Update the chart label to match the screenshot
        const chartLabel = container.querySelector('.chart-label');
        if (chartLabel) {
            chartLabel.textContent = 'Influence Factor (0-100%)';
            chartLabel.style.fontWeight = '500';
        }
    }
}
