# Smartphone Purchase Prediction Dashboard

An interactive dashboard for analyzing smartphone purchase patterns and predicting customer purchase behavior based on demographic and financial data.

![Dashboard Preview](Dashboard-Preview.png)   

## Features

- **Purchase Prediction**: Get real-time predictions on whether a user will purchase a smartphone based on their demographics and financial information
- **Data Visualization**: Interactive charts showing purchase trends by age, gender, income, and more
- **Feature Importance Analysis**: Understand which factors most strongly influence smartphone purchase decisions
- **Brand Comparison**: Compare purchase patterns across different smartphone brands
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Visualization**: Chart.js, D3.js
- **Backend**: Python Flask API
- **Machine Learning**: Scikit-learn, Pandas, NumPy
- **Model**: Random Forest Classifier

## Setup and Installation

### Local Development

1. Clone the repository
   ```
   git clone https://github.com/yourusername/smartphone-purchase-prediction.git
   cd smartphone-purchase-prediction
   ```

2. Create and activate a virtual environment
   ```
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask application
   ```
   python app.py
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Project Structure

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


## API Endpoints

When running locally, the following API endpoints are available:

- `GET /api/status`: Check if the API is running
- `GET /api/dashboard_data`: Get general dashboard statistics
- `GET /api/feature_importance`: Get model feature importance data
- `POST /api/predict`: Get purchase prediction based on user data
- `GET /api/compare_brands`: Get comparison data between smartphone brands

## Data Preparation

The machine learning model was trained on demographic and financial data with the following process:

1. Data cleaning and preprocessing
2. Feature engineering and selection
3. Model training and hyperparameter tuning
4. Model evaluation and validation

For more details on the data preparation and model development process, see the Jupyter notebooks in the `Notebook/` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
