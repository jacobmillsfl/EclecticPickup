#!/bin/bash

echo "Checking database connection..."
flask db current || {
    echo "Database not initialized. Setting migration baseline..."
    flask db stamp head
}

echo "Applying any pending migrations..."
flask db upgrade

# Populate database
#python3 manage_db.py --database "/home/appuser/app/instance/database.db" --user "${ADMIN_USERNAME}" "${ADMIN_EMAIL}" "${ADMIN_PASSWORD}"

# Run app
echo "Launching Flask App through uwsgi"
/home/appuser/.local/bin/uwsgi --ini uwsgi.ini --socket 0.0.0.0:5000 --enable-threads --protocol=http -w wsgi:app