# Contributing to SmartPredict

Thank you for your interest in improving the Smartphone Purchase Prediction Dashboard! This guide explains how to get set up, contribute code or documentation, and ensure your changes can be merged smoothly.

## 📋 Table of Contents
1. Project Principles
2. Code of Conduct
3. Tech Stack Overview
4. Environment Setup
5. Branch & Commit Strategy
6. Development Workflow
7. Testing Guidelines
8. Documentation Standards
9. Dependency Policy
10. Licensing of Contributions
11. Getting Help

---
## 1. Project Principles
- **Clarity**: Readable, documented, minimal complexity.
- **Reproducibility**: Deterministic environments and data handling.
- **User Focus**: Dashboard interaction speed and prediction clarity.
- **Extensibility**: Easy to add new features without breaking existing ones.

## 2. Code of Conduct
Be respectful, constructive, and kind. Harassment, discrimination, or disrespectful behavior is not tolerated. (You may open an issue to discuss adding a formal CODE_OF_CONDUCT if the project grows.)

## 3. Tech Stack Overview
| Layer | Tools |
|-------|-------|
| Backend | Python, Flask, Flask-CORS |
| ML | scikit-learn, pandas, numpy |
| Frontend | HTML, CSS, JavaScript (Chart.js, Bootstrap) |
| Packaging | `requirements.txt` (pinned ranges) |

## 4. Environment Setup
```bash
git clone https://github.com/Mandar123454/Predictive-Modeling-for-Smartphone-Purchase-Behavior-ML.git
cd Predictive-Modeling-for-Smartphone-Purchase-Behavior-ML
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
# or .\.venv\Scripts\Activate.ps1 on Windows
pip install --upgrade pip
pip install -r requirements.txt
```
Optional dev extras:
```bash
pip install pytest pytest-cov black isort
```

## 5. Branch & Commit Strategy
- Base branch: `main`
- Feature branches: `feature/<short-description>`
- Bugfix: `fix/<issue-id-or-key>`
- Documentation: `docs/<scope>`

Commit message format:
```
<type>: <summary>

Optional body with reasoning. Reference issue with #<id>.
```
Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `chore`.

## 6. Development Workflow
1. Fork & clone
2. Create branch
3. Implement changes (keep diffs focused)
4. Add/Update tests if behavior changes
5. Run lint/format (optional but recommended)
6. Run dashboard:
    - Windows PowerShell: `cd Dashboard && ./run_dashboard.ps1`
    - Windows (cmd): `cd Dashboard && ..\run_dashboard.bat` (if present)
    - macOS/Linux: `python3 run_dashboard.py` or `cd Dashboard && python3 app.py`
7. For Azure App Service changes: test locally then see `AZURE_DEPLOY.md`
8. Open Pull Request with description & screenshots for UI changes

## 7. Testing Guidelines
- Prefer small unit tests for prediction preprocessing & API endpoints.
- Example quick API test (pytest style):
```python
def test_status(client):
    resp = client.get('/api/status')
    assert resp.status_code == 200
```
Add test dependencies only if justified. Avoid heavy integration tests unless necessary.

## 8. Documentation Standards
- Update `USER_GUIDE.md` when user-facing behavior changes.
- Update `README.md` only for top-level feature shifts.
- Inline code comments: explain *why*, not *what*.
- Add docstrings to new Python functions (Google or numpydoc style acceptable).

## 9. Dependency Policy
- Avoid adding large frameworks unless essential.
- Pin with upper-bound safe ranges when conflicts known.
- Remove unused packages during refactors.
- Security updates > feature convenience.

Versioning policy notes:
- Python 3.11+ preferred. Wheels validated on Windows with Python 3.13 for sklearn 1.7.x.
- Keep `requirements.txt` pinned for reproducible Azure builds (Oryx).

## 10. Licensing of Contributions
All contributions are licensed under the existing MIT License. By submitting a Pull Request you certify you have the right to license the code and it does not introduce incompatible third‑party code.

If adding third-party code, include its license header or add an entry in `NOTICE`.

## 11. Getting Help
- Open a GitHub Issue for bugs (“Bug:” prefix in title recommended)
- Use Discussions (if enabled) for ideas or questions
- Tag maintainers in PR if no review after 5 business days

---
Thank you for helping make SmartPredict better!
