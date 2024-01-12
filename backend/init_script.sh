#!/bin/bash

# Migrate database
flask db init
flask db upgrade

# Populate database
python3 manage_db.py --database "/home/appuser/app/instance/database.db" --user "${ADMIN_USERNAME}" "${ADMIN_EMAIL}" "${ADMIN_PASSWORD}"

# Run app
/home/appuser/.local/bin/uwsgi --ini uwsgi.ini --socket 0.0.0.0:5000 --enable-threads --protocol=http -w wsgi:app