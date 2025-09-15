@echo off
setlocal enabledelayedexpansion

:: SmartPredict Dashboard Setup Script for Windows
:: ================================================

echo.
echo ===============================================
echo        SmartPredict Dashboard Setup
echo    Predictive Modeling for Smartphone
echo           Purchase Behavior
echo ===============================================
echo.

:: Check if Python is installed
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ Python not found! Please install Python 3.7+ from https://python.org
    echo.
    pause
    exit /b 1
)

:: Get Python version
for /f "tokens=2" %%a in ('python --version 2^>^&1') do set "python_version=%%a"
echo ✅ Python !python_version! found

:: Check if pip is available
echo.
echo [2/4] Checking pip installation...
python -m pip --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ pip not found! Please ensure pip is installed with Python
    pause
    exit /b 1
)
echo ✅ pip is available

:: Install requirements
echo.
echo [3/4] Installing Python dependencies...
echo 📦 This may take a few minutes...

if exist "requirements.txt" (
    python -m pip install -r requirements.txt
) else (
    echo ⚠️  requirements.txt not found, installing basic packages...
    python -m pip install flask flask-cors pandas numpy scikit-learn
)

if !errorlevel! equ 0 (
    echo ✅ Dependencies installed successfully
) else (
    echo ⚠️  Some packages may have failed to install, but continuing...
)

:: Check project structure
echo.
echo [4/4] Verifying project structure...
if exist "Dashboard\app.py" (
    echo ✅ Dashboard application found
) else (
    echo ⚠️  Dashboard\app.py not found
)

if exist "Data" (
    echo ✅ Data directory found
) else (
    echo ⚠️  Data directory not found
)

if exist "Models" (
    echo ✅ Models directory found
) else (
    echo ⚠️  Models directory not found
)

:: Setup complete
echo.
echo ===============================================
echo           🚀 Setup Complete!
echo ===============================================
echo.
echo To start the dashboard, you can use:
echo   1. python run_dashboard.py        (Recommended)
echo   2. cd Dashboard ^& python app.py   (Direct method)
echo   3. cd Dashboard ^& .\run_dashboard.ps1  (Your current method)
echo.
echo The dashboard will be available at: http://localhost:5000
echo.

:: Ask if user wants to start now
set /p "start_now=Do you want to start the dashboard now? (y/n): "
if /i "!start_now!"=="y" (
    echo.
    echo Starting dashboard...
    python run_dashboard.py
) else (
    echo.
    echo Setup completed. Run 'python run_dashboard.py' when ready!
)

pause