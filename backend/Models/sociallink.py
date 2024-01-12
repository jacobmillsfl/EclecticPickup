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
