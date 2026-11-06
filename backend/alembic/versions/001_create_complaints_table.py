"""create complaints table

Revision ID: 001_create_complaints
Revises: 
Create Date: 2026-11-06 12:30:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_create_complaints'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'complaints',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('model_used', sa.String(length=50), nullable=False),
        sa.Column('suggested_department', sa.String(length=100), nullable=False),
        sa.Column('urgency', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_complaints_category'), 'complaints', ['category'], unique=False)
    op.create_index(op.f('ix_complaints_created_at'), 'complaints', ['created_at'], unique=False)
    op.create_index(op.f('ix_complaints_model_used'), 'complaints', ['model_used'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_complaints_model_used'), table_name='complaints')
    op.drop_index(op.f('ix_complaints_created_at'), table_name='complaints')
    op.drop_index(op.f('ix_complaints_category'), table_name='complaints')
    op.drop_table('complaints')
