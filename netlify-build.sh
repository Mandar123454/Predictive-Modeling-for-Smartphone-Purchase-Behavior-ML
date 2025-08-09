#!/bin/bash

# This is a simple build script for Netlify that doesn't require Python
echo "Starting build process for Smartphone Purchase Prediction Dashboard"

# Just echo the files we're publishing
echo "Files to be published:"
find Dashboard -type f | sort

echo "Build complete!"
