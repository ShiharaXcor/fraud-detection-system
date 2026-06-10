from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import json
import io
from typing import List

from backend.schemas import (
    TransactionInput,
    PredictionOutput,
    ModelMetrics,
    BatchInput
)
from backend.model_loader import (
    load_model,
    load_feature_columns,
    load_explainer,
    load_metrics,
    preprocess_input,
    get_risk_level,
    get_shap_explanation
)


# ─── APP SETUP ────────────────────────────────────────────────────────────────
app = FastAPI(
    title       = "Fraud Detection API",
    description = "AI-powered fraud detection using IEEE-CIS dataset",
    version     = "1.0.0"
)

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)


# ─── LOAD MODEL ON STARTUP ───────────────────────────────────────────────────
# These are loaded once when the server starts — not on every request
print("\nLoading model and dependencies...")
model, model_name   = load_model()
feature_cols        = load_feature_columns()
explainer           = load_explainer()
metrics             = load_metrics()
THRESHOLD           = metrics.get('threshold', 0.5)
print("✅ API ready\n")


# ─── ROUTES ──────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    """Health check — confirms API is running"""
    return {
        "status"     : "running",
        "model"      : model_name,
        "version"    : "1.0.0",
        "endpoints"  : ["/predict", "/predict/batch", "/metrics", "/docs"]
    }


@app.get("/health")
def health():
    """Simple health check for deployment monitoring"""
    return {"status": "healthy", "model_loaded": model is not None}


@app.post("/predict", response_model=PredictionOutput)
def predict(transaction: TransactionInput):
    """
    Score a single transaction.

    Returns:
    - fraud_probability : 0.0 to 1.0
    - fraud_predicted   : True/False
    - risk_level        : Low / Medium / High
    - top_features      : SHAP explanation
    """
    try:
        # Convert input to dict
        data = transaction.model_dump()

        # Preprocess — same feature engineering as Phase 2
        df_processed = preprocess_input(data, feature_cols)

        # Get fraud probability
        fraud_prob = float(model.predict_proba(df_processed)[0][1])

        # Get SHAP explanation
        top_features = get_shap_explanation(
            explainer, df_processed, feature_cols, top_n=10
        )

        return PredictionOutput(
            fraud_probability = round(fraud_prob, 4),
            fraud_predicted   = fraud_prob >= THRESHOLD,
            risk_level        = get_risk_level(fraud_prob, THRESHOLD),
            threshold_used    = THRESHOLD,
            top_features      = top_features
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/batch")
def predict_batch(file: UploadFile = File(...)):
    """
    Score multiple transactions from a CSV file upload.

    Accepts : CSV file with transaction columns
    Returns : JSON list with fraud probability for each row
    """
    try:
        # Read uploaded CSV
        contents = file.file.read()
        df       = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        results = []
        for _, row in df.iterrows():
            data         = row.to_dict()
            df_processed = preprocess_input(data, feature_cols)
            fraud_prob   = float(model.predict_proba(df_processed)[0][1])

            results.append({
                'fraud_probability' : round(fraud_prob, 4),
                'fraud_predicted'   : fraud_prob >= THRESHOLD,
                'risk_level'        : get_risk_level(fraud_prob, THRESHOLD),
            })

        # Summary stats
        fraud_count = sum(1 for r in results if r['fraud_predicted'])
        return {
            'total_transactions' : len(results),
            'fraud_detected'     : fraud_count,
            'fraud_rate'         : round(fraud_count / len(results) * 100, 2),
            'results'            : results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics", response_model=ModelMetrics)
def get_metrics():
    """
    Returns model performance metrics for the dashboard.
    AUC-ROC, AUC-PR, threshold, and feature count.
    """
    return ModelMetrics(**metrics)


@app.get("/features")
def get_features():
    """Returns the top 20 most important features for the dashboard"""
    try:
        import json, os
        path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'models', 'shap_importance.json'
        )
        with open(path) as f:
            shap_importance = json.load(f)
        return {"top_features": shap_importance}
    except Exception as e:
        return {"top_features": {}, "error": str(e)}