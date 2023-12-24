from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
import jwt

from Utils.CryptoManager import CryptoManager
from Utils.ConfigManager import ConfigManager
from Models.user import User
from Models.database import db

auth_bp = Blueprint('auth', __name__)
config = ConfigManager.get_config()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data:
        return jsonify({'message': 'Invalid request'})
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'All fields are required'}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'message': 'Username taken'}), 400
    else:
        # Hash the password securely before storing it
        hashed_password = CryptoManager.hash_password(password)
        active_status = 0
        initial_scope = "admin"
        initial_desc = ""

        # Create a new User object
        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            active=active_status,
            scope=initial_scope,
            about=initial_desc
        )

        # Add the new user to the session and commit changes to the database
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Successfully created user'}), 200


@auth_bp.route('/login', methods=['POST'])
def login():
    # Validate username + password hash against database
    # If valid, issue JWT
    data = request.json
    if not data:
        return jsonify({'message': 'Invalid request'})

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'username and password required'}), 400

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'message': 'user not found'}), 400
    elif CryptoManager.check_password(password, user.password):
        claims = {
            'iss': 'api.eclecticpickup.com',  # Issuer
            'sub': {
                'id': user.id,
                'username': user.username,
                'scope': user.scope,
                'active': user.active
            },
            'exp': datetime.utcnow() + timedelta(days=30),  # Expiration Time
            'iat': datetime.utcnow(),  # Issued At
        }
        token = jwt.encode(claims, config.jwt_secret, algorithm='HS256')
        return jsonify({'token': token})
    else:
        return jsonify({'message': 'incorrect password'}), 400
