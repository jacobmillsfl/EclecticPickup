from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from Models.database import db
from Models.user import User
from Utils.Decorators import scope_required, user_edit_permission, required_fields

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
@jwt_required()
@scope_required(["admin"])
def get_all_users():    
    users = User.query.all()
    user_list = [{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'active': user.active,
        'scope': user.scope,
        'about': user.about
    } for user in users]
    return jsonify({'message': 'All users', 'data': user_list}), 200

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
@scope_required(["admin"])
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if user:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'active': user.active,
            'scope': user.scope,
            'about': user.about
        }
        return jsonify({'message': 'User found', 'data': user_data}), 200
    else:
        return jsonify({'message': 'User not found'}), 404

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@user_edit_permission
@required_fields(["username","email","active","scope","about"])
def edit_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404
    if user.username == "admin":
        return jsonify({'message': 'This user cannot be modified'}), 401
    if data.get("scope") == "admin":
        return jsonify({'message': 'Unauthorized scope'}), 401

    data = request.get_json()
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.active = data.get('active', user.active)
    user.scope = data.get('scope', user.scope)
    user.about = data.get('about', user.about)
    if 'password' in data:  # Allow update of password if provided
        user.password = data['password']
    
    db.session.commit()
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'active': user.active,
        'scope': user.scope,
        'about': user.about,
        'password': user.password,
    }
    return jsonify({'message': 'User updated', 'data': user_data}), 200

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@scope_required(["admin"])
def delete_user(user_id):

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    if user.username == "admin":
        return jsonify({'message': 'This user cannot be modified'}), 401

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200
