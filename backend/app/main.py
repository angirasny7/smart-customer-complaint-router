"""FastAPI Application for Smart Customer Complaint Router.

Provides RESTful endpoints for:
- Health check & model readiness (GET /api/v1/health)
- Real-time complaint classification (POST /api/v1/predict)
- Protected audit history inspection (GET /api/v1/history)
- Model architecture benchmark descriptors (GET /api/v1/models)
- Complaint retention policy enforcement (POST /api/v1/history/purge)
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
import uuid

from fastapi import Depends, FastAPI, Header, HTTPException, Security, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config import (
    ADMIN_API_KEY,
    ALLOWED_MODELS,
    COMPLAINT_RETENTION_DAYS,
    CORS_ORIGINS,
    CORS_ORIGIN_REGEX,
    MODEL_DESCRIPTORS,
)
from app.database import (
    check_database_connection,
    get_db,
    is_database_configured,
    purge_expired_complaints,
)
from app.model_loader import (
    are_models_loaded,
    get_model_artifacts,
    load_all_models,
)
from app.models import Complaint
from app.predictor import classify_complaint

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("smart_router_api")


# ---------------------------------------------------------------------------
# Lifespan: Load pre-trained models once during startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler to initialize models on application startup."""
    logger.info("Starting up FastAPI application. Loading pre-trained models...")
    try:
        load_all_models()
        logger.info("Pre-trained models loaded successfully. Backend ready for inference.")
    except Exception as exc:
        logger.error(
            "CRITICAL: Failed to load models on startup: %s. "
            "Inference endpoints will return 503 until resolved.",
            str(exc),
            exc_info=True,
        )

    if is_database_configured():
        if check_database_connection():
            logger.info("PostgreSQL database connection verified and operational.")
        else:
            logger.warning("PostgreSQL database configured but connectivity check failed.")
    else:
        logger.info("No DATABASE_URL configured. Running without persistent database storage.")

    yield
    logger.info("Shutting down FastAPI application.")


