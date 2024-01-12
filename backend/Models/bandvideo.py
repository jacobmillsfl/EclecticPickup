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
