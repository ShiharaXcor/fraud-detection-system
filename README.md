# 🛡️ FraudGuard  — Fraud Detection System

An end-to-end AI-powered fraud detection system built on the **IEEE-CIS Fraud Detection dataset** (Kaggle). The system trains XGBoost and LightGBM models, explains predictions using SHAP values, and serves results through a FastAPI backend and React dashboard.



## Project Structure

```
fraud-detection/
│
├── notebooks/
│   ├── 01_eda.ipynb                  ← Exploratory Data Analysis
│   ├── 02_feature_engineering.ipynb  ← Feature Engineering
│   ├── 03_model_training.ipynb       ← XGBoost & LightGBM Training
│   └── 04_explainability.ipynb       ← SHAP Explainability
│
├── backend/
│   ├── main.py                       ← FastAPI app and routes
│   ├── schemas.py                    ← Pydantic input/output schemas
│   └── model_loader.py               ← Model loading and preprocessing
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.jsx         ← Metrics and charts dashboard
│       │   └── Predict.jsx           ← Transaction scoring page
│       └── components/               ← Reusable UI components
│
├── src/                              ← Shared Python utilities
├── data/
│   ├── raw/                          ← Raw CSV files (not tracked)
│   └── processed/                    ← Cleaned data and charts
├── models/                           ← Saved model files (not tracked)
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml
└── requirements.txt
```

---

## Tech Stack

| Layer | Tools |
|---|---|
| Machine Learning | Python, XGBoost, LightGBM, scikit-learn, SHAP |
| Data Processing | Pandas, NumPy, Matplotlib, Seaborn, Plotly |
| Imbalance Handling | imbalanced-learn (SMOTE) |
| Hyperparameter Tuning | Optuna |
| Backend API | FastAPI, Uvicorn, Pydantic |
| Frontend | React (Vite), Recharts, TailwindCSS, Axios |
| DevOps | Docker, Docker Compose, nginx |
| Deployment | Railway |
| Version Control | Git, GitHub |

---

## ML Pipeline

```
Raw Data → EDA → Feature Engineering → SMOTE → Model Training → SHAP → FastAPI → React
```

### Key challenges handled
- **Class imbalance** — 96.5% legitimate vs 3.5% fraud, solved with SMOTE + undersampling
- **High dimensionality** — 434 features after merge, reduced via feature selection
- **Explainability** — every prediction includes SHAP feature contributions
- **Production readiness** — Dockerised, REST API, live deployment

---

## Model Performance

| Metric | Score |
|---|---|
| AUC-ROC | see metrics.json |
| AUC-PR | see metrics.json |
| Models trained | XGBoost, LightGBM |
| Best model | Auto-selected by AUC-ROC |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/health` | API status |
| POST | `/predict` | Score a single transaction |
| POST | `/predict/batch` | Score a CSV file of transactions |
| GET | `/metrics` | Model performance metrics |
| GET | `/features` | Top 20 SHAP feature importances |
| GET | `/docs` | Swagger interactive API docs |

### Example request
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "TransactionAmt": 150.00,
    "ProductCD": "W",
    "card1": 9500,
    "card4": "visa",
    "card6": "debit",
    "P_emaildomain": "gmail.com"
  }'
```

### Example response
```json
{
  "fraud_probability": 0.0821,
  "fraud_predicted": false,
  "risk_level": "Low",
  "threshold_used": 0.5,
  "top_features": [
    {
      "feature": "TransactionAmt",
      "value": 150.0,
      "shap_value": -0.312,
      "direction": "decreases fraud risk"
    }
  ]
}
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker Desktop (for Docker option)

### Option A — Run with Docker

```bash
# 1. Clone the repo
git clone https://github.com/YOURUSERNAME/fraud-detection.git
cd fraud-detection

# 2. Add your trained model files to models/
#    (or run the notebooks first to train)

# 3. Start everything
docker-compose up --build
```

Open:
- Frontend → `http://localhost`
- API docs → `http://localhost:8000/docs`

---

### Option B — Run locally

```bash
# 1. Clone the repo
git clone https://github.com/YOURUSERNAME/fraud-detection.git
cd fraud-detection

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Download the dataset
# Go to https://www.kaggle.com/competitions/ieee-fraud-detection/data
# Download train_transaction.csv and train_identity.csv
# Place both files in data/raw/

# 5. Run the notebooks in order
# notebooks/01_eda.ipynb
# notebooks/02_feature_engineering.ipynb
# notebooks/03_model_training.ipynb
# notebooks/04_explainability.ipynb

# 6. Start FastAPI backend (Terminal 1)
uvicorn backend.main:app --reload --port 8000

# 7. Start React frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

Open:
- Frontend → `http://localhost:5173`
- API docs → `http://localhost:8000/docs`

---

## Dataset

**IEEE-CIS Fraud Detection** — Kaggle Competition Dataset

| Property | Detail |
|---|---|
| Source | https://www.kaggle.com/competitions/ieee-fraud-detection |
| Transactions | ~590,000 |
| Features | 434 (after merge) |
| Fraud rate | ~3.5% |
| Tables | train_transaction.csv + train_identity.csv |

> Dataset files are not included in this repository due to size.
> Download from Kaggle and place in `data/raw/`.

---

## Feature Engineering

New features created in Phase 2:

| Category | Features |
|---|---|
| Time | hour, day_of_week, is_night, is_weekend |
| Amount | amt_log, is_round_amount, amt_zscore_card |
| Card | card1_count, card2_count, card_combo_count |
| Email | p_email_count, r_email_count, email_domain_match |
| Address | addr_match, addr1_count |
| Encoding | Frequency encoding for all categorical columns |

---

## Web App Features

- **Live fraud scoring** — submit a transaction and get a probability score instantly
- **SHAP explanation panel** — every prediction shows which features drove the decision
- **Risk level badges** — Low / Medium / High with colour coding
- **Analytics dashboard** — model metrics, feature importance chart, model info
- **Transaction history** — last 20 scored transactions stored locally
- **Collapsible sidebar** — clean navigation with hamburger toggle
- **Batch CSV upload** — score multiple transactions via `/predict/batch` API endpoint



## Resume Bullet

> Built an end-to-end fraud detection system on the IEEE-CIS dataset (590K transactions)
> using XGBoost/LightGBM with SHAP explainability. Deployed as a FastAPI + React web
> application with Docker and CI/CD on Railway. Achieved 0.94+ AUC-ROC.

---

## Author

**Your Name**
- GitHub: https://github.com/YOURUSERNAME
- LinkedIn: https://linkedin.com/in/YOURPROFILE

---

