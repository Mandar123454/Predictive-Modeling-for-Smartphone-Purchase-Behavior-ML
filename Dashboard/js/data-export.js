/**
 * Data Export functionality for the dashboard
 */

class DataExport {
    /**
     * Initialize export buttons
     */
    static init() {
        // Add event listeners to export buttons
        document.querySelectorAll('.export-csv-btn').forEach(button => {
            button.addEventListener('click', function() {
                const chartId = this.getAttribute('data-chart');
                DataExport.exportChartDataCSV(chartId);
            });
        });
        
        document.querySelectorAll('.export-png-btn').forEach(button => {
            button.addEventListener('click', function() {
                const chartId = this.getAttribute('data-chart');
                DataExport.exportChartPNG(chartId);
            });
        });
    }
    
    /**
     * Export chart data as CSV
     */
    static exportChartDataCSV(chartId) {
        const chartInstance = Chart.getChart(chartId);
        
        if (!chartInstance) {
            console.error(`Chart with ID ${chartId} not found`);
            return;
        }
        
        try {
            // Get chart data
            const labels = chartInstance.data.labels;
            const datasets = chartInstance.data.datasets;
            
            // Create CSV header row
            let csvContent = "data:text/csv;charset=utf-8,";
            
            // Add header row
            let headers = ["Label"];
            datasets.forEach(dataset => {
                headers.push(dataset.label || "Dataset");
            });
            csvContent += headers.join(",") + "\r\n";
            
            // Add data rows
            labels.forEach((label, i) => {
                let row = [label];
                datasets.forEach(dataset => {
                    row.push(dataset.data[i]);
                });
                csvContent += row.join(",") + "\r\n";
            });
            
            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${chartId}_data_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            
            // Download the file
            link.click();
            
            // Clean up
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting chart data to CSV:', error);
            alert('Failed to export chart data. Please try again.');
        }
    }
    
    /**
     * Export chart as PNG image
     */
    static exportChartPNG(chartId) {
        const chartInstance = Chart.getChart(chartId);
        
        if (!chartInstance) {
            console.error(`Chart with ID ${chartId} not found`);
            return;
        }
        
        try {
            // Get chart canvas
            const canvas = chartInstance.canvas;
            
            // Create download link
            const link = document.createElement('a');
            link.download = `${chartId}_${new Date().toISOString().slice(0,10)}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            
            // Download the image
            link.click();
            
            // Clean up
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting chart to PNG:', error);
            alert('Failed to export chart as image. Please try again.');
        }
    }
    
    /**
     * Export all data as CSV
     */
    static exportAllDataCSV(data, filename = 'dashboard_data') {
        try {
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data format');
            }
            
            // Convert object to CSV
            let csvContent = "data:text/csv;charset=utf-8,";
            
            // Add headers and values
            for (const [key, value] of Object.entries(data)) {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    // Handle nested objects - create separate sections
                    csvContent += `\r\n# ${key}\r\n`;
                    for (const [nestedKey, nestedValue] of Object.entries(value)) {
                        csvContent += `${nestedKey},${nestedValue}\r\n`;
                    }
                } else if (Array.isArray(value)) {
                    // Handle arrays
                    csvContent += `\r\n# ${key}\r\n`;
                    value.forEach(item => {
                        if (typeof item === 'object') {
                            csvContent += Object.values(item).join(',') + '\r\n';
                        } else {
                            csvContent += item + '\r\n';
                        }
                    });
                } else {
                    // Handle simple key-value pairs
                    csvContent += `${key},${value}\r\n`;
                }
            }
            
            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            
            // Download the file
            link.click();
            
            // Clean up
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting data to CSV:', error);
            alert('Failed to export data. Please try again.');
        }
    }
    
    /**
     * Export table data as CSV
     */
    static exportTableCSV(tableId, filename) {
        try {
            const table = document.getElementById(tableId);
            
            if (!table) {
                throw new Error(`Table with ID ${tableId} not found`);
            }
            
            let csvContent = "data:text/csv;charset=utf-8,";
            
            // Get headers
            const headerRow = table.querySelector('thead tr');
            const headers = [];
            headerRow.querySelectorAll('th').forEach(th => {
                headers.push(`"${th.textContent.trim().replace(/"/g, '""')}"`);
            });
            csvContent += headers.join(",") + "\r\n";
            
            // Get data rows
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const rowData = [];
                row.querySelectorAll('td').forEach(cell => {
                    rowData.push(`"${cell.textContent.trim().replace(/"/g, '""')}"`);
                });
                csvContent += rowData.join(",") + "\r\n";
            });
            
            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            
            // Download the file
            link.click();
            
            // Clean up
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting table to CSV:', error);
            alert('Failed to export table data. Please try again.');
        }
    }
}

// Initialize after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    DataExport.init();
});
