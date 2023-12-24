#!/bin/bash
# This script creates the initial environment files and installs all dependencies for the application

read -p "Enter the API's base URL: " API_URL
JWT_SECRET=`openssl rand -base64 48`

cat << EOF > backend/.backend.env
FLASK_API_BASE_URL="$API_URL"
JWT_SECRET="$JWT_SECRET"
EOF

cat << EOF > frontend/.frontend.env
REACT_APP_API_URL="$API_URL"
FAST_REFRESH=false
EOF