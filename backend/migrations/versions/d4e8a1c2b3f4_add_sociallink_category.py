"""add sociallink category

Revision ID: d4e8a1c2b3f4
Revises: cc45eb6f835d
Create Date: 2026-04-30

"""
from alembic import op
import sqlalchemy as sa


revision = "d4e8a1c2b3f4"
down_revision = "cc45eb6f835d"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "sociallink",
        sa.Column(
            "category",
            sa.String(length=32),
            nullable=False,
            server_default="social_media",
        ),
    )


def downgrade():
    op.drop_column("sociallink", "category")
