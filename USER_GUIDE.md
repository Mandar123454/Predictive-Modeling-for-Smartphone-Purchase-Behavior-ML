# SmartPredict User Guide

Welcome to SmartPredict! This guide will help you get started with the smartphone purchase behavior prediction dashboard.

## 🚀 Quick Start (Reliable Path)

### 1. Get the Code
Download ZIP (extract) or clone:
```
git clone https://github.com/Mandar123454/Predictive-Modeling-for-Smartphone-Purchase-Behavior-ML.git
```

### 2. Create + Activate Virtual Environment (Recommended)
From project root:
```
python -m venv .venv
".venv\Scripts\Activate"  # Windows PowerShell: .\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Start the Dashboard
Standard run (Windows PowerShell):
```
Set-Location .\Dashboard
\.venv\Scripts\Activate.ps1   # if not already active
./run_dashboard.ps1
```
Direct Python fallback:
```
Set-Location .\Dashboard
python app.py
```
Then open: http://127.0.0.1:5000 (or http://localhost:5000)

> Tip: If you already ran `setup.bat` earlier, you can still use the steps above; they are explicit and easier to troubleshoot.

## 📋 Requirements

| Item | Recommended |
|------|-------------|
| OS | Windows 10/11, macOS 12+, or recent Linux distro |
| Python | 3.11 recommended (works with 3.10–3.12). Python 3.13 may require compatible wheels. |
| RAM | 4 GB+ |
| Browser | Latest Chrome / Edge / Firefox |
| Internet | Needed only for first dependency install |

If multiple Python versions exist, ensure the one used to create `.venv` matches the one that will run `app.py`.

## 🎯 How to Use the Dashboard

### 1. Overview Section
**What it shows**: Project summary and model performance
- View overall prediction accuracy (87%+)
- See dataset size and feature count
- Understand model capabilities

### 2. Demographics Section  
**What you can explore**:
- **Age Analysis**: How age affects purchase decisions
- **Income Impact**: Purchase patterns by income level
- **Gender Differences**: Male vs female buying behavior
- **Education Effect**: How education influences choices

**How to use**:
- Browse charts by clicking tabs or scrolling
- Hover over charts for detailed information
- Use filters to focus on specific groups

### 3. Prediction Tool
**Purpose**: Returns purchase likelihood (%) for the exact inputs you provide.

Current behavior (after latest optimization):
- The brand you select is echoed back exactly (no auto brand inference).
- Probability shown = model probability of purchase (0–100%).
- Color scale: Green (high), Orange (medium), Red (low).

Usage:
1. Fill all required fields (age, income, time on website, previous purchases, marketing engagement, search frequency, device age, brand).
2. Submit form – gauge + textual result update instantly.
3. Adjust a single field (e.g., increase income) to see sensitivity.
4. Use extreme values to understand feature impact bounds.

Troubleshooting prediction:
- If gauge shows 0% but message says “Likely” refresh (was fixed; should not happen now).
- If API returns error, fallback logic may fabricate a probability – check browser console.

### 4. Brand Comparison
**What you can compare**:
- Market share trends over time
- Brand loyalty and customer retention
- Feature preferences by brand
- Demographic preferences for each brand

**How to explore**:
- View interactive charts for each brand
- Compare multiple brands side-by-side
- Filter by demographic groups
- See purchase decision timelines

### 5. Insights Section
**Includes**: Feature importance ranking (brand one‑hot indicators removed for clarity), comparative charts, and high-level influence ordering.

Feature importance notes:
- Only core numeric / behavioral features are displayed (brand_* columns filtered out).
- Bars may show small negative values for features with slight negative weight.
- Normalized percentages are used internally; raw values are scaled consistently across a single model state.

## 🔧 Troubleshooting (Focused)

### A. Startup Fails Immediately
```
python --version
pip --version
```
If Python < 3.8, upgrade. Then recreate environment:
```
Remove-Item -Recurse -Force .venv  # PowerShell
python -m venv .venv
\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Run again:
```
Set-Location .\Dashboard
python app.py
```

### B. Blank Page or Static Only
- Hard refresh (Ctrl+Shift+R)
- Open DevTools Console – look for 404s or CORS errors
- Ensure you are on http://127.0.0.1:5000 not a stale cached tab

### C. Prediction Endpoint 500
Tail backend log:
```
Get-Content .\Dashboard\dashboard_api.log -Tail 40
```
Look for messages: “Missing columns added…” or “Model raw prediction…”. If model files missing run:
```
python create_test_model.py   # inside Dashboard
```

### D. Feature Importance Missing / Empty
- Confirm endpoint: http://127.0.0.1:5000/api/feature_importance
- If error, server log may show model not loaded.
- Recreate test model artifacts as above.

### E. Port 5000 Already Used
Windows:
```
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```
Linux / macOS:
```
lsof -i :5000
kill -9 <PID>
```

