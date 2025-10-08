<#!
    Enhanced launcher (preserves original behavior but adds):
     - Prefer local .venv Python
     - Auto install missing core deps silently (or prompt)
     - Full traceback capture on failure
     - Optional -AutoYes switch to skip prompts
!>
param(
    [switch]$AutoYes,
    [int]$Port = 5000
)

Write-Host "`n===== Smartphone Purchase Behavior Dashboard =====`n" -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot

# Resolve Python (prefer venv)
$venvPython = Join-Path $PSScriptRoot ".venv/Scripts/python.exe"
if (-not (Test-Path $venvPython)) { $venvPython = Join-Path (Split-Path $PSScriptRoot -Parent) ".venv/Scripts/python.exe" }
$python = $null
if (Test-Path $venvPython) { $python = $venvPython }
else {
    try { $python = (Get-Command python -ErrorAction Stop).Source } catch { }
    if (-not $python) { try { $python = (Get-Command python3 -ErrorAction Stop).Source } catch { }
}
if (-not $python) { Write-Host "❌ Python not found. Install Python 3.12 (recommended)." -ForegroundColor Red; exit 1 }
Write-Host "Using Python: $python" -ForegroundColor Green

# Core deps
$requiredPackages = @("flask","flask_cors","pandas","numpy","sklearn")
$missingPackages = @()
foreach ($pkg in $requiredPackages) {
    & $python -c "import $pkg" 2>$null
    if ($LASTEXITCODE -ne 0) { $missingPackages += $pkg; Write-Host "❌ $pkg missing" -ForegroundColor Yellow } else { Write-Host "✅ $pkg present" -ForegroundColor Green }
}

if ($missingPackages.Count -gt 0) {
    if ($AutoYes) { $choice = 'y' } else { Write-Host "Install missing packages: $($missingPackages -join ', ')? (y/n)" -ForegroundColor Yellow; $choice = Read-Host }
    if ($choice -eq 'y') {
         Write-Host "Installing: $($missingPackages -join ' ')" -ForegroundColor Cyan
         & $python -m pip install --upgrade pip 2>$null | Out-Null
         & $python -m pip install $missingPackages
    } else { Write-Host "Aborting due to missing dependencies." -ForegroundColor Red; exit 1 }
}

# Inform about full dependency set
if (Test-Path (Join-Path (Split-Path $PSScriptRoot -Parent) 'requirements.txt')) {
    Write-Host "(Tip) To install full project deps: $python -m pip install -r requirements.txt" -ForegroundColor DarkGray
}

# Change into dashboard directory if not already
if ((Split-Path $PSScriptRoot -Leaf) -ne 'Dashboard') {
    $dashPath = Join-Path $PSScriptRoot 'Dashboard'
    if (Test-Path $dashPath) { Set-Location $dashPath }
}

# Optional test scripts
if (Test-Path 'test_file_loading.py') {
    Write-Host "Running file access test..." -ForegroundColor Cyan
    & $python test_file_loading.py 2>&1 | ForEach-Object { Write-Host $_ }
}

# Model sanity note
foreach ($f in @('..\Models\model.pkl','..\Models\scaler.pkl','..\Models\model_columns.pkl')) {
    if (-not (Test-Path $f)) { Write-Host "⚠ Missing: $f (predictions may be disabled)" -ForegroundColor Yellow }
}

Write-Host "`nStarting dashboard server on http://localhost:$Port" -ForegroundColor Green
$env:PORT = $Port
Write-Host "Press Ctrl+C to stop." -ForegroundColor Cyan

$output = & $python app.py 2>&1
$code = $LASTEXITCODE
if ($code -ne 0) {
    Write-Host "App exited with code $code" -ForegroundColor Red
    Write-Host "----- BEGIN TRACEBACK / OUTPUT -----" -ForegroundColor Yellow
    $output | ForEach-Object { Write-Host $_ }
    Write-Host "----- END TRACEBACK / OUTPUT -----" -ForegroundColor Yellow
    exit $code
} else {
    $output | ForEach-Object { Write-Host $_ }
}
