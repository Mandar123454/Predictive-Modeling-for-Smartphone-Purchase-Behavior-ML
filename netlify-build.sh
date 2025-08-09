#!/bin/bash

# This is a simple build script for Netlify that doesn't require Python
echo "Starting build process for Smartphone Purchase Prediction Dashboard"

# Explicitly indicate we're not using Python
echo "IMPORTANT: This is a static site deployment. No Python dependencies required."
echo "If you're seeing Python dependency installation errors, please check the Netlify settings:"
echo "- Ensure 'PYTHON_VERSION=off' is set in environment variables"
echo "- Ensure no automatic dependency detection is enabled"

# Create a ".nopython" file to indicate no Python needed
echo "Creating .nopython file to skip Python dependency installation"
touch .nopython

# Just echo the files we're publishing
echo "Files to be published from Dashboard directory:"
find Dashboard -type f | sort

echo "Build complete!"
