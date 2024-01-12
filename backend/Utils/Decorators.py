from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity

def scope_required(scopes: list):
    """ Only allows access if one of the provided scopes is available """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            identity_scopes = get_jwt_identity().get('scope', [])
            authorized = any(scope in identity_scopes for scope in scopes)
            if not authorized:
                return jsonify({'message': 'Unauthorized'}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorator

def user_edit_permission(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = kwargs.get('user_id')
        current_user_id = get_jwt_identity().get('id')
        identity_scopes = get_jwt_identity().get('scope', [])

        if current_user_id != user_id and 'admin' not in identity_scopes:
            return jsonify({'message': 'Unauthorized'}), 403

        return func(*args, **kwargs)
    return wrapper

def required_fields(fields):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            data = request.get_json()

            for field in fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} cannot be empty'}), 400

            return func(*args, **kwargs)

        return wrapper

    return decorator