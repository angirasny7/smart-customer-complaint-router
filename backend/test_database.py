"""Test Suite for Database Architecture, Privacy, and Persistence in Smart Complaint Router."""

from datetime import datetime, timedelta, timezone
import os
from pathlib import Path
import sys
import unittest
import uuid

# Ensure backend root is on sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import ADMIN_API_KEY, COMPLAINT_RETENTION_DAYS
from app.database import Base, purge_expired_complaints
from app.main import (
    PredictRequest,
    get_history,
    predict_complaint,
    purge_history,
    verify_admin_access,
)
from app.model_loader import load_all_models
from app.models import Complaint


class TestDatabaseAndHistory(unittest.TestCase):
    """Test suite verifying Phase 1 database requirements and privacy controls."""

    @classmethod
    def setUpClass(cls):
        # 1. Initialize models in memory once
        load_all_models()

        # 2. In-memory SQLite engine for localized unit test isolation
        cls.engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
        )
        cls.SessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=cls.engine
        )
        Base.metadata.create_all(bind=cls.engine)

    def test_01_complaint_model_schema_and_types(self):
        """Verify Complaint model columns, UUID generation, nullable urgency, and UTC timestamp."""
        session = self.SessionLocal()
        test_id = uuid.uuid4()
        now_utc = datetime.now(timezone.utc)

        record = Complaint(
            id=test_id,
            text="I need help with my damaged delivery package.",
            category="DELIVERY",
            confidence=0.9850,
            model_used="distilbert",
            suggested_department="Delivery Support",
            urgency=None,  # Must be explicitly nullable
            created_at=now_utc,
        )
        session.add(record)
        session.commit()

        # Query back
        fetched = session.query(Complaint).filter_by(id=test_id).first()
        self.assertIsNotNone(fetched)
        self.assertEqual(fetched.text, "I need help with my damaged delivery package.")
        self.assertEqual(fetched.category, "DELIVERY")
        self.assertAlmostEqual(fetched.confidence, 0.9850, places=4)
        self.assertEqual(fetched.model_used, "distilbert")
        self.assertEqual(fetched.suggested_department, "Delivery Support")
        self.assertIsNone(fetched.urgency)  # Confirms urgency is nullable
        self.assertIsNotNone(fetched.created_at)

        # Verify serialization matching ComplaintRecord
        d = fetched.to_dict()
        self.assertEqual(d["id"], str(test_id))
        self.assertEqual(d["category"], "DELIVERY")
        self.assertEqual(d["model"], "distilbert")
        self.assertEqual(d["department"], "Delivery Support")
        self.assertIsNone(d["urgency"])
        self.assertFalse(d["isDemoSample"])

        session.close()

    def test_02_retention_policy_purging(self):
        """Verify that complaints older than retention period are purged."""
        session = self.SessionLocal()
        old_time = datetime.now(timezone.utc) - timedelta(days=100)
        recent_time = datetime.now(timezone.utc) - timedelta(days=5)

        old_rec = Complaint(
            id=uuid.uuid4(),
            text="Old complaint from 100 days ago",
            category="ORDER",
            confidence=0.95,
            model_used="distilbert",
            suggested_department="Order Management",
            created_at=old_time,
        )
        recent_rec = Complaint(
            id=uuid.uuid4(),
            text="Recent complaint from 5 days ago",
            category="ORDER",
            confidence=0.96,
            model_used="distilbert",
            suggested_department="Order Management",
            created_at=recent_time,
        )
        old_id = old_rec.id
        recent_id = recent_rec.id
        session.add_all([old_rec, recent_rec])
        session.commit()

        # Purge complaints older than 90 days
        purged = purge_expired_complaints(session, retention_days=90)
        self.assertGreaterEqual(purged, 1)

        # Expire session so identity map re-queries database
        session.expire_all()

        # Verify old record is removed, recent record remains
        remaining_old = session.query(Complaint).filter_by(id=old_id).first()
        remaining_recent = session.query(Complaint).filter_by(id=recent_id).first()
        self.assertIsNone(remaining_old)
        self.assertIsNotNone(remaining_recent)

        session.close()

    def test_03_admin_access_verification(self):
        """Verify that verify_admin_access strictly protects admin endpoints."""
        # Missing credentials -> 401
        with self.assertRaises(HTTPException) as ctx:
            verify_admin_access(auth=None, x_admin_key=None)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("Administrator authentication required", ctx.exception.detail)

        # Invalid Bearer token -> 401
        with self.assertRaises(HTTPException) as ctx:
            invalid_auth = HTTPAuthorizationCredentials(scheme="Bearer", credentials="wrong-token")
            verify_admin_access(auth=invalid_auth, x_admin_key=None)
        self.assertEqual(ctx.exception.status_code, 401)

        # Invalid X-Admin-Key header -> 401
        with self.assertRaises(HTTPException) as ctx:
            verify_admin_access(auth=None, x_admin_key="invalid-key")
        self.assertEqual(ctx.exception.status_code, 401)

        # Valid Bearer token -> True
        valid_auth = HTTPAuthorizationCredentials(scheme="Bearer", credentials=ADMIN_API_KEY)
        self.assertTrue(verify_admin_access(auth=valid_auth, x_admin_key=None))

        # Valid X-Admin-Key header -> True
        self.assertTrue(verify_admin_access(auth=None, x_admin_key=ADMIN_API_KEY))

    def test_04_public_predict_endpoint_success_and_contract(self):
        """Verify that predict_complaint functions publicly without admin credentials and returns full schema."""
        req = PredictRequest(
            text="I was charged twice for my subscription invoice.",
            model="distilbert",
        )
        session = self.SessionLocal()

        # Execute prediction synchronously
        res = predict_complaint(request=req, db=session)
        self.assertTrue(res.success)
        self.assertEqual(res.input_text, req.text)
        self.assertEqual(res.predicted_category, "INVOICE")
        self.assertIn("Billing Support", res.suggested_department)
        self.assertEqual(res.model_used, "distilbert")
        self.assertIsNone(res.urgency)  # Scientific integrity
        self.assertGreater(res.confidence, 0.8)

        session.close()

    def test_05_predict_validation_empty_input(self):
        """Verify that empty or whitespace input is rejected with 400 Bad Request."""
        req = PredictRequest(text="   ", model="distilbert")
        with self.assertRaises(HTTPException) as ctx:
            predict_complaint(request=req, db=None)
        self.assertEqual(ctx.exception.status_code, 400)

    def test_06_predict_graceful_database_failure(self):
        """Verify that if database persistence fails, the prediction result is still returned."""
        req = PredictRequest(
            text="My delivery has not arrived yet.",
            model="logistic_regression",
        )
        # Pass a mock DB session that throws on commit
        class FailingSession:
            def add(self, obj):
                pass
            def commit(self):
                raise RuntimeError("Simulated database connection timeout")
            def rollback(self):
                pass

        failing_session = FailingSession()
        # Even with DB failure, prediction must succeed
        res = predict_complaint(request=req, db=failing_session)
        self.assertTrue(res.success)
        self.assertEqual(res.predicted_category, "SHIPPING")
        self.assertEqual(res.model_used, "logistic_regression")

    def test_07_history_endpoint_handles_unavailable_database(self):
        """Verify that get_history returns 503 rather than empty list when DB is unavailable."""
        # When DB session is None or DATABASE_URL is unset, get_history must return 503
        with self.assertRaises(HTTPException) as ctx:
            get_history(authenticated=True, db=None)
        self.assertEqual(ctx.exception.status_code, 503)
        self.assertIn("Database service unavailable", ctx.exception.detail)

    def test_08_history_endpoint_retrieves_records_when_connected(self):
        """Verify that get_history queries and serializes records when DB is connected."""
        session = self.SessionLocal()
        test_rec = Complaint(
            id=uuid.uuid4(),
            text="Testing history retrieval",
            category="ACCOUNT",
            confidence=0.99,
            model_used="distilbert",
            suggested_department="Account Support",
            urgency=None,
            created_at=datetime.now(timezone.utc),
        )
        session.add(test_rec)
        session.commit()

        # Temporarily mock is_database_configured to True
        import app.main as main_module
        orig_is_configured = main_module.is_database_configured
        main_module.is_database_configured = lambda: True

        try:
            records = get_history(authenticated=True, db=session)
            self.assertIsInstance(records, list)
            self.assertGreaterEqual(len(records), 1)
            first = records[0]
            self.assertIn("id", first)
            self.assertIn("text", first)
            self.assertIn("category", first)
            self.assertIn("confidence", first)
            self.assertIn("department", first)
            self.assertIn("timestamp", first)
            self.assertIsNone(first.get("urgency"))
            self.assertFalse(first.get("isDemoSample"))
        finally:
            main_module.is_database_configured = orig_is_configured
            session.close()


if __name__ == "__main__":
    unittest.main()
