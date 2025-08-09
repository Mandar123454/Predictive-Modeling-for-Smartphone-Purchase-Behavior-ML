#!/bin/bash

echo "==================================================="
echo "Preparing Smartphone Dashboard for Netlify Deployment"
echo "==================================================="
echo

echo "Step 1: Creating data directory..."
mkdir -p Dashboard/data
echo "Created Dashboard/data directory."

echo
echo "Step 2: Generating static JSON data..."
python prepare_static_data.py
if [ $? -ne 0 ]; then
    echo "Error generating static data. Please check the error message above."
    exit 1
fi

echo
echo "Step 3: Verifying project structure..."
if [ ! -f Dashboard/index.html ]; then
    echo "ERROR: index.html not found in Dashboard directory."
    echo "Please ensure your Dashboard/index.html file exists."
    exit 1
fi

if [ ! -f Dashboard/js/static-data-provider.js ]; then
    echo "ERROR: static-data-provider.js not found."
    echo "Please ensure Dashboard/js/static-data-provider.js exists."
    exit 1
fi

if [ ! -f netlify.toml ]; then
    echo "WARNING: netlify.toml not found. Creating default configuration..."
    cat > netlify.toml << EOL
[build]
  publish = "Dashboard"
  command = "# no build command"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOL
    echo "Created default netlify.toml file."
fi

echo
echo "Step 4: Creating screenshots directory..."
mkdir -p Dashboard/screenshots

echo
echo "==================================================="
echo "Project is ready for Netlify deployment!"
echo "==================================================="
echo
echo "To deploy to Netlify:"
echo "1. Create a GitHub repository and push this project"
echo "2. Sign in to Netlify (netlify.com)"
echo "3. Click \"New site from Git\""
echo "4. Connect to your GitHub repository"
echo "5. Set publish directory to \"Dashboard\""
echo "6. Click \"Deploy site\""
echo
