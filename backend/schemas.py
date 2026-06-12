from pydantic import BaseModel, Field
from typing import Optional, List, Dict


# ─── INPUT SCHEMA ────────────────────────────────────────────────────────────
# This defines what the API expects when someone sends a transaction
# Every field matches a column the model was trained on

class TransactionInput(BaseModel):
    TransactionAmt  : float  = Field(...,  example=150.00,  description="Transaction amount in USD")
    ProductCD       : str    = Field(...,  example="W",     description="Product code (W/H/C/S/R)")
    card1           : float  = Field(...,  example=9500.0,  description="Card type 1")
    card2           : float  = Field(None, example=360.0,   description="Card type 2")
    card3           : float  = Field(None, example=150.0,   description="Card type 3")
    card5           : float  = Field(None, example=226.0,   description="Card type 5")
    card4           : str    = Field(None, example="visa",  description="Card network")
    card6           : str    = Field(None, example="debit", description="Card type debit/credit")
    addr1           : float  = Field(None, example=315.0,   description="Billing address")
    addr2           : float  = Field(None, example=87.0,    description="Country code")
    dist1           : float  = Field(None, example=19.0,    description="Distance 1")
    P_emaildomain   : str    = Field(None, example="gmail.com",   description="Purchaser email domain")
    R_emaildomain   : str    = Field(None, example="gmail.com",   description="Recipient email domain")
    TransactionDT   : float  = Field(None, example=86400.0, description="Seconds from reference time")
    C1              : float  = Field(None, example=1.0)
    C2              : float  = Field(None, example=1.0)
    C3              : float  = Field(None, example=0.0)
    C4              : float  = Field(None, example=0.0)
    C5              : float  = Field(None, example=0.0)
    C6              : float  = Field(None, example=1.0)
    C7              : float  = Field(None, example=0.0)
    C8              : float  = Field(None, example=0.0)
    C9              : float  = Field(None, example=1.0)
    C10             : float  = Field(None, example=0.0)
    C11             : float  = Field(None, example=1.0)
    C12             : float  = Field(None, example=0.0)
    C13             : float  = Field(None, example=20.0)
    C14             : float  = Field(None, example=1.0)

    class Config:
        # Allows extra fields to be passed without error
        extra = "allow"


# ─── OUTPUT SCHEMA ───────────────────────────────────────────────────────────
# This defines what the API returns after scoring a transaction

class PredictionOutput(BaseModel):
    fraud_probability : float        # 0.0 to 1.0
    fraud_predicted   : bool         # True if fraud
    risk_level        : str          # "Low" / "Medium" / "High"
    threshold_used    : float        # decision threshold
    top_features      : List[Dict]   # SHAP explanation — top features


# ─── BATCH INPUT SCHEMA ──────────────────────────────────────────────────────
# For uploading multiple transactions at once

class BatchInput(BaseModel):
    transactions: List[TransactionInput]


# ─── METRICS SCHEMA ──────────────────────────────────────────────────────────
# What the /metrics endpoint returns for the dashboard

class ModelMetrics(BaseModel):
    model_name      : str
    auc_roc         : float
    auc_pr          : float
    threshold       : float
    total_features  : int