### F. Virtual Environment Not Activating
PowerShell execution policy may block scripts:
```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
Then re-run activation.

### Page Loads But No Charts
1. **Clear Browser Cache**: Ctrl+F5 (Windows) or Cmd+R (Mac)
2. **Try Incognito Mode**: Private/Incognito browsing window
3. **Check Console**: Press F12, look for errors in Console tab

### "Port Already in Use" Error
1. **Find Process**: 
   - Windows: `netstat -ano | findstr :5000`
   - Mac/Linux: `lsof -i :5000`
2. **Kill Process**:
   - Windows: `taskkill /PID <number> /F`
   - Mac/Linux: `kill -9 <number>`

### Charts Load Slowly
- **Normal**: First load takes 10-15 seconds
- **Improve**: Close other browser tabs and applications
- **Wait**: Large datasets need time to process

## 💡 Tips for Best Experience

### Getting Accurate Predictions
- **Be Realistic**: Use plausible values for age, income, etc.
- **Try Extremes**: See how very high/low values affect predictions
- **Compare Scenarios**: Test similar profiles with one variable changed
- **Check Explanations**: Look at which features drive the prediction

### Exploring Demographics
- **Start Broad**: Look at overall trends first
- **Drill Down**: Use filters to focus on specific groups
- **Compare Groups**: Look at different age ranges, income levels
- **Note Patterns**: Look for surprising or interesting trends

### Understanding Brands
- **Market Trends**: Check how brand popularity changes over time
- **Loyalty Patterns**: See which brands keep customers longest
- **Feature Focus**: Understand what each brand emphasizes
- **Target Demographics**: See which age groups prefer which brands

## 📊 Interpreting Results

Prediction Scale:
| Range | Interpretation | Suggested Action |
|-------|----------------|------------------|
| 0–30% | Low interest | Adjust marketing / nurture |
| 30–70% | Moderate | Collect more signals, offer incentive |
| 70–100% | High | Prioritize engagement / conversion |

Model Accuracy Snapshot:
- Current RandomForest model: ~87% accuracy (test split)
- Use probability thresholds (e.g. ≥0.6) for higher precision scenarios.

Key Terms:
- Correlation: Relationship strength (−1 to +1)
- Importance: Relative influence of a feature in the model
- Probability: Model-estimated likelihood (not guaranteed outcome)

## 📱 Mobile Usage

The dashboard works on phones and tablets:
- **Portrait Mode**: Best for forms and predictions
- **Landscape Mode**: Better for viewing charts
- **Touch**: Tap charts to see details
- **Zoom**: Pinch to zoom on complex charts

## 🎓 Educational Applications

### For Students
- **Learn ML**: See how machine learning works in practice
- **Understand Data**: Explore how data tells stories
- **Practice Analysis**: Try interpreting patterns and trends
- **Ask Questions**: What factors matter most and why?

### For Teachers
- **Demonstrate Concepts**: Show real-world ML applications
- **Interactive Learning**: Students can explore and experiment
- **Discussion Points**: Use findings to spark classroom discussions
- **Project Ideas**: Students can propose improvements or extensions

### For Business Learning
- **Market Research**: Understand customer segmentation
- **Decision Making**: See how data guides business choices
- **Strategy Planning**: Use insights for marketing and product planning
- **ROI Understanding**: Learn how predictions create business value

## ❓ FAQ (Updated)

**Is the data real?**  Synthetic but pattern-informed.

**Can I swap in my own CSV?**  Not via UI yet. Replace the file in `Data/` keeping the same column names, then restart.

**Why are brand features not in feature importance?**  They were intentionally filtered to emphasize universal behavioral drivers.

**Can I get them back?**  Yes—remove the filter block in `feature_importance()` (search for `filtered_importance`).

**Prediction brand differs from selection?**  Fixed—now echoes the submitted brand exactly.

**Export charts?**  Use browser print (Save as PDF) or screenshot tools.

**Offline use?**  After first dependency install, yes.

**How to reset models?**  Run inside `Dashboard/`:
```
python create_test_model.py
```

## 🆘 Getting Help

If you're still having trouble:

1. **Read the README**: Check the main README.md file for technical details
2. **Check Documentation**: See Project Report/DOCS.md for comprehensive documentation
3. **GitHub Issues**: Report bugs or request features on the GitHub repository
4. **Community**: Use GitHub Discussions for questions and sharing

## 📈 What's Next?

Once you're comfortable with the dashboard:
- Explore all five sections thoroughly
- Try edge cases in the prediction tool
- Look for interesting patterns in demographics
- Compare your expectations with the data findings
- Think about how this applies to real business decisions

---

### Maintenance Snapshot (Latest Update)
- Removed brand auto-inference in predictions
- Added robust logging for prediction requests
- Filtered brand_* one-hot columns from feature importance output
- Improved probability rendering (prevents 0% mismatch)
- Standardized virtual environment usage

Happy exploring with SmartPredict! 🚀