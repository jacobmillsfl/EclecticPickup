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
    trackNumber = db.Column(db.Integer)
