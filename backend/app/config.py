"""Application Configuration for Smart Customer Complaint Router Backend.

Defines filesystem paths, model parameters, routing ontologies,
and model metadata benchmarks.
"""

import os
from pathlib import Path
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

# Base directories (relative to backend folder)
# config.py is located at backend/app/config.py
APP_DIR: Path = Path(__file__).resolve().parent
BASE_DIR: Path = APP_DIR.parent
MODELS_DIR: Path = BASE_DIR / "models"

# Load environment variables from backend/.env if present
load_dotenv(BASE_DIR / ".env")

# ---------------------------------------------------------------------------
# Database & Authentication Configuration
# ---------------------------------------------------------------------------
def _normalize_database_url(url: Optional[str]) -> Optional[str]:
    """Normalize Postgres URL for SQLAlchemy 2.0 and Neon compatibility."""
    if not url or not url.strip():
        return None
    cleaned = url.strip()
    # Replace obsolete postgres:// scheme with postgresql://
    if cleaned.startswith("postgres://"):
        cleaned = "postgresql://" + cleaned[len("postgres://"):]
    # Ensure SSL is enabled for Neon cloud instances if not already present
    if "neon.tech" in cleaned and "sslmode" not in cleaned:
        separator = "&" if "?" in cleaned else "?"
        cleaned = f"{cleaned}{separator}sslmode=require"
    return cleaned

RAW_DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
DATABASE_URL: Optional[str] = _normalize_database_url(RAW_DATABASE_URL)

# Admin authentication key for protected history endpoint
ADMIN_API_KEY: Optional[str] = os.getenv("ADMIN_API_KEY", "dev-admin-secret-key-3b8f14a09c")

# Data retention policy (days to retain complaint records, default 90 days)
COMPLAINT_RETENTION_DAYS: int = int(os.getenv("COMPLAINT_RETENTION_DAYS", "90"))

# Model file paths
LOGISTIC_REGRESSION_PATH: Path = MODELS_DIR / "logistic_regression_model.joblib"
DISTILBERT_DIR: Path = MODELS_DIR / "distilbert_model"
METADATA_PATH: Path = MODELS_DIR / "model_metadata.json"

# Inference parameters
MAX_LENGTH: int = 64
ALLOWED_MODELS: List[str] = ["distilbert", "logistic_regression"]

# ---------------------------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------------------------
# Localhost development origins
_DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Configurable origins from environment (comma-separated or single URL)
_env_cors = os.getenv("CORS_ORIGIN", "").strip() or os.getenv("FRONTEND_URL", "").strip()
CORS_ORIGINS: List[str] = list(_DEFAULT_CORS_ORIGINS)
if _env_cors:
    for origin in _env_cors.split(","):
        cleaned = origin.strip().rstrip("/")
        if cleaned and cleaned not in CORS_ORIGINS:
            CORS_ORIGINS.append(cleaned)

# Regular expression to match production and preview Vercel domains securely
# Matches https://<project>.vercel.app and preview domains https://<branch>-<project>.vercel.app
# Prevents unrestricted wildcard CORS in production while enabling Vercel deployments
CORS_ORIGIN_REGEX: str = r"^https:\/\/[a-zA-Z0-9_\-]+\.vercel\.app$"

# ---------------------------------------------------------------------------
# Department Routing Ontology
# ---------------------------------------------------------------------------
# NOTE: The Bitext Customer Support dataset contains 11 intent categories
# but does NOT contain department ground-truth labels. The department mappings
# defined below represent proposed organizational routing destinations
# designed for proposed operational department routing, not ground-truth training targets.
# ---------------------------------------------------------------------------
CATEGORY_DEPARTMENT_MAPPING: Dict[str, str] = {
    "ACCOUNT": "Account Support",
    "CANCEL": "Cancellation Support",
    "CONTACT": "Customer Relations",
    "DELIVERY": "Delivery Support",
    "FEEDBACK": "Customer Feedback Team",
    "INVOICE": "Billing Support",
    "ORDER": "Order Management",
    "PAYMENT": "Payment Support",
    "REFUND": "Refund Support",
    "SHIPPING": "Shipping Support",
    "SUBSCRIPTION": "Subscription Support",
}

# ---------------------------------------------------------------------------
# Model Benchmark Descriptors (Evaluated in Google Colab on held-out test split)
# Used to populate the GET /api/v1/models endpoint matching frontend ModelMetrics.
# ---------------------------------------------------------------------------
MODEL_DESCRIPTORS: Dict[str, Dict[str, Any]] = {
    "distilbert": {
        "id": "distilbert",
        "name": "Fine-tuned DistilBERT",
        "type": "Transformer-based Neural Architecture",
        "accuracy": 99.85,
        "macroPrecision": 99.85,
        "macroRecall": 99.88,
        "macroF1": 99.86,
        "misclassifiedSamples": 4,
        "trainingTimeSec": 193.30,
        "checkpoint": "distilbert-base-uncased",
        "maxSeqLength": 64,
        "description": (
            "Fine-tuned transformer model with contextual bidirectional self-attention. "
            "Achieved the highest overall test accuracy and Macro F1 score on the held-out test split."
        ),
        "isRecommended": True,
        "badge": "Recommended Primary Model",
    },
    "logistic_regression": {
        "id": "logistic_regression",
        "name": "TF-IDF + Logistic Regression",
        "type": "Linear Classification Baseline",
        "accuracy": 99.74,
        "macroPrecision": 99.86,
        "macroRecall": 99.76,
        "macroF1": 99.81,
        "misclassifiedSamples": 7,
        "trainingTimeSec": 5.65,
        "vocabularySize": 5202,
        "ngramRange": "(1, 2) Unigrams & Bigrams",
        "description": (
            "High-speed linear baseline utilizing sparse sublinear TF-IDF vectors (unigrams + bigrams). "
            "Achieved 99.74% accuracy on the held-out test split."
        ),
        "isRecommended": False,
        "badge": "Lightweight Baseline",
    },
}
