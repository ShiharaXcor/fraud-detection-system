import joblib
import json
import numpy as np
import pandas as pd
import os
import glob


# ─── PATHS ───────────────────────────────────────────────────────────────────
BASE_DIR     = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR   = os.path.join(BASE_DIR, 'models')


def load_model():
    """Load the best trained model from the models folder"""
    model_files = glob.glob(os.path.join(MODELS_DIR, 'best_model_*.pkl'))
    if not model_files:
        raise FileNotFoundError(f"No model found in {MODELS_DIR}")
    model = joblib.load(model_files[0])
    model_name = os.path.basename(model_files[0]).replace('best_model_','').replace('.pkl','')
    print(f"✅ Model loaded: {model_name}")
    return model, model_name


def load_feature_columns():
    """Load the list of feature columns the model expects"""
    path = os.path.join(MODELS_DIR, 'feature_columns.pkl')
    cols = joblib.load(path)
    print(f"✅ Feature columns loaded: {len(cols)} features")
    return cols


def load_explainer():
    """Load the SHAP explainer"""
    path = os.path.join(MODELS_DIR, 'shap_explainer.pkl')
    if not os.path.exists(path):
        print("⚠️  SHAP explainer not found — explanations disabled")
        return None
    explainer = joblib.load(path)
    print("✅ SHAP explainer loaded")
    return explainer


def load_metrics():
    """Load model performance metrics"""
    path = os.path.join(MODELS_DIR, 'metrics.json')
    with open(path) as f:
        metrics = json.load(f)
    print(f"✅ Metrics loaded: AUC-ROC={metrics['auc_roc']}")
    return metrics


def preprocess_input(data: dict, feature_cols: list) -> pd.DataFrame:
    """
    Takes raw input dictionary and transforms it into
    the exact format the model expects.

    Steps:
    1. Convert to DataFrame
    2. Add engineered features (same as Phase 2)
    3. Frequency encode categoricals
    4. Align columns to match training features
    5. Fix any infinity or NaN values
    """
    df = pd.DataFrame([data])

    # ── Time features ────────────────────────────────────────────────────────
    if 'TransactionDT' in df.columns and df['TransactionDT'].notna().any():
        df['hour']        = (df['TransactionDT'] / 3600) % 24
        df['day_of_week'] = ((df['TransactionDT'] / (3600 * 24)) % 7).astype(int)
        df['is_night']    = df['hour'].apply(lambda x: 1 if (x >= 23 or x <= 6) else 0)
        df['is_weekend']  = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
    else:
        df['hour']        = 12   # default midday
        df['day_of_week'] = 2    # default Wednesday
        df['is_night']    = 0
        df['is_weekend']  = 0

    # ── Amount features ───────────────────────────────────────────────────────
    if 'TransactionAmt' in df.columns:
        df['amt_log']         = np.log1p(df['TransactionAmt'])
        df['is_round_amount'] = (df['TransactionAmt'] % 1 == 0).astype(int)
        df['amt_zscore_card'] = 0.0   # cannot compute z-score for single transaction

    # ── Card frequency features ───────────────────────────────────────────────
    df['card1_count']       = 1
    df['card2_count']       = 1
    df['card_combo_count']  = 1

    # ── Email features ────────────────────────────────────────────────────────
    df['p_email_count']      = 1
    df['r_email_count']      = 1
    if 'P_emaildomain' in df.columns and 'R_emaildomain' in df.columns:
        df['email_domain_match'] = (
            df['P_emaildomain'] == df['R_emaildomain']
        ).astype(int)
    else:
        df['email_domain_match'] = 0

    # ── Address features ──────────────────────────────────────────────────────
    if 'addr1' in df.columns and 'addr2' in df.columns:
        df['addr_match']  = (df['addr1'] == df['addr2']).astype(int)
        df['addr1_count'] = 1
    else:
        df['addr_match']  = 0
        df['addr1_count'] = 1

    # ── Frequency encode categoricals ─────────────────────────────────────────
    cat_cols = df.select_dtypes(include='object').columns.tolist()
    for col in cat_cols:
        df[col + '_freq'] = 1    # default frequency = 1 for unseen values
    df = df.drop(columns=cat_cols, errors='ignore')

    # ── Align to training feature columns ────────────────────────────────────
    # Add missing columns as -999
    for col in feature_cols:
        if col not in df.columns:
            df[col] = -999

    # Keep only training columns in correct order
    df = df[feature_cols]

    # ── Fix infinity and NaN ──────────────────────────────────────────────────
    df = df.replace([np.inf, -np.inf], np.nan).fillna(-999)
    df = df.clip(-1e9, 1e9)

    return df


def get_risk_level(probability: float, threshold: float = 0.5) -> str:
    """Convert fraud probability to a human-readable risk level"""
    if probability >= 0.7:
        return "High"
    elif probability >= threshold:
        return "Medium"
    else:
        return "Low"


def get_shap_explanation(explainer, df_processed: pd.DataFrame,
                          feature_cols: list, top_n: int = 10) -> list:
    """
    Returns top N features that influenced this prediction.
    Positive SHAP = pushed toward fraud
    Negative SHAP = pushed toward legitimate
    """
    if explainer is None:
        return []

    try:
        shap_values = explainer.shap_values(df_processed)

        # For binary classification — take fraud class
        if isinstance(shap_values, list):
            shap_values = shap_values[1]

        # Build explanation list
        explanation = []
        for i, col in enumerate(feature_cols):
            explanation.append({
                'feature'    : col,
                'value'      : float(df_processed[col].iloc[0]),
                'shap_value' : float(shap_values[0][i]),
                'direction'  : 'increases fraud risk' if shap_values[0][i] > 0
                               else 'decreases fraud risk'
            })

        # Sort by absolute SHAP value — most impactful first
        explanation.sort(key=lambda x: abs(x['shap_value']), reverse=True)
        return explanation[:top_n]

    except Exception as e:
        print(f"SHAP explanation failed: {e}")
        return []