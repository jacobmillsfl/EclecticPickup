from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from Models.database import db
from Models.sociallink import SocialLink
from Utils.Decorators import scope_required, required_fields

sociallink_bp = Blueprint('sociallink', __name__)

@sociallink_bp.route('/sociallinks', methods=['GET'])
def get_all_social_links():
    social_links = SocialLink.query.all()
    social_link_list = [{
        'id': link.id,
        'href_url': link.href_url,
        'img_url': link.img_url,
        'text': link.text
    } for link in social_links]
    return jsonify({'message': 'All social links', 'data': social_link_list}), 200

@sociallink_bp.route('/sociallinks/<int:link_id>', methods=['GET'])
def get_social_link_by_id(link_id):
    link = SocialLink.query.get(link_id)
    if link:
        link_data = {
            'id': link.id,
            'href_url': link.href_url,
            'img_url': link.img_url,
            'text': link.text
        }
        return jsonify({'message': 'Social link found', 'data': link_data}), 200
    else:
        return jsonify({'message': 'Social link not found'}), 404

@sociallink_bp.route('/sociallinks', methods=['POST'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["href_url", "img_url", "text"])
def create_social_link():
    data = request.get_json()
    new_link = SocialLink(
        href_url=data['href_url'],
        img_url=data.get('img_url'),
        text=data.get('text')
    )
    db.session.add(new_link)
    db.session.commit()
    db.session.flush()
    link_data = {
        'id': new_link.id,
        'href_url': new_link.href_url,
        'img_url': new_link.img_url,
        'text': new_link.text
    }
    return jsonify({'message': 'SocialLink created', 'data': link_data}), 200

@sociallink_bp.route('/sociallinks/<int:link_id>', methods=['PUT'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["href_url", "img_url", "text"])
def edit_social_link(link_id):
    link = SocialLink.query.get(link_id)
    if not link:
        return jsonify({'message': 'Social link not found'}), 404

    data = request.get_json()
    link.href_url = data.get('href_url', link.href_url)
    link.img_url = data.get('img_url', link.img_url)
    link.text = data.get('text', link.text)
    
    db.session.commit()
    return jsonify({'message': 'Social link updated successfully'}), 200

@sociallink_bp.route('/sociallinks/<int:link_id>', methods=['DELETE'])
@jwt_required()
@scope_required(["admin"])
def delete_social_link(link_id):
    link = SocialLink.query.get(link_id)
    if not link:
        return jsonify({'message': 'Social link not found'}), 404

    db.session.delete(link)
    db.session.commit()
    return jsonify({'message': 'Social link deleted successfully'}), 200
