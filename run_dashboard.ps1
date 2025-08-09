# PowerShell script to run the Smartphone Purchase Behavior Dashboard
Write-Host "`n===== Smartphone Purchase Behavior Dashboard =====`n" -ForegroundColor Cyan

# Check Python installation
try {
    $pythonVersion = python --version
    Write-Host "✅ $pythonVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.7 or higher." -ForegroundColor Red
    Exit 1
}

# Check required packages
$requiredPackages = @("flask", "flask-cors", "pandas", "numpy", "scikit-learn")
$missingPackages = @()

foreach ($package in $requiredPackages) {
    try {
        $null = python -c "import $package"
        Write-Host "✅ $package is installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ $package is missing" -ForegroundColor Red
        $missingPackages += $package
    }
}

if ($missingPackages.Count -gt 0) {
    Write-Host "`nMissing packages detected. Would you like to install them? (y/n)" -ForegroundColor Yellow
    $installChoice = Read-Host
    if ($installChoice -eq "y") {
        $packageString = $missingPackages -join " "
        Write-Host "Installing packages: $packageString" -ForegroundColor Cyan
        python -m pip install $missingPackages
    } else {
        Write-Host "`nPlease install required packages manually with:" -ForegroundColor Yellow
        Write-Host "pip install $($missingPackages -join ' ')" -ForegroundColor Yellow
        Write-Host "Then run this script again.`n"
        Exit 1
    }
}

# Navigate to Dashboard directory
Set-Location -Path "$PSScriptRoot\Dashboard"

# Test file access
Write-Host "`nTesting file access..."
python test_file_loading.py

Write-Host "`nWould you like to create test model files if originals can't be loaded? (y/n)" -ForegroundColor Yellow
$modelChoice = Read-Host
if ($modelChoice -eq "y") {
    Write-Host "Creating test model files..."
    python create_test_model.py
}

# Start the Flask server
Write-Host "`nStarting dashboard server..." -ForegroundColor Green
Write-Host "Access the dashboard at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server when done`n"

python app.py
