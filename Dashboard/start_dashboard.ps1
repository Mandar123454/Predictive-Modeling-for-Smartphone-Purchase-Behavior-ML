# Enhanced PowerShell script to run the dashboard with improved error handling and setup
function Write-ColoredBanner {
    $banner = @"
  ______                       _    ______               _     _                          _ 
 / _____)                     | |  (____  \             | |   (_)                        | |
( (____  ____  _____ ____   _ | |   ____)  ) _____  ___| |__  _  ____ _____  ___  ____ | |
 \____ \|  _ \(____ |  _ \ / || |  |  __  ( (____ |/___)  _ \| |/ _  ) ___ |/___)/    \| |
 _____) ) |_| / ___ | | | ( (_| |  | |__)  ) / ___ |___ | |_) ) ( (/ ( (___ |___ ( | | |_|
(______/|  __/\_____|_| |_|\____|  |______/( \_____(___/|____/|_|\____|_____|___/ |_|_|(_)
        |_|                               |_)                                              

"@
    Write-Host $banner -ForegroundColor Cyan
}

function Write-InfoMessage {
    param([string]$message)
    Write-Host "ℹ️ $message" -ForegroundColor Cyan
}

function Write-SuccessMessage {
    param([string]$message)
    Write-Host "✅ $message" -ForegroundColor Green
}

function Write-ErrorMessage {
    param([string]$message)
    Write-Host "❌ $message" -ForegroundColor Red
}

function Write-WarningMessage {
    param([string]$message)
    Write-Host "⚠️ $message" -ForegroundColor Yellow
}

# Display the banner
Write-ColoredBanner
Write-Host "Starting Smartphone Purchase Behavior Dashboard..." -ForegroundColor Green
Write-Host ""

# Ensure we're in the Dashboard directory
$currentDir = Get-Location
$dashboardDir = "e:\ml\Dashboard"

if ($currentDir.Path -ne $dashboardDir) {
    Write-InfoMessage "Changing to Dashboard directory: $dashboardDir"
    Set-Location -Path $dashboardDir
}

# Check system requirements
Write-InfoMessage "Checking system requirements..."
Write-Host ""

# Check PowerShell version
$psVersion = $PSVersionTable.PSVersion
Write-SuccessMessage "PowerShell version: PowerShell $($psVersion)"

# Check Python version
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    $pythonCmd = Get-Command python3 -ErrorAction SilentlyContinue
}

if ($pythonCmd) {
    $pythonVersion = & $pythonCmd --version 2>&1
    Write-SuccessMessage "Python found: $pythonVersion"
}
else {
    Write-ErrorMessage "Python is not installed or not in PATH. Please install Python 3.6+"
    Write-Host "Download Python from: https://www.python.org/downloads/"
    exit 1
}

# Check for required packages
Write-Host ""
Write-InfoMessage "Checking required Python packages..."
Write-Host ""

$requiredPackages = @{
    "flask" = "Flask web framework"
    "flask_cors" = "CORS support for Flask"
    "pandas" = "Data analysis library"
    "numpy" = "Numerical computing library"
    "scikit-learn" = "Machine learning library"
}

foreach ($package in $requiredPackages.Keys) {
    $pkgName = $package -replace "_", "."
    try {
        # Check if the package is installed
        $importResult = & $pythonCmd -c "import $pkgName; print($pkgName.__version__ if hasattr($pkgName, '__version__') else 'installed')" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-SuccessMessage "$package installed: $importResult"
        }
        else {
            Write-WarningMessage "Installing missing package: $package"
            & $pythonCmd -m pip install $package
            
            # Verify installation
            $verifyResult = & $pythonCmd -c "import $pkgName; print('success')" 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-SuccessMessage "$package installed successfully"
            }
            else {
                Write-ErrorMessage "Failed to install $package. Dashboard may not work correctly."
            }
        }
    }
    catch {
        Write-WarningMessage "Error checking $package: $_"
        & $pythonCmd -m pip install $package
    }
}

# Validate project structure
Write-Host ""
Write-InfoMessage "Validating project structure..."
Write-Host ""

# Check if essential folders exist
$hasDashboardFolder = Test-Path "."
$hasModelsFolder = Test-Path "../Models" -PathType Container
$hasDataFolder = Test-Path "../Data" -PathType Container
$hasApiFolder = Test-Path "./api" -PathType Container

if ($hasDashboardFolder) {
    Write-SuccessMessage "Dashboard structure is valid"
}
else {
    Write-ErrorMessage "Dashboard folder structure is invalid"
}

if ($hasModelsFolder) {
    Write-SuccessMessage "Model directory found"
}
else {
    Write-WarningMessage "Models directory not found - will use demo data"
}

if ($hasDataFolder) {
    Write-SuccessMessage "Data directory found"
}
else {
    Write-WarningMessage "Data directory not found - will use synthetic data"
}

# Start the Flask server
Write-Host ""
Write-InfoMessage "Starting Flask server..."
Write-Host ""

$port = 5000
Write-Host "Running on: http://localhost:$port" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "You can access the dashboard in your browser at: http://localhost:$port" -ForegroundColor Green
Write-Host ""

try {
    if ($hasApiFolder) {
        # Use the modular API structure
        & $pythonCmd -c "from api.app import create_app; app = create_app(); app.run(host='0.0.0.0', port=$port, debug=True)"
    }
    else {
        # Use the original app structure
        & $pythonCmd app.py
    }
}
catch {
    Write-ErrorMessage "The Flask server failed to start. Please check the error message above."
    Write-Host "Error details: $_" -ForegroundColor DarkRed
    exit 1
}
