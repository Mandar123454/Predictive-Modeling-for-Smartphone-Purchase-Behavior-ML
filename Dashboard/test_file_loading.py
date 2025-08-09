import os
import sys
import pickle
import pandas as pd

def check_file(file_path):
    """Check if a file exists and return its absolute path"""
    print(f"Checking file: {file_path}")
    if os.path.exists(file_path):
        abs_path = os.path.abspath(file_path)
        print(f"✅ File exists at: {abs_path}")
        return True
    else:
        print(f"❌ File not found: {file_path}")
        # Try with e: prefix
        alt_path = 'e:/' + file_path.lstrip('./')
        if os.path.exists(alt_path):
            print(f"✅ File exists at alternate path: {alt_path}")
            return True
        print(f"❌ File not found at alternate path: {alt_path}")
        return False

def try_load_pickle(file_path):
    """Try to load a pickle file"""
    if check_file(file_path):
        try:
            with open(file_path, 'rb') as f:
                data = pickle.load(f)
            print(f"✅ Successfully loaded pickle from: {file_path}")
            print(f"Object type: {type(data)}")
            return True
        except Exception as e:
            print(f"❌ Error loading pickle file: {e}")
            return False
    return False

def try_load_csv(file_path):
    """Try to load a CSV file"""
    if check_file(file_path):
        try:
            df = pd.read_csv(file_path)
            print(f"✅ Successfully loaded CSV from: {file_path}")
            print(f"DataFrame shape: {df.shape}")
            print(f"DataFrame columns: {df.columns.tolist()}")
            print(f"First few rows:")
            print(df.head())
            return True
        except Exception as e:
            print(f"❌ Error loading CSV file: {e}")
            return False
    return False

print("\n===== CHECKING FILES =====")
print(f"Current working directory: {os.getcwd()}")

model_paths = [
    '../Models/model.pkl',
    'e:/ml/Models/model.pkl',
    './Models/model.pkl'
]

scaler_paths = [
    '../Models/scaler.pkl',
    'e:/ml/Models/scaler.pkl',
    './Models/scaler.pkl'
]

columns_paths = [
    '../Models/model_columns.pkl',
    'e:/ml/Models/model_columns.pkl',
    './Models/model_columns.pkl'
]

data_paths = [
    '../Data/smartphone_purchased_data.csv',
    '../Data/smartphone_purchased_data_cleaned.csv',
    '../Data/smartphone_purchased_data_updated.csv',
    'e:/ml/Data/smartphone_purchased_data.csv',
    'e:/ml/Data/smartphone_purchased_data_cleaned.csv',
    './Data/smartphone_purchased_data.csv'
]

print("\n===== CHECKING MODEL FILES =====")
for path in model_paths:
    if try_load_pickle(path):
        break

print("\n===== CHECKING SCALER FILES =====")
for path in scaler_paths:
    if try_load_pickle(path):
        break

print("\n===== CHECKING COLUMNS FILES =====")
for path in columns_paths:
    if try_load_pickle(path):
        break

print("\n===== CHECKING DATA FILES =====")
for path in data_paths:
    if try_load_csv(path):
        break

print("\n===== TEST COMPLETE =====")
