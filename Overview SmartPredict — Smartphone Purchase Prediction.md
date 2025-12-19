# SmartPredict — Smartphone Purchase Prediction

A production‑ready, interactive dashboard and Flask API that predict smartphone purchase intent, visualize demographic insights, compare brands, and explain feature influence. The system is designed to run locally or on cloud platforms (e.g., Azure App Service), with graceful fallbacks when models are unavailable.

- Entrypoint (local/cloud): [app.py](app.py)
- Frontend UI: [Dashboard/index.html](Dashboard/index.html)
- Launcher: [run_dashboard.py](run_dashboard.py)
- Documentation: [README.md](README.md), [USER_GUIDE.md](USER_GUIDE.md), [Project Report/DOCS.md](Project%20Report/DOCS.md), [AZURE_DEPLOY.md](AZURE_DEPLOY.md)

---

## 1) Project Overview

SmartPredict predicts whether a user will purchase a smartphone based on demographic and behavioral inputs, and provides:

- Real‑time purchase probability (0–100%) for a single profile
- Brand comparison across the same profile
- Demographic analyses (age, income, etc.)
- Feature importance and insights

Primary goals:
- Enable fast, explainable purchase intent predictions
- Provide an educational, end‑to‑end ML example (data → model → API → UI)
- Support local development and easy cloud deployment with robust fallbacks

---

## 2) Technologies & Dependencies

Backend and ML
- Flask + Flask‑CORS — REST API and static file serving; CORS for frontend access. See [app.py](app.py).
- scikit‑learn — Model training and inference (RandomForest pipeline).
- pandas, numpy — Data loading, cleaning, transformation.
- joblib — Model/scaler/columns persistence (load from [Models/](Models/)).

Frontend
- HTML/CSS/JavaScript — UI and interactivity. See [Dashboard/index.html](Dashboard/index.html).
- Chart.js — Charts and visualizations.
- Bootstrap — Layout and components (styles in Dashboard/css).
- Custom JS — App logic, API calls, and UI updates:
  - Runtime API routing, local/static fallback: [Dashboard/js/main.js](Dashboard/js/main.js)
  - Charts, prediction logic, comparison tools: [Dashboard/js/dashboard.js](Dashboard/js/dashboard.js)

Operations
- Gunicorn — Production WSGI server (Procfile). See [Procfile](Procfile).
- Azure App Service — Optional deployment target. See [AZURE_DEPLOY.md](AZURE_DEPLOY.md).
- Jupyter — Notebooks for analysis and model development (see [Notebook/](Notebook/)).

Environment
- Python 3.11 recommended (3.10–3.12 supported; 3.13 may need compatible wheels).
- Dependencies pinned in [requirements.txt](requirements.txt).

---

## 3) Architecture & File Structure

High‑level components
- API (Flask): Serves JSON endpoints under /api and static Dashboard UI.
- Frontend (Static): Calls API for dynamic data; can run in demo/static mode if API is unreachable.
- ML Artifacts: Model, scaler, and column index loaded at runtime when present.
- Data: CSV(s) for baseline stats; can be synthesized/cleaned as needed.

Key paths
- API and server
  - Root Flask app: [app.py](app.py)
- Frontend
  - UI: [Dashboard/index.html](Dashboard/index.html)
  - Logic: [Dashboard/js/main.js](Dashboard/js/main.js), [Dashboard/js/dashboard.js](Dashboard/js/dashboard.js)
- Data and models
  - Data CSVs: [Data/](Data/)
  - Models: [Models/](Models/) (model.pkl, scaler.pkl, model_columns.pkl)
- Launchers & deployment
  - Cross‑platform launcher: [run_dashboard.py](run_dashboard.py)
  - Azure guide: [AZURE_DEPLOY.md](AZURE_DEPLOY.md)
  - Procfile/runtime: [Procfile](Procfile), [runtime.txt](runtime.txt)
- Documentation
  - Main readme: [README.md](README.md)
  - User guide: [USER_GUIDE.md](USER_GUIDE.md)
  - Technical docs: [Project Report/DOCS.md](Project%20Report/DOCS.md)
  - Notebooks: [Notebook/Notebook.ipynb](Notebook/Notebook.ipynb), [Notebook/exploratory_analysis.ipynb](Notebook/exploratory_analysis.ipynb), [Notebook/feature_influence_analysis.ipynb](Notebook/feature_influence_analysis.ipynb)

Interaction flow
- Browser requests Dashboard UI (HTML/CSS/JS) from Flask.
- Frontend JS decides API base URL:
  - Normal: /api (Flask)
  - Static/demo: ./data (local JSON fallback) — see [Dashboard/js/main.js](Dashboard/js/main.js)
- Frontend fetches metrics, importance, and predictions from API or static JSON.
- API loads data and model artifacts, processes features, and returns results.

---

## 4) Core Logic & Workflow

