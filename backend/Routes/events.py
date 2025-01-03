from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from Utils.ConfigManager import ConfigManager
from Models.event import Event
from Models.database import db
from Utils.Decorators import scope_required, required_fields

event_bp = Blueprint('event', __name__)
config = ConfigManager.get_config()

@event_bp.route('/events', methods=['GET'])
def get_all_events():
    events = Event.query.all()
    event_list = [{
        'id': event.id,
        'date': event.date.strftime("%Y-%m-%d"),
        'time': event.time,
        'venue': event.venue,
        'address': event.address
    } for event in events]
    return jsonify({'msg': 'All events', 'data': event_list}), 200

@event_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event_by_id(event_id):
    event = Event.query.get(event_id)
    if event:
        event_data = {
            'id': event.id,
            'date': event.date.strftime("%Y-%m-%d"),
            'time': event.time,
            'venue': event.venue,
            'address': event.address
        }
        return jsonify({'msg': 'Event found', 'data': event_data}), 200
    else:
        return jsonify({'msg': 'Event not found'}), 404

@event_bp.route('/events', methods=['POST'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["date","time","venue","address"])
def create_event():
    data = request.get_json()
    new_event = Event(
        date=datetime.strptime(data['date'], "%Y-%m-%d").date(),
        time=data['time'],
        venue=data['venue'],
        address=data['address'],
        created_by_user_id=get_jwt_identity().get("id"),
    )
    db.session.add(new_event)
    db.session.commit()
    db.session.flush()
    event_data = {
        'id': new_event.id,
        'date': new_event.date.strftime("%Y-%m-%d"),
        'time': new_event.time,
        'venue': new_event.venue,
        'address': new_event.address
    }
    return jsonify({'msg': 'Event created', 'data': event_data}), 200

@event_bp.route('/events/<int:event_id>', methods=['PUT'])
@jwt_required()
@scope_required(["admin"])
@required_fields(["date","time","venue","address"])
def edit_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'msg': 'Event not found'}), 404

    data = request.get_json()
    event.date = datetime.strptime(data['date'], "%Y-%m-%d").date()
    event.time = data.get('time', event.time)
    event.venue = data.get('venue', event.venue)
    event.address = data.get('address', event.address)
    event.modified_by_user_id = get_jwt_identity().get("id")
    
    db.session.commit()
    return jsonify({'msg': 'Event updated successfully'}), 200

@event_bp.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
@scope_required(["admin"])
def delete_event(event_id):

    event = Event.query.get(event_id)
    if not event:
        return jsonify({'msg': 'Event not found'}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({'msg': 'Event deleted successfully'})
