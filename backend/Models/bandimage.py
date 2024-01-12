from Models.database import db

class BandImage(db.Model):
    """
    A band image
    """
    __tablename__ = 'bandimage'

    id = db.Column(db.Integer, primary_key=True)
    src = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(64))
