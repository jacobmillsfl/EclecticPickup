from datetime import datetime
from Models.database import db

class Settings(db.Model):
    """
    An application setting.
    """
    __tablename__ = 'settings'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), unique=True, nullable=False)
    value = db.Column(db.String(256), unique=False, nullable=False)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    modified_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    modified_date = db.Column(db.DateTime, default=None, nullable=True, onupdate=datetime.utcnow)

    # Define the relationship with the User model
    created_by_user = db.relationship('User', back_populates='created_settings', foreign_keys=[created_by_user_id])
