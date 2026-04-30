from urllib.parse import urlparse

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
import validators

from Models.database import db
from Models.bandvideo import BandVideo
from Utils.Decorators import scope_required, required_fields

bandvideo_bp = Blueprint('bandvideo', __name__)


def _is_youtube_url(url: str) -> bool:
    if not url or not isinstance(url, str):
        return False
    try:
        parsed = urlparse(url.strip())
        if parsed.scheme not in ("http", "https"):
            return False
        host = (parsed.netloc or "").lower()
        if ":" in host:
            host = host.split(":")[0]
        if host.startswith("www."):
            host = host[4:]
        return host == "youtu.be" or host == "youtube.com" or host.endswith(".youtube.com")
    except Exception:
        return False

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

    if not data.get('youtube'):
        return jsonify({'msg': 'Only YouTube videos are supported'}), 400
    if not validators.url(data['src']):
        return jsonify({'msg': 'Invalid URL'}), 400
    if not _is_youtube_url(data['src']):
        return jsonify({'msg': 'URL must be a YouTube link (youtube.com or youtu.be)'}), 400

    new_video = BandVideo(
        src=data['src'].strip(),
        description=data.get('description'),
        youtube=True,
        created_by_user_id=int(get_jwt_identity()),
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
    if not data.get('youtube'):
        return jsonify({'msg': 'Only YouTube videos are supported'}), 400
    src = data.get('src', video.src)
    if not validators.url(src):
        return jsonify({'msg': 'Invalid URL'}), 400
    if not _is_youtube_url(src):
        return jsonify({'msg': 'URL must be a YouTube link (youtube.com or youtu.be)'}), 400

    video.src = src.strip()
    video.description = data.get('description', video.description)
    video.youtube = True
    video.modified_by_user_id = int(get_jwt_identity())

    db.session.commit()
    video_data = {
        'id': video.id,
        'src': video.src,
        'description': video.description,
        'youtube': video.youtube,
    }
    return jsonify({'msg': 'Band video updated successfully', 'data': video_data}), 200

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
