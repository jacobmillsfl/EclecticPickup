from datetime import datetime
from Models.database import db

class BandVideo(db.Model):
    """
    A band video
    """
    __tablename__ = 'bandvideo'

    id = db.Column(db.Integer, primary_key=True)
    src = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(64))
    youtube = db.Column(db.Boolean)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    modified_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    modified_date = db.Column(db.DateTime, default=None, nullable=True, onupdate=datetime.utcnow)

    # Define the relationship with the User model
    created_by_user = db.relationship('User', back_populates='created_videos', foreign_keys=[created_by_user_id])