Initialization
1. Launch via [run_dashboard.py](run_dashboard.py) or `python app.py`.
2. Flask starts with CORS, serves static Dashboard, and exposes API routes in [app.py](app.py).
3. On startup, the API attempts to load:
   - Model: Models/model.pkl
   - Scaler: Models/scaler.pkl
   - Expected columns: Models/model_columns.pkl
   - Dataset: Data/smartphone_purchased_data_cleaned.csv

Routing and data flow
- Frontend load
  - Serve index and assets: [Dashboard/index.html](Dashboard/index.html)
  - Initialize UI, set API base URL: [Dashboard/js/main.js](Dashboard/js/main.js)
- API endpoints (documented in [README.md](README.md))
  - GET /api/status — Health; model/data availability
  - GET /api/data or /api/dashboard_data — KPI and distributions (naming per version)
  - GET /api/feature_importance — Model feature importance (brand one‑hot filtered; see [USER_GUIDE.md](USER_GUIDE.md))
  - POST /api/predict — Predict purchase probability for a single profile
  - POST /api/compare_brands — Probability per brand for same profile
  - GET /api/segment_analysis — Segment summaries (age, income, brand)
- Prediction path
  - Frontend collects inputs from Prediction Tool UI
  - POST to /api/predict with JSON
  - API encodes/aligns columns, scales features, calls model.predict_proba
  - Returns:
    - prediction (0/1)
    - probability (0–1)
    - explanation (top factors) when available
  - Frontend renders probability, textual result, and factors; fallback logic may fabricate probability if API is unreachable (see [Dashboard/js/dashboard.js](Dashboard/js/dashboard.js))

Resilience and demo mode
- If model/scaler/columns are missing, API returns errors for prediction endpoints, but status/data/feature importance still work from dataset.
- If API is unreachable (e.g., served statically), the frontend switches to local JSON or synthetic fallbacks (see [Dashboard/js/main.js](Dashboard/js/main.js)).

---

## 5) Setup & Usage

Prerequisites
- Python 3.11 recommended (3.10–3.12 supported)
- pip installed and network access for first dependency install

Quick start (recommended)
```bash
# From project root
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# Linux/Mac
source .venv/bin/activate

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Start (cross‑platform launcher)
python run_dashboard.py
```

Manual start
```bash
# From project root (after venv + install)
python app.py
# Open http://localhost:5000
```

Model artifacts (enable real predictions)
```
Models/
  model.pkl
  scaler.pkl
  model_columns.pkl
```

Data files
- Preferred cleaned dataset: Data/smartphone_purchased_data_cleaned.csv

Azure deployment
- Production server: Gunicorn via [Procfile](Procfile)
- Guide: [AZURE_DEPLOY.md](AZURE_DEPLOY.md)

Example API usage (from [README.md](README.md))
```python
import requests
r = requests.post('http://localhost:5000/api/predict', json={
    'age': 28,
    'income': 65000,
    'time_on_website': 18,
    'previous_purchases': 1,
    'marketing_engaged': 1,
    'search_frequency': 8,
    'device_age': 2.0,
    'brand': 'Samsung'
})
print(r.json())
```

Troubleshooting (see [README.md](README.md) and [USER_GUIDE.md](USER_GUIDE.md))
- Install issues: reinstall deps via `pip install -r requirements.txt`
- Port in use: change port or free port 5000
- Charts empty: hard refresh or incognito window
- Predictions disabled: ensure model/scaler/columns in [Models/](Models/)

---

## 6) Improvement Suggestions

Performance
- Add response caching for aggregate endpoints (status/data/segments).
- Precompute and persist dashboard aggregates on startup.
- Enable gzip/ Brotli compression for static assets; set long‑lived cache headers.

Scalability
- Containerize (Dockerfile) and add CI/CD; run Gunicorn with multi‑workers, tune based on CPU.
- Introduce a real database for datasets (e.g., Postgres) if data scales beyond CSV.
- Add request rate limiting and API keys if exposing publicly.

Reliability & Ops
- Structured logging (JSON) and centralized log shipping.
- Health/metrics endpoint (Prometheus‑friendly) and alerts.
- Graceful model hot‑reload with versioning and artifact integrity checks.

Code quality & maintainability
- Pydantic (or dataclasses + validators) for request schemas in /api/predict and /api/compare_brands.
- Type hints across Python; mypy/ruff pre‑commit hooks.
- Split server into packages (api/, services/, utils/) if the root [app.py](app.py) grows.
- Unit tests for preprocessing, encoding, and endpoint behavior; minimal integration tests.
- Frontend: ES module structure, linting, and bundling (Vite/Rollup) for smaller assets.

UX & analytics
- Inline SHAP/feature attribution per prediction when model supports it.
- Download/report export for brand comparisons and predictions.
- Persistent user settings (theme, last inputs) via localStorage.

Security
- Input sanitation and stricter CORS in production.
- Secrets/config via environment variables; avoid hard‑coding.
- Dependency scanning and scheduled updates.

---

## 7) Author & License

- Author: Mandar123454 (from repository metadata)
- License: MIT — see [LICENSE](LICENSE)

If publishing elsewhere, replace with your preferred author/contact details.