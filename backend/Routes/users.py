from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from Models.database import db
from Models.user import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
@jwt_required()  # Requires a valid JWT token
def get_all_users():
    if 'admin' not in get_jwt_identity().get('scope', []):
        return jsonify({'message': 'Unauthorized'}), 403
    
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
@jwt_required()  # Requires a valid JWT token
def get_user_by_id(user_id):
    if 'admin' not in get_jwt_identity().get('scope', []):
        return jsonify({'message': 'Unauthorized'}), 403
    
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
@jwt_required()  # Requires a valid JWT token
def edit_user(user_id):
    current_user_id = get_jwt_identity().get('id')

    # Users can edit their own details or admin can edit any user's details
    if current_user_id != user_id and 'admin' not in get_jwt_identity().get('scope', []):
        return jsonify({'message': 'Unauthorized'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json()
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.active = data.get('active', user.active)
    user.scope = data.get('scope', user.scope)
    user.about = data.get('about', user.about)
    if 'password' in data:  # Allow update of password if provided
        user.password = data['password']
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()  # Requires a valid JWT token
def delete_user(user_id):
    if 'admin' not in get_jwt_identity().get('scope', []):
        return jsonify({'message': 'Unauthorized'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200
