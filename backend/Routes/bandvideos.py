from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
import validators

from Models.database import db
from Models.bandvideo import BandVideo
from Utils.Decorators import scope_required, required_fields

bandvideo_bp = Blueprint('bandvideo', __name__)

@bandvideo_bp.route('/bandvideos', methods=['GET'])
def get_all_band_videos():
    band_videos = BandVideo.query.all()
    band_video_list = [{
        'id': video.id,
        'src': video.src,
        'description': video.description,
        'youtube': video.youtube
    } for video in band_videos]
    return jsonify({'msg': 'All band videos', 'data': band_video_list}), 200

@bandvideo_bp.route('/bandvideos/<int:video_id>', methods=['GET'])
def get_band_video_by_id(video_id):
    video = BandVideo.query.get(video_id)
    if video:
        video_data = {
            'id': video.id,
            'src': video.src,
            'description': video.description,
            'youtube': video.youtube
        }
        return jsonify({'msg': 'Band video found', 'data': video_data}), 200
    else:
        return jsonify({'msg': 'Band video not found'}), 404

@bandvideo_bp.route('/bandvideos', methods=['POST'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["src","description","youtube"])
def create_band_video():
    data = request.get_json()

    # Don't allow invalid URLs for YouTube videos
    if data['youtube'] is True and not validators.url(data['src']):
        return jsonify({'status': 'error', 'msg': 'Invalid src URL'})

    new_video = BandVideo(
        src=data['src'],
        description=data.get('description'),
        youtube=data.get('youtube', False),
        created_by_user_id=current_user.get("id"),
    )
    db.session.add(new_video)
    db.session.commit()
    db.session.flush()
    video_data = {
        'id': new_video.id,
        'src': new_video.src,
        'description': new_video.description,
        'youtube': new_video.youtube
    }
    return jsonify({'msg': 'BandVideo created', 'data': video_data}), 200

@bandvideo_bp.route('/bandvideos/<int:video_id>', methods=['PUT'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["src","description","youtube"])
def edit_band_video(video_id):
    video = BandVideo.query.get(video_id)
    if not video:
        return jsonify({'msg': 'Band video not found'}), 404

    data = request.get_json()
    video.src = data.get('src', video.src)
    video.description = data.get('description', video.description)
    video.youtube = data.get('youtube', video.youtube)
    video.modified_by_user_id = current_user.get("id")
    
    db.session.commit()
    return jsonify({'msg': 'Band video updated successfully'}), 200

@bandvideo_bp.route('/bandvideos/<int:video_id>', methods=['DELETE'])
@jwt_required()
@scope_required(["admin"])
def delete_band_video(video_id):
    video = BandVideo.query.get(video_id)
    if not video:
        return jsonify({'msg': 'Band video not found'}), 404

    db.session.delete(video)
    db.session.commit()
    return jsonify({'msg': 'Band video deleted successfully'}), 200
