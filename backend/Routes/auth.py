from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from Utils.Decorators import required_fields, scope_required
from flask_jwt_extended import jwt_required
import jwt

from Utils.CryptoManager import CryptoManager
from Utils.ConfigManager import ConfigManager
from Models.user import User
from Models.database import db

auth_bp = Blueprint('auth', __name__)
config = ConfigManager.get_config()

@auth_bp.route('/register', methods=['POST'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["username", "email", "password", "scope", "active", "about"])
def register():
    data = request.json
    if not data:
        return jsonify({'message': 'Invalid request'}), 400
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    scope = data.get('scope')
    active = data.get('active')
    about = data.get('about')

    # Validate data
    if not username or not email or not password:
        return jsonify({'message': 'All fields are required'}), 400
    
    if scope not in ["moderator", "user", ""]:
        return jsonify({'message': 'Invalid scope'}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'message': 'Username taken'}), 400
    
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'message': 'Email taken'}), 400

    # Hash the password securely before storing it
    hashed_password = CryptoManager.hash_password(password)

    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        active=active,
        scope=scope,
        about=about
    )

    db.session.add(new_user)
    db.session.commit()
    db.session.flush()
    user_data = {
        'id': new_user.id,
        'username': new_user.username,
        'email': new_user.email,
        'active': new_user.active,
        'scope': new_user.scope,
        'about': new_user.about,
    }
    return jsonify({'message': 'User created', 'data': user_data}), 200    
    


@auth_bp.route('/login', methods=['POST'])
def login():
    # Validate username + password hash against database
    # If valid, issue JWT
    data = request.json
    if not data:
        return jsonify({'message': 'Invalid request'}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'message': 'User not found'}), 400
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
        return jsonify({'message': token}), 200
    else:
        return jsonify({'message': 'Incorrect password'}), 400
