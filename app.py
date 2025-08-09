"""
Flask API for Smartphone Purchase Prediction Dashboard
"""

import os
import json
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib

app = Flask(__name__, static_folder='Dashboard')
CORS(app)  # Enable CORS for all routes

# Load the model and related files
model = joblib.load('Models/model.pkl')
scaler = joblib.load('Models/scaler.pkl')
model_columns = joblib.load('Models/model_columns.pkl')

# Load the dataset
df = pd.read_csv('Data/smartphone_purchased_data_cleaned.csv')

@app.route('/')
def index():
    """Serve the main dashboard page"""
    return send_from_directory('Dashboard', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files from the Dashboard folder"""
    return send_from_directory('Dashboard', path)

@app.route('/api/status')
def status():
    """Check if the API is running"""
    return jsonify({
        "status": "ok",
        "version": "1.0.0",
        "model_info": {
            "name": "Random Forest Classifier",
            "accuracy": 0.87,
            "date_trained": "2023-06-15"
        }
    })

@app.route('/api/dashboard_data')
def dashboard_data():
    """Get general dashboard statistics"""
    return jsonify({
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
    })

@app.route('/api/feature_importance')
def feature_importance():
    """Get model feature importance data"""
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
    
    return jsonify({"feature_importance": feature_importance})

@app.route('/api/predict', methods=['POST'])
def predict():
    """Get purchase prediction based on user data"""
    data = request.get_json()
    
    # Create a DataFrame with the input data
    input_data = pd.DataFrame([{
        'Age': data['Age'],
        'Gender': data['Gender'],
        'CreditScore': data['CreditScore'],
        'EstimatedSalary': data['EstimatedSalary']
    }])
    
    # One-hot encode categorical variables if needed
    if 'Gender' in input_data.columns:
        input_data['Gender'] = input_data['Gender'].map({'Male': 1, 'Female': 0})
    
    # Scale the features if needed
    if scaler:
        feature_names = input_data.columns
        input_data = pd.DataFrame(scaler.transform(input_data), columns=feature_names)
    
    # Make prediction
    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]
    
    # Get feature importance for this prediction
    top_factors = []
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        features_with_importance = list(zip(model_columns, importances))
        sorted_features = sorted(features_with_importance, key=lambda x: x[1], reverse=True)
        
        for feature, importance in sorted_features[:3]:
            top_factors.append({
                "feature": feature,
                "importance": float(importance),
                "value": float(data.get(feature, 0))
            })
    
    return jsonify({
        "prediction": int(prediction),
        "probability": float(probability),
        "explanation": {
            "top_factors": top_factors
        }
    })

@app.route('/api/compare_brands')
def compare_brands():
    """Get comparison data between smartphone brands"""
    # This is sample data since we might not have actual brand data
    return jsonify({
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
    })

if __name__ == '__main__':
    # Create static JSON data for Netlify deployment
    if not os.path.exists('Dashboard/data'):
        os.makedirs('Dashboard/data', exist_ok=True)
    
    # Run the app
    app.run(debug=True, port=5000)
