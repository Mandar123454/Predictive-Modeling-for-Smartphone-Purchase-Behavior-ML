import os
import sys
import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import traceback
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('dashboard_api.log')
    ]
)
logger = logging.getLogger('dashboard_api')

# Improved function to find and validate files
def find_file(base_path, alternatives=None):
    """Find a file checking multiple possible locations."""
    if alternatives is None:
        alternatives = []
    
    # First check if the base path exists
    if os.path.exists(base_path):
        logger.info(f"File found at: {base_path}")
        return base_path
    
    # Try absolute path
    abs_path = os.path.abspath(base_path)
    if os.path.exists(abs_path) and abs_path != base_path:
        logger.info(f"File found at absolute path: {abs_path}")
        return abs_path
    
    # Try each alternative
    for alt_path in alternatives:
        if os.path.exists(alt_path):
            logger.info(f"File found at alternative path: {alt_path}")
            return alt_path
    
    # If we get here, the file wasn't found
    logger.warning(f"File not found: {base_path} or alternatives")
    return None

app = Flask(__name__, static_folder='./static', template_folder='./')
CORS(app)

logger.info("Starting Smartphone Purchase Prediction Dashboard API")
logger.info(f"Current working directory: {os.getcwd()}")

# Define path options for model files
model_path = '../Models/model.pkl'
scaler_path = '../Models/scaler.pkl'
columns_path = '../Models/model_columns.pkl'

# Alternative paths to try
alt_model_paths = [
    'e:/ml/Models/model.pkl',
    './Models/model.pkl',
    '../../Models/model.pkl'
]
alt_scaler_paths = [
    'e:/ml/Models/scaler.pkl',
    './Models/scaler.pkl',
    '../../Models/scaler.pkl'
]
alt_columns_paths = [
    'e:/ml/Models/model_columns.pkl',
    './Models/model_columns.pkl',
    '../../Models/model_columns.pkl'
]

# Load model files with improved error handling
model = None
scaler = None
model_columns = None

logger.info("Attempting to load model files...")

# Find the model file
found_model_path = find_file(model_path, alt_model_paths)
found_scaler_path = find_file(scaler_path, alt_scaler_paths)
found_columns_path = find_file(columns_path, alt_columns_paths)

# Load the files if found
try:
    if found_model_path:
        logger.info(f"Loading model from {found_model_path}")
        with open(found_model_path, 'rb') as f:
            model = pickle.load(f)
        logger.info("Model loaded successfully")
    else:
        logger.error("Model file not found in any location")
        
    if found_scaler_path:
        logger.info(f"Loading scaler from {found_scaler_path}")
        with open(found_scaler_path, 'rb') as f:
            scaler = pickle.load(f)
        logger.info("Scaler loaded successfully")
    else:
        logger.error("Scaler file not found in any location")
        
    if found_columns_path:
        logger.info(f"Loading columns from {found_columns_path}")
        with open(found_columns_path, 'rb') as f:
            model_columns = pickle.load(f)
        logger.info("Model columns loaded successfully")
    else:
        logger.error("Columns file not found in any location")
        
    # Explicit None checks to avoid ambiguous truth value errors (e.g. pandas Index)
    if model is not None and scaler is not None and model_columns is not None:
        try:
            # Add some diagnostics about model_columns for clarity
            if hasattr(model_columns, 'dtype') and hasattr(model_columns, '__len__'):
                logger.info(f"All model files loaded successfully (model_columns type={type(model_columns).__name__}, len={len(model_columns)})")
            else:
                logger.info(f"All model files loaded successfully (model_columns type={type(model_columns).__name__})")
        except Exception as diag_err:
            logger.warning(f"Loaded model_columns but failed to inspect details: {diag_err}")
    else:
        logger.warning("Some model files could not be loaded - predictions will be unavailable")
        
except Exception as e:
    logger.error(f"Error loading model files: {str(e)}")
    logger.error(traceback.format_exc())
    model = None
    scaler = None
    model_columns = None

# Define data file paths
data_path = '../Data/smartphone_purchased_data.csv'
alt_data_paths = [
    '../Data/smartphone_purchased_data_cleaned.csv',
    '../Data/smartphone_purchased_data_updated.csv',
    'e:/ml/Data/smartphone_purchased_data.csv',
    'e:/ml/Data/smartphone_purchased_data_cleaned.csv',
    'e:/ml/Data/smartphone_purchased_data_updated.csv',
    './Data/smartphone_purchased_data.csv'
]

