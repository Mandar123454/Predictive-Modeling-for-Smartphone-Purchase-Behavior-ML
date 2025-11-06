# Deploying to Azure App Service (Linux)

This project contains a Flask API that serves the dashboard from the `Dashboard/` folder and provides prediction endpoints. The production entrypoint is `Dashboard/app.py` (exposes `app`).

## Prerequisites
- Azure subscription
- Azure CLI (2.60+)
- Python 3.10 or 3.11 locally (for testing)

## What we ship
- `Dashboard/app.py` exposes `app` (Flask) for WSGI
- `requirements.txt` includes `gunicorn` for production
- `Procfile` runs from the Dashboard folder: `web: gunicorn --chdir Dashboard --bind=0.0.0.0:${PORT:-8000} app:app --workers 2 --timeout 120`
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

The command packages your current folder and deploys it. Oryx reads `requirements.txt` and the `Procfile` and runs Gunicorn from the `Dashboard/` directory, serving both API and UI.

## Subsequent deployments
```powershell
# From the repo root
az webapp up --name $appName --resource-group $rg --logs
```

## App settings (optional)
```powershell
# Example: turn on build during zip deploy (handy if using zip pushes)
az webapp config appsettings set --resource-group $rg --name $appName --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true

# For larger dependencies or slower cold starts you can increase timeout
az webapp config appsettings set --resource-group $rg --name $appName --settings WEBSITES_CONTAINER_START_TIME_LIMIT=1800
```

## Verify
```powershell
az webapp browse --resource-group $rg --name $appName
```

## Troubleshooting
- Check logs: `az webapp log tail --name $appName --resource-group $rg`
- If port issues arise, we already bind to `$PORT` in the `Procfile`.
- Ensure `Models/` and `Data/` are committed so they get deployed with the app.
- If build fails due to wheels on Python 3.13, target runtime `PYTHON|3.11` as above.
- If you see ModuleNotFoundError for `dash` or `plotly`, verify `requirements.txt` installed (Oryx output) and that your deployment included the root files.

## What to create in the Azure Portal (if using the UI)
You can deploy fully via CLI (recommended). If you prefer the Portal, create:

1) Resource Group: Name = `$rg` (e.g., smartphone-rg), Region = your choice (e.g., Central India)
2) App Service Plan: Linux, Basic (B1) or Free (F1 for testing), Region = same as RG
3) Web App: Runtime stack = Python 3.11, Linux, link it to the App Service Plan
4) Deployment: Use “Local Git/Zip Deploy” or “GitHub Actions”
	- For Local Git/Zip: Enable build during deploy: `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
	- Ensure your repo includes `requirements.txt` and `Procfile`
5) Configuration → General settings → AlwaysOn (optional on Basic+)
6) Restart Web App after first deploy
