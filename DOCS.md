# Project Structure Documentation

## Overview

The Smartphone Purchase Prediction project consists of several components that work together to provide a complete solution for predicting smartphone purchases and visualizing the data.

## Directory Structure

```
├── Dashboard/           # Frontend web application
│   ├── css/             # Stylesheets
│   │   └── styles.css   # Main stylesheet
│   ├── js/              # JavaScript files
│   │   ├── main.js      # Dashboard functionality
│   │   └── static-data-provider.js  # For Netlify deployment
│   ├── data/            # Static JSON data for Netlify deployment
│   │   ├── status.json
│   │   ├── dashboard_data.json
│   │   ├── feature_importance.json
│   │   ├── prediction.json
│   │   ├── brand_comparison.json
│   │   └── fallback.json
│   ├── index.html       # Main dashboard page
│   └── README.md        # Dashboard-specific documentation
├── Data/                # Dataset files
│   ├── smartphone_purchased_data.csv        # Original dataset
│   ├── smartphone_purchased_data_cleaned.csv # Cleaned dataset
│   └── smartphone_purchased_data_updated.csv # Updated dataset with additional features
│   ├── X_test.csv       # Test dataset features
│   └── X_test_scaled.csv # Scaled test dataset features
├── Models/              # Trained machine learning models
│   ├── model.pkl        # Main prediction model
│   ├── scaler.pkl       # Feature scaler
│   └── model_columns.pkl # Column names for model input
├── Notebook/            # Jupyter notebooks for analysis and model development
│   ├── exploratory_analysis.ipynb  # Data exploration
│   ├── Main Notebook.ipynb         # Model training and evaluation
│   └── Notebook.ipynb              # Additional analysis
├── app.py              # Flask application serving the API
├── netlify.toml        # Netlify configuration file
├── prepare_static_data.py  # Script to generate static JSON for Netlify
├── requirements.txt    # Python dependencies
├── README.md           # Main project documentation
└── run_dashboard.bat   # Script to run the dashboard locally (Windows)
```

## Component Descriptions

### Data Files

- **smartphone_purchased_data.csv**: The original dataset containing customer demographic information and purchase history.
- **smartphone_purchased_data_cleaned.csv**: The dataset after cleaning, with missing values handled and outliers removed.
- **smartphone_purchased_data_updated.csv**: Dataset with additional engineered features for improved model performance.

### Models

- **model.pkl**: The trained Logistic Regression model used for predictions.
- **scaler.pkl**: StandardScaler object used to normalize numerical features.
- **model_columns.pkl**: List of column names that the model expects as input.

### Notebooks

- **exploratory_analysis.ipynb**: Initial data exploration, visualization, and insights.
- **Main Notebook.ipynb**: The main workflow for model development, including:
  - Data preprocessing
  - Feature engineering
  - Model training
  - Hyperparameter tuning
  - Evaluation metrics

### Dashboard

- **index.html**: The main entry point for the dashboard.
- **styles.css**: Custom styling for the dashboard.
- **main.js**: JavaScript code that powers the interactive dashboard.
- **static-data-provider.js**: Script that enables the dashboard to work with static JSON data when deployed on Netlify.

### API

- **app.py**: Flask application that serves as the backend API for the dashboard.
  - GET `/api/status`: API status information
  - GET `/api/dashboard_data`: Overall dashboard statistics
  - GET `/api/feature_importance`: Model feature importance data
  - POST `/api/predict`: Prediction endpoint
  - GET `/api/compare_brands`: Brand comparison data

### Deployment

- **netlify.toml**: Configuration for Netlify deployment.
- **prepare_static_data.py**: Script to generate static JSON files from API responses.
- **requirements.txt**: List of Python dependencies for the project.
- **run_dashboard.bat**: Batch script to run the dashboard locally on Windows.

## Data Flow

1. Raw data is processed and analyzed in Jupyter notebooks
2. A machine learning model is trained and saved as a pickle file
3. The Flask API loads the model to serve predictions
4. The dashboard frontend visualizes data and allows users to make predictions
5. For Netlify deployment, static JSON files replicate API responses

## Dependencies

### Python Dependencies
- flask==2.2.3
- numpy==1.24.2
- pandas==1.5.3
- scikit-learn==1.2.2
- matplotlib==3.7.1
- seaborn==0.12.2
- joblib==1.2.0
- flask-cors==3.0.10

### Frontend Dependencies
- Bootstrap 5.1.3
- Chart.js 3.7.1
- D3.js 7
