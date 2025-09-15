@echo off
:: SmartPredict Dashboard - Quick Launcher
:: Double-click this file to start the dashboard

title SmartPredict Dashboard

echo.
echo ================================
echo      SmartPredict Dashboard
echo ================================
echo.
echo Starting dashboard...
echo.

:: Try to start with the main launcher
if exist "run_dashboard.py" (
    python run_dashboard.py
) else (
    :: Fallback to direct method
    if exist "Dashboard\app.py" (
        cd Dashboard
        python app.py
    ) else (
        echo Error: Dashboard files not found!
        echo Please ensure you're in the correct directory.
        pause
        exit /b 1
    )
)

pause