# Project Structure Documentation

## Overview

The Smartphone Purchase Prediction project consists of several components that work together to provide a complete solution for predicting smartphone purchases and visualizing the data.


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
