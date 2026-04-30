"""settings.value: allow long text (BAND_BIO)

Revision ID: e5f9a2b1c4d6
Revises: d4e8a1c2b3f4
Create Date: 2026-04-30

"""
from alembic import op
import sqlalchemy as sa


revision = "e5f9a2b1c4d6"
down_revision = "d4e8a1c2b3f4"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("settings") as batch_op:
        batch_op.alter_column(
            "value",
            existing_type=sa.String(length=256),
            type_=sa.Text(),
            existing_nullable=False,
        )


def downgrade():
    with op.batch_alter_table("settings") as batch_op:
        batch_op.alter_column(
            "value",
            existing_type=sa.Text(),
            type_=sa.String(length=256),
            existing_nullable=False,
        )
