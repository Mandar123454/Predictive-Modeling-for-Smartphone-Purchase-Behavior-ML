# SmartPredict — One-File Project Overview

This is the simplest, complete overview of your project in one place. It explains what it does, how it works, how to run it, and what to say in interviews.

## What It Does
- Predicts whether a user will purchase a smartphone using demographic and behavior data.
- Shows interactive charts and insights in a web dashboard.
- Lets you compare purchase probability across brands for the same user profile.

## How It’s Built
- Backend: Flask API with CORS in `Dashboard/api/app.py` and `Dashboard/api/routes.py`.
- Frontend: Static `Dashboard/index.html` with CSS/JS for charts (Chart.js/Plotly/D3).
- ML Artifacts: `Models/model.pkl`, `Models/scaler.pkl`, `Models/model_columns.pkl`.
- Data: CSVs in `Data/` (original, cleaned, updated). If missing, API creates a synthetic dataset and saves `Data/smartphone_purchased_data_cleaned.csv`.
- Runners: Cross‑platform launcher `run_dashboard.py`; Windows PowerShell script `Dashboard/run_dashboard.ps1`.

## Files & Folders You’ll Use
- `Dashboard/app.py`: Starts the dashboard server (uses the API package).
- `Dashboard/api/__init__.py`: Registers the API at the `/api` prefix.
- `Dashboard/api/app.py`: App factory. Loads model/scaler/columns, loads or synthesizes dataset, registers routes, serves static files.
- `Dashboard/api/routes.py`: Real endpoints that the frontend calls.
- `Models/`: Stores trained model, scaler, and expected input columns.
- `Data/`: Stores the CSVs. Cleaned CSV is saved back here.
- `run_dashboard.py`: One‑click launcher that installs deps and opens the browser.

## How The API Works
All endpoints are under the `/api` prefix.

- `GET /api/status`: Health check. Shows whether data/model are loaded.
- `GET /api/data`: Basic dataset stats: purchase rate, age/income groups, brand distribution, engagement.
- `GET /api/feature_importance`: Feature importance from the model (falls back to synthetic if unavailable).
- `POST /api/predict`: Returns purchase prediction and probability for a single user.
  - Required JSON fields: `age`, `income`, `time_on_website`, `previous_purchases`, `marketing_engaged`, `search_frequency`, `device_age`, `brand`.
- `POST /api/compare_brands`: Given one profile and a list of brands, returns probabilities for each brand.
- `GET /api/segment_analysis`: Segment summaries by age, income, and brand.

Example request for prediction:

```python
import requests

payload = {
    "age": 28,
    "income": 65000,
    "time_on_website": 18,
    "previous_purchases": 1,
    "marketing_engaged": 1,   # 1=yes, 0=no
    "search_frequency": 8,
    "device_age": 2.0,
    "brand": "Samsung"
}

r = requests.post("http://localhost:5000/api/predict", json=payload)
print(r.json())
```

Notes:
- If model/scaler/columns are missing, `/api/predict` and `/api/compare_brands` return an error. The rest (status/data/segments/feature importance) still work thanks to dataset fallback.
- The API one‑hot encodes `brand`, reindexes to `model_columns`, then scales with `scaler` before predicting.

## Running Locally

Windows PowerShell (your current environment):

```powershell
# From the repo root
python run_dashboard.py

# Or use the dashboard script directly
cd "Dashboard"
./run_dashboard.ps1
```

macOS/Linux:

```bash
python3 run_dashboard.py

# Or manual
cd Dashboard
python3 app.py
```

Open your browser at `http://localhost:5000`.

## Ops & Deployment

- Single virtual environment at repo root (`.venv`); avoid nested venvs.
- Production server: Gunicorn via `Procfile` (binds `$PORT`).
- Azure App Service (Linux): Use the guide in `AZURE_DEPLOY.md` for `az webapp up` flow; entrypoint is root `app.py` exposing `app`.

## UI/UX Notes (Latest)

- Colorful gradient scrollbars and caret; respects prefers-reduced-motion.
- Subtle gradient cursor trail on desktop; disabled on touch devices.
- Responsive layout with improved contrast for accessibility.

## Data & Models
- Data files: `Data/smartphone_purchased_data.csv` (original), `Data/smartphone_purchased_data_cleaned.csv` (cleaned/generated), `Data/smartphone_purchased_data_updated.csv` (optional enhanced).
- If a CSV is missing or has different column names, the API renames what it can and synthesizes any missing columns, then saves a cleaned CSV back to `Data/`.
- Model files: `Models/model.pkl`, `Models/scaler.pkl`, `Models/model_columns.pkl`. When present, predictions are enabled; when missing, the dashboard still runs in an analysis/demo mode.

## Simple Data Flow (Words)
- Browser loads `Dashboard/index.html` → calls Flask endpoints under `/api`.
- Flask (`Dashboard/api/app.py`) loads model/scaler/columns if available → loads data or synthesizes it.
- Endpoints in `Dashboard/api/routes.py` compute stats or scale/encode and call the model.
- Frontend plots charts and shows probabilities from the responses.

## What To Say In Interviews (Cheat‑Sheet)
- Problem: Predict smartphone purchase intent and explain the drivers.
- Data: ~10k rows; demographics + behavior; cleaned and standardized in the app.
- Model: scikit‑learn RandomForest; StandardScaler; one‑hot brand; persisted artifacts.
- API: Flask blueprint under `/api` with endpoints for status, stats, importance, predict, brand compare, and segments.
- Frontend: HTML/CSS/JS with Chart.js/Plotly for interactive charts; responsive layout.
- Reliability: If data is missing, API synthesizes a dataset so the dashboard still loads. Predictions require model files.
- Ops: `run_dashboard.py` installs deps, launches server, and opens the browser.

## Quick Troubleshooting
- “Model not loaded” on predict: Put `model.pkl`, `scaler.pkl`, `model_columns.pkl` in `Models/`.
- Charts empty: Refresh once; ensure API at `http://localhost:5000` is reachable.
- Port in use: Change port in `Dashboard/api/app.py` or stop the other process.
- Missing CSVs: The API will create a synthetic dataset and save a cleaned CSV.

## At‑a‑Glance Facts
- Typical accuracy ~87% on held‑out test data (from notebooks).
- Core features: age, income, engagement, site time, purchase history, brand.
- Endpoints you will mention: `/api/status`, `/api/data`, `/api/feature_importance`, `/api/predict`, `/api/compare_brands`, `/api/segment_analysis`.
