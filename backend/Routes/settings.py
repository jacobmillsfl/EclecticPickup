from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from Models.database import db
from Models.setting import Settings

setting_bp = Blueprint('settings', __name__)

@setting_bp.route('/settings', methods=['GET'])
def get_all_settings():
    settings = Settings.query.all()
    setting_list = [{
        'id': setting.id,
        'name': setting.name,
        'value': setting.value
    } for setting in settings]
    return jsonify({'message': 'All settings', 'data': setting_list}), 200

@setting_bp.route('/settings/<int:setting_id>', methods=['GET'])
def get_setting_by_id(setting_id):
    setting = Settings.query.get(setting_id)
    if setting:
        setting_data = {
            'id': setting.id,
            'name': setting.name,
            'value': setting.value
        }
        return jsonify({'message': 'Setting found', 'data': setting_data}), 200
    else:
        return jsonify({'message': 'Setting not found'}), 404

@setting_bp.route('/settings/name/<string:setting_name>', methods=['GET'])
def get_setting_by_name(setting_name):
    setting = Settings.query.filter_by(name=setting_name).first()
    if setting:
        setting_data = {
            'id': setting.id,
            'name': setting.name,
            'value': setting.value
        }
        return jsonify({'message': 'Setting found', 'data': setting_data}), 200
    else:
        return jsonify({'message': 'Setting not found'}), 404


@setting_bp.route('/settings', methods=['POST'])
@jwt_required()
def create_setting():
    if 'admin' not in get_jwt_identity().get('scope', []):
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    new_setting = Settings(
        name=data['name'],
        value=data['value']
    )
    db.session.add(new_setting)
    db.session.commit()
    return jsonify({'message': 'Setting created successfully'}), 200

@setting_bp.route('/settings/<int:setting_id>', methods=['PUT'])
@jwt_required()
def edit_setting(setting_id):
    if 'admin' not in get_jwt_identity().get('scope', []):
        return jsonify({'message': 'Unauthorized'}), 403

    setting = Settings.query.get(setting_id)
    if not setting:
        return jsonify({'message': 'Setting not found'}), 404

    data = request.get_json()
    setting.name = data.get('name', setting.name)
    setting.value = data.get('value', setting.value)
    
    db.session.commit()
    return jsonify({'message': 'Setting updated successfully'}), 200

@setting_bp.route('/settings/<int:setting_id>', methods=['DELETE'])
@jwt_required()
def delete_setting(setting_id):
    if 'admin' not in get_jwt_identity().get('scope', []):
        return jsonify({'message': 'Unauthorized'}), 403

    setting = Settings.query.get(setting_id)
    if not setting:
        return jsonify({'message': 'Setting not found'}), 404

    db.session.delete(setting)
    db.session.commit()
    return jsonify({'message': 'Setting deleted successfully'}), 200
