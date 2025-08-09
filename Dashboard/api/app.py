from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
import os
import logging
import sys
import pickle
import pandas as pd
import numpy as np
import traceback
from api import init_app, routes

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

def create_app():
    """Create and configure the Flask app with all necessary components"""
    app = Flask(__name__, static_folder='./', template_folder='./')
    CORS(app)  # Enable CORS for all routes

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
            
        if model and scaler and model_columns:
            logger.info("All model files loaded successfully")
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
                        df[col] = np.clip(np.random.normal(2.5, 1.0, len(df)), 0.2, 5.0)
                    elif col == 'brand':
                        df[col] = np.random.choice(['iPhone', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo', 'Nothing', 'Google Pixel'], len(df))
                    elif col == 'will_purchase':
                        df[col] = np.random.choice([0, 1], len(df))
            
            # Log the shape after processing
            logger.info(f"Processed data shape: {df.shape}")
            
            # Save the cleaned and standardized data
            try:
                cleaned_path = '../Data/smartphone_purchased_data_cleaned.csv'
                df.to_csv(cleaned_path, index=False)
                logger.info(f"Cleaned and standardized data saved to {cleaned_path}")
            except Exception as save_error:
                logger.warning(f"Could not save cleaned data: {str(save_error)}")
        else:
            # Create synthetic data if no data was found
            logger.info("Creating synthetic dataset")
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

    # Initialize the API module with model and data
    routes.initialize(model, scaler, model_columns, df)
    
    # Register the API blueprint
    init_app(app)
    
    # Basic routes for static files
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
    
    return app

# If running directly, start the app
if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
