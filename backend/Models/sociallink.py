from datetime import datetime
from Models.database import db

class SocialLink(db.Model):
    """
    A social link
    """
    __tablename__ = 'sociallink'

    id = db.Column(db.Integer, primary_key=True)
    href_url = db.Column(db.String(256))
    img_url = db.Column(db.String(256))
    text = db.Column(db.String(64))
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    modified_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    modified_date = db.Column(db.DateTime, default=None, nullable=True, onupdate=datetime.utcnow)

    # Define the relationship with the User model
    created_by_user = db.relationship('User', back_populates='created_socials', foreign_keys=[created_by_user_id])