logger.info("Attempting to load dataset...")

# Find the data file
found_data_path = find_file(data_path, alt_data_paths)
df = None

try:
    # Load the data if found
    if found_data_path:
        logger.info(f"Loading data from {found_data_path}")
        df = pd.read_csv(found_data_path)
        logger.info(f"Data loaded successfully: {len(df)} rows")
    else:
        logger.warning("No data file found - will create synthetic data")
    
    # Verify and standardize column names
    expected_columns = ['age', 'income', 'time_on_website', 'previous_purchases', 
                       'marketing_engaged', 'search_frequency', 'device_age', 'brand', 'will_purchase']
    
    # Map the actual columns to expected columns
    column_mapping = {
        'Age': 'age',
        'Income': 'income',
        'OnlineActivity': 'time_on_website',
        'PreviousPurchases': 'previous_purchases',
        'PromotionResponse': 'marketing_engaged',  # Yes/No to 1/0
        'PurchaseIntent': 'search_frequency',  # Using as proxy
        'CurrentPhone': 'device_age',          # Using as proxy
        'BrandPreference': 'brand',
        'Target': 'will_purchase'
    }
    
    if df is not None:
        # Log data shape before processing
        logger.info(f"Original data shape: {df.shape}")
        
        # Rename columns that exist
        rename_dict = {k: v for k, v in column_mapping.items() if k in df.columns}
        if rename_dict:
            logger.info(f"Renaming columns: {rename_dict}")
            df = df.rename(columns=rename_dict)
        
        # Convert Yes/No to 1/0 for marketing_engaged if it exists
        if 'marketing_engaged' in df.columns and df['marketing_engaged'].dtype == 'object':
            logger.info("Converting marketing_engaged from Yes/No to 1/0")
            df['marketing_engaged'] = df['marketing_engaged'].map({'Yes': 1, 'No': 0, 'yes': 1, 'no': 0})
        
        # If columns are missing, create them with random data
        missing_columns = [col for col in expected_columns if col not in df.columns]
        if missing_columns:
            logger.warning(f"Missing columns will be synthesized: {missing_columns}")
            
        for col in expected_columns:
            if col not in df.columns:
                logger.info(f"Creating synthetic data for column: {col}")
                if col == 'age':
                    df[col] = np.random.randint(18, 65, len(df))
                elif col == 'income':
                    df[col] = np.random.randint(10000, 150000, len(df))
                elif col == 'time_on_website':
                    df[col] = np.random.normal(20, 10, len(df))
                elif col == 'previous_purchases':
                    df[col] = np.random.poisson(1.5, len(df))
                elif col == 'marketing_engaged':
                    df[col] = np.random.choice([0, 1], len(df))
                elif col == 'search_frequency':
                    df[col] = np.random.randint(0, 20, len(df))
                elif col == 'device_age':
                    df[col] = np.random.normal(2.5, 1.0, len(df))
                elif col == 'brand':
                    df[col] = np.random.choice(['iPhone', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo', 'Nothing', 'Google Pixel'], len(df))
                elif col == 'will_purchase':
                    if 'Target' in df.columns:
                        df[col] = df['Target']
                    else:
                        df[col] = np.random.choice([0, 1], len(df))
        
        # Keep only the columns we need
        df = df[expected_columns]
        
        # Convert data types to ensure consistency
        df['age'] = pd.to_numeric(df['age'], errors='coerce').fillna(30).astype(int)
        df['income'] = pd.to_numeric(df['income'], errors='coerce').fillna(50000).astype(int)
        df['time_on_website'] = pd.to_numeric(df['time_on_website'], errors='coerce').fillna(15).astype(float)
        df['previous_purchases'] = pd.to_numeric(df['previous_purchases'], errors='coerce').fillna(1).astype(int)
        df['marketing_engaged'] = pd.to_numeric(df['marketing_engaged'], errors='coerce').fillna(0).astype(int)
        df['search_frequency'] = pd.to_numeric(df['search_frequency'], errors='coerce').fillna(5).astype(int)
        df['device_age'] = pd.to_numeric(df['device_age'], errors='coerce').fillna(2).astype(float)
        df['will_purchase'] = pd.to_numeric(df['will_purchase'], errors='coerce').fillna(0).astype(int)
        
        # Log data shape after processing
        logger.info(f"Processed data shape: {df.shape}")
        
        # Save cleaned data for future use
        try:
            cleaned_path = '../Data/smartphone_purchased_data_cleaned.csv'
            df.to_csv(cleaned_path, index=False)
            logger.info(f"Cleaned and standardized data saved to {cleaned_path}")
        except Exception as save_error:
            logger.warning(f"Could not save cleaned data: {str(save_error)}")
    else:
        # Create synthetic data from scratch
        logger.info("Creating completely synthetic dataset")
        n = 1000
        np.random.seed(42)
        
        df = pd.DataFrame({
            'age': np.random.randint(18, 65, size=n),
            'income': np.random.randint(10000, 150000, size=n),
            'time_on_website': np.round(np.random.normal(loc=20, scale=10, size=n), 2),
            'previous_purchases': np.random.poisson(lam=1.5, size=n),
            'marketing_engaged': np.random.choice([0, 1], size=n, p=[0.4, 0.6]),
            'search_frequency': np.random.randint(0, 20, size=n),
            'device_age': np.round(np.clip(np.random.normal(loc=2.5, scale=1.0, size=n), 0.2, 5.0), 1),
            'brand': np.random.choice(['iPhone', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo', 'Nothing', 'Google Pixel'], size=n),
            'will_purchase': np.random.choice([0, 1], size=n)
        })
        
        logger.info(f"Created synthetic dataset with {len(df)} rows")
        
        # Try to save the synthetic data
        try:
            cleaned_path = '../Data/smartphone_purchased_data_cleaned.csv'
            df.to_csv(cleaned_path, index=False)
            logger.info(f"Synthetic data saved to {cleaned_path}")
        except Exception as save_error:
            logger.warning(f"Could not save synthetic data: {str(save_error)}")
except Exception as e:
    logger.error(f"Error processing data: {str(e)}")
    logger.error(traceback.format_exc())
    
    # Create synthetic data as last resort
    logger.info("Creating synthetic data due to processing error")
    n = 1000
    np.random.seed(42)
    
    df = pd.DataFrame({
        'age': np.random.randint(18, 65, size=n),
        'income': np.random.randint(10000, 150000, size=n),
        'time_on_website': np.round(np.random.normal(loc=20, scale=10, size=n), 2),
        'previous_purchases': np.random.poisson(lam=1.5, size=n),
        'marketing_engaged': np.random.choice([0, 1], size=n, p=[0.4, 0.6]),
        'search_frequency': np.random.randint(0, 20, size=n),
        'device_age': np.round(np.clip(np.random.normal(loc=2.5, scale=1.0, size=n), 0.2, 5.0), 1),
        'brand': np.random.choice(['iPhone', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo', 'Nothing', 'Google Pixel'], size=n),
        'will_purchase': np.random.choice([0, 1], size=n)
    })

@app.route('/')
def home():
    """Serve the dashboard HTML"""
    logger.info("Serving dashboard homepage")
    return render_template('index.html')

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('assets', path)

@app.route('/api/status')
def api_status():
    """Return API status and available features"""
    status = {
        'status': 'online',
        'features': {
            'data': df is not None,
            'predictions': model is not None and scaler is not None and model_columns is not None,
            'feature_importance': model is not None and model_columns is not None
        },
        'model_loaded': model is not None,
        'data_loaded': df is not None,
        'records_count': len(df) if df is not None else 0
    }
    return jsonify(status)

@app.route('/api/data', methods=['GET'])
def get_data():
    """Return basic statistics about the dataset"""
    try:
        if df is not None:
            logger.info("Calculating dataset statistics")
            # Calculate statistics with error handling
            stats = {
                'total_records': len(df),
                'purchase_rate': float(df['will_purchase'].mean()),
                'conversion_rate': float(df['will_purchase'].mean())
            }
            
            # Add age stats
            try:
                stats['avg_age'] = float(df['age'].mean())
                stats['age_groups'] = {
                    '18-25': int(df[(df['age'] >= 18) & (df['age'] <= 25)].shape[0]),
                    '26-35': int(df[(df['age'] >= 26) & (df['age'] <= 35)].shape[0]),
                    '36-45': int(df[(df['age'] >= 36) & (df['age'] <= 45)].shape[0]),
                    '46-55': int(df[(df['age'] >= 46) & (df['age'] <= 55)].shape[0]),
                    '56+': int(df[df['age'] >= 56].shape[0])
                }
            except Exception as age_error:
                logger.warning(f"Error calculating age statistics: {str(age_error)}")
                stats['avg_age'] = 35.0  # Fallback value
            
            # Add income stats
            try:
                stats['avg_income'] = float(df['income'].mean())
                stats['income_groups'] = {
                    '<30k': int(df[df['income'] < 30000].shape[0]),
                    '30k-50k': int(df[(df['income'] >= 30000) & (df['income'] < 50000)].shape[0]),
                    '50k-70k': int(df[(df['income'] >= 50000) & (df['income'] < 70000)].shape[0]),
                    '70k-100k': int(df[(df['income'] >= 70000) & (df['income'] < 100000)].shape[0]),
                    '>100k': int(df[df['income'] >= 100000].shape[0])
                }
                
                # Income-based conversion rates
                high_income = df[df['income'] > df['income'].median()]
                low_income = df[df['income'] <= df['income'].median()]
                stats['high_income_conversion'] = float(high_income['will_purchase'].mean())
                stats['low_income_conversion'] = float(low_income['will_purchase'].mean())
            except Exception as income_error:
                logger.warning(f"Error calculating income statistics: {str(income_error)}")
                stats['avg_income'] = 65000.0  # Fallback value
            
            # Add website time stats
            try:
                stats['avg_time_on_website'] = float(df['time_on_website'].mean())
            except Exception as time_error:
                logger.warning(f"Error calculating website time statistics: {str(time_error)}")
                stats['avg_time_on_website'] = 18.0  # Fallback value
            
            # Add brand distribution
            try:
                stats['brand_distribution'] = df['brand'].value_counts().to_dict()
            except Exception as brand_error:
                logger.warning(f"Error calculating brand distribution: {str(brand_error)}")
                # Fallback brand distribution
                stats['brand_distribution'] = {
                    'iPhone': 250, 'Samsung': 220, 'OnePlus': 120,
                    'Xiaomi': 100, 'Google Pixel': 90, 'Oppo': 60,
                    'Vivo': 50, 'Nothing': 30, 'Realme': 20
                }
            
            # Add engagement stats
            try:
                stats['marketing_engagement_rate'] = float(df['marketing_engaged'].mean())
                engaged_users = df[df['marketing_engaged'] == 1]
                non_engaged_users = df[df['marketing_engaged'] == 0]
                stats['engaged_conversion'] = float(engaged_users['will_purchase'].mean())
                stats['non_engaged_conversion'] = float(non_engaged_users['will_purchase'].mean())
            except Exception as engagement_error:
                logger.warning(f"Error calculating engagement statistics: {str(engagement_error)}")
            
            logger.info("Successfully calculated dataset statistics")
            return jsonify(stats)
        else:
            logger.error("Data not available for statistics calculation")
            return jsonify({
                'error': 'Data not available',
                'message': 'Dataset could not be loaded. Using fallback data.'
            }), 500
    except Exception as e:
        logger.error(f"Error in get_data: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'error': 'Error calculating statistics',
            'message': str(e)
        }), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make prediction based on input data"""
    if model is None or scaler is None or model_columns is None:
        logger.warning("Prediction requested but model components not available")
        return jsonify({
            'error': 'Model not loaded',
            'message': 'The prediction model is not available. Please check the model files.'
        }), 500
        
    try:
        # Get input data
        input_data = request.json
        logger.info(f"Prediction request received: {input_data}")
        
        # Validate input data
        required_fields = ['age', 'income', 'time_on_website', 'previous_purchases', 
                          'marketing_engaged', 'search_frequency', 'device_age', 'brand']
        
        missing_fields = [field for field in required_fields if field not in input_data]
        if missing_fields:
            logger.warning(f"Missing fields in prediction request: {missing_fields}")
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400
        
        # Create a DataFrame with one row
        input_df = pd.DataFrame([input_data])
        
        # Ensure types are correct
        input_df['age'] = pd.to_numeric(input_df['age'], errors='coerce').fillna(30)
        input_df['income'] = pd.to_numeric(input_df['income'], errors='coerce').fillna(50000)
        input_df['time_on_website'] = pd.to_numeric(input_df['time_on_website'], errors='coerce').fillna(15)
        input_df['previous_purchases'] = pd.to_numeric(input_df['previous_purchases'], errors='coerce').fillna(1)
        input_df['marketing_engaged'] = pd.to_numeric(input_df['marketing_engaged'], errors='coerce').fillna(0)
        input_df['search_frequency'] = pd.to_numeric(input_df['search_frequency'], errors='coerce').fillna(5)
        input_df['device_age'] = pd.to_numeric(input_df['device_age'], errors='coerce').fillna(2)
        
        # One-hot encode categorical features
        logger.info("One-hot encoding categorical features")
        try:
            input_encoded = pd.get_dummies(input_df, columns=['brand'], drop_first=True)
        except Exception as encode_error:
            logger.error(f"Error during one-hot encoding: {str(encode_error)}")
            # Try to recover by using a standard brand format
            input_df['brand'] = input_df['brand'].astype(str)
            input_encoded = pd.get_dummies(input_df, columns=['brand'], drop_first=True)
        
        # Reindex to match training columns
        logger.info("Reindexing to match model columns")
        missing_cols = [c for c in model_columns if c not in input_encoded.columns]
        extra_cols = [c for c in input_encoded.columns if c not in model_columns]
        if missing_cols:
            logger.info(f"Missing columns added with 0 fill: {missing_cols}")
        if extra_cols:
            logger.info(f"Extra columns (will be dropped): {extra_cols}")
        input_encoded = input_encoded.reindex(columns=model_columns, fill_value=0)
        logger.info(f"Encoded input shape after reindex: {input_encoded.shape}")

        # Scale the features
        logger.info("Scaling features")
        input_scaled = scaler.transform(input_encoded)
        logger.info(f"Scaled input sample (first row): {input_scaled[0][:10]} ... total_features={input_scaled.shape[1]}")

        # Make prediction
        logger.info("Making prediction")
        raw_pred = model.predict(input_scaled)
        raw_proba = model.predict_proba(input_scaled)
        prediction = int(raw_pred[0])
        probability = float(raw_proba[0, 1])
        logger.info(f"Model raw prediction={prediction} probability={probability:.4f}")

        # Do not infer brand automatically; use input brand only
        input_brand = str(input_data.get('brand', '')).strip()

        result = {
            'prediction': prediction,
            'probability': probability,            # 0-1 float
            'probability_percent': round(probability * 100, 2),  # convenience for UI
            'message': 'Likely to purchase' if prediction == 1 else 'Not likely to purchase',
            'brand': input_brand
        }
        logger.info(f"Prediction result: {result}")

        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'error': 'Prediction error',
            'message': str(e),
            'detail': traceback.format_exc()
        }), 400

@app.route('/api/compare_brands', methods=['POST'])
def compare_brands():
    """Compare purchase probability for different brands"""
    if model is None or scaler is None or model_columns is None:
        logger.warning("Brand comparison requested but model components not available")
        return jsonify({
            'error': 'Model not loaded',
            'message': 'The prediction model is not available. Please check the model files.'
        }), 500
        
    try:
        # Get base features from request
        base_features = request.json
        logger.info(f"Brand comparison request received: {base_features}")
        
        brands = base_features.pop('brands', None)
        
        if not brands or not isinstance(brands, list):
            logger.warning("Invalid brands list in comparison request")
            return jsonify({
                'error': 'Invalid brands parameter',
                'message': 'Must provide a list of brands to compare'
            }), 400
        
        logger.info(f"Comparing {len(brands)} brands: {brands}")
        
        # Validate base features
        required_fields = ['age', 'income', 'time_on_website', 'previous_purchases', 
                          'marketing_engaged', 'search_frequency', 'device_age']
        
        missing_fields = [field for field in required_fields if field not in base_features]
        if missing_fields:
            logger.warning(f"Missing fields in comparison request: {missing_fields}")
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400
        
        results = []
        for brand in brands:
            try:
                # Create input data with current brand
                input_data = base_features.copy()
                input_data['brand'] = brand
                
                # Create DataFrame
                input_df = pd.DataFrame([input_data])
                
                # Ensure types are correct
                input_df['age'] = pd.to_numeric(input_df['age'], errors='coerce').fillna(30)
                input_df['income'] = pd.to_numeric(input_df['income'], errors='coerce').fillna(50000)
                input_df['time_on_website'] = pd.to_numeric(input_df['time_on_website'], errors='coerce').fillna(15)
                input_df['previous_purchases'] = pd.to_numeric(input_df['previous_purchases'], errors='coerce').fillna(1)
                input_df['marketing_engaged'] = pd.to_numeric(input_df['marketing_engaged'], errors='coerce').fillna(0)
                input_df['search_frequency'] = pd.to_numeric(input_df['search_frequency'], errors='coerce').fillna(5)
                input_df['device_age'] = pd.to_numeric(input_df['device_age'], errors='coerce').fillna(2)
                
                # One-hot encode categorical features
                input_encoded = pd.get_dummies(input_df, columns=['brand'], drop_first=True)
                
                # Reindex to match training columns
                input_encoded = input_encoded.reindex(columns=model_columns, fill_value=0)
                
                # Scale the features
                input_scaled = scaler.transform(input_encoded)
                
                # Make prediction
                prediction = int(model.predict(input_scaled)[0])
                probability = float(model.predict_proba(input_scaled)[0, 1])
                
                results.append({
                    'brand': brand,
                    'prediction': prediction,
                    'probability': probability
                })
            except Exception as brand_error:
                logger.error(f"Error processing brand '{brand}': {str(brand_error)}")
                results.append({
                    'brand': brand,
                    'error': str(brand_error),
                    'probability': 0.5,  # Fallback value
                    'prediction': 0
                })
        
        # Sort results by probability in descending order
        results.sort(key=lambda x: x['probability'], reverse=True)
        
        logger.info(f"Brand comparison results generated for {len(results)} brands")
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Error during brand comparison: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'error': 'Comparison error',
            'message': str(e),
            'detail': traceback.format_exc()
        }), 400

@app.route('/api/feature_importance', methods=['GET'])
def feature_importance():
    """Return feature importance if available"""
    if model is None:
        logger.warning("Feature importance requested but model not available")
        return jsonify({
            'error': 'Model not loaded',
            'message': 'The prediction model is not available. Please check the model files.'
        }), 500
    
    try:
        # Get feature importance if available
        logger.info("Retrieving feature importance")
        
        if hasattr(model, 'coef_'):
            # For linear models
            logger.info("Using coefficients from linear model")
            importance = {col: float(coef) for col, coef in zip(model_columns, model.coef_[0])}
        elif hasattr(model, 'feature_importances_'):
            # For tree-based models
            logger.info("Using feature importances from tree-based model")
            importance = {col: float(imp) for col, imp in zip(model_columns, model.feature_importances_)}
        else:
            logger.warning("Feature importance not available for this model type")
            
            # Create synthetic feature importance as fallback
            logger.info("Creating synthetic feature importance")
            importance = {
                'income': 0.35,
                'age': 0.25,
                'time_on_website': 0.18,
                'previous_purchases': 0.15,
                'marketing_engaged': 0.12,
                'search_frequency': 0.10,
                'device_age': 0.08,
                'brand_iPhone': 0.06,
                'brand_Samsung': 0.05
            }
        
        # Optionally filter out brand one-hot features for a cleaner primary importance view
        filtered_importance = {k: v for k, v in importance.items() if not k.startswith('brand_')}
        if len(filtered_importance) != len(importance):
            logger.info("Filtered out brand_* features from importance for display")
        display_importance = filtered_importance if filtered_importance else importance

        # Sort by absolute importance
        sorted_importance = sorted(display_importance.items(), key=lambda x: abs(x[1]), reverse=True)
        
        # Calculate normalized importance (percentage of total)
        total_importance = sum(abs(val) for val in display_importance.values())
        normalized_importance = {}
        
        if total_importance > 0:
            for key, value in display_importance.items():
                normalized_importance[key] = abs(value) / total_importance
                
            # Sort normalized importance
            sorted_normalized = sorted(normalized_importance.items(), key=lambda x: x[1], reverse=True)
        else:
            sorted_normalized = sorted_importance
        
        result = {
            'feature_importance': dict(sorted_importance),
            'normalized_importance': dict(sorted_normalized)
        }
        
        logger.info("Feature importance retrieved successfully")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error retrieving feature importance: {str(e)}")
        logger.error(traceback.format_exc())
        
        # Return synthetic feature importance as fallback
        synthetic_importance = {
            'income': 0.35,
            'age': 0.25,
            'time_on_website': 0.18,
            'previous_purchases': 0.15,
            'marketing_engaged': 0.12,
            'search_frequency': 0.10,
            'device_age': 0.08,
            'brand_iPhone': 0.06,
            'brand_Samsung': 0.05
        }
        
        return jsonify({
            'feature_importance': synthetic_importance,
            'is_fallback': True,
            'error': str(e)
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
