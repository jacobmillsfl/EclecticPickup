from datetime import datetime
from Models.database import db

class Event(db.Model):
    """
    An upcoming event.
    """
    __tablename__ = 'event'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(32), nullable=False)
    venue = db.Column(db.String(256), nullable=False)
    address = db.Column(db.String(256), nullable=False)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    modified_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    modified_date = db.Column(db.DateTime, default=None, nullable=True, onupdate=datetime.utcnow)

    # Define the relationship with the User model
    created_by_user = db.relationship('User', back_populates='created_events', foreign_keys=[created_by_user_id])
