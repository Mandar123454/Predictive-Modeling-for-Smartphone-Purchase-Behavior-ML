# PowerShell script to run the Flask dashboard
$ErrorActionPreference = "Stop"  # Stop on first error

Write-Host "Starting Dashboard Application..." -ForegroundColor Cyan

# Ensure we're in the correct directory
Set-Location -Path $PSScriptRoot

try {
    # Check for Python installation
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if (-not $pythonCmd) {
        $pythonCmd = Get-Command python3 -ErrorAction SilentlyContinue
    }
    
    if (-not $pythonCmd) {
        Write-Host "Error: Python not found. Please install Python 3.7 or higher." -ForegroundColor Red
        exit 1
    }
    
    # Check for Flask installation
    $flaskInstalled = python -c "import flask" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Flask not found. Installing Flask and required packages..." -ForegroundColor Yellow
        python -m pip install flask flask-cors pandas numpy scikit-learn
    }
    
    # Check if model files exist
    $modelPath = "..\Models\model.pkl"
    $scalerPath = "..\Models\scaler.pkl"
    $columnsPath = "..\Models\model_columns.pkl"
    
    $filesExist = (Test-Path $modelPath) -and (Test-Path $scalerPath) -and (Test-Path $columnsPath)
    
    if (-not $filesExist) {
        $altModelPath = "e:\ml\Models\model.pkl"
        $altScalerPath = "e:\ml\Models\scaler.pkl" 
        $altColumnsPath = "e:\ml\Models\model_columns.pkl"
        
        $altFilesExist = (Test-Path $altModelPath) -and (Test-Path $altScalerPath) -and (Test-Path $altColumnsPath)
        
        if (-not $altFilesExist) {
            Write-Host "Warning: Model files not found. The application will run in demo mode." -ForegroundColor Yellow
        }
    }
    
    # Start the Flask application
    Write-Host "Starting Flask server on http://localhost:5000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    
    # Run the Flask application
    python app.py
    
} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
}
