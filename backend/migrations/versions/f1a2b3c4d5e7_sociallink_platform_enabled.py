"""sociallink platform + enabled; seed canonical rows

Revision ID: f1a2b3c4d5e7
Revises: e5f9a2b1c4d6
Create Date: 2026-04-30

"""
from alembic import op
from sqlalchemy import text

revision = "f1a2b3c4d5e7"
down_revision = "e5f9a2b1c4d6"
branch_labels = None
depends_on = None

# Predefined icons (paths under frontend public/). Admins only edit href + visibility.
_CANONICAL_SOCIAL_ROWS = [
    ("facebook", "https://www.facebook.com/", "/img/socials/facebook.png", "Facebook", "social_media"),
    ("instagram", "https://www.instagram.com/", "/img/socials/instagram.png", "Instagram", "social_media"),
    ("youtube", "https://www.youtube.com/", "/img/socials/youtube.png", "YouTube", "streaming"),
    ("spotify", "https://open.spotify.com/", "/img/socials/spotify.png", "Spotify", "streaming"),
    ("twitter", "https://twitter.com/", "/img/socials/twitter.png", "X / Twitter", "social_media"),
    ("bandcamp", "https://bandcamp.com/", "/img/socials/bandcamp.png", "Bandcamp", "merch"),
    ("email", "mailto:", "/img/socials/email.png", "Email", "email"),
]


def upgrade():
    conn = op.get_bind()
    existing = {row[1] for row in conn.execute(text("PRAGMA table_info(sociallink)")).fetchall()}
    # Idempotent: partial runs may have added columns before failing.
    if "enabled" not in existing:
        conn.execute(
            text("ALTER TABLE sociallink ADD COLUMN enabled INTEGER NOT NULL DEFAULT 1")
        )
    if "platform" not in existing:
        conn.execute(text("ALTER TABLE sociallink ADD COLUMN platform VARCHAR(32)"))
    conn.execute(
        text("CREATE UNIQUE INDEX IF NOT EXISTS uq_sociallink_platform ON sociallink (platform)")
    )
    uid = conn.execute(text("SELECT id FROM user ORDER BY id ASC LIMIT 1")).scalar()
    if uid is not None:
        for platform, href, img, label, cat in _CANONICAL_SOCIAL_ROWS:
            exists = conn.execute(
                text("SELECT id FROM sociallink WHERE platform = :p"),
                {"p": platform},
            ).fetchone()
            if exists:
                continue
            conn.execute(
                text(
                    "INSERT INTO sociallink (href_url, img_url, text, category, created_by_user_id, enabled, platform) "
                    "VALUES (:href, :img, :text, :cat, :uid, :en, :pf)"
                ),
                {
                    "href": href,
                    "img": img,
                    "text": label,
                    "cat": cat,
                    "uid": uid,
                    "en": False,
                    "pf": platform,
                },
            )


def downgrade():
    op.execute(text("DROP INDEX IF EXISTS uq_sociallink_platform"))
    # SQLite cannot DROP COLUMN in older versions; no-op for column removal.
