# Deploying to Azure App Service (Linux)

This project contains a Flask API that serves the dashboard from the `Dashboard/` folder and provides prediction endpoints. The main entrypoint is `app.py` at the repository root.

## Prerequisites
- Azure subscription
- Azure CLI (2.60+)
- Python 3.10 or 3.11 locally (for testing)

## What we ship
- `app.py` exposes `app` (Flask) for WSGI
- `requirements.txt` includes `gunicorn` for production
- `Procfile` tells Azure to run: `gunicorn --bind=0.0.0.0:${PORT:-8000} app:app --workers 2 --timeout 120`
- Model artifacts live under `Models/` and are loaded at startup

## One-time Azure setup (PowerShell)
```powershell
# Login
az login

# Variables
$rg="smartphone-rg"
$loc="centralindia"  # choose your region
$appName="smartphone-purchase-$(Get-Random)"  # must be globally unique

# Resource group
az group create --name $rg --location $loc

# Create Web App on Linux using Python runtime (Oryx builds from source)
az webapp up --runtime "PYTHON|3.11" --sku B1 --name $appName --resource-group $rg --location $loc --logs
```

The command packages your current folder and deploys it. Oryx reads `requirements.txt` and `Procfile` and runs Gunicorn.

## Subsequent deployments
```powershell
# From the repo root
az webapp up --name $appName --resource-group $rg --logs
```

## App settings (optional)
```powershell
# Example: turn on build during zip deploy (handy if using zip pushes)
az webapp config appsettings set --resource-group $rg --name $appName --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

## Verify
```powershell
az webapp browse --resource-group $rg --name $appName
```

## Troubleshooting
- Check logs: `az webapp log tail --name $appName --resource-group $rg`
- If port issues arise, we already bind to `$PORT` in the `Procfile`.
- Ensure `Models/` and `Data/` are committed so they get deployed with the app.
