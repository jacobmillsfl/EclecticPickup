from Models.database import db

class BandMember(db.Model):
    """
    A band member
    """
    __tablename__ = 'bandmember'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    img_url = db.Column(db.String(256))
    text = db.Column(db.String(128))
