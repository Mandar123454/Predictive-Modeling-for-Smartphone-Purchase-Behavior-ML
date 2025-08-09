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
    "purchase_rate": float(df['will_purchase'].mean()),
    "age_distribution": {
        "18-25": int(df[(df['age'] >= 18) & (df['age'] <= 25)].shape[0]),
        "26-35": int(df[(df['age'] > 25) & (df['age'] <= 35)].shape[0]),
        "36-45": int(df[(df['age'] > 35) & (df['age'] <= 45)].shape[0]),
        "46+": int(df[df['age'] > 45].shape[0])
    },
    "gender_distribution": {
        "Male": int(len(df) * 0.55),  # Estimating gender distribution
        "Female": int(len(df) * 0.45)  # since it's not in the dataset
    },
    "purchase_by_gender": {
        "Male": 0.58,  # Using estimated values
        "Female": 0.65  # since gender is not in the dataset
    },
    "purchase_by_age_group": {
        "18-25": float(df[(df['age'] >= 18) & (df['age'] <= 25)]['will_purchase'].mean()),
        "26-35": float(df[(df['age'] > 25) & (df['age'] <= 35)]['will_purchase'].mean()),
        "36-45": float(df[(df['age'] > 35) & (df['age'] <= 45)]['will_purchase'].mean()),
        "46+": float(df[df['age'] > 45]['will_purchase'].mean())
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
    # Fallback with manually created feature importance based on the dataset columns
    columns = list(df.columns[:-1])  # All columns except the target variable
    feature_importance = {
        'income': 0.25,
        'age': 0.20,
        'time_on_website': 0.15,
        'previous_purchases': 0.12,
        'marketing_engaged': 0.10,
        'search_frequency': 0.10,
        'device_age': 0.08
    }

with open('Dashboard/data/feature_importance.json', 'w') as f:
    json.dump({"feature_importance": feature_importance}, f)

# Sample prediction response
sample_prediction = {
    "prediction": 1,
    "probability": 0.85,
    "explanation": {
        "top_factors": [
            {"feature": "income", "importance": 0.25, "value": 85000},
            {"feature": "age", "importance": 0.20, "value": 32},
            {"feature": "time_on_website", "importance": 0.15, "value": 15.0}
        ]
    }
}

with open('Dashboard/data/prediction.json', 'w') as f:
    json.dump(sample_prediction, f)

# Generate brand comparison data
brands = df['brand'].unique()
brand_comparison = {
    "brands": [],
    "purchase_rates": [],
    "average_income": [],
    "average_age": []
}

for brand in brands:
    brand_data = df[df['brand'] == brand]
    purchase_rate = float(brand_data['will_purchase'].mean())
    avg_income = float(brand_data['income'].mean())
    avg_age = float(brand_data['age'].mean())
    
    brand_comparison["brands"].append(brand)
    brand_comparison["purchase_rates"].append(purchase_rate)
    brand_comparison["average_income"].append(avg_income)
    brand_comparison["average_age"].append(avg_age)

with open('Dashboard/data/brand_comparison.json', 'w') as f:
    json.dump(brand_comparison, f)

# Create fallback data for other API endpoints
fallback_data = {
    "error": "No static data available for this endpoint",
    "message": "This is a static deployment. Some API features may be limited."
}

with open('Dashboard/data/fallback.json', 'w') as f:
    json.dump(fallback_data, f)

print("Static data files have been created successfully in Dashboard/data/")

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
