from datetime import datetime
from Models.database import db

class Song(db.Model):
    """
    A song
    """
    __tablename__ = 'song'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    artist = db.Column(db.String(128))
    album = db.Column(db.String(128))
    url = db.Column(db.String(256))
    art_url = db.Column(db.String(256))
    track_number = db.Column(db.Integer)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    modified_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    modified_date = db.Column(db.DateTime, default=None, nullable=True, onupdate=datetime.utcnow)

    # Define the relationship with the User model
    created_by_user = db.relationship('User', back_populates='created_songs', foreign_keys=[created_by_user_id])