# ---------------------------------------------------------------------------
# FastAPI Instance & Middleware
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Smart Customer Complaint Router API",
    description=(
        "Production inference service for automated complaint classification "
        "and department routing powered by fine-tuned DistilBERT and TF-IDF Logistic Regression. "
        "Supports persistent audit history backed by Neon PostgreSQL."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS: allows localhost in development and Vercel domains in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Admin security scheme for protected history endpoint
security_scheme = HTTPBearer(auto_error=False)


def verify_admin_access(
    auth: Optional[HTTPAuthorizationCredentials] = Security(security_scheme),
    x_admin_key: Optional[str] = Header(None, alias="X-Admin-Key"),
) -> bool:
    """Verify administrator authentication for sensitive audit data.

    Accepts credentials via:
    1. Authorization: Bearer <ADMIN_API_KEY>
    2. X-Admin-Key: <ADMIN_API_KEY>

    Protects user privacy by preventing public enumeration of complaint records.
    """
    if not ADMIN_API_KEY:
        logger.error("ADMIN_API_KEY is not configured on the server. Rejecting history access.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access is disabled: ADMIN_API_KEY is not configured on the server.",
        )

    token = None
    if isinstance(auth, HTTPAuthorizationCredentials) and auth.credentials:
        token = auth.credentials.strip()
    elif isinstance(x_admin_key, str) and x_admin_key.strip():
        token = x_admin_key.strip()

    if not token or token != ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Administrator authentication required to access complaint audit history.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return True


# ---------------------------------------------------------------------------
# Pydantic Request & Response Schemas
# ---------------------------------------------------------------------------
class PredictRequest(BaseModel):
    """Complaint classification request schema."""
    text: str = Field(
        ...,
        description="Natural language customer complaint inquiry.",
        example="I have not received my order yet",
    )
    model: str = Field(
        default="distilbert",
        description="Model architecture ID ('distilbert' or 'logistic_regression').",
        example="distilbert",
    )


class PredictResponse(BaseModel):
    """Complaint classification response schema matching frontend contract."""
    success: bool = True
    input_text: str
    predicted_category: str
    confidence: float
    model_used: str
    suggested_department: str
    urgency: Optional[str] = None
    explanation: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response schema."""
    status: str
    version: str
    models_loaded: List[str]
    timestamp: str
    database: Optional[str] = None


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------
@app.get("/", tags=["General"])
def root():
    """Service landing endpoint with API metadata and documentation links."""
    return {
        "service": "Smart Customer Complaint Router API",
        "version": "1.0.0",
        "documentation": "/docs",
        "health": "/api/v1/health",
        "models": "/api/v1/models",
    }


@app.get(
    "/api/v1/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Health check & model status",
)
def health_check():
    """Verify backend health, model readiness, and database connectivity."""
    iso_timestamp = datetime.now(timezone.utc).isoformat()

    if not are_models_loaded():
        logger.warning("Health check called but models are offline.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "degraded",
                "version": "1.0.0",
                "models_loaded": [],
                "timestamp": iso_timestamp,
                "message": "Model artifacts are not loaded or initialization failed.",
            },
        )

    db_status = "not_configured"
    if is_database_configured():
        db_status = "online" if check_database_connection() else "offline"

    artifacts = get_model_artifacts()
    return HealthResponse(
        status="online",
        version="1.0.0",
        models_loaded=artifacts.loaded_models,
        timestamp=iso_timestamp,
        database=db_status,
    )


@app.post(
    "/api/v1/predict",
    response_model=PredictResponse,
    tags=["Inference"],
    summary="Classify a customer complaint (Public)",
)
def predict_complaint(
    request: PredictRequest,
    db: Optional[Session] = Depends(get_db),
):
    """Classify natural language customer complaint into one of 11 intent categories.

    Validates inputs, executes inference with the chosen model, maps
    the resulting category to the designated support department, and persists
    successful live predictions to the PostgreSQL database.
    """
    # 1. Validate empty or whitespace-only input
    cleaned_text = request.text.strip() if request.text else ""
    if not cleaned_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Complaint text cannot be empty or solely whitespace.",
        )

    # 2. Validate selected model ID
    normalized_model = request.model.lower().strip()
    if normalized_model not in ALLOWED_MODELS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported model '{request.model}'. Allowed models are: {ALLOWED_MODELS}.",
        )

    # 3. Verify models are ready
    if not are_models_loaded():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Inference service unavailable. Models are not loaded in memory.",
        )

    # 4. Execute prediction
    try:
        prediction_result = classify_complaint(cleaned_text, normalized_model)
    except Exception as exc:
        logger.error("Inference execution failed: %s", str(exc), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(exc)}",
        ) from exc

    # 5. Persist successful live prediction to Neon PostgreSQL (if configured)
    if is_database_configured() and db is not None:
        try:
            complaint_record = Complaint(
                id=uuid.uuid4(),
                text=request.text,
                category=prediction_result["predicted_category"],
                confidence=prediction_result["confidence"],
                model_used=prediction_result["model_used"],
                suggested_department=prediction_result["suggested_department"],
                urgency=None,  # Nullable: dataset lacks urgency ground truth
                created_at=datetime.now(timezone.utc),
            )
            db.add(complaint_record)
            db.commit()
            logger.info(
                "Persisted live complaint record %s to database (category=%s, model=%s)",
                complaint_record.id,
                complaint_record.category,
                complaint_record.model_used,
            )
        except Exception as db_exc:
            db.rollback()
            # Do NOT block the user if persistence fails: log error and return prediction
            logger.error(
                "Database persistence failed (proceeding without blocking inference): %s",
                db_exc,
                exc_info=True,
            )

    return PredictResponse(
        success=True,
        input_text=request.text,
        predicted_category=prediction_result["predicted_category"],
        confidence=prediction_result["confidence"],
        model_used=prediction_result["model_used"],
        suggested_department=prediction_result["suggested_department"],
        urgency=None,       # Scientific integrity: ground truth not present in dataset
        explanation=None,   # Attribution head planned for future scope
    )


@app.get(
    "/api/v1/history",
    tags=["Audit"],
    summary="Fetch processed complaint history (Admin Only)",
)
def get_history(
    authenticated: bool = Depends(verify_admin_access),
    db: Optional[Session] = Depends(get_db),
    limit: int = 100,
    offset: int = 0,
):
    """Retrieve logged complaints from PostgreSQL database.

    Restricted to authenticated administrators to protect customer complaint privacy.
    Returns 503 if the database is not configured or unavailable.
    """
    if not is_database_configured() or db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable. Ensure DATABASE_URL is configured and PostgreSQL instance is reachable.",
        )

    try:
        clamped_limit = max(1, min(limit, 500))
        clamped_offset = max(0, offset)

        records = (
            db.query(Complaint)
            .order_by(Complaint.created_at.desc())
            .offset(clamped_offset)
            .limit(clamped_limit)
            .all()
        )
        return [record.to_dict() for record in records]
    except Exception as exc:
        logger.error("Failed to query complaint history from database: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database query failed: {str(exc)}",
        ) from exc


@app.post(
    "/api/v1/history/purge",
    tags=["Audit"],
    summary="Purge expired complaints per data retention policy (Admin Only)",
)
def purge_history(
    days: Optional[int] = None,
    authenticated: bool = Depends(verify_admin_access),
    db: Optional[Session] = Depends(get_db),
):
    """Enforce data retention policy by purging complaint records older than threshold."""
    if not is_database_configured() or db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable.",
        )

    purged_count = purge_expired_complaints(db, days)
    return {
        "status": "success",
        "retention_days": days or COMPLAINT_RETENTION_DAYS,
        "purged_records": purged_count,
    }


@app.get(
    "/api/v1/models",
    tags=["Metadata"],
    summary="Fetch model architecture benchmarks",
)
def get_models() -> Dict[str, Any]:
    """Retrieve evaluation benchmarks and architecture parameters for both models.

    Field names match the frontend ModelMetrics TypeScript interface exactly.
    """
    return MODEL_DESCRIPTORS
