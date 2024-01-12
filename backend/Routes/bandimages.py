from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from Models.database import db
from Models.bandimage import BandImage
from Utils.Decorators import scope_required, required_fields

bandimage_bp = Blueprint('bandimage', __name__)

@bandimage_bp.route('/bandimages', methods=['GET'])
def get_all_band_images():
    band_images = BandImage.query.all()
    band_image_list = [{
        'id': image.id,
        'src': image.src,
        'description': image.description
    } for image in band_images]
    return jsonify({'message': 'All band images', 'data': band_image_list}), 200

@bandimage_bp.route('/bandimages/<int:image_id>', methods=['GET'])
def get_band_image_by_id(image_id):
    image = BandImage.query.get(image_id)
    if image:
        image_data = {
            'id': image.id,
            'src': image.src,
            'description': image.description
        }
        return jsonify({'message': 'Band image found', 'data': image_data}), 200
    else:
        return jsonify({'message': 'Band image not found'}), 404

@bandimage_bp.route('/bandimages', methods=['POST'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["src", "description"])
def create_band_image():
    data = request.get_json()
    new_image = BandImage(
        src=data['src'],
        description=data.get('description')
    )
    db.session.add(new_image)
    db.session.commit()
    db.session.flush()
    image_data = {
        'id': new_image.id,
        'src': new_image.src,
        'description': new_image.description
    }
    return jsonify({'message': 'BandImage created', 'data': image_data}), 200

@bandimage_bp.route('/bandimages/<int:image_id>', methods=['PUT'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["src", "description"])
def edit_band_image(image_id):
    image = BandImage.query.get(image_id)
    if not image:
        return jsonify({'message': 'Band image not found'}), 404

    data = request.get_json()
    image.src = data.get('src', image.src)
    image.description = data.get('description', image.description)
    
    db.session.commit()
    return jsonify({'message': 'Band image updated successfully'}), 200

@bandimage_bp.route('/bandimages/<int:image_id>', methods=['DELETE'])
@jwt_required()
@scope_required(["admin"])
def delete_band_image(image_id):
    image = BandImage.query.get(image_id)
    if not image:
        return jsonify({'message': 'Band image not found'}), 404

    db.session.delete(image)
    db.session.commit()
    return jsonify({'message': 'Band image deleted successfully'}), 200
