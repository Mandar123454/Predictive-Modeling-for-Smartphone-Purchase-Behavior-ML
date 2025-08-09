# GitHub Pages Deployment Guide

## Step 1: Prepare your repository
1. Make sure your repository is pushed to GitHub
2. Ensure all necessary files are in the Dashboard directory

## Step 2: Configure GitHub Pages
1. Go to your repository on GitHub
2. Navigate to Settings > Pages
3. Under "Source", select "Deploy from a branch"
4. Select the branch you want to deploy (usually "main" or "master")
5. Set the folder to "/Dashboard" (since your dashboard files are in this folder)
6. Click "Save"

## Step 3: Wait for Deployment
1. GitHub will automatically build and deploy your site
2. You'll see a message that your site is being built
3. After a few minutes, you'll get a link to your published site
4. The URL will be in the format: https://[username].github.io/[repository-name]

## Step 4: Verify Deployment
1. Visit your published site
2. Make sure all features are working correctly
3. Check that all charts and data are displaying properly

## Troubleshooting
If you encounter any issues:
1. Check that all resources are loading correctly using browser developer tools
2. Ensure paths in your HTML/JS files are relative, not absolute
3. Look for any 404 errors in the browser console

## Updates and Maintenance
To update your deployed site:
1. Make changes to your local files
2. Commit and push to GitHub
3. GitHub Pages will automatically rebuild and redeploy your site
