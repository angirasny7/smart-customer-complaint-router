"""SQLAlchemy Data Models for Smart Customer Complaint Router."""

from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, Float, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Complaint(Base):
    """Persistent audit record for live classified customer complaints.

    Attributes:
        id: Unique UUID primary key generated via uuid.uuid4().
        text: Original customer complaint message.
        category: Predicted 1 of 11 intent classes.
        confidence: Model probability score [0.0, 1.0].
        model_used: Active model identifier ('distilbert' or 'logistic_regression').
        suggested_department: Mapped support department.
        urgency: Explicitly nullable (dataset lacks urgency ground truth).
        created_at: Timezone-aware UTC timestamp of live inference.
    """
    __tablename__ = "complaints"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    confidence = Column(Float, nullable=False)
    model_used = Column(String(50), nullable=False, index=True)
    suggested_department = Column(String(100), nullable=False)
    urgency = Column(String(50), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    def to_dict(self):
        """Serialize complaint entity matching frontend ComplaintRecord interface."""
        return {
            "id": str(self.id),
            "text": self.text,
            "category": self.category,
            "confidence": round(float(self.confidence), 4),
            "model": self.model_used,
            "department": self.suggested_department,
            "urgency": self.urgency,
            "timestamp": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else "",
            "isDemoSample": False,
        }
