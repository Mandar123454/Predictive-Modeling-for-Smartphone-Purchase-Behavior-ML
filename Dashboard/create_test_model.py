import os
import pickle
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

print("Creating test model files for the dashboard...")

# Create a simple mock dataset
n = 500
np.random.seed(42)

# Create features
data = {
    'age': np.random.randint(18, 65, n),
    'income': np.random.randint(10000, 150000, n),
    'time_on_website': np.random.normal(20, 10, n),
    'previous_purchases': np.random.poisson(1.5, n),
    'marketing_engaged': np.random.choice([0, 1], n),
    'search_frequency': np.random.randint(0, 20, n),
    'device_age': np.random.normal(2.5, 1.0, n),
    'brand': np.random.choice(['iPhone', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo', 'Nothing', 'Google Pixel'], n)
}

# Create target
purchase_probability = (
    (data['income'] > 40000).astype(int) * 0.2 +
    (data['time_on_website'] > 15).astype(int) * 0.3 +
    (data['previous_purchases'] > 0).astype(int) * 0.2 +
    data['marketing_engaged'] * 0.2 +
    (data['search_frequency'] > 5).astype(int) * 0.1 +
    (data['device_age'] > 2).astype(int) * 0.1
)
purchase_probability = np.clip(purchase_probability, 0, 1)
will_purchase = (np.random.rand(n) < purchase_probability).astype(int)

# Create DataFrame
df = pd.DataFrame(data)
df['will_purchase'] = will_purchase

# Save the DataFrame
os.makedirs('../Data', exist_ok=True)
csv_path = '../Data/smartphone_purchased_data_cleaned.csv'
df.to_csv(csv_path, index=False)
print(f"✅ Saved mock dataset to {csv_path}")

# Prepare data for model
X = df.drop('will_purchase', axis=1)
y = df['will_purchase']

# One-hot encode categorical features
X_encoded = pd.get_dummies(X, columns=['brand'], drop_first=True)
columns_for_model = X_encoded.columns

# Scale the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_encoded)

# Train a simple model
model = LogisticRegression()
model.fit(X_scaled, y)
print("✅ Model trained successfully")

# Save model files
os.makedirs('../Models', exist_ok=True)
with open('../Models/model.pkl', 'wb') as f:
    pickle.dump(model, f)
print("✅ Saved model to ../Models/model.pkl")

with open('../Models/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
print("✅ Saved scaler to ../Models/scaler.pkl")

with open('../Models/model_columns.pkl', 'wb') as f:
    pickle.dump(columns_for_model, f)
print("✅ Saved columns to ../Models/model_columns.pkl")

print("✅ All test model files created successfully")
