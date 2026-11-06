"""Database Connection and Session Management for Smart Complaint Router.

Uses SQLAlchemy 2.0 with PostgreSQL (Neon-ready).
Supports:
- Safe pool pre-ping and recycling for serverless PostgreSQL.
- Graceful degradation when DATABASE_URL is not configured.
- Automated session teardown.
- Complaint retention policy enforcement.
"""

from datetime import datetime, timedelta, timezone
import logging
from typing import Generator, Optional

from sqlalchemy import create_engine, select, delete, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.engine import Engine

from app.config import DATABASE_URL, COMPLAINT_RETENTION_DAYS

logger = logging.getLogger(__name__)

Base = declarative_base()

_engine: Optional[Engine] = None
_SessionFactory: Optional[sessionmaker] = None


def get_engine() -> Optional[Engine]:
    """Initialize and retrieve the singleton SQLAlchemy engine."""
    global _engine, _SessionFactory
    if not DATABASE_URL:
        return None

    if _engine is None:
        try:
            logger.info("Initializing SQLAlchemy 2.0 engine for PostgreSQL...")
            _engine = create_engine(
                DATABASE_URL,
                pool_pre_ping=True,      # Tests connection liveness before checkout
                pool_recycle=300,        # Recycles connections every 5 minutes (ideal for Neon serverless)
                pool_size=5,             # Conservative connection pool for serverless tier
                max_overflow=10,
                future=True,
            )
            _SessionFactory = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=_engine,
                expire_on_commit=False,
            )
            logger.info("SQLAlchemy engine initialized successfully.")
        except Exception as exc:
            logger.error("Failed to initialize database engine: %s", exc, exc_info=True)
            _engine = None
            _SessionFactory = None

    return _engine


def is_database_configured() -> bool:
    """Check if a valid database URL is configured in the environment."""
    return bool(DATABASE_URL)


def check_database_connection() -> bool:
    """Test actual connectivity to PostgreSQL database by executing a ping."""
    engine = get_engine()
    if engine is None:
        return False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.warning("Database connectivity ping failed: %s", exc)
        return False


def get_db() -> Generator[Optional[Session], None, None]:
    """Dependency provider yielding a SQLAlchemy session.
    
    If the database is not configured, yields None.
    Guarantees session rollback and closure on completion.
    """
    get_engine()
    if _SessionFactory is None:
        yield None
        return

    session = _SessionFactory()
    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def purge_expired_complaints(db: Session, retention_days: Optional[int] = None) -> int:
    """Delete complaint records older than the configured retention policy.
    
    Returns the number of deleted records.
    """
    from app.models import Complaint

    days = retention_days or COMPLAINT_RETENTION_DAYS
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)

    try:
        stmt = delete(Complaint).where(Complaint.created_at < cutoff_date)
        result = db.execute(stmt)
        db.commit()
        deleted_count = result.rowcount or 0
        if deleted_count > 0:
            logger.info("Data retention: purged %d complaints older than %s", deleted_count, cutoff_date.isoformat())
        return deleted_count
    except Exception as exc:
        db.rollback()
        logger.error("Failed to purge expired complaints: %s", exc)
        return 0
