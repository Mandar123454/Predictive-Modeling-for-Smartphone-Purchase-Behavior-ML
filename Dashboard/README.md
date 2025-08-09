# Smartphone Purchase Behavior Dashboard

This dashboard provides an interactive interface for analyzing and predicting smartphone purchase behavior based on user demographics and browsing patterns.

## Project Structure

```
Dashboard/
│
├── css/
│   └── styles.css            # Dashboard styling
│
├── js/
│   └── dashboard.js          # Dashboard functionality
│
├── assets/                   # Images and other static assets
│
├── app.py                    # Flask API for serving data and predictions
│
└── index.html                # Main dashboard HTML
```

## Features

1. **Overview Section**
   - Key performance indicators
   - Purchase distribution
   - Brand distribution

2. **Demographics Section**
   - Age and income distribution
   - Feature correlation heatmap

3. **Prediction Tool**
   - Interactive form for inputting user data
   - Real-time prediction of purchase probability
   - Visual representation of results

4. **Brand Comparison**
   - Compare purchase probability across different brands
   - Ranking of brands based on likelihood of purchase
   - Visual comparison chart

5. **Model Insights**
   - Feature importance visualization
   - Key findings and insights


## Data Sources

The dashboard uses data from the following files:
- `Data/smartphone_purchased_data_cleaned.csv` - Cleaned dataset
- `Models/model.pkl` - Trained prediction model
- `Models/scaler.pkl` - Feature scaler
- `Models/model_columns.pkl` - Model column names

## Model Information

The dashboard uses a machine learning model to predict smartphone purchase behavior based on:
- Age
- Income
- Time spent on website
- Previous purchases
- Marketing engagement
- Search frequency
- Device age
- Brand preference

## Dashboard Navigation

- Use the sidebar to navigate between different sections
- Interactive elements allow for real-time data exploration
- Prediction tools provide immediate feedback

## Created for

This dashboard is part of the "Predictive Modeling for Smartphone Purchase Behavior" project.
