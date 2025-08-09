@echo off
echo ===== Smartphone Purchase Behavior Dashboard =====
echo.
echo Starting Flask server for the dashboard...
echo.

cd ..
echo Flask server will start at http://localhost:5000
echo.
echo Press Ctrl+C to stop the server when finished.
echo.
echo.
echo Access the dashboard at: http://localhost:5000
echo.
echo If you encounter any errors:
echo 1. Make sure all required packages are installed:
echo    pip install flask flask-cors pandas numpy scikit-learn
echo 2. Check if model files exist in the Models folder
echo 3. Check if data files exist in the Data folder
python app.py

echo.
echo If you encounter any errors, please check that all required Python packages are installed.
echo You can install them using: pip install flask flask_cors pandas numpy scikit-learn joblib
