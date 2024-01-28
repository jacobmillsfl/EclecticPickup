from datetime import datetime
from Models.database import db

class User(db.Model):
    """
    An application user.
    """
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), unique=True, nullable=False)
    email = db.Column(db.String(256), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)
    active = db.Column(db.Boolean, default=False)
    scope = db.Column(db.String(32))
    about = db.Column(db.String(512))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)

    # Define the relationship with the BandImage model
    created_images = db.relationship('BandImage', back_populates='created_by_user', primaryjoin="User.id == BandImage.created_by_user_id")
    created_members = db.relationship('BandMember', back_populates='created_by_user', primaryjoin="User.id == BandMember.created_by_user_id")
    created_videos = db.relationship('BandVideo', back_populates='created_by_user', primaryjoin="User.id == BandVideo.created_by_user_id")
    created_events = db.relationship('Event', back_populates='created_by_user', primaryjoin="User.id == Event.created_by_user_id")
    created_settings = db.relationship('Settings', back_populates='created_by_user', primaryjoin="User.id == Settings.created_by_user_id")
    created_socials = db.relationship('SocialLink', back_populates='created_by_user', primaryjoin="User.id == SocialLink.created_by_user_id")
    created_songs = db.relationship('Song', back_populates='created_by_user', primaryjoin="User.id == Song.created_by_user_id")