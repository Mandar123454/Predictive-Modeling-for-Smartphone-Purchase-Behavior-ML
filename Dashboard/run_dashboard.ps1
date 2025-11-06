#!/usr/bin/env pwsh
# Reverted simple launcher for the Flask dashboard (original minimal version)
$ErrorActionPreference = "Stop"

Write-Host "Starting Dashboard Application..." -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot

# Prefer repository root venv Python if available
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$venvPython = Join-Path $repoRoot ".venv/Scripts/python.exe"

try {
    $pythonCmd = $null
    if (Test-Path $venvPython) {
        $pythonCmd = $venvPython
        Write-Host "Using virtual environment Python: $pythonCmd" -ForegroundColor DarkCyan
    } else {
        $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
        if (-not $pythonCmd) { $pythonCmd = Get-Command python3 -ErrorAction SilentlyContinue }
    }
    if (-not $pythonCmd) { Write-Host "Error: Python not found. Please install Python 3.7 or higher." -ForegroundColor Red; exit 1 }

    $flaskInstalled = & $pythonCmd -c "import flask" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Flask not found. Installing minimal dependencies..." -ForegroundColor Yellow
        & $pythonCmd -m pip install flask flask-cors pandas numpy scikit-learn
    }

    $modelPath = "..\Models\model.pkl"
    $scalerPath = "..\Models\scaler.pkl"
    $columnsPath = "..\Models\model_columns.pkl"
    if (-not ((Test-Path $modelPath) -and (Test-Path $scalerPath) -and (Test-Path $columnsPath))) {
        Write-Host "Warning: Model files not all present; predictions may be disabled." -ForegroundColor Yellow
    }

    Write-Host "Starting Flask server on http://localhost:5000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    & $pythonCmd app.py
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
}
