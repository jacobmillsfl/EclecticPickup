"""use instagram.jpg and youtube.jpg for social icon paths

Revision ID: d4e5f6a7b8c0
Revises: b2c3d4e5f6a8
Create Date: 2026-04-30

"""
from alembic import op
from sqlalchemy import text

revision = "d4e5f6a7b8c0"
down_revision = "b2c3d4e5f6a8"
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    conn.execute(
        text(
            "UPDATE sociallink SET img_url = '/img/socials/instagram.jpg' "
            "WHERE platform = 'instagram'"
        )
    )
    conn.execute(
        text(
            "UPDATE sociallink SET img_url = '/img/socials/youtube.jpg' "
            "WHERE platform = 'youtube'"
        )
    )


def downgrade():
    conn = op.get_bind()
    conn.execute(
        text(
            "UPDATE sociallink SET img_url = '/img/socials/instagram.png' "
            "WHERE platform = 'instagram'"
        )
    )
    conn.execute(
        text(
            "UPDATE sociallink SET img_url = '/img/socials/youtube.png' "
            "WHERE platform = 'youtube'"
        )
    )
