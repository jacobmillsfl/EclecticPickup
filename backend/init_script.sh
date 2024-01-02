#!/bin/bash
# source tafapi/bin/activate
# pip install --upgrade pip
# pip install --no-cache-dir --upgrade -r ./requirements.txt

flask db init
flask db upgrade

# Populate database
python3 manage_db.py --user "${ADMIN_USERNAME}" "${ADMIN_EMAIL}" "${ADMIN_PASSWORD}" --events --settings

# Run app
/home/appuser/.local/bin/uwsgi --ini uwsgi.ini --socket 0.0.0.0:5000 --enable-threads --protocol=http -w wsgi:app