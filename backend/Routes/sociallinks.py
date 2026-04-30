from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from Models.database import db
from Models.sociallink import SocialLink
from Utils.Decorators import scope_required

sociallink_bp = Blueprint('sociallink', __name__)

# Admin picks one of these; icon path and footer category are derived server-side.
_ALLOWED_PLATFORMS = frozenset({
    'facebook', 'instagram', 'youtube', 'bandcamp', 'email',
    # Legacy seeds / older admin data
    'spotify', 'twitter',
})

# category for public site grouping, img under frontend public/
_PLATFORM_PRESETS = {
    'facebook': ('social_media', '/img/socials/facebook.png'),
    'instagram': ('social_media', '/img/socials/instagram.jpg'),
    'youtube': ('streaming', '/img/socials/youtube.jpg'),
    'bandcamp': ('merch', '/img/socials/bandcamp.png'),
    'email': ('email', '/img/socials/email.png'),
    'spotify': ('streaming', '/img/socials/spotify.png'),
    'twitter': ('social_media', '/img/socials/twitter.png'),
}

_DEFAULT_HREF = {
    'facebook': 'https://www.facebook.com/',
    'instagram': 'https://www.instagram.com/',
    'youtube': 'https://www.youtube.com/',
    'bandcamp': 'https://bandcamp.com/',
    'email': 'mailto:',
    'spotify': 'https://open.spotify.com/',
    'twitter': 'https://twitter.com/',
}

_PUT_ALLOWED_KEYS = frozenset({'href_url', 'enabled', 'text', 'platform'})

# POST (new row) only allows the five primary platforms; PUT may also set legacy keys.
_CREATE_PLATFORMS = frozenset({
    'facebook', 'instagram', 'youtube', 'bandcamp', 'email',
})


def _serialize(link: SocialLink) -> dict:
    return {
        'id': link.id,
        'href_url': link.href_url,
        'img_url': link.img_url,
        'text': link.text,
        'category': link.category,
        'platform': link.platform,
        'enabled': bool(link.enabled),
    }


def _apply_platform(link: SocialLink, platform: str) -> None:
    if platform not in _ALLOWED_PLATFORMS:
        raise ValueError('invalid platform')
    category, img_url = _PLATFORM_PRESETS[platform]
    link.platform = platform
    link.category = category
    link.img_url = img_url


@sociallink_bp.route('/sociallinks', methods=['GET'])
def get_all_social_links():
    social_links = SocialLink.query.order_by(SocialLink.id).all()
    social_link_list = [_serialize(link) for link in social_links]
    return jsonify({'msg': 'All social links', 'data': social_link_list}), 200


@sociallink_bp.route('/sociallinks/<int:link_id>', methods=['GET'])
def get_social_link_by_id(link_id):
    link = SocialLink.query.get(link_id)
    if link:
        return jsonify({'msg': 'Social link found', 'data': _serialize(link)}), 200
    return jsonify({'msg': 'Social link not found'}), 404


@sociallink_bp.route('/sociallinks', methods=['POST'])
@jwt_required()
@scope_required(["admin"])
def create_social_link():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({'msg': 'Expected a JSON object'}), 400

    platform = data.get('platform')
    text = data.get('text')
    if platform not in _CREATE_PLATFORMS:
        return jsonify({
            'msg': 'platform must be one of: facebook, instagram, youtube, bandcamp, email',
        }), 400
    if not isinstance(text, str) or not text.strip():
        return jsonify({'msg': 'text is required'}), 400

    enabled = bool(data.get('enabled', True))
    href = data.get('href_url')
    if href is None or (isinstance(href, str) and not href.strip()):
        href = _DEFAULT_HREF[platform]
    elif isinstance(href, str):
        href = href.strip()
    else:
        return jsonify({'msg': 'href_url must be a string'}), 400

    new_link = SocialLink(
        href_url=href,
        text=text.strip(),
        enabled=enabled,
        created_by_user_id=int(get_jwt_identity()),
    )
    try:
        _apply_platform(new_link, platform)
    except ValueError:
        return jsonify({'msg': 'Invalid platform'}), 400

    db.session.add(new_link)
    db.session.commit()
    return jsonify({'msg': 'SocialLink created', 'data': _serialize(new_link)}), 200


@sociallink_bp.route('/sociallinks/<int:link_id>', methods=['PUT'])
@jwt_required()
@scope_required(["admin"])
def edit_social_link(link_id):
    link = SocialLink.query.get(link_id)
    if not link:
        return jsonify({'msg': 'Social link not found'}), 404

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({'msg': 'Expected a JSON object'}), 400
    if set(data.keys()) - _PUT_ALLOWED_KEYS:
        return jsonify({
            'msg': 'Only platform, text, href_url, and enabled may be updated; icon path is set from platform.',
        }), 400

    if 'platform' in data:
        p = data['platform']
        if p not in _ALLOWED_PLATFORMS:
            return jsonify({'msg': 'Invalid platform'}), 400
        try:
            _apply_platform(link, p)
        except ValueError:
            return jsonify({'msg': 'Invalid platform'}), 400

    if 'text' in data:
        t = data['text']
        if not isinstance(t, str) or not t.strip():
            return jsonify({'msg': 'text cannot be empty'}), 400
        link.text = t.strip()

    if 'href_url' in data:
        h = data['href_url']
        if not isinstance(h, str):
            return jsonify({'msg': 'href_url must be a string'}), 400
        stripped = h.strip()
        if stripped:
            link.href_url = stripped
        elif link.platform in _DEFAULT_HREF:
            link.href_url = _DEFAULT_HREF[link.platform]
        else:
            link.href_url = ''

    if 'enabled' in data:
        link.enabled = bool(data['enabled'])

    link.modified_by_user_id = int(get_jwt_identity())
    db.session.commit()
    return jsonify({'msg': 'Social link updated successfully', 'data': _serialize(link)}), 200


@sociallink_bp.route('/sociallinks/<int:link_id>', methods=['DELETE'])
@jwt_required()
@scope_required(["admin"])
def delete_social_link(link_id):
    link = SocialLink.query.get(link_id)
    if not link:
        return jsonify({'msg': 'Social link not found'}), 404

    db.session.delete(link)
    db.session.commit()
    return jsonify({'msg': 'Social link deleted successfully'}), 200
