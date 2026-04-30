#!/bin/bash

# Legacy layout: SQLite lived next to app code (not on the compose-mounted instance/ volume).
# Move once so migrations, manage_db, and Flask all use the same persisted file.
mkdir -p /home/appuser/app/instance
if [[ -f /home/appuser/app/database.db ]] && [[ ! -f /home/appuser/app/instance/database.db ]]; then
  echo "Moving legacy database.db into instance/ (persisted volume)..."
  mv /home/appuser/app/database.db /home/appuser/app/instance/database.db
fi

echo "Applying any pending migrations..."
# Always run upgrade (creates instance/database.db on first boot). Do NOT use
# `flask db stamp head` here — if it runs on a fresh/empty DB it can mark Alembic
# as "at head" without applying migration SQL, breaking the schema.
if ! flask db upgrade; then
    echo "ERROR: flask db upgrade failed — fix migrations or DB permissions before continuing."
    exit 1
fi

# Bootstrap admin + seed data (credentials from .backend.env via Docker env_file).
# Login checks the `user` table only — these env vars are not read by /login directly.
# Path must match app.py (instance/database.db on the mounted volume).
DB_FILE="/home/appuser/app/instance/database.db"
# Trim spaces — a trailing space in .env would hash a different password than typing it in the login form.
_admin_trim() { printf '%s' "$1" | tr -d '\r' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'; }
ADMIN_USER_TR="$(_admin_trim "${ADMIN_USERNAME:-}")"
ADMIN_EMAIL_TR="$(_admin_trim "${ADMIN_EMAIL:-}")"
ADMIN_PASS_TR="$(_admin_trim "${ADMIN_PASSWORD:-}")"
if [[ -n "${ADMIN_USER_TR}" && -n "${ADMIN_PASS_TR}" && -n "${ADMIN_EMAIL_TR}" ]]; then
  echo "Running database bootstrap (idempotent via changelog)..."
  if ! python3 manage_db.py --database "${DB_FILE}" --user "${ADMIN_USER_TR}" "${ADMIN_EMAIL_TR}" "${ADMIN_PASS_TR}"; then
    echo "ERROR: manage_db.py failed — check logs above (duplicate seed rows, DB permissions, etc.)."
    exit 1
  fi
else
  echo "WARNING: ADMIN_USERNAME, ADMIN_PASSWORD, or ADMIN_EMAIL unset — skipping manage_db.py bootstrap."
fi

# Run app
echo "Launching Flask App through uwsgi"
/home/appuser/.local/bin/uwsgi --ini uwsgi.ini --socket 0.0.0.0:5000 --enable-threads --protocol=http -w wsgi:app