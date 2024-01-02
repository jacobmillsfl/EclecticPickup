from flask import Blueprint, Flask, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from Utils.ConfigManager import ConfigManager
from Models.event import Event
from Models.database import db

event_bp = Blueprint('event', __name__)
config = ConfigManager.get_config()

@event_bp.route('/events', methods=['GET'])
def get_all_events():
    events = Event.query.all()
    event_list = [{
        'id': event.id,
        'date': event.date,
        'time': event.time,
        'venue': event.venue,
        'address': event.address
    } for event in events]
    return jsonify({'message': 'All events', 'data': event_list}), 200

@event_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event_by_id(event_id):
    event = Event.query.get(event_id)
    if event:
        event_data = {
            'id': event.id,
            'date': event.date,
            'time': event.time,
            'venue': event.venue,
            'address': event.address
        }
        return jsonify({'message': 'Event found', 'data': event_data}), 200
    else:
        return jsonify({'message': 'Event not found'}), 404

@event_bp.route('/events', methods=['POST'])
@jwt_required()  # Requires a valid JWT token
def create_event():
    if 'admin' not in get_jwt_identity().get('scope', []):
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    new_event = Event(
        date=data['date'],
        time=data['time'],
        venue=data['venue'],
        address=data['address']
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'message': 'Event created successfully'}), 200

@event_bp.route('/events/<int:event_id>', methods=['PUT'])
@jwt_required()  # Requires a valid JWT token
def edit_event(event_id):
    if 'admin' not in get_jwt_identity().get('scope', []):
        return jsonify({'message': 'Unauthorized'}), 403

    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    data = request.get_json()
    event.date = data.get('date', event.date)
    event.time = data.get('time', event.time)
    event.venue = data.get('venue', event.venue)
    event.address = data.get('address', event.address)
    
    db.session.commit()
    return jsonify({'message': 'Event updated successfully'}), 200

@event_bp.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required()  # Requires a valid JWT token
def delete_event(event_id):
    if 'admin' not in get_jwt_identity().get('scope', []):
        return jsonify({'message': 'Unauthorized'}), 403

    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'})
