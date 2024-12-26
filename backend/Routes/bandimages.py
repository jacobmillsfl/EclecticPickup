import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user

from Models.database import db
from Models.bandimage import BandImage
from Utils.Decorators import scope_required, required_fields

bandimage_bp = Blueprint('bandimage', __name__)

@bandimage_bp.route('/bandimages', methods=['GET'])
def get_all_band_images():
    band_images = BandImage.query.all()
    band_image_list = [{
        'id': image.id,
        'filename': image.filename,
        'caption': image.caption
    } for image in band_images]
    return jsonify({'msg': 'All band images', 'data': band_image_list}), 200

@bandimage_bp.route('/bandimages/<int:image_id>', methods=['GET'])
def get_band_image_by_id(image_id):
    image = BandImage.query.get(image_id)
    if image:
        image_data = {
            'id': image.id,
            'filename': image.filename,
            'caption': image.caption
        }
        return jsonify({'msg': 'Band image found', 'data': image_data}), 200
    else:
        return jsonify({'msg': 'Band image not found'}), 404

@bandimage_bp.route('/bandimages', methods=['POST'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["filename", "caption"])
def create_band_image():
    data = request.get_json()
    new_image = BandImage(
        filename=data['filename'],
        caption=data.get('caption'),
        created_by_user_id=current_user.get("id"),
    )
    db.session.add(new_image)
    db.session.commit()
    db.session.flush()
    image_data = {
        'id': new_image.id,
        'filename': new_image.filename,
        'caption': new_image.caption,
    }
    return jsonify({'msg': 'BandImage created', 'data': image_data}), 200

@bandimage_bp.route('/bandimages/<int:image_id>', methods=['PUT'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["caption"])
def edit_band_image(image_id):
    image = BandImage.query.get(image_id)
    if not image:
        return jsonify({'msg': 'Band image not found'}), 404

    data = request.get_json()
    image.caption = data.get('caption', image.caption)
    image.modified_by_user_id = current_user.get("id")
    
    db.session.commit()
    return jsonify({'msg': 'Band image updated successfully'}), 200

@bandimage_bp.route('/bandimages/<int:image_id>', methods=['DELETE'])
@jwt_required()
@scope_required(["admin"])
def delete_band_image(image_id):
    image = BandImage.query.get(image_id)
    if not image:
        return jsonify({'msg': 'Band image not found'}), 404

    db.session.delete(image)
    db.session.commit()

    try:
        if os.path.exists(image.filename):
            os.remove(image.filename)
            return jsonify({'msg': 'Band image deleted successfully'}), 200
        else:
            return jsonify({"msg": f"Unable to remove image {image.filename} not found"}), 404
    except Exception as e:
        return jsonify({"msg": f"Error removing file: {str(e)}"}), 500
