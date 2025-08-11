# Smartphone Purchase Prediction Dashboard

An interactive dashboard for analyzing smartphone purchase patterns and predicting customer purchase behavior based on demographic and financial data.

- ![Dashboard Preview](.DashboardPreview.png)

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
│   ├── js/              # JavaScript files
│   ├── data/            # Static JSON data for GitHub Pages deployment
│   └── index.html       # Main dashboard page
├── Data/                # Dataset files
│   ├── smartphone_purchased_data.csv        # Original dataset
│   ├── smartphone_purchased_data_cleaned.csv # Cleaned dataset
│   └── smartphone_purchased_data_updated.csv # Updated dataset with additional features
├── Models/              # Trained machine learning models
│   ├── model.pkl        # Main prediction model
│   ├── scaler.pkl       # Feature scaler
│   └── model_columns.pkl # Column names for model input
├── Notebook/            # Jupyter notebooks for analysis and model development
│   ├── exploratory_analysis.ipynb  # Data exploration
│   └── Main Notebook.ipynb         # Model training and evaluation
└── app.py              # Flask application serving the API
```

### Deployment to GitHub Pages

This dashboard is designed to be deployed as a static site on GitHub Pages with the following setup:

1. Prepare static data files in the `Dashboard/data/` directory for API responses
2. Push your repository to GitHub
3. Configure GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Set source to your main branch
   - Set the folder to "/Dashboard"
   - Publish directory: `Dashboard`
4. Deploy!

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
