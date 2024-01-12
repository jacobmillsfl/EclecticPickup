from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from Models.database import db
from Models.setting import Settings
from Utils.Decorators import scope_required, required_fields

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
@scope_required(["admin"])
@required_fields(["name","value"])
def create_setting():
    data = request.get_json()
    new_setting = Settings(
        name=data['name'],
        value=data['value']
    )
    db.session.add(new_setting)
    db.session.commit()
    db.session.flush()
    setting_data = {
        'id': new_setting.id,
        'name': new_setting.name,
        'value': new_setting.value,
    }
    return jsonify({'message': 'Setting created', 'data': setting_data}), 200

@setting_bp.route('/settings/<int:setting_id>', methods=['PUT'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["name","value"])
def edit_setting(setting_id):
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
@scope_required(["admin"])
def delete_setting(setting_id):

    setting = Settings.query.get(setting_id)
    if not setting:
        return jsonify({'message': 'Setting not found'}), 404

    db.session.delete(setting)
    db.session.commit()
    return jsonify({'message': 'Setting deleted successfully'}), 200
