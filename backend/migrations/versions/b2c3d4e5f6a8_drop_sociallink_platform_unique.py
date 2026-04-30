"""drop unique constraint on sociallink.platform (allow multiple links per type)

Revision ID: b2c3d4e5f6a8
Revises: f1a2b3c4d5e7
Create Date: 2026-04-30

"""
from alembic import op
from sqlalchemy import text

revision = "b2c3d4e5f6a8"
down_revision = "f1a2b3c4d5e7"
branch_labels = None
depends_on = None


def upgrade():
    op.execute(text("DROP INDEX IF EXISTS uq_sociallink_platform"))


def downgrade():
    op.execute(
        text(
            "CREATE UNIQUE INDEX IF NOT EXISTS uq_sociallink_platform ON sociallink (platform)"
        )
    )
