@echo off
echo ===================================================
echo Preparing Smartphone Dashboard for Netlify Deployment
echo ===================================================
echo.

echo Step 1: Creating data directory...
mkdir Dashboard\data 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Created Dashboard\data directory.
) else (
    echo Dashboard\data directory already exists.
)

echo.
echo Step 2: Generating static JSON data...
python prepare_static_data.py
if %ERRORLEVEL% NEQ 0 (
    echo Error generating static data. Please check the error message above.
    pause
    exit /b 1
)

echo.
echo Step 3: Verifying project structure...
if not exist Dashboard\index.html (
    echo ERROR: index.html not found in Dashboard directory.
    echo Please ensure your Dashboard\index.html file exists.
    pause
    exit /b 1
)

if not exist Dashboard\js\static-data-provider.js (
    echo ERROR: static-data-provider.js not found.
    echo Please ensure Dashboard\js\static-data-provider.js exists.
    pause
    exit /b 1
)

if not exist netlify.toml (
    echo WARNING: netlify.toml not found. Creating default configuration...
    (
        echo [build]
        echo   publish = "Dashboard"
        echo   command = "# no build command"
        echo.
        echo [[redirects]]
        echo   from = "/*"
        echo   to = "/index.html"
        echo   status = 200
    ) > netlify.toml
    echo Created default netlify.toml file.
)

echo.
echo Step 4: Creating screenshots directory...
mkdir Dashboard\screenshots 2>nul

echo.
echo ===================================================
echo Project is ready for Netlify deployment!
echo ===================================================
echo.
echo To deploy to Netlify:
echo 1. Create a GitHub repository and push this project
echo 2. Sign in to Netlify (netlify.com)
echo 3. Click "New site from Git"
echo 4. Connect to your GitHub repository
echo 5. Set publish directory to "Dashboard"
echo 6. Click "Deploy site"
echo.
echo.
echo Press any key to exit...
pause > nul
