#!/bin/bash
# This script creates the initial environment files and installs all dependencies for the application

read -p "Enter the API's base URL: " API_URL
read -p "Enter the Admin User Password: " ADMIN_PASSWORD
read -p "Enter the Admin User Email: " ADMIN_EMAIL
JWT_SECRET_KEY=`openssl rand -base64 48`

# Docker / Compose env_file: avoid quoting the username value — some parsers keep literal quotes,
# which would make login look for a user named \"admin\" instead of admin.
cat << EOF > backend/.backend.env
FLASK_API_BASE_URL="$API_URL"
JWT_SECRET_KEY="$JWT_SECRET_KEY"
ADMIN_USERNAME=admin
ADMIN_PASSWORD="$ADMIN_PASSWORD"
ADMIN_EMAIL="$ADMIN_EMAIL"
EOF

cat << EOF > frontend/.frontend.env
REACT_APP_API_URL="$API_URL"
FAST_REFRESH=false
EOF