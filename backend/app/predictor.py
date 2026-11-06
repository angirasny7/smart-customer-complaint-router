"""Prediction Service for Smart Customer Complaint Router.

Executes inference using either:
1. TF-IDF Vectorizer + Logistic Regression classifier.
2. Fine-tuned DistilBERT sequence classification model.

Maps predicted category to designated organizational support department.
"""

import logging
from typing import Any, Dict
import torch

from app.config import (
    ALLOWED_MODELS,
    CATEGORY_DEPARTMENT_MAPPING,
    MAX_LENGTH,
)
from app.model_loader import get_model_artifacts

logger = logging.getLogger(__name__)


def predict_logistic_regression(
    text: str, artifacts: Any
) -> tuple[str, float]:
    """Execute prediction using TF-IDF Vectorizer + Logistic Regression.

    Args:
        text: Natural language complaint string.
        artifacts: ModelArtifacts container holding vectorizer and classifier.

    Returns:
        tuple of (predicted_category, confidence)
    """
    # 1. Transform raw text into sparse TF-IDF feature vector
    vectorized = artifacts.lr_vectorizer.transform([text])

    # 2. Compute class probability distribution via Logistic Regression
    probabilities = artifacts.lr_classifier.predict_proba(vectorized)[0]

    # 3. Identify highest scoring category and associated score
    max_idx = int(probabilities.argmax())
    predicted_category = str(artifacts.lr_classifier.classes_[max_idx])
    confidence = float(probabilities[max_idx])

    return predicted_category, confidence


def predict_distilbert(
    text: str, artifacts: Any
) -> tuple[str, float]:
    """Execute prediction using fine-tuned DistilBERT transformer.

    Args:
        text: Natural language complaint string.
        artifacts: ModelArtifacts container holding tokenizer and PyTorch model.

    Returns:
        tuple of (predicted_category, confidence)
    """
    # 1. Tokenize text with truncation up to MAX_LENGTH
    inputs = artifacts.bert_tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=MAX_LENGTH,
    )
    inputs = {k: v.to(artifacts.device) for k, v in inputs.items()}

    # 2. Run inference in no_grad mode on CPU
    with torch.no_grad():
        outputs = artifacts.bert_model(**inputs)

    # 3. Apply softmax across logits to produce normalized scores
    probabilities = torch.softmax(outputs.logits, dim=-1)[0]

    # 4. Extract highest-scoring class index and map via id2label
    max_idx = int(probabilities.argmax().item())
    confidence = float(probabilities[max_idx].item())
    predicted_category = artifacts.bert_id2label.get(
        max_idx,
        str(artifacts.bert_model.config.id2label.get(str(max_idx), f"CATEGORY_{max_idx}")),
    )

    return predicted_category, confidence


def classify_complaint(text: str, model_id: str) -> Dict[str, Any]:
    """Unified routing entrypoint for complaint classification.

    Args:
        text: The customer complaint text to classify.
        model_id: One of 'distilbert' or 'logistic_regression'.

    Returns:
        dict containing:
            predicted_category: str
            confidence: float (between 0.0 and 1.0)
            model_used: str
            suggested_department: str

    Raises:
        ValueError: If model_id is unsupported or complaint text is empty.
        RuntimeError: If model artifacts are not loaded in memory.
    """
    cleaned_text = text.strip() if text else ""
    if not cleaned_text:
        raise ValueError("Complaint text cannot be empty or solely whitespace.")

    normalized_model_id = model_id.lower().strip()
    if normalized_model_id not in ALLOWED_MODELS:
        raise ValueError(
            f"Unsupported model '{model_id}'. Allowed models are: {ALLOWED_MODELS}."
        )

    # Retrieve in-memory model artifacts
    artifacts = get_model_artifacts()

    # Route inference to selected model architecture
    if normalized_model_id == "distilbert":
        category, confidence = predict_distilbert(cleaned_text, artifacts)
    elif normalized_model_id == "logistic_regression":
        category, confidence = predict_logistic_regression(cleaned_text, artifacts)
    else:
        raise ValueError(f"Unknown model architecture: {model_id}")

    # Ensure confidence score is strictly bounded [0.0, 1.0]
    bounded_confidence = max(0.0, min(1.0, float(confidence)))

    # Map predicted intent to operational support department
    suggested_department = CATEGORY_DEPARTMENT_MAPPING.get(
        category, "General Support"
    )

    return {
        "predicted_category": category,
        "confidence": round(bounded_confidence, 4),
        "model_used": normalized_model_id,
        "suggested_department": suggested_department,
    }
