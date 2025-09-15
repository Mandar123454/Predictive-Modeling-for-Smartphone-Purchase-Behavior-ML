@echo off
echo ===== Smartphone Purchase Behavior Dashboard =====
echo.
echo Checking for required packages...
echo.

cd Dashboard

echo Testing file access...
python test_file_loading.py
echo.

set /p choice="Do you want to create test model files if originals can't be loaded? (y/n): "
if /i "%choice%"=="y" (
    echo Creating test model files...
    python create_test_model.py
    echo.
)

echo Starting dashboard server...
echo.
echo Access the dashboard at: http://localhost:5000
echo.
echo If you encounter any errors:
echo 1. Make sure all required packages are installed:
echo    pip install flask flask-cors pandas numpy scikit-learn
echo 2. Check if model files exist in the Models folder
echo 3. Check if data files exist in the Data folder
echo.
echo Press Ctrl+C to stop the server when done
echo.

python app.py
