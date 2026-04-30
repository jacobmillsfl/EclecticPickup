import os

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from Models.database import db
from Models.bandmember import BandMember
from Utils.Decorators import scope_required, required_fields

bandmember_bp = Blueprint('bandmember', __name__)


def _normalize_img_for_storage(img_url: str) -> str:
    """Store basename for API uploads; keep legacy paths like img/band/foo.jpg as-is."""
    if not img_url or not isinstance(img_url, str):
        return ''
    s = img_url.strip()
    if not s:
        return ''
    if s.startswith('http://') or s.startswith('https://'):
        idx = s.find('/files/')
        if idx != -1:
            return s[idx + len('/files/'):].split('?')[0]
        return s
    if '/files/' in s:
        return s.split('/files/')[-1].split('?')[0]
    return s


def _try_remove_uploaded_file(img_url: str) -> None:
    """Remove files/<basename> when img_url is a plain upload filename (no path)."""
    stored = _normalize_img_for_storage(img_url)
    if not stored or '/' in stored or '\\' in stored:
        return
    path = os.path.join('files', stored)
    if os.path.isfile(path):
        try:
            os.remove(path)
        except OSError:
            pass


@bandmember_bp.route('/bandmembers', methods=['GET'])
def get_all_band_members():
    band_members = BandMember.query.all()
    band_member_list = [{
        'id': member.id,
        'name': member.name,
        'img_url': member.img_url,
        'text': member.text
    } for member in band_members]
    return jsonify({'msg': 'All band members', 'data': band_member_list}), 200


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
        return jsonify({'msg': 'Band member found', 'data': member_data}), 200
    else:
        return jsonify({'msg': 'Band member not found'}), 404


@bandmember_bp.route('/bandmembers', methods=['POST'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["name", "img_url", "text"])
def create_band_member():
    data = request.get_json()
    img = _normalize_img_for_storage(data['img_url'])
    new_member = BandMember(
        name=data['name'],
        img_url=img,
        text=data.get('text'),
        created_by_user_id=int(get_jwt_identity()),
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
    return jsonify({'msg': 'BandMember created', 'data': member_data}), 200


@bandmember_bp.route('/bandmembers/<int:member_id>', methods=['PUT'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["name", "img_url", "text"])
def edit_band_member(member_id):
    member = BandMember.query.get(member_id)
    if not member:
        return jsonify({'msg': 'Band member not found'}), 404

    data = request.get_json()
    old_img = member.img_url
    member.name = data.get('name', member.name)
    member.img_url = _normalize_img_for_storage(data.get('img_url', member.img_url))
    member.text = data.get('text', member.text)
    member.modified_by_user_id = int(get_jwt_identity())

    db.session.commit()
    if old_img and old_img != member.img_url:
        _try_remove_uploaded_file(old_img)
    member_data = {
        'id': member.id,
        'name': member.name,
        'img_url': member.img_url,
        'text': member.text,
    }
    return jsonify({'msg': 'Band member updated successfully', 'data': member_data}), 200


@bandmember_bp.route('/bandmembers/<int:member_id>', methods=['DELETE'])
@jwt_required()
@scope_required(["admin"])
def delete_band_member(member_id):
    member = BandMember.query.get(member_id)
    if not member:
        return jsonify({'msg': 'Band member not found'}), 404

    img_copy = member.img_url
    db.session.delete(member)
    db.session.commit()
    _try_remove_uploaded_file(img_copy)
    return jsonify({'msg': 'Band member deleted successfully'}), 200
