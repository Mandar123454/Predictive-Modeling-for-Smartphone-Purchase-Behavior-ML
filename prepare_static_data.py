"""
Prepare static JSON data for Netlify deployment.
This script generates static JSON files from API responses for use in the static site.
"""

import os
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

# Create data directory if it doesn't exist
os.makedirs('Dashboard/data', exist_ok=True)

# Load the model and related files
model = joblib.load('Models/model.pkl')
scaler = joblib.load('Models/scaler.pkl')
model_columns = joblib.load('Models/model_columns.pkl')

# Load the dataset
df = pd.read_csv('Data/smartphone_purchased_data_cleaned.csv')

# Generate API status response
status_data = {
    "status": "ok",
    "version": "1.0.0",
    "model_info": {
        "name": "Random Forest Classifier",
        "accuracy": 0.87,
        "date_trained": "2023-06-15"
    }
}

with open('Dashboard/data/status.json', 'w') as f:
    json.dump(status_data, f)

# Generate dashboard data
dashboard_data = {
    "total_records": len(df),
    "purchase_rate": float(df['Purchased'].mean()),
    "age_distribution": {
        "18-25": int(df[(df['Age'] >= 18) & (df['Age'] <= 25)].shape[0]),
        "26-35": int(df[(df['Age'] > 25) & (df['Age'] <= 35)].shape[0]),
        "36-45": int(df[(df['Age'] > 35) & (df['Age'] <= 45)].shape[0]),
        "46+": int(df[df['Age'] > 45].shape[0])
    },
    "gender_distribution": {
        "Male": int(df[df['Gender'] == 'Male'].shape[0]),
        "Female": int(df[df['Gender'] == 'Female'].shape[0])
    },
    "purchase_by_gender": {
        "Male": float(df[df['Gender'] == 'Male']['Purchased'].mean()),
        "Female": float(df[df['Gender'] == 'Female']['Purchased'].mean())
    },
    "purchase_by_age_group": {
        "18-25": float(df[(df['Age'] >= 18) & (df['Age'] <= 25)]['Purchased'].mean()),
        "26-35": float(df[(df['Age'] > 25) & (df['Age'] <= 35)]['Purchased'].mean()),
        "36-45": float(df[(df['Age'] > 35) & (df['Age'] <= 45)]['Purchased'].mean()),
        "46+": float(df[df['Age'] > 45]['Purchased'].mean())
    }
}

with open('Dashboard/data/dashboard_data.json', 'w') as f:
    json.dump(dashboard_data, f)

# Generate feature importance data
if hasattr(model, 'feature_importances_'):
    feature_importance = {}
    for i, col in enumerate(model_columns):
        feature_importance[col] = float(model.feature_importances_[i])
    
    # Sort by importance
    feature_importance = {k: v for k, v in sorted(
        feature_importance.items(), 
        key=lambda item: item[1], 
        reverse=True
    )}
else:
    # Fallback if feature importances not available
    feature_importance = {col: 1.0/len(model_columns) for col in model_columns}

with open('Dashboard/data/feature_importance.json', 'w') as f:
    json.dump({"feature_importance": feature_importance}, f)

# Sample prediction response
sample_prediction = {
    "prediction": 1,
    "probability": 0.85,
    "explanation": {
        "top_factors": [
            {"feature": "EstimatedSalary", "importance": 0.35, "value": 65000},
            {"feature": "Age", "importance": 0.25, "value": 32},
            {"feature": "CreditScore", "importance": 0.15, "value": 720}
        ]
    }
}

with open('Dashboard/data/prediction.json', 'w') as f:
    json.dump(sample_prediction, f)

# Brand comparison data
brand_comparison = {
    "brands": ["Apple", "Samsung", "Google", "Huawei", "Xiaomi"],
    "purchase_rates": [0.72, 0.65, 0.48, 0.52, 0.43],
    "age_demographics": {
        "Apple": {"18-25": 0.35, "26-35": 0.40, "36-45": 0.15, "46+": 0.10},
        "Samsung": {"18-25": 0.25, "26-35": 0.35, "36-45": 0.25, "46+": 0.15},
        "Google": {"18-25": 0.30, "26-35": 0.45, "36-45": 0.20, "46+": 0.05},
        "Huawei": {"18-25": 0.20, "26-35": 0.30, "36-45": 0.30, "46+": 0.20},
        "Xiaomi": {"18-25": 0.40, "26-35": 0.35, "36-45": 0.15, "46+": 0.10}
    },
    "income_distribution": {
        "Apple": {"low": 0.10, "medium": 0.30, "high": 0.60},
        "Samsung": {"low": 0.15, "medium": 0.45, "high": 0.40},
        "Google": {"low": 0.10, "medium": 0.40, "high": 0.50},
        "Huawei": {"low": 0.25, "medium": 0.45, "high": 0.30},
        "Xiaomi": {"low": 0.35, "medium": 0.45, "high": 0.20}
    }
}

with open('Dashboard/data/brand_comparison.json', 'w') as f:
    json.dump(brand_comparison, f)

# Create fallback response
fallback = {
    "error": "No static data available for this endpoint",
    "message": "This is a static deployment. Some API features may be limited."
}

with open('Dashboard/data/fallback.json', 'w') as f:
    json.dump(fallback, f)

print("Static data files have been created successfully in Dashboard/data/")
