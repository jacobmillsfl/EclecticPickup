from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from Models.database import db
from Models.bandmember import BandMember
from Utils.Decorators import scope_required, required_fields

bandmember_bp = Blueprint('bandmember', __name__)

@bandmember_bp.route('/bandmembers', methods=['GET'])
def get_all_band_members():
    band_members = BandMember.query.all()
    band_member_list = [{
        'id': member.id,
        'name': member.name,
        'img_url': member.img_url,
        'text': member.text
    } for member in band_members]
    return jsonify({'message': 'All band members', 'data': band_member_list}), 200

@bandmember_bp.route('/bandmembers/<int:member_id>', methods=['GET'])
def get_band_member_by_id(member_id):
    member = BandMember.query.get(member_id)
    if member:
        member_data = {
            'id': member.id,
            'name': member.name,
            'img_url': member.img_url,
            'text': member.text
        }
        return jsonify({'message': 'Band member found', 'data': member_data}), 200
    else:
        return jsonify({'message': 'Band member not found'}), 404

@bandmember_bp.route('/bandmembers', methods=['POST'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["name","img_url","text"])
def create_band_member():
    data = request.get_json()
    new_member = BandMember(
        name=data['name'],
        img_url=data.get('img_url'),
        text=data.get('text')
    )
    db.session.add(new_member)
    db.session.commit()
    db.session.flush()
    member_data = {
        'id': new_member.id,
        'name': new_member.name,
        'img_url': new_member.img_url,
        'text': new_member.text
    }
    return jsonify({'message': 'BandMember created', 'data': member_data}), 200

@bandmember_bp.route('/bandmembers/<int:member_id>', methods=['PUT'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["name","img_url","text"])
def edit_band_member(member_id):
    member = BandMember.query.get(member_id)
    if not member:
        return jsonify({'message': 'Band member not found'}), 404

    data = request.get_json()
    member.name = data.get('name', member.name)
    member.img_url = data.get('img_url', member.img_url)
    member.text = data.get('text', member.text)
    
    db.session.commit()
    return jsonify({'message': 'Band member updated successfully'}), 200

@bandmember_bp.route('/bandmembers/<int:member_id>', methods=['DELETE'])
@jwt_required()
@scope_required(["admin"])
def delete_band_member(member_id):
    member = BandMember.query.get(member_id)
    if not member:
        return jsonify({'message': 'Band member not found'}), 404

    db.session.delete(member)
    db.session.commit()
    return jsonify({'message': 'Band member deleted successfully'}), 200
