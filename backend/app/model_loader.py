"""Model Loader for Smart Customer Complaint Router.

Handles loading pre-trained artifact checkpoints:
1. TF-IDF Vectorizer + Logistic Regression classifier from joblib package.
2. Fine-tuned DistilBERT tokenizer and Sequence Classification PyTorch model.

Constraints:
- Models are loaded strictly once on startup.
- local_files_only=True prevents any external network requests or downloads.
- Inference operates in evaluation mode on CPU.
- No training or Trainer dependencies.
"""

import logging
from dataclasses import dataclass
from typing import Any, Dict, List, Optional
import joblib
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

from app.config import DISTILBERT_DIR, LOGISTIC_REGRESSION_PATH

logger = logging.getLogger(__name__)


@dataclass
class ModelArtifacts:
    """Container holding loaded model instances in memory."""
    # Logistic Regression Baseline
    lr_vectorizer: Any
    lr_classifier: Any
    lr_classes: List[str]

    # DistilBERT Primary Model
    bert_tokenizer: Any
    bert_model: Any
    bert_id2label: Dict[int, str]
    device: torch.device

    # Registry tracking
    loaded_models: List[str]


# Global singleton holder for model artifacts
_model_artifacts: Optional[ModelArtifacts] = None


def load_logistic_regression() -> tuple[Any, Any, List[str]]:
    """Load the serialized TF-IDF vectorizer and Logistic Regression classifier."""
    if not LOGISTIC_REGRESSION_PATH.exists():
        raise FileNotFoundError(
            f"Logistic Regression model file not found at: {LOGISTIC_REGRESSION_PATH}. "
            "Ensure 'logistic_regression_model.joblib' is present in backend/models/."
        )

    logger.info("Loading Logistic Regression joblib package from %s", LOGISTIC_REGRESSION_PATH)
    package = joblib.load(LOGISTIC_REGRESSION_PATH)

    if not isinstance(package, dict):
        raise ValueError(
            "Expected joblib package to be a dict containing 'vectorizer', 'classifier', and 'classes'."
        )

    vectorizer = package.get("vectorizer")
    classifier = package.get("classifier")
    classes = package.get("classes")

    if vectorizer is None or classifier is None:
        raise ValueError(
            "Logistic Regression package is missing 'vectorizer' or 'classifier' keys."
        )

    classes_list = list(classes) if classes is not None else list(classifier.classes_)
    logger.info("Logistic Regression loaded successfully. Vocabulary size: %d", len(vectorizer.vocabulary_))
    return vectorizer, classifier, classes_list


def load_distilbert() -> tuple[Any, Any, Dict[int, str], torch.device]:
    """Load the fine-tuned DistilBERT tokenizer and PyTorch model from local directory."""
    if not DISTILBERT_DIR.exists():
        raise FileNotFoundError(
            f"DistilBERT model directory not found at: {DISTILBERT_DIR}. "
            "Ensure the exported 'distilbert_model' folder is present in backend/models/."
        )

    logger.info("Loading DistilBERT tokenizer from local files: %s", DISTILBERT_DIR)
    tokenizer = AutoTokenizer.from_pretrained(
        str(DISTILBERT_DIR),
        local_files_only=True,
    )

    logger.info("Loading DistilBERT sequence classifier from local files: %s", DISTILBERT_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(
        str(DISTILBERT_DIR),
        local_files_only=True,
    )

    # Set model to evaluation mode for CPU inference
    device = torch.device("cpu")
    model.to(device)
    model.eval()

    # Normalize id2label mapping (handles both int and str keys in HF config)
    raw_id2label = getattr(model.config, "id2label", {})
    id2label: Dict[int, str] = {int(k): str(v) for k, v in raw_id2label.items()}

    logger.info(
        "DistilBERT loaded successfully on CPU. Number of output labels: %d",
        model.config.num_labels,
    )
    return tokenizer, model, id2label, device


def load_all_models() -> ModelArtifacts:
    """Load all pre-trained models once during application startup.

    Raises:
        RuntimeError / FileNotFoundError: If any model file is missing or fails to initialize.
    """
    global _model_artifacts

    if _model_artifacts is not None:
        logger.info("Models are already initialized in memory.")
        return _model_artifacts

    try:
        # 1. Load Logistic Regression
        lr_vectorizer, lr_classifier, lr_classes = load_logistic_regression()

        # 2. Load DistilBERT
        bert_tokenizer, bert_model, bert_id2label, device = load_distilbert()

        _model_artifacts = ModelArtifacts(
            lr_vectorizer=lr_vectorizer,
            lr_classifier=lr_classifier,
            lr_classes=lr_classes,
            bert_tokenizer=bert_tokenizer,
            bert_model=bert_model,
            bert_id2label=bert_id2label,
            device=device,
            loaded_models=["distilbert", "logistic_regression"],
        )
        logger.info("All pre-trained models initialized successfully.")
        return _model_artifacts

    except Exception as exc:
        logger.critical("Failed to load pre-trained models: %s", str(exc), exc_info=True)
        _model_artifacts = None
        raise RuntimeError(f"Model initialization failed: {exc}") from exc


def get_model_artifacts() -> ModelArtifacts:
    """Access the loaded model artifacts singleton.

    Raises:
        RuntimeError: If models have not been loaded or initialization failed.
    """
    if _model_artifacts is None:
        raise RuntimeError(
            "Model artifacts are not loaded. The FastAPI application may have failed startup initialization."
        )
    return _model_artifacts


def are_models_loaded() -> bool:
    """Check whether model artifacts are successfully loaded in memory."""
    return _model_artifacts is not None
