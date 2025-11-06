# Deploying to Azure App Service (Linux)

This project contains a Flask API that serves the dashboard from the `Dashboard/` folder and provides prediction endpoints. The production entrypoint is `Dashboard/app.py` (exposes `app`).

## Prerequisites
- Azure subscription
- Azure CLI (2.60+)
- Python 3.10 or 3.11 locally (for testing)

## What we ship
- `Dashboard/app.py` exposes `app` (Flask) for WSGI
- `requirements.txt` now contains only runtime packages to keep Oryx builds fast and reliable
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

## App settings (recommended)
```powershell
# Example: turn on build during zip deploy (handy if using zip pushes)
az webapp config appsettings set --resource-group $rg --name $appName --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true

# For larger dependencies or slower cold starts you can increase timeout
az webapp config appsettings set --resource-group $rg --name $appName --settings WEBSITES_CONTAINER_START_TIME_LIMIT=1800
```

Other useful settings: set Python version to 3.11 in the Web App runtime, and keep `WEBSITE_RUN_FROM_PACKAGE=0` when using Oryx to build from source.

## Verify
```powershell
az webapp browse --resource-group $rg --name $appName
```

## Troubleshooting

- Build/Deploy failed in Deployment Center:
	- Ensure the Web App uses Linux, Runtime stack Python 3.11.
	- Keep `requirements.txt` minimal (runtime-only). Dev/test libs are in `dev-requirements.txt` and are not needed on Azure.
	- Re-run: `az webapp up --name $appName --resource-group $rg --runtime "PYTHON|3.11" --logs`
	- Open Deployment Center → Logs → Build/Deploy logs, and expand the latest record to see pip/oryx output.

- App starts but frontend shows “Failed to fetch”:
	- The frontend is already fixed to use same-origin API calls. After deploy, hard-refresh (Ctrl+F5) to bust cached `dashboard.js`.
	- First load after cold start can take ~10–20 seconds while the app warms up; the UI now waits longer and retries.


## Apply tags (recommended)

Tags help organize and cost-allocate your Azure resources. A tag is a key-value pair. Tag names (keys) are case-insensitive, tag values are case-sensitive.

Common tags to use:
- env = dev | test | prod
- project = smartpredict
- owner = your-name-or-alias
- costCenter = CC-1234
- dataSensitivity = internal | confidential

PowerShell-friendly Azure CLI examples:

```powershell
# Assumes you already set these earlier
$rg = "smartphone-rg"
$appName = "smartphone-purchase-12345"

# 1) Tag the Resource Group at creation (or update later)
az group create --name $rg --location centralindia --tags env=dev project=smartpredict owner=mandar
# Or update existing RG tags
az group update --name $rg --set tags.env=dev tags.project=smartpredict tags.owner=mandar

# 2) Tag the Web App
$webappId = az webapp show -n $appName -g $rg --query id -o tsv
az resource tag --ids $webappId --tags env=dev project=smartpredict owner=mandar

# 3) Tag the App Service Plan
$planName = az webapp show -n $appName -g $rg --query serverFarmId -o tsv | ForEach-Object { $_.Split('/')[-1] }
$planId = az appservice plan show -n $planName -g $rg --query id -o tsv
az resource tag --ids $planId --tags env=dev project=smartpredict owner=mandar costCenter=CC-1234

# 4) Show tags
az group show -n $rg --query tags
az resource show --ids $webappId --query tags

# 5) Remove a tag key (e.g., costCenter) from a resource
az resource update --ids $webappId --remove tags.costCenter
```

Notes:
- You can also set tags during portal creation under the “Tags” tab.
- `az webapp up` does not accept `--tags`, so tag the app after creation.
- For consistency, use the same tag set across the RG, plan, and web app.
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
